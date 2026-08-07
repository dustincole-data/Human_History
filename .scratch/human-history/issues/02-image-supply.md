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
