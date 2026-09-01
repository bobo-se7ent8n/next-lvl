import { useCallback, useRef, useState } from 'react';
import { Display } from '../../components/primitives/Text';
import { EnterContext } from '../../lib/enterContext';
import { FitBox } from './FitBox';
import { ScreenPlate } from './ScreenPlate';
import { ScrollFillText } from './ScrollFillText';
import { InsightsShot } from './screens';
import { roundRectLength } from './navGeometry';
import { span, useSectionProgress } from './scroll';
import { useBoxSize } from './useBoxSize';
import { ASK_NOTE, ASK_PROMPT } from './copy';
import styles from './LandingInsights.module.css';

/* THE FOUR STAGES, AS WINDOWS OF THE SECTION'S SCROLL.

   1  0.00 → 0.06   the empty bubble, alone and centred
   2  0.06 → 0.48   the prompt types itself in, and the stroke draws
   3  at 85% of 2   the note under it fades in
   4  0.56 → 0.71   the bubble group leaves
      0.71 → 0.90   and only then does the screen arrive

   THE TWO HALVES OF STAGE 4 DO NOT OVERLAP, and that is the whole
   point of splitting what used to be one span. The screen used to
   fade in across the same window the bubble was fading out of, so
   for a third of a section the reader was looking at a ghost of the
   Insights interface showing through a half-dissolved input — two
   states of the product at once, which is exactly the thing this
   page is arguing the product does not do. `EXIT` ends before
   `ARRIVE` begins: the bubble is gone, and then the screen is
   there.

   The exit is also half the length it was. It is a dismissal, and a
   dismissal that takes as long as an arrival reads as hesitation.

   Everything is derived from one progress value, so scrolling back
   up runs the same arithmetic backwards and the stages reverse
   cleanly with nothing to reset. */
const TYPE = [0.06, 0.48] as const;
const NOTE_AT = 0.85;
const EXIT = [0.56, 0.71] as const;
const ARRIVE = [0.71, 0.9] as const;
/* the head goes with the bubble: once the interface is what the
   section is showing, a heading over it is a label on a thing that
   is already named. It is faded out and then unmounted — the
   unmount lands after the fade has finished, so nothing snaps. */
const HEAD_OUT = [0.56, 0.68] as const;
const HEAD_GONE = 0.72;

/**
 * INSIGHTS, REVEALED BY SCROLLING.
 *
 * The section starts as one empty input bubble in the middle of an
 * otherwise empty screen. Scrolling types a question into it a
 * character at a time and draws a stroke around its border as the
 * text fills; a line explaining where the answer comes from fades
 * in under it near the end; and then the whole group scales up and
 * hands over to the full Insights screen, which becomes live once
 * it has settled.
 *
 * THE ONLY REACT STATE IS THE CHARACTER COUNT, and it changes about
 * thirty times across the whole section — once per character —
 * rather than once per frame. Everything continuous is a custom
 * property written straight onto a node by the rAF loop.
 */
export function LandingInsights() {
  const track = useRef<HTMLElement>(null);
  /* the pinned box. `--head` is written here rather than on the
     stage because the heading is the stage's SIBLING, and a custom
     property set on the stage would never reach it. */
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  /* the border is drawn twice — a blurred copy and a crisp one over
     it — and both take the same dash, so the loop writes to both.
     `stroke-dasharray` does not inherit from a sibling; the only
     honest way to keep two strokes in step is to write both. */
  const stroke = useRef<SVGRectElement>(null);
  const strokeGlow = useRef<SVGRectElement>(null);
  /* the note reads its own fill off this node, exactly the way the
     Sessions read-through does — one property write per frame */
  const note = useRef<HTMLParagraphElement>(null);
  /* THE TRAVELLING DOT, and it has no clock of its own.

     It was a CSS keyframe loop, which made the one live point in the
     section the one thing in it the reader was not moving: it
     circled while the page was still and circled at the same rate
     however fast the page was travelling. Its position is the
     section's progress now — 0 at the start of the path, 1 at the
     end — written on the same frames as everything else here.

     The smoothing is already done and is not repeated: the value
     `useSectionProgress` hands over has been eased toward the scroll
     position by `EASE` a frame in the page's one shared loop (see
     scroll.ts), which is exactly the `prog += delta * 0.22` this
     needs. A second loop here would be a second clock — the thing
     the keyframes were. */
  const runner = useRef<SVGRectElement>(null);

  const [typed, setTyped] = useState(0);
  /* the last value handed to React, so a frame that would set the
     same count does not go near it */
  const shown = useRef(0);
  const liveRef = useRef(false);
  const arrivingRef = useRef(false);
  /* the heading is unmounted rather than merely hidden once the
     interface has arrived; this is the only other discrete state */
  const [headOn, setHeadOn] = useState(true);
  const headRef = useRef(true);

  const box = useBoxSize(bubble);
  const radius = box.h / 2;
  const outline = box.w && box.h ? roundRectLength(box.w, box.h, radius) : 0;

  useSectionProgress(
    track,
    useCallback((p: number) => {
      const fill = span(p, TYPE[0], TYPE[1]);
      const exit = span(p, EXIT[0], EXIT[1]);
      const arrive = span(p, ARRIVE[0], ARRIVE[1]);

      const node = stage.current;
      if (node) {
        node.style.setProperty('--fill', fill.toFixed(4));
        node.style.setProperty('--exit', exit.toFixed(4));
        node.style.setProperty('--arrive', arrive.toFixed(4));
      }
      pin.current?.style.setProperty(
        '--head',
        (1 - span(p, HEAD_OUT[0], HEAD_OUT[1])).toFixed(4),
      );

      /* the border closing around the bubble as the text fills */
      const rect = stroke.current;
      if (rect) {
        const len = Number.parseFloat(rect.dataset.len ?? '0');
        if (len > 0) {
          const dash = `${(len * fill).toFixed(2)} ${(len * (1 - fill) + 1).toFixed(2)}`;
          rect.setAttribute('stroke-dasharray', dash);
          strokeGlow.current?.setAttribute('stroke-dasharray', dash);
        }
      }

      /* THE NOTE TYPES ITSELF IN TOO, on the same cadence and out of
         the same progress value — it used to fade in whole, which
         made it the one thing in the section that simply appeared. */
      note.current?.style.setProperty('--fill', span(fill, NOTE_AT, 1).toFixed(4));

      /* and the dot walks the outline with it. `pathLength` is 1 on
         the element, so the offset is a plain fraction of the path
         and none of this has to know how big the bubble is. Negative
         because a positive offset walks the dash backwards. */
      runner.current?.setAttribute('stroke-dashoffset', (-p).toFixed(5));

      const chars = Math.round(ASK_PROMPT.length * fill);
      if (chars !== shown.current) {
        shown.current = chars;
        setTyped(chars);
      }

      /* THE SCREEN IS NOT PAINTED AT ALL UNTIL THE BUBBLE IS GONE.
         `visibility` cannot be interpolated, so it is flipped by a
         data attribute at the one instant it changes rather than
         written per frame. */
      const arriving = arrive > 0;
      if (arriving !== arrivingRef.current) {
        arrivingRef.current = arriving;
        if (node) node.dataset.arriving = arriving ? 'true' : 'false';
      }

      /* and it takes clicks only once it has finished arriving */
      const live = arrive > 0.98;
      if (live !== liveRef.current) {
        liveRef.current = live;
        if (node) node.dataset.live = live ? 'true' : 'false';
      }

      /* and the heading leaves for good, a beat after its fade */
      const head = p < HEAD_GONE;
      if (head !== headRef.current) {
        headRef.current = head;
        setHeadOn(head);
      }
    }, []),
  );

  return (
    <section ref={track} className={styles.track} data-section="insights">
      <div ref={pin} className={styles.pin}>
        {headOn ? (
          <header className={styles.head}>
            <Display size="lg">Insights</Display>
          </header>
        ) : null}

        <div ref={stage} className={styles.stage} data-live="false" data-arriving="false">
          {/* 1–3 · the bubble, the prompt, and the note under it */}
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
                  {/* the border, closing as the prompt fills: a
                      blurred copy underneath, a crisp one over it */}
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

                  {/* THE TRAVELLING DOT.

                      A round-capped dash of almost no length, walked
                      round the same outline BY THE SCROLL. It is a
                      dot made out of a stroke rather than a circle
                      moving along a path: `animateMotion` is SMIL and
                      `offset-path` would need the path duplicated in
                      a second syntax, where this needs neither — the
                      rect is already the shape, and the browser
                      already knows how to walk a dash around it.

                      Its offset is written by the progress loop
                      above; there is no animation on it. */}
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

            <ScrollFillText text={ASK_NOTE} hostRef={note} quiet className={styles.note} />
          </div>

          {/* 4 · the screen the group hands over to.

              A STAGED ARRIVAL, not one fade. The container's own
              geometry lands first — it comes up out of where the
              bubble was and settles — and the card groups inside it
              follow a beat later, on their own delay. One object
              arriving with its contents already painted reads as a
              picture being swapped in; the container first, then
              what is in it, reads as something opening. */}
          <div className={styles.screen}>
            {/* CENTRED, AND THE PROP RATHER THAN A RULE ON THE
                CLASS. The stylesheet used to set `justify-content:
                center` on this node alone, which centred an
                overflowing screen against a scale still anchored to
                its top edge and quietly cropped its first thirty
                pixels. The alignment and the origin belong to
                FitBox, together. */}
            <FitBox centred>
              <div className={styles.screenIn}>
                <EnterContext.Provider value="landing-insights">
                  <ScreenPlate live>
                    <InsightsShot />
                  </ScreenPlate>
                </EnterContext.Provider>
              </div>
            </FitBox>
          </div>
        </div>
      </div>
    </section>
  );
}
