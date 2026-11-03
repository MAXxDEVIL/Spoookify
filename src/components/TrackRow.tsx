import { ListPlus, Pause, Play } from 'lucide-react'
import { formatTime } from '../lib/format'
import type { Track } from '../lib/subsonic'
import { usePlayer } from '../state/player'
import HeartButton from './HeartButton'

type Props = {
  track: Track
  index: number
  active?: boolean
  playing?: boolean
  onPlay: () => void
}

export default function TrackRow({ track, index, active = false, playing = false, onPlay }: Props) {
  const { addToQueue } = usePlayer()

  return (
    <div className="grid h-14 grid-cols-[32px_minmax(0,1fr)_auto_auto_auto] items-center gap-2 rounded-md px-2 hover:bg-surface-2 md:grid-cols-[32px_minmax(0,1fr)_minmax(0,160px)_auto_auto_auto] md:px-3">
      <button
        type="button"
        onClick={onPlay}
        aria-label={`${active && playing ? 'Pause' : 'Play'} ${track.title}${
          track.artist ? ` by ${track.artist}` : ''
        }`}
        className="group/play grid h-8 w-8 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
      >
        {active && playing ? (
          <Pause size={14} className="text-accent" aria-hidden="true" />
        ) : (
          <>
            <span className="text-sm tabular-nums group-hover/play:hidden group-focus-visible/play:hidden">
              {index + 1}
            </span>
            <Play
              size={14}
              className="hidden text-text group-hover/play:block group-focus-visible/play:block"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <div className="min-w-0">
        <p className={`truncate text-sm ${active ? 'text-accent' : 'text-text'}`}>{track.title}</p>
        <p className="truncate text-xs text-text-muted">{track.artist ?? ''}</p>
      </div>

      <p className="hidden truncate text-xs text-text-muted md:block">{track.album ?? ''}</p>

      <span className="text-xs tabular-nums text-text-muted">{formatTime(track.duration)}</span>

      <HeartButton track={track} />

      <button
        type="button"
        onClick={() => addToQueue([track])}
        aria-label={`Add ${track.title} to queue`}
        className="grid h-8 w-8 place-items-center rounded-pill text-text-muted hover:bg-surface-2"
      >
        <ListPlus size={15} aria-hidden="true" />
      </button>
    </div>
  )
}
