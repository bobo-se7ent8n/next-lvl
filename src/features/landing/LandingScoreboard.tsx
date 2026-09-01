import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import { EnterContext } from '../../lib/enterContext';
import { ShotArc } from '../scoreboard/ShotArc';
import { ShotTrend } from '../scoreboard/ShotTrend';
import { ShotZonesField } from '../scoreboard/ShotZonesField';
import { SkillRatings, WhereToWorkNext } from '../scoreboard/SkillRatings';
import { PeriodContext } from '../scoreboard/periodContext';
import { FitBox } from './FitBox';
import { LandingSection } from './LandingSection';
import styles from './LandingScoreboard.module.css';

const TABS = [
  { id: 'zones', label: 'Shot zones' },
  { id: 'skills', label: 'Skills' },
  { id: 'mechanics', label: 'Shot mechanics' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/**
 * THE SCOREBOARD, FLAT.
 *
 * The whole board is on the page at once, at the size the app draws
 * it, with no frame around it: this is the part of the product that
 * is safe to share, so it is the one screen shown without a device
 * standing between the reader and it.
 *
 * ONLY THE PANEL THAT JUST BECAME ACTIVE RE-READS ITSELF.
 *
 * Every panel below counts its numbers up, fills its zones and
 * draws its arc when its enter key changes — that is how a tab
 * change works everywhere else in the product. The keys are held
 * per panel and only the arriving one is bumped, so switching to
 * Skills re-runs the rating bars and leaves the court and the arc
 * exactly where they were. Bumping a single shared key would
 * re-animate all three every time, which would make two thirds of
 * the motion on the page a reaction to something nobody did.
 */
export function LandingScoreboard() {
  const [active, setActive] = useState<TabId>('zones');
  /* one enter key per panel, bumped only for the panel being opened */
  const [keys, setKeys] = useState<Record<TabId, number>>({
    zones: 0,
    skills: 0,
    mechanics: 0,
  });

  const open = (id: TabId) => {
    if (id === active) return;
    setActive(id);
    setKeys((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const panel = (id: TabId, children: ReactNode, spread?: boolean) => (
    <div
      className={cx(styles.panel, spread && styles.spread, active !== id && styles.dim)}
      /* inactive panels hold their last state and take no clicks */
      aria-hidden={active === id ? undefined : true}
    >
      <EnterContext.Provider value={`${id}-${keys[id]}`}>{children}</EnterContext.Provider>
    </div>
  );

  return (
    <LandingSection
      heading="Scoreboard"
      body="Your sport stats, and only your sport stats. Switch a panel on and it re-reads itself in front of you — the other two hold whatever they last said."
      centred
      fit
    >
      <div className={styles.tabs} role="tablist" aria-label="Scoreboard panels">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            onClick={() => open(tab.id)}
            className={cx(styles.tab, tab.id === active && styles.tabOn)}
          >
            <Label tone="inherit">{tab.label}</Label>
          </button>
        ))}
      </div>

      {/* THE BOARD IS SCALED TO FIT, NOT CROPPED.

          It is the app's bento at the app's own proportions, and the
          app gives it a whole browser window. Here it has one
          viewport less a heading, a line of copy and a tab strip —
          so on anything short of a large display its natural height
          runs past the section. Shrinking is the only one of the
          three available answers that does not contradict what the
          section is claiming. */}
      <PeriodContext.Provider value="week">
        <FitBox className={styles.fit}>
        <div className={styles.board}>
          {panel('zones', <ShotZonesField />)}
          {panel(
            'skills',
            <>
              <SkillRatings />
              <WhereToWorkNext />
            </>,
          )}
          {panel(
            'mechanics',
            <>
              <ShotTrend />
              <ShotArc />
            </>,
            /* the mechanics column carries two short cards where the
               other two carry one tall one, so its content has to be
               told to reach the bottom — see the stylesheet */
            true,
          )}
        </div>
        </FitBox>
      </PeriodContext.Provider>
    </LandingSection>
  );
}
