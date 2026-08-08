/* 2 — GRAVITY. Third pass: the burial rendering, three ways.

   Round 3 picked the mechanic and rejected the picture of it: "It looks nothing like the earth
   is swallowing it. It looks like cheap absolute dog shit... that looks fake as hell."

   The mechanic is unchanged and not in question — objects fall in one at a time, slowly enough
   to read, land, and time buries them; you always stand on the present, on top of everything
   before. What changed is what the earth IS. See burial.js for the rules. The short version:
   the earth is opaque, it has grain, its surface is a heightfield, and objects are pressed into
   it. Nothing is ever hidden by transparency again.

   Three answers to what burial fundamentally is, on the same 72 real objects. ?b=a|b|c.

     a · ASHFALL   burial is weather. Sediment falls as actual particles, lands on the up-facing
                   surfaces of things, banks against their flanks at the angle of repose, and
                   drowns them from the sides in. Scroll back up and it uncovers.
     b · SECTION   burial is the cut face. Below the line the screen is a trench wall, and each
                   buried object survives as a ragged excavation window showing a crisp fragment
                   of the real photograph. You see 40% of a thing sharply, never 100% dimly.
     c · SWALLOW   burial is the ground taking it. Soft matrix climbs the sides of each object,
                   grips it, closes over it from the flanks, and leaves a mound that flattens
                   era by era.

   Native scroll 1:1 throughout. Photographs never tinted, never graded — drawn raw, then
   occluded. Facts stay crisp DOM over the canvas. */

import { ITEMS, lightFor, shortCred, setHud, setIntro, fadeIntro, done, REDUCED } from './shell.js';
import {
  STRATA, stratumIndex, hexA, rng, noise1,
  Dust, Ground, restProfile, tileFor, mottle, windowMask
} from './burial.js';

const qs = new URLSearchParams(location.search);
const MODE = ({ a: 'a', b: 'b', c: 'c' })[(qs.get('b') || 'a').toLowerCase()] || 'a';

/* `lag` is how deep into the pile the ground line sits, in px — NOT a fraction of the viewport.
   It is the whole pacing control: everything more than `lag` below the top of the pile is under
   the earth, so this is literally how much of the present stays standing. */
const MODES = {
  a: { lag: 300, name: 'ASHFALL',
       intro: 'Sediment falls the whole time you are here. It lands on the up-facing surfaces of things, banks against their sides, and drowns them from the flanks in. Scroll back up and it uncovers.',
       hint: 'scroll to bury · scroll back to dig · drag to throw' },
  b: { lag: 250, name: 'SECTION',
       intro: 'Below the ground line the screen is a trench wall. Everything down there is still exactly as bright as the day it fell — you just only get to see the part that has been dug out.',
       hint: 'scroll to bury · drag to throw' },
  c: { lag: 250, name: 'SWALLOW',
       intro: 'The ground is soft. It craters when a thing lands, grips its sides, closes over it from the flanks in, and keeps a mound where it went down — until the next age flattens that too.',
       hint: 'scroll to bury · drag to throw' }
};
const M = MODES[MODE];
setIntro(M.intro, M.hint);

await new Promise(res => {
  const s = document.createElement('script');
  s.src = './vendor/matter.min.js'; s.onload = res; document.head.appendChild(s);
});
const { Engine, Runner, World, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

/* ------------------------------------------------------------------ canvases */

const host = document.getElementById('gl');
const cvs = document.createElement('canvas');
cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';
host.appendChild(cvs);
const ctx = cvs.getContext('2d');

// the earth is built on its own surface so it can be darkened, mottled and punched through
// before it is laid over the scene as a single opaque sheet
const ecvs = document.createElement('canvas');
const ectx = ecvs.getContext('2d');

const engine = Engine.create();
engine.gravity.y = REDUCED ? 0.35 : 0.52;          // slow. you should be able to read it on the way down.
Runner.run(Runner.create(), engine);

const FLOOR = 100000;
let W = 0, H = 0, dpr = 1, walls = [];
const ground = new Ground();

function fit() {
  W = innerWidth; H = innerHeight;
  dpr = Math.min(devicePixelRatio, 2);
  for (const c of [cvs, ecvs]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ground.resize(W);
  Composite.remove(engine.world, walls);
  walls = [
    Bodies.rectangle(W / 2, FLOOR + 40, W * 4, 80, { isStatic: true, label: 'floor' }),
    Bodies.rectangle(-30, FLOOR - 3000, 60, 8000, { isStatic: true, label: 'wall' }),
    Bodies.rectangle(W + 30, FLOOR - 3000, 60, 8000, { isStatic: true, label: 'wall' })
  ];
  Composite.add(engine.world, walls);
}
fit();
addEventListener('resize', fit);

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
  labelLayer.appendChild(el);
  return {
    it, im, i, ar: im ? im.width / im.height : 1, light: lightFor(it.y), el,
    body: null, prof: null, grains: [], mask: null, landed: false, rested: false,
    stratum: stratumIndex(it.y)
  };
});

const dust = new Dust();
const motes = [];                                   // the visible fall, mode a

let base = FLOOR - 132 + M.lag;                     // world y of the general ground level
let camY = base - H * 0.58;
let released = 0, lastDrop = 0, prevScroll = 0, prevT = performance.now();
let era = drops.length ? drops[0].stratum : 0;
const marks = [];                                   // stratum contacts, oldest first
const PER_ITEM = 1000;

document.getElementById('spacer').style.height = (ITEMS.length * PER_ITEM + innerHeight) + 'px';
done();

function drop(d, i) {
  const hh = 132;
  const w = hh * d.ar, h = hh;
  const x = W * (0.18 + 0.64 * ((i * 0.618034) % 1));
  const b = Bodies.rectangle(x, base - H * 1.05, w * 0.84, h * 0.84, {
    restitution: 0.04, friction: 0.62, frictionAir: 0.028, density: 0.0014,
    angle: (Math.random() - 0.5) * 0.35, label: 'item'
  });
  b.plugin = { drop: d };
  Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.03);
  d.body = b; d.w = w; d.h = h;
  Composite.add(engine.world, b);
}

/* --------------------------------------------------------- the moment of landing

   The deepest fake in the old build was mass without consequence: an object simply stopped and
   nothing in the world acknowledged it. Four beats: the surface deforms, dust squirts out
   sideways (soil does not splash up), the crater keeps about half its depth forever because
   soil is inelastic, and the first grains of the object's own burial are already on it. */

Events.on(engine, 'collisionStart', ev => {
  for (const pair of ev.pairs) {
    for (const b of [pair.bodyA, pair.bodyB]) {
      const d = b.plugin && b.plugin.drop;
      if (!d || d.landed) continue;
      if (Math.abs(b.velocity.y) < 1.2) continue;
      d.landed = true;

      const pal = STRATA[Math.min(d.stratum, STRATA.length - 1)][2];
      const scale = Math.min(2, Math.max(0.3, (d.w * d.h) / (132 * 132)));

      // beat 1 — crater and berm, volume conserving, and only half of it ever comes back
      ground.gauss(ground.mound, b.position.x, Math.max(16, 0.55 * d.w), -7 * scale);
      ground.gauss(ground.mound, b.position.x - d.w * 0.8, Math.max(14, 0.4 * d.w), 2.6 * scale);
      ground.gauss(ground.mound, b.position.x + d.w * 0.8, Math.max(14, 0.4 * d.w), 2.6 * scale);

      if (!REDUCED) {
        // beat 2 — dust, low and sideways
        const y = b.position.y + d.h * 0.42;
        dust.impact(b.position.x - d.w * 0.42, y, 26, pal);
        dust.impact(b.position.x + d.w * 0.42, y, 26, pal);
        setTimeout(() => dust.breath(b.position.x, y, 10, pal), 150);
      }

      // beat 4 — the label lands too
      d.el.animate(
        [{ transform: d.el.style.transform + ' translateY(0)' },
         { transform: d.el.style.transform + ' translateY(2px)' },
         { transform: d.el.style.transform + ' translateY(0)' }],
        { duration: 130, easing: 'ease-out' }
      );
    }
  }
});

/* the resting profile: the sprite's real alpha sampled at the angle it actually came to rest at.
   Everything downstream follows the true edge of the photograph instead of a bounding box. */
function settle(d) {
  d.rested = true;
  d.prof = restProfile(d.im, d.w, d.h, d.body.angle);
  const pal = STRATA[Math.min(d.stratum, STRATA.length - 1)][2];
  const r = rng(d.i * 977 + 5);
  const p = d.prof;
  for (let k = 0; k < 6 + Math.floor(r() * 9); k++) {          // beat 3 — first grains of its burial
    const ci = Math.floor(r() * p.n);
    if (Number.isNaN(p.top[ci])) { k--; continue; }
    d.grains.push({
      dx: p.ox + ci * p.colW + r() * p.colW,
      dy: p.oy + p.top[ci] + r() * 2,
      r: 1 + r() * 2, c: r() < 0.6 ? pal.d : pal.l
    });
  }
  if (MODE === 'b') d.mask = windowMask(d.im, d.w, d.h, 0.35 + Math.random() * 0.2, d.i * 31 + 7);
}

/* ------------------------------------------------------------------ the surface */

const surf = new Float32Array(ground.n);              // world y of the top of the earth
const obsTop = new Float32Array(ground.n);            // world y of the highest object at that column
const obsObj = new Array(ground.n);
const swell = new Float32Array(ground.n);             // mode c: the local uplift of the swallow

function buildSurface() {
  const n = ground.n;
  for (let i = 0; i < n; i++) {
    obsTop[i] = Infinity; obsObj[i] = null; swell[i] = 0;
  }
  for (const d of drops) {
    if (!d.rested || !d.prof) continue;
    const p = d.prof, px = d.body.position.x, py = d.body.position.y;
    if (py - camY < -600 || py - camY > H + 600) continue;
    for (let ci = 0; ci < p.n; ci++) {
      if (Number.isNaN(p.top[ci])) continue;
      const i = ground.idx(px + p.ox + ci * p.colW);
      const y = py + p.oy + p.top[ci];
      if (y < obsTop[i]) { obsTop[i] = y; obsObj[i] = d; }
    }
    if (MODE === 'c') {
      // A travelling bulge that rides the burial front: the ground rises to meet the object,
      // closes over it faster than it closes over the flat land beside it, and then settles
      // back once the thing is under. It must fade, or every swallowed object leaves a hill.
      const t = (base - (py + p.oy)) / (1.7 * d.h);
      const sw = t > 1 ? 0 : t > 0 ? 1 - t : Math.max(0, 1 + t * 1.7);
      if (sw > 0.001) ground.gaussMax(swell, px, Math.max(20, 0.85 * d.w), Math.pow(sw, 1.4) * d.h * 0.62);
    }
  }

  for (let i = 0; i < n; i++) {
    surf[i] = base + ground.noise[i] - ground.mound[i] - ground.ash[i] - swell[i];
  }

  // mode c — the meniscus. Where matrix meets object it climbs the edge and grips.
  if (MODE === 'c') {
    for (let i = 0; i < n; i++) {
      if (!Number.isFinite(obsTop[i])) continue;
      const gap = surf[i] - obsTop[i];
      if (gap > -14 && gap < 14) surf[i] -= 6 * (1 - Math.abs(gap) / 14);
    }
  }
}

const surfaceAt = x => surf[ground.idx(x)];

/* ------------------------------------------------------------------ drawing the earth */

/* everything below a contour, as a path — the only shape the earth is ever drawn as */
function region(c, yAt, step = 4) {
  c.beginPath();
  c.moveTo(-8, yAt(-8));
  for (let x = -8; x <= W + 8; x += step) c.lineTo(x, yAt(x));
  c.lineTo(W + 8, H + 8);
  c.lineTo(-8, H + 8);
  c.closePath();
}

function fillTo(c, pal, seed, yAt) {
  const tile = tileFor(pal, seed);
  const pat = c.createPattern(tile, 'repeat');
  pat.setTransform(new DOMMatrix().translate(-(seed * 53) % tile.width, -camY % tile.height));
  c.fillStyle = pat;
  region(c, yAt);
  c.fill();
}

function drawEarth() {
  ectx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ectx.clearRect(0, 0, W, H);

  // top-down: the current era's material first, then each older contact painted over it, so
  // every band ends up visible between its own contact and the next one down
  const curPal = STRATA[Math.min(era, STRATA.length - 1)][2];
  fillTo(ectx, curPal, era, x => surf[ground.idx(x)] - camY);

  for (let m = marks.length - 1; m >= 0; m--) {
    const mk = marks[m];
    fillTo(ectx, STRATA[mk.below][2], mk.below * 13 + 1,
      x => { const i = ground.idx(x); return mk.y0 + ground.noise[i] * 0.7 - mk.drape[i] - camY; });
  }

  // both of these apply only where earth already exists — never over the sky, never over an object
  ectx.globalCompositeOperation = 'source-atop';

  const mt = mottle();
  const mp = ectx.createPattern(mt, 'repeat');
  mp.setTransform(new DOMMatrix().translate(0, -camY % mt.height));
  ectx.fillStyle = mp;
  ectx.fillRect(0, 0, W, H);

  // Light dies with depth — and depth is measured from the LOCAL surface, not from a global
  // mean, or a mound reads as a pale hill lit from nowhere. Stacked contour-following bands,
  // each following the same silhouette the ground has, so the darkening bends with the land.
  // many thin passes rather than a few thick ones — at nine bands a high-amplitude surface
  // reads as a contour map, which is its own kind of fake
  ectx.fillStyle = 'rgba(5,5,7,.052)';
  for (let k = 0; k < 28; k++) {
    const off = k * 44;
    region(ectx, x => surf[ground.idx(x)] - camY + off, 12);
    ectx.fill();
  }

  ectx.globalCompositeOperation = 'source-over';

  // mode b — cut the excavation windows, then rim them so they read as holes in material
  if (MODE === 'b') {
    const cut = [];
    for (const d of drops) {
      if (!d.mask || !d.rested) continue;
      const sy = d.body.position.y - camY;
      if (sy < -300 || sy > H + 300) continue;
      if (d.body.position.y + d.prof.oy < surfaceAt(d.body.position.x) - 4) continue;   // still above ground
      cut.push(d);
    }
    ectx.globalCompositeOperation = 'destination-out';
    for (const d of cut) drawMask(ectx, d, 0, 0);
    ectx.globalCompositeOperation = 'source-atop';
    ectx.fillStyle = 'rgba(0,0,0,.55)';
    for (const d of cut) drawMask(ectx, d, 0, 3, true);
    ectx.globalCompositeOperation = 'source-over';
    return cut;
  }
  return null;
}

function drawMask(c, d, ox, oy, tint) {
  const b = d.body;
  c.save();
  c.translate(b.position.x + ox, b.position.y - camY + oy);
  c.rotate(b.angle);
  if (tint) {
    c.globalCompositeOperation = 'source-atop';
    c.drawImage(d.mask, -d.w / 2, -d.h / 2, d.w, d.h);
  } else {
    c.drawImage(d.mask, -d.w / 2, -d.h / 2, d.w, d.h);
  }
  c.restore();
}

/* ------------------------------------------------------------------ mode a — the fall */

function stepMotes(dt, dScroll) {
  if (REDUCED) return;
  const pal = STRATA[Math.min(era, STRATA.length - 1)][2];
  // it gusts and it slackens — a steady even curtain is the thing that reads as a screensaver
  const gust = 0.45 + 0.55 * noise1(performance.now() * 0.0004);
  const want = Math.min(260, 60 + Math.abs(dScroll) * 0.9) * gust;
  while (motes.length < want) {
    motes.push({
      x: -40 + Math.random() * (W + 80), y: camY - 40 - Math.random() * 200,
      vy: 40 + Math.random() * 55, vx: (Math.random() - 0.5) * 22,
      r: 1 + Math.random() * 2, c: Math.random() < 0.6 ? pal.d : pal.l
    });
  }
  for (let k = motes.length - 1; k >= 0; k--) {
    const q = motes[k];
    q.y += q.vy * dt / 1000;
    q.x += (q.vx + Math.sin(q.y * 0.01) * 6) * dt / 1000;
    if (q.y - camY > H + 120 || q.x < -60 || q.x > W + 60) { motes.splice(k, 1); continue; }
    const i = ground.idx(q.x);
    const hitObj = obsObj[i] && obsTop[i] < surf[i];
    const hitY = hitObj ? obsTop[i] : surf[i];
    if (q.y < hitY) continue;
    if (hitObj) {
      // it lands on the thing and stays there — drawn in front of the photograph, never on it
      const d = obsObj[i];
      if (d.grains.length < 110) {
        d.grains.push({
          dx: q.x - d.body.position.x, dy: hitY - d.body.position.y - 1,
          r: q.r, c: q.c
        });
      }
    } else {
      ground.deposit(i, 1.9, j => Number.isFinite(obsTop[j]) ? Math.max(0, base - obsTop[j]) : 0);
    }
    motes.splice(k, 1);
  }
}

/* ------------------------------------------------------------------ the frame */

const taken = [];

function frame(now) {
  const dt = Math.min(50, now - prevT); prevT = now;
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
  const dScroll = scrollY - prevScroll; prevScroll = scrollY;

  const want = Math.min(ITEMS.length, Math.floor(p * ITEMS.length) + 1);
  if (released < want && now - lastDrop > 880) { drop(drops[released], released); released++; lastDrop = now; }
  fadeIntro(p);

  // rest detection: the profile is sampled once, at the angle it actually stopped at
  let pileTop = FLOOR;
  for (const d of drops) {
    if (!d.body) continue;
    const v = d.body.velocity;
    const still = Math.abs(v.y) < 0.7 && Math.abs(v.x) < 0.7 && Math.abs(d.body.angularVelocity) < 0.02;
    if (still && !d.rested && d.landed && d.im) settle(d);
    if (still) pileTop = Math.min(pileTop, d.body.position.y - d.h * 0.5);
  }

  // the general ground level trails the top of the pile, so the newest things stand proud and
  // everything older is already under. How far it trails is what separates the three modes.
  const prevBase = base;
  base += ((pileTop + M.lag) - base) * 0.03;
  ground.weather(dScroll);
  const rose = prevBase - base;
  if (rose > 0) {
    // fresh ash is consumed as the general level comes up through it — it is always the
    // top skin, never an ever-growing heap
    for (let i = 0; i < ground.n; i++) ground.ash[i] = Math.max(0, ground.ash[i] - rose);
  }
  camY += ((base - H * 0.58) - camY) * 0.05;

  // era changes lay down a new contact, and the landform itself becomes a different landform
  const cur = drops[Math.max(0, released - 1)];
  if (cur.stratum !== era) {
    marks.push({ y0: base, below: era, drape: ground.newMark() });
    ground.decayMounds(0.6);
    era = cur.stratum;
    ground.setDrift(era * 7.3);
  }

  buildSurface();
  if (MODE === 'a') stepMotes(dt, dScroll);
  dust.step(dt);

  // anything that has gone under is remembered by the ground: a mound, flattening with age
  for (const d of drops) {
    if (!d.rested || d.noted) continue;
    if (d.body.position.y + d.prof.oy > surfaceAt(d.body.position.x)) {
      d.noted = true;
      ground.noteBurial(d.body.position.x, d.w, d.h);
    }
  }

  setHud(cur.it.y, STRATA[Math.min(era, STRATA.length - 1)][1], cur.light[1]);

  /* ---- sky: ONE fill across the whole viewport. Two abutting fills always show their seam. ---- */
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#05060b';
  ctx.fillRect(0, 0, W, H);
  let mean = 0;
  for (let i = 0; i < ground.n; i++) mean += surf[i];
  mean = mean / ground.n - camY;
  const glow = ctx.createRadialGradient(W / 2, mean, 0, W / 2, mean, Math.max(W, H) * 0.85);
  glow.addColorStop(0, hexA(cur.light[1], 0.16));
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  /* ---- the photographs, raw. Never lit, never tinted, never graded. ---- */
  for (const d of drops) {
    if (!d.body || !d.im) continue;
    const b = d.body, sy = b.position.y - camY;
    if (sy < -400 || sy > H + 500) continue;
    ctx.save();
    ctx.translate(b.position.x, sy);
    ctx.rotate(b.angle);
    if (!d.rested) { ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10; }
    ctx.drawImage(d.im, -d.w / 2, -d.h / 2, d.w, d.h);
    ctx.restore();
    // grains resting on its up-facing edges — in front of the photograph, which is occlusion
    if (d.grains.length) {
      for (const g of d.grains) {
        ctx.fillStyle = hexA(g.c, 0.85);
        ctx.fillRect(b.position.x + g.dx, sy + g.dy, g.r, g.r);
      }
    }
  }

  /* ---- the earth, opaque, laid over everything ---- */
  drawEarth();
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(ecvs, 0, 0);
  ctx.restore();

  /* ---- debris straddling the line, so the eye can never trace one continuous edge ---- */
  const pal = STRATA[Math.min(era, STRATA.length - 1)][2];
  for (let i = 0; i < ground.n; i += 3) {
    const x = ground.xAt(i);
    const r = ((i * 2654435761) >>> 0) / 4294967296;
    if (r > 0.42) continue;
    const y = surf[i] - camY + (r - 0.21) * 26;
    const s = r < 0.06 ? 2 + r * 40 : 1 + r * 2;
    ctx.fillStyle = hexA(r < 0.2 ? pal.k : pal.l, 0.32 + r);
    ctx.fillRect(x + r * 4, y, s, s * 0.8);
  }

  if (!REDUCED) {
    for (const q of motes) { ctx.fillStyle = hexA(q.c, 0.42); ctx.fillRect(q.x, q.y - camY, q.r, q.r); }
    dust.draw(ctx, camY);
  }

  /* ---- labels: crisp DOM, and they go out when the earth has actually taken the object.
         A label floating over solid ground is an instant tell. ---- */
  taken.length = 0;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    if (!d.body) continue;
    const b = d.body, sy = b.position.y - camY;
    const objTop = b.position.y - (d.prof ? -d.prof.oy : d.h / 2);
    const objBot = b.position.y + (d.prof ? d.prof.oy + d.prof.bh : d.h / 2);
    const gy = surfaceAt(b.position.x);
    let vis = d.rested ? Math.min(1, Math.max(0, (gy - objTop) / Math.max(1, objBot - objTop))) : 1;
    // a window is still something to name — but only while it is near enough to the surface to
    // actually be one. A label hovering over 400px of solid earth is an instant tell.
    if (MODE === 'b' && d.mask && vis < 0.4 && objTop - gy < 260) vis = 0.42;

    let o = vis <= 0.4 ? 0 : Math.min(1, (vis - 0.4) / 0.25);
    if (sy < -120 || sy > H + 60) o = 0;

    if (o > 0.02 && taken.length < 7) {
      const lx = b.position.x;
      const ly = Math.min(sy + d.h / 2 + 10, gy - camY + 6);
      if (taken.some(r => Math.abs(r.x - lx) < 230 && Math.abs(r.y - ly) < 74)) o = 0;
      else {
        taken.push({ x: lx, y: ly });
        d.el.style.transform = `translate(-50%,0) translate(${lx.toFixed(0)}px,${ly.toFixed(0)}px)`;
      }
    } else if (o > 0.02) o = 0;

    const s = o.toFixed(3);
    if (d.el.style.opacity !== s) d.el.style.opacity = s;
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
