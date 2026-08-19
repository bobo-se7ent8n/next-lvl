import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Chip } from '../../components/primitives/Chip';
import { Display, Label, Text } from '../../components/primitives/Text';
import styles from './BrowserPage.module.css';

export interface BrowserPageProps {
  title: string;
  chip: string;
  description: string;
  children: ReactNode;
}

/** the main panel of the browser — one shape for every page in it */
export function BrowserPage({ title, chip, description, children }: BrowserPageProps) {
  return (
    <article className={styles.page}>
      <header className={styles.head}>
        <div className={styles.titleRow}>
          <Display size="xl">{title}</Display>
          <Chip>{chip}</Chip>
        </div>
        <Label tone="tertiary">{description}</Label>
      </header>
      <div className={styles.body}>{children}</div>
    </article>
  );
}

export interface SpecimenGridProps {
  /** the narrowest a specimen gets before the grid rewraps */
  min?: string;
  children: ReactNode;
}

export function SpecimenGrid({ min = '168px', children }: SpecimenGridProps) {
  return (
    <div className={styles.specimens} style={{ '--specimen-w': min } as CSSProperties}>
      {children}
    </div>
  );
}

export interface SpecimenProps {
  name: string;
  value: string;
  /** the swatch or shape, when it is not a plain colour block */
  children?: ReactNode;
  background?: string;
  radius?: string;
  shadow?: string;
}

/** one specimen: the shape, then its name and value stacked in mono */
export function Specimen({ name, value, children, background, radius, shadow }: SpecimenProps) {
  return (
    <div className={styles.specimen}>
      {children ?? (
        <div
          className={styles.swatch}
          style={
            {
              '--swatch-bg': background,
              '--swatch-radius': radius,
              '--swatch-shadow': shadow,
            } as CSSProperties
          }
        />
      )}
      <div className={styles.meta}>
        <Label tone="secondary">{name}</Label>
        <Label tone="tertiary">{value}</Label>
      </div>
    </div>
  );
}

export function BrowserSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <Label tone="secondary">{title}</Label>
      {children}
    </section>
  );
}

export function Demo({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.demo, className)}>{children}</div>;
}

export function DemoRow({ children }: { children: ReactNode }) {
  return <div className={styles.demoRow}>{children}</div>;
}

export function DemoGrid({ children }: { children: ReactNode }) {
  return <div className={styles.demoGrid}>{children}</div>;
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Text variant="bodySM" tone="secondary">
      {children}
    </Text>
  );
}
