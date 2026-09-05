import type {
  DotMatrixComposition,
  DotMatrixFrameEvaluator,
} from '../../types/composition'
import type {
  DataDotMatrixRecipe,
} from '../../types/recipe'
import { ambientFlickerOpacity } from '../ambientFlicker'
import { smoothstep } from '../presets/types'

export function createDataEvaluator(
  recipe: DataDotMatrixRecipe,
  _composition: DotMatrixComposition,
  elapsedSeconds: number,
  revealProgress: number,
): DotMatrixFrameEvaluator {
  return (cell) => {
    // Density remains seed-stable, but uses an uncorrelated value to avoid blobs.
    const randomCellValue = cell.phase / (Math.PI * 2)
    const staticDensity = recipe.pixelStyle.density >= 1
      ? 1
      : 1 - smoothstep(
        recipe.pixelStyle.density - 0.04,
        recipe.pixelStyle.density + 0.04,
        randomCellValue,
      )
    const reveal = smoothstep(cell.revealAt - 0.055, cell.revealAt + 0.025, revealProgress)

    return {
      activation: staticDensity * reveal * cell.maskStrength,
      opacityMultiplier: 1,
      opacity: ambientFlickerOpacity(cell, elapsedSeconds, {
        seed: recipe.seed + cell.paletteIndex * 1009,
        speed: recipe.motion.speed,
        variation: recipe.motion.amount,
        minOpacity: recipe.motion.minOpacity,
        maxOpacity: recipe.motion.maxOpacity,
        changeFrequency: recipe.motion.changeFrequency,
      }),
    }
  }
}
