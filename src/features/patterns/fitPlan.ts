/* ============================================================
   POPUP FIT

   A popup fits on the screen it is opened on. It does not scroll
   inside itself, it does not clip its last row, and it does not
   shrink its type to get there.

   What gives, in order:

     1. the VERTICAL RHYTHM — the spacing tokens step down a size
     2. the VIZ BLOCK — the chart gets shorter
     3. the HISTORY — rows come off the OLDEST end, and the label
        stops claiming to be the full history the moment it isn't

   Type is never part of the trade. The smallest type token is the
   floor, and a popup that still cannot fit drops another history
   row rather than going below it.
   ============================================================ */

/** how tight the popup's spacing is */
export type Density = 'roomy' | 'tight' | 'compact';

export interface FitPlan {
  density: Density;
  /** the height the chart block is drawn at, in px */
  vizHeight: number;
  /** how many history rows are shown, counting back from the newest */
  historyRows: number;
}

/* The LADDER — every plan the popup may fall back to, most generous
   first. The popup starts at the top and steps down until its content
   stands inside its box, so the fit is MEASURED rather than predicted:
   a model has to guess how many lines the body text wraps to at each
   width, and it guessed wrong at 390px.

   The order encodes the priority the brief sets:
     1. tighten the vertical rhythm
     2. shorten the chart
     3. drop history rows, oldest first
   Type is not on the ladder at any step. */

const VIZ_STEPS = [132, 108, 88, 64] as const;

/** below this many rows the history has stopped being a history */
const MIN_ROWS = 3;

export function buildLadder(totalRows: number): FitPlan[] {
  const ladder: FitPlan[] = [];
  const viz = VIZ_STEPS[0];

  /* 1 — rhythm */
  for (const density of ['roomy', 'tight', 'compact'] as const) {
    ladder.push({ density, vizHeight: viz, historyRows: totalRows });
  }
  /* 2 — chart */
  for (const v of VIZ_STEPS.slice(1)) {
    ladder.push({ density: 'compact', vizHeight: v, historyRows: totalRows });
  }
  /* 3 — history, oldest off first */
  for (let rows = totalRows - 1; rows >= MIN_ROWS; rows--) {
    ladder.push({
      density: 'compact',
      vizHeight: VIZ_STEPS[VIZ_STEPS.length - 1],
      historyRows: rows,
    });
  }

  return ladder;
}

/** what the history block is allowed to call itself. It stops saying
 *  "full history" the moment it stops being one — nothing disappears
 *  from this popup silently. */
export function historyLabel(shown: number, total: number): string {
  return shown >= total ? 'Full history · confirmed across sessions' : `Last ${shown} sessions`;
}
