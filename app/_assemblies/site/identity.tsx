/**
 * SIGN IN AND VERIFY, IN THE SITE'S OWN FRAME — 24 Sep 2026
 *
 * The same handshake app/_assemblies/systempages.tsx has always run, carried
 * over rule for rule, and dressed as the site:
 *
 *   - providers are asked for, never assumed (/api/auth/providers), so the
 *     page offers only what this deployment can actually do;
 *   - three states, not two: unknown, not open, open;
 *   - `from` is honoured only as a same-origin path, never an absolute URL
 *     (an open redirect is a phishing primitive);
 *   - the copy never branches on whether an address is known, so the form
 *     is not a membership oracle.
 */

"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function SiteSignIn() {
  const emailId = useId();
  const [providers, setProviders] = useState<string[] | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  /* Where the link returns: the page that sent the reader here, or /start,
     which sends each person to their own place (lib/landing.ts). */
  const [from, setFrom] = useState("/start");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
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
    if (res?.error) setError("That link could not be sent. Try again shortly.");
    setPhase("sent");
  }

  return (
    <div className="pg idn">
      <section className="idn-film" aria-hidden="true">
        <canvas className="film" data-pal="solace" data-hour="21.5" />
        <div className="idn-cap"><span className="eb">Solace, after dark</span><p>For anyone considering the collection, and for its partners.</p></div>
      </section>
      <section className="idn-panel">
        <span className="eb">Sign in</span>
        <h1 className="tx-h1">{
          providers === null ? <>Sign in, <span>or begin.</span></>
            : !hasGoogle && !hasEmail ? <>Not open <span>yet.</span></>
            : <>Sign in, <span>or begin.</span></>
        }</h1>

        {error ? <p className="tx-err" role="alert">{error}</p> : null}

        {phase === "sent" ? <>
          <p className="tx-p">A sign-in link is on its way to that address. It works once and expires shortly. If this is your first time, the same link creates your sign-in: there is nothing else to fill in.</p>
          <button className="btn gray" type="button" onClick={() => { setPhase("idle"); setError(null); }}>Use a different address</button>
        </> : <>
          {hasGoogle ? <button className="btn idn-google" type="button" onClick={() => signIn("google", { callbackUrl: from })}>Continue with Google</button> : null}
          {hasGoogle && hasEmail ? <p className="idn-or"><span>or</span></p> : null}
          {hasEmail ? (
            <form className="tx-form" onSubmit={sendLink}>
              <label className="fld" htmlFor={emailId}><span>Email address</span>
                <input id={emailId} name="email" type="email" autoComplete="email" required />
              </label>
              <div><button className="btn lead" type="submit" disabled={phase === "sending"}>{phase === "sending" ? "Sending…" : "Email me a sign-in link"}</button></div>
            </form>
          ) : null}
          {providers !== null && !hasGoogle && !hasEmail ? <>
            <p className="tx-p">Private access is not open yet. Nothing is lost by waiting, and the public collection is complete without it.</p>
            <div className="tx-links"><Link className="btn lead" href="/collection">See the collection</Link><Link className="btn gray" href="/contact">Talk to Investor Relations</Link></div>
          </> : null}
          <p className="idn-note">No password and no documents. New or returning, the same link does both. Identity checks come later, alongside the offering, and never before you can look.</p>
        </>}

        <div className="idn-foot"><Link href="/collection">The collection</Link><Link href="/contact">Enquire</Link><Link href="/legal/privacy">Privacy</Link></div>
      </section>
    </div>
  );
}

export function SiteVerify() {
  return (
    <div className="pg idn">
      <section className="idn-film" aria-hidden="true">
        <canvas className="film" data-pal="coast" data-hour="6.4" />
        <div className="idn-cap"><span className="eb">Seaside Confluence, first light</span><p>For anyone considering the collection, and for its partners.</p></div>
      </section>
      <section className="idn-panel">
        <span className="eb">Check your email</span>
        <h1 className="tx-h1">One small <span>proof.</span></h1>
        <p className="tx-p">A single-use sign-in link is on its way. Open it on this device and you will arrive where you were going.</p>
        <p className="idn-note">The link expires shortly and works once. Getaway Collective will never ask you for it by phone or message.</p>
        <div className="tx-links"><Link className="btn gray" href="/sign-in">Use a different address</Link></div>
      </section>
    </div>
  );
}
