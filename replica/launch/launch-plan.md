# Launch plan

Goal: **10 real people playing their own library through Wholecrate**, and one
public build that a stranger can run from the README without asking a question.
Not signups, not stars, not traffic.

Honest setup: there is no hosted instance and no account system, so "users" means
people running their own copy or using a deployment you point them at. Count them
by asking, not by instrumentation (see Analytics).

## Before launch

| item | state |
| --- | --- |
| `wholecrate.app` registered | to do — RDAP says free on 2026-11-03; register before announcing |
| Public repo + `LICENSE` (MIT) | to do — the README claims open source, so the licence must be there before the link is shared |
| README: what it is, 4 commands to run, one screenshot | partly done — check the setup section reads as a copy-paste |
| Screenshot from the real app | done — `public/landing.png` |
| Landing page live on the domain | depends on `replica-deploy` |
| Issue template: server, browser, steps, console text | to do |
| Privacy note: no analytics, no backend, credentials stay in the browser | to do — one paragraph on the landing page and in the README |
| Trademark search (class 9/42) before spending on the name | **not done** — `replica/brand.md` says so; a lawyer is the gate for paid promotion, not for a free post |

Do not announce with the trademark rows still unrun *and* money committed to the
name. A free Show HN post is fine; buying ads is not.

## Beta list (10 people, by hand)

No fake waitlist. Find people who already run Navidrome or another Subsonic server,
because they are the only people who can use this on day one.

1. The Hacker News commenters in `replica/reviews.csv` who describe a self-hosted
   setup (`id=47432067` is one; `id=43765851` runs Navidrome, `id=46443818` maintains
   a local library). Reply in the thread, do not DM-scrape.
2. Navidrome GitHub Discussions → "clients" category. Ask once, per thread rules.
3. r/navidrome — read the self-promotion rules first, then one post.
4. r/selfhosted weekly "what are you working on" thread, not a standalone ad.
5. The Subsonic forum's client list thread.
6. People who filed "web player is bad" feedback on other Subsonic clients — they
   have already stated the need.
7. One local friend with a real library and a browser, for the usability pass.
8. One person on a phone, because the layout is only tested at 390 px in CI.
9. One person with a very large library (100k+ tracks), to test the shuffle claim
   at the size where the original fails.
10. One person who does not read READMEs, to find what the setup is missing.

Ask each for: server software + version, browser, what broke, and whether they
would use it again. Permission before quoting anyone.

## Analytics and error tracking

**At launch: none.** No Google Analytics, no Plausible, no Sentry, no cookies, no
fingerprinting. A privacy-first client that ships a tracker in the same page that
asks for a server password is a contradiction.

What exists instead:

- The server's own access log (the user's machine, the user's data).
- GitHub issues for anything a user chooses to report.
- A short feedback prompt after a successful connect: "Did this work? Tell us
  what broke." — link to a new issue, no data sent automatically.

If a number is ever needed, use self-hosted Umami on the landing page only, with
the connect flow excluded from the script. Never instrument the player, the server
URL, or anything typed into the connect form. That is a later decision, written
down here so nobody adds a snippet "just to see traffic".

## Communities, in order

Ordered by how likely the audience already runs a server:

1. **Navidrome GitHub Discussions** — the exact users. Answer questions, do not
   drop a link and leave.
2. **r/navidrome** — client posts are welcome; check the current rules.
3. **r/selfhosted** — use the weekly thread; standalone launch posts get removed.
4. **Hacker News — Show HN** — the biggest reach and the harshest feedback. Post
   once, then sit in the thread for the day.
5. **Product Hunt** — secondary. It rewards a visual product, and this one needs a
   server first, so expect curiosity rather than installs.
6. **r/opensource / r/webdev** — only with a "how it was built" angle, not as an ad.

Skip: any community whose rules forbid self-promotion; any paid placement; any
"upvote my post" group. One removed post is a worse outcome than no post.

## Show HN draft

Title (≤80 chars):

> Show HN: Wholecrate – a web player for your own music, with a fair shuffle

Body:

> I have a Navidrome server and a browser, and I wanted a player that plays the
> whole library instead of the same forty songs. So I built one.
>
> The thing I cared about most is shuffle. Pressing play with shuffle on now builds
> a queue with every track exactly once, chosen track first, then reshuffles on
> each repeat pass without starting with the track that just ended. The old
> behaviour — shuffle on, pick an album, get album order — was the first bug I
> fixed. There is a unit test for the permutation and for the wrap.
>
> It is a Subsonic API client, so it works with Navidrome, Gonic, and anything else
> in that family. No backend, no account, no ads, no analytics. The server URL and
> password stay in the browser and go only to your server.
>
> What it does not do: offline playback (the files are on your server), or import
> from streaming services (there is no catalogue).
>
> Code and setup: <repo link>. Happy to answer anything about the API edge cases —
> the Subsonic spec has some sharp corners around cover art and scrobbling.

Rules for the thread: answer every technical question, do not argue about the
original's product, do not claim users you do not have, and link the repo in the
first comment as well as the body.

## Product Hunt draft

- Name: Wholecrate
- Tagline (60 chars): "Your own music library, played once through."
- First comment: the same story as HN, shorter, plus the one screenshot. Ask for
  server + browser when something breaks.

## Launch day

1. Deploy the landing page and the app; run the smoke list from `replica-test` one
   last time against the live URL.
2. Post Show HN in the morning US time, Tuesday–Thursday.
3. Reply in Navidrome Discussions and the self-hosted weekly thread the same day,
   with different wording, not a copy-paste.
4. Watch the repo issues and the server logs you can see. Fix only breakage that
   blocks connecting or playing; note everything else.
5. Post Product Hunt the next day so the two spikes do not collide.

## First 10 users

- Invite the beta list individually with a direct link and one sentence on what
  you want tested.
- Offer to sit with the first three while they connect; the setup screen is the
  most likely place to lose them.
- Ask the large-library tester to run shuffle on the biggest playlist and report
  whether every track appears before any repeats.
- After each session, write the failure in `replica/bugs.md` and fix the top one
  before inviting the next person.
- When 10 people have played at least one full track, stop recruiting and fix the
  drop-off instead.
- Ask permission before using any quote; until then there is no proof section on
  the landing page.

## After launch (30 days)

- Triage issues by "cannot connect", "cannot play", "wrong metadata", "wanted
  feature". Fix the first two before touching the last two.
- Ship one of the planned fixes only if the evidence repeats: reconnect banner
  (fix 4) if connection errors dominate, sort/filter (fix 3) if library size does.
- Do not add a price, a tier or a tracker to answer a growth problem.
- Re-run the store listing linter if the Play listing goes live; the app is not on
  the App Store, and a web wrapper would fail Guideline 4.2.

## Check

```bash
python3 /home/cat/.config/opencode/skills/replica-skill/replica-launch/listing.py replica/launch/listing.json
```
