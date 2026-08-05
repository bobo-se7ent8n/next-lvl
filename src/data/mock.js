/**
 * Every placeholder value in the app lives here.
 * Components read from this file — nothing is hardcoded in a screen.
 */

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/* ============================================================
   HOME · today's read
   ============================================================ */

export const TODAYS_READ = {
  headline:
    'In your last scrimmage, your release sped up the 3 times you missed under a closeout.',
  experimentLabel: 'one experiment',
  experiment: "Next session: one breath before the gather. That's it.",
  source: 'from Session 14 · 3 days ago',
  sessionIndex: 0,
}

/* ============================================================
   HOME · focus

   Three plain-language answers, in order: what was seen, why it
   happens, and the one thing to do about it. No diagram, no graph —
   the whole point is that it reads like a sentence someone said.

   One focus at a time. There is no second item to page to.
   ============================================================ */

export const FOCUS = {
  kicker: 'Session 14',
  stat: '0.42s',
  statLabel: 'release under pressure',
  sessionIndex: 0,
  steps: [
    {
      label: 'What we saw',
      tone: 'lavender',
      text: 'Your release sped up on all three shots you missed under a closeout — 0.19s faster than your own baseline.',
    },
    {
      label: 'Why it happens',
      tone: 'sky',
      text: 'A defender arriving late reads as urgency, so the gather starts before your feet are set. The same quickening shows up whenever the shot clock drops under five.',
    },
    {
      label: 'What to do',
      tone: 'yellow',
      text: 'One breath before the gather. Nothing else changes — same shot, same feet, one beat of air first.',
    },
  ],
}

/* ============================================================
   HOME · focus archive
   ============================================================ */

export const FOCUSES = [
  {
    date: 'Apr 12 · Session 14',
    read: 'Your release sped up the 3 times you missed under a closeout.',
    experiment: "Next session: one breath before the gather. That's it.",
  },
  {
    date: 'Apr 09 · Session 13',
    read: 'Free-throw routine held its timing even after a long run of makes.',
    experiment:
      'Keep the routine identical on the 10th rep as on the 1st. Count it out loud once.',
  },
  {
    date: 'Apr 06 · Session 12',
    read: 'First breath cue session — release held on 4 of 6 contested looks.',
    experiment: 'Run the same cue two more sessions before judging it.',
  },
  {
    date: 'Apr 03 · Session 11',
    read: 'Handle got quiet in the final ten minutes, before your heart rate moved.',
    experiment:
      'Add one change-of-pace dribble per possession in the last ten minutes.',
  },
  {
    date: 'Mar 30 · Session 10',
    read: 'You shot better on the possession after a make than after a miss.',
    experiment:
      'After a miss, take the same three seconds you take after a make.',
  },
  {
    date: 'Mar 27 · Session 9',
    read: 'Baseline read: release time under pressure averaged 0.61s.',
    experiment:
      'Nothing to change yet — this session is the baseline everything else is measured against.',
  },
]

/* ============================================================
   HOME · vitals
   ============================================================ */

/* Shape and colour are load-bearing here, not decoration:

     kind 'measured' → rounded square. A raw reading off a sensor.
     kind 'score'    → full circle. A composite the app derived.

   Colour follows the same rule. A card stays neutral while its value
   sits inside the player's own baseline; when it lands meaningfully
   outside, the category chip takes a highlighter fill and the marker
   on the range bar matches it. `tone` is the colour that deviation
   earns — lime where drifting out is a good thing, coral where it
   warrants a look.

   `scale` is the axis the range bar is drawn on; `baseline` is the
   player's own normal band inside it. */
export const VITALS = [
  {
    label: 'Stress',
    chart: {
      type: 'bars',
      items: [
        { value: 54, tone: 'mint', label: 'calm' },
        { value: 31, tone: 'yellow', label: 'elevated' },
        { value: 15, tone: 'coral', label: 'peak' },
      ],
    },
    category: 'Measured',
    kind: 'measured',
    value: '32',
    num: 32,
    unit: '/ 100',
    scale: [0, 100],
    baseline: [24, 46],
    state: 'in',
    tone: 'yellow',
  },
  {
    label: 'HRV',
    chart: { type: 'line', tone: 'lime', values: [64, 61, 68, 70, 69, 74] },
    category: 'Measured',
    kind: 'measured',
    value: '74',
    num: 74,
    unit: 'ms',
    scale: [30, 110],
    baseline: [52, 68],
    state: 'above',
    tone: 'lime',
    deviation: '+6 ms',
  },
  {
    label: 'Resting HR',
    chart: { type: 'line', tone: 'sky', values: [57, 56, 55, 56, 54, 54] },
    category: 'Measured',
    kind: 'measured',
    value: '54',
    num: 54,
    unit: 'bpm',
    scale: [40, 80],
    baseline: [48, 58],
    state: 'in',
    tone: 'sky',
  },
  {
    label: 'Resilience',
    chart: {
      type: 'packed',
      items: [
        { value: 71, tone: 'mint', label: 'recovery' },
        { value: 44, tone: 'sky', label: 'hrv rebound' },
        { value: 22, tone: 'tan', label: 'lag' },
      ],
    },
    category: 'Score',
    kind: 'score',
    value: '71',
    num: 71,
    unit: '/ 100',
    scale: [0, 100],
    baseline: [62, 80],
    state: 'in',
    tone: 'mint',
  },
  {
    label: 'Cardio capacity',
    chart: { type: 'area', tone: 'mint', values: [44, 45, 46, 46, 47, 48] },
    category: 'Score',
    kind: 'score',
    value: '48',
    num: 48,
    unit: 'VO₂',
    scale: [30, 65],
    baseline: [44, 52],
    state: 'in',
    tone: 'mint',
  },
  {
    label: 'Activity load',
    chart: {
      type: 'bars',
      items: [
        { value: 62, tone: 'sky', label: 'volume' },
        { value: 84, tone: 'coral', label: 'intensity' },
        { value: 48, tone: 'tan', label: '4-wk avg' },
      ],
    },
    category: 'Score',
    kind: 'score',
    value: '84',
    num: 84,
    unit: '/ 100',
    scale: [0, 100],
    baseline: [40, 72],
    state: 'above',
    tone: 'coral',
    deviation: '+12 over',
  },
]

/* ============================================================
   HOME + SESSIONS · session activity

   A contribution-style grid: one cell per day, fill intensity
   standing for how much work that day held. 0 is simply a day with
   no session on it — the scale has no failure end and the copy
   never implies one. No streaks: a streak turns a gap into a loss,
   and this product does not do that.

   Deterministic so the grid never re-rolls between renders.
   ============================================================ */

const ACTIVITY_WEEKS = 18

export const ACTIVITY = (() => {
  const days = []
  let seed = 20260805
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let w = 0; w < ACTIVITY_WEEKS; w++) {
    for (let d = 0; d < 7; d++) {
      const r = rand()
      // weekends carry a little more, mid-week a little less
      const bias = d === 0 || d === 6 ? 0.22 : 0
      const v = r + bias
      const level = v > 0.86 ? 3 : v > 0.66 ? 2 : v > 0.42 ? 1 : 0
      days.push({ week: w, day: d, level })
    }
  }
  return days
})()

export const ACTIVITY_DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const ACTIVITY_STATS = (() => {
  const total = ACTIVITY.reduce((a, d) => a + (d.level > 0 ? 1 : 0), 0)

  const perWeek = Array.from({ length: ACTIVITY_WEEKS }, (_, w) =>
    ACTIVITY.filter((d) => d.week === w).reduce((a, d) => a + d.level, 0)
  )
  const peakWeek = perWeek.indexOf(Math.max(...perWeek))
  const peakSessions = ACTIVITY.filter(
    (d) => d.week === peakWeek && d.level > 0
  ).length

  return {
    total,
    weeks: ACTIVITY_WEEKS,
    peakWeek: peakWeek + 1,
    peakSessions,
  }
})()

/* ============================================================
   HOME · confirmed patterns

   Every pattern carries the same fields and every card renders them
   the same way, at the same size — no pattern is presented as more
   important than another. What varies is only the data:

     name · hero · context · chart · state

   `chart` is a spec the chart family reads (see components/charts).
   Its *type* differs card to card because the shape of the data
   differs, but the slot it occupies is identical everywhere, so the
   variation never becomes hierarchy.

   `segs` is kept for the pattern detail page, which still shows the
   full segmented breakdown.
   ============================================================ */

const patArticle = (name, cap) => ({
  title: 'Working with: ' + name,
  body:
    'Placeholder body copy for "' +
    name.toLowerCase() +
    '". Tracked as ' +
    cap.toLowerCase() +
    ', this pattern has repeated enough across sessions to confirm — the work now is deciding what, if anything, to do about it.',
  body2:
    'Placeholder continuation. Next block covers drills and film tied to this specific pattern, plus how to tell if the trend is holding.',
})

const rawPatterns = [
  {
    name: 'Rushing under pressure',
    state: 'improving',
    hero: '0.42s',
    context: 'release time under pressure · last 6 sessions',
    delta: '0.61s → 0.42s',
    up: true,
    chart: { type: 'line', tone: 'lime', values: [61, 58, 55, 51, 46, 42] },
    segs: [
      { tone: 'lime', pct: 58, label: 'now', value: '0.42s' },
      { tone: 'sky', pct: 27, label: 'baseline', value: '0.61s' },
      { tone: 'tan', pct: 15, label: 'outliers', value: '0.9s' },
    ],
    quote: 'The rush shows up before the closeout even arrives.',
    cap: 'release time under pressure · last 6 sessions',
  },
  {
    name: 'Handle tightens late',
    state: 'steady',
    hero: '13%',
    context: 'dribble variance, final 10 min',
    delta: '14% → 13%',
    up: false,
    chart: {
      type: 'bars',
      items: [
        { value: 9, tone: 'sky', label: 'early' },
        { value: 10, tone: 'sky', label: 'mid' },
        { value: 13, tone: 'coral', label: 'late' },
      ],
    },
    segs: [
      { tone: 'sky', pct: 62, label: 'first 50 min', value: '9%' },
      { tone: 'coral', pct: 38, label: 'final 10 min', value: '13%' },
    ],
    cap: 'dribble variance, final 10 min · last 6 sessions',
  },
  {
    name: 'Recovers fast after a make',
    state: 'new',
    hero: '+8 pts',
    context: 'next-possession FG% · last 6 sessions',
    delta: '+8 pts',
    up: true,
    chart: {
      type: 'packed',
      items: [
        { value: 61, tone: 'mint', label: 'after make' },
        { value: 53, tone: 'lavender', label: 'after miss' },
        { value: 22, tone: 'tan', label: 'neutral' },
      ],
    },
    segs: [
      { tone: 'mint', pct: 55, label: 'after make', value: '61%' },
      { tone: 'lavender', pct: 45, label: 'after miss', value: '53%' },
    ],
    quote: 'The next possession after a make is measurably calmer.',
    cap: 'next-possession FG% · last 6 sessions',
  },
  {
    name: 'Left-wing hesitation',
    state: 'declining',
    hero: '0.3s',
    context: 'pause before gather, left-wing catches',
    delta: '0.3s pause',
    up: false,
    chart: { type: 'area', tone: 'coral', values: [12, 16, 19, 24, 27, 30] },
    segs: [
      { tone: 'coral', pct: 64, label: 'left wing', value: '0.3s' },
      { tone: 'sky', pct: 36, label: 'right wing', value: '0.1s' },
    ],
    cap: 'hesitation before gather, left-wing catches',
  },
  {
    name: 'Free-throw rhythm',
    state: 'steady',
    hero: '85%',
    context: 'FT% across long make-streaks',
    delta: 'steady at 85%',
    up: false,
    chart: { type: 'line', tone: 'sky', values: [84, 86, 85, 85, 86, 85] },
    segs: [
      { tone: 'lime', pct: 85, label: 'made', value: '85%' },
      { tone: 'tan', pct: 15, label: 'missed', value: '15%' },
    ],
    cap: 'FT% across long make-streaks',
  },
  {
    name: 'Contested-3 confidence',
    state: 'declining',
    hero: '52%',
    context: 'contested 3 FG% · last 5 sessions',
    delta: '58% → 52%',
    up: false,
    chart: {
      type: 'bars',
      items: [
        { value: 71, tone: 'sky', label: 'open' },
        { value: 57, tone: 'yellow', label: 'vs speed' },
        { value: 48, tone: 'coral', label: 'vs length' },
      ],
    },
    segs: [
      { tone: 'coral', pct: 46, label: 'vs length', value: '48%' },
      { tone: 'yellow', pct: 34, label: 'vs speed', value: '57%' },
      { tone: 'sky', pct: 20, label: 'open', value: '71%' },
    ],
    quote: 'Shows up most against length, not against speed.',
    cap: 'contested 3 FG% · last 5 sessions',
  },
  {
    name: 'First-step quickening',
    state: 'improving',
    hero: '+0.08s',
    context: 'first-step acceleration, live reps',
    delta: '+0.08s burst',
    up: true,
    chart: { type: 'line', tone: 'lime', values: [2, 3, 3, 5, 6, 8] },
    segs: [
      { tone: 'lime', pct: 71, label: 'live reps', value: '+0.08s' },
      { tone: 'tan', pct: 29, label: 'drills', value: '+0.02s' },
    ],
    cap: 'first-step acceleration, live reps',
  },
  {
    name: 'Corner-3 footwork',
    state: 'new',
    hero: '74',
    context: 'footwork setup score, corner catches',
    delta: '71 → 74',
    up: false,
    chart: { type: 'area', tone: 'mint', values: [68, 69, 71, 70, 73, 74] },
    segs: [
      { tone: 'mint', pct: 74, label: 'set', value: '74' },
      { tone: 'tan', pct: 26, label: 'rushed', value: '26' },
    ],
    cap: 'footwork setup score, corner catches',
  },
  {
    name: 'Finishing through contact',
    state: 'improving',
    hero: '+6 pts',
    context: 'contested-finish % inside 5 ft',
    delta: '+6 pts',
    up: true,
    chart: {
      type: 'packed',
      items: [
        { value: 64, tone: 'lavender', label: 'clean look' },
        { value: 58, tone: 'lime', label: 'through contact' },
        { value: 18, tone: 'tan', label: 'blocked' },
      ],
    },
    segs: [
      { tone: 'lime', pct: 58, label: 'through contact', value: '58%' },
      { tone: 'lavender', pct: 42, label: 'clean look', value: '64%' },
    ],
    quote: 'Contact no longer changes the shot selection.',
    cap: 'contested-finish % inside 5 ft',
  },
  {
    name: 'Fatigue shifts shot mix',
    state: 'declining',
    hero: '+22%',
    context: 'shot type mix, final 10 minutes',
    delta: 'more pull-ups late',
    up: false,
    chart: {
      type: 'bars',
      items: [
        { value: 22, tone: 'coral', label: 'pull-ups' },
        { value: 18, tone: 'sky', label: 'catch & shoot' },
        { value: 7, tone: 'tan', label: 'rim' },
      ],
    },
    segs: [
      { tone: 'coral', pct: 52, label: 'pull-ups', value: '+22%' },
      { tone: 'sky', pct: 48, label: 'catch & shoot', value: '-18%' },
    ],
    cap: 'shot type mix, final 10 minutes',
  },
  {
    name: 'Ball security',
    state: 'steady',
    hero: '91%',
    context: 'possessions ending in a live turnover',
    delta: 'holding at 91%',
    up: false,
    chart: { type: 'line', tone: 'sky', values: [89, 90, 92, 91, 90, 91] },
    segs: [
      { tone: 'sky', pct: 91, label: 'kept', value: '91%' },
      { tone: 'coral', pct: 9, label: 'lost', value: '9%' },
    ],
    cap: 'possessions ending in a live turnover',
  },
  {
    name: 'Pre-shot routine drift',
    state: 'new',
    hero: '+0.4s',
    context: 'free-throw routine consistency',
    delta: 'routine time +0.4s',
    up: false,
    chart: {
      type: 'bars',
      items: [
        { value: 4, tone: 'yellow', label: 'drifted' },
        { value: 2, tone: 'mint', label: 'on time' },
        { value: 3, tone: 'tan', label: 'early' },
      ],
    },
    segs: [
      { tone: 'yellow', pct: 60, label: 'drifted', value: '+0.4s' },
      { tone: 'mint', pct: 40, label: 'on time', value: '0.0s' },
    ],
    cap: 'free-throw routine consistency',
  },
]

export const PATTERNS = rawPatterns.map((p) => ({
  ...p,
  id: slug(p.name),
  article: patArticle(p.name, p.cap),
}))

/* Neutral trend wording — no guilt language, no "you failed to". */
export const STATE_LABEL = {
  improving: 'Improving',
  steady: 'Steady',
  new: 'New',
  declining: 'Declining',
}

/* ============================================================
   SESSIONS
   ============================================================ */

export const SESSIONS = [
  {
    d: 'Apr 12 · Tuesday scrimmage',
    shots: 41,
    pts: 18,
    reb: 6,
    ast: 4,
    to: 3,
    stl: 2,
    dur: '62 min',
    tag: '1 new pattern',
    cand: 'Release change under closeout',
    cdesc:
      'Your release time dropped 0.09s on contested catch-and-shoot. Seen twice — one more session and it confirms.',
  },
  {
    d: 'Apr 09 · Solo shooting',
    shots: 120,
    pts: 0,
    reb: 0,
    ast: 0,
    to: 0,
    stl: 0,
    dur: '45 min',
    tag: '',
  },
  {
    d: 'Apr 06 · Pickup run',
    shots: 33,
    pts: 14,
    reb: 5,
    ast: 6,
    to: 4,
    stl: 1,
    dur: '70 min',
    tag: '1 new pattern',
    cand: 'Hesitation on catch, left wing',
    cdesc:
      'A 0.3s pause before the gather on left-wing catches. Seen 3 times this session.',
  },
  {
    d: 'Apr 03 · Skills session',
    shots: 58,
    pts: 0,
    reb: 0,
    ast: 0,
    to: 1,
    stl: 0,
    dur: '50 min',
    tag: '',
  },
  {
    d: 'Mar 30 · Sunday scrimmage',
    shots: 44,
    pts: 21,
    reb: 8,
    ast: 3,
    to: 5,
    stl: 3,
    dur: '65 min',
    tag: '',
  },
  {
    d: 'Mar 27 · Solo shooting',
    shots: 140,
    pts: 0,
    reb: 0,
    ast: 0,
    to: 0,
    stl: 0,
    dur: '40 min',
    tag: '',
  },
]

/* Wireframe-level search: numeric stat thresholds ("3+ turnovers"),
   otherwise keyword match. */
export const STATWORDS = {
  turnover: 'to',
  turnovers: 'to',
  to: 'to',
  point: 'pts',
  points: 'pts',
  pts: 'pts',
  rebound: 'reb',
  rebounds: 'reb',
  reb: 'reb',
  assist: 'ast',
  assists: 'ast',
  ast: 'ast',
  steal: 'stl',
  steals: 'stl',
  stl: 'stl',
  shot: 'shots',
  shots: 'shots',
}

export const SESSION_STAT_ROWS = [
  ['Points', 'pts'],
  ['Rebounds', 'reb'],
  ['Assists', 'ast'],
  ['Turnovers', 'to'],
  ['Steals', 'stl'],
  ['Shots', 'shots'],
  ['Duration', 'dur'],
]

/* ============================================================
   SESSIONS · continuous timeline
   ============================================================ */

export const TOTAL = 1800 // 30:00

export const MOMENTS = [
  {
    t: 131,
    label: 'Contested pull-up, right wing',
    insight: 'hesitation on catch',
    desc: '0.3s pause before the gather · seen 2 times so far',
    pin: [64, 32],
  },
  { t: 464, label: 'Drive to the rim, left baseline', insight: null },
  {
    t: 723,
    label: 'Catch-and-shoot, top of key',
    insight: 'release change',
    desc: 'release 0.09s faster than your baseline · seen 2 times so far',
    pin: [48, 26],
  },
  { t: 1166, label: 'Closeout jumper, right corner', insight: null },
  {
    t: 1498,
    label: 'Step-back, left wing',
    insight: 'late gather',
    desc: 'gather starts after the plant · seen 1 time so far',
    pin: [28, 44],
  },
]

/* Deterministic placeholder track geometry (was inline in the prototype). */
export const TRACKS = {
  motion: Array.from({ length: 40 }, (_, i) => 6 + ((i * 7) % 16)),
  lidar: Array.from({ length: 8 }, (_, j) => 30 + ((j * 23) % 70)),
  phys: Array.from({ length: 26 }, (_, k) => 4 + ((k * 5) % 18)),
}

export const TRACK_LABELS = [
  ['motion', 'Motion · pose'],
  ['lidar', 'Opponents · lidar'],
  ['phys', 'Physiology'],
]

/* ============================================================
   SCOREBOARD · shot zones
   Coordinates are px inside a 360 × 250 court, rendered as %.
   ============================================================ */

export const COURT = { w: 360, h: 250 }

export const ZONES = [
  { l: 'left corner 3', x: 8, y: 8, w: 84, h: 52, m: 6, a: 19 },
  { l: 'left wing 3', x: 8, y: 70, w: 84, h: 52, m: 11, a: 34 },
  { l: 'top of key 3', x: 134, y: 8, w: 92, h: 52, m: 14, a: 47 },
  { l: 'right corner 3', x: 262, y: 8, w: 84, h: 52, m: 8, a: 22 },
  { l: 'right wing 3', x: 262, y: 70, w: 84, h: 52, m: 9, a: 31 },
  { l: 'mid-range left', x: 62, y: 135, w: 92, h: 48, m: 12, a: 30 },
  { l: 'mid-range right', x: 196, y: 135, w: 92, h: 48, m: 15, a: 38 },
  { l: 'paint', x: 126, y: 194, w: 104, h: 46, m: 19, a: 50 },
]

/* ============================================================
   SCOREBOARD · skills
   ============================================================ */

export const SKILLS = {
  shooting: [
    ['Catch & shoot', 78, 'catch-to-release time + FG% on passes received'],
    ['Off the dribble', 64, 'FG% and balance score on pull-ups off live dribble'],
    ['Free throw', 85, 'FT% weighted by routine consistency'],
    ['Contested 3', 52, 'FG% with a defender inside 4 ft at release'],
    ['Corner 3', 71, 'corner FG% + footwork setup time'],
  ],
  handling: [
    ['Ball security', 69, 'turnovers per possession + loose-ball events'],
    ['Change of pace', 58, 'deceleration events detected per drive'],
    ['First step', 74, 'burst acceleration over the first 1.5 m'],
    ['Finishing at rim', 66, 'contested-finish % inside 5 ft'],
  ],
}

export const SKILL_TREND = [4, 5, 4.5, 6, 5.5, 7]

export const SHOT_MECHANICS = [
  { label: 'arc angle', value: '46', unit: '°' },
  { label: 'release time', value: '0.58', unit: 's' },
  { label: 'motion consistency', value: '81', unit: '/ 100' },
]

export const SESSION_SUMMARY = {
  makes: 94,
  attempts: 271,
  caption: 'total makes / attempts',
}

/* ============================================================
   SCOREBOARD · goals
   Stat pool = skills + shot zones. Max 3 goals.
   ============================================================ */

export const GOAL_STATS = [
  ...SKILLS.shooting.map((s) => ({ n: s[0], v: s[1], u: '' })),
  ...SKILLS.handling.map((s) => ({ n: s[0], v: s[1], u: '' })),
  ...ZONES.map((z) => ({
    n: z.l + ' FG%',
    v: Math.round((z.m / z.a) * 100),
    u: '%',
  })),
]

/** Placeholder per-month drift: −2..+4 */
export const drift = (stat) => ((stat.n.length + stat.v) % 7) - 2

export const SEED_GOALS = [
  { stat: GOAL_STATS[2], target: 90, when: 'end of month' },
]

export const GOAL_WHEN_OPTIONS = [
  { value: 'end of week', label: 'end of week' },
  { value: 'end of month', label: 'end of month' },
  { value: 'custom', label: 'custom date…' },
]

export const MAX_GOALS = 3

/* ============================================================
   SCOREBOARD · sharing
   ============================================================ */

export const SHARE_SECTIONS = ['zones', 'skills', 'summary', 'goals']

export const SHARE_LABEL = {
  zones: 'Shot zones',
  skills: 'Skills · shooting + handling',
  summary: 'Session summary',
  goals: 'Goals',
}

export const FRIENDS = [
  { name: 'A. Reyes', stats: 'shooting 74 · handling 61' },
  { name: 'J. Okafor', stats: 'shooting 68 · handling 77' },
  { name: 'M. Lindqvist', stats: 'shooting 81 · handling 59' },
]

/* ============================================================
   INSIGHTS · content library
   Pattern-linked items rank higher, never filter-exclusive.
   ============================================================ */

export const CARDS = [
  {
    t: 'One breath before the gather',
    k: 'DRILL',
    d: '8 min',
    side: 'on',
    pat: 'rushing under pressure',
    topics: 'breath rush release pressure closeout tempo',
  },
  {
    t: 'Closeout reps · slow the release',
    k: 'DRILL',
    d: '12 min',
    side: 'on',
    pat: 'rushing under pressure',
    topics: 'closeout release shooting pressure defense',
  },
  {
    t: 'What rushing feels like',
    k: 'LESSON',
    d: '6 min',
    side: 'off',
    pat: 'rushing under pressure',
    topics: 'rush pressure nerves awareness',
  },
  {
    t: 'Film: pressure possessions',
    k: 'VIDEO',
    d: '9 min',
    side: 'on',
    topics: 'film pressure possessions review shooting',
  },
  {
    t: 'Pre-game reset routine',
    k: 'LESSON',
    d: '5 min',
    side: 'off',
    topics: 'routine reset calm warmup nerves',
  },
  {
    t: 'Sleep & decision speed',
    k: 'VIDEO',
    d: '11 min',
    side: 'off',
    topics: 'sleep recovery decision tired fatigue',
  },
  {
    t: 'Handle under fatigue',
    k: 'DRILL',
    d: '10 min',
    side: 'on',
    pat: 'handle tightens late in sessions',
    topics: 'handle dribble tired fatigue late conditioning',
  },
  {
    t: 'Naming the pressure moment',
    k: 'LESSON',
    d: '7 min',
    side: 'off',
    topics: 'pressure naming mindset awareness',
  },
  {
    t: 'Two-ball dribble ladder',
    k: 'DRILL',
    d: '9 min',
    side: 'on',
    topics: 'handle dribble ball control hands',
  },
  {
    t: 'Footwork: first step angles',
    k: 'DRILL',
    d: '14 min',
    side: 'on',
    topics: 'footwork first step burst speed drive',
  },
  {
    t: 'Reading a hedge',
    k: 'VIDEO',
    d: '8 min',
    side: 'on',
    topics: 'pick roll hedge reads passing decision',
  },
  {
    t: 'Strength: single-leg base',
    k: 'DRILL',
    d: '16 min',
    side: 'off',
    topics: 'strength legs balance base conditioning tired',
  },
  {
    t: 'Free throw routine, rebuilt',
    k: 'LESSON',
    d: '6 min',
    side: 'on',
    topics: 'free throw routine shooting repeatable',
  },
  {
    t: 'Nutrition on back-to-backs',
    k: 'LESSON',
    d: '7 min',
    side: 'off',
    topics: 'nutrition recovery fatigue tired energy',
  },
  {
    t: 'Finishing through contact',
    k: 'DRILL',
    d: '11 min',
    side: 'on',
    topics: 'finishing rim contact layup strength',
  },
  {
    t: 'Off-day mobility flow',
    k: 'VIDEO',
    d: '12 min',
    side: 'off',
    topics: 'mobility recovery stretch off day',
  },
]

export const MY_PATTERNS = [
  'rushing under pressure',
  'handle tightens late in sessions',
  'recovers fast after a make',
]

export const INSIGHT_FILTERS = [
  { f: 'all', label: 'All' },
  { f: 'on', label: 'On court' },
  { f: 'off', label: 'Off court' },
]

/* ============================================================
   NAV
   ============================================================ */

/* Labels only — the privacy state of each screen is a product fact,
   not a thing the nav needs to repeat on every render. */
export const NAV_TABS = [
  { to: '/', label: 'Home', end: true },
  { to: '/sessions', label: 'Sessions' },
  { to: '/insights', label: 'Insights' },
  { to: '/scoreboard', label: 'Scoreboard' },
]
