import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { LandingNav } from './LandingNav';

const meta: Meta<typeof LandingNav> = {
  title: 'Landing/Sticky nav',
  component: LandingNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Two groups and nothing drawn behind them: the mark and wordmark on the left, three pills on the right. A flat 64px band holding 44px pills, sticky at one frame margin from the top, with no fill, border or shadow of its own — the page’s paper runs under it, so what floats is the group rather than a bar. The last pill opens the dot matrix tool: under the pointer its fill steps down and its label is set in Silkscreen, the pixel face, so the label becomes the thing it opens. Both labels share one grid cell, which makes the pill the width of the wider of the two at rest — the hover changes only a fill and two opacities and moves nothing. The scroll-progress capsule and its “To top” morph are gone; the wordmark is the link back to the top.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ minHeight: 'var(--aera-space-16)' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Resting: Story = {};
