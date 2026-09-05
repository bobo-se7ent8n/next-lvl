import { hashUnit } from '../../random/seededRandom'
import type { MotionPresetModule } from './types'
import { smoothstep, state } from './types'

export const pulsePreset: MotionPresetModule = {
  id: 'pulse',
  createEvaluator: (recipe, composition, elapsedSeconds) => {
    const centerX = 0.3 + hashUnit(recipe.seed, 1709) * 0.4
    const centerY = 0.3 + hashUnit(recipe.seed, 1721) * 0.4
    const phase = elapsedSeconds * recipe.speed * Math.PI * 2
    const amount = recipe.motionAmount

    return (cell) => {
      const x = cell.column / Math.max(1, composition.columns - 1)
      const y = cell.row / Math.max(1, composition.rows - 1)
      const distance = Math.hypot(x - centerX, y - centerY)
      const radial = 0.5 + 0.5 * Math.sin(distance * Math.PI * 7 - phase)
      const signal = cell.fieldA * (0.78 - amount * 0.2) + radial * (0.22 + amount * 0.2)
      return state(smoothstep(0.48, 0.64, signal), 0.72 + radial * 0.42)
    }
  },
}
