import type { Meta, StoryObj } from '@storybook/react-vite';
import { PointsBlock } from './PointsBlock';

const meta: Meta<typeof PointsBlock> = {
  title: 'Components/PointsBlock',
  component: PointsBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One reading and the context around it. The three-state window toggle is gone: a control on this tile invited comparison, and comparison is not what the scoreboard is for. The register stays flat — notable, never praised, never ranked.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 460 }}>
      <PointsBlock />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
