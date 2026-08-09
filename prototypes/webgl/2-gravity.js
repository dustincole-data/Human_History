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

   Native scroll 1:1 throughout. matter.js simulates only the object currently in the air; every
   fragment after impact is cheap non-physics debris. */

import { ITEMS, lightFor, shortCred, setHud, setIntro, fadeIntro, done, REDUCED } from './shell.js';
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
       hint: 'scroll to break it down · drag to throw' },
  b: { name: 'CRUMBLE',
       intro: 'Nothing goes all at once. It loses its edges first, then its corners, then everything that was not the middle of it — and the last recognisable thing is the last thing to go.',
       hint: 'scroll to break it down · drag to throw' },
  c: { name: 'SIFT',
       intro: 'It stays standing the whole time and empties from the bottom up, along whatever grain it had, until the shape is the only thing left and then that goes too.',
       hint: 'scroll to break it down · drag to throw' }
};
const M = MODES[MODE];
setIntro(M.intro, M.hint);

await new Promise(res => {
  const s = document.createElement('script');
  s.src = './vendor/matter.min.js'; s.onload = res; document.head.appendChild(s);
});
const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

/* ------------------------------------------------------------------ the world

   There is no camera any more. The ground sits at a fixed screen y and stays there, so world
   space and screen space are the same thing. Everything round 3 and 4 spent on tracking the top
   of a growing pile is deleted. */

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

const engine = Engine.create();
engine.gravity.y = REDUCED ? 0.35 : 0.52;          // slow. you should be able to read it on the way down.
Runner.run(Runner.create(), engine);

let W = 0, H = 0, dpr = 1, walls = [];
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
  Composite.remove(engine.world, walls);
  walls = [
    Bodies.rectangle(-40, H / 2, 60, H * 6, { isStatic: true }),
    Bodies.rectangle(W + 40, H / 2, 60, H * 6, { isStatic: true })
  ];
  Composite.add(engine.world, walls);
  for (const d of drops) for (const p of d.pieces) p.rest = false;   // re-settle onto the new land
}

const mouse = Mouse.create(cvs);
const mc = MouseConstraint.create(engine, { stiffness: 0.14, render: { visible: false } });
Composite.add(engine.world, mc);
mouse.element.removeEventListener('wheel', mouse.mousewheel);   // never take the wheel

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
  nEl.style.transition = yEl.style.transition = 'opacity .28s ease';
  return {
    it, im, i, ar: im ? im.width / im.height : 1, light: lightFor(it.y),
    el, nEl, yEl, cEl, mw: 0, mh: 0,
    body: null, hull: null, w: 0, h: 0,
    down: false, px: 0, py: 0, angle: 0, landScroll: 0, age: 0,
    core: null, cctx: null, cells: null, cols: null, nextCell: 0, splits: 0,
    pieces: [], specks: [], dusted: false, credX: 0, credY: 0, gone: false
  };
});

const dust = new Dust();
const queue = [];                                   // deferred cutting, so a split never drops a frame
window.__hh = { drops, queue, surfAt };               // read by the headless sweep; nothing reads it in the page

const PER_ITEM = 1000;                              // scroll px between arrivals
const LIFE = 4200;                                  // scroll px from landing to gone — ~4 objects live at once
const SPLITS = REDUCED ? [0.34] : [0.30, 0.56];
const DUST_AT = REDUCED ? 0.62 : 0.76;

let released = 0, lastDrop = 0, prevScroll = 0, prevT = performance.now();
let lightRGB = [255, 122, 26];

fit();
addEventListener('resize', fit);
document.getElementById('spacer').style.height =
  (ITEMS.length * PER_ITEM + LIFE + innerHeight) + 'px';
done();

function drop(d, i) {
  const hh = 132;
  d.w = hh * d.ar; d.h = hh;
  const x = W * (0.18 + 0.64 * ((i * 0.618034) % 1));
  const b = Bodies.rectangle(x, -H * 0.16, d.w * 0.84, d.h * 0.84, {
    restitution: 0.04, friction: 0.62, frictionAir: 0.028, density: 0.0014,
    angle: (Math.random() - 0.5) * 0.35, label: 'item'
  });
  b.plugin = { drop: d };
  Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.03);
  d.body = b;
  Composite.add(engine.world, b);

  /* restProfile sampled unrotated gives the sprite's TRUE outline, not its box. Twenty-odd of
     those points, rotated by the live body angle each frame, is what decides the exact moment
     and place of contact — so a thing lands on its real lowest corner, not on a rectangle. */
  if (d.im) {
    const p = restProfile(d.im, d.w, d.h, 0, Math.max(4, d.w / 12));
    const pts = [];
    for (let ci = 0; ci < p.n; ci++) {
      if (Number.isNaN(p.top[ci])) continue;
      const lx = p.ox + ci * p.colW + p.colW / 2;
      pts.push([lx, p.oy + p.bot[ci]], [lx, p.oy + p.top[ci]]);
    }
    d.hull = pts.length ? pts : [[0, d.h / 2]];
  } else {
    d.hull = [[0, d.h / 2]];
  }
}

/* lowest point of the real silhouette, at the angle it is currently tumbling at */
function contact(d) {
  const b = d.body, c = Math.cos(b.angle), s = Math.sin(b.angle);
  let bestY = -Infinity, bestX = 0;
  for (const [lx, ly] of d.hull) {
    const y = b.position.y + lx * s + ly * c;
    if (y > bestY) { bestY = y; bestX = b.position.x + lx * c - ly * s; }
  }
  return [bestX, bestY];
}

const toWorld = (d, lx, ly) => {
  const c = Math.cos(d.angle), s = Math.sin(d.angle);
  const x = lx - d.w / 2, y = ly - d.h / 2;
  return [d.px + x * c - y * s, d.py + x * s + y * c];
};

/* ------------------------------------------------------------------ impact

   The body dies here. From this line on the object costs no physics at all — which is the whole
   answer to "72 objects recursively subdividing will blow up matter.js body count." Nothing
   recursive is ever a body. */

function impact(d, cx, cy, speed) {
  d.down = true;
  d.px = d.body.position.x; d.py = d.body.position.y; d.angle = d.body.angle;
  d.landScroll = scrollY;

  if (mc.body === d.body) { mc.constraint.bodyB = null; mc.body = null; }
  Composite.remove(engine.world, d.body);
  d.body = null;

  if (!REDUCED) {
    const n = Math.min(34, 14 + Math.round(speed * 1.6));
    dust.impact(cx - d.w * 0.28, cy, n, SOIL);
    dust.impact(cx + d.w * 0.28, cy, n, SOIL);
    setTimeout(() => dust.breath(cx, cy, 12, SOIL), 150);
  }

  // the name and the date go out, exactly as asked. the credit stays, and marks the spot.
  d.nEl.style.opacity = '0';
  d.yEl.style.opacity = '0';
  setTimeout(() => {                                 // out of the layout too, so the tick is compact
    d.nEl.style.display = d.yEl.style.display = 'none';
    measure(d);
  }, 300);
  d.credX = Math.max(W * 0.15, Math.min(W * 0.85, cx));

  if (!d.im) return;
  if (MODE === 'a') shatterNow(d, cx, cy, speed);
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
const ROWS = [10, 40, 70, 100];
/* On a phone there is no horizontal room to keep a credit under the thing it belongs to — four
   ticks want 700px of width and there is 250px of spread. So below 720px they stack as one
   centred column under the ground line, newest at the top. The ruling was about a credit's
   LIFETIME, not its position; where it sits is a layout call, and an overlap is not. */
const narrow = () => W < 720;

function measure(d) {
  const r = d.el.getBoundingClientRect();
  if (r.width) { d.mw = r.width; d.mh = r.height; }
}
const hits = (x, y, w, h) => taken.some(t =>
  x - w / 2 < t.x + t.w / 2 && t.x - t.w / 2 < x + w / 2 && y < t.y + t.h && t.y < y + h);

function frame(now) {
  const dt = Math.min(50, now - prevT); prevT = now;
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
  const dScroll = scrollY - prevScroll; prevScroll = scrollY;

  const want = Math.min(ITEMS.length, Math.floor(scrollY / PER_ITEM) + 1);
  if (released < want && now - lastDrop > 880) { drop(drops[released], released); released++; lastDrop = now; }
  // the intro goes with the first two objects. Against the FULL page height it would still be
  // legible 19,000px in, which is how it ended up printed across the third burial field.
  fadeIntro(Math.min(1, scrollY / (PER_ITEM * 8)));

  // contact: the real silhouette meets the real surface, and the body ceases to exist
  for (const d of drops) {
    if (!d.body) continue;
    const [cx, cy] = contact(d);
    if (cy >= surfAt(cx)) impact(d, cx, surfAt(cx), Math.abs(d.body.velocity.y));
  }

  // decay is one-way: scrolling back shows what is already broken, it never un-breaks it
  for (const d of drops) {
    if (!d.down || d.gone) continue;
    const a = Math.min(1, (scrollY - d.landScroll) / LIFE);
    if (a > d.age) { d.age = a; advance(d); }
    if (d.age >= 1) {
      d.gone = true;                                 // every canvas it held is dropped here
      d.pieces.length = 0; d.specks.length = 0;
      d.core = null; d.cctx = null; d.cells = null; d.cols = null;
    }
  }

  // Cutting is the only expensive thing in the frame, so it gets a time budget rather than a
  // count. A fixed twelve cuts hit 83ms p95 on the frames where a whole field split at once.
  const budget = performance.now() + 4;
  while (queue.length && performance.now() < budget) queue.shift()();

  for (const d of drops) if (d.pieces.length) stepPieces(d.pieces, dt, surfAt);
  dust.step(dt);

  // the era's light, lerped so a new lamp arrives rather than switches
  const cur = drops[Math.max(0, released - 1)];
  const tgt = [1, 3, 5].map(i => parseInt(cur.light[1].substr(i, 2), 16));
  for (let i = 0; i < 3; i++) lightRGB[i] += (tgt[i] - lightRGB[i]) * 0.06;
  const lit = `rgb(${lightRGB.map(Math.round).join(',')})`;
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
    if (d.body && d.im) {
      const b = d.body;
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);
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

  /* ---- text. The name and the date live only while the thing is whole and falling. The credit
         line outlives them and dies with the last fragment — nothing is ever on screen without
         its attribution, and nothing is attributed after it is gone. ---- */
  taken.length = 0;
  let stacked = 0;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    let o = 0, lx = 0, ly = 0;

    if (d.body) {                                    // falling: the whole label, under the object
      if (!d.mw) measure(d);
      lx = Math.max(W * 0.15, Math.min(W * 0.85, d.body.position.x));
      // two things can be in the air at once, and on a phone their labels are wider than the gap
      // between them. If below the object is taken, the label goes above it — still attached.
      const below = Math.min(d.body.position.y + d.h / 2 + 12, surfAt(d.body.position.x) - 84);
      const above = d.body.position.y - d.h / 2 - d.mh - 12;
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
      } else {
        lx = d.credX;
        const top = surfAt(d.credX);
        ly = top + ROWS[0];
        for (const row of ROWS) {
          ly = top + row;
          if (!hits(lx, ly, d.mw, d.mh)) break;
        }
      }
    }

    if (o > 0.02) {
      if (!d.body && narrow()) stacked += (d.mh || 26) + 5;
      taken.push({ x: lx, y: ly, w: d.mw, h: d.mh });
      d.el.style.transform = `translate(-50%,0) translate(${lx.toFixed(0)}px,${ly.toFixed(0)}px)`;
    }
    const s = o.toFixed(3);
    if (d.el.style.opacity !== s) d.el.style.opacity = s;
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
