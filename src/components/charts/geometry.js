/* ============================================================
   CHART GEOMETRY

   Shared maths for the chart family. Every chart in the app is
   drawn from these: smooth curves rather than polylines, and a
   deterministic pack for the circle charts so a value always lands
   in the same place.
   ============================================================ */

/**
 * Catmull-Rom through the points, emitted as cubic beziers. This is
 * what makes every line and area in the app read as one continuous
 * stroke instead of a sequence of segments.
 */
export function smoothPath(points, tension = 0.85) {
  if (points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2

    const k = tension / 3
    const c1x = p1[0] + (p2[0] - p0[0]) * k
    const c1y = p1[1] + (p2[1] - p0[1]) * k
    const c2x = p2[0] - (p3[0] - p1[0]) * k
    const c2y = p2[1] - (p3[1] - p1[1]) * k

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d
}

/** map a series into plot coordinates inside a padded box */
export function project(values, w, h, pad = 6) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const innerW = w - pad * 2
  const innerH = h - pad * 2

  return values.map((v, i) => [
    pad + (i / Math.max(1, values.length - 1)) * innerW,
    pad + (1 - (v - min) / span) * innerH,
  ])
}

/**
 * Deterministic circle pack: radius encodes the value, then a fixed
 * number of relaxation passes push overlaps apart while pulling the
 * cluster toward the centre. No randomness, so a chart never shifts
 * between renders.
 */
export function packCircles(items, w, h) {
  const total = items.reduce((a, it) => a + it.value, 0) || 1
  const area = w * h * 0.6

  const raw = items.map((it) =>
    Math.max(3, Math.sqrt(((it.value / total) * area) / Math.PI))
  )

  /* Radius encodes the value, but a wide short box would let the
     largest circle exceed the height and clip. Scaling every radius
     by the same factor keeps the encoding honest while guaranteeing
     the pack fits. */
  const cap = Math.min(w, h) / 2 - 1
  const biggest = Math.max(...raw)
  const scale = biggest > cap ? cap / biggest : 1

  const nodes = items.map((it, i) => ({
    ...it,
    r: raw[i] * scale,
    // golden-angle seeding gives an even starting spread
    x: w / 2 + Math.cos(i * 2.39996) * w * 0.2,
    y: h / 2 + Math.sin(i * 2.39996) * h * 0.2,
  }))

  for (let pass = 0; pass < 220; pass++) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]
      a.x += (w / 2 - a.x) * 0.02
      a.y += (h / 2 - a.y) * 0.02

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]
        let dx = b.x - a.x
        let dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 0.001
        const min = a.r + b.r + 1.5
        if (dist < min) {
          const push = (min - dist) / 2 / dist
          dx *= push
          dy *= push
          a.x -= dx
          a.y -= dy
          b.x += dx
          b.y += dy
        }
      }
    }
    for (const n of nodes) {
      n.x = Math.max(n.r, Math.min(w - n.r, n.x))
      n.y = Math.max(n.r, Math.min(h - n.r, n.y))
    }
  }

  return nodes
}
