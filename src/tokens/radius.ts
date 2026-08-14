/* ============================================================
   RADIUS

   Squircle-family radii. The card scale is generous on purpose —
   the object language of this product is a soft rectangle, not a
   rounded box. `pill` is the only fully-round token.
   ============================================================ */

export const radius = {
  none: '0px',
  /** the smallest corner in the system — a calendar cell */
  xxs: '3px',
  xs: '5px',
  sm: '10px',
  md: '16px',
  lg: '22px',
  /** the pattern-fan card */
  card: '26px',
  /** a panel in the bento grid */
  panel: '30px',
  /** the largest object shell */
  shell: '38px',
  pill: '999px',
} as const;

export type RadiusStep = keyof typeof radius;
