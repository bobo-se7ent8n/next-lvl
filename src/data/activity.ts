import { seeded } from '../lib/chart';
import type { ActivityDay } from './types';

export const ACTIVITY_WEEKS = 18;
export const ACTIVITY_TOTAL = 81;
export const ACTIVITY_PEAK = 7;
const PEAK_WEEK = 18;

export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const SESSION_NAMES = [
  'Solo shooting',
  'Skills session',
  'Pickup run',
  'Scrimmage',
  'Shooting + handling',
];

/* 81 active days over 18 weeks, deterministic so the calendar is the
   same on every render and in every story. */
function buildActivity(): ActivityDay[] {
  const rand = seeded(20260805);
  const raw = [] as Array<{ week: number; day: number; score: number; level: number }>;
  for (let w = 0; w < ACTIVITY_WEEKS; w++) {
    for (let d = 0; d < 7; d++) {
      raw.push({ week: w, day: d, score: rand() + (d === 0 || d === 6 ? 0.22 : 0), level: 0 });
    }
  }

  const peakIdx = PEAK_WEEK - 1;
  raw.forEach((x) => {
    if (x.week === peakIdx) x.level = 1;
  });

  const rest = raw.filter((x) => x.week !== peakIdx).sort((a, b) => b.score - a.score);
  const perWeek: Record<number, number> = {};
  let active = ACTIVITY_PEAK;
  for (let i = 0; i < rest.length && active < ACTIVITY_TOTAL; i++) {
    const wk = rest[i].week;
    perWeek[wk] = perWeek[wk] ?? 0;
    if (perWeek[wk] >= ACTIVITY_PEAK - 1) continue;
    perWeek[wk]++;
    rest[i].level = 1;
    active++;
  }

  raw
    .filter((x) => x.level > 0)
    .sort((a, b) => b.score - a.score)
    .forEach((x, i) => {
      x.level = i < 14 ? 3 : i < 40 ? 2 : 1;
    });

  const start = new Date(2026, 3, 12);
  return raw.map((x, i) => {
    const back = (ACTIVITY_WEEKS - 1 - x.week) * 7 + (6 - x.day);
    const dt = new Date(start.getTime() - back * 86400000);
    return {
      index: i,
      week: x.week,
      day: x.day,
      level: x.level as 0 | 1 | 2 | 3,
      date: `${MONTHS[dt.getMonth()]} ${dt.getDate()}`,
      count: x.level === 0 ? 0 : x.level === 3 ? 2 : 1,
      name: SESSION_NAMES[(i * 7) % SESSION_NAMES.length],
      duration: x.level === 0 ? '—' : `${28 + x.level * 14 + (i % 3) * 5} min`,
    };
  });
}

export const ACTIVITY: ActivityDay[] = buildActivity();
