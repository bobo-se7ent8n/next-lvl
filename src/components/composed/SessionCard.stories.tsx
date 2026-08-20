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
          'One recorded session. The top block runs at 12px; the stat row carries 16px between groups and 2px between a number and its unit. A session that is not a game carries its OWN stats — a solo shooting hour has no points, rebounds or assists, so filtering the game run left one number and the card read as broken. The description and the pattern-candidate block are alternatives, never both.',
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
