# Wholecrate

A fast web client for the music you already own. Point it at your Navidrome or
Subsonic server and play the whole crate, every track once. No account, no ads,
no algorithm.

## Run it

Requires Node 20+ and a server that speaks the Subsonic API.

```bash
npm install
npm run dev        # http://localhost:5173
```

Open the app, enter the server URL, username and password. The URL must be
reachable from the browser, and the server must allow this origin:

```bash
ND_CORSALLOWEDORIGINS=http://localhost:5173 navidrome
```

On Navidrome, that is the only setting the client needs. Credentials stay in
the browser's local storage and go only to your server.

## Build

```bash
npm run build      # static files in dist/
npm run preview
```

There are no environment variables. Deploy `dist/` to any static host; the
included `vercel.json` rewrites every path to `index.html` so client routes
work on refresh.

## Test

```bash
npm test           # unit (Vitest)
npm run e2e        # Playwright against e2e/mock-server.mjs
```

The E2E suite needs no Navidrome and no Docker; it drives the real app over the
Subsonic HTTP contract against a local mock server.

## What it does not do

No offline playback, no importer from streaming services, no catalogue of its
own, no accounts anywhere but your server. It streams what your server has.

## Licence

MIT — see `LICENSE`. Privacy and terms are served at `/privacy` and `/terms`.
