# ADR-0006 - Checkers parse the canon, never copy it

**Status:** Accepted, 30 Jul 2026. **Forced by defect.**
**Authority:** L1-01 §14 Naming Authority

## Context

The vocabulary linter was reported as locked and passing for several
sessions. It carried its own hardcoded list of **six** forbidden terms while
the vocabulary module forbade **fifteen**.

Worse, three of its replacement instructions pointed at terms that had
themselves become forbidden. It was actively instructing engineers to
introduce violations.

It was hiding a real one. The business object module was still the pre-pivot
twelve-object hospitality model, with four forbidden nouns as live enum
members, passing every build.

## Decision

A checker **parses the source of truth at runtime**. It never holds a copy.
If it cannot parse, it exits non-zero rather than falling back to anything.

Every checker also **refuses to pass on an empty parse**. One of them once
reported a clean pass having parsed zero entries, because its pattern was
anchored on a line ending and the file had been rewritten with different
ones.

## Rejected

Keeping the copy and adding a test that the two agree. That is a third thing
to maintain, and it fails the same way.

## Consequences

- Five linters now parse their registries and the constitution rather than
  restating them.
- Terms of art needed a mechanism. Compound phrases are declared centrally
  with cited authority, rather than scattering line-level pragmas through
  the codebase.
- **A linter with its own copy of the canon is a second canon.**
