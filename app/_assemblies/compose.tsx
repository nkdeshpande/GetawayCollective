/**
 * THE COMPOSER — pages as content, sections as assemblies
 *
 * Wave 9 · Modular build
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * 82 routes rendered the registry scaffold because each was waiting to
 * be hand-built — and the hand-built pages had already shown that they
 * are all the same dozen arrangements: a head, a row of figures, a
 * key-value panel, a table, a timeline, a callout, an honest absence.
 * Those arrangements exist in assemblies.css and have been through five
 * contrast sweeps. What was missing was not components; it was a way to
 * express a page as CONTENT against the components that exist.
 *
 * This file is that way. A page is a Composition — data, in content/
 * compositions/ — and this renderer maps each section kind onto the
 * classes the design system already ships. No new visual vocabulary is
 * invented here: >90% of what renders below is the existing system
 * (.panel, .kv, .stages, .conf, .sheet tables, .fields, the Absent
 * pattern), and the few new rules in assemblies.css are layout glue.
 *
 * ── PROGRESSIVE DISCLOSURE IS A DECLARED PROPERTY ────────────────────
 * Every composition states what it shows at each of the four stages of
 * the relationship:
 *
 *   public       anyone, before identification
 *   kyc          an Investor, after PR-01 accreditation
 *   committed    after commitment — the Member Law may not have fired
 *   operational  after the property is live and earning
 *
 * The strip renders on every composed page, and a section can carry a
 * stage tag where it appears later than the page's own stage. This is
 * the whole GC system stated as one gradient: each stage sees MORE of
 * the same records, never different records — the aperture rule
 * ("less, not different") applied to time as well as role.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { plate, type Confidence } from "./data";
import { ConfidenceTag, Footer } from "./atoms";

/* ── The four stages ─────────────────────────────────────────────── */

export type Stage = "public" | "kyc" | "committed" | "operational";

export const STAGE_LABEL: Record<Stage, string> = {
  public: "Public",
  kyc: "Post-KYC",
  committed: "Post-commitment",
  operational: "Operational",
};

const STAGE_ORDER: readonly Stage[] = ["public", "kyc", "committed", "operational"];

/**
 * A stable hue per surface, derived from its path.
 *
 * Not random — a bed that changed between visits would make the same
 * page feel like a different one. Not chosen per page either: 133
 * hand-picked hues is 133 opportunities for two neighbours to clash.
 * The hash is deterministic, and the range is deliberately narrow
 * (150°–260°: forest through to the coastal blues the collection
 * already uses) so no surface arrives in a colour the palette would
 * never sanction.
 */
export function hueOf(path: string): number {
  let h = 0;
  for (let i = 0; i < path.length; i++) h = (h * 31 + path.charCodeAt(i)) >>> 0;
  return 150 + (h % 111);
}

/* ── Section kinds ───────────────────────────────────────────────── */

export interface Figure {
  label: string;
  value: string;
  sub?: string;
  conf?: Confidence;
  money?: boolean;
  nights?: boolean;
}

export interface KVRow { k: string; v: string; money?: boolean; mono?: boolean }

export type Cell = string | { v: string; money?: boolean; dim?: boolean; mono?: boolean };

export type Section =
  | { kind: "figures"; label?: string; items: readonly Figure[]; view?: Stage }
  | { kind: "kv"; label?: string; rows: readonly KVRow[]; note?: string; view?: Stage }
  | { kind: "table"; label?: string; cols: readonly { h: string; num?: boolean }[];
      rows: readonly (readonly Cell[])[]; note?: string; paper?: boolean; view?: Stage }
  | { kind: "prose"; label?: string; paras: readonly string[]; view?: Stage }
  | { kind: "note"; tone: "hazard" | "confirm" | "steel" | "electric";
      strong?: string; text: string; view?: Stage }
  | { kind: "stages"; label?: string; items: readonly { n: string; t: string; st?: string; now?: boolean }[];
      note?: string; view?: Stage }
  | { kind: "cards"; label?: string; items: readonly { t: string; body: string; meta?: string }[]; view?: Stage }
  | { kind: "links"; items: readonly { t: string; to: string; primary?: boolean }[]; view?: Stage }
  | { kind: "empty"; what: string; because: string; when: string; view?: Stage }
  | { kind: "form"; label?: string; fields: readonly { id: string; label: string; help?: string; type?: string }[];
      submit: string; note: string; view?: Stage }
  | { kind: "plates"; label?: string;
      items: readonly { ref: string; caption: string; kindLabel: string; hue: number }[];
      note?: string; view?: Stage };

export interface Composition {
  title: string;
  eyebrow?: string;
  lead?: string;
  /** What each stage of the relationship sees on this surface. */
  disclosure: Record<Stage, string>;
  sections: readonly Section[];
}

export type Entry = Composition | ((param: string) => Composition);

/* ── Renderers — each maps onto classes the system already ships ─── */

function StageTag({ view }: { view?: Stage }) {
  if (!view) return null;
  /* The .conf chip, reused: a stage is a kind of provenance. */
  return <span className={`conf disc-${view}`} style={{ marginLeft: "var(--gc-sp-2xs)" }}>{STAGE_LABEL[view]}</span>;
}

function SectionLabel({ label, view }: { label?: string; view?: Stage }) {
  if (!label && !view) return null;
  return (
    <div className="sec-head" style={{ marginBottom: "var(--gc-sp-m)" }}>
      {label ? <span className="sec-ref">{label}</span> : null}
      <StageTag view={view} />
    </div>
  );
}

function Figures({ s }: { s: Extract<Section, { kind: "figures" }> }) {
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
        {s.items.map((f) => (
          <div key={f.label} className="panel on-panel" style={{ flex: "1 1 220px" }}>
            <span className="t-micro label">{f.label}</span>
            <div className={"t-display-m" + (f.money ? " money" : "") + (f.nights ? " nights" : "")}
                 style={{ marginTop: "var(--gc-sp-2xs)" }}>
              {f.value}
            </div>
            {f.sub ? <span className="t-mono-s dim">{f.sub}</span> : null}
            {f.conf ? <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ConfidenceTag c={f.conf} /></div> : null}
          </div>
        ))}
      </div>
    </>
  );
}

function KV({ s }: { s: Extract<Section, { kind: "kv" }> }) {
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      <div className="panel on-panel" style={{ maxWidth: "720px" }}>
        {s.rows.map((r) => (
          <div className="kv" key={r.k}>
            <span className="label t-micro">{r.k}</span>
            <span className={"v" + (r.money ? " money" : "") + (r.mono ? " t-mono-s" : " t-body-s")}>{r.v}</span>
          </div>
        ))}
      </div>
      {s.note ? <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>{s.note}</p> : null}
    </>
  );
}

function TableSec({ s }: { s: Extract<Section, { kind: "table" }> }) {
  const cell = (c: Cell, i: number) => {
    const x = typeof c === "string" ? { v: c } : c;
    return (
      <td key={i} className={s.cols[i]?.num ? "num" : undefined}>
        <span className={(x.money ? "money " : "") + (x.mono ? "t-mono-s " : "") + (x.dim ? "dim" : "")}>
          {x.v || "—"}
        </span>
      </td>
    );
  };
  const table = (
    <div className="scroll-x">
      <table>
        <thead>
          <tr>{s.cols.map((c) => <th key={c.h} className={c.num ? "num" : undefined}>{c.h}</th>)}</tr>
        </thead>
        <tbody>
          {s.rows.map((r, i) => <tr key={i}>{r.map(cell)}</tr>)}
        </tbody>
      </table>
    </div>
  );
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      {s.paper ? <div className="on-paper" style={{ padding: "var(--gc-sp-m)" }}>{table}</div> : table}
      {s.note ? <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "72ch" }}>{s.note}</p> : null}
    </>
  );
}

function Prose({ s }: { s: Extract<Section, { kind: "prose" }> }) {
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      {s.paras.map((p, i) => (
        <p key={i} className="t-body dim measure" style={{ marginTop: i ? "var(--gc-sp-s)" : 0 }}>{p}</p>
      ))}
    </>
  );
}

const TONE: Record<string, string> = {
  hazard: "var(--gc-hazard)", confirm: "var(--gc-confirm)",
  steel: "var(--gc-steel)", electric: "var(--gc-electric)",
};

function Note({ s }: { s: Extract<Section, { kind: "note" }> }) {
  return (
    <div style={{ borderLeft: `2px solid ${TONE[s.tone]}`, paddingLeft: "var(--gc-sp-s)", maxWidth: "74ch" }}>
      <p className="t-body">
        {s.strong ? <strong style={{ color: TONE[s.tone] }}>{s.strong} </strong> : null}
        {s.text}
        <StageTag view={s.view} />
      </p>
    </div>
  );
}

function Stages({ s }: { s: Extract<Section, { kind: "stages" }> }) {
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      <div className="scroll-x">
        <div className="stages">
          {s.items.map((x) => (
            <div key={x.n + x.t} className={`stage ${x.now ? "now" : ""}`}>
              <span className="n t-mono-s">{x.n}</span>
              <span className="t t-body-s">{x.t}</span>
              {x.st ? <span className="st t-mono-s dim">{x.st}</span> : null}
            </div>
          ))}
        </div>
      </div>
      {s.note ? <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "70ch" }}>{s.note}</p> : null}
    </>
  );
}

function Cards({ s }: { s: Extract<Section, { kind: "cards" }> }) {
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      <div className="grid-3">
        {s.items.map((c) => (
          <div key={c.t} className="panel on-panel">
            {c.meta ? <span className="t-micro label">{c.meta}</span> : null}
            <h3 className="t-subheading" style={{ marginTop: c.meta ? "var(--gc-sp-2xs)" : 0 }}>{c.t}</h3>
            <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{c.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Links({ s }: { s: Extract<Section, { kind: "links" }> }) {
  return (
    <div className="row" style={{ gap: "var(--gc-sp-s)" }}>
      {s.items.map((l) => (
        <Link key={l.to + l.t} className={`btn ${l.primary ? "primary" : ""}`} href={l.to}>{l.t}</Link>
      ))}
    </div>
  );
}

/**
 * The honest absence (the Absent pattern from the console).
 * A surface whose record does not exist yet SAYS SO — what, why, and
 * when it changes — rather than rendering an empty table that is
 * indistinguishable from a rendering failure.
 */
function Empty({ s }: { s: Extract<Section, { kind: "empty" }> }) {
  return (
    <div className="panel on-panel" style={{ borderLeft: "2px solid var(--gc-steel)", maxWidth: "720px" }}>
      <span className="t-micro label">{s.what}<StageTag view={s.view} /></span>
      <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "60ch" }}>{s.because}</p>
      <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{s.when}</p>
    </div>
  );
}

/**
 * A generic resumable form, in the PR-01 idiom: every field saves on
 * blur to a local draft. The submit NEVER pretends: `note` states what
 * this build does and does not do with the input, and it is rendered
 * beside the control, not hidden in a tooltip.
 */
function FormSec({ s }: { s: Extract<Section, { kind: "form" }> }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      <div style={{ maxWidth: "560px" }}>
        <div className="fields">
          {s.fields.map((f) => (
            <div className="f full" key={f.id}>
              <label htmlFor={`cf-${f.id}`}>{f.label}</label>
              <input
                id={`cf-${f.id}`}
                type={f.type ?? "text"}
                value={vals[f.id] ?? ""}
                onChange={(e) => setVals((p) => ({ ...p, [f.id]: e.target.value }))}
                onBlur={() => {
                  if (!vals[f.id]?.trim()) return;
                  setSaved(f.id);
                  setTimeout(() => setSaved(null), 1600);
                }}
              />
              {f.help ? <span className="help t-body-s">{f.help}</span> : null}
            </div>
          ))}
        </div>
        <button className="btn primary" type="button" onClick={() => setSent(true)}>{s.submit}</button>
        <span className={`saved t-mono-s ${saved ? "on" : ""}`} style={{ marginLeft: "var(--gc-sp-s)" }}>
          Draft saved
        </span>
        <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "56ch" }}>
          {sent ? s.note : s.note}
        </p>
      </div>
    </>
  );
}

/** Labelled plates — drawings say they are drawings (the gallery rule). */
function Plates({ s }: { s: Extract<Section, { kind: "plates" }> }) {
  return (
    <>
      <SectionLabel label={s.label} view={s.view} />
      <div className="grid-3">
        {s.items.map((p) => (
          <figure key={p.ref}>
            <div style={{ ...plate(p.hue), aspectRatio: "4 / 3" }} />
            <figcaption>
              <span className="t-mono-s dim" style={{ display: "block", marginTop: "var(--gc-sp-2xs)" }}>
                {p.ref} · {p.kindLabel}
              </span>
              <span className="t-body-s" style={{ display: "block" }}>{p.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      {s.note ? <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "70ch" }}>{s.note}</p> : null}
    </>
  );
}

const RENDER: { [K in Section["kind"]]: (props: { s: never }) => React.ReactElement } = {
  figures: Figures, kv: KV, table: TableSec, prose: Prose, note: Note,
  stages: Stages, cards: Cards, links: Links, empty: Empty, form: FormSec, plates: Plates,
} as never;

/* ── The disclosure strip ────────────────────────────────────────── */

function DisclosureStrip({ d }: { d: Record<Stage, string> }) {
  return (
    <div className="disc-strip" aria-label="What each stage of the relationship sees here">
      {STAGE_ORDER.map((st, i) => (
        <div key={st} className="disc-cell">
          <span className="t-micro label">{String(i + 1).padStart(2, "0")} · {STAGE_LABEL[st]}</span>
          <p className="t-body-s">{d[st]}</p>
        </div>
      ))}
    </div>
  );
}

/* ── The page ────────────────────────────────────────────────────── */

import { COMPOSITIONS } from "@/content/compositions";

export function Composed({ path, param }: { path: string; param?: string }) {
  const entry = COMPOSITIONS[path];
  if (!entry) {
    /* A composed route with no composition is a build defect. Loudly. */
    throw new Error(`No composition for ${path} — add it to content/compositions/`);
  }
  const page = typeof entry === "function" ? entry(param ?? "") : entry;

  /*
   * EVERY SURFACE OPENS WITH A HERO.
   *
   * No photography exists — content/gateway.ts states plainly that not
   * one property has been photographed — so the bed is a generated
   * plate rather than a stock image standing in for one. Its hue is
   * DERIVED from the path, so a surface keeps the same bed on every
   * visit and two different surfaces do not collide, without anyone
   * choosing a colour per page.
   *
   * FB-1 still holds over the bed: an eyebrow, a title and a line of
   * prose, and no FIGURE. A number over an image is read against
   * whatever pixels happen to sit behind it, and those differ per
   * viewport and per crop.
   */
  const hue = hueOf(path);

  return (
    <>
      <header className="p-hero p-hero-own">
        <span className="bed" style={plate(hue)} aria-hidden="true" />
        <span className="sc" aria-hidden="true" />
        <div className="wrap in">
          {page.eyebrow ? <span className="t-micro eyebrow">{page.eyebrow}</span> : null}
          <h1 className="t-display-l">{page.title}</h1>
          {page.lead ? <p className="t-body-l sup">{page.lead}</p> : null}
        </div>
      </header>

      <section data-sec="COMPOSED" style={{ borderBottom: "none", paddingTop: 0 }}>
        <div className="wrap">
          <div style={{ marginTop: 0 }}>
            <DisclosureStrip d={page.disclosure} />
          </div>

          {page.sections.map((s, i) => {
            const R = RENDER[s.kind] as (props: { s: Section }) => React.ReactElement;
            return (
              <div key={i} style={{ marginTop: "var(--gc-sp-xl)" }}>
                <R s={s} />
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
}
