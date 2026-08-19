import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Label } from '../../components/primitives/Text';
import styles from './wireframe.module.css';

/* ============================================================
   The wireframe primitives. Three of them, and only the first
   one draws a line: a section is a dashed container, everything
   inside it is a flat tint, and nothing is outlined twice.
   ============================================================ */

export type WireWeight = 'primary' | 'secondary' | 'tertiary';

export interface WireSectionProps {
  /** the section number, e.g. '02' */
  number: string;
  /** the section name */
  name: string;
  /** what this section is FOR — not what shape it is */
  intent: string;
  /** how much of the argument this section carries */
  weight?: WireWeight;
  id?: string;
  children: ReactNode;
  className?: string;
}

/** a full-width band holding one labelled, dashed container */
export function WireSection({
  number,
  name,
  intent,
  weight = 'secondary',
  id,
  children,
  className,
}: WireSectionProps) {
  return (
    <section id={id} className={cx(styles.section, styles[weight], className)} data-section={number}>
      <div className={styles.container}>
        <div className={styles.tag}>
          <Label tone="secondary">
            {number} · {name}
          </Label>
          <Label className={styles.tagIntent}>{intent}</Label>
        </div>
        {children}
      </div>
    </section>
  );
}

export interface WireBoxProps {
  children: ReactNode;
  /** drop the tint — for a region that is only type */
  plain?: boolean;
  className?: string;
}

/** a region inside a section. A flat tint, and no border of its own. */
export function WireBox({ children, plain, className }: WireBoxProps) {
  return (
    <div className={cx(styles.box, plain && styles.plain, className)}>
      <div className={styles.boxBody}>{children}</div>
    </div>
  );
}

export interface WireSlotProps {
  /** what will eventually live here */
  label: string;
  /** how it will behave once it does */
  behaviour: string;
  /** the aspect it is reserved at, e.g. '16 / 9' */
  ratio?: string;
  /** run past the container to the viewport edge */
  bleed?: boolean;
  className?: string;
}

/** a flat muted block standing in for a visual that has not been made */
export function WireSlot({ label, behaviour, ratio = '16 / 9', bleed, className }: WireSlotProps) {
  return (
    <div
      className={cx(styles.slot, bleed && styles.slotBleed, className)}
      style={{ '--slot-ratio': ratio } as CSSProperties}
    >
      {/* what will live here, and how it will behave. The aspect used
          to be printed in the corner as well, which is a note about
          the format rather than about the intent. */}
      <Label tone="secondary">{label}</Label>
      <Label tone="tertiary">{behaviour}</Label>
    </div>
  );
}

export interface WireRulerProps {
  sections: Array<{ number: string; name: string }>;
  active: string;
}

/** the fixed left-edge ruler — which section the page is on */
export function WireRuler({ sections, active }: WireRulerProps) {
  return (
    <div className={styles.ruler} aria-hidden="true">
      {sections.map((s) => (
        <Label
          key={s.number}
          tone="inherit"
          className={cx(styles.rung, s.number === active && styles.rungOn)}
        >
          {s.number}
        </Label>
      ))}
    </div>
  );
}
