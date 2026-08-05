/* ============================================================
   ASCII FIELD

   A density ramp of digits and symbols, ordered light → dark by how
   much ink each glyph puts on the page. Brightness picks a rung;
   a per-cell hash nudges it by one so identical regions still read
   as text rather than as a repeated tile.
   ============================================================ */

export const RAMP = " .,:;-~+=*1379#%8&@"

/** deterministic 0..1 hash for a grid cell */
export function cellHash(x, y, seed) {
  let h = (seed ^ (x * 374761393) ^ (y * 668265263)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

/**
 * Smooth value noise over a few octaves. Random mode uses it so the
 * field resolves into a large-scale image at a distance instead of
 * looking like uniform static — the characters are random, the tone
 * behind them is not.
 */
export function makeNoise(seed) {
  const smooth = (u, v, f) => {
    const x = u * f
    const y = v * f
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = x - x0
    const ty = y - y0
    const sx = tx * tx * (3 - 2 * tx)
    const sy = ty * ty * (3 - 2 * ty)

    const a = cellHash(x0, y0, seed)
    const b = cellHash(x0 + 1, y0, seed)
    const c = cellHash(x0, y0 + 1, seed)
    const d = cellHash(x0 + 1, y0 + 1, seed)

    const top = a + (b - a) * sx
    const bottom = c + (d - c) * sx
    return top + (bottom - top) * sy
  }

  return (u, v) => {
    let sum = 0
    let total = 0
    let amp = 1
    let freq = 2.6
    for (let i = 0; i < 4; i++) {
      sum += smooth(u, v, freq) * amp
      total += amp
      amp *= 0.5
      freq *= 2.1
    }
    // pushed toward the ends so the field has real light and dark
    const n = sum / total
    return Math.max(0, Math.min(1, (n - 0.5) * 1.55 + 0.5))
  }
}

/** cover-fit an image into a cols × rows grid and read its luminance */
export function sampleImage(img, cols, rows) {
  const off = document.createElement('canvas')
  off.width = cols
  off.height = rows
  const ctx = off.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, cols, rows)

  const s = Math.max(cols / img.width, rows / img.height)
  const dw = img.width * s
  const dh = img.height * s
  ctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh)

  const { data } = ctx.getImageData(0, 0, cols, rows)
  return (x, y) => {
    const i = (y * cols + x) * 4
    return (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
  }
}
