import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Footer from '../components/Footer.jsx'
import { storyIcons } from '../components/Icons.jsx'
import projects from '../data/projects.json'
import { asset } from '../utils.js'

const navLinks = [
  { label: 'OVERVIEW', id: 'overview' },
  { label: 'DATA & INSIGHTS', id: 'insights' },
  { label: 'CONTACT US', id: 'contact' },
]

export default function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const p = projects[index]

  useEffect(() => window.scrollTo(0, 0), [slug])

  if (!p) {
    return (
      <div className="notfound">
        <h1>Progetto non trovato</h1>
        <Link to="/">Torna alla home</Link>
      </div>
    )
  }

  const { overview, story, insights, results } = p

  return (
    <>
      <Hero
        variant="detail"
        navLinks={navLinks}
        eyebrow={`PROJECT ${index + 1}`}
        titleLight={p.titleLight}
        titleBold={p.titleBold}
        text={p.heroText}
        cta="Get started"
        ctaTarget="overview"
      />

      <section className="section" id="overview">
        <SectionHeading eyebrow="Overview" />
        <div className="glance">
          <div>
            <h2>{overview.title}</h2>
            <p>{overview.text}</p>
          </div>
          <div className="stats-grid">
            {overview.stats.map((s, i) => (
              <div key={i}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <dl className="meta">
          {Object.entries(overview.meta).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="story">
        <div className="story__inner">
          {story.map((s) => {
            const Icon = storyIcons[s.icon]
            return (
              <article key={s.label}>
                <p className="story__label">{Icon && <Icon />} {s.label}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section" id="insights">
        <SectionHeading eyebrow="Data & Insights" title={insights.title} />
        <div className="insights">
          <figure className="insights__main">
            <img src={asset(insights.main.image)} alt="" />
            <figcaption>{insights.main.caption}</figcaption>
          </figure>
          {insights.charts.map((c, i) => (
            <figure key={i} className="insights__chart">
              <h4>{c.title}</h4>
              <img src={asset(c.image)} alt={c.title} />
              <figcaption>{c.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section" id="results">
        <SectionHeading eyebrow="Results" title={results.title} />
        <div className="results">
          {results.items.map((r, i) => (
            <div key={i}>
              <strong className={r.small ? 'is-small' : ''}>{r.value}</strong>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
        <Link to="/" className="back">← Tutti i progetti</Link>
      </section>

      <Footer />
    </>
  )
}
