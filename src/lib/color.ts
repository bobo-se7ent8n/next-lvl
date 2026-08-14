/* colour maths — always a flat mix, never a gradient */

import {
  colorData,
  colorDataInk,
  colorSemantic,
  shotZoneRamp,
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

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

/** legible ink for text sitting on an arbitrary fill */
export function inkOn(hex: string): string {
  return luminance(hex) > 0.5 ? '#141310' : '#FFFFFC';
}

/** a tint of a colour, pushed toward paper or toward ink */
export function tintOf(hex: string): string {
  return luminance(hex) > 0.55
    ? mix(hex, '#141310', 0.3)
    : mix(hex, '#FFFFFC', 0.42);
}

export function dataColor(tone: DataTone): string {
  return colorData[tone];
}

export function dataInk(tone: DataTone): string {
  return colorDataInk[tone];
}

/** a barely-there field behind a viz, so a mark can never disappear into
 *  a card face that happens to share its colour */
export function vizWell(face: string): string {
  return luminance(face) > 0.5 ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.12)';
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
   SHOT ZONES — the one exemption. `pct` is raw FG% as 0..1.
   ------------------------------------------------------------ */
export function shotZoneColor(pct: number): string {
  /* the useful band of basketball FG% sits between .26 and .44,
     so the ramp is stretched across that window rather than 0..1 */
  const k = Math.max(0, Math.min(1, (pct - 0.26) / 0.18));
  for (const stop of shotZoneRamp) {
    if (k < stop.max) return stop.color;
  }
  return shotZoneRamp[shotZoneRamp.length - 1].color;
}
