"""TICKET 02 lane A — promote an approved birefnet re-cut into the MASTER set.

    python promote02.py --check      # measure only, write nothing
    python promote02.py              # replace img/<k>.webp for the 37 approved keys
    python promote02.py k1 k2        # named keys

Dustin's 2026-08-14 pass over `review02-recuts.html` flagged all 74 `ate` keys one of four
ways (issue 02). This promotes flag **3**: the re-cut replaces the master. `img/` is the
master — the licensed original, matted, and the thing every claim about the record is made
against — so this is the only script that overwrites one, and it does it under git.

A PROMOTION IS NOT A RE-ENCODE. `rematte02.py` cut the whole original frame at full
resolution (2679x4000 for armor); every shipped master is `crop(thumbnail(original, 900))`
at WEBP q88 / method 5 (`source5.py`). Handing `alt/<k>.png` straight to WEBP would drop a
9 MB uncropped frame into a folder of ~60 KB cropped ones, and gravity.js would then draw the
object at a fraction of its neighbours' size, because the sprite's transparent margin is part
of the box the page scales to 132 px. So the frame is put back on the master's terms first:

  1. resize the frame to the same 900 px cap the master was cut under, then
  2. crop to the alpha bbox — `getbbox()`, which is the alpha's bbox here because rembg
     zeroes RGB wherever alpha is 0 (verified: armor's two bboxes are identical), and
  3. WEBP quality=88, method=5 — source5.py's encode, unchanged.

Step 1 resizes PREMULTIPLIED. The shipped masters never needed this — they were cut from an
already-downsampled photo, so nothing was ever resampled across their own alpha edge. A
re-cut is, and a straight RGBA LANCZOS pass averages the object's colour against the zeroed
RGB under the transparency, laying a dark fringe around all 37 — the `halo` defect review02
exists to catch, manufactured by the promotion itself.

Reads:  alt/<key>.png    the approved re-cut (rematte02.py --ate)
Writes: img/<key>.webp   the master, REPLACED (git holds the one it replaced)

Then `python bake_sprites.py` AND `python bake_index.py` — site/img/ and site/thumb/ are
both derived and neither is touched here. **Two bakes, not one** (ticket 10): the shelf owns
assets cut at its own 80 x dpr 2 cap, and its box table lives in site/thumbs.js. Skipping
bake_index leaves the shelf drawing the new sprite scaled to the OLD one's aspect ratio —
02 round 7 moved dynatac:[55,160] -> [43,160] and nothing else in that file.
"""
import os, sys

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ALT = os.path.join(HERE, "alt")
IMG = os.path.join(HERE, "img")
FRAME_MAX = 900     # source5.py's cap, applied to the frame BEFORE the crop
QUALITY = 88        # source5.py's encode
METHOD = 5

# Flag 3 — "the birefnet re-cut replaces the master". Dustin's pass, 2026-08-14, transcribed
# from `hh02.recut.flags` into issue 02. The other three flags are not this script's business:
# 7 `original` keep the isnet cut, 28 `drop` need a different photograph, 2 `remat` need a
# third cut method.
PROMOTE = """armor asantestool astrolabe bairdtv catalhoyuk chintz chip corolla daguerreo
djembe djidrone dx7 embraer floppy gladius hyundaipony igboukwu jar kashmir lamassu lustrebowl
modelt raspberrypi ricecooker rubik ruware sasanian seikoquartz strat supercub swissknife
tamagotchi teddybear tiffanylamp tutmask ute winchester""".split()


def to_master(src):
    """alt/<k>.png -> the master's geometry and encode. Returns the RGBA image to save."""
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im, dtype=np.float32)

    if max(im.size) > FRAME_MAX:
        al = a[..., 3:4] / 255.0
        pm = np.concatenate([a[..., :3] * al, a[..., 3:4]], axis=-1)
        pm = Image.fromarray(np.clip(pm + 0.5, 0, 255).astype(np.uint8), "RGBA")
        pm.thumbnail((FRAME_MAX, FRAME_MAX), Image.LANCZOS)
        b = np.asarray(pm, dtype=np.float32)
        al = b[..., 3:4] / 255.0
        rgb = np.where(al > 0, b[..., :3] / np.maximum(al, 1e-6), 0.0)
        a = np.concatenate([rgb, b[..., 3:4]], axis=-1)
        im = Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8), "RGBA")

    bb = im.getbbox()
    return im.crop(bb) if bb else im


def main():
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    check = "--check" in sys.argv
    keys = args or PROMOTE

    done = failed = 0
    for k in keys:
        src = os.path.join(ALT, k + ".png")
        dst = os.path.join(IMG, k + ".webp")
        if not os.path.exists(src):
            print(f"  {k:14s} NO RE-CUT in alt/"); failed += 1; continue
        old = Image.open(dst).size if os.path.exists(dst) else (0, 0)
        oldb = os.path.getsize(dst) if os.path.exists(dst) else 0
        out = to_master(src)
        if not check:
            out.save(dst, "WEBP", quality=QUALITY, method=METHOD)
        newb = os.path.getsize(dst) if os.path.exists(dst) and not check else 0
        print(f"  {k:14s} {str(old):11s} -> {str(out.size):11s}   "
              f"{oldb / 1024:6.0f} KB -> {newb / 1024:6.0f} KB")
        done += 1

    print(f"\n{done} master{'s' if done != 1 else ''} "
          f"{'measured' if check else 'REPLACED'}, {failed} missing"
          + ("   (--check: nothing written)" if check else
             "\nNext: python bake_sprites.py AND python bake_index.py — site/img/ and site/thumb/"
             "\n      are both derived and both still hold the old cut."))


if __name__ == "__main__":
    main()
