/**
 * Email rendering and the refusal to send a specimen.
 *
 * The client-compatibility assertions look pedantic and are not. Each one
 * corresponds to a way an email silently arrives broken: a <style> block
 * Gmail strips, a var() no client resolves, a relative href with no origin
 * to resolve against. None of those fail loudly — they just produce an
 * unstyled message with dead links in somebody's inbox, and nobody tells
 * you.
 */
import { describe, it, expect } from "vitest";
import { preview, sendNotice } from "../lib/email/send";
import { renderNotice } from "../lib/email/render";
import { NOTICES, noticeById, SPECIMEN_CONTEXT } from "../content/notifications";
import { COLOUR } from "../constants/tokens";

const EMAIL_NOTICES = NOTICES.filter((n) => n.channels.includes("email"));

describe("every email notice renders", () => {
  it("covers each notice that declares the email channel", () => {
    expect(EMAIL_NOTICES.length).toBeGreaterThan(10);
    for (const n of EMAIL_NOTICES) {
      const r = preview(n.id);
      expect(r, n.id).toBeTruthy();
      expect(r!.subject.length, n.id).toBeGreaterThan(2);
      expect(r!.html, n.id).toContain("<!doctype html>");
    }
  });

  it("always produces a plain-text part", () => {
    // A message with no text/plain alternative is scored as likely spam by
    // most filters, and an investor notice in junk was not delivered.
    for (const n of EMAIL_NOTICES) {
      const r = preview(n.id)!;
      expect(r.text.length, n.id).toBeGreaterThan(40);
      expect(r.text, n.id).toContain("GETAWAY COLLECTIVE");
    }
  });

  it("returns null for a notice that does not exist", () => {
    expect(preview("N-999")).toBeNull();
  });
});

describe("what email clients actually support", () => {
  const html = preview("N-09")!.html;

  it("uses no <style> block — Gmail strips them", () => {
    expect(html).not.toMatch(/<style/i);
  });

  it("uses no CSS custom properties — no client resolves var()", () => {
    expect(html).not.toContain("var(--");
  });

  it("makes every link absolute — an inbox has no origin", () => {
    const relative = [...html.matchAll(/href="(\/[^"]*)"/g)];
    expect(relative.map((m) => m[1])).toEqual([]);
  });

  it("carries a preheader so the inbox preview is not markup", () => {
    expect(html).toMatch(/max-height:0/);
  });

  it("lays out in tables, because Outlook renders through Word", () => {
    expect([...html.matchAll(/<table/g)].length).toBeGreaterThanOrEqual(2);
  });
});

describe("colours are derived from tokens, never typed", () => {
  it("uses the real token values", () => {
    const html = preview("N-09")!.html;
    // If someone hand-types a hex here, changing the token stops changing
    // the email and §29's single source of truth is quietly gone.
    expect(html).toContain(COLOUR.ink);
    expect(html).toContain(COLOUR.paper);
  });
});

describe("the confidence class survives into the inbox", () => {
  it("spells out what a forecast is, rather than shipping a bare label", () => {
    // UX-05 does not stop at the browser. A forward figure that loses its
    // class on the way out is one the reader takes as settled — and a
    // distribution notice is exactly where that matters.
    const r = preview("N-09")!;
    expect(r.text).toMatch(/modelled figure, not a settled one/);
    expect(r.html).toMatch(/modelled figure, not a settled one/);
  });
});

describe("sending refuses what it should", () => {
  it("refuses a notice that is not wired", async () => {
    // Sixteen of seventeen are specimens. A specimen rendered on a page is
    // a specimen; the same specimen in an inbox is a claim about money.
    const spec = EMAIL_NOTICES.find((n) => !n.wired)!;
    const out = await sendNotice(spec.id, "someone@example.com");
    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.reason).toBe("not-wired");
      expect(out.detail).toMatch(/specimen/);
    }
  });

  it("refuses an unknown notice", async () => {
    const out = await sendNotice("N-999", "someone@example.com");
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.reason).toBe("unknown-notice");
  });

  it("refuses a notice that does not declare the email channel", async () => {
    const productOnly = NOTICES.find((n) => !n.channels.includes("email"));
    if (!productOnly) return;
    const out = await sendNotice(productOnly.id, "someone@example.com");
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.reason).toBe("not-an-email-notice");
  });
});

describe("escaping", () => {
  it("escapes content rather than interpolating it as markup", () => {
    const r = renderNotice({
      title: 'Quarter <script>alert("x")</script>',
      body: ["A & B"],
      facts: [{ k: "<b>k</b>", v: "<i>v</i>" }],
      links: [{ t: "Go & see", to: "/collection" }],
    } as Parameters<typeof renderNotice>[0]);
    expect(r.html).not.toContain("<script>");
    expect(r.html).toContain("&lt;script&gt;");
    expect(r.html).toContain("A &amp; B");
  });
});

describe("the specimen context is the canon's", () => {
  it("renders from the same worked figures the product feed uses", () => {
    const direct = renderNotice(noticeById("N-09")!.render(SPECIMEN_CONTEXT));
    expect(preview("N-09")!.subject).toBe(direct.subject);
  });
});
