# GETAWAY COLLECTIVE™
# L1-14 · ENTERPRISE INVARIANTS

**Layer:** L1 — Enterprise Constitution (Sub-document)  
**Authority:** Highest. Non-negotiable rules. A build violating an invariant does not ship.  
**Status:** DRAFT v1.0 — 7 ratified, 6 planned, 26 total  
**Owner:** Enterprise Architecture  
**Last Updated:** 30 Jul 2026  

---

> *An invariant is a law of physics for the system.*  
> *It cannot be "worked around." It cannot be negotiable in crisis.*  
> *If it's violated, the system is broken, not being pragmatic.*

---

# EXECUTIVE SUMMARY

| Category | Count | Ratified | Planned | Purpose |
|----------|-------|----------|---------|---------|
| **Enterprise** | 7 | 7 | 0 | Core system laws |
| **ASSET Domain** | 8 | 2 | 6 | Scarcity + physical reality |
| **IDENTITY Domain** | 8 | 2 | 6 | Agency + governance |
| **FINANCIAL Domain** | 9 | 0 | 9 | Value + capital |
| **TOTAL** | **32** | **11** | **21** | **Enforcement stack** |

---

# PART I — ENTERPRISE INVARIANTS (Layer Independent)

These seven invariants apply to the entire system, across all layers.

---

## E-01: Every Capability Publishes Events

**Formal Statement**  
If a capability (command) changes state, it must emit at least one domain event. Events are the nervous system of the enterprise. No silent state changes.

**Owning Layers**  
- L5 (Capabilities) — defines the capability
- L9 (Events & Automation) — publishes the event

**Why It Matters**  
Without events, there is no audit trail. No automation. No way to react to what happened. Silent state changes create ghosts.

**Test Name**  
`test_command_emits_event`

**Enforcement Mechanism**
- **Code linter:** detects `StateChange` without `.publish(Event)`
- **Build gate:** every command test asserts event emission
- **Event log audit:** missing event triggers escalation

**Example Violation**  
A command `TransferOwnership(from, to)` changes IDENTITY_ROOT owner but does not emit `OwnershipTransferred` event. The system cannot react. Automation downstream goes silent.

**Status**  
✓ RATIFIED — Implemented in L5 design

---

## E-02: Every Decision Has Provenance

**Formal Statement**  
Every significant decision is recorded with context: who, when, why, options considered, decision made. The audit trail is immutable.

**Owning Layers**  
- L8 (Intelligence & Knowledge) — captures context
- L10 (Data & Persistence) — stores immutably

**Why It Matters**  
Without provenance, decisions become mysterious. "Why did we choose this?" becomes unanswerable. Compliance and audit both depend on provenance.

**Test Name**  
`test_decision_recorded_with_context`

**Enforcement Mechanism**
- **API:** Decision endpoint requires context fields (actor, reason, options, decision)
- **Database:** DecisionRecord table is append-only, immutable
- **UI:** Every significant action prompts for reason (approval, rejection, override)

**Example Violation**  
Board approves a capital call but the decision record is empty: who voted? What were the options? Why this amount? Compliance audit fails.

**Status**  
✓ RATIFIED — Implemented in L8/L10 design

---

## E-03: Knowledge Is Immutable

**Formal Statement**  
Knowledge objects are immutable. Edits create new versioned entries. All prior versions remain accessible and auditable.

**Owning Layers**  
- L4 (State & Lifecycle) — defines the immutable state
- L8 (Intelligence) — manages versioning

**Why It Matters**  
Knowledge is the source of truth. If it can be edited silently, it cannot be trusted. Versioning allows us to see history and detect drift.

**Test Name**  
`test_knowledge_versioned_immutable`

**Enforcement Mechanism**
- **Database:** Knowledge table has no UPDATE or DELETE, only INSERT
- **API:** Knowledge.update creates new version with version number, original ID preserved
- **UI:** Knowledge display shows current version, links to history
- **Audit:** version diff available on demand

**Example Violation**  
An investment thesis is edited to remove a risk that materialized. The old version is lost. Governance cannot audit what was known when.

**Status**  
✓ RATIFIED — Implemented in L4/L8 design

---

## E-04: Ledger Is Append-Only

**Formal Statement**  
Financial Ledger entries are immutable. No deletion. No update. All corrections post an offsetting entry.

**Owning Layers**  
- L4 (State & Lifecycle) — enforces immutability
- L10 (Persistence) — stores immutably

**Why It Matters**  
The ledger is the source of truth for money. If it can be edited, compliance breaks. Corrections must be visible (offset), not hidden (update).

**Test Name**  
`test_ledger_append_only`

**Enforcement Mechanism**
- **Database:** Ledger table has no UPDATE or DELETE triggers
- **API:** LedgerEntry.update and .delete commands do not exist
- **Business logic:** Corrections emit new LedgerEntryPosted event with reversing entries
- **Audit:** sum(ledger) always equals known total; no deletions ever discovered

**Example Violation**  
A distribution is recorded, but the amount was wrong. The entry is edited. Now the historical record is wrong. Audit trails break.

**Status**  
✓ RATIFIED — Implemented in L4/L10 design

---

## E-05: No Orphan Object; No Undeclared Relationship

**Formal Statement**  
Every object (except roots) has a path to a root object. Dangling objects violate graph integrity. Only relationships defined in the BO model may exist.

**Owning Layers**  
- L2 (Business Objects) — defines allowed relationships
- L3 (Relationships & Graph) — enforces the graph

**Why It Matters**  
Without referential integrity, the graph collapses. Objects become orphaned. The system cannot reason about connectivity. Data becomes garbage.

**Test Name**  
`test_graph_connected` + `test_schema_matches_rels`

**Enforcement Mechanism**
- **Database:** Referential integrity via foreign keys
- **API linter:** cross-object references must be declared in L2 BO model
- **GraphQL schema:** restricted to defined relationships only
- **Data migrations:** orphan scan on every deploy, escalate on discovery
- **Audits:** quarterly orphan detection, cleanup

**Example Violation**  
A field references a Property that no longer exists. The orphaned reference breaks aggregations. Query that should work returns incomplete data.

**Status**  
✓ RATIFIED — Implemented in L2/L3 design

---

## E-06: No Field Exists Without a Registry ID

**Formal Statement**  
Every field must have a canonical entry in the Unified Field Registry (UFR). Fields are declared in L2 first, named in the registry, then implemented in schema. No implementation precedes the declaration.

**Owning Layers**  
- L2 (Business Objects) — declares in BO model
- L2.5 (Unified Field Registry) — names canonically
- L3+ (Implementation) — realizes only after registry entry exists

**Why It Matters**  
Without a registry, fields proliferate with multiple meanings. `asset_id`, `getaway_id`, `property_id` become four different fields meaning the same thing. The registry is the single source of truth.

**Test Name**  
`test_all_fields_registered`

**Enforcement Mechanism**
- **Build linter:** detects fields in schema without UFR entry
- **Code review:** new schema changes require UFR edit first
- **API:** response schema validators check every field has registry ID
- **Breakage detection:** field removed from schema triggers check for orphaned UFR entries

**Example Violation**  
Engineer adds `occupant_count` to the Journey table without creating a registry entry. Three months later, a different engineer adds `guest_count` for the same concept. Now the system has duplication.

**Status**  
✓ RATIFIED — Implemented in L2/L2.5/L3 design

---

## E-07: Authority Flows Downward Only

**Formal Statement**  
No layer may contradict a layer above it. Authority flows L1 → L2 → ... → L12. Layers add specificity; they never negate.

**Owning Layers**  
- L1–L12 (All layers) — architecture itself enforces
- L12 (Governance & Evolution) — audits compliance

**Why It Matters**  
Without downward authority, the constitution means nothing. A lower layer could claim exception and override the foundation. The entire system loses coherence.

**Test Name**  
`test_layer_hierarchy_respected`

**Enforcement Mechanism**
- **Architecture review:** every L3+ design challenged on L1/L2 conflicts
- **Code review:** changes violating L1 principles are rejected
- **Build gate:** linters check L1 invariants are enforced
- **Governance:** conflicting decisions escalate to Executive Architect

**Example Violation**  
L1 says "Knowledge is immutable." L6 (Data Authority) design includes "edit knowledge in place." The conflict goes unresolved and L6 implementation breaks L1.

**Status**  
✓ RATIFIED — Implemented in L1–L12 architecture

---

# PART II — ASSET DOMAIN INVARIANTS

These eight invariants govern the physical world: properties, units, assets, their state and lifecycle.

---

## A-01: Asset Identity Never Changes

**Formal Statement**  
Asset identity (ASSET_ID) is immutable. It survives ownership change, valuation change, state transition. The identity is the continuity thread.

**Owning Layer**  
L3 (Relationships & Graph)

**Why It Matters**  
Without stable identity, audit trails break. You cannot track a property through its lifecycle if its ID changes.

**Test Name**  
`test_asset_identity_immutable`

**Enforcement Mechanism**
- **Database:** ASSET_ID is immutable, never re-assigned
- **API:** no mutation endpoint exists that changes ASSET_ID
- **Audit:** ASSET_ID history is append-only

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L3

---

## A-02: Property Requires Investment Vehicle — CORRECTED 30 Jul 2026

> **CORRECTION NOTICE.** This invariant previously read *"Studio Requires Property"* and governed inhabitable units. That was a hospitality invariant carried across the Investment Platform pivot in error. The investment platform does not model inhabitable units at all — L1-01 §33 excludes Studio, Cabin, Room and Unit as Operating Company nouns. The institutional analogue is stated below.

**Formal Statement**  
A Property cannot exist without a governing Investment Vehicle. Every Property is held by exactly one Vehicle. Economic ownership exists only through a legal wrapper.

**Owning Layer**  
L3 (Relationships & Graph)

**Why It Matters**  
An unwrapped Property has no owner of record, no liability boundary, and no capital account to distribute against. The wrapper is what makes ownership legally real; without it, the entire capital chain is unanchored.

**Test Name**  
`test_property_requires_vehicle`

**Enforcement Mechanism**
- **API:** CreateProperty precondition checks the Investment Vehicle exists and is accessible
- **Database:** Foreign key constraint `vehicle_id` is NOT NULL
- **Orphan audit:** detect any Property with a missing or invalid `vehicle_id`

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L3

---

## A-03: Valuation Is Point-in-Time

**Formal Statement**  
Valuation is never current; it is always a snapshot dated to a moment. No "current valuation" — only valuations as-of specific dates.

**Owning Layers**  
- L4 (State & Lifecycle) — captures the timestamp
- L10 (Persistence) — stores dated valuations only

**Why It Matters**  
Valuation changes constantly. Without timestamps, you cannot answer "what was it worth when we decided to hold?" or "did appreciation match thesis?"

**Test Name**  
`test_valuation_dated_immutable`

**Enforcement Mechanism**
- **Database:** Valuation record includes valuation_date, always immutable
- **API:** no endpoint returns "current valuation"; always requires date parameter
- **UI:** valuation display shows date of assessment
- **NAV calculation:** aggregates valuations as-of specific dates only

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4

---

## A-04: Property Acquisition Records Cannot Be Edited

**Formal Statement**  
An Acquisition record captures the terms under which a Property entered the portfolio. Once created, it cannot be edited. If terms change, they are documented in amendment records.

**Owning Layers**  
- L4 (State & Lifecycle) — immutability rule
- L10 (Persistence) — append-only storage

**Why It Matters**  
Acquisition terms are the investment thesis. If they can be silently edited, the thesis becomes unreliable. Changes must be visible.

**Test Name**  
`test_acquisition_immutable`

**Enforcement Mechanism**
- **Database:** Acquisition table has no UPDATE on financial fields
- **API:** Acquisition fields are read-only after creation
- **Amendments:** changes recorded in separate AmendmentToAcquisition records
- **Audit:** any amendment triggers governance review

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4

---

## A-05: Asset Lifecycle Is Legal

**Formal Statement**  
Assets move through defined legal states (Prospecting, Pending, Acquired, Held, Disposition-Pending, Exited). Transitions are only those defined in the state machine.

**Owning Layer**  
L4 (State & Lifecycle)

**Why It Matters**  
The state machine prevents invalid transitions (e.g., jumping from Prospecting to Exited). It ensures every state has proper governance.

**Test Name**  
`test_asset_state_machine_enforced`

**Enforcement Mechanism**
- **Database:** state column constrained to legal enum
- **API:** transition validation rejects illegal moves
- **Tests:** every illegal transition explicitly tested and rejected

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4

---

## A-06: RETIRED — Occupancy Is Not an Investment Platform Concern

> **RETIRED 30 Jul 2026.** This invariant previously read *"Occupancy Cannot Exceed Capacity"* and was enforced before an operational residency could begin. It was carried across the Investment Platform pivot in error.
>
> Occupancy limits are a licensing and safety obligation of the **Operating Company (Sensory Getaways)**, enforced in its own systems against its own booking records. The investment platform holds no residency records to check occupancy against, and manufacturing them would import exactly the operational surface the pivot removed.
>
> **Constitutional Test:** would an Investment Committee discuss occupancy on a given night? No. It would discuss *utilisation* as a performance metric — which is `Performance Report` (L2, Performance domain), not an invariant.
>
> **Where the obligation now lives:** EP-18 Third-Party Management (operator SLA compliance) and EP-11 Risk Management (operator risk). Breach surfaces to the platform as a `Compliance Event`, not as a rejected transition.
>
> **No replacement invariant.** The A-numbering is left with a gap rather than renumbered, so that this retirement stays visible in the register.

**Status**  
⊗ RETIRED — no longer part of the investment platform invariant set

---

## A-07: Environmental Commitments Are Immutable

**Formal Statement**  
Environmental commitments made at acquisition (carbon targets, biodiversity pledges, renewable % targets) cannot be weakened. They can only be strengthened or remain constant.

**Owning Layers**  
- L1 (Constitution) — principle-level
- L4 (State & Lifecycle) — enforcement

**Why It Matters**  
Environmental commitments are brand promises. They cannot be silently reduced without losing member trust. Weakening is a governance event.

**Test Name**  
`test_environmental_commitments_immutable`

**Enforcement Mechanism**
- **Database:** EnvironmentalCommitment fields are immutable after creation
- **API:** amendments that weaken commitments are rejected unless approved by Governance Council
- **Audit:** tracking every commitment and amendment
- **Reporting:** annual compliance assessment published

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4

---

## A-08: Single Actor

**Formal Statement**  
One identity spans Investor and Member states. The transition is a state change on an existing record, never the creation of a second record. Triggered only by first capital commitment settling. Irreversible.

**Owning Layers**  
- L1 (Constitution) — principle-level
- L4 (State & Lifecycle) — enforced in state machine

**Why It Matters**  
Without this rule, a single person becomes two records. Reporting breaks. Governance becomes confused about who the actor is.

**Test Name**  
`test_single_actor_transition`

**Enforcement Mechanism**
- **Database:** IDENTITY_ROOT carries member_state; there is no second identity table
- **API:** no CreateMember command exists — only PromoteToMember state transition
- **Tests:** asserting identity id is unchanged across the transition
- **Tests:** asserting holdings falling to zero does not revert member_state

**Status**  
✓ RATIFIED — Implemented in L4 state machine

---

# PART III — IDENTITY DOMAIN INVARIANTS

These eight invariants govern agency: who can act, under what authority, with what accountability.

---

## I-01: Authentication Is Required

**Formal Statement**  
No action can be taken by an unauthenticated identity. Every command requires proof of identity.

**Owning Layer**  
L4 (State & Lifecycle)

**Why It Matters**  
Without authentication, you cannot hold anyone accountable. You cannot audit. You cannot enforce governance.

**Test Name**  
`test_authentication_required`

**Enforcement Mechanism**
- **API:** AuthMiddleware rejects unauthenticated requests
- **Tests:** every command test includes an authenticated identity
- **Audit:** unauthenticated requests logged as security event

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4

---

## I-02: Authority Is Explicit

**Formal Statement**  
No identity has implicit authority. Every action requires explicit delegation (role, right, approval). Absence of explicit authority means no authority.

**Owning Layer**  
L5 (Capabilities)

**Why It Matters**  
Implicit authority creates security holes. The system must be auditable: "who can do what, and why?"

**Test Name**  
`test_authority_explicit`

**Enforcement Mechanism**
- **API:** every command checks identity.hasAuthority(command)
- **Database:** AuthorityGrant records all delegations
- **Audit:** authority queries answer "who can X and by what grant?"
- **Review:** quarterly authority audit for stale/dangerous grants

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L5

---

## I-03: Accreditation Is Verified

**Formal Statement**  
Only identities meeting accreditation standards (suitability, wealth verification, regulatory status) may participate in capital formation.

**Owning Layer**  
L4 (State & Lifecycle)

**Why It Matters**  
Accreditation is a legal requirement for *entering* an investment. Verification is non-negotiable at the point of acceptance.

**Validity — RATIFIED 30 Jul 2026 (L1-01 §24b)**  
**Fifteen (15) working days**, not annual. Accreditation facilitates a *specific transaction*, not standing eligibility. Each new commitment requires a current accreditation.

**Lapse behaviour — COMPLETE-THEN-SUSPEND**
- Commitment **formally accepted** before expiry → completes. Expiry after lawful execution does not invalidate it.
- Commitment **not yet accepted** at expiry → lapses automatically.
- Post-completion the identity is `ACCREDITATION_EXPIRED`: no new commitments, subscriptions, transfers, or capital actions.
- **Existing ownership unaffected. Governance, voting, distribution, and information rights survive lapse** — they attach to ownership, not accreditation.

**Test Names**  
`test_accreditation_verified` · `test_accepted_commitment_survives_lapse` · `test_unaccepted_commitment_lapses` · `test_voting_rights_survive_accreditation_lapse` · `test_distributions_continue_after_lapse`

**Enforcement Mechanism**
- **API:** CreateInvestor requires accreditation proof
- **Precondition:** commitment *acceptance* gated on valid accreditation; *settlement* is not
- **Precondition:** all new capital actions blocked while `ACCREDITATION_EXPIRED`
- **Guard:** voting and distribution endpoints must NOT check accreditation. A test asserting this is mandatory — the intuitive implementation gets this wrong and silently disenfranchises members.
- **Audit:** accreditation status history immutable

**Status**  
⊘ PLANNED — Ruling ratified, implementation deferred to L4

---

## I-04: Sessions Are Audited

**Formal Statement**  
Every authenticated session is logged with identity, timestamp, duration, and actions taken. Session logs are immutable.

**Owning Layer**  
L10 (Persistence)

**Why It Matters**  
Session audit is the foundation of accountability. Without it, you cannot answer "what did this person do and when?"

**Test Name**  
`test_session_audited`

**Enforcement Mechanism**
- **Database:** SessionLog entries immutable after creation
- **API:** on session end, actions are summarized and recorded
- **Audit:** session logs available on demand
- **Compliance:** session audit used for regulatory reporting

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L10

---

## I-05: Governance Voting Is Secret

**Formal Statement**  
Individual member votes are secret. The vote record itself is encrypted. Only aggregated results are visible. A member voting for or against a proposal is not public.

**Owning Layers**  
- L4 (State & Lifecycle) — enforces encryption
- L8 (Intelligence) — publishes aggregates only
- L10 (Persistence) — stores encrypted

**Why It Matters**  
Secrecy protects members from social pressure and coercion. It ensures votes reflect genuine judgment, not herd instinct.

**Test Name**  
`test_voting_secret`

**Enforcement Mechanism**
- **Database:** vote records stored encrypted, unreadable except by vote counter
- **API:** no endpoint exposes individual votes; only aggregates
- **Compliance:** voting encryption key rotated per election

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4/L8

---

## I-06: Decisions Are Transparent

**Formal Statement**  
Decision outcomes and reasoning are fully transparent to members. A member can see why a decision was made, who voted, and what the options were.

**Owning Layers**  
- L5 (Capabilities) — decision commands record reason
- L10 (Persistence) — stores transparently

**Why It Matters**  
Members need to understand governance. Transparency builds trust. Opacity builds suspicion.

**Test Name**  
`test_decisions_transparent`

**Enforcement Mechanism**
- **API:** every decision is queryable with full context
- **UI:** decision history shows options, voting summary, outcome
- **Audit:** none of this can be edited after the fact

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L5

---

## I-07: Conflicts Are Disclosed

**Formal Statement**  
Any identity with a material conflict of interest in a decision must disclose it. Nondisclosure of known conflict is a governance violation.

**Owning Layer**  
L5 (Capabilities)

**Why It Matters**  
Without conflict disclosure, votes cannot be trusted. Members need to know if the decision-maker has a stake in the outcome.

**Test Name**  
`test_conflicts_disclosed`

**Enforcement Mechanism**
- **API:** decision command requires conflict disclosure if any exists
- **Audit:** conflict history available; nondisclosure is escalated
- **Compliance:** conflict disclosures used in audits

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L5

---

## I-08: Single Actor

**Formal Statement**  
One identity spans Investor and Member states. The transition is a state change on an existing record, never the creation of a second record. Triggered only by first capital commitment settling. Irreversible.

**Owning Layers**  
- L1 (Constitution) — principle-level
- L4 (State & Lifecycle) — enforced

**Why It Matters**  
See A-08 (same invariant applies to both domains).

**Test Name**  
`test_single_actor_transition`

**Enforcement Mechanism**
- **Database:** IDENTITY_ROOT carries member_state
- **API:** no CreateMember command; only PromoteToMember
- **Tests:** identity id unchanged; holdings-to-zero does not revert state

**Status**  
✓ RATIFIED — Implemented in L4 state machine

---

# PART IV — FINANCIAL DOMAIN INVARIANTS

> ## ⚠️ NUMBERING SUPERSEDED — READ BEFORE USING THIS PART
>
> **The FINANCIAL invariant numbering in this Part is obsolete as of 30 Jul 2026.**
>
> This document and L1-01 §23 independently assigned F-identifiers to different rules (BLANK-23). The two sets have been **merged into a single canonical table of eighteen invariants, which now lives in `L1-01-ENTERPRISE-CONSTITUTION.md` §23**.
>
> Every rule from both documents survived the merge. Only the numbers changed.
>
> **Use L1-01 §23 for all F-identifiers.** The entries below are retained for their prose — the *why*, the failure scenarios, the enforcement mechanisms — but their F-numbers must not be cited, implemented, or referenced in code.
>
> **Mapping from this document's old numbers to canonical:**
>
> | Old (here) | Canonical (L1-01 §23) |
> |---|---|
> | F-01 Capital Is Accounted | **F-03** |
> | F-02 Ledger Append-Only | **F-04** |
> | F-03 Distributions Follow Waterfall | **F-05** |
> | F-04 Reserve Floor Enforced | **F-06** |
> | F-05 Eligibility Gate | **F-10** |
> | F-06 Execution/Disclosure Align | **F-11** |
> | F-07 Transfer Is Additive | **F-12** |
> | F-08 Valuation Is Independent | **F-13** |
> | F-09 IRR/MOIC Consistent | **F-14** (Metric Determinism) |
>
> Newly added by L1-16 and now canonical: **F-15** Revenue Base Determinism · **F-16** Capital Call Purpose Gate · **F-17** Reserve Non-Pooling · **F-18** Brand Participation Is Not Equity.
>
> Carried in from L1-01's original set: **F-01** Legal Binding · **F-02** Ownership Conservation · **F-07** Distribution Immutability · **F-08** Economic Versioning · **F-09** Governance Determinism.

These entries govern capital, value, and money.

---

## F-01: Capital Is Accounted

**Formal Statement**  
Every dollar committed is accounted for. Capital exists in one of five states: Committed, Drawn, Invested, Returned, or Distributed. No capital is ever "unaccounted."

**Owning Layers**  
- L4 (State & Lifecycle) — state machine
- L10 (Persistence) — accounting records

**Why It Matters**  
Without tight accounting, capital leaks. The system must answer "where is every dollar?" at any moment.

**Test Name**  
`test_capital_accounted`

**Enforcement Mechanism**
- **Database:** CapitalStateTransition records every movement
- **API:** sum(capital by state) always equals total committed
- **Reconciliation:** daily accounting reconciliation, report discrepancies
- **Audit:** annual audit of capital movement

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4/L10

---

## F-02: Ledger Is Append-Only

**Formal Statement**  
(see E-04 above — same rule applied at the FINANCIAL layer)

Ledger entries cannot be edited or deleted. Corrections post offsetting entries.

**Owning Layer**  
L4 (State & Lifecycle) + L10 (Persistence)

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4/L10

---

## F-03: Distributions Follow Waterfall

**Formal Statement — RATIFIED 30 Jul 2026 (L1-16 Part I)**  
Distributions follow a fixed six-stage waterfall. No deviation without amendment.

| Stage | Recipient | Basis |
|-------|-----------|-------|
| 1 | Operating Company | Operating Agreement |
| 2 | Brand & Digital Company | Commercial Services Agreement |
| 3 | Enterprise Administration Reserve | 2.5% of Revenue Base |
| 4 | Property Sinking Fund | 2.5% of Revenue Base |
| 5 | Debt Service | Financing documents |
| 6 | LLP Partner Distributions | LLP Agreement |

**There is no preferred return, catch-up, or carried interest tier.** GC holds no equity in the LLPs it governs (L1-01 §27) and has no promote to earn. The earlier sequence *Revenue → Fees → Reserves → Preferred Return → Catch-Up → Profit Share* is superseded.

**Owning Layers**  
- L1 (Constitution) — waterfall is defined
- L5 (Capabilities) — DistributeCapital validates order
- L10 (Persistence) — records distribution per waterfall level

**Why It Matters**  
The waterfall is the contract. Without enforcement, disputes arise over who gets paid first.

**Test Name**  
`test_distribution_waterfall_enforced`

**Enforcement Mechanism**
- **API:** DistributeCapital command validates waterfall order
- **Precondition:** cannot execute Stage 6 (Partner Distributions) while Stage 5 (Debt Service) obligations are outstanding
- **Precondition:** Stages 3–4 (reserve transfers) must settle before Stage 6
- **Audit:** distribution history shows waterfall stage for each payment

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L5

---

## F-04: Reserve Floor Is Enforced

**Formal Statement — RATIFIED 30 Jul 2026 (L1-16 Part II)**  
The Reserve Floor is **the greater of** (a) six months of the LLP's **non-operational fixed obligations** — governance, statutory, insurance, financing, enterprise administration — or (b) the Board-approved minimum from the Annual Asset Management Plan. Distributions that would breach the floor are rejected.

**The floor is NOT NAV-linked.** NAV is a valuation metric; liquidity risk is a cash-flow problem. An appreciating asset can still run out of cash. The earlier "1.5% of NAV" limb is repealed.

**The Operating Company's day-to-day operating expenses are excluded** from this calculation — they are funded through the approved Operating Budget under the Operating Agreement.

**Scope:** per-LLP. Each LLP maintains its own reserve. Enterprise-level reserves supplement but never replace an LLP's obligation. **No pooling between LLPs** absent Board approval under an Enterprise Treasury Policy.

**Alert bands:** ≥120% healthy · 110–119% advisory · 100–109% governance alert · **<100% constitutional breach**.

**Two distinct tests (ratified 30 Jul 2026, L1-16 §2.6a):**
- **Prospective** — a distribution that would *itself* take the reserve below floor is **rejected automatically and is not voteable**. This is the enforceable half of the invariant.
- **Existing breach** — where the reserve is *already* below floor, scheduled distributions **continue** unless suspended by Ordinary Resolution (>50% of equity present).

**Automatic on breach:** broadcast to Board, Executive Office, and affected LLP Partners · discretionary expenditure deferred.

**A reserve breach shall never trigger a capital call** — investor capital is growth capital (F-16). The earlier 5/15/30-day Board escalation machinery is repealed.

**Test Names**
`test_distribution_breaching_floor_rejected` · `test_existing_breach_does_not_auto_suspend` · `test_suspension_requires_ordinary_resolution`

**Owning Layer**  
L5 (Capabilities)

**Why It Matters**  
Reserves protect the portfolio from shocks. Without enforcement, they can be depleted during good times, leaving the platform vulnerable.

**Test Name**  
`test_reserve_floor_enforced`

**Enforcement Mechanism**
- **API:** DistributeCapital precondition checks post-distribution reserves > floor
- **Precondition:** rejected if distribution would breach floor
- **Alert:** warning at 110% of floor, escalation at 100%
- **Governance:** breaching floor triggers capital call or expense review

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L5

---

## F-05: Eligibility Gate

**Formal Statement**  
Only accredited identities may participate in capital formation. Non-accredited identities cannot commit, receive distributions, or vote on capital-related decisions.

**Owning Layers**  
- L4 (State & Lifecycle) — identity state
- L5 (Capabilities) — commands check eligibility

**Why It Matters**  
Accreditation is a regulatory requirement. Non-compliance is a legal violation.

**Test Name**  
`test_eligibility_gate`

**Enforcement Mechanism**
- **API:** Commitment command checks identity.accredited == true
- **Precondition:** non-accredited identity cannot commit
- **Audit:** all commitments verified as accredited at time of commitment

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4/L5

---

## F-06: Execution Rules and Disclosure Align

**Formal Statement**  
Execution rules (how capital is deployed, what can be sold, when exits happen) match disclosure (what was told to investors). Discrepancies are governance violations.

**Owning Layer**  
L12 (Governance & Evolution)

**Why It Matters**  
If execution diverges from disclosure, it's fraud. The system must prevent divergence.

**Test Name**  
`test_execution_disclosure_align`

**Enforcement Mechanism**
- **Governance:** any change to execution rules triggers disclosure review
- **Audit:** quarterly check that execution matches disclosure
- **Compliance:** disclosure and execution rules stored together, versioned

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L12

---

## F-07: Transfer Is Additive

**Formal Statement**  
Transfers of ownership create new records. Historical ownership is immutable. A transfer record shows: from, to, amount, date, reason.

**Owning Layers**  
- L4 (State & Lifecycle) — ownership state
- L10 (Persistence) — transfer records immutable

**Why It Matters**  
Without this rule, ownership history can be silently rewritten. The audit trail breaks.

**Test Name**  
`test_transfer_additive`

**Enforcement Mechanism**
- **Database:** OwnershipTransfer records created; ownership_history is append-only
- **API:** no "change owner" command; only TransferOwnership which creates new record
- **Audit:** ownership history shows every transfer

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4/L10

---

## F-08: Valuation Is Independent

**Formal Statement**  
Property valuations are performed by independent third parties. Management valuations are allowed as internal estimates but must be labeled as non-independent. Regulatory filings use independent valuations only.

**Owning Layers**  
- L4 (State & Lifecycle) — valuation records note source
- L10 (Persistence) — stores source attribution

**Why It Matters**  
Valuation conflicts of interest undermine credibility. Investors must know whether the valuation is independent or self-interested.

**Test Name**  
`test_valuation_independent`

**Enforcement Mechanism**
- **Database:** Valuation records include `source` (independent or management)
- **API:** regulatory reports filter to independent valuations only
- **Audit:** all valuations available, source visible

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L4/L10

---

## F-09: IRR and MOIC Are Computed Consistently

**Formal Statement**  
IRR and MOIC calculations follow a standard formula (not configurable per property, not per-manager). The formula is documented in the constitution and never changes without amendment.

**Owning Layer**  
L10 (Persistence) + L9 (Analytics)

**Why It Matters**  
If IRR/MOIC calculations are inconsistent, investors cannot compare properties. The metrics become meaningless.

**Test Name**  
`test_irr_moic_computed_consistently`

**Enforcement Mechanism**
- **Code:** IRR/MOIC calculations are in one place, not replicated
- **Tests:** calculation is formula-driven, not data-driven
- **Audit:** formulas and inputs auditable for every IRR/MOIC report

**Status**  
⊘ PLANNED — Design complete, implementation deferred to L10

---

# RATIFICATION RECORD

| Invariant | Status | Ratified | Notes |
|-----------|--------|----------|-------|
| E-01 | ✓ | 30 Jul 2026 | Every capability publishes events |
| E-02 | ✓ | 30 Jul 2026 | Every decision has provenance |
| E-03 | ✓ | 30 Jul 2026 | Knowledge is immutable |
| E-04 | ✓ | 30 Jul 2026 | Ledger is append-only |
| E-05 | ✓ | 30 Jul 2026 | No orphan object; no undeclared relationship |
| E-06 | ✓ | 30 Jul 2026 | No field without registry ID |
| E-07 | ✓ | 30 Jul 2026 | Authority flows downward only |
| A-01 | ⊘ | — | Asset identity never changes |
| A-02 | ⊘ | — | Studio requires property |
| A-03 | ⊘ | — | Valuation is point-in-time |
| A-04 | ⊘ | — | Acquisition records immutable |
| A-05 | ⊘ | — | Asset lifecycle is legal |
| A-06 | ⊘ | — | Occupancy cannot exceed capacity |
| A-07 | ⊘ | — | Environmental commitments immutable |
| A-08 | ✓ | 30 Jul 2026 | Single actor (ASSET perspective) |
| I-01 | ⊘ | — | Authentication required |
| I-02 | ⊘ | — | Authority is explicit |
| I-03 | ⊘ | — | Accreditation verified |
| I-04 | ⊘ | — | Sessions are audited |
| I-05 | ⊘ | — | Governance voting secret |
| I-06 | ⊘ | — | Decisions are transparent |
| I-07 | ⊘ | — | Conflicts are disclosed |
| I-08 | ✓ | 30 Jul 2026 | Single actor (IDENTITY perspective) |
| F-01 | ⊘ | — | Capital is accounted |
| F-02 | ⊘ | — | Ledger append-only (FINANCIAL) |
| F-03 | ⊘ | — | Distributions follow waterfall |
| F-04 | ⊘ | — | Reserve floor enforced |
| F-05 | ⊘ | — | Eligibility gate |
| F-06 | ⊘ | — | Execution/disclosure align |
| F-07 | ⊘ | — | Transfer is additive |
| F-08 | ⊘ | — | Valuation is independent |
| F-09 | ⊘ | — | IRR and MOIC computed consistently |

**Summary:** 11 ratified (7 enterprise + A-08 + I-08), 21 planned (8 ASSET + 7 IDENTITY + 9 FINANCIAL)

---

# STATUS & NEXT STEPS

## Wave 1 Status

**Ratified (7 of 11):**
- All 7 enterprise invariants (E-01 through E-07)
- Single Actor across both ASSET and IDENTITY (A-08, I-08)

**Planned for Wave 2–3:**
- ASSET domain (A-01 through A-07): test implementation, L3 integration
- IDENTITY domain (I-01 through I-07): test implementation, L4/L5 integration
- FINANCIAL domain (F-01 through F-09): test implementation, L4/L5/L10 integration

## Enforcement Mechanism

Each invariant specifies:
- **Test name** — the first test to write
- **Enforcement points** — where in the system the rule is enforced
- **Owning layers** — which layers are responsible

---

**Document:** L1-14-ENTERPRISE-INVARIANTS.md  
**Version:** v1.0 (Wave 1)  
**Status:** 7 RATIFIED · 21 PLANNED  
**Owner:** Enterprise Architecture  
**Authority:** L1 Constitution (PART V)
