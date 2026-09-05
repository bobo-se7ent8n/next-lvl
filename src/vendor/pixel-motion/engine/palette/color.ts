export interface OklchColor {
  l: number
  c: number
  h: number
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const expanded = normalized.length === 3
    ? normalized.split('').map((character) => character + character).join('')
    : normalized
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(expanded.slice(0, 2), 16) / 255,
    g: parseInt(expanded.slice(2, 4), 16) / 255,
    b: parseInt(expanded.slice(4, 6), 16) / 255,
  }
}

function srgbToLinear(value: number) {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function linearToSrgb(value: number) {
  return value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
}

export function hexToOklch(hex: string): OklchColor {
  const rgb = hexToRgb(hex)
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  const lRoot = Math.cbrt(l)
  const mRoot = Math.cbrt(m)
  const sRoot = Math.cbrt(s)
  const labL = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot
  const labA = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot
  const labB = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot
  return {
    l: labL,
    c: Math.sqrt(labA * labA + labB * labB),
    h: (Math.atan2(labB, labA) * 180 / Math.PI + 360) % 360,
  }
}

function oklchToRgb({ l, c, h }: OklchColor) {
  const angle = h * Math.PI / 180
  const a = c * Math.cos(angle)
  const b = c * Math.sin(angle)
  const lRoot = l + 0.3963377774 * a + 0.2158037573 * b
  const mRoot = l - 0.1055613458 * a - 0.0638541728 * b
  const sRoot = l - 0.0894841775 * a - 1.291485548 * b
  const ll = lRoot ** 3
  const mm = mRoot ** 3
  const ss = sRoot ** 3
  return {
    r: linearToSrgb(4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss),
    g: linearToSrgb(-1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss),
    b: linearToSrgb(-0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss),
  }
}

function inGamut(rgb: { r: number; g: number; b: number }) {
  return rgb.r >= 0 && rgb.r <= 1 && rgb.g >= 0 && rgb.g <= 1 && rgb.b >= 0 && rgb.b <= 1
}

export function oklchToHexGamutMapped(color: OklchColor) {
  const safe = { ...color, l: clamp01(color.l), c: Math.max(0, color.c) }
  let rgb = oklchToRgb(safe)
  if (!inGamut(rgb)) {
    let low = 0
    let high = safe.c
    for (let index = 0; index < 18; index += 1) {
      const candidate = (low + high) / 2
      const candidateRgb = oklchToRgb({ ...safe, c: candidate })
      if (inGamut(candidateRgb)) {
        low = candidate
        rgb = candidateRgb
      } else {
        high = candidate
      }
    }
  }
  const channel = (value: number) => Math.round(clamp01(value) * 255).toString(16).padStart(2, '0')
  return `#${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`.toUpperCase()
}
