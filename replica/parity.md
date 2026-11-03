# Parity: Spoookify vs Spotify web

Build: 76e2b5f + step 8  Date: 2026-11-03  Source of truth: `replica/features.csv`, `replica/recon.md`

## Overall

| measure | score |
| --- | --- |
| Feature parity | **66.7 / 100** (29 counted features, 13 of 13 must-haves done) |
| Layout parity | **not scored** — no reference screenshots |
| Verdict | **not shippable** by the 80 bar: every must-have is done and there is no open S1/S2 bug, but the feature score is below 80 |

A 100 is not the goal and includes things a self-hosted, single-user, free app should not copy
(ads, billing, licensed catalogue, social). Those rows are marked `clone=skip` and left out of
the score, so 66.7 measures only the UX a switcher would miss.

## Feature groups

| area | score | note |
| --- | --- | --- |
| search | 100 | one must-have, live results |
| onboarding | 100 | server URL + credentials |
| layout | 85.7 | fixed bar + phone nav; no full-screen mobile player |
| library | 80 | albums/artists/playlists, liked, recent; no sort/filter |
| playback | 78.3 | queue, seek, shuffle/repeat, mute everywhere; no drag reorder, media keys |
| playlists | 60 | create/rename/delete/add; no drag reorder |
| ux | 37.5 | text-only empty states, no keyboard shortcuts, likes await the server |
| platform | 0 | no PWA, no offline cache, no Cast |
| reliability | 0 | error text, no retry loop |

Missing in the order `parity.py` prints (priority, then row order):

1. library — sort and filter
2. platform — installable PWA
3. playback — drag to reorder the queue
4. playback — Media Session lock screen and media keys
5. playlists — drag to reorder playlist tracks
6. reliability — reconnect and retry when the server drops
7. ux — keyboard shortcuts (space, arrows, slash)
8. ux — optimistic like with rollback
9. playback — track context menu (play next is missing, add-to-queue is a row icon)
10. could-haves: lyrics, sleep timer, full-screen mobile player, artwork cache, themes

## Layout diff

No diff images. Recon deliberately used public pages and notes, not stored screenshots
(`replica/screens/README.md`), and a logged-out Spotify page is not the same state as a
populated library, so a pixel or edge diff would measure the wrong thing. Structure compared
against the recon notes instead:

| structure | Spotify | clone |
| --- | --- | --- |
| desktop nav | left rail | left rail |
| phone nav | bottom tabs | bottom tabs |
| player | fixed bottom bar above nav, never scrolls | same (`footer`, fixed shell) |
| content | one scroll container | one scroll container |
| track rows | index/title+artist/album/duration, hover actions | same, plus visible heart and queue icons; album column hidden under md |
| artwork | square, small radius, one-line truncation | same |
| empty states | illustration plus one action | **text only** — difference, fix in the next build pass |
| home | greeting + shelves | shelves only; greeting was cut on purpose |

## Behaviour diff

| flow | original | clone | clicks | call |
| --- | --- | --- | --- | --- |
| F01 find and play | live search, album, play | same, no login step | 3 vs 3 | keep |
| F02 queue | open queue, change track; drag to reorder | open queue, remove/jump; no drag | 2 vs 2 | add reorder later |
| F03 build a playlist | open, add tracks (filters as you type), reorder | open, add tracks (**press Search**), close, rename in a dialog | 6-7 vs 5 | fix: filter the add dialog as you type |
| F04 like | one click, optimistic | one click, waits for the server, pending blocks double-click | 1 vs 1 | fix: optimistic with rollback |
| F05 resume | queue and position restored, paused | same, from one localStorage payload | 0 vs 0 | keep |
| F06 browse | infinite scroll | Load more button | 2 (+1 for big libraries) | keep; cheaper and works offline-ish |
| error handling | persistent offline banner, retries | inline `role="alert"` text, one retry per action | — | fix: banner + retry |
| remembered | queue, position, volume, device | server config, queue, position, volume, shuffle, repeat | — | keep |
| ads / login wall | ads, account login | none; connect a server instead | — | win, keep |

## Top five to build next (judgement, not script order)

1. **Reconnect and retry** (must-risk, reliability). A dropped Navidrome currently leaves a
   dead screen; the original recovers by itself. Highest user-visible failure.
2. **Keyboard shortcuts + Media Session** (should, ux/playback). This is what makes desktop
   users stay: space, arrows, `/` to search, and media keys on the lock screen.
3. **Optimistic like with rollback** (should, ux). The heart feels laggy over a home server
   or VPN; the pending set already exists, add the rollback.
4. **Sort and filter the library** (should, library). 60 albums is already a scroll; a real
   library is thousands.
5. **Installable PWA** (should, platform). Turns the tab into the app people expect; no
   offline audio, just the shell and metadata.

Then: drag reorder (queue and playlist), context menu with play-next, empty-state illustrations,
add-tracks live filter, full-screen mobile player, lyrics, themes.

## Not in this score, on purpose

Licensed catalogue, podcasts/audiobooks, recommendations, AI DJ, social/collaborative
playlists, Jam, ads, billing, offline downloads, lossless, Cast, Wrapped, concerts, account
import, and Spotify's artificial skip limit. All `clone=skip` with reasons in `features.csv`.
