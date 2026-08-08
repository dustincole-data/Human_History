"""Gradient-aware knockout, extracted from the anchor-preview build (2026-08-08).

`knock()` region-grows from the border on LOCAL similarity, so it walks down a museum sweep's
gradient and stops at the object's edge. A fixed-tolerance flood against a single background
colour leaves grey halos on every museum object — that was the first thing to get fixed.

Two parameters, and they trade off directly:
  local  — max colour step between adjacent background pixels. Too high chews into pale objects,
           too low leaves the sweep behind.
  leash  — max drift from the border colour before the walk stops.

No single (local, leash) worked for all candidates: roughly two-thirds passed on the defaults and
the rest needed their own. See README.md — that does not scale to 200-400 images.

Validate by ALPHA COVERAGE, not by border cleanliness: a real object leaves 10-70% coverage, a
scan or painting leaves ~100%. Border-cleanliness scoring selects flat rectangles, which the
site's NOT list bans.
"""
import io, json, os, re
from collections import deque
import numpy as np
import requests
from PIL import Image, ImageFilter

UA = "HumanHistoryPreview/0.1 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "cut3")
WIKI = "https://commons.wikimedia.org/w/api.php"
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()


def knock(im, local=26, leash=150):
    im = im.convert("RGB"); im.thumbnail((980, 980), Image.LANCZOS)
    a = np.asarray(im).astype(np.int16); h, w, _ = a.shape
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(border, axis=0)
    drift = np.abs(a - bg).sum(axis=2)
    seen = np.zeros((h, w), bool); q = deque()
    for y, x in ([(0, x) for x in range(w)] + [(h-1, x) for x in range(w)] +
                 [(y, 0) for y in range(h)] + [(y, w-1) for y in range(h)]):
        if drift[y, x] < leash and not seen[y, x]:
            seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft(); cur = a[y, x]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y+dy, x+dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and drift[ny, nx] < leash:
                if (abs(int(a[ny,nx,0])-int(cur[0])) + abs(int(a[ny,nx,1])-int(cur[1]))
                        + abs(int(a[ny,nx,2])-int(cur[2]))) < local:
                    seen[ny, nx] = True; q.append((ny, nx))
    am = Image.fromarray(np.where(seen, 0, 255).astype(np.uint8), "L")
    am = am.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.7))
    cov = float((np.asarray(am) > 128).mean())
    rgba = im.convert("RGBA"); rgba.putalpha(am)
    bb = rgba.getbbox()
    return (rgba.crop(bb) if bb else rgba), cov


def get(u):
    b = S.get(u, timeout=60).content
    im = Image.open(io.BytesIO(b)); im.load(); return im


def commons(term, must, n=22):
    r = S.get(WIKI, params={"action":"query","format":"json","list":"search",
                            "srsearch":term,"srnamespace":6,"srlimit":n}, timeout=40)
    ts = [t["title"] for t in r.json().get("query",{}).get("search",[])]
    ts = [t for t in ts if any(m in t.lower() for m in must) and not t.lower().endswith(".pdf")]
    if not ts: return
    r = S.get(WIKI, params={"action":"query","format":"json","titles":"|".join(ts[:40]),
                            "prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":900}, timeout=40)
    for _, pg in r.json().get("query",{}).get("pages",{}).items():
        ii = (pg.get("imageinfo") or [{}])[0]
        if not ii.get("thumburl"): continue
        em = ii.get("extmetadata", {})
        yield dict(title=pg["title"].replace("File:",""),
                   lic=strip((em.get("LicenseShortName") or {}).get("value")),
                   credit=strip((em.get("Artist") or {}).get("value")),
                   page=ii.get("descriptionurl"), url=ii["thumburl"],
                   src="Wikimedia Commons", date=None, culture=None)

