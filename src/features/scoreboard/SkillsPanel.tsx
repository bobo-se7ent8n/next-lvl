import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { ProgressRow } from '../../components/primitives/Controls';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label } from '../../components/primitives/Text';
import { Legend } from '../../components/viz/Legend';
import { semanticColor } from '../../lib/color';
import { SKILLS, SKILL_AVERAGE } from '../../data/scoreboard';
import styles from './SkillsPanel.module.css';

export interface SkillsPanelProps {
  className?: string;
}

/* a skill's colour is semantic: green is strong, orange is developing.
   The scale is the player's own — there is nobody else in it. */
const quality = (value: number) => (value - 45) / 45;

export function SkillsPanel({ className }: SkillsPanelProps) {
  return (
    <Card radius="panel" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Skills
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

      <div className={styles.columns}>
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
    </Card>
  );
}
