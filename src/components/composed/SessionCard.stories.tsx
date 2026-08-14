import type { Meta, StoryObj } from '@storybook/react-vite';
import { SessionCard } from './SessionCard';
import { StoryFrame, Variant } from '../../stories/kit';
import { SESSIONS } from '../../data/sessions';

const meta = {
  title: 'Components/SessionCard',
  component: SessionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One recorded session. Date leads, the stat run sits inline, duration closes it. A solo shooting hour has no assists, so only what was actually recorded is shown. When the session produced a candidate, the block underneath says so without claiming it yet.',
      },
    },
  },
  argTypes: { onClick: { action: 'opened' } },
  args: { session: SESSIONS[0] },
} satisfies Meta<typeof SessionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame name="SessionCard" note="with a pattern candidate · a plain solo session">
      <Variant name="candidate">
        <SessionCard session={SESSIONS[0]} />
      </Variant>
      <Variant name="solo">
        <SessionCard session={SESSIONS[1]} />
      </Variant>
      <Variant name="interactive">
        <SessionCard session={SESSIONS[2]} onClick={() => {}} />
      </Variant>
    </StoryFrame>
  ),
};
