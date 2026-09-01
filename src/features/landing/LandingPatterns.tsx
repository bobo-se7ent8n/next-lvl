import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { PatternCard } from '../../components/composed/PatternCard';
import { EnterContext } from '../../lib/enterContext';
import { ExpandedCard } from '../patterns/ExpandedCard';
import {
  expandedRect,
  headlineOf,
  ms,
  PANEL_FALLBACK,
  place,
  poseOf,
  STACK_WIDTH,
  tokenValue,
} from '../patterns/flight';
import { duration, landing, radius } from '../../tokens';
import { PATTERNS } from '../../data';
import { LandingSection } from './LandingSection';
import styles from './LandingPatterns.module.css';
/* THE OPENING IS THE APP'S OPENING, not a second one that resembles
   it. The flight's classes — the plant, the travelling box, the
   collapse timing — live in the prototype's own stylesheet and this
   fan imports them rather than restating them, so the two hands
   cannot drift into two different animations. */
import flight from '../patterns/PatternFan.module.css';

/* ============================================================
   THE HAND — FIVE CARDS, FIVE ROWS OF CONSTANTS.

   Not the prototype's fan: that one is a twelve-card hand you
   scroll through, and its geometry is a function of a continuous
   position. This is five cards standing still, and the table below
   is the layout — written out per card rather than computed from
   an index.

   THAT IS DELIBERATE, and it is the second time this has been
   written. A generated version — tilt from `index - middle`, drop
   from its square, z from its distance — produces a symmetrical
   arc, and the reference is not symmetrical: the tilts alternate
   in a pattern no single expression gives you, and the horizontal
   step is not even. Anything derived from the index can only ever
   be the shape the expression happens to make. Written out, the
   hand is exactly the hand, every value is inspectable, and moving
   one card moves one number.

   Read the table as: how far along the row, how far down, how far
   round, and how near the front.

     · `x` steps progressively rightward — the overlap between
       neighbours is about a third of a card
     · `y` is lowest at the centre and rises at both ends, so the
       middle card stands highest
     · `rot` alternates left and right of centre
     · `z` peaks at the middle card and falls away in both
       directions, so the hand reads as held rather than stacked

   All four are in the card's own units: `x` and `y` are fractions
   of the card's width and height, so the hand keeps its shape at
   every step of the layout scale.
   ============================================================ */

interface Slot {
  /** along the row, as a fraction of card width */
  x: number;
  /** down the stage, as a fraction of card height */
  y: number;
  /** degrees, negative is anticlockwise */
  rot: number;
  /** how near the front; the centre card is highest */
  z: number;
}

const SLOTS: Slot[] = [
  { x: 0, y: 0.1, rot: -7, z: 1 },
  { x: 0.68, y: 0.035, rot: 4, z: 2 },
  { x: 1.36, y: 0, rot: -2.5, z: 3 },
  { x: 2.02, y: 0.045, rot: 5.5, z: 2 },
  { x: 2.68, y: 0.115, rot: -6, z: 1 },
];

/* ------------------------------------------------------------
   THE STAGE IS MEASURED FROM THE TABLE, NOT GUESSED ALONGSIDE IT.

   The row box used to be two multipliers typed into the
   stylesheet — 3.68 card widths across and 1.2 down — and both
   were the table read by eye. That is wrong twice.

   It is wrong in SIZE, because a rotated card does not stay
   inside the box it was laid out in: the leftmost card leans
   seven degrees about a pivot below its own foot, which swings
   its top corner about a fifth of a card width past the row's
   left edge. Nothing clipped, because nothing on the way up
   clips — but the row was 3.68 wide holding a hand that measured
   3.84.

   And it is wrong in POSITION, which is the half you can see. A
   hand that overhangs 51px on the left and falls 6px short on the
   right, centred by its own box, sits about 22px left of where it
   looks like it should. The fan read as slightly off-centre under
   a heading that is exactly centred, and no amount of retuning the
   per-card constants fixes it, because the constants were never
   the thing that was wrong.

   So the four corners of all five cards are put through each
   card's own rotation, the extremes are taken, and that IS the
   row: the hand is exactly as big as it draws and sits exactly in
   the middle of it. Every input is still a per-card constant, and
   the arithmetic below is the same arithmetic the browser does —
   done once, at module load, rather than approximated by hand.
   ------------------------------------------------------------ */

const CARD_W = Number.parseFloat(landing.fanCardW);
const CARD_H = Number.parseFloat(landing.fanCardH);
/** where a slot turns, as a fraction of its own box — it must stay
 *  equal to `transform-origin` on `.slot`: a card pivots at the
 *  grip, below its bottom edge, not at its middle */
const PIVOT_X = 0.5;
const PIVOT_Y = 1.15;

interface Extent {
  minX: number;
  minY: number;
  /** the row, in card widths and card heights */
  w: number;
  h: number;
}

/** the axis-aligned box the five rotated cards actually occupy */
function extentOf(slots: Slot[]): Extent {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const slot of slots) {
    const left = slot.x * CARD_W;
    const top = slot.y * CARD_H;
    /* the pivot, in the row's own coordinates */
    const px = left + PIVOT_X * CARD_W;
    const py = top + PIVOT_Y * CARD_H;
    const rad = (slot.rot * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);

    for (const cx of [left - px, left + CARD_W - px]) {
      for (const cy of [top - py, top + CARD_H - py]) {
        const x = px + cx * cos - cy * sin;
        const y = py + cx * sin + cy * cos;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { minX, minY, w: (maxX - minX) / CARD_W, h: (maxY - minY) / CARD_H };
}

const EXTENT = extentOf(SLOTS);

/** each slot's offset inside that box, in card units — the table's
 *  own numbers, shifted by however far the hand overhangs its left
 *  and top edges, so the fan is centred on what it draws.
 *
 *  Resolved here rather than in the render: the table is static, so
 *  this is the same five pairs on every pass and the hand should not
 *  be recomputing its own layout to open a card. */
const PLACED = SLOTS.map((slot) => ({
  x: (slot.x * CARD_W - EXTENT.minX) / CARD_W,
  y: (slot.y * CARD_H - EXTENT.minY) / CARD_H,
}));

const HAND = PATTERNS.slice(0, SLOTS.length);

/** how far a hovered card leans away from the pointer, in degrees.
 *  Small on purpose: this is a card noticing a hand, not a card
 *  performing. */
const TILT = 7;

/* THE CORNER THE FLIGHT PLANTS ITSELF AT.
 *
 * `tokenValue` reads the SCALED corner off `:root`, which is what the
 * card is actually drawn with and therefore what the panel has to
 * leave from. The fallback is only reached when the token block has
 * not been injected yet, and it comes from the token rather than
 * being typed out beside it — a literal here is a second copy of a
 * value that already has one home. */
const cardRadius = () => tokenValue('--aera-radius-card') || radius.card;

/**
 * PATTERNS.
 *
 * Five real pattern cards, overlapping by a third of their own
 * width, fanned so the middle one is highest and in front. Clicking
 * one opens it into the prototype's expanded panel using the
 * prototype's own flight: the card is measured where it stands, the
 * panel is planted congruent with it — leaning exactly as far as it
 * leans — and only then given somewhere else to be, so the card
 * straightens as it comes forward rather than jumping upright first.
 *
 * Closing runs the same five values back on the collapse curve,
 * with the content clearing before the box moves.
 */
export function LandingPatterns() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<Array<HTMLDivElement | null>>([]);
  const panel = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openBox, setOpenBox] = useState(PANEL_FALLBACK);
  /* re-scoping this is what makes the opened panel's numbers count
     up, its bars grow and its line draw itself */
  const [recalcKey, setRecalcKey] = useState(0);

  /* the panel's budget, re-read on resize — the fit plan inside
     ExpandedCard has to know the box it is planning for */
  useLayoutEffect(() => {
    const measure = () => setOpenBox(expandedRect(headlineOf(stage.current)));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ---- OPENING ---------------------------------------------------
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
    const from = poseOf(source, stage.current);
    const target = expandedRect(headlineOf(stage.current));

    stage.current?.classList.add(styles.dimmed);
    delete el.dataset.closing;
    el.classList.add(flight.planting);
    place(el, from.rect, cardRadius(), from.rot);
    /* reading both the geometry AND the computed transform flushes
       the box and the angle, so the frame after this leaves from the
       card's real pose rather than from an upright default */
    void el.getBoundingClientRect();
    void getComputedStyle(el).transform;
    el.classList.remove(flight.planting);

    const frame = requestAnimationFrame(() => {
      if (closing.current) return;
      place(el, target, cardRadius(), 0);
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
    if (el && source) {
      /* THE CONTENT GOES FIRST AND THE BOX FOLLOWS. One flag does
         both: it swaps the flight onto the collapse duration and
         curve, and it is what ExpandedCard's groups watch to clear
         themselves. Set BEFORE the geometry moves, so the card is
         empty by the time it is really travelling. */
      el.dataset.closing = 'true';
      const home = poseOf(source, stage.current);
      place(el, home.rect, cardRadius(), home.rot);
    }
    /* the hand comes back up while the panel is still travelling, so
       the card lands into a set that is already lit */
    stage.current?.classList.remove(styles.dimmed);
    window.setTimeout(() => {
      closing.current = false;
      setOpenIndex(null);
    }, ms(duration.collapse));
  }, [openIndex]);

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

  /* ---- THE FIGMA HOVER -------------------------------------------
     A lift, a small scale, and a tilt that leans away from wherever
     the pointer is inside the card — the axis of the tilt follows
     the cursor, which is what makes it read as a physical object
     answering a hand rather than a card playing an animation.

     Written straight onto the node. The pointer moves continuously
     and there are five cards; a `setState` per move would re-render
     the hand, the five cards and every chart inside them to change
     two angles. */
  const tilt = useCallback((i: number, e: ReactPointerEvent<HTMLDivElement>) => {
    const el = cards.current[i];
    if (!el || openIndex != null) return;
    const box = el.getBoundingClientRect();
    /* -1 … 1 from the card's own centre, on both axes */
    const dx = (e.clientX - box.left) / box.width - 0.5;
    const dy = (e.clientY - box.top) / box.height - 0.5;
    el.style.setProperty('--tilt-x', `${(-dy * TILT).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(dx * TILT).toFixed(2)}deg`);
  }, [openIndex]);

  /** back to flat, on the same resistance curve it leant on */
  const rest = useCallback((i: number) => {
    const el = cards.current[i];
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }, []);

  const open = openIndex != null ? HAND[openIndex] : null;

  return (
    <LandingSection
      heading="Patterns"
      body="Nothing is pushed at you. A pattern sits in the hand until you pull it out — and it only gets there once it has repeated across enough sessions to mean something."
      centred
      fit
    >
      <div ref={stage} className={styles.hand}>
        <div
          className={styles.row}
          /* the row is exactly the box the five rotated cards
             occupy — see `extentOf` above */
          style={{ '--row-w': EXTENT.w, '--row-h': EXTENT.h } as CSSProperties}
        >
          {HAND.map((pattern, i) => {
            const slot = SLOTS[i];
            const at = PLACED[i];
            return (
              <div
                key={pattern.id}
                className={styles.slot}
                style={
                  {
                    '--x': at.x,
                    '--y': at.y,
                    '--rot': `${slot.rot}deg`,
                    zIndex: slot.z,
                  } as CSSProperties
                }
              >
                <div
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className={styles.card}
                  onPointerMove={(e) => tilt(i, e)}
                  onPointerLeave={() => rest(i)}
                  /* the flying card is not also in the hand — without
                     this the source card sits under its own panel and
                     shows through it on the way out and back */
                  style={{ opacity: openIndex === i ? 0 : undefined }}
                >
                  {/* THE TILT LIVES ON ITS OWN LAYER, one inside the
                      box the flight measures. `poseOf` walks up from
                      that box, so a three-dimensional hover tilt on it
                      would be composed into the angle the opening
                      flight plants itself at — and a card would leave
                      the hand leaning a direction it never leaned. A
                      child's transform does not touch its parent's
                      rect, so here the two cannot interfere. */}
                  <div className={styles.tilt}>
                    <PatternCard
                      pattern={pattern}
                      showTag={false}
                      onClick={() => {
                        rest(i);
                        setOpenIndex(i);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open
        ? createPortal(
            <div
              ref={panel}
              className={flight.flight}
              /* the opened pattern's own face, so the box is opaque
                 from the first frame of the flight */
              style={{ '--flight-face': open.fill } as CSSProperties}
            >
              <div className={flight.poIn}>
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
    </LandingSection>
  );
}
