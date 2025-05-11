import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { SeoProvider } from './context/SeoContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider>
            <SeoProvider>
              <AppRoutes />
            </SeoProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
