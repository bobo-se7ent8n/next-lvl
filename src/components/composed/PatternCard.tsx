import type { CSSProperties } from 'react';
import { cx } from '../../lib/css';
import { chartInk, inkOn } from '../../lib/color';
import { Card } from '../primitives/Card';
import { Display, Text } from '../primitives/Text';
import { Metric } from '../primitives/Metric';
import { PatternChart } from '../../features/patterns/PatternChart';
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

/** the fan card front — a header row carrying the name and the kind
 *  tag, the headline reading under it, one line of context, and then
 *  the chart block taking every pixel the three rows above it leave.
 *  No links here: those exist only in the expanded state. */
export function PatternCard({
  pattern,
  hovered,
  onClick,
  showTag = true,
  className,
  style,
}: PatternCardProps) {
  /* TYPE INK COMES FROM THE FACE; CHART INK COMES FROM THE WELL.
     They are two different questions and they were being answered by
     one helper. `inkOn` measures the FACE and hands back light type
     or dark, which is why beige and near-black cards need no special
     case. But the chart does not sit on the face — it sits in a
     level1 well cut into it — so its ink is the face darkened toward
     the page's own ink, which reads on that well for every face in
     the set including the near-black one. */
  const ink = inkOn(pattern.fill);
  const chart = chartInk(pattern.fill);

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
      {/* 1 — THE HEADER ROW: the pattern's name on the left, how the
          number was arrived at on the right. The name leads the card
          again — it used to sit at the foot, which meant the reading
          arrived before you knew what it was a reading OF. */}
      <div className={styles.head}>
        <Display size="md" as="h3" tone="inherit" className={styles.title}>
          {pattern.name}
        </Display>
        <span className={styles.tag}>{pattern.kind}</span>
      </div>

      {/* 2 — THE HERO NUMERAL, the biggest thing on the card, with its
          unit riding beside it at label size */}
      <Metric value={pattern.hero} unit={pattern.unit} size="lg" inherit />

      {/* 3 — one line of context under it, quieter than the numeral */}
      <Text variant="bodySM" tone="inherit" className={styles.trend}>
        {pattern.trend}
      </Text>

      {/* 4 — THE CHART, and it takes everything left.

          THE SAME CHART THE OPENED PANEL DRAWS, from the same series,
          with its annotations off. It fills the block rather than
          being measured into it: `100%` resolves because this block
          has a definite height from the card's own, so no
          ResizeObserver has to publish a pixel height to it. */}
      <div className={styles.viz}>
        <PatternChart pattern={pattern} color={chart} height="100%" compact />
      </div>

      {showTag ? (
        <span className={cx(styles.nameTag, hovered && styles.tagOn)}>
          {pattern.name.toLowerCase()}
        </span>
      ) : null}
    </Card>
  );
}
