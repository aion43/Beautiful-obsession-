import { describe, expect, it } from "vitest";
import { downloadLinksInputSchema } from "./routers";

const validLinks = [
  { service: "mega", url: "https://mega.nz/file/example", isEnabled: true },
  { service: "drive", url: "https://drive.google.com/file/d/example", isEnabled: false },
  { service: "telegram", url: "https://t.me/example", isEnabled: true },
  { service: "torrent", url: "magnet:?xt=urn:btih:example", isEnabled: true },
] as const;

describe("downloadLinksInputSchema", () => {
  it("accepts all four services with web and magnet destinations", () => {
    expect(downloadLinksInputSchema.safeParse({ links: validLinks }).success).toBe(true);
  });

  it("rejects a live destination that has no link", () => {
    const links = validLinks.map(item => ({ ...item }));
    links[0].url = "";
    expect(downloadLinksInputSchema.safeParse({ links }).success).toBe(false);
  });

  it("rejects duplicate service entries", () => {
    const links = validLinks.map(item => ({ ...item }));
    links[3].service = "mega";
    expect(downloadLinksInputSchema.safeParse({ links }).success).toBe(false);
  });
});
