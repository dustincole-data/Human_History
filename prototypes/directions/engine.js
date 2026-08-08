/* PROTOTYPE — shared engine for the three directions.
   Everything here is what all three have in common, so the comparison is about the LOOK:
   the same items, the same movements, the same density spacing, the same citations,
   the same native-scroll rule. No pinning, no hijack, no timed animation. */
window.HH = (function () {
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fmt = y => (y < 0 ? Math.abs(y).toLocaleString('en-US') : String(y));
  const unit = y => (y < 0 ? 'BCE' : 'CE');

  /* Rows: items sharing a row are contemporaries. Row width comes from the movement,
     which is how the density contour gets built — 1 abreast in the deep head, 5 in the present. */
  function rows(items, movements) {
    const out = [];
    movements.forEach(mv => {
      const inMv = items.filter(i => i.y >= mv.from && i.y <= mv.to);
      for (let i = 0; i < inMv.length; i += mv.per) {
        out.push({ mv, items: inMv.slice(i, i + mv.per) });
      }
    });
    return out;
  }

  /* Vertical space is spaced by DENSITY, not by time (ticket 01). Log-compressed so the
     sparse head is a fast prologue rather than 11,000px of nothing. */
  const spaceFor = gap => Math.min(400, Math.round(40 + 132 * Math.log10(1 + Math.abs(gap) / 9)));

  /* Ambient contemporaries — the mechanism ticket 01 chose. */
  function also(it, row, all) {
    const mates = row.items.filter(o => o.k !== it.k);
    if (mates.length) return 'also standing: ' + mates.map(o => o.n).join(' · ');
    let best = null;
    all.forEach(o => {
      if (o.k === it.k) return;
      const d = Math.abs(o.y - it.y);
      if (!best || d < best.d) best = { o, d };
    });
    if (!best) return '';
    const g = best.d >= 1000 ? (best.d / 1000).toFixed(1) + 'k years' : best.d + ' years';
    return `nearest in time: ${best.o.n} — ${g} ${best.o.y > it.y ? 'later' : 'earlier'}`;
  }

  const cite = it =>
    `<a class="cite" href="${it.url}" target="_blank" rel="noopener">${it.src} · ${it.lic} · ${it.cred}</a>`;

  /* Scroll tracking. One rAF loop, native scroll only.
     --p = 0 when the element's top touches the viewport bottom, 1 when its bottom leaves the top.
     --c = 1 when the element is centred in the viewport, 0 at the far edges. */
  const tracked = [];
  function track(el, opts) { tracked.push(Object.assign({ el }, opts || {})); }

  let hudFn = null;
  function hud(fn) { hudFn = fn; }

  let queued = false;
  function frame() {
    queued = false;
    const vh = innerHeight;
    for (const t of tracked) {
      const r = t.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;      // cheap cull
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const mid = r.top + r.height / 2;
      const c = Math.min(1, Math.max(0, 1 - Math.abs(mid - vh / 2) / (vh / 2 + r.height / 2)));
      t.el.style.setProperty('--p', p.toFixed(4));
      t.el.style.setProperty('--c', c.toFixed(4));
    }
    if (hudFn) hudFn();
  }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', onScroll);

  /* the row nearest the viewport centre — what the HUD reads from */
  function currentRow(sel) {
    const vhm = innerHeight * 0.45;
    let best = null;
    document.querySelectorAll(sel).forEach(el => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - vhm);
      if (!best || d < best.d) best = { el, d };
    });
    return best && best.el;
  }

  return { REDUCED, fmt, unit, rows, spaceFor, also, cite, track, hud, onScroll, currentRow };
})();
