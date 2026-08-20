import type { CSSProperties } from 'react';
import { Card } from '../../components/primitives/Card';
import { Well } from '../../components/primitives/Surface';
import { Chip } from '../../components/primitives/Chip';
import { StatRow } from '../../components/primitives/StatRow';
import { Display, Label, Text } from '../../components/primitives/Text';
import { sampleArc, solveArc } from '../../lib/arc';
import { colorData, colorInk, colorUtility, dotMatrix } from '../../tokens';
import { MECHANICS } from '../../data/scoreboard';
import styles from './ShotArc.module.css';

/* ------------------------------------------------------------
   The trajectory is solved, not drawn. Given the release angle,
   the release height and the distance to the ring there is exactly
   one parabola that arrives at rim height, and every annotation
   comes off that same equation: the apex marker sits on the
   mathematical peak, and the entry tangent is the real derivative
   at the ring rather than a flat line into an orange bar.
   ------------------------------------------------------------ */
const ARC = solveArc({
  angle: MECHANICS.arcAngle,
  releaseHeight: MECHANICS.releaseHeight,
  distance: MECHANICS.shotDistance,
  rimHeight: MECHANICS.rimHeight,
});

/* the frame, in metres, and the projection into it */
const FRAME = { w: 360, h: 210, pad: 26 };
const X_SPAN = MECHANICS.shotDistance * 1.14;
const Y_SPAN = Math.max(ARC.apexY, MECHANICS.rimHeight) * 1.16;
const sx = (m: number) => FRAME.pad + (m / X_SPAN) * (FRAME.w - FRAME.pad * 2);
const sy = (m: number) => FRAME.h - FRAME.pad - (m / Y_SPAN) * (FRAME.h - FRAME.pad * 1.6);

/** the ball, sampled as dots along the path — the same dot language
 *  as every other graphic in the product */
const TRAIL = sampleArc(ARC, 34, 0.06);

/* There is no shooter on this diagram. The figure that used to hold
   the release point up rendered as an armless, headless post
   disconnected from the very point it was there to anchor — and the
   release dot and its height annotation already say where the ball
   left the hand. */
const RELEASE = [sx(0), sy(MECHANICS.releaseHeight)] as const;
const APEX = [sx(ARC.apexX), sy(ARC.apexY)] as const;
const RIM = [sx(MECHANICS.shotDistance), sy(MECHANICS.rimHeight)] as const;
const FLOOR = sy(0);
const BACKBOARD_X = sx(MECHANICS.shotDistance + 0.6);

/* the frame is not square, so the angle the eye sees is not the angle
   in metres. The wedge is drawn to the tangent as it actually appears,
   and the number beside it stays the measured one. */
const KX = (FRAME.w - FRAME.pad * 2) / X_SPAN;
const KY = (FRAME.h - FRAME.pad * 1.6) / Y_SPAN;
const SCREEN_LAUNCH = Math.atan2(Math.tan((MECHANICS.arcAngle * Math.PI) / 180) * KY, KX);

/** the launch-angle wedge, anchored at the release point */
function angleWedge(radius: number): string {
  const end = [
    RELEASE[0] + radius * Math.cos(SCREEN_LAUNCH),
    RELEASE[1] - radius * Math.sin(SCREEN_LAUNCH),
  ];
  return `M ${RELEASE[0] + radius} ${RELEASE[1]} A ${radius} ${radius} 0 0 0 ${end[0].toFixed(1)} ${end[1].toFixed(1)}`;
}

export interface ShotArcProps {
  className?: string;
}

/** Shot mechanics — the true parabola as a looped dot trail, with the
 *  three readings underneath and the line saying where they came from. */
export function ShotArc({ className }: ShotArcProps) {
  return (
    <Card radius="card" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Shot mechanics
        </Display>
        <Chip>Measured</Chip>
      </div>

      {/* the caption belongs to the header, not to the foot: it says
          what the whole card is built from, and at the bottom it read
          as a footnote to the three stat rows above it */}
      <Label tone="tertiary" className={styles.source}>
        {MECHANICS.source}
      </Label>

      <Well radius="lg" className={styles.arcWell}>
      <svg
        className={styles.arc}
        viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Trajectory: ${MECHANICS.arcAngle}° release, apex ${ARC.apexY.toFixed(2)} m, entering the ring at ${Math.abs(ARC.entryAngle).toFixed(0)}°`}
      >
        {/* the ground line spans the whole frame */}
        <path d={`M 0 ${FLOOR} L ${FRAME.w} ${FLOOR}`} stroke={colorUtility.hairline} strokeWidth="1.6" />

        {/* the horizontal the launch angle is measured from */}
        <path
          d={`M ${RELEASE[0]} ${RELEASE[1]} L ${RELEASE[0] + 74} ${RELEASE[1]}`}
          stroke={colorUtility.hairline}
          strokeWidth="1.4"
          strokeDasharray="3 4"
        />
        <path d={angleWedge(38)} fill="none" stroke={colorInk.tertiary} strokeWidth="1.6" />
        <text
          x={RELEASE[0] + 44}
          y={RELEASE[1] - 13}
          className={styles.mark}
        >
          {MECHANICS.arcAngle}°
        </text>

        {/* the apex, on the mathematical peak and nowhere else */}
        <path
          d={`M ${APEX[0]} ${APEX[1]} L ${APEX[0]} ${FLOOR}`}
          stroke={colorUtility.hairline}
          strokeWidth="1.4"
          strokeDasharray="4 5"
        />

        {/* the trail: the ball sampled as dots, travelling on a loop */}
        <g className={styles.trail}>
          {TRAIL.map(([x, y], i) => (
            <rect
              key={i}
              className={styles.ball}
              x={sx(x) - dotMatrix.size / 2}
              y={sy(y) - dotMatrix.size / 2}
              width={dotMatrix.size}
              height={dotMatrix.size}
              rx={dotMatrix.corner}
              fill={colorData.mint}
              style={
                {
                  '--dot-delay': `calc(var(--aera-duration-settle) * ${((i / TRAIL.length) * 4 - 4).toFixed(2)})`,
                } as CSSProperties
              }
            />
          ))}
        </g>

        <circle cx={APEX[0]} cy={APEX[1]} r="4.5" fill={colorInk.primary} />
        <text
          x="150"
          y="24"
          className={styles.mark}
        >
          apex {ARC.apexY.toFixed(2)} m
        </text>

        <circle cx={RELEASE[0]} cy={RELEASE[1]} r="4" fill={colorInk.primary} />
        <text
          x={RELEASE[0] - 4}
          y={RELEASE[1] + 18}
          className={styles.mark}
        >
          release {MECHANICS.releaseHeight} m
        </text>

        {/* a proper hoop and backboard, standing on the ground line */}
        <g stroke={colorInk.tertiary} strokeLinecap="round" fill="none">
          <path d={`M ${BACKBOARD_X} ${FLOOR} L ${BACKBOARD_X} ${RIM[1] - 34}`} strokeWidth="2" />
          <path d={`M ${BACKBOARD_X} ${RIM[1] - 34} L ${BACKBOARD_X} ${RIM[1] + 10}`} strokeWidth="4.5" />
          <path d={`M ${RIM[0]} ${RIM[1]} L ${BACKBOARD_X} ${RIM[1]}`} strokeWidth="3.4" stroke={colorInk.primary} />
          <path
            d={`M ${RIM[0]} ${RIM[1]} L ${RIM[0] + 5} ${RIM[1] + 15} L ${(RIM[0] + BACKBOARD_X) / 2} ${RIM[1] + 19} L ${BACKBOARD_X - 4} ${RIM[1] + 15}`}
            strokeWidth="1.2"
            stroke={colorUtility.hairline}
          />
        </g>
        <text
          x="315"
          y="110"
          textAnchor="end"
          className={styles.mark}
        >
          entry {Math.abs(ARC.entryAngle).toFixed(0)}°
        </text>
        <text
          x="178"
          y={FLOOR + 16}
          textAnchor="middle"
          className={styles.mark}
        >
          {MECHANICS.shotDistance} m
        </text>
      </svg>
      </Well>

      {/* label and value, and nothing under either of them */}
      <div className={styles.rows}>
        {MECHANICS.rows.map((row) => (
          <StatRow
            key={row.id}
            label={row.label}
            value={
              <>
                {row.value}
                {row.degree ? <sup className={styles.degree}>°</sup> : null}
                {row.unit ? (
                  <Text as="span" variant="bodySM" tone="tertiary" style={{ display: 'inline' }}>
                    {row.unit}
                  </Text>
                ) : null}
              </>
            }
          />
        ))}
      </div>
    </Card>
  );
}
