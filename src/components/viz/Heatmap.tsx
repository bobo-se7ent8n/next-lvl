import { useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { colorData, colorUtility } from '../../tokens';
import { Label } from '../primitives/Text';
import type { ActivityDay } from '../../data/types';
import styles from './Charts.module.css';
import tip from './Tooltip.module.css';

const LEVEL_OPACITY = [1, 0.36, 0.64, 1] as const;

export interface HeatmapProps {
  days: ActivityDay[];
  dayLabels: string[];
  /** cell edge in px */
  cell?: number;
  gap?: number;
  className?: string;
}

/** the activity calendar — one square per day, seven rows deep */
export function Heatmap({ days, dayLabels, cell = 21, gap = 3, className }: HeatmapProps) {
  const [hover, setHover] = useState<{ day: ActivityDay; x: number; y: number } | null>(null);
  const outer = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={outer}
      className={cx(styles.heatmapOuter, className)}
      onPointerLeave={() => setHover(null)}
    >
    <div className={styles.heatmapScroll}>
    <div
      className={styles.heatmap}
      style={{ '--cell': `${cell}px`, '--cell-gap': `${gap}px` } as CSSProperties}
    >
      <div className={styles.heatDays}>
        {dayLabels.map((l, i) => (
          <span key={i}>{i % 2 === 1 ? l : ''}</span>
        ))}
      </div>

      <div className={styles.heatGrid} role="img" aria-label="Sessions per day over the last 18 weeks">
        {days.map((d) => (
          <i
            key={d.index}
            className={styles.heatCell}
            style={
              {
                '--cell-bg': d.level === 0 ? colorUtility.empty : colorData.mint,
                '--cell-opacity': LEVEL_OPACITY[d.level],
              } as CSSProperties
            }
            onPointerEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const host = outer.current?.getBoundingClientRect();
              setHover({
                day: d,
                x: rect.left - (host?.left ?? 0) + rect.width / 2,
                y: rect.top - (host?.top ?? 0),
              });
            }}
          />
        ))}
      </div>

    </div>
    </div>

      {hover ? (
        <div className={cx(tip.tip, tip.on)} style={{ left: hover.x, top: hover.y }}>
          <Label tone="inherit" className={tip.tipHead}>
            {hover.day.date}
          </Label>
          {hover.day.level === 0
            ? 'no session'
            : `${hover.day.count} session${hover.day.count === 1 ? '' : 's'} · ${hover.day.name} · ${hover.day.duration}`}
        </div>
      ) : null}
    </div>
  );
}
