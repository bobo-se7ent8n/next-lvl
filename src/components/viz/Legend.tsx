import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { Text } from '../primitives/Text';
import styles from './Charts.module.css';

export interface LegendItem {
  label: string;
  color: string;
  value?: string;
}

export interface LegendProps {
  items: LegendItem[];
  /** inherit the surrounding ink instead of the tertiary tone */
  inherit?: boolean;
  justify?: 'start' | 'center';
  className?: string;
}

/** the key for any chart — swatch, name, optional reading */
export function Legend({ items, inherit, justify = 'start', className }: LegendProps) {
  return (
    <div
      className={cx(styles.legend, className)}
      style={{ justifyContent: justify === 'center' ? 'center' : 'flex-start' }}
    >
      {items.map((item) => (
        <span key={item.label} className={styles.legendItem}>
          <i className={styles.legendSwatch} style={{ '--swatch': item.color } as CSSProperties} />
          <Text
            as="span"
            variant="bodySM"
            tone={inherit ? 'inherit' : 'tertiary'}
            style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            {item.label}
            {item.value ? (
              <Text as="b" variant="bodySM" tone={inherit ? 'inherit' : 'secondary'} numeric style={{ display: 'inline', marginLeft: 'var(--aera-space-3)', fontWeight: 'var(--aera-weight-semibold)' }}>
                {item.value}
              </Text>
            ) : null}
          </Text>
        </span>
      ))}
    </div>
  );
}
