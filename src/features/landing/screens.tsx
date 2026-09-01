import { useState } from 'react';
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
import { columnize } from '../../lib/columns';
import { ASK_SEEDS, INSIGHTS, VITALS } from '../../data';
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
        <div className={styles.grid}>
          {columnize(INSIGHTS.slice(0, 6), 2).map((column, i) => (
            <div key={i} className={styles.column}>
              {column.map((insight) => (
                <InsightCard key={insight.id} insight={insight} id={`landing-${insight.id}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
