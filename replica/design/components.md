# Components — 9 primitives

Ultra cut this list from 15 to 9. Anything not here is a composition, not a new
component. No raw colour, size or radius in a component: read it from
`tokens.css` (`bg-surface`, `text-muted`, `rounded-md`, `shadow-card`).

Icons: **Lucide** (`lucide-react`, MIT). No Spotify icons, illustrations or
artwork anywhere. Artwork comes from `getCoverArt` or a generated tile.

---

### Button
Variants: `primary` (accent fill, on-accent text), `secondary` (surface-2 fill,
text), `ghost` (transparent, text-muted → text on hover).
States: default, hover, focus-visible (2px accent ring, 2px offset), active,
disabled, loading (spinner replaces label, width locked).
Used: S02 S03 S05 S10 S11.

### IconButton
Square, 40px, icon 20px, `rounded-pill` for transport-style circles.
States: same as Button plus `aria-pressed` for toggles (shuffle, repeat, heart).
Accessibility: always `aria-label`; icon-only means the label is the only name.
Used: S03 S05 S08 S09 everywhere.

### Input
Used for search and the three server fields.
States: default, focus (accent border + ring), invalid (danger border + message
below), disabled. Label is always visible above, never a placeholder-only field.
Used: S02 S10 S11.

### MediaCard
Square artwork, title one line, subtitle one line, both truncate with ellipsis.
Hover raises to `surface-2` and reveals a play button in the corner.
States: default, hover, focus-visible, missing artwork (generated tile), loading
(skeleton block).
Used: S01 S04 S06.

### TrackRow
Grid: `[index|play] [title + artist] [album] [duration] [menu]`. 56px tall.
States: default, hover (row tint, index swaps to a play icon), playing (accent
title + animated 3-bar indicator), selected, disabled, dragging.
Used: S03 S05 S07 S08.

### SegmentedTabs
One control, three items max, underline moves to the active item.
States: default, hover, active, focus-visible, disabled.
Roles: `group` + buttons with `aria-pressed`. No `tablist`/`tabpanel`: the panels
are plain content swaps, so arrow-key tab semantics would be extra machinery.
Used: S02 S06.

### Dialog
Native `<dialog>` with `showModal()`. Centred panel at every width.
Focus trap and Escape come from the platform, not from us.
States: open, closing, scrollable body, busy, error.
Used: S08 queue, S10 settings, S05 playlist edit.

### EmptyState
One line of text plus one action. Never a bare "nothing here".
States: empty, error (danger text + Retry), no-results (with a "clear search").
Used: every list.

### Skeleton
One shimmer block, sized by props. Rows for tables, squares for cards.
Used: every list while loading.

---

## Rules that matter more than the components

- **Focus is always visible.** `focus-visible:ring-2 ring-accent ring-offset-2`.
- **Tap targets ≥ 44px** on touch; 56px rows already clear it.
- **Never disable zoom.** `user-scalable=no` is a bug, not a feature.
- **Motion is 120ms for state, 200ms for panels**, both under the reduced-motion
  guard in `tokens.css`.
- **One accent colour.** If two things on a screen are accent-coloured, one of
  them is wrong.
