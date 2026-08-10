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
