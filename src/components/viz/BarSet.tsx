import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { dataColor } from '../../lib/color';
import { Label, Text } from '../primitives/Text';
import type { SeriesPoint } from '../../data/types';
import styles from './Charts.module.css';

export interface BarSetProps {
  items: SeriesPoint[];
  height?: number;
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

  return (
    <div
      className={cx(styles.bars, className)}
      style={{ '--chart-h': `${height}px`, ...style } as CSSProperties}
      role="img"
      aria-label={items.map((i) => `${i.label} ${i.value}`).join(', ')}
    >
      {items.map((item) => (
        <div key={item.label} className={styles.bar}>
          {showValues ? (
            <Text
              as="span"
              variant="metricSM"
              tone={inherit ? 'inherit' : 'numeral'}
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
                '--bar-height': `calc((100% - ${chromeH}px) * ${Math.max(0.08, item.value / max).toFixed(3)})`,
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
