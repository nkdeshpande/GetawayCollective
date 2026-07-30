# Getaway Collective · The Periodic Build Plan
## Wave 1: Foundation Lock

**Status:** Starting Wave 1 build

**Project:** `C:\gc-app`

---

## Wave 1 Deliverables

| Document | Status | Location |
|----------|--------|----------|
| **WAVE-1-DELIVERABLES.xlsx** | Created | Tracking sheet (fill in Owner, Due) |
| **WAVE-1-GATE.md** | Created | Exit conditions checklist |
| **WAVE-INTAKE.md** | Created | Master intake document (all 10 waves) |

---

## Wave 1 Code Structure

```
C:\gc-app\
├── constants/
│   ├── tokens.ts              # Design system tokens (v3.0, immutable)
│   ├── business-objects.ts    # BO-01…BO-12 enumeration (closed set)
│   ├── vocabulary.ts          # Enterprise vocabulary (forbidden/approved)
│   └── invariants.ts          # Constitutional invariants (12 founding laws)
│
├── scripts/
│   └── vocab-lint.js          # CI linter (blocks forbidden terms)
│
├── package.json               # Dependencies & build scripts
├── tsconfig.json              # TypeScript strict mode
├── .eslintrc.json             # ESLint config
│
├── WAVE-1-DELIVERABLES.xlsx   # Status tracking (you fill this in)
├── WAVE-1-GATE.md             # Exit conditions (must all be ✓)
├── WAVE-INTAKE.md             # Master intake (all 10 waves)
└── README.md                  # This file
```

---

## What You Need to Provide (Wave 1)

Before we proceed to code, fill in the **WAVE-1-DELIVERABLES.xlsx** spreadsheet:

### Content & Copy (High Priority)
- [ ] **Enterprise Constitution** (L1 narrative)
- [ ] **Constitutional Thesis** (why GC exists)
- [ ] **Brand Constitution** (voice, promises)
- [ ] **Enterprise Vocabulary** (complete forbidden/approved list)

### Data & Schema
- [ ] **Founding Invariants** (add any custom beyond the 12 we defined)
- [ ] **Enterprise Policies** (privacy, security, accessibility, sustainability, ethics, luxury)

### Visual Assets
- [ ] **Token Package** (CSS or JSON export)

### Configuration & Test Data
- [ ] Sample objects (one per BO-01…12)
- [ ] Test that vocabulary linter works

---

## Next Steps

### 1. Review & Fill WAVE-1-DELIVERABLES.xlsx
- Assign owners to each deliverable
- Set due dates
- Add notes on what you already have

### 2. Create WAVE-1-GATE Checklist
- Run through all exit conditions
- Mark what's ready (✓) and what's TBD
- Get stakeholder sign-off (Arch, Design, Compliance)

### 3. Then → Wave 2
- Once W1 Gate is passed, we create Wave 2 deliverables
- Wave 2 builds: Business Object field registries, colour bindings, policy enforcement

---

## Project Principles

**Wave 1 is foundation lock.** Everything later depends on what we lock here.

- No moving pieces. Everything W1 produces is immutable except through constitutional amendment (documented, dated, approved).
- Constitution first. Technology is L11; we start with truth (L1).
- Purpose → Semantics → Execution. Not technology first.

**The 10 waves are:**
1. **Foundation Lock** (Constitution, Vocabulary, Tokens, Invariants)
2. **Semantic Core** (Business Objects, Colour Bindings, Field Registry)
3. **Graph & Lifecycle** (Relationships, State Machines, Provenance, DB)
4. **Primitive Surface** (Atoms, Design Tokens, Accessibility)
5. **Capability & Nervous System** (Commands, Events, API, Permissions)
6. **Composite Surface** (Organisms, Metrics, Projections, Services)
7. **Investor Workspaces** (WS-01…05)
8. **Enterprise Workspaces** (WS-06…10) — concurrent with W7
9. **Cognition** (Knowledge, Copilots, Search, AI)
10. **Sovereign Governance** (Evolution, Stewardship, Audit, Release)

---

## Running Vocabulary Linter

```bash
cd C:\gc-app

# Test the linter
npm run lint:vocab

# Should output:
# [vocab-lint] PASS: No forbidden terms found.
```

---

## Questions or Blockers?

Check WAVE-INTAKE.md for full context on each wave.

Ready to move forward when you've:
1. ✓ Reviewed WAVE-1-DELIVERABLES.xlsx
2. ✓ Assigned owners and due dates
3. ✓ Gathered the Constitution, Vocabulary, Policies, Tokens
4. ✓ Ready to tackle W1 Gate

Then we proceed to W2.

---

**Getaway Collective · 10-Wave Constitutional Build · Enterprise Architecture**

Version: 0.0.1 | Date: 30 Jul 2026 | Authority: Enterprise Constitution (L1)
