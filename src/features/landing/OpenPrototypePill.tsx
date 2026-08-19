import { Link } from 'react-router-dom';
import { Label } from '../../components/primitives/Text';
import { ROUTES } from '../../app/routes';
import { cx } from '../../lib/css';
import styles from './OpenPrototypePill.module.css';

export interface OpenPrototypePillProps {
  /** shown from the moment section 04 is reached, then stays */
  visible?: boolean;
  className?: string;
}

/** the landing page's only persistent element — bottom right, into the
 *  prototype, with the browser as a quiet second option beside it */
export function OpenPrototypePill({ visible = true, className }: OpenPrototypePillProps) {
  return (
    <div
      className={cx(styles.dock, visible && styles.on, className)}
      aria-hidden={visible ? undefined : true}
    >
      <Link to={ROUTES.storybook} className={styles.secondary} tabIndex={visible ? undefined : -1}>
        <Label tone="inherit">Storybook</Label>
      </Link>
      <Link to={ROUTES.home} className={styles.pill} tabIndex={visible ? undefined : -1}>
        <Label tone="inherit">Open prototype</Label>
      </Link>
    </div>
  );
}
