import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Label } from './Text';
import styles from './Metric.module.css';

/* There are two metric tokens and therefore two metric sizes. The
   `sm` and `xl` steps this type used to carry pointed at token names
   that no longer exist, so they rendered with no size at all. */
export type MetricSize = 'md' | 'lg';

const VARIANT: Record<MetricSize, string> = {
  md: 'metric-md',
  lg: 'metric-lg',
};

const UNIT_SIZE: Record<MetricSize, string> = {
  md: 'var(--aera-text-body-sm-size)',
  lg: 'var(--aera-text-body-size)',
};

export interface MetricProps {
  /** the number itself, already formatted */
  value: ReactNode;
  unit?: ReactNode;
  size?: MetricSize;
  /** a mono caption below the number */
  caption?: string;
  /** inherit the card's ink instead of the numeral colour */
  inherit?: boolean;
  align?: 'start' | 'center';
  className?: string;
  style?: CSSProperties;
}

/** big number + unit — the headline reading of any card */
export function Metric({
  value,
  unit,
  size = 'lg',
  caption,
  inherit,
  align = 'start',
  className,
  style,
}: MetricProps) {
  const key = `--aera-text-${VARIANT[size]}`;
  const row = (
    <div
      className={cx(styles.metric, align === 'center' && styles.center)}
      style={
        {
          '--v-family': `var(${key}-family)`,
          '--v-size': `var(${key}-size)`,
          '--v-leading': `var(${key}-leading)`,
          '--v-tracking': `var(${key}-tracking)`,
          '--v-weight': `var(${key}-weight)`,
          '--v-tone': inherit ? 'currentColor' : 'var(--aera-color-ink-primary)',
          '--u-size': UNIT_SIZE[size],
          '--u-tone': inherit ? 'currentColor' : 'var(--aera-color-ink-tertiary)',
        } as CSSProperties
      }
    >
      <span className={styles.value}>{value}</span>
      {unit ? <span className={styles.unit}>{unit}</span> : null}
    </div>
  );

  if (!caption) {
    return (
      <div className={className} style={style}>
        {row}
      </div>
    );
  }

  return (
    <div className={cx(styles.block, className)} style={style}>
      {row}
      <Label tone={inherit ? 'inherit' : 'tertiary'} style={inherit ? { opacity: 0.6 } : undefined}>
        {caption}
      </Label>
    </div>
  );
}
