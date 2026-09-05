import type { PaletteRecipe } from '../types/recipe'
import { hexToOklch, oklchToHexGamutMapped } from './color'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function generateTones(recipe: PaletteRecipe, background = '#F3F2EE') {
  const count = Math.min(8, Math.max(2, Math.round(recipe.toneCount)))
  const spread = clamp(recipe.toneSpread, 0, 100) / 100
  const base = hexToOklch(recipe.base)
  const backgroundLightness = hexToOklch(background).l
  const darkFloor = 0.28
  const darkRange = Math.min(
    Math.max(0, base.l - darkFloor),
    0.1 + spread * 0.42,
  )
  const lightCapFromBackground = backgroundLightness > base.l
    ? backgroundLightness - 0.035
    : base.l + 0.08
  const lightCap = clamp(Math.max(base.l, lightCapFromBackground), base.l, 0.93)
  const lightRange = Math.max(0, lightCap - base.l) * (0.2 + spread * 0.8)

  const makeTone = (lightness: number, chromaScale: number) => oklchToHexGamutMapped({
    l: clamp(lightness, darkFloor, 0.93),
    c: Math.min(0.24, base.c * chromaScale),
    h: base.h,
  })

  if (recipe.direction === 'lighter') {
    return Array.from({ length: count }, (_, index) => {
      const position = index / (count - 1)
      const curved = position ** 0.88
      return makeTone(base.l + lightRange * curved, 1 - curved * 0.1)
    })
  }

  if (recipe.direction === 'darker') {
    return Array.from({ length: count }, (_, index) => {
      const position = index / (count - 1)
      const distance = (1 - position) ** 0.86
      return makeTone(base.l - darkRange * distance, 1 + distance * 0.08)
    })
  }

  const baseIndex = Math.floor((count - 1) / 2)

  return Array.from({ length: count }, (_, index) => {
    if (index === baseIndex) return recipe.base.toUpperCase()
    if (index < baseIndex) {
      const distance = (baseIndex - index) / Math.max(1, baseIndex)
      return makeTone(base.l - darkRange * distance ** 0.86, 1 + distance * 0.08)
    }
    const lightSteps = count - 1 - baseIndex
    const distance = (index - baseIndex) / Math.max(1, lightSteps)
    return makeTone(base.l + lightRange * distance ** 0.94, 1 - distance * 0.1)
  })
}
