# ADR-0010 - The Member Law fires on settlement

**Status:** Accepted, 31 Jul 2026. **Forced by defect.**
**Authority:** L1-01 §25a, invariant I-08

## Context

The state machine linter flagged that the member lifecycle promoted via
`AcceptCommitment`, while that capability declared no promotion event.

Checking the constitution settled it: *"Triggered only by first capital
commitment **settling**."* Not accepting.

The handler was promoting at acceptance.

## Decision

Promotion fires on **settlement**, in `settleCommitment`, under
`DeployCapital`.

## Consequences

- An accepted commitment that never funds does **not** produce a Member.
  Because promotion is irreversible, the old behaviour had no way back: it
  would have made a Member of someone who never paid, permanently.
- `AcceptCommitment` now declares all three of its outcomes. A lapse is a
  result of the command, not a failure of it, and it changes state.
- `ExpireAccreditation` was split out from `GrantAccreditation`, being a
  different act with a different consequence.
- **The defect was found by a linter comparing two declarations, neither of
  which was wrong on its own.** Only the pairing was.
