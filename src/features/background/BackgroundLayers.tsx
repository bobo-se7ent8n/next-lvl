import { useEffect, useRef } from 'react';
import { colorInk } from '../../tokens';
import { withAlpha } from '../../lib/color';
import { paintAscii } from './ascii';
import type { BackgroundSettings } from './settings';
import styles from './BackgroundLayers.module.css';

export interface BackgroundLayersProps {
  settings: BackgroundSettings;
}

function linesImage(width: number, count: number, opacity: number): string {
  return (
    `repeating-linear-gradient(to right, ${withAlpha(colorInk.primary, opacity * 0.22)} 0 ${width}px,` +
    ` transparent ${width}px calc(100vw / ${count}))`
  );
}

function grainImage(amount: number, scale: number): string {
  const bf = (0.9 / Math.max(0.2, scale)).toFixed(3);
  const slope = Math.max(0.05, amount).toFixed(2);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>` +
    `<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='${bf}' numOctaves='3' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/>` +
    `<feComponentTransfer><feFuncA type='linear' slope='${slope}'/></feComponentTransfer></filter>` +
    `<rect width='220' height='220' filter='url(#g)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** the three decorative layers. Strictly pointer-events: none — the
 *  paper stays flat, this is texture and never a colour wash. */
export function BackgroundLayers({ settings }: BackgroundLayersProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { lines, grain, ascii } = settings;

  useEffect(() => {
    if (!ascii.on) return;
    const el = canvas.current;
    if (!el) return;
    const paint = () =>
      paintAscii(el, {
        cell: ascii.cell,
        fontSize: ascii.fontSize,
        opacity: ascii.opacity,
        seed: ascii.seed,
        ink: colorInk.primary,
      });
    paint();
    window.addEventListener('resize', paint);
    return () => window.removeEventListener('resize', paint);
  }, [ascii.on, ascii.cell, ascii.fontSize, ascii.opacity, ascii.seed]);

  return (
    <div className={styles.root} aria-hidden="true">
      {ascii.on ? <canvas ref={canvas} className={styles.ascii} /> : null}
      {lines.on ? (
        <div
          className={styles.lines}
          style={{ backgroundImage: linesImage(lines.width, lines.count, lines.opacity) }}
        />
      ) : null}
      {grain.on ? (
        <div
          className={styles.grain}
          style={{ backgroundImage: grainImage(grain.amount, grain.scale), opacity: grain.opacity }}
        />
      ) : null}
    </div>
  );
}
