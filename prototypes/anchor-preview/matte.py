"""Re-cut with a real matting model, and test the ones the flood-fill COULDN'T do:
scenes, non-uniform backgrounds, dark space shots. If these work, the 'must be on a
uniform museum sweep' sourcing constraint disappears."""
import io, json, os, re
import requests
from PIL import Image
from rembg import remove, new_session

UA = "HumanHistoryPreview/0.1 (https://dustincoledata.com; dustincole.ent@gmail.com)"
S = requests.Session(); S.headers["User-Agent"] = UA
OUT = "ml"; os.makedirs(OUT, exist_ok=True)
WIKI = "https://commons.wikimedia.org/w/api.php"
CMA  = "https://openaccess-api.clevelandart.org/api/artworks/"
sess = new_session("isnet-general-use")
strip = lambda h: re.sub(r"<[^>]+>", "", h or "").strip()

def commons_first(term, must):
    r = S.get(WIKI, params={"action":"query","format":"json","list":"search",
              "srsearch":term,"srnamespace":6,"srlimit":20}, timeout=40)
    ts=[t["title"] for t in r.json().get("query",{}).get("search",[])]
    ts=[t for t in ts if any(m in t.lower() for m in must) and not t.lower().endswith(".pdf")]
    if not ts: return None
    r = S.get(WIKI, params={"action":"query","format":"json","titles":"|".join(ts[:20]),
              "prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":1100}, timeout=40)
    for _,pg in r.json().get("query",{}).get("pages",{}).items():
        ii=(pg.get("imageinfo") or [{}])[0]
        if ii.get("thumburl"):
            em=ii.get("extmetadata",{})
            return dict(title=pg["title"].replace("File:",""),url=ii["thumburl"],
                        lic=strip((em.get("LicenseShortName") or {}).get("value")),
                        credit=strip((em.get("Artist") or {}).get("value")),
                        page=ii.get("descriptionurl"), src="Wikimedia Commons")
    return None

def cma_first(q, must):
    d=S.get(CMA, params={"q":q,"cc0":1,"has_image":1,"limit":20}, timeout=45).json()
    for a in d.get("data",[]):
        t=(a.get("title") or "").lower()
        if must and not any(m in t for m in must): continue
        u=((a.get("images") or {}).get("web") or {}).get("url")
        if u: return dict(title=a.get("title"),url=u,lic="CC0",credit=a.get("creditline"),
                          page=a.get("url"),src="Cleveland Museum of Art",date=a.get("creation_date"))
    return None

# THE HARD SET - every one of these defeated the flood fill
HARD = [
 ("lm_moon",  lambda: commons_first("Apollo 11 lunar module Eagle moon surface", ["lunar","eagle","apollo"])),
 ("aldrin",   lambda: commons_first("Aldrin Apollo 11 visor", ["aldrin"])),
 ("sputnik",  lambda: commons_first("Sputnik replica satellite museum", ["sputnik"])),
 ("mac",      lambda: commons_first("Apple Macintosh 128k computer", ["macintosh"])),
 ("modelt",   lambda: commons_first("Ford Model T 1908 car", ["model t","ford"])),
 ("jomon",    lambda: cma_first("Jomon vessel Japan", ["vessel","jar"])),
 ("gobekli",  lambda: commons_first("Gobeklitepe pillar", ["gobekli","göbekli"])),
 ("vaccine",  lambda: commons_first("COVID-19 vaccine vial", ["vaccine","vial"])),
 ("astrolabe",lambda: commons_first("astrolabe brass", ["astrolabe"])),
 ("cuneiform",lambda: commons_first("cuneiform tablet clay", ["cuneiform","tablet"])),
]
meta={}
for key, gen in HARD:
    try: c = gen()
    except Exception as e: print(key,"gather fail",e); continue
    if not c: print(key,"no candidate"); continue
    try:
        raw = S.get(c["url"], timeout=90).content
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.thumbnail((1000,1000), Image.LANCZOS)
        cut = remove(im, session=sess, post_process_mask=True)
        bb = cut.getbbox()
        if bb: cut = cut.crop(bb)
        cov = sum(1 for p in cut.getdata() if p[3] > 128) / (cut.width*cut.height)
        cut.save(os.path.join(OUT, key+".webp"), "WEBP", quality=90, method=5)
        c.update(key=key, cov=round(cov,3), size=list(cut.size))
        meta[key]=c
        print(f"{key:10s} cov={cov:.2f} {cut.size}  {c['title'][:52]}")
    except Exception as e:
        print(key,"cut fail",repr(e)[:90])

json.dump(meta, open("ml.json","w",encoding="utf-8"), indent=1, ensure_ascii=False)
names=sorted(meta); cell=270; cols=4; rows=(len(names)+cols-1)//cols
s=Image.new("RGB",(cell*cols,cell*max(rows,1)),(232,72,72))
for i,n in enumerate(names):
    im=Image.open(os.path.join(OUT,n+".webp")).convert("RGBA")
    im.thumbnail((cell-18,cell-18),Image.LANCZOS)
    s.paste(im,((i%cols)*cell+(cell-im.width)//2,(i//cols)*cell+(cell-im.height)//2),im)
s.save("mlsheet.png")
print("\nDONE", len(meta), "of", len(HARD))
