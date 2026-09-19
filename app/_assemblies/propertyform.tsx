"use client";

/**
 * The form half of the wired slice.
 *
 * Client-side only because it needs to submit and report. It holds no
 * authority logic — it can be rendered by anybody and it still cannot
 * register anything, because the decision is made in the route against
 * grants read on the server. Hiding the form is courtesy; the refusal is
 * the control.
 */

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

type Vehicle = { id: string; name: string };
type Result =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; eventId: string; durable: boolean; warning?: string }
  | { kind: "refused"; reason: string };

export function RegisterPropertyForm({ vehicles }: { vehicles: readonly Vehicle[] }) {
  const router = useRouter();
  const vid = useId();
  const pid = useId();
  const lid = useId();
  const [state, setState] = useState<Result>({ kind: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState({ kind: "sending" });

    const res = await fetch("/api/office/property", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        vehicleId: form.get("vehicleId"),
        propertyId: form.get("propertyId"),
        label: form.get("label"),
      }),
    }).catch(() => null);

    const body = await res?.json().catch(() => null);

    if (!res || !body?.ok) {
      /* The envelope's own refusal text names the law it rests on. It is
         shown as written rather than replaced with a status word. */
      setState({ kind: "refused", reason: body?.error ?? "That could not be completed." });
      return;
    }

    setState({
      kind: "done",
      eventId: body.events?.[0]?.eventId ?? "—",
      durable: Boolean(body.durable),
      warning: body.warning,
    });
    /* Re-read the server component so the event list below reflects the
       stored row rather than an optimistic copy of what we just sent. */
    router.refresh();
  }

  return (
    <section className="slice-card">
      <span className="eyebrow">Available to you</span>
      <h2>Register a property against a vehicle.</h2>
      <p>
        The command is vehicle-scoped, so a grant covering one vehicle cannot register a property
        in another. No reason is required for this one — the act is a record, not a decision.
      </p>

      <form onSubmit={submit} className="slice-form">
        <div>
          <label htmlFor={vid}>Vehicle</label>
          <select id={vid} name="vehicleId" required defaultValue={vehicles[0]?.id}>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={pid}>Property id</label>
          <input id={pid} name="propertyId" required placeholder="solace-north-block"
            pattern="[a-z0-9\-]{3,64}" title="Lowercase letters, digits and hyphens" />
        </div>
        <div>
          <label htmlFor={lid}>Label</label>
          <input id={lid} name="label" required placeholder="North block, Chikkaballapur" minLength={3} maxLength={120} />
        </div>
        <button className="btn primary" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Registering…" : "Register property"}
        </button>
      </form>

      {state.kind === "refused" ? (
        <p className="slice-refused" role="alert">{state.reason}</p>
      ) : null}

      {state.kind === "done" ? (
        <p className="slice-done" role="status">
          Registered. Event <code>{state.eventId}</code>{" "}
          {state.durable ? "stored." : "held in memory only."}
          {state.warning ? ` ${state.warning}` : ""}
        </p>
      ) : null}
    </section>
  );
}
