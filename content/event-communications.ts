/**
 * EVENT COMMUNICATIONS — one governed communication contract per domain event.
 *
 * Events say what happened. This registry says who must know, how durable the
 * notice is, what an email contains, and which pre-action interruption (if any)
 * belongs to the command that produces the event. A past-tense event never
 * opens a confirmation dialog after the fact.
 */

import { EVENT_TYPES, type EventType } from "../lib/events";

export type CommunicationDomain =
  | "Enterprise"
  | "Publishing"
  | "Vehicle"
  | "Property"
  | "Capital"
  | "Identity"
  | "Governance"
  | "Compliance"
  | "Knowledge";

export type CommunicationRecipient =
  | "actor"
  | "applicant"
  | "investor"
  | "member"
  | "committee"
  | "office"
  | "affected holder";

export type CommunicationTone = "info" | "success" | "warning" | "critical";
export type ProductSurface = "toast" | "banner" | "alert-center" | "critical-alert";
export type EmailPolicy = "immediate" | "conditional" | "digest" | "receipt";
export type DialogPattern =
  | "none"
  | "review-and-confirm"
  | "evidence-gate"
  | "piston"
  | "secret-ballot"
  | "typed-confirmation"
  | "acknowledgement"
  | "session-warning";

export interface EventCommunicationSpec {
  id: `COM-${string}`;
  event: EventType;
  domain: CommunicationDomain;
  recipients: readonly CommunicationRecipient[];
  tone: CommunicationTone;
  product: {
    surface: ProductSurface;
    title: string;
    body: string;
    cta: string;
    persistent: boolean;
  };
  interruption: {
    pattern: DialogPattern;
    trigger: string;
    reason: string;
  };
  email: {
    policy: EmailPolicy;
    subject: string;
    preheader: string;
    heading: string;
    body: string;
    cta: string;
  };
  completion: string;
}

type Draft = Omit<EventCommunicationSpec, "id">;

const C = (spec: Draft): Draft => spec;

export const EVENT_COMMUNICATIONS: readonly EventCommunicationSpec[] = [
  C({
    event: "OrganizationRegistered", domain: "Enterprise", recipients: ["office"], tone: "success",
    product: { surface: "alert-center", title: "Organization registered", body: "The organization identity and founding record are now available.", cta: "Open organization", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before registration", reason: "Founding evidence and authority must be present before the record is created." },
    email: { policy: "immediate", subject: "Organization registration complete", preheader: "The founding record is available.", heading: "The organization is registered", body: "The identity, authority record, and founding evidence have been recorded. Review the record before forming any vehicle beneath it.", cta: "Review organization" },
    completion: "Registered with a permanent organization reference.",
  }),
  C({
    event: "CommitteeConstituted", domain: "Enterprise", recipients: ["committee", "office"], tone: "success",
    product: { surface: "alert-center", title: "Committee constituted", body: "Membership, remit, and effective date have been recorded.", cta: "Open committee", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before constitution", reason: "The proposed remit and membership need a final authority review." },
    email: { policy: "immediate", subject: "Committee constitution recorded", preheader: "Your committee remit is now effective.", heading: "The committee is constituted", body: "The committee membership, remit, authority basis, and effective date are now on record.", cta: "Review remit" },
    completion: "Constituted; each committee member has been notified.",
  }),
  C({
    event: "CommitteeAuthorityDelegated", domain: "Enterprise", recipients: ["committee", "office"], tone: "warning",
    product: { surface: "alert-center", title: "Committee authority delegated", body: "A defined authority scope is now active for the committee.", cta: "Review authority", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before delegation", reason: "The parent authority, scope, limits, and expiry must be evidenced." },
    email: { policy: "immediate", subject: "Committee authority is now active", preheader: "Review the delegated scope and limits.", heading: "Authority delegated", body: "A delegated authority is active. The record states the parent authority, permitted acts, limits, effective date, and expiry.", cta: "Review authority" },
    completion: "Delegated within the recorded scope and limits.",
  }),

  C({
    event: "ContentVersionPublished", domain: "Publishing", recipients: ["actor", "office"], tone: "success",
    product: { surface: "toast", title: "Version published", body: "The approved version is now visible to its permitted audience.", cta: "View version", persistent: false },
    interruption: { pattern: "review-and-confirm", trigger: "Before publication", reason: "Audience, effective time, provenance, and superseded version require review." },
    email: { policy: "digest", subject: "Content publication summary", preheader: "A governed content version was published.", heading: "A version was published", body: "The approved content version is now visible to its permitted audience. Its provenance and prior version remain available.", cta: "View version" },
    completion: "Published; the prior version remains in history.",
  }),
  C({
    event: "ContentVersionWithdrawn", domain: "Publishing", recipients: ["actor", "office"], tone: "warning",
    product: { surface: "alert-center", title: "Version withdrawn", body: "The version is no longer published; its record remains available.", cta: "Review withdrawal", persistent: true },
    interruption: { pattern: "typed-confirmation", trigger: "Before withdrawal", reason: "Withdrawal changes what an audience can rely on and requires a recorded reason." },
    email: { policy: "immediate", subject: "Content version withdrawn", preheader: "The published version is no longer available.", heading: "A version was withdrawn", body: "The version has been removed from publication. The withdrawal reason and full version history remain on record.", cta: "Review withdrawal" },
    completion: "Withdrawn without deleting the version record.",
  }),
  C({
    event: "MediaAssetRegistered", domain: "Publishing", recipients: ["actor", "office"], tone: "success",
    product: { surface: "toast", title: "Media registered", body: "The file, source, licence, and media claim are recorded.", cta: "Open media", persistent: false },
    interruption: { pattern: "evidence-gate", trigger: "Before registration", reason: "The media kind, source, licence, and permitted audience cannot be inferred." },
    email: { policy: "digest", subject: "Media registration summary", preheader: "A media claim was added to the register.", heading: "Media registered", body: "A media file and its source, licence, kind, and permitted audience have been recorded.", cta: "Open media" },
    completion: "Registered with source and licence evidence.",
  }),
  C({
    event: "MediaAssetReclassified", domain: "Publishing", recipients: ["actor", "office"], tone: "warning",
    product: { surface: "alert-center", title: "Media classification changed", body: "The media claim changed; every dependent placement can now be reviewed.", cta: "Review placements", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before reclassification", reason: "Changing photograph, render, or drawing status changes the claim made by every placement." },
    email: { policy: "digest", subject: "Media classification changed", preheader: "Review where this media appears.", heading: "A media claim changed", body: "The media classification was changed. Review every published placement that relies on the earlier claim.", cta: "Review placements" },
    completion: "Reclassified; dependent placements are flagged for review.",
  }),

  C({
    event: "InvestmentVehicleFormed", domain: "Vehicle", recipients: ["office"], tone: "success",
    product: { surface: "alert-center", title: "Investment vehicle formed", body: "The constitutional identity and formation evidence are now on record.", cta: "Open vehicle", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before formation", reason: "Formation requires Board authority, entity evidence, registered address, and designated-partner details." },
    email: { policy: "immediate", subject: "Investment vehicle formation complete", preheader: "The vehicle identity is now active.", heading: "The vehicle is formed", body: "The vehicle identity, constitutional evidence, authority reference, and effective date have been recorded.", cta: "Review vehicle" },
    completion: "Formed with its constitutional record intact.",
  }),
  C({
    event: "InvestmentVehicleStabilised", domain: "Vehicle", recipients: ["member", "office"], tone: "success",
    product: { surface: "alert-center", title: "Vehicle stabilised", body: "The vehicle has entered its stabilised operating state.", cta: "Review position", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before stabilisation", reason: "Financial, operational, reserve, and reporting gates must all be reviewed." },
    email: { policy: "immediate", subject: "{{vehicleName}} has stabilised", preheader: "The operating state has advanced.", heading: "The vehicle is stabilised", body: "The recorded stabilisation gates have been met. The current capital, reserve, property, and reporting position is available in the workspace.", cta: "Review position" },
    completion: "Stabilised after all recorded gates passed.",
  }),
  C({
    event: "InvestmentVehicleDissolved", domain: "Vehicle", recipients: ["member", "office", "affected holder"], tone: "critical",
    product: { surface: "critical-alert", title: "Investment vehicle dissolved", body: "The vehicle has reached its terminal state; records remain permanently available.", cta: "Review dissolution", persistent: true },
    interruption: { pattern: "typed-confirmation", trigger: "Before dissolution", reason: "Dissolution is terminal and must show authority, liabilities, final distributions, and evidence." },
    email: { policy: "immediate", subject: "Important: {{vehicleName}} has been dissolved", preheader: "Review the final position and permanent records.", heading: "The vehicle is dissolved", body: "The dissolution is complete. The authority, final financial position, distribution evidence, and permanent records remain available.", cta: "Review dissolution" },
    completion: "Dissolved; no new operation is permitted.",
  }),
  C({
    event: "PortfolioCreated", domain: "Vehicle", recipients: ["office"], tone: "success",
    product: { surface: "toast", title: "Portfolio created", body: "The portfolio identity and parent relationship are recorded.", cta: "Open portfolio", persistent: false },
    interruption: { pattern: "review-and-confirm", trigger: "Before creation", reason: "The name, purpose, parent organization, and accountable office must be confirmed." },
    email: { policy: "digest", subject: "Portfolio creation summary", preheader: "A portfolio was added to the operating graph.", heading: "Portfolio created", body: "The portfolio identity, purpose, accountable office, and parent relationship are now on record.", cta: "Open portfolio" },
    completion: "Created and connected to its parent organization.",
  }),
  C({
    event: "PropertyAssignedToPortfolio", domain: "Vehicle", recipients: ["office"], tone: "success",
    product: { surface: "toast", title: "Property assigned", body: "The property is now connected to the selected portfolio.", cta: "Open property", persistent: false },
    interruption: { pattern: "review-and-confirm", trigger: "Before assignment", reason: "The target portfolio and effective date must be visible before the relationship is created." },
    email: { policy: "digest", subject: "Property assignment summary", preheader: "A property-to-portfolio relationship changed.", heading: "Property assigned", body: "The property has been connected to the selected portfolio from the recorded effective date.", cta: "Open property" },
    completion: "Assigned without altering the property identity.",
  }),

  C({
    event: "PropertyRegistered", domain: "Property", recipients: ["office"], tone: "success",
    product: { surface: "alert-center", title: "Property registered", body: "The property identity, location, and evidence record are available.", cta: "Open property", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before registration", reason: "Title basis, location, provenance, and accountable vehicle must be evidenced." },
    email: { policy: "immediate", subject: "Property registration complete", preheader: "The property record is now active.", heading: "The property is registered", body: "The property identity, location record, title basis, provenance, and accountable vehicle are now available.", cta: "Review property" },
    completion: "Registered with a permanent property reference.",
  }),
  C({
    event: "PropertyLifecycleAdvanced", domain: "Property", recipients: ["member", "office"], tone: "info",
    product: { surface: "alert-center", title: "Property stage advanced", body: "The property moved to its next governed stage.", cta: "Review stage", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before stage change", reason: "Required evidence, open risks, accountable owner, and next obligations must be shown." },
    email: { policy: "immediate", subject: "{{propertyName}} moved to {{stageName}}", preheader: "The property lifecycle advanced.", heading: "The property stage advanced", body: "The property has moved to the recorded stage. Review completed gates, open risks, and the obligations now in force.", cta: "Review stage" },
    completion: "Advanced after the recorded stage gates passed.",
  }),
  C({
    event: "AcquisitionCompleted", domain: "Property", recipients: ["member", "office", "affected holder"], tone: "success",
    product: { surface: "alert-center", title: "Acquisition completed", body: "Ownership evidence and the final acquisition position are recorded.", cta: "Review acquisition", persistent: true },
    interruption: { pattern: "piston", trigger: "Before completion", reason: "The action moves capital and changes the legal property position." },
    email: { policy: "immediate", subject: "Acquisition of {{propertyName}} completed", preheader: "Review the final property and capital position.", heading: "Acquisition complete", body: "The acquisition has completed. Ownership evidence, consideration, authority, and the final capital position are available.", cta: "Review acquisition" },
    completion: "Completed with authority, evidence, and consideration recorded.",
  }),
  C({
    event: "ValuationRecorded", domain: "Property", recipients: ["member", "office"], tone: "info",
    product: { surface: "alert-center", title: "Valuation recorded", body: "A dated valuation and its basis are available.", cta: "Review valuation", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before recording", reason: "Valuer, date, basis, currency, confidence, and source document are required." },
    email: { policy: "immediate", subject: "New valuation recorded for {{propertyName}}", preheader: "The dated basis and source are available.", heading: "A valuation was recorded", body: "A new valuation has been recorded with its effective date, basis, source, currency, and confidence classification.", cta: "Review valuation" },
    completion: "Recorded as a dated position, not a live price.",
  }),
  C({
    event: "DispositionCompleted", domain: "Property", recipients: ["member", "office", "affected holder"], tone: "warning",
    product: { surface: "alert-center", title: "Disposition completed", body: "The property disposition and final proceeds position are recorded.", cta: "Review disposition", persistent: true },
    interruption: { pattern: "piston", trigger: "Before completion", reason: "The action changes ownership and moves sale proceeds." },
    email: { policy: "immediate", subject: "Disposition of {{propertyName}} completed", preheader: "Review proceeds, authority, and the final property position.", heading: "Disposition complete", body: "The disposition has completed. Authority, transfer evidence, costs, proceeds, and the resulting capital position are available.", cta: "Review disposition" },
    completion: "Completed with transfer evidence and proceeds recorded.",
  }),
  C({
    event: "EnvironmentalCommitmentStrengthened", domain: "Property", recipients: ["member", "office"], tone: "success",
    product: { surface: "alert-center", title: "Environmental commitment strengthened", body: "A stronger measurable obligation is now attached to the property.", cta: "Review commitment", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before strengthening", reason: "The baseline, target, owner, evidence, and reporting cadence must be explicit." },
    email: { policy: "digest", subject: "Environmental commitment strengthened", preheader: "A stronger property obligation is now active.", heading: "The commitment is stronger", body: "A measurable environmental obligation has been strengthened. Review its baseline, target, accountable owner, evidence, and reporting cadence.", cta: "Review commitment" },
    completion: "Strengthened; the prior commitment remains in history.",
  }),

  C({
    event: "OfferingOpened", domain: "Capital", recipients: ["investor", "office"], tone: "info",
    product: { surface: "alert-center", title: "Offering opened", body: "Eligible investors can now review and offer a commitment.", cta: "Review offering", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before opening", reason: "Eligibility, authority, offer documents, unit ceiling, dates, and risk statements must pass the gate." },
    email: { policy: "immediate", subject: "{{vehicleName}} offering is open", preheader: "Review the opportunity, terms, and eligibility position.", heading: "The offering is open", body: "Eligible investors may now review the offering and offer a commitment. Read the governed documents, risks, unit ceiling, and close conditions before acting.", cta: "Review offering" },
    completion: "Opened only to the recorded eligible audience.",
  }),
  C({
    event: "OfferingClosed", domain: "Capital", recipients: ["investor", "office"], tone: "warning",
    product: { surface: "alert-center", title: "Offering closed", body: "No new commitments can be offered under this opening.", cta: "Review close", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before closing", reason: "Outstanding commitments, close basis, effective time, and notices must be reviewed." },
    email: { policy: "immediate", subject: "{{vehicleName}} offering has closed", preheader: "No new commitments can be offered.", heading: "The offering is closed", body: "The offering closed at the recorded time and on the recorded basis. Existing commitment positions remain available in the workspace.", cta: "Review position" },
    completion: "Closed; outstanding commitment records are unchanged.",
  }),
  C({
    event: "CommitmentOffered", domain: "Capital", recipients: ["investor", "office"], tone: "info",
    product: { surface: "alert-center", title: "Commitment offered", body: "The offer is recorded for review; it is not yet accepted or settled.", cta: "Track commitment", persistent: true },
    interruption: { pattern: "piston", trigger: "Before offer", reason: "The investor must see amount, terms, declarations, expiry, and that an offer is not admission." },
    email: { policy: "receipt", subject: "We received your commitment offer", preheader: "Your offer is recorded and awaiting review.", heading: "Commitment offer received", body: "Your commitment offer is recorded. It is not yet accepted, settled, or an ownership position. Track review and any required evidence in the workspace.", cta: "Track commitment" },
    completion: "Offered; no ownership position has been created.",
  }),
  C({
    event: "CommitmentAccepted", domain: "Capital", recipients: ["investor", "office"], tone: "success",
    product: { surface: "alert-center", title: "Commitment accepted", body: "The commitment is accepted subject to settlement and admission conditions.", cta: "Review next steps", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before acceptance", reason: "Eligibility, allocation, authority, conditions, and acceptance reason must be visible." },
    email: { policy: "immediate", subject: "Your commitment has been accepted", preheader: "Settlement and admission conditions now follow.", heading: "Commitment accepted", body: "Your commitment has been accepted on the recorded terms. This is not yet settlement or admission; complete the stated next steps within the deadline.", cta: "Review next steps" },
    completion: "Accepted subject to the recorded settlement conditions.",
  }),
  C({
    event: "CommitmentLapsed", domain: "Capital", recipients: ["investor", "office"], tone: "warning",
    product: { surface: "alert-center", title: "Commitment lapsed", body: "The deadline passed and the commitment is no longer active.", cta: "Review lapse", persistent: true },
    interruption: { pattern: "none", trigger: "After the lapse rule executes", reason: "This is a timed outcome; reminders precede it, while the event itself needs a durable explanation rather than a dialog." },
    email: { policy: "immediate", subject: "Your commitment has lapsed", preheader: "Review the deadline and resulting position.", heading: "Commitment lapsed", body: "The commitment lapsed under the recorded deadline rule. It is no longer active and no ownership position was created.", cta: "Review lapse" },
    completion: "Lapsed under the recorded rule and deadline.",
  }),
  C({
    event: "CommitmentWithdrawn", domain: "Capital", recipients: ["investor", "office"], tone: "warning",
    product: { surface: "alert-center", title: "Commitment withdrawn", body: "The commitment is no longer active; the record and reason remain.", cta: "Review withdrawal", persistent: true },
    interruption: { pattern: "typed-confirmation", trigger: "Before withdrawal", reason: "The investor must see the consequences and the governing withdrawal rule." },
    email: { policy: "receipt", subject: "Commitment withdrawal recorded", preheader: "The commitment is no longer active.", heading: "Commitment withdrawn", body: "The commitment has been withdrawn under the recorded rule. Its history and withdrawal reason remain available.", cta: "Review withdrawal" },
    completion: "Withdrawn without deleting its history.",
  }),
  C({
    event: "CommitmentSettled", domain: "Capital", recipients: ["investor", "member", "office"], tone: "success",
    product: { surface: "alert-center", title: "Commitment settled", body: "Funds and settlement evidence are recorded; admission can now be completed.", cta: "Review settlement", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before marking settled", reason: "Cleared funds, amount, date, reference, and allocation evidence must match." },
    email: { policy: "immediate", subject: "Your commitment has settled", preheader: "Funds and settlement evidence are recorded.", heading: "Settlement complete", body: "Your commitment has settled. The cleared amount, date, reference, and resulting admission position are available.", cta: "Review settlement" },
    completion: "Settled against cleared funds and evidence.",
  }),
  C({
    event: "CapitalCalled", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "warning",
    product: { surface: "critical-alert", title: "Capital call issued", body: "An amount, purpose, and payment deadline are now due under the recorded authority.", cta: "Review and pay", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before issue", reason: "Amount, allocation method, purpose, authority, deadline, and payment instructions require final review." },
    email: { policy: "immediate", subject: "Action required: capital call for {{vehicleName}}", preheader: "Review the amount, purpose, and payment deadline.", heading: "Capital call issued", body: "A capital call is due under the recorded authority. Review your amount, purpose, payment instructions, deadline, and the position if payment is late.", cta: "Review and pay" },
    completion: "Issued to affected holders with a durable due-date notice.",
  }),
  C({
    event: "CapitalDrawn", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "success",
    product: { surface: "alert-center", title: "Capital received", body: "Cleared capital and its allocation are now recorded.", cta: "Review receipt", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before draw recording", reason: "Cleared funds, bank reference, allocation, currency, and effective date must reconcile." },
    email: { policy: "receipt", subject: "Capital receipt confirmed", preheader: "Cleared funds and allocation are recorded.", heading: "Capital received", body: "The cleared capital receipt is recorded with its amount, currency, date, reference, and allocation.", cta: "Review receipt" },
    completion: "Drawn only against reconciled cleared funds.",
  }),
  C({
    event: "CapitalDeployed", domain: "Capital", recipients: ["member", "office"], tone: "info",
    product: { surface: "alert-center", title: "Capital deployed", body: "The amount, purpose, authority, and destination are recorded.", cta: "Review deployment", persistent: true },
    interruption: { pattern: "piston", trigger: "Before deployment", reason: "This action moves capital and must expose amount, purpose, destination, authority, and remaining liquidity." },
    email: { policy: "digest", subject: "Capital deployment update", preheader: "A governed deployment was recorded.", heading: "Capital deployed", body: "Capital was deployed for the recorded purpose and under the recorded authority. Review the amount, destination, and resulting liquidity position.", cta: "Review deployment" },
    completion: "Deployed with destination and authority attached.",
  }),
  C({
    event: "CapitalReturned", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "success",
    product: { surface: "alert-center", title: "Capital returned", body: "The return and its effect on the capital position are recorded.", cta: "Review return", persistent: true },
    interruption: { pattern: "piston", trigger: "Before return", reason: "The movement affects holder capital accounts and requires amount, basis, authority, and recipient review." },
    email: { policy: "immediate", subject: "Capital return executed", preheader: "Review the amount and resulting capital position.", heading: "Capital returned", body: "A capital return was executed. Review the amount, basis, authority, payment reference, and resulting capital position.", cta: "Review return" },
    completion: "Returned and reconciled to affected capital accounts.",
  }),
  C({
    event: "OwnershipPositionOpened", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "success",
    product: { surface: "alert-center", title: "Ownership position opened", body: "The holder, contribution basis, and effective ownership position are recorded.", cta: "Review ownership", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before opening", reason: "Admission authority, settled commitment, contribution basis, effective date, and register evidence must agree." },
    email: { policy: "immediate", subject: "Your ownership position is now open", preheader: "Admission and ownership are recorded.", heading: "Ownership position opened", body: "Your ownership position is now recorded with its contribution basis, effective date, admission authority, and register reference.", cta: "Review ownership" },
    completion: "Opened from settlement and admission evidence.",
  }),
  C({
    event: "OwnershipTransferred", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "warning",
    product: { surface: "alert-center", title: "Ownership transferred", body: "The transfer and resulting holder positions are now recorded.", cta: "Review transfer", persistent: true },
    interruption: { pattern: "typed-confirmation", trigger: "Before transfer", reason: "The action changes legal and economic rights and must show authority, parties, basis, and effective date." },
    email: { policy: "immediate", subject: "Ownership transfer completed", preheader: "Review the transfer and resulting position.", heading: "Ownership transferred", body: "The ownership transfer is complete. Review the parties, basis, effective date, authority, and resulting ownership positions.", cta: "Review transfer" },
    completion: "Transferred with prior and resulting positions preserved.",
  }),
  C({
    event: "DistributionExecuted", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "success",
    product: { surface: "alert-center", title: "Distribution executed", body: "Payment and allocation evidence are now available.", cta: "Review distribution", persistent: true },
    interruption: { pattern: "piston", trigger: "Before execution", reason: "The action moves capital and must show reserve position, amount, allocation, authority, and payment destination." },
    email: { policy: "immediate", subject: "Distribution executed for {{vehicleName}}", preheader: "Payment and allocation evidence are available.", heading: "Distribution executed", body: "The distribution was executed. Review your amount, allocation basis, payment reference, and the vehicle position after payment.", cta: "Review distribution" },
    completion: "Executed only after the reserve and authority checks passed.",
  }),
  C({
    event: "DistributionBlocked", domain: "Capital", recipients: ["member", "office", "affected holder"], tone: "warning",
    product: { surface: "critical-alert", title: "Distribution held", body: "Payment did not proceed because a governed protection blocked it.", cta: "Review reason", persistent: true },
    interruption: { pattern: "acknowledgement", trigger: "When the block is recorded", reason: "The operator must acknowledge the protection, reason, affected holders, and next review date." },
    email: { policy: "immediate", subject: "Distribution held, and why", preheader: "Payment did not proceed; review the protection and next step.", heading: "Distribution held", body: "The distribution did not proceed because the recorded protection blocked it. The retained amount, reason, authority, and next review date are available.", cta: "Review reason" },
    completion: "Blocked before funds moved; the reason is on record.",
  }),

  C({
    event: "IdentityAuthenticated", domain: "Identity", recipients: ["actor"], tone: "info",
    product: { surface: "toast", title: "Identity verified", body: "The requested identity check completed.", cta: "Continue", persistent: false },
    interruption: { pattern: "none", trigger: "After authentication", reason: "Successful authentication should continue the requested task without another interruption." },
    email: { policy: "conditional", subject: "A new identity verification completed", preheader: "Review this activity if it was not yours.", heading: "Identity verification completed", body: "An identity verification completed for your address. This email is sent only when the access context is unfamiliar or risk rules require it.", cta: "Review security" },
    completion: "Authenticated for the current access context.",
  }),
  C({
    event: "AccreditationGranted", domain: "Identity", recipients: ["investor", "office"], tone: "success",
    product: { surface: "alert-center", title: "Accreditation granted", body: "The investor can make new commitments until the recorded expiry, subject to each offer.", cta: "Review accreditation", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before decision", reason: "Evidence, jurisdiction, class, effective date, expiry, and decision reason must be visible." },
    email: { policy: "immediate", subject: "Your accreditation is confirmed", preheader: "Review the class, effective date, and expiry.", heading: "Accreditation granted", body: "Your accreditation is confirmed for the recorded class and period. Each offering retains its own eligibility and acceptance conditions.", cta: "Review accreditation" },
    completion: "Granted for the recorded class and period.",
  }),
  C({
    event: "AccreditationExpired", domain: "Identity", recipients: ["investor", "office"], tone: "warning",
    product: { surface: "critical-alert", title: "Accreditation expired", body: "New commitments are blocked until accreditation is renewed; existing ownership rights remain.", cta: "Renew accreditation", persistent: true },
    interruption: { pattern: "none", trigger: "After timed expiry", reason: "Advance reminders precede the date; expiry itself needs a durable outcome and renewal path." },
    email: { policy: "immediate", subject: "Your accreditation has expired", preheader: "New commitments are paused; existing ownership rights remain.", heading: "Accreditation expired", body: "Your accreditation period ended. You cannot make a new commitment until renewal, but existing ownership and governance rights are unchanged.", cta: "Renew accreditation" },
    completion: "Expired without changing existing holder rights.",
  }),
  C({
    event: "MemberStatePromoted", domain: "Identity", recipients: ["member", "office"], tone: "success",
    product: { surface: "alert-center", title: "Member access activated", body: "The recorded admission state now opens the permitted member workspace.", cta: "Open workspace", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before promotion", reason: "Settlement, admission, register entry, access scope, and effective date must all agree." },
    email: { policy: "immediate", subject: "Your member access is active", preheader: "Your admitted position is now available.", heading: "Member access activated", body: "Your recorded admission state now opens the permitted member workspace. Review your ownership, documents, governance, and current obligations.", cta: "Open workspace" },
    completion: "Promoted from admitted evidence, never from a manual label alone.",
  }),
  C({
    event: "SessionOpened", domain: "Identity", recipients: ["actor"], tone: "info",
    product: { surface: "toast", title: "Session opened", body: "Secure access is active for this device.", cta: "Review access", persistent: false },
    interruption: { pattern: "none", trigger: "After sign-in", reason: "A normal session should not be blocked by a redundant confirmation." },
    email: { policy: "conditional", subject: "New sign-in to Getaway Collective", preheader: "Review the device and time if this was not you.", heading: "A session opened", body: "A session opened for your address. This email is sent for unfamiliar devices, locations, or risk signals.", cta: "Review access" },
    completion: "Opened with the recorded device and access context.",
  }),
  C({
    event: "SessionClosed", domain: "Identity", recipients: ["actor"], tone: "info",
    product: { surface: "toast", title: "Signed out", body: "The session is closed; permanent records and saved drafts are unchanged.", cta: "Sign in", persistent: false },
    interruption: { pattern: "session-warning", trigger: "Before inactivity expiry", reason: "The warning offers extension before automatic closure; an intentional sign-out needs no dialog." },
    email: { policy: "conditional", subject: "Your Getaway Collective session closed", preheader: "Permanent records and saved drafts are unchanged.", heading: "Session closed", body: "The session closed. This email is sent only after a security closure or when risk rules require confirmation.", cta: "Review access" },
    completion: "Closed without changing permanent records.",
  }),

  C({
    event: "ResolutionTabled", domain: "Governance", recipients: ["member", "committee", "office"], tone: "warning",
    product: { surface: "critical-alert", title: "Resolution open", body: "A resolution is open for review and, where entitled, a secret ballot.", cta: "Review resolution", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before tabling", reason: "Authority, motion, rationale, voting basis, threshold, electorate, opening, and close must be complete." },
    email: { policy: "immediate", subject: "Action required: resolution {{resolutionRef}} is open", preheader: "Review the motion, threshold, and close time.", heading: "A resolution is open", body: "Review the motion, rationale, voting basis, threshold, electorate, and close time. A tie is not approval. Your entitlement is determined by the recorded ownership basis.", cta: "Review resolution" },
    completion: "Tabled with electorate, threshold, and close time fixed.",
  }),
  C({
    event: "VoteCast", domain: "Governance", recipients: ["actor"], tone: "success",
    product: { surface: "toast", title: "Ballot recorded", body: "Your ballot is recorded. The choice is sealed and will not appear in notices or email.", cta: "Close", persistent: false },
    interruption: { pattern: "secret-ballot", trigger: "Before casting", reason: "The voter must see weight, choice, threshold, irreversibility, and what is sealed before a sustained confirm." },
    email: { policy: "receipt", subject: "Your ballot was recorded", preheader: "The receipt contains no ballot choice.", heading: "Ballot recorded", body: "Your ballot was recorded before the close. This receipt deliberately contains no choice. The published outcome will contain the aggregate tally only.", cta: "Review resolution" },
    completion: "Recorded irreversibly; the choice remains sealed.",
  }),
  C({
    event: "ResolutionResolved", domain: "Governance", recipients: ["member", "committee", "office"], tone: "info",
    product: { surface: "alert-center", title: "Resolution decided", body: "The aggregate equity-weighted tally and recorded reason are published; individual ballots remain sealed.", cta: "Review outcome", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before publishing outcome", reason: "The tally, threshold test, reason, effective date, and downstream actions require final review." },
    email: { policy: "immediate", subject: "Resolution {{resolutionRef}} has been decided", preheader: "Review the aggregate tally and resulting action.", heading: "Resolution decided", body: "The aggregate equity-weighted tally, threshold test, decision reason, and effective date are published. Individual ballots remain sealed.", cta: "Review outcome" },
    completion: "Resolved with aggregate tally and reason published.",
  }),
  C({
    event: "PolicyVersionApproved", domain: "Governance", recipients: ["member", "committee", "office"], tone: "info",
    product: { surface: "alert-center", title: "Policy version approved", body: "A new governed policy version is approved for its recorded effective date.", cta: "Review policy", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before approval", reason: "Authority, impact, effective date, superseded version, and decision reason must be shown." },
    email: { policy: "immediate", subject: "Policy update approved", preheader: "Review what changed and when it takes effect.", heading: "A policy version was approved", body: "A new policy version was approved. Review its change summary, authority, effective date, and the version it supersedes.", cta: "Review policy" },
    completion: "Approved without deleting the superseded version.",
  }),
  C({
    event: "ConflictDisclosed", domain: "Governance", recipients: ["committee", "office"], tone: "warning",
    product: { surface: "critical-alert", title: "Conflict disclosed", body: "A conflict and its proposed control are now on record.", cta: "Review conflict", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before disclosure", reason: "Interest, matter, affected scope, proposed control, and declaration must be explicit." },
    email: { policy: "immediate", subject: "Conflict disclosure recorded", preheader: "Review the matter and proposed control.", heading: "A conflict was disclosed", body: "A conflict has been recorded with the relevant interest, affected matter, scope, proposed control, and declaration time.", cta: "Review conflict" },
    completion: "Disclosed; the proposed control now awaits the required decision.",
  }),
  C({
    event: "AuthorityGranted", domain: "Governance", recipients: ["actor", "committee", "office"], tone: "warning",
    product: { surface: "critical-alert", title: "Authority granted", body: "A defined authority scope is now active with recorded limits and expiry.", cta: "Review authority", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before grant", reason: "Grantor authority, recipient, scope, limits, conflicts, effective date, expiry, and reason are required." },
    email: { policy: "immediate", subject: "Authority granted: review your scope", preheader: "The authority, limits, and expiry are now active.", heading: "Authority granted", body: "A defined authority scope is now active. Review the permitted acts, limits, conflicts, effective date, expiry, and parent authority.", cta: "Review authority" },
    completion: "Granted only within the recorded parent authority.",
  }),
  C({
    event: "AuthorityRevoked", domain: "Governance", recipients: ["actor", "committee", "office"], tone: "critical",
    product: { surface: "critical-alert", title: "Authority revoked", body: "The recorded authority can no longer be exercised from the effective time.", cta: "Review revocation", persistent: true },
    interruption: { pattern: "typed-confirmation", trigger: "Before revocation", reason: "The operator must identify the authority, affected acts, effective time, continuity plan, and reason." },
    email: { policy: "immediate", subject: "Authority revoked", preheader: "The authority can no longer be exercised.", heading: "Authority revoked", body: "The recorded authority was revoked from the effective time. Review the reason, affected acts, continuity plan, and permanent authority history.", cta: "Review revocation" },
    completion: "Revoked prospectively; the historic authority record remains.",
  }),

  C({
    event: "ReserveFunded", domain: "Compliance", recipients: ["member", "office"], tone: "success",
    product: { surface: "alert-center", title: "Reserve funded", body: "The reserve receipt and resulting floor position are recorded.", cta: "Review reserve", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before funding record", reason: "Cleared funds, source, allocation, currency, date, and resulting floor position must reconcile." },
    email: { policy: "digest", subject: "Reserve funding update", preheader: "The receipt and resulting floor position are available.", heading: "Reserve funded", body: "Reserve funding was recorded against cleared funds. Review the source, amount, date, allocation, and resulting floor position.", cta: "Review reserve" },
    completion: "Funded against reconciled cleared funds.",
  }),
  C({
    event: "ReserveBreachDeclared", domain: "Compliance", recipients: ["member", "committee", "office"], tone: "critical",
    product: { surface: "critical-alert", title: "Reserve breach declared", body: "The reserve is below its governed floor; protected capital actions are blocked.", cta: "Review breach", persistent: true },
    interruption: { pattern: "acknowledgement", trigger: "When the breach is declared", reason: "The accountable office must acknowledge scope, blocked actions, immediate control, and Board escalation." },
    email: { policy: "immediate", subject: "Critical: reserve breach declared", preheader: "Protected capital actions are blocked pending clearance.", heading: "Reserve breach declared", body: "The reserve is below its governed floor. Protected capital actions are blocked. Review the measure, cause, affected actions, immediate control, and Board escalation.", cta: "Review breach" },
    completion: "Declared; protected actions remain blocked until a clearance event.",
  }),
  C({
    event: "ReserveBreachCleared", domain: "Compliance", recipients: ["member", "committee", "office"], tone: "success",
    product: { surface: "critical-alert", title: "Reserve breach cleared", body: "The reserve meets the governed floor; the recorded controls can now be reassessed.", cta: "Review clearance", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before clearance", reason: "Measurement evidence, effective time, authority, and any remaining controls must be reviewed." },
    email: { policy: "immediate", subject: "Reserve breach cleared", preheader: "Review the evidence and remaining controls.", heading: "Reserve breach cleared", body: "The reserve now meets the governed floor on the recorded evidence. Review the effective time, authority, and any controls that remain active.", cta: "Review clearance" },
    completion: "Cleared on evidence; the breach history remains permanent.",
  }),
  C({
    event: "ComplianceEventRecorded", domain: "Compliance", recipients: ["committee", "office"], tone: "warning",
    product: { surface: "critical-alert", title: "Compliance event recorded", body: "A compliance matter, assessment, and required response are now on record.", cta: "Review matter", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before recording", reason: "Facts, source, jurisdiction, assessment, decision reason, accountable owner, and response date are required." },
    email: { policy: "immediate", subject: "Compliance matter recorded", preheader: "Review the assessment and required response.", heading: "Compliance event recorded", body: "A compliance matter has been recorded with its facts, source, jurisdiction, assessment, decision reason, accountable owner, and response date.", cta: "Review matter" },
    completion: "Recorded with an accountable owner and response date.",
  }),
  C({
    event: "ConstitutionalFailureDeclared", domain: "Compliance", recipients: ["member", "committee", "office"], tone: "critical",
    product: { surface: "critical-alert", title: "Constitutional failure declared", body: "A constitutional invariant failed; affected acts are stopped or contained.", cta: "Review failure", persistent: true },
    interruption: { pattern: "acknowledgement", trigger: "When failure is declared", reason: "The accountable office must acknowledge the failed invariant, scope, containment, authority, and escalation." },
    email: { policy: "immediate", subject: "Critical: constitutional failure declared", preheader: "Affected acts are stopped or contained.", heading: "Constitutional failure declared", body: "A constitutional invariant failed. Review the failed rule, affected scope, containment, authority, decision reason, and Board escalation.", cta: "Review failure" },
    completion: "Declared with containment; clearance requires a later governed event.",
  }),

  C({
    event: "InvestmentThesisVersioned", domain: "Knowledge", recipients: ["investor", "member", "office"], tone: "info",
    product: { surface: "alert-center", title: "Investment thesis updated", body: "A new version and its change rationale are available.", cta: "Review thesis", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before versioning", reason: "Change summary, evidence, confidence, author, effective date, and superseded version require review." },
    email: { policy: "digest", subject: "Investment thesis updated", preheader: "Review what changed and the supporting evidence.", heading: "A new thesis version is available", body: "The investment thesis was versioned. Review the change summary, supporting evidence, confidence, effective date, and prior version.", cta: "Review thesis" },
    completion: "Versioned without overwriting the prior thesis.",
  }),
  C({
    event: "DueDiligenceCompleted", domain: "Knowledge", recipients: ["investor", "member", "committee", "office"], tone: "success",
    product: { surface: "alert-center", title: "Due diligence completed", body: "The scope, findings, exceptions, sources, and conclusion are recorded.", cta: "Review diligence", persistent: true },
    interruption: { pattern: "evidence-gate", trigger: "Before completion", reason: "Scope, evidence index, open exceptions, accountable reviewers, conclusion, and date must be complete." },
    email: { policy: "immediate", subject: "Due diligence completed for {{vehicleName}}", preheader: "Review findings, exceptions, and source evidence.", heading: "Due diligence complete", body: "The diligence scope, findings, exceptions, source evidence, accountable reviewers, and conclusion are now available.", cta: "Review diligence" },
    completion: "Completed with open exceptions left visible.",
  }),
  C({
    event: "PerformanceReportPublished", domain: "Knowledge", recipients: ["member", "committee", "office"], tone: "info",
    product: { surface: "alert-center", title: "Performance report published", body: "A dated performance position and its provenance are available.", cta: "Open report", persistent: true },
    interruption: { pattern: "review-and-confirm", trigger: "Before publication", reason: "Period, source cut-off, confidence, approvals, corrections, and permitted audience must be reviewed." },
    email: { policy: "immediate", subject: "New performance report for {{vehicleName}}", preheader: "The dated position and source basis are available.", heading: "Performance report published", body: "A new performance report is available for the recorded period. Figures state their source cut-off, provenance, and confidence classification.", cta: "Open report" },
    completion: "Published as a dated position with source provenance.",
  }),
  C({
    event: "LedgerEntryPosted", domain: "Knowledge", recipients: ["office"], tone: "info",
    product: { surface: "toast", title: "Ledger entry posted", body: "The balanced entry is now part of the append-only ledger.", cta: "Open entry", persistent: false },
    interruption: { pattern: "review-and-confirm", trigger: "Before posting", reason: "Accounts, amounts, currency, date, source evidence, and balance must be reviewed before an immutable post." },
    email: { policy: "digest", subject: "Ledger posting digest", preheader: "Balanced entries posted during the period.", heading: "Ledger entries posted", body: "This digest lists balanced entries posted during the period, with dates, accounts, sources, and permanent references. Corrections appear as new entries.", cta: "Open ledger" },
    completion: "Posted immutably; any correction must be a new entry.",
  }),
].map((spec, index) => ({
  ...spec,
  id: `COM-${String(index + 1).padStart(3, "0")}` as const,
}));

export const communicationByEvent = (event: EventType): EventCommunicationSpec => {
  const match = EVENT_COMMUNICATIONS.find((spec) => spec.event === event);
  if (!match) throw new Error(`No communication contract for ${event}`);
  return match;
};

const covered = new Set(EVENT_COMMUNICATIONS.map((spec) => spec.event));
if (EVENT_COMMUNICATIONS.length !== EVENT_TYPES.length || covered.size !== EVENT_TYPES.length) {
  throw new Error("Every event must have exactly one communication contract.");
}
for (const event of EVENT_TYPES) {
  if (!covered.has(event)) throw new Error(`Missing communication contract for ${event}`);
}

