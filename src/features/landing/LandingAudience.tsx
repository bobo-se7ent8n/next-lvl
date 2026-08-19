import { Display, Text } from '../../components/primitives/Text';
import { WireBox, WireSection } from './wireframe';
import styles from './LandingAudience.module.css';

/** section 03 — a centred two-line statement, capped at the measure */
export function LandingAudience() {
  return (
    <WireSection
      number="03"
      name="Who it's for"
      intent="self-selection by temperament — the visitor decides whether this is for them, and we make it easy to say no"
    >
      <div className={styles.stack}>
        <Display size="lg" className={styles.heading}>
          Who it&rsquo;s for
        </Display>

        <WireBox className={styles.statement}>
          <Text variant="body" tone="primary">
            For players who&rsquo;d rather understand than be ranked.
          </Text>
          <Text variant="body" tone="secondary">
            Not for anyone chasing a number on a board.
          </Text>
        </WireBox>
      </div>
    </WireSection>
  );
}
