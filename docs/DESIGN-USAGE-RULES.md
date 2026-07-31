# Design Usage Rules

**Wave 4 · Primitive Surface**
**Authority:** L1-01 §29 Design Supremacy Clause · `GC-DesignSystem.html` v3.0 LOCKED

These are **usage constraints, not palette changes.** The token package is
locked (§29) and nothing here alters a single value. What follows is what
the arithmetic says about using those values safely.

Regenerate the measurements with `npm run lint:token`.

---

## 1. Four contrast constraints, measured

WCAG AA requires **4.5:1** for text and **3:1** for UI components that carry
meaning. Computed against the actual token values:

| Token | Ground | Ratio | Verdict |
|---|---|---|---|
| `forest` | `void` | **1.38:1** | Accent only. Effectively invisible. |
| `copper` | `paper` | **2.18:1** | Accent only. |
| `confirm` | `paper` | **2.70:1** | Accent only. |
| `hazard` | `paper` | **2.93:1** | Accent only, marginally. |

Everything else clears at least AA UI, and every body-text pairing clears AA
text. The system is sound; these four are ground-specific.

### 1.1 `forest` on `void` — 1.38:1

`forest` (#0C3024) is a very dark green. `void` (#0A0A0A) is near-black. In
Obsidian mode the two are almost the same colour.

**Rule:** `forest` may not carry meaning on `void`. It is the heritage and
land signal, and in dark mode it must appear as a **fill behind lighter
content**, never as a foreground mark, rule, or text colour.

Where a heritage signal is needed on `void`, use a label. A colour nobody
can see is not a signal.

### 1.2 `copper` on `paper` — 2.18:1

This is the consequential one. `copper` is the **currency** token under the
Metric Grammar — every money figure in the system.

**Rule:** in Concrete (light) mode, a money figure must not rely on `copper`
alone. Money is already distinguished by `Space Mono` and
`font-variant-numeric: tabular-nums`; those carry the signal, and `copper`
tints it. In Obsidian mode `copper` clears AA text at 8.11:1 and may carry
the signal by itself.

### 1.3 `confirm` and `hazard` on `paper`

**Rule:** in Concrete mode both need a text label beside the colour. A green
dot and an amber dot at 2.7:1 and 2.93:1 are not reliably distinguishable
for a red-green colour-deficient reader on a light ground — and that is
roughly one in twelve men.

---

## 2. The rule these four share

**Colour is never the only carrier of meaning.**

This is a WCAG requirement (1.4.1 Use of Colour) and it happens to resolve
every constraint above without touching a token. A status pill carries a
label. A metric carries a unit. A risk band carries a word.

The palette then does what a palette should — it makes a meaning *faster*
to find, not *possible* to find.

---

## 3. Constraints that come from the system, not from contrast

| Rule | Source |
|---|---|
| Zero radius. GC never rounds a corner. | Token package: `RADIUS.none = 0px` |
| Circles only for status LEDs and the Trinity Lens. | Design system §29 |
| No drop shadows. Depth comes from hairlines. | Design system §29 |
| `copper` is currency and nothing else. | Metric Grammar |
| `critical` is the rarest colour. Breach and denial only. | Metric Grammar · budgeted at 12 in `enum-lint` |
| Four type roles: Outfit display, Inter body, Space Mono data, Playfair editorial italic. | §29b |
| Six information levels IL-1…IL-6, by weight and opacity. | Token package `IL` |

`critical` has a **budget**, enforced by `enum-lint`: at most 12 enum values
may carry it. Spending it on ordinary states leaves nothing that still
registers when a real breach happens.

---

## 4. Accessibility requirements

Carried into every atom specification and checked in `token-lint`:

- **Contrast** — AA computed from the token package, not eyeballed
- **Focus** — visible, 2px outline, 2px offset. Never `outline: none`
- **Keyboard** — full tab order; Enter confirms; Escape dismisses
- **Motion** — every animation respects `prefers-reduced-motion: reduce`
- **Labels** — a real `<label>`, never a placeholder standing in for one
- **Screen readers** — every enum value has accessible text; the eleven
  whose visible label is ambiguous carry an explicit override in
  `constants/enums.ts`

---

## 5. What the literal linter covers, and does not

`token-lint` scans `components/`, `app/`, `lib/ui/` and `packages/` for
literal colours, radii, durations and spacing.

**It currently scans zero files, because none of those directories exist
yet.** The check is in place ahead of the surface it guards, deliberately —
the first component written will be checked, rather than the check arriving
after a hundred literals have already been typed.
