/* ============================================================
   SPACE

   One scale. Components never write a raw px value for margin,
   padding or gap — they pick a step from here.
   ============================================================ */

export const space = {
  '0': '0px',
  '1': '2px',
  '2': '4px',
  '3': '6px',
  '4': '8px',
  '5': '10px',
  '6': '12px',
  '7': '14px',
  '8': '16px',
  '9': '22px',
  '10': '26px',
  '11': '32px',
  '12': '40px',
  '13': '48px',
  '14': '58px',
  '15': '72px',
  '16': '96px',
} as const;

export type SpaceStep = keyof typeof space;

const NAV_HEIGHT = '58px';
/* the nav sits at the BOTTOM now, so the header band no longer has to
   clear it and the column that used to start under it starts higher */
const HEADER_BLOCK = '196px';

/** layout constants that are structural rather than spacing steps */
export const layout = {
  /** where the headline sits. One number, four screens. */
  headerTitleOffset: '40px',
  /** the nav capsule's height */
  navHeight: NAV_HEIGHT,
  /** The band the fixed bottom nav stands in. Every page reserves it
   *  below its last row, so the nav never covers content — the nav is
   *  out of the flow entirely and cannot push anything out of its way. */
  navReserve: `calc(${NAV_HEIGHT} + 44px)`,
  /** gutter on the page edge — the only horizontal inset a page has */
  gutter: '26px',
  /** the space reserved beneath every page header. No content enters it. */
  headerReserve: '52px',
  /** widest a reading column ever gets */
  maxReadWidth: '54ch',
  /** the subhead measure — wide enough to hold one line at desktop */
  maxSubheadWidth: '108ch',
  /** the cap a region carries only when its content would otherwise
   *  stretch uncontrolled. Pages themselves never centre any more. */
  maxContentWidth: '1680px',
  /** the narrower cap for a region that is mostly reading */
  maxProseWidth: '860px',
  /** THE COLUMN GAP, everywhere. Home, Sessions, Insights and the
   *  scoreboard bento all split into columns, and they used to do it
   *  at two different sizes — 32 on two screens and 40 on a third —
   *  which made the same layout read as three layouts. */
  splitGap: '48px',
  /** the widest an insight bubble gets before its text wraps */
  insightBubble: '500px',

  /* ---- THE INSIGHT BAND, AS A RHYTHM -----------------------------
     The band the bubble opens into used to be one number picked to
     be comfortably taller than the bubble, which meant the space
     under the bubble was whatever happened to be left — and it
     changed with the length of the text. It is three numbers now,
     and the band's own height is derived from them rather than
     guessed alongside them:

       pill → bubble        insightGap
       the tallest bubble   insightBubbleH   (two lines of text)
       bubble → container   insightFoot

     The bubble hangs from the TOP of the band at `insightGap` below
     the pill, so it always sits the same distance under the tag it
     belongs to. A one-line bubble is simply shorter and leaves more
     than `insightFoot` beneath it; a full-height one lands on
     exactly `insightFoot`. Either way the band does not move, so
     nothing above it moves either.
     -------------------------------------------------------------- */
  /** the gap between the insight pill and the bubble hanging off it */
  insightGap: '12px',
  /** THE CAP ON A BUBBLE. Its own padding, the title/chip row, the
   *  row gap and two lines of description — the description is
   *  clamped to two lines, so this is a real ceiling and not an
   *  estimate the text can walk through. */
  insightBubbleH: '96px',
  /** the clearance under a full-height bubble */
  insightFoot: '16px',
  /** how far the figma-style name tag hangs below a hovered card */
  tagDrop: '24px',
  /** the width every nav item reserves, so the current one cannot
   *  reflow its neighbours */
  navItem: '104px',
  /** the storybook browser's fixed sidebar */
  sidebarWidth: '248px',

  /* ---- THE SHARED LEFT COLUMN -------------------------------------
     Focus on Home, Activity on Sessions and Ask AERA on Insights are
     the same column on three different screens. They used to be three
     widths and three heights, which made the three screens read as
     three layouts. One width, one height, one parking place.
     ------------------------------------------------------------- */
  /** how wide that column is, on all three screens */
  leftColumn: '460px',
  /** the whole page-header band — title offset, title, subhead and the
   *  reserve beneath it. PageHeader is given this as a min-height, so
   *  the number is true rather than an estimate of itself. */
  headerBlock: HEADER_BLOCK,
  /** where a pinned column parks */
  columnTop: space['9'],
  /** and how tall it stands once parked: the header band and one page
   *  gutter subtracted from the viewport, so a screen is a header and
   *  a column and nothing below them */
  /* THE ONLY LAYOUT TOKEN THAT REFERENCES ITS OWN SIBLINGS.
   *
   *  It has to. Every other length here is projected through
   *  `--aera-scale`, but this one mixes `100svh` — which must NOT
   *  scale, it is the window — with three lengths that must. Written
   *  as literals it would be wrapped whole and the viewport would
   *  shrink with the type. Written as `var()` references it composes
   *  from the already-scaled values, and the projection leaves it
   *  alone because there is no bare px in it. */
  columnHeight:
    'calc(100svh - var(--aera-layout-header-block)' +
    ' - var(--aera-layout-nav-height) - var(--aera-space-12))',
} as const;
