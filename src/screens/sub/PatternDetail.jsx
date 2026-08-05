import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { PATTERNS, STATE_LABEL } from '../../data/mock'
import { STATE_HL } from '../../lib/palette'

import {
  Card,
  Highlight,
  Placeholder,
  ScreenHeader,
  SegBar,
  SegLegend,
} from '../../components/ui'
import { Chart } from '../../components/charts'
import { Num } from '../../components/motion/Num'

/** Each pattern routes to its own draft article, not the generic feed. */
export default function PatternDetail() {
  const { id } = useParams()
  const pattern = PATTERNS.find((p) => p.id === id)

  if (!pattern) return <Navigate to="/insights" replace />

  return (
    <div className="wrap pb-4xl pt-xl">
      <Link
        to="/"
        className="mb-md inline-flex items-center gap-[6px] rounded-pill bg-surface px-md py-[8px] text-[12px] font-medium text-ink2 transition-colors hover:bg-surface2 hover:text-ink"
      >
        <ArrowLeft size={13} strokeWidth={2.2} />
        Patterns
      </Link>

      <ScreenHeader
        title={pattern.name}
        right={
          <Highlight tone={STATE_HL[pattern.state]} size="lg">
            {STATE_LABEL[pattern.state]}
          </Highlight>
        }
      />

      {/* the number leads, exactly as it does on the mosaic card */}
      <Card className="mb-md max-w-[900px]">
        <div className="flex flex-wrap items-end gap-lg">
          <div>
            <Num
              value={pattern.hero}
              className="block text-[clamp(60px,9vw,110px)] font-extrabold leading-[0.82] tracking-tightest text-ink"
            />
            <div className="readout-label mt-md">{pattern.cap}</div>
          </div>

          <div className="min-w-[260px] flex-1">
            <Num
              value={pattern.delta}
              className="block text-[20px] font-bold tracking-tightest text-ink2"
            />
            <Chart spec={pattern.chart} height={88} className="mt-md" />
            {pattern.segs && (
              <>
                <SegBar segments={pattern.segs} labels className="mt-lg" />
                <SegLegend segments={pattern.segs} className="mt-md" />
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="max-w-[900px]">
        {pattern.quote && (
          <p className="m-0 mb-lg max-w-[26ch] text-[clamp(18px,2.2vw,26px)] font-medium leading-[1.35] tracking-display text-ink">
            “{pattern.quote}”
          </p>
        )}

        <p className="m-0 measure text-[15px] leading-generous text-ink2">
          {pattern.article.body}
        </p>

        <Placeholder className="my-lg h-[80px]" />

        <p className="m-0 measure text-[15px] leading-generous text-ink2">
          {pattern.article.body2}
        </p>
      </Card>
    </div>
  )
}
