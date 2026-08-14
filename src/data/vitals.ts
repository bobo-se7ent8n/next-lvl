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
    legend: [
      { tone: 'mint', label: 'now', value: '74ms' },
      { tone: 'tan', label: '7-day low', value: '61ms' },
    ],
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
    legend: [
      { tone: 'blue', label: 'now', value: '54' },
      { tone: 'tan', label: 'range', value: '54–57' },
    ],
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
    legend: [
      { tone: 'mint', label: 'now', value: '48' },
      { tone: 'tan', label: '6 wk ago', value: '44' },
    ],
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
  },
];

export const FOCUS = {
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
