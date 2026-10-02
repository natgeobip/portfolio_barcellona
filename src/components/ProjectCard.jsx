import { Link } from 'react-router-dom'
import { asset } from '../utils.js'
import { Arrow } from './Icons.jsx'

export default function ProjectCard({ project }) {
  const { slug, titleLight, titleBold, summary, tags, image } = project
  return (
    <Link to={`/project/${slug}`} className="card">
      <div className="card__image">
        <img src={asset(image)} alt="" />
      </div>
      <div className="card__body">
        <h3>{titleLight} {titleBold}</h3>
        <p>{summary}</p>
        <ul className="tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <span className="card__arrow"><Arrow /></span>
      </div>
    </Link>
  )
}
