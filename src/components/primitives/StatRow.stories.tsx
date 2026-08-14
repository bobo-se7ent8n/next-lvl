import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatRow, StatSet } from './StatRow';
import { StoryFrame, Variant } from '../../stories/kit';

const meta = {
  title: 'Primitives/StatRow',
  component: StatRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labelled reading — the row form of a metric. StatSet lays a run of them out inline, which is how a session card carries its stat line.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    inline: { control: 'boolean' },
    inherit: { control: 'boolean' },
  },
  args: { label: 'Points', value: 18 },
  render: (args) => (
    <div style={{ width: 320 }}>
      <StatRow {...args} />
    </div>
  ),
} satisfies Meta<typeof StatRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="StatRow" note="stacked rows · inline set">
      <Variant name="rows">
        <div style={{ width: 320 }}>
          <StatRow label="Points" value={18} />
          <StatRow label="Rebounds" value={6} />
          <StatRow label="Assists" value={4} />
        </div>
      </Variant>
      <Variant name="StatSet">
        <StatSet
          stats={[
            { label: 'shots', value: 41 },
            { label: 'pts', value: 18 },
            { label: 'reb', value: 6 },
            { label: 'ast', value: 4 },
          ]}
        />
      </Variant>
    </StoryFrame>
  ),
};
