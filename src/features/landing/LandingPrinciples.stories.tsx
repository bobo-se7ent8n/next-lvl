import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingPrinciples } from './LandingPrinciples';

const meta: Meta<typeof LandingPrinciples> = {
  title: 'Landing/09 Principles',
  component: LandingPrinciples,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { component: 'Four flat statement lines, stacked. No cards, no bullets.' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
