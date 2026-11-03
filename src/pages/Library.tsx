import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import MediaCard from '../components/MediaCard'
import PromptDialog from '../components/PromptDialog'
import {
  createPlaylist,
  listAlbums,
  listArtists,
  listPlaylists,
  type Album,
  type Artist,
  type Playlist,
} from '../lib/subsonic'
import { useServer } from '../state/server'

const PAGE = 50
const TABS = ['albums', 'artists', 'playlists'] as const
type Tab = (typeof TABS)[number]

export default function Library() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: Tab = TABS.includes(requested as Tab) ? (requested as Tab) : 'albums'

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl">Library</h1>

      <div role="group" aria-label="Library view" className="mt-4 flex gap-1 border-b border-border">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setParams({ tab: item })}
            aria-pressed={tab === item}
            className={`-mb-px border-b-2 px-4 py-2 text-sm capitalize ${
              tab === item
                ? 'border-accent text-text'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'albums' && <AlbumsTab />}
        {tab === 'artists' && <ArtistsTab />}
        {tab === 'playlists' && <PlaylistsTab />}
      </div>
    </div>
  )
}

function AlbumsTab() {
  const { config } = useServer()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!config) return
    let cancelled = false
    setLoading(true)
    listAlbums(config, 'alphabeticalByName', PAGE, 0)
      .then((next) => {
        if (cancelled) return
        setAlbums(next)
        setDone(next.length < PAGE)
        setError('')
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [config])

  async function loadMore() {
    if (!config || loadingMore) return
    setLoadingMore(true)
    setError('')
    try {
      const next = await listAlbums(config, 'alphabeticalByName', PAGE, albums.length)
      setAlbums((prev) => [...prev, ...next])
      setDone(next.length < PAGE)
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) return <p className="text-sm text-text-muted">Loading albums…</p>
  if (error) return <p role="alert" className="text-sm text-danger">{error}</p>
  if (!albums.length) return <p className="text-sm text-text-muted">No albums in your library yet.</p>

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {albums.map((album) => (
          <MediaCard
            key={album.id}
            to={`/album/${album.id}`}
            title={album.name}
            subtitle={album.artist}
            coverArt={album.coverArt}
          />
        ))}
      </div>
      {!done && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-6 rounded-pill border border-border px-4 py-2 text-sm text-text-muted hover:text-text disabled:opacity-40"
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  )
}

function ArtistsTab() {
  const { config } = useServer()
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!config) return
    let cancelled = false
    listArtists(config)
      .then((next) => {
        if (!cancelled) setArtists(next)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [config])

  if (error) return <p role="alert" className="text-sm text-danger">{error}</p>
  if (!artists) return <p className="text-sm text-text-muted">Loading artists…</p>
  if (!artists.length) return <p className="text-sm text-text-muted">No artists in your library yet.</p>

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {artists.map((artist) => (
        <MediaCard
          key={artist.id}
          to={`/artist/${artist.id}`}
          title={artist.name}
          subtitle={
            artist.albumCount === undefined
              ? undefined
              : `${artist.albumCount} album${artist.albumCount === 1 ? '' : 's'}`
          }
          coverArt={artist.coverArt}
        />
      ))}
    </div>
  )
}

function PlaylistsTab() {
  const { config } = useServer()
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!config) return
    let cancelled = false
    listPlaylists(config)
      .then((next) => {
        if (!cancelled) setPlaylists(next)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })
    return () => {
      cancelled = true
    }
  }, [config])

  async function create(name: string) {
    if (!config) return
    await createPlaylist(config, name)
    setPlaylists(await listPlaylists(config))
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent"
        >
          New playlist
        </button>
      </div>

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      {!error && !playlists && <p className="text-sm text-text-muted">Loading playlists…</p>}
      {playlists?.length === 0 && (
        <p className="text-sm text-text-muted">No playlists yet. Create one to start a mix.</p>
      )}

      <ul className="divide-y divide-border">
        {playlists?.map((playlist) => (
          <li key={playlist.id}>
            <Link
              to={`/playlist/${playlist.id}`}
              className="flex items-center justify-between gap-4 rounded-md px-2 py-3 hover:bg-surface-2"
            >
              <span className="truncate text-sm">{playlist.name}</span>
              <span className="shrink-0 text-xs text-text-muted">
                {playlist.songCount ?? 0} tracks
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <PromptDialog
        open={creating}
        title="New playlist"
        label="Name"
        submitLabel="Create"
        onClose={() => setCreating(false)}
        onSubmit={create}
      />
    </>
  )
}
