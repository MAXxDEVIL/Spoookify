# Reference screens — links only

No browser automation was available during recon, so these are links plus what
to look at, not images. They stay reference-only and are never shipped.

| ID | screen | reference |
| --- | --- | --- |
| S01 | Home | https://open.spotify.com/ — greeting row, then shelf rows of cards |
| S02 | Search | https://open.spotify.com/search — input pinned, then tabs: tracks / albums / artists |
| S03 | Album | https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy — art left, meta + play right, track table |
| S04 | Artist | https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02 — banner, name, play/shuffle, album grid |
| S05 | Playlist | https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M — art, owner, track table |
| S06 | Library | https://open.spotify.com/collection/albums — tabs across albums / artists / playlists |
| S07 | Liked songs | https://open.spotify.com/collection/tracks — gradient header, track table |
| S08 | Queue | open the queue from the now-playing bar — list, drag, remove |
| S09 | Now-playing bar | persistent bottom strip: art, title, transport, seek, volume, queue |
| S10 | Settings | profile menu → settings |
| S11 | Connect a server | ours; no Spotify equivalent (closest: login screen) |
| S12 | Full-screen player | tap the now-playing bar on mobile |

## Layout notes worth remembering

- Nav is a left rail on desktop, a bottom tab bar on phone; the now-playing bar
  sits above it and never scrolls away.
- Content is one scroll container; the bar and rail are fixed. The reason the
  web player feels solid is that playback never re-renders the page.
- Track tables are dense: index / title+artist / album / duration, hover reveals
  the row menu. Rows are ~56px, which is also the tap target floor.
- Empty states are illustrations plus one action, never a bare "no results".
- Artwork is square, cropped, with a 4px radius; text truncates to one line.

## Gap

Step 8 (`replica-diff`) can score structure and states from this map, not
pixels. If pixel parity matters, re-run recon with a browser attached.
