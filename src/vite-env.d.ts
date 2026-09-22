/// <reference types="vite/client" />

/* THE BUILD NUMBER, injected by `define` in vite.config.ts.

   Declared here rather than read off `import.meta.env` because it is
   not an environment variable: it is a fact about the bundle —
   the commit count of the build, zero-padded to three, or "dev" when
   nothing could count it — resolved at config time and replaced with
   a string literal at build time, so this declaration is the only
   place TypeScript can learn it exists. */
declare const __AERA_BUILD__: string;
/** how that number was reached: git-full, git-deepened, github-api or none */
declare const __AERA_BUILD_SOURCE__: string;
