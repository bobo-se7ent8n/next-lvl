import { useEffect, useMemo, useRef, useState } from 'react'
import { useBackground } from '../../state/BackgroundState'
import { RAMP, cellHash, makeNoise, sampleImage } from './ascii'

/* ============================================================
   BACKGROUND LAYERS

   Three fixed, full-viewport layers behind every screen. They are
   strictly decorative: `pointer-events: none` throughout, and they
   sit under the content stacking context, so nothing here can ever
   swallow a click.

   Each layer renders only when its own switch is on — with all
   three off the app is left on a plain canvas.
   ============================================================ */

/* ---------------- vertical lines ---------------- */

function LineLayer({ count, width, opacity }) {
  const period = `calc(100vw / ${Math.max(1, count)})`

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(to right,
          rgb(var(--c-ink) / ${opacity * 0.22}) 0 ${width}px,
          transparent ${width}px ${period})`,
      }}
    />
  )
}

/* ---------------- grain ---------------- */

/**
 * `amount` is how contrasty the noise itself is — baked into the SVG
 * as an alpha slope on the turbulence. `opacity` is how strongly the
 * whole layer sits over the page. They are separate because a coarse
 * faint grain and a fine strong one are different looks.
 */
function GrainLayer({ amount, scale, opacity }) {
  const url = useMemo(() => {
    const bf = (0.9 / Math.max(0.2, scale)).toFixed(3)
    const slope = Math.max(0.05, amount).toFixed(2)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="${bf}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="${slope}"/></feComponentTransfer></filter><rect width="220" height="220" filter="url(#g)"/></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }, [scale, amount])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 mix-blend-multiply"
      style={{ backgroundImage: url, opacity }}
    />
  )
}

/* ---------------- ascii character field ---------------- */

function AsciiLayer({ mode, cell, fontSize, opacity, seed, imageSrc }) {
  const canvasRef = useRef(null)
  const [image, setImage] = useState(null)

  // decode the uploaded file once, then redraw from the decoded bitmap
  useEffect(() => {
    if (mode !== 'image' || !imageSrc) {
      setImage(null)
      return
    }
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = imageSrc
  }, [mode, imageSrc])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame = 0

    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const size = Math.max(4, cell)
      const cols = Math.ceil(w / size) + 1
      const rows = Math.ceil(h / size) + 1

      ctx.font = `${fontSize}px "IBM Plex Mono", ui-monospace, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      // canvas cannot resolve a CSS variable, so read the token itself
      const ink = getComputedStyle(document.documentElement)
        .getPropertyValue('--c-ink')
        .trim()
      ctx.fillStyle = ink ? `rgb(${ink})` : '#111'

      const usingImage = mode === 'image' && image
      const noise = usingImage ? null : makeNoise(seed)
      const lum = usingImage ? sampleImage(image, cols, rows) : null

      const last = RAMP.length - 1

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // density: 1 = heaviest glyph. A photo's dark pixels are dense.
          const density = usingImage ? 1 - lum(x, y) : noise(x / cols, y / rows)

          // one rung of jitter so flat regions still read as characters
          const jitter = (cellHash(x, y, seed) - 0.5) * 1.4
          const idx = Math.round(density * last + jitter)
          const ch = RAMP[Math.max(0, Math.min(last, idx))]
          if (ch === ' ') continue

          ctx.globalAlpha = opacity * (0.2 + density * 0.8)
          ctx.fillText(ch, x * size + size / 2, y * size + size / 2)
        }
      }
      ctx.globalAlpha = 1
    }

    draw()

    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [mode, cell, fontSize, opacity, seed, image])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  )
}

/* ============================================================ */

export function BackgroundLayers() {
  const { lines, grain, ascii } = useBackground()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {ascii.on && <AsciiLayer {...ascii} />}
      {lines.on && <LineLayer {...lines} />}
      {grain.on && <GrainLayer {...grain} />}
    </div>
  )
}
