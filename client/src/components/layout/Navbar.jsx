import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import galeolabWordmark from '../../assets/images/galeolab-wordmark.png'
import styles from '../../styles/Navbar.module.css'

const NAV_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Solutions', id: 'solutions' },
  { label: 'Technology', id: 'technology' },
  { label: 'Research', id: 'research' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Developers', id: 'developers' },
  { label: 'Company', id: 'company' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const scrollToSection = (event, id) => {
    event.preventDefault()
    setMenuOpen(false)
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="GaleoLab home">
          <img className={styles.logoImage} src={galeolabWordmark} alt="GaleoLab" />
        </Link>

        <ul className={styles.navLinks}>
          {NAV_LINKS.map(link => (
            <li key={link.id}>
              <a
                href={`/#${link.id}`}
                className={styles.navLink}
                onClick={event => scrollToSection(event, link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <a href="/#contact" className={styles.hireCta} onClick={event => scrollToSection(event, 'contact')}>
          Request Demo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </a>

        <button
          className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        {NAV_LINKS.map(link => (
          <a
            key={link.id}
            href={`/#${link.id}`}
            className={styles.mobileLink}
            onClick={event => scrollToSection(event, link.id)}
          >
            {link.label}
          </a>
        ))}
        <div className={styles.mobileThemeRow}>
          <span>Dark mode</span>
          <button
            className={`${styles.mobileThemeSwitch} ${theme === 'dark' ? styles.mobileThemeOn : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className={styles.mobileThemeKnob} />
          </button>
        </div>
        <a href="/#contact" className={styles.mobileCta}
          onClick={event => scrollToSection(event, 'contact')}>
          Request Demo
        </a>
      </div>

      <div className={styles.navDivider} key={`div-${location.pathname}`} />
    </nav>
  )
}

export default Navbar
