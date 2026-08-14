/** camelCase → kebab-case, matching the CSS custom-property naming */
export function kebab(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** join class names, dropping anything falsy */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** a `var(--aera-…)` reference, built from a token path */
export function tokenVar(...path: string[]): string {
  return `var(--aera-${path.map(kebab).join('-')})`;
}
