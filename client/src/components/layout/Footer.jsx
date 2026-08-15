import React from 'react'
import galeolabWordmark from '../../assets/images/galeolab-wordmark.png'
import styles from '../../styles/Footer.module.css'

const FOOTER_GROUPS = [
  { title: 'Products', links: ['AI Copilot', 'CAD Workspace', 'Simulation Cloud', 'Digital Twin'] },
  { title: 'Solutions', links: ['Manufacturing', 'Automotive', 'Aerospace', 'Universities'] },
  { title: 'Research', links: ['Publications', 'White Papers', 'Benchmarks', 'Engineering Blog'] },
  { title: 'Developers', links: ['API', 'Documentation', 'SDK', 'Examples'] },
  { title: 'Company', links: ['About', 'Mission', 'Careers', 'Investors'] },
  { title: 'Support', links: ['Contact', 'Privacy', 'Terms'] },
]

const CONTACT_LINKS = [
  { label: 'galeolab@gmail.com', href: 'mailto:galeolab@gmail.com', icon: 'mail' },
  { label: '+880 1633 681482', href: 'tel:+8801633681482', icon: 'phone' },
  { label: 'WhatsApp', href: 'https://wa.me/8801633681482', icon: 'whatsapp' },
]

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/GaleoLab/', icon: 'facebook' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/galeo-lab/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/GaleoLab', icon: 'x' },
  { label: 'Instagram', href: 'https://www.instagram.com/galeolab/', icon: 'instagram' },
  { label: 'GitHub', href: 'https://github.com/galeolabx', icon: 'github' },
  { label: 'YouTube', href: 'https://www.youtube.com/@GaleoLab', icon: 'youtube' },
]

function LinkIcon({ name }) {
  const commonProps = {
    className: styles.linkIcon,
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (name) {
    case 'mail':
      return <svg {...commonProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
    case 'phone':
      return <svg {...commonProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.78 19.78 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.78 19.78 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z" /></svg>
    case 'whatsapp':
      return <svg {...commonProps}><path d="M3 21l1.4-4.72A8.7 8.7 0 1 1 7.7 19.3L3 21z" /><path d="M8.5 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c-.2.2-.2.4 0 .7.5.9 1.3 1.7 2.4 2.3.3.2.5.2.7-.1l.6-.7c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.6 0 .7-.6 1.4-1.2 1.6-.9.3-2.7 0-4.6-1.5-1.7-1.3-3.1-3.2-3.3-4.6-.1-.7.1-1.3.3-1.7z" /></svg>
    case 'facebook':
      return <svg {...commonProps}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    case 'linkedin':
      return <svg {...commonProps}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
    case 'x':
      return <svg {...commonProps}><path d="M4 4l16 16" /><path d="M20 4 4 20" /></svg>
    case 'instagram':
      return <svg {...commonProps}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><path d="M17.5 6.5h.01" /></svg>
    case 'github':
      return <svg {...commonProps}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5a10.4 10.4 0 0 0-6 0C8 2 7 2 7 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 6 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
    case 'youtube':
      return <svg {...commonProps}><path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
    default:
      return null
  }
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />

      <div className={styles.inner}>
        <div className={styles.brand}>
          <a href="/#home" className={styles.logo}>
            <img className={styles.logoImage} src={galeolabWordmark} alt="GaleoLab" />
          </a>
          <p className={styles.tagline}>
            AI engineering platform for CAD, CFD, FEA, Digital Twin, cloud simulation, optimization, and engineering intelligence.
          </p>
          <div className={styles.contact}>
            {CONTACT_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={styles.contactLink}
              >
                <LinkIcon name={link.icon} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {FOOTER_GROUPS.map(group => (
          <div className={styles.col} key={group.title}>
            <h4 className={styles.colTitle}>{group.title}</h4>
            <ul className={styles.links}>
              {group.links.map(link => (
                <li key={link}>
                  <span className={styles.link}>{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.socialRow}>
        <div className={styles.socialInner}>
          {SOCIALS.map(social => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
              <LinkIcon name={social.icon} />
              <span>{social.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copy}>&copy; {year} GaleoLab. All rights reserved.</p>
          <p className={styles.tagStrip}>Products &bull; Solutions &bull; Research &bull; Developers &bull; Company &bull; Support</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
