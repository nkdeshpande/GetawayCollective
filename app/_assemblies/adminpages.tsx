/**
 * AS-34 · THE ADMIN SURFACE
 *
 * Wave 8 · Administration
 *
 * Three surfaces: forming a vehicle, the content register, the media
 * register. Copy lives in content/admin.ts.
 *
 * ── THE FORMATION STEPPER ────────────────────────────────────────────
 * The one piece of genuine interaction here. Eight stages, each stating
 * what it writes and what blocks it, and a gate that is unmet cannot be
 * passed.
 *
 * The gates are DISPLAYED rather than merely enforced. An operator who
 * is blocked needs to know who clears it — a disabled button that says
 * nothing sends them to ask in a chat channel, and the answer they get
 * there is not recorded anywhere.
 *
 * Nothing here writes. There is no persistence layer yet, and a screen
 * that appeared to form a vehicle and did not would be the worst thing
 * in this repository. Every stage says so.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FORMATION, CONTENT_CLASSES, CONTENT_RULES, MEDIA_KINDS, MEDIA_RULES, MEDIA_STATE,
  type Stage, type Gate,
} from "@/content/admin";
import { Footer } from "./atoms";

const gateText = (g: Gate): string => {
  switch (g.kind) {
    case "right": return `Requires the right "${g.right}"`;
    case "approval": return `Requires ${g.body} approval — ${g.instrument}`;
    case "arithmetic": return `Arithmetic: ${g.must}`;
    case "prior": return `Stage ${g.stage} must be passed first`;
  }
};

/* ── Forming a vehicle ────────────────────────────────────────────── */

function StageBlock({ s, active, done, onOpen }: {
  s: Stage; active: boolean; done: boolean; onOpen: () => void;
}) {
  return (
    <div className="step" data-state={done ? "done" : active ? "active" : "idle"}>
      <span className="t-mono-s label">{s.n}</span>
      <h3 className="t-heading">
        {s.title}
        {s.irreversible ? (
          <span className="t-mono-s" style={{ color: "var(--gc-hazard)", marginLeft: "var(--gc-sp-2xs)" }}>
            irreversible
          </span>
        ) : null}
      </h3>

      {active ? (
        <div className="step-body" style={{ display: "block" }}>
          {s.note ? (
            <p className="t-body-s dim measure" style={{ marginBottom: "var(--gc-sp-s)" }}>{s.note}</p>
          ) : null}

          <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
            <div className="panel on-panel" style={{ flex: "1 1 260px" }}>
              <span className="t-micro label">Writes</span>
              <ul className="t-body-s" style={{ marginTop: "var(--gc-sp-2xs)", paddingLeft: "1.1em" }}>
                {s.writes.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>

            {/* Gates are shown, not just enforced. A disabled control that
                says nothing sends the operator to ask somebody in a chat
                channel, and that answer is recorded nowhere. */}
            <div className="panel on-panel" style={{ flex: "1 1 300px",
                 borderLeft: "2px solid var(--gc-hazard)" }}>
              <span className="t-micro label">Blocked until</span>
              <ul className="t-body-s" style={{ marginTop: "var(--gc-sp-2xs)", paddingLeft: "1.1em" }}>
                {s.gates.map((g, i) => <li key={i}>{gateText(g)}</li>)}
              </ul>
            </div>
          </div>

          <button className="btn primary" onClick={onOpen} style={{ marginTop: "var(--gc-sp-m)" }}>
            {s.irreversible ? "Review before committing →" : "Continue →"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function VehicleFormation() {
  const [at, setAt] = useState(0);

  return (
    <>
      <section data-sec="AS-34.a">
        <div className="wrap">
          <span className="sec-ref">AS-34 · Formation</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            Form a vehicle
          </h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Eight stages. Two of them cannot be undone, and two need somebody else&rsquo;s approval
            before they can be passed at all.
          </p>

          {/* Said once, at the top, and repeated on the last stage. */}
          <div className="panel on-panel"
               style={{ marginTop: "var(--gc-sp-m)", maxWidth: "74ch",
                        borderLeft: "2px solid var(--gc-critical)" }}>
            <span className="t-micro" style={{ color: "var(--gc-critical)" }}>
              Nothing on this screen writes
            </span>
            <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              There is no persistence layer yet. This is the sequence, its gates and its
              arithmetic, so the shape can be reviewed before it can be executed. A screen that
              appeared to form a vehicle and did not would be the worst thing in this system.
            </p>
          </div>

          <div style={{ marginTop: "var(--gc-sp-xl)", maxWidth: "760px" }}>
            {FORMATION.map((s, i) => (
              <StageBlock key={s.n} s={s} active={i === at} done={i < at}
                          onOpen={() => setAt((n) => Math.min(n + 1, FORMATION.length))} />
            ))}
          </div>

          {at >= FORMATION.length ? (
            <div className="panel on-paper" style={{ marginTop: "var(--gc-sp-m)", maxWidth: "700px" }}>
              <span className="t-micro label">End of the sequence</span>
              <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                Every stage reviewed. Executing this requires the <code>vehicle.form</code> right,
                a recorded reason, and — for any legal form other than an LLP — a Board resolution
                naming the specific property.
              </p>
              <div className="row" style={{ marginTop: "var(--gc-sp-s)", gap: "var(--gc-sp-2xs)" }}>
                <button className="btn" onClick={() => setAt(0)}>Walk it again</button>
                <Link className="btn" href="/admin/vehicles">Existing vehicles</Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ── Content ──────────────────────────────────────────────────────── */

export function ContentAdmin() {
  return (
    <>
      <section data-sec="AS-34.b">
        <div className="wrap">
          <span className="sec-ref">AS-34 · Content</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>Content</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Every word the platform says, and which of them bind.
          </p>
        </div>
      </section>

      <section data-sec="AS-34.b" className="on-paper">
        <div className="wrap">
          <div className="sec-head"><span className="sec-ref">The register</span></div>
          <div className="scroll-x">
            <table>
              <thead>
                <tr><th>Class</th><th>Source</th><th>Binds</th><th>Versioned</th><th>Rule</th></tr>
              </thead>
              <tbody>
                {CONTENT_CLASSES.map((c) => (
                  <tr key={c.name}>
                    <td><span className="doc-nm">{c.name}</span></td>
                    <td className="t-mono-s">{c.source}</td>
                    <td className="t-mono-s">{c.binds ? "Yes" : "No"}</td>
                    <td className="t-mono-s">{c.versioned ? "Yes" : "No"}</td>
                    <td className="t-body-s">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section data-sec="AS-34.b">
        <div className="wrap">
          <span className="t-micro label">How content is governed</span>
          <div className="stack" style={{ marginTop: "var(--gc-sp-s)" }}>
            {CONTENT_RULES.map((r) => (
              <div key={r.k} className="panel on-panel">
                <span className="t-micro label">{r.k}</span>
                <p className="t-body" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "72ch" }}>
                  {r.v}
                </p>
              </div>
            ))}
          </div>

          <div className="panel on-panel"
               style={{ marginTop: "var(--gc-sp-l)", maxWidth: "74ch",
                        borderLeft: "2px solid var(--gc-hazard)" }}>
            <span className="t-micro label">Publishing</span>
            <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              Requires the <code>content.publish</code> right, which sits with the Governance
              Office rather than the Executive Office. The standing documents are the instruments
              a partner relies on, and the office that tables resolutions is the one accountable
              for what they say — a page that binds should not be publishable by whoever
              commissioned the photograph on it.
            </p>
          </div>

          {/* AS-34 declares that every admin screen states it does not
              write. This one did not, which made the registered
              correction false on a third of the surfaces it covered. */}
          <div className="panel on-panel"
               style={{ marginTop: "var(--gc-sp-m)", maxWidth: "74ch",
                        borderLeft: "2px solid var(--gc-critical)" }}>
            <span className="t-micro" style={{ color: "var(--gc-critical)" }}>
              Nothing on this screen writes
            </span>
            <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              Content is edited in the files named above and ships with the build. There is no
              editor here yet, and this register exists so the shape of one can be reviewed
              first — which classes bind, which are versioned, and what publishing has to record.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ── Media ────────────────────────────────────────────────────────── */

export function MediaAdmin() {
  return (
    <>
      <section data-sec="AS-34.c">
        <div className="wrap">
          <span className="sec-ref">AS-34 · Media</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>Media</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Every asset carries what it is. That is the whole of the discipline.
          </p>

          <div className="panel on-panel"
               style={{ marginTop: "var(--gc-sp-m)", maxWidth: "74ch",
                        borderLeft: "2px solid var(--gc-steel)" }}>
            <span className="t-micro label">{MEDIA_STATE.registered} assets registered</span>
            <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>{MEDIA_STATE.note}</p>
          </div>
        </div>
      </section>

      <section data-sec="AS-34.c" className="on-paper">
        <div className="wrap">
          <div className="sec-head"><span className="sec-ref">The three kinds</span></div>
          <div className="row" style={{ gap: "var(--gc-sp-s)" }}>
            {MEDIA_KINDS.map((k) => (
              <div key={k.k} className="panel on-paper" style={{ flex: "1 1 260px" }}>
                <span className="t-micro label">{k.k}</span>
                <p className="t-body-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>{k.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-sec="AS-34.c">
        <div className="wrap">
          <span className="t-micro label">Registration</span>
          <div className="stack" style={{ marginTop: "var(--gc-sp-s)" }}>
            {MEDIA_RULES.map((r) => (
              <div key={r.k} className="panel on-panel">
                <span className="t-micro label">{r.k}</span>
                <p className="t-body" style={{ marginTop: "var(--gc-sp-3xs)", maxWidth: "72ch" }}>
                  {r.v}
                </p>
              </div>
            ))}
          </div>

          {/* A real file input, and a required kind with no default. The
              kind is the claim, so it cannot be left to a default that
              somebody forgets to change. */}
          <div className="panel on-panel" style={{ marginTop: "var(--gc-sp-l)", maxWidth: "620px" }}>
            <span className="t-micro label">Register an asset</span>
            <div className="fields" style={{ marginTop: "var(--gc-sp-m)" }}>
              <div className="f full">
                <label htmlFor="m-file">The file</label>
                <input id="m-file" type="file" accept="image/*,.pdf,.svg" />
              </div>
              <div className="f full">
                <label htmlFor="m-kind">What it is</label>
                <select id="m-kind" defaultValue="" aria-describedby="m-kind-help">
                  <option value="" disabled>Choose — there is no default</option>
                  <option value="photograph">Photograph</option>
                  <option value="render">Render</option>
                  <option value="drawing">Drawing</option>
                </select>
                <span className="help t-body-s" id="m-kind-help">
                  No default and no unset. A render registered as a photograph is a
                  misrepresentation that needs no words.
                </span>
              </div>
              <div className="f full">
                <label htmlFor="m-date">Date made</label>
                <input id="m-date" type="date" aria-describedby="m-date-help" />
                <span className="help t-body-s" id="m-date-help">
                  When it was made, not when it was uploaded.
                </span>
              </div>
              <div className="f full">
                <label htmlFor="m-reason">Reason</label>
                <input id="m-reason" type="text" aria-describedby="m-reason-help" />
                <span className="help t-body-s" id="m-reason-help">
                  RegisterMediaAsset requires one. It is what answers the question later.
                </span>
              </div>
            </div>
            <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-m)" }}>
              Requires the <code>media.manage</code> right. Nothing here writes yet.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
