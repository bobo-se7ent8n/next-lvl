import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { LandingClosure } from './LandingClosure';

const meta: Meta<typeof LandingClosure> = {
  title: 'Landing/11 Closure',
  component: LandingClosure,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Primary weight. One line, alone, with the heaviest padding on the page — and then the one quiet mono link out to /storybook. Nothing else follows it.',
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
