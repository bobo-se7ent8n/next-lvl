import { PageHeader } from '../components/chrome/PageHeader';
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
  return (
    <section className={styles.screen}>
      <PageHeader
        title="Scoreboard"
        subhead="Session 14, sport stats only. This is the part of the product that is safe to share."
      />

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
    </section>
  );
}
