"""TICKET 02 lane A — re-cut a flagged master from its ORIGINAL with a second model.

The 236 shipped masters were cut by `matte.py` with rembg's `isnet-general-use`. Dustin's
review condemned 90 of them, and the `ate` list is dominated by one shape of subject: thin
structure — spokes, lattices, rigging, threads, calligraphy. That is the failure isnet is
known for and `birefnet-general` is built for, so the first question is not *which photograph
is bad* but *how many of these are the model rather than the source*.

    python rematte02.py --probe            # the 10-item proof set, + comparison sheets
    python rematte02.py --ate              # the 74 `ate` keys — the ones the swap actually moves
    python rematte02.py --flagged          # all 90
    python rematte02.py k1 k2 k3           # named keys

The probe answered the question it was built for and the answer was HALF: birefnet fixes the
shredding and the punched-through interior (bayeux 17 detached -> 0 with its text legible again,
tughra 38 holes -> 0) and does nothing for retained museum furniture (spinjenny keeps the whole
stanchion, v2 the rail, winchester the rack) — which is exactly the `ate` / `bg` line Dustin's
own flags drew. So `--ate` is the run that pays, and the 21 `bg` need a crop or a new source.

Sheets come out ranked by how much the cut actually changed, biggest first, so the wins are on
sheet 1 and the no-ops are at the back — with 74 items nobody reads 15 sheets in file order.

Reads:  orig/<key>.jpg   (never img/ — re-cutting a cut-out would compound the first mistake)
Writes: alt/<key>.png    the second opinion, RGBA
        alt/rematte02.json   old vs new numbers, review02.measure() on both
        rematte-sheet-N.png  original | current cut | re-cut, on checks, for the eye

Nothing here touches site/ or img/. A re-cut is a candidate until Dustin says otherwise.
"""
import json, os, sys
from PIL import Image, ImageDraw
from rembg import remove, new_session

from review02 import measure, HERE

ORIG = os.path.join(HERE, "orig")
ALT = os.path.join(HERE, "alt")
IMG = os.path.join(HERE, "img")
MODEL = "birefnet-general"

# Dustin's review, 2026-08-14. `ate` = the cut took object with it; `bg` = it left background.
ATE = """airjordan apollosuit armor asantestool astrolabe aztecserpent bairdtv bajaj batik2 bayeux
bulb catalhoyuk chintz chip corolla crossbow daguerreo djembe djidrone durerblock dx7 dynatac
embraer eniac enigma floppy funangold gladius godrej greatwave hyundaipony igboukwu jar jeep
kashmir kells lamassu lustrebowl modelt mughalmini raspberrypi ricecooker rocket rubik ruware
safetybike sasanian seikoquartz snowgoggles spinjenny spitfire stainedglass stickchart strat
supercub swissknife talwar tamagotchi teddybear telescope terracotta tiffanylamp trinitron tughra
tutmask unitree ute v2 vhs visionpro wampum wattengine winchester zero""".split()
BG = """abacus amphora bajaj benz cd chimu cybertruck djembe flyer flyingpigeon karagoz mini moai2
neogeo pennyfarthing phone torch2 unitree v2 vindolanda winchester""".split()
FLAGGED = sorted(set(ATE) | set(BG))

# five flagged BOTH ways (the mask is wrong in both directions) plus five whose subject is the
# thin structure the model swap is aimed at — if birefnet cannot move these, it cannot move any.
PROBE = ["bajaj", "djembe", "unitree", "v2", "winchester",
         "stickchart", "safetybike", "bayeux", "tughra", "spinjenny"]

CHECK = None


def checks(w, h, sq=16):
    """One shared checkerboard — kept background is opaque against it, a halo is a grey fringe."""
    global CHECK
    if CHECK is None or CHECK.size[0] < w or CHECK.size[1] < h:
        c = Image.new("RGB", (max(w, 1200), max(h, 1200)), "#dddddd")
        d = ImageDraw.Draw(c)
        for y in range(0, c.size[1], sq):
            for x in range(0, c.size[0], sq):
                if (x // sq + y // sq) % 2:
                    d.rectangle([x, y, x + sq, y + sq], fill="#999999")
        CHECK = c
    return CHECK.crop((0, 0, w, h)).copy()


def fit(im, box):
    """Contain, on checks, so every column is measured at the same scale."""
    im = im.copy()
    im.thumbnail((box, box), Image.LANCZOS)
    bg = checks(box, box)
    if im.mode == "RGBA":
        bg.paste(im, ((box - im.size[0]) // 2, (box - im.size[1]) // 2), im)
    else:
        bg.paste(im.convert("RGB"), ((box - im.size[0]) // 2, (box - im.size[1]) // 2))
    return bg


def recut(k, sess):
    src = os.path.join(ORIG, k + ".jpg")
    if not os.path.exists(src):
        return None, "no original"
    dest = os.path.join(ALT, k + ".png")
    # birefnet is ~5 min/item on this CPU, so 74 of them is a run a sleeping laptop can
    # interrupt. The cut is deterministic, so an existing alt/ file is resumed, not redone.
    if os.path.exists(dest):
        return dest, None
    out = remove(Image.open(src).convert("RGB"), session=sess)
    out.save(dest)
    return dest, None


def sheet(keys, n, box=400):
    """original | current cut | re-cut. The eye is the instrument; the numbers only rank."""
    rows = [k for k in keys if os.path.exists(os.path.join(ALT, k + ".png"))]
    im = Image.new("RGB", (box * 3, (box + 22) * len(rows)), "#141414")
    d = ImageDraw.Draw(im)
    for i, k in enumerate(rows):
        y = i * (box + 22)
        d.text((6, y + 5), f"{k}   original | current cut | re-cut ({MODEL})", fill="#e8e6e2")
        for j, p in enumerate([os.path.join(ORIG, k + ".jpg"), os.path.join(IMG, k + ".webp"),
                               os.path.join(ALT, k + ".png")]):
            if os.path.exists(p):
                im.paste(fit(Image.open(p), box), (j * box, y + 22))
    p = os.path.join(HERE, f"rematte-sheet-{n}.png")
    im.save(p)
    return p


def main():
    os.makedirs(ALT, exist_ok=True)
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    keys = (PROBE if "--probe" in sys.argv else sorted(ATE) if "--ate" in sys.argv
            else FLAGGED if "--flagged" in sys.argv else args)
    if not keys:
        print(__doc__); return

    print(f"loading {MODEL} (first run downloads it) …")
    sess = new_session(MODEL)
    log = {}
    for i, k in enumerate(keys):
        dest, err = recut(k, sess)
        if err:
            print(f"  {k:14s} {err}"); continue
        old = measure(os.path.join(IMG, k + ".webp"))
        new = measure(dest)
        log[k] = dict(old=old, new=new)
        # the one number that says "it ate less": more of the object survived the cut
        grew = (new["cov"] / old["cov"] - 1) * 100 if old and new else 0
        print(f"  {k:14s} cov {old['cov']:.3f} -> {new['cov']:.3f} ({grew:+.0f}%)   "
              f"isl {old['isl']}->{new['isl']}  holes {old['holes']}->{new['holes']}")
        if (i + 1) % 20 == 0:
            print(f"  {i + 1}/{len(keys)}")
    json.dump(log, open(os.path.join(ALT, "rematte02.json"), "w"), indent=1)

    # ranked by the two signals the swap is known to move, not by cov: a master is cropped to
    # its object and a re-cut is the whole original frame, so their cov values are not the
    # same measurement and the percentage the loop prints above is not comparable.
    moved = lambda k: ((log[k]["old"]["isl"] - log[k]["new"]["isl"])
                       + (log[k]["old"]["holes"] - log[k]["new"]["holes"]) * 0.2)
    order = sorted(log, key=moved, reverse=True)
    for n, i in enumerate(range(0, len(order), 5), 1):
        print("sheet ->", sheet(order[i:i + 5], n))
    print(f"\n{len(order)} re-cut. Sheets are ranked by how much the cut moved — "
          f"the wins are on sheet 1, the no-ops at the back.")


if __name__ == "__main__":
    main()
