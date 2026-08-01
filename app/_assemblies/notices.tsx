/**
 * AS-35 · NOTICES — the notification surfaces
 *
 * Wave 9 · Communications
 *
 * Renders the catalogue in content/notifications.ts. Two surfaces:
 *
 *   NotificationsFeed   /member/notifications — every notice the
 *                       platform can send, rendered as SPECIMENS from
 *                       the worked context, grouped by lifecycle order.
 *   NoticeCard          one notice. The same component the (future)
 *                       email renderer mirrors, so product and mail
 *                       cannot drift.
 *
 * ── WHY SPECIMENS RATHER THAN AN EMPTY FEED ──────────────────────────
 * The composed page said, honestly, "no notifications". True, and it
 * taught nothing. The feed now renders the full catalogue with every
 * card marked SPECIMEN and the one live notice marked LIVE — the
 * design is reviewable today, the wiring state is never misstated, and
 * the day events exist the specimens are replaced by the same cards
 * carrying real contexts.
 *
 * ── URGENCY RENDERS AS A BAND, NEVER COLOUR ALONE ────────────────────
 * The left band carries the urgency token; the label repeats it in
 * text. critical uses the system's rarest colour and appears exactly
 * twice in the catalogue, which a load-time check enforces.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  NOTICES, SPECIMEN_CONTEXT, type NoticeSpec, type Urgency,
} from "@/content/notifications";
import { ConfidenceTag, Footer } from "./atoms";

const URGENCY_LABEL: Record<Urgency, string> = {
  low: "Low", normal: "Normal", high: "High", critical: "Critical",
};

export function NoticeCard({ spec }: { spec: NoticeSpec }) {
  const n = spec.render(SPECIMEN_CONTEXT);
  return (
    <article className={`notice u-${spec.urgency}`} aria-label={`${spec.id} · ${spec.event}`}>
      <header className="n-head">
        <span className="t-mono-s dim">{spec.id} · {spec.event}</span>
        <span className="n-tags">
          <span className={`conf n-u-${spec.urgency}`}>{URGENCY_LABEL[spec.urgency]}</span>
          {spec.channels.map((c) => (
            <span key={c} className="conf">{c === "email" ? "Email" : "In-product"}</span>
          ))}
          {/* The wiring state, on every card, unmissable. */}
          <span className={"conf " + (spec.wired ? "n-live" : "n-spec")}>
            {spec.wired ? "Live" : "Specimen"}
          </span>
        </span>
      </header>
      <h3 className="t-subheading">{n.title}</h3>
      {n.body.map((p, i) => (
        <p key={i} className="t-body-s" style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "62ch" }}>{p}</p>
      ))}
      {n.facts?.length ? (
        <div className="n-facts">
          {n.facts.map((f) => (
            <div key={f.k}>
              <span className="k t-micro label">{f.k}</span>
              <span className={"v t-mono-s" + (f.money ? " money" : "")}>{f.v}</span>
            </div>
          ))}
        </div>
      ) : null}
      <footer className="n-foot">
        {n.conf ? <ConfidenceTag c={n.conf} /> : <span />}
        <span className="n-links">
          {(n.links ?? []).map((l) => (
            <Link key={l.to} className="btn" href={l.to}>{l.t}</Link>
          ))}
        </span>
      </footer>
    </article>
  );
}

const FILTERS = ["all", "critical", "high", "normal", "low"] as const;

export function NotificationsFeed() {
  const [f, setF] = useState<(typeof FILTERS)[number]>("all");
  const shown = NOTICES.filter((n) => f === "all" || n.urgency === f);

  return (
    <>
      <section data-sec="AS-35" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">AS-35 · Notices</span>
            <span className="t-micro label">
              {NOTICES.length} in the catalogue · {NOTICES.filter((n) => n.wired).length} live
            </span>
          </div>
          <h1 className="t-display-l">Notifications</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Every notice this platform can send, rendered from one catalogue. Cards marked{" "}
            <em>Specimen</em> show the designed wording against the worked position — no event
            source generates them yet, and no card pretends otherwise.
          </p>

          <div className="lens" role="tablist" aria-label="Filter by urgency"
               style={{ marginTop: "var(--gc-sp-l)" }}>
            {FILTERS.map((x) => (
              <button key={x} role="tab" aria-selected={f === x} onClick={() => setF(x)}>
                {x === "all" ? "All" : URGENCY_LABEL[x]}
              </button>
            ))}
          </div>

          <div className="stack" style={{ marginTop: "var(--gc-sp-m)" }}>
            {shown.map((spec) => <NoticeCard key={spec.id} spec={spec} />)}
          </div>

          <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-l)" }}>
            Delivery preferences are at{" "}
            <Link href="/member/settings/notifications" style={{ color: "inherit" }}>
              notification settings
            </Link>{" "}
            — statutory notices cannot be switched off, and the settings page says which.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
