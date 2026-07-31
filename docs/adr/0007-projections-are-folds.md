# ADR-0007 - Read models are folds, never stores

**Status:** Accepted, 31 Jul 2026
**Authority:** invariants E-01, E-02

## Context

Members need to see positions, reserve coverage, and why a distribution did
not land. Those views need to come from somewhere.

## Decision

Every projection is a **pure function of a readonly event array**. There is
no incremental mutation path anywhere in the projection module.

## Rejected

Incrementally maintained read models. Faster, and the standard approach at
scale. Rejected because a read model that cannot be rebuilt has quietly
become a second source of truth, and the first time it disagrees with the
log nobody can say which is right.

## Consequences

- Projections are linear in the number of events. Acceptable now, and
  revisiting it means adding snapshots rather than mutation.
- A determinism check asserts that folding twice gives the same answer.
  Trivially true for a pure function, which is exactly why it is pinned: the
  moment someone adds an incremental path for performance it breaks loudly,
  rather than a member's position drifting quietly.
- **This is the layer that proves E-01 was worth its cost.** Every figure a
  member sees is reconstructed from events alone. Had any capability changed
  state silently, the projection would be wrong and nothing would say so.
