import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillRatings } from './SkillRatings';

const meta: Meta<typeof SkillRatings> = {
  title: 'Components/SkillRatings',
  component: SkillRatings,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Two groups — shooting, and handling & movement. Each row is a label, a 0–100 bar and a right-aligned reading, and the header says plainly that every rating is derived from sensor data rather than entered by anybody. The scale is the player’s own; there is nobody else in it.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <SkillRatings />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
