import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip, Tag } from '../primitives/Chip';
import { Display, Text } from '../primitives/Text';
import { DotMatrix } from '../graphics/DotMatrix';
import type { DataTone } from '../../tokens';
import type { Insight } from '../../data/types';
import styles from './InsightCard.module.css';

const KIND_TONE: Record<Insight['kind'], DataTone> = {
  DRILL: 'mint',
  LESSON: 'lilac',
  VIDEO: 'blue',
};

/** how many beats wide every library field is */
const COLUMNS = 26;

/** The well is reserved at the item's own aspect, so the field is cut
 *  to match it: the grid pitch is the invariant and the number of rows
 *  is what follows. A fixed row count left a band of empty tint above
 *  the dots in every card with a tall well. */
function rowsFor(ratio: string): number {
  const [w, h] = ratio.split('/').map((part) => Number(part.trim()));
  if (!w || !h) return 6;
  return Math.max(3, Math.round((COLUMNS * h) / w));
}

export interface InsightCardProps {
  insight: Insight;
  onClick?: () => void;
  /** an anchor, so a session's insight line can link straight to it */
  id?: string;
  className?: string;
}

/** a library item. Nothing here is recommended or ranked — the library
 *  is pulled from, never pushed. */
export function InsightCard({ insight, onClick, id, className }: InsightCardProps) {
  return (
    <Card
      radius="card"
      elevation="low"
      padding="9"
      id={id}
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cx(styles.card, className)}
    >
      <div className={styles.head}>
        <Display size="md" as="h3">
          {insight.title}
        </Display>
        <Chip tone={KIND_TONE[insight.kind]}>{insight.kind.toLowerCase()}</Chip>
      </div>

      {insight.desc ? (
        <Text variant="bodySM" tone="secondary">
          {insight.desc}
        </Text>
      ) : null}

      {/* the one illustration language, never a per-card style: the
          pattern is chosen to match what the item is about */}
      <div className={styles.graphic} style={{ '--ratio': insight.ratio } as CSSProperties}>
        <DotMatrix
          pattern={insight.graphic}
          rows={rowsFor(insight.ratio)}
          columns={COLUMNS}
          accent={KIND_TONE[insight.kind]}
          fill
          ariaLabel={`${insight.title}: ${insight.graphic} field`}
        />
      </div>

      <div className={styles.meta}>
        {insight.pattern ? <Tag quiet>{insight.pattern}</Tag> : <Tag quiet>library</Tag>}
        <Tag>{insight.side === 'on' ? 'on court' : 'off court'}</Tag>
        <Text as="span" variant="bodySM" tone="secondary" numeric className={styles.duration}>
          {insight.duration}
        </Text>
      </div>
    </Card>
  );
}
