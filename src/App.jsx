import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { TopNav } from './components/nav/TopNav'
import { PageTransition } from './components/motion/PageTransition'
import { ToastProvider } from './components/ui'
import { AppStateProvider } from './state/AppState'
import { BackgroundProvider } from './state/BackgroundState'
import { BackgroundLayers } from './components/bg/BackgroundLayers'
import { BackgroundPanel } from './components/bg/BackgroundPanel'
import { ScrollRuler } from './components/chrome/ScrollRuler'
import { ScrollProgressProvider } from './lib/scrollProgress'

import Home from './screens/Home'
import Sessions from './screens/Sessions'
import Insights from './screens/Insights'
import Scoreboard from './screens/Scoreboard'
import FocusArchive from './screens/sub/FocusArchive'
import PatternDetail from './screens/sub/PatternDetail'
import SessionDetail from './screens/sub/SessionDetail'

/**
 * Stacking, bottom to top: background layers (z-0, inert) → page
 * content (z-10) → the scroll ruler (z-30) → nav (z-40) → modals and
 * the dev panel (z-50+).
 *
 * Every page is full-bleed, so <main> adds no container and no
 * padding of its own — each screen owns its gutters.
 */
export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <BackgroundProvider>
      <ScrollProgressProvider>
        <AppStateProvider>
          <ToastProvider>
            <BackgroundLayers />
            <ScrollRuler />

            <div className="relative z-10 pt-[var(--ruler-h)]">
              <TopNav />

              <main>
                <AnimatePresence mode="wait" initial={false}>
                  <PageTransition key={location.pathname}>
                    <Routes location={location}>
                      <Route path="/" element={<Home />} />
                      <Route path="/focus" element={<FocusArchive />} />
                      <Route path="/sessions" element={<Sessions />} />
                      <Route path="/sessions/:id" element={<SessionDetail />} />
                      <Route path="/insights" element={<Insights />} />
                      <Route
                        path="/insights/pattern/:id"
                        element={<PatternDetail />}
                      />
                      <Route path="/scoreboard" element={<Scoreboard />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </PageTransition>
                </AnimatePresence>
              </main>
            </div>

            <BackgroundPanel />
          </ToastProvider>
        </AppStateProvider>
      </ScrollProgressProvider>
    </BackgroundProvider>
  )
}
