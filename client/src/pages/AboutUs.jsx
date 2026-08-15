import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/AboutUs.module.css'

function useReveal(t = 0.1) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect() } }, { threshold: t }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [t])
  return [ref, on]
}

const TEAM = [
  { role: 'Founder & CEO',               dept: 'Leadership',     init: 'F', c: '#1565c0' },
  { role: 'Head of Engineering',          dept: 'Simulation',     init: 'E', c: '#1e88e5' },
  { role: 'Head of Software',            dept: 'Development',    init: 'S', c: '#0d47a1' },
  { role: 'Research & Innovation Lead',   dept: 'R&D',            init: 'R', c: '#1565c0' },
  { role: 'Operations Lead',             dept: 'Community',      init: 'O', c: '#1976d2' },
]

const TECH = [
  { icon:'🌊', role:'CFD & Simulation Engineers' },
  { icon:'🖥️', role:'Frontend Developers' },
  { icon:'⚙️', role:'Backend Developers' },
  { icon:'📱', role:'Mobile App Developers' },
  { icon:'📐', role:'CAD Designers' },
  { icon:'🔬', role:'Research Assistants' },
]

const VALUES = [
  { icon:'🎯', title:'Precision',       desc:'Engineering accuracy in every deliverable — no guesswork, only verified results.' },
  { icon:'🔬', title:'Research-Driven', desc:'Every solution is grounded in engineering science and peer-validated methods.' },
  { icon:'🚀', title:'Scalability',     desc:'We build for growth. Systems designed to scale from day one.' },
  { icon:'🤝', title:'Collaboration',   desc:'We treat every client as a long-term partner, not a ticket number.' },
]

const MILESTONES = [
  { yr:'2022', title:'Founded',           desc:'Started as an engineering simulation consultancy in Dhaka.' },
  { yr:'2023', title:'Software Division', desc:'Expanded into full-stack web and mobile development.' },
  { yr:'2024', title:'50+ Projects',      desc:'Crossed 50 real-world projects across simulation and software.' },
  { yr:'2025', title:'Nationwide Network',desc:'Launched campus ambassador program across Bangladesh.' },
  { yr:'2026', title:'Going Global',      desc:'Expanding to serve international clients and research institutions.' },
]

export default function AboutUs() {
  const [heroRef, heroOn]       = useReveal(0.05)
  const [msnRef, msnOn]         = useReveal(0.1)
  const [teamRef, teamOn]       = useReveal(0.08)
  const [tlRef, tlOn]           = useReveal(0.08)
  const [valRef, valOn]         = useReveal(0.08)

  return (
    <div className={styles.page}>

      {/* ─── HERO ─── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg}/>
        <div className={styles.heroGrid}/>
        <div className={`container ${styles.heroInner} ${heroOn ? styles.on : ''}`}>
          <p className={styles.label}>Who We Are</p>
          <h1 className={styles.heroTitle}>
            Engineering Meets <span>Innovation</span>
          </h1>
          <p className={styles.heroSub}>
            A multidisciplinary engineering and software solutions company — building real-world systems for startups, researchers, and industries worldwide.
          </p>
          <div className={styles.heroStats}>
            {[{n:'50+',l:'Projects'},{n:'10+',l:'Domains'},{n:'3+',l:'Years'},{n:'100+',l:'Community'}].map(s => (
              <div key={s.l} className={styles.hStat}>
                <span className={styles.hStatN}>{s.n}</span>
                <span className={styles.hStatL}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section className={styles.mission} ref={msnRef}>
        <div className="container">
          <div className={styles.msnLayout}>
            <div className={`${styles.msnLeft} ${msnOn ? styles.on : ''}`}>
              <p className={styles.label}>Our Mission</p>
              <h2 className={styles.secTitle}>Bridging Engineering,<br/>Technology & <span>Innovation</span></h2>
              <p className={styles.bodyText}>
                GaleoLab exists to bridge the gap between engineering science and software technology. The most powerful solutions come from teams that understand both physical laws and the software systems that solve them.
              </p>
              <p className={styles.bodyText}>
                Our mission is to deliver industry-grade services while building a strong, collaborative engineering ecosystem across Bangladesh and beyond.
              </p>
              <Link to="/services" className="btn-blue">Explore Our Services</Link>
            </div>

            <div className={`${styles.msnRight} ${msnOn ? styles.on : ''}`}>
              {[
                { icon:'🌊', title:'Engineering Simulation', desc:'CFD, FEA, and advanced analysis with industry tools.' },
                { icon:'💻', title:'Software Systems',       desc:'Scalable full-stack apps, SaaS and mobile apps.' },
                { icon:'🔬', title:'Research & Innovation',  desc:'Academic-industry collaboration and R&D projects.' },
              ].map(c => (
                <div key={c.title} className={styles.msnCard}>
                  <div className={styles.msnCardIcon}>{c.icon}</div>
                  <div>
                    <h4 className={styles.msnCardTitle}>{c.title}</h4>
                    <p className={styles.msnCardDesc}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className={styles.team} ref={teamRef}>
        <div className={styles.teamBg}/>
        <div className="container">
          <div className={`${styles.secHead} ${teamOn ? styles.on : ''}`}>
            <p className={styles.label}>The People</p>
            <h2 className={styles.secTitle}>Core <span>Leadership</span></h2>
          </div>

          <div className={styles.coreGrid}>
            {TEAM.map((m,i) => (
              <div key={i} className={`${styles.coreCard} ${teamOn ? styles.on : ''}`}
                style={{ animationDelay:`${i*0.09}s` }}>
                <div className={styles.avatar} style={{ background:`linear-gradient(135deg,${m.c},${m.c}88)` }}>
                  {m.init}
                </div>
                <p className={styles.memberRole}>{m.role}</p>
                <p className={styles.memberDept}>{m.dept}</p>
              </div>
            ))}
          </div>

          <div className={styles.techSection}>
            <p className={styles.groupLabel}>Technical Team</p>
            <div className={styles.techGrid}>
              {TECH.map((t,i) => (
                <div key={i} className={`${styles.techCard} ${teamOn ? styles.on : ''}`}
                  style={{ animationDelay:`${0.5+i*0.07}s` }}>
                  <span>{t.icon}</span>
                  <span>{t.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.extSection}>
            <p className={styles.groupLabel}>Extended Network</p>
            <div className={styles.extRow}>
              {['Campus Ambassadors (Nationwide)', 'Industry Mentors', 'Research Assistants'].map(n => (
                <div key={n} className={styles.extChip}>
                  <span className={styles.extDot}/>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className={styles.timeline} ref={tlRef}>
        <div className="container">
          <div className={`${styles.secHead} ${tlOn ? styles.on : ''}`}>
            <p className={styles.label}>Our Journey</p>
            <h2 className={styles.secTitle}>Building the <span>Future</span> Step by Step</h2>
          </div>

          <div className={styles.tlTrack}>
            {MILESTONES.map((m,i) => (
              <div key={i} className={`${styles.tlItem} ${tlOn ? styles.on : ''}`}
                style={{ animationDelay:`${i*0.12}s` }}>
                <div className={styles.tlYear}>{m.yr}</div>
                <div className={styles.tlDot}/>
                <div className={styles.tlCard}>
                  <h4 className={styles.tlTitle}>{m.title}</h4>
                  <p className={styles.tlDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className={styles.values} ref={valRef}>
        <div className={styles.valBg}/>
        <div className="container">
          <div className={`${styles.secHead} ${valOn ? styles.on : ''}`}>
            <p className={styles.labelWhite}>Our Values</p>
            <h2 className={styles.secTitleWhite}>What Drives <span>Everything</span> We Do</h2>
          </div>
          <div className={styles.valGrid}>
            {VALUES.map((v,i) => (
              <div key={i} className={`${styles.valCard} ${valOn ? styles.on : ''}`}
                style={{ animationDelay:`${i*0.1}s` }}>
                <div className={styles.valIcon}>{v.icon}</div>
                <h3 className={styles.valTitle}>{v.title}</h3>
                <p className={styles.valDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to Build Something <span>Extraordinary?</span></h2>
            <p className={styles.ctaDesc}>Let's solve your hardest engineering and software problems together.</p>
            <div className={styles.ctaBtns}>
              <Link to="/#contact" className="btn-blue">Start a Project</Link>
              <Link to="/services" className="btn-outline">View Services</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}