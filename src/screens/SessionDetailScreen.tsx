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

/** How close to a marker counts as standing on it. Playback stops
 *  the first time it enters this window, and the playhead is parked
 *  exactly on the marker when it does. */
const STOP_WINDOW = 0.012;

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

  /* WHICH MARKER PLAYBACK IS CURRENTLY PARKED ON.
   *
   *  THIS IS THE FIX FOR THE FIVE-CLICK PLAY BUTTON, and it is worth
   *  spelling out because the symptom pointed nowhere near the cause.
   *
   *  Auto-pausing parks the playhead EXACTLY on the marker it stopped
   *  at. Pressing play then advanced it by one frame — a couple of
   *  thousandths — which is still inside the stop window, so the very
   *  next frame matched the same marker again and stopped playback a
   *  second time. Nothing was racing and no handler was firing twice:
   *  the run really was starting and really was being stopped, once
   *  per click, and it took about five clicks to inch far enough past
   *  the marker for the test to stop matching. What made it read as a
   *  toggle bug is that a click bought roughly three milliseconds of
   *  playback, which is invisible.
   *
   *  So the stop is now an EDGE, not a level: a marker fires once on
   *  entry, and cannot fire again until the playhead has left its
   *  window. Pressing play while parked on one arms it as already
   *  fired, so resuming carries straight through it to the next. */
  const standing = useRef<string | null>(null);

  /** the marker the playhead is inside the window of, if any */
  const markerAt = useCallback(
    (t: number) => MOMENTS[index].insights.find((ins) => Math.abs(t - ins.at) < STOP_WINDOW),
    [index],
  );

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
      const hit = markerAt(t);
      /* out in the clear: whatever was armed is behind us now */
      if (!hit) {
        standing.current = null;
        return;
      }
      /* the marker we are already parked on, or one we are still
         approaching from the left — neither is a crossing */
      if (standing.current === hit.id || t < hit.at) return;

      standing.current = hit.id;
      setPlaying(false);
      setPlayhead(hit.at);
    },
    [markerAt],
  );

  /* Stopping is state React already owns. Starting has to arm the
     marker underneath the playhead first, or the first frame of the
     new run would read it as a fresh crossing — which is the same
     bug arriving by a different route, after a scrub onto a tag. */
  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
      return;
    }
    standing.current = markerAt(headRef.current)?.id ?? null;
    setPlaying(true);
  }, [playing, markerAt]);

  /* stable, so a re-render of this screen cannot restart the stage's
     playback loop out from under itself */
  const stop = useCallback(() => setPlaying(false), []);

  if (!session) return <Navigate to={ROUTES.sessions} replace />;

  const moment = MOMENTS[index];

  const goto = (next: number) => {
    setIndex(next);
    setPlayhead(0);
    headRef.current = 0;
    standing.current = null;
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
          onStop={stop}
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
            /* SEEKING STOPS PLAYBACK. Dropping the playhead somewhere
               and having the picture carry on from where it already
               was makes the timeline feel like it is arguing with
               you — the prototype stops on every seek, and so do we. */
            setPlaying(false);
            headRef.current = next;
            setPlayhead(next);
            /* a scrub is a new place to be standing; the next press of
               play re-reads it rather than trusting where we were */
            standing.current = null;
          }}
          playing={playing}
          onPlay={togglePlay}
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
