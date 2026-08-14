import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart } from './AreaChart';
import { StoryFrame, Variant } from '../../stories/kit';
import { colorData } from '../../tokens';

const meta = {
  title: 'Components/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A filled series — volume over time. The fill is always a flat colour at a set opacity; nothing in this product uses a gradient.',
      },
    },
  },
  argTypes: {
    color: { control: 'color' },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
    height: { control: { type: 'range', min: 30, max: 200 } },
  },
  args: { values: [44, 45, 46, 46, 47, 48], color: colorData.mint, fillOpacity: 0.28, height: 90 },
  render: (args) => (
    <div style={{ width: 320 }}>
      <AreaChart {...args} />
    </div>
  ),
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="AreaChart" note="light fill · solid fill" width={320}>
      <Variant name="0.28">
        <AreaChart values={[44, 45, 46, 46, 47, 48]} color={colorData.mint} />
      </Variant>
      <Variant name="0.7">
        <AreaChart values={[12, 16, 19, 24, 27, 30]} color={colorData.lilac} fillOpacity={0.7} />
      </Variant>
    </StoryFrame>
  ),
};
