import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillRatings, WhereToWorkNext } from './SkillRatings';

const meta: Meta<typeof SkillRatings> = {
  title: 'Components/SkillRatings',
  component: SkillRatings,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Two cards, not one. Card A is the ratings: two groups — shooting, and handling & movement — each row a label, a 0–100 bar and a right-aligned reading, with the average and the legend sharing the top row because they are both keys to the same scale. Card B is where to work next: behind a divider inside card A it read as a footnote to the numbers above it, when it is the thing those numbers are for. The scale is the player’s own; there is nobody else in it.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** the ratings on their own */
export const Ratings: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <SkillRatings />
    </div>
  ),
};

/** the conclusion drawn from them — repeatable entries, each a rating
 *  row and one line saying what that number does */
export const WhereNext: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <WhereToWorkNext />
    </div>
  ),
};

/** how the centre column of the scoreboard actually stacks them */
export const Column: Story = {
  render: () => (
    <div style={{ maxWidth: 480, display: 'grid', gap: 'var(--aera-space-8)' }}>
      <SkillRatings />
      <WhereToWorkNext />
    </div>
  ),
};
