# AGENTS.md

Operating instructions for coding agents working in this repository.

**This file is not the constitution.** The constitution is in `constitution/`.
This file tells you how to work here; it never restates a rule. Where the two
appear to disagree, the constitution wins and this file is the bug.

---

## Before you change anything

```bash
npm run verify
```

Nine checks. They also run on every commit via `.githooks/pre-commit`
(`git config core.hooksPath .githooks` if hooks are not firing).

| Check | Enforces |
|---|---|
| `lint:vocab` | Forbidden terminology (L1-01 §25) |
| `lint:ufr` | No field without a registry id (E-06) |
| `lint:rel` | No orphan object, no undeclared edge (E-05) |
| `lint:cap` | Every capability publishes events (E-01) |
| `schemas:check` | Zod contracts match the registry |
| `db:check` | Database schema matches the registry |
| `fixtures:check` | Fixtures match the registry |
| `tokens` | Design tokens present in both JSON and CSS (§29) |
| `type-check` + `test:run` | 139 tests |

A failing check is a finding, not an obstacle. Do not add a pragma, loosen a
rule, or edit a generated file to make one pass.

---

## Where authority lives

| Layer | Location | Status |
|---|---|---|
| L1 Constitution | `constitution/L1-01-ENTERPRISE-CONSTITUTION.md` | Ratified |
| L1-02 Brand | `constitution/L1-02-BRAND-CONSTITUTION.md` | Ratified |
| L1-13 Policy Framework | `constitution/L1-13-ENTERPRISE-POLICY-FRAMEWORK.md` | Ratified |
| L1-14 Invariants | `constitution/L1-14-ENTERPRISE-INVARIANTS.md` | Ratified · **F-numbers void, see L1-01 §23** |
| L1-16 Financial | `constitution/L1-16-FINANCIAL-CONSTITUTION.md` | Ratified |
| L2 objects | `constants/business-objects.ts` | 27 objects |
| L2.5 field registry | `constants/ufr.ts` | 127 fields |
| L3 graph | `constants/relationships.ts` | 28 edges, 4 roots |
| L5 capabilities | `lib/commands.ts` | 32 capabilities |

Changing a constitutional document is an **amendment** (L1-01 §32a): 30 days
notice, a Constitutional Impact Assessment, and a ≥76% Special Resolution.
Five principles are entrenched and need unanimity (§32b). Do not edit these
files to make code convenient.

---

## Never hand-edit these

Everything in `generated/` and `dist/` is produced from the registry.

```
generated/schemas.ts     <- npm run schemas
generated/db-schema.ts   <- npm run db:schema
generated/fixtures.ts    <- npm run fixtures
dist/tokens.json|css     <- npm run tokens
```

Adding a field there without a UFR entry breaks **E-06** at the layer that
holds the data. The `:check` variants will catch it, but the fix is always
the same: add the field to `constants/ufr.ts` and regenerate.

**To add a field:** L2 object → UFR entry → regenerate. Declaration precedes
implementation, never the reverse.

---

## Rules that bite in practice

**Vocabulary.** 16 forbidden terms, parsed from `constants/vocabulary.ts` at
lint time. `Customer`, `Consumer`, `User`, `Guest`, `Journey`, `Experience`,
`Service`, `Stay`, `Steward` and others are rejected — including in comments
and test names. `stay` and `service` collide with ordinary English; reword
rather than exempting. For a genuine term of art use `ALLOWED_COMPOUNDS`
(cite the authority); for a one-off use `// vocab-lint-ignore` on the line.

**Money is never a `number`.** Decimal strings in, `bigint` minor units
internally, `numeric(20,4)` in the database. Rates are basis-point integers:
2.5% is `250`, not `0.025`. Use `lib/money.ts` — never `+` on a currency
value.

**Voting is equity-weighted, never per-capita.** Every figure in a tally is
a measure of equity. Do not implement one-partner-one-vote at any threshold.

**Rights attach to ownership, not accreditation.** An expired accreditation
blocks new commitments; it never silences an existing holder. The intuitive
implementation checks accreditation on every endpoint and silently
disenfranchises members. There is a test asserting it does not.

**Immutable fields are absent from Update contracts.** That is the
enforcement. `.strict()` makes their presence an error rather than a silent
strip.

**A capability that emits nothing throws.** If it changes state it says so;
if it changes nothing it is a query and does not belong in the registry.

---

## Layout

```
constitution/   ratified L1 documents — amendment only
constants/      the registries: objects, fields, edges, vocabulary, tokens, voting
lib/            domain logic and the L5 capability layer
generated/      DO NOT EDIT — produced from constants/
scripts/        linters and generators, zero dependencies, plain node
tests/          139 tests
dist/           DO NOT EDIT — token package
```

---

## Working notes

- **Blanks register:** `L1-BLANKS-REGISTER.xlsx` — 32 ratified, 0 open.
  Regenerate with `python rebuild-blanks-register.py`.
- **Architecture target:** `WAVE-2-ARCHITECTURE-TARGET.md`. GC.SYSTEM v3.0
  (Turborepo, Next 16, Drizzle) is where this is going. **Nothing
  restructures yet** — an empty monorepo would constrain L7/L8 decisions the
  semantic layer has not made.
- Scripts parse source rather than importing it, so they run without a
  TypeScript toolchain. Every one refuses to pass on an empty parse rather
  than reporting a vacuous success.

---

## If you find a constitutional gap

Record it. Do not fill it silently.

Add a row to the open sheet in `rebuild-blanks-register.py` with what is
missing, what it blocks, and a proposed default where one is defensible.
Some questions are commercial or fiduciary judgements that belong to the
Executive Office, not to whoever happens to be editing the file.

Where behaviour is ratified but surprising, pin it with a test and say why
in the comment — several tests here exist only to stop a correct behaviour
from being "fixed" later.
