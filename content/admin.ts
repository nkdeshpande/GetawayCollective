/**
 * THE ADMIN SURFACES
 *
 * Wave 8 · Content
 *
 * Three things an operator needs that did not exist: forming a vehicle,
 * managing the content that binds, and managing media.
 *
 * ── WHY FORMATION IS A SEQUENCE AND NOT A FORM ───────────────────────
 * Forming a vehicle is not filling in a record. It is a series of acts,
 * several of which cannot be undone and two of which need somebody
 * else's approval first. A single long form invites the operator to
 * complete it and press save, which is exactly the shape that gets a
 * vehicle registered with a legal form nobody approved.
 *
 * Each stage below therefore states what it WRITES and what BLOCKS it.
 * A stage with an unmet gate cannot be passed, and the gate says who
 * clears it rather than just refusing.
 *
 * ── THE §24a GATE ────────────────────────────────────────────────────
 * The LLP is the constitutional default. Any other legal form requires
 * Board approval FOR THE SPECIFIC PROPERTY, and the approval reference
 * is recorded on the vehicle rather than asserted in a checkbox. That is
 * the one gate on this screen most likely to be worked around under time
 * pressure, so it is the one stated most plainly.
 */

import type { Right } from "../lib/authority";

export type Gate =
  | { kind: "right"; right: Right }
  | { kind: "approval"; body: string; instrument: string }
  | { kind: "arithmetic"; must: string }
  | { kind: "prior"; stage: string };

export interface Stage {
  n: string;
  title: string;
  /** What passing this stage puts into the record. */
  writes: readonly string[];
  /** What must be true first. An unmet gate cannot be clicked past. */
  gates: readonly Gate[];
  /** Irreversible once passed. */
  irreversible?: boolean;
  note?: string;
}

/* ═══════════════════════════════════════════════════════════════════
   FORMING A VEHICLE
   ═══════════════════════════════════════════════════════════════════ */

export const FORMATION: readonly Stage[] = [
  {
    n: "01", title: "The property",
    writes: ["Asset identifier", "Jurisdiction", "Land parcel and title reference"],
    gates: [{ kind: "right", right: "property.register" }],
    note:
      "A vehicle exists to hold one property. Forming one before the property is identified " +
      "produces a shell looking for a purpose, and shells acquire purposes nobody voted for.",
  },
  {
    n: "02", title: "The legal form",
    writes: ["Legal form", "Board approval reference, where the form is not an LLP"],
    gates: [
      { kind: "right", right: "vehicle.form" },
      { kind: "approval", body: "Board", instrument: "Resolution approving the form for this property" },
    ],
    note:
      "LLP is the default and needs no approval. SPV, fund, trust and syndicate each need a " +
      "Board resolution naming this property. The reference is recorded on the vehicle; a " +
      "checkbox asserting that approval exists is not the same as the approval.",
  },
  {
    n: "03", title: "Registration",
    writes: ["Registered name", "LLPIN", "Registrar", "Date of incorporation", "Registered office"],
    gates: [{ kind: "prior", stage: "02" }, { kind: "right", right: "vehicle.form" }],
    irreversible: true,
    note:
      "The filing is made with the Registrar. From here the vehicle exists in law and cannot be " +
      "un-formed — only wound up, which is a different act with a different right.",
  },
  {
    n: "04", title: "The Agreement",
    writes: ["LLP Agreement", "Voting thresholds", "Lock-in", "Transfer conditions", "Reserved matters"],
    gates: [{ kind: "prior", stage: "03" }, { kind: "right", right: "vehicle.form" }],
    note:
      "Thresholds are contribution-weighted and are not free text: more than 50% ordinary, at " +
      "least 76% special, 100% for entrenched principles, and a tie fails. The Agreement may " +
      "raise a threshold and may not lower one below the constitutional floor.",
  },
  {
    n: "05", title: "The capital stack",
    writes: ["Equity layer", "Debt facility, if any", "Unit size", "Units issued"],
    gates: [
      { kind: "prior", stage: "04" },
      { kind: "arithmetic", must: "Units × unit size equals the equity layer exactly" },
    ],
    note:
      "Checked by largest-remainder allocation rather than by multiplication, so a stack that " +
      "is a rupee out cannot be saved. The sum of every ownership position must equal units " +
      "issued — invariant F-02.",
  },
  {
    n: "06", title: "The waterfall",
    writes: ["Six stages, in order, with their basis points"],
    gates: [
      { kind: "prior", stage: "05" },
      { kind: "arithmetic", must: "The six stages sum to exactly 100%" },
    ],
    note:
      "Debt service is its own stage and sits ahead of partners. A waterfall that does not close " +
      "to 100% has a stage nobody declared, and the screen will not accept one.",
  },
  {
    n: "07", title: "The reserve floor",
    writes: ["Reserve floor basis", "Opening balance"],
    gates: [{ kind: "prior", stage: "06" }],
    note:
      "Six months of non-operational fixed obligations, or the Board-approved minimum, whichever " +
      "is greater. Not NAV-linked — invariant F-06. Stage six is blocked whenever paying it " +
      "would take the balance below this floor.",
  },
  {
    n: "08", title: "Formation",
    writes: ["InvestmentVehicleFormed event", "The reason for forming", "The register, opened"],
    gates: [{ kind: "prior", stage: "07" }, { kind: "right", right: "vehicle.form" }],
    irreversible: true,
    note:
      "The capability requires a recorded reason. The vehicle enters the Forming state; it is " +
      "not raising until an offering is opened, which is a different right held by a different " +
      "office.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   CONTENT
   ═══════════════════════════════════════════════════════════════════ */

export interface ContentClass {
  name: string;
  source: string;
  binds: boolean;
  versioned: boolean;
  note: string;
}

export const CONTENT_CLASSES: readonly ContentClass[] = [
  {
    name: "Standing documents", source: "content/legal.ts", binds: true, versioned: true,
    note:
      "Seven documents. A partner acknowledges a VERSION, and the version they acknowledged stays " +
      "retrievable when the document is amended. Publishing withdraws the previous version rather " +
      "than overwriting it.",
  },
  {
    name: "The Journal", source: "content/journal.ts", binds: false, versioned: false,
    note:
      "Eight entries. An entry may explain a rule and may not create one — every figure is read " +
      "from a registry at render, so an entry cannot describe a platform that does not exist.",
  },
  {
    name: "Public pages", source: "content/public.ts", binds: false, versioned: false,
    note: "Twelve pages. Two carry a statement that their roster is not yet populated.",
  },
  {
    name: "Member surfaces", source: "content/member.ts", binds: false, versioned: false,
    note:
      "Six surfaces. One carries a capability marked specified-but-not-in-force, and a load-time " +
      "check refuses to let that mark be removed.",
  },
  {
    name: "Gateway surfaces", source: "content/gateway.ts", binds: false, versioned: false,
    note:
      "The portfolio, gallery, story, answers and roles. Three load-time checks enforce assembly " +
      "rules: no figure in the attribute grid, every answer cited, every closed role explained.",
  },
];

export const CONTENT_RULES: readonly { k: string; v: string }[] = [
  { k: "Copy is data", v: "Every page's words live in content/, never in a component. Editing a clause and editing a layout are never the same operation." },
  { k: "Publishing needs a reason", v: "PublishContentVersion requires one. The question asked six months later is always why this changed." },
  { k: "The standing disclosure has one home", v: "Stated once, rendered by the Terms at Part L. A check fails the build if the wording appears anywhere else." },
  { k: "Vocabulary is enforced", v: "Sixteen forbidden terms, parsed from the canon by a linter that reads 208 files. A source may keep its own words; they do not cross the boundary." },
  { k: "Nothing renders unclassed", v: "A forward-looking figure carries its confidence class or it does not appear." },
];

/* ═══════════════════════════════════════════════════════════════════
   MEDIA
   ═══════════════════════════════════════════════════════════════════ */

export const MEDIA_KINDS: readonly { k: string; v: string }[] = [
  { k: "Photograph", v: "The thing as built, with the date taken. The only kind that evidences anything." },
  { k: "Render", v: "A thing not yet built. Labelled on the asset itself, not in a caption beneath it." },
  { k: "Drawing", v: "A section, plan or detail. The least flattering and the most checkable." },
];

export const MEDIA_RULES: readonly { k: string; v: string }[] = [
  { k: "Kind is required at registration", v: "There is no default and no unset. An asset with no kind cannot be registered, because the kind is the whole claim." },
  { k: "Reclassifying needs a reason", v: "Moving an asset from render to photograph is a change to what it asserts. RegisterMediaAsset requires a reason and emits MediaAssetReclassified." },
  { k: "The label travels with the image", v: "Rendered on the frame, not below it. A label that can be scrolled away from what it qualifies is not a label." },
  { k: "Date taken, not date uploaded", v: "A photograph of a property in its first season and one taken five years later are different evidence." },
  { k: "No stock", v: "An image not of a property in this collection is not registered. A generic photograph of somewhere else is a claim about nowhere." },
];

export const MEDIA_STATE = {
  registered: 0,
  note:
    "No media assets are registered. Every frame currently rendered in the gallery and the story " +
    "is a drawing generated from the property record, and each says so. Nothing in this system " +
    "has been photographed: two properties are stabilised and were acquired rather than built, " +
    "and the rest are at pre-construction or lease-up.",
} as const;

/* ── Self-checks, at load ─────────────────────────────────────────── */
{
  const ns = FORMATION.map((s) => s.n);
  if (new Set(ns).size !== ns.length) throw new Error("Duplicate formation stage number");
  if (JSON.stringify(ns) !== JSON.stringify([...ns].sort())) {
    throw new Error("Formation stages are out of order");
  }

  for (const s of FORMATION) {
    if (!s.writes.length) throw new Error(`Stage ${s.n} writes nothing`);
    if (!s.gates.length) throw new Error(`Stage ${s.n} has no gate`);
  }

  /* The §24a gate is the one most likely to be removed under pressure.
     It is checked here so that removing it fails the build rather than
     quietly permitting an unapproved legal form. */
  const form = FORMATION.find((s) => s.title === "The legal form");
  const approval = form?.gates.find((g) => g.kind === "approval");
  if (!approval) {
    throw new Error(
      "The legal-form stage must carry a Board approval gate. §24a: the LLP is the default and " +
        "any other form requires Board approval for the specific property.",
    );
  }

  /* Two stages are irreversible and must say so. */
  const irreversible = FORMATION.filter((s) => s.irreversible).map((s) => s.n);
  if (irreversible.length < 2) {
    throw new Error("Registration and formation are both irreversible and must be marked");
  }
}
