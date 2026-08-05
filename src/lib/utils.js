import { CARDS, MY_PATTERNS, STATWORDS } from '../data/mock'
import { hlFill } from './palette'

/** className joiner */
export const cx = (...a) => a.filter(Boolean).join(' ')

/** seconds → mm:ss */
export function fmt(sec) {
  const s = Math.max(0, Math.round(sec))
  return (
    String(Math.floor(s / 60)).padStart(2, '0') +
    ':' +
    String(s % 60).padStart(2, '0')
  )
}

/**
 * Wireframe-level session search.
 * Numeric thresholds ("3+ turnovers") win; otherwise keyword match.
 */
export function matchesSession(s, q) {
  if (!q) return true
  const re = /(\d+)\s*\+?\s*([a-z]+)/g
  const thresholds = []
  let m
  while ((m = re.exec(q))) {
    if (STATWORDS[m[2]]) thresholds.push([STATWORDS[m[2]], +m[1]])
  }
  if (thresholds.length) return thresholds.every((t) => s[t[0]] >= t[1])
  const hay = [s.d, s.tag, s.cand || '', s.dur].join(' ').toLowerCase()
  return q
    .split(/\s+/)
    .filter((t) => t.length > 2)
    .some((t) => hay.indexOf(t) > -1)
}

/**
 * Query → whole library, ranked.
 * Topic match scores first; pattern-linked items get a boost, never a filter.
 */
export function rankCards(q) {
  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)
  return CARDS.map((c, i) => {
    const hay = (c.t + ' ' + c.topics + ' ' + (c.pat || '')).toLowerCase()
    let score = terms.reduce((a, t) => a + (hay.indexOf(t) > -1 ? 2 : 0), 0)
    if (c.pat && MY_PATTERNS.indexOf(c.pat) > -1) score += 1
    return { c, score, i }
  })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 3)
}

/** Heat 0..1 for a shot zone, from makes/attempts. */
export function zoneHeat(z) {
  const pct = z.m / z.a
  return { pct, k: Math.max(0, Math.min(1, (pct - 0.26) / 0.18)) }
}

/* ============================================================
   DATA SCALE

   Where a number genuinely carries magnitude — shot zones, skill
   bars — it is banded onto four steps of the highlighter palette.
   Four discrete steps rather than a continuous gradient: banding
   keeps every value on a colour you can name, which is what makes
   the chart readable at a glance rather than merely pretty.

   These are the same fills the chips use, so the app never
   introduces a second colour vocabulary for data.
   ============================================================ */

export const HEAT_STEPS = [
  { max: 0.28, tone: 'sky', name: 'low' },
  { max: 0.52, tone: 'mint', name: 'mid' },
  { max: 0.74, tone: 'lime', name: 'high' },
  { max: Infinity, tone: 'coral', name: 'peak' },
]

const bandIndex = (k) => {
  const t = Math.max(0, Math.min(1, k))
  return HEAT_STEPS.findIndex((s) => t < s.max)
}

/** k in 0..1 → the highlighter tone name for that band. */
export const heatTone = (k) => HEAT_STEPS[bandIndex(k)].tone

/** k in 0..1 → a css colour on the low → peak scale. */
export function heatColor(k, alpha = 1) {
  const hex = hlFill(heatTone(k))
  if (alpha === 1) return hex
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${n >> 16} ${(n >> 8) & 255} ${n & 255} / ${alpha})`
}

/** Skill scores cluster in 45–90; spread them across the full scale. */
export const skillHeat = (score) => (score - 45) / 45
