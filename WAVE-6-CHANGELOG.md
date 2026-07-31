# WAVE 6 — CHANGE LOG

**31 Jul 2026 · Waves 1–6 built · 353 tests · 15 gate checks · 37 ratified, 0 open**

Everything that changed since the Wave 5 gate, in the order it happened.

---

## 1 · YOUR FIVE RULINGS, APPLIED

### A1 — Brand voice: **Warm · Confident · Assertive, with Pleasantness**

Two ratified documents disagreed. L1-02 said *Warm*; Addendum A said the
voice *"never persuades or hedges with marketing softeners"*.

They were only in conflict because **warm was being read as soft**. Warmth is
about *who we speak to* — a person owed a plain answer. Persuasion is about
*what we want from them*. A message can be warm and want nothing.

Addendum A's three principles survive **inside** the four rather than being
overruled: *Sovereign* and *Unadorned* are what **Confident** means in
practice; *Deterministic* is what **Assertive** means. *Intelligent*,
*Unvarnished* and *Patient* are absorbed. **Collaborative is retired** — it
made copy ask questions it did not intend to act on.

| Changed | |
|---|---|
| `L1-02` Part VII | Rewritten and ratified. Now governs **every string the enterprise emits** — there is no second voice for error states. |
| `constants/validation.ts` | All 25 messages rewritten. |
| `constants/tokens-addendum.ts` | `VOICE_ADDENDUM` replaced by `VOICE`, mirroring L1-02 rather than competing with it. |
| `scripts/voice-lint.js` | **New.** 338 member-facing strings checked. |

The messages now say what happens next, not only what stopped:

> *"Scheduled debt service is outstanding, so partner distributions wait. They run as soon as it settles."*
> *"This commitment is below the minimum for this offering. Raise it to the minimum shown and we'll take it from there."*
> *"Your accreditation had expired when this commitment reached us, so it has lapsed. Renew it and the commitment can be made again — nothing else is affected."*

`voice-lint` enforces the mechanical half: no apology, no hedging, no blame,
no softeners, no exclamation marks, and accessible text must name the field
first. It cannot check whether a sentence is warm; it can check that it does
not trail off without saying what happens next.

**Why it is linted at all:** voice is the first thing to erode. Nobody sets
out to write *"Sorry, something went wrong"* — it arrives one string at a
time, each added by someone in a hurry who did not have the constitution open.

### A2 — Risk categories: all ten now distinct

Six of ten rendered grey, which makes a risk register unscannable — the one
thing a register exists to be.

| Category | Colour | Source |
|---|---|---|
| `liquidity` | `#2061DE` | unchanged |
| `market` | `#0C3024` | unchanged |
| `legal` | `#6B6B6B` | unchanged |
| `climate` | `#2E8B7A` | unchanged |
| `operator` | `#E8672E` | ← `operational` |
| `regulatory` | `#1FAA59` | ← `compliance` |
| `counterparty` | `#8B5FBF` | ← `reputation` ⚠️ reuse, not synonym |
| `interest_rate` | `#C79F6B` | ← `construction` ⚠️ stretches the currency token |
| `currency` | `#B8873F` | **new** — amber-gold |
| `technology` | `#5A7D9A` | **new** — slate blue |

`construction` and `reputation` **dropped** — the registry does not track
them, and adding them would be a §32a amendment rather than a mapping.

**A test caught a real defect here.** The fallback colour was `#6B6B6B`,
identical to **legal** risk — so an unmapped category rendered exactly like a
legal one. Moved to `steelDim`. A fallback that impersonates a real category
is worse than no fallback.

### A3 — Design system integrated

§29 amended. GC.SYSTEM is now named as **three parts with fixed precedence**:

```
Core (canonical)  →  Addendum A  →  Accessibility extension
```

Each later part may only **add**. None may alter a value declared by an
earlier one — enforced structurally, because `tokens.ts` does not import
`tokens-addendum.ts`.

The clause is now **version-agnostic**: it binds to GC.SYSTEM as constituted,
not to a number. v4.0 is ratified as successor to v3.0 after value-by-value
verification showed **zero drift**. A version bump that changes no value is
not a constitutional event; one that changes a value is a §32a amendment.

New **§29-0a** makes accessibility part of the system rather than a review
of it.

### B1 — Contrast variants signed off · B3 — Expiry windows aligned

Four additive variants, each holding its original's hue and saturation and
moving only lightness. Every original token keeps its exact value.

---

## 2 · WAVE 6 — COMPOSITE SURFACE

### `lib/metric-grammar.ts` — where three layers meet

The money layer says what a value **is**. The provenance spine says how much
it can be **trusted**. The design system says how it **looks**. This is the
only place all three combine — so a forecast can never be rendered as though
it were observed.

- **Indian digit grouping.** `₹1,25,00,000.00`, not `₹12,500,000.00`. An
  Indian reader parses the first at a glance and stalls on the second.
- **Currency without a symbol throws.** A bare number reads as a count.
- **Percentages are basis-point integers.** `1450`, never `0.145` — the same
  door the money layer closed.
- **A provisional figure carries a visible mark**, not only a tone. A
  forecast has to survive being printed in black and white.
- **`loss` is reserved for realised negatives.** A negative delta on a
  forecast is a forecast, not a loss.

### `constants/organisms.ts` — 10 composites, 60 fields

Field **order** is the design. On a dense financial screen it is what a
reader actually uses: the first field is what they look for, the last is
what they scroll past.

Decisions worth naming:

- **Valuation source sits directly beneath the valuation figure.** A number
  whose provenance is a scroll away gets read as independent when it is not.
- **Reserve coverage is IL-1** — the highest level in the system — because it
  is the single figure deciding whether a distribution runs.
- **A waterfall shortfall renders as `loss`, not negative currency.** Stages
  that received nothing are still shown; an absent row reads as a stage that
  did not exist.
- **The Resolution card carries options considered and conflicts disclosed**,
  not only the outcome. I-06 asks for the *basis* of a decision.
- **A confidence tag is IL-5 or lower** — it must never outrank the figure it
  qualifies.
- **The point of no return is shown before it is reached.** An interface that
  reveals irreversibility afterwards has told someone something they can no
  longer act on.

### `lib/telemetry.ts` — signals about the system, never about a person

The hard rule is privacy, because the useful signal and the forbidden signal
look identical at the call site. *"Distribution executed: ₹8,28,000 to 4
holders"* is exactly what an analyst wants and exactly what must never leave
the system.

The answer is **structural, not procedural**: `scrub()` rejects forbidden
keys, nested objects, and value *shapes* — a 4dp decimal string, an email, a
PAN, an identity UUID — and it **throws rather than silently dropping**. A
silent drop teaches nobody, and the next caller writes the same line.

Where magnitude is genuinely needed, `magnitudeBucket()` answers *"was this
large?"* without answering *"how much?"*.

`tryEmit` never throws into business logic. The alternative is a distribution
failing because an analytics endpoint was slow.

### `scripts/organism-lint.js` — 8 checks

The one that matters: **every UFR source an organism cites must exist**. A
card citing a renamed field renders *blank* rather than failing, so nobody
finds out. Also enforces that no organism exposes a field that could map a
holder to a ballot (I-05).

---

## 3 · DEFECTS FOUND THIS WAVE

| # | Defect | Consequence had it shipped |
|---|---|---|
| 1 | **Lakh/crore thresholds off by 10×** in `magnitudeBucket` | Every telemetry bucket mislabelled. ₹1.25 crore reported as `10Cr+`. A bucket is worse than no bucket if it is confidently wrong. |
| 2 | **Risk fallback colour identical to `legal`** | An unmapped risk category rendered exactly like a legal one. |
| 3 | **Unanchored `import` regex** in the token exporter | Matched inside the word "**import**ant" in a doc comment and ate most of a CSS block. |
| 4 | **Stray empty enum placeholder** | Swallowed the group after it, surfacing as a missing label on a completely unrelated enum. |
| 5 | **My own enum copy used ALL-CAPS emphasis** | Caught by the voice linter I had just written. Emphasis comes from word order. |

Defects 1 and 2 were caught by tests I wrote to check something else. 3 and 4
were caught by the tooling failing loudly rather than passing vacuously —
which is why every checker in this repo refuses to pass on an empty parse.

---

## 4 · STATE

| | |
|---|---|
| L2 objects · fields · edges | 27 · 127 · 28 |
| Capabilities · events · rights | 33 · 51 · 31 |
| State machines · transitions | 6 · 30 (14 irreversible, proven) |
| Enum sets · values | 26 · 135 |
| Organisms · fields | 10 · 60 |
| Processes · steps | 5 · 27 |
| Validation rules | 25 |
| ADRs | 11 |
| **Invariants enforced** | **35 / 41** |
| **Tests** | **353** |
| **Gate checks** | **15** |
| Blanks | 37 ratified, **0 open** |

### The 15 gates

`vocab-lint` · `voice-lint` · `ufr-lint` · `rel-lint` · `cap-lint` ·
`sm-lint` · `enum-lint` · `organism-lint` · `token-lint` ·
`schemas:check` · `db:check` · `fixtures:check` · `tokens` ·
`type-check` · `test:run`

---

## 5 · WHAT IS DELIBERATELY NOT BUILT

**The Turborepo scaffold.** Still a migration target. An empty monorepo would
constrain L7 decisions the semantic layer has not made.

**`token-lint` scans zero files for literals**, because no component
directory exists yet. The check is in place *ahead of* the surface it guards
— so the first component written is checked, rather than the hundredth.

**Six invariants remain unlit** — E-05, E-07, A-01, A-05, and parts of I-06.
They need persisted state to check. Declared, owned, and named in tests that
have no database to run against yet.

**EP-02…EP-22** remain registered and summarised rather than authored to the
12-part specification. Each needs a named owner, control set and KPI set.

---

## 6 · NOTHING IS BLOCKING YOU

Every question from the Wave 5 gate is answered. There are no open
constitutional questions and no decisions waiting on you.

Two things I would flag rather than ask:

1. **`counterparty ← reputation` and `interest_rate ← construction`** are
   colour *reuse*, not mapping. Both work. Both are recorded in
   `RISK_COLOUR_CAVEATS` so they surface if either colour is later needed
   for its original meaning.

2. **The next build is the repository layer over Drizzle** — the thing that
   turns the six unlit invariants from declared into enforced. It needs
   nothing from you.
