import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

const updated = '3 November 2026'

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <Link to="/" className="text-sm font-semibold text-accent">
          Wholecrate
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">Last updated {updated}.</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-muted">{children}</div>
      </main>
    </div>
  )
}

export function Privacy() {
  return (
    <Page title="Privacy">
      <section>
        <h2 className="text-base font-semibold text-text">There is no account and no backend</h2>
        <p className="mt-2">
          Wholecrate is an open-source web client. It has no server of its own, no user
          accounts and no database. Nothing you enter is sent to the people who make it.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">What stays in your browser</h2>
        <p className="mt-2">
          Your server address, username, password and last playback position are stored in
          this browser&rsquo;s local storage so the app can reconnect. They are sent only to the
          server address you enter, as part of the Subsonic API requests. Audio is streamed
          directly from that server.
        </p>
        <p className="mt-2">
          Clearing this site&rsquo;s data in your browser removes all of it. Anything held by the
          server (playlists, favourites, listening history) is deleted through that server.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">What is not collected</h2>
        <p className="mt-2">
          No cookies are set. No analytics, advertising, crash reporting or tracking scripts
          run. No data is shared with a third party. There are no third-party fonts, images or
          embeds on the page.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">Hosting</h2>
        <p className="mt-2">
          The static files are served by Vercel Inc., which processes request logs (such as IP
          address and user agent) to deliver and protect the site. See{' '}
          <a
            className="text-accent underline"
            href="https://vercel.com/legal/privacy-policy"
            rel="noreferrer"
          >
            Vercel&rsquo;s privacy policy
          </a>
          . Your music server is operated by you or someone you chose, not by Wholecrate.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">Contact</h2>
        <p className="mt-2">
          Questions or a privacy problem: open an issue in the project repository. Do not
          include passwords or server addresses in a public issue.
        </p>
      </section>
    </Page>
  )
}

export function Terms() {
  return (
    <Page title="Terms">
      <section>
        <h2 className="text-base font-semibold text-text">Free and open source</h2>
        <p className="mt-2">
          Wholecrate is released under the MIT licence. You may use, copy, modify and
          redistribute it under that licence. There is no paid tier, trial or subscription.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">Your music stays yours</h2>
        <p className="mt-2">
          The software plays files from a server you control. You are responsible for having
          the right to those files and for how your server is run and secured. Wholecrate does
          not host, sell or supply music, and does not operate your server.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">No warranty</h2>
        <p className="mt-2">
          The software is provided &ldquo;as is&rdquo;, without warranty of any kind, express or
          implied, including fitness for a particular purpose. The authors are not liable for
          lost data, interrupted playback or any other damage arising from its use.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">Acceptable use</h2>
        <p className="mt-2">
          Do not use Wholecrate to break the law, to access a server you are not allowed to
          access, or to distribute music you do not have the rights to.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-text">Changes</h2>
        <p className="mt-2">
          These terms may change with the software. The current version is always this page,
          and the licence text in the repository takes precedence over it.
        </p>
      </section>
    </Page>
  )
}
