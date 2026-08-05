import {
  ACTIVITY,
  ACTIVITY_DAY_LABELS,
  ACTIVITY_STATS,
} from '../../data/mock'
import { cx } from '../../lib/utils'
import { hlFill } from '../../lib/palette'
import { useMeasure } from '../../lib/useMeasure'
import { Num } from '../motion/Num'

/* ============================================================
   SESSION ACTIVITY

   One rounded cell per day, fill intensity standing for how much
   work that day held.

   A day with no session is drawn as an empty cell on the neutral
   ramp — not red, not dashed, not called a miss. There is no streak
   counter here either: a streak turns an ordinary rest day into a
   loss, and the second stat is deliberately a peak rather than a
   run, so nothing on this component can be failed.

   `fluid` sizes the cells from the measured width instead of a
   fixed number, so the grid fills whatever column it is dropped in.
   ============================================================ */

const LEVEL_ALPHA = [0, 0.34, 0.62, 1]
const LABEL_COL = 16
const GAP = 3

function cellStyle(level, tone) {
  if (level === 0) return { background: 'rgb(var(--c-surface2) / 0.55)' }
  return { background: hlFill(tone), opacity: LEVEL_ALPHA[level] }
}

export function ActivityHeatmap({ tone = 'lime', cell, fluid = false, className }) {
  const weeks = ACTIVITY_STATS.weeks
  const [ref, width] = useMeasure(320)

  /* Fill the column: every week gets an equal share of what is left,
     capped so a wide stacked column does not blow the grid up into
     tiles — past that width the grid simply stops growing. */
  const size = fluid
    ? Math.min(
        18,
        Math.max(6, Math.floor((width - LABEL_COL - (weeks - 1) * GAP) / weeks))
      )
    : (cell ?? 11)

  return (
    <section ref={ref} className={cx('flex w-full flex-col gap-[12px]', className)}>
      {/* ---- two neutral headline stats ---- */}
      <div className="flex flex-wrap items-end gap-lg">
        <div>
          <Num
            value={String(ACTIVITY_STATS.total)}
            className="block text-[clamp(26px,2.4vw,34px)] font-extrabold leading-none tracking-tightest text-ink"
          />
          <div className="readout-label mt-[6px] text-[9px]">
            sessions · {weeks} weeks
          </div>
        </div>

        <div>
          <Num
            value={String(ACTIVITY_STATS.peakSessions)}
            className="block text-[clamp(26px,2.4vw,34px)] font-extrabold leading-none tracking-tightest text-ink"
          />
          <div className="readout-label mt-[6px] text-[9px]">
            most active week · wk {ACTIVITY_STATS.peakWeek}
          </div>
        </div>
      </div>

      {/* ---- the grid ---- */}
      <div className="flex gap-[6px]">
        <div
          className="flex shrink-0 flex-col justify-between pt-[1px]"
          style={{ width: LABEL_COL - 6, height: 7 * size + 6 * GAP }}
        >
          {ACTIVITY_DAY_LABELS.map((d, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="block text-[8px] font-medium leading-none text-ink3"
              style={{ height: size }}
            >
              {i % 2 === 1 ? d : ''}
            </span>
          ))}
        </div>

        <div
          role="img"
          aria-label={`${ACTIVITY_STATS.total} sessions across ${weeks} weeks`}
          className="grid min-w-0 grid-flow-col"
          style={{
            gridTemplateRows: `repeat(7, ${size}px)`,
            gridAutoColumns: `${size}px`,
            gap: `${GAP}px`,
          }}
        >
          {ACTIVITY.map((d, i) => (
            <span
              key={i}
              className="block sq"
              style={{
                ...cellStyle(d.level, tone),
                width: size,
                height: size,
                borderRadius: Math.max(3, Math.round(size * 0.34)),
              }}
              title={`week ${d.week + 1} · ${
                d.level === 0 ? 'no session' : `level ${d.level}`
              }`}
            />
          ))}
        </div>
      </div>

      {/* ---- scale ---- */}
      <div className="flex items-center gap-[6px]">
        <span className="text-[9px] font-medium uppercase tracking-label text-ink3">
          less
        </span>
        {[0, 1, 2, 3].map((l) => (
          <span
            key={l}
            aria-hidden="true"
            className="block h-[10px] w-[10px] rounded-[4px] sq"
            style={cellStyle(l, tone)}
          />
        ))}
        <span className="text-[9px] font-medium uppercase tracking-label text-ink3">
          more
        </span>
      </div>
    </section>
  )
}
