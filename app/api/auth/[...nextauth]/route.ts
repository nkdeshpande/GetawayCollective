/**
 * THE AUTH ENDPOINT — hand-written, not generated
 *
 * Auth.js owns every path under /api/auth: the provider handshakes, the
 * callbacks, the CSRF token and the sign-out post. They are endpoints
 * rather than surfaces, so they are correctly absent from
 * constants/routes.ts, and the middleware matcher already excludes /api.
 *
 * That exclusion is the reason this file exists at this exact path and
 * not somewhere prettier: a route the guard cannot see must be one the
 * guard does not need to see. Auth.js authorises its own requests —
 * signature, state parameter and CSRF token — and it is the one endpoint
 * family that must remain reachable to an anonymous caller, because
 * everybody is anonymous until it answers.
 */

export const runtime = "nodejs";

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
