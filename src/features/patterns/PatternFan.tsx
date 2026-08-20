import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import { PatternCard } from '../../components/composed/PatternCard';
import { ExpandedCard } from './ExpandedCard';
import {
  cardHand,
  fanStep,
  slotDelta,
  slotHidden,
  slotOpacity,
  slotShape,
} from './fanGeometry';
import { duration } from '../../tokens';
import type { Pattern } from '../../data/types';
import styles from './PatternFan.module.css';

/* below this the opened card's two columns stack — it must match the
   breakpoint in ExpandedCard.module.css, because the fit plan has to
   know which layout it is budgeting for */
const STACK_WIDTH = 860;

/** the box the opened card grows into, in viewport coordinates */
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const ms = (token: string) => Number.parseFloat(token);

/** where an opened card ends up: centred, capped, and inside the gutter */
function expandedRect(): Rect {
  const gutter = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--aera-layout-gutter'),
  ) || 26;
  const width = Math.min(1040, window.innerWidth - gutter * 2);
  /* The popup is capped by the SCREEN it opened on, not by a constant:
     a fixed 640 was taller than the viewport on a short laptop, which
     is what pushed the history off the bottom edge.

     A stacked popup is allowed to be taller, because stacking puts the
     reading ABOVE the chart instead of beside it — holding it to the
     two-column height would cost it history rows it has the screen
     space for. */
  const stacked = width < STACK_WIDTH;
  const cap = stacked ? 900 : 640;
  const height = Math.min(cap, window.innerHeight - gutter * 2);
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
}

const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/** plant the panel on a rect. Written straight to the element rather
 *  than through React: the whole point of the transition is that the
 *  browser sees one box replaced by another between two frames, and a
 *  render pass in the middle of that is a render pass too many. */
function place(el: HTMLElement, r: Rect, radius?: string) {
  el.style.left = `${r.left}px`;
  el.style.top = `${r.top}px`;
  el.style.width = `${r.width}px`;
  el.style.height = `${r.height}px`;
  if (radius !== undefined) el.style.borderRadius = radius;
}

export interface PatternFanProps {
  patterns: Pattern[];
  /** 0-based position in the set — which card is active */
  position: number;
  onPosition: (next: number) => void;
  openIndex: number | null;
  onOpen: (index: number | null) => void;
  hint?: string;
  className?: string;
}

/** The fanned hand. Every pattern is in the set and eight of them are
 *  in the window; the active card stands in the middle of the stage at
 *  every point in the scroll and the hand flows leftward through it.
 *  There is no ruler above it and no counter anywhere: the hand is the
 *  readout. Vertical scroll only. */
export function PatternFan({
  patterns,
  position,
  onPosition,
  openIndex,
  onOpen,
  hint = 'scroll to move through the set · click a card to open it',
  className,
}: PatternFanProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(240);
  /* the box the opened popup has to stand inside. It is state rather
     than a read at render time so the fit plan re-runs on resize. */
  const [openBox, setOpenBox] = useState(() =>
    typeof window === 'undefined' ? { width: 1040, height: 640 } : expandedRect(),
  );
  const stage = useRef<HTMLDivElement>(null);
  const slots = useRef(new Map<number, HTMLElement>());
  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  /* the step is a share of the card width, so the overlap stays heavy
     at every viewport */
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const slot = el.querySelector<HTMLElement>(`.${styles.slot}`);
      if (!slot) return;
      const w = slot.offsetWidth;
      setCardWidth(w);
      const r = expandedRect();
      setOpenBox({ width: r.width, height: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    /* the stage is full-width, so it does not resize when only the
       viewport HEIGHT changes — and the popup's budget depends on it */
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* ---- opening: the card's own geometry, then the panel's ---------
     The card in the fan is measured where it stands, the panel is
     planted on exactly that rect before the browser paints, and only
     then is it given the expanded rect to travel to. Nothing scales;
     five values change and the transition does the rest. */
  useLayoutEffect(() => {
    const el = panel.current;
    const source = openIndex == null ? null : slots.current.get(openIndex);
    if (!el || !source) return;

    closing.current = false;
    const radius =
      getComputedStyle(document.documentElement).getPropertyValue('--aera-radius-card').trim() ||
      '28px';
    /* frame one: the panel IS the card, exactly where the card is */
    el.style.transition = 'none';
    place(el, rectOf(source), radius);
    /* frame two: the same element, given somewhere else to be */
    const raf = requestAnimationFrame(() => {
      el.style.transition = '';
      if (!closing.current) place(el, expandedRect(), radius);
    });
    return () => cancelAnimationFrame(raf);
  }, [openIndex]);

  /* ---- dismissal: the same five values, travelling back ---------- */
  const requestClose = useCallback(() => {
    if (openIndex == null || closing.current) return;
    closing.current = true;
    const el = panel.current;
    const source = slots.current.get(openIndex);
    /* the same five values, travelling back to the card's own slot */
    if (el && source) place(el, rectOf(source));
    /* and the parent only hears about it once the card is home again */
    window.setTimeout(() => {
      closing.current = false;
      onOpen(null);
    }, ms(duration.expand));
  }, [openIndex, onOpen]);

  /* escape, or a press anywhere outside the opened card, closes it */
  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node)) requestClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [openIndex, requestClose]);

  const open = openIndex != null ? patterns[openIndex] : null;
  const step = fanStep(cardWidth);

  return (
    <div className={cx(styles.wrap, className)}>
      <div
        ref={stage}
        className={styles.stage}
        /* the step, published as one property. Everything the fan does
           horizontally is this number times a card's slot index —
           there is no other spacing input. */
        style={{ '--fan-gap': `${step.toFixed(1)}px` } as CSSProperties}
      >
        {patterns.map((pattern, i) => {
          const d = slotDelta(i, position);
          const shape = slotShape(d);
          const hand = cardHand(i);
          const hidden = slotHidden(d);
          /* the card that is currently flying is not also in the fan */
          const flying = openIndex === i;

          return (
            <div
              key={pattern.id}
              ref={(el) => {
                if (el) slots.current.set(i, el);
                else slots.current.delete(i);
              }}
              className={cx(styles.slot, !open && hover === i && styles.slotHover)}
              style={
                {
                  '--x': `calc(var(--fan-gap) * ${d.toFixed(3)})`,
                  '--y': `${(shape.y + hand.dy).toFixed(1)}px`,
                  '--rot': `${(shape.rot + hand.rot).toFixed(2)}deg`,
                  '--sc': shape.scale.toFixed(4),
                  '--op': flying ? 0 : slotOpacity(d),
                  /* Cards outside the window are taken OUT OF LAYOUT,
                     not just hidden. Now that the stage no longer
                     clips, an absolutely-positioned slot sitting off
                     to one side still counted toward the document's
                     scroll width — so the twelve-card set gave the
                     page a horizontal scrollbar even though only five
                     of them were visible. */
                  display: hidden ? 'none' : undefined,
                  /* DEPTH RUNS LEFT TO RIGHT: every card sits above
                     the one to its left, so the rightmost is
                     front-most and active. The old model stacked
                     toward a centre, which is the opposite shape. */
                  zIndex: hover === i ? 700 : 600 + d,
                } as CSSProperties
              }
              onPointerEnter={() => !open && setHover(i)}
              onPointerLeave={() => setHover((h) => (h === i ? null : h))}
            >
              <PatternCard
                pattern={pattern}
                hovered={!open && hover === i}
                showTag={!open}
                onClick={() => {
                  onPosition(i);
                  onOpen(i);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* the hint is pinned to the middle of the viewport and stays
          there however far the hand has travelled */}
      <div className={styles.hintRow}>
        <Label className={styles.hint}>
          {open ? 'click anywhere outside the card, or press escape, to close it' : hint}
        </Label>
      </div>

      {/* The page dims behind the focused card and the card grows out
          of the fan into the middle of the screen — the same element,
          travelling on its own left, top, width, height and corner.
          Both are painted at the document root, so no ancestor's
          transform can turn their fixed positioning into something
          else. The siblings stay exactly where they were, under the
          dim. */}
      {open
        ? createPortal(
            <>
              <div className={styles.dim} aria-hidden="true" />
              <div ref={panel} className={styles.flight}>
                <ExpandedCard
                  pattern={open}
                  onDismiss={requestClose}
                  bare
                  maxHeight={openBox.height}
                  maxWidth={openBox.width}
                  stacked={openBox.width < STACK_WIDTH}
                />
              </div>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
