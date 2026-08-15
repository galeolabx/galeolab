import { Link } from 'react-router-dom'
import styles from '../styles/NotFound.module.css'

export default function NotFound() {
  return (
    <div className="page">
      <div className={`${styles.wrapper} container`}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.body}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={styles.btn}>← Back to Home</Link>
      </div>
    </div>
  )
}
