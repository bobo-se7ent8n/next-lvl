/** @type {import('tailwindcss').Config} */

/* Neutrals stay behind CSS variables even though there is only one
   theme now — the tokens are the vocabulary the whole app speaks, and
   the background layers read the same values. Saturated colour never
   enters this scale; it lives only in the highlighter palette
   (src/lib/palette.js). */
const v = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: v('--c-canvas'), // full-bleed backdrop
        panel: v('--c-panel'), // elevated sheet — pure white
        surface: v('--c-surface'), // tile fill, one tone off the panel
        surface2: v('--c-surface2'), // recessed wells, bar tracks
        ink: v('--c-ink'),
        ink2: v('--c-ink2'),
        ink3: v('--c-ink3'),
        /* the one blue in the project: Figma's selection colour, used
           only by the pattern-card hover state and the scroll ruler */
        select: '#0D99FF',
      },
      fontFamily: {
        display: ['Oswald', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '10px',
        md: '20px',
        lg: '32px',
        xl: '44px',
        '2xl': '64px',
        '3xl': '88px',
        '4xl': '128px',
      },
      /* Very deep superellipse rounding. Paired with `.sq`, which
         redraws the corner as a superellipse where the browser
         supports it — these numbers are tuned for that curve, not a
         circular one, and each step is sized to the element it is
         meant for so a large radius never collapses a small tile
         into a circle (the browser clamps at half the box). */
      borderRadius: {
        DEFAULT: '72px',
        xs: '26px', // menus, small inner blocks
        sm: '44px', // wells, inputs, popovers
        lg: '68px', // vitals + focus blocks (~170–300px)
        card: '110px', // pattern cards and other large surfaces
        xl: '120px', // modals
        '2xl': '140px',
        pill: '999px',
      },
      letterSpacing: {
        tightest: '-0.035em',
        display: '-0.02em',
        label: '0.1em',
        micro: '0.16em',
      },
      lineHeight: { generous: '1.65' },
      boxShadow: {
        raise: '0 24px 60px -30px rgb(var(--c-shadow) / 0.5)',
        pop: '0 10px 34px -14px rgb(var(--c-shadow) / 0.35)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
      },
      transitionDuration: { 150: '150ms', 180: '180ms' },
      keyframes: {
        'fade-rise': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 180ms cubic-bezier(0.2,0.8,0.3,1) both',
      },
    },
  },
  plugins: [],
}
