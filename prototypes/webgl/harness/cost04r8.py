"""Cost the "the break reverses" reading, in decoded MB, over the real 230-item set.

Reproduces gravity.js's own scroll tables (CO/PER/START/LAND/LIFE) from data.js, reads the real
baked sprite dimensions off disk, and sweeps every scroll position to find the max
simultaneously-resident decoded bytes under each residency policy.

Decoded cost is w*h*4 from intrinsic dimensions (03's rule). Nothing here is estimated.
"""
import re, sys, struct, pathlib, json

ROOT = pathlib.Path(r"C:\Users\dusti\Projects\Human_History")
DATA = ROOT / "prototypes/directions/data.js"
IMG  = ROOT / "prototypes/webgl/img"
THUMB= ROOT / "prototypes/webgl/thumb"

# ---------------------------------------------------------------- the set, in order
txt = DATA.read_text(encoding="utf-8")
items = []
for m in re.finditer(r'\{k:"([^"]+)", y:(-?\d+)', txt):
    items.append((m.group(1), int(m.group(2))))
assert len(items) == 230, len(items)
assert items == sorted(items, key=lambda t: t[1]), "data.js must already be in date order"

# ---------------------------------------------------------------- real sprite dimensions
def webp_dims(p):
    b = p.read_bytes()
    assert b[0:4] == b"RIFF" and b[8:12] == b"WEBP", p
    ck = b[12:16]
    if ck == b"VP8X":
        w = int.from_bytes(b[24:27], "little") + 1
        h = int.from_bytes(b[27:30], "little") + 1
        return w, h
    if ck == b"VP8 ":
        w = struct.unpack("<H", b[26:28])[0] & 0x3FFF
        h = struct.unpack("<H", b[28:30])[0] & 0x3FFF
        return w, h
    if ck == b"VP8L":
        bits = int.from_bytes(b[21:25], "little")
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    raise SystemExit(f"unknown webp chunk {ck} in {p}")

SPR = {}
for k, _ in items:
    SPR[k] = webp_dims(IMG / f"{k}.webp")
THM = {k: webp_dims(THUMB / f"{k}.webp") for k, _ in items}

px   = [SPR[k][0] * SPR[k][1] for k, _ in items]      # decoded pixels per sprite
byt  = [p * 4 for p in px]
MB   = 1024 * 1024

# ---------------------------------------------------------------- gravity.js's tables, verbatim
W_YEARS, FALL = 80, 460
BEAT_MIN, BEAT_MAX, BEAT_AT = 60, 200, 5
LIFE_MIN, LIFE_MAX = 1400, 4200
AHEAD = 4000
N = len(items)
years = [y for _, y in items]

CO, PER = [0]*N, [0.0]*N
lo = 0
for i in range(N):
    while years[i] - years[lo] > W_YEARS: lo += 1
    CO[i] = i - lo
    PER[i] = FALL + BEAT_MIN + (BEAT_MAX - BEAT_MIN) * min(1, CO[i] / BEAT_AT)

START = [0.0]*N
for i in range(1, N): START[i] = START[i-1] + PER[i-1]
LAND = [START[i] + FALL for i in range(N)]

TOTAL_END = START[N-1] + PER[N-1]
LIFE = [0.0]*N
for i in range(N):
    end = TOTAL_END
    for j in range(i+1, N):
        if years[j] > years[i] + W_YEARS:
            end = LAND[j]; break
    LIFE[i] = max(LIFE_MIN, min(LIFE_MAX, end - LAND[i]))
TOTAL = TOTAL_END
LAST = N - 1

# ---------------------------------------------------------------- residency policies
# Each returns the half-open scroll interval [a, b) over which item i's PHOTOGRAPH must be resident.
def shipped(i):
    # want() from `rel > -AHEAD`; release() the instant it is down (rel >= FALL). 03 ruling 2.
    return (START[i] - AHEAD, LAND[i] if i != LAST else TOTAL + 4000)

def reverse_bounded(i, back):
    # the break reverses: the photograph is needed to re-cut at any point in the object's LIFE,
    # and for `back` px above its death so scrolling up into it can resurrect it.
    return (START[i] - AHEAD, LAND[i] + LIFE[i] + back)

def all_resident(i):
    return (-1e18, 1e18)

def peak(interval, label, step=5.0):
    y = -AHEAD
    best, best_y, best_n = 0, 0, 0
    iv = [interval(i) for i in range(N)]
    # sweep on a fine grid AND on every boundary, so nothing is missed between samples
    stops = set()
    y = -AHEAD
    while y <= TOTAL + 5000:
        stops.add(round(y, 3)); y += step
    for a, b in iv:
        for s in (a, a + 0.001, b - 0.001, b):
            if -AHEAD - 10 <= s <= TOTAL + 5000: stops.add(round(s, 3))
    for s in sorted(stops):
        tot, n = 0, 0
        for i in range(N):
            a, b = iv[i]
            if a < s < b: tot += byt[i]; n += 1
        if tot > best: best, best_y, best_n = tot, s, n
    return best, best_y, best_n

print(f"set: {N} items · scroll TOTAL {TOTAL:,.0f} px")
print(f"all 230 sprites decoded: {sum(byt)/MB:.1f} MB   (03 round 10 measured 65.8 MB)")
print(f"all 230 thumbs decoded : {sum(THM[k][0]*THM[k][1]*4 for k,_ in items)/MB:.1f} MB"
      f"   (03/10 measured 26.2 MB)")
print()

rows = []
b, at, n = peak(shipped, "shipped")
rows.append(("SHIPPED — released the instant it shatters", b, n, at))
for back in (0, 900, 4000):
    bb, aat, nn = peak(lambda i, k=back: reverse_bounded(i, k), f"rev{back}")
    rows.append((f"BREAK REVERSES — window +{back} px above death", bb, nn, aat))
b3, at3, n3 = peak(all_resident, "all")
rows.append(("BREAK REVERSES, unbounded (pure function of scroll)", b3, n3, at3))

print(f"{'policy':<52}{'peak MB':>10}{'sprites':>9}{'at y':>12}")
for lab, bb, nn, aat in rows:
    print(f"{lab:<52}{bb/MB:>10.1f}{nn:>9}{aat:>12,.0f}")
print()
print("at 400 items (01's upper bound), scaling the resident COUNT by the same tables:")
for lab, bb, nn, aat in rows:
    # count-bound policies do not scale with N; the unbounded one does
    scale = 400/230 if "unbounded" in lab else 1.0
    print(f"  {lab:<50}{bb*scale/MB:>8.1f} MB")
