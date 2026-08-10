# The harness

The gates and their teeth. **In the repo on purpose, as of round 12.**

Round 11 learned half of this lesson — a perturbation harness that mutates an *untracked* file has
no git to fall back on when a run is killed — and tracked `index.js`. It was the wrong half. The
run that got killed was recoverable; **the harness that ran it was not**, because it lived in a
session scratchpad. Round 12 only got it back because a previous session's temp directory happened
not to have been swept yet. Tracking the thing being perturbed and not the thing doing the
perturbing protects the cheap half.

## Running it

Serve `prototypes/` on 8812; the only URL is `/webgl/index.html`.

```
node sweep10.mjs  [out.json] [--slow]     # the piece — 39 gates
node sweep11i.mjs [out.json] [--slow]     # the index surface — 23 gates, 24 under --slow
node teeth11.mjs  [case]                  # 16 perturbations against sweep11i
```

Playwright is resolved from `Projects/Deep_Time/package.json`; there is no install here.
`teeth11.mjs` shells `node sweep11i.mjs` from the working directory, so the two stay together.

`--slow` holds every `img/` and `thumb/` request 40–340ms at random. It is not decoration: three of
round 10's gates were green with their own code deleted because localhost is never late, and
round 12 found a fourth that never exercised the delay it was named for.

## What a run has to say before it is believed

- **A fresh load per phase.** State latches — contact, decay, `gone` — so a gate that reuses a page
  another gate already scrolled is reading a different piece.
- **Every reading of the air taken with the objects out of frame.** A sky probe reads a gold
  artifact as sky and returns 255. Found in round 9, found again in round 11 through another door.
- **Never ask the page whether it agrees with itself.** Two of round 8's gates were tautologies:
  corrupting the stored value moved both sides together. Check against the dates, the tables, or a
  composited pixel.
- **A gate is only worth its perturbation.** Run `teeth11.mjs` and require *exactly its own gate*
  to go red. Round 12 found two gates that could not fail for the reason they were written and had
  been counted green in a table of 24 — a gate that cannot go red is a decoration.
- **Run the teeth one case at a time and check `git status` between.** A killed suite leaves its
  perturbation in a source file; the files are only restored in the `finally`.
