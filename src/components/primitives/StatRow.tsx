import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Label, Text } from './Text';
import styles from './StatRow.module.css';

export interface StatRowProps {
  label: string;
  value: ReactNode;
  /** the compact form — value above, mono label below, used in a StatSet */
  inline?: boolean;
  /** inherit the surrounding ink rather than the numeral colour */
  inherit?: boolean;
  className?: string;
}

/** a labelled reading — the row form of a metric */
export function StatRow({ label, value, inline, inherit, className }: StatRowProps) {
  if (inline) {
    return (
      <span className={cx(styles.row, styles.inline, className)}>
        <Text
          as="b"
          variant="metricMD"
          tone={inherit ? 'inherit' : 'primary'}
          numeric
        >
          {value}
        </Text>
        <Label tone={inherit ? 'inherit' : 'tertiary'}>{label}</Label>
      </span>
    );
  }

  return (
    <div className={cx(styles.row, className)}>
      <Text variant="bodySM" tone="secondary" className={styles.label}>
        {label}
      </Text>
      <Text
        as="b"
        variant="metricMD"
        tone={inherit ? 'inherit' : 'primary'}
        numeric
        className={styles.value}
      >
        {value}
      </Text>
    </div>
  );
}

export interface StatSetProps {
  stats: Array<{ label: string; value: ReactNode }>;
  inherit?: boolean;
  className?: string;
}

/** a run of inline stats — the stat row of a session card */
export function StatSet({ stats, inherit, className }: StatSetProps) {
  return (
    <div className={cx(styles.set, className)}>
      {stats.map((s) => (
        <StatRow key={s.label} label={s.label} value={s.value} inline inherit={inherit} />
      ))}
    </div>
  );
}
