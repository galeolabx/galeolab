import React, { createContext, useContext, useEffect, useState } from 'react'
import { authConfigured, initializeAuth } from '../auth/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    client: null,
    session: null,
    loading: authConfigured,
    unavailable: !authConfigured,
    callbackError: false,
  })

  useEffect(() => {
    let active = true
    let subscription

    initializeAuth()
      .then(result => {
        if (!active) return
        setState({
          ...result,
          loading: false,
          unavailable: !result.client,
        })
        if (result.client) {
          subscription = result.client.auth.onAuthStateChange((_event, session) => {
            // Keep this callback synchronous to avoid SDK lock deadlocks.
            if (active) setState(previous => ({ ...previous, session }))
          }).data.subscription
        }
      })
      .catch(() => {
        if (active) setState(previous => ({
          ...previous,
          loading: false,
          unavailable: true,
        }))
      })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [])

  // Callback query parameters are consumed before HashRouter is mounted.
  if (state.loading) {
    return (
      <main style={{ padding: '96px 24px', textAlign: 'center' }}>
        <p role="status">Loading GaleoLab…</p>
      </main>
    )
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
