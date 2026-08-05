/* ============================================================
   HIGHLIGHTER PALETTE

   The only saturated colour in the project. Each entry is a solid
   pastel-bright fill with a dark ink that sits directly on it —
   no border, minimal padding, the look of a marker swipe over a
   word. The same fills double as the segment colours in progress
   bars and their legend dots, because those are the one other
   place a small mark of colour is doing real work.

   Fills are chosen to hold up on both an off-white and a
   near-black backdrop, so the ink stays dark in either theme.
   ============================================================ */

export const HL = {
  lime: { fill: '#D7F24B', ink: '#15170A' },
  sky: { fill: '#A6DBFF', ink: '#0A1620' },
  coral: { fill: '#FF9B68', ink: '#201006' },
  pink: { fill: '#FF9BD2', ink: '#20101B' },
  lavender: { fill: '#C4B5FF', ink: '#150F26' },
  mint: { fill: '#93EAC3', ink: '#062017' },
  yellow: { fill: '#FFE159', ink: '#1F1804' },
  tan: { fill: '#E7D2AC', ink: '#1E170C' },
}

export const HL_KEYS = Object.keys(HL)

export const hlFill = (tone) => (HL[tone] || HL.lime).fill
export const hlInk = (tone) => (HL[tone] || HL.lime).ink

/** Trend states stay neutral in wording; the chip carries the read. */
export const STATE_HL = {
  improving: 'lime',
  steady: 'sky',
  new: 'yellow',
  declining: 'coral',
}

/** Deterministic tone for a repeated label, so it never re-rolls. */
export function toneFor(key, offset = 0) {
  const s = String(key)
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff
  return HL_KEYS[(h + offset) % HL_KEYS.length]
}
