import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { Well } from '../primitives/Surface';
import { StatSet } from '../primitives/StatRow';
import { Display, Label, Text } from '../primitives/Text';
import type { Session } from '../../data/types';
import styles from './SessionCard.module.css';

export interface SessionCardProps {
  session: Session;
  onClick?: () => void;
  className?: string;
}

/** one recorded session, read top to bottom.
 *
 *  SHOTS is gone from the stat run: it was the one number on the card
 *  that measured volume rather than what happened, and it was the
 *  number every session had the most of, so it dominated a row it did
 *  not belong at the front of. The duration moved up into the date
 *  line, and the "new pattern" pill went entirely — the candidate
 *  block below already says a pattern came out of this session, and
 *  saying it twice made the card look like it was selling something. */
export function SessionCard({ session, onClick, className }: SessionCardProps) {
  const stats = [
    { label: 'pts', value: session.pts },
    { label: 'stl', value: session.stl },
    { label: 'reb', value: session.reb },
    { label: 'ast', value: session.ast },
    { label: 'to', value: session.to },
  ];
  /* A session that is not a game carries its own stats: a solo
     shooting hour has no points, rebounds or assists, so filtering
     the game run left one number and the card read as broken. */
  const shown = session.extra ?? stats.filter((s) => s.value > 0);

  return (
    <Card
      radius="card"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cx(styles.card, className)}
    >
      {/* THE TITLE BLOCK, then the stats, 4px apart — one real gap on
          one real flex column, not a margin on either of them. */}
      <div className={styles.top}>
        {/* date and duration are one line: they are both when, and
            they were two rows at opposite ends of the card */}
        <Label>
          {session.date} · {session.duration}
        </Label>
        <Display size="md" as="h3">
          {session.title}
        </Display>
        <StatSet compact stats={shown.map((s) => ({ label: s.label, value: s.value }))} />
      </div>

      {/* The description and the candidate block are ALTERNATIVES,
          not a stack. A card with a pattern candidate already says
          what happened in that block; printing the session note above
          it as well said the same thing twice at two sizes. A card
          without one needs the note, or it is a date and five
          numbers. */}
      {session.candidate ? (
        <Well radius="lg" className={styles.candidate}>
          <Chip tone="lilac">Pattern candidate</Chip>
          <Text variant="bodyStrong">{session.candidate.title}</Text>
          <Text variant="bodySM" tone="tertiary">
            {session.candidate.desc}
          </Text>
        </Well>
      ) : (
        <Text variant="bodySM" tone="secondary">
          {session.note}
        </Text>
      )}
    </Card>
  );
}
