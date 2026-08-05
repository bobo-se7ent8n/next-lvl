import { cx } from '../../lib/utils'
import { Highlight } from './Highlight'

/**
 * Floating callout — used next to the point it refers to (a timeline
 * position, a session row), never as a full-width banner. The eyebrow
 * is a highlighter chip; the panel itself stays neutral.
 */
export function Callout({ eyebrow, title, children, footer, className, style }) {
  return (
    <div
      className={cx(
        'w-[320px] max-w-full rounded-lg bg-panel p-md shadow-raise sq',
        className
      )}
      style={style}
    >
      {eyebrow && <Highlight tone="lavender">{eyebrow}</Highlight>}
      {title && (
        <p className="m-0 mt-sm text-[15px] font-semibold leading-snug text-ink">
          {title}
        </p>
      )}
      {children && (
        <p className="m-0 mt-[6px] text-[12px] leading-relaxed text-ink3">
          {children}
        </p>
      )}
      {footer && <div className="mt-sm">{footer}</div>}
    </div>
  )
}
