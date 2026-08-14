import { ScreenHeader } from '../components/chrome/ScreenHeader';
import { PointsBlock } from '../features/scoreboard/PointsBlock';
import { ShotMechanics } from '../features/scoreboard/ShotMechanics';
import { ShotZones } from '../features/scoreboard/ShotZones';
import { SkillsPanel } from '../features/scoreboard/SkillsPanel';
import styles from './Scoreboard.module.css';

/** the bento grid — compact blocks, sport statistics only */
export function Scoreboard() {
  return (
    <section>
      <ScreenHeader
        title="Scoreboard"
        description="Session 14, sport stats only. This is the part that is safe to share."
      />
      <div className={styles.bento}>
        <ShotZones className={styles.zones} />
        <PointsBlock className={styles.points} />
        <ShotMechanics className={styles.mechanics} />
        <SkillsPanel className={styles.skills} />
      </div>
    </section>
  );
}
