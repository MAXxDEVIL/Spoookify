import { useEffect, useState } from 'react'
import MediaCard from '../components/MediaCard'
import { listAlbums, type Album } from '../lib/subsonic'
import { useServer } from '../state/server'

type Sections = { recent: Album[]; newest: Album[]; random: Album[] }

export default function Home() {
  const { config } = useServer()
  const [sections, setSections] = useState<Sections | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!config) return
    let cancelled = false
    Promise.all([
      listAlbums(config, 'recent', 12),
      listAlbums(config, 'newest', 12),
      listAlbums(config, 'random', 12),
    ])
      .then(([recent, newest, random]) => {
        if (!cancelled) setSections({ recent, newest, random })
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [config])

  if (error)
    return (
      <p role="alert" className="text-sm text-danger">
        {error}
      </p>
    )
  if (!sections) return <p className="text-sm text-text-muted">Loading your library…</p>

  const groups = [
    ['Recently played', sections.recent],
    ['New releases', sections.newest],
    ['From the crate', sections.random],
  ] as const

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl">Home</h1>
      {groups.every(([, albums]) => albums.length === 0) && (
        <p className="mt-6 text-sm text-text-muted">
          The crate is empty. Add music to your server; it appears after the first scan.
        </p>
      )}
      {groups.map(
        ([title, albums]) =>
          albums.length > 0 && (
            <section key={title} className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-text-muted">{title}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {albums.map((album) => (
                  <MediaCard
                    key={album.id}
                    to={`/album/${album.id}`}
                    title={album.name}
                    subtitle={album.artist}
                    coverArt={album.coverArt}
                  />
                ))}
              </div>
            </section>
          ),
      )}
    </div>
  )
}
