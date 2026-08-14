import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { inkOn, tintOf } from '../../lib/color';
import { Card } from '../primitives/Card';
import { Display, Label, Text } from '../primitives/Text';
import { Metric } from '../primitives/Metric';
import { Sparkline } from '../viz/Sparkline';
import { BarSet } from '../viz/BarSet';
import { DotMatrix } from '../viz/DotMatrix';
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

/** the compact viz on a card front, chosen by the pattern's own shape */
function CardViz({ pattern, tint }: { pattern: Pattern; tint: string }) {
  if (pattern.viz === 'bars') {
    return (
      <BarSet
        items={pattern.bars}
        height={62}
        showValues={false}
        radius="md"
        face={pattern.fill}
        inherit
      />
    );
  }
  if (pattern.viz === 'dots') {
    const filled = Math.round((pattern.series[pattern.series.length - 1] / 100) * 24);
    return (
      <DotMatrix
        value={filled}
        total={24}
        columns={12}
        color={tint}
        ariaLabel={`${pattern.name}: ${filled} of 24`}
      />
    );
  }
  return <Sparkline values={pattern.series} color={tint} height={58} weight={2.5} />;
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
      padding="8"
      elevation={hovered ? 'high' : 'medium'}
      outlined={hovered}
      interactive
      onClick={onClick}
      ariaLabel={`${pattern.name}: ${pattern.hero}${pattern.unit}`}
      clip={false}
      className={cx(styles.card, className)}
      style={{ color: ink, ...style }}
    >
      <div className={styles.head}>
        <Label tone="inherit">{pattern.kind}</Label>
      </div>

      <Metric value={pattern.hero} unit={pattern.unit} size="md" inherit />

      <Text variant="bodyXS" tone="inherit" className={styles.trend}>
        {pattern.trend}
      </Text>

      <div className={styles.viz}>
        <CardViz pattern={pattern} tint={tint} />
      </div>

      <Display size="sm" as="h3" tone="inherit" className={styles.title}>
        {pattern.name}
      </Display>

      {showTag ? (
        <span className={cx(styles.nameTag, hovered && styles.tagOn)}>
          {pattern.name.toLowerCase()}
        </span>
      ) : null}
    </Card>
  );
}
