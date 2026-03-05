import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '@/pages/home'
import AdminPage from '@/pages/admin'
import PrivacyPage from '@/pages/privacy'
import AboutPage from '@/pages/about'
import FAQPage from '@/pages/faq'
import { ToastProvider, useToastContext } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toast'

function ToasterWrapper() {
  const { toasts, dismiss } = useToastContext()
  return <Toaster toasts={toasts} onDismiss={dismiss} />
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToasterWrapper />
    </ToastProvider>
  )
}

export default App
