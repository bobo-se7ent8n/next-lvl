import { Display, Text } from '../../components/primitives/Text';
import { WireBox, WireSection } from './wireframe';
import styles from './LandingPrinciples.module.css';

const PRINCIPLES = [
  'No leaderboards.',
  'Behavioral data stays private.',
  'Patterns surface only when they repeat.',
  'Nothing you have to keep up with.',
];

/** section 09 — tertiary. Four flat statement lines. */
export function LandingPrinciples() {
  return (
    <WireSection
      number="09"
      name="Principles"
      weight="tertiary"
      intent="the commitments, stated flat so they can be held against us later"
    >
      <div className={styles.stack}>
        <Display size="lg">Principles</Display>
        <WireBox plain>
          <div className={styles.lines}>
            {PRINCIPLES.map((line) => (
              <Text key={line} variant="body" tone="primary">
                {line}
              </Text>
            ))}
          </div>
        </WireBox>
      </div>
    </WireSection>
  );
}
