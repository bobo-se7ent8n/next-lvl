import { cx } from '../../lib/utils'
import { hlFill, hlInk } from '../../lib/palette'

/**
 * Highlighter chip — a solid pastel-bright fill with dark monospace
 * caps sitting directly on it. No border, minimal padding, fully
 * rounded caps: a marker swipe over a word, not a badge.
 *
 * This is the only element in the project allowed to carry saturated
 * colour, so it is also the only thing that should ever compete for
 * attention against a numeral.
 */
export function Highlight({
  tone = 'lime',
  size = 'md',
  className,
  children,
  as: Tag = 'span',
  ...rest
}) {
  const sizes = {
    xs: 'px-[7px] py-[3px] text-[8px]',
    sm: 'px-[8px] py-[3px] text-[9px]',
    md: 'px-[10px] py-[4px] text-[10px]',
    lg: 'px-[13px] py-[6px] text-[11px]',
  }

  const base = cx(
    'inline-block whitespace-nowrap rounded-pill font-mono font-medium uppercase leading-none tracking-[0.08em]',
    sizes[size] || sizes.md,
    className
  )

  /* `tone="neutral"` keeps the chip's shape and rhythm while spending
     no colour — used where a chip labels a category that is currently
     unremarkable, so the coloured version reads as a real signal. */
  if (tone === 'neutral') {
    return (
      <Tag className={cx(base, 'bg-surface2 text-ink2')} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      className={base}
      style={{ background: hlFill(tone), color: hlInk(tone) }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Small colour dot + value — the legend under a segmented bar. */
export function LegendDot({ tone, label, value, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-[6px] whitespace-nowrap text-[10px] font-medium text-ink3',
        className
      )}
    >
      <i
        aria-hidden="true"
        className="block h-[7px] w-[7px] shrink-0 rounded-pill"
        style={{ background: hlFill(tone) }}
      />
      {label && <span className="uppercase tracking-[0.06em]">{label}</span>}
      {value != null && <b className="num font-semibold text-ink2">{value}</b>}
    </span>
  )
}
