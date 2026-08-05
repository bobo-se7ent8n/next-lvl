import { cx } from '../../lib/utils'
import { hlFill } from '../../lib/palette'
import { LegendDot } from './Highlight'

/* ============================================================
   SEGMENTED BAR

   A thin comparison bar in two or three highlighter colours, each
   segment carrying its own fully rounded caps. Optional value
   labels sit above the breakpoints; the legend beneath repeats the
   colours as dots so the bar never has to be read by hue alone.
   ============================================================ */

/** segments: [{ tone, pct, label, value }] */
export function SegBar({ segments, labels = false, thickness = 8, className }) {
  const total = segments.reduce((a, s) => a + s.pct, 0) || 1

  // cumulative breakpoints, used to place the labels above the bar
  let acc = 0
  const marks = segments.map((s) => {
    const start = (acc / total) * 100
    acc += s.pct
    return { ...s, start, end: (acc / total) * 100 }
  })

  return (
    <div className={cx('w-full', className)}>
      {labels && (
        <div className="relative mb-[6px] h-[13px]">
          {marks.map((m, i) => (
            <span
              key={i}
              className="num absolute top-0 whitespace-nowrap text-[10px] font-semibold leading-none text-ink2"
              style={{
                left: `${m.start}%`,
                transform: i === 0 ? 'none' : 'translateX(-4px)',
              }}
            >
              {m.value ?? `${Math.round(m.pct)}%`}
            </span>
          ))}
        </div>
      )}

      <div className="flex w-full items-stretch gap-[3px]" style={{ height: thickness }}>
        {marks.map((m, i) => (
          <span
            key={i}
            className="block rounded-pill"
            style={{
              width: `${(m.pct / total) * 100}%`,
              background: hlFill(m.tone),
            }}
          />
        ))}
      </div>
    </div>
  )
}

/** The dot row that reads the bar back as percentages. */
export function SegLegend({ segments, className }) {
  const total = segments.reduce((a, s) => a + s.pct, 0) || 1

  return (
    <div className={cx('flex flex-wrap items-center gap-x-md gap-y-[6px]', className)}>
      {segments.map((s, i) => (
        <LegendDot
          key={i}
          tone={s.tone}
          label={s.label}
          value={`${Math.round((s.pct / total) * 100)}%`}
        />
      ))}
    </div>
  )
}
