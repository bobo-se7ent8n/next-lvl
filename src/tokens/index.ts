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
export * from './surface';
export * from './border';
export * from './zIndex';
export * from './size';
export * from './scale';

import { color } from './color';
import { space, layout } from './space';
import { radius } from './radius';
import {
  fontFamily,
  fontWeight,
  textStyle,
  inkVariation,
  tracking,
  lineHeight,
  fontScale,
  numeric,
} from './typography';
import { elevation } from './elevation';
import { duration, easing, transition } from './motion';
import { dotMatrix, dotDensity, graphicWell, wellFloor } from './graphic';
import { cardSpec, innerSpec, surfaceEffect } from './surface';
import { borderWidth } from './border';
import { zIndex } from './zIndex';
import { iconSize, iconStroke, controlSpec, minTarget } from './size';
import { breakpoint, breakpointHeight, scaleStep } from './scale';

export const tokens = {
  color,
  space,
  layout,
  radius,
  fontFamily,
  fontWeight,
  textStyle,
  inkVariation,
  tracking,
  lineHeight,
  fontScale,
  numeric,
  elevation,
  duration,
  easing,
  transition,
  dotMatrix,
  dotDensity,
  graphicWell,
  wellFloor,
  cardSpec,
  innerSpec,
  surfaceEffect,
  borderWidth,
  zIndex,
  iconSize,
  iconStroke,
  controlSpec,
  minTarget,
  breakpoint,
  breakpointHeight,
  scaleStep,
} as const;

export type Tokens = typeof tokens;
