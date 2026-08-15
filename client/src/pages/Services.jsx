import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Services.module.css'

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

/* ── Service Data ── */
const ALL_SERVICES = [
  {
    id: 'sim',
    icon: '🌊',
    color: '#1565c0',
    colorSoft: '#deeafb',
    title: 'Engineering Simulation',
    subtitle: 'CFD · FEA · Thermal · Optimization',
    desc: 'We run production-level aerodynamic, fluid-flow, structural, and thermal simulations using ANSYS, OpenFOAM, and SolidWorks Simulation. From airfoil analysis to heat exchanger optimization.',
    tools: ['ANSYS Fluent', 'OpenFOAM', 'ANSYS Mechanical', 'SolidWorks Sim'],
    outcomes: ['Reduce drag by 15–30%', 'Validate structural designs', 'Thermal management optimization', 'Mesh convergence reports'],
    visual: (
      <svg viewBox="0 0 280 140" fill="none" style={{width:'100%',height:'auto'}}>
        <defs>
          <linearGradient id="s1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1565c0" stopOpacity="0"/>
            <stop offset="50%" stopColor="#1e88e5" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#1565c0" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="rH"><stop offset="0%" stopColor="#ef5350" stopOpacity="0.4"/><stop offset="100%" stopColor="#ef5350" stopOpacity="0"/></radialGradient>
          <radialGradient id="rL"><stop offset="0%" stopColor="#1e88e5" stopOpacity="0.35"/><stop offset="100%" stopColor="#1e88e5" stopOpacity="0"/></radialGradient>
        </defs>
        {[22,35,48,62,75,90,104,116,128].map((y,i)=>(
          <path key={i} d={`M6,${y} Q70,${y+(i<4?-20+i*5:i>5?18-(i-5)*5:0)} 274,${y}`}
            stroke="url(#s1)" strokeWidth={i===4?2:1.2} fill="none"/>
        ))}
        <path d="M38,70 Q85,35 185,68 Q220,72 232,72 Q220,75 185,78 Q85,105 38,70Z"
          fill="rgba(21,101,192,0.06)" stroke="rgba(21,101,192,0.4)" strokeWidth="1.3"/>
        <ellipse cx="95" cy="70" rx="26" ry="16" fill="url(#rH)"/>
        <ellipse cx="180" cy="70" rx="20" ry="13" fill="url(#rL)"/>
      </svg>
    ),
  },
  {
    id: 'web',
    icon: '💻',
    color: '#0d47a1',
    colorSoft: '#e3f0fd',
    title: 'Software Development',
    subtitle: 'React · Node.js · SaaS · Full-stack',
    desc: 'We build production-grade web applications, SaaS platforms, and admin dashboards. Clean architecture, responsive UIs, and backend APIs that scale to millions of users.',
    tools: ['React / Next.js', 'Node.js / Express', 'PostgreSQL / MongoDB', 'AWS / Vercel'],
    outcomes: ['Scalable SaaS architecture', 'RESTful & GraphQL APIs', 'Real-time dashboards', 'CI/CD pipelines'],
    visual: (
      <svg viewBox="0 0 280 140" fill="none" style={{width:'100%',height:'auto'}}>
        <rect x="10" y="12" width="260" height="116" rx="10" fill="rgba(21,101,192,0.04)" stroke="rgba(21,101,192,0.2)" strokeWidth="1"/>
        <rect x="20" y="22" width="240" height="16" rx="4" fill="rgba(21,101,192,0.15)"/>
        <rect x="20" y="46" width="150" height="8" rx="3" fill="rgba(21,101,192,0.1)"/>
        <rect x="20" y="60" width="180" height="8" rx="3" fill="rgba(21,101,192,0.08)"/>
        <rect x="20" y="74" width="130" height="8" rx="3" fill="rgba(21,101,192,0.08)"/>
        <rect x="20" y="94" width="90" height="28" rx="6" fill="rgba(21,101,192,0.18)" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        <rect x="120" y="94" width="80" height="28" rx="6" fill="rgba(21,101,192,0.08)" stroke="rgba(21,101,192,0.2)" strokeWidth="1"/>
        <rect x="210" y="94" width="50" height="28" rx="6" fill="rgba(21,101,192,0.06)" stroke="rgba(21,101,192,0.15)" strokeWidth="1"/>
        <circle cx="248" cy="30" r="4" fill="rgba(21,101,192,0.4)"/>
        <circle cx="234" cy="30" r="4" fill="rgba(21,101,192,0.25)"/>
      </svg>
    ),
  },
  {
    id: 'mobile',
    icon: '📱',
    color: '#1565c0',
    colorSoft: '#deeafb',
    title: 'Mobile Applications',
    subtitle: 'iOS · Android · Flutter · React Native',
    desc: 'Cross-platform mobile apps with native-feel performance. From MVP to Play Store/App Store deployment. We handle UI design, backend integration, and push notifications.',
    tools: ['Flutter', 'React Native', 'Firebase', 'REST APIs'],
    outcomes: ['iOS & Android from one codebase', 'Offline-first architecture', 'Push notification systems', 'App store deployment'],
    visual: (
      <svg viewBox="0 0 280 140" fill="none" style={{width:'100%',height:'auto'}}>
        <rect x="95" y="8" width="90" height="124" rx="14" fill="rgba(21,101,192,0.05)" stroke="rgba(21,101,192,0.3)" strokeWidth="1.2"/>
        <rect x="103" y="20" width="74" height="100" rx="7" fill="rgba(21,101,192,0.08)"/>
        <rect x="108" y="28" width="64" height="10" rx="3" fill="rgba(21,101,192,0.25)"/>
        <rect x="108" y="44" width="42" height="7" rx="2" fill="rgba(21,101,192,0.15)"/>
        <rect x="108" y="56" width="56" height="7" rx="2" fill="rgba(21,101,192,0.1)"/>
        <rect x="108" y="68" width="35" height="7" rx="2" fill="rgba(21,101,192,0.1)"/>
        <rect x="108" y="84" width="64" height="22" rx="6" fill="rgba(21,101,192,0.2)" stroke="rgba(21,101,192,0.35)" strokeWidth="1"/>
        <circle cx="140" cy="118" r="4" fill="rgba(21,101,192,0.3)"/>
        <rect x="20" y="40" width="62" height="60" rx="8" fill="#fff" stroke="rgba(21,101,192,0.15)" strokeWidth="1" filter="url(#fshadow)"/>
        <rect x="28" y="50" width="46" height="8" rx="3" fill="rgba(21,101,192,0.12)"/>
        <rect x="28" y="62" width="38" height="6" rx="2" fill="rgba(21,101,192,0.08)"/>
        <rect x="28" y="72" width="42" height="6" rx="2" fill="rgba(21,101,192,0.08)"/>
        <rect x="198" y="40" width="62" height="60" rx="8" fill="#fff" stroke="rgba(21,101,192,0.15)" strokeWidth="1"/>
        <rect x="206" y="50" width="46" height="8" rx="3" fill="rgba(21,101,192,0.12)"/>
        <rect x="206" y="62" width="38" height="6" rx="2" fill="rgba(21,101,192,0.08)"/>
        <rect x="206" y="72" width="42" height="6" rx="2" fill="rgba(21,101,192,0.08)"/>
      </svg>
    ),
  },
  {
    id: 'backend',
    icon: '⚙️',
    color: '#0d47a1',
    colorSoft: '#e3f0fd',
    title: 'Backend & Systems',
    subtitle: 'APIs · Cloud · Microservices · Scalable',
    desc: 'Robust REST/GraphQL API development, cloud-based architecture on AWS/GCP, microservices design, and scalable system architecture for high-traffic production environments.',
    tools: ['Node.js / Express', 'PostgreSQL / Redis', 'Docker / Kubernetes', 'AWS / GCP'],
    outcomes: ['10k+ req/sec throughput', 'Sub-100ms API latency', 'Auto-scaling infra', '99.9% uptime SLA'],
    visual: (
      <svg viewBox="0 0 280 140" fill="none" style={{width:'100%',height:'auto'}}>
        {[[60,30,80,18],[160,30,80,18],[110,72,80,18],[60,110,80,18],[160,110,80,18]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} rx="6"
            fill="rgba(21,101,192,0.08)" stroke="rgba(21,101,192,0.25)" strokeWidth="1"/>
        ))}
        <line x1="100" y1="39" x2="150" y2="39" stroke="rgba(21,101,192,0.3)" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="100" y1="39" x2="150" y2="81" stroke="rgba(21,101,192,0.2)" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="150" y1="81" x2="100" y2="119" stroke="rgba(21,101,192,0.2)" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="150" y1="81" x2="200" y2="119" stroke="rgba(21,101,192,0.2)" strokeWidth="1" strokeDasharray="3,3"/>
        {[[100,39],[150,39],[150,81],[100,119],[200,119]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="5" fill="rgba(21,101,192,0.5)" stroke="#fff" strokeWidth="1.5"/>
        ))}
        <text x="78" y="43" fontSize="7" fill="rgba(21,101,192,0.7)" fontFamily="sans-serif">API Gateway</text>
        <text x="168" y="43" fontSize="7" fill="rgba(21,101,192,0.7)" fontFamily="sans-serif">Auth Service</text>
        <text x="118" y="85" fontSize="7" fill="rgba(21,101,192,0.7)" fontFamily="sans-serif">Core API</text>
        <text x="72" y="123" fontSize="7" fill="rgba(21,101,192,0.7)" fontFamily="sans-serif">Database</text>
        <text x="162" y="123" fontSize="7" fill="rgba(21,101,192,0.7)" fontFamily="sans-serif">Cache</text>
      </svg>
    ),
  },
  {
    id: 'cad',
    icon: '📐',
    color: '#1565c0',
    colorSoft: '#deeafb',
    title: 'CAD & Product Design',
    subtitle: 'SolidWorks · CATIA · 3D Modeling · Prototyping',
    desc: 'Full 3D CAD modeling, engineering design optimization, industrial prototyping, and design-for-manufacturing (DFM). From concept sketches to production-ready drawings.',
    tools: ['SolidWorks', 'CATIA', 'AutoCAD', 'ANSYS SpaceClaim'],
    outcomes: ['Production-ready 3D models', 'Engineering drawings & BOM', 'Weight / stress optimization', 'Prototype-ready files'],
    visual: (
      <svg viewBox="0 0 280 140" fill="none" style={{width:'100%',height:'auto'}}>
        <polygon points="140,15 230,60 230,110 140,125 50,110 50,60" fill="rgba(21,101,192,0.05)" stroke="rgba(21,101,192,0.3)" strokeWidth="1.3"/>
        <polygon points="140,30 210,65 210,100 140,112 70,100 70,65" fill="rgba(21,101,192,0.08)" stroke="rgba(21,101,192,0.2)" strokeWidth="1"/>
        <line x1="140" y1="15" x2="140" y2="30" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        <line x1="230" y1="60" x2="210" y2="65" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        <line x1="230" y1="110" x2="210" y2="100" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        <line x1="140" y1="125" x2="140" y2="112" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        <line x1="50" y1="110" x2="70" y2="100" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        <line x1="50" y1="60" x2="70" y2="65" stroke="rgba(21,101,192,0.3)" strokeWidth="1"/>
        {[140,230,50].map((x,i)=>[x,[15,60,110][i]]).map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(21,101,192,0.5)"/>
        ))}
        {[[230,110],[140,125],[50,60]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(21,101,192,0.4)"/>
        ))}
      </svg>
    ),
  },
  {
    id: 'research',
    icon: '🔬',
    color: '#0d47a1',
    colorSoft: '#e3f0fd',
    title: 'Research & Innovation',
    subtitle: 'R&D · Simulation Studies · Academic Collab',
    desc: 'Simulation-based research, academic-industry collaboration, and R&D projects across engineering disciplines. We co-author papers, run parametric studies, and deliver publishable results.',
    tools: ['MATLAB', 'Python / NumPy', 'ANSYS Research', 'LaTeX'],
    outcomes: ['Peer-reviewable reports', 'Parametric simulation studies', 'Academic collaborations', 'Patent-ready innovations'],
    visual: (
      <svg viewBox="0 0 280 140" fill="none" style={{width:'100%',height:'auto'}}>
        <polyline points="20,120 55,80 90,95 125,45 160,60 195,30 230,50 260,20"
          stroke="rgba(21,101,192,0.5)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <polyline points="20,120 55,80 90,95 125,45 160,60 195,30 230,50 260,20"
          stroke="rgba(21,101,192,0.1)" strokeWidth="8" fill="none"/>
        {[[55,80],[125,45],[195,30],[260,20]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="5" fill="rgba(21,101,192,0.6)" stroke="#fff" strokeWidth="1.5"/>
        ))}
        <line x1="20" y1="20" x2="20" y2="125" stroke="rgba(21,101,192,0.15)" strokeWidth="1"/>
        <line x1="20" y1="125" x2="265" y2="125" stroke="rgba(21,101,192,0.15)" strokeWidth="1"/>
        {[40,80,120].map((x,i)=>(
          <line key={i} x1={x+20} y1="120" x2={x+20} y2="128" stroke="rgba(21,101,192,0.2)" strokeWidth="1"/>
        ))}
      </svg>
    ),
  },
]

const PROCESS = [
  { n:'01', title:'Discovery',    desc:'We define scope, objectives, and technical requirements with you.' },
  { n:'02', title:'Design',       desc:'Architecture or simulation setup — we prototype before we build.' },
  { n:'03', title:'Development',  desc:'Iterative builds with weekly updates and milestone reviews.' },
  { n:'04', title:'Validation',   desc:'Testing, convergence checks, or QA — zero shortcuts.' },
  { n:'05', title:'Delivery',     desc:'Documented deliverables, handoff, and post-launch support.' },
]

const PRICING = [
  { tier:'Basic',        price:'৳3,000–৳15,000',  note:'Small CAD / basic sim / simple web app',    highlight:false },
  { tier:'Professional', price:'৳15,000–৳50,000', note:'Full simulation / SaaS / complex engineering', highlight:true  },
  { tier:'Enterprise',   price:'Custom',           note:'Large systems / R&D / startup products',    highlight:false },
]

export default function Services() {
  const [heroRef, heroOn]       = useReveal(0.05)
  const [svcRef, svcOn]         = useReveal(0.06)
  const [procRef, procOn]       = useReveal(0.08)
  const [priceRef, priceOn]     = useReveal(0.08)
  const [ctaRef, ctaOn]         = useReveal(0.1)
  const [active, setActive]     = useState('sim')

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

  const cur = ALL_SERVICES.find(s => s.id === active)

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg}/>
        <div className={styles.heroGrid}/>
        <div className={`container ${styles.heroInner} ${heroOn ? styles.on : ''}`}>
          <p className={styles.label}>What We Offer</p>
          <h1 className={styles.heroTitle}>
            End-to-End Engineering &amp;<br/><span>Software Solutions</span>
          </h1>
          <p className={styles.heroSub}>
            Six specialized service areas. One expert team. Full delivery from concept to production.
          </p>
        </div>
      </section>

      {/* ── SERVICE DETAIL (interactive) ── */}
      <section className={styles.detail} ref={svcRef}>
        <div className="container">
          {/* Tab row */}
          <div className={styles.tabs}>
            {ALL_SERVICES.map(s => (
              <button key={s.id}
                className={`${styles.tab} ${active===s.id ? styles.tabActive : ''}`}
                onClick={() => setActive(s.id)}>
                <span className={styles.tabIcon}>{s.icon}</span>
                <span className={styles.tabLabel}>{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className={`${styles.detailPanel} ${svcOn ? styles.on : ''}`} key={active}>
            <div className={styles.detailLeft}>
              <p className={styles.label}>{cur.subtitle}</p>
              <h2 className={styles.detailTitle}>{cur.title}</h2>
              <p className={styles.detailDesc}>{cur.desc}</p>

              <div className={styles.twoCol}>
                <div>
                  <p className={styles.subHead}>Tools & Stack</p>
                  <ul className={styles.toolList}>
                    {cur.tools.map(t => (
                      <li key={t}>
                        <div className={styles.toolDot}/>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={styles.subHead}>What You Get</p>
                  <ul className={styles.outcomeList}>
                    {cur.outcomes.map(o => (
                      <li key={o}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className="btn-blue" onClick={() => scrollTo('cta')}>
                Start This Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div className={styles.detailRight}>
              {/* 3D card visual */}
              <div className={styles.vizBox}>
                <div className={styles.vizHeader}>
                  <div className={styles.dots}><span/><span/><span/></div>
                  <span className={styles.vizLabel}>{cur.title}</span>
                </div>
                <div className={styles.vizContent}>
                  {cur.visual}
                </div>
                {/* Icon badge */}
                <div className={styles.vizBadge} style={{ background: cur.color }}>
                  <span style={{fontSize:'1.2rem'}}>{cur.icon}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES GRID ── */}
      <section className={styles.grid}>
        <div className="container">
          <div className={styles.gridHead}>
            <p className={styles.label}>All Services</p>
            <h2 className={styles.gridTitle}>Everything We <span>Build</span></h2>
          </div>
          <div className={styles.cardGrid}>
            {ALL_SERVICES.map((s,i) => (
              <div key={s.id}
                className={`${styles.sCard} ${active===s.id ? styles.sCardActive : ''}`}
                onClick={() => { setActive(s.id); svcRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }) }}
                style={{ '--scolor': s.color, '--ssoft': s.colorSoft, animationDelay:`${i*0.07}s` }}>
                {/* 3D Icon */}
                <div className={styles.sCardIconWrap}>
                  <div className={styles.sCardIconBox}>
                    <span className={styles.sCardEmoji}>{s.icon}</span>
                  </div>
                  <div className={styles.sCardShadow}/>
                </div>
                <h3 className={styles.sCardTitle}>{s.title}</h3>
                <p className={styles.sCardSub}>{s.subtitle}</p>
                <p className={styles.sCardDesc}>{s.desc.substring(0,90)}…</p>
                <div className={styles.sCardFooter}>
                  <span className={styles.sCardNum}>{String(i+1).padStart(2,'0')}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <div className={styles.sCardGlow}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={styles.process} ref={procRef}>
        <div className="container">
          <div className={`${styles.procHead} ${procOn ? styles.on : ''}`}>
            <p className={styles.label}>How We Work</p>
            <h2 className={styles.procTitle}>Our <span>Delivery Process</span></h2>
            <p className={styles.procSub}>A transparent, milestone-driven workflow — no surprises.</p>
          </div>

          <div className={styles.procTrack}>
            <div className={styles.procLine}/>
            {PROCESS.map((p,i) => (
              <div key={p.n}
                className={`${styles.procStep} ${procOn ? styles.on : ''}`}
                style={{ animationDelay:`${i*0.1}s` }}>
                <div className={styles.procCircle}>
                  <span>{p.n}</span>
                </div>
                <div className={styles.procCard}>
                  <h4 className={styles.procStepTitle}>{p.title}</h4>
                  <p className={styles.procStepDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className={styles.pricing} ref={priceRef}>
        <div className={styles.pricingBg}/>
        <div className="container">
          <div className={`${styles.priceHead} ${priceOn ? styles.on : ''}`}>
            <p className={styles.labelWhite}>Investment</p>
            <h2 className={styles.priceTitleWhite}>Transparent <span>Pricing</span></h2>
            <p className={styles.priceSub}>Clear deliverables. No hidden fees.</p>
          </div>
          <div className={styles.priceGrid}>
            {PRICING.map((p,i) => (
              <div key={p.tier}
                className={`${styles.priceCard} ${p.highlight ? styles.priceHL : ''} ${priceOn ? styles.on : ''}`}
                style={{ animationDelay:`${i*0.12}s` }}>
                {p.highlight && <div className={styles.priceBadge}>Most Popular</div>}
                <p className={styles.priceTier}>{p.tier}</p>
                <p className={styles.priceVal}>{p.price}</p>
                <p className={styles.priceNote}>{p.note}</p>
                <button
                  className={p.highlight ? styles.priceBtn : styles.priceBtnOutline}
                  onClick={() => scrollTo('cta')}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta} ref={ctaRef} id="cta">
        <div className="container">
          <div className={`${styles.ctaBox} ${ctaOn ? styles.on : ''}`}>
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>
                Ready to Start Your<br/><span>Project?</span>
              </h2>
              <p className={styles.ctaDesc}>
                Tell us what you're building — we'll get back within 24 hours with a proposal.
              </p>
            </div>
            <div className={styles.ctaRight}>
              <Link to="/#contact" className="btn-blue" style={{fontSize:'1rem',padding:'15px 36px'}}>
                Get a Free Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="mailto:galeolab@gmail.com" className="btn-outline">
                Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
