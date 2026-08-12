/* WHERE THE SPIKES ARE. Read-only, one page, ~90s.

   The frame_budget pass again, but every frame keeps its scroll position and the lateCuts counter
   alongside its duration. Landings are then attributed from the TABLES rather than from the page:
   an object lands on the first frame whose y crosses START[i] + FALL, which is arithmetic the
   harness can do itself. So each frame is labelled `landing`, `lateCut`, both, or neither, and the
   duration distribution is split by label.

   The point: p95 is 1 frame in 20 and a landing is 1 frame in ~11, so if landings own the tail the
   fix belongs at the landing and nowhere else.
*/
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:8812/index.html';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => window.__hh && window.__hh.drops.length, null, { timeout: 60000 });
await page.waitForTimeout(1200);

const T = await page.evaluate(() => ({ FALL: window.__hh.FALL, START: window.__hh.START }));

const pass = () => page.evaluate(async () => {
  const h = window.__hh;
  const ts = [], ys = [], lc = [];
  let y = 0;
  return await new Promise(res => {
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      ts.push(now - last); last = now;
      ys.push(y); lc.push(h.lateCuts ? h.lateCuts() : 0);
      y += 55; scrollTo({ top: y, behavior: 'instant' });
      if (ts.length < 400) requestAnimationFrame(step); else res({ ts, ys, lc });
    };
    requestAnimationFrame(step);
  });
});

const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * p))] : NaN; };
const say = (name, a) => console.log(`  ${name.padEnd(22)} n=${String(a.length).padStart(3)}  ` +
  `median ${q(a, .5).toFixed(1)}  p95 ${q(a, .95).toFixed(1)}  worst ${q(a, 1).toFixed(1)}  ` +
  `sum ${(a.reduce((s, x) => s + x, 0)).toFixed(0)}ms`);

for (let p = 0; p < 3; p++) {
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const { ts, ys, lc } = await pass();
  if (p === 0) { console.log('(cold pass discarded)\n'); continue; }

  const landings = [], late = [], both = [], quiet = [];
  let nLand = 0;
  for (let k = 21; k < ts.length; k++) {
    const y0 = ys[k - 1], y1 = ys[k];
    let land = 0;
    for (let i = 0; i < T.START.length; i++) { const L = T.START[i] + T.FALL; if (L > y0 && L <= y1) land++; }
    nLand += land;
    const lateHere = lc[k] - lc[k - 1] > 0;
    (land && lateHere ? both : land ? landings : lateHere ? late : quiet).push(ts[k]);
  }
  const all = ts.slice(20);
  console.log(`pass ${p}:  ${nLand} landings over ${all.length} frames (1 in ${(all.length / nLand).toFixed(1)})`);
  say('ALL frames', all);
  say('landing only', landings);
  say('lateCut only', late);
  say('landing + lateCut', both);
  say('neither', quiet);
  const tail = all.slice().sort((a, b) => b - a).slice(0, Math.ceil(all.length * 0.05));
  const cut = tail[tail.length - 1];
  const tailIdx = [];
  for (let k = 21; k < ts.length; k++) if (ts[k] >= cut) tailIdx.push(k);
  let tl = 0, tc = 0;
  for (const k of tailIdx) {
    const y0 = ys[k - 1], y1 = ys[k];
    let land = 0;
    for (let i = 0; i < T.START.length; i++) { const L = T.START[i] + T.FALL; if (L > y0 && L <= y1) land++; }
    if (land) tl++;
    if (lc[k] - lc[k - 1] > 0) tc++;
  }
  console.log(`  the worst 5% of frames (>= ${cut.toFixed(1)}ms): ${tailIdx.length} frames, ` +
              `${tl} of them a landing, ${tc} of them a late cut\n`);
}

await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 4000))]);
process.exit(0);
