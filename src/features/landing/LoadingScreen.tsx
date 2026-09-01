import { useEffect, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { inkOn } from '../../lib/color';
import { Display, Label } from '../../components/primitives/Text';
import { prefersReducedMotion } from '../../lib/enter';
import { duration, scatter } from '../../tokens';
import { HERO_HEADLINE, LOADING_COPY } from './copy';
import { markEntryPlayed } from './entryState';
import { SCATTER_TAGS, tagFill } from './seed';
import styles from './LoadingScreen.module.css';

const ms = (token: string) => Number.parseFloat(token);

export interface LoadingScreenProps {
  /** called once the white has filled the screen and settled */
  onDone: () => void;
}

type Phase = 'dark' | 'expand';

/**
 * THE ENTRY.
 *
 * A dark ruled ground, twenty-two seeded word tags, and a white
 * 4:3 card in the middle of it holding two lines. After a hold the
 * card grows to fill the window, the tags reflow onto the light
 * state — most of them find new coordinates and re-tint, a seeded
 * third of them scale to nothing toward the centre — and the
 * headline resolves out of a heavy blur behind the white as it
 * arrives.
 *
 * The whole thing is skipped under `prefers-reduced-motion`: the
 * visitor lands on the white state with the page already scrollable
 * and nothing has moved.
 */
export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('dark');

  /* THE PAGE IS LOCKED WHILE THIS RUNS, and unlocked by the same
     effect that locked it — a lock released from the timeout that
     ends the sequence would survive an unmount mid-flight. */
  useEffect(() => {
    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      markEntryPlayed();
      onDone();
      return;
    }

    const open = window.setTimeout(() => setPhase('expand'), ms(duration.entryHold));
    const finish = window.setTimeout(
      () => {
        markEntryPlayed();
        onDone();
      },
      ms(duration.entryHold) + ms(duration.entryExpand),
    );

    return () => {
      window.clearTimeout(open);
      window.clearTimeout(finish);
    };
  }, [onDone]);

  const open = phase === 'expand';

  return (
    <div className={cx(styles.screen, open && styles.open)} aria-hidden="true">
      {/* 1 — THE GROUND. Two ruled layers on the near-black, and they
          cross-fade to their paper equivalents as the white arrives so
          the grid the corner squares are aligned to never disappears. */}
      <div className={styles.ground} />

      {/* 2 — THE FIELD. Every tag is in the DOM in both states; what
          changes is where it is told to be. Nothing is added or
          removed mid-flight, so nothing can pop. */}
      <div className={styles.field}>
        {SCATTER_TAGS.map((tag, i) => (
          <span
            key={tag.word}
            className={cx(styles.tag, tag.exits && styles.tagExits)}
            style={
              {
                '--x': open ? tag.lx : tag.x,
                '--y': open ? tag.ly : tag.y,
                '--s': tag.scale,
                '--r': `${tag.rotate.toFixed(2)}deg`,
                '--fill': tagFill(tag.fill),
                '--ink': inkOn(tagFill(tag.fill)),
                '--tint': open ? scatter.tintLight : 1,
                /* A SHARE OF THE HOLD, NOT A COUNT OF TAGS.

                   The stagger used to be one step per tag, which
                   meant the run got longer every time a word was
                   added to the vocabulary — at thirty-eight it ran
                   past the end of the hold, and tags were still
                   arriving as the card began to expand. Expressed
                   against the hold itself, the whole field is in
                   place before the expansion starts however many
                   words there are. */
                '--enter-delay': `calc(${duration.entryHold} * ${(tag.delay * 0.5).toFixed(3)})`,
                zIndex: i,
              } as CSSProperties
            }
          >
            <Label tone="inherit">{tag.word}</Label>
          </span>
        ))}
      </div>

      {/* 3 — THE HEADLINE, behind the card and in front of the ground.
          It is already here on the dark state at zero opacity and a
          heavy blur; the white passing over it is what brings it into
          focus, so the two are one move rather than two.

          THE BLOCK IS THE HERO'S BLOCK. When this overlay unmounts,
          the real hero is underneath it in the same place — but only
          if it IS the same place. The hero centres its headline
          inside the window less the floating bar's band, so a
          headline centred on the bare viewport would land some tens
          of pixels off and the handover would end with a jump. The
          offset is matched in the stylesheet. */}
      <div className={styles.headline}>
        <div className={styles.headStack}>
          <Display size="xl" as="p">
            {HERO_HEADLINE}
          </Display>
        </div>
      </div>

      {/* 4 — THE CARD. It grows by its own width and height rather
          than by a transform, so the four squares pinned to its
          corners stay exactly on its corners for the whole travel
          instead of being scaled along with it. */}
      <div className={styles.card}>
        <div className={styles.copy}>
          {LOADING_COPY.map((line) => (
            <span key={line} className={styles.copyLine}>
              {line}
            </span>
          ))}
        </div>

        {/* the four corners, on top of the dark ground and aligned to
            the rule the card itself is measured in */}
        <span className={cx(styles.corner, styles.cornerTL)} />
        <span className={cx(styles.corner, styles.cornerTR)} />
        <span className={cx(styles.corner, styles.cornerBL)} />
        <span className={cx(styles.corner, styles.cornerBR)} />
      </div>
    </div>
  );
}
