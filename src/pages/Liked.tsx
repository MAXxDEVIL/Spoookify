import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import TrackRow from '../components/TrackRow'
import { getStarred, type Track } from '../lib/subsonic'
import { usePlayer } from '../state/player'
import { useServer } from '../state/server'
import { useStarred } from '../state/starred'

export default function Liked() {
  const { config } = useServer()
  const player = usePlayer()
  const starred = useStarred()
  const [songs, setSongs] = useState<Track[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!config) return
    let cancelled = false
    getStarred(config)
      .then((next) => {
        if (!cancelled) setSongs(next)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [config])

  const visible = songs?.filter((song) => starred.ids.has(song.id)) ?? []
  const currentId = player.state.queue[player.state.index]?.id

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Playlist</p>
          <h1 className="mt-1 text-xl">Liked songs</h1>
          <p className="mt-1 text-sm text-text-muted">
            {songs ? `${visible.length} track${visible.length === 1 ? '' : 's'}` : 'Loading…'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => player.play(visible)}
          disabled={visible.length === 0}
          className="inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
        >
          <Play size={16} aria-hidden="true" /> Play
        </button>
      </header>

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      {!error && songs && visible.length === 0 && (
        <p className="text-sm text-text-muted">Tracks you like appear here.</p>
      )}

      <div>
        {visible.map((track, index) => {
          const active = track.id === currentId
          return (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              active={active}
              playing={active && player.state.playing}
              onPlay={() => (active && player.state.playing ? player.toggle() : player.play(visible, index))}
            />
          )
        })}
      </div>
    </div>
  )
}
