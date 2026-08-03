/**
 * NOTICE BINDINGS — which event sends which notice to whom
 *
 * ── WHY THIS IS A THIRD REGISTRY AND NOT A COLUMN SOMEWHERE ──────────
 * Three separate questions were being answered in two places:
 *
 *   lib/events.ts          WHAT HAPPENED — the 55 event types
 *   content/notifications  WHAT IT SAYS  — N-01…N-17, the words
 *   here                   WHO IS TOLD   — the routing
 *
 * The catalogue carries an `audience`, which is who a notice is written
 * FOR. That is not the same as who is SENT it: a commitment acknowledges
 * to the investor AND to Investor Relations, and one audience field
 * cannot say so. Routing is its own fact.
 *
 * ── "NO EMAIL" IS A DECISION, RECORDED ───────────────────────────────
 * `Offering.Viewed` is bound to nothing on purpose. Left out of the table
 * it would read as an oversight and somebody would eventually add it —
 * emailing a person because they looked at a page is the behaviour this
 * platform should never acquire. Stated, it stays decided.
 *
 * ── SEVEN OF TWELVE CANNOT FIRE YET, AND SAY SO ──────────────────────
 * `eventType` is the real member of the EventType union that triggers a
 * binding, or null where no such event exists. Seven are null. That is
 * not a gap in this file — it is the gap this file makes visible, and the
 * alternative is a routing table that looks complete while more than half
 * of it is unreachable.
 *
 * The `wired` flag on the notice itself is the second gate: even a
 * binding with a real event will not send until the notice is wired, and
 * lib/email/send.ts refuses a specimen regardless of what is bound here.
 */

import { NOTICES } from "../content/notifications";
import type { Audience } from "../content/notifications";
import type { EventType } from "../lib/events";

/**
 * Who is sent a notice, as opposed to who it is written for.
 *
 * `authority-holder` and `responsible-person` are deliberately not the
 * `office` audience. Office copy is written for an office-holder; these
 * two say the message must reach a NAMED person carrying a right or an
 * obligation, not whoever happens to read a shared inbox. Resolving them
 * needs the grant table, which is why both are unbound today.
 */
export type Recipient =
  | "investor"
  | "member"
  | "investor-relations"
  | "authority-holder"
  | "responsible-person"
  | "counterparties";

export interface NoticeBinding {
  /** The domain name for this moment, as the operating model states it. */
  readonly gcEvent: string;
  /** The EventType that fires it, or null where none exists yet. */
  readonly eventType: EventType | null;
  /** Everyone sent it. Empty means deliberately no email. */
  readonly recipients: readonly Recipient[];
  /** The notice in content/notifications.ts, or null where none is written. */
  readonly noticeId: string | null;
  /** What the template is called in the operating model. */
  readonly template: string;
  /** Why it cannot fire, where it cannot. */
  readonly blockedBy?: string;
}

export const NOTICE_BINDINGS: readonly NoticeBinding[] = [
  {
    gcEvent: "Investor.Enquired",
    eventType: null,
    recipients: ["investor", "investor-relations"],
    noticeId: null,
    template: "Enquiry received",
    /* The sharpest finding in this table. N-17 fires today and goes to
       the OFFICE — so somebody who enquires currently receives nothing at
       all. Not a delayed reply: no acknowledgement exists to send. */
    blockedBy:
      "No investor-facing acknowledgement is written. N-17 covers the same moment but is addressed " +
      "to the office, so the person who enquired is told nothing.",
  },
  {
    gcEvent: "Investor.Qualified",
    eventType: "AccreditationGranted",
    recipients: ["investor"],
    noticeId: "N-02",
    template: "Qualification confirmation",
  },
  {
    gcEvent: "Offering.Viewed",
    eventType: null,
    recipients: [],
    noticeId: null,
    template: "No email",
    blockedBy:
      "Bound to nothing deliberately. Emailing somebody because they looked at a page is a habit " +
      "this platform should not acquire, and recording the decision is what stops it being added " +
      "later as an oversight correction.",
  },
  {
    gcEvent: "Offering.Reserved",
    eventType: null,
    recipients: ["investor", "investor-relations"],
    noticeId: "N-03",
    /* §25 forbids the bare word — it belongs to the Operating Partner,
       where it means holding a place for a night. Here it means holding
       an allocation in a capital raise, which is a different act entirely.
       This is the same shape as "Debt Service", which vocabulary.ts
       exempts as a declared compound. It is NOT declared here, because
       that mechanism requires each entry to cite a constitutional
       authority and this term's authority is an operating-model note
       rather than a ratified document. Pragma per the mechanism's own
       instruction for one-off legitimate uses — see the note in the
       header about promoting it. */
    template: "Reservation confirmation", // vocab-lint-ignore — capital-raise term of art, not hospitality
    blockedBy:
      "It is not modelled. There is no event, no record and no payment path — this is the unit of " + // vocab-lint-ignore
      "exchange, and it does not exist in any form yet.",
  },
  {
    gcEvent: "Commitment.Made",
    eventType: "CommitmentAccepted",
    recipients: ["investor", "investor-relations"],
    noticeId: "N-04",
    template: "Commitment acknowledgement",
  },
  {
    gcEvent: "Partner.Admitted",
    eventType: "MemberStatePromoted",
    /* "Partner" in the operating model is an Investor in member state —
       the L2 sheet holds that there is one Investor identity before and
       after settlement, so the recipient is `member`, not a new party. */
    recipients: ["member"],
    noticeId: "N-05",
    template: "Welcome / admission",
  },
  {
    gcEvent: "Capital.Contributed",
    eventType: "CommitmentSettled",
    recipients: ["member"],
    noticeId: null,
    template: "Contribution receipt",
    blockedBy:
      "The event exists; no receipt is written. A contribution acknowledged only by a change of " +
      "state on a screen is the one moment an investor most expects paper.",
  },
  {
    gcEvent: "Document.Executed",
    eventType: null,
    recipients: ["counterparties"],
    noticeId: "N-14",
    template: "Executed document",
    blockedBy:
      "No execution event exists. ContentVersionPublished is publishing, which is a different act, " +
      "and N-14 announces a version change rather than an execution.",
  },
  {
    gcEvent: "Compliance.Due",
    eventType: null,
    recipients: ["responsible-person"],
    noticeId: "N-15",
    template: "Compliance reminder",
    blockedBy:
      "No obligation register and no due-date event. N-15 covers covenant proximity, which is one " +
      "obligation of many, and 'the responsible person' cannot be resolved without the grant table.",
  },
  {
    gcEvent: "Decision.Required",
    eventType: "ResolutionTabled",
    recipients: ["authority-holder"],
    noticeId: "N-07",
    template: "Action required",
    blockedBy:
      "The event exists but the recipient cannot be resolved: reaching the holder of a named right " +
      "means reading the grant table, and nothing does that at send time yet.",
  },
  {
    gcEvent: "Distribution.Declared",
    eventType: null,
    recipients: ["member"],
    noticeId: "N-09",
    template: "Distribution notice",
    /* Declaration and payment are different moments and the union only
       has the second. A member told at payment was never told a
       distribution was coming. */
    blockedBy:
      "No declaration event. DistributionExecuted is the payment, and the copy in N-09 and N-10 " +
      "already distinguishes the two moments that the event union does not.",
  },
  {
    gcEvent: "Distribution.Paid",
    eventType: "DistributionExecuted",
    recipients: ["member"],
    noticeId: "N-10",
    template: "Payment confirmation",
  },
];

/** Bindings that could fire today: a real event and a written notice. */
export const bindable = (): NoticeBinding[] =>
  NOTICE_BINDINGS.filter((b) => b.eventType !== null && b.noticeId !== null);

/** Everything an event should send. One event may carry several. */
export const bindingsFor = (e: EventType): NoticeBinding[] =>
  NOTICE_BINDINGS.filter((b) => b.eventType === e);

export const bindingByGcEvent = (name: string): NoticeBinding | undefined =>
  NOTICE_BINDINGS.find((b) => b.gcEvent === name);

/** Which audience a bound notice is written for. Routing reads this. */
export function audienceOf(b: NoticeBinding): Audience | null {
  if (!b.noticeId) return null;
  return NOTICES.find((n) => n.id === b.noticeId)?.audience ?? null;
}

export const BINDING_LAWS = {
  routingIsNotAudience:
    "A notice's audience is who it is written FOR. A binding is who it is SENT to. A commitment " +
    "acknowledges to the investor and to Investor Relations at once, and one audience field cannot " +
    "say so.",
  silenceIsDeclared:
    "Offering.Viewed is bound to nothing on purpose. An absent row reads as an oversight and gets " +
    "filled in; a stated one stays decided.",
  blockedIsVisible:
    "Seven of twelve name no event. The table records why rather than omitting them, because a " +
    "routing map that looks complete while half of it is unreachable is worse than no map.",
  onePersonThroughout:
    "Partner is an Investor in member state, not a separate party. The recipient is `member` — " +
    "there is one identity before and after settlement.",
} as const;
