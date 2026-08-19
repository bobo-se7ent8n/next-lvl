import { Display, Text } from '../../components/primitives/Text';
import { WireBox, WireSection, WireSlot, type WireWeight } from './wireframe';
import styles from './LandingBlock.module.css';

export interface LandingBlockProps {
  /** the section number, e.g. '05' */
  number: string;
  name: string;
  /** what this section is for */
  intent: string;
  heading: string;
  body: string;
  /** what the media slot will become */
  slot: string;
  behaviour: string;
  ratio?: string;
  bleed?: boolean;
  weight?: WireWeight;
}

/** The teaser and the four screen sections share one structure and one
 *  locked heading baseline, so 05–08 read as a single continuous
 *  surface. Only the weight differs: 04 carries the argument, the four
 *  after it are a repeating rhythm. */
export function LandingBlock({
  number,
  name,
  intent,
  heading,
  body,
  slot,
  behaviour,
  ratio = '16 / 9',
  bleed,
  weight = 'secondary',
}: LandingBlockProps) {
  return (
    <WireSection number={number} name={name} intent={intent} weight={weight}>
      <div className={styles.stack}>
        <div className={styles.head}>
          <Display size={weight === 'primary' ? 'xl' : 'lg'}>{heading}</Display>
          <Text variant="body" tone="secondary">
            {body}
          </Text>
        </div>
        <WireBox plain>
          <WireSlot label={slot} behaviour={behaviour} ratio={ratio} bleed={bleed} />
        </WireBox>
      </div>
    </WireSection>
  );
}
