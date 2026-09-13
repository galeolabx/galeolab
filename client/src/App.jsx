import React from 'react'
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom'
import BaseLayout from './components/layout/BaseLayout'
import Home from './pages/Home/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import { useAuth } from './context/AuthContext'

const SECTION_ROUTES = [
  { path: 'platform', section: 'platform' },
  { path: 'solutions', section: 'solutions' },
  { path: 'services', section: 'solutions' },
  { path: 'technology', section: 'technology' },
  { path: 'research', section: 'research' },
  { path: 'pricing', section: 'pricing' },
  { path: 'developers', section: 'developers' },
  { path: 'company', section: 'company' },
  { path: 'about', section: 'company' },
  { path: 'career', section: 'company' },
  { path: 'portfolio', section: 'solutions' },
  { path: 'contact', section: 'contact' },
]

function ProtectedDashboard() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Dashboard />
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Auth />} />
          <Route path="signup" element={<Auth />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="dashboard" element={<ProtectedDashboard />} />

          {SECTION_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to={`/#${route.section}`} replace />}
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
