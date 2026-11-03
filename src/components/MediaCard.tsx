import { Link } from 'react-router-dom'
import Cover from './Cover'

type Props = { to: string; title: string; subtitle?: string; coverArt?: string }

export default function MediaCard({ to, title, subtitle, coverArt }: Props) {
  return (
    <Link to={to} className="rounded-md p-2 hover:bg-surface-2">
      <Cover id={coverArt} className="aspect-square w-full rounded-sm" />
      <p className="mt-2 truncate text-sm">{title}</p>
      {subtitle && <p className="truncate text-xs text-text-muted">{subtitle}</p>}
    </Link>
  )
}
