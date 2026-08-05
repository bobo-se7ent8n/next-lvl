import { useCallback, useEffect, useRef } from 'react'

import { PATTERNS, VITALS } from '../data/mock'
import { useAppState } from '../state/AppState'
import { useScrollProgress } from '../lib/scrollProgress'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useMediaQuery } from '../lib/useMediaQuery'

import { EmptyState, Inked, useToast } from '../components/ui'
import { FocusPanel } from '../components/home/FocusPanel'
import { VitalCard } from '../components/home/VitalCard'
import { PatternCard } from '../components/home/PatternCard'
import { ActivityHeatmap } from '../components/home/ActivityHeatmap'

/* ============================================================
   HOME · fixed three-column shell

   The page itself does not scroll. The shell is sized to exactly one
   viewport minus the ruler and the nav, and only the centre column
   overflows — so the side columns are static by construction rather
   than by `sticky`; they simply have nowhere to go.

   Below 1024px the whole thing collapses to one ordinary stacked
   scrolling column and the page scrolls again.
   ============================================================ */

const SHELL = 'lg:h-[calc(100svh_-_var(--ruler-h)_-_var(--nav-h))]'

/* ============================================================
   PATTERN STACK

   Cards scale, fade and pull together with their distance from the
   centre of the scroller: the card under the middle of the column is
   full size and fully opaque, everything above and below recedes
   into a deck.

   The transform is written to CSS variables on each card from one
   rAF-throttled scroll handler, so React never re-renders while the
   column is moving.
   ============================================================ */

function PatternStack({ patterns, onMute, scrollerRef }) {
  const itemsRef = useRef([])
  const frame = useRef(0)
  const { report, claim } = useScrollProgress()
  const reduced = useReducedMotion()

  /* The deck is a property of the shell: it needs a column that
     actually scrolls. Once the layout collapses there is no such
     column, so the effect turns off and the ruler goes back to
     measuring the window. */
  const shell = useMediaQuery('(min-width: 1024px)')
  const deck = shell && !reduced

  useEffect(() => {
    if (!shell) return undefined
    return claim()
  }, [claim, shell])

  const measure = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const box = scroller.getBoundingClientRect()
    const half = box.height / 2
    const reach = half + 120
    const first = itemsRef.current[0]

    /* The focal line is the middle of the column — except at the very
       top of the scroll, where it rides up to the first card. Without
       that the top card would sit permanently scaled down, which is
       exactly what stopped the column reading as top-aligned. */
    const lead = first ? first.getBoundingClientRect().height / 2 : half
    const focus = box.top + Math.min(half, scroller.scrollTop + lead)

    for (const el of itemsRef.current) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const signed = (r.top + r.height / 2 - focus) / reach
      const d = Math.max(-1.4, Math.min(1.4, signed))
      el.style.setProperty('--d', d.toFixed(3))
      el.style.setProperty('--k', Math.min(1, Math.abs(d)).toFixed(3))
    }

    const max = scroller.scrollHeight - scroller.clientHeight
    report(max > 0 ? scroller.scrollTop / max : 0)
  }, [report, scrollerRef])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || !shell) {
      // leave every card at rest when the shell is collapsed
      for (const el of itemsRef.current) {
        if (!el) continue
        el.style.removeProperty('--d')
        el.style.removeProperty('--k')
      }
      return undefined
    }

    const onScroll = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(measure)
    }

    measure()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame.current)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [measure, scrollerRef, patterns.length, shell])

  return (
    // fills its track instead of sitting in a narrow centred measure,
    // so the only space between columns is the 12px grid gutter
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-[12px] pb-md lg:pb-[34vh]">
      {patterns.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            itemsRef.current[i] = el
          }}
          className={deck ? 'will-change-transform' : undefined}
          style={
            deck
              ? {
                  transform:
                    'translateY(calc(var(--d, 0) * -26px)) scale(calc(1 - var(--k, 0) * 0.13))',
                  opacity: 'calc(1 - var(--k, 0) * 0.62)',
                  transition: 'transform 120ms linear, opacity 120ms linear',
                }
              : undefined
          }
        >
          <PatternCard pattern={p} index={i} onMute={onMute} />
        </div>
      ))}
    </div>
  )
}

/* ============================================================ */

export default function Home() {
  const { mutedPatterns, mutePattern, unmutePattern } = useAppState()
  const showToast = useToast()
  const scrollerRef = useRef(null)

  const visible = PATTERNS.filter((p) => !mutedPatterns.has(p.id))

  const handleMute = (pattern) => {
    mutePattern(pattern.id)
    showToast('Pattern muted', () => unmutePattern(pattern.id))
  }

  return (
    /* One 12px gutter between the columns and the same 12px from the
       viewport edge, so the three read as one layout rather than as
       three islands. Every column starts at the same top edge. */
    <div
      className={`lg:grid lg:grid-cols-[minmax(300px,25%)_minmax(0,1fr)_minmax(280px,23%)] lg:items-start lg:gap-0 lg:overflow-hidden lg:px-[6px] lg:pt-[20px] ${SHELL}`}
    >
      {/* ---------------- left · focus ----------------
          Columns paint no fill of their own — the background layers
          live behind the whole app and each block carries its own
          surface. `overflow-y-auto` is insurance for short viewports,
          not a scroll region: at normal heights the column fits. */}
      <aside className="scroll-col flex flex-col gap-[12px] px-md py-md md:px-lg lg:h-full lg:overflow-y-auto lg:px-[6px] lg:py-0 lg:pb-[6px]">
        <FocusPanel />

        <section className="rounded-lg bg-panel p-md shadow-pop sq">
          <Inked as="h2" className="mb-[12px] text-[clamp(19px,1.9vw,25px)]">
            Activity
          </Inked>
          <ActivityHeatmap fluid cell={11} />
        </section>
      </aside>

      {/* ---------------- centre · patterns, the only scroller ---------------- */}
      <div
        ref={scrollerRef}
        className="scroll-col px-md md:px-lg lg:h-full lg:overflow-y-auto lg:px-[6px]"
      >
        <Inked
          as="h2"
          className="pt-md text-[clamp(24px,2.6vw,36px)] lg:absolute lg:-left-[9999px]"
        >
          Patterns
        </Inked>

        {visible.length ? (
          <PatternStack
            patterns={visible}
            onMute={handleMute}
            scrollerRef={scrollerRef}
          />
        ) : (
          <EmptyState className="my-2xl">
            No confirmed patterns yet — keep playing, patterns emerge after they
            repeat.
          </EmptyState>
        )}
      </div>

      {/* ---------------- right · vitals ---------------- */}
      <aside className="scroll-col flex flex-col gap-[12px] px-md py-md pb-4xl md:px-lg lg:h-full lg:overflow-y-auto lg:px-[6px] lg:py-0 lg:pb-[6px]">
        <div className="rounded-lg bg-panel py-[10px] px-md shadow-pop sq">
          <Inked as="h2" className="text-[clamp(20px,2vw,26px)]">
            Vitals
          </Inked>
        </div>

        <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-2">
          {VITALS.map((v, i) => (
            <VitalCard key={v.label} {...v} delay={i * 40} />
          ))}
        </div>
      </aside>
    </div>
  )
}
