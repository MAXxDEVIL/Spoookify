import { Heart } from 'lucide-react'
import type { Track } from '../lib/subsonic'
import { useStarred } from '../state/starred'

export default function HeartButton({ track }: { track: Track }) {
  const { ids, pending, toggle } = useStarred()
  const liked = ids.has(track.id)

  return (
    <button
      type="button"
      onClick={() => toggle(track)}
      disabled={pending.has(track.id)}
      aria-label={liked ? `Unlike ${track.title}` : `Like ${track.title}`}
      aria-pressed={liked}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-pill hover:bg-surface-2 disabled:opacity-50 ${
        liked ? 'text-accent' : 'text-text-muted'
      }`}
    >
      <Heart size={15} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  )
}
