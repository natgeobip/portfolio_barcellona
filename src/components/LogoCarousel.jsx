import { asset } from '../utils.js'
import { Building } from './Icons.jsx'

// Striscia scorrevole su una riga. La lista è duplicata per avere un loop continuo (CSS: translateX -50%).
export default function LogoCarousel({ companies }) {
  const items = [...companies, ...companies]
  return (
    <section className="logos" aria-label="Companies that have worked with us">
      <ul className="logos__track">
        {items.map((c, i) => (
          <li key={i} aria-hidden={i >= companies.length}>
            {c.logo ? <img src={asset(c.logo)} alt={c.name} /> : <><Building /> {c.name}</>}
          </li>
        ))}
      </ul>
    </section>
  )
}
