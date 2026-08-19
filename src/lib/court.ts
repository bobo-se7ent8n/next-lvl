/* ============================================================
   HALF COURT

   The court is drawn to real proportions rather than sketched:
   a 50 × 47 ft half court in a viewBox where one unit is 0.1 ft,
   basket at the bottom. Every marking and every zone polygon is
   derived from the same numbers, so the zones genuinely follow
   the lines instead of floating over them.
   ============================================================ */

export const COURT = {
  width: 500,
  height: 470,
  /** the ring centre, 5.25 ft off the baseline */
  basket: { x: 250, y: 417.5 },
  ringRadius: 9,
  /** 4 ft off the baseline, 6 ft wide */
  backboard: { y: 430, halfWidth: 30 },
  /** the 23'9" arc, and the 22' corner lines */
  arcRadius: 237.5,
  cornerX: 30,
  /** the key: 16 ft wide, free-throw line 19 ft off the baseline */
  key: { left: 170, right: 330, top: 280 },
  freeThrowRadius: 60,
  restrictedRadius: 40,
} as const;

/** where the corner line meets the arc */
export const CORNER_Y = Math.round(
  (COURT.basket.y - Math.sqrt(COURT.arcRadius ** 2 - (COURT.basket.x - COURT.cornerX) ** 2)) * 10,
) / 10;

const RAD = Math.PI / 180;

/** a point on the three-point arc at `deg`, measured from the basket
 *  with 0° pointing to the right sideline and 90° straight up-court */
export function arcPoint(deg: number): [number, number] {
  return [
    COURT.basket.x + COURT.arcRadius * Math.cos(deg * RAD),
    COURT.basket.y - COURT.arcRadius * Math.sin(deg * RAD),
  ];
}

/** the angles at which the arc meets the two corner lines */
export const CORNER_ANGLE = {
  right: Math.acos((COURT.cornerX - COURT.basket.x) / -COURT.arcRadius) / RAD,
  left: 180 - Math.acos((COURT.cornerX - COURT.basket.x) / -COURT.arcRadius) / RAD,
};

/** the arc sampled between two angles, inclusive */
export function arcPoints(fromDeg: number, toDeg: number, steps = 26): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    out.push(arcPoint(fromDeg + ((toDeg - fromDeg) * i) / steps));
  }
  return out;
}

/* ------------------------------------------------------------
   ZONE TAGS

   The zones are no longer drawn. The court carries its own lines
   and nothing else, and each zone's reading rides on a small
   coloured tag placed INSIDE the court — the tags are the only
   colour on the graphic. The corner tags used to hang off the
   sidelines on the card background, which read as a mistake
   rather than as a decision.

   Every point below is inside the 500 × 470 half court, and the
   tag box (TAG.w × TAG.h) is centred on it.
   ------------------------------------------------------------ */

/** the tag box, in court units — the geometry has to know it to keep
 *  every tag off the lines */
export const TAG = { w: 92, h: 44 } as const;

export interface ZoneTagPlacement {
  id: string;
  /** the centre of the tag, in court units */
  at: [number, number];
}

export const ZONE_TAGS: ZoneTagPlacement[] = [
  /* the corner strips are three feet wide, so their tags sit just
     inside the sideline rather than inside the strip itself */
  { id: 'lc3', at: [62, 436] },
  { id: 'rc3', at: [COURT.width - 62, 436] },
  { id: 'lw3', at: [76, 112] },
  { id: 'tk3', at: [250, 58] },
  { id: 'rw3', at: [COURT.width - 76, 112] },
  { id: 'midL', at: [100, 318] },
  { id: 'midR', at: [COURT.width - 100, 318] },
  { id: 'paint', at: [250, 355] },
];

/** the two angles that split the above-the-break arc into wing,
 *  top of key, wing */
export const BREAK = { left: 118, right: 62 } as const;
