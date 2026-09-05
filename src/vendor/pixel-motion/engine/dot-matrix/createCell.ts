import { fbm2D } from '../noise/valueNoise'
import { hashUnit } from '../random/seededRandom'
import type { DotMatrixCell } from '../types/composition'
import type { GridLayout, GridPosition } from './grid'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount

export interface CreateCellOptions {
  seed: number
  paletteIndex?: number
  maskStrength?: number
  revealAt?: number
}

export function createDotMatrixCell(
  position: GridPosition,
  layout: GridLayout,
  options: CreateCellOptions,
): DotMatrixCell {
  const { column, row } = position
  const scale = 0.15
  const fieldA = fbm2D(column * scale, row * scale, options.seed)
  const fieldB = fbm2D(column * scale + 17.3, row * scale - 9.7, options.seed + 2039)
  const fieldC = fbm2D(column * scale - 11.1, row * scale + 14.9, options.seed + 4093)
  const averageField = (fieldA + fieldB + fieldC) / 3
  const toneVariation = hashUnit(options.seed, column, row, 307)
  const opacityVariation = hashUnit(options.seed, column, row, 401)
  const toneSignal = clamp01(averageField * 0.72 + toneVariation * 0.28)
  const opacitySignal = clamp01(averageField * 0.68 + opacityVariation * 0.32)

  return {
    ...position,
    paletteIndex: options.paletteIndex ?? 0,
    tone: Math.min(4, Math.floor(toneSignal * 5)),
    baseOpacity: mix(0.2, 0.96, opacitySignal),
    phase: hashUnit(options.seed, column, row, 601) * Math.PI * 2,
    period: mix(0.72, 1.42, hashUnit(options.seed, column, row, 503)),
    motionAmount: mix(0.16, 1, hashUnit(options.seed, column, row, 1907)),
    fieldA,
    fieldB,
    fieldC,
    maskStrength: options.maskStrength ?? 1,
    revealAt: options.revealAt ?? column / Math.max(1, layout.columns - 1),
  }
}
