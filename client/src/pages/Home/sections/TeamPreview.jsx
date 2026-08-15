import React from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/TeamPreview.module.css'

const TEAM = [
  { role: 'Founder & CEO', dept: 'Leadership & Vision', initial: 'F' },
  { role: 'Head of Engineering', dept: 'CFD / Simulation', initial: 'E' },
  { role: 'Head of Software', dept: 'Full-stack Development', initial: 'S' },
  { role: 'Research & Innovation Lead', dept: 'R&D / Academic', initial: 'R' },
  { role: 'Operations Lead', dept: 'Community & Operations', initial: 'O' },
]

function TeamPreview() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section className={styles.section} id="team">
      <div className={styles.bg} />
      <div className="container">
        <div className={styles.layout}>
          <div
            className={`${styles.left} ${visible ? styles.revealed : ''}`}
            ref={ref}
          >
            <p className="section-label">Who We Are</p>
            <h2 className="section-title">
              A hybrid team built for<br />
              <span>complex problems</span>
            </h2>
            <p className={styles.desc}>
              GaleoLab is a multidisciplinary engineering and software solutions
              company. We specialize in engineering simulation, product design,
              and software development — helping individuals, startups, and
              organizations turn ideas into real-world solutions.
            </p>
            <p className={styles.desc}>
              Our mission is to bridge the gap between engineering, technology,
              and innovation by delivering industry-grade services while building
              a strong, collaborative engineering ecosystem.
            </p>
            <Link to="/about" className="btn-primary">
              Meet The Full Team
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </Link>
          </div>

          <div className={`${styles.right} ${visible ? styles.revealed : ''}`}>
            <p className={styles.groupLabel}>Core Leadership</p>
            {TEAM.map((m, i) => (
              <div
                key={i}
                className={styles.member}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={styles.avatar}>{m.initial}</div>
                <div className={styles.memberInfo}>
                  <p className={styles.role}>{m.role}</p>
                  <p className={styles.dept}>{m.dept}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={styles.memberArrow}>
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </div>
            ))}
            <div className={styles.network}>
              <p className={styles.networkLabel}>Extended Network</p>
              <div className={styles.networkTags}>
                {[
                  'CFD & Simulation Engineers',
                  'Frontend Developers',
                  'Backend Developers',
                  'Mobile App Developers',
                  'CAD Designers',
                  'Campus Ambassadors',
                  'Industry Mentors',
                ].map(n => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamPreview