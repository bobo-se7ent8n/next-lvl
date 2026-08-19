import { Display, Text } from '../../components/primitives/Text';
import { WireBox, WireSection, WireSlot } from './wireframe';
import styles from './LandingFuture.module.css';

/** section 10 — tertiary. The hardware, stated as not built. */
export function LandingFuture() {
  return (
    <WireSection
      number="10"
      name="Not built yet"
      weight="tertiary"
      intent="admits what does not exist — the credibility of everything above depends on this being here"
    >
      <div className={styles.stack}>
        <div className={styles.head}>
          <Display size="lg">Not built yet</Display>
          <Text variant="body" tone="secondary">
            The hardware is still ahead of us. This part is honest about that.
          </Text>
        </div>
        <WireBox plain>
          <div className={styles.pair}>
            <WireSlot label="Device box" behaviour="what arrives, if it arrives" ratio="4 / 3" />
            <WireSlot label="Device input" behaviour="how the sensor is worn" ratio="4 / 3" />
          </div>
        </WireBox>
      </div>
    </WireSection>
  );
}
