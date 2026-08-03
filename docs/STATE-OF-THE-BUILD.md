# State of the build — assessment and critical path

**As at 02 Aug 2026 · HEAD `2777bdf` · verified against the repository, not the reports.**

Assessments go stale faster than anything else in a build. The previous
version of this document was accurate when written and wrong in five
places a day later. Every claim below names what it was checked against so
the next reader can re-run it rather than trust it.

---

## The headline is unchanged, and it is good

You are **much closer than the raw module count suggests**. The
constitutional spine is strong: Waves 1–7 are locked, the IA is generated
from a canonical route table rather than hand-built, and the gates are
real — they fail the build, not a report.

**Verified now:** 20 constitutional gates in a 24-step `verify` chain,
**780 tests across 28 files**, clean production build, CI green on PR #1.

The amber is concentrated on one transition, and the previous framing of it
is the right one:

> **GC has designed the law extremely well. It now needs to prove that
> real-world LLP events can become authoritative digital records.**

---

## Corrections to the previous assessment

Five claims have been overtaken. They matter because three of them were
listed as launch risks.

| Previous claim | Now |
|---|---|
| "19/19 gates, 735 tests" | **20 gates, 780 tests.** taxonomy-lint added; taxonomies and ai-contracts under test. |
| "the current work was not committed" | **Committed and pushed.** Three commits, CI green, pre-commit hook armed. |
| "in-memory rate limiting won't survive serverless" | **Closed.** Upstash fixed-window over REST, degrading to the in-memory counter rather than failing open or closed. Nine tests including the degradation path. |
| "production dependency advisories remain — dependency remediation" | **Assessed and documented, deliberately not "remediated".** See below. |
| "ATLAS/IRIS have no engine" | Still true, and correctly so. But **the contracts now exist as data** — 11 contracts with governed output objects, 21 tests. |

### The advisory item deserves more than a line

"Dependency remediation" reads like a chore. It is not one.

`npm audit fix --force` proposes installing **`next@9.3.3`** — six major
versions back, predating the App Router, which would delete every route in
the build. And the advisory range for Next is
`9.3.4-canary.0 – 16.3.0-preview.7`, which **includes the current latest
release**. There is no patched version to upgrade to.

The five findings are accepted with a per-advisory rationale in
`SECURITY.md`: `vitest` and `vite` are dev-only and their UI server is
never started in CI; `postcss` runs at build time over CSS this repository
authors, so no attacker supplies input to it; `sharp`'s libvips CVEs need
`next/image` processing untrusted *remote* images, and no remote loader is
configured.

Anyone who treats this as a backlog task and runs the automated fix will
destroy the build. That is why it is written down.

---

## The amber the previous assessment missed

**The three apertures navigate three different generations of the IA.**

Of **77 distinct internal links** in the assemblies and content, only **20
resolve directly**:

| | Count |
|---|---|
| Live | 20 |
| Resolve only via a 301 built for *inbound* traffic | 44 |
| **Dead — middleware rewrites to 404** | **13** |

The Office composition links to `/admin/vehicles` and `/capital/offerings`.
The Member composition links to `/member/settings/*`. The actual Office
lives at `/office/collection/[vehicle]/*`. Worst concentrations:
`content/compositions/office.ts` (22), `content/public.ts` (13),
`content/notifications.ts` (10), `app/_assemblies/publicpages.tsx` (10).

This belongs near the top of the list for one reason: **it sits directly on
the critical path of the milestone this document recommends.** You cannot
demonstrate one vehicle end to end if the links between the steps do not
resolve.

It is also cheap, and it needs a **linter rather than a sweep**. Fixing 57
links today guarantees nothing; the next IA change reintroduces them
exactly as this one did. `route-lint` guards the route table. Nothing
guards the links *into* it.

Related and same root cause: **`/signal` is dead.** The Migration sheet
says Keep; it was dropped from the route table, so the generator removed
the page as an orphan. `app/api/signal/route.ts` still works and is now
orphaned, and `SignalForm()` is unreachable code. Three files link to it.

---

## Bank what is actually green

The previous assessment rated the Financial Digital Twin amber. That is
right, but the reason should be narrower than "objects exist, reconciliation
does not" — because one hard part is already solved.

**Truth does not change with vantage, and it is enforced rather than
intended.** All three aperture compositions — 1,612 lines across public,
member and office — import from one canon (`data.ts`, `slowspace.ts`).
Checked: **zero hardcoded currency literals, zero hardcoded percentages**
in any of them. `slowspace.ts` throws at load if the public record drifts
from the canon.

So a figure *cannot* differ between Public, Member and Office. UX-02 is
real, not aspirational.

What is missing is narrower and more precise than "amber": **no external
fact can enter the system.** The projection layer is sound; the ingestion
layer does not exist. That is a smaller problem with a clearer shape.

---

## The critical path

The previous list had four items at A1, which is not a priority order. This
is the dependency graph instead. Each item states how you will know it is
done, because "what closes it" and "how you prove it closed" are different
questions.

### A0 · Persistence — the trunk blocker

Everything below waits on it. Migrations exist and have never been applied.

**Proof it is done:** migrations applied to a provisioned instance; a
restore from backup tested and timed; one integration test that writes,
reads back and survives a redeploy.

### A1 · Canon reconciliation — smaller than it looked

**Superseded 02 Aug by ADR-0012.** The "L2 Lifecycle Alignment" sheet rules
that Partnership Interest, Member, Project, Document, Time allocation and a
generic exception docket are **not objects** — they are labels, states,
derived quantities, evidence and views over the 27 already ratified.

The ontology therefore stays at 27 and the largest item in the decision
register evaporates. Reconciliation is now what it should always have been:
**states on `Investor`, not new objects.**

The previous assessment is right that the build language and the operating
model have diverged, and right to say **do not finish Waves 8–10 against
the old specification**.

It is wrong to reconcile the whole canon first. That contradicts its own
best line — *stop expanding the ontology and make one vehicle executable*.
Reconcile only what the one-vehicle chain touches: the investor lifecycle,
the states that confer route access, and the commands on that path. Leave
the object model, the 56 aperture projections and the evidence taxonomy
until a vehicle has walked the chain.

**Proof it is done:** the state names in `lib/state-machines.ts`,
`constants/ufr.ts`, `constants/enums.ts` and the `Access` union agree with
the operating model, and no fifth spelling exists anywhere.

### A1 · Accreditation — the sharpest amber, and sharper still

The previous assessment identifies this correctly and understates the blast
radius. `accredited` is load-bearing in **five** places:

| Where | What it does |
|---|---|
| `routes.ts:57` | A member of the `Access` union |
| `routes.ts` ×7 | Seven `accessOverride` entries on the diligence path |
| `state-machines.ts:174` | `["none", "in_review", "accredited", "expired"]`, `terminal: []` |
| `digital-profiles.ts:73` | `accredited_investor.baseAccess` |
| `ufr.ts:249` + `enums.ts` | `Investor.accreditation_state` and its display metadata |

**The design question the proposed list hides.** `IDENTIFIED → RESERVED →
KYC_PENDING → KYC_CLEAR → CLOSING → PARTNER_ADMITTED → MEMBER` is a
*process* lifecycle. But `accredited` is not a process state — it is an
**access class that confers reachability on seven routes**. Those are two
different axes, and the current model conflates them by accident.

Replacing one with the other therefore requires an explicit decision:
**which of the new states grants reachability to the diligence path?**
Almost certainly `KYC_CLEAR`, possibly `RESERVED` for a subset. Until that
is answered the state machine can be rewritten and the guard will still be
wrong.

Also confirmed: the current machine has **no `DECLINED` state**, so a
refused applicant has nowhere to be and the decision cannot be recorded.
That is a defect reachable today, independent of any redesign.

### A1 · Execution gates, not an approval engine

This is the best refinement in the previous assessment and it should be
stated even more strongly, because the codebase already contains the
primitives.

A generic approval engine would sit *beside* the constitution. Execution
gates sit *inside* it. Concretely, this is not a new subsystem — it is five
fields on `CapabilityDefinition` in `lib/commands.ts`:

- **operation class** — already landed, `OperationClass` in `constants/taxonomies.ts`
- **allowed object states** — the machines exist; `execute()` does not consult them
- **resulting state**
- **SoD group** — the join key the ten controls need
- **AI-allowed** — per command, replacing a category list

`authorise()` already takes grants explicitly and `SEPARATION_TRIADS`
already exists. What is missing is that `execute()` never consults either
the state machine or the triads. **All ten SoD controls are blocked on
this one change**, because their commands do not yet exist as rights.

**Proof it is done:** `PartnerAdmission` refuses to execute without
`KYC_CLEAR`, reconciled funds, executed documents, admission evidence and
an authorised actor — and refuses when the same identity prepared and
approved it.

### A1 · Capital reconciliation

Correctly identified: because money moves outside GC, **reconciliation is
the critical capability, not payments**. The chain bank fact → contribution
→ capital account → ownership → distribution must close without manual
reinterpretation.

Worth adding: `vercel.json` and the LG-04 gate already specify the right
model — payment accepted only after external bank confirmation and records
match. Do not let a payment gateway be introduced as a shortcut around it.

### A1 · Legal evidence → digital state

Correct and important. `PARTNER_ADMITTED` must originate from an authorised
act, not from a form submission.

`lib/provenance.ts` is most of the primitive already — mandatory source,
observer, observed-at, throwing validators, `fitForFiling()`. What it lacks
is the **evidence artifact**: effective date, authority, hash, version,
supersession. Build the Evidence object *on* provenance rather than beside
it.

### A2 · Risk docket · Notifications · Observability

Unchanged from the previous assessment and correctly placed. Notifications
is the closest to done: 23 notices are written and tested; only delivery,
retry and acknowledgement are missing, and Resend is already installed.

### A3 · ATLAS / IRIS · Knowledge / Search · Sovereign governance

Correctly deferred. The line *"ATLAS and IRIS should consume institutional
truth, not compensate for its absence"* is the right principle and should
be quoted at whoever next proposes wiring a model early.

---

## A safety procedure for the reconciliation

This is new, and it is written from an incident in this build rather than
from theory.

**A vocabulary migration can silently invert a gate that depends on the
old ordering.**

The confidence classes were migrated from a derivation axis
(`observed > verified > modelled > estimated`) to the v5 corroboration axis
(`VERIFIED > CORROBORATED > REPORTED > INFERRED`). Six values to six
values, a clean one-to-one mapping.

But `modelled` ranked **stronger** than `estimated`, while `INFERRED` ranks
**weaker** than `REPORTED`. The rule "a derived value inherits its weakest
input" was unchanged and correct in both vocabularies — and produced
opposite regulatory outcomes. A NAV built from a management estimate used
to inherit `estimated`, which `fitForFiling()` **refuses**. After the
migration it inherited `INFERRED`, which `fitForFiling()` **admits** with
disclosure.

**A refused figure would have become an admitted one, and no test would
have caught it** — the failing test asserted the old vocabulary, and the
obvious move was to update the expectation to match the new behaviour.

The rule that came out of it, which applies directly to the accreditation
and lifecycle reconciliation ahead:

> For every renamed or reordered value, find every comparison that reads
> its **rank** rather than its **name**, and re-derive the intent rather
> than the mechanics. Then state the intent in terms that do not depend on
> the ordering at all.

`derive()` now expresses the rule as filing-fitness rather than rank, and
`FILING_FIT` is named once so it and `fitForFiling()` cannot drift.

The lifecycle work ahead reorders states that guards compare. This will
happen again if nobody is looking for it.

---

## Where GC stands

| Area | Rating | Change and reason |
|---|---|---|
| Architecture / Constitution | **GREEN** | Exceptionally mature for the stage |
| IA / Design System | **GREEN** | Generated, gated, 107 pages from one table |
| **Cross-aperture data truth** | **GREEN** | *New row.* One canon, zero hardcoded figures, load-time drift check |
| **Cross-aperture navigation** | **RED** | *New row.* 57 of 77 links point at the retired IA; 13 are dead |
| Domain Model | GREEN/AMBER | Unchanged — needs the lifecycle reconciliation |
| Investor Experience | GREEN/AMBER | Unchanged — persistence prevents it becoming real |
| Operational System | AMBER | Unchanged |
| Financial Digital Twin | **AMBER, narrower** | Projection is sound; *ingestion* is the gap |
| Governance Execution | AMBER | Unchanged |
| AI | AMBER/BLUE | Contracts now declared; engine correctly deferred |
| Infrastructure | **AMBER** | *Was RED/AMBER.* Rate limiting closed, work committed, CI green. Database and credentials remain |

Still open and unglamorous: **branch protection on `main` is off**, so the
green CI check is not yet enforcing anything.

---

## The next milestone

Unchanged, and it is the right one. Do not call it "Wave 8 complete."

> **GC CAN EXECUTE ONE VEHICLE END-TO-END.**

Take SlowSpace Coastal LLP and prove the chain: Public Offering → ₹50k
Reservation → KYC → Offline Closing → Partner Admission → CAPITAL → TIME →
Member → Project Update → Cash-flow Mirror → Board Resolution →
Distribution → Member Reporting.

With persistent state, evidence, RBAC, SoD, event history and — only once
those hold — ATLAS oversight and IRIS continuity.

One addition to the definition of done, from the audit above: **every link
in that chain must resolve directly.** A demonstration that works because
of a redirect table is a demonstration of the redirect table.

Then twenty LLPs is repetition rather than architecture.

**The amber line to watch: stop expanding the ontology and make one vehicle
completely executable.**
