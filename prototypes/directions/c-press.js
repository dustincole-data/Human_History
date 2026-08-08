/* C — PRESS. Five printing grammars, one per movement. The visual language changes
   completely between them, which is the flatness fix stated as strongly as it can be:
   the page at item 5 and the page at item 300 are not the same object. */

(function () {
  const I = window.ITEMS, MV = window.MOVEMENTS;

  const G = {
    deep:    {g:'incised',     sheet:'#c1663a', ink:'#2a1206', ink2:'#5e1c0d',
              label:'INCISED',          note:'pressed into wet clay, cut into stone — one colour, and it is the material'},
    spread:  {g:'woodblock',   sheet:'#eee1c8', ink:'#241c14', ink2:'#c1352b',
              label:'WOODBLOCK',        note:'one carved block, one pull, one colour at a time'},
    trade:   {g:'letterpress', sheet:'#f2efe6', ink:'#14161a', ink2:'#1f4b8f',
              label:'LETTERPRESS',      note:'movable type: black, and one spot colour if you could afford it'},
    machine: {g:'chromo',      sheet:'#faf1dc', ink:'#1b1a16', ink2:'#e03a2f', ink3:'#f2b705', ink4:'#1b7f79',
              label:'CHROMOLITHOGRAPH', note:'four stones, four colours, never quite in register'},
    now:     {g:'screen',      sheet:'#eef1fb', ink:'#0b0d12', ink2:'#ff10a0', ink3:'#00b8d9', ink4:'#7b2bff',
              label:'SCREEN',           note:'three lights and no ink at all'}
  };
  const SIZE = { deep: 44, spread: 33, trade: 26, machine: 21, now: 18 };

  const byKey = k => I.find(x => x.k === k);
  const PLANT = [['tutmask', 'nebra'], ['astrolabe', 'terracotta'], ['walkman', 'flyer']];
  const plantAt = {};
  PLANT.forEach(([a, b]) => {
    const A = byKey(a), B = byKey(b); if (!A || !B) return;
    plantAt[a] = `${A.n} was made <b>${Math.abs(A.y - B.y).toLocaleString('en-US')} years</b> after ${B.n}.`;
  });

  const rows = HH.rows(I, MV);
  const app = document.getElementById('app');
  app.className = 'press';

  let html = `<header class="intro">
      <h1>Twelve thousand years of things people built, and what was standing next to each one.</h1>
      <p>The page is printed the way the moment could print: incised clay, then a woodblock,
         then letterpress with one spot colour, then four lithographic stones fighting for
         register, then a screen with no ink in it. The photographs are untouched.</p>
    </header>`;

  let lastMv = null, prevYear = null, ri = 0;
  rows.forEach(row => {
    const y0 = row.items[0].y;
    const g = G[row.mv.id];
    if (row.mv !== lastMv) {
      if (lastMv) html += `</section>`;
      html += `<section class="sheet" data-g="${g.g}" data-label="${g.label}"
          style="--sheet:${g.sheet};--ink:${g.ink};--ink2:${g.ink2};--ink3:${g.ink3 || g.ink2};--ink4:${g.ink4 || g.ink}">
        <div class="head"><b>${g.label}</b><span>${g.note}</span></div>
        <div class="rules"><i></i><i></i><i></i></div>`;
      lastMv = row.mv; ri = 0;
    }
    ri++;
    const gapPx = HH.spaceFor(prevYear === null ? 0 : y0 - prevYear);
    const yLabel = row.items[0].disp.replace(/^c\.\s*/, '');
    const runner = row.items.map(i => i.disp).join(' · ') +
      (row.items.length > 1 ? ' — one sheet' : '');

    html += `<div class="spread" data-year="${y0}" style="margin-top:${gapPx}px">
      <div class="num" data-y="${yLabel}" aria-hidden="true">${yLabel}</div>
      <div class="row${ri % 3 === 0 ? ' bleed' : ''}" style="--h:${SIZE[row.mv.id]}vh;--gap:${row.mv.per > 3 ? '2.4vw' : '4.5vw'}">`;
    row.items.forEach(it => {
      html += `<figure class="item">
          <div class="pic"><img src="img/${it.k}.webp" alt="${it.n}" decoding="async" loading="lazy"></div>
          <figcaption class="cap">
            <div class="name">${it.n}</div>
            <div class="yr">${it.disp}</div>
            <div class="also">${HH.also(it, row, I)}</div>
            ${HH.cite(it)}
          </figcaption>
        </figure>`;
    });
    html += `</div><div class="runner">${runner}</div>`;
    const plant = row.items.map(i => plantAt[i.k]).find(Boolean);
    if (plant) html += `<div class="callout">${plant}</div>`;
    html += `</div>`;
    prevYear = row.items[row.items.length - 1].y;
  });

  html += `</section>
    <footer class="stop">
      <h2>It stops here.</h2>
      <p>No finale. The browsable index would follow — every object, sortable, with its source.</p>
    </footer>
    <div id="hud"><b class="num2">7,000</b><span class="unit">BCE</span><span class="era">INCISED</span></div>`;

  app.innerHTML = html;

  document.querySelectorAll('.spread, .item').forEach(el => HH.track(el));

  const num = document.querySelector('#hud .num2'), un = document.querySelector('#hud .unit'),
        era = document.querySelector('#hud .era'), hud = document.getElementById('hud');
  HH.hud(() => {
    const r = HH.currentRow('.spread');
    if (!r) return;
    const y = +r.dataset.year, sheet = r.closest('.sheet');
    num.textContent = HH.fmt(y);
    un.textContent = HH.unit(y);
    era.textContent = sheet.dataset.label;
    const cs = getComputedStyle(sheet);
    hud.style.setProperty('--hud-ink', cs.getPropertyValue('--ink'));
    hud.style.setProperty('--hud-spot', cs.getPropertyValue('--ink2'));
  });
  HH.onScroll();
})();
