/// <reference types="vite/client" />

/* THE BUILD NUMBER, injected by `define` in vite.config.ts.

   Declared here rather than read off `import.meta.env` because it is
   not an environment variable: it is a fact about the bundle,
   resolved at config time from the git short commit, and it is
   replaced with a string literal at build time — so this declaration
   is the only place TypeScript can learn it exists. */
declare const __AERA_BUILD__: string;
