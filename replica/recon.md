# Recon map: Spotify (web) — Track A

Scope: the core loop only — browse a library, play, queue, playlist, search.
For: Spoookify, an open-source Spotify-style web client for a self-hosted
Navidrome / Subsonic library.
Date: 2026-11-03

> Clean-room. Nothing here came from Spotify's code, bundles or private APIs.
> Public pages and public API documentation only. No account used, no scraping.

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | App Store listing | https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580 | feature list, premium gating, real user complaints in reviews |
| 2 | Web API reference | https://developer.spotify.com/documentation/web-api | entity model and the full endpoint surface — the data model for free |
| 3 | Premium / pricing page | https://www.spotify.com/us/premium/ | which features they gate behind money |

Help-centre article paths 404'd on fetch, so the help centre contributed nothing
to this map. That is a gap, not a source.

Screenshots: **not captured.** No browser automation is available in this
session, so `screens/` holds URLs and layout notes instead of images. Layout
fidelity in step 8 will be structural, not pixel. See `screens/README.md`.

## Core loop

Find music, press play, and keep listening: search or browse → open an album,
artist or playlist → play → control the queue without leaving the page.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Home | `/` | landing: recent, recently added, random | greeting, media grid, shelf rows | empty library, filled, loading, server unreachable |
| S02 | Search | `/search` | find by text | search input, tabs, result rows | idle, typing, results, no results, error |
| S03 | Album | `/album/:id` | tracklist for one release | cover, meta row, play button, track table | filled, no tracks, missing art, error |
| S04 | Artist | `/artist/:id` | albums by one artist | header, album grid | filled, one album, no albums, error |
| S05 | Playlist | `/playlist/:id` | user-curated list | cover, owner, track table, edit menu | empty, filled, read-only, error |
| S06 | Library | `/library` | everything owned | tabs (albums/artists/playlists), sort | empty, filled, loading, error |
| S07 | Liked songs | `/liked` | starred tracks | header, track table, play/shuffle | empty, filled, error |
| S08 | Queue panel | overlay from bar | what plays next | drag list, remove, clear, "play next" | empty, filled, playing |
| S09 | Now-playing bar | persistent bottom | transport + state | art, title, transport, seek, volume, queue toggle, heart | playing, paused, buffering, no track, error |
| S10 | Settings | `/settings` | server and playback prefs | server URL, credentials, quality, theme | connected, not connected, bad credentials |
| S11 | Connect a server | `/connect` | first run | URL + user + pass, test button | idle, testing, success, failure |
| S12 | Full-screen player | `/now` | large art on mobile | art, transport, queue | playing, paused, no track |

Cut from the inventory on purpose: podcasts, audiobooks, concerts, Wrapped,
social/Jam, ads — see out of scope.

## Flows

```
F01 Find and play
    S01 -> S02 -> S03 -> S09
    happy path clicks: 3 (type, open album, press play)
    edge: no results, server down, album with one track, long titles

F02 Queue and change track
    S09 -> S08 -> S09
    happy path clicks: 2
    edge: queue empty, removing the playing track, end of list, shuffle on

F03 Build a playlist
    S06 -> S05 -> S02 -> S05
    happy path clicks: 5 (open playlist, add tracks, reorder)
    edge: duplicate track, empty playlist, rename, delete, no write scope

F04 Like / save
    S09 -> S07
    happy path clicks: 1
    edge: unstar, offline, optimistic failure rollback

F05 Resume last track
    S01 -> S09
    happy path clicks: 0 (restores on load)
    edge: track deleted server-side, stored id stale

F06 Browse the library
    S06 -> S03 -> S09
    happy path clicks: 2
    edge: 500 albums (paging), empty library, sort by artist vs added
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Sidebar / nav | expanded, collapsed (mobile drawer) | active, focus | all |
| MediaCard | album, playlist, artist | default, hover, missing art | S01 S04 S06 |
| TrackRow | with index, playing, drag handle | default, hover, playing, selected, disabled | S03 S05 S07 S08 |
| TrackTable | sortable header, paged | empty, loading, filled | S03 S05 S07 |
| Transport | play/pause, prev/next, shuffle, repeat | playing, paused, buffering, disabled | S09 S12 |
| SeekBar | — | dragging, buffering | S09 S12 |
| VolumeControl | slider, mute toggle | zero, max, muted | S09 |
| HeartButton | filled, outline | optimistic, error | S03 S05 S07 S09 |
| SearchInput | — | idle, typing, loading | S02 |
| Tabs | underline | active, focus | S02 S06 |
| ContextMenu | track, album | open, disabled items | S03 S05 S07 |
| EmptyState | — | — | all lists |
| Skeleton | row, card | — | all lists |
| Toast | info, error | auto-dismiss | global |
| Modal / Sheet | dialog, bottom sheet | open, closing | S05 S08 S10 |

## Inferred data model

```
Album     id, name, artistId, artist, coverArt, songCount, duration, year, genre
          evidence: source 2 (Album object), S03/S04 layout
          confidence: high

Artist    id, name, albumCount, coverArt
          evidence: source 2 (Artist object), S04
          confidence: high

Track     id, title, albumId, album, artistId, artist, track, duration,
          contentType, suffix, size, coverArt, starred
          evidence: source 2 (Track object), S03 track table
          confidence: high

Playlist  id, name, owner, songCount, duration, changed, entries[trackId]
          evidence: source 2 (Playlist object), S05
          confidence: high

Star      userId, itemId, itemType, starredAt
          evidence: source 2 (Save/Remove items), S07
          confidence: high

PlayState currentTrackId, positionMs, volume, shuffle, repeat, queue[]
          evidence: source 2 (Player endpoints: state, queue, seek, volume)
          confidence: high

Server    baseUrl, username
          evidence: S11, Track A decision
          confidence: high (not a Spotify entity — ours)
```

Relationships: Artist 1-n Album 1-n Track; Playlist n-n Track; User 1-n
Playlist; User 1-n Star; Server 1-n everything (one self-hosted library).

**Mapping to Subsonic** (Track A): Album→`getAlbum`, Artist→`getArtist` +
`getArtistInfo2`, Track→`getSong`/`getAlbum`, Playlist→`getPlaylists`/
`getPlaylist`, Star→`star`/`unstar`/`getStarred2`, PlayState→client-side,
Search→`search3`, stream→`stream?id=&format=`, cover→`getCoverArt`.

## Feature matrix

See `features.csv`. Must: 13, should: 11, could: 5, skip: 15 (44 rows).

## Out of scope (cannot or should not be cloned)

- **The catalogue.** 100M licensed tracks, 6M podcasts, 700k audiobooks.
  Licensed content is not ours to serve. Library = user's own files + CC sources.
- **Recommendations, Discover Weekly, AI DJ, daylist, Blend, Wrapped.** Needs
  listening data at a scale a self-hosted library never reaches. Optional later.
- **Social: follow, Jam, collaborative playlists, sharing to friends.** Needs
  the network. Single-user library model.
- **Connect to 2,000 devices / Cast / CarPlay.** Platform integrations, not UX.
- **Offline downloads, lossless, ad-free, unlimited skips.** Premium gates.
  We are free by construction: no ads, no skips limit, no gate.
- **Signup, billing, ads.** No money changes hands.
- **Spotify's assets**: logo, icons, fonts, artwork, copy. All replaced in step 3/10.

## Size

Screens 12, flows 6, entities 7. Hard parts: playback state and queue kept
consistent across pages; Subsonic auth and stream URLs; responsive bottom bar
that still works on a phone; large-library paging.
Size: **M** (a few weeks solo), and smaller than that if step 4 lands early.
