# Wave 1 Gate Checklist
**Foundation Lock** — Exit conditions before moving to Wave 2

Modules: **Ct** (Constitution) | **Tx** (Object Taxonomy) | **Tk** (Token Core) | **Iv** (Invariant Register)

---

## ✓ Content Artifacts

- [ ] **Enterprise Constitution** (L1 document) locked and signed
  - All immutable principles captured
  - Constitutional hierarchy defined
  - Constitutional laws enumerated
  - Format: Markdown or PDF with version control

- [ ] **Constitutional Thesis** finalized
  - What GC is / is not documented
  - Three constitutional dimensions defined
  - Success / failure criteria clear
  - Format: Markdown linked to Constitution

- [ ] **Brand Constitution** published
  - Brand voice and tone (narrative or persona)
  - Brand promises documented
  - Brand prohibitions explicit
  - Format: Markdown or shared doc

- [ ] **Enterprise Vocabulary** (Forbidden + Preferred)
  - [ ] **Forbidden terms** with replacements:
    - [ ] Room → Studio
    - [ ] Customer → Guest (or Investor/Owner, context-specific)
    - [ ] Booking → Journey
    - [ ] Housekeeping → Studio Care
    - [ ] [Any others?]
  - [ ] **Preferred terminology glossary** (50–100 terms minimum)
    - Format: CSV or Markdown table (Term | Definition | Context | Example)

---

## ✓ Data Artifacts

- [ ] **Business Object Taxonomy** (BO-01…BO-12) enumerated and locked
  - [ ] BO-01 Identity
  - [ ] BO-02 Organization
  - [ ] BO-03 Property
  - [ ] BO-04 Studio
  - [ ] BO-05 Investment Offering
  - [ ] BO-06 Investment
  - [ ] BO-07 Ownership
  - [ ] BO-08 Journey
  - [ ] BO-09 Experience
  - [ ] BO-10 Service
  - [ ] BO-11 Financial Ledger
  - [ ] BO-12 Knowledge
  - Format: JSON or YAML enum, source control

- [ ] **Invariant Register** complete with ownership
  - Studio cannot exist without Property ✓
  - Ledger is append-only ✓
  - Knowledge is immutable ✓
  - Every capability publishes events ✓
  - Every decision has provenance ✓
  - [ ] [Custom GC-specific invariants added]
  - For each invariant:
    - Owning layer documented
    - Named test defined (unimplemented OK at W1)
    - Enforcement mechanism noted
  - Format: Markdown table or JSON

- [ ] **Enterprise Policies** summary captured
  - [ ] Privacy (PII handling, retention, residency)
  - [ ] Security (encryption, authentication, authorization)
  - [ ] Accessibility (at least WCAG 2.1 AA target)
  - [ ] Sustainability (if applicable)
  - [ ] Ethics (algorithmic fairness, transparency, etc.)
  - [ ] Luxury standard (brand-specific operational standards)
  - Format: Markdown with external links to full policies

---

## ✓ Visual Artifacts

- [ ] **GC-DesignSystem-Canonical v3.0** extracted and frozen
  - [ ] **Colour ontology** locked:
    - [ ] Forest (#0C3024) → heritage assets
    - [ ] Copper (#C79F6B) → currency & yield only
    - [ ] Electric (#2061DE) → action & state
    - [ ] Hazard (#E8672E) → risk & warning
    - [ ] Critical (#FF3B30) → system-critical alert only
    - [ ] Confirm (#1FAA59) → settlement & success
    - [ ] Steel, Mist, Ink, Paper, Void → neutrals
  - [ ] **Typography** locked:
    - [ ] Outfit (display)
    - [ ] Inter (body)
    - [ ] Space Mono (data & metadata)
    - [ ] Playfair Display (italic narrative only)
  - [ ] **Spacing scale** locked (4px base):
    - [ ] 3xs: 4px, 2xs: 8px, xs: 12px, s: 16px, m: 24px, l: 32px, xl: 48px, 2xl: 64px, 3xl: 96px, 4xl: 128px
  - [ ] **Motion** locked:
    - [ ] ease-cinema (reveals, scroll-triggered)
    - [ ] ease-shutter (hard interruptions)
    - [ ] dur-instant: 120ms, dur-fast: 240ms, dur-cinema: 600ms, dur-commit: 3000ms
  - [ ] **Information Hierarchy (IL-1…IL-6)** locked:
    - [ ] IL-1: 700 weight, 1 opacity (Critical Decision)
    - [ ] IL-2: 500 weight, 1 opacity (Primary Metric)
    - [ ] IL-3: 400 weight, 0.85 opacity (Supporting Metric)
    - [ ] IL-4: 400 weight, 0.65 opacity (Context)
    - [ ] IL-5: 400 weight, 0.45 opacity (Metadata)
    - [ ] IL-6: 400 weight, 0.30 opacity (Audit)
  - [ ] **Density modes** defined:
    - [ ] Compact, Comfortable, Audit, Presentation
  - [ ] **Visual modes** defined:
    - [ ] Concrete (light), Obsidian (dark), Immersive (if used)
  - [ ] **Metric grammar** frozen:
    - [ ] Currency (copper)
    - [ ] Percentage (ink-inverse on void)
    - [ ] Ratio (steel)
    - [ ] Forecast (electric)
    - [ ] Risk (hazard)
    - [ ] Loss (critical)
  - Format: CSS variables (CSS file or JSON export)

---

## ✓ Configuration Artifacts

- [ ] **Token Package** (machine-readable export)
  - [ ] CSS custom properties file exported from design system
  - [ ] Versioned: v3.0, immutable, change-controlled
  - [ ] All values referenced by variable name (no literals in live files)
  - Format: CSS file (`:root { --gc-void: #0A0A0A; ... }`) or JSON

- [ ] **Vocabulary Linter Configuration**
  - [ ] ESLint rule or TypeScript rule defined
  - [ ] Forbidden terms list in config
  - [ ] CI integration planned (e.g., pre-commit hook, GitHub Actions)
  - Format: `.eslintrc.json` or custom rule file

- [ ] **Build System Initialized**
  - [ ] Next.js project created (`npx create-next-app@latest gc-app --typescript`)
  - [ ] `tsconfig.json` configured (strict mode on)
  - [ ] `.eslintrc.json` configured (includes vocabulary linter)
  - [ ] `package.json` script: `"lint:vocab"`
  - Format: Live repo structure

---

## ✓ Test & Verification

- [ ] **Sample Objects** (one per BO-01…12)
  - [ ] JSON fixtures created (realistic, edge cases included)
  - [ ] One error case per object (violates a rule)
  - Format: `fixtures/` folder in repo

- [ ] **Vocabulary Linter Test**
  - [ ] Linter correctly rejects a file containing "Room"
  - [ ] Linter correctly rejects a file containing "Customer"
  - [ ] Linter correctly rejects a file containing "Booking"
  - [ ] Linter correctly accepts a file with "Studio", "Guest", "Journey"
  - Format: Test files in `tests/`

- [ ] **Token Consumption Test**
  - [ ] A test page consumes the token package
  - [ ] No page contains a literal colour hex, radius, spacing value, or duration
  - [ ] Page builds without warnings
  - Format: throwaway demo page in `pages/demo/tokens.tsx`

---

## ✓ Exit Conditions (MUST PASS)

✓ **No field name carries two meanings** across all 12 object registries

✓ **Vocabulary linter blocks build** if forbidden term is found

✓ **Every invariant has an owning layer** and a named test (even if unimplemented)

✓ **A reviewer can answer "may this exist?"** for any proposed noun using only W1 artefacts

✓ **Token package is locked** (v3.0, no changes without constitutional amendment)

✓ **Two engineers independently model** the same business object and produce the same core field set

✓ **Constitution is signed off** by named authority (CTO, Founder, Board, whoever approves)

---

## ✓ Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Enterprise Architect** | | | |
| **Design Authority** | | | |
| **Compliance / Legal** | | | |

---

## Notes

- W1 is **origin** — it cites nothing, only intent.
- Every later wave (W2–W10) **quotes W1**; no later wave amends it without a constitutional amendment record.
- If not all checkboxes are ✓, Wave 1 is not **locked** — move nothing to code until they are.
- Assignments and due dates are tracked in `WAVE-1-DELIVERABLES.xlsx`.
