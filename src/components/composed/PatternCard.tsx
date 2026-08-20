import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { inkOn, tintOf } from '../../lib/color';
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

/**
 * THE ILLUSTRATION IS SIZED OFF ITS OWN FRAME.
 *
 * It used to take a fixed height, which is why the dot grids and the
 * bar sets broke their card bounds: the card scales with the fan and
 * with the viewport, and a constant cannot follow it. `height` here
 * is whatever the frame actually measures, so the geometry is always
 * derived from the box it has to fit inside — not from the card, not
 * from the viewport, and not from a number written in this file.
 */
function CardViz({ pattern, tint, height }: { pattern: Pattern; tint: string; height: number }) {
  const GRAPHIC_H = Math.max(40, Math.round(height));
  if (pattern.viz === 'bars') {
    return <BarSet items={pattern.bars} height={GRAPHIC_H} showValues={false} radius="pill" inherit />;
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
  return <Sparkline values={pattern.series} color={tint} height={GRAPHIC_H} weight={4} area />;
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

  /* the illustration frame measures itself and hands its box down */
  const frame = useRef<HTMLDivElement>(null);
  const [vizH, setVizH] = useState(0);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setVizH(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      {/* 1 — THE TAG, top-left. It leads on its own; the title has
          moved to the foot of the card so the reading runs number →
          graphic → name, and the name is what you are left holding. */}
      <div className={styles.head}>
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
      <div ref={frame} className={styles.viz}>
        {vizH > 0 ? <CardViz pattern={pattern} tint={tint} height={vizH} /> : null}
      </div>

      {/* 5 — the name, at the foot */}
      <Display size="md" as="h3" tone="inherit" className={styles.title}>
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
