# 09 — Spec assembly

Type: task
Status: open
Blocked by: 01, 02, 03, 04, 05, 06, 07, 08
Parent: [Human History — Wayfinder Map](../map.md)

## Question

Assemble every closed ticket into one self-contained build spec at `.claude/plans/human-history-spec.md`.

This is the **mid-point milestone, not the destination** — the destination is the shipped site (Dustin: *"take over the project and get it built out"*). Its job is to make the build phase decision-free.

Requirements:

- **Self-contained.** A fresh session reads only this file and builds the site. No "see ticket 04."
- **Reconcile contradictions.** Later tickets correct earlier ones; Deep Time's assembly caught several. Every conflict is resolved in the spec text, with the correction noted so nobody re-litigates it from a stale ticket.
- **Sections, minimum:** thesis and the fun mechanism · hard constraints · the mechanic and its scroll-to-time function · page anatomy · the layout and no-collision contract · the complete verified set as one table · the full copy deck · the visual treatment and image pipeline · accessibility contract · stack, memory ceiling and performance budget · project tree and build assertions · **what is still open and at which gate** · **what must not be relitigated.**
- **Every gate expressed as a runnable assertion**, not a review note.

On close, the map's fog graduates: the build phase becomes real tickets, sized against this spec.

**Deliverable:** `.claude/plans/human-history-spec.md`, complete, plus the build-phase tickets created and wired.
