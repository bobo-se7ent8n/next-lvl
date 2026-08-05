import { LineChart, ChartLegend } from '../charts'

/**
 * The session-over-session trend, drawn in the app's one chart
 * style: a thick smooth curve with round caps, ending in a filled
 * dot. No axes, no gridlines, no frame — the legend beneath states
 * the reading, and a rule here would be a divider.
 */
export function Sparkline({ points, unit = '', label = 'now' }) {
  const now = points[points.length - 1]
  const fmt = (v) => (Math.abs(v) < 3 ? v.toFixed(2) : Math.round(v)) + unit

  return (
    <div className="w-[240px] max-w-full">
      <LineChart values={points} tone="lime" height={64} />
      <ChartLegend
        className="mt-sm"
        items={[{ tone: 'lime', label, value: fmt(now) }]}
      />
    </div>
  )
}
