import type { DotMatrixFrameEvaluator, DotMatrixComposition } from '../../types/composition'
import type { DotMatrixRecipe, MotionPreset } from '../../types/recipe'
import { flowPreset } from './flow'
import { gatherPreset } from './gather'
import { pulsePreset } from './pulse'
import { randomDriftPreset } from './randomDrift'
import { sweepPreset } from './sweep'
import type { MotionPresetModule } from './types'
import { wavePreset } from './wave'

export const MOTION_PRESETS: Record<MotionPreset, MotionPresetModule> = {
  'random-drift': randomDriftPreset,
  wave: wavePreset,
  sweep: sweepPreset,
  gather: gatherPreset,
  pulse: pulsePreset,
  flow: flowPreset,
}

export function createMotionPresetEvaluator(
  recipe: DotMatrixRecipe,
  composition: DotMatrixComposition,
  elapsedSeconds: number,
): DotMatrixFrameEvaluator {
  return MOTION_PRESETS[recipe.preset].createEvaluator(recipe, composition, elapsedSeconds)
}

export type { MotionPresetModule } from './types'
