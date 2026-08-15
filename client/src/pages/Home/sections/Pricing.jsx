import React from 'react'
import { useReveal } from '../../../hooks/useReveal'
import styles from '../../../styles/Pricing.module.css'

const PLANS = [
  {
    tier: 'Basic',
    price: '৳3,000 – ৳15,000',
    desc: 'Perfect for startups and small projects needing quick delivery.',
    features: [
      'Simple CAD or Simulation',
      'Basic Web Application',
      'Mobile App MVP',
      '1 Revision Round',
      'Email Support',
    ],
    highlight: false,
    cta: 'Start Project',
  },
  {
    tier: 'Professional',
    price: '৳15,000 – ৳50,000',
    desc: 'Full-featured solutions for growing businesses and complex engineering needs.',
    features: [
      'Full CFD or FEA Simulation',
      'SaaS or Full-stack Application',
      'Cloud Deployment',
      '3 Revision Rounds',
      'Priority Support',
      'Technical Documentation',
    ],
    highlight: true,
    cta: 'Start Project',
  },
  {
    tier: 'Enterprise',
    price: 'Custom Pricing',
    desc: 'Large-scale systems, long-term R&D projects, and startup product development.',
    features: [
      'Custom System Architecture',
      'Long-term R&D Engagement',
      'Dedicated Team Assignment',
      'Unlimited Revisions',
      '24/7 Support',
      'SLA Agreement',
    ],
    highlight: false,
    cta: 'Contact Us',
  },
]

function Pricing() {
  const [ref, visible] = useReveal(0.08)

  const scrollToContact = (e) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.bg} />
      <div className="container">
        <div
          className={`${styles.head} ${visible ? styles.revealed : ''}`}
          ref={ref}
        >
          <p className="section-label">Pricing</p>
          <h2 className="section-title">
            Transparent <span>Pricing</span>
          </h2>
          <p className={styles.subtitle}>
            Fixed-price tiers with clear deliverables.
            Custom scoping available for enterprise projects.
          </p>
        </div>

        <div className={styles.grid}>
          {PLANS.map((p, i) => (
            <div
              key={p.tier}
              className={`${styles.card} ${p.highlight ? styles.highlight : ''} ${visible ? styles.cardVisible : ''}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {p.highlight && (
                <div className={styles.badge}>Most Popular</div>
              )}
              <p className={styles.tier}>{p.tier}</p>
              <p className={styles.price}>{p.price}</p>
              <p className={styles.desc}>{p.desc}</p>
              <ul className={styles.features}>
                {p.features.map(f => (
                  <li key={f}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              
               <a href="#contact"
                onClick={scrollToContact}
                className={p.highlight ? 'btn-primary' : 'btn-outline'}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: 'auto',
                }}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing