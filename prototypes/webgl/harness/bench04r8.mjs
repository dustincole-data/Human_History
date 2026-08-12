/* READ-ONLY benchmark. Touches no source file.

   THE ONE NUMBER THAT CAN STILL VETO RULING 8b: worst-case replay ms on the frame the visitor
   reverses. Round 8 costed the rewind in megabytes (7.7 MB against an 80 MB gate) and left this
   unmeasured, with the instruction to measure it before writing the frame loop.

   Under 8b the post-impact state stops being integrated forward and becomes a lookup: at scroll y
   an object's generation is read off `age`, and that generation's shards are REPLAYED from their
   own birth state for `flight = (y - genBorn) * MS_PER_PX`, substepped at SUB. Walking down that
   costs one substep a frame; walking UP, every live object has to be replayed from its birth in
   one frame, all of them at once. That is the frame this file prices.

   It prices it three ways, because the three answers are different engineering:

     A  uncached   every live object replayed from birth for its FULL flight, every frame.
     B  to-rest    the same, stopped as soon as every piece is at rest — what round 8's
                   "every settled generation can be cached as a pose" buys, per frame.
     C  today      what the shipped frame already spends in the same two functions, as the
                   baseline the new number has to be read against.

   The page's own frame budget is 25 ms (the sweep's frame gate); 60fps is 16.7 ms.

   Nothing here patches anything: the piece list is snapshotted field by field before each run and
   restored byte-for-byte after, and the timing runs against the real pieces, the real canvases and
   the real `surfAt`. */
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:8812/index.html';

/* gravity.js's own constants. Not exported on `__hh`, so they are restated here and CHECKED
   against the served source before anything is measured — a benchmark run against the wrong
   MS_PER_PX is a number about nothing. */
const MS_PER_PX = 3.0, SUB = 50;

const src = await (await fetch(URL.replace('index.html', 'gravity.js'))).text();
for (const [name, want] of [['MS_PER_PX', MS_PER_PX], ['SUB', SUB]]) {
  const m = src.match(new RegExp(`const ${name}\\s*=\\s*([0-9.]+)`));
  if (!m || Number(m[1]) !== want) {
    console.error(`FATAL: ${name} in gravity.js is ${m ? m[1] : 'missing'}, this file assumes ${want}`);
    process.exit(1);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => errs.push(String(e)));

const settle = async (n = 6) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise(requestAnimationFrame)); };
const go = async y => { await page.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y); await settle(); };

await page.goto(URL, { waitUntil: 'load' });
await settle(30);

const { TOTAL, SPLITS, LAND, LIFE } = await page.evaluate(() => {
  const h = window.__hh;
  return { TOTAL: h.TOTAL, SPLITS: h.SPLITS, LAND: h.LAND, LIFE: h.LIFE };
});

/* ------------------------------------------------------------------ phase 0: the arithmetic

   How many objects can be carrying pieces at once, from the TABLES rather than from one walk. A
   200px stride can miss a peak, and this project has already lost a round to a gate whose stride
   was the whole defect. An object carries pieces from its landing until DUST_AT of its life; after
   that it is specks, and specks are driven straight off the scroll clock and never integrated. */
{
  const DUST_AT = await page.evaluate(() => window.__hh.DUST_AT);
  const ev = [];
  for (let i = 0; i < LAND.length; i++) { ev.push([LAND[i], 1], [LAND[i] + LIFE[i] * DUST_AT, -1]); }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let n = 0, peak = 0, at = 0;
  for (const [y, d] of ev) { n += d; if (n > peak) { peak = n; at = y; } }
  console.log(`phase 0 — from the tables: at most ${peak} objects carry pieces at once (first at y=${Math.round(at).toLocaleString()}), DUST_AT=${DUST_AT}.`);
}

/* ------------------------------------------------------------------ phase 1: the census

   What a reverse frame actually has in front of it, at every scroll position on the page. The
   work is the product, not either factor: an object at generation 2 carries the most pieces and
   the longest flight at the same time. */

const genOf = (i, age) => { let g = 0; while (g < SPLITS.length && age >= SPLITS[g]) g++; return g; };
const bornOf = (i, g) => LAND[i] + (g > 0 ? SPLITS[g - 1] * LIFE[i] : 0);

const census = () => page.evaluate(() => {
  const h = window.__hh;
  const out = [];
  for (const d of h.drops) {
    if (!d.down || d.gone) continue;
    const live = d.pieces.filter(p => !p.dead).length;
    if (!live) continue;
    out.push({ i: d.i, age: d.age, pieces: live, specks: d.specks.length });
  }
  return { y: window.scrollY, objs: out, dust: h.dust.p.length };
});

console.log('phase 1 — the census. Walking', TOTAL.toLocaleString(), 'px at 200px.');
const stops = [];
let worstWork = null, mostObjs = 0, mostPieces = 0, mostPiecesAt = null, mostDust = 0;
for (let y = 0; y <= TOTAL; y += 200) {
  await go(y);
  const c = await census();
  let work = 0, subs = 0;
  for (const o of c.objs) {
    const g = genOf(o.i, o.age);
    o.g = g;
    o.flight = Math.max(0, c.y - bornOf(o.i, g)) * MS_PER_PX;
    o.subs = Math.ceil(o.flight / SUB);
    work += o.pieces * o.subs;
    subs = Math.max(subs, o.subs);
  }
  const row = { y: c.y, n: c.objs.length, pieces: c.objs.reduce((a, o) => a + o.pieces, 0),
                dust: c.dust, work, subs, objs: c.objs };
  stops.push(row);
  if (!worstWork || work > worstWork.work) worstWork = row;
  if (row.n > mostObjs) mostObjs = row.n;
  if (row.dust > mostDust) mostDust = row.dust;
  for (const o of c.objs) if (o.pieces > mostPieces) { mostPieces = o.pieces; mostPiecesAt = { y: c.y, i: o.i, g: o.g }; }
}

console.log(`  most objects on the ground at once : ${mostObjs}`);
console.log(`  most pieces on ONE object          : ${mostPieces}  (item ${mostPiecesAt.i}, gen ${mostPiecesAt.g}, y=${mostPiecesAt.y.toLocaleString()})`);
console.log(`  most dust particles resident       : ${mostDust}`);
console.log(`  heaviest replay frame              : y=${worstWork.y.toLocaleString()} — ${worstWork.n} objects, ${worstWork.pieces} pieces, ${worstWork.work.toLocaleString()} piece-substeps`);
console.log('    ' + worstWork.objs.map(o => `#${o.i} g${o.g} ${o.pieces}p×${o.subs}s`).join('  '));

/* the five heaviest, plus the frame carrying the most pieces on one object, are all timed */
const cand = stops.slice().sort((a, b) => b.work - a.work).slice(0, 5);
if (!cand.some(r => r.y === mostPiecesAt.y)) cand.push(stops.find(r => r.y === mostPiecesAt.y));
const byPieces = stops.slice().sort((a, b) => b.pieces - a.pieces)[0];
if (!cand.some(r => r.y === byPieces.y)) cand.push(byPieces);

/* ------------------------------------------------------------------ phase 2: the timed replay

   A fresh load and a real walk per candidate — contact latches, so a page another measurement
   already scrolled is a different piece. */

const REPS = 40, WARM = 5;

const timeAt = y => page.evaluate(async ({ y, MS_PER_PX, SUB, SPLITS, LAND, LIFE, REPS, WARM }) => {
  const h = window.__hh;
  const { stepPieces } = await import('./decay.js');   // the page's own module instance

  const live = h.drops.filter(d => d.down && !d.gone && d.pieces.some(p => !p.dead));
  const plan = live.map(d => {
    let g = 0; while (g < SPLITS.length && d.age >= SPLITS[g]) g++;
    const born = LAND[d.i] + (g > 0 ? SPLITS[g - 1] * LIFE[d.i] : 0);
    return { d, g, flight: Math.max(0, y - born) * MS_PER_PX, n: d.pieces.filter(p => !p.dead).length };
  });

  /* the birth state a replay starts from. The canvases, the count and the ground are the real
     ones; what is reconstructed is the pose — every piece un-rested, lifted off the surface and
     given a shard's launch velocity, which is what makes the integrator do full work instead of
     no-oping on a settled field. Magnitudes are shatterNow's own. */
  const snap = plan.map(({ d }) => d.pieces.map(p =>
    ({ p, x: p.x, y: p.y, vx: p.vx, vy: p.vy, rot: p.rot, vrot: p.vrot, rest: p.rest, bounce: p.bounce })));
  const restore = () => { for (const list of snap) for (const s of list) Object.assign(s.p, s); };
  const birth = () => {
    for (const list of snap) for (let k = 0; k < list.length; k++) {
      const p = list[k].p, sgn = k % 2 ? 1 : -1;
      p.x = list[k].x; p.y = list[k].y - 40; p.rot = list[k].rot;
      p.vx = sgn * 140; p.vy = -110; p.vrot = 1.2; p.rest = false; p.bounce = 1;
    }
  };

  const runFull = () => {
    for (const q of plan)
      for (let left = q.flight; left > 0; left -= SUB) stepPieces(q.d.pieces, Math.min(SUB, left), h.surfAt);
  };
  const runToRest = () => {
    let subs = 0;
    for (const q of plan) {
      let s = 0;
      for (let left = q.flight; left > 0; left -= SUB) {
        stepPieces(q.d.pieces, Math.min(SUB, left), h.surfAt);
        s++;
        if (q.d.pieces.every(p => p.rest)) break;
      }
      if (s > subs) subs = s;
    }
    return subs;
  };
  const runToday = () => {           // what the shipped frame spends here: ONE substep, forward
    for (const q of plan) stepPieces(q.d.pieces, SUB, h.surfAt);
  };

  /* WARM AND COLD ARE DIFFERENT ANSWERS AND BOTH ARE WANTED. A reverse is a rare frame, so the
     first run through a path the JIT has never optimised is the honest one for "the frame the
     visitor reverses"; the warm distribution is the honest one for "the visitor scrolls up and
     keeps scrolling up". Reported separately rather than averaged into a lie. */
  const bench = (setup, run) => {
    let extra, cold = 0;
    const ts = [];
    for (let r = 0; r < REPS + WARM; r++) {
      setup();
      const t0 = performance.now(); const e = run(); const t1 = performance.now();
      if (r === 0) { cold = t1 - t0; extra = e; }
      if (r >= WARM) ts.push(t1 - t0);
      restore();
    }
    ts.sort((a, b) => a - b);
    const q = f => ts[Math.min(ts.length - 1, Math.floor(ts.length * f))];
    return { cold, med: q(0.5), p95: q(0.95), max: ts[ts.length - 1], min: ts[0], extra };
  };

  const A = bench(birth, runFull);
  const B = bench(birth, runToRest);
  const C = bench(() => {}, runToday);

  /* the dust is on the same frame and becomes a lookup under 8b too */
  const dorig = h.dust.p.slice();                    // step() splices, so the ARRAY is restored too
  const dsnap = dorig.map(q => ({ q, ...q }));
  const dts = [];
  const dspan = Math.max(0, ...plan.map(q => Math.min(2500, q.flight)));
  const drestore = () => { for (const s of dsnap) Object.assign(s.q, s); h.dust.p.length = 0; h.dust.p.push(...dorig); };
  for (let r = 0; r < REPS; r++) {
    drestore();
    const t0 = performance.now();
    for (let left = dspan; left > 0; left -= SUB) h.dust.step(Math.min(SUB, left));
    dts.push(performance.now() - t0);
  }
  drestore();
  dts.sort((a, b) => a - b);

  restore();
  return {
    y, objs: plan.length, pieces: plan.reduce((a, q) => a + q.n, 0),
    subs: plan.map(q => Math.ceil(q.flight / SUB)),
    work: plan.reduce((a, q) => a + q.n * Math.ceil(q.flight / SUB), 0),
    A, B, C, restSubs: B.extra, dust: { n: dsnap.length, span: Math.round(dspan), med: dts[dts.length >> 1], max: dts[dts.length - 1] }
  };
}, { y, MS_PER_PX, SUB, SPLITS, LAND, LIFE, REPS, WARM });

console.log();
console.log('phase 2 — the timed replay. Fresh load + real walk per candidate,', REPS, 'reps each.');
console.log();
console.log('       y objs pieces   work | A: cold   med   p95   max | B: cold   med   max |  C med |  dust');
const results = [];
for (const c of cand) {
  await page.goto(URL, { waitUntil: 'load' });
  await settle(20);
  for (let y = 0; y < c.y; y += 200) await page.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y), await settle(2);
  await go(c.y);
  const r = await timeAt(c.y);
  results.push(r);
  const f = (v, n = 2, w = 5) => v.toFixed(n).padStart(w);
  console.log(`${String(r.y).padStart(8)} ${String(r.objs).padStart(3)} ${String(r.pieces).padStart(5)} ` +
    `${String(r.work).padStart(6)} | ${f(r.A.cold)} ${f(r.A.med)} ${f(r.A.p95)} ${f(r.A.max)} | ` +
    `${f(r.B.cold)} ${f(r.B.med)} ${f(r.B.max)} | ${f(r.C.med, 3)} | ${f(r.dust.med)}`);
}

const wA = results.reduce((a, r) => r.A.max > a.A.max ? r : a, results[0]);
const wB = results.reduce((a, r) => r.B.max > a.B.max ? r : a, results[0]);
console.log();
console.log(`WORST A (uncached, full flight) : ${wA.A.max.toFixed(2)} ms  at y=${wA.y.toLocaleString()}  (${wA.objs} objects, ${wA.pieces} pieces, ${wA.work.toLocaleString()} piece-substeps, flights ${wA.subs.join('/')} substeps)`);
console.log(`WORST B (replay to rest)        : ${wB.B.max.toFixed(2)} ms  at y=${wB.y.toLocaleString()}  (${wB.restSubs} substeps before every piece rested)`);
console.log(`the frame budget is 25 ms; 60fps is 16.7 ms.`);

/* ------------------------------------------------------------------ phase 3: a slow CPU

   Headless Chrome on this laptop is not the machine the piece has to hold 60fps on, and mobile is
   a ship gate. 6x is the throttle Lighthouse uses to model a mid-tier phone. */
const client = await page.context().newCDPSession(page);
await page.goto(URL, { waitUntil: 'load' });
await settle(20);
/* the throttle goes on AFTER the walk, not before it: what is being modelled is a slow CPU on the
   one frame the visitor reverses, not a slow CPU dragged through 142,000px of scroll. */
for (let y = 0; y < wA.y; y += 200) await page.evaluate(v => window.scrollTo({ top: v, behavior: 'instant' }), y), await settle(2);
await go(wA.y);
await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });
const slow = await timeAt(wA.y);
await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
console.log();
console.log(`phase 3 — 6x CPU throttle at y=${slow.y.toLocaleString()} (${slow.objs} objects, ${slow.pieces} pieces):`);
console.log(`  A uncached : cold ${slow.A.cold.toFixed(2)}  med ${slow.A.med.toFixed(2)}  p95 ${slow.A.p95.toFixed(2)}  max ${slow.A.max.toFixed(2)} ms`);
console.log(`  B to-rest  : cold ${slow.B.cold.toFixed(2)}  med ${slow.B.med.toFixed(2)}  max ${slow.B.max.toFixed(2)} ms`);

console.log();
console.log('page errors:', errs.length, errs.slice(0, 3));

await browser.close();
