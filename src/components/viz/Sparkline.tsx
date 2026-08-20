import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { project, smoothPath } from '../../lib/chart';
import { cx } from '../../lib/css';
import { useEnterProgress } from '../../lib/enter';
import { useEnterKey } from '../../lib/enterContext';
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
  const d = smoothPath(points);

  /* THE LINE DRAWS ITSELF IN, AND THEN THE DASH IS GONE.
   *
   *  The dash pattern is measured with `getTotalLength()`, which
   *  reports USER units — but the stroke is `non-scaling-stroke`, so
   *  the browser lays the dashes out in SCREEN units. On a chart box
   *  that is not 100 × 40, those two disagree, and the "one long dash"
   *  that was supposed to cover the whole line instead repeats across
   *  it. That is why every trend line in the product rendered as
   *  disconnected fragments.
   *
   *  The animation is transient; the resting state is what anybody
   *  actually reads. So the dash is cleared the moment the draw
   *  finishes — past that point the path carries no dash pattern at
   *  all and cannot fragment. */
  const path = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const progress = useEnterProgress(useEnterKey());
  const drawing = progress < 1 && length > 0;

  useEffect(() => {
    if (path.current) setLength(path.current.getTotalLength());
  }, [d]);

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
          ref={path}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={drawing ? length : undefined}
          strokeDashoffset={drawing ? length * (1 - progress) : undefined}
        />
      </svg>

      {/* THE END MARKER IS A TRUE CIRCLE.
       *
       *  It cannot live in the SVG: that box is drawn with
       *  `preserveAspectRatio="none"` so the line fills whatever
       *  shape the card gives it, which scales x and y by different
       *  amounts and turns any circle into an ellipse. Positioned
       *  here in percentages instead — the same normalised
       *  coordinates the path uses — with a fixed pixel size, so it
       *  is perfectly round at every card size and in every state. */}
      {showEnd ? (
        <span
          className={styles.endDot}
          style={
            {
              '--dot-x': `${((end[0] / W) * 100).toFixed(3)}%`,
              '--dot-y': `${((end[1] / H) * 100).toFixed(3)}%`,
              '--dot-size': `${(weight * 2).toFixed(1)}px`,
              '--dot-color': color,
              opacity: progress > 0.98 ? 1 : 0,
            } as CSSProperties
          }
        />
      ) : null}
    </div>
  );
}
