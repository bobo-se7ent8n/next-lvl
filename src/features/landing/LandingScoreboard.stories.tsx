import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingScoreboard } from './LandingScoreboard';

const meta: Meta<typeof LandingScoreboard> = {
  title: 'Landing/04 Scoreboard',
  component: LandingScoreboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The whole board on the page at once, at the size the app draws it and with no frame around it — this is the part of the product that is safe to share, so it is the one screen shown without a device standing between the reader and it. Only the panel that just became active re-reads itself: the enter keys are held per panel, so opening Skills re-runs the rating bars and leaves the court and the arc exactly where they were.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '0 var(--aera-layout-gutter)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
