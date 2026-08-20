import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { inkOn, tintOf, vizWell } from '../../lib/color';
import { Card } from '../primitives/Card';
import { Display, Text } from '../primitives/Text';
import { Metric } from '../primitives/Metric';
import { Sparkline } from '../viz/Sparkline';
import { BarSet } from '../viz/BarSet';
import { DotCount } from '../viz/DotCount';
import type { Pattern } from '../../data/types';
import styles from './PatternCard.module.css';

export interface PatternCardProps {
  pattern: Pattern;
  /** show the figma name tag and the selection ring */
  hovered?: boolean;
  onClick?: () => void;
  /** hide the tag when a card is open behind the fan */
  showTag?: boolean;
  className?: string;
  style?: CSSProperties;
}

/* The graphic fills its slot rather than sitting at a fixed strip
   height. A number rather than a token because it is an SVG box
   height in px, the same way the chart primitives take one. */
const GRAPHIC_H = 200;

/** the graphic on a card front, chosen by the pattern's own shape */
function CardViz({ pattern, tint }: { pattern: Pattern; tint: string }) {
  if (pattern.viz === 'bars') {
    return <BarSet items={pattern.bars} height={GRAPHIC_H} showValues={false} radius="md" inherit />;
  }
  if (pattern.viz === 'dots') {
    const filled = Math.round((pattern.series[pattern.series.length - 1] / 100) * 24);
    return (
      <DotCount
        value={filled}
        total={24}
        columns={12}
        color={tint}
        ariaLabel={`${pattern.name}: ${filled} of 24`}
      />
    );
  }
  return <Sparkline values={pattern.series} color={tint} height={GRAPHIC_H} weight={2.5} />;
}

/** the fan card front — label, headline reading, a neutral trend line,
 *  a compact viz, and the pattern name at the bottom. No links here:
 *  those exist only in the expanded state. */
export function PatternCard({
  pattern,
  hovered,
  onClick,
  showTag = true,
  className,
  style,
}: PatternCardProps) {
  const tint = tintOf(pattern.fill);
  const ink = inkOn(pattern.fill);

  return (
    <Card
      face={pattern.fill}
      radius="card"
      outlined={hovered}
      interactive
      onClick={onClick}
      ariaLabel={`${pattern.name}: ${pattern.hero}${pattern.unit}`}
      className={cx(styles.card, className)}
      style={{ color: ink, ...style }}
    >
      {/* 1 — TITLE AND TAG. The title leads the card now; it used to
          sit at the very bottom, under the graphic, which made the
          card read from the number upward. The pill is on a light
          fill so it holds against a saturated face. */}
      <div className={styles.head}>
        <Display size="md" as="h3" tone="inherit" className={styles.title}>
          {pattern.name}
        </Display>
        <span className={styles.tag}>{pattern.kind}</span>
      </div>

      {/* 2 — the reading */}
      <Metric value={pattern.hero} unit={pattern.unit} size="lg" inherit />

      {/* 3 — the line under it */}
      <Text variant="bodySM" tone="inherit" className={styles.trend}>
        {pattern.trend}
      </Text>

      {/* 4 — THE GRAPHIC, and it takes everything left. A swappable
          slot: whatever renders inside is free to change without the
          card's layout knowing, which is the point — these will be
          generated artwork later, not dot fields. */}
      <div
        className={styles.viz}
        style={{ '--viz-well': vizWell(pattern.fill) } as CSSProperties}
      >
        <CardViz pattern={pattern} tint={tint} />
      </div>

      {showTag ? (
        <span className={cx(styles.nameTag, hovered && styles.tagOn)}>
          {pattern.name.toLowerCase()}
        </span>
      ) : null}
    </Card>
  );
}
