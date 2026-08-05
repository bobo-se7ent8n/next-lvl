import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cx } from '../../lib/utils'

/* ============================================================
   POINT-CLOUD VIEWPORT

   No rendered figure and no image asset — the replay is drawn as
   a sparse field of dots on a canvas: dark dots for you, pale
   blue-gray for the floor plane and the tracked opponents, warm
   orange for the ball. Everything is projected from a small 3D
   scene, so the silhouette reads as a body in motion rather than
   a sprite.
   ============================================================ */

/* Filled from the live tokens by syncColors() so the cloud always
   matches the palette. The identity of COLOR.you is compared during
   the draw pass and both sides come from the same frame, so mutating
   in place is safe. */
const COLOR = {
  you: '17,17,17', // ink
  opp: '150,146,139', // ink3 — the tracked opponents stay quiet
  ball: '255,155,104', // the one warm mark: coral, from the chip palette
  floor: '214,209,198',
  court: '184,178,166',
}

/** pull the neutral end of the palette off the live tokens */
function syncColors() {
  if (typeof document === 'undefined') return
  const cs = getComputedStyle(document.documentElement)
  const read = (name, fallback) => {
    const raw = cs.getPropertyValue(name).trim()
    return raw ? raw.split(/\s+/).join(',') : fallback
  }
  COLOR.you = read('--c-ink', COLOR.you)
  COLOR.opp = read('--c-ink3', COLOR.opp)
  COLOR.floor = read('--c-surface2', COLOR.floor)
  COLOR.court = read('--c-ink3', COLOR.court)
}

/* Camera sits behind and above the player, looking down-court toward
   the basket. +z runs away from the camera, so the rim is at BASKET_Z
   and the player stands near the origin. */
const CAM = { h: 1.9, d: 5.6, pitch: 0.327, yaw: 0.42 }
const BASKET_Z = 3.6
const CYCLE = 3400 // ms per motion cycle

/* deterministic jitter so the cloud is stable frame to frame */
const JITTER = (() => {
  let s = 20260805
  return Array.from({ length: 1024 }, () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff - 0.5
  })
})()

const smoothstep = (e0, e1, x) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

const lerp3 = (a, b, f) => [
  a[0] + (b[0] - a[0]) * f,
  a[1] + (b[1] - a[1]) * f,
  a[2] + (b[2] - a[2]) * f,
]

/** piecewise 3D keyframe track, smoothstepped between stops */
function track(ph, stops) {
  if (ph <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    if (ph <= stops[i][0]) {
      return lerp3(
        stops[i - 1][1],
        stops[i][1],
        smoothstep(stops[i - 1][0], stops[i][0], ph)
      )
    }
  }
  return stops[stops.length - 1][1]
}

/* ---------- the pose: three dribbles, a gather, a release ---------- */

const R_WRIST = [
  [0.0, [0.44, 0.74, 0.32]],
  [0.5, [0.44, 0.74, 0.32]],
  [0.62, [0.17, 1.18, 0.26]],
  [0.72, [0.13, 1.9, 0.3]],
  [0.8, [0.1, 2.06, 0.16]],
  [0.93, [0.44, 0.74, 0.32]],
  [1.0, [0.44, 0.74, 0.32]],
]

const L_WRIST = [
  [0.0, [-0.34, 0.86, 0.14]],
  [0.5, [-0.34, 0.86, 0.14]],
  [0.62, [-0.11, 1.3, 0.3]],
  [0.74, [-0.23, 1.78, 0.24]],
  [0.86, [-0.3, 1.1, 0.18]],
  [1.0, [-0.34, 0.86, 0.14]],
]

function pose(ph) {
  const bounce = Math.abs(Math.sin(ph * Math.PI * 6))

  // knee bend: idle sway → deep dip into the gather → soft landing
  const idle = 0.1 + 0.05 * Math.sin(ph * Math.PI * 6)
  let crouch = idle
  if (ph >= 0.5 && ph < 0.68) crouch = idle + 0.55 * smoothstep(0.5, 0.68, ph)
  else if (ph >= 0.68 && ph < 0.8)
    crouch = 0.65 * (1 - smoothstep(0.68, 0.8, ph))
  else if (ph >= 0.84)
    crouch = 0.3 * Math.sin(Math.min(1, (ph - 0.84) / 0.14) * Math.PI)

  // the hop
  let hop = 0
  if (ph > 0.68 && ph < 0.9) hop = 0.3 * Math.sin(((ph - 0.68) / 0.22) * Math.PI)

  const lift = hop
  const drop = crouch * 0.3
  const pelvisY = 0.95 - drop + lift
  const sway = 0.03 * Math.sin(ph * Math.PI * 4)

  const pelvis = [sway, pelvisY, 0]
  const chest = [sway * 0.5, pelvisY + 0.4 - drop * 0.1, 0.02]
  const neck = [0, pelvisY + 0.57, 0.02]
  const head = [0, pelvisY + 0.72, 0.03]

  const shL = [-0.21, neck[1] - 0.06, 0.01]
  const shR = [0.21, neck[1] - 0.06, 0.01]
  const hipL = [pelvis[0] - 0.12, pelvisY, 0]
  const hipR = [pelvis[0] + 0.12, pelvisY, 0]

  const ankY = lift * 0.85
  const ankL = [-0.16, ankY, -0.04]
  const ankR = [0.17, ankY, 0.06]

  // knees ride forward as the body sinks
  const knee = (hip, ank) => [
    (hip[0] + ank[0]) / 2,
    (hip[1] + ank[1]) / 2 - 0.02,
    (hip[2] + ank[2]) / 2 + 0.08 + crouch * 0.3,
  ]

  const rw = track(ph, R_WRIST).slice()
  if (ph < 0.5) rw[1] += 0.22 * bounce - 0.1
  const lw = track(ph, L_WRIST)

  // elbows sit behind and outside the shoulder→wrist line
  const elbow = (sh, wr, out) => [
    (sh[0] + wr[0]) / 2 + out * 0.12,
    (sh[1] + wr[1]) / 2 - 0.04,
    (sh[2] + wr[2]) / 2 - 0.14,
  ]

  let ball
  if (ph < 0.5) ball = [0.47, 0.16 + 0.6 * bounce, 0.35]
  else if (ph < 0.72) ball = [rw[0] + 0.02, rw[1] + 0.1, rw[2] + 0.06]
  else {
    // released — arcs away toward the rim
    const u = (ph - 0.72) / 0.28
    ball = [0.12 - u * 0.08, 2.12 + u * 2.1 - u * u * 3.4, 0.3 + u * 3.4]
  }
  const ballAlpha = ph < 0.72 ? 1 : 1 - smoothstep(0.78, 0.96, ph)

  return {
    bones: [
      [head, neck],
      [neck, chest],
      [chest, pelvis],
      [shL, shR],
      [hipL, hipR],
      [shL, elbow(shL, lw, -1)],
      [elbow(shL, lw, -1), lw],
      [shR, elbow(shR, rw, 1)],
      [elbow(shR, rw, 1), rw],
      [hipL, knee(hipL, ankL)],
      [knee(hipL, ankL), ankL],
      [hipR, knee(hipR, ankR)],
      [knee(hipR, ankR), ankR],
    ],
    torso: [shL, shR, hipR, hipL],
    head,
    ball,
    ballAlpha,
  }
}

/* ---------- scene geometry (built once) ---------- */

function buildFloor() {
  const pts = []
  for (let x = -3.6; x <= 3.61; x += 0.8)
    for (let z = -1.8; z <= 5.61; z += 0.8)
      pts.push([x, 0, z, COLOR.floor, 0.85])

  // three-point arc + key, drawn as dot sequences around the basket
  const bz = BASKET_Z
  for (let a = -1.2; a <= 1.2; a += 0.045)
    pts.push([Math.sin(a) * 3.1, 0, bz - Math.cos(a) * 3.1, COLOR.court, 1])
  for (let z = bz - 3.1; z <= bz; z += 0.15) {
    pts.push([-0.9, 0, z, COLOR.court, 0.9])
    pts.push([0.9, 0, z, COLOR.court, 0.9])
  }
  for (let x = -0.9; x <= 0.91; x += 0.15)
    pts.push([x, 0, bz - 3.1, COLOR.court, 0.9])
  // the rim — the only thing off the floor plane
  for (let a = 0; a < Math.PI * 2; a += 0.36)
    pts.push([Math.cos(a) * 0.23, 1.55, bz + Math.sin(a) * 0.23, COLOR.court, 1])

  return pts
}

const FLOOR = buildFloor()

const OPPONENTS = [
  { at: [-1.9, 0, 1.4], ph: 0.22, scale: 0.98 },
  { at: [1.8, 0, 2.6], ph: 0.63, scale: 1.03 },
  { at: [-2.3, 0, 3.4], ph: 0.86, scale: 1.0 },
]

/* ---------- projection ---------- */

function makeProjector(w, h) {
  const cy = Math.cos(CAM.yaw)
  const sy = Math.sin(CAM.yaw)
  const cp = Math.cos(CAM.pitch)
  const sp = Math.sin(CAM.pitch)
  const focal = h * 1.6

  return (x, y, z) => {
    const rx = x * cy + z * sy
    const rz = -x * sy + z * cy
    const vy = y - CAM.h
    const vz = rz + CAM.d
    const py = vy * cp + vz * sp
    const pz = -vy * sp + vz * cp
    if (pz < 0.5) return null
    const k = focal / pz
    return [w / 2 + rx * k, h * 0.68 - py * k, k / focal, pz]
  }
}

/* ---------- point emission ---------- */

function emitFigure(p, out, color, density, jOff, spread) {
  let j = jOff

  const seg = (a, b, n) => {
    for (let i = 0; i < n; i++) {
      const f = n === 1 ? 0.5 : i / (n - 1)
      out.push([
        a[0] + (b[0] - a[0]) * f + JITTER[j++ & 1023] * spread,
        a[1] + (b[1] - a[1]) * f + JITTER[j++ & 1023] * spread,
        a[2] + (b[2] - a[2]) * f + JITTER[j++ & 1023] * spread,
        color,
        1,
      ])
    }
  }

  p.bones.forEach(([a, b]) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    seg(a, b, Math.max(3, Math.round(len * density)))
  })

  // torso fill
  const [sl, sr, hr, hl] = p.torso
  const rows = density > 16 ? 5 : 3
  const cols = density > 16 ? 4 : 3
  for (let r = 0; r < rows; r++) {
    const fr = r / (rows - 1)
    const l = lerp3(sl, hl, fr)
    const rr = lerp3(sr, hr, fr)
    for (let c = 0; c < cols; c++) {
      const f = c / (cols - 1)
      out.push([
        l[0] + (rr[0] - l[0]) * f + JITTER[j++ & 1023] * spread,
        l[1] + (rr[1] - l[1]) * f + JITTER[j++ & 1023] * spread,
        l[2] + (rr[2] - l[2]) * f + JITTER[j++ & 1023] * spread * 2,
        color,
        1,
      ])
    }
  }

  // head
  const hn = density > 16 ? 22 : 10
  for (let i = 0; i < hn; i++) {
    const a = (i / hn) * Math.PI * 2
    const t = JITTER[j++ & 1023] * 0.9
    out.push([
      p.head[0] + Math.cos(a) * 0.1 * (1 - Math.abs(t)),
      p.head[1] + t * 0.22,
      p.head[2] + Math.sin(a) * 0.1 * (1 - Math.abs(t)),
      color,
      1,
    ])
  }
}

function emitBall(p, out) {
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2
    const t = JITTER[(i * 7) & 1023]
    out.push([
      p.ball[0] + Math.cos(a) * 0.11 * (1 - Math.abs(t)),
      p.ball[1] + t * 0.2,
      p.ball[2] + Math.sin(a) * 0.11 * (1 - Math.abs(t)),
      COLOR.ball,
      p.ballAlpha,
    ])
  }
}

/* ============================================================ */

export function PointCloud({ className, paused = false }) {
  const reduced = useReducedMotion()
  const canvasRef = useRef(null)
  const frame = useRef(0)
  const clock = useRef(0)
  const last = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    syncColors()

    let w = 0
    let h = 0
    let project = makeProjector(1, 1)

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      project = makeProjector(w, h)
    }

    const draw = (ph) => {
      ctx.clearRect(0, 0, w, h)

      const pts = FLOOR.slice()
      const you = pose(ph)

      OPPONENTS.forEach((o, i) => {
        const op = pose((ph * 0.45 + o.ph) % 1)
        const buf = []
        emitFigure(op, buf, COLOR.opp, 13, i * 211, 0.024)
        buf.forEach((pt) => {
          pts.push([
            pt[0] * o.scale + o.at[0],
            pt[1] * o.scale,
            pt[2] * o.scale + o.at[2],
            pt[3],
            1,
          ])
        })
      })

      emitFigure(you, pts, COLOR.you, 26, 0, 0.015)
      emitBall(you, pts)

      for (let i = 0; i < pts.length; i++) {
        const [x, y, z, color, alpha] = pts[i]
        const s = project(x, y, z)
        if (!s) continue
        const [sx, sy, , depth] = s
        if (sx < -30 || sx > w + 30 || sy < -30 || sy > h + 30) continue

        // dots thin out and shrink with distance
        const fade = Math.max(0.14, Math.min(1, 8.4 / depth - 0.28))
        const r = Math.max(0.65, (color === COLOR.you ? 1.6 : 1.3) * fade)

        ctx.fillStyle = `rgba(${color},${(alpha * fade).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    resize()

    if (reduced) {
      draw(0.71) // a single held frame: mid-release
      const ro = new ResizeObserver(() => {
        resize()
        draw(0.71)
      })
      ro.observe(canvas)
      return () => ro.disconnect()
    }

    const loop = (now) => {
      if (!last.current) last.current = now
      if (!paused) clock.current += now - last.current
      last.current = now
      draw((clock.current % CYCLE) / CYCLE)
      frame.current = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    frame.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame.current)
      last.current = 0
      ro.disconnect()
    }
  }, [reduced, paused])

  return (
    <canvas
      ref={canvasRef}
      className={cx('block h-full w-full', className)}
      role="img"
      aria-label="Point-cloud replay: your tracked motion, the floor plane, opponents and the ball"
    />
  )
}

/** The viewport's key — matches the dot colours exactly. */
export function PointCloudLegend({ className }) {
  const items = [
    ['you', 'rgb(var(--c-ink))'],
    ['opponents', 'rgb(var(--c-ink3))'],
    ['ball', `rgb(${COLOR.ball})`],
  ]

  return (
    <div className={cx('flex flex-wrap items-center gap-md', className)}>
      {items.map(([label, color]) => (
        <span
          key={label}
          className="flex items-center gap-[6px] text-[10px] font-medium uppercase tracking-label text-ink3"
        >
          <i
            aria-hidden="true"
            className="block h-[6px] w-[6px] rounded-pill"
            style={{ background: color }}
          />
          {label}
        </span>
      ))}
    </div>
  )
}
