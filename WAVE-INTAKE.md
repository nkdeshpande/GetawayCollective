# Getaway Collective · Build Wave Intake Checklist

## Overview
This document specifies, for each of the 10 waves, what material must be provided **before** that wave's modules can be implemented. Organized by **Content**, **Data/Schema**, **Business Rules**, **Visual Assets**, **Configuration**, **Test Data**, and **Integrations**.

---

## WAVE 1: Foundation Lock
**Modules:** Ct, Tx, Tk, Iv (Constitution, Object Taxonomy, Token Core, Invariant Register)

**When to provide:** Before any code is written.

### Content & Copy
- [ ] **Enterprise Constitution** (L1 document)
  - Full immutable principles text (currently in `GC ALL LAYERS OF DATABASE`)
  - Non-negotiable values
  - Constitutional hierarchy
  - Constitutional laws
  
- [ ] **Constitutional Thesis** (currently in PRD Vol I)
  - What GC is
  - What GC is not
  - Three constitutional dimensions
  - Constitutional success / failure criteria

- [ ] **Brand Constitution** (L1 sub-doc)
  - Brand voice and tone
  - Brand promises
  - Brand prohibitions

- [ ] **Enterprise Vocabulary** (Tx)
  - Complete forbidden/replaced terms list (Room→Studio, Customer→Guest, Booking→Journey, Housekeeping→Studio Care, etc.)
  - Preferred terminology glossary (50–100 terms)
  - Context for each term (where it applies, why)

### Data & Schema
- [ ] **Business Object Taxonomy** (Tx) — the closed list
  - BO-01 Identity
  - BO-02 Organization
  - BO-03 Property
  - BO-04 Studio
  - BO-05 Investment Offering
  - BO-06 Investment
  - BO-07 Ownership
  - BO-08 Journey
  - BO-09 Experience
  - BO-10 Service
  - BO-11 Financial Ledger
  - BO-12 Knowledge

### Business Rules
- [ ] **Founding Invariants** (Iv)
  - Studio requires Property (and vice versa)
  - Ledger is append-only
  - Knowledge is immutable
  - Every capability publishes events
  - Every decision has provenance
  - [Any additional invariants specific to GC]
  - For each: owning layer, named test, enforcement mechanism

- [ ] **Enterprise Policies** (L1)
  - Privacy policy (summary for system design)
  - Security policy (summary)
  - Accessibility requirements (at least WCAG 2.1 AA)
  - Sustainability commitments
  - Ethics policy
  - Luxury standard definition

### Visual Assets
- [ ] **Design System**
  - `GC-DesignSystem-Canonical (2).html` (confirmed as v3.0)
  - Colour palette (hex, semantic binding)
  - Typography (Outfit, Inter, Space Mono, Playfair Display)
  - Spacing scale (4px base)
  - Radius (0px — confirm no exceptions)
  - Motion (ease-cinema, ease-shutter, durations)
  - Information hierarchy (IL-1…IL-6 with opacity and weight)
  - Density modes (compact, comfortable, audit, presentation)
  - Visual modes (Concrete, Obsidian, Immersive)
  - Metric grammar (currency, percentage, ratio, forecast, risk, loss)

### Configuration
- [ ] **Token Package** — machine-readable export
  - CSS custom properties file (or JSON)
  - One source, consumed by all layers (surface and API)
  - Versioned immutably (v3.0 locked)

- [ ] **Vocabulary Linter Configuration**
  - Forbidden terms list as ESLint / TypeScript rule
  - CI integration point (should fail build on violation)

### Test Data
- Not applicable for W1.

### Integrations
- Not applicable for W1.

---

## WAVE 2: Semantic Core
**Modules:** Vo, Bo, Cl, Fr, Pl (Vocabulary, Business Objects, Colour Ontology, Field Registry, Enterprise Policy)

**When to provide:** After W1 is locked. Before W3 begins.

### Content & Copy
- [ ] **Business Object Charters** — for each BO-01…BO-12
  - Constitutional mission (why this object exists)
  - Constitutional philosophy (what it represents in the enterprise)
  - Business definition (plain-English)
  - Object classification (entity type, lifecycle class)
  - Responsibilities (what it owns, what it delegates)
  - Examples (real data instances if possible)

- [ ] **Field Labels & Descriptions**
  - Human-readable label for every field
  - Help text (50–150 chars per field)
  - Validation messages (error copy for each field type)
  - Placeholder examples (if applicable)

- [ ] **Semantic Colour Mapping**
  - Forest → heritage/permanent assets, long-term holdings
  - Copper → currency, capital, revenue, yield only
  - Electric → action, state transition, admin
  - Hazard → risk, warning, volatility, covenant proximity
  - Critical → system-critical alert only (rarest colour)
  - Confirm → settlement, success
  - Steel/Mist/Ink → neutrals (from token package)

### Data & Schema
- [ ] **Canonical Field Registry** — structured data for all 12 objects
  - For each field:
    - Field name (system-safe, already-vocabulary-checked)
    - Type (string, number, date, enum, reference, etc.)
    - Unit (if numeric: currency, %, ratio, time, distance, etc.)
    - Nullability (required, optional, conditional)
    - Length / precision constraints
    - Validation rules (regex, range, set membership, cross-field)
    - Provenance class (observed, verified, modelled, forecast, estimated, pending)
    - Default value (if applicable)
    - Examples (real or realistic)

- [ ] **Object Relationships** (prepared for W3, but schema defined now)
  - Which objects own which (cardinality)
  - Which objects reference which (foreign key pattern)
  - Many-to-many mappings (if any)
  - Aggregate boundaries (which fields move together)

### Business Rules
- [ ] **Nullability Rules**
  - When is each field required?
  - When is it optional?
  - When is it conditionally required (e.g., "required if Investment.type=CapitalOnly")?

- [ ] **Validation Rules** (per field and cross-field)
  - Email format
  - Phone number format (region-specific)
  - Date ranges (must be after, before, within X years, etc.)
  - Enum values (closed list with display text)
  - Numeric ranges (min, max, precision)
  - String length (min, max)
  - Cross-field constraints (if X then Y is required; if A > B then error)
  - Regex patterns (for PAN, Aadhaar, etc. if international)

- [ ] **Provenance Rules**
  - When does a field become "verified" from "observed"?
  - Who may change a "verified" field? (Only the source system? Only admins?)
  - When does "forecast" become "observed"? (After the fact occurs)
  - Can a "modelled" value ever be overwritten by "forecast"? (Yes/no rule)

- [ ] **Enterprise Policy Enforcement Rules**
  - Privacy: which fields are PII? Which are sensitive? Retention periods?
  - Security: which fields require encryption at rest? Encryption in flight?
  - Accessibility: any field requiring alt-text or expanded copy?
  - Sustainability: any data about environmental impact (energy, carbon, water)?

### Visual Assets
- [ ] **Colour Bindings** (semantic mapping)
  - Asset class → forest (property, studio, ownership)
  - Capital → copper (investment, ledger, yield)
  - Action → electric (approval, transition, admin)
  - Risk → hazard (ADR volatility, covenant breach proximity)
  - System alert → critical (rarest; used nowhere else)
  - Examples of each in context

- [ ] **Typographic Scale & Usage**
  - H1–H6 scale (sizes, weights, line-heights)
  - Body text (paragraph, list, caption sizes)
  - Mono (for code, data, metadata)
  - Editorial (italic only; when used)
  - Letter-spacing rules
  - Line-height rules
  - When each role is used (examples in context)

### Configuration
- [ ] **Linter Configuration** — add policy checks
  - Vocabulary lint rule (from W1)
  - Type validation for numeric fields (must not accept "10" as a number if they see a string)
  - Provenance class enforcement (only approved classes allowed)

### Test Data
- [ ] **Sample Objects** — one realistic instance per BO-01…BO-12
  - Use real or realistic values
  - Include edge cases (optional fields left null, min/max numeric values, etc.)
  - Include one error case per object (violates a validation rule)

### Integrations
- Not applicable for W2.

---

## WAVE 3: Graph & Lifecycle
**Modules:** Rl, Sm, Ty, Pr, Db, Ad (Relationships, State Machines, Type Matrix, Provenance, Database, Decisions)

**When to provide:** After W2 is locked. Before W4 begins.

### Content & Copy
- [ ] **Relationship Constitution** (BO-REL-01…12) — for each object pair
  - Narrative description: why this relationship exists
  - Legal cardinality (1:1, 1:N, N:M)
  - Owns vs. References distinction (ownership implies deletion cascade; reference is a link)
  - Lifecycle rule (can the relationship change? When? Who? Why?)
  - Example instances

- [ ] **State Machine Descriptions**
  - For objects with lifecycle (Identity, Journey, Investment, Ownership, Experience, Service):
    - Narrative description of the object's states
    - Reason for each state
    - What triggers each transition
    - What side effects occur (events, cascades, etc.)

- [ ] **Architectural Decision Records** (ADR)
  - For every W1–W3 structural choice:
    - Decision title
    - Context (why was this choice needed?)
    - Options considered
    - Decision made (and why)
    - Consequences (downstream cost)
    - Date and author

### Data & Schema
- [ ] **Relationship Matrix** — structured
  - Source object | Target object | Cardinality | Type (owns/refs/creates/etc.) | Cascade delete? | Constraints

- [ ] **State Machine Definitions** — structured
  - Object name | State | Possible transitions | Guard conditions (who can trigger, when) | Events emitted

- [ ] **Object Lifecycle Diagrams**
  - Visual or text representation of state flow
  - Terminal states (identity complete, journey settled, investment exited, etc.)
  - Reversible vs. irreversible transitions (append-only rule check)

- [ ] **Provenance Spine Schema**
  - Every stored value carries: `{value, confidence: (observed|verified|modelled|forecast|estimated|pending), observedAt, verifiedAt, source, observer}`
  - Schema for storing confidence class

### Business Rules
- [ ] **Relationship Rules**
  - Studio cannot exist without Property (and vice versa)
  - Investment cannot exist without Investment Offering
  - Ownership requires Investment
  - Journey belongs to (is owned by) Identity
  - Service requires Experience context
  - Knowledge is immutable (no update, only new version)
  - Ledger is append-only (no delete, no update)
  - [Any custom rules from enterprise policy]

- [ ] **Transition Guards**
  - Investment state machine:
    - Offered → Reserved (who? investor + property owner approval?)
    - Reserved → Invested (who? investor + compliance clearance?)
    - Invested → Settled (who? platform admin + payment confirmed?)
    - Settled → Exited (who? investor request + property ready?)
    - [Full state + guard for each object with lifecycle]

- [ ] **Cascade Rules**
  - If Property is deleted, do all Studios delete? (Probably yes)
  - If Organization is deleted, do all Identities within it delete? (Probably no — they transfer or orphan)
  - If Investment is deleted, do all Ownerships delete? (Probably yes)
  - [Explicit rule for each owns relationship]

- [ ] **Append-Only & Immutability Rules**
  - Which objects or fields are immutable? (Knowledge, Decision, Ledger entries)
  - If immutable, what is the versioning strategy? (Create a new record with version #?)
  - If Ledger is append-only, what does an edit actually do? (Post an offsetting entry?)

### Visual Assets
- [ ] **Type Matrix Visual**
  - Demonstrate each type role (display, body, mono, editorial) in context
  - Show scale hierarchy (H1–H6 sizes)
  - Show mono usage (code, data labels, metadata)
  - Show editorial usage (italic narrative callouts)

### Configuration
- [ ] **State Machine Validator**
  - Code (TypeScript enums?) for each state machine
  - Validation that only legal transitions are allowed
  - Guard function signatures (can-transition(currentState, targetState, context) → boolean)

- [ ] **Database Schema**
  - SQL DDL or Prisma/TypeORM schema definition
  - Foreign keys for all relationships
  - Cascade delete rules encoded
  - Columns for provenance (confidence, observedAt, verifiedAt, source)
  - Indexes for frequently-queried relationships

- [ ] **Linter Configuration** — add structural checks
  - No orphan objects (every object has a path to a root)
  - No undeclared relationships
  - Vocabulary lint + type lint + provenance lint

### Test Data
- [ ] **Edge Case Instances**
  - Object with all optional fields null
  - Object with all required fields filled
  - Relationship instances (both directions)
  - State machine instance (in each state)
  - Immutable object (confirm it rejects updates)
  - Append-only ledger (confirm it rejects deletes)

- [ ] **Transition Test Cases**
  - Legal transition (should succeed)
  - Illegal transition (should fail with reason)
  - Guard-blocked transition (should fail with reason)
  - Cascading delete (confirm child objects deleted or orphaned correctly)

### Integrations
- Not applicable for W3.

---

## WAVE 4: Primitive Surface
**Modules:** Dc, En, Lc, At, Vl, Ax (Design Constitution, Enumerations, Lifecycle Guards, Atoms, Validation, Accessibility)

**When to provide:** After W3 is locked. Before W5 begins.

### Content & Copy
- [ ] **Design Constitution** — full narrative
  - Visual silence principle (what is it, why, examples)
  - Information hierarchy IL-1…IL-6 (what each level communicates)
  - Zero radius philosophy (no rounded corners, ever)
  - Hairline discipline (stroke width and opacity rules)
  - Circles permitted only for status LEDs and Trinity Lens (confirm or customize)

- [ ] **Enumeration Display Text**
  - For every enum in the schema (e.g., Investment.status: [Offered, Reserved, Invested, Settled, Exited])
    - Enum value (Offered)
    - Display label (Offer Pending)
    - Description (50 chars)
    - Icon/symbol (if used)
    - Colour (mapped to semantic: electric, hazard, confirm, etc.)
    - Accessibility label (screen reader text if different)

- [ ] **Validation & Error Messaging**
  - For every validation rule:
    - Rule (e.g., "email must match RFC 5322")
    - Error message (user-friendly: "Enter a valid email address")
    - Help text (preventive: "E.g., you@domain.com")
    - Accessibility text (screen reader: "email field error: enter a valid email address")

### Data & Schema
- [ ] **Enumeration Set** (structured)
  - Object.field: [value, label, description, color, icon]
  - For all enums across all objects

- [ ] **Atom Specifications** (structured)
  - Atom name (Button, Input, Toggle, etc.)
  - Variants (primary, secondary, danger, disabled)
  - States (default, hover, focus, active, disabled)
  - Sizes (if applicable)
  - Content (label, icon, etc.)
  - Token references (no literals)

### Business Rules
- [ ] **Lifecycle Guard Rules**
  - If Journey.status = Completed, disable editing Journey.startDate
  - If Investment.status ≠ Invested, hide Performance dashboard
  - If Studio.status = Maintenance, show "Unavailable" overlay
  - [For each state that restricts editing or visibility]

- [ ] **Accessibility Requirements**
  - Minimum colour contrast (WCAG AA: 4.5:1 for text, 3:1 for UI components)
  - Focus indicators (visible, 2px outline, offset 2px)
  - Keyboard navigation (tab order, arrow keys for lists/menus, Enter to confirm)
  - Screen reader text (alt text for images, aria-labels for icons, ARIA live regions for updates)
  - Reduced motion (no animation if `prefers-reduced-motion: reduce`)
  - Form labels (associated <label> elements, not placeholders alone)

- [ ] **Validation Constraints** (per field)
  - Required fields (and under what conditions)
  - Min/max length for strings
  - Min/max for numbers
  - Allowed enum values
  - Pattern (regex) for special formats
  - Cross-field constraints (if one field is X, then another must be Y)

### Visual Assets
- [ ] **Atom Library** — visual mockups or Figma file
  - Button (variants: primary, secondary, danger; states: default, hover, focus, active, disabled)
  - Input (text, number, email, tel, date, time, etc.; states: empty, filled, error, disabled, readonly)
  - Textarea
  - Toggle / Checkbox / Radio
  - Dropdown / Select
  - Card
  - Badge / Chip
  - Alert / Toast
  - Progress bar
  - Spinner / Loader
  - Tooltip
  - Modal / Dialog
  - [Any other atoms your design system defines]

- [ ] **Enumeration Visual Guide**
  - Each enum value shown with its colour, icon, and label
  - In context (e.g., Investment statuses in a list)

- [ ] **Information Hierarchy Guide**
  - IL-1 (Critical Decision): H1, 700 weight, 1 opacity, example usage
  - IL-2 (Primary Metric): H2, 500 weight, 1 opacity, example usage
  - IL-3 (Supporting Metric): body, 400 weight, 0.85 opacity, example usage
  - IL-4 (Context): small, 400 weight, 0.65 opacity, example usage
  - IL-5 (Metadata): xsmall, 400 weight, 0.45 opacity, example usage
  - IL-6 (Audit): xsmall mono, 400 weight, 0.30 opacity, example usage

- [ ] **Accessibility Audit** (Figma or documented checklist)
  - Colour contrast measured (verify 4.5:1 for text on all surfaces)
  - Focus states visible in all designs
  - Keyboard indicators present

### Configuration
- [ ] **Token Usage Rules**
  - "No component may declare a colour, radius, spacing or duration literal"
  - All values must come from the token package
  - Build fails if a literal is found

- [ ] **Accessibility Checker**
  - Lighthouse integration (CI check for AA)
  - Axe DevTools rule set configured

- [ ] **Component Library** (code)
  - React components for each atom
  - Props interface for variants and states
  - Zero-CSS shadow DOM or styled-components/Tailwind (consuming tokens)
  - Storybook or equivalent for development

### Test Data
- [ ] **Atom Test Cases**
  - Each atom in each variant and state
  - Error state with validation message
  - Disabled state (not interactive)
  - Focus state (keyboard navigation)
  - Reduced motion (no animation)

- [ ] **Enumeration Test Cases**
  - Each enum value rendered (button, badge, status pill, etc.)
  - Colour contrast verified for each
  - Screen reader text tested

### Integrations
- Not applicable for W4.

---

## WAVE 5: Capability & Nervous System
**Modules:** Cm, Cp, Jy, Ml, De, Ap, Rt, Pm (Commands, Capabilities, Journeys, Molecules, Events, API, Runtime, Permissions)

**When to provide:** After W4 is locked. Before W6 begins.

### Content & Copy
- [ ] **Capability Charters** (E02 — Business Capabilities)
  - For each major capability (Create Investor, Approve Investment, Settle Investment, Generate Report, etc.):
    - Capability name
    - Mission (why this capability exists)
    - Responsibilities (what it does, what it does not)
    - Who uses it (roles)
    - Frequency (how often is it used?)
    - Examples (real use cases)

- [ ] **Command Descriptions**
  - For each command (e.g., `CreateInvestor`, `ApproveInvestment`, `SettleInvestment`):
    - Command name (verb + noun, imperative)
    - Preconditions (what must be true before this command runs?)
    - Inputs (what does the command accept?)
    - Output (what does it return?)
    - Side effects (what state changes, what events are emitted?)
    - Failures (what can go wrong? What is the error message?)
    - Idempotency (if run twice with same input, is it safe? Yes/no, and rule)

- [ ] **Journey Descriptions** (E04 — Enterprise Journeys)
  - Investor Accreditation Journey (eligibility → identity → address → tax residency → AML → accreditation → suitability → source of funds → risk profile → decision → passport issued → annual review)
  - Investment Journey (discover → comparison → reservation → investment → documents → agreements → payments → completion → settlement)
  - [Other named, multi-step user journeys]

- [ ] **API Documentation Outline**
  - REST or GraphQL? (choose one)
  - Authentication method (OAuth 2.0, API key, session, etc.)
  - Base URL pattern (e.g., `https://api.getawayc.co/v1`)
  - Error response format (JSON shape)
  - Rate limiting policy (requests per second/minute)
  - Pagination strategy (offset/limit, cursor, page number)
  - Versioning strategy (URL path /v1, /v2 or header-based)

- [ ] **Permission Descriptions**
  - Roles (Investor, Owner, Admin, Operator, Auditor, etc.)
  - For each role, what commands can it invoke?
  - For each command, who can invoke it? (deny by default)
  - Examples: "Only an Investor with status=Accredited can invoke PlaceInvestment"

### Data & Schema
- [ ] **Command Schema** (structured)
  - Command name
  - Inputs (field name, type, required, validation)
  - Output (field name, type, description)
  - Preconditions (state checks, permission checks)
  - Postconditions (state changes)
  - Events emitted (one or more)

- [ ] **Event Schema** (structured)
  - Event type (InvestorCreated, InvestmentApproved, InvestmentSettled, etc.)
  - Triggered by (which command)
  - Payload (field name, type, description)
  - Timestamp (auto-generated)
  - Source system (which capability / service emitted this)

- [ ] **Journey State Machine** (structured)
  - Journey name
  - States (array)
  - Transitions (fromState, toState, trigger, condition)
  - Terminal states (journey complete)
  - Resume paths (can the journey restart if abandoned?)

- [ ] **Permission Matrix** (structured)
  - Role | Command | Allow? | Condition (if conditional)
  - All rows populated (deny any missing combination)

### Business Rules
- [ ] **Command Rules**
  - Idempotency: if `CreateInvestor(email="x@y.com")` is sent twice, does it error? Create two records? Silently succeed?
  - Atomicity: if a command has 3 side effects and #2 fails, does #1 roll back? (Usually: yes, transactions)
  - Ordering: can commands arrive out of order? If Investment arrives before Investor, what happens? (Usually: error, or buffer and retry)

- [ ] **Event Rules**
  - Every command must emit at least one event
  - Events are immutable (no deleting or editing events)
  - Events carry full context (not just "something changed"; but "Investment state changed from Reserved to Invested with timestamp T")
  - Event schema is stable (backward compatible, versioned if changed)

- [ ] **Journey Rules**
  - A journey has entry conditions (who may start it?)
  - A journey has exit conditions (what must be true to complete it?)
  - A journey may have resume logic (if paused, can it resume? From which step?)
  - Concurrent journeys (can an Investor have multiple active Investment journeys? Probably yes. Can one Investment have two parallel journeys? Probably no.)

- [ ] **API Rules**
  - All updates go through commands, never direct mutations
  - All reads are through projections (materialized views), never direct schema queries
  - No side effects during reads (read-only operations)
  - Errors include a code and a human message ("investment.status.invalid" + "Investment is not in Reserved state; cannot accept at this time")

- [ ] **Permission Rules**
  - Deny by default (unlisted combinations always error)
  - Admin cannot bypass business rules (approval gates still apply even to admin)
  - Conditions are checked server-side (client-side permission hiding is UX, not security)
  - Permission checks happen at the command layer, below the UI

### Visual Assets
- [ ] **Molecule Library** — visual mockups
  - Molecule name, example components, visual representation
  - Examples: Form field (label + input + error message), Card header (title + icon + action), List item (avatar + name + status + action), etc.

- [ ] **Journey Diagrams**
  - Investor Accreditation: visual flowchart (15-step journey with branch for failures)
  - Investment: visual flowchart (discovery → comparison → reservation → investment → completion)

### Configuration
- [ ] **Command Handler Stubs** (TypeScript)
  - Skeleton for each command (interface, precondition checks, event emission)
  - Example: 
    ```typescript
    export async function handleCreateInvestor(cmd: CreateInvestor): Promise<InvestorCreated> {
      // Preconditions
      if (await investorExists(cmd.email)) throw error("investor.email.exists");
      
      // Execute
      const investor = new Investor(cmd);
      await db.save(investor);
      
      // Emit event
      const event = new InvestorCreated(investor);
      await eventBus.publish(event);
      
      // Return
      return event;
    }
    ```

- [ ] **Event Handler Stubs** (TypeScript)
  - Skeleton for each event consumer (projections, notifications, etc.)
  - Example:
    ```typescript
    eventBus.subscribe("InvestorCreated", async (event: InvestorCreated) => {
      // Update read model
      await investorProjection.insert(event);
      // Send email
      await sendWelcomeEmail(event.investorId);
    });
    ```

- [ ] **Permission Checker** (code)
  - Function: `canInvoke(role: Role, command: CommandType): boolean`
  - Lookup from permission matrix
  - Integrated into API middleware

- [ ] **API Route Templates** (Next.js / Express)
  - POST `/api/v1/investors` → invoke CreateInvestor command
  - GET `/api/v1/investors/{id}` → read from investor projection
  - POST `/api/v1/investments/{id}/approve` → invoke ApproveInvestment command
  - [For each command and major read]

### Test Data
- [ ] **Command Test Cases**
  - Happy path (command succeeds, event emitted, state changed)
  - Precondition failure (investor already exists, investment not in Reserved state, etc.)
  - Idempotency (send same command twice, verify safe behavior)
  - Invalid input (bad email, negative amount, etc.)

- [ ] **Event Replay Test**
  - Emit a series of events in order
  - Verify state reconstructed correctly
  - Verify order matters (events out of order cause errors or are handled correctly)

- [ ] **Journey Test Cases**
  - Start, progress through states, reach terminal state
  - Try illegal transition (e.g., jump from step 3 to step 1)
  - Try to resume from halfway point
  - Concurrent journeys (if applicable)

- [ ] **Permission Test Cases**
  - Admin can invoke command X (confirm)
  - Investor cannot invoke command X (confirm)
  - Owner can invoke command Y (confirm)
  - Role without permission invokes command (confirm error)

### Integrations
- [ ] **Event Bus**
  - Technology choice (Kafka, Redis Streams, database polling, etc.)
  - Connection details / configuration
  - Serialization format (JSON)
  - Durability guarantees (events must never be lost)

- [ ] **Database** (if separate from W3)
  - Connection string pattern
  - Credentials (environment variables, not hardcoded)
  - Read replicas (if applicable)

---

## WAVE 6: Composite Surface
**Modules:** Fo, Gm, Sc, Og, Sg, Es, Ts (Financial Objects, Graph, Services, Organisms, Signals, Event Spine, Tests)

**When to provide:** After W5 is locked. Before W7 and W8 begin.

### Content & Copy
- [ ] **Financial Object Descriptions**
  - Currency (price, revenue, cash, NPV, debt) — rendered in copper (`#C79F6B`)
  - Percentage (occupancy, IRR, yield) — rendered in ink-inverse on void surfaces
  - Ratio (multiples, LTV, DSCR) — rendered in steel
  - Forecast (modeled figures) — rendered in electric
  - Risk (ADR volatility, covenant proximity) — rendered in hazard
  - Loss (negative delta, impairment) — rendered in critical
  - Examples of each in context (a property card, an investment summary, a financial dashboard)

- [ ] **Organism Descriptions**
  - Property card (what fields, in what order, with what visual hierarchy)
  - Investment card (same)
  - Identity card (same)
  - Journey status card (with timeline)
  - Financial summary card (with metric grammar)
  - Approval card (with CTA buttons and state indicators)
  - [For each organism your design system defines]

- [ ] **Service Contract Descriptions**
  - "Investment service provides pricing and availability"
  - "Payment service accepts CreatePayment, returns PaymentConfirmed event"
  - [For each service-to-service contract]

- [ ] **Telemetry Descriptions**
  - "Button click on 'Place Investment' emitted as SignalUserAction"
  - "Investment state change emitted as SignalInvestmentStateChanged"
  - "Page load time collected as SignalPagePerformance"
  - [For each signal/telemetry point]

### Data & Schema
- [ ] **Financial Object Schema** (structured)
  - Object name (Currency, Percentage, etc.)
  - Semantic colour
  - Numeric constraints (precision, min, max)
  - Display format (currency symbol, percentage sign, number of decimals, thousands separator)
  - Confidence class handling (forecast vs. observed shown differently)

- [ ] **Projection Schema** (read models)
  - For each major UI view (investor dashboard, property page, investment summary):
    - Query parameters (filters, sorting, pagination)
    - Return schema (what fields, in what shape)
    - Materialization logic (computed from events, commands)
    - Refresh frequency (real-time, hourly, daily)

- [ ] **Service Contract Schema** (structured)
  - Service name
  - Capabilities exposed (list of commands)
  - Events published (list of events)
  - SLAs (response time, availability)
  - Versioning (how to evolve this contract)

- [ ] **Telemetry Schema** (structured)
  - Signal type (UserAction, StateChange, Performance, Error)
  - Payload fields
  - Cardinality (can be emitted 0–many times? Exactly once per transaction?)
  - Retention (how long to keep telemetry)

### Business Rules
- [ ] **Metric Grammar Rules**
  - Currency is never displayed without a symbol
  - Percentage is never displayed without a symbol
  - Forecast is always visually distinguished from observed (colour, stroke, opacity)
  - Risk is never displayed in the same colour as any other metric
  - Loss is the rarest colour and only used for negative outcomes

- [ ] **Density & Mode Rules**
  - Compact mode: 12px type, 8px spacing (for power users)
  - Comfortable mode: 15px type, 16px spacing (default)
  - Audit mode: 13px mono, 8px spacing, full grid (for data entry)
  - Presentation mode: 18px type, 24px spacing (for slides, reports)
  - All organisms render in all modes without layout break

- [ ] **Service Boundaries**
  - Investment service cannot call Payment service directly (only through commands and events)
  - Property service is read-only to external callers (no commands except internal)
  - [For each service]

- [ ] **Telemetry Rules**
  - Telemetry never blocks business logic (always async/fire-and-forget)
  - Telemetry is privacy-respecting (no PII, no sensitive data)
  - Telemetry is permission-checked (sensitive actions flagged as "AdminAction" or "AuditEvent")

### Visual Assets
- [ ] **Organism Library** — visual mockups or Figma file
  - Property card (bed, bath, location, price range, availability, action buttons)
  - Investment card (property, term, offered price, status, yield, action buttons)
  - Identity card (name, email, phone, verification status, action buttons)
  - Journey timeline (steps, current step, completion %, next action)
  - Financial summary (total invested, total yield, balance, distributions, chart)
  - Approval card (item under review, approval count, status, approve/reject buttons)

- [ ] **Density Mode Demonstrations**
  - Same organism rendered in 4 modes (compact, comfortable, audit, presentation)
  - Confirm zero layout breaks

- [ ] **Metric Grammar Color Guide**
  - Each metric type with its colour, symbol, example value
  - In multiple contexts (card, table, chart, gauge)

- [ ] **Graph Visualization** (if applicable)
  - Entity relationship diagram (all objects and their relationships)
  - Ownership tree (Property → Studios → Inventory)
  - Investment flow (Offering → Investment → Ownership → Distributions)

### Configuration
- [ ] **Metric Formatter** (code)
  - Function: `formatCurrency(amount, currency="USD")` → "$1,234,567"
  - Function: `formatPercentage(ratio)` → "45.2%"
  - Function: `formatRatio(num, denom)` → "2.1x"
  - Applied universally in all views

- [ ] **Projection Query Builders** (code)
  - TypeORM/Prisma queries for each read model
  - Indexed for performance
  - Example: `async function getInvestorDashboard(investorId): Promise<DashboardView>`

- [ ] **Service Client Stubs** (code)
  - For each external service (Payment, Notification, etc.)
  - Interface and mock implementation
  - Error handling (retry logic, fallback)

- [ ] **Telemetry Client** (code)
  - Function: `emitSignal(type, payload)` → sends to telemetry backend
  - Batches signals for efficiency
  - Respects reduced-motion and privacy settings

- [ ] **Test Coverage Gates** (CI configuration)
  - Unit test coverage: ≥80%
  - Integration test coverage: ≥60%
  - E2E test coverage: critical paths only
  - Coverage must increase or stay flat (cannot decrease)

### Test Data
- [ ] **Projection Test Cases**
  - Query returns correct shape
  - Filtering works (by status, date range, etc.)
  - Sorting works (by amount, date, name)
  - Pagination works (offset/limit or cursor)
  - Empty result set handled

- [ ] **Service Contract Test Cases**
  - Service A can call Service B
  - Response matches contract
  - Error response is correct shape
  - Timeout is handled (retry or fail gracefully)

- [ ] **Telemetry Test Cases**
  - Signal emitted on user action
  - Signal payload is correct
  - Telemetry client doesn't block business logic
  - Sensitive data is excluded

- [ ] **Financial Object Test Cases**
  - Currency formatted correctly (symbol, decimals, thousands separator)
  - Percentage formatted correctly (symbol, no false precision)
  - Ratio formatted correctly (meaningful precision, not 127 decimal places)
  - Forecast vs. observed visually distinct

### Integrations
- [ ] **Analytics / Telemetry Backend**
  - Endpoint to send telemetry
  - Authentication (API key)
  - Expected payload format
  - Retention and deletion policy

- [ ] **Payment Service** (if external)
  - API endpoint
  - Authentication
  - CreatePayment request/response schema
  - Error codes and meanings

---

## WAVE 7 & 8: Workspaces
**Modules (W7):** Pp, As, Cx, Rd, Ed, Er (Passport, Assemblies, Context, Read Models, Edge, Errors)
**Modules (W8):** Aw, Au, Gj, Sh, Nt, Ob, Rk (Approvals, Automation, Guest Journey, Shell, Notifications, Observability, Risk)

**When to provide:** After W6 is locked. W7 and W8 are concurrent and must not cross-consume.

### W7: Investor Workspaces
- [ ] **Investor Passport Stages** (full charter)
  - Stage 1: Discover (who qualifies?)
  - Stage 2: Eligibility Check (automated or manual?)
  - Stage 3: Create Investor Profile (fields)
  - Stage 4: Identity Verification (document types accepted, liveness check?)
  - Stage 5: Address Verification (documents, methods)
  - Stage 6: Tax Residency (countries supported, form variations)
  - Stage 7: AML / Sanctions Screening (provider, SLA)
  - Stage 8: Accreditation Assessment (logic, thresholds)
  - Stage 9: Financial Suitability (questionnaire, scoring)
  - Stage 10: Source of Funds / Wealth (thresholds per geography)
  - Stage 11: Document Verification (which docs required)
  - Stage 12: Risk Profiling (questionnaire)
  - Stage 13: Compliance Review (automated checks, manual review)
  - Stage 14: Accreditation Decision (approval/rejection logic)
  - Stage 15: Passport Issued (what does passport contain?)
  - Stage 16: Annual Review (frequency, triggers)

- [ ] **WS-01 through WS-05 Layouts**
  - WS-01 Investment Hub: navigation, featured properties, search, filters, sorting, pagination
  - WS-02 Investor Workspace: profile, portfolio, activity, messages, settings
  - WS-03 Investment Journey: timeline, status, documents, approvals, next steps
  - WS-04 Portfolio: holdings, performance, distributions, tax centre, exit opportunities
  - WS-05 Property (Investor View): property detail, market, performance, future plans, contact

- [ ] **Context Graph Rules**
  - What is the user looking at? (which property, which investment?)
  - How to carry context across navigation?
  - When to reset context (navigation away vs. sidebar jump)?

- [ ] **Error Catalog for W7**
  - "investor.email.duplicate" → "An account with this email already exists. Sign in or use a different email."
  - "investment.status.invalid" → "This investment cannot be accepted at this time. Please check the status."
  - [For each error scenario]

### W8: Enterprise Workspaces
- [ ] **WS-06 through WS-10 Layouts**
  - WS-06 Service & Experience: command center, guest board, service requests, housekeeping tasks, dining, wellness, transport, incident log
  - WS-07 Capital: financial dashboard, general ledger, treasury, payments, receivables, payables, distributions, budgets, forecasting, reconciliation
  - WS-08 Governance: policy centre, risk register, control library, compliance, audit, corporate actions, legal, security
  - WS-09 Platform: command centre, identity & access, workspace registry, integration hub, automation studio, AI studio, event spine, observability
  - WS-10 Knowledge: knowledge hub, enterprise search, decision records, playbooks, standards, research, learning

- [ ] **Approval Workflows**
  - Investment approval: who approves? What triggers auto-approval? What requires escalation?
  - Studio maintenance: who approves downtime? How long? Cost?
  - [For each approval type]

- [ ] **Automation Rules**
  - Daily: reconcile ledger
  - Monthly: calculate and accrue distributions
  - Quarterly: prepare financial reports
  - Annually: tax reporting
  - On-demand: export data, send notifications
  - [For each automated process]

- [ ] **Guest Journey Rules**
  - Guest sees: property, booking, checkin, stay, checkout, checkout
  - Guest does not see: operations, capital, governance, platform
  - Staff sees: everything (filtered by role)
  - Separation is enforced at the application shell level

- [ ] **Error Catalog for W8**
  - "ledger.reconciliation.failed" → "Balance mismatch detected. Review reconciliation details."
  - "approval.permission.denied" → "You don't have permission to approve this item."
  - [For each error scenario]

### Content & Copy (both waves)
- [ ] **Workspace Introductions** (micro-copy)
  - Purpose statement for each workspace (one sentence)
  - Primary CTA (what should the user do first?)
  - Quick tips or guided tour (if applicable)

- [ ] **Success & Error Messages**
  - "Investment placed successfully. Confirmation email sent."
  - "Investment approval workflow initiated."
  - "Reconciliation complete: zero variance."
  - [For each major action]

### Data & Schema (both waves)
- [ ] **View Specifications** (structured)
  - For each page/screen in each workspace:
    - View name
    - Query parameters (filters, sorting, pagination)
    - Returned data shape
    - Materialization logic
    - Access control (who can see)

- [ ] **Navigation Structure** (per workspace)
  - Primary menu items
  - Breadcrumb logic
  - Sidebar navigation (if applicable)
  - Workspace switching (how to navigate between workspaces)

### Business Rules (both waves)
- [ ] **Workflow Rules** (approvals, automations)
  - Conditions for auto-approval vs. manual review
  - Escalation triggers
  - SLA for manual review (how long before escalate?)
  - Rejection logic (can be re-submitted? Changes required?)

- [ ] **Data Access Rules**
  - Investor can see only their own investments
  - Owner can see all investments in their property
  - Admin can see all investments
  - Auditor can see all and audit logs
  - [For each entity and role]

- [ ] **Notification Rules**
  - When investment is placed: notify owner + compliance team
  - When investment is approved: notify investor
  - When approval is overdue: notify compliance manager
  - [For each notification trigger]

### Visual Assets (both waves)
- [ ] **Workspace Mockups** (Figma or high-fidelity)
  - Each workspace's primary page
  - Key flows (investment placement, approval workflow, property management)
  - Empty states (no investments, no messages, etc.)
  - Error states (form errors, network errors, permission denied)
  - Loading states (skeleton screens, spinners)

- [ ] **Approval Workflow Diagrams**
  - Visual flow: item under review → pending approval → approved/rejected → archive
  - Conditional branches (auto-approve vs. manual)

- [ ] **Automation Timeline** (if applicable)
  - Daily reconciliation at 23:00 UTC
  - Monthly distribution accrual on 1st of month
  - [For each scheduled process]

### Configuration (both waves)
- [ ] **Page Route Map** (Next.js pages)
  - `/investor/investments` → WS-03 Investment Journey
  - `/investor/portfolio` → WS-04 Portfolio
  - `/operations/guests` → WS-06 Guest Board
  - `/capital/ledger` → WS-07 General Ledger
  - `/governance/risks` → WS-08 Risk Register
  - [For each workspace and page]

- [ ] **Middleware & Auth**
  - Who can access which workspaces?
  - Role-based access control (RBAC) checks
  - Redirect if unauthorized (to login, to dashboard, or to error page?)

- [ ] **Notification Triggers** (code)
  - For each event (InvestmentPlaced, ApprovalCompleted, etc.):
    - Who should be notified?
    - Via what channel (email, SMS, in-app)?
    - Template for message
    - When to send (immediately, batched, scheduled?)

### Test Data (both waves)
- [ ] **Workspace Test Cases**
  - Happy path (navigate, view data, perform action, see success)
  - Unauthorized access (try to access workspace without permission)
  - Empty state (workspace with no data)
  - Error state (network error, validation error)
  - Edge case (very large dataset, very long names, special characters)

- [ ] **Approval Workflow Test Cases**
  - Auto-approval (condition met, approved automatically)
  - Manual approval (requires review)
  - Rejection (reviewer rejects, reason provided)
  - Escalation (overdue, escalated to manager)

- [ ] **Automation Test Cases**
  - Job runs at scheduled time
  - Job handles errors gracefully (retry, log, notify)
  - Job does not run twice for same trigger
  - Job can be manually triggered (admin action)

### Integrations (both waves)
- [ ] **Email Service**
  - SMTP server or email API (SendGrid, AWS SES, etc.)
  - Sender address
  - Template management (HTML templates for each notification type)

- [ ] **SMS Service** (if applicable)
  - Provider (Twilio, AWS SNS, etc.)
  - Recipient phone number format
  - Message template

- [ ] **Reporting / Export**
  - Export format (CSV, Excel, PDF?)
  - Data included (fields, filters)
  - Frequency (on-demand, scheduled?)

---

## WAVE 9: Cognition
**Modules:** Kn, Gq, Oc, Cv, Co, Ix, Qa (Knowledge, Graph Queries, Operating Cycle, AI Canvas, Copilots, Index, Assurance)

**When to provide:** After both W7 and W8 are at exit conditions. Before W10.

### Content & Copy
- [ ] **Copilot Personas** (per workspace)
  - Investment Copilot (helps investors understand properties, compare investments, answer FAQ)
  - Operations Copilot (helps staff manage guest experience, respond to requests)
  - Capital Copilot (helps finance team with forecasting, reconciliation, reporting)
  - Governance Copilot (helps compliance team with risk monitoring, audit, reporting)
  - [For each workspace-specific copilot]

- [ ] **Copilot Capabilities** (per persona)
  - What can the copilot do? (examples: "Explain this property's ROI", "Find similar properties", "Draft an email to this investor")
  - What can it not do? (examples: "It cannot approve investments, only recommend")
  - Confidence levels: when to say "I'm confident" vs. "I'm uncertain"

- [ ] **Knowledge Base Content**
  - FAQ (investor, operator, auditor, admin)
  - Glossary (business terms)
  - Playbooks (step-by-step procedures)
  - Standards (how to do X right)
  - [Core knowledge to ground copilots]

- [ ] **Search Hints** (for enterprise search)
  - What can users search for? (properties, investors, investments, documents)
  - Filter options (status, date range, owner, type)
  - Saved searches (common queries)

### Data & Schema
- [ ] **Knowledge Object Schema** (BO-12)
  - Immutable, versioned
  - Fields: title, content, category, tags, author, createdAt, publishedAt, deprecatedAt, currentVersion
  - Indexing: full-text searchable

- [ ] **Decision Record Schema**
  - Decision title
  - Context (why was this decision made?)
  - Options considered
  - Decision made (and why)
  - Consequences
  - Author, date, owner

- [ ] **Operating Cycle Schema**
  - Cycle type (daily, seasonal, fiscal, calendar)
  - Key dates (start, milestones, end)
  - Recurring obligations (daily reconciliation, monthly accrual, annual review)
  - Associated workflows (what should happen at each milestone?)

- [ ] **AI Model Schema** (if custom models)
  - Model name, version
  - Training data (date range, source)
  - Performance metrics (accuracy, precision, recall)
  - Last evaluated (date)
  - Owner

- [ ] **Search Index Schema**
  - Document type (property, investor, investment, decision, knowledge article)
  - Full-text fields (title, content, description)
  - Faceted fields (status, owner, date)
  - Boost factors (title matches weighted higher than body matches)

### Business Rules
- [ ] **Copilot Ground Truth Rules**
  - Every copilot answer must cite its source (document, decision record, or knowledge base)
  - Every answer must include a confidence level (high, medium, low)
  - If confidence is low, offer to connect to a human
  - No copilot can execute a command a human in that role could not

- [ ] **Knowledge Versioning Rules**
  - Knowledge articles are immutable; edits create new versions
  - Prior versions remain accessible (for audit trail)
  - Deprecation is explicit (mark as "superseded by article X")

- [ ] **Operating Cycle Rules**
  - Define each cycle (daily: 23:00 UTC midnight reconciliation; monthly: 1st of month distribution accrual; fiscal: quarterly earnings; calendar: annual review)
  - Intelligence uses these cycles to contextualize data ("Q3 performance" means Jul-Sep)

- [ ] **Search Rules**
  - Permission-filtered (an investor can only search for their own data)
  - Privacy-aware (sensitive data masked or excluded)
  - Performance (results in <500ms)

- [ ] **Model Assurance Rules**
  - Every model is tested for bias (across demographics, regions, segments)
  - Every model has a defined retraining cadence (weekly, monthly, quarterly?)
  - Every model decision is logged and auditable
  - Model can be rolled back if performance degrades

### Visual Assets
- [ ] **AI Canvas Design**
  - Layout: where does the copilot appear? (chat panel, inline, floating, full-screen?)
  - States: idle, listening, thinking, responding, error
  - Message format: user input, assistant response, citations, confidence indicator

- [ ] **Copilot Interaction Flows**
  - User asks question
  - Copilot retrieves relevant knowledge
  - Copilot generates answer
  - Copilot cites sources
  - Copilot indicates confidence
  - User rates answer (helpful? Not helpful? Report issue?)
  - If human help needed, user clicks to escalate

### Configuration
- [ ] **LLM Integration** (code)
  - Model choice (GPT-4, Claude, custom, etc.)
  - API endpoint, authentication
  - Temperature, max_tokens, other params
  - Prompt engineering (system prompt for each copilot)

- [ ] **RAG (Retrieval-Augmented Generation) Setup**
  - Vector database for knowledge embedding (Pinecone, Supabase, etc.)
  - Embedding model (OpenAI, Anthropic, etc.)
  - Retrieval logic (semantic search + keyword fallback)
  - Reranking (score retrieved docs and pick top N)

- [ ] **Search Implementation** (code)
  - Search engine (Elasticsearch, Meilisearch, database FTS)
  - Indexing strategy (real-time, batch, incremental)
  - Permission filter (applied before ranking)

- [ ] **Model Monitoring** (code)
  - Track model predictions vs. ground truth
  - Alert if performance drops below threshold
  - Log every prediction for audit trail

- [ ] **Feedback Loop** (code)
  - Collect user feedback (helpful/not helpful/report issue)
  - Use feedback to improve model (retrain or adjust prompts)
  - Track feedback metrics per copilot, per user, per question type

### Test Data
- [ ] **Knowledge Base Seed Data**
  - 50+ FAQ articles
  - 100+ glossary terms
  - 20+ playbooks
  - 10+ standards documents

- [ ] **Copilot Test Cases**
  - Answerable question (copilot retrieves relevant knowledge, generates correct answer)
  - Unanswerable question (copilot says "I don't know" and offers to escalate)
  - Follow-up question (copilot maintains context and refines answer)
  - Off-topic question (copilot politely declines to answer)
  - Biased question (copilot detects bias and responds neutrally)

- [ ] **Search Test Cases**
  - Exact match search (find property by ID)
  - Fuzzy search (find property by partial name)
  - Filter search (find investments by status=Reserved)
  - Date range search (find investments placed in Q3)
  - Permission filter (investor sees only their data)
  - Performance (1000s of results, still <500ms)

- [ ] **Model Bias Test Cases**
  - Same query, different demographics, same quality answer (no demographic bias)
  - Same query, different regions, regionally-appropriate answer (no regional discrimination)

### Integrations
- [ ] **Knowledge Management System** (optional)
  - If using external system (Notion, Confluence, etc.)
  - API endpoint
  - Authentication
  - Sync frequency (daily, real-time?)

- [ ] **LLM Provider**
  - API endpoint, API key
  - Rate limits
  - Cost tracking (if usage-based)

- [ ] **Vector Database**
  - Connection string, credentials
  - Embedding model endpoint
  - Index maintenance (re-embedding on knowledge update)

- [ ] **Model Registry** (optional)
  - If using multiple models, track versions, performance
  - Rollback capability (quick switch to previous model if issue detected)

---

## WAVE 10: Sovereign Governance
**Modules:** Ev, So, Cg, Rp, Rn, Rs, Sw (Evolution, Sovereign, Cognition Governance, Replay, Retention, Release, Stewardship)

**When to provide:** After W9 is at exit conditions. This is the terminal wave.

### Content & Copy
- [ ] **Constitutional Amendment Procedure** (L1)
  - Who may propose an amendment? (board, executive, enterprise architect?)
  - What notice is required? (30 days? Publish in advance?)
  - What re-ratification is forced? (if L1 changes, which layers must re-evaluate?)
  - What is the approval process? (vote? Consensus? Steward sign-off?)
  - How is the amendment recorded? (ADR entry, constitutional note)

- [ ] **Stewardship Charter** (per layer)
  - Layer L1: Enterprise Constitution steward (name, contact)
  - Layer L2: Business Object steward
  - Layer L3: Relationship steward
  - ... (one steward per layer)
  - For each: responsibilities, decision authority, escalation path

- [ ] **Succession Plan** (per steward)
  - Primary steward name, role
  - Backup steward (if primary unavailable)
  - Handoff process (how to transition)
  - Training for successor

- [ ] **Release Notes Template**
  - What changed (features, fixes, deprecations)
  - Breaking changes (what requires migration?)
  - Migration guide (step-by-step)
  - Rollback procedure (how to revert if issue)
  - Supported versions (how many prior versions are supported?)

- [ ] **Audit Trail Description**
  - What is logged? (every command, every state change, every decision)
  - Retention? (7 years for compliance? Perpetual?)
  - Access? (who can read audit logs? Auditors only?)
  - Immutability? (logs cannot be deleted or edited)

### Data & Schema
- [ ] **Stewardship Registry** (structured)
  - Layer | Primary steward | Backup | Authority | Escalation path | Training due date

- [ ] **Amendment Record Schema**
  - Amendment ID, date, proposer
  - L1 text (before, after)
  - Downstream impact (which layers re-evaluate?)
  - Approval record (who approved, when)
  - Implementation record (which version first includes this amendment?)

- [ ] **Audit Trail Entry Schema**
  - Timestamp
  - Actor (user ID or system)
  - Entity (which object, which ID)
  - Action (which command)
  - Before state (if applicable)
  - After state (if applicable)
  - Events published (if applicable)
  - Immutable (hash, signature to prevent tampering)

- [ ] **Release Version Schema**
  - Version number (semantic: major.minor.patch)
  - Release date
  - Changes (features, fixes, deprecations)
  - Breaking changes (if any)
  - Rollback procedure
  - Supported until date
  - (Signed by release manager, immutable entry)

### Business Rules
- [ ] **Amendment Rules**
  - L1 amendment requires 2/3 board approval (or choose your threshold)
  - L1 amendment re-triggers L2 evaluation (objects may need redefining)
  - L1 amendment forces L2+ re-certification (stewards sign off)
  - Amendment costs are tracked (which layers re-evaluate, how long, resource cost)

- [ ] **Stewardship Rules**
  - Every layer has one named steward (not a committee, one accountable person)
  - Steward makes decisions on behalf of that layer within enterprise policy
  - Steward may escalate to board or constitutional committee (defined in procedure)
  - Steward succession is planned in advance (never an unexpected gap)

- [ ] **Audit Trail Rules**
  - Every command is logged with before/after state
  - Logs are immutable (no deletion, no editing, hash-verified)
  - Logs are encrypted at rest (if containing sensitive data)
  - Access to logs is permissioned (read-only for auditors, not for investors)
  - Logs survive data backups (not lost in restore)

- [ ] **Retention & Residency Rules**
  - Personal data (Identity.email, identity.phone) retained for 7 years after account deletion
  - Financial data (Investment, Ledger) retained permanently for tax/audit
  - Event logs retained for 7 years minimum
  - Data residency (all data EU, if subject to GDPR? All data in country X?)
  - Deletion procedure (how to execute a deletion request while maintaining audit trail?)

- [ ] **Release Rules**
  - Only release tags (never push to main branch)
  - Every release is tested against prior 2 versions (backward compatibility)
  - Every release includes rollback procedure (how to go back if issue found?)
  - Every release is tagged, signed, and immutable
  - Maximum 2 prior versions supported concurrently (no support for 5-year-old version)

- [ ] **Observability Rules**
  - Every system component emits health signals (disk usage, memory, CPU, error rate)
  - Alerts configured for anomalies (error rate > 5%, latency > 500ms, etc.)
  - On-call rotation defined (who responds to alerts? SLA for response time?)
  - Incidents are recorded as events (for audit trail and post-mortem)

### Visual Assets
- [ ] **Sovereign Tier Interface Mockups**
  - Constitutional amendment view (show old vs. new text, approval status, impact analysis)
  - Audit trail viewer (search, filter, export logs)
  - Stewardship dashboard (show all stewards, their layers, decision authority, upcoming training)
  - Release management (view all versions, changelogs, rollback controls)

- [ ] **Lock Reconciliation Dashboard**
  - Canonical token package vs. shipped surface (any drift?)
  - Vocabulary linter results (any forbidden terms shipped?)
  - Test coverage trend (increasing or decreasing?)

### Configuration
- [ ] **Amendment Workflow** (code)
  - Function to propose amendment (publish text, notify stewards, start voting)
  - Function to ratify amendment (record approval, re-certify downstream layers, record in ADR)
  - Function to rollout amendment (deploy new version, update docs)

- [ ] **Audit Trail Logging** (code)
  - Middleware/hook to capture every command
  - Storage (immutable log table or event log)
  - Encryption (if needed)
  - Retention enforcement (delete old entries per policy)

- [ ] **Release Automation** (code)
  - Build → test → tag → deploy pipeline
  - Rollback trigger (manual or automatic on alert)
  - Release notes generation (from commit history and ADR entries)

- [ ] **Observability Setup** (code)
  - Health check endpoints (for each service/layer)
  - Metric collection (disk, memory, CPU, error rate, latency)
  - Alert rules (define thresholds)
  - Dashboard (real-time view of system health)

- [ ] **Stewardship CLI** (optional)
  - Command to list all stewards
  - Command to propose amendment
  - Command to approve/reject amendment
  - Command to view audit trail (filtered by layer, date, actor)
  - Command to execute release

### Test Data
- [ ] **Amendment Workflow Test Cases**
  - Propose amendment (amendment is in "proposed" state)
  - Approve amendment (collect required votes)
  - Ratify amendment (amendment becomes active in new version)
  - Rollout amendment (new version deployed, old version still supported)
  - Impact analysis (which layers require re-evaluation? Run and verify)

- [ ] **Audit Trail Test Cases**
  - Log a command (verify logged correctly)
  - Retrieve logs (by actor, by date, by entity)
  - Try to edit log (confirm impossible, error returned)
  - Try to delete log (confirm impossible, error returned)
  - Export logs (CSV or JSON, all matching records)

- [ ] **Release Test Cases**
  - Create release tag
  - Deploy to staging (run test suite)
  - Deploy to production (if staging passes)
  - Trigger rollback (revert to prior version)
  - Verify rollback (system in prior state, no data loss)

- [ ] **Stewardship Test Cases**
  - Steward makes decision (decision logged, attributed to steward)
  - Steward delegates to backup (backup can make decision)
  - Steward is away (backup is automatically consulted)
  - Successor trained (training completion recorded)

### Integrations
- [ ] **Git / Version Control**
  - Release tags (immutable, signed)
  - Commit hooks (enforce message format, run linter)

- [ ] **Deployment Pipeline** (CI/CD)
  - Build stage (compile, lint, test)
  - Staging stage (deploy to staging, run smoke tests)
  - Production stage (deploy to production, health checks)
  - Rollback stage (revert to prior version if needed)

- [ ] **Observability Platform** (Datadog, New Relic, Prometheus, etc.)
  - Metric ingestion
  - Alert configuration
  - Dashboard hosting

- [ ] **Audit Log Storage**
  - Immutable log database (Postgres with hash verification? Kafka? DynamoDB?)
  - Encryption (at rest and in flight)
  - Retention enforcement (delete old entries per policy)

---

## Summary Table

| Wave | Modules | Prerequisite Content | Prerequisite Data | Prerequisite Rules | Prerequisite Assets | Prerequisite Config | Prerequisite Tests | Prerequisite Integrations |
|------|---------|----------------------|-------------------|--------------------|--------------------|---------------------|-------------------|---------------------------|
| **W1** | Ct, Tx, Tk, Iv | Constitution, Vocab, Policy | Object taxonomy, Invariants | Constitutional laws | Token package (v3.0) | Linter config | Sample objects | None |
| **W2** | Vo, Bo, Cl, Fr, Pl | BO charters, Field labels | Field registry, Relationships | Nullability, Validation, Provenance | Colour bindings, Type guide | Type validation | Edge cases, Errors | None |
| **W3** | Rl, Sm, Ty, Pr, Db, Ad | Relationship charters, State machines, ADRs | Relationship matrix, State machines, Provenance spine, DB schema | Transition guards, Cascade rules, Immutability | State machine diagrams, Type matrix | State machine validator, DB schema, Linter | Transition cases, Cascade tests | None |
| **W4** | Dc, En, Lc, At, Vl, Ax | Design Constitution, Enum display, Error messages | Enum set, Atom specs, Accessibility reqs | Lifecycle guards, Validation, Accessibility | Atom library, Enum guide, IL hierarchy | Token usage rules, Component library, Accessibility checker | Atom tests, Enum tests | None |
| **W5** | Cm, Cp, Jy, Ml, De, Ap, Rt, Pm | Capability charters, Command descriptions, Journey descriptions, API docs, Permissions | Command schema, Event schema, Journey state machine, Permission matrix | Command rules, Event rules, Journey rules, API rules, Permission rules | Molecule library, Journey diagrams | Command handler stubs, Event handler stubs, Permission checker, API routes | Command tests, Event replay tests, Journey tests, Permission tests | Event bus, Database (if separate) |
| **W6** | Fo, Gm, Sc, Og, Sg, Es, Ts | Financial object descriptions, Organism descriptions, Service contracts, Telemetry descriptions | Financial object schema, Projection schema, Service contract schema, Telemetry schema | Metric grammar rules, Density & mode rules, Service boundaries, Telemetry rules | Organism library, Density guide, Metric guide, Graph visualizations | Metric formatter, Projection queries, Service clients, Telemetry client, Coverage gates | Projection tests, Service contract tests, Telemetry tests, Financial object tests | Analytics backend, Payment service (if external) |
| **W7** | Pp, As, Cx, Rd, Ed, Er | Passport stages, WS layouts, Context graph rules, Error catalog | View specs, Navigation structure | Workflow rules, Data access rules, Notification rules | Workspace mockups, Approval diagrams, Automation timeline | Page route map, Middleware & auth, Notification triggers | Workspace tests, Approval workflow tests, Automation tests | Email service, SMS service (if applicable), Reporting/export |
| **W8** | Aw, Au, Gj, Sh, Nt, Ob, Rk | Same as W7 for WS-06…10, plus approval workflows, automations, guest journey, risk/controls | Same as W7 | Same as W7, plus workflow details | Same as W7 | Same as W7 | Same as W7 | Same as W7 |
| **W9** | Kn, Gq, Oc, Cv, Co, Ix, Qa | Copilot personas, Capabilities, Knowledge base, Search hints | Knowledge object schema, Decision record schema, Operating cycle schema, AI model schema, Search index schema | Copilot ground truth, Knowledge versioning, Operating cycle, Search, Model assurance | AI canvas design, Copilot flows | LLM integration, RAG setup, Search implementation, Model monitoring, Feedback loop | Knowledge base seed, Copilot tests, Search tests, Bias tests | Knowledge management system (optional), LLM provider, Vector database, Model registry (optional) |
| **W10** | Ev, So, Cg, Rp, Rn, Rs, Sw | Amendment procedure, Stewardship charter, Succession plan, Release notes template, Audit trail description | Stewardship registry, Amendment record schema, Audit trail entry schema, Release version schema | Amendment rules, Stewardship rules, Audit trail rules, Retention rules, Release rules, Observability rules | Sovereign tier mockups, Lock reconciliation dashboard | Amendment workflow, Audit logging, Release automation, Observability setup, Stewardship CLI (optional) | Amendment tests, Audit trail tests, Release tests, Stewardship tests | Git/version control, CI/CD pipeline, Observability platform, Audit log storage |

---

**Next step:** Organize this checklist by wave. Before coding each wave, confirm that you have all the material listed. Anything missing should be documented as a "TBD" with an owner assigned.

**Store in:** `C:\Users\nkdes\Downloads\gc-app\WAVE-INTAKE.md`

