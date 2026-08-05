import { useState } from 'react'
import { ZONES } from '../../data/mock'
import { HEAT_STEPS, cx, heatColor, zoneHeat } from '../../lib/utils'
import { hlFill } from '../../lib/palette'

/* ============================================================
   SHOT ZONES — a court-shaped sunburst.

   The zones fan out from the rim: the paint is the core, the
   mid-range is the middle band, the three-point zones are the
   outer band. Each wedge is filled on the warm-to-cool heat
   scale by FG%, and labelled with makes/attempts inside it.

   Geometry is derived here, not in mock.js — the zone data
   keeps its original court coordinates untouched.
   ============================================================ */

const W = 430
const H = 232
const CX = W / 2
const CY = 219
const RINGS = [
  [0, 82], // paint
  [82, 142], // mid-range
  [142, 208], // three
]

/** ring index + angular span (degrees, 180 = far left, 0 = far right) */
const LAYOUT = {
  paint: [0, 180, 0],
  'mid-range left': [1, 180, 90],
  'mid-range right': [1, 90, 0],
  'left corner 3': [2, 180, 144],
  'left wing 3': [2, 144, 108],
  'top of key 3': [2, 108, 72],
  'right wing 3': [2, 72, 36],
  'right corner 3': [2, 36, 0],
}

const pt = (deg, r) => {
  const a = (deg * Math.PI) / 180
  return [CX + Math.cos(a) * r, CY - Math.sin(a) * r]
}

/* Adjacent wedges are separated by a gap in the fill, never a stroke —
   the same rule the rest of the system follows. The inset is angular
   at the sides and radial at the ends, so the gutter stays even. */
const GAP_DEG = 1.1
const GAP_R = 3

function wedgePath(a0_, a1_, rIn_, rOut) {
  const a0 = a0_ - GAP_DEG
  const a1 = a1_ + GAP_DEG
  const rIn = rIn_ > 0 ? rIn_ + GAP_R : 0
  const [x0o, y0o] = pt(a0, rOut)
  const [x1o, y1o] = pt(a1, rOut)
  const large = Math.abs(a0 - a1) > 180 ? 1 : 0

  if (rIn <= 0) {
    return `M ${CX} ${CY} L ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o} Z`
  }

  const [x0i, y0i] = pt(a0, rIn)
  const [x1i, y1i] = pt(a1, rIn)
  return [
    `M ${x0i} ${y0i}`,
    `L ${x0o} ${y0o}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${x0i} ${y0i}`,
    'Z',
  ].join(' ')
}

const totalAttempts = ZONES.reduce((a, z) => a + z.a, 0)

/** short labels — horizontal text has to fit the wedge's narrow waist */
const SHORT = {
  paint: 'paint',
  'mid-range left': 'mid L',
  'mid-range right': 'mid R',
  'left corner 3': 'L corner',
  'left wing 3': 'L wing',
  'top of key 3': 'top key',
  'right wing 3': 'R wing',
  'right corner 3': 'R corner',
}

export function ShotZones({ className }) {
  const [hover, setHover] = useState(null)

  return (
    <div className={cx('w-full max-w-[440px]', className)}>
      <div className="overflow-hidden rounded-lg bg-surface p-md sq">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label="Shot zones by field-goal percentage"
        >
          {ZONES.map((z) => {
            const layout = LAYOUT[z.l]
            if (!layout) return null
            const [ring, a0, a1] = layout
            const [rIn, rOut] = RINGS[ring]
            const { pct, k } = zoneHeat(z)
            const on = hover === z.l

            const mid = (a0 + a1) / 2
            const midR = ring === 0 ? rOut * 0.52 : (rIn + rOut) / 2
            const [lx, ly] = pt(mid, midR)

            return (
              <g
                key={z.l}
                onMouseEnter={() => setHover(z.l)}
                onMouseLeave={() => setHover(null)}
                /* wedges keep their true colour in both themes; hovering
                   one quietens the rest instead of brightening it */
                opacity={hover && !on ? 0.4 : 1}
                className="transition-opacity duration-180"
              >
                <title>{`${z.l} — ${z.m} of ${z.a}, ${Math.round(pct * 100)}%`}</title>
                {/* wedges are separated by a gap in the fill, never a stroke */}
                <path d={wedgePath(a0, a1, rIn, rOut)} fill={heatColor(k)} />

                <text
                  x={lx}
                  y={ly - 12}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="700"
                  letterSpacing="1.1"
                  fill="#111"
                  opacity="0.55"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {SHORT[z.l].toUpperCase()}
                </text>
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  letterSpacing="-0.4"
                  fill="#111"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {Math.round(pct * 100)}%
                </text>
                <text
                  x={lx}
                  y={ly + 17}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#111"
                  opacity="0.5"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {z.m}/{z.a}
                </text>
              </g>
            )
          })}

          {/* the rim the fan radiates from */}
          <circle cx={CX} cy={CY} r="5" className="fill-ink3" />
        </svg>
      </div>

      <div className="mt-md flex flex-wrap items-center gap-sm">
        <span className="readout-label">FG%</span>
        <span aria-hidden="true" className="flex items-center gap-[3px]">
          {HEAT_STEPS.map((s) => (
            <i
              key={s.name}
              className="block h-[6px] w-[28px] rounded-pill"
              style={{ background: hlFill(s.tone) }}
            />
          ))}
        </span>
        <span className="quiet num">
          {ZONES.length} zones · {totalAttempts} attempts
        </span>
      </div>
    </div>
  )
}
