# Time Takes All

Twelve thousand years of things people built, and what was standing next to each one. 236 real,
cited, licence-clean cut-outs; scroll and each one falls, breaks, and goes into the ground.

**Live: <https://timetakesall.dustincoledata.com>**

Sibling to [Deep Time](https://deeptime.dustincoledata.com), not a sequel to it.

## Layout

| | |
|---|---|
| `site/` | **the whole site, ~11.5 MB.** The deploy root. Static files and ES modules — no build step, no bundler, no framework. |
| `prototypes/directions/` | the pipeline: `catalog.py` → `source5.py` → `build_data.py` → `site/data.js`, plus `bake_sprites.py` and `bake_index.py`, the masters, and the contact sheets. **43 MB, never deployed.** |
| `prototypes/webgl/harness/` | the gates and their teeth. See its own README. |
| `prototypes/webgl/verify*/` | frames every ticket's claims rest on. **Never deployed.** |
| `.scratch/human-history/` | the wayfinder map and the fifteen tickets — the reasoning behind every decision here. |

`site/data.js`, `site/img/` and `site/thumb/` are **generated**. Edit the pipeline, not the output.

## Running it

```
cd site
python ../prototypes/webgl/harness/serve.py 8812 --dir .
```

Then <http://localhost:8812/index.html> — deliberately the same shape the deployed site serves at
`/`, because the gates are written against that URL and they are only a statement about the site if
the two match.

## Deploying

**PUSHING TO `main` AUTO-DEPLOYS.** The Vercel project `time-takes-all` is connected to this GitHub
repository, so a push to `main` builds and promotes to production on its own. You do not need
`npx vercel --prod`, and running it is not harmful — it just deploys the working copy instead of the
commit.

This is written down because the failure mode is silent and it is not the same across these
projects: at least three siblings do **not** auto-deploy and their memory is *"push ≠ deploy"*.
Verified here rather than assumed — a commit was pushed with no CLI deploy and the new production
deployment appeared on its own.

There is no build step. `vercel.json` sets `outputDirectory: site`; `.vercelignore` keeps
`prototypes/` and `.scratch/` out of the upload entirely.

**Verify against the real domain, never a per-deployment URL** — those return 200 with an SSO page
on these projects, so a status check against one proves nothing. Grep the live HTML for something
only this build has.

## Gates

43 in `sweep10` (the piece) and 26 in `sweep11i` (the shelf), plus four perturbation suites.
Run them against `site/` on 8812, and against the deployed origin before believing a release —
localhost is never late.
