import type { CSSProperties } from 'react';
import { inkOn } from '../../lib/color';
import { Label } from '../../components/primitives/Text';
import { scatter } from '../../tokens';
import { SCATTER_TAGS, tagFill } from './seed';
import styles from './TagField.module.css';

/* the twenty that survived the entry expansion — see the note on
   TAG_KEEP in copy.ts for why it is these twenty and not a seeded
   subset of the whole vocabulary */
const STANDING = SCATTER_TAGS.filter((tag) => !tag.exits);

/**
 * THE FIELD THAT IS STILL THERE.
 *
 * The entry overlay ends with twenty word tags spread across the
 * white state and then unmounts — and without this they would
 * unmount with it, so the sequence would end by deleting the thing
 * it had just spent a second and a quarter arranging.
 *
 * This is that arrangement, standing. Every tag reads the SAME
 * seeded light-state coordinate the overlay moved it to, so the
 * handover is not a fade or a re-entrance: the tags are already
 * exactly where the overlay left them, and the overlay simply stops
 * being in front of them.
 *
 * WHICH MEANS THE TWO BOXES HAVE TO BE THE SAME BOX. The overlay is
 * fixed to the viewport; this layer is one viewport tall, pinned to
 * the top of the page and run out to both window edges past the
 * page gutter. A coordinate of 0.42 is 42% of the window in both,
 * so the two agree by construction rather than by tuning.
 *
 * It scrolls away with the page, which is the point — these are the
 * hero's words, not the page's furniture.
 */
export function TagField() {
  return (
    <div className={styles.field} aria-hidden="true">
      {STANDING.map((tag, i) => (
        <span
          key={tag.word}
          className={styles.tag}
          style={
            {
              /* `left`/`top` rather than a translated viewport unit:
                 nothing here animates, so there is no layout thrash to
                 avoid, and a percentage of the containing block is the
                 one positioning method that cannot disagree with the
                 overlay's about where the middle of the window is. */
              left: `${(tag.lx * 100).toFixed(3)}%`,
              top: `${(tag.ly * 100).toFixed(3)}%`,
              '--s': tag.scale,
              '--r': `${tag.rotate.toFixed(2)}deg`,
              '--fill': tagFill(tag.fill),
              '--ink': inkOn(tagFill(tag.fill)),
              '--tint': scatter.tintLight,
              zIndex: i,
            } as CSSProperties
          }
        >
          <Label tone="inherit">{tag.word}</Label>
        </span>
      ))}
    </div>
  );
}
