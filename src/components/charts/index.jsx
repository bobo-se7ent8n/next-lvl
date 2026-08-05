import { useMemo } from 'react'

import { cx } from '../../lib/utils'
import { hlFill } from '../../lib/palette'
import { useMeasure } from '../../lib/useMeasure'
import { packCircles, project, smoothPath } from './geometry'

/* ============================================================
   CHART FAMILY

   One shape language across every chart in the app:

     · thick strokes, round caps and joins, never a hairline
     · curves are smooth beziers, never polylines
     · a line always ends in a filled dot
     · bars are capsules, not rectangles
     · areas are soft blobs
     · packed charts encode value in radius
     · legends are a coloured dot and a label, under the chart

   Charts carry no axes, no gridlines and no frame — the surrounding
   card already states the units, and a rule would be a divider.

   Every SVG chart measures its own box and plots in real pixels
   rather than scaling a fixed viewBox, so a slope reads the same in
   a 170px tile as in a 560px card.
   ============================================================ */

/* ---------------- line ---------------- */

export function LineChart({
  values,
  tone = 'lime',
  height = 56,
  strokeWidth = 5,
  className,
}) {
  const [ref, width] = useMeasure(220)
  const pts = useMemo(
    () => project(values, width, height, strokeWidth + 1),
    [values, width, height, strokeWidth]
  )
  const end = pts[pts.length - 1]

  return (
    <div ref={ref} className={cx('w-full', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label={`trend, now ${values[values.length - 1]}`}
      >
        <path
          d={smoothPath(pts)}
          fill="none"
          stroke={hlFill(tone)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={end[0]}
          cy={end[1]}
          r={strokeWidth * 0.95}
          fill={hlFill(tone)}
        />
      </svg>
    </div>
  )
}

/* ---------------- capsule bars ---------------- */

export function BlobBars({
  items, // [{ value, tone, label }]
  height = 56,
  labels = true,
  className,
}) {
  const max = Math.max(...items.map((i) => i.value)) || 1
  const compact = height < 46
  const labelRow = labels ? (compact ? 11 : 14) : 0
  const barArea = Math.max(12, height - labelRow)

  return (
    <div
      className={cx('flex w-full items-end gap-[6px]', className)}
      style={{ height }}
    >
      {items.map((it, i) => (
        <div key={i} className="flex h-full flex-1 flex-col justify-end">
          {labels && (
            <span
              className="num mb-[2px] block text-center font-bold leading-none text-ink2"
              style={{ fontSize: compact ? 8 : 9 }}
            >
              {it.value}
            </span>
          )}
          <span
            className="block w-full rounded-pill"
            style={{
              height: Math.max(8, (it.value / max) * barArea),
              background: hlFill(it.tone),
            }}
          />
        </div>
      ))}
    </div>
  )
}

/* ---------------- area blob ---------------- */

export function AreaBlob({ values, tone = 'mint', height = 56, className }) {
  const [ref, width] = useMeasure(220)
  const pad = 9

  const d = useMemo(() => {
    // the closing baseline stops short of the box so the stroke that
    // rounds the shoulders has room to sit inside it rather than clip
    const floor = height - pad
    const pts = project(values, width, floor, pad)
    return `${smoothPath(pts)} L ${width - pad} ${floor} L ${pad} ${floor} Z`
  }, [values, width, height])

  return (
    <div ref={ref} className={cx('w-full', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label={`area, now ${values[values.length - 1]}`}
      >
        {/* stroked and filled with the same colour, stroke painted
            under the fill — that is what rounds the shoulders */}
        <path
          d={d}
          fill={hlFill(tone)}
          stroke={hlFill(tone)}
          strokeWidth="14"
          strokeLinejoin="round"
          strokeLinecap="round"
          paintOrder="stroke"
        />
      </svg>
    </div>
  )
}

/* ---------------- packed circles ---------------- */

export function PackedChart({ items, height = 72, className }) {
  const [ref, width] = useMeasure(220)
  const nodes = useMemo(
    () => packCircles(items, width, height),
    [items, width, height]
  )

  return (
    <div ref={ref} className={cx('w-full', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label="composition"
      >
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={hlFill(n.tone)}>
            <title>{`${n.label ?? ''} ${n.value}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

/* ---------------- legend ---------------- */

export function ChartLegend({ items, className }) {
  return (
    <div
      className={cx(
        'flex flex-wrap items-center gap-x-md gap-y-[5px]',
        className
      )}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-[6px] whitespace-nowrap text-[10px] font-medium text-ink3"
        >
          <i
            aria-hidden="true"
            className="block h-[7px] w-[7px] shrink-0 rounded-pill"
            style={{ background: hlFill(it.tone) }}
          />
          <span className="uppercase tracking-[0.06em]">{it.label}</span>
          {it.value != null && (
            <b className="num font-semibold text-ink2">{it.value}</b>
          )}
        </span>
      ))}
    </div>
  )
}

/* ---------------- one entry point ---------------- */

/**
 * Renders whatever chart a data record asks for. Cards call this so
 * they never have to know which chart they got — which is what keeps
 * every pattern card structurally identical.
 */
export function Chart({ spec, height, className }) {
  if (!spec) return null
  const h = height ?? spec.height ?? 56

  if (spec.type === 'bars')
    return (
      <BlobBars
        items={spec.items}
        height={h}
        labels={spec.labels !== false}
        className={className}
      />
    )
  if (spec.type === 'area')
    return (
      <AreaBlob
        values={spec.values}
        tone={spec.tone}
        height={h}
        className={className}
      />
    )
  if (spec.type === 'packed')
    return <PackedChart items={spec.items} height={h} className={className} />

  return (
    <LineChart
      values={spec.values}
      tone={spec.tone}
      height={h}
      className={className}
    />
  )
}

/** the legend a spec implies, or nothing when it has no categories */
export function chartLegend(spec) {
  if (!spec) return null
  if (spec.legend) return spec.legend
  if (spec.items) return spec.items.map((i) => ({ tone: i.tone, label: i.label }))
  return null
}
