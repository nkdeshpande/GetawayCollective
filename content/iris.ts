/**
 * IRIS · THE APPROVED CORPUS — AI-101, and nothing beyond it
 *
 * Authority: constants/ai-contracts.ts AI-101 · UX-07 · UX-12
 *
 * ── WHY THERE IS NO MODEL BEHIND THIS ────────────────────────────────
 * AI-101 permits IRIS to "explain the place and the model" from "the
 * public approved projection", and prohibits it from recommending an
 * investment or inventing a fact. A language model answering from its own
 * training satisfies neither clause: it has never read this corpus, and
 * asked about an investment platform it will produce a yield, a structure
 * or an availability that sounds entirely plausible and is not true.
 *
 * For a SEBI-adjacent platform that is not a quality problem, it is a
 * disclosure one. So v1 answers only from the entries below, matches
 * deterministically, and REFUSES anything it does not hold.
 *
 * The refusal is the feature. An agent that declines and offers a human
 * is doing AI-101 correctly; one that always has an answer is not.
 *
 * ── WHY THESE ANSWERS ARE ALREADY APPROVED ───────────────────────────
 * Everything here passes vocab-lint and voice-lint to reach the
 * repository, exactly like every other file in content/. That is what
 * "approved" means today, and it is a stronger guarantee than a CMS
 * approval button would give, because the check is mechanical and runs on
 * every commit.
 *
 * When the authoring workflow lands, this file becomes its seed and the
 * corpus grows through that gate instead of through a commit.
 *
 * ── EVERY ANSWER CARRIES ITS SOURCE ──────────────────────────────────
 * AI-101 requires "approved claims + source context". `source` names the
 * surface a person can go and read for themselves, so the answer is a
 * signpost rather than a substitute.
 */

export interface IrisAnswer {
  /** Stable id. Referenced by an interaction record, so never recycled. */
  readonly id: string;
  /** What a person actually types. Matched case- and order-insensitively. */
  readonly asks: readonly string[];
  readonly answer: string;
  /** Where this is stated in full. Always a live route. */
  readonly source: { readonly label: string; readonly to: string };
}

export const IRIS_GREETING =
  "I can explain how Getaway Collective works, what the Collection holds, and how ownership and " +
  "returns are structured. I answer from published material only — where I do not hold something, " +
  "I will say so and take your details for a person to follow up.";

/** Stated before anything else, because AI-101 turns on it. */
export const IRIS_BOUNDARY =
  "I cannot give advice, recommend an investment, confirm eligibility or accept a commitment. " +
  "Those are decisions a person takes, under a named authority.";

export const IRIS_REFUSAL =
  "I do not hold a published answer to that, and I will not guess at one. Leave an address and " +
  "somebody who can answer properly will come back to you.";

export const IRIS_CORPUS: readonly IrisAnswer[] = [
  {
    id: "IR-01",
    asks: ["what is getaway collective", "what is gc", "who are you", "what do you do"],
    answer:
      "Getaway Collective is an investment platform. It raises and governs capital for remarkable " +
      "places, held through clear, vehicle-specific ownership. It does not operate the properties — " +
      "Sensory Getaways does that under a Management Agreement.",
    source: { label: "How it works", to: "/how-it-works" },
  },
  {
    id: "IR-02",
    asks: ["how does ownership work", "what do i own", "what is the structure", "llp"],
    answer:
      "Each place is held by its own investment vehicle, and participation is a position in that " +
      "vehicle rather than a share of a pooled fund. What the vehicle owns, what it owes and how " +
      "it is governed are stated per vehicle, not averaged across a portfolio.",
    source: { label: "Ownership", to: "/collection/slowspace-coastal/ownership" },
  },
  {
    id: "IR-03",
    asks: ["what places", "what is available", "the collection", "properties", "what can i invest in"],
    answer:
      "The Collection lists every place that exists, with photography and the argument for it " +
      "before any figure. Each one carries its own chapters — the place, the life, the idea, the " +
      "asset, ownership, the investment and the risk.",
    source: { label: "The Collection", to: "/collection" },
  },
  {
    id: "IR-04",
    asks: ["how do returns work", "what return", "yield", "waterfall", "distributions"],
    answer:
      "Returns follow a six-stage waterfall stated per vehicle, and every forward figure carries " +
      "its confidence class so you can see which numbers are observed and which are modelled. " +
      "I will not quote a number here — the vehicle's own investment chapter states it with its " +
      "derivation beside it.",
    source: { label: "The Investment", to: "/collection/slowspace-coastal/investment" },
  },
  {
    id: "IR-05",
    asks: ["what are the risks", "how do i lose money", "risk", "is it safe"],
    answer:
      "Capital is at risk, and how a vehicle loses money is stated before anyone is asked for " +
      "anything. The standing risk disclosure covers the position in full, and it is deliberately " +
      "reachable before commitment rather than after it.",
    source: { label: "Risk disclosure", to: "/legal/risk-disclosure" },
  },
  {
    id: "IR-06",
    asks: ["how do i invest", "how do i start", "can i invest", "next step", "join"],
    answer:
      "Participation runs through qualification first, then a private diligence path, then a " +
      "private commitment step. I cannot start or confirm any of it. The enquiry surface on a " +
      "vehicle carries your interest to a person along with the vehicle it concerns.",
    source: { label: "Enquire", to: "/collection/slowspace-coastal/enquire" },
  },
  {
    id: "IR-07",
    asks: ["who runs it", "who is behind", "team", "governance", "who decides"],
    answer:
      "Authority at Getaway Collective is a grant, never a title. Decisions sit with constituted " +
      "offices and committees, each holding named rights that can be granted and revoked, rather " +
      "than with job descriptions.",
    source: { label: "About", to: "/about" },
  },
  {
    id: "IR-08",
    asks: ["contact", "speak to someone", "talk to a person", "human", "email"],
    answer:
      "The contact page carries the general addresses. If your question is about a specific " +
      "vehicle, the enquiry surface on that vehicle is better — it arrives with its subject, so " +
      "nobody has to reconstruct what you were asking about.",
    source: { label: "Contact", to: "/contact" },
  },
  {
    id: "IR-09",
    asks: ["can i use it", "visit", "time", "when can i use", "allocation"],
    answer:
      "Time in a place is derived from the position held in its vehicle, and the allocation is " +
      "stated per vehicle. Operating the properties is Sensory Getaways' responsibility rather " +
      "than ours, so anything about a place already in operation belongs with them.",
    source: { label: "How it works", to: "/how-it-works" },
  },
];

/**
 * Words that carry no subject, and must never earn a match.
 *
 * The first version of this scored on any word over three letters, which
 * meant "what" — present in four separate entries — accumulated a point
 * per entry. "What is the weather in Paris" reached the threshold on the
 * interrogative alone and was answered with the description of GC.
 *
 * That is the precise failure this matcher exists to avoid: an answer to
 * a question nobody asked, delivered confidently, where a refusal would
 * have routed to a person. Interrogatives and articles are stripped so a
 * match can only ever come from a word about the subject.
 */
const STOP = new Set([
  "what", "when", "where", "which", "whom", "whose", "how", "why", "who",
  "is", "are", "was", "were", "be", "been", "being", "the", "a", "an",
  "do", "does", "did", "can", "could", "will", "would", "should", "may",
  "i", "it", "its", "to", "of", "in", "on", "at", "for", "with", "from",
  "my", "me", "you", "your", "we", "us", "our", "they", "them",
  "and", "or", "but", "if", "so", "that", "this", "these", "those",
  "there", "here", "any", "some", "get", "got", "have", "has", "had",
]);

const distinctive = (phrase: string): string[] =>
  phrase.split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

/**
 * Match a question to the corpus.
 *
 * Deterministic and deliberately conservative. A whole phrase appearing
 * intact is decisive; otherwise at least two distinct subject words must
 * appear, counted once each however many entries share them.
 *
 * When a model provider is chosen its job is to improve THIS — deciding
 * what was asked — never to author the answer. The corpus stays the only
 * thing IRIS may say.
 */
export function matchIris(question: string): IrisAnswer | null {
  const q = ` ${question.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()} `;
  if (q.trim().length < 2) return null;

  let best: { entry: IrisAnswer; score: number } | null = null;

  for (const entry of IRIS_CORPUS) {
    let score = 0;
    /* Counted once per entry, not once per phrase: three entries sharing
       the word "risk" must not make "risk" worth three points. */
    const seen = new Set<string>();

    for (const ask of entry.asks) {
      if (q.includes(` ${ask} `) || q.includes(`${ask} `) || q.trim() === ask) {
        score += 10;
        continue;
      }
      for (const w of distinctive(ask)) {
        if (!seen.has(w) && q.includes(` ${w}`)) {
          seen.add(w);
          score += 1;
        }
      }
    }
    if (!best || score > best.score) best = { entry, score };
  }

  /* Two subject words, or one intact phrase. Below that IRIS refuses and
     offers a person, which is the correct AI-101 outcome. */
  return best && best.score >= 2 ? best.entry : null;
}
