/* 2 — GRAVITY. Not a page: a physical space. Every object you scroll past falls in and
   stays, so twelve thousand years literally piles up in front of you. Grab anything and
   throw it. The reward is the heap — it is the only one of the four you can break.

   Scroll releases objects 1:1; it never takes the wheel. */

import { ITEMS, lightFor, setHud, setIntro, fadeIntro, done, REDUCED } from './shell.js';

setIntro('Everything you pass falls in and stays. Twelve thousand years piles up. Grab anything and throw it.',
         'scroll to drop · drag to throw');

await new Promise(res => {
  const s = document.createElement('script');
  s.src = './vendor/matter.min.js'; s.onload = res; document.head.appendChild(s);
});
const { Engine, Runner, World, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

const cvs = document.createElement('canvas');
cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';
document.getElementById('gl').appendChild(cvs);
const ctx = cvs.getContext('2d');

const engine = Engine.create();
engine.gravity.y = 1.15;
const runner = Runner.create();
Runner.run(runner, engine);

let W = 0, H = 0, walls = [];
function fit() {
  W = innerWidth; H = innerHeight;
  cvs.width = Math.round(W * Math.min(devicePixelRatio, 2));
  cvs.height = Math.round(H * Math.min(devicePixelRatio, 2));
  ctx.setTransform(cvs.width / W, 0, 0, cvs.height / H, 0, 0);
  Composite.remove(engine.world, walls);
  walls = [
    Bodies.rectangle(W / 2, H + 30, W * 3, 60, { isStatic: true }),
    Bodies.rectangle(-40, H / 2, 80, H * 4, { isStatic: true }),
    Bodies.rectangle(W + 40, H / 2, 80, H * 4, { isStatic: true })
  ];
  Composite.add(engine.world, walls);
}
fit();
addEventListener('resize', fit);

const mouse = Mouse.create(cvs);
const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, render: { visible: false } } });
Composite.add(engine.world, mc);
// let the page keep its scroll — matter grabs wheel events by default, which would be scrolljacking
mouse.element.removeEventListener('wheel', mouse.mousewheel);

/* ---- load the cut-outs, then let them fall ---- */
const imgs = await Promise.all(ITEMS.map(it => new Promise(res => {
  const im = new Image();
  im.onload = () => res(im); im.onerror = () => res(null);
  im.src = `img/${it.k}.webp`;
})));

const drops = ITEMS.map((it, i) => {
  const im = imgs[i];
  const ar = im ? im.width / im.height : 1;
  return { it, im, ar, light: lightFor(it.y), body: null };
});

function drop(d, i) {
  const hh = Math.min(200, Math.max(78, 175 - i * 2.6));     // things get smaller as they crowd
  const w = hh * d.ar, h = hh;
  const x = W * (0.22 + 0.56 * ((i * 0.618) % 1));
  const b = Bodies.rectangle(x, -h, w * 0.86, h * 0.86, {
    restitution: 0.24, friction: 0.5, frictionAir: 0.006, density: 0.0016,
    angle: (Math.random() - 0.5) * 0.5
  });
  Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.06);
  d.body = b; d.w = w; d.h = h;
  Composite.add(engine.world, b);
}

const label = document.createElement('div');
label.className = 'lab';
document.getElementById('labels').appendChild(label);

let released = 0;
const bg = document.getElementById('gl');
document.getElementById('spacer').style.height = (ITEMS.length * 260 + innerHeight) + 'px';
done();

function frame() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / Math.max(1, max)));
  const want = Math.min(ITEMS.length, Math.floor(p * (ITEMS.length + 0.4)));
  while (released < want) { drop(drops[released], released); released++; }
  fadeIntro(p);

  const cur = drops[Math.max(0, released - 1)];
  setHud(cur.it.y, cur.light[2], cur.light[1]);
  bg.style.background =
    `radial-gradient(120% 90% at 50% 118%, ${cur.light[1]}2e 0%, #0a0c1200 62%), #06070c`;

  ctx.clearRect(0, 0, W, H);
  for (const d of drops) {
    if (!d.body || !d.im) continue;
    const b = d.body;
    ctx.save();
    ctx.translate(b.position.x, b.position.y);
    ctx.rotate(b.angle);
    ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10;
    ctx.drawImage(d.im, -d.w / 2, -d.h / 2, d.w, d.h);
    ctx.restore();
  }

  // one crisp DOM label, on the thing that just landed
  const b = cur.body;
  if (b) {
    label.innerHTML = `<div class="n">${cur.it.n}</div><div class="y">${cur.it.disp}</div>
      <div class="c">${cur.it.src} · ${cur.it.lic} · ${cur.it.cred}</div>`;
    label.style.setProperty('--spot', cur.light[1]);
    label.style.transform = `translate(-50%,0) translate(${b.position.x.toFixed(0)}px,${(b.position.y + cur.h / 2 + 8).toFixed(0)}px)`;
    label.style.opacity = '1';
  }
  requestAnimationFrame(frame);
}
if (REDUCED) engine.gravity.y = 0.6;
requestAnimationFrame(frame);
