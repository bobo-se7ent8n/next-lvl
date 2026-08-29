import type { CSSProperties } from 'react';
import { Sparkline } from '../../components/viz/Sparkline';
import { AreaChart } from '../../components/viz/AreaChart';
import { BarSet } from '../../components/viz/BarSet';
import type { Pattern } from '../../data/types';

/* ============================================================
   ONE PATTERN, ONE CHART.

   THIS FILE EXISTS SO THERE IS EXACTLY ONE ANSWER to "which chart
   does this pattern get". The card in the fan and the opened panel
   used to decide separately, and they disagreed: the card drew
   generated artwork — bars, a dot grid, a scatter, picked by the
   card's INDEX — while the panel drew the pattern's real data. So
   a pattern showed a dot matrix in the hand and capsule bars when
   you opened it, and nothing about the small one told you what the
   big one was going to be.

   The chart TYPE still varies from pattern to pattern, because the
   data does: a set of categories is bars, a series over time is a
   line, a volume is an area. What cannot vary is which of those a
   given pattern gets, in either place.

   The card is the same chart with its annotations off. Not a
   simplified chart, not a stand-in — the same component, the same
   series, smaller and quieter.
   ============================================================ */

export interface PatternChartProps {
  pattern: Pattern;
  /** the ink the line and the area draw in. Bars carry their own
   *  palette tone, so this does not reach them. */
  color: string;
  /** a px number, or a CSS length. The card passes `'100%'` and lets
   *  its chart block decide; the panel passes the height its fit plan
   *  has budgeted. */
  height: number | string;
  /**
   * THE SMALL FORM. Same chart, no annotations: no value above a
   * bar, no category beneath it. A 200px-wide card cannot carry
   * eight-point type legibly, and a chart whose labels are too
   * small to read is a chart wearing decoration.
   */
  compact?: boolean;
  /** take the surrounding ink for any annotation that does show */
  inherit?: boolean;
  /** flood the region under a line. The opened panel asks for it —
   *  at that size a bare stroke reads as thin. */
  area?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function PatternChart({
  pattern,
  color,
  height,
  compact,
  inherit,
  area,
  className,
  style,
}: PatternChartProps) {
  const label = `${pattern.name}: ${pattern.hero}${pattern.unit}`;

  if (pattern.viz === 'bars') {
    return (
      <BarSet
        items={pattern.bars}
        height={height}
        showValues={!compact}
        showLabels={!compact}
        radius="pill"
        inherit={inherit}
        className={className}
        style={style}
      />
    );
  }

  if (pattern.viz === 'dots') {
    return (
      <AreaChart
        values={pattern.series}
        color={color}
        height={height}
        ariaLabel={label}
        className={className}
        style={style}
      />
    );
  }

  return (
    <Sparkline
      values={pattern.series}
      color={color}
      height={height}
      weight={3}
      area={area}
      ariaLabel={label}
      className={className}
      style={style}
    />
  );
}
