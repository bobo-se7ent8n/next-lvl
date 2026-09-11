import type { CSSProperties } from 'react';
import type { Sticker } from './heroScenes';
import styles from './LandingHero.module.css';

/**
 * ONE THING PINNED TO THE SCENE.
 *
 * Two boxes, one job each. The SLOT carries the place — design
 * pixels, turned into lengths by the stylesheet — and it is the only
 * thing that moves when a scene changes. The ART inside it carries
 * the tilt, so a sticker turned 50° still drifts straight away from
 * the shot rather than 50° off.
 */
export function HeroSticker({ sticker }: { sticker: Sticker }) {
  const { x, y, w, h, rotate, twist } = sticker;

  const slot = {
    '--x': x,
    '--y': y,
    '--dx': sticker.driftX,
    '--dy': sticker.driftY,
    ...(w === undefined ? null : { '--sw': w }),
    ...(h === undefined ? null : { '--sh': h }),
    ...(twist ? { '--twist': 'var(--aera-hero-sticker-twist)' } : null),
  } as CSSProperties;

  return (
    <div className={styles.slot} data-sized={w === undefined ? undefined : true} style={slot}>
      <div className={styles.art} style={{ '--rot': `${rotate}deg` } as CSSProperties}>
        <Art sticker={sticker} />
      </div>
    </div>
  );
}

function Art({ sticker }: { sticker: Sticker }) {
  switch (sticker.kind) {
    case 'image':
      return (
        <div
          className={styles.picture}
          style={{
            backgroundImage: `url(${sticker.src})`,
            ...(sticker.bgSize ? { backgroundSize: sticker.bgSize } : null),
            ...(sticker.bgPos ? { backgroundPosition: sticker.bgPos } : null),
          }}
        />
      );

    /* the hand-drawn line: a path, so it takes a token colour and its
       stroke scales with the picture */
    case 'line':
      return (
        <svg className={styles.line} viewBox={sticker.viewBox} preserveAspectRatio="none">
          <path d={sticker.d} fill="none" stroke={sticker.stroke} strokeWidth={sticker.strokeWidth} />
        </svg>
      );

    case 'pill':
      return (
        <span className={styles.pill} style={{ background: sticker.fill, color: sticker.ink }}>
          {sticker.text}
        </span>
      );

    case 'strip':
      return <span className={styles.strip}>{sticker.text}</span>;

    /* the app's tab pair, lifted out of the screen it belongs to */
    case 'tabs':
      return (
        <span className={styles.tabs}>
          <span className={styles.tabOn}>
            {sticker.on}
            <svg className={styles.lock} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={styles.tabOff}>{sticker.off}</span>
        </span>
      );

    /* a legend key lifted out of a chart */
    case 'legend':
      return (
        <span className={styles.legend} data-small={sticker.small ? true : undefined}>
          <span className={styles.swatch} style={{ background: sticker.fill }} />
          <span className={styles.legendWord}>{sticker.text}</span>
        </span>
      );

    /* a session's line from the sessions list, set in the app's own type */
    case 'stats':
      return (
        <span className={styles.stats}>
          <span className={styles.statTitle}>{sticker.title}</span>
          <span className={styles.statRow}>
            {sticker.values.map(([value, unit]) => (
              <span key={unit} className={styles.statPair}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statUnit}>{unit}</span>
              </span>
            ))}
          </span>
        </span>
      );

    /* the Focus reading, as the app draws it */
    case 'reading':
      return (
        <span className={styles.reading}>
          <span className={styles.readingRow}>
            <span className={styles.readingValue}>{sticker.value}</span>
            <span className={styles.readingUnit}>{sticker.unit}</span>
          </span>
          <span className={styles.caption}>{sticker.caption}</span>
        </span>
      );

    case 'badge':
      return (
        <span className={styles.badge} style={{ background: sticker.fill, color: sticker.ink }}>
          {sticker.text}
        </span>
      );

    case 'label':
      return <span className={styles.label}>{sticker.text}</span>;
  }
}
