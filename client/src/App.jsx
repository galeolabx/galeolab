import React from 'react'
import { HashRouter, Navigate, Routes, Route } from 'react-router-dom'
import BaseLayout from './components/layout/BaseLayout'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound'
import { LoginPage, SignupPage, VerifyEmailPage, ForgotPasswordPage, ResetPasswordPage, AccountPage } from './pages/Auth/AuthPages'

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

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="account" element={<AccountPage />} />

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
