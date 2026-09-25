/**
 * What the site bar calls the way back to a signed-in person's own place
 * (lib/landing.ts). Its own module so the bar's browser code carries this
 * and nothing else.
 */
export function accountLabel(access: string | null | undefined): string {
  if (!access) return "Sign in";
  return access === "office" ? "Office" : access === "member" ? "Your holdings" : "Your account";
}
