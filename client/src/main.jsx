import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import { supabase } from './lib/supabase'
import { completeAuthCallback } from './lib/authCallback'

async function startApp() {
const callback = await completeAuthCallback(supabase, window.location.href)
if (callback) window.history.replaceState({}, '', callback.url)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider callbackError={callback?.error}>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
}

startApp()
