import { createDataDotMatrix, type CanvasRecipe, type DataDotMatrixRecipe } from '../engine';
import { DOT_MATRIX_VIZ, isDataViz, type DataVizEntry } from './registry';

/* ============================================================
   THE OPENED PATTERN'S DOT MATRIX — the same chart, cut for the
   well it opens into.

   The card in the hand draws its pattern as a data dot matrix cut at
   237x214, the shape of the fan card's graphic slot. The opened panel
   used to draw a plain area/line/bar chart in its big well instead,
   so the chart you picked up was not the chart you opened.

   It is the same chart now: same data, same colours, same palette,
   same chart type, same seed and the same reveal. What cannot be the
   same is the CUT. The panel's well is a wide landscape box — about
   370 across and 130-170 down on a desktop window — and
   `object-fit: contain` would
   letterbox the card's near-square recipe into a band down the middle
   of it. Stretching it instead would make the dots oval. So the
   opened panel gets recipes of its own.

   ------------------------------------------------------------
   THE GRID IS SIZED TO THE CONTAINER.

   · COLUMNS are fixed at 32. The well is ~380-394px wide at every
     target window (the panel is width-capped), and 32 columns at the
     card's own 3/2 pitch put the dot within a few percent of the size
     it is in the hand: the opened chart is made of the same material,
     not a blown-up version of it.
   · ROWS are PAPER'S CUT when the chart allows it. The pattern popup
     in Paper draws the tool's own export at 158x113 logical — 32
     columns by 23 rows — standing on the well's floor at the well's
     full width and cropped at its top, so a chart that only reaches a
     third of the way up its canvas fills half the well rather than
     lying in a band along its floor. That cut is taken whenever the
     chart's highest mark still stands inside the rows the well shows
     (`peak`, measured below); otherwise — a chart whose domain runs
     to its own maximum, which reaches the top row of any cut — the
     well takes the most rows that fit instead, so no chart is ever
     cropped. One recipe per row count, from 6 to 48, either way.

   The logical size snaps to whole cells (`count * pitch - gap`), so
   the engine's grid tiles the canvas exactly and no strip of bare
   background is left at an edge.

   ------------------------------------------------------------
   MODULE-LEVEL, FROZEN, BUILT ONCE — the same contract the registry
   keeps and for the same reason: `DataDotMatrix` memoizes on `recipe`
   and `data` by reference, and a recipe built during a render is a
   new reference every frame, which restarts the reveal forever. Every
   recipe below is made here, at load, and never again; the panel
   only ever LOOKS ONE UP. The series is the registry's own frozen
   array, shared by reference, so the opened chart cannot drift from
   the card's.
   ============================================================ */

/** columns across the opened well — see the note above */
export const EXPANDED_COLUMNS = 32;
/** the shallowest and the deepest well a recipe is cut for */
export const EXPANDED_MIN_ROWS = 6;
export const EXPANDED_MAX_ROWS = 48;
/** Paper's cut — the tool's 158x113 export, 32 x 23 at the card's pitch */
export const EXPANDED_CUT_ROWS = 23;

/** a nominal display size for the tool's `format` field: the well
 *  width at 1512x850, the window the recipes were checked against */
const NOMINAL_WIDTH = 386;

type Pitch = { pixelSize: number; gap: number };

/** the logical length that tiles `count` cells exactly */
const span = (count: number, { pixelSize, gap }: Readonly<Pitch>) => count * (pixelSize + gap) - gap;

/** one canvas per row count, shared by every pattern that uses it */
function canvasFor(rows: number, base: CanvasRecipe, pitch: Readonly<Pitch>): CanvasRecipe {
  const logicalWidth = span(EXPANDED_COLUMNS, pitch);
  const logicalHeight = span(rows, pitch);
  return {
    logicalWidth,
    logicalHeight,
    displayWidth: NOMINAL_WIDTH,
    displayHeight: Math.round((NOMINAL_WIDTH * logicalHeight) / logicalWidth),
    /* the card's well fill, so the palette is generated against the
       same ground and the tones come out identical */
    background: base.background,
  };
}

/** every row count's recipe for one pattern, indexed by row count */
export type ExpandedRecipes = Readonly<Record<number, DataDotMatrixRecipe>>;

export interface ExpandedVizEntry {
  recipes: ExpandedRecipes;
  data: DataVizEntry['data'];
  ariaLabel: string;
  /** the dot pitch every one of `recipes` is cut at — the card's own */
  pitch: Readonly<Pitch>;
  /** how many rows up from the floor the chart's highest mark stands
   *  in Paper's cut — the rows a well has to show to take that cut */
  peak: number;
}

/** how far up its canvas a recipe's marks reach, in rows */
function peakOf(recipe: DataDotMatrixRecipe, data: readonly number[]): number {
  const { composition } = createDataDotMatrix(recipe, data.slice());
  let top = composition.rows;
  for (const cell of composition.cells) top = Math.min(top, cell.row);
  return composition.rows - top;
}

/* All twelve Patterns recipes share one pitch and one canvas base,
   so the canvases are cut once and shared by reference across the
   twelve, exactly as the registry shares its CANVAS. */
const CANVASES = new Map<number, CanvasRecipe>();

function expand(entry: DataVizEntry): ExpandedVizEntry {
  const { recipe } = entry;
  const recipes: Record<number, DataDotMatrixRecipe> = {};
  for (let rows = EXPANDED_MIN_ROWS; rows <= EXPANDED_MAX_ROWS; rows += 1) {
    let canvas = CANVASES.get(rows);
    if (!canvas) {
      canvas = Object.freeze(canvasFor(rows, recipe.canvas, recipe.pixelStyle));
      CANVASES.set(rows, canvas);
    }
    /* the card's recipe with only the cut changed: visualization,
       seed, colour, comparison colours, pixel style, motion and
       domain are the card's own objects, by reference */
    recipes[rows] = Object.freeze({
      ...recipe,
      format: Object.freeze({
        ratio: 'custom' as const,
        width: canvas.displayWidth,
        height: canvas.displayHeight,
      }),
      canvas,
    });
  }
  return Object.freeze({
    recipes: Object.freeze(recipes),
    data: entry.data,
    ariaLabel: entry.ariaLabel,
    pitch: recipe.pixelStyle,
    peak: peakOf(recipes[EXPANDED_CUT_ROWS], entry.data),
  });
}

/** the opened panel's recipes, for every pattern the fan draws as a
 *  data matrix — keyed by the same pattern id as the registry */
export const EXPANDED_VIZ: Readonly<Record<string, ExpandedVizEntry>> = Object.freeze(
  Object.fromEntries(
    Object.entries(DOT_MATRIX_VIZ)
      .filter((pair): pair is [string, DataVizEntry] => isDataViz(pair[1]))
      .map(([id, entry]) => [id, expand(entry)]),
  ),
);

/**
 * The most rows whose recipe, drawn at the well's full width, still
 * stands inside its height. A pure function of the measured box and
 * the fixed pitch — it picks one of the frozen recipes above and never
 * builds anything.
 */
export function expandedRowsFor(width: number, height: number, pitch: Readonly<Pitch>): number {
  const logicalWidth = span(EXPANDED_COLUMNS, pitch);
  const logicalHeight = (logicalWidth * height) / Math.max(1, width);
  const rows = Math.floor((logicalHeight + pitch.gap) / (pitch.pixelSize + pitch.gap));
  return Math.min(EXPANDED_MAX_ROWS, Math.max(EXPANDED_MIN_ROWS, rows));
}

/**
 * Which cut a settled well draws: Paper's, cropped at the top, when
 * every mark of the chart stands inside the rows the well shows; the
 * most rows that fit when the well is deeper than Paper's cut or the
 * chart reaches higher than the well can show. A pure function of the
 * measured box and the entry — it picks one of the frozen recipes
 * above and never builds anything.
 */
export function expandedCutFor(width: number, height: number, entry: ExpandedVizEntry): number {
  const fits = expandedRowsFor(width, height, entry.pitch);
  if (fits >= EXPANDED_CUT_ROWS) return fits;
  return entry.peak <= fits ? EXPANDED_CUT_ROWS : fits;
}
