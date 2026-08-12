/* READ-ONLY. What does a scroll-UP actually show today?
   04 r7 ruling 4: "what lies on the ground at any scroll position is exactly what was standing
   within 80 years of it." That was gated on a forward walk. This asks the same question after
   the visitor scrolls back up — which is the case the reversal request is about. */
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:8812/index.html';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const settle = async (n = 8) => { for (let i = 0; i < n; i++) await page.evaluate(() => new Promise(requestAnimationFrame)); };
const walkTo = async y => { for (let v = 0; v <= y; v += 400) { await page.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), v); await page.evaluate(() => new Promise(requestAnimationFrame)); } await settle(); };
const jump = async y => { await page.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), y); await settle(); };

const state = () => page.evaluate(() => {
  const h = window.__hh;
  const on = h.drops.filter(d => d.pieces && d.pieces.some(p => !p.dead))
                    .map(d => ({ i: d.i, y: d.it.y, n: d.it.n, age: +(d.age ?? 0).toFixed(3) }));
  const air = h.drops.filter(d => d.air).map(d => ({ i: d.i, n: d.it.n }));
  const hud = document.querySelector('#hud, .hud, [class*=hud]');
  return { on, air, hud: hud ? hud.textContent.trim().slice(0, 60) : null, y: window.scrollY };
});

await page.goto(URL, { waitUntil: 'load' }); await settle(30);
await walkTo(100000);
const a = await state();
console.log(`WALKED DOWN to y=100,000   hud="${a.hud}"`);
console.log(`  on the ground: ${a.on.map(o => `#${o.i} ${o.y} ${o.n}`).join(' | ')}`);
const newestDown = Math.max(...a.on.map(o => o.y));

for (const back of [2000, 6000, 12000]) {
  const y = 100000 - back;
  await jump(y);
  const b = await state();
  const newest = b.on.length ? Math.max(...b.on.map(o => o.y)) : null;
  const span = b.on.length ? Math.max(...b.on.map(o => o.y)) - Math.min(...b.on.map(o => o.y)) : 0;
  console.log(`\nSCROLLED UP ${back.toLocaleString()}px -> y=${y.toLocaleString()}   hud="${b.hud}"`);
  console.log(`  on the ground: ${b.on.map(o => `#${o.i} ${o.y} ${o.n} age=${o.age}`).join(' | ') || '(nothing)'}`);
  console.log(`  span of dates on the ground: ${span} years   (the 80-year window is the contract)`);
}

/* the ticket's headline table: how far the frozen ground travels. Note the year parse strips the
   thousands comma — "7,000BCE" read naively is 7, which quietly turns an 8,934-year lie into a
   1,941-year one. The counter string is printed alongside so the number is never the only claim. */
await page.goto(URL, { waitUntil: 'load' }); await settle(30);
for (let v = 0; v <= 100000; v += 400) { await page.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), v); await page.evaluate(() => new Promise(requestAnimationFrame)); }
console.log('\n   scrolled up   counter                newest thing on the ground     years AHEAD of the counter');
for (const back of [0, 6000, 25000, 50000, 100000]) {
  await jump(100000 - back);
  const s = await state();
  if (!s.on.length) { console.log(`${String(back).padStart(12)}   ${String(s.hud).padEnd(22)} (nothing on the ground)`); continue; }
  const newest = s.on.reduce((a, o) => o.y > a.y ? o : a, s.on[0]);
  const raw = String(s.hud).replace(/,/g, '');
  const n = parseInt(raw.match(/\d+/)?.[0] ?? '0', 10);
  const counter = /BCE/i.test(raw) ? -n : n;
  console.log(`${String(back).padStart(12)}   ${String(s.hud).slice(0, 22).padEnd(22)} ${newest.n.slice(0, 28).padEnd(30)} ${String(newest.y - counter).padStart(7)}`);
}

/* and the fall, for the record: find a real mid-fall stop and check it rises */
await page.goto(URL, { waitUntil: 'load' }); await settle(20);
let found = null;
for (let y = 0; y <= 120000 && !found; y += 60) {
  await page.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), y);
  await page.evaluate(() => new Promise(requestAnimationFrame));
  if (y > 55000) {
    const s = await page.evaluate(() => { const d = window.__hh.drops.find(d => d.air); return d ? { i: d.i, py: Math.round(d.py), n: d.it.n } : null; });
    if (s && s.py > -50 && s.py < 300) found = { y, ...s };
  }
}
console.log(`\nmid-fall found at y=${found.y.toLocaleString()}: #${found.i} ${found.n} at py=${found.py}`);
for (const up of [150, 300, 460]) {
  await jump(found.y - up);
  const s = await page.evaluate(() => { const d = window.__hh.drops.find(d => d.air); return d ? { py: Math.round(d.py) } : null; });
  console.log(`  scrolled up ${up}px -> py=${s ? s.py : '(not in the air — above its own start)'}`);
}
await browser.close();
