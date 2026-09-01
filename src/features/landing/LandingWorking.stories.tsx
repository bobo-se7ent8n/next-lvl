import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { LandingWorking } from './LandingWorking';

const meta: Meta<typeof LandingWorking> = {
  title: 'Landing/02 See it working',
  component: LandingWorking,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The turn in the argument: everything above it is a claim, and this is the first thing on the page that is the actual product. One window, one screen, and nothing else in the section — it is exactly one viewport tall and nothing inside it scrolls, which is the claim it is making. The screen re-scopes its enter key every time the section arrives, so the numbers count up and the dot field assembles as they do inside the app, and again the next time you scroll back to it.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ padding: '0 var(--aera-layout-gutter)' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
