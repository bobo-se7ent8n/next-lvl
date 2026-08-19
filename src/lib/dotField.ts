/* ============================================================
   DOT FIELD GEOMETRY

   The whole illustration language of the product is one grid of
   dots. The dot itself never changes — size, corner and palette
   are token invariants. What changes is local spacing, opacity,
   omission and phase, and each pattern below is a metaphor for
   one thing the product measures:

     compress  rushing / quickening — even pitch that tightens
               through the event
     hold      breath before the gather — a held gap in an
               otherwise even rhythm
     stall     hesitation — a field that halts, then resumes
               raggedly
     disperse  recovery — scatter resolving back into order
     steady    confidence / holding — an even field that brightens
     interval  the collapsing pre-shot interval — vertical columns
               whose GAPS close from left to right. The measured
               quantity is the space between the columns, not the
               dots, so the eye reads the rhythm shortening rather
               than a bar getting denser.

   Everything here is a pure function of (pattern, row, column),
   so a field is identical on every render and in every story.
   ============================================================ */

import { dotMatrix } from '../tokens';

export type DotPattern =
  | 'compress'
  | 'hold'
  | 'stall'
  | 'disperse'
  | 'steady'
  | 'interval';

export const DOT_PATTERNS: DotPattern[] = [
  'compress',
  'hold',
  'stall',
  'disperse',
  'steady',
  'interval',
];

/** what each pattern is a picture of — used by stories and the browser */
export const DOT_PATTERN_NOTE: Record<DotPattern, string> = {
  compress: 'rushing — even pitch that compresses through the event',
  hold: 'breath before the gather — a held gap in an even rhythm',
  stall: 'hesitation — the field stalls, then resumes',
  disperse: 'recovery — dispersal resolving back into order',
  steady: 'holding — a steady field, brightening slightly',
  interval: 'the collapsing interval — the gaps between beats closing toward release',
};

export interface DotCell {
  key: string;
  x: number;
  y: number;
  opacity: number;
  /** 0..1 along the row — drives the travelling highlight when animated */
  u: number;
}

/** deterministic 0..1 from two integers. Same field on every render. */
function hash01(a: number, b: number): number {
  let h = (a * 73856093) ^ (b * 19349663);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const bell = (u: number, at: number, width: number) =>
  Math.exp(-(((u - at) / width) ** 2));

/** the local pitch multiplier at u — 1 is the base grid */
function pitchAt(pattern: DotPattern, u: number, phase: number): number {
  const t = u + phase;
  switch (pattern) {
    /* the quickening: steps get shorter through the closeout */
    case 'compress':
      return 1 - 0.74 * bell(t, 0.62, 0.2);
    /* one beat of air, held, in an otherwise even rhythm */
    case 'hold':
      return 1 + 3.6 * bell(t, 0.5, 0.05);
    /* progress halts inside the band, then picks back up */
    case 'stall':
      return t > 0.38 && t < 0.56 ? 0.2 : 1;
    /* the interval between beats closes, monotonically, all the way
       to the release. Nothing about this one is a bell curve: it
       never opens back up. */
    case 'interval':
      return 1.85 - 1.62 * Math.min(1, Math.max(0, t)) ** 1.2;
    case 'disperse':
    case 'steady':
    default:
      return 1;
  }
}

function opacityAt(pattern: DotPattern, u: number, row: number): number {
  const { minOpacity, maxOpacity } = dotMatrix;
  const clamp = (v: number) => Math.min(maxOpacity, Math.max(minOpacity, v));
  switch (pattern) {
    case 'compress':
      return clamp(0.42 + 0.58 * bell(u, 0.62, 0.3));
    case 'hold':
      /* the field goes quiet either side of the held beat */
      return clamp(0.86 - 0.5 * bell(u, 0.5, 0.13));
    case 'stall':
      return clamp(u > 0.38 && u < 0.58 ? 0.3 : 0.9 - 0.25 * bell(u, 0.66, 0.16));
    case 'disperse':
      return clamp(0.34 + 0.62 * u + 0.1 * hash01(row, Math.round(u * 100)));
    case 'interval':
      /* the columns dim a little as they crowd — the dimming is the
         supporting signal, the spacing is the measurement */
      return clamp(1 - 0.34 * u);
    case 'steady':
    default:
      return clamp(0.5 + 0.45 * u);
  }
}

/** true when this cell is left out — omission is part of the language */
function omitted(pattern: DotPattern, u: number, row: number, col: number): boolean {
  const r = hash01(row * 977 + col, col * 31 + row);
  switch (pattern) {
    /* the field comes back ragged after the stall */
    case 'stall':
      return u > 0.56 && u < 0.76 && r < 0.42;
    /* scatter on the left, whole on the right */
    case 'disperse':
      return r < 0.5 * (1 - u) ** 1.3;
    case 'hold':
      return r < 0.06;
    case 'compress':
      return r < 0.05;
    /* a beat is a whole column: nothing is left out of it */
    case 'interval':
      return false;
    case 'steady':
    default:
      return r < 0.04;
  }
}

/** vertical wander — only recovery has any */
function driftAt(pattern: DotPattern, u: number, row: number, col: number): number {
  if (pattern !== 'disperse') return 0;
  return (hash01(col, row * 7 + 3) - 0.5) * dotMatrix.pitch * 1.9 * (1 - u) ** 1.35;
}

export interface DotFieldOptions {
  pattern: DotPattern;
  columns: number;
  rows: number;
}

export interface DotField {
  cells: DotCell[];
  width: number;
  height: number;
}

/** build one field. Pure: same inputs, same dots, every time. */
export function buildDotField({ pattern, columns, rows }: DotFieldOptions): DotField {
  const { pitch, size } = dotMatrix;
  const width = columns * pitch;
  const height = rows * pitch;
  const cells: DotCell[] = [];

  for (let row = 0; row < rows; row++) {
    /* each row is nudged along the pattern so the field never reads
       as a barcode — the phase offset is the fourth variable */
    const phase = (row - (rows - 1) / 2) * 0.055;

    /* lay the row out by cumulative local pitch, then normalise it
       back onto the full width so every row spans the same box */
    const steps: number[] = [];
    let sum = 0;
    for (let col = 0; col < columns; col++) {
      steps.push(sum);
      sum += pitchAt(pattern, col / (columns - 1), phase);
    }
    const span = sum - pitchAt(pattern, 1, phase) || 1;
    const usable = width - size;

    for (let col = 0; col < columns; col++) {
      const u = Math.min(1, Math.max(0, steps[col] / span));
      const raw = col / (columns - 1);
      if (omitted(pattern, raw, row, col)) continue;
      cells.push({
        key: `${row}-${col}`,
        x: u * usable,
        y: row * pitch + driftAt(pattern, raw, row, col),
        opacity: opacityAt(pattern, u, row),
        u,
      });
    }
  }

  return { cells, width, height };
}
