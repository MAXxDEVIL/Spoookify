# Wholecrate — brand

Replaces the working name `Spoookify`, which was too close to Spotify to ship.
Screening date: **2026-11-03**. Checks below are screening, not legal clearance.
A trademark lawyer should search class 9 and 42 before money is spent on the name.

## The name

**Wholecrate.** The whole crate, every track once. That is the product: a personal
music library played in one fair pass, with no algorithm deciding what comes next.
It is a collector's word, not a streaming word, and it sounds and looks nothing
like the original.

Angle it serves (`replica/fixes.md`, option 1): people who own their music are
tired of hearing the same songs; Wholecrate plays the files they already have
with one uniform shuffle, no algorithm and no ads.

### 20 candidates, cut to 5

| style | candidates | cut |
| --- | --- | --- |
| descriptive | OwnTracks, FilePlayer, EveryTrack, LocalTracks | OwnTracks is an existing open-source location app; FilePlayer and LocalTracks are generic and hard to protect; EveryTrack is a navigation app on the App Store |
| compound | **Wholecrate**, **Ownspin**, ShuffleCrate, Fullcrate | ShuffleCrate names the exact thing users complain about elsewhere and is clumsy to say; Fullcrate is the stage name of a working DJ/producer |
| invented | Vellam, Orrin, Caelo, Tavo | no meaning, and short invented words are crowded; none adds anything to the angle |
| metaphor | **Platter**, Deadwax, **Waxwing**, **Rill**, Sleeve, Spindle, Runout, Cellar | Deadwax has two music apps; Sleeve has an album player and a music logger; Spindle has a music player and a vinyl tracker; Runout has RunOut for Discogs; Cellar reads as wine or restaurants |

Final five: **Wholecrate, Ownspin, Platter, Waxwing, Rill**.

### Checks

`free` means the registry answered "not found" on 2026-11-03. `taken` is the
registration date where the registry returned one. Nothing below is a clearance.

| check | Wholecrate | Ownspin | Platter | Waxwing | Rill |
| --- | --- | --- | --- | --- | --- |
| US trademark (class 9/42) | to run | to run | to run | to run | to run |
| EU trademark | to run | to run | to run | to run | to run |
| Canada | to run | to run | to run | to run | to run |
| WIPO Global Brand DB | to run | to run | to run | to run | to run |
| `.com` (RDAP) | taken, 2015-03-29 | taken, 2020-02-28 | taken | taken | taken |
| `.app` (RDAP) | free | free | not checked (cut) | not checked (cut) | not checked (cut) |
| `.fm` (RDAP) | free | free | not checked (cut) | not checked (cut) | not checked (cut) |
| App Store search | no app named Wholecrate; 3 fuzzy results, none music | no app named Ownspin; search drifted to pin apps | 6 exact-name apps: meal planner, restaurant POS, business manager; none music | no app named Waxwing; two sellers use the word, none music | Rill Social and Rill Camera; both software, different category |
| Play Store | to run | to run | to run | to run | to run |
| npm | free | free | taken | free | taken |
| GitHub handle / repos | free (user 404, 0 repos) | free (user 404, 0 repos) | user and 1481 repos | user and 67 repos | user and 1623 repos |
| X / Instagram / TikTok | to run | to run | to run | to run | to run |
| the web | to run — search backends returned 402 or unrelated results | to run | to run | to run | to run |

Why Wholecrate wins: the only finalist with a free GitHub handle, free `.app`
and `.fm`, no software namesake in the App Store, and a name that states the
promise. `wholecrate.com` is registered (2015) and is not needed; register
`wholecrate.app` before launch.

**Trademark rows are honestly unrun.** TMview rejected the request, tmsearch is a
JavaScript app, and the search tools available here returned an error. Do not
read the empty rows as "clear".

## Palette

The original's brand is green (`#1db954`, `#1ed760`) on near-black (`#191414`).
Wholecrate moves to **warm amber on warm charcoal** — a different family, no
shared hue.

| role | value | note |
| --- | --- | --- |
| bg | `#0c0a09` | warm near-black |
| surface | `#151210` | |
| surface-2 | `#1e1a16` | |
| border | `#3f3833` | decorative divider |
| border-input | `#6b625a` | 3.31:1 on bg, UI floor |
| text | `#f3eee8` | |
| text-muted | `#a8a09a` | |
| accent | `#f2b544` | warm amber |
| on-accent | `#241a05` | 9.36:1 on accent |
| danger | `#ff8a8a` | |
| success | `#7fd6a0` | |

`python3 ../replica-design/contrast.py replica/design/tokens.json` → zero AA
failures (2026-11-03). The original's colours are listed in `brand.json` so the
sweep catches any that survive.

## Logo brief

- **Idea:** a record crate seen head-on. Three amber slats on a dark tile, held
  by an amber frame. It says "the whole crate" without a single music note.
- **Mark type:** symbol plus wordmark. The wordmark is "Wholecrate" in the system
  sans, semibold, set tight, one word, no letter-spacing tricks.
- **Sizes:** must read at 16px (favicon) and hold at 1024px (app icon). The slats
  are the only detail; no gradients, no shadows at small size.
- **Deliverables:** SVG mark, 1024×1024 app icon with no transparency for iOS,
  favicon set (16/32/180/512), social image 1200×630.
- **Must not resemble Spotify:** no circle silhouette, no three arcs, no green,
  no black-and-green pairing. Put the two marks side by side before approving.

## Voice

**Warm, not soft. Direct, not blunt. Knowing, not smug.** Short sentences.
No exclamation marks, no hype, no "seamless", "discover", "personalised" or
"unlock". The app is a tool for someone's own records; talk like a person who
has used one.

| do | don't |
| --- | --- |
| "Your server, your files." | "Seamless streaming, anywhere." |
| "Every track once." | "Personalised discovery." |
| "The server did not answer." | "Oops! Something went wrong." |
| "The crate is empty." | "No content available." |
| "Connect to my library." | "Get started free." |

Ten most-seen strings, rewritten:

1. Connect heading — "Point Wholecrate at your music."
2. Connect body — "It plays from your own Navidrome or Subsonic library. Nothing leaves your server."
3. Main button — "Connect to my library."
4. Home empty — "The crate is empty. Add music to your server; it appears after the first scan."
5. Home shelf — "From the crate" (was "Made for you").
6. Liked empty — "Nothing liked yet. Tap the heart on a track."
7. Queue empty — "The queue is empty. Play an album, or add a track."
8. Search empty — "Nothing matches “…”" (kept; already in voice).
9. Player idle — "Nothing playing" (kept).
10. Server error — "Cannot reach the server. Check the URL and its CORS setting." (kept; already in voice).

## Sweep

```bash
python3 sweep.py . --config replica/brand.json
```

Result recorded in `replica/build-log.md`. `replica/` is skipped by the sweep, so
the comparison and research files may name the original; the shipped app may not.
