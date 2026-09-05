import type { DotMatrixComposition } from '../../types/composition'
import type { DotMatrixRecipe } from '../../types/recipe'
import { createDotMatrixCell } from '../createCell'
import { createGridLayout } from '../grid'
import { generateDotMatrixPalettes } from '../palette'

export function createProceduralDotMatrix(recipe: DotMatrixRecipe) {
  const layout = createGridLayout(recipe.canvas, recipe.pixelStyle)
  const cells = layout.positions.map((position) => createDotMatrixCell(position, layout, {
    seed: recipe.seed,
  }))
  const composition: DotMatrixComposition = {
    type: 'dot-matrix-grid',
    source: 'procedural',
    width: layout.width,
    height: layout.height,
    columns: layout.columns,
    rows: layout.rows,
    pixelSize: layout.pixelSize,
    cells,
  }

  return {
    composition,
    palettes: generateDotMatrixPalettes([recipe.color], recipe.canvas.background),
  }
}
