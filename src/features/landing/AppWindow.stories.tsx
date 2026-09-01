import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppWindow } from './AppWindow';

const meta: Meta<typeof AppWindow> = {
  title: 'Landing/Window frame',
  component: AppWindow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A macOS window: traffic lights, a centred title, and a slot on the right for a tab row. The three lights are the AERA palette rather than the system red/amber/green — this is the product in a window, and three imported colours would be the only three on the page from outside the palette.',
      },
    },
  },
  args: { title: 'aera · /app/home' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 'var(--aera-landing-shot-width)', maxWidth: '80vw' }}>
      <AppWindow {...args}>
        <div style={{ aspectRatio: '16 / 9', background: 'var(--aera-color-surface-level1)' }} />
      </AppWindow>
    </div>
  ),
};
