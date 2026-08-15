import React from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/CareerPreview.module.css'

const ROLES = [
  'Software Developer — Frontend',
  'Software Developer — Backend',
  'Mobile App Developer',
  'CFD / Simulation Engineer',
  'CAD Designer',
  'Research Assistant',
]

function CareerPreview() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section className={styles.section} id="career">
      <div className={styles.bg} />
      <div className="container">
        <div className={styles.layout}>
          <div
            className={`${styles.left} ${visible ? styles.revealed : ''}`}
            ref={ref}
          >
            <p className="section-label">Join The Team</p>
            <h2 className="section-title">
              Work on <span>real</span> engineering problems
            </h2>
            <p className={styles.desc}>
              At GaleoLab, you work on production-grade systems — not toy
              projects. Build your portfolio, learn industry tools, and grow
              in a high-performance engineering environment.
            </p>
            <div className={styles.perks}>
              {[
                'Real project experience from day one',
                'Learn industry-standard tools',
                'Build a strong professional portfolio',
                'High-performance team culture',
              ].map(perk => (
                <div key={perk} className={styles.perk}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {perk}
                </div>
              ))}
            </div>
            <Link to="/career" className="btn-primary">
              View Open Positions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </Link>
          </div>

          <div className={`${styles.right} ${visible ? styles.revealed : ''}`}>
            <p className={styles.rolesLabel}>Currently Hiring</p>
            {ROLES.map((role, i) => (
              <div
                key={role}
                className={styles.role}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className={styles.roleDot} />
                <span className={styles.roleName}>{role}</span>
                <span className={styles.status}>Open</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareerPreview