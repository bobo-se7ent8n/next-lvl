/* ============================================================
   CALENDAR

   The activity record, addressed by real dates rather than by a
   rolling week index — the month grid needs to be able to page
   backwards and forwards without the data shifting under it.

   Levels are a pure function of the date, so April 2026 looks the
   same on every render, in every story, and after any number of
   pages back and forth.
   ============================================================ */

export type ActivityLevel = 0 | 1 | 2 | 3;

export interface CalendarDay {
  key: string;
  year: number;
  month: number;
  day: number;
  /** false for the leading and trailing days of a neighbouring month */
  inMonth: boolean;
  level: ActivityLevel;
  count: number;
  name: string;
  duration: string;
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** the month the product opens on */
export const CALENDAR_ORIGIN = { year: 2026, month: 3 } as const;
/** nothing was recorded before this — paging stops here */
export const CALENDAR_FIRST = { year: 2025, month: 10 } as const;

const SESSION_NAMES = [
  'Solo shooting',
  'Skills session',
  'Pickup run',
  'Scrimmage',
  'Shooting + handling',
];

/** deterministic 0..1 for one calendar date */
function hash01(year: number, month: number, day: number): number {
  let h = (year * 10000 + month * 100 + day) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** what happened on one day. Weekends carry a little more weight. */
export function activityFor(year: number, month: number, day: number): {
  level: ActivityLevel;
  count: number;
  name: string;
  duration: string;
} {
  const weekday = new Date(year, month, day).getDay();
  const r = hash01(year, month, day) + (weekday === 0 || weekday === 6 ? 0.16 : 0);
  const level: ActivityLevel = r < 0.46 ? 0 : r < 0.68 ? 1 : r < 0.87 ? 2 : 3;
  const idx = (year + month * 31 + day * 7) % SESSION_NAMES.length;
  return {
    level,
    count: level === 0 ? 0 : level === 3 ? 2 : 1,
    name: SESSION_NAMES[idx],
    duration: level === 0 ? '—' : `${26 + level * 15 + (day % 3) * 4} min`,
  };
}

function cell(year: number, month: number, day: number, inMonth: boolean): CalendarDay {
  const a = activityFor(year, month, day);
  return {
    key: `${year}-${month}-${day}`,
    year,
    month,
    day,
    inMonth,
    level: inMonth ? a.level : 0,
    count: inMonth ? a.count : 0,
    name: a.name,
    duration: a.duration,
  };
}

/** the month laid out as weeks of seven, Sunday first, with the
 *  neighbouring days that complete the first and last rows */
export function monthMatrix(year: number, month: number): CalendarDay[][] {
  const first = new Date(year, month, 1);
  const lead = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrev = new Date(year, month, 0).getDate();

  const flat: CalendarDay[] = [];
  for (let i = lead - 1; i >= 0; i--) {
    flat.push(cell(prevYear, prevMonth, daysInPrev - i, false));
  }
  for (let d = 1; d <= daysInMonth; d++) flat.push(cell(year, month, d, true));

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let d = 1;
  while (flat.length % 7 !== 0) flat.push(cell(nextYear, nextMonth, d++, false));

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < flat.length; i += 7) weeks.push(flat.slice(i, i + 7));
  return weeks;
}

/** the readings for one month — the stats row is scoped to what is
 *  actually on screen, never to a rolling window behind it */
export function monthStats(year: number, month: number) {
  const days = monthMatrix(year, month)
    .flat()
    .filter((d) => d.inMonth);
  const active = days.filter((d) => d.level > 0);
  const sessions = active.reduce((a, d) => a + d.count, 0);
  const minutes = active.reduce((a, d) => a + (parseInt(d.duration, 10) || 0), 0);
  return {
    sessions,
    days: active.length,
    hours: Math.round(minutes / 60),
  };
}

export function stepMonth(year: number, month: number, by: number) {
  const total = year * 12 + month + by;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

export function isBefore(a: { year: number; month: number }, b: { year: number; month: number }) {
  return a.year * 12 + a.month < b.year * 12 + b.month;
}
