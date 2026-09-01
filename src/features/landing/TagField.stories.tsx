import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagField } from './TagField';

const meta: Meta<typeof TagField> = {
  title: 'Landing/Standing tag field',
  component: TagField,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The word tags the entry sequence leaves standing on the white state. They are the hero’s deleted subline, scattered rather than set — every scale, tilt and fill is hashed from the word itself, and the coordinates are then solved by a packer that keeps a real gap between every pair of boxes and a clear zone around the headline. So the field is dense and nothing overlaps, and the arrangement is identical on every reload. Which words survive the expansion is a property of the vocabulary rather than of the hash: the ones that carry the claim stay, the ones the product merely measures in collapse toward the centre and blur out. The layer is one viewport pinned to the top of the page, so its percentage coordinates are the window’s and it agrees with the fixed entry overlay without either being tuned.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <TagField />
    </div>
  ),
};
