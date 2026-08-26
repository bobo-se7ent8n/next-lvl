import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { useEnterProgress } from '../../lib/enter';
import { useEnterKey } from '../../lib/enterContext';
import { dataColor } from '../../lib/color';
import { Label, Text } from '../primitives/Text';
import type { SeriesPoint } from '../../data/types';
import styles from './Charts.module.css';

export interface BarSetProps {
  items: SeriesPoint[];
  /** a px number, or any CSS length — `'100%'` lets the chart fill
   *  a cell that already has a definite height */
  height?: number | string;
  /** show the number above each bar */
  showValues?: boolean;
  /** show the category under each bar */
  showLabels?: boolean;
  /** the bar corner — generous by default, matching the card language */
  radius?: 'pill' | 'md';
  /** inherit the card's ink for the labels */
  inherit?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** a small set of categories side by side */
export function BarSet({
  items,
  height = 96,
  showValues = true,
  showLabels = false,
  radius = 'pill',
  inherit,
  className,
  style,
}: BarSetProps) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const chromeH = (showValues ? 22 : 0) + (showLabels ? 18 : 0);
  /* the bars grow up out of the baseline on entry rather than being
     there already — a reading that arrives, not one that was waiting */
  const progress = useEnterProgress(useEnterKey());


  return (
    <div
      className={cx(styles.bars, className)}
      style={{ '--chart-h': typeof height === 'number' ? `${height}px` : height, ...style } as CSSProperties}
      role="img"
      aria-label={items.map((i) => `${i.label} ${i.value}`).join(', ')}
    >
      {items.map((item) => (
        <div key={item.label} className={styles.bar}>
          {showValues ? (
            <Text
              as="span"
              variant="metricMD"
              tone={inherit ? 'inherit' : 'primary'}
              numeric
              className={styles.barValue}
            >
              {item.value}
            </Text>
          ) : null}
          <span
            className={styles.barFill}
            style={
              {
                '--bar-color': dataColor(item.tone),
                '--bar-radius': `var(--aera-radius-${radius})`,
                '--bar-height': `calc((100% - ${chromeH}px) * ${(Math.max(0.08, item.value / max) * progress).toFixed(3)})`,
              } as CSSProperties
            }
          />
          {showLabels ? (
            <Label
              tone={inherit ? 'inherit' : 'tertiary'}
              className={styles.barLabel}
              style={inherit ? { opacity: 0.65 } : undefined}
            >
              {item.label}
            </Label>
          ) : null}
        </div>
      ))}
    </div>
  );
}
