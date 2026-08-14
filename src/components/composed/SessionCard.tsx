import { cx } from '../../lib/css';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { StatSet } from '../primitives/StatRow';
import { Display, Label, Text } from '../primitives/Text';
import type { Session } from '../../data/types';
import styles from './SessionCard.module.css';

export interface SessionCardProps {
  session: Session;
  onClick?: () => void;
  className?: string;
}

/** one recorded session — date, title, duration, the stat run, and the
 *  pattern candidate block when the session produced one */
export function SessionCard({ session, onClick, className }: SessionCardProps) {
  const stats: Array<{ label: string; value: number }> = [
    { label: 'shots', value: session.shots },
    { label: 'pts', value: session.pts },
    { label: 'reb', value: session.reb },
    { label: 'ast', value: session.ast },
    { label: 'to', value: session.to },
    { label: 'stl', value: session.stl },
  ];
  /* a solo shooting hour has no assists — show only what was recorded */
  const shown = stats.filter((s, i) => i === 0 || s.value > 0);

  return (
    <Card
      radius="panel"
      elevation="low"
      padding="10"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cx(styles.card, className)}
    >
      <div className={styles.top}>
        <Label className={styles.date}>{session.date}</Label>
        <Display size="md" as="h3">
          {session.title}
        </Display>
        <span className={styles.right}>
          {session.tag ? <Chip tone="mint">{session.tag}</Chip> : null}
          <Text as="span" variant="bodySM" tone="secondary" numeric>
            {session.duration}
          </Text>
          <span className={styles.arrow} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </span>
        </span>
      </div>

      <StatSet className={styles.stats} stats={shown.map((s) => ({ label: s.label, value: s.value }))} />

      <Text variant="bodySM" tone="tertiary" className={styles.note}>
        {session.note}
      </Text>

      {session.candidate ? (
        <div className={styles.candidate}>
          <Chip tone="lilac">Pattern candidate</Chip>
          <Text variant="body" style={{ fontWeight: 'var(--aera-weight-semibold)' }}>
            {session.candidate.title}
          </Text>
          <Text variant="bodySM" tone="tertiary">
            {session.candidate.desc}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}
