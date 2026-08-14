"""Bake the page's sprites from the master cut-outs — ticket 03, the texture window.

    python bake_sprites.py            # write ../../site/img
    python bake_sprites.py --check    # measure only, touch nothing

`img/` here is the master: the licensed original, matted by source5.py, and the thing every
claim about the record is made against. It is never overwritten by this script.

`../../site/img/` is a DERIVED asset — the sprite the live page fetches — and until now it was a
byte-identical copy of the master, which is 301 MB decoded for 230 items against an 80 MB gate.

The cap is not a taste call. gravity.js draws every sprite at exactly `hh = 132` CSS px tall at
every viewport, and clamps its canvas to `dpr = min(devicePixelRatio, 2)`. So 132 x 2 = 264
device px is the largest height any sprite is ever rasterised at, on any screen, at any zoom —
a row of source pixels above that is decoded, held for the life of the page, and then thrown
away by the resampler on its way to the screen. Both numbers are asserted by the sweep
(`sprite_never_exceeds_its_draw`), so a change to either side is a red gate rather than a silent
regression here.

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

DRAW_PX = 132       # gravity.js prep(): hh
DPR_CAP = 2         # gravity.js fit(): Math.min(devicePixelRatio, 2)
CAP = DRAW_PX * DPR_CAP

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

        if h > CAP:
            s = CAP / h
            nw, nh = max(1, round(w * s)), CAP
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

    mb = lambda b: b / 1048576
    print(f"{len(ks)} sprites   {scaled} downscaled to {CAP}px   {copied} already under the cap")
    if missing:
        print(f"MISSING FROM MASTER ({len(missing)}): {', '.join(missing[:8])}")
    print(f"decoded   {mb(dec_in):7.1f} MB -> {mb(dec_out):7.1f} MB")
    print(f"transfer  {mb(tx_in):7.1f} MB -> {mb(tx_out):7.1f} MB")
    print(f"cap       {DRAW_PX}px drawn x dpr {DPR_CAP} = {CAP}px")
    if args.check:
        print("(--check: nothing written)")


if __name__ == "__main__":
    main()
