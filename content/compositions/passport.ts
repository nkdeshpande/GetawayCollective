/**
 * The Passport — PR-01 accreditation as sixteen composed stages, plus
 * the hub and /search.
 *
 * One table drives all sixteen stage pages: each row is a stage with
 * its fields, and the composition is derived from the row. The stages
 * are the same PR-01 process the worked flow compresses into three
 * steps at /flow/accreditation — this is the full-length instrument.
 *
 * Every stage page carries the same three properties:
 *   resumable   every field saves on leaving it
 *   honest      nothing pretends to submit (NOT_WIRED, stated)
 *   sequenced   each page names its place and links its neighbours
 */
import type { Entry, Section } from "@/app/_assemblies/compose";
import { d, NOT_WIRED } from "./shared";

interface StageRow {
  slug: string;
  n: number;
  t: string;
  what: string;
  fields: readonly { id: string; label: string; help?: string; type?: string }[];
  note?: string;
}

const ROWS: readonly StageRow[] = [
  { slug: "discover", n: 1, t: "Discover", what: "How you found the platform, and what you are looking for.",
    fields: [
      { id: "source", label: "How did you find Getaway Collective?" },
      { id: "intent", label: "What are you looking to do?", help: "One line. It shapes nothing except how we write to you." },
    ] },
  { slug: "eligibility", n: 2, t: "Eligibility", what: "The two facts that gate an application: age and residency.",
    fields: [
      { id: "age", label: "Confirm you are 18 or older", help: "Type YES. A partner must be able to contract." },
      { id: "residency", label: "Country of tax residency" },
    ] },
  { slug: "identity", n: 3, t: "Identity", what: "Your legal name, exactly as your identity document states it.",
    fields: [
      { id: "name", label: "Full legal name", help: "As on your identity document." },
      { id: "dob", label: "Date of birth", type: "date" },
    ] },
  { slug: "address", n: 4, t: "Address", what: "Residential address, for the register and for notices.",
    fields: [
      { id: "addr1", label: "Address" },
      { id: "city", label: "City" },
      { id: "pin", label: "PIN code" },
    ] },
  { slug: "tax-residency", n: 5, t: "Tax residency", what: "PAN, and any second residency that changes reporting.",
    fields: [
      { id: "pan", label: "PAN", help: "Ten characters. Uppercase because a PAN is uppercase." },
      { id: "fatca", label: "Any tax residency outside India?", help: "Country, or NONE." },
    ] },
  { slug: "source-of-funds", n: 6, t: "Source of funds", what: "Where committed capital originates. Stated, not audited here.",
    fields: [
      { id: "source", label: "Primary source of funds", help: "Salary, business income, sale of assets, inheritance — in your words." },
    ] },
  { slug: "suitability", n: 7, t: "Suitability", what: "Whether a long-hold, illiquid position fits your situation.",
    fields: [
      { id: "horizon", label: "Investment horizon, in years" },
      { id: "share", label: "Share of your investable assets this would represent", help: "A percentage. There is no right answer; there is an honest one." },
    ],
    note: "A commitment here is illiquid for 36 months and depends on a property that is not yet built. " +
          "Suitability is about whether that shape fits your life, not whether you can afford it." },
  { slug: "risk-profile", n: 8, t: "Risk profile", what: "What losses you can carry, in your own words.",
    fields: [
      { id: "tolerance", label: "The largest loss you could absorb without changing your plans" },
    ] },
  { slug: "documents", n: 9, t: "Documents", what: "Identity and address proof. Uploads open when storage connects.",
    fields: [] },
  { slug: "screening", n: 10, t: "Screening", what: "Sanctions and PEP screening, run by the platform on submission.",
    fields: [] },
  { slug: "accreditation", n: 11, t: "Accreditation", what: "The declaration that you meet the criteria for this offering class.",
    fields: [
      { id: "declare", label: "Type I DECLARE to confirm the accreditation statement",
        help: "The statement itself is shown in full at review, before anything is submitted." },
    ] },
  { slug: "review", n: 12, t: "Review", what: "Everything you have entered, on one page, before submission.",
    fields: [] },
  { slug: "decision", n: 13, t: "Decision", what: "The platform's decision, within 15 working days of submission.",
    fields: [] },
  { slug: "issued", n: 14, t: "Issued", what: "The passport itself: what accreditation opens, and for how long.",
    fields: [] },
  { slug: "annual-review", n: 15, t: "Annual review", what: "Accreditation is maintained, not permanent. The evidence holds; the decision expires.",
    fields: [] },
  { slug: "profile", n: 16, t: "Profile", what: "The standing record this process created, and how to correct it.",
    fields: [] },
];

const stagePage = (r: StageRow): Entry => ({
  title: r.t,
  eyebrow: `Passport · stage ${String(r.n).padStart(2, "0")} of ${ROWS.length}`,
  lead: r.what,
  disclosure: d(
    "The shape of the stage — anyone may read what accreditation asks before starting it.",
    "This is the KYC surface itself: your own entries, resumable at any time.",
    "Complete and read-only after commitment; corrections go through the profile stage.",
    "Annual review reopens exactly this record once a year. Evidence holds; the decision expires.",
  ),
  sections: [
    ...(r.fields.length
      ? [{ kind: "form", label: "This stage",
           fields: r.fields, submit: r.n < 12 ? "Save and continue" : "Submit",
           note: NOT_WIRED } as Section]
      : [{ kind: "empty",
           what: "Nothing to enter at this stage",
           because: r.slug === "documents"
             ? "Uploads need storage, which is not connected. The stage exists so the sequence is complete and the requirement is visible."
             : r.slug === "screening"
               ? "Screening runs on the platform's side after submission. You will see its outcome at the decision stage, never its workings."
               : "This stage reports on your application rather than collecting from it.",
           when: r.slug === "decision"
             ? "A decision arrives within 15 working days of submission. An application in flight completes before any suspension applies (§24b)."
             : "It fills as the process advances." } as Section]),
    ...(r.note ? [{ kind: "note", tone: "hazard", text: r.note } as Section] : []),
    { kind: "links", items: [
      ...(r.n > 1 ? [{ t: "← " + ROWS[r.n - 2].t, to: `/passport/${ROWS[r.n - 2].slug}` }] : []),
      { t: "Passport overview", to: "/passport" },
      ...(r.n < ROWS.length ? [{ t: ROWS[r.n].t + " →", to: `/passport/${ROWS[r.n].slug}`, primary: true }] : []),
    ] },
  ],
});

export const PASSPORT_PAGES: Record<string, Entry> = {
  "/passport": {
    title: "The Passport",
    eyebrow: "PR-01 · Accreditation",
    lead: "Sixteen stages, resumable at every one. A decision within 15 working days of submission.",
    disclosure: d(
      "The full sequence and what each stage asks — readable before you identify yourself.",
      "Your own application: progress, drafts, and every saved answer.",
      "The completed record, read-only, with the decision attached.",
      "The annual review cycle: the decision expires yearly; the evidence does not.",
    ),
    sections: [
      { kind: "stages", label: "The sequence",
        items: ROWS.map((r) => ({ n: String(r.n).padStart(2, "0"), t: r.t, now: r.n === 1 })),
        note: "Every field saves as you leave it. Nothing here has to be done in one sitting, and " +
              "the short form of this same process is the three-step accreditation inside the worked flow." },
      { kind: "links", items: [
        { t: "Begin at Discover", to: "/passport/discover", primary: true },
        { t: "The short form, inside the flow", to: "/flow/accreditation" },
      ] },
    ],
  },

  ...Object.fromEntries(ROWS.map((r) => [`/passport/${r.slug}`, stagePage(r)])),

  "/search": {
    title: "Search",
    eyebrow: "Gateway",
    lead: "The platform is small enough to know. Search covers the collection, the journal and the standing documents.",
    disclosure: d(
      "Public surfaces: the collection, the journal, the legal corpus.",
      "Identical — search does not widen with accreditation.",
      "Member surfaces join the index for you: your vehicle, documents and resolutions.",
      "Operational records join as they exist. Search never returns what your vantage cannot open.",
    ),
    sections: [
      { kind: "form", label: "Query",
        fields: [{ id: "q", label: "What are you looking for?" }],
        submit: "Search",
        note: "The index is static in this build; the shelves below cover everything it would return." },
      { kind: "cards", label: "The shelves", items: [
        { t: "The Collection", meta: "Places", body: "Every property, its vehicle, its figures and its plates." },
        { t: "The Journal", meta: "Writing", body: "Essays and field notes. Everything dated, nothing anonymous." },
        { t: "The Legal Corpus", meta: "Documents", body: "Seven standing documents, versioned, with effective dates." },
      ] },
      { kind: "links", items: [
        { t: "Collection", to: "/collection", primary: true },
        { t: "Journal", to: "/journal" },
        { t: "Legal", to: "/legal" },
      ] },
    ],
  },
};
