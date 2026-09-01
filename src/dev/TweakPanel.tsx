import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/css';
import { iconStroke } from '../tokens';
import styles from './TweakPanel.module.css';

/* ============================================================
   THE TOKEN TWEAK PANEL — dev only.

   A Tweakpane instance bound to the `--aera-*` custom properties
   on `:root`. Moving a control writes the property inline on the
   root element, so the whole app answers immediately; Save POSTs
   the changed set to the dev server, which edits the token
   SOURCE on disk (see vite-plugins/token-writer.js).

   IT IS CLOSED BY DEFAULT AND IT LIVES BEHIND A BUTTON.

   It used to mount open, pinned to the top-right corner, over
   whatever was being looked at — which made every screenshot of
   this product a screenshot of a debug panel. It is now the same
   affordance the display settings are: one small button on the
   bottom edge, and a panel that exists only while it is asked
   for. Backtick still shows and hides it, so the keyboard route
   is unchanged.

   THE PANEL ITSELF IS DELIBERATELY NOT STYLED WITH AERA TOKENS —
   it is Tweakpane's own light theme, and the stylesheet says why.
   The BUTTON is: it sits on the page, so it is the product's.

   Everything here is loaded through a dynamic import behind
   `import.meta.env.DEV`, so neither this module nor Tweakpane
   reaches a production bundle.
   ============================================================ */

/* THE SHAPE OF THE BITS OF TWEAKPANE WE USE.
 *
 * `tweakpane` ships types that import from `@tweakpane/core`, and
 * that package is not a dependency of it — the runtime is bundled
 * but the types are not. So `Pane` resolves with only its own
 * members and everything it inherits (addFolder, addButton,
 * addBinding, refresh, title) types as missing.
 *
 * Rather than install a second package to satisfy a type import, or
 * cast to `any` and lose the checking altogether, this is the small
 * structural contract this file actually depends on. If Tweakpane
 * changes it, this breaks here, loudly, in one place. */
interface TpEvent {
  value: unknown;
}
interface TpBinding {
  on(event: 'change', cb: (ev: TpEvent) => void): TpBinding;
}
interface TpButton {
  on(event: 'click', cb: () => void): TpButton;
}
interface TpFolder {
  title: string;
  addBinding(target: object, key: string, opts?: Record<string, unknown>): TpBinding;
  addFolder(opts: { title: string; expanded?: boolean }): TpFolder;
  addButton(opts: { title: string }): TpButton;
  refresh(): void;
  dispose(): void;
}

const TITLE = 'AERA tokens';

export function TweakPanel() {
  const host = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let disposed = false;
    let pane: TpFolder | null = null;
    let detachKey: (() => void) | null = null;

    (async () => {
      const [{ Pane }, { buildTokenSchema, rescale }] = await Promise.all([
        import('tweakpane'),
        import('./tokenSchema'),
      ]);
      if (disposed) return;

      const container = host.current;
      if (!container) return;

      const root = document.documentElement;
      const schema = buildTokenSchema();

      /* THE CONTROLS EDIT THE AUTHORED VALUE, NOT THE RENDERED ONE.
       *
       *  Every length reaches `:root` wrapped in the layout scale —
       *  `calc(22px * var(--aera-scale))` — so the computed value is
       *  18.04px at the tablet step and the token file says 22px.
       *  Binding a control to the computed value would show the wrong
       *  number and save the wrong one.
       *
       *  `state` holds the authored value for the control to edit,
       *  `authored` holds it for Save to send, and the live preview
       *  re-wraps on the way to the element so what you see stays
       *  scaled with everything around it. */
      const state: Record<string, number | string> = {};
      const authored: Record<string, string> = {};
      const dirty = new Set<string>();

      const paneInstance = new Pane({ container, title: TITLE }) as unknown as TpFolder;
      pane = paneInstance;

      const setTitle = (suffix = '') => {
        paneInstance.title = `${TITLE}${suffix}`;
      };
      const markDirty = () => setTitle(dirty.size ? ' *' : '');

      /* ---- the three buttons, above the folders ---- */
      const payload = () => {
        const out: Record<string, string> = {};
        /* the authored value — what belongs in the token file */
        for (const name of dirty) out[name] = authored[name];
        return out;
      };

      paneInstance
        .addButton({ title: 'Save' })
        .on('click', async () => {
          if (!dirty.size) { setTitle(' — nothing to save'); return; }
          setTitle(' — saving…');
          try {
            const res = await fetch('/__tokens/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload()),
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
            const n = (body.updated?.length ?? 0) + (body.appended?.length ?? 0);
            dirty.clear();
            setTitle(` — saved ${n}`);
            window.setTimeout(() => { if (!dirty.size) setTitle(''); }, 2000);
          } catch (err) {
            setTitle(` — save failed: ${err instanceof Error ? err.message : String(err)}`);
          }
        });

      paneInstance
        .addButton({ title: 'Revert' })
        .on('click', () => {
          /* drop every inline override; the stylesheet's own values
             take back over and the controls re-read them */
          for (const group of schema) {
            for (const c of group.controls) root.style.removeProperty(c.name);
          }
          for (const group of schema) {
            for (const c of group.controls) {
              state[c.name] = c.kind === 'length' || c.kind === 'number' ? c.value : c.base;
              authored[c.name] = c.base;
            }
          }
          dirty.clear();
          paneInstance.refresh();
          setTitle(' — reverted');
          window.setTimeout(() => { if (!dirty.size) setTitle(''); }, 1500);
        });

      paneInstance
        .addButton({ title: 'Copy CSS' })
        .on('click', async () => {
          const lines = Object.entries(payload()).map(([k, v]) => `  ${k}: ${v};`);
          const css = lines.length ? `:root {\n${lines.join('\n')}\n}` : '/* nothing changed */';
          try {
            await navigator.clipboard.writeText(css);
            setTitle(` — copied ${lines.length}`);
          } catch {
            setTitle(' — clipboard blocked');
          }
          window.setTimeout(() => markDirty(), 1500);
        });

      /* ---- one folder per category, all collapsed ---- */
      for (const group of schema) {
        const folder = paneInstance.addFolder({ title: group.title, expanded: false });

        for (const c of group.controls) {
          state[c.name] = c.kind === 'length' || c.kind === 'number' ? c.value : c.base;
          authored[c.name] = c.base;

          /* `next` is always the AUTHORED value; the element gets it
             back through the wrapper it came out of */
          const write = (next: string) => {
            authored[c.name] = next;
            root.style.setProperty(c.name, rescale(next, c.wrap));
            dirty.add(c.name);
            markDirty();
          };

          if (c.kind === 'length') {
            folder
              .addBinding(state, c.name, { label: c.label, min: c.min, max: c.max, step: c.step })
              .on('change', (ev) => write(`${ev.value}${c.unit}`));
          } else if (c.kind === 'number') {
            folder
              .addBinding(state, c.name, { label: c.label, step: c.step })
              .on('change', (ev) => write(String(ev.value)));
          } else if (c.kind === 'color') {
            folder
              .addBinding(state, c.name, { label: c.label, view: 'color' })
              .on('change', (ev) => write(String(ev.value)));
          } else {
            folder
              .addBinding(state, c.name, { label: c.label })
              .on('change', (ev) => write(String(ev.value)));
          }
        }
      }

      /* ---- backtick shows and hides it ----

         It toggles the SAME state the button does rather than
         reaching for the node's `display`, so the two routes cannot
         disagree about whether the panel is open — which they did:
         the key hid the node and left the button reading "expanded",
         and the next click then hid it a second time. */
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== '`' || e.metaKey || e.ctrlKey || e.altKey) return;
        /* never steal the key from a field — including this panel's own */
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        e.preventDefault();
        setOpen((v) => !v);
      };
      window.addEventListener('keydown', onKey);
      detachKey = () => window.removeEventListener('keydown', onKey);
    })();

    return () => {
      disposed = true;
      detachKey?.();
      pane?.dispose();
    };
  }, []);

  return (
    <div className={styles.dock}>
      {/* THE PANE IS BUILT ONCE AND STAYS BUILT. Closing it hides the
          host; it does not tear Tweakpane down, because doing so
          would drop every folder's expanded state and — worse —
          every unsaved edit sitting in `dirty`. */}
      <div ref={host} className={cx(styles.pane, !open && styles.paneOff)} />

      <button
        type="button"
        className={styles.toggleButton}
        aria-expanded={open}
        aria-label="Token panel"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={iconStroke.thin}
          strokeLinecap="round"
        >
          <path d="M5 6h6M15 6h4M5 12h10M19 12h0M5 18h3M12 18h7" />
          <circle cx="13" cy="6" r="2" />
          <circle cx="17" cy="12" r="2" />
          <circle cx="10" cy="18" r="2" />
        </svg>
      </button>
    </div>
  );
}

export default TweakPanel;
