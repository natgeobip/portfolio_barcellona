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
// Tratto finale: un unico movimento continuo (senza soste) che porta il satellite accanto al titolo della sezione #team
// (etichetta "Our people"), poi lo accompagna sopra la sezione fino al lato destro del footer, dove si ferma.
// Il progresso va da 0 a 1 mentre l'etichetta sale da DOCK.start fino alla posizione che ha a fine pagina
// (frazioni dell'altezza dello schermo, dall'alto).
const DOCK = {
  id: 'team',
  start: 0.95,
  dy: -10, // spostamento verticale in px rispetto all'etichetta
  scale: 0.36, rot: -2,
  yShare: 0.35, // frazione iniziale del tragitto in cui il satellite arriva al titolo
  gap: 0.7, // distanza dall'etichetta, in larghezze del satellite
  footerY: 0.4, // altezza finale nel footer (frazione dall'alto del footer)
  footerScale: 0.65, footerRot: 8, // nel footer il satellite è più grande
  edge: 0.65, // distanza dal bordo destro, in larghezze del satellite
}

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

      let x = lerp(bx, ox, d)
      let y = lerp(by, oy, d)
      let scale = lerp(1, ORBIT.scale * (1 + ORBIT.depth * Math.sin(phi)), d)
      let rot = lerp(START.rot, START.rot + ORBIT.rotSwing * Math.sin(phi), d)

      let k = 0
      // La posizione segue l'etichetta del titolo, quindi il satellite scorre con la pagina.
      const anchor = document.getElementById(DOCK.id)?.querySelector('.eyebrow')
      if (anchor) {
        const a = anchor.getBoundingClientRect()
        const ay = a.top + a.height / 2 + DOCK.dy
        const maxScroll = document.documentElement.scrollHeight - vh
        const ayEnd = ay - (maxScroll - window.scrollY) // posizione dell'etichetta a fine pagina
        const w = clamp01((vh * DOCK.start - ay) / (vh * DOCK.start - ayEnd)) // progresso complessivo 0 → 1
        k = smooth(clamp01(w / DOCK.yShare)) // allineamento verticale / scala / inclinazione
        const u1 = smooth(clamp01(w / DOCK.yShare)) // 1ª curva: dall'orbita al titolo (a sinistra)
        const u2 = smooth(clamp01((w - DOCK.yShare) / (1 - DOCK.yShare))) // 2ª curva: dal titolo al footer (a destra)
        const footer = document.querySelector('.footer')
        const fy = footer ? footer.getBoundingClientRect().top + footer.offsetHeight * DOCK.footerY : ay
        const leftX = a.right + baseW * DOCK.scale * DOCK.gap
        const endX = vw - baseW * DOCK.footerScale * DOCK.edge
        x = lerp(lerp(x, leftX, u1), endX, u2) // percorso a S: destra → titolo (sinistra) → footer (destra)
        y = lerp(lerp(y, ay, k), fy, u2)
        scale = lerp(lerp(scale, DOCK.scale, k), DOCK.footerScale, u2)
        rot = lerp(lerp(rot, DOCK.rot, k), DOCK.footerRot, u2)
      }

      const remaining = document.documentElement.scrollHeight - vh - scroll
      el.style.opacity = Math.max(clamp01(remaining / (vh * FADE_END)), k) // agganciato al titolo: sempre visibile
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`
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
