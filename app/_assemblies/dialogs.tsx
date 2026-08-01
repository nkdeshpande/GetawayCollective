/**
 * AS-36 · DIALOGS — P-03 through P-09
 *
 * Wave 9 · Interruptions
 *
 * Seven interruptions, one discipline. Rules every dialog here obeys:
 *
 *   1. Escape and the backdrop close it. The close control says Close
 *      or Cancel — never Agree. A dialog whose only exit is consent
 *      collects consent from people trying to get rid of it.
 *   2. Paper ground. An interruption is an assertion, not narrative.
 *   3. The destructive or irreversible control is never the default,
 *      never autofocused, and where the action is grave the control is
 *      earned — a typed name (P-09), a resolution reference (P-08), a
 *      held piston (P-06) — not clicked past.
 *   4. Nothing pretends. Where no backend exists, the dialog says what
 *      this build does with the input, in the dialog.
 *
 * P-05 (session expiry) has no live mount — there is no session. It is
 * exported, and the Specimens component renders any dialog by query
 * flag (?specimen=vote e.g.) so each is reviewable on any page without
 * polluting a real flow.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { LLP, GOVERNANCE } from "./slowspace";
import { MEDIA_KINDS } from "@/content/admin";

/* ── The shared shell ────────────────────────────────────────────── */

function Shell({
  title, kicker, onClose, children, foot, wide,
}: {
  title: string;
  kicker: string;
  onClose: () => void;
  children: React.ReactNode;
  foot?: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="modal-back" role="presentation"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={ref}
        className="modal on-paper"
        role="dialog" aria-modal="true" aria-label={title}
        tabIndex={-1}
        style={wide ? { width: "min(860px,100%)" } : undefined}
        onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      >
        <div className="modal-head">
          <div>
            <span className="t-mono-s dim">{kicker}</span>
            <h2 className="t-display-s">{title}</h2>
          </div>
          <button className="btn" type="button" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">{children}</div>
        {foot ? <div className="modal-foot">{foot}</div> : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   P-03 · COOKIE CONSENT — a banner, not a modal

   A modal would hold the whole site hostage to a preferences question.
   The banner asserts, does not block, and DECLINE IS THE DEFAULT
   ACTION — the primary button declines non-essential. Honesty note:
   no non-essential storage exists in this build, and the banner says
   so rather than implying a tracking apparatus it does not have.
   ═══════════════════════════════════════════════════════════════════ */

const CONSENT_KEY = "gc-consent-v1";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(CONSENT_KEY)) setOpen(true); } catch { /* storage denied — remain closed */ }
  }, []);

  const decide = (v: "essential" | "all") => {
    try { localStorage.setItem(CONSENT_KEY, v); } catch { /* nothing to persist into */ }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <aside className="consent on-paper" role="region" aria-label="Cookies and storage">
      <div className="in">
        <div>
          <span className="t-micro label">Cookies and storage</span>
          <p className="t-body-s" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "68ch" }}>
            Essential storage only: your consent choice and, on the commitment path, form drafts
            saved on this device. No analytics or marketing storage exists in this build — this
            banner records your choice for when any is proposed, and nothing loads without it.
            {" "}<a href="/legal/cookies">The cookie policy</a> states the full position.
          </p>
        </div>
        <div className="acts">
          {/* Declining is the primary action. Deliberately. */}
          <button className="btn primary" type="button" onClick={() => decide("essential")}>
            Decline non-essential
          </button>
          <button className="btn" type="button" onClick={() => decide("all")}>
            Accept all
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   P-04 · UNSAVED-CHANGES GUARD

   The accreditation form autosaves on blur, so the only value at risk
   is the FIELD BEING TYPED. The guard covers reload and tab-close via
   beforeunload; in-app navigation keeps drafts because the drafts are
   already saved. The boundary is stated here so nobody assumes wider
   protection than exists.
   ═══════════════════════════════════════════════════════════════════ */

export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
}

/* ═══════════════════════════════════════════════════════════════════
   P-05 · SESSION EXPIRY

   Warns before expiry with an extend control. No session exists, so
   the only mount is the specimen — the component is ready for the
   identity integration, not waiting on it to be designed.
   ═══════════════════════════════════════════════════════════════════ */

export function SessionExpiryDialog({
  minutesLeft = 5, onExtend, onClose,
}: { minutesLeft?: number; onExtend: () => void; onClose: () => void }) {
  return (
    <Shell title="Your session is about to end" kicker={`P-05 · in ${minutesLeft} minutes`} onClose={onClose}
      foot={<>
        <span className="t-body-s dim">
          Nothing is lost at expiry: drafts are saved, positions are records, not sessions.
        </span>
        <span style={{ display: "flex", gap: "var(--gc-sp-s)" }}>
          <button className="btn" type="button" onClick={onClose}>Sign out now</button>
          <button className="btn primary" type="button" onClick={onExtend}>Remain signed in</button>
        </span>
      </>}>
      <p className="t-body measure">
        For your protection, sessions end after inactivity. Extend to continue, or sign out —
        your drafts are saved either way, and member surfaces simply require signing in again.
      </p>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   P-06 · VOTE CONFIRMATION — the piston, again

   A vote is irreversible under §24a, so it gets the same deliberation
   mechanic as the commitment: a three-second sustained press. The
   dialog states the weight being cast, the threshold it counts
   against, and that a tie is not approval. ADR-0008: the ballot is
   secret; the dialog says what will and will not be retained.
   ═══════════════════════════════════════════════════════════════════ */

export function VoteConfirmDialog({
  resolution, choice, weightPct, threshold, onCast, onClose,
}: {
  resolution: string;
  choice: "for" | "against" | "abstain";
  weightPct: string;
  threshold: string;
  onCast: () => void;
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);
  const [held, setHeld] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const start = (e: React.SyntheticEvent) => {
    if (done || timer) return;
    e.preventDefault();
    setHeld(true);
    setTimer(setTimeout(() => { setDone(true); setTimer(null); onCast(); }, 3000));
  };
  const stop = () => {
    if (done || !timer) return;
    clearTimeout(timer); setTimer(null); setHeld(false);
  };

  return (
    <Shell title={"Cast " + weightPct + " " + choice} kicker={`P-06 · ${resolution}`} onClose={onClose}
      foot={<span className="t-body-s dim">
        Your identity and choice are sealed at close and not retained in readable form. The tally
        publishes; who voted how never does.
      </span>}>
      <div className="kv"><span className="label t-micro">Resolution</span>
        <span className="v t-body-s">{resolution}</span></div>
      <div className="kv"><span className="label t-micro">Your weight</span>
        <span className="v">{weightPct} · by contribution</span></div>
      <div className="kv"><span className="label t-micro">Threshold</span>
        <span className="v t-body-s">{threshold}</span></div>

      <p className="t-body-s measure" style={{ margin: "var(--gc-sp-m) 0" }}>
        A cast vote is irreversible. A tie is not approval, so this weight can decide the outcome.
        Hold for three seconds; release to cancel.
      </p>

      <button
        className={"piston " + (held && !done ? "arm " : "") + (done ? "settled" : "")}
        onPointerDown={start} onPointerUp={stop} onPointerLeave={stop}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") start(e); }}
        onKeyUp={stop} onBlur={stop}
        aria-disabled={done}
      >
        <span className="fill" aria-hidden="true" />
        <span className="ticks" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="cap">{done ? "Cast" : held ? "Hold…" : `Hold to cast ${choice}`}</span>
      </button>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   P-07 · MEDIA UPLOAD — the claim is captured with the file

   Kind has NO DEFAULT: the kind is the claim (photograph / render /
   drawing), and a default is a claim somebody forgot to make.
   ═══════════════════════════════════════════════════════════════════ */

export function MediaUploadDialog({ onClose }: { onClose: () => void }) {
  const [kind, setKind] = useState("");
  const [licence, setLicence] = useState("");
  const [file, setFile] = useState("");
  const ok = kind && licence && file;

  return (
    <Shell title="Register an asset" kicker="P-07 · Media" onClose={onClose} wide
      foot={<>
        <span className="t-body-s dim">
          Storage is not connected. Registering records the claim; the byte upload joins with
          Vercel Blob, and nothing here pretends it happened.
        </span>
        <button className="btn primary" type="button" disabled={!ok} onClick={onClose}>
          Register the claim
        </button>
      </>}>
      <div className="fields">
        <div className="f full">
          <label htmlFor="up-file">The file</label>
          <input id="up-file" type="file" accept="image/*,.pdf,.svg"
                 onChange={(e) => setFile(e.target.value)} />
          <span className="help t-body-s">Dimensions are read from the file, never typed.</span>
        </div>
        <div className="f full">
          <label htmlFor="up-kind">What it is — no default, deliberately</label>
          <select id="up-kind" value={kind} onChange={(e) => setKind(e.target.value)}
                  className="a-input" style={{ padding: "10px 12px", background: "transparent",
                    border: "1px solid var(--gc-hairline)", color: "inherit" }}>
            <option value="" disabled>Choose the claim…</option>
            {MEDIA_KINDS.map((k) => <option key={k.k} value={k.k}>{k.k}</option>)}
          </select>
          <span className="help t-body-s">
            The kind is the claim the platform makes to whoever sees this asset. It is required
            because a render shown as a photograph is the industry&rsquo;s commonest misrepresentation.
          </span>
        </div>
        <div className="f full">
          <label htmlFor="up-lic">Licence and source</label>
          <input id="up-lic" type="text" value={licence} onChange={(e) => setLicence(e.target.value)}
                 placeholder="Who made it, and under what right it is used" />
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   P-08 · FORMATION CONFIRM — a resolution reference, not a click

   Forming an LLP creates a constitutional entity. The confirm is
   earned with the Board resolution reference that authorised it —
   which is the real gate, stated as an input rather than assumed.
   ═══════════════════════════════════════════════════════════════════ */

export function FormationConfirmDialog({
  vehicleName, onClose,
}: { vehicleName: string; onClose: () => void }) {
  const [ref, setRef] = useState("");
  const ok = /^R-\d{4}-\d{2,}$/i.test(ref.trim());

  return (
    <Shell title={"Form " + (vehicleName || "the vehicle")} kicker="P-08 · Formation" onClose={onClose}
      foot={<>
        <span className="t-body-s dim">
          Nothing writes in this build. When persistence exists, this control files the formation
          and the resolution reference is recorded against it permanently.
        </span>
        <button className="btn primary" type="button" disabled={!ok} onClick={onClose}>
          Submit formation
        </button>
      </>}>
      <p className="t-body measure">
        A vehicle is formed under Board authority, never under a login. Enter the resolution
        reference that authorised this formation — the reference is the gate, and it is checked
        against the register when one exists.
      </p>
      <div className="fields" style={{ marginTop: "var(--gc-sp-m)" }}>
        <div className="f full">
          <label htmlFor="fm-ref">Board resolution reference</label>
          <input id="fm-ref" className="ident" type="text" value={ref}
                 onChange={(e) => setRef(e.target.value)} placeholder="R-2026-04" />
          <span className="help t-body-s">
            Format R-YYYY-NN. {ok ? "Reference format accepted." : "The submit enables when a reference is entered."}
          </span>
        </div>
      </div>
      <div className="kv" style={{ marginTop: "var(--gc-sp-s)" }}>
        <span className="label t-micro">Default form</span>
        <span className="v t-body-s">LLP — §24a; any other form needs Board approval per property</span>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   P-09 · CONFIRM DESTRUCTIVE — type the name

   The one dialog where friction is the feature. The name of the thing
   must be typed exactly; the destructive control is never the default
   and never autofocused; and the record of WHY is captured with the
   act, because E-02 requires a reason for consequential capability.
   ═══════════════════════════════════════════════════════════════════ */

export function ConfirmDestructiveDialog({
  verb, objectName, consequence, onConfirm, onClose,
}: {
  verb: string;
  objectName: string;
  consequence: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [typed, setTyped] = useState("");
  const [reason, setReason] = useState("");
  const ok = typed === objectName && reason.trim().length >= 8;

  return (
    <Shell title={verb + " " + objectName} kicker="P-09 · Destructive" onClose={onClose}
      foot={<>
        <span className="t-body-s dim">{consequence}</span>
        <button
          className="btn"
          type="button"
          disabled={!ok}
          onClick={() => { onConfirm(); onClose(); }}
          style={ok ? { borderColor: "var(--gc-critical-deep)", color: "var(--gc-critical-deep)" } : undefined}
        >
          {verb}
        </button>
      </>}>
      <p className="t-body measure">
        This cannot be undone. Type the exact name to enable the control, and record why — the
        reason files with the act (E-02), not in a log nobody reads.
      </p>
      <div className="fields" style={{ marginTop: "var(--gc-sp-m)" }}>
        <div className="f full">
          <label htmlFor="dx-name">Type <strong>{objectName}</strong> to continue</label>
          <input id="dx-name" className="ident" type="text" value={typed} autoComplete="off"
                 onChange={(e) => setTyped(e.target.value)} />
        </div>
        <div className="f full">
          <label htmlFor="dx-why">Reason, for the record</label>
          <input id="dx-why" type="text" value={reason}
                 onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SPECIMENS — every dialog reviewable on any page

   Append ?specimen=<name> to any URL: consent-reset, session, vote,
   upload, formation, destructive. Reads the query once on mount; no
   route, no nav item, no footprint in a real flow. The consent banner
   itself needs no specimen — clear the stored choice and it returns.
   ═══════════════════════════════════════════════════════════════════ */

export function Specimens() {
  const [which, setWhich] = useState<string | null>(null);
  const [read, setRead] = useState(false);

  if (!read && typeof window !== "undefined") {
    setRead(true);
    const q = new URLSearchParams(window.location.search).get("specimen");
    if (q === "consent-reset") {
      try { localStorage.removeItem(CONSENT_KEY); } catch { /* nothing stored */ }
    } else if (q) setWhich(q);
  }

  const close = () => setWhich(null);
  const p10 = GOVERNANCE[0]; // basis of voting, for the threshold line

  switch (which) {
    case "session":
      return <SessionExpiryDialog onExtend={close} onClose={close} />;
    case "vote":
      return (
        <VoteConfirmDialog
          resolution={"R-2028-01 · " + LLP.name}
          choice="for" weightPct="10%"
          threshold={"Ordinary · more than 50% of contribution present — " + p10.v}
          onCast={() => undefined} onClose={close}
        />
      );
    case "upload":
      return <MediaUploadDialog onClose={close} />;
    case "formation":
      return <FormationConfirmDialog vehicleName="Ridgeline Collective LLP" onClose={close} />;
    case "destructive":
      return (
        <ConfirmDestructiveDialog
          verb="Withdraw" objectName="F-05"
          consequence="Withdrawing a plate removes it from every gallery that references it. The registration record survives."
          onConfirm={() => undefined} onClose={close}
        />
      );
    default:
      return null;
  }
}
