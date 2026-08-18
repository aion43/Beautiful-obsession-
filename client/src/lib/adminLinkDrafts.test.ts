import { describe, expect, it } from "vitest";
import { createEmptyLinkDrafts, mergeSavedLinkDrafts } from "./adminLinkDrafts";

describe("admin link drafts", () => {
  it("creates all four paused delivery controls in their public display order", () => {
    expect(createEmptyLinkDrafts()).toEqual([
      { service: "mega", url: "", isEnabled: false },
      { service: "drive", url: "", isEnabled: false },
      { service: "telegram", url: "", isEnabled: false },
      { service: "torrent", url: "", isEnabled: false },
    ]);
  });

  it("maps saved database values onto their matching control while retaining unconfigured services", () => {
    expect(mergeSavedLinkDrafts([
      { service: "telegram", url: "https://t.me/cityzens", isEnabled: true },
      { service: "mega", url: "https://mega.nz/file/example", isEnabled: false },
    ])).toEqual([
      { service: "mega", url: "https://mega.nz/file/example", isEnabled: false },
      { service: "drive", url: "", isEnabled: false },
      { service: "telegram", url: "https://t.me/cityzens", isEnabled: true },
      { service: "torrent", url: "", isEnabled: false },
    ]);
  });
});
