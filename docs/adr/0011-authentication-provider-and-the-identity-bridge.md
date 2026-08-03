# ADR-0011 - Auth.js is retained; the identity bridge is deferred

**Status:** Accepted, 02 Aug 2026
**Authority:** RBAC LAW 1 · UX-08 · IA_LAWS.notFoundNeverConfirms

## Context

Authentication landed as Auth.js v5 — Google OAuth plus an email magic
link, a Drizzle adapter over Neon, and vehicle-scoped grants in
`auth_office_grant`. It is built, tested and verified against the live
database: 20 gates, 780 tests, public routes serving, private routes
refusing.

A proposal followed to replace it with Clerk, on the reasoning that Clerk
is the documented Next.js + Drizzle + Neon pattern, that running two
identity authorities is wasteful, and that high-authority commands will
eventually need MFA and step-up authentication.

Three parts of that reasoning were sound and one premise was not.

**Sound.** The layering — Google → provider → GC identity → RBAC → vehicle
grants — is correct and is what the system already does. So is the rule
that authentication answers only *who is this person*, never *what may they
see*. So is the observation that `distribution.execute`, `partner.admit`
and `resolution.resolve` deserve stronger controls than a social login.

**Not sound.** The choice was framed as Clerk versus adding Neon Auth
alongside it. Nothing proposed Neon Auth. The real comparison was Clerk
versus the working Auth.js, and against that comparison the decisive fact
is that Clerk is proprietary SaaS while the original requirement was
explicitly for free, open-source authentication.

## Decision

**Auth.js is retained.**

Clerk is revisited when MFA or step-up authentication is genuinely needed
— that is, when the approvals engine exists and consequential commands can
actually execute. Not before. Nothing is lost by deciding later.

**The identity bridge is deferred to the UC-02/UC-03 lifecycle work.**

The bridge is the right idea and it is what makes the provider swappable.
It is deferred only because its foreign key would point at an empty table:
there are no Investor records yet. Building it now would mean building it
twice.

**When it is built it bridges to Investor, not to a Party.**

## The middleware that must not ship

The proposal included a `clerkMiddleware` guard matching
`/invest(.*)`, `/portfolio(.*)`, `/office(.*)` and calling `auth.protect()`.

It leaves **`/home`, `/activity` and `/profile` publicly reachable** — all
three are member-access routes and none matches those prefixes. Verified
against the route table, not inferred.

It also loses, in order of seriousness:

- **Denial of undeclared paths.** `canReach()` refuses a URL the route
  table does not know. A prefix matcher serves it.
- **Per-route access overrides.** `/collection/[vehicle]/investment` and
  `/legal/risk-disclosure` are public by override while sitting inside
  non-public groups. A group- or prefix-level guard denies both.
- **Five access classes reduced to two.** `auth.protect()` asks only
  whether someone is signed in.
- **Per-route rights.** Sixty office routes name a specific right.
- **The 404/403 discipline.** A missing right returns 404 precisely so a
  denial cannot confirm a surface exists.

`auth.protect()` is what "signed in ≠ authorised" forbids. Whatever
provider is used, `canReach()` remains the guard and the provider answers
only for identity.

## Rejected

**Switching to Clerk now.** It would replace verified working code, reverse
the free/open-source requirement, and make identity a vendor dependency —
to buy MFA that cannot be used until Wave 8 exists.

**Building the bridge now.** Its `investor_id` would reference nothing.

**Adding a second identity authority.** Never proposed, and correctly
warned against.
