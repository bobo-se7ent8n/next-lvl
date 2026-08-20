import { cx } from '../../lib/css';
import styles from './NavBar.module.css';

export interface NavItem<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface NavBarProps<T extends string = string> {
  items: Array<NavItem<T>>;
  value: T;
  onChange: (next: T) => void;
  /** render in flow rather than fixed to the top of the viewport */
  inline?: boolean;
  className?: string;
}

/** the main nav — fixed to the bottom of the viewport, centred */
export function NavBar<T extends string>({
  items,
  value,
  onChange,
  inline,
  className,
}: NavBarProps<T>) {
  return (
    <nav aria-label="Main" className={cx(styles.nav, inline && styles.inline, className)}>
      <div className={styles.track}>
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            aria-current={item.value === value ? 'page' : undefined}
            onClick={() => onChange(item.value)}
            className={cx(styles.item, item.value === value && styles.itemOn)}
          >
            {/* the active item no longer changes weight, so the label
                is measured once and the track's width is the same on
                every tab by construction */}
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
