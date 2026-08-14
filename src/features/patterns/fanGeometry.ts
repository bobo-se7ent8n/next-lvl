/* ============================================================
   FAN GEOMETRY

   Five slots, each with its own Y offset, rotation and scale. The
   table is deliberately uneven — an even arc reads as plotted, and
   a hand of cards never is. Fractional positions interpolate
   between neighbouring slots, and anything past the ends carries
   on with the slope of the last pair so a card entering the fan
   moves continuously.
   ============================================================ */

export interface SlotShape {
  y: number;
  rot: number;
  scale: number;
}

const TABLE: Array<{ d: number } & SlotShape> = [
  { d: -2, y: 64, rot: -13.5, scale: 0.78 },
  { d: -1, y: 2, rot: -4.5, scale: 0.95 },
  { d: 0, y: -26, rot: 2.0, scale: 1.08 },
  { d: 1, y: 34, rot: 8.5, scale: 0.89 },
  { d: 2, y: 86, rot: 15.0, scale: 0.74 },
];

const FIRST = TABLE[0];
const LAST = TABLE[TABLE.length - 1];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** the shape of the slot at a (possibly fractional) offset from centre */
export function slotShape(d: number): SlotShape {
  if (d <= FIRST.d) {
    const t = FIRST.d - d;
    const next = TABLE[1];
    return {
      y: FIRST.y + (FIRST.y - next.y) * t,
      rot: FIRST.rot + (FIRST.rot - next.rot) * t,
      scale: Math.max(0.4, FIRST.scale + (FIRST.scale - next.scale) * t),
    };
  }
  if (d >= LAST.d) {
    const t = d - LAST.d;
    const prev = TABLE[TABLE.length - 2];
    return {
      y: LAST.y + (LAST.y - prev.y) * t,
      rot: LAST.rot + (LAST.rot - prev.rot) * t,
      scale: Math.max(0.4, LAST.scale + (LAST.scale - prev.scale) * t),
    };
  }

  const i = Math.floor(d) - FIRST.d;
  const a = TABLE[i];
  const b = TABLE[i + 1];
  const t = d - a.d;
  return {
    y: lerp(a.y, b.y, t),
    rot: lerp(a.rot, b.rot, t),
    scale: lerp(a.scale, b.scale, t),
  };
}

/** how many slots either side of centre stay fully visible */
export const VISIBLE_REACH = 2;
const FADE_REACH = 2.9;

export function slotOpacity(d: number): number {
  const a = Math.abs(d);
  if (a <= VISIBLE_REACH + 0.2) return 1;
  if (a >= FADE_REACH) return 0;
  return 1 - (a - (VISIBLE_REACH + 0.2)) / (FADE_REACH - VISIBLE_REACH - 0.2);
}

/** shortest signed distance from `index` to `position` around a ring of
 *  `total` cards — this is what makes the set cycle rather than end */
export function ringDelta(index: number, position: number, total: number): number {
  let d = index - position;
  const half = total / 2;
  while (d > half) d -= total;
  while (d < -half) d += total;
  return d;
}
