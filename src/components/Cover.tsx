import { Music } from 'lucide-react'
import { coverUrl } from '../lib/subsonic'
import { useServer } from '../state/server'

type Props = { id?: string; size?: number; className?: string }

export default function Cover({ id, size = 300, className = '' }: Props) {
  const { config } = useServer()
  const src = config && id ? coverUrl(config, id, size) : ''

  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`grid place-items-center bg-surface-2 text-text-muted ${className}`}
      >
        <Music size={20} />
      </div>
    )
  }

  return <img src={src} alt="" loading="lazy" className={`bg-surface-2 object-cover ${className}`} />
}
