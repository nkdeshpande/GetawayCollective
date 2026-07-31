# Getaway Collective

An institutional investment platform for experiential real estate.

Getaway Collective acquires, governs, develops and holds experiential real
estate through LLP-based investment vehicles. The platform separates three
things that are usually conflated:

| | |
|---|---|
| **Getaway Collective** | Governs the vehicles. Holds no equity in them. |
| **The vehicle** | One property, one LLP. Holds the land title. Owned by its partners. |
| **The operating partner** | Runs the property under contract to the vehicle. |

That separation is the constitutional rule the codebase is built to enforce
— *Governance Without Ownership* — and most of what looks unusual here
follows from it.

---

## Status

**Prototype.** Nothing in this repository talks to a database, an
authentication provider or a payment processor. Every page reads static
TypeScript. `lib/access.ts` deliberately fails closed: `resolveSubject()`
returns `ANONYMOUS`, so every non-public surface denies. That is correct
for an unfinished system and **must not be "fixed" to unblock a demo.**

Two things are genuinely live: the lead-capture endpoints at `/api/signal`
and `/api/dossier`. Without `RESEND_API_KEY` they return 503 and the page
says so — they never show a success screen over a dropped message.

**Not yet reviewed by a lawyer:** roughly 9,000 words of Terms and Risk
Disclosure copy under `content/legal.ts` and `app/_assemblies/slowspace.ts`.
It is drafted to be accurate, not to be relied on.

---

## Running it

```bash
npm install && npm run dev
```

`npm run build` runs `npm run tokens` first — the design tokens are
generated into `dist/`, which is gitignored, so a build that skips that step
fails on a missing stylesheet from a clean checkout.

Copy `.env.example` to `.env.local` for local work. Every variable is
documented at the point it is declared.

---

## Verifying it

```bash
npm run verify
```

Eighteen checks and the test suite. It is the gate, and a pre-commit hook
already runs it.

The checks exist because **enumerated allowlists fail silently.** Each one
parses its canon rather than holding a copy of it, so a new value nobody
remembered to register fails the check instead of quietly bypassing it.
ADR-0006 states the rule: every registry has a generator with `--check`,
and every checker reads the source of truth rather than a transcription of
it.

A few worth knowing by name:

- **`lint:token`** — computes WCAG AA against the *rendered* colour on both
  grounds, with alpha compositing. It is the reason the palette carries
  ground-specific variants.
- **`lint:vocab`** — 16 forbidden terms from L1 §25. It cannot tell a use
  from a mention, which is deliberate; mentions carry a pragma.
- **`assembly:css --check`** — `app/_assemblies/assemblies.css` is
  *generated* from `GC-ASSEMBLIES.html`. Edit the prototype, then
  regenerate. Editing the CSS directly fails the check.
- **`app:check`** — every `page.tsx` is generated from `constants/routes.ts`.
  A hand-added page is not a route.

---

## Layout

```
constants/        the canon — routes, tokens, assemblies, vocabulary
content/          all page copy as data, with load-time self-checks
app/_assemblies/  the components that render it
lib/              access, authority, leads
scripts/          one linter or generator per invariant
tests/            the suite
docs/adr/         why things are the way they are
```

The rule that explains the shape: **the words and the layout are never
edited in the same operation.** Copy lives in `content/`, arrangement lives
in `app/_assemblies/`, and neither knows anything about the other beyond a
declared type.

---

## Conventions that will surprise you

- **Money is `bigint` in minor units scaled 10⁴.** Never a float, never
  rendered without its currency mark. Splits use largest-remainder
  allocation, so they sum exactly.
- **Every forward-looking figure carries a confidence class** — observed,
  verified, modelled, estimated, forecast, pending. A figure without one
  does not render.
- **A position is chosen in whole 5% units**, to a ceiling of 50%. The
  ceiling is constitutional, not commercial: above it one partner carries
  every ordinary resolution alone. See `app/_assemblies/slowspace.ts`.
- **Ground inversion.** Void is narrative; paper is an assertion the
  platform can be held to. The cut between them is hard, never a fade, and
  it is a property of what is being said rather than a rhythm applied to
  the page.
- **Never transition `color` or `background` in a custom-property-themed
  system.** Three separate incidents; each froze elements on the previous
  ground.

---

## Contributing

`npm run verify` must pass. If a check fails, fix the cause rather than the
check — and if you change a check, break-test it: introduce the defect it
guards against, and confirm the suite fails.
