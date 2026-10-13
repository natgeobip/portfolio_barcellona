import { useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard.jsx'
import { Arrow } from './Icons.jsx'

// Carosello orizzontale con scroll-snap: si scorre con le frecce, con la rotella/trackpad o trascinando (touch).
// Le frecce spostano di una scheda alla volta e si disattivano agli estremi.
export default function ProjectCarousel({ projects }) {
  const track = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = track.current
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      })
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const go = (dir) => {
    const el = track.current
    const card = el.firstElementChild
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0)
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="pcarousel" role="region" aria-roledescription="carousel" aria-label="Projects">
      <button className="pcarousel__btn pcarousel__btn--prev" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous project">
        <Arrow />
      </button>
      <div className="pcarousel__track" ref={track}>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <button className="pcarousel__btn pcarousel__btn--next" onClick={() => go(1)} disabled={edge.end} aria-label="Next project">
        <Arrow />
      </button>
    </div>
  )
}
