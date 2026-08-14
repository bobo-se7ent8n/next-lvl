import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { StatSet } from '../../components/primitives/StatRow';
import { Display, Text } from '../../components/primitives/Text';
import { Heatmap } from '../../components/viz/Heatmap';
import { Legend } from '../../components/viz/Legend';
import { colorData, colorSurface, colorUtility } from '../../tokens';
import { mix } from '../../lib/color';
import {
  ACTIVITY,
  ACTIVITY_PEAK,
  ACTIVITY_TOTAL,
  ACTIVITY_WEEKS,
  DAY_LABELS,
} from '../../data/activity';
import styles from './ActivityPanel.module.css';

export interface ActivityPanelProps {
  className?: string;
}

/** the activity calendar and what it adds up to. Sticky beside the log —
 *  it is the frame the sessions are read against. */
export function ActivityPanel({ className }: ActivityPanelProps) {
  return (
    <Card radius="shell" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h2">
          Activity
        </Display>
        <Chip>{`${ACTIVITY_WEEKS} weeks`}</Chip>
      </div>

      <Heatmap days={ACTIVITY} dayLabels={DAY_LABELS} cell={17} gap={3} />

      <StatSet
        stats={[
          { label: 'sessions', value: ACTIVITY_TOTAL },
          { label: 'weeks', value: ACTIVITY_WEEKS },
          { label: 'busiest week', value: ACTIVITY_PEAK },
        ]}
      />

      <Legend
        items={[
          { label: 'rest', color: colorUtility.empty },
          { label: 'light', color: mix(colorData.mint, colorSurface.background, 0.64) },
          { label: 'steady', color: mix(colorData.mint, colorSurface.background, 0.36) },
          { label: 'heavy', color: colorData.mint },
        ]}
      />

      <Text variant="bodyXS" tone="tertiary">
        Every session is kept on the device. Nothing here counts a streak, and
        nothing is owed for a rest day.
      </Text>
    </Card>
  );
}
