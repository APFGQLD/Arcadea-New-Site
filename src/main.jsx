import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext';
import { NavVisibilityProvider } from './context/NavVisibilityContext';
import { BrowserRouter } from 'react-router-dom';
import Clarity from '@microsoft/clarity';
import './i18n';

// Production only, so local dev sessions don't end up in the Clarity dashboard,
// and not on the staff-only /admin and /studio pages (index.html does the same
// for the Google tag)
const isStaffPage = /^\/(admin|studio)/.test(window.location.pathname);
if (import.meta.env.PROD && !isStaffPage) {
  Clarity.init('vcvl03ur37');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <NavVisibilityProvider>
        <BrowserRouter>
          <Suspense fallback={<div style={{ background: '#0a0a0a', height: '100vh' }} />}>
            <App />
          </Suspense>
        </BrowserRouter>
      </NavVisibilityProvider>
    </ThemeProvider>
  </StrictMode>,
)
