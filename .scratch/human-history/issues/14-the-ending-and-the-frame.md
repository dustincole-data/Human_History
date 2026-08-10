# 14 — The ending, the cross-link, and the signature

Type: prototype
Status: open
Blocked by: 05, 06, 07
Parent: [Human History — Wayfinder Map](../map.md)

## Question

**What does the visitor hit when the last object has broken, and how does this site say whose it
is and what it sits beside?**

Three asks from Dustin on 2026-08-08, after seeing the 230-item set run. They are one ticket
because they all live in the same few hundred pixels at the bottom of the scroll, and because
deciding them separately produces three unrelated things stapled to an ending.

### 1. A real ending

Verbatim: *"We probably do want a cool ending."*

**This reopens a specific line in [01](01-the-fun-thesis.md), which ruled a quiet stop and
explicitly *no finale*** — that ruling was made when the piece was 58 items and had no reward in
it. [12](12-scrollytelling-craft.md) then established from evidence that **fun needs reward**, and
[13](13-visual-direction-v2.md) built a piece whose entire grammar is things being destroyed. An
ending is the one place that grammar can resolve.

Constraints it inherits and does not get to break: no scrolljack, native scroll 1:1
([12](12-scrollytelling-craft.md)); the ground never moves and never changes colour
([13](13-visual-direction-v2.md)); no generated imagery, ever; and **decay is one-way** — 13 made
that a deliberate honesty call, so an ending that un-breaks everything is a reversal, not a flourish.

Worth noting what the material already offers: the last object to arrive is the newest thing anyone
made, and it breaks like everything before it. That is an ending, if it is staged.

### 2. The kick-over to Deep Time

Verbatim: *"we're probably going to want to add a link to [Deep Time] at the very end to point
people to this project, because the last little piece in that project at the very end is all of
human history. It fits in this one last line, so it could be a cool little kick over to this
project."*

The observation is exact: **Deep Time's final entry is the whole of human history compressed into
its last sliver.** This site is that sliver, opened up. That is a genuinely good pairing and it is
the strongest cross-link either project will ever have.

**Direction needs pinning down, and one half is out of scope.** Read literally it is a link *in
Deep Time* pointing *here* — and the map rules **Deep Time out of scope: "Do not edit, rebake or
re-source anything under `Projects/Deep_Time`."** Editing Deep Time is a decision only Dustin makes,
separately. The half that is unambiguously in scope is the **outbound link from this site's ending
to Deep Time**, which is also what makes the pair work in both directions once the other half ships.

Resolve: (a) the link from here to Deep Time — this ticket; (b) the link from Deep Time to here —
a scope change on a shipped site, and Dustin's call, not this ticket's.

### 3. The signature

Verbatim: *"it will need the Dustin Cole data logo, like all my other projects, the little
signature logo somewhere."*

Straightforward and non-negotiable: the dustincoledata signature mark, placed as the other projects
place it. Take the existing treatment from a shipped sibling rather than inventing one — Deep Time,
Namesake and Cascade already answer this and the answer should be identical, not similar.

**Deliverable:** the ending built and running against the real 230-item set, with the outbound Deep
Time link and the signature in place; plus a one-line statement of what the ending *is*, precise
enough that [09](09-spec-assembly.md) can write it down.

---

## Two rulings from Dustin, 2026-08-10 — asked before anything was built

Both were put to him as concrete options with the mechanism drawn, not as a description of a
direction. Recorded verbatim as choices, before the build, so the build is not the argument.

### Ruling A — the ending is THE LAST OBJECT NEVER BREAKS

Of three mechanisms offered (the last object stays whole · the counter arrives at *now* and goes
out · one screen of empty ground), he took the first.

**The newest thing anyone made arrives, lands, and does not shatter.** Every one of the 229 before
it fell, broke, broke twice more and went under the earth; this one stays whole while the visitor
scrolls past it, keeps its name, and keeps its citation. Then the piece fades and the shelf carries
all 230 standing.

Why it survives the constraints it inherits, each checked rather than asserted:

- **No scrolljack** — nothing is pinned, nothing is timed, the object simply does not advance.
- **Decay is one-way** ([13](13-visual-direction-v2.md)) — nothing is un-broken. An object that
  never breaks is not a reversal of decay, it is the absence of it.
- **No generated imagery** — no new art at all; the ending is made of a photograph already in the
  set and the choice not to cut it.
- **[01](01-the-fun-thesis.md)'s no-finale survives** — there is no crescendo, no reveal and no
  new grammar. It is the existing grammar declining to fire once.
- **[12](12-scrollytelling-craft.md)'s flatness rule is paid** — the one thing a treatment repeated
  230 times cannot do is stop, and stopping is the shape change.

And it is *true*, which is the reason to prefer it over the other two: the last object is the one
time has not got to yet. The piece's subject is time taking things; the honest ending is the thing
it has not taken.

**This is a build with a known cost, and the cost is named up front:** it puts the piece's own word
gates in conflict, because they check every live object and two of them assert the opposite of
this. `name_dies_at_impact` fails the moment a name outlives `NAME_OUT`, and
`credit_spreads_with_its_wreckage` measures a citation against debris that will not exist. **They
must be re-aimed, not narrowed** — the exemption is exactly one object and has to be gated as such,
or "the last one is special" becomes a hole any future defect can walk through.

### Ruling B — the signature goes in BOTH places, Deep Time's treatment exactly

Offered as colophon-only versus both; he took both. The fixed bottom-right pill on the piece for
the whole scroll, **identical to Deep Time / Namesake / Cascade rather than similar** (14's own
instruction), and the mark again at the foot of the credits roll alongside the outbound Deep Time
link — which is where his earlier steer put the link and the mark.

The treatment to copy verbatim is `Projects/Deep_Time/src/pages/index.astro`: the `.dcd-mark`
anchor, its inline SVG (letters take the page's ink, **the period stays brand blue on every site**),
and the `right`/`bottom` clearances. The one thing that does not transfer is *which* corner is free
— Deep Time reserves bottom-right because its true-scale bar owns the right edge, and this piece
has no such bar, so the corner has to be re-chosen against this page's HUD and hint rather than
inherited.

**Note the tension this creates and does not resolve:** [11](11-visual-anchor.md) ruled that
nothing on the page has an edge except the thing itself, and a bordered, backdrop-blurred pill is
an edge. It is a byline rather than content, every sibling wears it, and Dustin asked for it — but
the conflict is real and belongs in this ticket's round, not buried in a stylesheet.

---

## Round 1, 2026-08-10 — built. Both rulings run against the real set.

### The ending, in one sentence

**The last object is a Chinese electric car from 2022, and it is the only one of the two hundred
and thirty that does not break.**

It falls like the other 229 — same arc, same scroll clock, same landing solved off its own
silhouette — and then nothing happens to it. No cut, no splits, no dust. Its name, its date and its
citation stay whole beside it for as long as it is on the screen. The piece goes out over it and
the shelf brings everything back.

That is the whole ending, and it is made of one decision not to run existing code. There is no new
grammar in it, which is how [01](01-the-fun-thesis.md)'s no-finale survives an ending, and it is
the one shape change a treatment repeated 230 times can still make ([12](12-scrollytelling-craft.md)).

### Ruling A, built — six places in `gravity.js`, and the sixth was found by the ending not happening

The plan named five: the cut at `land()`, the split schedule in `advance()`, the retire branch, the
death branch, and a teardown driven by the seam because an object with no decay has no death of its
own to die. All five went in and **the ending still did not exist** — the last object hung in the
air forever and the piece ended mid-fall.

**The sixth is [03](03-engine-reuse-or-clean-build.md)'s texture window.** It keeps a photograph
while `rel - FALL < LIFE[i]`, and the one object with no life to run out fell straight through that
bound: its sprite was released before it ever landed, `no pixels, no fall` then refused to land it,
and the two rules that hold the memory ceiling up quietly deleted the ending. The window's upper
bound now does not apply to the last object; the release on `d.down` still fires the instant it
lands, so the ceiling is untouched. **This is the second time 03's pair of rules has produced a
defect nobody predicted, and both times it was caught by a gate or a frame rather than by reading.**

The cut is one voronoi cell — the whole silhouette — rather than no cut at all, because both the
draw path and 03's residency rule key off `d.pieces`: an object that keeps no fragment keeps
nothing to draw and would vanish at the instant it arrived. One fragment is the same pipeline, the
same bound, and pixel-coincident with the sprite it replaces.

### Ruling B, built — and the signature arrived carrying a wall clock

Deep Time's `.dcd-mark` copied verbatim: the same anchor, the same inline SVG, and **the period
still brand blue on a page whose ink is `#eef2f7`**, which is the one part of the mark that never
localises. Bottom-right, re-checked against this page's own furniture rather than inherited — `#hud`
owns the top left, `#intro` the bottom left, `#hint` the bottom centre.

**It rides the piece and goes out with the seam, like the HUD.** Without that, the fixed pill and
the colophon's copy of the same mark are on screen together the moment the credits roll comes up.

Two things fell out of building it, and neither was predicted:

1. **The mark's opacity was on a wall clock.** Deep Time transitions it — harmless there, because it
   only ever changes on hover. Here the seam drives that same property off the scrollbar, so a
   `transition: opacity .2s` is a 200ms ease on a scroll-driven value: the thing [04](04-scroll-mechanic.md)
   and [12](12-scrollytelling-craft.md) rule out everywhere else on this page. `signature_goes_out_with_the_piece`
   read **0.225 on the shelf where the scroll said 0** on its first run. Opacity is out of the
   transition list; hover snaps, like every other opacity on the piece.
2. **The mark is furniture the words respect, not an exception to 11's contract.** A fixed pill in
   the bottom-right corner sits inside the soil band the newest citations are written in. Its box
   is reserved in the collision list before any word is placed, and it goes *into* the sweep's
   `boxes()` rather than beside it — so `no_text_collision_1440` and `_390`, which are already ship
   gates, cover it across the whole scroll at both viewports for nothing.

### The gates were RE-AIMED, not narrowed

The ending puts two of the piece's own gates in direct conflict, exactly as this ticket warned. The
distinction matters more than the fix:

- **`name_dies_at_impact` no longer claims "no name outlives impact."** It claims **the set of names
  that outlive impact is exactly `{229}`**. A gate that simply skipped index 229 would go on passing
  if a second object stopped breaking; this one cannot, and `two_of_them_survive` in the teeth is
  the case that proves it.
- **`credit_spreads_with_its_wreckage`** is skipped for the one object that has no wreckage — but
  only because the claim below now covers it.
- **`only_the_last_one_survives`** is new and carries the exemption: one piece, zero specks, zero
  splits, name and citation both complete, at **every** stop past its landing. Without it, "the last
  one is different" is a hole any later defect walks through.

### Two defects the frames caught, and one thing the gates could not rule on

1. **The phone clipped the credit off the right edge** — `ALEXANDER MIG`. The cluster is anchored at
   `credX`, which is only held to 15–85% of the width, so on a 390px screen an 80px half-cluster
   hung off the edge. Clamped as a **cluster**, not word by word: clamping each word keeps them all
   on screen and piles them against the margin, and the thing that has to survive here is the shape.
2. **The standing object read as hovering over the soil.** `landing_is_solved_from_the_silhouette`
   is green and stays green — but **it only asserts that no landing was solved blind, not that
   anything touches**, which is a distinction worth writing down before it is relied on again. The
   solve is in fact exact: `yLand = surfAt(x + bestX) - bestY` puts the lowest point of the rotated
   silhouette on the contour. The problem is that exact contact at a **single point**, with no shard
   and no shadow under it, reads as hovering. **The other 229 hide this** — their shards fall the
   last few pixels and bed into the surface, and `shatterNow` has stated that rule all along ("it
   beds INTO the surface, it does not perch on it"). The ending is simply the first object whose
   landing anyone can look at. Bedded 3px, the shards' own floor.

### The teeth found the gate's blind spot, and it was the important one

Eight perturbations. Five went red first time. **Of the three that did not, two were wrong
expectations and one was a gate that could not see the defect it was written for.**

- **`the_ending_never_lands` reddened nothing** — and that case re-breaks the exact texture-window
  defect this round shipped, so it should have been the easiest red on the list. **The walk is why.**
  `only_the_last_one_survives` sampled the scroll continuously, and a continuous sweep passes
  through `LAND[229]` while the sprite is still inside 03's window, so the object lands normally and
  is whole at every stop the walk takes. The defect only exists for a visitor who **arrives** at the
  end instead of scrolling to it: jump past the release point and the photograph was never held,
  *no pixels, no fall* refuses the landing, and the piece ends on an object still in the air.
  **That is how a scrollbar drag reaches the ending** — the common case, not the corner one. The
  gate now takes a second reading after a hard jump to TOTAL on a page that has been nowhere else,
  and the perturbation goes red.
- **`the_last_one_breaks_too` was an expectation error.** It expected `name_dies_at_impact` to
  redden as well; that gate stayed green, correctly. The cut and the name exemption are two
  different touch points, and removing the cut leaves the survivor set exactly `{229}` — which is
  the whole of that gate's claim. `two_of_them_survive` is the case that moves it, and it does:
  `names alive past 0.07 of a life: {228, 229} — want exactly {229}`.
- **`signature_ignores_the_words` reddened the phone and not the desktop:** 1 overlap over 290 stops
  at 390, none at 1440. That is the honest result rather than a weak gate. At 1440 the soil is wide,
  citations sit centrally and the bottom-right corner is genuinely empty most of the way down, so
  the desktop sweep passes with the reservation deleted. **The phone is what proves the reservation
  is load-bearing** — worth knowing before a green 1440 is read as evidence the pill is out of the way.

Same pattern as [10](10-the-index-surface.md) round 12, one ticket later: the page was right every
time and the instrument was what needed correcting.

### The corner needed a gate of its own, because the collision walk was a coin flip

`signature_ignores_the_words` reddened `no_text_collision_390` on one run and **nothing** on a
re-run of the identical perturbation. One overlap over 290 stops taken a single rAF apart is a
knife-edge: how far a citation has spread at a given stop depends on how much of the cutting queue
has drained, and that is machine timing, not scroll position. **A detector that finds the defect one
run in two is not a gate** — which is round 12's lesson arriving inside the round that learned it.

`signature_keeps_its_corner_clear` replaces it: the phone, through the crowded tail, settled at each
stop. **0 words intersect the mark over 251 stops, nearest approach 4.4px, 5 stops with a word
inside 24px.** That last number is the point of the gate — zero overlaps over a corner nothing ever
reaches would prove nothing, so the gate reports how contested the corner actually is. At 4.4px the
reservation is doing real work, and a green 1440 was never evidence of that.

### Two mistakes in the making of this round, both worth more than the code

1. **`git checkout prototypes/webgl/gravity.js` destroyed every uncommitted ticket-14 change in the
   file.** It was reached for to undo a hand-applied test patch; it is not an undo, it is "discard
   my work on this file", and it does not ask. All nine edits were reconstructed from the session
   and the smoke test read identically afterwards, so nothing was lost but time. **The rule that
   falls out is `commit as soon as a round is green`** — tracked-and-modified is not a backup of
   anything — **and never hand-patch a tracked file to test a gate.** The teeth harness snapshots
   and restores byte-identically; that is what it is for. It is in the harness README.
2. **The reconstruction passed both sweeps while still being wrong.** It rebuilt the impact line as
   `keepWhole(d, cx)` rather than `keepWhole(d)`. The parameter was never used, so the page behaved
   identically and 41/41 and 26/26 both stayed green — but the teeth anchor no longer matched, and
   `the_last_one_breaks_too` silently stopped running. **A reconstruction that passes every gate can
   still be wrong in a way only the perturbations can see**, and a case that fails to apply is not a
   case that passed.

### Verified

`sweep10` **41/41** normal and **41/41** under `--slow`; `sweep11i` **26/26** normal and **27/27**
under `--slow` (the wrap gate is `--slow`-only, which is why the two counts differ); `teeth14`
**8/8 red**, files restored byte-identical.

Three of those gates are new this round — `only_the_last_one_survives`,
`signature_keeps_its_corner_clear` on the piece, and `signature_goes_out_with_the_piece` plus
`signature_is_the_shared_mark` and `colophon_links_to_deep_time` on the shelf — and one, `hang`, was
hardened after it failed on machine load rather than on the page: it read `y undefined -> 94.34`
because the sprite had not decoded when the probe fired, so nothing was airborne yet. That is *no
pixels, no fall* working correctly. The probe waits for the photograph before starting its clock;
the gate is about the scroll being the only clock, not about how fast localhost decodes.

### What this ticket does NOT close

- **The ending's words — [07](07-copy-voice-and-name.md), and it may turn out there are none.**
  Ruling A is wordless by construction: the ending is an object that keeps its own name and its own
  citation, and there is no line of copy anywhere in it. That may be the right answer, but it is
  07's to make, not this ticket's to assume.
- **The colophon's sentence is placeholder-grade** — *"Deep Time runs from the formation of the
  Earth to now. Its last sliver is this whole site."* Flat declarative and true, which is the most
  that can be claimed for it before the voice exists. It is the second placeholder on this surface,
  after [10](10-the-index-surface.md)'s roll heading.
- **The link from Deep Time to here.** The map rules Deep Time out of scope, so the inbound half is
  Dustin's separate call on a shipped site. The outbound half built here works alone and works
  better once the other ships.
- **The share artifact and the social card.** Still unticketed. The ending is now the obvious
  candidate the map said did not exist yet — a single object standing whole on the earth, named and
  cited, is a still that needs no finale to render.
