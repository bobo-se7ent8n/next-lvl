import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tokenWriter } from './vite-plugins/token-writer.js';

export default defineConfig({
  /* `tokenWriter` carries `apply: 'serve'`, so the Save endpoint
     exists only under `vite dev` and is never part of a build */
  plugins: [react(), tokenWriter()],
  server: { port: 5173, open: false },
});
