import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ping } from '../lib/subsonic'
import { useServer } from '../state/server'

const inputClass =
  'rounded-md border border-border-input bg-surface px-3 py-2 text-base placeholder:text-text-muted focus:border-accent focus:outline-none'

export default function Settings() {
  const { config, setConfig } = useServer()
  const navigate = useNavigate()
  const [url, setUrl] = useState(config?.url ?? '')
  const [user, setUser] = useState(config?.user ?? '')
  const [password, setPassword] = useState(config?.password ?? '')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')

  async function connect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = { url: url.trim(), user: user.trim(), password }
    setTesting(true)
    setError('')
    try {
      await ping(next)
      setConfig(next)
      navigate('/search')
    } catch (cause) {
      setError((cause as Error).message)
      setTesting(false)
    }
  }

  return (
    <form onSubmit={connect} className="mx-auto max-w-md">
      <h1 className="text-xl">Point Wholecrate at your music</h1>
      <p className="mt-2 text-sm text-text-muted">
        It plays from your own Navidrome or Subsonic library. Nothing leaves your server.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Server URL
          <input
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://music.example.com"
            className={inputClass}
          />
          <span className="text-xs text-text-muted">Full URL including https://</span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Username
          <input
            required
            value={user}
            onChange={(event) => setUser(event.target.value)}
            autoComplete="off"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            className={inputClass}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={testing}
        className="mt-6 w-full rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-50"
      >
        {testing ? 'Testing…' : 'Connect to my library'}
      </button>

      {error && (
        <div role="alert" className="mt-4 rounded-md border border-danger/40 p-3 text-sm text-danger">
          <p>{error}</p>
          <p className="mt-2 text-text-muted">
            If the browser blocks the request, allow this origin in Navidrome:{' '}
            <code className="text-text">
              ND_CORSALLOWEDORIGINS={typeof location === 'undefined' ? '' : location.origin}
            </code>
          </p>
        </div>
      )}
    </form>
  )
}
