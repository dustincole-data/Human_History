"""Bake the page's sprites from the master cut-outs — ticket 03, the texture window.

    python bake_sprites.py            # write ../../site/img
    python bake_sprites.py --check    # measure only, touch nothing

`img/` here is the master: the licensed original, matted by source5.py, and the thing every
claim about the record is made against. It is never overwritten by this script.

`../../site/img/` is a DERIVED asset — the sprite the live page fetches — and until now it was a
byte-identical copy of the master, which is 301 MB decoded for 230 items against an 80 MB gate.

The cap is not a taste call, and TICKET 02 MOVED WHAT IT IS A CAP ON. Ticket 03's rule was a
height: gravity.js drew every sprite `hh = 132` CSS px tall, so 132 x dpr 2 = 264 device px was
the tallest any photograph was ever rasterised at and every source row above it was decoded,
held for the life of the page, and then thrown away by the resampler.

02 made the drawn size an AREA — `w = sqrt(A·ar)`, `h = sqrt(A/ar)` — because one height across
229 aspect ratios is one size only for squares, and the set spans 0.19 to 5.85. The drawn height
is now a function of each photograph's own ratio, so it is no longer the thing to cap. The area
is: every object is drawn at `WEB_A` px² of glass at most, at any viewport, so
`WEB_A x dpr² = 139,392` DECODED PIXELS is what no sprite may exceed, whatever shape it is. Same
claim as 03's, same reason, one dimension up — and it is now a flat per-sprite bound rather than
one that let a wide object hold four times what a tall one did.

Both numbers are asserted by the sweep (`sprite_never_exceeds_its_draw`), so a change to either
side is a red gate rather than a silent 300 MB.

Nothing is upscaled. A sprite already under the cap is re-encoded at its own size.
"""

import argparse
import os
import re
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
MASTER = os.path.join(HERE, "img")
OUT = os.path.abspath(os.path.join(HERE, "..", "..", "site", "img"))
DATA = os.path.abspath(os.path.join(HERE, "..", "..", "site", "data.js"))

WEB_A = round(132 * 132 * 2.0)   # gravity.js: the largest area an object is ever drawn at
DPR_CAP = 2                      # gravity.js fit(): Math.min(devicePixelRatio, 2)
CAP = WEB_A * DPR_CAP * DPR_CAP  # decoded pixels, per sprite, whatever its shape

# The masters are already lossy WebP (q88), so the bake is a SECOND lossy pass over the site's
# central asset. Measured inside the alpha mask, q90 cost up to 10% of a sprite's pixels a
# visible step and q95 halved that for +25% bytes — 5.2 MB -> 6.6 MB over a set that is now
# streamed a handful at a time rather than fetched up front. Cheap, on the one thing the piece
# claims. Alpha is never lossy: the alpha channel IS the asset (burial.js).
QUALITY = 95
ALPHA_QUALITY = 100
METHOD = 6


def keys():
    """The set the page actually loads, read off data.js rather than off the folder."""
    src = open(DATA, encoding="utf-8").read()
    return re.findall(r'\{k:"([^"]+)"', src)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="measure only, write nothing")
    args = ap.parse_args()

    ks = keys()
    if not ks:
        sys.exit("no keys in data.js")
    os.makedirs(OUT, exist_ok=True)

    dec_in = dec_out = tx_in = tx_out = 0
    scaled = copied = 0
    missing = []

    for k in ks:
        src = os.path.join(MASTER, k + ".webp")
        if not os.path.exists(src):
            missing.append(k)
            continue
        im = Image.open(src)
        im.load()
        w, h = im.size
        dec_in += w * h * 4
        tx_in += os.path.getsize(src)

        if w * h > CAP:
            s = (CAP / (w * h)) ** 0.5          # both sides together: the ratio is the photograph's
            nw, nh = max(1, round(w * s)), max(1, round(h * s))
            out = im.convert("RGBA").resize((nw, nh), Image.LANCZOS)
            scaled += 1
        else:
            nw, nh = w, h
            out = im.convert("RGBA")
            copied += 1

        dst = os.path.join(OUT, k + ".webp")
        if not args.check:
            out.save(dst, "WEBP", quality=QUALITY, alpha_quality=ALPHA_QUALITY, method=METHOD)
        dec_out += nw * nh * 4
        tx_out += os.path.getsize(dst) if os.path.exists(dst) else 0

    # An item can now LEAVE the set (02 lane B dropped ten), and until this ran, a dropped item's
    # sprite stayed in the deploy root forever: still uploaded, still public, and invisible to
    # every gate, because the gates measure what the page LOADS. A derived directory has to mirror
    # its source in both directions. The master in img/ is never touched — that is the record of
    # what was tried.
    keep = set(ks)
    orphans = [f for f in os.listdir(OUT) if f.endswith(".webp") and f[:-5] not in keep]
    for f in orphans:
        if not args.check:
            os.remove(os.path.join(OUT, f))

    mb = lambda b: b / 1048576
    print(f"{len(ks)} sprites   {scaled} downscaled to {CAP} px²   {copied} already under the cap")
    if orphans:
        print(f"{'would remove' if args.check else 'removed'} {len(orphans)} no longer in data.js: "
              f"{', '.join(sorted(o[:-5] for o in orphans))}")
    if missing:
        print(f"MISSING FROM MASTER ({len(missing)}): {', '.join(missing[:8])}")
    print(f"decoded   {mb(dec_in):7.1f} MB -> {mb(dec_out):7.1f} MB")
    print(f"transfer  {mb(tx_in):7.1f} MB -> {mb(tx_out):7.1f} MB")
    print(f"cap       {WEB_A}px² drawn x dpr {DPR_CAP}² = {CAP}px² per sprite")
    if args.check:
        print("(--check: nothing written)")


if __name__ == "__main__":
    main()
