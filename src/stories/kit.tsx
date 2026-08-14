import type { CSSProperties, ReactNode } from 'react';
import { Label, Text } from '../components/primitives/Text';
import styles from './kit.module.css';

/** every story names the thing it documents */
export function StoryFrame({
  name,
  note,
  children,
  width,
}: {
  name: string;
  note?: string;
  children: ReactNode;
  width?: number | string;
}) {
  return (
    <section className={styles.frame} style={{ width }}>
      <header className={styles.frameHead}>
        <Label size="lg" tone="secondary">
          {name}
        </Label>
        {note ? (
          <Text variant="bodyXS" tone="tertiary">
            {note}
          </Text>
        ) : null}
      </header>
      <div className={styles.frameBody}>{children}</div>
    </section>
  );
}

/** a labelled row inside a variants story */
export function Variant({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={styles.variant}>
      <Label className={styles.variantName}>{name}</Label>
      <div className={styles.variantBody}>{children}</div>
    </div>
  );
}

export function Row({ children, gap = 12 }: { children: ReactNode; gap?: number }) {
  return (
    <div className={styles.row} style={{ gap }}>
      {children}
    </div>
  );
}

export function Column({ children, gap = 18 }: { children: ReactNode; gap?: number }) {
  return (
    <div className={styles.column} style={{ gap }}>
      {children}
    </div>
  );
}

/** the token table used by every Tokens story */
export function TokenGrid({ children }: { children: ReactNode }) {
  return <div className={styles.tokenGrid}>{children}</div>;
}

export function TokenCard({
  name,
  value,
  cssVar,
  children,
}: {
  name: string;
  value: string;
  cssVar: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.tokenCard}>
      {children ? <div className={styles.tokenSample}>{children}</div> : null}
      <div className={styles.tokenMeta}>
        <Text variant="bodySM" tone="primary" style={{ fontWeight: 'var(--aera-weight-semibold)' }}>
          {name}
        </Text>
        <Text as="span" variant="bodyXS" tone="secondary" numeric>
          {value}
        </Text>
        <Label>{cssVar}</Label>
      </div>
    </div>
  );
}

export function Swatch({ color, style }: { color: string; style?: CSSProperties }) {
  return <div className={styles.swatch} style={{ background: color, ...style }} />;
}
