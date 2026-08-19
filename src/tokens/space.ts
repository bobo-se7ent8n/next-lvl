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
  '8': '18px',
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
const HEADER_BLOCK = '252px';

/** layout constants that are structural rather than spacing steps */
export const layout = {
  /** where the headline sits under the fixed nav. One number, four screens. */
  headerTitleOffset: '92px',
  /** top nav height, used to offset sticky columns */
  navHeight: NAV_HEIGHT,
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
  /** where a pinned column parks under the fixed nav */
  columnTop: `calc(${NAV_HEIGHT} + ${space['9']})`,
  /** and how tall it stands once parked: the header band and one page
   *  gutter subtracted from the viewport, so a screen is a header and
   *  a column and nothing below them */
  columnHeight: `calc(100svh - ${HEADER_BLOCK} - ${space['11']})`,
} as const;
