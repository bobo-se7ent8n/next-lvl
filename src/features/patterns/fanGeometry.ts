/* ============================================================
   FAN GEOMETRY — TRANSCRIBED FROM THE PROTOTYPE

   Every number in this file is the single-file prototype's own.
   Nothing here is derived, rounded, retuned or improved; where a
   value looks arbitrary it is arbitrary in the prototype too, and
   that is the point — the hand feels the way it does because of
   these exact constants and no others.

   THERE IS NO WINDOW MECHANISM. There is no VISIBLE_CARDS and no
   `windowFor`. A card is on the stage when its distance from the
   hand's position is inside `CUTOFF`, and that one comparison is
   what decides how many cards are standing at any moment — nine
   across the middle of the set, fewer at the two ends where the
   hand runs out of cards. Adding a window on top of it would be a
   second answer to a question the cutoff already answers.

   THE ARC IS QUADRATIC. `d * d * ARC_K`, capped. The middle of the
   hand rides high and the ends fall away on a curve; a linear drop
   makes the same cards read as a staircase.
   ============================================================ */

/* ------------------------------------------------------------
   THE STEP — the only horizontal spacing input that exists.

   Everything the fan does sideways is this number times a card's
   signed distance from the hand's position. There is no margin, no
   gap and no per-card offset anywhere else, in this file or in the
   stylesheet.
   ------------------------------------------------------------ */

/** the horizontal step between neighbours, as a share of the card width */
export const FAN_STEP_RATIO = 0.66;

/** the step never closes below this, however narrow the card gets */
export const MIN_STEP = 72;

/**
 * THE LAYOUT SCALE, READ ONCE PER MEASURE.
 *
 * The fan is drawn in absolute pixels — a step, a drop, a cap — and
 * those numbers were fixed while every other length in the product
 * moved with `--aera-scale`. On a 14" screen the cards shrank (their
 * width is a `vw` clamp) but the arc they sat on did not, so the
 * hand spread wider and dropped further relative to the cards it was
 * made of.
 *
 * Everything below that is a length now goes through this. The
 * ratios — the step as a share of card width, the rotation per
 * step — are already relative and are left alone.
 */
export function layoutScale(): number {
  if (typeof document === 'undefined') return 1;
  const v = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--aera-scale'),
  );
  return Number.isFinite(v) && v > 0 ? v : 1;
}

export function fanStep(cardWidth: number, scale = 1): number {
  return Math.max(MIN_STEP * scale, cardWidth * FAN_STEP_RATIO);
}

/* ---- the shape of the arc ---------------------------------- */

/** the quadratic constant: a card `d` steps out drops `d² × this` */
const ARC_K = 5.4;
/** and never further than this, however far out it is */
const ARC_CAP = 96;
/** degrees per step away from the centre — the base sweep */
const ROT_STEP = 4.1;
/** how much smaller each step out is */
const SCALE_STEP = 0.075;
/** the most a card ever shrinks */
const SCALE_CAP = 0.34;

/** How far out a card is still on the stage.
 *
 *  THIS IS THE CARD COUNT. It is not a window and there is no
 *  separate count to keep in step with it: 4.4 either side of the
 *  centre puts nine cards on the stage through the middle of the
 *  set, and fewer at the ends because there is nothing out there to
 *  stand. Change this number and the hand gets wider or narrower;
 *  there is nothing else to change with it. */
export const CUTOFF = 4.4;

/* ---- the smoothing loop's own constants -------------------- */

/** the share of the remaining distance the hand closes each frame.
 *  Exponential decay: this, and not the scroll event, is what makes
 *  the hand feel smooth. */
export const EASE_FACTOR = 0.22;

/** below this the hand is home and the loop stops rather than
 *  chasing a distance nobody can see */
export const SETTLE_EPSILON = 0.0015;

/** wheel px that advance the hand by one card */
export const WHEEL_PER_CARD = 170;

/* ------------------------------------------------------------
   THE PER-CARD WOBBLE

   Hashed from the card INDEX with Knuth's multiplicative constant,
   so a card's tilt and its height belong to the card and never to
   the slot it happens to be standing in — identical on every
   render, and never computed at paint time.
   ------------------------------------------------------------ */

export interface Wobble {
  /** the card's own tilt on top of the base sweep, in degrees */
  rot: number;
  /** its own vertical nudge, in px */
  dy: number;
}

function jitter(i: number): Wobble {
  const h = (i * 2654435761) >>> 0;
  return {
    rot: ((h % 1000) / 1000 - 0.5) * 5.2,
    dy: (((h >>> 10) % 1000) / 1000 - 0.5) * 16,
  };
}

/* computed once per index, on first ask, and held. The layout pass
   runs every frame of every scroll — it must not be hashing. */
const HANDS = new Map<number, Wobble>();

export function cardHand(index: number): Wobble {
  let hand = HANDS.get(index);
  if (!hand) {
    hand = jitter(index);
    HANDS.set(index, hand);
  }
  return hand;
}

/* ------------------------------------------------------------
   THE LAYOUT PASS, as one pure function per card.

   The component writes the result straight onto the slot element.
   Nothing in here reads or touches the DOM.
   ------------------------------------------------------------ */

import { zIndex } from '../../tokens';

export interface SlotShape {
  x: number;
  y: number;
  rot: number;
  sc: number;
  op: number;
  z: number;
}

/**
 * One card's placement, from its own index, its signed distance to
 * the hand's position, and the current step.
 *
 * `d` is negative to the left of the hand and positive to the right.
 * Rotation carries the sign so the two sides mirror; the drop and the
 * scale use the magnitude, so both sides fall away equally. The card's
 * own wobble rides on top of both, and comes from the INDEX rather
 * than from `d` — it travels with the card, not with the slot.
 */
export function slotShape(index: number, d: number, step: number, scale = 1): SlotShape {
  const hand = cardHand(index);
  return {
    x: d * step,
    /* the arc's height and the card's own nudge are lengths, so both
       move with the scale; the quadratic constant is a ratio and
       does not */
    y: Math.min(ARC_CAP * scale, d * d * ARC_K * scale) + hand.dy * scale,
    rot: d * ROT_STEP + hand.rot,
    sc: 1 - Math.min(SCALE_CAP, Math.abs(d) * SCALE_STEP),
    op: Math.abs(d) > CUTOFF ? 0 : 1,
    z: zIndex.fan - Math.round(Math.abs(d) * 10),
  };
}

/** the last card of the set — the hard end stop for the hand */
export function maxPosition(total: number): number {
  return Math.max(0, total - 1);
}

/** the prototype's own clamp, used on every target the hand is given */
export function clampIndex(v: number, total: number): number {
  return Math.max(0, Math.min(maxPosition(total), v));
}
