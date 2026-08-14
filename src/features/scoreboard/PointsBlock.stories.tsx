import type { Meta, StoryObj } from '@storybook/react-vite';
import { PointsBlock } from './PointsBlock';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Components/PointsBlock',
  component: PointsBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Points in three windows. A single scrimmage has nothing to trend against, so only the two wider windows carry a tendency — and the wording of it stays flat: a direction and a size, no praise and no warning.',
      },
    },
  },
  argTypes: { initialRange: { control: 'inline-radio', options: ['last', 'last5', 'all'] } },
  args: { initialRange: 'last' },
  render: (args) => (
    <div style={{ width: 460 }}>
      <PointsBlock {...args} />
    </div>
  ),
} satisfies Meta<typeof PointsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Windows: Story = {
  render: () => (
    <StoryFrame name="PointsBlock" note="last scrimmage (no tendency) · last 5 · all time">
      {(['last', 'last5', 'all'] as const).map((range) => (
        <Variant key={range} name={range}>
          <div style={{ width: 460 }}>
            <PointsBlock initialRange={range} />
          </div>
        </Variant>
      ))}
    </StoryFrame>
  ),
};
