# The arrival set — data pipeline

> **This folder is the DATA, not a page.** The three flat directions it was named for were
> rejected 2026-08-08 ("really old sites") and their pages were deleted in round 8 of
> [06](../../.scratch/human-history/issues/06-visual-treatment.md), along with the four motion
> demos next door — when a direction is picked, the losers go in the same commit. The one live
> page is `../../site/index.html`, which is the deploy root — ticket 15 decision 1. There are no flags and no switcher.

What is left here is ticket [05](../../.scratch/human-history/issues/05-arrival-set.md)'s
pipeline, which the live page reads:

| | |
|---|---|
| `catalog.py` | 288 named artifacts, authored against 05's region and era targets |
| `source5.py` | resolves each to a licensed full-resolution original and mattes it |
| `build_data.py` | writes `data.js` — the 230 that survived, sorted, with `src · lic · cred` |
| `measure.py --live` | regenerates every table in 05 from the built set |
| `data.js` | what the page loads. `img/` holds the cut-outs |
| `sourced.json` · `frag.json` | the sourcing record and 05's R2 fragment test |
| `sheet*.png` · `set5-live.png` | contact sheets, 05's evidence |

Run the page:

```
cd site
python ../prototypes/webgl/harness/serve.py 8812 --dir .
```

Then <http://localhost:8812/index.html> — the same shape the deployed site serves at `/`.
