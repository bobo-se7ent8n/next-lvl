import { useRef } from 'react';
import { Display } from '../../components/primitives/Text';
import { CursorTags } from './CursorTags';
import { HERO_HEADLINE } from './copy';
import styles from './LandingHero.module.css';

/**
 * THE HERO — THE WHITE STATE.
 *
 * One sentence, and nothing under it.
 *
 * THERE IS NO SUBLINE, AND THAT IS THE SECTION. It used to carry a
 * line naming the parts — body sensors, a smart basketball, an app
 * that reads the patterns underneath your game. Those twenty words
 * are the tags still standing on the screen after the entry
 * sequence has thinned the field: the same claim, scattered rather
 * than set. A headline with a paragraph under it and a field of
 * words around it was saying the same thing twice, and the
 * paragraph was the half that made the field look decorative.
 *
 * The twenty tags standing behind it are NOT rendered here: their
 * coordinates are fractions of the WINDOW, and this section starts
 * below the floating bar, so the field hangs off the page itself
 * (see Landing.tsx) where 42% means the same thing it meant to the
 * entry overlay.
 *
 * This is also where the cursor gathers tags. That behaviour
 * belongs to the section rather than to the page — the cluster
 * exists only while the white state is in view — so the section
 * owns the host node and hands it to the layer.
 */
export function LandingHero() {
  const host = useRef<HTMLElement>(null);

  return (
    <section ref={host} className={styles.hero} data-section="hero">
      <div className={styles.stack}>
        <Display size="xl" as="h1" className={styles.line}>
          {HERO_HEADLINE}
        </Display>
      </div>

      <CursorTags hostRef={host} />
    </section>
  );
}
