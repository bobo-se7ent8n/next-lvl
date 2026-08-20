import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavBar } from './NavBar';
import { StoryFrame, Variant } from '../../stories/kit';

const ITEMS = [
  { value: 'home', label: 'Home' },
  { value: 'sessions', label: 'Sessions' },
  { value: 'insights', label: 'Insights' },
  { value: 'scoreboard', label: 'Scoreboard' },
];

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The main nav — fixed to the bottom of the viewport and centred on it, never on the content column. The active item changes exactly one thing, its fill: no border, no padding change and no weight change, because a semibold label is wider than a medium one and re-measured the whole track every time you switched tabs. Every item also reserves the same width, so which one is current can never reflow its neighbours. The bar sits at identical coordinates on all four tabs.',
      },
    },
  },
  argTypes: {
    value: { control: 'inline-radio', options: ITEMS.map((i) => i.value) },
    inline: { control: 'boolean' },
    onChange: { action: 'navigated' },
  },
  args: { items: ITEMS, value: 'home', inline: true, onChange: () => {} },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <NavBar {...args} value={value} onChange={(v) => { setValue(v); args.onChange(v); }} />;
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <StoryFrame name="NavBar" note="each item selected in turn, plus a disabled item">
      {ITEMS.map((item) => (
        <Variant key={item.value} name={item.label}>
          <NavBar items={ITEMS} value={item.value} onChange={() => {}} inline />
        </Variant>
      ))}
      <Variant name="disabled item">
        <NavBar
          items={[...ITEMS.slice(0, 3), { value: 'scoreboard', label: 'Scoreboard', disabled: true }]}
          value="home"
          onChange={() => {}}
          inline
        />
      </Variant>
    </StoryFrame>
  ),
};
