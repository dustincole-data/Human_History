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
