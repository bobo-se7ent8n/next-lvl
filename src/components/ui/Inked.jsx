import { useMemo } from 'react'
import { cx } from '../../lib/utils'

/* ============================================================
   INKED HEADLINE

   Oswald's weight axis runs 200–700. Every character draws its own
   weight from that range, plus a degree or two of rotation and a
   pixel or two of vertical drift — so a headline reads as if it were
   inked by hand rather than set. The roll happens once per mount
   (useMemo keyed on the text), which keeps it stable while a screen
   is interactive but fresh on every render of the page.

   The transform is deliberately tiny: the word must still read as
   type, not as a distortion effect.
   ============================================================ */

const roll = (text, min, max, wiggle) =>
  Array.from(text).map((ch) => ({
    ch,
    // weight lands anywhere on the axis, in 10-unit steps
    w: Math.round((min + Math.random() * (max - min)) / 10) * 10,
    r: +((Math.random() * 2 - 1) * 1.8 * wiggle).toFixed(2), // ±1.8deg
    y: +((Math.random() * 2 - 1) * 1.6 * wiggle).toFixed(2), // ±1.6px
  }))

export function Inked({
  children,
  className,
  as: Tag = 'h2',
  min = 200,
  max = 700,
  wiggle = 1,
  ...rest
}) {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '')
  const letters = useMemo(() => roll(text, min, max, wiggle), [text, min, max, wiggle])

  return (
    <Tag
      aria-label={text}
      className={cx(
        'm-0 font-display uppercase leading-[0.95] tracking-[0.01em] text-ink',
        className
      )}
      {...rest}
    >
      <span aria-hidden="true">
        {letters.map((l, i) =>
          l.ch === ' ' ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <span
              key={i}
              className="inline-block will-change-transform"
              style={{
                fontVariationSettings: `'wght' ${l.w}`,
                fontWeight: l.w,
                transform: `translateY(${l.y}px) rotate(${l.r}deg)`,
              }}
            >
              {l.ch}
            </span>
          )
        )}
      </span>
    </Tag>
  )
}
