import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label } from '../../components/primitives/Text';
import { POINTS } from '../../data/scoreboard';
import styles from './PointsBlock.module.css';

export interface PointsBlockProps {
  className?: string;
}

/** Points, in three type tokens: the title, the number, and one mono
 *  line carrying the session and the season range together. No prose,
 *  no stat row, no splits and no controls — a control on this tile
 *  invited comparison, and comparison is not what this screen is for. */
export function PointsBlock({ className }: PointsBlockProps) {
  return (
    <Card radius="card" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Points
        </Display>
        <Chip>Sport stat</Chip>
      </div>

      <Metric value={POINTS.value} unit={POINTS.unit} size="lg" />
      <Label tone="tertiary">{POINTS.caption}</Label>
    </Card>
  );
}
