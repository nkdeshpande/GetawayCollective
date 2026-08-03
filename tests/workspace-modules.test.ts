import { describe, expect, it } from "vitest";
import { MEMBER_ROUTES, OFFICE_ROUTES } from "../constants/routes";
import {
  ADMIN_GENERAL_IA,
  MEMBER_GENERAL_IA,
  MEMBER_VEHICLE_IA,
  VEHICLE_STAGES,
  stagesForOfficeRoute,
  workspaceModuleOf,
} from "../constants/workspace-modules";

describe("workspace module taxonomy", () => {
  it("partitions the member realm into general and vehicle modules", () => {
    const classified = MEMBER_ROUTES.map((route) => [route.ia, workspaceModuleOf(route)] as const);
    expect(classified.filter(([, module]) => module === "member-general").map(([ia]) => ia)).toEqual([...MEMBER_GENERAL_IA]);
    expect(classified.filter(([, module]) => module === "member-vehicle").map(([ia]) => ia)).toEqual([...MEMBER_VEHICLE_IA]);
    expect(classified).toHaveLength(13);
  });

  it("partitions the Office realm into seven general routes and 54 vehicle IA records", () => {
    const general = OFFICE_ROUTES.filter((route) => workspaceModuleOf(route) === "admin-general");
    const vehicle = OFFICE_ROUTES.filter((route) => workspaceModuleOf(route) === "admin-vehicle");
    expect(general.map((route) => route.ia)).toEqual([...ADMIN_GENERAL_IA]);
    expect(general).toHaveLength(7);
    expect(vehicle).toHaveLength(53);
    expect(vehicle.flatMap((route) => [route.ia, ...(route.coLocatedIa ?? [])])).toHaveLength(54);
    expect(general.length + vehicle.length).toBe(OFFICE_ROUTES.length);
  });

  it("uses the ratified ten-stage vehicle operating sequence", () => {
    expect(VEHICLE_STAGES.map((stage) => `${stage.id} ${stage.label}`)).toEqual([
      "01 Setup",
      "02 Offer",
      "03 Partners & KYC",
      "04 Settlement",
      "05 Ownership",
      "06 Governance",
      "07 Space + Progress",
      "08 Live + Time",
      "09 Cashflow + Value",
      "10 Board + Comms",
    ]);
  });

  it("maps every vehicle route to at least one lifecycle stage", () => {
    for (const route of OFFICE_ROUTES.filter((item) => workspaceModuleOf(item) === "admin-vehicle")) {
      const stages = stagesForOfficeRoute(route);
      expect(stages.length, route.path).toBeGreaterThan(0);
      expect(new Set(stages).size, route.path).toBe(stages.length);
      for (const stage of stages) expect(VEHICLE_STAGES.some((item) => item.id === stage), route.path).toBe(true);
    }
  });

  it("keeps general Office routes outside vehicle stages", () => {
    for (const route of OFFICE_ROUTES.filter((item) => workspaceModuleOf(item) === "admin-general")) {
      expect(stagesForOfficeRoute(route), route.path).toEqual([]);
    }
  });
});
