import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './context/UserContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <App />
    </UserProvider>
  </BrowserRouter>,
)
