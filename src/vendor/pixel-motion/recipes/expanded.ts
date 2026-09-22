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
   390 across and 200-300 down at every target window, depending on
   how long the pattern's text runs — and `object-fit: contain` would
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
   · ROWS follow the well's measured shape. One recipe per row count,
     from 6 to 48, and the panel takes the most rows that fit: the
     canvas spans the well's full width exactly and stands on its
     floor, the way every chart in a well does, and what is left over
     is less than one row of the well's own ground at the top.

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

/** where one bar's annotation stands under the matrix: the centre of
 *  what the engine drew for it, as a share of the canvas width */
export interface ExpandedMark {
  at: number;
  align: 'start' | 'center' | 'end';
}

export interface ExpandedVizEntry {
  recipes: ExpandedRecipes;
  data: DataVizEntry['data'];
  ariaLabel: string;
  /** the dot pitch every one of `recipes` is cut at — the card's own */
  pitch: Readonly<Pitch>;
  /** one mark per value, in data order. Columns are fixed, so where a
   *  value is drawn does not depend on the row count. */
  marks: readonly ExpandedMark[];
}

/* ---- WHERE EACH VALUE IS DRAWN ---------------------------------
   The opened panel names its categories under the chart — the bar
   set it used to draw printed each value over its category, and the
   dot matrix has no type in it, so those words would otherwise be
   gone. They have to stand under the right marks, and the only
   honest source for where the marks are is the engine itself: a
   comparison chart's bars are measured off the composition it
   actually builds; an area chart runs its series edge to edge, so
   value i stands at i/(n-1) of the width. */
function marksFor(recipe: DataDotMatrixRecipe, data: readonly number[]): ExpandedMark[] {
  if (recipe.visualization === 'comparison') {
    const { composition } = createDataDotMatrix(recipe, data.slice());
    const spans = new Map<number, [number, number]>();
    for (const cell of composition.cells) {
      const right = cell.x + composition.pixelSize;
      const span = spans.get(cell.paletteIndex);
      spans.set(cell.paletteIndex, span ? [Math.min(span[0], cell.x), Math.max(span[1], right)] : [cell.x, right]);
    }
    return data.map((_, i) => {
      const [left, right] = spans.get(i) ?? [0, composition.width];
      return { at: (left + right) / 2 / composition.width, align: 'center' as const };
    });
  }
  const last = Math.max(1, data.length - 1);
  return data.map((_, i) => ({
    at: i / last,
    align: i === 0 ? ('start' as const) : i === last ? ('end' as const) : ('center' as const),
  }));
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
    marks: Object.freeze(
      marksFor(recipes[EXPANDED_MAX_ROWS], entry.data).map((mark) => Object.freeze(mark)),
    ),
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
