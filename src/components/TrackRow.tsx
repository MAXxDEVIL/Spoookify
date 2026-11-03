import { Pause, Play } from 'lucide-react'
import { formatTime } from '../lib/format'
import type { Track } from '../lib/subsonic'

type Props = {
  track: Track
  index: number
  active?: boolean
  playing?: boolean
  onPlay: () => void
}

export default function TrackRow({ track, index, active = false, playing = false, onPlay }: Props) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${playing ? 'Pause' : 'Play'} ${track.title}${track.artist ? ` by ${track.artist}` : ''}`}
      className="group grid h-14 w-full grid-cols-[24px_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-md px-3 text-left hover:bg-surface-2"
    >
      <span className="text-sm tabular-nums text-text-muted" aria-hidden="true">
        {active && playing ? (
          <Pause size={14} className="text-accent" />
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <Play size={14} className="hidden text-text group-hover:block" />
          </>
        )}
      </span>
      <span className="min-w-0">
        <span className={`block truncate text-sm ${active ? 'text-accent' : 'text-text'}`}>
          {track.title}
        </span>
        <span className="block truncate text-xs text-text-muted">{track.artist ?? ''}</span>
      </span>
      <span className="hidden max-w-[180px] truncate text-xs text-text-muted md:block">
        {track.album ?? ''}
      </span>
      <span className="text-xs tabular-nums text-text-muted">{formatTime(track.duration)}</span>
    </button>
  )
}
