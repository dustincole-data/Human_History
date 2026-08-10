/* READ-ONLY. Four frames that ARE the question. Fresh load per pair — contact latches. */
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');

const URL = 'http://127.0.0.1:8812/webgl/index.html';
const OUT = 'C:/Users/dusti/Projects/Human_History/prototypes/webgl/verify04r8';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const shot = async (page, y, name, note) => {
  await page.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), y);
  for (let i = 0; i < 8; i++) await page.evaluate(() => new Promise(requestAnimationFrame));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  const s = await page.evaluate(() => {
    const h = window.__hh;
    const air = h.drops.find(d => d.air);
    const on = h.drops.filter(d => d.pieces && d.pieces.some(p => !p.dead));
    const hud = document.querySelector('#hud, .hud, [class*=hud]');
    return { air: air ? `${air.it.n} at py=${Math.round(air.py)}` : 'nothing in the air',
             on: on.length, newest: on.length ? on.reduce((a, d) => d.it.y > a.it.y ? d : a).it.n : '—',
             newestY: on.length ? on.reduce((a, d) => d.it.y > a.it.y ? d : a).it.y : null,
             hud: hud ? hud.textContent.trim() : null };
  });
  console.log(`${name}.png  y=${y.toLocaleString()}  — ${note}`);
  console.log(`    counter="${s.hud}"  air: ${s.air}  ground: ${s.on} (newest ${s.newest} ${s.newestY})`);
};

// A — the fall reverses. Real mid-fall stop, found by probe_up.mjs: y=55,020, #96.
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await p.goto(URL, { waitUntil: 'load' });
  for (let i = 0; i < 30; i++) await p.evaluate(() => new Promise(requestAnimationFrame));
  await shot(p, 55020, '01-midfall', 'an object in mid-fall');
  await shot(p, 54870, '02-up-150', 'scrolled UP 150px — it RISES. the fall already reverses');
  await p.close();
}

// B — the break does not, and the ground rides all the way home with you.
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await p.goto(URL, { waitUntil: 'load' });
  for (let i = 0; i < 30; i++) await p.evaluate(() => new Promise(requestAnimationFrame));
  for (let v = 0; v <= 100000; v += 400) { await p.evaluate(t => window.scrollTo({ top: t, behavior: 'instant' }), v); await p.evaluate(() => new Promise(requestAnimationFrame)); }
  await shot(p, 100000, '03-deep-1934', 'walked here. counter 1934, six broken things on the soil');
  await shot(p, 0, '04-top-still-1934', 'scrolled back to the TOP. counter 7000 BCE — the 1934 car is still lying there');
  await p.close();
}
await browser.close();
console.log('\nframes ->', OUT);
