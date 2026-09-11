import {
  LandingClosure,
  LandingHero,
  LandingInsights,
  LandingNav,
  LandingPicture,
  LandingGame,
} from '../features/landing';
import styles from './Landing.module.css';

/**
 * THE PUBLIC PAGE.
 *
 * The bar, and then four sections: the poster the whole argument is
 * on — which does not end where the window does: its product shot
 * pins and the page scrolls on through the three things the
 * sentence named — then the insights scene, the full picture (a
 * deck that turns its front card on the hero's clock), a game that
 * knows you, and the line to leave with. "Not built yet" is off the
 * page too; its file is still here. Patterns, Sessions and the
 * Scoreboard are off the page; their files are still here.
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
        <LandingInsights />
        <LandingPicture />
        <LandingGame />
        <LandingClosure />
      </div>
    </div>
  );
}
