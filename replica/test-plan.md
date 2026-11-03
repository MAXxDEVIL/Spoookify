# Test plan: Spoookify

Build: 76e2b5f  Date: 2026-11-03  Env: local, mock Subsonic fixture server (`e2e/mock-server.mjs`, port 5300) + Vite dev (port 5173)

Run with `npm run e2e`. No Navidrome is available here, so the app is driven over the real Subsonic HTTP contract against fixtures, never against a Spotify service.

| case | flow | type | steps | expected | auto | result |
| --- | --- | --- | --- | --- | --- | --- |
| F01-H1 | find and play | happy | search "field", open album, press Play | album page, footer shows track, audio actually playing, no axe violations | e2e | pass |
| F01-E1 | | edge: no results | search "zzzz" | "nothing matches" message, no console errors | e2e | pass |
| F01-N1 | | negative: wrong password | submit wrong password on Settings | inline alert with server message, URL stays /settings | e2e | pass |
| F02-H1 | queue | happy | play album, open Queue, remove the playing row | dialog lists 2 items, after removal 1 item and footer advances to "Slow Static", Escape closes, no axe violations | e2e | pass |
| F02-E1 | | edge: clear queue | play album, Clear queue | only current track remains, footer still "Neon Hours", audio still playing | e2e | pass |
| F02-E2 | | edge: remove last track | play single-track album, remove it | "Nothing queued", footer "Nothing playing", audio paused | e2e | pass |
| F03-H1 | build a playlist | happy | open playlist, Add tracks, search "night", add, close, Rename | 3 tracks, heading shows new name, no axe violations | e2e | pass |
| F03-E1 | | edge: empty playlist | open empty playlist | "This playlist is empty." | e2e | pass |
| F03-E2 | | edge: create | New playlist, name "Road trip" | new playlist link appears in Library | e2e | pass |
| F03-N1 | | negative: delete | delete playlist, accept confirm | back on Library, playlist gone | e2e | pass |
| F04-H1 | like / save | happy | like a search result, open Liked | heart flips to Unlike, Liked lists "Neon Hours", "2 tracks", no axe violations | e2e | pass |
| F04-E1 | | edge: unlike | unlike the starred track from Liked | row removed, "0 tracks", no console errors | e2e | pass |
| F05-H1 | resume last track | happy | seed persisted player state, reload | queue and current track restored, paused | e2e | pass |
| F05-E1 | | edge: stale stored id | seed a deleted track id, press footer Play | app does not crash, stays on Home, footer unchanged | e2e | pass |
| F06-H1 | browse library | happy | albums grid, Load more, switch to artists, open artist | paging loads the rest and hides Load more, artist page shows albums, no axe violations | e2e | pass |
| F06-E1 | | edge: empty library | reset fixtures empty, open Library | "No albums in your library yet." | e2e | pass |
| F06-E2 | | edge: phone width | 390x844, open Library | navigation visible, no horizontal scroll | e2e | pass |
| F06-E3 | | edge: phone width | 390x844, visit every main route, press Mute | no horizontal scroll anywhere, button flips to Unmute | e2e | pass |

## Not automated (accepted gaps)

| area | why | manual check |
| --- | --- | --- |
| shuffle on/off and end-of-list, repeat all/one | reducer branches, cheap to unit-test later | toggle through a short album |
| like failure rollback | needs a failing `star` route; mock only fails auth | stop the server mid-session |
| duplicate track in playlist, reorder | reorder is milestone 3, duplicate is allowed by design | add the same track twice |
| 500-album paging, sort by artist vs added | fixture has 63 albums and one sort | Navidrome with a large library |
| real mobile Safari/Chrome, real audio codecs | no device or Navidrome here | phone smoke test |

## Known limits of this suite

- The WAV fixture is 2 s while tracks declare 120-300 s, so position/seek assertions are clamped by the browser.
- Playwright runs one worker against one shared fixture server; each test resets it in `beforeEach`.
