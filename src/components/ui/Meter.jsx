import { cx } from '../../lib/utils'
import { hlFill } from '../../lib/palette'

/**
 * Single-fill bar with rounded caps, on a recessed track.
 *
 * `tone` names a highlighter colour. Magnitude is carried by the
 * numeral beside the bar, not by hue, so the colour choice is free
 * to stay consistent within a section rather than encode a value.
 */
export function Meter({ value, tone = 'lime', className, style }) {
  const pct = Math.max(0, Math.min(100, value))

  return (
    <span className={cx('bar-track', className)} style={style}>
      <i
        className="bar-fill"
        style={{ width: `${pct}%`, background: hlFill(tone) }}
        aria-hidden="true"
      />
    </span>
  )
}
