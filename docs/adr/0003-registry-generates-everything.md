# ADR-0003 - The registry generates contracts, schema and fixtures

**Status:** Accepted, 30 Jul 2026
**Authority:** invariant E-06

## Context

E-06 says no field exists without a registry entry. Stating that is easy;
making it true is the problem. A hand-written validation schema can grow a
field the registry never declared, and nothing notices.

## Decision

`constants/ufr.ts` is the only place a field is born. Everything downstream
is **generated**:

```
ufr.ts + relationships.ts
   -> generated/schemas.ts     (Zod contracts)
   -> generated/db-schema.ts   (Drizzle tables)
   -> generated/fixtures.ts
   -> migrations/*.sql         (DDL)
```

Each generator has a `--check` mode that fails on stale or hand-edited
output, and all of them run in the pre-commit gate.

## Rejected

Writing schemas by hand and reviewing for drift. Review catches drift the
day it happens and never again.

## Consequences

- Adding a field means editing the registry and regenerating. There is no
  faster path, deliberately.
- `generated/` is off-limits. `AGENTS.md` says so in three places, because
  an agent editing it would silently break E-06 at the layer holding data.
- Immutability became **structural**: immutable fields are absent from the
  generated Update contracts, and those contracts are `.strict()` so their
  presence is an error rather than a silent strip.
- Two objects now generate an empty strict update contract and are
  append-only by construction.
