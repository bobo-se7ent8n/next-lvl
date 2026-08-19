import type { CSSProperties } from 'react';
import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Well } from '../../components/primitives/Surface';
import { Metric } from '../../components/primitives/Metric';
import { Display, Text } from '../../components/primitives/Text';
import { Legend } from '../../components/viz/Legend';
import { Sparkline } from '../../components/viz/Sparkline';
import { AreaChart } from '../../components/viz/AreaChart';
import { BarSet } from '../../components/viz/BarSet';
import { dataColor } from '../../lib/color';
import type { Vital } from '../../data/types';
import styles from './VitalCard.module.css';

export interface VitalCardProps {
  vital: Vital;
  className?: string;
}

/* the chart takes the height of the well rather than a fixed 92px:
   six cards share two rows of a single viewport, so the graphic is
   the part that has to give. */
const FILL = { '--chart-h': '100%' } as CSSProperties;

/** a body reading. Private to the device — never shareable. */
export function VitalCard({ vital, className }: VitalCardProps) {
  return (
    <Card radius="card" padding="10" fill className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          {vital.label}
        </Display>
        <Chip>{vital.category}</Chip>
      </div>

      <Metric value={vital.value} unit={vital.unit} size="lg" />

      <Text variant="bodySM" tone="tertiary">
        {vital.desc}
      </Text>

      {vital.legend ? (
        <Legend
          className={styles.legend}
          items={vital.legend.map((l) => ({ label: l.label, value: l.value, color: dataColor(l.tone) }))}
        />
      ) : null}

      <Well className={styles.well}>
        {vital.chart.type === 'bars' ? (
          <BarSet items={vital.chart.items} className={styles.chart} style={FILL} />
        ) : vital.chart.type === 'area' ? (
          <AreaChart
            values={vital.chart.values}
            color={dataColor(vital.chart.tone)}
            className={styles.chart}
            style={FILL}
          />
        ) : (
          <Sparkline
            values={vital.chart.values}
            color={dataColor(vital.chart.tone)}
            className={styles.chart}
            style={FILL}
          />
        )}
      </Well>
    </Card>
  );
}
