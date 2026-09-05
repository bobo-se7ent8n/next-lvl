import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { DataDotMatrix } from '../../vendor/pixel-motion/DataDotMatrix';
import { DOT_MATRIX_VIZ } from '../../vendor/pixel-motion/recipes/registry';
import styles from './CardViz.module.css';

/** anything that can stand in a card's graphic slot. Structural on
 *  purpose: `Pattern`, `Vital`, `Insight` and the `FOCUS` singleton
 *  all satisfy it without any of them importing this file. */
export interface VizCard {
  id: string;
}

export interface CardVizProps {
  /** the card whose id is looked up in the registry */
  card: VizCard;
  /** the chart this card draws when it has no registry entry. This is
   *  the DEFAULT path and it is what almost every card takes. */
  children: ReactNode;
  className?: string;
}

/* ============================================================
   ONE MOUNT POINT FOR THE DOT MATRIX, ON ALL THREE SCREENS.

   Patterns, Focus & vitals and Insights draw four different charts
   between them — PatternChart, BarSet/AreaChart/Sparkline, and two
   DotMatrix fields — in four differently-styled containers. What they
   now share is this one question, asked in one place: does this card
   have a recipe? If it does, the canvas stands in the slot; if it
   does not, `children` renders and the card is untouched.

   THE CONTAINER IS NOT THIS COMPONENT'S BUSINESS. Each screen keeps
   its own graphic slot exactly as it was — its flex, padding, radius,
   background, box-shadow and overflow are all still declared by that
   screen's own stylesheet. This swaps what stands INSIDE the slot,
   never the slot itself, which is why adding a recipe cannot move
   anything on a page.

   `children` is a React element either way, but building an element
   is not rendering one: when a registry entry wins, the chart below
   is never mounted and does no work.
   ============================================================ */
export function CardViz({ card, children, className }: CardVizProps) {
  const viz = DOT_MATRIX_VIZ[card.id];
  if (!viz) return <>{children}</>;

  return (
    <DataDotMatrix
      recipe={viz.recipe}
      data={viz.data}
      autoPlay
      className={cx(styles.canvas, className)}
      ariaLabel={viz.ariaLabel}
    />
  );
}
