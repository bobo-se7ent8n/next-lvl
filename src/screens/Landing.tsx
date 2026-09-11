import {
  LandingClosure,
  LandingFuture,
  LandingHero,
  LandingInsights,
  LandingNav,
  LandingPatterns,
  LandingScoreboard,
  LandingSessions,
} from '../features/landing';
import styles from './Landing.module.css';

/**
 * THE PUBLIC PAGE.
 *
 * The bar, and then the sections: the poster the whole argument is
 * on — which does not end where the window does: its product shot
 * pins and the page scrolls on through the three things the
 * sentence named — then the pattern hand, the two scroll-driven
 * ones that pin and play, the board, what does not exist yet, and
 * the line to leave with. "See it working" is gone from the run:
 * the handoff is the product in a window now, and says more.
 *
 * IT OPENS ON THE PAGE ITSELF. There used to be a dark state in
 * front of all of this holding two lines on a white card, which
 * then filled the window and handed over to the hero underneath.
 * The hero has its own opening now — the sentence, the button, the
 * shot, then the field around it — and two openings in a row is one
 * too many: the first thing a visitor should see is the claim, not
 * a card telling them the claim is coming. `LoadingScreen` and the
 * word-tag field it scattered are still in the codebase and still
 * work; nothing on this page renders them.
 *
 * The page scrolls natively past all of it: no snapping, no wheel
 * handler, and nothing here moves the scroll position — the
 * sections only ever READ it.
 *
 * The page owns no state at all any more.
 */
export function Landing() {
  return (
    <div className={styles.landing}>
      <LandingNav />

      <div className={styles.sections}>
        <LandingHero />
        <LandingPatterns />
        <LandingSessions />
        <LandingScoreboard />
        <LandingInsights />
        <LandingFuture />
        <LandingClosure />
      </div>
    </div>
  );
}
