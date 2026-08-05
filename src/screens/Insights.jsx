import { useState } from 'react'

import { CARDS, INSIGHT_FILTERS } from '../data/mock'
import { rankCards } from '../lib/utils'
import { toneFor } from '../lib/palette'

import {
  Button,
  Highlight,
  Input,
  Placeholder,
  ScreenHeader,
  Segmented,
  Sidebar,
  Tag,
} from '../components/ui'
import { Stagger, StaggerItem } from '../components/motion/Stagger'

/** A library item. Same card shape in the grid and in the sidebar. */
function InsightCard({ card, wide = false }) {
  return (
    <div
      className={`lift flex h-full flex-col rounded-card bg-surface p-md sq md:p-lg ${
        wide ? 'w-full' : 'min-h-[240px] w-full'
      }`}
    >
      {card.pat && (
        <Highlight tone={toneFor(card.pat)} size="sm" className="mb-md self-start">
          {card.pat}
        </Highlight>
      )}

      <div className="mb-md flex-1 text-[16px] font-semibold leading-snug text-ink">
        {card.t}
      </div>

      <Placeholder className="mb-md h-[44px]" />

      <div className="flex flex-wrap items-center gap-sm">
        <Tag>{card.k}</Tag>
        <Tag variant="quiet">{card.side === 'on' ? 'on court' : 'off court'}</Tag>
        <span className="num ml-auto text-[12px] font-semibold text-ink2">
          {card.d}
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   Ask aera — slide-in sidebar. Answers come back as cards,
   pulled from the whole library. Pull, never push.
   ============================================================ */

function AskSidebar({ open, onClose }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)

  const send = () => {
    const v = value.trim()
    if (!v) return
    setValue('')
    setResult({ query: v, picks: rankCards(v) })
  }

  return (
    <Sidebar
      open={open}
      onClose={onClose}
      title="Ask aera"
      footer={
        <div className="flex flex-wrap gap-sm">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Tell me what you want to work on…"
            aria-label="What do you want to work on"
            className="min-w-[140px] flex-1"
          />
          <Button variant="fill" onClick={send}>
            Send
          </Button>
        </div>
      }
    >
      {!result ? (
        <p className="quiet m-0">
          Ask for something to work on. Answers come back as cards, pulled from
          the whole library.
        </p>
      ) : (
        <>
          <Highlight tone="mint">{result.query}</Highlight>
          <Stagger className="mt-md flex flex-col gap-sm">
            {result.picks.map((p) => (
              <StaggerItem key={p.i}>
                <InsightCard card={p.c} wide />
              </StaggerItem>
            ))}
          </Stagger>
        </>
      )}
    </Sidebar>
  )
}

/* ============================================================ */

export default function Insights() {
  const [filter, setFilter] = useState('all')
  const [askOpen, setAskOpen] = useState(false)

  const list = CARDS.filter((c) => filter === 'all' || c.side === filter).slice(
    0,
    6
  )

  return (
    <div className="wrap pb-4xl pt-xl">
      <ScreenHeader
        title="Insights"
        right={
          <Button variant="fill" onClick={() => setAskOpen(true)}>
            Ask something
          </Button>
        }
      />

      <Segmented
        ariaLabel="Filter insights"
        value={filter}
        onChange={setFilter}
        options={INSIGHT_FILTERS.map((f) => [f.f, f.label])}
        className="mb-lg"
      />

      {/* auto-fill rather than breakpoints: the page is full-bleed, so
          the card count should follow the real width, not a guess */}
      <Stagger
        key={filter}
        className="grid grid-cols-1 gap-md sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
      >
        {list.map((c) => (
          <StaggerItem key={c.t}>
            <InsightCard card={c} />
          </StaggerItem>
        ))}
      </Stagger>

      <AskSidebar open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  )
}
