import React from 'react'
import styles from '../styles/Career.module.css'

function Career() {
  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className="section-label">Join The Team</p>
        <h1 className="section-title">
          Open <span>Positions</span>
        </h1>
        <p className={styles.desc}>
          Full career page coming soon. To apply now, email your CV
          and portfolio to{' '}
          <a href="mailto:galeolab@gmail.com">galeolab@gmail.com</a>.
        </p>
      </div>
    </div>
  )
}

export default Career
