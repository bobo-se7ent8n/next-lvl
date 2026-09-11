import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { SCENES } from './heroScenes';
import styles from './HeroModes.module.css';

/**
 * THE THREE THINGS THE HEADLINE NAMED, EXPLAINED.
 *
 * The list the hero hands over to once its product shot has pinned:
 * Play, Score, Read, one open at a time, with a hairline across the
 * top of each row that fills as the page scrolls through that mode.
 *
 * THE ROWS MOVE BY TRANSFORM, NOT BY HEIGHT. An accordion that
 * animates its open row's height re-lays-out the whole list on every
 * frame of every switch. Here each row is placed with a translate —
 * its index times the closed row height, plus the open row's copy if
 * it sits below it — and only the translate is transitioned. The
 * copy's height is measured once and again only when it resizes.
 *
 * The rows are real buttons: picking one scrolls the page to that
 * mode's stretch of the handoff. That is a click moving the page,
 * the same as a link to an anchor — nothing here ever responds to
 * the wheel.
 */
export interface HeroModesProps {
  /** the mode the scroll is in */
  active: number;
  /** the list is on screen — off it, nothing in it is focusable */
  shown: boolean;
  onPick: (index: number) => void;
}

export function HeroModes({ active, shown, onPick }: HeroModesProps) {
  const base = useId();
  const bodies = useRef<Array<HTMLDivElement | null>>([]);
  const [heights, setHeights] = useState<readonly number[]>(() => SCENES.map(() => 0));

  /* the copy's height, read when it first lays out and whenever it
     reflows — a resize observer reports every observed box once on
     subscribe, so there is no separate first read */
  useEffect(() => {
    const read = () => setHeights(bodies.current.map((body) => body?.offsetHeight ?? 0));
    const observer = new ResizeObserver(read);
    for (const body of bodies.current) if (body) observer.observe(body);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      role="group"
      aria-label="What aera does"
      aria-hidden={!shown}
      className={styles.modes}
      style={{ '--open-h': `${heights[active] ?? 0}px` } as CSSProperties}
    >
      {SCENES.map((scene, i) => {
        const on = i === active;
        return (
          <div
            key={scene.word}
            className={styles.row}
            data-active={on}
            data-below={i > active}
            style={{ '--i': i, '--rp': `var(--row-${i})` } as CSSProperties}
          >
            {/* how far the page is through this mode */}
            <span className={styles.rule} aria-hidden="true" />

            <h3 className={styles.head}>
              <button
                type="button"
                className={styles.title}
                aria-expanded={on}
                aria-controls={`${base}-${i}`}
                tabIndex={shown ? undefined : -1}
                onClick={() => onPick(i)}
              >
                <span className={styles.titleText}>{scene.title}</span>
              </button>
            </h3>

            <div
              ref={(el) => {
                bodies.current[i] = el;
              }}
              id={`${base}-${i}`}
              className={styles.body}
              aria-hidden={!on}
            >
              <p className={styles.lead}>{scene.lead}</p>
              <p className={styles.copy}>{scene.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
