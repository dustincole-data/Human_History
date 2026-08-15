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

Two modes, because a flat artwork has two honest readings and they are not the same picture:

  ground  the sheet is the object. Transparency floods in from the border and stops at the
          first thing that is not the ground. For a 3-D object on white this is simply the
          true silhouette (vhs). For a print it keeps the paper.
  ink     the ink is the object. Threshold higher, close the gaps between strokes, then fill
          what they enclose. Keeps the item in the same visual class as every other silhouette
          on the shelf, and fixes the confetti (tughra's oval comes out solid).

Neither is automatic and neither is a default: `MODE` records the call per key, and a key with
no entry is cut both ways onto the sheet so the choice is made by eye, as every other cut on
this ticket has been.

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


CUT = {"ground": cut_ground, "ink": cut_ink}


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
    box, rows = (330, 330), []
    for k in keys:
        modes = [MODE[k]] if k in MODE else ["ground", "ink"]
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
          f"   columns: original | shipped | " + " | ".join(["ground", "ink"][:w - 2]))


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
    else:
        sheet(keys)


if __name__ == "__main__":
    main()
