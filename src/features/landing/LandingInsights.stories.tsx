import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingInsights } from './LandingInsights';

const meta: Meta<typeof LandingInsights> = {
  title: 'Landing/05 Insights',
  component: LandingInsights,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Four stages inside one pinned section: an empty Ask AERA bubble with a lit dot walking its border; the prompt typing itself in a character at a time as the border closes around it; the line beneath revealing word by word on the same cadence; and then the group leaving and — only once it has completely gone — the Insights screen arriving, container first and its contents a beat behind. Everything is derived from one progress value, so scrolling back up runs the same arithmetic backwards and the stages reverse cleanly with nothing to reset.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
