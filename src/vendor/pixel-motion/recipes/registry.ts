import {
  createDataCanvas,
  type CanvasRecipe,
  type ChartDomainMode,
  type DataDotMatrixRecipe,
  type DataFormatRecipe,
  type DataMotionRecipe,
  type DataPixelStyleRecipe,
  type DataVisualization,
  type DotMatrixRecipe,
  type MotionPreset,
  type PixelStyleRecipe,
} from '../engine';
import { PATTERNS } from '../../../data/patterns';

/* ---- THE TWO KINDS OF ENTRY -----------------------------------
   A card either draws ITS OWN NUMBERS or it draws a seeded field,
   and those are different recipes with different shapes — not one
   shape with half its fields ignored.

   `data-dot-matrix` is a chart: a series goes in, the reveal walks
   the field column by column, and the marks mean something. That is
   the twelve Patterns cards.

   `dot-matrix` is ambient: a seed goes in and nothing else, there is
   no reveal phase at all, and the field means nothing beyond "this
   card is alive". That is the seven Focus & vitals cards and the
   eight Insights cards, none of which had a series worth encoding.

   Do NOT flatten these back into one interface with optional
   fields. The procedural recipe has no `format`, no `domain`, no
   `visualization`, no `density` and no `revealDuration`, and its
   motion is top-level rather than under `motion` — an optional-field
   union would let a nonsense recipe type-check. */
export interface DataVizEntry {
  recipe: DataDotMatrixRecipe;
  data: number[];
  ariaLabel: string;
}

export interface ProceduralVizEntry {
  recipe: DotMatrixRecipe;
  ariaLabel: string;
}

export type VizEntry = DataVizEntry | ProceduralVizEntry;

/* The discriminant lives on `recipe.type`, one level down, and
   TypeScript narrows a union only on a discriminant it can reach at
   the top level. This predicate is that one step, written once here
   rather than as a cast at the call site. */
export const isDataViz = (entry: VizEntry): entry is DataVizEntry => (
  entry.recipe.type === 'data-dot-matrix'
);

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
   called at the top level twelve times, `ambient()` fifteen, neither
   ever again, and the series are read out of `PATTERNS` here rather
   than in a component. `PixelAnimation` memoizes on `recipe` by
   reference in exactly the way `DataDotMatrix` memoizes on `recipe`
   and `data`, so the rule is the same for both halves of the table.
   The freeze pass at the foot is the guard rail — it makes the
   mistake loud at runtime instead of silent on screen.
   ============================================================ */

/* ---- THE SHARED BASE ------------------------------------------
   Every card is identical except visualization, color, domain and
   seed. These five objects — format, canvas, comparison colours,
   motion and the pixel style — are shared by reference across all
   twelve recipes: nothing mutates them, so one copy is both cheaper
   and easier to keep honest than twelve.

   `matrix()` still takes the pixel style as an argument even though
   all twelve pass the same one. It is the axis a per-card table is
   written along, and threading it keeps the call sites readable as
   a table rather than as twelve calls with a hidden constant. */

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
  revealDuration: 700,
  minOpacity: 0,
  maxOpacity: 1,
  changeFrequency: 1,
};

/* ONE STYLE FOR THE WHOLE FAN.

   There used to be two — a tight one and a sparser one — and the
   split did nothing a reader could name: two cards side by side in
   the same hand had different dot pitches for no reason the data
   gave. A pitch of 5 (3px dot, 2px gap) over the 96x87 logical field
   lands on a 19x17 grid, which is coarse enough that the dots read as
   dots rather than as a texture. Shared by reference across all
   twelve recipes. */
const PIXEL_STYLE: DataPixelStyleRecipe = { pixelSize: 3, gap: 2, density: 1 };

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

/* ============================================================
   THE PROCEDURAL BASE — FOCUS & VITALS, AND INSIGHTS.

   Fifteen cards, one ambient field each. There is no series here and
   there is nothing to encode: these cards were drawing a `DotMatrix`
   metaphor (a held gap, a compression, a collapsing interval) or a
   six-point sparkline, and neither is a reading a dot matrix could
   carry honestly. So they get the engine's PROCEDURAL recipe — a
   seeded field that drifts and nothing else.

   ALL FIFTEEN SHARE ONE PITCH AND ONE MOTION SETTING — 1/1, full
   amount, the whole 0..1 opacity range, and one speed. THE PRESET IS
   THE ONE PER-CARD AXIS: fourteen of the fifteen name their own, and
   no two that sit next to each other on screen name the same. Six
   wells in a block wearing one preset and four of them one colour
   read as a single animation cut into windows rather than as six
   readings, and the eight-card library had the same problem one tab
   over. What is still shared is a named constant shared by reference
   rather than a literal repeated fifteen times: the day the drift is
   retuned it is retuned once.

   `focus` IS THE EXCEPTION, DELIBERATELY. It is the one card on
   Focus & vitals that is not a body reading — it is the week's
   argument, and it was reading as a seventh vital because it wore
   the same field as the six beside it. It gets pink instead of a
   palette hue and a speed of its own. It shares `pulse` with `load`
   and with `handle-fatigue` a tab away, and on its own colour, its
   own tempo and its own panel that repeat does not read as a pair.
   Its recipe is spelled out below rather than built by `ambient()`,
   because a card that is meant to look different should not be one
   argument away from the others.

   THE REVEAL IS NOT IN THESE RECIPES, AND CANNOT BE.
   `DotMatrixRecipe` has no `revealDuration` field — that is a
   data-recipe idea upstream. The sweep these cards make on entry
   belongs to `components/viz/AmbientField`, which hosts them and
   drives `revealProgress` itself; the same file also fits the grid
   to the well, which is why the cuts below are only nominal.
   ============================================================ */

/** the well every one of these fields sits in — `surface-level1` */
const AMBIENT_BACKGROUND = '#F3F2EE';

/* 1px dot, 1px gap — A FINER MATERIAL THAN THE FAN, ON PURPOSE, AND
   ONE PITCH FOR ALL FIFTEEN.

   These fifteen ran at the fan's own 3/2 for one revision and the
   dots read as tiles rather than as a field: nineteen columns across
   a 295px card is a coarse enough grid that you count them. At 1/1
   the 96-wide logical field `AmbientField` refits to carries 48
   columns, the dot lands near 3px on screen, and the card reads as a
   texture with a shape in it rather than as a low-resolution chart.

   THE SIX VITALS WERE BRIEFLY COARSER — 2/1, 32 columns — on the
   theory that a small shallow well needs a bigger mark before the
   shape in it can be read. On screen it did not buy the shape; it
   just made the six look like a different product from the panel
   beside them and the library one tab over. The distinction those
   six needed turned out to be colour and motion, both of which they
   now have, so the pitch went back to being the one thing every
   ambient field in the product shares.

   The twelve Patterns cards keep 3/2. They ARE readings — you are
   meant to see the individual marks — and that is the difference the
   two pitches carry. */
const AMBIENT_PIXEL_STYLE: PixelStyleRecipe = { pixelSize: 1, gap: 1 };

/* The motion every ambient field shares. Full variation, slow, and
   the flicker allowed to run the entire 0..1 opacity range — a field
   that goes all the way out and all the way back rather than
   shimmering inside a band. All fifteen keep the amount, the opacity
   range and the change frequency; the speed too, except `focus`.

   THERE IS NO `AMBIENT_PRESET` ANY MORE, and its absence is the
   point. It named `random-drift` as the default every ambient card
   fell back to, which is precisely the arrangement that made three
   screens' worth of fields read as one field. Fourteen of the
   fifteen name their preset at the call site now; `random-drift` is
   simply one of the five, spelled out twice, rather than the thing
   you get by not choosing. */
const AMBIENT_MOTION_AMOUNT = 1;
const AMBIENT_SPEED = 0.18;
const AMBIENT_MIN_OPACITY = 0;
const AMBIENT_MAX_OPACITY = 1;
const AMBIENT_CHANGE_FREQUENCY = 1;

/** `focus` alone: a radial pulse rather than an untimed drift */
const FOCUS_PRESET = 'pulse' as const;
const FOCUS_SPEED = 0.23;

/* ---- THE CUT IS NOMINAL NOW, AND THAT IS THE POINT -------------
   These recipes used to carry a logical grid measured against one
   well at one viewport, arrived at by cutting, re-measuring and
   re-cutting until the numbers stopped moving. It worked at 1512x850
   and nowhere else: a well's ratio changes with the viewport — the
   six vitals are stretched to whatever the Focus card beside them
   needs, and that height moves with every reflow — so a fixed grid
   letterboxed into a band at every other width.

   `AmbientField` fits the ROW COUNT to the well it is actually
   standing in, and snaps the grid so the dots tile the canvas
   exactly. The numbers below are therefore only the first frame's
   worth: a sensible starting shape, one per well, before the
   measurement lands. Nothing downstream depends on them being right
   to the pixel, and re-measuring them is no longer a maintenance
   task.

   `canvas.background` is NOT nominal — it is the well's own fill and
   it is what the renderer clears to on every frame. */
const wellCanvas = (displayWidth: number, displayHeight: number): CanvasRecipe => (
  createDataCanvas(
    { ratio: 'custom', width: displayWidth, height: displayHeight },
    AMBIENT_BACKGROUND,
  )
);

/** the Focus panel's tall well, the largest slot on either screen */
const FOCUS_WELL = wellCanvas(348, 301);
/** a vital's well — six cards, three legends, three shapes to start from */
const STRESS_WELL = wellCanvas(274, 82);
const HRV_WELL = wellCanvas(274, 123);
const CARDIO_WELL = wellCanvas(274, 138);
const RESILIENCE_WELL = wellCanvas(274, 96);
const LOAD_WELL = wellCanvas(274, 114);
/** every library well IS the same landscape frame, by design */
const INSIGHT_WELL = wellCanvas(273, 165);

/** one ambient recipe off the shared base. Called at module level only.
 *
 *  `preset` is an argument and the pixel style is not, and that split
 *  is the whole arrangement in one line: the pitch is the material
 *  every ambient field is made of, the preset is what each one does.
 *  Threading the preset keeps the call sites readable as a table. */
function ambient(
  seed: number,
  color: string,
  canvas: CanvasRecipe,
  preset: MotionPreset,
): DotMatrixRecipe {
  return {
    type: 'dot-matrix',
    preset,
    seed,
    canvas,
    color,
    pixelStyle: AMBIENT_PIXEL_STYLE,
    motionAmount: AMBIENT_MOTION_AMOUNT,
    speed: AMBIENT_SPEED,
    minOpacity: AMBIENT_MIN_OPACITY,
    maxOpacity: AMBIENT_MAX_OPACITY,
    changeFrequency: AMBIENT_CHANGE_FREQUENCY,
  };
}

/* THE ONE RECIPE WRITTEN OUT IN FULL. The same pitch, the same
   opacity range and the same full motion amount as the other
   fourteen; its own colour and its own speed. Spelled out rather than
   threaded through `ambient()` as two more arguments — the difference
   is the point of the card, so it should be readable in one place. */
const FOCUS_RECIPE: DotMatrixRecipe = {
  type: 'dot-matrix',
  preset: FOCUS_PRESET,
  seed: 48291,
  canvas: FOCUS_WELL,
  color: '#FFB0CD',
  pixelStyle: AMBIENT_PIXEL_STYLE,
  motionAmount: AMBIENT_MOTION_AMOUNT,
  speed: FOCUS_SPEED,
  minOpacity: AMBIENT_MIN_OPACITY,
  maxOpacity: AMBIENT_MAX_OPACITY,
  changeFrequency: AMBIENT_CHANGE_FREQUENCY,
};

/* ---- THE SIX VITALS ARE ASSIGNED; EVERYTHING ELSE IS READ -------
   THE SIX VITALS ARE A PALETTE NOW, ON PURPOSE, AND THIS SUPERSEDES
   THE OLD RULE FOR THEM. Each used to carry the hue its own card was
   already drawing — `src/data/vitals.ts`, a chart's `tone` — and
   four of the six came back MINT. Six wells in one two-by-three
   block, four of them the same green, is the whole reason the screen
   read flat. So the six are assigned here instead, laid out against
   the grid they actually sit in (row 1: stress, hrv, rhr / row 2:
   cardio, resilience, load) so that no two neighbours, across or
   down, share a hue:

       stress ORANGE      hrv MINT           rhr  BLUE
       cardio YELLOW      resilience LILAC   load ORANGE

   The one repeat, ORANGE, is the diagonal — the furthest apart six
   positions allow. Their hue no longer tracks the card's chart, and
   editing `vitals.ts` will not move it.

   EVERY OTHER HEX BELOW IS STILL READ, NOT ASSIGNED — the hue that
   card is drawing TODAY, taken from the component or the data that
   draws it. Nothing there is a new palette and nothing cycles.

   · `focus`      also assigned, for the older reason. It was read
     from `FocusPanel.tsx` (`accent="lilac"`) like the rest and that
     is exactly what made it read as a seventh vital: lilac is a
     palette hue and the vitals wear palette hues. It wears
     `colorFace.pink` (`#FFB0CD`) now — a face colour, which carries
     no meaning slot in the charts and so claims no reading.
   · the twelve Patterns  the card's own chart hue, read from the
     component or the data that draws it.
   · the eight insights  InsightCard.tsx maps `insight.kind` through
     its local `KIND_TONE`: DRILL -> mint, LESSON -> lilac,
     VIDEO -> blue. The kinds are in `src/data/insights.ts`.

   The hexes themselves are `colorData` from `src/tokens/color.ts`,
   written literally here because this folder is exempt from the
   token rules (see ../README.md) and because `KIND_TONE` is private
   to its component — reading it would mean editing app code, which
   registering a recipe must never require. */
const MINT = '#93EAC3';
const YELLOW = '#FFE159';
const LILAC = '#C4B5FF';
const BLUE = '#A6DBFF';
const ORANGE = '#FF9B68';

export const DOT_MATRIX_VIZ: Record<string, VizEntry> = {
  /* Patterns — all twelve cards in the fan. */
  rushing: {
    recipe: matrix(73129, 'area-zone', '#93EAC3', 'zero-to-100', PIXEL_STYLE),
    data: series('rushing'),
    ariaLabel: 'Rushing under pressure, release time across six sessions',
  },
  recovers: {
    recipe: matrix(21847, 'comparison', '#93EAC3', 'auto', PIXEL_STYLE),
    data: barValues('recovers'),
    ariaLabel: 'Recovery after makes, next-possession shooting by situation',
  },
  contested3: {
    recipe: matrix(60412, 'area-zone', '#FF9868', 'zero-to-100', PIXEL_STYLE),
    data: barValues('contested3'),
    ariaLabel: 'Contested-3 confidence, shooting against three closeout types',
  },
  leftwing: {
    recipe: matrix(38265, 'area-zone', '#C4B5FF', 'zero-to-100', PIXEL_STYLE),
    data: series('leftwing'),
    ariaLabel: 'Left-wing hesitation, pause before the gather across six sessions',
  },
  firststep: {
    recipe: matrix(91730, 'area-zone', '#A6DBFF', 'auto', PIXEL_STYLE),
    data: series('firststep'),
    ariaLabel: 'First-step quickening, acceleration across six sessions',
  },
  finishing: {
    recipe: matrix(54098, 'comparison', '#A6DBFF', 'auto', PIXEL_STYLE),
    data: barValues('finishing'),
    ariaLabel: 'Finishing through contact, three kinds of look at the rim',
  },
  fatigue: {
    recipe: matrix(17356, 'area-zone', '#FFB0CD', 'zero-to-100', PIXEL_STYLE),
    data: series('fatigue'),
    ariaLabel: 'Fatigue shifts shot mix, pull-up share across four sessions',
  },
  handle: {
    recipe: matrix(82914, 'comparison', '#FFB0CD', 'auto', PIXEL_STYLE),
    data: barValues('handle'),
    ariaLabel: 'Handle tightens late, dribble variance early to late',
  },
  freethrow: {
    recipe: matrix(45602, 'area-zone', '#FFE159', 'zero-to-100', PIXEL_STYLE),
    data: series('freethrow'),
    ariaLabel: 'Free-throw rhythm, percentage across six make-streaks',
  },
  corner3: {
    recipe: matrix(29187, 'area-zone', '#FF9868', 'zero-to-100', PIXEL_STYLE),
    data: series('corner3'),
    ariaLabel: 'Corner-3 footwork, setup score across six sessions',
  },
  ballsec: {
    recipe: matrix(70543, 'area-zone', '#C4B5FF', 'zero-to-100', PIXEL_STYLE),
    data: series('ballsec'),
    ariaLabel: 'Ball security, clean possessions across six sessions',
  },
  routine: {
    recipe: matrix(36821, 'area-zone', '#A6DBFF', 'zero-to-100', PIXEL_STYLE),
    data: series('routine'),
    ariaLabel: 'Pre-shot routine drift, consistency across three sessions',
  },

  /* Focus & vitals — the Focus panel plus all six vitals. Six hues
     and six presets over one shared pitch: the notes above are this
     table. */
  focus: {
    recipe: FOCUS_RECIPE,
    ariaLabel: 'Focus, an ambient field behind this week\u2019s release reading',
  },
  stress: {
    recipe: ambient(63194, ORANGE, STRESS_WELL, 'wave'),
    ariaLabel: 'Stress, an ambient field behind the arousal reading',
  },
  hrv: {
    recipe: ambient(27508, MINT, HRV_WELL, 'flow'),
    ariaLabel: 'HRV, an ambient field behind the beat-to-beat reading',
  },
  rhr: {
    recipe: ambient(85073, BLUE, HRV_WELL, 'sweep'),
    ariaLabel: 'Resting heart rate, an ambient field behind the reading',
  },
  cardio: {
    recipe: ambient(31642, YELLOW, CARDIO_WELL, 'gather'),
    ariaLabel: 'Cardio capacity, an ambient field behind the VO\u2082 estimate',
  },
  resilience: {
    recipe: ambient(79285, LILAC, RESILIENCE_WELL, 'random-drift'),
    ariaLabel: 'Resilience, an ambient field behind the recovery reading',
  },
  load: {
    recipe: ambient(50937, ORANGE, LOAD_WELL, 'pulse'),
    ariaLabel: 'Activity load, an ambient field behind the volume reading',
  },

  /* ---- Insights — all eight library cards -----------------------
     THE SAME FIVE PRESETS THE VITALS WEAR, MINUS `wave`. They were
     eight `random-drift` fields, which on a grid of identically sized
     wells is one animation shown eight times: the library read as a
     single texture with cards cut out of it. `wave` is held back
     because it is the most legible gesture of the six and it belongs
     to `stress`, the first reading on the other screen — spending it
     here would cost that card the thing that makes it first.

     THE CYCLE OF FIVE IS LOAD-BEARING AGAINST THE ROUND-ROBIN. The
     library packs its cards into columns with `columnize` (i % count,
     see lib/columns.ts) at three columns, two, or one depending on
     width. Five presets over eight cards put the two repeats five
     apart, and five is coprime with 3, 2 and 1 — so no column, at any
     of the three widths, ever stacks a preset directly above itself.
     Re-order these eight and that property has to be re-checked. */
  breath: {
    recipe: ambient(14806, MINT, INSIGHT_WELL, 'flow'),
    ariaLabel: 'Breath before the gather, an ambient field for this drill',
  },
  closeout: {
    recipe: ambient(35719, MINT, INSIGHT_WELL, 'sweep'),
    ariaLabel: 'Closeout release reps, an ambient field for this drill',
  },
  'rushing-lesson': {
    recipe: ambient(21895, LILAC, INSIGHT_WELL, 'gather'),
    ariaLabel: 'What rushing feels like, an ambient field for this lesson',
  },
  'film-pressure': {
    recipe: ambient(68351, BLUE, INSIGHT_WELL, 'random-drift'),
    ariaLabel: 'Film on pressure possessions, an ambient field for this video',
  },
  'handle-fatigue': {
    recipe: ambient(80462, MINT, INSIGHT_WELL, 'pulse'),
    ariaLabel: 'Handle under fatigue, an ambient field for this drill',
  },
  reset: {
    recipe: ambient(76403, LILAC, INSIGHT_WELL, 'flow'),
    ariaLabel: 'Pre-game reset routine, an ambient field for this lesson',
  },
  sleep: {
    recipe: ambient(92047, BLUE, INSIGHT_WELL, 'sweep'),
    ariaLabel: 'Sleep and decision speed, an ambient field for this video',
  },
  ladder: {
    recipe: ambient(47130, MINT, INSIGHT_WELL, 'gather'),
    ariaLabel: 'Two-ball dribble ladder, an ambient field for this drill',
  },
};

/* THE SEEDS ARE DELIBERATELY ALL DIFFERENT — all twenty-seven of
   them, across both halves of the table. The ambient flicker is
   seeded per composition, so cards sharing a seed would shimmer in
   lockstep and a screen would read as one animation cut into
   windows. It matters most on the fifteen procedural cards, where
   the seed is the ONLY thing separating one field from the next:
   eight Insights wells are the same size, the same grid and, for the
   four drills, the same colour, so an identical seed would make four
   visibly identical animations. Do not normalise them. */

/* Frozen as a statement rather than through `Object.freeze`'s return
   value on purpose: the return type is `Readonly<T>`, which would
   force a cast against the engine's own `data: number[]` prop. Called
   this way the objects are genuinely immutable at runtime and the
   types stay exactly as declared above. */
for (const shared of [
  FORMAT,
  CANVAS,
  COMPARISON_COLORS,
  MOTION,
  PIXEL_STYLE,
  AMBIENT_PIXEL_STYLE,
  FOCUS_WELL,
  STRESS_WELL,
  HRV_WELL,
  CARDIO_WELL,
  RESILIENCE_WELL,
  LOAD_WELL,
  INSIGHT_WELL,
]) {
  Object.freeze(shared);
}
for (const entry of Object.values(DOT_MATRIX_VIZ)) {
  Object.freeze(entry.recipe);
  if (isDataViz(entry)) {
    Object.freeze(entry.recipe.domain);
    Object.freeze(entry.data);
  }
  Object.freeze(entry);
}
Object.freeze(DOT_MATRIX_VIZ);
