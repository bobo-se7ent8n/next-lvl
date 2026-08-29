import { useId, type CSSProperties } from 'react';
import { project, smoothPath } from '../../lib/chart';
import { cx } from '../../lib/css';
import { useEnterProgress } from '../../lib/enter';
import { useEnterKey } from '../../lib/enterContext';
import styles from './Charts.module.css';

export interface AreaChartProps {
  values: number[];
  color: string;
  /** how solid the filled body is */
  fillOpacity?: number;
  /** a px number, or any CSS length — `'100%'` lets the chart fill
   *  a cell that already has a definite height */
  height?: number | string;
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

  /* the same clip sweep the sparkline uses — see the long note
     there for why a dash cannot work against a non-scaling stroke */
  const progress = useEnterProgress(useEnterKey());
  const clipId = useId();

  return (
    <div
      className={cx(styles.chartBox, className)}
      style={{ '--chart-h': typeof height === 'number' ? `${height}px` : height, ...style } as CSSProperties}
    >
      <svg
        className={styles.chart}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel ?? 'trend'}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y={-H} width={W * progress + 0.001} height={H * 3} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
        <path d={body} fill={color} opacity={fillOpacity} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        </g>
      </svg>
    </div>
  );
}
