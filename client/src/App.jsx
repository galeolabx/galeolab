import React from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import BaseLayout from './components/layout/BaseLayout'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound'

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          {SECTION_ROUTES.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to={`/#${route.section}`} replace />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
