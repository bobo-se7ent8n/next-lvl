import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Landing } from './Landing';

const meta: Meta<typeof Landing> = {
  title: 'Landing/Full page',
  component: Landing,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every section composed in order, behind the entry sequence that plays over it once per session. Four of the sections pin to the window and are driven by scroll — sessions, insights, the nav\u2019s progress stroke and the loading card\u2019s expansion all measure themselves against the viewport, so this story is only true at `layout: fullscreen` and is best read in its own window rather than in the docs pane.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
