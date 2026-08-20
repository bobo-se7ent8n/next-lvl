/* ============================================================
   PERIOD

   The scoreboard reads over a window, not over one game. Every
   number on the screen — the shot field, the skill ratings, the
   overall score and the two things worth working on — is derived
   from the period on the selector, so switching it recalculates
   the page rather than relabelling it.

   The variation is DETERMINISTIC: hashed from the period id, so a
   period always reads the same way and nothing shifts under you
   between visits. It is not random data dressed up as a session —
   it is one baseline, shifted by a stable amount per window.
   ============================================================ */

import { SKILLS, ZONES, type CourtZone } from './scoreboard';

export type PeriodId = 'session' | 'week' | 'month' | 'season';

export interface Period {
  id: PeriodId;
  label: string;
  /** what the mono meta line says this window covers */
  meta: string;
}

/** How many times the scoreboard has been entered.
 *
 *  A module-level counter, because it has to survive the unmount
 *  that leaving the tab causes — that unmount IS the event being
 *  counted. It is stepped from a `useState` initialiser, which runs
 *  exactly once per mount, so entering the tab advances the window
 *  by one and re-rendering inside the tab never does.
 *
 *  Deterministic: the sequence is a fixed cycle through PERIODS, not
 *  a random pick, so the same nth visit always reads the same way. */
let entries = -1;
let stepping = false;

export function nextPeriod(): PeriodId {
  /* StrictMode invokes a `useState` initialiser twice for the same
     mount, which stepped the window by two and made the cycle skip
     half the periods. Both calls land in one microtask flush, so a
     flag cleared on the next tick collapses them into a single
     entry — and the sequence stays a plain deterministic cycle. */
  if (!stepping) {
    stepping = true;
    entries += 1;
    queueMicrotask(() => {
      stepping = false;
    });
  }
  return PERIODS[entries % PERIODS.length].id;
}

export const PERIODS: Period[] = [
  { id: 'session', label: 'Session', meta: 'Apr 12 · Tuesday scrimmage · 62 min' },
  { id: 'week', label: 'Week', meta: 'Apr 06 – Apr 12 · four sessions · 3h 47m' },
  { id: 'month', label: 'Month', meta: 'March – April · fourteen sessions · 13h 20m' },
  { id: 'season', label: 'Season', meta: 'Since November · sixty-one sessions · 58h' },
];

/** stable 0..1 from a string — the same period always shifts the
 *  same way, so nothing moves between visits */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/** a signed shift in [-span, +span], stable for this seed */
function shift(seed: string, span: number): number {
  return (hash01(seed) * 2 - 1) * span;
}

/** how much more shooting a longer window contains */
const VOLUME: Record<PeriodId, number> = {
  session: 1,
  week: 3.4,
  month: 11.2,
  season: 46,
};

export interface PeriodData {
  zones: CourtZone[];
  totals: { makes: number; attempts: number; pct: number };
  skills: { shooting: Array<{ label: string; value: number }>; handling: Array<{ label: string; value: number }> };
  average: number;
  workNext: Array<{ label: string; value: number; note: string }>;
}

/* the sentence attached to a rating when it surfaces as the thing
   worth working on. Written per skill rather than generated, so the
   copy stays specific and stays neutral. */
const WORK_NOTE: Record<string, string> = {
  Balance:
    'The lowest movement rating. It moves with late-session fatigue, not with anything technical.',
  'Three-point':
    'The lowest shooting rating. It sits lower on right-wing attempts than anywhere else on the floor.',
  'Off-dribble':
    'The lowest shooting rating. It separates from the catch-and-shoot number as the shot clock drops.',
  'Ball handling':
    'The lowest movement rating. It tracks with possession length rather than with defensive pressure.',
  'First step':
    'The lowest movement rating. It is steadiest early and drifts across the second half of a session.',
  Finishing: 'The lowest shooting rating. It holds at the rim and falls away through the short mid-range.',
  'Mid-range': 'The lowest shooting rating. It moves with how set the feet are rather than with distance.',
  Agility: 'The lowest movement rating. It is closest to baseline on the first possession after a rest.',
  'Free throw': 'The lowest shooting rating. It varies least of any reading here, and it varies late.',
  'Catch-and-shoot':
    'The lowest shooting rating. It sits lower when the pass arrives behind the shooting shoulder.',
};

/** every reading on the scoreboard, for one window */
export function periodData(id: PeriodId): PeriodData {
  const volume = VOLUME[id];

  /* The field: same shape, shifted accuracy, scaled attempts.
   *
   *  TWO shifts, and the first one matters most. A per-zone shift
   *  alone averaged out to nothing across ten zones — the overall
   *  FG% came out the same on every window, which made the selector
   *  look broken. `bias` moves the whole window together; the
   *  per-zone term then redistributes within it. */
  const bias = shift(`${id}:overall`, 0.06);
  const zones: CourtZone[] = ZONES.map((zone) => {
    const attempts = Math.max(4, Math.round(zone.attempts * volume));
    const base = zone.makes / zone.attempts;
    const pct = Math.min(0.92, Math.max(0.14, base + bias + shift(`${id}:${zone.id}`, 0.05)));
    return { ...zone, attempts, makes: Math.round(attempts * pct) };
  });

  const makes = zones.reduce((a, z) => a + z.makes, 0);
  const attempts = zones.reduce((a, z) => a + z.attempts, 0);

  /* the ratings: the same skills, each nudged by a stable amount */
  const skillBias = shift(`${id}:skill`, 5);
  const rate = (group: Array<{ label: string; value: number }>) =>
    group.map((s) => ({
      ...s,
      value: Math.round(
        Math.min(97, Math.max(38, s.value + skillBias + shift(`${id}:${s.label}`, 7))),
      ),
    }));

  const shooting = rate(SKILLS.shooting);
  const handling = rate(SKILLS.handling);
  const all = [...shooting, ...handling];
  const average = Math.round(all.reduce((a, s) => a + s.value, 0) / all.length);

  /* the two lowest ratings are the two worth working on — which
     ones those are changes with the window, because the numbers do */
  const workNext = [...all]
    .sort((a, b) => a.value - b.value)
    .slice(0, 2)
    .map((s) => ({
      label: s.label,
      value: s.value,
      note: WORK_NOTE[s.label] ?? 'The lowest rating in this window. It has not yet repeated enough to read as a pattern.',
    }));

  return {
    zones,
    totals: { makes, attempts, pct: Math.round((makes / attempts) * 100) },
    skills: { shooting, handling },
    average,
    workNext,
  };
}
