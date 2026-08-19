import { Fragment } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { inkWords } from '../../lib/inkVariation';
import type { TextStyleName } from '../../tokens';
import styles from './Text.module.css';

export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'onInverse' | 'inherit';

const TONE_VAR: Record<TextTone, string> = {
  primary: 'var(--aera-color-ink-primary)',
  secondary: 'var(--aera-color-ink-secondary)',
  tertiary: 'var(--aera-color-ink-tertiary)',
  onInverse: 'var(--aera-color-ink-on-inverse)',
  inherit: 'inherit',
};

function styleVar(name: TextStyleName): CSSProperties {
  const key = `--aera-text-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
  return {
    '--family': `var(${key}-family)`,
    '--size': `var(${key}-size)`,
    '--leading': `var(${key}-leading)`,
    '--tracking': `var(${key}-tracking)`,
    '--weight': `var(${key}-weight)`,
    '--transform': `var(${key}-transform)`,
  } as CSSProperties;
}

export interface TextProps {
  children: ReactNode;
  /** which composed text token to render in */
  variant?: TextStyleName;
  tone?: TextTone;
  as?: ElementType;
  align?: 'start' | 'center' | 'end';
  /** tabular figures — use for anything a reader will compare */
  numeric?: boolean;
  /** cap the line length at the readable measure */
  measure?: boolean;
  /** truncate after n lines */
  lines?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** an explicit accessible name — used when the visible text is
   *  broken into per-letter spans */
  'aria-label'?: string;
}

/** the one text component — every string in the product goes through it */
export function Text({
  children,
  variant = 'body',
  tone = 'primary',
  as,
  align,
  numeric,
  measure,
  lines,
  className,
  style,
  id,
  'aria-label': ariaLabel,
}: TextProps) {
  const Tag = (as ?? 'p') as ElementType;
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={[
        styles.text,
        numeric ? styles.numeric : '',
        measure ? styles.measure : '',
        lines ? styles.clamp : '',
        align ? styles[`align-${align}`] : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...styleVar(variant),
        '--tone': TONE_VAR[tone],
        ...(lines ? ({ '--lines': lines } as CSSProperties) : null),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export interface DisplayProps extends Omit<TextProps, 'variant' | 'children'> {
  children: string;
  size?: 'xl' | 'lg' | 'md';
  /** per-letter weight variation. On by default for xl and lg. */
  inked?: boolean;
}

const DISPLAY_VARIANT = {
  xl: 'displayXL',
  lg: 'displayLG',
  md: 'displayMD',
} as const;

/** a display headline — Oswald, uppercase, optionally hand-set */
export function Display({
  children,
  size = 'xl',
  inked,
  as,
  ...rest
}: DisplayProps) {
  const useInk = inked ?? (size === 'xl' || size === 'lg');
  const variant = DISPLAY_VARIANT[size];
  const Tag = as ?? (size === 'xl' ? 'h1' : size === 'lg' ? 'h2' : 'h3');

  if (!useInk) {
    return (
      <Text {...rest} as={Tag} variant={variant}>
        {children}
      </Text>
    );
  }

  return (
    <Text {...rest} as={Tag} variant={variant} aria-label={children}>
      {/* Letters are grouped into WORDS before they are drawn.
          Every letter is its own inline-block (it carries its own
          weight and its own rotation), and an inline-block is a
          break opportunity — so a headline of loose letters wrapped
          mid-word while the spaces, drawn as &nbsp;, refused to
          break at all. Wrapping each word in a nowrap box moves the
          break opportunities back to where the spaces are. */}
      <span aria-hidden="true">
        {inkWords(children).map((word, w) => (
          <Fragment key={w}>
            {/* the space lives BETWEEN the word boxes, never inside
                one — a space inside a nowrap box is not a break
                opportunity, which is the whole point of the box */}
            {w > 0 ? ' ' : null}
            <span className={styles.word}>
              {word.map((letter, i) => (
                <span
                  key={i}
                  className={styles.letter}
                  style={{
                    fontVariationSettings: `'wght' ${letter.weight}`,
                    fontWeight: letter.weight,
                    transform: `translateY(${letter.shift}px) rotate(${letter.rotate}deg)`,
                  }}
                >
                  {letter.char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </Text>
  );
}

export type LabelProps = Omit<TextProps, 'variant'>;

/** the mono micro-label — the annotation voice of the whole product.
 *  There is one mono size now; the two label sizes it replaces were a
 *  distinction nobody could see. */
export function Label({ tone = 'tertiary', ...rest }: LabelProps) {
  return <Text {...rest} tone={tone} variant="mono" as={rest.as ?? 'span'} />;
}

/** mono running text — timecodes, counts, machine readings */
export function Mono({ tone = 'secondary', ...rest }: Omit<TextProps, 'variant'>) {
  return <Text {...rest} tone={tone} variant="mono" numeric as={rest.as ?? 'span'} />;
}
