# 15 — Deploy, the subdomain, and the project card

Type: build
Status: SCOPED 2026-08-11, not built. Dustin's instruction was *"Scope it before building."*
Blocked by: 05, 07 (both closed 2026-08-11). **Not blocked by 08** — see "Order" below.
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What has to be true for `everythingbreaks.dustincoledata.com` to serve this piece, and for a card
to appear on dustincoledata.com/projects?**

The map has named this the destination since the project opened. Nothing about it has ever been
ticketed, and the reason is now gone: [05](05-arrival-set.md) and [07](07-copy-voice-and-name.md)
closed the same day, so the set, the name and the copy are all final.

**Deliverable:** the site live on its own subdomain, verified against the real domain, with a card
on the brand site — and every decision below made rather than discovered at deploy time.

---

## What exists today, measured

| | |
|---|---|
| the site | `prototypes/webgl/index.html` + `gravity.js` `index.js` `shell.js` `burial.js` `decay.js` `thumbs.js` |
| the data | `prototypes/directions/data.js` — reached by the page as `../directions/data.js` |
| the pixels | `prototypes/webgl/img` **7.3 MB** (236) · `prototypes/webgl/thumb` **3.8 MB** (236) |
| everything else under `prototypes/` | **~52 MB** of pipeline, contact sheets, masters and eight `verify*/` frame folders |
| git remote | **none** |
| build step | **none.** No `package.json`, no bundler, no framework. Static files and ES modules. |

**The whole shippable site is about 11.5 MB and it is already static.** That is the good news and it
decides most of what follows: there is nothing to build, so the only real questions are *what the
root is*, *what is excluded*, and *how it gets there*.

---

## The seven decisions, in the order they bind

### 1. The site root — the one structural change

The page lives two directories down and reads its data out of a **sibling** directory
(`../directions/data.js`), which is a prototype layout, not a site. A deploy needs `/` to be the
piece. Three ways, and they are not equivalent:

- **(a) Move the shippable files into a `site/` directory** and point Vercel's output there. The
  page's own relative paths (`img/`, `thumb/`) survive untouched; only `../directions/data.js`
  changes. Costs one commit of `git mv` and one edit.
- **(b) Leave the tree and use Vercel rewrites** to map `/` → `/prototypes/webgl/index.html`. No
  file moves, but the whole 63 MB `prototypes/` tree is uploaded and *reachable* — including every
  `verify*/` folder and the 43 MB pipeline — and the harness's only URL stops being the deployed
  URL, which quietly ends the guarantee that the gates test what ships.
- **(c) A build step** that copies the shippable subset. A build step for a site with no build.

**Recommend (a).** (b) fails the one thing that matters most here: **the gates must run against the
same paths that ship.** Every sweep in `harness/` is written against `/webgl/index.html` on 8812, and
whichever layout is chosen, the harness's URL and the deployed URL have to become the same shape or
43 green gates stop meaning the site is green.

**Whatever is chosen, `data.js` is generated** — `build_data.py` writes it and `bake_sprites.py` /
`bake_index.py` write `img/` and `thumb/` from `directions/img`. Those three scripts' output paths
move with the files, and they are the only things that know where the site lives.

### 2. What is deliberately NOT uploaded

`prototypes/directions` (43 MB of masters, contact sheets and pipeline), `prototypes/anchor-preview`,
and the eight `verify*/` frame folders (**42 MB**) are the project's evidence, not the site. They
stay in the repo — they are what every ticket's claims rest on — and they are excluded from the
deploy. A `.vercelignore`, or decision 1(a) making it moot.

### 3. Fonts

`index.html` loads **Archivo from Google Fonts** as a render-blocking `<link>` to a third-party
origin. Decide: self-host the two or three weights actually used, or keep the CDN. Self-hosting
removes a third-party request and a DNS round trip on first paint; **07 measured every piece of
furniture on this page against a collision contract at specific pixel widths**, so a font that
arrives late or falls back is not cosmetic here — it moves the boxes the gates measure. Check what
the sibling projects do and match, rather than deciding it fresh.

### 4. The things a deployed page has that this one does not

Four, and all four are absent today (`grep` for `favicon|og:|twitter:|description` returns **0**):

- **A favicon.** [05](05-arrival-set.md)'s own "named limits" records *"no console errors beyond the
  pre-existing favicon 404"* — the 404 has been in every run since.
- **`<meta name="description">`.**
- **Open Graph / Twitter card tags**, and the image they point at.
- **The social image itself.** The map's "not yet specified" says the sendable unit is a planted
  callout line rather than a finale still, and that the card is *"probably a treated arrival or an
  index still"* — still unsettled. **This is the only genuinely undecided thing in the whole
  ticket**, and it is a small design job, not a build one. The scars are known: on
  `what-actually-kills-you` the OG image embedded the hero lede, so the lede became load-bearing.

### 5. Hosting and the push path

No git remote today, and the sibling projects split two ways: some auto-deploy on push, some do not
and need `npx vercel --prod --yes`. **Decide which this is and write it down in the repo**, because
the failure mode is silent — the memory of at least three of these projects is *"push ≠ deploy"*.

Also settle: create the GitHub remote (the repo has never had one), or deploy from the working copy
with the Vercel CLI as `why-do-they` does.

### 6. DNS

`everythingbreaks.dustincoledata.com` — checked free by [07](07-copy-voice-and-name.md) round 1
against all ten shipped subdomains. One Namecheap CNAME to Vercel. **This is the step that has left
a finished project un-live before** (`directed` is deployed and still un-CNAMEd), so it is a line
item, not a footnote.

### 7. The project card

One card on dustincoledata.com/projects. **The known trap is not the card, it is the file**: a single
project array with `featured: 1-6` drives both the homepage and the projects page, and editing it
from a **stale working copy silently deletes other people's cards**. So: pull fresh immediately
before the edit, and diff the array afterwards. Needs a title, a one-line, a thumbnail, and the href.

---

## Verification — the part that is easy to fake

- **Curl the real domain**, not the per-deployment URL. A Vercel per-deployment URL returns **200
  with an SSO page** on these projects, so a status check against it proves nothing.
- **Re-run `sweep10` and `sweep11i` against the deployed origin**, not just localhost. Everything the
  harness has ever measured has been served by `python -m http.server` with no latency, and
  [03](03-engine-reuse-or-clean-build.md) already found **three gates that were green with their own
  code deleted because localhost is never late.** `--slow` exists for exactly this and a real CDN is
  the first time it is not a simulation.
- **Grep the live HTML for something only this build has** — the deploy-verification lesson from two
  sibling projects.

## Order

**08's real-device phone pass does not block this and should not wait for it.** A phone gate wants a
URL a phone can open, and today there is none — the piece is on `localhost:8812`. Deploying first
turns the phone pass from a tunnelling exercise into opening a link, and anything it finds is a fix
on a live site rather than a reason not to have one.

## Out of scope

- **The inbound link from Deep Time.** [14](14-the-ending-and-the-frame.md) built the outbound half
  and the map rules Deep Time out of scope; the other half is Dustin's, on a shipped site.
- **Renaming the repo.** `Human_History` stays, ruled by [07](07-copy-voice-and-name.md).
- **Analytics, cookie banners, anything that collects.** No sibling project has any.

---

## Round 1, 2026-08-12 — SHIPPED. And the name changed on the way out.

**Live at `timetakesall.dustincoledata.com`** (CNAME pending Dustin), served now from
`https://time-takes-all.vercel.app`. All seven decisions made, two of Dustin's calls taken, and the
gates re-run against the deployed origin rather than localhost.

**The name is TIME TAKES ALL**, ruled by Dustin mid-session, superseding [07](07-copy-voice-and-name.md)
round 1's EVERYTHING BREAKS — which was a decay-family candidate 07 itself had listed (*Time Takes
Everything*). Two consequences are recorded rather than acted on, because both are copy and copy is
his: [14](14-the-ending-and-the-frame.md)'s ending (*the last object never breaks*) was an argument
FOR the old title and sits slightly against this one; and the intro's last clause — *"until the
ground has taken all of it"* — is now **the title said twice on one screen**, which is the exact
defect 07 fixed in the other direction when it cut `Everything that lands breaks`.

### The seven decisions

1. **The site root — (a), as recommended.** `site/` is the deploy root and the harness's URL and the
   deployed URL are now the same shape: `/webgl/index.html` on a server rooted at `prototypes/`
   became `/index.html` on a server rooted at `site/`, which is exactly what Vercel serves at `/`.
   `data.js` moved with the page it is read by; `build_data.py`, `bake_sprites.py`, `bake_index.py`
   and `measure.py` moved their output and input paths with it.
2. **Not uploaded:** `/prototypes` and `/.scratch`, via `.vercelignore`. Verified from outside —
   `/prototypes/directions/sourced.json` **404s on the live origin**.
3. **Fonts: self-hosted**, matching Deep Time and Cascade rather than deciding fresh. Three variable
   subsets (latin, latin-ext, vietnamese — the set contains Jōmon, Vinča and Đông Sơn), 81 KB. **The
   page now makes zero external requests.** Not cosmetic: a sweep reddened `no_console_errors` on a
   **404 from fonts.gstatic.com for a file Google's own stylesheet had just named**.
4. **Favicon, description, OG/Twitter, and the image.** The image was the ticket's one genuinely
   undecided thing: Dustin picked the direction (a slice of the shelf), then picked from four
   rendered candidates. **The 1972–1996 bands won** — Polaroid, Rubik's cube, AE-1, Atari, Walkman,
   TR-808, Macintosh, Air Jordan, Game Boy, Tamagotchi, Nokia 3310, iPhone, Raspberry Pi. That is
   [01](01-the-fun-thesis.md)'s payoff (recognition density) rather than the site's subject, and it
   avoids the `what-actually-kills-you` scar: **no copy is embedded in it**, so no line becomes
   load-bearing. A wordmark was tried on three placements and abandoned — the shelf is dense by
   design and has no clear band for one.
5. **Hosting: push auto-deploys, and it was VERIFIED rather than assumed.** GitHub remote created
   (`dustincole-data/Human_History`, public like Namesake and Cascade), Vercel project
   `time-takes-all` connected to it. A commit was pushed with no CLI deploy and **a new production
   deployment appeared 19s later on its own.** Written into the repo's `README.md`, because at least
   three siblings are the other way and the failure mode is silent in both directions.
6. **DNS.** `timetakesall.dustincoledata.com` checked free, added to the project.
   **CNAME → `8eb94db628297813.vercel-dns-017.com.`** — the same per-project shape every sibling
   uses. **The one step that needs Dustin**, and the one that has left a finished project un-live
   before (`directed`).
7. **The card.** On `/projects` only, no featured slot, so nobody is demoted. The file was pulled
   fresh immediately before the edit and diffed after: **23 titles in, 24 out, none removed,
   `featured: 1-6` byte-identical.** Live and confirmed with the other cards still present.

### Verification — against the real origin, not localhost

`HH_BASE` now overrides the harness's base URL, which is what the whole site-root move bought.

- **`sweep11i` 26/26 green against the deployed CDN.**
- **`sweep10` 42/43 on localhost** — the one red is below. **Against the deployed origin it did NOT
  finish**, and that is the honest result rather than a number: 34 green, **two red**, and then a
  crash. Both new facts are about the network, which is the whole reason the ticket asked for this
  run.
  - **`frame_budget` is red only against the real origin** — warm median 16.4ms but **p95 floor
    25.7ms and a worst pass of 47.1ms**, against the same gate that passes on localhost. The
    plausible mechanism is exactly what `--slow` was built to simulate and could not: on 127.0.0.1
    every photograph is ready before it is needed, so cutting work never lands on a scrolling frame,
    and on a real CDN it does. **Not attributed yet, and it must be** — the machine was running
    several other sessions during this pass, so load is a live alternative explanation. It wants one
    quiet re-run against each origin before anyone believes either number.
  - **The sweep then crashed**: `era 196: never found an empty sky`. Round 9's sky probes require a
    frame with nothing in the air, and `settle()` gave up finding one. That is a harness limit
    reached only over real latency — the instrument, not the page, for the fifth time this project.
  - So: **the shelf is verified against production and the piece is not.** Seven of `sweep10`'s
    gates never ran there.
- The live HTML greps for four things only this build has (`timetakesall`, `fonts/archivo-latin.woff2`,
  `favicon.svg`, `src="data.js"`), and the ShareAlike sentence is in the shipped `index.js`.
- **The per-deployment URL returns 302 to an SSO page**, exactly as the ticket warned. The project's
  production alias does not, and that is what the gates ran against.

### The red, and Dustin's ruling on it

**`no_text_collision_390` is red at 236 items: 8 overlaps over 321 stops**, all in the crowded tail
on a 390px phone, credit words from different objects landing on each other by 3–10px. **It was
green at 230** — [05](05-arrival-set.md)'s six new tail items filled the phone's soil band.

It is not a knife-edge, and that had to be established because the gate is on record as one: its own
comment says a single overlap taken one rAF apart is machine timing. **Two independent passes
returned byte-identical overlaps — same stops, same pairs, same pixel values.**

The cause is a designed fallback, not a bug: `put()` walks a word down then up inside its band and,
finding nothing clear, *"prints where it was — a credit is the contract, and an overlap is a bad
frame while a missing citation is a breach."* At 236 the phone's ~245px of soil is full.

**So the fix is a ruling, not an edit** — on a phone with full soil, either a citation drops, the
band changes, or the type shrinks — and it lands on [06](06-visual-treatment.md)/[10](10-the-index-surface.md)/[11](11-visual-anchor.md),
the same surfaces as [08](08-accessibility-and-mobile.md)'s URL-bar fix. **Dustin ruled: ship now,
08's next round rules it.**

### What the harness cost before any of this could be measured

`sweep10` died four times in a row at the same line and it looked exactly like a hung static server.
It was not. **A phase gets a new page, not a navigation** — full write-up in the harness README, plus
the false green that was caught before it ran (a new page defaulting to 1440×900 would have run the
phone gates at desktop width). `serve.py` is a real fix for a different real limit and it did not fix
the hang.

### Still open

- **The CNAME** (Dustin's, above) — until it lands the real domain does not resolve and the card's
  href 404s at DNS.
- **`no_text_collision_390`** → [08](08-accessibility-and-mobile.md)'s next round, with the two
  URL-bar reds.
- **The title echo in the intro's last clause** (above) — copy, so Dustin's.
- **`frame_budget` against the real origin, and the sky-probe crash at era 196** — one quiet re-run,
  localhost and deployed back to back on an idle machine, decides whether the CDN moved the frame
  budget or the machine did. **Seven of `sweep10`'s 43 gates have never run against production.**
- **The real-device phone pass** — now just opening a link, which is what deploying first was for.
