import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { createEmptyLinkDrafts, mergeSavedLinkDrafts, serviceOrder, type AdminService, type LinkDraft } from "@/lib/adminLinkDrafts";
import { ArrowLeft, Check, ExternalLink, Link2, Loader2, LockKeyhole, Save, ShieldAlert } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const serviceInfo: Record<AdminService, { name: string; detail: string; hint: string; className: string }> = {
  mega: { name: "Mega", detail: "Primary high-speed mirror", hint: "https://mega.nz/...", className: "text-red-600 bg-red-50 border-red-100" },
  drive: { name: "Google Drive", detail: "Cloud delivery mirror", hint: "https://drive.google.com/...", className: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  telegram: { name: "Telegram", detail: "Channel delivery path", hint: "https://t.me/...", className: "text-sky-700 bg-sky-50 border-sky-100" },
  torrent: { name: "Torrent", detail: "Peer-to-peer magnet link", hint: "magnet:?xt=...", className: "text-green-700 bg-green-50 border-green-100" },
};

function LinkControl() {
  const { user, loading: authLoading } = useAuth();
  const canManage = user?.role === "admin";
  const utils = trpc.useUtils();
  const { data, isLoading, isError, error, refetch } = trpc.downloadLinks.list.useQuery(undefined, { enabled: canManage });
  const [drafts, setDrafts] = useState<LinkDraft[]>(createEmptyLinkDrafts);

  useEffect(() => {
    if (!data) return;
    setDrafts(mergeSavedLinkDrafts(data));
  }, [data]);

  const updateMutation = trpc.downloadLinks.update.useMutation({
    onSuccess: async () => {
      await utils.downloadLinks.list.invalidate();
      await utils.downloadLinks.publicList.invalidate();
      toast.success("Authorised access links have been updated.");
    },
    onError: error => toast.error(error.message),
  });

  const setDraft = (service: AdminService, patch: Partial<LinkDraft>) => {
    setDrafts(current => current.map(item => item.service === service ? { ...item, ...patch } : item));
  };

  const saveLinks = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutation.mutate({ links: drafts });
  };

  if (authLoading) {
    return <div className="grid min-h-80 place-items-center"><Loader2 className="animate-spin text-sky-600" /></div>;
  }

  if (!canManage) {
    return (
      <section className="mx-auto grid max-w-xl gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700"><ShieldAlert size={22} /></span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Owner access required</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">This area is restricted to the project owner. Sign in with the owner account linked to this project to manage the authorised destinations.</p>
        </div>
        <Button asChild variant="outline" className="mx-auto gap-2 text-slate-700 hover:text-slate-950"><Link href="/"><ArrowLeft size={16} />Return to public hub</Link></Button>
      </section>
    );
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-2rem)] bg-[#e7f6fb] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl pb-12">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[.16em] text-sky-700"><span className="h-px w-7 bg-sky-700" />AUTHORISE DELIVERY</p>
          <h1 className="font-['Barlow_Condensed'] text-5xl font-bold leading-none tracking-tight text-slate-950 sm:text-6xl">LINK CONTROL</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">Publish or pause the four external destinations shown on the public access hub. A paused service remains visible but cannot be opened.</p>
        </div>
        <Button asChild variant="outline" className="gap-2 border-slate-300 bg-white text-slate-700 hover:text-slate-950"><Link href="/"><ExternalLink size={15} />View public hub</Link></Button>
      </div>

      <form onSubmit={saveLinks} className="grid gap-4">
        {isLoading ? (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-slate-200 bg-white"><Loader2 className="animate-spin text-sky-600" /></div>
        ) : isError ? (
          <div className="grid min-h-64 place-items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-7 text-center">
            <ShieldAlert className="text-red-600" size={24} />
            <div>
              <h2 className="font-semibold text-red-950">The saved link settings could not be loaded.</h2>
              <p className="mt-1 text-sm text-red-700">{error.message}</p>
            </div>
            <Button type="button" variant="outline" onClick={() => refetch()} className="border-red-200 bg-white text-red-800 hover:text-red-950">Try again</Button>
          </div>
        ) : drafts.map((draft, index) => {
          const info = serviceInfo[draft.service];
          return (
            <article className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[200px_1fr_auto] lg:items-center" key={draft.service}>
              <div className="flex items-center gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl border text-sm font-black ${info.className}`}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-['Barlow_Condensed'] text-2xl font-bold uppercase tracking-tight text-slate-900">{info.name}</h2>
                  <p className="text-xs text-slate-500">{info.detail}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${draft.service}-url`} className="text-xs font-semibold text-slate-600">Destination link</Label>
                <Input
                  id={`${draft.service}-url`}
                  value={draft.url}
                  onChange={event => setDraft(draft.service, { url: event.target.value })}
                  placeholder={info.hint}
                  className="border-slate-200 bg-slate-50 font-mono text-xs focus-visible:ring-sky-500"
                />
              </div>
              <div className="flex min-w-28 items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 lg:flex-col lg:items-start">
                <Label htmlFor={`${draft.service}-enabled`} className="text-xs font-semibold text-slate-700">{draft.isEnabled ? "Live" : "Paused"}</Label>
                <Switch id={`${draft.service}-enabled`} checked={draft.isEnabled} onCheckedChange={isEnabled => setDraft(draft.service, { isEnabled })} />
              </div>
            </article>
          );
        })}
        <div className="mt-3 flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-950 px-5 py-4 text-white sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm text-slate-300"><LockKeyhole size={16} className="text-sky-300" />Only the project owner can publish a destination.</span>
          <Button type="submit" disabled={updateMutation.isPending || isLoading} className="gap-2 bg-sky-300 font-semibold text-slate-950 hover:bg-sky-200">
            {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {updateMutation.isPending ? "Publishing…" : "Publish link changes"}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default function Admin() {
  return <DashboardLayout><LinkControl /></DashboardLayout>;
}
