import type { CSSProperties } from 'react';
import { project, smoothPath } from '../../lib/chart';
import { cx } from '../../lib/css';
import styles from './Charts.module.css';

export interface SparklineProps {
  values: number[];
  color: string;
  /** stroke weight in user units of the 100 × 40 viewBox */
  weight?: number;
  /** mark the most recent reading with a dot */
  showEnd?: boolean;
  height?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const W = 100;
const H = 40;

/** a single series as a line — direction only, no axis, no grid */
export function Sparkline({
  values,
  color,
  weight = 3,
  showEnd = true,
  height = 44,
  ariaLabel,
  className,
  style,
}: SparklineProps) {
  const pad = weight + 1;
  const points = project(values, W, H, pad);
  const end = points[points.length - 1];

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
        <path
          d={smoothPath(points)}
          fill="none"
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {showEnd ? <circle cx={end[0]} cy={end[1]} r={weight * 0.9} fill={color} /> : null}
      </svg>
    </div>
  );
}
