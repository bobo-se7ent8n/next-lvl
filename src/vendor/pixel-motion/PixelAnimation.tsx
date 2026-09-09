import { useCallback, useMemo } from 'react'
import {
  createMotionPresetEvaluator,
  createProceduralDotMatrix,
  type DotMatrixRecipe,
} from './engine'
import { DotMatrixCanvas } from './DotMatrixCanvas'

export interface PixelAnimationProps {
  recipe: DotMatrixRecipe
  autoPlay?: boolean
  replayKey?: number
  className?: string
  ariaLabel?: string
}

export function PixelAnimation({
  recipe,
  autoPlay = true,
  replayKey = 0,
  className,
  ariaLabel = 'Procedural dot matrix animation',
}: PixelAnimationProps) {
  const generated = useMemo(() => createProceduralDotMatrix(recipe), [recipe])
  const createEvaluator = useCallback((elapsedSeconds: number) => (
    createMotionPresetEvaluator(recipe, generated.composition, elapsedSeconds)
  ), [generated.composition, recipe])

  return (
    <DotMatrixCanvas
      composition={generated.composition}
      palettes={generated.palettes}
      background={recipe.canvas.background}
      motionAmount={recipe.motionAmount}
      speed={recipe.speed}
      createEvaluator={createEvaluator}
      autoPlay={autoPlay}
      replayKey={replayKey}
      className={className}
      ariaLabel={ariaLabel}
    />
  )
}
