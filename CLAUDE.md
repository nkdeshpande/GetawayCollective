# gc-app — Claude Code entry point

**Read `AGENTS.md` first.** It is the operating doc — verify chain, where
authority lives, forbidden vocabulary, money handling, generated files. This
file does not restate any of it; the repo's own rule is that a rule stated in
two places drifts, and that rule applies to this file too. What follows is
only what AGENTS.md doesn't cover: Claude-Code mechanics, and where this repo
sits relative to the rest of this machine.

## What this is

Getaway Collective — an institutional investment platform for experiential
real estate (LLP vehicles, capital-at-risk copy, accreditation-gated
diligence). **Live** at `getawaycollective.co`, Vercel, region `bom1`.
"Governance Without Ownership" is the constitutional separation the whole
codebase enforces: GC governs vehicles, holds no equity in them.

## Verify before you repeat a status claim

Four docs here asserted a prototype state long after it stopped being true
— `README.md`, `docs/STATE-OF-THE-BUILD.md`, `AGENTS.md`'s gate table, and
`lib/access.ts`'s own header. All four were corrected 12 Aug 2026 against
a live `/api/health`, a full green `npm run verify`, and the GitHub API.

The lesson is the recurring one in this repo, and STATE-OF-THE-BUILD.md
states it against itself: *assessments go stale faster than anything else
in a build.* **Re-run the check; don't quote the prose.**

- `/api/health` — what a deployment actually has (presence, not correctness)
- `npm run verify` — 28 steps, 24 gates, 949 tests across 38 files
- `docs/STATE-OF-THE-BUILD.md` — read its "Partly superseded" block first;
  the body below it is still the best account of the shape of the problem,
  but its figures are the 02 Aug ones

Because the platform is live: treat every change to `content/legal.ts`,
`app/_assemblies/slowspace.ts`, money handling (`lib/money.ts`), or anything
behind the accreditation gate as touching a real financial instrument, not a
prototype. The ~9,000 words of Terms/Risk copy remain unreviewed by a
lawyer and are now published — don't extend them as though settled.

**One known-open infrastructure gap** (verified 12 Aug, easy to mistake
for closed because the code is finished): durable rate limiting is
unconfigured in production, so `lib/rate-limit.ts` runs its per-instance
in-memory fallback.

**Branch protection on `main` is ON and enforced for admins** (25 Sep
2026). The `verify` check must pass on the exact commit before it can land
on `main`; force-pushes and deletion are blocked. CI runs on every branch
push, so to ship: push your branch, wait for `verify` to go green on it
(`gh run list --branch <branch>`), then `git push origin <branch>:main`, or
open a pull request. A direct push of an unverified commit is refused, and
that refusal is the gate working, not an obstacle to route around.

## The root-level `GC-*.html`/`.xlsx` files are not canon

Dozens of manuscripts sit loose at the repo root (`GC-ASSEMBLIES.html`,
`GC-OPERATING-FRAMEWORK.html`, `GETAWAYS SPATIAL LEDGER.xlsx`, wave
exit-gates, etc.). Some are generation *sources* the verify chain checks
against (e.g. `assembly:css --check` regenerates from `GC-ASSEMBLIES.html`);
most are historical build record. **None of them out-rank `constitution/` or
`constants/`** — if one disagrees with the registry, the registry governs.
Same doctrine as `C:\SENSORYGETAWAYS`'s loose `GX-00-CN-*` axis documents
versus `_SG_EBOK`: a pile of authored HTML is not automatically canon just
because it's thorough.

## Location and dev server

Moved **12 Aug 2026** from `C:\gc-app` to
`C:\DIGITAL\GETAWAYCOLLECTIVE\gc-app` when the three system builds (Getaway
Collective, XIS, SG-DS PMO) were consolidated under `C:\DIGITAL` — see
`C:\DIGITAL\CLAUDE.md`, which governs all three and states the
daily-autonomous-build / human-in-the-loop policy this repo's `npm run
verify` feeds into.

- Dev server: `npm run dev`, port **3000**, via `.claude\launch.json`
  (present both in this folder and mirrored at `C:\DIGITAL\.claude\launch.json`).
- Local setup: `npm install`, copy `.env.example` → `.env.local`. Needed
  vars (names only — get real values per `docs/SETUP-CREDENTIALS.md`, never
  paste secrets into chat or a committed file): `NEXT_PUBLIC_SITE_URL`,
  `AUTH_SECRET`, `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM`,
  `SIGNAL_LEAD_EMAIL`, `DOSSIER_LEAD_EMAIL`, `GOOGLE_CLIENT_ID` +
  `GOOGLE_CLIENT_SECRET` (optional — Google sign-in silently disappears from
  the page without them, by design, see `auth.config.ts`),
  `GC_OFFICE_BOOTSTRAP`, `UPSTASH_REDIS_REST_URL` + `_TOKEN` (rate limiting;
  degrades to an in-memory counter without them).
- `npm run build` runs `npm run tokens` first — a build that skips it fails
  on a missing stylesheet from a clean checkout (this is already documented
  in README.md, repeated here only because it's the single most common
  fresh-clone failure).

## Standing safety notes for this repo specifically

On top of the general Git Safety Protocol (commits only when asked, never
push/deploy without a fresh ask each time): this is a live, publicly
reachable investment platform, so —
- Never weaken `lib/access.ts`'s fail-closed default to "unblock a demo" —
  the README calls this out explicitly and it's still the right rule.
- Never touch `allowDangerousEmailAccountLinking` in `auth.config.ts` — it's
  off on purpose; turning it on enables account takeover on a platform
  handling capital commitments.
- A failing `npm run verify` check is a finding about the codebase, not an
  obstacle to route around — AGENTS.md already says this; it matters more
  here than in most repos because several checks (`lint:token` WCAG,
  `lint:public`) exist specifically to keep the public surface from silently
  regressing on a live site.
