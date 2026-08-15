import React from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/ServicesPreview.module.css'

const SERVICES = [
  {
    id: '01',
    title: 'Engineering Simulation',
    desc: 'CFD aerodynamics, FEA structural analysis, thermal simulation, and advanced optimization for real-world engineering problems.',
    tags: ['CFD', 'FEA', 'Thermal', 'ANSYS'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: '02',
    title: 'Software Development',
    desc: 'Full-stack web applications, SaaS platforms, and admin dashboards — built with scalable architecture and modern stacks.',
    tags: ['React', 'Node.js', 'SaaS', 'Full-stack'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: '03',
    title: 'Mobile Applications',
    desc: 'iOS and Android applications with cross-platform development — from MVP to production-ready deployment.',
    tags: ['iOS', 'Android', 'Flutter', 'React Native'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5"/>
      </svg>
    ),
  },
]

function ServicesPreview() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section className={styles.section} id="services">
      <div className={styles.bg} />
      <div className="container">
        <div className={`${styles.head} ${visible ? styles.revealed : ''}`} ref={ref}>
          <p className="section-label">What We Do</p>
          <div className={styles.headRow}>
            <h2 className="section-title">
              End-to-end Engineering<br />& <span>Software Solutions</span>
            </h2>
            <Link to="/services" className="btn-outline">
              View All Services
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </Link>
          </div>
          <p className={styles.subtitle}>
            Six specialized service areas. One expert team.
            Full delivery from concept to production.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.icon}>{s.icon}</div>
                <span className={styles.num}>{s.id}</span>
              </div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
              <div className={styles.tags}>
                {s.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              <div className={styles.cardArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesPreview