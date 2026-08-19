import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingFuture } from './LandingFuture';

const meta: Meta<typeof LandingFuture> = {
  title: 'Landing/10 Not built yet',
  component: LandingFuture,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Heading, one line, and two side-by-side slots for hardware that does not exist yet.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
