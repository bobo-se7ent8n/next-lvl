/* ============================================================
   RADIUS

   Seven squircle radii. The card corner is generous on purpose —
   the object language of this product is a soft rectangle, not a
   rounded box. `pill` is the only fully-round token.

   Collapsed from ten: xxs folded into xs, and panel and shell
   folded into card, because three near-identical large corners
   were three ways of saying the same thing.
   ============================================================ */

export const radius = {
  none: '0px',
  /** the smallest corner in the system — a dot, a calendar cell */
  xs: '4px',
  sm: '10px',
  md: '16px',
  lg: '22px',
  /** every card, panel and object shell in the product */
  card: '28px',
  pill: '999px',
} as const;

export type RadiusStep = keyof typeof radius;
