"""TICKET 02 lane B — the 28 `drop` keys: a DIFFERENT photograph of the same item.

Dustin's 2026-08-14 pass flagged 28 of the 74 `ate` keys `2` — *this photo's no good*. That is
not a cut problem and no third model fixes it: birefnet and isnet both cut faithfully around a
Spitfire hanging in a hall, a rickshaw in traffic, a saber lying beside its scabbard. The
photograph has to change, or the item leaves the set.

    python resource02.py --find              # gather candidates for every unresolved key
    python resource02.py --find zero v2      # named keys
    python resource02.py --cut zero=3 v2=1   # cut the chosen candidate, master-shaped
    python resource02.py --promote zero v2   # img/<k>.webp + the sourced.json record

WHY A THIRD SCRIPT AND NOT A source5.py RE-RUN. source5.py returns the FIRST hit its filters
accept and stores it — that is the automation ticket 02 already measured and called hopeless at
choosing (the television that was salt-and-pepper shakers). Here the choice is the whole job, so
this gathers SIX candidates per key and renders them on one row beside the photograph they would
replace. The machine acquires; the sheet is read by eye; `--cut` only ever runs on a named index.

THE QUERIES ARE AUTHORED, NOT DERIVED. `PLAN` below names each artifact as specifically as the
record allows and says, per key, what is wrong with the shipped photograph — because the reject
words that matter are the ones that describe THIS failure ("in motion", "museum hall", "with
scabbard"), and a generic filter cannot know them.

THE CUT AND THE FRAME ARE promote02.py's, EXACTLY. A replacement is a re-cut of a new original,
so it lands in the same trap the promotion did: `rematte02.py`-style full-frame cuts carry a
transparent margin that gravity.js scales to 132 px, and a straight RGBA resize lays a dark halo
around the object. `to_master()` is imported rather than restated — one convention, one place.

Reads:  cand/<key>-<n>.jpg     the gathered candidates (git-ignored, re-fetchable)
Writes: cand/cand.json         per candidate: url, licence, credit, page, title
        cand-sheet-N.png       current | six candidates, one key per row
        cand/cut/<key>.png     the birefnet cut of the chosen candidate, full frame
        cand/master/<key>.webp the same cut on the master's terms — the promotion candidate
        img/<key>.webp         ONLY under --promote
        sourced.json           ONLY under --promote: the record follows the photograph
"""
import io, json, os, re, sys, time

import requests
from PIL import Image, ImageDraw

from promote02 import to_master, QUALITY, METHOD
from review02 import measure, HERE
from source5 import date_gap, frag_score

UA = "HumanHistoryPrototype/0.5 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session()
S.headers["User-Agent"] = UA
S.headers["AIC-User-Agent"] = "HumanHistory (dustincole.ent@gmail.com)"

WIKI = "https://commons.wikimedia.org/w/api.php"
MET = "https://collectionapi.metmuseum.org/public/collection/v1"
CMA = "https://openaccess-api.clevelandart.org/api/artworks/"

CAND = os.path.join(HERE, "cand")
CUT = os.path.join(CAND, "cut")
MASTER = os.path.join(CAND, "master")
IMG = os.path.join(HERE, "img")
ORIG = os.path.join(HERE, "orig")
NCAND = 6
BACKOFF = [5, 15, 45, 90]   # refetch02.py's, measured against Wikimedia's own limit
PACE = 0.6

strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()
# a Commons title is whatever its uploader typed, and this console is cp1252 — one Polish ś in a
# V-2 filename took the whole run down after the fetches and before the log was written
safe = lambda s: str(s).encode("ascii", "replace").decode()

# source5.py's two filters, unchanged. A licence the credit line cannot satisfy is not supply,
# and the shapes below break the site's grammar wherever they are found.
LIC_REJECT = ("gfdl", "gnu free", "-nc", "-nd", "noncommercial", "no derivative", "fair use")
GLOBAL_REJECT = ("woman ", "women ", "man ", "men ", "people", "soldier", "crowd", "parade",
                 "exhibition", "gallery view", "interior of", "aerial", "panorama", "skyline",
                 " map", "diagram", "schematic", "blueprint", "poster", "advertis", "logo",
                 "coat of arms", "stamp of", "banknote of", "3d ", "render", "replica",
                 "reproduction", "reconstruction", "cosplay", "re-enact", "reenact")


# =================================================================================================
# THE PLAN. One row per `drop` key: what the shipped photograph does wrong, and what to look for
# instead. `bad` is documentation and a filter at once — the words in it are appended to `reject`.
#
#   q       the search string
#   must    a title must contain one of these; the whole name of the thing, never one common word
#           (the 2020s tail cost 22 fetches to learn that `starship` matches a rock band)
#   reject  title words that describe THIS failure
#   src     which collection to ask first; the others are not tried, because a key whose artifact
#           lives in one museum is not served by a fallback that returns a different artifact
PLAN = {
    "airjordan": dict(
        bad="a signed pair in a case, shot through glass with the signature as the subject",
        q="Air Jordan I sneaker shoe", must=["air jordan", "jordan 1", "jordan i"],
        reject=["signature", "signed", "case", "store", "feet", "wearing", "box"], src="com"),
    "apollosuit": dict(
        bad="the patch photographed on the suit inside a Smithsonian vitrine — the vitrine is half "
            "the frame and the patch is a detail in it",
        q="Apollo 15 mission emblem embroidered patch", must=["apollo 15", "apollo15"],
        reject=["crew", "portrait", "launch", "rover", "surface", "stamp", "cover"], src="com"),
    "aztecserpent": dict(
        bad="the British Museum's own gallery shot: case glass, dark ground, the label in frame",
        q="double headed serpent turquoise mosaic Aztec Mixtec British Museum",
        must=["double-headed serpent", "double headed serpent", "doble serpiente"],
        reject=["case", "label", "gallery", "codex", "calendar"], src="com"),
    "bajaj": dict(
        bad="a tuk-tuk in motion in traffic — a street scene, and the cut keeps the street",
        q="auto rickshaw three wheeler parked white background",
        must=["auto rickshaw", "autorickshaw", "tuk tuk", "bajaj"],
        reject=["motion", "traffic", "street", "road", "driver", "passenger", "stand", "queue",
                "electric", "e-rickshaw"], src="com"),
    "batik2": dict(
        bad="a length of cloth photographed flat on a floor, edge to edge — no silhouette to cut",
        q="batik sarong kain panjang Javanese textile", must=["batik", "kain panjang"],
        reject=["making", "wax", "canting", "factory", "shop", "dress", "worn", "pattern detail",
                "shirt", "market", "process", "stamp", "maestro", "trusmi", "dokumentasi",
                "yogyakarta", "motif"], src="cma"),
    "bulb": dict(
        bad="a collector's array of lamps AND sockets on a cloth — six objects, not one",
        q="Edison carbon filament incandescent lamp bulb",
        must=["edison lamp", "edison bulb", "incandescent lamp", "carbon filament", "edison light"],
        reject=["sockets", "collection", "array", "factory", "portrait", "menlo", "street",
                "fixture", "chandelier", "school", "patent", "phonograph", "helsing"], src="com"),
    "crossbow": dict(
        bad="the crossbow lying beside its cranequin — two objects, and the winder reads as debris",
        # the Met is the shipped source and cannot serve the replacement: its search index
        # returns 0 for "crossbow" — full text, title-only and department-scoped alike — while
        # holding object 23337, whose title contains the word. Commons instead.
        q="medieval crossbow weapon", must=["crossbow", "armbrust"],
        reject=["trigger", "mechanism", "component", "part", "platform", "nodae", "han ", "qin ",
                "bolt", "quiver", "pistol", "modern", "competition", "sport", "shooting",
                "hunting", "bow and"], src="com"),
    "eniac": dict(
        bad="a panel bolted into a museum wall, shot in a lit room with the wall in frame",
        q="ENIAC computer unit panel", must=["eniac"],
        reject=["portrait", "operator", "programmer", "building", "plaque", "room", "wall",
                "moore school"], src="com"),
    "enigma": dict(
        bad="the machine open on black, its lid and cables cut as separate slabs",
        q="Enigma machine cipher", must=["enigma"],
        reject=["rotor detail", "wiring", "wheel", "close-up", "closeup", "bombe", "cipher clerk",
                "hut", "operator"], src="com"),
    "funangold": dict(
        bad="a tray of Oc Eo jewellery — many small pieces, and no one of them is the object",
        q="Oc Eo gold plaque Funan", must=["oc eo culture gold", "oc eo gold", "funan gold"],
        reject=["site", "plan", "excavation", "collection", "tray", "pottery", "sculpture",
                "ceramic", "brick", "museum display"], src="com"),
    "godrej": dict(
        bad="a steel cupboard standing against a domestic wall, in a room, at an angle",
        q="steel almirah metal cupboard Godrej", must=["almirah", "almyrah", "godrej"],
        reject=["wooden", "wood", "room", "wall", "shop", "showroom", "factory", "logo", "advert",
                "house", "tomb", "relics", "literary", "aesthetic"], src="com"),
    "jeep": dict(
        bad="a museum Jeep on a floor with the hall behind it and a stanchion through the wheels",
        q="Willys MB jeep vehicle", must=["willys mb", "willys jeep", "jeep willys"],
        reject=["motor", "innen", "interior", "engine", "museum", "hall", "convoy", "column",
                "parade", "driver", "crew", "dashboard", "modern", "wrangler", "m606"], src="com"),
    "safetybike": dict(
        bad="the Rover behind a museum rail, which the cut keeps and the spokes lose",
        q="Rover safety bicycle 1885", must=["safety bicycle", "rover"],
        reject=["advert", "poster", "portrait", "rider", "museum hall", "case"], src="com"),
    "snowgoggles": dict(
        bad="the Wellcome plate: two pairs on a mount board with a scale bar",
        q="Inuit snow goggles ivory wood", must=["snow goggles", "snow-goggles", "iggaak"],
        reject=["ski", "modern", "sunglasses", "wellcome", "scale", "mount", "welding"],
        src="com"),
    "spinjenny": dict(
        bad="the museum's jenny with its stanchion, rope barrier and floor kept whole",
        q="spinning jenny Hargreaves machine", must=["spinning jenny"],
        reject=["geograph", "way", "street", "road", "pub", "inn", "portrait", "mill", "factory",
                "worker", "hall", "barrier"], src="com"),
    "spitfire": dict(
        bad="a Spitfire hung from a museum roof, shot from below against girders",
        q="Supermarine Spitfire aircraft", must=["supermarine spitfire", "spitfire mk"],
        reject=["triumph", "museum", "hangar", "formation", "flight", "flying", "sky", "cockpit",
                "model", "memorial", "wreck", "engine"], src="com"),
    "stainedglass": dict(
        bad="a panel on a lightbox with the box's rectangle cut as part of the object",
        q="stained glass panel", must=["glass panel", "stained glass", "panel with"],
        reject=["window of", "cathedral", "church interior", "lightbox", "installation", "roundel "],
        src="met"),
    "stickchart": dict(
        bad="the Library of Congress copy shot on a textured wall the cut cannot separate",
        q="Marshall Islands stick chart rebbelib navigation chart",
        must=["stick chart", "rebbelib", "mattang", "meddo"],
        reject=["map", "satellite", "atoll", "diagram", "modern", "loc ", "wall", "bhm"],
        src="com"),
    "talwar": dict(
        bad="the saber laid beside its scabbard — two long objects, and neither reads whole",
        q="talwar sword Indian", must=["talwar", "tulwar", "sword"],
        reject=["scabbard", "with", "hilt only", "detail", "collection", "rack"], src="met"),
    # `telescope` and `terracotta` are the 2020s tail's lesson again, and it is worth writing down
    # twice: A ONE-WORD `must` MATCHES A WORD, NOT A THING. The first run returned the James Webb
    # and the VLT for one, and a Met terracotta HYDRIA for the other — terracotta is a material.
    # Both must-words are now the artifact's whole name.
    "telescope": dict(
        bad="the EYEPIECE PART of Galileo's telescope — a fragment, not the instrument",
        q="Galileo telescope Museo Galileo Florence",
        must=["galileo telescope", "galilei's telescope", "telescopio di galileo",
              "cannocchiale di galileo"],
        reject=["eyepiece", "objective", "lens", "part", "detail", "space", "webb", "hubble",
                "observatory", "vlt", "nebula", "eso", "radio"], src="com"),
    "terracotta": dict(
        bad="the pit: rows of warriors, a crowd of them, and R1 forbids the crowd",
        q="Terracotta Army warrior standing figure full length Qin",
        must=["terracotta warrior", "terracotta army", "terracotta soldier"],
        reject=["pit", "rows", "site", "excavation", "horses", "hall", "hydria", "sketch",
                "canova", "figurine", "head", "boots", "hands", "detail", "close"], src="com"),
    "trinitron": dict(
        bad="a 1975 set with a Betamax deck bolted to it — the wrong object AND two of them",
        q="Sony Trinitron KV-1310 first colour television 1968",
        must=["kv-1310", "kv1310", "trinitron kv"],
        reject=["betamax", "recorder", "integrated", "logo", "advert", "shop", "screen", "dell",
                "monitor", "profeel"], src="com"),
    "unitree": dict(
        bad="the robot on an expo stand with the stand, the banner and a visitor's arm in frame",
        q="Unitree G1 humanoid robot full body",
        must=["unitree", "humanoid robot"],
        reject=["headquarter", "building", "office", "campus", "expo", "stand", "stage", "booth",
                "conference", "dog", "quadruped", "go2", "b2", "banner", "demonstration"],
        src="com"),
    "v2": dict(
        bad="the engine on its museum rail, which is cut as part of the engine",
        q="V-2 rocket engine A4", must=["v-2", "v2 ", "a4 rocket", "aggregat"],
        reject=["launch", "diagram", "factory", "portrait", "site", "rail", "trailer", "meillerwagen",
                "museum hall"], src="com"),
    "visionpro": dict(
        bad="the headset with its charger and cable laid out beside it",
        q="Apple Vision Pro headset", must=["vision pro"],
        reject=["charger", "cable", "wearing", "worn", "store", "box", "queue", "advert", "logo",
                "battery"], src="com"),
    "wampum": dict(
        bad="a belt pinned in a case, shot through glass with the case's frame around it",
        q="wampum belt Iroquois beads", must=["wampum belt"],
        reject=["case", "treaty text", "drawing", "portrait", "map", "gallery", "display",
                "belts", "school", "sciarpa", "reading", "nara"], src="com"),
    "wattengine": dict(
        bad="the engine floor at Kew Bridge — a building interior, not an object",
        q="Boulton and Watt rotative beam engine engraving",
        must=["watt engine", "watt's engine", "boulton", "watt beam", "rotative"],
        reject=["floor", "house", "hall", "interior", "portrait", "statue", "patent", "pump",
                "station", "cornish", "wanlockhead", "geograph"], src="com"),
    "zero": dict(
        bad="a museum A6M with the hall's floor, lights and neighbouring airframe in the cut",
        q="Mitsubishi A6M Zero fighter aircraft airworthy",
        must=["a6m", "zero fighter", "mitsubishi zero", "reisen"],
        reject=["mock-up", "mockup", "museum", "hangar", "hall", "formation", "cockpit", "model",
                "wreck", "diagram", "engine", "nose", "slot", "feldbahn", "postcard", "crashing",
                "port side 2"], src="com"),
}


# ---------------------------------------------------------------- gatherers (multi-candidate)
def _accept(title, must, reject):
    t = title.lower()
    if must and not any(m in t for m in must):
        return False
    if any(x in t for x in reject) or any(x in t for x in GLOBAL_REJECT):
        return False
    return not t.endswith((".pdf", ".svg", ".tif", ".tiff", ".webm", ".ogv", ".gif", ".djvu",
                           ".xcf", ".stl"))


def commons_many(q, must, reject, exclude, n):
    """source5.py's `intitle:` trick, but every accepted hit is kept rather than the first.

    The searches are run widest-first and merged, because a replacement is being CHOSEN here and
    six near-identical hits off one query are worse than six different photographs.
    """
    titles, seen = [], set()
    for query in [f'intitle:"{m}" filetype:bitmap' for m in must[:3]] + [q + " filetype:bitmap", q]:
        try:
            r = S.get(WIKI, params={"action": "query", "format": "json", "list": "search",
                                    "srsearch": query, "srnamespace": 6, "srlimit": 50}, timeout=40)
            hits = [t["title"] for t in r.json().get("query", {}).get("search", [])]
        except Exception:
            continue
        for t in hits:
            f = t.replace("File:", "")
            if f in seen or f in exclude or not _accept(t, must, reject):
                continue
            seen.add(f)
            titles.append(t)
        if len(titles) >= n * 4:
            break
    out = []
    for i in range(0, len(titles), 40):
        chunk = titles[i:i + 40]
        r = S.get(WIKI, params={"action": "query", "format": "json", "titles": "|".join(chunk),
                                "prop": "imageinfo", "iiprop": "url|extmetadata",
                                "iiurlwidth": 1200}, timeout=40)
        pages = r.json().get("query", {}).get("pages", {})
        order = {t: j for j, t in enumerate(chunk)}
        for pg in sorted(pages.values(), key=lambda p: order.get(p.get("title", ""), 99)):
            ii = (pg.get("imageinfo") or [{}])[0]
            if not ii.get("thumburl"):
                continue
            em = ii.get("extmetadata", {})
            lic = strip((em.get("LicenseShortName") or {}).get("value")) or "public domain"
            if any(x in lic.lower() for x in LIC_REJECT):
                continue
            out.append(dict(url=ii["thumburl"], src="Wikimedia Commons", lic=lic,
                            credit=strip((em.get("Artist") or {}).get("value")) or "unknown",
                            page=ii.get("descriptionurl"),
                            found=pg["title"].replace("File:", ""),
                            instdate=strip((em.get("DateTimeOriginal") or {}).get("value"))[:40]))
            if len(out) >= n:
                return out
    return out


def met_many(q, must, reject, exclude, n):
    # `title=true`, which source5.py's met() never passed: the Met's default search is full text
    # over the whole record, so a bare q=crossbow returns a stela, a portrait and a folio inside
    # its first six hits — 40 results, none of them a crossbow. Restricted to titles it returns
    # crossbows.
    ids = (S.get(MET + "/search", params={"q": q, "title": "true", "hasImages": "true",
                                          "isPublicDomain": "true"},
                 timeout=45).json().get("objectIDs") or [])[:60]
    out = []
    for oid in ids:
        try:
            o = S.get(f"{MET}/objects/{oid}", timeout=30).json()
        except Exception:
            continue
        t = o.get("title") or ""
        if not _accept(t, must, reject) or t in exclude:
            continue
        u = o.get("primaryImage") or o.get("primaryImageSmall")
        if not u:
            continue
        out.append(dict(url=u, src="The Met", lic="CC0", credit=o.get("creditLine") or "The Met",
                        page=o.get("objectURL"), found=t, instdate=(o.get("objectDate") or "")[:40]))
        if len(out) >= n:
            break
    return out


def cma_many(q, must, reject, exclude, n):
    d = S.get(CMA, params={"q": q, "cc0": 1, "has_image": 1, "limit": 60}, timeout=45).json()
    out = []
    for a in d.get("data", []):
        t = a.get("title") or ""
        if not _accept(t, must, reject) or t in exclude:
            continue
        u = ((a.get("images") or {}).get("web") or {}).get("url")
        if not u:
            continue
        out.append(dict(url=u, src="Cleveland Museum of Art", lic="CC0",
                        credit=a.get("creditline") or "Cleveland Museum of Art",
                        page=a.get("url"), found=t, instdate=(a.get("creation_date") or "")[:40]))
        if len(out) >= n:
            break
    return out


GATHER = {"com": commons_many, "met": met_many, "cma": cma_many}


# ---------------------------------------------------------------- sheets
CHECK = None


def checks(w, h, sq=16):
    global CHECK
    if CHECK is None or CHECK.size[0] < w or CHECK.size[1] < h:
        c = Image.new("RGB", (max(w, 1400), max(h, 1400)), "#dddddd")
        d = ImageDraw.Draw(c)
        for y in range(0, c.size[1], sq):
            for x in range(0, c.size[0], sq):
                if (x // sq + y // sq) % 2:
                    d.rectangle([x, y, x + sq, y + sq], fill="#999999")
        CHECK = c
    return CHECK.crop((0, 0, w, h)).copy()


def fit(im, box):
    im = im.copy()
    im.thumbnail((box, box), Image.LANCZOS)
    bg = checks(box, box)
    if im.mode == "RGBA":
        bg.paste(im, ((box - im.size[0]) // 2, (box - im.size[1]) // 2), im)
    else:
        bg.paste(im.convert("RGB"), ((box - im.size[0]) // 2, (box - im.size[1]) // 2))
    return bg


def find_sheets(keys, log, box=240, per=7):
    """One key per row: the photograph being replaced, then its six candidates, numbered.

    The number under a cell IS the argument `--cut` takes, so the sheet and the command cannot
    drift apart.
    """
    paths = []
    for page in range((len(keys) + per - 1) // per):
        rows = keys[page * per:(page + 1) * per]
        im = Image.new("RGB", (box * (NCAND + 1), (box + 26) * len(rows)), "#141414")
        d = ImageDraw.Draw(im)
        for i, k in enumerate(rows):
            y = i * (box + 26)
            d.text((6, y + 6), f"{k}   [0] SHIPPED — {PLAN[k]['bad'][:88]}", fill="#e8e6e2")
            cur = os.path.join(ORIG, k + ".jpg")
            if os.path.exists(cur):
                im.paste(fit(Image.open(cur), box), (0, y + 20))
            for j, c in enumerate(log.get(k, []), 1):
                p = os.path.join(CAND, f"{k}-{j}.jpg")
                if not os.path.exists(p):
                    continue
                im.paste(fit(Image.open(p), box), (j * box, y + 20))
                d.text((j * box + 6, y + 6), f"[{j}] {c['found'][:26]}", fill="#9fd7a0")
        p = os.path.join(HERE, f"cand-sheet-{page + 1}.png")
        im.save(p)
        paths.append(p)
    return paths


def cut_sheet(pairs, box=380, per=5):
    """chosen candidate | its cut | the master it would replace. The proof before --promote.

    Paged at five rows. One 21-row sheet is 8,000 px tall, and anything that has to be shrunk to
    be looked at cannot answer the question it was built for — whether the cut ate an edge.
    """
    paths = []
    for page in range((len(pairs) + per - 1) // per):
        rows = pairs[page * per:(page + 1) * per]
        im = Image.new("RGB", (box * 3, (box + 22) * len(rows)), "#141414")
        d = ImageDraw.Draw(im)
        for i, (k, m) in enumerate(rows):
            y = i * (box + 22)
            d.text((6, y + 5), f"{k}   new photograph | new cut | CURRENT master   "
                               f"halo {m['halo']} isl {m['isl']} holes {m['holes']} "
                               f"cov {m['cov']} {m['w']}x{m['h']}", fill="#e8e6e2")
            for j, p in enumerate([os.path.join(CAND, f"{k}-chosen.jpg"),
                                   os.path.join(MASTER, k + ".webp"),
                                   os.path.join(IMG, k + ".webp")]):
                if os.path.exists(p):
                    im.paste(fit(Image.open(p), box), (j * box, y + 22))
        p = os.path.join(HERE, f"cand-cut-sheet-{page + 1}.png")
        im.save(p)
        paths.append(p)
    return paths


# ---------------------------------------------------------------- modes
def grab(url, dest):
    """refetch02.py's backoff, because six candidates x 28 keys is four times its request count.

    The first run of this script lost 13 keys entirely to `HTTPError` and every one of them was a
    429 from upload.wikimedia.org — the same wall refetch02 hit at request 180, arriving sooner
    here. A 429 is not transient and a fast retry is not a backoff: it lands while the limit is
    still in force and burns the candidate.
    """
    for attempt in range(4):
        r = S.get(url, timeout=90)
        if r.status_code == 429:
            wait = int(r.headers.get("Retry-After") or 0) or BACKOFF[attempt]
            print(f"      429, waiting {wait}s")
            time.sleep(wait)
            continue
        r.raise_for_status()
        Image.open(io.BytesIO(r.content)).verify()
        open(dest, "wb").write(r.content)
        time.sleep(PACE)
        return len(r.content)
    raise RuntimeError("rate limited on every attempt")


def find(keys):
    os.makedirs(CAND, exist_ok=True)
    logp = os.path.join(CAND, "cand.json")
    log = json.load(open(logp, encoding="utf-8")) if os.path.exists(logp) else {}
    src = json.load(open(os.path.join(HERE, "sourced.json"), encoding="utf-8"))

    for k in keys:
        p = PLAN[k]
        # never re-offer the photograph being replaced
        exclude = {src.get(k, {}).get("found") or "", ""}
        cands = GATHER[p["src"]](p["q"], p["must"], p["reject"], exclude, NCAND)
        kept = []
        for j, c in enumerate(cands, 1):
            dest = os.path.join(CAND, f"{k}-{j}.jpg")
            try:
                c["bytes"] = grab(c["url"], dest)
            except Exception as e:
                print(f"  {k:13s} [{j}] FETCH {type(e).__name__}")
                continue
            kept.append(c)
        log[k] = kept
        print(f"  {k:13s} {len(kept)} candidates" + ("" if kept else "   NONE — nothing to choose"))
        for j, c in enumerate(kept, 1):
            print(f"      [{j}] {safe(c['found'])[:64]}   {c['lic']}")
    json.dump(log, open(logp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for p in find_sheets(keys, log):
        print("sheet ->", p)


def cut(picks):
    """`--cut k=n`: birefnet the chosen candidate, then put it on the master's terms."""
    from rembg import remove, new_session
    os.makedirs(CUT, exist_ok=True)
    os.makedirs(MASTER, exist_ok=True)
    log = json.load(open(os.path.join(CAND, "cand.json"), encoding="utf-8"))
    sess = new_session("birefnet-general")
    pairs = []
    for k, n in picks:
        src = os.path.join(CAND, f"{k}-{n}.jpg")
        if not os.path.exists(src):
            print(f"  {k:13s} no candidate {n}"); continue
        # the chosen file is copied under a stable name: the sheet is rebuilt from it, and the
        # numbered candidates are a scratch pool that the next --find run overwrites
        open(os.path.join(CAND, f"{k}-chosen.jpg"), "wb").write(open(src, "rb").read())
        out = os.path.join(CUT, k + ".png")
        if not os.path.exists(out):
            remove(Image.open(src).convert("RGB"), session=sess).save(out)
        m = to_master(out)
        dest = os.path.join(MASTER, k + ".webp")
        m.save(dest, "WEBP", quality=QUALITY, method=METHOD)
        mm = measure(dest)
        old = measure(os.path.join(IMG, k + ".webp"))
        print(f"  {k:13s} [{n}] {safe(log[k][n - 1]['found'])[:40]}")
        print(f"      {str(old['w']) + 'x' + str(old['h']):11s} -> {str(mm['w']) + 'x' + str(mm['h']):11s}"
              f"   halo {old['halo']}->{mm['halo']}  isl {old['isl']}->{mm['isl']}"
              f"  holes {old['holes']}->{mm['holes']}  cov {old['cov']}->{mm['cov']}")
        pairs.append((k, mm))
    if pairs:
        for p in cut_sheet(pairs):
            print("sheet ->", p)


def promote(keys):
    """The only mode that writes img/ and sourced.json. The record follows the photograph."""
    log = json.load(open(os.path.join(CAND, "cand.json"), encoding="utf-8"))
    picks = json.load(open(os.path.join(CAND, "picks.json"), encoding="utf-8"))
    sp = os.path.join(HERE, "sourced.json")
    src = json.load(open(sp, encoding="utf-8"))
    fp = os.path.join(HERE, "frag.json")
    leg = json.load(open(fp, encoding="utf-8"))
    n = 0
    for k in keys:
        m = os.path.join(MASTER, k + ".webp")
        if not os.path.exists(m):
            print(f"  {k:13s} NOT CUT — run --cut first"); continue
        open(os.path.join(IMG, k + ".webp"), "wb").write(open(m, "rb").read())
        c = log[k][picks[k] - 1]
        if k in src:
            # `frag` and `dategap` are measurements OF THIS PHOTOGRAPH, so they cannot survive it.
            # Recomputed for the replaced keys only: source5.py --score would rewrite the frag of
            # all 236, which is a diff this change did not cause.
            im = Image.open(m).convert("RGBA")
            gap = date_gap(src[k]["year"], c["instdate"], c["src"])
            src[k].update(url=c["url"], src=c["src"], lic=c["lic"], credit=c["credit"],
                          page=c["page"], found=c["found"], instdate=c["instdate"],
                          size=list(im.size), frag=frag_score(im), dategap=gap,
                          datesrc="authored" if gap is None else "institution")
        elif k in leg:
            # the twelve legacy cut-outs predate sourced.json: their record is hand-written in
            # build_data.LEGACY and only their frag lives in a file. `bulb` is the one replaced
            # key of the twelve, and its row is edited there by hand — this keeps its score true.
            leg[k] = frag_score(Image.open(m).convert("RGBA"))
            print(f"  {k:13s} LEGACY — record is build_data.LEGACY; frag.json updated to {leg[k]}")
        print(f"  {k:13s} <- {safe(c['found'])[:52]}   {c['src']} / {c['lic']}")
        n += 1
    json.dump(src, open(sp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    json.dump(leg, open(fp, "w", encoding="utf-8"), indent=1)
    print(f"\n{n} master{'s' if n != 1 else ''} replaced. Next: build_data.py, bake_sprites.py, "
          f"bake_index.py.")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--cutsheets" in sys.argv:
        # redraw the proof sheets for every cut on disk, without loading birefnet again
        pairs = [(k, measure(os.path.join(MASTER, k + ".webp"))) for k in PLAN
                 if os.path.exists(os.path.join(MASTER, k + ".webp"))]
        for p in cut_sheet(pairs):
            print("sheet ->", p)
    elif "--sheets" in sys.argv:
        # a --find of a few keys rebuilds only those rows; this redraws every key that has
        # candidates, so the sheets on disk are always the whole pool rather than the last run's
        log = json.load(open(os.path.join(CAND, "cand.json"), encoding="utf-8"))
        for p in find_sheets([k for k in PLAN if log.get(k)], log):
            print("sheet ->", p)
    elif "--find" in sys.argv:
        find([k for k in (args or PLAN) if k in PLAN])
    elif "--cut" in sys.argv:
        picks = [(a.split("=")[0], int(a.split("=")[1])) for a in args]
        # picks.json is what --promote reads to know WHICH candidate's record to copy, so a later
        # run's choice must overwrite an earlier one for the same key, never the other way round
        pp = os.path.join(CAND, "picks.json")
        prev = json.load(open(pp, encoding="utf-8")) if os.path.exists(pp) else {}
        json.dump({**prev, **dict(picks)}, open(pp, "w"), indent=1)
        cut(picks)
    elif "--promote" in sys.argv:
        promote(args)
    else:
        print(__doc__)
