import { useCallback, useRef, useState } from 'react';
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
  /* the session opens at the beginning, playhead hard left */
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  /* the live time, so a running playback never re-renders the tree */
  const headRef = useRef(0);
  const tools = useRef<HTMLDivElement>(null);

  /* Every frame writes the playhead straight into a CSS variable on
     the tools block. The line and its handle read that variable, so
     they track the canvas at refresh rate without React doing any
     work at all. */
  const onFrame = useCallback(
    (t: number) => {
      headRef.current = t;
      tools.current?.style.setProperty('--head', `${(t * 100).toFixed(3)}%`);

      /* PLAYBACK STOPS ITSELF ON AN INSIGHT. Crossing a marker is the
         one thing during a run that has to reach React, because the
         tag goes active and its bubble opens. */
      const hit = MOMENTS[index].insights.find(
        (ins) => t >= ins.at && headRef.current >= ins.at && Math.abs(t - ins.at) < 0.012,
      );
      if (hit) {
        setPlaying(false);
        setPlayhead(hit.at);
      }
    },
    [index],
  );

  if (!session) return <Navigate to={ROUTES.sessions} replace />;

  const moment = MOMENTS[index];

  const goto = (next: number) => {
    setIndex(next);
    setPlayhead(0);
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
      {/* THE CANVAS IS FULL-BLEED — no frame around it, no border on
          the page container. The tools below get the bordered box. */}
      <div className={styles.stageWrap}>
        <MotionStage
          moments={MOMENTS}
          index={index}
          onMoment={goto}
          playhead={playhead}
          onPlayhead={setPlayhead}
          playing={playing}
          onStop={() => setPlaying(false)}
          onFrame={onFrame}
        />

      </div>

      {/* THE TOOLS BLOCK — ruler, four tracks and the insight bubble,
          all inside one bordered container. */}
      <div ref={tools} className={styles.toolsFrame}>
        <Card radius="card" className={styles.tools}>
        <SessionTimeline
          moment={moment}
          playhead={playhead}
          onScrub={(next) => {
            headRef.current = next;
            setPlayhead(next);
          }}
          playing={playing}
          onPlay={() => setPlaying((p) => !p)}
        />

        {/* the block hangs off the chip the playhead is standing on,
            inside the same card, so the notch has something to point
            at */}
          <SessionInsights insights={moment.insights} playhead={playhead} />
        </Card>
      </div>
    </section>
  );
}
