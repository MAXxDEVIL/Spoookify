# Architecture: Spoookify (Track A)

From `replica/recon.md`. Web client for a self-hosted Navidrome / Subsonic
library. No backend, no database, no accounts of ours.

## Stack, one line

**Vite + React + TypeScript + Tailwind**, static build, talking to Navidrome's
Subsonic API directly.

Deliberate swap from the pack default (Next.js): Track A has no server, and
Next's reason to exist is running one. Vite ships a static bundle, builds in
seconds, and deploys anywhere. `react-router` for the 10 routes; no state
library (one React context + `useReducer`); no data-fetch library (a thin
`fetch` wrapper is enough at this size).

| layer | choice | why |
| --- | --- | --- |
| build | Vite | no server to justify Next |
| UI | React 19 + TS | pack default, known |
| styling | Tailwind + CSS vars | tokens without a design-system build step |
| routing | react-router | 10 routes, no data loaders needed |
| data | `src/lib/subsonic.ts` | one module, one place auth and URLs live |
| state | `PlayerContext` (context + reducer) | queue, position, volume in one owner |
| persistence | `localStorage` | server config, queue, volume, shuffle, repeat |
| host | any static host | Navidrome does the streaming |

## Auth and transport

Subsonic wants `u`, `v`, `c`, and either `p` (plain) or `t`+`s` (token).
**Use `p` over HTTPS.** Token auth needs an MD5 implementation; a dependency and
40 lines to hide a password from a URL that HTTPS already encrypts.

`shortcut: plain-password auth requires HTTPS or localhost, upgrade to
t=md5(password+salt) if this ever runs over plain http on a shared network.`

CORS is a Navidrome setting, not code: `ND_CORSALLOWEDORIGINS=https://app.example`.
Settings screen must show that line when a connection fails — it is the #1
support ticket for every Subsonic client that ever shipped.

## Module: `src/lib/subsonic.ts`

Config `{ url, user, password }` from `localStorage['spoookify.server']`.
Every call appends `u, p, v=1.16.1, c=Spoookify, f=json`, and any call that can
be scoped to the library uses `musicFolderId` only if configured (skip for v1).

| function | Subsonic call | used by |
| --- | --- | --- |
| `ping()` | `ping` | connect form |
| `listAlbums(type, offset)` | `getAlbumList2` (newest, recent, random, alphabeticalByName) | S01 S06 |
| `listArtists()` | `getArtists` (index) | S06 |
| `getArtist(id)` | `getArtist` | S04 |
| `getAlbum(id)` | `getAlbum` | S03 |
| `listPlaylists()` | `getPlaylists` | S05 S06 |
| `getPlaylist(id)` | `getPlaylist` | S05 |
| `createPlaylist(name, ids)` / `updatePlaylist(id, add, remove)` / `deletePlaylist(id)` | same names | S05 |
| `search(q)` | `search3` (20/20/20) | S02 |
| `getStarred()` | `getStarred2` | S07 |
| `star(id)` / `unstar(id)` | `star` / `unstar` | S03 S05 S07 S09 |
| `scrobble(id)` | `scrobble` (submission=false) | S09 — feeds server "recent" |
| `coverUrl(id, size)` | `getCoverArt` URL builder | everywhere |
| `streamUrl(id)` | `stream?id=&format=mp3` | `<audio>` |

`streamUrl` uses `format=mp3`: Safari cannot decode FLAC or Ogg, and Navidrome
transcodes on demand. Everything else streams native.

## Routes

| route | screen | who | data |
| --- | --- | --- | --- |
| `/` | S01 Home | all | `listAlbums('recent')`, `listAlbums('random')`, `getStarred()` |
| `/search` | S02 Search | all | `search(q)` for tracks / albums / artists |
| `/album/:id` | S03 Album | all | `getAlbum` |
| `/artist/:id` | S04 Artist | all | `getArtist` |
| `/playlist/:id` | S05 Playlist | all | `getPlaylist`, `updatePlaylist` |
| `/library` | S06 Library | all | tabs: `listAlbums('alphabeticalByName')`, `listArtists`, `listPlaylists` |
| `/liked` | S07 Liked | all | `getStarred` |
| `/settings` | S10 Settings | all | `ping`, write `localStorage` |
| — overlay | S08 Queue | all | `PlayerContext` |
| — persistent | S09 Bar | all | `PlayerContext` |
| `/` first run | S11 Connect | all | redirects to `/settings?first=1` |

Flow coverage: F01 `/search` → `/album/:id` → bar. F02 bar → queue overlay.
F03 `/library` → `/playlist/:id` → add. F04 `/liked` + `star`. F05 `/` restores
`PlayerContext` from localStorage. F06 `/library` → `/album/:id` → bar.

Cut by ultra: S12 full-screen player, standalone connect page (folded into
settings), and the modal/toast/skeleton primitives (native `<dialog>`, inline
errors, one shimmer row).

## Component tree

```
<App>
├── <Sidebar>                    nav rail on desktop, bottom tabs on mobile
├── <main>                       one scroll container
│   └── <Routes>                 the 10 screens
├── <PlayerBar>                  S09, fixed, never unmounts
│   ├── <Transport>              play/pause, prev/next, shuffle, repeat
│   ├── <SeekBar>                range input bound to audio.currentTime
│   └── <VolumeControl>
├── <QueueSheet>                 S08, <dialog>, reads the same context
└── <PlayerContext.Provider>      owns <audio>, queue, position, prefs
```

Rules: the `<audio>` element lives once, in the provider. Screens never own
playback. Track rows call `play(track, sourceList)`; the queue is derived from
`sourceList` at play time, not mutated per screen.

## State shape

```ts
type Player = {
  queue: Track[]
  index: number
  playing: boolean
  positionMs: number
  volume: number
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'
}
```
Persisted: `queue`, `index`, `positionMs`, `volume`, `shuffle`, `repeat`.
Restored on boot; if the track 404s, drop it and try the next (F05 edge).

## Parts that bite

- **CORS + mixed content.** A Navidrome on `http://` and an app on `https://`
  cannot talk; the browser blocks it before Subsonic answers. Settings shows
  the exact cause, not "failed to fetch".
- **Codec coverage.** Handled by forcing `format=mp3`; costs CPU server-side,
  acceptable for a self-hosted library.
- **Queue/seek races.** One reducer, one `<audio>`; every action is
  `(state, action) => state` and effects live in one `useEffect`. No per-row
  audio elements, ever.
- **Long libraries.** Everything lists 50 at a time with a "load more"
  (`getAlbumList2` offset). Search is capped at 20 per type.
- **No images from Spotify** and none from Navidrome's own UI. Only
  `getCoverArt`, with a generated fallback tile.
- **iOS background audio** needs `playsInline`, a user gesture before the first
  `play()`, and Media Session metadata; still imperfect in a PWA.

## Build order

**Milestone 1 — vertical slice (proves the stack).**
`/settings` connect → `/search` → `/album/:id` → play → seek. S02 S03 S09 S10.
Files: `lib/subsonic.ts`, `PlayerContext`, `PlayerBar`, three screens.
Done when a real track plays and the bar survives navigation.

**Milestone 2 — must-haves, by area.**
playback: queue overlay S08, shuffle/repeat.
library: `/library` S06, `/liked` S07, star everywhere.
playlists: `/playlist/:id` S05 with add/remove/rename.
home: S01, artist S04.

**Milestone 3 — should-haves.**
reorder, context menu, recently played, sort, Media Session, PWA manifest,
keyboard shortcuts, optimistic star, persisted prefs, reconnect.

**Milestone 4 — could-haves.** only if they survive use: lyrics, sleep timer,
theme, offline metadata cache.

**No schema file.** There is no database. `replica/schema.sql` is intentionally
absent; the server owns the data.

## Summary

Stack: Vite + React + TS + Tailwind, static, Subsonic over HTTPS.
Routes: 10 (8 pages + 2 overlays). Tables: 0. Module functions: 15.
Riskiest: CORS/HTTPS setup friction, codec coverage, queue/player consistency.
Next: `/replica-design` — but ultra keeps it to tokens plus 8 primitives.
