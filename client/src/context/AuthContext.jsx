import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const STORAGE_KEY = 'galeolab-auth-users'
const SESSION_KEY = 'galeolab-auth-session'

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => safeParse(localStorage.getItem(STORAGE_KEY), []))
  const [user, setUser] = useState(() => safeParse(localStorage.getItem(SESSION_KEY), null))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  useEffect(() => {
    if (!hasSupabaseConfig()) return undefined

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null)
        return
      }

      setUser({
        id: session.user.id,
        fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email,
      })
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          fullName: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'User',
          email: data.session.user.email,
        })
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const signup = async ({ fullName, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (hasSupabaseConfig()) {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (error) throw error

      const nextUser = {
        id: data.user?.id || 'supabase-user',
        fullName: fullName.trim(),
        email: normalizedEmail,
      }

      setUser(nextUser)
      return nextUser
    }

    const exists = users.some((entry) => entry.email.toLowerCase() === normalizedEmail)

    if (exists) {
      throw new Error('An account with this email already exists.')
    }

    const nextUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    }

    setUsers((prev) => [...prev, nextUser])
    setUser({ id: nextUser.id, fullName: nextUser.fullName, email: nextUser.email })
    return nextUser
  }

  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (hasSupabaseConfig()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) throw error

      const sessionUser = {
        id: data.user.id,
        fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email,
      }

      setUser(sessionUser)
      return sessionUser
    }

    const match = users.find(
      (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === password,
    )

    if (!match) {
      throw new Error('Invalid email or password.')
    }

    const sessionUser = {
      id: match.id,
      fullName: match.fullName,
      email: match.email,
    }

    setUser(sessionUser)
    return sessionUser
  }

  const socialLogin = async (provider) => {
    const normalizedProvider = String(provider || '').toLowerCase()

    if (!['google', 'github'].includes(normalizedProvider)) {
      throw new Error('Unsupported sign-in provider.')
    }

    if (hasSupabaseConfig()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: normalizedProvider,
        options: {
          redirectTo: `${window.location.origin}/#/dashboard`,
        },
      })

      if (error) throw error

      if (data?.url) {
        window.location.href = data.url
      }

      return {
        provider: normalizedProvider,
        redirected: Boolean(data?.url),
      }
    }

    const socialUser = {
      id: `demo-${normalizedProvider}-${Date.now()}`,
      fullName: normalizedProvider === 'google' ? 'Google User' : 'GitHub User',
      email: `${normalizedProvider}-demo@galeolab.local`,
    }

    const existing = users.find((entry) => entry.email.toLowerCase() === socialUser.email.toLowerCase())

    if (!existing) {
      setUsers((prev) => [...prev, { ...socialUser, password: 'social-login' }])
    }

    setUser(socialUser)
    return { provider: normalizedProvider, redirected: false }
  }

  const resetPassword = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (hasSupabaseConfig()) {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/login`,
      })

      if (error) throw error

      return {
        sent: true,
        email: normalizedEmail,
      }
    }

    const match = users.find((entry) => entry.email.toLowerCase() === normalizedEmail)

    if (!match) {
      throw new Error('No account was found with that email address.')
    }

    const updatedUser = {
      ...match,
      password,
    }

    setUsers((prev) =>
      prev.map((entry) => (entry.email.toLowerCase() === normalizedEmail ? updatedUser : entry)),
    )

    return {
      sent: false,
      email: normalizedEmail,
    }
  }

  const logout = async () => {
    if (hasSupabaseConfig()) {
      await supabase.auth.signOut()
      setUser(null)
      return
    }

    setUser(null)
  }

  const value = useMemo(
    () => ({ user, users, signup, login, logout, resetPassword, socialLogin }),
    [user, users],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
