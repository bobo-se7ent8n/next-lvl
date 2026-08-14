import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { FOCUS } from '../../data/vitals';
import styles from './FocusPanel.module.css';

export interface FocusPanelProps {
  className?: string;
}

/** one thing worth attention this week. Read top to bottom: the number
 *  carries the weight, the three beats are a plain stacked sequence. */
export function FocusPanel({ className }: FocusPanelProps) {
  return (
    <Card radius="shell" padding="11" fill className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.top}>
        <Display size="md" as="h2" tone="tertiary">
          Focus
        </Display>
        <Chip tone="lilac">{FOCUS.kicker}</Chip>
      </div>

      <Metric value={FOCUS.stat} unit={FOCUS.unit} size="xl" caption={FOCUS.statLabel} />

      <div className={styles.beats}>
        {FOCUS.steps.map((step) => (
          <div key={step.label} className={styles.beat}>
            <Label>{step.label}</Label>
            <Text variant="bodySM" tone="secondary">
              {step.text}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
