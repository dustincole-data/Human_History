"""TICKET 02 — the cut-out review surface. Measure the MASTERS; never touch them.

`source5.py --sheets` renders labelled contact sheets, which is the right instrument for
"is this the wrong object" and the wrong one for "did the remover eat it / miss some
background": a PNG has one background, and each of those two faults is invisible against
some backgrounds and obvious against others. This writes the numbers; review02.html is the
surface that shows them over four grounds at once.

    python review02.py                 # measure all 236 shipped masters -> review02.json
    python review02.py --serve         # measure (if absent) and serve on 127.0.0.1:8813
    python review02.py --recuts        # rank alt/'s re-cuts -> review02-recuts.json (see below)

8813, not the harness's 8812: sweep10 defaults to `http://127.0.0.1:8812` and expects `site/`
to be what is behind it, so a review server left running on that port silently becomes the
thing the gates measure.

Reads:  ../../site/data.js (the 236 that shipped, and their record fields)
        sourced.json       (the DIRECT image URL each master was cut from)
        img/<key>.webp     (the masters — opened read-only)
Writes: review02.json      (this directory only; nothing under site/ is read-written or served)

--recuts is lane A's second surface: rematte02.py --ate already ran measure() on every shipped
master and its birefnet re-cut (alt/rematte02.json). This never re-measures — it just ranks
those keys by the same isl/holes-moved score rematte02.py sorts its sheets by, and merges in
each key's own review02.json row for metadata, so review02-recuts.html can show
original | current cut | re-cut per item without touching img/ or site/. Serves alongside
review02.html on the same 8813 once --serve is passed.

The two failure modes, and the signal that finds each:

  IT ATE PART OF THE OBJECT   an enclosed transparent region inside the silhouette (`holes`,
      `holefrac`). Honest false positives exist by the hundred — a handle gap, a ring, a
      lattice — which is why this ranks rather than judges.
  IT LEFT BACKGROUND BEHIND   four independent tells, because no one of them is reliable:
      a detached component (`isl`, `islfrac`) is a speck of floor or wall kept whole;
      `corners` and `border` catch a rectangular slab retained around the object;
      `cov` near 1 says the silhouette is a box; `halo` is the mean alpha ramp width in
      pixels, so a soft fringe of un-cut background shows as a number > ~2.
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "img")
DATA = os.path.abspath(os.path.join(HERE, "..", "..", "site", "data.js"))
OUT = os.path.join(HERE, "review02.json")


def shipped():
    """The 236 as the site itself defines them. data.js is a JS object literal, so node reads it."""
    js = ("const fs=require('fs');global.window={};"
          "eval(fs.readFileSync(process.argv[1],'utf8'));"
          "process.stdout.write(JSON.stringify(window.ITEMS));")
    r = subprocess.run(["node", "-e", js, DATA], capture_output=True, timeout=60)
    return json.loads(r.stdout.decode("utf-8"))


def measure(path):
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im)[:, :, 3]
    h, w = a.shape
    any_ = a > 0
    mask = a >= 128
    obj = int(mask.sum())
    if not obj:
        return None

    # halo — mean alpha ramp width in px: soft pixels per pixel of silhouette edge.
    pad = np.pad(mask, 1)
    edge = mask & ~(pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:])
    soft = int(((a > 8) & (a < 248)).sum())
    halo = soft / max(int(edge.sum()), 1)

    # islands — everything that is not the largest connected component
    lab, n = ndimage.label(mask)
    areas = np.bincount(lab.ravel())[1:] if n else np.array([0])
    big = int(areas.max())
    floor = max(30, 0.002 * obj)
    isl = int((areas >= floor).sum()) - 1
    islfrac = (obj - big) / obj

    # holes — background components that touch no image border are enclosed by the object
    lab2, n2 = ndimage.label(~mask)
    outside = set(lab2[0, :]) | set(lab2[-1, :]) | set(lab2[:, 0]) | set(lab2[:, -1]) | {0}
    hareas = np.bincount(lab2.ravel())
    inner = [int(hareas[i]) for i in range(1, n2 + 1) if i not in outside]
    holes = sum(1 for v in inner if v >= floor)
    holefrac = sum(inner) / (obj + sum(inner)) if inner else 0.0

    # a retained rectangular slab fills the bbox corners and runs along its perimeter
    c = max(6, int(0.03 * min(w, h)))
    corners = sum(mask[y:y + c, x:x + c].mean() > 0.5
                  for y in (0, h - c) for x in (0, w - c))
    perim = np.concatenate([mask[0, :], mask[-1, :], mask[:, 0], mask[:, -1]])

    return dict(w=w, h=h, ar=round(w / h, 3),
                cov=round(obj / (w * h), 4),
                solid=round(float((a == 255).sum()) / max(int(any_.sum()), 1), 4),
                halo=round(halo, 2),
                isl=isl, islfrac=round(float(islfrac), 4),
                holes=holes, holefrac=round(float(holefrac), 4),
                corners=int(corners), border=round(float(perim.mean()), 4),
                kb=round(os.path.getsize(path) / 1024, 1))


def build():
    src = json.load(open(os.path.join(HERE, "sourced.json"), encoding="utf-8"))
    rows = []
    for i, it in enumerate(shipped()):
        k = it["k"]
        m = measure(os.path.join(IMG, k + ".webp"))
        if m is None:
            print(f"{k:14s} EMPTY MASTER"); continue
        s = src.get(k, {})
        rows.append(dict(k=k, n=it["n"], y=it["y"], disp=it["disp"], reg=it["reg"],
                         b=it["b"], t=it["t"], f=it["f"], lic=it["lic"], cred=it["cred"],
                         page=it["url"], srcurl=s.get("url"), found=s.get("found"),
                         # the originals were never retained; this is 1 only once a re-fetch
                         # pass has run, and it is read here so the page never probes for 404s
                         o=int(os.path.exists(os.path.join(HERE, "orig", k + ".jpg"))), **m))
        if (i + 1) % 40 == 0:
            print(f"  {i + 1}/236")
    json.dump(rows, open(OUT, "w", encoding="utf-8"), ensure_ascii=False,
              separators=(",", ":"))
    nourl = sum(1 for r in rows if not r["srcurl"])
    print(f"{len(rows)} measured -> review02.json   ({nourl} have no direct source URL)")


def build_recuts():
    """The 74 `ate` keys, ranked by how much birefnet moved them. Reads alt/rematte02.json
    (old vs new measure(), already computed by rematte02.py --ate) and review02.json (this
    key's own shipped-master row); writes review02-recuts.json. Never re-measures."""
    alt = os.path.join(HERE, "alt")
    log = json.load(open(os.path.join(alt, "rematte02.json"), encoding="utf-8"))
    base = {r["k"]: r for r in json.load(open(OUT, encoding="utf-8"))}
    moved = lambda k: ((log[k]["old"]["isl"] - log[k]["new"]["isl"])
                       + (log[k]["old"]["holes"] - log[k]["new"]["holes"]) * 0.2)
    rows = [dict(base[k], moved=round(moved(k), 3), new=log[k]["new"])
            for k in sorted(log, key=moved, reverse=True) if k in base]
    dest = os.path.join(HERE, "review02-recuts.json")
    json.dump(rows, open(dest, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"{len(rows)} recuts -> review02-recuts.json")


if __name__ == "__main__":
    if "--serve" not in sys.argv or not os.path.exists(OUT):
        build()
    if "--recuts" in sys.argv:
        build_recuts()
    if "--serve" in sys.argv:
        os.chdir(HERE)
        import http.server, socketserver
        http.server.SimpleHTTPRequestHandler.extensions_map[".webp"] = "image/webp"
        with socketserver.TCPServer(("127.0.0.1", 8813),
                                    http.server.SimpleHTTPRequestHandler) as srv:
            print("http://127.0.0.1:8813/review02.html")
            if "--recuts" in sys.argv:
                print("http://127.0.0.1:8813/review02-recuts.html")
            srv.serve_forever()
