import React from 'react'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/WhyUs.module.css'

const REASONS = [
  {
    title: 'Engineering + Software Combined',
    desc: 'Rare hybrid team that understands both simulation physics and production software engineering.',
  },
  {
    title: 'Real Simulation Expertise',
    desc: 'Our engineers run production-level ANSYS, OpenFOAM, and more — not theoretical knowledge.',
  },
  {
    title: 'Startup to Industry Scale',
    desc: 'We build systems that grow with you, from MVP prototypes to enterprise-grade architecture.',
  },
  {
    title: 'Research-Driven Approach',
    desc: 'Every solution is backed by rigorous engineering research and peer-validated methods.',
  },
  {
    title: 'Scalable Architecture',
    desc: 'Systems designed for performance, maintainability, and long-term growth from day one.',
  },
  {
    title: 'Nationwide Community',
    desc: 'Campus ambassadors and engineers across Bangladesh supporting every project we deliver.',
  },
]

function WhyUs() {
  const [ref, visible] = useReveal(0.08)

  return (
    <section className={styles.section} id="why">
      <div className="container">
        <div
          className={`${styles.head} ${visible ? styles.revealed : ''}`}
          ref={ref}
        >
          <p className="section-label">Why Choose Us</p>
          <h2 className="section-title">
            The <span>GaleoLab</span> Difference
          </h2>
          <p className={styles.subtitle}>
            What sets us apart from a typical software agency or
            a standard engineering consultancy.
          </p>
        </div>

        <div className={styles.grid}>
          {REASONS.map((r, i) => (
            <div
              key={i}
              className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className={styles.num}>0{i + 1}</span>
              <h3 className={styles.title}>{r.title}</h3>
              <p className={styles.desc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs