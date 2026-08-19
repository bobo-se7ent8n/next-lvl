import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Card } from '../components/primitives/Card';
import { Display, Text } from '../components/primitives/Text';
import { StatSet } from '../components/primitives/StatRow';
import { MotionStage } from '../features/sessions/MotionStage';
import { SessionTimeline } from '../features/sessions/SessionTimeline';
import { SessionInsights } from '../features/sessions/SessionInsights';
import { MOMENTS, SESSIONS } from '../data';
import { ROUTES } from '../app/routes';
import styles from './SessionDetailScreen.module.css';

/** One session, opened at /app/sessions/:id. The heading, the
 *  description under it and the session stats come first; then the
 *  stage, which plays the moment as real motion in the dot language;
 *  then the timeline, where a moment becomes evidence for a pattern. */
export function SessionDetailScreen() {
  const { id } = useParams();
  const session = SESSIONS.find((s) => s.id === id);
  const [index, setIndex] = useState(0);
  const [playhead, setPlayhead] = useState(0);

  if (!session) return <Navigate to={ROUTES.sessions} replace />;

  const moment = MOMENTS[index];

  const goto = (next: number) => {
    setIndex(next);
    setPlayhead(0);
  };

  return (
    <section className={styles.screen}>
      {/* Three type tokens and no more: the title, one body line, and
          the stat row. The description and the meta used to be two
          rows in two different voices — a body line and a mono line —
          which read as two separate facts about the same session. */}
      <header className={styles.head}>
        <Display size="lg" as="h1">
          {session.title}
        </Display>

        <Text variant="body" tone="secondary" className={styles.note}>
          {session.note} · {session.date} · {session.duration}
        </Text>

        {/* the session's own numbers, at the top where they frame
            everything below rather than at the foot of the page */}
        <StatSet
          className={styles.stats}
          stats={[
            { label: 'shots', value: session.shots },
            { label: 'pts', value: session.pts },
            { label: 'reb', value: session.reb },
            { label: 'ast', value: session.ast },
          ].filter((s, i) => i === 0 || s.value > 0)}
        />
      </header>

      {/* ONE BLOCK. The picture, the transport and the timeline are
          three rows of a single card: one time model has to look like
          one object, and two elevated cards with a gap between them
          read as two independent widgets. */}
      <Card radius="card" padding="10" className={styles.timeBlock}>
        <MotionStage
          moments={MOMENTS}
          index={index}
          onMoment={goto}
          playhead={playhead}
          onPlayhead={setPlayhead}
        />

        <SessionTimeline moment={moment} playhead={playhead} onScrub={setPlayhead} />
      </Card>

      <SessionInsights insights={moment.insights} playhead={playhead} />
    </section>
  );
}
