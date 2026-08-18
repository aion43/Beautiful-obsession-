export type ManagedDeliveryLink = {
  service: string;
  url: string;
  isEnabled: boolean;
};

export type DeliveryLinkState = "ready" | "checking" | "unavailable" | "pending";

export function getDeliveryLinkState(
  link: ManagedDeliveryLink | undefined,
  isLoading: boolean,
  isError: boolean,
): DeliveryLinkState {
  if (isError) return "unavailable";
  if (link?.isEnabled && link.url) return "ready";
  if (isLoading) return "checking";
  return "pending";
}

export const deliveryStateLabel: Record<DeliveryLinkState, string> = {
  ready: "ACCESS READY",
  checking: "CHECKING ACCESS",
  unavailable: "ACCESS UNAVAILABLE",
  pending: "ADMIN LINK PENDING",
};

export const ownerAccessGuidance = {
  route: "/admin",
  model: "project-owner-authentication",
} as const;
