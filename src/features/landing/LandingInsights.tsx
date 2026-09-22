import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { InsightCard } from '../../components/composed/InsightCard';
import { INSIGHTS } from '../../data';
import { roundRectLength } from './navGeometry';
import { easeOut, span, useSectionProgress } from './scroll';
import { useBoxSize } from './useBoxSize';
import { ASK_FOUND, ASK_PROMPT } from './copy';
import styles from './LandingInsights.module.css';

/* THE STAGES, AS WINDOWS OF THE SECTION'S SCROLL.

   1  0.00 → 0.05   the empty bubble, alone in the middle
   2  0.05 → 0.32   the question types itself in; the stroke closes
                    round the bubble with the dot at its head
   3  0.32 → 0.34   held: the question asked, the outline whole
   4  0.34 → 0.40   the bubble lifts and fades — gone at 0.40
      0.42 → 0.52   and only then does the line rise into its place
   5  0.50 → 0.99   the library lands round it, card after card
   6  1.00          the pin lets go, and the line and the cards leave
                    together as one block

   THE BUBBLE AND THE LINE NEVER SHARE THE SCREEN. They stand in the
   same grid cell, so any stretch of scroll where both are visible is a
   stretch where the line is drawn over the bubble. The bubble's fade
   therefore ENDS before the line's begins, with a beat of empty stage
   between: whatever the window's size, and however the damped progress
   lags the wheel, the two are never both above zero opacity in one
   frame — both read the same eased value.

   THE LINE HAS NO EXIT OF ITS OWN. It used to let go at 0.8 and scroll
   on up alone while the cards held still, which read as the headline
   floating over the section rather than belonging to it. It sits in
   its place in the block now and leaves when the block does, with the
   cards round it. The track lost the fifth of its length that exit
   took, and everything before it was rescaled to fit — each card still
   lands over the same distance of scroll it always did.

   Everything comes out of one progress value, so scrolling back runs
   the same arithmetic backwards and nothing has to be reset. */
const TYPE = [0.05, 0.32] as const;
const LEAVE = [0.34, 0.4] as const;
const ARRIVE = [0.42, 0.52] as const;
/** how much of the section one card takes to land */
const LAND = 0.14;

/* ------------------------------------------------------------
   THE LIBRARY, FALLING INTO A WELL.

   We are looking down into the scene. Each card starts close to the
   eye — big, and thrown out towards the edges of the window by the
   perspective — and falls away into the depth until it lies at its
   place on the bottom, on the decelerating curve with no overshoot.
   The vanishing point is the middle of the window, so a falling card
   closes in on the centre as it shrinks, the way something dropped
   down a well does.

   A card that falls later lands ON TOP of the ones already down: the
   stacking is the arrival order, so the pile builds as the page
   scrolls, and scrolling back lifts the cards out again in reverse.
   The last one is down just before the pin lets go.

   Frozen at module load; nothing here is built during a render.
   ------------------------------------------------------------ */
interface Drop {
  /** where it rests: its centre, as shares of the window */
  x: number;
  y: number;
  /** its size at rest */
  scale: number;
  /** where in the section it starts coming down */
  start: number;
}

const DROPS = Object.freeze(
  (
    [
      { x: 0.15, y: 0.27, scale: 0.66, start: 0.5 },
      { x: 0.85, y: 0.25, scale: 0.64, start: 0.55 },
      { x: 0.26, y: 0.77, scale: 0.6, start: 0.6 },
      { x: 0.74, y: 0.79, scale: 0.64, start: 0.65 },
      { x: 0.07, y: 0.63, scale: 0.56, start: 0.7 },
      { x: 0.93, y: 0.65, scale: 0.58, start: 0.75 },
      { x: 0.36, y: 0.13, scale: 0.5, start: 0.8 },
      { x: 0.64, y: 0.11, scale: 0.52, start: 0.85 },
    ] satisfies Drop[]
  ).map((d) => Object.freeze(d)),
);

/**
 * INSIGHTS, BY SCROLLING.
 *
 * The section starts as one empty input bubble in the middle of an
 * empty screen. Scrolling types a question into it, a character at
 * a time, and closes a lit stroke round its border with a dot
 * leading the stroke; once the question is asked the bubble lifts
 * away and a line takes its place, and the library the question is
 * answered from falls into the scene round it — as if down a well —
 * card by card, each landing on top of the last.
 * Once the last card is down the pin lets go, and the line and the
 * library scroll up and out together.
 *
 * THE ONLY REACT STATE IS THE CHARACTER COUNT, and it changes about
 * thirty times across the whole section — once per character. The
 * rest is custom properties written straight onto nodes by the page's
 * one scroll loop; nothing re-renders while you scroll.
 */
export function LandingInsights() {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  /* the border is drawn twice — a blurred copy under a crisp one —
     and both take the same dash, so the loop writes to both */
  const stroke = useRef<SVGRectElement>(null);
  const strokeGlow = useRef<SVGRectElement>(null);
  const runner = useRef<SVGRectElement>(null);
  const cards = useRef<Array<HTMLDivElement | null>>([]);

  const [typed, setTyped] = useState(0);
  const shown = useRef(0);

  const box = useBoxSize(bubble);
  const radius = box.h / 2;
  const outline = box.w && box.h ? roundRectLength(box.w, box.h, radius) : 0;

  useSectionProgress(
    track,
    useCallback((p: number) => {
      const fill = span(p, TYPE[0], TYPE[1]);

      const node = stage.current;
      if (node) {
        node.style.setProperty('--fill', fill.toFixed(4));
        node.style.setProperty('--leave', span(p, LEAVE[0], LEAVE[1]).toFixed(4));
        node.style.setProperty('--arrive', span(p, ARRIVE[0], ARRIVE[1]).toFixed(4));
      }

      /* the border closing round the bubble as the question fills */
      const rect = stroke.current;
      if (rect) {
        const len = Number.parseFloat(rect.dataset.len ?? '0');
        if (len > 0) {
          const dash = `${(len * fill).toFixed(2)} ${(len * (1 - fill) + 1).toFixed(2)}`;
          rect.setAttribute('stroke-dasharray', dash);
          strokeGlow.current?.setAttribute('stroke-dasharray', dash);
        }
      }

      /* THE DOT IS THE HEAD OF THE STROKE. It walks the same outline
         from the same starting point by the SAME fraction the stroke
         has drawn — `pathLength` is 1 on it — so it is always exactly
         where the colour ends: it leads the fill rather than circling
         on a clock of its own. Negative, because a positive offset
         walks a dash backwards. */
      runner.current?.setAttribute('stroke-dashoffset', (-fill).toFixed(5));

      /* each card's own landing, eased so it settles rather than stops */
      for (let i = 0; i < DROPS.length; i += 1) {
        const d = DROPS[i];
        cards.current[i]?.style.setProperty('--e', easeOut(span(p, d.start, d.start + LAND)).toFixed(4));
      }

      const chars = Math.round(ASK_PROMPT.length * fill);
      if (chars !== shown.current) {
        shown.current = chars;
        setTyped(chars);
      }
    }, []),
  );

  return (
    <section ref={track} className={styles.track} data-section="insights" aria-label="Insights">
      <div className={styles.pin}>
        {/* the library, behind everything else in the scene */}
        <div className={styles.field} aria-hidden="true">
          {DROPS.map((d, i) => (
            <div
              key={INSIGHTS[i].id}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className={styles.drop}
              style={{ '--x': d.x, '--y': d.y, '--s': d.scale, zIndex: i + 1 } as CSSProperties}
            >
              <InsightCard insight={INSIGHTS[i]} />
            </div>
          ))}
        </div>

        <div ref={stage} className={styles.stage}>
          <div className={styles.ask}>
            <div ref={bubble} className={styles.bubble}>
              {outline > 0 ? (
                <svg
                  className={styles.trace}
                  viewBox={`0 0 ${box.w} ${box.h}`}
                  width={box.w}
                  height={box.h}
                  aria-hidden="true"
                >
                  <rect
                    ref={strokeGlow}
                    className={styles.strokeGlow}
                    x={0}
                    y={0}
                    width={box.w}
                    height={box.h}
                    rx={radius}
                    strokeDasharray={`0 ${outline}`}
                  />
                  <rect
                    ref={stroke}
                    data-len={outline}
                    className={styles.strokeRect}
                    x={0}
                    y={0}
                    width={box.w}
                    height={box.h}
                    rx={radius}
                    strokeDasharray={`0 ${outline}`}
                  />
                  {/* the dot at the head of the stroke — a round-capped
                      dash of almost no length on the same outline */}
                  <rect
                    ref={runner}
                    className={styles.runner}
                    x={0}
                    y={0}
                    width={box.w}
                    height={box.h}
                    rx={radius}
                    pathLength={1}
                  />
                </svg>
              ) : null}

              <span className={styles.prompt}>
                {ASK_PROMPT.slice(0, typed)}
                <span className={styles.caret} aria-hidden="true" />
              </span>
            </div>
          </div>

          <p className={styles.found}>{ASK_FOUND}</p>
        </div>
      </div>
    </section>
  );
}
