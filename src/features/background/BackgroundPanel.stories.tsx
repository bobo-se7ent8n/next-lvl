import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackgroundPanel } from './BackgroundPanel';
import { BackgroundLayers } from './BackgroundLayers';
import { BACKGROUND_DEFAULTS, type BackgroundSettings } from './settings';
import { StoryFrame } from '../../stories/kit';

const meta = {
  title: 'Components/BackgroundPanel',
  component: BackgroundPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The display settings panel. Three independent decorative layers, each with its own switch, so any combination is valid including all three off. Sliders write straight into the layer state — there is no apply step. Shipped defaults: lines on at 11% / 2px / 16, grain on at 20% / 0.70 / 1.40, ascii off at 10% / 26px / 10px.',
      },
    },
  },
  argTypes: { inline: { control: 'boolean' } },
  args: { settings: BACKGROUND_DEFAULTS, inline: true, onChange: () => {} },
  render: function Render(args) {
    const [settings, setSettings] = useState<BackgroundSettings>(args.settings);
    return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <BackgroundPanel {...args} settings={settings} onChange={setSettings} />
        <pre
          style={{
            margin: 0,
            fontFamily: 'var(--aera-font-mono)',
            fontSize: 11,
            color: 'var(--aera-color-ink-secondary)',
          }}
        >
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    );
  },
} satisfies Meta<typeof BackgroundPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Layers: Story = {
  render: () => (
    <StoryFrame name="BackgroundLayers" note="the shipped default — lines and grain on, ascii off">
      <div style={{ position: 'relative', height: 280, borderRadius: 22, overflow: 'hidden' }}>
        <BackgroundLayers settings={BACKGROUND_DEFAULTS} />
      </div>
    </StoryFrame>
  ),
};
