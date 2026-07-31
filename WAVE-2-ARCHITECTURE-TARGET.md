# WAVE 2 · ARCHITECTURE TARGET
## GC.SYSTEM v3.0 — Migration Target, Not Current State

**Status:** RATIFIED 30 Jul 2026 as the **migration target**
**Current state:** `C:\gc-app` remains authoritative. Nothing restructures yet.
**Authority:** L1-01 (constitutional) · GC.SYSTEM v3.0 (target topology)

---

# 1. THE RULING

GC.SYSTEM v3.0 describes where this platform is going, not where it is.

| | Now | Target |
|---|---|---|
| Structure | Flat `gc-app` | Turborepo monorepo |
| Framework | Next.js 15 (declared, not scaffolded) | Next.js 16, RSC + Server Actions |
| Data | none | PostgreSQL via Drizzle |
| Validation | none | Zod contracts |
| Layers built | L1 constitution, L2 objects, L2.5 UFR | L1–L12 complete |

**Nothing in `C:\gc-app` restructures on the strength of this document.** The monorepo arrives when there is application code to put in it — currently there is none. Scaffolding an empty Turborepo now would constrain L7/L8 decisions that Wave 2's semantic work has not yet made.

**What this document does:** fixes the target so that every Wave 2–6 decision can be checked against it, and records the reconciliations that must happen *before* migration rather than during it.

---

# 2. WHAT RECONCILES CLEANLY

## 2.1 Design tokens — zero drift ✓

All ten DLS v3.0 semantic colours match `constants/tokens.ts` exactly. Verified programmatically, not by eye.

`Void #0A0A0A` · `Paper #F2F2F2` · `Mist #E8E8E6` · `Steel #6B6B6B` · `Forest #0C3024` · `Copper #C79F6B` · `Electric #2061DE` · `Hazard #E8672E` · `Critical #FF3B30` · `Confirm #1FAA59`

Typography (Outfit / Inter / Space Mono / Playfair Display), Metric Grammar, 4px spacing base, 0px radius, and the cinematic/shutter easing pair all match. The Design Supremacy Clause is holding.

**Migration action:** `packages/ui/tokens.json` is the existing `dist/tokens.json`, already generated. No re-authoring.

## 2.2 The 7-tier component architecture maps onto L1–L12

| GC.SYSTEM Tier | Constitutional Layer |
|---|---|
| Tier 01 Tokens | L1-05 Design Constitution (v3.0 LOCKED) |
| Tier 02–04 Atoms / Molecules / Organisms | L8 UX |
| Tier 05 Financial Objects | **L2 Business Objects** — see §3.1, does not currently reconcile |
| Tier 06 Assemblies | L7 Applications |
| Tier 07 Governance | L1 Constitution + L5 Governance |

## 2.3 The interaction state machine is compatible

`IDLE → ENGAGED → COMMITTED → LOCKED` is a **UI commitment ceremony**. It does not collide with the Member Law (`Investor → Member`), which is an identity lifecycle. Different axes.

One naming caution: `COMMITTED` here means "the user held the Piston for 3s and the Server Action validated". In constitutional vocabulary **Commitment** is a binding promise of capital (UFR-0182). Two meanings, one word, in the same system. Rename the UI state to **`SEALED`** at migration.

## 2.4 The data flow enforces the invariant chain correctly

`React → Zustand → Zod → Policy Engine → Invariant Engine → Drizzle → Query OS` places the Invariant Engine *after* policy and *before* persistence. That is the right order: authority is evaluated before rules, rules before writes. It also gives E-01 (every capability publishes events) a natural home in the Server Action layer.

---

# 3. WHAT DOES NOT RECONCILE

## 3.1 Tier 05 Financial Objects vs the ratified 27

GC.SYSTEM lists seven: Fund, Asset, Deal, Portfolio, Cash Flow, Covenant, Fraction.
**None of them is a canonical L2 object name.** L1-01 §33 ratified 27, and §33 states it is "complete and exhaustive".

Required mapping before any schema work:

| GC.SYSTEM | Canonical L2 object | Note |
|---|---|---|
| Fund | **Investment Vehicle** | Fund is *one form* of vehicle (`vehicle_form: "fund"`), not the class |
| Asset | **Property** | "Asset" is ambiguous across ASSET-domain and balance-sheet senses |
| Deal | **Acquisition** | + `Disposition` on exit; "Deal" spans both and resolves to neither |
| Portfolio | **Portfolio** | ✓ matches |
| Cash Flow | **Distribution** | + `PerformanceReport` for reporting; not one object |
| Covenant | **Agreement** + **Risk** | A covenant is a term *inside* an Agreement, tracked as a Risk. Not a top-level object |
| Fraction | **Ownership Position** | "Fraction" implies fractional real estate; the platform issues LLP units |

**Fraction is the consequential one.** It carries a retail fractional-ownership connotation that the constitution deliberately rejects — LLP partnership units with governance rights are not fractions. Using it in schema would leak that framing into every downstream surface.

## 3.2 Vocabulary violations — 6 forbidden terms

Machine-checked against `constants/vocabulary.ts`:

`Customer` ×2 · `User` ×1 · `Journey` ×1 · `Experience` ×1 · `Service` ×2 · `Steward` ×2

`Steward Investor` and `MEM: Steward Passport` violate §25a directly. The Member Law deprecated Steward as an actor noun — *Stewardship* survives as philosophy, *Steward* does not survive as a person.

---

# 4. THE VOCABULARY RULING

*Decision delegated to me. Recorded here so it can be overturned deliberately.*

**The split is by destination, not by content.**

## 4.1 System surface — MUST be canonical

Anything that becomes a route segment, directory name, component name, type, schema field, or API contract. These become code, get read by engineers daily, and would put the linter permanently at war with the codebase.

| GC.SYSTEM | Canonical | Why |
|---|---|---|
| `MEM: Steward Passport` | **Member Passport** | §25a — Steward is not an actor noun |
| `EXP: Physical Asset Space` | **AST: Asset Space** | "EXP"/Experience is forbidden |
| `PUB: Seduction / Immersive Mode` | **PUB: Public Root** | "Seduction" contradicts the L1-02 voice (Unvarnished, institutional candor) |
| `Steward Investor` (target segment) | **Investor** → **Member** | One actor, two states |
| Tier 05 object names | per §3.1 above | §33 is exhaustive |
| `(gateway)` `(space)` `(capital)` `(time)` `(member)` `(admin)` | ✓ all fine | no forbidden terms |

## 4.2 Brand strategy framework — outside linter scope

The 8-Pillar matrix is an **internal marketing-practice artifact**, not a system noun set. "Consumer Knowledge" and "Purchase Moment" are pillar names describing a discipline; they never become a table, a route, or a field.

Forcing them through the linter would produce contortions ("Member Prioritisation", "Commitment Moment Merchandising") that serve no engineer and damage a framework that works as written.

**Condition on the exemption:** the framework stays out of `packages/` and `apps/`. The moment a pillar name becomes a directory, a component, or a field, §4.1 applies to it.

## 4.3 Recommendation, not yet ratified

**`Consumer` should join the forbidden list.** It appears 6× in GC.SYSTEM. It is not currently forbidden — only `Customer` and `User` are — so the linter passes it. It is the same family and the same error: it frames a Member as someone who consumes rather than someone who owns.

This is a constitutional vocabulary amendment (§25) and is not mine to make. Logged as **BLANK-25**.

---

# 5. MIGRATION SEQUENCE

Ordered by dependency. No step may begin before the one above it lands.

| # | Step | Gate | Wave |
|---|---|---|---|
| 1 | UFR complete (L2.5) | ✓ **DONE** — 119 fields, 27/27 objects | W2 |
| 2 | L3 relationship model | E-05 enforceable | W2 |
| 3 | Zod contracts generated **from the UFR** | schemas cannot diverge from the registry | W2 |
| 4 | Drizzle schema generated from the same source | E-06 holds at the database | W3 |
| 5 | Policy + Invariant engines | `packages/policy`, `packages/core` | W3–4 |
| 6 | Turborepo scaffold | there is finally code to house | W5 |
| 7 | Tier 02–04 components | Tier 01 tokens already exist | W5–6 |
| 8 | 52-route IA matrix | after §4.1 renames | W6–7 |

**Step 3 is the one that matters most.** If Zod schemas are hand-written rather than generated from the UFR, the registry becomes documentation instead of enforcement, and E-06 quietly stops being true. Generate, do not transcribe.

---

# 6. GEMINI.md — RESOLVED 31 Jul 2026

**Ruling: `GEMINI.md` is REFERENCE ONLY. The ratified L1 corpus supersedes it.**

GC.SYSTEM placed a `GEMINI.md` at the monorepo root labelled "The Project Constitution / AI Brain". It is a Gemini CLI context file — the same convention as `CLAUDE.md` for Claude Code, with `AGENTS.md` as the tool-neutral form.

It does not hold constitutional authority. There is already a constitution: five ratified L1 documents with an amendment procedure (§32a), entrenched principles requiring unanimity (§32b), and a failure regime (§31). A second file claiming that title would be a §14 Naming Authority collision and, more practically, the place a divergent copy of the rules accumulates — the exact failure vocab-lint and the UFR exist to prevent.

**Actioned:** `AGENTS.md` written at the repo root. It is scoped to *how to work here*, not *what is true here*:

- the nine gate checks and what each enforces
- where constitutional authority actually lives, and that editing it is an amendment
- which files are generated and must never be hand-edited
- the rules that bite in practice — money is never a `number`, voting is equity-weighted, rights attach to ownership not accreditation
- what to do on finding a constitutional gap: record it, do not fill it silently

It **points at** the L1 corpus and restates nothing. Its opening line says so: *"This file is not the constitution. Where the two appear to disagree, the constitution wins and this file is the bug."*

If `GEMINI.md` is retained for another toolchain, it should be reduced to the same shape and carry the same disclaimer. Two files may describe how to work in the repo. Only one set of documents says what is true.

---

**Document:** `WAVE-2-ARCHITECTURE-TARGET.md`
**Status:** Target ratified · migration not started
**Open:** none
