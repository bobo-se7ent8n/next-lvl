import { generateTones } from '../palette/tones'
import { CURATED_TONE_SETTINGS } from '../types/recipe'

export function generateDotMatrixPalettes(colors: readonly string[], background: string) {
  return colors.map((base) => generateTones(
    { base, ...CURATED_TONE_SETTINGS },
    background,
  ))
}
