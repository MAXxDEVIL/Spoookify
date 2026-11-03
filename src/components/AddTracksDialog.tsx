import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { formatTime } from '../lib/format'
import { search, type Track } from '../lib/subsonic'
import { useServer } from '../state/server'

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (trackId: string) => Promise<void>
}

export default function AddTracksDialog({ open, onClose, onAdd }: Props) {
  const { config } = useServer()
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<Track[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState('')
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      dialog.current?.close()
      return
    }
    setQuery('')
    setTracks(null)
    setAdded(new Set())
    setError('')
    dialog.current?.showModal()
  }, [open])

  async function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!config) return
    const text = query.trim()
    if (!text) return
    setLoading(true)
    setError('')
    try {
      setTracks((await search(config, text)).tracks)
    } catch (cause) {
      setTracks(null)
      setError((cause as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function add(track: Track) {
    if (pending) return
    setPending(track.id)
    setError('')
    try {
      await onAdd(track.id)
      setAdded((prev) => new Set(prev).add(track.id))
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setPending('')
    }
  }

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClose={onClose}
      aria-label="Add tracks"
      className="m-auto max-h-[80dvh] w-[min(100%-2rem,32rem)] rounded-lg border border-border bg-surface p-0 text-text shadow-pop backdrop:bg-bg/80"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Add tracks</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={runSearch} className="flex gap-2 border-b border-border p-3">
        <label htmlFor="add-tracks-search" className="sr-only">
          Search your library
        </label>
        <input
          id="add-tracks-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tracks"
          autoFocus
          className="min-w-0 flex-1 rounded-md border border-border-input bg-surface px-3 py-2 text-base placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent disabled:opacity-40"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="max-h-[50dvh] overflow-y-auto p-2">
        {error && (
          <p role="alert" className="p-2 text-sm text-danger">
            {error}
          </p>
        )}
        {!error && tracks === null && (
          <p className="p-2 text-sm text-text-muted">Search for a track to add.</p>
        )}
        {tracks?.length === 0 && (
          <p className="p-2 text-sm text-text-muted">No tracks match “{query.trim()}”.</p>
        )}
        {tracks?.map((track) => {
          const done = added.has(track.id)
          return (
            <div key={track.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{track.title}</p>
                <p className="truncate text-xs text-text-muted">{track.artist ?? ''}</p>
              </div>
              <span className="text-xs tabular-nums text-text-muted">{formatTime(track.duration)}</span>
              <button
                type="button"
                onClick={() => add(track)}
                disabled={done || pending === track.id}
                aria-label={done ? `${track.title} added` : `Add ${track.title}`}
                className={`inline-flex items-center gap-1 rounded-pill border border-border px-3 py-1 text-xs disabled:opacity-50 ${
                  done ? 'text-accent' : 'text-text-muted hover:text-text'
                }`}
              >
                {done ? <Check size={13} aria-hidden="true" /> : <Plus size={13} aria-hidden="true" />}
                {done ? 'Added' : pending === track.id ? 'Adding…' : 'Add'}
              </button>
            </div>
          )
        })}
      </div>
    </dialog>
  )
}
