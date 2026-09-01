import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import { prefersReducedMotion } from '../../lib/enter';
import { ROUTES } from '../../app/routes';
import { ARROW_DOTS, ARROW_SPAN } from './navGeometry';
import { usePageProgress } from './scroll';
import styles from './LandingNav.module.css';

/* the matrix the arrow is drawn on, in SVG user units. The glyph is
   the same object as the dot fields everywhere else in the product —
   one pitch, one dot, no strokes. */
const CELL = 4;
const DOT_R = 1.35;
const GLYPH = ARROW_SPAN * CELL;

/* THE ARC'S OWN GEOMETRY, in its own user units.

   The SVG is drawn on a 100-unit box and scaled to whatever
   `--aera-landing-nav-arc` says, so the stroke widths below come
   from tokens through CSS and the path here is pure proportion. The
   radius leaves room for the widest stroke to sit inside the box
   without being clipped — `overflow: visible` covers the glow, but
   the track should not need it. */
const ARC_BOX = 100;
const ARC_R = 46;
/* `pathLength` normalises the circumference to 1, so a dash array of
   `p (1 - p)` is exactly the fraction of the ring that is drawn and
   no arithmetic has to know what the radius is. */
const ARC_LEN = 1;

export interface LandingNavProps {
  /** the page has scrolled past the last content section: the
   *  indicator reaches full width and the capsule morphs to "To top" */
  atEnd: boolean;
  /** held back while the entry sequence is still running */
  hidden?: boolean;
}

/**
 * THE FLOATING BAR.
 *
 * A window rather than a band: inset from the top and from both
 * sides, cut at the window radius and outlined with the one
 * hairline in the system, so it reads as sitting IN FRONT of the
 * page rather than as the page's own top edge.
 *
 * Three groups — the wordmark, the scroll capsule, and the two ways
 * out. The capsule is a square light pill holding one dot-matrix
 * arrow centred on both axes, and total page scroll is a white arc
 * travelling clockwise from twelve o'clock around the OUTSIDE of
 * it, with a blurred copy underneath so the ring reads as a glow
 * following the button's edge rather than as a hairline drawn on
 * it. Once the page is past its last section the ring closes and
 * the capsule widens into a button that takes you back to the top.
 *
 * THE INDICATOR IS WRITTEN IMPERATIVELY. Scroll progress is a
 * continuous value arriving on every animation frame; putting it
 * through `useState` would re-render the whole bar sixty times a
 * second to change one dash. The damping lives in
 * `usePageProgress`, and only the discrete morph — which happens
 * once each way — is React state.
 */
export function LandingNav({ atEnd, hidden }: LandingNavProps) {
  const run = useRef<SVGCircleElement>(null);
  const glow = useRef<SVGCircleElement>(null);
  /* the loop reads this on every frame and it must not resubscribe
     it, so it is mirrored into a ref — from an effect, never during
     render */
  const endRef = useRef(atEnd);
  useEffect(() => {
    endRef.current = atEnd;
  }, [atEnd]);

  usePageProgress(
    useCallback((raw: number) => {
      /* past the last section the bar is full whatever the wheel
         says — the morph and a three-quarters-grown indicator would
         be two different claims about the same thing */
      const p = endRef.current ? 1 : raw;
      /* a dash of `p` followed by a gap of the rest: with
         `pathLength = 1` that is exactly the fraction of the ring
         drawn, whatever the radius happens to be */
      const dash = `${p.toFixed(4)} ${(ARC_LEN - p).toFixed(4)}`;
      run.current?.setAttribute('stroke-dasharray', dash);
      glow.current?.setAttribute('stroke-dasharray', dash);
    }, []),
  );

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <nav
      aria-label="Landing"
      className={cx(styles.nav, hidden && styles.navHidden)}
      /* the bar is inert while the entry sequence is still playing */
      aria-hidden={hidden ? true : undefined}
    >
      <div className={styles.bar}>
        <Link to={ROUTES.landing} className={styles.brand}>
          <Label tone="inherit">AERA</Label>
        </Link>

        <div className={styles.centre}>
          <button
            type="button"
            onClick={toTop}
            tabIndex={atEnd ? undefined : -1}
            aria-label={atEnd ? 'Back to top' : undefined}
            aria-hidden={atEnd ? undefined : true}
            className={cx(styles.capsule, atEnd && styles.capsuleWide)}
          >
            {/* THE PROGRESS RING, around the outside of the button.
                It is concentric with the capsule and pinned to the
                capsule's centre, so when the capsule widens into
                "To top" the ring stays a circle rather than being
                stretched into an ellipse with it. */}
            <svg
              className={styles.arc}
              viewBox={`0 0 ${ARC_BOX} ${ARC_BOX}`}
              aria-hidden="true"
            >
              <circle className={styles.arcTrack} cx={ARC_BOX / 2} cy={ARC_BOX / 2} r={ARC_R} />
              <circle
                ref={glow}
                className={styles.arcGlow}
                cx={ARC_BOX / 2}
                cy={ARC_BOX / 2}
                r={ARC_R}
                pathLength={ARC_LEN}
                strokeDasharray={`0 ${ARC_LEN}`}
              />
              <circle
                ref={run}
                className={styles.arcRun}
                cx={ARC_BOX / 2}
                cy={ARC_BOX / 2}
                r={ARC_R}
                pathLength={ARC_LEN}
                strokeDasharray={`0 ${ARC_LEN}`}
              />
            </svg>

            {/* the dot-matrix arrow, centred on both axes of a square
                capsule — the same illustration language as every
                graphic in the app, at glyph size */}
            <svg className={styles.glyph} viewBox={`0 0 ${GLYPH} ${GLYPH}`} aria-hidden="true">
              {ARROW_DOTS.map((dot) => (
                <circle
                  key={`${dot.col}-${dot.row}`}
                  cx={dot.col * CELL + CELL / 2}
                  cy={dot.row * CELL + CELL / 2}
                  r={DOT_R}
                />
              ))}
            </svg>

            <span className={styles.toTop}>
              <Label tone="inherit">To top</Label>
            </span>
          </button>
        </div>

        <div className={styles.actions}>
          <Link to={ROUTES.home} className={styles.action}>
            <Label tone="inherit">/app</Label>
          </Link>
          <Link to={ROUTES.storybook} className={styles.action}>
            <Label tone="inherit">/storybook</Label>
          </Link>
        </div>
      </div>
    </nav>
  );
}
