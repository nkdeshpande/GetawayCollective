/**
 * INTAKE — the document-led operating model
 *
 * Wave 2 · L5 · Serves: FIX-10 (no invisible agent actions) · E-02 (provenance)
 *                       I-02 (explicit authority) · AI_LAWS.escalationNeverApproval
 *
 * ── THE PROBLEM THIS REPLACES ────────────────────────────────────────
 * Thirty-five capabilities, each with arguments, reached through forms.
 * Somebody opens the vehicle screen and keys in forty-seven fields off a
 * workbook that is sitting open beside them. Every one of those fields is
 * a transcription, and a transcription has no source — six months later
 * the figure is in the system and the only answer to "where did this come
 * from" is a person's memory of a spreadsheet.
 *
 * That is the same defect FIX-10 names for agents, committed by a human
 * with a keyboard. A figure whose provenance is "somebody typed it" is
 * the one kind of figure this platform cannot let a partner assess.
 *
 * ── THE LAW ──────────────────────────────────────────────────────────
 * THE FILE IS THE RECORD. THE FIELD IS DERIVED.
 *
 * Every figure in the system traces to a cell, a row or a page region in a
 * deposited document. Nothing is keyed directly. To correct a figure you
 * deposit a corrected document; you do not edit a field, because editing a
 * field severs it from its source and there is no way to sever it back.
 *
 * ── WHAT THE INTELLIGENCE DOES, AND WHAT IT NEVER DOES ───────────────
 * ATLAS and IRIS classify, extract, reconcile and propose. They do not
 * approve, and `Disposition` in lib/ai/output.ts has no `approve` member
 * precisely so that they cannot. A proposal is a draft addressed to the
 * role that carries the right — it means nothing until a human holding a
 * live grant disposes of it.
 *
 * The consolidation this buys is the point: thirty-five commands and
 * thirty-three rights collapse into EIGHT queues, one per role, fed by
 * eighteen kinds of file. Nobody navigates to a capability. Work arrives.
 *
 * ── CONFIDENCE CEILINGS ──────────────────────────────────────────────
 * A document kind caps how strongly anything extracted from it may be
 * claimed. A sponsor's own workbook cannot yield a VERIFIED figure however
 * cleanly it parses — cleanliness is not corroboration. Registered title
 * can. The ceiling travels with the assertion and `weakest()` does the
 * rest, so a derived figure resting on one workbook cell can never present
 * as stronger than that cell.
 */

import type { CommandName } from "../lib/commands";
import type { Confidence } from "../lib/provenance";

/* ── Lanes ────────────────────────────────────────────────────────── */

/**
 * Two ways a capability can be reached, and only two.
 *
 * The distinction is not a convenience. A file-borne capability is
 * EVIDENCED — a document exists that says the thing happened, and the
 * system's job is to read it faithfully. A declared act is DECIDED —
 * no document precedes it, because the decision is the event. Asking an
 * agent to propose a declared act would be asking it to author the very
 * judgement the grant exists to place with a person.
 */
export type Lane = "file-borne" | "declared-act";

/** How precisely a claim can be pointed back at its source. */
export type Citation =
  /** Sheet, cell. The strongest — a reader can open the file and land on it. */
  | "cell"
  /** Sheet, row. Used where a record is the unit rather than a value. */
  | "row"
  /** Page number. */
  | "page"
  /** Page and a rectangle on it. Required wherever a figure is extracted from a scan. */
  | "page-region"
  /** The file itself, and nothing finer. Metadata only — never a figure. */
  | "file";

export interface DocumentKind {
  readonly id: string;
  readonly label: string;
  /** Extensions accepted. Anything else is refused at deposit, not at parse. */
  readonly formats: readonly string[];
  /** What a person recognises it by, in their own words. */
  readonly description: string;
  readonly citation: Citation;
  /** The capabilities this kind may raise proposals for. */
  readonly proposes: readonly CommandName[];
  /**
   * The strongest confidence class anything extracted from this kind may
   * carry. A ceiling, not a default — a clean parse does not promote it.
   */
  readonly ceiling: Confidence;
  readonly ceilingWhy: string;
}

const D = (d: DocumentKind) => d;

export const DOCUMENT_KINDS: readonly DocumentKind[] = [
  D({
    id: "llp-intake-workbook", label: "LLP intake workbook", formats: ["xlsx"],
    description: "The standing template a sponsor completes to stand up a vehicle — entity, terms, offering, unit economics.",
    citation: "cell", ceiling: "REPORTED",
    ceilingWhy: "It is the sponsor's own statement of its own vehicle. Parsing it cleanly corroborates nothing; only an independent document can lift a figure above REPORTED.",
    proposes: ["FormInvestmentVehicle", "OpenOffering", "CreatePortfolio"],
  }),
  D({
    id: "spatial-ledger", label: "Spatial ledger", formats: ["xlsx"],
    description: "The estate working file — site areas, envelopes, unit counts, landscape treatment, location.",
    citation: "cell", ceiling: "REPORTED",
    ceilingWhy: "An internal working file, revised often and by several hands. Useful and rarely wrong; never self-corroborating.",
    proposes: ["RegisterProperty"],
  }),
  D({
    id: "conveyance-pack", label: "Title and conveyance pack", formats: ["pdf"],
    description: "Registered title, sale deed, encumbrance certificate, mutation record.",
    citation: "page-region", ceiling: "VERIFIED",
    ceilingWhy: "A public register maintained by an authority outside GC. This is the only ceiling that reaches VERIFIED on land.",
    proposes: ["CompleteAcquisition", "CompleteDisposition"],
  }),
  D({
    id: "transfer-instrument", label: "Transfer instrument", formats: ["pdf"],
    description: "An executed instrument moving a holding between parties, with the governance approval it relies on.",
    citation: "page-region", ceiling: "VERIFIED",
    ceilingWhy: "Executed and attested. The instrument is the act rather than a report of it.",
    proposes: ["TransferOwnership"],
  }),
  D({
    id: "valuation-report", label: "Valuation report", formats: ["pdf", "xlsx"],
    description: "An independent valuer's opinion, with basis, date and methodology.",
    citation: "page-region", ceiling: "CORROBORATED",
    ceilingWhy: "Independent, but an opinion at a date. It corroborates; it does not verify. Its own forward figures remain FORECAST.",
    proposes: ["RecordValuation"],
  }),
  D({
    id: "diligence-pack", label: "Diligence pack", formats: ["pdf", "zip"],
    description: "Legal, technical and financial diligence outputs assembled for a decision.",
    citation: "page", ceiling: "CORROBORATED",
    ceilingWhy: "Prepared by advisers outside the sponsor, against a scope somebody set. Corroboration, bounded by that scope.",
    proposes: ["CompleteDueDiligence"],
  }),
  D({
    id: "construction-report", label: "Construction progress report", formats: ["pdf", "xlsx"],
    description: "Periodic site report — stage reached, works certified, variations, programme against plan.",
    citation: "page", ceiling: "REPORTED",
    ceilingWhy: "Written by the party being measured. A certifier's signature lifts specific line items, and only those.",
    proposes: ["AdvancePropertyLifecycle"],
  }),
  D({
    id: "subscription-register", label: "Subscription register", formats: ["xlsx", "pdf"],
    description: "Executed commitments — party, amount, date, and the accreditation each relies on.",
    citation: "row", ceiling: "VERIFIED",
    ceilingWhy: "Each row is an executed commitment held on file. The register records instruments rather than describing them.",
    proposes: ["AcceptCommitment", "CloseOffering"],
  }),
  D({
    id: "kyc-pack", label: "Identity and accreditation pack", formats: ["pdf"],
    description: "Identity documents, tax residency, and the evidence an accreditation rests on.",
    citation: "page-region", ceiling: "VERIFIED",
    ceilingWhy: "Government-issued documents checked against their issuing authority.",
    proposes: ["GrantAccreditation", "ExpireAccreditation"],
  }),
  D({
    id: "bank-statement", label: "Bank and capital account statement", formats: ["pdf", "csv", "xlsx"],
    description: "Vehicle account movements used to reconcile calls, deployments and distributions after the fact.",
    citation: "row", ceiling: "VERIFIED",
    ceilingWhy: "Issued by the bank, not by GC. Note what it cannot do: it evidences that money moved, never that it was authorised to.",
    proposes: [],
  }),
  D({
    id: "board-minutes", label: "Board and committee minutes", formats: ["pdf", "docx"],
    description: "Signed minutes — resolutions tabled and resolved, committees constituted, vehicles wound up.",
    citation: "page", ceiling: "VERIFIED",
    ceilingWhy: "Signed minutes are the record of the act itself, which is the one case where a document and the event it describes are the same thing.",
    proposes: ["ConstituteCommittee", "TableResolution", "ResolveResolution", "DissolveVehicle"],
  }),
  D({
    id: "incorporation-pack", label: "Incorporation pack", formats: ["pdf"],
    description: "Certificate of incorporation, LLP agreement, PAN and registered particulars.",
    citation: "page-region", ceiling: "VERIFIED",
    ceilingWhy: "Registrar-issued. The entity either exists on the register or it does not.",
    proposes: ["RegisterOrganization"],
  }),
  D({
    id: "compliance-filing", label: "Compliance filing", formats: ["pdf"],
    description: "A filed return, acknowledgement or regulator correspondence.",
    citation: "page-region", ceiling: "VERIFIED",
    ceilingWhy: "Carries a filing acknowledgement from the authority that received it.",
    proposes: ["RecordComplianceEvent"],
  }),
  D({
    id: "performance-pack", label: "Performance pack", formats: ["xlsx", "pdf"],
    description: "Period operating and financial results for a vehicle, and the reserve position.",
    citation: "cell", ceiling: "REPORTED",
    ceilingWhy: "Management figures until audited. Audited statements arrive as their own deposit and lift only what they cover.",
    proposes: ["PublishPerformanceReport", "StabiliseVehicle"],
  }),
  D({
    id: "investment-thesis", label: "Investment thesis", formats: ["docx", "pdf"],
    description: "The stated case for a vehicle or portfolio, with its assumptions made explicit.",
    citation: "page", ceiling: "REPORTED",
    ceilingWhy: "A statement of intent. Every forward figure inside it is FORECAST regardless of how the surrounding prose reads.",
    proposes: ["VersionInvestmentThesis"],
  }),
  D({
    id: "draft-document", label: "Draft standing document", formats: ["docx", "md", "pdf"],
    description: "A legal page, policy or journal entry proposed for publication, against the version it replaces.",
    citation: "page", ceiling: "REPORTED",
    ceilingWhy: "A draft is a proposal about the future. It becomes authoritative by being approved, not by being deposited.",
    proposes: ["PublishContentVersion", "ApprovePolicyVersion"],
  }),
  D({
    id: "media-drop", label: "Media drop", formats: ["jpg", "png", "mp4", "pdf", "zip"],
    description: "Photography, drone capture, plans and renders, with whatever rights and attribution came with them.",
    citation: "file", ceiling: "REPORTED",
    ceilingWhy: "Metadata only, and file-level at that. No figure is ever extracted from an image — a dimension read off a render is an invention.",
    proposes: ["RegisterMediaAsset"],
  }),
  D({
    id: "conflict-declaration", label: "Conflict declaration", formats: ["pdf", "docx"],
    description: "A signed declaration of interest by a person holding or seeking authority.",
    citation: "page", ceiling: "REPORTED",
    ceilingWhy: "Self-declared by definition. Its value is that it was made and dated, not that it was checked.",
    proposes: ["DiscloseConflict"],
  }),
];

/* ── Declared acts ────────────────────────────────────────────────── */

export interface DeclaredAct {
  readonly command: CommandName;
  /** Why no document can produce this. */
  readonly why: string;
  /** What the intelligence is permitted to do instead. Never a proposal. */
  readonly aiMay: string;
}

const A = (a: DeclaredAct) => a;

export const DECLARED_ACTS: readonly DeclaredAct[] = [
  A({ command: "GrantAuthority",
      why: "Authority is conferred, never evidenced. A document saying somebody should hold a grant is a request; the grant is the act of a person who already holds authority to confer it.",
      aiMay: "List identities whose grants are lapsing, and say nothing about who should replace them." }),
  A({ command: "RevokeAuthority",
      why: "The mirror of the same rule. Withdrawal is a judgement about a person, and the platform will not have an agent form one.",
      aiMay: "Report grants unused for a stated period, as an observation carrying no recommendation." }),
  A({ command: "CallCapital",
      why: "A call is a decision about timing that binds partners to pay. The schedule that informs it is a document; the decision to call is not.",
      aiMay: "Show the deployment programme against uncalled commitments, and escalate when the two diverge." }),
  A({ command: "DeployCapital",
      why: "Deployment commits the vehicle's money to a counterparty. A bank statement evidences that it happened, which is the opposite of authorising it.",
      aiMay: "Reconcile statements against recorded deployments and escalate every unmatched movement, in both directions." }),
  A({ command: "ExecuteDistribution",
      why: "The highest-consequence movement in the system and the one a partner feels directly. It is never proposed, never batched, and never defaulted.",
      aiMay: "Compute the waterfall and present it as a draft that states its own basis — a proposal about arithmetic, not about paying." }),
  A({ command: "CastVote",
      why: "A vote is the expression of a person's judgement. Nothing may pre-fill it, including a record of how they voted before.",
      aiMay: "Deliver the resolution and its papers, and record that they were opened." }),
  A({ command: "DeclareConstitutionalFailure",
      why: "The gravest declaration available. It is reserved to the Governance and Ethics Committee acting deliberately.",
      aiMay: "Escalate the conditions that would support one, naming each and its evidence, and stop there." }),
  A({ command: "DeclareReserveBreach",
      why: "A breach is a finding against a floor a human set, and declaring one starts obligations that cannot be quietly withdrawn.",
      aiMay: "Escalate the reserve position against its floor the moment it crosses, with the arithmetic shown." }),

  /* The investor record, 25 Sep 2026. All four are declared, not
     file-borne: each is a statement about a named person, entered by the
     admin who holds its right, with the document it rests on held by
     Investor Relations rather than read into a proposal. */
  A({ command: "RegisterInvestor",
      why: "Putting a person on the register ties their sign-in to everything they will later hold. An enquiry, a form or a forwarded email is a request to be registered, not the registration.",
      aiMay: "Point out Desk contacts who have taken every step short of registration, and stop there." }),
  A({ command: "RecordKyc",
      why: "A KYC state is a judgement that a person is who they say they are. The documents evidence it; the determination is a person's, and it carries their reason.",
      aiMay: "List records whose review date has passed or whose stages are incomplete, stating which." }),
  A({ command: "RecordBankAccount",
      why: "A change of payment destination is the one change every payment fraud needs, and it most often arrives as a convincing document. It is never proposed from one.",
      aiMay: "Escalate any account recorded without a verification date, and any change made in the thirty days before a distribution." }),
  A({ command: "RecordRegisterEntry",
      why: "What a partner owns is transcribed from the LLP's own register by the Board, never inferred from a statement or a subscription form, because the transcription is what decides who votes and who is paid.",
      aiMay: "Report each vehicle whose recorded units fall short of the units it issued, with the gap." }),
];

/* ── The pipeline ─────────────────────────────────────────────────── */

export interface Stage {
  readonly n: string;
  readonly name: string;
  readonly does: string;
  /** What it is forbidden from doing — the load-bearing half. */
  readonly refuses: string;
  /** Who or what performs it. */
  readonly actor: "depositor" | "atlas" | "iris" | "grant-holder";
}

export const PIPELINE: readonly Stage[] = [
  { n: "01", name: "Deposit", actor: "depositor",
    does: "A file lands, is hashed, and is stamped with who deposited it and when. Its format is checked against the kinds that accept it. Nothing is parsed.",
    refuses: "It will not accept a format the kind does not declare. A workbook arriving as a screenshot is refused at the door rather than parsed badly." },
  { n: "02", name: "Classify", actor: "atlas",
    does: "The document kind is identified, and the vehicle or property it concerns is resolved against records that already exist.",
    refuses: "It never invents a subject. A document naming a vehicle that does not exist escalates — it does not create one to have somewhere to put the figures." },
  { n: "03", name: "Extract", actor: "atlas",
    does: "Fields are read with a citation at the granularity the kind declares — cell, row, page or region — and each carries the kind's confidence ceiling.",
    refuses: "A value it cannot cite is dropped, not guessed. There is no lower-confidence fallback for an uncitable figure, because a figure nobody can check is worse than a gap." },
  { n: "04", name: "Reconcile", actor: "atlas",
    does: "Extracted values are compared against what the system already holds and against every other document covering the same field.",
    refuses: "Where two sources disagree it does not choose. It raises a conflict showing both, with both citations, and lets the disagreement stand until a person resolves it." },
  { n: "05", name: "Propose", actor: "atlas",
    does: "Surviving values become command proposals. Each names one capability, its arguments, the right it needs, and therefore the single role that may dispose of it.",
    refuses: "It cannot propose a declared act, and it cannot approve anything. `Disposition` has no `approve` member, so this is a property of the type rather than a rule somebody checks." },
  { n: "06", name: "Dispose", actor: "grant-holder",
    does: "A person holding a live grant carrying that right approves, amends or rejects. Only then does the command execute and publish its events.",
    refuses: "It will not run for somebody whose grant lapsed between the proposal and the click. Authority is re-evaluated at the moment of execution, never at the moment of queueing." },
];

/* ── Escalation triggers ──────────────────────────────────────────── */

/**
 * Conditions under which a proposal becomes an escalation.
 *
 * Each is a case where proceeding on the balance of probabilities would be
 * cheaper and wrong. They are listed rather than inferred so that a reader
 * can audit the list itself, which is the only way to notice one missing.
 */
export const ESCALATION_TRIGGERS: readonly { id: string; when: string; because: string }[] = [
  { id: "ESC-01", when: "Two deposited documents state different values for the same field.",
    because: "Picking the newer, the cleaner or the more precise one is a judgement about which source to trust, and that judgement belongs to whoever answers for the figure." },
  { id: "ESC-02", when: "The proposal would change a figure already published to partners.",
    because: "A partner relied on the old number. Changing it silently is the failure that makes every other number suspect." },
  { id: "ESC-03", when: "The capability requires one of the internal-only rights.",
    because: "Those eighteen rights are the ones that move money, confer authority or bind the enterprise. None is ever a routine approval." },
  { id: "ESC-04", when: "The document names a vehicle, property or identity with no existing record.",
    because: "Creating the subject to have somewhere to put the data is how a typo becomes an entity." },
  { id: "ESC-05", when: "The extraction's confidence falls below the document kind's ceiling.",
    because: "The ceiling is the best this kind can do. Falling short of it means the parse itself is in doubt, not merely the figure." },
  { id: "ESC-06", when: "Approving would give the disposing identity a separation triad.",
    because: "GP-06 is checked at the moment of execution as well as at the moment of granting. A queue is not a loophole." },
  { id: "ESC-07", when: "The capability is conflict-sensitive and the disposer has an undisclosed interest.",
    because: "The conflict gate sits before the handler for exactly this, and a proposal cannot route around it." },
];

/* ── Bulk disposal ────────────────────────────────────────────────── */

/**
 * When several proposals may be disposed of in one action.
 *
 * Bulk approval is the point of the whole design — a workbook yielding
 * forty proposals that each need a separate click has not saved anybody
 * anything. It is also where the design could quietly become a rubber
 * stamp, so the conditions are narrow and stated.
 */
export const BULK_RULES: readonly { rule: string; why: string }[] = [
  { rule: "Only proposals disposed `clear` are eligible.",
    why: "Anything that escalated or that changes a standing figure needs eyes on it individually. That is what the disposition already means." },
  { rule: "Never where the capability requires an internal-only right.",
    why: "Money and authority move one at a time or not at all." },
  { rule: "Never across more than one vehicle in a single action.",
    why: "Scope is the thing most easily lost in a batch, and a grant that covers one vehicle must not be spent on another by accident." },
  { rule: "One reason covers the batch, stated once and recorded against every command.",
    why: "E-02 wants a reason per invocation. It does not want forty copies of the word \"import\", which is what per-item prompting reliably produces." },
  { rule: "The batch is one event with its members named, not a burst of unrelated events.",
    why: "Reconstructing which forty things somebody approved together is otherwise guesswork over timestamps." },
];
