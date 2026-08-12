/* DID THE REFACTOR CHANGE ANYTHING THAT IS DRAWN? Read-only.

   The cut tree is only legitimate if it is the same cut. So: the fixed build and round 9 as
   committed (aa59e9a, served as _r9_gravity.js) are walked to the same scroll positions and every
   fragment of every BUILT object is compared — position, rotation, size, rest, and the canvas the
   piece is drawn from, by its own pixel bytes. Not only the visible ones: `pure_function`'s round-9
   lesson is that three of that round's defects were in objects the window was holding off-screen.

   IT WAITS FOR THE QUEUE, AND THE FIRST VERSION DID NOT. `pending() === 0` says the photographs are
   here; it says nothing about whether the cutting queue has drained, and the fixed build carries
   more work in that queue by design. Sampling on `pending()` alone caught the page mid-assembly and
   reported a page that had not finished as a page that disagreed — round 9's own quiescence lesson,
   arriving on the harness written to check round 9's successor.

   `d.gens.length` is reported but NOT failed on: it is how far the queue has pre-built, which is
   scheduling. What is drawn is `genAt(age)`, and `pose()` forces it. Ruling: the queue decides
   when, never what.
*/
import { createRequire } from 'module';
const require = createRequire('C:/Users/dusti/Projects/Deep_Time/package.json');
const { chromium } = require('playwright');
import crypto from 'crypto';

const B = 'http://127.0.0.1:8812/';
const STOPS = [900, 2400, 5200, 9800, 21000, 46000];
const F = ['x', 'y', 'rot', 'w', 'h', 'sink', 'rest', 'cvLen', 'cvTail'];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

const walk = async (url) => {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__hh && window.__hh.drops.length, null, { timeout: 60000 });
  await page.waitForTimeout(1200);
  const out = [];
  for (const y of STOPS) {
    await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y);
    let waited = 0;
    for (; waited < 400; waited++) {
      await page.evaluate(() => new Promise(requestAnimationFrame));
      const s = await page.evaluate(() => ({ p: window.__hh.pending(), q: window.__hh.queue.length }));
      if (s.p === 0 && s.q === 0 && waited > 5) break;
    }
    out.push(await page.evaluate(() => {
      const h = window.__hh;
      const objs = [];
      const row = p => { const u = p.cv.toDataURL();
        return [Math.round(p.x * 1e3), Math.round(p.y * 1e3), Math.round(p.rot * 1e5),
                p.w, p.h, Math.round((p.sink || 0) * 1e3), p.rest ? 1 : 0, u.length, u.slice(-48),
                /* is this piece sitting exactly where it was born, untouched? */
                (p.x === p.b.x && p.y === p.b.y && p.rot === p.b.rot && !p.rest) ? 1 : 0]; };
      for (const d of h.drops) {
        if (!d.built || !d.gens) continue;
        objs.push({
          i: d.i, nGens: d.gens.length, splits: d.splits, dusted: !!d.dusted,
          age: Math.round(d.age * 1e5),
          drawnGen: d.gens.findIndex(G => G.pieces === d.pieces),
          drawn: d.pieces.map(row),
          specks: d.specks.length,
          gens: d.gens.map(G => G.pieces.map(row)),
        });
      }
      const cv = document.querySelector('canvas');
      return { objs, waited: 0, canvas: cv ? cv.toDataURL() : null,
               labels: document.getElementById('labels').innerHTML };
    }));
    out[out.length - 1].waited = waited;
  }
  await page.close();
  return out;
};

const H = s => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 12);
const cmpRow = (a, b) => { const o = []; for (let i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) o.push(F[i]); return o; };

console.log('walking the fixed build...');
const A = await walk(B + 'index.html');
console.log('walking round 9 as committed...\n');
const R = await walk(B + '_r9_index.html');

let bad = 0, sched = 0, pieces = 0, objs = 0, cuts = 0, canon = 0;
for (let k = 0; k < STOPS.length; k++) {
  const a = A[k], r = R[k];
  const note = [];
  const ai = a.objs.map(o => o.i).join(','), ri = r.objs.map(o => o.i).join(',');
  if (ai !== ri) { note.push(`BUILT SET differs: fixed [${ai}] vs r9 [${ri}]`); bad++; }
  else for (const o of a.objs) {
    const q = r.objs.find(x => x.i === o.i);
    objs++;
    if (o.nGens !== q.nGens) { sched++; note.push(`(sched) obj ${o.i} prebuilt ${o.nGens} gens vs ${q.nGens}`); }
    if (o.splits !== q.splits || o.dusted !== q.dusted || o.age !== q.age) {
      note.push(`obj ${o.i} READOUT splits ${o.splits}/${q.splits} dusted ${o.dusted}/${q.dusted}`); bad++;
    }
    if (o.drawn.length !== q.drawn.length) { note.push(`obj ${o.i} DRAWS ${o.drawn.length} pieces vs ${q.drawn.length}`); bad++; }
    else for (let p = 0; p < o.drawn.length; p++) {
      pieces++;
      const f = cmpRow(o.drawn[p], q.drawn[p]);
      if (f.length) { note.push(`obj ${o.i} drawn piece ${p}: ${f.join('+')} differ`); bad++; break; }
    }
    if (o.specks !== q.specks) { note.push(`obj ${o.i} specks ${o.specks} vs ${q.specks}`); bad++; }
    /* THE CUT AND THE POSE ARE TWO CLAIMS AND THEY ARE CHECKED SEPARATELY.

       The CUT — how many pieces, how big, and the canvas bytes themselves — must equal round 9's
       exactly, in every generation, drawn or retained. That is the whole legitimacy of moving the
       cut into the fall: a cut depends on the photograph and the seed, so cutting it earlier must
       produce the identical shape.

       The POSE of a generation that is NOT on screen must equal that piece's own BIRTH, in the
       fixed build only. Round 9 leaves it wherever the queue happened to stop, which is the
       scheduling-dependent state this round deletes — so it is expected to differ, and what is
       asserted of the fixed build is the stronger property, not agreement with the weaker one. */
    const gn = Math.min(o.gens.length, q.gens.length);
    for (let g = 0; g < gn; g++) {
      if (o.gens[g].length !== q.gens[g].length) { note.push(`obj ${o.i} gen ${g}: ${o.gens[g].length} pieces vs ${q.gens[g].length} — THE CUT DIFFERS`); bad++; continue; }
      for (let p = 0; p < o.gens[g].length; p++) {
        const f = cmpRow(o.gens[g][p], q.gens[g][p]).filter(n => ['w', 'h', 'cvLen', 'cvTail'].includes(n));
        cuts++;
        if (f.length) { note.push(`obj ${o.i} gen ${g} piece ${p}: ${f.join('+')} — THE CUT DIFFERS`); bad++; break; }
      }
      if (g === o.drawnGen) continue;                  // posed by `pose()` and compared above
      const off = o.gens[g].filter(p => !p[9]).length;
      if (off) { note.push(`obj ${o.i} retained gen ${g}: ${off}/${o.gens[g].length} NOT at birth ` +
                           `[dusted=${o.dusted} drawnGen=${o.drawnGen} lastGen=${g === o.gens.length - 1} ` +
                           `sharedWithDrawn=${o.drawnGen >= 0 ? o.gens[g].filter((p, ix) => o.gens[o.drawnGen].some(z => z[7] === p[7] && z[8] === p[8] && z[3] === p[3] && z[4] === p[4])).length : 0}]`); bad++; }
      else canon++;
    }
  }
  const cvSame = a.canvas === r.canvas, lbSame = a.labels === r.labels;
  if (!cvSame) { note.push(`CANVAS differs (${H(a.canvas)} vs ${H(r.canvas)})`); bad++; }
  if (!lbSame) { note.push(`LABELS differ (${H(a.labels)} vs ${H(r.labels)})`); bad++; }
  console.log(`  y=${String(STOPS[k]).padStart(6)}  ${a.objs.length} built  settled after ${a.waited}/${r.waited} frames  ` +
              `canvas ${cvSame ? 'same' : 'DIFF'}  labels ${lbSame ? 'same' : 'DIFF'}`);
  for (const n of note.slice(0, 6)) console.log(`      ${n}`);
  if (!note.length) console.log('      identical');
}
console.log(`\n${bad === 0 ? 'IDENTICAL' : bad + ' REAL DIFFERENCES'} (+${sched} scheduling-only) — ` +
            `${objs} built objects, ${pieces} drawn fragments and ${cuts} cuts compared, ${canon} retained generations canonical, across ${STOPS.length} stops`);

await Promise.race([browser.close().catch(() => {}), new Promise(r => setTimeout(r, 4000))]);
process.exit(bad === 0 ? 0 : 1);
