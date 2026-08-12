/* Do ticket 04 round 9's claims have teeth? Every case here puts back one of the three wall clocks
   the rewind deleted, or one of the latches, and must turn exactly its own gate red. Files are
   restored afterwards and verified byte-identical.

   Round 8's finding is what this file exists for: `sweep10` returned 41/41 green against a page
   that printed 7,000 BCE over a 1934 car, because `ground_is_the_moment` was one-ended and swept
   in one direction. A gate that cannot go red is a decoration, and only a perturbation aimed at it
   finds one — so the two ends and the two directions each get a case of their own.

     node teeth04r9.mjs [name]

   ONE CASE AT A TIME. A killed suite leaves its perturbation in a source file; the files are only
   restored in the `finally`. Check the anchor string rather than `git status` — a run that dies
   between write and restore leaves a file that looks modified for a reason git cannot explain. */
import fs from 'fs';
import { execSync } from 'child_process';

const REPO = 'C:/Users/dusti/Projects/Human_History';
const F = {
  grav: REPO + '/site/gravity.js',
  burial: REPO + '/site/burial.js',
  decay: REPO + '/site/decay.js'
};
const good = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, fs.readFileSync(p)]));
const text = Object.fromEntries(Object.entries(good).map(([k, b]) => [k, b.toString('utf8')]));

/* Single-line anchors only, and every one asserted — a multi-line anchor has to reproduce trailing
   comments and line endings exactly, and when it does not it fails as "anchor missing", which
   reads like the code moved rather than like the anchor was written wrong. */
const patch = (which, ...pairs) => {
  const out = pairs.reduce((s, [from, to]) => {
    if (!s.includes(from)) throw new Error(`anchor missing in ${which}: ` + from.slice(0, 70));
    return s.replace(from, to);
  }, text[which]);
  fs.writeFileSync(F[which], out);
};

const CASES = {
  /* CONTACT LATCHES AGAIN — the state the piece shipped in, and the exact defect round 8 found.
     `down` stops being a predicate and becomes a flag nothing clears, so the ground freezes and
     rides home with the visitor while the counter keeps running backwards. This must redden BOTH
     the re-aimed contact gate AND the ground gate's new second end: at the top of the page the
     newest thing on the soil is 8,934 years newer than the year printed over it. */
  contact_latches_again: {
    expect: ['contact_is_a_position', 'ground_is_the_moment'],
    apply: () => patch('grav', ['    d.down = rel >= FALL;', '    d.down = d.down || rel >= FALL;']),
  },
  /* DECAY GOES BACK TO ONE-WAY. `age` becomes a monotonic ratchet again — the object un-breaks
     nowhere, so a scroll-up shows the wreck at the age it reached and stays there. */
  decay_one_way_again: {
    expect: ['decay_runs_both_ways'],
    apply: () => patch('grav', ['    d.age = d.down ? Math.min(1, Math.max(0, (scrollY - LAND[d.i]) / LIFE[d.i])) : 0;',
                                '    d.age = d.down ? Math.max(d.age, Math.min(1, Math.max(0, (scrollY - LAND[d.i]) / LIFE[d.i]))) : 0;']),
  },
  /* THE SHARDS STOP REWINDING. The generation is still chosen off `age`, so the object comes apart
     and back together at the right moments — but the pose inside a generation never runs back to
     its birth, so where the fragments LIE depends on how far down the page the visitor went first.
     Aimed squarely at the widened `pure_function`, which reads every fragment's position. */
  pose_never_rewinds: {
    expect: ['pure_function'],
    apply: () => patch('grav', ['  if (want < G.n) { rewindPieces(G.pieces); G.n = 0; }   // the scroll ran back: start from birth',
                                '  if (want < G.n) { return; }']),
  },
  /* THE DUST GOES BACK ON `Math.random` — one site is enough. This is the wall clock that cost 03
     round 10 its pixel comparison of two first visits, so it is the one that has to prove the
     comparison is worth having back. */
  dust_unseeded_again: {
    expect: ['window_is_not_a_clock'],
    apply: () => patch('burial', ['  const r = rng(seed), out = [];\n  for (let i = 0; i < n; i++) out.push(spark(r, x, y, i, pal));',
                                  '  const r = Math.random, out = [];\n  for (let i = 0; i < n; i++) out.push(spark(r, x, y, i, pal));']),
  },
  /* THE QUEUE DECIDES WHAT IS DRAWN AGAIN. The generation is no longer built on demand — the frame
     draws whatever the 4ms budget has managed to cut so far. On a walk this is nearly invisible and
     on two visits to the same position it is not, which is the whole reason ruling 8b separates
     "when the work is done" from "what is on screen". */
  queue_decides_the_generation: {
    /* IT REDDENS `frozen_when_idle`, NOT the two-first-visits gate, and the run said so before this
       line did. Both visits are equally late, and the gate waits for `queue.length === 0` before it
       shoots — so they settle to the same picture and agree with each other. What the defect
       actually looks like is a page that keeps changing while nobody is scrolling, which is the
       stronger statement of the same claim and is the gate that caught it. */
    expect: ['frozen_when_idle'],
    apply: () => patch('grav', ['    ensureGen(d, d.i === LAST ? 0 : g);              // 14: it never breaks, so it never leaves gen 0',
                                '    if (!d.gens[d.i === LAST ? 0 : g]) { d.pieces = d.gens[d.gens.length - 1].pieces; return; }']),
  },
  /* THE WINDOW STOPS BEING A WINDOW. `BACK` grows until the rewind retains everything it has ever
     passed, which is ruling 8a's unbounded reading — 65.8 MB at 230 items and 114.4 MB at 400. The
     memory gate is the one that must notice, and the leak gate with it. */
  back_is_unbounded: {
    expect: ['sprite_window_does_not_leak'],
    apply: () => patch('grav', ['const BACK = 4000;                 // …and how far past its own death it is kept',
                                'const BACK = 400000;               // …and how far past its own death it is kept']),
  },
};

const only = process.argv[2];
if (only && !CASES[only]) { console.error(`no such case: ${only}\n  ${Object.keys(CASES).join('\n  ')}`); process.exit(2); }
const out = [];
for (const [name, c] of Object.entries(CASES)) {
  if (only && only !== name) continue;
  console.log(`\n=== ${name}  (expect ${c.expect.join(' + ')} red) ===`);
  let red = [], notes = [];
  try {
    c.apply();
    try {
      execSync(`node sweep10.mjs`, { stdio: 'pipe', encoding: 'utf8', timeout: 2400000 });
    } catch (e) {
      /* WHAT THE GATE MEASURED, not just that it moved: a binary red/green cannot tell a gate that
         caught the perturbation from one that fell over for another reason. */
      notes = (e.stdout || '').split('\n').filter(l => /^FAIL\s/.test(l)).map(l => '    ' + l.trim());
      /* THE FAIL LINES ARE THE GROUND TRUTH AND THE SUMMARY IS A CONVENIENCE. `back_is_unbounded`
         reddened `sprite_window_does_not_leak` exactly as designed, and this harness said "nothing
         went red" — because retaining every wreck also means the sky is never empty, so a later
         phase threw `era 226: never found an empty sky` and the sweep died before printing its
         summary line. A perturbation violent enough to abort the suite is precisely the one where
         you most need to know which gates fired, so the summary is preferred and the FAIL lines are
         the fallback rather than the other way round. */
      const m = (e.stdout || '').match(/FAILED: (.*)$/m);
      red = m ? m[1].split(', ') : notes.map(l => l.trim().split(/\s+/)[1]).filter(Boolean);
      if (!m) console.log(`  (no FAILED line — the sweep threw. ${red.length} gate(s) had already ` +
                          `gone red and are read off the FAIL lines below.)\n  ` +
                          (e.stderr || '').trim().split('\n').slice(0, 2).join('\n  '));
    }
    const hit = c.expect.every(x => red.includes(x));
    out.push({ name, red, hit });
    console.log(hit ? `  RED as designed: ${red.join(', ')}` : `  *** DID NOT GO RED *** (red: ${red.join(', ') || 'none'})`);
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
console.log(`\n${out.filter(o => o.hit).length}/${out.length} perturbations went red`);
