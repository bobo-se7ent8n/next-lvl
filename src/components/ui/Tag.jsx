import { cx } from '../../lib/utils'
import { STATE_HL } from '../../lib/palette'
import { Highlight } from './Highlight'

/**
 * Small capsule tag. Trend states render as highlighter chips —
 * "declining" gets coral, never red, and the wording stays neutral.
 * Everything else stays on the neutral ramp, because saturated
 * colour is reserved for the states that carry a read.
 */
const NEUTRAL = {
  neutral: 'bg-surface2/70 text-ink2',
  quiet: 'bg-transparent text-ink3',
  solid: 'bg-ink text-panel font-semibold',
}

export function Tag({
  variant = 'neutral',
  className,
  children,
  as: Tag_ = 'span',
  ...rest
}) {
  if (STATE_HL[variant]) {
    return (
      <Highlight tone={STATE_HL[variant]} as={Tag_} className={className} {...rest}>
        {children}
      </Highlight>
    )
  }

  if (variant === 'accent') {
    return (
      <Highlight tone="lime" as={Tag_} className={className} {...rest}>
        {children}
      </Highlight>
    )
  }

  return (
    <Tag_
      className={cx(
        'inline-block whitespace-nowrap rounded-pill px-[11px] py-[4px] text-[10px] font-medium uppercase leading-none tracking-label',
        NEUTRAL[variant] || NEUTRAL.neutral,
        className
      )}
      {...rest}
    >
      {children}
    </Tag_>
  )
}
