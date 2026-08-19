import { useEffect, useRef, useState } from 'react';
import {
  LandingAudience,
  LandingBlock,
  LandingClosure,
  LandingFuture,
  LandingHero,
  LandingNotice,
  LandingPrinciples,
  OpenPrototypePill,
  WireRuler,
} from '../features/landing';
import styles from './Landing.module.css';

/* Sections 04–08 share one component. 04 carries the argument, so it
   is primary; the four screen sections after it are a repeating
   secondary rhythm with a locked heading baseline. */
const BLOCKS = [
  {
    number: '04',
    name: 'See it working',
    weight: 'primary' as const,
    intent: 'the turn — everything above is a claim, this is the first evidence, and the pill appears here',
    heading: 'See it working',
    body: 'The prototype is real, and unfinished. Open it whenever.',
    slot: 'Live card fan — cropped at viewport edge',
    behaviour: 'live and interactive, running past both edges',
    ratio: '21 / 9',
    bleed: true,
  },
  {
    number: '05',
    name: 'Patterns',
    intent: 'shows the pull, not the push — the interaction is the argument here',
    heading: 'Patterns',
    body: 'Nothing is pushed at you. You pull a card toward you when you want it.',
    slot: 'Home — card fan',
    behaviour: 'still frame of the hand at rest',
  },
  {
    number: '06',
    name: 'Sessions',
    intent: 'raw record, no scoring — answers "what does it do with what I did"',
    heading: 'Sessions',
    body: 'Every session goes in raw. What you did, not how it scored.',
    slot: 'Sessions screen',
    behaviour: 'still frame, calendar beside the log',
  },
  {
    number: '07',
    name: 'Scoreboard',
    intent: 'the privacy line, drawn in public — only sport stats leave the device',
    heading: 'Scoreboard',
    body: 'Your sport stats, and only your sport stats, are yours to share.',
    slot: 'Scoreboard screen',
    behaviour: 'still frame, court and ratings',
  },
  {
    number: '08',
    name: 'Insights',
    intent: 'the payoff — where the mechanics and the tendencies finally meet',
    heading: 'Insights',
    body: 'Where mechanics meet tendencies. Stated plainly, never graded.',
    slot: 'Insights screen',
    behaviour: 'still frame, ask panel beside the library',
  },
];

const RULER = [
  { number: '01', name: 'Hero' },
  { number: '02', name: "What you'll notice" },
  { number: '03', name: "Who it's for" },
  ...BLOCKS.map((b) => ({ number: b.number, name: b.name })),
  { number: '09', name: 'Principles' },
  { number: '10', name: 'Not built yet' },
  { number: '11', name: 'Closure' },
];

/** The public page. A wireframe, and it looks like one — but only the
 *  section containers are drawn, and the sections carry different
 *  weights so the spine of the argument is visible at a glance. */
export function Landing() {
  const [active, setActive] = useState('01');
  const [pillOn, setPillOn] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll<HTMLElement>('[data-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const number = (entry.target as HTMLElement).dataset.section;
          if (!entry.isIntersecting || !number) return;
          setActive(number);
          if (Number(number) >= 4) setPillOn(true);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.landing} ref={root}>
      <WireRuler sections={RULER} active={active} />

      <div className={styles.sections}>
        <LandingHero />
        <LandingNotice />
        <LandingAudience />
        {BLOCKS.map((block) => (
          <LandingBlock key={block.number} {...block} />
        ))}
        <LandingPrinciples />
        <LandingFuture />
        <LandingClosure />
      </div>

      <OpenPrototypePill visible={pillOn} />
    </div>
  );
}
