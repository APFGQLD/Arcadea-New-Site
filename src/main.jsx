import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<div style={{ background: '#0a0a0a', height: '100vh' }} />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
