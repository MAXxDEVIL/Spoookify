import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'
import { search as searchLibrary, type Album, type Artist, type Track } from '../lib/subsonic'
import { usePlayer } from '../state/player'
import { useServer } from '../state/server'

type Results = { artists: Artist[]; albums: Album[]; tracks: Track[] }

export default function Search() {
  const { config } = useServer()
  const player = usePlayer()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!config) return
    const text = query.trim()
    if (!text) {
      setResults(null)
      setError('')
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    const timer = window.setTimeout(() => {
      searchLibrary(config, text)
        .then((next) => {
          if (cancelled) return
          setResults(next)
          setError('')
        })
        .catch((cause: Error) => {
          if (cancelled) return
          setResults(null)
          setError(cause.message)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, config])

  const currentId = player.state.queue[player.state.index]?.id
  const empty =
    results !== null &&
    results.tracks.length + results.albums.length + results.artists.length === 0

  return (
    <div className="mx-auto max-w-4xl">
      <label htmlFor="search" className="sr-only">
        Search your library
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tracks, albums, artists"
        autoFocus
        className="w-full rounded-md border border-border-input bg-surface px-4 py-3 text-base placeholder:text-text-muted focus:border-accent focus:outline-none"
      />

      {loading && <p className="mt-4 text-sm text-text-muted">Searching…</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}
      {!query.trim() && !results && (
        <p className="mt-6 text-sm text-text-muted">Type to search your library.</p>
      )}
      {empty && !loading && (
        <p className="mt-6 text-sm text-text-muted">Nothing matches “{query.trim()}”.</p>
      )}

      {results && results.tracks.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-text-muted">Tracks</h2>
          <div>
            {results.tracks.map((track, index) => {
              const active = track.id === currentId
              return (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  active={active}
                  playing={active && player.state.playing}
                  onPlay={() =>
                    active && player.state.playing
                      ? player.toggle()
                      : player.play(results.tracks, index)
                  }
                />
              )
            })}
          </div>
        </section>
      )}

      {results && results.albums.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-text-muted">Albums</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {results.albums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="rounded-md p-2 hover:bg-surface-2"
              >
                <Cover id={album.coverArt} className="aspect-square w-full rounded-sm" />
                <p className="mt-2 truncate text-sm">{album.name}</p>
                <p className="truncate text-xs text-text-muted">{album.artist}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results && results.artists.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-semibold text-text-muted">Artists</h2>
          <ul className="flex flex-wrap gap-2">
            {results.artists.map((artist) => (
              <li key={artist.id} className="rounded-pill border border-border px-3 py-1 text-sm text-text-muted">
                {artist.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
