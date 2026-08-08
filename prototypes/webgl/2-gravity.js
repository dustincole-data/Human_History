/* 2 — GRAVITY, second pass.
   Dustin, on the first one: things piled up too fast, four fell at once with only one label,
   and they fell too fast to read. And the idea that fixes it: "they need to be buried into the
   ground — time kind of buries all the objects."

   So this is no longer a heap. It is a SEDIMENT. Objects fall slowly, one at a time, land on the
   surface, and then the ground rises over them: the camera follows the top of the pile, so
   everything you have already seen sinks and is covered by earth in the colour of its own era.
   You are always standing at the present, on top of everything that came before, and you can
   still half-see it down there.

   Every object carries its own label from the moment it appears. Native scroll 1:1 throughout. */

import { ITEMS, lightFor, shortCred, setHud, setIntro, fadeIntro, done, REDUCED } from './shell.js';

setIntro('Things fall in one at a time, land, and are slowly buried. The ground rises over them in the colour of their own age — you are always standing on top of everything before.',
         'scroll to bury · drag to throw');

await new Promise(res => {
  const s = document.createElement('script');
  s.src = './vendor/matter.min.js'; s.onload = res; document.head.appendChild(s);
});
const { Engine, Runner, World, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

/* the earth people were standing on, by era — the strata are dated, not decorative */
const GROUND = [
  [-99999, '#6b4a2e', 'EARTH'],
  [-3000,  '#7d6a4a', 'SILT'],
  [-500,   '#8a7f6a', 'STONE'],
  [1500,   '#5c5346', 'CLAY'],
  [1800,   '#40382f', 'SOOT'],
  [1900,   '#33302c', 'ASH'],
  [1970,   '#2a2b30', 'CONCRETE']
];
const groundFor = y => GROUND.filter(g => y >= g[0]).pop();

const cvs = document.createElement('canvas');
cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';
document.getElementById('gl').appendChild(cvs);
const ctx = cvs.getContext('2d');

const engine = Engine.create();
engine.gravity.y = REDUCED ? 0.35 : 0.52;          // slow. you should be able to read it on the way down.
Runner.run(Runner.create(), engine);

const FLOOR = 100000;                               // the pile grows upward from a fixed world floor
let W = 0, H = 0, walls = [];
function fit() {
  W = innerWidth; H = innerHeight;
  const dpr = Math.min(devicePixelRatio, 2);
  cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  Composite.remove(engine.world, walls);
  walls = [
    Bodies.rectangle(W / 2, FLOOR + 40, W * 4, 80, { isStatic: true }),
    Bodies.rectangle(-30, FLOOR - 3000, 60, 8000, { isStatic: true }),
    Bodies.rectangle(W + 30, FLOOR - 3000, 60, 8000, { isStatic: true })
  ];
  Composite.add(engine.world, walls);
}
fit();
addEventListener('resize', fit);

const mouse = Mouse.create(cvs);
const mc = MouseConstraint.create(engine, { stiffness: 0.14, render: { visible: false } });
Composite.add(engine.world, mc);
mouse.element.removeEventListener('wheel', mouse.mousewheel);   // never take the wheel

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
  return { it, im, ar: im ? im.width / im.height : 1, light: lightFor(it.y), el, body: null };
});

/* camera: follows the top of the pile, which is what produces the burial */
let camY = FLOOR - H * 0.66;
let surface = FLOOR;                                  // world y of the top of the pile
const strata = [{ y: FLOOR, c: GROUND[0][1] }];       // dated layers, deepest first

function drop(d, i) {
  const hh = 132;
  const w = hh * d.ar, h = hh;
  const x = W * (0.18 + 0.64 * ((i * 0.618034) % 1));
  const b = Bodies.rectangle(x, surface - H * 0.72, w * 0.84, h * 0.84, {
    restitution: 0.12, friction: 0.62, frictionAir: 0.028, density: 0.0014,
    angle: (Math.random() - 0.5) * 0.35
  });
  Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.03);
  d.body = b; d.w = w; d.h = h; d.born = performance.now();
  Composite.add(engine.world, b);
  strata.push({ y: surface, c: groundFor(d.it.y)[1] });
}

let released = 0, lastDrop = 0;
const PER_ITEM = 1000;                                // px of scroll per object — slow on purpose
document.getElementById('spacer').style.height = (ITEMS.length * PER_ITEM + innerHeight) + 'px';
done();

const taken = [];

function frame(now) {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
  const want = Math.min(ITEMS.length, Math.floor(p * ITEMS.length) + 1);
  // one at a time, and never faster than you can read — a fast scroll queues, it does not dump
  if (released < want && now - lastDrop > 880) { drop(drops[released], released); released++; lastDrop = now; }
  fadeIntro(p);

  // the surface is the highest thing that has come to rest
  let top = FLOOR;
  for (const d of drops) {
    if (!d.body) continue;
    const v = d.body.velocity;
    if (Math.abs(v.y) < 0.9 && Math.abs(v.x) < 0.9) top = Math.min(top, d.body.position.y - d.h * 0.3);
  }
  surface += (top - surface) * 0.05;
  camY += ((surface - H * 0.62) - camY) * 0.045;
  const surfaceScreen = surface - camY;

  const cur = drops[Math.max(0, released - 1)];
  setHud(cur.it.y, groundFor(cur.it.y)[2], cur.light[1]);

  /* ---- sky ---- */
  const sky = ctx.createLinearGradient(0, 0, 0, surfaceScreen);
  sky.addColorStop(0, '#05060b');
  sky.addColorStop(1, cur.light[1] + '33');
  ctx.fillStyle = '#05060b'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, Math.max(0, surfaceScreen));

  /* ---- the objects ---- */
  for (const d of drops) {
    if (!d.body || !d.im) continue;
    const b = d.body, sy = b.position.y - camY;
    if (sy < -400 || sy > H + 500) continue;
    ctx.save();
    ctx.translate(b.position.x, sy);
    ctx.rotate(b.angle);
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    ctx.drawImage(d.im, -d.w / 2, -d.h / 2, d.w, d.h);
    ctx.restore();
  }

  /* ---- time buries them: earth drawn OVER everything below the surface, dated by layer,
         translucent at the top so you can still half-see what is down there ---- */
  const g = ctx.createLinearGradient(0, surfaceScreen - 6, 0, H);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  const depth = Math.max(1, H - surfaceScreen);
  const seen = [];
  for (let i = strata.length - 1; i >= 0; i--) {
    const s = strata[i], sy = s.y - camY;
    if (sy < surfaceScreen || sy > H + 200) continue;
    const stop = Math.min(1, Math.max(0, (sy - surfaceScreen) / depth));
    if (seen.length && stop - seen[seen.length - 1] < 0.015) continue;
    seen.push(stop);
    const a = Math.min(0.97, 0.12 + stop * 2.6);
    g.addColorStop(stop, hexA(s.c, a));
  }
  g.addColorStop(1, hexA(strata[Math.max(0, strata.length - 1)].c, 0.985));
  ctx.fillStyle = g;
  ctx.fillRect(0, Math.max(0, surfaceScreen - 6), W, H - Math.max(0, surfaceScreen - 6));

  // the ground line itself
  ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, surfaceScreen); ctx.lineTo(W, surfaceScreen); ctx.stroke();

  /* ---- every object carries its own label, and it fades as the object is buried ---- */
  taken.length = 0;
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    if (!d.body) { continue; }
    const sy = d.body.position.y - camY;
    const below = sy - surfaceScreen;                       // how deep under the surface it is
    let o = below < 0 ? 1 : Math.max(0, 1 - below / 150);   // fades out as the earth covers it
    if (sy < -120 || sy > H + 60) o = 0;
    if (o > 0.02 && taken.length < 7) {
      const lx = d.body.position.x, ly = sy + d.h / 2 + 10;
      if (taken.some(r => Math.abs(r.x - lx) < 230 && Math.abs(r.y - ly) < 74)) o *= 0.0;
      else taken.push({ x: lx, y: ly });
      d.el.style.transform = `translate(-50%,0) translate(${lx.toFixed(0)}px,${ly.toFixed(0)}px)`;
    }
    if (d.el.style.opacity !== String(o)) d.el.style.opacity = o.toFixed(3);
  }

  requestAnimationFrame(frame);
}

function hexA(h, a) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
  return `rgba(${r},${g},${b},${a})`;
}

requestAnimationFrame(frame);
