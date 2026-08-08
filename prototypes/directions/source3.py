"""PROTOTYPE — pass 3. Re-source the 8 good img-ml cut-outs WITH their metadata.

matte.py wrote its cut-outs but its ml.json never survived, so those 8 images have no
recorded source/licence/credit. Citation rigor is a hard map constraint, so they are
re-fetched through the same pipeline rather than reused uncited.
"""
import io, json, os, re
import requests
from PIL import Image
from rembg import remove, new_session

UA = "HumanHistoryPrototype/0.2 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
WIKI = "https://commons.wikimedia.org/w/api.php"
CMA = "https://openaccess-api.clevelandart.org/api/artworks/"
sess = new_session("isnet-general-use")
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()


def commons(term, must, prefer=(), reject=()):
    r = S.get(WIKI, params={"action": "query", "format": "json", "list": "search",
                            "srsearch": term, "srnamespace": 6, "srlimit": 30}, timeout=40)
    ts = [t["title"] for t in r.json().get("query", {}).get("search", [])]
    ts = [t for t in ts if any(m in t.lower() for m in must)
          and not any(x in t.lower() for x in reject)
          and not t.lower().endswith((".pdf", ".svg", ".tif", ".webm"))]
    ts.sort(key=lambda t: (0 if any(p in t.lower() for p in prefer) else 1))
    if not ts:
        return None
    r = S.get(WIKI, params={"action": "query", "format": "json", "titles": "|".join(ts[:30]),
                            "prop": "imageinfo", "iiprop": "url|extmetadata",
                            "iiurlwidth": 1400}, timeout=40)
    pages = r.json().get("query", {}).get("pages", {})
    for pg in sorted(pages.values(), key=lambda p: ts.index(p["title"]) if p.get("title") in ts else 99):
        ii = (pg.get("imageinfo") or [{}])[0]
        if ii.get("thumburl"):
            em = ii.get("extmetadata", {})
            return dict(url=ii["thumburl"], src="Wikimedia Commons",
                        lic=strip((em.get("LicenseShortName") or {}).get("value")) or "public domain",
                        credit=strip((em.get("Artist") or {}).get("value")) or "unknown",
                        page=ii.get("descriptionurl"), found=pg["title"].replace("File:", ""))
    return None


def cma(q, must):
    d = S.get(CMA, params={"q": q, "cc0": 1, "has_image": 1, "limit": 20}, timeout=45).json()
    for a in d.get("data", []):
        t = (a.get("title") or "").lower()
        if must and not any(m in t for m in must):
            continue
        u = ((a.get("images") or {}).get("web") or {}).get("url")
        if u:
            return dict(url=u, src="Cleveland Museum of Art", lic="CC0",
                        credit=a.get("creditline") or "Cleveland Museum of Art",
                        page=a.get("url"), found=a.get("title"))
    return None


ITEMS = [
    ("cuneiform", "Cuneiform tablet",       -2500, "c. 2500 BCE", "Mesopotamia",
     lambda: commons("cuneiform tablet clay", ["cuneiform", "tablet"], reject=("drawing", "font"))),
    ("jomon",     "Jōmon vessel",           -3000, "c. 3000 BCE", "Japan",
     lambda: cma("Jomon vessel Japan", ["vessel", "jar"])),
    ("astrolabe", "Astrolabe",               1250, "c. 1250",     "Islamic world",
     lambda: commons("astrolabe brass", ["astrolabe"], reject=("diagram", "drawing"))),
    ("modelt",    "Ford Model T",            1908, "1908",        "United States",
     lambda: commons("Ford Model T 1908 car", ["model t", "ford"])),
    ("sputnik",   "Sputnik 1 (replica)",     1957, "1957",        "USSR",
     lambda: commons("Sputnik replica satellite museum", ["sputnik"])),
    ("aldrin",    "Buzz Aldrin on the Moon", 1969, "1969",        "Moon",
     lambda: commons("Aldrin Apollo 11 visor", ["aldrin"])),
    ("mac",       "Macintosh 128K",          1984, "1984",        "United States",
     lambda: commons("Apple Macintosh 128k computer", ["macintosh"])),
    ("vaccine",   "COVID-19 vaccine vials",  2020, "2020",        "global",
     lambda: commons("COVID-19 vaccine vial", ["vaccine", "vial"])),
]

meta = json.load(open("sourced.json", encoding="utf-8"))
for key, name, year, disp, region, gen in ITEMS:
    try:
        c = gen()
    except Exception as e:
        print(f"{key:11s} GATHER FAIL {e!r:.60}"); continue
    if not c:
        print(f"{key:11s} no candidate"); continue
    try:
        raw = S.get(c["url"], timeout=120).content
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.thumbnail((1200, 1200), Image.LANCZOS)
        cut = remove(im, session=sess, post_process_mask=True)
        bb = cut.getbbox()
        if bb:
            cut = cut.crop(bb)
        cov = sum(1 for p in cut.getdata() if p[3] > 128) / (cut.width * cut.height)
        cut.save(os.path.join("img", key + ".webp"), "WEBP", quality=88, method=5)
        c.update(key=key, name=name, year=year, disp=disp, region=region,
                 cov=round(cov, 3), size=list(cut.size))
        meta[key] = c
        print(f"{key:11s} cov={cov:.2f} {str(cut.size):12s} {c['found'][:44].encode('ascii','replace').decode()}")
    except Exception as e:
        print(f"{key:11s} CUT FAIL {e!r:.60}")

json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
names = sorted(meta, key=lambda k: meta[k]["year"])
cell, cols = 250, 6
rows = (len(names) + cols - 1) // cols
sh = Image.new("RGB", (cell * cols, cell * max(rows, 1)), (236, 72, 72))
for i, n in enumerate(names):
    im = Image.open(os.path.join("img", n + ".webp")).convert("RGBA")
    im.thumbnail((cell - 22, cell - 22), Image.LANCZOS)
    sh.paste(im, ((i % cols) * cell + (cell - im.width) // 2,
                  (i // cols) * cell + (cell - im.height) // 2), im)
sh.save("sheet.png")
print("TOTAL", len(meta))
