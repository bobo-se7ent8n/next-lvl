import { useId, type CSSProperties } from 'react';
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
  /** flood the region under the curve, in the line's own colour */
  area?: boolean;
  /** a px number, or any CSS length — `'100%'` lets the chart fill
   *  a cell that already has a definite height */
  height?: number | string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const W = 100;
const H = 40;

/** how present the flood under a line is */
const AREA_OPACITY = 0.28;

/** a single series as a line — direction only, no axis, no grid */
export function Sparkline({
  values,
  color,
  weight = 3,
  showEnd = true,
  area,
  height = 44,
  ariaLabel,
  className,
  style,
}: SparklineProps) {
  const pad = weight + 1;
  const points = project(values, W, H, pad);
  const end = points[points.length - 1];
  const d = smoothPath(points);
  /* the area is the same curve, closed down to the floor of the box.
     Flat fill at a fixed alpha — never a gradient. */
  const areaPath = `${d} L ${W} ${H} L 0 ${H} Z`;

  /* THE LINE DRAWS ITSELF IN — WITH A CLIP, NOT A DASH.
   *
   *  TWO DASH ATTEMPTS FAILED HERE, AND THE MEASUREMENT SAYS WHY.
   *  The stroke carries `vector-effect: non-scaling-stroke`, which
   *  makes the browser lay the dash pattern out in SCREEN pixels. So:
   *
   *    · `getTotalLength()` gave user units -> the "one long dash"
   *      repeated across the path.
   *    · `pathLength="1"` should have renormalised it, but the
   *      computed value came back `stroke-dasharray: 1px` against a
   *      97.6-unit path — 97 repeats. `pathLength` does not survive
   *      a non-scaling stroke.
   *
   *  So no dash at all. A clip rectangle sweeps left to right across
   *  the box and the stroke is simply revealed under it: one
   *  continuous line growing from its start to its end, immune to
   *  which unit space the stroke happens to be measured in. The clip
   *  is in viewBox units, so it stretches with the chart exactly as
   *  the path does.
   */
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
            {/* one unit past the right edge so the end cap is never
                shaved by the clip's own boundary */}
            <rect x="0" y={-H} width={W * progress + 0.001} height={H * 3} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
        {area ? <path d={areaPath} fill={color} opacity={AREA_OPACITY} stroke="none" /> : null}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        </g>
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
