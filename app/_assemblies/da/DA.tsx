/**
 * <DA> — a digital assembly inside a React surface (the workspaces).
 *
 * The same markup the site mounts, from the same renderer, wired by the same
 * wiring. The markup is authored in this repository from the vehicle
 * register and never carries visitor input, which is what makes mounting it
 * safe.
 */

"use client";

import { useEffect, useMemo, useRef } from "react";
import { daHTML, type DAKind } from "./render";
import { wireDA } from "./wire";

export function DA({ kind, vehicle, money }: { kind: DAKind; vehicle?: string; money?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => daHTML(kind, { vehicle, money }), [kind, vehicle, money]);
  useEffect(() => (ref.current ? wireDA(ref.current) : undefined), [html]);
  return <div ref={ref} className="da-host" dangerouslySetInnerHTML={{ __html: html }} />;
}
