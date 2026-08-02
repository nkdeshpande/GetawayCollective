# Migrations

**Generated. Do not hand-write SQL here.**

Two schemas share this database, and they are governed differently.

The first is the institutional one, and it is generated. The chain is:

```
constants/ufr.ts          the Unified Field Registry (L2.5)
constants/relationships.ts the L3 edges, carrying onParentDelete
        |
        v  npm run db:schema
generated/db-schema.ts     Drizzle tables — DO NOT EDIT
        |
        v  npm run db:generate
migrations/*.sql           DDL
```

Adding a column by editing SQL breaks **E-06** at the layer that holds the
data, and the next `npm run db:check` will catch the divergence but not
undo the migration. Add the field to the registry and regenerate.

## What the registry decides for you

- **Money is `numeric(20, 4)`, never `double precision`.** The Zod layer
  already refuses float money; a float column here would reintroduce the
  same error one layer down. There are zero float columns in this schema
  and that is not an accident.
- **Every foreign key carries `ON DELETE restrict`**, derived from
  `onParentDelete` in the relationship model. Most of this enterprise is
  append-only, so `cascade` is rare by design: you cannot delete a Vehicle
  that holds Property, because the Property record *is* the asset's history.
- **Enums are closed sets from the registry.** A value absent from the
  registry cannot be inserted — which is how F-16 stops a post-stabilisation
  capital call for an operating deficit: there is no such enum value to use.

## The second schema: `lib/auth/schema.ts`

`0001` onward also covers five `auth_*` tables, which are **hand-written**
and deliberately outside the UFR.

A session row is not an institutional record. It is transport for a
browser tab: it carries no provenance, nobody files it, and it is deleted
rather than superseded. Registering it in the registry would put a cookie
on the same shelf as a Distribution, and `db:check` would then be
enforcing E-06 against something E-06 was never written for.

| Table | What it is |
|---|---|
| `auth_user` | The identity. The `id` that grants and events refer to. |
| `auth_account` | An OAuth link — one row per provider per identity. |
| `auth_session` | Auth.js bookkeeping. |
| `auth_verification_token` | Magic-link tokens. The reason email sign-in needs a database at all. |
| `auth_office_grant` | **Institutional.** Mirrors `Grant` in `lib/authority.ts`. |

`auth_office_grant` is the exception that proves the split: it is real
constitutional data, and it lives here only because authority attaches to
an authenticated identity and the identity lives in this file. When the
UFR grows a Party object (v5 `OBJ-014`), it should move.

Its rows are never deleted. Revocation stamps `revoked_at`, because an
audit asks "who could do this on the day it happened?" and a deleted row
cannot answer. That is E-02 surviving the revocation.

## Running

```bash
npm run db:generate     # UFR + auth schema -> SQL
npm run db:migrate      # apply (needs DATABASE_URL)
```

`drizzle.config.ts` reads `DATABASE_URL`, defaulting to a local Postgres.
No database is required to generate.

Until a real `DATABASE_URL` is set, Google sign-in still works — an OAuth
handshake with a JWT session needs no adapter — and the magic link does
not, because a token that cannot be written down cannot be checked.
