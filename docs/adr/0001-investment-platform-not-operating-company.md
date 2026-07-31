# ADR-0001 - Investment platform, not operating company

**Status:** Accepted, 30 Jul 2026
**Authority:** L1-01 §1, §2

## Context

The first draft of the enterprise model described housekeeping, concierge,
studio telemetry and F&B. Those are the concerns of a hospitality business.
Getaway Collective raises and governs capital.

## Decision

Getaway Collective is an **investment platform**. Sensory Getaways operates
the properties under a Management Agreement. A third entity, Brand &
Digital, generates demand.

The test for whether something belongs here: **would an Investment Committee
discuss it?**

## Rejected

Modelling both businesses in one system. It would have produced a schema in
which an inhabitable unit and a Commitment are peers, and a vocabulary in
which the same person is described by two nouns at different moments.

## Consequences

- Twelve hospitality business objects were removed and replaced by 27
  institutional ones.
- Five hospitality nouns became forbidden terms, enforced by the linter.
- Two invariants (A-02, A-06) had been written about inhabitable units and
  occupancy. A-02 was corrected to Property to Vehicle; A-06 was **retired
  outright**, with a deliberate gap left in the numbering so the retirement
  stays visible to anyone reading the register.
- The platform holds no residency records, so it cannot answer operational
  questions. That is the design, not a gap.
