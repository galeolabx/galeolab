import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../../styles/Hero.module.css'

const TAGS = ['CFD', 'FEA', 'SaaS', 'Simulation', 'Full-stack', 'Mobile', 'R&D']

function Hero() {
  const contentRef = useRef(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    setTimeout(() => el.classList.add(styles.visible), 80)
  }, [])

  const scrollToContact = (e) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero}>
      <div className={styles.bgPattern} />
      <div className={styles.bgGlow} />

      <div className={`container ${styles.inner}`} ref={contentRef}>
        <p className={styles.eyebrow}>Engineering A Better Future</p>

        <h1 className={styles.title}>
          We engineer solutions that drive{' '}
          <span className={styles.accent}>real-world progress.</span>
        </h1>

        <p className={styles.desc}>
          GaleoLab partners with startups, researchers, and industries
          to design, build, and scale high-performance engineering
          simulation and software systems — from concept to deployment.
        </p>

        <div className={styles.ctas}>
          <a href="#contact" className="btn-primary" onClick={scrollToContact}>
            Start a Project
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
          <Link to="/portfolio" className="btn-outline">
            View Our Work
          </Link>
        </div>

        <div className={styles.tags}>
          {TAGS.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero