import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityCalendar } from './ActivityCalendar';

const meta: Meta<typeof ActivityCalendar> = {
  title: 'Components/ActivityCalendar',
  component: ActivityCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A month, read as a month — seven columns, weekday labels across the top, and wide landscape cells with real gutters between them rather than the eighteen-week square heatmap this replaces. The day number sits in the cell corner, the session load is the fill, and the stats row underneath is scoped to the month on screen and to nothing else. Paging back and forth does not shift the data: every day is a pure function of its date.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
