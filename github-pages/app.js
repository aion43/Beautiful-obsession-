(() => {
  const services = {
    mega: { label: "Download from Mega", name: "MEGA", description: "High-speed mirror", mark: "M", tint: "mega", hint: "https://mega.nz/..." },
    drive: { label: "Download from Google Drive", name: "GOOGLE DRIVE", description: "Cloud access mirror", mark: "△", tint: "drive", hint: "https://drive.google.com/..." },
    telegram: { label: "Open on Telegram", name: "TELEGRAM", description: "Channel delivery", mark: "➤", tint: "telegram", hint: "https://t.me/..." },
    torrent: { label: "Get Torrent link", name: "TORRENT", description: "Peer-to-peer mirror", mark: "↯", tint: "torrent", hint: "magnet:?xt=..." },
  };
  const order = Object.keys(services);
  const storageKey = "beautiful-obsession-static-links";
  const credentialHash = "ecfe91fccea3d58624f44347786681f9b7e63d00a46b6b6cd146be87320c61fb";

  const configured = window.__BEAUTIFUL_OBSESSION_CONFIG__?.links || [];
  const emptyConfig = () => order.map(service => ({ service, url: "", isEnabled: false }));
  const normalise = links => order.map(service => {
    const link = links?.find(item => item.service === service);
    return link ? { service, url: String(link.url || ""), isEnabled: Boolean(link.isEnabled) } : { service, url: "", isEnabled: false };
  });
  const saved = () => {
    try { return normalise(JSON.parse(localStorage.getItem(storageKey) || "null") || configured); } catch { return normalise(configured); }
  };
  const persist = links => localStorage.setItem(storageKey, JSON.stringify(normalise(links)));

  function makeCard(link, index) {
    const info = services[link.service];
    const enabled = link.isEnabled && link.url;
    const card = document.createElement(enabled ? "a" : "div");
    card.className = `delivery-card ${info.tint}${enabled ? " ready" : ""}`;
    if (enabled) { card.href = link.url; card.target = "_blank"; card.rel = "noreferrer"; }
    card.innerHTML = `<div class="card-line"><span>0${index + 1}</span><span>↗</span></div><b class="service-mark">${info.mark}</b><div><small>${info.name}</small><strong>${info.label}</strong><em>${info.description}</em></div><span class="state">${enabled ? "ACCESS READY" : "ADMIN LINK PENDING"}</span>`;
    return card;
  }

  function renderHome() {
    const grid = document.querySelector("#delivery-grid");
    if (!grid) return;
    grid.replaceChildren(...saved().map(makeCard));
  }

  const digest = async value => {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, "0")).join("");
  };

  function formRow(link, index) {
    const info = services[link.service];
    const article = document.createElement("article");
    article.className = "editor-row";
    article.innerHTML = `<div class="service-label ${info.tint}"><b>0${index + 1}</b><span><strong>${info.name}</strong><small>${info.description}</small></span></div><label>Destination link<input data-url="${link.service}" placeholder="${info.hint}" value="${link.url.replaceAll('"', '&quot;')}" /></label><label class="switch-label"><span data-status="${link.service}">${link.isEnabled ? "Live" : "Paused"}</span><input type="checkbox" data-live="${link.service}" ${link.isEnabled ? "checked" : ""} /><i></i></label>`;
    return article;
  }

  function renderEditor() {
    const form = document.querySelector("#links-form");
    const config = saved();
    form.replaceChildren(...config.map(formRow));
    form.addEventListener("input", event => {
      const service = event.target.dataset.url || event.target.dataset.live;
      if (!service) return;
      const item = config.find(link => link.service === service);
      if (event.target.dataset.url) item.url = event.target.value;
      if (event.target.dataset.live) item.isEnabled = event.target.checked;
      const status = form.querySelector(`[data-status="${service}"]`);
      if (status) status.textContent = item.isEnabled ? "Live" : "Paused";
      persist(config);
    });
    document.querySelector("#download-config").addEventListener("click", () => {
      const content = `window.__BEAUTIFUL_OBSESSION_CONFIG__ = ${JSON.stringify({ links: saved() }, null, 2)};\n`;
      const blob = new Blob([content], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      const anchor = Object.assign(document.createElement("a"), { href: url, download: "site-config.js" });
      anchor.click();
      URL.revokeObjectURL(url);
    });
  }

  function renderAdmin() {
    const login = document.querySelector("#login-view");
    const editor = document.querySelector("#editor-view");
    const unlock = () => { login.classList.add("hidden"); editor.classList.remove("hidden"); renderEditor(); };
    if (sessionStorage.getItem("beautiful-obsession-admin") === "ok") return unlock();
    document.querySelector("#login-form").addEventListener("submit", async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const actual = await digest(`${form.get("username")}:${form.get("password")}:beautiful-obsession-static`);
      if (actual !== credentialHash) {
        document.querySelector("#login-error").textContent = "The username or password is not recognised.";
        return;
      }
      sessionStorage.setItem("beautiful-obsession-admin", "ok");
      unlock();
    });
  }

  if (document.body.dataset.page === "home") renderHome();
  if (document.body.dataset.page === "admin") renderAdmin();
})();
