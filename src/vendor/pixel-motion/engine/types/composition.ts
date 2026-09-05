export interface DotMatrixCell {
  column: number
  row: number
  x: number
  y: number
  paletteIndex: number
  tone: number
  baseOpacity: number
  phase: number
  period: number
  motionAmount: number
  fieldA: number
  fieldB: number
  fieldC: number
  maskStrength: number
  revealAt: number
}

export interface DotMatrixComposition {
  type: 'dot-matrix-grid'
  source: 'procedural' | 'data'
  width: number
  height: number
  columns: number
  rows: number
  pixelSize: number
  cells: DotMatrixCell[]
}

export interface DotMatrixRenderState {
  elapsedMs: number
  reducedMotion: boolean
  revealProgress: number
}

export interface DotMatrixCellState {
  activation: number
  opacityMultiplier: number
  /** Absolute cell opacity. When present, it bypasses the renderer's legacy pulse. */
  opacity?: number
}

export type DotMatrixFrameEvaluator = (cell: DotMatrixCell) => DotMatrixCellState
