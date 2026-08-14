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

/** layout constants that are structural rather than spacing steps */
export const layout = {
  /** the fixed-height screen header — every heading shares this baseline */
  headerHeight: '208px',
  /** where the headline sits inside that header. One number, four screens. */
  headerTitleOffset: '92px',
  /** top nav height, used to offset sticky columns */
  navHeight: '58px',
  /** gutter on the page edge */
  gutter: '26px',
  /** widest a reading column ever gets */
  maxReadWidth: '54ch',
  /** the content shell */
  maxWidth: '1440px',
} as const;
