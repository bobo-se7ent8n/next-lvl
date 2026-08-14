import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectTokens } from './tokens/cssVars';
import './styles/global.css';
import { App } from './app/App';

/* the token layer goes on :root before anything paints */
injectTokens();

const host = document.getElementById('root');
if (!host) throw new Error('missing #root');

createRoot(host).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
