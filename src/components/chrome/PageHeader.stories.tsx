import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { colorData } from '../../tokens';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The one header every tab uses. The title sits at the same offset on all four, and the header reserves a spacing token beneath itself which no content region may enter — that reserve is the structural fix for the subhead being overlapped and clipped on every tab. The subhead measure is wide enough to hold one line at desktop width and uses `text-wrap: pretty`, so it never leaves an orphan word.',
      },
    },
  },
  args: {
    title: 'Sessions',
    subhead:
      'Every game you recorded, kept on the device. The month above is the frame; the log below it is what happened, and any session opens.',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ReservedBand: Story = {
  name: 'Reserved band',
  render: (args) => (
    <div>
      <PageHeader {...args} />
      <div
        style={{
          height: 64,
          borderRadius: 'var(--aera-radius-md)',
          background: colorData.blue,
        }}
      />
    </div>
  ),
};

export const LongSubhead: Story = {
  name: 'Long subhead',
  args: {
    title: 'Insights',
    subhead:
      'Built from your own sessions, on-device. Pull what you want — nothing here is pushed at you, ranked, or marked urgent.',
  },
};
