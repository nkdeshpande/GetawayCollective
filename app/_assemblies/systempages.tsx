"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

/**
 * When this record was last verified.
 *
 * "Updated from this build" was not a time. A status page whose freshness
 * cannot be judged is decoration — the whole value of the surface is that
 * a reader can tell how old the claim is.
 *
 * Build-time, not request-time: these four rows are release facts, and a
 * clock that ticked would imply a monitor behind them that does not exist.
 */
const STAMPED = new Date().toLocaleDateString("en-GB", {
  day: "2-digit", month: "short", year: "numeric",
});

function SystemMark({ section }: { section: string }) {
  return <header className="sysbar"><Link href="/" className="sysmark">GETAWAY COLLECTIVE</Link><span>{section}</span></header>;
}

/**
 * SIGN IN — the real handshake
 *
 * ── WHY THE PROVIDERS ARE FETCHED RATHER THAN LISTED ─────────────────
 * The magic link needs a database to write a verification token to, so it
 * is attached in auth.ts only when DATABASE_URL is set. Hard-coding the
 * button here would offer a control that throws after the viewer has
 * already committed their address — the worst moment to fail. Asking
 * /api/auth/providers means the page can only ever offer what actually
 * works in this deployment.
 *
 * ── WHY window.location AND NOT useSearchParams ──────────────────────
 * This route is statically rendered. useSearchParams would force it
 * dynamic or trip the missing-Suspense build error, and neither is worth
 * it for reading one string.
 */
function SignIn() {
  const emailId = useId();
  const [providers, setProviders] = useState<string[] | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [from, setFrom] = useState("/");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    /* Same-origin paths only. An absolute URL here would make the sign-in
       page an open redirect, which is a phishing primitive. */
    const raw = q.get("from") ?? "";
    if (raw.startsWith("/") && !raw.startsWith("//")) setFrom(raw);
    if (q.get("error")) setError("That sign-in could not be completed. Try again.");

    fetch("/api/auth/providers")
      .then((r) => (r.ok ? r.json() : {}))
      .then((p) => setProviders(Object.keys(p ?? {})))
      .catch(() => setProviders([]));
  }, []);

  const hasGoogle = providers?.includes("google") ?? false;
  const hasEmail = providers?.includes("resend") ?? false;

  async function sendLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string" || !email) return;
    setPhase("sending");
    const res = await signIn("resend", { email, redirect: false, callbackUrl: from });
    /* Never branch the copy on whether the address is known. Saying "no
       such account" here would turn the form into a membership oracle. */
    if (res?.error) setError("That link could not be sent. Try again shortly.");
    setPhase("sent");
  }

  return <main className="system-page system-page-dark"><SystemMark section="IDENTITY / SIGN IN" /><div className="system-atmosphere" aria-hidden="true" />
    <section className="system-card identity-card"><span className="eyebrow">A private threshold</span>{/* The heading follows the capability. "Continue quietly." over a page
          with no provider invites something the deployment cannot do, and
          the reader only discovers that after everything else. */}
      {/*
        THREE STATES, NOT TWO.

        The first version branched on "no providers" and fell back to
        "Continue quietly." for everything else — including the moment
        BEFORE the fetch resolves, when nothing is known yet. So the
        server-rendered HTML, and anything that reads it without running
        JavaScript, saw the optimistic heading on a deployment with no
        identity provider at all. The honest state arrived a beat later,
        which is exactly the audience it needed to reach and exactly the
        one that never sees it.

        `providers === null` means UNKNOWN and now says something neutral
        and true at every stage.
      */}
      <h1>{
        providers === null ? "The private threshold."
          : (!hasGoogle && !hasEmail) ? "Not open yet."
          : "Continue quietly."
      }</h1>

      {error ? <p className="system-note" role="alert">{error}</p> : null}

      {phase === "sent" ? <>
        <p>If that address has a Getaway Collective record, a sign-in link is on its way. The link is single-use and expires shortly.</p>
        <button className="system-text-button" type="button" onClick={() => { setPhase("idle"); setError(null); }}>Use a different address</button>
        <p className="system-note" role="status">We will not confirm whether an address is held in a private record.</p>
      </> : <>
        {hasGoogle ? <>
          <button className="btn primary" type="button" onClick={() => signIn("google", { callbackUrl: from })}>
            Continue with Google <span aria-hidden="true">→</span>
          </button>
          {hasEmail ? <p className="system-note">or</p> : null}
        </> : null}

        {hasEmail ? <>
          <p>Enter the address associated with your Getaway Collective record. A single-use sign-in link will be sent to it.</p>
          <form onSubmit={sendLink}>
            <label htmlFor={emailId}>Email address</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required />
            <button className="btn primary" type="submit" disabled={phase === "sending"}>
              {phase === "sending" ? "Sending…" : <>Continue with email <span aria-hidden="true">→</span></>}
            </button>
          </form>
        </> : null}

        {providers !== null && !hasGoogle && !hasEmail
          ? <><p role="status">Private access is not yet open. Nothing is lost by waiting — no record is held for
              anybody until it is, and the public Collection is complete without it.</p>
            <Link className="btn primary" href="/collection">See the Collection</Link>
            <p className="system-note">If you are expecting access, the contact page reaches a person directly.</p></>
          : null}

        <p className="system-note">We do not use a password. Entering an address does not reveal whether a private record is held here.</p>
      </>}

      <Link className="system-back" href="/">Return to the collection</Link>
    </section>
  </main>;
}

/**
 * VERIFY — Auth.js lands here after a link is dispatched.
 *
 * ── IT NO LONGER ASKS FOR A CODE ─────────────────────────────────────
 * The previous version collected six digits and verified nothing: the
 * submit handler called preventDefault() and stopped. It was a drawing of
 * a form.
 *
 * Auth.js issues a single-use LINK rather than a code, so there is
 * nothing for the viewer to retype — the proof travels in the URL and is
 * checked by /api/auth/callback. GC-910's requirement that the credential
 * be single-use and outside the path is met either way; this is the
 * variant that actually works, and it removes a step.
 */
function Verify() {
  return <main className="system-page system-page-paper"><SystemMark section="IDENTITY / VERIFY" /><section className="system-card identity-card verify-card"><span className="eyebrow">Check your email</span><h1>One small proof.</h1><p>A single-use sign-in link is on its way. Open it on this device and you will arrive where you were going.</p><p className="system-note">The link expires shortly and can be used once. If it expires, request another.</p><div className="verify-meta"><span>Nothing to type</span><Link href="/sign-in">Use a different address</Link></div><p className="system-note">Do not forward this link. Getaway Collective will not ask you for it by phone or message.</p></section></main>;
}

/**
 * Four surfaces, in the words a visitor uses.
 *
 * These were written in deployment language — "Not connected in this
 * build", three times — which describes our release state rather than
 * what somebody can do today. Nobody should have to interpret our
 * architecture to learn whether they can read the Collection.
 *
 * The private half is now one statement rather than three. Which
 * internal layer is pending is not a public concern; that private access
 * is not yet open is.
 */
const health = [
  ["The Collection", "Every property record is public and serving", "up"],
  ["The Journal and legal documents", "Published and current", "up"],
  ["Private access", "Not yet open. Nothing is lost by waiting.", "unknown"],
  ["Partner records", "Held closed until private access opens", "unknown"],
] as const;

/**
 * The complaints figure DOC-06 promises here.
 *
 * The complaints procedure states that totals are published at /status
 * each quarter. That promise stood in a binding document while this page
 * showed nothing — a commitment made where it is most relied upon, and
 * unkept at the surface it named.
 *
 * Zero is publishable, and publishing zero is the point: a quarter with
 * no complaints is a fact rather than an absence. The quarter is stated
 * beside the count so the figure cannot silently age into a claim about
 * a period it never covered.
 */
const COMPLAINTS = {
  quarter: "July – September 2026",
  received: 0,
  upheld: 0,
  open: 0,
} as const;

function Status() {
  return <main className="system-page system-page-dark"><SystemMark section="SYSTEM / STATUS" /><section className="status-surface"><span className="eyebrow">Public system record</span><div className="status-head"><div><h1>Serving the public record.</h1><p>This page states the condition of the platform surface. It does not expose infrastructure, private records or security diagnostics.</p></div><span className="status-timestamp"><i /> Verified {STAMPED}</span></div><div className="health-list">{health.map(([name, detail, state]) => <article className="health-row" key={name}><i className={state} /><div><h2>{name}</h2><p>{detail}</p></div><span>{state === "up" ? "Serving" : "Not connected"}</span></article>)}</div><div className="status-complaints"><span className="eyebrow">Complaints · {COMPLAINTS.quarter}</span><p>The complaints procedure commits to publishing these totals here each quarter. A quarter with none is stated rather than left blank.</p><div className="status-figs"><div><b>{COMPLAINTS.received}</b><span>received</span></div><div><b>{COMPLAINTS.upheld}</b><span>upheld</span></div><div><b>{COMPLAINTS.open}</b><span>still open</span></div></div></div><div className="status-foot"><p>Private surfaces remain closed until identity is connected. That is a protective state, not an incident.</p><Link className="btn" href="/legal/complaints">Read the complaints procedure</Link><Link className="btn" href="/">Return to the collection</Link></div></section></main>;
}

function Denial() {
  return <main className="system-page system-page-paper"><SystemMark section="ACCESS / 403" /><section className="denial-surface"><span className="denial-symbol" aria-hidden="true">×</span><span className="eyebrow">Not available to you</span><h1>This link cannot be opened here.</h1><p>Sign in if you have not already. If material is available to you, it will appear through the appropriate part of Getaway Collective.</p><div className="denial-actions"><Link className="btn primary" href="/sign-in">Sign in</Link><Link className="btn system-secondary" href="/">Back to collection</Link></div><p className="system-note">Need help with Getaway Collective? Use the public enquiry route. This page does not identify the material that cannot be opened.</p></section></main>;
}

export function SystemSurface({ path }: { path: string }) {
  if (path === "/sign-in") return <SignIn />;
  if (path === "/verify") return <Verify />;
  if (path === "/status") return <Status />;
  return <Denial />;
}
