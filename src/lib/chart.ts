/* shared chart geometry — one implementation for every viz */

export type Point = [number, number];

/** a catmull-rom-ish smoothing through the points */
export function smoothPath(points: Point[], tension = 0.85): string {
  if (points.length < 2) return '';
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  const k = tension / 3;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d +=
      ` C ${(p1[0] + (p2[0] - p0[0]) * k).toFixed(2)} ${(p1[1] + (p2[1] - p0[1]) * k).toFixed(2)},` +
      ` ${(p2[0] - (p3[0] - p1[0]) * k).toFixed(2)} ${(p2[1] - (p3[1] - p1[1]) * k).toFixed(2)},` +
      ` ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

/** map a series into a box, with padding on every side */
export function project(
  values: number[],
  w: number,
  h: number,
  pad: number,
): Point[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return values.map((v, i) => [
    pad + (i / Math.max(1, values.length - 1)) * (w - pad * 2),
    pad + (1 - (v - min) / span) * (h - pad * 2),
  ]);
}

/** deterministic 0..1 stream from a seed — same output every render */
export function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
