import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StorybookLayout } from '../app/StorybookLayout';
import { StorybookBrowser } from './StorybookBrowser';

const meta: Meta<typeof StorybookBrowser> = {
  title: 'Screens/Storybook browser',
  component: StorybookBrowser,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The public component browser at /storybook — a third layout with its own fixed sidebar, rendered entirely in AERA colours on the paper-cream ground. The app nav bar does not appear here, and neither does the landing scaffolding.',
      },
    },
  },
  render: () => (
    <MemoryRouter initialEntries={['/storybook/colors']}>
      <Routes>
        <Route path="/storybook" element={<StorybookLayout />}>
          <Route path=":slug" element={<StorybookBrowser />} />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
