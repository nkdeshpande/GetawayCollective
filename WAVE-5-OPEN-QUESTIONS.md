# WAVE 5 — OPEN QUESTIONS

**31 Jul 2026 · Waves 1–5 built · 305 tests · 12 gate checks · 0 open constitutional blanks**

Everything below is a question I could not answer for you without making a
decision that is commercial, fiduciary, or a matter of taste. Where I had a
defensible default I applied it and said so; where I did not, I stopped and
recorded it here.

Nothing on this list blocks the build. Several would change what gets built
next.

---

## A · CONFLICTS BETWEEN TWO RATIFIED DOCUMENTS

These are the important ones. In each case two documents you have approved
say different things, and picking one would quietly overrule the other.

### A1 — Brand voice: "Warm" vs "never persuades" ⚠️

| Document | Says |
|---|---|
| **L1-02 Brand Constitution** | Intelligent · **Warm** · Unvarnished · Collaborative · Patient |
| **Addendum A, Voice Principles** | **Sovereign** — *"copy states facts and terms; it never persuades or hedges with marketing softeners"* · Deterministic · Unadorned |

*Unvarnished* and *Unadorned* agree. *Warm* and *never persuades* do not
obviously. A welcome screen written to L1-02 and one written to Addendum A
would not sound like the same company.

**Why it matters now:** I wrote 25 validation messages this wave. I resolved
the tension toward *plain and non-blaming* — no apologies, no softeners, but
also no coldness. That was a judgement call inside a gap between two
ratified documents, and it now sets the tone for every error string in the
product.

**Options:** (a) Addendum A governs interface copy, L1-02 governs
member-facing narrative — they describe different surfaces; (b) amend L1-02
to drop *Warm*; (c) amend Addendum A to admit warmth. **My read: (a)**, and
it should be written down rather than inferred.

### A2 — Risk categories: 8 in the design system, 10 in the registry ⚠️

| | Categories |
|---|---|
| **Canonical design system** | liquidity · construction · legal · operational · market · reputation · compliance · climate |
| **UFR-0440 `Risk.risk_category`** | liquidity · interest_rate · operator · market · climate · currency · legal · regulatory · technology · counterparty |

Four overlap. Four exist only in the design system. Six exist only in the
registry — and those six currently render in neutral grey.

**Interim:** `riskColour()` falls back to `steel` so nothing crashes, and a
test pins that behaviour.

**Options:** (a) extend the design system to 10; (b) reduce the registry to
8 — a constitutional amendment, since it is a ratified enum; (c) map
registry categories onto design colours (`operator` → operational,
`regulatory` → compliance, and so on). **My read: (c) then (a)** — mapping
first, because it needs no amendment.

### A3 — Design system version: v3.0 LOCKED vs v4.0 referenced

§29 locks `GC-DesignSystem.html` at **v3.0**. The Addendum names its parent
as `GC-DesignSystem-Canonical.html` **(v4.0)**.

I verified the canonical file value-by-value against the locked tokens:
**zero drift** across 17 colours, 4 typefaces, 10 spacing steps, 2 curves
and 4 durations. So nothing broke. But §29 names a version, and the version
in hand is a different number.

**Question:** is v4.0 the ratified successor to v3.0, or a working draft
that happens to agree? If the former, §29 needs a one-line amendment naming
the new version.

---

## B · DECISIONS I MADE FOR YOU THIS WAVE

Each is applied, tested, and reversible. Flagged because they were mine.

### B1 — Four contrast variants added to the palette

A computed WCAG audit found four semantic colours failing on one ground:

| Token | Ground | Was | Variant | Now |
|---|---|---|---|---|
| `forest` | void | **1.38:1** | `forestLight` #228A68 | 4.62:1 |
| `copper` | paper | 2.18:1 | `copperDeep` #8C6635 | 4.61:1 |
| `confirm` | paper | 2.70:1 | `confirmDeep` #177F43 | 4.52:1 |
| `hazard` | paper | 2.93:1 | `hazardDeep` #BE4915 | 4.52:1 |

`forest` on `void` is a dark green on near-black — effectively invisible in
Obsidian mode. `copper` is the **currency** token, so every money figure in
Concrete mode was below the UI threshold.

**No original token changed.** Each variant holds the original's hue and
saturation and moves only lightness. §29 is intact — four things were added,
nothing was overridden.

**Confirm or reject the four hexes.**

### B2 — "Journeys" renamed to "Processes"

The Wave 5 intake asks for *Journey Descriptions*. `Journey` is forbidden
(§25 — it belongs to the Operating Company; the Member Law replaced it with
*Investor Lifecycle*). I built them as **Processes** (`lib/processes.ts`,
PR-01…PR-05).

*Investor Lifecycle* was the obvious alternative but is already the name of
an approved glossary term for a different thing — the Investor's own state
progression, not a multi-step flow.

### B3 — Expiry windows on process steps

Not in any document. I set them and tested them:

| Step | Expires | Reasoning |
|---|---|---|
| Accreditation decision | 15 working days | From §24b |
| Diligence workstream | 180 days | Describes a world that moves |
| Independent valuation | 365 days | EP-01 §5.14 annual minimum |
| **IC acquisition approval** | **90 days** | A committee approved the asset *at a price*. After a quarter that is a different decision. |

The 90-day approval expiry is the one worth challenging — it is the tightest
and I invented it.

### B4 — Accreditation evidence holds; only the decision expires

Steps A1–A5 (identity, address, AML, suitability) resume indefinitely.
Only A6, the decision, expires at fifteen working days.

Re-verifying an unchanged passport helps nobody. But it means evidence
gathered two years ago can support a fresh accreditation, and Compliance may
disagree.

### B5 — `critical` budgeted at 12 enum values

Currently spending 10. Enforced by `enum-lint`.

Arbitrary number, real principle: `critical` is the rarest colour in the
system, and spending it on ordinary states leaves nothing that still
registers when a real breach happens.

---

## C · THINGS THE TOOLING FOUND THAT YOU SHOULD KNOW

Not questions — findings. Already fixed, recorded here because each was a
defect that would have shipped.

| # | Finding | Consequence had it shipped |
|---|---|---|
| 1 | **Member Law fired on acceptance, not settlement** | An accepted commitment that never funds would have produced a Member. Promotion is irreversible — no way back. Found by `sm-lint` comparing two declarations, neither wrong alone. |
| 2 | **Update contracts silently stripped immutable fields** | Editing `Agreement.counterparty_id` returned 200 OK and dropped the change. That field decides related-party status under I-07. Invisible until an audit. |
| 3 | **Vocabulary linter enforced 6 of 15 terms** | It was hiding a stale 12-object hospitality model with four forbidden nouns as live enum members, passing every build. Its own advice pointed at forbidden terms. |
| 4 | **`commitment.accept` and `ownership.transfer` were carried by no role** | Two permanently dead capabilities. |
| 5 | **F-invariant ID collision** | L1-01 and L1-14 assigned the same identifiers to different rules. Merged into one canonical table of 18. |
| 6 | **§27 said GC retains equity in every collection** | Directly contrary to your Governance Without Ownership ruling. |
| 7 | **The L2 model is 27 objects, not 25** | Miscount propagated into the constitution, the checklist and the code. |
| 8 | **Wave 1 checklist claimed a live git repo** | There was none. The corpus was unversioned until Wave 2. |

---

## D · STILL DEFERRED, AND WHY

| Item | Status | Blocked on |
|---|---|---|
| **EP-02…EP-22** | Registered and summarised; not authored to the 12-part spec | Each needs a named owner, control set and KPI set. Yours to assign. |
| **Turborepo / Next 16 scaffold** | Migration target, not built | Deliberate. An empty monorepo would constrain L7/L8 before the semantic layer had made its decisions. |
| **`token-lint` literal scan** | Passing over **zero files** | `components/`, `app/`, `packages/` do not exist yet. The check is in place ahead of the surface it guards. |
| **Six unlit invariants** | E-05, E-07, A-01, A-05, I-06 partly | Need persisted state to check. Declared and owned. |
| **Repository layer over Drizzle** | Not built | Next natural step. Needs no decision from you. |

---

## E · THE FOUR I WOULD ANSWER FIRST

1. **A1 — brand voice.** It sets the tone of every string in the product and it is being decided by default right now.
2. **A2 — risk categories.** Six of ten risk types currently render grey.
3. **B1 — the four contrast hexes.** Accept or reject; they are in the token package either way until you say.
4. **B3 — the 90-day approval expiry.** Tightest window I invented, easiest to get wrong.

Everything else can wait for Wave 6.
