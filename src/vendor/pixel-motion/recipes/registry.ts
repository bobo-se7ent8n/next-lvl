import type {
  CanvasRecipe,
  ChartDomainMode,
  DataDotMatrixRecipe,
  DataFormatRecipe,
  DataMotionRecipe,
  DataPixelStyleRecipe,
  DataVisualization,
} from '../engine';
import { PATTERNS } from '../../../data/patterns';

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
   array built per render — in a component, in a hook, in a helper
   called from render — is a new reference every time. The animation
   would then restart every frame and the reveal would never advance
   past its first instant.

   Everything below is built ONCE, at module load: `matrix()` is
   called at the top level twelve times and never again, and the
   series are read out of `PATTERNS` here rather than in a component.
   The freeze pass at the foot is the guard rail — it makes the
   mistake loud at runtime instead of silent on screen.
   ============================================================ */

/* ---- THE SHARED BASE ------------------------------------------
   Every card is identical except visualization, color, domain,
   pixel style and seed. These five objects are shared by reference
   across all twelve recipes: nothing mutates them, so one copy is
   both cheaper and easier to keep honest than twelve. */

const FORMAT: DataFormatRecipe = { ratio: 'custom', width: 237, height: 214 };

/* Cut at 237x214, the tallest a fan card's graphic slot gets. The
   shorter slots (205) letterbox against it, which is `object-fit:
   contain` doing its job — see CardViz.module.css. Not a bug, and
   not to be "fixed" from this file. */
const CANVAS: CanvasRecipe = {
  logicalWidth: 96,
  logicalHeight: 87,
  displayWidth: 237,
  displayHeight: 214,
  background: '#F3F2EE',
};

const COMPARISON_COLORS: string[] = ['#93EAC3', '#FFE159', '#FF9868'];

const MOTION: DataMotionRecipe = {
  preset: 'drift',
  amount: 1,
  speed: 0.22,
  revealDuration: 1400,
  minOpacity: 0,
  maxOpacity: 1,
  changeFrequency: 1,
};

const STYLE_A: DataPixelStyleRecipe = { pixelSize: 2, gap: 1, density: 1 };
const STYLE_B: DataPixelStyleRecipe = { pixelSize: 2, gap: 2, density: 0.82 };

/** one recipe off the shared base. Called at module level only. */
function matrix(
  seed: number,
  visualization: DataVisualization,
  color: string,
  mode: ChartDomainMode,
  pixelStyle: DataPixelStyleRecipe,
): DataDotMatrixRecipe {
  return {
    type: 'data-dot-matrix',
    visualization,
    seed,
    format: FORMAT,
    canvas: CANVAS,
    color,
    comparisonColors: COMPARISON_COLORS,
    pixelStyle,
    motion: MOTION,
    domain: { mode },
  };
}

/* ---- THE SERIES ------------------------------------------------
   Each card feeds the matrix THE SAME NUMBERS its chart drew. They
   are read from `PATTERNS`, not retyped: a series that is edited in
   the data file must move the matrix with it, and a second copy
   here would silently stop tracking.

   Which field drives a card is the same question `PatternChart`
   answers — a `bars` card drew its `bars`, everything else drew its
   `series` — so the two readings cannot drift apart.

   Yes, this reaches out of `src/vendor/` into app data. `recipes/`
   is the one folder in this tree that is ours rather than upstream's
   (see ../README.md); the engine itself imports nothing from here. */
const byId = (id: string) => {
  const pattern = PATTERNS.find((candidate) => candidate.id === id);
  if (!pattern) throw new Error(`registry: no pattern with id "${id}"`);
  return pattern;
};

/** a sparkline/area card's own series */
const series = (id: string): number[] => byId(id).series.slice();

/** a bar card's own bars, reduced to the numbers the bars encoded */
const barValues = (id: string): number[] => byId(id).bars.map((bar) => bar.value);

export const DOT_MATRIX_VIZ: Record<string, VizEntry> = {
  /* Patterns — all twelve cards in the fan. */
  rushing: {
    recipe: matrix(73129, 'area-zone', '#A6DBFF', 'zero-to-100', STYLE_A),
    data: series('rushing'),
    ariaLabel: 'Rushing under pressure, release time across six sessions',
  },
  recovers: {
    recipe: matrix(21847, 'comparison', '#93EAC3', 'auto', STYLE_A),
    data: barValues('recovers'),
    ariaLabel: 'Recovery after makes, next-possession shooting by situation',
  },
  contested3: {
    recipe: matrix(60412, 'area-zone', '#FF9868', 'zero-to-100', STYLE_A),
    data: barValues('contested3'),
    ariaLabel: 'Contested-3 confidence, shooting against three closeout types',
  },
  leftwing: {
    recipe: matrix(38265, 'area-zone', '#C4B5FF', 'zero-to-100', STYLE_A),
    data: series('leftwing'),
    ariaLabel: 'Left-wing hesitation, pause before the gather across six sessions',
  },
  firststep: {
    recipe: matrix(91730, 'area-zone', '#A6DBFF', 'zero-to-100', STYLE_A),
    data: series('firststep'),
    ariaLabel: 'First-step quickening, acceleration across six sessions',
  },
  finishing: {
    recipe: matrix(54098, 'comparison', '#A6DBFF', 'auto', STYLE_A),
    data: barValues('finishing'),
    ariaLabel: 'Finishing through contact, three kinds of look at the rim',
  },
  fatigue: {
    recipe: matrix(17356, 'area-zone', '#FFB0CD', 'zero-to-100', STYLE_B),
    data: series('fatigue'),
    ariaLabel: 'Fatigue shifts shot mix, pull-up share across four sessions',
  },
  handle: {
    recipe: matrix(82914, 'comparison', '#FFB0CD', 'zero-to-100', STYLE_B),
    data: barValues('handle'),
    ariaLabel: 'Handle tightens late, dribble variance early to late',
  },
  freethrow: {
    recipe: matrix(45602, 'area-zone', '#FFE159', 'zero-to-100', STYLE_B),
    data: series('freethrow'),
    ariaLabel: 'Free-throw rhythm, percentage across six make-streaks',
  },
  corner3: {
    recipe: matrix(29187, 'area-zone', '#FF9868', 'zero-to-100', STYLE_B),
    data: series('corner3'),
    ariaLabel: 'Corner-3 footwork, setup score across six sessions',
  },
  ballsec: {
    recipe: matrix(70543, 'area-zone', '#C4B5FF', 'zero-to-100', STYLE_B),
    data: series('ballsec'),
    ariaLabel: 'Ball security, clean possessions across six sessions',
  },
  routine: {
    recipe: matrix(36821, 'area-zone', '#A6DBFF', 'zero-to-100', STYLE_B),
    data: series('routine'),
    ariaLabel: 'Pre-shot routine drift, consistency across three sessions',
  },
};

/* THE SEEDS ARE DELIBERATELY ALL DIFFERENT. The ambient flicker is
   seeded per composition, so twelve cards sharing a seed would
   shimmer in lockstep and the fan would read as one animation cut
   into twelve windows. Do not normalise them. */

/* Frozen as a statement rather than through `Object.freeze`'s return
   value on purpose: the return type is `Readonly<T>`, which would
   force a cast against the engine's own `data: number[]` prop. Called
   this way the objects are genuinely immutable at runtime and the
   types stay exactly as declared above. */
for (const shared of [FORMAT, CANVAS, COMPARISON_COLORS, MOTION, STYLE_A, STYLE_B]) {
  Object.freeze(shared);
}
for (const entry of Object.values(DOT_MATRIX_VIZ)) {
  Object.freeze(entry.recipe);
  Object.freeze(entry.recipe.domain);
  Object.freeze(entry.data);
  Object.freeze(entry);
}
Object.freeze(DOT_MATRIX_VIZ);
