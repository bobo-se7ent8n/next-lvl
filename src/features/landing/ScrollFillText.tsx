import { useMemo, type CSSProperties, type RefObject } from 'react';
import { cx } from '../../lib/css';
import styles from './ScrollFillText.module.css';

export interface ScrollFillTextProps {
  /** the copy. `**like this**` marks the one word set in the accent. */
  text: string;
  /** the parent writes `--fill` (0 → 1) onto this node every frame */
  hostRef: RefObject<HTMLParagraphElement | null>;
  /** body size in the secondary ink — for copy that is support
   *  under something rather than the content of a section */
  quiet?: boolean;
  className?: string;
}

interface Word {
  text: string;
  accent: boolean;
}

/* `**stays**` → one accented word. Splitting on the delimiter and
   taking every odd chunk as marked is the whole parser: the copy is
   ours, it is not user input, and a markdown library for one pair of
   asterisks would be a dependency to carry forever. */
function parse(text: string): Word[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .flatMap((chunk) => {
      const accent = chunk.startsWith('**') && chunk.endsWith('**');
      const body = accent ? chunk.slice(2, -2) : chunk;
      return body
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => ({ text: word, accent }));
    });
}

/**
 * TEXT THAT FILLS AS YOU READ IT.
 *
 * Every word starts muted and comes up to full strength one at a
 * time, driven by how far through the section the page has
 * scrolled.
 *
 * THE WHOLE PARAGRAPH IS DRIVEN BY ONE CUSTOM PROPERTY. The parent
 * writes `--fill` onto the host node on each animation frame, and
 * every word works out its own state from it:
 *
 *     lit = clamp(0, fill × count − index, 1)
 *
 * — which is 0 until the fill front reaches that word, ramps across
 * it, and stays 1 behind it. So a fifty-word paragraph costs one
 * property write per frame rather than fifty style assignments, and
 * React is not involved at all: nothing here re-renders while the
 * page scrolls.
 *
 * The copy is plain black body text at one step above body size.
 * It carried a lilac text gradient for one revision; there are no
 * gradients in this product, and it also fought the fill — the
 * clipped background made every glyph a transparent window, which
 * left the per-word opacity nothing of its own to fade.
 */
export function ScrollFillText({ text, hostRef, quiet, className }: ScrollFillTextProps) {
  const words = useMemo(() => parse(text), [text]);

  return (
    <p
      ref={hostRef}
      className={cx(styles.copy, quiet && styles.quiet, className)}
      style={{ '--count': words.length } as CSSProperties}
    >
      {words.map((word, i) => (
        <span
          key={`${word.text}-${i}`}
          className={cx(styles.word, word.accent && styles.accent)}
          style={{ '--i': i } as CSSProperties}
        >
          {word.text}{' '}
        </span>
      ))}
    </p>
  );
}
