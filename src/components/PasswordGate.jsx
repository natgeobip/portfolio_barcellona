import { useState } from 'react'

const EXPECTED_HASH = (import.meta.env.VITE_SITE_HASH || '').toLowerCase()
const STORAGE_KEY = 'site-unlocked'

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function isUnlocked() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === EXPECTED_HASH
  } catch {
    return false
  }
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => !EXPECTED_HASH || isUnlocked())
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  async function onSubmit(e) {
    e.preventDefault()
    const hash = await sha256(value)
    if (hash === EXPECTED_HASH) {
      try {
        sessionStorage.setItem(STORAGE_KEY, hash)
      } catch {
        /* sessionStorage non disponibile: sblocco solo per questa sessione di pagina */
      }
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="gate">
      <form className="gate__box" onSubmit={onSubmit}>
        <h1>BIP Smart Cities Team</h1>
        <p>Enter the password to access the portfolio.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Password"
          aria-label="Password"
        />
        {error && <span className="gate__error">Incorrect password</span>}
        <button type="submit">Enter</button>
      </form>
    </div>
  )
}
