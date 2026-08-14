import { useState } from 'react';
import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { SegmentedControl } from '../../components/primitives/Controls';
import { Metric } from '../../components/primitives/Metric';
import { StatSet } from '../../components/primitives/StatRow';
import { Display, Label, Text } from '../../components/primitives/Text';
import { Sparkline } from '../../components/viz/Sparkline';
import { semanticColor } from '../../lib/color';
import { colorData } from '../../tokens';
import { POINTS, POINTS_ORDER, type PointsRange } from '../../data/scoreboard';
import styles from './PointsBlock.module.css';

export interface PointsBlockProps {
  /** the window shown first */
  initialRange?: PointsRange;
  className?: string;
}

/** Points, in three windows. A single scrimmage has nothing to trend
 *  against, so only the two wider windows carry a tendency — and the
 *  wording of it stays flat. */
export function PointsBlock({ initialRange = 'last', className }: PointsBlockProps) {
  const [range, setRange] = useState<PointsRange>(initialRange);
  const view = POINTS[range];

  return (
    <Card radius="panel" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Points
        </Display>
        <Chip>Sport stat</Chip>
      </div>

      <SegmentedControl
        ariaLabel="Points window"
        value={range}
        onChange={setRange}
        options={POINTS_ORDER.map((id) => ({ value: id, label: POINTS[id].label }))}
      />

      <div className={styles.readout}>
        <Metric value={view.value} unit={view.unit} size="lg" caption={view.caption} />
        {view.series.length > 1 ? (
          <Sparkline
            className={styles.spark}
            values={view.series}
            color={colorData.blue}
            height={56}
            weight={2.5}
            ariaLabel={`${view.label}: ${view.series.join(', ')} points`}
          />
        ) : null}
      </div>

      {view.tendency ? (
        <div className={styles.tendency}>
          <span
            className={styles.tendencyMark}
            style={{ background: semanticColor(view.tendencyQuality ?? 0.5) }}
          />
          <Text variant="bodySM" tone="secondary">
            {view.tendency}
          </Text>
        </div>
      ) : null}

      <StatSet
        stats={view.splits.map((s) => ({
          label: s.label,
          value: `${s.made}/${s.attempts}`,
        }))}
      />

      <Label className={styles.note}>sport stats only · safe to share</Label>
    </Card>
  );
}
