import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { ProgressRow } from '../../components/primitives/Controls';
import { Metric } from '../../components/primitives/Metric';
import { Display, Text } from '../../components/primitives/Text';
import { Legend } from '../../components/viz/Legend';
import { semanticColor } from '../../lib/color';
import { usePeriod } from './periodContext';
import styles from './SkillRatings.module.css';

export interface SkillRatingsProps {
  className?: string;
}

/* a rating's colour is semantic: green is strong, orange is developing.
   The scale is the player's own — there is nobody else in it. */
const quality = (value: number) => (value - 45) / 45;

/** CARD A — the ratings themselves.
 *
 *  Two groups, each row a label, a 0–100 bar and the reading. The
 *  average and the legend share the top row: they are both keys to the
 *  same scale, and stacking them cost a row of ratings. The source
 *  caption is gone — it explained where the numbers came from to a
 *  reader who had not asked, on the one card with the least room. */
export function SkillRatings({ className }: SkillRatingsProps) {
  const { data } = usePeriod();

  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Skill ratings
        </Display>
        <Chip>Score</Chip>
      </div>

      <div className={styles.top}>
        <Metric value={String(data.average)} unit="/ 100" size="md" />
        <Legend
          items={[
            { label: 'strong', color: semanticColor(0.9) },
            { label: 'holding', color: semanticColor(0.55) },
            { label: 'developing', color: semanticColor(0.1) },
          ]}
        />
      </div>

      <div className={styles.groups}>
        <div className={styles.group}>
          {/* sentence case, and not mono: this is a heading inside a
              card, not an annotation on a reading */}
          <Text variant="bodyStrong">Shooting</Text>
          {data.skills.shooting.map((s) => (
            <ProgressRow
              key={s.label}
              className={styles.ratingRow}
              label={s.label}
              value={s.value}
              color={semanticColor(quality(s.value))}
            />
          ))}
        </div>
        <div className={styles.group}>
          <Text variant="bodyStrong">Handling &amp; movement</Text>
          {data.skills.handling.map((s) => (
            <ProgressRow
              key={s.label}
              className={styles.ratingRow}
              label={s.label}
              value={s.value}
              color={semanticColor(quality(s.value))}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

/** CARD B — where to work next.
 *
 *  Its own card rather than a section under the ratings, because a
 *  divider inside one card made it read as a footnote to the numbers
 *  above it when it is the conclusion drawn from them. Repeatable: a
 *  rating row, and one line saying what that number actually does. */
export function WhereToWorkNext({ className }: SkillRatingsProps) {
  const { data } = usePeriod();

  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Where to work next
        </Display>
      </div>

      <div className={styles.entries}>
        {data.workNext.map((entry) => (
          <div key={entry.label} className={styles.entry}>
            <ProgressRow
              className={styles.ratingRow}
              label={entry.label}
              value={entry.value}
              color={semanticColor(quality(entry.value))}
            />
            <Text variant="bodySM" tone="tertiary">
              {entry.note}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
