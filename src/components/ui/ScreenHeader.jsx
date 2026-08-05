import { cx } from '../../lib/utils'
import { Inked } from './Inked'

/**
 * Screen headline: Oswald, uppercase, per-letter weight randomised.
 * No rule beneath it, no privacy tag beside it — separation is
 * whitespace, and the title carries the screen on its own.
 */
export function ScreenHeader({ title, sub, right, className }) {
  return (
    <header
      className={cx(
        'mb-xl flex flex-wrap items-end gap-x-md gap-y-sm',
        className
      )}
    >
      <Inked as="h1" className="text-[clamp(34px,5.5vw,60px)]">
        {title}
      </Inked>

      {sub && <p className="m-0 pb-[8px] text-[13px] text-ink3">{sub}</p>}

      {right && (
        <div className="ml-auto flex flex-wrap items-center gap-sm pb-[6px]">
          {right}
        </div>
      )}
    </header>
  )
}
