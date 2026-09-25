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

/* ---- THE OPENED PANEL'S BOX ---------------------------------------
   It is NOT centred in the viewport: it hangs under the headline, so
   the page it came from stays legible above it.

   THE WIDTH SCALES WITH THE PRODUCT. Paper's pattern popup is 760
   wide at full scale, and the panel is that width times the layout
   scale — the same `--aera-scale` every length inside it is drawn at
   — so the card keeps the popup's proportions on every desktop
   window instead of being a fixed 760 box with shrinking contents.
   It stops shrinking at PANEL_MIN_W, where the source block beside
   the chart still holds its two lines, and below that it simply
   takes the window less its gutter until it is narrow enough to
   stack (STACK_WIDTH), which in practice means a phone.

   THE HEIGHT IS THE CONTENT'S, AND IT IS ONE HEIGHT FOR ALL TWELVE.
   Every opened pattern is the same stack — a one-line heading, the
   numeral, the source block beside the chart, four history rows — so
   they all stand at the same height by construction. What that height
   is depends on the window (lengths scale, small type does not), so
   it is measured off a hidden probe of the tallest kind of card (see
   `PanelProbe` in ExpandedCard.tsx) rather than predicted. The window
   is only a ceiling: a panel that would run past it is given the
   window, and its chart well is what gives. */
/** Paper's popup width at full scale */
const PANEL_W = 760;
/** the narrowest the two-column panel is drawn at */
const PANEL_MIN_W = 560;
/** and the gutter it keeps either side at narrow widths */
const PANEL_GUTTER = 40;
/** the gap between the headline's baseline box and the panel's top */
const PANEL_HEAD_GAP = 22;
/** the least it will ever sit from the top of the window */
const PANEL_MIN_TOP = 20;
/** what it leaves below itself */
const PANEL_FOOT = 84;
/** the height to assume before the probe has reported, and the least
 *  a short window is allowed to squeeze the panel to */
const PANEL_FALLBACK_H = 467;
const PANEL_MIN_H = 300;

/** the box to assume before a window has been measured — a server
 *  render, a first paint, a test. It is Paper's popup at full scale,
 *  and it is a full `Rect` rather than a bare size so a consumer can
 *  hold one variable rather than a union of two shapes. */
export const PANEL_FALLBACK: Rect = {
  left: 0,
  top: PANEL_MIN_TOP,
  width: PANEL_W,
  height: PANEL_FALLBACK_H,
};

/** below this width the opened card's two columns stack. ExpandedCard
 *  takes the answer as a prop rather than from a media query of its
 *  own, so the probe that measures the height and the panel that is
 *  drawn can never be laid out for two different layouts. */
export const STACK_WIDTH = 520;

/** the panel's width on this window, at this layout scale */
export function panelWidth(scale: number): number {
  const scaled = Math.max(PANEL_MIN_W, Math.round(PANEL_W * scale));
  return Math.min(PANEL_W, scaled, window.innerWidth - PANEL_GUTTER);
}

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
 * falls back to the prototype's own default. `contentHeight` is what
 * the probe measured; without one the panel assumes Paper's height.
 */
export function expandedRect(
  head: Element | null,
  scale: number,
  contentHeight: number | null,
): Rect {
  const headBottom = head ? head.getBoundingClientRect().bottom : 120;
  const width = panelWidth(scale);
  const top = Math.max(PANEL_MIN_TOP, headBottom + PANEL_HEAD_GAP);
  const room = window.innerHeight - top - PANEL_FOOT;
  const height = Math.max(PANEL_MIN_H, Math.min(contentHeight ?? PANEL_FALLBACK_H, room));
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
