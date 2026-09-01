/* ============================================================
   THE FLIGHT — a card opening into a panel, as five values.

   THIS FILE EXISTS BECAUSE THERE ARE TWO FANS NOW. The prototype's
   Home screen holds one and the public page holds another, and
   they lay their cards out completely differently — one is a
   twelve-card hand you scroll through, the other is five cards
   standing still in an arc. What they must NOT do differently is
   open: a card that grows out of the hand on one screen and pops
   up in the middle on the other is two products.

   So the geometry of the opening lives here and the two fans share
   it. Everything below answers one of three questions:

     · where is the card right now, and how far over does it lean
     · where should the opened panel end up
     · how do I write a box onto an element without a render

   The MOTION is not here. The durations, the curves and the
   classes that carry them are in PatternFan.module.css, which both
   fans import — one stylesheet, so the two can never drift into
   two different opening animations.
   ============================================================ */

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

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

/** the box to assume before a window has been measured — a server
 *  render, a first paint, a test. It is the panel at its ceiling,
 *  and it is a full `Rect` rather than a bare size so a consumer can
 *  hold one variable rather than a union of two shapes. */
export const PANEL_FALLBACK: Rect = {
  left: 0,
  top: PANEL_MIN_TOP,
  width: PANEL_MAX_W,
  height: PANEL_MAX_H,
};

/** below this the opened card's two columns stack — it must match the
 *  breakpoint in ExpandedCard.module.css, because the fit plan has to
 *  know which layout it is budgeting for */
export const STACK_WIDTH = 720;

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
export function expandedRect(head: Element | null): Rect {
  const headBottom = head ? head.getBoundingClientRect().bottom : 120;
  const width = Math.min(PANEL_MAX_W, window.innerWidth - PANEL_GUTTER);
  const top = Math.max(PANEL_MIN_TOP, headBottom + PANEL_HEAD_GAP);
  const height = Math.max(
    PANEL_MIN_H,
    Math.min(PANEL_MAX_H, window.innerHeight - top - PANEL_FOOT),
  );
  return { left: (window.innerWidth - width) / 2, top, width, height };
}

/** plant the panel on a rect. Written straight to the element rather
 *  than through React: the whole point of the transition is that the
 *  browser sees one box replaced by another between two frames, and a
 *  render pass in the middle of that is a render pass too many. */
export function place(el: HTMLElement, r: Rect, radius: string, rot: number) {
  el.style.left = `${r.left}px`;
  el.style.top = `${r.top}px`;
  el.style.width = `${r.width}px`;
  el.style.height = `${r.height}px`;
  el.style.borderRadius = radius;
  el.style.setProperty('--flight-rot', `${rot}deg`);
}

/**
 * THE CARD WHERE IT ACTUALLY STANDS, AND HOW FAR OVER IT LEANS.
 *
 * `getBoundingClientRect` on a rotated card returns the axis-aligned
 * box AROUND the lean, which is wider and shorter than the card
 * itself — planting the flight on that rect starts the journey on a
 * box the card never occupied. The untransformed size comes from
 * `offsetWidth/Height` and is centred on the rect's own centre, so
 * the flight begins exactly congruent with the card it leaves.
 *
 * THE ANGLE AS PAINTED, NOT AS DECLARED. The lean is spread over
 * two elements and the variables that carry it sit on different
 * ancestors, so adding them up by hand reads 0 from whichever
 * element did not happen to own them. Composing the actual matrices
 * from the card up to `stopAt` returns the angle on screen, whatever
 * produced it — which is why the caller passes the element to stop
 * at rather than this file knowing about either fan's stage class.
 */
export function poseOf(card: HTMLElement, stopAt: Element | null): { rect: Rect; rot: number } {
  const b = card.getBoundingClientRect();
  const w = card.offsetWidth;
  const h = card.offsetHeight;

  let m = new DOMMatrixReadOnly();
  for (let e: HTMLElement | null = card; e && e !== stopAt; e = e.parentElement) {
    const t = getComputedStyle(e).transform;
    if (t && t !== 'none') m = new DOMMatrixReadOnly(t).multiply(m);
  }
  const rot = (Math.atan2(m.b, m.a) * 180) / Math.PI;

  return {
    rect: {
      left: b.left + b.width / 2 - w / 2,
      top: b.top + b.height / 2 - h / 2,
      width: w,
      height: h,
    },
    rot,
  };
}

/** the page header this fan sits under — the panel hangs off its
 *  bottom edge, so the screen it opened from stays readable */
export function headlineOf(el: Element | null): Element | null {
  return el?.closest('section')?.querySelector('header') ?? null;
}

/** a token's computed value off `:root` */
export function tokenValue(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** a duration token, as a number of milliseconds */
export function ms(token: string): number {
  return Number.parseFloat(token);
}
