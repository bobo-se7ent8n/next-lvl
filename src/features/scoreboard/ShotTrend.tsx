import { Card } from '../../components/primitives/Card';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { SHOT_TREND } from '../../data/scoreboard';
import styles from './ShotTrend.module.css';

export interface ShotTrendProps {
  className?: string;
}

/**
 * WHERE THE SHOT IS GOING
 *
 * This replaced the points tile. Points was a score, and a score is
 * the one reading this product deliberately does not keep — it
 * answers "how did I do" when everything else on the screen answers
 * "what is happening".
 *
 * What is here instead is a direction: a heading naming the trend,
 * two or three numbers carrying it, and one line placing it. The line
 * is an observation with an open question in it, never an instruction
 * — the visitor decides whether it is worth anything.
 */
export function ShotTrend({ className }: ShotTrendProps) {
  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      {/* meta and heading are one block at the tight step */}
      <div className={styles.intro}>
        <Label tone="tertiary">{SHOT_TREND.meta}</Label>
        <Display size="md" as="h3">
          {SHOT_TREND.heading}
        </Display>
      </div>

      <div className={styles.readings}>
        {SHOT_TREND.readings.map((reading) => (
          <Metric
            key={reading.label}
            value={reading.value}
            unit={reading.unit}
            degree={'degree' in reading && reading.degree}
            size="md"
            caption={reading.label}
          />
        ))}
      </div>

      <Text variant="bodySM" tone="secondary">
        {SHOT_TREND.note}
      </Text>
    </Card>
  );
}
