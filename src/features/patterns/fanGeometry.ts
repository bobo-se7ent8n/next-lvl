/* ============================================================
   FAN GEOMETRY — CENTRED ACTIVE CARD

   The set holds every pattern; a window of eight is on the stage.

   THE ACTIVE CARD IS PINNED TO THE CENTRE. Its distance from
   itself is zero and its offset is therefore zero, so it sits on
   the container's centre line at every point in the scroll. The
   set moves THROUGH that centre rather than the centre moving
   along the set — which is the difference between a fan you read
   and a strip that slides off the canvas.

   THE ARC IS SYMMETRIC ABOUT IT. Rotation mirrors — negative to
   the left, positive to the right — and both sides descend and
   shrink away from the middle. The active card is the apex: the
   highest, the largest, the only upright one, and the front-most
   in z. At the first card there is nothing to its left and at the
   last there is nothing to its right, so those two states read as
   half a fan; that asymmetry is a consequence of running out of
   cards, never of the set being anchored to an edge.
   ============================================================ */

export interface SlotShape {
  y: number;
  rot: number;
  scale: number;
}

/** how many cards stand on the stage at once */
export const VISIBLE_CARDS = 5;

/** The horizontal step between neighbours, as a share of the card
 *  width. The single tuning point for the fan's spread — it reaches
 *  the transform as the `--fan-gap` custom property rather than
 *  being multiplied into an offset in JS.
 *
 *  Well up from the eight-card step, where the cards sat almost on
 *  top of one another. The ceiling is set by the FIRST card: with
 *  the active card centred and nothing to its left, all four of its
 *  neighbours extend to the right, so half the stage has to hold
 *  four full steps plus a rotated card's bounding box. */
export const FAN_STEP_RATIO = 0.38;

export function fanStep(cardWidth: number): number {
  return cardWidth * FAN_STEP_RATIO;
}

/** Degrees added per card away from the centre — the base sweep the
 *  whole fan follows before any card's own hand is added to it. */
const ROT_STEP = 4.6;
/** px the card drops per step away from the centre */
const DROP_STEP = 16;
/** how much smaller each step out is */
const SCALE_STEP = 0.035;
/** the floor the scale never falls through */
const MIN_SCALE = 0.8;

/** deterministic 0..1 from one integer — the card's own hand */
function hash01(n: number): number {
  let h = (n + 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export interface CardHand {
  /** the card's own tilt on top of the fan's, in degrees */
  rot: number;
  /** its own vertical nudge, in px */
  dy: number;
}

/** how far a card's own tilt may stray from the fan's base sweep */
const HAND_ROT = 3.4;
/** how far its own height may stray, in px */
const HAND_DY = 22;

/**
 * The irregularity a card carries with it, wherever it sits.
 *
 * This is what stops the fan reading as a mechanical sequence: the
 * base sweep is perfectly even, and each card then pulls its own
 * angle and its own height off that line by a fixed amount. It is
 * hashed from the INDEX, so a card's tilt is a property of the card
 * and never of where it happens to be standing — the same card is
 * always at the same angle, on every render, with no randomisation
 * at paint time.
 */
export function cardHand(index: number): CardHand {
  const a = hash01(index);
  const b = hash01(index * 7919 + 13);
  return {
    rot: Number(((a - 0.5) * 2 * HAND_ROT).toFixed(2)),
    dy: Number(((b - 0.5) * 2 * HAND_DY).toFixed(1)),
  };
}

/**
 * The shape of one card, by its signed distance from the active one.
 *
 * `d` is negative to the left and positive to the right. Rotation
 * carries the sign so the two sides mirror; the drop and the scale
 * use the magnitude, so both sides fall away from the apex equally.
 */
export function slotShape(d: number): SlotShape {
  const a = Math.abs(d);
  return {
    /* the active card is the high point; every step out descends */
    y: DROP_STEP * a,
    rot: ROT_STEP * d,
    scale: Math.max(MIN_SCALE, 1 - SCALE_STEP * a),
  };
}

/** every card on the stage is fully saturated — the window decides
 *  membership and nothing fades inside it */
export function slotOpacity(visible: boolean): number {
  return visible ? 1 : 0;
}

/** how far card `index` sits from the active card */
export function slotDelta(index: number, position: number): number {
  return index - position;
}

/**
 * The eight indices on the stage for a given active card.
 *
 * The active card stays centred, so this only decides MEMBERSHIP,
 * never placement: it takes the eight nearest cards, shifting the
 * window inward at the two ends rather than letting it run off the
 * set and show fewer than eight in the middle of the scroll.
 */
export function windowFor(position: number, total: number): { lo: number; hi: number } {
  if (total <= VISIBLE_CARDS) return { lo: 0, hi: total - 1 };
  const half = Math.floor(VISIBLE_CARDS / 2);
  let lo = Math.round(position) - half;
  let hi = lo + VISIBLE_CARDS - 1;
  if (lo < 0) {
    hi -= lo;
    lo = 0;
  }
  if (hi > total - 1) {
    lo -= hi - (total - 1);
    hi = total - 1;
  }
  return { lo: Math.max(0, lo), hi };
}

/** the last card of the set — the hard end stop for the scroll */
export function maxPosition(total: number): number {
  return Math.max(0, total - 1);
}
