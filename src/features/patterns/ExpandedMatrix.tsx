import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { DataDotMatrix } from '../../vendor/pixel-motion/DataDotMatrix';
import { EXPANDED_VIZ, expandedCutFor } from '../../vendor/pixel-motion/recipes/expanded';
import { duration } from '../../tokens';
import type { Pattern } from '../../data/types';
import styles from './ExpandedCard.module.css';

export interface ExpandedMatrixProps {
  pattern: Pattern;
  /** the chart a pattern with no dot-matrix recipe draws instead */
  children: ReactNode;
}

/** how long the well has to hold its size before it is cut for */
const SETTLE_MS = Number.parseFloat(duration.fast);

/* ============================================================
   THE OPENED PATTERN'S CHART — the card's own dot matrix, cut for
   the panel's well.

   WHICH CUT IS A MEASUREMENT, AND IT WAITS FOR THE CARD TO LAND.
   The panel relays itself out as it grows out of the hand, so for
   the length of the flight its well changes size every frame. Every
   change of cut is a new recipe, and a new recipe restarts the
   reveal — measured naively, the sweep would start over a dozen times
   before the card arrived. So the well is only cut for once it has
   held one size for `SETTLE_MS`: while the card is in the air the
   well is its empty ground, and the chart sweeps in, once, after it
   lands. The same gesture the card made on entering the tab.

   THE LOOKUP NEVER BUILDS. `expandedCutFor` turns the settled box
   into a row count — Paper's 32x23 cut when the chart fits in what
   the well shows, the most rows that fit when it does not — and the
   row count picks one of the frozen recipes made at module load; see
   recipes/expanded.ts. Nothing here constructs a recipe or a series.

   THE MATRIX IS THE WHOLE WELL. A bar pattern's opened chart used to
   carry each value and its category name in a row of annotations
   under the dots. Paper's popup draws the matrix alone, edge to edge
   of the well, and the source block and the history beside and below
   it carry the words — so the annotations are gone.

   A pattern without a data-matrix entry renders `children` — the
   chart it drew before — exactly as `CardViz` does for the card.
   ============================================================ */
export function ExpandedMatrix({ pattern, children }: ExpandedMatrixProps) {
  const entry = EXPANDED_VIZ[pattern.id];
  const host = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = host.current;
    if (!entry || !el) return;
    let timer = 0;
    const measure = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        /* the LAYOUT box, not the painted one: the flight rotates the
           card, and a rotated box's bounding rect is not its size */
        const width = el.clientWidth;
        const height = el.clientHeight;
        if (width < 1 || height < 1) return;
        const next = expandedCutFor(width, height, entry);
        /* an unchanged row count keeps the same recipe reference, so a
           sub-pixel reflow can never restart the reveal */
        setRows((prev) => (prev === next ? prev : next));
      }, SETTLE_MS);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [entry]);

  if (!entry) return <>{children}</>;

  return (
    <div className={styles.matrix}>
      <div ref={host} className={styles.matrixField}>
        {rows != null ? (
          <DataDotMatrix
            recipe={entry.recipes[rows]}
            data={entry.data}
            autoPlay
            className={styles.matrixCanvas}
            ariaLabel={entry.ariaLabel}
          />
        ) : null}
      </div>
    </div>
  );
}
