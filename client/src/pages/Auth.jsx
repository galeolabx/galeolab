import React, { useState, useMemo, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasSupabaseConfig } from '../lib/supabase'
import styles from '../styles/Auth.module.css'

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signup, login, socialLogin, user, loading, authError, clearAuthError } = useAuth()
  const [mode, setMode] = useState(location.pathname === '/signup' ? 'signup' : 'login')
  const [form, setForm] = useState(DEFAULT_FORM)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user && !authError) {
      navigate('/dashboard', { replace: true })
      return
    }

    setMode(location.pathname === '/signup' ? 'signup' : 'login')
  }, [location.pathname, navigate, user, loading, authError])

  const isSignup = mode === 'signup'

  const title = useMemo(
    () => (isSignup ? 'Create your account' : 'Welcome back'),
    [isSignup],
  )

  const subtitle = useMemo(
    () =>
      isSignup
        ? 'Build smarter systems with secure collaboration and faster launches.'
        : 'Sign in to manage projects, track progress, and collaborate with your team.',
    [isSignup],
  )

  const submitLabel = isSignup ? 'Create account' : 'Login'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    clearAuthError()

    if (isSignup && form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)

      if (isSignup) {
        const result = await signup({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        })
        if (result.confirmationRequired) {
          setForm(DEFAULT_FORM)
          setMessage('Check your email. If confirmation is needed, follow the link in the same browser to finish creating your account. You can then sign in.')
          return
        }
      } else {
        await login({
          email: form.email,
          password: form.password,
        })
      }

      setForm(DEFAULT_FORM)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setError('')

    try {
      setIsSubmitting(true)
      await socialLogin(provider)
    } catch (submitError) {
      setError(submitError.message || 'Could not continue with that provider.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.infoPanel}>
            <span className="section-label">Secure access</span>
            <h1 className={styles.title}>GaleoLab</h1>
            <p className={styles.subtitle}>{subtitle}</p>

            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <span className={styles.icon}>01</span>
                <div>
                  <strong>Fast onboarding</strong>
                  <p>Launch your workspace in minutes.</p>
                </div>
              </div>
              <div className={styles.benefit}>
                <span className={styles.icon}>02</span>
                <div>
                  <strong>Enterprise ready</strong>
                  <p>Built for secure team collaboration.</p>
                </div>
              </div>
              <div className={styles.benefit}>
                <span className={styles.icon}>03</span>
                <div>
                  <strong>Always in sync</strong>
                  <p>Keep research, delivery, and strategy aligned.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formPanel}>
            {!hasSupabaseConfig() && (
              <div className={styles.error} role="alert" style={{ marginBottom: '18px' }}>
                Account access is temporarily unavailable. Please try again later.
              </div>
            )}

            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${!isSignup ? styles.active : ''}`}
                onClick={() => {
                  setMode('login')
                  navigate('/login')
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`${styles.tab} ${isSignup ? styles.active : ''}`}
                onClick={() => {
                  setMode('signup')
                  navigate('/signup')
                }}
              >
                Sign up
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <h2>{title}</h2>

              {(error || authError) && <div className={styles.error} role="alert">{error || authError}</div>}
              {message && <div className={styles.success} role="status">{message}</div>}

              {isSignup && (
                <label className={styles.field}>
                  <span>Full name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </label>
              )}

              <label className={styles.field}>
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  minLength={isSignup ? 8 : undefined}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </label>

              {isSignup && (
                <label className={styles.field}>
                  <span>Confirm password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    minLength={8}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                  />
                </label>
              )}

              {!isSignup && (
                <div className={styles.metaRow}>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              )}

              <button type="submit" className={`${styles.primaryButton} btn-primary`} disabled={isSubmitting || loading || !hasSupabaseConfig()}>
                {isSubmitting ? (isSignup ? 'Creating account...' : 'Signing in...') : submitLabel}
              </button>

              <div className={styles.divider}>
                <span>or continue with</span>
              </div>

              <div className={styles.socials}>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => handleSocialLogin('google')}
                  disabled={isSubmitting || loading || !hasSupabaseConfig()}
                >
                  Google
                </button>
                <button
                  type="button"
                  className={styles.socialButton}
                  onClick={() => handleSocialLogin('github')}
                  disabled={isSubmitting || loading || !hasSupabaseConfig()}
                >
                  GitHub
                </button>
              </div>

              <p className={styles.footerText}>
                {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => {
                    const nextMode = isSignup ? 'login' : 'signup'
                    setMode(nextMode)
                    navigate(nextMode === 'signup' ? '/signup' : '/login')
                  }}
                >
                  {isSignup ? 'Login' : 'Sign up'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
