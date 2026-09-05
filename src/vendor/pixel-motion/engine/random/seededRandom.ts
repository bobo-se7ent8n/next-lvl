export interface SeededRandom {
  next(): number
  range(min: number, max: number): number
  int(min: number, max: number): number
  chance(probability: number): boolean
  pick<T>(items: readonly T[]): T
}

function normalizeSeed(seed: number) {
  const value = Number.isFinite(seed) ? Math.trunc(seed) : 1
  return (value >>> 0) || 1
}

export function createSeededRandom(seed: number): SeededRandom {
  let state = normalizeSeed(seed)

  const next = () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }

  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    chance: (probability) => next() < probability,
    pick: <T,>(items: readonly T[]) => items[Math.floor(next() * items.length)],
  }
}

export function hashUnit(seed: number, ...values: number[]) {
  let hash = normalizeSeed(seed)
  for (const value of values) {
    hash ^= Math.imul(Math.trunc(value * 1009) + 0x9e3779b9, 0x85ebca6b)
    hash = Math.imul(hash ^ (hash >>> 16), 0xc2b2ae35)
  }
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967295
}
