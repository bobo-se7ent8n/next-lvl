/* ============================================================
   SCOREBOARD DATA

   Sport statistics only. This is the one part of the product that
   is safe to share — nothing behavioural or physiological appears
   on this screen.
   ============================================================ */

export interface CourtZone {
  id: string;
  label: string;
  short: string;
  makes: number;
  attempts: number;
  /** rect in the half-court viewBox, basket at the bottom */
  x: number;
  y: number;
  w: number;
  h: number;
}

export const COURT_VIEWBOX = { w: 360, h: 266 } as const;

export const ZONES: CourtZone[] = [
  /* laid out the way the court reads: the top-of-key three is the
     furthest shot, the corners sit nearest the baseline, the mid-range
     pair is inside the line and the paint is at the rim */
  { id: 'lw3', label: 'left wing 3', short: 'L wing', makes: 11, attempts: 34, x: 8, y: 8, w: 84, h: 52 },
  { id: 'tk3', label: 'top of key 3', short: 'Top key', makes: 14, attempts: 47, x: 134, y: 8, w: 92, h: 52 },
  { id: 'rw3', label: 'right wing 3', short: 'R wing', makes: 9, attempts: 31, x: 268, y: 8, w: 84, h: 52 },
  { id: 'lc3', label: 'left corner 3', short: 'L corner', makes: 6, attempts: 19, x: 8, y: 70, w: 84, h: 52 },
  { id: 'rc3', label: 'right corner 3', short: 'R corner', makes: 8, attempts: 22, x: 268, y: 70, w: 84, h: 52 },
  { id: 'midL', label: 'mid-range left', short: 'Mid L', makes: 12, attempts: 30, x: 62, y: 134, w: 92, h: 48 },
  { id: 'midR', label: 'mid-range right', short: 'Mid R', makes: 15, attempts: 38, x: 206, y: 134, w: 92, h: 48 },
  { id: 'paint', label: 'paint', short: 'Paint', makes: 19, attempts: 50, x: 128, y: 192, w: 104, h: 46 },
];

export const ZONE_TOTALS = {
  makes: ZONES.reduce((a, z) => a + z.makes, 0),
  attempts: ZONES.reduce((a, z) => a + z.attempts, 0),
};

/* ------------------------------------------------------------
   SHOT MECHANICS — the arc diagram plus the three readings
   ------------------------------------------------------------ */
export const MECHANICS = {
  /** launch angle at release, in degrees */
  arcAngle: 46,
  /** apex height above the floor, in metres */
  apexHeight: 3.4,
  /** distance from release to apex, in metres */
  apexDistance: 4.1,
  /** shooting distance, in metres */
  shotDistance: 6.75,
  releaseHeight: 2.3,
  rows: [
    {
      id: 'arc',
      label: 'Arc angle',
      value: '46',
      unit: '°',
      note: '43–48° holds the softest landing on the rim',
      quality: 0.86,
    },
    {
      id: 'release',
      label: 'Release time',
      value: '0.58',
      unit: 's',
      note: 'catch to ball leaving the hand, unpressured reps',
      quality: 0.72,
    },
    {
      id: 'consistency',
      label: 'Motion consistency',
      value: '81',
      unit: '/ 100',
      note: 'frame-to-frame agreement across the shooting motion',
      quality: 0.81,
    },
  ],
  source:
    'measured on 328 tracked shots across sessions 9–14 · on-device pose and ball tracking',
};

/* ------------------------------------------------------------
   POINTS — three windows. The two wider windows carry a tendency;
   a single scrimmage has nothing to trend against.
   ------------------------------------------------------------ */
export type PointsRange = 'last' | 'last5' | 'all';

export interface PointsWindow {
  id: PointsRange;
  label: string;
  value: string;
  unit: string;
  caption: string;
  /** neutral sentence about direction — never praise, never warning */
  tendency?: string;
  /** 0..1 quality, drives the semantic colour of the tendency mark */
  tendencyQuality?: number;
  splits: Array<{ label: string; made: number; attempts: number }>;
  series: number[];
}

export const POINTS: Record<PointsRange, PointsWindow> = {
  last: {
    id: 'last',
    label: 'Last scrimmage',
    value: '18',
    unit: 'pts',
    caption: 'Apr 12 · Tuesday scrimmage · 62 min',
    splits: [
      { label: '2PT', made: 5, attempts: 11 },
      { label: '3PT', made: 2, attempts: 8 },
      { label: 'FT', made: 2, attempts: 2 },
    ],
    series: [18],
  },
  last5: {
    id: 'last5',
    label: 'Last 5 scrimmages',
    value: '17.4',
    unit: 'pts avg',
    caption: 'five most recent full-court runs',
    tendency: 'Up 1.2 on the five before it.',
    tendencyQuality: 0.78,
    splits: [
      { label: '2PT', made: 24, attempts: 52 },
      { label: '3PT', made: 11, attempts: 34 },
      { label: 'FT', made: 12, attempts: 14 },
    ],
    series: [14, 21, 16, 18, 18],
  },
  all: {
    id: 'all',
    label: 'All time',
    value: '15.8',
    unit: 'pts avg',
    caption: '14 recorded scrimmages since December',
    tendency: 'Up 2.0 across the recorded set.',
    tendencyQuality: 0.74,
    splits: [
      { label: '2PT', made: 61, attempts: 138 },
      { label: '3PT', made: 27, attempts: 84 },
      { label: 'FT', made: 33, attempts: 41 },
    ],
    series: [12, 14, 11, 15, 13, 17, 14, 16, 15, 19, 14, 21, 16, 18],
  },
};

export const POINTS_ORDER: PointsRange[] = ['last', 'last5', 'all'];

/* ------------------------------------------------------------
   SKILLS
   ------------------------------------------------------------ */
export const SKILLS = {
  shooting: [
    { label: 'Catch & shoot', value: 78 },
    { label: 'Off the dribble', value: 64 },
    { label: 'Free throw', value: 85 },
    { label: 'Contested 3', value: 52 },
    { label: 'Corner 3', value: 71 },
  ],
  handling: [
    { label: 'Ball security', value: 69 },
    { label: 'Change of pace', value: 58 },
    { label: 'First step', value: 74 },
    { label: 'Finishing at rim', value: 66 },
  ],
};

export const SKILL_AVERAGE = 70;
