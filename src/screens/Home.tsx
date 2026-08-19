import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp } from '../lib/chart';
import { PageHeader } from '../components/chrome/PageHeader';
import { PatternFan } from '../features/patterns/PatternFan';
import { FocusPanel } from '../features/home/FocusPanel';
import { VitalCard } from '../features/home/VitalCard';
import { PATTERNS, VITALS } from '../data';
import styles from './Home.module.css';

/** wheel px that advance the hand by one card */
const WHEEL_PER_CARD = 170;
/** the extra push at the end of the set before the page releases */
const RELEASE_PUSH = 90;

/** Stage one spends the scroll on the hand; at the end of the set the
 *  lock releases and the page moves, once, to stage two. */
export function Home() {
  const [position, setPosition] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const stageTwo = useRef<HTMLDivElement>(null);
  const push = useRef(0);
  const snapping = useRef(false);
  const positionRef = useRef(0);
  const openRef = useRef<number | null>(null);

  /* the wheel handler reads the latest values without re-subscribing */
  useEffect(() => {
    positionRef.current = position;
    openRef.current = openIndex;
  }, [position, openIndex]);

  const max = PATTERNS.length - 1;

  const animateScrollTo = useCallback((to: number) => {
    snapping.current = true;
    const from = window.scrollY;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 420);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      window.scrollTo(0, from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
      else {
        snapping.current = false;
        push.current = 0;
      }
    };
    requestAnimationFrame(step);
  }, []);

  const consume = useCallback(
    (delta: number) => {
      if (snapping.current) return true;
      /* a card is open — the page holds still behind it */
      if (openRef.current != null) return true;

      const top = stageTwo.current?.offsetTop ?? window.innerHeight;
      const inStageOne = window.scrollY < top * 0.5;

      if (inStageOne) {
        if (delta > 0 && positionRef.current >= max - 0.001) {
          push.current += delta;
          if (push.current > RELEASE_PUSH) {
            push.current = 0;
            animateScrollTo(top);
          }
          return true;
        }
        push.current = 0;
        setPosition((p) => clamp(p + delta / WHEEL_PER_CARD, 0, max));
        return true;
      }

      if (delta < 0 && window.scrollY <= top + 2) {
        setPosition(max);
        animateScrollTo(0);
        return true;
      }
      return false;
    },
    [animateScrollTo, max],
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta =
        e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (consume(delta)) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [consume]);

  useEffect(() => {
    let last: number | null = null;
    const onStart = (e: TouchEvent) => {
      last = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (last == null) return;
      const y = e.touches[0].clientY;
      const delta = (last - y) * 1.4;
      last = y;
      if (consume(delta)) e.preventDefault();
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
  }, [consume]);

  return (
    <>
      <section className={styles.stageOne}>
        <PageHeader
          title="Patterns"
          subhead="A pattern is a behaviour your sessions keep repeating. Twelve of them are holding right now."
        />
        <PatternFan
          className={styles.fan}
          patterns={PATTERNS}
          position={position}
          onPosition={(p) => setPosition(clamp(p, 0, max))}
          openIndex={openIndex}
          onOpen={setOpenIndex}
        />
      </section>

      <section className={styles.stageTwo} ref={stageTwo}>
        <PageHeader
          title="Focus & vitals"
          subhead="One thing worth attention this week, and the body readings underneath it."
        />
        <div className={styles.grid}>
          <FocusPanel />
          <div className={styles.vitals}>
            {VITALS.map((vital) => (
              <VitalCard key={vital.id} vital={vital} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
