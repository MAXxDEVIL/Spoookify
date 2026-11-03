import { ListMusic, Pause, Play, X } from 'lucide-react'
import { useRef } from 'react'
import { formatTime } from '../lib/format'
import { usePlayer } from '../state/player'

export default function QueueSheet() {
  const { state, toggle, playAt, removeFromQueue, clearQueue } = usePlayer()
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label="Queue"
        className="grid h-9 w-9 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
      >
        <ListMusic size={16} aria-hidden="true" />
      </button>

      <dialog
        ref={dialog}
        aria-label="Queue"
        className="m-auto max-h-[80dvh] w-[min(100%-2rem,26rem)] rounded-lg border border-border bg-surface p-0 text-text shadow-pop backdrop:bg-bg/80"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Queue</h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close queue"
            className="grid h-8 w-8 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {state.queue.length === 0 ? (
          <p className="px-4 py-6 text-sm text-text-muted">Nothing queued. Play an album or add a track.</p>
        ) : (
          <ol className="max-h-[60dvh] overflow-y-auto py-2">
            {state.queue.map((track, index) => {
              const current = index === state.index
              return (
                <li key={`${track.id}-${index}`} className="flex items-center gap-2 px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => (current ? toggle() : playAt(index))}
                    aria-label={`${current && state.playing ? 'Pause' : 'Play'} ${track.title}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
                  >
                    {current && state.playing ? (
                      <Pause size={14} className="text-accent" aria-hidden="true" />
                    ) : (
                      <Play size={14} className={current ? 'text-accent' : ''} aria-hidden="true" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${current ? 'text-accent' : ''}`}>{track.title}</p>
                    <p className="truncate text-xs text-text-muted">{track.artist ?? ''}</p>
                  </div>
                  <span className="text-xs tabular-nums text-text-muted">{formatTime(track.duration)}</span>
                  <button
                    type="button"
                    onClick={() => removeFromQueue(index)}
                    aria-label={`Remove ${track.title} from queue`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ol>
        )}

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={clearQueue}
            disabled={state.queue.length < 2}
            className="w-full rounded-pill border border-border px-4 py-2 text-sm text-text-muted hover:text-text disabled:opacity-40"
          >
            Clear queue
          </button>
        </div>
      </dialog>
    </>
  )
}
