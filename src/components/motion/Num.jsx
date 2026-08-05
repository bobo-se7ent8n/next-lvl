import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cx } from '../../lib/utils'

/**
 * A brief, subtle count-up on mount. Pure numbers resolve from 0;
 * mixed readouts ("0.61s → 0.42s") render immediately — the calm
 * aesthetic has no room for digit scrambling.
 *
 * The `.num` class only sets tabular figures and tight tracking; the
 * face stays the body sans, because every large numeral in this
 * system is set in clean sans at heavy weight.
 *
 * Under prefers-reduced-motion the final value renders immediately.
 */
export function Num({
  value,
  className,
  duration = 480,
  delay = 0,
  mode = 'auto',
  as: Tag = 'span',
  ...rest
}) {
  const reduced = useReducedMotion()
  const target = String(value ?? '')
  const isPure = /^-?\d+(\.\d+)?$/.test(target)
  const counts = mode === 'count' || (mode === 'auto' && isPure)
  const animate = counts && !reduced

  // seed with a same-width mask so the resolve never shifts layout
  const [display, setDisplay] = useState(
    animate ? target.replace(/\d/g, '0') : target
  )
  const frame = useRef(0)

  useEffect(() => {
    if (!animate) {
      setDisplay(target)
      return
    }

    const decimals = (target.split('.')[1] || '').length
    const end = parseFloat(target)
    let start = null

    const tick = (now) => {
      if (start === null) start = now
      const elapsed = now - start - delay

      if (elapsed < 0) {
        frame.current = requestAnimationFrame(tick)
        return
      }

      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3) // settles gently

      setDisplay((eased * end).toFixed(decimals))

      if (p < 1) frame.current = requestAnimationFrame(tick)
      else setDisplay(target)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, animate, duration, delay])

  return (
    <Tag className={cx('num', className)} {...rest}>
      {display || ' '}
    </Tag>
  )
}
