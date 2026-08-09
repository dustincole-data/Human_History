"""TICKET 05 — measure the set against the targets fixed before it existed. Reports, never fixes.

    python measure.py             # against the candidate list (planning)
    python measure.py  --live     # against sourced.json minus drops (the real set)
"""
import json, os, sys
from collections import Counter
import catalog
from source5 import date_gap
from build_data import DROP, RETIER

REGION = dict(AFR=8, NIL=7, WCA=11, SAS=8, EAS=15, SEA=4, OCE=3, AME=8, EUR=24, NAM=10, LAM=2)
ERA = [("E1", "before 3000 BCE", -10**9, -3001, 5), ("E2", "3000-500 BCE", -3000, -500, 9),
       ("E3", "500 BCE-500 CE", -499, 500, 9), ("E4", "500-1500", 501, 1500, 13),
       ("E5", "1500-1800", 1501, 1800, 16), ("E6", "1800-1900", 1801, 1900, 15),
       ("E7", "1900-1960", 1901, 1960, 15), ("E8", "1960-", 1961, 10**9, 18)]
WEST = ("EUR", "NAM")
EXTRA_DROP = {"aldrin": "R1 — an identifiable person is not the falling object"}

# planning years for the 72 sourced before this ticket; the live path reads them from sourced.json
def rows_planned():
    out = []
    for k, n, y, disp, b, reg, tier, spec in catalog.ITEMS:
        if k not in catalog.CUT:
            out.append(dict(k=k, y=y, b=b, tier=tier, frag=None))
    src = json.load(open("sourced.json", encoding="utf-8"))
    for k, (b, tier) in catalog.EXISTING.items():
        if k in src:
            out.append(dict(k=k, y=src[k]["year"], b=b, tier=tier, frag=src[k].get("frag")))
    return out


def rows_live():
    """The set as it actually ships: sourced.json minus every drop, PLUS the twelve legacy
    cut-outs, whose records live in build_data because they predate sourced.json."""
    from build_data import LEGACY, RENAME
    src = json.load(open("sourced.json", encoding="utf-8"))
    out = []
    for r in LEGACY:
        b, t = catalog.EXISTING.get(r["k"], ("?", "C"))
        out.append(dict(k=r["k"], y=r["y"], b=b, tier=t, frag=src.get(r["k"], {}).get("frag"),
                        gap=None, lic=r["lic"], cred=r["cred"], page=r["url"]))
    for k, d in src.items():
        if k in DROP or k in EXTRA_DROP:
            continue
        b = d.get("bucket") or catalog.EXISTING.get(k, ("?", "?"))[0]
        t = RETIER.get(k) or d.get("tier") or catalog.EXISTING.get(k, ("?", "?"))[1]
        y = RENAME[k][1] if k in RENAME else d["year"]
        # the gap stored in sourced.json was measured against the ORIGINAL year; anything redated
        # above must be re-checked against the date it actually ships with
        gap = date_gap(y, d.get("instdate"), d.get("src", ""))
        out.append(dict(k=k, y=y, b=b, tier=t, frag=d.get("frag"),
                        gap=gap, lic=d.get("lic"), cred=d.get("credit"),
                        page=d.get("page")))
    return out


rows = rows_live() if "--live" in sys.argv else rows_planned()
rows.sort(key=lambda r: r["y"])
N = len(rows)
print(f"\n=== {N} items {'(live, drops applied)' if '--live' in sys.argv else '(candidates)'} ===")

print("\nR4  REGION                    n     share   target   delta")
b = Counter(r["b"] for r in rows)
for k in REGION:
    s, t = b[k] / N * 100, REGION[k]
    print(f"    {k}  {b[k]:4d}  {s:6.1f}%  {t:5d}%   {s - t:+5.1f}"
          f"{'   MISS' if abs(s - t) > 3 else ''}")
w = sum(b[k] for k in WEST) / N * 100
print(f"    Western (EUR+NAM)  {w:.1f}%  cap 34%  {'OK' if w <= 34 else 'OVER'}")

print("\nR5  ERA                       n     share   target   non-West   floor")
for code, label, lo, hi, tgt in ERA:
    sub = [r for r in rows if lo <= r["y"] <= hi]
    if not sub:
        print(f"    {code} {label:16s}    0"); continue
    nw = sum(1 for r in sub if r["b"] not in WEST) / len(sub) * 100
    floor = 25 if code in ("E6", "E7") else 45
    print(f"    {code} {label:16s} {len(sub):4d}  {len(sub)/N*100:6.1f}%  {tgt:5d}%    "
          f"{nw:5.1f}%    {floor}%{'   MISS' if nw < floor else ''}")

print("\nR3  RECOGNISABILITY")
t = Counter(r["tier"] for r in rows)
print(f"    A {t['A']:4d}  {t['A']/N*100:5.1f}%  (target >=30%){'   MISS' if t['A']/N*100 < 30 else ''}")
print(f"    B {t['B']:4d}  {t['B']/N*100:5.1f}%")
print(f"    C {t['C']:4d}  {t['C']/N*100:5.1f}%  (target <=25%){'   MISS' if t['C']/N*100 > 25 else ''}")
bad = [i for i in range(N - 3) if not any(rows[j]["tier"] == "A" for j in range(i, i + 4))]
print(f"    windows of 4 with no tier A: {len(bad)} of {max(N - 3, 0)}   (gate: 0)")
for code, label, lo, hi, _ in ERA:                       # where the gate actually fails
    n = sum(1 for i in bad if lo <= rows[i]["y"] <= hi)
    tot = sum(1 for i in range(N - 3) if lo <= rows[i]["y"] <= hi)
    if tot:
        print(f"      {code} {label:16s} {n:4d} / {tot:4d}")
run = best = 0                                           # longest stretch with nothing recognisable
for r in rows:
    run = 0 if r["tier"] == "A" else run + 1
    best = max(best, run)
print(f"    longest run with no tier A: {best} items")
# the same gate with 'recognisable' read as A-or-B. If this one passes and the A-only one does
# not, the artifact record can meet 01's floor only at the weaker reading — which is a finding
# for 01, not a licence for 05 to quietly relax its own gate.
badB = [i for i in range(N - 3) if not any(rows[j]["tier"] in "AB" for j in range(i, i + 4))]
print(f"    same gate, 'recognisable' = A or B: {len(badB)} of {max(N - 3, 0)} violations")

scored = [r for r in rows if r.get("frag") is not None]
if scored:
    print("\nR2  FRAGMENT LEGIBILITY")
    m = sum(r["frag"] for r in scored) / len(scored)
    print(f"    mean frag {m:.3f} over {len(scored)} scored  (target >=0.45)"
          f"{'   MISS' if m < 0.45 else ''}")
    viol = [r["k"] for r in scored if r["frag"] < 0.25 and r["tier"] != "A"]
    print(f"    frag < 0.25 and not tier A: {len(viol)}   (gate: 0)")
    if viol:
        print("      " + ", ".join(viol))

if "--live" in sys.argv:
    print("\n01's PLANTED CALLOUTS — the strongest simultaneity pairs in the set")
    print("    (both tier A, different regions, closest in time — 01 asked for 10-15)")
    pairs = []
    for i, r in enumerate(rows):
        for o in rows[i + 1:i + 12]:
            if r["tier"] == o["tier"] == "A" and r["b"] != o["b"]:
                pairs.append((abs(o["y"] - r["y"]), r, o))
    seen, shown = set(), 0
    for g, r, o in sorted(pairs, key=lambda p: p[0]):
        if r["k"] in seen or o["k"] in seen or shown >= 15:
            continue
        seen |= {r["k"], o["k"]}; shown += 1
        print(f"    {g:4d}y   {r['k']:14s} ({r['b']}) : {o['k']:14s} ({o['b']})")

    print("\nCITATION")
    miss = [r["k"] for r in rows if not r.get("lic") or not r.get("cred") or not r.get("page")]
    print(f"    entries missing licence / credit / page: {len(miss)}   (gate: 0)")
    if miss:
        print("      " + ", ".join(miss))
    gaps = [(r["k"], r["gap"]) for r in rows if r.get("gap") and r["gap"] > 150]
    print(f"    institution date disagrees with year by >150y: {len(gaps)}")
    for k, g in sorted(gaps, key=lambda x: -x[1])[:20]:
        print(f"      {k:14s} {g}y")
    print("\nDECODED MEMORY (w*h*4 at 440px render size, the 80MB gate)")
    src = json.load(open("sourced.json", encoding="utf-8"))
    tot = 0
    for r in rows:
        if r["k"] not in src:
            continue
        wpx, hpx = src[r["k"]]["size"]
        s = 440 / max(wpx, hpx)
        tot += (wpx * s) * (hpx * s) * 4
    print(f"    {N} sprites resident = {tot/1e6:.1f} MB   "
          f"{'OVER — streaming required' if tot > 80e6 else 'within gate'}")
print()
