/* Round 8 headless sweep — ticket 06. Same shape as round 7: real rAF ticks between instant
   scrolls, a FRESH LOAD for every phase that needs the deep head (contact latches, so a page
   that has been anywhere is not a page a first-time visitor sees), and nothing believed that a
   probe or a screenshot did not say. */
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const BASE = 'http://127.0.0.1:8812';
const URL = BASE + '/webgl/index.html';
const OUT = process.argv[2] || null;
const results = [];
const ok = (n, pass, note) => { results.push({ n, pass, note }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${n}  ${note ?? ''}`); };

const browser = await chromium.launch();
let page;
const errors = [];

/* A PHASE GETS A NEW PAGE, NOT A NAVIGATION — sweep11i has always done this and this file had
   not, which is the whole difference between a suite that finishes and one that does not. After
   the 2,133-stop walk the piece's document will not go away: `page.goto` to the same URL took
   13.6s against 2.1s cold, and once the run is ten minutes old even `about:blank` blows a 30s
   timeout. It killed this sweep at the same line four times. The README already had the other
   half of it — `browser.close()` hangs here with the piece's rAF loop live — and the fix is the
   same shape: stop asking the old document to stand down, and open a new one.
   `errors` accumulates across pages on purpose; `no_console_errors` is a claim about the RUN. */
async function newPage() {
  /* THE VIEWPORT SURVIVES THE SWAP, and it has to. `fresh()` used to be a navigation on the same
     page, so a phase that set 390x844 and then reloaded stayed at 390x844 — and three phases do
     exactly that. A new page defaulting to 1440x900 would have run the phone gates at desktop
     width while still calling them the phone gates, which is a false green, not a red. */
  const view = page ? page.viewportSize() : { width: 1440, height: 900 };
  if (page) await Promise.race([page.close().catch(() => {}), new Promise(r => setTimeout(r, 5000))]);
  page = await browser.newPage({ viewport: view, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  if (SLOW) await page.route('**/img/*.webp', async route => {
    await new Promise(r => setTimeout(r, 40 + Math.floor(Math.random() * 300)));
    await route.continue();
  });
}

/* --slow: hold every sprite response for a random 40–340ms. ROUND 10.

   On 127.0.0.1 a photograph comes back inside one frame, so the texture window is never late,
   nothing ever waits for pixels, and nothing ever arrives out of order — two of the round-10
   gates stayed green with their own code deleted until this existed. A phone on a train is not
   127.0.0.1. The delay is RANDOM per request on purpose: a fixed one preserves request order,
   and out-of-order arrival is the failure mode being tested. Run both ways. */
const SLOW = process.argv.includes('--slow');   // applied in newPage(), once per page

/* ROUND 10. `peakHeld` is per page load and every phase below reloads, so the reading is taken
   on the way OUT of each page rather than at the end of the run — otherwise the number reported
   is whatever the last four-pass frame budget happened to hold. Folded as a maximum across every
   page this sweep opens, which is the honest reading of "the most it ever held". */
const held = { peakPx: 0, lastN: 0, lastPx: 0, blind: 0, stops: 0 };
const absorb = async () => {
  if (!page) return;                            // the first phase has no page to read on the way out
  const r = await page.evaluate(() => {
    if (!window.__hh || !window.__hh.held) return null;
    const h = window.__hh.held();
    return { peakPx: window.__hh.peakHeld(), n: h.length,
             px: h.reduce((s, x) => s + x.w * x.h, 0), blind: window.__hh.blind() };
  }).catch(() => null);
  if (!r) return;
  held.peakPx = Math.max(held.peakPx, r.peakPx);
  held.blind += r.blind;
  held.lastN = r.n; held.lastPx = r.px;
};

const fresh = async (url = URL) => {
  await absorb();
  await newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hh && window.__hh.drops.length, null, { timeout: 60000 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1200);
};
await fresh();

const tick = async (n = 3) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise(requestAnimationFrame)); };
const to = async (y, n = 3) => {
  await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y);
  await tick(n);
  /* Under --slow a stop has to wait for the photographs that stop needs, or the harness reads a
     page that is still loading and reports it as a page that is wrong. On a normal network this
     never runs: pending() is already 0 by the first tick. */
  if (SLOW) for (let i = 0; i < 30 && await page.evaluate(() => window.__hh.pending()) > 0; i++) await tick(2);
};
const snap = () => page.evaluate(() => window.__hh.snap());

const T = await page.evaluate(() => {
  const h = window.__hh;
  return { FALL: h.FALL, TOTAL: h.TOTAL, W: h.W_YEARS, PER: h.PER, START: h.START, LAND: h.LAND,
           LIFE: h.LIFE, CO: h.CO, TIE: h.TIE, SPLITS: h.SPLITS, NAME_OUT: h.NAME_OUT,
           years: h.drops.map(d => d.it.y), bucket: h.drops.map(d => d.it.b) };
});
const N = T.PER.length;
const VW = 1440;
console.log(`\ntotal scroll ${Math.round(T.TOTAL)}px  (${(T.TOTAL / 900).toFixed(0)} screens of 900)`);
console.log(`PER ${Math.min(...T.PER)}..${Math.max(...T.PER)}  FALL ${T.FALL}  LIFE ${Math.min(...T.LIFE)}..${Math.max(...T.LIFE)}\n`);

/* ---------------- one page, one path ---------------- */
const gone = [];
for (const u of ['/webgl/launcher.html', '/webgl/1-depth.js', '/webgl/3-material.js',
                 '/webgl/4-atlas.js', '/directions/compare.html', '/directions/index.html',
                 '/directions/a-strata.js', '/webgl/vendor/three.module.js']) {
  const r = (await fetch(BASE + u)).status;
  if (r !== 404) gone.push(`${u}=${r}`);
}
const barred = await page.evaluate(() => !!document.getElementById('bar'));
ok('one_page_no_flags', gone.length === 0 && !barred,
   gone.length ? gone.join(' ') : 'every other option 404s, no switcher in the DOM');
// the flags are not handled any more: the same page comes back whatever is on the query string
await fresh(URL + '?v=1&b=c');
const flagged = await page.evaluate(() => ({ total: window.__hh.TOTAL, bar: !!document.getElementById('bar') }));
ok('query_flags_are_dead', Math.abs(flagged.total - T.TOTAL) < 0.5 && !flagged.bar,
   `?v=1&b=c renders the same one page`);

/* ---------------- the round-6/7 mechanic gates ---------------- */
await fresh();
const probe = 60;
const mid = T.START[probe] + T.FALL * 0.5;

await to(mid, 6);
/* WAIT FOR THE PHOTOGRAPH BEFORE STARTING THE CLOCK. "No pixels, no fall" (03) means this item is
   not airborne until its sprite is here, and under load that can land after `fresh()`'s 600ms — the
   probe then found nothing in the air and reported `y undefined -> 94.34`, which reads like the
   mechanic broke when what actually happened is that the machine was busy. The gate is about the
   scroll being the only clock; it is not about how fast localhost decodes. */
for (let i = 0; i < 60 && !(await snap()).items.some(x => x.air); i++) await tick(3);
let a = await snap();
let air0 = a.items.find(x => x.air);
await page.waitForTimeout(2000); await tick(4);
let air1 = (await snap()).items.find(x => x.air);
ok('hang', air0 && air1 && air0.y === air1.y, `y ${air0?.y} -> ${air1?.y}`);

await to(mid - T.FALL * 0.33, 4);
const up = (await snap()).items.find(x => x.air);
ok('rise_on_scroll_up', up && up.y < air0.y, `${air0?.y} -> ${up?.y}`);

/* The round trip to y=0 takes item 60 out of the texture window entirely, so coming back needs its
   photograph again — "no pixels, no fall" (03), the same allowance `hang` makes above and for the
   same reason. Under round 9 the window also demolishes the wreck out there, so the return is a
   full refetch rather than a redraw and four ticks stopped being enough: the gate read `undefined`
   and called it a broken mechanic. Bounded, so a photograph that never arrives is still a red. */
await to(0, 3); await to(mid, 4);
for (let i = 0; i < 60 && !(await snap()).items.some(x => x.air); i++) await tick(3);
const back = (await snap()).items.find(x => x.air);
ok('fall_is_a_pure_function', back && Math.abs(back.y - air0.y) < 0.01, `${air0?.y} vs ${back?.y}`);

await to(T.START[probe] - 40, 4);
ok('unmade_above_start', (await snap()).air === 0, 'nothing airborne above its start');

/* ROUND 9 RE-AIMS `contact_latches`, AND IT IS NOT A DELETION. The claim it made — an object past
   its landing is broken for good — is the half Dustin struck. What survives is the other half, and
   it is still worth a gate: THE FORWARD GRAMMAR IS UNCHANGED. Past the landing the object is down
   and broken, exactly as before. What is added is the ruling itself, measured the only way it can
   be: the object 200px back up the page must be in the air AT THE SAME HEIGHT as it is for a
   visitor who never went past it at all. A rewind that merely puts something back in the air is
   not the ruling; a rewind that puts it back where the tables say is. */
await to(T.LAND[probe] + 30, 5);
const hit = (await snap()).items.find(x => x.i === probe);
await to(T.LAND[probe] - 200, 4);
const backUp = (await snap()).items.find(x => x.i === probe);
await fresh();
await to(T.LAND[probe] - 200, 8);            // the same pixel, never having been past it
const virgin = (await snap()).items.find(x => x.i === probe);
ok('contact_is_a_position',
   !!hit && hit.down && !hit.air &&
   !!backUp && backUp.air && !backUp.down &&
   !!virgin && Math.abs(backUp.y - virgin.y) < 0.01,
   !hit || !hit.down ? `never landed at LAND+30`
   : !backUp || !backUp.air ? `still down 200px back up: down=${backUp?.down} air=${backUp?.air}`
   : `down at LAND+30; back in the air 200px up at py=${backUp.y}, and a page that never passed ` +
     `it puts it at ${virgin?.y}`);

/* …and the same treatment for `decay_one_way`, whose name was its whole claim. The forward
   grammar: age rises with the scrollbar. The ruling: it falls back, and returning to the pixel it
   came from restores it EXACTLY — not approximately, because age is now division and not an
   accumulator. */
await fresh();
await to(T.LAND[probe] + T.LIFE[probe] * 0.45, 8);
const ageA = (await snap()).items.find(x => x.i === probe)?.age;
await to(T.LAND[probe] + 10, 4);
const ageB = (await snap()).items.find(x => x.i === probe)?.age;
await to(T.LAND[probe] + T.LIFE[probe] * 0.45, 4);
const ageC = (await snap()).items.find(x => x.i === probe)?.age;
ok('decay_runs_both_ways',
   ageA != null && ageA > 0.4 && ageB != null && ageB < 0.02 && ageC === ageA,
   `age ${ageA} -> ${ageB} on the way back up -> ${ageC} returning to the same pixel`);

/* ---------------- the long sweep: truth gates, from a page nobody has touched ---------------- */
await fresh();
let maxAir = 0;
const groundViol = [], tieCutViol = [], captions = [], lifeViol = [], ghosts = [],
      wholeViol = [], spreadViol = [], lastViol = [];
const survivors = new Set();                 // 14: whose name outlives impact. Must be exactly {N-1}
const aliveCurve = [], tieCurve = [];
let shatterSeen = 0, wholeSeen = 0, nameSeen = 0, lastSeen = 0;
const STEP = 140;
const stops = [];
for (let y = 0; y < T.TOTAL; y += STEP) stops.push(y);
for (const y of [0, 900, 5000, 60000, 3000, 120000, 200, 90000, 140000]) stops.push(y);  // hard jumps
let n = 0;
for (const y of stops) {
  await to(y, 1);
  const s = await snap();
  maxAir = Math.max(maxAir, s.air);
  let nowI = -1;
  for (let i = 0; i < N; i++) { if (T.LAND[i] <= y) nowI = i; else break; }
  const now = T.years[Math.max(0, nowI)];
  const live = s.items.filter(x => x.down);
  aliveCurve.push([y, live.length]);
  tieCurve.push([y, s.ties]);
  for (const it of live) {
    const gap = now - T.years[it.i];
    if (gap > T.W && T.LIFE[it.i] > 1400.5) groundViol.push({ y, i: it.i, gap, end: 'older' });
    /* THE SECOND END, and round 8 is the reason it exists. This gate asked only whether a field
       was too OLD for the counter, so a ground that froze and rode home with the visitor — a 1934
       car lying on the soil under a counter reading 7,000 BCE — could not fail it at any
       threshold. 8,934 years NEWER than the moment, and 41 green gates said the page was fine. */
    if (T.years[it.i] - now > T.W) groundViol.push({ y, i: it.i, gap: T.years[it.i] - now, end: 'newer' });
  }
  // the drawn dash pattern must divide into exactly gap+1 segments
  for (const t of s.tieDash) {
    const truth = T.years[t.i] - T.years[T.TIE[t.i]];       // off the tables, not off the page
    if (t.segments !== truth + 1) tieCutViol.push({ y, i: t.i, drawn: t.segments, truth });
  }

  /* the citation contract and the shatter, measured off the live objects rather than off any
     flag the page keeps about itself */
  const w = await page.evaluate(() => {
    const H = window.__hh, out = [];
    let credNodes = 0;
    for (const el of document.querySelectorAll('#labels .c')) credNodes++;
    let expect = 0, orphans = 0;
    for (const d of H.drops) {
      if (d.atoms && (d.gone || (!d.air && !d.down))) orphans++;
      if (!d.cred) continue;
      if (d.air || (d.down && !d.gone)) expect += d.cred.length;
      const frags = d.pieces.length + d.specks.length;
      const vis = d.cred.filter(a => parseFloat(a.el.style.opacity || '0') > 0).length;
      const txs = d.cred.map(a => a.tx).filter(v => typeof v === 'number');
      const xs = [...d.pieces.map(p => p.x), ...d.specks.map(q => q.x)];
      out.push({
        i: d.i, age: d.age, down: d.down, gone: d.gone, air: d.air, frags, vis,
        specks: d.specks.length, splits: d.splits,          // 14
        total: d.cred.length,
        wordSpan: txs.length ? Math.max(...txs) - Math.min(...txs) : 0,
        fieldSpan: xs.length ? Math.max(...xs) - Math.min(...xs) : 0,
        fieldC: xs.length ? (Math.max(...xs) + Math.min(...xs)) / 2 : 0,
        lineW: d.boxGnd ? d.boxGnd.w : 0,
        nameVis: d.atoms.filter(a => a.cls !== 'c' && parseFloat(a.el.style.opacity || '0') > 0.02).length,
        nameTotal: d.atoms.filter(a => a.cls !== 'c').length
      });
    }
    return { items: out, credNodes, expect, orphans };
  });
  if (w.credNodes !== w.expect || w.orphans) ghosts.push({ y, nodes: w.credNodes, expect: w.expect, orphans: w.orphans });
  for (const it of w.items) {
    if (!it.down || it.gone) continue;
    // 13's ruling, both halves
    if (it.frags > 0 && it.vis < it.total) lifeViol.push({ y, i: it.i, vis: it.vis, of: it.total });
    // still whole before the object's first split
    if (it.age < T.SPLITS[0]) { wholeSeen++; if (it.wordSpan > it.lineW + 4) wholeViol.push({ y, i: it.i, span: it.wordSpan, line: it.lineW }); }
    /* TICKET 14 — the last object never breaks, so it has no wreckage for its words to be as wide
       as. The exemption is exactly one index and is gated by `only_the_last_one_survives` below;
       written as `it.i !== N - 1` rather than as a tolerance, because a tolerance is a hole. */
    if (it.i === N - 1) { lastSeen++; if (it.frags !== 1 || it.specks || it.splits ||
                                          it.vis !== it.total || it.nameVis !== it.nameTotal)
                            lastViol.push({ y, frags: it.frags, specks: it.specks, splits: it.splits,
                                            vis: it.vis, of: it.total, nameVis: it.nameVis }); }
    // as wide as its own wreckage once the object is fully apart (70px is the stated floor)
    if (it.i !== N - 1 && it.age > T.SPLITS[T.SPLITS.length - 1] + 0.06 && it.frags > 0) {
      shatterSeen++;
      const half = Math.max(it.fieldSpan / 2, 70);
      const target = Math.min(VW - 14, it.fieldC + half) - Math.max(14, it.fieldC - half);
      // words sit at (k+0.5)/n of the span, so the outermost pair spans (n-1)/n of it
      const r = it.wordSpan / target;
      if (r < 0.78 || r > 1.12)
        spreadViol.push({ y, i: it.i, span: Math.round(it.wordSpan), target: Math.round(target), r: +r.toFixed(2) });
    }
    /* the name is taken within NAME_OUT and never comes back — TICKET 14 RE-AIMED THIS RATHER THAN
       NARROWING IT. The claim is no longer "no name outlives impact"; it is "the SET of names that
       outlive impact is exactly {the last object}". A gate that simply skipped index N-1 would go
       on passing if a second object stopped breaking; this one cannot. */
    if (it.age > T.NAME_OUT && it.nameVis > 0) survivors.add(it.i);
    if (it.age > 0 && it.age < T.NAME_OUT * 0.7 && it.nameVis > 0) nameSeen++;
  }
  const txt = await page.evaluate(() =>
    [...document.querySelectorAll('#labels span')].map(e => e.textContent).join(' | '));
  if (/YEARS?\s+APART|SAME\s+YEAR/i.test(txt)) captions.push(y);
  if (++n % 200 === 0) process.stdout.write(`  …${n}/${stops.length}\r`);
}
/* AND NOW THE SAME WALK, BACKWARDS. Round 8's durable lesson: a gate has a direction, and a gate
   that only ever walks forward has only ever tested forward. Every stop above was taken descending
   "on a page nobody has touched", which is one visitor; the other one reaches the bottom and comes
   back, and that visitor is the one who found a Neolithic counter over a 1934 car. The down leg
   here is coarse — its only job is to get everything landed, and LIFE_MIN is 1400px so a 500px
   stride cannot skip a life — and the up leg is walked at the same STEP the forward sweep uses. */
const upStops = [];
const wreck = { bytes: 0, pieces: 0, at: 0 };
/* The up walk does NOT wait for photographs at every stop, and `to()` does under `--slow`. That
   wait is right for a gate that reads the page's own opinion of what is on the ground; this one
   compares `T.years[i]` — the TABLE — against the counter, so an arrival whose sprite has not
   landed is still checked and still able to fail. With the wait in, the rewind's constant
   re-admission kept `pending()` above zero at nearly every one of 1,034 stops and the phase ran
   for two hours; without it the phase measures the same thing in ten minutes. The cost is that
   `maxAir` from this direction is a bonus rather than a proof, which the down walk already is. */
const toUp = async y => { await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await tick(1); };
{
  await fresh();
  for (let y = 0; y < T.TOTAL; y += 500) { await to(y, 1); }
  for (let y = T.TOTAL; y > 0; y -= STEP) upStops.push(y);
  let m = 0;
  for (const y of upStops) {
    await toUp(y);
    const s2 = await snap();
    maxAir = Math.max(maxAir, s2.air);
    let nowI = -1;
    for (let i = 0; i < N; i++) { if (T.LAND[i] <= y) nowI = i; else break; }
    const now = T.years[Math.max(0, nowI)];
    for (const it of s2.items.filter(x => x.down)) {
      const older = now - T.years[it.i], newer = T.years[it.i] - now;
      if (older > T.W && T.LIFE[it.i] > 1400.5) groundViol.push({ up: y, i: it.i, gap: older, end: 'older' });
      if (newer > T.W) groundViol.push({ up: y, i: it.i, gap: newer, end: 'newer' });
    }
    /* the wreck's own residency, sampled on the way back up because that is where it is largest:
       the rewind keeps every generation of every object within BACK px of the scrollbar */
    if (m % 5 === 0) { const f = await page.evaluate(() => window.__hh.fragBytes());
                       if (f.bytes > wreck.bytes) { wreck.bytes = f.bytes; wreck.pieces = f.pieces; wreck.at = y; } }
    if (++m % 300 === 0) process.stdout.write(`  up …${m}/${upStops.length}\r`);
  }
}

ok('one_at_a_time', maxAir <= 1, `max airborne ${maxAir} over ${stops.length + upStops.length} stops, both directions`);
ok('ground_is_the_moment', groundViol.length === 0,
   groundViol.length
     ? `${groundViol.filter(v => v.end === 'older').length} older + ` +
       `${groundViol.filter(v => v.end === 'newer').length} NEWER than the counter, worst ` +
       `${Math.max(...groundViol.map(v => v.gap))}y: ${JSON.stringify(groundViol[0])}`
     : `no field more than ${T.W}y from the counter in EITHER direction, over ${stops.length} stops ` +
       `walked down and ${upStops.length} walked back up`);
ok('tie_cuts_are_true', tieCutViol.length === 0,
   `${tieCutViol.length} ties whose drawn segment count is not gap+1`);
ok('no_miss_caption', captions.length === 0,
   captions.length ? `printed at ${captions.slice(0, 3)}` : 'no year phrase printed anywhere');
ok('credit_lives_with_the_last_fragment', lifeViol.length === 0,
   `${lifeViol.length} objects with a fragment on the ground and part of the citation missing`);
ok('credit_never_outlives_it', ghosts.length === 0,
   `${ghosts.length} stops with an orphaned credit node in the DOM`);
ok('credit_is_one_line_until_it_breaks', wholeViol.length === 0,
   `${wholeViol.length} of ${wholeSeen} un-split citations wider than their own line`);
ok('credit_spreads_with_its_wreckage', spreadViol.length === 0,
   `${spreadViol.length} of ${shatterSeen} shattered citations not as wide as their debris`);
ok('name_dies_at_impact', survivors.size === 1 && survivors.has(N - 1) && nameSeen > 0,
   survivors.size !== 1 || !survivors.has(N - 1)
     ? `names alive past ${T.NAME_OUT} of a life: {${[...survivors].join(', ')}} — want exactly {${N - 1}}`
     : `exactly one name outlives impact and it is item ${N - 1}, the ending; ` +
       `the other ${N - 1} all die within ${T.NAME_OUT} of a life; ${nameSeen} caught mid-break`);

/* TICKET 14's evidence from the walk is gathered above; the gate itself is reported after the
   jump phase below, because a walk alone cannot see the defect that matters most here. */

/* ROUND 10 — this page has just walked the entire scroll and taken nine hard jumps. What it is
   still holding is the leak reading, and it has to be taken here, before the next fresh(). */
{
  const r = await page.evaluate(() => {
    const h = window.__hh.held();
    return { n: h.length, px: h.reduce((s, x) => s + x.w * x.h, 0) };
  });
  held.sweptN = r.n; held.sweptPx = r.px; held.stops = stops.length;
}

/* a tie is never drawn with a dead end */
const tieLive = await page.evaluate(() => {
  const bad = [];
  for (const d of window.__hh.drops) {
    if (!d.tie || !d.tie.on) continue;
    const p = window.__hh.drops[d.tie.j];
    if (d.gone || p.gone || !d.down || !p.down) bad.push(d.i);
  }
  return bad;
});
ok('tie_ends_both_live', tieLive.length === 0, `${tieLive.length} ties with a dead end`);

await fresh();                                       // or the jump lands on ground already spent
await to(120000, 6);
const flood = await snap();
ok('jump_does_not_flood', flood.items.filter(x => x.down).length <= 9 && flood.items.length > 0,
   `${flood.items.filter(x => x.down).length} fields alive after a 0 -> 120,000 jump`);

/* ---------------- legibility, measured off the composited pixels ---------------- */
/* 06 item 5. The credit always lies on the baked earth, which never changes value, so the worst
   case is single-ended: the dullest ink on the lightest patch of soil under any word. Sampled
   from the canvas itself, at five points under each word's box, worst point wins. The dying tail
   (age > 0.9) is excluded and named: over the last tenth of a life the citation is fading out
   with the last speck, and a thing on its way out is not a thing being read. */
let worstC = 99, worstAt = null, measured = 0;
for (const at of [T.LAND[96] + 900, T.LAND[140] + 1400, T.LAND[190] + 2000, T.LAND[24] + 600]) {
  await fresh();
  await to(at, 6);
  const r = await page.evaluate(() => {
    const H = window.__hh;
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
    let worst = 99, who = null, count = 0;
    for (const d of H.drops) {
      if (!d.cred || !d.down || d.gone || d.age > 0.9) continue;
      for (const a of d.cred) {
        const o = parseFloat(a.el.style.opacity || '0');
        if (o < 0.05) continue;
        const b = a.el.getBoundingClientRect();
        const m = (a.el.style.color.match(/\d+/g) || [238, 242, 247]).map(Number);
        for (const [dx, dy] of [[0, 0], [-0.35, 0], [0.35, 0], [0, -0.3], [0, 0.3]]) {
          const bg = H.bgAt(b.x + b.width * (0.5 + dx), b.y + b.height * (0.5 + dy));
          const fg = m.map((v, i) => o * v + (1 - o) * bg[i]);
          const l1 = lum(fg), l2 = lum(bg);
          const c = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          count++;
          if (c < worst) { worst = c; who = { t: a.t, o: +o.toFixed(2), bg, fg: fg.map(Math.round) }; }
        }
      }
    }
    return { worst, who, count };
  });
  measured += r.count;
  if (r.worst < worstC) { worstC = r.worst; worstAt = r.who; }
}
ok('credit_contrast', worstC >= 4.5,
   `worst ${worstC.toFixed(2)}:1 over ${measured} samples — ${JSON.stringify(worstAt)}`);

/* ---------------- frozen ---------------- */
/* The warm-up shot is not a weakening: the first screenshot after a scroll forces a paint the
   rAF ticks had not yet flushed, so shot 1 is mid-settle no matter what the page does. The claim
   under test is shot 2 vs shot 3 across two seconds of wall clock. */
await fresh();
await to(T.START[90] + 200, 6);
let s1 = await page.screenshot(), settled = false;
for (let i = 0; i < 6 && !settled; i++) {
  const nx = await page.screenshot();
  settled = Buffer.compare(s1, nx) === 0; s1 = nx;
}
await page.waitForTimeout(2000);
const s2 = await page.screenshot();
ok('frozen_when_idle', settled && Buffer.compare(s1, s2) === 0,
   settled ? 'screenshot identical after 2s of wall clock' : 'never settled — something is on a clock');

/* ---------------- the collision contract ---------------- */
const boxes = () => page.evaluate(() => {
  const r = [];
  for (const el of document.querySelectorAll('#labels span:not(.sr)')) {
    if (parseFloat(el.style.opacity || '0') < 0.05) continue;
    const b = el.getBoundingClientRect();
    if (b.width) r.push({ x: b.x, y: b.y, w: b.width, h: b.height, t: el.textContent });
  }
  /* TICKET 14 — the signature goes IN this set rather than beside it. It is a fixed pill in the
     bottom-right corner, which is inside the soil band the newest citations are written in, and
     11's contract has no furniture exemption. Putting it in `boxes()` means the existing
     ship gate covers it at both viewports across the whole scroll, for nothing. */
  const m = document.getElementById('mark');
  if (m) {
    const cs = getComputedStyle(m);
    if (cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05) {
      const b = m.getBoundingClientRect();
      if (b.width) r.push({ x: b.x, y: b.y, w: b.width, h: b.height, t: '«the signature»' });
    }
  }
  /* TICKET 07 — and the intro, on the identical argument, which nobody had made for it. The
     headline and its paragraph are words on the same screen as the first citations and they were
     outside every collision gate on this site; a probe found them printed through each other at
     both viewports on copy that had been in the page for two rounds. The INK is measured, never
     `#intro` — that box is mostly padding, and holding it would report overlaps a reader cannot
     see. `#intro`'s opacity is the one that fades; the children do not carry their own. */
  const intro = document.getElementById('intro');
  const introO = intro ? parseFloat(getComputedStyle(intro).opacity) : 0;
  if (introO > 0.05) for (const el of [intro.querySelector('h1'), document.getElementById('introp')]) {
    const b = el.getBoundingClientRect();
    if (b.width) r.push({ x: b.x, y: b.y, w: b.width, h: b.height, t: '«the intro»' });
  }
  const hint = document.getElementById('hint');
  if (hint && parseFloat(getComputedStyle(hint).opacity) > 0.05) {
    const b = hint.getBoundingClientRect();
    if (b.width) r.push({ x: b.x, y: b.y, w: b.width, h: b.height, t: '«the hint»' });
  }
  return r;
});
let worst = null;
/* TICKET 07 — the prologue is walked at 20px and the rest at 500.
   The intro is only on screen for the first 460px, and a 500px stride puts exactly ONE sample in
   that window, at y=0, where nothing has fallen far enough to reach the words. With the intro's
   reservation deleted the label riding the first object prints straight through the headline at
   y=400, and this gate said 41/41 green. A stride chosen for a 144,632px scroll cannot also be the
   stride for the 460px where all of the furniture lives. */
const introEnd = await page.evaluate(() => window.__hh.START[0] + window.__hh.FALL);
const STOPS = [];
for (let y = 0; y <= introEnd; y += 20) STOPS.push(y);
for (let y = 500; y < T.TOTAL; y += 500) STOPS.push(y);
for (const [w, h] of [[1440, 900], [390, 844]]) {
  await page.setViewportSize({ width: w, height: h });
  await fresh();
  let coll = 0, ovf = 0, samples = 0, maxBoxes = 0;
  for (const y of STOPS) {
    await to(y, 1);
    samples++;
    const bs = await boxes();
    maxBoxes = Math.max(maxBoxes, bs.length);
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const A = bs[i], B = bs[j];
      if (A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h && B.y < A.y + A.h) {
        coll++; if (!worst) worst = { w, y, A, B };
      }
    }
    if (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) > 0) ovf++;
  }
  ok(`no_text_collision_${w}`, coll === 0, `${coll} overlaps over ${samples} stops, max ${maxBoxes} words on screen`);
  ok(`no_h_overflow_${w}`, ovf === 0, `${ovf} stops with horizontal overflow`);
}

/* ---------------- TICKET 14 — the signature's corner, on purpose rather than by luck ----------

   `no_text_collision_390` DID catch the reservation being deleted — once. On a re-run of the same
   perturbation it caught nothing, because one overlap over 290 stops taken a single rAF apart is a
   knife-edge: how far a citation has spread at a given stop depends on how much of the cutting
   queue has drained, and that is machine timing. **A detector that finds the defect on one run in
   two is not a gate**, which is round 12's whole lesson arriving inside the round that learned it.

   So the corner gets its own reading: the phone, through the crowded tail where the citations are
   most numerous and the pill has the most competition, settled properly at each stop. It asserts
   the thing that matters — no word ever intersects the mark — and it also reports HOW CLOSE the
   nearest word got, because a zero-overlap result over a corner nothing ever reaches would prove
   nothing at all. If that clearance is large, the reservation is not what is keeping the corner
   clear and this gate is the decoration, not the guard. */
await page.setViewportSize({ width: 390, height: 844 });
await fresh();
let sigHit = 0, nearest = 1e9, contested = 0, sigStops = 0;
for (let y = Math.round(T.TOTAL * 0.55); y < T.TOTAL; y += 260) {
  await to(y, 3);
  sigStops++;
  const r = await page.evaluate(() => {
    const m = document.getElementById('mark');
    const cs = getComputedStyle(m);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return null;
    const b = m.getBoundingClientRect();
    let hit = 0, near = 1e9;
    for (const el of document.querySelectorAll('#labels span:not(.sr)')) {
      if (parseFloat(el.style.opacity || '0') < 0.05) continue;
      const a = el.getBoundingClientRect();
      if (!a.width) continue;
      if (a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height) hit++;
      const dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width), 0);
      const dy = Math.max(b.y - (a.y + a.height), a.y - (b.y + b.height), 0);
      near = Math.min(near, Math.hypot(dx, dy));
    }
    return { hit, near };
  });
  if (!r) continue;
  sigHit += r.hit;
  if (r.near < nearest) nearest = r.near;
  if (r.near < 24) contested++;
}
ok('signature_keeps_its_corner_clear', sigHit === 0 && contested > 0,
   sigHit ? `${sigHit} words intersect the signature over ${sigStops} phone stops`
     : contested === 0 ? `0 overlaps, but no word came within 24px over ${sigStops} stops — ` +
                         `this corner is never contested and the gate proves nothing`
     : `0 words intersect the mark over ${sigStops} phone stops through the crowded tail; ` +
       `nearest approach ${nearest.toFixed(1)}px, and ${contested} stops had a word inside 24px`);
if (worst) console.log('  first overlap:', JSON.stringify(worst));

/* ---------------- frame budget ---------------- */
await page.setViewportSize({ width: 1440, height: 900 });
await fresh();
const run = () => page.evaluate(async () => {
  const ts = []; let y = 0;
  return await new Promise(res => {
    let last = performance.now();
    const step = () => { const now = performance.now(); ts.push(now - last); last = now;
      y += 55; scrollTo({ top: y, behavior: 'instant' });
      if (ts.length < 400) requestAnimationFrame(step); else res(ts.slice(20)); };
    requestAnimationFrame(step);
  });
});
const pass = async () => {
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const t = (await run()).sort((a, b) => a - b);
  return [t[Math.floor(t.length / 2)], t[Math.floor(t.length * 0.95)]];
};

/* ROUND 9 CHANGES THIS MEASUREMENT, AND NAMES WHY — the same correction round 8 made one level
   down. Round 8 timed one cold pass and gated the worse of two warm ones, which is sound on an
   idle machine and noise on a busy one: this laptop sits around 60% background load from other
   applications, and the WORSE of two passes measures whatever else was scheduled that second. It
   red-flagged the texture-window arm at 29.1ms, and an A/B against the shipped round-8 build in
   one alternating window floored both builds at 17.9 / 18.0ms.

   So: five passes, the first printed as cold, and the gate takes the FLOOR of the four warm ones.
   This is not a weakening. p95 WITHIN a pass still catches every spike the page itself produces
   over 380 frames; the floor ACROSS identical passes only removes the other processes. A real
   regression raises the floor — that is exactly how the A/B above measured the backdrop at
   +0.1ms. The spread is printed so a widening one is never hidden by the number that passed. */
const runs = async (n) => { const o = []; for (let i = 0; i < n; i++) o.push(await pass()); return o; };
const fmtms = w => `floor ${Math.min(...w.map(p => p[1])).toFixed(1)}ms, worst pass ${Math.max(...w.map(p => p[1])).toFixed(1)}ms`;
const all = await runs(5), cold = all[0], warm = all.slice(1);
const med = Math.min(...warm.map(p => p[0])), p95 = Math.min(...warm.map(p => p[1]));
ok('frame_budget', p95 < 25,
   `warm median ${med.toFixed(1)}ms p95 ${fmtms(warm)}; cold first pass ${cold[0].toFixed(1)}/${cold[1].toFixed(1)}ms (all of prep(), once)`);

/* ================= ROUND 10 — the texture window, ticket 03 ===============================

   04's standing gate resampled every sprite to 396px inside the page and reported 163MB. That
   arm is retired here, because the thing it stood in for now exists: the shipped files are baked
   at the height they are drawn, and residency is bounded. Both halves are measured off the page
   rather than off the bake script's own arithmetic.

   THE GATE'S DEFINITION, stated: decoded bytes = w x h x 4 summed over the image references the
   page is holding — Deep Time's accounting, and the one 04's 301MB and 163MB were quoted in.
   The browser's own decoded-image cache may keep evictable copies past a release; nothing here
   claims otherwise, and nothing here depends on it. */

const GATE = 80;                                    // MB, the ceiling Deep Time shipped against

/* 1. Every shipped sprite, all 230, in a page of their own — the whole-set number, and the one
      claim the bake makes: no photograph is taller than the height it is drawn at. Read off the
      files the page actually fetches, in a page that is closed straight after. */
const audit = await (async () => {
  const p2 = await browser.newPage({ viewport: { width: 400, height: 300 } });
  await p2.goto(URL, { waitUntil: 'load' });
  await p2.waitForFunction(() => window.__hh && window.__hh.drops.length, null, { timeout: 60000 });
  const r = await p2.evaluate(async () => {
    const H = window.__hh;
    const all = await Promise.all(H.drops.map(d => new Promise(res => {
      const im = new Image();
      im.onload = () => res({ k: d.it.k, w: im.naturalWidth, h: im.naturalHeight });
      im.onerror = () => res({ k: d.it.k, w: 0, h: 0 });
      im.src = `img/${d.it.k}.webp`;
    })));
    return { all, cap: H.DRAW_H * H.DPR_CAP, DRAW_H: H.DRAW_H, DPR_CAP: H.DPR_CAP, AHEAD: H.AHEAD, BACK: H.BACK };
  });
  await p2.close();
  return r;
})();
const overCap = audit.all.filter(s => s.h > audit.cap);
const broken = audit.all.filter(s => !s.w);
const allMB = audit.all.reduce((s, x) => s + x.w * x.h * 4, 0) / 1048576;
ok('sprite_never_exceeds_its_draw', overCap.length === 0 && broken.length === 0,
   broken.length ? `${broken.length} sprites failed to load`
   : `0 of ${audit.all.length} taller than ${audit.cap}px (${audit.DRAW_H} drawn x dpr ${audit.DPR_CAP}); ` +
     `all ${audit.all.length} resident would be ${allMB.toFixed(1)}MB`);

/* 2. The ceiling itself: the most decoded image bytes the page ever held, over every stop the
      long sweep made — including the nine hard jumps. `peakHeld` is accumulated in the page from
      the live references, not from a tally the page keeps about its own intentions. */
await absorb();
const peakMB = held.peakPx * 4 / 1048576;
ok('decoded_under_the_gate', peakMB < GATE,
   `peak ${peakMB.toFixed(1)}MB held across every page this sweep opened, against a ${GATE}MB gate ` +
   `(${allMB.toFixed(1)}MB if every sprite were resident, 301.2MB before the bake)`);

/* 3. It does not accumulate. The reading taken on the way out of the page that made all 1,043
      stops: the resident set is still one window, not a page's worth of photographs never let go. */
/* The bound is the window itself, not a taste number: everything whose start lies within AHEAD of
   the scrollbar, at the tightest arrival spacing, plus the one in the air and the one landing.

   ROUND 9 WIDENS IT, AND WIDENING IT IS THE POINT. The rewind holds a photograph for BACK px past
   its own landing so that scrolling back into a fall does not have to re-fetch it — without that
   the object fell invisibly, which is how the omission was found. So the span is AHEAD + FALL +
   BACK rather than AHEAD, and the count roughly doubles: ruling 8a's "at most ten resident becomes
   at most twenty". The gate is recomputed from the constants the page exports rather than from a
   number typed here, so it cannot drift away from what the page actually does. */
/* THE BOUND IS THE RULING'S, NOT THE CODE'S. Deriving it from `audit.BACK` made the gate a
   tautology: raise BACK and the allowance rises with it, so `teeth04r9 back_is_unbounded` set BACK
   to 400,000 — residency for the whole page — and NOTHING went red. (The memory gates could not
   save it either: all 230 sprites decode to 65.8MB, under the 80MB ceiling, which is exactly 03
   round 10's "a count is not a ceiling" — at 01's 400-item bound it is 114MB and over.) Ruling 8a
   fixed a 4,000px SYMMETRIC window and costed it; that number is what the gate holds the page to,
   and BACK itself is asserted against it so that changing the constant is the red. */
const RULED = 4000;                                 // ruling 8a's window, both ends
const WINDOW = Math.ceil((RULED + T.FALL + RULED) / Math.min(...T.PER)) + 2;
ok('sprite_window_does_not_leak', held.sweptN <= WINDOW && audit.AHEAD <= RULED && audit.BACK <= RULED,
   `${held.sweptN} sprites held (${(held.sweptPx * 4 / 1048576).toFixed(1)}MB) after ${held.stops} stops ` +
   `over the full ${Math.round(T.TOTAL)}px, against a window of ${WINDOW} ` +
   `(the ruling's ${RULED} + FALL ${T.FALL} + ${RULED} over the tightest spacing ${Math.min(...T.PER)}; ` +
   `the page's AHEAD is ${audit.AHEAD} and BACK is ${audit.BACK}, both of which must be <= ${RULED})`);

/* 3b. THE WRECK IS A WINDOW TOO — 04 round 9. The photographs are bounded above by `AHEAD + FALL
      + BACK`; the fragments are bounded by `LIFE + BACK`, and they are a second resident set that
      did not exist as a bound before the rewind, because a shattered object used to be released
      the instant it finished breaking. Ruling 8a costed the whole rewind at 7.7 MB against the
      80 MB gate, and this is the half of that number nothing was measuring. Sampled on the UP
      walk, where the set is at its largest. */
ok('wreck_window_does_not_leak', wreck.bytes / 1048576 < GATE,
   `peak ${(wreck.bytes / 1048576).toFixed(2)}MB of fragment canvases (${wreck.pieces} pieces across ` +
   `every generation of every live object, at y=${Math.round(wreck.at)}) against a ${GATE}MB gate`);

/* 4. The invariant the whole window rests on. prep() solves the exact height of contact off the
      real silhouette, so a landing solved without its own photograph would put the object down
      somewhere else — and the same scroll position would then draw two different frames
      depending on what had finished loading. The counter sits inside prep(). */
ok('landing_is_solved_from_the_silhouette', held.blind === 0,
   `${held.blind} landings solved without their own photograph, summed over every page opened`);

/* 5. A jump costs what it shows. 0 -> 120,000px passes 183 arrivals and puts seven on the
      ground; the window must fetch the seven and not the 183. Counted off the browser's own
      resource timing, on a page that has been nowhere else. */
await fresh();
await to(120000, 8);
for (let i = 0; i < 40 && (await page.evaluate(() => window.__hh.pending())) > 0; i++) await tick(3);
const cost = await page.evaluate(() => ({
  fetched: performance.getEntriesByType('resource').filter(e => /\/img\/.*\.webp$/.test(e.name)).length,
  shown: window.__hh.drops.filter(d => d.down && !d.gone).length,
  passed: window.__hh.drops.filter(d => d.gone).length
}));
ok('jump_costs_what_it_shows', cost.fetched < 40,
   `${cost.fetched} photographs fetched for a 0 -> 120,000 jump that passed ${cost.passed} arrivals ` +
   `and put ${cost.shown} on the ground`);

/* ---------------- TICKET 14 — THE ENDING, and the gate that stops it becoming a licence -------

   Two readings, and the SECOND ONE IS THE ONE THAT MATTERS. The walk above sees the last object at
   every stop past its landing and asserts it is whole; that half was green from the first run.

   But `the_ending_never_lands` — the perturbation that restores 03's texture-window bound for the
   last object, which is the defect this round actually shipped — DID NOT GO RED against the walk,
   and the reason is the walk itself. A continuous sweep passes through `LAND[229]` while the
   sprite is still inside the window, so the object lands normally and is whole at every stop the
   walk takes. The defect only exists for a visitor who ARRIVES at the end rather than scrolls to
   it: jump straight past the release point and the photograph was never held, "no pixels, no fall"
   refuses the landing, and the piece ends on an object still in the air. **That is how a scrollbar
   drag reaches the ending**, which makes it the common case rather than the corner one.

   So the ending is also read after a hard jump to TOTAL on a page that has been nowhere else. */
await fresh();
await to(T.TOTAL, 8);
for (let i = 0; i < 60 && (await page.evaluate(() => window.__hh.pending())) > 0; i++) await tick(3);
await tick(6);
const ending = await page.evaluate(() => {
  const d = window.__hh.drops[window.__hh.drops.length - 1];
  return { down: d.down, gone: d.gone, pieces: d.pieces.length, specks: d.specks.length,
           splits: d.splits, hasWords: !!d.atoms,
           nameVis: d.atoms ? d.atoms.filter(a => a.cls !== 'c' && +a.el.style.opacity > 0.02).length : 0,
           credVis: d.cred ? d.cred.filter(a => +a.el.style.opacity > 0.02).length : 0,
           credTotal: d.cred ? d.cred.length : 0 };
});
const jumpOK = ending.down && !ending.gone && ending.pieces === 1 && ending.specks === 0 &&
               ending.splits === 0 && ending.nameVis > 0 && ending.credVis === ending.credTotal &&
               ending.credTotal > 0;
ok('only_the_last_one_survives', lastViol.length === 0 && lastSeen > 0 && jumpOK,
   lastViol.length ? `walk: ${JSON.stringify(lastViol[0])}`
     : !jumpOK ? `jumped straight to TOTAL and the ending is ${JSON.stringify(ending)}`
     : `item ${N - 1} whole at all ${lastSeen} stops of the walk AND after a hard jump to TOTAL — ` +
       `1 piece, 0 specks, 0 splits, ${ending.nameVis} name words and ${ending.credVis}/${ending.credTotal} ` +
       `citation words standing`);

/* 6. The window is not a clock. Two independent first visits jump to the same position, wait for
      the same quiescence, and must agree about what is on the ground — if which frame a sprite
      arrived on could change the piece, these two would differ. It caught a real one: arrivals
      were landing in fetch order, so an arrival whose partner had not come back yet drew no tie,
      and the tie set differed between two first visits.

      A SCREENSHOT COMPARISON AGAIN, AND 04 ROUND 9 IS WHAT PAID FOR IT. Round 10 wanted this and
      could not have it: two things on the page were wall-clock by design — `Dust.impact` seeded
      by `Math.random`, and a 4 ms cut budget that decided whether the newest arrival's shards had
      split yet — so the shipped build failed a pixel comparison of two first visits, and the gate
      had to fall back to a structural claim. Both are gone: the spray is seeded off the arrival's
      index and the generation is read off `age` with the budget reduced to scheduling. So the
      claim is the strong one it was always meant to be — two first visits are THE SAME PICTURE —
      and the structural comparison is kept alongside it, because a pixel diff says "different"
      without saying what. */
const state = async (y) => {
  await fresh();
  await to(y, 8);
  for (let i = 0; i < 60; i++) {
    const s = await page.evaluate(() => ({ p: window.__hh.pending(), q: window.__hh.queue.length }));
    if (!s.p && !s.q) break;
    await tick(3);
  }
  await tick(8);
  return await page.evaluate(() => window.__hh.drops.filter(d => d.down && !d.gone).map(d => [
    d.i, +d.age.toFixed(6), d.splits, d.dusted ? 1 : 0, d.tie ? d.tie.j : -1,
    d.pieces.length, d.specks.length, d.cred ? d.cred.length : 0,
    +d.px.toFixed(3), +d.py.toFixed(3),
  ].join('/')));
};
/* TWO POSITIONS, AND THE SECOND ONE IS THE WHOLE POINT. At y=96,000 every live object landed
   hundreds of pixels ago, so its impact spray is long spent and draws nothing — a pixel comparison
   taken only there is blind to the dust, which is the largest of the three wall clocks round 9
   deleted. Proved rather than reasoned: `teeth04r9 dust_unseeded_again` puts `Math.random` back and
   this gate stayed GREEN, while `pure_function` caught it. A gate that cannot go red for the reason
   it was written is a decoration. The second stop is 120px past a landing, where the spray is still
   in the air. */
const DUSTY = T.LAND[150] + 120;
const runA = await state(96000), shotA = await page.screenshot();
const runB = await state(96000), shotB = await page.screenshot();
const dustA = await state(DUSTY), shotDA = await page.screenshot();
const dustB = await state(DUSTY), shotDB = await page.screenshot();
const disagree = runA.filter((r, k) => r !== runB[k])
                     .concat(dustA.filter((r, k) => r !== dustB[k]));
const samePixels = Buffer.compare(shotA, shotB) === 0 && Buffer.compare(shotDA, shotDB) === 0;
ok('window_is_not_a_clock', runA.length === runB.length && disagree.length === 0 && samePixels,
   disagree.length || runA.length !== runB.length
     ? `two first visits disagreed on ${disagree.length} of ${runA.length}: ${disagree.slice(0, 2).join(' | ')}`
   : !samePixels
     ? `two first visits agree on all ${runA.length} arrivals structurally and STILL differ as pixels`
     : `two first visits are pixel-identical at y=96,000 AND ${Math.round(DUSTY)} (120px past a ` +
       `landing, spray still in the air), and agree on all ${runA.length} arrivals down — ` +
       `index, age, splits, dust, tie partner, fragments, specks, words and position`);

/* 7. THE WHOLE PAGE IS A PURE FUNCTION OF SCROLL, not just the fall. 04 round 6's `pure_function`
      checked one number — the height of one object, after a round trip to y=0 — because that was
      the only thing the ruling covered. Ruling 8b covers everything after impact too, so the gate
      covers everything: at four positions spread over the page, every arrival's age, generation,
      dust state, tie, and THE POSITION AND ROTATION OF EVERY FRAGMENT AND EVERY SPECK, plus the
      canvas pixels and the label layer's HTML, walked to directly and then walked to again from
      9,000px further down.

      WHY NOT A SCREENSHOT HERE, when the gate above is one. Measured, not assumed: after a
      105,000px round trip the composite differs from the direct walk by one RGB unit on ~27,800
      glyph pixels — while the canvas is pixel-identical, the label layer's HTML is byte-identical,
      and all 87 in-viewport elements match on rect, opacity, transform, colour and font. Hiding
      either layer makes the two screenshots identical and hiding neither does not, which places
      the difference in the compositor rather than in anything the page decides. The canvas and the
      DOM are what the page controls, so they are what is gated; a screenshot here would be
      measuring Chromium's text rasteriser. */
/* SAMPLE A SETTLED PAGE, NOT A LOADING ONE. Under `--slow` this gate read 10 built objects on the
   direct walk and 9 on the return and called the page route-dependent. It was not: the missing one
   was item 12, `gone`, no fragments, drawing nothing — the window had re-admitted it and its
   photograph was still in flight, which is "no pixels, no fall" (03) and a legitimate transient
   rather than a state. Given the wait, both routes land on the same ten. Same quiescence the
   `window_is_not_a_clock` gate above already takes, and for the same reason. */
const quiesce = async () => {
  for (let i = 0; i < 60; i++) {
    const s = await page.evaluate(() => ({ p: window.__hh.pending(), q: window.__hh.queue.length }));
    if (!s.p && !s.q) break;
    await tick(3);
  }
  await tick(8);
};
const fullState = () => page.evaluate(() => ({
  objs: window.__hh.drops.filter(d => d.built).map(d => [
    d.i, +d.age.toFixed(6), d.splits, d.dusted ? 1 : 0, d.gone ? 1 : 0, d.tie ? d.tie.j : -1,
    d.pieces.map(q => `${q.x.toFixed(3)},${q.y.toFixed(3)},${q.rot.toFixed(4)}`).join(';'),
    d.specks.map(q => `${q.x.toFixed(3)},${q.y.toFixed(3)}`).join(';'),
    d.dust ? d.dust.map(q => `${q.x.toFixed(3)},${q.y.toFixed(3)},${q.t}`).join(';') : ''
  ].join('/')),
  canvas: (() => { const d = window.__hh.px(0, 0, innerWidth, innerHeight);
    let h = 0; for (let i = 0; i < d.data.length; i++) h = (h * 31 + d.data[i]) >>> 0; return h; })(),
  html: document.getElementById('labels').outerHTML
}));
{
  const bad = [];
  for (const y of [12000, 47000, 96000, 130000]) {
    await fresh();
    for (let v = 0; v < y; v += 300) { await page.evaluate(t => scrollTo({ top: t, behavior: 'instant' }), v); await tick(1); }
    await to(y, 10); await quiesce();
    const direct = await fullState();
    for (let v = y; v < y + 9000; v += 300) { await page.evaluate(t => scrollTo({ top: t, behavior: 'instant' }), v); await tick(1); }
    for (let v = y + 9000; v > y; v -= 300) { await page.evaluate(t => scrollTo({ top: t, behavior: 'instant' }), v); await tick(1); }
    await to(y, 10); await quiesce();
    const returned = await fullState();
    const rows = direct.objs.filter((r, k) => r !== returned.objs[k]).length;
    if (rows || direct.objs.length !== returned.objs.length ||
        direct.canvas !== returned.canvas || direct.html !== returned.html)
      bad.push(`y=${y}: ${rows} objects differ, canvas ${direct.canvas === returned.canvas ? 'same' : 'DIFFERS'}, ` +
               `labels ${direct.html === returned.html ? 'same' : 'DIFFER'}`);
  }
  ok('pure_function', bad.length === 0,
     bad.length ? bad.join(' | ')
       : `four positions walked to directly and again from 9,000px below: every fragment, speck and ` +
         `dust particle in the same place, canvas pixels identical, label layer byte-identical`);
}

await page.setViewportSize({ width: 1440, height: 900 });
ok('no_console_errors', errors.length === 0, errors.slice(0, 3).join(' | ') || 'clean');

/* ================= ROUND 9 — the dated backdrop, ticket 06 item 4 =========================

   The claim being tested is exactly the ruling: the backdrop is THE LIGHT, and the earth is not
   touched. Everything here is measured off composited canvas pixels, because "the sky changed"
   and "the ground did not" are both statements about pixels and neither is a statement the page
   is allowed to make about itself. */

await page.setViewportSize({ width: 1440, height: 900 });

/* Every reading of the sky is taken with NOTHING IN THE AIR. An object crosses the whole sky on
   its way down, so a photograph in the sample region is counted as sky — the first cut of these
   gates read 1,775 "stars" at an era whose star field is identical to another era's 1,362, and
   the difference was one falling sprite's edges. The beat between two arrivals is 60–200px of
   scroll with an empty sky, so it is always reachable from any stop by walking forward. */
const settle = async (y0) => {
  await to(y0, 6);
  for (let k = 0; k < 40 && (await snap()).air > 0; k++) await to(y0 + k * 18, 2);
  return (await snap()).air === 0;
};

/* five stops spanning the ramp, each on a page nobody has scrolled — the head has to be a first
   visit or its objects are already dust and there is nothing on the ground to sample past */
const ERAS = [6, 40, 150, 196, 226];
const skyRead = [];
for (const i of ERAS) {
  await fresh();
  if (!await settle(T.LAND[i] + T.LIFE[i] * 0.3)) throw new Error(`era ${i}: never found an empty sky`);
  skyRead.push(await page.evaluate(async () => {
    const H = window.__hh, gy = H.groundY();
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };

    /* Impact dust is drawn OVER the soil and over the low sky, and it is frozen wherever the
       scrollbar left it. The harness clears the particle set and lets one frame redraw without
       it: dust is not dated, it is not the earth, and it is the only thing between the two.
       Nothing respawns it — dust is made at impact and an impact needs forward scroll. */
    const dustWas = H.dustN();
    H.clearDust();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    /* The sky, away from the lit pool's centre so the number is the AIR and not the lamp. Summed
       across the channels rather than weighted into luminance: 13's colour ramp is not monotone
       in luminance — phosphor is a bright green and LED is a dim blue, and a luminance test
       therefore reads 1974 as a lighter sky than 2015 and calls the ramp broken. What is claimed
       is that there is MORE LIGHT IN THE AIR, and value, not perceived brightness, is that. */
    const sky = [[120, 40], [1320, 40], [120, gy * 0.5], [1320, gy * 0.5]]
      .map(([x, y]) => H.bgAt(x, y).reduce((s, v) => s + v, 0));

    /* stars: pixels in the top third of the sky brighter than the sky immediately right of them.
       One rectangle read, scanned every pixel — a 1px star on a 3px grid is mostly missed. */
    let stars = 0;
    {
      const d = H.px(0, 6, innerWidth, gy * 0.33), r = d.width * 4;
      for (let yy = 0; yy < d.height; yy++)
        for (let xx = 0; xx + 8 < d.width; xx++) {
          const a = yy * r + xx * 4, b = a + 32;
          if (d.data[a] + d.data[a + 1] + d.data[a + 2] > d.data[b] + d.data[b + 1] + d.data[b + 2] + 26) stars++;
        }
    }

    /* the earth. Sampled at the local surface so the columns follow the land, and deep enough to
       clear the tie band, which is never more than 20px under it. */
    const soil = [];
    for (let x = 60; x < innerWidth - 60; x += 137)
      for (const d of [80, 140, 200]) soil.push(H.bgAt(x, H.surfAt(x) + d).join('/'));

    /* the HUD sits on the sky, and the sky is the surface that just started moving */
    let hud = 99;
    for (const sel of ['#hud .num', '#hud .era']) {
      const el = document.querySelector(sel), b = el.getBoundingClientRect();
      const m = getComputedStyle(el).color.match(/\d+/g).map(Number);
      for (const [fx, fy] of [[0.15, 0.5], [0.5, 0.4], [0.85, 0.6]]) {
        const bg = H.bgAt(b.x + b.width * fx, b.y + b.height * fy);
        const l1 = lum(m), l2 = lum(bg);
        hud = Math.min(hud, (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
      }
    }
    return { reach: H.reach(), sky: Math.max(...sky), soil, stars, hud, dustWas };
  }));
}
ERAS.forEach((i, k) => console.log(`  era item ${String(i).padStart(3)} y=${String(T.years[i]).padStart(5)}  reach ${skyRead[k].reach.toFixed(3)}  sky-value ${skyRead[k].sky}  star-px ${skyRead[k].stars}  hud ${skyRead[k].hud.toFixed(2)}:1  dust cleared ${skyRead[k].dustWas}`));

/* 1. The sky is dated, and the test is against `reach` rather than against a straight line:
      wherever the light of the age got further the sky has more light in it, and wherever it did
      not — 3500 BCE and 100 BCE had the same lamp — the sky is the SAME. That second half is what
      makes this catch a frozen backdrop, and it is also the honest claim: nothing changed between
      those two dates. */
const dateBad = [];
for (let k = 1; k < skyRead.length; k++) {
  const dr = skyRead[k].reach - skyRead[k - 1].reach, ds = skyRead[k].sky - skyRead[k - 1].sky;
  if (dr > 0.01 && ds <= 4) dateBad.push(`${ERAS[k - 1]}→${ERAS[k]}: reach +${dr.toFixed(2)} but sky ${ds >= 0 ? '+' : ''}${ds}`);
  if (dr <= 0.01 && ds !== 0) dateBad.push(`${ERAS[k - 1]}→${ERAS[k]}: same lamp, sky moved ${ds}`);
}
const skySpan = skyRead[skyRead.length - 1].sky / Math.max(1, skyRead[0].sky);
ok('backdrop_is_dated', dateBad.length === 0 && skySpan > 4,
   dateBad.length ? dateBad.join(' | ')
     : `sky value tracks reach at every step, ×${skySpan.toFixed(1)} from firelight to LED`);

// 2. THE 13 GUARD. Whatever the sky did, the earth did not do it.
const soilRef = skyRead[0].soil;
const soilBad = [];
skyRead.forEach((r, k) =>
  r.soil.forEach((v, j) => { if (v !== soilRef[j]) soilBad.push(`era ${ERAS[k]} px${j}: ${v} vs ${soilRef[j]}`); }));
ok('ground_never_dates', soilBad.length === 0,
   soilBad.length ? soilBad.slice(0, 3).join(' | ')
                  : `${soilRef.length} earth pixels byte-identical across all ${ERAS.length} eras`);

// 3. the stars go out as the skyglow comes up, and they are gone in the electric era
const starOK = skyRead[0].stars > 60 && skyRead[skyRead.length - 1].stars === 0 &&
               skyRead.every((r, k) => k === 0 || r.stars <= skyRead[k - 1].stars);
ok('stars_go_out', starOK,
   `star pixels ${skyRead.map(r => r.stars).join(' → ')} across firelight → LED`);

// 4. the HUD lies on the sky, and the sky is the thing that just started changing
const hudWorst = Math.min(...skyRead.map(r => r.hud));
ok('hud_contrast', hudWorst >= 4.5,
   `worst ${hudWorst.toFixed(2)}:1 over the HUD number and era name at all ${ERAS.length} eras`);

/* 5. The backdrop is a function of the scrollbar and of nothing else — the same position twice,
      reached two different ways, and then two seconds of wall clock on top.

      Sampled only in the upper 45% of the sky, and only with nothing in the air: shards from an
      impact arc a few dozen px off the soil and settle, and where they settle depends on how the
      scrollbar got there, not only on where it is. That is 04's ruling working as designed and
      not a claim this gate makes — it is about the sky. Reading the low sky here failed on
      exactly that and the finding was the harness's, not the page's. */
await fresh();
const atY = T.LAND[150] + T.LIFE[150] * 0.3;
const skyPx = () => page.evaluate(() => {
  const H = window.__hh, gy = H.groundY(), o = [];
  for (let x = 40; x < innerWidth; x += 70)
    for (const f of [0.03, 0.16, 0.30, 0.45]) o.push(H.bgAt(x, gy * f).join('/'));
  return o.join(' ');
});
if (!await settle(atY)) throw new Error('scroll-only: never found an empty sky');
const atSettled = await page.evaluate(() => scrollY);
const skyA = await skyPx();
await to(atSettled + 40000, 4); await to(0, 4); await to(atSettled, 8);
const skyB = await skyPx();
await page.waitForTimeout(1500); await tick(4);
const skyC = await skyPx();
ok('backdrop_is_scroll_only', skyA === skyB && skyB === skyC,
   skyA !== skyB ? 'the same scroll position drew two different skies'
   : skyB !== skyC ? 'the sky moved on wall clock with the scrollbar still'
   : 'the same scroll position draws the same sky, twice, and does not drift on wall clock');

/* ---------------- shape ---------------- */
aliveCurve.sort((a, b) => a[0] - b[0]); tieCurve.sort((a, b) => a[0] - b[0]);
const at = y => aliveCurve.filter(([yy]) => yy <= y).pop()?.[1] ?? 0;
const headMax = Math.max(...aliveCurve.filter(([y]) => y <= T.START[24]).map(x => x[1]));
const bodyMed = (() => {
  const v = aliveCurve.filter(([y]) => y >= T.START[120]).map(x => x[1]).sort((a, b) => a - b);
  return v[Math.floor(v.length / 2)];
})();
ok('head_is_barer_than_body', headMax < bodyMed, `head max ${headMax} fields vs body median ${bodyMed}`);
console.log('\nalive-field curve, every 24 arrivals:');
for (let i = 0; i < N; i += 24) console.log(`  item ${String(i).padStart(3)}  y=${String(T.years[i]).padStart(6)}  co=${String(T.CO[i]).padStart(2)}  per=${Math.round(T.PER[i])}  life=${Math.round(T.LIFE[i])}  fields=${at(T.LAND[i])}  tie=${T.TIE[i] >= 0 ? T.years[i] - T.years[T.TIE[i]] + 'y' : '—'}`);

const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} green` + (failed.length ? `  —  FAILED: ${failed.map(f => f.n).join(', ')}` : ''));
if (OUT) fs.writeFileSync(OUT, JSON.stringify({ results }, null, 1));
/* raced, for the README's reason: close() hangs with the piece's rAF loop live, and a run that
   has already printed its table must not be able to die on the way out */
await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 5000))]);
process.exit(failed.length ? 1 : 0);
