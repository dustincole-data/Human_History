/* Interleaved A/B — round 9 (index.html) vs HEAD-at-034ff7e (_h_index.html), one browser, one
   page, the two builds taking turns. Read-only: it touches no source file.

   The pass is sweep10's `frame_budget` verbatim — 400 frames at 55px/frame, first 20 dropped,
   p95 WITHIN a pass, floor ACROSS the warm passes — so the number is comparable to the gate's.
   What this adds is that the arms alternate, so machine drift is shared instead of landing on one.

   ONE PAGE AT A TIME, AND THAT IS THE POINT. Two tabs in one headless browser are BOTH visible and
   BOTH tick rAF — measured, not assumed: 60 rAF on a backgrounded tab took 1337ms against the front
   tab's 1293ms. An A/B that leaves the other build loaded is timing each arm against the other one
   painting. Load is applied deliberately instead, with CPU throttling, symmetrically.

   Usage: node ab04r9.mjs [--cpu=N] [--rounds=N]
*/
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const BASE = 'http://127.0.0.1:8812/webgl/';
const arg = (k, d) => Number((process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] || d);
const CPU = arg('cpu', 1);
const ROUNDS = arg('rounds', 3);
const WARM = arg('warm', 2);          // warm passes per load, after the cold one

const ARMS = [
  { key: 'r9  ', url: BASE + 'index.html', p: [], late: [] },
  { key: 'HEAD', url: BASE + '_h_index.html', p: [], late: [] },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const cdp = await ctx.newCDPSession(page);

const load = async (url) => {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hh && window.__hh.drops.length, null, { timeout: 60000 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  /* the throttle is set AFTER the load so both arms pay the same un-throttled load cost and the
     throttle only ever applies to the frames being timed */
  if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await page.waitForTimeout(1200);
};

const pass = async () => {
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => window.__hh.lateCuts ? window.__hh.lateCuts() : null);
  const ts = await page.evaluate(async () => {
    const ts = []; let y = 0;
    return await new Promise(res => {
      let last = performance.now();
      const step = () => {
        const now = performance.now(); ts.push(now - last); last = now;
        y += 55; scrollTo({ top: y, behavior: 'instant' });
        if (ts.length < 400) requestAnimationFrame(step); else res(ts.slice(20));
      };
      requestAnimationFrame(step);
    });
  });
  const after = await page.evaluate(() => window.__hh.lateCuts ? window.__hh.lateCuts() : null);
  const s = ts.slice().sort((x, y) => x - y);
  return { med: s[Math.floor(s.length / 2)], p95: s[Math.floor(s.length * 0.95)],
           worst: s[s.length - 1], over: ts.filter(t => t > 25).length,
           late: before == null ? null : after - before };
};

console.log(`interleaved A/B — cpu throttle ${CPU}x, ${ROUNDS} rounds x (1 cold + ${WARM} warm) per arm, 380 frames/pass\n`);
for (let r = 0; r < ROUNDS; r++) {
  for (const a of ARMS) {
    await load(a.url);
    for (let k = 0; k <= WARM; k++) {
      const x = await pass();
      if (k > 0) { a.p.push(x); if (x.late != null) a.late.push(x.late); }
      console.log(`  r${r} ${a.key} ${k === 0 ? 'cold' : 'warm'}  med ${x.med.toFixed(1)}  p95 ${x.p95.toFixed(1)}` +
                  `  worst ${x.worst.toFixed(1)}  >25ms ${String(x.over).padStart(3)}` +
                  (x.late == null ? '' : `  lateCuts ${x.late}`));
    }
  }
}

console.log('\n  ---- floor across the warm passes ----');
const rows = ARMS.map(a => ({
  key: a.key,
  med: Math.min(...a.p.map(p => p.med)),
  p95: Math.min(...a.p.map(p => p.p95)),
  p95worst: Math.max(...a.p.map(p => p.p95)),
  over: Math.min(...a.p.map(p => p.over)),
  late: a.late.length ? Math.min(...a.late) : null,
}));
for (const r of rows)
  console.log(`  ${r.key}  median ${r.med.toFixed(1)}ms  p95 ${r.p95.toFixed(1)}ms (worst pass ${r.p95worst.toFixed(1)})` +
              `  frames>25ms ${r.over}` + (r.late == null ? '' : `  lateCuts/pass ${r.late}`));
const [r9, head] = rows;
console.log(`\n  GAP  p95 +${(r9.p95 - head.p95).toFixed(1)}ms  (r9 ${r9.p95.toFixed(1)} vs HEAD ${head.p95.toFixed(1)}), ` +
            `ratio ${(r9.p95 / head.p95).toFixed(2)}x;  median +${(r9.med - head.med).toFixed(1)}ms`);
console.log(`  25ms ceiling -> r9 ${r9.p95 < 25 ? 'PASSES' : 'FAILS'}, HEAD ${head.p95 < 25 ? 'PASSES' : 'FAILS'}`);
if (errs.length) console.log(`  !! console errors: ${errs.slice(0, 3).join(' | ')}`);

/* browser.close() hangs on this machine with the piece's rAF loop live — measured, 3min+ with the
   passes already printed. Race it and leave; the caller sweeps orphans. */
await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 4000))]);
process.exit(0);
