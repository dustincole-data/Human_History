"""PROTOTYPE — pass 2. Fixes the misses from source.py, verified against sheet.png.

Dropped on visual inspection (wrong subject or unrecognisable cut), not on a score:
  antikythera  a green corroded lump — nobody reads it as a mechanism
  moai         shredded cut, black blobs
  singer       returned a toy sewing-machine BOX, not a sewing machine
  gameboy      mask failure along the bottom third

Merges into sourced.json rather than replacing it.
"""
import io, json, os, re
import requests
from PIL import Image
from rembg import remove, new_session

UA = "HumanHistoryPrototype/0.2 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
OUT = "img"; os.makedirs(OUT, exist_ok=True)
WIKI = "https://commons.wikimedia.org/w/api.php"
MET = "https://collectionapi.metmuseum.org/public/collection/v1"
sess = new_session("isnet-general-use")
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()
DROP = {"antikythera", "moai", "singer"}


def commons(term, must, prefer=(), reject=()):
    r = S.get(WIKI, params={"action": "query", "format": "json", "list": "search",
                            "srsearch": term, "srnamespace": 6, "srlimit": 40}, timeout=40)
    ts = [t["title"] for t in r.json().get("query", {}).get("search", [])]
    ts = [t for t in ts if any(m in t.lower() for m in must)
          and not any(x in t.lower() for x in reject)
          and not t.lower().endswith((".pdf", ".svg", ".ogv", ".webm", ".tif"))]
    ts.sort(key=lambda t: (0 if any(p in t.lower() for p in prefer) else 1))
    if not ts:
        return None
    r = S.get(WIKI, params={"action": "query", "format": "json", "titles": "|".join(ts[:40]),
                            "prop": "imageinfo", "iiprop": "url|extmetadata",
                            "iiurlwidth": 1400}, timeout=40)
    pages = r.json().get("query", {}).get("pages", {})
    ordered = sorted(pages.values(), key=lambda p: ts.index(p["title"]) if p.get("title") in ts else 99)
    for pg in ordered:
        ii = (pg.get("imageinfo") or [{}])[0]
        if not ii.get("thumburl"):
            continue
        em = ii.get("extmetadata", {})
        return dict(url=ii["thumburl"], src="Wikimedia Commons",
                    lic=strip((em.get("LicenseShortName") or {}).get("value")) or "public domain",
                    credit=strip((em.get("Artist") or {}).get("value")) or "unknown",
                    page=ii.get("descriptionurl"), found=pg["title"].replace("File:", ""))
    return None


def met(q, must, reject=()):
    ids = (S.get(MET + "/search", params={"q": q, "hasImages": "true", "isPublicDomain": "true"},
                 timeout=45).json().get("objectIDs") or [])[:30]
    for oid in ids:
        try:
            o = S.get(f"{MET}/objects/{oid}", timeout=30).json()
        except Exception:
            continue
        t = (o.get("title") or "").lower()
        if must and not any(m in t for m in must):
            continue
        if any(x in t for x in reject):
            continue
        u = o.get("primaryImage") or o.get("primaryImageSmall")
        if u:
            return dict(url=u, src="The Met", lic="CC0", credit=o.get("creditLine") or "The Met",
                        page=o.get("objectURL"), found=o.get("title"))
    return None


ITEMS = [
    ("tutmask",    "Mask of Tutankhamun",       -1323, "c. 1323 BCE", "Egypt",
     lambda: commons("Tutankhamun mask Cairo museum gold", ["mask", "tut"], prefer=("tut",))),
    ("terracotta", "Terracotta Army warrior",    -210, "c. 210 BCE",  "China",
     lambda: commons("Terracotta Army", ["terracotta", "terrakotta"],
                     prefer=("warrior", "soldier", "figure"), reject=("museum interior", "pit"))),
    ("buddha",     "Standing Buddha, Gandhara",   200, "c. 200 CE",   "Gandhara",
     lambda: met("Standing Buddha Gandhara schist", ["buddha"])),
    ("romanglass", "Roman glass bottle",          100, "c. 100 CE",   "Roman Empire",
     lambda: met("Roman glass bottle blown", ["bottle", "flask", "jug"], reject=("fragment",))),
    ("telescope",  "Galileo's telescope",        1609, "1609",        "Italy",
     lambda: commons("Galileo telescope Museo Galileo", ["telescope", "cannocchiale"], prefer=("galileo",))),
    ("steamengine", "Watt beam engine",          1788, "1788",        "United Kingdom",
     lambda: commons("Watt steam engine beam", ["watt", "steam engine", "beam engine"],
                     reject=("diagram", "plan"))),
    ("gramophone", "Berliner gramophone",        1900, "c. 1900",     "United States",
     lambda: commons("Berliner gramophone horn", ["gramophone", "grammophon", "phonograph"],
                     reject=("record", "disc", "logo"))),
    ("sewing",     "Singer sewing machine",      1890, "c. 1890",     "United States",
     lambda: commons("Singer sewing machine treadle antique", ["sewing machine", "nähmaschine"],
                     reject=("box", "toy", "advert", "poster", "shop", "factory"))),
    ("gameboy",    "Nintendo Game Boy",          1989, "1989",        "Japan",
     lambda: commons("Nintendo Game Boy console Evan-Amos", ["game boy", "game-boy", "gameboy"],
                     prefer=("fl", "evan"), reject=("advance", "color", "micro", "pocket", "sp"))),
    ("polaroid",   "Polaroid SX-70",             1972, "1972",        "United States",
     lambda: commons("Polaroid SX-70 camera", ["sx-70", "sx70", "polaroid"], reject=("photo taken",))),
    ("rubik",      "Rubik's Cube",               1974, "1974",        "Hungary",
     lambda: commons("Rubik's Cube solved", ["rubik"], reject=("algorithm", "diagram", "notation"))),
]

meta = json.load(open("sourced.json", encoding="utf-8")) if os.path.exists("sourced.json") else {}
for k in DROP:
    meta.pop(k, None)

for key, name, year, disp, region, gen in ITEMS:
    try:
        c = gen()
    except Exception as e:
        print(f"{key:12s} GATHER FAIL {e!r:.60}"); continue
    if not c:
        print(f"{key:12s} no candidate"); continue
    try:
        raw = S.get(c["url"], timeout=120).content
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.thumbnail((1200, 1200), Image.LANCZOS)
        cut = remove(im, session=sess, post_process_mask=True)
        bb = cut.getbbox()
        if bb:
            cut = cut.crop(bb)
        cov = sum(1 for p in cut.getdata() if p[3] > 128) / (cut.width * cut.height)
        cut.save(os.path.join(OUT, key + ".webp"), "WEBP", quality=88, method=5)
        c.update(key=key, name=name, year=year, disp=disp, region=region,
                 cov=round(cov, 3), size=list(cut.size))
        meta[key] = c
        print(f"{key:12s} cov={cov:.2f} {str(cut.size):12s} {str(c['found'])[:44].encode('ascii','replace').decode()}")
    except Exception as e:
        print(f"{key:12s} CUT FAIL {e!r:.60}")

json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)

names = sorted(meta, key=lambda k: meta[k]["year"])
cell, cols = 260, 6
rows = (len(names) + cols - 1) // cols
sheet = Image.new("RGB", (cell * cols, cell * max(rows, 1)), (236, 72, 72))
for i, n in enumerate(names):
    im = Image.open(os.path.join(OUT, n + ".webp")).convert("RGBA")
    im.thumbnail((cell - 22, cell - 22), Image.LANCZOS)
    sheet.paste(im, ((i % cols) * cell + (cell - im.width) // 2,
                     (i // cols) * cell + (cell - im.height) // 2), im)
sheet.save("sheet.png")
print(f"\nTOTAL {len(meta)} sourced")
