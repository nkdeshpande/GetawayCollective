# GETAWAY COLLECTIVE — L1 OPEN BLANKS
# FILL-IN TEMPLATE · Rev 3

**Generated:** 30 Jul 2026
**Open items:** 9 (5 carried forward · 4 newly surfaced by the Policy Framework)
**Blockers to Wave 2:** 0 — but items marked ⚠️ **CANNOT DEFAULT** need a real answer from you; there is no basis in the corpus for me to invent one.

---

## HOW TO USE THIS

Each blank has four parts:

- **CONTEXT** — what's missing and where it lives
- **WHY IT MATTERS** — what breaks downstream if it stays blank
- **MY PROPOSED DEFAULT** — a defensible answer you can accept as-is
- **YOUR ANSWER** — the fill-in box

In the **YOUR ANSWER** box, write either:
- `ACCEPT` — take my default verbatim
- `ACCEPT WITH:` followed by your changes
- Or just write your own answer over mine

Items marked ⚠️ have no default. Those need you.

---

## STATUS SUMMARY

| # | Blank | Section | Priority | Owner | Default available? |
|---|-------|---------|----------|-------|--------------------|
| 1 | Reserve floor | S24 Invariants | **HIGH** | Finance | ✓ Yes (placeholder numbers) |
| 2 | Accreditation expiry & lapse behaviour | S24 Invariants | **HIGH** | Compliance | ✓ Yes |
| 3 | GC balance-sheet equity in own SPVs | S26 Boundaries | **HIGH** | Exec + Legal | ⚠️ **CANNOT DEFAULT** |
| 4 | Leverage limit | EP-01 §3.8 | **HIGH** | Finance + IC | ⚠️ **CANNOT DEFAULT** |
| 5 | Related-party materiality threshold | EP-01 §3.8 | **HIGH** | Audit & Risk | ✓ Yes |
| 6 | Brand Co revenue participation formula | EP-01 §2.2C | **MEDIUM** | Exec + Legal | ⚠️ **CANNOT DEFAULT** |
| 7 | Constitutional failure definition | S31 | LOW | Governance | ✓ Yes |
| 8 | Amendment procedure | S32 | LOW | Governance | ✓ Yes |
| 9 | L1 custodian + successor (two names) | S32 | LOW | Executive Office | ⚠️ **CANNOT DEFAULT** |

**Already ratified — do not re-answer:** BLANK-01 (→ L1-02 Brand Constitution) · BLANK-02 Vision · BLANK-03 Mission · BLANK-04 10yr/25yr Intent · BLANK-05 TIME domain · BLANK-06 Layer model · BLANK-07 Values · BLANK-08 Governance thresholds (→ EP-01 §3.8) · BLANK-11/11a Member Law + Guest deprecation · BLANK-12 Glossary · BLANK-13 Commercial boundaries (partial — see #3 below) · BLANK-14 Design supremacy · BLANK-15 Typography · BLANK-16 Success metrics · BLANK-20 L2 Business Objects.

---
---

# 1 — RESERVE FLOOR

**ID:** BLANK-09 · **Section:** L1-01 §24 Invariants · **Priority:** HIGH · **Owner:** Finance
**Blocks:** Invariant F-04 (Reserve Floor Enforced) · L5 Capabilities · Wave 5

### CONTEXT

The constitution says reserve shortfalls compel a governance review. It never says what a shortfall *is*. Invariant **F-04** is written and cannot be implemented — `DistributeCapital` has a precondition that checks reserves against a floor that doesn't exist as a number.

### WHY IT MATTERS

This is the single control that stops the platform distributing itself into fragility during good years. Set it too low and a bad season forces an emergency capital call. Set it too high and you're sitting on dead capital that drags IRR. It also drives the alerting thresholds and the escalation path.

### MY PROPOSED DEFAULT

> A reserve shortfall exists when the reserve balance falls below **the greater of**:
> - **6 months** of modelled operating expense for the property, **or**
> - **1.5%** of the property's most recent independent NAV.
>
> **Alerting:** warning at 110% of floor · escalation at 100% · distributions blocked below 100%.
> **On breach:** compels governance review within 30 days, which must resolve to either a capital call or an expense reduction plan.

*Both numbers are placeholders. They are internally consistent but not modelled against your actual OpEx.*

### ⬜ YOUR ANSWER

```
Reserve floor definition:


Is it per-property, per-SPV, or portfolio-level? (this materially changes the maths)


Alert thresholds:


What happens on breach — who is compelled to act, and within what window?


Does the floor differ by asset stage (newly acquired vs stabilised)?


```

---
---

# 2 — ACCREDITATION EXPIRY & LAPSE BEHAVIOUR

**ID:** BLANK-10 · **Section:** L1-01 §24 Invariants · **Priority:** HIGH · **Owner:** Compliance
**Blocks:** Invariant I-03 (Accreditation Verified) · F-05 (Eligibility Gate) · L4 State Machine · Wave 3

### CONTEXT

Accreditation is required to commit capital (I-03, F-05). Nobody has said how long an accreditation is valid, when the member gets warned, or — the contentious part — **what happens to a capital action that is mid-flight when accreditation lapses**.

### WHY IT MATTERS

This is a legal exposure, not a UX detail. If a capital call settles for a member whose accreditation lapsed three days earlier, that's a regulatory problem. But cancelling in-flight actions creates its own problem: money is in escrow, the SPV has committed, and a unilateral cancellation may itself breach the subscription agreement.

The **freeze** behaviour I'm proposing is the contentious choice — it means capital sits in limbo rather than moving in either direction.

### MY PROPOSED DEFAULT

> **Validity:** 12 months from date of verification.
> **Renotification:** T-60, T-30, T-7 days before expiry.
> **On lapse with no in-flight action:** identity moves to `ACCREDITATION_LAPSED`. Cannot initiate new commitments. Existing holdings unaffected. Member state unchanged (per I-08, irreversible).
> **On lapse WITH an in-flight capital action:** the action is **FROZEN**, not cancelled. Capital is neither drawn nor released. It resolves only on (a) successful re-accreditation, or (b) explicit written withdrawal by the member.
> **Freeze ceiling:** 90 days. Beyond that, Compliance must escalate to the Audit & Risk Committee for a determination.

### ⬜ YOUR ANSWER

```
Validity period:


Renotification schedule:


In-flight action on lapse — FREEZE / CANCEL / COMPLETE-THEN-SUSPEND?
(and your reasoning, because Legal will ask)


Freeze ceiling and escalation path:


Does a lapsed member retain governance voting rights on existing holdings?
(I have assumed YES — voting attaches to holdings, not to accreditation. Confirm.)


Jurisdiction variance — does this differ for non-Indian investors?


```

---
---

# 3 — ⚠️ DOES GC HOLD BALANCE-SHEET EQUITY IN ITS OWN SPVs?

**ID:** BLANK-13a · **Section:** L1-01 §26 Commercial Boundaries · **Priority:** HIGH · **Owner:** Executive Office + Legal
**Blocks:** EP-01 §4 Conflicts framework · EP-02 Investment Policy · L5 Governance · Wave 5

### CONTEXT

BLANK-13 was marked ratified, but the ratification text answered concentration (≤10%), jurisdictions, and liquidity — **it did not answer this question**. It is the most consequential item still open.

### WHY IT MATTERS

This is not a preference. It changes the governance model:

- **If GC takes equity:** GC is a co-investor, not just a manager. Every investment decision becomes a related-party transaction under EP-01 §4.10. You need an independent review mechanism for IC decisions, and the conflict-of-interest disclosures in EP-13 get materially heavier. Upside: alignment — GC eats its own cooking, which most institutional LPs actively want to see.
- **If GC does not take equity:** GC is a pure fiduciary. Conflicts framework stays light. But you lose the alignment story, and you're compensated only through fees — which changes the entire economic model and the EP-08 waterfall.

There is no default here. It is a founder and legal decision.

### RELATED SUB-QUESTIONS (all currently blank)

- **Minimum ticket size.** "Minimum institutional viability" was ratified as the principle; there is no number.
- **Prohibited counterparties.** Named categories, or case-by-case IC judgement?
- **Maximum single-holder concentration** was ratified at ≤10% per property — does the same cap apply at portfolio level?

### ⬜ YOUR ANSWER

```
Does GC hold balance-sheet equity in its own SPVs?  YES / NO / CASE-BY-CASE


If YES — typical percentage, and is it mandatory or discretionary per deal?


If YES — what independent review governs IC decisions where GC is co-investing?


Minimum ticket size (₹ / $):


Maximum single-holder concentration at PORTFOLIO level:


Prohibited counterparties:


```

---
---

# 4 — ⚠️ LEVERAGE LIMIT

**ID:** BLANK-21 (new) · **Section:** L1-03 EP-01 §3.8 · **Priority:** HIGH · **Owner:** Finance + Investment Committee
**Blocks:** EP-01 §3.8 Special Resolution trigger · EP-02 Investment Policy · L5 Governance

### CONTEXT

Newly surfaced by the Policy Framework. EP-01 §3.8 makes "borrowing beyond approved leverage limits" a **Special Resolution** matter requiring ≥76% approval. But no leverage limit has ever been approved, so the trigger can never fire — every borrowing decision currently falls through to Ordinary Resolution by default.

### WHY IT MATTERS

Right now there is a live gap in the governance model: the constitution has a supermajority protection that is structurally unreachable. Until a limit exists, a simple majority could lever the portfolio arbitrarily.

### WHY I CAN'T DEFAULT IT

Leverage policy is a function of your cost of capital, your lenders' covenants, and your risk appetite — none of which appear in the corpus. A number I invent here would be a guess presented as a control.

### ⬜ YOUR ANSWER

```
Maximum LTV per property:


Maximum LTV at portfolio level:


Is the limit hard (never exceeded) or soft (exceeded only by Special Resolution)?


Are there asset-stage exceptions? (e.g. higher during acquisition/development,
stepping down at stabilisation)


Debt service coverage ratio floor, if any:


Does GC permit recourse debt, or non-recourse only?


```

---
---

# 5 — RELATED-PARTY MATERIALITY THRESHOLD

**ID:** BLANK-13b (new) · **Section:** L1-03 EP-01 §3.8 + §4.10 · **Priority:** HIGH · **Owner:** Audit & Risk Committee
**Blocks:** EP-01 §4.10 · Invariant I-07 (Conflicts Disclosed) · L5 Governance

### CONTEXT

Newly surfaced. EP-01 §3.8 requires a Special Resolution for "related-party transactions above a **Board-defined materiality threshold**." §4.10 requires Board approval for related-party transactions "**where material**." Neither defines material.

Because GC owns both the Operating Division and the Brand & Digital Division, *every* inter-division arrangement is a related-party transaction. Without a threshold, either everything escalates to the Board (unworkable) or nothing does (ungoverned).

### WHY IT MATTERS

This threshold is the practical dividing line that makes the whole conflicts framework operable. It's also what an auditor will ask for first.

### MY PROPOSED DEFAULT

> A related-party transaction is **material** where it meets **any** of:
> - Annual value exceeds **₹50 lakh** (~$60k), **or**
> - Annual value exceeds **2%** of the relevant SPV's annual operating expense, **or**
> - It has a term exceeding **36 months**, **or**
> - It creates an exclusivity, non-compete, or termination-restriction affecting the SPV
>
> **Below threshold:** documented, benchmarked where practical, reported quarterly to Audit & Risk.
> **At or above threshold:** Board approval required. Above ₹5 crore, also requires Special Resolution (≥76%) per §3.8.
>
> **Always material regardless of value:** the Management Agreement · the Brand Participation Agreement · any amendment to either.

### ⬜ YOUR ANSWER

```
Materiality threshold (value):


Threshold as % of SPV OpEx:


Term-length trigger:


Special Resolution trigger (the higher band):


Anything else always-material regardless of value:


```

---
---

# 6 — ⚠️ BRAND COMPANY REVENUE PARTICIPATION FORMULA

**ID:** BLANK-22 (new) · **Section:** L1-03 EP-01 §2.2C · **Priority:** MEDIUM · **Owner:** Executive Office + Legal
**Blocks:** EP-01 §2.6 (Approve Revenue Participation Formula) · EP-08 Ownership & Distribution · EP-22

### CONTEXT

Newly surfaced. EP-01 §2.2C establishes that the Brand & Digital Company "may receive a constitutionally approved commercial participation based upon Net Operating Revenue," and constrains it: contractually defined · transparent · independently auditable · **never dilutes investor ownership** · **never subordinates investor distributions**.

The constraints are locked. The formula is blank.

### WHY IT MATTERS

Two things depend on it:

1. **The EP-08 waterfall.** Where does Brand participation sit? If it's taken off Net Operating Revenue *before* the waterfall, it is economically senior to the preferred return — which is in tension with "never subordinates investor distributions." If it sits inside the waterfall after preferred return, it's genuinely subordinate but the Brand Co may be uninvestable as a standalone entity.
2. **Invariant F-03** (Distributions Follow Waterfall) cannot be implemented until the waterfall has all its levels named.

This is the item most likely to create a real conflict later if left vague.

### WHY I CAN'T DEFAULT IT

It's a commercial negotiation between entities you control, with an investor-protection constraint on top. Any number I pick is arbitrary; any *structure* I pick makes a fiduciary judgement that isn't mine to make.

### ⬜ YOUR ANSWER

```
Participation basis — % of Net Operating Revenue / % of Gross / fixed fee /
hybrid (base fee + performance):


Rate:


Where does it sit in the waterfall?
(before fees / after fees before reserves / after preferred return / other)


How is "Net Operating Revenue" defined for this purpose?
(this definition will be litigated one day — be precise)


Is there a performance condition or clawback?


Review/reset cadence:


How is it benchmarked for fairness, and against what?


```

---
---

# 7 — CONSTITUTIONAL FAILURE DEFINITION

**ID:** BLANK-17 · **Section:** L1-01 §31 · **Priority:** LOW · **Owner:** Governance
**Blocks:** Wave 10

### CONTEXT

The constitution has no definition of its own failure — no condition under which the enterprise declares that the system has broken and the affected layer must be re-ratified.

### WHY IT MATTERS

Low urgency, high symbolic weight. A constitution that cannot recognise its own violation has no enforcement mechanism beyond goodwill. This is what turns the invariant register from documentation into law.

### MY PROPOSED DEFAULT

> Constitutional failure is declared on **any one** of:
>
> 1. **An invariant was violated in production and shipped.** Not caught in review, not caught by the linter — reached members.
> 2. **A distribution was executed in error.** Wrong amount, wrong recipient, wrong waterfall level, or out of sequence.
> 3. **A stewardship promise was broken at scale.** An environmental commitment materially weakened, or an asset materially degraded through deferred maintenance the Board did not approve.
>
> **Consequence:** any single trigger compels re-ratification of the affected layer within 90 days, plus a written post-mortem entered permanently in the Decision Register. Re-ratification requires the same threshold as original ratification.
>
> Failure is **declared, not negotiated**. The Governance & Ethics Committee declares it; the Board cannot decline the declaration, only respond to it.

### ⬜ YOUR ANSWER

```
Trigger conditions:


Who has authority to DECLARE failure?


Can the declaration be overridden or appealed? By whom?


Re-ratification window:


Is a public/member disclosure required, or internal only?


```

---
---

# 8 — AMENDMENT PROCEDURE

**ID:** BLANK-18 · **Section:** L1-01 §32 · **Priority:** LOW · **Owner:** Governance
**Blocks:** Wave 10

### CONTEXT

Partially answered by EP-01 §5.11 (policy amendments — Board only, with stated content requirements). But that governs **Enterprise Policies**, not the **Constitution itself**. Constitutional amendment procedure is still blank: who may propose, notice period, who holds veto.

Note: EP-01 §3.8 already establishes that constitutional amendments require a **Special Resolution (≥76%)**. That part is settled. What's missing is the process around the vote.

### WHY IT MATTERS

Without a defined procedure, the first genuine amendment attempt becomes a procedural argument instead of a substantive one.

### MY PROPOSED DEFAULT

> **Who may propose:** any layer steward (the named owner of any L1–L12 layer).
> **Notice period:** 30 days between tabling and vote. No emergency exception — if it's urgent enough to skip notice, it's a governance exception under EP-01 §5.7, not an amendment.
> **Threshold:** Special Resolution, ≥76% of total voting rights (already ratified, EP-01 §3.8).
> **Dual approval:** Executive Office **and** Enterprise Architecture must both approve before it reaches a vote. Either can block tabling.
> **Veto:** Executive Office holds a post-vote veto, exercisable within 7 days, once per amendment, with written reasons entered in the Constitutional Amendment Register.
> **Cascade rule:** downstream re-ratification obligations are enumerated **before** the vote, never after. Voters must see the full blast radius — which layers, documents, and invariants are affected — as part of the motion.

### ⬜ YOUR ANSWER

```
Who may propose:


Notice period:


Who must approve before tabling:


Who holds veto, and is it pre-vote or post-vote:


Is the cascade rule accepted? (enumerate downstream impact BEFORE the vote)


Is there any clause that is UNAMENDABLE?
(some constitutions entrench a core — e.g. fiduciary primacy, or the Member Law.
 Worth considering. My instinct: entrench Fiduciary Primacy and nothing else.)


```

---
---

# 9 — ⚠️ L1 CUSTODIAN + DESIGNATED SUCCESSOR

**ID:** BLANK-19 · **Section:** L1-01 §32 · **Priority:** LOW (but zero-effort) · **Owner:** Executive Office
**Blocks:** Wave 10 · Wave 1 sign-off

### CONTEXT

Two names. The named custodian of the L1 Constitution, and their designated successor.

### WHY IT MATTERS

Everything in Wave 10 keys off having them. It's also the smallest possible item on this list — and it's currently blocking a Wave 1 exit condition purely because nobody has typed two names.

Per EP-01 §5.9, the **Office of Enterprise Governance** is the institutional custodian. This blank asks for the *people*.

### ⬜ YOUR ANSWER

```
L1 Custodian (name, role):


Designated Successor (name, role):


```

---
---

# SIGN-OFFS (Wave 1 exit condition)

Four authorities, per the exit checklist. Names needed.

```
Enterprise Architect ..................... 

Design Authority ......................... 

Compliance / Legal ....................... 

Executive Sponsor ........................ 

```

---
---

# RETURN INSTRUCTIONS

Fill in the ⬜ boxes and send this back — either the whole file or just the sections you've answered.

On receipt I will:
1. Write each ruling into the relevant constitutional section (L1-01 / L1-03)
2. Move all 9 to the **Ratified** sheet of `L1-BLANKS-REGISTER.xlsx` with the ruling text
3. Implement the numeric ones as constants (reserve floor → `F-04`, leverage → `EP-02`, materiality → `EP-01 §4.10`)
4. Update `WAVE-1-EXIT-CHECKLIST.md` to 100% on content and data
5. Report what remains before Wave 1 lock

**Fastest path:** if you're short on time, answer **#3, #4, #6, and #9** — the four ⚠️ items. The other five have defaults I'm comfortable defending, and you can accept them with a single `ACCEPT ALL DEFAULTS` line.

---

**Document:** `L1-BLANKS-TEMPLATE.md` · Rev 3 · 30 Jul 2026
