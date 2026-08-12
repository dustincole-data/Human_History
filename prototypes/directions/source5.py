"""TICKET 05 — the mechanical half. Acquire, matte, score, and record; never decide.

Reads catalog.py (the editorial list), writes img/*.webp and merges into sourced.json.
Three things it does that pass 4 did not:

  instdate  the holding institution's OWN date string is captured and compared to the authored
            year. > 150 years apart => flagged for review, because a right-looking object on the
            wrong date is the failure this ticket exists to prevent.
  frag      13's second admission test, measured: the share of the object's own opaque area whose
            local luminance detail exceeds a threshold, computed at the 440px size the renderer
            actually draws. Low = recognisable by outline alone = dies at the first Voronoi cut.
  sheets    labelled contact sheets. Pass 4 caught a Smithsonian 3D render by eye; an unlabelled
            sheet makes that catch un-actionable because you cannot tell which cell is which.

    python source5.py            # all remaining
    python source5.py 0 20       # a chunk (rembg cannot exhaust memory across chunks)
    python source5.py --sheets   # rebuild labelled contact sheets from what exists
    python source5.py --score    # (re)compute frag for every entry, including the pre-existing 72
"""
import io, json, os, re, sys, gc
import requests
from PIL import Image, ImageDraw
from catalog import ITEMS, CUT
ITEMS = [r for r in ITEMS if r[0] not in CUT]   # the balance pass's cuts never get fetched

UA = "HumanHistoryPrototype/0.5 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
OUT = "img"; os.makedirs(OUT, exist_ok=True)
WIKI = "https://commons.wikimedia.org/w/api.php"
MET  = "https://collectionapi.metmuseum.org/public/collection/v1"
CMA  = "https://openaccess-api.clevelandart.org/api/artworks/"
ART  = "https://api.artic.edu/api/v1/artworks/search"
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()
RENDER_MAX = 440          # the size gravity.js actually draws a sprite at


# Applied to every Commons hit, on top of each row's own reject words. These are the shapes that
# break the site's grammar (a scene, a crowd, a person, a diagram) or breach a constraint outright
# (a render, a replica). "model" is deliberately absent — it would kill the Model T.
GLOBAL_REJECT = ("woman ", "women ", "man ", "men ", "people", "soldier", "crowd", "parade",
                 "exhibition", "gallery view", "interior of", "aerial", "panorama", "skyline",
                 " map", "diagram", "schematic", "blueprint", "poster", "advertis", "logo",
                 "coat of arms", "stamp of", "banknote of", "3d ", "render", "replica",
                 "reproduction", "reconstruction", "cosplay", "re-enact", "reenact")


# TICKET 07 ITEM 7 — a licence the site's credit line cannot satisfy is not supply, and the place
# to find that out is here rather than at render time. GFDL requires the full licence text to
# travel with the work, which a one-line credit on a shattering photograph cannot do; NC and ND
# are not free licences at all. The set shipped one GFDL-1.2-only photograph for three rounds
# because acquisition never looked at the licence field it was already storing.
LIC_REJECT = ("gfdl", "gnu free", "-nc", "-nd", "noncommercial", "no derivative", "fair use")


def title_score(t, words):
    """Rank Commons titles the way a picture editor would: short, on-topic, already cut out.

    Relevance order alone gave a rifle *display case* for the AK-47 and a *woman sewing* for the
    Singer. Length is the strongest available signal — a long title is a caption for a scene, a
    short one is a museum photograph of one thing.
    """
    tl = t.lower()
    s = 2 * sum(w.lower() in tl for w in words)
    if any(x in tl for x in ("nobg", "no bg", "transparent", "cutout", "cut out",
                             "white background", "(cropped)", "isolated")):
        s += 4                        # 02's finding: the quality Dustin responded to is a clean edge
    s += 1 if "museum" in tl else 0
    return s - 0.25 * len(tl.split())


# ---------------------------------------------------------------- gatherers
def commons(term, must, reject):
    """Commons' relevance ranking is the enemy here, not the corpus.

    A long descriptive query is scored as full text across description pages, so 'AK-47 type 2
    rifle museum display' returns scanned books and government PDFs — 141 of pass 5's first run
    died this way, with the must-filter correctly rejecting every hit. The fix is to search the
    FILE TITLE for the naming word first (`intitle:`), constrained to bitmaps, and to fall back
    to free text only when that finds nothing.
    """
    words = [w for w in term.split() if len(w) > 2]
    tries = [f'intitle:"{m}" filetype:bitmap' for m in must[:3]]
    tries += [" ".join(words[:4]) + " filetype:bitmap", term]
    ts = []
    for q in tries:
        try:
            r = S.get(WIKI, params={"action": "query", "format": "json", "list": "search",
                                    "srsearch": q, "srnamespace": 6, "srlimit": 50}, timeout=40)
            cand = [t["title"] for t in r.json().get("query", {}).get("search", [])]
        except Exception:
            continue
        cand = [t for t in cand if (not must or any(m in t.lower() for m in must))
                and not any(x in t.lower() for x in reject)
                and not t.lower().endswith((".pdf", ".svg", ".tif", ".tiff", ".webm", ".ogv",
                                            ".gif", ".djvu", ".xcf", ".stl"))]
        cand = [t for t in cand if not any(x in t.lower() for x in GLOBAL_REJECT)]
        if cand:
            ts = sorted(cand, key=lambda t: -title_score(t, words))
            break
    if not ts:
        return None
    r = S.get(WIKI, params={"action": "query", "format": "json", "titles": "|".join(ts[:40]),
                            "prop": "imageinfo", "iiprop": "url|extmetadata",
                            "iiurlwidth": 1200}, timeout=40)
    pages = r.json().get("query", {}).get("pages", {})
    for pg in sorted(pages.values(), key=lambda p: ts.index(p["title"]) if p.get("title") in ts else 99):
        ii = (pg.get("imageinfo") or [{}])[0]
        if not ii.get("thumburl"):
            continue
        em = ii.get("extmetadata", {})
        lic = strip((em.get("LicenseShortName") or {}).get("value")) or "public domain"
        if any(x in lic.lower() for x in LIC_REJECT):
            continue
        return dict(url=ii["thumburl"], src="Wikimedia Commons",
                    lic=lic,
                    credit=strip((em.get("Artist") or {}).get("value")) or "unknown",
                    page=ii.get("descriptionurl"), found=pg["title"].replace("File:", ""),
                    instdate=strip((em.get("DateTimeOriginal") or {}).get("value"))[:40])
    return None


def met(q, must, reject):
    ids = (S.get(MET + "/search", params={"q": q, "hasImages": "true", "isPublicDomain": "true"},
                 timeout=45).json().get("objectIDs") or [])[:40]
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
                        page=o.get("objectURL"), found=o.get("title"),
                        instdate=(o.get("objectDate") or "")[:40])
    return None


def cma(q, must, reject):
    d = S.get(CMA, params={"q": q, "cc0": 1, "has_image": 1, "limit": 30}, timeout=45).json()
    for a in d.get("data", []):
        t = (a.get("title") or "").lower()
        if must and not any(m in t for m in must):
            continue
        if any(x in t for x in reject):
            continue
        u = ((a.get("images") or {}).get("web") or {}).get("url")
        if u:
            return dict(url=u, src="Cleveland Museum of Art", lic="CC0",
                        credit=a.get("creditline") or "Cleveland Museum of Art",
                        page=a.get("url"), found=a.get("title"),
                        instdate=(a.get("creation_date") or "")[:40])
    return None


def artic(q, must, reject):
    d = S.get(ART, params={"q": q, "limit": 30,
                           "fields": "id,title,date_display,image_id,is_public_domain,credit_line,place_of_origin"},
              timeout=45).json()
    for a in d.get("data", []):
        t = (a.get("title") or "").lower()
        if not a.get("is_public_domain") or not a.get("image_id"):
            continue
        if must and not any(m in t for m in must):
            continue
        if any(x in t for x in reject):
            continue
        # ARTIC's IIIF endpoint 403s a bare UA and hands back an HTML error page, which is what
        # 'cannot identify image file' actually was. It documents its own header; send it.
        S.headers["AIC-User-Agent"] = "HumanHistory (dustincole.ent@gmail.com)"
        return dict(url=f"https://www.artic.edu/iiif/2/{a['image_id']}/full/843,/0/default.jpg",
                    src="Art Institute of Chicago", lic="CC0",
                    credit=a.get("credit_line") or "Art Institute of Chicago",
                    page=f"https://www.artic.edu/artworks/{a['id']}", found=a.get("title"),
                    instdate=(a.get("date_display") or "")[:40])
    return None


GATHER = {"com": commons, "met": met, "cma": cma, "art": artic}


def run_spec(spec):
    """Run the named source, then fall back across the others.

    The first full pass lost 33 candidates to a single-source miss, and 27 of the 33 were
    non-Western — a museum-coverage gap turning straight into the Western skew R4 exists to
    prevent. Two different causes, one fix: the Met holds a batik but titles it 'Sarong (Kain
    Lepas)' with no usable image file, and it holds no public-domain djembe or mbira at all.
    Falling through to the other open collections recovers both.
    """
    src, rest = spec.split(":", 1)
    parts = rest.split("|")
    q = parts[0]
    must = [w.strip() for w in parts[1].split(",")] if len(parts) > 1 and parts[1] else []
    reject = [w.strip() for w in parts[2].split(",")] if len(parts) > 2 and parts[2] else []
    for name in [src] + [s for s in ("met", "art", "cma", "com") if s != src]:
        try:
            c = GATHER[name](q, must, reject)
        except Exception:
            c = None
        if c:
            return c
    return None


# ---------------------------------------------------------------- 13's second admission test
def frag_score(im):
    """Share of the object's own opaque area carrying local detail, at render size.

    High where pattern / print / text / circuitry / joinery is distributed across the body — those
    pieces still read after the Voronoi cut. Low on a plain sphere, a bare blade, a solid mass.
    """
    im = im.copy()
    im.thumbnail((RENDER_MAX, RENDER_MAX), Image.LANCZOS)
    lum, alpha = im.convert("L"), im.split()[3]
    W, H, C = im.width, im.height, 16
    lp, ap = lum.load(), alpha.load()
    inside = detailed = 0
    for cy in range(0, H - C + 1, C):
        for cx in range(0, W - C + 1, C):
            vals = [lp[x, y] for y in range(cy, cy + C) for x in range(cx, cx + C)
                    if ap[x, y] > 128]
            if len(vals) < C * C * 0.6:
                continue
            inside += 1
            m = sum(vals) / len(vals)
            sd = (sum((v - m) ** 2 for v in vals) / len(vals)) ** 0.5
            if sd > 12:
                detailed += 1
    return round(detailed / inside, 3) if inside else 0.0


def date_gap(year, instdate, src):
    """Institution's own date vs the authored year. Returns the smallest gap in years, or None.

    Only the museum APIs are checkable: Met `objectDate`, Cleveland `creation_date` and ARTIC
    `date_display` all describe the OBJECT. Commons' `DateTimeOriginal` usually describes the
    PHOTOGRAPH, so comparing it to the artifact's year is nonsense — those entries are marked
    `datesrc: authored` and their dates rest on the editorial list, not on a second source.
    """
    if not instdate or src == "Wikimedia Commons":
        return None
    bce = bool(re.search(r"\bB\.?\s?C", instdate, re.I))     # one era marker governs the string
    cent = "centur" in instdate.lower()
    yrs = []
    for m in re.finditer(r"\d{1,4}", instdate):
        n = int(m.group())
        if n == 0:
            continue
        if cent and n <= 21:                                  # '15th–16th century' -> 1450, 1550
            n = n * 100 - 50
        yrs.append(-n if bce else n)
    if not yrs:
        return None
    if min(yrs) <= year <= max(yrs):        # the institution gives a range and we sit inside it
        return 0
    return min(abs(year - y) for y in yrs)


# ---------------------------------------------------------------- contact sheets
def sheets(meta):
    from build_data import DROP          # already-condemned cells are noise on the sheet
    keys = sorted((k for k in meta if k not in DROP), key=lambda k: meta[k]["year"])
    cell, cols, lab = 250, 6, 34
    per = cols * 5
    for page in range((len(keys) + per - 1) // per):
        chunk = keys[page * per:(page + 1) * per]
        rows = (len(chunk) + cols - 1) // cols
        s = Image.new("RGB", (cell * cols, (cell + lab) * rows), (232, 72, 72))
        d = ImageDraw.Draw(s)
        for i, k in enumerate(chunk):
            p = os.path.join(OUT, k + ".webp")
            if not os.path.exists(p):
                continue
            im = Image.open(p).convert("RGBA")
            im.thumbnail((cell - 16, cell - 16), Image.LANCZOS)
            ox, oy = (i % cols) * cell, (i // cols) * (cell + lab)
            s.paste(im, (ox + (cell - im.width) // 2, oy + (cell - im.height) // 2), im)
            m = meta[k]
            d.text((ox + 6, oy + cell + 2), f"{k}  {m.get('tier','?')}  f{m.get('frag','?')}",
                   fill=(255, 255, 255))
            d.text((ox + 6, oy + cell + 16), f"{m['disp'][:16]} {str(m.get('found',''))[:22]}",
                   fill=(255, 220, 220))
        s.save(f"sheet5-{page + 1}.png")
    print(f"{(len(keys) + per - 1) // per} sheets, {len(keys)} items")


# ---------------------------------------------------------------- main
if __name__ == "__main__":
    meta = json.load(open("sourced.json", encoding="utf-8")) if os.path.exists("sourced.json") else {}

    if "--sheets" in sys.argv:
        sheets(meta); sys.exit()

    if "--score" in sys.argv:
        for k, d in meta.items():
            p = os.path.join(OUT, k + ".webp")
            if os.path.exists(p):
                d["frag"] = frag_score(Image.open(p).convert("RGBA"))
        json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        # the twelve legacy cut-outs have no sourcing record, so their score goes in its own file
        legacy = {}
        for f in os.listdir(OUT):
            k = f[:-5]
            if f.endswith(".webp") and k not in meta:
                legacy[k] = frag_score(Image.open(os.path.join(OUT, f)).convert("RGBA"))
        json.dump(legacy, open("frag.json", "w", encoding="utf-8"), indent=1)
        print("scored", sum(1 for d in meta.values() if "frag" in d), "+", len(legacy), "legacy")
        sys.exit()

    if "--fixdates" in sys.argv:
        n = 0
        for k, d in meta.items():
            g = date_gap(d["year"], d.get("instdate"), d.get("src", ""))
            d["dategap"], d["datesrc"] = g, ("authored" if g is None else "institution")
            n += g is not None
        json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        print(f"{n} of {len(meta)} dates checked against the holding institution"); sys.exit()

    from rembg import remove, new_session
    sess = new_session("isnet-general-use")
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    count = int(sys.argv[2]) if len(sys.argv) > 2 else len(ITEMS)

    for key, name, year, disp, bucket, region, tier, spec in ITEMS[start:start + count]:
        if key in meta:
            continue
        try:
            c = run_spec(spec)
        except Exception as e:
            print(f"{key:13s} GATHER FAIL {e!r:.45}"); continue
        if not c:
            print(f"{key:13s} no candidate"); continue
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
                print(f"{key:13s} rejected cov={cov:.2f} {cut.size}"); continue
            cut.save(os.path.join(OUT, key + ".webp"), "WEBP", quality=88, method=5)
            gap = date_gap(year, c.get("instdate"), c["src"])
            c.update(key=key, name=name, year=year, disp=disp, region=region, bucket=bucket,
                     tier=tier, spec=spec, cov=round(cov, 3), size=list(cut.size),
                     frag=frag_score(cut), dategap=gap,
                     datesrc="authored" if gap is None else "institution")
            meta[key] = c
            flag = "  DATE?" if gap is not None and gap > 150 else ""
            print(f"{key:13s} f={c['frag']:.2f} cov={cov:.2f} {str(cut.size):11s} "
                  f"{str(c['found'])[:34].encode('ascii','replace').decode()}{flag}")
            del raw, im, cut
            gc.collect()
            json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        except Exception as e:
            print(f"{key:13s} CUT FAIL {e!r:.55}")

    json.dump(meta, open("sourced.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print("TOTAL", len(meta))
