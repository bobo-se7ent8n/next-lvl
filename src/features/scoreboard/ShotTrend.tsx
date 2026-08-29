import { Card } from '../../components/primitives/Card';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label } from '../../components/primitives/Text';
import { SHOT_TREND } from '../../data/scoreboard';
import styles from './ShotTrend.module.css';

export interface ShotTrendProps {
  className?: string;
}

/**
 * WHERE THE SHOT IS GOING — three rows and no fourth.
 *
 * Rebuilt against Figma node 464:8762, which is the card at its
 * widest: a meta line, a heading, and a row of large numerals each
 * carrying a small unit. That is the whole card.
 *
 * WHAT CAME OUT. Every number used to print a small-caps label under
 * it — ARC ANGLE under `+3 arc`, RELEASE TIME under `-0.06 s` — and
 * the card closed with a sentence summarising the two numbers above
 * it. Three tellings of one fact. The heading names the trend, the
 * numbers are the evidence, and the unit beside each number is the
 * only label a number that size needs.
 */
export function ShotTrend({ className }: ShotTrendProps) {
  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      {/* 1 — the meta line, unchanged */}
      <Label tone="tertiary">{SHOT_TREND.meta}</Label>

      {/* 2 — the heading, in the Inter card-heading token */}
      <Display size="md" as="h3">{SHOT_TREND.heading}</Display>

      {/* 3 — THE NUMERALS. A grid rather than a flex row: auto-flow
          column with `1fr` tracks gives every reading the same width
          and no wrap, so the row reads the same whether the card
          carries two of them or five. */}
      <div className={styles.readings}>
        {SHOT_TREND.readings.map((reading) => (
          <Metric
            key={reading.id}
            value={reading.value}
            unit={reading.unit}
            degree={'degree' in reading && reading.degree}
            size="lg"
          />
        ))}
      </div>
    </Card>
  );
}
