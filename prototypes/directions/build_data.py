"""PROTOTYPE — regenerate data.js from sourced.json plus the twelve legacy cut-outs.

Hand-maintaining the item list stopped being safe once it passed three dozen. sourced.json is
the record the sourcing passes actually wrote; this turns it into the file the demos read, and
applies the by-eye verdicts from the contact sheet (drops and renames) in one visible place.
"""
import io, json, os, re

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
# 2026-08-11: and the Switch 2 search returned its CONTROLLERS, which read as a category, not a name
RETIER = {"antikythera": "C", "switch2": "B"}

# ---------------------------------------------------------------------------------------------
# THE 2020s TAIL, 2026-08-11. 22 candidates fetched across three passes, 5 admitted inside
# 2023-2026 — a 77% loss against the set's own 36%, and that number IS the finding the reopen
# asked for. Two causes, and neither is fixable by trying harder:
#
#   1. A ONE-WORD `must` MATCHES A WORD, NOT A THING, and the recent set is full of names that
#      are also ordinary English. `starship` returned Jefferson Starship, `vikram` returned a
#      cricketer, `torch` returned a torch-CUT pipe. The second pass fixed this by making the
#      must-word the object's whole name, and that is a permanent lesson for any later pass.
#   2. NOTHING FROM THIS DECADE IS IN AN OPEN-ACCESS MUSEUM. Every row is Commons user
#      photography of an object still being sold, so the photograph is a product shot on white
#      (the matte returns the whole rectangle: cov 0.99, twice, for the semaglutide pen), a
#      screen-on device (the matte punches the black screen out as background: Switch 2, frag
#      0.096), or the object on the structure that holds it (Starship on its tower).
DROP9 = {
    "starship":   "Jefferson Starship, a rock band — the query matched a word, not a thing",
    "starship2":  "the vehicle cut together with its launch tower; a structure, not an object",
    "vikram":     "R1 — Vikram Solanki, a cricketer; the must-word was a first name",
    "chandrayaan":"a modern derived vector illustration of the lander, not a photograph — the "
                  "boundary ruled 2026-08-08 puts modern vector illustration out as firmly as "
                  "AI generation, and a high frag score is exactly what an illustration scores",
    "shahed":     "the recovered ENGINE, not the airframe, and the matte kept its mounting pole",
    "shahed2":    "a mockup on a display stand — the claim is 'a real artifact, or made at the "
                  "time', and a mockup is neither, on the same ground Sputnik 1 went",
    "fpvdrone":   "neon light trails at a drone race; frag 0.00 and no object in the frame",
    "mate60":     "a phone photographed for its screen — what survives the cut is a screenshot",
    "vinfast":    "the VinFast Fadil, a 2019 city car photographed front-on: right maker, wrong "
                  "object, and 2019 is outside a reopen scoped to 2020-2026",
    "vinfast2":   "a wheel",
    "torch2026":  "a torch-CUT pipe — 'torch' as a must-word matches a verb",
    "medal2026":  "an 1896 Olympic medal; right object, wrong date by 130 years",
    "roam2":      "an ampersand on a conveyor diagram",
    "switch2b":   "the console photographed screen-on; the matte read the black screen as "
                  "background and punched holes through it, frag 0.096",
    # not a failure — an editorial cut, made on the set and not on the image
    "su7":        "the third electric car in four years and the second Chinese one; byd (2022) "
                  "already carries it, and EAS is the set's largest overshoot at +7.9pp",
    # 07 item 7 — a licence, not an image. See catalog.py's note on lego2.
    "lego":       "GFDL 1.2 and nothing else, which a one-line credit on a shattering photograph "
                  "cannot satisfy — the licence text has to travel with the work",
    "lego2":      "the replacement, three queries deep: a 3D render, an Indonesian dance, and a "
                  "house model the matte shredded. Commons' free Lego is what people BUILT with it",
}
DROP.update(DROP9)

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

    # --- 2026-08-11, the 2020s tail. Both are the pass-5 rule again: the search found a real
    # artifact of the right date under the wrong name, so it is named for what it IS. The Switch 2
    # query returned its two controllers rather than the console — a real 2025 object, and one a
    # stranger reads as a category rather than by name, so it is retiered to B above.
    "switch2":     ("Joy-Con 2 controllers",            2025, "2025"),
    "torch2":      ("Olympic and Paralympic torches",   2026, "2026"),
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

# =============================================================================================
# TICKET 07 ITEM 3 — THE NOTATION SET. Three forms, one suffix rule, and nothing else prints.
#
# 05's R6 said `disp` is the date AS THE HOLDING INSTITUTION PUBLISHES IT, so the institution's
# own hedge is carried through rather than re-hedged. That was right for the RECORD and wrong for
# the PAGE: measured across the built set it prints SEVENTEEN different shapes, including four
# that are prose — "Qing dynasty, Qianlong reign", "first half of the 15th century", "19th
# century", "1990s" — which is the one thing the map forbids outright (*doubt lives in the
# notation, never in prose*). It also prints the same licence-free fact two ways: five early-CE
# objects say "c. 625" while sixteen of their neighbours say "c. 300 CE", and on the shelf those
# sit four cells apart.
#
# So the institution's string stays in the RECORD (`sourced.json.instdate`, and RENAME above keeps
# it verbatim) and the PAGE prints one of three forms:
#
#     1776            the record fixes the year
#     c. 1750         it does not
#     1590–1600       the institution gives a range — en dash, both ends, never truncated
#
# THE SUFFIX RULE: BCE is printed always. CE is printed only under the year 1000, which is the
# only place the number alone is ambiguous — nobody reads "1776" as BCE, and "c. 625" beside
# "c. 300 CE" is the inconsistency this fixes. Above 1000 the suffix is noise on every one of 190
# entries, and this piece pays for every word twice: once in the collision contract and once in
# the shatter.
#
# A RANGE IS ALREADY A HEDGE, so `c.` is stripped off one — "c. 1802–1640 BCE" prints the doubt
# twice and says less than "1802–1640 BCE" does.
#
# WHERE A HEDGING SENTENCE IS GENUINELY REQUIRED — the other half of item 3 — the answer is
# NOWHERE ON AN OBJECT, and it is structural rather than a preference: a sentence cannot shatter
# (06: the word is the unit), and identity doubt goes in the NAME by the map's rule, not in a
# clause. The one hedge that IS owed is not about any single date: 172 of 237 dates rest on the
# editorial list rather than on a holding institution, because Commons dates the PHOTOGRAPH and
# not the artifact (`dv:"authored"`). That is a provenance hedge over the whole set, and it
# belongs in the colophon as one sentence — which is where 07 put it.
NOTATION = {
    "songding":   "c. 1050 BCE",   # "late 11th–early 10th century BCE"
    "rhyton":     "c. 50 BCE",     # "c. 1st century BCE"
    "hanlacquer": "c. 1750",       # "Qing dynasty, Qianlong reign"
    "lacquerbox": "c. 1425",       # "first half of the 15th century"
    "bidri":      "c. 1630",       # "early–mid 17th century"
    "kesi":       "c. 1890",       # "late 19th–early 20th century"
    "incense":    "c. 1850",       # "19th century"
    "heitiki":    "c. 1850",       # "19th century"
    "gorget":     "1590–1600",     # "1590/1600"
    "boombox":    "c. 1995",       # "1990s"
}
DASH = "–"
SHAPE = re.compile(r"^(c\. )?\d{1,4}(" + DASH + r"\d{1,4})?( BCE| CE)?$")


def notation(key, disp, year):
    d = NOTATION.get(key, disp).replace("—", DASH).replace("--", DASH).replace("/", DASH)
    if DASH in d:
        d = re.sub(r"^c\.\s*", "", d)
    d = re.sub(r"\s*(BCE|BC|CE|AD)\s*$", "", d).strip()
    return d + (" BCE" if year < 0 else " CE" if year < 1000 else "")


# =============================================================================================
# TICKET 07 ITEM 7 — THE ATTRIBUTION TEMPLATE, one per licence class.
#
# The rendered string is the same three parts everywhere it appears — SOURCE · LICENCE · CREDIT —
# because 06 built it as words that come apart and a second shape would be a second grammar. What
# item 7 actually had to settle is what goes IN each part, and the audit found three things the
# set was getting wrong at volume:
#
#   1. FIFTEEN LICENCE STRINGS FOR SIX CLASSES, straight out of each API's own field, including
#      the same licence spelled two ways — "Public domain" 15 times and "public domain" 4 times.
#      Normalised here, in the generator, so the record keeps what the institution said.
#   2. THREE ENTRIES CARRIED A CC BY OR CC BY-SA LICENCE AND THE CREDIT "unknown". Checked
#      against the Commons API rather than assumed: all three return AttributionRequired = true
#      with an empty Artist field, so "unknown" is not a stylistic gap, it is the one term of the
#      licence the site was not meeting. Where the file names no artist the attributable party is
#      the uploader, and the string says which it is rather than pretending.
#   3. NOTHING LINKED ANYWHERE. 120 of 237 entries are CC BY or CC BY-SA, whose attribution is a
#      four-part thing — title, author, source, licence — and the last two want a URI. The piece
#      itself cannot carry one (a link riding a shattering word is unreachable), so it stays text
#      there and THE CREDITS ROLL carries the links: each entry's source to its own file page, and
#      the licence deeds once in the colophon. A visitor at the roll has already stopped, which is
#      the same argument 14 used for putting the outbound link there and nowhere earlier.
#
# THE TEMPLATES, then:
#   public domain / CC0  ->  Source · Licence · Credit          the credit is courtesy, not a term
#   CC BY, CC BY-SA      ->  Source(linked) · Licence(deed linked) · Author as the file names them
#   GFDL                 ->  cannot be met by a one-line credit; the licence text has to travel
#                            with the work. `lego` is the only one and it is re-sourced below.
LIC_FIX = {"public domain": "Public domain", "Public Domain": "Public domain",
           "CC BY-SA 2.0 fr": "CC BY-SA 2.0 FR", "CC BY-SA 3.0 at": "CC BY-SA 3.0 AT",
           "CC BY 3.0 de": "CC BY 3.0 DE", "CC BY-SA 3.0 de": "CC BY-SA 3.0 DE"}

# Commons returns an empty Artist for these and AttributionRequired = true, so the uploader is
# the attributable party and the string says so. `stickchart` is a rendering fault, not a missing
# credit: its Artist field carries a display:none span and stripping the tags doubled the words.
CREDIT = {
    "mehrgarh":   "uploaded by Nataraja",
    "snowgoggles": "uploaded by Fæ",
    "djembe":     "uploaded by Fæ",
    "stickchart": "Unknown author",
}


def licence(raw):
    """Normalised label, and the deed URI where the licence has one."""
    lab = LIC_FIX.get(raw, raw)
    m = re.match(r"^CC BY(-SA)? (\d\.\d)( [A-Z]{2})?$", lab)
    if m:
        return lab, (f"https://creativecommons.org/licenses/by{'-sa' if m.group(1) else ''}/"
                     f"{m.group(2)}/{(m.group(3) or '').strip().lower()}{'/' if m.group(3) else ''}")
    if lab == "CC0":
        return lab, "https://creativecommons.org/publicdomain/zero/1.0/"
    return lab, ""


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
                         reg="", inst="", dv="authored"))
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
                         dv=d.get("datesrc", "authored")))
    rows.sort(key=lambda r: r["y"])
    contemporaries(rows)

    # ---- 07 items 3 and 7, applied to every row in ONE place, after the record is assembled ----
    #
    # `dc` is derived here rather than kept: it was read off the raw string with an ASCII hyphen
    # (`"-" not in disp[1:]`) while every range in the set is written with an EN DASH, so ten
    # hedged dates were flagged unhedged — including "3300–2650 BCE", which is the widest hedge on
    # the page. Nothing reads `dc` yet; it is 05's field for a later ticket, and it was wrong.
    shapes, hedged = set(), 0
    for r in rows:
        r["disp"] = notation(r["k"], r["disp"], r["y"])
        if not SHAPE.match(r["disp"]):
            print(f"  NOTATION MISS  {r['k']:14s} {r['disp']!r}")
        r["dc"] = 1 if r["disp"].startswith("c.") or DASH in r["disp"] else 0
        hedged += r["dc"]
        shapes.add(re.sub(r"\d+", "N", r["disp"]))
        r["cred"] = CREDIT.get(r["k"], r["cred"])
        r["lic"], r["licurl"] = licence(r["lic"])
    print(f"notation: {len(shapes)} shapes, {hedged} of {len(rows)} hedged")
    print(f"licences: {len(set(r['lic'] for r in rows))} labels, "
          f"{sum(1 for r in rows if r['licurl'])} with a deed link")

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
   disp the date AS PRINTED, in 07's notation set: `1776` | `c. 1750` | `1590–1600`, plus BCE
       always and CE only under the year 1000. The institution's own wording is the RECORD and
       lives in sourced.json's `instdate`; four of them were prose, which the map forbids.
   b   region bucket (05 R4)   t  recognisability tier (05 R3)   f  fragment legibility (05 R2)
   reg the region as written for a reader   inst the holding institution's own title for it
   dc  1 = the date is hedged (c., or a range)   dv  where the date comes from:
       'institution' = checked against the museum API's own object date; 'authored' = the
       editorial list only, because Commons dates the PHOTOGRAPH, not the artifact.
   lic normalised licence label   licurl its deed, where it has one (07 item 7: 120 of these are
       CC BY or CC BY-SA, whose attribution wants a URI, and the roll is where it is printed).
   THERE IS NO DESCRIPTION FIELD, and that is 07's ruling rather than an omission: 05's R1 forced
   every entry to be named for the OBJECT, so the names already do a description line's job — a
   tier B or C name is a noun phrase that describes ("Marshall Islands stick chart"), and a tier A
   name is one a stranger already knows. R1 spent the description line before 07 could write it.
   adj the nearest contemporary from a different region, gap the years to it (01). */
window.ITEMS = [
""")
    for r in rows:
        out.write(f'  {{k:"{r["k"]}", y:{r["y"]}, disp:"{esc(r["disp"])}", n:"{esc(r["n"])}", '
                  f'src:"{esc(r["src"])}", lic:"{esc(r["lic"])}", cred:"{esc(r["cred"])}", '
                  f'url:"{esc(r["url"])}", b:"{r["b"]}", t:"{r["t"]}", f:{r["f"]}, '
                  f'reg:"{esc(r["reg"])}", inst:"{esc(r["inst"])}", dc:{r["dc"]}, '
                  f'dv:"{r["dv"]}", adj:"{r["adj"]}", gap:{r["gap"]}, '
                  f'licurl:"{esc(r["licurl"])}"}},\n')
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
