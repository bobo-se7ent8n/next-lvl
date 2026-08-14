import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Ruler } from './Ruler';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Components/Ruler',
  component: Ruler,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The measure tape. Ticks slide under one fixed caret, and the tape is the readout — there is no counter beside it. Omit `onChange` for a read-only tape.',
      },
    },
  },
  argTypes: {
    total: { control: { type: 'range', min: 2, max: 24 } },
    value: { control: { type: 'range', min: 0, max: 23, step: 0.1 } },
    onChange: { action: 'moved' },
  },
  args: { total: 12, value: 0, ariaLabel: 'Position in the pattern set' },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Ruler {...args} value={value} onChange={(v) => { setValue(v); args.onChange?.(v); }} />;
  },
} satisfies Meta<typeof Ruler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <StoryFrame name="Ruler" note="start · middle · read-only">
      <Variant name="at 1">
        <Ruler total={12} value={0} onChange={() => {}} />
      </Variant>
      <Variant name="at 7">
        <Ruler total={12} value={6} onChange={() => {}} />
      </Variant>
      <Variant name="read-only">
        <Ruler total={12} value={3} />
      </Variant>
    </StoryFrame>
  ),
};
