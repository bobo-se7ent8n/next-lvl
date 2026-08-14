import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Controls';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'The mini switch — one setting, on or off, applied immediately. There is no apply step anywhere in this product.' } },
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: { checked: true, label: 'Grain', onChange: (_next: boolean) => {} },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(args.checked);
    return <Toggle {...args} checked={on} onChange={(v) => { setOn(v); args.onChange(v); }} />;
  },
};

export const States: Story = {
  render: () => (
    <StoryFrame name="Toggle" note="off · on · disabled">
      <Variant name="off">
        <Toggle checked={false} label="off" onChange={() => {}} />
      </Variant>
      <Variant name="on">
        <Toggle checked label="on" onChange={() => {}} />
      </Variant>
      <Variant name="disabled">
        <Toggle checked disabled label="disabled" onChange={() => {}} />
      </Variant>
    </StoryFrame>
  ),
};
