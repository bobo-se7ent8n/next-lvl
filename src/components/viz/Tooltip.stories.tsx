import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { anchorOf } from '../../lib/anchor';
import { Card } from '../primitives/Card';
import { Label } from '../primitives/Text';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Rendered at the document root rather than inside the card it describes. Cards clip their contents to their radius, so a tip anchored inside one was cut off the moment it crossed an edge; this one is portalled to the body and positioned in viewport coordinates instead.',
      },
    },
  },
  render: () => {
    const Harness = () => {
      const [at, setAt] = useState<{ x: number; y: number } | null>(null);
      return (
        <>
          <Card radius="card" padding="11" clip>
            <div
              onPointerEnter={(e) => setAt(anchorOf(e.currentTarget))}
              onPointerLeave={() => setAt(null)}
            >
              <Label tone="tertiary">hover me — the tip escapes this clipped card</Label>
            </div>
          </Card>
          {at ? (
            <Tooltip x={at.x} y={at.y} heading="Apr 12">
              2 sessions · Scrimmage · 71 min
            </Tooltip>
          ) : null}
        </>
      );
    };
    return <Harness />;
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
