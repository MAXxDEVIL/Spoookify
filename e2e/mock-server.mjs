// Minimal Subsonic server for E2E. No Navidrome in this environment, so the
// clone is exercised against fixtures over the same HTTP contract.
import { createServer } from 'node:http'

const PORT = Number(process.env.MOCK_PORT ?? 5300)

const artists = [
  { id: 'ar1', name: 'The Signals', albumCount: 2, coverArt: 'c1' },
  { id: 'ar2', name: 'Mira Vale', albumCount: 1, coverArt: 'c2' },
  { id: 'ar9', name: 'Archive', albumCount: 60 },
]

const songs = [
  { id: 's1', title: 'Neon Hours', album: 'Neon Hours', albumId: 'al1', artist: 'The Signals', artistId: 'ar1', duration: 180, coverArt: 'c1', track: 1 },
  { id: 's2', title: 'Slow Static', album: 'Neon Hours', albumId: 'al1', artist: 'The Signals', artistId: 'ar1', duration: 240, coverArt: 'c1', track: 2 },
  { id: 's3', title: 'Field Notes', album: 'Field Notes', albumId: 'al2', artist: 'Mira Vale', artistId: 'ar2', duration: 120, coverArt: 'c2', track: 1 },
  { id: 's4', title: 'Long Way Down', album: 'Field Notes', albumId: 'al2', artist: 'Mira Vale', artistId: 'ar2', duration: 300, coverArt: 'c2', track: 2 },
  { id: 's5', title: 'Night Bus', album: 'Night Bus', albumId: 'al3', artist: 'The Signals', artistId: 'ar1', duration: 210, coverArt: 'c3', track: 1 },
]

const baseAlbums = [
  { id: 'al1', name: 'Neon Hours', artist: 'The Signals', artistId: 'ar1', coverArt: 'c1', songCount: 2, year: 2024 },
  { id: 'al2', name: 'Field Notes', artist: 'Mira Vale', artistId: 'ar2', coverArt: 'c2', songCount: 2, year: 2025 },
  { id: 'al3', name: 'Night Bus', artist: 'The Signals', artistId: 'ar1', coverArt: 'c3', songCount: 1, year: 2023 },
]

const fillerAlbums = Array.from({ length: 60 }, (_, i) => ({
  id: `alx${i}`,
  name: `Archive ${String(i).padStart(2, '0')}`,
  artist: 'Archive',
  artistId: 'ar9',
  songCount: 0,
  year: 2000,
}))

let libraryAlbums
let starred
let playlists
let nextPlaylist

function reset(empty = false) {
  libraryAlbums = empty ? [] : [...baseAlbums, ...fillerAlbums]
  starred = new Set(['s3'])
  playlists = empty
    ? []
    : [
        { id: 'pl1', name: 'Morning mix', owner: 'tester', entry: ['s1', 's2'] },
        { id: 'pl2', name: 'Empty', owner: 'tester', entry: [] },
      ]
  nextPlaylist = 3
}

reset()

const wav = (() => {
  const rate = 8000
  const samples = rate * 2
  const buffer = Buffer.alloc(44 + samples)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + samples, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(rate, 24)
  buffer.writeUInt32LE(rate, 28)
  buffer.writeUInt16LE(1, 32)
  buffer.writeUInt16LE(8, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(samples, 40)
  buffer.fill(0x80, 44)
  return buffer
})()

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

const songById = (id) => songs.find((song) => song.id === id)
const serializePlaylist = (playlist) => ({
  id: playlist.id,
  name: playlist.name,
  owner: playlist.owner,
  songCount: playlist.entry.length,
  duration: playlist.entry.reduce((total, id) => total + (songById(id)?.duration ?? 0), 0),
  coverArt: playlist.entry[0] ? songById(playlist.entry[0])?.coverArt : undefined,
})

const failed = (code, message) => ({ status: 'failed', error: { code, message } })

const routes = {
  ping: () => ({}),
  search3: (query) => {
    const text = (query.get('query') ?? '').toLowerCase()
    const match = (value) => (value ?? '').toLowerCase().includes(text)
    return {
      searchResult3: {
        artist: artists.filter((artist) => match(artist.name)),
        album: libraryAlbums.filter((album) => match(album.name) || match(album.artist)),
        song: songs.filter(
          (song) => match(song.title) || match(song.artist) || match(song.album),
        ),
      },
    }
  },
  getAlbum: (query) => {
    const album = libraryAlbums.find((item) => item.id === query.get('id'))
    if (!album) return failed(70, 'Album not found.')
    return { album: { ...album, song: songs.filter((song) => song.albumId === album.id) } }
  },
  getAlbumList2: (query) => {
    const size = Number(query.get('size') ?? 50)
    const offset = Number(query.get('offset') ?? 0)
    const byName = [...libraryAlbums].sort((a, b) => a.name.localeCompare(b.name))
    let list = byName
    if (query.get('type') === 'recent') {
      list = ['al1', 'al2'].map((id) => libraryAlbums.find((a) => a.id === id)).filter(Boolean)
    } else if (query.get('type') === 'newest') {
      list = [...libraryAlbums].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    } else if (query.get('type') === 'random') {
      list = [...libraryAlbums].reverse()
    }
    return { albumList2: { album: list.slice(offset, offset + size) } }
  },
  getArtists: () => ({ artists: { index: [{ name: 'A', artist: artists }] } }),
  getArtist: (query) => {
    const artist = artists.find((item) => item.id === query.get('id'))
    if (!artist) return failed(70, 'Artist not found.')
    return {
      artist: {
        ...artist,
        album: libraryAlbums.filter((album) => album.artistId === artist.id),
      },
    }
  },
  getPlaylists: () => ({ playlists: { playlist: playlists.map(serializePlaylist) } }),
  getPlaylist: (query) => {
    const playlist = playlists.find((item) => item.id === query.get('id'))
    if (!playlist) return failed(70, 'Playlist not found.')
    return {
      playlist: {
        ...serializePlaylist(playlist),
        entry: playlist.entry.map(songById).filter(Boolean),
      },
    }
  },
  createPlaylist: (query) => {
    playlists.push({
      id: `pl${nextPlaylist++}`,
      name: query.get('name') ?? 'Untitled',
      owner: 'tester',
      entry: [],
    })
    return {}
  },
  updatePlaylist: (query) => {
    const playlist = playlists.find((item) => item.id === query.get('playlistId'))
    if (!playlist) return failed(70, 'Playlist not found.')
    const name = query.get('name')
    if (name) playlist.name = name
    const add = query.get('songIdToAdd')
    if (add) playlist.entry.push(add)
    const remove = query.get('songIdToRemove')
    if (remove !== null) playlist.entry.splice(Number(remove), 1)
    return {}
  },
  deletePlaylist: (query) => {
    playlists = playlists.filter((item) => item.id !== query.get('playlistId'))
    return {}
  },
  getStarred2: () => ({ starred2: { song: songs.filter((song) => starred.has(song.id)) } }),
  star: (query) => {
    starred.add(query.get('id'))
    return {}
  },
  unstar: (query) => {
    starred.delete(query.get('id'))
    return {}
  },
  scrobble: () => ({}),
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`)

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  }

  if (url.pathname === '/reset') {
    reset(url.searchParams.get('empty') === '1')
    response.writeHead(200, { ...cors, 'Content-Type': 'text/plain' })
    response.end('ok')
    return
  }

  if (!url.pathname.startsWith('/rest/')) {
    response.writeHead(404, cors)
    response.end()
    return
  }

  const method = url.pathname.slice('/rest/'.length)
  const params = url.searchParams

  if (method === 'stream') {
    if (!songById(params.get('id'))) {
      response.writeHead(404, cors)
      response.end()
      return
    }
    response.writeHead(200, {
      ...cors,
      'Content-Type': 'audio/wav',
      'Content-Length': wav.length,
    })
    response.end(wav)
    return
  }

  if (method === 'getCoverArt') {
    response.writeHead(200, { ...cors, 'Content-Type': 'image/png' })
    response.end(png)
    return
  }

  const authorized = params.get('u') === 'tester' && params.get('p') === 'p'
  const handler = routes[method]
  const body = authorized
    ? handler
      ? { status: 'ok', version: '1.16.1', ...handler(params) }
      : failed(0, `Unsupported method ${method}.`)
    : failed(40, 'Wrong username or password.')

  response.writeHead(200, { ...cors, 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ 'subsonic-response': body }))
}).listen(PORT, () => {
  console.log(`mock subsonic on http://localhost:${PORT}`)
})
