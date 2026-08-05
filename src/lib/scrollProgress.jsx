import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

/* ============================================================
   SCROLL PROGRESS

   The ruler is global chrome, but what it measures changes per
   screen: on Home the only scrolling region is the centre column,
   everywhere else it is the window.

   A screen with its own scroller `claim()`s the ruler on mount and
   reports progress itself; the ruler falls back to window scroll
   whenever nothing has claimed it.
   ============================================================ */

const Ctx = createContext({
  progress: 0,
  claimed: false,
  report: () => {},
  claim: () => () => {},
})

export const useScrollProgress = () => useContext(Ctx)

export function ScrollProgressProvider({ children }) {
  const [progress, setProgress] = useState(0)
  const [claimed, setClaimed] = useState(false)

  const claim = useCallback(() => {
    setClaimed(true)
    return () => {
      setClaimed(false)
      setProgress(0)
    }
  }, [])

  const report = useCallback((p) => {
    setProgress(Math.max(0, Math.min(1, p || 0)))
  }, [])

  const value = useMemo(
    () => ({ progress, claimed, report, claim }),
    [progress, claimed, report, claim]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
