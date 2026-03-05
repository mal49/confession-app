import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/use-theme'
import { validateEnv } from '@/lib/env'
import { registerServiceWorker } from '@/lib/service-worker'
import './index.css'
import App from './App.tsx'

// Validate environment variables on startup
validateEnv()

// Register service worker for offline support
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
