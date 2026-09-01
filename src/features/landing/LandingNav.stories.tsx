import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { LandingNav } from './LandingNav';

const meta: Meta<typeof LandingNav> = {
  title: 'Landing/Sticky nav',
  component: LandingNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A window over the page rather than a band across it: full width inside the page’s frame margin, cut at the window radius, hairlined. Three groups — the wordmark, the scroll capsule, and the two ways out. The capsule is a square light pill holding one dot-matrix arrow centred on both axes, and TOTAL page scroll is a white arc travelling clockwise from twelve o’clock around the outside of it, drawn twice so the blurred copy underneath reads as a glow following the button’s edge. The ring is pinned to the capsule’s centre in a box of its own diameter, so it stays circular while the capsule widens underneath it. Past the last content section the ring closes and the capsule morphs into “To top”, on the firm curve with no overshoot in it: resistance, never a spring.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ minHeight: 'var(--aera-space-16)' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: { atEnd: false },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scrolling: Story = {};

export const Morphed: Story = {
  name: 'Past the last section — “To top”',
  args: { atEnd: true },
};

export const DuringEntry: Story = {
  name: 'Held back while the entry plays',
  args: { hidden: true },
};
