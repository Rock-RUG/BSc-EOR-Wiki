// docs/javascripts/mastery-widget.js
(function () {
  let __mw_mem_cid = null;
  let __mw_mem_vid = null;
  let __mw_title_menu_close = null;
  let __mw_title_menu_anchor = null;
  let __mw_fly_layer_clip_bound = false;
  let __mw_ai_history_repair = null;
  let __mw_ai_history_patch_installed = false;
  let __mw_ai_history_push_original = null;
  let __mw_mastery_effect_cache = { at: 0, map: null };
  const __mw_boot_at = Date.now();
  const MW_MASTERY_EFFECTS = {
    3: {
      itemId: "mastery_effect_mastered_gold",
      slot: "mastery_effect_mastered",
      tier: "master",
      rootAttr: "data-mk-mastery-effect-mastered"
    },
    2: {
      itemId: "mastery_effect_clear_silver",
      slot: "mastery_effect_clear",
      tier: "know",
      rootAttr: "data-mk-mastery-effect-clear"
    }
  };

  function mwVisitId(conceptId) {
    if (__mw_mem_cid === conceptId && __mw_mem_vid) return __mw_mem_vid;
    __mw_mem_cid = conceptId;
    __mw_mem_vid = String(Date.now()) + "_" + Math.random().toString(16).slice(2);
    return __mw_mem_vid;
  }

  function getSiteRootUrl() {
    const link =
      document.querySelector('link[href*="assets/stylesheets"]') ||
      document.querySelector('script[src*="assets/javascripts"]');

    const href = link ? (link.getAttribute("href") || link.getAttribute("src") || "") : "";
    const u = href ? new URL(href, document.baseURI) : new URL(document.baseURI);
    const p = u.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return u.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function normLoc(loc) {
    return String(loc || "").split("#")[0].replace(/^\/+/, "");
  }

  function currentRelPath() {
    const siteRoot = new URL(getSiteRootUrl());
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : (siteRoot.pathname + "/");
    let p = String(window.location.pathname || "");
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    return p.replace(/^\/+/, "");
  }

  function isConceptPage(relPath) {
    const p = String(relPath || "").toLowerCase();
    if (!p.endsWith(".html")) return false;
    if (p === "index.html" || p.endsWith("/index.html")) return false;
    if (p.endsWith("find.html")) return false;
    const segs = String(relPath || "").split("/").filter(Boolean);
    return segs.length >= 2;
  }

  function mwConsumeGuestAction(action, detail) {
    try {
      if (!window.MkGuestAccess || typeof window.MkGuestAccess.consume !== "function") return true;
      return window.MkGuestAccess.consume(action, Object.assign({ blocking: true }, detail || {}));
    } catch (_) {
      return true;
    }
  }

  function mwSvg(name, size) {
    const s = Number(size) || 18;
    const common = `width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"`;
    const stroke = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

    if (name === "shield-check-outline") {
      return `<svg ${common} ${stroke}><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"/><path d="M9 12.5l2 2 4-4.5"/></svg>`;
    }
    if (name === "check-circle-outline") {
      return `<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.2 2.2 4.8-5.2"/></svg>`;
    }
    if (name === "help-circle-outline") {
      return `<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="1"/></svg>`;
    }
    if (name === "close-circle-outline") {
      return `<svg ${common} ${stroke}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>`;
    }
    if (name === "cog-outline") {
      return `<svg ${common} ${stroke}><path d="M4 21v-5"/><path d="M4 9V3"/><circle cx="4" cy="12.5" r="2.5"/><path d="M12 21v-9"/><path d="M12 7V3"/><circle cx="12" cy="9.5" r="2.5"/><path d="M20 21v-3"/><path d="M20 13V3"/><circle cx="20" cy="15.5" r="2.5"/></svg>`;
    }
    if (name === "eye-outline") {
      return `<svg ${common} ${stroke}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
    if (name === "eye-off-outline") {
      return `<svg ${common} ${stroke}><path d="M3 3l18 18"/><path d="M10.6 6.3A11.9 11.9 0 0 1 12 6c6.5 0 10 6 10 6a17.7 17.7 0 0 1-3.2 3.8"/><path d="M6.7 6.7C4 8.5 2 12 2 12s3.5 6 10 6c1.8 0 3.3-.4 4.7-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>`;
    }
    return "";
  }

  function mwInkSvg(svgHtml) {
    const raw = String(svgHtml || "");
    if (!raw) return raw;
    return raw.replace(/<svg\b/, '<svg class="mw-ink-svg" style="color:var(--mw-title-plain-ink);stroke:currentColor;fill:none"');
  }

  function mwSvgForLevel(m, size) {
    if (m === 3) return mwSvg("shield-check-outline", size);
    if (m === 2) return mwSvg("check-circle-outline", size);
    if (m === 1) return mwSvg("help-circle-outline", size);
    if (m === 0) return mwSvg("close-circle-outline", size);
    return "";
  }

  function mwMasteryEffectDef(m) {
    const level = Number(m);
    return MW_MASTERY_EFFECTS[level] || null;
  }

  function mwInvalidateMasteryEffectCache() {
    __mw_mastery_effect_cache = { at: 0, map: null };
  }

  function mwReadMasteryEffectState(force) {
    const now = Date.now();
    if (!force && __mw_mastery_effect_cache.map && now - Number(__mw_mastery_effect_cache.at || 0) < 160) {
      return __mw_mastery_effect_cache.map;
    }

    let inventory = null;
    let activeTrials = [];
    try {
      const api = window.MkAccountData || null;
      if (api && typeof api.getShopInventory === "function") inventory = api.getShopInventory();
      if (api && typeof api.getActiveShopTrials === "function") activeTrials = api.getActiveShopTrials() || [];
    } catch (_) {}
    try {
      if (inventory && Array.isArray(inventory.activeTrials)) activeTrials = inventory.activeTrials;
    } catch (_) {}

    const owned = inventory && inventory.owned && typeof inventory.owned === "object" ? inventory.owned : {};
    const equipped = inventory && inventory.equipped && typeof inventory.equipped === "object" ? inventory.equipped : {};
    const trials = Array.isArray(activeTrials) ? activeTrials : [];
    const map = {};

    Object.keys(MW_MASTERY_EFFECTS).forEach((levelKey) => {
      const def = MW_MASTERY_EFFECTS[levelKey];
      const trialActive = trials.some((row) => {
        if (!row || String(row.itemId || "") !== def.itemId) return false;
        if (row.muted || row.shadowMuted) return false;
        const expiresAt = Number(row.expiresAt || 0) || 0;
        return !expiresAt || expiresAt > now;
      });
      let rootActive = false;
      try {
        rootActive = document.documentElement.getAttribute(def.rootAttr) === def.itemId;
      } catch (_) {}
      const equippedActive = !!(owned[def.itemId] && equipped[def.slot] === def.itemId);
      map[levelKey] = !!(trialActive || equippedActive || rootActive);
    });

    __mw_mastery_effect_cache = { at: now, map };
    return map;
  }

  function mwMasteryEffectTierForLevel(m) {
    const def = mwMasteryEffectDef(m);
    if (!def) return "";
    const map = mwReadMasteryEffectState(false);
    return map && map[String(Number(m))] ? def.tier : "";
  }

  function mwSyncEffectTierAttr(el, m) {
    if (!el || !el.setAttribute) return "";
    const def = mwMasteryEffectDef(m);
    const tier = def ? mwMasteryEffectTierForLevel(m) : "";
    try {
      if (tier) {
        el.setAttribute("data-mw-effect-tier", tier);
        el.setAttribute("data-mw-effect-item", def.itemId);
      } else {
        el.removeAttribute("data-mw-effect-tier");
        el.removeAttribute("data-mw-effect-item");
      }
    } catch (_) {}
    return tier;
  }

  function mwSyncTitleEffectTier(sc, m) {
    if (!sc) return "";
    const tier = mwMasteryEffectTierForLevel(m);
    try { mwSyncEffectTierAttr(sc.h1, m); } catch (_) {}
    try { mwSyncEffectTierAttr(sc.badge, m); } catch (_) {}
    return tier;
  }

  function mwEffectTierHtml(m) {
    const tier = mwMasteryEffectTierForLevel(m);
    return tier ? ` data-mw-effect-tier="${escapeHtml(tier)}"` : "";
  }

  const MW_WIDGET_HIDDEN_KEY = "mw_widget_hidden_v1";
  const MW_WIDGET_FORCE_OPEN_PREFIX = "mw_widget_force_open_v1:";

  function mwForceOpenKey(conceptId) {
    return MW_WIDGET_FORCE_OPEN_PREFIX + normLoc(conceptId || "");
  }

  function mwWriteWidgetForceOpen(conceptId, enabled) {
    const key = mwForceOpenKey(conceptId);
    if (!key) return;
    try {
      if (enabled) sessionStorage.setItem(key, "1");
      else sessionStorage.removeItem(key);
    } catch (_) {}
  }

  function mwConsumeWidgetForceOpen(conceptId) {
    const key = mwForceOpenKey(conceptId);
    if (!key) return false;
    try {
      const on = sessionStorage.getItem(key) === "1";
      if (on) sessionStorage.removeItem(key);
      return on;
    } catch (_) {
      return false;
    }
  }


  function mwGearHtml() {
    return mwInkSvg(mwSvg("cog-outline", 18));
  }

  function mwHideIconHtml() {
    return mwInkSvg(mwSvg("eye-off-outline", 18));
  }

  function mwUnhideIconHtml() {
    return mwInkSvg(mwSvg("eye-outline", 18));
  }

  function mwReadWidgetHidden() {
    try {
      return localStorage.getItem(MW_WIDGET_HIDDEN_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function mwWriteWidgetHidden(hidden) {
    try {
      localStorage.setItem(MW_WIDGET_HIDDEN_KEY, hidden ? "1" : "0");
    } catch (_) {}
    try {
      window.dispatchEvent(new CustomEvent("mw:widget-visibility-change", { detail: { hidden: !!hidden } }));
    } catch (_) {}
  }

  function mwRecapIconHtml(size) {
    const s = Number(size) || 18;
    return mwInkSvg(`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.708"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>`);
  }

  function mwAiQuizIconHtml(size) {
    const s = Number(size) || 18;
    return mwInkSvg(`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v4.5L5.5 16a3.6 3.6 0 0 0 3.2 5h6.6a3.6 3.6 0 0 0 3.2-5L14 7.5V3"/><path d="M8 14h8"/><path d="M9.5 17h5"/><path d="M18.5 4.5l.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9z"/></svg>`);
  }

  function mwGetAiQuizApi() {
    try { return window.AIMCQQuiz || window.AIQQuiz || null; } catch (_) { return null; }
  }

  const MW_AIQ_LABEL = "AI mastery check";
  const MW_AIQ_UNAVAILABLE_LABEL = "AI mastery check unavailable on this page";

  function mwAiHistoryNoHash(href) {
    return String(href || "").split("#")[0];
  }

  function mwAiHistorySamePage(a, b) {
    return mwAiHistoryNoHash(a) === mwAiHistoryNoHash(b);
  }

  function mwAiHistoryStateHasMarker(state, marker) {
    try {
      return !!(marker && state && typeof state === "object" && state.__mwAiModalHistory === marker);
    } catch (_) {
      return false;
    }
  }

  function mwInstallAiHistoryPushMarker() {
    if (__mw_ai_history_patch_installed) return;
    __mw_ai_history_patch_installed = true;
    try {
      __mw_ai_history_push_original = window.history && window.history.pushState;
      if (typeof __mw_ai_history_push_original !== "function") return;
      window.history.pushState = function (state, title, url) {
        let nextState = state;
        try {
          const repair = __mw_ai_history_repair;
          const active = !!(repair && repair.marker && Number(repair.markUntil || 0) >= Date.now());
          if (active) {
            let targetHref = window.location.href;
            try {
              targetHref = new URL(url == null ? window.location.href : String(url), window.location.href).href;
            } catch (_) {}
            if (mwAiHistorySamePage(targetHref, repair.baseHref || window.location.href)) {
              const base = state && typeof state === "object" ? state : {};
              nextState = Object.assign({}, base, { __mwAiModalHistory: repair.marker });
              repair.pushed = true;
              repair.lastPushAt = Date.now();
            }
          }
        } catch (_) {}
        return __mw_ai_history_push_original.call(this, nextState, title, url);
      };
    } catch (_) {}
  }

  function mwAiQuizDialogLooksOpen() {
    const textLooksLikeAi = (txt) => {
      const s = String(txt || "").replace(/\s+/g, " ").trim();
      if (!/AI\s+(concept|mastery)\s+check/i.test(s)) return false;
      return /(Suggested\s+level|Accept\s+level|Try\s+again|Close|question|check|mastery)/i.test(s);
    };

    const candidates = [];
    try {
      document.querySelectorAll("dialog,[role='dialog'],[aria-modal='true'],[data-aiq],.aiq-modal,.aiq-dialog,.aiq-panel,.aiq-root,.aiq-overlay").forEach((el) => candidates.push(el));
    } catch (_) {}

    for (const el of candidates) {
      try {
        if (mwIsVisibleBox(el) && textLooksLikeAi(el.textContent || "")) return true;
      } catch (_) {}
    }

    try {
      const nodes = Array.from(document.querySelectorAll("body > div, body > section, body > aside, article.md-content__inner > div, article.md-content__inner > section"));
      for (const el of nodes) {
        if (!mwIsVisibleBox(el)) continue;
        const txt = String(el.textContent || "");
        if (textLooksLikeAi(txt)) return true;
      }
    } catch (_) {}

    return false;
  }

  function mwCleanupAiHistoryRepair(marker) {
    const repair = __mw_ai_history_repair;
    if (!repair || (marker && repair.marker !== marker)) return;
    try { if (repair.pollTimer) clearTimeout(repair.pollTimer); } catch (_) {}
    try { if (repair.observer) repair.observer.disconnect(); } catch (_) {}
    try { document.removeEventListener("click", repair.onClick, true); } catch (_) {}
    try { document.removeEventListener("keydown", repair.onKey, true); } catch (_) {}
    __mw_ai_history_repair = null;
  }

  function mwRepairAiModalHistoryIfNeeded(reason) {
    const repair = __mw_ai_history_repair;
    if (!repair || repair.done || repair.repairing) return false;
    if (!mwAiHistorySamePage(window.location.href, repair.baseHref)) {
      mwCleanupAiHistoryRepair(repair.marker);
      return false;
    }
    let hasMarker = false;
    try { hasMarker = mwAiHistoryStateHasMarker(window.history.state, repair.marker); } catch (_) { hasMarker = false; }
    if (!hasMarker) {
      if (reason === "timeout") mwCleanupAiHistoryRepair(repair.marker);
      return false;
    }

    repair.done = true;
    repair.repairing = true;
    try {
      window.history.back();
      window.setTimeout(() => mwCleanupAiHistoryRepair(repair.marker), 900);
      return true;
    } catch (_) {
      mwCleanupAiHistoryRepair(repair.marker);
      return false;
    }
  }

  function mwScheduleAiHistoryRepairCheck(delayMs, reason) {
    const repair = __mw_ai_history_repair;
    if (!repair || repair.done) return;
    try { if (repair.pollTimer) clearTimeout(repair.pollTimer); } catch (_) {}
    repair.pollTimer = window.setTimeout(() => {
      const active = __mw_ai_history_repair;
      if (!active || active.done) return;
      try {
        const open = mwAiQuizDialogLooksOpen();
        if (open) active.sawOpen = true;
        if (active.sawOpen && !open) {
          mwRepairAiModalHistoryIfNeeded(reason || "closed");
          return;
        }
        if (Date.now() - Number(active.startedAt || 0) > 45000) {
          mwRepairAiModalHistoryIfNeeded("timeout");
          return;
        }
        mwScheduleAiHistoryRepairCheck(500, "poll");
      } catch (_) {}
    }, Math.max(0, Number(delayMs) || 0));
  }

  function mwBeginAiHistoryRepair(source) {
    try { mwInstallAiHistoryPushMarker(); } catch (_) {}
    const marker = String(Date.now()) + "_" + Math.random().toString(16).slice(2);
    const repair = {
      marker,
      source: String(source || "aiq"),
      baseHref: String(window.location.href || ""),
      baseLength: Number(window.history && window.history.length) || 0,
      markUntil: Date.now() + 2200,
      startedAt: Date.now(),
      pushed: false,
      sawOpen: false,
      done: false,
      repairing: false,
      pollTimer: 0,
      observer: null,
      onClick: null,
      onKey: null
    };
    __mw_ai_history_repair = repair;

    repair.onClick = (ev) => {
      try {
        const btn = ev && ev.target && ev.target.closest ? ev.target.closest("button,[role='button'],a") : null;
        if (!btn) return;
        const label = [btn.getAttribute("aria-label"), btn.getAttribute("title"), btn.textContent]
          .map((x) => String(x || "").replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .join(" ");
        if (!/(^|\b)(Close|Accept\s+level|×|✕|x)(\b|$)/i.test(label)) return;
        repair.sawOpen = true;
        mwScheduleAiHistoryRepairCheck(180, "action-close");
      } catch (_) {}
    };

    repair.onKey = (ev) => {
      try {
        if (ev && ev.key === "Escape") {
          repair.sawOpen = true;
          mwScheduleAiHistoryRepairCheck(180, "escape-close");
        }
      } catch (_) {}
    };

    try { document.addEventListener("click", repair.onClick, true); } catch (_) {}
    try { document.addEventListener("keydown", repair.onKey, true); } catch (_) {}
    try {
      if (window.MutationObserver) {
        let raf = 0;
        repair.observer = new MutationObserver(() => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            mwScheduleAiHistoryRepairCheck(60, "mutation");
          });
        });
        repair.observer.observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden", "open", "aria-hidden"] });
      }
    } catch (_) {}

    [120, 420, 900, 1600, 2400].forEach((delay) => {
      try {
        window.setTimeout(() => {
          const active = __mw_ai_history_repair;
          if (!active || active.marker !== marker || active.done) return;
          if (mwAiQuizDialogLooksOpen()) active.sawOpen = true;
        }, delay);
      } catch (_) {}
    });
    mwScheduleAiHistoryRepairCheck(260, "open-watch");
    return marker;
  }

  function mwOpenAiQuizWithHistoryRepair(api, payload) {
    const options = payload && typeof payload === "object" ? payload : {};
    // Random AI quiz is opened automatically after a top-menu navigation. It is
    // already on the target concept page, so it does not need the history-repair
    // shim used by ordinary manual opens. Keeping the shim active here adds extra
    // document-wide click/mutation listeners while the result is being accepted,
    // which can make the page feel frozen on heavy concept pages.
    if (String(options.source || "") === "random-ai-mode") {
      return api.open(options);
    }
    const marker = mwBeginAiHistoryRepair(options.source || "aiq");
    try {
      const out = api.open(options);
      try {
        if (__mw_ai_history_repair && __mw_ai_history_repair.marker === marker) {
          __mw_ai_history_repair.markUntil = Date.now() + 2200;
        }
      } catch (_) {}
      return out;
    } catch (err) {
      mwCleanupAiHistoryRepair(marker);
      throw err;
    }
  }

  function mwNormaliseAiQuizButtonLabel(root) {
    const label = MW_AIQ_LABEL;
    const targets = [];
    try {
      if (root && root.matches && root.matches(".mw-aiq-btn, [data-aiq-widget-host='1'] button, .mw-title-menu-btn--ai")) {
        targets.push(root);
      }
      if (root && root.querySelectorAll) {
        root.querySelectorAll(".mw-aiq-btn, [data-aiq-widget-host='1'] button, .mw-title-menu-btn--ai").forEach((btn) => targets.push(btn));
      }
    } catch (_) {}

    targets.forEach((btn) => {
      if (!btn) return;
      try { btn.title = btn.disabled ? MW_AIQ_UNAVAILABLE_LABEL : label; } catch (_) {}
      try { btn.setAttribute("aria-label", btn.disabled ? MW_AIQ_UNAVAILABLE_LABEL : label); } catch (_) {}

      let wroteLabelNode = false;
      try {
        const labelNode = btn.querySelector && btn.querySelector(".mw-aiq-btn-label, [data-aiq-label], .aiq-label");
        if (labelNode && String(labelNode.textContent || "").trim() !== label) {
          labelNode.textContent = label;
          wroteLabelNode = true;
        } else if (labelNode) {
          wroteLabelNode = true;
        }
      } catch (_) {}

      if (!wroteLabelNode) {
        try {
          Array.from(btn.childNodes || []).forEach((node) => {
            if (node && node.nodeType === Node.TEXT_NODE && /AI\s+concept\s+check/i.test(node.textContent || "")) {
              node.textContent = String(node.textContent || "").replace(/AI\s+concept\s+check/ig, label);
            }
          });
        } catch (_) {}
      }
    });
  }

  function mwInstallAiQuizLabelObserver(host, state) {
    if (!host) return;

    const run = () => {
      try { mwNormaliseAiQuizButtonLabel(host); } catch (_) {}
    };

    run();
    [0, 80, 240, 600, 1200].forEach((delay) => {
      try {
        const id = window.setTimeout(run, delay);
        if (state) {
          state.searchSyncTimers = Array.isArray(state.searchSyncTimers) ? state.searchSyncTimers : [];
          state.searchSyncTimers.push(id);
        }
      } catch (_) {}
    });

    if (host.__mwAiqLabelObserver) return;
    if (!window.MutationObserver) return;

    try {
      let raf = 0;
      const schedule = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          run();
        });
      };
      const obs = new MutationObserver(schedule);
      obs.observe(host, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "title", "aria-label", "disabled"]
      });
      host.__mwAiqLabelObserver = obs;
      if (state && Array.isArray(state.destroyers)) {
        state.destroyers.push(() => {
          try { if (raf) cancelAnimationFrame(raf); } catch (_) {}
          try { obs.disconnect(); } catch (_) {}
          try { host.__mwAiqLabelObserver = null; } catch (_) {}
        });
      }
    } catch (_) {}
  }

  function mwSyncAiQuizButton(btn) {
    if (!btn) return false;
    let available = false;
    let hasApi = false;
    let known = false;
    const label = MW_AIQ_LABEL;
    try {
      const api = mwGetAiQuizApi();
      hasApi = !!(api && typeof api.open === "function");
      known = !!(api && typeof api.availabilityKnown === "function" && api.availabilityKnown());
      available = !!(api && typeof api.open === "function" && (typeof api.isAvailable !== "function" || api.isAvailable()));
    } catch (_) {
      available = false;
    }

    btn.hidden = !hasApi;
    btn.disabled = !available;
    btn.title = available ? label : (known ? MW_AIQ_UNAVAILABLE_LABEL : "AI mastery check loading");
    btn.setAttribute("aria-label", available ? label : (known ? MW_AIQ_UNAVAILABLE_LABEL : "AI mastery check loading"));
    mwNormaliseAiQuizButtonLabel(btn);
    return hasApi;
  }

  function mwBindTouchSafeButton(btn, handler) {
    if (!btn || typeof handler !== "function") return;
    let lastRunAt = 0;
    const run = (e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (e && typeof e.stopPropagation === "function") e.stopPropagation();
      const now = Date.now();
      if (now - lastRunAt < 650) return;
      lastRunAt = now;
      handler(e);
    };
    btn.addEventListener("click", run);
    btn.addEventListener("pointerup", (e) => {
      if (e && e.pointerType === "mouse") return;
      run(e);
    });
    btn.addEventListener("touchend", run);
  }

  function mwEnsureInlineAiQuizButton(host, state) {
    if (!host || !host.querySelector) return false;

    let available = false;
    let hasApi = false;
    let known = false;
    try {
      const api = mwGetAiQuizApi();
      hasApi = !!(api && typeof api.open === "function");
      known = !!(api && typeof api.availabilityKnown === "function" && api.availabilityKnown());
      available = !!(api && typeof api.open === "function" && (typeof api.isAvailable !== "function" || api.isAvailable()));
    } catch (_) {
      available = false;
    }

    const existingBtn = host.querySelector("button");
    if (!hasApi) {
      try {
        if (existingBtn && existingBtn.dataset && existingBtn.dataset.mwAiqFallback === "1") existingBtn.remove();
      } catch (_) {}
      return false;
    }

    if (existingBtn) {
      mwSyncAiQuizButton(existingBtn);
      mwNormaliseAiQuizButtonLabel(host);
      return true;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mw-aiq-btn";
    btn.dataset.mwAiqFallback = "1";
    btn.innerHTML = `${mwAiQuizIconHtml(18)}<span class="mw-aiq-btn-label">${MW_AIQ_LABEL}</span>`;
    btn.disabled = !available;
    btn.title = available ? MW_AIQ_LABEL : (known ? MW_AIQ_UNAVAILABLE_LABEL : "AI mastery check loading");
    btn.setAttribute("aria-label", available ? MW_AIQ_LABEL : (known ? MW_AIQ_UNAVAILABLE_LABEL : "AI mastery check loading"));
    mwBindTouchSafeButton(btn, () => {
      const api = mwGetAiQuizApi();
      if (!api || typeof api.open !== "function") return;
      try {
        const out = mwOpenAiQuizWithHistoryRepair(api, { source: "mastery-widget" });
        if (out && typeof out.catch === "function") out.catch(() => {});
      } catch (_) {}
    });
    host.appendChild(btn);
    mwNormaliseAiQuizButtonLabel(host);
    return true;
  }

  function mwOpenAiQuizFromTitleMenu(btn) {
    if (btn && !mwSyncAiQuizButton(btn)) return;
    const api = mwGetAiQuizApi();
    if (!api || typeof api.open !== "function") return;
    mwCloseTitleMenu();
    try {
      const out = mwOpenAiQuizWithHistoryRepair(api, { source: "title-menu" });
      if (out && typeof out.catch === "function") out.catch(() => {});
    } catch (_) {}
  }

  function mwClampReadinessPct(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return 0;
    return Math.max(0, Math.min(100, Math.round(num)));
  }

  function mwInstallSelfCheckGuard() {
    if (window.MasterySelfCheckGuard && window.MasterySelfCheckGuard.__version === "v3") return;

    const STYLE_ID = "mw-selfcheck-guard-style-v2-safe-compact";

    function scEnsureStyle() {
      if (document.getElementById(STYLE_ID)) return;
      const st = document.createElement("style");
      st.id = STYLE_ID;
      st.textContent = `
        .mw-selfcheck-modal{
          position:fixed;
          inset:0;
          z-index:2147483250;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:18px;
          box-sizing:border-box;
          background:rgba(12,16,24,.46);
          -webkit-backdrop-filter:blur(10px) saturate(1.04);
          backdrop-filter:blur(10px) saturate(1.04);
        }
        .mw-selfcheck-panel{
          width:min(520px,100%);
          border-radius:22px;
          border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 82%,transparent);
          background:var(--md-default-bg-color,#fff);
          color:var(--md-default-fg-color,#1f2328);
          box-shadow:0 24px 80px rgba(0,0,0,.28);
          overflow:hidden;
        }
        .mw-selfcheck-head{
          padding:18px 20px 10px;
          border-bottom:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 70%,transparent);
        }
        .mw-selfcheck-title{
          font-size:1rem;
          line-height:1.25;
          font-weight:800;
        }
        .mw-selfcheck-body{
          padding:16px 20px 18px;
          display:grid;
          gap:12px;
        }
        .mw-selfcheck-copy{
          font-size:.86rem;
          line-height:1.5;
          color:var(--md-default-fg-color);
        }
        .mw-selfcheck-note{
          border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 78%,transparent);
          background:color-mix(in srgb,var(--md-default-fg-color) 6%,transparent);
          border-radius:16px;
          padding:10px 12px;
          font-size:.78rem;
          line-height:1.42;
          color:var(--md-default-fg-color--light);
        }
        .mw-selfcheck-actions{
          display:flex;
          justify-content:flex-end;
          gap:10px;
          flex-wrap:wrap;
          margin-top:4px;
        }
        .mw-selfcheck-btn{
          appearance:none;
          border:1px solid color-mix(in srgb,var(--md-default-fg-color--lightest) 86%,transparent);
          border-radius:999px;
          background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-default-fg-color) 10%);
          color:var(--md-default-fg-color);
          font:inherit;
          font-size:.78rem;
          line-height:1.1;
          min-height:36px;
          padding:8px 13px;
          cursor:pointer;
        }
        .mw-selfcheck-btn:hover{
          border-color:color-mix(in srgb,var(--md-primary-fg-color) 55%,transparent);
          background:color-mix(in srgb,var(--md-default-bg-color) 82%,var(--md-primary-fg-color) 18%);
        }
        .mw-selfcheck-btn.primary{
          border-color:color-mix(in srgb,var(--md-primary-fg-color) 70%,transparent);
          background:var(--md-primary-fg-color);
          color:var(--md-primary-bg-color,#fff);
        }
        html.mw-selfcheck-open, body.mw-selfcheck-open{overflow:hidden !important;}
        @media (max-width:720px), (pointer:coarse){
          html.mw-selfcheck-open, body.mw-selfcheck-open{
            overflow:hidden !important;
            touch-action:none !important;
          }
          .mw-selfcheck-modal{
            position:absolute !important;
            inset:auto !important;
            left:var(--mwsc-doc-left, 0px) !important;
            top:var(--mwsc-doc-top, 0px) !important;
            width:var(--mwsc-doc-width, 100vw) !important;
            height:var(--mwsc-doc-height, var(--mwsc-vh, 100dvh)) !important;
            min-height:var(--mwsc-doc-height, var(--mwsc-vh, 100dvh)) !important;
            max-height:none !important;
            display:flex !important;
            align-items:flex-end !important;
            justify-content:center !important;
            padding:10px 10px calc(var(--mwsc-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 10px) !important;
            box-sizing:border-box !important;
            overflow:hidden !important;
            background:transparent !important;
            -webkit-backdrop-filter:none !important;
            backdrop-filter:none !important;
            overscroll-behavior:contain !important;
            touch-action:pan-y !important;
            -webkit-transform:translateZ(0) !important;
            transform:translateZ(0) !important;
          }
          .mw-selfcheck-modal::before{
            content:"";
            position:absolute !important;
            inset:0 !important;
            z-index:0;
            pointer-events:none;
            height:100% !important;
            min-height:100% !important;
            background:rgba(12,16,24,.38) !important;
            -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
            backdrop-filter:blur(10px) saturate(1.04) !important;
          }
          .mw-selfcheck-panel{
            position:relative !important;
            z-index:1 !important;
            width:100% !important;
            max-width:520px !important;
            height:auto !important;
            min-height:0 !important;
            max-height:calc(var(--mwsc-visible-height, var(--mwsc-vh, 100dvh)) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px) !important;
            border-radius:20px !important;
            overflow:auto !important;
            -webkit-overflow-scrolling:touch !important;
            overscroll-behavior:contain !important;
            touch-action:pan-y !important;
            background:var(--md-default-bg-color,#fff) !important;
            -webkit-transform:translateZ(0) !important;
            transform:translateZ(0) !important;
          }
          .mw-selfcheck-head{padding:16px 16px 9px;}
          .mw-selfcheck-body{padding:14px 16px calc(env(safe-area-inset-bottom, 0px) + 16px);}
        }
      `;
      (document.head || document.documentElement).appendChild(st);
    }


    function scIsTouchLikeViewport() {
      try {
        const mm = window.matchMedia;
        return !!((mm && (mm("(max-width: 900px)").matches || mm("(pointer: coarse)").matches || mm("(hover: none)").matches)) || (navigator && navigator.maxTouchPoints > 0));
      } catch (_) { return false; }
    }

    function scPx(n) {
      const x = Number(n);
      return Number.isFinite(x) ? Math.max(0, Math.round(x)) + "px" : "0px";
    }

    function scPageScrollXNow() {
      try { return Math.max(0, Number(window.scrollX) || Number(window.pageXOffset) || Number(document.documentElement && document.documentElement.scrollLeft) || Number(document.body && document.body.scrollLeft) || 0); }
      catch (_) { return 0; }
    }

    function scPageScrollYNow() {
      try { return Math.max(0, Number(window.scrollY) || Number(window.pageYOffset) || Number(document.documentElement && document.documentElement.scrollTop) || Number(document.body && document.body.scrollTop) || 0); }
      catch (_) { return 0; }
    }

    function scClamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function scIsIOSWebKitMobile() {
      try {
        const ua = String(navigator.userAgent || "");
        const platform = String(navigator.platform || "");
        return /iP(?:hone|ad|od)/i.test(ua) || (/Mac/i.test(platform) && Number(navigator.maxTouchPoints || 0) > 1);
      } catch (_) { return false; }
    }

    function scReadSafeAreaBottomInsetPx() {
      try {
        let probe = document.getElementById("mw-selfcheck-safe-area-probe");
        if (!probe) {
          probe = document.createElement("div");
          probe.id = "mw-selfcheck-safe-area-probe";
          probe.style.cssText = "position:fixed;left:0;bottom:0;visibility:hidden;pointer-events:none;height:0;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom,0px);";
          (document.body || document.documentElement).appendChild(probe);
        }
        const cs = window.getComputedStyle ? window.getComputedStyle(probe) : null;
        return Math.max(0, Math.ceil(parseFloat(cs && cs.paddingBottom) || 0));
      } catch (_) { return 0; }
    }

    function scIOSCompleteToolbarOcclusionPx() {
      if (!scIsTouchLikeViewport() || !scIsIOSWebKitMobile()) return 0;
      try {
        const vv = window.visualViewport;
        const layoutH = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
        const vvBottom = vv ? ((Number(vv.offsetTop) || 0) + (Number(vv.height) || 0)) : layoutH;
        const visualGap = vv ? Math.max(0, Math.round(layoutH - vvBottom)) : 0;
        let screenH = 0;
        try { screenH = Math.max(Number(window.screen && window.screen.height) || 0, Number(window.screen && window.screen.width) || 0); } catch (_) { screenH = 0; }
        const safe = Math.max(0, scReadSafeAreaBottomInsetPx());
        const screenGap = screenH > 0 ? Math.max(0, Math.round(screenH - layoutH - safe)) : 0;
        const raw = Math.max(visualGap, screenGap);
        if (raw < 56) return 0;
        return scClamp(raw, 64, 260);
      } catch (_) { return 0; }
    }

    function scUpdateViewportMetrics() {
      const modal = document.querySelector(".mw-selfcheck-modal");
      if (!modal) return;
      try {
        const vv = window.visualViewport;
        const layoutW = Math.max(1, Number(window.innerWidth) || Number(document.documentElement && document.documentElement.clientWidth) || 1);
        const layoutH = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
        const vvLeft = vv ? (Number(vv.offsetLeft) || 0) : 0;
        const vvTop = vv ? (Number(vv.offsetTop) || 0) : 0;
        const vvW = vv && Number(vv.width) ? Number(vv.width) : layoutW;
        const vvH = vv && Number(vv.height) ? Number(vv.height) : layoutH;
        const vvBottom = vvTop + vvH;
        if (vvH > 0) modal.style.setProperty("--mwsc-vh", scPx(vvH));

        if (!scIsTouchLikeViewport()) {
          ["--mwsc-doc-left", "--mwsc-doc-top", "--mwsc-doc-width", "--mwsc-doc-height", "--mwsc-visible-height", "--mwsc-ios-hidden-tail"].forEach((name) => {
            try { modal.style.removeProperty(name); } catch (_) {}
          });
          return;
        }

        const safeStrip = Math.max(scReadSafeAreaBottomInsetPx(), vv ? Math.max(0, Math.round(layoutH - vvBottom)) : 0, scIOSCompleteToolbarOcclusionPx());
        const visibleBottom = vv ? Math.max(0, vvBottom) : layoutH;
        const layoutBottom = Math.max(layoutH, visibleBottom) + Math.max(0, safeStrip);
        const docLeft = scPageScrollXNow() + vvLeft;
        const docTop = scPageScrollYNow() + vvTop;
        const docHeight = Math.max(80, Math.ceil(layoutBottom - vvTop));
        const visibleHeight = Math.max(80, Math.ceil((vv && vvH) ? vvH : layoutH));
        const hiddenTail = Math.max(0, Math.ceil(docHeight - visibleHeight));
        modal.style.setProperty("--mwsc-doc-left", scPx(docLeft));
        modal.style.setProperty("--mwsc-doc-top", scPx(docTop));
        modal.style.setProperty("--mwsc-doc-width", scPx(vvW || layoutW));
        modal.style.setProperty("--mwsc-doc-height", scPx(docHeight));
        modal.style.setProperty("--mwsc-visible-height", scPx(visibleHeight));
        modal.style.setProperty("--mwsc-ios-hidden-tail", scPx(hiddenTail));
      } catch (_) {}
    }

    function scBindViewportMetricsOnce() {
      if (window.__mwSelfcheckViewportMetricsBoundV1) return;
      window.__mwSelfcheckViewportMetricsBoundV1 = true;
      const update = () => scUpdateViewportMetrics();
      try { window.addEventListener("resize", update, { passive: true }); } catch (_) { window.addEventListener("resize", update); }
      try { window.addEventListener("orientationchange", () => window.setTimeout(update, 80), { passive: true }); } catch (_) { window.addEventListener("orientationchange", () => window.setTimeout(update, 80)); }
      try {
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", update, { passive: true });
          window.visualViewport.addEventListener("scroll", update, { passive: true });
        }
      } catch (_) {}
    }

    function scLevelLabel(m) {
      if (m === 3) return "Mastered";
      if (m === 2) return "Clear";
      if (m === 1) return "Unclear";
      if (m === 0) return "Unknown";
      return "Not rated";
    }

    function scDifficultyForLevel(level) {
      const m = Number(level);
      if (m === 3) return "challenge";
      if (m === 2) return "standard";
      return "basic";
    }

    function scCurrentRelPath() {
      let p = String(window.location.pathname || "");
      try {
        const root = new URL(getSiteRootUrl());
        const rootPath = root.pathname.endsWith("/") ? root.pathname : (root.pathname + "/");
        if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
      } catch (_) {}
      return normLoc(p);
    }

    function scCurrentCandidates() {
      const rel = scCurrentRelPath();
      const out = [];
      const push = (x) => {
        const v = normLoc(x);
        if (v && !out.includes(v)) out.push(v);
      };
      push(rel);
      if (rel && !/\.html?$/i.test(rel) && !rel.endsWith("/")) push(rel + ".html");
      if (rel.endsWith("/")) push(rel.slice(0, -1) + ".html");
      if (rel.endsWith("/index.html")) push(rel.slice(0, -"/index.html".length) + ".html");
      return out;
    }

    function scCanOpenAiForLoc(id) {
      const key = normLoc(id);
      if (!key) return false;
      if (!scCurrentCandidates().includes(key)) return false;
      try {
        const api = window.AIMCQQuiz || window.AIQQuiz;
        return !!(api && typeof api.open === "function" && (typeof api.isAvailable !== "function" || api.isAvailable()));
      } catch (_) {
        return false;
      }
    }

    function scShouldSkip(opts) {
      const source = String(opts && opts.source || "").toLowerCase();
      if (!source) return false;
      if (/ai|quiz|mcq/.test(source)) return true;
      if (source === "self-check-continue") return true;
      if (opts && opts.skipSelfCheck) return true;
      return false;
    }

    async function scReadPrereqReadiness(conceptId) {
      try {
        const cm = window.ConceptMastery;
        if (!cm || typeof cm.readinessOf !== "function") return null;
        const data = await cm.readinessOf(conceptId, { maxDepth: 2 }).catch(() => null);
        if (!data || data.status !== "ok") return null;
        if (Number(data.selectedCount || data.totalAvailable || 0) <= 0) return null;
        const pct = Number(data.pct);
        if (!Number.isFinite(pct)) return null;
        return Object.assign({}, data, { pct: Math.max(0, Math.min(100, Math.round(pct))) });
      } catch (_) {
        return null;
      }
    }

    function scJudge(level, data) {
      const m = Number(level);
      const pct = Number(data && data.pct);
      if (![0, 1, 2, 3].includes(m) || !Number.isFinite(pct)) return null;

      if (m === 3 && pct < 65) {
        return { suspicious: true, direction: "high", reason: `You selected Mastered, but prerequisite readiness is only ${pct}%.` };
      }
      if (m === 2 && pct < 30) {
        return { suspicious: true, direction: "high", reason: `You selected Clear, but prerequisite readiness is only ${pct}%.` };
      }
      if (m === 1 && pct >= 85) {
        return { suspicious: true, direction: "low", reason: `You selected Unclear, but prerequisite readiness is already ${pct}%.` };
      }
      if (m === 0 && pct >= 65) {
        return { suspicious: true, direction: "low", reason: `You selected Unknown, but prerequisite readiness is already ${pct}%.` };
      }
      return { suspicious: false, direction: "ok", reason: "" };
    }

    function scShowDialog(level, data, judgement) {
      scEnsureStyle();
      return new Promise((resolve) => {
        let modal = document.querySelector(".mw-selfcheck-modal");
        if (modal) modal.remove();
        modal = document.createElement("div");
        modal.className = "mw-selfcheck-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        const pct = Number(data && data.pct);
        const selectedLabel = scLevelLabel(Number(level));
        const reason = judgement && judgement.reason ? judgement.reason : "This self-assessment does not match the current prerequisite readiness signal.";
        modal.innerHTML = `
          <div class="mw-selfcheck-panel" role="document">
            <div class="mw-selfcheck-head">
              <div class="mw-selfcheck-title">AI thinks this self-assessment may be inaccurate</div>
            </div>
            <div class="mw-selfcheck-body">
              <div class="mw-selfcheck-copy">
                ${escapeHtml(reason)} You can run one AI mastery check before saving, or continue with your manual choice.
              </div>
              <div class="mw-selfcheck-actions">
                <button type="button" class="mw-selfcheck-btn" data-action="continue">Continue with ${escapeHtml(selectedLabel)}</button>
                <button type="button" class="mw-selfcheck-btn primary" data-action="ai">Take AI check</button>
              </div>
            </div>
          </div>`;
        const cleanup = (value) => {
          try { document.removeEventListener("keydown", onKey, true); } catch (_) {}
          try { document.documentElement.classList.remove("mw-selfcheck-open"); } catch (_) {}
          try { if (document.body) document.body.classList.remove("mw-selfcheck-open"); } catch (_) {}
          try { modal.remove(); } catch (_) {}
          resolve(value);
        };
        modal.addEventListener("click", (ev) => {
          if (ev.target === modal) {
            ev.preventDefault();
            ev.stopPropagation();
            cleanup("cancel");
            return;
          }
          const btn = ev.target && ev.target.closest ? ev.target.closest("button[data-action]") : null;
          if (!btn) return;
          ev.preventDefault();
          ev.stopPropagation();
          cleanup(btn.getAttribute("data-action") || "cancel");
        });
        const onKey = (ev) => {
          if (ev.key === "Escape") {
            ev.preventDefault();
            ev.stopPropagation();
            cleanup("cancel");
          }
        };
        document.addEventListener("keydown", onKey, true);
        document.body.appendChild(modal);
        try { document.documentElement.classList.add("mw-selfcheck-open"); } catch (_) {}
        try { if (document.body) document.body.classList.add("mw-selfcheck-open"); } catch (_) {}
        try { scBindViewportMetricsOnce(); scUpdateViewportMetrics(); window.setTimeout(scUpdateViewportMetrics, 60); } catch (_) {}
      });
    }

    async function guard(conceptId, level, meta, opts) {
      const options = opts && typeof opts === "object" ? opts : {};
      const m = Number(level);
      if (![0, 1, 2, 3].includes(m)) return true;
      if (scShouldSkip(options)) return true;
      if (!scCanOpenAiForLoc(conceptId)) return true;

      const readiness = await scReadPrereqReadiness(conceptId);
      const judgement = scJudge(m, readiness);
      if (!judgement || !judgement.suspicious) return true;

      const choice = await scShowDialog(m, readiness, judgement);
      if (choice === "cancel") return false;
      if (choice !== "ai") return true;

      try {
        const api = window.AIMCQQuiz || window.AIQQuiz;
        if (api && typeof api.open === "function") {
          const out = api.open({
            source: "self-assessment-review",
            manualLevel: m,
            initialLevel: m,
            startDifficulty: scDifficultyForLevel(m),
            meta: meta || null,
          });
          if (out && typeof out.catch === "function") out.catch(() => {});
        }
      } catch (_) {}
      return false;
    }

    window.MasterySelfCheckGuard = {
      __version: "v3",
      guard,
      judge: scJudge,
      difficultyForLevel: scDifficultyForLevel,
    };
  }

  try { mwInstallSelfCheckGuard(); } catch (_) {}


  function mwChevronDownSvg(size) {
    const s = Number(size) || 16;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
  }

  function mwPluralize(n, singular, plural) {
    const nn = Math.max(0, Number(n) || 0);
    return `${nn} ${nn === 1 ? singular : (plural || (singular + "s"))}`;
  }

  function mwRelativeTimeLabel(ts) {
    const t = Number(ts) || 0;
    if (!t) return "not yet";
    const diff = Date.now() - t;
    const abs = Math.abs(diff);
    const minute = 60000;
    const hour = 3600000;
    const day = 86400000;
    const week = 7 * day;

    if (abs < 45000) return diff >= 0 ? "just now" : "soon";
    if (abs < 90 * 1000) return diff >= 0 ? "1 minute ago" : "in 1 minute";
    if (abs < 45 * minute) {
      const n = Math.round(abs / minute);
      return diff >= 0 ? `${n} minutes ago` : `in ${n} minutes`;
    }
    if (abs < 90 * minute) return diff >= 0 ? "1 hour ago" : "in 1 hour";
    if (abs < 22 * hour) {
      const n = Math.round(abs / hour);
      return diff >= 0 ? `${n} hours ago` : `in ${n} hours`;
    }
    if (abs < 36 * hour) return diff >= 0 ? "1 day ago" : "in 1 day";
    if (abs < 8 * day) {
      const n = Math.round(abs / day);
      return diff >= 0 ? `${n} days ago` : `in ${n} days`;
    }
    if (abs < 12 * day) return diff >= 0 ? "1 week ago" : "in 1 week";
    if (abs < 5 * week) {
      const n = Math.round(abs / week);
      return diff >= 0 ? `${n} weeks ago` : `in ${n} weeks`;
    }
    const n = Math.max(1, Math.round(abs / (30 * day)));
    return diff >= 0 ? `${n} months ago` : `in ${n} months`;
  }

  function mwRecapModeLabel(kind) {
    const k = String(kind || "").toLowerCase();
    if (k === "first-contact") return "First contact";
    if (k === "stable-mastery") return "Stable mastery";
    if (k === "backslide") return "Backslide";
    if (k === "hovering") return "Hovering";
    if (k === "dormant") return "Dormant";
    return "Recent pattern";
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function mwLooksLikePathArtifact(s) {
    const t = String(s || "").replace(/\s+/g, " ").trim();
    if (!t) return false;
    if (/^(?:\.\.\/)+/.test(t)) return true;
    if (/^[./A-Za-z0-9_-]+\.html(?:[#?].*)?$/i.test(t)) return true;
    if (/[\/]/.test(t) && /(?:year-|lecture|math|analysis|calculus|probability|econometrics)/i.test(t)) return true;
    if (/[\/]/.test(t) && (t.endsWith("/") || t.endsWith(".html"))) return true;
    return false;
  }

  function mwIsProtectedTitleNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
    const el = node;
    const protectedSelector = [
      ".mw-h1-title-text",
      ".lp-h1-left",
      ".arithmatex",
      "mjx-container",
      ".MathJax",
      ".katex",
      ".katex-display",
      "math",
      "script[type^='math/tex']",
      "script[type^='math/asciimath']"
    ].join(",");

    try {
      if (el.matches && el.matches(protectedSelector)) return true;
      if (el.querySelector && el.querySelector(protectedSelector)) return true;
    } catch (_) {}
    return false;
  }

  function mwStripTitlePathArtifacts(container) {
    if (!container) return;

    // Never rewrite the real title flow. Inline math spacing depends on ordinary
    // text nodes such as " and" after a math element. Trimming or rebuilding those
    // nodes causes Oand / oNotations bugs.
    if (mwIsProtectedTitleNode(container)) return;

    Array.from(container.childNodes || []).forEach((node) => {
      if (!node) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const raw = String(node.textContent || "");
        if (!raw || !raw.trim()) return;

        // Only remove a text node when the whole node is a path artifact.
        // Do not trim, normalise, or rewrite normal title text.
        if (!/\r|\n/.test(raw)) {
          if (mwLooksLikePathArtifact(raw)) {
            try { node.remove(); } catch (_) {}
          }
          return;
        }

        // Multi-line safety: remove only complete artifact lines and preserve
        // all remaining characters exactly as authored.
        const lines = raw.split(/\r?\n/);
        const kept = lines.filter((line) => !mwLooksLikePathArtifact(line));
        if (kept.length !== lines.length) {
          const next = kept.join("\n");
          if (next.length) node.textContent = next;
          else {
            try { node.remove(); } catch (_) {}
          }
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (mwIsProtectedTitleNode(node)) return;

      const hasElementChildren = !!(node.children && node.children.length > 0);
      const txt = String(node.textContent || "").replace(/\s+/g, " ").trim();

      // Only remove plain leaf elements that consist entirely of a path artifact.
      if (!hasElementChildren && txt && mwLooksLikePathArtifact(txt)) {
        try { node.remove(); } catch (_) {}
        return;
      }

      mwStripTitlePathArtifacts(node);
    });
  }

  function mwNodeTextForArtifactCheck(node) {
    if (!node) return "";
    if (node.nodeType === Node.TEXT_NODE) return String(node.textContent || "").replace(/\s+/g, " ").trim();
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node;
    if (mwIsProtectedTitleNode(el)) return "";
    if (el.matches && el.matches("script,style,link,meta")) return "";
    if (el.querySelector && el.querySelector("a,button,input,select,textarea,summary,details,img,canvas,video,iframe")) return "";
    return String(el.textContent || "").replace(/\s+/g, " ").trim();
  }

  function mwPurgeHeadingPathArtifacts(inner, h1) {
    if (!inner || !h1) return;

    Array.from(inner.childNodes || []).forEach((node) => {
      if (!node || node === h1) return;
      let isBefore = false;
      try {
        isBefore = !!(node.compareDocumentPosition && (node.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING));
      } catch (_) {}
      if (!isBefore) return;

      const txt = mwNodeTextForArtifactCheck(node);
      if (!txt || !mwLooksLikePathArtifact(txt)) return;
      try { node.remove(); } catch (_) {}
    });

    mwStripTitlePathArtifacts(h1);
  }

  function mwScheduleHeadingArtifactCleanup() {
    const run = () => {
      try {
        const inner = document.querySelector("article.md-content__inner");
        const h1 = inner ? inner.querySelector("h1") : null;
        if (!inner || !h1) return;
        mwPurgeHeadingPathArtifacts(inner, h1);
        mwStripTitlePathArtifacts(h1);
      } catch (_) {}
    };

    run();
    try { mwNextFrame().then(run).catch(() => {}); } catch (_) {}
    window.setTimeout(run, 80);
    window.setTimeout(run, 220);
  }

  function mwMotionReduced() {
    try {
      if (window.MkSiteMotion && typeof window.MkSiteMotion.isReduced === "function") {
        return !!window.MkSiteMotion.isReduced();
      }
    } catch (_) {}
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (_) {}
    return false;
  }

  function mwGetSearchToggle() {
    return (
      document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
      document.querySelector('input#__search') ||
      document.querySelector('#__search') ||
      null
    );
  }

  function mwIsFinePointerDesktop() {
    try {
      return !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    } catch (_) {
      return false;
    }
  }

  function mwIsVisibleBox(el) {
    if (!el || !el.getBoundingClientRect) return false;
    try {
      const cs = window.getComputedStyle(el);
      if (!cs || cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity || 1) === 0) return false;
      const r = el.getBoundingClientRect();
      return !!(r && r.width > 8 && r.height > 8);
    } catch (_) {
      return false;
    }
  }

  function mwHeaderSearchRoot() {
    return document.querySelector('.md-header .md-search') || document.querySelector('.md-search') || null;
  }

  function mwHeaderSearchInput(root) {
    const scope = root || mwHeaderSearchRoot();
    return (scope && scope.querySelector && scope.querySelector('input[data-md-component="search-query"]')) ||
      document.querySelector('input[data-md-component="search-query"]') ||
      null;
  }

  function mwSearchOutputLooksOpen(root) {
    const scope = root || mwHeaderSearchRoot();
    const candidates = [];
    try {
      if (scope && scope.querySelector) {
        candidates.push(scope.querySelector('.md-search__output'));
        candidates.push(scope.querySelector('.md-search__scrollwrap'));
        candidates.push(scope.querySelector('.mk-search-history'));
        candidates.push(scope.querySelector('.mk-search-suggest'));
      }
      candidates.push(document.querySelector('.md-header .md-search__output'));
      candidates.push(document.querySelector('.md-header .md-search__scrollwrap'));
      candidates.push(document.querySelector('.md-header .mk-search-history'));
      candidates.push(document.querySelector('.md-header .mk-search-suggest'));
    } catch (_) {}

    return candidates.filter(Boolean).some((el) => {
      if (!mwIsVisibleBox(el)) return false;
      try {
        if (el.matches && el.matches('.mk-search-history, .mk-search-suggest')) return true;
        if (el.querySelector && el.querySelector('.mk-search-history.is-active, .mk-search-suggest, .md-search-result__list, .md-search-result')) return true;
      } catch (_) {}
      return true;
    });
  }

  function mwSearchHasQuery(root) {
    try {
      const input = mwHeaderSearchInput(root);
      return !!(input && String(input.value || '').trim());
    } catch (_) {
      return false;
    }
  }

  function mwFocusedInSearch(root) {
    try {
      const activeEl = document.activeElement;
      return !!(activeEl && activeEl.closest && activeEl.closest('.md-search') && (!root || root.contains(activeEl)));
    } catch (_) {
      return false;
    }
  }

  function mwClearStaleHeaderSearch(opts) {
    const options = opts || {};
    try {
      if (options.bootOnly && Date.now() - __mw_boot_at > 3600) return false;
    } catch (_) {}

    const root = mwHeaderSearchRoot();
    const input = mwHeaderSearchInput(root);
    const hasQuery = !!(input && String(input.value || '').trim());
    if (hasQuery) return false;

    let changed = false;

    try {
      if (input && document.activeElement === input && input.blur) {
        input.blur();
        changed = true;
      }
    } catch (_) {}

    try {
      const toggle = mwGetSearchToggle();
      if (toggle && toggle.checked) {
        toggle.checked = false;
        try { toggle.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {}
        changed = true;
      }
    } catch (_) {}

    try {
      [document.documentElement, document.body, root].filter(Boolean).forEach((el) => {
        if (el.classList && el.classList.contains('md-search--active')) {
          el.classList.remove('md-search--active');
          changed = true;
        }
        if (el.removeAttribute) {
          el.removeAttribute('data-md-scrollfix');
        }
      });
    } catch (_) {}

    try {
      document.querySelectorAll('[data-md-scrollfix]').forEach((el) => el.removeAttribute('data-md-scrollfix'));
    } catch (_) {}

    try {
      const body = document.body;
      const html = document.documentElement;
      [html, body].filter(Boolean).forEach((el) => {
        if (!el.style) return;
        ['overflow', 'position', 'top', 'left', 'right', 'height', 'width', 'touch-action'].forEach((prop) => {
          try { el.style.removeProperty(prop); } catch (_) {}
        });
      });
    } catch (_) {}

    return changed;
  }

  function mwIsSearchOpen() {
    const html = document.documentElement;
    const body = document.body;
    const toggle = mwGetSearchToggle();
    const searchRoot = mwHeaderSearchRoot();

    const checked = !!(toggle && toggle.checked);
    const rootActive = !!(searchRoot && searchRoot.classList && searchRoot.classList.contains('md-search--active'));
    const globalActive = !!(
      (html && html.classList && html.classList.contains('md-search--active')) ||
      (body && body.classList && body.classList.contains('md-search--active'))
    );
    const focusedInSearch = mwFocusedInSearch(searchRoot);
    const hasQuery = mwSearchHasQuery(searchRoot);
    const outputOpen = mwSearchOutputLooksOpen(searchRoot);

    // Desktop/fine-pointer pages can preserve stale Material search state after
    // an instant navigation or BFCache restore. Treat a bare checked toggle or
    // md-search--active class as stale unless there is a query, visible search
    // surface, or real focus interaction. Otherwise the mastery widget starts
    // with pointer-events blocked until the user clicks once on the page.
    if (mwIsFinePointerDesktop()) {
      if (hasQuery && (checked || rootActive || globalActive || focusedInSearch || outputOpen)) return true;
      if (focusedInSearch && outputOpen) return true;
      if (checked && outputOpen) return true;
      return false;
    }

    if (checked || rootActive || globalActive) return true;
    if (focusedInSearch) return hasQuery || outputOpen;
    return false;
  }

  function mwHasExplicitRating(rec) {
    return !!(rec && typeof rec.m === "number" && [0, 1, 2, 3].includes(rec.m));
  }

  function mwLevelLabel(m) {
    if (m === 3) return "Mastered";
    if (m === 2) return "Clear";
    if (m === 1) return "Unclear";
    if (m === 0) return "Unknown";
    return "Not rated";
  }

  const MW_COURSE_TAG_MAP = {
    i2da: "Introduction to Data Analytics",
    m1c: "Math I: Calculus",
    orm: "OR Modelling",
    m2la: "Math II: Linear Algebra",
    pt: "Probability Theory for EOR",
    prog: "Programming for EOR",
    fin: "Finance for EOR",
    m3a: "Math III: Analysis",
    micro: "Microeconomics for EOR",
    m4mc: "Math IV: Multivariate Calculus",
    pd: "Probability Distributions",
    sm1: "Statistical Modelling for EOR",
    macro: "Macroeconomics for EOR",
    m5ala: "Math V: Advanced Linear Algebra",
    si: "Statistical Inference",
    lms: "Linear Models in Statistics",
    m6co: "Math VI: Convexity and Optimization",
    sor: "Stochastic Operations Research",
    dor: "Discrete Operations Research",
    i2e: "Introduction to Econometrics",
    li: "Life Insurance",
    gt: "Game Theory",
    ri: "Risk Insurance",
  };

  function mwGetFirstPageTag() {
    const meta =
      document.querySelector('meta[name="tags"]') ||
      document.querySelector('meta[property="tags"]');
    const content = (meta && meta.getAttribute("content")) ? meta.getAttribute("content") : "";
    if (content) {
      const t = content.split(",").map((x) => x.trim()).filter(Boolean)[0];
      if (t) return t;
    }
    const tagEl = document.querySelector(".md-tag");
    const t2 = tagEl ? (tagEl.textContent || "").trim() : "";
    return t2 || "";
  }

  function mwResolveCourseFromTagOrFallback(conceptId) {
    const raw = mwGetFirstPageTag().toLowerCase();
    const key = raw ? raw.split(/[-_]/)[0] : "";
    if (key && MW_COURSE_TAG_MAP[key]) return MW_COURSE_TAG_MAP[key];
    return conceptId.split("/").slice(-2, -1)[0] || "";
  }

  function mwDelay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, Math.max(0, Number(ms) || 0)));
  }

  function mwNextFrame() {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try { if (timer) window.clearTimeout(timer); } catch (_) {}
        resolve();
      };
      let timer = 0;
      try { timer = window.setTimeout(finish, 90); } catch (_) {}
      try { requestAnimationFrame(finish); } catch (_) { finish(); }
    });
  }

  function mwRectCenter(r) {
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function mwBezierQuad(p0, p1, p2, t) {
    const u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    };
  }

  function mwHeaderHeight() {
    try {
      const header = document.querySelector(".md-header");
      if (!header) return 0;
      const r = header.getBoundingClientRect();
      return Math.max(0, Math.round(r.height || 0));
    } catch (_) {
      return 0;
    }
  }

  function mwHeaderOcclusionBottom() {
    let bottom = 0;
    const selectors = [
      ".md-header",
      ".md-tabs"
    ];

    for (const sel of selectors) {
      let el = null;
      try { el = document.querySelector(sel); } catch (_) { el = null; }
      if (!el) continue;

      try {
        const cs = window.getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity || 1) === 0) continue;
      } catch (_) {}

      try {
        const r = el.getBoundingClientRect();
        if (!r || r.width <= 0 || r.height <= 0) continue;
        if (r.bottom <= 0) continue;

        // Treat only the real top chrome as an occluding header surface.
        // This includes Material's tab row when it is visually attached to
        // the header, but avoids clipping against ordinary in-page elements.
        if (r.top <= Math.max(160, bottom + 80)) {
          bottom = Math.max(bottom, Number(r.bottom) || 0);
        }
      } catch (_) {}
    }

    try {
      const vv = window.visualViewport;
      if (vv && Number.isFinite(Number(vv.height))) {
        bottom = Math.min(bottom, Number(vv.height));
      }
    } catch (_) {}

    return Math.max(0, Math.ceil(bottom));
  }

  function mwSyncFlyLayerHeaderClip(layer) {
    const target = layer || document.querySelector(".mw-fly-layer");
    if (!target || !target.style) return;
    try {
      target.style.setProperty("--mw-header-occlusion-bottom", mwHeaderOcclusionBottom() + "px");
    } catch (_) {}
  }

  function mwBindFlyLayerHeaderClipRefresh() {
    if (__mw_fly_layer_clip_bound) return;
    __mw_fly_layer_clip_bound = true;
    const refresh = () => {
      try { mwSyncFlyLayerHeaderClip(); } catch (_) {}
    };
    try { window.addEventListener("resize", refresh, { passive: true }); } catch (_) {}
    try { window.addEventListener("orientationchange", refresh, { passive: true }); } catch (_) {}
    try {
      if (window.visualViewport && typeof window.visualViewport.addEventListener === "function") {
        window.visualViewport.addEventListener("resize", refresh, { passive: true });
        window.visualViewport.addEventListener("scroll", refresh, { passive: true });
      }
    } catch (_) {}
    try { document.addEventListener("DOMContentSwitch", refresh); } catch (_) {}
  }

      function mwDockTop() {
    const hh = Math.max(0, mwHeaderHeight());
    if (window.innerWidth <= 720) return Math.max(0, hh - 8);
    return hh + 12;
  }

  function mwCompactTop(compactEl) {
    const hh = Math.max(0, mwHeaderHeight());
    const ch = Math.max(44, Number(compactEl && compactEl.offsetHeight) || 0);
    if (hh > 0) return Math.max(4, Math.round((hh - ch) / 2));
    return 8;
  }

  function mwMapIconSvg(size) {
    const s = Number(size) || 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 6l-6 2-6-2v14l6 2 6-2 6 2V8z"></path><path d="M9 8v14"></path><path d="M15 6v14"></path></svg>`;
  }

  function mwOpenConceptMap() {
    try {
      const modal = document.getElementById("lp-map-modal");
      if (modal && typeof modal.__lpOpen === "function") {
        modal.__lpOpen();
        return;
      }
    } catch (_) {}
    try {
      const opener = document.querySelector("[data-lp-open-map]");
      if (opener && typeof opener.click === "function") {
        opener.click();
        return;
      }
    } catch (_) {}
  }

  function mwEnsureMapButton(h1) {
    if (!h1) return null;
    try {
      h1.querySelectorAll(":scope > .lp-h1-map:not(.mw-h1-manage), :scope > [data-lp-h1-open-map]").forEach((node) => {
        try { node.remove(); } catch (_) {}
      });
    } catch (_) {}
    return null;
  }

  function mwGetContentRect() {
    const inner = document.querySelector("article.md-content__inner");
    if (inner) {
      const r = inner.getBoundingClientRect();
      if (r && r.width > 0) {
        return { left: r.left, width: r.width, right: r.right };
      }
    }
    return { left: 16, width: Math.max(280, window.innerWidth - 32), right: window.innerWidth - 16 };
  }


  function mwLooksUsableCssColor(value) {
    const s = String(value || "").trim();
    if (!s) return false;
    if (s === "transparent") return false;
    if (/rgba?\([^)]*,\s*0\s*\)$/i.test(s)) return false;
    return true;
  }

  function mwResolveSectionLineColor() {
    const selectors = [
      "article.md-content__inner hr",
      ".md-content .md-typeset hr",
      ".md-content hr"
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      try {
        const cs = window.getComputedStyle(el);
        const candidates = [cs.borderTopColor, cs.borderColor, cs.color];
        for (const candidate of candidates) {
          if (mwLooksUsableCssColor(candidate)) return String(candidate).trim();
        }
      } catch (_) {}
    }

    try {
      const rootCs = window.getComputedStyle(document.documentElement);
      const vars = [
        rootCs.getPropertyValue("--md-default-fg-color--lightest"),
        rootCs.getPropertyValue("--md-default-fg-color--lighter"),
        rootCs.getPropertyValue("--md-default-fg-color")
      ];
      for (const candidate of vars) {
        if (mwLooksUsableCssColor(candidate)) return String(candidate).trim();
      }
    } catch (_) {}

    try {
      const scheme = String(document.documentElement.getAttribute("data-md-color-scheme") || (document.body && document.body.getAttribute("data-md-color-scheme")) || "").toLowerCase();
      if (scheme === "slate") return "rgba(210, 215, 233, 0.12)";
      if (scheme === "default") return "rgba(0, 0, 0, 0.07)";
    } catch (_) {}
    return "";
  }

  function mwSyncSectionLineColor(target) {
    const color = mwResolveSectionLineColor();
    if (!color) return;
    const apply = (el) => {
      if (!el || !el.style) return;
      try { el.style.setProperty("--mw-section-line-color", color); } catch (_) {}
    };
    apply(document.documentElement);
    apply(document.body);
    if (target && target.anchor) apply(target.anchor);
    if (target && target.box) apply(target.box);
    if (target && target.compact) apply(target.compact);
    if (target && target.nodeType === 1) apply(target);
  }

  function mwIsTopContextSibling(node) {
    if (!node || !node.matches) return false;
    return !!node.matches(
      '#lp-course-lecture, .lp-course-lecture, .lp-top-why'
    );
  }

  function mwFindWidgetInsertAfter(inner, h1) {
    if (!inner || !h1) return h1 || null;
    let target = h1;
    let cursor = h1.nextElementSibling;
    while (cursor && mwIsTopContextSibling(cursor)) {
      target = cursor;
      cursor = cursor.nextElementSibling;
    }
    return target;
  }

  function mwOpenMasteryManager() {
    try { mwClearFlyGhosts(); } catch (_) {}
    try {
      if (window.MasteryManager && typeof window.MasteryManager.open === "function") {
        window.MasteryManager.open();
      }
    } catch (_) {}
  }

  function mwEnsureH1ManageButton(sc) {
    if (!sc || !sc.left) return null;
    let btn = sc.left.querySelector(":scope > .mw-h1-manage");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lp-h1-map mw-h1-manage";
      btn.title = "Manage mastery";
      btn.setAttribute("aria-label", "Manage mastery");
      btn.innerHTML = mwGearHtml();
      if (sc.badge && sc.badge.parentNode === sc.left) sc.left.insertBefore(btn, sc.badge);
      else if (sc.titleText && sc.titleText.parentNode === sc.left) sc.left.insertBefore(btn, sc.titleText);
      else sc.left.insertBefore(btn, sc.left.firstChild || null);
    }
    return btn;
  }

  function mwSetHiddenTitleMode(sc, hidden) {
    if (!sc || !sc.h1) return;
    const isHidden = !!hidden;
    try { sc.h1.classList.toggle("mw-widget-hidden-mode", isHidden); } catch (_) {}

    const btn = mwEnsureH1ManageButton(sc);
    const badge = sc.badge || (sc.left && sc.left.querySelector ? sc.left.querySelector(":scope > .mw-title-badge") : null);
    const badgeM = badge ? Number(badge.getAttribute("data-m")) : NaN;
    const hasExplicitRating = Number.isFinite(badgeM) && [0, 1, 2, 3].includes(badgeM) && !!String(badge.innerHTML || "").trim();
    const hiddenIcon = isHidden ? (hasExplicitRating ? "badge" : "manage") : "none";

    try {
      if (hiddenIcon === "none") sc.h1.removeAttribute("data-mw-hidden-icon");
      else sc.h1.setAttribute("data-mw-hidden-icon", hiddenIcon);
    } catch (_) {}

    if (isHidden) {
      if (hasExplicitRating) {
        if (badge) {
          badge.classList.add("is-visible");
          badge.classList.remove("is-armed", "mw-flight-hidden");
          try { mwForceBadgeTheme(badge, badgeM); } catch (_) {}
        }
        if (btn) btn.classList.remove("is-visible", "is-armed", "mw-flight-hidden");
        mwClearManageTitleReserve(sc);
      } else {
        if (btn) {
          btn.classList.add("is-visible");
          btn.classList.remove("is-armed", "mw-flight-hidden");
        }
        if (badge) {
          badge.classList.remove("is-visible", "is-armed", "mw-flight-hidden");
          try { badge.style.removeProperty("color"); } catch (_) {}
        }
      }
    } else {
      if (btn) btn.classList.remove("is-visible", "is-armed", "mw-flight-hidden");
      if (!hasExplicitRating && badge) {
        badge.classList.remove("is-visible", "is-armed", "mw-flight-hidden");
        try { badge.style.removeProperty("color"); } catch (_) {}
      }
      mwClearManageTitleReserve(sc);
    }

    if (isHidden && btn && !hasExplicitRating) {
      mwClearManageTitleReserve(sc);
    }
  }

    function mwCloseTitleMenu() {
    try {
      if (typeof __mw_title_menu_close === "function") __mw_title_menu_close();
    } catch (_) {}
    __mw_title_menu_close = null;
    __mw_title_menu_anchor = null;
  }

  function mwGetReadinessRoots(state) {
    const roots = [state && state.box, state && state.compact];
    try {
      const menu = document.querySelector('.mw-title-menu');
      if (menu) roots.push(menu);
    } catch (_) {}
    return roots.filter(Boolean);
  }

  function mwSyncTitleMenuLiveState(state) {
    if (!state || typeof state !== "object") return state;
    try { state.widgetHidden = mwReadWidgetHidden(); } catch (_) {}
    try {
      const rec = window.ConceptMastery && typeof window.ConceptMastery.get === "function"
        ? window.ConceptMastery.get(state.conceptId)
        : null;
      const hasExplicitRating = mwHasExplicitRating(rec);
      state.hasExplicitRating = hasExplicitRating;
      state.currentM = hasExplicitRating ? rec.m : null;
    } catch (_) {}
    return state;
  }


  function mwIsPrimaryActivationEvent(ev) {
    try {
      if (!ev) return true;
      if (ev.isPrimary === false) return false;
      if (typeof ev.button === "number" && ev.button !== 0) return false;
      return true;
    } catch (_) {
      return true;
    }
  }

  function mwPointFromEvent(ev) {
    try {
      if (!ev) return { x: 0, y: 0 };
      const t = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]) || ev;
      return { x: Number(t.clientX) || 0, y: Number(t.clientY) || 0 };
    } catch (_) {
      return { x: 0, y: 0 };
    }
  }

  function mwStopTitleTriggerEvent(ev) {
    try { if (ev && ev.cancelable !== false) ev.preventDefault(); } catch (_) {}
    try { ev && ev.stopPropagation && ev.stopPropagation(); } catch (_) {}
    try { ev && ev.stopImmediatePropagation && ev.stopImmediatePropagation(); } catch (_) {}
  }

  function mwPageActionMenuOverlayVisible() {
    try {
      const visible = (el) => {
        try {
          if (!el || el.hidden) return false;
          return !!(el.getClientRects && el.getClientRects().length);
        } catch (_) {
          return false;
        }
      };
      const menu = document.querySelector('.mk-page-action-menu[data-mk-body-menu="1"]');
      const shield = document.querySelector('.mk-page-action-shield[data-mk-page-action-shield="1"]');
      return visible(menu) || visible(shield);
    } catch (_) {
      return false;
    }
  }

  function mwPageActionMenuGuardActive(ev) {
    try {
      if (!mwPageActionMenuOverlayVisible()) {
        try { if (window.__mkPageActionMenuOpen === true) window.__mkPageActionMenuOpen = false; } catch (_) {}
        return false;
      }
      const target = ev && ev.target;
      if (target && target.closest && target.closest(".mk-page-action-menu,.mk-page-action-wrap,.mk-page-action-shield")) return true;
      return true;
    } catch (_) {
      return false;
    }
  }

  function mwToggleTitleMenuFromTrigger(state, anchorEl, requireExplicitRating) {
    if (!anchorEl) return;
    mwSyncTitleMenuLiveState(state);
    if (requireExplicitRating && (!state || !state.hasExplicitRating)) return;
    const existing = document.querySelector(".mw-title-menu");
    if (existing && __mw_title_menu_anchor === anchorEl) {
      mwCloseTitleMenu();
      return;
    }
    mwOpenTitleMenu(state, anchorEl);
  }

  function mwBindStableTitleMenuPress(el, getState, opts) {
    if (!el || el.__mwStableTitleMenuPressBound) return;
    el.__mwStableTitleMenuPressBound = true;

    const requireExplicitRating = !!(opts && opts.requireExplicitRating);
    const maxMove = Math.max(6, Number(opts && opts.maxMove) || 12);
    let press = null;
    let lastActivationAt = 0;

    const currentState = () => {
      try { return typeof getState === "function" ? getState() : null; } catch (_) { return null; }
    };

    const activate = (ev) => {
      if (mwPageActionMenuGuardActive(ev)) return;
      const state = currentState();
      if (requireExplicitRating) mwSyncTitleMenuLiveState(state);
      if (requireExplicitRating && (!state || !state.hasExplicitRating)) return;
      lastActivationAt = Date.now();
      mwToggleTitleMenuFromTrigger(state, el, requireExplicitRating);
    };

    const onPointerDown = (ev) => {
      if (mwPageActionMenuGuardActive(ev)) return;
      if (!mwIsPrimaryActivationEvent(ev)) return;
      const pt = mwPointFromEvent(ev);
      press = { id: ev.pointerId, x: pt.x, y: pt.y, t: Date.now() };
      try { mwArmTitleSelectionGuard(mwClosestTitleH1(el), 1200); } catch (_) {}
      try { if (el.setPointerCapture && ev.pointerId != null) el.setPointerCapture(ev.pointerId); } catch (_) {}
      mwStopTitleTriggerEvent(ev);
      try { mwClearSelectionIfTouches(mwClosestTitleH1(el)); } catch (_) {}
    };

    const onPointerUp = (ev) => {
      if (!press) return;
      if (press.id != null && ev.pointerId != null && press.id !== ev.pointerId) return;
      const pt = mwPointFromEvent(ev);
      const dx = Math.abs(pt.x - press.x);
      const dy = Math.abs(pt.y - press.y);
      press = null;
      try { if (el.releasePointerCapture && ev.pointerId != null) el.releasePointerCapture(ev.pointerId); } catch (_) {}
      mwStopTitleTriggerEvent(ev);
      if (dx <= maxMove && dy <= maxMove) activate(ev);
    };

    const cancelPress = (ev) => {
      press = null;
      try { if (ev && el.releasePointerCapture && ev.pointerId != null) el.releasePointerCapture(ev.pointerId); } catch (_) {}
    };

    const onClick = (ev) => {
      mwStopTitleTriggerEvent(ev);
      if (Date.now() - lastActivationAt < 650) return;
      activate(ev);
    };

    const onKeyDown = (ev) => {
      const key = String(ev && ev.key || "");
      if (key !== "Enter" && key !== " ") return;
      mwStopTitleTriggerEvent(ev);
      activate(ev);
    };

    const onMouseDown = (ev) => {
      if (mwPageActionMenuGuardActive(ev)) return;
      // Pointer Events are the normal path on modern desktop browsers.  Keep
      // mousedown as a real fallback for older/embedded browsers only, instead
      // of cancelling it unconditionally.
      if (window.PointerEvent) {
        mwStopTitleTriggerEvent(ev);
        return;
      }
      if (!mwIsPrimaryActivationEvent(ev)) return;
      const pt = mwPointFromEvent(ev);
      press = { id: "mouse", x: pt.x, y: pt.y, t: Date.now() };
      try { mwArmTitleSelectionGuard(mwClosestTitleH1(el), 1200); } catch (_) {}
      mwStopTitleTriggerEvent(ev);
      try { mwClearSelectionIfTouches(mwClosestTitleH1(el)); } catch (_) {}
    };

    const onMouseUp = (ev) => {
      if (window.PointerEvent) return;
      if (!press || press.id !== "mouse") return;
      const pt = mwPointFromEvent(ev);
      const dx = Math.abs(pt.x - press.x);
      const dy = Math.abs(pt.y - press.y);
      press = null;
      mwStopTitleTriggerEvent(ev);
      if (dx <= maxMove && dy <= maxMove) activate(ev);
    };

    try { el.addEventListener("pointerdown", onPointerDown, { capture: true, passive: false }); } catch (_) { el.addEventListener("pointerdown", onPointerDown, true); }
    try { el.addEventListener("pointerup", onPointerUp, { capture: true, passive: false }); } catch (_) { el.addEventListener("pointerup", onPointerUp, true); }
    try { el.addEventListener("pointercancel", cancelPress, { capture: true, passive: true }); } catch (_) { el.addEventListener("pointercancel", cancelPress, true); }
    try { el.addEventListener("mousedown", onMouseDown, { capture: true, passive: false }); } catch (_) { el.addEventListener("mousedown", onMouseDown, true); }
    try { el.addEventListener("mouseup", onMouseUp, { capture: true, passive: false }); } catch (_) { el.addEventListener("mouseup", onMouseUp, true); }
    try { el.addEventListener("click", onClick, { capture: true, passive: false }); } catch (_) { el.addEventListener("click", onClick, true); }
    try { el.addEventListener("dblclick", mwStopTitleTriggerEvent, { capture: true, passive: false }); } catch (_) { el.addEventListener("dblclick", mwStopTitleTriggerEvent, true); }
    try { el.addEventListener("selectstart", mwStopTitleTriggerEvent, { capture: true, passive: false }); } catch (_) { el.addEventListener("selectstart", mwStopTitleTriggerEvent, true); }
    try { el.addEventListener("keydown", onKeyDown, { capture: true, passive: false }); } catch (_) { el.addEventListener("keydown", onKeyDown, true); }
  }

  let __mw_title_select_guard_until = 0;
  let __mw_title_select_guard_h1 = null;
  let __mw_title_select_guard_timer = 0;

  function mwClosestTitleH1(el) {
    try {
      return el && el.closest ? el.closest("article.md-content__inner h1.lp-h1-row") : null;
    } catch (_) {
      return null;
    }
  }

  function mwIsTitleControlTarget(target) {
    try {
      return !!(target && target.closest && target.closest(".mw-title-badge, .mw-h1-manage"));
    } catch (_) {
      return false;
    }
  }

  function mwSelectionTouchesNode(root) {
    try {
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount < 1 || sel.isCollapsed) return false;
      const a = sel.anchorNode;
      const f = sel.focusNode;
      return !!(root && ((a && root.contains(a)) || (f && root.contains(f))));
    } catch (_) {
      return false;
    }
  }

  function mwClearSelectionIfTouches(root) {
    try {
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount < 1) return;
      if (!root || !mwSelectionTouchesNode(root)) return;
      sel.removeAllRanges();
    } catch (_) {}
  }

  function mwArmTitleSelectionGuard(h1, ms) {
    if (!h1) return;
    __mw_title_select_guard_until = Date.now() + Math.max(350, Number(ms) || 900);
    __mw_title_select_guard_h1 = h1;
    try { h1.classList.add("mw-title-no-select"); } catch (_) {}
    try { if (__mw_title_select_guard_timer) clearTimeout(__mw_title_select_guard_timer); } catch (_) {}
    __mw_title_select_guard_timer = window.setTimeout(() => {
      try {
        if (Date.now() >= __mw_title_select_guard_until && __mw_title_select_guard_h1) {
          __mw_title_select_guard_h1.classList.remove("mw-title-no-select");
          __mw_title_select_guard_h1 = null;
        }
      } catch (_) {}
    }, Math.max(380, Number(ms) || 900) + 80);
  }

  function mwTitleSelectionGuardActive(h1) {
    try {
      return !!(h1 && __mw_title_select_guard_h1 === h1 && Date.now() < __mw_title_select_guard_until);
    } catch (_) {
      return false;
    }
  }

  function mwInstallTitleSelectionGuard(sc) {
    if (!sc || !sc.h1 || sc.h1.__mwTitleSelectionGuardBound) return;
    sc.h1.__mwTitleSelectionGuardBound = true;

    const h1 = sc.h1;

    const onPress = (ev) => {
      if (!mwIsTitleControlTarget(ev && ev.target)) return;
      // Important: do not prevent/stop pointerdown or mousedown here.
      // This listener is on the H1 in the capture phase.  If it cancels the
      // press, the badge/manage button may never receive its own pointerdown,
      // and on some desktop browsers the following click is suppressed too.
      // The target control owns activation; this guard only blocks accidental
      // text selection around the title.
      mwArmTitleSelectionGuard(h1, 1200);
      try { mwClearSelectionIfTouches(h1); } catch (_) {}
    };

    const onSelectStart = (ev) => {
      const target = ev && ev.target;
      const fromControl = mwIsTitleControlTarget(target);
      const protectedTitle = !!(h1.hasAttribute("data-mw-level") || h1.hasAttribute("data-mw-hidden-icon") || h1.classList.contains("mw-title-no-select"));
      const inTitleRow = !!(target && target.closest && target.closest(".lp-h1-left"));
      if (!fromControl && !(protectedTitle && inTitleRow)) return;
      mwArmTitleSelectionGuard(h1, 900);
      mwStopTitleTriggerEvent(ev);
      try { mwClearSelectionIfTouches(h1); } catch (_) {}
    };

    const onDragStart = (ev) => {
      if (!mwIsTitleControlTarget(ev && ev.target)) return;
      mwArmTitleSelectionGuard(h1, 900);
      mwStopTitleTriggerEvent(ev);
    };

    try { h1.addEventListener("pointerdown", onPress, { capture: true, passive: false }); } catch (_) { h1.addEventListener("pointerdown", onPress, true); }
    try { h1.addEventListener("mousedown", onPress, { capture: true, passive: false }); } catch (_) { h1.addEventListener("mousedown", onPress, true); }
    try { h1.addEventListener("dblclick", onPress, { capture: true, passive: false }); } catch (_) { h1.addEventListener("dblclick", onPress, true); }
    try { h1.addEventListener("selectstart", onSelectStart, { capture: true, passive: false }); } catch (_) { h1.addEventListener("selectstart", onSelectStart, true); }
    try { h1.addEventListener("dragstart", onDragStart, { capture: true, passive: false }); } catch (_) { h1.addEventListener("dragstart", onDragStart, true); }

    if (!document.__mwTitleSelectionChangeBound) {
      document.__mwTitleSelectionChangeBound = true;
      try {
        document.addEventListener("selectionchange", () => {
          const active = __mw_title_select_guard_h1;
          if (!active) return;
          if (Date.now() >= __mw_title_select_guard_until) return;
          mwClearSelectionIfTouches(active);
        }, true);
      } catch (_) {}
    }
  }

  function mwMeasureTitleMenuTopWidth(top, levels, sep, extras) {
    const parts = [levels, sep, extras].filter(Boolean);
    if (!parts.length) return 0;
    let total = 0;
    parts.forEach((el) => {
      const rect = mwReadRectSafe(el);
      const w = rect && rect.width ? rect.width : Math.max(Number(el && el.scrollWidth) || 0, Number(el && el.offsetWidth) || 0);
      total += Math.ceil(w || 0);
    });
    let gap = 0;
    try {
      const cs = getComputedStyle(top);
      gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
    } catch (_) {}
    if (parts.length > 1) total += Math.ceil(gap * (parts.length - 1));
    return total;
  }

  function mwApplyTitleMenuAdaptiveWidth(menu, top, sections) {
    if (!menu || !top) return 0;
    let padX = 20;
    try {
      const cs = getComputedStyle(menu);
      const pl = parseFloat(cs.paddingLeft || '0') || 0;
      const pr = parseFloat(cs.paddingRight || '0') || 0;
      const bl = parseFloat(cs.borderLeftWidth || '0') || 0;
      const br = parseFloat(cs.borderRightWidth || '0') || 0;
      padX = Math.ceil(pl + pr + bl + br);
    } catch (_) {}

    const topWidth = Math.max(0, mwMeasureTitleMenuTopWidth(
      top,
      top.querySelector('.mw-title-menu-levels'),
      top.querySelector('.mw-title-menu-sep'),
      top.querySelector('.mw-title-menu-extras')
    ));
    const maxAllowed = Math.max(180, window.innerWidth - 20);
    const baseDesired = Math.max(0, Math.min(maxAllowed, topWidth + padX));

    // Break the feedback loop that made the H1/compact title menu grow wider
    // every time the inline readiness section was hovered.  The inline section
    // is allowed to stretch to the current menu width, so measuring it while the
    // menu is already wide reads the old wide width back as a new requirement.
    // Reset to the top-row baseline first, then measure only real horizontal
    // overflow from the open section.
    try { menu.style.minWidth = ''; } catch (_) {}
    if (baseDesired > 0) {
      try { menu.style.width = `${baseDesired}px`; } catch (_) {}
    }

    let contentWidth = topWidth;
    let hasOpenSection = false;
    (Array.isArray(sections) ? sections : []).forEach((el) => {
      if (!el || el.hidden) return;
      hasOpenSection = true;
      let w = 0;
      try { w = Math.max(w, Number(el.scrollWidth) || 0); } catch (_) {}
      try {
        const first = el.firstElementChild;
        if (first) w = Math.max(w, Number(first.scrollWidth) || 0);
      } catch (_) {}
      contentWidth = Math.max(contentWidth, Math.ceil(w || 0));
    });

    const desired = Math.max(0, Math.min(maxAllowed, contentWidth + padX));
    menu.style.width = desired > 0 ? `${desired}px` : 'max-content';
    menu.style.minWidth = (!hasOpenSection && desired > 0) ? `${desired}px` : '';
    return desired;
  }

  function mwOpenTitleMenu(state, anchorEl) {
    mwCloseTitleMenu();
    if (!state || !anchorEl) return;
    mwSyncTitleMenuLiveState(state);

    const menu = document.createElement("div");
    menu.className = "mw-title-menu";

    const levels = document.createElement("div");
    levels.className = "mw-title-menu-levels";

    [3, 2, 1, 0].forEach((m) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mw-title-menu-btn";
      btn.title = mwLevelLabel(m);
      btn.setAttribute("aria-label", mwLevelLabel(m));
      btn.setAttribute("data-m", String(m));
      try { mwSyncEffectTierAttr(btn, m); } catch (_) {}
      btn.innerHTML = mwSvgForLevel(m, 18);
      if (state.hasExplicitRating && Number(state.currentM) === m) {
        btn.classList.add("is-current");
        btn.setAttribute("aria-current", "true");
      }
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (state.hasExplicitRating && Number(state.currentM) === m) {
          mwCloseTitleMenu();
          return;
        }
        if (!mwConsumeGuestAction("mastery", { source: "mastery-title-menu", path: state.conceptId || currentRelPath(), title: state.meta && state.meta.title || document.title || "", level: m, dedupeMs: 2500 })) {
          mwCloseTitleMenu();
          return;
        }
        try {
          if (window.MasterySelfCheckGuard && typeof window.MasterySelfCheckGuard.guard === "function") {
            const proceed = await window.MasterySelfCheckGuard.guard(state.conceptId, m, state.meta, { source: "title-menu" });
            if (!proceed) {
              mwCloseTitleMenu();
              return;
            }
          }
        } catch (_) {}
        mwCloseTitleMenu();
        try {
          state.hasExplicitRating = true;
          state.currentM = m;
        } catch (_) {}
        try {
          const sc = mwEnsureTitleScaffold();
          if (sc && sc.badge) {
            sc.badge.setAttribute("data-m", String(m));
            sc.badge.innerHTML = mwSvgForLevel(m, 18);
            mwForceBadgeTheme(sc.badge, m);
          }
          if (sc) mwSetHiddenTitleMode(sc, !!mwReadWidgetHidden());
        } catch (_) {}
        try {
          if (typeof window.ConceptMastery.rate === "function") {
            window.ConceptMastery.rate(state.conceptId, m, state.meta, {
              source: "title-menu",
              visitId: mwVisitId(state.conceptId),
            });
          } else if (typeof window.ConceptMastery.set === "function") {
            window.ConceptMastery.set(state.conceptId, m, state.meta);
          }
        } catch (_) {}
      });
      levels.appendChild(btn);
    });

    const sep = document.createElement("span");
    sep.className = "mw-title-menu-sep";
    sep.setAttribute("aria-hidden", "true");

    const readyBtn = document.createElement("button");
    readyBtn.type = "button";
    readyBtn.className = "mw-title-menu-btn mw-title-menu-btn--ready";
    readyBtn.title = "Prerequisite readiness";
    readyBtn.setAttribute("aria-label", "Prerequisite readiness");
    readyBtn.setAttribute("aria-expanded", "false");
    readyBtn.setAttribute("data-mw-ready-trigger", "1");
    readyBtn.innerHTML = `<span class="mw-ready-chip-pct">${(state && state.readinessData && state.readinessData.status === "ok") ? `${mwClampReadinessPct(state.readinessData.pct)}%` : "..."}</span>`;
    readyBtn.disabled = !(state && state.readinessData && state.readinessData.status === "ok");

    const recapBtn = document.createElement("button");
    recapBtn.type = "button";
    recapBtn.className = "mw-title-menu-btn mw-title-menu-btn--recap";
    recapBtn.title = "Mastery recap";
    recapBtn.setAttribute("aria-label", "Mastery recap");
    recapBtn.setAttribute("aria-expanded", "false");
    recapBtn.innerHTML = mwRecapIconHtml(18);

    const aiQuizBtn = document.createElement("button");
    aiQuizBtn.type = "button";
    aiQuizBtn.className = "mw-title-menu-btn mw-title-menu-btn--ai";
    aiQuizBtn.innerHTML = mwAiQuizIconHtml(18);
    mwSyncAiQuizButton(aiQuizBtn);
    mwBindTouchSafeButton(aiQuizBtn, () => {
      if (aiQuizBtn.disabled || aiQuizBtn.hidden) return;
      mwOpenAiQuizFromTitleMenu(aiQuizBtn);
    });

    const manageBtn = document.createElement("button");
    manageBtn.type = "button";
    manageBtn.className = "mw-title-menu-btn mw-title-menu-btn--manage";
    manageBtn.title = "Manage mastery";
    manageBtn.setAttribute("aria-label", "Manage mastery");
    manageBtn.innerHTML = mwGearHtml();
    manageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      mwCloseTitleMenu();
      mwOpenMasteryManager();
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "mw-title-menu-btn mw-title-menu-btn--toggle";
    const currentlyHidden = !!mwReadWidgetHidden();
    const hasExplicitRatingNow = !!(state && state.hasExplicitRating);
    try { state.widgetHidden = currentlyHidden; } catch (_) {}
    toggleBtn.title = currentlyHidden ? "Show mastery bar" : "Hide mastery bar";
    toggleBtn.setAttribute("aria-label", currentlyHidden ? "Show mastery bar" : "Hide mastery bar");
    toggleBtn.innerHTML = currentlyHidden ? mwUnhideIconHtml() : mwHideIconHtml();
    if (hasExplicitRatingNow) {
      toggleBtn.disabled = true;
      toggleBtn.title = "Hide/show is only available before this page has a mastery rating";
      toggleBtn.setAttribute("aria-label", "Hide/show unavailable after this page has a mastery rating");
    }
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (toggleBtn.disabled) return;
      mwCloseTitleMenu();
      try { state.widgetHidden = !currentlyHidden; } catch (_) {}
      try { mwWriteWidgetForceOpen(state && state.conceptId, !!currentlyHidden); } catch (_) {}
      mwWriteWidgetHidden(!currentlyHidden);
      if (!currentlyHidden) {
        const sc = mwEnsureTitleScaffold();
        if (sc) {
          mwSetHiddenTitleMode(sc, true);
          const pulseTarget = (state && state.hasExplicitRating && sc.badge && String(sc.badge.innerHTML || "").trim())
            ? sc.badge
            : sc.manageBtn;
          try { if (pulseTarget) mwPulseOnce(pulseTarget); } catch (_) {}
        }
      }
      window.setTimeout(() => {
        try { renderWidget(); } catch (_) {}
      }, 0);
    });

    const extras = document.createElement("div");
    extras.className = "mw-title-menu-extras";
    extras.appendChild(readyBtn);
    extras.appendChild(aiQuizBtn);
    extras.appendChild(recapBtn);
    extras.appendChild(manageBtn);
    // Do not show the hide/unhide toggle in the H1 menu after this page has
    // an explicit mastery rating.  At that point the widget is represented by
    // the title badge/line, and a disabled eye icon reads like an actionable
    // unhide control.
    if (!currentlyHidden && !hasExplicitRatingNow) extras.appendChild(toggleBtn);

    const top = document.createElement("div");
    top.className = "mw-title-menu-top";
    top.appendChild(levels);
    top.appendChild(sep);
    top.appendChild(extras);

    const readinessHost = document.createElement("div");
    readinessHost.className = "mw-title-menu-section";
    readinessHost.setAttribute("data-mw-ready-inline", "1");
    readinessHost.hidden = true;

    const recapHost = document.createElement("div");
    recapHost.className = "mw-title-menu-section mw-recap";
    recapHost.setAttribute("data-mw-recap", "menu");
    recapHost.hidden = true;

    menu.appendChild(top);
    menu.appendChild(readinessHost);
    menu.appendChild(recapHost);
    document.body.appendChild(menu);
    menu.dataset.mwTitleMenu = "1";
    __mw_title_menu_anchor = anchorEl;
    try { anchorEl.setAttribute("aria-expanded", "true"); } catch (_) {}

    state.titleMenuEl = menu;
    state.titleMenuReadyBtn = readyBtn;
    state.titleMenuRecapBtn = recapBtn;
    state.titleMenuReadinessHost = readinessHost;
    state.titleMenuRecapHost = recapHost;
    state.titleMenuActiveSection = "";
    state.titleMenuHideTimer = 0;

    const refreshMenuWidth = () => {
      return mwApplyTitleMenuAdaptiveWidth(menu, top, [readinessHost, recapHost]);
    };
    state.titleMenuRefreshWidth = refreshMenuWidth;

    const place = () => {
      const r = anchorEl.getBoundingClientRect();
      const desiredTop = Math.max(8, r.bottom + 8);
      const availableBelow = Math.max(96, window.innerHeight - desiredTop - 8);
      let topRowHeight = 52;
      try {
        const topRect = top && top.getBoundingClientRect ? top.getBoundingClientRect() : null;
        if (topRect && topRect.height) topRowHeight = Math.ceil(topRect.height);
      } catch (_) {}
      const sectionMax = Math.max(110, Math.min(290, availableBelow - topRowHeight - 28));
      try {
        menu.style.setProperty("--mw-title-menu-available-below", `${Math.floor(availableBelow)}px`);
        menu.style.setProperty("--mw-title-menu-section-max", `${Math.floor(sectionMax)}px`);
      } catch (_) {}

      const menuRect = menu.getBoundingClientRect();
      const w = Math.ceil(menuRect.width || menu.scrollWidth || menu.offsetWidth || 208);
      let left = r.left + r.width / 2 - w / 2;
      left = Math.max(8, Math.min(window.innerWidth - w - 8, left));

      // Keep the mastery popover anchored below the clicked readiness/recap icon.
      // Previously the full menu height was clamped to the viewport; when the
      // prerequisite list was tall, that clamp moved the whole popover upward,
      // so the list appeared above the icon.  The section itself is now the
      // scrollport, and its max-height is reduced to the real space below the
      // trigger instead of moving the popover.
      menu.style.left = `${Math.round(left)}px`;
      menu.style.top = `${Math.round(desiredTop)}px`;
    };
    state.titleMenuPlace = place;

    function clearHideTimer() {
      if (!state.titleMenuHideTimer) return;
      try { clearTimeout(state.titleMenuHideTimer); } catch (_) {}
      state.titleMenuHideTimer = 0;
    }

    function hideSectionsNow() {
      clearHideTimer();
      state.titleMenuActiveSection = "";
      syncSections();
    }

    function syncSections() {
      const active = String(state.titleMenuActiveSection || "");
      readyBtn.setAttribute("aria-expanded", active === "readiness" ? "true" : "false");
      recapBtn.setAttribute("aria-expanded", active === "recap" ? "true" : "false");
      readinessHost.hidden = active !== "readiness";
      recapHost.hidden = active !== "recap";
      if (active === "readiness") {
        try {
          if (typeof state.renderReadinessNow === "function") state.renderReadinessNow(state.readinessData);
        } catch (_) {}
      }
      if (active === "recap") {
        try {
          if (typeof state.renderRecapNow === "function") state.renderRecapNow(place);
        } catch (_) {}
      }
      try {
        refreshMenuWidth();
        place();
      } catch (_) {}
    }

    function showSection(name) {
      clearHideTimer();
      state.titleMenuActiveSection = String(name || "");
      syncSections();
    }

    function hideSectionsSoon(delayMs) {
      clearHideTimer();
      state.titleMenuHideTimer = window.setTimeout(() => {
        state.titleMenuHideTimer = 0;
        state.titleMenuActiveSection = "";
        syncSections();
      }, Math.max(0, Number(delayMs) || 60));
    }

    const supportsHover = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

    function bindSection(btn, host, name) {
      if (!btn || !host) return;
      btn.addEventListener("mouseenter", () => {
        if (!supportsHover || btn.disabled) return;
        showSection(name);
      });
      btn.addEventListener("mouseleave", () => {
        if (!supportsHover) return;
        hideSectionsSoon(56);
      });
      host.addEventListener("mouseenter", () => {
        clearHideTimer();
      });
      host.addEventListener("mouseleave", () => {
        if (!supportsHover) return;
        hideSectionsSoon(40);
      });
      btn.addEventListener("focus", () => {
        if (btn.disabled) return;
        showSection(name);
      });
      btn.addEventListener("click", (e) => {
        if (btn.disabled) return;
        if (supportsHover) return;
        e.preventDefault();
        e.stopPropagation();
        state.titleMenuActiveSection = state.titleMenuActiveSection === name ? "" : name;
        syncSections();
      });
    }

    bindSection(readyBtn, readinessHost, "readiness");
    bindSection(recapBtn, recapHost, "recap");

    menu.addEventListener("mouseenter", () => {
      clearHideTimer();
    });
    menu.addEventListener("mouseleave", () => {
      if (!supportsHover) return;
      hideSectionsNow();
    });

    refreshMenuWidth();
    place();
    try {
      if (typeof state.renderReadinessNow === "function") state.renderReadinessNow(state.readinessData);
      else if (typeof state.bindReadinessTriggersNow === "function") state.bindReadinessTriggersNow();
    } catch (_) {}
    try {
      if (typeof state.renderRecapNow === "function") state.renderRecapNow(place);
    } catch (_) {}
    syncSections();
    refreshMenuWidth();
    place();

    const onDoc = (e) => {
      if (menu.contains(e.target) || anchorEl.contains(e.target)) return;
      mwCloseTitleMenu();
    };
    const onKey = (e) => {
      if (e.key === "Escape") mwCloseTitleMenu();
    };
    const onAiQuizAvailability = () => {
      try {
        mwSyncAiQuizButton(aiQuizBtn);
        refreshMenuWidth();
        place();
      } catch (_) {}
    };

    document.addEventListener("pointerdown", onDoc, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("aiq:ready", onAiQuizAvailability);
    window.addEventListener("aiq:availability-change", onAiQuizAvailability);

    __mw_title_menu_close = () => {
      clearHideTimer();
      try { document.removeEventListener("pointerdown", onDoc, true); } catch (_) {}
      try { document.removeEventListener("keydown", onKey, true); } catch (_) {}
      try { window.removeEventListener("resize", place); } catch (_) {}
      try { window.removeEventListener("scroll", place, true); } catch (_) {}
      try { window.removeEventListener("aiq:ready", onAiQuizAvailability); } catch (_) {}
      try { window.removeEventListener("aiq:availability-change", onAiQuizAvailability); } catch (_) {}
      try { state.titleMenuEl = null; } catch (_) {}
      try { state.titleMenuReadyBtn = null; } catch (_) {}
      try { state.titleMenuRecapBtn = null; } catch (_) {}
      try { state.titleMenuReadinessHost = null; } catch (_) {}
      try { state.titleMenuRecapHost = null; } catch (_) {}
      try { state.titleMenuActiveSection = ""; } catch (_) {}
      try { state.titleMenuRefreshWidth = null; } catch (_) {}
      try {
        if (menu && menu.parentNode) menu.parentNode.removeChild(menu);
      } catch (_) {}
      try { if (anchorEl) anchorEl.setAttribute("aria-expanded", "false"); } catch (_) {}
      __mw_title_menu_close = null;
      __mw_title_menu_anchor = null;
    };
  }

  function mwBindTitleMenuTriggers(state) {
    const sc = mwEnsureTitleScaffold();
    if (!sc) return;

    try { mwInstallTitleSelectionGuard(sc); } catch (_) {}

    if (sc.badge) {
      sc.badge.__mwTitleMenuState = state;
      sc.badge.dataset.mwMenuBound = "1";
      mwBindStableTitleMenuPress(sc.badge, () => sc.badge.__mwTitleMenuState || state, { requireExplicitRating: true });
    }

    if (sc.manageBtn) {
      sc.manageBtn.__mwTitleMenuState = state;
      sc.manageBtn.dataset.mwMenuBound = "1";
      mwBindStableTitleMenuPress(sc.manageBtn, () => sc.manageBtn.__mwTitleMenuState || state, { requireExplicitRating: false });
    }
  }


  function ensureStyles() {
    if (document.getElementById("mw-style")) return;
    const st = document.createElement("style");
    st.id = "mw-style";
    st.textContent = `
      :root{
        --mw-master-gold-border: rgba(226, 179, 54, .98);
        --mw-master-gold-ink: rgba(248, 214, 111, .98);
        --mw-master-gold-fill-top: rgba(245, 213, 117, .42);
        --mw-master-gold-fill-bottom: rgba(163, 112, 8, .54);
        --mw-master-gold-glow-soft: rgba(241, 198, 75, .48);
        --mw-master-gold-glow-strong: rgba(241, 198, 75, .88);
        --mw-know-silver-border: rgba(196, 207, 223, .98);
        --mw-know-silver-ink: rgba(216, 226, 238, .99);
        --mw-know-silver-fill-top: rgba(235, 241, 249, .28);
        --mw-know-silver-fill-bottom: rgba(136, 150, 173, .38);
        --mw-know-silver-glow-soft: rgba(196, 210, 233, .30);
        --mw-know-silver-glow-strong: rgba(180, 198, 228, .56);
        --mw-title-plain-ink: rgba(255,255,255,.94);
        --mw-neutral-cue-border: rgba(255,255,255,.10);
        --mw-neutral-cue-shadow-soft: rgba(0,0,0,.12);
        --mw-neutral-cue-shadow-strong: rgba(0,0,0,.20);
        --mw-divider-default: rgba(0, 0, 0, .07);
        --mw-collapsed-line-default: var(--mw-section-line-color, var(--mw-divider-default));
        --mw-space-h1-widget: 26px;
        --mw-space-widget-next: 36px;
        --mw-collapsed-line-margin-top: 20px;
        --mw-collapsed-line-margin-bottom: 34px;
        --mw-collapsed-line-slot: 55px;
        --mw-collapsed-hit-half: 30px;
        --mw-collapsed-hit-height: 62px;
      }
      @media (max-width: 720px){
        :root{
          --mw-space-h1-widget: 26px;
          --mw-space-widget-next: 22px;
          --mw-collapsed-line-margin-top: 20px;
          --mw-collapsed-line-margin-bottom: 18px;
          --mw-collapsed-line-slot: 39px;
          --mw-collapsed-hit-half: 30px;
          --mw-collapsed-hit-height: 62px;
        }
      }
      html[data-md-color-scheme="default"],
      body[data-md-color-scheme="default"]{
        --mw-master-gold-border: rgba(202, 150, 20, .98);
        --mw-master-gold-ink: rgba(218, 164, 28, .99);
        --mw-master-gold-fill-top: rgba(251, 238, 184, .96);
        --mw-master-gold-fill-bottom: rgba(240, 208, 108, .82);
        --mw-master-gold-glow-soft: rgba(235, 191, 65, .44);
        --mw-master-gold-glow-strong: rgba(235, 191, 65, .76);
        --mw-know-silver-border: rgba(165, 178, 198, .98);
        --mw-know-silver-ink: rgba(183, 195, 213, .99);
        --mw-know-silver-fill-top: rgba(250, 252, 255, .99);
        --mw-know-silver-fill-bottom: rgba(226, 233, 244, .94);
        --mw-know-silver-glow-soft: rgba(191, 206, 231, .26);
        --mw-know-silver-glow-strong: rgba(170, 190, 223, .48);
        --mw-title-plain-ink: rgba(19, 24, 33, .90);
        --mw-neutral-cue-border: rgba(19, 24, 33, .10);
        --mw-neutral-cue-shadow-soft: rgba(19, 24, 33, .06);
        --mw-neutral-cue-shadow-strong: rgba(19, 24, 33, .12);
        --mw-divider-default: rgba(0, 0, 0, .07);
        --mw-collapsed-line-default: var(--mw-section-line-color, var(--mw-divider-default));
      }
      html[data-md-color-scheme="slate"],
      body[data-md-color-scheme="slate"]{
        --mw-master-gold-border: rgba(241, 198, 75, .98);
        --mw-master-gold-ink: rgba(250, 223, 139, .99);
        --mw-master-gold-fill-top: rgba(177, 126, 18, .84);
        --mw-master-gold-fill-bottom: rgba(111, 72, 2, .92);
        --mw-master-gold-glow-soft: rgba(248, 214, 111, .56);
        --mw-master-gold-glow-strong: rgba(248, 214, 111, .92);
        --mw-know-silver-border: rgba(198, 210, 228, .98);
        --mw-know-silver-ink: rgba(212, 223, 237, .99);
        --mw-know-silver-fill-top: rgba(122, 136, 160, .60);
        --mw-know-silver-fill-bottom: rgba(82, 96, 121, .78);
        --mw-know-silver-glow-soft: rgba(193, 210, 236, .32);
        --mw-know-silver-glow-strong: rgba(176, 198, 232, .60);
        --mw-title-plain-ink: rgba(244, 247, 252, .94);
        --mw-neutral-cue-border: rgba(0,0,0,.38);
        --mw-neutral-cue-shadow-soft: rgba(0,0,0,.16);
        --mw-neutral-cue-shadow-strong: rgba(0,0,0,.26);
        --mw-divider-default: rgba(210, 215, 233, .12);
        --mw-collapsed-line-default: var(--mw-divider-default);
      }

      .mw-anchor{
        display:block;
        width:100%;
        height:0;
        max-height:0;
        position:relative;
        box-sizing:border-box;
        opacity:0;
        pointer-events:none;
      }
      .mw-anchor::before{
        content:"";
        position:absolute;
        left:0;
        right:0;
        top: var(--mw-collapsed-line-margin-top, 20px);
        bottom:auto;
        height:1px;
        transform:none;
        background: var(--mw-line-color, var(--mw-collapsed-line-default));
        opacity:0;
        transition: opacity .22s ease, background .36s ease, box-shadow .36s ease;
      }
      .mw-anchor.mw-anchor--line::before{
        opacity:1;
      }
      .mw-anchor[data-mw-line-kind="hidden"],
      .mw-anchor[data-mw-line-interactive="1"]{
        cursor:pointer;
        z-index: 2;
      }
      .mw-anchor[data-mw-line-interactive="1"]::after{
        content:"";
        position:absolute;
        left:0;
        right:0;
        top: calc(var(--mw-collapsed-line-margin-top, 20px) - var(--mw-collapsed-hit-half, 30px));
        height: var(--mw-collapsed-hit-height, 62px);
        pointer-events:auto;
        background:transparent;
      }
      .mw-anchor[data-mw-line-kind="hidden"]::before,
      .mw-anchor[data-mw-line-kind="default"]::before{
        --mw-line-color: var(--mw-collapsed-line-default);
        box-shadow:none;
      }
      .mw-anchor[data-mw-line-kind="master"]::before{
        --mw-line-color: var(--mw-master-gold-ink);
        background: linear-gradient(90deg, transparent 0%, var(--mw-master-gold-border) 8%, var(--mw-master-gold-ink) 50%, var(--mw-master-gold-border) 92%, transparent 100%);
        box-shadow: 0 0 6px var(--mw-master-gold-glow-soft), 0 0 16px var(--mw-master-gold-glow-strong);
        animation: mw-master-line-glow 1.9s ease-in-out infinite alternate;
      }
      .mw-anchor[data-mw-line-kind="know"]::before{
        --mw-line-color: var(--mw-know-silver-ink);
        background: linear-gradient(90deg, transparent 0%, var(--mw-know-silver-border) 8%, var(--mw-know-silver-ink) 50%, var(--mw-know-silver-border) 92%, transparent 100%);
        box-shadow: 0 0 6px var(--mw-know-silver-glow-soft), 0 0 14px var(--mw-know-silver-glow-strong);
        animation: mw-know-line-glow 2.2s ease-in-out infinite alternate;
      }
      .mw-anchor[data-mw-line-kind="hidden"]:hover::before,
      .mw-anchor[data-mw-line-kind="hidden"]:focus-visible::before{
        opacity:1;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--mw-collapsed-line-default) 55%, transparent);
      }
      #mw-mastery,
      #mw-mastery-compact{
        border: 1px solid var(--mw-collapsed-line-default);
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(63,81,181,.10), rgba(63,81,181,.04));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-sizing:border-box;
        box-shadow:none;
      }
      #mw-mastery.mw-dismissed,
      #mw-mastery-compact.mw-dismissed{
        border-color: transparent !important;
        box-shadow: none !important;
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      #mw-mastery.mw-collapsed-line,
      #mw-mastery-compact.mw-collapsed-line{
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border-left-width: 0 !important;
        border-right-width: 0 !important;
        border-top-width: 0 !important;
        border-bottom-width: 1px !important;
        border-radius: 0 !important;
        min-height: 1px !important;
        height: 1px !important;
        max-height: 1px !important;
        padding-top: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 0 !important;
        padding-left: 0 !important;
        margin-top: var(--mw-collapsed-line-margin-top, 20px) !important;
        margin-bottom: var(--mw-collapsed-line-margin-bottom, 18px) !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        opacity: 1 !important;
        transform: none !important;
      }
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-kind="default"],
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-kind="hidden"],
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-kind="default"],
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-kind="hidden"]{
        border-bottom-color: var(--mw-collapsed-line-default) !important;
        box-shadow: none !important;
      }
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-kind="master"],
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-kind="master"]{
        border-bottom-color: var(--mw-master-gold-ink) !important;
        box-shadow: 0 0 6px var(--mw-master-gold-glow-soft), 0 0 16px var(--mw-master-gold-glow-strong) !important;
        animation: mw-master-line-glow 1.9s ease-in-out infinite alternate;
      }
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-kind="know"],
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-kind="know"]{
        border-bottom-color: var(--mw-know-silver-ink) !important;
        box-shadow: 0 0 6px var(--mw-know-silver-glow-soft), 0 0 14px var(--mw-know-silver-glow-strong) !important;
        animation: mw-know-line-glow 2.2s ease-in-out infinite alternate;
      }
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-interactive="1"],
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-interactive="1"]{
        cursor: pointer;
        pointer-events: auto !important;
        position: relative !important;
      }
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-interactive="1"]::after,
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-interactive="1"]::after{
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: calc(-1 * var(--mw-collapsed-hit-half, 30px));
        height: var(--mw-collapsed-hit-height, 62px);
        pointer-events: auto;
        background: transparent;
      }
      #mw-mastery.mw-collapsed-line > :not(.mw-collapse-line-shell),
      #mw-mastery-compact.mw-collapsed-line > :not(.mw-collapse-line-shell){
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-kind="hidden"],
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-kind="hidden"],
      #mw-mastery.mw-collapsed-line[data-mw-collapsed-kind="hidden"] *,
      #mw-mastery-compact.mw-collapsed-line[data-mw-collapsed-kind="hidden"] *{
        transition: none !important;
        animation: none !important;
      }
      #mw-mastery{
  margin: var(--mw-space-h1-widget, 26px) 0 var(--mw-space-widget-next, 24px) 0;
  padding: 12px 14px 12px;
  position:relative;
  z-index: 1;
  max-height: 420px;
  overflow: hidden;
  transition:
    box-shadow .4s ease,
    border-color .4s ease,
    background .4s ease,
    opacity .18s ease,
    transform .18s ease,
    height .6s cubic-bezier(.22,1,.36,1),
    max-height .6s cubic-bezier(.22,1,.36,1),
    padding .6s cubic-bezier(.22,1,.36,1),
    margin .6s cubic-bezier(.22,1,.36,1),
    border-width .6s cubic-bezier(.22,1,.36,1);
}
    #mw-mastery .mw-head,
#mw-mastery .mw-row,
#mw-mastery .mw-meta{
  transition: opacity .4s ease, transform .4s ease, filter .4s ease;
}

#mw-mastery .mw-pill,
#mw-mastery-compact .mw-pill,
#mw-mastery .mw-manage,
#mw-mastery-compact .mw-manage,
#mw-mastery .mw-hide,
#mw-mastery-compact .mw-hide,
#mw-mastery .mw-recap-chip{
  transition:
    background .4s ease,
    border-color .4s ease,
    box-shadow .4s ease,
    opacity .4s ease,
    transform .4s ease,
    filter .4s ease,
    color .4s ease;
}

#mw-mastery .mw-pill .mw-emo,
#mw-mastery-compact .mw-pill .mw-emo,
#mw-mastery .mw-pill .mw-lab,
#mw-mastery-compact .mw-pill .mw-lab{
  transition: opacity .4s ease, transform .4s ease, filter .4s ease, color .4s ease;
}

#mw-mastery.mw-preflight{
  will-change: height, max-height, padding, margin, border-width, opacity, transform;
}

#mw-mastery.mw-preflight.mw-flight-pill-only,
#mw-mastery.mw-preflight.mw-flight-pill-only:hover,
#mw-mastery.mw-preflight.mw-flight-pill-only:focus-within{
  border-color: transparent !important;
  background: linear-gradient(135deg, rgba(63,81,181,0), rgba(63,81,181,0)) !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

#mw-mastery-compact.mw-preflight{
  border-color: transparent;
  background: linear-gradient(135deg, rgba(63,81,181,0), rgba(63,81,181,0));
  box-shadow: none;
}

#mw-mastery.mw-preflight .mw-head .mw-title,
#mw-mastery.mw-preflight .mw-meta,
#mw-mastery.mw-preflight .mw-head .mw-ready-chip,
#mw-mastery.mw-preflight .mw-head .mw-recap-chip,
#mw-mastery.mw-preflight .mw-head .mw-recap-chip *,
#mw-mastery.mw-preflight .mw-head .mw-hide,
#mw-mastery.mw-preflight .mw-head .mw-hide *,
#mw-mastery.mw-preflight .mw-recap,
#mw-mastery.mw-preflight .mw-row .mw-pill:not(.mw-flight-picked),
#mw-mastery.mw-preflight .mw-head .mw-manage,
#mw-mastery-compact.mw-preflight .mw-row .mw-pill:not(.mw-flight-picked),
#mw-mastery-compact.mw-preflight .mw-hide,
#mw-mastery-compact.mw-preflight .mw-hide *,
#mw-mastery-compact.mw-preflight .mw-manage{
  opacity:0;
  transform: translateY(-8px);
  filter: blur(2px);
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked{
  position:relative;
  z-index:2;
  overflow:hidden;
  transform-origin:50% 50%;
  will-change: transform, opacity;
}

#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked{
  position:relative;
  z-index:2;
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked .mw-lab,
#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked .mw-lab{
  opacity:0;
  transform: translateY(-6px);
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked .mw-emo,
#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked .mw-emo{
  transform: scale(1.06);
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="master"] .mw-emo,
#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="master"] .mw-emo{
  color: var(--mw-master-gold-ink);
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="master"] .mw-emo svg,
#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="master"] .mw-emo svg{
  filter:
    drop-shadow(0 0 10px var(--mw-master-gold-glow-soft))
    drop-shadow(0 0 24px var(--mw-master-gold-glow-strong));
  animation: mw-master-icon-ink-glow 1.7s ease-in-out infinite alternate;
  overflow: visible;
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="know"] .mw-emo,
#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="know"] .mw-emo{
  color: var(--mw-know-silver-ink);
}

#mw-mastery.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="know"] .mw-emo svg,
#mw-mastery-compact.mw-preflight .mw-pill.mw-flight-picked[data-mw-effect-tier="know"] .mw-emo svg{
  filter:
    drop-shadow(0 0 6px var(--mw-know-silver-glow-soft))
    drop-shadow(0 0 14px var(--mw-know-silver-glow-strong));
  animation: mw-know-icon-ink-glow 2.2s ease-in-out infinite alternate;
  overflow: visible;
}

#mw-mastery.mw-flight-launch .mw-pill.mw-flight-picked,
#mw-mastery-compact.mw-flight-launch .mw-pill.mw-flight-picked{
  background: transparent !important;
  border-color: transparent !important;
  box-shadow:none !important;
}

#mw-mastery.mw-flight-launch .mw-pill.mw-flight-picked{
  transform: scaleY(.08);
  opacity:0;
}

#mw-mastery.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked,
#mw-mastery-compact.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked{
  width:34px !important;
  min-width:34px !important;
  max-width:34px !important;
  height:34px !important;
  min-height:34px !important;
  padding:0 !important;
  gap:0 !important;
  flex:0 0 34px !important;
  border-color: transparent !important;
  background: transparent !important;
  box-shadow:none !important;
  overflow:visible !important;
}

#mw-mastery.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked .mw-lab,
#mw-mastery-compact.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked .mw-lab{
  display:none !important;
  opacity:0 !important;
}

#mw-mastery.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked .mw-emo,
#mw-mastery-compact.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked .mw-emo{
  width:28px !important;
  min-width:28px !important;
  height:28px !important;
  min-height:28px !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  transform:none !important;
}

#mw-mastery.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked .mw-emo svg,
#mw-mastery-compact.mw-preflight.mw-flight-pill-only .mw-pill.mw-flight-picked .mw-emo svg{
  width:28px !important;
  height:28px !important;
}

#mw-mastery.mw-flight-launch .mw-pill.mw-flight-picked .mw-emo,
#mw-mastery-compact.mw-flight-launch .mw-pill.mw-flight-picked .mw-emo{
  opacity:0 !important;
}

#mw-mastery.mw-collapsing{
  pointer-events:none !important;
  overflow:hidden !important;
}
            #mw-mastery-compact{
        position: fixed;
        top: var(--mw-compact-top, 10px);
        left: var(--mw-compact-left, 16px);
        transform: translateX(var(--mw-compact-shift-x, 0px)) translateY(-10px) scale(.96);
        width: max-content;
        max-width: calc(100vw - 18px);
        padding: 6px 8px;
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        box-shadow: 0 14px 38px rgba(0,0,0,.22);
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        cursor: grab;
        transition: opacity .22s ease, transform .22s ease, background .4s ease, border-color .4s ease, box-shadow .4s ease;
      }
      #mw-mastery-compact.is-visible{
        opacity: 1;
        pointer-events: auto;
        transform: translateX(var(--mw-compact-shift-x, -50%)) translateY(0) scale(1);
      }
      #mw-mastery-compact.mw-dragging{
        transition: none !important;
        cursor: grabbing;
      }
      #mw-mastery.mw-docked{
        position: fixed;
        top: var(--mw-dock-top, 72px);
        left: var(--mw-dock-left, 16px);
        width: var(--mw-dock-width, calc(100vw - 32px));
        max-width: none;
        margin: 0;
        z-index: 115;
        box-shadow: 0 16px 36px rgba(0,0,0,.18);
      }
      #mw-mastery.mw-source-hidden{
        display:none !important;
      }
      #mw-mastery.mw-dismissed,
      #mw-mastery-compact.mw-dismissed{
        opacity:0 !important;
        pointer-events:none !important;
        transform: none !important;
      }
      #mw-mastery.mw-needs-rating,
      #mw-mastery-compact.mw-needs-rating{
        border-color: var(--mw-collapsed-line-default);
        box-shadow: none;
        animation: mw-heartbeat 1.9s ease-in-out infinite;
        transform-origin: center;
        will-change: transform;
      }
      #mw-mastery.mw-needs-rating .mw-title::after,
      #mw-mastery-compact.mw-needs-rating .mw-title::after{
        content:none;
        display:none !important;
      }
      #mw-mastery.mw-needs-rating .mw-meta,
      #mw-mastery-compact.mw-needs-rating .mw-meta{
        color: color-mix(in srgb, var(--md-default-fg-color) 88%, transparent 12%);
        font-weight: 600;
      }
      @keyframes mw-heartbeat{
        0%,100%{
          transform: scale(1);
          box-shadow: none;
        }
        10%{
          transform: scale(1.008);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--mw-neutral-cue-border) 82%, transparent), 0 12px 30px var(--mw-neutral-cue-shadow-soft);
        }
        22%{
          transform: scale(1.018);
          box-shadow: 0 0 0 1px var(--mw-neutral-cue-border), 0 14px 34px var(--mw-neutral-cue-shadow-strong);
        }
        36%{
          transform: scale(1);
          box-shadow: none;
        }
        48%{
          transform: scale(1.01);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--mw-neutral-cue-border) 82%, transparent), 0 12px 30px var(--mw-neutral-cue-shadow-soft);
        }
        60%{
          transform: scale(1.022);
          box-shadow: 0 0 0 1px var(--mw-neutral-cue-border), 0 15px 36px var(--mw-neutral-cue-shadow-strong);
        }
        78%{
          transform: scale(1);
          box-shadow: none;
        }
      }
      @keyframes mw-master-line-glow{
        0%{ box-shadow: 0 0 4px var(--mw-master-gold-glow-soft), 0 0 12px var(--mw-master-gold-glow-strong); }
        100%{ box-shadow: 0 0 8px var(--mw-master-gold-glow-soft), 0 0 20px var(--mw-master-gold-glow-strong); }
      }
      @keyframes mw-know-line-glow{
        0%{ box-shadow: 0 0 4px var(--mw-know-silver-glow-soft), 0 0 10px var(--mw-know-silver-glow-strong); }
        100%{ box-shadow: 0 0 7px var(--mw-know-silver-glow-soft), 0 0 16px var(--mw-know-silver-glow-strong); }
      }
            #mw-mastery.mw-reduced-motion,
      #mw-mastery.mw-reduced-motion .mw-title::after,
      #mw-mastery-compact.mw-reduced-motion,
      #mw-mastery-compact.mw-reduced-motion .mw-title::after,
      .mw-title-badge.mw-reduced-motion,
      .mw-h1-manage.mw-reduced-motion{
        animation: none !important;
        transition: none !important;
      }

      .mw-title-menu{
        position: fixed;
        z-index: 2147483100;
        display: grid;
        gap: 10px;
        width: max-content;
        min-width: 0;
        max-width: calc(100vw - 20px);
        padding: 10px;
        border: 1.5px solid color-mix(in srgb, var(--md-default-fg-color) 24%, var(--md-default-bg-color));
        outline: 1px solid color-mix(in srgb, var(--md-default-bg-color) 82%, transparent);
        outline-offset: -2px;
        border-radius: 16px;
        background: color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-primary-fg-color) 6%);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 14px 34px rgba(0,0,0,.24), 0 0 0 1px rgba(0,0,0,.06);
        box-sizing: border-box;
      }

      .mw-title-menu-top{
        display:flex;
        align-items:center;
        justify-content:flex-start;
        gap:10px;
        min-width:0;
        flex-wrap:nowrap;
      }

      .mw-title-menu-extras{
        display:inline-flex;
        align-items:center;
        gap:8px;
        flex:0 0 auto;
        min-width:0;
      }

      .mw-title-menu-levels{
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex:0 0 auto;
      }

      .mw-title-menu-sep{
        width: 1px;
        min-width: 1px;
        flex: 0 0 1px;
        align-self: stretch;
        background: var(--md-default-fg-color--lightest);
        opacity: .65;
        margin: 2px 1px 2px 3px;
      }

      .mw-title-menu-btn{
        width: 36px;
        min-width: 36px;
        height: 36px;
        flex: 0 0 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--md-default-fg-color--lightest);
        border-radius: 999px;
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink);
        cursor: pointer;
        padding: 0;
        transition: background .16s ease, border-color .16s ease, color .16s ease, transform .16s ease, box-shadow .16s ease;
      }

      .mw-title-menu-btn:hover{
        background: rgba(255,255,255,.10);
        transform: translateY(-1px);
      }

      .mw-title-menu-btn.is-current[data-mw-effect-tier="master"]{
        color: var(--mw-master-gold-border);
      }

      .mw-title-menu-btn.is-current[data-mw-effect-tier="know"]{
        color: var(--mw-know-silver-border);
      }

      .mw-title-menu-btn--manage{
        margin-left: 2px;
        color: var(--mw-title-plain-ink);
        background: rgba(255,255,255,.05);
      }

      .mw-title-menu-btn--toggle{
        color: var(--mw-title-plain-ink);
        background: rgba(255,255,255,.05);
      }

      .mw-title-menu-btn--ai{
        color: var(--mw-title-plain-ink);
        background: rgba(255,255,255,.05);
      }

      .mw-title-menu-btn--ai:hover,
      .mw-title-menu-btn--ai:focus-visible{
        background: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 15%, rgba(255,255,255,.08));
        border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 48%, var(--md-default-fg-color--lightest));
        box-shadow: 0 8px 18px rgba(0,0,0,.12), 0 0 0 1px color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%, transparent);
        transform: translateY(-1px);
      }

      .mw-title-menu-btn--ai[hidden]{
        display:none !important;
      }

      .mw-title-menu-btn--ai[disabled]{
        opacity:.46;
        cursor:not-allowed;
        transform:none !important;
        background: rgba(255,255,255,.03);
        border-color: var(--md-default-fg-color--lightest);
        box-shadow:none !important;
      }

      .mw-title-menu-btn--ai[disabled]:hover,
      .mw-title-menu-btn--ai[disabled]:focus-visible{
        background: rgba(255,255,255,.03);
        border-color: var(--md-default-fg-color--lightest);
        box-shadow:none !important;
      }

      .mw-title-menu-btn--toggle[disabled]{
        opacity:.46;
        cursor:not-allowed;
        transform:none !important;
        background: rgba(255,255,255,.03);
        border-color: var(--md-default-fg-color--lightest);
        box-shadow:none !important;
      }

      .mw-title-menu-btn--toggle[disabled]:hover,
      .mw-title-menu-btn--toggle[disabled]:focus-visible,
      .mw-title-menu-btn--toggle[disabled][aria-expanded="true"]{
        background: rgba(255,255,255,.03);
        border-color: var(--md-default-fg-color--lightest);
        box-shadow:none !important;
      }

      .mw-title-menu-btn.is-current{
        box-shadow: inset 0 0 0 1px currentColor;
        background: rgba(255,255,255,.10);
        cursor: default;
      }

      .mw-title-menu-btn.is-current:hover{
        transform: none;
      }

      .mw-title-menu-btn--ready{
        width:auto;
        min-width: 46px;
        flex: 0 0 auto;
        padding: 0 12px;
        font-size: 13px;
        font-weight: 400;
        font-variant-numeric: tabular-nums;
        border-color: var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
      }

      .mw-title-menu-btn--ready:hover,
      .mw-title-menu-btn--ready:focus-visible,
      .mw-title-menu-btn--ready[aria-expanded="true"]{
        background: var(--mw-ready-fill-hover, rgba(255,255,255,.08));
        border-color: color-mix(in srgb, rgb(var(--mw-ready-rgb, 255 255 255)) 42%, var(--md-default-fg-color--lightest));
        box-shadow:
          0 0 0 1px rgba(var(--mw-ready-rgb, 255, 255, 255), .06),
          0 8px 18px rgba(var(--mw-ready-rgb, 255, 255, 255), .12);
      }

      .mw-title-menu-btn--ready[disabled]{
        opacity:.62;
        cursor:default;
        transform:none !important;
      }

      .mw-title-menu-btn--ready[disabled]:hover,
      .mw-title-menu-btn--ready[disabled]:focus-visible,
      .mw-title-menu-btn--ready[disabled][aria-expanded="true"]{
        background: rgba(255,255,255,.04);
        border-color: var(--md-default-fg-color--lightest);
        box-shadow:none;
      }

      .mw-title-menu-btn svg,
      .mw-title-menu-btn svg *{
        width: 18px;
        height: 18px;
        display: block;
        color: currentColor !important;
        stroke: currentColor !important;
        fill: none !important;
      }

      .mw-title-menu-btn.is-current[data-mw-effect-tier="master"] svg,
      .mw-title-menu-btn.is-current[data-mw-effect-tier="master"] svg *{
        color: var(--mw-master-gold-ink);
        stroke: var(--mw-master-gold-ink);
      }

      .mw-title-menu-btn.is-current[data-mw-effect-tier="know"] svg,
      .mw-title-menu-btn.is-current[data-mw-effect-tier="know"] svg *{
        color: var(--mw-know-silver-ink);
        stroke: var(--mw-know-silver-ink);
      }
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--recap,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--manage,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--ai,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--recap,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--manage,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--ai{
        color: rgba(255,255,255,.98) !important;
      }
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg *,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg *,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg *,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--ai svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--ai svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--ai svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--ai svg *{
        color: rgba(255,255,255,.98) !important;
        stroke: rgba(255,255,255,.98) !important;
        fill: none !important;
        opacity: 1 !important;
        filter: none !important;
      }
      .mw-title-menu{
        gap:8px;
        width:max-content;
        min-width:0;
        max-width:calc(100vw - 20px);
        box-sizing:border-box;
        padding:8px;
      }
      .mw-title-menu-top{
        gap:8px;
      }
      .mw-title-menu-levels{
        gap:6px;
      }
      .mw-title-menu-sep{
        min-width:1px;
        flex:0 0 1px;
        margin:1px 0 1px 2px;
      }
      .mw-title-menu-btn{
        width:34px;
        min-width:34px;
        height:34px;
        flex:0 0 34px;
      }
      .mw-title-menu-btn--ready{
        min-width:50px;
        padding:0 11px;
        font-size:12.5px;
      }
      .mw-title-menu-btn--recap{
        color: inherit;
        background: rgba(255,255,255,.04);
      }
      .mw-title-menu-btn--recap:hover,
      .mw-title-menu-btn--recap:focus-visible,
      .mw-title-menu-btn--recap[aria-expanded="true"]{
        background: rgba(0, 224, 208, .12);
        border-color: rgba(0, 224, 208, .44);
        box-shadow: 0 0 0 1px rgba(0, 224, 208, .08), 0 8px 18px rgba(0, 224, 208, .10);
      }
      .mw-title-menu-section{
        border:1.5px solid color-mix(in srgb, var(--md-default-fg-color) 22%, var(--md-default-bg-color));
        outline:1px solid color-mix(in srgb, var(--md-default-bg-color) 82%, transparent);
        outline-offset:-2px;
        border-radius:16px;
        background:color-mix(in srgb, var(--md-default-bg-color) 95%, var(--md-primary-fg-color) 5%);
        padding:10px 12px;
        box-sizing:border-box;
        display:grid;
        gap:8px;
        max-height:min(var(--mw-title-menu-section-max, 290px), calc(100vh - 140px));
        overflow:auto;
        overscroll-behavior:contain;
        -webkit-overflow-scrolling:touch;
        touch-action:pan-y;
        scrollbar-gutter:stable;
      }
      .mw-title-menu-section[hidden]{
        display:none !important;
      }
      .mw-title-menu-section .mw-menu-panel-title{
        font-size:.76rem;
        font-weight:800;
        line-height:1.2;
        opacity:.96;
      }
      .mw-title-menu-section .mw-menu-panel-title--lead{
        font-size:.78rem;
        font-weight:700;
        line-height:1.3;
        opacity:.9;
      }
      .mw-title-menu-section .mw-menu-panel-summary{
        font-size:.72rem;
        line-height:1.3;
        opacity:.66;
      }
      .mw-title-menu-section .mw-menu-panel-copy{
        font-size:.78rem;
        line-height:1.35;
        opacity:.9;
      }
      .mw-title-menu .mw-ready-list,
      .mw-title-menu .mw-recap-list{
        list-style:none;
        padding:0;
        margin:6px 0 0;
        display:grid;
        gap:10px;
      }
      .mw-title-menu .mw-ready-item{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        align-items:start;
        gap:8px;
        margin-left:0;
        padding-left:0;
      }
      .mw-title-menu .mw-ready-link{
        min-width:0;
        margin:0;
        padding:0;
        text-indent:0;
        text-decoration:none !important;
        color:inherit;
      }
      .mw-title-menu .mw-ready-link:hover,
      .mw-title-menu .mw-ready-link:focus-visible,
      .mw-title-menu .mw-ready-link:active,
      .mw-title-menu .mw-ready-link:visited{
        text-decoration:none !important;
        color:inherit;
      }
      .mw-title-menu .mw-ready-link-title{
        display:block;
        font-size:.74rem;
        line-height:1.22;
        opacity:.95;
        margin-left:0;
        padding-left:0;
        text-indent:0;
      }
      .mw-title-menu .mw-ready-link-meta{
        display:block;
        font-size:.68rem;
        line-height:1.16;
        opacity:.62;
        margin-top:1px;
      }
      .mw-title-menu .mw-ready-state{
        flex:0 0 auto;
        min-width:0;
        font-size:.68rem;
        line-height:1.16;
        opacity:.62;
        align-self:start;
        justify-self:end;
        white-space:nowrap;
        text-align:right;
        padding:0;
        border:0;
        background:transparent;
        border-radius:0;
        box-shadow:none;
      }
      .mw-title-menu .mw-recap{
        padding:10px 12px;
        gap:10px;
      }
      .mw-title-menu .mw-recap-title,
      .mw-title-menu .mw-ready-title{
        font-size:.76rem;
        font-weight:800;
        line-height:1.2;
        opacity:.96;
      }
      .mw-title-menu .mw-recap-rating,
      .mw-title-menu .mw-ready-summary{
        font-size:.78rem;
        line-height:1.35;
        opacity:.9;
      }
      .mw-title-menu .mw-recap-item{
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        align-items:start;
        gap:8px;
      }
      .mw-title-menu .mw-recap-main{
        min-width:0;
      }
      .mw-title-menu .mw-recap-label{
        font-size:.74rem;
        line-height:1.22;
        opacity:.95;
      }
      .mw-title-menu .mw-recap-when{
        font-size:.68rem;
        line-height:1.16;
        opacity:.62;
        white-space:nowrap;
        justify-self:end;
        text-align:right;
      }
      .mw-title-menu .mw-recap-dot{
        width:7px;
        height:7px;
        margin-top:.18rem;
        box-shadow:none;
      }
      #mw-mastery .mw-head{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        align-items:center;
        column-gap:12px;
        row-gap:0;
        margin-bottom:10px;
      }
      #mw-mastery .mw-title{
        font-weight:800;
        opacity:.95;
        min-width:0;
      }
      #mw-mastery .mw-row,
      #mw-mastery-compact .mw-row{
        display:flex;
        width:100%;
        gap:10px;
        flex-wrap:wrap;
        align-items:center;
      }
      #mw-mastery .mw-row{
        padding-right:264px;
        box-sizing:border-box;
      }
      #mw-mastery-compact .mw-row{
        width:auto;
        gap:8px;
        flex-wrap:nowrap;
        align-items:center;
      }
      #mw-mastery .mw-pill,
      #mw-mastery-compact .mw-pill{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        min-width:0;
        min-height:38px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        border-radius:999px;
        padding: 6px 10px;
        cursor:pointer;
        box-sizing:border-box;
      }
      #mw-mastery-compact .mw-pill{ flex:0 0 auto; width:auto; padding:4px 10px; gap:6px; min-height:36px; }
      #mw-mastery .mw-pill:hover,
      #mw-mastery-compact .mw-pill:hover{background: rgba(255,255,255,.08)}
      @media (hover: hover) and (pointer: fine){
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line),
        #mw-mastery-compact:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line){
          pointer-events:auto !important;
        }
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-pill,
        #mw-mastery-compact:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-pill,
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-manage,
        #mw-mastery-compact:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-manage,
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-hide,
        #mw-mastery-compact:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-hide,
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-ready-chip,
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-recap-chip,
        #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-aiq-btn{
          pointer-events:auto;
        }
        #mw-mastery .mw-pill:hover,
        #mw-mastery-compact .mw-pill:hover{
          background: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 15%, rgba(255,255,255,.08));
          border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 48%, var(--md-default-fg-color--lightest));
          box-shadow: 0 8px 18px rgba(0,0,0,.12), 0 0 0 1px color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%, transparent);
          transform: translateY(-1px);
        }
      }
      #mw-mastery .mw-pill:disabled,
      #mw-mastery-compact .mw-pill:disabled{opacity:.45;cursor:not-allowed}
      #mw-mastery .mw-pill:disabled:hover,
      #mw-mastery-compact .mw-pill:disabled:hover{background: rgba(255,255,255,.04)}
      #mw-mastery .mw-hide:disabled,
      #mw-mastery-compact .mw-hide:disabled{opacity:.45;cursor:not-allowed;pointer-events:none;}
      #mw-mastery .mw-hide:disabled:hover,
      #mw-mastery-compact .mw-hide:disabled:hover{background: rgba(255,255,255,.04)}
      #mw-mastery .mw-selected,
      #mw-mastery-compact .mw-selected{
        background: rgba(63,81,181,.18);
        border-color: rgba(63,81,181,.55);
        font-weight: 800;
      }
      #mw-mastery .mw-emo,
      #mw-mastery-compact .mw-emo{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        line-height:1;
        flex:0 0 auto;
        min-width:1em;
      }
      #mw-mastery .mw-emo svg,
      #mw-mastery-compact .mw-emo svg{display:block}
      #mw-mastery .mw-emo svg,
      #mw-mastery .mw-emo svg *,
      #mw-mastery-compact .mw-emo svg,
      #mw-mastery-compact .mw-emo svg *,
      article.md-content__inner h1.lp-h1-row .mw-title-badge svg,
      article.md-content__inner h1.lp-h1-row .mw-title-badge svg *,
      .mw-fly-ghost.mw-fly-ghost--badge svg,
      .mw-fly-ghost.mw-fly-ghost--badge svg *{
        color: currentColor;
        stroke: currentColor;
        transition: color .4s ease, stroke .4s ease, filter .4s ease, opacity .4s ease;
      }
      #mw-mastery .mw-mi{display:inline-block;vertical-align:-0.18em;margin-right:2px}
      #mw-mastery .mw-mi svg{display:block}
      #mw-mastery .mw-lab,
      #mw-mastery-compact .mw-lab{font-size:12px;opacity:.9}
      #mw-mastery .mw-manage,
      #mw-mastery-compact .mw-manage{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        min-height:38px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink);
        border-radius:999px;
        padding: 6px 10px;
        text-decoration:none;
        cursor:pointer;
        white-space:nowrap;
        box-sizing:border-box;
      }
      #mw-mastery-compact .mw-manage{
        flex:0 0 auto;
        width:auto;
        padding:4px 10px;
        gap:6px;
        min-height:36px;
        font-size:12px;
      }
      #mw-mastery-compact .mw-manage .mw-full,
      #mw-mastery-compact .mw-manage .mw-short{
        font-size:12px;
        line-height:1;
      }
      #mw-mastery .mw-recap-chip-ico,
      #mw-mastery .mw-hide .mw-hide-ico,
      #mw-mastery .mw-manage .mw-gear,
      #mw-mastery-compact .mw-hide .mw-hide-ico,
      #mw-mastery-compact .mw-manage .mw-gear,
      .mw-title-menu-btn{
        color: inherit !important;
      }
      #mw-mastery .mw-recap-chip-ico svg,
      #mw-mastery .mw-recap-chip-ico svg *,
      #mw-mastery .mw-hide .mw-hide-ico svg,
      #mw-mastery .mw-hide .mw-hide-ico svg *,
      #mw-mastery .mw-manage .mw-gear svg,
      #mw-mastery .mw-manage .mw-gear svg *,
      #mw-mastery-compact .mw-hide .mw-hide-ico svg,
      #mw-mastery-compact .mw-hide .mw-hide-ico svg *,
      #mw-mastery-compact .mw-manage .mw-gear svg,
      #mw-mastery-compact .mw-manage .mw-gear svg *{
        color: currentColor !important;
        stroke: currentColor !important;
        fill: none !important;
      }
      #mw-mastery .mw-manage:hover,
      #mw-mastery-compact .mw-manage:hover,
      #mw-mastery .mw-hide:hover,
      #mw-mastery-compact .mw-hide:hover{background: rgba(255,255,255,.08)}
      @media (hover: hover) and (pointer: fine){
        #mw-mastery .mw-manage:hover,
        #mw-mastery-compact .mw-manage:hover,
        #mw-mastery .mw-hide:hover,
        #mw-mastery-compact .mw-hide:hover,
        #mw-mastery .mw-ready-chip:hover,
        #mw-mastery .mw-recap-chip:hover{
          background: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 14%, rgba(255,255,255,.08));
          border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 44%, var(--md-default-fg-color--lightest));
          box-shadow: 0 8px 18px rgba(0,0,0,.12), 0 0 0 1px color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 16%, transparent);
          transform: translateY(-1px);
        }
      }
      #mw-mastery .mw-hide,
      #mw-mastery-compact .mw-hide{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink);
        border-radius:999px;
        padding: 6px 10px;
        text-decoration:none;
        cursor:pointer;
        white-space:nowrap;
        box-sizing:border-box;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
      }
      #mw-mastery-compact .mw-hide{
        flex:0 0 auto;
        width:auto;
        padding:4px 10px;
        min-height:36px;
        font-size:12px;
      }
      #mw-mastery .mw-manage .mw-gear,
#mw-mastery-compact .mw-manage .mw-gear,
#mw-mastery .mw-hide .mw-hide-ico,
#mw-mastery-compact .mw-hide .mw-hide-ico,
article.md-content__inner h1.lp-h1-row .mw-h1-manage{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  line-height:1;
}

#mw-mastery .mw-manage .mw-gear svg,
#mw-mastery-compact .mw-manage .mw-gear svg,
#mw-mastery .mw-hide .mw-hide-ico svg,
#mw-mastery-compact .mw-hide .mw-hide-ico svg{
  width:18px;
  height:18px;
  display:block;
  flex:0 0 auto;
}
      .mw-gear-glyph{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:1em;
        height:1em;
        line-height:1;
        font-size:18px;
        font-family:"Segoe UI Symbol","Apple Symbols","Noto Sans Symbols 2","Noto Sans Symbols",system-ui,sans-serif;
        transform: translateY(-0.5px);
      }
      #mw-mastery .mw-manage .mw-gear svg,
      #mw-mastery-compact .mw-manage .mw-gear svg,
      #mw-mastery .mw-manage .mw-gear .mw-gear-glyph,
      #mw-mastery-compact .mw-manage .mw-gear .mw-gear-glyph{display:block}
      #mw-mastery .mw-hide .mw-short,
      #mw-mastery-compact .mw-hide .mw-short{display:none;}
      #mw-mastery-compact .mw-hide .mw-full{display:none;}
      #mw-mastery-compact .mw-hide .mw-short{display:inline;}
      #mw-mastery .mw-manage{
        position:absolute;
        right:14px;
        bottom:14px;
        z-index:2;
        flex:0 0 auto;
      }
      #mw-mastery .mw-recap{ margin-bottom:0; }
      html[data-md-color-scheme="default"] #mw-mastery .mw-hide,
      html[data-md-color-scheme="default"] #mw-mastery-compact .mw-hide,
      html[data-md-color-scheme="default"] #mw-mastery .mw-manage,
      html[data-md-color-scheme="default"] #mw-mastery-compact .mw-manage,
      body[data-md-color-scheme="default"] #mw-mastery .mw-hide,
      body[data-md-color-scheme="default"] #mw-mastery-compact .mw-hide,
      body[data-md-color-scheme="default"] #mw-mastery .mw-manage,
      body[data-md-color-scheme="default"] #mw-mastery-compact .mw-manage{
        color: var(--mw-title-plain-ink);
      }
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide,
      html[data-md-color-scheme="slate"] #mw-mastery-compact .mw-hide,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage,
      html[data-md-color-scheme="slate"] #mw-mastery-compact .mw-manage,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide,
      body[data-md-color-scheme="slate"] #mw-mastery-compact .mw-hide,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage,
      body[data-md-color-scheme="slate"] #mw-mastery-compact .mw-manage{
        color: var(--mw-title-plain-ink) !important;
      }
      #mw-mastery .mw-manage .mw-gear svg,
      #mw-mastery-compact .mw-manage .mw-gear svg,
      #mw-mastery .mw-manage .mw-gear svg *,
      #mw-mastery-compact .mw-manage .mw-gear svg *,
      #mw-mastery .mw-hide .mw-hide-ico svg,
      #mw-mastery-compact .mw-hide .mw-hide-ico svg,
      #mw-mastery .mw-hide .mw-hide-ico svg *,
      #mw-mastery-compact .mw-hide .mw-hide-ico svg *{
        color: currentColor !important;
        stroke: currentColor !important;
        fill: none !important;
      }
      #mw-mastery .mw-meta{opacity:.75;font-size:.85em;margin-top:8px;padding-right:264px}
      #mw-mastery .mw-meta.mw-aiq-host{
        display:flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
        min-height:0;
        opacity:1 !important;
      }
      #mw-mastery .mw-meta.mw-aiq-host:empty{display:none;}
      /* Reserve the AI mastery-check button's row from first paint so the widget
         does not visibly grow a moment later when the button is injected (its
         availability is resolved asynchronously). Cleared once we know the
         concept has no AI questions. */
      #mw-mastery:not(.mw-search-suppressed):not(.mw-dismissed):not(.mw-collapsed-line) .mw-meta.mw-aiq-host.mw-aiq-host--reserve{display:flex;min-height:38px;}
      #mw-mastery .mw-aiq-btn{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink) !important;
        border-radius:999px;
        padding:6px 10px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        line-height:1;
        font-family: var(--md-text-font-family, inherit);
        font-size:12px;
        font-weight:400;
        box-sizing:border-box;
        min-height:36px;
        cursor:pointer;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.02);
        transition: background .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease, transform .18s ease;
      }
      #mw-mastery .mw-aiq-btn:hover,
      #mw-mastery .mw-aiq-btn:focus-visible{
        background: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 15%, rgba(255,255,255,.08)) !important;
        border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 48%, var(--md-default-fg-color--lightest)) !important;
        box-shadow: 0 8px 18px rgba(0,0,0,.12), 0 0 0 1px color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%, transparent) !important;
        transform: translateY(-1px);
      }
      #mw-mastery .mw-aiq-btn svg,
      #mw-mastery .mw-aiq-btn svg *{
        width:18px;
        height:18px;
        display:block;
        color: currentColor !important;
        stroke: currentColor !important;
        fill: none !important;
      }
      #mw-mastery .mw-aiq-btn-label{font-size:12px;line-height:1;font-weight:400;opacity:.9;color:inherit!important;}
      html[data-md-color-scheme="slate"] #mw-mastery .mw-aiq-btn,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-aiq-btn{color: rgba(255,255,255,.96) !important;}

      /* AI mastery check button: use the same visual metrics as the mastery pills. */
      #mw-mastery .mw-aiq-btn,
      #mw-mastery .mw-meta.mw-aiq-host > button,
      #mw-mastery [data-aiq-widget-host="1"] > button{
        min-height:38px !important;
        padding:6px 10px !important;
        gap:8px !important;
        line-height:1 !important;
        font-size:12px !important;
        font-weight:400 !important;
        box-shadow:none !important;
        white-space:nowrap !important;
        vertical-align:middle !important;
      }
      #mw-mastery .mw-aiq-btn-label,
      #mw-mastery .mw-meta.mw-aiq-host > button .mw-aiq-btn-label,
      #mw-mastery [data-aiq-widget-host="1"] > button .mw-aiq-btn-label{
        font-size:12px !important;
        line-height:1 !important;
        font-weight:400 !important;
        opacity:.9 !important;
      }
      #mw-mastery .mw-aiq-btn svg,
      #mw-mastery .mw-meta.mw-aiq-host > button svg,
      #mw-mastery [data-aiq-widget-host="1"] > button svg{
        width:18px !important;
        height:18px !important;
      }
      #mw-mastery .mw-recap,
      .mw-title-menu .mw-recap{
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:16px;
        background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.025));
        overflow:hidden;
      }
      #mw-mastery .mw-recap[hidden],
      .mw-title-menu .mw-recap[hidden]{
        display:none !important;
      }
      #mw-mastery .mw-recap-summary,
      .mw-title-menu .mw-recap-summary{
        appearance:none;
        width:100%;
        border:0;
        padding:10px 12px;
        background:transparent;
        color:inherit;
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        text-align:left;
        cursor:pointer;
      }
      #mw-mastery .mw-recap-summary:hover,
      .mw-title-menu .mw-recap-summary:hover,
      #mw-mastery .mw-recap-summary:focus-visible,
      .mw-title-menu .mw-recap-summary:focus-visible{
        background: rgba(255,255,255,.04);
      }
      #mw-mastery .mw-recap-summary-copy,
      .mw-title-menu .mw-recap-summary-copy{
        min-width:0;
        display:grid;
        gap:4px;
      }
      #mw-mastery .mw-recap-kicker,
      .mw-title-menu .mw-recap-kicker{
        font-size:.71rem;
        letter-spacing:.08em;
        text-transform:uppercase;
        opacity:.62;
        font-weight:700;
      }
      #mw-mastery .mw-recap-line,
      .mw-title-menu .mw-recap-line{
        font-size:.88rem;
        line-height:1.42;
        opacity:.92;
      }
      #mw-mastery .mw-recap-caret,
      .mw-title-menu .mw-recap-caret{
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        opacity:.72;
        transform:rotate(0deg);
        transition: transform .18s ease, opacity .18s ease;
      }
      #mw-mastery .mw-recap-summary[aria-expanded="true"] .mw-recap-caret,
      .mw-title-menu .mw-recap-summary[aria-expanded="true"] .mw-recap-caret{
        transform:rotate(180deg);
        opacity:.96;
      }
      #mw-mastery .mw-recap-panel,
      .mw-title-menu .mw-recap-panel{
        padding:0 12px 12px;
        display:grid;
        gap:10px;
      }
      #mw-mastery .mw-recap-panel[hidden],
      .mw-title-menu .mw-recap-panel[hidden]{
        display:none !important;
      }
      #mw-mastery .mw-recap-insight,
      .mw-title-menu .mw-recap-insight{
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:12px;
        padding:9px 10px;
        background: rgba(255,255,255,.035);
        display:grid;
        gap:4px;
      }
      #mw-mastery .mw-recap-mode,
      .mw-title-menu .mw-recap-mode{
        font-size:.71rem;
        letter-spacing:.07em;
        text-transform:uppercase;
        font-weight:700;
        opacity:.66;
      }
      #mw-mastery .mw-recap-text,
      .mw-title-menu .mw-recap-text{
        font-size:.84rem;
        line-height:1.45;
        opacity:.94;
      }
      #mw-mastery .mw-recap-list,
      .mw-title-menu .mw-recap-list{
        list-style:none;
        margin:0;
        padding:0;
        display:grid;
        gap:10px;
      }
      #mw-mastery .mw-recap-item,
      .mw-title-menu .mw-recap-item{
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        align-items:start;
        gap:8px;
      }
      #mw-mastery .mw-recap-dot,
      .mw-title-menu .mw-recap-dot{
        width:8px;
        height:8px;
        margin-top:.42rem;
        border-radius:999px;
        background: rgba(99, 132, 255, .85);
        box-shadow: 0 0 0 4px rgba(99, 132, 255, .12);
      }
      #mw-mastery .mw-recap-dot[data-kind="view"],
      .mw-title-menu .mw-recap-dot[data-kind="view"]{
        background: rgba(88, 200, 170, .92);
        box-shadow: 0 0 0 4px rgba(88, 200, 170, .14);
      }
      #mw-mastery .mw-recap-dot[data-mw-effect-tier="master"],
      .mw-title-menu .mw-recap-dot[data-mw-effect-tier="master"]{
        background: var(--mw-master-gold-border);
        box-shadow: 0 0 0 4px rgba(226, 179, 54, .14);
      }
      #mw-mastery .mw-recap-dot[data-mw-effect-tier="know"],
      .mw-title-menu .mw-recap-dot[data-mw-effect-tier="know"]{
        background: var(--mw-know-silver-border);
        box-shadow: 0 0 0 4px rgba(196, 207, 223, .14);
      }
      #mw-mastery .mw-recap-dot[data-m="1"],
      .mw-title-menu .mw-recap-dot[data-m="1"]{
        background: rgba(255, 184, 76, .92);
        box-shadow: 0 0 0 4px rgba(255, 184, 76, .14);
      }
      #mw-mastery .mw-recap-dot[data-m="0"],
      .mw-title-menu .mw-recap-dot[data-m="0"]{
        background: rgba(255, 115, 115, .92);
        box-shadow: 0 0 0 4px rgba(255, 115, 115, .14);
      }
      #mw-mastery .mw-recap-main,
      .mw-title-menu .mw-recap-main{
        min-width:0;
        display:grid;
        gap:3px;
      }
      #mw-mastery .mw-recap-label,
      .mw-title-menu .mw-recap-label{
        font-size:.84rem;
        line-height:1.44;
        opacity:.94;
      }
      #mw-mastery .mw-recap-sub,
      .mw-title-menu .mw-recap-sub{
        font-size:.76rem;
        opacity:.64;
      }
      #mw-mastery .mw-recap-when,
      .mw-title-menu .mw-recap-when{
        font-size:.74rem;
        opacity:.64;
        white-space:nowrap;
        padding-top:.1rem;
      }
      #mw-mastery .mw-recap-empty,
      .mw-title-menu .mw-recap-empty{
        font-size:.81rem;
        opacity:.68;
      }
      #mw-mastery .mw-manage .mw-short,
      #mw-mastery-compact .mw-manage .mw-short{display:none;}
      #mw-mastery-compact .mw-manage .mw-full{display:none;}
      #mw-mastery-compact .mw-manage .mw-short{display:inline;}
      @media (max-width: 720px){
        #mw-mastery .mw-manage .mw-full{display:none;}
        #mw-mastery .mw-manage .mw-short{display:inline;}
      }
      #mw-mastery.mw-managed-to-title .mw-head .mw-manage{opacity:0;pointer-events:none;transform:scale(.9);}

      article.md-content__inner h1.lp-h1-row .lp-h1-left{
        display:flex;
        align-items:center;
        gap:0;
        min-width:0;
        width:100%;
        flex:1 1 auto;
      }
      article.md-content__inner h1.lp-h1-row .mw-h1-title-text{
        display:block;
        min-width:0;
        width:0;
        max-width:100%;
        flex:1 1 0%;
        box-sizing:border-box;
        color: var(--mw-title-plain-ink);
        transition: color .4s ease, filter .4s ease, text-shadow .4s ease, opacity .28s ease, padding-left .28s cubic-bezier(.22,1,.36,1);
      }
      article.md-content__inner h1.lp-h1-row[data-mw-level] .mw-h1-title-text{
        color: var(--mw-title-plain-ink);
        text-shadow: none;
        filter: none;
        animation: none;
      }
      article.md-content__inner h1.lp-h1-row[data-mw-effect-tier="master"] .mw-h1-title-text{
        color: var(--mw-master-gold-ink);
        text-shadow:
          0 0 16px var(--mw-master-gold-glow-soft),
          0 0 38px var(--mw-master-gold-glow-strong);
        filter: drop-shadow(0 0 6px var(--mw-master-gold-glow-soft));
        animation: mw-master-title-glow 1.9s ease-in-out infinite alternate;
      }
      article.md-content__inner h1.lp-h1-row[data-mw-effect-tier="know"] .mw-h1-title-text{
        color: var(--mw-know-silver-ink);
        text-shadow:
          0 0 10px var(--mw-know-silver-glow-soft),
          0 0 24px var(--mw-know-silver-glow-strong);
        filter: drop-shadow(0 0 2px var(--mw-know-silver-glow-soft));
        animation: mw-know-title-glow 2.3s ease-in-out infinite alternate;
      }

      article.md-content__inner h1.lp-h1-row .mw-title-badge{
  appearance:none;
  -webkit-appearance:none;
  padding:0;
  font:inherit;
  line-height:1;
  text-align:center;
  width:0;
  min-width:0;
  height:38px;
  margin-right:0;
  overflow:visible;
  opacity:0;
  pointer-events:none;
  transform: translateX(-8px) scale(.82);
  transition:
    width .28s cubic-bezier(.22,1,.36,1),
    margin-right .28s cubic-bezier(.22,1,.36,1),
    opacity .18s ease,
    transform .28s cubic-bezier(.22,1,.36,1);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius:0;
  border:none;
  background: transparent !important;
  box-shadow:none !important;
  filter:none !important;
  flex:0 0 auto;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge.is-armed,
article.md-content__inner h1.lp-h1-row .mw-title-badge.is-visible{
  width:38px;
  margin-right:.72rem;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge.is-visible{
  opacity:1;
  pointer-events:none;
  transform: translateX(0) scale(1);
}

article.md-content__inner h1.lp-h1-row .mw-title-badge svg{
  width:34px;
  height:34px;
  display:block;
  overflow:visible;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-m]{
  color: var(--mw-title-plain-ink);
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="master"]{
  color: var(--mw-master-gold-ink);
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="know"]{
  color: var(--mw-know-silver-ink);
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-m] svg{
  filter:none;
  animation:none;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="master"] svg{
  filter:
    drop-shadow(0 0 10px var(--mw-master-gold-glow-soft))
    drop-shadow(0 0 24px var(--mw-master-gold-glow-strong));
  animation: mw-master-icon-ink-glow 1.7s ease-in-out infinite alternate;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="know"] svg{
  filter:
    drop-shadow(0 0 6px var(--mw-know-silver-glow-soft))
    drop-shadow(0 0 14px var(--mw-know-silver-glow-strong));
  animation: mw-know-icon-ink-glow 2.2s ease-in-out infinite alternate;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="master"] svg,
article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="master"] svg *,
.mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="master"] svg,
.mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="master"] svg *{
  color: var(--mw-master-gold-ink) !important;
  stroke: var(--mw-master-gold-ink) !important;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="know"] svg,
article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-effect-tier="know"] svg *,
.mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="know"] svg,
.mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="know"] svg *{
  color: var(--mw-know-silver-ink) !important;
  stroke: var(--mw-know-silver-ink) !important;
}

article.md-content__inner h1.lp-h1-row .mw-title-badge[data-m]:not([data-mw-effect-tier]) svg,
article.md-content__inner h1.lp-h1-row .mw-title-badge[data-m]:not([data-mw-effect-tier]) svg *,
.mw-fly-ghost.mw-fly-ghost--badge[data-m]:not([data-mw-effect-tier]) svg,
.mw-fly-ghost.mw-fly-ghost--badge[data-m]:not([data-mw-effect-tier]) svg *{
  color: var(--mw-title-plain-ink) !important;
  stroke: var(--mw-title-plain-ink) !important;
}

@keyframes mw-master-title-glow{
  0%{
    text-shadow:
      0 0 12px var(--mw-master-gold-glow-soft),
      0 0 28px var(--mw-master-gold-glow-soft);
    filter: drop-shadow(0 0 4px var(--mw-master-gold-glow-soft));
  }
  100%{
    text-shadow:
      0 0 20px var(--mw-master-gold-glow-strong),
      0 0 46px var(--mw-master-gold-glow-strong);
    filter: drop-shadow(0 0 7px var(--mw-master-gold-glow-strong));
  }
}

@keyframes mw-know-title-glow{
  0%{
    text-shadow:
      0 0 7px var(--mw-know-silver-glow-soft),
      0 0 16px var(--mw-know-silver-glow-soft);
    filter: drop-shadow(0 0 2px var(--mw-know-silver-glow-soft));
  }
  100%{
    text-shadow:
      0 0 12px var(--mw-know-silver-glow-strong),
      0 0 28px var(--mw-know-silver-glow-strong);
    filter: drop-shadow(0 0 4px var(--mw-know-silver-glow-strong));
  }
}

@keyframes mw-master-icon-ink-glow{
  0%{
    filter:
      drop-shadow(0 0 8px var(--mw-master-gold-glow-soft))
      drop-shadow(0 0 18px var(--mw-master-gold-glow-soft));
  }
  100%{
    filter:
      drop-shadow(0 0 12px var(--mw-master-gold-glow-strong))
      drop-shadow(0 0 28px var(--mw-master-gold-glow-strong));
  }
}

@keyframes mw-know-icon-ink-glow{
  0%{
    filter:
      drop-shadow(0 0 4px var(--mw-know-silver-glow-soft))
      drop-shadow(0 0 9px var(--mw-know-silver-glow-soft));
  }
  100%{
    filter:
      drop-shadow(0 0 7px var(--mw-know-silver-glow-strong))
      drop-shadow(0 0 16px var(--mw-know-silver-glow-strong));
  }
}
      article.md-content__inner h1.lp-h1-row .mw-h1-manage{
        width:0;
        min-width:0;
        max-width:0;
        height:38px;
        margin-right:0;
        overflow:hidden;
        opacity:0;
        pointer-events:none;
        transform: translateX(-8px) scale(.82);
        transition:
          width .28s cubic-bezier(.22,1,.36,1),
          min-width .28s cubic-bezier(.22,1,.36,1),
          max-width .28s cubic-bezier(.22,1,.36,1),
          margin-right .28s cubic-bezier(.22,1,.36,1),
          opacity .18s ease,
          transform .28s cubic-bezier(.22,1,.36,1);
        flex:0 0 auto;
      }

      article.md-content__inner h1.lp-h1-row .mw-h1-manage:not(.is-visible):not(.is-armed){
        display:none !important;
        border-color: transparent !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      article.md-content__inner h1.lp-h1-row[data-mw-hidden-icon="manage"] .mw-h1-manage,
      article.md-content__inner h1.lp-h1-row .mw-h1-manage.is-armed,
      article.md-content__inner h1.lp-h1-row .mw-h1-manage.is-visible{
        width:38px;
        min-width:38px;
        max-width:38px;
        margin-right:.72rem;
      }

      article.md-content__inner h1.lp-h1-row[data-mw-hidden-icon="manage"] .mw-h1-manage,
      article.md-content__inner h1.lp-h1-row .mw-h1-manage.is-visible{
        display:inline-flex !important;
        opacity:1;
        pointer-events:auto;
        transform: translateX(0) scale(1);
      }

      article.md-content__inner h1.lp-h1-row .mw-title-badge:not(.is-visible):not(.is-armed){
        display:none !important;
      }

      article.md-content__inner h1.lp-h1-row .mw-title-badge.is-visible{
        pointer-events:auto;
        cursor:pointer;
      }

      article.md-content__inner h1.lp-h1-row .mw-title-badge,
      article.md-content__inner h1.lp-h1-row .mw-title-badge *,
      article.md-content__inner h1.lp-h1-row .mw-h1-manage,
      article.md-content__inner h1.lp-h1-row .mw-h1-manage *{
        -webkit-user-select:none !important;
        user-select:none !important;
        -webkit-touch-callout:none !important;
        -webkit-tap-highlight-color:transparent !important;
      }

      article.md-content__inner h1.lp-h1-row[data-mw-level] .lp-h1-left,
      article.md-content__inner h1.lp-h1-row[data-mw-level] .mw-h1-title-text,
      article.md-content__inner h1.lp-h1-row[data-mw-hidden-icon] .lp-h1-left,
      article.md-content__inner h1.lp-h1-row[data-mw-hidden-icon] .mw-h1-title-text,
      article.md-content__inner h1.lp-h1-row.mw-title-no-select,
      article.md-content__inner h1.lp-h1-row.mw-title-no-select *{
        -webkit-user-select:none !important;
        user-select:none !important;
        -webkit-touch-callout:none !important;
      }

      article.md-content__inner h1.lp-h1-row .mw-title-badge,
      article.md-content__inner h1.lp-h1-row .mw-h1-manage{
        touch-action:manipulation;
        cursor:pointer;
      }

      html[data-md-color-scheme="slate"] article.md-content__inner h1.lp-h1-row .lp-h1-map,
      body[data-md-color-scheme="slate"] article.md-content__inner h1.lp-h1-row .lp-h1-map{
        color: rgba(255,255,255,.96) !important;
      }

      html[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row .lp-h1-map,
      body[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row .lp-h1-map{
        border-color: rgba(84, 92, 108, .30) !important;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.03);
      }

            html[data-md-color-scheme="slate"] article.md-content__inner h1.lp-h1-row .lp-h1-map svg,
      body[data-md-color-scheme="slate"] article.md-content__inner h1.lp-h1-row .lp-h1-map svg{
        color: currentColor !important;
        stroke: currentColor !important;
      }

      html[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row .lp-h1-map,
      body[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row .lp-h1-map{
        border-color: rgba(70, 78, 96, .42) !important;
      }

      html.mw-title-measuring article.md-content__inner h1.lp-h1-row .mw-title-badge,
      html.mw-title-measuring article.md-content__inner h1.lp-h1-row .mw-h1-manage{
        transition: none !important;
        animation: none !important;
      }
      article.md-content__inner h1.lp-h1-row .mw-flight-hidden{
        opacity: 0 !important;
        pointer-events: none !important;
      }
      article.md-content__inner h1.lp-h1-row .mw-title-badge[data-mw-flight-lock="1"],
      article.md-content__inner h1.lp-h1-row .mw-h1-manage[data-mw-flight-lock="1"]{
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      .mw-pulse-once{
        animation: mwPulseOnce .36s cubic-bezier(.2,.9,.2,1) 1;
      }
      @keyframes mwPulseOnce{
        0%{ transform: scale(1); }
        55%{ transform: scale(1.08); }
        100%{ transform: scale(1); }
      }
      article.md-content__inner h1.lp-h1-row .mw-title-badge.mw-badge-crossfade{
        transition:
          width .18s cubic-bezier(.22,1,.36,1),
          margin-right .18s cubic-bezier(.22,1,.36,1),
          opacity .14s ease,
          transform .16s cubic-bezier(.22,1,.36,1);
      }

      .mw-fly-layer{
        --mw-header-occlusion-bottom: 0px;
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483000;
        clip-path: inset(var(--mw-header-occlusion-bottom, 0px) 0 0 0);
        -webkit-clip-path: inset(var(--mw-header-occlusion-bottom, 0px) 0 0 0);
      }

      @media (hover: hover) and (pointer: fine){
        #mw-mastery.mw-search-suppressed{
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          filter: none !important;
          -webkit-filter: none !important;
        }
        #mw-mastery.mw-search-suppressed .mw-pill,
        #mw-mastery.mw-search-suppressed .mw-manage,
        #mw-mastery.mw-search-suppressed .mw-hide,
        #mw-mastery.mw-search-suppressed .mw-ready-chip,
        #mw-mastery.mw-search-suppressed .mw-recap-chip,
        #mw-mastery.mw-search-suppressed .mw-aiq-btn{
          pointer-events: auto !important;
        }
      }

      #mw-mastery.mw-search-suppressed{
        /* Keep the main widget visible so it sits under the mobile search blur,
           but never let it be interactive while header search is open. */
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: none !important;
        filter: none !important;
        -webkit-filter: none !important;
        z-index: auto !important;
      }
      #mw-mastery-compact.mw-search-suppressed{
        /* Compact mode should never peek through the search close animation. */
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        filter: none !important;
        -webkit-filter: none !important;
        z-index: auto !important;
      }

      .mw-fly-layer.mw-search-suppressed,
      .mw-title-menu.mw-search-suppressed{
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      .mw-fly-ghost{
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        will-change: transform, opacity;
        pointer-events: none;
        user-select: none;
        z-index: 2;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        box-sizing:border-box;
      }
      .mw-fly-ghost.mw-fly-ghost--badge{
        width:38px;
        height:38px;
        border-radius:0;
        background: transparent !important;
        border:none !important;
        box-shadow:none !important;
        filter:none !important;
      }
      .mw-fly-ghost.mw-fly-ghost--badge svg{
        width:34px;
        height:34px;
        display:block;
        overflow:visible;
      }
      .mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="master"]{
        color: var(--mw-master-gold-ink);
      }
      .mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="know"]{
        color: var(--mw-know-silver-ink);
      }
      .mw-fly-ghost.mw-fly-ghost--badge[data-m]:not([data-mw-effect-tier]){
        color: var(--mw-title-plain-ink);
      }
      .mw-fly-ghost.mw-fly-ghost--badge[data-m] svg{
        filter:none;
        animation:none;
      }
      .mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="master"] svg{
        filter:
          drop-shadow(0 0 10px var(--mw-master-gold-glow-soft))
          drop-shadow(0 0 24px var(--mw-master-gold-glow-strong));
        animation: mw-master-icon-ink-glow 1.7s ease-in-out infinite alternate;
      }
      .mw-fly-ghost.mw-fly-ghost--badge[data-mw-effect-tier="know"] svg{
        filter:
          drop-shadow(0 0 6px var(--mw-know-silver-glow-soft))
          drop-shadow(0 0 14px var(--mw-know-silver-glow-strong));
        animation: mw-know-icon-ink-glow 2.2s ease-in-out infinite alternate;
      }
      .mw-fly-ghost.mw-fly-ghost--badge svg{
        display:block;
      }
      .mw-fly-ghost.mw-fly-ghost--title-word{
        transform: none;
        transform-origin: top left;
        align-items:flex-start;
        justify-content:flex-start;
        padding:0;
        margin:0;
        border:none !important;
        border-radius:0 !important;
        background:transparent !important;
        box-shadow:none !important;
        filter:none;
        white-space:pre;
        overflow:visible;
      }
      @media (max-width: 960px){
        #mw-mastery-compact{
          max-width: calc(100vw - 10px);
          padding: 6px 7px;
        }
        #mw-mastery-compact .mw-row{ gap:6px; }
        #mw-mastery-compact .mw-pill,
        #mw-mastery-compact .mw-manage{ padding:4px 8px; }
      }
      @media (min-width: 721px){
        #mw-mastery .mw-row{
          padding-right:0;
          flex-wrap:nowrap;
          justify-content:flex-start;
          width:100%;
          overflow-x:visible;
        }
        #mw-mastery .mw-row .mw-pill{
          flex:0 0 auto;
          min-width:0;
          white-space:nowrap;
        }
        #mw-mastery .mw-row .mw-pill[data-m="0"]{
          order:4;
        }
      }
      @media (max-width: 720px){
        #mw-mastery{ padding:10px 12px 12px; }
        #mw-mastery .mw-row{ padding-right:0; }
        #mw-mastery .mw-meta{
          padding-right:44px;
          margin-top:7px;
        }
        #mw-mastery .mw-head{ gap:7px; margin-bottom:8px; }
        #mw-mastery .mw-title{ font-size: .94em; line-height:1.14; }
        #mw-mastery.mw-needs-rating .mw-title::after{
          width:7px;
          height:7px;
          margin-left:6px;
        }
        #mw-mastery .mw-manage{
          position:absolute;
          right:12px;
          bottom:8px;
          width:32px;
          min-width:32px;
          max-width:32px;
          height:32px;
          min-height:32px;
          padding:0;
          gap:0;
          order:4;
          font-size:0;
          z-index:2;
        }
        #mw-mastery .mw-hide{
          width:32px;
          min-width:32px;
          max-width:32px;
          min-height:32px;
          padding:0;
          gap:0;
          order:3;
          font-size:0;
        }
        #mw-mastery .mw-ready-chip{ order:1; }
        #mw-mastery .mw-recap-chip{
          width:32px;
          min-width:32px;
          max-width:32px;
          min-height:32px;
          padding:0;
          gap:0;
          order:2;
          font-size:0;
        }
        #mw-mastery .mw-recap-chip-label,
        #mw-mastery .mw-hide .mw-short,
        #mw-mastery .mw-hide .mw-full,
        #mw-mastery .mw-manage .mw-full,
        #mw-mastery .mw-manage .mw-short{
          display:none !important;
        }
        #mw-mastery .mw-recap-chip-ico svg,
        #mw-mastery .mw-manage .mw-gear svg,
        #mw-mastery .mw-hide .mw-hide-ico svg{ width:16px; height:16px; }
        #mw-mastery .mw-row{
          display:flex;
          width:auto;
          gap:6px;
          align-items:center;
          justify-content:flex-start;
          flex-wrap:nowrap;
        }
        #mw-mastery .mw-pill{
          width:auto;
          flex:0 0 auto;
          padding:3px 8px;
          gap:5px;
          min-height:34px;
        }
        #mw-mastery .mw-emo{
          flex:0 0 auto;
          min-width:14px;
        }
        #mw-mastery .mw-emo svg{
          width:14px;
          height:14px;
        }
        #mw-mastery .mw-lab{
          font-size:11px;
          white-space:nowrap;
          letter-spacing:-0.01em;
        }
        #mw-mastery .mw-meta{
          font-size:.8em;
          margin-top:7px;
        }
        #mw-mastery .mw-meta.mw-aiq-host{padding-right:44px;}
        #mw-mastery .mw-aiq-btn,
        #mw-mastery .mw-meta.mw-aiq-host > button,
        #mw-mastery [data-aiq-widget-host="1"] > button{
          min-height:34px !important;
          padding:3px 8px !important;
          gap:5px !important;
          font-size:11px !important;
          line-height:1 !important;
          box-shadow:none !important;
          white-space:nowrap !important;
        }
        #mw-mastery .mw-aiq-btn-label,
        #mw-mastery .mw-meta.mw-aiq-host > button .mw-aiq-btn-label,
        #mw-mastery [data-aiq-widget-host="1"] > button .mw-aiq-btn-label{font-size:11px !important;line-height:1 !important;}
        #mw-mastery .mw-aiq-btn svg,
        #mw-mastery .mw-meta.mw-aiq-host > button svg,
        #mw-mastery [data-aiq-widget-host="1"] > button svg{width:14px !important;height:14px !important;}
        #mw-mastery .mw-recap{ margin-bottom:0; }
        #mw-mastery .mw-recap-summary{ padding:9px 10px; }
        #mw-mastery .mw-recap-line{ font-size:.82rem; }
        #mw-mastery .mw-recap-panel{ padding:0 10px 10px; }
        #mw-mastery .mw-recap-item{ grid-template-columns:auto minmax(0,1fr); }
        #mw-mastery .mw-recap-when{ grid-column:2; padding-top:0; }
                #mw-mastery-compact{
          width: max-content;
          max-width: calc(100vw - 8px);
          padding: 4px 5px;
        }
        #mw-mastery-compact .mw-row{
          display:flex;
          width:auto;
          gap:4px;
          align-items:center;
          flex-wrap:nowrap;
        }
        #mw-mastery-compact .mw-pill{
          width:auto;
          flex:0 0 auto;
          padding:4px 6px;
          gap:4px;
          min-height:32px;
        }
        #mw-mastery-compact .mw-emo svg{
          width:15px;
          height:15px;
        }
        #mw-mastery-compact .mw-lab{
          font-size:11px;
          white-space:nowrap;
        }
        #mw-mastery-compact .mw-manage{
          width:32px;
          min-width:32px;
          max-width:32px;
          min-height:32px;
          padding:0;
          gap:0;
          color: inherit;
          border-color: var(--md-default-fg-color--lightest);
          background: rgba(255,255,255,.04);
        }
        #mw-mastery-compact .mw-manage .mw-full,
        #mw-mastery-compact .mw-manage .mw-short{
          display:none !important;
        }
        #mw-mastery-compact .mw-manage .mw-gear svg{
          width:16px;
          height:16px;
        }
        article.md-content__inner h1.lp-h1-row .mw-title-badge{
  height:34px;
}
article.md-content__inner h1.lp-h1-row .mw-title-badge.is-armed,
article.md-content__inner h1.lp-h1-row .mw-title-badge.is-visible{
  width:34px;
}
article.md-content__inner h1.lp-h1-row .mw-title-badge svg{
  width:28px;
  height:28px;
}
        .mw-fly-ghost.mw-fly-ghost--badge{
          width:34px !important;
          height:34px !important;
        }
        .mw-fly-ghost.mw-fly-ghost--badge svg{
          width:28px !important;
          height:28px !important;
        }
        article.md-content__inner h1.lp-h1-row .lp-h1-map{
          width:34px !important;
          min-width:34px !important;
          max-width:34px !important;
          height:34px !important;
          padding:0 !important;
          line-height:0 !important;
        }
        article.md-content__inner h1.lp-h1-row .mw-h1-manage{
          height:34px !important;
          padding:0 !important;
          line-height:0 !important;
        }
        article.md-content__inner h1.lp-h1-row[data-mw-hidden-icon="manage"] .mw-h1-manage,
        article.md-content__inner h1.lp-h1-row .mw-h1-manage.is-armed,
        article.md-content__inner h1.lp-h1-row .mw-h1-manage.is-visible{
          width:34px !important;
          min-width:34px !important;
          max-width:34px !important;
          height:34px !important;
          padding:0 !important;
          margin-right:.56rem !important;
        }
        article.md-content__inner h1.lp-h1-row .mw-h1-manage svg{
          width:18px !important;
          height:18px !important;
        }
        article.md-content__inner h1.lp-h1-row .lp-h1-left{
          width:100% !important;
          flex:1 1 auto !important;
        }
        article.md-content__inner h1.lp-h1-row .mw-h1-title-text{
          width:0 !important;
          max-width:100% !important;
          flex:1 1 0% !important;
        }
        article.md-content__inner h1.lp-h1-row[data-mw-manage-reserve="1"] .mw-h1-title-text{
          padding-left: var(--mw-manage-reserve, 0px) !important;
        }
      }
    `;
    document.head.appendChild(st);
  }

  function normaliseMathDelimitersToDollar(s) {
    return String(s || "")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$");
  }

  function mwCompactMarkup() {
    // Compact mode is intentionally icon-only. Keep title/aria-label for accessibility,
    // but do not put visible text nodes into the compact widget.
    return `
      <div class="mw-row" aria-label="Mastery quick actions">
        <button type="button" class="mw-pill" data-m="3" title="Mastered" aria-label="Mastered">
          <span class="mw-emo">${mwSvgForLevel(3, 18)}</span>
        </button>
        <button type="button" class="mw-pill" data-m="2" title="Clear" aria-label="Clear">
          <span class="mw-emo">${mwSvgForLevel(2, 18)}</span>
        </button>
        <button type="button" class="mw-pill" data-m="1" title="Unclear" aria-label="Unclear">
          <span class="mw-emo">${mwSvgForLevel(1, 18)}</span>
        </button>
        <button type="button" class="mw-pill" data-m="0" title="Unknown" aria-label="Unknown">
          <span class="mw-emo">${mwSvgForLevel(0, 18)}</span>
        </button>
        <button type="button" class="mw-hide" title="Hide mastery bar" aria-label="Hide mastery bar" data-mw-hide="1">
          <span class="mw-hide-ico">${mwHideIconHtml()}</span>
        </button>
        <a class="mw-manage" href="#" title="Manage mastery" aria-label="Manage mastery" data-mw-manage="1">
          <span class="mw-gear">${mwGearHtml()}</span>
        </a>
      </div>
    `;
  }

  function mwEnsureFlyLayer() {
    let layer = document.querySelector(".mw-fly-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "mw-fly-layer";
      document.body.appendChild(layer);
    }
    mwBindFlyLayerHeaderClipRefresh();
    mwSyncFlyLayerHeaderClip(layer);
    return layer;
  }

  function mwRemoveGhost(ghost) {
    if (!ghost) return;
    try { ghost.remove(); } catch (_) {}
    try {
      const layer = document.querySelector(".mw-fly-layer");
      if (layer && !layer.children.length) layer.remove();
    } catch (_) {}
  }

  function mwClearFlyGhosts() {
    try {
      document.querySelectorAll(".mw-fly-layer .mw-fly-ghost").forEach((node) => {
        try { node.remove(); } catch (_) {}
      });
      const layer = document.querySelector(".mw-fly-layer");
      if (layer && !layer.children.length) layer.remove();
    } catch (_) {}
  }

  function mwCreateGhost(kind, m, sourceEl, destinationEl) {
    if (kind !== "badge") return null;

    const layer = mwEnsureFlyLayer();
    const ghost = document.createElement("div");
    ghost.className = "mw-fly-ghost mw-fly-ghost--badge";
    ghost.setAttribute("data-m", String(m));
    try { mwSyncEffectTierAttr(ghost, m); } catch (_) {}
    ghost.innerHTML = mwSvgForLevel(m, 18);

    if (destinationEl && destinationEl.classList) {
      ghost.classList.add(...Array.from(destinationEl.classList).filter((x) => x !== "is-armed" && x !== "is-visible" && x !== "mw-flight-hidden"));
    }
    ghost.classList.add("is-visible");

    if (destinationEl) {
      const cs = getComputedStyle(destinationEl);
      const rect = destinationEl.getBoundingClientRect();
      ghost.style.width = Math.max(34, Math.round(rect.width || destinationEl.offsetWidth || 38)) + "px";
      ghost.style.height = Math.max(34, Math.round(rect.height || destinationEl.offsetHeight || 38)) + "px";
      ghost.style.color = cs.color;
    }

    layer.appendChild(ghost);
    return ghost;
  }

  function mwAnimateGhost(ghost, fromPt, toPt, opts) {
    const duration = Math.max(180, Math.min(1200, Number(opts && opts.duration) || 420));
    const easing = String((opts && opts.easing) || "cubic-bezier(.22, 1, .36, 1)");
    if (!ghost || !fromPt || !toPt) return Promise.resolve();
    try { mwSyncFlyLayerHeaderClip(ghost.closest ? ghost.closest(".mw-fly-layer") : null); } catch (_) {}

    ghost.style.left = fromPt.x + "px";
    ghost.style.top = fromPt.y + "px";

    const dx = toPt.x - fromPt.x;
    const dy = toPt.y - fromPt.y;
    const control = {
      x: fromPt.x + dx * 0.45,
      y: fromPt.y + dy * 0.25 - 60,
    };
    const mid1 = mwBezierQuad(fromPt, control, toPt, 0.55);
    const mid2 = mwBezierQuad(fromPt, control, toPt, 0.82);
    const base = "translate(-50%, -50%)";
    const kf = [
      { transform: `${base} translate(0px, 0px) scale(1)`, opacity: 1, offset: 0 },
      { transform: `${base} translate(${dx * 0.06}px, -18px) scale(1.10)`, opacity: 1, offset: 0.14 },
      { transform: `${base} translate(${mid1.x - fromPt.x}px, ${mid1.y - fromPt.y}px) scale(1.04)`, opacity: 1, offset: 0.58 },
      { transform: `${base} translate(${mid2.x - fromPt.x}px, ${mid2.y - fromPt.y}px) scale(1.01)`, opacity: 1, offset: 0.82 },
      { transform: `${base} translate(${dx}px, ${dy}px) scale(1)`, opacity: 1, offset: 1 },
    ];

    if (ghost.animate) {
      const anim = ghost.animate(kf, {
        duration,
        easing,
        fill: "forwards",
      });
      return new Promise((resolve) => {
        let done = false;
        let timer = 0;
        const finish = () => {
          if (done) return;
          done = true;
          try { if (timer) window.clearTimeout(timer); } catch (_) {}
          resolve();
        };
        try { timer = window.setTimeout(finish, duration + 260); } catch (_) {}
        try { anim.finished.then(finish, finish); } catch (_) { finish(); }
      });
    }

    ghost.style.left = toPt.x + "px";
    ghost.style.top = toPt.y + "px";
    return Promise.resolve();
  }

  function mwCloneRectLike(rect) {
    if (!rect) return null;
    const left = Number(rect.left) || 0;
    const top = Number(rect.top) || 0;
    const right = Number(rect.right) || 0;
    const bottom = Number(rect.bottom) || 0;
    const width = Number(rect.width) || Math.max(0, right - left);
    const height = Number(rect.height) || Math.max(0, bottom - top);
    return { left, top, right, bottom, width, height };
  }

  function mwRectLooksUsable(rect) {
    return !!(
      rect &&
      Number.isFinite(rect.left) &&
      Number.isFinite(rect.top) &&
      Number(rect.width) > 6 &&
      Number(rect.height) > 6
    );
  }

  function mwReadRectSafe(el) {
    if (!el || !el.getBoundingClientRect) return null;
    try {
      return mwCloneRectLike(el.getBoundingClientRect());
    } catch (_) {
      return null;
    }
  }

  function mwForceManageMeasure(manageTarget) {
    if (!manageTarget || !manageTarget.style) return () => {};
    const prev = {
      display: manageTarget.style.display,
      visibility: manageTarget.style.visibility,
      opacity: manageTarget.style.opacity,
      width: manageTarget.style.width,
      minWidth: manageTarget.style.minWidth,
      maxWidth: manageTarget.style.maxWidth,
      height: manageTarget.style.height,
      marginRight: manageTarget.style.marginRight,
      pointerEvents: manageTarget.style.pointerEvents,
      overflow: manageTarget.style.overflow,
    };
    let marginRight = '.72rem';
    let height = '38px';
    let width = '38px';
    try {
      const cs = getComputedStyle(manageTarget);
      const liveRect = mwReadRectSafe(manageTarget);
      if (cs && cs.marginRight) marginRight = cs.marginRight;
      if (cs && cs.height && cs.height !== 'auto') height = cs.height;
      const hinted = Math.max(
        parseFloat(cs && cs.width || '') || 0,
        parseFloat(cs && cs.height || '') || 0,
        Number(liveRect && liveRect.width) || 0,
        Number(liveRect && liveRect.height) || 0,
        34
      );
      width = `${Math.round(hinted)}px`;
    } catch (_) {}
    try {
      manageTarget.style.display = 'inline-flex';
      manageTarget.style.visibility = 'hidden';
      manageTarget.style.opacity = '0';
      manageTarget.style.width = width;
      manageTarget.style.minWidth = width;
      manageTarget.style.maxWidth = width;
      manageTarget.style.height = height;
      manageTarget.style.marginRight = marginRight;
      manageTarget.style.pointerEvents = 'none';
      manageTarget.style.overflow = 'hidden';
    } catch (_) {}
    return () => {
      try {
        manageTarget.style.display = prev.display;
        manageTarget.style.visibility = prev.visibility;
        manageTarget.style.opacity = prev.opacity;
        manageTarget.style.width = prev.width;
        manageTarget.style.minWidth = prev.minWidth;
        manageTarget.style.maxWidth = prev.maxWidth;
        manageTarget.style.height = prev.height;
        manageTarget.style.marginRight = prev.marginRight;
        manageTarget.style.pointerEvents = prev.pointerEvents;
        manageTarget.style.overflow = prev.overflow;
      } catch (_) {}
    };
  }

  function mwResolveManageTargetRect(manageTarget, sc) {
    let size = 38;
    try {
      const cs = manageTarget ? getComputedStyle(manageTarget) : null;
      const liveRect = mwReadRectSafe(manageTarget);
      size = Math.max(
        34,
        Math.round(Math.max(
          parseFloat(cs && cs.width || '') || 0,
          parseFloat(cs && cs.height || '') || 0,
          Number(liveRect && liveRect.width) || 0,
          Number(liveRect && liveRect.height) || 0,
          0
        )) || 38
      );
    } catch (_) {}
    let restoreMeasure = null;
    try { restoreMeasure = mwForceManageMeasure(manageTarget); } catch (_) {}

    try {
      const probes = [
        manageTarget,
        manageTarget && manageTarget.querySelector ? manageTarget.querySelector('.mw-gear') : null,
        manageTarget && manageTarget.querySelector ? manageTarget.querySelector('svg') : null,
      ];
      for (const probe of probes) {
        const rect = mwReadRectSafe(probe);
        if (mwRectLooksUsable(rect)) return rect;
      }

      let gap = 0;
      try {
        const cs = getComputedStyle(manageTarget || (sc && sc.titleText) || document.documentElement);
        gap = parseFloat((manageTarget ? cs.marginRight : '0') || '0') || 0;
      } catch (_) {}

      const titleLineRect = mwUnionRects(
        Array.from((sc && sc.titleText && sc.titleText.getClientRects ? sc.titleText.getClientRects() : []) || []).map(mwCloneRectLike)
      );
      const titleRect = mwRectLooksUsable(titleLineRect)
        ? titleLineRect
        : mwReadRectSafe(sc && sc.titleText ? sc.titleText : null);
      if (mwRectLooksUsable(titleRect)) {
        const left = Math.max(8, (Number(titleRect.left) || 0) - size - gap);
        const top = Math.max(8, Math.min(
          window.innerHeight - size - 8,
          (Number(titleRect.top) || 0) + Math.max(0, ((Number(titleRect.height) || 0) - size) / 2)
        ));
        return { left, top, width: size, height: size, right: left + size, bottom: top + size };
      }

      const leftRect = mwReadRectSafe(sc && sc.left ? sc.left : null);
      if (mwRectLooksUsable(leftRect)) {
        const top = Math.max(8, Math.min(window.innerHeight - size - 8, leftRect.top + Math.max(0, (leftRect.height - size) / 2)));
        const left = Math.max(8, leftRect.left);
        return { left, top, width: size, height: size, right: left + size, bottom: top + size };
      }

      const badgeRect = mwReadRectSafe(sc && sc.badge ? sc.badge : null);
      if (mwRectLooksUsable(badgeRect)) return badgeRect;

      const pad = 18;
      const left = pad;
      const top = Math.max(pad, Math.min(window.innerHeight - size - pad, mwHeaderHeight() + 12));
      return { left, top, width: size, height: size, right: left + size, bottom: top + size };
    } finally {
      try { if (typeof restoreMeasure === 'function') restoreMeasure(); } catch (_) {}
    }
  }

  function mwUnionRects(rects) {
    const list = Array.isArray(rects) ? rects.filter(Boolean) : [];
    if (!list.length) return null;
    let left = list[0].left;
    let top = list[0].top;
    let right = list[0].right;
    let bottom = list[0].bottom;
    for (let i = 1; i < list.length; i += 1) {
      const rect = list[i];
      left = Math.min(left, rect.left);
      top = Math.min(top, rect.top);
      right = Math.max(right, rect.right);
      bottom = Math.max(bottom, rect.bottom);
    }
    return mwCloneRectLike({ left, top, right, bottom, width: right - left, height: bottom - top });
  }

  function mwLineCountFromRects(rects) {
    const list = Array.isArray(rects) ? rects.filter((rect) => rect && rect.width > 0.5 && rect.height > 0.5) : [];
    if (!list.length) return 1;
    const tops = [];
    list.forEach((rect) => {
      const top = Number(rect.top) || 0;
      const hit = tops.some((seen) => Math.abs(seen - top) <= 2);
      if (!hit) tops.push(top);
    });
    return Math.max(1, tops.length || 0);
  }

  function mwCollectWordRects(root) {
    if (!root || !document.createTreeWalker || !window.Range) return [];
    const out = [];
    let walker = null;
    try {
      walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const text = String(node && node.textContent || "");
          if (!/\S/.test(text)) return NodeFilter.FILTER_REJECT;
          try {
            const parent = node.parentElement;
            if (parent) {
              const cs = window.getComputedStyle(parent);
              if (cs.display === "none" || cs.visibility === "hidden") return NodeFilter.FILTER_REJECT;
            }
          } catch (_) {}
          return NodeFilter.FILTER_ACCEPT;
        },
      });
    } catch (_) {
      return out;
    }

    const range = document.createRange();
    let node = null;
    while ((node = walker.nextNode())) {
      const text = String(node.textContent || "");
      const re = /\S+/g;
      let match = null;
      while ((match = re.exec(text))) {
        try {
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          const rect = mwUnionRects(Array.from(range.getClientRects()).map(mwCloneRectLike));
          if (rect && rect.width > 0.5 && rect.height > 0.5) {
            out.push({ text: match[0], rect });
          }
        } catch (_) {}
      }
    }
    try { if (typeof range.detach === "function") range.detach(); } catch (_) {}
    return out;
  }

  function mwResetTitleFlight(titleEl) {
    if (!titleEl || !titleEl.style) return;
    try { titleEl.style.transition = ""; } catch (_) {}
    try { titleEl.style.transform = ""; } catch (_) {}
    try { titleEl.style.opacity = ""; } catch (_) {}
    try { titleEl.style.willChange = ""; } catch (_) {}
  }

  function mwCreateTitleWordGhost(titleEl, text, rect) {
    if (!titleEl || !rect) return null;
    const layer = mwEnsureFlyLayer();
    const ghost = document.createElement("span");
    ghost.className = "mw-fly-ghost mw-fly-ghost--title-word";
    ghost.textContent = text;

    let cs = null;
    try { cs = window.getComputedStyle(titleEl); } catch (_) {}

    try { ghost.style.left = `${Math.round(rect.left)}px`; } catch (_) {}
    try { ghost.style.top = `${Math.round(rect.top)}px`; } catch (_) {}
    try { ghost.style.width = `${Math.max(1, Math.round(rect.width || 0))}px`; } catch (_) {}
    try { ghost.style.height = `${Math.max(1, Math.round(rect.height || 0))}px`; } catch (_) {}
    try { ghost.style.color = cs ? cs.color : ""; } catch (_) {}
    try { ghost.style.font = cs ? cs.font : ""; } catch (_) {}
    try { ghost.style.fontFamily = cs ? cs.fontFamily : ""; } catch (_) {}
    try { ghost.style.fontSize = cs ? cs.fontSize : ""; } catch (_) {}
    try { ghost.style.fontWeight = cs ? cs.fontWeight : ""; } catch (_) {}
    try { ghost.style.fontStyle = cs ? cs.fontStyle : ""; } catch (_) {}
    try { ghost.style.lineHeight = cs ? cs.lineHeight : ""; } catch (_) {}
    try { ghost.style.letterSpacing = cs ? cs.letterSpacing : ""; } catch (_) {}
    try { ghost.style.textTransform = cs ? cs.textTransform : ""; } catch (_) {}
    try { ghost.style.textShadow = cs ? cs.textShadow : ""; } catch (_) {}
    try { ghost.style.textAlign = "left"; } catch (_) {}
    try { ghost.style.whiteSpace = "pre"; } catch (_) {}

    layer.appendChild(ghost);
    return ghost;
  }

  function mwAnimateTitleTranslate(titleEl, measure, duration, easing) {
    if (!titleEl || !measure || !measure.titleBefore || !measure.titleAfter) return Promise.resolve();
    const dx = (Number(measure.titleBefore.left) || 0) - (Number(measure.titleAfter.left) || 0);
    if (Math.abs(dx) < 1) {
      mwResetTitleFlight(titleEl);
      return Promise.resolve();
    }

    const ms = Math.max(180, Math.min(900, Number(duration) || 600));
    mwResetTitleFlight(titleEl);
    try { titleEl.style.willChange = "transform"; } catch (_) {}
    try { titleEl.style.transition = "none"; } catch (_) {}
    try { titleEl.style.transform = `translateX(${dx}px)`; } catch (_) {}
    try { void titleEl.offsetWidth; } catch (_) {}

    return new Promise((resolve) => {
      let done = false;
      let timer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        try { if (timer) window.clearTimeout(timer); } catch (_) {}
        try { titleEl.removeEventListener("transitionend", onEnd); } catch (_) {}
        mwResetTitleFlight(titleEl);
        resolve();
      };
      const onEnd = (ev) => {
        if (!ev || ev.target !== titleEl || ev.propertyName !== "transform") return;
        finish();
      };
      try { titleEl.addEventListener("transitionend", onEnd); } catch (_) {}
      timer = window.setTimeout(finish, ms + 140);
      requestAnimationFrame(() => {
        try {
          titleEl.style.transition = `transform ${ms}ms ${String(easing || "cubic-bezier(.22, 1, .36, 1)")}`;
          titleEl.style.transform = "translateX(0px)";
        } catch (_) {
          finish();
        }
      });
    });
  }

  function mwAnimateTitleTranslateFromOffset(titleEl, startDx, duration, easing) {
    if (!titleEl) return Promise.resolve();
    const dx = Number(startDx) || 0;
    if (Math.abs(dx) < 1) {
      try { titleEl.style.transition = ""; } catch (_) {}
      try { titleEl.style.transform = ""; } catch (_) {}
      try { titleEl.style.willChange = ""; } catch (_) {}
      return Promise.resolve();
    }

    const ms = Math.max(180, Math.min(900, Number(duration) || 600));
    try { titleEl.style.willChange = "transform"; } catch (_) {}
    try { titleEl.style.transition = "none"; } catch (_) {}
    try { titleEl.style.transform = `translateX(${dx}px)`; } catch (_) {}
    try { void titleEl.offsetWidth; } catch (_) {}

    return new Promise((resolve) => {
      let done = false;
      let timer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        try { if (timer) window.clearTimeout(timer); } catch (_) {}
        try { titleEl.removeEventListener("transitionend", onEnd); } catch (_) {}
        try { titleEl.style.transition = ""; } catch (_) {}
        try { titleEl.style.transform = ""; } catch (_) {}
        try { titleEl.style.willChange = ""; } catch (_) {}
        resolve();
      };
      const onEnd = (ev) => {
        if (!ev || ev.target !== titleEl || ev.propertyName !== "transform") return;
        finish();
      };
      try { titleEl.addEventListener("transitionend", onEnd); } catch (_) {}
      timer = window.setTimeout(finish, ms + 140);
      requestAnimationFrame(() => {
        try {
          titleEl.style.transition = `transform ${ms}ms ${String(easing || "cubic-bezier(.22, 1, .36, 1)")}`;
          titleEl.style.transform = "translateX(0px)";
        } catch (_) {
          finish();
        }
      });
    });
  }

  function mwAnimateTitleWordFlight(titleEl, measure, duration) {
    const before = Array.isArray(measure && measure.wordsBefore) ? measure.wordsBefore : [];
    const after = Array.isArray(measure && measure.wordsAfter) ? measure.wordsAfter : [];
    const count = Math.min(before.length, after.length);
    if (!titleEl || !count) return mwAnimateTitleTranslate(titleEl, measure, duration);

    const wordFlightMs = 400;
    const translateMs = 600;
    const layoutDx = ((measure && measure.titleBefore ? Number(measure.titleBefore.left) || 0 : 0) -
      (measure && measure.titleAfter ? Number(measure.titleAfter.left) || 0 : 0));
    const ghosts = [];

    mwResetTitleFlight(titleEl);
    try { titleEl.style.transition = "none"; } catch (_) {}
    try { titleEl.style.transform = `translateX(${layoutDx}px)`; } catch (_) {}
    try { titleEl.style.opacity = "0"; } catch (_) {}
    try { titleEl.style.willChange = "transform, opacity"; } catch (_) {}

    for (let i = 0; i < count; i += 1) {
      const from = before[i] && before[i].rect ? before[i].rect : null;
      const word = before[i] ? before[i].text : "";
      const toRaw = after[i] && after[i].rect ? after[i].rect : null;
      if (!from || !word || !toRaw) continue;
      const ghost = mwCreateTitleWordGhost(titleEl, word, from);
      const to = toRaw ? {
        left: (Number(toRaw.left) || 0) + layoutDx,
        top: Number(toRaw.top) || 0,
        right: (Number(toRaw.right) || 0) + layoutDx,
        bottom: Number(toRaw.bottom) || 0,
        width: Number(toRaw.width) || Math.max(0, (Number(toRaw.right) || 0) - (Number(toRaw.left) || 0)),
        height: Number(toRaw.height) || Math.max(0, (Number(toRaw.bottom) || 0) - (Number(toRaw.top) || 0)),
      } : null;
      if (ghost) ghosts.push({ ghost, from, to, index: i });
    }

    if (!ghosts.length) {
      try { titleEl.style.opacity = ""; } catch (_) {}
      return mwAnimateTitleTranslate(titleEl, measure, translateMs);
    }

    const stagger = ghosts.length > 1 ? Math.min(28, Math.floor(160 / ghosts.length)) : 0;
    const jobs = ghosts.map(({ ghost, from, to, index }) => {
      if (!ghost || !from || !to) return Promise.resolve();
      const dx = (Number(to.left) || 0) - (Number(from.left) || 0);
      const dy = (Number(to.top) || 0) - (Number(from.top) || 0);
      const delay = Math.min(120, index * stagger);
      const dur = Math.max(180, wordFlightMs - delay);
      const lift = Math.max(10, Math.min(26, 10 + Math.abs(dx) * 0.05 + Math.abs(dy) * 0.20));
      const kf = [
        { transform: "translate(0px, 0px)", opacity: 1, offset: 0 },
        { transform: `translate(${Math.round(dx * 0.32)}px, ${Math.round(Math.min(-10, dy * 0.08 - lift))}px)`, opacity: 1, offset: 0.40 },
        { transform: `translate(${Math.round(dx * 0.80)}px, ${Math.round(dy - lift * 0.18)}px)`, opacity: 1, offset: 0.84 },
        { transform: `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`, opacity: 1, offset: 1 },
      ];

      if (ghost.animate) {
        const anim = ghost.animate(kf, {
          duration: dur,
          delay,
          easing: "cubic-bezier(.22, 1, .36, 1)",
          fill: "forwards",
        });
        return anim.finished.catch(() => {}).then(() => {});
      }

      try { ghost.style.transform = `translate(${dx}px, ${dy}px)`; } catch (_) {}
      return Promise.resolve();
    });

    return Promise.all(jobs)
      .catch(() => {})
      .then(() => {
        ghosts.forEach(({ ghost }) => mwRemoveGhost(ghost));
        try { titleEl.style.opacity = "1"; } catch (_) {}
        return mwAnimateTitleTranslateFromOffset(titleEl, layoutDx, translateMs);
      })
      .then(() => {
        try { titleEl.style.opacity = ""; } catch (_) {}
        try { titleEl.style.transition = ""; } catch (_) {}
        try { titleEl.style.transform = ""; } catch (_) {}
        try { titleEl.style.willChange = ""; } catch (_) {}
      })
      .catch(() => {
        ghosts.forEach(({ ghost }) => mwRemoveGhost(ghost));
        mwResetTitleFlight(titleEl);
      });
  }

  function mwAnimateTitleFlow(titleEl, measure, duration, opts) {
    if (!titleEl || !measure) return Promise.resolve();
    const cfg = opts && typeof opts === "object" ? opts : null;
    const easing = cfg && cfg.easing ? cfg.easing : undefined;
    if (cfg && cfg.forceSimple) return mwAnimateTitleTranslate(titleEl, measure, duration, easing);
    if (measure.wrapsToMultipleLines) return mwAnimateTitleWordFlight(titleEl, measure, duration);
    return mwAnimateTitleTranslate(titleEl, measure, duration, easing);
  }

  const MW_COLLAPSED_LINE_SLOT_PX = 39;

  function mwReadCssPxVar(el, name, fallback) {
    const prop = String(name || "").trim();
    const fb = Number(fallback) || 0;
    if (!prop) return fb;
    const hosts = [el, document.documentElement, document.body].filter(Boolean);
    for (const host of hosts) {
      try {
        const raw = window.getComputedStyle(host).getPropertyValue(prop).trim();
        if (!raw) continue;
        const n = parseFloat(raw);
        if (Number.isFinite(n)) return n;
      } catch (_) {}
    }
    return fb;
  }

  function mwCollapsedLineMarginTopPx(el) {
    return Math.max(0, mwReadCssPxVar(el, "--mw-collapsed-line-margin-top", 20));
  }

  function mwCollapsedLineMarginBottomPx(el) {
    return Math.max(0, mwReadCssPxVar(el, "--mw-collapsed-line-margin-bottom", 18));
  }

  function mwCollapsedLineSlotPx(el) {
    const top = mwCollapsedLineMarginTopPx(el);
    const bottom = mwCollapsedLineMarginBottomPx(el);
    return Math.max(8, mwReadCssPxVar(el, "--mw-collapsed-line-slot", top + 1 + bottom));
  }

  function mwDismissLineKindForLevel(m) {
    const tier = mwMasteryEffectTierForLevel(m);
    if (Number(m) === 3 && tier === "master") return "master";
    if (Number(m) === 2 && tier === "know") return "know";
    return "default";
  }

  function mwApplyAnchorLine(anchor, kind, interactive, opts) {
    if (!anchor) return;
    try { mwSyncSectionLineColor(anchor); } catch (_) {}
    const options = opts && typeof opts === "object" ? opts : {};
    const animate = !!options.animate && !mwMotionReduced();
    const curve = String(options.easing || "cubic-bezier(.22,1,.36,1)");
    const ms = Math.max(180, Number(options.duration) || 0);
    const height = Math.max(8, Number(options.height) || mwCollapsedLineSlotPx(anchor));
    const lineKind = String(kind || "default");
    const canClick = !!interactive;

    try {
      anchor.classList.add("mw-anchor--line");
      anchor.setAttribute("data-mw-line-kind", lineKind);
      if (canClick) anchor.setAttribute("data-mw-line-interactive", "1");
      else anchor.removeAttribute("data-mw-line-interactive");
      anchor.style.pointerEvents = canClick ? "auto" : "none";
    } catch (_) {}

    if (!animate) {
      try {
        anchor.style.transition = "";
        anchor.style.height = `${height}px`;
        anchor.style.maxHeight = `${height}px`;
        anchor.style.opacity = "1";
      } catch (_) {}
      return;
    }

    try {
      anchor.style.transition = [
        `height ${ms}ms ${curve}`,
        `max-height ${ms}ms ${curve}`,
        `opacity ${Math.max(180, Math.min(ms, 280))}ms ease`
      ].join(", ");
      anchor.style.height = "0px";
      anchor.style.maxHeight = "0px";
      anchor.style.opacity = "0";
      void anchor.offsetHeight;
      requestAnimationFrame(() => {
        try {
          anchor.style.height = `${height}px`;
          anchor.style.maxHeight = `${height}px`;
          anchor.style.opacity = "1";
        } catch (_) {}
      });
    } catch (_) {}
  }

  function mwClearAnchorLine(anchor, opts) {
    if (!anchor) return;
    try { anchor.classList.remove("mw-anchor--reserve"); } catch (_) {}
    const options = opts && typeof opts === "object" ? opts : {};
    const animate = !!options.animate && !mwMotionReduced();
    const curve = String(options.easing || "cubic-bezier(.22,1,.36,1)");
    const ms = Math.max(180, Number(options.duration) || 0);

    const finish = () => {
      try {
        anchor.classList.remove("mw-anchor--line");
        anchor.removeAttribute("data-mw-line-kind");
        anchor.removeAttribute("data-mw-line-interactive");
        anchor.style.height = "0px";
        anchor.style.maxHeight = "0px";
        anchor.style.opacity = "0";
        anchor.style.pointerEvents = "none";
      } catch (_) {}
    };

    if (!animate) {
      finish();
      return;
    }

    try {
      const currentHeight = Math.max(
        Number(anchor.getBoundingClientRect().height) || 0,
        Number(parseFloat(anchor.style.height)) || 0,
        mwCollapsedLineSlotPx(anchor)
      );
      anchor.style.transition = [
        `height ${ms}ms ${curve}`,
        `max-height ${ms}ms ${curve}`,
        `opacity ${Math.max(180, Math.min(ms, 240))}ms ease`
      ].join(", ");
      anchor.style.height = `${currentHeight}px`;
      anchor.style.maxHeight = `${currentHeight}px`;
      anchor.style.opacity = "1";
      anchor.style.pointerEvents = "none";
      requestAnimationFrame(() => {
        try {
          anchor.style.height = "0px";
          anchor.style.maxHeight = "0px";
          anchor.style.opacity = "0";
        } catch (_) {}
      });
      window.setTimeout(finish, ms + 60);
    } catch (_) {
      finish();
    }
  }

  function mwApplyDismissedLineState(state, opts) {
    if (!state || !state.anchor) return;
    mwApplyAnchorLine(
      state.anchor,
      state.dismissLineKind || "default",
      !!state.dismissLineInteractive,
      opts
    );
  }

  function mwClearDismissedLineState(state, opts) {
    if (!state || !state.anchor) return;
    mwClearAnchorLine(state.anchor, opts);
  }

  function mwApplyCollapsedBoxLine(box, kind, interactive) {
    if (!box) return;
    try { mwSyncSectionLineColor(box); } catch (_) {}
    try {
      box.classList.add("mw-collapsed-line");
      box.setAttribute("data-mw-collapsed-kind", String(kind || "default"));
      if (interactive) box.setAttribute("data-mw-collapsed-interactive", "1");
      else box.removeAttribute("data-mw-collapsed-interactive");
      box.setAttribute("aria-hidden", "true");
      box.style.pointerEvents = interactive ? "auto" : "none";
      box.style.overflow = "visible";
      box.style.opacity = "1";
      box.style.height = "1px";
      box.style.maxHeight = "1px";
      box.style.minHeight = "1px";
      box.style.paddingTop = "0px";
      box.style.paddingRight = "0px";
      box.style.paddingBottom = "0px";
      box.style.paddingLeft = "0px";
      box.style.marginTop = mwCollapsedLineMarginTopPx(box) + "px";
      box.style.marginBottom = mwCollapsedLineMarginBottomPx(box) + "px";
      box.style.borderTopWidth = "0px";
      box.style.borderLeftWidth = "0px";
      box.style.borderRightWidth = "0px";
      box.style.borderBottomWidth = "1px";
    } catch (_) {}
  }

  function mwClearCollapsedBoxLine(box) {
    if (!box) return;
    try {
      box.classList.remove("mw-collapsed-line");
      box.removeAttribute("data-mw-collapsed-kind");
      box.removeAttribute("data-mw-collapsed-interactive");
      box.removeAttribute("aria-hidden");
      box.style.pointerEvents = "";
    } catch (_) {}
  }

  function mwClearCollapseStyles(el) {
    if (!el || !el.style) return;
    try {
      el.style.height = "";
      el.style.maxHeight = "";
      el.style.minHeight = "";
      el.style.overflow = "";
      el.style.pointerEvents = "";
      el.style.paddingTop = "";
      el.style.paddingRight = "";
      el.style.paddingBottom = "";
      el.style.paddingLeft = "";
      el.style.marginTop = "";
      el.style.marginRight = "";
      el.style.marginBottom = "";
      el.style.marginLeft = "";
      el.style.borderTopWidth = "";
      el.style.borderRightWidth = "";
      el.style.borderBottomWidth = "";
      el.style.borderLeftWidth = "";
      el.style.borderTopColor = "";
      el.style.borderRightColor = "";
      el.style.borderBottomColor = "";
      el.style.borderLeftColor = "";
      el.style.borderColor = "";
      el.style.borderRadius = "";
      el.style.boxShadow = "";
      el.style.background = "";
      el.style.backdropFilter = "";
      el.style.webkitBackdropFilter = "";
      el.style.filter = "";
      el.style.opacity = "";
      el.style.transform = "";
      el.style.transformOrigin = "";
      el.style.transition = "";
      el.style.transitionProperty = "";
      el.style.transitionDuration = "";
      el.style.transitionTimingFunction = "";
      el.style.willChange = "";
      el.style.contain = "";
      el.style.boxSizing = "";
    } catch (_) {}
  }

  function mwFreezeWidgetInnerMotion(root) {
    if (!root || !root.querySelectorAll) return () => {};
    const nodes = [root].concat(Array.from(root.querySelectorAll([
      ".mw-head",
      ".mw-row",
      ".mw-meta",
      ".mw-recap",
      ".mw-pill",
      ".mw-manage",
      ".mw-hide",
      ".mw-recap-chip",
      ".mw-pill .mw-emo",
      ".mw-pill .mw-lab",
      ".mw-gear",
      ".mw-hide-ico",
      ".mw-mi"
    ].join(", "))));
    nodes.forEach((node) => {
      if (!node || !node.style) return;
      try {
        node.style.setProperty("transition", "none", "important");
        node.style.setProperty("animation", "none", "important");
        node.style.setProperty("will-change", "auto", "important");
      } catch (_) {}
    });
    return () => {
      nodes.forEach((node) => {
        if (!node || !node.style) return;
        try {
          node.style.removeProperty("transition");
          node.style.removeProperty("animation");
          node.style.removeProperty("will-change");
        } catch (_) {}
      });
    };
  }


  function mwNodePathFromAncestor(root, node) {
    if (!root || !node) return null;
    const path = [];
    let cur = node;
    while (cur && cur !== root) {
      const parent = cur.parentNode;
      if (!parent) return null;
      path.unshift(Array.prototype.indexOf.call(parent.childNodes || [], cur));
      cur = parent;
    }
    return cur === root ? path : null;
  }

  function mwNodeFromPath(root, path) {
    if (!root || !Array.isArray(path)) return null;
    let cur = root;
    for (let i = 0; i < path.length; i += 1) {
      const idx = Number(path[i]);
      if (!cur || !cur.childNodes || idx < 0 || idx >= cur.childNodes.length) return null;
      cur = cur.childNodes[idx];
    }
    return cur || null;
  }

  function mwInlineComputedTreeStyles(source, clone) {
    if (!source || !clone || source.nodeType !== 1 || clone.nodeType !== 1) return;
    try {
      const cs = window.getComputedStyle(source);
      for (let i = 0; i < cs.length; i += 1) {
        const prop = cs[i];
        if (!prop) continue;
        try { clone.style.setProperty(prop, cs.getPropertyValue(prop)); } catch (_) {}
      }
      try { clone.style.setProperty("transition", "none", "important"); } catch (_) {}
      try { clone.style.setProperty("transition-property", "none", "important"); } catch (_) {}
      try { clone.style.setProperty("transition-duration", "0s", "important"); } catch (_) {}
      try { clone.style.setProperty("animation", "none", "important"); } catch (_) {}
      try { clone.style.setProperty("animation-name", "none", "important"); } catch (_) {}
      try { clone.style.setProperty("animation-duration", "0s", "important"); } catch (_) {}
      try { clone.style.setProperty("will-change", "auto", "important"); } catch (_) {}
    } catch (_) {}

    const srcKids = source.childNodes || [];
    const cloneKids = clone.childNodes || [];
    const n = Math.min(srcKids.length, cloneKids.length);
    for (let i = 0; i < n; i += 1) {
      if (srcKids[i] && cloneKids[i] && srcKids[i].nodeType === 1 && cloneKids[i].nodeType === 1) {
        mwInlineComputedTreeStyles(srcKids[i], cloneKids[i]);
      }
    }
  }

function mwCreateCollapseVisualOverlay(root, opts) {
  // Snapshot overlay is intentionally used during collapse: the live widget keeps
  // changing layout height, while the overlay provides one stable visual layer.
  // The live widget is hidden immediately, so even sub-pixel differences cannot
  // show up as a second frame.
  if (!root || !root.cloneNode || typeof root.getBoundingClientRect !== "function") return () => {};
  let rect = null;
  try { rect = root.getBoundingClientRect(); } catch (_) { rect = null; }
  if (!rect || rect.width <= 0 || rect.height <= 0) return () => {};

  const options = opts && typeof opts === "object" ? opts : {};
  const excludeNode = options.excludeNode || null;
  const excludePath = excludeNode ? mwNodePathFromAncestor(root, excludeNode) : null;
  const overlay = root.cloneNode(true);
  const layer = mwEnsureFlyLayer();
  const mask = document.createElement("div");
  if (!overlay || !layer || !mask) return () => {};

  try { overlay.removeAttribute("id"); } catch (_) {}
  try { overlay.setAttribute("aria-hidden", "true"); } catch (_) {}
  try { overlay.setAttribute("data-mw-collapse-overlay", "1"); } catch (_) {}
  try { mask.setAttribute("data-mw-collapse-overlay-mask", "1"); } catch (_) {}
  mwInlineComputedTreeStyles(root, overlay);

  let rootCs = null;
  try { rootCs = window.getComputedStyle(root); } catch (_) { rootCs = null; }
  const cssVal = (prop, fallback) => {
    try {
      const v = rootCs && rootCs.getPropertyValue ? rootCs.getPropertyValue(prop) : "";
      return v ? String(v).trim() : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const borderRadius = cssVal("border-radius", "0px");

  // The mask is the real visible chrome. It copies the source border-box exactly
  // and then collapses frame-by-frame in mwAnimateCollapse().
  try {
    mask.style.setProperty("position", "absolute", "important");
    mask.style.setProperty("left", rect.left.toFixed(3) + "px", "important");
    mask.style.setProperty("top", rect.top.toFixed(3) + "px", "important");
    mask.style.setProperty("width", rect.width.toFixed(3) + "px", "important");
    mask.style.setProperty("height", rect.height.toFixed(3) + "px", "important");
    mask.style.setProperty("box-sizing", "border-box", "important");
    mask.style.setProperty("margin", "0", "important");
    mask.style.setProperty("padding", "0", "important");
    mask.style.setProperty("pointer-events", "none", "important");
    // Keep the collapse snapshot below the flying icon ghosts within the clipped fly layer.
    mask.style.setProperty("z-index", "1", "important");
    mask.style.setProperty("transform", "translateZ(0)");
    mask.style.setProperty("opacity", "1");
    mask.style.setProperty("overflow", "hidden", "important");
    mask.style.setProperty("background", cssVal("background", cssVal("background-color", "transparent")), "important");
    mask.style.setProperty("background-color", cssVal("background-color", "transparent"), "important");
    mask.style.setProperty("background-image", cssVal("background-image", "none"), "important");
    mask.style.setProperty("background-clip", cssVal("background-clip", "border-box"), "important");
    mask.style.setProperty("box-shadow", cssVal("box-shadow", "none"), "important");
    mask.style.setProperty("border-top", `${cssVal("border-top-width", "0px")} ${cssVal("border-top-style", "solid")} ${cssVal("border-top-color", "transparent")}`, "important");
    mask.style.setProperty("border-right", `${cssVal("border-right-width", "0px")} ${cssVal("border-right-style", "solid")} ${cssVal("border-right-color", "transparent")}`, "important");
    mask.style.setProperty("border-bottom", `${cssVal("border-bottom-width", "1px")} ${cssVal("border-bottom-style", "solid")} ${cssVal("border-bottom-color", "currentColor")}`, "important");
    mask.style.setProperty("border-left", `${cssVal("border-left-width", "0px")} ${cssVal("border-left-style", "solid")} ${cssVal("border-left-color", "transparent")}`, "important");
    mask.style.setProperty("border-radius", borderRadius, "important");
    const pcFastVisual = (typeof mwIsFinePointerDesktop === "function" && mwIsFinePointerDesktop());
    mask.style.setProperty("backdrop-filter", pcFastVisual ? "none" : cssVal("backdrop-filter", "none"), "important");
    mask.style.setProperty("-webkit-backdrop-filter", pcFastVisual ? "none" : cssVal("-webkit-backdrop-filter", "none"), "important");
    mask.style.setProperty("filter", "none", "important");
    mask.style.setProperty("transform-origin", "50% 0%", "important");
    mask.style.setProperty("contain", "paint", "important");
    mask.style.setProperty("will-change", pcFastVisual ? "transform, opacity" : "height, border-width, border-radius, opacity", "important");
  } catch (_) {}

  // The clone supplies only frozen inner content. Its outer chrome is made
  // transparent so the mask is the single frame users see. Padding/border widths
  // are kept for identical child placement.
  try {
    overlay.style.setProperty("position", "absolute", "important");
    overlay.style.setProperty("left", "0px", "important");
    overlay.style.setProperty("top", "0px", "important");
    overlay.style.setProperty("width", rect.width.toFixed(3) + "px", "important");
    overlay.style.setProperty("height", rect.height.toFixed(3) + "px", "important");
    overlay.style.setProperty("box-sizing", "border-box", "important");
    overlay.style.setProperty("margin", "0", "important");
    overlay.style.setProperty("pointer-events", "none", "important");
    overlay.style.setProperty("transform", "translateZ(0)");
    overlay.style.setProperty("transform-origin", "50% 0%", "important");
    overlay.style.setProperty("opacity", "1");
    overlay.style.setProperty("overflow", "visible", "important");
    overlay.style.setProperty("background", "transparent", "important");
    overlay.style.setProperty("background-color", "transparent", "important");
    overlay.style.setProperty("background-image", "none", "important");
    overlay.style.setProperty("box-shadow", "none", "important");
    overlay.style.setProperty("border-color", "transparent", "important");
    overlay.style.setProperty("outline", "0", "important");
    overlay.style.setProperty("backdrop-filter", "none", "important");
    overlay.style.setProperty("-webkit-backdrop-filter", "none", "important");
    overlay.style.setProperty("filter", "none", "important");
    overlay.style.setProperty("will-change", "opacity, transform", "important");
  } catch (_) {}

  if (excludePath) {
    const cloneExcluded = mwNodeFromPath(overlay, excludePath);
    if (cloneExcluded && cloneExcluded.style) {
      try { cloneExcluded.style.setProperty("visibility", "hidden", "important"); } catch (_) {}
      try { cloneExcluded.style.setProperty("opacity", "0", "important"); } catch (_) {}
      try { cloneExcluded.style.setProperty("pointer-events", "none", "important"); } catch (_) {}
    }
  }

  const rootSnapshot = {
    visibility: root.style.visibility,
    opacity: root.style.opacity,
    pointerEvents: root.style.pointerEvents,
    filter: root.style.filter,
  };

  try {
    // Hide the live widget as a whole, not just children. This is what prevents
    // the "two slightly different boxes" effect. Layout animation still runs.
    root.style.setProperty("visibility", "hidden", "important");
    root.style.setProperty("opacity", "0", "important");
    root.style.setProperty("pointer-events", "none", "important");
  } catch (_) {}

  try {
    mask.appendChild(overlay);
    layer.appendChild(mask);
    root.__mwCollapseOverlayMask = mask;
    root.__mwCollapseOverlayContent = overlay;
    root.__mwCollapseOverlayFx = { mask, content: overlay };
  } catch (_) {}

  return () => {
    let endLine = null;
    try {
      const fx = root.__mwCollapseOverlayFx || null;
      endLine = fx && fx.endLine ? fx.endLine : null;
    } catch (_) { endLine = null; }

    // Restore the live source before removing the overlay. At the end of a
    // rating flight the live source is already the collapsed 1px line, so this
    // avoids a one-frame blank between the overlay collapse and the persistent line.
    try { root.style.visibility = rootSnapshot.visibility; } catch (_) {}
    try { root.style.opacity = rootSnapshot.opacity; } catch (_) {}
    try { root.style.pointerEvents = rootSnapshot.pointerEvents; } catch (_) {}
    try { root.style.filter = rootSnapshot.filter; } catch (_) {}

    try { mask.remove(); } catch (_) {}
    try { if (endLine && endLine.parentNode) endLine.remove(); } catch (_) {}
    try { if (root.__mwCollapseOverlayMask === mask) root.__mwCollapseOverlayMask = null; } catch (_) {}
    try { if (root.__mwCollapseOverlayContent === overlay) root.__mwCollapseOverlayContent = null; } catch (_) {}
    try { if (root.__mwCollapseOverlayFx && root.__mwCollapseOverlayFx.mask === mask) root.__mwCollapseOverlayFx = null; } catch (_) {}
  };
}


function mwAnimateCollapseFastPc(el, duration, easing, opts) {
    if (!el) return Promise.resolve(false);
    let overlayFx = null;
    try { overlayFx = el.__mwCollapseOverlayFx || null; } catch (_) { overlayFx = null; }
    if (!overlayFx || !overlayFx.mask || !overlayFx.mask.style) return Promise.resolve(false);

    const ms = Math.max(480, Math.min(980, Number(duration) || 720));
    const options = opts && typeof opts === "object" ? opts : {};
    const reserveAnchor = options.reserveAnchor || null;
    const reserveHeight = Math.max(8, Number(options.reserveHeight) || mwCollapsedLineSlotPx(el));
    const reserveKind = String(options.reserveKind || "default");
    const reserveInteractive = !!options.reserveInteractive;
    const targetMarginTop = mwCollapsedLineMarginTopPx(el);
    const targetMarginBottom = mwCollapsedLineMarginBottomPx(el);
    const releaseInnerFreeze = mwFreezeWidgetInnerMotion(el);

    let rect = null;
    let cs = null;
    try { rect = el.getBoundingClientRect(); } catch (_) { rect = null; }
    try { cs = window.getComputedStyle(el); } catch (_) { cs = null; }
    const px = (v, fallback) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : (Number(fallback) || 0);
    };
    const startHeight = Math.max(1, rect && rect.height ? rect.height : (el.offsetHeight || el.scrollHeight || 1));
    const startMarginTop = px(cs && cs.marginTop, 0);
    const startMarginBottom = px(cs && cs.marginBottom, 0);
    const startOuter = Math.max(1, startHeight + startMarginTop + startMarginBottom);
    const targetOuter = Math.max(1, 1 + targetMarginTop + targetMarginBottom);
    const spacerHeight = Math.max(0, startOuter - targetOuter);
    let spacer = null;

    const revealReserveLine = () => {
      if (!reserveAnchor) return;
      try {
        reserveAnchor.classList.remove("mw-anchor--reserve");
        reserveAnchor.classList.add("mw-anchor--line");
        reserveAnchor.style.opacity = "1";
      } catch (_) {}
    };

    if (reserveAnchor) {
      try {
        mwSyncSectionLineColor(reserveAnchor);
        reserveAnchor.classList.remove("mw-anchor--line");
        reserveAnchor.classList.add("mw-anchor--reserve");
        reserveAnchor.setAttribute("data-mw-line-kind", reserveKind);
        if (reserveInteractive) reserveAnchor.setAttribute("data-mw-line-interactive", "1");
        else reserveAnchor.removeAttribute("data-mw-line-interactive");
        reserveAnchor.style.pointerEvents = reserveInteractive ? "auto" : "none";
        reserveAnchor.style.height = `${reserveHeight}px`;
        reserveAnchor.style.maxHeight = `${reserveHeight}px`;
        reserveAnchor.style.opacity = "1";
      } catch (_) {}
    }

    try { mwSyncSectionLineColor(reserveAnchor || el); } catch (_) {}

    try {
      spacer = document.createElement("div");
      spacer.setAttribute("aria-hidden", "true");
      spacer.setAttribute("data-mw-collapse-spacer", "1");
      spacer.style.cssText = [
        "display:block",
        `height:${spacerHeight.toFixed(3)}px`,
        `max-height:${spacerHeight.toFixed(3)}px`,
        "margin:0",
        "padding:0",
        "border:0",
        "overflow:hidden",
        "pointer-events:none",
        "contain:layout paint",
        "will-change:height,max-height"
      ].join(";");
      if (el.parentNode) el.parentNode.insertBefore(spacer, el.nextSibling);
    } catch (_) { spacer = null; }

    try {
      el.classList.add("mw-collapsing");
      el.style.transition = "none";
      el.style.boxSizing = "border-box";
      el.style.pointerEvents = "none";
      el.style.willChange = "auto";
      el.style.contain = "layout paint";
      mwApplyCollapsedBoxLine(el, reserveKind, reserveInteractive);
      el.style.marginTop = targetMarginTop + "px";
      el.style.marginBottom = targetMarginBottom + "px";
    } catch (_) {}

    const curve = String(easing || "").toLowerCase() === "linear" ? "linear" : "cubic-bezier(.22, 1, .36, 1)";
    const endScale = Math.max(0.002, Math.min(1, 1 / startHeight));
    const mask = overlayFx.mask;
    const content = overlayFx.content || null;
    let endLine = null;
    let maskAnim = null;
    let contentAnim = null;
    let endLineAnim = null;

    try {
      const lineRect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      const lineCs = window.getComputedStyle ? window.getComputedStyle(el) : null;
      const layer = mask.parentNode || document.querySelector(".mw-fly-layer");
      if (layer && lineRect && lineRect.width > 0) {
        endLine = document.createElement("div");
        endLine.setAttribute("aria-hidden", "true");
        endLine.setAttribute("data-mw-collapse-end-line", "1");
        endLine.style.cssText = [
          "position:absolute",
          `left:${lineRect.left.toFixed(3)}px`,
          `top:${lineRect.top.toFixed(3)}px`,
          `width:${lineRect.width.toFixed(3)}px`,
          "height:1px",
          "max-height:1px",
          "box-sizing:border-box",
          "margin:0",
          "padding:0",
          "border:0",
          `border-bottom:1px solid ${lineCs ? lineCs.borderBottomColor : "currentColor"}`,
          "border-radius:0",
          "background:transparent",
          "pointer-events:none",
          "opacity:0",
          "transform:translateZ(0)",
          "transform-origin:50% 50%",
          "will-change:opacity,transform",
          "z-index:1"
        ].join(";");
        try { endLine.style.setProperty("box-shadow", lineCs ? lineCs.boxShadow : "none", "important"); } catch (_) {}
        try { endLine.style.setProperty("animation", lineCs ? lineCs.animation : "none", "important"); } catch (_) {}
        layer.appendChild(endLine);
        try { overlayFx.endLine = endLine; } catch (_) {}
      }
    } catch (_) { endLine = null; }

    // Desktop fast collapse animates transform/opacity via WAAPI. Do not leave
    // the snapshot values as inline !important declarations, otherwise the
    // animation loses in the cascade and the overlay appears frozen while layout collapses.
    try {
      mask.style.setProperty("transform", "translateZ(0) scaleY(1)");
      mask.style.setProperty("opacity", "1");
      if (content && content.style) {
        content.style.setProperty("transform", "translate3d(0, 0, 0)");
        content.style.setProperty("opacity", "1");
      }
    } catch (_) {}

    try {
      mask.style.setProperty("transform-origin", "50% 0%", "important");
      mask.style.setProperty("will-change", "transform, opacity", "important");
      mask.style.setProperty("backdrop-filter", "none", "important");
      mask.style.setProperty("-webkit-backdrop-filter", "none", "important");
      mask.style.setProperty("overflow", "hidden", "important");
      if (mask.animate) {
        maskAnim = mask.animate([
          { transform: "translateZ(0) scaleY(1)", opacity: 1 },
          { transform: `translateZ(0) scaleY(${endScale})`, opacity: 1 }
        ], { duration: ms, easing: curve, fill: "forwards" });
      } else {
        mask.style.transition = `transform ${ms}ms ${curve}, opacity ${ms}ms ${curve}`;
        mask.style.transform = "translateZ(0) scaleY(1)";
        requestAnimationFrame(() => { try { mask.style.transform = `translateZ(0) scaleY(${endScale})`; } catch (_) {} });
      }
    } catch (_) {}

    try {
      if (content && content.style) {
        content.style.setProperty("will-change", "transform, opacity", "important");
        if (content.animate) {
          contentAnim = content.animate([
            { transform: "translate3d(0, 0, 0)", opacity: 1, offset: 0 },
            { transform: "translate3d(0, -8px, 0)", opacity: 0, offset: 0.58 },
            { transform: "translate3d(0, -8px, 0)", opacity: 0, offset: 1 }
          ], { duration: ms, easing: "ease", fill: "forwards" });
        } else {
          content.style.transition = `opacity ${Math.min(ms, 420)}ms ease, transform ${Math.min(ms, 420)}ms ease`;
          requestAnimationFrame(() => {
            try { content.style.opacity = "0"; } catch (_) {}
            try { content.style.transform = "translate3d(0, -8px, 0)"; } catch (_) {}
          });
        }
      }
    } catch (_) {}

    try {
      if (endLine && endLine.animate) {
        // The transform-scaled snapshot can visually compress below a physical
        // pixel at the very end. Fade in an unscaled 1px terminal line in the
        // exact final DOM position, so the collapse ends as a line instead of
        // blinking out before the persistent line takes over.
        endLineAnim = endLine.animate([
          { opacity: 0, transform: "translateZ(0) scaleY(0.001)", offset: 0 },
          { opacity: 0, transform: "translateZ(0) scaleY(0.001)", offset: 0.82 },
          { opacity: 1, transform: "translateZ(0) scaleY(1)", offset: 1 }
        ], { duration: ms, easing: curve, fill: "forwards" });
      } else if (endLine && endLine.style) {
        endLine.style.transition = `opacity ${Math.max(120, Math.round(ms * 0.18))}ms ${curve}`;
        window.setTimeout(() => { try { endLine.style.opacity = "1"; } catch (_) {} }, Math.max(0, Math.round(ms * 0.82)));
      }
    } catch (_) {}

    return new Promise((resolve) => {
      let done = false;
      let timer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        try { if (timer) clearTimeout(timer); } catch (_) {}
        try { if (spacer) spacer.remove(); } catch (_) {}
        try { mwApplyCollapsedBoxLine(el, reserveKind, reserveInteractive); } catch (_) {}
        try { el.classList.remove("mw-collapsing", "mw-collapse-live-smooth"); } catch (_) {}
        try { revealReserveLine(); } catch (_) {}
        try { releaseInnerFreeze(); } catch (_) {}
        resolve(true);
      };

      try {
        if (spacer) {
          requestAnimationFrame(() => {
            try {
              spacer.style.transition = `height ${ms}ms ${curve}, max-height ${ms}ms ${curve}`;
              spacer.style.height = "0px";
              spacer.style.maxHeight = "0px";
            } catch (_) {}
          });
        }
      } catch (_) {}

      const waits = [];
      try { if (maskAnim && maskAnim.finished) waits.push(maskAnim.finished.catch(() => {})); } catch (_) {}
      try { if (contentAnim && contentAnim.finished) waits.push(contentAnim.finished.catch(() => {})); } catch (_) {}
      try { if (endLineAnim && endLineAnim.finished) waits.push(endLineAnim.finished.catch(() => {})); } catch (_) {}
      if (waits.length) Promise.all(waits).then(finish).catch(finish);
      timer = window.setTimeout(finish, ms + 180);
    });
  }

function mwAnimateCollapse(el, duration, easing, opts) {
    if (!el) return Promise.resolve();
    // PC fast-collapse path intentionally disabled. It animated the *visible* edge
    // (a viewport-pinned ghost via scaleY) and the *body position* (a document-flow
    // spacer) as two independent animations, so on desktop the
    // "body top - visible widget bottom" gap drifted during the collapse and then
    // snapped when the spacer was removed at the end. The per-frame path below
    // collapses the real in-flow box (body always hugs its bottom edge) and, when a
    // ghost overlay is present, glues the ghost to that box every frame, so the gap
    // stays a hard constant. (mwAnimateCollapseFastPc is kept for reference.)
    const ms = Math.max(880, Number(duration) || 0);
    const options = opts && typeof opts === "object" ? opts : {};
    const reserveAnchor = options.reserveAnchor || null;
    const reserveHeight = Math.max(8, Number(options.reserveHeight) || mwCollapsedLineSlotPx(el));
    const reserveKind = String(options.reserveKind || "default");
    const reserveInteractive = !!options.reserveInteractive;
    const targetMarginTop = mwCollapsedLineMarginTopPx(el);
    const targetMarginBottom = mwCollapsedLineMarginBottomPx(el);
    const releaseInnerFreeze = mwFreezeWidgetInnerMotion(el);
    let reserveRevealTimer = 0;

    const px = (v, fallback) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : (Number(fallback) || 0);
    };
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp01 = (t) => Math.max(0, Math.min(1, Number(t) || 0));
    const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
    const easeInOut = (t) => {
      t = clamp01(t);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const curve = String(easing || "").toLowerCase() === "linear" ? easeInOut : easeOut;

    const revealReserveLine = () => {
      if (!reserveAnchor) return;
      try {
        reserveAnchor.classList.remove("mw-anchor--reserve");
        reserveAnchor.classList.add("mw-anchor--line");
        reserveAnchor.style.opacity = "1";
      } catch (_) {}
    };

    if (reserveAnchor) {
      try {
        mwSyncSectionLineColor(reserveAnchor);
        reserveAnchor.classList.remove("mw-anchor--line");
        reserveAnchor.classList.add("mw-anchor--reserve");
        reserveAnchor.setAttribute("data-mw-line-kind", reserveKind);
        if (reserveInteractive) reserveAnchor.setAttribute("data-mw-line-interactive", "1");
        else reserveAnchor.removeAttribute("data-mw-line-interactive");
        reserveAnchor.style.pointerEvents = reserveInteractive ? "auto" : "none";
        reserveAnchor.style.height = `${reserveHeight}px`;
        reserveAnchor.style.maxHeight = `${reserveHeight}px`;
        reserveAnchor.style.opacity = "1";
      } catch (_) {}
    }

    try { mwSyncSectionLineColor(reserveAnchor || el); } catch (_) {}

    let start = null;
    let childSnapshots = [];
    try {
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const measuredHeight = Math.max(1, rect.height || el.offsetHeight || el.scrollHeight || 0);
      start = {
        height: Math.round(measuredHeight),
        maxHeight: Math.max(Math.round(measuredHeight), px(cs.maxHeight, measuredHeight)),
        marginTop: px(cs.marginTop, 0),
        marginBottom: px(cs.marginBottom, 0),
        paddingTop: px(cs.paddingTop, 0),
        paddingRight: px(cs.paddingRight, 0),
        paddingBottom: px(cs.paddingBottom, 0),
        paddingLeft: px(cs.paddingLeft, 0),
        borderTopWidth: px(cs.borderTopWidth, 0),
        borderRightWidth: px(cs.borderRightWidth, 0),
        borderBottomWidth: Math.max(1, px(cs.borderBottomWidth, 1)),
        borderLeftWidth: px(cs.borderLeftWidth, 0),
        radius: px(cs.borderTopLeftRadius, px(cs.borderRadius, 0)),
        topViewport: rect.top,
      };

      // When a collapse overlay (ghost) is present, the real box is hidden and the
      // ghost is what the user sees shrink. Pin margin-bottom to its final collapsed
      // value for the whole animation so the gap between the body and the visible
      // bottom edge is a hard constant (and equal to the resting value, so there is
      // no end snap). The ghost top is glued to the live box top in paint() so the
      // ghost's bottom edge keeps tracking the real in-flow box bottom.
      if (el.__mwCollapseOverlayFx) {
        start.marginBottom = targetMarginBottom;
      }

      childSnapshots = Array.from(el.children || []).map((node) => ({
        node,
        opacity: node.style.opacity,
        transform: node.style.transform,
        transition: node.style.transition,
        willChange: node.style.willChange,
        filter: node.style.filter,
      }));

      childSnapshots.forEach((entry) => {
        if (!entry || !entry.node || !entry.node.style) return;
        try { entry.node.style.setProperty("transition", "none", "important"); } catch (_) {}
        try { entry.node.style.setProperty("will-change", "opacity, transform", "important"); } catch (_) {}
      });

      el.classList.add("mw-collapsing", "mw-collapse-live-smooth");
      el.style.transition = "none";
      el.style.boxSizing = "border-box";
      el.style.height = start.height + "px";
      el.style.maxHeight = start.maxHeight + "px";
      el.style.minHeight = start.height + "px";
      el.style.marginTop = start.marginTop + "px";
      el.style.marginBottom = start.marginBottom + "px";
      el.style.paddingTop = start.paddingTop + "px";
      el.style.paddingRight = start.paddingRight + "px";
      el.style.paddingBottom = start.paddingBottom + "px";
      el.style.paddingLeft = start.paddingLeft + "px";
      el.style.borderTopWidth = start.borderTopWidth + "px";
      el.style.borderRightWidth = start.borderRightWidth + "px";
      el.style.borderBottomWidth = start.borderBottomWidth + "px";
      el.style.borderLeftWidth = start.borderLeftWidth + "px";
      el.style.borderRadius = start.radius + "px";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      el.style.opacity = "1";
      el.style.transform = "translateZ(0)";
      el.style.transformOrigin = "50% 0%";
      el.style.willChange = "height, max-height, min-height, margin, padding, border-width, border-radius";
      try { el.style.contain = "layout paint"; } catch (_) {}
      void el.offsetHeight;
    } catch (_) {
      try { releaseInnerFreeze(); } catch (_) {}
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let done = false;
      let raf = 0;
      let startTs = 0;
      let safetyTimer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        try { cancelAnimationFrame(raf); } catch (_) {}
        try { if (safetyTimer) window.clearTimeout(safetyTimer); } catch (_) {}
        try { window.clearTimeout(reserveRevealTimer); } catch (_) {}
        try {
          el.style.height = "1px";
          el.style.maxHeight = "1px";
          el.style.minHeight = "1px";
          el.style.marginTop = targetMarginTop + "px";
          el.style.marginBottom = targetMarginBottom + "px";
          el.style.paddingTop = "0px";
          el.style.paddingRight = "0px";
          el.style.paddingBottom = "0px";
          el.style.paddingLeft = "0px";
          el.style.borderTopWidth = "0px";
          el.style.borderRightWidth = "0px";
          el.style.borderBottomWidth = "1px";
          el.style.borderLeftWidth = "0px";
          el.style.borderRadius = "0px";
          el.style.opacity = "1";
          el.style.transform = "none";
        } catch (_) {}
        try { mwApplyCollapsedBoxLine(el, reserveKind, reserveInteractive); } catch (_) {}
        try { el.classList.remove("mw-collapsing", "mw-collapse-live-smooth"); } catch (_) {}
        try { revealReserveLine(); } catch (_) {}
        childSnapshots.forEach((entry) => {
          if (!entry || !entry.node || !entry.node.style) return;
          try { entry.node.style.opacity = entry.opacity; } catch (_) {}
          try { entry.node.style.transform = entry.transform; } catch (_) {}
          try { entry.node.style.transition = entry.transition; } catch (_) {}
          try { entry.node.style.willChange = entry.willChange; } catch (_) {}
          try { entry.node.style.filter = entry.filter; } catch (_) {}
        });
        try { releaseInnerFreeze(); } catch (_) {}
        resolve();
      };

      const paint = (p) => {
        const t = curve(p);
        const h = Math.max(1, lerp(start.height, 1, t));
        const innerT = clamp01(p / 0.58);
        const innerOpacity = Math.max(0, 1 - innerT);
        const innerY = -8 * innerT;
        try {
          el.style.height = h.toFixed(3) + "px";
          el.style.maxHeight = Math.max(1, lerp(start.maxHeight, 1, t)).toFixed(3) + "px";
          el.style.minHeight = h.toFixed(3) + "px";
          el.style.marginTop = Math.max(0, lerp(start.marginTop, targetMarginTop, t)).toFixed(3) + "px";
          el.style.marginBottom = Math.max(0, lerp(start.marginBottom, targetMarginBottom, t)).toFixed(3) + "px";
          el.style.paddingTop = Math.max(0, lerp(start.paddingTop, 0, t)).toFixed(3) + "px";
          el.style.paddingRight = Math.max(0, lerp(start.paddingRight, 0, t)).toFixed(3) + "px";
          el.style.paddingBottom = Math.max(0, lerp(start.paddingBottom, 0, t)).toFixed(3) + "px";
          el.style.paddingLeft = Math.max(0, lerp(start.paddingLeft, 0, t)).toFixed(3) + "px";
          el.style.borderTopWidth = Math.max(0, lerp(start.borderTopWidth, 0, t)).toFixed(3) + "px";
          el.style.borderRightWidth = Math.max(0, lerp(start.borderRightWidth, 0, t)).toFixed(3) + "px";
          el.style.borderBottomWidth = Math.max(1, lerp(start.borderBottomWidth, 1, t)).toFixed(3) + "px";
          el.style.borderLeftWidth = Math.max(0, lerp(start.borderLeftWidth, 0, t)).toFixed(3) + "px";
          el.style.borderRadius = Math.max(0, lerp(start.radius, 0, t)).toFixed(3) + "px";
        } catch (_) {}

        const overlayFx = el.__mwCollapseOverlayFx || null;
        if (overlayFx && overlayFx.mask && overlayFx.mask.style) {
          try {
            overlayFx.mask.style.setProperty("height", h.toFixed(3) + "px", "important");
            overlayFx.mask.style.setProperty("border-top-width", Math.max(0, lerp(start.borderTopWidth, 0, t)).toFixed(3) + "px", "important");
            overlayFx.mask.style.setProperty("border-right-width", Math.max(0, lerp(start.borderRightWidth, 0, t)).toFixed(3) + "px", "important");
            overlayFx.mask.style.setProperty("border-bottom-width", Math.max(1, lerp(start.borderBottomWidth, 1, t)).toFixed(3) + "px", "important");
            overlayFx.mask.style.setProperty("border-left-width", Math.max(0, lerp(start.borderLeftWidth, 0, t)).toFixed(3) + "px", "important");
            overlayFx.mask.style.setProperty("border-radius", Math.max(0, lerp(start.radius, 0, t)).toFixed(3) + "px", "important");
            // Glue the ghost's top to the *actual* live in-flow box top.  Do not
            // infer it from the animated margin: on ordinary pages the widget's
            // top margin can collapse with the preceding H1 margin, so the real
            // box may move by fewer pixels than `marginTop` changes.  Reading the
            // live rect keeps the overlay line and the persistent 1px line on the
            // same y-position when the overlay is removed at the end.
            let liveTop = start.topViewport + (Math.max(0, lerp(start.marginTop, targetMarginTop, t)) - start.marginTop);
            try {
              const liveRect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
              if (liveRect && Number.isFinite(Number(liveRect.top))) liveTop = Number(liveRect.top);
            } catch (_) {}
            overlayFx.mask.style.setProperty(
              "top",
              liveTop.toFixed(3) + "px",
              "important"
            );
          } catch (_) {}
        }
        if (overlayFx && overlayFx.content && overlayFx.content.style) {
          try {
            overlayFx.content.style.setProperty("opacity", String(innerOpacity), "important");
            overlayFx.content.style.setProperty("transform", `translate3d(0, ${innerY.toFixed(2)}px, 0)`, "important");
          } catch (_) {}
        }

        childSnapshots.forEach((entry) => {
          if (!entry || !entry.node || !entry.node.style) return;
          if (entry.node.classList && entry.node.classList.contains("mw-collapse-line-shell")) return;
          try { entry.node.style.opacity = String(innerOpacity); } catch (_) {}
          try { entry.node.style.transform = `translate3d(0, ${innerY.toFixed(2)}px, 0)`; } catch (_) {}
        });
      };

      const tick = (ts) => {
        if (!startTs) startTs = ts || performance.now();
        const p = clamp01(((ts || performance.now()) - startTs) / ms);
        paint(p);
        if (p >= 1) finish();
        else raf = requestAnimationFrame(tick);
      };

      try { safetyTimer = window.setTimeout(finish, ms + 700); } catch (_) {}
      try {
        requestAnimationFrame((ts) => {
          paint(0);
          raf = requestAnimationFrame(tick);
        });
      } catch (_) {
        finish();
      }
    });
  }
  function mwPrimePickedIconVisual(iconEl, m, duration) {
    if (!iconEl || !iconEl.style) return;
    const ms = Math.max(0, Number(duration) || 0);
    const tier = mwMasteryEffectTierForLevel(m);
    const isMaster = Number(m) === 3 && tier === "master";
    const isKnow = Number(m) === 2 && tier === "know";
    try { mwSyncEffectTierAttr(iconEl, m); } catch (_) {}
    try {
      iconEl.style.transition = `color ${ms}ms ease, transform ${ms}ms ease, opacity ${ms}ms ease`;
      iconEl.style.willChange = "color, transform, opacity";
      const svgEls = Array.from(iconEl.querySelectorAll("svg"));
      const svgNodes = iconEl.querySelectorAll("svg, svg *");
      svgNodes.forEach((node) => {
        try {
          node.style.transition = `color ${ms}ms ease, stroke ${ms}ms ease, filter ${ms}ms ease, opacity ${ms}ms ease`;
          node.style.color = "currentColor";
          node.style.stroke = "currentColor";
        } catch (_) {}
      });
      requestAnimationFrame(() => {
        try {
          if (isMaster) {
            iconEl.style.color = "var(--mw-master-gold-ink)";
          } else if (isKnow) {
            iconEl.style.color = "var(--mw-know-silver-ink)";
          } else {
            iconEl.style.color = "var(--mw-title-plain-ink)";
          }
          svgEls.forEach((svg) => {
            try {
              if (isMaster) {
                svg.style.filter = "drop-shadow(0 0 10px var(--mw-master-gold-glow-soft)) drop-shadow(0 0 24px var(--mw-master-gold-glow-strong))";
                svg.style.animation = "mw-master-icon-ink-glow 1.7s ease-in-out infinite alternate";
              } else if (isKnow) {
                svg.style.filter = "drop-shadow(0 0 6px var(--mw-know-silver-glow-soft)) drop-shadow(0 0 14px var(--mw-know-silver-glow-strong))";
                svg.style.animation = "mw-know-icon-ink-glow 2.2s ease-in-out infinite alternate";
              } else {
                svg.style.filter = "";
                svg.style.animation = "";
              }
              svg.style.overflow = "visible";
            } catch (_) {}
          });
        } catch (_) {}
      });
    } catch (_) {}
  }

  function mwFreezeVisualSnapshot(el, overrides) {
    if (!el || !el.style || typeof window.getComputedStyle !== "function") return () => {};
    const cs = window.getComputedStyle(el);
    const snapshot = [
      ["background", cs.background],
      ["background-color", cs.backgroundColor],
      ["background-image", cs.backgroundImage],
      ["border-top-color", cs.borderTopColor],
      ["border-right-color", cs.borderRightColor],
      ["border-bottom-color", cs.borderBottomColor],
      ["border-left-color", cs.borderLeftColor],
      ["border-top-style", cs.borderTopStyle],
      ["border-right-style", cs.borderRightStyle],
      ["border-bottom-style", cs.borderBottomStyle],
      ["border-left-style", cs.borderLeftStyle],
      ["border-top-width", cs.borderTopWidth],
      ["border-right-width", cs.borderRightWidth],
      ["border-bottom-width", cs.borderBottomWidth],
      ["border-left-width", cs.borderLeftWidth],
      ["border-radius", cs.borderRadius],
      ["box-shadow", cs.boxShadow],
      ["color", cs.color],
      ["outline", cs.outline],
      ["outline-color", cs.outlineColor],
      ["outline-style", cs.outlineStyle],
      ["outline-width", cs.outlineWidth],
      ["outline-offset", cs.outlineOffset],
      ["opacity", cs.opacity],
    ];

    if (overrides && typeof overrides === "object") {
      Object.keys(overrides).forEach((prop) => {
        snapshot.push([prop, overrides[prop]]);
      });
    }

    snapshot.forEach(([prop, value]) => {
      try { el.style.setProperty(prop, value, "important"); } catch (_) {}
    });

    return () => {
      snapshot.forEach(([prop]) => {
        try { el.style.removeProperty(prop); } catch (_) {}
      });
    };
  }

  function mwTemporarilyHideForFlight(el) {
    if (!el || !el.style) return () => {};
    const prevVisibility = el.style.visibility;
    const prevPointerEvents = el.style.pointerEvents;
    try {
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
    } catch (_) {}
    return () => {
      try { el.style.visibility = prevVisibility; } catch (_) {}
      try { el.style.pointerEvents = prevPointerEvents; } catch (_) {}
    };
  }

  function mwFreezeFlightPillVisual(btn, level) {
    const m = Number(level);
    const tier = mwMasteryEffectTierForLevel(m);
    const isMaster = m === 3 && tier === "master";
    const isKnow = m === 2 && tier === "know";
    const overrides = Number.isFinite(m) ? {
      "background": (
        isMaster ? "rgba(255, 223, 128, .16)" :
        isKnow ? "rgba(210, 224, 255, .14)" :
        m === 1 ? "rgba(255, 196, 111, .14)" :
        "var(--mw-collapsed-line-default)"
      ),
      "background-color": (
        isMaster ? "rgba(255, 223, 128, .16)" :
        isKnow ? "rgba(210, 224, 255, .14)" :
        m === 1 ? "rgba(255, 196, 111, .14)" :
        "var(--mw-collapsed-line-default)"
      ),
      "border-top-color": (
        isMaster ? "rgba(255, 223, 128, .55)" :
        isKnow ? "rgba(210, 224, 255, .52)" :
        m === 1 ? "rgba(255, 196, 111, .52)" :
        "color-mix(in srgb, var(--mw-collapsed-line-default) 90%, transparent)"
      ),
      "border-right-color": (
        isMaster ? "rgba(255, 223, 128, .55)" :
        isKnow ? "rgba(210, 224, 255, .52)" :
        m === 1 ? "rgba(255, 196, 111, .52)" :
        "color-mix(in srgb, var(--mw-collapsed-line-default) 90%, transparent)"
      ),
      "border-bottom-color": (
        isMaster ? "rgba(255, 223, 128, .55)" :
        isKnow ? "rgba(210, 224, 255, .52)" :
        m === 1 ? "rgba(255, 196, 111, .52)" :
        "color-mix(in srgb, var(--mw-collapsed-line-default) 90%, transparent)"
      ),
      "border-left-color": (
        isMaster ? "rgba(255, 223, 128, .55)" :
        isKnow ? "rgba(210, 224, 255, .52)" :
        m === 1 ? "rgba(255, 196, 111, .52)" :
        "color-mix(in srgb, var(--mw-collapsed-line-default) 90%, transparent)"
      ),
      "box-shadow": (
        isMaster ? "0 0 0 1px rgba(255,223,128,.12), 0 10px 28px rgba(255,223,128,.08)" :
        isKnow ? "0 0 0 1px rgba(210,224,255,.10), 0 10px 28px rgba(210,224,255,.06)" :
        m === 1 ? "0 0 0 1px rgba(255,196,111,.10), 0 10px 28px rgba(255,196,111,.06)" :
        "0 0 0 1px color-mix(in srgb, var(--mw-collapsed-line-default) 72%, transparent), 0 10px 28px var(--mw-neutral-cue-shadow-soft)"
      ),
    } : null;
    return mwFreezeVisualSnapshot(btn, overrides);
  }

  function mwFreezeFlightWidgetVisual(box, level) {
    if (!box) return () => {};
    const m = Number(level);
    const tier = mwMasteryEffectTierForLevel(m);
    const isMaster = m === 3 && tier === "master";
    const isKnow = m === 2 && tier === "know";
    const borderTone = isMaster
      ? "var(--mw-master-gold-border)"
      : (isKnow ? "var(--mw-know-silver-border)" : "var(--mw-collapsed-line-default)");
    const edgeShadow = isMaster
      ? "0 0 6px var(--mw-master-gold-glow-soft), 0 0 16px var(--mw-master-gold-glow-strong)"
      : (isKnow
        ? "0 0 6px var(--mw-know-silver-glow-soft), 0 0 14px var(--mw-know-silver-glow-strong)"
        : "none");
    return mwFreezeVisualSnapshot(box, {
      "border-top-color": borderTone,
      "border-right-color": borderTone,
      "border-bottom-color": borderTone,
      "border-left-color": borderTone,
      "border-color": borderTone,
      "box-shadow": edgeShadow,
      "opacity": "1",
      "filter": "none",
    });
  }

  function mwForceBadgeTheme(badge, m) {
    if (!badge) return;
    const level = Number(m);
    const tier = mwSyncEffectTierAttr(badge, level);
    try {
      const h1 = badge.closest ? badge.closest("h1.lp-h1-row") : null;
      if (h1) mwSyncEffectTierAttr(h1, level);
    } catch (_) {}
    const tone =
      (level === 3 && tier === "master") ? "var(--mw-master-gold-ink)" :
      (level === 2 && tier === "know") ? "var(--mw-know-silver-ink)" :
      "var(--mw-title-plain-ink)";
    try {
      if (tone) badge.style.setProperty("color", tone, "important");
      else badge.style.removeProperty("color");
    } catch (_) {}
    try {
      const svgNodes = badge.querySelectorAll("svg, svg *");
      svgNodes.forEach((node) => {
        try {
          if (tone) {
            node.style.setProperty("color", tone, "important");
            node.style.setProperty("stroke", tone, "important");
            if (String(node.tagName || "").toLowerCase() !== "svg") {
              node.style.setProperty("fill", "none", "important");
            }
          } else {
            node.style.removeProperty("color");
            node.style.removeProperty("stroke");
            node.style.removeProperty("fill");
          }
        } catch (_) {}
      });
      if (!tier) {
        badge.querySelectorAll("svg").forEach((svg) => {
          try { svg.style.removeProperty("filter"); } catch (_) {}
          try { svg.style.removeProperty("animation"); } catch (_) {}
        });
      }
    } catch (_) {}
  }

  function mwSetTitleFlightLock(el, locked) {
    if (!el) return;
    try {
      if (locked) el.setAttribute("data-mw-flight-lock", "1");
      else el.removeAttribute("data-mw-flight-lock");
    } catch (_) {}
  }

  function mwPulseOnce(el) {
    if (!el) return;
    el.classList.remove("mw-pulse-once");
    void el.offsetWidth;
    el.classList.add("mw-pulse-once");
    window.setTimeout(() => {
      try { el.classList.remove("mw-pulse-once"); } catch (_) {}
    }, 420);
  }

  function mwRevealBadgeSeamless(badge) {
    if (!badge) return;
    mwSetTitleFlightLock(badge, false);
    try { badge.style.transition = "none"; } catch (_) {}
    badge.classList.add("is-visible");
    badge.classList.remove("mw-flight-hidden");
    try { mwForceBadgeTheme(badge, badge.getAttribute("data-m")); } catch (_) {}
    try { void badge.offsetWidth; } catch (_) {}
    requestAnimationFrame(() => {
      try { badge.style.transition = ""; } catch (_) {}
      try { mwForceBadgeTheme(badge, badge.getAttribute("data-m")); } catch (_) {}
    });
  }

  function mwSetTitleBadgeLevel(sc, m) {
    if (!sc || !sc.badge) return null;
    const level = Number(m);
    if (![0, 1, 2, 3].includes(level)) return null;
    const badge = sc.badge;
    try { sc.h1.setAttribute("data-mw-level", String(level)); } catch (_) {}
    try { mwSyncTitleEffectTier(sc, level); } catch (_) {}
    try {
      badge.setAttribute("data-m", String(level));
      badge.innerHTML = mwSvgForLevel(level, 18);
      badge.disabled = false;
      badge.removeAttribute("aria-hidden");
      badge.setAttribute("role", "button");
      badge.setAttribute("tabindex", "0");
      badge.setAttribute("aria-label", "Open mastery menu");
      badge.setAttribute("title", "Open mastery menu");
      badge.setAttribute("aria-expanded", "false");
    } catch (_) {}
    try { mwForceBadgeTheme(badge, level); } catch (_) {}
    return badge;
  }

  function mwApplyTitleBadgeCrossfade(oldLevel, newLevel, opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const oldM = Number(oldLevel);
    const newM = Number(newLevel);
    const done = () => {
      if (typeof options.onDone === "function") {
        try { options.onDone(); } catch (_) {}
      }
    };
    const sc = mwEnsureTitleScaffold();
    if (!sc || ![0, 1, 2, 3].includes(newM)) {
      done();
      return;
    }
    const badge = sc.badge;
    mwSetTitleFlightLock(badge, false);
    badge.classList.remove("mw-flight-hidden");

    const finishImmediately = () => {
      mwSetTitleBadgeLevel(sc, newM);
      badge.classList.add("is-visible");
      badge.classList.remove("is-armed", "mw-badge-crossfade", "mw-flight-hidden");
      try { mwSetHiddenTitleMode(sc, !!mwReadWidgetHidden()); } catch (_) {}
      try { mwBindTitleMenuTriggers(state); } catch (_) {}
      done();
    };

    if (oldM === newM || ![0, 1, 2, 3].includes(oldM) || mwMotionReduced()) {
      finishImmediately();
      return;
    }

    mwSetTitleBadgeLevel(sc, oldM);
    badge.classList.add("is-visible", "mw-badge-crossfade");
    badge.classList.remove("is-armed");
    try { void badge.offsetWidth; } catch (_) {}

    requestAnimationFrame(() => {
      badge.classList.add("is-armed");
      badge.classList.remove("is-visible");

      window.setTimeout(() => {
        mwSetTitleBadgeLevel(sc, newM);
        try { void badge.offsetWidth; } catch (_) {}
        requestAnimationFrame(() => {
          badge.classList.add("is-visible");
          window.setTimeout(() => {
            badge.classList.remove("is-armed", "mw-badge-crossfade", "mw-flight-hidden");
            try { mwSetHiddenTitleMode(sc, !!mwReadWidgetHidden()); } catch (_) {}
            try { mwBindTitleMenuTriggers(state); } catch (_) {}
            done();
          }, 190);
        });
      }, 160);
    });
  }

  function mwNormalizeHiddenManageTitle(sc) {
    const live = mwEnsureTitleScaffold() || sc || null;
    if (!live) return null;

    try { mwSetHiddenTitleMode(live, true); } catch (_) {}
    try { mwBindTitleMenuTriggers(state); } catch (_) {}
    try { if (live.titleText) mwResetTitleFlight(live.titleText); } catch (_) {}

    const btn = live.manageBtn || (live.left && live.left.querySelector ? live.left.querySelector(":scope > .mw-h1-manage") : null);
    try { mwClearManageTitleReserve(live); } catch (_) {}
    if (btn) {
      try { btn.classList.add("is-visible"); } catch (_) {}
      try { btn.classList.remove("is-armed", "mw-flight-hidden"); } catch (_) {}
      try { btn.removeAttribute("disabled"); } catch (_) {}
      try { btn.setAttribute("aria-disabled", "false"); } catch (_) {}
      try { mwSetTitleFlightLock(btn, false); } catch (_) {}
    }

    return live;
  }

function mwIsPhoneLikeViewport() {
    try {
      return !!(
        window.matchMedia &&
        (window.matchMedia('(max-width: 768px)').matches ||
         window.matchMedia('(hover: none) and (pointer: coarse)').matches)
      );
    } catch (_) {
      return (window.innerWidth || 0) <= 768;
    }
  }

  function mwClearManageTitleReserve(sc) {
    if (!sc || !sc.h1 || !sc.titleText) return;
    try { sc.h1.removeAttribute('data-mw-manage-reserve'); } catch (_) {}
    try { sc.h1.style.removeProperty('--mw-manage-reserve'); } catch (_) {}
    try { sc.titleText.style.removeProperty('padding-left'); } catch (_) {}
  }

  function mwComputeManageReservePx(sc, manageRect) {
    if (!sc || !sc.manageBtn) return 0;
    const rect = manageRect && mwRectLooksUsable(manageRect)
      ? manageRect
      : mwResolveManageTargetRect(sc.manageBtn, sc);
    const width = rect && rect.width ? Number(rect.width) || 0 : 0;
    let gap = 0;
    try {
      const cs = getComputedStyle(sc.manageBtn);
      gap = parseFloat(cs.marginRight || '0') || 0;
    } catch (_) {}
    return Math.max(0, Math.ceil(width + gap));
  }

  function mwNeedsManageTitleReserve(sc, manageRect) {
    if (!sc || !sc.left || !sc.titleText || !sc.manageBtn) return false;
    if (!mwIsPhoneLikeViewport()) return false;
    const titleRect = mwCloneRectLike(sc.titleText.getBoundingClientRect());
    const leftRect = mwCloneRectLike(sc.left.getBoundingClientRect());
    const rect = manageRect && mwRectLooksUsable(manageRect)
      ? manageRect
      : mwResolveManageTargetRect(sc.manageBtn, sc);
    if (!mwRectLooksUsable(titleRect) || !mwRectLooksUsable(leftRect) || !mwRectLooksUsable(rect)) return false;
    let gap = 0;
    try {
      const cs = getComputedStyle(sc.manageBtn);
      gap = parseFloat(cs.marginRight || '0') || 0;
    } catch (_) {}
    const expectedLeft = Math.max(Number(leftRect.left) || 0, Number(rect.left) || 0) + (Number(rect.width) || 0) + gap - 1;
    return (Number(titleRect.left) || 0) < expectedLeft;
  }

  function mwApplyManageTitleReserveIfNeeded(sc, manageRect) {
    if (!sc || !sc.h1 || !sc.titleText) return false;
    if (!mwNeedsManageTitleReserve(sc, manageRect)) {
      mwClearManageTitleReserve(sc);
      return false;
    }
    const reserve = mwComputeManageReservePx(sc, manageRect);
    if (!(reserve > 0)) {
      mwClearManageTitleReserve(sc);
      return false;
    }
    try { sc.h1.setAttribute('data-mw-manage-reserve', '1'); } catch (_) {}
    try { sc.h1.style.setProperty('--mw-manage-reserve', `${reserve}px`); } catch (_) {}
    return true;
  }

  function mwEnsureTitleScaffold() {
    const inner = document.querySelector("article.md-content__inner");
    const h1 = inner ? inner.querySelector("h1") : null;
    if (!inner || !h1) return null;

    mwPurgeHeadingPathArtifacts(inner, h1);
    h1.classList.add("lp-h1-row");

    Array.from(h1.querySelectorAll(":scope > .mw-h1-manage")).forEach((node) => {
      try { node.remove(); } catch (_) {}
    });

    let left = h1.querySelector(":scope > .lp-h1-left");
    if (!left) {
      left = document.createElement("span");
      left.className = "lp-h1-left";

      const actionNodes = [];
      const contentNodes = [];
      Array.from(h1.childNodes).forEach((node) => {
        const isAction = !!(node && node.nodeType === 1 && node.classList && node.classList.contains("lp-h1-map"));
        if (isAction) actionNodes.push(node);
        else contentNodes.push(node);
      });
      contentNodes.forEach((node) => left.appendChild(node));
      if (actionNodes.length) h1.insertBefore(left, actionNodes[0]);
      else h1.appendChild(left);
    }

    let titleText = left.querySelector(":scope > .mw-h1-title-text");
    if (!titleText) {
      titleText = document.createElement("span");
      titleText.className = "mw-h1-title-text";
      const keep = [];
      Array.from(left.childNodes).forEach((node) => {
        const isBadge = !!(node && node.nodeType === 1 && node.classList && node.classList.contains("mw-title-badge"));
        if (isBadge) keep.push(node);
        else titleText.appendChild(node);
      });
      left.appendChild(titleText);
      keep.forEach((node) => left.insertBefore(node, titleText));
    }

    mwScheduleHeadingArtifactCleanup();

    let badge = left.querySelector(":scope > .mw-title-badge");
    if (!badge || String(badge.tagName || "").toLowerCase() !== "button") {
      const nextBadge = document.createElement("button");
      nextBadge.type = "button";
      nextBadge.className = "mw-title-badge";
      if (badge) {
        try {
          Array.from(badge.attributes || []).forEach((attr) => {
            if (!attr || attr.name === "class" || attr.name === "type") return;
            nextBadge.setAttribute(attr.name, attr.value);
          });
          nextBadge.innerHTML = badge.innerHTML || "";
          left.insertBefore(nextBadge, badge);
          badge.remove();
        } catch (_) {
          left.insertBefore(nextBadge, titleText);
          try { badge.remove(); } catch (_) {}
        }
      } else {
        left.insertBefore(nextBadge, titleText);
      }
      badge = nextBadge;
    }
    try {
      badge.type = "button";
      badge.setAttribute("data-mw-title-badge", "1");
      badge.setAttribute("draggable", "false");
      badge.setAttribute("aria-haspopup", "menu");
    } catch (_) {}

    const manageBtn = mwEnsureH1ManageButton({ h1, left, titleText, badge });

    const mapBtn = mwEnsureMapButton(h1);
    if (mapBtn && mapBtn.parentNode !== h1) {
      h1.appendChild(mapBtn);
    }

    return { inner, h1, left, titleText, badge, manageBtn, mapBtn: h1.querySelector(":scope > .lp-h1-map:not(.mw-h1-manage)") };
  }

  function mwMeasureTitleTargets(sc, m) {
    if (!sc || !sc.badge || !sc.titleText) return null;
    const root = document.documentElement;
    const badge = sc.badge;
    const titleText = sc.titleText;

    const titleBefore = mwCloneRectLike(titleText.getBoundingClientRect());
    const titleLinesBefore = mwLineCountFromRects(Array.from(titleText.getClientRects()).map(mwCloneRectLike));
    const wordsBefore = mwCollectWordRects(titleText);

    badge.setAttribute("data-m", String(m));
    badge.innerHTML = mwSvgForLevel(m, 18);
    mwForceBadgeTheme(badge, m);

    root.classList.add("mw-title-measuring");
    badge.classList.add("is-visible", "mw-flight-hidden");
    try { void badge.offsetWidth; } catch (_) {}

    const rects = {
      badge: mwCloneRectLike(badge.getBoundingClientRect()),
      titleBefore,
      titleAfter: mwCloneRectLike(titleText.getBoundingClientRect()),
      titleLinesBefore,
      titleLinesAfter: mwLineCountFromRects(Array.from(titleText.getClientRects()).map(mwCloneRectLike)),
      wordsBefore,
      wordsAfter: mwCollectWordRects(titleText),
    };

    rects.wrapsToMultipleLines = rects.titleLinesBefore <= 1 && rects.titleLinesAfter > 1;

    root.classList.remove("mw-title-measuring");
    return rects;
  }

function mwApplyTitleState(m, hasExplicitRating, opts) {
  const sc = mwEnsureTitleScaffold();
  if (!sc) return;

  const badge = sc.badge;
  const widgetHidden = !!((opts && opts.forceHideBadge) || mwReadWidgetHidden());

  if (!hasExplicitRating) {
    try { sc.h1.removeAttribute("data-mw-level"); } catch (_) {}
    try { sc.h1.removeAttribute("data-mw-effect-tier"); sc.h1.removeAttribute("data-mw-effect-item"); } catch (_) {}
    mwSetTitleFlightLock(badge, false);
    badge.classList.remove("is-visible", "is-armed", "mw-flight-hidden");
    badge.innerHTML = "";
    badge.removeAttribute("data-m");
    try { badge.removeAttribute("data-mw-effect-tier"); badge.removeAttribute("data-mw-effect-item"); } catch (_) {}
    try {
      badge.disabled = true;
      badge.setAttribute("aria-hidden", "true");
      badge.setAttribute("tabindex", "-1");
      badge.removeAttribute("role");
      badge.removeAttribute("aria-label");
      badge.removeAttribute("title");
      badge.removeAttribute("aria-expanded");
    } catch (_) {}
    try { badge.style.removeProperty("color"); } catch (_) {}
    mwResetTitleFlight(sc.titleText);
    return;
  }

  try { sc.h1.setAttribute("data-mw-level", String(m)); } catch (_) {}
  try { mwSyncTitleEffectTier(sc, m); } catch (_) {}
  badge.setAttribute("data-m", String(m));
  badge.innerHTML = mwSvgForLevel(m, 18);
  try {
    badge.disabled = false;
    badge.removeAttribute("aria-hidden");
    badge.setAttribute("role", "button");
    badge.setAttribute("tabindex", "0");
    badge.setAttribute("aria-label", "Open mastery menu");
    badge.setAttribute("title", "Open mastery menu");
    badge.setAttribute("aria-expanded", "false");
  } catch (_) {}
  mwForceBadgeTheme(badge, m);

  if (widgetHidden) {
    if (hasExplicitRating) {
      mwSetTitleFlightLock(badge, false);
      badge.classList.add("is-visible");
      badge.classList.remove("is-armed", "mw-flight-hidden");
      try { mwForceBadgeTheme(badge, m); } catch (_) {}
    } else {
      mwSetTitleFlightLock(badge, false);
      badge.classList.remove("is-visible", "is-armed", "mw-flight-hidden");
      try { badge.style.removeProperty("color"); } catch (_) {}
    }
    try { mwSetHiddenTitleMode(sc, true); } catch (_) {}
    mwResetTitleFlight(sc.titleText);
    if (opts && typeof opts.onDone === "function") {
      try { opts.onDone(); } catch (_) {}
    }
    return;
  }

  const animate = !!(opts && opts.animate && !mwMotionReduced());
  if (!animate) {
    mwSetTitleFlightLock(badge, false);
    badge.classList.add("is-visible");
    badge.classList.remove("mw-flight-hidden");
    mwResetTitleFlight(sc.titleText);
    if (opts && typeof opts.onDone === "function") {
      try { opts.onDone(); } catch (_) {}
    }
    return;
  }

  let ghostBadge = null;
  let restoreCleanSource = () => {};

  Promise.resolve()
    .then(() => mwNextFrame())
    .then(async () => {
      const iconSourceEl = opts && opts.iconSource ? opts.iconSource : null;
      const sourceScope = opts && opts.sourceScope ? opts.sourceScope : null;
      const sourceBox = opts && opts.sourceBox ? opts.sourceBox : null;
      const preFadeMs = Math.max(0, Number(opts && opts.preFadeMs) || 400);
      const flyMs = Math.max(200, Number(opts && opts.flyMs) || 600);

      const targets =
        mwMeasureTitleTargets(sc, m) ||
        { badge: badge.getBoundingClientRect() };

      const badgeRect = targets.badge;
      const phoneFlow = mwIsPhoneLikeViewport();

      mwSetTitleFlightLock(badge, true);
      badge.classList.add("is-visible", "mw-flight-hidden");
      let titleFlowTask = null;

      const badgeStartPt =
        (opts && opts.iconStartPt) ? opts.iconStartPt :
        (iconSourceEl ? mwRectCenter(iconSourceEl.getBoundingClientRect()) : null);

      const collapseSource =
        (opts && opts.collapseSource && opts.collapseSource.classList) ? opts.collapseSource :
        ((sourceBox && sourceBox.classList && sourceBox.id === "mw-mastery") ? sourceBox :
        ((sourceScope && sourceScope.classList && sourceScope.id === "mw-mastery") ? sourceScope : null));
      const cleanCollapse = !!(opts && opts.cleanCollapse);

      if (iconSourceEl) {
        mwPrimePickedIconVisual(iconSourceEl, m, preFadeMs);
      }
      titleFlowTask = mwAnimateTitleFlow(
        sc.titleText,
        targets,
        preFadeMs,
        { forceSimple: true, easing: phoneFlow ? "linear" : undefined }
      );

      if (!cleanCollapse) {
        if (sourceScope && sourceScope.classList) {
          sourceScope.classList.add("mw-preflight");
        }
        if (sourceBox && sourceBox.classList && sourceBox !== sourceScope) {
          sourceBox.classList.add("mw-preflight");
        }
      }

      await mwNextFrame();
      if (collapseSource) {
        try { void collapseSource.offsetHeight; } catch (_) {}
      }
      await mwDelay(preFadeMs);

      if (!cleanCollapse) {
        if (sourceScope && sourceScope.classList) {
          sourceScope.classList.add("mw-flight-launch");
        }
        if (sourceBox && sourceBox.classList && sourceBox !== sourceScope) {
          sourceBox.classList.add("mw-flight-launch");
        }
      }

      let restoreCollapseOverlay = () => {};
      if (cleanCollapse) {
        const sourcePill = iconSourceEl && iconSourceEl.closest ? (iconSourceEl.closest(".mw-pill") || iconSourceEl) : iconSourceEl;
        restoreCollapseOverlay = collapseSource ? mwCreateCollapseVisualOverlay(collapseSource, { excludeNode: sourcePill }) : (() => {});
        restoreCleanSource = mwTemporarilyHideForFlight(sourcePill);
      }

      ghostBadge = iconSourceEl ? mwCreateGhost("badge", m, iconSourceEl, badge) : null;

      if (ghostBadge && badgeStartPt) {
        ghostBadge.style.left = badgeStartPt.x + "px";
        ghostBadge.style.top = badgeStartPt.y + "px";
      }

      const tasks = [];

      if (sourceBox && sourceBox.classList && opts && opts.pillOnlyChrome === true) {
        sourceBox.classList.add("mw-flight-pill-only");
      }

      tasks.push(titleFlowTask || Promise.resolve());

      if (collapseSource) {
        tasks.push(mwAnimateCollapse(collapseSource, flyMs, phoneFlow ? "linear" : undefined, {
          reserveAnchor: (opts && opts.collapseAnchor) ? opts.collapseAnchor : null,
          reserveHeight: Math.max(8, Number(opts && opts.collapseReserveHeight) || mwCollapsedLineSlotPx(collapseSource)),
          reserveKind: String(opts && opts.collapseLineKind || mwDismissLineKindForLevel(m)),
          reserveInteractive: !!(opts && opts.collapseLineInteractive),
        }));
      }

      if (ghostBadge && badgeStartPt) {
        tasks.push(
          mwAnimateGhost(
            ghostBadge,
            badgeStartPt,
            mwRectCenter(badgeRect),
            { duration: flyMs, easing: phoneFlow ? "linear" : undefined }
          )
        );
      } else {
        mwRevealBadgeSeamless(badge);
      }

      await Promise.all(tasks);

      try { restoreCleanSource(); } catch (_) {}
      try { restoreCollapseOverlay(); } catch (_) {}
      mwRevealBadgeSeamless(badge);
      await mwNextFrame();
      if (ghostBadge) mwRemoveGhost(ghostBadge);

      if (opts && typeof opts.onDone === "function") {
        try { opts.onDone(); } catch (_) {}
      }
    })
    .catch(() => {
      mwSetTitleFlightLock(badge, false);
      badge.classList.add("is-visible");
      try { restoreCleanSource(); } catch (_) {}
      try { restoreCollapseOverlay(); } catch (_) {}
      mwRevealBadgeSeamless(badge);
      mwResetTitleFlight(sc.titleText);
      if (ghostBadge) mwRemoveGhost(ghostBadge);
      try {
        const sourceScope = opts && opts.sourceScope ? opts.sourceScope : null;
        const sourceBox = opts && opts.sourceBox ? opts.sourceBox : null;
        if (sourceScope && sourceScope.classList) {
          sourceScope.classList.remove("mw-preflight", "mw-flight-launch", "mw-collapsing");
        }
        if (sourceBox && sourceBox.classList) {
          sourceBox.classList.remove("mw-preflight", "mw-flight-launch", "mw-collapsing", "mw-flight-pill-only");
          mwClearCollapseStyles(sourceBox);
        }
      } catch (_) {}
      if (opts && typeof opts.onDone === "function") {
        try { opts.onDone(); } catch (_) {}
      }
    });
}

function mwDismissWidget(state, opts) {
    if (!state || state.dismissed) return;
    const options = opts && typeof opts === "object" ? opts : {};
    const immediate = !!options.immediate;
    state.dismissed = true;
    state.needsRatingCue = false;
    state.dismissLineKind = String(options.lineKind || state.dismissLineKind || mwDismissLineKindForLevel(state.currentM));
    state.dismissLineInteractive = !!(options.interactive || state.dismissLineInteractive);
    if (state.raf) {
      try { cancelAnimationFrame(state.raf); } catch (_) {}
      state.raf = 0;
    }
    const useCollapsedSource = !!state.keepCollapsedDom;
    if (state.box) {
      if (useCollapsedSource) state.box.classList.remove("mw-dismissed", "mw-source-hidden");
      else state.box.classList.add("mw-dismissed");
    }
    if (state.compact) {
      state.compact.classList.remove("is-visible");
      state.compact.classList.add("mw-dismissed");
    }
    const finish = () => {
      try {
        if (state.box) {
          if (useCollapsedSource) {
            mwClearDismissedLineState(state, { animate: false });
            mwApplyCollapsedBoxLine(state.box, state.dismissLineKind || "default", !!state.dismissLineInteractive);
            state.box.classList.remove("mw-source-hidden", "mw-dismissed");
          } else {
            mwClearCollapsedBoxLine(state.box);
            mwApplyDismissedLineState(state, { animate: false });
            state.box.classList.add("mw-source-hidden", "mw-dismissed");
          }
        }
      } catch (_) {}
      try { if (state.compact) state.compact.classList.remove("is-visible"); } catch (_) {}
    };
    if (immediate || mwMotionReduced()) {
      finish();
      return;
    }
    window.setTimeout(finish, 220);
  }


  function mwTypesetMathIn(el) {
    if (!el) return;
    try {
      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise([el]).catch(() => {});
      }
    } catch (_) {}
  }

  function mwEnsureReadinessStyles() {
    ["mw-readiness-style-v1", "mw-readiness-style-v2"].forEach((id) => {
      const old = document.getElementById(id);
      if (old) {
        try { old.remove(); } catch (_) {}
      }
    });
    if (document.getElementById("mw-readiness-style-v3")) return;
    const st = document.createElement("style");
    st.id = "mw-readiness-style-v3";
    st.textContent = `
      #mw-mastery .mw-head-right{
        display:inline-flex;
        align-items:center;
        justify-content:flex-end;
        gap:8px;
        flex:0 0 auto;
        min-width:0;
        flex-wrap:nowrap;
        justify-self:end;
        white-space:nowrap;
      }
      #mw-mastery .mw-ready-chip{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink);
        border-radius:999px;
        padding:6px 10px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        line-height:1;
        font-weight:400;
        font-family: var(--md-text-font-family, inherit);
        box-sizing:border-box;
        min-height:36px;
        cursor:pointer;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.02);
        transition:
          background .18s ease,
          border-color .18s ease,
          color .18s ease,
          box-shadow .18s ease,
          transform .18s ease;
      }
      #mw-mastery .mw-ready-chip:hover,
      #mw-mastery .mw-ready-chip:focus-visible,
      #mw-mastery .mw-ready-chip[aria-expanded="true"]{
        background: var(--mw-ready-fill-hover, rgba(255,255,255,.08));
        border-color: color-mix(in srgb, rgb(var(--mw-ready-rgb, 255 255 255)) 42%, var(--md-default-fg-color--lightest));
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.02),
          0 0 0 1px rgba(var(--mw-ready-rgb, 255, 255, 255), .06),
          0 8px 18px rgba(var(--mw-ready-rgb, 255, 255, 255), .12);
      }
      #mw-mastery .mw-ready-chip[disabled]{
        cursor:default;
        opacity:.78;
      }
      #mw-mastery .mw-ready-chip[disabled]:hover,
      #mw-mastery .mw-ready-chip[disabled]:focus-visible,
      #mw-mastery .mw-ready-chip[disabled][aria-expanded="true"]{
        background: rgba(255,255,255,.04);
        border-color: var(--md-default-fg-color--lightest);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.02);
      }
      #mw-mastery .mw-ready-chip-label{
        opacity:.92;
        font-size:12px;
        line-height:1;
        font-weight:400;
        letter-spacing:0;
      }
      #mw-mastery .mw-ready-chip-pct{
        font-size:12px;
        line-height:1;
        font-variant-numeric:tabular-nums;
        font-weight:400;
      }
      #mw-mastery .mw-recap-chip{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink);
        border-radius:999px;
        min-width:0;
        min-height:36px;
        padding:0 12px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        cursor:pointer;
        box-sizing:border-box;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.02);
        transition:
          background .18s ease,
          border-color .18s ease,
          color .18s ease,
          box-shadow .18s ease,
          transform .18s ease,
          opacity .18s ease,
          filter .18s ease;
      }
      #mw-mastery .mw-recap-chip:hover,
      #mw-mastery .mw-recap-chip:focus-visible,
      #mw-mastery .mw-recap-chip[aria-expanded="true"]{
        background: rgba(0, 224, 208, .12);
        border-color: rgba(0, 224, 208, .44);
        box-shadow: 0 0 0 1px rgba(0, 224, 208, .08), 0 8px 18px rgba(0, 224, 208, .10);
      }
      #mw-mastery .mw-recap-chip-ico{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        line-height:1;
        flex:0 0 auto;
      }
      #mw-mastery .mw-recap-chip-label{
        display:inline-block;
        font-size:12px;
        line-height:1;
        font-weight:400;
        opacity:.92;
        letter-spacing:0;
      }
      #mw-mastery .mw-recap-chip-ico svg,
      #mw-mastery .mw-recap-chip-ico svg *{
        display:block;
        color: currentColor;
        stroke: currentColor;
        fill: none;
      }
      #mw-mastery .mw-ready-chip,
      #mw-mastery .mw-hide,
      #mw-mastery .mw-manage{
        font-size:12px;
      }
      #mw-mastery .mw-hide .mw-full,
      #mw-mastery .mw-hide .mw-short,
      #mw-mastery .mw-manage .mw-full,
      #mw-mastery .mw-manage .mw-short{
        font-size:12px;
        line-height:1;
        font-weight:400;
      }
      html[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear{
        color: var(--mw-title-plain-ink) !important;
      }
      html[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg *,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg *,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg *,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg *,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg *,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg *{
        color: currentColor !important;
        stroke: currentColor !important;
        fill: none !important;
      }
      html[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--recap,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--manage,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--ai,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--recap,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--manage,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--ai{
        color: rgba(255,255,255,.98) !important;
        opacity: 1 !important;
        filter: none !important;
      }
      html[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg *,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg *,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg,
      html[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg *,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-recap-chip-ico svg *,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-hide .mw-hide-ico svg *,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg,
      body[data-md-color-scheme="slate"] #mw-mastery .mw-manage .mw-gear svg *,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg *,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg *,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg,
      html[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--recap svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--toggle svg *,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg,
      body[data-md-color-scheme="slate"] .mw-title-menu-btn--manage svg *{
        color: rgba(255,255,255,.98) !important;
        stroke: rgba(255,255,255,.98) !important;
        fill: none !important;
        opacity: 1 !important;
        filter: none !important;
      }
      #mw-ready-popover,
      #mw-recap-popover{
        position:fixed;
        left:12px;
        top:12px;
        z-index:4000;
        width:min(340px, calc(100vw - 24px));
        max-width:calc(100vw - 24px);
        max-height:min(320px, calc(100vh - 24px));
        overflow:auto;
        overscroll-behavior:contain;
        -webkit-overflow-scrolling:touch;
        touch-action:pan-y;
        scrollbar-gutter:stable;
        padding:10px 12px;
        border-radius:16px;
        border:1.5px solid color-mix(in srgb, var(--md-default-fg-color) 24%, var(--md-default-bg-color));
        outline:1px solid color-mix(in srgb, var(--md-default-bg-color) 84%, transparent);
        outline-offset:-2px;
        background:color-mix(in srgb, var(--md-default-bg-color) 96%, rgb(var(--mw-ready-rgb, 120 130 150)) 4%);
        backdrop-filter: blur(10px);
        box-shadow: 0 18px 48px rgba(0,0,0,.20), 0 0 0 1px rgba(0,0,0,.06);
      }
      #mw-ready-popover[hidden],
      #mw-recap-popover[hidden]{
        display:none !important;
      }
      html[data-md-color-scheme="slate"] .mw-title-menu,
      body[data-md-color-scheme="slate"] .mw-title-menu,
      html[data-md-color-scheme="slate"] #mw-ready-popover,
      body[data-md-color-scheme="slate"] #mw-ready-popover,
      html[data-md-color-scheme="slate"] #mw-recap-popover,
      body[data-md-color-scheme="slate"] #mw-recap-popover{
        border-color:rgba(255,255,255,.22) !important;
        outline-color:rgba(255,255,255,.08) !important;
        box-shadow:0 18px 48px rgba(0,0,0,.30), 0 0 0 1px rgba(255,255,255,.06) !important;
      }
      html[data-md-color-scheme="slate"] .mw-title-menu-section,
      body[data-md-color-scheme="slate"] .mw-title-menu-section{
        border-color:rgba(255,255,255,.18) !important;
        outline-color:rgba(255,255,255,.06) !important;
      }
      #mw-ready-popover{
        width:min(520px, calc(100vw - 24px));
        max-width:calc(100vw - 24px);
        max-height:min(430px, calc(100vh - 24px));
      }
      .mw-title-menu [data-mw-ready-inline="1"]{
        width:auto;
        min-width:0;
        max-width:calc(100vw - 24px);
        max-height:min(430px, calc(100vh - 140px));
      }
      #mw-ready-popover .mw-ready-calc,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc{
        display:grid;
        gap:10px;
        min-width:0;
      }
      #mw-ready-popover .mw-ready-score-card,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-score-card{
        display:grid;
        gap:6px;
        padding:10px 12px;
        border:1px solid color-mix(in srgb, rgb(var(--mw-ready-rgb, 120 130 150)) 28%, var(--md-default-fg-color--lightest));
        border-radius:15px;
        background:linear-gradient(135deg, rgba(var(--mw-ready-rgb, 120, 130, 150), .16), rgba(255,255,255,.025));
      }
      #mw-ready-popover .mw-ready-score-main,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-score-main{
        display:flex;
        align-items:baseline;
        gap:8px;
        min-width:0;
      }
      #mw-ready-popover .mw-ready-score-number,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-score-number{
        font-size:1.15rem;
        line-height:1;
        font-weight:850;
        font-variant-numeric:tabular-nums;
        color:color-mix(in srgb, rgb(var(--mw-ready-rgb, 120 130 150)) 82%, var(--md-default-fg-color));
      }
      #mw-ready-popover .mw-ready-score-label,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-score-label{
        font-size:.76rem;
        line-height:1.25;
        font-weight:750;
        opacity:.92;
      }
      #mw-ready-popover .mw-ready-formula,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-formula{
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        gap:6px;
        font-size:.70rem;
        line-height:1.28;
        opacity:.78;
      }
      #mw-ready-popover .mw-ready-formula-code,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-formula-code{
        font-family:var(--md-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
        font-size:.68rem;
        line-height:1.2;
        padding:2px 6px;
        border-radius:999px;
        border:1px solid var(--md-default-fg-color--lightest);
        background:rgba(255,255,255,.045);
        white-space:nowrap;
      }
      #mw-ready-popover .mw-ready-scale,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-scale,
      #mw-ready-popover .mw-ready-rounding-note,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-rounding-note{
        font-size:.68rem;
        line-height:1.28;
        opacity:.64;
      }
      #mw-ready-popover .mw-ready-calc-list,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-list{
        list-style:none;
        padding:0;
        margin:0;
        display:grid;
        gap:8px;
      }
      #mw-ready-popover .mw-ready-calc-item,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-item{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        grid-template-areas:
          "link state"
          "calc calc";
        align-items:start;
        gap:6px 10px;
        margin:0;
        padding:9px 10px;
        border:1px solid color-mix(in srgb, var(--md-default-fg-color--lightest) 78%, transparent);
        border-radius:14px;
        background:rgba(255,255,255,.026);
      }
      #mw-ready-popover .mw-ready-calc-item .mw-ready-link,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-item .mw-ready-link{
        grid-area:link;
        display:grid;
        gap:2px;
        min-width:0;
      }
      #mw-ready-popover .mw-ready-link-title-row,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-link-title-row{
        display:flex;
        align-items:center;
        gap:6px;
        min-width:0;
      }
      #mw-ready-popover .mw-ready-link-title,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-link-title{
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.75rem;
        line-height:1.22;
        font-weight:720;
      }
      #mw-ready-popover .mw-ready-open,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-open{
        flex:0 0 auto;
        font-size:.62rem;
        line-height:1;
        opacity:.52;
      }
      #mw-ready-popover .mw-ready-link-meta,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-link-meta{
        font-size:.66rem;
        line-height:1.18;
        opacity:.60;
      }
      #mw-ready-popover .mw-ready-calc-item .mw-ready-state,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-item .mw-ready-state{
        grid-area:state;
        justify-self:end;
        align-self:start;
        max-width:128px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.64rem;
        line-height:1;
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:999px;
        padding:4px 7px;
        opacity:.82;
      }
      #mw-ready-popover .mw-ready-calc-line,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-line{
        grid-area:calc;
        display:grid;
        grid-template-columns:minmax(78px, .45fr) auto;
        align-items:center;
        gap:8px;
        min-width:0;
      }
      #mw-ready-popover .mw-ready-bar,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-bar{
        position:relative;
        display:block;
        height:7px;
        min-width:0;
        border-radius:999px;
        overflow:hidden;
        background:color-mix(in srgb, var(--md-default-fg-color) 8%, transparent);
      }
      #mw-ready-popover .mw-ready-bar-fill,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-bar-fill{
        position:absolute;
        inset:0 auto 0 0;
        width:var(--mw-ready-score-width, 0%);
        border-radius:999px;
        background:rgb(var(--mw-ready-rgb, 120 130 150));
        opacity:.72;
      }
      #mw-ready-popover .mw-ready-calc-text,
      .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-text{
        justify-self:end;
        font-size:.66rem;
        line-height:1.1;
        font-variant-numeric:tabular-nums;
        opacity:.72;
        white-space:nowrap;
      }
      @media (max-width:720px){
        #mw-ready-popover .mw-ready-calc-item,
        .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-item{
          grid-template-columns:minmax(0,1fr);
          grid-template-areas:
            "link"
            "state"
            "calc";
        }
        #mw-ready-popover .mw-ready-calc-item .mw-ready-state,
        .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-item .mw-ready-state{
          justify-self:start;
          max-width:100%;
        }
        #mw-ready-popover .mw-ready-calc-line,
        .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-line{
          grid-template-columns:minmax(72px,1fr);
        }
        #mw-ready-popover .mw-ready-calc-text,
        .mw-title-menu [data-mw-ready-inline="1"] .mw-ready-calc-text{
          justify-self:start;
        }
      }
      #mw-ready-popover .mw-menu-panel-title,
      #mw-recap-popover .mw-menu-panel-title{
        font-size:.76rem;
        font-weight:800;
        line-height:1.2;
        opacity:.96;
      }
      #mw-ready-popover .mw-menu-panel-summary,
      #mw-recap-popover .mw-menu-panel-summary{
        font-size:.72rem;
        line-height:1.3;
        opacity:.66;
      }
      #mw-ready-popover .mw-menu-panel-copy,
      #mw-recap-popover .mw-menu-panel-copy{
        font-size:.78rem;
        line-height:1.35;
        opacity:.9;
      }
      #mw-ready-popover .mw-ready-list,
      #mw-recap-popover .mw-ready-list,
      #mw-recap-popover .mw-recap-list{
        list-style:none;
        padding:0;
        margin:6px 0 0;
        display:grid;
        gap:6px;
      }
      #mw-ready-popover .mw-ready-item,
      #mw-recap-popover .mw-ready-item,
      #mw-recap-popover .mw-recap-item{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        align-items:center;
        gap:8px;
        margin-left:0;
        padding-left:0;
      }
      #mw-ready-popover .mw-ready-link,
      #mw-recap-popover .mw-ready-link{
        min-width:0;
        margin:0;
        padding:0;
        text-indent:0;
        text-decoration:none !important;
        color:inherit;
      }
      #mw-ready-popover .mw-ready-link:hover,
      #mw-ready-popover .mw-ready-link:focus-visible,
      #mw-ready-popover .mw-ready-link:active,
      #mw-ready-popover .mw-ready-link:visited,
      #mw-recap-popover .mw-ready-link:hover,
      #mw-recap-popover .mw-ready-link:focus-visible,
      #mw-recap-popover .mw-ready-link:active,
      #mw-recap-popover .mw-ready-link:visited{
        text-decoration:none !important;
        color:inherit;
      }
      #mw-ready-popover .mw-ready-link-title,
      #mw-recap-popover .mw-ready-link-title{
        display:block;
        font-size:.74rem;
        line-height:1.28;
        opacity:.95;
        margin-left:0;
        padding-left:0;
        text-indent:0;
      }
      #mw-ready-popover .mw-ready-link-meta,
      #mw-recap-popover .mw-ready-link-meta{
        display:block;
        font-size:.68rem;
        line-height:1.2;
        opacity:.62;
        margin-top:1px;
      }
      #mw-ready-popover .mw-ready-state,
      #mw-recap-popover .mw-ready-state{
        flex:0 0 auto;
        font-size:.66rem;
        line-height:1;
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:999px;
        padding:3px 8px;
        opacity:.9;
        align-self:center;
        justify-self:end;
        white-space:nowrap;
      }
      #mw-ready-popover .mw-ready-empty,
      #mw-recap-popover .mw-ready-empty,
      #mw-recap-popover .mw-recap-empty{
        font-size:.72rem;
        opacity:.68;
      }
      #mw-recap-popover .mw-recap{
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:16px;
        background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.025));
        overflow:hidden;
      }
      #mw-recap-popover .mw-recap-rating{
        font-size:.78rem;
        line-height:1.35;
        opacity:.9;
      }
      #mw-recap-popover .mw-recap-list{
        list-style:none;
        margin:0;
        padding:0;
        display:grid;
        gap:10px;
      }
      #mw-recap-popover .mw-recap-item{
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        align-items:start;
        gap:8px;
      }
      #mw-recap-popover .mw-recap-dot{
        width:8px;
        height:8px;
        margin-top:.42rem;
        border-radius:999px;
        background: rgba(99, 132, 255, .85);
        box-shadow: 0 0 0 4px rgba(99, 132, 255, .12);
      }
      #mw-recap-popover .mw-recap-dot[data-kind="view"]{
        background: rgba(88, 200, 170, .92);
        box-shadow: 0 0 0 4px rgba(88, 200, 170, .14);
      }
      #mw-recap-popover .mw-recap-dot[data-mw-effect-tier="master"]{
        background: var(--mw-master-gold-border);
        box-shadow: 0 0 0 4px rgba(226, 179, 54, .14);
      }
      #mw-recap-popover .mw-recap-dot[data-mw-effect-tier="know"]{
        background: var(--mw-know-silver-border);
        box-shadow: 0 0 0 4px rgba(196, 207, 223, .14);
      }
      #mw-recap-popover .mw-recap-dot[data-m="1"]{
        background: rgba(255, 184, 76, .92);
        box-shadow: 0 0 0 4px rgba(255, 184, 76, .14);
      }
      #mw-recap-popover .mw-recap-dot[data-m="0"]{
        background: rgba(255, 115, 115, .92);
        box-shadow: 0 0 0 4px rgba(255, 115, 115, .14);
      }
      #mw-recap-popover .mw-recap-main{
        min-width:0;
        display:grid;
        gap:3px;
      }
      #mw-recap-popover .mw-recap-label{
        font-size:.84rem;
        line-height:1.44;
        opacity:.94;
      }
      #mw-recap-popover .mw-recap-when{
        font-size:.74rem;
        opacity:.64;
        white-space:nowrap;
        padding-top:.1rem;
      }
      /* Compact widget is always icon-only, on both desktop and mobile. */
      #mw-mastery-compact .mw-row{
        gap:6px;
      }
      #mw-mastery-compact .mw-pill,
      #mw-mastery-compact .mw-hide,
      #mw-mastery-compact .mw-manage{
        width:36px;
        min-width:36px;
        height:34px;
        min-height:34px;
        padding:0;
        gap:0;
        justify-content:center;
      }
      #mw-mastery-compact .mw-lab,
      #mw-mastery-compact .mw-hide .mw-full,
      #mw-mastery-compact .mw-hide .mw-short,
      #mw-mastery-compact .mw-manage .mw-full,
      #mw-mastery-compact .mw-manage .mw-short{
        display:none !important;
      }
      /* The heartbeat animation writes to transform. On the compact widget that conflicts
         with the fixed-position translate used for docking and dragging, so keep compact stable. */
      #mw-mastery-compact.mw-needs-rating{
        animation:none !important;
      }
      #mw-mastery-compact.mw-dragging,
      #mw-mastery-compact.mw-dragging.mw-needs-rating{
        opacity:1 !important;
        visibility:visible !important;
        pointer-events:auto !important;
        animation:none !important;
        transition:none !important;
        transform:translateX(var(--mw-compact-shift-x, 0px)) translateY(0) scale(1) !important;
      }

      /* Compact widget disabled: keep the normal in-page widget only.
         This removes the desktop/iPad/mobile compact floating state completely. */
      #mw-mastery-compact{
        display:none !important;
        visibility:hidden !important;
        opacity:0 !important;
        pointer-events:none !important;
      }
      #mw-mastery.mw-docked{
        position:relative !important;
        top:auto !important;
        left:auto !important;
        right:auto !important;
        width:auto !important;
        max-width:none !important;
        transform:none !important;
      }
      #mw-mastery.mw-collapsing,
      [data-mw-collapse-overlay-mask],
      [data-mw-collapse-overlay]{
        -webkit-backface-visibility:hidden;
        backface-visibility:hidden;
        transform:translateZ(0);
      }

      #mw-mastery.mw-collapse-live-smooth{
        box-sizing:border-box !important;
        overflow:hidden !important;
        transition:none !important;
        -webkit-backface-visibility:hidden;
        backface-visibility:hidden;
        transform:translateZ(0);
      }
      [data-mw-collapse-overlay-mask]{
        display:block !important;
      }
      [data-mw-collapse-overlay]{
        display:block !important;
      }

      @media (max-width: 900px), (pointer: coarse){
        #mw-mastery-compact .mw-row{
          gap:6px;
        }
        #mw-mastery-compact .mw-pill,
        #mw-mastery-compact .mw-hide,
        #mw-mastery-compact .mw-manage{
          width:36px;
          min-width:36px;
          padding:0;
          gap:0;
          justify-content:center;
        }
        #mw-mastery-compact .mw-lab,
        #mw-mastery-compact .mw-hide .mw-full,
        #mw-mastery-compact .mw-hide .mw-short,
        #mw-mastery-compact .mw-manage .mw-full,
        #mw-mastery-compact .mw-manage .mw-short{
          display:none !important;
        }
      }
      @media (max-width: 720px){
        #mw-mastery .mw-head{
          align-items:center;
          flex-wrap:nowrap;
          gap:8px;
        }
        #mw-mastery .mw-title{
          flex:1 1 auto;
          min-width:0;
          line-height:1.14;
        }
        #mw-mastery .mw-head-right{
          width:auto;
          margin-left:auto;
          justify-content:flex-end;
          flex-wrap:nowrap;
          gap:5px;
        }
        #mw-mastery .mw-ready-chip{
          gap:0;
          padding:5px 8px;
          min-height:32px;
          font-size:11px;
        }
        #mw-mastery .mw-ready-chip-label{
          display:none;
        }
        #mw-mastery .mw-ready-chip-pct{
          font-size:11px;
        }
        #mw-mastery .mw-recap-chip{
          padding:0;
          min-height:32px;
          gap:0;
        }
        #mw-mastery .mw-recap-chip-label{
          display:none !important;
          font-size:11px;
        }
        #mw-ready-popover,
        #mw-recap-popover{
          width:min(340px, calc(100vw - 20px));
          max-width:calc(100vw - 20px);
          max-height:min(300px, calc(100vh - 20px));
          padding:10px 11px;
          border-radius:13px;
        }
      }
    `;
    document.head.appendChild(st);
  }



  function renderWidget() {
    // v3 fixes: rate-from-widget marks hidden; force-expanded widgets keep Manage + rating buttons visible.
    if (typeof window.__mw_widget_cleanup === "function") {
    try { window.__mw_widget_cleanup(); } catch (_) {}
    window.__mw_widget_cleanup = null;
  }
  try { mwClearFlyGhosts(); } catch (_) {}
    const rel = currentRelPath();
  if (!isConceptPage(rel)) return;
  if (!window.ConceptMastery) return;

    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;

    const existing = document.getElementById("mw-mastery");
    if (existing) existing.remove();
    const existingCompact = document.getElementById("mw-mastery-compact");
    if (existingCompact) existingCompact.remove();
    const existingAnchor = inner.querySelector(":scope > .mw-anchor");
    if (existingAnchor) existingAnchor.remove();
    const existingReadinessPopover = document.getElementById("mw-ready-popover");
    if (existingReadinessPopover) existingReadinessPopover.remove();

    ensureStyles();
    mwEnsureReadinessStyles();

    const conceptId = normLoc(rel);
    const title = normaliseMathDelimitersToDollar(((document.querySelector("h1") && document.querySelector("h1").textContent) || document.title || "").trim());
    const course = mwResolveCourseFromTagOrFallback(conceptId);
    const meta = {
      title,
      course,
      coursePath: conceptId.split("/").slice(0, -1).join("/"),
    };

    const state = {
      conceptId,
      meta,
      ratedThisVisit: false,
      needsRatingCue: false,
      hasExplicitRating: false,
      currentM: null,
      pendingFly: null,
      pendingBadgeFade: null,
      badgeFadeAnimating: false,
      dockMode: "normal",
      lastBoxHeight: 0,
      raf: 0,
      anchor: null,
      box: null,
      compact: null,
      observer: null,
      compactPos: { mode: "auto", left: 0, top: 0 },
      compactDrag: null,
      anchorPageTop: 0,
      dismissed: false,
      dismissLineKind: "default",
      dismissLineInteractive: false,
      keepCollapsedDom: false,
      flyAnimating: false,
      destroyers: [],
      searchObserver: null,
      searchSyncRaf: 0,
      searchDockModeBeforeSearch: "normal",
      searchCompactHoldUntil: 0,
      readinessSeq: 0,
      readinessData: null,
      readinessPopover: null,
      readinessOpen: false,
      readinessPinned: false,
      readinessAnchor: null,
      readinessPointerInside: false,
      readinessHideTimer: 0,
      recapData: null,
      recapExpandedWidget: false,
      recapExpandedMenu: false,
      recapPopover: null,
      recapOpen: false,
      recapPinned: false,
      recapAnchor: null,
      recapPointerInside: false,
      recapHideTimer: 0,
      widgetHidden: mwReadWidgetHidden(),
      forceExpanded: mwConsumeWidgetForceOpen(conceptId),
    };

    function mwReadinessFlattenItemsForCalc(data) {
      const groups = data && data.groups ? data.groups : {};
      return []
        .concat(Array.isArray(groups.readyNow) ? groups.readyNow : [])
        .concat(Array.isArray(groups.reviewLightly) ? groups.reviewLightly : [])
        .concat(Array.isArray(groups.learnFirst) ? groups.learnFirst : []);
    }

    function mwReadinessFirstFiniteNumber(obj, keys) {
      const source = obj && typeof obj === "object" ? obj : {};
      for (const key of keys || []) {
        const value = Number(source[key]);
        if (Number.isFinite(value)) return value;
      }
      return NaN;
    }

    function mwReadinessClampPct(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.min(100, n));
    }

    function mwReadinessFormatNumber(value, digits) {
      const n = Number(value);
      if (!Number.isFinite(n)) return "0";
      const d = Math.max(0, Math.min(2, Number(digits) || 0));
      const fixed = n.toFixed(d);
      return fixed.replace(/\.0+$/g, "").replace(/(\.\d*[1-9])0+$/g, "$1");
    }

    function mwReadinessItemWeightPct(item) {
      const direct = mwReadinessFirstFiniteNumber(item, ["weightPct", "influencePct", "weightPercent", "weight"]);
      if (!Number.isFinite(direct)) return 0;
      if (direct > 0 && direct <= 1 && !Number.isInteger(direct)) return mwReadinessClampPct(direct * 100);
      return mwReadinessClampPct(direct);
    }

    function mwReadinessItemScorePct(item) {
      const directPct = mwReadinessFirstFiniteNumber(item, ["scorePct", "readinessPct", "readyPct", "masteryPct", "masteryPercent", "statePct"]);
      if (Number.isFinite(directPct)) return mwReadinessClampPct(directPct);

      const ratio = mwReadinessFirstFiniteNumber(item, ["score", "readiness", "ready", "masteryReady", "stateScore"]);
      if (Number.isFinite(ratio)) {
        if (ratio >= 0 && ratio <= 1) return mwReadinessClampPct(ratio * 100);
        return mwReadinessClampPct(ratio);
      }

      const m = Number(item && item.m);
      if (m === 3 || m === 2) return 100;
      if (m === 1) return 50;
      if (m === 0) return 0;

      const label = String(item && item.stateLabel || item && item.label || "").toLowerCase();
      if (/mastered|mastery|clear|familiar|know/.test(label)) return 100;
      if (/fuzzy|unclear|partial|review/.test(label)) return 50;
      if (/unknown|not\s*visited|not\s*rated|unrated|don't|dont/.test(label)) return 0;
      return 0;
    }

    function mwReadinessBuildFormulaHtml(data, hrefForLoc) {
      if (!data || data.status !== "ok") {
        return `
          <div class="mw-menu-panel-title mw-ready-title">Prerequisite readiness</div>
          <div class="mw-menu-panel-copy mw-ready-summary">Prerequisite readiness is unavailable on this page.</div>
        `;
      }

      const totalCount = Number(data.totalAvailable) || 0;
      const directCount = Number(data.directCount) || 0;
      const indirectCount = Math.max(0, Number(data.indirectCount) || 0);
      const items = mwReadinessFlattenItemsForCalc(data);
      const consideredCount = Number(data.selectedCount) || items.length || totalCount;
      const exactPct = mwClampReadinessPct(data.pct);
      const weightSum = items.reduce((sum, item) => sum + mwReadinessItemWeightPct(item), 0);
      const rowSum = items.reduce((sum, item) => {
        const w = mwReadinessItemWeightPct(item);
        const score = mwReadinessItemScorePct(item);
        return sum + (w * score / 100);
      }, 0);
      const countParts = [];
      countParts.push(`${consideredCount} prerequisite${consideredCount === 1 ? "" : "s"} counted`);
      if (directCount) countParts.push(`${directCount} direct`);
      if (indirectCount) countParts.push(`${indirectCount} indirect`);
      if (weightSum > 0) countParts.push(`${mwReadinessFormatNumber(weightSum, 0)}% total influence`);

      const listHtml = items.length ? `<ul class="mw-ready-calc-list">${items.map((item) => {
        const rawTitle = normaliseMathDelimitersToDollar(String(item && item.title || item && item.loc || ""));
        const depth = Math.max(1, Number(item && item.depth) || 1);
        const relation = item && item.isDirect ? "Direct prerequisite" : `Indirect prerequisite · depth ${depth}`;
        const weight = mwReadinessItemWeightPct(item);
        const score = mwReadinessItemScorePct(item);
        const contribution = weight * score / 100;
        const stateLabel = String(item && item.stateLabel || "Not rated");
        const href = typeof hrefForLoc === "function" ? hrefForLoc(item && item.loc || "") : "#";
        return `
          <li class="mw-ready-calc-item">
            <a class="mw-ready-link" data-mk-no-hover-preview="1" href="${escapeHtml(href)}" title="Open prerequisite page" aria-label="Open prerequisite page: ${escapeHtml(rawTitle)}">
              <span class="mw-ready-link-title-row">
                <span class="mw-ready-link-title">${escapeHtml(rawTitle)}</span>
                <span class="mw-ready-open" aria-hidden="true">↗</span>
              </span>
              <span class="mw-ready-link-meta">${escapeHtml(relation)} · ${mwReadinessFormatNumber(weight, 0)}% influence</span>
            </a>
            <span class="mw-ready-state" title="${escapeHtml(stateLabel)}">${escapeHtml(stateLabel)}</span>
            <span class="mw-ready-calc-line" aria-label="${escapeHtml(rawTitle)} contributes ${mwReadinessFormatNumber(contribution, 1)} percentage points">
              <span class="mw-ready-bar" aria-hidden="true"><span class="mw-ready-bar-fill" style="--mw-ready-score-width:${mwReadinessFormatNumber(score, 0)}%"></span></span>
              <span class="mw-ready-calc-text">${mwReadinessFormatNumber(weight, 0)}% × ${mwReadinessFormatNumber(score, 0)}% = +${mwReadinessFormatNumber(contribution, 1)}%</span>
            </span>
          </li>
        `;
      }).join("")}</ul>` : `<div class="mw-ready-empty">No prerequisite details to show.</div>`;

      const rowNote = items.length && Math.abs(Math.round(rowSum) - exactPct) > 1
        ? `<div class="mw-ready-rounding-note">Visible rows use rounded influence weights; the displayed total uses the stored exact readiness value.</div>`
        : `<div class="mw-ready-rounding-note">The row contributions add up to the readiness score, up to normal rounding.</div>`;

      return `
        <div class="mw-ready-calc" data-mk-no-hover-preview="1">
          <div class="mw-menu-panel-title mw-ready-title">Prerequisite readiness</div>
          <div class="mw-ready-score-card">
            <div class="mw-ready-score-main">
              <span class="mw-ready-score-number">${exactPct}%</span>
              <span class="mw-ready-score-label">current page readiness</span>
            </div>
            <div class="mw-ready-formula">
              <span>Calculated as</span>
              <span class="mw-ready-formula-code">Σ influence × mastery score</span>
            </div>
            <div class="mw-ready-scale">Mastered/Clear = 100%, Fuzzy/Unclear = 50%, Unknown/Not visited = 0%.</div>
          </div>
          <div class="mw-menu-panel-copy mw-ready-summary">${escapeHtml(countParts.join(" · "))}</div>
          ${listHtml}
          ${rowNote}
        </div>
      `;
    }

    if (state.widgetHidden) {
      const hiddenVisitId = mwVisitId(conceptId);
      try {
        if (typeof window.ConceptMastery.bumpView === "function") {
          window.ConceptMastery.bumpView(conceptId, meta, { source: "widget-hidden", visitId: hiddenVisitId });
        }
      } catch (_) {}

      function mwHiddenReadinessHref(loc) {
        const clean = String(loc || "").replace(/^\/+/, "");
        if (!clean) return "#";
        try {
          return new URL(clean, getSiteRootUrl()).toString() + "#top";
        } catch (_) {
          return clean;
        }
      }

      function mwHiddenBuildReadinessMenuHtml(data) {
        return mwReadinessBuildFormulaHtml(data, mwHiddenReadinessHref);
      }

      function mwHiddenRecapTimelineHtml(data) {
        const items = Array.isArray(data && data.timeline) ? data.timeline : [];
        if (!items.length) return `<div class="mw-recap-empty">No recent activity yet.</div>`;
        return `<ol class="mw-recap-list">${items.map((item) => {
          const kind = String(item && item.kind || "");
          const mm = Number(item && item.m);
          return `
            <li class="mw-recap-item">
              <span class="mw-recap-dot" data-kind="${escapeHtml(kind)}"${Number.isFinite(mm) ? ` data-m="${mm}"${mwEffectTierHtml(mm)}` : ""}></span>
              <span class="mw-recap-main">
                <span class="mw-recap-label">${escapeHtml(item && item.label || "")}</span>
              </span>
              <span class="mw-recap-when">${escapeHtml(mwRelativeTimeLabel(item && item.ts))}</span>
            </li>`;
        }).join("")}</ol>`;
      }

      function hiddenRenderReadiness(summary) {
        const data = summary && typeof summary === "object" ? summary : { status: "unavailable" };
        state.readinessData = data;
        try {
          const btn = state.titleMenuReadyBtn || document.querySelector('.mw-title-menu .mw-title-menu-btn--ready');
          if (btn) {
            const pctEl = btn.querySelector(".mw-ready-chip-pct");
            if (pctEl) pctEl.textContent = data && data.status === "ok" ? `${mwClampReadinessPct(data.pct)}%` : "--";
            btn.disabled = !(data && data.status === "ok");
            mwApplyReadinessColor(btn, data);
          }
        } catch (_) {}
        try {
          const host = state.titleMenuReadinessHost || document.querySelector('.mw-title-menu [data-mw-ready-inline="1"]');
          if (host) {
            host.innerHTML = mwHiddenBuildReadinessMenuHtml(data);
            mwTypesetMathIn(host);
          }
        } catch (_) {}
        try {
          if (state.titleMenuEl && typeof state.titleMenuRefreshWidth === "function") state.titleMenuRefreshWidth();
          if (state.titleMenuEl && typeof state.titleMenuPlace === "function") state.titleMenuPlace();
        } catch (_) {}
      }

      function hiddenRenderRecap(placeFn) {
        const data = state.recapData;
        const host = state.titleMenuRecapHost || document.querySelector('.mw-title-menu [data-mw-recap="menu"]');
        if (!host) return;
        const hasRecap = !!(data && (data.status === "ok" || Array.isArray(data.timeline) || data.counts || Number(data.lastViewed) > 0 || Number(data.lastReviewed) > 0));
        const ratingText = Number.isFinite(state.currentM) ? `Your current rating is ${mwLevelLabel(state.currentM)}.` : "Not rated yet.";
        const bodyHtml = hasRecap ? mwHiddenRecapTimelineHtml(data) : `<div class="mw-recap-empty">No recent activity yet.</div>`;
        host.innerHTML = `
          <div class="mw-menu-panel-title mw-recap-title">Mastery recap</div>
          <div class="mw-menu-panel-copy mw-recap-rating">${escapeHtml(ratingText)}</div>
          ${bodyHtml}
        `;
        mwTypesetMathIn(host);
        try {
          const active = String(state.titleMenuActiveSection || "") === "recap";
          host.hidden = !active;
          if (active && typeof placeFn === "function") placeFn();
          if (state.titleMenuEl && typeof state.titleMenuRefreshWidth === "function") state.titleMenuRefreshWidth();
          if (state.titleMenuEl && typeof state.titleMenuPlace === "function") state.titleMenuPlace();
        } catch (_) {}
      }

      state.bindReadinessTriggersNow = function () {};
      state.renderReadinessNow = hiddenRenderReadiness;
      state.renderRecapNow = hiddenRenderRecap;

      async function syncHiddenReadiness() {
        if (!window.ConceptMastery || typeof window.ConceptMastery.readinessOf !== "function") {
          hiddenRenderReadiness({ status: "unavailable" });
          return;
        }
        const seq = ++state.readinessSeq;
        hiddenRenderReadiness({ status: "loading" });
        const summary = await window.ConceptMastery.readinessOf(conceptId, { maxDepth: 2 }).catch(() => ({ status: "unavailable" }));
        if (seq !== state.readinessSeq) return;
        hiddenRenderReadiness(summary);
      }

      function syncHiddenRecap() {
        if (!window.ConceptMastery || typeof window.ConceptMastery.recapOf !== "function") {
          state.recapData = { status: "unavailable" };
          hiddenRenderRecap();
          return;
        }
        try {
          state.recapData = window.ConceptMastery.recapOf(conceptId, { limit: 5 }) || { status: "empty" };
        } catch (_) {
          state.recapData = { status: "unavailable" };
        }
        hiddenRenderRecap();
      }

      function syncHiddenMode() {
        const sc = mwEnsureTitleScaffold();
        if (!sc) return;
        mwSetHiddenTitleMode(sc, true);
        const rec = window.ConceptMastery && typeof window.ConceptMastery.get === "function"
          ? window.ConceptMastery.get(conceptId)
          : null;
        const hasExplicitRating = mwHasExplicitRating(rec);
        state.hasExplicitRating = hasExplicitRating;
        state.currentM = hasExplicitRating ? rec.m : null;
        try {
          const canOpenFromLine = !hasExplicitRating;
          const lineKind = hasExplicitRating ? mwDismissLineKindForLevel(rec && rec.m) : "hidden";
          mwApplyAnchorLine(hiddenAnchor, lineKind, canOpenFromLine, { animate: false, height: mwCollapsedLineSlotPx(hiddenAnchor) });
          hiddenAnchor.classList.toggle("mw-hidden-open-line", canOpenFromLine);
          hiddenAnchor.setAttribute("aria-label", canOpenFromLine ? "Show mastery widget" : "Mastery widget hidden");
          hiddenAnchor.setAttribute("title", canOpenFromLine ? "Show mastery widget" : "");
        } catch (_) {}
        mwBindTitleMenuTriggers(state);
        mwApplyTitleState(hasExplicitRating ? rec.m : null, hasExplicitRating, { animate: false, forceHideBadge: true });
        syncHiddenReadiness();
        syncHiddenRecap();
        try { mwScheduleHeadingArtifactCleanup(); } catch (_) {}
      }

      const onHiddenMotion = () => syncHiddenMode();
      const onHiddenVisibility = (ev) => {
        const hidden = !!(ev && ev.detail && ev.detail.hidden);
        if (!hidden) {
          try { renderWidget(); } catch (_) {}
          return;
        }
        syncHiddenMode();
      };

      try {
        if (window.__mw_cmc_handler) {
          window.removeEventListener("conceptMasteryChanged", window.__mw_cmc_handler);
        }
      } catch (_) {}
      window.__mw_cmc_handler = () => syncHiddenMode();
      window.addEventListener("conceptMasteryChanged", window.__mw_cmc_handler);
      window.addEventListener("mk:site-motion-change", onHiddenMotion);
      window.addEventListener("mk:motionchange", onHiddenMotion);
      window.addEventListener("mw:widget-visibility-change", onHiddenVisibility);

      const h1Hidden = inner.querySelector("h1");
      const hiddenInsertAfter = (h1Hidden && h1Hidden.parentNode === inner) ? mwFindWidgetInsertAfter(inner, h1Hidden) : null;
      const hiddenAnchor = document.createElement("div");
      hiddenAnchor.className = "mw-anchor";
      if (hiddenInsertAfter && hiddenInsertAfter.parentNode === inner) {
        hiddenInsertAfter.insertAdjacentElement("afterend", hiddenAnchor);
      } else if (h1Hidden && h1Hidden.parentNode) {
        h1Hidden.insertAdjacentElement("afterend", hiddenAnchor);
      } else {
        inner.insertAdjacentElement("afterbegin", hiddenAnchor);
      }
      try { mwSyncSectionLineColor(hiddenAnchor); } catch (_) {}
      mwApplyAnchorLine(hiddenAnchor, "hidden", true, { animate: false });
      hiddenAnchor.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();
        const recNow = window.ConceptMastery && typeof window.ConceptMastery.get === "function"
          ? window.ConceptMastery.get(conceptId)
          : null;
        if (mwHasExplicitRating(recNow)) return;
        mwWriteWidgetHidden(false);
        mwWriteWidgetForceOpen(conceptId, true);
        renderWidget();
        try {
          requestAnimationFrame(() => {
            try { mwRandomRenderPanel(); } catch (_) {}
          });
        } catch (_) {
          try { window.setTimeout(() => { try { mwRandomRenderPanel(); } catch (_) {} }, 0); } catch (__) {}
        }
      });

      syncHiddenMode();

      window.__mw_widget_cleanup = function () {
        try { hiddenAnchor.remove(); } catch (_) {}
        try { window.removeEventListener("mk:site-motion-change", onHiddenMotion); } catch (_) {}
        try { window.removeEventListener("mk:motionchange", onHiddenMotion); } catch (_) {}
        try { window.removeEventListener("mw:widget-visibility-change", onHiddenVisibility); } catch (_) {}
        try {
          if (window.__mw_cmc_handler) {
            window.removeEventListener("conceptMasteryChanged", window.__mw_cmc_handler);
            window.__mw_cmc_handler = null;
          }
        } catch (_) {}
        try { mwCloseTitleMenu(); } catch (_) {}
        try { mwClearFlyGhosts(); } catch (_) {}
      };
      return;
    }

    const anchor = document.createElement("div");
    anchor.className = "mw-anchor";

    const box = document.createElement("div");
    box.id = "mw-mastery";
    box.className = "md-typeset";
    box.innerHTML = `
      <div class="mw-head">
        <div class="mw-title">Mastery for this concept</div>
        <div class="mw-head-right">
          <button type="button" class="mw-ready-chip" data-mw-ready-trigger="1" aria-haspopup="dialog" aria-expanded="false" disabled>
            <span class="mw-ready-chip-label">Prereq</span>
            <span class="mw-ready-chip-pct">...</span>
          </button>
          <button type="button" class="mw-recap-chip" data-mw-recap-trigger="1" aria-haspopup="dialog" aria-expanded="false" title="Mastery recap">
            <span class="mw-recap-chip-ico">${mwRecapIconHtml(18)}</span>
            <span class="mw-recap-chip-label">Recap</span>
          </button>
          <button type="button" class="mw-hide" data-mw-hide="1" title="Hide mastery bar">
            <span class="mw-hide-ico">${mwHideIconHtml()}</span>
            <span class="mw-full">Hide</span>
            <span class="mw-short">Hide</span>
          </button>
          <a class="mw-manage" href="#" data-mw-manage="1" title="Manage mastery">
            <span class="mw-gear">${mwGearHtml()}</span>
            <span class="mw-full">Manage mastery</span>
            <span class="mw-short">Manage</span>
          </a>
        </div>
      </div>
      <div class="mw-row">
        <button type="button" class="mw-pill" data-m="3" title="Mastered">
          <span class="mw-emo">${mwSvgForLevel(3, 18)}</span><span class="mw-lab">Mastered</span>
        </button>
        <button type="button" class="mw-pill" data-m="2" title="Clear">
          <span class="mw-emo">${mwSvgForLevel(2, 18)}</span><span class="mw-lab">Clear</span>
        </button>
        <button type="button" class="mw-pill" data-m="1" title="Unclear">
          <span class="mw-emo">${mwSvgForLevel(1, 18)}</span><span class="mw-lab">Unclear</span>
        </button>
        <button type="button" class="mw-pill" data-m="0" title="Unknown">
          <span class="mw-emo">${mwSvgForLevel(0, 18)}</span><span class="mw-lab">Unknown</span>
        </button>
      </div>
      <div class="mw-meta mw-aiq-host" id="mw-meta" data-aiq-widget-host="1"></div>
      <div class="mw-recap" data-mw-recap="widget" hidden></div>
    `;

    const compact = document.createElement("div");
    compact.id = "mw-mastery-compact";
    compact.className = "md-typeset";
    compact.innerHTML = mwCompactMarkup();

    state.anchor = anchor;
    state.box = box;
    state.compact = compact;
    try { mwSyncSectionLineColor(state); } catch (_) {}

    function handleDismissedLineUnhide(ev) {
      if (!state.dismissed || state.dismissLineKind !== "hidden" || !state.dismissLineInteractive || state.flyAnimating) return;
      ev.preventDefault();
      ev.stopPropagation();
      if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();
      const releaseRestoreFreeze = mwFreezeWidgetInnerMotion(box);
      state.widgetHidden = false;
      state.dismissed = false;
      state.keepCollapsedDom = false;
      state.dismissLineInteractive = false;
      state.dismissLineKind = "default";
      state.forceExpanded = true;
      mwWriteWidgetHidden(false);
      mwWriteWidgetForceOpen(conceptId, true);
      mwClearDismissedLineState(state, { animate: false });
      mwClearCollapsedBoxLine(box);
      try { box.classList.remove("mw-source-hidden", "mw-dismissed", "mw-docked", "mw-collapsing", "mw-collapsed-line"); } catch (_) {}
      try { compact.classList.remove("mw-dismissed", "is-visible"); } catch (_) {}
      try { mwClearCollapseStyles(box); } catch (_) {}
      try {
        box.removeAttribute("data-mw-collapsed-kind");
        box.removeAttribute("data-mw-collapsed-interactive");
        box.removeAttribute("aria-hidden");
        box.style.display = "";
        box.style.visibility = "";
        box.style.opacity = "";
        box.style.transform = "";
        box.style.transition = "none";
      } catch (_) {}
      try { void box.offsetHeight; } catch (_) {}
      sync();
      requestAnimationFrame(() => {
        try { box.style.transition = ""; } catch (_) {}
        scheduleDockSync();
        scheduleSearchSuppressionSync();
        requestAnimationFrame(() => {
          try { releaseRestoreFreeze(); } catch (_) {}
        });
      });
    }

    anchor.addEventListener("click", handleDismissedLineUnhide);
    box.addEventListener("click", (ev) => {
      if (!(state.keepCollapsedDom && state.dismissed && state.dismissLineInteractive && state.dismissLineKind === "hidden")) return;
      handleDismissedLineUnhide(ev);
    });

    const h1 = inner.querySelector("h1");
    const insertAfter = (h1 && h1.parentNode === inner) ? mwFindWidgetInsertAfter(inner, h1) : null;
    if (insertAfter && insertAfter.parentNode === inner) {
      insertAfter.insertAdjacentElement("afterend", anchor);
      anchor.insertAdjacentElement("afterend", box);
    } else if (h1 && h1.parentNode) {
      h1.insertAdjacentElement("afterend", anchor);
      anchor.insertAdjacentElement("afterend", box);
    } else {
      inner.insertAdjacentElement("afterbegin", anchor);
      anchor.insertAdjacentElement("afterend", box);
    }
    document.body.appendChild(compact);
    applyCompactPosition();
    bindCompactDrag();
    mwBindReadinessTriggers();
    mwBindRecapTriggers();

    function onReadinessViewportChange() {
      if (state.readinessOpen) mwPositionReadinessPopover();
      if (state.recapOpen) mwPositionRecapPopover();
    }

    function onReadinessDocPointerDown(ev) {
      const target = ev && ev.target;
      if (!target) return;

      if (state.readinessOpen) {
        const pop = state.readinessPopover;
        if (pop && pop.contains(target)) return;
        if ((state.box && state.box.contains(target)) || (state.compact && state.compact.contains(target))) {
          if (target.closest && target.closest('[data-mw-ready-trigger]')) return;
          if (!mwReadinessSupportsHover()) return;
          mwHideReadinessPopover();
        } else {
          mwHideReadinessPopover();
        }
      }

      if (state.recapOpen) {
        const recapPop = state.recapPopover;
        if (recapPop && recapPop.contains(target)) return;
        if (state.box && state.box.contains(target)) {
          if (target.closest && target.closest('[data-mw-recap-trigger]')) return;
          if (!mwReadinessSupportsHover()) return;
          mwHideRecapPopover();
        } else {
          mwHideRecapPopover();
        }
      }
    }

    window.addEventListener("resize", onReadinessViewportChange, { passive: true });
    window.addEventListener("scroll", onReadinessViewportChange, { passive: true });
    document.addEventListener("pointerdown", onReadinessDocPointerDown, true);

    const visitId = mwVisitId(conceptId);
    const pageRateKey = "mw_rated_once_v2:" + conceptId + ":" + visitId;

    try {
      if (typeof window.ConceptMastery.bumpView === "function") {
        window.ConceptMastery.bumpView(conceptId, meta, { source: "widget", visitId });
      }
    } catch (_) {}

    function syncDockState() {
      if (!state.box || !state.anchor || !state.compact) return;

      const hideCompactCompletely = () => {
        try {
          state.compact.classList.remove("is-visible", "mw-dragging");
          state.compact.classList.add("mw-compact-disabled");
          state.compact.style.removeProperty("--mw-compact-left");
          state.compact.style.removeProperty("--mw-compact-top");
          state.compact.style.removeProperty("--mw-compact-shift-x");
        } catch (_) {}
      };

      const restoreInlineWidget = () => {
        state.dockMode = "normal";
        try {
          state.anchor.style.height = "0px";
          state.anchor.style.maxHeight = "0px";
        } catch (_) {}
        try {
          state.box.classList.remove("mw-docked", "mw-source-hidden");
          state.box.style.removeProperty("--mw-dock-top");
          state.box.style.removeProperty("--mw-dock-left");
          state.box.style.removeProperty("--mw-dock-width");
        } catch (_) {}
        hideCompactCompletely();
      };

      // Dismissed/rated/hidden states still collapse to the thin line as before.
      if (state.dismissed) {
        state.dockMode = "normal";
        try {
          state.anchor.style.height = "0px";
          state.anchor.style.maxHeight = "0px";
        } catch (_) {}
        state.box.classList.remove("mw-docked");
        if (state.keepCollapsedDom) {
          mwClearDismissedLineState(state, { animate: false });
          mwApplyCollapsedBoxLine(state.box, state.dismissLineKind || "default", !!state.dismissLineInteractive);
          state.box.classList.remove("mw-source-hidden", "mw-dismissed");
        } else {
          mwClearCollapsedBoxLine(state.box);
          mwApplyDismissedLineState(state, { animate: false });
          state.box.classList.add("mw-source-hidden", "mw-dismissed");
        }
        hideCompactCompletely();
        try { state.compact.classList.add("mw-dismissed"); } catch (_) {}
        return;
      }

      // Compact/docked behaviour is deliberately disabled on desktop, iPad and phone.
      // The widget now stays as a normal in-page element and simply scrolls with the page.
      restoreInlineWidget();
    }

    function scheduleDockSync() {
      if (state.raf) return;
      state.raf = requestAnimationFrame(() => {
        state.raf = 0;
        syncDockState();
      });
    }

    function syncSearchSuppression() {
      const now = Date.now();
      const searchOpen = mwIsSearchOpen();
      const hadSearchOpen = state.lastSearchOpen === true;

      if (searchOpen) {
        if (!hadSearchOpen) state.searchDockModeBeforeSearch = state.dockMode || "normal";
        state.searchCloseGraceUntil = 0;
        state.searchCompactHoldUntil = 0;
      } else if (hadSearchOpen) {
        state.searchCloseGraceUntil = now + 720;
        state.searchCompactHoldUntil = state.searchCloseGraceUntil + 260;
      }

      state.lastSearchOpen = searchOpen;

      const closeGraceActive = !searchOpen && (now < (Number(state.searchCloseGraceUntil) || 0));
      const allowSearchSuppression = !mwIsFinePointerDesktop();
      const suppressUi = allowSearchSuppression && (searchOpen || closeGraceActive);

      [state.box, state.compact].forEach((el) => {
        if (!el || !el.classList) return;
        el.classList.toggle('mw-search-suppressed', suppressUi);
      });

      try {
        const flyLayer = document.querySelector('.mw-fly-layer');
        if (flyLayer && flyLayer.classList) flyLayer.classList.toggle('mw-search-suppressed', suppressUi);
      } catch (_) {}

      try {
        const titleMenu = document.querySelector('.mw-title-menu');
        if (titleMenu && titleMenu.classList) titleMenu.classList.toggle('mw-search-suppressed', suppressUi);
      } catch (_) {}

      if (state.searchCloseTimer) {
        try { window.clearTimeout(state.searchCloseTimer); } catch (_) {}
        state.searchCloseTimer = 0;
      }

      if (suppressUi) {
        try { state.compact && state.compact.classList.remove('mw-dragging'); } catch (_) {}
        try { state.compact && state.compact.classList.remove('is-visible'); } catch (_) {}
        if (closeGraceActive) {
          const remain = Math.max(24, (Number(state.searchCompactHoldUntil) || state.searchCloseGraceUntil || 0) - Date.now());
          state.searchCloseTimer = window.setTimeout(() => {
            state.searchCloseTimer = 0;
            scheduleSearchSuppressionSync();
            scheduleDockSync();
          }, remain + 16);
        }
      } else {
        scheduleDockSync();
      }
    }

    function scheduleSearchSuppressionSync() {
      if (state.searchSyncRaf) return;
      state.searchSyncRaf = requestAnimationFrame(() => {
        state.searchSyncRaf = 0;
        syncSearchSuppression();
      });
    }

    function bindManage(scope) {
      const manageBtn = scope ? scope.querySelector("[data-mw-manage='1']") : null;
      if (!manageBtn || manageBtn.dataset.mwBound) return;
      manageBtn.dataset.mwBound = "1";
      manageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mwOpenMasteryManager();
      });
    }

    function bindHide(scope) {
      const hideBtn = scope ? scope.querySelector("[data-mw-hide='1']") : null;
      if (!hideBtn || hideBtn.dataset.mwBound) return;
      hideBtn.dataset.mwBound = "1";
      hideBtn.addEventListener("click", (e) => { handleHideClick(hideBtn, scope, e); }, true);
    }

    function getManageSource(scope) {
      const manageBtn = scope ? scope.querySelector("[data-mw-manage='1']") : null;
      if (!manageBtn) return null;
      return manageBtn;
    }

    function applyCompactPosition() {
      if (!state.compact) return;
      const pad = 8;
      const rect = state.compact.getBoundingClientRect();
      const width = Math.max(180, rect.width || state.compact.offsetWidth || 0);
      const height = Math.max(36, rect.height || state.compact.offsetHeight || 0);

      if (state.compactPos && state.compactPos.mode === "custom") {
        const minTop = Math.max(0, Math.round(mwDockTop()));
        const maxLeft = Math.max(pad, window.innerWidth - width - pad);
        const maxTop = Math.max(minTop, window.innerHeight - height - pad);
        state.compactPos.left = Math.min(maxLeft, Math.max(pad, Number(state.compactPos.left) || pad));
        state.compactPos.top = Math.min(maxTop, Math.max(minTop, Number(state.compactPos.top) || minTop));
        state.compact.style.setProperty("--mw-compact-left", `${Math.round(state.compactPos.left)}px`);
        state.compact.style.setProperty("--mw-compact-top", `${Math.round(state.compactPos.top)}px`);
        state.compact.style.setProperty("--mw-compact-shift-x", "0px");
        return;
      }

      const contentRect = mwGetContentRect();
      const boxRect = state.box && state.box.getBoundingClientRect ? state.box.getBoundingClientRect() : null;
      let left = contentRect.left;
      let top = mwDockTop();
            if (boxRect && boxRect.width > 0) {
        left = boxRect.left;
        top = window.innerWidth <= 720 ? mwDockTop() : boxRect.top;
      }
      const minTop = Math.max(0, Math.round(mwDockTop()));
      const maxLeft = Math.max(pad, window.innerWidth - width - pad);
      const maxTop = Math.max(minTop, window.innerHeight - height - pad);
      left = Math.min(maxLeft, Math.max(pad, Math.round(left || pad)));
      top = Math.min(maxTop, Math.max(minTop, Math.round(top || minTop)));
      state.compact.style.setProperty("--mw-compact-left", `${left}px`);
      state.compact.style.setProperty("--mw-compact-top", `${top}px`);
      state.compact.style.setProperty("--mw-compact-shift-x", "0px");
    }

        function bindCompactDrag() {
      if (!state.compact || state.compact.dataset.mwDragBound) return;
      const surface = state.compact;
      surface.dataset.mwDragBound = "1";
      const threshold = 8;

      const onPointerMove = (ev) => {
        const drag = state.compactDrag;
        if (!drag || drag.pointerId !== ev.pointerId) return;

        const dx = ev.clientX - drag.startX;
        const dy = ev.clientY - drag.startY;

        if (!drag.moved) {
          if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;
          drag.moved = true;
          state.compact.classList.add("mw-dragging");
        }

        ev.preventDefault();
        state.compactPos = {
          mode: "custom",
          left: drag.startLeft + dx,
          top: drag.startTop + dy,
        };
        applyCompactPosition();
      };

      const endDrag = (ev) => {
        const drag = state.compactDrag;
        if (!drag || (ev && drag.pointerId !== ev.pointerId)) return;
        state.compactDrag = null;
        state.compact.classList.remove("mw-dragging");
        try { surface.releasePointerCapture(drag.pointerId); } catch (_) {}
      };

      surface.addEventListener("pointerdown", (ev) => {
        if (!ev.isPrimary) return;
        if (ev.pointerType === "mouse" && ev.button !== 0) return;

        const interactive = !!(ev.target && ev.target.closest && ev.target.closest(".mw-pill, .mw-manage, .mw-hide"));
        if (ev.pointerType === "mouse" && interactive) return;

        const rect = surface.getBoundingClientRect();
        const currentLeft =
          (state.compactPos && state.compactPos.mode === "custom")
            ? Number(state.compactPos.left) || rect.left
            : rect.left;
        const currentTop =
          (state.compactPos && state.compactPos.mode === "custom")
            ? Number(state.compactPos.top) || rect.top
            : rect.top;

        state.compactDrag = {
          pointerId: ev.pointerId,
          startX: ev.clientX,
          startY: ev.clientY,
          startLeft: currentLeft,
          startTop: currentTop,
          moved: false,
        };
        state.compactPos = { mode: "custom", left: currentLeft, top: currentTop };
        try { surface.setPointerCapture(ev.pointerId); } catch (_) {}
      });

      surface.addEventListener("pointermove", onPointerMove, { passive: false });
      surface.addEventListener("pointerup", endDrag);
      surface.addEventListener("pointercancel", endDrag);

      state.destroyers.push(() => {
        try { surface.removeEventListener("pointermove", onPointerMove); } catch (_) {}
        try { surface.removeEventListener("pointerup", endDrag); } catch (_) {}
        try { surface.removeEventListener("pointercancel", endDrag); } catch (_) {}
      });
    }


    function mwReadinessSupportsHover() {
      try {
        return !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
      } catch (_) {
        return false;
      }
    }

    function mwPageScrollY() {
      try {
        if (window.visualViewport && Number.isFinite(window.visualViewport.pageTop)) {
          return Math.max(0, Number(window.visualViewport.pageTop) || 0);
        }
      } catch (_) {}
      try { return Math.max(0, Number(window.pageYOffset) || 0); } catch (_) {}
      try { return Math.max(0, Number(window.scrollY) || 0); } catch (_) {}
      try { return Math.max(0, Number(document.scrollingElement && document.scrollingElement.scrollTop) || 0); } catch (_) {}
      try { return Math.max(0, Number(document.documentElement && document.documentElement.scrollTop) || 0); } catch (_) {}
      try { return Math.max(0, Number(document.body && document.body.scrollTop) || 0); } catch (_) {}
      return 0;
    }

    function mwViewportWidth() {
      try {
        const vv = window.visualViewport;
        if (vv && Number(vv.width) > 0) return Number(vv.width);
      } catch (_) {}
      return Math.max(0, Number(window.innerWidth) || Number(document.documentElement && document.documentElement.clientWidth) || 0);
    }

    function mwIsMobileCompactUi() {
      try {
        const w = mwViewportWidth();
        const mm = window.matchMedia ? window.matchMedia.bind(window) : null;
        if (w && w <= 900) return true;
        if (mm && mm("(pointer: coarse)").matches) return true;
        if (mm && mm("(hover: none)").matches && (!w || w <= 1180)) return true;
        if (Number(navigator && navigator.maxTouchPoints) > 0 && (!w || w <= 1180)) return true;
        return false;
      } catch (_) {
        return false;
      }
    }

    function mwIsTouchUi() {
      return mwIsMobileCompactUi();
    }

    function mwReadinessHref(loc) {
      const clean = String(loc || "").replace(/^\/+/, "");
      if (!clean) return "#";
      try {
        return new URL(clean, getSiteRootUrl()).toString() + "#top";
      } catch (_) {
        return clean;
      }
    }

    function mwReadinessGroupHtml(title, items) {
      const arr = Array.isArray(items) ? items : [];
      if (!arr.length) return "";

      const list = arr.map((item) => {
        const rawTitle = normaliseMathDelimitersToDollar(String(item && item.title || item && item.loc || ""));
        const metaParts = [];
        metaParts.push(item && item.isDirect ? "Direct prerequisite" : `Depth ${Math.max(1, Number(item && item.depth) || 1)}`);
        metaParts.push(`${Math.max(1, Number(item && item.weightPct) || 0)}% influence`);
        const meta = metaParts.join(" · ");
        return `
          <li class="mw-ready-item">
            <a class="mw-ready-link" href="${escapeHtml(mwReadinessHref(item && item.loc || ""))}">
              <span class="mw-ready-link-title">${escapeHtml(rawTitle)}</span>
              <span class="mw-ready-link-meta">${escapeHtml(meta)}</span>
            </a>
            <span class="mw-ready-state">${escapeHtml(String(item && item.stateLabel || ""))}</span>
          </li>
        `;
      }).join("");

      return `
        <section class="mw-ready-group">
          <div class="mw-ready-group-title">${escapeHtml(title)}</div>
          <ul class="mw-ready-list">${list}</ul>
        </section>
      `;
    }

    function mwFlattenReadinessItems(data) {
      const groups = data && data.groups ? data.groups : {};
      return []
        .concat(Array.isArray(groups.readyNow) ? groups.readyNow : [])
        .concat(Array.isArray(groups.reviewLightly) ? groups.reviewLightly : [])
        .concat(Array.isArray(groups.learnFirst) ? groups.learnFirst : []);
    }

    function mwBuildReadinessMenuHtml(data) {
      return mwReadinessBuildFormulaHtml(data, mwReadinessHref);
    }

    function mwBuildReadinessPopupHtml(data) {
      return mwBuildReadinessMenuHtml(data);
    }

    function mwEnsureReadinessPopover() {
      let pop = state.readinessPopover;
      if (pop && pop.isConnected) return pop;
      pop = document.getElementById("mw-ready-popover");
      if (!pop) {
        pop = document.createElement("div");
        pop.id = "mw-ready-popover";
        pop.className = "md-typeset";
        pop.hidden = true;
        pop.addEventListener("mouseenter", () => {
          state.readinessPointerInside = true;
          if (state.readinessHideTimer) {
            try { clearTimeout(state.readinessHideTimer); } catch (_) {}
            state.readinessHideTimer = 0;
          }
        });
        pop.addEventListener("mouseleave", () => {
          state.readinessPointerInside = false;
          if (mwReadinessSupportsHover() && !state.readinessPinned) {
            mwScheduleReadinessHide();
          }
        });
        document.body.appendChild(pop);
      }
      state.readinessPopover = pop;
      return pop;
    }

    function mwPositionReadinessPopover() {
      const pop = mwEnsureReadinessPopover();
      const anchorEl = state.readinessAnchor;
      if (!pop || !anchorEl || !state.readinessOpen) return;
      if (!anchorEl.isConnected || anchorEl.disabled || anchorEl.offsetParent === null) {
        mwHideReadinessPopover();
        return;
      }

      pop.hidden = false;
      pop.style.left = "12px";
      pop.style.top = "12px";
      pop.style.maxHeight = "";
      const rect = anchorEl.getBoundingClientRect();
      const pad = 12;
      const gap = 8;
      const vw = Math.max(1, Number(window.innerWidth) || Number(document.documentElement && document.documentElement.clientWidth) || 1);
      const vh = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
      let topPad = pad;
      try { topPad = Math.max(pad, Number(mwHeaderOcclusionBottom && mwHeaderOcclusionBottom()) + 8 || pad); } catch (_) { topPad = pad; }
      const width = Math.min(pop.offsetWidth || 520, Math.max(120, vw - pad * 2));
      const preferLeft = rect.right - width;
      let left = Math.max(pad, Math.min(vw - width - pad, preferLeft));
      if (!Number.isFinite(left)) left = pad;

      const defaultMaxHeight = 430;
      const belowTop = Math.max(topPad, rect.bottom + gap);
      const belowSpace = Math.max(0, vh - belowTop - pad);
      const aboveSpace = Math.max(0, rect.top - topPad - gap);
      const shouldFlipAbove = belowSpace < 150 && aboveSpace > belowSpace + 80 && rect.top > vh * 0.55;
      let top = belowTop;
      let maxH = Math.max(96, Math.min(defaultMaxHeight, belowSpace || defaultMaxHeight));
      if (shouldFlipAbove) {
        maxH = Math.max(96, Math.min(defaultMaxHeight, aboveSpace));
        const naturalH = Math.min(maxH, Math.max(96, Number(pop.scrollHeight) || Number(pop.offsetHeight) || maxH));
        top = Math.max(topPad, rect.top - gap - naturalH);
      }
      pop.style.maxHeight = Math.floor(maxH) + "px";
      pop.style.left = Math.round(left) + "px";
      pop.style.top = Math.round(top) + "px";
    }

    function mwSetReadinessExpandedAttr(expanded) {
      mwGetReadinessRoots(state).forEach((root) => {
        if (!root) return;
        root.querySelectorAll("[data-mw-ready-trigger]").forEach((btn) => {
          btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        });
      });
    }

    function mwHideReadinessPopover() {
      if (state.readinessHideTimer) {
        try { clearTimeout(state.readinessHideTimer); } catch (_) {}
        state.readinessHideTimer = 0;
      }
      state.readinessOpen = false;
      state.readinessPinned = false;
      state.readinessPointerInside = false;
      state.readinessAnchor = null;
      mwSetReadinessExpandedAttr(false);
      const pop = mwEnsureReadinessPopover();
      pop.hidden = true;
      mwApplyReadinessColor(pop, null);
    }

    state.hideReadinessNow = mwHideReadinessPopover;

    function mwScheduleReadinessHide() {
      if (state.readinessHideTimer) {
        try { clearTimeout(state.readinessHideTimer); } catch (_) {}
      }
      state.readinessHideTimer = window.setTimeout(() => {
        state.readinessHideTimer = 0;
        if (state.readinessPointerInside) return;
        mwHideReadinessPopover();
      }, 70);
    }

    function mwShowReadinessPopover(anchorEl, opts) {
      const data = state.readinessData;
      if (!anchorEl || anchorEl.disabled || !data || data.status !== "ok") return;
      mwHideRecapPopover();
      const pop = mwEnsureReadinessPopover();
      state.readinessOpen = true;
      state.readinessPinned = !!(opts && opts.pinned);
      state.readinessAnchor = anchorEl;
      state.readinessPointerInside = false;
      pop.innerHTML = mwBuildReadinessPopupHtml(data);
      mwApplyReadinessColor(pop, data);
      pop.hidden = false;
      mwSetReadinessExpandedAttr(true);
      mwTypesetMathIn(pop);
      mwPositionReadinessPopover();
      try {
        const now = Date.now();
        const last = Number(anchorEl && anchorEl.dataset && anchorEl.dataset.mwReadyXpAt || 0);
        if (!last || now - last > 8000) {
          if (anchorEl && anchorEl.dataset) anchorEl.dataset.mwReadyXpAt = String(now);
          document.dispatchEvent(new CustomEvent("mk:prerequisite-readiness-opened", {
            detail: {
              source: "mastery-widget-readiness-popover",
              eventName: "mw-readiness-popover-open",
              path: (typeof location !== "undefined" ? String(location.pathname || "") : ""),
              title: (typeof document !== "undefined" ? String(document.title || "") : ""),
              readiness: data && data.pct != null ? Number(data.pct) : null,
              trigger: anchorEl && anchorEl.className ? String(anchorEl.className) : "mw-ready-trigger",
              hover: !(opts && opts.pinned),
              detectionVersion: 10,
            }
          }));
        }
      } catch (_) {}
    }

    function mwBindReadinessTriggers() {
      const supportsHover = mwReadinessSupportsHover();
      mwGetReadinessRoots(state).forEach((root) => {
        if (!root) return;
        root.querySelectorAll("[data-mw-ready-trigger]").forEach((btn) => {
          if (btn.dataset.mwReadyBound === "1") return;
          btn.dataset.mwReadyBound = "1";

          btn.addEventListener("mouseenter", () => {
            if (btn.closest && btn.closest('.mw-title-menu')) return;
            if (!supportsHover) return;
            if (btn.disabled) return;
            if (state.readinessHideTimer) {
              try { clearTimeout(state.readinessHideTimer); } catch (_) {}
              state.readinessHideTimer = 0;
            }
            mwShowReadinessPopover(btn, { pinned: false });
          });

          btn.addEventListener("mouseleave", () => {
            if (btn.closest && btn.closest('.mw-title-menu')) return;
            if (!supportsHover || state.readinessPinned) return;
            mwScheduleReadinessHide();
          });

          btn.addEventListener("focus", () => {
            if (btn.closest && btn.closest('.mw-title-menu')) return;
            if (btn.disabled) return;
            mwShowReadinessPopover(btn, { pinned: true });
          });

          btn.addEventListener("blur", () => {
            if (btn.closest && btn.closest('.mw-title-menu')) return;
            if (mwReadinessSupportsHover()) {
              mwScheduleReadinessHide();
            }
          });

          btn.addEventListener("click", (ev) => {
            if (btn.closest && btn.closest('.mw-title-menu')) return;
            if (btn.disabled) return;
            if (supportsHover) return;
            ev.preventDefault();
            ev.stopPropagation();
            if (state.readinessOpen && state.readinessAnchor === btn) {
              mwHideReadinessPopover();
            } else {
              mwShowReadinessPopover(btn, { pinned: true });
            }
          });
        });
      });
    }

    function mwInterpolateRgb(a, b, t) {
      return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
      ];
    }

    function mwReadinessColorForPct(pct) {
      const clamped = mwClampReadinessPct(pct);
      const stops = [
        // iOS system colors
        { pct: 0, rgb: [255, 59, 48] },   // #FF3B30 red
        { pct: 33, rgb: [255, 149, 0] },  // #FF9500 orange
        { pct: 66, rgb: [255, 204, 0] },  // #FFCC00 yellow
        { pct: 100, rgb: [52, 199, 89] }, // #34C759 green
      ];
      let rgb = stops[stops.length - 1].rgb;
      for (let i = 1; i < stops.length; i += 1) {
        const prev = stops[i - 1];
        const next = stops[i];
        if (clamped <= next.pct) {
          const span = Math.max(1, next.pct - prev.pct);
          const t = (clamped - prev.pct) / span;
          rgb = mwInterpolateRgb(prev.rgb, next.rgb, t);
          break;
        }
      }
      return {
        pct: clamped,
        rgb,
        rgbCss: rgb.join(', '),
        chipFill: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.26)`,
        chipFillHover: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.36)`,
        popFill: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.22)`,
      };
    }

    function mwApplyReadinessColor(el, data) {
      if (!el || !el.style) return;
      if (!data || data.status !== 'ok') {
        el.style.removeProperty('--mw-ready-rgb');
        el.style.removeProperty('--mw-ready-fill');
        el.style.removeProperty('--mw-ready-fill-hover');
        el.style.removeProperty('--mw-ready-pop-fill');
        return;
      }
      const color = mwReadinessColorForPct(data.pct);
      el.style.setProperty('--mw-ready-rgb', color.rgbCss);
      el.style.setProperty('--mw-ready-fill', color.chipFill);
      el.style.setProperty('--mw-ready-fill-hover', color.chipFillHover);
      el.style.setProperty('--mw-ready-pop-fill', color.popFill);
    }

    function mwRefreshReadinessChips() {
      const data = state.readinessData;
      const ok = !!(data && data.status === "ok");
      const pctText = ok ? `${mwClampReadinessPct(data.pct)}%` : "--";
      mwGetReadinessRoots(state).forEach((root) => {
        if (!root) return;
        root.querySelectorAll("[data-mw-ready-trigger]").forEach((btn) => {
          const pctEl = btn.querySelector(".mw-ready-chip-pct");
          if (pctEl) pctEl.textContent = pctText;
          btn.disabled = !ok;
          btn.setAttribute("aria-expanded", state.readinessOpen ? "true" : "false");
          mwApplyReadinessColor(btn, data);
        });
      });
    }

    function renderReadiness(summary) {
      const data = summary && typeof summary === "object" ? summary : { status: "unavailable" };
      state.readinessData = data;
      mwRefreshReadinessChips();
      mwBindReadinessTriggers();

      const inlineHost = state.titleMenuReadinessHost;
      if (inlineHost && inlineHost.isConnected) {
        inlineHost.innerHTML = mwBuildReadinessMenuHtml(data);
        mwTypesetMathIn(inlineHost);
        
      }

      try {
        if (state.titleMenuEl && typeof state.titleMenuRefreshWidth === "function") state.titleMenuRefreshWidth();
        if (state.titleMenuEl && typeof state.titleMenuPlace === "function") state.titleMenuPlace();
      } catch (_) {}

      if (state.readinessOpen && data.status === "ok" && state.readinessAnchor) {
        if (!(state.titleMenuEl && state.readinessAnchor && state.titleMenuEl.contains(state.readinessAnchor))) {
          mwShowReadinessPopover(state.readinessAnchor, { pinned: state.readinessPinned });
        }
      } else if (data.status !== "ok") {
        mwHideReadinessPopover();
      }
    }

    state.bindReadinessTriggersNow = mwBindReadinessTriggers;
    state.renderReadinessNow = renderReadiness;

    async function syncReadiness() {
      if (!window.ConceptMastery || typeof window.ConceptMastery.readinessOf !== "function") {
        renderReadiness({ status: "unavailable" });
        return;
      }

      const seq = ++state.readinessSeq;
      state.readinessData = null;
      mwGetReadinessRoots(state).forEach((root) => {
        if (!root) return;
        root.querySelectorAll("[data-mw-ready-trigger]").forEach((btn) => {
          const pctEl = btn.querySelector(".mw-ready-chip-pct");
          if (pctEl) pctEl.textContent = "...";
          btn.disabled = true;
          btn.setAttribute("aria-expanded", "false");
        });
      });
      mwHideReadinessPopover();

      const summary = await window.ConceptMastery.readinessOf(conceptId, { maxDepth: 2 }).catch(() => ({ status: "unavailable" }));
      if (seq !== state.readinessSeq) return;
      renderReadiness(summary);
    }

    function mwEnsureRecapPopover() {
      let pop = state.recapPopover;
      if (pop && pop.isConnected) return pop;
      pop = document.getElementById("mw-recap-popover");
      if (!pop) {
        pop = document.createElement("div");
        pop.id = "mw-recap-popover";
        pop.className = "md-typeset";
        pop.hidden = true;
        pop.addEventListener("mouseenter", () => {
          state.recapPointerInside = true;
          if (state.recapHideTimer) {
            try { clearTimeout(state.recapHideTimer); } catch (_) {}
            state.recapHideTimer = 0;
          }
        });
        pop.addEventListener("mouseleave", () => {
          state.recapPointerInside = false;
          if (mwReadinessSupportsHover() && !state.recapPinned) {
            mwScheduleRecapHide();
          }
        });
        document.body.appendChild(pop);
      }
      state.recapPopover = pop;
      return pop;
    }

    function mwBuildRecapPopupHtml(data) {
      const hasRecap = !!(data && (data.status === "ok" || Array.isArray(data.timeline) || data.counts || Number(data.lastViewed) > 0 || Number(data.lastReviewed) > 0));
      const ratingText = Number.isFinite(state.currentM) ? `Your current rating is ${mwLevelLabel(state.currentM)}.` : "Not rated yet.";
      const bodyHtml = hasRecap
        ? mwRecapTimelineHtml(data)
        : `<div class="mw-recap-empty">No recent activity yet.</div>`;
      return `
        <div class="mw-menu-panel-title mw-recap-title">Mastery recap</div>
        <div class="mw-menu-panel-copy mw-recap-rating">${escapeHtml(ratingText)}</div>
        ${bodyHtml}
      `;
    }

    function mwPositionRecapPopover() {
      const pop = mwEnsureRecapPopover();
      const anchorEl = state.recapAnchor;
      if (!pop || !anchorEl || !state.recapOpen) return;
      if (!anchorEl.isConnected || anchorEl.disabled || anchorEl.offsetParent === null) {
        mwHideRecapPopover();
        return;
      }

      pop.hidden = false;
      pop.style.left = "12px";
      pop.style.top = "12px";
      pop.style.maxHeight = "";
      const rect = anchorEl.getBoundingClientRect();
      const pad = 12;
      const gap = 8;
      const vw = Math.max(1, Number(window.innerWidth) || Number(document.documentElement && document.documentElement.clientWidth) || 1);
      const vh = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
      let topPad = pad;
      try { topPad = Math.max(pad, Number(mwHeaderOcclusionBottom && mwHeaderOcclusionBottom()) + 8 || pad); } catch (_) { topPad = pad; }
      const width = Math.min(pop.offsetWidth || 360, Math.max(120, vw - pad * 2));
      const preferLeft = rect.right - width;
      let left = Math.max(pad, Math.min(vw - width - pad, preferLeft));
      if (!Number.isFinite(left)) left = pad;

      const defaultMaxHeight = 320;
      const belowTop = Math.max(topPad, rect.bottom + gap);
      const belowSpace = Math.max(0, vh - belowTop - pad);
      const aboveSpace = Math.max(0, rect.top - topPad - gap);
      const shouldFlipAbove = belowSpace < 130 && aboveSpace > belowSpace + 80 && rect.top > vh * 0.55;
      let top = belowTop;
      let maxH = Math.max(88, Math.min(defaultMaxHeight, belowSpace || defaultMaxHeight));
      if (shouldFlipAbove) {
        maxH = Math.max(88, Math.min(defaultMaxHeight, aboveSpace));
        const naturalH = Math.min(maxH, Math.max(88, Number(pop.scrollHeight) || Number(pop.offsetHeight) || maxH));
        top = Math.max(topPad, rect.top - gap - naturalH);
      }
      pop.style.maxHeight = Math.floor(maxH) + "px";
      pop.style.left = Math.round(left) + "px";
      pop.style.top = Math.round(top) + "px";
    }

    function mwSetRecapExpandedAttr(expanded) {
      if (!state.box) return;
      state.box.querySelectorAll("[data-mw-recap-trigger]").forEach((btn) => {
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    }

    function mwHideRecapPopover() {
      if (state.recapHideTimer) {
        try { clearTimeout(state.recapHideTimer); } catch (_) {}
        state.recapHideTimer = 0;
      }
      state.recapOpen = false;
      state.recapPinned = false;
      state.recapPointerInside = false;
      state.recapAnchor = null;
      mwSetRecapExpandedAttr(false);
      const pop = mwEnsureRecapPopover();
      pop.hidden = true;
    }

    function mwScheduleRecapHide() {
      if (state.recapHideTimer) {
        try { clearTimeout(state.recapHideTimer); } catch (_) {}
      }
      state.recapHideTimer = window.setTimeout(() => {
        state.recapHideTimer = 0;
        if (state.recapPointerInside) return;
        mwHideRecapPopover();
      }, 70);
    }

    function mwShowRecapPopover(anchorEl, opts) {
      if (!anchorEl) return;
      mwHideReadinessPopover();
      const pop = mwEnsureRecapPopover();
      state.recapOpen = true;
      state.recapPinned = !!(opts && opts.pinned);
      state.recapAnchor = anchorEl;
      state.recapPointerInside = false;
      pop.innerHTML = mwBuildRecapPopupHtml(state.recapData);
      pop.hidden = false;
      mwSetRecapExpandedAttr(true);
      mwTypesetMathIn(pop);
      mwPositionRecapPopover();
    }

    function mwBindRecapTriggers() {
      if (!state.box) return;
      const supportsHover = mwReadinessSupportsHover();
      state.box.querySelectorAll("[data-mw-recap-trigger]").forEach((btn) => {
        if (btn.dataset.mwRecapBound === "1") return;
        btn.dataset.mwRecapBound = "1";

        btn.addEventListener("mouseenter", () => {
          if (!supportsHover) return;
          if (state.recapHideTimer) {
            try { clearTimeout(state.recapHideTimer); } catch (_) {}
            state.recapHideTimer = 0;
          }
          mwShowRecapPopover(btn, { pinned: false });
        });

        btn.addEventListener("mouseleave", () => {
          if (!supportsHover || state.recapPinned) return;
          mwScheduleRecapHide();
        });

        btn.addEventListener("focus", () => {
          mwShowRecapPopover(btn, { pinned: true });
        });

        btn.addEventListener("blur", () => {
          if (mwReadinessSupportsHover()) {
            mwScheduleRecapHide();
          }
        });

        btn.addEventListener("click", (ev) => {
          if (supportsHover) return;
          ev.preventDefault();
          ev.stopPropagation();
          if (state.recapOpen && state.recapAnchor === btn) {
            mwHideRecapPopover();
          } else {
            mwShowRecapPopover(btn, { pinned: true });
          }
        });
      });
    }

    function mwRecapSummaryText(data) {
      const counts = (data && data.counts) ? data.counts : { views: 0, ratings: 0 };
      const parts = [];
      parts.push(`Viewed ${mwPluralize(counts.views, "time")}`);
      if ((Number(counts.ratings) || 0) > 0) parts.push(`Rated ${mwPluralize(counts.ratings, "time")}`);
      else parts.push("Not rated yet");
      if (data && Number(data.lastReviewed) > 0) parts.push(`Last reviewed ${mwRelativeTimeLabel(data.lastReviewed)}`);
      else if (data && Number(data.lastViewed) > 0) parts.push(`Last viewed ${mwRelativeTimeLabel(data.lastViewed)}`);
      return parts.join(" · ");
    }

    function mwRecapTimelineHtml(data) {
      const items = Array.isArray(data && data.timeline) ? data.timeline : [];
      if (!items.length) return `<div class="mw-recap-empty">No recent activity yet.</div>`;
      return `<ol class="mw-recap-list">${items.map((item) => {
        const kind = String(item && item.kind || "");
        const mm = Number(item && item.m);
        return `
          <li class="mw-recap-item">
            <span class="mw-recap-dot" data-kind="${escapeHtml(kind)}"${Number.isFinite(mm) ? ` data-m="${mm}"${mwEffectTierHtml(mm)}` : ""}></span>
            <span class="mw-recap-main">
              <span class="mw-recap-label">${escapeHtml(item && item.label || "")}</span>
            </span>
            <span class="mw-recap-when">${escapeHtml(mwRelativeTimeLabel(item && item.ts))}</span>
          </li>`;
      }).join("")}</ol>`;
    }

    function mwRenderRecapHost(host, mode, placeFn) {
      if (!host) return;
      const data = state.recapData;
      if (mode !== "menu") {
        host.hidden = true;
        host.innerHTML = "";
        return;
      }

      const hasRecap = !!(data && (data.status === "ok" || Array.isArray(data.timeline) || data.counts || Number(data.lastViewed) > 0 || Number(data.lastReviewed) > 0));
      const ratingText = Number.isFinite(state.currentM) ? `Your current rating is ${mwLevelLabel(state.currentM)}.` : "Not rated yet.";
      const bodyHtml = hasRecap
        ? mwRecapTimelineHtml(data)
        : `<div class="mw-recap-empty">No recent activity yet.</div>`;
      host.innerHTML = `
        <div class="mw-menu-panel-title mw-recap-title">Mastery recap</div>
        <div class="mw-menu-panel-copy mw-recap-rating">${escapeHtml(ratingText)}</div>
        ${bodyHtml}
      `;
      const isOpen = String(state.titleMenuActiveSection || "") === "recap";
      host.hidden = !isOpen;
      mwTypesetMathIn(host);
      if (isOpen) {
        try { if (typeof placeFn === "function") placeFn(); } catch (_) {}
      }
    }

    function renderRecap(placeFn) {
      const widgetHost = box ? box.querySelector('[data-mw-recap="widget"]') : null;
      if (widgetHost) {
        widgetHost.hidden = true;
        widgetHost.innerHTML = "";
      }
      const menuHost = state.titleMenuRecapHost || document.querySelector('.mw-title-menu [data-mw-recap="menu"]');
      mwRenderRecapHost(menuHost, "menu", placeFn || state.titleMenuPlace);
      mwBindRecapTriggers();
      if (state.recapOpen && state.recapAnchor) {
        mwShowRecapPopover(state.recapAnchor, { pinned: state.recapPinned });
      }
    }

    state.renderRecapNow = renderRecap;

    function syncRecap() {
      if (!window.ConceptMastery || typeof window.ConceptMastery.recapOf !== "function") {
        state.recapData = { status: "unavailable" };
        renderRecap();
        return;
      }
      try {
        state.recapData = window.ConceptMastery.recapOf(conceptId, { limit: 5 }) || { status: "empty" };
      } catch (_) {
        state.recapData = { status: "unavailable" };
      }
      renderRecap();
    }

    function sync() {
  const rec = window.ConceptMastery.get(conceptId);
  const metaEl = document.getElementById("mw-meta");
  const hasExplicitRating = mwHasExplicitRating(rec);
  const pendingFly = state.pendingFly;
  const pendingBadgeFade = state.pendingBadgeFade;
  const hasPendingRateFlight = !!(pendingFly && pendingFly.animate);
  const hasPendingBadgeFade = !!(pendingBadgeFade && pendingBadgeFade.animate);
  const hasVisited = !!(
    rec && (
      rec.visited ||
      (Number(rec.visitCount) || 0) > 0 ||
      (Number(rec.viewCount) || 0) > 0 ||
      (Number(rec.lastViewed) || 0) > 0 ||
      (window.ConceptMastery && typeof window.ConceptMastery.wasVisited === "function" && window.ConceptMastery.wasVisited(conceptId))
    )
  );

  try { mwSyncSectionLineColor(state); } catch (_) {}
  state.needsRatingCue = hasVisited && !hasExplicitRating;
  state.hasExplicitRating = hasExplicitRating;
  state.currentM = hasExplicitRating ? rec.m : null;
  const keepWidgetVisibleOnTouch = false;

  [box, compact].forEach((el) => {
    if (!el) return;
    el.classList.toggle("mw-needs-rating", state.needsRatingCue);
    el.classList.toggle("mw-reduced-motion", mwMotionReduced());
    el.classList.toggle("mw-managed-to-title", hasExplicitRating && !state.forceExpanded && !keepWidgetVisibleOnTouch);
  });

  [box, compact].forEach((scope) => {
    if (!scope) return;
    Array.from(scope.querySelectorAll(".mw-pill")).forEach((b) => {
      const m = Number(b.getAttribute("data-m"));
      if (Number.isFinite(m)) {
        try { mwSyncEffectTierAttr(b, m); } catch (_) {}
        try {
          const emo = b.querySelector(".mw-emo");
          if (emo) mwSyncEffectTierAttr(emo, m);
        } catch (_) {}
      }
      const keepFlightLook = hasPendingRateFlight && b.classList.contains("mw-flight-picked");
      if (keepFlightLook) {
        b.disabled = false;
        b.classList.remove("mw-selected");
        return;
      }
      b.disabled = !!hasExplicitRating && !state.forceExpanded;
      if (Number.isFinite(m) && hasExplicitRating && rec.m === m) b.classList.add("mw-selected");
      else b.classList.remove("mw-selected");
    });
  });

  [box, compact].forEach((scope) => {
    if (!scope) return;
    const hideBtn = scope.querySelector("[data-mw-hide='1']");
    if (!hideBtn) return;
    const lockHide = !!hasExplicitRating && !state.forceExpanded;
    try { hideBtn.disabled = lockHide; } catch (_) {}
    try { hideBtn.setAttribute("aria-disabled", lockHide ? "true" : "false"); } catch (_) {}
    try { hideBtn.setAttribute("aria-hidden", lockHide ? "true" : "false"); } catch (_) {}
    try {
      if (lockHide) {
        hideBtn.hidden = true;
        hideBtn.style.setProperty("display", "none", "important");
      } else {
        hideBtn.hidden = false;
        hideBtn.style.removeProperty("display");
      }
    } catch (_) {}
    try {
      hideBtn.title = lockHide
        ? ""
        : "Hide mastery bar";
    } catch (_) {}
  });

  if (metaEl) {
    metaEl.classList.add("mw-aiq-host");
    metaEl.setAttribute("data-aiq-widget-host", "1");
    // Reserved for the AI mastery-check button. Do not write visited/not-rated text here.
    // Hold this row's height from first paint so the widget does not grow when the
    // button lands; cleared once we learn the concept has no AI questions. The
    // "resolved" flag keeps a later sync() from re-adding an empty reserved row.
    if (metaEl.dataset.mwAiqReserveResolved !== "1") metaEl.classList.add("mw-aiq-host--reserve");
    mwInstallAiQuizLabelObserver(metaEl, state);
    mwEnsureInlineAiQuizButton(metaEl, state);
    const mwClearAiqReserveIfEmpty = () => {
      try {
        if (metaEl && !metaEl.querySelector("button")) {
          metaEl.classList.remove("mw-aiq-host--reserve");
          metaEl.dataset.mwAiqReserveResolved = "1";
        }
      } catch (_) {}
    };
    if (metaEl.dataset.mwAiqInlineBound !== "1") {
      metaEl.dataset.mwAiqInlineBound = "1";
      const syncInlineAiq = (ev) => {
        try { mwEnsureInlineAiQuizButton(metaEl, state); } catch (_) {}
        // A definitive "unavailable" verdict means there is no button coming, so
        // release the reserved row and let it collapse.
        try { if (ev && ev.detail && ev.detail.available === false) mwClearAiqReserveIfEmpty(); } catch (_) {}
      };
      // Safety net: if the AI module never reports back (e.g. it failed to load),
      // do not leave an empty reserved row forever.
      try {
        const reserveSafety = window.setTimeout(mwClearAiqReserveIfEmpty, 2600);
        if (state && Array.isArray(state.destroyers)) state.destroyers.push(() => { try { window.clearTimeout(reserveSafety); } catch (_) {} });
      } catch (_) {}
      [60, 240, 700, 1400].forEach((delay) => {
        try {
          const id = window.setTimeout(syncInlineAiq, delay);
          if (state && Array.isArray(state.destroyers)) state.destroyers.push(() => { try { window.clearTimeout(id); } catch (_) {} });
        } catch (_) {}
      });
      try { window.addEventListener("aiq:ready", syncInlineAiq); } catch (_) {}
      try { window.addEventListener("aiq:availability-change", syncInlineAiq); } catch (_) {}
      if (state && Array.isArray(state.destroyers)) {
        state.destroyers.push(() => {
          try { window.removeEventListener("aiq:ready", syncInlineAiq); } catch (_) {}
          try { window.removeEventListener("aiq:availability-change", syncInlineAiq); } catch (_) {}
        });
      }
    }
  }

  syncReadiness();
  syncRecap();
  try { mwScheduleHeadingArtifactCleanup(); } catch (_) {}
  try {
    const sc = mwEnsureTitleScaffold();
    if (sc) mwSetHiddenTitleMode(sc, !!state.widgetHidden);
  } catch (_) {}

  if (state.badgeFadeAnimating && hasExplicitRating && !hasPendingBadgeFade) {
    scheduleDockSync();
    scheduleSearchSuppressionSync();
    return;
  }

  if (state.flyAnimating && hasExplicitRating && !pendingFly) {
    scheduleDockSync();
    scheduleSearchSuppressionSync();
    return;
  }

  if (hasPendingBadgeFade && hasExplicitRating) {
    state.pendingBadgeFade = null;
    state.pendingFly = null;
    state.flyAnimating = false;
    state.badgeFadeAnimating = true;
    const fadeDone = pendingBadgeFade.onDone;
    mwApplyTitleBadgeCrossfade(pendingBadgeFade.oldM, rec.m, Object.assign({}, pendingBadgeFade, {
      onDone: () => {
        state.badgeFadeAnimating = false;
        if (typeof fadeDone === "function") {
          try { fadeDone(); } catch (_) {}
        }
      },
    }));
    if (!state.forceExpanded && !keepWidgetVisibleOnTouch) {
      state.dismissed = true;
      state.keepCollapsedDom = false;
      state.dismissLineKind = mwDismissLineKindForLevel(rec.m);
      state.dismissLineInteractive = false;
      state.needsRatingCue = false;
      mwClearCollapsedBoxLine(box);
      mwApplyDismissedLineState(state, { animate: false });
      box.classList.remove("mw-docked");
      box.classList.add("mw-source-hidden", "mw-dismissed");
      compact.classList.remove("is-visible");
      compact.classList.add("mw-dismissed");
    }
    scheduleDockSync();
    scheduleSearchSuppressionSync();
    return;
  }

  state.pendingFly = null;
  state.pendingBadgeFade = null;
  mwApplyTitleState(hasExplicitRating ? rec.m : null, hasExplicitRating, pendingFly);

  if (hasExplicitRating && !pendingFly && !state.forceExpanded && !keepWidgetVisibleOnTouch) {
    const preserveCollapsedDom = !!(
      state.dismissed &&
      state.keepCollapsedDom &&
      box &&
      box.classList &&
      box.classList.contains("mw-collapsed-line")
    );
    state.dismissed = true;
    state.keepCollapsedDom = preserveCollapsedDom;
    state.dismissLineKind = mwDismissLineKindForLevel(rec.m);
    state.dismissLineInteractive = false;
    state.needsRatingCue = false;
    box.classList.remove("mw-docked");
    if (preserveCollapsedDom) {
      // A rating flight ends with #mw-mastery itself collapsed to the 1px line.
      // A later conceptMasteryChanged sync used to swap that live line for the
      // separate .mw-anchor line.  Because the anchor sits under the H1 with
      // different margin-collapse behaviour, that A→B swap made the finished
      // line jump downward.  Keep the already-collapsed DOM line for the current
      // page session; fresh page loads can still use the anchor representation.
      mwClearDismissedLineState(state, { animate: false });
      mwApplyCollapsedBoxLine(box, state.dismissLineKind || "default", false);
      box.classList.remove("mw-source-hidden", "mw-dismissed");
    } else {
      mwClearCollapsedBoxLine(box);
      mwApplyDismissedLineState(state, { animate: false });
      box.classList.add("mw-source-hidden", "mw-dismissed");
    }
    compact.classList.remove("is-visible");
    compact.classList.add("mw-dismissed");
    return;
  }

  if (!hasExplicitRating || state.forceExpanded || keepWidgetVisibleOnTouch) {
    state.dismissed = false;
    state.keepCollapsedDom = false;
    state.dismissLineInteractive = false;
    mwClearDismissedLineState(state, { animate: false });
    mwClearCollapsedBoxLine(box);
    box.classList.remove("mw-source-hidden", "mw-dismissed");
    compact.classList.remove("mw-dismissed");
  }

  scheduleDockSync();
  scheduleSearchSuppressionSync();
}

    async function handleHideClick(btn, scope, ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();

      if (btn && (btn.disabled || btn.getAttribute("aria-disabled") === "true")) return;
      if (state.dismissed || state.flyAnimating) return;

      const sc = mwEnsureTitleScaffold();
      const recNow = window.ConceptMastery && typeof window.ConceptMastery.get === "function"
        ? window.ConceptMastery.get(conceptId)
        : null;
      const hasExplicitRatingNow = mwHasExplicitRating(recNow);

      try {
        [scope, box, compact].forEach((el) => {
          if (!el || !el.classList) return;
          el.classList.remove(
            "mw-preflight",
            "mw-flight-launch",
            "mw-collapsing",
            "mw-collapse-live-smooth",
            "mw-flight-pill-only"
          );
        });
      } catch (_) {}

      state.widgetHidden = true;
      state.forceExpanded = false;
      mwWriteWidgetForceOpen(conceptId, false);

      if (hasExplicitRatingNow) {
        try {
          state.hasExplicitRating = true;
          state.currentM = recNow.m;
          state.dismissLineKind = mwDismissLineKindForLevel(recNow.m);
          state.dismissLineInteractive = false;
          state.keepCollapsedDom = false;
        } catch (_) {}
        try {
          if (sc) {
            mwApplyTitleState(recNow.m, true, { animate: false, forceHideBadge: true });
            mwSetHiddenTitleMode(sc, true);
          }
        } catch (_) {}
        mwDismissWidget(state, { immediate: true, lineKind: state.dismissLineKind, interactive: false });
      } else {
        state.hasExplicitRating = false;
        state.currentM = null;
        state.dismissLineKind = "hidden";
        state.dismissLineInteractive = true;
        state.keepCollapsedDom = true;
        try {
          if (sc) {
            mwSetHiddenTitleMode(sc, true);
            mwNormalizeHiddenManageTitle(sc);
          }
        } catch (_) {}
        mwDismissWidget(state, { immediate: true, lineKind: "hidden", interactive: true });
      }

      mwWriteWidgetHidden(true);
      try { scheduleDockSync(); } catch (_) {}
      try { scheduleSearchSuppressionSync(); } catch (_) {}
    }

    async function handleRateClick(btn, scope, ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (typeof ev.stopImmediatePropagation === "function") ev.stopImmediatePropagation();

      const allowRepeat = !!(ev && ev.__mwAllowRepeat);
      const sourceName = String((ev && ev.__mwSource) || "widget");
      if (sourceName === "widget" && mwPageActionMenuGuardActive(ev)) return;
      if (!allowRepeat) {
        if (state.ratedThisVisit) return;
        try {
          if (sessionStorage.getItem(pageRateKey) === "1") return;
        } catch (_) {}
      }

      const m = Number(btn.getAttribute("data-m"));
      if (!Number.isFinite(m) || !window.ConceptMastery) return;
      try {
        if (window.MasterySelfCheckGuard && typeof window.MasterySelfCheckGuard.guard === "function") {
          const proceed = await window.MasterySelfCheckGuard.guard(conceptId, m, meta, { source: sourceName });
          if (!proceed) return;
        }
      } catch (_) {}
      const releaseFlightVisual = mwFreezeFlightPillVisual(btn, m);
      const releaseWidgetFlightVisual = (scope === box) ? mwFreezeFlightWidgetVisual(box, m) : (() => {});

      state.ratedThisVisit = true;
      try { sessionStorage.setItem(pageRateKey, "1"); } catch (_) {}

      Array.from(scope.querySelectorAll(".mw-pill")).forEach((el) => {
        el.classList.toggle("mw-flight-picked", el === btn);
        try {
          const lm = Number(el.getAttribute("data-m"));
          if (Number.isFinite(lm)) mwSyncEffectTierAttr(el, lm);
        } catch (_) {}
      });
      const pickedIconEl = btn.querySelector(".mw-emo") || btn;
      try { mwSyncEffectTierAttr(pickedIconEl, m); } catch (_) {}
      const iconStartPt = pickedIconEl ? mwRectCenter(pickedIconEl.getBoundingClientRect()) : null;
      state.flyAnimating = true;
      mwPrimePickedIconVisual(pickedIconEl, m, 400);
      state.forceExpanded = false;
      mwWriteWidgetForceOpen(conceptId, false);

      const dismissLineKind = mwDismissLineKindForLevel(m);
      state.dismissLineKind = dismissLineKind;
      state.dismissLineInteractive = false;
      state.keepCollapsedDom = true;

      const flightToken = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      state.activeRateFlightToken = flightToken;
      state.pendingFly = {
        animate: true,
        flightToken,
        iconSource: pickedIconEl,
        iconStartPt,
        sourceScope: scope,
        sourceBox: box,
        collapseSource: box,
        collapseAnchor: null,
        collapseLineKind: dismissLineKind,
        collapseLineInteractive: false,
        collapseReserveHeight: mwCollapsedLineSlotPx(box),
        cleanCollapse: true,
        preFadeMs: 320,
        flyMs: 980,
        onDone: () => {
          try { releaseFlightVisual(); } catch (_) {}
          try { releaseWidgetFlightVisual(); } catch (_) {}
          if (state.activeRateFlightToken === flightToken) state.activeRateFlightToken = null;
          state.flyAnimating = false;
          mwDismissWidget(state, { immediate: true, lineKind: dismissLineKind, interactive: false });
        },
      };

      window.setTimeout(() => {
        try {
          if (state.activeRateFlightToken !== flightToken || !state.flyAnimating) return;
          try { releaseFlightVisual(); } catch (_) {}
          try { releaseWidgetFlightVisual(); } catch (_) {}
          state.activeRateFlightToken = null;
          state.pendingFly = null;
          state.flyAnimating = false;
          mwDismissWidget(state, { immediate: true, lineKind: dismissLineKind, interactive: false });
          try { sync(); } catch (_) {}
        } catch (_) {}
      }, 3600);

      try {
        if (typeof window.ConceptMastery.rate === "function") {
          window.ConceptMastery.rate(conceptId, m, meta, { source: sourceName, visitId });
        } else if (typeof window.ConceptMastery.set === "function") {
          window.ConceptMastery.set(conceptId, m, meta);
        }
      } catch (_) {}

      sync();
    }

    [box, compact].forEach((scope) => {
      bindManage(scope);
      bindHide(scope);
      Array.from(scope.querySelectorAll(".mw-pill")).forEach((btn) => {
        btn.addEventListener("click", (ev) => { handleRateClick(btn, scope, ev); }, true);
      });
    });

    try {
      window.MasteryWidget = window.MasteryWidget || {};
      window.__MasteryWidget = window.MasteryWidget;
      window.MasteryWidget.rateWithAnimation = function (id, level, metaOverride, opts) {
        const targetId = normLoc(id || "");
        if (targetId && targetId !== normLoc(conceptId)) return false;
        if (!window.ConceptMastery) return false;
        const m = Number(level);
        if (![0, 1, 2, 3].includes(m)) return false;
        const sourceName = String((opts && opts.source) || "ai-mcq");
        try {
          if (metaOverride && typeof metaOverride === "object") meta = Object.assign({}, meta, metaOverride);
        } catch (_) {}

        let recBefore = null;
        try {
          recBefore = typeof window.ConceptMastery.get === "function" ? window.ConceptMastery.get(conceptId) : null;
        } catch (_) {
          recBefore = null;
        }
        const hadExplicitRating = mwHasExplicitRating(recBefore);
        const oldM = hadExplicitRating ? Number(recBefore.m) : null;

        if (hadExplicitRating) {
          state.ratedThisVisit = true;
          state.forceExpanded = false;
          state.pendingFly = null;
          state.flyAnimating = false;
          try { sessionStorage.setItem(pageRateKey, "1"); } catch (_) {}
          try { mwWriteWidgetForceOpen(conceptId, false); } catch (_) {}

          if (oldM !== m) {
            state.pendingBadgeFade = {
              animate: true,
              oldM,
              newM: m,
              source: sourceName,
            };
          } else {
            state.pendingBadgeFade = null;
            state.badgeFadeAnimating = false;
          }

          try {
            if (typeof window.ConceptMastery.rate === "function") {
              window.ConceptMastery.rate(conceptId, m, meta, { source: sourceName, visitId });
            } else if (typeof window.ConceptMastery.set === "function") {
              window.ConceptMastery.set(conceptId, m, meta);
            }
          } catch (_) {}

          try { sync(); } catch (_) {}
          return true;
        }

        const scope = box && !box.classList.contains("mw-source-hidden") ? box : compact;
        const btn = scope ? scope.querySelector(`.mw-pill[data-m="${m}"]`) : null;
        if (!btn) return false;
        const fakeEvent = {
          __mwAllowRepeat: true,
          __mwSource: sourceName,
          preventDefault(){},
          stopPropagation(){},
          stopImmediatePropagation(){},
        };
        handleRateClick(btn, scope, fakeEvent);
        return true;
      };
    } catch (_) {}

    mwEnsureTitleScaffold();
    mwBindTitleMenuTriggers(state);
    sync();

    function installFirstInteractionRescue() {
      const endAt = Date.now() + 9000;
      let cleaned = false;
      let removeTimer = 0;
      const CONTROL_SEL = [
        '.mw-pill',
        '.mw-aiq-btn',
        '[data-aiq-widget-host="1"] button',
        '[data-mw-manage="1"]',
        '[data-mw-hide="1"]',
        '.mw-ready-chip',
        '.mw-recap-chip'
      ].join(',');

      function rectContains(el, x, y) {
        if (!el || !el.getBoundingClientRect) return false;
        try {
          const r = el.getBoundingClientRect();
          return !!(r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom && r.width > 1 && r.height > 1);
        } catch (_) {
          return false;
        }
      }

      function widgetAtPoint(x, y) {
        const scopes = [state.box, state.compact].filter(Boolean);
        for (const el of scopes) {
          if (!el || !el.isConnected) continue;
          if (el.classList && el.classList.contains('mw-dismissed')) continue;
          if (rectContains(el, x, y)) return el;
        }
        return null;
      }

      function controlAtPoint(scope, x, y) {
        if (!scope || !scope.querySelectorAll) return null;
        const controls = Array.from(scope.querySelectorAll(CONTROL_SEL));
        for (const btn of controls) {
          if (!btn || !btn.isConnected || !rectContains(btn, x, y)) continue;
          try {
            if (btn.hidden || btn.disabled || btn.getAttribute('aria-disabled') === 'true') continue;
            const cs = window.getComputedStyle(btn);
            if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) === 0) continue;
          } catch (_) {}
          return btn;
        }
        return null;
      }

      function clearStaleBlockers() {
        cleaned = true;
        try { mwClearStaleHeaderSearch({ bootOnly: false }); } catch (_) {}
        try { state.box && state.box.classList && state.box.classList.remove('mw-search-suppressed'); } catch (_) {}
        try { state.compact && state.compact.classList && state.compact.classList.remove('mw-search-suppressed'); } catch (_) {}
        try {
          document.querySelectorAll('.mw-fly-layer.mw-search-suppressed, .mw-title-menu.mw-search-suppressed').forEach((el) => {
            try { el.classList.remove('mw-search-suppressed'); } catch (_) {}
          });
        } catch (_) {}
        scheduleSearchSuppressionSync();
      }

      function maybeCleanup() {
        if (Date.now() <= endAt) return false;
        cleanup();
        return true;
      }

      function onPointerMove(ev) {
        if (maybeCleanup()) return;
        const x = Number(ev.clientX), y = Number(ev.clientY);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        if (widgetAtPoint(x, y)) clearStaleBlockers();
      }

      function onPointerDown(ev) {
        if (maybeCleanup()) return;
        const x = Number(ev.clientX), y = Number(ev.clientY);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        const scope = widgetAtPoint(x, y);
        if (!scope) return;
        clearStaleBlockers();

        // If a stale search overlay / checked toggle was the actual event target,
        // the widget's own button listener would not receive this first click.
        // Route that first click to the real widget control under the pointer.
        try {
          if (scope.contains(ev.target)) return;
        } catch (_) {}
        const btn = controlAtPoint(scope, x, y);
        if (!btn) return;
        try { ev.preventDefault(); } catch (_) {}
        try { ev.stopPropagation(); } catch (_) {}
        try { if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation(); } catch (_) {}
        window.setTimeout(() => {
          try { btn.click(); } catch (_) {}
        }, 0);
      }

      function cleanup() {
        try { document.removeEventListener('pointermove', onPointerMove, true); } catch (_) {}
        try { document.removeEventListener('pointerdown', onPointerDown, true); } catch (_) {}
        try { if (removeTimer) window.clearTimeout(removeTimer); } catch (_) {}
        removeTimer = 0;
      }

      try { document.addEventListener('pointermove', onPointerMove, { capture: true, passive: true }); } catch (_) {}
      try { document.addEventListener('pointerdown', onPointerDown, true); } catch (_) {}
      removeTimer = window.setTimeout(cleanup, 9300);
      state.destroyers.push(cleanup);

      // Clear once immediately after mount as well, so a stale checked search
      // toggle cannot leave the widget inert until the first user click.
      window.setTimeout(() => {
        try {
          if (!cleaned && !mwIsSearchOpen()) clearStaleBlockers();
        } catch (_) {}
      }, 0);
    }

    function bindSearchOcclusion() {
      const onSearchEvent = () => {
        window.setTimeout(scheduleSearchSuppressionSync, 0);
      };

      const blurActiveSearchFocus = () => {
        try {
          const active = document.activeElement;
          if (active && active.blur && active.closest && active.closest('.md-search')) {
            active.blur();
          }
        } catch (_) {}
      };

      const onPageRestore = () => {
        const run = () => {
          mwClearStaleHeaderSearch({ bootOnly: true });
          blurActiveSearchFocus();
          scheduleSearchSuppressionSync();
          scheduleDockSync();
        };

        run();
        [0, 48, 120, 240, 420].forEach((delay) => {
          const id = window.setTimeout(run, delay);
          state.searchSyncTimers = Array.isArray(state.searchSyncTimers) ? state.searchSyncTimers : [];
          state.searchSyncTimers.push(id);
        });
      };

      const onVisibilityChange = () => {
        if (document.hidden) return;
        onPageRestore();
      };

      const toggle = mwGetSearchToggle();
      if (toggle && typeof toggle.addEventListener === 'function') {
        toggle.addEventListener('change', onSearchEvent);
        state.destroyers.push(() => {
          try { toggle.removeEventListener('change', onSearchEvent); } catch (_) {}
        });
      }

      document.addEventListener('focusin', onSearchEvent, true);
      document.addEventListener('focusout', onSearchEvent, true);
      document.addEventListener('click', onSearchEvent, true);
      document.addEventListener('keydown', onSearchEvent, true);
      window.addEventListener('pageshow', onPageRestore, true);
      document.addEventListener('visibilitychange', onVisibilityChange, true);

      state.destroyers.push(() => {
        try { document.removeEventListener('focusin', onSearchEvent, true); } catch (_) {}
        try { document.removeEventListener('focusout', onSearchEvent, true); } catch (_) {}
        try { document.removeEventListener('click', onSearchEvent, true); } catch (_) {}
        try { document.removeEventListener('keydown', onSearchEvent, true); } catch (_) {}
        try { window.removeEventListener('pageshow', onPageRestore, true); } catch (_) {}
        try { document.removeEventListener('visibilitychange', onVisibilityChange, true); } catch (_) {}
      });

      if (window.MutationObserver) {
        const obs = new MutationObserver(() => scheduleSearchSuppressionSync());
        const watch = [
          document.documentElement,
          document.body,
          ...Array.from(document.querySelectorAll('.md-search')),
          ...Array.from(document.querySelectorAll('input.md-toggle[data-md-toggle="search"], input#__search, #__search')),
        ].filter(Boolean);

        watch.forEach((node) => {
          try {
            obs.observe(node, { attributes: true, attributeFilter: ['class', 'checked', 'aria-expanded'] });
          } catch (_) {}
        });

        state.searchObserver = obs;
        state.destroyers.push(() => {
          try { if (state.searchObserver) state.searchObserver.disconnect(); } catch (_) {}
          state.searchObserver = null;
        });
      }

      // First-paint safety: clear stale desktop-search focus immediately instead
      // of waiting for pageshow/click. This keeps the widget hover/clickable from
      // the first frame after it is inserted.
      onPageRestore();
    }

    bindSearchOcclusion();
    installFirstInteractionRescue();

    const onScroll = () => {
      scheduleSearchSuppressionSync();
      scheduleDockSync();
    };
    const onResize = () => {
      try { state.anchorPageTop = 0; } catch (_) {}
      scheduleSearchSuppressionSync();
      scheduleDockSync();
    };
    const onMotion = () => {
      sync();
      scheduleDockSync();
    };

    // Mobile browsers/MkDocs layouts do not always scroll the window itself.
    // Some touch pages scroll an inner Material container, and iOS also moves
    // the visual viewport while the page is being dragged. Listen to all of
    // those signals so the full widget reliably collapses into the draggable
    // compact widget once the original anchor has passed the header.
    const mobileScrollTargets = [];
    const addMobileScrollTarget = (el) => {
      if (!el || typeof el.addEventListener !== "function") return;
      if (mobileScrollTargets.includes(el)) return;
      mobileScrollTargets.push(el);
      try { el.addEventListener("scroll", onScroll, { passive: true }); } catch (_) {}
    };

    addMobileScrollTarget(window);
    addMobileScrollTarget(document);
    addMobileScrollTarget(document.scrollingElement);
    addMobileScrollTarget(document.documentElement);
    addMobileScrollTarget(document.body);
    [
      ".md-container",
      ".md-main",
      ".md-main__inner",
      ".md-content",
      ".md-content__inner",
      "article.md-content__inner",
    ].forEach((sel) => {
      try { addMobileScrollTarget(document.querySelector(sel)); } catch (_) {}
    });

    let mobileDockWatchTimer = 0;
    let mobileDockWatchUntil = 0;
    const startMobileDockWatch = (durationMs) => {
      if (!mwIsTouchUi()) return;
      mobileDockWatchUntil = Math.max(mobileDockWatchUntil || 0, Date.now() + Math.max(600, Number(durationMs || 1800) || 1800));
      if (mobileDockWatchTimer) return;
      const tick = () => {
        mobileDockWatchTimer = 0;
        if (document.hidden) return;
        onScroll();
        if (Date.now() < mobileDockWatchUntil) mobileDockWatchTimer = window.setTimeout(tick, 220);
      };
      mobileDockWatchTimer = window.setTimeout(tick, 0);
    };

    // Capture scroll from any nested scroll container. This is the important
    // part for mobile where the event may not reach window.
    const onTouchScrollActivity = () => {
      onScroll();
      startMobileDockWatch(1800);
    };
    const onTouchPointerMove = (ev) => {
      if (ev && (ev.pointerType === "touch" || ev.pointerType === "pen")) onTouchScrollActivity();
    };

    try { document.addEventListener("scroll", onScroll, { passive: true, capture: true }); } catch (_) {}
    try { window.addEventListener("scrollend", onScroll, { passive: true }); } catch (_) {}
    try { document.addEventListener("touchstart", onTouchScrollActivity, { passive: true, capture: true }); } catch (_) {}
    try { document.addEventListener("touchmove", onTouchScrollActivity, { passive: true, capture: true }); } catch (_) {}
    try { document.addEventListener("touchend", onTouchScrollActivity, { passive: true, capture: true }); } catch (_) {}
    try { document.addEventListener("pointermove", onTouchPointerMove, { passive: true, capture: true }); } catch (_) {}
    try { window.visualViewport && window.visualViewport.addEventListener("scroll", onScroll, { passive: true }); } catch (_) {}
    try { window.visualViewport && window.visualViewport.addEventListener("resize", onResize, { passive: true }); } catch (_) {}
    try { window.addEventListener("orientationchange", onResize, { passive: true }); } catch (_) {}

    try {
      if (mwIsTouchUi()) {
        // Mobile Safari/Chrome can skip scroll events during momentum scrolling.
        // Use a short bounded watcher around first paint and touch activity instead
        // of a permanent 220ms interval, which was a steady battery drain.
        [0, 60, 150, 300, 600, 1000, 1600].forEach((delay) => {
          const id = window.setTimeout(onScroll, delay);
          state.searchSyncTimers = Array.isArray(state.searchSyncTimers) ? state.searchSyncTimers : [];
          state.searchSyncTimers.push(id);
        });
        startMobileDockWatch(1800);
      }
    } catch (_) {}

    window.addEventListener("resize", onResize);
    window.addEventListener("mk:site-motion-change", onMotion);
    window.addEventListener("mk:motionchange", onMotion);

    try {
      if (window.__mw_cmc_handler) {
        window.removeEventListener("conceptMasteryChanged", window.__mw_cmc_handler);
      }
    } catch (_) {}
    window.__mw_cmc_handler = () => sync();
    window.addEventListener("conceptMasteryChanged", window.__mw_cmc_handler);

    const onShopEffectChange = () => {
      mwInvalidateMasteryEffectCache();
      try { sync(); } catch (_) {}
    };
    window.addEventListener("mk-shop-inventory-change", onShopEffectChange);
    window.addEventListener("mk-shop-trial-change", onShopEffectChange);
    [240, 900, 1800, 3200].forEach((delay) => {
      try {
        const id = window.setTimeout(onShopEffectChange, delay);
        state.destroyers.push(() => { try { window.clearTimeout(id); } catch (_) {} });
      } catch (_) {}
    });

    const h1Scaffold = mwEnsureTitleScaffold();
    if (h1Scaffold && window.MutationObserver) {
      const obs = new MutationObserver(() => {
        if (state.flyAnimating) return;
        mwEnsureTitleScaffold();
        if (!state.hasExplicitRating) return;
        mwApplyTitleState(state.currentM, true, { animate: false });
      });
      obs.observe(h1Scaffold.h1, { childList: true, subtree: false });
      state.observer = obs;
      bindTitleBadgeMenu();
    }

    state.destroyers.push(() => {
      mobileScrollTargets.forEach((el) => {
        try { el.removeEventListener("scroll", onScroll); } catch (_) {}
      });
      try { document.removeEventListener("scroll", onScroll, true); } catch (_) {}
      try { window.removeEventListener("scrollend", onScroll); } catch (_) {}
      try { document.removeEventListener("touchstart", onTouchScrollActivity, true); } catch (_) {}
      try { document.removeEventListener("touchmove", onTouchScrollActivity, true); } catch (_) {}
      try { document.removeEventListener("touchend", onTouchScrollActivity, true); } catch (_) {}
      try { document.removeEventListener("pointermove", onTouchPointerMove, true); } catch (_) {}
      try { window.visualViewport && window.visualViewport.removeEventListener("scroll", onScroll); } catch (_) {}
      try { window.visualViewport && window.visualViewport.removeEventListener("resize", onResize); } catch (_) {}
      try { window.removeEventListener("orientationchange", onResize); } catch (_) {}
      try { if (mobileDockWatchTimer) window.clearTimeout(mobileDockWatchTimer); } catch (_) {}
      mobileDockWatchTimer = 0;
      mobileDockWatchUntil = 0;
    });
    state.destroyers.push(() => window.removeEventListener("resize", onResize));
    state.destroyers.push(() => window.removeEventListener("resize", onReadinessViewportChange, { passive: true }));
    state.destroyers.push(() => window.removeEventListener("scroll", onReadinessViewportChange, { passive: true }));
    state.destroyers.push(() => document.removeEventListener("pointerdown", onReadinessDocPointerDown, true));
    state.destroyers.push(() => { try { mwHideReadinessPopover(); } catch (_) {} });
    state.destroyers.push(() => { try { mwHideRecapPopover(); } catch (_) {} });
    state.destroyers.push(() => {
      try {
        const pop = state.readinessPopover || document.getElementById("mw-ready-popover");
        if (pop) pop.remove();
      } catch (_) {}
      try {
        const recapPop = state.recapPopover || document.getElementById("mw-recap-popover");
        if (recapPop) recapPop.remove();
      } catch (_) {}
    });
    state.destroyers.push(() => window.removeEventListener("mk:site-motion-change", onMotion));
    state.destroyers.push(() => window.removeEventListener("mk:motionchange", onMotion));
    state.destroyers.push(() => window.removeEventListener("mk-shop-inventory-change", onShopEffectChange));
    state.destroyers.push(() => window.removeEventListener("mk-shop-trial-change", onShopEffectChange));
    state.destroyers.push(() => {
      try {
        if (window.__mw_cmc_handler) {
          window.removeEventListener("conceptMasteryChanged", window.__mw_cmc_handler);
          window.__mw_cmc_handler = null;
        }
      } catch (_) {}
    });
    state.destroyers.push(() => {
      try { if (state.observer) state.observer.disconnect(); } catch (_) {}
    });
    state.destroyers.push(() => {
      try { if (state.raf) cancelAnimationFrame(state.raf); } catch (_) {}
      try { if (state.searchSyncRaf) cancelAnimationFrame(state.searchSyncRaf); } catch (_) {}
      try { if (state.searchCloseTimer) window.clearTimeout(state.searchCloseTimer); } catch (_) {}
      state.raf = 0;
      state.searchSyncRaf = 0;
      state.searchCloseTimer = 0;
    });
    state.destroyers.push(() => {
  try { box.remove(); } catch (_) {}
  try { compact.remove(); } catch (_) {}
  try { anchor.remove(); } catch (_) {}
});

    window.__mw_widget_cleanup = function () {
      const arr = state.destroyers.slice();
      state.destroyers.length = 0;
      arr.forEach((fn) => {
        try { fn(); } catch (_) {}
      });
      state.keepCollapsedDom = false;
      try { box.classList.remove("mw-docked", "mw-source-hidden", "mw-needs-rating", "mw-reduced-motion", "mw-managed-to-title", "mw-dismissed"); } catch (_) {}
      try { compact.classList.remove("mw-dragging", "is-visible", "mw-dismissed"); } catch (_) {}
      try { mwCloseTitleMenu(); } catch (_) {}
      try { mwClearFlyGhosts(); } catch (_) {}
    };
  }



  // ===== Random review panel + AI-test mode glue =====
  const MW_RANDOM_CANDIDATES_KEY = "random_custom_candidates_v1";
  const MW_RANDOM_SOURCE_PAGE_KEY = "random_custom_page_v1";
  const MW_RANDOM_NAV_FLAG = "random_custom_nav_flag_v1";
  const MW_SELF_TEST_MODE_KEY = "random_review_mode_v1";
  const MW_SELF_TEST_NAV_FLAG = "random_review_nav_flag_v1";
  const MW_RANDOM_MODE_KEY = "random_review_mode_kind_v1"; // normal | self | ai
  const MW_RANDOM_AI_NAV_FLAG = "random_ai_nav_flag_v1";
  const MW_RANDOM_AI_OPENED_KEY = "random_ai_opened_arrival_v1";
  const MW_RANDOM_AI_FOLD_AFTER_KEY = "random_ai_fold_after_check_v1"; // legacy, no longer shown
  const MW_RANDOM_AI_ONLY_UNTESTED_KEY = "random_ai_only_untested_after_check_v1";
  const MW_RANDOM_AI_ENTRY_URL_KEY = "random_ai_entry_url_v1";
  const MW_RANDOM_AI_SOURCE_KEY = "random_ai_source_v1";
  const MW_RANDOM_ARRIVAL_ID_KEY = "random_arrival_id_v1";
  const MW_RANDOM_ARRIVAL_LOC_KEY = "random_arrival_loc_v1";

  function mwRandomEnsureStyles() {
    if (document.getElementById("mw-random-session-style-v1")) return;
    const st = document.createElement("style");
    st.id = "mw-random-session-style-v1";
    st.textContent = `
      .mw-random-session-panel{
        --mw-random-panel-border: var(--md-default-fg-color--lightest);
        --mw-random-mode-normal: rgb(96 165 250);
        --mw-random-mode-self: rgb(251 113 133);
        --mw-random-mode-ai: rgb(192 132 252);
        --mw-random-current-color: var(--mw-random-mode-normal);
        --mw-random-target-color: var(--mw-random-mode-ai);
        margin: 0 0 26px 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-sizing: border-box;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      html[data-md-color-scheme="default"] .mw-random-session-panel,
      body[data-md-color-scheme="default"] .mw-random-session-panel{
        --mw-random-mode-normal: rgb(37 99 235);
        --mw-random-mode-self: rgb(220 38 38);
        --mw-random-mode-ai: rgb(126 34 206);
      }
      html[data-md-color-scheme="slate"] .mw-random-session-panel,
      body[data-md-color-scheme="slate"] .mw-random-session-panel{
        --mw-random-mode-normal: rgb(96 165 250);
        --mw-random-mode-self: rgb(251 113 133);
        --mw-random-mode-ai: rgb(192 132 252);
      }
      .mw-random-session-main{
        display:flex;
        flex-wrap:wrap;
        justify-content:flex-start;
        align-items:center;
        gap: 14px 24px;
        width:100%;
      }
      .mw-random-session-main > *{
        flex:0 0 auto;
        min-width:0;
      }
      .mw-random-session-btn,
      .mw-random-mode-btn{
        appearance:none;
        border: 1px solid var(--md-default-fg-color--lightest);
        background: rgba(255,255,255,.04);
        color: var(--mw-title-plain-ink, inherit);
        border-radius: 999px;
        min-height: 42px;
        padding: 8px 14px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        line-height:1;
        font: inherit;
        font-size: 13px;
        font-weight: 650;
        white-space: nowrap;
        cursor:pointer;
        box-sizing:border-box;
        max-width:100%;
        text-decoration:none !important;
      }
      .mw-random-session-btn:hover,
      .mw-random-mode-btn:hover{
        background: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 14%, rgba(255,255,255,.08));
        border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 42%, var(--md-default-fg-color--lightest));
        box-shadow: 0 8px 18px rgba(0,0,0,.12), 0 0 0 1px color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 14%, transparent);
        transform: translateY(-1px);
      }
      .mw-random-session-btn--primary{
        width:max-content;
        min-width:0;
        background: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 22%, rgba(255,255,255,.05));
        border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 48%, var(--md-default-fg-color--lightest));
      }
      .mw-random-session-btn[disabled]{
        opacity:.48;
        cursor:not-allowed;
        transform:none !important;
        box-shadow:none !important;
      }
      .mw-random-mode-switch{
        display:flex;
        align-items:center;
        justify-content:flex-start;
        min-width:0;
      }
      .mw-random-mode-btn{
        width: auto;
        min-width: 0;
        min-height: 42px;
        padding: 8px 14px;
        font-size:13px;
        font-weight:650;
        opacity:.96;
        background: color-mix(in srgb, var(--mw-random-current-color) 16%, rgba(255,255,255,.04));
        border-color: color-mix(in srgb, var(--mw-random-current-color) 46%, var(--md-default-fg-color--lightest));
      }
      .mw-random-mode-btn[data-current-mode="normal"]{ --mw-random-current-color: var(--mw-random-mode-normal); }
      .mw-random-mode-btn[data-current-mode="self"]{ --mw-random-current-color: var(--mw-random-mode-self); }
      .mw-random-mode-btn[data-current-mode="ai"]{ --mw-random-current-color: var(--mw-random-mode-ai); }
      .mw-random-mode-btn[data-target-mode="normal"]{ --mw-random-target-color: var(--mw-random-mode-normal); }
      .mw-random-mode-btn[data-target-mode="self"]{ --mw-random-target-color: var(--mw-random-mode-self); }
      .mw-random-mode-btn[data-target-mode="ai"]{ --mw-random-target-color: var(--mw-random-mode-ai); }
      .mw-random-mode-prefix,
      .mw-random-mode-target{
        transition: color .16s ease;
      }
      @media (hover: hover) and (pointer: fine){
        .mw-random-mode-btn:hover{
          background: color-mix(in srgb, var(--mw-random-current-color) 22%, rgba(255,255,255,.06));
          border-color: color-mix(in srgb, var(--mw-random-current-color) 58%, var(--md-default-fg-color--lightest));
        }
        .mw-random-mode-btn:hover .mw-random-mode-prefix{
          color: inherit;
        }
        .mw-random-mode-btn:hover .mw-random-mode-target{
          color: var(--mw-random-target-color);
        }
      }
      .mw-random-session-ico{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:18px;
        height:18px;
        flex:0 0 auto;
      }
      .mw-random-session-ico svg{
        display:block;
        width:18px;
        height:18px;
      }
      .mw-random-label-short{ display:none; }
      .mw-random-label-full{ display:inline; }
      .mw-random-ai-actions{
        display:flex !important;
        justify-content:flex-end !important;
        align-items:center !important;
        gap:10px !important;
        flex-wrap:wrap !important;
      }
      .mw-random-ai-result-actions{
        display:flex !important;
        justify-content:flex-end !important;
        align-items:center !important;
        gap:10px !important;
        flex-wrap:wrap !important;
      }
      .mw-random-ai-result-actions .aiq-btn{
        white-space:nowrap;
      }
      .mw-random-ai-untested{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        min-height:36px;
        padding:6px 10px;
        border:1px solid var(--md-default-fg-color--lightest);
        border-radius:999px;
        font-size:12px;
        font-weight:650;
        line-height:1.15;
        opacity:.92;
        cursor:pointer;
        user-select:none;
        background:rgba(255,255,255,.035);
      }
      .mw-random-ai-untested input{
        width:15px;
        height:15px;
        margin:0;
        accent-color: var(--md-accent-fg-color, var(--md-primary-fg-color));
      }
      .mw-random-ai-try{ order:1; }
      .mw-random-ai-accept{ order:2; }
      @media (max-width: 720px){
        .mw-random-session-panel{
          margin-top:12px;
          margin-bottom:22px;
          padding: 0;
        }
        .mw-random-session-main{
          display:flex;
          flex-wrap:nowrap;
          align-items:center;
          justify-content:space-between;
          gap:6px;
          width:100%;
        }
        .mw-random-session-main > *{
          justify-self:auto !important;
          flex:0 0 auto;
        }
        .mw-random-session-btn,
        .mw-random-mode-btn{
          min-width:0;
          width:auto;
          min-height:38px;
          padding:8px 8px;
          font-size:12px;
          gap:5px;
        }
        .mw-random-session-btn--primary{
          width:auto;
        }
        .mw-random-mode-switch{
          justify-content:center;
          min-width:0;
        }
        .mw-random-session-ico{
          width:16px;
          height:16px;
          flex:0 0 16px;
        }
        .mw-random-session-ico svg{
          width:16px;
          height:16px;
        }
        .mw-random-label-full{ display:none; }
        .mw-random-label-short{ display:inline; }
        .mw-random-mode-btn .mw-random-mode-target{ color: var(--mw-random-target-color); }
        .mw-random-ai-result-actions{
          justify-content:flex-start !important;
        }
        .mw-random-ai-result-actions .aiq-btn{
          flex:1 1 auto;
          min-width:min(100%, 168px);
        }
        .mw-random-ai-untested{
          flex:1 1 100%;
          justify-content:flex-start;
          font-size:12px;
        }
      }
      @media (max-width: 360px){
        .mw-random-session-main{ gap:4px; }
        .mw-random-session-btn,
        .mw-random-mode-btn{
          padding-inline:6px;
          font-size:11.5px;
          gap:4px;
        }
        .mw-random-session-ico{
          width:15px;
          height:15px;
          flex-basis:15px;
        }
        .mw-random-session-ico svg{
          width:15px;
          height:15px;
        }
      }
    `.trim();
    document.head.appendChild(st);
  }

  function mwRandomSvg(name) {
    const common = 'width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"';
    const stroke = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    if (name === "dice") return `<svg ${common} ${stroke}><rect x="4.5" y="4.5" width="15" height="15" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/></svg>`;
    if (name === "switch") return `<svg ${common} ${stroke}><path d="M7 7h11"/><path d="M15 4l3 3-3 3"/><path d="M17 17H6"/><path d="M9 14l-3 3 3 3"/></svg>`;
    if (name === "exit") return `<svg ${common} ${stroke}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`;
    if (name === "edit") return `<svg ${common} ${stroke}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
    return "";
  }

  function mwRandomReadCandidates() {
    try {
      const raw = sessionStorage.getItem(MW_RANDOM_CANDIDATES_KEY) || "";
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map((x) => String(x || "")).filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }

  function mwRandomNormPathForSession(loc) {
    return String(loc || "").split("#")[0].replace(/^\/+/, "").replace(/\/+$/g, "").replace(/\/index\.html$/i, "");
  }

  function mwRandomIsActiveOnCurrentPage() {
    // The random control panel is a session panel, not a normal concept-page widget.
    // It should appear only on a page that was actually reached by Start/Continue random.
    // Candidate lists may remain in sessionStorage after editing filters or normal browsing,
    // so candidates alone are intentionally not enough to show the panel.
    try {
      const current = mwRandomNormPathForSession(currentRelPath());
      const arrival = mwRandomNormPathForSession(sessionStorage.getItem(MW_RANDOM_ARRIVAL_LOC_KEY) || "");
      return !!(current && arrival && current === arrival);
    } catch (_) {
      return false;
    }
  }

  function mwRandomReadMode() {
    try {
      const raw = String(sessionStorage.getItem(MW_RANDOM_MODE_KEY) || "").toLowerCase();
      if (raw === "ai" || raw === "self" || raw === "normal") return raw;
      return sessionStorage.getItem(MW_SELF_TEST_MODE_KEY) === "1" ? "self" : "normal";
    } catch (_) {
      return "normal";
    }
  }

  function mwRandomSetMode(mode) {
    const m = (mode === "ai" || mode === "self") ? mode : "normal";
    try {
      sessionStorage.setItem(MW_RANDOM_MODE_KEY, m);
      if (m === "self") sessionStorage.setItem(MW_SELF_TEST_MODE_KEY, "1");
      else sessionStorage.removeItem(MW_SELF_TEST_MODE_KEY);
      if (m !== "ai") sessionStorage.removeItem(MW_RANDOM_AI_NAV_FLAG);
    } catch (_) {}
    try { mwRandomRenderPanel(); } catch (_) {}
  }

  function mwRandomAbsoluteUrl(loc) {
    const raw = String(loc || "").trim();
    if (!raw) return "";
    try {
      if (/^[a-z]+:\/\//i.test(raw)) return new URL(raw).toString();
    } catch (_) {}
    try {
      return new URL(raw.replace(/^\.\//, "").replace(/^\/+/, ""), getSiteRootUrl()).toString();
    } catch (_) {
      try { return new URL(raw, document.baseURI).toString(); } catch (_) { return raw; }
    }
  }

  function mwRandomPickNext() {
    const candidates = mwRandomReadCandidates();
    if (!candidates.length) return "";
    const cur = mwRandomNormPathForSession(currentRelPath());
    const pool = candidates.filter((x) => mwRandomNormPathForSession(x) !== cur);
    const src = pool.length ? pool : candidates;
    return src[Math.floor(Math.random() * src.length)] || "";
  }

  function mwRandomArmNavigation(targetLoc) {
    const mode = mwRandomReadMode();
    try { sessionStorage.setItem(MW_RANDOM_NAV_FLAG, "1"); } catch (_) {}
    try {
      if (mode === "self") {
        sessionStorage.setItem(MW_SELF_TEST_MODE_KEY, "1");
        sessionStorage.setItem(MW_SELF_TEST_NAV_FLAG, "1");
        sessionStorage.removeItem(MW_RANDOM_AI_NAV_FLAG);
      } else if (mode === "ai") {
        sessionStorage.removeItem(MW_SELF_TEST_MODE_KEY);
        sessionStorage.removeItem(MW_SELF_TEST_NAV_FLAG);
        sessionStorage.setItem(MW_RANDOM_AI_NAV_FLAG, "1");
      } else {
        sessionStorage.removeItem(MW_SELF_TEST_MODE_KEY);
        sessionStorage.removeItem(MW_SELF_TEST_NAV_FLAG);
        sessionStorage.removeItem(MW_RANDOM_AI_NAV_FLAG);
      }
    } catch (_) {}
    try {
      const arrivalId = String(Date.now()) + "_" + Math.random().toString(16).slice(2);
      sessionStorage.setItem(MW_RANDOM_ARRIVAL_ID_KEY, arrivalId);
      sessionStorage.setItem(MW_RANDOM_ARRIVAL_LOC_KEY, mwRandomNormPathForSession(targetLoc));
    } catch (_) {}
  }

  function mwRandomContinue(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    const next = mwRandomPickNext();
    if (!next) return;
    mwRandomArmNavigation(next);
    const href = mwRandomAbsoluteUrl(next);
    if (href) window.location.href = href;
  }

  function mwRandomExit(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    [
      MW_RANDOM_CANDIDATES_KEY,
      MW_RANDOM_SOURCE_PAGE_KEY,
      MW_RANDOM_NAV_FLAG,
      MW_SELF_TEST_NAV_FLAG,
      MW_RANDOM_AI_NAV_FLAG,
      MW_RANDOM_ARRIVAL_ID_KEY,
      MW_RANDOM_ARRIVAL_LOC_KEY,
      MW_RANDOM_AI_OPENED_KEY
    ].forEach((k) => { try { sessionStorage.removeItem(k); } catch (_) {} });
    try { sessionStorage.setItem(MW_RANDOM_MODE_KEY, "normal"); } catch (_) {}
    try { sessionStorage.removeItem(MW_SELF_TEST_MODE_KEY); } catch (_) {}
    try { mwRandomRenderPanel(); } catch (_) {}
  }

  function mwRandomEditFilter(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    let href = "";
    try { href = sessionStorage.getItem(MW_RANDOM_SOURCE_PAGE_KEY) || ""; } catch (_) {}
    if (!href) href = mwRandomAbsoluteUrl("find.html");
    if (href) window.location.href = href;
  }

  function mwRandomHideLegacyPanels() {
    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;
    try {
      inner.querySelectorAll("div, section, aside").forEach((el) => {
        if (!el || el.id === "mw-random-session-panel" || el.closest("#mw-random-session-panel")) return;
        const txt = String(el.textContent || "").replace(/\s+/g, " ").trim();
        if (!txt) return;
        const looksNative = /Continue\s+random/i.test(txt) && /Edit\s+filter/i.test(txt);
        if (!looksNative) return;
        if (el.matches && (el.matches("article.md-content__inner") || el.matches(".md-content__inner"))) return;
        el.setAttribute("data-mw-random-native-hidden", "1");
        el.style.setProperty("display", "none", "important");
      });
    } catch (_) {}
  }

  function mwRandomPanelHtml() {
    const mode = mwRandomReadMode();
    const candidates = mwRandomReadCandidates();
    const disabled = candidates.length ? "" : "disabled";
    const nextMode = mode === "normal" ? "ai" : (mode === "ai" ? "self" : "normal");
    const nextName = nextMode === "ai" ? "AI-test" : (nextMode === "self" ? "Self-test" : "Normal");
    const nextShortLabel = nextName;
    return `
      <div class="mw-random-session-main">
        <button type="button" class="mw-random-session-btn mw-random-session-btn--primary" data-mw-random-continue="1" ${disabled}>
          <span class="mw-random-session-ico">${mwRandomSvg("dice")}</span>
          <span class="mw-random-label-full">Continue random</span>
          <span class="mw-random-label-short">Continue</span>
        </button>
        <div class="mw-random-mode-switch" aria-label="Random review mode">
          <button type="button" class="mw-random-mode-btn" data-mw-random-mode="${nextMode}" data-current-mode="${mode}" data-target-mode="${nextMode}">
            <span class="mw-random-session-ico">${mwRandomSvg("switch")}</span>
            <span class="mw-random-label-full"><span class="mw-random-mode-prefix">Switch to </span><span class="mw-random-mode-target">${nextName}</span></span>
            <span class="mw-random-label-short mw-random-mode-target">${nextShortLabel}</span>
          </button>
        </div>
        <button type="button" class="mw-random-session-btn" data-mw-random-edit="1">
          <span class="mw-random-session-ico">${mwRandomSvg("edit")}</span>
          <span class="mw-random-label-full">Edit filter</span>
          <span class="mw-random-label-short">Edit</span>
        </button>
        <button type="button" class="mw-random-session-btn" data-mw-random-exit="1">
          <span class="mw-random-session-ico">${mwRandomSvg("exit")}</span>
          <span>Exit</span>
        </button>
      </div>
    `;
  }

  function mwRandomRenderPanel() {
    mwRandomEnsureStyles();
    const candidates = mwRandomReadCandidates();
    let panel = document.getElementById("mw-random-session-panel");
    const rel = currentRelPath();
    if (!candidates.length || !isConceptPage(rel) || !mwRandomIsActiveOnCurrentPage()) {
      if (panel) panel.remove();
      return;
    }
    mwRandomHideLegacyPanels();
    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "mw-random-session-panel";
      panel.className = "mw-random-session-panel md-typeset";
    }
    const panelHtml = mwRandomPanelHtml();
    if (panel.__mwRandomLastHtml !== panelHtml) {
      panel.innerHTML = panelHtml;
      panel.__mwRandomLastHtml = panelHtml;
    }
    const mastery = document.getElementById("mw-mastery");
    const anchor = inner.querySelector(":scope > .mw-anchor");
    if (mastery && mastery.parentNode) {
      if (mastery.nextElementSibling !== panel) mastery.insertAdjacentElement("afterend", panel);
    } else if (anchor && anchor.parentNode === inner) {
      // When the mastery widget is hidden by default, only the collapsed line anchor exists.
      // Keep the random controls after that line, not between the H1 and the collapsed line.
      if (anchor.nextElementSibling !== panel) anchor.insertAdjacentElement("afterend", panel);
    } else {
      const h1 = inner.querySelector("h1");
      if (h1 && h1.parentNode === inner) h1.insertAdjacentElement("afterend", panel);
      else inner.insertAdjacentElement("afterbegin", panel);
    }
    if (panel.dataset.mwRandomBound !== "1") {
      panel.dataset.mwRandomBound = "1";
      panel.addEventListener("click", (ev) => {
        const cont = ev.target && ev.target.closest ? ev.target.closest("[data-mw-random-continue='1']") : null;
        if (cont && panel.contains(cont)) return mwRandomContinue(ev);
        const exit = ev.target && ev.target.closest ? ev.target.closest("[data-mw-random-exit='1']") : null;
        if (exit && panel.contains(exit)) return mwRandomExit(ev);
        const edit = ev.target && ev.target.closest ? ev.target.closest("[data-mw-random-edit='1']") : null;
        if (edit && panel.contains(edit)) return mwRandomEditFilter(ev);
        const modeBtn = ev.target && ev.target.closest ? ev.target.closest("[data-mw-random-mode]") : null;
        if (modeBtn && panel.contains(modeBtn)) {
          ev.preventDefault();
          ev.stopPropagation();
          mwRandomSetMode(modeBtn.getAttribute("data-mw-random-mode") || "normal");
        }
      });
    }
  }

  function mwRandomTryApplyFoldPreference(fold) {
    const shouldFold = !!fold;
    // Unchecked means: leave the page exactly as it is. The old implementation
    // treated false as "open every <details> element", which is very expensive on
    // large concept pages and is the main reason the page can freeze right after
    // accepting a Random AI Quiz result from the top Explore menu.
    if (!shouldFold) {
      try {
        const inner = document.querySelector("article.md-content__inner");
        if (inner) {
          inner.classList.remove("random-ai-folded-sections");
          inner.classList.remove("random-ai-open-sections");
        }
      } catch (_) {}
      return false;
    }
    try {
      window.dispatchEvent(new CustomEvent("random:fold-sections-request", { detail: { folded: true, source: "ai-test-mode" } }));
    } catch (_) {}
    const candidates = [
      ["RandomFold", "setFolded"],
      ["RandomFold", "apply"],
      ["RandomReview", "setFolded"],
      ["MkRandomFold", "setFolded"],
      ["MkRandomFold", "apply"],
      ["__randomFold", "setFolded"],
      ["__randomFold", "apply"],
      ["__mkRandomFold", "setFolded"],
      ["__mkRandomFold", "apply"]
    ];
    for (const [objName, fnName] of candidates) {
      try {
        const obj = window[objName];
        if (obj && typeof obj[fnName] === "function") {
          obj[fnName](true);
          return true;
        }
      } catch (_) {}
    }
    try {
      if (typeof window.__randomFoldApply === "function") {
        window.__randomFoldApply(true);
        return true;
      }
    } catch (_) {}
    try {
      const inner = document.querySelector("article.md-content__inner");
      if (inner) {
        inner.querySelectorAll("details").forEach((d) => { d.open = false; });
        inner.classList.add("random-ai-folded-sections");
        inner.classList.remove("random-ai-open-sections");
      }
    } catch (_) {}
    return false;
  }

  function mwRandomTopAiSource() {
    try { return String(sessionStorage.getItem(MW_RANDOM_AI_SOURCE_KEY) || "").toLowerCase(); } catch (_) { return ""; }
  }

  function mwRandomIsTopMenuAiQuizSession() {
    const mode = mwRandomReadMode();
    if (mode !== "ai") return false;
    const source = mwRandomTopAiSource();
    if (source === "ai" || source === "ai-untested" || source === "random-ai" || source === "random-ai-untested") return true;
    try { if (sessionStorage.getItem(MW_RANDOM_AI_ENTRY_URL_KEY)) return true; } catch (_) {}
    return false;
  }

  function mwRandomReadOnlyUntestedPreference() {
    try {
      const saved = sessionStorage.getItem(MW_RANDOM_AI_ONLY_UNTESTED_KEY);
      if (saved === "1") return true;
      if (saved === "0") return false;
    } catch (_) {}
    return /untested/.test(mwRandomTopAiSource());
  }

  function mwRandomWriteOnlyUntestedPreference(value) {
    try { sessionStorage.setItem(MW_RANDOM_AI_ONLY_UNTESTED_KEY, value ? "1" : "0"); } catch (_) {}
  }

  function mwRandomBuildAiEntryUrl(onlyUntested) {
    const modeParam = onlyUntested ? "ai-untested" : "ai-quiz";
    let raw = "";
    try { raw = sessionStorage.getItem(MW_RANDOM_AI_ENTRY_URL_KEY) || ""; } catch (_) { raw = ""; }
    let url = null;
    try { url = raw ? new URL(raw, getSiteRootUrl()) : null; } catch (_) { url = null; }
    if (!url) {
      try { url = new URL("random/", getSiteRootUrl()); } catch (_) { url = null; }
    }
    if (!url) return "";
    try { url.searchParams.set("mode", modeParam); } catch (_) {}
    try { url.hash = ""; } catch (_) {}
    return url.toString();
  }

  function mwRandomAiApi() {
    try { return window.AIMCQQuiz || window.AIQQuiz || null; } catch (_) { return null; }
  }

  function mwRandomCloseAiModal(saveMastery) {
    const api = mwRandomAiApi();
    if (saveMastery) {
      try {
        if (api && typeof api.acceptSuggestedMastery === "function") {
          const ok = api.acceptSuggestedMastery();
          if (ok !== false) return true;
        }
      } catch (_) {}
      try {
        const btn = document.querySelector("#aiq-modal .aiq-accept, [role='dialog'][aria-modal='true'] .aiq-accept");
        if (btn && !btn.disabled) {
          btn.click();
          return true;
        }
      } catch (_) {}
    }
    try {
      if (api && typeof api.close === "function") {
        api.close();
        return true;
      }
    } catch (_) {}
    try {
      const btn = document.querySelector("#aiq-modal .aiq-close, #aiq-modal .aiq-close-result, [role='dialog'][aria-modal='true'] .aiq-close, [role='dialog'][aria-modal='true'] .aiq-close-result");
      if (btn) {
        btn.click();
        return true;
      }
    } catch (_) {}
    try {
      const modal = document.getElementById("aiq-modal") || document.querySelector("[role='dialog'][aria-modal='true']");
      if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
      document.documentElement.classList.remove("aiq-modal-open");
      document.body.classList.remove("aiq-modal-open");
      return true;
    } catch (_) {}
    return false;
  }

  function mwRandomEnterCurrentConcept(saveMastery) {
    mwRandomCloseAiModal(!!saveMastery);
    window.setTimeout(() => {
      try { mwRandomExit(null); } catch (_) {}
    }, saveMastery ? 140 : 40);
  }

  function mwRandomContinueNextAiQuiz(saveMastery, onlyUntested) {
    mwRandomWriteOnlyUntestedPreference(!!onlyUntested);
    try { sessionStorage.setItem(MW_RANDOM_AI_SOURCE_KEY, onlyUntested ? "ai-untested" : "ai"); } catch (_) {}
    const href = mwRandomBuildAiEntryUrl(!!onlyUntested);
    mwRandomCloseAiModal(!!saveMastery);
    window.setTimeout(() => {
      if (href) window.location.href = href;
    }, saveMastery ? 180 : 60);
  }

  function mwRandomInjectAiResultPreference(root) {
    const scope = root && root.querySelector ? root : document;

    const btnText = (btn) => String((btn && btn.textContent) || "").replace(/\s+/g, " ").trim();
    const buttons = (() => {
      try { return Array.from(scope.querySelectorAll("button")); } catch (_) { return []; }
    })();

    const acceptBtn = buttons.find((b) => /^Accept\s+level$/i.test(btnText(b))) || null;
    const tryBtn = buttons.find((b) => /^Try\s+again$/i.test(btnText(b))) || null;
    const closeBtn = buttons.find((b) => /^Close$/i.test(btnText(b))) || null;
    const actionRow = (acceptBtn && acceptBtn.parentElement) || (tryBtn && tryBtn.parentElement) || (closeBtn && closeBtn.parentElement) || null;
    if (!actionRow) return;

    let host = null;
    try {
      let cur = actionRow;
      while (cur && cur !== document.body && cur !== document.documentElement) {
        const txt = String(cur.textContent || "").replace(/\s+/g, " ");
        if (/Suggested\s+level\s*:/i.test(txt) && (/Accept\s+level/i.test(txt) || /Try\s+again/i.test(txt))) {
          host = cur;
        }
        cur = cur.parentElement;
      }
    } catch (_) {}
    if (!host) return;

    try {
      const legacy = scope.querySelector(".mw-random-ai-aftercheck");
      if (legacy) legacy.remove();
    } catch (_) {}

    // Only replace the AI result actions for a quiz reached from the top Explore
    // menu's Random AI Quiz / Random Untested AI Quiz entries.  Normal concept-page
    // AI quizzes keep their original Accept / Try again / Close controls.
    if (!mwRandomIsTopMenuAiQuizSession()) return;

    if (actionRow.dataset.mwRandomAiActions === "v19") return;
    actionRow.dataset.mwRandomAiActions = "v19";
    try { actionRow.classList.add("mw-random-ai-result-actions"); } catch (_) {}

    const onlyUntested = mwRandomReadOnlyUntestedPreference();
    actionRow.innerHTML = `
      <button type="button" class="aiq-btn primary" data-mw-random-ai-action="accept-enter">Accept & open concept</button>
      <button type="button" class="aiq-btn" data-mw-random-ai-action="reject-next">Reject & next AI quiz</button>
      <button type="button" class="aiq-btn primary" data-mw-random-ai-action="accept-next">Accept & next AI quiz</button>
      <label class="mw-random-ai-untested"><input type="checkbox" ${onlyUntested ? "checked" : ""}> <span>Only untested AI quizzes</span></label>
    `;

    const tick = actionRow.querySelector(".mw-random-ai-untested input");
    if (tick) {
      tick.addEventListener("change", () => mwRandomWriteOnlyUntestedPreference(!!tick.checked));
    }

    actionRow.addEventListener("click", (ev) => {
      const btn = ev.target && ev.target.closest ? ev.target.closest("[data-mw-random-ai-action]") : null;
      if (!btn || !actionRow.contains(btn)) return;
      ev.preventDefault();
      ev.stopPropagation();
      try { if (ev.stopImmediatePropagation) ev.stopImmediatePropagation(); } catch (_) {}
      const action = btn.getAttribute("data-mw-random-ai-action") || "";
      const checked = !!(tick && tick.checked);
      try { btn.disabled = true; } catch (_) {}
      if (action === "accept-enter") return mwRandomEnterCurrentConcept(true);
      if (action === "reject-next") return mwRandomContinueNextAiQuiz(false, checked);
      if (action === "accept-next") return mwRandomContinueNextAiQuiz(true, checked);
    }, { capture: true });
  }

  function mwRandomInstallAiResultObserver() {
    if (window.__mwRandomAiResultObserverInstalled) return;
    window.__mwRandomAiResultObserverInstalled = true;
    mwRandomEnsureStyles();
    let sawResult = false;
    let closeTimer = 0;
    let raf = 0;
    const aiResultStillOpen = () => {
      try {
        const modal = document.getElementById("aiq-modal") || document.querySelector("[role='dialog'][aria-modal='true']");
        if (!modal || !modal.isConnected) return false;
        const txt = String(modal.textContent || "").replace(/\s+/g, " ");
        return /AI\s+(concept|mastery)\s+check/i.test(txt) && (/Accept\s+level/i.test(txt) || /Suggested\s+level/i.test(txt));
      } catch (_) { return false; }
    };
    const onMaybeResultNow = () => {
      try {
        const mode = mwRandomReadMode();
        if (mode !== "ai") return;
        const before = !!document.querySelector(".mw-random-ai-result-actions");
        const modal = document.getElementById("aiq-modal") || document.querySelector("[role='dialog'][aria-modal='true']");
        if (modal) mwRandomInjectAiResultPreference(modal);
        if (!before && document.querySelector(".mw-random-ai-result-actions")) sawResult = true;
        if (!sawResult) return;
        if (aiResultStillOpen()) return;
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          closeTimer = 0;
          // The old Random AI Quiz flow optionally folded the whole concept page here.
          // That control has been removed; after a result closes, leave the page exactly
          // as it is and keep the chosen action responsible for any navigation.
          sawResult = false;
        }, 80);
      } catch (_) {}
    };
    const onMaybeResult = () => {
      if (raf) return;
      try {
        raf = requestAnimationFrame(() => {
          raf = 0;
          onMaybeResultNow();
        });
      } catch (_) {
        raf = 0;
        onMaybeResultNow();
      }
    };
    try {
      const obs = new MutationObserver(onMaybeResult);
      const root = document.body || document.documentElement;
      obs.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "class", "style"] });
      window.__mwRandomAiResultObserver = obs;
    } catch (_) {}
    [60, 180, 420, 900, 1600].forEach((t) => setTimeout(onMaybeResult, t));
  }

  function mwRandomAutoOpenAiCheck() {
    const mode = mwRandomReadMode();
    if (mode !== "ai") return;
    let shouldOpen = false;
    try { shouldOpen = sessionStorage.getItem(MW_RANDOM_AI_NAV_FLAG) === "1"; } catch (_) {}
    if (!shouldOpen) return;
    const arrival = (() => { try { return sessionStorage.getItem(MW_RANDOM_ARRIVAL_ID_KEY) || currentRelPath(); } catch (_) { return currentRelPath(); } })();
    try {
      if (sessionStorage.getItem(MW_RANDOM_AI_OPENED_KEY) === arrival) return;
      sessionStorage.setItem(MW_RANDOM_AI_OPENED_KEY, arrival);
      sessionStorage.removeItem(MW_RANDOM_AI_NAV_FLAG);
    } catch (_) {}

    const openOnce = () => {
      try {
        const api = mwGetAiQuizApi();
        if (api && typeof api.open === "function" && (typeof api.isAvailable !== "function" || api.isAvailable())) {
          const out = mwOpenAiQuizWithHistoryRepair(api, { source: "random-ai-mode" });
          if (out && typeof out.catch === "function") out.catch(() => {});
          return true;
        }
      } catch (_) {}
      return false;
    };

    if (openOnce()) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (openOnce() || tries >= 24) {
        clearInterval(timer);
      }
    }, 250);
    const onReady = () => { if (openOnce()) { try { window.removeEventListener("aiq:ready", onReady); } catch (_) {} } };
    try { window.addEventListener("aiq:ready", onReady); } catch (_) {}
  }

  function mwRandomSessionBoot() {
    mwRandomRenderPanel();
    mwRandomInstallAiResultObserver();
    mwRandomAutoOpenAiCheck();
    try {
      if (!window.__mwRandomPanelObserverInstalled && window.MutationObserver) {
        window.__mwRandomPanelObserverInstalled = true;
        let raf = 0;
        const obs = new MutationObserver(() => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            try { mwRandomHideLegacyPanels(); } catch (_) {}
            try { mwRandomRenderPanel(); } catch (_) {}
          });
        });
        obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        window.__mwRandomPanelObserver = obs;
      }
    } catch (_) {}
  }

  function mwEmitWidgetReady(){try{window.__mkMasteryWidgetReadyRel=String(location.pathname||"");window.dispatchEvent(new CustomEvent("mk:mastery-widget-ready",{detail:{pathname:location.pathname||""}}));window.dispatchEvent(new CustomEvent("mw:widget-ready",{detail:{pathname:location.pathname||""}}));if(window.__mkUnifiedFirstPaintProbe)window.__mkUnifiedFirstPaintProbe();}catch(_){}}

  function boot() {
    // Hold the first-boot preload reveal across this synchronous, above-the-fold
    // widget injection so the page is not shown before the mastery widget lands
    // under the H1. The hold is a no-op after reveal and is always released, so
    // it can never strand the page hidden (see preload-guard.js __rkHold).
    var __rkHoldToken = null;
    try { __rkHoldToken = window.__rkHold ? window.__rkHold("mastery-widget") : null; } catch (_) {}
    try { mwClearFlyGhosts(); } catch (_) {}
    try { renderWidget(); }
    finally {
      try { mwScheduleHeadingArtifactCleanup(); } catch (_) {} try { mwRandomSessionBoot(); } catch (_) {} mwEmitWidgetReady();
      if (__rkHoldToken) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            try { window.__rkRelease(__rkHoldToken); } catch (_) {}
          });
        });
      }
    }
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => boot());
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
