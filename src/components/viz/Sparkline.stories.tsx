import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from './Sparkline';
import { StoryFrame, Variant } from '../../stories/kit';
import { colorData } from '../../tokens';

const meta = {
  title: 'Components/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single series as a line — direction only, no axis, no grid. The line draws itself in on entry and then the dash pattern is REMOVED: `getTotalLength()` reports user units while a non-scaling stroke lays dashes out in screen units, so a leftover dasharray repeated across the path and every trend line in the product rendered as disconnected fragments. The end marker is positioned outside the SVG, in percentages with a fixed pixel size, because the chart box is drawn with `preserveAspectRatio="none"` and any circle inside it comes out an ellipse.',
      },
    },
  },
  argTypes: {
    color: { control: 'color' },
    weight: { control: { type: 'range', min: 1, max: 8, step: 0.5 } },
    height: { control: { type: 'range', min: 30, max: 200 } },
    showEnd: { control: 'boolean' },
  },
  args: {
    values: [61, 58, 55, 51, 46, 42],
    color: colorData.mint,
    weight: 3,
    height: 80,
    showEnd: true,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Sparkline {...args} />
    </div>
  ),
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="Sparkline" note="falling · flat · rising" width={320}>
      <Variant name="falling">
        <Sparkline values={[61, 58, 55, 51, 46, 42]} color={colorData.mint} />
      </Variant>
      <Variant name="flat">
        <Sparkline values={[84, 86, 85, 85, 86, 85]} color={colorData.blue} />
      </Variant>
      <Variant name="rising">
        <Sparkline values={[12, 16, 19, 24, 27, 30]} color={colorData.orange} />
      </Variant>
    </StoryFrame>
  ),
};
