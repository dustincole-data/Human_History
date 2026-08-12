# 05 — The arrival set & verified dates

Type: research
Status: CLOSED 2026-08-11 — 236 items, reaching 2026. First close 2026-08-08 (230); the
        2020-2026 tail and three of the seven never-founds closed the reopen.
Assignee: dustin
Resolved: 2026-08-08 for the 230-item set
Blocked by: 02, 04
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What appears, in what order, on what date, with what source — and what is deliberately left out?**

The content spine. Blocked by [02](02-image-supply.md) (what can be obtained) and [04](04-scroll-mechanic.md) (how many slots exist and how far apart they can sit).

Produce the merged, verified set:

- **Start from the inherited 58**, normalized. `record.json`'s `yearsAgo` carries **two epochs** — entries 0–49 from 2000, entries 50–57 from 2026 — leaving the tail out of chronological order. Convert everything to **absolute years with a stated epoch** and re-derive. Fix in the copy; Deep Time's file is out of scope.
- **Extend to the target count** set by [04](04-scroll-mechanic.md), weighted toward wherever the mechanic leaves gaps. On any warped or constant-density mechanic that means the thin pre-1500 stretch needs the most new work, and [02](02-image-supply.md) has already measured whether the images exist.
- **Every entry carries** `id`, absolute date, date-confidence, name, one-line description, source, licence, credit, and image provenance. No entry ships without all of them.
- **Contested dates are hedged in notation, not prose** — Deep Time's rule, and it survives: doubt goes in the number (`c.`, ranges, `≥`), identity doubt goes in the name.

Then apply the two editorial tests that decide quality:

1. **Global balance.** The set must not be a Western canon with tokens attached. Set an explicit target for regional and cultural coverage *before* selecting, then measure the finished set against it. [02](02-image-supply.md) will have reported how deep licence-clean non-Western coverage actually goes; where supply is genuinely shallow, say so in the record rather than quietly skewing the set.
2. **The admission test from [01](01-the-fun-thesis.md).** If the mechanism is recognition, unknown items are ballast. If it is discovery, canon items are ballast. These pull in opposite directions and the ratio must be a **stated number**, not a vibe — the one thing most likely to be silently fudged.

Also rule on: whether "built" is literal (objects, buildings, artifacts) or includes events, ideas and documents — the inherited 58 already mixes them (Trinity Test, the Human Genome Project, the March on Washington). An unstated definition here produces an incoherent set.

**Deliverable:** the complete set as a data file in the repo, every field populated, with a coverage table (by era and by region) and an explicit list of **notable things deliberately excluded and why** — the exclusions are what prove the set was edited rather than accumulated.

---

## Input from [01](01-the-fun-thesis.md) (closed 2026-08-07)

**Target: 200–400 items.** This is the project's main cost and it lands here.

The **admission test** this ticket asked for is now settled, and it is neither pure recognition nor pure discovery:

> An item is admissible **as a neighbour of a famous one**, never as a screen's headline. Every screen must carry at least one thing a stranger recognizes; obscure items earn their place by being *next to* it in time.

That resolves the recognition-vs-discovery tension the ticket flagged as most likely to be fudged — the ratio is not a global percentage, it is a **per-screen floor**. State it as: *no screen ships without a recognizable anchor.* Measure the finished set against that, screen by screen, once [04](04-scroll-mechanic.md) fixes what a screen holds.

Two more consequences:

- **Weight the new work post-1500.** The earlier instruction to weight toward the thin pre-1500 stretch is **superseded**. 01 ruled the deep head is a fast prologue of ~a dozen spectacle items; the density the mechanism eats is in 1500 → now. Pre-1500 needs *strength*, not volume.
- **Contemporaries are a selection criterion, not just an output.** Items are chosen partly for who they sit beside. An item with no interesting neighbour in time is weaker than a lesser item that creates a real double-take — record the intended adjacency alongside each entry so [04](04-scroll-mechanic.md) and [06](06-visual-treatment.md) can build to it.
- **Global balance is unchanged and still binding.** The per-screen recognisability floor must not quietly become a Western-canon floor; where non-Western supply is shallow ([02](02-image-supply.md) measures it), say so in the record rather than skewing the set.

---

## Input from [11](11-visual-anchor.md) (closed 2026-08-08)

**A second admission test, and this one is a hard filter applied before 01's:**

> **If a thing cannot be cut out of its photograph and still be recognized, it does not go in the site.**

The site's grammar is unframed objects floating on a ground — nothing has an edge except the thing itself. A subject that needs a container to make sense (a crowd, an aerial site view, an event) breaks that grammar, and a page that is half-contained and half-floating reads as a search-results page.

**Apply it as a rewrite instruction, not just a reject.** The subject is *things people built*, so most entries have an object hiding inside an event: Apollo 11 → the lander; Trinity → the cloud; Göbekli Tepe → a single carved pillar, not the aerial shot. Record the **object** as the entry, with the event as context.

> **RELAXED 2026-08-08 — the filter is much weaker than it looked.** 11 assumed cut-out meant "sourced on
> a clean museum sweep", because a flood fill was all that had been tried. With a real matting model
> (`prototypes/anchor-preview/matte.py`, rembg + isnet, local and free), **nine of the ten subjects that
> completely defeated the old method cut cleanly** — including **Buzz Aldrin lifted out of the visor
> photograph** and **Sputnik with its antennas intact**. A person *can* be cut out of a scene.
> **So famous moments can become objects after all**, and the drops predicted below should be far rarer.
> Still assume nothing: run a candidate through the model before ruling it in or out. The Lunar Module on
> the lunar surface still failed, so the filter is real — just much narrower.

**Where it genuinely can't be done, the item drops.** That is a real hit on 01's recognition substrate and it was accepted with eyes open — but it means the per-screen recognisability floor above is now harder to hit, because some of the most recognizable moments in the set are crowds. **Flag any item you drop for this reason**; if the count gets large, that is evidence to reopen the grammar, and evidence is the only thing that reopens it.

Two smaller consequences:

- **Cut-out difficulty is a sourcing criterion.** It pushes [02](02-image-supply.md) toward museum-sweep and isolated-object photography over in-situ scene photography, for the same artifact. Note it against each candidate.
- **Global balance interacts with this.** Non-Western material is disproportionately documented as *sites and scenes* rather than object photography in some collections. If this filter is quietly skewing the set Western, say so in the record rather than absorbing it.

---

## Rulings & targets, written 2026-08-08 BEFORE any selection

The ticket requires the targets to exist before the set does, so they are here, ahead of the
sourcing pass, and the finished set is measured against them at the bottom rather than described.

### R1 — what "built" means

**An arrival is always a made object with a body.** The site drops it and shatters it; its pieces
have to still be a thing. So the entry is never an event, a discovery, an idea or an institution —
it is the **object those things left behind**, and that object is what the record names.

- Apollo 11 → the pressure suit, not the landing. Trinity → the Gadget's casing, not the cloud.
- Documents count **when they are objects**: a clay tablet, a printed Bible, a folded newspaper,
  a punch card. Text with no artifact does not.
- Where an event left no object a stranger reads as that event, **the item does not go in**, however
  important it is. Those are listed in the exclusions, not quietly dropped.
- **No human remains, and no identifiable person as the falling object.** The suit, the instrument
  or the garment stands in. (11's Aldrin cut proved the *matting* works; it was never a set ruling.)
  Shattering a photograph of a named person is a different act from shattering a pot.
- Contested and repatriation-claimed objects are **in** — they are history — and are attributed to
  the holding institution exactly as its licence requires, with no editorial gloss either way.

### R2 — the cut-out test, now with 13's second half

11's filter stands and is applied first: *if a thing cannot be cut out of its photograph and still
be recognized, it does not go in.* 13 added the half that matters more here, because every object
is destroyed on screen:

> **A thing that is only recognisable whole is a weaker pick than one whose pieces stay legible.**

Made measurable rather than argued. `frag` = the share of the object's own opaque area whose local
luminance detail exceeds a threshold (16px cells, σ > 12) — high where pattern, print, text,
circuitry, joinery or decoration is distributed across the body; low on a plain sphere, a bare
blade, a solid-colour mass, which is exactly what dies at the first Voronoi cut.

- **Stated in advance:** an item scoring `frag < 0.25` ships **only if it is tier A** (below) —
  it earns its short whole-object life by being named on sight.
- **Set target:** mean `frag` ≥ 0.45.

### R3 — recognisability, as a number and not a vibe

01's admission test is a per-screen floor, so it is enforced on the ordered set, not as a global
percentage. 13 fixed the mechanic at 1,000 px per arrival with a 4,200 px decay life, so **≈ 4
consecutive items are co-visible**. Therefore:

- **Gate (zero violations): every window of 4 consecutive items, in date order, contains at least
  one tier A.**
- **A** — a typical stranger names it on sight. **B** — reads as a category on sight (*a Greek vase*,
  *a knight's helmet*) without knowing the specific object. **C** — needs its label.
- Targets: **A ≥ 30%**, **C ≤ 25%**.

### R4 — global balance, targets fixed before selecting

Eleven buckets, so that Egypt cannot stand in for a continent and "the West" is visible as a number.
Share of the whole set, ±3 pp:

| | AFR | NIL | WCA | SAS | EAS | SEA | OCE | AME | EUR | NAM | LAM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| target | 8% | 7% | 11% | 8% | 15% | 4% | 3% | 8% | 24% | 10% | 2% |

AFR = Africa excluding Egypt/Nubia · NIL = Egypt & Nubia · WCA = West & Central Asia · SAS = South
Asia · EAS = East Asia · SEA = Southeast Asia · OCE = Oceania & Australia · AME = Indigenous
Americas · EUR = Europe · NAM = post-1600 settler North America · LAM = post-1600 Latin America.

**Western (EUR + NAM) is capped at 34%.** Second, stronger constraint, because an aggregate can be
hit while every era is skewed: **non-Western share within each era band ≥ 45%**, relaxed to **≥ 25%
for 1800–1960** — where industrial production genuinely did concentrate, and where museum
digitisation compounds it. Any band that misses is **reported as a supply finding, not absorbed**.

### R5 — era bands, and where the volume goes

01 superseded the original "weight pre-1500" instruction: the deep head is a fast prologue, the
density the mechanism eats is 1500 → now. Target shares:

| pre-3000 BCE | 3000–500 BCE | 500 BCE–500 CE | 500–1500 | 1500–1800 | 1800–1900 | 1900–1960 | 1960– |
|---|---|---|---|---|---|---|---|
| 5% | 9% | 9% | 13% | 16% | 15% | 15% | 18% |

Pre-1500 = 36%, post-1500 = 64%.

### R6 — dates

Absolute years, epoch stated, negative = BCE. Doubt lives in the number (`c.`, ranges, `≥`), never
in prose; identity doubt lives in the name. `disp` is the date **as the holding institution
publishes it** — the institution's own hedge is carried through rather than re-hedged.

---

## Built 2026-08-08 — **230 items**, measured against every target above

**Where it is.** `prototypes/directions/` — `catalog.py` (the editorial list, 288 named artifacts),
`source5.py` (acquire · matte · score · sheet), `build_data.py` (verdicts → `data.js`),
`measure.py --live` (the tables below, regenerated from the data, never hand-typed).
`sourced.json` is the record; **`data.js` is generated — do not hand-edit it.**
Contact sheets `sheet5-1..11.png`. Running with the real set: `set5-live.png`.

**How the count moved.** 288 authored + 71 inherited = 359 candidates → 7 never found →
**131 dropped, 25 renamed or redated → 230 ship.** A 36% loss rate, and every drop is named with
its reason in `build_data.py`.

### The measurement

| R4 · region | AFR | NIL | WCA | SAS | EAS | SEA | OCE | AME | EUR | NAM | LAM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| target | 8 | 7 | 11 | 8 | 15 | 4 | 3 | 8 | 24 | 10 | 2 |
| **got** | 6.1 | **3.5** | 11.3 | 8.2 | **22.9** | 2.2 | 3.0 | 6.9 | 21.2 | 12.6 | 2.2 |

**Western (EUR + NAM) = 33.8% against the 34% cap. Held** — and held by cutting four Western
entries at the end rather than widening the line, recorded as such in `build_data.py`. Two misses:
**EAS +7.9** (East Asian consumer and industrial objects are both abundant and licence-clean, and
they are what the non-Western floors below are made of) and **NIL −3.5** (Egyptology that is
photographed as *objects* rather than as sites is thinner than it looks).

| R5 · era | pre-3000 | 3000–500 BCE | 500 BCE–500 | 500–1500 | 1500–1800 | 1800–1900 | 1900–1960 | 1960– |
|---|---|---|---|---|---|---|---|---|
| target | 5 | 9 | 9 | 13 | 16 | 15 | 15 | 18 |
| **got** | 3.0 | 11.3 | 10.0 | 14.7 | 16.0 | 12.1 | 12.6 | 20.3 |
| **non-Western** | 86 | 81 | 83 | 79 | 76 | 57 | **28** | 60 |
| floor | 45 | 45 | 45 | 45 | 45 | 25 | 25 | 45 |

**Every era band clears its non-Western floor**, including the one most at risk: 1900–1960 lands at
27.6% against a floor of 25%, and it is tight on purpose — that is what the honest industrial
century looks like once you stop padding it. The two bands that came in light (1800–1900,
1900–1960) lost the most to the contact sheet, because that is exactly where Commons is full of
photographs of *people using things* rather than of things.

### The gates

| gate | result |
|---|---|
| **R2** fragment legibility, mean ≥ 0.45 | **0.770** ✓ |
| **R2** frag < 0.25 and not tier A | **0** ✓ — and it bit: `moonjar`, `shahjahan`, `snuffbottle` and five more went on the number, not on taste |
| **R3** tier A ≥ 30% | **41.6%** ✓ |
| **R3** tier C ≤ 25% | **29.0%** ✗ |
| **R3** every window of 4 carries a tier A | **70 of 228 fail** ✗ — see finding 1 |
| **citation** licence + credit + page on every entry | **0 missing** ✓ |
| **dates** checked against the holding institution | **98 of 349**; 22 disagreed by > 150 y |
| **decoded memory** 80 MB ceiling | **111.4 MB** ✗ — see finding 2 |

### Three findings that belong to other tickets

**1. 01's per-screen recognisability floor is not reachable from the artifact record — at the strict
reading.** 13 fixed the mechanic at 1,000 px per arrival with a 4,200 px decay life, so about four
items are co-visible; the gate is therefore *every window of four carries something a stranger names
on sight*. It fails 70 times out of 228, and every failure is in the deep half — 7/7 before 3000
BCE, 15/23 in 500 BCE–500 CE, **0/44 after 1960**. The longest stretch with nothing nameable is
**18 items**.

> **Read "recognisable" as tier A *or* B — reads as a category on sight, a Greek vase, a knight's
> helmet — and the same gate fails 5 times out of 228.**

That is the finding. The set cannot be re-selected into passing the strict version: a general
audience does not name eighteen distinct pre-1500 objects, and no editorial effort invents them.
**This is 01's ruling, not 05's to relax** — either the floor means A-or-B, or the deep half runs on
something other than recognition, which is what 01 already said when it made the deep head a
spectacle prologue with planted callouts.

**2. The count 01 mandated cannot all be resident.** At the 440 px the renderer draws a sprite, 230
sprites decode to **111.4 MB** against the map's **80 MB** ceiling — `w × h × 4` regardless of
encoding, Deep Time's lesson. The set is not the problem and shrinking it is the wrong fix:
GRAVITY/SHATTER destroys each object permanently and keeps roughly four objects' debris alive, so
**nothing needs to be resident that is not within a few thousand pixels of the scroll position.** A
load-ahead / dispose-behind texture window is the fix and it belongs to
[03](03-engine-reuse-or-clean-build.md) and [06](06-visual-treatment.md); at a 12-item window the
resident cost is under 6 MB. Flagged here because 05's count is what triggers it.

**3. Dates move when you check them.** Each museum API's own object date was captured beside the
candidate and compared to the authored year. **22 disagreed by more than 150 years.** In 16 the
institution won and the entry was redated — `songding` by 2,050 years, a "Song bronze" the Met dates
to the 11th century *BCE*; `hanlacquer` from 100 BCE to the Qianlong reign. In 5 the date moved so
far that the identity went with it, and those are drops: a 15th-century textile is not 1930s adire.
The one residual flag, `nazcavessel`, is a parser false positive on "180 BCE–500 CE". Commons
entries are **not** checkable this way and are marked `dv:"authored"` — Commons' date field
describes the photograph, not the artifact.

### Deliberately excluded — the list that proves the set was edited

**Ruled out by class, before any searching** (R1): every event with no object (the Black Death, the
French Revolution, decolonisation); every building and site *as itself* — the Pyramids, the
Colosseum, the Great Wall, Angkor, Hagia Sophia, the Taj Mahal, the Eiffel Tower, Machu Picchu —
which enter only through a detachable piece a stranger still reads (a pyramidion, a stained-glass
panel, a Borobudur relief block); all human remains (Ötzi, the Jericho skulls, the bog bodies,
Tutankhamun's mummy — his mask is in); and every idea with no artifact.

**Ruled out by the eyeball, across eleven sheets** — grouped by cause in `build_data.py`, because
the *shape* of the failure is the finding and no automated check would have caught most of it:

| why | n | worth naming |
|---|---|---|
| wrong subject entirely | 27 | "Đông Sơn drum" → a modern **snare drum strainer**; "Hopewell mica hand" → **mushrooms**; "barbed wire" → a **grasshopper**; "M-Pesa" → a **1947 Fiat**; "Great Zimbabwe bird" → the **flag** |
| a person or a crowd (R1) | 21 | "Levi's" → a portrait of **Rita Levi-Montalcini**; "Singer" → a woman sewing a face mask; Gutenberg → a curator in a lab coat |
| replica, counterfeit or modern specimen | 8 | Harrison's H4 (modern replica), the first transistor (replica), **Sputnik 1 — no original survives, so every photographed one is a replica**; a *counterfeit* Casio F-91W and a *counterfeit* 3M N95 |
| a plan, a drawing, or a label in frame | 7 | the Encyclopédie plate; a sherd photographed **with its 10 cm scale bar**; a pot beside its **museum label reading 326** |
| the matte returned nothing legible | 20 | Göbekli Tepe (its own shadow cut with it), the Ming banknote, the London Underground diagram |
| R2, measured | 8 | the Korean **moon jar** — beautiful, and frag 0.07: recognisable by outline alone, so it dies at the first cut |
| duplicate | 4 | the same Khmer head arrived twice, as `khmerbronze` and as `hoysala` |
| right object, wrong date | 5 | finding 3 |

**Cut for balance before any sourcing** (`catalog.CUT`, 35 rows): the first draft of the catalog
measured **50% Western against R4's 34% cap** — the exact failure R4 exists to catch, caught by the
number and not by feel. Thirty-five of the weakest Western candidates went (a fourth European car, a
third US home computer of 1977–81, a fifth camera) and **80 non-Western rows were authored to
replace them**, which is where the Ming banknote, the Marshall Islands stick chart, the Little Red
Book and instant ramen came from.

### What downstream tickets inherit

- **[10](10-the-index-surface.md)** — the permanent record it must carry is `data.js`: 230 entries,
  each with `src · lic · cred · url`, plus `b` (region), `t` (tier), `f` (fragment score),
  `reg`/`inst` (the institution's own region and title), `dc`/`dv` (is the date hedged, and is it
  the institution's or ours), and `adj`/`gap`.
- **[04](04-scroll-mechanic.md)** — `adj` and `gap` are 01's *recorded intended adjacency*, computed
  rather than asserted: for each item, the nearest item in time **from a different region**. The
  fifteen strongest pairs (both tier A, different regions, ≤ 2 years apart) are 01's planted-callout
  shortlist, printed by `measure.py --live`: **Ife bronze head : moai** (both c. 1300, 0 y), **Ming
  blue-and-white : the Aztec double-headed serpent** (0 y), **Stephenson's Rocket : the Great Wave**
  (2 y), **the Zero : the Willys Jeep** (1 y), **Sony Trinitron : the Boeing 747** (1 y).
- **[07](07-copy-voice-and-name.md)** — **the one-line description is deliberately unwritten.** The
  slot is in the data and the raw material is there (`inst`, `reg`), but the site has no voice yet
  and writing 230 descriptions before 07 sets one is waste.
- **[03](03-engine-reuse-or-clean-build.md) / [06](06-visual-treatment.md)** — finding 2, the
  texture window.
- **[01](01-the-fun-thesis.md)** — finding 1, and only Dustin closes it.

### Named limits

230 is the low end of 01's 200–400, and the honest reason is the 36% eyeball loss, not supply:
`catalog.py` holds 288 named rows and most misses are recoverable with better queries. Tier C is 29%
against a 25% target — carried in the open, and it sits in the deep half. The seven never found
(`braille`, `maosuit`, `borobudur`, `batik`, `goldweight`, `prayerwheel`, `kimono`) are still in the
catalog and would come back with a second query. `frag` is a proxy: it measures detail across the
whole sprite, not across the actual Voronoi cuts `decay.js` makes. Verified live at 1440×900 with
the real 230 loaded — 230/230 sprites present, 235,089 px of scroll, zero horizontal overflow, no
console errors beyond the pre-existing favicon 404 and matter-js's own warnings. Not yet run on a
phone; that stays [08](08-accessibility-and-mobile.md)'s.

---

## Reopened 2026-08-08 — **scoped to the 2020–2026 tail only**

Dustin, on seeing the 230-item set: *"we're going to need stuff all the way up to 2026."*

He is right and the number says so: the set's newest entry is **2022** (`byd`), and the four years
since are empty. On a piece whose density target sits in *1960 → now*, ending four years short of
now is the one gap a visitor will notice without being told.

**This reopen is narrow and nothing else about the set is in question.** The 230 stand, the
rulings stand, the coverage tables stand. What is owed:

- **2022 → 2026**, at the density the rest of E8 runs at — roughly six to ten items.
- The same gates apply, unchanged: R1 (a made object with a body), R2 (`frag`, and tier A if it
  scores under 0.25), R4's regional balance, `src · lic · cred · url` on every entry.
- **Licence is the hard part here, not supply.** Very recent consumer objects are photographed by
  their manufacturers, and manufacturer press images are not CC0. Expect Commons user photography
  and expect a lower hit rate than the rest of the set — measure it and say so rather than
  reaching for a press shot.
- Re-run `measure.py --live` afterwards; the region and era tables in this ticket are generated,
  not typed, so they must be regenerated rather than edited.

Also still open from the first pass, and cheap: the **seven never-found** rows (`braille`,
`maosuit`, `borobudur`, `batik`, `goldweight`, `prayerwheel`, `kimono`) are still in `catalog.py`
and most would come back with a second query.

---

## Closed 2026-08-11 — **236 items, and the set reaches 2026**

Twenty-three candidates fetched across four passes, **seven admitted**: five inside 2023–2026 and
two of the never-founds. One entry left the set on a licence. **The number that set this list
before it was written is the one that closed it**, which is R4 working the way it worked the first
time.

### The cap did the selecting, and it was arithmetic before it was taste

The 230 measured **Western (EUR + NAM) = 77 items**, so a tail of `n` items may carry `w` Western
where `(77 + w) / (230 + n) ≤ 0.34`. That is `w ≤ 2` at `n = 8` and `w ≤ 3` at `n = 10`, and it was
written into `catalog.py` above the new rows rather than discovered afterwards. Six Western
candidates were fetched anyway — they are the strongest objects of the decade — and the surplus was
to be cut at the end, weakest first, exactly as the first pass cut four rather than widening the
line.

**It also cut an object nothing else would have.** `su7` (Xiaomi SU7 Ultra, 2025) came back clean,
in focus and high-`frag`, and it is the **third electric car in four years and the second Chinese
one**. `byd` already carries that. It went on redundancy, not on the image, and EAS — the set's
largest overshoot — is one lighter for it.

### What ships

| key | | year | region | tier |
|---|---|---|---|---|
| `goldweight` | Akan gold weight | c. 1700 | AFR | C |
| `batik2` | Javanese batik cloth | c. 1750 | SEA | B |
| `cybertruck` | Stainless-steel pickup | 2023 | NAM | A |
| `visionpro` | Apple Vision Pro | 2024 | NAM | A |
| `unitree` | Humanoid robot | 2024 | EAS | B |
| `switch2` | Joy-Con 2 controllers | 2025 | EAS | B |
| `torch2` | Olympic and Paralympic torches | 2026 | EUR | B |

**The last object is now a torch**, which [14](14-the-ending-and-the-frame.md)'s ending inherits
without being asked to: the newest thing anyone made falls, and nothing happens to it.
`goldweight` and `batik2` are two of the seven never-founds, retried because they sit in the two
buckets furthest **under** target (AFR −1.9, SEA −1.8). **The other four are not retried and that
is a decision, not a backlog** — `maosuit`, `prayerwheel` and `kimono` are EAS, the set's biggest
overshoot, and `braille` is EUR under a cap the tail is already spending. Recorded in
`catalog.NOT_RETRIED`.

### The measurement, regenerated

| R4 · region | AFR | NIL | WCA | SAS | EAS | SEA | OCE | AME | EUR | NAM | LAM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| target | 8 | 7 | 11 | 8 | 15 | 4 | 3 | 8 | 24 | 10 | 2 |
| **got** | 6.4 | **3.4** | 11.0 | 8.1 | **23.3** | 2.5 | 3.0 | 6.8 | **20.8** | 12.7 | 2.1 |

**Western 33.5% against the 34% cap. Held.** Three misses, and all three are the first pass's
misses moving rather than new ones: **EAS +8.3** (was +7.9 — the 2020s record is East Asian
consumer hardware and no query changes that), **NIL −3.6**, and **EUR −3.2**, which crossed the 3pp
line because the denominator grew by six while EUR gained one.

| R5 · era | pre-3000 | 3000–500 BCE | 500 BCE–500 | 500–1500 | 1500–1800 | 1800–1900 | 1900–1960 | 1960– |
|---|---|---|---|---|---|---|---|---|
| target | 5 | 9 | 9 | 13 | 16 | 15 | 15 | 18 |
| **got** | 3.0 | 11.0 | 9.7 | 14.4 | 16.5 | 11.9 | 11.4 | **22.0** |
| **non-Western** | 86 | 81 | 83 | 79 | 77 | 57 | **30** | 58 |

**Every era band still clears its non-Western floor**, including 1900–1960 at 29.6% against 25%.
E8 is 22.0% against an 18% target and **that is the reopen, not a defect** — the ticket was
reopened to add items to exactly that band. R2 mean `frag` **0.769**, `frag < 0.25` and not tier A
**0**, citation **0 missing**. Sprites re-baked: **67.5 MB decoded for all 236** against the 80 MB
gate, transfer 6.7 MB; thumbs **26.8 MB** resident, 45.3 MB at 01's 400-item ceiling.

### The finding the reopen asked for: what a licence costs at four years' distance

**Twenty-three candidates, five admitted inside 2023–2026 — a 78% loss against the set's own 36%.**
The ticket predicted the licence would be the hard part and it was, but not in the way it guessed.
Supply is fine; **acquisition is what breaks**, in two ways that are both permanent lessons:

1. **A one-word `must` matches a word, not a thing**, and modern names are ordinary English.
   `starship` returned **Jefferson Starship**, a rock band. `vikram` returned **Vikram Solanki**, a
   cricketer. `torch` returned a **torch-cut pipe**. `lego` returned an **Indonesian dance**. The
   second pass fixed every one of them by making the must-word the object's whole name, and that
   is now written into `catalog.py` where the next pass will read it.
2. **Nothing from this decade is in an open-access museum**, so every candidate is Commons user
   photography of an object still being sold — which means the photograph is a **product shot on
   white** (the matte returns the whole rectangle: `cov 0.99`, twice, for the semaglutide pen), a
   **screen-on device** (the matte reads the black screen as background and punches holes through
   it: Switch 2 console, `frag 0.096`), or **the object on the structure holding it** (Starship on
   its launch tower). None of those is a query fault.

**And there is a gap no query closes: NIL, AME, OCE and LAM have no 2020s entry at all**, and
neither does AFR — `roamair` and `roam2` both came back empty, the second returning an ampersand on
a conveyor diagram. Reported rather than papered over with a manufacturer's press image, which is
what the reopen asked for.

### One entry left on its licence — and the pipeline now checks that before the eye does

`lego` was **GFDL 1.2 and nothing else**. GFDL requires the full licence text to travel with the
work, which a one-line credit on a shattering photograph cannot do; it is the only entry in the set
under a copyleft licence the citation cannot satisfy. **Three replacement queries failed** — a 3D
render (a constraint breach, not merely a wrong result), the dance, and a house model the matte
shredded — so the object leaves the set rather than the rule bending. The corpus finding is the
interesting half: **Commons' free-licensed Lego is what people BUILT with it**, because that is
what a photographer points a camera at.

`source5.py` now rejects a candidate on its licence at acquisition (`LIC_REJECT`: GFDL, NC, ND).
**The set shipped a GFDL-only photograph for three rounds because acquisition never looked at the
licence field it was already storing.**

### And the instrument was wrong again — fifth time, first time inside the tables

`measure.py` appends the twelve legacy cut-outs **without checking the drop table**, which
`build_data.py` has always done. `camera` was cut for the Western cap in the first pass, so from
that moment **every table in this ticket has been measured over one more item than ships — and the
phantom row is itself Western**, which is the one number the cap is about. Fixed; the tables above
are the first ones measured over the set that actually loads. The reported Western share moves from
33.8% to 33.5%.

**What downstream tickets inherit:** the set is **236**, `data.js` is regenerated (and now carries
`licurl`), `webgl/img` and `webgl/thumb` are re-baked and swept of orphans, and 04's spacing, 10's
shelf and 14's ending all take a new last item.
