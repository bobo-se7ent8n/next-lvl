import { Card } from '../../components/primitives/Card';
import { Chip } from '../../components/primitives/Chip';
import { Metric } from '../../components/primitives/Metric';
import { Display, Label, Text } from '../../components/primitives/Text';
import { shotZoneColor } from '../../lib/color';
import { colorInk, colorUtility, shotZoneRamp } from '../../tokens';
import { COURT_VIEWBOX, ZONES, ZONE_TOTALS } from '../../data/scoreboard';
import styles from './ShotZones.module.css';

export interface ShotZonesProps {
  className?: string;
}

/** Shot zones — clean court shapes, makes / attempts and FG% as plain
 *  numbers inside each zone. The cold → hot ramp is the one place the
 *  semantic colour rule is deliberately set aside. */
export function ShotZones({ className }: ShotZonesProps) {
  const overall = Math.round((ZONE_TOTALS.makes / ZONE_TOTALS.attempts) * 100);

  return (
    <Card radius="panel" padding="10" className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        <Display size="md" as="h3">
          Shot zones
        </Display>
        <Chip>Measured</Chip>
      </div>

      <Metric value={overall} unit="% FG" size="md" />
      <Text variant="bodyXS" tone="tertiary" numeric>
        {ZONES.length} zones · {ZONE_TOTALS.makes} / {ZONE_TOTALS.attempts} on the session
      </Text>

      <svg
        className={styles.court}
        viewBox={`0 0 ${COURT_VIEWBOX.w} ${COURT_VIEWBOX.h}`}
        role="img"
        aria-label="Shot zones by field-goal percentage"
      >
        {/* the court, kept to what the tiles cannot say for themselves:
            the boundary, the baseline and the rim */}
        <g fill="none" stroke={colorUtility.hairline} strokeWidth="1.5">
          <rect x="3" y="3" width={COURT_VIEWBOX.w - 6} height={COURT_VIEWBOX.h - 6} rx="10" />
          <path d="M 40 252 L 320 252" />
          <circle cx="180" cy="250" r="8" />
        </g>

        {ZONES.map((zone) => {
          const pct = zone.makes / zone.attempts;
          const cx = zone.x + zone.w / 2;
          const cy = zone.y + zone.h / 2;
          return (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx="10"
                fill={shotZoneColor(pct)}
                opacity="0.55"
              />
              <text
                x={cx}
                y={cy - 13}
                textAnchor="middle"
                fontSize="7"
                fontWeight="700"
                letterSpacing="1"
                fill={colorInk.primary}
                opacity="0.6"
                fontFamily="Inter, sans-serif"
              >
                {zone.short.toUpperCase()}
              </text>
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="15"
                fontWeight="800"
                letterSpacing="-0.4"
                fill={colorInk.primary}
                fontFamily="Inter, sans-serif"
              >
                {Math.round(pct * 100)}%
              </text>
              <text
                x={cx}
                y={cy + 17}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={colorInk.primary}
                opacity="0.62"
                fontFamily="Inter, sans-serif"
              >
                {zone.makes} / {zone.attempts}
              </text>
            </g>
          );
        })}
      </svg>

      {/* cold → hot is the one deliberate exception to the semantic rule */}
      <div className={styles.ramp}>
        <Label>cold</Label>
        <span className={styles.rampBar}>
          {shotZoneRamp.map((stop) => (
            <i key={stop.name} style={{ background: stop.color }} title={stop.name} />
          ))}
        </span>
        <Label>hot</Label>
        <Text variant="bodyXS" tone="tertiary" numeric className={styles.rampNote}>
          under 30% → over 44% FG
        </Text>
      </div>
    </Card>
  );
}
