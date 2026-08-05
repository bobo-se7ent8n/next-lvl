import { createContext, useContext, useMemo, useState } from 'react'
import { SEED_GOALS, SHARE_SECTIONS } from '../data/mock'

/**
 * State that has to outlive a screen unmount lives here — screens are
 * unmounted by AnimatePresence on every navigation, so muted patterns,
 * goals and sharing choices all sit above routing.
 */
const Ctx = createContext(null)

export const useAppState = () => useContext(Ctx)

export function AppStateProvider({ children }) {
  const [mutedPatterns, setMutedPatterns] = useState(() => new Set())
  const [goals, setGoals] = useState(SEED_GOALS)
  const [share, setShare] = useState(() =>
    Object.fromEntries(SHARE_SECTIONS.map((k) => [k, false]))
  )

  const value = useMemo(
    () => ({
      mutedPatterns,
      mutePattern: (id) =>
        setMutedPatterns((s) => new Set(s).add(id)),
      unmutePattern: (id) =>
        setMutedPatterns((s) => {
          const next = new Set(s)
          next.delete(id)
          return next
        }),

      goals,
      setGoals,

      share,
      setShare,
    }),
    [mutedPatterns, goals, share]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
