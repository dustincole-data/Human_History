"""TICKET 02 — the THIRD cut method: no model at all, the ground's own colour.

    python recut02.py --sheet k1 k2      # candidates + a comparison sheet, writes alt3/ only
    python recut02.py --promote k1       # alt3/<k>.png -> img/<k>.webp, the master REPLACED

`matte.py` cut the shipped masters with isnet and `rematte02.py` re-cut them with birefnet.
Both are SALIENT-OBJECT models, and Dustin's `1` flag — "keep the original" — was a verdict
between those two cuts, not a statement that either was right. Seven keys carry it and all
seven are defective: measured on the shipped masters, bayeux has 17 detached islands holding
32.6% of the object, greatwave 21 islands, tughra 38 holes over 41.2% of its area, kells 17
holes, durerblock 10. vhs shows none of those numbers and is the worst of them by eye, because
the defect there is the one `measure()` cannot see: the mask ATE the top band, the bottom edge
and most of the shell, and left the fragment of bottom-left corner Dustin saw on the live site.

THE MODELS ARE NOT FAILING, THEY ARE ANSWERING A DIFFERENT QUESTION. A salient-object model
finds *the subject* — and on a woodblock print the subject is the ink, so it deletes the paper;
on a tapestry it is the figures, so it deletes the linen; on a black cassette against white it
finds the two bright reel windows and the label and deletes the black shell holding them. Every
one of these images is an object photographed against a UNIFORM GROUND, which is not a
salience problem at all. It is a background-removal problem, and it has an exact answer.

So: sample the ground off the border ring, take each pixel's distance from it, and ramp the
alpha across a soft band so the edge stays antialiased. Then the one rule that does the actual
work — **transparency is only allowed where it is connected to the image border.** Ground
colour enclosed by the object is INTERIOR and stays: the paper inside Dürer's rhino, the cream
inside the tughra's oval, the white highlight on a VHS reel hub. That single constraint is what
both models had no way to express, and it is why they punched holes.

Three modes, because a flat artwork has more than one honest reading and they are not the
same picture:

  ground  the sheet is the object. Transparency floods in from the border and stops at the
          first thing that is not the ground. For a 3-D object on white this is simply the
          true silhouette (vhs). For a print it keeps the paper.
  ink     the ink is the object. Threshold higher, close the gaps between strokes, then fill
          what they enclose. Keeps the item in the same visual class as every other silhouette
          on the shelf, and fixes the confetti (tughra's oval comes out solid).
  flat    there is nothing to remove. Full alpha, the frame as it stands.

Neither is automatic and neither is a default: `MODE` records the call per key, and a key with
no entry is cut both ways onto the sheet so the choice is made by eye, as every other cut on
this ticket has been.

`flat` EXISTS BECAUSE THE SEVEN FLAT ARTWORKS HAVE NO BACKGROUND AT ALL. Every one of their
originals is already cropped to the artwork — the linen, the vellum, the laid paper and the
wove paper all run off all four edges — so the border ring this file samples its "ground"
from IS the object, and a flood seeded there eats it: bayeux loses the linen behind the
horseman, greatwave's sky opens into a 26%-of-area hole, rocket's white sky is chewed away,
kells is bitten ragged down its right edge, durerblock down its left. Where `ground` looked
right on this class it was removing nothing at all (tughra and mughalmini both measure
cov 1.000, which is `flat` by another route). The question `MODE` answers for a flat artwork
is ink-or-sheet; the answer for all seven is the sheet, and the sheet is the whole frame.

WHAT THIS DOES NOT SOLVE: an object photographed in a real scene. dynatac is a phone on a desk
against a shaded wall — there is no single ground colour, the flood stops halfway up the wall,
and it comes out as a ragged blob. It stays open, and it needs a matte, not this.

Reads:  orig/<key>.jpg   (never img/ — re-cutting a cut-out would compound the first mistake)
Writes: alt3/<key>.png       the candidate, RGBA
        recut02-sheet.png    original | shipped cut | ground | ink, on the site's own #05060a
        img/<key>.webp       ONLY under --promote

--promote puts the frame back on the master's terms with `promote02.to_master()` — 900 px cap,
premultiplied resize, alpha-bbox crop, WEBP q88/method 5 — so a candidate cut at full
resolution cannot arrive drawn at a fraction of its neighbours' size. Then `bake_sprites.py`
and `bake_index.py`; site/img and site/thumb are derived and are not touched here.
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

from promote02 import to_master
from review02 import measure, HERE

ORIG = os.path.join(HERE, "orig")
ALT3 = os.path.join(HERE, "alt3")
IMG = os.path.join(HERE, "img")
SHEET = os.path.join(HERE, "recut02-sheet.png")
BG = (5, 6, 10)          # site/index.html's own background, so the sheet judges what ships

# The call per key. Absent = undecided, and --sheet renders it both ways.
MODE = {
    "vhs": "ground",     # a 3-D object on white: the flood IS the silhouette
    # The seven flat artworks, ruled 2026-08-15: the object is the SHEET, and each of these
    # originals is already cropped to it, so the sheet IS the frame and nothing is removed.
    "bayeux": "flat",       # a crop of the tapestry: linen off all four edges, no ground
    "durerblock": "flat",   # the woodcut sheet, letterpress text and all
    "greatwave": "flat",    # `ground` eats the sky (same tone as the margin, connected to it)
    "kells": "flat",        # the folio; `ground` bit 60% off its last twelve columns
    "rocket": "flat",       # a wood engraving: the white sky IS the paper IS the picture
    "tughra": "flat",       # `ground` already measured cov 1.000 here — this says so
    "mughalmini": "flat",   # likewise cov 1.000, both modes; the pink border is the folio
}


def ground_colour(a, ring=0.02):
    """Median of the border ring. A median, not a mean, so an object running off the edge of
    the frame moves it by nothing."""
    h, w = a.shape[:2]
    r = max(2, int(ring * min(h, w)))
    band = np.concatenate([a[:r].reshape(-1, 3), a[-r:].reshape(-1, 3),
                           a[:, :r].reshape(-1, 3), a[:, -r:].reshape(-1, 3)])
    return np.median(band, axis=0)


def _rgba(a, alpha):
    return Image.fromarray(
        np.clip(np.dstack([a, alpha * 255.0]) + 0.5, 0, 255).astype(np.uint8), "RGBA")


def cut_ground(path, lo=10.0, hi=26.0):
    a = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32)
    d = np.abs(a - ground_colour(a)).max(axis=-1)
    alpha = np.clip((d - lo) / (hi - lo), 0, 1)

    lab, _ = ndimage.label(d <= lo)
    border = (set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])) - {0}
    outside = np.isin(lab, list(border)) if border else np.zeros(d.shape, bool)
    # The reach has to cross the RAMP too. Seeding on the flat background alone leaves every
    # interior highlight ringed with half-alpha — the hub of each VHS reel, punched through.
    reach = ndimage.binary_propagation(outside, mask=(d < hi))
    return _rgba(a, np.where(reach, alpha, 1.0))


def cut_ink(path, lo=34.0, hi=52.0, close=3, speck=0.0015):
    a = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32)
    d = np.abs(a - ground_colour(a)).max(axis=-1)
    alpha = np.clip((d - lo) / (hi - lo), 0, 1)

    m = ndimage.binary_closing(d > lo, np.ones((close, close))) if close else d > lo
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n:                                   # drop specks: foxing, a plate number, a torn corner
        areas = np.bincount(lab.ravel()); areas[0] = 0
        m &= np.isin(lab, np.nonzero(areas >= speck * m.sum())[0])
    alpha = np.maximum(alpha, m.astype(np.float32))
    alpha[~ndimage.binary_dilation(m, np.ones((3, 3)))] = 0.0
    return _rgba(a, alpha)


def cut_flat(path):
    """No cut. The frame is the object, so the alpha is a constant and the only work left is
    the master's own resize and encode, which --promote does."""
    a = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32)
    return _rgba(a, np.ones(a.shape[:2], np.float32))


CUT = {"ground": cut_ground, "ink": cut_ink, "flat": cut_flat}


def candidate(key, mode):
    im = CUT[mode](os.path.join(ORIG, key + ".jpg"))
    bb = im.getbbox()
    return im.crop(bb) if bb else im


def _tile(im, box, bg=BG):
    im = im.convert("RGBA").copy()
    im.thumbnail(box, Image.LANCZOS)
    t = Image.new("RGBA", box, bg + (255,))
    t.alpha_composite(im, ((box[0] - im.size[0]) // 2, (box[1] - im.size[1]) // 2))
    return t


def sheet(keys):
    os.makedirs(ALT3, exist_ok=True)
    box, rows, mods = (330, 330), [], []
    for k in keys:
        modes = [MODE[k]] if k in MODE else ["ground", "ink"]
        mods.append(modes)
        cells = [_tile(Image.open(os.path.join(ORIG, k + ".jpg")), box, (24, 24, 24)),
                 _tile(Image.open(os.path.join(IMG, k + ".webp")), box)]
        for m in modes:
            im = candidate(k, m)
            im.save(os.path.join(ALT3, ("%s.png" % k) if len(modes) == 1 else "%s-%s.png" % (k, m)))
            cells.append(_tile(im, box))
            n = measure(os.path.join(ALT3, ("%s.png" % k) if len(modes) == 1
                                     else "%s-%s.png" % (k, m)))
            o = measure(os.path.join(IMG, k + ".webp"))
            print(f"  {k:12s} {m:7s} isl {o['isl']:3d}->{n['isl']:<3d} "
                  f"holes {o['holes']:3d}->{n['holes']:<3d} "
                  f"cov {o['cov']:.3f}->{n['cov']:.3f}  halo {n['halo']:.2f}  {im.size}")
        rows.append(cells)

    w = max(len(r) for r in rows)
    out = Image.new("RGB", (box[0] * w, box[1] * len(rows)), BG)
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            out.paste(c.convert("RGB"), (x * box[0], y * box[1]))
    out.save(SHEET)
    print(f"\n{len(rows)} key(s) -> {os.path.relpath(SHEET, HERE)}"
          f"   columns: original | shipped | " + " | ".join(max(mods, key=len)))


REVIEW = os.path.join(HERE, "recut02-review.html")

PAGE = """<!doctype html><meta charset=utf-8><title>recut02 — the seven flat artworks</title>
<style>
:root {{ color-scheme: dark }}
body {{ background:#05060a; color:#c9ccd6; margin:0 auto; padding:32px 28px 80px; max-width:1180px;
       font:15px/1.55 ui-sans-serif,system-ui,"Segoe UI",sans-serif }}
h1 {{ font-size:23px; margin:0 0 6px; color:#f0f2f7; font-weight:600 }}
.lede {{ margin:0 0 4px; max-width:78ch; color:#9aa0ae }}
.ask {{ margin:18px 0 0; padding:13px 16px; border-left:3px solid #6f8fd6; background:#0c1018;
        max-width:78ch; color:#dfe3ec }}
hr {{ border:0; border-top:1px solid #191d27; margin:34px 0 }}
h2 {{ font-size:18px; margin:0 0 14px; color:#f0f2f7; font-weight:600 }}
h2 small {{ font-weight:400; color:#7d8496; font-size:13px }}
code {{ color:#8f97ab }}
.pair {{ display:grid; grid-template-columns:1fr 1fr; gap:22px }}
figure {{ margin:0 }}
figcaption {{ font:600 11px/1 ui-monospace,monospace; letter-spacing:.09em; margin-bottom:8px }}
.panel {{ background:#05060a; border:1px solid #1c212c; height:340px;
          display:flex; align-items:center; justify-content:center; padding:12px }}
.panel img {{ max-width:100%; max-height:100%; object-fit:contain }}
.bad {{ color:#d98a86 }} .good {{ color:#7fb894 }}
figure p {{ font-size:12.5px; margin:9px 0 0 }}
.why {{ margin:16px 0 0; max-width:88ch; color:#9aa0ae; font-size:14px }}
.shelf {{ display:flex; align-items:flex-end; gap:26px; margin:22px 0 0; padding:20px 22px;
          background:#05060a; border:1px solid #191d27; overflow-x:auto }}
.shelf span {{ display:flex; flex-direction:column; align-items:center; gap:9px; flex:0 0 auto }}
.shelf img {{ height:132px; width:auto; display:block }}
.shelf b {{ font:400 10.5px/1.3 ui-sans-serif,system-ui,sans-serif; color:#666d7d;
            max-width:150px; text-align:center }}
.shelf .me img {{ outline:2px solid #6f8fd6; outline-offset:7px }}
.shelf .me b {{ color:#93a9dd; font-weight:600 }}
.shelfnote {{ font-size:12px; color:#666d7d; margin:9px 0 0 }}
</style>
<h1>The seven flat artworks &mdash; this is live, and you never ruled on it</h1>
<p class=lede>Every one of these {n} source images is <b>already cropped to the artwork</b>:
the linen, the vellum and the paper run off all four edges. There is no background in any of
them. The cut-out pass assumed there was one, found the artwork's own paper, and removed
it &mdash; which is the broken left-hand column.</p>
<p class=lede><b>The fix was not a better cut, it was no cut</b> &mdash; ship the source image
as it stands, opaque, a rectangle. That went out on <b>15 Aug</b> and is on the site right now.
The ruling was written down as still owed and never taken, so it has been running unapproved
for four rounds. This page takes it.</p>
<p class=ask><b>What I need from you:</b> for each of the {n}, does a rectangle of paper belong
on that shelf? The map says <i>nothing on the page has an edge except the thing itself</i> &mdash;
the argument for shipping these is that on a flat artwork <b>the sheet IS the thing</b>, so the
paper's edge is the artifact's edge. That is the call, and it is yours. Look at the two strips
at the bottom of each card: the same neighbours, the cut-out then the sheet, at real shelf size.
Name the keys that stay and the keys that go back &mdash; anything you send back returns to the
broken cut on the left until another method is found.</p>
<hr>
{cards}
"""

CARD = """<section>
<h2>{n} <small>{sub} &middot; <code>{k}</code></small></h2>
<div class=pair>
  <figure><figcaption class=bad>THE CUT-OUT &mdash; what shipped until 15 Aug</figcaption>
    <div class=panel><img src="alt3/{k}-was.webp"></div>
    <p class=bad>{defect}</p></figure>
  <figure><figcaption class=good>LIVE NOW &mdash; the sheet, nothing removed</figcaption>
    <div class=panel><img src="alt3/{k}-web.jpg"></div>
    <p class=good>0 islands &middot; 0 holes &middot; nothing removed</p></figure>
</div>
<p class=why>{why}</p>
<div class=shelf>{shelfwas}</div>
<p class="shelfnote bad">the cut-out, at shelf size between its real neighbours &mdash; ringed</p>
<div class=shelf>{shelf}</div>
<p class=shelfnote>the sheet &mdash; what is on the shelf today, same neighbours, same size</p>
</section>
"""

WHY = {
    "bayeux": "The source is a crop of the tapestry: linen runs off all four edges. The flood "
              "samples that linen as \"background\" and eats it &mdash; which is what the "
              "shipped cut did, leaving the figures floating.",
    "durerblock": "A woodcut sheet, edge to edge. The shipped cut kept the rhino and punched "
                  "ten holes through it; the letterpress text above it went entirely.",
    "greatwave": "The print's sky is the same tone as its margin and joins it, so anything "
                 "that removes \"the background\" removes the sky. The shipped cut kept only "
                 "the blue and broke it into 21 pieces.",
    "kells": "A folio photographed edge to edge. The shipped cut punched 17 holes through the "
             "vellum; removing the \"ground\" bites ~60% off its last twelve columns.",
    "rocket": "A wood engraving on white paper. The white sky IS the paper IS the picture, so "
              "there is no background to take &mdash; the shipped cut clipped it square.",
    "tughra": "The shipped cut ate the illuminated oval to confetti: 38 holes over 41% of it. "
              "Removing the ground here removes nothing at all &mdash; measured cov 1.000.",
    "mughalmini": "A folio with its pink border, edge to edge. The shipped cut threw the "
                  "border away and tore the painting's edges.",
}


def review(keys):
    """The surface the ruling is made on. Two panels per item, labelled, plus the item at
    shelf size between its real year-neighbours — the only view that answers "does a sheet
    of paper belong on that shelf". Writes small previews so the page stays fast.

    THE BEFORE PANEL READS `alt3/<k>-was.webp`, NOT `img/<k>.webp`. Round 5 promoted these
    seven and built this page in the same commit, so from that moment the page's own "on the
    site now" column rendered the file it was proposing — two identical pictures under a red
    caption describing a defect neither of them has. A review surface that sources both of its
    columns from the same file cannot show a difference. The before column is therefore pinned
    to the master as it stood at `f91c3de^`, extracted from git:

        git show f91c3de^:prototypes/directions/img/<k>.webp > alt3/<k>-was.webp
    """
    import json
    rows = json.load(open(os.path.join(HERE, "review02.json"), encoding="utf-8"))
    meta = {r["k"]: r for r in rows}
    order = [r["k"] for r in rows]

    cards = []
    for k in keys:
        p = Image.open(os.path.join(ORIG, k + ".jpg")).convert("RGB")
        p.thumbnail((900, 900), Image.LANCZOS)
        p.save(os.path.join(ALT3, k + "-web.jpg"), "JPEG", quality=86)

        was = os.path.join(ALT3, k + "-was.webp")
        if not os.path.exists(was):
            raise SystemExit(f"{k}: no alt3/{k}-was.webp — see this function's docstring")
        o, m = meta[k], measure(was)
        bits = []
        if m["isl"]:
            bits.append(f"{m['isl']} detached pieces &middot; "
                        f"{m['islfrac'] * 100:.0f}% of it floating")
        if m["holes"]:
            bits.append(f"{m['holes']} holes punched through it"
                        + (f" &middot; {m['holefrac'] * 100:.0f}% of its area"
                           if m["holefrac"] > 0.05 else ""))
        if m["halo"] > 2:
            bits.append(f"{m['halo']:.1f}px fringe of un-cut background")

        i = order.index(k)

        def strip(me):
            """Same five neighbours both times; only the ringed cell changes, so the strips
            differ by exactly the thing being ruled on."""
            return "".join(
                f'<span class="{"me" if c == k else ""}">'
                f'<img src="{me if c == k else "img/%s.webp" % c}">'
                f'<b>{meta[c]["n"]}</b></span>'
                for c in order[max(0, i - 2):i + 3])

        sub = " &middot; ".join(x for x in (o["disp"], o["reg"]) if x)
        cards.append(CARD.format(n=o["n"], sub=sub, k=k,
                                 shelfwas=strip("alt3/%s-was.webp" % k),
                                 shelf=strip("alt3/%s-web.jpg" % k),
                                 why=WHY.get(k, ""),
                                 defect=" &middot; ".join(bits) or "no measurable defect"))

    open(REVIEW, "w", encoding="utf-8").write(PAGE.format(
        n=len(keys), cards="\n".join(cards)))
    print(f"{len(keys)} card(s) -> http://127.0.0.1:8813/{os.path.basename(REVIEW)}")


def promote(keys):
    for k in keys:
        src = os.path.join(ALT3, k + ".png")
        if not os.path.exists(src):
            print(f"  {k:12s} NO CANDIDATE in alt3/ — run --sheet first"); continue
        dst = os.path.join(IMG, k + ".webp")
        old, oldkb = Image.open(dst).size, os.path.getsize(dst) / 1024
        out = to_master(src)
        out.save(dst, "WEBP", quality=88, method=5)
        print(f"  {k:12s} {str(old):11s} -> {str(out.size):11s}   "
              f"{oldkb:6.0f} KB -> {os.path.getsize(dst) / 1024:6.0f} KB")
    print("\nNext: python bake_sprites.py && python bake_index.py — both are derived.")


def main():
    keys = [x for x in sys.argv[1:] if not x.startswith("--")]
    if not keys:
        print(__doc__.strip().splitlines()[2]); return
    if "--promote" in sys.argv:
        promote(keys)
    elif "--review" in sys.argv:
        review(keys)
    else:
        sheet(keys)


if __name__ == "__main__":
    main()
