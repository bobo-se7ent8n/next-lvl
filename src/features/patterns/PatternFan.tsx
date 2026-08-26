import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import { PatternCard } from '../../components/composed/PatternCard';
import { EnterContext } from '../../lib/enterContext';
import { ExpandedCard } from './ExpandedCard';
import {
  EASE_FACTOR,
  SETTLE_EPSILON,
  WHEEL_PER_CARD,
  clampIndex,
  fanStep,
  slotShape,
} from './fanGeometry';
import { duration } from '../../tokens';
import type { Pattern } from '../../data/types';
import styles from './PatternFan.module.css';

/* below this the opened card's two columns stack — it must match the
   breakpoint in ExpandedCard.module.css, because the fit plan has to
   know which layout it is budgeting for */
const STACK_WIDTH = 720;

/* ---- THE OPENED PANEL'S BOX, all four numbers the prototype's ----
   It is NOT centred in the viewport: it hangs under the headline, so
   the page it came from stays legible above it. And it is small —
   760 at the very most, where this used to open at 1040 and cover
   most of the screen. */
/** the widest the panel ever gets */
const PANEL_MAX_W = 760;
/** and the gutter it keeps either side at narrow widths */
const PANEL_GUTTER = 40;
/** the gap between the headline's baseline box and the panel's top */
const PANEL_HEAD_GAP = 22;
/** the least it will ever sit from the top of the window */
const PANEL_MIN_TOP = 20;
/** what it leaves below itself */
const PANEL_FOOT = 84;
/** the panel's height floor and ceiling */
const PANEL_MIN_H = 340;
const PANEL_MAX_H = 640;

/** the box the opened card grows into, in viewport coordinates */
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const ms = (token: string) => Number.parseFloat(token);

/** how far a touch drag travels relative to the finger */
const TOUCH_GAIN = 1.4;

/**
 * Where an opened card ends up.
 *
 * ANCHORED UNDER THE HEADLINE, not centred in the window. The screen
 * it opened from is still there and still readable above it, which is
 * the entire reason there is no scrim: a panel that covers the middle
 * of the page needs something to separate it from what it covers, and
 * a panel that hangs politely under the heading does not.
 *
 * `head` is the page header the fan lives under. Without one the top
 * falls back to the prototype's own default.
 */
function expandedRect(head: Element | null): Rect {
  const headBottom = head ? head.getBoundingClientRect().bottom : 120;
  const width = Math.min(PANEL_MAX_W, window.innerWidth - PANEL_GUTTER);
  const top = Math.max(PANEL_MIN_TOP, headBottom + PANEL_HEAD_GAP);
  const height = Math.max(
    PANEL_MIN_H,
    Math.min(PANEL_MAX_H, window.innerHeight - top - PANEL_FOOT),
  );
  return { left: (window.innerWidth - width) / 2, top, width, height };
}

const rectOf = (el: Element): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/** plant the panel on a rect. Written straight to the element rather
 *  than through React: the whole point of the transition is that the
 *  browser sees one box replaced by another between two frames, and a
 *  render pass in the middle of that is a render pass too many. */
function place(el: HTMLElement, r: Rect, radius: string) {
  el.style.left = `${r.left}px`;
  el.style.top = `${r.top}px`;
  el.style.width = `${r.width}px`;
  el.style.height = `${r.height}px`;
  el.style.borderRadius = radius;
}

/** the page header this fan sits under — the panel hangs off its
 *  bottom edge, so the screen it opened from stays readable */
function headlineOf(el: Element | null): Element | null {
  return el?.closest('section')?.querySelector('header') ?? null;
}

const tokenValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export interface PatternFanProps {
  patterns: Pattern[];
  /** which card the hand opens on. Read once, on mount — after that
   *  the hand owns its own position and React is not told about it. */
  start?: number;
  openIndex: number | null;
  onOpen: (index: number | null) => void;
  hint?: string;
  className?: string;
}

/**
 * THE FANNED HAND.
 *
 * SCROLL DOES NOT MOVE THE HAND. Scroll moves a TARGET, and a
 * requestAnimationFrame loop then eases the hand's actual position
 * toward that target by a fixed share of the remaining distance on
 * every frame. That exponential decay is the entire reason the thing
 * feels smooth — writing the scroll delta straight onto the position,
 * which is what this used to do, gives you the wheel's own cadence
 * back as stutter.
 *
 * BOTH VALUES LIVE IN REFS. React re-renders exactly never while the
 * hand is moving: the loop writes custom properties onto the slot
 * elements itself. The only React state in here is which card is
 * hovered and which is open, and both of those are paced by the user
 * rather than by the frame clock.
 *
 * The card the hand is on stands in the middle of the stage at every
 * point in the scroll, and the set flows through it. There is no
 * ruler above it and no counter anywhere: the hand is the readout.
 */
export function PatternFan({
  patterns,
  start = 0,
  openIndex,
  onOpen,
  hint = 'scroll to move through the set · click a card to open it',
  className,
}: PatternFanProps) {
  const stage = useRef<HTMLDivElement>(null);
  /* the placement layer, one per card */
  const slots = useRef<Array<HTMLDivElement | null>>([]);
  /* and the card layer inside it — this is what the flight measures,
     because this is the box you can actually see */
  const cards = useRef<Array<HTMLDivElement | null>>([]);

  /* THE HAND, in card-index space. Floats, and refs: the hand moves
     continuously and it does not snap from card to card. */
  const prog = useRef(start);
  const target = useRef(start);
  const raf = useRef(0);
  const step = useRef(0);

  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const openRef = useRef<number | null>(null);

  const [hover, setHover] = useState<number | null>(null);
  /* the box the opened popup has to stand inside. State rather than a
     read at render time so the fit plan re-runs on resize. */
  const [openBox, setOpenBox] = useState(() =>
    typeof window === 'undefined'
      ? { width: PANEL_MAX_W, height: PANEL_MAX_H }
      : expandedRect(null),
  );
  /* THE LOAD-IN. Changing this re-scopes the enter key inside the
     panel, which is what makes its numbers count up, its bars grow
     and its line draw itself. It is set one `recalc` after the flight
     starts, so the box is already travelling when they begin. */
  const [recalcKey, setRecalcKey] = useState(0);

  const total = patterns.length;

  useEffect(() => {
    openRef.current = openIndex;
  }, [openIndex]);

  /* ---- THE LAYOUT PASS -------------------------------------------
     Reads refs only, touches no state, and writes straight to the
     DOM. It runs on every frame the loop is alive, so there is
     nothing in here that allocates or hashes. */
  const layout = useCallback(() => {
    const p = prog.current;
    const s = step.current;
    for (let i = 0; i < slots.current.length; i += 1) {
      const el = slots.current[i];
      if (!el) continue;
      const shape = slotShape(i, i - p, s);
      el.style.setProperty('--x', `${shape.x.toFixed(1)}px`);
      el.style.setProperty('--y', `${shape.y.toFixed(1)}px`);
      el.style.setProperty('--rot', `${shape.rot.toFixed(2)}deg`);
      el.style.setProperty('--sc', shape.sc.toFixed(4));
      el.style.opacity = String(shape.op);
      el.style.visibility = shape.op ? 'visible' : 'hidden';
      el.style.zIndex = String(shape.z);
    }
  }, []);

  /* ---- THE SMOOTHING LOOP ----------------------------------------
     Self-cancelling: it stops the moment the hand arrives and starts
     again on the next input. It must never run unconditionally — a
     rAF loop that is always alive is a rAF loop that is always
     costing something. */
  const tick = useCallback(() => {
    raf.current = 0;
    const d = target.current - prog.current;
    if (Math.abs(d) < SETTLE_EPSILON) {
      prog.current = target.current;
      layout();
      return;
    }
    prog.current += d * EASE_FACTOR;
    layout();
    raf.current = requestAnimationFrame(tick);
  }, [layout]);

  const fanTo = useCallback(
    (v: number, instant?: boolean) => {
      target.current = clampIndex(v, total);
      if (instant) {
        prog.current = target.current;
        layout();
        return;
      }
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    },
    [total, layout, tick],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  /* ---- the step, and the popup's budget -------------------------- */
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => {
      const slot = slots.current.find(Boolean);
      if (slot) step.current = fanStep(slot.offsetWidth);
      const r = expandedRect(headlineOf(stage.current));
      setOpenBox({ width: r.width, height: r.height });
      layout();
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
  }, [layout]);

  /* ---- the wheel ------------------------------------------------- */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      /* while a card is open the wheel is swallowed entirely — the
         page must not scroll behind a detail view either */
      if (openRef.current != null) {
        e.preventDefault();
        return;
      }
      const delta =
        e.deltaMode === 1
          ? e.deltaY * 16
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY;
      const next = clampIndex(target.current + delta / WHEEL_PER_CARD, total);
      if (next === target.current) return;
      fanTo(next);
      e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [fanTo, total]);

  /* ---- the arrow keys -------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openRef.current != null) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        fanTo(Math.round(target.current) + 1);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        fanTo(Math.round(target.current) - 1);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fanTo]);

  /* ---- touch drives the same target ------------------------------ */
  useEffect(() => {
    let last: number | null = null;
    const onStart = (e: TouchEvent) => {
      last = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (last == null || openRef.current != null) return;
      const y = e.touches[0].clientY;
      const delta = (last - y) * TOUCH_GAIN;
      last = y;
      const next = clampIndex(target.current + delta / WHEEL_PER_CARD, total);
      if (next === target.current) return;
      fanTo(next);
      e.preventDefault();
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
  }, [fanTo, total]);

  /* ---- OPENING: the card's own geometry, then the panel's ---------
     The card is measured where it stands, the panel is planted on
     exactly that rect, the rect is READ BACK to force the reflow —
     without that the browser coalesces the plant and the target into
     one style change and there is nothing to transition between —
     and only then is it given somewhere else to be. */
  useLayoutEffect(() => {
    if (openIndex == null) return;
    const el = panel.current;
    const source = cards.current[openIndex];
    if (!el || !source) return;

    closing.current = false;
    setHover(null);
    stage.current?.classList.add(styles.dimmed);

    const cardRadius = tokenValue('--aera-radius-card') || '28px';
    place(el, rectOf(source), cardRadius);
    /* forced reflow — required, see above */
    void el.getBoundingClientRect();

    const frame = requestAnimationFrame(() => {
      if (closing.current) return;
      el.classList.add(styles.open);
      place(el, expandedRect(headlineOf(stage.current)), cardRadius);
    });
    /* and the contents re-read themselves once the box is under way */
    const load = window.setTimeout(() => setRecalcKey((k) => k + 1), ms(duration.recalc));
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(load);
    };
  }, [openIndex]);

  /* ---- DISMISSAL: the same five values, travelling back ----------- */
  const requestClose = useCallback(() => {
    if (openIndex == null || closing.current) return;
    closing.current = true;
    const el = panel.current;
    const source = cards.current[openIndex];
    const cardRadius = tokenValue('--aera-radius-card') || '28px';
    if (el && source) {
      el.classList.remove(styles.open);
      place(el, rectOf(source), cardRadius);
    }
    /* the hand comes back up while the panel is still travelling, so
       the card lands into a set that is already lit rather than into
       a dim that clears after it */
    stage.current?.classList.remove(styles.dimmed);
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

  return (
    <div className={cx(styles.wrap, className)}>
      <div ref={stage} className={styles.stage}>
        {patterns.map((pattern, i) => (
          <div
            key={pattern.id}
            ref={(el) => {
              slots.current[i] = el;
            }}
            /* THE PLACEMENT LAYER. No style prop: everything on this
               element is written imperatively by the layout pass, and
               a style prop from React would fight it every render. */
            className={cx(styles.slot, hover === i && openIndex == null && styles.hov)}
            onPointerEnter={() => openIndex == null && setHover(i)}
            onPointerLeave={() => setHover((h) => (h === i ? null : h))}
          >
            {/* THE CARD LAYER — the pointer response, and the box the
                flight measures itself against */}
            <div
              ref={(el) => {
                cards.current[i] = el;
              }}
              className={styles.card}
            >
              <PatternCard
                pattern={pattern}
                hovered={openIndex == null && hover === i}
                showTag={openIndex == null}
                onClick={() => onOpen(i)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* THE ACTIVE MARKER — a rounded pointer on the centre line,
          aimed UP at the card the hand is on. It is the one fixed
          reference in a composition that otherwise moves: the cards
          travel through it. */}
      <span className={styles.marker} aria-hidden="true" />

      <div className={styles.hintRow}>
        <Label className={styles.hint}>
          {open ? 'click anywhere outside the card, or press escape, to close it' : hint}
        </Label>
      </div>

      {/* THERE IS NO SCRIM. The card grows out of the hand and the
          HAND ITSELF recedes — every card fades back and shrinks a
          little, in place, on its own transition. Nothing moves, no
          overlay is painted, and the page behind stays fully visible
          and fully readable. A blackout would have been a second
          object competing with the one thing the click was about.

          The panel is painted at the document root, so no ancestor's
          transform can turn its fixed positioning into something
          else. */}
      {open
        ? createPortal(
            <div ref={panel} className={styles.flight}>
              <div className={styles.poIn}>
                <EnterContext.Provider value={`${open.id}:${recalcKey}`}>
                  <ExpandedCard
                    pattern={open}
                    onDismiss={requestClose}
                    bare
                    maxHeight={openBox.height}
                    maxWidth={openBox.width}
                    stacked={openBox.width < STACK_WIDTH}
                  />
                </EnterContext.Provider>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
