import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { OpenPrototypePill } from './OpenPrototypePill';

const meta: Meta<typeof OpenPrototypePill> = {
  title: 'Landing/Sticky pill',
  component: OpenPrototypePill,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Fixed bottom-right, into /app/home, with the component browser beside it as a quieter second option. It fades in when section 04 enters the viewport and stays for the rest of the page. It never appears inside /app/* or /storybook.',
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
  args: { visible: true },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {};
export const Hidden: Story = { name: 'Before section 04', args: { visible: false } };
