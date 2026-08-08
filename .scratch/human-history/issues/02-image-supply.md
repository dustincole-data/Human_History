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
