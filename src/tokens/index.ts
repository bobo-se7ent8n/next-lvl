/* ============================================================
   TOKENS — the single source of truth.

   Everything visual in the product resolves to a value in here:
   the app, the CSS custom properties, and every Storybook story
   read this same module. There is no second copy anywhere.
   ============================================================ */

export * from './color';
export * from './space';
export * from './radius';
export * from './typography';
export * from './elevation';
export * from './motion';
export * from './graphic';

import { color } from './color';
import { space, layout } from './space';
import { radius } from './radius';
import { fontFamily, fontWeight, textStyle, inkVariation } from './typography';
import { elevation } from './elevation';
import { duration, easing, transition } from './motion';
import { dotMatrix, dotDensity } from './graphic';

export const tokens = {
  color,
  space,
  layout,
  radius,
  fontFamily,
  fontWeight,
  textStyle,
  inkVariation,
  elevation,
  duration,
  easing,
  transition,
  dotMatrix,
  dotDensity,
} as const;

export type Tokens = typeof tokens;
