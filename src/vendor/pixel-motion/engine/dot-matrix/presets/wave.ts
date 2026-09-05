import type { MotionPresetModule } from './types'
import { smoothstep, state } from './types'

export const wavePreset: MotionPresetModule = {
  id: 'wave',
  createEvaluator: (recipe, composition, elapsedSeconds) => {
    const temporalPhase = elapsedSeconds * recipe.speed * Math.PI * 2
    const angle = (18 + (recipe.seed % 6) * 11) * Math.PI / 180
    const directionX = Math.cos(angle)
    const directionY = Math.sin(angle)
    const amount = recipe.motionAmount

    return (cell) => {
      const x = cell.column / Math.max(1, composition.columns - 1)
      const y = cell.row / Math.max(1, composition.rows - 1)
      const wave = 0.5 + 0.5 * Math.sin((x * directionX + y * directionY) * Math.PI * 5.2 - temporalPhase + cell.fieldB * 1.4)
      const signal = cell.fieldA * (0.72 - amount * 0.24) + wave * (0.28 + amount * 0.24)
      return state(smoothstep(0.46, 0.62, signal), 0.7 + wave * 0.42)
    }
  },
}
