import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Controls';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One continuous setting. The reading on the right is formatted by the caller, because a percentage, a pixel count and a multiplier all read differently.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
  args: { label: 'Opacity', value: 20, min: 0, max: 100, display: '20%', onChange: () => {} },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 300 }}>
        <Slider {...args} value={value} display={`${value}%`} onChange={(v) => { setValue(v); args.onChange(v); }} />
      </div>
    );
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <StoryFrame name="Slider" note="default · at the end of its range · disabled" width={320}>
      <Variant name="default">
        <Slider label="Opacity" value={20} min={0} max={100} display="20%" onChange={() => {}} />
      </Variant>
      <Variant name="max">
        <Slider label="Density" value={80} min={4} max={80} display="80" onChange={() => {}} />
      </Variant>
      <Variant name="disabled">
        <Slider label="Glyph" value={10} min={6} max={22} display="10px" disabled onChange={() => {}} />
      </Variant>
    </StoryFrame>
  ),
};
