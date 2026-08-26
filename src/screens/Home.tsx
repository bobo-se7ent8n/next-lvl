import { useState } from 'react';
import { PageHeader, type HeaderView } from '../components/chrome/PageHeader';
import { PatternFan } from '../features/patterns/PatternFan';
import { FocusPanel } from '../features/home/FocusPanel';
import { VitalCard } from '../features/home/VitalCard';
import { EnterContext } from '../lib/enterContext';
import { PATTERNS, VITALS } from '../data';
import styles from './Home.module.css';

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
  /* THE HAND OWNS ITS OWN POSITION.
   *
   *  This screen used to hold it in React state and drive it from a
   *  wheel handler up here, which meant every notch of the wheel
   *  re-rendered Home, the fan, twelve cards and everything inside
   *  them. The hand is a float in a ref inside PatternFan now, eased
   *  toward its target by a rAF loop that writes custom properties
   *  straight onto the slots — so scrolling the fan re-renders
   *  nothing at all, and there is no position to thread through here.
   *
   *  Which card is OPEN is still React's business: that changes when
   *  someone clicks, not sixty times a second. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
