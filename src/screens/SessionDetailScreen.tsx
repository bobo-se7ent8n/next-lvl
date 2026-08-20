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
  /* the playhead opens ON the first tracked insight rather than at
     zero: parked at the far left it read as "not started" and the
     block below it had nothing to show */
  const [playhead, setPlayhead] = useState(() => MOMENTS[0].insights[0]?.at ?? 0.35);
  const [playing, setPlaying] = useState(false);

  if (!session) return <Navigate to={ROUTES.sessions} replace />;

  const moment = MOMENTS[index];

  const goto = (next: number) => {
    setIndex(next);
    setPlayhead(MOMENTS[next].insights[0]?.at ?? 0);
  };

  return (
    <section className={styles.screen}>
      {/* ONE ROW: title, stats, description. They were three stacked
          rows in three different sizes, which made the session's own
          numbers — the thing the page is about — the smallest type on
          it. Reading left to right now: what it was, what happened,
          what it was like. */}
      <header className={styles.head}>
        <Display size="lg" as="h1" className={styles.title}>
          {session.title}
        </Display>

        <StatSet
          className={styles.stats}
          stats={[
            { label: 'shots', value: session.shots },
            { label: 'pts', value: session.pts },
            { label: 'reb', value: session.reb },
            { label: 'ast', value: session.ast },
          ].filter((s, i) => i === 0 || s.value > 0)}
        />

        <Text variant="body" tone="secondary" className={styles.note}>
          {session.note}
        </Text>
      </header>

      {/* ONE BLOCK. The picture, the transport and the timeline are
          three rows of a single card: one time model has to look like
          one object, and two elevated cards with a gap between them
          read as two independent widgets. */}
      <Card radius="card" className={styles.timeBlock}>
        <MotionStage
          moments={MOMENTS}
          index={index}
          onMoment={goto}
          playhead={playhead}
          onPlayhead={setPlayhead}
        />

        <SessionTimeline
          moment={moment}
          playhead={playhead}
          onScrub={setPlayhead}
          playing={playing}
          onPlay={() => setPlaying((p) => !p)}
        />

        {/* the block hangs off the chip the playhead is standing on,
            inside the same card, so the notch has something to point
            at */}
        <SessionInsights insights={moment.insights} playhead={playhead} />
      </Card>
    </section>
  );
}
