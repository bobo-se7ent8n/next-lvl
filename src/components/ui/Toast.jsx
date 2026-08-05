import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './Button'

const ToastCtx = createContext(() => {})

/** showToast(message, undoFn) — mirrors the prototype's undo affordance. */
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const showToast = useCallback(
    (message, undoFn) => {
      const id = nextId.current++
      setToasts((t) => [...t, { id, message, undoFn }])
      timers.current[id] = setTimeout(() => dismiss(id), 5000)
    },
    [dismiss]
  )

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-md right-md z-[90] flex flex-col gap-[10px]">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18, ease: [0.2, 0.8, 0.3, 1] }}
                className="pointer-events-auto flex items-center gap-md rounded-pill bg-panel py-[10px] pl-lg pr-[10px] text-[12px] text-ink2 shadow-raise"
              >
                <span>{t.message}</span>
                {t.undoFn && (
                  <Button
                    size="sm"
                    onClick={() => {
                      dismiss(t.id)
                      t.undoFn()
                    }}
                  >
                    Undo
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  )
}
