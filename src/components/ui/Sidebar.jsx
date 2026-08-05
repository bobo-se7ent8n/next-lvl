import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cx } from '../../lib/utils'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { Inked } from './Inked'

/** Right-hand slide-in panel with a scrim. Esc closes. */
export function Sidebar({ open, onClose, title, subtitle, footer, children }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cx(
              'fixed bottom-[10px] right-[10px] top-[10px] z-50 flex w-[460px] max-w-[94vw] flex-col overflow-hidden',
              'rounded-xl bg-panel shadow-raise sq'
            )}
            initial={{ x: reduced ? 0 : '104%', opacity: reduced ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduced ? 0 : '104%', opacity: reduced ? 0 : 1 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.3, 1] }}
          >
            <header className="flex items-start gap-sm px-lg pb-md pt-lg">
              <Inked as="h2" className="flex-1 text-[clamp(24px,3vw,34px)]">
                {title}
              </Inked>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-surface text-ink2 transition-colors hover:bg-surface2 hover:text-ink"
              >
                <X size={15} strokeWidth={2} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-lg pb-md">{children}</div>

            {footer && <div className="px-lg pb-lg pt-md">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
