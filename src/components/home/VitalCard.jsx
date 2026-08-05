import { cx } from '../../lib/utils'
import { Highlight, SelectionFrame } from '../ui'
import { Chart } from '../charts'
import { Num } from '../motion/Num'

/* ============================================================
   VITAL CARD

   Every vital is the same square. Shape carries no meaning any
   more, so the card has to say what it is in words and show its own
   data rather than lean on a silhouette:

     chip     — the category, plus the state when the reading sits
                outside the player's own baseline
     name     — the metric
     numeral  — the reading, with its unit
     chart    — the same chart family every other chart uses

   Everything is visible at rest: no hide toggle, no ⓘ, no
   click-to-highlight. Hover is the Figma selection frame and
   nothing else — the fill never shifts, so a card being pointed at
   never reads as a card whose value changed.
   ============================================================ */

export function VitalCard({
  label,
  category,
  value,
  unit,
  state,
  tone,
  chart,
  delay = 0,
  className,
}) {
  const out = state !== 'in'

  return (
    <div
      className={cx(
        'group relative flex aspect-square w-full flex-col justify-between rounded-lg bg-panel p-[14px] shadow-pop sq',
        className
      )}
    >
      <SelectionFrame name={label} radius={76} />

      <div className="flex items-start justify-between gap-[6px]">
        <Highlight tone={out ? tone : 'neutral'} size="xs">
          {category}
        </Highlight>
      </div>

      <div>
        <div className="readout-label mb-[4px] truncate text-[9px]">{label}</div>
        <div className="flex items-baseline gap-[3px]">
          <Num
            value={value}
            delay={delay}
            className="text-[clamp(24px,2.2vw,34px)] font-extrabold leading-none tracking-tightest text-ink"
          />
          <span className="text-[10px] font-medium text-ink3">{unit}</span>
        </div>
      </div>

      <Chart spec={chart} height={34} />
    </div>
  )
}
