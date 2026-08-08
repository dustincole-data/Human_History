/* A — STRATA. Ticket 11 said "the ground is the material of the age" and the sober build
   read that as mud, stone and beige. This reads it as PIGMENT: the ground is the colour
   people could make at that moment, and every band is dated by when that colour existed.
   Saturated by construction, honest by construction, and it changes twelve times. */

(function () {
  const I = window.ITEMS, MV = window.MOVEMENTS;

  // from-year, colour, pigment, and why it is that colour. all real, all dated.
  const BANDS = [
    [-99999, '#8f3f24', 'RED OCHRE',       'older than farming — the first colour anyone used'],
    [-3000,  '#1657a8', 'EGYPTIAN BLUE',   'the first colour people manufactured rather than dug up'],
    [-1500,  '#5c1c47', 'TYRIAN PURPLE',   'thousands of sea snails per gram; the reason purple means power'],
    [-700,   '#b8321f', 'VERMILION',       'ground cinnabar — brilliant, and mercury'],
    [-200,   '#2f7a5c', 'VERDIGRIS',       'copper hung over vinegar until it turned green'],
    [600,    '#22409a', 'ULTRAMARINE',     'lapis carried out of Afghanistan; dearer than gold'],
    [1300,   '#c8991a', 'LEAD-TIN YELLOW', 'the yellow under most of the Renaissance'],
    [1706,   '#123a63', 'PRUSSIAN BLUE',   'made by accident in a Berlin lab, and never scarce again'],
    [1856,   '#7a3a8c', 'MAUVEINE',        'an 18-year-old chasing malaria drugs made it from coal tar'],
    [1910,   '#e2661a', 'CADMIUM ORANGE',  'industrial chemistry paints the century'],
    [1946,   '#c9ff29', 'DAY-GLO',         'fluorescent pigment — a colour that had not existed on earth']
  ];
  const bandFor = y => BANDS.filter(b => y >= b[0]).pop();
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255)
      .map(c => (c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4)));
    return .2126 * r + .7152 * g + .0722 * b;
  };

  const SIZE = { deep: [46, 90], spread: [34, 70], trade: [27, 56], machine: [22, 44], now: [18, 32] };

  // planted callouts — arithmetic on two real items, so the number cannot drift
  const byKey = k => I.find(x => x.k === k);
  const PLANT = [['tutmask', 'nebra'], ['astrolabe', 'terracotta'], ['walkman', 'flyer']];
  const plantAt = {};
  PLANT.forEach(([a, b]) => {
    const A = byKey(a), B = byKey(b);
    if (!A || !B) return;
    const d = Math.abs(A.y - B.y).toLocaleString('en-US');
    plantAt[a] = `${A.n} was made <b>${d} years</b> after ${B.n}.`;
  });

  const rows = HH.rows(I, MV);
  const app = document.getElementById('app');
  app.className = 'strata';

  let html = `<header class="intro">
      <h1>Twelve thousand years of things people built, and what was standing next to each one.</h1>
      <p>The ground under every object is the colour people could actually make at that moment —
         ochre, then Egyptian blue, then verdigris, then a purple invented in a coal-tar lab in 1856.
         The photographs are untouched.</p>
    </header>`;

  let lastBand = null, prevYear = null;
  rows.forEach((row, ri) => {
    const y0 = row.items[0].y;
    const band = bandFor(y0);
    const gap = prevYear === null ? 0 : y0 - prevYear;
    const openBand = band !== lastBand;
    const [h, rise] = SIZE[row.mv.id];

    if (openBand) {
      if (lastBand) html += `</section>`;
      const dark = lum(band[1]) > 0.42;
      html += `<section class="band" data-ink="${dark ? 'dark' : 'light'}"
                 style="--bg:${band[1]};--hit:${dark ? '#14110c' : '#f6f1e6'};--hitink:${dark ? '#f6f1e6' : '#14110c'}"
                 data-era="${band[2]}" data-year="${y0}">
        <div class="seam">
          <span class="pig">${band[2]} <em>${band[0] < -9000 ? '' : (band[0] < 0 ? Math.abs(band[0]) + ' BCE' : band[0])}</em></span>
          <span class="pignote">${band[3]}</span>
        </div>`;
      lastBand = band;
    }

    const gapPx = openBand ? 0 : HH.spaceFor(gap);
    html += `<div class="row" data-year="${y0}" style="margin-top:${gapPx}px;--h:${h}vh;--rise:${rise}px;--gap:${row.mv.per > 3 ? '2.4vw' : '4.5vw'}">`;
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
    html += `</div>`;

    const plant = row.items.map(i => plantAt[i.k]).find(Boolean);
    if (plant) html += `<div class="callout">${plant}</div>`;
    prevYear = row.items[row.items.length - 1].y;
  });

  html += `</section>
    <footer class="stop">
      <h2>It stops here.</h2>
      <p>No finale. The browsable index would follow — every object, sortable, with its source.</p>
    </footer>
    <div id="hud"><b class="num">7,000</b><span class="unit">BCE</span><span class="era">RED OCHRE</span></div>`;

  app.innerHTML = html;

  document.querySelectorAll('.item img, .callout').forEach(el => HH.track(el));

  const num = document.querySelector('#hud .num'), un = document.querySelector('#hud .unit'),
        era = document.querySelector('#hud .era'), hud = document.getElementById('hud');
  HH.hud(() => {
    const r = HH.currentRow('.row');
    if (!r) return;
    const y = +r.dataset.year, b = r.closest('.band');
    num.textContent = HH.fmt(y);
    un.textContent = HH.unit(y);
    era.textContent = b ? b.dataset.era : '';
    hud.style.setProperty('--hud-ink', b && b.dataset.ink === 'dark' ? '#14110c' : '#f6f1e6');
  });
  HH.onScroll();
})();
