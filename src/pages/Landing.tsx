import { Link } from 'react-router-dom'

const steps = [
  ['Run your server', 'Navidrome, or anything that speaks the Subsonic API. Your files, your machine.'],
  ['Connect it', 'Paste the URL and log in. The details stay in this browser.'],
  ['Play the crate', 'Browse, search, queue, like. Audio streams straight from your server.'],
]

const features = [
  ['One fair shuffle', 'Every track in the queue once, then a fresh pass. No weighting, no repeats at the wrap.'],
  ['Your files, direct', 'The audio comes from your server. Wholecrate never copies or re-hosts it.'],
  ['No account, no ads', 'Nothing to sign up for, nothing sold, nothing between songs.'],
  ['A queue you can see', 'Add, remove, jump and clear. The list stays where you left it.'],
  ['Playlists and likes', 'Saved to your server, so they survive a new browser or a new laptop.'],
  ['Small and quick', 'A web client, not an install. It opens in a tab and gets out of the way.'],
]

const faq = [
  ['Do I need my own server?', 'Yes. Wholecrate is a client; it reads the library your Navidrome or Subsonic server already has. It does not host music.'],
  ['Can I import my library from a streaming service?', 'No. There is no importer. Point it at files you already own and your server has scanned.'],
  ['Does it work offline?', 'No. The audio lives on your server, so playback needs a connection to it.'],
  ['Is it really free?', 'Yes. The client is open source and has no paid tier. You pay for your own server and storage, if anything.'],
  ['What about my password?', 'It stays in this browser and is sent to your server. Wholecrate has no backend to send it to.'],
  ['Why call it Wholecrate?', 'A crate is your collection. You play the whole thing, once, instead of hearing the same half twice.'],
]

export default function Landing() {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-8">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="text-sm font-semibold">Wholecrate</span>
        </div>
        <Link
          to="/settings"
          className="rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-on-accent"
        >
          Connect your library
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-8 sm:pt-16">
          <p className="text-sm font-medium text-accent">For the music you already own</p>
          <h1 className="mt-3 max-w-3xl text-display">Your music. Every track once.</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-muted">
            Wholecrate plays the library on your own Navidrome or Subsonic server. No
            account, no ads, no algorithm deciding what comes next.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/settings"
              className="rounded-pill bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent"
            >
              Connect your library
            </Link>
            <span className="text-sm text-text-muted">Free and open source. Bring your own server.</span>
          </div>
          <img
            src="/landing.png"
            alt="The Wholecrate home screen, showing album covers from a personal library"
            className="mt-10 w-full rounded-lg border border-border shadow-pop"
          />
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-8">
            <div>
              <h2 className="text-xl">Shuffle should not have favourites</h2>
              <p className="mt-3 text-sm text-text-muted">
                If you own a thousand songs, you should hear a thousand songs. Most players
                lean on the same handful and call it discovery. That is not a library; it
                is a loop.
              </p>
            </div>
            <div>
              <h2 className="text-xl">Nothing between the tracks</h2>
              <p className="mt-3 text-sm text-text-muted">
                No ad after every third song. No upsell before the album ends. No account
                to create before you can press play on music that is already yours.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-8">
          <h2 className="text-xl">Three steps, no sign-up</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map(([title, body], index) => (
              <li key={title} className="rounded-lg border border-border bg-surface p-5">
                <span className="text-sm font-semibold text-accent">0{index + 1}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-8">
            <h2 className="text-xl">What you get</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(([title, body]) => (
                <div key={title}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-8">
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl">Free, and no second tier</h2>
            <p className="mt-3 max-w-2xl text-sm text-text-muted">
              The client is open source and costs nothing. There is no trial, no per-seat
              price and no renewal email to forget. Your only cost is the server and the
              storage you already chose.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-8">
          <h2 className="text-xl">Questions</h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {faq.map(([question, answer]) => (
              <div key={question} className="py-5">
                <dt className="font-semibold">{question}</dt>
                <dd className="mt-2 text-sm text-text-muted">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-8">
            <h2 className="text-xl">Play the whole crate.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
              Point Wholecrate at your server and hear your library the way you meant it:
              once through, no repeats, no interruptions.
            </p>
            <Link
              to="/settings"
              className="mt-6 inline-block rounded-pill bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent"
            >
              Connect your library
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-text-muted sm:px-8">
        Wholecrate — open source, runs with Navidrome and Subsonic.
      </footer>
    </div>
  )
}
