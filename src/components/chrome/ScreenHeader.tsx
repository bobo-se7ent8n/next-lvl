import { cx } from '../../lib/css';
import { Display, Text } from '../primitives/Text';
import styles from './ScreenHeader.module.css';

export interface ScreenHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

/** the one header every screen uses. Fixed height, one shared baseline. */
export function ScreenHeader({ title, description, className }: ScreenHeaderProps) {
  return (
    <header className={cx(styles.header, className)}>
      <Display size="xl">{title}</Display>
      {description ? (
        <Text variant="bodySM" tone="tertiary" align="center" className={styles.sub}>
          {description}
        </Text>
      ) : (
        <span />
      )}
    </header>
  );
}
