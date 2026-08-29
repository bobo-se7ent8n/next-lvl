/* ============================================================
   GRAPHIC

   The dot matrix is the product's only illustration language, so
   its invariants live in the token layer rather than in any one
   component: one dot size, one base pitch, one corner. Every
   instance varies local spacing, opacity, omission and phase —
   never the dot itself.

   These are numbers rather than CSS lengths because the graphics
   are drawn in an SVG user-space grid. Like `inkVariation`, they
   are consumed from TypeScript and are not projected onto :root.
   ============================================================ */

export const dotMatrix = {
  /** the edge of one dot, in grid units */
  size: 6,
  /** the base distance between dot centres */
  pitch: 14,
  /** squircle-ish, never a circle and never a hard square */
  corner: 1.8,
  /** the quietest a dot ever gets before it is simply omitted */
  minOpacity: 0.16,
  /** the brightest a dot ever gets */
  maxOpacity: 1,
} as const;

/* ------------------------------------------------------------
   THE ILLUSTRATION WELL

   One frame for every card graphic in the library. It used to be
   the item's own `ratio`, which described the SUBJECT rather than
   the frame — so a column of insight cards had wells from 114px to
   200px tall and none of them lined up.

   Landscape, and deliberately: a card is a vertical stack of rows,
   and a wide short graphic reads as one of those rows. A tall one
   competes with the card for what the card is about.
   ------------------------------------------------------------ */
export const graphicWell = {
  /** the frame's proportions, as its two terms */
  w: 16,
  h: 9,
  /** and as a CSS `aspect-ratio` value */
  ratio: '16 / 9',
} as const;

/* ------------------------------------------------------------
   THE FLOOR UNDER A DIAGRAM WELL

   The court and the arc used to set their own height from their
   width via `aspect-ratio`, which made them the tallest thing in
   the bento on a wide-but-short window. They flex now, and these
   are the floors that stop them collapsing to a sliver when the
   card is short — expressed against the VIEWPORT height so they
   shrink with it rather than pinning a fixed minimum.
   ------------------------------------------------------------ */
export const wellFloor = {
  /** the half court — the taller of the two drawings */
  court: 'min(38svh, 320px)',
  /** the shot arc, which is landscape and needs less */
  arc: 'min(22svh, 180px)',
} as const;

/** the rows each density step draws */
export const dotDensity = {
  low: 4,
  base: 6,
  high: 9,
} as const;

export type DotDensity = keyof typeof dotDensity;
