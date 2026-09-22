import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tokenWriter } from './vite-plugins/token-writer.js';

/* ============================================================
   THE BUILD NUMBER, resolved once at config time.

   The closing block prints it — "Claude build 038" — so it has to be
   a real fact about the bundle rather than a string somebody
   remembers to update. The fact is how many commits lead up to the
   one being built: `git rev-list --count HEAD`, zero-padded to three.

   THE CATCH IS VERCEL. It builds from a SHALLOW clone, so the history
   it has is only the last few commits and a plain count there says
   "10" forever. A count is only trusted from a complete history, and
   the resolver works down this list until one of them gives it:

     1. git-full      the checkout already has the whole history (a
                      local build, a CI runner with fetch-depth 0)
     2. git-deepened  the checkout is shallow; fetch the rest of the
                      history from its own origin — or, on Vercel,
                      from the repository `VERCEL_GIT_*` names — and
                      count once it is complete
     3. github-api    git could not be completed; ask GitHub how many
                      commits lead to `VERCEL_GIT_COMMIT_SHA`. One
                      commit per page, so the `rel="last"` page number
                      IS the count. The repository is public, so no
                      token is needed.
     4. none          nothing worked — no git, no network. The footer
                      says "dev" rather than inventing a number.

   Which step answered is baked into the bundle beside the number (a
   `data-build-source` attribute on the footer line), so a deploy can
   be checked for HOW its number was reached, not only what it is.
   ============================================================ */

type BuildSource = 'git-full' | 'git-deepened' | 'github-api' | 'none';

const git = (args: string): string =>
  execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 120_000 })
    .toString()
    .trim();

const pad = (count: number): string => String(count).padStart(3, '0');

/** is the checkout's history complete — false on a shallow clone */
function complete(): boolean {
  return git('rev-parse --is-shallow-repository') === 'false';
}

/** where a shallow checkout can fetch the rest of its history from */
function upstream(): string | null {
  try {
    return git('remote get-url origin');
  } catch {
    const { VERCEL_GIT_PROVIDER, VERCEL_GIT_REPO_OWNER, VERCEL_GIT_REPO_SLUG } = process.env;
    return VERCEL_GIT_PROVIDER === 'github' && VERCEL_GIT_REPO_OWNER && VERCEL_GIT_REPO_SLUG
      ? `https://github.com/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}.git`
      : null;
  }
}

/** the commit count from GitHub's REST API, for the commit Vercel is building */
async function countFromGitHub(): Promise<number | null> {
  const { VERCEL_GIT_REPO_OWNER: owner, VERCEL_GIT_REPO_SLUG: slug, VERCEL_GIT_COMMIT_SHA: sha } =
    process.env;
  if (!owner || !slug || !sha) return null;
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${slug}/commits?sha=${sha}&per_page=1`,
    { headers: { accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(10_000) },
  );
  if (!res.ok) return null;
  const last = res.headers.get('link')?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (last) return Number(last[1]);
  /* no pagination at all: the history is the one page in hand */
  const page = (await res.json()) as unknown[];
  return page.length || null;
}

async function buildNumber(): Promise<{ number: string; source: BuildSource }> {
  try {
    if (complete()) return { number: pad(Number(git('rev-list --count HEAD'))), source: 'git-full' };
    const url = upstream();
    if (url) {
      git(`fetch --unshallow --no-tags --quiet ${url} ${git('rev-parse HEAD')}`);
      if (complete()) {
        return { number: pad(Number(git('rev-list --count HEAD'))), source: 'git-deepened' };
      }
    }
  } catch {
    /* no git, or no network for it — the API may still answer */
  }
  try {
    const count = await countFromGitHub();
    if (count) return { number: pad(count), source: 'github-api' };
  } catch {
    /* offline, or rate-limited — fall through to the honest default */
  }
  return { number: 'dev', source: 'none' };
}

export default defineConfig(async () => {
  const build = await buildNumber();
  return {
    define: {
      __AERA_BUILD__: JSON.stringify(build.number),
      __AERA_BUILD_SOURCE__: JSON.stringify(build.source),
    },
    /* `tokenWriter` carries `apply: 'serve'`, so the Save endpoint
       exists only under `vite dev` and is never part of a build */
    plugins: [react(), tokenWriter()],
    server: { port: 5173, open: false },
  };
});
