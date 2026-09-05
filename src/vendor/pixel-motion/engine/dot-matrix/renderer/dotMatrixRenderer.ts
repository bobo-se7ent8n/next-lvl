import type {
  DotMatrixComposition,
  DotMatrixFrameEvaluator,
  DotMatrixRenderState,
} from '../../types/composition'

export interface DotMatrixRendererOptions {
  background: string
  motionAmount: number
  speed: number
}

export function renderDotMatrix(
  context: CanvasRenderingContext2D,
  composition: DotMatrixComposition,
  palettes: readonly (readonly string[])[],
  state: DotMatrixRenderState,
  evaluateFrame: DotMatrixFrameEvaluator,
  options: DotMatrixRendererOptions,
) {
  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, composition.width, composition.height)
  context.fillStyle = options.background
  context.fillRect(0, 0, composition.width, composition.height)

  const elapsedSeconds = state.elapsedMs / 1000
  const motionAmount = state.reducedMotion ? 0 : Math.min(1, Math.max(0, options.motionAmount))
  const speed = Math.max(0.02, options.speed)

  for (const cell of composition.cells) {
    const frame = evaluateFrame(cell)
    if (frame.activation <= 0.003) continue
    const cycle = 0.5 + 0.5 * Math.sin(cell.phase + elapsedSeconds * speed * Math.PI * 2 / cell.period)
    const fadeDepth = motionAmount * cell.motionAmount * 0.46
    const asynchronousFade = 1 - fadeDepth + fadeDepth * cycle
    const animatedOpacity = frame.opacity ?? (
      cell.baseOpacity * asynchronousFade * frame.opacityMultiplier
    )
    const opacity = animatedOpacity * frame.activation
    if (opacity <= 0.006) continue

    const palette = palettes[cell.paletteIndex] ?? palettes[0]
    if (!palette || palette.length === 0) continue
    context.globalAlpha = Math.min(1, Math.max(0, opacity))
    context.fillStyle = palette[Math.min(palette.length - 1, Math.max(0, cell.tone))]
    context.fillRect(cell.x, cell.y, composition.pixelSize, composition.pixelSize)
  }

  context.globalAlpha = 1
}
