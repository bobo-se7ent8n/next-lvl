import type { Meta, StoryObj } from '@storybook/react-vite';
import { VitalCard } from './VitalCard';
import { StoryFrame, Row } from '../../stories/kit';
import { VITALS } from '../../data/vitals';

const meta = {
  title: 'Components/VitalCard',
  component: VitalCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A body reading. Physiological data is private to the device and never shareable — only the sport statistics on the Scoreboard are.',
      },
    },
  },
  args: { vital: VITALS[0] },
  render: (args) => (
    <div style={{ width: 320, height: 420 }}>
      <VitalCard {...args} />
    </div>
  ),
} satisfies Meta<typeof VitalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ChartKinds: Story = {
  name: 'Chart kinds',
  render: () => (
    <StoryFrame name="VitalCard" note="bars · line · area">
      <Row gap={20}>
        {['stress', 'hrv', 'cardio'].map((id) => (
          <div key={id} style={{ width: 300, height: 440 }}>
            <VitalCard vital={VITALS.find((v) => v.id === id)!} />
          </div>
        ))}
      </Row>
    </StoryFrame>
  ),
};
