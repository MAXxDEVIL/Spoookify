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
