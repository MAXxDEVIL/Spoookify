# What users of the original hate, miss, and are not served

Sample: **527 public reviews and comments from 3 sources** — 148 App Store reviews
(1–5 stars), 357 Hacker News comments, 22 Reddit posts. Dates 2010-08-24 to
2026-11-01; the ranker halves the weight of anything older than 18 months and gives
unrated HN/Reddit rows 0.6 instead of a star weight. Raw rows: `reviews.csv`.
Theme sort: `feedback.md`. Themes are pattern matches and overlap, so counts do not
add up to 527.

Honest limits before you use this:

- Hacker News is **comments, not app reviews**, and search returns some comments that
  only mention Spotify in passing. They are weighted lower and marked `-` for stars.
- App Store RSS does not expose per-review permalinks. Those rows link to the App
  Store review page for the app, not to the individual review.
- 379 of 527 rows have no star rating, so "avg stars" is only over the rated rows.
- Nothing here is a testimonial. Reviewer words stay in this file.

## 1. What they hate

1. **The algorithm decides what you hear and repeats the same songs.** 124 reviews,
   3 sources, avg 2.8 across rated rows. This is the top theme by weighted score.
   - "spotify shuffles the same songs its so noticeable." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software
   - "Anecdotally, Spotify shuffle is one of the worst shuffles I've ever used."
     (Hacker News, -) https://news.ycombinator.com/item?id=38794032

2. **Shuffle is not random, and large playlists make it worse.** 78 reviews,
   3 sources, avg 2.6.
   - "Unbelievable that spotify's shuffle is still broken a decade later."
     (Hacker News, -) https://news.ycombinator.com/item?id=48229178
   - "how is it theres over a thousand songs on a playlist but still shuffles the
     same songs." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

3. **Ads interrupt the music.** 76 reviews, 3 sources, avg 2.9.
   - "It plays an ad after EVERY song." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

4. **Price and paywalls.** 67 reviews, 3 sources, avg 2.8. Routes to
   `/replica-launch`, not to the build.
   - "THIS APP IS HORRIBLE TO PEOPLE WHO DONT HAVE PREMIUM." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software
   - "I need to cancel my premium family plan because this app stinks!"
     (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

5. **The queue is unreliable.** 56 reviews, 3 sources, avg 1.7 — the lowest rated
   complaint theme.
   - "Spotify queue management is just terrible." (Hacker News, -)
     https://news.ycombinator.com/item?id=29297560
   - "I could take out songs in the queue and they will magically appear back in,
     very frustrating doing the same job multiple times when it should be out the
     first time." (App Store, 3★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

6. **Slow and heavy, especially on desktop.** 27 reviews, 3 sources, avg 1.6.
   - "The desktop app crawls on my 24gb 8-core workstation." (Hacker News, -)
     https://news.ycombinator.com/item?id=23172962
   - "From songs lagging and skipping like a record to the app just totally not
     loading at all." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

7. **Offline playback does not hold up.** 31 reviews, 3 sources, avg 2.8.
   - "Doesn’t work 80% of the time in the car." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

8. **Podcasts and non-music are pushed into the music app.** 28 reviews, 2 sources,
   avg 3.5.
   - "Will play AI artists without telling you" (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

9. **Desktop/web is the neglected client. (thin: 43 rows, one source only)**
   - "Spotify desktop app still not working for me." (Hacker News, -)
     https://news.ycombinator.com/item?id=29243678
   - "I use the Spotify browser UI on my PC because the Windows 11 app is such a
     joke." (Hacker News, -) https://news.ycombinator.com/item?id=49521252

10. **Bugs and regressions.** 22 reviews, 2 sources, avg 1.9.
    - "Everything on my Home > All page has suddenly disappeared except an AI
      feature and recents." (App Store, 1★)
      https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

## 2. What is missing

1. **Control of your own library and files. (thin: 21 rows, one source)** People
   describe importing a local collection and keeping it organised, not renting a
   catalogue.
   - "I am a playlist curator by heart, did that with my 100GB MP3/FLAC Music
     collection for 20 years before switching to Spotify" (Hacker News, -)
     https://news.ycombinator.com/item?id=40430351

2. **A genuinely random shuffle. (4 rows, 2 sources)**
   - "I wish it would randomly pick the next song from the entire playlist whenever
     it changed songs." (Hacker News, -)
     https://news.ycombinator.com/item?id=38794286
   - "If this player has true random playing of your songs, instant sell for me."
     (Hacker News, -) https://news.ycombinator.com/item?id=49523937

3. **Sorting and editing playlists. (thin: 8 rows, one source)**
   - "Or sort by both artist, and original release date." (Hacker News, -)
     https://news.ycombinator.com/item?id=24988306
   - "Now sort the playlist from least recently played to most recently played."
     (Hacker News, -) https://news.ycombinator.com/item?id=38797757
   - "There's no way to collapse songs of a single album to one entry."
     (Hacker News, -) https://news.ycombinator.com/item?id=31977757

4. **Recommendations that are not the same songs. (thin: 10 rows, one source)**
   The clone cannot honestly match this: it has no listening data at streaming
   scale. The cheap part — do not bias the shuffle — is fix 1 below.

5. **An editable queue. (thin: 4 rows, one source)** Counted separately from the
   queue complaints above because the wording asks for control, not repair.

6. **Listening history you can actually search. (one review, unthemed)** Low volume,
   so not a trend — but it is the clearest single complaint in the "read by hand"
   list:
   - "I literally cant access my listening history." (App Store, 1★)
     https://itunes.apple.com/us/review?id=324684580&type=Purple%20Software

Lossless audio came up 5 times across 2 sources, but the original now claims it, so
it is a moving target and the clone's ceiling is the source file anyway.

## 3. What is unsolved

1. **People with a real library of their own.** Streaming products are built around a
   rented catalogue, a popularity graph, and short playlists. A 113,000-track
   collection is an edge case for them and the normal case for a self-hosted server.
   The complaint that large playlists "crash" and still "shuffle the same songs" is
   the direct evidence. Spooo​kify's whole model is that library.
2. **People who want music only.** 76 ad complaints, 28 podcast/non-music complaints,
   and one explicit "Will play AI artists without telling you". An ad-funded service
   has to sell attention and grow surface area; a personal library client has nothing
   to sell.
3. **Desktop and browser listeners treated as second class.** The desktop theme is
   thin (43 rows, one source) but the quotes are specific: "crawls on my 24gb 8-core
   workstation", "still not working for me", "the Windows 11 app is such a joke".
   A browser client with no install is a real answer, not a slogan.

## 4. Fix plan

Top five by evidence times how cheaply this codebase can fix them. Sizes are this
repo, not a generic estimate. Each becomes an `original=no` row in `features.csv`
with `clone=no` — planned, not built.

| # | Fix | Size | Skill | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Shuffle applied to every new play, and reshuffled on each repeat cycle | S | `frontend-patterns` | shuffle 78/3 + recommendations 124/3 + real-shuffle 4/2 |
| 2 | Drag to reorder the queue, plus play next | M | `frontend-patterns` | queue 56/3 (avg 1.7) |
| 3 | Library sort and filter-as-you-type | M | `frontend-patterns` | library-control 21/1 (thin) + F03 flow 5 vs 6–7 clicks |
| 4 | Reconnect banner with automatic retry | M | `frontend-patterns` | bugs 22/2 + performance 27/3; parity reliability 0 |
| 5 | Installable PWA with a cached app shell | M | `frontend-patterns` | offline 31/3; parity platform 0 |

1. **Shuffle that holds.** Real gap in `src/state/player.tsx`: `play` replaces the
   queue and ignores `state.shuffle`, so shuffle-on then choosing an album plays in
   album order. `next` with repeat-all also restarts the same order instead of
   reshuffling. Apply the existing Fisher–Yates in `play`, and reshuffle on wrap.
   One reducer test: every play is a permutation, the chosen track stays first, and
   no track repeats until the queue is exhausted.
2. **Queue editing.** `QueueSheet` can jump, remove and clear, but not reorder or
   play next. Add a `move` action plus a drag handle (and up/down buttons for
   keyboard), and a "Play next" row action. `original=no`; Spotify's own queue is one
   of the lowest-rated themes.
3. **Sort and filter.** `Library.tsx` always requests `alphabeticalByName` and has no
   filter. Add a sort select (name, recently added, artist) mapped to the Subsonic
   `getAlbumList` types, and filter the loaded list by name. The playlist add dialog
   should filter while typing instead of requiring a Search press (parity F03).
4. **Reconnect instead of a dead screen.** Today every failed call renders inline
   error text and stops. Add one server-health check, a dismissible offline banner,
   and one automatic retry with backoff for idempotent reads. Playback state must
   survive it.
5. **PWA shell.** Cache the built HTML/CSS/JS so the app opens and shows the last
   library state offline. Do not promise offline audio: the files live on the
   Subsonic server. Say that in the UI.

Not building, on purpose: ads and billing (we are free), podcasts/video (music only
by design), a recommendation engine (no listening data at that scale), lossless
promises (depends on source files), and CarPlay/Android Auto.

## 5. The angle

Three options, each grounded in a top theme. The original's name must not appear in
the app name, store listing or ads; a comparison page is a legal question for a
lawyer in your country.

1. **For people who own their music and are tired of hearing the same songs, Spoookify
   plays the files you already have with one uniform shuffle, no algorithm and no
   ads.** Evidence: repetitive recommendations 124 reviews across 3 sources; shuffle
   78 across 3.
2. **For listeners who want music and nothing else, Spoookify plays your library with
   no ads, no podcasts and no AI artists.** Evidence: ads 76 across 3 sources;
   podcasts/non-music 28 across 2; "Will play AI artists without telling you".
3. **For desktop listeners stuck with a heavy app, Spoookify is a fast browser client
   for your own server — no install, no Electron.** Evidence: desktop/web 43 rows
   (thin, one source); slow/heavy 27 across 3.

**Recommendation: option 1.** It has the strongest evidence (two of the top themes,
both across all three sources), it is the one promise this codebase can keep without
a catalogue or a recommendation model, and it turns the product's constraint — a
personal library — into the reason to switch. Options 2 and 3 are good supporting
claims for the same landing page, not the headline.
