import type {
  DotMatrixCellState,
  DotMatrixComposition,
  DotMatrixFrameEvaluator,
} from '../../types/composition'
import type { DotMatrixRecipe, MotionPreset } from '../../types/recipe'

export interface MotionPresetModule {
  id: MotionPreset
  createEvaluator(
    recipe: DotMatrixRecipe,
    composition: DotMatrixComposition,
    elapsedSeconds: number,
  ): DotMatrixFrameEvaluator
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const amount = clamp01((value - edge0) / Math.max(0.0001, edge1 - edge0))
  return amount * amount * (3 - 2 * amount)
}

export const fieldBlend = (fieldA: number, fieldB: number, fieldC: number, phase: number) => {
  const weightA = 0.5 + 0.5 * Math.sin(phase)
  const weightB = 0.5 + 0.5 * Math.sin(phase + Math.PI * 2 / 3)
  const weightC = 0.5 + 0.5 * Math.sin(phase + Math.PI * 4 / 3)
  return (fieldA * weightA + fieldB * weightB + fieldC * weightC) / (weightA + weightB + weightC)
}

export const state = (activation: number, opacityMultiplier: number): DotMatrixCellState => ({
  activation: clamp01(activation),
  opacityMultiplier: Math.min(1.35, Math.max(0.15, opacityMultiplier)),
})
