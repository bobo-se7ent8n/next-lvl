import { useEffect } from 'react'

/**
 * Esc closes any open overlay / menu / expanded panel, app-wide.
 * Each component registers what "closed" means for it.
 */
export function useEscape(handler, active = true) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') handler(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler, active])
}
