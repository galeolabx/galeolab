import React from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/PortfolioPreview.module.css'

const PROJECTS = [
  {
    cat: 'Engineering',
    title: 'Airfoil CFD Analysis',
    desc: 'Aerodynamic optimization for an industrial airfoil profile using ANSYS Fluent.',
    metric: 'Reduced drag by 22%',
    color: '#2563EB',
  },
  {
    cat: 'Software',
    title: 'SaaS Dashboard System',
    desc: 'Full-stack business management platform with real-time analytics and reporting.',
    metric: '10,000+ active users',
    color: '#00B8D9',
  },
  {
    cat: 'Research',
    title: 'Heat Transfer Simulation',
    desc: 'Thermal analysis and optimization for industrial heat exchanger design.',
    metric: '18% efficiency gain',
    color: '#2563EB',
  },
]

function PortfolioPreview() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section className={styles.section} id="portfolio">
      <div className="container">
        <div className={`${styles.head} ${visible ? styles.revealed : ''}`} ref={ref}>
          <p className="section-label">Featured Work</p>
          <div className={styles.headRow}>
            <h2 className="section-title">
              Selected <span>Projects</span>
            </h2>
            <Link to="/portfolio" className="btn-outline">
              View All Projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </Link>
          </div>
          <p className={styles.subtitle}>
            Real-world solutions across engineering simulation and software development.
          </p>
        </div>

        <div className={styles.grid}>
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className={styles.visual}>
                <svg viewBox="0 0 320 180" fill="none" className={styles.svg}>
                  {p.cat === 'Software' ? (
                    <>
                      <rect x="24" y="20" width="272" height="140" rx="8"
                        fill="var(--color-bg-secondary)" stroke="#C7D3E0" strokeWidth="1"/>
                      <rect x="36" y="34" width="248" height="12" rx="4"
                        fill={p.color} opacity="0.2"/>
                      <rect x="36" y="54" width="160" height="8" rx="3"
                        fill={p.color} opacity="0.12"/>
                      <rect x="36" y="70" width="200" height="8" rx="3"
                        fill={p.color} opacity="0.1"/>
                      <rect x="36" y="92" width="108" height="44" rx="6"
                        fill={p.color} opacity="0.15" stroke={p.color}
                        strokeWidth="1" strokeOpacity="0.4"/>
                      <rect x="152" y="92" width="132" height="44" rx="6"
                        fill={p.color} opacity="0.07"/>
                      <text x="60" y="118" fontSize="10" fill={p.color}
                        fontFamily="Inter" fontWeight="600" opacity="0.8">
                        Analytics
                      </text>
                    </>
                  ) : (
                    <>
                      <rect x="0" y="0" width="320" height="180" fill="var(--color-bg-secondary)"/>
                      <path d="M24,90 Q80,40 160,78 Q230,110 296,90"
                        stroke={p.color} strokeWidth="2.5" fill="none" opacity="0.9"/>
                      <path d="M24,100 Q80,50 160,88 Q230,120 296,100"
                        stroke={p.color} strokeWidth="1.5" fill="none" opacity="0.55"/>
                      <path d="M24,80 Q80,30 160,68 Q230,100 296,80"
                        stroke={p.color} strokeWidth="1" fill="none" opacity="0.35"/>
                      <ellipse cx="160" cy="84" rx="36" ry="22"
                        fill={p.color} fillOpacity="0.08"
                        stroke={p.color} strokeWidth="1" strokeOpacity="0.4"/>
                      <circle cx="160" cy="84" r="7"
                        fill={p.color} fillOpacity="0.5"/>
                      <circle cx="160" cy="84" r="3" fill={p.color}/>
                    </>
                  )}
                </svg>
              </div>
              <div className={styles.info}>
                <span className={styles.cat}>{p.cat}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.metric}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                    <polyline points="16 7 22 7 22 13"/>
                  </svg>
                  {p.metric}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PortfolioPreview