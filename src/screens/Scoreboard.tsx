import { PageHeader } from '../components/chrome/PageHeader';
import { useState } from 'react';
import { nextPeriod } from '../data/period';
import { PeriodContext } from '../features/scoreboard/periodContext';
import { ShotTrend } from '../features/scoreboard/ShotTrend';
import { ShotArc } from '../features/scoreboard/ShotArc';
import { ShotZonesField } from '../features/scoreboard/ShotZonesField';
import { SkillRatings, WhereToWorkNext } from '../features/scoreboard/SkillRatings';
import styles from './Scoreboard.module.css';

/** The bento — three columns, no bottom row, and the whole thing on
 *  one screen. The court used to be clipped, the ratings ran past the
 *  viewport and the mechanics footnote was below the fold; the bento
 *  is now exactly one shared column tall and every card inside it
 *  gives its graphic whatever the readings leave. Sport stats only. */
export function Scoreboard() {
  /* THE TAB IS THE SWITCH.
   *
   *  There is no period selector on the page any more. The window is
   *  chosen from the enter key — the value that changes every time
   *  this tab is entered — so arriving at the scoreboard recalculates
   *  it. Every number and every dot animates exactly as it did when a
   *  pill drove it; only what pulls the trigger has changed. */
  const [period] = useState(nextPeriod);

  return (
    <section className={styles.screen}>
      <PageHeader
        title="Scoreboard"
        subhead="Sport stats only. This is the part of the product that is safe to share."
      />

      <PeriodContext.Provider value={period}>
      <div className={styles.bento}>
        <ShotZonesField className={styles.zones} />

        <div className={styles.ratings}>
          <SkillRatings />
          <WhereToWorkNext />
        </div>

        <div className={styles.stack}>
          <ShotTrend />
          <ShotArc />
        </div>
      </div>
      </PeriodContext.Provider>
    </section>
  );
}
