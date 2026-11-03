# Deploy checklist: Wholecrate

Date: 2026-11-03 · Commit: `8dbc4ca` · Go from user: **not yet**

Target: static Vite build on **Vercel**, domain **wholecrate.app** (RDAP says free on
2026-11-03; the user buys it). No database, no API, no secrets. The app talks only to the
server each visitor enters.

## Preflight

| check | result |
| --- | --- |
| e2e suite | **20 passed** (`npm run e2e`, Chromium, mock Subsonic contract) |
| unit tests | **14 passed** (`npm test`) |
| no open S1/S2 bugs | pass — `replica/bugs.md` has one S3, fixed (track row label) |
| parity must-haves | **13/13 done**, feature score **66.7** (`parity.py`) |
| rebrand sweep | **Clean**, exit 0 (`sweep.py . --config replica/brand.json`) |
| store listing | **0 errors, 0 warnings** (`listing.py replica/launch/listing.json`) |
| production build | pass — 320.26 kB JS / 22.29 kB CSS (gzip 97.86 / 5.17) |
| privacy + terms | written and routed at `/privacy` and `/terms`; **live only after deploy** |
| account deletion | not applicable — there are no accounts. Clearing site data removes local state; server data is deleted on the user's server |
| favicon, titles, OG | ours: crate favicon, title + description + OG/Twitter tags, real screenshot as OG image |
| licence | `LICENSE` (MIT) added; the README claim is now true |

Any failure would stop the deploy. None failed.

### Not applicable, with reasons

- **Separate production database / backups / migrations** — there is no database. The app
  is static files; state is the visitor's `localStorage` plus their own server.
- **Env vars** — none. No `.env.example` exists because the build takes no secrets. The
  server URL is entered at runtime and never baked into the bundle.
- **Stripe live / products / webhook** — no payments, no billing code, no price. See
  `replica/launch/pricing.md`.
- **OAuth redirect URIs / Google verification** — no OAuth. Auth is the Subsonic `p`
  parameter sent to the user's own server.
- **Email sending domain / SPF / DKIM / DMARC** — the app sends no email. Add a DMARC
  `p=none` record later only if the domain starts sending mail.
- **App Store / Play submission** — no mobile build. The Play listing is prepared in
  `replica/launch/listing.json`; it is not submitted and the PWA is not built (fix 5 in
  `replica/fixes.md` is planned, not shipped). A web wrapper would fail App Store
  Guideline 4.2, so no App Store listing exists.

## User steps (Claude does not do these)

1. **Buy `wholecrate.app`** at any registrar. `wholecrate.com` is taken since 2015 and is
   not needed.
2. **Create a Vercel account** and import this repository. Framework preset: Vite. Build
   command `npm run build`, output directory `dist`. `vercel.json` already rewrites every
   path to `index.html`, so `/settings` and `/privacy` survive a refresh.
3. **Add the domain** in Vercel → Settings → Domains. Vercel shows the exact target for
   this project; use its values rather than copying generic ones.
4. **Choose the canonical host** (`wholecrate.app`) and let Vercel redirect `www` to it.
5. **Point DNS** at Vercel:

   | record | name | value |
   | --- | --- | --- |
   | A | `@` | the apex IP Vercel shows for this project |
   | CNAME | `www` | `cname.vercel-dns.com` |
   | TXT | `_vercel` (only if Vercel asks) | the verification value Vercel shows |

   HTTPS is issued automatically once DNS resolves. Enable "redirect to canonical" rather
   than serving both hosts.
6. **Run the smoke list** below with your own Navidrome server and on your phone.

If you deploy somewhere other than Vercel, two things change: the rewrite rule (Netlify
`_redirects`, Cloudflare Pages `_redirects`, or the host's SPA fallback) and the host named
in `/privacy`. Update that page before announcing.

## Post-deploy smoke (user, live URL)

- [ ] `/` shows the landing page; no console errors.
- [ ] `/settings` reachable from the CTA; `/privacy` and `/terms` open on refresh.
- [ ] SPA refresh test: open `/settings` directly in a new tab, not by clicking.
- [ ] Connect a real Navidrome/Subsonic server; CORS origin set to the live host.
- [ ] Play one full track; next/previous; seek; queue removes.
- [ ] Shuffle on, play an album: the first track is the chosen one and the queue contains
      every track once.
- [ ] Like a track, reload, the like persists.
- [ ] Phone width (390 px): no horizontal scroll, player bar reachable.
- [ ] Check the OG card in a link preview (Slack/WhatsApp/X).
- [ ] If the domain is not `wholecrate.app`, change `og:url`, `og:image` and the canonical
      in `index.html`, then redeploy.

Live audio has **not** been tested end to end here: this environment has no Navidrome and
no Docker. The Subsonic contract is covered by the E2E mock; the first real-server play is
the user's smoke test above.

## Watch (first week)

| what | how | note |
| --- | --- | --- |
| uptime | external check on `https://wholecrate.app/` every 5 min, alert to email | e.g. UptimeRobot free; do not add a script to the page |
| deploy health | Vercel deployment list + build logs | rollback is one click to the previous deployment |
| errors | GitHub issues + the user's browser console | **no Sentry, no analytics**: the launch decision in `replica/launch/launch-plan.md` forbids a tracker next to a server password |
| traffic | none by choice | do not add a snippet "just to see numbers" |
| abuse | Vercel's own request logs if the site is hammered | the app has no write endpoint to abuse |

First-week routine: check the uptime alert and the issue tracker once a day. Fix only
"cannot connect" and "cannot play" before anything cosmetic. Ask the first beta users for
server software + browser when something breaks.

## Rollback

Vercel keeps previous deployments. If the live site is broken, promote the last green
deployment, then fix on `main`. Nothing to migrate down: there is no database.

## Verdict

**Ready to deploy, pending the user's go and the account steps above.** The code is green
on every gate that can run without a host; the only untested path is live playback against
a real server, which needs the user's machine.
