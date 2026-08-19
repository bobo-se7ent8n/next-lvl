import { Link } from 'react-router-dom';
import { Display, Label } from '../../components/primitives/Text';
import { ROUTES } from '../../app/routes';
import { WireSection } from './wireframe';
import styles from './LandingClosure.module.css';

/** section 11 — primary weight. One line, alone, and then the one
 *  quiet link out to the component browser. Nothing else follows. */
export function LandingClosure() {
  return (
    <WireSection
      number="11"
      name="Closure"
      weight="primary"
      intent="the line the visitor leaves with — it is the argument compressed to five words"
    >
      <Display size="xl" as="p" className={styles.line}>
        Built to be outgrown.
      </Display>

      <div className={styles.footer}>
        <Link to={ROUTES.storybook} className={styles.link}>
          <Label tone="inherit">The design system → /storybook</Label>
        </Link>
      </div>
    </WireSection>
  );
}
