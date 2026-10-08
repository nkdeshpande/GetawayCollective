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

/*
 * REWRITTEN 23 Sep 2026, reported as "not good at all" — and it was not.
 * The panel opened on two paragraphs about itself: what it could explain,
 * where it answered from, what it would do when it could not, and four
 * things it would never do "under a named authority". Everything a person
 * came for sat below all of that.
 *
 * The principle underneath was right and is kept: UX-12 says the limits
 * are stated on OPEN, not discovered on refusal. What changed is the order
 * and the weight. The greeting is one sentence, the questions IRIS can
 * actually answer come next as things to tap, and the boundary follows in
 * one line — still visible before anyone asks anything, no longer the
 * first thing they have to read.
 */
export const IRIS_GREETING =
  "Ask how Getaway Collective works — the properties, the ownership, the returns and the risks.";

/** Stated before anything else, because AI-101 turns on it. */
export const IRIS_BOUNDARY =
  /* All four limits kept; "under a named authority" dropped. It was true
     and it was the platform's governance vocabulary, which a visitor asking
     their first question has no use for. */
  "I answer from what we publish. I don't give advice, recommend an investment, confirm " +
  "eligibility or accept a commitment — a person does those.";

/**
 * Four questions to start from, in the order a reader should meet them.
 *
 * Each is a phrase IRIS's own corpus answers, so a tap can never land on a
 * refusal — tests/iris-panel.test.ts matches every one against
 * `matchIris`. That is what replaced "9 approved answers · 13 Journal
 * entries": the stat was there to set an honest expectation of scope, and
 * four real questions set it better than a count of rows.
 *
 * Risk is on the list, and not last. A platform whose pages put how you
 * lose money before they ask for anything should not hide the question in
 * its assistant.
 */
export const IRIS_STARTERS: readonly string[] = [
  /* NOT "What can I invest in?", which was the first draft and the wrong
     one. The how-to-invest entry also carries "can i invest", out-scored
     the Collection entry, and a person tapping for the list of properties
     was told how qualification works. Caught by tapping it, not by the
     tests — which checked the four starters reached four DIFFERENT answers,
     not the RIGHT ones. They check the right ones now. */
  "What properties are in the Collection?",
  "How does ownership work?",
  "What are the risks?",
  "How do returns work?",
];

export const IRIS_REFUSAL =
  "I do not hold a published answer to that, and I will not guess at one. Leave an address and " +
  "somebody who can answer properly will come back to you.";

/*
 * REWRITTEN 4 Oct 2026, from the founder's own test on a phone.
 *
 * Asked "What properties are in the Collection?", IRIS described the
 * Collection page instead of naming a single estate, and said it carried
 * photography, which no page does. Asked how returns work, it answered in
 * the platform's own shorthand (a "six-stage waterfall", a "confidence
 * class", a "derivation"), which the content sweep of 25 Sep had already
 * taken out of every page and had missed here.
 *
 * So each answer now does three things: it answers the question that was
 * asked, in the words a visitor would use; it says only what a page says;
 * and it points at a page that exists. tests/iris-panel.test.ts holds all
 * three: every estate in the collection is named and placed where the
 * register places it, no answer promises a picture or a figure, and every
 * source is a live route.
 */
export const IRIS_CORPUS: readonly IrisAnswer[] = [
  {
    id: "IR-01",
    asks: ["what is getaway collective", "what is gc", "who are you", "what do you do"],
    answer:
      "Getaway Collective is an investment platform for small retreats in India. Each estate is " +
      "held by its own partnership, and you own units in that partnership. We govern it for the " +
      "people who own it and hold none of it ourselves. Sensory Getaways runs the estates under contract.",
    source: { label: "How it works", to: "/how-it-works" },
  },
  {
    id: "IR-02",
    asks: ["how does ownership work", "what do i own", "what is the structure", "llp"],
    answer:
      "You own units in the partnership, an LLP, that holds one estate: its land and its buildings. " +
      "It is not a share of a pooled fund, and nothing is averaged across estates. Each partnership " +
      "has its own agreement, its own accounts and its own partners, who decide by equity.",
    source: { label: "How it works", to: "/how-it-works" },
  },
  {
    id: "IR-03",
    asks: ["what places", "what is available", "the collection", "properties", "what can i invest in"],
    answer:
      "Seven estates. Streamside Creek, in Coorg, is open now. Seaside Confluence, on the Udupi coast, " +
      "is fully subscribed and takes a waitlist. Solace by SLOWSPACE, near Nandi Hills, and Coffee Fields Forever, " +
      "in Coorg, are funded and in delivery. Nine Hills, Wildwood and Tidal Club are in the pipeline " +
      "and not yet open. The Collection shows each one: its place, its design, who owns it and its capital.",
    source: { label: "The Collection", to: "/collection" },
  },
  {
    id: "IR-04",
    asks: ["how do returns work", "what return", "yield", "waterfall", "distributions"],
    answer:
      "An estate earns from the nights it sells. That money is paid out in a fixed order: the cost " +
      "of running the estate and the operating partner first, the reserves and any bank loan next, " +
      "and the partners last, in proportion to their units. Each estate states its own order in full. " +
      "No return is promised, and I do not quote figures: each estate's page shows them, and says " +
      "which are estimates.",
    source: { label: "How it works", to: "/how-it-works" },
  },
  {
    id: "IR-05",
    asks: ["what are the risks", "how do i lose money", "risk", "is it safe"],
    answer:
      "Your capital is at risk, and you can lose money. Building can cost more or take longer than " +
      "planned. An estate can sell fewer nights than planned. Where there is a bank loan, the bank " +
      "is paid before the partners. And units are hard to sell on, so your money can be tied up for " +
      "years. Each estate lists its own risks, and the risk disclosure sets them out in full. Read " +
      "it before you commit.",
    source: { label: "Risk disclosure", to: "/legal/risk-disclosure" },
  },
  {
    id: "IR-06",
    asks: ["how do i invest", "how do i start", "can i invest", "next step", "join"],
    answer:
      "In three steps. Sign in with your email. Read the estate's offering letter, its partnership " +
      "agreement and the risk disclosure, while your identity checks run alongside. Then sign the " +
      "agreement and pay in, with Investor Relations; once that settles, you are a partner. I cannot " +
      "start or confirm any of it for you. To begin, enquire from the estate's page and a person will reply.",
    source: { label: "How to qualify", to: "/how-to-qualify" },
  },
  {
    id: "IR-07",
    asks: ["who runs it", "who is behind", "team", "governance", "who decides"],
    answer:
      "Three parties, each with its own part. The partners of an estate own it and decide its " +
      "major matters, by equity. Getaway Collective sets each partnership up and governs it for " +
      "them. Sensory Getaways operates the estates under contract. The Team page names the people.",
    source: { label: "Team", to: "/team" },
  },
  {
    id: "IR-08",
    asks: ["contact", "speak to someone", "talk to a person", "human", "email"],
    answer:
      "The contact page takes your question to a person, who replies in writing. If it is about " +
      "one estate, enquire from that estate's page, so your question arrives with the estate named.",
    source: { label: "Contact", to: "/contact" },
  },
  {
    id: "IR-09",
    asks: ["can i use it", "visit", "time", "when can i use", "allocation"],
    answer:
      "Nights are shared among an estate's partners in proportion to what each holds, and they begin " +
      "once the estate is built: an unbuilt estate carries no nights. The rule that shares them out is " +
      "still being decided, and each estate's offering letter will set it.",
    source: { label: "Answers", to: "/answers" },
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
