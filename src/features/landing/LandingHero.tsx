import { Display, Text } from '../../components/primitives/Text';
import { WireBox, WireSection, WireSlot } from './wireframe';
import styles from './LandingHero.module.css';

/** section 01 — primary weight. The first claim, and the only one on
 *  the page that gets the full display size. */
export function LandingHero() {
  return (
    <WireSection
      number="01"
      name="Hero"
      weight="primary"
      intent="the one claim the whole page rests on — a visitor who reads nothing else should read this"
    >
      <div className={styles.grid}>
        <div className={styles.left}>
          <WireBox plain>
            <Display size="xl" as="h1">
              Your jump shot knows something about you.
            </Display>
          </WireBox>
          <WireBox>
            <Text variant="body" tone="secondary">
              Body sensors, a smart basketball, and an app that reads the patterns underneath your
              game.
            </Text>
          </WireBox>
        </div>
        <WireSlot
          className={styles.slot}
          label="Ambient visual / TBD"
          behaviour="sets the register before a word is read — quiet, never a demo"
          ratio="3 / 4"
        />
      </div>
    </WireSection>
  );
}
