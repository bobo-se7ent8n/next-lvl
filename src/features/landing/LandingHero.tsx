import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes';
import { prefersReducedMotion } from '../../lib/enter';
import { heroHandoff } from '../../tokens';
import { HeroHeadline } from './HeroHeadline';
import { HeroModes } from './HeroModes';
import { HeroSticker } from './HeroSticker';
import { HERO_PRELOAD, SCENES } from './heroScenes';
import { useSectionProgress } from './scroll';
import { useKeywordCycle } from './useKeywordCycle';
import styles from './LandingHero.module.css';

type Phase = 'hero' | 'leave' | 'modes';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * THE HERO, AND THE SCREEN IT HANDS OVER TO.
 *
 * First screen: a sentence naming the three things the product
 * does, a way in under it, and the product with the vocabulary of
 * whichever word is lit scattered around it. It is solved to fit
 * the window — see the stylesheet.
 *
 * Then the page keeps scrolling and the product shot does not. It
 * pins in the middle of the window; the stickers leave; the shot
 * moves right and grows; and Play, Score and Read come in on the
 * left, one per stretch of scroll, each explaining the word the
 * sentence only named. When the last one has been read the shot
 * lets go and the page carries on.
 *
 * IT IS A TALL BOX WITH A STICKY CHILD, AND NOTHING ELSE. There is
 * no wheel handler and nothing here writes the scroll position
 * (bar one: a click on a mode's name scrolls to it, like a link to
 * an anchor). The scroll loop READS how far through the box the
 * page is and does two things with it: writes each mode's progress
 * onto a custom property, and flips the phase when a threshold is
 * crossed. Every phase change is a CSS transition on transform and
 * opacity — the page is never scrubbing a layout.
 *
 * ONE SHOT, NOT TWO. The picture that grows into the handoff is the
 * same element that sat under the headline. It is laid out at its
 * HANDOFF size and scaled down for the hero, so it is sharp at the
 * size it is largest and the move between the two is a transform.
 */
export function LandingHero() {
  const host = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const heroSlot = useRef<HTMLDivElement>(null);
  const shotBox = useRef<HTMLDivElement>(null);

  const { active, shown, lit, hold, release, park } = useKeywordCycle(SCENES.length, host);

  /* the opening runs once, after a paint — see the stylesheet */
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /* the two DISCRETE things the scroll decides. Held in state so the
     tree re-renders when one changes — and only then: the refs make
     sure a frame that crosses no threshold sets nothing. */
  const [phase, setPhase] = useState<Phase>('hero');
  const [mode, setMode] = useState(0);
  const last = useRef<{ phase: Phase; mode: number }>({ phase: 'hero', mode: 0 });

  /* THE GEOMETRY THE LOOP NEEDS, read on layout rather than per frame.
     `top` is where the pin sticks (a resolved calc), `travel` is how
     far the page scrolls while it is stuck, and `--from` is how much
     smaller the shot is under the headline than in the handoff — the
     one ratio of two lengths CSS cannot compute for itself. */
  const geo = useRef({ top: 0, travel: 1 });
  useEffect(() => {
    const read = () => {
      const p = pin.current;
      const t = track.current;
      const slot = heroSlot.current;
      const box = shotBox.current;
      if (!p || !t || !slot || !box) return;
      geo.current = {
        top: Number.parseFloat(getComputedStyle(p).top) || 0,
        travel: Math.max(1, t.offsetHeight - p.offsetHeight),
      };
      if (box.offsetWidth > 0) {
        p.style.setProperty('--from', (slot.offsetWidth / box.offsetWidth).toFixed(4));
      }
    };
    read();
    const observer = new ResizeObserver(read);
    if (pin.current) observer.observe(pin.current);
    if (shotBox.current) observer.observe(shotBox.current);
    window.addEventListener('resize', read);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', read);
    };
  }, []);

  /* how far through the stuck stretch the page is: 0 until the pin
     sticks, 1 as it lets go */
  const measure = useCallback((el: HTMLElement) => {
    const { top, travel } = geo.current;
    return clamp01((top - el.getBoundingClientRect().top) / travel);
  }, []);

  const onProgress = useCallback((p: number) => {
    const el = pin.current;
    if (!el) return;
    const { leaveAt, modesAt, segment } = heroHandoff;

    /* continuous: each mode's rule, straight onto a custom property */
    for (let i = 0; i < SCENES.length; i += 1) {
      el.style.setProperty(`--row-${i}`, clamp01((p - modesAt - i * segment) / segment).toFixed(4));
    }

    /* discrete: a threshold crossed is a state change, nothing else is */
    const nextPhase: Phase = p >= modesAt ? 'modes' : p > leaveAt ? 'leave' : 'hero';
    const nextMode = Math.min(SCENES.length - 1, Math.max(0, Math.floor((p - modesAt) / segment)));
    if (nextPhase !== last.current.phase) {
      last.current.phase = nextPhase;
      setPhase(nextPhase);
    }
    if (nextMode !== last.current.mode) {
      last.current.mode = nextMode;
      setMode(nextMode);
    }
  }, []);

  useSectionProgress(track, onProgress, measure);

  /* nobody is reading the keywords once the page is past them */
  useEffect(() => {
    park(phase !== 'hero');
  }, [phase, park]);

  /* a mode's name, clicked: scroll to the start of its stretch */
  const goTo = useCallback((index: number) => {
    const t = track.current;
    if (!t) return;
    const { top, travel } = geo.current;
    const start = t.getBoundingClientRect().top + window.scrollY - top;
    const at = heroHandoff.modesAt + (index + 0.05) * heroHandoff.segment;
    window.scrollTo({ top: start + at * travel, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  /* under the headline the shot follows the cycle; in the handoff it
     follows the mode */
  const on = phase === 'hero' ? shown : mode;

  return (
    <section ref={host} className={styles.hero} data-section="hero" data-open={open} data-phase={phase}>
      <div className={styles.head}>
        <div className={styles.riseHead}>
          <HeroHeadline active={active} lit={lit} onHold={hold} onRelease={release} />
        </div>

        <div className={styles.riseCta}>
          <Link to={ROUTES.home} className={styles.cta}>
            Try it now
          </Link>
        </div>
      </div>

      <div ref={track} className={styles.track}>
        <div ref={pin} className={styles.pin}>
          {/* the scene: the sticker field's coordinate space, and the
              invisible box the shot occupies under the headline */}
          <div className={styles.scene}>
            <div className={styles.field} aria-hidden="true">
              <div className={styles.leave}>
                {SCENES.map((scene, i) => (
                  <div key={scene.word} className={styles.layer} data-on={shown === i}>
                    {scene.stickers.map((sticker) => (
                      <HeroSticker key={sticker.id} sticker={sticker} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div ref={heroSlot} className={styles.heroSlot} aria-hidden="true" />
          </div>

          <div className={styles.shotRise}>
            <div ref={shotBox} className={styles.shotBox}>
              {SCENES.map((scene, i) => (
                <img
                  key={scene.word}
                  className={styles.shot}
                  data-on={on === i}
                  src={scene.shot}
                  alt={on === i ? scene.shotAlt : ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              ))}
            </div>
          </div>

          <div className={styles.modesSlot}>
            <HeroModes active={mode} shown={phase === 'modes'} onPick={goTo} />
          </div>
        </div>
      </div>

      {/* every picture the cycle will need, fetched on mount */}
      <div className={styles.preload} aria-hidden="true">
        {HERO_PRELOAD.map((src) => (
          <img key={src} src={src} alt="" loading="eager" decoding="async" />
        ))}
      </div>
    </section>
  );
}
