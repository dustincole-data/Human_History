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
node sweep10.mjs  [out.json] [--slow]     # the piece — 43 gates
node sweep11i.mjs [out.json] [--slow]     # the index surface — 26 gates, 27 under --slow
node teeth11.mjs  [case]                  # 16 perturbations against sweep11i
node teeth07.mjs  [case]                  # 4 perturbations against sweep10 (ticket 07)
node teeth04r9.mjs [case]                 # 6 perturbations against sweep10 (the rewind)
```

Ticket 04 round 8's instruments. All four are **read-only** — they measure the page, they do not
perturb it, and none of them touches a source file:

```
python cost04r8.py                        # residency arithmetic, no browser. Validates itself
                                          # against 03's own 65.8 / 26.2 MB before it reports.
node   probe04r8-up.mjs                   # what a scroll-UP shows. Found the 7,000 BCE defect.
node   probe04r8-frag.mjs                 # fragment canvases resident across a full walk
node   shots04r8.mjs                      # the four frames in ../verify04r8/
```

Playwright is resolved from `Projects/Deep_Time/package.json`; there is no install here.
`teeth11.mjs` shells `node sweep11i.mjs` from the working directory, so the two stay together.

```
node bench04r8.mjs                        # the replay cost on the frame the visitor reverses.
                                          # Read-only. Checks MS_PER_PX and SUB against the served
                                          # source before it reports, and prices three schedules.
```

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

## What round 9 added to the list

- **A gate has a direction.** `sweep10` walked the page one way and returned 41/41 against a build
  that printed 7,000 BCE over a 1934 car. The truth sweep now walks back UP as well, and
  `ground_is_the_moment` has the second end it never had — a field NEWER than the counter.
- **A screenshot is not always the strongest comparison available.** Two first visits SHOULD be
  compared as pixels and now are. But across a 105,000px round trip the composite differs by one
  RGB unit on ~27,800 glyph pixels while the canvas is pixel-identical, the label HTML is
  byte-identical and all 87 in-viewport elements match — hiding either layer makes them identical,
  which puts it in Chromium's compositor. `pure_function` therefore compares the canvas and the
  DOM, and says so. Reach for a screenshot when the page owns every pixel in it.
- **Gate what is retained, not only what is drawn.** `pure_function` compares every fragment of
  every BUILT object, including the dozen the window is holding off-screen. Three of the round's
  defects were invisible and real, and a gate scoped to the visible ones would have passed all of
  them.
- **Measure the shipped build on the same machine in the same window before believing a
  regression.** Round 9's frame budget looked like noise until HEAD was served side by side from
  `_h_*.js` copies and measured at 17.9ms against 26.1ms. Delete the copies afterwards.

## Never hand-patch a source file to test a gate

Use the teeth harness. It snapshots every file it touches in memory and restores it byte-identical
in a `finally`, and it is the only thing here that does.

Round 14 hand-patched `gravity.js` to watch one perturbation, then undid it with
`git checkout prototypes/webgl/gravity.js` — which does not undo *that patch*, it restores the file
from HEAD and **discards every uncommitted change in it.** An afternoon of ticket-14 work went with
it. Reconstructing it was possible only because each edit was still in the session.

Two rules fall out, and they are cheap:

- **Commit as soon as a round is green.** Tracked-and-committed is the only state that survives a
  careless command; tracked-and-modified is not a backup of anything.
- **To undo a deliberate patch, restore the exact bytes you replaced** — or let the harness do it.
  `git checkout <path>` and `git restore <path>` are not undo, they are "discard my work on this
  file", and they do not ask.
