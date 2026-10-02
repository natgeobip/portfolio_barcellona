import { useState } from 'react'
import PersonCard from './PersonCard.jsx'

// Tutti i membri in una riga: uno è espanso (di default il primo), gli altri sono strisce strette.
// All'hover/focus/tap si espande quello sotto il cursore; uscendo dalla galleria torna il primo.
export default function TeamGallery({ members }) {
  const [active, setActive] = useState(0)

  return (
    <div className="tgallery" onMouseLeave={() => setActive(0)}>
      {members.map((m, i) => (
        <PersonCard key={m.name} {...m} active={i === active} onActivate={() => setActive(i)} />
      ))}
    </div>
  )
}
