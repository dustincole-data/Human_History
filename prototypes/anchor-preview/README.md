# Anchor preview

A throwaway look preview built to answer one question Dustin asked out loud: *what will it look like?*
It executes the rulings in [ticket 11](../../.scratch/human-history/issues/11-visual-anchor.md) on 12 real,
cited, licence-clean cut-outs.

Run it: `python -m http.server 8899` in this directory, then open `http://localhost:8899/`.

## What it is evidence for

- The **material-of-the-age ground** works. Six grounds blend continuously, and the era name plus the
  year's own uneven rate carry "where am I" without Deep Time's `1 px = N years` line.
- The **cut-out grammar** holds. Nothing is framed; nothing has an edge except the thing itself.
- **Crowding reads.** Four abreast at 1876–1930 and three at 1971–1990s, against lone objects in the
  sparse head. Verified: zero rectangle intersections at 1440×900 and at 390×844, no horizontal overflow.

## What it is NOT evidence for

Hand-picked images on a hand-picked span. It cannot pass [06](../../.scratch/human-history/issues/06-visual-treatment.md)'s
legibility gate, which needs [02](../../.scratch/human-history/issues/02-image-supply.md)'s real spread
including the ugly cases. Treat every number below as an indication, not a pass.

## Findings that cost real time, and that 02/06 should not rediscover

1. **Museum sweeps are gradients, not flat colours.** A fixed-tolerance flood fill leaves grey halos on
   every museum object. The fix is region-growing on *local* similarity — walk the gradient, stop at the
   object's edge. See `knockout.py`.
2. **A single global rule cut out roughly two-thirds of candidates acceptably.** The rest needed
   per-image parameters. **At 200–400 images that does not scale**, which is exactly the arithmetic
   [06](../../.scratch/human-history/issues/06-visual-treatment.md) says should disqualify a rule needing a
   human eye per image. Budget for ML matting or manual work, or bias sourcing hard toward clean sweeps.
3. **Some objects cannot be separated at any threshold.** The Neolithic jar's unpainted lower body is the
   same value as the sweep behind it. Connectivity cannot fix that — it needs a different source photo.
   This is a **sourcing** criterion, not a processing one.
4. **Search relevance beats border cleanliness as a selection signal.** Scoring candidates purely on
   "clean uniform border" selects *paintings, scans and newspaper pages* — flat rectangles, the exact
   thing the NOT list bans. The reliable test is to **perform the knockout and measure alpha coverage**:
   a real object leaves 10–70%, a scan leaves ~100%.
5. **Museum open-access APIs beat Wikimedia Commons search** for cut-outable objects. The Met and
   Cleveland serve CC0 objects photographed on sweeps; Commons search returns in-situ scenes. Commons is
   still the only source for the modern half.
6. **A mid-value ground is the worst case for both inks.** Stone `#8d8577` measures 3.24:1 against cream
   (fails) and 4.95:1 against ink (passes). Ink colour must flip **per row**, not globally — a global flip
   blacks out captions on the light grounds. Measured ratios for the six grounds are in `index.html`.
7. **On a 390px phone the crowding collapses to one-per-row** unless items shrink to ~40vw. The
   "many things on the same screen" premise is the first thing a narrow viewport destroys, and it is
   [08](../../.scratch/human-history/issues/08-accessibility-and-mobile.md)'s to solve properly.

## Provenance

All 12 objects carry source, licence and credit on the page, linked to their origin record. Sources:
Cleveland Museum of Art (CC0), The Met (CC0), Wikimedia Commons (public domain / CC BY / CC BY-SA).
Dates are the object's as published by the holding institution; where a source published no date, the
object's own well-attested date is used and hedged in notation (`c. 1880`, `1990s`).
