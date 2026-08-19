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

/** the rows each density step draws */
export const dotDensity = {
  low: 4,
  base: 6,
  high: 9,
} as const;

export type DotDensity = keyof typeof dotDensity;
