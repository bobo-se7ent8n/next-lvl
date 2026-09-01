/* ============================================================
   THE LANDING PAGE, SECTION BY SECTION.

   Exported in the order the page runs them, which is also the
   order of the numbers on the page. Two sections are gone from
   this list: "What you'll notice" and "Who it's for". The first
   became the three columns under the live window in 06, and the
   second was self-selection copy that the page now does by showing
   the product instead of describing who it suits.
   ============================================================ */

/* the entry, and the bar that appears once it has let go */
export * from './LoadingScreen';
export * from './LandingNav';

/* the sections */
export * from './LandingHero';
export * from './TagField';
export * from './LandingWorking';
export * from './LandingPatterns';
export * from './LandingSessions';
export * from './LandingScoreboard';
export * from './LandingInsights';
export * from './LandingFuture';
export * from './LandingClosure';

/* the wireframe primitives — still used by the one section that is
   still, honestly, a placeholder */
export * from './wireframe';
