# ADR-0012 - The ontology stays at 27 objects

**Status:** Accepted, 02 Aug 2026
**Authority:** L1-01 §33 · GC-IA-V5-OPERATING-CANON-TECHNOLOGY-CONSOLIDATED,
"L2 Lifecycle Alignment"
**Supersedes:** decision D-15 in `GC-DEFECT-DECISION-REGISTER.html`

## Context

The v5 Operating Canon's **Object Model** sheet declares `OBJ-001…OBJ-025`,
of which fourteen have no counterpart among the 27 ratified objects —
including Partnership Interest, which the audit register calls *"the
missing economic bridge"*, and five Project objects.

The defect decision register weighed three options and recommended **O2**:
implement the non-conflicting subset now — Partnership Interest,
Distribution Waterfall and the three Project objects — deferring only the
Time objects and the §33 candidate promotions, which reverse documented
constitutional decisions.

**That recommendation was wrong**, and the canon itself says so.

The later **L2 Lifecycle Alignment** sheet carries a section headed
*"NON-OBJECTS / GAPS THAT MUST NOT BE SILENTLY PROMOTED"*. It is a direct
reconciliation against `constants/business-objects.ts` and
`constants/relationships.ts`, and it rules on exactly the terms O2 would
have promoted.

## Decision

**The ontology stays at 27. Nothing on that list becomes an object.**

| Term | Ruling | Use instead |
|---|---|---|
| Partnership Interest | Semantic label only | `OwnershipPosition` — the ratified holding object |
| Member | A *state* of Investor | `Investor.member_state` (UFR-0161) |
| Time entitlement / allocation | Derived quantity | Derived from `OwnershipPosition`; candidates stay candidates |
| Document / file | Evidence and provenance | Attach to Agreement, Commitment, Investment, Resolution, Property |
| Task / notice / activity | Capability and event artifact | Publish an event against a named object |
| Generic exception docket | No catch-all object exists | `Risk` or `ComplianceEvent`, or record a constitutional gap |
| Project | An IA and workflow view | Property-side objects + Risk + evidence |
| Payment acceptance | A state transition with evidence | `Commitment → Investment` after verified bank confirmation |

Verified against code: `OwnershipPosition` is ratified; `Party` and
`PartnershipInterest` do not exist; `Investor` already carries
`UFR-0161 member_state` and the immutable `UFR-0165 became_member_on`.

## Why this is the better answer

O2 reasoned from the Object Model sheet in isolation and treated the
fourteen new names as work to be scheduled. The L2 sheet reasons from the
ratified registry outward and asks a different question: *does this term
name a thing the system must store, or a label, a state, a derived
quantity, or a view?*

Most of them are not objects. Promoting them would have produced two ways
to express one holding — `PartnershipInterest` beside `OwnershipPosition`
— which is the duplicate-ownership-truth failure the audit register lists
as the risk of getting FIX-02 wrong. The fix would have caused the defect.

It also removes the largest and riskiest item in the register. D-15 was
sized XL and gated on a constitutional amendment. It is now **no work at
all**, and the "stop expanding the ontology" instinct is vindicated by the
canon rather than merely asserted against it.

## Consequences

- `Investor` is the identity spine before and after settlement. The
  identity bridge (ADR-0011) will map to it, never to a Party object.
- The accreditation redesign changes *states on Investor*, not the object
  graph.
- D-17 (aperture projections) shrinks: 14 objects, not 25.
- A new object still requires the §33 constitutional route. This ADR
  narrows what may be proposed; it does not open a faster path.

## Rejected

**Implementing Partnership Interest as a bridge object.** Two spellings of
one holding, and `OwnershipPosition` already carries the voting and
Time-allocation basis the bridge was wanted for.

**Treating Project as an object family.** Five objects for something the
canon classifies as a view over Space evidence.

**Waiting for a ratification decision.** None is needed. Nothing here
amends the constitution — it declines to.
