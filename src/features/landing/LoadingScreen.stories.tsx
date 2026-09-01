import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingScreen } from './LoadingScreen';

const meta: Meta<typeof LoadingScreen> = {
  title: 'Landing/Entry sequence',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The dark state, the seeded word field and the 4:3 white card that fills the window. Everything scattered is hashed from the word itself and then PACKED — each tag takes candidate positions from its own seeded stream and keeps the first that clears every box already placed and the keep-out around the card, so the field is dense, collision-free and identical on every reload. There is no Math.random anywhere in it. The card grows by its own width and height rather than by a transform, which keeps the four corner squares the same size as they travel; the grid fades and drifts out under it rather than swapping colour in one frame; and the headline rises out of its blur while the card is still expanding, so there is never an empty white state. Skipped entirely under prefers-reduced-motion.',
      },
    },
  },
  args: { onDone: () => {} },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
