# ADR-0004 - Money is a decimal string, never a number

**Status:** Accepted, 30 Jul 2026
**Authority:** invariants F-02, F-03, F-15

## Context

This platform runs a six-stage waterfall, two 2.5% reserve transfers and a
floor comparison over the same figure, then splits the result across a
capital table. IEEE-754 cannot represent 0.1.

## Decision

Money is a **decimal string** at the boundary, a `bigint` of minor units
scaled by ten thousand internally, and `numeric(20,4)` in the database. One
representation across three layers.

Rates are **basis-point integers**: 2.5% is `250`, never `0.025`.

Proportional splits use the **largest-remainder method**, so the parts sum
to the input exactly.

## Rejected

- `number` with rounding at the edges. Error accumulates before it reaches
  an edge.
- A decimal library. The arithmetic needed is addition, subtraction and
  proportional split. `bigint` does all three exactly, with no dependency.
- Naive pro-rata. One hundred rupees across three holders pays out 99.9999
  and orphans the last unit, which is how F-02 and F-03 begin failing by
  pennies and then by more.

## Consequences

- `money()` throws on a JS number. Deliberately loud.
- The contract layer rejects float money, and the generated schema has
  **zero** float columns.
- Callers cannot use `+` on a currency value. It is `lib/money.ts` or
  nothing.
