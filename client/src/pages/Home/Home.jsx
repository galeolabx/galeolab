import React, { useEffect, useState } from 'react'
import styles from '../../styles/ArchitectureHome.module.css'

const metrics = [
  { value: '25+', label: 'Universities Connected' },
  { value: '3,000+', label: 'Engineering Community' },
  { value: '100+', label: 'Simulation Projects' },
  { value: '5+', label: 'Countries' },
  { value: '10+', label: 'Research Areas' },
]

const platformCards = [
  {
    title: 'AI Engineering Copilot',
    text: 'Ask engineering questions in natural language and get clear answers around stress, geometry, material choice, and design risk.',
    tags: ['Natural language', 'Design review', 'Engineering answers'],
  },
  {
    title: 'CAD Workspace',
    text: 'Create, import, modify, and version-control engineering models from a browser-based workspace.',
    tags: ['Create', 'Import', 'Modify', 'Version control'],
  },
  {
    title: 'Simulation Cloud',
    text: 'Run CFD, FEA, thermal, motion, and multiphysics analysis without maintaining expensive local workstations.',
    tags: ['CFD', 'FEA', 'Thermal', 'Motion'],
  },
  {
    title: 'AI Optimizer',
    text: 'Automatically improve weight, strength, performance, and efficiency across iterative product designs.',
    tags: ['Weight', 'Strength', 'Performance', 'Efficiency'],
  },
  {
    title: 'Digital Twin',
    text: 'Connect product data to real-time monitoring, predictive maintenance, and industrial AI workflows.',
    tags: ['Monitoring', 'Prediction', 'Industrial AI'],
  },
  {
    title: 'Engineering Intelligence',
    text: 'Turn engineering activity into analytics, reports, recommendations, and decision-ready documentation.',
    tags: ['Analytics', 'Reports', 'Recommendations'],
  },
]

const traditionalFlow = ['SolidWorks', 'Export', 'ANSYS', 'Export', 'Excel', 'PowerPoint', 'Email', 'Repeat']
const galeolabFlow = ['GaleoLab', 'Upload', 'AI', 'Simulation', 'Optimization', 'Report']

const demoSteps = [
  'Upload STEP File',
  'AI Reads Geometry',
  'Choose Simulation',
  'Run Cloud Solver',
  'Results',
  'AI Recommendations',
  'Generate Report',
]

const featureCards = [
  ['AI Design Review', 'Detect thin walls, stress concentration, and manufacturing problems early.'],
  ['AI Material Selection', 'Suggest materials based on load, cost, manufacturability, and target performance.'],
  ['AI Manufacturing Advisor', 'Evaluate CNC machining, injection moulding, and 3D printing readiness.'],
  ['AI Cost Estimation', 'Estimate manufacturing cost, material usage, and production time.'],
  ['Cloud Simulation', 'Move heavy analysis work from local machines into scalable cloud solvers.'],
  ['Team Collaboration', 'Keep projects, comments, version history, approvals, and reports together.'],
]

const industries = [
  'Manufacturing',
  'Automotive',
  'Aerospace',
  'Energy',
  'Research Labs',
  'Universities',
  'Startups',
  'Medical',
  'Consumer Electronics',
  'Robotics',
  'Marine',
  'Space',
  'Defense',
  'Construction',
]

const technologyStack = [
  'Large Language Models',
  'Engineering Knowledge Graph',
  'CAD Geometry Engine',
  'Simulation Engine',
  'Optimization Engine',
  'Visualization Engine',
]

const integrations = ['SolidWorks', 'CATIA', 'Fusion 360', 'NX', 'Creo', 'ANSYS', 'COMSOL', 'OpenFOAM', 'MATLAB', 'Python']

const researchAreas = [
  'AI Engineering Agents',
  'Generative Design',
  'AI CFD',
  'Turbulence Modeling',
  'Machine Learning',
  'Digital Twin',
  'Topology Optimization',
  'Manufacturing Intelligence',
  'Engineering Knowledge Graph',
]

const pricing = [
  ['Starter', 'For early engineering exploration, student work, and small prototypes.', ['Basic projects', 'AI review', 'Community access']],
  ['Professional', 'For teams building repeatable engineering and software workflows.', ['Cloud simulation', 'Team projects', 'Priority reports']],
  ['Enterprise', 'For organizations needing security, integrations, and managed rollout.', ['Access control', 'Custom integrations', 'Dedicated support']],
  ['Education', 'For universities, research labs, and technical learning programs.', ['Institution setup', 'Research workspace', 'Learning support']],
]

const comparisonRows = [
  ['Multiple software', 'One platform'],
  ['Manual workflows', 'AI-assisted'],
  ['Local workstation', 'Cloud-native'],
  ['Expert-only', 'Accessible to more engineers'],
  ['Separate reports', 'Automatic documentation'],
  ['Slow iterations', 'Faster feedback loops'],
]

const customerStories = [
  ['Engineering company', 'Problem: slow simulation cycles. Solution: cloud simulation and AI recommendations. Result: faster feedback loops.'],
  ['University', 'Problem: limited workstation access. Solution: browser-based engineering workflows. Result: wider student participation.'],
  ['Startup', 'Problem: early design risk. Solution: AI-assisted validation. Result: clearer product decisions before production.'],
  ['Manufacturing plant', 'Problem: scattered reporting. Solution: automatic documentation. Result: better production communication.'],
]

const developerItems = [
  ['API', 'REST endpoints, authentication, webhooks, and integration-ready engineering workflows.'],
  ['SDK', 'Python and JavaScript tooling for simulation requests, automation, and reporting.'],
  ['Documentation', 'Clear examples for CAD upload, solver execution, result retrieval, and reports.'],
  ['Community', 'A developer path for teams building on top of GaleoLab.'],
]

const securityItems = ['SOC 2 readiness', 'GDPR alignment', 'Encryption', 'Cloud Backup', 'Access Control', 'Audit Logs']
const careerTracks = ['Engineering', 'AI', 'Research', 'Design', 'Product']

function scrollToSection(event, id) {
  event.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
    </div>
  )
}

function FlowPanel({ title, steps, accent = false }) {
  return (
    <article className={`${styles.flowPanel} ${accent ? styles.flowPanelAccent : ''}`}>
      <h3>{title}</h3>
      <div className={styles.flowSteps}>
        {steps.map((step, index) => <span key={`${step}-${index}`}>{step}</span>)}
      </div>
    </article>
  )
}

function FeatureCard({ title, text, tags, number }) {
  return (
    <article className={styles.card}>
      {number && <span className={styles.cardNumber}>{number}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
      {tags && (
        <div className={styles.tags}>
          {tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
      )}
    </article>
  )
}

function Home() {
  const [formStatus, setFormStatus] = useState('')

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [])

  const handleContact = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') || 'GaleoLab website'
    const email = formData.get('email') || ''
    const projectType = formData.get('projectType') || ''
    const message = formData.get('message') || ''
    const subject = encodeURIComponent(`GaleoLab demo request - ${projectType || 'Website inquiry'}`)
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${projectType}`,
      '',
      message,
    ].join('\n'))

    window.location.href = `mailto:galeolab@gmail.com?subject=${subject}&body=${body}`
    event.currentTarget.reset()
    setFormStatus('Your email app should open with the message. If it does not, email galeolab@gmail.com or use the WhatsApp link beside the form.')
  }

  return (
    <div className={styles.page}>
      <section id="home" className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>GaleoLab Platform</span>
              <h1>The AI Engineering Platform for the Next Generation of Manufacturing</h1>
              <p className={styles.heroText}>
                Design, simulate, optimize and validate engineering products using AI-powered CAD, CFD, FEA and Digital Twin technologies from a single cloud platform.
              </p>
              <div className={styles.actions}>
                <a href="#contact" className="btn-primary" onClick={event => scrollToSection(event, 'contact')}>Start Free</a>
                <a href="#contact" className="btn-outline" onClick={event => scrollToSection(event, 'contact')}>Request Demo</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.metricsBand} aria-label="Company metrics">
        <div className={`${styles.metricGrid} container`}>
          {metrics.map(metric => (
            <div className={styles.metricCard} key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="platform" className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Platform"
            title="One platform for AI-assisted design, simulation, optimization, and reporting."
            text="The PDF architecture reframes GaleoLab as a cloud engineering product, not only a service portfolio."
          />

          <div className={styles.flowGrid}>
            <FlowPanel title="Traditional engineering software" steps={traditionalFlow} />
            <FlowPanel title="GaleoLab workflow" steps={galeolabFlow} accent />
          </div>

          <div className={styles.block}>
            <SectionHeader
              eyebrow="Product Overview"
              title="Six connected platform modules."
              text="Each module supports a clear part of the engineering workflow, from geometry and analysis to recommendations and documentation."
            />
            <div className={styles.cardGrid}>
              {platformCards.map((card, index) => (
                <FeatureCard key={card.title} number={String(index + 1).padStart(2, '0')} {...card} />
              ))}
            </div>
          </div>

          <div className={styles.demoBlock}>
            <div>
              <span className={styles.eyebrow}>Interactive Demo</span>
              <h2>From STEP upload to generated engineering report.</h2>
              <p>The PDF asks for an animated demo instead of static screenshots. This section sets the exact product flow for that experience.</p>
            </div>
            <div className={styles.timeline}>
              {demoSteps.map((step, index) => (
                <div className={styles.timelineStep} key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.block}>
            <SectionHeader
              eyebrow="Platform Features"
              title="AI features focused on practical engineering decisions."
              text="Design review, material choice, manufacturability, cost, cloud simulation, and collaboration are grouped as product capabilities."
            />
            <div className={styles.cardGrid}>
              {featureCards.map(([title, text]) => <FeatureCard key={title} title={title} text={text} />)}
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Solutions"
            title="Industry pages for manufacturing, mobility, research, and infrastructure."
            text="The architecture specifies industry cards across automotive, aerospace, energy, labs, universities, startups, robotics, defense, and construction."
          />
          <div className={styles.pillGrid}>
            {industries.map(industry => <span key={industry}>{industry}</span>)}
          </div>

          <div className={styles.block}>
            <SectionHeader
              eyebrow="Customer Stories"
              title="Problem, solution, result narratives."
              text="Each story is structured so future case studies can be expanded without redesigning the website."
            />
            <div className={styles.storyGrid}>
              {customerStories.map(([title, text]) => <FeatureCard key={title} title={title} text={text} />)}
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Technology"
            title="Explain the AI engineering stack clearly."
            text="Instead of saying 'we use AI', the website now explains the system from language models through knowledge, CAD geometry, simulation, optimization, and visualization."
          />
          <div className={styles.techLayout}>
            <div className={styles.stack}>
              {technologyStack.map((item, index) => (
                <div className={styles.stackStep} key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
            <div className={styles.sidePanel}>
              <span className={styles.eyebrow}>Security</span>
              <h3>Controls for serious engineering teams.</h3>
              <div className={styles.tags}>
                {securityItems.map(item => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>

          <div className={styles.block}>
            <SectionHeader
              eyebrow="Integrations"
              title="Built to connect with the tools engineers already use."
              text="The PDF calls for recognizable integration logos. This first version uses clean integration tiles ready for future brand assets."
            />
            <div className={styles.integrationGrid}>
              {integrations.map(item => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section id="research" className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Research"
            title="A research hub for AI engineering, CFD, digital twins, and manufacturing intelligence."
            text="The architecture defines publications, white papers, open research, benchmarks, and an engineering blog."
          />
          <div className={styles.pillGrid}>
            {researchAreas.map(area => <span key={area}>{area}</span>)}
          </div>
        </div>
      </section>

      <section id="pricing" className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Pricing"
            title="Starter, Professional, Enterprise, and Education paths."
            text="The pricing architecture is prepared for real product packaging while keeping details flexible."
          />
          <div className={styles.pricingGrid}>
            {pricing.map(([title, text, items]) => (
              <FeatureCard key={title} title={title} text={text} tags={items} />
            ))}
          </div>
        </div>
      </section>

      <section id="developers" className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Developers"
            title="API, SDK, documentation, examples, and community."
            text="The developer section gives technical users a route into automation, integrations, and platform extension."
          />
          <div className={styles.cardGrid}>
            {developerItems.map(([title, text], index) => (
              <FeatureCard key={title} number={String(index + 1).padStart(2, '0')} title={title} text={text} />
            ))}
          </div>
        </div>
      </section>

      <section id="company" className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Company"
            title="Why GaleoLab: one platform, AI-assisted, cloud-native engineering."
            text="Company content now includes the PDF comparison, investor direction, mission, roadmap, leadership, and mission-first hiring tracks."
          />
          <div className={styles.comparison}>
            <div className={styles.comparisonHead}>
              <span>Traditional</span>
              <span>GaleoLab</span>
            </div>
            {comparisonRows.map(([traditional, galeolab]) => (
              <div className={styles.comparisonRow} key={traditional}>
                <span>{traditional}</span>
                <strong>{galeolab}</strong>
              </div>
            ))}
          </div>

          <div className={styles.companyGrid}>
            <FeatureCard title="Investors Page" text="Mission, vision, market size, traction, milestones, funding, roadmap, and leadership are now part of the website structure." />
            <FeatureCard title="Careers" text="Mission-first hiring across engineering, AI, research, design, and product." tags={careerTracks} />
            <FeatureCard title="Press and Team" text="Company storytelling has room for team, press, leadership, and future public updates." />
          </div>
        </div>
      </section>

      <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div>
              <span className={styles.eyebrow}>Contact</span>
              <h2>Request a demo or discuss the platform roadmap.</h2>
              <p>
                Connect about AI engineering, simulation cloud, digital twins, research, education, investor conversations, or developer integrations.
              </p>
              <div className={styles.contactLinks}>
                <a href="mailto:galeolab@gmail.com">galeolab@gmail.com</a>
                <a href="https://wa.me/8801633681482" target="_blank" rel="noopener noreferrer">WhatsApp +8801633681482</a>
                <a href="https://github.com/galeolabx" target="_blank" rel="noopener noreferrer">GitHub @galeolabx</a>
              </div>
            </div>
            <form className={styles.contactForm} onSubmit={handleContact}>
              <label>
                <span>Name</span>
                <input name="name" type="text" required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" required />
              </label>
              <label>
                <span>Project Type</span>
                <select name="projectType" required>
                  <option value="">Select one</option>
                  <option>AI Engineering Copilot</option>
                  <option>CAD Workspace</option>
                  <option>Simulation Cloud</option>
                  <option>Digital Twin</option>
                  <option>API and SDK</option>
                  <option>Research Collaboration</option>
                </select>
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows="5" required />
              </label>
              <button className="btn-primary" type="submit">Send Message</button>
              {formStatus && <p className={styles.formStatus}>{formStatus}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
