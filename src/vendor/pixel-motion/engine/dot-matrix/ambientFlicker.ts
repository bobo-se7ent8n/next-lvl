import type { DotMatrixCell } from '../types/composition'
import { hashUnit } from '../random/seededRandom'

const TAU = Math.PI * 2
const BOUNDARY_JITTER = 0.38

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount
const ease = (amount: number) => amount * amount * (3 - 2 * amount)

export interface AmbientFlickerSettings {
  seed: number
  speed: number
  variation: number
  minOpacity?: number
  maxOpacity?: number
  changeFrequency?: number
}

export function ambientFlickerOpacity(
  cell: DotMatrixCell,
  elapsedSeconds: number,
  settings: AmbientFlickerSettings,
) {
  const configuredMinimum = clamp01(settings.minOpacity ?? 0.16)
  const configuredMaximum = clamp01(settings.maxOpacity ?? 0.96)
  const minOpacity = Math.min(configuredMinimum, configuredMaximum)
  const maxOpacity = Math.max(configuredMinimum, configuredMaximum)
  const variation = clamp01(settings.variation)
  const changeFrequency = clamp01(settings.changeFrequency ?? settings.variation)
  const eventRate = Math.max(0.02, settings.speed) * changeFrequency * 2.4
  const transitionShare = 0.16 + changeFrequency * 0.28
  const centerOpacity = (minOpacity + maxOpacity) * 0.5

  // Timing uses only precomputed random cell traits. It has no spatial x/y term.
  const cellKey = Math.round(cell.phase * 1_000_000) + Math.round(cell.period * 10_000)
  const cellRate = eventRate * mix(0.74, 1.26, hashUnit(settings.seed, cellKey, 4099))
  const localTime = elapsedSeconds * cellRate + cell.phase / TAU
  const boundary = (segment: number) => segment + (
    hashUnit(settings.seed, cellKey, segment, 5171) * 2 - 1
  ) * BOUNDARY_JITTER

  let segment = Math.floor(localTime)
  while (localTime < boundary(segment)) segment -= 1
  while (localTime >= boundary(segment + 1)) segment += 1

  const segmentStart = boundary(segment)
  const segmentEnd = boundary(segment + 1)
  const transitionStart = mix(segmentEnd, segmentStart, transitionShare)
  const transitionProgress = clamp01(
    (localTime - transitionStart) / Math.max(0.0001, segmentEnd - transitionStart),
  )
  const fromOpacity = mix(
    minOpacity,
    maxOpacity,
    hashUnit(settings.seed, cellKey, segment, 6211),
  )
  const toOpacity = mix(
    minOpacity,
    maxOpacity,
    hashUnit(settings.seed, cellKey, segment + 1, 6211),
  )
  const randomOpacity = mix(fromOpacity, toOpacity, ease(transitionProgress))

  return mix(centerOpacity, randomOpacity, variation)
}
