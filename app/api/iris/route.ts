/**
 * POST /api/iris — IRIS v1: answer from the approved corpus, or refuse
 *
 * ── NO MODEL IS CALLED HERE ──────────────────────────────────────────
 * AI-101 permits IRIS to explain from "the public approved projection"
 * and prohibits it from inventing a fact. A language model answering an
 * investment question from its own training does exactly that, fluently,
 * and a plausible invented yield is worse than no answer at all.
 *
 * So v1 matches deterministically against content/iris.ts and refuses
 * what it does not hold. When a provider is chosen the model's job is to
 * improve MATCHING — understanding what was asked — never to author the
 * answer. The corpus stays the only thing IRIS may say.
 *
 * ── EVERY TURN PRODUCES AN ARTIFACT, NOT JUST A REPLY ────────────────
 * AI-101's output object is "Interaction + Answer". FIX-10 exists because
 * a recommendation that arrives as a sentence and leaves no record is an
 * invisible agent action. So a contact left here is written down, with the
 * question that prompted it, and the answer names its source so the person
 * can go and read the real thing.
 *
 * ── WHAT IT MAY NOT DO ───────────────────────────────────────────────
 * Accredit, recommend, accept, bind, decide, or quote another member's
 * data. None of those is reachable from this endpoint: it holds no
 * identity, touches no ratified object, and its only write is an inbound
 * contact.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { recordContact } from "@/lib/events/store";
import { respond, handoffPackage } from "@/lib/ai/iris";

const Ask = z.object({
  question: z.string().min(1).max(500),
});

const Leave = z.object({
  email: z.string().email(),
  /* The question that prompted them to leave it. Carried so whoever picks
     it up starts from what was actually asked (UX-07). */
  question: z.string().max(500).optional(),
  vehicleSlug: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  /* G-10, before the body is read. */
  const rl = await rateLimit(clientKey(req));
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const body = await req.json().catch(() => null);

  /* Leaving an address. */
  const leave = Leave.safeParse(body);
  if (leave.success) {
    const at = new Date().toISOString();

    /* AI-103. Built BEFORE the write, because it is what makes the write
       worth anything: a stored address with no record of what was asked
       hands somebody a name and no context, and UX-07 exists precisely so
       the person does not have to start again. */
    const handoff = handoffPackage({
      email: leave.data.email,
      asked: leave.data.question ? [leave.data.question] : [],
      said: [],
      vehicleSlug: leave.data.vehicleSlug,
      at,
    });

    const stored = await recordContact({
      email: leave.data.email,
      /* The handoff's own headline and claims, not a re-worded version.
         Two summaries of the same exchange drift. */
      note: handoff.assertions.map((a) => a.claim).join(" · "),
      source: "iris",
      vehicleSlug: leave.data.vehicleSlug,
      correlationId: crypto.randomUUID(),
    }).catch(() => false);

    return NextResponse.json({
      ok: true,
      kind: "contact",
      /* Honest either way. If there is nowhere to write it, the person is
         told rather than thanked for something that did not happen. */
      recorded: stored,
      say: stored
        ? "Thank you — that is recorded, and somebody who can answer properly will come back to you."
        : "I could not record that just now. The contact page carries the addresses directly.",
      output: handoff,
    });
  }

  /* Asking a question. */
  const ask = Ask.safeParse(body);
  if (!ask.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  /* Every turn now produces AI-101's output object rather than a loose
     reply. The wire shape is unchanged for anything already reading it —
     `say`, `source`, `kind` are all still here — with the governed object
     alongside, so an interaction can be audited after the fact. */
  const reply = respond({ question: ask.data.question, at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    kind: reply.kind,
    say: reply.say,
    source: reply.source,
    reading: reply.reading,
    escalate: reply.escalate,
    boundary: reply.boundary,
    output: reply.output,
  });
}
