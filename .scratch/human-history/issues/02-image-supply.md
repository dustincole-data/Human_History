# 02 — Image supply & licence pipeline

Type: research
Status: open
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**How many usable, full-resolution, licence-clean images can this site actually get — and where does the supply run out?**

Every hard constraint on this project routes through this ticket. The site is made of real photographs; if the images don't exist at usable size under a usable licence, no amount of design fixes it. This is fact-finding, and it is deliberately **unblocked** because its answer constrains [04](04-scroll-mechanic.md), [05](05-arrival-set.md) and [06](06-visual-treatment.md) rather than depending on them.

Establish, with evidence:

1. **Re-source cost for the inherited 58.** Deep Time's `record.json` has the citations; `public/art/record/*.webp` are **160 px thumbnails, 372 KB total** and are unusable here. For a representative sample across the span, confirm the cited origin still serves a full-resolution file, and record the actual pixel dimensions available. If a cited source turns out to be dead or thumbnail-only, that item needs re-sourcing or dropping — quantify how often that happens.
2. **The thin stretch.** ~91% of the span is pre-1500 and the inherited set covers it with roughly 30 items. Determine what is realistically obtainable for **8000 BC – 1500 AD**, globally: how many distinct, well-photographed, PD/CC0 artifacts and sites exist at usable resolution. This is the project's single biggest content risk — a hard number here is worth more than any design argument.
3. **The sources themselves.** Which repositories are genuinely usable at scale, and what each one's terms actually say: Wikimedia Commons, the Met (CC0), Smithsonian Open Access, Rijksmuseum, Getty Open Content, Library of Congress, NASA, Yale/Harvard/British Museum. Note where "open" is narrower than it looks (British Museum's non-commercial terms, national heritage restrictions, EU/UK sweat-of-the-brow claims on faithful 2D reproductions).
4. **Non-Western coverage, specifically.** The Eurocentrism risk on [05](05-arrival-set.md) is really a *supply* risk — Western museums are better digitized. Measure it: for African, South Asian, Southeast Asian, Pre-Columbian and Oceanic material, how deep does licence-clean, high-resolution coverage actually go? If it's shallow, that is a finding [05](05-arrival-set.md) must design around, not discover late.
5. **Acquisition mechanics.** Programmatic access (APIs, bulk endpoints) vs. manual; rate limits; whether attribution must be rendered on-page or may live in a credits view.

**Deliverable:** a written supply report linked from this ticket, plus three hard numbers — **items obtainable pre-1500**, **items obtainable post-1500**, and **the re-source failure rate on the inherited 58** — and a stated per-item acquisition procedure with its licence-verification step.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

**The target is 200–400 items, not 58.** The chosen mechanism (ambient contemporaries) provably fails on a sparse set — at 58 items "nearest in time" reads 1,500 years apart. This ticket's numbers are therefore the project's go/no-go, not background research: **if supply cannot reach ~200 licence-clean full-resolution items, the mechanism does not work and 01 must be reopened.** Report the number plainly either way.

Two refinements to where the digging matters:

- **Weight the search post-1500, against the earlier instinct.** 01 ruled the deep head is a *fast prologue* of a dozen spectacle items, so pre-1500 no longer needs mass — it needs a small number of unmissable ones. The density the mechanism actually eats sits in **1500 → now**, and that is where a shortfall kills the site.
- **Pre-1500 supply is still worth measuring** (item 2 stands), but reframed: the question is no longer "can we fill 91% of a scroll" — it is "are there a dozen pre-1500 items strong enough to carry a prologue, plus enough beyond them to keep the honest 12,000-year claim from being a facade."

---

## Measured 2026-08-08 — the bottleneck is NOT cut-outs, it is subject selection

Prompted by Dustin: *"some are good some suck. probably have to find transparent background pictures."*
Both halves were tested against a 24-subject spread across the span. Scripts and outputs in
`prototypes/anchor-preview/` (`matte.py`).

**A. Pre-transparent images exist for only ~⅓ of subjects, and they skew away from photographs.**
Naive Commons search for PNGs with real alpha (>8% fully-clear pixels): **8 hits / 24 subjects = 33%**.
Nothing at all for Göbekli Tepe, Jōmon, terracotta army, radio. Worse, the hits **select for the wrong
kind of image** — people make transparent PNGs for diagrams and logos, not artifact photography. Of the 8:
the astrolabe and cuneiform tablet are genuine object photos, but the "Sputnik" is a **modern 3D render**,
the compass card is an illustration, and the Macintosh is a whole desk-and-placard scene. **A
transparency-first rule would quietly drift the site toward clip-art** and straight into the map's
no-generated-imagery constraint. Useful as a *preference*, unusable as a *strategy*.

**B. Matting covers the remainder.** All 16 subjects with no transparent version were sourced and matted
(rembg + isnet). Where the source photo was right, the cut is clean — the amphora, Model T, sword,
candlestick telephone, steam locomotive and Jōmon vessel are all publication-quality.

**C. The actual defect is search relevance.** The failures in that batch were **wrong subjects, not bad
cuts**:

| Query | What it returned |
|---|---|
| "vintage television receiver" | **salt-and-pepper shakers shaped like televisions** |
| "Apollo lunar module" | a Met **lunar panorama** photograph |
| "early mobile phone" | an **SVG clip-art** handset |
| "Great Pyramid Giza" | an unrecognisable dark strip |

An automated top-hit search cannot pick the right artifact. **This is an editorial job, and it belongs to
[05](05-arrival-set.md)** — the per-item record must name the *specific* artifact and ideally the
specific accession, not a search term. Budget for a human-verified item list; the automation's job is
acquisition and matting, not choosing.

**Revised per-item procedure (item 5's deliverable, first draft):**

1. **Name the artifact specifically** ([05](05-arrival-set.md)), ideally to a museum accession number.
2. Prefer a **museum open-access record** (Met / Cleveland / Smithsonian / Rijksmuseum) — CC0, clean
   sweeps, real dates and credit lines already attached.
3. Take a **pre-transparent PNG only if it is a genuine photograph or a period illustration.**
   **Reject modern renders and vector clip-art** — constraint breach, not a style preference.
   **Ruled by Dustin 2026-08-08:** period engravings, prints, diagrams and illustrations are **IN** — they
   are real artifacts of their moment, and they knock out cleanly (the 1872 press engraving and the
   Stephenson's Rocket drawing were among the cleanest cut-outs obtained). Modern renders and vector
   clip-art are **OUT**. Prefer a pre-transparent file whenever a qualifying one exists — Dustin, on the
   two contact sheets: *"transparent PNGs are good. The other one's not great."* Note that **6 of the 8
   transparent hits were photographs or period engravings**, so the quality he responded to was the
   **clean edge**, not the medium; better sourcing reaches the same place.
4. Otherwise **matte it** (`matte.py`). Verify by eye; the coverage check catches empty and full frames
   but happily passes a beautifully-cut wrong object.
5. Record source, licence, credit, and the accession URL.

## Re-cut review 2026-08-14 — Dustin's pass on the 74 `ate` keys, birefnet vs. shipped

Reviewed in `review02-recuts.html` (extends `review02.py --recuts`; source
`alt/rematte02.json` from `rematte02.py --ate`). 74/74 flagged, one of four:
**1 original** (current isnet cut stays, reject birefnet) · **2 drop / new photo** (this
photo's no good — source a different one of the same item, or drop the item) ·
**3 promote** (birefnet re-cut replaces the master) · **4 re-matte** (neither cut is right,
photo's fine, needs a third attempt). Flags also live in that page's `localStorage`
(`hh02.recut.flags`) — this is the durable copy.

**original (7):** bayeux, durerblock, greatwave, kells, rocket, tughra, vhs

**drop (28):** airjordan, apollosuit, aztecserpent, bajaj, batik2, bulb, crossbow, eniac,
enigma, funangold, godrej, jeep, safetybike, snowgoggles, spinjenny, spitfire, stainedglass,
stickchart, talwar, telescope, terracotta, trinitron, unitree, v2, visionpro, wampum,
wattengine, zero

**promote (37):** armor, asantestool, astrolabe, bairdtv, catalhoyuk, chintz, chip, corolla,
daguerreo, djembe, djidrone, dx7, embraer, floppy, gladius, hyundaipony, igboukwu, jar,
kashmir, lamassu, lustrebowl, modelt, raspberrypi, ricecooker, rubik, ruware, sasanian,
seikoquartz, strat, supercub, swissknife, tamagotchi, teddybear, tiffanylamp, tutmask, ute,
winchester

**remat (2):** dynatac, mughalmini

The 37 are **promoted** — next section. The 28 `drop` keys are unresolved supply work — this
ticket's original remit. The 2 `remat` keys need a third cut attempt, model/method not yet
chosen.

## Promoted 2026-08-14 — the 37 replace their masters, and a promotion is not a re-encode

`promote02.py` (new), then `bake_sprites.py`. **37 masters and exactly 37 sprites changed**;
the bake is deterministic, so the other 199 re-encoded to identical bytes and git shows them
untouched. Nothing was promoted that Dustin did not flag `3`, and the other three flags are
untouched.

**The re-encode the plan called for would have been wrong, and visibly.** `rematte02.py` cuts
the *whole original frame at full resolution* — armor's re-cut is 2679x4000, 9 MB — while every
shipped master is `crop(thumbnail(original, 900))` at WEBP q88/method 5 (`source5.py`). Handing
`alt/<k>.png` straight to WEBP keeps the transparent margin, and that margin is part of the box
gravity.js scales to 132 px: **the promoted objects would have arrived drawn at a fraction of
their neighbours' size.** So the frame goes back on the master's terms first — 900 px cap, alpha
bbox crop (`getbbox()` is the alpha's bbox here: rembg zeroes RGB wherever alpha is 0, verified),
then source5's encode unchanged.

**One thing the shipped pipeline never had to do, and it had to be added.** The masters were cut
from an already-downsampled photo, so nothing was ever resampled across their own alpha edge. A
re-cut is, and a straight RGBA LANCZOS pass averages the object's colour against the zeroed RGB
under the transparency — **a dark fringe around all 37, the `halo` defect this ticket's own
review surface exists to catch, manufactured by the promotion.** The resize is premultiplied.
Measured after: halo **1.54 / 1.79 / 1.68 px** on armor / bairdtv / tutmask, against the ~2 px
line the docstring draws.

Geometry moved where the mask moved, which is the point: armor 279x508 → 400x733 and bairdtv
513x291 → 839x500 (the cut stopped eating); tutmask 549x770 → 418x582 and rubik 481x527 →
366x402 (it stopped keeping). astrolabe 829x1050 → 628x794 is the **frame cap, not the mask** —
its master predates source5 and came from the 1200 px generation. Site-invisible either way: the
bake caps every sprite at 264 px tall.

**`bake_sprites.py` was dead and nobody had noticed.** It read `directions/data.js`; the file
moved to `site/` in `257a1b1`, the commit that last touched the script. It has not run since the
site root moved. Fixed to the same `../../site/` shape `review02.py` already used — path only.

**Gate chain, in order, all green.** sweep10 localhost **43/43** · sweep11i localhost **26/26** ·
production sweep10 **43/43, and it finished there** · `review02.py` re-measured all 236 and
`review02.verify.mjs` **26/26**.

**`frame_budget` went red once, and it was the machine for the fifth time.** First production
run: warm median 16.7 ms — *normal* — but p95 floor **35.9 ms** against a 25 ms gate. Production
was still serving the pre-promotion sprites, so the change could not be the cause. Re-run minutes
later, **same build, same origin**: p95 floor **19.9 ms**, worst pass 20.4, 43/43. Prod-vs-prod is
a tighter control than the origin back-to-back [06](06-visual-treatment.md) round 10 used, and it
says the same thing that round, [08](08-accessibility-and-mobile.md) round 2 and
[15](15-deploy-and-the-card.md) each said: **the laptop moves this number, the CDN never has.**
No ruling rests on the red.

Also noted, harmless: a `review02.py --serve` orphaned from the previous session still holds
8813. It is rooted in the same directory and served files byte-identical to disk (hashes
compared), so the 26/26 measured the new masters, not a stale copy.
