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
          'A month, sized to the shared left column. The day cells are portrait — noticeably taller than wide, with a generous corner — because the squat landscape version read as a heat strip rather than as a calendar. Non-clickable: 2px stroke, no shadow, no hover.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
