import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { ProgressRow } from '../../components/primitives/Controls';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { Legend } from '../../components/viz/Legend';
import { semanticColor } from '../../lib/color';
import { SKILLS, SKILL_AVERAGE, SKILL_SOURCE, WHERE_NEXT } from '../../data/scoreboard';
import styles from './SkillRatings.module.css';

export interface SkillRatingsProps {
  className?: string;
}

/* a rating's colour is semantic: green is strong, orange is developing.
   The scale is the player's own — there is nobody else in it. */
const quality = (value: number) => (value - 45) / 45;

/** The centre column of the bento, and one card rather than two. Two
 *  groups of ratings — label left, a 0–100 bar, the reading right —
 *  and then, at the bottom, the one thing worth working on. That is
 *  the same relationship Focus has to the vitals on Home: the stats
 *  first, and then the single thing they point at. */
export function SkillRatings({ className }: SkillRatingsProps) {
  return (
    <Card radius="card" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Skill ratings
        </Display>
        <Chip>Score</Chip>
      </div>

      <div className={styles.top}>
        <Metric value={SKILL_AVERAGE} unit="/ 100 avg" size="md" />
        <Legend
          items={[
            { label: 'strong', color: semanticColor(0.9) },
            { label: 'holding', color: semanticColor(0.55) },
            { label: 'developing', color: semanticColor(0.1) },
          ]}
        />
      </div>

      <Text variant="bodySM" tone="tertiary" className={styles.source}>
        {SKILL_SOURCE}
      </Text>

      <div className={styles.groups}>
        <div className={styles.group}>
          <Label>Shooting</Label>
          {SKILLS.shooting.map((s) => (
            <ProgressRow key={s.label} label={s.label} value={s.value} color={semanticColor(quality(s.value))} />
          ))}
        </div>
        <div className={styles.group}>
          <Label>Handling &amp; movement</Label>
          {SKILLS.handling.map((s) => (
            <ProgressRow key={s.label} label={s.label} value={s.value} color={semanticColor(quality(s.value))} />
          ))}
        </div>
      </div>

      {/* ---- the one thing worth attention, after both groups ----
           The heading is the card's own heading style, not a quieter
           one: this is the second half of the card, not a footnote.
           Balance is drawn as a rating row identical to Free throw
           above it, and the line under it takes the same treatment as
           the source line at the top. */}
      <section className={styles.next}>
        <Display size="md" as="h4">
          Where to work next
        </Display>

        <ProgressRow
          label={WHERE_NEXT.label}
          value={WHERE_NEXT.value}
          color={semanticColor(quality(WHERE_NEXT.value))}
        />

        <Text variant="bodySM" tone="tertiary">
          {WHERE_NEXT.text}
        </Text>
      </section>
    </Card>
  );
}
