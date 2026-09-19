import { describe, expect, it } from "vitest";
import { execute, __resetEventSeq } from "../lib/commands";
import { EventLog } from "../lib/events";
import { SessionAudit, ENTERPRISE, vehicleScope, type Grant } from "../lib/authority";
import { ADMIN_BY_ID } from "../constants/admins";
import { VEHICLES } from "../constants/vehicles";

/**
 * The wired slice's own logic.
 *
 * The route at app/api/office/property cannot be driven end to end until an
 * identity exists to sign in as, so the part of it that is mine — the
 * arguments handed to `execute`, the event emitted, the scope it is
 * evaluated in — is asserted here against the real envelope rather than
 * left resting on the browser round trip that is still blocked.
 */

const NOW = "2026-08-05T10:00:00.000Z";
const VEHICLE = VEHICLES[0].slug;

const grant = (over: Partial<Grant> = {}): Grant => ({
  grantId: "g-1",
  identityId: "person-1",
  role: "investment_committee",
  scope: ENTERPRISE,
  grantedBy: "cli:test",
  grantedAt: "2026-01-01T00:00:00.000Z",
  ...over,
});

/** Exactly what the route does, minus the HTTP. */
const register = (grants: readonly Grant[], identityId: string | null, vehicleId = VEHICLE) => {
  __resetEventSeq();
  const log = new EventLog();
  const audit = new SessionAudit();
  if (identityId) audit.open("s-1", identityId, NOW);
  return execute(
    "RegisterProperty",
    { identityId, sessionId: "s-1", vehicleId, grants, correlationId: "c-1", now: NOW },
    log, audit,
    (emit) => {
      emit("PropertyRegistered", "solace-north-block", { vehicleId, label: "North block" });
      return { propertyId: "solace-north-block" };
    },
  );
};

describe("RegisterProperty — the wired slice", () => {
  it("registers when the identity holds a covering grant", () => {
    const r = register([grant()], "person-1");
    expect(r.ok).toBe(true);
    expect(r.events).toHaveLength(1);
    expect(r.events[0].type).toBe("PropertyRegistered");
    expect(r.events[0].actorId).toBe("person-1");
    expect(r.events[0].causedByCommand).toBe("RegisterProperty");
    expect(r.events[0].payload.vehicleId).toBe(VEHICLE);
  });

  it("refuses an unauthenticated caller, citing I-01", () => {
    const r = register([], null);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/I-01/);
    expect(r.events).toEqual([]);
  });

  it("refuses a signed-in identity with no grant, citing I-02", () => {
    const r = register([], "person-1");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/I-02/);
  });

  it("refuses a role that does not carry the right", () => {
    const r = register([grant({ role: "member" })], "person-1");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/do not carry "property\.register"/);
  });

  /**
   * The one a reviewer should care about most: vehicle scope is what stops
   * a committee seat in one LLP registering property in another, and it is
   * enforced by `covers()` rather than by anything in the route.
   */
  it("refuses a vehicle-scoped grant used against another vehicle", () => {
    const other = VEHICLES[1].slug;
    expect(other).not.toBe(VEHICLE);
    const r = register([grant({ scope: vehicleScope(other) })], "person-1");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/No live grant/);
  });

  it("accepts a vehicle-scoped grant against its own vehicle", () => {
    const r = register([grant({ scope: vehicleScope(VEHICLE) })], "person-1");
    expect(r.ok).toBe(true);
  });

  it("refuses an expired grant", () => {
    const r = register([grant({ expiresAt: "2026-01-02T00:00:00.000Z" })], "person-1");
    expect(r.ok).toBe(false);
  });

  it("refuses a revoked grant", () => {
    const r = register([grant({ revokedAt: "2026-02-01T00:00:00.000Z" })], "person-1");
    expect(r.ok).toBe(false);
  });

  it("records the denial in the audit, not only the success", () => {
    __resetEventSeq();
    const audit = new SessionAudit();
    audit.open("s-1", "person-1", NOW);
    execute("RegisterProperty",
      { identityId: "person-1", sessionId: "s-1", vehicleId: VEHICLE, grants: [], correlationId: "c-1", now: NOW },
      new EventLog(), audit, (emit) => emit("PropertyRegistered", "x", {}));
    expect(audit.deniedAttempts("person-1")).toHaveLength(1);
  });

  it("is reachable by the Capital admin and by no other", () => {
    const carries = (id: "office" | "governance" | "capital") =>
      register(ADMIN_BY_ID[id].roles.map((role, i) => grant({ role, grantId: `g-${i}` })), "person-1").ok;
    expect(carries("capital")).toBe(true);
    expect(carries("office")).toBe(false);
    expect(carries("governance")).toBe(false);
  });
});
