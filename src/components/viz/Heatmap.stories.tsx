import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heatmap } from './Heatmap';
import { StoryFrame, Variant } from '../../stories/kit';
import { ACTIVITY, DAY_LABELS } from '../../data/activity';

const meta = {
  title: 'Components/Heatmap',
  component: Heatmap,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The activity calendar — one square per day, seven rows deep, hover for the day. It counts sessions and nothing else: there is no streak here, and a rest day costs nothing.',
      },
    },
  },
  argTypes: {
    cell: { control: { type: 'range', min: 8, max: 28 } },
    gap: { control: { type: 'range', min: 1, max: 8 } },
  },
  args: { days: ACTIVITY, dayLabels: DAY_LABELS, cell: 17, gap: 3 },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Densities: Story = {
  render: () => (
    <StoryFrame name="Heatmap" note="the same 18 weeks at two cell sizes">
      <Variant name="21px">
        <Heatmap days={ACTIVITY} dayLabels={DAY_LABELS} cell={21} gap={3} />
      </Variant>
      <Variant name="12px">
        <Heatmap days={ACTIVITY} dayLabels={DAY_LABELS} cell={12} gap={2} />
      </Variant>
    </StoryFrame>
  ),
};
