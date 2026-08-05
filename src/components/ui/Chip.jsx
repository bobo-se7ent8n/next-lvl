import { cx } from '../../lib/utils'

/**
 * Toggleable filter pill. Selected takes the ink fill; unselected is
 * a surface tone. No outlines in either state.
 */
export function Chip({ on = false, className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={cx(
        'rounded-pill px-[16px] py-[7px] text-[12px] transition-colors duration-180 ease-out',
        on
          ? 'bg-ink text-panel'
          : 'bg-surface text-ink2 hover:bg-surface2 hover:text-ink',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/**
 * Segmented control — the in-screen section switcher. Same pill
 * grammar as Chip, laid out as one group inside a recessed track.
 */
export function Segmented({ value, onChange, options, className, ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cx(
        'inline-flex flex-wrap items-center gap-[4px] rounded-pill bg-surface p-[4px]',
        className
      )}
    >
      {options.map(([key, label]) => {
        const on = value === key
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(key)}
            className={cx(
              'rounded-pill px-[18px] py-[8px] text-[12px] font-medium transition-colors duration-180 ease-out',
              on ? 'bg-ink text-panel' : 'bg-transparent text-ink2 hover:text-ink'
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
