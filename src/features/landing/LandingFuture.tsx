import { Display, Label } from '../../components/primitives/Text';
import { LandingSection } from './LandingSection';
import styles from './LandingFuture.module.css';

/* The two renders, and what each of them is for. They are stated
   here rather than inline so the pair reads as one set — the box
   that arrives and the thing you wear out of it. */
const RENDERS = [
  {
    src: '/aera-box.jpg',
    label: 'Device box',
    caption: 'what arrives, if it arrives',
    alt: 'The Aera box open on a court, a smart basketball in the tray with four sensor bracelets in the lid.',
  },
  {
    src: '/aera-wrist.jpg',
    label: 'Device input',
    caption: 'how the sensor is worn',
    alt: 'A player carrying their shoes, a slim white sensor bracelet on the wrist.',
  },
] as const;

/**
 * NOT BUILT YET — the hardware, stated as not built.
 *
 * THE DASHES ARE GONE. This section was the last one still drawn as
 * a wireframe: a dashed container round the section, another round
 * the pair of images, and an annotation in the corner saying what
 * the section was FOR. That scaffolding was right when the images
 * were empty slots; with the renders in place it was a dashed box
 * drawn around two finished photographs, which reads as the
 * photographs being provisional rather than the hardware.
 *
 * The copy is unchanged, and so is the admission it makes. That is
 * the point of the section, and dressing it up would undo it.
 */
export function LandingFuture() {
  return (
    <LandingSection
      heading="Not built yet"
      body="The hardware is still ahead of us. This part is honest about that."
      centred
      fit
    >
      <div className={styles.pair}>
        {RENDERS.map((render) => (
          <figure key={render.src} className={styles.figure}>
            <div className={styles.frame}>
              <img className={styles.image} src={render.src} alt={render.alt} loading="lazy" />
            </div>
            <figcaption className={styles.caption}>
              <Display size="md" as="h3">
                {render.label}
              </Display>
              <Label tone="tertiary">{render.caption}</Label>
            </figcaption>
          </figure>
        ))}
      </div>
    </LandingSection>
  );
}
