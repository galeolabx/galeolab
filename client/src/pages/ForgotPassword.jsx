import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Auth.module.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      setIsSubmitting(true)
      const result = await resetPassword({ email, password: newPassword || 'temporary-password' })

      if (result.sent) {
        setMessage('A password reset email has been sent. Please check your inbox and follow the link to continue.')
      } else {
        setMessage('A local demo account password was updated. You can now sign in with the new password.')
      }

      setEmail('')
      setNewPassword('')
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
            <p className={styles.subtitle}>Enter your email and set a new password to regain access to your workspace.</p>
          </div>

          <div className={styles.formPanel}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2>Forgot password</h2>

              {error && <div className={styles.error}>{error}</div>}
              {message && <div className={styles.success}>{message}</div>}

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

              <label className={styles.field}>
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Create a new password"
                  minLength={6}
                />
              </label>

              <button type="submit" className={`${styles.primaryButton} btn-primary`} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Reset password'}
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
