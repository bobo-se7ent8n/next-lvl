import { cx } from '../../lib/utils'
import { Num } from '../motion/Num'

/**
 * Hero numeral — clean sans, very heavy, tight tracking, sized to
 * dominate whatever card it sits in. Everything around it is
 * secondary by an order of magnitude.
 */
export function HeroStat({ value, suffix, label, context, className }) {
  return (
    <div className={cx('flex flex-col gap-sm', className)}>
      <div className="flex items-baseline gap-[10px]">
        <Num
          value={String(value)}
          as="span"
          className="text-[clamp(64px,10vw,124px)] font-extrabold leading-[0.82] tracking-tightest text-ink"
        />
        {suffix && (
          <span className="num text-[clamp(24px,4vw,44px)] font-semibold leading-[0.9] tracking-tightest text-ink3">
            {suffix}
          </span>
        )}
      </div>

      {label && <div className="readout-label mt-sm">{label}</div>}
      {context && <p className="num m-0 text-[12px] text-ink3">{context}</p>}
    </div>
  )
}
