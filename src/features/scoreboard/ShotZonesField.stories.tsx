import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShotZonesField } from './ShotZonesField';

const meta: Meta<typeof ShotZonesField> = {
  title: 'Components/ShotZonesField',
  component: ShotZonesField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shots as a continuous dot field on a real half court. Dot SIZE is attempt frequency, dot COLOUR is accuracy. On hover every dot outside the hovered zone drops in opacity and the hovered zone stays at full — applied PER DOT, not on a wrapper group: a group opacity composites the zone as one layer, which both hid the effect and would have flattened the density encoding. Size never changes, because a dot that shrank would be lying about how often that shot gets taken.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 'var(--aera-layout-max-prose-width)' }}>
      <ShotZonesField />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
