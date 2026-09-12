// A cloud-backed collection. Only the Worker decides what has been earned.
(function () {
  "use strict";
  if (window.MkRewards || window.__mkExamMode) return;
  const apiBase = String((window.MkHotTrack && window.MkHotTrack.apiBase) || window.MKDOCS_HOT_API_BASE || "https://hot.eor-wiki.workers.dev").replace(/\/+$/, "");
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const number = value => Math.max(0, Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const key = () => String(window.MkLocalActivity?.getProfile?.()?.accountKey || "").replace(/^user:/i, "").trim().toLowerCase();
  const visitor = () => window.MkEC?.getVisitorId?.() || "";
  const enabled = () => !window.__mkExamMode && window.MkStartupPrefs?.isEnabled?.("account") !== false;
  const earned = item => item.earned === true || Number(item.earnedAt) > 0;
  const fraction = item => Math.min(1, Math.max(0, (Number(item.progress) || 0) / Math.max(1, Number(item.target) || 1)));
  // Legacy servers may still call rarer personal achievements "badge". This
  // presentation grouping never rewrites their stable IDs, rarity or ownership.
  const collectionKind = item => item.kind === "honor" ? "honor" : "achievement";
  const kindLabel = item => collectionKind(item) === "honor" ? "Monthly honour" : "Personal achievement";
  const monthLabel = value => /^\d{4}-\d{2}$/.test(String(value)) ? new Date(value + "-01T00:00:00Z").toLocaleDateString("en", { month: "long", year: "numeric", timeZone: "UTC" }) : "Monthly honour";
  const boardNames = { users: "XP champion", quiz_correct: "Quiz champion", mastery_explorers: "Mastery champion", spenders: "EORbits champion" };
  let current = null, sequence = 0, timer = 0, lastCheck = 0, inFlight = null, lastData = null, queuedCheck = false;
  const seen = new Map();
  const glyphs = {
    compass: '<circle cx="32" cy="32" r="19"/><path d="m40 24-5 11-11 5 5-11Z"/>',
    book: '<path d="M32 19c-7-5-13-5-21-3v29c8-2 14-2 21 3 7-5 13-5 21-3V16c-8-2-14-2-21 3Zm0 0v29"/>',
    star: '<path d="m32 10 6.5 14 15.5 2-11.5 11 3 16-13.5-8-13.5 8 3-16L10 26l15.5-2Z"/>',
    spark: '<path d="m32 10 6 16 16 6-16 6-6 16-6-16-16-6 16-6Z"/><path d="m49 11 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/>',
    crown: '<path d="m12 23 9 7 11-15 11 15 9-7-5 23H17Z"/><path d="M18 52h28"/>',
    flame: '<path d="M35 9c1 14-12 13-9 27 4-1 8-6 8-10 14 11 15 20 7 26-11 9-28 0-26-14 1-9 10-13 11-20 1 4 3 6 4 6 4-4 5-9 5-15Z"/>',
    gem: '<path d="m18 15-9 14 23 25 23-25-9-14Z"/><path d="M9 29h46M18 15l8 14 6 25 6-25 8-14M26 29l6-14 6 14"/>',
    quiz: '<path d="M19 13h26v40H19Z"/><path d="m25 24 3 3 6-7M36 25h4m-15 12 3 3 6-7M36 38h4"/>',
    map: '<path d="m10 19 15-6 14 6 15-6v33l-15 6-14-6-15 6Zm15-6v33m14-27v33"/>',
    heart: '<path d="M32 51 13 32C1 18 21 6 32 21 43 6 63 18 51 32Z"/>',
    sun: '<circle cx="32" cy="32" r="12"/><path d="M32 7v6m0 38v6M7 32h6m38 0h6M14 14l5 5m26 26 5 5m0-36-5 5M19 45l-5 5"/>',
    trophy: '<path d="M20 12h24v13c0 17-24 17-24 0Zm0 5H11v5c0 8 5 12 12 12m21-17h9v5c0 8-5 12-12 12M32 38v13m-12 3h24"/>',
    path: '<path d="M15 49h22a10 10 0 0 0 0-20H26a8 8 0 0 1 0-16h20M39 7l7 6-7 6"/><circle cx="15" cy="49" r="4"/>',
  };
  function medal(item, extra = "") {
    const rarity = ["common", "uncommon", "rare", "epic", "legendary"].includes(item.rarity) ? item.rarity : item.kind === "badge" ? "rare" : "common";
    const icon = item.kind === "honor" ? "trophy" : (glyphs[item.icon] ? item.icon : item.kind === "badge" ? "gem" : "compass");
    const count = item.kind === "honor" ? Math.max(1, Number(item.count) || 1) : 1;
    const art = '<svg viewBox="0 0 100 112" fill="none"><path class="rw-ribbon" d="m27 72-8 33 20-9 11 13 11-13 20 9-8-33"/><path class="rw-medal-edge" d="m50 3 13 6 14 2 8 12 10 10-1 15 1 14-10 11-8 12-14 2-13 6-13-6-14-2-8-12L5 62l1-14-1-15 10-10 8-12 14-2Z"/><circle class="rw-medal-face" cx="50" cy="48" r="34"/><circle class="rw-medal-ring" cx="50" cy="48" r="29"/><g class="rw-medal-glyph" transform="translate(24 22) scale(.8125)" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' + glyphs[icon] + '</g><path class="rw-glint" d="m24 26 6-6m44 50-6 6"/></svg>';
    return `<span class="rw-medal rw-medal--${rarity} ${earned(item) ? "is-earned" : "is-locked"} ${count > 1 ? "rw-medal-stack" : ""} ${extra}" aria-hidden="true">${count > 2 ? `<span class="rw-medal-layer rw-medal-layer--right">${art}</span>` : ""}${count > 1 ? `<span class="rw-medal-layer rw-medal-layer--left">${art}</span>` : ""}${art}${count > 1 ? `<span class="rw-medal-count">×${number(count)}</span>` : ""}</span>`;
  }
  function honorItem(honor) {
    return { ...honor, id: `honor:${honor.metric}:${honor.month}`, kind: "honor", rarity: "legendary", title: boardNames[honor.metric] || "Monthly champion", description: monthLabel(honor.month), earned: true, earnedAt: honor.awardedAt || honor.earnedAt, icon: "trophy" };
  }
  function groupedHonors(honors) {
    const groups = new Map();
    for (const row of honors || []) {
      if (!row || !Object.hasOwn(boardNames, row.metric) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(row.month || "")) continue;
      if (!groups.has(row.metric)) groups.set(row.metric, new Map());
      groups.get(row.metric).set(row.month, row);
    }
    return [...groups].map(([metric, months]) => {
      const rows = [...months.values()].sort((a, b) => b.month.localeCompare(a.month));
      return { ...honorItem(rows[0]), id: `honor:${metric}`, count: rows.length, months: rows.map(row => row.month), earnedAt: Math.max(...rows.map(row => Number(row.awardedAt || row.earnedAt) || 0)), description: `${rows.length} monthly ${rows.length === 1 ? "honour" : "honours"}` };
    });
  }
  const collectionItems = data => data.items.concat(groupedHonors(data.honors));
  function featuredId(id, data) {
    if (typeof id !== "string") return null;
    const legacy = /^honor:([^:]+):(\d{4}-(?:0[1-9]|1[0-2]))$/.exec(id);
    if (legacy) {
      if (!data.honors.some(row => row?.metric === legacy[1] && row.month === legacy[2])) return null;
      id = `honor:${legacy[1]}`;
    }
    return collectionItems(data).some(item => item.id === id && earned(item)) ? id : null;
  }
  function featuredIds(ids, data) {
    return [...new Set((ids || []).map(id => featuredId(id, data)).filter(Boolean))];
  }
  async function request(path, body, signal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, 25000);
    try {
      const response = await fetch(apiBase + path, { method: body ? "POST" : "GET", cache: "no-store", signal: controller.signal, ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) });
      const data = await response.json();
      if (!response.ok || !data || data.ok === false) throw new Error(data?.error || "Collection could not be loaded.");
      return data;
    } finally { clearTimeout(timeout); signal?.removeEventListener("abort", abort); }
  }
  function normalise(data) {
    return { ...data, items: Array.isArray(data.items) ? data.items : [], honors: Array.isArray(data.honors) ? data.honors : [], featured: Array.isArray(data.featured) ? data.featured : [], newlyEarned: Array.isArray(data.newlyEarned) ? data.newlyEarned : [] };
  }
  function validItems(items) {
    return Array.isArray(items) && items.every(item => item && typeof item.id === "string" && typeof item.title === "string" && Number.isFinite(Number(item.target)) && Number(item.target) > 0);
  }
  function validState(data, account) {
    return String(data?.accountKey || "").toLowerCase() === account && validItems(data.items) && Array.isArray(data.honors) && Array.isArray(data.featured) && Array.isArray(data.newlyEarned);
  }
  function rememberUnlocks(data, account, celebrate) {
    let known = seen.get(account);
    if (!known) {
      try { known = new Set(JSON.parse(localStorage.getItem("mk_rewards_seen_v1:" + account) || "[]")); } catch (_) { known = new Set(); }
      seen.set(account, known);
    }
    // A scheduled reconciliation or another device may have awarded these.
    // Celebrate the first discovery here, not only this request's INSERTs.
    const collected = data.items.filter(earned).concat(data.honors.map(honorItem));
    const fresh = collected.filter(item => !known.has(item.id));
    collected.forEach(item => known.add(item.id));
    try { localStorage.setItem("mk_rewards_seen_v1:" + account, JSON.stringify([...known].slice(-500))); } catch (_) {}
    if (celebrate && fresh.length) celebrateUnlocks(fresh, account);
  }
  function celebrateUnlocks(items, account) {
    if (current && current.account === account) {
      current.dialog.querySelector(".rw-unlocks")?.remove();
      const banner = document.createElement("div");
      banner.className = "rw-unlocks";
      banner.setAttribute("role", "status");
      banner.innerHTML = `${medal({ ...items[0], earned: true })}<div><span class="rw-eyebrow">${items.length > 1 ? `${items.length} new discoveries` : "Collection unlocked"}</span><strong>${esc(items[0].title)}${items.length > 1 ? ` + ${items.length - 1} more` : ""}</strong><span>Yours to keep. Take a moment to enjoy it.</span></div>`;
      current.dialog.querySelector(".rw-status-row").after(banner);
      return;
    }
    document.querySelector(".rw-toast")?.remove();
    const toast = document.createElement("aside");
    toast.className = "rw-toast";
    toast.innerHTML = `${medal({ ...items[0], earned: true })}<div role="status" aria-live="polite"><span class="rw-eyebrow">${items.length > 1 ? `${items.length} new discoveries` : "Collection unlocked"}</span><strong>${esc(items[0].title)}${items.length > 1 ? ` + ${items.length - 1} more` : ""}</strong><span>Small steps. Something to keep.</span></div><button type="button" class="rw-button" data-view>View</button><button type="button" class="rw-icon-button" data-dismiss aria-label="Dismiss unlock notification">×</button>`;
    document.body.appendChild(toast);
    let expiry = 0;
    const dismiss = () => { clearTimeout(expiry); toast.remove(); };
    const resume = () => { clearTimeout(expiry); expiry = setTimeout(() => {
      if (toast.contains(document.activeElement) || toast.matches(":hover")) { resume(); return; }
      dismiss();
    }, 14000); };
    const pause = () => clearTimeout(expiry);
    toast.addEventListener("focusin", pause);
    toast.addEventListener("pointerenter", pause);
    toast.addEventListener("focusout", resume);
    toast.addEventListener("pointerleave", resume);
    resume();
    toast.querySelector("[data-dismiss]").onclick = dismiss;
    toast.querySelector("[data-view]").onclick = () => { dismiss(); if (key() === account) open(); };
  }
  function close() {
    if (!current) return;
    const ui = current;
    current = null;
    sequence += 1;
    ui.controller.abort();
    ui.arenaDispose?.();
    if (ui.arenaReady) window.removeEventListener("mk-arena-ready", ui.arenaReady);
    ui.detail?.close(); ui.detail?.remove();
    ui.dialog.close(); ui.dialog.remove();
    if (ui.opener?.isConnected) ui.opener.focus({ preventScroll: true });
  }
  function live(ui) { return enabled() && current === ui && ui.dialog.isConnected && key() === ui.account; }
  function status(ui, message, error = false) {
    const node = ui.dialog.querySelector(".rw-status");
    node.textContent = message;
    node.classList.toggle("is-error", error);
  }
  function collectionCard(item, featured) {
    const isEarned = earned(item);
    return `<button type="button" class="rw-card ${isEarned ? "is-earned" : "is-locked"}" data-reward-id="${esc(item.id)}" aria-label="${esc(item.title)}, ${isEarned ? "earned" : `${number(item.progress)} of ${number(item.target)}`}${item.count > 1 ? `, collected ${item.count} times` : ""}${featured ? ", featured" : ""}"><span class="rw-card-top"><span>${kindLabel(item)} · ${esc(item.rarity || "common")}</span><span>${featured ? "★ Featured" : isEarned ? "✓ Collected" : "To discover"}</span></span>${medal(item)}<strong>${esc(item.title)}</strong><span class="rw-card-description">${esc(item.description)}</span><span class="rw-card-progress"><span>${isEarned ? "Yours to keep" : `${number(item.progress)} / ${number(item.target)}`}</span><span class="rw-progress-track" aria-hidden="true"><i style="width:${isEarned ? 100 : Math.round(fraction(item) * 100)}%"></i></span></span></button>`;
  }
  function render(ui) {
    if (!live(ui)) return;
    const data = ui.data;
    const arenaOnly = ui.kind === "arena";
    if (ui.arenaHost) ui.arenaHost.hidden = !["all", "arena"].includes(ui.kind);
    for (const selector of [".rw-filters", ".rw-results-count", ".rw-grid"]) ui.dialog.querySelector(selector).hidden = arenaOnly;
    const all = collectionItems(data);
    const pins = featuredIds(data.featured, data);
    const counts = { achievement: data.items.filter(earned).length, honor: groupedHonors(data.honors).reduce((sum, item) => sum + item.count, 0) };
    ui.dialog.querySelector(".rw-counts").hidden = !ui.loaded;
    ui.dialog.querySelector(".rw-counts").innerHTML = Object.entries(counts).map(([kind, count]) => `<div><strong>${number(count)}</strong><span>${kind === "achievement" ? "Personal achievements" : "Monthly honours"}</span></div>`).join("");
    const featured = pins.map(id => all.find(item => item.id === id && earned(item))).filter(Boolean).slice(0, 3);
    ui.dialog.querySelector(".rw-showcase-items").innerHTML = Array.from({ length: 3 }, (_, i) => featured[i] ? `<button type="button" class="rw-showcase-slot is-filled" data-reward-id="${esc(featured[i].id)}" aria-label="${esc(featured[i].title)}${featured[i].count > 1 ? `, collected ${featured[i].count} times` : ""}">${medal(featured[i])}<strong>${esc(featured[i].title)}</strong><span>Featured on your profile</span></button>` : '<div class="rw-showcase-slot"><span class="rw-empty-medal" aria-hidden="true">✧</span><strong>A space for your story</strong><span>Choose a collected reward below</span></div>').join("");
    ui.dialog.querySelector(".rw-showcase").hidden = !ui.account || !ui.loaded;
    const filtered = all.filter(item => (ui.kind === "all" || collectionKind(item) === ui.kind) && (ui.category === "all" || item.category === ui.category) && (ui.filter === "all" || (ui.filter === "earned" ? earned(item) : !earned(item))) && (!ui.query || `${item.title} ${item.description}`.toLowerCase().includes(ui.query.toLowerCase())));
    const emptyHonors = ui.kind === "honor" && !data.honors.length;
    filtered.sort((a, b) => ui.sort === "name" ? String(a.title).localeCompare(String(b.title)) : ui.sort === "recent" ? (Number(b.earnedAt) || 0) - (Number(a.earnedAt) || 0) : Number(earned(a)) - Number(earned(b)) || fraction(b) - fraction(a) || String(a.id).localeCompare(String(b.id)));
    const resultLabel = ui.kind === "honor" ? "monthly honour type" : ui.kind === "achievement" ? "personal achievement" : "reward";
    ui.dialog.querySelector(".rw-results-count").textContent = ui.loaded ? `${filtered.length} ${resultLabel}${filtered.length === 1 ? "" : "s"}` : "";
    ui.dialog.querySelector(".rw-grid").innerHTML = arenaOnly ? "" : !ui.loaded ? `<div class="rw-empty"><h3>${ui.loadError ? "Collection unavailable" : "Loading your collection…"}</h3><p>${ui.loadError ? "We could not check your rewards. Try Refresh again." : "Your saved rewards will appear once the service responds."}</p></div>` : filtered.map(item => collectionCard(item, pins.includes(item.id))).join("") || `<div class="rw-empty"><span aria-hidden="true">✧</span><h3>${emptyHonors ? "The next chapter is still being written" : "Nothing in this view yet"}</h3><p>${emptyHonors ? `Monthly honours recognise the leaders of completed UTC calendar months. Winners are saved after at least 48 hours, once synced results have been checked. Tied leaders share the honour.` : "Try a different filter, or take your next small learning step."}</p></div>`;
    ui.dialog.querySelectorAll("[data-kind]").forEach(button => { button.setAttribute("aria-pressed", String(button.dataset.kind === ui.kind)); });
    const next = data.items.filter(item => !earned(item)).sort((a, b) => fraction(b) - fraction(a))[0];
    const nextHost = ui.dialog.querySelector(".rw-next");
    nextHost.hidden = !ui.account || !next;
    if (next) nextHost.innerHTML = `<span class="rw-eyebrow">Your next discovery</span><strong>${esc(next.title)}</strong><span>${esc(next.description)}</span><span>${number(next.progress)} / ${number(next.target)}</span><button type="button" class="rw-button" data-reward-id="${esc(next.id)}">See the reward <span aria-hidden="true">↗</span></button>`;
  }
  function updateData(ui, input) {
    ui.data = normalise(input);
    ui.loaded = true; ui.loadError = false;
    const category = ui.dialog.querySelector('[data-filter="category"]');
    const categories = [...new Set(ui.data.items.map(item => item.category).filter(Boolean))].sort();
    category.innerHTML = '<option value="all">Every collection</option>' + categories.map(value => `<option value="${esc(value)}">${esc(value.replace(/_/g, " "))}</option>`).join("");
    category.value = categories.includes(ui.category) ? ui.category : "all";
    ui.category = category.value;
    render(ui);
  }
  async function refresh(ui) {
    ui.loadError = false; render(ui);
    const generation = ++ui.generation;
    status(ui, ui.account ? "Checking your collection…" : "Exploring the collection…");
    ui.dialog.querySelector("[data-refresh]").setAttribute("aria-busy", "true");
    try {
      const raw = ui.account ? await request("/rewards/reconcile", { visitorId: visitor(), accountKey: ui.account }, ui.controller.signal) : await request("/rewards/catalog", null, ui.controller.signal);
      if (!live(ui) || generation !== ui.generation) return;
      if (ui.account ? !validState(raw, ui.account) : !validItems(raw.items)) throw new Error("Incomplete collection response.");
      const data = normalise(raw);
      if (ui.account) { lastData = data; rememberUnlocks(data, ui.account, true); }
      updateData(ui, data);
      status(ui, ui.account ? "Up to date with your cloud learning. Earned rewards stay in your collection." : "A collection worth growing. Save an account in My → Account to start yours.");
    } catch (_) {
      if (live(ui) && generation === ui.generation) { ui.loadError = true; render(ui); status(ui, "The collection could not refresh. Your saved rewards are safe. Try Refresh again.", true); }
    } finally {
      if (live(ui) && generation === ui.generation) ui.dialog.querySelector("[data-refresh]").removeAttribute("aria-busy");
    }
  }
  function openDetail(ui, id) {
    const item = collectionItems(ui.data).find(value => value.id === id);
    if (!item || !live(ui)) return;
    ui.detail?.close(); ui.detail?.remove();
    const dialog = document.createElement("dialog");
    ui.detail = dialog;
    dialog.className = "rw-detail";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "rw-detail-title");
    const isEarned = earned(item), isFeatured = featuredIds(ui.data.featured, ui.data).includes(item.id);
    dialog.innerHTML = `<button type="button" class="rw-icon-button rw-detail-close" aria-label="Close reward details">×</button><span class="rw-eyebrow">${esc(item.rarity || "common")} · ${kindLabel(item)}</span>${medal(item)}<h2 id="rw-detail-title">${esc(item.title)}</h2><p>${esc(item.description)}</p><p class="rw-detail-date">${isEarned ? `Collected${Number(item.earnedAt) > 0 ? ` on ${esc(new Date(Number(item.earnedAt)).toLocaleDateString())}` : ""} · Yours to keep` : `${number(item.progress)} of ${number(item.target)} · Keep going at your own pace`}</p>${item.kind !== "honor" ? `<progress max="${Math.max(1, Number(item.target) || 1)}" value="${isEarned ? Math.max(1, Number(item.target) || 1) : Math.max(0, Number(item.progress) || 0)}" aria-label="Progress towards ${esc(item.title)}"></progress>` : `<div class="rw-detail-months"><h3>Awarded months</h3><ul>${item.months.map(month => `<li>${esc(monthLabel(month))}</li>`).join("")}</ul></div>`}<p class="rw-detail-status" role="status" aria-live="polite">${ui.account && isEarned ? "Choose up to three collected rewards for your public profile. Visibility follows your privacy choices." : "Rewards recognise your synced wiki activity. No purchase is needed to explore and learn."}</p>${ui.account && isEarned ? `<button type="button" class="rw-button rw-button-primary" data-feature>${isFeatured ? "Remove from showcase" : "Feature on my profile"}</button>` : ""}`;
    document.body.appendChild(dialog);
    const dismiss = () => {
      dialog.close(); dialog.remove();
      if (ui.detail === dialog) ui.detail = null;
      if (live(ui)) Array.from(ui.dialog.querySelectorAll("[data-reward-id]")).find(node => node.dataset.rewardId === item.id)?.focus({ preventScroll: true });
    };
    dialog.querySelector(".rw-detail-close").onclick = dismiss;
    dialog.addEventListener("cancel", event => { event.preventDefault(); dismiss(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss(); } });
    dialog.showModal();
    const button = dialog.querySelector("[data-feature]");
    if (button) button.onclick = async () => {
      if (!live(ui) || ui.saving) return;
      const ids = featuredIds(ui.data.featured, ui.data).filter(value => value !== item.id);
      if (!isFeatured) ids.push(item.id);
      const feedback = dialog.querySelector(".rw-detail-status");
      if (ids.length > 3) { feedback.textContent = "Your showcase has three rewards. Remove one first to make room for this one."; return; }
      ui.saving = true;
      // A previously started refresh must not undo this newer showcase write.
      ui.generation += 1;
      ui.dialog.querySelector("[data-refresh]").removeAttribute("aria-busy");
      button.setAttribute("aria-busy", "true");
      feedback.textContent = "Saving your showcase…";
      try {
        const data = await request("/rewards/featured", { visitorId: visitor(), accountKey: ui.account, ids }, ui.controller.signal);
        if (!live(ui)) return;
        if (String(data.accountKey || "").toLowerCase() !== ui.account || !Array.isArray(data.featured) || data.featured.length > 3 || new Set(data.featured).size !== data.featured.length || data.featured.some(id => featuredId(id, ui.data) !== id)) throw new Error("Incomplete showcase response.");
        ui.data.featured = data.featured;
        render(ui);
        // Refresh an already-open self profile using only its server-filtered
        // public items. The owner's private progress never enters that surface.
        document.querySelectorAll("[data-rw-profile-account]").forEach(host => {
          const mounted = host.__rwProfile;
          if (!mounted || !mounted.options.self || host.dataset.rwProfileAccount !== ui.account) return;
          const allowed = new Set(collectionItems(normalise(mounted.data)).filter(earned).map(item => item.id));
          const replacesOpener = ui.opener && host.contains(ui.opener);
          mountProfile(host, { ...mounted.data, featured: data.featured.filter(id => allowed.has(id)) }, mounted.options);
          if (replacesOpener) ui.opener = host.querySelector("[data-collection]") || ui.opener;
        });
        if (dialog.isConnected) { dismiss(); status(ui, "Showcase saved. Your profile follows your privacy settings."); }
      } catch (_) { if (live(ui) && dialog.isConnected) feedback.textContent = "Your showcase could not be saved. Please try again."; }
      finally { ui.saving = false; if (dialog.isConnected) button.removeAttribute("aria-busy"); }
    };
  }
  function open() {
    if (!enabled()) return;
    close();
    const dialog = document.createElement("dialog");
    dialog.className = "rw-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "rw-title");
    dialog.innerHTML = `<div class="rw-shell"><header class="rw-header"><div><span class="rw-eyebrow">The learning collection</span><h1 id="rw-title">Your learning collection</h1></div><button type="button" class="rw-icon-button" data-close aria-label="Close collection">×</button></header><div class="rw-scroll"><section class="rw-hero"><div><span class="rw-eyebrow">A little progress. A lasting keepsake.</span><h2>Your learning,<br>collected.</h2><p>Personal milestones at your own pace.<br>Monthly and Arena honours for friendly competition.</p><div class="rw-counts"></div></div><div class="rw-hero-art" aria-hidden="true">${medal({ kind: "achievement", rarity: "epic", icon: "compass", earned: true })}${medal({ kind: "honor", rarity: "legendary", earned: true })}${medal({ rarity: "rare", icon: "book", earned: true })}</div></section><div class="rw-status-row"><p class="rw-status" role="status" aria-live="polite"></p><button type="button" class="rw-button" data-refresh>↻ Refresh</button></div><section class="rw-showcase" aria-label="Your profile showcase"><div class="rw-section-heading"><h2>The showcase</h2><span>Three places. Your favourite milestones.</span></div><div class="rw-showcase-items"></div></section><section class="rw-next" aria-label="Suggested next reward" hidden></section><section class="rw-catalog" aria-label="Reward collection"><div class="rw-collection-tabs" role="group" aria-label="Reward type"><button type="button" data-kind="all" aria-pressed="true">Everything</button><button type="button" data-kind="achievement" aria-pressed="false">Personal achievements</button><button type="button" data-kind="honor" aria-pressed="false">Monthly honours</button><button type="button" data-kind="arena" aria-pressed="false">Arena honours</button></div><div class="rw-filters"><label><span>Search collection</span><input type="search" placeholder="Find a reward…" data-search></label><label><span>Collection</span><select data-filter="category"><option value="all">Every collection</option></select></label><label><span>Progress</span><select data-filter="filter"><option value="all">All progress</option><option value="earned">Collected</option><option value="locked">Still to discover</option></select></label><label><span>Sort</span><select data-filter="sort"><option value="next">Closest first</option><option value="recent">Recently collected</option><option value="name">Name A–Z</option></select></label></div><p class="rw-results-count" aria-live="polite"></p><div class="rw-grid"></div></section><details class="rw-rules"><summary>How the collection works</summary><p>Personal achievements celebrate your learning milestones, from first steps to bigger challenges. They share one collection, with rarity ranging from common to legendary. Earn them at your own pace, without competing for a rank.</p><p>Monthly honours are competitive awards for the leaders of completed UTC calendar months, with at least 48 hours for cloud sync and shared trophies for ties. A month stays open until all synced results are checked; once awarded, its honours are permanent.</p><p>Your cloud learning unlocks rewards automatically. Earned rewards are kept even if you later revise your self-ratings. Public displays respect the privacy of the learning behind each reward. Older activity only counts where reliable records exist; missing history never becomes an invented award.</p><p>There is no deadline on personal achievements and no penalty for taking a break. Wiki activity and self-ratings are learning records, not academic certifications. These rewards do not add XP or spendable EORbits.</p></details></div></div>`;
    const ui = { dialog, account: key(), opener: document.activeElement, controller: new AbortController(), generation: 0, data: normalise({}), kind: "all", category: "all", filter: "all", sort: "next", query: "", saving: false, loaded: false, loadError: false };
    current = ui; sequence += 1;
    document.body.appendChild(dialog);
    const arenaHost = document.createElement("section");
    arenaHost.className = "rw-arena-collection";
    arenaHost.setAttribute("aria-label", "Arena competition honours");
    dialog.querySelector(".rw-catalog").appendChild(arenaHost); ui.arenaHost = arenaHost;
    const arenaPlaceholder = failed => {
      arenaHost.innerHTML = '<div class="rw-arena-state"><h3>' + (failed ? 'Arena honours could not be opened' : 'Loading Arena honours…') + '</h3><p role="status">' + (failed ? 'Try again to connect to your competition collection.' : 'The competition module is not ready yet. Your honours will appear once it loads.') + '</p><button type="button" class="rw-button" data-arena-retry>Try again</button></div>';
      arenaHost.querySelector("[data-arena-retry]").onclick = () => ui.arenaReady();
    };
    arenaPlaceholder(false);
    ui.arenaReady = () => {
      if (!live(ui) || ui.arenaMounted) return;
      if (!window.MkArena?.mountCollection) { arenaPlaceholder(false); return; }
      arenaHost.innerHTML = "";
      try {
        const dispose = window.MkArena.mountCollection(arenaHost);
        if (typeof dispose === "function") ui.arenaDispose = dispose;
        ui.arenaMounted = true;
      } catch (_) { arenaPlaceholder(true); }
      render(ui);
    };
    window.addEventListener("mk-arena-ready", ui.arenaReady);
    ui.arenaReady();
    dialog.querySelector("[data-close]").onclick = close;
    dialog.addEventListener("cancel", event => { event.preventDefault(); close(); });
    dialog.querySelector("[data-refresh]").onclick = () => { if (!ui.saving) refresh(ui); };
    dialog.addEventListener("click", event => {
      const reward = event.target.closest("[data-reward-id]");
      if (reward) openDetail(ui, reward.dataset.rewardId);
      const tab = event.target.closest("[data-kind]");
      if (tab) {
        ui.kind = tab.dataset.kind;
        ui.category = "all";
        ui.filter = "all";
        ui.query = "";
        dialog.querySelector('[data-filter="category"]').value = "all";
        dialog.querySelector('[data-filter="filter"]').value = "all";
        dialog.querySelector('[data-search]').value = "";
        render(ui);
        if (ui.kind === "arena") ui.arenaHost?.scrollIntoView?.({ block: "start" });
      }
    });
    dialog.querySelector("[data-search]").addEventListener("input", event => { ui.query = event.target.value; render(ui); });
    dialog.querySelector(".rw-collection-tabs").addEventListener("focusin", event => {
      event.target.closest("[data-kind]")?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    });
    dialog.querySelectorAll("[data-filter]").forEach(select => select.addEventListener("change", () => { ui[select.dataset.filter] = select.value; render(ui); }));
    dialog.showModal();
    render(ui);
    refresh(ui);
    return dialog;
  }
  function mountProfile(host, data, options = {}) {
    if (!host) return;
    host.querySelector(".rw-profile")?.remove();
    delete host.__rwProfile;
    if (!data || data.visible === false) return;
    host.__rwProfile = { data, options };
    host.dataset.rwProfileAccount = String(options.accountKey || (options.self ? key() : "")).toLowerCase();
    if (data.unavailable) {
      const note = document.createElement("p");
      note.className = "rw-profile";
      note.textContent = "This collection is temporarily unavailable. Try reopening the profile in a moment.";
      host.prepend(note);
      return note;
    }
    const state = normalise(data);
    const items = state.items.filter(earned);
    const honors = groupedHonors(state.honors);
    const all = items.concat(honors);
    const honorCount = honors.reduce((sum, item) => sum + item.count, 0);
    const selected = featuredIds(state.featured, state).map(id => all.find(item => item.id === id)).filter(Boolean).slice(0, 3);
    const shown = selected.length ? selected : all.slice(0, 3);
    const remaining = all.filter(item => !shown.some(visible => visible.id === item.id));
    if (!shown.length && !honors.length && !options.self) return;
    const section = document.createElement("section");
    section.className = "rw-profile";
    section.setAttribute("aria-label", "Achievements and honours");
    const profileCard = item => `<div class="rw-profile-medal">${medal(item)}<strong>${esc(item.title)}</strong><span>${esc(item.description)}</span>${item.kind === "honor" ? `<details class="rw-profile-months"><summary>Awarded months</summary><ul>${item.months.map(month => `<li>${esc(monthLabel(month))}</li>`).join("")}</ul></details>` : ""}</div>`;
    section.innerHTML = `<div class="rw-profile-heading"><h3>Achievements & honours</h3><span>${items.length} personal ${items.length === 1 ? "achievement" : "achievements"}${honorCount ? ` · ${honorCount} monthly ${honorCount === 1 ? "honour" : "honours"}` : ""}</span></div>${shown.length ? `<div class="rw-profile-medals">${shown.map(profileCard).join("")}</div>` : ""}${options.self ? '<button type="button" class="rw-button" data-collection>Open my collection ↗</button>' : ""}`;
    if (remaining.length) {
      const more = document.createElement("details");
      more.className = "rw-profile-more";
      more.innerHTML = `<summary>Explore all ${all.length} collected rewards</summary><div class="rw-profile-medals">${remaining.map(profileCard).join("")}</div>`;
      section.appendChild(more);
    }
    host.prepend(section);
    section.querySelector("[data-collection]")?.addEventListener("click", open);
    return section;
  }
  async function checkUnlocks() {
    const account = key();
    if (!enabled() || !account || document.hidden || current) return;
    if (inFlight) { queuedCheck = true; return; }
    const remaining = 60000 - (Date.now() - lastCheck);
    if (remaining > 0) { clearTimeout(timer); timer = setTimeout(checkUnlocks, remaining + 50); return; }
    lastCheck = Date.now();
    const generation = sequence;
    const controller = new AbortController();
    inFlight = controller;
    try {
      const raw = await request("/rewards/reconcile", { visitorId: visitor(), accountKey: account }, controller.signal);
      if (!enabled() || key() !== account || generation !== sequence || !validState(raw, account)) return;
      const data = normalise(raw);
      lastData = data;
      rememberUnlocks(data, account, true);
    } catch (_) { /* An unavailable reward service must never interrupt learning. */ }
    finally {
      if (inFlight === controller) {
        inFlight = null;
        if (queuedCheck) { queuedCheck = false; scheduleCheck(); }
      }
    }
  }
  function scheduleCheck(event) {
    if (event?.type === "mk-account-sync-complete" && event.detail?.ok === false) return;
    if (event && event.type === "mk-local-activity-change" && !["cloud-sync", "cloud-sync-mastery", "cloud-sync-json", "account-xp"].includes(event.detail?.type)) return;
    clearTimeout(timer);
    timer = setTimeout(checkUnlocks, 1800);
  }
  function resetAccount() {
    close();
    sequence += 1;
    clearTimeout(timer);
    inFlight?.abort(); inFlight = null;
    lastCheck = 0; lastData = null; queuedCheck = false;
    document.querySelector(".rw-toast")?.remove();
  }
  window.addEventListener("mk-local-activity-change", scheduleCheck);
  window.addEventListener("mk-account-sync-complete", scheduleCheck);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleCheck(); });
  window.addEventListener("mk-account-login-change", resetAccount);
  window.addEventListener("mk-account-workspace-changed", resetAccount);
  window.addEventListener("storage", () => {
    if (!enabled() || (current && key() !== current.account) || (lastData && key() !== String(lastData.accountKey || "").toLowerCase())) resetAccount();
  });
  window.addEventListener("mk:startup-features-loaded", () => { if (!enabled()) resetAccount(); });
  window.addEventListener("pagehide", resetAccount);
  window.MkRewards = { open, close, mountProfile, medal, honorItem };
})();
