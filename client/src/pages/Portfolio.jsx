import React from 'react'
import styles from '../styles/Portfolio.module.css'

function Portfolio() {
  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className="section-label">Our Work</p>
        <h1 className="section-title">
          Full <span>Portfolio</span>
        </h1>
        <p className={styles.desc}>
          Complete project showcase coming soon. In the meantime,
          view our selected work on the home page.
        </p>
      </div>
    </div>
  )
}

export default Portfolio