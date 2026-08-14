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
    vars[`${PREFIX}-space-${step}`] = value;
  }
  for (const [name, value] of Object.entries(tokens.layout)) {
    vars[`${PREFIX}-layout-${kebab(name)}`] = value;
  }

  // radius ------------------------------------------------------
  for (const [name, value] of Object.entries(tokens.radius)) {
    vars[`${PREFIX}-radius-${kebab(name)}`] = value;
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
    vars[`${key}-size`] = String(s.fontSize);
    vars[`${key}-leading`] = String(s.lineHeight);
    vars[`${key}-tracking`] = String(s.letterSpacing);
    vars[`${key}-weight`] = String(s.fontWeight);
    vars[`${key}-transform`] = String(s.textTransform ?? 'none');
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
