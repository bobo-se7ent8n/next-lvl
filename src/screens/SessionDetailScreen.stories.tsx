import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SessionDetailLayout } from '../app/SessionDetailLayout';
import { SessionDetailScreen } from './SessionDetailScreen';

const meta: Meta<typeof SessionDetailScreen> = {
  title: 'Screens/Session detail',
  component: SessionDetailScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A real route at /app/sessions/:id with a layout of its own — no nav bar and no page header, just a back button and then the stage. The camera rail and the moment-notes panel are gone; the stage is full width, it plays, and the insight lines sit under the timeline.',
      },
    },
  },
  render: () => (
    <MemoryRouter initialEntries={['/app/sessions/s14']}>
      <Routes>
        <Route path="/app/sessions/:id" element={<SessionDetailLayout />}>
          <Route index element={<SessionDetailScreen />} />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
