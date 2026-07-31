# Migrations

**Generated. Do not hand-write SQL here.**

The chain is:

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

## Running

```bash
npm run db:generate     # UFR -> SQL
npm run db:migrate      # apply (needs DATABASE_URL)
```

`drizzle.config.ts` reads `DATABASE_URL`, defaulting to a local Postgres.
No database is required to generate.
