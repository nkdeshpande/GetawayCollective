/**
 * Auth.js type augmentation.
 *
 * The coarse access class travels on both the JWT and the session, so it
 * has to exist on both interfaces or every read of it is an `any` cast.
 * Declaring it here keeps the cast out of the call sites, where a wrong
 * one would be a silent permission bug rather than a type error.
 */

import type { TokenAccess } from "../auth.config";

declare module "next-auth" {
  interface Session {
    user: { // vocab-lint-ignore — Auth.js declares this field; augmenting it cannot rename it
      id: string;
      access: TokenAccess;
      /** Right[] from lib/authority.ts, widened to string[] so this file
          does not drag the constitution into the edge bundle. */
      rights: string[];
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Stamped by the jwt callback in auth.ts. Never trusted alone — see
        lib/session.ts, which re-reads authority from the database. */
    access?: TokenAccess;
    rights?: string[];
  }
}

export {};
