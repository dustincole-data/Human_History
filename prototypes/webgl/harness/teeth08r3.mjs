/* Does ticket 08 round 3's repair of the sky probe have teeth?

   Round 3 changed the HARNESS and not the page, which makes the decoration question sharper than
   usual: the round's claim is that a star count can no longer be satisfied by a photograph, and
   the only way to know is to put a photograph where the count is taken and watch what happens.
   Round 12's rule, applied to the instrument itself — a gate that cannot go red is a decoration,
   and only a perturbation aimed at it finds one.

   The perturbations are on the PAGE because that is the only side the probe can be lied to from.
   Each draws a real, already-loaded photograph straight onto the canvas after the frame is
   finished, so `drops`, `air`, `pending()` and every other flag the harness could have asked keep
   saying the sky is empty — which is exactly the state production was in when the probe read
   1,624 stars against localhost's 177.

     node teeth08r3.mjs [name]
*/
import fs from 'fs';
import { execSync } from 'child_process';

const REPO = 'C:/Users/dusti/Projects/Human_History';
const F = { grav: REPO + '/site/gravity.js' };
const good = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, fs.readFileSync(p)]));
const text = Object.fromEntries(Object.entries(good).map(([k, b]) => [k, b.toString('utf8')]));

const patch = (which, ...pairs) => {
  const out = pairs.reduce((s, [from, to]) => {
    if (!s.includes(from)) throw new Error(`anchor missing in ${which}: ` + from.slice(0, 70));
    return s.replace(from, to);
  }, text[which]);
  fs.writeFileSync(F[which], out);
};

/* One photograph, COPIED INTO A CANVAS the page has no handle on, drawn over the frame inside a
   band of scroll. `BAND` is what makes each case different: the star rectangle spans y 6..316 at
   1440x900, so a 132px-tall cut-out drawn at y=30 is squarely inside the pixels the count is
   taken from.

   THE COPY IS THE WHOLE POINT, and the first cut of this file did not have it. It held the
   `Image` element and said in this comment that a reference the harness owns is a reference the
   texture window cannot take away. It is not: `release()` calls `im.removeAttribute('src')` —
   its own comment reads *"hand the decoded buffer back, not just the ref"* — so the element
   survives and its PIXELS do not, and `drawImage` of a 0x0 image draws nothing and throws
   nothing. Measured: captured at scrollY 0 as `ainghazal.webp` 89x264, and by the time era 6's
   walk begins at 4,028 the same object reads `src ""`, `naturalWidth 0`. So the perturbation was
   a silent no-op, the case it exists for read 43/43 green, and the control passed because
   nothing was ever drawn anywhere. 03's memory ceiling ate the teeth aimed at 08's sky probe. */
const stuck = band => [
  `  for (let i = drops.length - 1; i >= 0; i--) place(drops[i]);`,
  `  for (let i = drops.length - 1; i >= 0; i--) place(drops[i]);
  { if (!window.__stuck) { const q = drops.find(d => d.im && d.im.naturalWidth);
      if (q) { const c = document.createElement('canvas');
               c.width = q.im.naturalWidth; c.height = q.im.naturalHeight;
               c.getContext('2d').drawImage(q.im, 0, 0); window.__stuck = c; } }
    if (window.__stuck && scrollY > ${band[0]} && scrollY < ${band[1]})
      ctx.drawImage(window.__stuck, 520 * dpr, 30 * dpr, 240 * dpr, 132 * dpr); }`];

const CASES = {
  /* THE CASE THE ROUND EXISTS FOR. A photograph sits in the star rectangle for the whole of era
     6's walk — 4,028px to 4,730px — and nowhere else, so the other four eras read honestly.
     That asymmetry is the point: the old probe counts the photograph's edges as stars and gets
     4,661 -> 177 -> 74 -> 0 -> 0, which is over 60, is monotone, and ends at zero. It passes.
     A FALSE GREEN is the only thing a gate can be that is worse than a red, and this is one.
     The repair has to turn it red instead, and it has to REPORT: `never found an empty sky` used
     to be a throw, and a throw takes the other 42 gates down with it. */
  photograph_parked_in_the_star_rectangle: {
    sweep: 'sweep10', expect: ['stars_go_out'], mustFinish: true,
    apply: () => patch('grav', stuck([3900, 5200])),
  },

  /* THE SAME PHOTOGRAPH, PARKED WHERE NOBODY LOOKS. 60,000-61,000px is between era 40's walk
     (22,352-23,054) and era 150's (92,152-92,854) and inside no other stop this phase takes. The
     control is not decoration-hunting, it is scope: a check that reddens whenever ANY pixel is
     added to the canvas anywhere would pass case 1 for the wrong reason, and would then redden
     on the piece's own shards the moment the band moved. `stars_go_out` must stay green.
     Asserted as `expectNot` rather than `expectNothing` because `frame_budget` is red under load
     on this machine independently of anything here — 06 round 10 measured that six times in
     nine — and a control that a known-unrelated red can break is not a control. */
  photograph_parked_where_nobody_looks: {
    sweep: 'sweep10', expectNot: ['stars_go_out'],
    apply: () => patch('grav', stuck([60000, 61000])),
  },

  /* THE COUNTER ITSELF. Round 3 rewrote the star arithmetic — the two-index compare over the
     ImageData became a row-array compare in the same pass as the run scan — and a rewritten
     counter that silently returns nothing would print `0 -> 0 -> 0 -> 0 -> 0` and fail its own
     gate, but one that over-counts everywhere would not. So the curve is broken instead: push
     STAR_OUT past every era's reach and the stars survive into the LED sky, which is precisely
     what gate 3 says cannot happen. If this does not go red the count is not counting. */
  the_stars_never_go_out: {
    sweep: 'sweep10', expect: ['stars_go_out'],
    apply: () => patch('grav', ['const STAR_OUT = 0.72;', 'const STAR_OUT = 9;']),
  },
};

const only = process.argv[2];
const out = [];
for (const [name, c] of Object.entries(CASES)) {
  if (only && only !== name) continue;
  const want = c.expect ? `${c.expect.join(' + ')} red` : `${c.expectNot.join(' + ')} NOT red`;
  console.log(`\n=== ${name}  (${c.sweep}: expect ${want}) ===`);
  let red = [], notes = [], finished = false;
  try {
    c.apply();
    let stdout = '';
    try {
      stdout = execSync(`node ${c.sweep}.mjs`, { stdio: 'pipe', encoding: 'utf8', timeout: 3000000 });
    } catch (e) { stdout = e.stdout || ''; if (!stdout) notes.push('    ' + String(e.stderr || e).trim().split('\n').slice(-3).join('\n    ')); }
    /* A sweep with any red exits 1, so execSync throws on every case here. What separates a run
       that FINISHED from one that died is the summary line, and that is the whole of round 3's
       second claim: a probe that cannot read its subject reports, it does not take the run down. */
    const m = stdout.match(/^(\d+)\/(\d+) green/m);
    finished = !!m;
    const fails = stdout.split('\n').filter(l => /^FAIL\s/.test(l));
    red = fails.map(l => l.trim().split(/\s+/)[1]);
    notes = notes.concat(fails.map(l => '    ' + l.trim()));
    const hit = (c.expect ? c.expect.every(x => red.includes(x)) : c.expectNot.every(x => !red.includes(x)))
                && (!c.mustFinish || finished);
    out.push({ name, red, hit, finished });
    console.log(hit ? `  AS DESIGNED (${m ? m[0] : 'no summary'}) — red: ${red.join(', ') || 'none'}`
                    : `  *** NOT AS DESIGNED *** (${m ? m[0] : 'SWEEP DID NOT FINISH'}) — red: ${red.join(', ') || 'none'}`);
    if (c.mustFinish) console.log(`  run finished and printed its table: ${finished}`);
    if (notes.length) console.log(notes.join('\n'));
  } catch (err) {
    out.push({ name, red: ['(perturbation failed: ' + err.message + ')'], hit: false });
    console.log('  *** ' + err.message);
  } finally {
    for (const [k, p] of Object.entries(F)) fs.writeFileSync(p, good[k]);
  }
}
for (const [k, p] of Object.entries(F)) fs.writeFileSync(p, good[k]);
console.log(`\nfiles restored byte-identical: ${Object.entries(F).every(([k, p]) => Buffer.compare(good[k], fs.readFileSync(p)) === 0)}`);
console.log(out.map(o => `${o.hit ? 'OK  ' : 'MISS'} ${o.name} -> ${o.red.join(', ') || 'nothing'}`).join('\n'));
console.log(`\n${out.filter(o => o.hit).length}/${out.length} perturbations behaved as designed`);
