import type { Meta, StoryObj } from '@storybook/react-vite';
import { LandingFuture } from './LandingFuture';

const meta: Meta<typeof LandingFuture> = {
  title: 'Landing/06 Not built yet',
  component: LandingFuture,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Heading, one line, and the two renders of hardware that does not exist yet — two equal columns filling the full width inside the page frame, everything centred, and no dashed scaffolding anywhere. The dashes were right when the images were empty slots; drawn around two finished photographs they read as the photographs being provisional rather than the hardware.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
