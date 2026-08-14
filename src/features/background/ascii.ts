/* the generated ASCII number field — a density ramp of digits and
   symbols, laid out on smooth value noise so it resolves into a
   large-scale image at a distance instead of reading as static */

const RAMP = ' .,:;-~+=*1379#%8&@';

function cellHash(x: number, y: number, seed: number): number {
  let h = (seed ^ (x * 374761393) ^ (y * 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function makeNoise(seed: number) {
  const smooth = (u: number, v: number, f: number) => {
    const x = u * f;
    const y = v * f;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = x - x0;
    const ty = y - y0;
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);
    const a = cellHash(x0, y0, seed);
    const b = cellHash(x0 + 1, y0, seed);
    const c = cellHash(x0, y0 + 1, seed);
    const d = cellHash(x0 + 1, y0 + 1, seed);
    const top = a + (b - a) * sx;
    const bot = c + (d - c) * sx;
    return top + (bot - top) * sy;
  };

  return (u: number, v: number) => {
    let sum = 0;
    let total = 0;
    let amp = 1;
    let freq = 2.6;
    for (let i = 0; i < 4; i++) {
      sum += smooth(u, v, freq) * amp;
      total += amp;
      amp *= 0.5;
      freq *= 2.1;
    }
    const n = sum / total;
    return Math.max(0, Math.min(1, (n - 0.5) * 1.55 + 0.5));
  };
}

export interface AsciiPaintOptions {
  cell: number;
  fontSize: number;
  opacity: number;
  seed: number;
  ink: string;
}

export function paintAscii(canvas: HTMLCanvasElement, opts: AsciiPaintOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const size = Math.max(4, opts.cell);
  const cols = Math.ceil(w / size) + 1;
  const rows = Math.ceil(h / size) + 1;
  ctx.font = `${opts.fontSize}px "IBM Plex Mono", ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = opts.ink;

  const noise = makeNoise(opts.seed);
  const last = RAMP.length - 1;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const density = noise(x / cols, y / rows);
      const jitter = (cellHash(x, y, opts.seed) - 0.5) * 1.4;
      const ch = RAMP[Math.max(0, Math.min(last, Math.round(density * last + jitter)))];
      if (ch === ' ') continue;
      ctx.globalAlpha = opts.opacity * (0.2 + density * 0.8);
      ctx.fillText(ch, x * size + size / 2, y * size + size / 2);
    }
  }
  ctx.globalAlpha = 1;
}
