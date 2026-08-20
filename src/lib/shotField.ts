/* ============================================================
   THE SHOT FIELD

   The eight named zones are gone. A zone was a polygon with a
   hard edge and a tag hanging off it, and neither the edge nor
   the tag is a thing that exists — a shooter does not stop being
   accurate at a painted line, and the corner strips were three
   feet wide, which is why their tags kept ending up outside the
   court.

   What replaces them is a continuous field on the dot grid. Each
   recorded zone becomes a KERNEL centred where those shots were
   actually taken, and every dot on the court reads every kernel:

     · frequency — attempts near this spot, which sets the DOT SIZE
     · accuracy  — the attempt-weighted FG% near this spot, which
                   sets the DOT COLOUR

   So the readings are the same readings; only their shape
   changed, from eight labelled regions to one field.
   ============================================================ */

import { COURT } from './court';
import { dotMatrix } from '../tokens';
import { ZONES } from '../data/scoreboard';

/** Each zone is a KERNEL: a centre where those shots were actually
 *  taken, and a reach. The reach is per-zone rather than global — the
 *  interior zones are small and stacked on top of each other, so one
 *  wide sigma smeared the rim's accuracy across the whole paint and
 *  the mint core never survived the blend. The perimeter zones are
 *  genuinely broad and keep the wide reach. */
interface Kernel {
  at: [number, number];
  /** how far this zone's influence carries, in court units */
  sigma: number;
}

const KERNEL: Record<string, Kernel> = {
  /* the interior, tight and stacked: rim, then the rest of the paint,
     then the free-throw area above it */
  ra: { at: [250, 400], sigma: 46 },
  paint: { at: [250, 340], sigma: 66 },
  ft: { at: [250, 272], sigma: 62 },
  /* mid-range: inside the arc, outside the key */
  midL: { at: [112, 302], sigma: 116 },
  midR: { at: [388, 302], sigma: 116 },
  /* the corner strips: three feet of sideline, behind the corner line */
  lc3: { at: [15, 400], sigma: 116 },
  rc3: { at: [485, 400], sigma: 116 },
  /* the wings and the top of the key sit just BEYOND the arc, which is
     where a three is actually taken. They used to sit near the top edge
     of the half court, thirty-odd feet out, which spread the field into
     territory nobody shoots from. */
  lw3: { at: [118, 196], sigma: 116 },
  tk3: { at: [250, 152], sigma: 116 },
  rw3: { at: [382, 196], sigma: 116 },
};

/** how far from the ring a shot is still a shot, in court units. Past
 *  this the field simply stops: a heat map that runs to the half-court
 *  line is drawing attempts that were never taken. */
const MAX_RANGE = COURT.arcRadius + 52;

/** the grid pitch, in court units — one dot every foot and a half */
export const FIELD_PITCH = 17;

/** below this share of the peak a dot is simply left out. Omission is
 *  part of the dot language, and nobody shoots from everywhere. */
const FLOOR = 0.07;

/** every zone's contribution at one point on the court, plus which
 *  zone owns it. The dots and the pointer hit layer both read this, so
 *  what you hover is exactly what lights up — a hit test that
 *  disagreed with the drawing would light the wrong neighbourhood. */
function sampleAt(x: number, y: number, zones: typeof ZONES = ZONES): { attempts: number; made: number; zone: string } {
  let attempts = 0;
  let made = 0;
  let bestClaim = 0;
  let zone = zones[0].id;

  for (const z of zones) {
    const kernel = KERNEL[z.id];
    if (!kernel) continue;
    const d = Math.hypot(x - kernel.at[0], y - kernel.at[1]);
    const w = Math.exp(-((d / kernel.sigma) ** 2));
    attempts += w * z.attempts;
    made += w * z.makes;
    /* the owning zone is the one pulling hardest here, weighted by
       how many shots it actually holds */
    const claim = w * z.attempts;
    if (claim > bestClaim) {
      bestClaim = claim;
      zone = z.id;
    }
  }

  return { attempts, made, zone };
}

/** which zone a point on the court belongs to. The pointer layer is a
 *  single transparent rect over the whole court rather than one shape
 *  per zone: the dots have gaps between them, and a hit area made of
 *  dots is mostly holes. */
export function zoneAt(x: number, y: number, zones: typeof ZONES = ZONES): string | null {
  if (!onCourt(x, y)) return null;
  const { attempts, zone } = sampleAt(x, y, zones);
  return attempts > 0 ? zone : null;
}

export interface FieldDot {
  key: string;
  x: number;
  y: number;
  /** 0..1 — attempts near this spot, relative to the busiest spot */
  frequency: number;
  /** raw FG% near this spot, attempt-weighted */
  accuracy: number;
  /** which zone this dot belongs to, for hover grouping. It is the
   *  zone contributing the most weight here — a soft partition that
   *  follows the field rather than a painted polygon, so grouping the
   *  dots never introduces an edge the colour does not already have. */
  zone: string;
}

/** true when a point is inside the half court and in front of the
 *  baseline. Everything on this diagram is a shot, so the field stops
 *  where the shots do. */
function onCourt(x: number, y: number): boolean {
  if (x < 0 || x > COURT.width || y < 0 || y > COURT.height) return false;
  return Math.hypot(x - COURT.basket.x, y - COURT.basket.y) <= MAX_RANGE;
}

/** the field, built once from the same readings the zones carried */
export function buildShotField(zones: typeof ZONES = ZONES): { dots: FieldDot[]; peak: number } {
  const raw: Array<FieldDot & { attempts: number }> = [];

  for (let y = FIELD_PITCH / 2; y < COURT.height; y += FIELD_PITCH) {
    for (let x = FIELD_PITCH / 2; x < COURT.width; x += FIELD_PITCH) {
      if (!onCourt(x, y)) continue;

      const { attempts, made, zone } = sampleAt(x, y, zones);
      if (attempts <= 0) continue;

      raw.push({
        key: `${x}-${y}`,
        x,
        y,
        attempts,
        frequency: 0,
        accuracy: made / attempts,
        zone,
      });
    }
  }

  const peak = raw.reduce((m, d) => Math.max(m, d.attempts), 0) || 1;
  const dots = raw
    .map((d) => ({ ...d, frequency: d.attempts / peak }))
    .filter((d) => d.frequency >= FLOOR);

  return { dots, peak };
}

/** the on-court size of one dot, from its frequency. The grid pitch is
 *  the invariant here; the dot is what carries the measure. */
export function dotSizeFor(frequency: number): number {
  const base = dotMatrix.size;
  return base * (0.3 + 1.6 * Math.pow(frequency, 0.8));
}

/** the sizes the legend shows, low to high */
export const SIZE_STOPS = [0.15, 0.5, 1] as const;

/* ------------------------------------------------------------
   ZONE READINGS

   What the readout says when a zone is active. The comparison is
   stated as a plain difference from the session average — this
   product does not grade, so there is no "good", no "weak" and
   no praise anywhere in this string.
   ------------------------------------------------------------ */
export interface ZoneReading {
  id: string;
  label: string;
  pct: number;
  makes: number;
  attempts: number;
  /** percentage points away from the session average, signed */
  delta: number;
  /** the comparison, in neutral language */
  comparison: string;
}

export function zoneReading(id: string, zones: typeof ZONES = ZONES): ZoneReading | null {
  const zone = zones.find((z) => z.id === id);
  if (!zone) return null;

  const totalMakes = zones.reduce((a, z) => a + z.makes, 0);
  const totalAttempts = zones.reduce((a, z) => a + z.attempts, 0);
  const pct = Math.round((zone.makes / zone.attempts) * 100);
  const average = Math.round((totalMakes / totalAttempts) * 100);
  const delta = pct - average;
  const size = Math.abs(delta);

  const comparison =
    size === 0
      ? 'level with session average'
      : `${size} point${size === 1 ? '' : 's'} ${delta > 0 ? 'above' : 'below'} session average`;

  return { id, label: zone.label, pct, makes: zone.makes, attempts: zone.attempts, delta, comparison };
}
