/* ============================================================
   THE PAGE'S WORDS, IN ONE PLACE.

   The headline is written down here rather than in the hero
   because two components render it: the loading overlay unblurs
   it as the white fills the screen, and the hero holds it once
   the overlay is gone. Two copies of the same sentence would
   drift the first time one of them was edited, and the seam
   between the two states would show.
   ============================================================ */

/** the one claim the whole page rests on */
export const HERO_HEADLINE = 'Your jump shot knows something about you.';

export const HERO_SUB =
  'Body sensors, a smart basketball, and an app that reads the patterns underneath your game.';

/** the two lines held by the white card on the dark entry state */
export const LOADING_COPY = [
  'AERA reads what your body does under pressure.',
  'The court is just where it shows.',
] as const;

/* ------------------------------------------------------------
   THE SCATTERED VOCABULARY, IN TWO HALVES.

   THE HERO HAS NO SUBLINE ANY MORE. It used to carry one sentence
   naming the parts — body sensors, a smart basketball, an app that
   reads the patterns underneath your game. That sentence is now the
   words in `TAG_KEEP`: the same claim, scattered rather than
   set, and the reader assembles it instead of being handed it.

   Which is why the split matters. `TAG_KEEP` is what the page says,
   so every one of those words survives the entry expansion and is
   still on screen in the white state. `TAG_LEAVE` is the wider
   vocabulary the product measures in; those are what the dark state
   is dense with and what collapses toward the centre as the white
   arrives, so the field THINS to its argument rather than simply
   rearranging.

   The field is denser than it was, and that is what makes the
   packing in `seed.ts` load-bearing rather than a nicety: at this
   count a purely seeded scatter puts two words on top of each other
   several times over.
   ------------------------------------------------------------ */

/** the ones that survive — the deleted subline, as words */
export const TAG_KEEP = [
  'BODY',
  'SENSORS',
  'BASKETBALL',
  'SMART',
  'APP',
  'PRESSURE',
  'PATTERNS',
  'BREATH',
  'RELEASE',
  'FOCUS',
  'HRV',
  'ON-DEVICE',
  'MOTION',
  'SIGNAL',
  'TEMPO',
  'RECOVERY',
  'COURT',
  'RHYTHM',
  'DATA',
  'SELF-KNOWLEDGE',
  'GATHER',
  'ARC',
  'CATCH',
  'BALANCE',
  'CADENCE',
  'HANDLE',
  'REPEATS',
  'FATIGUE',
] as const;

/** and the ones that leave — measured, never claimed */
export const TAG_LEAVE = [
  'HESITATION',
  'CLOSEOUT',
  'LEFT WING',
  'VARIANCE',
  'QUICKENING',
  'DRIFT',
  'LOAD',
  'WINDOW',
  'THRESHOLD',
  'BASELINE',
] as const;

export const TAG_WORDS = [...TAG_KEEP, ...TAG_LEAVE] as const;

/* ---- sessions, two scroll-driven tabs ----------------------- */

/* THE EMPHASIS IS MARKED IN THE COPY, NOT IN THE COMPONENT.

   `**stays there**` is the one phrase set in the display face.
   Marking it here rather than passing an index or a word to match
   keeps the emphasis where the sentence is: an editor rewriting this
   block moves the emphasis with it and cannot leave the two out of
   step. `ScrollFillText` is what reads the markers.

   It was one word in the orange accent. It is a phrase in Oswald at
   the primary ink now — a change of VOICE rather than of colour,
   which is what the rest of the page does with its emphasis. */
export const SESSION_TABS = [
  {
    id: 'list',
    label: 'The month',
    copy: 'Every session lands on your device and **stays there**. No streak to protect, nothing to keep alive — just the month as it actually happened. Repeating signals get flagged as pattern candidates, and stay candidates until they confirm.',
  },
  {
    id: 'detail',
    label: 'One session',
    copy: 'Open a session and it replays. Motion, opponents, and physiology sit on one timeline, so you can scrub to the exact moment a release changed and see what your breathing was doing at the same time. Insights are markers on that timeline, not a summary written over it.',
  },
] as const;

/* ---- insights ----------------------------------------------- */

/** what the scroll types into the bubble, one character at a time */
export const ASK_PROMPT = 'what should I work on this week?';

export const ASK_NOTE =
  'Ask AERA reads your own sessions and patterns to answer. The model runs on the device — nothing you ask and nothing it finds ever leaves it.';

/* ---- the closing block's footer ------------------------------ */

/* Four ways to reach a project that does not have a support desk.
   The last one is a page rather than a channel: somebody who has
   read this far and still wants the long version should not have to
   ask a person for it. */
export const FOOTER_LINKS = [
  { label: 'Telegram', href: 'https://t.me/aera' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aera' },
  { label: 'Email', href: 'mailto:hello@aera.build' },
  { label: 'What is AERA', href: '/storybook' },
] as const;

export const FOOTER_COPYRIGHT = '© AERA 2026';
