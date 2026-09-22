import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './LandingGame.module.css';

/* ------------------------------------------------------------
   A GAME THAT KNOWS YOU — the four words and the six photographs,
   in design pixels at the 2046-wide window they are drawn at. A word
   is placed by its centre relative to the middle of the window and
   by its top; a tile by its top-left corner. Frozen at module load.

   ONE STYLE FOR ALL FOUR WORDS. "you" used to be set in italic, which
   made the last word read as a different voice from the three before
   it. It is one sentence, so it is one weight and one posture.

   THE WEIGHT IS BOLD, AND BOLD IS WIDER. A word placed by its centre
   grows out of both sides, so "that" and "knows" — each with a
   photograph just off its left edge — were 30 and 35 design px closer
   to it than drawn, down to a sliver. Their centres move right by
   exactly that much, which puts the air to their left back to the
   design's 45-47px.
   ------------------------------------------------------------ */
const LINES = Object.freeze([
  { text: 'A game', cx: 0, y: 0 },
  { text: 'that', cx: 463.5, y: 300 },
  { text: 'knows', cx: 361.5, y: 607 },
  { text: 'you', cx: -326.5, y: 847.7 },
]);

const TILES = Object.freeze([
  { src: '/story/game-tl.png', x: 193, y: 25 },
  { src: '/story/game-c2.png', x: 961, y: 316 },
  { src: '/story/game-tr.png', x: 1708, y: 25 },
  { src: '/story/game-c3.png', x: 733, y: 599 },
  { src: '/story/game-bl.png', x: 193, y: 852 },
  { src: '/story/game-br.png', x: 1708, y: 852 },
]);

/**
 * A GAME THAT KNOWS YOU.
 *
 * One sentence broken across the window, with six photographs of
 * the game set between its words. It arrives once, the first time it
 * is reached — every piece rising into place in turn — and then it
 * stays still: it is a statement, not a scene.
 */
export function LandingGame() {
  const host = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={host} className={styles.section} data-shown={shown}>
      <div className={styles.canvas}>
        {TILES.map((tile, i) => (
          <img
            key={tile.src}
            className={styles.tile}
            src={tile.src}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ '--x': tile.x, '--y': tile.y, '--i': i } as CSSProperties}
          />
        ))}

        <h2 className={styles.words} aria-label="A game that knows you">
          {LINES.map((line, i) => (
            <span
              key={line.text}
              aria-hidden="true"
              className={styles.line}
              style={{ '--cx': line.cx, '--y': line.y, '--i': i + 1 } as CSSProperties}
            >
              {line.text}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
