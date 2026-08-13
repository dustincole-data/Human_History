"""TICKET 02 — re-fetch the ORIGINALS the 236 masters were cut from. Nothing under site/ is touched.

The originals were never retained: `source5.py` fetched, matted and wrote `img/<key>.webp`, and
the file it cut from went to memory. Without them the review surface can rank a suspect cut-out
but cannot answer the only question that settles one — *was that hole in the object, or in the
photograph?* This writes `orig/<key>.jpg`, which is the flag `review02.py` reads into `o` and the
zoom's second pane draws.

    python refetch02.py              # fetch every missing original (resumable; skips what exists)
    python refetch02.py --dry        # resolve URLs and print the plan, fetch nothing

`sourced.json` holds the DIRECT url for 225 of the 236 — that is the exact file the master was cut
from, so it is used verbatim: upgrading a 1280px thumb to the full original would put a different
image in the pane than the one the cut was made against, which is the comparison being built.

The other **11 predate `source5.py`** and have no row in it. Their record page is all that survives,
so the file is resolved back out of it (Commons `imageinfo` at 1200px, the Met's `primaryImage`,
Cleveland's `images.web`) and recorded in `orig/resolved.json` as `via: "page"` — it is the same
artifact and not provably the same file, and the pane must not imply otherwise.

Writes: orig/<key>.jpg   — bytes verbatim, whatever the source served. The name is fixed because
                           review02.html asks for `.jpg`; a PNG or WebP payload renders anyway,
                           and re-encoding to make the extension true would cost the pane the
                           artifact it exists to show.
        orig/resolved.json — per key: the url used, how it was found, bytes, and any failure.
"""
import json, os, sys, time, urllib.parse
import requests
from PIL import Image
from io import BytesIO

from review02 import shipped, HERE

UA = "HumanHistoryPrototype/0.5 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
# ARTIC 403s a bare UA and hands back an HTML error page — source5.py hit this and documented it;
# the header is ARTIC's own. Set once, because every one of its 14 rows fails without it.
S.headers["AIC-User-Agent"] = "HumanHistory (dustincole.ent@gmail.com)"
WIKI = "https://commons.wikimedia.org/w/api.php"
MET = "https://collectionapi.metmuseum.org/public/collection/v1"
CMA = "https://openaccess-api.clevelandart.org/api/artworks/"
ORIG = os.path.join(HERE, "orig")
DRY = "--dry" in sys.argv
BACKOFF = [5, 15, 45, 90]
PACE = 0.6      # 0.2s over ~180 upload.wikimedia.org rows is what tripped the limit


def from_page(page):
    """The 11 with no sourced.json row. Returns (url, note) or (None, why)."""
    if not page:
        return None, "no record page"
    if "commons.wikimedia.org" in page:
        title = urllib.parse.unquote(page.split("/wiki/", 1)[1])
        r = S.get(WIKI, params={"action": "query", "format": "json", "titles": title,
                                "prop": "imageinfo", "iiprop": "url", "iiurlwidth": 1200},
                  timeout=40).json()
        for pg in (r.get("query", {}).get("pages") or {}).values():
            ii = (pg.get("imageinfo") or [{}])[0]
            u = ii.get("thumburl") or ii.get("url")
            if u:
                return u, "commons imageinfo"
        return None, "commons returned no imageinfo"
    if "metmuseum.org" in page:
        oid = page.rstrip("/").rsplit("/", 1)[1]
        o = S.get(f"{MET}/objects/{oid}", timeout=30).json()
        u = o.get("primaryImage") or o.get("primaryImageSmall")
        return (u, "met primaryImage") if u else (None, "met object has no image")
    if "clevelandart.org" in page:
        acc = page.rstrip("/").rsplit("/", 1)[1]
        # the accession endpoint answers directly for most rows; search is the fallback for the rest
        for call in (lambda: S.get(CMA + acc, timeout=30),
                     lambda: S.get(CMA, params={"q": acc, "limit": 5}, timeout=30)):
            try:
                d = call().json()
            except Exception:
                continue
            recs = d.get("data")
            recs = recs if isinstance(recs, list) else [recs] if recs else []
            for a in recs:
                imgs = a.get("images") or {}
                u = ((imgs.get("web") or imgs.get("print") or imgs.get("full") or {}).get("url"))
                if u:
                    return u, "cleveland images.web"
        return None, "cleveland returned no image"
    return None, "unrecognised host"


def grab(url, dest):
    """Verbatim bytes, but only after PIL agrees they decode — an HTML error page is 200 too.

    A 429 is not a transient error and a 1.5s retry is not a backoff: the first run tripped
    Wikimedia's rate limit around request 180 and then lost every remaining upload.wikimedia.org
    row to the same 429, because each retry arrived while the limit was still in force.
    """
    for attempt in range(4):
        try:
            r = S.get(url, timeout=60)
            if r.status_code == 429:
                wait = int(r.headers.get("Retry-After") or 0) or BACKOFF[attempt]
                print(f"      429, waiting {wait}s")
                time.sleep(wait)
                continue
            r.raise_for_status()
            Image.open(BytesIO(r.content)).verify()
            open(dest, "wb").write(r.content)
            return len(r.content), None
        except Exception as e:
            if attempt == 3:
                return 0, f"{type(e).__name__}: {str(e)[:120]}"
            time.sleep(BACKOFF[attempt])
    return 0, "rate limited on every attempt"


def main():
    os.makedirs(ORIG, exist_ok=True)
    src = json.load(open(os.path.join(HERE, "sourced.json"), encoding="utf-8"))
    items = shipped()
    # a resumed run must not overwrite the record of how the first run found a file with
    # "already on disk" — that url IS the provenance the pane's second image is claiming
    prev = os.path.join(ORIG, "resolved.json")
    log = json.load(open(prev, encoding="utf-8")) if os.path.exists(prev) else {}
    done, got, failed, bytes_ = 0, 0, [], 0

    for i, it in enumerate(items):
        k = it["k"]
        dest = os.path.join(ORIG, k + ".jpg")
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            done += 1
            log.setdefault(k, dict(url=None, via="already on disk",
                                   bytes=os.path.getsize(dest)))
            continue

        url, via = src.get(k, {}).get("url"), "sourced.json"
        if not url:
            url, via = from_page(it.get("url"))
        if not url:
            failed.append((k, via)); log[k] = dict(url=None, via="page", err=via)
            print(f"  {k:12s} UNRESOLVED  {via}")
            continue

        if DRY:
            print(f"  {k:12s} {via:22s} {url[:110]}")
            log[k] = dict(url=url, via=via)
            continue

        n, err = grab(url, dest)
        log[k] = dict(url=url, via=via, bytes=n, **({"err": err} if err else {}))
        if err:
            failed.append((k, err)); print(f"  {k:12s} FAILED  {err}")
        else:
            got += 1; bytes_ += n
        time.sleep(PACE)
        if (i + 1) % 40 == 0:
            print(f"  {i + 1}/{len(items)}  ({got} fetched, {len(failed)} failed)")

    json.dump(log, open(os.path.join(ORIG, "resolved.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"\n{got} fetched, {done} already on disk, {len(failed)} failed"
          f"   {bytes_ / 1e6:.1f} MB   -> orig/")
    for k, why in failed:
        print(f"  FAIL {k:12s} {why}")


if __name__ == "__main__":
    main()
