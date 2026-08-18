import {
  ArrowDownToLine,
  ArrowUpRight,
  CheckCircle2,
  Cloud,
  KeyRound,
  Magnet,
  Play,
  Send,
  ShieldCheck,
  Triangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { deliveryStateLabel, getDeliveryLinkState, ownerAccessGuidance } from "@/lib/linkStates";

const supporterLogo = "/manus-storage/cityzens-wing-bangladesh-logo_d81e4ece.png";
const kevinImage = "/manus-storage/kevin-de-bruyne-city_ef5085ab.jpg";
const pepAndKevinImage = "/manus-storage/pep-and-kevin-city_7c308329.jpg";

type ServiceIconProps = { className?: string };

function MegaMark({ className }: ServiceIconProps) {
  return (
    <span aria-hidden="true" className={`service-mark mega-mark ${className ?? ""}`}>
      M
    </span>
  );
}

const deliveryOptions = [
  {
    id: "mega",
    label: "Download from Mega",
    shortLabel: "MEGA",
    description: "High-speed mirror",
    serviceClass: "mega",
    Icon: MegaMark,
  },
  {
    id: "drive",
    label: "Download from Google Drive",
    shortLabel: "GOOGLE DRIVE",
    description: "Cloud access mirror",
    serviceClass: "drive",
    Icon: Triangle,
  },
  {
    id: "telegram",
    label: "Open on Telegram",
    shortLabel: "TELEGRAM",
    description: "Channel delivery",
    serviceClass: "telegram",
    Icon: Send,
  },
  {
    id: "torrent",
    label: "Get Torrent link",
    shortLabel: "TORRENT",
    description: "Peer-to-peer mirror",
    serviceClass: "torrent",
    Icon: Magnet,
  },
] as const;

export default function Home() {
  const { data: managedLinks, isLoading: linksLoading, isError: linksError } = trpc.downloadLinks.publicList.useQuery();

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="A Beautiful Obsession home">
          <span className="wordmark-mark">A</span>
          <span>BEAUTIFUL OBSESSION</span>
        </a>
        <a className="topbar-action" href="#watch">
          <span className="topbar-action-dot" />
          AUTHORISED ACCESS
        </a>
      </header>

      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                CITY STUDIOS / FOUR PART DOCUSERIES
              </div>
              <h1 id="hero-title">
                A <em>BEAUTIFUL</em>
                <br />
                OBSESSION
              </h1>
              <p className="hero-deck">
                An unfiltered look at the final chapter of Pep Guardiola’s era at
                Manchester City—inside the dressing room, the boardroom, and the
                pursuit of a legacy.
              </p>
              <div className="hero-meta" aria-label="Documentary information">
                <span>04 EPISODES</span>
                <span className="meta-divider" />
                <span>PEP’S FINAL CHAPTER</span>
              </div>
              <a className="watch-link" href="#watch">
                <span className="watch-link-icon">
                  <Play aria-hidden="true" fill="currentColor" size={15} />
                </span>
                FIND YOUR FORMAT
                <ArrowDownToLine aria-hidden="true" size={18} />
              </a>
            </div>

            <div className="hero-visual" aria-label="Pep Guardiola and Kevin De Bruyne at Manchester City">
              <div className="hero-image-frame">
                <img src={pepAndKevinImage} alt="Pep Guardiola and Kevin De Bruyne in Manchester City colours" />
              </div>
              <div className="hero-visual-caption">
                <span>THE FINAL TWO SEASONS</span>
                <span>01 / 04</span>
              </div>
              <span className="hero-corner hero-corner-top" aria-hidden="true" />
              <span className="hero-corner hero-corner-bottom" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="download-section" id="watch" aria-labelledby="download-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow eyebrow-dark">
                  <span className="eyebrow-line" />
                  AUTHORISED DISTRIBUTION HUB
                </p>
                <h2 id="download-title">
                  CHOOSE YOUR <em>WAY IN</em>
                </h2>
              </div>
              <p className="section-intro">
                Select a preferred destination. Link availability is managed by
                the site administrator.
              </p>
            </div>

            <div className="delivery-grid">
              {deliveryOptions.map(({ id, label, shortLabel, description, serviceClass, Icon }) => {
                const managedLink = managedLinks?.find(link => link.service === id);
                const linkState = getDeliveryLinkState(managedLink, linksLoading, linksError);
                const isReady = linkState === "ready";
                return (
                <a
                  className={`delivery-card ${serviceClass} ${isReady ? "is-ready" : ""}`}
                  href={isReady ? managedLink?.url : "#link-pending"}
                  onClick={event => {
                    if (!isReady) event.preventDefault();
                  }}
                  target={isReady ? "_blank" : undefined}
                  rel={isReady ? "noreferrer" : undefined}
                  key={id}
                  aria-label={isReady ? `${label} — opens in a new tab` : `${label} — link will be available after the administrator adds it`}
                >
                  <div className="delivery-card-topline">
                    <span className="delivery-number">0{deliveryOptions.findIndex(option => option.id === id) + 1}</span>
                    <ArrowUpRight aria-hidden="true" size={19} />
                  </div>
                  <div className="delivery-service-icon">
                    <Icon aria-hidden="true" size={25} />
                  </div>
                  <div className="delivery-card-copy">
                    <span className="delivery-service-name">{shortLabel}</span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </div>
                  <span className="delivery-pending">{deliveryStateLabel[linkState]}</span>
                </a>
                );
              })}
            </div>

            <div className="access-note" id="link-pending">
              <ShieldCheck aria-hidden="true" size={19} />
              <span>
                {linksError ? (
                  <><strong>Access status unavailable:</strong> the distribution settings could not be read. Please try again shortly.</>
                ) : (
                  <><strong>Distribution notice:</strong> this page is intended for viewers accessing authorised copies. Please use only the link options published by the administrator.</>
                )}
              </span>
            </div>
          </div>
        </section>

        <section className="feature-section" aria-labelledby="feature-title">
          <div className="container feature-grid">
            <div className="feature-image-wrap">
              <div className="feature-image-frame">
                <img src={kevinImage} alt="Kevin De Bruyne in a Manchester City shirt" />
              </div>
              <div className="feature-image-tag">THE LAST DANCE</div>
            </div>
            <div className="feature-copy">
              <p className="eyebrow">
                <span className="eyebrow-line" />
                NOTHING IS ETERNAL
              </p>
              <h2 id="feature-title">
                THE END OF AN <em>ERA,</em>
                <br />
                TOLD FROM WITHIN.
              </h2>
              <p>
                Four episodes. Two pivotal seasons. One club confronting change
                while its defining manager chases every last margin.
              </p>
              <div className="feature-stats">
                <span>
                  <b>04</b>
                  <small>PART SERIES</small>
                </span>
                <span>
                  <b>02</b>
                  <small>SEASONS INSIDE</small>
                </span>
                <span>
                  <b>01</b>
                  <small>FINAL CHAPTER</small>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <a
            className="supporter-credit"
            href="https://www.facebook.com/share/1HmkbUumWA/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={supporterLogo} alt="Cityzens Wing Bangladesh logo" />
            <span>
              <small>DOWNLOAD HUB PRESENTED BY</small>
              <strong>Cityzens Wing Bangladesh</strong>
              <em>Visit on Facebook <ArrowUpRight aria-hidden="true" size={13} /></em>
            </span>
          </a>
          <p className="footer-note">
            A fan-made authorised availability page for <i>A Beautiful Obsession</i>.
            Documentary title and related rights remain with their respective
            rights holders.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <button className="admin-key" type="button" aria-label="Open administrator access guidance">
                <KeyRound aria-hidden="true" size={16} />
                <span>ADMIN</span>
              </button>
            </DialogTrigger>
            <DialogContent className="border-sky-200 bg-[#e7f6fb] text-[#0b2b45] shadow-2xl">
              <DialogHeader>
                <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[.16em] text-sky-700"><KeyRound size={15} />OWNER ACCESS</div>
                <DialogTitle className="font-['Barlow_Condensed'] text-4xl font-bold tracking-tight text-slate-950">THE KEY IS THE ACCOUNT.</DialogTitle>
                <DialogDescription className="text-sm leading-6 text-slate-600">
                  This dashboard is protected by the project owner’s secure sign-in rather than a password embedded in the site.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 rounded-xl border border-sky-100 bg-white/80 p-4 text-sm">
                <p><strong className="mr-2 text-slate-950">Admin route:</strong><code className="rounded bg-sky-50 px-1.5 py-0.5 text-sky-800">{ownerAccessGuidance.route}</code></p>
                <p className="leading-6 text-slate-600">Continue using the account that owns this project. Once signed in as the owner, you can publish or pause each authorized destination.</p>
              </div>
              <a href="/admin" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#08263d] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c3655] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Open link control <ArrowUpRight size={16} /></a>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
}
