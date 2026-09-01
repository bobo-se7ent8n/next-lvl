import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LandingClosure,
  LandingFuture,
  LandingHero,
  LandingInsights,
  LandingNav,
  LandingPatterns,
  LandingScoreboard,
  LandingSessions,
  LandingWorking,
  LoadingScreen,
  TagField,
} from '../features/landing';
import { entryPlayed } from '../features/landing/entryState';
import styles from './Landing.module.css';

/**
 * THE PUBLIC PAGE.
 *
 * It opens on a dark state that holds two lines on a white card,
 * then the card fills the window and the page is underneath it.
 * From there it is seven sections: the claim, the product running
 * in a window, the pattern hand, the two scroll-driven ones that pin
 * and play, the board, what does not exist yet, and the line to
 * leave with. Each of them is a scroll-snap point.
 *
 * The page owns two pieces of state and no more. Whether the entry
 * has finished — which is what unlocks the scroll and brings the
 * bar in — and whether the reader is past the last content section,
 * which is what morphs the bar's capsule into "To top". Everything
 * continuous belongs to the sections themselves and never reaches
 * here: a scroll position that re-rendered this component would
 * re-render every section on the page with it.
 */
export function Landing() {
  const [entered, setEntered] = useState(entryPlayed);
  const [atEnd, setAtEnd] = useState(false);
  const tail = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => setEntered(true), []);

  /* THE SNAP LIVES ON THE DOCUMENT, SO THE PAGE HAS TO PUT IT THERE.

     The scroll container for this page is the document itself —
     `.page` clips one axis and scrolls neither — so the snap type
     belongs on the root element. It must not survive a navigation
     into `/app`, where the screens are ordinary scrolling documents,
     so it is a class this component owns for exactly as long as it
     is mounted. See the note in global.css. */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('aera-snap');
    return () => root.classList.remove('aera-snap');
  }, []);

  /* PAST THE LAST CONTENT SECTION.

     A sentinel at the foot of "Not built yet" rather than a scroll
     threshold: the page's height changes with the window, and a
     number tuned at one height is wrong at every other.

     THE TEST IS "NOT INTERSECTING, AND ABOVE", and both halves are
     load-bearing. An observer only calls back when the target
     crosses the root's edge, so a test written against a fraction of
     the window — `top <= innerHeight / 2`, say — is never evaluated
     at the moment it changes answer: it is read at the top edge on
     the way out and at the top edge again on the way back in, where
     it gives the same answer both times. The capsule would morph on
     the way down and then refuse to morph back until the sentinel
     had travelled a whole viewport. Testing the SIDE the sentinel
     left on makes the two crossings the same crossing, so the morph
     is symmetrical by construction. */
  useEffect(() => {
    const el = tail.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAtEnd(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.landing}>
      {/* THE TAGS THE ENTRY LEFT STANDING, and they hang off
          the page rather than off the hero on purpose: their
          coordinates are fractions of the WINDOW, and this is the
          only box on the page whose padding box IS the window. They
          are drawn at exactly the coordinates the overlay moved them
          to, so when it unmounts nothing appears and nothing moves. */}
      <TagField />

      <LandingNav atEnd={atEnd} hidden={!entered} />

      <div className={styles.sections}>
        <LandingHero />
        <LandingWorking />
        <LandingPatterns />
        <LandingSessions />
        <LandingScoreboard />
        <LandingInsights />
        <LandingFuture />
        {/* the line the capsule's morph is triggered by */}
        <div ref={tail} className={styles.tail} aria-hidden="true" />
        <LandingClosure />
      </div>

      {entered ? null : <LoadingScreen onDone={finish} />}
    </div>
  );
}
