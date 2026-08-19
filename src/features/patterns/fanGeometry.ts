/* ============================================================
   FAN GEOMETRY

   The set holds every pattern — twelve of them — and the window
   shows eight at a time.

   THE ACTIVE CARD IS ALWAYS CENTRED. There is no anchoring: the
   slot a card sits in is a pure function of its distance from the
   active card, and the active card's distance from itself is zero,
   so it stands in the middle of the stage at every point in the
   scroll. Scrolling flows the whole hand leftward THROUGH that
   centre — the next card arrives at the middle, the previous one
   moves off to the left, and a new one enters from the right.

   The composition is asymmetric at the two ends by CONSEQUENCE
   rather than by construction: card one has nothing to its left
   and card twelve has nothing to its right, because those cards
   have no neighbours on that side, not because the set has been
   pushed against an edge.

   Three things combine:

   · the SLOT — where a card sits relative to the active one. A
     smooth function of the distance `d`. Scale falls off toward
     the edges of the window; opacity does not fall off at all.

   · the CARD's own tilt and stagger. A pure function of the card
     INDEX, never of `d` and never of anything random, so a card
     carries the same hand-dropped angle for the life of the page.

   · the WINDOW — how far from the centre a card is still in the
     hand. A card crossing that boundary fades and shrinks across
     the same transition every other slot property uses, so it
     arrives and leaves rather than popping.
   ============================================================ */

export interface SlotShape {
  y: number;
  rot: number;
  scale: number;
}

/** how many cards the window shows at once */
export const VISIBLE_CARDS = 8;

/* Eight is an even number and the active card is one of them, so the
   window cannot be symmetric about it. The extra card goes on the
   INCOMING side, because that is the side new cards arrive from and
   the side the eye is travelling toward. */
export const WINDOW_BEHIND = 3;
export const WINDOW_AHEAD = VISIBLE_CARDS - 1 - WINDOW_BEHIND;

/** how far out the scale has fallen all the way to its edge value */
export const SCALE_REACH = 3.4;

/** the outermost card in the window, and the one in the middle */
const EDGE_SCALE = 0.78;
const CENTRE_SCALE = 1.06;

/** deterministic 0..1 from one integer — the card's own hand */
function hash01(n: number): number {
  let h = (n + 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export interface CardHand {
  /** the card's own tilt, roughly ±8°, alternating by index */
  rot: number;
  /** its staggered vertical offset, in px */
  dy: number;
  /** a small, stable shuffle of the stacking order */
  lift: number;
}

/** the irregularity a card carries with it, wherever it sits */
export function cardHand(index: number): CardHand {
  const a = hash01(index);
  const b = hash01(index * 7919 + 13);
  const c = hash01(index * 104729 + 71);
  const sign = index % 2 === 0 ? 1 : -1;
  return {
    rot: Number((sign * (2.6 + a * 5.4)).toFixed(2)),
    dy: Number(((b - 0.5) * 2 * 40).toFixed(1)),
    lift: Math.round(c * 12),
  };
}

/** the smooth part of the shape — the arc, and the scale falloff */
export function slotShape(d: number): SlotShape {
  const a = Math.abs(d);
  const k = Math.min(1, a / SCALE_REACH);
  return {
    y: 26 * k * k,
    rot: d * 1.15,
    scale: CENTRE_SCALE - (CENTRE_SCALE - EDGE_SCALE) * k,
  };
}

/** How solid a card is. Every card INSIDE the window is at full fill
 *  and fully saturated — there is no falloff across the hand. The only
 *  card that is not at 1 is one that has left the window, and it gets
 *  there over the slot transition rather than by disappearing. */
export function slotOpacity(d: number): number {
  return d >= -WINDOW_BEHIND && d <= WINDOW_AHEAD ? 1 : 0;
}

/** a card far enough out that it no longer needs to be painted at all */
export function slotHidden(d: number): boolean {
  return d < -WINDOW_BEHIND - 1 || d > WINDOW_AHEAD + 1;
}

/** The horizontal step between neighbours, as a share of the card
 *  width.
 *
 *  At 0.38 each trailing card showed only about a quarter of itself
 *  and the hand read as one stuck-together block. At 0.48 a card
 *  behind shows roughly two fifths of its own width — enough air to
 *  read as separate cards, still enough overlap to read as a hand
 *  rather than a row. The tilt is deliberately NOT increased to
 *  compensate: this is a spacing change and nothing else. */
export const FAN_STEP_RATIO = 0.48;

export function fanStep(cardWidth: number): number {
  return cardWidth * FAN_STEP_RATIO;
}

/** A tilted card reaches further than its own half-width. */
const TILT_ALLOWANCE = 1.08;

/** How much the whole hand has to shrink to stand inside the stage.

    Widening the step makes the hand wider than some viewports, and the
    instruction there is explicit: scale the fan down proportionally
    rather than pulling the cards back together. So the step is a
    constant and THIS is the thing that gives — the composition is
    identical at every width, just smaller when it has to be.

    The reach is measured on the busier side of the window, and the
    same value is used both sides, so a card never fits on the right
    and overflows on the left mid-scroll. */
export function fanFit(stageWidth: number, cardWidth: number, gutter: number): number {
  if (stageWidth <= 0 || cardWidth <= 0) return 1;
  const step = fanStep(cardWidth);
  const arm = Math.max(WINDOW_BEHIND, WINDOW_AHEAD);
  const reach = arm * step + ((cardWidth * CENTRE_SCALE) / 2) * TILT_ALLOWANCE;
  const room = (stageWidth - gutter * 2) / 2;
  return Math.min(1, room / reach);
}

/** how far card `index` sits from the active card. Linear: the set has
 *  a first card and a last card and does not wrap. */
export function slotDelta(index: number, position: number): number {
  return index - position;
}
