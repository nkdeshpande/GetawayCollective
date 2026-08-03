# Credential setup — D-05 (database) and D-06 (Google OAuth)

Everything in the platform below the public site waits on these two.
Nothing here can be done from the codebase: both need accounts only you
can create.

**Do them in this order.** Google sign-in works without a database, but
the office grant that makes the Office reachable does not — so a database
first means one sign-in gets you all the way in.

---

## Before you start

Check what you already have. `.env.local` is gitignored and already holds
a development `AUTH_SECRET`:

```bash
cat .env.local
```

If it is missing or you want a fresh one:

```bash
npx auth secret
```

That writes `AUTH_SECRET` into `.env.local`. Use a **different** secret in
production — rotating it invalidates every live session, which is the
behaviour you want if one ever leaks.

---

## D-05 · Neon → `DATABASE_URL`

### 1. Create the project

1. Sign in at **console.neon.tech**.
2. **New Project**.
3. Name it `getaway-collective`.
4. Postgres version: the default is fine.
5. **Region — read this before clicking.** Vercel is pinned to `bom1`
   (Mumbai) in `vercel.json`. Pick the Neon region closest to it. If
   Mumbai is not offered, Singapore (`ap-southeast-1`) is the nearest.

   This is also the data-residency decision I flagged in D-05. For a
   SEBI-adjacent platform holding KYC and partner records, where the rows
   physically sit may matter more than latency. If residency in India is a
   requirement rather than a preference, say so now — it changes the
   provider choice, not just the region, and it is far cheaper to change
   before there is data than after.

### 2. Copy the two connection strings

Neon gives you more than one, and **the difference matters**:

| String | Host contains | Use it for |
|---|---|---|
| **Pooled** | `-pooler` | The application (`DATABASE_URL`) |
| **Direct** | no `-pooler` | Running migrations |

The app runs on serverless functions that come and go, so it must use the
pooler or it will exhaust Postgres connections. `lib/auth/db.ts` already
sets `prepare: false` for exactly this — the pooler runs in transaction
mode, where prepared statements do not survive between checkouts.

Migrations are a single long-lived connection issuing DDL. Run those over
the **direct** string; transaction-mode poolers can choke on multi-statement
DDL.

Both strings include `?sslmode=require`. Keep it.

### 3. Point the app at it

Add the **pooled** string to `.env.local`:

```
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
```

### 4. Apply the migrations

```bash
npm run db:migrate
```

It reads `.env.local` if `DATABASE_URL` is not already exported, prints the
host and whether the endpoint is pooled, and is idempotent — re-running it
is a safe no-op.

**Do not use `npx drizzle-kit migrate`.** On Windows its spinner swallows
the driver error and it exits 1 with no message at all:

```
[⣷] applying migrations...
exit 1
```

`scripts/migrate.mjs` calls the identical migrator underneath and lets the
exception through with its code, detail, hint and query. That is why
`db:migrate` points at it.

That applies both migrations:

- `0000_productive_scorpion.sql` — the institutional schema, 27 objects
- `0001_naive_puck.sql` — the five `auth_*` tables

### 5. Confirm it took

`db:migrate` reports the count itself:

```
[migrate] OK — 32 tables (5 auth, 27 institutional)
```

32 is the expected total. If you see fewer, or none, the migration ran
against a different database than the one you are querying — check you are
not mixing the pooled and direct strings.

### 6. Status of the instance provisioned on 02 Aug 2026

Done and verified:

- Neon project on **PostgreSQL 18.4**, region `ap-southeast-1` (Singapore),
  the nearest available to Vercel's `bom1`.
- Both migrations applied. **32 tables** — 27 institutional, 5 `auth_*`.
- Column shapes verified against the Auth.js adapter contract.
- `npm run grant list` reaches it and correctly reports no grants.
- The application serves against it with no errors: public routes 200,
  private 403, `/api/auth/session` returns `null`.

**Two things still outstanding on this instance.**

The connection string in use is the **direct** endpoint — its host has no
`-pooler` segment. That is correct for migrations and fine for local
development, but **Vercel needs the pooled string**, or serverless
functions will exhaust the connection limit. Fetch it from the Neon
console: same project, the endpoint whose host contains `-pooler`.

The credential was shared over a chat transcript. **Rotate it in the Neon
console** — Roles → reset password — and update `.env.local` and Vercel.
Nothing in the repository holds it; `.env.local` is gitignored and was
verified as ignored before it was written.

---

## D-06 · Google OAuth

### What this actually requires — corrected

I told you earlier to start this early because verification takes days and
caps you at 100 users. **That was wrong for this app.**

Auth.js requests only `openid`, `email` and `profile`. All three are
**non-sensitive** scopes. Google's verification review — the slow one —
applies to sensitive and restricted scopes. With non-sensitive scopes only:

- **Testing** mode caps you at 100 named test users. That cap is a
  property of Testing mode, not of verification.
- **Publishing** to production lifts the cap and needs no review.

So you can be live today. Do not plan around a wait that does not apply.

### 1. Create the project and consent screen

1. **console.cloud.google.com** → create or select a project.
2. **APIs & Services → OAuth consent screen**.
3. User type: **External**. (Internal restricts you to your own Workspace
   domain — fine for testing the Office, useless for investors.)
4. Fill in:
   - **App name** — Getaway Collective
   - **User support email** — yours
   - **App logo** — optional; adding one can trigger a brand review, so
     skip it for now if you want zero friction
   - **Application home page** — `https://getawaycollective.co`
   - **Privacy policy** — `https://getawaycollective.co/legal/privacy`
   - **Terms of service** — `https://getawaycollective.co/legal/terms`
   - **Authorised domain** — `getawaycollective.co`
   - **Developer contact** — yours

   Both legal URLs already exist and are public, so this step should not
   block you.

5. **Scopes** — add nothing. The defaults (`openid`, `email`, `profile`)
   are what Auth.js asks for, and adding more is what triggers review.

6. **Publish**. Leave it in Testing only if you deliberately want the
   100-user cap while you try it out.

### 2. Create the client

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Name: `getaway-collective-web`.
4. **Authorised redirect URIs** — exact strings, no trailing slash:

```
http://localhost:3000/api/auth/callback/google
https://getawaycollective.co/api/auth/callback/google
```

`3000` is what `next dev` uses. If you run the dev server through the
editor's preview it may bind a different port — add that one too, or run
`npm run dev` directly.

**Authorised JavaScript origins can be left empty.** Auth.js runs the
server-side code flow; it never calls Google from the browser.

5. Copy the client ID and secret into `.env.local`:

```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### 3. The preview-deployment trap

Google matches redirect URIs **exactly** and accepts no wildcards. Vercel
preview deployments get a new URL per commit, so Google sign-in will fail
on previews with `redirect_uri_mismatch`.

Three ways out, in order of preference:

1. Give the preview environment a **stable alias** in Vercel and register
   that one URL.
2. Use the **magic link** on previews — it has no redirect allowlist.
3. Register each preview URL by hand. Do not do this.

`trustHost: true` is already set in `auth.config.ts`, which handles the
Auth.js half. Google's allowlist is the half nothing in the code can fix.

---

## Then: your first sign-in and the first grant

### 1. Name yourself in the bootstrap allowlist

```
GC_OFFICE_BOOTSTRAP=you@yourdomain.com:executive_office
```

Valid roles are parsed from `lib/authority.ts`: `board`,
`investment_committee`, `audit_risk_committee`,
`governance_ethics_committee`, `executive_office`, `governance_office`,
`compliance_office`, `member`.

`executive_office` is the right first grant — it holds the operational
rights without holding `authority.grant`, so it cannot quietly become a
super-admin. Use `board` only if you need to issue grants to other people
immediately.

### 2. Sign in

```bash
npm run dev
```

Open `http://localhost:3000/sign-in`. The Google button appears only
because both credentials are now set — that is the check working.

Sign in. On first sign-in the allowlist mints one enterprise grant, names
itself as grantor, and logs a warning telling you to remove the variable.

### 3. Confirm you have the Office

```bash
npm run grant list
```

You should see one ACTIVE row. Then open `http://localhost:3000/office` —
it should render instead of returning 403.

### 4. Remove the bootstrap

Delete `GC_OFFICE_BOOTSTRAP` from the environment. It has done its job, and
it never re-grants an identity that already has a row, so leaving it in
does nothing useful and widens the surface for no reason.

From here authority is issued properly:

```bash
npm run grant add colleague@example.com governance_office --reason "Wave 8 governance administration"
```

The tool refuses a grant with no reason, refuses one that would complete a
GP-06 separation triad, and stamps `revoked_at` rather than deleting when
you revoke.

---

## Setting the same values in Vercel

`.env.local` is local only. For a deployment:

1. Link the project — there is no `.vercel` directory yet:

```bash
npx vercel link
```

2. Set each variable in **Vercel → Project → Settings → Environment
   Variables**, for Production and Preview:

| Variable | Notes |
|---|---|
| `AUTH_SECRET` | A **different** value from local |
| `DATABASE_URL` | The **pooled** string |
| `GOOGLE_CLIENT_ID` | |
| `GOOGLE_CLIENT_SECRET` | |
| `NEXT_PUBLIC_SITE_URL` | `https://getawaycollective.co` |
| `RESEND_API_KEY` | Turns on the magic link and the two lead forms |
| `RESEND_FROM` | Needs a domain verified in Resend |
| `UPSTASH_REDIS_REST_URL` | D-03. Without it the limiter is per-instance |
| `UPSTASH_REDIS_REST_TOKEN` | |

Do **not** set `GC_OFFICE_BOOTSTRAP` in production unless you are
deliberately minting the first production grant, and remove it the moment
you have.

---

## What unlocks the moment `DATABASE_URL` is live

| Waiting on it | Becomes possible |
|---|---|
| Email magic link | A verification token has somewhere to live |
| Office grants | `auth_office_grant` exists; 60 office routes reachable |
| D-08 · Investor record | Accredited and member stop being hard-coded false |
| D-14 · Passport | Sixteen stages can finally save and resume |
| D-09 · Approvals | The keystone of Wave 8 |
| D-11 · Notifications | 23 notices get a delivery record |
| D-23 · Search | Something to index |

Tell me when both are set and I will take D-08, D-14 and D-19 together —
the Investor record, passport persistence and the missing `DECLINED`
state are one body of work, and splitting them means building the same
record twice.
