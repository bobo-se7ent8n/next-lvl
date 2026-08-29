import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { Counted } from '../primitives/Metric';
import { Well } from '../primitives/Surface';
import { StatSet } from '../primitives/StatRow';
import { Display, Label, Text } from '../primitives/Text';
import { duration as durationToken } from '../../tokens';
import type { Session } from '../../data/types';
import styles from './SessionCard.module.css';

export interface SessionCardProps {
  session: Session;
  /** the row's place in the log — one stagger step per row, so the
   *  list arrives in reading order rather than all at once */
  index?: number;
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
export function SessionCard({ session, index = 0, onClick, className }: SessionCardProps) {
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
      style={
        {
          '--enter-delay': `calc(var(--aera-duration-stagger) * ${index})`,
        } as CSSProperties
      }
    >
      {/* THE TITLE BLOCK, then the stats, 4px apart — one real gap on
          one real flex column, not a margin on either of them. */}
      <div className={styles.top}>
        {/* date and duration are one line: they are both when, and
            they were two rows at opposite ends of the card */}
        {/* THE DURATION IS A READING, so it counts like every other
            number on the screen. It is split out of the line rather
            than counted inside it because `Counted` needs the target
            string on its own — and it keeps the unit: "62 min" counts
            to "62 min", never to "62". */}
        <Label>
          {session.date} ·{' '}
          <Counted value={session.duration} over={durationToken.countQuick} />
        </Label>
        <Display size="md" as="h3">
          {session.title}
        </Display>
        {/* NOT `compact`. The compact form is `metricSM` (16px) and
            the same readings on the Scoreboard are `metricMD` (22px)
            — the session card is where you actually read them, so it
            had the smaller of the two sizes for no reason. */}
        <StatSet stats={shown.map((s) => ({ label: s.label, value: s.value }))} />
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
