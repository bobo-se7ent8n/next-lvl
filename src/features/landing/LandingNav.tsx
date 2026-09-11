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
 * THE TOOL LINK CHANGES FACE UNDER THE POINTER. It opens the dot
 * matrix tool, so on hover its fill steps down and its label is set
 * in the pixel face — the label becomes the thing it opens. Both
 * labels are rendered, stacked in one grid cell, so the pill is the
 * width of the wider of the two at rest and NOTHING about the hover
 * changes the layout: only opacity and a fill, which is what this
 * page is allowed to animate.
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
        <img className={styles.mark} src="/hero/mark.png" alt="" width={20} height={11} />
        <span className={styles.word}>Aera</span>
      </Link>

      <div className={styles.links}>
        <Link to={ROUTES.home} className={styles.pill}>
          App
        </Link>
        <Link to={ROUTES.storybook} className={styles.pill}>
          Storybook
        </Link>

        {/* the label is in the DOM twice — once per face — so the
            name is given here and both copies are hidden from the
            tree, rather than letting it be read out twice */}
        <a
          href={DOT_MATRIX}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dot matrix tool (opens in a new tab)"
          className={cx(styles.pill, styles.tool)}
        >
          {/* one cell, two labels: the pill cannot change width */}
          <span className={styles.toolRest} aria-hidden="true">
            Dot matrix tool
          </span>
          <span className={styles.toolHover} aria-hidden="true">
            Dot matrix tool
          </span>
        </a>
      </div>
    </nav>
  );
}
