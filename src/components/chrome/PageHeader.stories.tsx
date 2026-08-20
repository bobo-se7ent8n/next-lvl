import { useState } from 'react';
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
          'Every screen header. Centre aligned, one reserved band beneath it. It also carries the switched-view form used on Home, where two headings sit side by side and the heading itself is the control — no tab strip and no pill, because a tab strip above a headline would be a second navigation bar on a screen that already has one. The inactive heading uses the tertiary ink token rather than an opacity, and travels toward full ink under the pointer.',
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

/** the two-view form, as Home uses it */
export const SwitchedViews: Story = {
  render: function Switched() {
    const [view, setView] = useState('patterns');
    return (
      <PageHeader
        views={[
          {
            id: 'patterns',
            title: 'Patterns',
            subhead: 'A pattern is a behaviour your sessions keep repeating.',
          },
          {
            id: 'vitals',
            title: 'Focus & vitals',
            subhead: 'One thing worth attention this week, and the readings underneath it.',
          },
        ]}
        activeView={view}
        onView={setView}
      />
    );
  },
};
