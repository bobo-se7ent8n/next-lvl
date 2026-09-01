import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/css';
import styles from './FitBox.module.css';

export interface FitBoxProps {
  children: ReactNode;
  /** never scale below this, however short the window gets — past
   *  some point the type stops being readable and a scrollbar is
   *  the honest answer */
  min?: number;
  /** centre what is left in the room rather than hanging it from
   *  the top. THE ALIGNMENT AND THE TRANSFORM ORIGIN ARE ONE
   *  DECISION and this prop is what keeps them together — see the
   *  note in the stylesheet. */
  centred?: boolean;
  className?: string;
}

/**
 * SHRINK TO FIT, RATHER THAN CROP OR SCROLL.
 *
 * A block that must sit inside one viewport and whose content has a
 * natural height taller than the room it is given has three
 * options: cut it off, scroll it, or make it smaller. On a landing
 * page whose whole argument is that the product fits on a screen,
 * the first two are both the page admitting it does not.
 *
 * So this measures what the content naturally wants and what the
 * box actually has, and scales the difference away.
 *
 * THE ALIGNMENT AND THE ORIGIN TRAVEL TOGETHER, and getting that
 * wrong is how this box crops. The inner block keeps its NATURAL
 * layout height whatever scale it is drawn at — that is the same
 * property that makes the measurement stable — so a box that
 * centres an overflowing child puts that child's top edge above
 * its own, and a scale anchored at `top center` then shrinks it in
 * place and leaves it there. The Insights screen was losing about
 * thirty pixels off its top edge to exactly that, inside a section
 * whose argument is that the product fits on a screen.
 *
 * So there is one pairing per alignment and no way to mix them:
 * hung from the top, the origin is the top; centred, the origin is
 * the centre. Either way the painted block lands inside the room.
 *
 * IT CANNOT OSCILLATE, and that is worth spelling out because a
 * fit-to-size box usually can. A `transform` does not change an
 * element's layout box, so the measured natural height is the same
 * number before and after the scale is applied — the observer
 * cannot be woken by its own output. The one thing that would
 * reintroduce a loop is making the inner box's WIDTH depend on the
 * scale, which is why it does not: the content keeps the full width
 * it is given and the scale is uniform, so a shrunk block sits
 * centred with room either side rather than re-flowing into a
 * different layout on the way down.
 */
export function FitBox({ children, min = 0.6, centred, className }: FitBoxProps) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const outer = box.current;
    const content = inner.current;
    if (!outer || !content) return;

    const measure = () => {
      const room = outer.clientHeight;
      /* the LAYOUT height, which the transform below does not touch */
      const natural = content.offsetHeight;
      if (room <= 0 || natural <= 0) return;
      const next = Math.max(min, Math.min(1, room / natural));
      setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(content);
    return () => ro.disconnect();
  }, [min]);

  return (
    <div ref={box} className={cx(styles.box, centred && styles.centred, className)}>
      <div
        ref={inner}
        className={styles.inner}
        style={{ transform: `scale(${scale.toFixed(4)})` }}
      >
        {children}
      </div>
    </div>
  );
}
