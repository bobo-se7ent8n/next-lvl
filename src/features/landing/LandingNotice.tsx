import { Display, Text } from '../../components/primitives/Text';
import { WireBox, WireSection } from './wireframe';
import styles from './LandingNotice.module.css';

const ROWS = [
  {
    heading: 'Mechanics under load',
    body: 'Release timing, footwork, and follow-through as fatigue and pressure build.',
  },
  {
    heading: 'Session rhythm',
    body: 'How you recover between possessions, and when your pace starts to slip.',
  },
  {
    heading: 'Patterns that echo',
    body: 'The tendencies that show up on the court and everywhere else.',
  },
];

/** section 02 — three stacked rows, one heading line and one body line */
export function LandingNotice() {
  return (
    <WireSection
      number="02"
      name="What you'll notice"
      intent="turns the claim into three concrete things — this is where a sceptic decides whether it is real"
    >
      <div className={styles.stack}>
        <Display size="lg">What you&rsquo;ll notice</Display>

        <div className={styles.rows}>
          {ROWS.map((row) => (
            <WireBox key={row.heading}>
              <div className={styles.row}>
                <Display size="md" as="h3">
                  {row.heading}
                </Display>
                <Text variant="body" tone="secondary">
                  {row.body}
                </Text>
              </div>
            </WireBox>
          ))}
        </div>
      </div>
    </WireSection>
  );
}
