import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip, Tag } from '../primitives/Chip';
import { Display, Text } from '../primitives/Text';
import type { DataTone } from '../../tokens';
import type { Insight } from '../../data/types';
import styles from './InsightCard.module.css';

const KIND_TONE: Record<Insight['kind'], DataTone> = {
  DRILL: 'mint',
  LESSON: 'lilac',
  VIDEO: 'blue',
};

export interface InsightCardProps {
  insight: Insight;
  onClick?: () => void;
  className?: string;
}

/** a library item. Nothing here is recommended or ranked — the library
 *  is pulled from, never pushed. */
export function InsightCard({ insight, onClick, className }: InsightCardProps) {
  return (
    <Card
      radius="panel"
      elevation="low"
      padding="9"
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

      <div className={styles.thumb} style={{ '--ratio': insight.ratio } as CSSProperties} />

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
