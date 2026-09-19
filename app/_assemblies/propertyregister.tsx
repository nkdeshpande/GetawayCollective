/**
 * THE FIRST WIRED SLICE — /office/register
 *
 * ── WHAT THIS PROVES ─────────────────────────────────────────────────
 * Sign-in → identity row → grants → rights → guarded surface → command →
 * authority check → event → durable row → read back. Every layer of the
 * platform, exercised once, by one capability.
 *
 * It is a server component on purpose. The grants are read on the server
 * from the database on every render, so a revoked grant closes this page on
 * the next navigation rather than at the next token refresh. A client
 * component reading a token would show the surface for up to thirty minutes
 * after authority was withdrawn.
 *
 * ── WHY IT SHOWS THE DENIAL RATHER THAN HIDING ───────────────────────
 * Someone signed in without the right sees what they would need and which
 * admin carries it. A blank page or a 403 would leave them unable to tell
 * whether the feature exists, whether they are signed in, or whom to ask —
 * which is how access questions become support questions.
 */
import Link from "next/link";
import { auth } from "@/auth";
import { grantsFor, rightsFrom } from "@/lib/auth/grants";
import { eventsForIdentity } from "@/lib/events/store";
import { ADMINS } from "@/constants/admins";
import { ROLE_RIGHTS } from "@/lib/authority";
import { VEHICLES } from "@/constants/vehicles";
import { RegisterPropertyForm } from "./propertyform";

const REQUIRED = "property.register" as const;

/** Which admin carries the right — derived, so it cannot name the wrong one. */
const adminCarrying = (right: string) =>
  ADMINS.find((a) => a.roles.some((r) => (ROLE_RIGHTS[r] as readonly string[]).includes(right)));

function Mark() {
  return (
    <header className="sysbar">
      <Link href="/" className="sysmark">GETAWAY COLLECTIVE</Link>
      <span>OFFICE / PROPERTY REGISTER</span>
    </header>
  );
}

export async function PropertyRegister() {
  const session = await auth().catch(() => null);
  const identityId = session?.user?.id ?? null; // vocab-lint-ignore — Auth.js field name

  if (!identityId) {
    return (
      <main className="slice">
        <Mark />
        <section className="slice-card">
          <span className="eyebrow">Office</span>
          <h1>Sign in to continue.</h1>
          <p>This surface records an act against a vehicle, so it needs to know who is acting.
            Nothing here is available to an unidentified caller.</p>
          <Link className="btn primary" href="/sign-in?from=/office/register">Sign in</Link>
        </section>
      </main>
    );
  }

  const grants = await grantsFor(identityId);
  const rights = rightsFrom(grants);
  const held = (rights as readonly string[]).includes(REQUIRED);
  const carrier = adminCarrying(REQUIRED);

  /* Only this identity's own events. A first slice that listed everybody's
     activity would be a disclosure decision nobody made. */
  const mine = (await eventsForIdentity(identityId).catch(() => []))
    .filter((e) => e.type === "PropertyRegistered")
    .slice(-12)
    .reverse();

  return (
    <main className="slice">
      <Mark />

      <section className="slice-head">
        <span className="eyebrow">One capability, wired end to end</span>
        <h1>Register a property.</h1>
        <p>
          This is <code>RegisterProperty</code> — the same command the constitution governs, reached from a form.
          Submitting runs the full envelope: authenticate, authorise against your live grants, execute,
          publish an event, and store it. Nothing is special-cased for this page.
        </p>
      </section>

      <section className="slice-grid">
        <article className="slice-panel">
          <span className="micro">Your authority</span>
          {grants.length === 0 ? (
            <p className="slice-none">
              You hold no grants. Signing in creates an identity; it confers nothing.
              Authority is a separate, deliberate act.
            </p>
          ) : (
            <ul className="slice-list">
              {grants.map((g) => (
                <li key={g.grantId}>
                  <b>{g.role.replace(/_/g, " ")}</b>
                  <span>{g.scope.kind === "vehicle" ? `vehicle · ${g.scope.vehicleId}` : "enterprise"}</span>
                  <span>{g.expiresAt ? `expires ${g.expiresAt.slice(0, 10)}` : "open-ended"}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="slice-foot">
            {rights.length} right{rights.length === 1 ? "" : "s"} in total ·{" "}
            <code>{REQUIRED}</code> {held ? "held" : "not held"}
          </p>
        </article>

        <article className="slice-panel">
          <span className="micro">The three admins</span>
          <ul className="slice-admins">
            {ADMINS.map((a) => {
              const mineToo = a.roles.every((r) => grants.some((g) => g.role === r));
              return (
                <li key={a.id} className={mineToo ? "on" : ""}>
                  <b>{a.label}</b>
                  <span>{a.keystone}</span>
                  <i>{mineToo ? "held" : "not held"}</i>
                </li>
              );
            })}
          </ul>
          <p className="slice-foot">
            Any two may sit with one person. All three may not — that combination completes a
            separation triad and is refused when the grant is requested.
          </p>
        </article>
      </section>

      {held ? (
        <RegisterPropertyForm vehicles={VEHICLES.map((v) => ({ id: v.slug, name: v.propertyName }))} />
      ) : (
        <section className="slice-card denied">
          <span className="eyebrow">Not available to you</span>
          <h2>You are signed in, and this act is not yours to take.</h2>
          <p>
            Registering a property requires <code>{REQUIRED}</code>, which sits with the{" "}
            <b>{carrier?.label ?? "—"}</b> admin. Absence of a grant is a denial rather than an
            oversight — nothing here infers authority from having reached the page.
          </p>
          <p className="slice-foot">
            A grant is issued by the Governance admin, against your address, with a stated reason
            and an expiry.
          </p>
        </section>
      )}

      <section className="slice-events">
        <span className="micro">Registered by you</span>
        {mine.length === 0 ? (
          <p className="slice-none">
            No properties registered under this identity yet. Anything recorded here is a durable
            event, not a form submission — it can be read back, folded and audited.
          </p>
        ) : (
          <ol className="slice-log">
            {mine.map((e) => (
              <li key={e.eventId}>
                <b>{e.objectId}</b>
                <span>{String((e.payload as Record<string, unknown>).label ?? "")}</span>
                <span>{String((e.payload as Record<string, unknown>).vehicleId ?? "")}</span>
                <time dateTime={e.occurredAt}>{e.occurredAt.slice(0, 16).replace("T", " ")}</time>
                <code>{e.eventId}</code>
              </li>
            ))}
          </ol>
        )}
      </section>

      <Link className="slice-back" href="/office">Return to the office</Link>
    </main>
  );
}
