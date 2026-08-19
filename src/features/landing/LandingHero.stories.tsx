import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingHero } from './LandingHero';

const meta: Meta<typeof LandingHero> = {
  title: 'Landing/01 Hero',
  component: LandingHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Two regions: the headline and sub in dashed text boxes on the left, a tall media slot on the right. The headline is Oswald with the per-letter weight variation the display token defines.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
