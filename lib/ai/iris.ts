/**
 * IRIS · RELATIONSHIP INTELLIGENCE — the runtime
 *
 * Authority: constants/ai-contracts.ts AI-101 · AI-103 · UX-07 · UX-12
 *
 * ── WHAT THIS ADDS TO content/iris.ts ────────────────────────────────
 * The corpus and its matcher already existed and were already right. Two
 * things were missing, and one of them was the whole point.
 *
 * First, the output object. AI-101 names it "Interaction + Answer", and
 * FIX-10 exists because a reply that leaves no record of having been
 * produced by an agent is an invisible agent action. The API route was
 * returning loose JSON — good JSON, but not an auditable object. Every
 * turn now produces a GovernedOutput, the same type ATLAS produces, for
 * the same reason.
 *
 * Second, the Journal. Thirteen entries with a route each, and IRIS could
 * not point at any of them.
 *
 * ── WHY THE JOURNAL SUPPLEMENTS AND NEVER ANSWERS ────────────────────
 * This is the load-bearing decision in the file, so it is worth being
 * exact about.
 *
 * AI-101 prohibits inventing a fact and permits explanation from "the
 * public approved projection". The corpus is that projection: nine
 * answers, each checked, each pointing at the surface where the thing is
 * stated in full.
 *
 * The Journal is not that. It is editorial — arguments, essays, a piece
 * that says most people should rent rather than buy. Answering "what is
 * the minimum commitment" with a sentence lifted from an essay would
 * produce something fluent, sourced, and not an approved claim. The
 * failure would look exactly like success.
 *
 * So the corpus ANSWERS and the Journal is offered as READING. Where the
 * corpus holds nothing, IRIS still refuses the question — and then says
 * what there is to read, which is more useful than a refusal alone and
 * makes no claim it is not entitled to make.
 *
 * ── ESCALATION IS THE GOOD OUTCOME ───────────────────────────────────
 * UX-07 holds that a person handed to a human never repeats themselves.
 * handoffPackage carries the question, everything asked before it, and
 * what IRIS already said — so the human starts where the conversation
 * got to rather than at the beginning.
 */

import { IRIS_CORPUS, IRIS_BOUNDARY, IRIS_REFUSAL, matchIris, type IrisAnswer } from "../../content/iris";
import { JOURNAL, type Entry } from "../../content/journal";
import { provenance } from "../provenance";
import { governedOutput, type Assertion, type GovernedOutput } from "./output";

/** Who a handoff reaches. INV-170 carries a qualified investor to a person. */
const IR_DESK = "investor_relations";

/**
 * The three contracts IRIS cannot run, and what each is waiting on.
 *
 * All three are the same missing thing wearing different clothes: IRIS
 * has no idea who it is talking to. AI-101 works precisely because it
 * does not need to know — a public question has a public answer.
 *
 * The moment a contract says "the investor projection" or "the member's
 * own position", it needs an identity, an entitlement and a record of
 * what that person is allowed to be told. Answering those questions
 * without them would mean either refusing everyone or quoting somebody
 * else's position, and AI-104's prohibition is exactly "expose another
 * member".
 */
export const UNIMPLEMENTED: readonly { contractId: string; waitingOn: string }[] = [
  { contractId: "AI-102", waitingOn:
    "The investor projection. There is no Investor record, so `accredited` is hard-coded false and " +
    "there is no relationship context to explain anything against." },
  { contractId: "AI-104", waitingOn:
    "The member projection and an entitlement to read it. Answering about 'the member's own " +
    "position' needs to know whose position it is, and a wrong answer here exposes another member." },
  { contractId: "AI-105", waitingOn:
    "A notice delivery record. Translating 'a member action is required' needs the notice to have " +
    "been delivered and acknowledged, and no delivery record exists — see constants/notice-bindings.ts." },
];

// ─────────────────────────────────────────────────────────────────────
// Reading — the Journal, offered but never quoted as fact
// ─────────────────────────────────────────────────────────────────────

export interface Reading {
  readonly title: string;
  readonly to: string;
  readonly why: string;
  readonly minutes: number;
}

/* Words too common to distinguish one entry from another. Shared with the
   corpus matcher's intent: a question is identified by its subject, and
   "what" is not a subject. */
const STOP = new Set([
  "what", "when", "where", "which", "who", "why", "how", "does", "did", "the",
  "and", "for", "are", "was", "you", "your", "can", "will", "with", "this",
  "that", "from", "have", "has", "about", "into", "than", "then", "there",
  "its", "it's", "not", "but", "all", "any", "one", "get", "got",
]);

const terms = (s: string): string[] =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));

/**
 * What is worth reading on this subject.
 *
 * Scored over the title, standfirst and franchise rather than the body.
 * Body text would win on word count alone and surface the longest article
 * to every question — the standfirst is the entry's own claim about what
 * it is for, which is the better signal and the shorter one.
 */
export function reading(question: string, limit = 2): Reading[] {
  const asked = new Set(terms(question));
  if (asked.size === 0) return [];

  const scored = JOURNAL.map((e: Entry) => {
    const hay = new Set([
      ...terms(e.title),
      ...terms(e.standfirst),
      ...terms(e.meta?.franchise ?? ""),
      ...terms(e.meta?.channel ?? ""),
    ]);
    let score = 0;
    for (const w of asked) if (hay.has(w)) score += 1;
    /* A title hit is worth more than a standfirst hit — an entry titled
       for the question is about the question. */
    for (const w of terms(e.title)) if (asked.has(w)) score += 1;
    return { e, score };
  })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score || a.e.id.localeCompare(b.e.id));

  return scored.slice(0, limit).map(({ e }) => ({
    title: e.title,
    to: `/journal/${e.slug}`,
    why: e.standfirst,
    minutes: e.minutes,
  }));
}

// ─────────────────────────────────────────────────────────────────────
// AI-101 · Interaction + Answer
// ─────────────────────────────────────────────────────────────────────

export interface Turn {
  readonly question: string;
  /** ISO date. The clock, passed rather than read — see output.ts. */
  readonly at: string;
  /** Which turn of the conversation this is. Makes the output id stable. */
  readonly ordinal?: number;
}

export interface IrisReply {
  readonly kind: "answer" | "refusal";
  /** What IRIS says out loud. */
  readonly say: string;
  /** Present on an answer. Where the claim is stated in full. */
  readonly source?: IrisAnswer["source"];
  /** Offered on both. Editorial, never a claim. */
  readonly reading: readonly Reading[];
  /** True whenever a person should be offered. Always true on a refusal. */
  readonly escalate: boolean;
  readonly boundary: string;
  /** The auditable artifact. AI-101's output object. */
  readonly output: GovernedOutput;
}

export function respond(turn: Turn): IrisReply {
  const hit = matchIris(turn.question);
  const reads = reading(turn.question);

  const assertions: Assertion[] = [];

  if (hit) {
    assertions.push({
      claim: hit.answer,
      evidence: provenance({
        value: hit.id,
        /* REPORTED, not INFERRED. IRIS is repeating an approved claim
           verbatim rather than deriving anything, and the confidence
           belongs to the corpus entry rather than to the agent. */
        confidence: "REPORTED",
        observedAt: turn.at,
        source: `content/iris.ts ${hit.id}`,
        observer: "IRIS",
      }),
      sources: [`iris:${hit.id}`, hit.source.to],
    });
  }

  /* Reading is asserted separately and carries no evidence — it is a
     pointer, not a claim, and giving it a confidence class would dress an
     essay as an approved fact. */
  for (const r of reads) {
    assertions.push({
      claim: `Worth reading: ${r.title} (${r.minutes} min).`,
      sources: [r.to],
    });
  }

  if (!hit) {
    /* A refusal with nothing to offer still has to assert something, or
       there is no record of what was asked and declined. */
    if (assertions.length === 0) {
      assertions.push({
        claim: `No approved answer is held for: "${turn.question}".`,
        sources: ["content/iris.ts"],
      });
    }

    return {
      kind: "refusal",
      say: IRIS_REFUSAL,
      reading: reads,
      escalate: true,
      boundary: IRIS_BOUNDARY,
      output: governedOutput({
        contractId: "AI-101",
        subject: turn.question.slice(0, 120),
        disposition: "explain",
        headline: "No approved answer held. Offered a person.",
        assertions,
        owner: IR_DESK,
        at: turn.at,
        ordinal: turn.ordinal,
      }),
    };
  }

  return {
    kind: "answer",
    say: hit.answer,
    source: hit.source,
    reading: reads,
    /* An answered question still offers a person. UX-07 is about not
       making somebody ask twice, and the commonest reason they do is that
       the answer was right and incomplete. */
    escalate: false,
    boundary: IRIS_BOUNDARY,
    output: governedOutput({
      contractId: "AI-101",
      subject: turn.question.slice(0, 120),
      disposition: "explain",
      headline: `Answered from ${hit.id}.`,
      assertions,
      owner: IR_DESK,
      at: turn.at,
      ordinal: turn.ordinal,
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────
// AI-103 · Handoff Package
// ─────────────────────────────────────────────────────────────────────

/**
 * Everything the human needs so the person is not asked to start again.
 *
 * The contract's single prohibition is "Hide material context", which is
 * why the whole transcript goes in rather than a summary of it. A summary
 * is a judgement about what mattered, and IRIS is not entitled to make it
 * on behalf of the person being handed over.
 */
export function handoffPackage(input: {
  readonly email: string;
  readonly asked: readonly string[];
  readonly said: readonly string[];
  readonly vehicleSlug?: string;
  readonly at: string;
}): GovernedOutput {
  const assertions: Assertion[] = [
    {
      claim: `Reachable at ${input.email}.`,
      sources: ["iris:contact"],
    },
    ...input.asked.map((q, i) => ({
      claim: `Asked: ${q}`,
      sources: [`iris:turn:${i}`],
    })),
    ...input.said.map((a, i) => ({
      claim: `IRIS said: ${a}`,
      sources: [`iris:turn:${i}`],
    })),
  ];

  if (input.vehicleSlug) {
    assertions.push({
      claim: `Reading about ${input.vehicleSlug} when they asked.`,
      sources: [`/collection/${input.vehicleSlug}`],
    });
  }

  return governedOutput({
    contractId: "AI-103",
    subject: input.email,
    disposition: "escalate",
    headline:
      `Handoff: ${input.asked.length} question(s) asked, ` +
      `${input.asked.length - input.said.length} unanswered.`,
    assertions,
    owner: IR_DESK,
    askedOfOwner:
      "Pick this up and reply. The full exchange is above — nobody should be asked to repeat it.",
    /* Same day. A handoff with a fortnight's deadline is a queue. */
    dueBy: input.at.slice(0, 10),
    at: input.at,
  });
}

/** What IRIS can speak from, for the panel that says so out loud. */
export const CORPUS_SIZE = {
  answers: IRIS_CORPUS.length,
  entries: JOURNAL.length,
} as const;
