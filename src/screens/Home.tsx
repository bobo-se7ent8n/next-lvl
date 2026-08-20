import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp } from '../lib/chart';
import { maxPosition } from '../features/patterns/fanGeometry';
import { PageHeader, type HeaderView } from '../components/chrome/PageHeader';
import { PatternFan } from '../features/patterns/PatternFan';
import { FocusPanel } from '../features/home/FocusPanel';
import { VitalCard } from '../features/home/VitalCard';
import { EnterContext } from '../lib/enterContext';
import { PATTERNS, VITALS } from '../data';
import styles from './Home.module.css';

/** wheel px that advance the hand by one card */
const WHEEL_PER_CARD = 170;

const VIEWS: HeaderView[] = [
  {
    id: 'patterns',
    title: 'Patterns',
    subhead:
      'A pattern is a behaviour your sessions keep repeating. Twelve of them are holding right now.',
  },
  {
    id: 'vitals',
    title: 'Focus & vitals',
    subhead: 'One thing worth attention this week, and the body readings underneath it.',
  },
];

/**
 * HOME — two views, switched by the headings themselves.
 *
 * They used to be two stages of one very long scroll, which meant the
 * second one could only be reached by exhausting the first: you had to
 * scroll through all twelve pattern cards to see your vitals. They are
 * two views of the same screen, not two chapters, so they are switched
 * rather than travelled through — and the heading is the control,
 * because a tab strip above a headline would be a second navigation
 * bar on a screen that already has one.
 *
 * Switching re-scopes the enter key, so every number and graph in the
 * arriving view recalculates exactly as it does on a tab change.
 */
export function Home() {
  const [view, setView] = useState('patterns');
  /* the hand is anchored left, so it opens on the first card of the
     set and the window runs rightward from there */
  const [position, setPosition] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const positionRef = useRef(0);
  const openRef = useRef<number | null>(null);
  const viewRef = useRef(view);

  useEffect(() => {
    positionRef.current = position;
    openRef.current = openIndex;
    viewRef.current = view;
  }, [position, openIndex, view]);

  /* the last window start that still fills all five slots — past it
     the hand would run out of cards and leave a hole on the right */
  const max = maxPosition(PATTERNS.length);

  /* The wheel drives the hand while Patterns is up. It no longer has a
     release at the end of the set: there is nothing below to release
     into, so the hand simply stops at the last card. */
  const consume = useCallback(
    (delta: number) => {
      if (viewRef.current !== 'patterns') return false;
      if (openRef.current != null) return true;

      const next = clamp(positionRef.current + delta / WHEEL_PER_CARD, 0, max);
      if (next === positionRef.current) return false;
      setPosition(next);
      return true;
    },
    [max],
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta =
        e.deltaMode === 1
          ? e.deltaY * 16
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY;
      if (consume(delta)) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [consume]);

  useEffect(() => {
    let last: number | null = null;
    const onStart = (e: TouchEvent) => {
      last = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (last == null) return;
      const y = e.touches[0].clientY;
      const delta = (last - y) * 1.4;
      last = y;
      if (consume(delta)) e.preventDefault();
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
  }, [consume]);

  return (
    <section className={styles.screen}>
      <PageHeader views={VIEWS} activeView={view} onView={setView} />

      {/* keyed on the view so the arriving one settles in, and scoped
          on it so its numbers and graphs recalculate — the same
          treatment a tab change gets, because this is one */}
      <div key={view} className={styles.view}>
        <EnterContext.Provider value={view}>
          {view === 'patterns' ? (
            <PatternFan
              className={styles.fan}
              patterns={PATTERNS}
              position={position}
              onPosition={(p) => setPosition(clamp(p, 0, max))}
              openIndex={openIndex}
              onOpen={setOpenIndex}
            />
          ) : (
            <div className={styles.grid}>
              <FocusPanel />
              <div className={styles.vitals}>
                {VITALS.map((vital) => (
                  <VitalCard key={vital.id} vital={vital} />
                ))}
              </div>
            </div>
          )}
        </EnterContext.Provider>
      </div>
    </section>
  );
}
