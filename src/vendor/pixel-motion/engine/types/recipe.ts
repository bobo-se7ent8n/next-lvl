export const BASE_HUES = {
  mint: '#93EAC3',
  yellow: '#FFE159',
  orange: '#FF9868',
  lilac: '#C4B5FF',
  blue: '#A6DBFF',
} as const

export const DEFAULT_BACKGROUND = '#F3F2EE'

export type BaseHueName = keyof typeof BASE_HUES
export type ToneDirection = 'lighter' | 'darker' | 'both'

export interface CanvasRecipe {
  logicalWidth: number
  logicalHeight: number
  displayWidth: number
  displayHeight: number
  background: string
}

export interface PaletteRecipe {
  base: string
  toneCount: number
  toneSpread: number
  direction: ToneDirection
}

export interface PixelStyleRecipe {
  pixelSize: number
  gap: number
}

export type MotionPreset = 'random-drift' | 'wave' | 'sweep' | 'gather' | 'pulse' | 'flow'

export interface DotMatrixRecipe {
  type: 'dot-matrix'
  preset: MotionPreset
  seed: number
  canvas: CanvasRecipe
  color: string
  pixelStyle: PixelStyleRecipe
  motionAmount: number
  speed: number
  /** Optional for backwards compatibility with recipes created before ambient flicker. */
  minOpacity?: number
  /** Optional for backwards compatibility with recipes created before ambient flicker. */
  maxOpacity?: number
  /** Per-pixel target change rate. Optional legacy recipes fall back to motionAmount. */
  changeFrequency?: number
}

export type DataVisualization = 'comparison' | 'area-zone'
export type ChartDomainMode = 'auto' | 'zero-to-100'
export type DataFormatRatio = '1:1' | '4:3' | '16:9' | '3:4' | '3:2' | 'custom'
export type DataMotionPreset = 'drift' | 'wave' | 'sweep' | 'pulse'

export interface DataFormatRecipe {
  ratio: DataFormatRatio
  width?: number
  height?: number
}

export interface DataPixelStyleRecipe extends PixelStyleRecipe {
  density: number
}

export interface DataMotionRecipe {
  preset: DataMotionPreset
  amount: number
  speed: number
  revealDuration: number
  /** Optional for backwards compatibility with data recipes created before ambient flicker. */
  minOpacity?: number
  /** Optional for backwards compatibility with data recipes created before ambient flicker. */
  maxOpacity?: number
  /** Per-pixel target change rate. Optional legacy recipes fall back to amount. */
  changeFrequency?: number
}

export interface DataDotMatrixRecipe {
  type: 'data-dot-matrix'
  visualization: DataVisualization
  seed: number
  format: DataFormatRecipe
  canvas: CanvasRecipe
  color: string
  comparisonColors: string[]
  pixelStyle: DataPixelStyleRecipe
  motion: DataMotionRecipe
  domain: { mode: ChartDomainMode }
}

export type VisualRecipe = DotMatrixRecipe | DataDotMatrixRecipe

export const DEFAULT_CANVAS: CanvasRecipe = {
  logicalWidth: 96,
  logicalHeight: 55,
  displayWidth: 313,
  displayHeight: 180,
  background: DEFAULT_BACKGROUND,
}

export const DEFAULT_PIXEL_STYLE: PixelStyleRecipe = {
  pixelSize: 1,
  gap: 2,
}

export const DEFAULT_DOT_RECIPE: DotMatrixRecipe = {
  type: 'dot-matrix',
  preset: 'random-drift',
  seed: 48291,
  canvas: { ...DEFAULT_CANVAS },
  color: BASE_HUES.mint,
  pixelStyle: { ...DEFAULT_PIXEL_STYLE },
  motionAmount: 0.78,
  speed: 0.22,
  minOpacity: 0.16,
  maxOpacity: 0.96,
  changeFrequency: 0.28,
}

export const DEFAULT_DATA_RECIPE: DataDotMatrixRecipe = {
  type: 'data-dot-matrix',
  visualization: 'comparison',
  seed: 73129,
  format: { ratio: '16:9' },
  canvas: {
    logicalWidth: 96,
    logicalHeight: 54,
    displayWidth: 320,
    displayHeight: 180,
    background: DEFAULT_BACKGROUND,
  },
  color: BASE_HUES.mint,
  comparisonColors: [BASE_HUES.mint, BASE_HUES.yellow, BASE_HUES.orange],
  pixelStyle: { ...DEFAULT_PIXEL_STYLE, density: 0.82 },
  motion: {
    preset: 'drift',
    amount: 0.78,
    speed: 0.22,
    revealDuration: 1400,
    minOpacity: 0.16,
    maxOpacity: 0.96,
    changeFrequency: 0.28,
  },
  domain: { mode: 'auto' },
}

export const CURATED_TONE_SETTINGS = {
  toneCount: 5,
  toneSpread: 55,
  direction: 'both',
} as const satisfies Omit<PaletteRecipe, 'base'>
