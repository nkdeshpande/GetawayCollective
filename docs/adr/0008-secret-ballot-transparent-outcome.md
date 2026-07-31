# ADR-0008 - The ballot is sealed, the outcome is published

**Status:** Accepted, 30 Jul 2026
**Authority:** invariants I-05, I-06

## Context

I-05 says individual votes are secret. I-06 says decisions are transparent.
Read carelessly they conflict.

## Decision

They describe **different objects**. The **ballot** is sealed; the
**outcome** is published.

A member may see that a resolution passed with 82% of equity, who tabled it,
what the options were, and the recorded reasoning. They may not see how any
named holder voted.

## Rejected

- Publishing votes for accountability. It would expose holders to social
  pressure from the parties whose proposals they voted against, which is
  precisely what secrecy exists to prevent.
- Sealing outcomes for privacy. Members cannot consent to governance they
  cannot see.

## Consequences

- The ballot box exposes **no method returning an individual vote**. It can
  say who participated, never how. A test asserts no such method exists.
- Conflicts must be disclosed **before** deliberation. Disclosing once the
  result is known is commentary, not disclosure.
- Casting a vote is the only conflict-sensitive capability that does not
  require a recorded reason, deliberately: a mandatory per-voter rationale
  is a record of how each holder voted by another name.
