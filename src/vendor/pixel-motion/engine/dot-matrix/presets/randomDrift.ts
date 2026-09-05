import { ambientFlickerOpacity } from '../ambientFlicker'
import type { MotionPresetModule } from './types'

export const randomDriftPreset: MotionPresetModule = {
  id: 'random-drift',
  createEvaluator: (recipe, _composition, elapsedSeconds) => {
    return (cell) => ({
      activation: cell.maskStrength,
      opacityMultiplier: 1,
      opacity: ambientFlickerOpacity(cell, elapsedSeconds, {
        seed: recipe.seed,
        speed: recipe.speed,
        variation: recipe.motionAmount,
        minOpacity: recipe.minOpacity,
        maxOpacity: recipe.maxOpacity,
        changeFrequency: recipe.changeFrequency,
      }),
    })
  },
}
