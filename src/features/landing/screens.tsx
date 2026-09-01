import { useState, type CSSProperties } from 'react';
import { PageHeader } from '../../components/chrome/PageHeader';
import { ChatPanel, type ChatMessage } from '../../components/composed/ChatPanel';
import { InsightCard } from '../../components/composed/InsightCard';
import { FocusPanel } from '../home/FocusPanel';
import { VitalCard } from '../home/VitalCard';
import { ShotArc } from '../scoreboard/ShotArc';
import { ShotTrend } from '../scoreboard/ShotTrend';
import { ShotZonesField } from '../scoreboard/ShotZonesField';
import { SkillRatings, WhereToWorkNext } from '../scoreboard/SkillRatings';
import { PeriodContext } from '../scoreboard/periodContext';
import { askAera } from '../insights/askAera';
import { columnCountFor } from '../../lib/columns';
import { ASK_SEEDS, INSIGHTS, VITALS } from '../../data';
import { landing } from '../../tokens';
import styles from './screens.module.css';

/* ============================================================
   THE APP, AS SHOWN ON THE LANDING PAGE

   These are the real components — the real focus panel, the real
   court, the real ratings, the real library — composed into three
   screens at the plate's fixed 1280 × 800.

   THERE USED TO BE FIVE. The two Sessions screens are renders now
   (see LandingSessions), so the components that only they used —
   the calendar, the session cards, the point-cloud stage and the
   timeline — are no longer imported here and no longer travel in
   the landing page's share of the bundle.

   THEY ARE NOT THE SCREEN COMPONENTS THEMSELVES, and that is a
   deliberate call rather than duplication for its own sake. The
   app's screens are built to own a browser window: their left
   columns are `position: sticky` against the viewport, their
   heights are `100svh` arithmetic and their lists scroll inside
   themselves. Dropped into an 800px plate every one of those
   behaviours is measuring the wrong box — a sticky column pins to
   the page behind the plate, and a `100svh` panel runs a screen
   and a half past the bottom of it.

   So the layout is restated here against the plate, and only the
   layout: every card, chart and reading below is imported from the
   app and renders exactly as it ships.
   ============================================================ */

/* ---- home ---------------------------------------------------- */

export function HomeShot() {
  return (
    <div className={styles.screen}>
      <PageHeader
        title="Focus & vitals"
        subhead="One thing worth attention this week, and the body readings underneath it."
      />
      {/* THE PRODUCTION LAYOUT, and all six readings.

          Focus spans the full height of the left column; the right
          side is three across and two down — Stress, HRV and Resting
          HR on the top row, Cardio capacity, Resilience and Activity
          load underneath. It used to show four in a two-by-two,
          which is a different screen from the one the app renders. */}
      <div className={styles.homeGrid}>
        <FocusPanel />
        <div className={styles.vitals}>
          {VITALS.map((vital) => (
            <VitalCard key={vital.id} vital={vital} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- scoreboard ---------------------------------------------- */

/** the three panels of the board, laid out flat and side by side.
 *
 *  There is no active/inactive here on purpose. Dimming two of the
 *  three is section 09's argument, and it belongs to the section
 *  that makes it — this is the board as the app draws it. */
export function ScoreboardShot() {
  return (
    <PeriodContext.Provider value="week">
      <div className={styles.screen}>
        <PageHeader
          title="Scoreboard"
          subhead="Sport stats only. This is the part of the product that is safe to share."
        />
        <div className={styles.bento}>
          <div className={styles.zones}>
            <ShotZonesField />
          </div>
          <div className={styles.ratings}>
            <SkillRatings />
            <WhereToWorkNext />
          </div>
          <div className={styles.mechanics}>
            <ShotTrend />
            <ShotArc />
          </div>
        </div>
      </div>
    </PeriodContext.Provider>
  );
}

/* ---- insights ------------------------------------------------ */

const OPENING: ChatMessage = {
  id: 'open',
  from: 'aera',
  text: 'Ask for something to work on. I read your own sessions and patterns — nothing leaves the device.',
};

/* HOW MANY COLUMNS THE LIBRARY RUNS AT ON A PLATE.

   The app decides this from the WINDOW width; a plate has no window,
   so it asks the same function about the plate's own logical width
   instead of being told a number. At 1440 that is three — which is
   what the app renders on any laptop — and it was hard-coded to two,
   so the landing page was showing a library layout the product does
   not have. Two columns also made every card half the plate wide,
   and a 16:9 well at that width is 240px tall: six of them stacked
   three deep came to 1260px inside an 745px box, and the bottom row
   was cut off by the plate's own clip. */
const LIBRARY_COLUMNS = columnCountFor(Number.parseFloat(landing.shotWidth));

export function InsightsShot() {
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING]);

  const send = (text: string) => {
    const answer = askAera(text);
    setMessages((prev) => [
      ...prev,
      { id: `${prev.length}-you`, from: 'you', text },
      { id: `${prev.length}-aera`, from: 'aera', text: answer.text, source: answer.source },
    ]);
  };

  return (
    <div className={styles.screen}>
      <PageHeader
        title="Insights"
        subhead="Built from your own sessions, on-device. Pull what you want — nothing here is pushed at you."
      />
      <div className={styles.split}>
        <div className={styles.aside}>
          <ChatPanel messages={messages} suggestions={ASK_SEEDS} onSend={send} />
        </div>
        {/* TWO ROWS OF THE LIBRARY, TILED — see the note in the
            stylesheet. The app packs its columns and lets the page
            scroll; a plate has no page to scroll, so the rows are
            fractions of the room the header leaves and every card
            comes out the same height. */}
        <div
          className={styles.grid}
          style={{ '--library-columns': LIBRARY_COLUMNS } as CSSProperties}
        >
          {INSIGHTS.slice(0, LIBRARY_COLUMNS * 2).map((insight) => (
            <InsightCard key={insight.id} insight={insight} id={`landing-${insight.id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
