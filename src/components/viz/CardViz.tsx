import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { DataDotMatrix } from '../../vendor/pixel-motion/DataDotMatrix';
import { DOT_MATRIX_VIZ, isDataViz } from '../../vendor/pixel-motion/recipes/registry';
import { AmbientField } from './AmbientField';
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

   ------------------------------------------------------------
   TWO KINDS OF ENTRY, ONE SLOT.

   A registry entry is either a CHART — a `data-dot-matrix` recipe
   with the card's own series, which reveals column by column — or an
   AMBIENT FIELD, a procedural `dot-matrix` recipe with a seed and no
   data and no reveal. The recipe's own `type` says which, and that
   is the only thing branched on here.

   The two components take the same `className` and `ariaLabel`, so
   everything below the branch is identical: the same canvas class,
   the same `object-fit: contain`, the same mount point. Which one
   renders is not a layout question and cannot move anything.

   ------------------------------------------------------------
   RESTARTING ON TAB ENTRY IS NOT THIS FILE'S JOB, AND IT IS
   ALREADY DONE. Both components are remounted whenever the screen
   they sit on is entered, and a remount is a restart: the memo
   rebuilds the composition, the effect re-runs, and `startedAt`
   goes back to `performance.now()`.

   Two `key`s do it, and they are the only mechanism:

     · `AppLayout` wraps the outlet in `<div key={location.pathname}>`,
       so every nav tab — Insights included — remounts on entry.
     · `Home` wraps its view in `<div key={view}>`, so Patterns and
       Focus & vitals remount when you switch between them.

   Nothing else is needed and nothing here should add a second
   mechanism on top. Measured: entering Focus & vitals runs the
   canvas effect for all seven of its cards, entering Insights for
   all eight, and twenty wheel events inside any of the three screens
   run it zero times.

   THE RESTART IS NOW VISIBLE ON ALL THREE SCREENS. It was not,
   for one revision: a remount restarted the fifteen procedural
   fields exactly as it restarted the twelve Patterns cards, but a
   seeded drift at t=0 is the same picture as at t=30s, so there was
   no beginning to see. `AmbientField` gives them the same
   left-to-right sweep the Patterns cards have — the engine's own
   `revealAt`, the engine's own easing, the same 700ms — so entering
   a tab now looks like entering a tab everywhere.
   ============================================================ */
export function CardViz({ card, children, className }: CardVizProps) {
  const viz = DOT_MATRIX_VIZ[card.id];
  if (!viz) return <>{children}</>;

  if (isDataViz(viz)) {
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

  return (
    <AmbientField
      recipe={viz.recipe}
      className={cx(styles.canvas, styles.field, className)}
      ariaLabel={viz.ariaLabel}
    />
  );
}
