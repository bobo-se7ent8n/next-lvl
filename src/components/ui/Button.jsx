import { cx } from '../../lib/utils'

/**
 * Fully rounded buttons, fill-only. There are no strokes anywhere in
 * the project, so the quiet variant is a surface tone rather than an
 * outline — hover moves it one step up the neutral ramp.
 */
export function Button({
  variant = 'outline',
  size = 'md',
  className,
  children,
  as: Tag = 'button',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-[6px] whitespace-nowrap rounded-pill font-body font-medium transition-colors duration-180 ease-out disabled:cursor-not-allowed disabled:opacity-40'

  const sizes = {
    sm: 'px-[14px] py-[6px] text-[11px]',
    md: 'px-[20px] py-[10px] text-[12px]',
  }

  const variants = {
    outline: 'bg-surface text-ink2 hover:bg-surface2 hover:text-ink',
    fill: 'bg-ink text-panel hover:opacity-85',
    accent: 'bg-ink text-panel hover:opacity-85',
    ghost: 'bg-transparent text-ink3 hover:bg-surface hover:text-ink',
  }

  return (
    <Tag
      className={cx(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Circular icon-only button — the single-action affordance. */
export function IconButton({ className, children, label, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-surface text-ink2 transition-colors duration-180 hover:bg-surface2 hover:text-ink',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
