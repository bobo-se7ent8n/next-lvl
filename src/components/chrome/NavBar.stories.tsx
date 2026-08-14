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
          'The main nav: one capsule track, centred at the top of the page, with the active item as a white pill riding inside it. Stories render it inline; the app renders it fixed.',
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
