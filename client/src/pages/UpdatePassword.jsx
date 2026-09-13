import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Auth.module.css'

export default function UpdatePassword() {
  const { user, loading, updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await updatePassword(password)
      setPassword('')
      setConfirmation('')
      setDone(true)
    } catch (error) {
      setError(error.message || 'Could not update your password. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.formPanel}>
          {loading ? <p role="status">Verifying your session…</p> : done ? (
            <div className={styles.form}>
              <h1>Password updated</h1>
              <p role="status">Your new password is saved.</p>
              <Link to="/dashboard" className="btn-primary">Continue to your dashboard</Link>
            </div>
          ) : !user ? (
            <div className={styles.form}>
              <h1>Request a new reset link</h1>
              <p>This recovery session is missing or has expired.</p>
              <Link to="/forgot-password" className="btn-primary">Request reset link</Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={submit}>
              <h1>Choose a new password</h1>
              {error && <p className={styles.error} role="alert">{error}</p>}
              <label className={styles.field}>
                <span>New password</span>
                <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Confirm new password</span>
                <input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} />
              </label>
              <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
