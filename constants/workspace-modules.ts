import type { Route } from "./routes";

export type WorkspaceModule =
  | "member-general"
  | "member-vehicle"
  | "admin-general"
  | "admin-vehicle";

export type VehicleStageId =
  | "01" | "02" | "03" | "04" | "05"
  | "06" | "07" | "08" | "09" | "10";

export interface VehicleStage {
  id: VehicleStageId;
  label: string;
  purpose: string;
  gate: string;
  owner: string;
}

export const VEHICLE_STAGES: readonly VehicleStage[] = [
  { id: "01", label: "Setup", purpose: "Form the LLP, establish authority and assemble the formation record.", gate: "VEHICLE READY", owner: "Legal / Control Office" },
  { id: "02", label: "Offer", purpose: "Approve the proposition, capacity, evidence, risk and access controls.", gate: "OFFER OPEN", owner: "IR / Compliance" },
  { id: "03", label: "Partners & KYC", purpose: "Qualify each prospective Partner and preserve the identity evidence.", gate: "PARTNER CLEARED", owner: "IR / Compliance" },
  { id: "04", label: "Settlement", purpose: "Verify funds, reconcile the transaction and complete controlled settlement.", gate: "FUNDS SETTLED", owner: "Finance / Legal" },
  { id: "05", label: "Ownership", purpose: "Admit the Partner, issue the interest and update the constitutional registers.", gate: "INTEREST ISSUED", owner: "Legal / Finance" },
  { id: "06", label: "Governance", purpose: "Activate rights, policies, authorities, resolutions and compliance controls.", gate: "AUTHORITY CURRENT", owner: "Board / Governance" },
  { id: "07", label: "Space + Progress", purpose: "Control the asset, baseline, budget, delivery evidence and material change.", gate: "DELIVERY CONTROLLED", owner: "COO / Project" },
  { id: "08", label: "Live + Time", purpose: "Publish the annual pool, derive entitlements and hand allocation to operations.", gate: "TIME PUBLISHED", owner: "Time Office / Operations" },
  { id: "09", label: "Cashflow + Value", purpose: "Close periods, preserve reserves, value the interest and execute distributions.", gate: "PERIOD CLOSED", owner: "Finance / Board" },
  { id: "10", label: "Board + Comms", purpose: "Prepare meetings, decide matters, issue notices and preserve the board record.", gate: "BOARD RECORD CURRENT", owner: "Board / Communications" },
] as const;

export const MEMBER_GENERAL_IA = ["MEM-000", "MEM-100", "MEM-200", "MEM-210"] as const;
export const MEMBER_VEHICLE_IA = [
  "MEM-110", "MEM-120", "MEM-130", "MEM-140", "MEM-150",
  "MEM-160", "MEM-170", "MEM-180", "MEM-190",
] as const;
export const ADMIN_GENERAL_IA = [
  /* OFF-095 (The Desk) is general, not vehicle-scoped, and deliberately
     so: it is the one Office surface about people who do not yet have a
     vehicle. Everything from OFF-110 onward is scoped to one. */
  "OFF-090", "OFF-095", "OFF-100", "NET-100", "NET-110", "SYS-100", "SYS-110", "SYS-120",
] as const;

const MEMBER_GENERAL = new Set<string>(MEMBER_GENERAL_IA);
const MEMBER_VEHICLE = new Set<string>(MEMBER_VEHICLE_IA);
const ADMIN_GENERAL = new Set<string>(ADMIN_GENERAL_IA);
const EVERY_STAGE = VEHICLE_STAGES.map((stage) => stage.id);

export function workspaceModuleOf(route: Pick<Route, "ia" | "path">): WorkspaceModule | undefined {
  if (MEMBER_GENERAL.has(route.ia)) return "member-general";
  if (MEMBER_VEHICLE.has(route.ia)) return "member-vehicle";
  if (ADMIN_GENERAL.has(route.ia)) return "admin-general";
  if (route.path.startsWith("/office/collection/[vehicle]")) return "admin-vehicle";
  return undefined;
}

export function stagesForOfficeRoute(route: Pick<Route, "ia" | "path">): readonly VehicleStageId[] {
  if (workspaceModuleOf(route) !== "admin-vehicle") return [];
  if (route.ia === "OFF-110" || route.ia.startsWith("DOC-") || route.ia.startsWith("ACT-")) return EVERY_STAGE;
  if (route.ia === "OFF-180" || route.ia === "OFF-190") return EVERY_STAGE;
  if (route.ia === "OFF-120" || route.ia.startsWith("SPA-") || route.ia === "OFF-150" || route.ia.startsWith("PRJ-")) return ["07"];
  if (route.ia === "OFF-140" || route.ia.startsWith("TIM-")) return ["08"];
  if (route.ia === "OFF-160" || route.ia === "PAR-110") return ["03", "05"];
  if (route.ia === "PAR-120") return ["05"];
  if (route.ia === "PAR-130") return ["03", "04", "05"];
  if (route.ia === "PAR-140") return ["08"];
  if (route.ia === "PAR-150") return ["09"];
  if (route.ia === "PAR-160") return ["06", "10"];
  if (route.ia === "OFF-130" || route.ia === "CAP-100") return ["02", "04", "05", "09"];
  if (route.ia === "CAP-110") return ["05"];
  if (route.ia === "CAP-120") return ["04", "05"];
  if (route.ia === "CAP-130") return ["04", "09"];
  if (route.ia.startsWith("CAP-")) return ["09"];
  if (route.ia === "OFF-170" || route.ia.startsWith("GOV-")) return ["01", "06", "10"];
  return EVERY_STAGE;
}
