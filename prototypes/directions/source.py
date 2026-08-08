"""PROTOTYPE — source named artifacts for ticket 13's three visual directions.

Not the arrival set (that's 05). This is enough real, cited, licence-clean material
to make three directions judgeable: global coverage, a usable deep head, and enough
post-1500 density to actually show crowding.

Every entry NAMES A SPECIFIC ARTIFACT, not a search term — 02 measured that an
automated top-hit search returns salt-and-pepper shakers. `must` tokens are the guard;
the contact sheet is the verification.

Run: python source.py    (writes img/, sourced.json, sheet.png)
"""
import io, json, os, re, sys, time
import requests
from PIL import Image
from rembg import remove, new_session

UA = "HumanHistoryPrototype/0.2 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
OUT = "img"; os.makedirs(OUT, exist_ok=True)
WIKI = "https://commons.wikimedia.org/w/api.php"
MET  = "https://collectionapi.metmuseum.org/public/collection/v1"
sess = new_session("isnet-general-use")
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()


def commons(term, must, prefer=()):
    r = S.get(WIKI, params={"action": "query", "format": "json", "list": "search",
                            "srsearch": term, "srnamespace": 6, "srlimit": 30}, timeout=40)
    ts = [t["title"] for t in r.json().get("query", {}).get("search", [])]
    ts = [t for t in ts if any(m in t.lower() for m in must)
          and not t.lower().endswith((".pdf", ".svg", ".ogv", ".webm", ".tif"))]
    ts.sort(key=lambda t: (0 if any(p in t.lower() for p in prefer) else 1))
    if not ts:
        return None
    r = S.get(WIKI, params={"action": "query", "format": "json", "titles": "|".join(ts[:30]),
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


def met(q, must, dept=None):
    p = {"q": q, "hasImages": "true", "isPublicDomain": "true"}
    if dept:
        p["departmentId"] = dept
    ids = (S.get(MET + "/search", params=p, timeout=45).json().get("objectIDs") or [])[:25]
    for oid in ids:
        try:
            o = S.get(f"{MET}/objects/{oid}", timeout=30).json()
        except Exception:
            continue
        t = (o.get("title") or "").lower()
        if must and not any(m in t for m in must):
            continue
        u = o.get("primaryImage") or o.get("primaryImageSmall")
        if not u:
            continue
        return dict(url=u, src="The Met", lic="CC0", credit=o.get("creditLine") or "The Met",
                    page=o.get("objectURL"), found=o.get("title"), objdate=o.get("objectDate"))
    return None


# key, display name, year (negative = BCE), display date, region, gatherer
ITEMS = [
    # --- deep head: global, spectacle-grade, and all objects (not sites) ---
    ("ainghazal",  "'Ain Ghazal statue",        -7000, "c. 7000 BCE", "Jordan",
     lambda: commons("Ain Ghazal statue Neolithic", ["ain ghazal", "'ain ghazal", "ayn ghazal"])),
    ("jomon",      "Jōmon flame vessel",        -3000, "c. 3000 BCE", "Japan", None),   # have it
    ("cuneiform",  "Cuneiform tablet",          -2500, "c. 2500 BCE", "Mesopotamia", None),
    ("nebra",      "Nebra sky disc",            -1600, "c. 1600 BCE", "Germany",
     lambda: commons("Nebra sky disc Himmelsscheibe", ["nebra", "himmelsscheibe"])),
    ("tutmask",    "Mask of Tutankhamun",       -1323, "c. 1323 BCE", "Egypt",
     lambda: commons("Tutankhamun gold mask Cairo museum", ["tutankhamun", "tutanchamun", "tutankhamon"])),
    ("olmec",      "Olmec colossal head",        -900, "c. 900 BCE",  "Mexico",
     lambda: commons("Olmec colossal head museum", ["olmec"])),
    ("terracotta", "Terracotta Army warrior",    -210, "c. 210 BCE",  "China",
     lambda: commons("Terracotta Army warrior single figure", ["terracotta"], prefer=("warrior", "soldier"))),
    ("antikythera", "Antikythera mechanism",     -100, "c. 100 BCE",  "Greece",
     lambda: commons("Antikythera mechanism fragment", ["antikythera", "antikyther"])),
    ("moche",      "Moche stirrup-spout vessel",  500, "c. 500 CE",   "Peru",
     lambda: met("Moche stirrup spout bottle", ["bottle", "vessel", "jar"])),
    ("moai",       "Moai",                       1250, "c. 1250",     "Rapa Nui",
     lambda: commons("Moai Easter Island statue", ["moai"])),
    ("benin",      "Benin bronze plaque",        1550, "c. 1550",     "Nigeria",
     lambda: met("Benin plaque brass Nigeria", ["plaque", "head", "figure"])),
    ("ming",       "Ming blue-and-white jar",    1450, "c. 1450",     "China",
     lambda: met("blue and white porcelain jar Ming dynasty", ["jar", "vase", "bottle"])),
    ("samurai",    "Japanese armour",            1700, "c. 1700",     "Japan",
     lambda: met("armor gusoku Japanese", ["armor", "armour"])),
    ("astrolabe",  "Astrolabe",                  1250, "c. 1250",     "Islamic world", None),

    # --- post-1500 density: this is where the crowding has to read ---
    ("typewriter", "Sholes & Glidden typewriter", 1874, "1874", "United States",
     lambda: commons("Sholes and Glidden typewriter", ["typewriter"], prefer=("sholes", "glidden", "remington"))),
    ("pennyfarthing", "Penny-farthing bicycle",   1871, "1871", "United Kingdom",
     lambda: commons("penny farthing high wheel bicycle", ["penny", "farthing", "hochrad"])),
    ("gramophone", "Gramophone",                  1900, "c. 1900", "United States",
     lambda: commons("gramophone horn phonograph antique", ["gramophone", "phonograph"])),
    ("singer",     "Singer sewing machine",       1890, "c. 1890", "United States",
     lambda: commons("Singer sewing machine antique", ["singer"], prefer=("sewing",))),
    ("walkman",    "Sony Walkman TPS-L2",         1979, "1979", "Japan",
     lambda: commons("Sony Walkman TPS-L2", ["walkman"])),
    ("gameboy",    "Nintendo Game Boy",           1989, "1989", "Japan",
     lambda: commons("Nintendo Game Boy original handheld", ["game boy", "game-boy", "gameboy"])),
]

meta = {}
for key, name, year, disp, region, gen in ITEMS:
    if gen is None:
        continue
    try:
        c = gen()
    except Exception as e:
        print(f"{key:14s} GATHER FAIL {e!r:.70}"); continue
    if not c:
        print(f"{key:14s} no candidate"); continue
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
        flag = "  <-- SCAN?" if cov > 0.92 else ""
        print(f"{key:14s} cov={cov:.2f} {str(cut.size):12s} {str(c['found'])[:48]}{flag}")
    except Exception as e:
        print(f"{key:14s} CUT FAIL {e!r:.70}")

json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)

# contact sheet — the verification step. a beautiful cut of the wrong object still fails.
names = sorted(meta, key=lambda k: meta[k]["year"])
cell, cols = 260, 5
rows = (len(names) + cols - 1) // cols
sheet = Image.new("RGB", (cell * cols, cell * max(rows, 1)), (236, 72, 72))
for i, n in enumerate(names):
    im = Image.open(os.path.join(OUT, n + ".webp")).convert("RGBA")
    im.thumbnail((cell - 22, cell - 22), Image.LANCZOS)
    sheet.paste(im, ((i % cols) * cell + (cell - im.width) // 2,
                     (i // cols) * cell + (cell - im.height) // 2), im)
sheet.save("sheet.png")
print(f"\nDONE {len(meta)} of {sum(1 for i in ITEMS if i[5])}")
