# Getaway Collective — Enterprise Operating Model v2.0

## Operating rule

Getaway Collective is a constitutional capital, governance, and portfolio
platform. It does not become an operating company for hospitality,
construction, engineering, technology, tax, or marketing work.

> Humans make fiduciary decisions. AI manages information. Partner firms execute defined work.

A title, employer, or partner engagement never creates authority. Authority is
always a named, time-bound grant to an identity, with enterprise or LLP scope,
recorded reason, grantor, and review date.

## Constitutional operating platform

```text
                         GETAWAY COLLECTIVE
                   Capital · Governance · Portfolio

       Shared Chief Executive      VP — Portfolio & Platform
       Enterprise direction        Enterprise integration
                                  
      ┌───────────────┬────────────────┬────────────────┐
      │               │                │                │
Investor Office   Portfolio Office  Governance Office  AI Operating Layer
capital relation  LLP/asset control constitutional    GC-01 / GC-02
                                      integrity
```

### Executive leadership

| Constitutional function | Accountable leader | May decide | Must not decide alone |
| --- | --- | --- | --- |
| Enterprise direction | Shared Chief Executive | strategy, executive appointment proposals, institutional relationships, Board reporting | resolutions, regulated approvals, or an exception to separation of powers |
| Enterprise integration | VP — Portfolio & Platform | portfolio cadence, risk escalation, partner coordination, workflow completion | investment approval, financial execution, governance review, or a binding legal position without the required office or resolution |

### Internal constitutional functions

| Function | Purpose | Core workflow ownership | Existing authority home |
| --- | --- | --- | --- |
| Investor Office | capital relations and investor continuity | enquiry, qualification, document collection, meeting preparation, reporting dispatch, escalation | Executive Office plus Compliance Office for explicit acceptance/accreditation grants |
| Portfolio Office | LLP and portfolio control | vehicle lifecycle, acquisition docket, reserve/debt review, valuation and exit preparation | Investment Committee and Executive Office |
| Governance Office | constitutional integrity | policy/version register, resolutions, conflicts, statutory calendar, decision register, authority administration | Governance Office, Board, Audit & Risk Committee, Governance & Ethics Committee |
| AI Operating Layer | information coordination, monitoring, drafting, task routing, and escalation | alerts, board-pack assembly, status synthesis, docket preparation, communications continuity | no fiduciary authority; no constitutional grant capable of approval or execution |

## Partner-firm model

Partner firms are capacity umbrellas. They may supply several disciplines under
one engagement, but neither the firm nor a discipline label receives a blanket
constitutional grant.

| Partner-firm umbrella | Bundled capability | Constitutional boundary | Typical access posture |
| --- | --- | --- | --- |
| Governance & Financial Compliance Partner | chartered accountancy, tax, company-secretarial work, statutory filing coordination, audit liaison | prepares records and filings; does not approve policy, move capital, or resolve governance | vehicle-scoped read/write working-docket access; named personnel may receive `compliance.record` only when required |
| Legal & Entity Advisory Partner | legal counsel, LLP formation support, contract drafting, regulatory interpretation | advises and drafts; does not publish binding documents or approve a resolution | need-to-know document access; no `content.publish`, `policy.approve`, or `resolution.resolve` grant by default |
| Portfolio & Technical Advisory Partner | valuation, technical diligence, quantity surveying, architecture, project controls | produces independent evidence; does not approve acquisition, deploy capital, or advance the asset lifecycle | dossier upload/review access restricted to the relevant LLP and work item |
| Banking, Debt & Insurance Partner | debt advisory, banking coordination, insurance brokerage | obtains quotations and records; does not draw debt, change coverage, or execute distributions | read-only financial evidence and task-specific upload access |
| Digital Platform Partner | web maintenance, engineering, security monitoring, release work, accessibility and performance remediation | operates approved technical work; has no capital, ownership, compliance, or governance decision right | separate operational access with least privilege, environment separation, expiry, session audit, and emergency revocation |
| Brand & Communications Partner | public copy production, photography, design production, press coordination | creates materials; cannot put legal or binding content in force | asset/content workspace access; publication remains with the Governance Office or the approved constitutional process |
| Operating Partner | property and hospitality delivery under approved agreement | executes the contracted operating plan; cannot alter ownership, capital terms, or governance | LLP-scoped operational work queue and document access only |

## Access Admin design

The Access Admin must manage six distinct records. It must never grant a
constitutional right to a company record.

1. **Partner firm** — legal entity, capability umbrellas, engagement status,
   conflicts, insurance, and contract dates.
2. **Named identity** — a human connected to a partner firm or internal
   function, with identity verification and an individual sign-in.
3. **Engagement** — firm-to-enterprise or firm-to-LLP mandate, scope,
   deliverables, confidentiality, conflict position, start/end date, and owner.
4. **Constitutional appointment** — an internal office/committee appointment;
   this is not interchangeable with employment or a vendor engagement.
5. **Authority grant** — named identity, right, enterprise/LLP scope, grantor,
   reason, effective date, expiry, and revocation record.
6. **Workflow assignment** — work item, accountable constitutional function,
   executing firm, named assignee, reviewer, decision owner, deadline, and
   evidence.

### Access rules

- A partner firm can be engaged across many LLPs; each LLP scope is explicit.
- A human may work for multiple firms, but must sign in as one verified
  identity; conflicts are assessed before a grant becomes live.
- Firms receive no constitutional role. Named people receive minimal grants.
- No grant is open-ended by default for external personnel. Every external
  grant has an expiry and review date.
- Technical operational access is separate from constitutional authority. A
  Digital Platform Partner may fix the platform but cannot see or change
  capital, ownership, accreditation, legal acknowledgement, or resolution
  records unless a separate, narrow, auditable approval is present.
- The Board remains a quorum and a resolution, never an elevated login.
- The existing separation-of-powers checks remain mandatory: no single grant
  holder may combine investment approval, financial execution, and governance
  review.

## Workflow architecture

### 1. Partner onboarding and renewal

`Candidate firm → diligence → conflict disclosure → engagement approval → named personnel → identity verification → scoped access request → separation check → grant → periodic review → renewal or revocation`

**Control points:** Governance Office owns the engagement register; the
requesting constitutional function confirms need; the grantor records reason;
Access Admin rejects a missing LLP scope, missing expiry, or failed separation
check.

### 2. LLP work docket

`GC-01 detects or receives a work item → Portfolio/Governance/Investor Office owns it → executing partner firm receives task → named assignee submits evidence → constitutional reviewer validates → decision owner approves or escalates → immutable record closes`

Examples:

- Tax, CS, and CA work flows to one Governance & Financial Compliance Partner
  engagement, while each deliverable still has a named CA/CS assignee and a
  Governance Office reviewer.
- Website maintenance, security remediation, software release, accessibility,
  and performance work flow to one Digital Platform Partner engagement. The
  partner completes the task; an internal release owner accepts the evidence;
  no partner identity receives capital or governance authority.

### 3. Authority lifecycle

`Request → verify engagement/appointment → define right + scope + expiry → conflict and separation check → grantor approval → session logging → 30-day expiry review → renew, reduce, or revoke`

Required views in Access Admin:

- By LLP: who can act, for which right, until when, and under which engagement.
- By firm: every named person, scope, expiring grant, conflict, and open task.
- By right: every holder, unheld right, and separation-of-powers alert.
- By exception: overdue review, expired engagement with live grant, revoked
  person with assigned work, or a task awaiting a constitutionally authorised
  reviewer.

### 4. AI escalation

GC-01 and GC-02 may draft, classify, monitor, route, remind, and assemble
information. They must create an escalation—not an approval—when a matter
involves:

- investment or capital allocation;
- investor accreditation, commitment acceptance, or binding agreement;
- legal interpretation, tax conclusion, complaint, dispute, or regulatory
  matter;
- authority grant/revocation, policy, resolution, conflict, or exception; or
- an unresolved reserve, debt, insurance, statutory, security, or continuity
  threshold.

The escalation carries source records, a factual summary, proposed next steps,
the required human decision owner, and a deadline. The human outcome is then
written back to the workflow record.

## Build order

1. Keep the current rights-first authority model; do not add a super-admin or
   company-level authority.
2. Build **Partner Firms**, **Engagements**, **Named Personnel**, and
   **Workflow Assignments** ahead of broad external access.
3. Build the **Access Admin** views for grants, expiries, revocations,
   unassigned rights, separation alerts, and LLP scope.
4. Add the Digital Platform Partner operational-access layer separately from
   domain authority, with session audit, expiry, environment segregation, and
   emergency revocation.
5. Add GC-01 task/exception orchestration first; add GC-02 conversation
   continuity only after identity, consent, authorization, and audit controls
   are production-ready.

This structure scales to many LLPs because partner firms are reusable capacity
umbrellas, while each decision, grant, task, and escalation stays attached to
the correct constitutional function, named human, and LLP scope.
