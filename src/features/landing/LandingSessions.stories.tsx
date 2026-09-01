import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingSessions } from './LandingSessions';

const meta: Meta<typeof LandingSessions> = {
  title: 'Landing/Sessions',
  component: LandingSessions,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A pinned section holding a laptop and a paragraph. Scrolling fills the paragraph word by word; when it is full the pane cross-fades to the second tab — the same laptop, now showing one session open — and the second paragraph fills the same way. It carries no section heading: the pane’s own label says which screen it is, in the display face rather than the mono eyebrow, because with the heading gone those labels ARE the heading. The copy is plain black body text one step up the type scale, with a single word in the orange accent. The section measures itself against the WINDOW, so it only behaves correctly at fullscreen and inside a document that actually scrolls; in the docs pane it will simply sit at its first state.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
