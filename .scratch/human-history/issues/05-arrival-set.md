# 05 — The arrival set & verified dates

Type: research
Status: closed
Assignee: dustin
Resolved: 2026-08-08
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
