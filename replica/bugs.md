# Bugs: Spoookify

Build: 76e2b5f  Date: 2026-11-03  Env: local, mock Subsonic fixtures, Chromium headless 156

### BUG-001: track row play button fails WCAG 2.5.3 (label in name)

- Severity: S3 (accessibility, blocks the axe gate on album/playlist pages)
- Flow / case: F03-H1, also present on F01, F02, F06 album views
- Screen: S03 album, S05 playlist, S07 liked
- Build: 76e2b5f  Browser / device: Chromium headless 156, 1280x900

Steps
1. Open any album or playlist with at least one track.
2. Run axe-core `label-content-name-mismatch` on the page.

Expected: the play button's accessible name contains its visible text (the track number), or the number is not treated as the button's label.
Actual: visible text is "1"/"2"/"3" while `aria-label` was "Play <title> by <artist>", so axe reported 3 serious violations per page.

Evidence: `test-results/f03-playlist-.../error-context.md` from the first E2E run; rule `label-content-name-mismatch`, target `button[aria-label="Play Neon Hours by The Signals"]`.
Suspected cause: the row number and the hover play icon share one button, and the label omitted the number.
Status: fixed — label now ends with `, track <n>`; F03-H1/F01-H1/F06-H1 axe assertions pass.

## Not app bugs (test-side issues fixed at the test)

- Strict-mode locator collisions: footer transport "Play" vs album hero "Play"; `Queue` vs `Add … to queue`; bare text "Field Notes"/"Neon Hours" matching title and album cell; `/The Signals/` matching album cards instead of the artist card.
- F05-H1 seeded `localStorage` after pressing play, so the `pagehide` save overwrote the seed on reload. The test now seeds before reloading.
- F05-E1 assumed a hero Play button on Home; it now drives the footer transport.
