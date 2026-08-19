import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingAudience } from './LandingAudience';

const meta: Meta<typeof LandingAudience> = {
  title: 'Landing/03 Who it is for',
  component: LandingAudience,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A centred statement block, two lines, capped at the readable measure.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
