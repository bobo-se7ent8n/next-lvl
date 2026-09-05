import type { DataDotMatrixRecipe } from '../engine';
import { RUSHING_RECIPE, RUSHING_SERIES } from './rushingUnderPressure';

export interface VizEntry {
  recipe: DataDotMatrixRecipe;
  data: number[];
  ariaLabel: string;
}

/* ============================================================
   THE ONE LOOKUP POINT.

   A card on Patterns, Focus & vitals or Insights opts into a dot
   matrix by having an entry here under its own id — the id from its
   data source, listed in `docs/viz-cards.md`. Nothing else changes:
   `CardViz` reads this table on every one of those screens, and a
   card with no entry renders exactly the chart it rendered before.

   NEVER KEY ON ARRAY INDEX. The fan reorders, and the columns on
   Insights round-robin; the id is the only thing that survives both.

   ------------------------------------------------------------
   EVERY RECIPE AND EVERY SERIES IS A MODULE-LEVEL CONSTANT, AND
   THIS IS LOAD-BEARING — DO NOT "CLEAN IT UP" INTO INLINE LITERALS.

   `DataDotMatrix` memoizes its composition on `recipe` and `data` BY
   REFERENCE, and `DotMatrixCanvas` restarts its requestAnimationFrame
   loop whenever that composition's identity changes. An object or an
   array written inline — in this file's entries, in a helper that
   builds them, or at a call site — is a new reference on every
   render. The animation would then restart every frame and the
   reveal would never advance past its first instant.

   The freeze pass below is the guard rail: it makes the mistake loud
   at runtime instead of silent on screen. It runs once, at module
   load, and costs nothing afterwards.
   ============================================================ */
export const DOT_MATRIX_VIZ: Record<string, VizEntry> = {
  /* Patterns · card id `rushing` — "Rushing under pressure" */
  rushing: {
    recipe: RUSHING_RECIPE,
    data: RUSHING_SERIES,
    ariaLabel: 'Rushing under pressure, six sessions',
  },
};

/* Frozen as a statement rather than through `Object.freeze`'s return
   value on purpose: the return type is `Readonly<T>`, which would
   force a cast against the engine's own `data: number[]` prop. Called
   this way the objects are genuinely immutable at runtime and the
   types stay exactly as declared above. */
for (const entry of Object.values(DOT_MATRIX_VIZ)) {
  Object.freeze(entry.recipe);
  Object.freeze(entry.data);
  Object.freeze(entry);
}
Object.freeze(DOT_MATRIX_VIZ);
