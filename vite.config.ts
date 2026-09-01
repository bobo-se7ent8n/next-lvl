import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tokenWriter } from './vite-plugins/token-writer.js';

/* THE BUILD NUMBER, resolved once at config time.

   The closing block prints it, so it has to be a real fact about the
   bundle rather than a string somebody remembers to update. The
   short commit is that fact; a checkout with no git history — a
   tarball, a fresh CI cache — falls back to the package version, so
   the line always says something rather than nothing. */
function buildId(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

export default defineConfig({
  define: { __AERA_BUILD__: JSON.stringify(buildId()) },
  /* `tokenWriter` carries `apply: 'serve'`, so the Save endpoint
     exists only under `vite dev` and is never part of a build */
  plugins: [react(), tokenWriter()],
  server: { port: 5173, open: false },
});
