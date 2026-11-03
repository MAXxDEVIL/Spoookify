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

## Step 7 — tests (replica-test)

No Navidrome or Docker in this environment, so Playwright drives the real app over
the Subsonic HTTP contract against a fixture server (`e2e/mock-server.mjs`). Six flow
specs, 17 cases: happy path, edges, one negative per flow where it exists. Axe runs on
the main list screens; console errors, page errors and 5xx responses fail the test.

One real bug: the track-row play button's accessible name omitted the visible track
number, tripping `label-content-name-mismatch` on every track list. Fixed by appending
`, track <n>` to the label (`bug BUG-001`).

The rest of the first-run failures were test-side: strict-mode collisions between the
footer transport and page actions, bare text matching both title and album cells, and a
resume test that seeded storage before the app's `pagehide` save overwrote it.

Fixture WAVs are 2 s while tracks declare 120-300 s, so seek assertions are clamped.

## Step 8 — parity (replica-diff)

`parity.py` first printed 51.2 because out-of-scope rows used `priority=skip`; the tool expects
`clone=skip` and a real must/should/could priority. Fixed the matrix, then the honest score is
**66.7 with 13 of 13 must-haves done** (29 counted features; skipped ones are listed, not scored).

Two must-haves moved to done while measuring, not by relabelling:

- volume: the mute button was hidden under 640px with the whole volume group. It now stays in the
  phone bar (slider remains desktop-only); F06-E3 checks it.
- responsive: one phone-width test became every main route at 390px plus the mute toggle.

No layout score: recon kept links and structural notes, not screenshots, so there is nothing fair
to diff against. `replica/parity.md` compares structure and behaviour instead, with click counts
per flow. Verdict: all must-haves done, no open S1/S2, feature score below the 80 bar →
**not shippable yet**; top five gaps listed there.

## Step 9 — user research (replica-entrepreneur)

Collected real public feedback, no fabricated rows: 148 US App Store reviews (official
customer-reviews RSS), 357 Hacker News comments (Algolia API) and 22 Reddit posts (public
RSS). 527 usable rows from 3 sources; dates 2010-08-24 to 2026-11-01. Reddit JSON and
Trustpilot return 403 and Spotify Community is client-rendered, so those sources are absent
and said so rather than guessed.

`reviews.py` with a Spotify-specific `themes-spotify.json` ranks, in order: repetitive
recommendations/algorithm (124 rows, 3 sources), ads (76, 3), shuffle not random (78, 3),
price/paywalls (67, 3), queue (56, 3, avg 1.7), slow/heavy (27, 3), offline (31, 3),
podcasts/non-music (28, 2). Single-source and small themes are marked thin: desktop/web (43),
own-library control (21), playlist sorting (8), editable queue (4).

Five fixes chosen by evidence times cost: uniform shuffle on every play and each repeat
cycle (a real reducer gap: `play` ignores the shuffle toggle), queue reorder + play next,
library sort and filter-as-you-type, reconnect banner with retry, and a PWA shell. Added as
`original=no`, `clone=no` rows in `features.csv`; parity stays 66.7 because extras are not
scored.

Angle recommended: for people who own their music and are tired of hearing the same songs,
play the files they already have with one uniform shuffle, no algorithm and no ads. Grounded
in the two strongest themes across all three sources.

Limits written into `fixes.md`: HN rows are comments not app reviews and some only mention
Spotify in passing; App Store RSS has no per-review permalink, so those rows link to the
app's review page; 379 of 527 rows are unrated. All 23 quotes in `fixes.md` were checked
as verbatim substrings of `reviews.csv` after line-wrap normalisation.

## Step 10 — brand (replica-brand)

Renamed the app to **Wholecrate**. `Spoookify` shared three syllables and a green-on-black
frame with Spotify; that was never shippable. Twenty candidates across five styles were cut
to five (Wholecrate, Ownspin, Platter, Waxwing, Rill) using the confusion test from the
skill. Wholecrate won on the angle (the whole crate, every track once) and on the checks:
only finalist with a free GitHub handle (user 404, 0 repos), free `.app` and `.fm` by RDAP
on 2026-11-03, and no software namesake in the App Store. `wholecrate.com` is registered
since 2015 and is not needed. Runners-up all had a music app already using the name
(Deadwax, Sleeve, Spindle, Runout) or a crowded software name (Platter, Rill).

The trademark rows are **unrun**, not clear: TMview rejected the request, tmsearch is a
JavaScript app, and the local search backends returned 402 or unrelated results. Play Store,
X, Instagram and TikTok are also unrun. All of that is written as "to run" in `brand.md`
rather than dressed up as availability. A lawyer should search class 9 and 42 before money
goes into the name.

Palette moved from mint `#6ee7c7` to warm amber `#f2b544` on warm charcoal, a different hue
family from Spotify's green. `contrast.py`: 13 pairs, 0 failing AA, lowest UI pair 3.31:1.
Added the original's colours to `brand.json` so the sweep catches survivors; the old mint is
in that list too.

Rewrote the ten most-seen strings in the new voice (warm not soft, direct not blunt, knowing
not smug). "Made for you" became "From the crate" — it was both Spotify's wording and a
promise this app does not make. Renamed the storage keys to `wholecrate.server` and
`wholecrate.player`; `e2e` fixtures changed in the same commit, and existing dev state is
discarded, which is fine pre-launch.

New favicon: a crate front, three amber slats in a frame, deliberately not a circle. Logo
brief, checks and voice live in `replica/brand.md`; the sweep config in `replica/brand.json`.

`sweep.py . --config replica/brand.json` → **Clean**, exit 0. `npm run build` green,
`npm test` 12/12, `npm run e2e` 18/18 after updating the one queue assertion to the new copy.

## Step 11 — launch (replica-launch)

**The shuffle claim was made true before the page was written.** `play` replaced the queue
and ignored `shuffle`, so turning shuffle on and picking an album played album order; the
repeat-all wrap restarted the same order. Both are fixed in `src/state/player.tsx`: a play
under shuffle queues every track once with the chosen track first, and a repeat-all wrap
builds a fresh pass that does not start with the track that just ended. Two reducer tests
cover the permutation and the wrap. Landing copy would have been a lie without this, and a
marketing page is the wrong place to discover a product bug.

Landing page at `src/pages/Landing.tsx`, route `/` when no server is configured. Sections:
hero ("Your music. Every track once."), the two top complaints in plain words, three setup
steps, six shipped features, free pricing, six FAQs, final CTA. The screenshot is the real
app at 1440×900 against the e2e mock server (`public/landing.png`), not a mockup. Only
shipped behaviour is claimed: no offline, no install, no reconnect, no reorder, no sorting.

Routing bug found while testing the CTA: with no config, `/settings` redirected to itself
and rendered nothing. `App.tsx` now renders the landing page at `/`, redirects other paths
to `/settings`, and lets `/settings` fall through to the connect screen. `F07` covers the
page, axe and the CTA path.

Launch docs in `replica/launch/`:

- `landing.md` — section-by-section copy and the evidence behind each claim.
- `pricing.md` — original's US prices checked 2026-11-03 (Individual $12.99, Student $6.99,
  Duo $18.99, Family $21.99), Apple Music $11.99/$19.99, Navidrome free. The YouTube page is
  JavaScript-only and the support page returned empty, so that price is recorded as
  unverified. The 67 price complaints across 3 sources are cited, not quoted. Wholecrate has
  no price page, no trial, no tier, no Stripe and no billing code.
- `listing.json` — Google Play only (a web wrapper would fail App Store Guideline 4.2).
  `listing.py` → 0 errors, 0 warnings; title 28/30, short 56/80, full 1231/4000.
- `launch-plan.md` — 10 named beta sources from the research, no fake proof; analytics
  decision is **none** at launch (no tracker next to a server password); community order;
  Show HN and Product Hunt drafts leading with the shuffle fix; first-10-users plan.

Gates: `sweep.py` Clean (exit 0), `contrast.py` 13 pairs / 0 failing AA, `npm run build`
green (315.25 kB JS / 21.55 kB CSS), `npm test` 14/14, `npm run e2e` 19/19. Committed as
"Launch Wholecrate with a landing page and a fair shuffle".
