import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { prefersReducedMotion } from '../../lib/enter';
import styles from './LandingPicture.module.css';

/* ------------------------------------------------------------
   THE DECK, in design pixels at the 2046-wide window it is drawn at.

   Three cards at the back never move. The front two TRADE PLACES on
   the hero's own clock: the card in front goes back into the fourth
   slot and the one in the fourth slot comes forward. Both are laid
   out at the FRONT geometry and pushed back by one transform, so the
   move between the two slots is a translate and a scale and nothing
   else; the contents fade on the way so the scale is never read.
   ------------------------------------------------------------ */
const BACK = Object.freeze([
  { fill: 'var(--aera-color-data-mint)', x: 476, y: 446, w: 769.38, h: 862.09 },
  { fill: 'var(--aera-color-data-orange)', x: 512, y: 391, w: 769, h: 918 },
  { fill: 'var(--aera-color-data-lilac)', x: 548, y: 349, w: 769, h: 959 },
]);

const FRONT = Object.freeze({ x: 621, y: 381, w: 889, h: 927 });
const BEHIND = Object.freeze({ x: 585, y: 420, w: 769, h: 888 });

/* the push back, derived once: the two slots share a top-left origin */
const PUSH = Object.freeze({
  x: BEHIND.x - FRONT.x,
  y: BEHIND.y - FRONT.y,
  sx: +(BEHIND.w / FRONT.w).toFixed(4),
  sy: +(BEHIND.h / FRONT.h).toFixed(4),
});

const FACES = Object.freeze([
  {
    id: 'month',
    fill: 'var(--aera-color-surface-level2)',
    shot: '/story/picture-calendar.png',
    shotH: 659,
    alt: 'The month in AERA: every session on the calendar, coloured by intensity',
    copy: 'Sessions, days on court, hours played — counted, not judged. Rest, light, steady, heavy: intensity you can see at a glance. Nothing here builds toward a streak, and nothing breaks one.',
    copyY: -93.5,
    leading: 'var(--aera-story-copy-leading)',
  },
  {
    id: 'hrv',
    fill: 'var(--aera-color-data-blue)',
    shot: '/story/picture-hrv.png',
    shotH: 602,
    alt: 'Heart rate variability in AERA: 74 ms, a rolling seven-day median',
    copy: "Heart rate variability, read as a rolling median so one bad night doesn't skew the picture. It's the clearest signal of how recovered you actually are — not how tired you feel",
    copyY: -123,
    leading: 'var(--aera-story-copy-leading-tight)',
  },
]);

/** the copy's centre, from the centre of the front card */
const COPY_X = 256;

/**
 * THE FULL PICTURE.
 *
 * A heading, a line under it, and a deck of cards in the product's
 * own colours. The front two take turns: every beat of the hero's
 * keyword clock the card in front steps back into the deck and the
 * one behind it comes forward — the month view, then heart rate
 * variability, then the month again.
 *
 * The clock only runs while the section is on screen and the tab is
 * visible, and not at all for a visitor who asked for less motion.
 *
 * THE DECK TURNS ON A CLICK TOO. Clicking it — or Enter or Space on it
 * — brings the next card forward at once, and restarts the clock from
 * that moment, so a card the reader just chose is never replaced a
 * second later by the timer that was already running.
 */
export function LandingPicture() {
  const host = useRef<HTMLElement>(null);
  const [front, next] = useSwap(FACES.length, host);
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    next();
  };

  return (
    <section ref={host} className={styles.section} aria-labelledby="picture-title">
      <div className={styles.canvas}>
        <div className={styles.head}>
          <h2 id="picture-title" className={styles.title}>
            The full picture
          </h2>
          <p className={styles.sub}>
            Every session on the calendar, and what your body was doing during each one.
          </p>
        </div>

        {/* the deck, as one control: every card in it takes the click */}
        <div
          className={styles.deck}
          role="button"
          tabIndex={0}
          aria-label="Show the next card"
          onClick={next}
          onKeyDown={onKey}
        >
        {BACK.map((card, i) => (
          <div
            key={card.fill}
            className={styles.card}
            style={place(card, { '--fill': card.fill, zIndex: i + 1 })}
            aria-hidden="true"
          />
        ))}

        {FACES.map((face, i) => {
          const on = i === front;
          return (
            <div
              key={face.id}
              className={styles.face}
              data-front={on}
              aria-hidden={!on}
              style={place(FRONT, {
                '--fill': face.fill,
                '--px': PUSH.x,
                '--py': PUSH.y,
                '--sx': PUSH.sx,
                '--sy': PUSH.sy,
              })}
            >
              <div className={styles.content}>
                <img
                  className={styles.shot}
                  src={face.shot}
                  alt={face.alt}
                  style={{ '--sh': face.shotH } as CSSProperties}
                  loading="lazy"
                  decoding="async"
                />
                <p
                  className={styles.copy}
                  style={{ '--cx': COPY_X, '--cy': face.copyY, '--lh': face.leading } as CSSProperties}
                >
                  {face.copy}
                </p>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function place(
  box: { x: number; y: number; w: number; h: number },
  extra: Record<string, string | number>,
): CSSProperties {
  return { '--x': box.x, '--y': box.y, '--w': box.w, '--h': box.h, ...extra } as CSSProperties;
}

/* ------------------------------------------------------------
   THE CLOCK — one timeout chain, the hero's dwell, parked whenever
   nobody is looking. Read off `:root` so it is the hero's token and
   not a second copy of it.
   ------------------------------------------------------------ */
function useSwap(count: number, host: RefObject<HTMLElement | null>): [number, () => void] {
  const [index, setIndex] = useState(0);
  /* the effect's own re-arm, so a click can restart the clock; set
     from the effect, never during render */
  const rearm = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current;
    if (!el || prefersReducedMotion()) return;
    let timer = 0;
    let inView = false;

    function stop() {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    }
    function arm() {
      stop();
      if (!inView || document.hidden) return;
      timer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % count);
        arm();
      }, readMs('--aera-hero-dwell', 4000));
    }
    rearm.current = arm;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        arm();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    document.addEventListener('visibilitychange', arm);
    return () => {
      stop();
      rearm.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', arm);
    };
  }, [count, host]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
    rearm.current();
  }, [count]);

  return [index, next];
}

function readMs(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ms = Number.parseFloat(raw);
  return Number.isFinite(ms) && ms > 0 ? ms : fallback;
}
