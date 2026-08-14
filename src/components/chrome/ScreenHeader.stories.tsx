import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScreenHeader } from './ScreenHeader';
import { StoryFrame } from '../../stories/kit';

const meta = {
  title: 'Components/ScreenHeader',
  component: ScreenHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One fixed-height header for every screen. The headline row always starts at the same offset, so PATTERNS, SESSIONS, INSIGHTS, FOCUS & VITALS and SCOREBOARD share a single baseline and nothing jumps when the screen changes. A longer description grows downward into the slack, never upward.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'Patterns',
    description:
      'A pattern is a behaviour your sessions keep repeating. Twelve of them are holding right now.',
  },
} satisfies Meta<typeof ScreenHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SharedBaseline: Story = {
  name: 'Shared baseline',
  render: () => (
    <StoryFrame
      name="ScreenHeader"
      note="four headings, one baseline — the guide marks where every headline starts"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
        {[
          ['Patterns', 'A pattern is a behaviour your sessions keep repeating. Twelve of them are holding right now.'],
          ['Sessions', 'Every game you recorded, kept on the device.'],
          ['Insights', 'Built from your own sessions, on-device. Pull what you want — nothing here is pushed at you.'],
          ['Scoreboard', 'Session 14, sport stats only.'],
        ].map(([title, description]) => (
          <div
            key={title}
            style={{
              position: 'relative',
              background:
                'linear-gradient(to bottom, transparent 0, transparent 91px, var(--aera-color-data-lilac) 91px, var(--aera-color-data-lilac) 92px, transparent 92px)',
            }}
          >
            <ScreenHeader title={title} description={description} />
          </div>
        ))}
      </div>
    </StoryFrame>
  ),
};
