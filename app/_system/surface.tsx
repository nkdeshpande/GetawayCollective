/**
 * THE SURFACE — hand-written, not generated
 *
 * Wave 7 · Workspaces
 *
 * What a generated page renders. It reads the assembly from the registry
 * and lays out its declared sections in order, with each section's rule
 * visible.
 *
 * ── WHAT THIS IS AND IS NOT ──────────────────────────────────────────
 * This is real structure driven by the registry: the sections, their
 * kinds, what each renders, and the rules they carry all come from
 * constants/assemblies.ts. Change the registry and every route changes.
 *
 * It is NOT the finished interface. The 28 assemblies exist as working
 * markup in GC-ASSEMBLIES.html and have not been ported to React
 * components — that is the next piece of work, and the section slots
 * below are where those components will mount.
 *
 * Saying so here rather than shipping lorem: a placeholder that looks
 * finished is worse than one that admits what it is, because the first
 * gets signed off.
 */

import { ASSEMBLIES } from "@/constants/assemblies";
import { ROUTES } from "@/constants/routes";
import { requiredAccess } from "@/lib/access";

const KIND_LABEL: Record<string, string> = {
  masthead: "Masthead",
  narrative: "Narrative",
  grid: "Grid",
  feature: "Feature",
  ledger: "Ledger",
  figure: "Figure",
  action: "Action",
  onward: "Onward",
};

export function Surface({
  path,
  assembly,
  params,
}: {
  path: string;
  assembly: string | null;
  params?: Record<string, string>;
}) {
  const route = ROUTES.find((r) => r.path === path);
  const a = assembly ? ASSEMBLIES.find((x) => x.id === assembly) : undefined;

  return (
    <main className="surface" data-path={path} data-assembly={assembly ?? undefined}>
      <header className="surface-head">
        <p className="eyebrow">
          {assembly ? `${assembly} · ${a?.vantage ?? "?"} vantage` : "Shell · no assembly"}
          {route ? ` · ${requiredAccess(route)}` : ""}
        </p>
        <h1>{a?.name ?? route?.name ?? path}</h1>
        {a ? <p className="answers">{a.answers}</p> : null}
        {a ? <p className="lede">{a.intent}</p> : null}

        {params && Object.keys(params).length > 0 ? (
          <dl className="params">
            {Object.entries(params).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      {a ? (
        <div className="sections">
          {a.sections.map((s) => (
            <section key={s.ref} className="sec" data-kind={s.kind}>
              <p className="sec-ref">
                {s.ref} <span>{KIND_LABEL[s.kind] ?? s.kind}</span>
              </p>
              <h2>{s.name}</h2>
              <p className="sec-purpose">{s.purpose}</p>

              {s.contains.length > 0 ? (
                <p className="sec-renders">{s.contains.join(" · ")}</p>
              ) : null}
              {s.routesTo && s.routesTo.length > 0 ? (
                <p className="sec-routes">&rarr; {s.routesTo.join(" ")}</p>
              ) : null}
              {s.rule ? <p className="sec-rule">{s.rule}</p> : null}
            </section>
          ))}
        </div>
      ) : (
        <p className="shell-note">
          {route?.notes ??
            "A shell route. It exists in the architecture and renders no assembly yet."}
        </p>
      )}

      <footer className="surface-foot">
        <p>
          Structure from <code>constants/assemblies.ts</code>. The section slots above are where the
          assembly components mount; those components exist as working markup in
          GC-ASSEMBLIES.html and have not been ported to React yet.
        </p>
      </footer>
    </main>
  );
}
