import React, { useState } from 'react'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/Contact.module.css'

const PROJECT_TYPES = [
  { value: '', label: 'Select project type' },
  { value: 'engineering', label: 'Engineering Simulation' },
  { value: 'software', label: 'Software Development' },
  { value: 'mobile', label: 'Mobile Application' },
  { value: 'cad', label: 'CAD / Product Design' },
  { value: 'research', label: 'Research & R&D' },
  { value: 'other', label: 'Other' },
]

const INITIAL_FORM = {
  name: '', email: '', phone: '', projectType: '', message: '',
}

function Contact() {
  const [ref, visible] = useReveal(0.08)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      const data = await res.json()
      if (data.success) {
        setStatus('sent')
        setTimeout(() => { setStatus(null); setForm(INITIAL_FORM) }, 4000)
      } else {
        setStatus('error')
        setErrorMsg(data.message || 'Something went wrong. Please try again.')
        setTimeout(() => setStatus(null), 5000)
      }
    } catch {
      setStatus('error')
      setErrorMsg('Could not reach server. Please email us directly.')
      setTimeout(() => setStatus(null), 5000)
    }
  }

  return (
    <section className={styles.section} id="contact">
      <div className={styles.bg} />
      <div className="container">
        <div
          className={`${styles.head} ${visible ? styles.revealed : ''}`}
          ref={ref}
        >
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">
            Let's build something <span>together</span>
          </h2>
          <p className={styles.subtitle}>
            Ready to solve a hard engineering or software problem?
            We would love to hear about your project.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={`${styles.left} ${visible ? styles.revealed : ''}`}>
            <div className={styles.infoBlock}>
              {[
                {
                  label: 'Email',
                  value: 'galeolab@gmail.com',
                  href: 'mailto:galeolab@gmail.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                },
                {
                  label: 'Phone',
                  value: '+880 1633 681482',
                  href: 'tel:+8801633681482',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.07 6.07l.96-1.17a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Website',
                  value: 'www.galeolab.com',
                  href: 'https://www.galeolab.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Location',
                  value: 'Dhaka, Bangladesh',
                  href: null,
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                },
              ].map(c => (
                <div key={c.label} className={styles.infoItem}>
                  <div className={styles.infoIcon}>{c.icon}</div>
                  <div>
                    <p className={styles.infoLabel}>{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className={styles.infoValue}>
                        {c.value}
                      </a>
                    ) : (
                      <p className={styles.infoValue}>{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.mapWrap}>
              <iframe
                title="GaleoLab Location — Dhaka, Bangladesh"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.36712820164!2d90.27923950157463!3d23.780573016122356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1714041234567"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className={`${styles.formWrap} ${visible ? styles.revealed : ''}`}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+880 XXXX XXXXXX"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Project Type *</label>
                  <select
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  >
                    {PROJECT_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Tell us about your project — scope, timeline, goals..."
                  required
                />
              </div>
              {status === 'error' && (
                <p className={styles.errorMsg}>{errorMsg}</p>
              )}
              <button
                type="submit"
                className={`btn-primary ${styles.submitBtn}`}
                disabled={status === 'sending' || status === 'sent'}
              >
                {status === 'sending' && (
                  <><div className={styles.spinner} /> Sending...</>
                )}
                {status === 'sent' && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Message Sent
                  </>
                )}
                {(status === null || status === 'error') && (
                  <>
                    Send Message
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
