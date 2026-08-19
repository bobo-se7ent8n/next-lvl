import type { Preview } from '@storybook/react-vite';
/* Storybook consumes exactly the same token layer as the app — the
   custom properties below are generated from src/tokens, never copied. */
import { injectTokens } from '../src/tokens/cssVars';
import '../src/styles/global.css';
import './storybook.css';

injectTokens();

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    docs: { toc: true },
    options: {
      storySort: {
        order: ['Tokens', 'Primitives', 'Components', 'Landing', 'Screens'],
      },
    },
  },
};

export default preview;
