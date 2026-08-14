import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl } from './Controls';
import { StoryFrame, Variant } from '../../stories/kit';

const OPTIONS = [
  { value: 'last', label: 'Last scrimmage' },
  { value: 'last5', label: 'Last 5 scrimmages' },
  { value: 'all', label: 'All time' },
];

const meta = {
  title: 'Primitives/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small set of mutually exclusive choices, all visible at once. Used for the Points window on the Scoreboard.',
      },
    },
  },
  argTypes: {
    value: { control: 'inline-radio', options: OPTIONS.map((o) => o.value) },
    onChange: { action: 'changed' },
  },
  args: { options: OPTIONS, value: 'last', ariaLabel: 'Points window', onChange: (_next: string) => {} },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} value={value} onChange={(v) => { setValue(v); args.onChange(v); }} />;
  },
};

export const States: Story = {
  render: () => (
    <StoryFrame name="SegmentedControl" note="selection · a disabled option">
      <Variant name="first selected">
        <SegmentedControl options={OPTIONS} value="last" onChange={() => {}} ariaLabel="a" />
      </Variant>
      <Variant name="last selected">
        <SegmentedControl options={OPTIONS} value="all" onChange={() => {}} ariaLabel="b" />
      </Variant>
      <Variant name="one disabled">
        <SegmentedControl
          options={[...OPTIONS.slice(0, 2), { value: 'all', label: 'All time', disabled: true }]}
          value="last"
          onChange={() => {}}
          ariaLabel="c"
        />
      </Variant>
    </StoryFrame>
  ),
};
