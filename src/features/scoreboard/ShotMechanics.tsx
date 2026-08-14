import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Display, Label, Text } from '../../components/primitives/Text';
import { semanticColor } from '../../lib/color';
import { colorData, colorInk, colorUtility } from '../../tokens';
import { MECHANICS } from '../../data/scoreboard';
import styles from './ShotMechanics.module.css';

/* the trajectory, drawn once. P1 is placed so the tangent leaving the
   hand is the measured launch angle rather than a decorative curve. */
const RELEASE = { x: 44, y: 152 };
const CONTROL = { x: 162, y: 26 };
const RIM = { x: 288, y: 104 };
const APEX = {
  x: 0.25 * RELEASE.x + 0.5 * CONTROL.x + 0.25 * RIM.x,
  y: 0.25 * RELEASE.y + 0.5 * CONTROL.y + 0.25 * RIM.y,
};
const FLOOR = 176;

export interface ShotMechanicsProps {
  className?: string;
}

/** Shot mechanics — the arc with its apex and angle callout, the three
 *  readings underneath, and the line saying where they came from. */
export function ShotMechanics({ className }: ShotMechanicsProps) {
  return (
    <Card radius="panel" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Shot mechanics
        </Display>
        <Chip>Measured</Chip>
      </div>

      <svg className={styles.arc} viewBox="0 0 320 200" role="img" aria-label="Shot trajectory with apex and launch angle">
        {/* floor */}
        <path d={`M 18 ${FLOOR} L 302 ${FLOOR}`} stroke={colorUtility.hairline} strokeWidth="1.5" />

        {/* the launch-angle callout, measured from the horizontal */}
        <path
          d={`M ${RELEASE.x} ${RELEASE.y} L ${RELEASE.x + 62} ${RELEASE.y}`}
          stroke={colorUtility.hairline}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <path
          d={`M ${RELEASE.x + 34} ${RELEASE.y} A 34 34 0 0 0 ${RELEASE.x + 23.6} ${RELEASE.y - 24.5}`}
          fill="none"
          stroke={colorInk.tertiary}
          strokeWidth="1.5"
        />
        <text
          x={RELEASE.x + 44}
          y={RELEASE.y - 16}
          fontSize="13"
          fontWeight="700"
          fill={colorInk.numeral}
          fontFamily="Inter, sans-serif"
        >
          {MECHANICS.arcAngle}°
        </text>

        {/* the trajectory */}
        <path
          d={`M ${RELEASE.x} ${RELEASE.y} Q ${CONTROL.x} ${CONTROL.y} ${RIM.x} ${RIM.y}`}
          fill="none"
          stroke={colorData.mint}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* apex */}
        <path
          d={`M ${APEX.x} ${APEX.y} L ${APEX.x} ${FLOOR}`}
          stroke={colorUtility.hairline}
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx={APEX.x} cy={APEX.y} r="5" fill={colorInk.numeral} />
        <text
          x={APEX.x + 10}
          y={APEX.y - 4}
          fontSize="11"
          fontWeight="600"
          fill={colorInk.secondary}
          fontFamily="Inter, sans-serif"
        >
          apex {MECHANICS.apexHeight} m
        </text>

        {/* release point */}
        <circle cx={RELEASE.x} cy={RELEASE.y} r="4" fill={colorInk.numeral} />
        <text
          x={RELEASE.x - 4}
          y={RELEASE.y + 18}
          fontSize="10"
          fontWeight="600"
          fill={colorInk.tertiary}
          fontFamily="Inter, sans-serif"
        >
          release
        </text>

        {/* rim and backboard */}
        <path d={`M 302 ${RIM.y - 30} L 302 ${RIM.y + 6}`} stroke={colorInk.tertiary} strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${RIM.x - 16} ${RIM.y} L ${RIM.x + 14} ${RIM.y}`} stroke={colorData.orange} strokeWidth="4" strokeLinecap="round" />
        <text
          x={RIM.x - 16}
          y={RIM.y + 20}
          fontSize="10"
          fontWeight="600"
          fill={colorInk.tertiary}
          fontFamily="Inter, sans-serif"
        >
          {MECHANICS.shotDistance} m
        </text>
      </svg>

      <div className={styles.rows}>
        {MECHANICS.rows.map((row) => (
          <div key={row.id} className={styles.row}>
            <div className={styles.rowHead}>
              <Display size="sm" as="h4" tone="tertiary">
                {row.label}
              </Display>
              <Text as="span" variant="metricMD" tone="numeral" numeric>
                {row.value}
                <Text as="span" variant="bodySM" tone="tertiary" style={{ display: 'inline' }}>
                  {row.unit}
                </Text>
              </Text>
            </div>
            <span className={styles.mark} style={{ background: semanticColor(row.quality) }} />
            <Text variant="bodyXS" tone="tertiary">
              {row.note}
            </Text>
          </div>
        ))}
      </div>

      <Label className={styles.source}>{MECHANICS.source}</Label>
    </Card>
  );
}
