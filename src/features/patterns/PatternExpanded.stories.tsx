import type { Meta, StoryObj } from '@storybook/react-vite';
import { PatternExpanded } from './PatternExpanded';
import { StoryFrame } from '../../stories/kit';
import { PATTERNS } from '../../data/patterns';

const meta = {
  title: 'Components/PatternExpanded',
  component: PatternExpanded,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The opened pattern. Everything the card front leaves out lives here: the full viz, what was measured, the longer read, the confirmed history, and the only links out to Sessions, Insights and the Scoreboard.',
      },
    },
  },
  argTypes: {
    onClose: { action: 'closed' },
    onOpenSessions: { action: 'sessions' },
    onOpenInsights: { action: 'insights' },
    onOpenScoreboard: { action: 'scoreboard' },
  },
  args: { pattern: PATTERNS[0], onClose: () => {} },
  render: (args) => (
    <div style={{ width: 'min(900px, 100%)', height: 520 }}>
      <PatternExpanded {...args} />
    </div>
  ),
} satisfies Meta<typeof PatternExpanded>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OnADarkFace: Story = {
  name: 'On a dark face',
  render: (args) => (
    <StoryFrame name="PatternExpanded" note="the ink flips with the card colour">
      <div style={{ width: 'min(900px, 100%)', height: 520 }}>
        <PatternExpanded {...args} pattern={PATTERNS.find((p) => p.id === 'fatigue')!} />
      </div>
    </StoryFrame>
  ),
};
