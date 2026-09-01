import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import { PatternCard } from '../../components/composed/PatternCard';
import { EnterContext } from '../../lib/enterContext';
import { ExpandedCard } from './ExpandedCard';
import {
  EASE_FACTOR,
  layoutScale,
  SETTLE_EPSILON,
  WHEEL_PER_CARD,
  clampIndex,
  fanStep,
  slotShape,
} from './fanGeometry';
import { duration } from '../../tokens';
import {
  expandedRect,
  headlineOf,
  ms,
  PANEL_FALLBACK,
  place,
  poseOf,
  STACK_WIDTH,
  tokenValue,
} from './flight';
import type { Pattern } from '../../data/types';
import styles from './PatternFan.module.css';

/** how far a touch drag travels relative to the finger */
const TOUCH_GAIN = 1.4;


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
  /* the layout scale, sampled when the stage is measured — the fan's
     absolute lengths are multiplied by it so the hand scales as one
     object with everything around it */
  const scale = useRef(1);

  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const openRef = useRef<number | null>(null);
  /* which slot the flight is currently carrying — read by the layout
     pass, which runs outside React and cannot see `openIndex` */
  const flyingIndex = useRef<number | null>(null);

  /* THE ACTIVE CARD IS WHERE THE HAND IS PARKED, NOT WHERE THE
     POINTER IS.
     
     On Home the fan is scrolled, not browsed: the triangle under the
     stage marks one card and that card wears the selection. Pointer
     movement over the fan produces no state change at all — there is
     no hover trigger here to lag, to fight the z-order, or to
     disagree with the marker.
     
     It is React state because the selection treatment lives inside
     PatternCard (the ring and the name chip), but it is written from
     the layout pass at most once per card the hand crosses — never
     per frame, and never per pointer move. */
  const [active, setActive] = useState(Math.round(start));
  const activeRef = useRef(Math.round(start));
  /* the box the opened popup has to stand inside. State rather than a
     read at render time so the fit plan re-runs on resize. */
  const [openBox, setOpenBox] = useState(() =>
    typeof window === 'undefined'
      ? PANEL_FALLBACK
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
    /* whichever card the centre line — and so the marker — is on */
    const next = Math.max(0, Math.min(total - 1, Math.round(p)));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
    for (let i = 0; i < slots.current.length; i += 1) {
      const el = slots.current[i];
      if (!el) continue;
      const shape = slotShape(i, i - p, s, scale.current);
      el.style.setProperty('--x', `${shape.x.toFixed(1)}px`);
      el.style.setProperty('--y', `${shape.y.toFixed(1)}px`);
      el.style.setProperty('--rot', `${shape.rot.toFixed(2)}deg`);
      el.style.setProperty('--sc', shape.sc.toFixed(4));
      /* THE CARD THAT IS FLYING IS NOT ALSO IN THE HAND.
         Without this the source card stays in the fan at the dimmed
         16% while its panel grows out of the very same rect — which
         is the semi-transparent second card showing through the
         opening one, on the way out and again on the way back. */
      const flying = i === flyingIndex.current;
      const op = flying ? 0 : shape.op;
      el.style.opacity = String(op);
      el.style.visibility = op ? 'visible' : 'hidden';
      el.style.zIndex = String(shape.z);
    }
  }, [total]);

  /* ---- THE SMOOTHING LOOP ----------------------------------------
     Self-cancelling: it stops the moment the hand arrives and starts
     again on the next input. It must never run unconditionally — a
     rAF loop that is always alive is a rAF loop that is always
     costing something. */
  /* A NAMED function expression, and the name is load-bearing: the
     loop has to schedule ITSELF, and `requestAnimationFrame(tick)`
     reading the outer `const` would be reaching for a binding that
     is not initialised yet on the first pass. The name below belongs
     to the expression, is in scope inside its own body, and is
     exactly what the recursion should point at. */
  const tick = useCallback(function step() {
    raf.current = 0;
    const d = target.current - prog.current;
    if (Math.abs(d) < SETTLE_EPSILON) {
      prog.current = target.current;
      layout();
      return;
    }
    prog.current += d * EASE_FACTOR;
    layout();
    raf.current = requestAnimationFrame(step);
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
      scale.current = layoutScale();
      const slot = slots.current.find(Boolean);
      if (slot) step.current = fanStep(slot.offsetWidth, scale.current);
      setOpenBox(expandedRect(headlineOf(stage.current)));
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

    /* MEASURED BEFORE THE HAND IS TOLD ANYTHING.

       `layout()` rewrites every slot's angle once `flyingIndex` is
       set, so reading the source card after it reported the angle the
       card was about to have rather than the one it still had — the
       flight left upright and came back leaning. The pose is taken
       first, off the card exactly as the user last saw it. */
    const from = poseOf(source as HTMLElement, stage.current);

    flyingIndex.current = openIndex;
    layout();
    stage.current?.classList.add(styles.dimmed);

    const cardRadius = tokenValue('--aera-radius-card') || '28px';
    const target = expandedRect(headlineOf(stage.current));
    /* planted congruent with the card, leaning exactly as far as the
       card leans — the straightening is part of the journey, not a
       jump on the first frame */
    /* planted with transitions off — see `.planting`. Reading the
       geometry AND the computed transform flushes both the box and
       the angle, so the frame after this leaves from the card's real
       pose rather than from an upright default. */
    /* a previous close may have left this set; the card is opening,
       so its content is on again from the first frame */
    delete el.dataset.closing;
    el.classList.add(styles.planting);
    place(el, from.rect, cardRadius, from.rot);
    void el.getBoundingClientRect();
    void getComputedStyle(el).transform;
    el.classList.remove(styles.planting);

    const frame = requestAnimationFrame(() => {
      if (closing.current) return;
      el.classList.add(styles.open);
      place(el, target, cardRadius, 0);
    });
    /* and the contents re-read themselves once the box is under way */
    const load = window.setTimeout(() => setRecalcKey((k) => k + 1), ms(duration.recalc));
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(load);
    };
  }, [openIndex, layout]);

  /* ---- DISMISSAL: the same five values, travelling back ----------- */
  const requestClose = useCallback(() => {
    if (openIndex == null || closing.current) return;
    closing.current = true;
    const el = panel.current;
    const source = cards.current[openIndex];
    const cardRadius = tokenValue('--aera-radius-card') || '28px';
    if (el && source) {
      /* THE CONTENT GOES FIRST AND THE BOX FOLLOWS.

         One flag does both: it swaps the flight onto the collapse
         duration and curve, and it is what ExpandedCard's groups
         watch to clear themselves. Set BEFORE the geometry moves so
         the fades and the journey start on the same frame — the
         card is empty by the time it is really travelling. */
      el.dataset.closing = 'true';
      el.classList.remove(styles.open);
      const home = poseOf(source as HTMLElement, stage.current);
      place(el, home.rect, cardRadius, home.rot);
    }
    /* the hand comes back up while the panel is still travelling, so
       the card lands into a set that is already lit rather than into
       a dim that clears after it */
    stage.current?.classList.remove(styles.dimmed);
    /* and the parent only hears about it once the card is home again */
    window.setTimeout(() => {
      closing.current = false;
      /* the card comes back into the hand only once the panel has
         finished travelling home, so the two are never both drawn */
      flyingIndex.current = null;
      layout();
      onOpen(null);
    }, ms(duration.collapse));
  }, [openIndex, onOpen, layout]);

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
      <div
        ref={stage}
        className={styles.stage}
      >
        {patterns.map((pattern, i) => (
          <div
            key={pattern.id}
            ref={(el) => {
              slots.current[i] = el;
            }}
            /* THE PLACEMENT LAYER. No style prop: everything on this
               element is written imperatively by the layout pass, and
               a style prop from React would fight it every render. */
            className={cx(styles.slot, active === i && styles.hov)}
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
                hovered={openIndex == null && active === i}
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
            <div
              ref={panel}
              className={styles.flight}
              /* the opened pattern's own face, so the box is opaque
                 from the first frame of the flight */
              style={{ '--flight-face': open.fill } as CSSProperties}
            >
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
