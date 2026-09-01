import fs from 'node:fs';
import path from 'node:path';

/* ============================================================
   TOKEN WRITER — the dev panel's Save button, server side.

   A NOTE ON WHAT THIS WRITES TO.

   The brief for this plugin described a token CSS file. This
   project does not have one: the source of truth is the TypeScript
   in `src/tokens/*.ts`, and `cssVars.ts` projects those objects
   onto `:root` at runtime. Writing a CSS file would have created a
   second source of truth that the app does not read.

   So the target is the TypeScript instead. Everything else about
   the contract is unchanged — Save is a real file edit, it
   survives reload, it shows up in `git diff`, and it gets
   committed like any other change.

   THE EDIT IS SURGICAL. Each token is found by its own key inside
   its own export block and only the value is replaced. The file is
   never reformatted, reordered, or round-tripped through a parser:
   comments, blank lines and indentation all survive because they
   are never touched.
   ============================================================ */

/* Which export in which file backs each `--aera-*` prefix. This is
   the inverse of the projection in `src/tokens/cssVars.ts`; if a
   group is added there, add it here too.

   Order does not matter — the resolver sorts by prefix length and
   takes the longest match, so `--aera-color-data-ink-*` cannot be
   swallowed by `--aera-color-data-*`. */
const GROUPS = [
  ['--aera-color-surface-', 'color.ts', 'colorSurface'],
  ['--aera-color-ink-', 'color.ts', 'colorInk'],
  ['--aera-color-data-ink-', 'color.ts', 'colorDataInk'],
  ['--aera-color-data-', 'color.ts', 'colorData'],
  ['--aera-color-face-', 'color.ts', 'colorFace'],
  ['--aera-color-tag-', 'color.ts', 'colorTag'],
  ['--aera-color-accent-', 'color.ts', 'colorAccent'],
  ['--aera-color-semantic-', 'color.ts', 'colorSemantic'],
  ['--aera-color-shot-zone-', 'color.ts', 'colorShotZone'],
  ['--aera-color-on-face-', 'color.ts', 'colorOnFace'],
  ['--aera-color-utility-', 'color.ts', 'colorUtility'],
  ['--aera-space-', 'space.ts', 'space'],
  ['--aera-layout-', 'space.ts', 'layout'],
  ['--aera-radius-', 'radius.ts', 'radius'],
  ['--aera-font-scale-', 'typography.ts', 'fontScale'],
  ['--aera-font-', 'typography.ts', 'fontFamily'],
  ['--aera-weight-', 'typography.ts', 'fontWeight'],
  ['--aera-tracking-', 'typography.ts', 'tracking'],
  ['--aera-numeric-', 'typography.ts', 'numeric'],
  ['--aera-leading-', 'typography.ts', 'lineHeight'],
  ['--aera-elevation-', 'elevation.ts', 'elevation'],
  ['--aera-card-', 'surface.ts', 'cardSpec'],
  ['--aera-inner-', 'surface.ts', 'innerSpec'],
  ['--aera-surface-', 'surface.ts', 'surfaceEffect'],
  ['--aera-duration-', 'motion.ts', 'duration'],
  ['--aera-ease-', 'motion.ts', 'easing'],
  ['--aera-border-', 'border.ts', 'borderWidth'],
  ['--aera-z-', 'zIndex.ts', 'zIndex'],
  ['--aera-icon-', 'size.ts', 'iconSize'],
  ['--aera-control-', 'size.ts', 'controlSpec'],
  ['--aera-min-target-', 'size.ts', 'minTarget'],
  ['--aera-breakpoint-', 'scale.ts', 'breakpoint'],
  ['--aera-scale-', 'scale.ts', 'scaleStep'],
  ['--aera-landing-', 'landing.ts', 'landing'],
].sort((a, b) => b[0].length - a[0].length);

/* the composed text tokens are nested one level deeper —
   `--aera-text-body-sm-size` is textStyle.bodySM.fontSize */
const TEXT_FIELD = {
  family: 'fontFamily',
  size: 'fontSize',
  leading: 'lineHeight',
  tracking: 'letterSpacing',
  weight: 'fontWeight',
  transform: 'textTransform',
};

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/* the same kebab `cssVars.ts` projects names with */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * THE SLUG IS MATCHED AGAINST THE REAL KEYS, NOT GUESSED BACK INTO
 * one.
 *
 * `kebab` is lossy across consecutive capitals: `bodySM` projects to
 * `body-sm`, and camel-casing that returns `bodySm`, which is not a
 * key in the file. Rather than special-case SM/MD/LG/XL, this reads
 * the keys that are actually in the block and returns whichever one
 * kebabs to the slug being looked for — which is exact by
 * construction, for every key, forever.
 */
function findKey(src, range, slug) {
  const slice = src.slice(range.start, range.end);
  const keys = [...slice.matchAll(/(?:^|\n)\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/g)]
    .map((m) => m[1] ?? m[2] ?? m[3])
    .filter(Boolean);
  return keys.find((k) => kebab(k) === slug) ?? null;
}

/** `--aera-…` → { file, exportName, key, sub } */
function resolve(name) {
  if (name.startsWith('--aera-text-')) {
    const rest = name.slice('--aera-text-'.length);
    const cut = rest.lastIndexOf('-');
    if (cut < 0) return null;
    const field = TEXT_FIELD[rest.slice(cut + 1)];
    if (!field) return null;
    return {
      file: 'typography.ts',
      exportName: 'textStyle',
      slug: rest.slice(0, cut),
      key: camel(rest.slice(0, cut)),
      sub: field,
    };
  }
  for (const [prefix, file, exportName] of GROUPS) {
    if (name.startsWith(prefix)) {
      const slug = name.slice(prefix.length);
      return { file, exportName, slug, key: camel(slug), sub: null };
    }
  }
  return null;
}

/** the span of `export const <name> = { … } as const;` in a source */
function blockRange(src, exportName) {
  const open = src.search(new RegExp(`export const ${exportName}\\s*=\\s*\\{`));
  if (open < 0) return null;
  let i = src.indexOf('{', open);
  let depth = 0;
  for (let j = i; j < src.length; j += 1) {
    if (src[j] === '{') depth += 1;
    else if (src[j] === '}') {
      depth -= 1;
      if (depth === 0) return { start: i, end: j };
    }
  }
  return null;
}

/** the span of a nested `<key>: { … }` inside an outer range */
function nestedRange(src, range, key) {
  const slice = src.slice(range.start, range.end);
  const m = slice.match(new RegExp(`(^|\\n)\\s*${key}\\s*:\\s*\\{`));
  if (!m) return null;
  const at = range.start + m.index + m[0].length - 1;
  let depth = 0;
  for (let j = at; j < src.length; j += 1) {
    if (src[j] === '{') depth += 1;
    else if (src[j] === '}') {
      depth -= 1;
      if (depth === 0) return { start: at, end: j };
    }
  }
  return null;
}

/**
 * Replace one key's value inside one range, preserving how it was
 * written — quoted stays quoted, bare number stays bare.
 *
 * Returns the new source, or null when the key is not there.
 */
function replaceIn(src, range, key, value) {
  const slice = src.slice(range.start, range.end);
  /* the key at the start of a declaration, then whatever it is set
     to up to the comma or newline that ends it */
  const re = new RegExp(`((?:^|\\n)\\s*(?:'${key}'|"${key}"|${key})\\s*:\\s*)([^,\\n]+)`);
  const m = slice.match(re);
  if (!m) return null;

  /* HOW THE REPLACEMENT IS QUOTED.
   *
   * Three cases, and all three have bitten this writer:
   *
   * · the current value is a QUOTED string — `lineHeight: '1.405'`.
   *   Keep it quoted even when the new value looks like a number,
   *   because `'1.5'` is a CSS length-ish string here and a bare
   *   `1.5` changes its type.
   * · the current value is a BARE NUMBER — `semibold: 600`,
   *   `laptop: 0.88`. Stay bare when the new value is numeric.
   * · the current value is a REFERENCE — `heading: INTER`,
   *   `fontVariantNumeric: numeric.tabular`. An earlier version read
   *   "not quoted" off these and wrote the replacement bare, emitting
   *   `heading: Inter, system-ui, sans-serif` — not valid TypeScript,
   *   and it would have broken the build on the first Save over any
   *   aliased token. Quote unless the new value is a number.
   */
  const current = m[2].trim();
  const wasQuoted = /^['"`]/.test(current);
  const wasBareNumber = /^-?\d+(\.\d+)?$/.test(current);
  const incomingNumeric = /^-?\d+(\.\d+)?$/.test(String(value).trim());
  const bare = !wasQuoted && (wasBareNumber || incomingNumeric) && incomingNumeric;
  const next = bare
    ? String(value).trim()
    : `'${String(value).replace(/'/g, "\\'")}'`;

  const at = range.start + m.index;
  return src.slice(0, at) + m[0].replace(m[2], next) + src.slice(at + m[0].length);
}

/** put a key that is not in the file yet at the end of its block */
function appendTo(src, range, key, value) {
  const numeric = /^-?\d+(\.\d+)?$/.test(String(value));
  const line = `  ${key}: ${numeric ? value : `'${String(value).replace(/'/g, "\\'")}'`},\n`;
  /* insert just before the block's closing brace, keeping whatever
     indentation the last line had */
  let cut = range.end;
  while (cut > 0 && src[cut - 1] !== '\n') cut -= 1;
  return src.slice(0, cut) + line + src.slice(cut);
}

export function tokenWriter(options = {}) {
  const dir = options.tokenDir || 'src/tokens';

  return {
    name: 'aera-token-writer',
    /* dev only — this middleware never exists in a production build */
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use('/__tokens/save', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          const send = (code, payload) => {
            res.statusCode = code;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };

          try {
            const payload = JSON.parse(body || '{}');
            const names = Object.keys(payload);
            if (!names.length) return send(200, { updated: [], appended: [], skipped: [] });

            /* group the work by file so each file is read and written
               exactly once however many tokens changed in it */
            const byFile = new Map();
            const skipped = [];
            for (const name of names) {
              const loc = resolve(name);
              if (!loc) { skipped.push({ name, reason: 'no token group matches this name' }); continue; }
              if (!byFile.has(loc.file)) byFile.set(loc.file, []);
              byFile.get(loc.file).push({ name, value: payload[name], ...loc });
            }

            const updated = [];
            const appended = [];

            for (const [file, items] of byFile) {
              const full = path.resolve(process.cwd(), dir, file);
              let src = fs.readFileSync(full, 'utf8');

              for (const item of items) {
                const outer = blockRange(src, item.exportName);
                if (!outer) { skipped.push({ name: item.name, reason: `export ${item.exportName} not found` }); continue; }

                /* the real key as written in the file, when it is
                   already there; the camel guess only when appending */
                const key = findKey(src, outer, item.slug) ?? item.key;

                if (item.sub) {
                  const inner = nestedRange(src, outer, key);
                  if (!inner) { skipped.push({ name: item.name, reason: `${item.exportName}.${key} not found` }); continue; }
                  const next = replaceIn(src, inner, item.sub, item.value);
                  if (next) { src = next; updated.push(item.name); }
                  else { src = appendTo(src, inner, item.sub, item.value); appended.push(item.name); }
                  continue;
                }

                const next = replaceIn(src, outer, key, item.value);
                if (next) { src = next; updated.push(item.name); }
                else { src = appendTo(src, outer, item.key, item.value); appended.push(item.name); }
              }

              fs.writeFileSync(full, src);
            }

            send(200, { updated, appended, skipped });
          } catch (err) {
            send(500, { error: err && err.message ? err.message : String(err) });
          }
        });
      });
    },
  };
}

export default tokenWriter;
