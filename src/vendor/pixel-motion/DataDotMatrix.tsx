import { useCallback, useMemo } from 'react'
import {
  createDataDotMatrix,
  createDataEvaluator,
  type DataDotMatrixRecipe,
} from './engine'
import { DotMatrixCanvas } from './DotMatrixCanvas'

export interface DataDotMatrixProps {
  recipe: DataDotMatrixRecipe
  data: number[]
  autoPlay?: boolean
  replayKey?: number
  className?: string
  ariaLabel?: string
}

export function DataDotMatrix({
  recipe,
  data,
  autoPlay = true,
  replayKey = 0,
  className,
  ariaLabel = 'Data-driven dot matrix animation',
}: DataDotMatrixProps) {
  const generated = useMemo(() => createDataDotMatrix(recipe, data), [data, recipe])
  const createEvaluator = useCallback((elapsedSeconds: number, revealProgress: number) => (
    createDataEvaluator(recipe, generated.composition, elapsedSeconds, revealProgress)
  ), [generated.composition, recipe])

  return (
    <DotMatrixCanvas
      composition={generated.composition}
      palettes={generated.palettes}
      background={recipe.canvas.background}
      motionAmount={recipe.motion.amount}
      speed={recipe.motion.speed}
      revealDuration={recipe.motion.revealDuration}
      createEvaluator={createEvaluator}
      autoPlay={autoPlay}
      replayKey={replayKey}
      className={className}
      ariaLabel={ariaLabel}
    />
  )
}
