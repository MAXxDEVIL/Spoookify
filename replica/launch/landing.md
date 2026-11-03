# Landing page

Built at `src/pages/Landing.tsx`, shown only when no server is configured (`/`).
Every claim below is something the shipped code does today. Nothing waits on the
PWA, the reconnect banner, queue reorder or library sort (`replica/fixes.md` fixes
2–5), so none of those is mentioned.

Screenshot: `public/landing.png`, captured from the real app against
`e2e/mock-server.mjs` at 1440×900. No mockup, no invented library.

## Hero

- Eyebrow: **For the music you already own**
- Headline: **Your music. Every track once.**
- Line under it: Wholecrate plays the library on your own Navidrome or Subsonic
  server. No account, no ads, no algorithm deciding what comes next.
- Button: **Connect your library**
- Note beside the button: Free and open source. Bring your own server.
- Screenshot alt: "The Wholecrate home screen, showing album covers from a personal
  library"

Why this headline: the angle is option 1 in `replica/fixes.md` (own your library,
uniform shuffle, no algorithm, no ads). "Every track once" is the promise the
shuffle fix in `src/state/player.tsx` actually keeps; the old copy would have been
a lie on a fresh album play.

## The problem

Two panels, paraphrased from the top themes, no reviewer quotes:

1. **Shuffle should not have favourites.** If you own a thousand songs, you should
   hear a thousand songs. Most players lean on the same handful and call it
   discovery. That is not a library; it is a loop.
   Evidence: repetitive recommendations 124 reviews / 3 sources; shuffle 78 / 3.
2. **Nothing between the tracks.** No ad after every third song. No upsell before
   the album ends. No account to create before you can press play on music that is
   already yours.
   Evidence: ads 76 / 3 sources.

## How it works

Three steps, mirroring the connect flow:

1. **Run your server** — Navidrome, or anything that speaks the Subsonic API. Your
   files, your machine.
2. **Connect it** — Paste the URL and log in. The details stay in this browser.
3. **Play the crate** — Browse, search, queue, like. Audio streams straight from
   your server.

## What you get

Six claims, each checked against the build:

| claim | where it lives |
| --- | --- |
| One fair shuffle — every track once, then a fresh pass, no repeat at the wrap | `src/state/player.tsx`, `player.test.ts` |
| Your files, direct — audio comes from your server; nothing is copied or re-hosted | `streamUrl()` in `src/lib/subsonic.ts` |
| No account, no ads — nothing to sign up for, nothing sold | no backend, no ad code |
| A queue you can see — add, remove, jump, clear | `QueueSheet`, `f02-queue.spec.ts` |
| Playlists and likes — saved on the server, survive a new browser | `createPlaylist` / `star`, `f03`/`f04` |
| Small and quick — a web client, not an install | 315 kB JS / 22 kB CSS, opens in a tab |

Deliberately absent from the page: offline playback, installability, drag-reorder,
automatic reconnect, library sorting, lyrics, lossless. They are planned in
`replica/fixes.md` but not shipped, so they are not advertised.

## Free, and no second tier

The client is open source and costs nothing. There is no trial, no per-seat price
and no renewal email to forget. Your only cost is the server and storage you
already chose.

The page never says "free trial", "premium", "upgrade" or "unlimited" — there is no
paid tier to upsell and no trial to expire.

## Questions

Six FAQs, written to pre-empt the real objections:

1. Do I need my own server? — Yes; Wholecrate is a client, it does not host music.
2. Can I import my library from a streaming service? — No; there is no importer.
3. Does it work offline? — No; audio lives on your server, playback needs a
   connection to it.
4. Is it really free? — Yes; open source client, no paid tier, you pay for your own
   server and storage.
5. What about my password? — It stays in this browser and is sent to your server;
   there is no Wholecrate backend to send it to.
6. Why call it Wholecrate? — A crate is your collection; you play the whole thing,
   once, instead of hearing the same half twice.

## Final call to action

**Play the whole crate.** Point Wholecrate at your server and hear your library the
way you meant it: once through, no repeats, no interruptions. → Connect your library.

Footer: "Wholecrate — open source, runs with Navidrome and Subsonic."

## Rules kept

- No testimonials, star ratings, user counts, press logos or "trusted by" rows. A
  beta quote goes here only with permission and a real name.
- No reviewer wording used as marketing copy.
- The original's name never appears in the page, the title or the metadata.
- Both CTAs go to `/settings`, which renders the connect screen when no server is
  configured. `e2e/f07-landing.spec.ts` asserts that path and runs axe on the page.

## Check

```bash
python3 /home/cat/.config/opencode/skills/replica-skill/replica-launch/listing.py replica/launch/listing.json
python3 /home/cat/.config/opencode/skills/replica-skill/replica-brand/sweep.py . --config replica/brand.json
```

Axe and the CTA path are covered by `npm run e2e` (F07).
