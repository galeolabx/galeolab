import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { hasSupabaseConfig } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Auth.module.css'

function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      setIsSubmitting(true)
      await resetPassword({ email })
      setMessage('If an account exists for this email, a reset link will arrive shortly. Open it in this browser to choose a new password.')

      setEmail('')
    } catch (submitError) {
      setError(submitError.message || 'Could not reset your password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.infoPanel}>
            <span className="section-label">Account recovery</span>
            <h1 className={styles.title}>Reset your access</h1>
            <p className={styles.subtitle}>Request a verified email link to choose a new password.</p>
          </div>

          <div className={styles.formPanel}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2>Forgot password</h2>

              {!hasSupabaseConfig() && <div className={styles.error} role="alert">Account access is temporarily unavailable. Please try again later.</div>}
              {error && <div className={styles.error} role="alert">{error}</div>}
              {message && <div className={styles.success} role="status">{message}</div>}

              <label className={styles.field}>
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <button type="submit" className={`${styles.primaryButton} btn-primary`} disabled={isSubmitting || !hasSupabaseConfig()}>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>

              <p className={styles.footerText}>
                <Link to="/login" className={styles.inlineLink}>Back to login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
