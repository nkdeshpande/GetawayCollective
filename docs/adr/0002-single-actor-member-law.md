# ADR-0002 - One identity, two states

**Status:** Accepted, 30 Jul 2026
**Authority:** L1-01 §25a, invariant I-08

## Context

Four nouns were in circulation for the same human being. Each implied a
different record.

## Decision

**One identity. Two states.** `Investor` before commitment, `Member` after.
The transition is a state change on an existing record, never a second
record. Irreversible.

`Steward` survives as philosophy (*Stewardship*) and is forbidden as an
actor noun.

## Rejected

Separate Investor and Member records with a link between them. Reporting
would have had to decide which one counts, and every join would have carried
that decision silently.

## Consequences

- Membership records **history, not balance**. Holdings falling to zero does
  not revert the state, because the governance record of what someone voted
  on does not disappear when they exit.
- Voting, distribution and information rights attach to **ownership**, not
  to accreditation. There is a test asserting an expired holder still votes,
  because the intuitive implementation checks accreditation on every
  endpoint and silently disenfranchises them.
