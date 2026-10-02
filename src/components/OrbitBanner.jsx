import { useEffect, useRef } from 'react'
import { asset } from '../utils.js'

// Posizione/dimensione iniziale del satellite, come frazioni del banner: combacia con quello in satellite_orbit.png.
const START = { x: 0.68, y: 0.48, width: 0.6, rot: 8 }
// Orbita sullo schermo (frazioni del viewport) che il satellite percorre mentre si scende nella pagina:
// parte a destra, passa in basso verso sinistra, risale e ricomincia (senso orario).
const ORBIT = {
  cx: 0.5, cy: 0.55, // centro
  rx: 0.32, ry: 0.2, // raggi (larghezza / altezza viewport)
  speed: 1.1 * Math.PI, // radianti per ogni altezza di viewport scrollata
  scale: 0.36, // dimensione "in orbita" rispetto a quella iniziale
  depth: 0.25, // variazione di scala davanti/dietro al pianeta
  rotSwing: 20, // oscillazione dell'inclinazione (gradi)
}
const DETACH = 0.9 // viewport da scrollare per staccarsi completamente dal banner
const FADE_END = 0.8 // viewport prima della fine pagina in cui il satellite svanisce

const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function OrbitBanner({ banner, satellite }) {
  const stage = useRef(null)
  const sat = useRef(null)

  useEffect(() => {
    const el = sat.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let target = 0
    let current = 0
    let raf = 0

    const draw = (scroll) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const rect = stage.current.getBoundingClientRect()
      const baseW = rect.width * START.width
      el.style.width = `${baseW}px`

      const d = smooth(clamp01(scroll / (vh * DETACH))) // 0 = sul banner, 1 = in orbita
      const phi = (scroll / vh) * ORBIT.speed

      // posizione del satellite "incollato" al banner (scorre con la pagina)
      const bx = rect.left + START.x * rect.width
      const by = rect.top + START.y * rect.height
      // posizione sull'orbita
      const ox = (ORBIT.cx + ORBIT.rx * Math.cos(phi)) * vw
      const oy = (ORBIT.cy + ORBIT.ry * Math.sin(phi)) * vh

      const scale = lerp(1, ORBIT.scale * (1 + ORBIT.depth * Math.sin(phi)), d)
      const rot = lerp(START.rot, START.rot + ORBIT.rotSwing * Math.sin(phi), d)
      const remaining = document.documentElement.scrollHeight - vh - scroll
      el.style.opacity = clamp01(remaining / (vh * FADE_END))
      el.style.transform = `translate(${lerp(bx, ox, d)}px, ${lerp(by, oy, d)}px) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`
    }

    if (reduced) {
      draw(0)
      const onResize = () => draw(0)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    // Interpolazione verso il valore di scroll: movimento morbido anche con la rotella a scatti.
    const tick = () => {
      current += (target - current) * 0.1
      if (Math.abs(target - current) < 0.3) current = target
      draw(current)
      raf = current === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      target = window.scrollY
      if (!raf) raf = requestAnimationFrame(tick)
    }
    current = target = window.scrollY
    draw(current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div className="orbit" ref={stage} aria-hidden="true">
        <img className="orbit__banner" src={asset(banner)} alt="" />
      </div>
      {/* Livello fisso: sta fuori dall'overflow dell'hero e si sovrappone alle sezioni successive. */}
      {satellite && (
        <div className="orbit__sat" ref={sat} aria-hidden="true">
          <img src={asset(satellite)} alt="" />
        </div>
      )}
    </>
  )
}
