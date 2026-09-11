import { Fragment, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { HERO_LEAD, HERO_SENTENCE, HERO_TAIL, NEUTRAL, SCENES } from './heroScenes';
import styles from './HeroHeadline.module.css';

/**
 * THE SENTENCE THE PAGE IS BUILT ON.
 *
 * Three of its words are switchable, each of them is set letter by
 * letter in its own colours, and the one that is active carries a
 * rule underneath it drawn as a gradient through those same
 * colours in the same order.
 *
 * IT IS THIRTEEN SPANS AND ONE `aria-label`. Splitting a word into
 * one element per letter is what lets the colours stagger across
 * it — and it also takes the word away from anybody using a screen
 * reader, who would otherwise be read "p, l, a, y". The label on
 * the block is the whole sentence, the per-letter spans are hidden
 * from the tree entirely, and each switch is a real button with
 * its own accessible name and pressed state. Nothing about the
 * animation reaches the accessibility tree.
 *
 * IT IS RENDERED IN TWO PLACES. The entry overlay brings this same
 * sentence out of a blur as the white fills the window, and the
 * hero is holding it underneath when the overlay unmounts. They
 * have to be the same block or the handover ends with a jump, so
 * they are literally the same component — the overlay renders it
 * inert, in neutral, and hands over to a live one.
 */
export interface HeroHeadlineProps {
  /** the keyword on screen, or NEUTRAL for the beat between runs */
  active?: number;
  /** whether that keyword's letters are in colour */
  lit?: boolean;
  /** nothing is interactive while the entry is still playing */
  inert?: boolean;
  onHold?: (index: number) => void;
  onRelease?: () => void;
  className?: string;
  as?: 'h1' | 'p';
}

/* the separators BETWEEN the switchable words, and they are copy.
   Written as a list rather than computed so the last one can be
   "&" without a rule about which index it falls on. */
const JOINS = [', ', ' & '] as const;

/** the rule under a word: its own letters, in order, as a gradient */
function rule(letters: readonly string[]): string {
  return `linear-gradient(90deg, ${letters.join(', ')})`;
}

export function HeroHeadline({
  active = NEUTRAL,
  lit = false,
  inert = false,
  onHold,
  onRelease,
  className,
  as: Tag = 'h1',
}: HeroHeadlineProps) {
  return (
    <Tag aria-label={HERO_SENTENCE} className={cx(styles.headline, className)}>
      <span aria-hidden="true">{HERO_LEAD} </span>

      {/* THE SWITCHABLE WORDS GET A LINE OF THEIR OWN, and that is
          the layout rather than a coincidence of measure. The block
          is exactly the headline's measure, so "Now you can", the
          three words and "yourself" each take one line at every
          size — which means a keyword changing length mid-cycle
          cannot re-flow the sentence around it. */}
      <span className={styles.group}>
        {SCENES.map((scene, i) => (
          <Fragment key={scene.word}>
            <button
              type="button"
              aria-label={scene.word}
              aria-pressed={active === i}
              data-active={active === i}
              data-lit={active === i && lit}
              tabIndex={inert ? -1 : undefined}
              disabled={inert}
              className={styles.word}
              onPointerEnter={() => onHold?.(i)}
              onPointerLeave={() => onRelease?.()}
              onFocus={() => onHold?.(i)}
              onBlur={() => onRelease?.()}
            >
              <span aria-hidden="true">
                {[...scene.word].map((letter, index) => (
                  <span
                    key={index}
                    className={styles.letter}
                    style={
                      {
                        '--letter': scene.letters[index % scene.letters.length],
                        '--step': index,
                      } as CSSProperties
                    }
                  >
                    {letter}
                  </span>
                ))}
              </span>

              <span
                aria-hidden="true"
                className={styles.rule}
                style={{ backgroundImage: rule(scene.letters) }}
              />
            </button>
            {JOINS[i] ? <span aria-hidden="true">{JOINS[i]}</span> : null}
          </Fragment>
        ))}
      </span>

      <span aria-hidden="true"> {HERO_TAIL}</span>
    </Tag>
  );
}
