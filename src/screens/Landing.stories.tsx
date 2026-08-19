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
          'Every section composed in order, with the fixed left ruler and the dashed column guides. This is a wireframe and it looks like one: labelled dashed containers for type, flat muted slots for anything that will become a visual, and all annotation in small uppercase mono so the scaffolding never reads as content.',
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
