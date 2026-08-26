/* colour maths — always a flat mix, never a gradient */

import {
  colorData,
  colorDataInk,
  colorInk,
  colorOnFace,
  colorSemantic,
  colorSurface,
  accuracyRamp,
  type DataTone,
} from '../tokens';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(rgb: number[]): string {
  return (
    '#' +
    rgb
      .map((v) =>
        ('0' + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2),
      )
      .join('')
  );
}

export function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t));
}

/** a hex colour at an alpha — used where a token has to become rgba() */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${Number(alpha.toFixed(3))})`;
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

/** legible ink for text sitting on an arbitrary fill. The two ends are
 *  the surface tokens themselves — there is no third black and no third
 *  white anywhere in the product. */
export function inkOn(hex: string): string {
  return luminance(hex) > 0.5 ? colorSurface.inverse : colorSurface.background;
}

/** a tint of a colour, pushed toward paper or toward ink */
export function tintOf(hex: string): string {
  return luminance(hex) > 0.55
    ? mix(hex, colorSurface.inverse, 0.3)
    : mix(hex, colorSurface.background, 0.42);
}

export function dataColor(tone: DataTone): string {
  return colorData[tone];
}

export function dataInk(tone: DataTone): string {
  return colorDataInk[tone];
}

/** a barely-there field behind a viz, so a mark can never disappear into
 *  a card face that happens to share its colour */
/**
 * The ink a chart draws in when it sits in a LEVEL1 WELL rather than
 * directly on a card's face — which is where every chart on a fan
 * card sits.
 *
 * `tintOf` is the wrong helper for this: it pushes a colour toward
 * whichever end its own luminance is nearest, so a near-black face
 * came back LIGHTER and then had to be read against near-white
 * paper. This always darkens, at the same 0.45 the opened panel
 * mixes its own mark at, so every face in the set — mint through
 * beige through near-black — lands somewhere legible on level1.
 */
export function chartInk(face: string): string {
  return mix(face, colorInk.primary, 0.45);
}

export function vizWell(face: string): string {
  return luminance(face) > 0.5 ? colorOnFace.vizLight : colorOnFace.vizDark;
}

/* ------------------------------------------------------------
   SEMANTIC — green good, orange/red bad. k is 0..1 quality.
   ------------------------------------------------------------ */
export function semanticColor(k: number): string {
  const t = Math.max(0, Math.min(1, k));
  if (t < 0.42) return colorSemantic.negative;
  if (t < 0.7) return colorSemantic.neutral;
  return colorSemantic.positive;
}

/* ------------------------------------------------------------
   ACCURACY — three ordered stops. `pct` is raw FG% as 0..1, and
   the thresholds are real FG% rather than a normalised scale, so
   the legend can print the numbers a reader would recognise.
   ------------------------------------------------------------ */
export function accuracyColor(pct: number): string {
  for (const stop of accuracyRamp) {
    if (pct >= stop.min) return stop.color;
  }
  return accuracyRamp[accuracyRamp.length - 1].color;
}
