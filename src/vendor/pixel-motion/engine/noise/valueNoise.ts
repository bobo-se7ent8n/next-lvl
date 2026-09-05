import { hashUnit } from '../random/seededRandom'

const smooth = (value: number) => value * value * (3 - 2 * value)
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount

export function valueNoise2D(x: number, y: number, seed: number) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = x0 + 1
  const y1 = y0 + 1
  const tx = smooth(x - x0)
  const ty = smooth(y - y0)
  const top = mix(hashUnit(seed, x0, y0), hashUnit(seed, x1, y0), tx)
  const bottom = mix(hashUnit(seed, x0, y1), hashUnit(seed, x1, y1), tx)
  return mix(top, bottom, ty)
}

export function fbm2D(x: number, y: number, seed: number, octaves = 4) {
  let value = 0
  let amplitude = 0.56
  let frequency = 1
  let normalizer = 0

  for (let octave = 0; octave < octaves; octave += 1) {
    value += valueNoise2D(x * frequency, y * frequency, seed + octave * 1013) * amplitude
    normalizer += amplitude
    frequency *= 2.03
    amplitude *= 0.48
  }

  return value / normalizer
}
