import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

import { SESSIONS } from '../data/mock'
import { cx, matchesSession } from '../lib/utils'
import { useEscape } from '../lib/useEscape'

import {
  EmptyState,
  Highlight,
  Input,
  ScreenHeader,
} from '../components/ui'
import { Num } from '../components/motion/Num'
import { Stagger, StaggerItem } from '../components/motion/Stagger'
import { ActivityHeatmap } from '../components/home/ActivityHeatmap'

/** One numeric cell in a session row. */
function Stat({ value, label }) {
  return (
    <span className="flex w-[62px] shrink-0 flex-col gap-[4px]">
      <Num
        value={String(value || '—')}
        className="text-[18px] font-bold leading-none text-ink"
      />
      <span className="text-[9px] font-medium uppercase tracking-label text-ink3">
        {label}
      </span>
    </span>
  )
}

function SessionRow({ session, index, expanded, onToggleTag }) {
  const navigate = useNavigate()

  return (
    <StaggerItem className="mb-sm">
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/sessions/${index}`)}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/sessions/${index}`)}
        className={cx(
          'lift flex w-full cursor-pointer flex-wrap items-center gap-md bg-surface px-md py-md text-left sq md:px-lg',
          expanded ? 'rounded-t-card rounded-b-xs' : 'rounded-card'
        )}
      >
        <span className="w-[220px] shrink-0 text-[15px] font-semibold text-ink">
          {session.d}
        </span>

        <Stat value={session.shots} label="shots" />
        <Stat value={session.pts} label="pts" />
        <Stat value={session.reb} label="reb" />
        <Stat value={session.ast} label="ast" />
        <Stat value={session.to} label="to" />

        <span className="num w-[72px] shrink-0 text-[13px] font-medium text-ink2">
          {session.dur}
        </span>

        {session.tag && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleTag(index)
            }}
            aria-expanded={expanded}
            className="inline-flex items-center"
          >
            <Highlight tone="lime" className="inline-flex items-center gap-[5px]">
              {session.tag}
              <ChevronDown
                size={11}
                className={cx(
                  'transition-transform duration-180',
                  expanded && 'rotate-180'
                )}
              />
            </Highlight>
          </button>
        )}

        <ArrowUpRight
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="ml-auto text-ink3"
        />
      </div>

      <AnimatePresence initial={false}>
        {expanded && session.tag && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-[4px] rounded-b-card rounded-t-xs bg-surface2/60 px-md py-md sq md:px-lg">
              <Highlight tone="lavender">Pattern candidate</Highlight>
              <p className="m-0 mt-sm text-[15px] font-semibold text-ink">
                {session.cand}
              </p>
              <p className="quiet m-0 mt-[4px]">{session.cdesc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StaggerItem>
  )
}

export default function Sessions() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(-1)

  useEscape(useCallback(() => setExpanded(-1), []))

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SESSIONS.map((s, i) => ({ s, i })).filter(({ s }) =>
      matchesSession(s, q)
    )
  }, [query])

  return (
    <div className="wrap pb-4xl pt-xl">
      <ScreenHeader
        title="Sessions"
        right={
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a session…"
            aria-label="Find a session"
            className="w-[300px] max-w-full"
          />
        }
      />

      <div className="mb-2xl inline-block rounded-card bg-panel p-md shadow-pop sq md:p-lg">
        <ActivityHeatmap cell={13} gap={4} />
      </div>

      {shown.length ? (
        <Stagger>
          {shown.map(({ s, i }) => (
            <SessionRow
              key={s.d}
              session={s}
              index={i}
              expanded={expanded === i}
              onToggleTag={(idx) => setExpanded(expanded === idx ? -1 : idx)}
            />
          ))}
        </Stagger>
      ) : (
        <EmptyState>
          {SESSIONS.length
            ? 'No sessions match that search — try a different word, or clear it to see everything.'
            : "No sessions yet — play a session and it'll show up here."}
        </EmptyState>
      )}

      <p className="quiet num mt-lg">
        {shown.length} of {SESSIONS.length} recorded sessions
      </p>
    </div>
  )
}
