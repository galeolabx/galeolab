import React from 'react'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Dashboard.module.css'

const stats = [
  { label: 'Active projects', value: '08', accent: 'blue' },
  { label: 'Team members', value: '24', accent: 'green' },
  { label: 'Research tasks', value: '16', accent: 'purple' },
  { label: 'Delivery health', value: '96%', accent: 'gold' },
]

const projects = [
  { name: 'AI Workflow Lab', status: 'In review', owner: 'Product team', deadline: 'Sep 18' },
  { name: 'Predictive Ops', status: 'On track', owner: 'Operations', deadline: 'Sep 24' },
  { name: 'Secure Data Layer', status: 'Blocked', owner: 'Platform', deadline: 'Sep 29' },
]

const activities = [
  'Strategy sync completed with the research pod.',
  'Client feedback incorporated into the onboarding MVP.',
  'Security approval for the staging environment is pending.',
]

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="section-label">Workspace</span>
            <h1>Welcome back, {user?.fullName || user?.email || 'there'}.</h1>
          </div>
          <button type="button" className={`${styles.primaryButton} btn-primary`}>
            New project
          </button>
        </div>

        <section className={styles.grid}>
          {stats.map((stat) => (
            <article key={stat.label} className={`${styles.card} ${styles[stat.accent]}`}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.cardPanel}>
            <div className={styles.panelHeader}>
              <h2>Current projects</h2>
              <a href="#">View all</a>
            </div>

            <div className={styles.list}>
              {projects.map((project) => (
                <div key={project.name} className={styles.projectRow}>
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.owner}</p>
                  </div>
                  <div className={styles.meta}>
                    <span className={`${styles.status} ${styles[project.status.toLowerCase().replace(/\s+/g, '')]}`}>
                      {project.status}
                    </span>
                    <small>{project.deadline}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.cardPanel}>
            <div className={styles.panelHeader}>
              <h2>Team activity</h2>
              <a href="#">Refresh</a>
            </div>

            <ul className={styles.activityList}>
              {activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
