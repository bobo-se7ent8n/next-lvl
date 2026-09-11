/* ============================================================
   THE HERO'S CLOCK.

   One state at a time — a keyword, or the neutral beat where none
   of them is lit — and one chain of timeouts driving it.

   IT IS A CHAIN, NOT AN INTERVAL, and that is the whole reason
   this is a hook rather than four lines in the component. An
   interval keeps firing while the pointer is holding a word, so
   the moment the pointer leaves you get whatever ticks queued up
   behind it all at once. A chain has exactly one timer alive at
   any moment: pausing is clearing it and resuming is scheduling
   the next one, so there is no backlog to drain and no way for two
   runs of the cycle to exist at the same time.

   THE CHAIN LIVES OUTSIDE REACT. `arm` re-arms itself when it
   fires, and a self-calling `useCallback` is a function that
   cannot see its own later versions — the first one captured would
   keep running forever. So the whole clock is a plain object in a
   ref and two module functions that take it; the hook only owns
   the state the chain reports back into.

   THREE PIECES OF STATE, NOT ONE.
   · `active` — which word carries the rule.
   · `shown`  — which scene is drawn, which is NOT the same
                question: nothing changes scene on the way into
                neutral, so the picture stays on the last word.
   · `lit`    — whether the active word's letters are in colour.
   `active` and `lit` come apart in exactly one case and it is the
   important one: the pointer leaves a word it was holding, the
   letters go back to ink, and the rule and the scene stay where
   the reader put them. Collapsing them is what makes a hover feel
   like it was undone.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/enter';
import { NEUTRAL } from './heroScenes';

export interface Cycle {
  /** the keyword index carrying the rule, or NEUTRAL */
  active: number;
  /** the scene on screen — held through the neutral beat */
  shown: number;
  /** whether the active keyword's letters are in their colours */
  lit: boolean;
  /** the pointer, or the keyboard, has taken a word */
  hold: (index: number) => void;
  /** and let it go again */
  release: () => void;
  /** stop the run while the page has scrolled on into the handoff,
   *  and pick it back up when it scrolls back */
  park: (parked: boolean) => void;
}

interface State {
  active: number;
  shown: number;
  lit: boolean;
}

interface Clock {
  timer: number;
  /** the state the chain will advance FROM */
  at: number;
  /** a word is being held, so the chain stays parked */
  held: boolean;
  /** and whether anyone is actually looking at the screen */
  seen: boolean;
  /** the page has scrolled on past the hero into the handoff */
  parked: boolean;
  count: number;
  /** when the run was first armed, which the lead-in is measured from */
  startedAt: number;
  /** has the cycle actually advanced once yet */
  ran: boolean;
  report: (next: number) => void;
}

/* THE FIRST STATE IS HELD LONGER THAN THE REST.

   The run starts on the first keyword, and it has to still BE on
   the first keyword when the screen finishes assembling — otherwise
   the opening lands on whatever the clock has already moved on to
   and the page never shows you where the run begins. So the first
   wait is the dwell PLUS however much of the opening is still to
   come, and every wait after the first switch is the plain dwell.

   IT IS THE REMAINDER, NOT A FLAG, and that is the whole point.
   The chain is armed more than once before it ever fires: the
   observer that gates it on visibility delivers its first callback
   a task after the effect subscribes, and that re-arms. A flag
   spent on the first ARM would be gone by then and the second arm
   would drop the lead-in on the floor — which is exactly the bug
   this replaced. Measuring what is LEFT of the lead-in makes every
   re-arm before the first switch land in the same place. */
function firstWait(clock: Clock): number {
  if (clock.ran) return holdFor(clock);
  const left = Math.max(0, leadIn() - (performance.now() - clock.startedAt));
  return dwell() + left;
}

/* how long the CURRENT state is held: a keyword for the full dwell,
   the neutral beat for half of it — there is nothing in it to read */
function holdFor(clock: Clock): number {
  return clock.at === NEUTRAL ? neutralDwell() : dwell();
}

function stop(clock: Clock): void {
  if (clock.timer) window.clearTimeout(clock.timer);
  clock.timer = 0;
}

/** one link of the chain: wait, advance, and re-arm at the dwell */
function arm(clock: Clock, wait: number): void {
  stop(clock);
  if (clock.held || clock.parked || !clock.seen || prefersReducedMotion()) return;
  clock.timer = window.setTimeout(() => {
    clock.timer = 0;
    clock.ran = true;
    const next = clock.at + 1 >= clock.count ? NEUTRAL : clock.at + 1;
    clock.at = next;
    clock.report(next);
    arm(clock, holdFor(clock));
  }, wait);
}

export function useKeywordCycle(count: number, host: React.RefObject<HTMLElement | null>): Cycle {
  /* kw1, lit, which is also exactly the state a visitor who asked
     for less motion is left in — so that case needs no effect and
     no setState, only a clock that is never armed */
  const [state, setState] = useState<State>(() => ({ active: 0, shown: 0, lit: true }));

  const clock = useRef<Clock>({
    timer: 0,
    at: 0,
    held: false,
    seen: true,
    parked: false,
    startedAt: 0,
    ran: false,
    count,
    report: () => {},
  });

  /* THE CHAIN'S VIEW OF THE WORLD, KEPT CURRENT FROM AN EFFECT.
     A ref written during render is a write to something React has
     not committed yet, and in a concurrent render it can be the
     wrong one. This effect is declared before the one that starts
     the chain, and effects run in order, so the clock is already
     wired by the time anything arms it. */
  useEffect(() => {
    const c = clock.current;
    c.count = count;
    c.report = (next: number) =>
      setState((s) => ({
        active: next,
        shown: next === NEUTRAL ? s.shown : next,
        lit: next !== NEUTRAL,
      }));
  }, [count]);

  /* ---- the pointer, and the keyboard, which behaves the same --- */

  const hold = useCallback((index: number) => {
    const c = clock.current;
    c.held = true;
    c.at = index;
    stop(c);
    setState({ active: index, shown: index, lit: true });
  }, []);

  const release = useCallback(() => {
    const c = clock.current;
    c.held = false;
    /* THE WORD STAYS. Only the colour comes off — see the note at
       the top — so the scene and the rule are left exactly where
       the reader put them and the cycle picks up from there. */
    setState((s) => ({ ...s, lit: false }));
    arm(c, resumeDelay());
  }, []);

  /* THE HANDOFF PARKS THE RUN. Once the page has scrolled on past
     the sentence there is nobody reading the keywords, and a scene
     switching underneath the handoff would change the picture the
     handoff is about to take over. Unparking picks up where it was. */
  const park = useCallback((parked: boolean) => {
    const c = clock.current;
    if (c.parked === parked) return;
    c.parked = parked;
    if (parked) stop(c);
    else arm(c, firstWait(c));
  }, []);

  /* ---- the run, and the two gates on it -----------------------
     A tab in the background and a hero scrolled off the screen are
     both "nobody is looking at this", and both are the reference's
     own gates. A cycle running under either is animation nobody
     sees, and on the way back it would arrive mid-switch.
     -------------------------------------------------------------- */
  useEffect(() => {
    const c = clock.current;
    const el = host.current;
    let inView = true;

    const settle = () => {
      c.seen = inView && !document.hidden;
      if (c.seen) arm(c, firstWait(c));
      else stop(c);
    };

    const observer = el
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          settle();
        }, { threshold: 0.15 })
      : null;
    if (el && observer) observer.observe(el);

    document.addEventListener('visibilitychange', settle);
    /* the lead-in is measured from here — the moment the run is
       first armed, which is also the moment the opening starts */
    c.startedAt = performance.now();
    arm(c, firstWait(c));

    return () => {
      document.removeEventListener('visibilitychange', settle);
      observer?.disconnect();
      stop(c);
    };
  }, [host]);

  return { active: state.active, shown: state.shown, lit: state.lit, hold, release, park };
}

/* ------------------------------------------------------------
   THE TIMINGS COME OFF `:root`, NOT OUT OF THIS FILE.

   The dwell and the resume delay are tokens, and a module that
   also carried a copy of them in milliseconds would be a second
   place to change them. Read at each use, with the token's own
   value as the fallback for a document that has not had the token
   block injected yet — a test, or the first frame of a story.
   ------------------------------------------------------------ */
function readMs(name: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ms = Number.parseFloat(raw);
  return Number.isFinite(ms) && ms > 0 ? ms : fallback;
}

const dwell = () => readMs('--aera-hero-dwell', 4000);
const neutralDwell = () => readMs('--aera-hero-neutral-dwell', 2000);
const leadIn = () => readMs('--aera-hero-lead-in', 1080);
const resumeDelay = () => readMs('--aera-hero-resume-delay', 2000);
