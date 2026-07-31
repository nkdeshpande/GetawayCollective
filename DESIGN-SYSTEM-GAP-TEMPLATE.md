# DESIGN SYSTEM — GAP TEMPLATE

**31 Jul 2026 · Before Wave 7**
**Audited against `constants/tokens.ts`, `constants/tokens-addendum.ts`, `constants/enums.ts`, `constants/organisms.ts`**

The system is strong where it has been specified and completely absent in
places nobody has needed yet. This lists both, so you only fill the gaps.

**How to use:** every ⬜ is a fill-in. Where I have a defensible default it is
written in and marked *PROPOSED* — write `ACCEPT` or overwrite it. Where I
have no basis to guess, it is marked ⚠️ **NO DEFAULT** and I have said why.

---

# PART 0 — WHAT ALREADY EXISTS

Do not re-specify these. They are locked, tested, and enforced by 15 gate
checks.

| Tier | Covered | Where |
|---|---|---|
| **01 Tokens** | 21 colours (17 core + 4 contrast variants) · 4 typefaces · 10 spacing steps · radius `0px` · stroke 1/2px · 4 motion curves · 8 durations · IL-1…IL-6 · metric grammar · 4 density modes + row heights · 4 visual mode grounds · z-index scale · backdrop dim/blur | `tokens.ts` + `tokens-addendum.ts` |
| **04 Organisms** | 10 declared with field order, IL level, metric kind, density behaviour | `organisms.ts` |
| **05 Financial Objects** | 7 metric kinds, tones, formatting, Indian grouping, provisional marking | `lib/metric-grammar.ts` |
| **Motion** | 4 named transition patterns · micro-interaction choreography · reduced-motion contract | `tokens-addendum.ts` |
| **Overlays** | 3 classes + reversibility-keyed dismissal | `tokens-addendum.ts` |
| **Notifications** | 4 classes + escalation ladder | `tokens-addendum.ts` |
| **Brand** | Wordmark · clearspace · iconography rule · imagery direction · voice | `tokens-addendum.ts` + L1-02 Part VII |
| **Enumerations** | 135 values, tone + description + accessible text | `enums.ts` |
| **Validation copy** | 25 rules × message/help/a11y | `validation.ts` |
| **Accessibility** | Computed WCAG audit, ground variants, colour-never-alone rule | `token-lint.js` + `DESIGN-USAGE-RULES.md` |

---

# PART 1 — THE FIVE THAT BLOCK WAVE 7

Wave 7 builds workspaces. These five are needed before a screen can be laid
out at all.

---

## GAP 1 · TYPE SCALE ⚠️ HIGHEST PRIORITY

**Status: completely absent.** We have four *typefaces* and no *sizes*. There
is currently no answer to "how big is an H2".

IL-1…IL-6 give weight and opacity only.

### ⬜ Fill in

*PROPOSED — a 1.25 major-third scale on a 16px base, which pairs with the
4px spacing grid (every value lands on a 4px multiple or half-step).*

| Role | Size | Line height | Letter spacing | Weight | Used for |
|---|---|---|---|---|---|
| `display-xl` | 56px | 1.05 | −0.02em | 200 | Full-bleed hero only |
| `display-l` | 44px | 1.10 | −0.01em | 200 | Page title |
| `display-m` | 32px | 1.15 | −0.01em | 300 | Section opener |
| `heading` | 24px | 1.25 | 0 | 300 | Card group heading |
| `subheading` | 18px | 1.35 | 0 | 400 | Card title |
| `body-l` | 17px | 1.55 | 0 | 400 | Narrative copy |
| `body` | 15px | 1.55 | 0 | 400 | Default |
| `body-s` | 13px | 1.50 | 0 | 400 | Dense tables |
| `caption` | 12px | 1.40 | +0.01em | 400 | Metadata, IL-5 |
| `micro` | 11px | 1.30 | +0.08em | 400 | Eyebrows, labels, IL-6 |
| `mono-l` | 20px | 1.30 | 0 | 400 | Headline figures |
| `mono` | 14px | 1.45 | 0 | 400 | Table figures, IDs |
| `mono-s` | 11px | 1.40 | 0 | 400 | Audit density |

```
⬜ ACCEPT / amend:



⬜ Measure (max line length for body copy):  PROPOSED 65ch


⬜ Does the scale change per density mode, or only the spacing?
   PROPOSED: only spacing changes. Type stays fixed so figures stay comparable
   across modes.

```

---

## GAP 2 · GRID & BREAKPOINTS ⚠️

**Status: absent.** No column count, no gutters, no breakpoints. Nothing can
be laid out responsively.

### ⬜ Fill in

*PROPOSED — 12 columns, gutters from the existing spacing scale.*

| Breakpoint | Min width | Columns | Gutter | Margin | Notes |
|---|---|---|---|---|---|
| `compact` | 0 | 4 | 16px | 16px | Phone. Tables become stacked cards. |
| `medium` | 768px | 8 | 24px | 32px | Tablet. |
| `wide` | 1180px | 12 | 24px | 48px | Default desktop. |
| `ultra` | 1680px | 12 | 32px | auto (max 1600px) | Trading-desk width. |

```
⬜ ACCEPT / amend:



⬜ Max content width:  PROPOSED 1600px

⬜ Does a financial table ever go full-width edge-to-edge?
   PROPOSED: no. FB-1 already bars full-bleed wherever numeric data is read.

⬜ Is the platform desktop-first or does phone matter?
   ⚠️ NO DEFAULT — this changes everything downstream. A capital allocation
   terminal and a member checking a distribution on a phone are different
   products. Which is the primary surface?

```

---

## GAP 3 · TABLES ⚠️

**Status: absent, and this is the densest surface in a PE platform.** The
ledger, the capital table, the risk register, the waterfall — all tables.

### ⬜ Fill in

| Question | PROPOSED | ⬜ |
|---|---|---|
| Column alignment | Money and figures **right**. Text **left**. Enums **left**. Dates **right**. | |
| Header treatment | `micro` type, uppercase, `steel`, 1px bottom hairline | |
| Row separator | 1px hairline, no zebra striping | |
| Row height | From `DENSITY_ROW`: 28 / 40 / 64 / 22px | |
| Hover | Row background lifts to `voidPanel` / `paperPanel`, 120ms linear | |
| Sort | Single column, click header, arrow in `micro`. No multi-sort. | |
| Pinning | First column pins on horizontal scroll | |
| Totals row | Bold weight (IL-2), 2px top rule, never a background fill | |
| Empty cell | `—` em-dash in `steel`, never blank | |
| Long text | Truncate with ellipsis, full value in `title` | |

```
⬜ ACCEPT / amend:


⬜ Maximum rows before pagination:  PROPOSED 100, then cursor pagination

⬜ Does a table ever nest (expandable rows)?
   PROPOSED yes, one level only — a distribution expanding into its six
   waterfall stages is the obvious case.

```

---

## GAP 4 · FORMS & INPUTS ⚠️

**Status: absent.** `validation.ts` has the *messages*; nothing has the
*fields*.

### ⬜ Fill in

| Element | PROPOSED | ⬜ |
|---|---|---|
| Input height | 40px comfortable, 32px compact | |
| Input border | 1px `hairline`, 0 radius | |
| Focus | Border 1→2px `electric`, no glow, 0ms (per `MICRO.focus`) | |
| Label | Above the field, `caption`, always a real `<label>` — never a placeholder standing in | |
| Help text | Below the field, `caption`, `steel`, always present when the rule has one | |
| Error | Below help, `caption`, `critical`, with a 2px left rule | |
| Required | Asterisk in `hazard` after the label | |
| Money input | `mono`, right-aligned, symbol as a fixed prefix outside the field | |
| Disabled | 0.45 opacity (IL-5), no pointer, no colour change | |
| Read-only | No border, `mono` if a figure | |

```
⬜ ACCEPT / amend:


⬜ Validation timing:  PROPOSED on blur, then live once a field has errored.
   Never on every keystroke from the start.

⬜ Do forms autosave?
   ⚠️ NO DEFAULT — matters for the accreditation process, whose steps are
   explicitly resumable. If forms autosave, resume is free; if not, PR-01
   needs a draft mechanism.

```

---

## GAP 5 · NAVIGATION & THE HUD RAIL ⚠️

**Status: referenced repeatedly, never specified.** GC.SYSTEM names a
"52-Route IA Matrix", a "HUD Rail" (where the Alert Center lives), and the
"Trinity Lens" (Space / Capital / Time). None is defined.

### ⬜ Fill in — the six route groups exist; their contents do not

| Group | Prefix | PROPOSED contents | ⬜ |
|---|---|---|---|
| Gateway | `(gateway)` | Root, offering pages, public thesis | |
| Space | `(space)` | Property list, property detail, portfolio | |
| Capital | `(capital)` | Positions, commitments, capital calls, distributions, waterfall | |
| Time | `(time)` | Entitlement calendar, horizon | |
| Member | `(member)` | Passport, documents, reports, ballots | |
| Admin | `(admin)` | Vehicles, governance, compliance, ledger, telemetry | |

```
⬜ The full route list (or ACCEPT the six groups and I derive routes
   from the 27 L2 objects + 10 organisms):



⬜ HUD Rail — is it persistent chrome on every screen, or admin only?
   PROPOSED: persistent, collapsed to a 48px edge rail, holding the Alert
   Center and the Trinity Lens toggle.


⬜ Trinity Lens — what exactly does it switch?
   ⚠️ NO DEFAULT. Three readings are possible and they build different
   products:
     (a) a FILTER on one screen (show this property's space / capital / time)
     (b) three top-level SECTIONS of the app
     (c) three PANELS shown side by side
   Which?

```

---

# PART 2 — NEEDED SOON, NOT BLOCKING

---

## GAP 6 · CHARTS & DATA VISUALISATION

**Status: absent.** A PE platform without charts is a spreadsheet.

### ⬜ Which charts does GC actually need?

*PROPOSED minimum set:*

| Chart | For | Metric kinds |
|---|---|---|
| **Waterfall bar** | The six distribution stages | currency, loss |
| **NAV over time** | Valuation history per property/vehicle | currency, forecast |
| **IRR curve** | Cash flows and return | percentage, forecast |
| **Allocation bar** | Capital table by holder | percentage |
| **Reserve gauge** | Balance against floor, four bands | percentage |
| **Sparkline** | Inline trend in a table row | any |

```
⬜ ACCEPT / add / remove:


⬜ Chart rules — PROPOSED:
   - No 3D, no gradients, no drop shadows (consistent with §29)
   - Axis lines are hairlines; gridlines only where a value must be read off
   - Series colours come from METRIC_COLOUR, never from a chart palette
   - A forecast segment is dashed AND electric — never colour alone
   - Zero baseline always shown; a truncated y-axis is barred on financial data
   ACCEPT / amend:


⬜ Do charts animate on load?
   PROPOSED: yes, 600ms ease-cinema, but ONLY on first paint. Never on
   re-render — a figure that moves when data refreshes is unreadable.

```

---

## GAP 7 · ATOMS & MOLECULES (Tiers 02–03)

**Status: named in GC.SYSTEM, never specified.** Organisms (Tier 04) exist;
the pieces they are made of do not.

### ⬜ Confirm the inventory

*Named in GC.SYSTEM:*

| Ref | Name | Specified? |
|---|---|---|
| A-01 | Tag Pill | ⬜ |
| A-03 | Mono Input Field | ⬜ |
| A-10 | Confidence Tag | partly — tones exist in `CONFIDENCE_COLOUR` |
| A-11 | Health Score Ring | ⬜ |
| M-04 | The Piston (hold-to-commit) | motion spec exists; visual does not |
| M-06 | Recovery Strip | ⬜ |
| M-16 | Append-Only Ledger Row | field order exists as O-08 |

```
⬜ Full atom list (or ACCEPT and I derive from the 10 organisms):



⬜ The Piston — visual specification:
   Motion is locked (3000ms linear, no easing, static numeral under reduced
   motion). The VISUAL is not.
   ⚠️ NO DEFAULT — this is the single most important control in the product
   and its look is a brand decision. Bar? Ring? Filling text?

```

---

## GAP 8 · STATES: EMPTY, LOADING, ERROR

**Status: absent.** Every surface needs three states nobody has designed.

```
⬜ Empty state — PROPOSED: one line in `body`, `steel`, plus the action that
   would fill it. No illustration, no mascot.
   ACCEPT / amend:


⬜ Loading — PROPOSED: mono ellipsis cycle (already in MICRO.loading), never
   a spinner graphic. Skeleton rows for tables, matching final row height so
   nothing shifts when data arrives.
   ACCEPT / amend:


⬜ Error — PROPOSED: the validation message layer already covers field-level.
   Page-level uses the Banner (NT-02). Never a full-page error illustration.
   ACCEPT / amend:


⬜ Stale data — how is a figure shown when its provenance has DECAYED?
   The spine computes it (verified → estimated past its window). The display
   does not yet show it.
   PROPOSED: the provisional mark `~` plus the confidence tag, same as a
   forecast.

```

---

## GAP 9 · REPORTS, PRINT & EMAIL

**Status: absent.** Investor reports get printed and emailed. Neither surface
exists.

```
⬜ Print stylesheet — PROPOSED: force Concrete mode (paper ground), drop all
   chrome, expand every truncation, print the provenance of every figure in
   a footnote.
   ACCEPT / amend:


⬜ Does GC issue a PDF investor report?
   ⚠️ NO DEFAULT — if yes, it is a design surface in its own right with page
   furniture, running heads and a cover. Yes/no?


⬜ Transactional email — the scaffold has packages/email. Which emails exist?
   PROPOSED minimum: capital call notice, distribution executed, distribution
   blocked with reason, accreditation expiring, ballot open, resolution
   published, reserve breach broadcast.
   ACCEPT / add:

```

---

# PART 3 — SMALLER GAPS

```
⬜ ELEVATION — §29 says no drop shadows, depth from hairlines. But overlays
   need to sit above content. Is depth ONLY the z-index scale plus backdrop
   blur, or is there a surface-lift treatment?
   PROPOSED: z-index + backdrop only. Panels lift by 1 step of background
   (void → voidPanel), never by shadow.


⬜ ICON SET — the RULE exists (1px stroke, square frame, no fills, mono
   glyphs where possible). The SET does not.
   PROPOSED: no icon font. Use Space Mono glyphs and ~20 hand-drawn 1px SVGs
   for what mono cannot express (chevron, close, filter, sort, download,
   external, lock, check, alert).
   ⬜ Full list, or ACCEPT:


⬜ IMAGERY — direction exists (architectural, desaturated 20–30%, contrast
   slightly high, no lifestyle stock). Specs do not.
   ⬜ Aspect ratios:  PROPOSED 3:2 cards, 16:9 hero, 1:1 thumbnails
   ⬜ Is there a photo library, or is this commissioned per property?


⬜ HAPTICS & SOUND — the GC.SYSTEM scaffold names use-haptics and haptic
   MP3s. Nothing is specified.
   ⚠️ NO DEFAULT. Does GC use haptics at all? If so, the obvious single use
   is the Piston reaching completion.


⬜ MODE SWITCHING — four grounds exist (concrete, obsidian, immersive,
   terminal). How does a member change mode?
   PROPOSED: follows OS preference by default, with a manual override in the
   HUD Rail that persists. Terminal mode is admin-only and never auto-selected.


⬜ TERMINAL MODE — it has tokens (#05100A background, #39FF6A matrix green)
   and no stated purpose.
   ⚠️ NO DEFAULT — what is it FOR? Ops console? Audit view? It currently
   exists as a colour pair with no home.

```

---

# PART 4 — FASTEST PATH

If you have limited time, these five unblock Wave 7 and nothing else does:

| # | Gap | Why it blocks |
|---|---|---|
| 1 | **Type scale** | No screen can be laid out without sizes |
| 2 | **Grid & breakpoints** | Same, for layout |
| 3 | **Desktop-first or phone-parity?** | Changes every downstream decision |
| 4 | **Trinity Lens — filter, sections, or panels?** | It appears in the navigation of every screen |
| 5 | **The Piston's visual** | The single most important control in the product |

Items 1 and 2 have proposed defaults you can accept in one word. Items 3, 4
and 5 have **no default** — I have no basis to choose, and choosing wrongly
would be expensive to unwind.

Everything else in this document can follow during Wave 7 without stalling it.

```
⬜ RETURN:

  1. Type scale:        ACCEPT / amended below
  2. Grid:              ACCEPT / amended below
  3. Primary surface:   desktop-first / phone-parity / phone-first
  4. Trinity Lens:      filter / sections / side-by-side panels
  5. Piston visual:     bar / ring / filling text / other

```
