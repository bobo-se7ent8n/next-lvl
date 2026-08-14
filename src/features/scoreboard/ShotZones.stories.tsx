import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShotZones } from './ShotZones';

const meta = {
  title: 'Components/ShotZones',
  component: ShotZones,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Court-shaped zones with makes / attempts and FG% as plain numbers inside each one. No dot fills, and attempt count is not encoded in anything but the number itself. The cold → hot ramp is the single deliberate exemption from the semantic colour rule.',
      },
    },
  },
  render: () => (
    <div style={{ width: 520 }}>
      <ShotZones />
    </div>
  ),
} satisfies Meta<typeof ShotZones>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
