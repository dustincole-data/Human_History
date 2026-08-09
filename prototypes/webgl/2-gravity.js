/* 2 — GRAVITY. Round five: things break, and the pieces break, over a ground that never moves.

   Round 4 rebuilt the burial three ways and all three were rejected — the concept, not the
   execution: "don't really love any of them." The accumulating ground is dead. No rising level,
   no strata stacking up, no camera tracking a pile.

   What replaced it, verbatim: "objects break into pieces when they hit the ground, and the text
   goes away. As time goes on they break down into smaller and smaller pieces until they
   disintegrate into the ground. Don't have the ground change or build up over time. It can just
   remain still."

   So decay lives in the OBJECT. Time reads as progressive fragmentation:
   whole → impact → shatters → pieces break into smaller pieces → dust → gone into the ground.

   THREE RULINGS MADE BEFORE ANY CODE, because two of them were load-bearing and unresolved:

   1. CITATION. "The text goes away" collides with "credit stays on screen." Resolved: the name
      and the date die at impact, exactly as asked. A small credit line — source · licence ·
      credit — stays at the spot where the object fell and lives for exactly as long as one
      fragment of that object does. It dies with the last speck. Nothing is ever on screen
      without its attribution, and nothing carries attribution after it is gone.

   2. SHATTERING A PHOTOGRAPH IS A CUT, NOT A GRADE — therefore legal. Every fragment is the
      source image drawn through an alpha clip; each surviving pixel keeps its exact original
      RGB. Same operation class as the cut-outs the set already ships. Dust specks take their
      colour by sampling the photograph's own pixels. No tint, no duotone, no grade, ever.

   3. THE GROUND IS STILL, AND SO IS ITS COLOUR. One material, one level, baked once and never
      touched. The era's colour moved to the LIGHT — direction B, the one picked when forced —
      so the piece stays colourful without the ground ever changing.

   Three answers to how a thing comes apart, on the same 72 real objects. ?b=a|b|c.

     a · SHATTER   brittle. It hits and breaks into hard-edged shards that scatter and settle.
                   Each shard then breaks into shards, twice, and the last ones become dust.
     b · CRUMBLE   erosion. The impact takes a couple of chips; after that it comes apart from
                   the outside in, flake by flake, and the core is the last thing recognisable.
     c · SIFT      drainage. It stays standing and empties — eaten upward from the bottom along
                   its own grain, the material sifting down out of it into the ground.

   Native scroll 1:1 throughout.

   ------------------------------------------------------------------------------------------
   ROUND SIX — ticket 04. THE FALL IS SCROLL-DRIVEN, NOT GRAVITY-DRIVEN.

   Dustin, after seeing the 230-item set run: "if somebody lets up on the arrow when something
   is in mid-fall, it shouldn't continue falling. Scrolling down is what should make the item
   hit the ground, not actual gravity."

   So an object's height is a pure function of scroll position. Let up, and it hangs — not
   because anything was paused, but because there is no clock to pause. THE SCROLL IS THE ONLY
   CLOCK IN THIS FILE. Nothing anywhere advances on wall time: not the fall, not the shard
   scatter, not the impact dust, not the era's light. Stop scrolling and the whole frame is
   frozen, exactly as he asked for, everywhere rather than only where he happened to notice it.
   Round 7 removed the one exception round 6 left standing — the name/date CSS fade and the
   300ms re-measure behind it. See `land()`. There is now no wall clock in this file at all.

   What that deleted:

   - **matter.js, entirely.** Its only job was the fall. A scroll-mapped height needs no solver,
     no world, no bodies, no walls; the shards were already a non-physics integrator in decay.js
     and the vendor file is no longer loaded at all. "Drag to throw" went with it — you cannot
     drag an object whose position is bound to the scrollbar without one of them lying.
   - **The 880 ms floor, and the queue behind it.** Both existed to stop a fast scroll dumping
     four objects at once. Spacing is now scroll distance alone: an arrival owns 1,000 px, its
     fall spends 800 of them, so exactly one object is ever in the air and a flick simply moves
     that one object further down its own arc. The failure mode is gone by construction, not by
     rate-limiting.
   - **Per-frame collision testing.** The landing offset is solved once, before the fall starts,
     from the object's real silhouette at the exact angle it will be tumbling at when it arrives.
     Contact therefore happens at t = 1 precisely, at scroll offset 800 of that arrival, every
     time. The whole piece is deterministic: the same scroll position always looks the same.

   THE RULING ON SCROLLING BACK UP — the fall reverses, the break does not.

   Height is a function of scroll, so scrolling up mid-fall lifts the object back toward the top
   of the screen and out of the frame. That is not a concession, it is the same sentence read
   backwards: if letting up makes it hang, then reversing must make it rise, or "hang" was never
   true. But contact LATCHES. The instant an object touches down it is broken, and no amount of
   scrolling back up reassembles it, un-shatters a shard, or puts a name back on screen. Decay
   stays one-way exactly as round 5 ruled it.

   The line is between a position and an event. A position is a function of where you are and
   is free to run either way; an event happened, and scrolling up is not a time machine. */

import { ITEMS, lightFor, shortCred, setHud, setIntro, fadeIntro, done, hash, REDUCED } from './shell.js';
import { hexA, rng, noise1, Dust, tileFor, mottle, restProfile } from './burial.js';
import {
  sites, voronoi, jitter, strips, cutPiece, punch, biteUp, avgColor,
  makePiece, stepPieces, drawPieces
} from './decay.js';

const qs = new URLSearchParams(location.search);
const MODE = ({ a: 'a', b: 'b', c: 'c' })[(qs.get('b') || 'a').toLowerCase()] || 'a';

const MODES = {
  a: { name: 'SHATTER',
       intro: 'Everything here hit the ground once. It broke, and then the pieces broke, and the pieces of those broke, until there was nothing left the ground could not take.',
       hint: 'scroll to drop it · stop and it hangs' },
  b: { name: 'CRUMBLE',
       intro: 'Nothing goes all at once. It loses its edges first, then its corners, then everything that was not the middle of it — and the last recognisable thing is the last thing to go.',
       hint: 'scroll to drop it · stop and it hangs' },
  c: { name: 'SIFT',
       intro: 'It stays standing the whole time and empties from the bottom up, along whatever grain it had, until the shape is the only thing left and then that goes too.',
       hint: 'scroll to drop it · stop and it hangs' }
};
const M = MODES[MODE];
setIntro(M.intro, M.hint);

/* ------------------------------------------------------------------ the world

   There is no camera any more. The ground sits at a fixed screen y and stays there, so world
   space and screen space are the same thing. Everything round 3 and 4 spent on tracking the top
   of a growing pile is deleted. And as of round 6 there is no physics engine either — the only
   integrator left in the piece is decay.js's debris stepper, and even that is fed scroll. */

const host = document.getElementById('gl');
const cvs = document.createElement('canvas');
cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';
host.appendChild(cvs);
const ctx = cvs.getContext('2d');

// the ground is static, so it is drawn ONCE into its own canvas and blitted every frame
const gcvs = document.createElement('canvas');
const gctx = gcvs.getContext('2d');

/* one fixed soil. Dark and neutral on purpose: the era colour is a light, and a light needs
   something unlit to be a light against. */
const SOIL = { m: '#2b2620', d: '#4c4438', k: '#171410', l: '#5c5344' };

let W = 0, H = 0, dpr = 1;
let surf = new Float32Array(1), COLW = 4, PAD = 80, NCOL = 1;
const groundY = () => H * 0.71;
const idx = x => Math.max(0, Math.min(NCOL - 1, Math.round((x + PAD) / COLW)));
const xAt = i => i * COLW - PAD;
const surfAt = x => surf[idx(x)];

function bakeSurface() {
  NCOL = Math.ceil((W + PAD * 2) / COLW) + 1;
  surf = new Float32Array(NCOL);
  const gy = groundY();
  for (let i = 0; i < NCOL; i++) {
    const x = xAt(i);
    surf[i] = gy +
      (noise1(x * 0.0012) - 0.5) * 44 +
      (noise1(x * 0.0064 + 11) - 0.5) * 15 +
      (noise1(x * 0.047 + 31) - 0.5) * 4;
  }
}

/* everything below the surface contour, as a path — the only shape the earth is ever drawn as */
function region(c, off, step = 4) {
  c.beginPath();
  c.moveTo(-8, surf[idx(-8)] + off);
  for (let x = -8; x <= W + 8; x += step) c.lineTo(x, surf[idx(x)] + off);
  c.lineTo(W + 8, H + 8);
  c.lineTo(-8, H + 8);
  c.closePath();
}

/* Baked once per resize and never again. Grain, inclusions and micro-bedding from burial.js —
   that material is the one thing round 4 got right and it is not rebuilt here. */
function bakeGround() {
  gcvs.width = Math.round(W * dpr); gcvs.height = Math.round(H * dpr);
  gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gctx.clearRect(0, 0, W, H);

  const tile = tileFor(SOIL, 3);
  gctx.fillStyle = gctx.createPattern(tile, 'repeat');
  region(gctx, 0);
  gctx.fill();

  gctx.globalCompositeOperation = 'source-atop';

  const mt = mottle();
  gctx.fillStyle = gctx.createPattern(mt, 'repeat');
  gctx.fillRect(0, 0, W, H);

  // the top few inches take the sky. Fixed, not era-driven — the ground's colour never moves.
  gctx.fillStyle = 'rgba(255,236,208,.016)';
  for (let k = 0; k < 9; k++) { region(gctx, k * 7, 8); gctx.fill(); }

  // light dies with depth, measured from the local surface so the darkening bends with the land
  gctx.fillStyle = 'rgba(5,5,7,.055)';
  for (let k = 0; k < 26; k++) { region(gctx, k * 40, 12); gctx.fill(); }

  gctx.globalCompositeOperation = 'source-over';

  // loose debris straddling the line, so the eye can never trace one continuous edge
  const r = rng(9001);
  for (let i = 0; i < NCOL; i += 2) {
    const q = r();
    if (q > 0.4) continue;
    const x = xAt(i), y = surf[i] + (q - 0.2) * 24;
    const s = q < 0.05 ? 2 + q * 44 : 1 + q * 2;
    gctx.fillStyle = hexA(q < 0.2 ? SOIL.k : SOIL.l, 0.3 + q);
    gctx.fillRect(x + q * 4, y, s, s * 0.8);
  }
}

function fit() {
  W = innerWidth; H = innerHeight;
  dpr = Math.min(devicePixelRatio, 2);
  cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  bakeSurface();
  bakeGround();
  for (const d of drops) {
    for (const p of d.pieces) p.rest = false;     // re-settle onto the new land
    if (!d.down) d.prepped = false;               // the landing solve is against a surface that moved
  }
}

/* ------------------------------------------------------------------ the objects */

const imgs = await Promise.all(ITEMS.map(it => new Promise(res => {
  const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null);
  im.src = `img/${it.k}.webp`;
})));

const labelLayer = document.getElementById('labels');
const drops = ITEMS.map((it, i) => {
  const im = imgs[i];
  const el = document.createElement('div');
  el.className = 'lab';
  el.style.opacity = '0';
  el.innerHTML = `<div class="n">${it.n}</div><div class="y">${it.disp}</div>
    <div class="c">${it.src} · ${it.lic} · ${shortCred(it.cred)}</div>`;
  el.style.setProperty('--spot', lightFor(it.y)[1]);
  // shrink-to-fit, so the collision test is against the TEXT and not against a 633px-wide box
  // that is mostly empty. Scoped here — the other three demos keep the shared rule.
  el.style.width = 'max-content';
  el.style.maxWidth = 'min(30ch,44vw)';
  labelLayer.appendChild(el);
  const [nEl, yEl, cEl] = el.children;
  /* the miss, in years. Its own node because it belongs to a pair, not to either item — it has
     to die when the FIRST of the two goes, which is not either label's lifetime. */
  const tEl = document.createElement('div');
  tEl.className = 'thr';
  tEl.style.opacity = '0';
  labelLayer.appendChild(tEl);
  return {
    it, im, i, ar: im ? im.width / im.height : 1, light: lightFor(it.y),
    el, nEl, yEl, cEl, mw: 0, mh: 0,
    tEl, tie: null, tw: 0, th: 0,
    /* the fall, as pure scroll geometry. prepped once; t is where the scrollbar is inside it. */
    prepped: false, t: -1, air: false,
    x: 0, w: 0, h: 0, a0: 0, spin: 0, ySpawn: 0, yLand: 0, dxLow: 0,
    down: false, px: 0, py: 0, angle: 0, landScroll: 0, age: 0, prevAge: 0,
    core: null, cctx: null, cells: null, cols: null, nextCell: 0, splits: 0,
    pieces: [], specks: [], dusted: false, credX: 0, credY: 0, gone: false
  };
});

const dust = new Dust();
const queue = [];                                   // deferred cutting, so a split never drops a frame

/* ------------------------------------------------------------------ the scroll budget

   Every number here is a distance. There is not a millisecond anywhere in the mechanic.

   ROUND SEVEN. 13's two spacing constants — 1,000px per arrival and a 4,200px decay life — were
   both uniform, and 04 already flagged them as 13's numbers rather than measured ones. Uniform is
   what produced the two things left open: a 235,100px scroll, and a deep head that costs exactly
   as much wheel per item as the crowded present while having nothing on the ground to look at.

   Both become functions of one quantity: `co`, how many things were already standing when this
   one arrived — items within W_YEARS behind it. That number is 0–3 through the deep head and
   saturates by the Roman era, so the head and the body differ everywhere without a boundary
   between them. Nothing is announced. Same rule, all the way down.

     the fall     constant. The era may not change how heavy a thing is.
     the beat     grows with `co` — the pause after impact is for reading the ground, and an
                  empty ground needs no pause.
     the life     is the contemporary window itself: an object stays on the ground until the
                  counter has moved W_YEARS past its own date. So what is lying on the ground at
                  any scroll position is, within the clamps below, exactly the set of things that
                  were standing within eighty years of each other. That is 01's ambient engine —
                  not a caption about co-occurrence, the ground IS the co-occurrence.

   The two clamps are honest compromises and are named as such: LIFE_MIN keeps a lone object
   around long enough for the break to read (below ~1,400px the shatter, its two splits and the
   dust do not have room), and LIFE_MAX caps how much can be on the ground at once, for the
   credit-collision contract and for memory. Inside the clamps the ground is true; at the clamps
   it is bounded. */

const W_YEARS  = 80;                                // "standing at the same time", in years
const FALL     = 460;                               // px the fall spends — constant everywhere
const BEAT_MIN = 60;                                // beat after impact on an empty ground
const BEAT_MAX = 200;                               // …and on a crowded one
const BEAT_AT  = 5;                                 // `co` at which the beat is fully open
const LIFE_MIN = 1400;                              // floor: the break has to be readable
const LIFE_MAX = 4200;                              // ceiling: 13's number, now the cap not the rule
const SPLITS = REDUCED ? [0.34] : [0.30, 0.56];
const DUST_AT = REDUCED ? 0.62 : 0.76;

/* Everything about where an arrival sits is solved here, once, from the dates alone. The whole
   page is a lookup into these four arrays, so a scroll position resolves to the same frame no
   matter how the visitor got there. */
const N = ITEMS.length;
const CO = new Int32Array(N), PER = new Float64Array(N);
const START = new Float64Array(N), LAND = new Float64Array(N), LIFE = new Float64Array(N);
{
  let lo = 0;
  for (let i = 0; i < N; i++) {
    while (ITEMS[i].y - ITEMS[lo].y > W_YEARS) lo++;   // both sorted, so this only moves forward
    CO[i] = i - lo;
    PER[i] = FALL + BEAT_MIN + (BEAT_MAX - BEAT_MIN) * Math.min(1, CO[i] / BEAT_AT);
  }
  for (let i = 1; i < N; i++) START[i] = START[i - 1] + PER[i - 1];
  for (let i = 0; i < N; i++) LAND[i] = START[i] + FALL;
  for (let i = 0; i < N; i++) {
    let end = START[N - 1] + PER[N - 1];
    for (let j = i + 1; j < N; j++) if (ITEMS[j].y > ITEMS[i].y + W_YEARS) { end = LAND[j]; break; }
    LIFE[i] = Math.max(LIFE_MIN, Math.min(LIFE_MAX, end - LAND[i]));
  }
}
const TOTAL = START[N - 1] + PER[N - 1] + LIFE[N - 1];
const idxAt = s => {                                 // which arrival owns this scroll position
  let a = 0, b = N - 1;
  while (a < b) { const m = (a + b + 1) >> 1; if (START[m] <= s) a = m; else b = m - 1; }
  return a;
};

/* ------------------------------------------------------------------ the tie

   01's engine, stated: "every item surfaces what else was standing at that moment, and by how
   much they miss each other." The ground already carries the first half. This is the second — one
   line laid on the soil between an arrival and the thing it landed next to, with the miss written
   on it. It is drawn, not narrated; it is the positioning line rendered rather than printed.

   The partner is chosen from the tables, not from what happens to be alive at the time, so a
   scrollbar drag and a slow scroll pick the same one. Preference is for a DIFFERENT REGION —
   two pots from the same workshop being contemporaries is not a surprise, a Benin plaque and a
   Dutch flintlock is — then for the smallest miss. If nothing was standing there, nothing is
   drawn, which is the whole of the deep head and is the point. */
const TIE = new Int32Array(N).fill(-1);
for (let i = 0; i < N; i++) {
  let best = -1, bestGap = Infinity, bestCross = false;
  for (let j = i - 1; j >= 0; j--) {
    const gap = ITEMS[i].y - ITEMS[j].y;
    if (gap > W_YEARS) break;
    if (LAND[i] - LAND[j] >= LIFE[j]) continue;      // already gone from the ground by then
    const cross = ITEMS[j].b !== ITEMS[i].b;
    if ((cross && !bestCross) || (cross === bestCross && gap < bestGap)) {
      best = j; bestGap = gap; bestCross = cross;
    }
  }
  TIE[i] = best;
}
const missText = g => (g === 0 ? 'SAME YEAR' : g === 1 ? '1 YEAR APART' : `${g} YEARS APART`);

/* The arc. Not a simulation of gravity — a curve shaped like one. A straight line reads as a
   lift descending; pure t² spends so long easing out of the top edge that the object is barely
   on screen for half its budget. This starts moving immediately and is still accelerating hard
   when it arrives, which is the part of a fall the eye actually reads as weight. */
const ENTER = 0.30, TAIL = 2.6;
const arc = t => ENTER * t + (1 - ENTER) * Math.pow(t, TAIL);

/* One impact speed for every object, because the fall is now geometry rather than a simulation:
   nothing about how fast the visitor scrolled may change how hard a thing breaks, or the same
   scroll position would not look the same twice. Roughly what the old solver delivered. */
const IMPACT = 12;

/* Debris still has to settle somewhere, and settling takes integration. It is fed SCROLL, not
   time: this many ms of shard flight per px of downward scroll. A shard therefore comes to rest
   over ~110px of scroll, and freezes mid-air the instant the visitor stops. */
const MS_PER_PX = 3.0;
const SUB = 50;                                     // integrator step ceiling, ms
const MAX_STEP = 240;                               // ms of debris advanced in one frame, max

let prevScroll = 0, live = 0;
let lightRGB = [255, 122, 26];

/* read by the headless sweep only; nothing in the page touches it. `air` is the gate that says
   the mechanic held — it must never exceed 1, at any scroll position, at any scroll speed. */
window.__hh = {
  drops, queue, surfAt, FALL, TOTAL, W_YEARS,
  PER: Array.from(PER), START: Array.from(START), LAND: Array.from(LAND),
  LIFE: Array.from(LIFE), CO: Array.from(CO), TIE: Array.from(TIE),
  snap: () => ({
    // counted off the drops themselves, not off the frame's own tally: a stale flag is exactly
    // the kind of thing this gate exists to catch, and it cannot catch it from its own counter
    scroll: scrollY, air: drops.filter(d => d.air).length, counted: live,
    ties: drops.filter(d => d.tie && d.tie.on).length,
    items: drops.filter(d => d.air || (d.down && !d.gone)).map(d => ({
      i: d.i, k: d.it.k, air: d.air, t: +d.t.toFixed(4),
      y: d.air ? +d.py.toFixed(2) : null,
      down: d.down, age: +d.age.toFixed(4), pieces: d.pieces.length, specks: d.specks.length,
      tie: d.tie ? d.tie.j : null, gap: d.tie ? d.tie.gap : null
    }))
  })
};

fit();
addEventListener('resize', fit);
document.getElementById('spacer').style.height = (TOTAL + innerHeight) + 'px';
done();

/* ------------------------------------------------------------------ the fall, solved once

   Nothing about an arrival is discovered during the fall. Its x, its tumble, the exact angle it
   will be at when it arrives, and therefore the exact height at which its real silhouette meets
   the real surface, are all fixed before it appears. Contact then happens at t = 1 and nowhere
   else, which is what makes the landing scroll position exact rather than emergent. */

function prep(d) {
  const i = d.i, hh = 132;
  d.w = hh * d.ar; d.h = hh;
  d.x = W * (0.18 + 0.64 * ((i * 0.618034) % 1));
  d.a0 = (hash(d.it.k, 7) - 0.5) * 0.34;            // deterministic: a reload looks identical
  d.spin = (hash(d.it.k, 21) - 0.5) * 0.5;          // the whole tumble, over the whole fall
  d.ySpawn = -d.h * 0.62;

  /* restProfile sampled unrotated gives the sprite's TRUE outline, not its box. Rotated by the
     angle it will land at, the lowest of those points is the corner that actually touches. */
  let hull = [[0, d.h / 2]];
  if (d.im) {
    const p = restProfile(d.im, d.w, d.h, 0, Math.max(4, d.w / 12));
    const pts = [];
    for (let ci = 0; ci < p.n; ci++) {
      if (Number.isNaN(p.bot[ci])) continue;
      pts.push([p.ox + ci * p.colW + p.colW / 2, p.oy + p.bot[ci]]);
    }
    if (pts.length) hull = pts;
  }
  const a1 = d.a0 + d.spin, c = Math.cos(a1), s = Math.sin(a1);
  let bestY = -Infinity, bestX = 0;
  for (const [lx, ly] of hull) {
    const y = lx * s + ly * c;
    if (y > bestY) { bestY = y; bestX = lx * c - ly * s; }
  }
  d.dxLow = bestX;
  d.yLand = surfAt(d.x + bestX) - bestY;            // centre height at the instant of contact
  d.prepped = true;
}

const toWorld = (d, lx, ly) => {
  const c = Math.cos(d.angle), s = Math.sin(d.angle);
  const x = lx - d.w / 2, y = ly - d.h / 2;
  return [d.px + x * c - y * s, d.py + x * s + y * c];
};

/* ------------------------------------------------------------------ impact

   The one irreversible line in the file. Everything above it is a position and runs both ways;
   everything below it happened. Once `down` is set nothing clears it — scroll back up and you
   are looking at a broken thing, not at an unbroken one. */

function land(d) {
  d.down = true; d.air = false; d.t = 1;
  d.angle = d.a0 + d.spin;
  d.px = d.x; d.py = d.yLand;
  d.landScroll = LAND[d.i];                         // exact, not observed
  const cx = d.x + d.dxLow, cy = surfAt(cx);

  if (!REDUCED) {
    const n = Math.min(34, 14 + Math.round(IMPACT * 1.6));
    dust.impact(cx - d.w * 0.28, cy, n, SOIL);
    dust.impact(cx + d.w * 0.28, cy, n, SOIL);
    dust.breath(cx, cy, 12, SOIL);                  // was a 150ms setTimeout — the last wall clock
  }

  /* The name and the date go out, exactly as asked — and now they go out AT the impact rather
     than over 0.28s of CSS after it. Round 6 kept that fade and named it as the one surviving
     wall clock, on the grounds that a text fade cannot make an object keep falling. It could
     still make the frame change while the visitor was not scrolling, which the gate caught the
     moment a jump landed ninety items at once: the 300ms timeout below used to re-measure every
     label a third of a second after the scrollbar had stopped. Killed, both halves. 13 said the
     name dies at impact; instantly is the more faithful reading of that, and 06 owns replacing
     the pop with a shatter. */
  d.nEl.style.display = d.yEl.style.display = 'none';
  measure(d);                                        // out of the layout, so the tick is compact
  d.credX = Math.max(W * 0.15, Math.min(W * 0.85, cx));

  /* the tie is armed here rather than drawn from the tables directly, because it needs the
     partner's real fall point — which only exists once that partner has actually landed. If the
     visitor jumped past it, there is no line: nothing is asserted about a thing that never fell. */
  const j = TIE[d.i];
  if (j >= 0 && drops[j].down && !drops[j].gone) {
    const gap = d.it.y - ITEMS[j].y;
    d.tie = { j, gap, on: false };
    d.tEl.textContent = missText(gap);
    d.tEl.style.setProperty('--spot', d.light[1]);
  }

  if (!d.im) return;
  if (MODE === 'a') shatterNow(d, cx, cy, IMPACT);
  else buildCore(d);
}

/* --- a · SHATTER : everything separates at once, on straight brittle edges --- */
function shatterNow(d, cx, cy, speed) {
  const n = REDUCED ? 8 : 13;
  const cells = voronoi(d.w, d.h, sites(d.w, d.h, n, d.i * 131 + 7));
  const r = rng(d.i * 37 + 3);
  for (const cell of cells) {
    const p = cutPiece(d.im, d.w, d.h, cell.poly);
    if (!p) continue;
    const [wx, wy] = toWorld(d, p.cx + d.w / 2, p.cy + d.h / 2);
    const away = wx - cx;
    const pc = makePiece(p, wx, wy,
      away * 1.7 + (r() - 0.5) * 80,
      -30 - r() * 70 - speed * 6,
      (r() - 0.5) * 4, d.angle);
    pc.sink = 2 + r() * 6;                           // it beds INTO the surface, it does not perch on it
    d.pieces.push(pc);
  }
}

/* --- b · CRUMBLE and c · SIFT : one core canvas, punched down over time --- */
function buildCore(d) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(d.w)); c.height = Math.max(1, Math.round(d.h));
  const g = c.getContext('2d');
  g.drawImage(d.im, 0, 0, d.w, d.h);
  d.core = c; d.cctx = g;

  if (MODE === 'b') {
    const cells = voronoi(d.w, d.h, sites(d.w, d.h, REDUCED ? 10 : 19, d.i * 211 + 5));
    // outermost first — a thing loses its edges before it loses its middle
    const cx = d.w / 2, cy = d.h / 2;
    cells.sort((p, q) =>
      Math.hypot(q.site[0] - cx, q.site[1] - cy) - Math.hypot(p.site[0] - cx, p.site[1] - cy));
    d.cells = cells;
    detachCell(d);                                   // the impact itself takes the first chip
    detachCell(d);
  } else {
    const r = rng(d.i * 97 + 11);
    d.cols = strips(d.w, d.h, REDUCED ? 7 : 11, d.i * 53 + 9)
      .map(s => ({ ...s, rate: 0.55 + r() * 1.0, eaten: 0 }));
  }
}

function detachCell(d) {
  if (!d.cells || d.nextCell >= d.cells.length) return;
  const cell = d.cells[d.nextCell++];
  const poly = jitter(cell.poly, 2.4, d.i * 701 + d.nextCell);
  const p = cutPiece(d.core, d.w, d.h, poly);        // cut from what is LEFT, never from the original
  punch(d.cctx, poly);                               // the same polygon, so the hole fits the flake
  if (!p) return;
  const r = rng(d.i * 17 + d.nextCell * 5);
  const [wx, wy] = toWorld(d, p.cx + d.w / 2, p.cy + d.h / 2);
  const pc = makePiece(p, wx, wy,
    (p.cx / Math.max(1, d.w)) * 130 + (r() - 0.5) * 30, -10 - r() * 30,
    (r() - 0.5) * 2.4, d.angle);
  pc.sink = 2 + r() * 5;
  pc.born = d.age;
  d.pieces.push(pc);
}

/* --- c · SIFT : eat each column upward from its bottom, and let the material out --- */
function biteColumn(d, col, want) {
  const bottom = d.h;
  const y1 = bottom - col.eaten, y0 = Math.max(0, bottom - want);
  const bandH = Math.max(1, Math.round(y1 - y0));
  const bx0 = Math.max(0, Math.floor(col.x0)), bx1 = Math.min(d.core.width, Math.ceil(col.x1));
  let col3 = null;
  if (bx1 > bx0 && y1 > 0) {
    // read the colour out of the band BEFORE it is taken — the speck is the photograph's own pixels
    const band = document.createElement('canvas');
    band.width = bx1 - bx0; band.height = bandH;
    band.getContext('2d').drawImage(d.core, bx0, Math.max(0, y0), band.width, bandH,
                                    0, 0, band.width, bandH);
    col3 = avgColor(band);
  }
  biteUp(d.cctx, col.x0, col.x1, bottom - col.eaten, want - col.eaten, d.i * 313 + Math.round(want));
  col.eaten = want;

  if (col3 && !REDUCED) {
    const r = rng(d.i * 71 + Math.round(want));
    const n = 4 + Math.floor(r() * 5);
    for (let k = 0; k < n; k++) {
      const [wx, wy] = toWorld(d, col.x0 + (col.x1 - col.x0) * r(), Math.max(0, y0) + bandH * r());
      // it sifts DOWN out of the object and into the ground. Sideways drift is a breeze, not the move.
      d.specks.push({
        x: wx, y: wy, depth: 50 + r() * 110, drift: (r() - 0.5) * 12,
        r: 1 + r() * 1.6, col: col3, t0: d.age
      });
    }
  }
}

/* ------------------------------------------------------------------ breaking down

   Cutting is the only expensive thing in the frame, so every cut goes through a queue and at
   most a dozen run per frame. A split of 40 pieces spreads over three frames and never shows. */

function splitPiece(d, p, seed) {
  const cells = voronoi(p.w, p.h, sites(p.w, p.h, 3, seed));
  const r = rng(seed + 17);
  const out = [];
  for (const cell of cells) {
    const q = cutPiece(p.cv, p.w, p.h, cell.poly);
    if (!q) continue;
    const c = Math.cos(p.rot), s = Math.sin(p.rot);
    // children push away from their parent, so the field spreads as it breaks down instead of
    // becoming a denser and denser heap in exactly the same footprint
    const np = makePiece(q, p.x + q.cx * c - q.cy * s, p.y + q.cx * s + q.cy * c,
      q.cx * 2.4 + (r() - 0.5) * 36, -6 - r() * 20, (r() - 0.5) * 1.6, p.rot);
    np.sink = 1.5 + r() * 5;
    out.push(np);
  }
  return out.length ? out : null;
}

/* The last visible state of a real photograph. A piece resting in the surface is already half
   under it, so specks are spawned a little PROUD of where the piece sat — otherwise the ground
   swallows the dust the instant it exists and the final beat never happens. */
function toSpecks(d, p, seed) {
  const col = avgColor(p.cv);
  if (!col) return;
  const r = rng(seed);
  const n = Math.max(3, Math.min(9, Math.round(p.w * p.h / 26)));
  for (let k = 0; k < n; k++) {
    d.specks.push({
      x: p.x + (r() - 0.5) * p.w * 1.5,
      y: p.y - p.h * 0.45 + (r() - 0.5) * p.h * 0.6,
      depth: 10 + r() * 26, drift: (r() - 0.5) * 26,
      r: 1 + r() * 1.6, col, t0: DUST_AT
    });
  }
}

function advance(d) {
  // b · CRUMBLE — flakes come off on a schedule, outermost first
  if (MODE === 'b' && d.cells) {
    const want = Math.min(d.cells.length,
      Math.floor(2 + (d.cells.length - 2) * Math.max(0, (d.age - 0.05)) / 0.78));
    while (d.nextCell < want) detachCell(d);
    if (d.nextCell >= d.cells.length) { d.core = null; d.cctx = null; d.cells = null; }
  }

  // c · SIFT — each column drains at its own rate
  if (MODE === 'c' && d.cols) {
    let live = 0;
    for (const col of d.cols) {
      const want = Math.min(d.h, Math.max(0, (d.age - 0.04)) * col.rate * d.h * 1.55);
      if (!col.q && want > col.eaten + 3) {
        col.q = true;
        queue.push(() => { col.q = false; if (!d.gone && d.cctx) biteColumn(d, col, want); });
      }
      if (col.eaten < d.h) live++;
    }
    if (!live) { d.core = null; d.cctx = null; d.cols = null; }
  }

  /* Everything splits, in every mode: the flakes crumble too, the shards shatter again.
     Each piece is replaced IN PLACE by its children — clearing the array first and refilling it
     from the queue blanks the object for a frame, which reads as a flicker. */
  while (d.splits < SPLITS.length && d.age >= SPLITS[d.splits]) {
    const at = d.splits++;
    d.pieces.slice().forEach((p, k) => queue.push(() => {
      if (d.gone) return;
      const j = d.pieces.indexOf(p);
      if (j < 0) return;
      const out = splitPiece(d, p, d.i * 999 + at * 71 + k);
      if (out) d.pieces.splice(j, 1, ...out);
    }));
  }

  if (!d.dusted && d.age >= DUST_AT) {
    d.dusted = true;
    d.pieces.slice().forEach((p, k) => queue.push(() => {
      if (d.gone) return;
      const j = d.pieces.indexOf(p);
      if (j >= 0) d.pieces.splice(j, 1);
      toSpecks(d, p, d.i * 131 + k);
    }));
    if (d.core) { d.core = null; d.cctx = null; d.cells = null; d.cols = null; }
  }
}

/* ------------------------------------------------------------------ the frame */

/* Label placement is a real constraint here, not a nicety: the credit tick IS the citation, and
   two of them printed on top of each other is a breach. Boxes are measured once per state change
   — never per frame — and the search is over rows below the ground line. If every row is taken
   the tick is still drawn: an overlap is bad, a missing credit is not allowed at all. */
const taken = [];
/* A scan, not round 6's ladder of four fixed rows. The contemporary window puts six or seven
   fields on the ground through the body where a fixed 4,200px life put four, and the ladder ran
   out — 88 credit-on-credit overlaps at 1440. Widening it to seven rows 30px apart did not fix
   it either, because a two-line credit is 33.7px tall, so adjacent rungs overlapped by
   construction. A 6px scan from +10 to +200 packs against whatever is actually there instead of
   guessing a rung height, and 200px still clears the bottom of a 900px viewport at the lowest
   point of the contour. */
const ROW_TOP = 10, ROW_BOT = 200, ROW_STEP = 6;
/* On a phone there is no horizontal room to keep a credit under the thing it belongs to — four
   ticks want 700px of width and there is 250px of spread. So below 720px they stack as one
   centred column under the ground line, newest at the top. The ruling was about a credit's
   LIFETIME, not its position; where it sits is a layout call, and an overlap is not. */
const narrow = () => W < 720;

function measure(d) {
  const r = d.el.getBoundingClientRect();
  if (r.width) { d.mw = r.width; d.mh = r.height; }
}
/* One pixel of slack, because every box is placed with `translate(…toFixed(0)px)` — the transform
   is rounded to whole pixels for crispness, so what renders can sit up to half a pixel off the
   box this test was given. The last five overlaps the sweep found at 1440 were all exactly that
   half pixel: a credit ending at 646.0 by the maths and at 646.5 on the glass, under a tie the
   maths had cleared at 646.4. Testing untouched geometry is what let it through. */
const SLACK = 1;
const hits = (x, y, w, h) => taken.some(t =>
  x - w / 2 - SLACK < t.x + t.w / 2 && t.x - t.w / 2 < x + w / 2 + SLACK &&
  y - SLACK < t.y + t.h && t.y < y + h + SLACK);

function frame() {
  const dScroll = scrollY - prevScroll; prevScroll = scrollY;
  const fwd = Math.max(0, dScroll);                  // only downward scroll advances anything

  // the intro goes with the first two objects. Against the FULL page height it would still be
  // legible 19,000px in, which is how it ended up printed across the third burial field.
  fadeIntro(Math.min(1, scrollY / START[8]));

  /* ---- the fall. Height is a function of the scrollbar and of nothing else. ----

     Three states, and the boundary between the second and the third is the only thing in the
     piece that cannot be undone:

       t < 0      not here yet — and scrolling back past its start returns it to this
       0 ≤ t < 1  in the air, arc(t) of the way down. Scroll up, t drops, it rises.
       t = 1      down. Latched. Nothing ever sets `down` back to false.

     The retire branch is what makes a scrollbar drag survivable: an item whose whole life is
     already behind the visitor is dropped without ever cutting a fragment, so jumping two
     hundred arrivals forward costs four landings, not two hundred. */
  let airborne = 0;
  for (const d of drops) {
    if (d.gone) continue;
    const rel = scrollY - START[d.i];

    if (!d.down) {
      if (rel >= FALL) {
        if (rel - FALL >= LIFE[d.i]) {               // its whole life is behind us: skip it entire
          // clearing `air` is not housekeeping. An item caught mid-fall by a scrollbar jump is
          // still flagged airborne, and the draw loop asks nothing but that flag — leave it set
          // and the sprite hangs at its spawn point, labelled, for the rest of the page.
          d.gone = true; d.air = false; d.t = -1; d.el.style.opacity = '0';
          continue;
        }
        if (!d.prepped) prep(d);
        land(d);
      } else if (rel >= 0) {
        if (!d.prepped) prep(d);
        d.t = rel / FALL;
        d.air = true; airborne++;
        d.px = d.x;
        d.py = d.ySpawn + (d.yLand - d.ySpawn) * arc(d.t);
        d.angle = d.a0 + d.spin * d.t;
      } else {
        d.t = -1; d.air = false;                     // scrolled back above its start: not here yet
      }
    }

    // decay is one-way: scrolling back shows what is already broken, it never un-breaks it
    if (d.down) {
      const a = Math.min(1, (scrollY - d.landScroll) / LIFE[d.i]);
      if (a > d.age) { d.age = a; advance(d); }
      if (d.age >= 1) {
        d.gone = true;                               // every canvas it held is dropped here
        d.pieces.length = 0; d.specks.length = 0;
        d.core = null; d.cctx = null; d.cells = null; d.cols = null;
        d.tEl.style.opacity = '0';
      }
    }
  }
  live = airborne;

  // Cutting is the only expensive thing in the frame, so it gets a time budget rather than a
  // count. A fixed twelve cuts hit 83ms p95 on the frames where a whole field split at once.
  const budget = performance.now() + 4;
  while (queue.length && performance.now() < budget) queue.shift()();

  /* Debris settles on scroll too. A shard's flight is real integration — it has to arc and bed
     into the surface — but what is being integrated is distance travelled by the scrollbar, so
     a stopped scroll is a stopped frame. Substepped, because a flick worth 900px would otherwise
     ask for 2.7 seconds in one go and throw shards straight through the ground. */
  const ms = Math.min(MAX_STEP, fwd * MS_PER_PX);
  for (let left = ms; left > 0; left -= SUB) {
    const step = Math.min(SUB, left);
    for (const d of drops) if (d.pieces.length) stepPieces(d.pieces, step, surfAt);
    dust.step(step);
  }

  /* The era's light, read straight off the scrollbar rather than eased toward a target — an
     ease is a wall clock wearing a hat. It crosses over the back half of each arrival's budget,
     so a new lamp still arrives rather than switches. The ramp itself is 13's, untouched. */
  const i0 = idxAt(Math.max(0, scrollY));
  const i1 = Math.min(N - 1, i0 + 1);
  const k = Math.min(1, Math.max(0, ((scrollY - START[i0]) / PER[i0] - 0.55) / 0.45));
  const cur = drops[i0];
  const rgbOf = h => [1, 3, 5].map(j => parseInt(h.substr(j, 2), 16));
  const c0 = rgbOf(cur.light[1]), c1 = rgbOf(drops[i1].light[1]);
  for (let j = 0; j < 3; j++) lightRGB[j] = c0[j] + (c1[j] - c0[j]) * k;
  setHud(cur.it.y, cur.light[2], cur.light[1]);

  /* ---- sky and the era's light. This is where every bit of colour on the page lives. ---- */
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#05060b';
  ctx.fillRect(0, 0, W, H);
  const gy = groundY();
  const glow = ctx.createRadialGradient(W / 2, gy, 0, W / 2, gy, Math.max(W, H) * 0.9);
  glow.addColorStop(0, `rgba(${lightRGB.map(Math.round).join(',')},0.20)`);
  glow.addColorStop(0.55, `rgba(${lightRGB.map(Math.round).join(',')},0.05)`);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  // a low band of lit air sitting on the land — the light has somewhere to land
  const haze = ctx.createLinearGradient(0, gy - 190, 0, gy + 30);
  haze.addColorStop(0, 'rgba(0,0,0,0)');
  haze.addColorStop(1, `rgba(${lightRGB.map(Math.round).join(',')},0.13)`);
  ctx.fillStyle = haze;
  ctx.fillRect(0, gy - 190, W, 220);

  /* ---- the photographs and their fragments, raw. Never lit, never tinted, never graded. ---- */
  for (const d of drops) {
    if (d.air && d.im) {
      ctx.save();
      ctx.translate(d.px, d.py);
      ctx.rotate(d.angle);
      ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10;
      ctx.drawImage(d.im, -d.w / 2, -d.h / 2, d.w, d.h);
      ctx.restore();
    }
    if (d.core) {
      ctx.save();
      ctx.translate(d.px, d.py);
      ctx.rotate(d.angle);
      ctx.drawImage(d.core, -d.w / 2, -d.h / 2, d.w, d.h);
      ctx.restore();
    }
    if (d.pieces.length) drawPieces(ctx, d.pieces);
    if (d.specks.length) {
      const t = Math.max(0, (d.age - DUST_AT) / (1 - DUST_AT));
      for (const q of d.specks) {
        const k = Math.max(0, (d.age - q.t0) / Math.max(0.01, 1 - q.t0));
        ctx.fillStyle = `rgba(${q.col[0]},${q.col[1]},${q.col[2]},${(1 - k * 0.55).toFixed(3)})`;
        ctx.fillRect(q.x + q.drift * k, q.y + q.depth * k, q.r, q.r);
      }
      if (t >= 1) d.specks.length = 0;
    }
  }

  /* ---- the earth, opaque, laid over everything. Nothing below it is visible, ever. ---- */
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(gcvs, 0, 0);
  ctx.restore();

  if (!REDUCED) dust.draw(ctx, 0);

  /* ---- the ties. 01's engine, drawn: a line laid along the soil between two things that were
         standing at the same time, with the miss written on it. It is on the ground rather than
         over it because it is a fact about the land, not a piece of UI; the exact weight, colour
         and type are [06]'s to set against real images, and the wording is [07]'s. A tie dies
         with the FIRST of its two ends, because a relation cannot outlive either party. ---- */
  taken.length = 0;
  /* On a phone the whole spread is about 250px of soil, and five ties laid across it are five
     hairlines and five labels in the space one belongs in — no collision, and unreadable anyway,
     which is the kind of thing the collision gate is structurally unable to catch. So narrow
     draws only the newest: the tie that answers "what was THIS standing next to". Same
     adaptation the credit stack already makes, and on the same grounds — the ruling is about a
     tie's lifetime, not its position, and where it can be drawn is a layout call. */
  let newest = -1;
  if (narrow()) for (const d of drops)
    if (d.tie && d.down && !d.gone && drops[d.tie.j].down && !drops[d.tie.j].gone) newest = d.i;

  for (const d of drops) {
    const T = d.tie;
    if (!T) continue;
    const p = drops[T.j];
    T.on = d.down && !d.gone && p.down && !p.gone && (newest < 0 || d.i === newest);
    if (!T.on) { if (d.tEl.style.opacity !== '0') d.tEl.style.opacity = '0'; continue; }

    const age = Math.max(d.age, p.age);
    const o = age > 0.9 ? Math.max(0, (1 - age) / 0.1) : 1;
    const x0 = Math.min(d.credX, p.credX), x1 = Math.max(d.credX, p.credX);

    ctx.save();
    ctx.strokeStyle = `rgba(${lightRGB.map(Math.round).join(',')},${(0.34 * o).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, surfAt(x0) + 2.5);
    for (let x = x0; x <= x1; x += 4) ctx.lineTo(x, surfAt(x) + 2.5);
    ctx.lineTo(x1, surfAt(x1) + 2.5);
    ctx.stroke();
    ctx.beginPath();                                 // a tick at each end, so the line has owners
    for (const x of [x0, x1]) { ctx.moveTo(x, surfAt(x) + 2.5); ctx.lineTo(x, surfAt(x) - 7); }
    ctx.stroke();
    ctx.restore();

    if (!d.tw) { const r = d.tEl.getBoundingClientRect(); d.tw = r.width; d.th = r.height; }
    T.o = o; T.x0 = x0; T.x1 = x1;                   // placed after the credits, which outrank it
  }

  /* ---- text. The name and the date live only while the thing is whole and falling. The credit
         line outlives them and dies with the last fragment — nothing is ever on screen without
         its attribution, and nothing is attributed after it is gone. ---- */
  let stacked = 0;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    let o = 0, lx = 0, ly = 0;

    if (d.air) {                                     // falling: the whole label, under the object
      if (!d.mw) measure(d);
      lx = Math.max(W * 0.15, Math.min(W * 0.85, d.px));
      /* The label rides under the object the whole way down and is NOT held off the ground line.
         Round 5 clamped it to 84px above the surface, which was invisible while a solver threw
         things through that band in a few frames; a scroll-mapped fall spends its last 200px of
         budget there, so the clamp printed the name across the photograph on every single
         arrival. Unclamped it simply follows, and ends the fall sitting on the soil at exactly
         the spot the credit tick is about to take over. If a tick is already there, `hits` puts
         it above the object instead — which is the only case the flip was ever needed for. */
      const below = d.py + d.h / 2 + 12;
      const above = d.py - d.h / 2 - d.mh - 12;
      for (const cand of [below, above, below + d.mh + 6, above - d.mh - 6]) {
        ly = cand;
        if (!hits(lx, ly, d.mw, d.mh)) break;
      }
      o = ly > 4 ? 1 : 0;                            // nothing half-printed against the top edge
    } else if (d.down && !d.gone) {                  // fallen: the credit tick, where it fell
      o = d.age > 0.9 ? Math.max(0, (1 - d.age) / 0.1) : 1;
      if (narrow()) {
        // a running cursor, not index × own-height: credit lines wrap to two or three, so
        // spacing by the CURRENT tick's height puts a three-line one on top of its neighbour
        lx = W / 2;
        ly = surfAt(lx) + 10 + stacked;
        /* the falling label is placed before this column and sits wherever the object is, so on
           a phone it lands on top of the stack whenever the object is near centre. The column
           gives way to it rather than the other way round — the falling name is transient, the
           column is the citation contract and only has to stay legible. */
        for (let g = 0; g < 6 && hits(lx, ly, d.mw, d.mh); g++) { ly += (d.mh || 26) + 5; stacked += (d.mh || 26) + 5; }
      } else {
        lx = d.credX;
        const top = surfAt(d.credX);
        ly = top + ROW_TOP;
        for (let row = ROW_TOP; row <= ROW_BOT; row += ROW_STEP) {
          ly = top + row;
          if (!hits(lx, ly, d.mw, d.mh)) break;
        }
      }
    }

    if (o > 0.02) {
      if (!d.air && narrow()) stacked += (d.mh || 26) + 5;
      taken.push({ x: lx, y: ly, w: d.mw, h: d.mh });
      d.el.style.transform = `translate(-50%,0) translate(${lx.toFixed(0)}px,${ly.toFixed(0)}px)`;
    }
    const s = o.toFixed(3);
    if (d.el.style.opacity !== s) d.el.style.opacity = s;
  }

  /* The miss goes down last, into whatever room the citations left. That order is the ruling:
     a credit line is the contract and is always drawn even if it has to overlap; the tie is the
     engine but it is still commentary, so where two of them wanted the same inch of soil the
     sweep found 666 overlaps at 1440 and 1,439 at 390. It now walks its own line looking for
     clear ground — three positions along the line, two rows deep — and if the ground is full it
     does not print. The line stays either way, and it is the line that carries the fact that
     two things were down there together. */
  for (const d of drops) {
    const T = d.tie;
    if (!T || !T.on) continue;
    const span = T.x1 - T.x0;
    let px = 0, py = 0, fit = false;
    for (const fx of [0.5, 0.28, 0.72]) {
      px = T.x0 + span * fx;
      const base = narrow() ? surfAt(px) - 15 - d.th : surfAt(px) + 5;
      for (const row of [0, -(d.th + 5), d.th + 5]) {
        py = base + (narrow() ? -Math.abs(row) : Math.abs(row));
        if (!hits(px, py, d.tw, d.th)) { fit = true; break; }
      }
      if (fit) break;
    }
    const o = fit ? T.o : 0;
    if (fit) {
      taken.push({ x: px, y: py, w: d.tw, h: d.th });
      d.tEl.style.transform =
        `translate(-50%,0) translate(${px.toFixed(0)}px,${py.toFixed(0)}px)`;
    }
    const s = o.toFixed(3);
    if (d.tEl.style.opacity !== s) d.tEl.style.opacity = s;
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
