import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { accuracyColor } from '../../lib/color';
import { COURT, CORNER_ANGLE, CORNER_Y, arcPoints } from '../../lib/court';
import { SIZE_STOPS, buildShotField, dotSizeFor, zoneAt, zoneReading } from '../../lib/shotField';
import { accuracyRamp, colorInk, dotMatrix } from '../../tokens';
import { ZONES } from '../../data/scoreboard';
import { usePeriod } from './periodContext';
import styles from './ShotZonesField.module.css';

/* The court is drawn in ONE neutral ink, over the field. The zone
   polygons, the coloured outlines and the eight tags are all gone:
   the readings live in the dots now. */
const LINE = colorInk.tertiary;

/* how present each class of marking is. The court is scaffolding for
   the dot field, not a diagram of a court, so both numbers are low
   and the second is nearly nothing. */
const MARK = { keep: 0.3, faint: 0.12 } as const;

/* the ends of the FG% ramp the legend draws, as fractions */
/** how far a dot outside the hovered zone recedes */
const DOT_FADE = 0.18;

/* Opacity is fast because it answers the pointer; the geometry and
   the colour are slower because they answer a period change. The
   two are on one declaration so the hover behaviour — which works
   and is deliberately untouched — keeps its own timing. */
const DOT_TRANSITION =
  'opacity var(--aera-duration-fast) var(--aera-ease-out),' +
  ' x var(--aera-duration-slow) var(--aera-ease-out),' +
  ' y var(--aera-duration-slow) var(--aera-ease-out),' +
  ' width var(--aera-duration-slow) var(--aera-ease-out),' +
  ' height var(--aera-duration-slow) var(--aera-ease-out),' +
  ' fill var(--aera-duration-slow) var(--aera-ease-out)';

const RAMP_FLOOR = 0.25;
const RAMP_CEIL = 0.5;



/** the markings, drawn once from the court's own numbers */
function CourtLines() {
  const arc = arcPoints(CORNER_ANGLE.right, CORNER_ANGLE.left, 96)
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const restricted =
    `M ${COURT.basket.x - COURT.restrictedRadius} ${COURT.basket.y}` +
    ` A ${COURT.restrictedRadius} ${COURT.restrictedRadius} 0 0 0` +
    ` ${COURT.basket.x + COURT.restrictedRadius} ${COURT.basket.y}`;

  return (
    <g fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round">
      {/* THE TWO MARKS THAT STAY READABLE — the arc with its corner
          lines, and the key. Faint: enough for the dot field to read
          as a court, never enough to compete with the dots. */}
      <g opacity={MARK.keep}>
        <path d={`M ${COURT.cornerX} ${COURT.height} L ${COURT.cornerX} ${CORNER_Y}`} />
        <path d={`M ${COURT.width - COURT.cornerX} ${COURT.height} L ${COURT.width - COURT.cornerX} ${CORNER_Y}`} />
        <path d={arc} />
        <rect
          x={COURT.key.left}
          y={COURT.key.top}
          width={COURT.key.right - COURT.key.left}
          height={COURT.height - COURT.key.top}
        />
      </g>

      {/* EVERYTHING ELSE — free-throw circle, restricted area,
          backboard, stanchion and ring. Present so the basket end
          still has somewhere to be, at a tint that is barely there.
          The outer border rect is gone entirely: it boxed the field
          in and was the heaviest line on the card. */}
      <g opacity={MARK.faint}>
        <circle cx={COURT.basket.x} cy={COURT.key.top} r={COURT.freeThrowRadius} />
        <path d={restricted} />
        <path
          d={`M ${COURT.basket.x - COURT.backboard.halfWidth} ${COURT.backboard.y} L ${COURT.basket.x + COURT.backboard.halfWidth} ${COURT.backboard.y}`}
          strokeWidth="4"
        />
        <path d={`M ${COURT.basket.x} ${COURT.backboard.y} L ${COURT.basket.x} ${COURT.basket.y - COURT.ringRadius}`} />
        <circle cx={COURT.basket.x} cy={COURT.basket.y} r={COURT.ringRadius} strokeWidth="3" />
      </g>
    </g>
  );
}

export interface ShotZonesFieldProps {
  className?: string;
}

/** Shots as a continuous dot field on a real half court. Dot SIZE is
 *  how often the shot is taken from that spot; dot COLOUR is how often
 *  it goes in.
 *
 *  The field is grouped into zones for READING, not for drawing: a dot
 *  belongs to whichever zone pulls hardest on it, so hovering lifts a
 *  neighbourhood without ever painting an edge. The readout lands in
 *  the card header rather than in a tooltip that follows the pointer —
 *  a floating panel over a map covers the thing being read. */
export function ShotZonesField({ className }: ShotZonesFieldProps) {
  const { data } = usePeriod();
  /* the field is rebuilt from THIS window's zones, so switching the
     period re-renders the dots rather than relabelling them */
  const FIELD = useMemo(() => buildShotField(data.zones), [data.zones]);
  const overall = data.totals.pct;
  const [active, setActive] = useState<string | null>(null);
  const reading = active ? zoneReading(active, data.zones) : null;
  const svg = useRef<SVGSVGElement>(null);

  /* Tap-away closes on touch, where there is no pointer-leave. */
  useEffect(() => {
    if (!active) return;
    const away = (e: PointerEvent) => {
      if (svg.current && !svg.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [active]);

  /* tap toggles: the active zone taps off again, as does a tap on
     empty court. Hover simply follows the pointer. */
  const toggle = useCallback(
    (zone: string) => setActive((current) => (current === zone ? null : zone)),
    [],
  );

  /* pointer position → court units → zone.

     This goes through the SVG's own matrix rather than through the
     element's bounding box. The court is drawn with the default
     `xMidYMid meet`, so whenever the card is not exactly 500:470 the
     drawing is letterboxed inside its box — mapping box fractions
     straight onto viewBox units put the hit test a little to one side
     of the dots, and the error grew toward the edges. */
  const pointToZone = (e: React.PointerEvent<SVGRectElement>): string | null => {
    const svgEl = svg.current;
    const ctm = svgEl?.getScreenCTM();
    if (!svgEl || !ctm) return null;
    const point = svgEl.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const local = point.matrixTransform(ctm.inverse());
    return zoneAt(local.x, local.y, data.zones);
  };

  /* where the active zone's reading sits on the ramp, 0 = cold end */
  const rampAt = reading
    ? Math.max(0, Math.min(1, (reading.pct / 100 - RAMP_FLOOR) / (RAMP_CEIL - RAMP_FLOOR)))
    : 0;

  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Shot zones
        </Display>
        <Chip>Measured</Chip>
      </div>

      {/* the readout REPLACES the session line while a zone is active,
          in a fixed place, so nothing ever covers the map */}
      <div className={styles.top}>
        {reading ? (
          <>
            <Metric value={reading.pct} unit="% FG" size="md" static />
            <Label tone="secondary" className={styles.readout}>
              {reading.label} · {reading.makes}/{reading.attempts} · {reading.comparison}
            </Label>
          </>
        ) : (
          <>
            <Metric value={overall} unit="% FG" size="md" />
            <Text variant="bodySM" tone="tertiary" numeric>
              {data.totals.makes} / {data.totals.attempts} on this window
            </Text>
          </>
        )}
      </div>

      <svg
        ref={svg}
        className={styles.court}
        viewBox={`0 0 ${COURT.width} ${COURT.height}`}
        onPointerLeave={() => setActive(null)}
        role="img"
        aria-label={`Shot field. ${ZONES.map(
          (z) => `${z.label} ${Math.round((z.makes / z.attempts) * 100)}%`,
        ).join('; ')}`}
      >
        {/* the field first, the court over it. Dots are grouped per
            zone so one opacity carries the whole neighbourhood. */}
        {/* THE FADE IS PER-DOT, and it is an OPACITY on the rect
            itself — not on a wrapper `<g>`. A group opacity composites
            the whole group as one layer, which is both why the fade
            never appeared to land and why it would have flattened the
            density encoding if it had: every dot in a faded group
            would have lost its own relative weight. Multiplying each
            dot's own opacity keeps the field's internal contrast
            intact while the zone recedes.

            Size is untouched at every state. A dot that shrank under
            the pointer would be lying about how often that shot gets
            taken. */}
        <g className={styles.field}>
          {FIELD.dots.map((dot) => {
            const size = dotSizeFor(dot.frequency);
            const faded = active !== null && active !== dot.zone;
            return (
              <rect
                key={dot.key}
                className={styles.dot}
                x={(dot.x - size / 2).toFixed(2)}
                y={(dot.y - size / 2).toFixed(2)}
                width={size.toFixed(2)}
                height={size.toFixed(2)}
                rx={dotMatrix.corner}
                fill={accuracyColor(dot.accuracy)}
                opacity={faded ? DOT_FADE : 1}
                /* the size and the colour both transition, so
                   switching the period re-renders the field as a
                   move rather than as a cut */
                style={{ transition: DOT_TRANSITION }}
              />
            );
          })}
        </g>

        <CourtLines />

        {/* THE HIT LAYER — one transparent rect over the whole court.
            The dots are small and have gaps between them, so a hit
            area built from the dots themselves is mostly holes; this
            resolves any point to its zone with the same test the dots
            were assigned by. */}
        <rect
          className={styles.hit}
          x="0"
          y="0"
          width={COURT.width}
          height={COURT.height}
          fill="transparent"
          onPointerMove={(e) => {
            if (e.pointerType === 'touch') return;
            const zone = pointToZone(e);
            if (zone !== active) setActive(zone);
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== 'touch') return;
            const zone = pointToZone(e);
            if (zone) toggle(zone);
            else setActive(null);
          }}
        />
      </svg>

      {/* two ramps, because there are two encodings on the graphic */}
      <div className={styles.legends}>
        <div className={styles.legend}>
          <Label>attempts</Label>
          <span className={styles.sizes}>
            {SIZE_STOPS.map((stop) => (
              <i
                key={stop}
                style={{
                  width: `${(dotSizeFor(stop) * 1.5).toFixed(1)}px`,
                  height: `${(dotSizeFor(stop) * 1.5).toFixed(1)}px`,
                }}
              />
            ))}
          </span>
          <Label tone="tertiary">few → many</Label>
        </div>

        <div className={styles.legend}>
          <Label>fg%</Label>
          <span className={styles.ramp}>
            {[...accuracyRamp].reverse().map((stop) => (
              <i key={stop.name} style={{ background: stop.color }} title={stop.name} />
            ))}
            {/* the active zone's own number, marked on the ramp, so the
                colour on the map maps to a value rather than a band */}
            {reading ? (
              <b className={styles.mark} style={{ left: `${(rampAt * 100).toFixed(1)}%` }} />
            ) : null}
          </span>
          <Label tone="tertiary">under 33% → over 42%</Label>
        </div>
      </div>
    </Card>
  );
}
