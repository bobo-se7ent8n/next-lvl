/* ============================================================
   TOKEN SCHEMA — what the dev panel puts a control on.

   WHERE THE LIST COMES FROM. The brief described parsing the
   token CSS file with a raw glob import. This project has no
   token CSS file: `src/tokens/*.ts` is the source and
   `cssVars.ts` projects it onto `:root`. So the schema is derived
   from `buildCssVars()` — the very function that produces the
   custom properties — which is both simpler than parsing text and
   impossible to get out of step with what the app actually reads.

   Nothing in here is imported by the app. The whole module is
   behind `import.meta.env.DEV` at its only call site, so it and
   Tweakpane with it are dropped from a production build.
   ============================================================ */

import { buildCssVars } from '../tokens/cssVars';

export type ControlKind = 'color' | 'length' | 'number' | 'text';

export interface TokenControl {
  /** the custom property, e.g. `--aera-radius-card` */
  name: string;
  /** the label the panel shows — the name with its group stripped */
  label: string;
  /** the value as it is written in the token file */
  raw: string;
  kind: ControlKind;
  /** which scale wrapper the projected value came out of */
  wrap: Wrap;
  /** the authored value, with the wrapper removed */
  base: string;
  /** for `length`: the numeric part and the unit it carries */
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface TokenGroup {
  /** the folder title */
  title: string;
  /** the `--aera-<key>-` prefix this folder collects */
  prefix: string;
  controls: TokenControl[];
}

/* The folders, in the order the panel shows them. Longest prefix
   wins, so `--aera-font-scale-*` cannot be swallowed by
   `--aera-font-*` and `--aera-color-*` collects everything with a
   colour in it regardless of which sub-group it belongs to. */
const GROUPS: Array<[prefix: string, title: string]> = [
  ['--aera-color-', 'color'],
  ['--aera-radius-', 'radius'],
  ['--aera-space-', 'space'],
  ['--aera-layout-', 'layout'],
  ['--aera-text-', 'type · composed'],
  ['--aera-font-scale-', 'type · scale'],
  ['--aera-font-', 'type · family'],
  ['--aera-weight-', 'type · weight'],
  ['--aera-tracking-', 'type · tracking'],
  ['--aera-leading-', 'type · leading'],
  ['--aera-numeric-', 'type · figures'],
  ['--aera-elevation-', 'shadow'],
  ['--aera-surface-', 'shadow · surface'],
  ['--aera-card-', 'surface · card'],
  ['--aera-inner-', 'surface · inner'],
  ['--aera-duration-', 'motion · duration'],
  ['--aera-ease-', 'motion · easing'],
  ['--aera-border-', 'border width'],
  ['--aera-z-', 'z-index'],
  ['--aera-icon-', 'icon size'],
  ['--aera-control-', 'control'],
  ['--aera-min-target-', 'min target'],
  ['--aera-breakpoint-', 'breakpoint'],
  ['--aera-scale-', 'scale'],
];

/* ------------------------------------------------------------
   UNDOING THE SCALE WRAPPER, FOR THE PANEL ONLY.

   Every length is projected as `calc(22px * var(--aera-scale, 1))`,
   and a type size as `max(12px, calc(16px * var(--aera-scale, 1)))`.
   Those are correct in the stylesheet and useless in a control: the
   panel would show a text field full of `calc(...)` where a slider
   belongs, and Save would write the whole expression back into the
   token file.

   So the panel unwraps to the AUTHORED value — the number actually
   written in `src/tokens/*.ts` — and remembers which wrapper it
   came out of. The control edits the authored value, Save sends the
   authored value, and the live preview re-wraps so what you see on
   screen stays scaled like everything around it.
   ------------------------------------------------------------ */
export type Wrap = 'none' | 'scale' | 'scaleFloor';

const SCALE_ONLY = /^calc\(\s*(.+?)\s*\*\s*var\(--aera-scale[^)]*\)\s*\)$/;
const SCALE_FLOOR = /^max\(\s*[\d.]+px\s*,\s*calc\(\s*(.+?)\s*\*\s*var\(--aera-scale[^)]*\)\s*\)\s*\)$/;

export function unscale(value: string): { base: string; wrap: Wrap } {
  const v = value.trim();
  const floored = v.match(SCALE_FLOOR);
  if (floored) return { base: floored[1].trim(), wrap: 'scaleFloor' };
  const scaled = v.match(SCALE_ONLY);
  if (scaled) {
    /* a composite was wrapped in its own parens on the way in */
    const inner = scaled[1].trim();
    const bare = inner.match(/^\((.*)\)$/);
    return { base: (bare ? bare[1] : inner).trim(), wrap: 'scale' };
  }
  return { base: v, wrap: 'none' };
}

/** put a value back through the wrapper it came out of */
export function rescale(base: string, wrap: Wrap, floor = '12px'): string {
  if (wrap === 'none') return base;
  const body = /^-?\d*\.?\d+(px|rem|em)$/.test(base.trim())
    ? `calc(${base} * var(--aera-scale, 1))`
    : `calc((${base}) * var(--aera-scale, 1))`;
  return wrap === 'scaleFloor' ? `max(${floor}, ${body})` : body;
}

const COLOR = /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\()/;
const LENGTH = /^(-?\d*\.?\d+)(px|rem|em|ch|vw|vh|svh|%|ms|s)$/;
const NUMBER = /^-?\d*\.?\d+$/;

/** a sensible range and step for a length, from its unit */
function rangeFor(unit: string, value: number): { min: number; max: number; step: number } {
  switch (unit) {
    case 'px':
      /* the scale runs 0–96, but a layout token can be 500+; give the
         slider room above whatever the current value is either way */
      return { min: value < 0 ? -Math.abs(value) * 2 - 8 : 0, max: Math.max(96, Math.ceil(value * 2)), step: 1 };
    case 'rem':
      return { min: 0, max: Math.max(4, value * 2), step: 0.05 };
    case 'em':
      return { min: -0.2, max: Math.max(0.4, value * 2), step: 0.001 };
    case 'ms':
      return { min: 0, max: Math.max(1000, Math.ceil(value * 2)), step: 10 };
    case 's':
      return { min: 0, max: Math.max(2, value * 2), step: 0.05 };
    case '%':
    case 'vw':
    case 'vh':
    case 'svh':
      return { min: 0, max: 100, step: 1 };
    default:
      return { min: 0, max: Math.max(100, value * 2), step: 1 };
  }
}

function classify(name: string, raw: string): TokenControl {
  /* classify the AUTHORED value, not the projected expression */
  const { base: authored, wrap } = unscale(raw);
  const base: TokenControl = {
    name,
    label: name,
    raw,
    wrap,
    base: authored,
    kind: 'text',
    value: 0,
    unit: '',
    min: 0,
    max: 1,
    step: 1,
  };

  /* a shadow is a list of lengths and colours — it has no single
     control, so it stays a text field you can paste into */
  if (/^--aera-(elevation|surface)-/.test(name)) return { ...base, kind: 'text' };
  if (COLOR.test(authored)) return { ...base, kind: 'color' };

  const len = authored.match(LENGTH);
  if (len) {
    const value = Number.parseFloat(len[1]);
    const unit = len[2];
    return { ...base, kind: 'length', value, unit, ...rangeFor(unit, value) };
  }

  if (NUMBER.test(authored)) {
    const value = Number.parseFloat(authored);
    /* a z-index or a font weight: an integer, and a slider over it
       would be useless — give it a plain number field */
    return { ...base, kind: 'number', value, min: 0, max: Math.max(1000, value * 2), step: 1 };
  }

  return base;
}

/** every token, grouped into the folders the panel builds */
export function buildTokenSchema(): TokenGroup[] {
  const vars = buildCssVars();
  const ordered = [...GROUPS].sort((a, b) => b[0].length - a[0].length);
  const groups = new Map<string, TokenGroup>();
  for (const [prefix, title] of GROUPS) groups.set(prefix, { title, prefix, controls: [] });

  for (const [name, raw] of Object.entries(vars)) {
    const hit = ordered.find(([prefix]) => name.startsWith(prefix));
    if (!hit) continue;
    const group = groups.get(hit[0]);
    if (!group) continue;
    const control = classify(name, raw);
    group.controls.push({ ...control, label: name.slice(hit[0].length) });
  }

  return [...groups.values()].filter((g) => g.controls.length > 0);
}
