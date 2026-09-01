/* ============================================================
   TOKENS → CSS CUSTOM PROPERTIES

   The TS objects in this folder are the source; this file is the
   projection of them onto `:root`. Import it once and every
   stylesheet in the app — and in Storybook — can read the same
   values as `var(--aera-…)`.

   Nothing is duplicated: change a value in the TS token and the
   custom property changes with it.
   ============================================================ */

import { tokens } from './index';
import type { TextStyleName } from './typography';

const PREFIX = '--aera';

function kebab(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}


/* ------------------------------------------------------------
   THE SCALE, APPLIED ONCE, HERE.

   Every length in the system is projected as
   `calc(<value> * var(--aera-scale, 1))`, so the single variable
   `global.css` sets on `:root` moves spacing, radii, card padding,
   icons and type together. The fallback of `1` means a document
   that never sets the variable — a Storybook story, a test —
   renders at full size and nothing has to know about this.

   WHAT IS DELIBERATELY NOT SCALED:
   · border widths — a hairline is 1px because 1px is the thinnest
     line a screen can draw; 0.82 of it is a blurry 1px.
   · z-index, durations, easings, colours — not lengths.
   · `0`, `none`, `999px` (the pill) and anything in `%`, `ch`,
     `vw`, `vh` or `svh` — either nothing to scale, or already
     relative to something that scales itself.
   ------------------------------------------------------------ */

const SCALE = 'var(--aera-scale, 1)';

/** does this value have a length in it that should move with the scale */
function scalable(value: string): boolean {
  const v = value.trim();
  if (v === '0' || v === '0px' || v === 'none' || v === '999px') return false;
  return /\d(px|rem)\b/.test(v);
}

/** a length, multiplied by the scale */
function scaleLength(value: string): string {
  const v = value.trim();
  if (!scalable(v)) return v;
  /* a bare px value multiplies directly; anything composite —
     a clamp(), a calc() — is wrapped whole so its own internal
     arithmetic is preserved */
  return /^-?\d*\.?\d+px$/.test(v)
    ? `calc(${v} * ${SCALE})`
    : `calc((${v}) * ${SCALE})`;
}

/**
 * A TYPE SIZE, WHICH IS FLOORED.
 *
 * Body text may not go below 12px however small the window gets, so
 * a size that would cross that floor stops there. Type that already
 * sits under the floor — the 10px and 8px annotation sizes — does
 * not shrink at all: it is at the edge of legibility at full size
 * and there is nothing to give.
 */
const TYPE_FLOOR = 12;

function scaleType(value: string): string {
  const v = value.trim();
  if (!scalable(v)) return v;
  const bare = v.match(/^(-?\d*\.?\d+)px$/);
  if (bare) {
    const px = Number.parseFloat(bare[1]);
    if (px <= TYPE_FLOOR) return v;
    return `max(${TYPE_FLOOR}px, calc(${v} * ${SCALE}))`;
  }
  /* a clamp() already carries its own minimum, so it only needs the
     multiplier — its floor is the floor */
  return `calc((${v}) * ${SCALE})`;
}

/** every token, flattened to a `--aera-*` name → value map */
export function buildCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};

  // colour ------------------------------------------------------
  for (const [group, entries] of Object.entries(tokens.color)) {
    for (const [name, value] of Object.entries(entries)) {
      vars[`${PREFIX}-color-${kebab(group)}-${kebab(name)}`] = value as string;
    }
  }

  // space -------------------------------------------------------
  for (const [step, value] of Object.entries(tokens.space)) {
    vars[`${PREFIX}-space-${step}`] = scaleLength(value);
  }
  for (const [name, value] of Object.entries(tokens.layout)) {
    vars[`${PREFIX}-layout-${kebab(name)}`] = scaleLength(value);
  }

  // radius ------------------------------------------------------
  for (const [name, value] of Object.entries(tokens.radius)) {
    vars[`${PREFIX}-radius-${kebab(name)}`] = scaleLength(value);
  }

  // typography --------------------------------------------------
  for (const [name, value] of Object.entries(tokens.fontFamily)) {
    vars[`${PREFIX}-font-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.fontWeight)) {
    vars[`${PREFIX}-weight-${kebab(name)}`] = String(value);
  }
  for (const [name, style] of Object.entries(tokens.textStyle)) {
    const key = `${PREFIX}-text-${kebab(name)}`;
    const s = style as Record<string, string | number>;
    vars[`${key}-family`] = String(s.fontFamily);
    vars[`${key}-size`] = scaleType(String(s.fontSize));
    vars[`${key}-leading`] = String(s.lineHeight);
    vars[`${key}-tracking`] = String(s.letterSpacing);
    vars[`${key}-weight`] = String(s.fontWeight);
    vars[`${key}-transform`] = String(s.textTransform ?? 'none');
  }

  // surface — the card system -----------------------------------
  for (const [name, value] of Object.entries(tokens.cardSpec)) {
    vars[`${PREFIX}-card-${kebab(name)}`] = scaleLength(value);
  }
  for (const [name, value] of Object.entries(tokens.innerSpec)) {
    vars[`${PREFIX}-inner-${kebab(name)}`] = scaleLength(value);
  }
  for (const [name, value] of Object.entries(tokens.surfaceEffect)) {
    vars[`${PREFIX}-surface-${kebab(name)}`] = value;
  }

  // elevation ---------------------------------------------------
  for (const [name, value] of Object.entries(tokens.elevation)) {
    vars[`${PREFIX}-elevation-${kebab(name)}`] = value;
  }

  // motion ------------------------------------------------------
  for (const [name, value] of Object.entries(tokens.duration)) {
    vars[`${PREFIX}-duration-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.easing)) {
    vars[`${PREFIX}-ease-${kebab(name)}`] = value;
  }

  // the illustration well ---------------------------------------
  vars[`${PREFIX}-graphic-well`] = tokens.graphicWell.ratio;
  for (const [name, value] of Object.entries(tokens.wellFloor)) {
    vars[`${PREFIX}-well-floor-${kebab(name)}`] = value;
  }

  // border width ------------------------------------------------
  for (const [name, value] of Object.entries(tokens.borderWidth)) {
    vars[`${PREFIX}-border-${kebab(name)}`] = value;
  }

  // z-index — numbers, so they are stringified on the way out ----
  for (const [name, value] of Object.entries(tokens.zIndex)) {
    vars[`${PREFIX}-z-${kebab(name)}`] = String(value);
  }

  // icons and control furniture ---------------------------------
  for (const [name, value] of Object.entries(tokens.iconSize)) {
    vars[`${PREFIX}-icon-${kebab(name)}`] = scaleLength(value);
  }
  for (const [name, value] of Object.entries(tokens.controlSpec)) {
    vars[`${PREFIX}-control-${kebab(name)}`] = scaleLength(value);
  }
  /* NOT scaled — a hit area is an absolute minimum, see size.ts */
  for (const [name, value] of Object.entries(tokens.minTarget)) {
    vars[`${PREFIX}-min-target-${kebab(name)}`] = value;
  }

  // the three type axes a component may need on their own -------
  for (const [name, value] of Object.entries(tokens.tracking)) {
    vars[`${PREFIX}-tracking-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.lineHeight)) {
    vars[`${PREFIX}-leading-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.fontScale)) {
    vars[`${PREFIX}-font-scale-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.numeric)) {
    vars[`${PREFIX}-numeric-${kebab(name)}`] = value;
  }

  // the landing page's own structural lengths -------------------
  for (const [name, value] of Object.entries(tokens.landing)) {
    vars[`${PREFIX}-landing-${kebab(name)}`] = scaleLength(value);
  }

  // breakpoints and the scale steps ----------------------------
  for (const [name, value] of Object.entries(tokens.breakpoint)) {
    vars[`${PREFIX}-breakpoint-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.breakpointHeight)) {
    vars[`${PREFIX}-breakpoint-h-${kebab(name)}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.scaleStep)) {
    vars[`${PREFIX}-scale-${kebab(name)}`] = String(value);
  }

  return vars;
}

/** the `:root { … }` block, as text */
export function cssVarsBlock(): string {
  const vars = buildCssVars();
  const body = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `:root {\n${body}\n}`;
}

/** the var reference for a text token, ready to spread into a style rule */
export function textVars(name: TextStyleName) {
  const key = `${PREFIX}-text-${kebab(name)}`;
  return {
    fontFamily: `var(${key}-family)`,
    fontSize: `var(${key}-size)`,
    lineHeight: `var(${key}-leading)`,
    letterSpacing: `var(${key}-tracking)`,
    fontWeight: `var(${key}-weight)`,
    textTransform: `var(${key}-transform)` as never,
  };
}

let injected = false;

/** put the token block on `:root`. Safe to call more than once. */
export function injectTokens(doc: Document = document): void {
  if (injected && doc.getElementById('aera-tokens')) return;
  const el = doc.getElementById('aera-tokens') ?? doc.createElement('style');
  el.id = 'aera-tokens';
  el.textContent = cssVarsBlock();
  if (!el.parentNode) doc.head.prepend(el);
  injected = true;
}
