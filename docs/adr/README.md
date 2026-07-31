# Architectural Decision Records

One file per structural decision made in Waves 1-3.

An ADR is not a status report. It records the moment a choice was made, what
was rejected, and what the choice costs - so that a future reader who
disagrees knows what they are overturning rather than assuming nobody
thought about it.

Several of these were forced by a defect the tooling found rather than by
design. Those are marked, because a decision made under correction is worth
distinguishing from one made at leisure.

| ADR | Decision | Status |
|---|---|---|
| [0001](0001-investment-platform-not-operating-company.md) | Investment platform, not operating company | Accepted |
| [0002](0002-single-actor-member-law.md) | One identity, two states | Accepted |
| [0003](0003-registry-generates-everything.md) | The registry generates contracts, schema, fixtures | Accepted |
| [0004](0004-money-is-never-a-float.md) | Money is a decimal string, never a number | Accepted |
| [0005](0005-governance-without-ownership.md) | GC holds no equity in the vehicles it governs | Accepted, reverses earlier text |
| [0006](0006-linters-parse-the-canon.md) | Checkers parse the canon, never copy it | Accepted, forced by defect |
| [0007](0007-projections-are-folds.md) | Read models are folds, never stores | Accepted |
| [0008](0008-secret-ballot-transparent-outcome.md) | The ballot is sealed, the outcome is published | Accepted |
| [0009](0009-operator-precedes-debt-service.md) | Stage 1 precedes debt service | Accepted |
| [0010](0010-promotion-on-settlement.md) | The Member Law fires on settlement | Accepted, forced by defect |
