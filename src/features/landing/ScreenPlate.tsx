import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/css';
import { landing } from '../../tokens';
import styles from './ScreenPlate.module.css';

/* THE LOGICAL SCREEN, IN ONE PLACE.

   Every app screen shown on this page is drawn at the same size and
   then fitted to whatever frame it is standing in. The alternative —
   letting each frame lay its screen out at its own width — means the
   Scoreboard inside a laptop bezel and the Sessions list inside a
   window frame are two different layouts of the same product, and
   the reader has no way to tell which one they are looking at. */
const PLATE_W = Number.parseFloat(landing.shotWidth);
const PLATE_H = Number.parseFloat(landing.shotHeight);

export interface ScreenPlateProps {
  children: ReactNode;
  /** let the screen inside receive clicks — off by default, because
   *  most of these are pictures rather than demonstrations */
  live?: boolean;
  className?: string;
}

/**
 * A fixed 1280 × 800 drawing surface, scaled uniformly to fill its
 * container.
 *
 * `transform: scale()` rather than a fluid layout on purpose. A
 * screen reflowed to 480px wide is a DIFFERENT screen — three
 * columns become one, the sticky column unpins, the bento breaks —
 * and what belongs on a landing page is the product at its real
 * proportions, made smaller. Scaling also means the embedded screens
 * cost nothing to keep true: they are the same components the app
 * renders, laid out at the width the app lays them out at.
 */
export function ScreenPlate({ children, live, className }: ScreenPlateProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    /* `offsetWidth`, NOT `getBoundingClientRect().width`.

       Two of the frames a plate stands in are scaled by their
       section as it arrives — the insights reveal grows its screen
       out of the bubble — and a bounding rect measured inside one of
       those reports the PAINTED width, which is the section's
       transform multiplied by ours. The plate would then be sized
       against a number that already contains its own answer, and
       would settle at whatever scale the section happened to be at
       when it first laid out. The layout box has no transform in it. */
    const measure = () => {
      const width = el.offsetWidth;
      setScale((prev) => {
        const next = width > 0 ? width / PLATE_W : 1;
        return Math.abs(prev - next) < 0.0005 ? prev : next;
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className={cx(styles.box, className)}
      /* the reserved box's aspect is the plate's own, so the two
         cannot drift apart if the logical screen size is ever
         retuned in the token file */
      style={{ aspectRatio: `${PLATE_W} / ${PLATE_H}` }}
    >
      <div
        className={cx(styles.plate, live && styles.live)}
        style={{
          width: `${PLATE_W}px`,
          height: `${PLATE_H}px`,
          transform: `scale(${scale.toFixed(4)})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
