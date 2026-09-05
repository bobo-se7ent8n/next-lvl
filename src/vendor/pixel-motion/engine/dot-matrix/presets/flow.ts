import type { MotionPresetModule } from './types'
import { fieldBlend, smoothstep, state } from './types'

export const flowPreset: MotionPresetModule = {
  id: 'flow',
  createEvaluator: (recipe, composition, elapsedSeconds) => {
    const phase = elapsedSeconds * recipe.speed * Math.PI * 0.9
    const amount = recipe.motionAmount

    return (cell) => {
      const x = cell.column / Math.max(1, composition.columns - 1)
      const y = cell.row / Math.max(1, composition.rows - 1)
      const field = fieldBlend(cell.fieldA, cell.fieldB, cell.fieldC, phase + x * 1.4 - y * 0.9)
      const directional = 0.5 + 0.5 * Math.sin(x * Math.PI * 3.1 + y * Math.PI * 1.4 - phase * 0.72 + cell.fieldC)
      const signal = field * (0.84 - amount * 0.16) + directional * (0.16 + amount * 0.16)
      return state(smoothstep(0.5, 0.65, signal), 0.72 + signal * 0.4)
    }
  },
}
