import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Play, Plus, Trash2 } from 'lucide-react'
import AddTracksDialog from '../components/AddTracksDialog'
import Cover from '../components/Cover'
import PromptDialog from '../components/PromptDialog'
import TrackRow from '../components/TrackRow'
import {
  deletePlaylist,
  getPlaylist,
  updatePlaylist,
  type PlaylistDetail,
} from '../lib/subsonic'
import { usePlayer } from '../state/player'
import { useServer } from '../state/server'

export default function Playlist() {
  const { id } = useParams()
  const { config } = useServer()
  const player = usePlayer()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [renaming, setRenaming] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!config || !id) return
    let cancelled = false
    getPlaylist(config, id)
      .then((next) => {
        if (!cancelled) setPlaylist(next)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [config, id, version])

  async function rename(name: string) {
    if (!config || !id) return
    await updatePlaylist(config, id, { name })
    setVersion((value) => value + 1)
  }

  async function addTrack(trackId: string) {
    if (!config || !id) return
    await updatePlaylist(config, id, { songIdToAdd: trackId })
    setVersion((value) => value + 1)
  }

  async function remove() {
    if (!config || !id || !playlist) return
    if (!window.confirm(`Delete “${playlist.name}”? This cannot be undone.`)) return
    try {
      await deletePlaylist(config, id)
      navigate('/library?tab=playlists')
    } catch (cause) {
      setError((cause as Error).message)
    }
  }

  if (error && !playlist)
    return (
      <p role="alert" className="text-sm text-danger">
        {error}
      </p>
    )
  if (!playlist) return <p className="text-sm text-text-muted">Loading playlist…</p>

  const currentId = player.state.queue[player.state.index]?.id

  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end">
        <Cover
          id={playlist.coverArt ?? playlist.entries[0]?.coverArt}
          className="h-40 w-40 shrink-0 rounded-md shadow-card"
        />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-text-muted">Playlist</p>
          <h1 className="truncate text-xl">{playlist.name}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {[playlist.owner, `${playlist.entries.length} tracks`].filter(Boolean).join(' · ')}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => player.play(playlist.entries)}
              disabled={playlist.entries.length === 0}
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
            >
              <Play size={16} aria-hidden="true" /> Play
            </button>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm text-text-muted hover:text-text"
            >
              <Plus size={16} aria-hidden="true" /> Add tracks
            </button>
            <button
              type="button"
              onClick={() => setRenaming(true)}
              className="inline-flex items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm text-text-muted hover:text-text"
            >
              <Pencil size={16} aria-hidden="true" /> Rename
            </button>
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-2 rounded-pill border border-border px-4 py-2 text-sm text-text-muted hover:text-danger"
            >
              <Trash2 size={16} aria-hidden="true" /> Delete
            </button>
          </div>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-3 text-sm text-danger">
          {error}
        </p>
      )}

      {playlist.entries.length === 0 ? (
        <p className="text-sm text-text-muted">This playlist is empty. Add a few tracks.</p>
      ) : (
        <div>
          {playlist.entries.map((track, index) => {
            const active = track.id === currentId
            return (
              <TrackRow
                key={`${track.id}-${index}`}
                track={track}
                index={index}
                active={active}
                playing={active && player.state.playing}
                onPlay={() =>
                  active && player.state.playing
                    ? player.toggle()
                    : player.play(playlist.entries, index)
                }
              />
            )
          })}
        </div>
      )}

      <PromptDialog
        open={renaming}
        title="Rename playlist"
        label="Name"
        initialValue={playlist.name}
        submitLabel="Save"
        onClose={() => setRenaming(false)}
        onSubmit={rename}
      />

      <AddTracksDialog open={adding} onClose={() => setAdding(false)} onAdd={addTrack} />
    </article>
  )
}
