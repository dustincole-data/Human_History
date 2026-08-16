# 02 — Image supply & licence pipeline

Type: research
Status: closed
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

## Lane B 2026-08-14 — the 28 `drop` keys: 16 replaced, 12 gone, and the set is 224

`resource02.py` (new). Six candidates per key, hand-authored queries, rendered one key per row
beside the photograph they would replace and chosen by eye — `--cut` only ever runs on an index
named off the sheet. **The three hard numbers this ticket owes are now answerable for a
re-source rather than a first source: 28 attempted, 16 replaced, 12 with no usable second
photograph — a 43% failure rate on re-sourcing a photograph the editorial pass had already
approved once.**

**Replaced (16):** aztecserpent · bajaj · bulb · eniac · enigma · funangold · jeep · safetybike ·
snowgoggles · spitfire · stainedglass · talwar · trinitron · v2 · visionpro · wampum
**Dropped (12):** airjordan · apollosuit · batik2 · crossbow · godrej · spinjenny · stickchart ·
telescope · terracotta · unitree · wattengine · zero

**The 43% is not search-quality, and five of the twelve prove it.** Seven died on the sheet, on
the photograph. Five died only once the mask existed — the crossbow that was a close-up of its
inlay, the Qin warrior cropped at the hip, the Zero available whole exactly twice (once beside a
traffic cone, once trailing display smoke), the stick chart whose best-contrast photograph is the
one already shipped, the Galileo telescope whose only candidate file is 400x300. **The corpus
offers the FAMOUS objects as a crowd, a detail, or an object standing in a place**, because that
is how a visitor photographs them; the open-access museums that solve this for a Ru ware bowl
hold no Spitfire. R4 moves the right way anyway — Western 35.6% -> 34.8%, since 6 of the 12 are
EUR/NAM.

**Two records changed because the new accession carries its own date, and one refused to.**
`stainedglass` was picked BECAUSE of its date: the panel that looked right is Met ca. 1505-08
against a row claiming c. 1200, and the Met's fragment is 1200-1215 — so the honest candidate and
the best silhouette were the same file, a head of Christ with a broken edge against six
rectangles (the panel cut first and measured cov 0.93; the fragment 0.73). `snowgoggles` nearly
moved 750 years — the Met's ivory goggles are ca. 800-1200 and were the only candidate carrying
an object date at all — and did not, because the Met photographs them on a mount pin and the cut
keeps the pin. **A date upgrade is not worth a spike under the object.**

### Four dead paths, and `257a1b1` is three of them

`bake_index.py` read `HERE/data.js`. **The file moved to `site/` in `257a1b1` and this script has
exited "no keys in data.js" ever since — so `site/thumb/` still held the PRE-PROMOTION cuts for
all 37 keys promoted the same day, on the one surface that shows every item at once.** That is
the identical bug found in `bake_sprites.py` hours earlier, in the same commit, unlooked-for. The
harness README was the third: it still said serve `prototypes/` on 8812 and open
`/webgl/index.html`, while `sweep10.mjs` builds `HH_BASE + '/index.html'` — serving what the
README says gives every sweep a 404. The fourth is not `257a1b1`'s: **neither bake pruned its own
output**, so a dropped item's sprite and thumbnail stayed in the deploy root forever — uploaded,
public, and invisible to every gate, because the gates measure what the page LOADS. Both prune
now, and both printed the same twelve keys.

### Three gates carried the number 236 as a literal

- `review02.verify.mjs`: `cells === 236`. Now read off `site/data.js` — an independent file from
  the `review02.json` the page renders, so the assertion is "every shipped item has a measured
  cell" rather than a number someone retypes per ruling.
- `sweep10.mjs` `ERAS = [6, 40, 150, 196, 226]`: five item INDICES spanning the lamp ramp. At 224
  the fifth is `y=undefined`, the walk lands back at the top, and **`backdrop_is_dated` and
  `stars_go_out` both went red reporting the deep-past sky as the LED era** — a wrong-looking
  failure with nothing wrong behind it. It was `N - 10` all along (226 at 236 items, exactly);
  production still samples 226 and reads reach 0.975.
- `review02.py`'s progress line printed `/236`. Cosmetic, same rot.

### `tie_cuts_are_true`, and a gate that asserted more than the piece claims

Red at 224: 14 stops, one tie — **katar→pieceof8, a 50-year miss whose line came out 65.6px when
51 segments need 73.7px at the drawn floor.** Dropping twelve items re-spaced the soil and moved
two objects 8px closer. Verified as caused: HEAD's 236-item build has none.

The gate demanded `segments === gap+1` unconditionally. `gravity.js` does not claim that — it
floors the pattern at seg 1.2 / cut 0.25 and says so in its own comment: *"where the span is too
short to hold that many breaks the line degrades to a dotted trace, which still says the only
thing that matters at eighty years."* No set had ever produced a short line, so the gate had
never had to read the second half of its own contract. It now asserts both: an exact count
wherever the span can carry it, and **the documented floor — not some other wrong period —
wherever it cannot**, with the degraded count printed so a set change that quietly turns ten ties
into dotted traces is visible.

**This is a gate edited to go green, so it was proved against the build that predates the
change: HEAD's 236 items pass it at 43/43 and report ZERO degraded** — byte-for-byte the same
verdict the unconditional form gave. It is not weaker on the old set; it is defined on a case the
old set never reached.

**And the first draft of that clause was wrong, which the production run caught.** It condemned a
0.92px tie on the DEPLOYED build: `truth 0`. A same-year tie is the other half of the encoding —
one unbroken hairline, `gap > 0 ? [seg, cut] : []`, no dash set, count 1 at any length. Reading
the floor onto it failed a line that is exactly right. **The production leg is in the chain
before the push and not after it, and this is what that buys.**

**Gate chain, in order, all green.** sweep10 localhost **43/43** · sweep11i localhost **26/26**
(224 cells, 224 credits in the roll) · production sweep10 **43/43** · `review02.py` re-measured
224 and `review02.verify.mjs` **26/26**. `frame_budget` was clean on every leg this time,
including production — 16.5ms warm median, p95 floor 19.6ms.

Still open, untouched: the 2 `remat` keys (dynatac, mughalmini) need a third cut method.

## Lane B round 3 2026-08-14 — five items return, and the periods were never empty

*(Transcribed from `8c134ea`, which was the record for this round until now.)*

Dustin's ruling inverted the search: **a slot is a PERIOD, not the dropped object.** Stop
re-sourcing the twelve dropped objects; ask the open-access museums what they already photograph
well inside a date window, and choose the object from what exists. Supply is the binding
constraint, so it should drive the choice rather than be discovered after it.

Six periods produced picks and Dustin approved all six. **Three did not survive the check that
should have run FIRST — the twelve drops did not leave twelve holes.** The set is dense and the
drops mostly removed redundancy: c. 1500 already carries Gothic plate armour, an Ottoman turban
helmet at exactly 1500, a Ming jar, an Aztec serpent and a Japanese blade, so a German armet was a
duplicate. A Javanese kris at 1400 was already live against a Javanese sword at 1750; a consumer
quadcopter at 2013 already live against a DJI Mavic Air 2. All three backed out. It surfaced by
accident: `heitiki` came back UPDATE rather than NEW, because a Māori hei-tiki **is already in the
set at c. 1850** — the Oceania pick both clobbered a live record and duplicated a live object.
Master restored from git, record from the pre-write backup. Nothing else in the batch had been
checked against the live set at all.

The five that ship sit in **measured** gaps: `hanbear` (c. 202 BCE, Cleveland CC0) · `marsbronze`
(1584–87, Cleveland CC0) · `britannia` (c. 1756, Cleveland CC0) · `wattengine` (1782, LOC —
REVIVED) · `airjordan` (1989, Commons CC0 — REVIVED). Both revivals are lane B conclusions that
were sound and too narrow: no Jordan 1 can carry 1985, but the slot is mid-80s American sport and a
IV carries 1989 honestly; and lane B asked three of the nine repositories item 3 names, while LOC
holds Watt's plate under a title the Commons-shaped must-list rejected outright. The Watt record is
renamed for what the file IS — a specification plate — rather than pretending to be a photograph of
an engine.

Two walls worth keeping. **Art museums stop explaining a period at about 1900:** Cleveland's Japan
1900–1950 is 28 clean CC0 export vases, perfect supply and zero relevance to 1940; India 1880–1960
collapsed to one Kashmir shawl. Same wall `build_data.py` hit on 2026-08-11, reached from the other
side. **NASA is a mission archive, not an object archive:** its six hits titled "Armstrong Apollo 11
Spacesuit Unveiling" are press-conference photographs of officials at podiums, no suit in frame.
Apollo object photography is at NASM, the key-blocked source.

`ERAS` needed no edit — it has been `N - 10` since the last session and re-sampled itself at 219.
Gate chain all green: sweep10 localhost 43/43 · sweep11i 26/26 (229 cells, 229 credits) ·
production sweep10 · `review02.py` re-measured 229 · `review02.verify.mjs` 26/26. `frame_budget`
went red on the first localhost run and green minutes later on the same build and origin — **sixth**
time on this laptop, never on the CDN.

## Round 4 2026-08-15 — `vhs` re-cut, and the `1` flag was never an endorsement

Dustin caught `vhs` on the live site: ragged bottom edge, a stray flange bottom-left. It was not
touched in round 3; it last changed in `257a1b1`. It survived because the 2026-08-14 review flagged
it `1` — **and `1` means "keep the original", which is a verdict between two cuts, not a statement
that either is right.** Seven keys carry that flag. **All seven are defective.**

|  | isl | islfrac | holes | holefrac | what the eye sees |
|---|---|---|---|---|---|
| bayeux | 17 | **0.326** | 16 | 0.129 | linen gone, figures shredded and floating |
| greatwave | 21 | 0.198 | 5 | 0.053 | wave in islands, cartouche adrift |
| tughra | 2 | — | **38** | **0.412** | the illuminated oval eaten to confetti |
| kells | 0 | — | 17 | 0.122 | vellum punched through |
| durerblock | 0 | — | 10 | 0.057 | holes through the rhino's head, feet missing |
| rocket | 0 | — | 0 | — | paper kept, sky shredded, hard clipped edge |
| vhs | 0 | — | 0 | — | **top band, bottom edge and most of the shell gone** |

`vhs` is the worst of them by eye and the only one that scores clean, because its defect is the one
`measure()` cannot see: the mask did not perforate the object, it **ate** it, and what Dustin read
as a stray flange is the one surviving corner of a bottom edge that is otherwise gone. The
instrument has no term for "the silhouette is smaller than the object" — Dustin's eye is still the
only gate on that, which is why the review surface exists.

### The models were not failing, they were answering a different question

`matte.py` used isnet and `rematte02.py` used birefnet, and **both are salient-object models.** They
find *the subject*: on a woodblock print that is the ink, so the paper goes; on a tapestry the
figures, so the linen goes; on a black cassette against white the two bright reel windows and the
label, so the shell goes. Every one of these images is an object photographed against a **uniform
ground**, which is not a salience problem at all. It is background removal, and it has an exact
answer. Two models disagreeing about the same wrong question is why a flag between them settled
nothing.

`recut02.py` (new) is the third method and there is no model in it: sample the ground off the border
ring, take each pixel's distance from it, ramp the alpha across a soft band for an antialiased edge.
Then the one rule that does the work — **transparency is only allowed where it is connected to the
image border.** Ground colour enclosed by the object is INTERIOR and stays: the paper inside Dürer's
rhino, the cream inside the tughra's oval, the white highlight on a VHS reel hub. Neither model had
a way to express that constraint, and it is precisely why they punched holes.

**The reach has to cross the ramp, not just the flat background.** Seeding the flood on `d <= lo`
alone leaves every interior highlight ringed with half-alpha — the first cut of `vhs` came back with
both reel hubs punched through, for the same reason the promotion pass manufactured a dark fringe on
all 37: an edge rule applied to one side of a boundary and not the other. `binary_propagation`
through `d < hi` fixes it.

`vhs` shipped: **cov 0.734 → 0.993, halo 0.95px, 0 islands, 0 holes**, whole cassette, top band
back, bottom edge straight. Master 883x345 → 900x494, and that aspect change is the fix showing its
work — the old sprite was a fragment scaled to the same 132px height as everything else, so the
cassette was drawn about 1.4x too large as well as broken. `thumbs.js` moved `vhs:[410,160]` →
`[291,160]`, the only line in it that changed.

### Two modes, because a flat artwork has two honest readings

`ground` (the sheet is the object) and `ink` (threshold higher, close the gaps between strokes, fill
what they enclose). For a 3-D object on white they are the same picture and it is simply the true
silhouette. For a print they are **not**, and neither is automatically right: `ground` gives
greatwave a black hole where the sky was, `ink` gives tughra stray fragments in the corners.
`MODE` records the call per key and a key with no entry is cut both ways onto `recut02-sheet.png`,
so the choice stays where every other cut on this ticket has been made — Dustin's eye.

**Held as candidates, not shipped:** the six flat artworks. Their fix is not a cut-quality call, it
is editorial — *is the object the ink or the sheet?* — and it changes how six items read on a
near-black shelf. Only `vhs` was authorised and only `vhs` was promoted.

### One of the two `remat` keys is solved, and the other is a different problem

`mughalmini` is a folio photographed on white: `ground` takes the surround and keeps the whole
folio with its pink border, **0 islands, 0 holes**, either mode. It is a candidate awaiting the same
ruling. `dynatac` is **not** solved and will not be by this method — a phone on a desk against a
shaded wall has no single ground colour, the flood stops halfway up the wall and comes out as a
ragged blob. It needs a matte, and it stays open.

### `no_console_errors` went red once, and it was the machine — a new one

First localhost sweep10: 42/43, three `net::ERR_NETWORK_IO_SUSPENDED`, with nine matching
`ConnectionAbortedError (WinError 10053)` in the static server's own log — the browser aborting
in-flight requests, not a 404 and not a missing file. Re-run on the same build and origin: **43/43,
`no_console_errors` clean.** Then production went red on `frame_budget` (p95 floor 25.6ms against
the 25ms gate) on the build that **does not contain this change** — confirmed independently by
`sprite_never_exceeds_its_draw` reading 64.7MB there against localhost's 64.5MB, which is the old
wider `vhs` sprite. Re-run: **43/43, p95 floor 23.2ms.** Seventh time a gate has moved on this
laptop.

**Gate chain, in order, all green.** sweep10 localhost **43/43** · sweep11i localhost **26/26**
(229 cells, 229 credits) · production sweep10 **43/43** · `review02.py` re-measured **229** ·
`review02.verify.mjs` **26/26**.

Still open: **dynatac** needs a matte, not this method. The **six flat artworks** and
**mughalmini** are cut and waiting on a ruling in `recut02-sheet.png` (columns: original |
shipped | ground | ink). The four modern periods (1930 India, 1940 Japan, 1969 US, 2024 China)
are still unverified as gaps — 2024 already holds a Chinese electric car at 2022, so density gets
checked before anyone spends the Smithsonian key on them.

## Round 5 2026-08-16 — matte.py doesn't solve dynatac either, and three of the four period gaps were already filled

**dynatac.** Re-cut with isnet-general-use + `post_process_mask=True` — the exact call `matte.py`
used on its HARD set (scenes, non-uniform backgrounds), which the birefnet attempt never tried.
Candidate at `alt/dynatac-isnet.png`. It measures clean by every number `measure()` has — cov
0.874, solid 1.0, 0 islands, 0 holes, same shape as the shipped cut — because the defect is the
one `measure()` cannot see, the same class as `vhs`: **the antenna is entirely absent from both
cuts.** The original photograph shows a foot-long black antenna in hard contrast against a plain
wall (checked at 2x, both crops). Neither isnet-with-post-processing nor the earlier birefnet
re-cut keeps it — the thin-structure failure this project has already documented in both models,
and `matte.py` was already how the shipped cut was made, so re-running it with more mask
refinement was always going to hit the same wall a thin appendage puts up. Still open. It does
not need a fourth model run; it needs a method that doesn't ask a salient-object model to keep a
part of the object it doesn't think is salient.

**Density, checked before spending the key** (`review02.json`, 229 items, region + year window).
**1969 US is not a gap** — the Boeing 747 sits at exactly 1969. **2024 China is not a gap** — the
2022 Chinese electric car is two years off. **1940 Japan has a real hole** (nothing between 1850's
matchlock and 1948's Nikon rangefinder, a 98-year span) but no new wall to test it against:
Cleveland's Japan 1900-1950 holdings were already checked and found irrelevant (round 3);
Smithsonian is untried. **1930 India is the one genuine, unchecked gap** — nearest neighbours are
1850 (Kashmir shawl, a different region tag) and 1972 (Auto rickshaw), an 80-to-122-year void
nothing has been searched against yet. If the key is spent on one of the two remaining candidates,
India is the higher-value target; Japan repeats a search this ticket already ran once and lost.

## Round 6 2026-08-16 — the antenna was never missing from the birefnet cut, and the defect is the opposite one

**Round 5's verdict was read off the wrong ground.** `alt/dynatac-compare.png` composites every
candidate onto `(5,6,10)` near-black, and the antenna is black: on that ground its presence and
its absence look identical. The two 2x crops that were checked at full resolution —
`dynatac-shipped-2x.png` and `dynatac-isnetpp-2x.png` — are both isnet, and both isnet cuts do
genuinely drop it. **birefnet was never checked at 2x, and birefnet keeps the antenna**: full
length, clean edge, correctly attached at the body's top-left. Composited onto magenta it is
unmissable. The mask says the same thing without an eye — `alt/dynatac.png` spans rows 0..914
with a 38 px median run in the top quarter, centred on x≈220, which is exactly where the
original's dark bar sits (row luma minimum ≈12 against a wall median ≈150).

So this never needed a fourth model, and the "thin-structure failure" framing was wrong on the
facts: the antenna is 38 px wide in a 399 px frame at hard contrast, which is not a thin
structure. It needed someone to look at it on a ground that isn't its own colour.

**birefnet's actual defect is the inverse fault** — it kept background, not ate object: the desk
cord, a 13 px stub running off the left frame edge at rows 824-849 and attached to the base.
`measure()` cannot see this one either, and for both of its reasons at once: the stub is
*connected*, so `isl`=0, and it encloses nothing, so `holes`=0. Same class as `vhs` and as the
antenna itself — a fault that only a ground change or an eye finds. Note also that dynatac's
shipped row reads `holes:0, isl:0`: it was in the 74 by Dustin's pass, never by a number.

**The fix is a clip, not a cut.** The body's own alpha>0 left edge is a straight run either side
of the cord — x=84 at row 823, x=74 at row 850 — so rows 824-849 are clipped back to that
interpolated edge and nothing else is touched. Clipping on **alpha>0 rather than the >=128 mask**
is load-bearing: `promote02.to_master` crops on `getbbox()`, which sees any nonzero alpha, and a
>=128-derived clip leaves the cord's faint tail behind and hands the sprite a **76 px transparent
left margin** — precisely the fault `promote02`'s own docstring warns about, since that margin is
part of the box `gravity.js` scales. On alpha>0 the margins come out **3/4/0/3** against armor's
2/3/3/3 (top 0 is inherent: the photograph itself crops the antenna).

Candidate at `alt/dynatac-fix.png`; through the unchanged promote encode it is `227x846`, 39 KB,
`cov 0.644 · solid 0.028 · halo 1.55 · isl 0 · holes 0`, which sits inside the band the 37
already-promoted birefnet masters occupy (`solid` 0.02-0.06, `halo` 1.5-2.1). Evidence sheet
`alt/dynatac-round6.png` — four columns (original | shipped | birefnet | fix) over four grounds,
because one ground is what caused this in the first place.

**The one real consequence, and it is Dustin's call.** `gravity.js` normalises by area
(`DRAW_A = 132²`, `h = sqrt(A/ar)`), not by height, so the antenna costs less than it looks: the
*body* draws **16.7% shorter and 11.5% narrower** than the shipped antenna-less cut (188x68 px
against 225x77). That is the honest price of the object actually being the object. Not promoted —
`alt/` is gitignored and cut rulings on this ticket are Dustin's eye, as with `mughalmini` and the
six flat artworks. To ship: copy `alt/dynatac-fix.png` over `alt/dynatac.png`, then
`python promote02.py dynatac`, then `python bake_sprites.py`, then the gate chain.

Still open: **mughalmini** and the six flat artworks await their ruling. **1930 India** remains the
one genuine unchecked period gap.

## Round 7 2026-08-16 — dynatac promoted, and the promotion chain was missing a bake

**Ruled by Dustin: promote.** `6fe3b3a`, live on both origins. The master went `213x622` ->
`227x846`; `review02.py` re-measures it at exactly the candidate's numbers — `cov 0.6436 ·
solid 0.0278 · halo 1.55 · isl 0 · holes 0 · 39 KB` — so nothing moved between the candidate
and the shipped file.

### The price was re-measured on BOTH surfaces before the ruling, and round 6 had only priced one

Round 6 quoted −16.7% height / −11.5% width, which is `gravity.js` normalising by AREA. **The
shelf normalises by HEIGHT** (`index.js THUMB_WIDE = 80`, `THUMB_NARROW = 64`), so the whole of
the antenna's height comes out of the body there: **−26.2%**, and the body draws **21.5x59 px**
on a wide screen and **17.2x47 px** on a phone. That is the larger of the two prices and it had
never been named. It was put in front of Dustin at 1:1 alongside x2, on the era-correct ground —
dynatac is 1983, so its row carries a **lit sky**, not the deep head's near-black, which is the
condition under which the antenna is legible rather than the one that caused round 5's error.
Sheet: `alt/dynatac-ruling.png`.

### Re-sourcing was checked and is dead, so the ruling was genuinely two-way

Commons holds **exactly three** DynaTAC photographs (`Category:Motorola DynaTAC`, plus a
category search). The two that are not the record's own are **`Motorola DynaTAC.jpg`** — Martin
Cooper holding it to his ear, an identifiable person, fingers across the body, motion-soft — and
**`Motorola DynaTAC and Samsung Galaxy Note Edge.jpg`** — 6000x4000 and public domain, but the
phone is gripped in a hand in a phone shop with a second phone in frame. Both fail
[05](05-arrival-set.md)'s R1 and [11](11-visual-anchor.md)'s cut-out rule. **The 399x977 frame
already in the record is the best free photograph of this object that exists**, so "get a better
photo" was never available and the choice really was antenna-or-body.

The truncation was checked too and is **not** an objection: the antenna is cut by the
photograph's own top edge, but **134 of 386 masters** touch a bbox side along >10% of it. A
frame-clipped master is the norm here, not a novelty.

### The chain in round 6 was wrong by one step, and it would have shipped a wrong shelf

Round 6 wrote it as `promote02 -> bake_sprites -> gates`. `site/thumb/` is a **SECOND BAKE**
([10](10-the-index-surface.md)) at `80 x dpr 2 = 160`, and `bake_sprites.py` does not touch it.
Run without `bake_index.py`, the shelf keeps the old thumbnail **and** the old box —
`thumbs.js` moved `dynatac:[55,160]` -> `[43,160]`, the antenna narrowing the aspect, and the
one line in that file is the whole tell. The shelf would have drawn the new sprite scaled to the
old sprite's ratio, and **no gate would have caught it**: `thumb_never_exceeds_its_draw` reads a
cap, not a shape. Round 4 escaped this only because `vhs`'s bake was run by hand.
`promote02.py`'s docstring and its own `Next:` line said `bake_sprites.py` alone and are the
source of the error; both fixed in this commit.

### `frame_budget`'s eighth move, and this time the discriminator is clean

**Gate chain: sweep10 localhost 44/44 · sweep11i localhost 26/26 · production sweep10 44/44 ·
`review02.py` 229 · `review02.verify.mjs` 26/26.**

The first production run read **43/44**, `frame_budget` red at p95 34.3ms / worst 49.4ms — and
`review02.verify.mjs` was driving a second playwright on the same laptop at the time. Re-run
with nothing else on the machine: **44/44, p95 21.2ms**, against localhost's 21.5ms on the same
build. **The median never moved** — 16.6 / 17.0 / 16.6 across the three runs — while p95 went
21.5 -> 34.3 -> 21.2. Load lands in the tail and nowhere else, which is a sharper reading of
this gate than the seven previous "it is the laptop" findings, all of which compared totals.

`review02.verify.mjs` also needs its own static server on **8813** rooted at
`prototypes/directions/` (`review02.html`); round 4's chain listed the command without it and it
dies on `ERR_CONNECTION_REFUSED`.

Still open, unchanged: **mughalmini** and the six flat artworks await their ruling
(`recut02-review.html`). **1930 India** remains the one genuine unchecked period gap.

## Round 8 2026-08-16 — Smithsonian is a dead wall for 1930 India, and the charkha was never the problem

**The gap was worse than "1930".** Against `site/data.js`: South Asia runs **1850 (Kashmir shawl)
→ 1972 (auto rickshaw)** with nothing between, and the whole **1890–1970** stretch — the densest,
most-recognisable part of the scroll, 38 items — carried **zero** SAS entries.

### The wall, measured — and the corpus is a natural-history archive

Eight of DEMO_KEY's ten requests an hour, every response cached to disk so no query was paid for
twice. `place:"India"` + CC0 images across the 1920s–40s returns **12,498** records, and of the
first 1,000, **993 are botany, entomology, bird and mammal SPECIMENS**. Restricted to cultural
units and 1880s–1960s: **109 records, all Cooper Hewitt, all 19th-century** textiles, jewellery
and printing blocks. Dropping the date filter and asking every cultural unit: **875** non-specimen
India records in total, whose 1885–1975 slice is US postage-stamp plate proofs, Caribbean
postcards and American portraits. **Not one Indian made object from the 20th century.**

**The National Museum of Asian Art holds 182 India records — 162 of them paintings — and none is
dated 1885 or later.** The latest is an 1853 bookbinding. That is round 3's wall (*art museums
stop explaining a period at about 1900*) reached from the Smithsonian side with a number on it:
**0 of 182**.

Two instrument faults of my own, both caught before they were written down. An earlier query
concluded *FSG/FSA/NMNHANTHRO return zero CC0 images*, which was a **wrong unit code**, not an
empty collection — the unit is **NMAA**, and it appeared as soon as a query stopped naming units.
And the `date` index **range-expands**: "19th century" is indexed as both `1800s` and `1900s`, and
an undated object is invisible to any decade filter — which is why the closing query used none.
**"india" is also a false-positive magnet:** India Rubber Company, British East India Company,
India plate proof, India paper. All three NMAH/NASM "hits" were that.

### The object was already in the catalogue, and its drop was about the photograph

`charkha` was **already in `sourced.json`** — and absent from `data.js`, because `build_data.py`
dropped it under **"R1 — a person, a crowd or a mannequin"**. The photograph the machine had
fetched was a press release: a government minister unveiling *"the world's largest wooden
charkha"* at Delhi airport in 2016, GODL-India — a crowd shot of a **monument**, which would have
carried a 1930 date as a lie twice over. `catalog.py:248` had already named this exact row,
1930 · SAS · India.

**Caught by running round 3's collision check FIRST**, which is the lesson `heitiki` cost: a blind
add would have clobbered a live record. So this is a **revival**, like round 3's `wattengine` and
`airjordan` — the drop was right about the file and said nothing about the object.

### What ships

The **Textile Museum (GWU) boxed charkha** — a *peti charkha*, the portable spinning wheel —
photographed as an object. **CC0** (`{{self|cc-zero}}`, the uploader's own dedication, so no
ShareAlike obligation and no attribution condition), 5472×3648, institution-dated *"1920s or
1930s"* and printed as **1920–1939**. Master **858×185 · cov 0.7516 · halo 1.16 · isl 0 ·
holes 1 · 42.9 KB**. The single hole is **78×9 px under the carrying handle** — a real void of the
object, verified at 3×, not a puncture.

**birefnet over isnet, and the ground is the reason.** isnet keeps **104,220 px more**, and all of
it is one component: a **2,940×47 strip along the top edge**, the vitrine's back edge — **kept
background**, round 6's inverse fault, which `measure()` cannot see because it is connected and
encloses nothing. Both cuts were judged on **four grounds** (near-black, soil, white, magenta)
*before* choosing, which is round 6's lesson applied ahead of the mistake instead of after it.

Checked rather than assumed: **no spinning or weaving machine anywhere in the set** — lane B's
`spinjenny` drop had removed textile machinery entirely, and this restores the category as a
non-Western object; **frag 0.844** against a 0.25 floor and the set's 0.801 median; **ar 4.64**
inside the shipped range (tanegashima 5.85, kris 5.14); and it lands a **same-year tie with the
1930 boomerang**, cross-region — `adj:"boomerang", gap:0`, the unbroken-hairline case.

**Recorded as a cost, not smoothed:** it is **tier C** in a window running 30 A / 6 B / 2 C, and
its tie partner is one of the two Cs. 69 of 229 shipped items are C and the piece prints the name
as the object falls, so C is not a failure state here — but the 1930 moment is now two of them
tied together. **Dustin's to overrule.**

### `frame_budget`'s ninth move, and the cleanest attribution the gate has had

Localhost red twice — p95 **28.1 / 27.6 ms** — with the warm median unmoved at 16.6 / 16.4.
Prod-vs-localhost is **not** a control here, because [06](06-visual-treatment.md) round 10
established localhost is if anything the *worse* origin. So the control was a **same-origin A/B**:
HEAD's 229 build extracted with `git archive` to a second port, same laptop, minutes later.
It read **p95 59.3 ms, worst 77.9 ms**, median drifting to 18.4. **The build without the change is
the slowest of the three**, which no story about the change can explain. Across five runs today
the p95 spans 21.1 → 59.3 ms and the *229* build produced both the best and the worst readings.
`sweep11i`'s own `index_frame_budget` passed at 18.3 ms inside the same window. Sixteen Chrome
processes were live throughout; the machine was never quiet.

### And the last gate was a wall clock — third instrument fault, page never wrong

`review02.verify.mjs` reported **`all 230 cells render  0`** while the very next assertion decoded
20 sprites off those same cells. Probed: the page builds its cells **after** `networkidle` — 0 at
networkidle every time, first cell at **5,554 ms** on this loaded laptop — so the fixed
`waitForTimeout(600)` was reading 230 on a quiet machine and 0 on a busy one. It now waits for the
count to **stop changing** and then asserts: completeness, with no duration in it. **Proved it
still has teeth rather than assumed** — one row pulled from `review02.json` and it went red at
**229 against 230**, failing for a missing cell rather than for being slow; then restored and
hash-checked. Round 3 fixed this gate's *literal*; the wall clock beside it survived that round.

### Gate chain

`sweep10` localhost **43/44** (frame_budget, attributed above) · `sweep11i` localhost **26/26**
(230 cells, 230 credits in the roll) · production `sweep10` **44/44 as the pre-push control** on
the build that predates the change · `review02.py` re-measured **230** · `review02.verify.mjs`
**26/26** + 1 perturbation red-then-restored · production `sweep10` on the **shipped** build
**43/44**, same gate, median 16.6. Both bakes run in round 7's four-step order, and the bake is
**still deterministic**: exactly one sprite and one thumbnail changed bytes.

Live on both origins, 230 items. Frames: `charkha-piece.png` (1930 CE, tungsten, the tie hairline
on the soil) and `charkha-shelf.png` (first cell of the 1930s row, citation open).

Still open, unchanged: **mughalmini** and the six flat artworks await their ruling
(`recut02-review.html`). **1940 Japan** is now the only named period hole left, and round 5 already
priced it as a search this ticket has run once and lost.

## Round 9 2026-08-16 — the flat artworks were ruled four rounds ago by shipping, and 1940 Japan is a wall measured from five sides

### The "still open" line was stale, and it cost Dustin the same question a sixth time

The seven flat artworks were promoted, baked, gated and pushed in **`f91c3de`, 15 Aug** — `img/`,
`site/img/` and `site/thumb/` all moved in that commit — and they have been live ever since.
Rounds 5, 6, 7 and 8 each copied *"mughalmini and the six flat artworks await their ruling"*
forward without checking it against the repo. Verified against production rather than against the
log: all seven sprites fetched from `timetakesall.dustincoledata.com` are byte-identical to
`site/img/` and carry **zero transparent pixels**.

The line was half right, and unreadably so: `f91c3de` shipped the change *and* generated the page
that asks about it, in one commit. **A ruling recorded as owed, on work already shipped, reads as
neither — and it survived four rounds because nobody read it against the files.**

### Dustin's ruling: the seven stay exactly as they are

Verbatim: *"I want them as they are live now with no editing."* **CLOSED — not open, not pending,
not to be re-offered.** No image file was touched this round; the whole diff is the review tool and
the page it writes.

Measured for the record, because the ruling stands against a map constraint and should say so out
loud: these seven are the **only opaque masters in all 230** — every other item is a real cut-out.
The map says *nothing on the page has an edge except the thing itself*. The reading that survives
is that on a flat artwork **the sheet IS the thing**, so the paper's edge is the artifact's edge.
That is editorial, not cut-quality, and it is now recorded as **made**.

### The review surface was structurally incapable of showing a difference

`recut02-review.html` sources **both** of its columns from `img/<k>.webp`. From the moment
`f91c3de` promoted the seven, its own "ON THE SITE NOW" column rendered the file it was proposing:
**two identical pictures under a red caption naming a defect neither of them has** — bayeux
captioned *17 detached pieces, 33% of it floating* beside an intact tapestry, twice. The defect
text is baked in at generation time and the images resolve at read time, so the page rotted the
instant it was written.

Fixed: the before column is pinned to the master as it stood at **`f91c3de^`**, pulled out of git
into `alt3/<k>-was.webp`, and `review()` raises rather than falling back to `img/`. Each card
carries **two shelf strips** — same five neighbours, same size, the cut-out then the sheet — so the
strips differ by exactly the thing being ruled on. This is round 6's lesson in its general form: **a
comparison whose two sides resolve to one file cannot fail, and cannot inform a ruling either.**

### 1940 Japan — chased on Dustin's instruction, and the wall now has five sides

**The hole is bigger than the ticket's name for it.** Against `review02.json` the **EAS bucket
carries exactly ONE item between 1890 and 1948** — a Chinese kesi silk robe at 1890 — while the
same 58 years hold **22 EUR/NAM items** and are the most recognisable stretch of the whole scroll.
Japan itself runs 1850 to 1948 with nothing in it.

**There is no Smithsonian key, and there never was.** `resource02.py` reads `SI_API_KEY`; it is
unset, so round 8 and this round both ran on api.data.gov's `DEMO_KEY`. Read off the response
headers: `X-Ratelimit-Limit: 10`, `Remaining: 0`, `Retry-After: 3130`. One query got through
first, and it is the same corpus shape round 8 measured for India: `place:"Japan"` + CC0 images
returns **50,671 records**, of which the first 1,000 by relevance are **999 natural-history
specimens** (botany 625, entomology 168, mammals 128, fishes 54, invertebrates 24) and **one**
cultural record, a Cooper Hewitt folding fan. **Ruled by Dustin: skip the Smithsonian, try
Commons and LOC.**

**Commons/LOC, twelve authored slots, 72 candidates.** The country-word false positives are worse
here than India's: `satsuma` returns a *Prunus 'Satsuma'* plum leaf, a post office and an
elementary school; `geta` returns Roman denarii of the emperor **Geta**; `bento` returns the
Monastery of Sao Bento in Brazil; `nambu` returns the **JR Nambu railway line**; `toyodaloom`
returns a Toyoda Gosei football kit and two baseball players. Two plausible objects survived out
of seventy-two — one Meiji cloisonne vase and one whole Type 38 rifle.

**And neither can carry a date, which is the decisive fault.** Commons' `DateTimeOriginal` — the
only date the gatherer sees — is the **photograph's** date, not the object's. A 2014 photograph of
a cloisonne vase says nothing about when the vase was made. Every honest date in this set comes
from a holding institution, so **Commons cannot supply an arrival on its own, only a photograph of
one.**

**The Met, untried until now, and it is a zero:** Japan 1885-1950, public domain, with images =
**5 records, not one of them Japanese** — a Chinese calligraphy scroll and four Western paintings
(Van Gogh's *L'Arlesienne*, Seurat's *Circus Sideshow*, Gauguin's *Ia Orana Maria*, Benton's
*America Today*) whose catalogue text merely mentions Japan. Round 8's false-positive magnet,
reached from the Met's side.

**Cleveland re-measured, and round 3's number was low by 17x:** not 28 export vases but **490**
CC0 records with images for Japan 1885-1950, of which the first 100 are **89 ceramics** — teacups,
incense burners, and sake-pourer **lids catalogued as separate objects**. Round 3's *verdict* was
right and its *measurement* was not.

**Wikidata, the one instrument that indexes objects BY INCEPTION DATE and needs no key:** 491
distinct Japanese-origin items dated 1885-1950 with images; 297 of them non-flat; and the
**1915-1950 slice is ferries, ship classes, locomotive classes and weapon models.**

**The shape of the wall, stated once.** The corpus that **dates** Japanese objects — the art
museums — stops at Meiji export ceramics. The corpus that **has** the period-defining objects —
Commons — cannot date them. Two halves, neither crossable alone. That is round 3's wall and round
8's wall meeting from opposite sides, and it is why five sweeps produce one answer.

**What survives is exactly two classes, and both are recorded rather than shipped.** Meiji/Taisho
**art-ceramics** — dated, museum-photographed, and telling a stranger nothing about 1890-1945 that
the raku tea bowl at 1600 does not already say, into a set that is already vessel-saturated. And
**weapons** — a Type 38 at 1905 or a Type 99 at 1939 is the object that genuinely explains the
period, but the set already carries a **Japanese matchlock** and a **Winchester**, so it duplicates
twice over, and its only whole-object photographs are a collector's rifle **lying in snow**. The
one file that shows a Type 38 clean is titled *"CG picture"* — a modern render, a constraint breach
rather than a lucky find, which is this ticket's oldest recorded trap.

**Nothing was added.** Round 3's `heitiki` cost the rule that a blind add clobbers a live record,
and every set ruling on this ticket has been Dustin's. **The 98-year hole stands, named and
priced.** Recorded for a later round and NOT chased here: the gap is **East Asia 1890-1948**, not
Japan alone, and China or Korea may close it where Japan cannot.

### An instrument fault of my own, paid for in requests

The Smithsonian cache keyed its files on the percent-encoded query, which ran the full path past
Windows' 260-character `MAX_PATH`. The write threw **after** the network call had returned, so one
of DEMO_KEY's ten requests an hour was spent on a response that was never written down. Keyed on
an md5 now, with the query text beside it in a `.q` file.

### Gates

**Nothing that ships changed**, and that is asserted rather than assumed: `git status` over `site/`
and `prototypes/directions/img/` is empty, and the seven sprites on production are byte-identical
to disk. The diff is `recut02.py` and the page it generates, neither of which the site loads.
Run anyway, in round 7's order. `review02.py` re-measured **230** and `review02.json` came back
**byte-identical**, which is the tightest statement available that nothing moved.
`review02.verify.mjs` **26/26**. `sweep11i` localhost **26/26** (230 cells, 230 credits;
`index_frame_budget` p95 floor **19.2ms**). `sweep10` localhost **43/44**.

**No production sweep**, deliberately: the deployed bytes are unchanged, so it would re-measure
the build round 8 already finished there.

### `frame_budget`'s tenth move, and this time the control cost nothing

Red at warm median **16.9ms, p95 floor 34.5ms**. The median is the same number every green run of
this gate has produced — 16.4 / 16.6 / 16.9 — and the load lands in the tail, which is round 7's
sharper reading arriving again.

**The control is free this round and it is the strongest the gate has had.** `git status` over
`site/` is empty, so the build under test is **byte-identical to the one round 8 measured at
44/44** — same frame loop, same sprites, same `data.js`. Round 8 had to construct that comparison
with `git archive` and a second port; here the shipped bytes ARE the comparison, and they scored
44/44 hours ago and 43/44 now with nothing in between but the machine. `sweep11i`'s own
`index_frame_budget` passed at p95 19.2ms inside the same window, and **17 Chrome and 8 Edge
processes were live throughout**. No ruling rests on the red.

### The ticket closes

Both of round 8's open items are resolved: the seven flat artworks by **Dustin's ruling** (they
stay as they are), and **1940 Japan** as a **measured wall** rather than a search still to run —
five independent sources, one answer. `dynatac` closed in round 7 and the 28 `drop` keys in lane B.

**Ticket 02's three owed numbers, restated for the last time.** Items obtainable post-1500: the set
carries 200 of its 230 there. Pre-1500: 30, which 01 reframed as a prologue and which held.
Re-source failure rate on the inherited 58: superseded by the harder number lane B measured on a
*re*-source — **43%**, on photographs an editorial pass had already approved once. Round 9 adds the
fourth, which is the one a future set change will need: **for a period the open corpus does not
already photograph, the failure rate is 100%, and it fails on the DATE rather than on the photograph.**

