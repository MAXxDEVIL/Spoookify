import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { type ReactNode } from 'react'
import { formatTime } from '../lib/format'
import { usePlayer } from '../state/player'
import Cover from './Cover'
import QueueSheet from './QueueSheet'

export default function PlayerBar() {
  const { state, toggle, next, prev, seek, setVolume, toggleShuffle, cycleRepeat } = usePlayer()
  const track = state.queue[state.index]
  const duration = track?.duration ?? 0
  const position = duration > 0 ? Math.min(state.positionMs / 1000, duration) : state.positionMs / 1000

  const repeatLabel =
    state.repeat === 'one' ? 'Repeat one' : state.repeat === 'all' ? 'Repeat all' : 'Repeat off'

  return (
    <footer className="border-t border-border bg-surface px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-[min(100%,220px)] sm:flex-none">
          <Cover id={track?.coverArt} size={96} className="h-12 w-12 shrink-0 rounded-sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{track?.title ?? 'Nothing playing'}</p>
            <p className="truncate text-xs text-text-muted">
              {track?.artist ?? 'Pick a track to start'}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <IconButton
              label={state.shuffle ? 'Shuffle on' : 'Shuffle off'}
              pressed={state.shuffle}
              onClick={toggleShuffle}
              className="max-sm:hidden"
            >
              <Shuffle size={16} />
            </IconButton>
            <IconButton label="Previous" onClick={prev} className="max-sm:hidden">
              <SkipBack size={18} />
            </IconButton>
            <button
              type="button"
              onClick={toggle}
              disabled={!track}
              aria-label={state.playing ? 'Pause' : 'Play'}
              className="grid h-10 w-10 place-items-center rounded-pill bg-accent text-on-accent disabled:opacity-40"
            >
              {state.playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <IconButton label="Next" onClick={next}>
              <SkipForward size={18} />
            </IconButton>
            <IconButton
              label={repeatLabel}
              pressed={state.repeat !== 'off'}
              onClick={cycleRepeat}
              className="max-sm:hidden"
            >
              {state.repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </IconButton>
          </div>

          <div className="hidden w-full max-w-md items-center gap-2 text-xs tabular-nums text-text-muted sm:flex">
            <span>{formatTime(position)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={duration ? Math.floor(position) : 0}
              onChange={(event) => seek(Number(event.target.value) * 1000)}
              disabled={!duration}
              aria-label="Seek"
              className="h-1 flex-1 accent-accent"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden w-[min(100%,150px)] items-center gap-2 sm:flex">
          <IconButton
            label={state.volume === 0 ? 'Unmute' : 'Mute'}
            onClick={() => setVolume(state.volume === 0 ? 0.8 : 0)}
          >
            {state.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </IconButton>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={state.volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="Volume"
            className="h-1 flex-1 accent-accent"
          />
        </div>

        <QueueSheet />
      </div>
    </footer>
  )
}

function IconButton({
  label,
  pressed,
  onClick,
  className = '',
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`grid h-9 w-9 place-items-center rounded-pill hover:bg-surface-2 ${
        pressed ? 'text-accent' : 'text-text-muted'
      } ${className}`}
    >
      {children}
    </button>
  )
}
