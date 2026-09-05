import type { FocusStep, Vital } from './types';

/* Behavioural and physiological readings. Private to the device —
   nothing in this file is ever shareable. */
export const VITALS: Vital[] = [
  {
    id: 'stress',
    label: 'Stress',
    category: 'Measured',
    value: '32',
    unit: '/ 100',
    desc: 'real-time nervous-system arousal during pressure moments',
    tone: 'mint',
    chart: {
      type: 'bars',
      items: [
        { label: 'calm', value: 54, tone: 'mint' },
        { label: 'elevated', value: 31, tone: 'yellow' },
        { label: 'peak', value: 15, tone: 'orange' },
      ],
    },
    /* one entry per bar drawn, in the bars' own colours. The bars carry
       the numbers and nothing else, so the legend is what names them. */
    legend: [
      { tone: 'mint', label: 'calm', value: '54%' },
      { tone: 'yellow', label: 'elevated', value: '31%' },
      { tone: 'orange', label: 'peak', value: '15%' },
    ],
  },
  {
    id: 'hrv',
    label: 'HRV',
    category: 'Measured',
    value: '74',
    unit: 'ms',
    desc: 'beat-to-beat variation, rolling 7-day median',
    tone: 'mint',
    chart: { type: 'line', tone: 'mint', values: [64, 61, 68, 70, 69, 74] },
    /* one line is drawn, so the legend names one series. The second
       entry described a series that was never on the chart. */
    legend: [{ tone: 'mint', label: '7-day median', value: '74ms' }],
  },
  {
    id: 'rhr',
    label: 'Resting HR',
    category: 'Measured',
    value: '54',
    unit: 'bpm',
    desc: 'lowest sustained 10-min heart rate while still',
    tone: 'blue',
    chart: { type: 'line', tone: 'blue', values: [57, 56, 55, 56, 54, 54] },
    legend: [{ tone: 'blue', label: 'resting hr', value: '54 bpm' }],
  },
  {
    id: 'cardio',
    label: 'Cardio capacity',
    category: 'Score',
    value: '48',
    unit: 'VO₂',
    desc: 'estimated from pace + heart rate during live play',
    tone: 'mint',
    chart: { type: 'area', tone: 'mint', values: [44, 45, 46, 46, 47, 48] },
    legend: [{ tone: 'mint', label: 'estimated vo₂', value: '48' }],
  },
  {
    id: 'resilience',
    label: 'Resilience',
    category: 'Score',
    value: '71',
    unit: '/ 100',
    desc: 'how fast HR/HRV return to baseline after a stress spike',
    tone: 'mint',
    chart: {
      type: 'bars',
      items: [
        { label: 'recovery', value: 71, tone: 'mint' },
        { label: 'hrv rebound', value: 44, tone: 'yellow' },
        { label: 'lag', value: 22, tone: 'orange' },
      ],
    },
    legend: [
      { tone: 'mint', label: 'recovery', value: '71' },
      { tone: 'yellow', label: 'hrv rebound', value: '44' },
      { tone: 'orange', label: 'lag', value: '22' },
    ],
  },
  {
    id: 'load',
    label: 'Activity load',
    category: 'Score',
    value: '84',
    unit: '/ 100',
    desc: 'session volume + intensity vs. your 4-week average',
    tone: 'yellow',
    chart: {
      type: 'bars',
      items: [
        { label: 'volume', value: 62, tone: 'yellow' },
        { label: 'intensity', value: 84, tone: 'mint' },
        { label: '4-wk avg', value: 48, tone: 'orange' },
      ],
    },
    legend: [
      { tone: 'yellow', label: 'volume', value: '62' },
      { tone: 'mint', label: 'intensity', value: '84' },
      { tone: 'orange', label: '4-wk avg', value: '48' },
    ],
  },
];

export const FOCUS = {
  /* THE ONE CARD ON THESE SCREENS WITH NO ID OF ITS OWN.

     Every other card is an entry in a list and carries the id its
     list gave it. Focus is a singleton, so it had nothing stable to
     be addressed by — and a viz registry keyed on anything else (a
     title, a position) breaks the moment the copy or the layout
     moves. This is that stable name, and it is the key
     `docs/viz-cards.md` lists it under. */
  id: 'focus',
  kicker: 'Session 14',
  stat: '0.42',
  unit: 's',
  statLabel: 'release under pressure',
  steps: [
    {
      label: 'What we saw',
      tone: 'lilac',
      text: 'Your release sped up on all three shots you missed under a closeout — 0.19s faster than your own baseline.',
    },
    {
      label: 'Why it happens',
      tone: 'blue',
      text: 'A defender arriving late reads as urgency, so the gather starts before your feet are set. The same quickening shows up whenever the shot clock drops under five.',
    },
    {
      label: 'What to do',
      tone: 'mint',
      text: 'One breath before the gather. Nothing else changes — same shot, same feet, one beat of air first.',
    },
  ] satisfies FocusStep[],
};
