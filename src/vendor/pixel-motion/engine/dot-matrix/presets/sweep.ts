import type { MotionPresetModule } from './types'
import { smoothstep, state } from './types'

export const sweepPreset: MotionPresetModule = {
  id: 'sweep',
  createEvaluator: (recipe, composition, elapsedSeconds) => {
    const width = 0.3
    const travel = 1 + width * 2
    const center = ((elapsedSeconds * recipe.speed * 0.42 + (recipe.seed % 997) / 997 * travel) % travel) - width
    const amount = recipe.motionAmount

    return (cell) => {
      const x = cell.column / Math.max(1, composition.columns - 1)
      const y = cell.row / Math.max(1, composition.rows - 1)
      const projected = recipe.seed % 3 === 0 ? y : recipe.seed % 3 === 1 ? (x + y) * 0.5 : x
      const front = 1 - smoothstep(width * 0.14, width, Math.abs(projected - center))
      const base = smoothstep(0.5, 0.66, cell.fieldA)
      return state(
        base * (0.34 + (1 - amount) * 0.36) + front * (0.42 + amount * 0.58),
        0.68 + front * 0.5,
      )
    }
  },
}
