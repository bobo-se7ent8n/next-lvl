import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { SessionInsights } from './SessionInsights';
import { Slider } from '../../components/primitives/Controls';
import { MOMENTS } from '../../data/moments';

function Harness() {
  const [playhead, setPlayhead] = useState(46);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Slider
        label="Playhead"
        value={playhead}
        min={0}
        max={100}
        display={`${playhead}%`}
        onChange={setPlayhead}
      />
      <SessionInsights insights={MOMENTS[0].insights} playhead={playhead / 100} />
    </div>
  );
}

const meta: Meta<typeof SessionInsights> = {
  title: 'Components/SessionInsights',
  component: SessionInsights,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The block under the timeline. Exactly one is on screen — the one the playhead is standing on — rather than every block at once with the unreached ones greyed out. Everything in it stacks, so the pattern-candidate chip can no longer run through the title. Clicking the description goes through to the full insight: this is the join between a session and a pattern candidate, and it is the same chip the session card carries in the list.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: () => <Harness />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
