import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingNotice } from './LandingNotice';

const meta: Meta<typeof LandingNotice> = {
  title: 'Landing/02 What you will notice',
  component: LandingNotice,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A heading box, then three boxed rows of one heading line and one body line each. No icons, no columns.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
