import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { createAuthActions, sessionUser } from '../lib/authActions'

const AuthContext = createContext(null)

export function AuthProvider({ children, callbackError = '' }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [authError, setAuthError] = useState(callbackError)

  useEffect(() => {
    // Delete the retired demo database, including any readable passwords.
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem('galeolab-auth-users')
      storage.removeItem('galeolab-auth-session')
    }
    if (!supabase) return undefined

    let active = true
    let eventVersion = 0
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      eventVersion += 1
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
    })
    const version = eventVersion
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || version !== eventVersion) return
      setSession(error ? null : data.session)
      if (error) setAuthError('Your session could not be restored. Please sign in again.')
      setLoading(false)
    }).catch(() => {
      if (!active || version !== eventVersion) return
      setSession(null)
      setAuthError('Your session could not be restored. Please sign in again.')
      setLoading(false)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const actions = createAuthActions(supabase, window.location.origin)
  const logout = async () => {
    try {
      await actions.logout()
      setSession(null)
      setAuthError('')
    } catch {
      setAuthError('Sign out failed. Please try again before leaving this device.')
    }
  }

  return (
    <AuthContext.Provider value={{
      ...actions, logout, user: sessionUser(session), loading, authError,
      clearAuthError: () => setAuthError(''),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
