# Build log

## Vertical slice — 2026-11-03

S02 Search, S03 Album, S09 now-playing bar, S10 Settings/connect.
Flow: connect → search → album → play → seek. Every call goes to a real
Subsonic server; nothing is stubbed.

| screen | status | missing | harder than expected |
| --- | --- | --- | --- |
| S10 Settings / connect | done | doubles as first run; no disconnect button | — |
| S02 Search | partial | artists are chips, no S04 page to link to; one list per type, no tabs | debounce plus stale-response guard |
| S03 Album | done | no like/heart, no row menu, no sort | — |
| S09 bar | partial | no queue sheet (S08), no full-screen player (S12); seek and volume hidden under 640px | five transport buttons do not fit 390px, so prev/shuffle/repeat collapse |

Queue, index, position, volume, shuffle and repeat persist every 5s and on
`pagehide`, so F05 (resume last track) already works.

**Not verified:** actual playback. There is no Navidrome and no docker in this
session, so the audio path is proven by types, URL tests and a clean build
only. Run it against a real server before calling the slice finished.

Cut by ultra: queue sheet, full-screen player, home/library/liked/playlist
pages, artist page.

## Screens — 2026-11-03

S01 Home, S02 Search, S03 Album, S04 Artist, S05 Playlist, S06 Library,
S07 Liked, S08 Queue, S09 bar, S10 Settings (S11 folded into it). Every list
has loading, error and empty states, and every call is still a real Subsonic
request — nothing is stubbed.

| screen | status | missing | harder than expected |
| --- | --- | --- | --- |
| S01 Home | done | no greeting, no "recently played tracks" shelf (albums only) | — |
| S02 Search | done | no per-type tabs, one list per type | artist chips became Links to S04 |
| S03 Album | done | no sort, no artist link in the meta row | — |
| S04 Artist | done | no top-tracks list, no "play all" (albums only) | — |
| S05 Playlist | done | no remove-track control, no cover upload, no reorder | rename/add/delete all refetch via a version counter instead of local patching |
| S06 Library | done | albums only alphabetical + paging; no sort controls | three tabs share one URL param so the view survives reload |
| S07 Liked | done | no shuffle button, no optimistic heart | `getStarred2` once, then filtered by the shared heart set |
| S08 Queue | done | no drag reorder, no "play next" | native `<dialog>`; removing the last track clears the audio source |
| S09 bar | partial | no queue count badge, no full-screen player | queue toggle sits outside the sm-only volume cluster so mobile keeps it |
| S10 Settings | done | no disconnect, no quality/theme prefs | — |

Player changes this step: `enqueue`, `removeAt`, `clear`, `jump` in the reducer;
the no-track branch now pauses and unloads the `<audio>` so deleting the last
queued track cannot leave ghost audio. Six new reducer tests cover the queue.

Cut by ultra: full-screen player (S12), Connect as its own screen (S11), queue
drag-reorder, playlist track removal, right-click context menu, per-type search
tabs, sort controls, greeting.
