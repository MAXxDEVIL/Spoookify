export type Track = {
  id: string
  title: string
  album?: string
  albumId?: string
  artist?: string
  duration?: number
  coverArt?: string
  track?: number
  starred?: string
}

export type Album = {
  id: string
  name: string
  artist?: string
  artistId?: string
  coverArt?: string
  songCount?: number
  year?: number
}

export type Artist = {
  id: string
  name: string
  albumCount?: number
  coverArt?: string
}

export type ServerConfig = {
  url: string
  user: string
  password: string
}

const CONFIG_KEY = 'spoookify.server'

export function loadConfig(): ServerConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return null
    const config = JSON.parse(raw) as ServerConfig
    return config.url && config.user ? config : null
  } catch {
    return null
  }
}

export function saveConfig(config: ServerConfig | null) {
  if (config) localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  else localStorage.removeItem(CONFIG_KEY)
}

export function normalizeUrl(url: string) {
  return url
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/rest$/, '')
}

export function endpoint(
  config: ServerConfig,
  method: string,
  params: Record<string, string | number | undefined> = {},
) {
  const url = new URL(`${normalizeUrl(config.url)}/rest/${method}`)
  // shortcut: plain-password auth needs HTTPS or localhost; move to t=md5(password+salt)
  // if this ever runs over plain http on a shared network.
  url.searchParams.set('u', config.user)
  url.searchParams.set('p', config.password)
  url.searchParams.set('v', '1.16.1')
  url.searchParams.set('c', 'Spoookify')
  url.searchParams.set('f', 'json')
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}

type Envelope = {
  'subsonic-response'?: {
    status?: string
    error?: { code?: number; message?: string }
    [key: string]: unknown
  }
}

export async function api<T>(
  config: ServerConfig,
  method: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(endpoint(config, method, params))
  } catch {
    throw new Error('Cannot reach the server. Check the URL and its CORS setting.')
  }
  if (!response.ok) throw new Error(`The server answered ${response.status}.`)
  const body = (await response.json()) as Envelope
  const result = body['subsonic-response']
  if (!result) throw new Error('That URL is not a Subsonic server.')
  if (result.status !== 'ok') throw new Error(result.error?.message ?? 'The server rejected the request.')
  return result as unknown as T
}

export const ping = (config: ServerConfig) => api<Record<string, unknown>>(config, 'ping')

export async function search(config: ServerConfig, query: string) {
  const result = await api<{
    searchResult3?: { artist?: Artist[]; album?: Album[]; song?: Track[] }
  }>(config, 'search3', {
    query,
    artistCount: 20,
    albumCount: 20,
    songCount: 20,
  })
  return {
    artists: result.searchResult3?.artist ?? [],
    albums: result.searchResult3?.album ?? [],
    tracks: result.searchResult3?.song ?? [],
  }
}

export async function getAlbum(config: ServerConfig, id: string) {
  const result = await api<{ album?: Album & { song?: Track[] } }>(config, 'getAlbum', { id })
  if (!result.album) throw new Error('Album not found.')
  return { ...result.album, songs: result.album.song ?? [] }
}

export const streamUrl = (config: ServerConfig, id: string) =>
  endpoint(config, 'stream', { id, format: 'mp3' })

export const coverUrl = (config: ServerConfig, id?: string, size = 300) =>
  id ? endpoint(config, 'getCoverArt', { id, size }) : ''
