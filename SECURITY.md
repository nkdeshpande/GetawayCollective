# Security

## Reporting

Report a vulnerability to **hello@cabindesign.co**. Do not open a public issue.

---

## Accepted dependency advisories

**Reviewed 02 Aug 2026 · next review when a patched Next.js ships**

`npm audit` reports ten advisories: one critical, four high, five moderate.
All ten are accepted. This file records *why*, per advisory, so the decision
can be re-examined rather than rediscovered.

### Why the automated fix is refused

```
npm audit fix --force  ->  "Will install next@9.3.3, which is a breaking change"
```

`next@9.3.3` is six major versions behind the pinned `15.5.22`. It predates the
App Router, which means it would delete every route in this repository — all 107
generated pages, the middleware guard, and the route-group layouts. **Nobody
should run that command on this project.**

Upgrading forward does not help either. The advisory range for Next is
`9.3.4-canary.0 – 16.3.0-preview.7`. The latest published release at time of
review is **16.2.12, which is inside that range**. There is no patched version
to move to, so the choice is between accepting the advisories and not shipping.

### The advisories

| Package | Severity | Reachable here? | Basis |
|---|---|---|---|
| `vitest` | critical | **No** | Arbitrary file read via the Vitest **UI server**. A `devDependency`; the UI is started only by `npm run test:ui`, which no CI job or production path invokes. Not present in a deployed bundle. |
| `vite` | high | **No** | Path traversal in optimized-deps `.map` handling, in the dev server. `devDependency`, same reasoning. |
| `postcss` | high | **No** | XSS via unescaped `</style>`, and arbitrary file read via attacker-controlled `sourceMappingURL` in CSS comments. PostCSS runs at **build time** over CSS authored in this repository. There is no path by which an attacker supplies CSS to the build — no user-submitted styles, no runtime CSS compilation. |
| `sharp` | high | **No** | Inherited libvips CVEs (CVE-2026-33327/33328/35590/35591). Reachable through `next/image` when it processes **untrusted remote images**. This app serves local imagery only and configures no remote image loader, so libvips never sees an attacker-controlled file. |
| `next` | high | — | Transitive: the `postcss` and `sharp` entries above. No separate defect. |

The five moderate advisories are transitive under the same `vite`/`vitest`
development chain.

### What would change this

Any one of these reopens the decision:

- A patched Next.js is published outside the advisory range → upgrade.
- A remote image loader is configured in `next.config.ts` → `sharp` becomes
  reachable and must be resolved before that ships.
- Any feature accepts user-authored CSS or runs PostCSS at request time →
  the `postcss` advisories become reachable.
- The Vitest UI is added to a CI job or exposed on a shared host → the critical
  becomes reachable.

Re-run `npm audit` at each dependency bump and compare against this table. An
advisory that appears here has been considered; one that does not, has not.

---

## Security posture

Documented here because these are decisions, not defaults.

**The access guard fails closed.** `lib/access.ts` denies an unknown route
rather than serving it, and an absent session resolves to the anonymous
subject. There is no branch that admits a caller because something was missing.

**Denials do not confirm existence.** `IA_LAWS.notFoundNeverConfirms` — a
missing right returns 404, not 403. Only an insufficient *access class*, where
the surface is already public knowledge, returns a 403 that explains itself.
Middleware **rewrites** rather than redirects, so a refused path never enters
browser history.

**Authority is a grant, never a role.** A role makes a grant eligible; access
exists only as a named, scoped, expiring, reasoned row in `auth_office_grant`.
`lib/session.ts` re-reads that table on every server render rather than trusting
the token's snapshot, so a revocation takes effect on the next request.

**No identity may hold a separation triad.** GP-06 is enforced at grant time in
`lib/access-admin.ts`, in `scripts/grant.mjs`, and in the bootstrap path. A law
enforced only on the path people do not use is not enforced.

**API routes are outside the middleware matcher.** This is a real widening and
it is documented at the point it is granted, in `middleware.ts`. The three
endpoints that exist — `/api/signal`, `/api/dossier`, `/api/auth/*` — are
deliberately public. **Any future endpoint touching a vehicle, a right or money
must call `authorise()` itself.**

**No passwords.** There is no password column and there should not be one.
Identity is Google OAuth or a single-use email link.

**Secrets.** `.env.local` is gitignored; `.env.example` is committed and
contains no values. No secret has ever been committed to this repository.
