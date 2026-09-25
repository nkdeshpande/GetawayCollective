"use client";

/**
 * THE INVESTOR RECORD — the forms
 *
 * 25 Sep 2026. Client-side only because a form has to submit and report.
 * Nothing here decides anything: every act goes to /api/office/records,
 * where the constitutional envelope checks the right, the reason and the
 * conflict, and where the rules in lib/office-rules.ts are applied again.
 * Hiding a form from someone without the right is courtesy; the refusal on
 * the server is the control.
 *
 * On success the form clears itself. A PAN or an account number typed
 * into it should not remain on the screen after it has been stored.
 */

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; note: string } | { kind: "refused"; reason: string };

/** Named fields to JSON. `stage.identity` becomes `{ stages: { identity } }`. */
function bodyOf(form: HTMLFormElement): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const stages: Record<string, string> = {};
  for (const [k, v] of new FormData(form).entries()) {
    if (typeof v !== "string") continue;
    if (k.startsWith("stage.")) stages[k.slice(6)] = v;
    else out[k] = v;
  }
  if (Object.keys(stages).length) out.stages = stages;
  return out;
}

export function ActForm({ act, investorId, submit, done, children, className = "" }: {
  act: "organization" | "estate" | "investor" | "kyc" | "bank" | "position";
  investorId?: string; submit: string; done: string; children: React.ReactNode; className?: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState({ kind: "sending" });
    const res = await fetch("/api/office/records", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ act, investorId, ...bodyOf(form) }),
    }).catch(() => null);
    const body = await res?.json().catch(() => null);
    if (!res || !body?.ok) {
      /* The server's refusal names the rule it rests on; shown as written. */
      setState({ kind: "refused", reason: body?.error ?? "That could not be completed. Nothing was changed." });
      return;
    }
    form.reset();
    setState({ kind: "done", note: done });
    /* Re-read the server page, so what is shown is the stored row. */
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className={`or-form ${className}`}>
      {children}
      <div className="or-actions">
        <button className="or-submit" type="submit" disabled={state.kind === "sending"}>{state.kind === "sending" ? "Recording…" : submit}</button>
        {state.kind === "refused" ? <p className="or-refused" role="alert">{state.reason}</p> : null}
        {state.kind === "done" ? <p className="or-done" role="status">{state.note}</p> : null}
      </div>
    </form>
  );
}

/** One labelled input. Everything a field needs, and nothing it does not. */
export function Field({ label, name, hint, wide, ...input }: {
  label: string; name: string; hint?: string; wide?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={`or-field${wide ? " wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} {...input} />
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export function Choice({ label, name, options, hint, wide, ...select }: {
  label: string; name: string; options: readonly (readonly [string, string])[]; hint?: string; wide?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={`or-field${wide ? " wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} {...select}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export function Reason({ hint = "Recorded with the act and kept with it (E-02)." }: { hint?: string }) {
  const id = useId();
  return (
    <div className="or-field wide">
      <label htmlFor={id}>Reason</label>
      <textarea id={id} name="reason" required minLength={8} maxLength={600} rows={2} />
      <small>{hint}</small>
    </div>
  );
}
