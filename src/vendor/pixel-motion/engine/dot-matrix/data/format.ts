import type {
  CanvasRecipe,
  DataFormatRatio,
  DataFormatRecipe,
} from '../../types/recipe'

export interface DataFormatPreset {
  ratio: Exclude<DataFormatRatio, 'custom'>
  label: string
  width: number
  height: number
}

export const DATA_FORMAT_PRESETS: readonly DataFormatPreset[] = [
  { ratio: '1:1', label: 'Square · 1:1', width: 256, height: 256 },
  { ratio: '4:3', label: 'Landscape · 4:3', width: 320, height: 240 },
  { ratio: '16:9', label: 'Wide · 16:9', width: 320, height: 180 },
  { ratio: '3:4', label: 'Portrait · 3:4', width: 240, height: 320 },
  { ratio: '3:2', label: 'Card · 3:2', width: 300, height: 200 },
]

const clampDimension = (value: number | undefined, fallback: number) => (
  Math.min(4096, Math.max(64, Math.round(Number.isFinite(value) ? value as number : fallback)))
)

function dimensionsForFormat(format: DataFormatRecipe) {
  if (format.ratio === 'custom') {
    return {
      width: clampDimension(format.width, 320),
      height: clampDimension(format.height, 180),
    }
  }
  const preset = DATA_FORMAT_PRESETS.find((candidate) => candidate.ratio === format.ratio)
    ?? DATA_FORMAT_PRESETS[2]
  return { width: preset.width, height: preset.height }
}

export function createDataCanvas(
  format: DataFormatRecipe,
  background: string,
): CanvasRecipe {
  const { width, height } = dimensionsForFormat(format)
  const aspect = width / height
  const logicalWidth = aspect >= 1 ? 96 : Math.max(24, Math.round(96 * aspect))
  const logicalHeight = aspect >= 1 ? Math.max(24, Math.round(96 / aspect)) : 96

  return {
    logicalWidth,
    logicalHeight,
    displayWidth: width,
    displayHeight: height,
    background,
  }
}

export function inferDataFormat(canvas: CanvasRecipe): DataFormatRecipe {
  const aspect = canvas.displayWidth / Math.max(1, canvas.displayHeight)
  const match = DATA_FORMAT_PRESETS.find((preset) => (
    Math.abs(aspect - preset.width / preset.height) < 0.045
  ))
  return match
    ? { ratio: match.ratio }
    : { ratio: 'custom', width: canvas.displayWidth, height: canvas.displayHeight }
}
