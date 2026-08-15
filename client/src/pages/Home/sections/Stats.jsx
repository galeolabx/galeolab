import React from 'react'
import { useCounter } from '../../../hooks/useCounter'
import styles from '../../../styles/Stats.module.css'

const STATS = [
  { target: 50,  suffix: '+', label: 'Projects Completed' },
  { target: 10,  suffix: '+', label: 'Simulation Domains' },
  { target: 3,   suffix: '+', label: 'Years Experience' },
  { target: 100, suffix: '+', label: 'Community Members' },
]

function StatItem({ target, suffix, label }) {
  const [ref, count] = useCounter(target)
  return (
    <div className={styles.item} ref={ref}>
      <span className={styles.num}>{count}{suffix}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

function Stats() {
  return (
    <div className={styles.stats}>
      <div className={styles.topLine} />
      <div className={`container ${styles.grid}`}>
        {STATS.map(s => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
      <div className={styles.bottomLine} />
    </div>
  )
}

export default Stats