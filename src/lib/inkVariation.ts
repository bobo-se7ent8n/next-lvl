import { inkVariation } from '../tokens';

export interface InkedLetter {
  char: string;
  weight: number;
  rotate: number;
  shift: number;
}

/* Per-letter weight variation for display headlines. The randomness is
   hashed from the string itself, so a headline always comes out the same
   way — it reads as printed rather than as animated. */
export function inkLetters(text: string): InkedLetter[] {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) & 0xffff;
  const next = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };

  const { weightMin, weightMax, rotate, shift } = inkVariation;
  const span = weightMax - weightMin;

  return Array.from(text).map((char) => ({
    char,
    weight: Math.round((weightMin + next() * span) / 10) * 10,
    rotate: Number(((next() * 2 - 1) * rotate).toFixed(2)),
    shift: Number(((next() * 2 - 1) * shift).toFixed(2)),
  }));
}
