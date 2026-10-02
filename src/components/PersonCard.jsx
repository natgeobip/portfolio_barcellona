import { asset, PLACEHOLDER } from '../utils.js'

// Striscia della galleria team: stretta di default, si allarga quando è attiva e mostra le informazioni.
export default function PersonCard({ name, role, bio, photo, focus = "50%", linkedin, active, onActivate }) {
  return (
    <article
      className={`person${active ? ' is-active' : ''}`}
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
    >
      <img src={asset(photo || PLACEHOLDER)} alt={name} className={photo ? "" : "is-placeholder"} style={{ objectPosition: `${focus} 0` }} />
      <div className="person__info">
        {role && <span>{role}</span>}
        <strong>{name}</strong>
        {bio && <p>{bio}</p>}
      </div>
      {linkedin && (
        <a className="person__badge" href={linkedin} target="_blank" rel="noreferrer" aria-label={`${name} su LinkedIn`}>
          in
        </a>
      )}
    </article>
  )
}
