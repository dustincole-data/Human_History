"""PROTOTYPE — pass 4. Roughly triple the set, because a pile of 36 is not a pile.

Same rule as every other pass: every entry NAMES A SPECIFIC ARTIFACT, never a bare search
term, and the contact sheet is the verification. Met CC0 first (objects photographed on clean
sweeps), Commons where the Met has nothing (mostly the modern half; Evan-Amos's consumer
electronics shots are public domain and cut perfectly).

Runs in chunks so rembg cannot exhaust memory mid-run:
    for i in 0 8 16 ...; do python source4.py $i 8; done
"""
import io, json, os, re, sys, gc
import requests
from PIL import Image
from rembg import remove, new_session

UA = "HumanHistoryPrototype/0.2 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
OUT = "img"; os.makedirs(OUT, exist_ok=True)
WIKI = "https://commons.wikimedia.org/w/api.php"
MET = "https://collectionapi.metmuseum.org/public/collection/v1"
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()


def commons(term, must, prefer=(), reject=()):
    r = S.get(WIKI, params={"action": "query", "format": "json", "list": "search",
                            "srsearch": term, "srnamespace": 6, "srlimit": 40}, timeout=40)
    ts = [t["title"] for t in r.json().get("query", {}).get("search", [])]
    ts = [t for t in ts if any(m in t.lower() for m in must)
          and not any(x in t.lower() for x in reject)
          and not t.lower().endswith((".pdf", ".svg", ".tif", ".webm", ".ogv"))]
    ts.sort(key=lambda t: (0 if any(p in t.lower() for p in prefer) else 1))
    if not ts:
        return None
    r = S.get(WIKI, params={"action": "query", "format": "json", "titles": "|".join(ts[:40]),
                            "prop": "imageinfo", "iiprop": "url|extmetadata",
                            "iiurlwidth": 1100}, timeout=40)
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


# key, name, year, display, region, gatherer
ITEMS = [
    # --- the deep half: global, and mostly Met CC0 sweeps ---
    ("worshiper", "Sumerian worshipper figure", -2700, "c. 2700 BCE", "Mesopotamia",
     lambda: met("standing male worshiper Sumerian gypsum", ["worshiper", "worshipper", "figure"])),
    ("hippo",     "Faience hippopotamus",       -1950, "c. 1950 BCE", "Egypt",
     lambda: met("faience hippopotamus William Middle Kingdom", ["hippopotamus", "hippo"])),
    ("canopic",   "Canopic jar",                -1000, "c. 1000 BCE", "Egypt",
     lambda: met("canopic jar Egyptian limestone", ["canopic"])),
    ("gu",        "Shang ritual wine vessel",   -1200, "c. 1200 BCE", "China",
     lambda: met("ritual wine vessel gu Shang bronze", ["gu", "vessel", "zun"])),
    ("kouros",    "Marble kouros",               -590, "c. 590 BCE",  "Greece",
     lambda: met("marble statue kouros youth Attic", ["kouros", "youth"])),
    ("corinth",   "Corinthian helmet",           -550, "c. 550 BCE",  "Greece",
     lambda: met("bronze helmet Corinthian type", ["helmet"])),
    ("krater",    "Terracotta krater",           -450, "c. 450 BCE",  "Greece",
     lambda: met("terracotta krater red figure", ["krater"])),
    ("tanghorse", "Tang sancai horse",            700, "c. 700 CE",   "China",
     lambda: met("horse Tang dynasty earthenware sancai", ["horse"])),
    ("hanfigure", "Han tomb figure",              -50, "c. 50 BCE",   "China",
     lambda: met("Han dynasty tomb figure earthenware", ["figure", "attendant", "dancer"])),
    ("nataraja",  "Shiva Nataraja",              1050, "c. 1050",     "India",
     lambda: met("Shiva Nataraja bronze Chola", ["shiva", "nataraja"])),
    ("ganesha",   "Standing Ganesha",             800, "c. 800",      "India",
     lambda: met("Ganesha sandstone standing", ["ganesha"])),
    ("mosquelamp", "Mamluk mosque lamp",          1350, "c. 1350",    "Egypt / Syria",
     lambda: met("mosque lamp enameled glass Mamluk", ["lamp"])),
    ("ewer",      "Islamic brass ewer",          1200, "c. 1200",     "Iran",
     lambda: met("ewer brass inlaid silver Iran", ["ewer"])),
    ("celadon",   "Goryeo celadon vase",         1150, "c. 1150",     "Korea",
     lambda: met("celadon maebyeong Goryeo", ["vase", "maebyeong", "bottle"])),
    ("mayavessel", "Maya cylinder vessel",        750, "c. 750 CE",   "Guatemala",
     lambda: met("Maya cylinder vessel painted", ["vessel", "vase"])),
    ("chimu",     "Chimú gold ornament",         1350, "c. 1350",     "Peru",
     lambda: met("Chimu gold ornament pendant", ["ornament", "pendant", "beaker"])),
    ("kubamask",  "Kuba mask",                   1880, "c. 1880",     "DR Congo",
     lambda: met("Kuba mask wood Congo", ["mask"])),
    ("dogon",     "Dogon figure",                1700, "c. 1700",     "Mali",
     lambda: met("Dogon figure wood Mali", ["figure"])),
    ("malagan",   "Malagan carving",             1890, "c. 1890",     "New Ireland",
     lambda: met("Malagan figure New Ireland wood", ["malagan", "figure", "mask"])),
    ("netsuke",   "Netsuke",                     1800, "c. 1800",     "Japan",
     lambda: met("netsuke ivory wood Japan", ["netsuke"])),
    ("katana",    "Japanese blade",              1500, "c. 1500",     "Japan",
     lambda: met("blade sword katana Japanese", ["blade", "sword"])),
    ("haniwa",    "Haniwa figure",                500, "c. 500 CE",   "Japan",
     lambda: met("haniwa earthenware tomb Japan", ["haniwa"])),
    ("stradivari", "Stradivari violin",          1693, "1693",        "Italy",
     lambda: met("violin Antonio Stradivari", ["violin"])),
    ("harpsichord", "Harpsichord",               1650, "c. 1650",     "Italy",
     lambda: met("harpsichord Italian", ["harpsichord"])),
    ("armillary", "Armillary sphere",            1600, "c. 1600",     "Europe",
     lambda: met("armillary sphere brass", ["armillary", "sphere"])),
    ("chalice",   "Medieval chalice",            1300, "c. 1300",     "Europe",
     lambda: met("chalice silver gilt medieval", ["chalice"])),
    ("crossbow",  "Crossbow",                    1500, "c. 1500",     "Europe",
     lambda: met("crossbow steel Europe", ["crossbow"])),
    ("tableclock", "Table clock",                1580, "c. 1580",     "Germany",
     lambda: met("table clock gilt brass", ["clock"])),

    # --- the modern half: Commons, and Evan-Amos where possible ---
    ("colt",      "Colt revolver",               1851, "c. 1851",     "United States",
     lambda: commons("Colt Navy revolver 1851", ["colt", "revolver"], reject=("patent", "diagram"))),
    ("telegraph", "Morse telegraph key",         1844, "c. 1844",     "United States",
     lambda: commons("telegraph key Morse instrument", ["telegraph", "key"], reject=("diagram", "code"))),
    ("phonograph", "Edison phonograph",          1899, "c. 1899",     "United States",
     lambda: commons("Edison phonograph cylinder machine", ["phonograph", "edison"],
                     reject=("advert", "poster", "patent"))),
    ("leica",     "Leica I camera",              1925, "1925",        "Germany",
     lambda: commons("Leica I camera 1925", ["leica"], reject=("lens only", "logo"))),
    ("cokebottle", "Coca-Cola contour bottle",   1915, "1915",        "United States",
     lambda: commons("Coca-Cola contour bottle glass", ["coca", "bottle"], reject=("can", "logo", "truck"))),
    ("beetle",    "Volkswagen Beetle",           1938, "1938",        "Germany",
     lambda: commons("Volkswagen Beetle Kafer car", ["beetle", "käfer", "kafer", "volkswagen"],
                     reject=("engine", "interior", "logo"))),
    ("enigma",    "Enigma machine",              1938, "c. 1938",     "Germany",
     lambda: commons("Enigma machine cipher", ["enigma"], reject=("rotor only", "diagram", "wiring"))),
    ("vespa",     "Vespa scooter",               1946, "1946",        "Italy",
     lambda: commons("Vespa scooter Piaggio", ["vespa"], reject=("logo", "advert"))),
    ("lego",      "Lego brick",                  1958, "1958",        "Denmark",
     lambda: commons("Lego brick studs", ["lego"], reject=("logo", "store", "minifig"))),
    ("barbie",    "Barbie doll",                 1959, "1959",        "United States",
     lambda: commons("Barbie doll 1959 original", ["barbie"], reject=("logo", "box art", "movie"))),
    ("nes",       "Nintendo Entertainment System", 1985, "1985",      "Japan",
     lambda: commons("Nintendo Entertainment System console Evan-Amos", ["nes", "nintendo-entertainment"],
                     prefer=("fl", "evan"), reject=("cartridge", "logo"))),
    ("playstation", "Sony PlayStation",          1994, "1994",        "Japan",
     lambda: commons("Sony PlayStation console Evan-Amos", ["playstation"],
                     prefer=("fl", "evan"), reject=("2", "3", "4", "logo", "portable"))),
    ("dynatac",   "Motorola DynaTAC",            1983, "1983",        "United States",
     lambda: commons("Motorola DynaTAC 8000X phone", ["dynatac"], reject=("advert", "logo"))),
    ("rotaryphone", "Rotary telephone",          1950, "c. 1950",     "United States",
     lambda: commons("rotary dial telephone bakelite", ["telephone", "phone"],
                     reject=("box", "booth", "line", "pole", "cell"))),
    ("cassette",  "Compact cassette",            1963, "1963",        "Netherlands",
     lambda: commons("compact cassette tape", ["cassette"], reject=("player", "deck", "logo", "adapter"))),
    ("vinyl",     "Vinyl LP record",             1948, "1948",        "United States",
     lambda: commons("vinyl LP record 12 inch", ["vinyl", "record"],
                     reject=("player", "shop", "cover", "sleeve", "label"))),
    ("imac",      "iMac G3",                     1998, "1998",        "United States",
     lambda: commons("iMac G3 Bondi blue computer", ["imac"], reject=("logo", "advert"))),
    ("ipod",      "iPod",                        2001, "2001",        "United States",
     lambda: commons("iPod first generation classic", ["ipod"], reject=("logo", "advert", "touch", "nano"))),
    ("iphone",    "iPhone",                      2007, "2007",        "United States",
     lambda: commons("iPhone 1st generation 2007", ["iphone"],
                     reject=("logo", "advert", "screen", "app", "3g", "4", "5", "x"))),
    ("shuttle",   "Space Shuttle orbiter",       1981, "1981",        "United States",
     lambda: commons("Space Shuttle Discovery orbiter museum", ["shuttle", "discovery", "enterprise"],
                     reject=("launch", "patch", "diagram", "crew"))),
]

start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
count = int(sys.argv[2]) if len(sys.argv) > 2 else len(ITEMS)
sess = new_session("isnet-general-use")
meta = json.load(open("sourced.json", encoding="utf-8")) if os.path.exists("sourced.json") else {}

for key, name, year, disp, region, gen in ITEMS[start:start + count]:
    if key in meta:
        continue
    try:
        c = gen()
    except Exception as e:
        print(f"{key:12s} GATHER FAIL {e!r:.50}"); continue
    if not c:
        print(f"{key:12s} no candidate"); continue
    try:
        raw = S.get(c["url"], timeout=120).content
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.thumbnail((900, 900), Image.LANCZOS)
        cut = remove(im, session=sess, post_process_mask=True)
        bb = cut.getbbox()
        if bb:
            cut = cut.crop(bb)
        cov = sum(1 for p in cut.getdata() if p[3] > 128) / (cut.width * cut.height)
        if cut.width < 120 or cut.height < 120 or cov > 0.96:
            print(f"{key:12s} rejected cov={cov:.2f} {cut.size}"); continue
        cut.save(os.path.join(OUT, key + ".webp"), "WEBP", quality=88, method=5)
        c.update(key=key, name=name, year=year, disp=disp, region=region,
                 cov=round(cov, 3), size=list(cut.size))
        meta[key] = c
        print(f"{key:12s} cov={cov:.2f} {str(cut.size):11s} {str(c['found'])[:40].encode('ascii','replace').decode()}")
        del raw, im, cut
        gc.collect()
    except Exception as e:
        print(f"{key:12s} CUT FAIL {e!r:.60}")

json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("TOTAL", len(meta))
