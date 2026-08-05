import { motion } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * Staggered entrance for card grids and tile rows — ~30ms per item,
 * a fade and a 6px rise. Collapses to a plain fade when motion is
 * reduced.
 */
export function Stagger({
  children,
  className,
  step = 0.03,
  delay = 0.03,
  as = 'div',
  ...rest
}) {
  const reduced = useReducedMotion()
  const Comp = motion[as] || motion.div

  return (
    <Comp
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : step,
            delayChildren: reduced ? 0 : delay,
          },
        },
      }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function StaggerItem({ children, className, as = 'div', ...rest }) {
  const reduced = useReducedMotion()
  const Comp = motion[as] || motion.div

  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.2, ease: [0.2, 0.8, 0.3, 1] },
        },
      }}
      {...rest}
    >
      {children}
    </Comp>
  )
}
