/**
 * Shared helpers for the composed surfaces.
 *
 * The disclosure builder is the important one: every composition MUST
 * state what each of the four stages sees, and `d()` refuses an empty
 * stage — a page that cannot say what a stage sees has not decided,
 * and an undecided disclosure ships as a blank cell nobody questions.
 */
import type { Stage } from "@/app/_assemblies/compose";

export function d(
  pub: string, kyc: string, committed: string, operational: string,
): Record<Stage, string> {
  for (const [k, v] of Object.entries({ pub, kyc, committed, operational })) {
    if (!v || v.length < 8) throw new Error(`disclosure stage "${k}" is empty or trivial: "${v}"`);
  }
  return { public: pub, kyc, committed, operational };
}

/** The honest not-built line, phrased once. */
export const NOT_WIRED =
  "Nothing is sent in this build — identity, persistence and payments are not connected. " +
  "The control shows the shape of the step, and says so rather than pretending.";
