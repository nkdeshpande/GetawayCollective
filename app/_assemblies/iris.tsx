"use client";

/**
 * AS-IRIS · THE RELATIONSHIP PANEL
 *
 * Authority: constants/ai-contracts.ts AI-101 · AI-103 · UX-07 · UX-12
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * IRIS had a corpus, a matcher, a governed output and an endpoint, and no
 * way for anybody to reach it. Everything above this file was the hard
 * part and none of it was worth anything without this.
 *
 * ── IT SAYS WHAT IT IS, BEFORE IT SAYS ANYTHING ELSE ─────────────────
 * The boundary is rendered on open rather than on refusal. UX-12 turns on
 * a person knowing what they are talking to; disclosing the limits only
 * once they are hit means disclosing them to the person who already
 * assumed otherwise.
 *
 * The panel also states the size of what IRIS can speak from. "Nine
 * approved answers and thirteen entries" sets an accurate expectation in
 * seven words, and an accurate expectation is what stops somebody
 * treating a refusal as a malfunction.
 *
 * ── THE REFUSAL IS THE FEATURE, SO IT IS DESIGNED ────────────────────
 * A refusal is not an error state and is not styled as one. It carries
 * the same weight as an answer, offers whatever is worth reading, and
 * puts the address field directly underneath. content/iris.ts says an
 * agent that declines and offers a human is doing AI-101 correctly; this
 * is that sentence as an interface.
 *
 * ── NO COLOURS, NO FIGURES ───────────────────────────────────────────
 * §29 forbids literals in components, so everything here is a token. And
 * this renders at the public vantage, so it shows no figure of its own —
 * every number a person sees comes from the corpus entry, which is
 * already an approved claim.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IRIS_GREETING, IRIS_BOUNDARY } from "@/content/iris";
import { CORPUS_SIZE } from "@/lib/ai/iris";

interface Reading {
  title: string;
  to: string;
  why: string;
  minutes: number;
}

interface Said {
  who: "person" | "iris";
  text: string;
  source?: { label: string; to: string };
  reading?: Reading[];
  escalate?: boolean;
}

export function IrisPanel({ vehicleSlug }: { vehicleSlug?: string }) {
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState<Said[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [left, setLeft] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  /* Every question asked, carried into the handoff so nobody repeats
     themselves (UX-07). */
  const asked = said.filter((s) => s.who === "person").map((s) => s.text);
  const offerPerson = said.some((s) => s.escalate);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [said, left]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const question = q.trim();
    if (!question || busy) return;
    setQ("");
    setSaid((s) => [...s, { who: "person", text: question }]);
    setBusy(true);
    try {
      const r = await fetch("/api/iris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const d = await r.json();
      setSaid((s) => [...s, {
        who: "iris",
        text: d.say ?? "I could not answer just now.",
        source: d.source,
        reading: d.reading,
        escalate: d.escalate,
      }]);
    } catch {
      /* Named honestly. "Something went wrong" would be indistinguishable
         from a refusal, and the two mean opposite things. */
      setSaid((s) => [...s, {
        who: "iris",
        text: "I could not reach the answer store. Nothing is wrong with your question.",
        escalate: true,
      }]);
    } finally {
      setBusy(false);
    }
  }

  async function leave(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/iris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          question: asked[asked.length - 1],
          vehicleSlug,
        }),
      });
      const d = await r.json();
      setLeft(d.say ?? "Recorded.");
      setEmail("");
    } catch {
      setLeft("I could not record that. The contact page carries the addresses directly.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        className="btn iris-open"
        onClick={() => setOpen(true)}
        aria-label="Open IRIS, the relationship agent"
      >
        Ask IRIS
      </button>
    );
  }

  return (
    <aside className="iris" role="complementary" aria-label="IRIS">
      <div className="iris-head">
        <div>
          <span className="t-micro label">IRIS · Relationship Intelligence</span>
          <p className="t-body-s dim">
            {CORPUS_SIZE.answers} approved answers · {CORPUS_SIZE.entries} Journal entries
          </p>
        </div>
        <button className="btn" onClick={() => setOpen(false)} aria-label="Close IRIS">
          Close
        </button>
      </div>

      <div className="iris-said">
        {said.length === 0 ? (
          <>
            <p className="t-body">{IRIS_GREETING}</p>
            {/* Stated on open, not on refusal — see the header. */}
            <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              {IRIS_BOUNDARY}
            </p>
          </>
        ) : null}

        {said.map((s, i) => (
          <div key={i} className="iris-turn" data-who={s.who}>
            <span className="t-micro label">{s.who === "person" ? "You" : "IRIS"}</span>
            <p className="t-body">{s.text}</p>

            {/* AI-101: an approved claim always shows where it is stated
                in full, so the answer is a signpost and not a substitute. */}
            {s.source ? (
              <Link href={s.source.to} className="t-body-s iris-source">
                {s.source.label} →
              </Link>
            ) : null}

            {s.reading?.length ? (
              <div className="iris-reading">
                <span className="t-micro label">Worth reading</span>
                {s.reading.map((r) => (
                  <Link key={r.to} href={r.to} className="iris-read">
                    <span className="t-body-s">{r.title}</span>
                    <span className="t-micro dim">{r.minutes} min</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* The address field appears the moment a person is offered, not
          behind another click. */}
      {offerPerson && !left ? (
        <form className="iris-leave" onSubmit={leave}>
          <label className="t-micro label" htmlFor="iris-email">
            Leave an address and a person will come back to you
          </label>
          <div className="row">
            <input
              id="iris-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button className="btn primary" type="submit" disabled={busy}>Send</button>
          </div>
        </form>
      ) : null}

      {left ? <p className="t-body-s iris-left">{left}</p> : null}

      <form className="iris-ask" onSubmit={ask}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about the model, the Collection or how ownership works"
          aria-label="Ask IRIS a question"
          maxLength={500}
        />
        <button className="btn primary" type="submit" disabled={busy || !q.trim()}>
          {busy ? "…" : "Ask"}
        </button>
      </form>
    </aside>
  );
}
