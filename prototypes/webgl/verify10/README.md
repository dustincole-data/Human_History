# Round 10 — the texture window (ticket 03)

`sprite-master-vs-bake.png` — six airborne photographs, **master left, 264px bake right**, at 1:1
device pixels at dpr 2, which is the size and density the page actually draws them at. The header
on each pair carries the mean per-pixel delta.

The point of the sheet is the *viewing condition*. A 3x zoom of the same pairs reads as a real
softening on silk and engraving; at 1:1 the two are indistinguishable, including the worst case in
the set (150-kesi, a Qing silk robe, mean delta 12.3/255). The set went 301.2 MB decoded to 65.8 MB
on the strength of that.

Masters live in `../../directions/img/` and are untouched. Re-bake with:

    cd prototypes/directions && python bake_sprites.py
