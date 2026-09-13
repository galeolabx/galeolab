import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from '../../styles/BaseLayout.module.css'

function BaseLayout() {
  const { pathname, hash } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default BaseLayout