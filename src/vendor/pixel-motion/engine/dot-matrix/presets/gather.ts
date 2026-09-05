import { hashUnit } from '../../random/seededRandom'
import type { MotionPresetModule } from './types'
import { smoothstep, state } from './types'

export const gatherPreset: MotionPresetModule = {
  id: 'gather',
  createEvaluator: (recipe, composition, elapsedSeconds) => {
    const focalX = 0.22 + hashUnit(recipe.seed, 1201) * 0.56
    const focalY = 0.22 + hashUnit(recipe.seed, 1213) * 0.56
    const rhythm = 0.5 - 0.5 * Math.cos(elapsedSeconds * recipe.speed * Math.PI * 2)
    const amount = recipe.motionAmount

    return (cell) => {
      const x = cell.column / Math.max(1, composition.columns - 1)
      const y = cell.row / Math.max(1, composition.rows - 1)
      const distance = Math.hypot(x - focalX, y - focalY)
      const focus = 1 - smoothstep(0.12, 0.48, distance)
      const base = smoothstep(0.5, 0.67, cell.fieldA)
      const concentration = rhythm * amount
      return state(
        base * (1 - concentration * 0.7) + focus * concentration,
        0.72 + focus * concentration * 0.56,
      )
    }
  },
}
