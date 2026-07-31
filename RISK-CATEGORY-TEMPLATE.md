# RISK CATEGORIES — FILL-IN TEMPLATE

**Resolves open question A2.**
The registry (`UFR-0440 Risk.risk_category`) declares **10**. The canonical
design system assigns colours to **8**. Only **4** appear in both.

Fill in the ⬜ column. Everything else is context.

---

## The 10 in the registry — these are the ratified ones

| # | Value | What it covers | Design colour today | ⬜ YOUR CALL |
|---|---|---|---|---|
| 1 | `liquidity` | Cash availability. Reserve shortfall, funding gap. | ✅ `#2061DE` blue | |
| 2 | `interest_rate` | Cost of debt moving against the vehicle. | ❌ **none — renders grey** | |
| 3 | `operator` | Operating partner performance, SLA failure, replacement. | ❌ **none — renders grey** | |
| 4 | `market` | Demand and pricing. Occupancy, ADR, exit values. | ✅ `#0C3024` forest | |
| 5 | `climate` | Physical and transition risk. Flood, fire, regulation. | ✅ `#2E8B7A` teal | |
| 6 | `currency` | FX exposure on foreign capital or costs. | ❌ **none — renders grey** | |
| 7 | `legal` | Title defect, contract dispute, litigation. | ✅ `#6B6B6B` steel | |
| 8 | `regulatory` | Compliance, licensing, tax, AML. | ❌ **none — renders grey** | |
| 9 | `technology` | Platform failure, data loss, cyber. | ❌ **none — renders grey** | |
| 10 | `counterparty` | A third party failing — lender, operator, buyer. | ❌ **none — renders grey** | |

**Six of ten currently render grey.** That is the problem: a risk register
where six categories are visually identical is a register nobody can scan.

---

## The 8 in the design system

| Value | Colour | In the registry? |
|---|---|---|
| `liquidity` | `#2061DE` blue | ✅ yes |
| `market` | `#0C3024` forest | ✅ yes |
| `legal` | `#6B6B6B` steel | ✅ yes |
| `climate` | `#2E8B7A` teal | ✅ yes |
| `construction` | `#C79F6B` copper | ❌ **not a registry value** |
| `operational` | `#E8672E` hazard | ❌ **not a registry value** |
| `reputation` | `#8B5FBF` purple | ❌ **not a registry value** |
| `compliance` | `#1FAA59` confirm | ❌ **not a registry value** |

---

## MY PROPOSAL — map the four orphans, add two colours

The four design-only names are close synonyms for four registry values.
Mapping them costs nothing and needs no amendment. Two registry values have
no equivalent at all and need a new colour.

| Registry value | Proposed colour | Source | Reasoning |
|---|---|---|---|
| `liquidity` | `#2061DE` | unchanged | |
| `market` | `#0C3024` | unchanged | |
| `legal` | `#6B6B6B` | unchanged | |
| `climate` | `#2E8B7A` | unchanged | |
| `operator` | `#E8672E` | ← `operational` | An operator failing *is* operational risk. Same concept, one names the party. |
| `regulatory` | `#1FAA59` | ← `compliance` | Compliance risk *is* regulatory risk. |
| `counterparty` | `#8B5FBF` | ← `reputation` | ⚠️ **Weakest of the four.** Not synonyms — reused because purple is otherwise unspent and counterparty risk needs a colour. Say if you would rather keep purple for reputation and give counterparty something else. |
| `interest_rate` | `#C79F6B` | ← `construction` | ⚠️ Copper is the **currency** token. Interest rate *is* a cost-of-money risk, so the association is defensible — but copper is reserved under the Metric Grammar and this stretches it. |
| `currency` | **`#B8873F`** *(new)* | new | Amber-gold. Adjacent to copper because FX is also money, distinct enough to read apart. |
| `technology` | **`#5A7D9A`** *(new)* | new | Slate blue. Cool and unalarming — technology risk is usually latent, not acute. |

**Two of these I am least sure about**, flagged above: `counterparty ← reputation`
and `interest_rate ← construction`. Both are reuse rather than mapping.

---

## Also decide: what happened to `construction` and `reputation`?

The design system has colours for two risks the registry does not track.

⬜ **`construction` risk** — build cost overrun, delay, contractor failure.
Real for a platform doing development. The registry has no value for it.

- [ ] Add `construction` to the registry *(constitutional amendment — `Risk.risk_category` is ratified)*
- [ ] Fold into `operator`
- [ ] Drop it

⬜ **`reputation` risk** — brand damage, member confidence, press.

- [ ] Add `reputation` to the registry *(constitutional amendment)*
- [ ] Fold into `market`
- [ ] Drop it

If you add either, `Risk.risk_category` goes from 10 values to 11 or 12,
which is a §32a amendment: 30 days notice, Constitutional Impact Assessment,
≥76% Special Resolution. Not difficult, but not silent either.

---

## ⬜ RETURN THIS

```
Colour assignments (accept mine, or overwrite):

  liquidity      #2061DE   [ ]
  market         #0C3024   [ ]
  legal          #6B6B6B   [ ]
  climate        #2E8B7A   [ ]
  operator       #E8672E   [ ]
  regulatory     #1FAA59   [ ]
  counterparty   #8B5FBF   [ ]   <- least confident
  interest_rate  #C79F6B   [ ]   <- least confident
  currency       #B8873F   [ ]   <- new
  technology     #5A7D9A   [ ]   <- new

construction risk:  add to registry / fold into operator / drop
reputation risk:    add to registry / fold into market / drop

Anything missing from the ten?
```

**Fastest path:** `ACCEPT ALL` and I apply the table above, log the two
weak mappings for later, and drop `construction` and `reputation`. Every
category gets a distinct colour and nothing renders grey.
