/**
 * AS-ATLAS · THE FINDINGS PANEL
 *
 * Authority: constants/ai-contracts.ts AI-001 · AI-003 · AI-006 · FIX-10
 *
 * ── IT RENDERS THE OBJECT, NOT A SENTENCE ────────────────────────────
 * FIX-10 names the failure this exists to prevent: "a recommendation that
 * arrives as a sentence in a panel, gets acted on, and leaves no record
 * that an agent produced it." A panel is exactly where that happens, so
 * the shape of this one is the countermeasure.
 *
 * Every finding shows, and cannot be rendered without: which contract
 * permitted it, the agent that produced it, the confidence class, the
 * named owner, what is being asked of them, the deadline, and the sources
 * behind every claim. There is no compact mode that drops them. A reader
 * who cannot see who owns a finding cannot act on it correctly, and one
 * who cannot see the sources cannot check it.
 *
 * ── WHAT IS DELIBERATELY ABSENT ──────────────────────────────────────
 * No approve button. Not disabled, not permission-gated — absent. ATLAS
 * escalates and proposes; the acts themselves live behind capabilities
 * with their own authorisation, their own events and their own reasons.
 * Putting an approve control on an agent's output is how the agent's
 * reading of the world quietly becomes the decision.
 *
 * "Prohibited" is printed on every finding for the same reason. The
 * contract's own words, in front of the person acting, so what the agent
 * may not do is visible at the moment somebody might assume otherwise.
 */

import type { GovernedOutput } from "@/lib/ai/output";
import { UNIMPLEMENTED } from "@/lib/ai/atlas";
import { contractById } from "@/constants/ai-contracts";

const DISPOSITION_LABEL: Record<GovernedOutput["disposition"], string> = {
  escalate: "Escalation",
  propose: "Proposal",
  explain: "Explanation",
  clear: "Clear",
};

function Finding({ o }: { o: GovernedOutput }) {
  const contract = contractById(o.contractId);

  return (
    <article className="atlas-finding" data-disposition={o.disposition}>
      <div className="kv" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <span className="t-mono-s dim">
          {o.agent} · {o.contractId} · {DISPOSITION_LABEL[o.disposition]}
        </span>
        {/* The confidence class travels with the finding. A reading of
            state is a derivation, and F-13 holds it never outranks what it
            was derived from. */}
        <span className="t-mono-s dim">{o.confidence}</span>
      </div>

      <h3 className="t-body-l" style={{ marginTop: "var(--gc-sp-2xs)", fontWeight: 600 }}>
        {o.headline}
      </h3>

      <p className="t-micro label" style={{ marginTop: "var(--gc-sp-2xs)" }}>
        {o.outputObject} · owned by {o.owner.replace(/_/g, " ")}
      </p>

      {o.askedOfOwner ? (
        <div className="atlas-ask">
          <span className="t-micro label">Asked of the owner{o.dueBy ? ` · by ${o.dueBy}` : ""}</span>
          <p className="t-body" style={{ marginTop: "var(--gc-sp-3xs)" }}>{o.askedOfOwner}</p>
        </div>
      ) : null}

      {o.assertions.length > 0 ? (
        <ul className="atlas-claims">
          {o.assertions.map((a, i) => (
            <li key={i}>
              <p className="t-body">{a.claim}</p>
              {/* Sources are shown, never folded away. A claim whose
                  evidence needs a click is a claim most people take on
                  trust. */}
              <p className="t-mono-s dim" style={{ marginTop: "var(--gc-sp-3xs)" }}>
                {a.sources.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="t-mono-s dim atlas-prohibited">
        {o.agent} may not: {o.prohibited}
        {contract ? ` · human gate: ${contract.humanGate}` : ""}
      </p>
    </article>
  );
}

export function AtlasPanel({
  findings,
  subject,
}: {
  findings: readonly GovernedOutput[];
  subject: string;
}) {
  return (
    <section data-sec="AS-ATLAS.a" className="atlas">
      <div className="wrap">
        <span className="sec-ref">ATLAS · Institutional Intelligence</span>
        <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-2xs)" }}>
          Findings for {subject}
        </h2>
        <p className="t-body dim measure" style={{ marginTop: "var(--gc-sp-2xs)" }}>
          Computed from the event log when this page rendered. Every figure is derived rather than
          typed, and nothing here has been decided.
        </p>

        <div className="stack" style={{ marginTop: "var(--gc-sp-m)" }}>
          {findings.length === 0 ? (
            <p className="t-body dim">ATLAS produced nothing for this vehicle.</p>
          ) : (
            findings.map((o) => <Finding key={o.id} o={o} />)
          )}
        </div>

        {/*
          The contracts with no runtime, named on the surface rather than
          in a comment. A findings panel that shows three of six contracts
          reads as complete coverage, and the three it cannot run are
          exactly the ones nobody will remember are missing.
        */}
        {UNIMPLEMENTED.length > 0 ? (
          <div className="panel on-panel" style={{ marginTop: "var(--gc-sp-l)" }}>
            <span className="t-micro label">
              {UNIMPLEMENTED.length} contract(s) ATLAS cannot run yet
            </span>
            {UNIMPLEMENTED.map((u) => (
              <div key={u.contractId} style={{ marginTop: "var(--gc-sp-2xs)" }}>
                <span className="t-mono-s dim">{u.contractId}</span>
                <p className="t-body-s dim measure">{u.waitingOn}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
