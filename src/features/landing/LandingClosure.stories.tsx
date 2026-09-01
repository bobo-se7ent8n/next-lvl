import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { LandingClosure } from './LandingClosure';

const meta: Meta<typeof LandingClosure> = {
  title: 'Landing/Closing block',
  component: LandingClosure,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A window like the bar at the top of the page, with the tactile dot field drawn across it at barely-there contrast. One line, the way in, and the footer — the ways to reach us and the copyright, in the annotation voice, INSIDE the container. The page ends at the container’s bottom edge: there is no strip under it. It opens as it arrives, scaling up from just under full size on the firm curve.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
