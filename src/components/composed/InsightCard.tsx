import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip, Tag } from '../primitives/Chip';
import { Display, Label, Text } from '../primitives/Text';
import { Well } from '../primitives/Surface';
import { DotMatrix } from '../graphics/DotMatrix';
import { CardViz } from '../viz/CardViz';
import type { DataTone } from '../../tokens';
import type { Insight } from '../../data/types';
import styles from './InsightCard.module.css';
import { graphicWell } from '../../tokens';

const KIND_TONE: Record<Insight['kind'], DataTone> = {
  DRILL: 'mint',
  LESSON: 'lilac',
  VIDEO: 'blue',
};

/** how many beats wide every library field is */
const COLUMNS = 26;

/** Every well is the same landscape frame now, so the field is the
 *  same grid in all of them — the row count follows the frame's own
 *  ratio rather than the item's, which is what kept the dots square
 *  and the wells ragged. */
const GRAPHIC_ROWS = Math.max(3, Math.round((COLUMNS * graphicWell.h) / graphicWell.w));

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
      id={id}
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cx(styles.card, className)}
    >
      {/* heading row and the line under it: one nested column at the
          12px step, so the 16px block gap below is undisturbed */}
      <div className={styles.intro}>
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
      </div>

      {/* the one illustration language, never a per-card style: the
          pattern is chosen to match what the item is about */}
      <Well radius="lg" className={styles.graphic}>
        <CardViz card={insight}>
          <DotMatrix
            pattern={insight.graphic}
            rows={GRAPHIC_ROWS}
            columns={COLUMNS}
            accent={KIND_TONE[insight.kind]}
            fill
            ariaLabel={`${insight.title}: ${insight.graphic} field`}
          />
        </CardViz>
      </Well>

      {/* FILLED TAG FIRST. The filled one says where this is done and
          the stroked one says which pattern it belongs to — the
          stronger mark is the more specific fact, so it leads. */}
      <div className={styles.meta}>
        <Tag>{insight.side === 'on' ? 'on court' : 'off court'}</Tag>
        {insight.pattern ? <Tag quiet>{insight.pattern}</Tag> : <Tag quiet>library</Tag>}
        <Label tone="secondary" className={styles.duration}>
          {insight.duration}
        </Label>
      </div>
    </Card>
  );
}
