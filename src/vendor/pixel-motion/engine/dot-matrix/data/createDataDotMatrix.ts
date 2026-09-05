import type { DotMatrixCell, DotMatrixComposition } from '../../types/composition'
import type { DataDotMatrixRecipe } from '../../types/recipe'
import { createDotMatrixCell } from '../createCell'
import { createGridLayout } from '../grid'
import { generateDotMatrixPalettes } from '../palette'

const clamp = (value: number, minimum: number, maximum: number) => (
  Math.min(maximum, Math.max(minimum, value))
)

function cleanData(data: number[], maximumLength: number) {
  return data.filter(Number.isFinite).slice(0, maximumLength)
}

function comparisonMask(recipe: DataDotMatrixRecipe, data: number[]) {
  const layout = createGridLayout(recipe.canvas, recipe.pixelStyle)
  const values = cleanData(data, 4)
  const domainMaximum = recipe.domain.mode === 'zero-to-100' ? 100 : Math.max(1, ...values)
  const sidePadding = Math.max(1, Math.round(layout.columns * 0.035))
  const groupGap = Math.max(1, Math.round(layout.columns * 0.035))
  const usableColumns = layout.columns - sidePadding * 2 - Math.max(0, values.length - 1) * groupGap
  const barColumns = Math.max(2, Math.floor(usableColumns / Math.max(1, values.length)))
  const totalColumns = values.length * barColumns + Math.max(0, values.length - 1) * groupGap
  const startColumn = Math.max(0, Math.floor((layout.columns - totalColumns) / 2))
  const positionByKey = new Map(layout.positions.map((position) => [`${position.column}:${position.row}`, position]))
  const cells: DotMatrixCell[] = []

  values.forEach((value, valueIndex) => {
    const heightRows = Math.max(1, Math.round(clamp(value / domainMaximum, 0, 1) * (layout.rows - 2)))
    const x0 = startColumn + valueIndex * (barColumns + groupGap)
    const y0 = layout.rows - heightRows
    const centerX = x0 + barColumns / 2
    const centerY = y0 + heightRows / 2
    const radius = Math.min(barColumns / 2, heightRows / 2)

    for (let row = y0; row < layout.rows; row += 1) {
      for (let column = x0; column < x0 + barColumns; column += 1) {
        const pointX = column + 0.5
        const pointY = row + 0.5
        const qx = Math.abs(pointX - centerX) - (barColumns / 2 - radius)
        const qy = Math.abs(pointY - centerY) - (heightRows / 2 - radius)
        const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
          + Math.min(Math.max(qx, qy), 0) - radius
        if (outside > 0) continue
        const position = positionByKey.get(`${column}:${row}`)
        if (!position) continue
        const verticalProgress = (layout.rows - row) / Math.max(1, heightRows)
        cells.push(createDotMatrixCell(position, layout, {
          seed: recipe.seed + valueIndex * 1009,
          paletteIndex: valueIndex,
          maskStrength: clamp(0.72 + Math.min(0, -outside) * 0.18, 0.72, 1),
          revealAt: clamp(verticalProgress * 0.8 + valueIndex * 0.08, 0, 0.96),
        }))
      }
    }
  })

  return { layout, cells }
}

function areaMask(recipe: DataDotMatrixRecipe, data: number[]) {
  const layout = createGridLayout(recipe.canvas, recipe.pixelStyle)
  const values = cleanData(data, 32)
  const domainMaximum = recipe.domain.mode === 'zero-to-100' ? 100 : Math.max(1, ...values)
  const cells = layout.positions.flatMap((position) => {
    if (values.length < 2) return []
    const x = position.column / Math.max(1, layout.columns - 1)
    const dataPosition = x * (values.length - 1)
    const leftIndex = Math.min(values.length - 2, Math.floor(dataPosition))
    const local = dataPosition - leftIndex
    const value = values[leftIndex] + (values[leftIndex + 1] - values[leftIndex]) * local
    const heightRows = clamp(value / domainMaximum, 0, 1) * (layout.rows - 1)
    const topRow = layout.rows - 1 - heightRows
    if (position.row < topRow) return []
    const edgeDistance = position.row - topRow
    return [createDotMatrixCell(position, layout, {
      seed: recipe.seed,
      maskStrength: clamp(0.72 + edgeDistance * 0.16, 0.72, 1),
      revealAt: clamp(x * 0.92 + (position.row % 3) * 0.008, 0, 0.98),
    })]
  })

  return { layout, cells }
}

export function createDataDotMatrix(recipe: DataDotMatrixRecipe, data: number[]) {
  const { layout, cells } = recipe.visualization === 'comparison'
    ? comparisonMask(recipe, data)
    : areaMask(recipe, data)
  const colors = recipe.visualization === 'comparison'
    ? recipe.comparisonColors.slice(0, 4)
    : [recipe.color]
  const composition: DotMatrixComposition = {
    type: 'dot-matrix-grid',
    source: 'data',
    width: layout.width,
    height: layout.height,
    columns: layout.columns,
    rows: layout.rows,
    pixelSize: layout.pixelSize,
    cells,
  }

  return {
    composition,
    palettes: generateDotMatrixPalettes(colors.length > 0 ? colors : [recipe.color], recipe.canvas.background),
  }
}
