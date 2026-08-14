import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillsPanel } from './SkillsPanel';

const meta = {
  title: 'Components/SkillsPanel',
  component: SkillsPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shooting and handling scores. The colour follows the semantic rule, and the scale is the player’s own — there is nobody else in it, and no rank.',
      },
    },
  },
  render: () => (
    <div style={{ width: 720 }}>
      <SkillsPanel />
    </div>
  ),
} satisfies Meta<typeof SkillsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
