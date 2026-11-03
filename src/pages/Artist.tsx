import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Cover from '../components/Cover'
import MediaCard from '../components/MediaCard'
import { getArtist, type ArtistDetail } from '../lib/subsonic'
import { useServer } from '../state/server'

export default function Artist() {
  const { id } = useParams()
  const { config } = useServer()
  const [artist, setArtist] = useState<ArtistDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!config || !id) return
    let cancelled = false
    getArtist(config, id)
      .then((next) => {
        if (!cancelled) setArtist(next)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [config, id])

  if (error)
    return (
      <p role="alert" className="text-sm text-danger">
        {error}
      </p>
    )
  if (!artist) return <p className="text-sm text-text-muted">Loading artist…</p>

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center gap-5">
        <Cover id={artist.coverArt} className="h-28 w-28 shrink-0 rounded-pill shadow-card" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-text-muted">Artist</p>
          <h1 className="truncate text-xl">{artist.name}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {artist.albums.length} album{artist.albums.length === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      {artist.albums.length === 0 ? (
        <p className="text-sm text-text-muted">No albums for this artist yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {artist.albums.map((album) => (
            <MediaCard
              key={album.id}
              to={`/album/${album.id}`}
              title={album.name}
              subtitle={album.year ? String(album.year) : undefined}
              coverArt={album.coverArt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
