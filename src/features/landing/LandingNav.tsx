import { Link } from 'react-router-dom';
import { cx } from '../../lib/css';
import { ROUTES } from '../../app/routes';
import styles from './LandingNav.module.css';

/**
 * THE BAR.
 *
 * A wordmark on the left, three pills on the right, and nothing
 * drawn behind either group — the page's own paper runs under it,
 * so what floats over the page is the GROUP rather than a band.
 *
 * IT NO LONGER CARRIES THE SCROLL. It used to hold a capsule in the
 * middle with total page progress traced around it as an arc, which
 * morphed into "To top" past the last section. The design does not
 * have it, and the two ideas were arguing: a bar that reports where
 * you are in a document belongs to a document, and this page is a
 * poster with sections under it. The wordmark is still a link to
 * the top of the page, which is the part of that behaviour worth
 * keeping.
 *
 * The tool link is the one that leaves the product, so under the
 * pointer its fill steps a shade darker than the other two. Its type
 * does not change: a hover that swaps the face is a hover that moves
 * the word.
 */
/* the tool lives on its own deployment, so this is a plain link out
   and it opens beside the page rather than replacing it */
const DOT_MATRIX = 'https://render-engine-tool.vercel.app/';

export function LandingNav() {
  return (
    <nav aria-label="Landing" className={styles.nav}>
      {/* named explicitly: the mark is decorative and the wordmark is
          a styled span, so the name is stated rather than inferred */}
      <Link to={ROUTES.landing} aria-label="Aera — to the top" className={styles.brand}>
        <img className={styles.mark} src="/hero/mark.png" alt="" width={36} height={22} />
        <span className={styles.word}>Aera</span>
      </Link>

      <div className={styles.links}>
        <Link to={ROUTES.home} className={styles.pill}>
          App
        </Link>
        <Link to={ROUTES.storybook} className={styles.pill}>
          Storybook
        </Link>

        {/* a link out: the tool is its own deployment */}
        <a
          href={DOT_MATRIX}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dot matrix tool (opens in a new tab)"
          className={cx(styles.pill, styles.tool)}
        >
          Dot matrix tool
        </a>
      </div>
    </nav>
  );
}
