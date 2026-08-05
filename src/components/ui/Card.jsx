import { motion } from 'framer-motion'
import { cx } from '../../lib/utils'

/**
 * A card is a fill and a radius — nothing else. No stroke, no
 * divider, no shadow at rest. Hover moves the fill half a step,
 * which is the whole hover language of the project.
 */
export function Card({
  hover = false,
  padded = true,
  tone = 'surface',
  className,
  children,
  as = 'div',
  ...rest
}) {
  const Comp = motion[as] || motion.div

  return (
    <Comp
      className={cx(
        'relative rounded-card sq',
        tone === 'panel' ? 'bg-panel' : 'bg-surface',
        padded && 'p-md md:p-lg',
        hover && 'lift cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Small uppercase micro-label, body face — not a headline. */
export function SectionLabel({ children, className, ...rest }) {
  return (
    <p className={cx('sec-label m-0', className)} {...rest}>
      {children}
    </p>
  )
}

export function EmptyState({ children, className }) {
  return (
    <div
      className={cx(
        'rounded-card bg-surface p-xl text-center text-[13px] leading-generous text-ink3 sq',
        className
      )}
    >
      {children}
    </div>
  )
}

/** Wireframe block that stayed a placeholder in the prototype. */
export function Placeholder({ className, style }) {
  return (
    <div
      aria-hidden="true"
      className={cx('ph rounded-xs sq', className)}
      style={style}
    />
  )
}
