// A cloud-backed collection. Only the Worker decides what has been earned.
(function () {
  "use strict";
  if (window.MkRewards || window.__mkExamMode) return;
  const apiBase = String((window.MkHotTrack && window.MkHotTrack.apiBase) || window.MKDOCS_HOT_API_BASE || "https://hot.eor-wiki.workers.dev").replace(/\/+$/, "");
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // QA-088: the shared en-GB formatter from account-core.js.
  const number = value => window.MkNumberFormat ? window.MkNumberFormat.decimal(Math.max(0, Number(value) || 0)) : Math.max(0, Number(value) || 0).toLocaleString("en-GB", { maximumFractionDigits: 1 });
  const key = () => String(window.MkLocalActivity?.getProfile?.()?.accountKey || "").replace(/^user:/i, "").trim().toLowerCase();
  const visitor = () => window.MkEC?.getVisitorId?.() || "";
  const enabled = () => !window.__mkExamMode && window.MkStartupPrefs?.isEnabled?.("account") !== false;
  const earned = item => item.earned === true || Number(item.earnedAt) > 0;
  const fraction = item => Math.min(1, Math.max(0, (Number(item.progress) || 0) / Math.max(1, Number(item.target) || 1)));
  // Course achievements belong to one course; every other personal milestone is
  // an account badge, including old "achievement" entries without a course.
  // This grouping never rewrites stable IDs, rarity or ownership.
  const isCourseAchievement = item => item.kind === "achievement" && !!item.course;
  const collectionKind = item => item.kind === "honor" ? "honor" : isCourseAchievement(item) ? "achievement" : "badge";
  const kindLabel = item => ({ honor: "Monthly honour", achievement: "Course achievement", badge: "Account badge" })[collectionKind(item)];
  const bitsLabel = item => Number(item.bits) > 0 ? `${number(item.bits)} EORbits` : "";
  const shareLabel = item => item.holderPct == null || !(Number(item.population) > 0) ? "" : `${number(item.holderPct)}% of ${isCourseAchievement(item) || item.courseName ? `${item.courseName || "course"} learners` : "collectors"}`;
  // Payment and holder share for a card or detail view. A course achievement
  // shows its course and holder share only: no difficulty or EORbits amount.
  const metaLine = item => (isCourseAchievement(item) ? [item.courseName, shareLabel(item)] : [bitsLabel(item), shareLabel(item)]).filter(Boolean).join(" · ");
  // Same wording as course-achievements.js CLEAN_NOTE.
  const CLEAN_NOTE = "Clean check: one concept check with every answer right (3 questions; the daily check has 8), where each question is new to you or last answered at least 14 days ago. The quiz gives you such questions first.";
  const monthLabel = value => /^\d{4}-\d{2}$/.test(String(value)) ? new Date(value + "-01T00:00:00Z").toLocaleDateString("en", { month: "long", year: "numeric", timeZone: "UTC" }) : "Monthly honour";
  const boardNames = { users: "XP champion", quiz_correct: "Quiz champion", eor_rating: "Rating champion", spenders: "EORbits champion" };
  let current = null, sequence = 0, timer = 0, lastCheck = 0, inFlight = null, lastData = null, queuedCheck = false;
  // The owner's last confirmed state, shared with course-achievements.js. The
  // collection opens on it at once while the Worker re-checks the evidence.
  const SAVED_STATE = "mk_rewards_state_v1:";
  function savedState(account) {
    try {
      const row = JSON.parse(localStorage.getItem(SAVED_STATE + account) || "null");
      if (row && Date.now() - Number(row.at) < 14 * 864e5 && validState(row.data, account)) return row.data;
    } catch (_) {}
    return null;
  }
  function saveState(account, data) {
    try { localStorage.setItem(SAVED_STATE + account, JSON.stringify({ at: Date.now(), data })); } catch (_) {}
  }
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
    // A course's Complete Set badge: a laurel around a star.
    laurel: '<path d="M23 53C12 48 7 36 11 21M41 53c11-5 16-17 12-32"/><path d="M11 26l-6-4M10 35l-7-1M13 44l-6 2M18 50l-4 5M53 26l6-4M54 35l7-1M51 44l6 2M46 50l4 5"/><path d="m32 17 4 8.5 9 1.2-6.6 6.2 1.7 9-8.1-4.5-8.1 4.5 1.7-9-6.6-6.2 9-1.2Z"/>',
    // A hidden course achievement before it is earned.
    hidden: '<circle cx="32" cy="32" r="22"/><path d="M24.5 25.5a7.5 7.5 0 1 1 11 6.6c-2.2 1.2-3.5 2.7-3.5 5.3v1.3"/><circle class="f" cx="32" cy="46" r="2.6"/>',
  };
  // Icons ship in a separate generated file. Course pages include it; anywhere
  // else the collection loads it beside this script, with the same revision.
  const ownSrc = (document.currentScript && document.currentScript.src) || "";
  let iconsRequested = false;
  function ensureIcons() {
    if (window.MkAchievementIcons || iconsRequested || !ownSrc) return;
    iconsRequested = true;
    try {
      const url = new URL("course-achievement-icons.js", ownSrc);
      url.search = new URL(ownSrc).search;
      const script = document.createElement("script");
      script.src = url.href; script.async = true;
      script.onerror = () => { iconsRequested = false; script.remove(); };
      document.head.appendChild(script);
    } catch (_) { iconsRequested = false; }
  }
  // A course achievement is a square, Steam-style tile with its own icon and
  // the course's frame pattern; a rare one gets gold. A hidden one that is not
  // yet earned arrives masked from the server and shows a question mark.
  const hiddenDescription = item => `A hidden ${item.courseName || "course"} achievement. How to unlock it stays a secret until you do.`;
  function achievementTile(item, extra = "") {
    const tier = ["E", "M", "H", "X"].includes(item.tier) ? item.tier : "E";
    const icon = item.rule === "hidden" ? glyphs.hidden : window.MkAchievementIcons ? window.MkAchievementIcons[item.id] : "";
    const glyph = String(item.glyph || "?"), size = glyph.length > 5 ? "rw-ach-glyph--xlong" : glyph.length > 3 ? "rw-ach-glyph--long" : "";
    const art = icon ? `<svg class="rw-ach-icon" viewBox="0 0 64 64" focusable="false"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${icon}</g></svg>` : `<span class="rw-ach-glyph ${size}">${esc(glyph)}</span>`;
    return `<span class="rw-medal rw-ach rw-ach--${tier} ${earned(item) ? "is-earned" : "is-locked"} ${item.gold ? "is-gold" : ""} ${extra}" data-course="${esc(item.course || "")}" aria-hidden="true">${art}</span>`;
  }
  function medal(item, extra = "") {
    if (isCourseAchievement(item)) return achievementTile(item, extra);
    const rarity = ["common", "uncommon", "rare", "epic", "legendary"].includes(item.rarity) ? item.rarity : item.kind === "badge" ? "rare" : "common";
    const icon = item.kind === "honor" ? "trophy" : (glyphs[item.icon] ? item.icon : item.kind === "badge" ? "gem" : "compass");
    const count = item.kind === "honor" ? Math.max(1, Number(item.count) || 1) : 1;
    const art = '<svg viewBox="0 0 100 112" fill="none"><path class="rw-ribbon" d="m27 72-8 33 20-9 11 13 11-13 20 9-8-33"/><path class="rw-medal-edge" d="m50 3 13 6 14 2 8 12 10 10-1 15 1 14-10 11-8 12-14 2-13 6-13-6-14-2-8-12L5 62l1-14-1-15 10-10 8-12 14-2Z"/><circle class="rw-medal-face" cx="50" cy="48" r="34"/><circle class="rw-medal-ring" cx="50" cy="48" r="29"/><g class="rw-medal-glyph" transform="translate(24 22) scale(.8125)" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' + glyphs[icon] + '</g><path class="rw-glint" d="m24 26 6-6m44 50-6 6"/></svg>';
    // A course's Complete Set badge carries the course on a chip under the face.
    const course = item.kind === "badge" && item.courseName ? `<span class="rw-medal-course">${esc(courseShort(item))}</span>` : "";
    return `<span class="rw-medal rw-medal--${rarity} ${earned(item) ? "is-earned" : "is-locked"} ${count > 1 ? "rw-medal-stack" : ""} ${course ? "rw-medal--set" : ""} ${extra}" aria-hidden="true">${course}${count > 2 ? `<span class="rw-medal-layer rw-medal-layer--right">${art}</span>` : ""}${count > 1 ? `<span class="rw-medal-layer rw-medal-layer--left">${art}</span>` : ""}${art}${count > 1 ? `<span class="rw-medal-count">×${number(count)}</span>` : ""}</span>`;
  }
  // The course code of Progress cards and search (course home `course_code`):
  // token m1c -> "M1", orm -> "ORM", pt -> "PT".
  function courseShort(item) {
    const token = String(item.course || ""), math = /^m(\d)[a-z]/.exec(token);
    return math ? `M${math[1]}` : token.toUpperCase() || String(item.courseName);
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
  // Tiered account badges: in one series (a badge metric with several tiers,
  // such as Momentum from 100 to 15,000 XP) the highest collected tier covers
  // the lower ones wherever rewards are listed. Covered tiers stay earned and
  // paid; the top card's details list them. Display only: IDs, ownership,
  // EORbits and the saved showcase are untouched.
  const seriesKey = item => item && item.kind === "badge" && !item.course && typeof item.metric === "string" ? item.metric : "";
  const byTier = (a, b) => (Number(a.target) || 0) - (Number(b.target) || 0) || (Number(a.order) || 0) - (Number(b.order) || 0);
  function tiersOf(item, items) {
    const series = seriesKey(item);
    const tiers = series ? items.filter(value => seriesKey(value) === series).sort(byTier) : [];
    return tiers.length > 1 ? tiers : null;
  }
  // "all": the top collected tier, else the first; "earned": the top collected
  // tier only; "locked": the next tier still to discover.
  function coverTiers(items, mode = "all") {
    const done = new Set(), out = [];
    for (const item of items) {
      const tiers = tiersOf(item, items);
      if (!tiers) { out.push(item); continue; }
      if (done.has(seriesKey(item))) continue;
      done.add(seriesKey(item));
      const top = tiers.filter(earned).at(-1);
      const pick = mode === "locked" ? tiers.find(tier => !earned(tier)) : top || (mode === "earned" ? null : tiers[0]);
      if (pick) out.push({ ...pick, tiers, tierIndex: tiers.indexOf(pick) });
    }
    return out;
  }
  // A featured lower tier is shown as the tier that now covers it.
  function coveringIds(ids, items) {
    return [...new Set(ids.map(id => {
      const tiers = tiersOf(items.find(item => item.id === id), items);
      return tiers?.filter(earned).at(-1)?.id || id;
    }))];
  }
  // Several tiers of one series unlocked together arrive as one pop-up for the
  // top tier, carrying the EORbits of all of them.
  function coverFresh(items) {
    return items.filter(item => {
      const series = seriesKey(item);
      return !series || !items.some(other => other !== item && seriesKey(other) === series && byTier(other, item) > 0);
    }).map(item => {
      const series = seriesKey(item), group = series ? items.filter(other => seriesKey(other) === series) : [];
      return group.length > 1 ? { ...item, bits: group.reduce((sum, other) => sum + (Number(other.bits) || 0), 0) } : item;
    });
  }
  function tierLine(item) {
    if (!item.tiers) return "";
    const next = item.tiers.slice(item.tierIndex + 1).find(tier => !earned(tier));
    const where = `Tier ${item.tierIndex + 1} of ${item.tiers.length}`;
    if (!earned(item)) return where;
    return next ? `${where} · next at ${number(next.target)}` : `${where} · series complete`;
  }
  const tierPips = item => item.tiers ? `<span class="rw-tier-pips" aria-hidden="true">${item.tiers.map(tier => `<i class="${earned(tier) ? "is-on" : ""}"></i>`).join("")}</span>` : "";
  async function request(path, body, signal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, 25000);
    try {
      let response, data = null;
      // A dropped connection or our own timeout is worth another try; closing
      // the window (the caller's signal) is not.
      try { response = await fetch(apiBase + path, { method: body ? "POST" : "GET", cache: "no-store", signal: controller.signal, ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) }); }
      catch (error) { throw Object.assign(error instanceof Error ? error : new Error("Network error"), { retryable: !signal?.aborted }); }
      try { data = await response.json(); } catch (_) {}
      if (!response.ok || !data || data.ok === false) throw Object.assign(new Error(data?.error || `Collection service answered ${response.status}.`), { status: response.status, retryable: !data || response.status >= 500 || response.status === 429 });
      return data;
    } finally { clearTimeout(timeout); signal?.removeEventListener("abort", abort); }
  }
  function normalise(data) {
    const items = Array.isArray(data.items) ? data.items.map(item => item && item.rule === "hidden" && isCourseAchievement(item) ? { ...item, description: hiddenDescription(item) } : item) : [];
    return { ...data, items, honors: Array.isArray(data.honors) ? data.honors.filter(honor => honor && Object.hasOwn(boardNames, honor.metric)) : [], featured: Array.isArray(data.featured) ? data.featured : [], newlyEarned: Array.isArray(data.newlyEarned) ? data.newlyEarned : [] };
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
    if (fresh.some(isCourseAchievement)) ensureIcons();
    if (celebrate && fresh.length) celebrateUnlocks(coverFresh(fresh), account, Number(data.credited) || 0);
  }
  function unlockNote(items, credited, fallback) {
    if (credited > 0 && !items.some(isCourseAchievement)) return `+${number(credited)} EORbits added to your balance.`;
    const share = items.length === 1 ? shareLabel(items[0]) : "";
    return share ? `Held by ${share}.` : fallback;
  }
  function celebrateUnlocks(items, account, credited = 0) {
    if (current && current.account === account) {
      current.dialog.querySelector(".rw-unlocks")?.remove();
      const banner = document.createElement("div");
      banner.className = "rw-unlocks";
      banner.setAttribute("role", "status");
      banner.innerHTML = `${medal({ ...items[0], earned: true })}<div><span class="rw-eyebrow">${items.length > 1 ? `${items.length} new discoveries` : "Collection unlocked"}</span><strong>${esc(items[0].title)}${items.length > 1 ? ` + ${items.length - 1} more` : ""}</strong><span>${esc(unlockNote(items, credited, "Yours to keep. Take a moment to enjoy it."))}</span></div>`;
      current.dialog.querySelector(".rw-status-row").after(banner);
      return;
    }
    toastUnlocks(items, account, credited);
  }
  // Steam-style unlock pop-ups in the bottom right corner: one small card per
  // unlock (three at most, then a "+N more" card), each fading after a while.
  const TOAST_MAX = 3, TOAST_MS = 8000;
  const shareMoment = item => window.MkStartupPrefs?.ensureScript?.("moment-share.js").then(ok => ok && MkMomentShare.open(MkMomentShare.fromReward(item, glyphs)));
  const SHARE_ICON = '<svg class="mk-glyph" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.64l-19 6.5a.5.5 0 0 0-.02.94l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/></svg>';
  function toastHost() {
    let host = document.querySelector(".rw-toasts");
    if (!host) {
      host = document.createElement("div");
      host.className = "rw-toasts";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    return host;
  }
  function toastUnlocks(items, account, credited) {
    const host = toastHost();
    const shown = items.slice(0, TOAST_MAX), extra = items.length - shown.length;
    const bits = item => credited > 0 && Number(item.bits) > 0 && !isCourseAchievement(item) ? `+${number(item.bits)} EORbits` : "";
    const eyebrow = item => item.kind === "honor" ? "Monthly honour" : isCourseAchievement(item) ? "Achievement unlocked" : "Badge earned";
    shown.forEach((item, index) => {
      const sub = [item.courseName || "", bits(item)].filter(Boolean).join(" · ") || unlockNote([item], credited, "Yours to keep.");
      addToast(host, `<button type="button" class="rw-toast-main" data-view>${medal({ ...item, earned: true })}<span class="rw-toast-text"><span class="rw-eyebrow">${esc(eyebrow(item))}</span><strong>${esc(item.title)}</strong><span>${esc(sub)}</span></span></button>`,
        item.gold ? "is-gold" : "", index, () => openFor(item, account), () => shareMoment(item));
    });
    if (extra > 0) addToast(host, `<button type="button" class="rw-toast-main rw-toast-more" data-view><span class="rw-toast-text"><span class="rw-eyebrow">And more</span><strong>+${extra} more unlocked</strong><span>${esc(unlockNote(items, credited, "Open your collection to see them all."))}</span></span></button>`,
      "", shown.length, () => openFor(null, account));
  }
  function openFor(item, account) {
    if (key() !== account) return;
    if (!item) { open(); return; }
    const kind = collectionKind(item);
    open(kind === "achievement" ? { kind, category: item.courseName || "", focus: item.id, scrollTo: "catalog" } : { kind, focus: item.id || "" });
  }
  function addToast(host, inner, extra, index, view, share) {
    const toast = document.createElement("aside");
    toast.className = `rw-toast ${extra}`.trim();
    toast.innerHTML = `${inner}${share ? `<button type="button" class="rw-icon-button" data-share aria-label="Share this moment">${SHARE_ICON}</button>` : ""}<button type="button" class="rw-icon-button" data-dismiss aria-label="Dismiss unlock notification"><svg class="mk-glyph" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`;
    // A short stagger, so several unlocks arrive one after another.
    if (index && toast.style) toast.style.animationDelay = `${index * 260}ms`;
    host.appendChild(toast);
    let expiry = 0;
    const dismiss = () => {
      clearTimeout(expiry);
      if (!toast.parentNode) return;
      toast.classList?.add("is-leaving");
      setTimeout(() => toast.remove(), 220);
    };
    const resume = () => { clearTimeout(expiry); expiry = setTimeout(() => {
      if (toast.contains(document.activeElement) || toast.matches(":hover")) { resume(); return; }
      dismiss();
    }, TOAST_MS + index * 260); };
    const pause = () => clearTimeout(expiry);
    toast.addEventListener("focusin", pause);
    toast.addEventListener("pointerenter", pause);
    toast.addEventListener("focusout", resume);
    toast.addEventListener("pointerleave", resume);
    resume();
    toast.querySelector("[data-dismiss]").onclick = dismiss;
    if (share) toast.querySelector("[data-share]").onclick = () => { dismiss(); share(); };
    toast.querySelector("[data-view]").onclick = () => { clearToasts(); view(); };
  }
  function clearToasts() {
    document.querySelector(".rw-toasts")?.remove();
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
    if (ui.embedded) { ui.dialog.remove(); return; }
    ui.dialog.close(); ui.dialog.remove();
    document.documentElement?.classList?.remove("rw-dialog-open");
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
    return `<button type="button" class="rw-card ${isEarned ? "is-earned" : "is-locked"} ${item.gold ? "is-gold" : ""}" data-reward-id="${esc(item.id)}" aria-label="${esc(item.title)}, ${isEarned ? "earned" : `${number(item.progress)} of ${number(item.target)}`}${item.count > 1 ? `, collected ${item.count} times` : ""}${featured ? ", featured" : ""}"><span class="rw-card-top"><span>${kindLabel(item)}${isCourseAchievement(item) ? "" : ` · ${esc(item.rarity || "common")}`}</span><span>${featured ? "★ Featured" : isEarned ? "✓ Collected" : "To discover"}</span></span>${medal(item)}<strong>${esc(item.title)}</strong>${item.tiers ? `<span class="rw-card-tier">${tierPips(item)}${esc(tierLine(item))}</span>` : ""}<span class="rw-card-description">${esc(item.description)}</span>${metaLine(item) ? `<span class="rw-card-meta">${esc(metaLine(item))}</span>` : ""}<span class="rw-card-progress"><span>${isEarned ? "Yours to keep" : `${number(item.progress)} / ${number(item.target)}`}</span><span class="rw-progress-track" aria-hidden="true"><i style="width:${isEarned ? 100 : Math.round(fraction(item) * 100)}%"></i></span></span></button>`;
  }
  function render(ui) {
    if (!live(ui)) return;
    const data = ui.data;
    const arenaOnly = ui.kind === "arena";
    if (ui.arenaHost) ui.arenaHost.hidden = !["all", "arena"].includes(ui.kind);
    for (const selector of [".rw-filters", ".rw-results-count", ".rw-grid"]) ui.dialog.querySelector(selector).hidden = arenaOnly;
    // One card per badge series; the progress filter picks which tier.
    const all = coverTiers(collectionItems(data), ui.filter);
    const collected = coverTiers(data.items.filter(earned), "earned");
    const pins = coveringIds(featuredIds(data.featured, data), data.items);
    const counts = { achievement: collected.filter(item => collectionKind(item) === "achievement").length, badge: collected.filter(item => collectionKind(item) === "badge").length, honor: groupedHonors(data.honors).reduce((sum, item) => sum + item.count, 0) };
    const countNames = { achievement: "Course achievements", badge: "Account badges", honor: "Monthly honours" };
    ui.dialog.querySelector(".rw-counts").hidden = !ui.loaded;
    ui.dialog.querySelector(".rw-counts").innerHTML = Object.entries(counts).map(([kind, count]) => `<div><strong>${number(count)}</strong><span>${countNames[kind]}</span></div>`).join("");
    const featured = pins.map(id => collectionItems(data).find(item => item.id === id && earned(item))).filter(Boolean).slice(0, 3);
    ui.dialog.querySelector(".rw-showcase-items").innerHTML = Array.from({ length: 3 }, (_, i) => featured[i] ? `<button type="button" class="rw-showcase-slot is-filled" data-reward-id="${esc(featured[i].id)}" aria-label="${esc(featured[i].title)}${featured[i].count > 1 ? `, collected ${featured[i].count} times` : ""}">${medal(featured[i])}<strong>${esc(featured[i].title)}</strong><span>Featured on your profile</span></button>` : '<div class="rw-showcase-slot"><span class="rw-empty-medal" aria-hidden="true">✧</span><strong>A space for your story</strong><span>Choose a collected reward below</span></div>').join("");
    ui.dialog.querySelector(".rw-showcase").hidden = !ui.account || !ui.loaded;
    const filtered = all.filter(item => (ui.kind === "all" || collectionKind(item) === ui.kind) && (ui.category === "all" || item.category === ui.category) && (ui.filter === "all" || (ui.filter === "earned" ? earned(item) : !earned(item))) && (!ui.query || (item.tiers || [item]).some(tier => `${tier.title} ${tier.description}`.toLowerCase().includes(ui.query.toLowerCase()))));
    const emptyHonors = ui.kind === "honor" && !data.honors.length;
    filtered.sort((a, b) => ui.sort === "name" ? String(a.title).localeCompare(String(b.title)) : ui.sort === "recent" ? (Number(b.earnedAt) || 0) - (Number(a.earnedAt) || 0) : Number(earned(a)) - Number(earned(b)) || fraction(b) - fraction(a) || String(a.id).localeCompare(String(b.id)));
    const resultLabel = ui.kind === "honor" ? "monthly honour type" : ui.kind === "achievement" ? "course achievement" : ui.kind === "badge" ? "account badge" : "reward";
    ui.dialog.querySelector(".rw-results-count").textContent = ui.loaded ? `${filtered.length} ${resultLabel}${filtered.length === 1 ? "" : "s"}` : "";
    ui.dialog.querySelector(".rw-grid").innerHTML = arenaOnly ? "" : !ui.loaded ? `<div class="rw-empty"><h3>${ui.loadError ? "Collection unavailable" : "Loading your collection…"}</h3><p>${ui.loadError ? "We could not check your rewards. Try Refresh again." : "Your saved rewards will appear once the service responds."}</p></div>` : filtered.map(item => collectionCard(item, pins.includes(item.id))).join("") || `<div class="rw-empty"><span aria-hidden="true">✧</span><h3>${emptyHonors ? "The next chapter is still being written" : "Nothing in this view yet"}</h3><p>${emptyHonors ? `Monthly honours recognise the leaders of completed UTC calendar months. Winners are saved after at least 48 hours, once synced results have been checked. Tied leaders share the honour.` : "Try a different filter, or take your next small learning step."}</p></div>`;
    ui.dialog.querySelectorAll("[data-kind]").forEach(button => { button.setAttribute("aria-pressed", String(button.dataset.kind === ui.kind)); });
    const next = data.items.filter(item => !earned(item)).sort((a, b) => fraction(b) - fraction(a))[0];
    const nextHost = ui.dialog.querySelector(".rw-next");
    nextHost.hidden = !ui.account || !next;
    if (next) nextHost.innerHTML = `<span class="rw-eyebrow">Your next discovery</span><strong>${esc(next.title)}</strong><span>${esc(next.description)}</span><span>${number(next.progress)} / ${number(next.target)}</span><button type="button" class="rw-button" data-reward-id="${esc(next.id)}">See the reward <span aria-hidden="true">↗</span></button>`;
    if (ui.scrollTo === "catalog" && ui.loaded && !ui.userScrolled) scrollToCatalog(ui);
  }
  // Opened from a course's "View all": glide past the hero to that course's
  // achievements, and keep them in view while the collection finishes loading
  // unless the learner has started scrolling.
  function scrollToCatalog(ui) {
    const first = !ui.scrolled;
    ui.scrolled = true;
    requestAnimationFrame(() => {
      if (!live(ui) || ui.userScrolled) return;
      const scroller = ui.scroller, target = ui.dialog.querySelector(".rw-catalog");
      if (!scroller || !target) return;
      const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 6;
      const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      scroller.scrollTo({ top: Math.max(0, top), behavior: first && !calm ? "smooth" : "auto" });
    });
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
  // The check re-reads the learner's synced history, so it can lose a race with
  // that account's own cloud sync (the history changes mid-check) or find the
  // sync unfinished. Both clear within seconds: retry twice, then show the
  // saved collection and check again after the next sync.
  const RETRY_DELAYS = [2500, 8000];
  async function refresh(ui, attempt = 0) {
    clearTimeout(ui.retryTimer); ui.retryTimer = 0;
    ui.retryOnSync = false;
    ui.loadError = false;
    const generation = ++ui.generation;
    // Reconciling re-reads the learner's whole quiz ledger, which can take a
    // while. Show the last confirmed collection straight away; without one,
    // fall back to the stored state (a quick read) if the reconcile is slow.
    // The reconcile result always wins.
    let quick = 0;
    if (ui.account && !ui.loaded) {
      const known = lastData && String(lastData.accountKey || "").toLowerCase() === ui.account ? lastData : savedState(ui.account);
      const seed = data => { updateData(ui, data); status(ui, "Showing your saved collection. Checking for new rewards…"); if (ui.focusId) { const id = ui.focusId; ui.focusId = ""; openDetail(ui, id); } };
      if (known) seed(known);
      else quick = setTimeout(() => {
        if (!live(ui) || generation !== ui.generation || ui.loaded) return;
        request(`/rewards/state?visitorId=${encodeURIComponent(visitor())}&accountKey=${encodeURIComponent(ui.account)}`, null, ui.controller.signal)
          .then(raw => { if (live(ui) && generation === ui.generation && !ui.loaded && validState(raw, ui.account)) seed(raw); })
          .catch(() => {});
      }, 1200);
    }
    render(ui);
    if (!ui.loaded || !ui.account) status(ui, ui.account ? "Checking your collection…" : "Exploring the collection…");
    ui.dialog.querySelector("[data-refresh]").setAttribute("aria-busy", "true");
    try {
      const raw = await (ui.account ? request("/rewards/reconcile", { visitorId: visitor(), accountKey: ui.account }, ui.controller.signal) : request("/rewards/catalog", null, ui.controller.signal)).finally(() => clearTimeout(quick));
      if (!live(ui) || generation !== ui.generation) return;
      if (ui.account ? !validState(raw, ui.account) : !validItems(raw.items)) throw new Error("Incomplete collection response.");
      const data = normalise(raw);
      if (ui.account) { lastData = data; saveState(ui.account, data); rememberUnlocks(data, ui.account, true); announce(data); }
      updateData(ui, data);
      if (ui.focusId) { const id = ui.focusId; ui.focusId = ""; openDetail(ui, id); }
      status(ui, ui.account ? "Up to date with your cloud learning. Earned rewards stay in your collection." : "A collection worth growing. Save an account in My → Account to start yours.");
    } catch (error) {
      if (!live(ui) || generation !== ui.generation) return;
      const retryable = !!(ui.account && error && error.retryable);
      if (retryable && attempt < RETRY_DELAYS.length) {
        status(ui, ui.loaded ? "Showing your saved collection. Checking for new rewards again…" : "Your latest learning is still syncing. Checking your collection again…");
        ui.retryTimer = setTimeout(() => { if (live(ui) && generation === ui.generation) refresh(ui, attempt + 1); }, RETRY_DELAYS[attempt]);
        return;
      }
      if (retryable && !ui.loaded) {
        try {
          const raw = await request(`/rewards/state?visitorId=${encodeURIComponent(visitor())}&accountKey=${encodeURIComponent(ui.account)}`, null, ui.controller.signal);
          if (live(ui) && generation === ui.generation && validState(raw, ui.account)) updateData(ui, raw);
        } catch (_) {}
        if (!live(ui) || generation !== ui.generation) return;
      }
      if (retryable && ui.loaded) {
        ui.retryOnSync = true;
        render(ui);
        status(ui, "Showing your saved collection. New rewards are checked again after your next sync, or press Refresh.");
        return;
      }
      ui.loadError = true; render(ui);
      status(ui, "The collection could not refresh. Your saved rewards are safe. Try Refresh again." + (error && error.message && error.status ? ` Details: ${String(error.message).slice(0, 160)}` : ""), true);
    } finally {
      if (live(ui) && generation === ui.generation && !ui.retryTimer) ui.dialog.querySelector("[data-refresh]").removeAttribute("aria-busy");
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
    // A badge series is featured as one: any of its tiers on the showcase counts.
    const tiers = tiersOf(item, ui.data.items), seriesIds = tiers ? tiers.map(tier => tier.id) : [item.id];
    const isEarned = earned(item), isFeatured = featuredIds(ui.data.featured, ui.data).some(id => seriesIds.includes(id));
    const tierList = tiers ? `<div class="rw-detail-tiers"><h3>Badge tiers</h3><ol>${tiers.map(tier => `<li class="${earned(tier) ? "is-earned" : "is-locked"}${tier.id === item.id ? " is-current" : ""}"><span class="rw-tier-mark" aria-hidden="true">${earned(tier) ? "✓" : "○"}</span><span><strong>${esc(tier.title)}</strong><span>${esc([tier.description, bitsLabel(tier)].filter(Boolean).join(" · "))}</span></span><span class="rw-tier-state">${earned(tier) ? `Collected${Number(tier.earnedAt) > 0 ? ` ${esc(new Date(Number(tier.earnedAt)).toLocaleDateString())}` : ""}` : `${number(tier.progress)} / ${number(tier.target)}`}</span></li>`).join("")}</ol>${tiers.filter(earned).length > 1 ? "<p>Your highest tier covers the lower ones in your collection. Every tier stays yours, with its EORbits.</p>" : ""}</div>` : "";
    dialog.innerHTML = `<button type="button" class="rw-icon-button rw-detail-close" aria-label="Close reward details"><svg class="mk-glyph" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button><span class="rw-eyebrow">${isCourseAchievement(item) ? "" : `${esc(item.rarity || "common")} · `}${kindLabel(item)}</span>${medal(item)}<h2 id="rw-detail-title">${esc(item.title)}</h2><p>${esc(item.description)}</p>${isCourseAchievement(item) && /clean check/i.test(item.description || "") ? `<p class="rw-detail-note">${CLEAN_NOTE}</p>` : ""}${metaLine(item) ? `<p class="rw-detail-meta">${esc(metaLine(item))}${item.gold && !isCourseAchievement(item) ? " · Rare" : ""}</p>` : ""}${Number(item.bits) > 0 && isEarned && !isCourseAchievement(item) ? `<p class="rw-detail-bits">${item.bitsGranted ? `${esc(bitsLabel(item))} paid to your balance.` : ui.data.rewardBitsEnabled ? `${esc(bitsLabel(item))} on the way with your next collection check.` : `${esc(bitsLabel(item))} kept for you; paid when EORbits rewards open.`}</p>` : ""}<p class="rw-detail-date">${isEarned ? `Collected${Number(item.earnedAt) > 0 ? ` on ${esc(new Date(Number(item.earnedAt)).toLocaleDateString())}` : ""} · Yours to keep` : `${number(item.progress)} of ${number(item.target)} · Keep going at your own pace`}</p>${item.kind !== "honor" ? `<progress max="${Math.max(1, Number(item.target) || 1)}" value="${isEarned ? Math.max(1, Number(item.target) || 1) : Math.max(0, Number(item.progress) || 0)}" aria-label="Progress towards ${esc(item.title)}"></progress>` : `<div class="rw-detail-months"><h3>Awarded months</h3><ul>${item.months.map(month => `<li>${esc(monthLabel(month))}</li>`).join("")}</ul></div>`}${tierList}<p class="rw-detail-status" role="status" aria-live="polite">${ui.account && isEarned ? "Choose up to three collected rewards for your public profile. Visibility follows your privacy choices." : "Rewards recognise your synced wiki activity. No purchase is needed to explore and learn."}</p>${ui.account && isEarned ? `<div class="rw-detail-actions"><button type="button" class="rw-button rw-button-primary" data-feature>${isFeatured ? "Remove from showcase" : "Feature on my profile"}</button><button type="button" class="rw-button" data-share>${SHARE_ICON}Share</button></div>` : ""}`;
    document.body.appendChild(dialog);
    const dismiss = () => {
      dialog.close(); dialog.remove();
      if (ui.detail === dialog) ui.detail = null;
      if (live(ui)) Array.from(ui.dialog.querySelectorAll("[data-reward-id]")).find(node => node.dataset.rewardId === item.id)?.focus({ preventScroll: true });
    };
    dialog.querySelector(".rw-detail-close").onclick = dismiss;
    const shareButton = dialog.querySelector("[data-share]");
    if (shareButton) shareButton.onclick = () => shareMoment(item);
    dialog.addEventListener("cancel", event => { event.preventDefault(); dismiss(); });
    dialog.addEventListener("click", event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss(); } });
    (window.MkDocSheet || dialog).showModal(dialog);
    const button = dialog.querySelector("[data-feature]");
    if (button) button.onclick = async () => {
      if (!live(ui) || ui.saving) return;
      const ids = featuredIds(ui.data.featured, ui.data).filter(value => !seriesIds.includes(value));
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
  // The collection is the first tab of My → Rewards; with a host it draws there
  // (account-social.js) and returns its dispose function.
  function open(options = {}) {
    if (!enabled()) return;
    const start = options && typeof options === "object" && !("target" in options) ? options : {};
    const host = start.host || null;
    if (!host && typeof window.MkLocalActivity?.open === "function") { window.MkLocalActivity.open("collection", start); return; }
    close();
    ensureIcons();
    const dialog = document.createElement(host ? "div" : "dialog");
    dialog.className = host ? "rw-dialog rw-embedded" : "rw-dialog";
    if (!host) {
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
    }
    dialog.setAttribute("aria-labelledby", "rw-title");
    dialog.innerHTML = `<div class="rw-shell"><header class="rw-header"><div><span class="rw-eyebrow">The learning collection</span><h1 id="rw-title">Your learning collection</h1></div><button type="button" class="rw-icon-button" data-close aria-label="Close collection"><svg class="mk-glyph" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></header><div class="rw-scroll"><section class="rw-hero"><div><span class="rw-eyebrow">A little progress. A lasting keepsake.</span><h2>Your learning,<br>collected.</h2><p>Course achievements and account badges, earned at your own pace.<br>Monthly and Arena honours for friendly competition.</p><div class="rw-counts"></div></div><div class="rw-hero-art" aria-hidden="true">${medal({ kind: "achievement", rarity: "epic", icon: "compass", earned: true })}${medal({ kind: "honor", rarity: "legendary", earned: true })}${medal({ rarity: "rare", icon: "book", earned: true })}</div></section><div class="rw-status-row"><p class="rw-status" role="status" aria-live="polite"></p><button type="button" class="rw-button" data-refresh>↻ Refresh</button></div><section class="rw-showcase" aria-label="Your profile showcase"><div class="rw-section-heading"><h2>The showcase</h2><span>Three places. Your favourite milestones.</span></div><div class="rw-showcase-items"></div></section><section class="rw-next" aria-label="Suggested next reward" hidden></section><section class="rw-catalog" aria-label="Reward collection"><div class="rw-collection-tabs" role="group" aria-label="Reward type"><button type="button" data-kind="all" aria-pressed="true">Everything</button><button type="button" data-kind="achievement" aria-pressed="false">Course achievements</button><button type="button" data-kind="badge" aria-pressed="false">Account badges</button><button type="button" data-kind="honor" aria-pressed="false">Monthly honours</button><button type="button" data-kind="arena" aria-pressed="false">Arena honours</button></div><div class="rw-filters"><label><span>Search collection</span><input type="search" placeholder="Find a reward…" data-search></label><label><span>Collection</span><select data-filter="category"><option value="all">Every collection</option></select></label><label><span>Progress</span><select data-filter="filter"><option value="all">All progress</option><option value="earned">Collected</option><option value="locked">Still to discover</option></select></label><label><span>Sort</span><select data-filter="sort"><option value="next">Closest first</option><option value="recent">Recently collected</option><option value="name">Name A–Z</option></select></label></div><p class="rw-results-count" aria-live="polite"></p><div class="rw-grid"></div></section><details class="rw-rules"><summary>How the collection works</summary><p>Course achievements are set for each course. They are judged only from concept checks the server recorded, and only a first answer to a question counts, or one given at least 14 days after you last answered it, so a quick repeat cannot help or hurt. A clean check is one concept check with every answer right, all on such questions; the quiz gives you those first. The share shown is the part of the accounts that have opened that course's pages who hold it; a gold frame marks a rare one. Account badges are milestones across the whole wiki. In a badge series your highest tier covers the lower ones; they stay yours, with their EORbits, and are listed in its details.</p><p>Monthly honours are competitive awards for the leaders of completed UTC calendar months, with at least 48 hours for cloud sync and shared trophies for ties. A month stays open until all synced results are checked; once awarded, its honours are permanent.</p><p>Your cloud learning unlocks rewards automatically. Earned rewards are kept even if you later revise your self-ratings. Public displays respect the privacy of the learning behind each reward. Older activity only counts where reliable records exist; missing history never becomes an invented award.</p><p>There is no deadline on personal achievements and no penalty for taking a break. Wiki activity and self-ratings are learning records, not academic certifications. Each course achievement and badge pays a one-off EORbits reward once EORbits rewards are open, including for rewards you already hold. It never adds XP.</p></details></div></div>`;
    const ui = { dialog, embedded: !!host, account: key(), opener: document.activeElement, controller: new AbortController(), generation: 0, data: normalise({}), scrollTo: start.scrollTo === "catalog" ? "catalog" : "", scrolled: false, userScrolled: false, kind: ["all", "achievement", "badge", "honor", "arena"].includes(start.kind) ? start.kind : "all", category: typeof start.category === "string" ? start.category : "all", filter: "all", sort: "next", query: "", focusId: typeof start.focus === "string" ? start.focus : "", saving: false, loaded: false, loadError: false };
    current = ui; sequence += 1;
    (host || document.body).appendChild(dialog);
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
    const scroller = ui.scroller = host || dialog.querySelector(".rw-scroll");
    const userScroll = () => { ui.userScrolled = true; };
    for (const type of ["wheel", "touchstart", "pointerdown"]) scroller.addEventListener(type, userScroll, { passive: true });
    scroller.addEventListener("keydown", userScroll);
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
    if (!host) {
      (window.MkDocSheet || dialog).showModal(dialog);
      // Lock the page behind the modal, as the Account and Store dialogs do (QA-083).
      document.documentElement?.classList?.add("rw-dialog-open");
    }
    render(ui);
    refresh(ui);
    if (host) return () => {
      for (const type of ["wheel", "touchstart", "pointerdown", "keydown"]) scroller.removeEventListener(type, userScroll);
      if (current === ui) close();
    };
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
    const items = coverTiers(state.items.filter(earned), "earned");
    const honors = groupedHonors(state.honors);
    const all = items.concat(honors);
    const honorCount = honors.reduce((sum, item) => sum + item.count, 0);
    const selected = coveringIds(featuredIds(state.featured, state), state.items).map(id => all.find(item => item.id === id)).filter(Boolean).slice(0, 3);
    const shown = selected.length ? selected : all.slice(0, 3);
    const remaining = all.filter(item => !shown.some(visible => visible.id === item.id));
    if (!shown.length && !honors.length && !options.self) return;
    const section = document.createElement("section");
    section.className = "rw-profile";
    section.setAttribute("aria-label", "Achievements and honours");
    const profileCard = item => `<div class="rw-profile-medal">${medal(item)}<strong>${esc(item.title)}</strong><span>${esc(item.description)}</span>${item.kind === "honor" ? `<details class="rw-profile-months"><summary>Awarded months</summary><ul>${item.months.map(month => `<li>${esc(monthLabel(month))}</li>`).join("")}</ul></details>` : ""}</div>`;
    section.innerHTML = `<div class="rw-profile-heading"><h3>Achievements & honours</h3><span>${[[items.filter(item => collectionKind(item) === "achievement").length, "course achievement"], [items.filter(item => collectionKind(item) === "badge").length, "account badge"], [honorCount, "monthly honour"]].filter(([n], index) => n || index === 1).map(([n, word]) => `${n} ${word}${n === 1 ? "" : "s"}`).join(" · ")}</span></div>${shown.length ? `<div class="rw-profile-medals">${shown.map(profileCard).join("")}</div>` : ""}${options.self ? '<button type="button" class="rw-button" data-collection>Open my collection ↗</button>' : ""}`;
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
  // A recorded quiz answer is judged by the service at once, so it is checked
  // within seconds; other activity waits for the usual minute between checks.
  const CHECK_GAP = 60000, ANSWER_GAP = 2500;
  let answerCheck = false;
  async function checkUnlocks() {
    const account = key();
    if (!enabled() || !account || document.hidden || current) return;
    if (inFlight) { queuedCheck = true; return; }
    const remaining = (answerCheck ? ANSWER_GAP : CHECK_GAP) - (Date.now() - lastCheck);
    if (remaining > 0) { clearTimeout(timer); timer = setTimeout(checkUnlocks, remaining + 50); return; }
    answerCheck = false;
    lastCheck = Date.now();
    const generation = sequence;
    const controller = new AbortController();
    inFlight = controller;
    try {
      const raw = await request("/rewards/reconcile", { visitorId: visitor(), accountKey: account }, controller.signal);
      if (!enabled() || key() !== account || generation !== sequence || !validState(raw, account)) return;
      const data = normalise(raw);
      lastData = data;
      saveState(account, data);
      rememberUnlocks(data, account, true);
      announce(data);
    } catch (_) { /* An unavailable reward service must never interrupt learning. */ }
    finally {
      if (inFlight === controller) {
        inFlight = null;
        if (queuedCheck) { queuedCheck = false; if (answerCheck) checkAfterAnswer(); else scheduleCheck(); }
      }
    }
  }
  // Page surfaces (course achievement box, course homes) follow the owner state.
  function announce(data) {
    try { window.dispatchEvent(new CustomEvent("mk-rewards-state", { detail: data })); } catch (_) {}
  }
  function scheduleCheck(event) {
    if (event?.type === "mk-account-sync-complete" && event.detail?.ok === false) return;
    if (event && event.type === "mk-local-activity-change" && !["cloud-sync", "cloud-sync-mastery", "cloud-sync-json", "account-xp"].includes(event.detail?.type)) return;
    clearTimeout(timer);
    timer = setTimeout(checkUnlocks, 1800);
  }
  function checkAfterAnswer() {
    answerCheck = true;
    clearTimeout(timer);
    timer = setTimeout(checkUnlocks, 300);
  }
  function resetAccount() {
    close();
    sequence += 1;
    clearTimeout(timer);
    inFlight?.abort(); inFlight = null;
    lastCheck = 0; lastData = null; queuedCheck = false; answerCheck = false;
    clearToasts();
  }
  window.addEventListener("mk-local-activity-change", scheduleCheck);
  window.addEventListener("mk-account-sync-complete", scheduleCheck);
  window.addEventListener("mk-account-sync-complete", event => { if (current?.retryOnSync && event.detail?.ok !== false && live(current)) refresh(current); });
  window.addEventListener("mk-quiz-answer-recorded", checkAfterAnswer);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) scheduleCheck(); });
  window.addEventListener("mk-account-login-change", resetAccount);
  window.addEventListener("mk-account-workspace-changed", resetAccount);
  window.addEventListener("storage", () => {
    if (!enabled() || (current && key() !== current.account) || (lastData && key() !== String(lastData.accountKey || "").toLowerCase())) resetAccount();
  });
  window.addEventListener("mk:startup-features-loaded", () => { if (!enabled()) resetAccount(); });
  window.addEventListener("pagehide", resetAccount);
  window.addEventListener("mk-achievement-icons-ready", () => { if (current && live(current)) render(current); });
  window.MkRewards = { open, mount: (host, options) => (host ? open({ ...(options || {}), host }) : null), close, mountProfile, medal, honorItem, state: () => lastData && String(lastData.accountKey || "").toLowerCase() === key() ? lastData : null };
  try { window.dispatchEvent(new CustomEvent("mk-rewards-ready")); } catch (_) {}
})();
