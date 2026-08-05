import { motion } from 'framer-motion'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * Quick fade plus a minimal vertical shift — ~170ms. No scale, no
 * glitch. Wrapped by <AnimatePresence mode="wait"> in App.jsx.
 */
export function PageTransition({ children, className }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.17, ease: [0.2, 0.8, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
