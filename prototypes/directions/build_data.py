"""PROTOTYPE — regenerate data.js from sourced.json plus the twelve legacy cut-outs.

Hand-maintaining the item list stopped being safe once it passed three dozen. sourced.json is
the record the sourcing passes actually wrote; this turns it into the file the demos read, and
applies the by-eye verdicts from the contact sheet (drops and renames) in one visible place.
"""
import io, json, os

# thrown out on the contact sheet — wrong object, unreadable cut, or a constraint breach
DROP = {
    "hanfigure":  "washed-out cut, unreadable",
    "barbie":     "returned a cloth purse, not a doll",
    "beetle":     "returned the Porta Nigra, not a car",
    "telegraph":  "scattered parts, unrecognisable",
    "phonograph": "a period engraving of a scene, not an object",
    "armillary":  "returned a blue-and-white dish",
    "shuttle":    "a modern 3D model render — banned, not merely wrong",
    "sputnik":    "cut shredded the antennas; image already deleted",
    # ticket 05 — R1, and the pass-5 contact sheets (sheet5-*.png), eyeballed one cell at a time
    "aldrin":       "05 R1 — an identifiable person is not the falling object; apollosuit replaces it",
    "narmer":       "returned a line drawing of a figure, not the palette",
    "oracle":       "returned a modern annotated chart of oracle-bone glyphs, not a bone",
    "stonehenge":   "a site, not an object — the cut is a 40px strip of blocks. 11's filter, working",
    "trundholm":    "cut kept only a crumpled disc face; reads as torn gold foil, not a chariot",
    "scythstag":    "the file is a REPRODUCTION — neither the artifact nor made at the time",
    "jadesuit":     "matte shredded it into unreadable dark fragments",
    "changxin":     "matte kept the vitrine glare; the lamp does not read",
    "meroe":        "R2 — frag 0.22 on a plain jar, and not tier A",
    "diamondsutra": "matte returned near-empty specks",
    "chacmool":     "matte returned scattered white fragments",
    "palafolio":    "a 20px-tall strip; no body to break",
    "mercator":     "matte shredded the globe gores into noise",
}
# the sheet also corrected one tier: antikythera is not named on sight, it is a corroded plate
RETIER = {"antikythera": "C"}

# ---------------------------------------------------------------------------------------------
# The pass-5 eyeball: 101 more thrown out across eleven labelled contact sheets, one cell at a
# time. Grouped by WHY, because the shape of the failure is the finding — an automated pass is
# good at acquiring and hopeless at choosing, and this is what that costs. 30% of everything the
# machine fetched was unusable, and no coverage check would have caught most of it: a butterfly
# has excellent alpha coverage and a beautiful fragment score.
DROP5 = {}
for _keys, _why in [
    # --- WRONG SUBJECT ENTIRELY. The search matched a word, not a thing.
    (("dongson", "hopewell", "barbedwire", "abshield", "mpesa", "microscope", "concorde",
      "container", "f1engine", "bogolan", "rickshaw", "inuitcarve", "nok", "samovar", "zapotec",
      "wayang", "fez", "solarlantern", "papunya", "skateboard", "birchcanoe", "incallama",
      "mongolbow", "celglobe", "zimbird", "vwbeetle", "oxusarmlet"),
     "wrong subject — the query matched a word, not the artifact"),
    # --- A PERSON, or a crowd. R1: the falling object is never someone's body.
    (("levis", "singer", "charkha", "keffiyeh", "luchamask", "sari", "jaipurfoot", "zulushield",
      "didgeridoo", "monopoly", "chucktaylor", "wiimote", "hillshoist", "cablesample", "bulla",
      "ahuula", "kente", "talkingdrum", "pokemoncard", "gutenberg", "pekingmask"),
     "R1 — a person, a crowd or a mannequin, not the made object"),
    # --- A REPLICA, A COUNTERFEIT OR A MODERN SPECIMEN. Neither the artifact nor made at the time.
    (("h4", "transistor", "fatman", "f91w", "n95", "sputnik2", "stethoscope", "panamahat"),
     "a replica, a counterfeit or a modern specimen — the claim is 'real artifact, or made at "
     "the time', and this is neither"),
    # --- A DIAGRAM, A DRAWING, A PLAN OR A LABEL. Period prints are legal; captions are not.
    (("hookah", "encyclopedie", "davylamp", "djennejeno", "amaravati", "aksum", "lapita"),
     "a plan, a design drawing or a photograph with its museum label / scale bar in frame"),
    # --- THE MATTE FAILED. Nothing legible survived the cut.
    (("safavid", "dunlap", "chinesenote", "jikji", "gramophone", "tubemap", "postit", "paracas",
      "hanafuda", "cinematog", "wagenfeld", "quranfolio", "hansilk", "linglingo", "edisonphono",
      "instantramen", "gobekli2", "ambassador", "shinkansen", "ak47"),
     "the matte returned nothing legible — specks, strips, or the object with its own shadow"),
    # --- R2, MEASURED. Outline-only, and not recognisable enough to earn a whole-object life.
    (("moonjar", "shahjahan", "timurid", "snuffbottle", "enamelmug", "navajoblanket", "otziaxe",
      "shangjade"),
     "R2 — frag below 0.25 and not tier A; nothing in the pieces to read"),
    # --- DUPLICATE of something already in the set.
    (("hoysala", "burmalacquer", "valdivia", "kerma"),
     "the same object as another entry, found twice under different names"),
    # --- RIGHT KIND OF THING, WRONG DATE. A renameable object whose date would become a lie.
    (("hongshan", "chiwara", "kodak1", "karaoke", "appleii"),
     "the object is real but is not the one the row dated; renaming it would move the date, and "
     "a wrong date is the one thing that cannot be traded away"),
]:
    for _k in _keys:
        DROP5[_k] = _why
DROP.update(DROP5)

# the search found a real artifact, but not the one the key claimed. name it for what it IS.
RENAME = {
    "gu":          ("Shang ritual wine vessel (jue)", -1200, "c. 1200 BCE"),
    "nataraja":    ("Ardhanarishvara, Chola bronze",   1050, "c. 1050"),
    "dogon":       ("Dogon Aduno Koro vessel",         1700, "c. 1700"),
    "mayavessel":  ("Whistling vessel",                 750, "c. 750 CE"),
    "nes":         ("Super Nintendo",                  1990, "1990"),
    "playstation": ("PlayStation Vita",                2011, "2011"),
    "ipod":        ("iPods",                           2001, "2001"),
    # pass 5: three where the sheet showed a real object of the right date under the wrong name
    "v2":          ("V-2 rocket engine",               1944, "1944"),
    "strat":       ("Fender electric guitars",         1954, "c. 1954"),
    "apollosuit":  ("Apollo 15 mission patch",         1971, "1971"),

    # --- DATE VERIFICATION, pass 5. The museum API's own object date was captured alongside every
    # candidate and compared to the authored year; 22 disagreed by more than 150 years once the
    # parser stopped mistaking '15th century' for the year 15. In every one of these the
    # INSTITUTION WINS — it holds the object. Six more disagreed so hard that the identity went
    # with the date (a 15th-century textile is not adire) and those are drops, not redates.
    "songding":    ("Bronze ritual vessel (ding)",     -1050, "late 11th–early 10th century BCE"),
    "hanlacquer":  ("Qing lacquer tea bowl",            1750, "Qing dynasty, Qianlong reign"),
    "banpo":       ("Painted Neolithic basin",         -2150, "c. 2300–2000 BCE"),
    "agroup":      ("Kerma beaker",                    -1720, "c. 1802–1640 BCE"),
    "pyramidion":  ("Pyramidion",                       -595, "664–525 BCE"),
    "shabti":      ("Shabti figure",                    -330, "360–300 BCE"),
    "incense":     ("Incense burner",                   1850, "19th century"),
    "lacquerbox":  ("Lacquer box",                      1425, "first half of the 15th century"),
    "heitiki":     ("Hei-tiki pendant",                 1850, "19th century"),
    "gorget":      ("Engraved shell gorget",            1595, "1590/1600"),
    "rhyton":      ("Silver rhyton",                     -50, "c. 1st century BCE"),
    "tanegashima": ("Japanese matchlock",               1850, "c. 1850"),
    "kesi":        ("Kesi silk robe",                   1890, "late 19th–early 20th century"),
    "bidri":       ("Bidri vessel",                     1630, "early–mid 17th century"),
    "nkisi":       ("Kongo power figure",               1890, "c. 1880–1900"),
}

# the date moved so far that the identity went with it — these are not the objects the row named
DROP.update({k: "date verification — the institution dates it centuries away from the row, so "
                "this is not the artifact the row named"
             for k in ("romanhelmet", "olmecjade", "argillite", "adire", "cloisonne")})
DROP["khmerbronze"] = "R2 — frag 0.14 and not tier A"

# R4's Western cap is 34% and the finished set measured 34.6%. Three of the weakest post-1600
# North American entries go, rather than the line moving — a cap you widen when you miss it is
# not a cap. All three are redundant against something stronger already in the set.
DROP.update({"reveretea": "R4 — Western cap; a colonial teapot no stranger reads",
             "camera":    "R4 — Western cap; the fifth camera, and the weakest of them",
             "dc3":       "R4 — Western cap; flyer, spitfire, zero and b747 already carry aviation",
             "imac":      "R4 — Western cap; the fourth Apple object, behind mac, ipod and iphone"})

# the twelve from the first anchor preview; their records live here because they predate sourced.json
LEGACY = [
    dict(k='jar',     y=-2975, disp="3300–2650 BCE", n="Painted jar", src='Cleveland Museum of Art', lic='CC0', cred='Cleveland Museum of Art', url="https://clevelandart.org/art/2004.64"),
    dict(k='indus',   y=-2000, disp="c. 2000 BCE", n="Seal with unicorn", src='Cleveland Museum of Art', lic='CC0', cred='Cleveland Museum of Art', url="https://clevelandart.org/art/1964.104"),
    dict(k='amphora', y=-540,  disp="c. 540 BCE", n="Neck-amphora", src='The Met', lic='CC0', cred='The Met', url="https://www.metmuseum.org/art/collection/search/250551"),
    dict(k='armor',   y=1683,  disp="c. 1683", n="Harquebusier’s armour", src='The Met', lic='CC0', cred='The Met', url="https://www.metmuseum.org/art/collection/search/27792"),
    dict(k='rocket',  y=1829,  disp="1829", n="Stephenson’s Rocket", src='Wikimedia Commons', lic='public domain', cred='Samuel Smiles (engraving)', url="https://commons.wikimedia.org/wiki/File:Rocket_(Smiles).jpg"),
    dict(k='phone',   y=1876,  disp="1876", n="Bell telephone receiver", src='Wikimedia Commons', lic='public domain', cred='C. E. Scribner', url="https://commons.wikimedia.org/wiki/File:Bell_%22iron_box%22_telephone_receiver_1876.jpg"),
    dict(k='bulb',    y=1880,  disp="c. 1880", n="Edison lamps", src='Wikimedia Commons', lic='CC BY-SA 3.0', cred='Richard Warren Lipack', url="https://commons.wikimedia.org/wiki/File:1880EDISON1881LampsSOCKETSrwLIPACKowner.jpg"),
    dict(k='flyer',   y=1903,  disp="1903", n="Wright Flyer", src='Wikimedia Commons', lic='public domain', cred="New Student’s Reference Work", url="https://commons.wikimedia.org/wiki/File:NSRW_Wright_Brothers_Aeroplane.png"),
    dict(k='camera',  y=1930,  disp="c. 1930", n="Kodak Beau Brownie", src='Wikimedia Commons', lic='CC BY-SA 4.0', cred='Cquoi', url="https://commons.wikimedia.org/wiki/File:Kodak_2A_Beau_Brownie.jpg"),
    dict(k='chip',    y=1971,  disp="1971", n="Intel 4004", src='Wikimedia Commons', lic='CC BY-SA 4.0', cred='Al. Struk', url="https://commons.wikimedia.org/wiki/File:4-%D0%B1%D1%96%D1%82%D0%BD%D0%B8%D0%B9_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D0%BE%D1%80_Intel_4004.jpg"),
    dict(k='neogeo',  y=1994,  disp="1994", n="Neo Geo CD", src='Wikimedia Commons', lic='public domain', cred='Evan-Amos', url="https://commons.wikimedia.org/wiki/File:Neo-Geo-CD-TopLoader-wController-FL.jpg"),
    dict(k='boombox', y=1995,  disp="1990s", n="CD boombox", src='Wikimedia Commons', lic='CC BY 3.0', cred='Andrevruas', url="https://commons.wikimedia.org/wiki/File:AIWA_CSD-ES100_Compact_Disc_Stereo_Radio_Cassette_Recorder_(cropped).jpg"),
]

def contemporaries(rows):
    """01 asked for the intended adjacency to be RECORDED, not just to emerge.

    Simultaneity surprise is 'closest in time, furthest in culture', so it is computed rather
    than authored: for each item, the nearest item in time from a different region bucket, tie
    broken toward something a stranger recognises. `adj` is that key, `gap` the years between.
    An item whose nearest foreign neighbour is centuries away has no double-take in it, and the
    gap column is how 04 and 07 find the ones worth planting a callout on.
    """
    for i, r in enumerate(rows):
        best = None
        for j, o in enumerate(rows):
            if i == j or o["b"] == r["b"]:
                continue
            g = abs(o["y"] - r["y"])
            score = (g, 0 if o["t"] == "A" else 1)
            if best is None or score < best[0]:
                best = (score, o["k"], g)
        r["adj"], r["gap"] = (best[1], best[2]) if best else ("", -1)


if __name__ == "__main__":
    import catalog
    src = json.load(open("sourced.json", encoding="utf-8"))
    lf = json.load(open("frag.json", encoding="utf-8")) if os.path.exists("frag.json") else {}
    rows = []
    for r in LEGACY:
        if r["k"] in DROP:
            continue
        b, t = catalog.EXISTING.get(r["k"], ("?", "C"))
        rows.append(dict(r, b=b, t=t, f=lf.get(r["k"], src.get(r["k"], {}).get("frag", 0)),
                         reg="", inst="", dc=0 if r["disp"][:2] != "c." else 1, dv="authored"))
    for k, d in src.items():
        if k in DROP:
            continue
        name, year, disp = d["name"], d["year"], d["disp"]
        if k in RENAME:
            name, year, disp = RENAME[k]
        b, t = catalog.EXISTING.get(k, (d.get("bucket", "?"), d.get("tier", "C")))
        t = RETIER.get(k, t)
        rows.append(dict(k=k, y=year, disp=disp, n=name, src=d["src"], lic=d["lic"],
                         cred=d["credit"], url=d["page"], b=b, t=t, f=d.get("frag", 0),
                         reg=d.get("region", ""), inst=d.get("found", ""),
                         dc=0 if disp[:2] not in ("c.", "c ") and "-" not in disp[1:] else 1,
                         dv=d.get("datesrc", "authored")))
    rows.sort(key=lambda r: r["y"])
    contemporaries(rows)

    # a Commons credit line can be several lines long ("derivative work: ..."), and an unescaped
    # newline splits the row and takes the whole file down with a SyntaxError. Caught by loading
    # the prototype, not by reading the generator.
    def esc(s):
        s = (s or "").replace("\\", "\\\\").replace('"', '\\"')
        return " ".join(s.split())

    out = io.StringIO()
    out.write(f"""/* {len(rows)} real, cited, licence-clean cut-outs — ticket 05's arrival set.
   GENERATED by build_data.py from sourced.json — edit that pipeline, not this file.
   y   absolute year, negative = BCE, epoch = plain Gregorian.
   disp the date as the holding institution publishes it.
   b   region bucket (05 R4)   t  recognisability tier (05 R3)   f  fragment legibility (05 R2)
   reg the region as written for a reader   inst the holding institution's own title for it
   dc  1 = the date is hedged (c., or a range)   dv  where the date comes from:
       'institution' = checked against the museum API's own object date; 'authored' = the
       editorial list only, because Commons dates the PHOTOGRAPH, not the artifact.
   The one-line description is deliberately NOT here: the site has no voice yet, and writing 250
   of them before 07 sets one is waste. 05 supplies the slot, `inst` and `reg` as raw material.
   adj the nearest contemporary from a different region, gap the years to it (01). */
window.ITEMS = [
""")
    for r in rows:
        out.write(f'  {{k:"{r["k"]}", y:{r["y"]}, disp:"{esc(r["disp"])}", n:"{esc(r["n"])}", '
                  f'src:"{esc(r["src"])}", lic:"{esc(r["lic"])}", cred:"{esc(r["cred"])}", '
                  f'url:"{esc(r["url"])}", b:"{r["b"]}", t:"{r["t"]}", f:{r["f"]}, '
                  f'reg:"{esc(r["reg"])}", inst:"{esc(r["inst"])}", dc:{r["dc"]}, '
                  f'dv:"{r["dv"]}", adj:"{r["adj"]}", gap:{r["gap"]}}},\n')
    out.write("""];

/* Five movements. Shared across every direction so they are comparable —
   what differs is how each renders a movement, not where the movements fall. */
window.MOVEMENTS = [
  {id:'deep',    from:-9999, to:-500, per:1, title:'the long thin start'},
  {id:'spread',  from:-499,  to:1300, per:2, title:'it starts happening in more places'},
  {id:'trade',   from:1301,  to:1800, per:3, title:'everything reaches everything'},
  {id:'machine', from:1801,  to:1960, per:4, title:'the machine century'},
  {id:'now',     from:1961,  to:9999, per:5, title:'all of it at once'}
];
""")
    io.open("data.js", "w", encoding="utf-8").write(out.getvalue())
    print(f"data.js: {len(rows)} items  ({len(DROP)} dropped, {len(RENAME)} renamed)")
