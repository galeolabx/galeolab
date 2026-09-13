import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authErrorMessage, authRedirect } from '../../auth/client'
import styles from './Auth.module.css'

function AuthShell({ title, description, error, message, children }) {
  const { unavailable } = useAuth()
  useEffect(() => {
    const previous = document.title
    document.title = title + ' | GaleoLab'
    return () => { document.title = previous }
  }, [title])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>GALEOLAB ACCOUNT</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {unavailable && (
          <p className={styles.message} role="status">
            Account access is temporarily unavailable. Please try again later.
          </p>
        )}
        {error && <p className={styles.message + ' ' + styles.error} role="alert">{error}</p>}
        {message && <p className={styles.message} role="status">{message}</p>}
        {children}
        <Link className={styles.back + ' ' + styles.link} to="/">Back to GaleoLab</Link>
      </div>
    </div>
  )
}

function EmailField() {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="email">Email address</label>
      <input className={styles.input} id="email" name="email" type="email"
        autoComplete="email" autoCapitalize="none" spellCheck={false}
        placeholder="you@example.com" maxLength={254} required />
    </div>
  )
}

function PasswordField({ id = 'password', label = 'Password', newPassword = false, hint = false }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.passwordWrap}>
        <input className={styles.input} id={id} name={id}
          type={visible ? 'text' : 'password'}
          autoComplete={newPassword ? 'new-password' : 'current-password'}
          minLength={newPassword ? 12 : undefined} maxLength={128}
          aria-describedby={hint ? id + '-hint' : undefined} required />
        <button className={styles.show} type="button"
          aria-controls={id} aria-pressed={visible}
          aria-label={(visible ? 'Hide ' : 'Show ') + label.toLowerCase()}
          onClick={() => setVisible(value => !value)}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && <p className={styles.hint} id={id + '-hint'}>Use at least 12 characters. A long, unique passphrase works well.</p>}
    </div>
  )
}

export function LoginPage() {
  const { client, session, callbackError } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const badCallback = callbackError || params.get('callback') === 'failed'

  async function submit(event) {
    event.preventDefault()
    if (!client || busy) return
    const form = event.currentTarget
    const values = new FormData(form)
    setBusy(true)
    setError('')
    try {
      const result = await client.auth.signInWithPassword({
        email: String(values.get('email')).trim(),
        password: String(values.get('password')),
      })
      if (result.error) throw result.error
      form.reset()
      navigate('/account', { replace: true })
    } catch (failure) {
      setError(authErrorMessage(failure, 'Unable to sign in. Check your details and try again.'))
    } finally {
      setBusy(false)
    }
  }

  if (session && !badCallback) return <Navigate to="/account" replace />

  return (
    <AuthShell title="Welcome back" description="Sign in to your GaleoLab account."
      error={error}
      message={badCallback
        ? 'This email link could not be completed. Open the newest link in the same browser where you requested it. If your email is already confirmed, try signing in below.'
        : params.get('password') === 'updated' ? 'Your password has been updated. Sign in with your new password.' : ''}>
      <form className={styles.form} onSubmit={submit} aria-busy={busy}>
        <fieldset className={styles.fieldset} disabled={!client || busy}>
          <EmailField />
          <PasswordField />
          <Link className={styles.forgot + ' ' + styles.link} to="/forgot-password">Forgot password?</Link>
          <button className={'btn-primary ' + styles.submit} type="submit">{busy ? 'Signing in…' : 'Log in'}</button>
        </fieldset>
      </form>
      <p className={styles.links}>New to GaleoLab? <Link className={styles.link} to="/signup">Create an account</Link></p>
      <p className={styles.links}><Link className={styles.link} to="/verify-email">Resend confirmation email</Link></p>
    </AuthShell>
  )
}

export function SignupPage() {
  const { client, session } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (!client || busy) return
    const form = event.currentTarget
    const values = new FormData(form)
    const name = String(values.get('fullName')).trim()
    const password = String(values.get('password'))
    setError('')
    if (name.length < 2) return setError('Please enter your full name.')
    if (password !== values.get('confirmPassword')) return setError('The passwords do not match.')
    if (password.length < 12) return setError('Use at least 12 characters for your password.')
    setBusy(true)
    try {
      const { data, error: failure } = await client.auth.signUp({
        email: String(values.get('email')).trim(),
        password,
        options: {
          emailRedirectTo: authRedirect('confirm'),
          // Display information only; never use editable metadata for roles.
          data: { full_name: name },
        },
      })
      if (failure) throw failure
      form.reset()
      navigate(data.session ? '/account' : '/verify-email', { replace: true })
    } catch (failure) {
      setError(authErrorMessage(failure, 'Unable to complete registration. Please try again or sign in if you already have an account.'))
    } finally {
      setBusy(false)
    }
  }

  if (session) return <Navigate to="/account" replace />

  return (
    <AuthShell title="Create your account" description="Start with your name, email, and a secure password." error={error}>
      <form className={styles.form} onSubmit={submit} aria-busy={busy}>
        <fieldset className={styles.fieldset} disabled={!client || busy}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full name</label>
            <input className={styles.input} id="fullName" name="fullName" autoComplete="name" minLength={2} maxLength={80} required />
          </div>
          <EmailField />
          <PasswordField newPassword hint />
          <PasswordField id="confirmPassword" label="Confirm password" newPassword />
          <button className={'btn-primary ' + styles.submit} type="submit">{busy ? 'Creating account…' : 'Create account'}</button>
        </fieldset>
      </form>
      <p className={styles.links}>Already registered? <Link className={styles.link} to="/login">Log in</Link></p>
    </AuthShell>
  )
}

export function VerifyEmailPage() {
  const { client } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function resend(event) {
    event.preventDefault()
    if (!client || busy) return
    const values = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const result = await client.auth.resend({
        type: 'signup',
        email: String(values.get('email')).trim(),
        options: { emailRedirectTo: authRedirect('confirm') },
      })
      if (result.error) throw result.error
      setMessage('If this address needs confirmation, an email will arrive shortly. Check your spam folder too.')
    } catch (failure) {
      setError(authErrorMessage(failure, 'Unable to request an email right now. Please wait and try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Check your email"
      description="If registration was accepted, we sent you a confirmation link. Open the newest link in the same browser and device where you created your account."
      error={error} message={message}>
      <form className={styles.form} onSubmit={resend} aria-busy={busy}>
        <fieldset className={styles.fieldset} disabled={!client || busy}>
          <EmailField />
          <button className={'btn-outline ' + styles.submit} type="submit">{busy ? 'Requesting email…' : 'Resend confirmation email'}</button>
        </fieldset>
      </form>
      <p className={styles.links}><Link className={styles.link} to="/login">Return to login</Link></p>
    </AuthShell>
  )
}

export function ForgotPasswordPage() {
  const { client } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (!client || busy) return
    const values = new FormData(event.currentTarget)
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const result = await client.auth.resetPasswordForEmail(String(values.get('email')).trim(), {
        redirectTo: authRedirect('recovery'),
      })
      if (result.error) throw result.error
      setMessage('If an account exists for this address, you will receive a reset email. Open the newest link in this browser and on this device.')
    } catch (failure) {
      setError(authErrorMessage(failure, 'Unable to request a password reset right now. Please try again later.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Reset your password" description="Enter your email address to request a password reset link." error={error} message={message}>
      <form className={styles.form} onSubmit={submit} aria-busy={busy}>
        <fieldset className={styles.fieldset} disabled={!client || busy}>
          <EmailField />
          <button className={'btn-primary ' + styles.submit} type="submit">{busy ? 'Requesting link…' : 'Send reset link'}</button>
        </fieldset>
      </form>
      <p className={styles.links}><Link className={styles.link} to="/login">Back to login</Link></p>
    </AuthShell>
  )
}

export function ResetPasswordPage() {
  const { client, session } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (!client || !session || busy) return
    const form = event.currentTarget
    const values = new FormData(form)
    const password = String(values.get('password'))
    setError('')
    if (password !== values.get('confirmPassword')) return setError('The passwords do not match.')
    if (password.length < 12) return setError('Use at least 12 characters for your password.')
    setBusy(true)
    try {
      const verified = await client.auth.getUser()
      if (verified.error || !verified.data.user) throw verified.error || new Error('No user')
      const result = await client.auth.updateUser({ password })
      if (result.error) throw result.error
      form.reset()
      // Return to login after changing the password.
      const signedOut = await client.auth.signOut({ scope: 'local' })
      if (signedOut.error) {
        setError('Your password was updated, but sign out did not finish. Please retry signing out from your account.')
      } else {
        navigate('/login?password=updated', { replace: true })
      }
    } catch (failure) {
      setError(authErrorMessage(failure, 'Unable to update your password. Request a new reset link or sign in again.'))
    } finally {
      setBusy(false)
    }
  }

  if (!session) return <Navigate to="/forgot-password" replace />

  return (
    <AuthShell title="Choose a new password" description="Use a unique password you do not use on other websites." error={error}>
      <form className={styles.form} onSubmit={submit} aria-busy={busy}>
        <fieldset className={styles.fieldset} disabled={!client || busy}>
          <PasswordField label="New password" newPassword hint />
          <PasswordField id="confirmPassword" label="Confirm new password" newPassword />
          <button className={'btn-primary ' + styles.submit} type="submit">{busy ? 'Updating password…' : 'Update password'}</button>
        </fieldset>
      </form>
      <p className={styles.links}><Link className={styles.link} to="/account">Your account</Link></p>
    </AuthShell>
  )
}

export function AccountPage() {
  const { client, session } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setUser(null)
    setChecking(true)
    setError('')
    if (!client || !session) {
      setChecking(false)
      return () => { active = false }
    }

    // Verify with the Auth server before displaying account details.
    client.auth.getUser()
      .then(result => {
        if (!active) return
        if (result.error || !result.data.user) {
          setError('Unable to verify this session. Please sign in again.')
        } else {
          setUser(result.data.user)
        }
      })
      .catch(() => { if (active) setError('Unable to check your account. Please try again.') })
      .finally(() => { if (active) setChecking(false) })

    return () => { active = false }
  }, [client, session?.access_token])

  async function signOut() {
    if (!client || busy) return
    setBusy(true)
    setError('')
    try {
      const result = await client.auth.signOut({ scope: 'local' })
      if (result.error) throw result.error
      navigate('/login', { replace: true })
    } catch {
      setError('Unable to sign out. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!session) return <Navigate to="/login" replace />

  const name = typeof user?.user_metadata?.full_name === 'string'
    ? user.user_metadata.full_name.slice(0, 80) : 'GaleoLab member'

  return (
    <AuthShell title="Your account" description="Manage your GaleoLab sign-in details." error={error}>
      {checking && <p className={styles.message} role="status">Checking your account…</p>}
      {user && (
        <dl className={styles.accountDetails}>
          <div><dt>Name</dt><dd>{name}</dd></div>
          <div><dt>Email address</dt><dd>{user.email}</dd></div>
          <div><dt>Email status</dt><dd>{user.email_confirmed_at ? 'Confirmed' : 'Not confirmed'}</dd></div>
        </dl>
      )}
      <div className={styles.accountActions}>
        {user && <Link className="btn-outline" to="/reset-password">Change password</Link>}
        <button className="btn-primary" type="button" disabled={busy} onClick={signOut}>{busy ? 'Signing out…' : 'Sign out'}</button>
      </div>
    </AuthShell>
  )
}
