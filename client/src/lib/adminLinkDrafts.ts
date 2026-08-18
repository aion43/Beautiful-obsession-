export const serviceOrder = ["mega", "drive", "telegram", "torrent"] as const;

export type AdminService = (typeof serviceOrder)[number];
export type LinkDraft = { service: AdminService; url: string; isEnabled: boolean };

type SavedLink = LinkDraft;

export function createEmptyLinkDrafts(): LinkDraft[] {
  return serviceOrder.map(service => ({ service, url: "", isEnabled: false }));
}

export function mergeSavedLinkDrafts(savedLinks: SavedLink[] | undefined): LinkDraft[] {
  return serviceOrder.map(service => {
    const saved = savedLinks?.find(link => link.service === service);
    return saved ? { service, url: saved.url, isEnabled: saved.isEnabled } : { service, url: "", isEnabled: false };
  });
}
