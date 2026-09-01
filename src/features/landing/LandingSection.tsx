import type { ReactNode } from 'react';
import { cx } from '../../lib/css';
import { Display, Text } from '../../components/primitives/Text';
import styles from './LandingSection.module.css';

export interface LandingSectionProps {
  heading: string;
  /** one line under the heading; omitted on the sections that carry
   *  their argument in the scroll instead */
  body?: string;
  id?: string;
  children: ReactNode;
  /** centre the head and everything under it */
  centred?: boolean;
  /** the section is exactly one window tall and nothing inside it
   *  scrolls — used where the whole point is that it fits */
  fit?: boolean;
  /** set the body on the WIDE measure rather than the readable one.
   *  For a single centred sentence under a display heading, where
   *  the readable measure breaks it onto a third line and a
   *  three-line block stops reading as a caption. */
  wideBody?: boolean;
  className?: string;
}

/**
 * A BAND ON THE PAGE.
 *
 * A heading, an optional line, and then whatever the section is
 * actually about. It draws nothing itself.
 *
 * THE NUMBERS ARE GONE. Every section used to print its place in
 * the running order above its own heading, which is a habit left
 * over from the wireframe this page grew out of: on a page with an
 * actual running order, the number is a second piece of type
 * competing with the heading immediately under it, and it tells the
 * reader something only the person who built the page cares about.
 *
 * `fit` is the one behavioural prop: it makes the section exactly
 * one window tall with its content centred in what the head leaves,
 * for the sections whose argument is that they fit on a screen. It
 * is a `min-height` with `overflow: hidden` rather than a fixed
 * height with a scrollbar — a section that says "this is one screen"
 * and then scrolls inside itself is not saying it.
 */
export function LandingSection({
  heading,
  body,
  id,
  children,
  centred,
  fit,
  wideBody,
  className,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cx(styles.section, centred && styles.centred, fit && styles.fit, className)}
      data-section={heading}
    >
      <header className={styles.head}>
        <Display size="lg">{heading}</Display>
        {body ? (
          <Text
            variant="body"
            tone="secondary"
            className={cx(styles.body, wideBody && styles.bodyWide)}
          >
            {body}
          </Text>
        ) : null}
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
