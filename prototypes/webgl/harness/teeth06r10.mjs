/* Do ticket 06 round 10's claims have teeth? Every case here breaks one thing the round changed
   and must turn exactly its own gate red. Files are restored afterwards and verified
   byte-identical.

   Round 10 took the per-object citation off the piece, dropped the ground line to one value and
   shortened the name's break. That deleted most of round 8's build, and with it the four gates
   that measured it — so those gates were RE-AIMED rather than deleted, and a re-aimed gate is
   exactly the kind that quietly stops being able to fail. Round 12's lesson is the reason this
   file exists: a gate that cannot go red is a decoration, and only a perturbation aimed at it
   finds one.

   `no_text_collision_390` gets its own case for the same reason from the other side. It was RED
   at 236 items and this round closed it, and the words on screen went from 33 to 7 — so the
   question is no longer whether it passes, it is whether a gate with seven boxes to compare can
   still catch anything at all.

     node teeth06r10.mjs [name]
*/
import fs from 'fs';
import { execSync } from 'child_process';

const REPO = 'C:/Users/dusti/Projects/Human_History';
const F = {
  grav: REPO + '/site/gravity.js',
  html: REPO + '/site/index.html',
  idx:  REPO + '/site/index.js'
};
const good = Object.fromEntries(Object.entries(F).map(([k, p]) => [k, fs.readFileSync(p)]));
const text = Object.fromEntries(Object.entries(good).map(([k, b]) => [k, b.toString('utf8')]));

const patch = (which, ...pairs) => {
  const out = pairs.reduce((s, [from, to]) => {
    if (!s.includes(from)) throw new Error(`anchor missing in ${which}: ` + from.slice(0, 70));
    return s.replace(from, to);
  }, text[which]);
  fs.writeFileSync(F[which], out);
};

const CASES = {
  /* THE CITATION COMES BACK ONTO THE PIECE. The round's central claim, and the perturbation is
     round 8's own build in miniature: give every object its citation words again. If
     `attribution_is_only_at_the_end` cannot see this, it is not measuring the ruling. */
  citation_back_on_the_piece: {
    sweep: 'sweep10', expect: ['attribution_is_only_at_the_end'],
    apply: () => patch('grav',
      [`  const date = chunk(it.disp, 14).map((t, k) => ({ t, cls: 'y', row: k === 0 }));
  d.atoms = [...name, ...date];`,
       `  const date = chunk(it.disp, 14).map((t, k) => ({ t, cls: 'y', row: k === 0 }));
  const cred = chunk(\`\${it.src} \${it.lic}\`, 16).map((t, k) => ({ t, cls: 'c', row: k === 0 }));
  d.atoms = [...name, ...date, ...cred];`]),
  },

  /* THE CITATION COMES BACK UNDER ANOTHER CLASS. The half a `.c` node count cannot see, and the
     reason the gate also reads the record's licence vocabulary out of the DATA. A re-implementation
     that called its credit words `.n` would have slipped past the first case entirely. */
  citation_back_under_another_class: {
    sweep: 'sweep10', expect: ['attribution_is_only_at_the_end'],
    apply: () => patch('grav',
      [`  const date = chunk(it.disp, 14).map((t, k) => ({ t, cls: 'y', row: k === 0 }));
  d.atoms = [...name, ...date];`,
       `  const date = chunk(it.disp, 14).map((t, k) => ({ t, cls: 'y', row: k === 0 }));
  const cred = chunk(it.lic, 16).map((t, k) => ({ t, cls: 'n', row: k === 0 }));
  d.atoms = [...name, ...date, ...cred];`]),
  },

  /* THE GROUND KEEPS ITS WORDS. The name is never retired, so a landed object goes on printing its
     label over the soil — which is round 8's ground with round 10's text in it, and the exact state
     `the_ground_carries_no_words` was written to forbid. It must also redden `name_dies_at_impact`:
     a name that outlives impact is the same defect said the other way, and a perturbation that
     reddens both is honest about that rather than being tuned to hit one. */
  the_ground_keeps_its_words: {
    sweep: 'sweep10', expect: ['the_ground_carries_no_words', 'name_dies_at_impact'],
    apply: () => patch('grav', ['  const nu = Math.min(1, d.age / NAME_OUT);',
                                '  const nu = Math.min(1, d.age / NAME_OUT) * 0;']),
  },

  /* THE LABEL STOPS BEING ONE LINE. `lay()` wraps at `min(W * 0.42, 330)`; this widens the wrap to
     four times the viewport so the label rides down as one long unwrapped row. The gate's bound is
     computed by the harness from the viewport, so widening the page's own wrap cannot widen the
     bound it is tested against — which is what round 8's two tautologies got wrong. */
  label_is_not_one_line: {
    sweep: 'sweep10', expect: ['label_is_one_line_until_impact'],
    apply: () => patch('grav', ['  const maxW = Math.min(W * 0.42, 330);',
                                '  const maxW = W * 4;']),
  },

  /* THE INK LOSES ITS FLOOR, ON THE SURFACE ROUND 10 MOVED IT TO. Round 8 measured the citation
     against frozen earth; the label rides over a DATED sky, so this is the first time the contrast
     gate has had a background that changes. Dulling the ink to the sky's own value is what a build
     that had never measured this surface would ship. */
  label_ink_matches_the_sky: {
    sweep: 'sweep10', expect: ['label_contrast'],
    apply: () => patch('html', ['  #labels .n{font-weight:700;letter-spacing:-.01em}',
                                '  #labels .n{font-weight:700;letter-spacing:-.01em;color:#2e2e33}']),
  },

  /* THE ENDING LOSES A WORD. 14's ending kept its whole cluster standing; round 10 made that
     cluster smaller, and a gate whose subject shrinks is a gate that can quietly stop counting.
     Dropping one word of the last object's label must still redden it. */
  the_ending_drops_a_word: {
    sweep: 'sweep10', expect: ['only_the_last_one_survives'],
    apply: () => patch('grav', ['    for (const a of d.atoms)\n      put(a, cx + a.ax, top + a.ay, 1, 0, 1, [surfAt(cx + a.ax) + 8, H - 5]);',
                                '    for (const a of d.atoms.slice(0, -1))\n      put(a, cx + a.ax, top + a.ay, 1, 0, 1, [surfAt(cx + a.ax) + 8, H - 5]);']),
  },

  /* CAN A GATE WITH SEVEN BOXES STILL CATCH ANYTHING? `no_text_collision_390` was red at 236 items
     on 33 boxes and this round closed it on 7, so it is now the prime suspect for a decoration.
     Deleting the reservation is the same perturbation ticket 15 recorded as a knife-edge at 33
     boxes — if it goes red reliably at 7, the gate survived the round with teeth. */
  words_stop_reserving_their_ground: {
    sweep: 'sweep10', expect: ['no_text_collision_390'],
    apply: () => patch('grav', ['  if (o > 0.02) taken.push({ x, y: ty - bh / 2, w: bw, h: bh });', '']),
  },

  /* THE GROUND STOPS DROPPING. Not a defect — the round's second change, reverted. It is here to
     establish the opposite of the others: the ground line is a LOOK and no gate owns it, so this
     must go red NOWHERE. A case that reddens something would mean a gate is silently pinned to a
     number Dustin chose, and the round would have shipped a constant it cannot change again. */
  the_ground_does_not_drop: {
    sweep: 'sweep10', expect: [], expectNothing: true,
    apply: () => patch('grav', ['const groundY = () => H * 0.78;',
                                'const groundY = () => H * (W < 720 ? 0.64 : 0.71);']),
  },

  /* THE ROLL LOSES ITS LINK. Round 10 made the roll the ONLY place the record is attributed, so
     CC BY 4.0 3(a)(2) is now load-bearing: the licence is discharged by linking the file page.
     A roll whose text is complete but whose source is not a link is a licence breach that the
     old gate — text-only — would have called green. */
  roll_loses_its_link: {
    sweep: 'sweep11i', expect: ['every_item_carries_its_attribution'],
    apply: () => patch('idx', ["    a.href = it.url; a.rel = 'noopener'; a.target = '_blank'; a.textContent = it.src;",
                               "    a.rel = 'noopener'; a.textContent = it.src;"]),
  },
};

const only = process.argv[2];
const out = [];
for (const [name, c] of Object.entries(CASES)) {
  if (only && only !== name) continue;
  console.log(`\n=== ${name}  (${c.sweep}: expect ${c.expectNothing ? 'NOTHING' : c.expect.join(' + ')} red) ===`);
  let red = [], notes = [];
  try {
    c.apply();
    try {
      execSync(`node ${c.sweep}.mjs`, { stdio: 'pipe', encoding: 'utf8', timeout: 3000000 });
    } catch (e) {
      const m = (e.stdout || '').match(/FAILED: (.*)$/m);
      red = m ? m[1].split(', ') : [];
      if (!m) console.log('  (no FAILED line — sweep threw)\n' + (e.stdout || '').slice(-600) + (e.stderr || '').slice(-400));
      notes = (e.stdout || '').split('\n').filter(l => /^FAIL\s/.test(l)).map(l => '    ' + l.trim());
    }
    /* `expectNothing` is the control case and it is asserted the other way round: nothing red, and
       the reported list is what proves it rather than an absence nobody printed. */
    const hit = c.expectNothing ? red.length === 0 : c.expect.every(x => red.includes(x));
    out.push({ name, red, hit });
    console.log(hit
      ? (c.expectNothing ? '  GREEN as designed: no gate owns the ground line' : `  RED as designed: ${red.join(', ')}`)
      : (c.expectNothing ? `  *** SOMETHING WENT RED *** (${red.join(', ')})` : `  *** DID NOT GO RED *** (red: ${red.join(', ') || 'none'})`));
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
