import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollFillText } from './ScrollFillText';
import { SESSION_TABS } from './copy';

const meta: Meta<typeof ScrollFillText> = {
  title: 'Landing/Read-through paragraph',
  component: ScrollFillText,
  parameters: {
    docs: {
      description: {
        component:
          'Words come up from muted to full strength one at a time as the section scrolls. The whole paragraph is driven by ONE custom property — every word works its own state out of `clamp(0, fill × count − index, 1)` — so a fifty-word paragraph costs one property write per frame rather than fifty style assignments, and React is not involved while the page moves. `**like this**` in the copy marks the single word set in the orange accent; everything else is plain black body text one step up the type scale. Fully lit under reduced motion: the fill is a reading aid, never information.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** the section normally writes `--fill`; here it is set once */
function Filling({ to, tab = 0 }: { to: number; tab?: number }) {
  const host = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    host.current?.style.setProperty('--fill', String(to));
  }, [to]);

  return (
    <div style={{ width: 'var(--aera-layout-max-read-width)', maxWidth: '80vw' }}>
      <ScrollFillText text={SESSION_TABS[tab].copy} hostRef={host} />
    </div>
  );
}

export const Empty: Story = { render: () => <Filling to={0} tab={1} /> };
export const HalfRead: Story = { render: () => <Filling to={0.5} tab={1} /> };
export const Full: Story = { render: () => <Filling to={1} tab={1} /> };

export const WithAccent: Story = {
  name: 'The month — one word in the orange accent',
  render: () => <Filling to={1} />,
};
