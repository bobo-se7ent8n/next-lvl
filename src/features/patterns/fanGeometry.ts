/* ============================================================
   FAN GEOMETRY — LEFT-ANCHORED

   The set holds every pattern; a window of five is on the stage.

   THE FAN IS ANCHORED LEFT. The first visible card sits at the
   left edge and the hand stacks rightward from there. There is no
   centring: scrolling changes WHICH five cards are on the stage,
   not where the stack sits. The previous model kept the active
   card pinned to the middle of the screen, so the whole
   composition slid under the cursor every time the set advanced.

   DEPTH RUNS LEFT TO RIGHT. The leftmost card is furthest back
   and the rightmost is front-most and active; every card sits
   above the one to its left. That is the opposite of the old
   build, and it is why rotation and scale both CLIMB with the
   slot index rather than falling away from a centre.

   Three things combine:

   · the SLOT — where a card sits in the window, a pure function
     of its slot index 0…4. Everything grows monotonically along
     it, so no card is a local maximum and the stack reads as
     depth rather than as an arch.
   · the CARD's own hand — a small, stable irregularity hashed
     from the card INDEX, so a card keeps the same tilt for the
     life of the page.
   · the WINDOW — which cards are on the stage at all.
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
 *  A smaller ratio than the centred model used, because the cards
 *  themselves are much larger now: a share of a bigger number, so
 *  the absolute step is wider even as the ratio comes down. */
export const FAN_STEP_RATIO = 0.62;

export function fanStep(cardWidth: number): number {
  return cardWidth * FAN_STEP_RATIO;
}

/** the back of the hand, and the front of it */
const BACK_SCALE = 0.86;
const FRONT_SCALE = 1;

/** degrees of tilt across the whole fan, back to front */
const BACK_ROT = -7;
const FRONT_ROT = 7;

/** how far the back of the hand rides above the front, in px */
const LIFT = 26;

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

/** the irregularity a card carries with it, wherever it sits */
export function cardHand(index: number): CardHand {
  const a = hash01(index);
  const b = hash01(index * 7919 + 13);
  return {
    rot: Number(((a - 0.5) * 2 * 1.6).toFixed(2)),
    dy: Number(((b - 0.5) * 2 * 10).toFixed(1)),
  };
}

/** the shape of one slot, by its position in the window: 0 at the
 *  back-left, VISIBLE_CARDS-1 at the front-right */
export function slotShape(slot: number): SlotShape {
  const t = VISIBLE_CARDS <= 1 ? 1 : slot / (VISIBLE_CARDS - 1);
  return {
    /* the back of the hand rides higher, easing down to the front */
    y: LIFT * (1 - t) * (1 - t),
    rot: BACK_ROT + (FRONT_ROT - BACK_ROT) * t,
    scale: BACK_SCALE + (FRONT_SCALE - BACK_SCALE) * t,
  };
}

/** Every card IN the window is fully saturated; nothing fades
 *  inside it. The window is exactly 0…VISIBLE_CARDS-1 — the two
 *  buffer slots either side exist so a card animates in and out
 *  rather than popping, and they are transparent. */
export function slotOpacity(slot: number): number {
  return slot >= 0 && slot < VISIBLE_CARDS ? 1 : 0;
}

/** a card far enough out that it is not painted at all */
export function slotHidden(slot: number): boolean {
  return slot < -1 || slot > VISIBLE_CARDS;
}

/** Which slot card `index` occupies. The window's LEFT edge is the
 *  scroll position, so slot 0 is always the first card of the
 *  window and the anchor never moves. */
export function slotDelta(index: number, position: number): number {
  return index - position;
}

/** the last scroll position that still fills the window */
export function maxPosition(total: number): number {
  return Math.max(0, total - VISIBLE_CARDS);
}
