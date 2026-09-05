import { useEffect, useRef } from 'react'
import {
  renderDotMatrix,
  type DotMatrixComposition,
  type DotMatrixFrameEvaluator,
} from './engine'

export interface DotMatrixCanvasProps {
  composition: DotMatrixComposition
  palettes: readonly (readonly string[])[]
  background: string
  motionAmount: number
  speed: number
  revealDuration?: number
  createEvaluator: (elapsedSeconds: number, revealProgress: number) => DotMatrixFrameEvaluator
  autoPlay?: boolean
  replayKey?: number
  className?: string
  ariaLabel?: string
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function DotMatrixCanvas({
  composition,
  palettes,
  background,
  motionAmount,
  speed,
  revealDuration = 0,
  createEvaluator,
  autoPlay = true,
  replayKey = 0,
  className,
  ariaLabel = 'Animated dot matrix',
}: DotMatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    canvas.width = composition.width
    canvas.height = composition.height
    context.imageSmoothingEnabled = false

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0
    let startedAt = performance.now()

    const render = (now: number) => {
      const reducedMotion = reducedMotionQuery.matches || !autoPlay
      const elapsedMs = reducedMotion ? 0 : now - startedAt
      const revealProgress = reducedMotion || revealDuration <= 0
        ? 1
        : clamp01(elapsedMs / revealDuration)
      const evaluateFrame = createEvaluator(elapsedMs / 1000, revealProgress)
      renderDotMatrix(context, composition, palettes, {
        elapsedMs,
        reducedMotion,
        revealProgress,
      }, evaluateFrame, {
        background,
        motionAmount,
        speed,
      })
      if (!reducedMotion) animationFrame = requestAnimationFrame(render)
    }

    const restart = () => {
      cancelAnimationFrame(animationFrame)
      startedAt = performance.now()
      animationFrame = requestAnimationFrame(render)
    }

    reducedMotionQuery.addEventListener('change', restart)
    animationFrame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animationFrame)
      reducedMotionQuery.removeEventListener('change', restart)
    }
  }, [autoPlay, background, composition, createEvaluator, motionAmount, palettes, replayKey, revealDuration, speed])

  return <canvas ref={canvasRef} className={className} role="img" aria-label={ariaLabel} />
}
