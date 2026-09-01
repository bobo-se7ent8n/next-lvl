import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotCanvas } from './DotCanvas';

const meta: Meta<typeof DotCanvas> = {
  title: 'Landing/Tactile dot field',
  component: DotCanvas,
  parameters: {
    docs: {
      description: {
        component:
          'The closing block’s surface. Dots inside a radius of the pointer grow and are pushed gently away, easing back as it leaves — one canvas, one rAF loop, and the loop parks itself the moment the field is at rest. This is the one field on the page that is drawn rather than laid out: two thousand DOM nodes restyled per frame is a main-thread stall you can feel in the scroll, and two thousand dots of arithmetic is not. Static on touch and under reduced motion.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: 'var(--aera-landing-shot-width)',
        maxWidth: '80vw',
        aspectRatio: '21 / 9',
        background: 'var(--aera-color-surface-level1)',
      }}
    >
      <DotCanvas />
    </div>
  ),
};
