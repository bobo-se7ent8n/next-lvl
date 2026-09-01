import { useCallback, useRef } from 'react';
import { Display } from '../../components/primitives/Text';
import { ScrollFillText } from './ScrollFillText';
import { SESSION_TABS } from './copy';
import { span, useSectionProgress } from './scroll';
import styles from './LandingSessions.module.css';

/* WHERE THE TWO TABS SIT IN THE SECTION'S SCROLL.

   The first tab's paragraph fills over the first four tenths of the
   travel, the two cross-fade over the middle tenth, and the second
   fills over the last four. The gap either side of the cross-fade is
   deliberate: the swap happens while both paragraphs are at rest, so
   nothing is filling and fading at the same time. */
const FILL_ONE = [0.04, 0.42] as const;
const CROSS = [0.44, 0.56] as const;
const FILL_TWO = [0.58, 0.96] as const;

/* THE TWO SCREENS, AS RENDERS.

   They were the live app screens, laid out at 1280x800 inside a
   CSS-drawn laptop. They are photographs of the product now, in a
   real device frame — which is a smaller claim honestly made: a
   section that scrolls past in three seconds does not need the
   Sessions list to be recalculating inside it, and the render shows
   the screen at a fidelity the scaled-down live version could not.
   The live product is still one section up, in a window you can
   click. */
const SHOTS = [
  { src: '/macbook-sessions.png', alt: 'The Sessions screen: a month calendar beside a log of recorded sessions.' },
  { src: '/macbook-session-detail.png', alt: 'One session open: a point-cloud replay above a timeline of motion, opponents and physiology.' },
] as const;

/**
 * SESSIONS, AS TWO SCROLL-DRIVEN TABS.
 *
 * A pinned section holding a laptop and a paragraph. Scrolling
 * fills the paragraph word by word; when it is full the pane
 * cross-fades to the second tab — the same laptop, now showing one
 * session open — and the second paragraph fills the same way.
 *
 * THERE IS NO SECTION HEADING. The two labels say which screen you
 * are looking at, the paragraph says what it does, and a third
 * piece of type over both of them saying "SESSIONS" was naming what
 * the picture already showed. Those labels carry the display face
 * rather than the mono eyebrow for the same reason: with the
 * section heading gone they ARE the heading, and an eyebrow with
 * nothing under it to introduce is just small type.
 *
 * NOTHING IN HERE RE-RENDERS WHILE YOU SCROLL. Both panes are
 * mounted the whole time and the section's progress is written to
 * four custom properties on one node per frame. A `setState` for
 * the tab swap would re-render both screens at the exact moment
 * they are cross-fading, which is the one moment in the section
 * that has to be smooth.
 */
export function LandingSessions() {
  const track = useRef<HTMLElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const copyOne = useRef<HTMLParagraphElement>(null);
  const copyTwo = useRef<HTMLParagraphElement>(null);

  useSectionProgress(
    track,
    useCallback((p: number) => {
      const cross = span(p, CROSS[0], CROSS[1]);
      pane.current?.style.setProperty('--a', (1 - cross).toFixed(3));
      pane.current?.style.setProperty('--b', cross.toFixed(3));
      copyOne.current?.style.setProperty('--fill', span(p, FILL_ONE[0], FILL_ONE[1]).toFixed(4));
      copyTwo.current?.style.setProperty('--fill', span(p, FILL_TWO[0], FILL_TWO[1]).toFixed(4));
    }, []),
  );

  return (
    <section ref={track} className={styles.track} data-section="sessions">
      <div className={styles.pin}>
        <div ref={pane} className={styles.panes}>
          {/* TAB 1 — the month, and the log beside it */}
          <div className={styles.pane} data-pane="a">
            <div className={styles.device}>
              <img className={styles.shot} src={SHOTS[0].src} alt={SHOTS[0].alt} />
            </div>
            <div className={styles.words}>
              {/* THE DISPLAY SIZE, because with the section heading
                  gone these labels ARE the heading — see the note on
                  the component. `xl` is the token the page's other
                  section headings carry, so the two tabs sit at the
                  same weight in the page as PATTERNS and INSIGHTS
                  rather than at card-title size. */}
              <Display size="xl" as="h2">
                {SESSION_TABS[0].label}
              </Display>
              {/* the phrase set in the display face is marked in the
                  copy itself — see copy.ts */}
              <ScrollFillText text={SESSION_TABS[0].copy} hostRef={copyOne} />
            </div>
          </div>

          {/* TAB 2 — one session, opened, replaying */}
          <div className={styles.pane} data-pane="b">
            <div className={styles.device}>
              <img className={styles.shot} src={SHOTS[1].src} alt={SHOTS[1].alt} />
            </div>
            <div className={styles.words}>
              <Display size="xl" as="h2">
                {SESSION_TABS[1].label}
              </Display>
              <ScrollFillText text={SESSION_TABS[1].copy} hostRef={copyTwo} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
