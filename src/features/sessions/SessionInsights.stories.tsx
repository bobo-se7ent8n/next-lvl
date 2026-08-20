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
          'The bubble under the timeline. Exactly one is open — the insight the playhead is standing on — and it hangs off that chip with a notch pointing at it. It is two lines and nothing else: heading and tag share the first, the description sits under them. Width comes from the content and caps at 500px. The band it opens into is a FIXED height whether a bubble is showing or not, so the tracks above never shift as the playhead crosses a tag. It is clickable, so it carries a soft drop shadow rather than the inset light the non-clickable recesses use.',
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
