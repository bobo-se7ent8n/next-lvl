import type { CSSProperties } from 'react';
import { project, smoothPath } from '../../lib/chart';
import { cx } from '../../lib/css';
import styles from './Charts.module.css';

export interface AreaChartProps {
  values: number[];
  color: string;
  /** how solid the filled body is */
  fillOpacity?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const W = 100;
const H = 40;

/** a filled series — volume over time, always flat colour, never a gradient */
export function AreaChart({
  values,
  color,
  fillOpacity = 0.28,
  height = 44,
  ariaLabel,
  className,
  style,
}: AreaChartProps) {
  const pad = 4;
  const floor = H - pad;
  const points = project(values, W, floor, pad);
  const line = smoothPath(points);
  const body = `${line} L ${(W - pad).toFixed(2)} ${floor.toFixed(2)} L ${pad} ${floor.toFixed(2)} Z`;

  return (
    <div
      className={cx(styles.chartBox, className)}
      style={{ '--chart-h': `${height}px`, ...style } as CSSProperties}
    >
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel ?? 'trend'}
      >
        <path d={body} fill={color} opacity={fillOpacity} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          /* no dash pattern here, ever — see Sparkline for why a dash
             measured in user units fragments a non-scaling stroke */
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
