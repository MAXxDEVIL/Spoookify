import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import Cover from '../components/Cover'
import TrackRow from '../components/TrackRow'
import { getAlbum, type Album as AlbumData, type Track } from '../lib/subsonic'
import { usePlayer } from '../state/player'
import { useServer } from '../state/server'

type Loaded = AlbumData & { songs: Track[] }

export default function Album() {
  const { id } = useParams()
  const { config } = useServer()
  const player = usePlayer()
  const [album, setAlbum] = useState<Loaded | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!config || !id) return
    let cancelled = false
    setLoading(true)
    setError('')
    setAlbum(null)
    getAlbum(config, id)
      .then((next) => {
        if (!cancelled) setAlbum(next)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [config, id])

  const currentId = player.state.queue[player.state.index]?.id

  if (loading) return <p className="text-sm text-text-muted">Loading album…</p>
  if (error)
    return (
      <p role="alert" className="text-sm text-danger">
        {error}
      </p>
    )
  if (!album) return null

  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end">
        <Cover id={album.coverArt} className="h-40 w-40 shrink-0 rounded-md shadow-card" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-text-muted">Album</p>
          <h1 className="truncate text-xl">{album.name}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {[album.artist, album.year, `${album.songs.length} tracks`].filter(Boolean).join(' · ')}
          </p>
          <button
            type="button"
            onClick={() => player.play(album.songs)}
            disabled={album.songs.length === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
          >
            <Play size={16} aria-hidden="true" /> Play
          </button>
        </div>
      </header>

      {album.songs.length === 0 ? (
        <p className="text-sm text-text-muted">This album has no tracks.</p>
      ) : (
        <div>
          {album.songs.map((track, index) => {
            const active = track.id === currentId
            return (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                active={active}
                playing={active && player.state.playing}
                onPlay={() =>
                  active && player.state.playing ? player.toggle() : player.play(album.songs, index)
                }
              />
            )
          })}
        </div>
      )}
    </article>
  )
}
