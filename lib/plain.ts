/**
 * Plain words for the shorthand the record carries — 25 Sep 2026
 *
 * The vehicle record keeps the lender's and the registrar's own terms —
 * "DSCR 1.50x minimum", "CRZ compliant", "Internal register first" —
 * because that is how the intake and the facility letter state them, and
 * the record should match its source. A reader should not need to know
 * them. So a public surface passes such a string through here, which says
 * what the term means beside it, and the record itself stays verbatim.
 *
 * Each rule applies once, to the first occurrence: the term is explained
 * where it is first met, not every time it recurs.
 */
const RULES: readonly (readonly [RegExp, string])[] = [
  [/\bDSCR (\d+(?:\.\d+)?)x minimum\b/, "income must cover the loan repayments at least $1 times (a DSCR, debt service coverage ratio, of $1x)"],
  [/\bCRZ\b/, "Coastal Regulation Zone (CRZ)"],
  [/\bInternal register first; external buyer needs consent\b/, "Offered to existing partners first; a buyer from outside needs the partners' consent"],
];

export function plainTerms(s: string): string {
  let out = s;
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out;
}
