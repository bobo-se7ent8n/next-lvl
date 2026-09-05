import type { CanvasRecipe, PixelStyleRecipe } from '../types/recipe'

export interface GridPosition {
  column: number
  row: number
  x: number
  y: number
}

export interface GridLayout {
  width: number
  height: number
  columns: number
  rows: number
  pixelSize: number
  gap: number
  pitch: number
  positions: GridPosition[]
}

export function createGridLayout(canvas: CanvasRecipe, style: PixelStyleRecipe): GridLayout {
  const width = Math.max(1, Math.round(canvas.logicalWidth))
  const height = Math.max(1, Math.round(canvas.logicalHeight))
  const pixelSize = Math.max(1, Math.round(style.pixelSize))
  const gap = Math.max(1, Math.round(style.gap))
  const pitch = pixelSize + gap
  const columns = Math.max(1, Math.floor((width + gap) / pitch))
  const rows = Math.max(1, Math.floor((height + gap) / pitch))
  const fieldWidth = columns * pixelSize + Math.max(0, columns - 1) * gap
  const fieldHeight = rows * pixelSize + Math.max(0, rows - 1) * gap
  const offsetX = Math.floor((width - fieldWidth) / 2)
  const offsetY = Math.floor((height - fieldHeight) / 2)
  const positions: GridPosition[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      positions.push({
        column,
        row,
        x: offsetX + column * pitch,
        y: offsetY + row * pitch,
      })
    }
  }

  return { width, height, columns, rows, pixelSize, gap, pitch, positions }
}
