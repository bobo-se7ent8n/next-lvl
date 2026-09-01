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
  /** the recessed inner container — chart wells, candidate blocks */
  lg: '24px',
  /** every card, panel and object shell in the product */
  card: '28px',
  /* THE FLOATING WINDOW, and it is a step above `card` on purpose.

     Two things on the landing page are not objects resting on the
     paper but windows floating over it — the sticky bar and the
     closing block. A window reads as further forward than a card,
     and the corner is the cheapest way to say so; at `card` they sat
     at the same depth as the pattern cards behind them. */
  window: '36px',
  pill: '999px',
} as const;

export type RadiusStep = keyof typeof radius;
