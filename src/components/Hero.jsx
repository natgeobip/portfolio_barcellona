import Navbar from './Navbar.jsx'
import OrbitBanner from './OrbitBanner.jsx'

// variant "home": titolo su una riga — variant "detail": titolo su due righe.
// banner + satellite (opzionali): immagine di sfondo con satellite animato allo scroll.
export default function Hero({ variant = 'home', navLinks, eyebrow, titleLight, titleBold, text, cta, ctaTarget, banner, satellite }) {
  return (
    <header className={`hero hero--${variant}${banner ? ' hero--banner' : ''}`}>
      {banner && <OrbitBanner banner={banner} satellite={satellite} />}
      <Navbar links={navLinks} />
      <div className="hero__content">
        <p className="hero__eyebrow">{eyebrow}</p>
        <h1 className="hero__title">
          <span className="light">{titleLight}</span> <span className="bold">{titleBold}</span>
        </h1>
        {text && <p className="hero__text">{text}</p>}
        {cta && (
          <button
            className="btn"
            onClick={() => document.getElementById(ctaTarget)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {cta}
          </button>
        )}
      </div>
    </header>
  )
}
