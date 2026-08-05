import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'

import { STATE_LABEL } from '../../data/mock'
import { cx } from '../../lib/utils'
import { STATE_HL } from '../../lib/palette'
import { useEscape } from '../../lib/useEscape'
import { Highlight, SelectionFrame } from '../ui'
import { Chart, ChartLegend, chartLegend } from '../charts'
import { Num } from '../motion/Num'

/* ============================================================
   PATTERN CARD

   Every card is the same size and carries the same five things in
   the same order — name, hero numeral, context line, chart, status.
   Nothing here scales with importance, because none of these
   patterns is more important than another.
   ============================================================ */

export function PatternCard({ pattern, index, onMute }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e) => {
      if (!ref.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [menuOpen])

  useEscape(
    useCallback(() => setMenuOpen(false), []),
    menuOpen
  )

  const open = () => navigate(`/insights/pattern/${pattern.id}`)
  const legend = chartLegend(pattern.chart)

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={pattern.name}
      onClick={open}
      onKeyDown={(e) => e.key === 'Enter' && open()}
      className="group relative flex w-full cursor-pointer flex-col rounded-card bg-panel p-md shadow-pop sq md:p-lg"
    >
      <SelectionFrame name={pattern.name} radius={118} />

      {/* ---- name ---- */}
      <div className="flex items-start gap-sm">
        <p className="m-0 flex-1 pr-sm text-[13px] font-medium leading-snug text-ink2">
          {pattern.name}
        </p>

        <button
          type="button"
          aria-label={`More options for ${pattern.name}`}
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
          className="-mr-[6px] -mt-[6px] inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-ink3 transition-colors hover:bg-surface hover:text-ink"
        >
          <MoreHorizontal size={15} strokeWidth={2} />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-md top-[52px] z-30 overflow-hidden rounded-sm bg-panel shadow-raise sq">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(false)
              onMute(pattern)
            }}
            className="block w-full whitespace-nowrap px-md py-[11px] text-left text-[12px] text-ink2 transition-colors hover:bg-surface hover:text-ink"
          >
            Mute
          </button>
        </div>
      )}

      {/* ---- hero numeral + context ---- */}
      <Num
        value={pattern.hero}
        delay={index * 30}
        className="mt-md block text-[clamp(44px,4.4vw,62px)] font-extrabold leading-[0.82] tracking-tightest text-ink"
      />
      <p className="readout-label m-0 mt-sm text-[9px]">{pattern.context}</p>

      {/* ---- chart ---- */}
      <div className="mt-md">
        <Chart spec={pattern.chart} height={62} />
        {legend && <ChartLegend items={legend} className="mt-sm" />}
      </div>

      {/* ---- status ---- */}
      <div className="mt-md">
        <Highlight tone={STATE_HL[pattern.state]} size="sm">
          {STATE_LABEL[pattern.state]}
        </Highlight>
      </div>
    </div>
  )
}
