# Pricing

Research date: **2026-11-03**. Prices are the US list prices the vendors published
that day; they change without notice and taxes are extra. Checked by fetching the
public pages, not from memory.

## What the original charges

| plan | price / month | source |
| --- | --- | --- |
| Individual | $12.99 after a $0 first month | https://www.spotify.com/us/premium/ |
| Student | $6.99 after a $0 first month | https://www.spotify.com/us/premium/ |
| Duo | $18.99 | https://www.spotify.com/us/premium/ |
| Family | $21.99 | https://www.spotify.com/us/premium/ |

Adjacent products, for context only:

| product | price / month | source |
| --- | --- | --- |
| Apple Music Individual | $11.99 after trial | https://www.apple.com/apple-music/ |
| Apple Music Family | $19.99 after trial | https://www.apple.com/apple-music/ |
| Navidrome (the server this client talks to) | $0, self-hosted | https://www.navidrome.org/ |
| YouTube Premium | not published in fetchable HTML on 2026-11-03 — **unverified, do not cite** | https://www.youtube.com/premium |

The YouTube page is JavaScript-only and the support page rendered empty, so no
number is recorded. An unverified price is worse than no price.

## What people say about the price

67 reviews across 3 sources, average 2.8 stars on the rated rows — 13% of the 527-row
sample (`replica/feedback.md`, theme rank 4). Complaints split into three shapes:

- the free tier is unusable (ads, no offline, no skip),
- the paid tier costs more than people expect,
- the family/duo plans are hard to justify for one listener.

This is research, not testimonials. The words stay in `replica/feedback.md`.

## What Wholecrate charges

**Nothing. There is no price page, no trial, no tier, no checkout.**

| line item | Wholecrate |
| --- | --- |
| client | $0, open source |
| account | none exists |
| ads | none |
| per-seat / family / student pricing | not applicable |
| payment processing | not implemented — no Stripe, no billing code, no customer records |
| what the user pays for | their own server and storage, if they run one |

The structural reason the price complaint cannot come back: there is no billing code
to configure, no trial to expire and no upgrade button to hide. The comparison is
therefore not "cheaper than $12.99" — it is "not a subscription at all". The landing
page says exactly that and does not name a number.

## Deliberately not built

- Stripe or any payment integration. A free client has nothing to charge for.
- A donation page. It would be the only place money touches the product; add it
  later only if hosting the landing page starts to cost something.
- A paid hosted version. That would re-create the server cost as a subscription and
  put us back in the same argument.
- Licence gating, seat counts, invoices, tax handling. No customers, no records.

## Positioning rule

Do not anchor on the original's price. Anchoring invites a price comparison the
project does not need and puts the original's brand in the copy. Lead with the
structural fix: your library, your server, no subscription.

If a hosted tier is ever considered, revisit this file first: it changes the whole
pricing story, not just a number.
