import { useEffect, useRef, useState } from 'react';
import { EnterContext } from '../../lib/enterContext';
import { AppWindow } from './AppWindow';
import { LandingSection } from './LandingSection';
import { ScreenPlate } from './ScreenPlate';
import { HomeShot } from './screens';
import styles from './LandingWorking.module.css';

/**
 * SEE IT WORKING.
 *
 * The turn in the argument: everything above it is a claim, and
 * this is the first thing on the page that is the actual product.
 * One window, one screen — Focus and vitals — and nothing else in
 * the section at all.
 *
 * IT IS ONE WINDOW TALL AND IT DOES NOT SCROLL. That is the claim
 * the section makes and the reason it is stripped back to a single
 * object: it used to carry a dot-matrix field behind the frame, a
 * paragraph under the heading and three columns of copy beneath
 * that, none of which could be on the same screen as the thing they
 * were describing. What is left is the product, at its own
 * proportions, with a number and a heading over it.
 *
 * THE SCREEN RE-READS ITSELF EVERY TIME THE SECTION ARRIVES. The
 * enter key is bumped when the section scrolls into view, so the
 * numbers count up and the dot field assembles exactly as they do
 * when you open the tab inside the app — and again the next time
 * you scroll back to it, which is what makes it read as running
 * rather than as a screenshot.
 */
export function LandingWorking() {
  const host = useRef<HTMLDivElement>(null);
  const [visit, setVisit] = useState(0);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        /* only on the way IN. Bumping on every callback would
           re-animate the screen as it left the window too, which is
           motion nobody is looking at. */
        if (entry.isIntersecting) setVisit((n) => n + 1);
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <LandingSection heading="See it working" centred fit>
      <div ref={host} className={styles.frame}>
        <AppWindow title="aera · /app/home">
          {/* keyed on the visit so the arriving screen settles in, and
              scoped on it so everything inside re-reads itself */}
          <div key={visit} className={styles.settle}>
            <EnterContext.Provider value={visit}>
              <ScreenPlate live>
                <HomeShot />
              </ScreenPlate>
            </EnterContext.Provider>
          </div>
        </AppWindow>
      </div>
    </LandingSection>
  );
}
