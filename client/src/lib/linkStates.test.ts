import { describe, expect, it } from "vitest";
import { deliveryStateLabel, getDeliveryLinkState, ownerAccessGuidance } from "./linkStates";

describe("public delivery-link state", () => {
  it("shows a ready state only when the administrator enabled a non-empty destination", () => {
    expect(getDeliveryLinkState({ service: "mega", url: "https://mega.nz/file/example", isEnabled: true }, false, false)).toBe("ready");
    expect(getDeliveryLinkState({ service: "mega", url: "", isEnabled: true }, false, false)).toBe("pending");
  });

  it("prioritises unavailable and loading feedback when configuration cannot be read", () => {
    expect(getDeliveryLinkState(undefined, true, false)).toBe("checking");
    expect(getDeliveryLinkState(undefined, true, true)).toBe("unavailable");
    expect(deliveryStateLabel.unavailable).toBe("ACCESS UNAVAILABLE");
  });

  it("keeps the footer key guidance pinned to the protected admin route", () => {
    expect(ownerAccessGuidance).toEqual({ route: "/admin", model: "project-owner-authentication" });
  });
});
