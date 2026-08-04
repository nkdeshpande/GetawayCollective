"use client";

/**
 * ATLAS FINDINGS — the client half
 *
 * The office workspace is a client component, so the findings are fetched
 * rather than awaited. This holds the request and its three honest
 * states; AtlasPanel holds the rendering and knows nothing about loading.
 *
 * ── THE THREE STATES ARE DIFFERENT AND SAY SO ────────────────────────
 * "Still computing", "computed and found nothing", and "could not
 * compute" mean entirely different things to somebody deciding whether a
 * vehicle needs attention. Collapsing them into one empty panel is how an
 * agent that has stopped running comes to look like an agent with nothing
 * to report — which is the failure allClear() exists to prevent, undone
 * at the last step.
 */

import { useEffect, useState } from "react";
import { AtlasPanel } from "./atlaspanel";
import type { GovernedOutput } from "@/lib/ai/output";

interface Desk {
  ok: boolean;
  eventCount?: number;
  note?: string;
  reserveFloorModelled?: boolean;
  findings?: GovernedOutput[];
}

export function AtlasFindings({ vehicle }: { vehicle: string }) {
  const [desk, setDesk] = useState<Desk | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setDesk(null);
    setFailed(null);
    fetch(`/api/atlas?vehicle=${encodeURIComponent(vehicle)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!live) return;
        if (!r.ok || !d.ok) {
          setFailed(
            r.status === 403
              ? "You do not hold an office grant, so ATLAS findings are not shown."
              : `ATLAS could not compute findings (${d.error ?? r.status}).`,
          );
          return;
        }
        setDesk(d);
      })
      .catch(() => live && setFailed("ATLAS could not be reached."));
    return () => { live = false; };
  }, [vehicle]);

  if (failed) {
    return (
      <section data-sec="AS-ATLAS.a" className="atlas">
        <div className="wrap">
          <span className="sec-ref">ATLAS · Institutional Intelligence</span>
          {/* Named as a failure to compute, never as an absence of
              findings. The two look the same and are opposites. */}
          <p className="t-body dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{failed}</p>
        </div>
      </section>
    );
  }

  if (!desk) {
    return (
      <section data-sec="AS-ATLAS.a" className="atlas" aria-busy="true">
        <div className="wrap">
          <span className="sec-ref">ATLAS · Institutional Intelligence</span>
          <p className="t-body dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            Folding the event log…
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <AtlasPanel findings={desk.findings ?? []} subject={vehicle} />
      {/* What the findings rest on, stated beneath them. A reserve
          position assessed against a floor nobody has modelled is a
          weaker finding than it looks, and the reader should know that
          without reading the source. */}
      {desk.note || desk.reserveFloorModelled === false ? (
        <section data-sec="AS-ATLAS.b">
          <div className="wrap">
            <p className="t-body-s dim measure">
              {desk.note ? `${desk.note} ` : ""}
              {desk.reserveFloorModelled === false
                ? "The reserve floor (L1-16 §2.3) is not modelled yet, so it is treated as zero — " +
                  "the reserve position is reported as a fact and no breach is raised against a " +
                  "threshold that does not exist."
                : ""}
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
