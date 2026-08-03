"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

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
    <section className="system-card identity-card"><span className="eyebrow">A private threshold</span><h1>Continue quietly.</h1>

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
          ? <p className="system-note" role="status">Sign-in is not configured in this deployment. No identity provider is connected.</p>
          : null}

        <p className="system-note">We do not use a password. Entering an address does not reveal whether a private record is held here.</p>
      </>}

      <Link className="system-back" href="/">Return to the collection</Link>
    </section><p className="system-corner">GC-900 · PUBLIC · SESSION REQUEST</p>
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
  return <main className="system-page system-page-paper"><SystemMark section="IDENTITY / VERIFY" /><section className="system-card identity-card verify-card"><span className="eyebrow">Check your email</span><h1>One small proof.</h1><p>A single-use sign-in link is on its way. Open it on this device and you will arrive where you were going.</p><p className="system-note">The link expires shortly and can be used once. If it expires, request another.</p><div className="verify-meta"><span>Nothing to type</span><Link href="/sign-in">Use a different address</Link></div><p className="system-note">Do not forward this link. Getaway Collective will not ask you for it by phone or message.</p></section><p className="system-corner ink">GC-910 · IDENTIFIED · SINGLE-USE LINK</p></main>;
}

const health = [
  ["Public collection", "Serving static material", "up"],
  ["Sign-in and verification", "Not connected in this build", "unknown"],
  ["Private records", "Guarded until identity connects", "unknown"],
  ["Notices and activity", "Not connected in this build", "unknown"],
] as const;

function Status() {
  return <main className="system-page system-page-dark"><SystemMark section="SYSTEM / STATUS" /><section className="status-surface"><span className="eyebrow">Public system record</span><div className="status-head"><div><h1>Serving the public record.</h1><p>This page states the condition of the platform surface. It does not expose infrastructure, private records or security diagnostics.</p></div><span className="status-timestamp"><i /> Updated from this build</span></div><div className="health-list">{health.map(([name, detail, state]) => <article className="health-row" key={name}><i className={state} /><div><h2>{name}</h2><p>{detail}</p></div><span>{state === "up" ? "Serving" : "Not connected"}</span></article>)}</div><div className="status-foot"><p>Private and Office surfaces fail closed while identity and policy layers are not connected. This is a protective state, not an incident.</p><Link className="btn" href="/">Return to the collection</Link></div></section><p className="system-corner">GC-920 · PUBLIC · AGGREGATE HEALTH</p></main>;
}

function Denial() {
  return <main className="system-page system-page-paper"><SystemMark section="ACCESS / 403" /><section className="denial-surface"><span className="denial-symbol" aria-hidden="true">×</span><span className="eyebrow">Not available to you</span><h1>This link cannot be opened here.</h1><p>Sign in if you have not already. If material is available to you, it will appear through the appropriate part of Getaway Collective.</p><div className="denial-actions"><Link className="btn primary" href="/sign-in">Sign in</Link><Link className="btn system-secondary" href="/">Back to collection</Link></div><p className="system-note">Need help with Getaway Collective? Use the public enquiry route. This page does not identify the material that cannot be opened.</p></section><p className="system-corner ink">GC-930 · PUBLIC · NEUTRAL DENIAL</p></main>;
}

export function SystemSurface({ path }: { path: string }) {
  if (path === "/sign-in") return <SignIn />;
  if (path === "/verify") return <Verify />;
  if (path === "/status") return <Status />;
  return <Denial />;
}
