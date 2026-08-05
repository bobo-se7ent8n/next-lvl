import { useNavigate } from 'react-router-dom'
import { Clock3 } from 'lucide-react'

import { FOCUS } from '../../data/mock'
import { Highlight, IconButton, Inked } from '../ui'
import { Num } from '../motion/Num'

/* ============================================================
   FOCUS

   Three questions, answered in plain language and in order: what
   was observed, why it happens, what to do about it. Each answer is
   labelled, so the panel can be read top to bottom without anyone
   explaining the format.

   No diagram, no bubbles, no connectors — this is the one place in
   the app that is meant to sound like a person talking.

   Every block sits on its own surface, including the header, so
   nothing in the column floats directly on the page background.
   Blocks do not react to hover: they are text to read, not objects
   to pick.

   One focus. One action: the archive.
   ============================================================ */

export function FocusPanel() {
  const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-[12px]">
      <div className="flex items-center gap-md rounded-lg bg-panel py-[10px] pl-md pr-[10px] shadow-pop sq">
        <Inked as="h2" className="flex-1 text-[clamp(20px,2vw,26px)]">
          Focus
        </Inked>
        <IconButton label="Focus archive" onClick={() => navigate('/focus')}>
          <Clock3 size={15} strokeWidth={2} />
        </IconButton>
      </div>

      {/* the reading, up front — the number the whole focus is about */}
      <button
        type="button"
        onClick={() => navigate(`/sessions/${FOCUS.sessionIndex}`)}
        className="flex w-full flex-col items-start gap-[6px] rounded-lg bg-panel p-md text-left shadow-pop sq"
      >
        <Highlight tone="lavender" size="xs">
          {FOCUS.kicker}
        </Highlight>
        <div className="flex items-baseline gap-sm">
          <Num
            value={FOCUS.stat}
            className="text-[clamp(28px,2.8vw,38px)] font-extrabold leading-none tracking-tightest text-ink"
          />
          <span className="readout-label text-[9px]">{FOCUS.statLabel}</span>
        </div>
      </button>

      <ol className="m-0 flex list-none flex-col gap-[12px] p-0">
        {FOCUS.steps.map((step) => (
          <li key={step.label} className="rounded-lg bg-panel p-md shadow-pop sq">
            <Highlight tone={step.tone} size="xs">
              {step.label}
            </Highlight>
            <p className="m-0 mt-[8px] text-[12.5px] leading-[1.5] text-ink2">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
