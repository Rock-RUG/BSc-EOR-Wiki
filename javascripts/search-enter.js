(function () {
  try { window.__searchEnterVersion = "v8-same-find-inplace-no-preload"; } catch (_) {}
  /**
   * search-enter.js (rewritten, v7 robust same-page top-search guard)
   * Goal:
   * 1) Enter in Material top search -> navigate to find.html (same as normal navigation)
   * 2) On find.html: add query into token pool (if missing), click token into panel, then Run Search
   * 3) Fix mobile "cannot scroll until refresh" by:
   *    - capturing Enter event before Material handles it
   *    - forcing keyboard dismissal before navigation
   *    - temporarily disabling search overlay pointer events on find page
   *    - burst-unlocking scroll during first second on find page
   */

  // -------------------------
  // Storage keys
  // -------------------------
  const KEY = "find_pending_token_v2"; // pending query (sessionStorage)
  const LEGACY_KEY = "find_pending_token_v1"; // legacy compatibility // pending query (sessionStorage)
  const RUN_LOCK_KEY = "__find_autoflow_ran_v2__"; // sessionStorage lock
  const SCROLL_Y_KEY = "__md_scroll_y__";

  // Palette cache (keep your existing approach)
  const PALETTE_KEY = "__md_palette_cache__";
  const MATERIAL_PALETTE_LS_KEY = "__palette";

  // -------------------------
  // Small utils
  // -------------------------
  function norm(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }
  function normLower(s) {
    return norm(s).toLowerCase();
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function isFindPage() {
    // Be deliberately generous here. Depending on MkDocs config / hosting, the
    // Find page can appear as /find, /find/, /find.html, or /find/index.html.
    // The previous guard missed the bare /find case, so same-page top-search
    // Enter was incorrectly treated as a fresh navigation to find.html.
    try {
      const p0 = String(window.location.pathname || "").toLowerCase();
      const clean = p0
        .replace(/\/index\.html$/, "")
        .replace(/\/find\.html$/, "/find")
        .replace(/\/+$/, "");

      if (clean === "find" || clean.endsWith("/find")) return true;
      if (p0.endsWith("/find.html") || p0.endsWith("/find/index.html")) return true;
    } catch (_) {}

    // DOM fallback for instant-navigation / unusual routed URLs. These markers
    // exist only on the Find page content, not in the Material header search.
    try {
      if (document.body && document.body.classList && document.body.classList.contains("mk-find-page")) return true;
      if (document.getElementById("find-builder")) return true;
      const form = document.getElementById("search-form");
      const results = document.getElementById("search-results");
      const input = document.getElementById("search-input");
      if (form && results && input && form.contains(input)) return true;
    } catch (_) {}

    return false;
  }


  function isDirectLpFindFlow() {
    try {
      const url = new URL(window.location.href);
      return String(url.searchParams.get("src") || "").trim() === "lp_direct";
    } catch (_) {
      return false;
    }
  }

  function byText(tagSel, textLower, root = document) {
    const els = Array.from(root.querySelectorAll(tagSel));
    return els.find((el) => normLower(el.textContent) === textLower) || null;
  }

  function getRunBtn(scope) {
  return scope.querySelector("#fb-run") || byText("button,a", "run search", scope);
}

function canClickBtn(btn) {
  if (!btn) return false;

  // HTML disabled
  if (btn.disabled) return false;

  // aria-disabled
  try {
    if (btn.getAttribute && btn.getAttribute("aria-disabled") === "true") return false;
  } catch (_) {}

  // class disabled
  if (btn.classList && (btn.classList.contains("is-disabled") || btn.classList.contains("disabled"))) return false;

  return true;
}

  function isMaterialSearchInput(el) {
    // MkDocs Material has used several search-input shapes across versions and
    // mobile/desktop layouts. On the Find page we must catch all of them before
    // Material turns Enter into a fresh navigation to find.html.
    try {
      if (!el || !el.matches) return false;
      if (el.closest && el.closest('#find-builder, #search-form, .fb-tokensearch-wrap')) return false;
      if (!/^input$/i.test(el.tagName || "")) return false;

      // Do not mistake Material's hidden search toggle checkbox for the text query box.
      const type = String(el.getAttribute('type') || '').toLowerCase();
      if (type && type !== 'search' && type !== 'text') return false;

      const shell = el.closest && el.closest('.md-search, .md-header');
      const hasMaterialMarker = el.matches('input[data-md-component="search-query"]');
      const classLooksRight = el.matches('input.md-search__input, input[type="search"]');
      const nameLooksRight = el.matches('input[name="q"], input[name="query"], input[name="search"]');

      const textLooksRight = (() => {
        try {
          const ph = String(el.getAttribute('placeholder') || '').toLowerCase();
          const aria = String(el.getAttribute('aria-label') || '').toLowerCase();
          const role = String(el.getAttribute('role') || '').toLowerCase();
          return role === 'searchbox' || ph.includes('search') || aria.includes('search');
        } catch (_) {
          return false;
        }
      })();

      return !!(hasMaterialMarker || (shell && (classLooksRight || nameLooksRight || textLooksRight)));
    } catch (_) {
      return false;
    }
  }

  function getEventSearchInput(ev) {
    try {
      const target = ev && ev.target;
      if (isMaterialSearchInput(target)) return target;
      const active = document.activeElement;
      if (isMaterialSearchInput(active)) return active;
      if (target && target.closest) {
        const shell = target.closest('.md-search, .md-header');
        if (shell) {
          const input = shell.querySelector('input[data-md-component="search-query"], input.md-search__input, input[type="search"], input[name="q"], input[name="query"]');
          if (isMaterialSearchInput(input)) return input;
        }
      }
    } catch (_) {}
    return null;
  }

  function isMaterialSearchForm(form) {
    try {
      if (!form || !form.matches) return false;
      if (form.closest && form.closest('#find-builder, #search-form, .fb-tokensearch-wrap')) return false;
      if (form.closest && form.closest('.md-search, .md-header')) return true;
      return !!form.querySelector('input[data-md-component="search-query"], input.md-search__input');
    } catch (_) {
      return false;
    }
  }

  function getSearchInputFromForm(form) {
    try {
      if (!form || !form.querySelector) return null;
      const input = form.querySelector('input[data-md-component="search-query"], input.md-search__input, input[type="search"], input[name="q"], input[name="query"]');
      return isMaterialSearchInput(input) ? input : null;
    } catch (_) {
      return null;
    }
  }

  function stopEnterEvent(e) {
    if (!e) return;
    try { e.preventDefault(); } catch (_) {}
    try { e.stopPropagation(); } catch (_) {}
    try { if (e.stopImmediatePropagation) e.stopImmediatePropagation(); } catch (_) {}
  }


  function consumeGuestSearch(query, source) {
    try {
      if (window.MkGuestAccess && typeof window.MkGuestAccess.consume === "function") {
        return !!window.MkGuestAccess.consume("search", { query: String(query || ""), source: source || "header-search", dedupeMs: 2500 });
      }
    } catch (_) {}
    return true;
  }

  function markSameFindTopSearchIntent(ms) {
    if (!isFindPage()) return;
    const until = Date.now() + Math.max(1600, Number(ms) || 0);
    try { window.__findHeaderSamePageHandledUntilV8 = until; } catch (_) {}
    try { window.__findHeaderSamePageHandledUntilV7 = until; } catch (_) {}
    try { window.__findHeaderEnterSuppressUntilV8 = until; } catch (_) {}
    try { window.__findHeaderEnterSuppressUntilV6 = until; } catch (_) {}
    try { window.__mkFindSamePageTopSearchUntil = until; } catch (_) {}
    try { window.__rkCancelPreloadForFindSamePage && window.__rkCancelPreloadForFindSamePage('search-enter'); } catch (_) {}
  }

  function hasSameFindTopSearchIntent() {
    try {
      const now = Date.now();
      return isFindPage() && (
        now < Number(window.__findHeaderSamePageHandledUntilV8 || 0) ||
        now < Number(window.__findHeaderSamePageHandledUntilV7 || 0) ||
        now < Number(window.__mkFindSamePageTopSearchUntil || 0)
      );
    } catch (_) {
      return false;
    }
  }

  function getHeaderSearchInputs() {
    try {
      return Array.from(document.querySelectorAll(
        'input[data-md-component="search-query"], .md-search input, .md-header input[type="search"], .md-header input[role="searchbox"]'
      )).filter((el) => isMaterialSearchInput(el));
    } catch (_) {
      return [];
    }
  }

  function getPrimaryHeaderSearchInput() {
    try {
      const active = document.activeElement;
      if (isMaterialSearchInput(active)) return active;
    } catch (_) {}
    const inputs = getHeaderSearchInputs();
    return inputs[0] || null;
  }

  async function dispatchFindAutofillOnCurrentPage(q, nonce) {
    const token = norm(q);
    if (!token || !isFindPage()) return false;

    markSameFindTopSearchIntent(3200);

    try {
      if (typeof window.__mkFindAutofillFromTopSearch === "function") {
        const ok = window.__mkFindAutofillFromTopSearch(token, { nonce: nonce || "", source: "search-enter-direct" });
        if (ok) return true;
      }
    } catch (_) {}

    try { sessionStorage.removeItem(KEY); } catch (_) {}
    try { sessionStorage.removeItem(LEGACY_KEY); } catch (_) {}
    try { sessionStorage.removeItem(RUN_LOCK_KEY); } catch (_) {}
    try { sessionStorage.removeItem("__se_find_autofill_nonce_v2__"); } catch (_) {}

    const ready = await new Promise((resolve) => {
      try { if (window.__fbReadyV1) return resolve(true); } catch (_) {}
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        try { window.removeEventListener("fb:ready", onReady); } catch (_) {}
        resolve(!!ok);
      };
      const onReady = () => finish(true);
      try { window.addEventListener("fb:ready", onReady, { once: true }); } catch (_) {}
      setTimeout(() => finish(false), 2200);
    });

    try {
      window.dispatchEvent(new CustomEvent("find:autofill", { detail: { token, nonce: nonce || "", ready, samePage: true } }));
      return true;
    } catch (_) {
      return false;
    }
  }



  // -------------------------
  // Palette: no switching, only preserve
  // -------------------------
  function persistPaletteOnly() {
    try {
      const paletteRaw = localStorage.getItem(MATERIAL_PALETTE_LS_KEY) || "";
      if (paletteRaw) sessionStorage.setItem(PALETTE_KEY, paletteRaw);
    } catch (_) {}
  }
  function restorePaletteEarly() {
    try {
      const paletteRaw = sessionStorage.getItem(PALETTE_KEY) || "";
      if (paletteRaw) localStorage.setItem(MATERIAL_PALETTE_LS_KEY, paletteRaw);
    } catch (_) {}
  }
  // earliest
  restorePaletteEarly();


  // Mobile search backdrop is handled by docs/javascripts/ui-guard.js (independent injected backdrop + safe z-indexing).
  // Keep this file focused on Enter→Find flow and scroll unlock.



  // -------------------------
  // Root URL helper
  // -------------------------
  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');
    const attr = script ? script.getAttribute("src") : link ? link.getAttribute("href") : null;
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  // -------------------------
  // Scroll lock + overlay kill (mobile)
  // -------------------------
  function rememberScrollY() {
    try {
      sessionStorage.setItem(SCROLL_Y_KEY, String(window.scrollY || 0));
    } catch (_) {}
  }

  function _removeScrollLockStyles(el) {
    if (!el || !el.style) return;
    [
      "overflow", "overflow-x", "overflow-y",
      "position", "top", "left", "right", "bottom",
      "height", "width", "touch-action",
      "padding-right", "margin-right",
      "transform", "transition", "animation",
      "-webkit-overflow-scrolling"
    ].forEach((prop) => {
      try { el.style.removeProperty(prop); } catch (_) {}
    });
  }

  function isHeaderSearchActuallyOpen() {
    try {
      const headerSearch = document.querySelector('.md-header .md-search');
      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector('input#__search') ||
        document.querySelector('#__search');
      const activeEl = document.activeElement;
      const focusedInside = !!(headerSearch && activeEl && headerSearch.contains && headerSearch.contains(activeEl));
      const toggleOpen = !!(toggle && toggle.checked);
      const shellActive = !!(headerSearch && headerSearch.classList && headerSearch.classList.contains('md-search--active'));
      const visible = (() => {
        try {
          const shell = headerSearch && headerSearch.querySelector ? headerSearch.querySelector('.md-search__inner') : null;
          if (!shell) return false;
          const cs = window.getComputedStyle(shell);
          if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) === 0) return false;
          const r = shell.getBoundingClientRect();
          return !!(r && r.width > 20 && r.height > 20);
        } catch (_) { return false; }
      })();
      return visible && (focusedInside || toggleOpen || shellActive || document.documentElement.classList.contains('md-search--active') || document.body.classList.contains('md-search--active'));
    } catch (_) { return false; }
  }

  function releaseScrollLockAndRestoreScroll(opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const keepFocus = !!options.keepFocus;
    try {
      const html = document.documentElement;
      const body = document.body;

      // When the top header search is truly open, do not run the stale-lock cleanup.
      // The old cleanup removes Material active search classes and inline scroll state,
      // which can make the mobile search shell flash while the keyboard is opening.
      if (keepFocus && isHeaderSearchActuallyOpen()) return;

      // Record body.top (common iOS scroll-lock pattern)
      const top = body && body.style ? body.style.top : "";
      const lockedY = top && /-?\d+px/.test(top) ? Math.abs(parseInt(top, 10)) : 0;

      // Remove scrollfix everywhere
      document.querySelectorAll("[data-md-scrollfix]").forEach((el) => {
        try { el.removeAttribute("data-md-scrollfix"); } catch (_) {}
      });
      if (html) {
        try { html.removeAttribute("data-md-scrollfix"); } catch (_) {}
      }
      if (body) {
        try { body.removeAttribute("data-md-scrollfix"); } catch (_) {}
      }

      // Clear active / overlay classes
      ["md-search--active", "md-dialog--active", "md-overlay--active", "md-sidebar--active", "md-nav--active"].forEach((cls) => {
        try { if (html && html.classList) html.classList.remove(cls); } catch (_) {}
        try { if (body && body.classList) body.classList.remove(cls); } catch (_) {}
      });

      // Clear locks on root + common containers Material may freeze/transform
      _removeScrollLockStyles(html);
      _removeScrollLockStyles(body);
      document.querySelectorAll(".md-container, .md-main, .md-content, .md-grid, .md-page").forEach((el) => {
        _removeScrollLockStyles(el);
      });

      // Restore scroll position if it was fixed/top locked
      let y = lockedY;
      if (!y) {
        const saved = sessionStorage.getItem(SCROLL_Y_KEY);
        y = saved ? parseInt(saved, 10) || 0 : 0;
      }
      if (y > 0) {
        try { window.scrollTo(0, y); } catch (_) {}
      }

      try { sessionStorage.removeItem(SCROLL_Y_KEY); } catch (_) {}

      // Defensive: ensure lists / overlay are not forced hidden
      const list = document.querySelector(".md-search-result__list");
      if (list && list.style) {
        try { list.style.removeProperty("display"); } catch (_) {}
      }
      const overlay = document.querySelector(".md-search__overlay");
      if (overlay && overlay.style) {
        try { overlay.style.removeProperty("display"); } catch (_) {}
      }

      // Insurance: blur active element only when we are intentionally tearing down
      // a search UI / keyboard flow. For find-page startup scroll-unlock, keep focus
      // intact, otherwise the panel token input loses caret during the first second.
      if (!keepFocus) {
        try {
          if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        } catch (_) {}
      }
    } catch (_) {}
  }

  function dismissKeyboard() {
    try {
      const active = document.activeElement;
      if (active && active.blur) active.blur();
    } catch (_) {}

    // iOS: sometimes blur during keydown is ignored, so do a body-attached temp focus
    try {
      if (!document.body) return;
      const tmp = document.createElement("button");
      tmp.type = "button";
      tmp.tabIndex = -1;
      tmp.setAttribute("aria-hidden", "true");
      tmp.style.position = "fixed";
      tmp.style.opacity = "0";
      tmp.style.left = "0";
      tmp.style.top = "0";
      tmp.style.width = "1px";
      tmp.style.height = "1px";
      document.body.appendChild(tmp);

      try {
        tmp.focus({ preventScroll: true });
      } catch (_) {
        try { tmp.focus(); } catch (_) {}
      }
      try { tmp.blur(); } catch (_) {}
      tmp.remove();
    } catch (_) {}
  }

  function forceCloseMaterialSearchUI(temporaryDisablePointerMs) {
    try {
      const html = document.documentElement;
      const body = document.body;

      // uncheck toggle and notify listeners
      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector("input#__search") ||
        document.querySelector("#__search");
      if (toggle) {
        try { toggle.checked = false; } catch (_) {}
        try { toggle.dispatchEvent(new Event("change", { bubbles: true })); } catch (_) {}
      }

      // blur input
      const mdInput = document.querySelector('input[data-md-component="search-query"]');
      if (mdInput) {
        try { mdInput.blur(); } catch (_) {}
      }
      try {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      } catch (_) {}

      // remove classes, locks
      if (html) html.classList.remove("md-search--active");
      if (body) body.classList.remove("md-search--active");
      releaseScrollLockAndRestoreScroll({ keepFocus: true });

      // IMPORTANT: invisible search shell / overlay can still participate in hit testing on mobile.
      const overlay = document.querySelector(".md-search__overlay");
      const search = document.querySelector(".md-search");
      const backdrop = document.getElementById("mk-mobile-search-backdrop");

      const disableFor = typeof temporaryDisablePointerMs === "number" ? temporaryDisablePointerMs : 0;
      if (disableFor > 0) {
        if (overlay) {
          overlay.dataset.__pe = overlay.style.pointerEvents || "";
          overlay.dataset.__disp = overlay.style.display || "";
          overlay.style.pointerEvents = "none";
          overlay.style.display = "none";
        }
        if (search) {
          search.dataset.__pe = search.style.pointerEvents || "";
          search.style.pointerEvents = "none";
        }
        if (backdrop) {
          backdrop.dataset.__pe = backdrop.style.pointerEvents || "";
          backdrop.dataset.__op = backdrop.style.opacity || "";
          backdrop.style.pointerEvents = "none";
          backdrop.style.opacity = "0";
        }
        setTimeout(() => {
          try {
            const stillActive =
              (document.documentElement && document.documentElement.classList.contains("md-search--active")) ||
              (document.body && document.body.classList.contains("md-search--active")) ||
              (toggle && toggle.checked);

            if (!stillActive) {
              if (overlay) {
                const pe = overlay.dataset.__pe || "";
                const disp = overlay.dataset.__disp || "";
                overlay.style.pointerEvents = pe;
                overlay.style.display = disp;
                delete overlay.dataset.__pe;
                delete overlay.dataset.__disp;
              }
              if (search) {
                const pe2 = search.dataset.__pe || "";
                search.style.pointerEvents = pe2;
                delete search.dataset.__pe;
              }
              if (backdrop) {
                const pe3 = backdrop.dataset.__pe || "";
                const op3 = backdrop.dataset.__op || "";
                backdrop.style.pointerEvents = pe3;
                backdrop.style.opacity = op3;
                delete backdrop.dataset.__pe;
                delete backdrop.dataset.__op;
              }
            }
          } catch (_) {}
        }, disableFor);
      }
    } catch (_) {}
  }

  function burstUnlock(durationMs) {
    // unlock immediately and then a few times in first second
    const steps = [0, 16, 50, 120, 250, 500, 900];
    const end = typeof durationMs === "number" ? durationMs : 1000;

    releaseScrollLockAndRestoreScroll();
    forceCloseMaterialSearchUI(end);

    steps.forEach((t) => {
      if (t > end) return;
      setTimeout(() => {
        releaseScrollLockAndRestoreScroll();
      }, t);
    });
  }

  function burstUnlockScrollOnly(durationMs) {
    // Find-page startup path: only fix stale scroll locks.
    // Do NOT touch the header search shell / overlay / custom backdrop here,
    // otherwise opening search within the first second loses the blur/backdrop effect.
    // IMPORTANT: also keep the currently focused element alive. On mobile, if these
    // first-second retries blur the active input, the panel token search caret flashes,
    // the keyboard collapses, and the whole page appears to jump once.
    const steps = [0, 16, 50, 120, 250, 500, 900];
    const end = typeof durationMs === "number" ? durationMs : 1000;

    releaseScrollLockAndRestoreScroll({ keepFocus: true });

    steps.forEach((t) => {
      if (t > end) return;
      setTimeout(() => {
        releaseScrollLockAndRestoreScroll({ keepFocus: true });
      }, t);
    });
  }

  function clearMaterialSearchInputLight(targetInput) {
    const input = targetInput || getPrimaryHeaderSearchInput();
    if (!input) return;
    input.value = "";
    try { input.dispatchEvent(new Event("input", { bubbles: true })); } catch (_) {}
  }

  // -------------------------
  // Find builder helpers
  // -------------------------
  function readPendingPayload() {
    // v2 supports JSON payload: { q: string, nonce: string }
    // backward compatible: raw string treated as q
    let raw = "";
    try { raw = sessionStorage.getItem(KEY) || ""; } catch (_) {}
    raw = String(raw || "");

    let q = "";
    let nonce = "";

    const trimmed = raw.trim();
    if (trimmed && trimmed.startsWith("{")) {
      try {
        const obj = JSON.parse(trimmed);
        q = norm(obj && obj.q);
        nonce = norm(obj && obj.nonce);
      } catch (_) {
        q = norm(trimmed);
      }
    } else {
      q = norm(trimmed);
    }

    // legacy fallback
    if (!q) {
      try { q = norm(sessionStorage.getItem(LEGACY_KEY) || ""); } catch (_) {}
    }

    // allow URL param fallback if you ever link with ?q=
    if (!q) {
      try {
        const params = new URLSearchParams(window.location.search);
        q = norm(params.get("q") || "");
      } catch (_) {}
    }

    return { q, nonce };
  }

  function getPendingQuery() {
    return readPendingPayload().q;
  }

  function tokenExistsInPool(scope, q) {
    const list = scope.querySelector(".fb-tokens__list");
    if (!list) return false;
    const nodes = Array.from(list.querySelectorAll("button, [role='button'], div, span"));
    return nodes.some((el) => norm(el.textContent) === q);
  }

  function panelAlreadyHasToken(scope, q) {
    // IMPORTANT:
    // Only consider real expression chips on the board.
    // Do NOT scan the whole scope, otherwise tokens in the token pool
    // or the ghost placeholder example will cause false positives.
    const line = scope.querySelector(".fb-board__line");
    if (!line) return false;

    const chips = Array.from(line.querySelectorAll(".fb-chip__text"));
    return chips.some((el) => norm(el.textContent) === q);
  }

  function clickTokenIntoPanel(scope, q) {
    const list = scope.querySelector(".fb-tokens__list");
    if (!list) return false;

    const btns = Array.from(list.querySelectorAll("button, [role='button']"));
    let target = btns.find((el) => norm(el.textContent) === q);

    if (!target) {
      const wraps = Array.from(list.querySelectorAll("div, span"));
      const wrap = wraps.find((el) => norm(el.textContent) === q);
      if (wrap) target = wrap.querySelector("button") || wrap;
    }

    if (!target) return false;
    try { target.click(); } catch (_) { return false; }
    return true;
  }

  function fixClearTokensPlacement(scope) {
    const head = scope.querySelector(".fb-tokens__head");
    const btn = scope.querySelector("#fb-clear-tokens");
    const title = scope.querySelector(".fb-tokens__title");
    if (!head || !btn || !title) return;

    if (btn.parentElement !== head) head.appendChild(btn);

    head.style.display = "flex";
    head.style.alignItems = "center";
    head.style.justifyContent = "space-between";
    head.style.gap = "12px";
    title.style.flex = "1 1 auto";
    title.style.minWidth = "0";
    btn.style.flex = "0 0 auto";
    btn.style.whiteSpace = "nowrap";
    btn.style.margin = "0";
  }

  function selectFindTokenInput(scope) {
    // DO NOT pick Material global search input.
    return (
      scope.querySelector("#search-input") ||
      scope.querySelector(".fb-token-input") ||
      scope.querySelector(".search-hero__input") ||
      (Array.from(scope.querySelectorAll('input[type="text"], input[type="search"], input:not([type]), textarea'))
        .filter((el) => el.offsetParent !== null && !el.matches('input[data-md-component="search-query"]'))[0] || null)
    );
  }

  function waitForFindBuilderReady(scope, timeoutMs) {
    const timeout = typeof timeoutMs === "number" ? timeoutMs : 12000;

    function snapshot() {
      const actions = scope.querySelector(".fb-actions") || scope;
      const clearPanelBtn = scope.querySelector("#fb-clear") || byText("button,a", "clear", actions);

      const addTokenBtn =
        scope.querySelector("#fb-add-token") ||
        scope.querySelector("#add-token") ||
        byText("button,a", "add token", scope);

      const runBtn = scope.querySelector("#fb-run") || byText("button,a", "run search", scope);

      const input = selectFindTokenInput(scope);
      const tokensHead = scope.querySelector(".fb-tokens__head");
      const tokensList = scope.querySelector(".fb-tokens__list");

      if (clearPanelBtn && addTokenBtn && runBtn && input && tokensHead && tokensList) {
        return { clearPanelBtn, addTokenBtn, runBtn, input, tokensHead, tokensList };
      }
      return null;
    }

    return new Promise((resolve, reject) => {
      const got = snapshot();
      if (got) return resolve(got);

      let done = false;

      const obs = new MutationObserver(() => {
        if (done) return;
        const now = snapshot();
        if (now) {
          done = true;
          try { obs.disconnect(); } catch (_) {}
          resolve(now);
        }
      });

      try {
        obs.observe(scope, { childList: true, subtree: true });
      } catch (_) {
        // fallback: if observe fails, use a light poll
        let tries = 0;
        const timer = setInterval(() => {
          tries += 1;
          const now = snapshot();
          if (now) {
            clearInterval(timer);
            resolve(now);
          } else if (tries >= Math.ceil(timeout / 80)) {
            clearInterval(timer);
            reject(new Error("timeout"));
          }
        }, 80);
        return;
      }

      setTimeout(() => {
        if (done) return;
        done = true;
        try { obs.disconnect(); } catch (_) {}
        reject(new Error("timeout"));
      }, timeout);
    });
  }

  async function runAutoflowOnFind() {
    if (!isFindPage()) return;

    if (isDirectLpFindFlow()) {
      try { sessionStorage.removeItem(KEY); } catch (_) {}
      try { sessionStorage.removeItem(LEGACY_KEY); } catch (_) {}
      try { sessionStorage.removeItem(RUN_LOCK_KEY); } catch (_) {}
      return;
    }

    const payload = readPendingPayload();
    const q = payload.q;
    if (!q) return;

    const nonce = String(payload.nonce || "");
    const lockVal = nonce
      ? `${window.location.pathname}::${q}::${nonce}`
      : `${window.location.pathname}::${q}`;

    const guard = (window.__findAutoflowGuardV3 = window.__findAutoflowGuardV3 || { running: false, lockVal: "" });
    if (guard.running && guard.lockVal === lockVal) return;
    if (guard.lockVal === lockVal) return;
    guard.running = true;
    guard.lockVal = lockVal;

    const DISPATCH_LOCK_KEY = "__se_find_autofill_nonce_v2__";

    try {
      // Legacy cleanup: old versions stored a persistent run-lock in sessionStorage and could block repeated queries
      try { sessionStorage.removeItem(RUN_LOCK_KEY); } catch (_) {}

      // Make sure scroll is usable on mobile immediately
      burstUnlockScrollOnly(1400);

      // Prevent re-dispatching the same payload under the same page lifecycle / instant-nav cycle
      try {
        const last = sessionStorage.getItem(DISPATCH_LOCK_KEY) || "";
        if (lockVal && last === lockVal) return;
      } catch (_) {}

      // Wait until find-builder is ready (it binds the 'find:autofill' listener and dispatches 'fb:ready').
      const ready = await new Promise((resolve) => {
        try {
          if (window.__fbReadyV1) return resolve(true);
        } catch (_) {}

        let done = false;
        const onReady = () => {
          if (done) return;
          done = true;
          try { window.removeEventListener("fb:ready", onReady); } catch (_) {}
          resolve(true);
        };

        try { window.addEventListener("fb:ready", onReady, { once: true }); } catch (_) {}

        setTimeout(() => {
          if (done) return;
          done = true;
          try { window.removeEventListener("fb:ready", onReady); } catch (_) {}
          resolve(false);
        }, 12000);
      });

      burstUnlockScrollOnly(1200);

      // Dispatch autofill event. find-builder.js already knows how to:
      // - add token to pool
      // - place token on the board
      // - run the search
      try {
        window.dispatchEvent(new CustomEvent("find:autofill", { detail: { token: q, nonce, ready } }));
      } catch (_) {}

      // Give the receiver a moment, then keep scroll unlocked during the first second.
      setTimeout(() => burstUnlockScrollOnly(1000), 0);
      setTimeout(() => burstUnlockScrollOnly(1000), 180);

      try { if (lockVal) sessionStorage.setItem(DISPATCH_LOCK_KEY, lockVal); } catch (_) {}
      try { sessionStorage.removeItem(KEY); } catch (_) {}
      try { sessionStorage.removeItem(LEGACY_KEY); } catch (_) {}

      // optional: remove ?q= from url if present
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("q")) {
          url.searchParams.delete("q");
          history.replaceState({}, "", url.toString());
        }
      } catch (_) {}
    } finally {
      guard.running = false;
    }
  }

  // -------------------------
  // Bind Enter on Material global search
  // -------------------------
  async function handleMaterialSearchEnter(input, e) {
    if (!input || !e) return false;
    const evType = String(e.type || "").toLowerCase();
    const isSubmit = evType === "submit";
    if (!isSubmit && e.key !== "Enter") return false;
    if (!isSubmit && (e.isComposing || e.keyCode === 229)) return false;

    // Hard gate: only the real Material search input is allowed here.
    // This prevents #find-builder #search-input from ever falling into the
    // global search/navigation flow.
    if (!isMaterialSearchInput(input)) return false;

    const q = norm(input.value || "");
    if (!q) return false;

    // stop Material handlers + native form submit before they can trigger a page transition
    stopEnterEvent(e);
    if (!consumeGuestSearch(q, isFindPage() ? "header-search-find-page" : "header-search")) return true;
    try { window.__findHeaderEnterSuppressUntilV6 = Date.now() + 1600; } catch (_) {}

    rememberScrollY();
    persistPaletteOnly();

    // Use a nonce so repeated searches for the same token are always treated as a fresh autoflow.
    const nonce = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

    // If we are already on Find, do NOT navigate to find.html again.
    // Just hand the token to find-builder: pool + panel + run search, with no preload/white-flash cycle.
    if (isFindPage()) {
      // Same-page Find search: no location.assign, no instant-navigation, no first-paint gate.
      // Clear/close the Material shell first so its own Enter/search-result handlers see no
      // pending query to convert into a fresh /find load.
      markSameFindTopSearchIntent(3200);
      clearMaterialSearchInputLight(input);
      dismissKeyboard();
      forceCloseMaterialSearchUI(650);
      releaseScrollLockAndRestoreScroll({ keepFocus: true });
      setTimeout(() => releaseScrollLockAndRestoreScroll({ keepFocus: true }), 0);
      setTimeout(() => releaseScrollLockAndRestoreScroll({ keepFocus: true }), 80);
      await dispatchFindAutofillOnCurrentPage(q, nonce);
      return true;
    }

    // store query for find page
    try {
      sessionStorage.removeItem(RUN_LOCK_KEY);
      sessionStorage.setItem(KEY, JSON.stringify({ q, nonce }));
    } catch (_) {}
    try { sessionStorage.setItem(LEGACY_KEY, q); } catch (_) {}

    // close overlay + dismiss keyboard BEFORE navigation
    clearMaterialSearchInputLight(input);
    dismissKeyboard();
    forceCloseMaterialSearchUI(1400);
    releaseScrollLockAndRestoreScroll();
    setTimeout(() => releaseScrollLockAndRestoreScroll(), 0);
    setTimeout(() => releaseScrollLockAndRestoreScroll(), 80);
    setTimeout(() => releaseScrollLockAndRestoreScroll(), 220);

    // allow iOS keyboard dismissal animation + search teardown to finish
    await sleep(240);

    const root = getSiteRootUrl();
    const u = new URL("find.html", root);

    // do not pass q in url (more similar to "from filter & search")
    window.location.assign(u.toString());
    return true;
  }

  function bindMaterialSearchEnter() {
    const inputs = getHeaderSearchInputs();

    // Last-resort guard for Material instant navigation. If another script still tries
    // to same-page route to /find, suppress only history mutations during the brief
    // window after our top-search Enter handler has already converted the query into
    // pool + panel + run search. This does not affect normal navigation to other pages.
    if (!window.__findHeaderHistoryGuardV7) {
      window.__findHeaderHistoryGuardV7 = true;
      try {
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        const shouldSuppressFindHistory = (url) => {
          try {
            if (!isFindPage()) return false;
            if (!hasSameFindTopSearchIntent()) return false;
            if (url == null || url === "") return false;
            const u = new URL(String(url), window.location.href);
            const p0 = String(u.pathname || "").toLowerCase();
            const clean = p0.replace(/\/index\.html$/, "").replace(/\/find\.html$/, "/find").replace(/\/+$/, "");
            return clean === "find" || clean.endsWith("/find") || p0.endsWith("/find.html") || p0.endsWith("/find/index.html");
          } catch (_) {
            return false;
          }
        };
        history.pushState = function (state, title, url) {
          if (shouldSuppressFindHistory(url)) return undefined;
          return origPush.apply(this, arguments);
        };
        history.replaceState = function (state, title, url) {
          if (shouldSuppressFindHistory(url)) return undefined;
          return origReplace.apply(this, arguments);
        };
      } catch (_) {}
    }

    // If Material turns Enter into a synthetic click on a Find result/link while
    // the header search is active, swallow only same-Find links during this short window.
    if (!window.__findHeaderSameFindClickGuardV8) {
      window.__findHeaderSameFindClickGuardV8 = true;
      const onClickCapture = (e) => {
        try {
          if (!hasSameFindTopSearchIntent()) return;
          const a = e && e.target && e.target.closest ? e.target.closest('a[href]') : null;
          if (!a) return;
          const u = new URL(a.getAttribute('href') || '', window.location.href);
          const p0 = String(u.pathname || '').toLowerCase();
          const clean = p0.replace(/\/index\.html$/, '').replace(/\/find\.html$/, '/find').replace(/\/+$/, '');
          if (!(clean === 'find' || clean.endsWith('/find') || p0.endsWith('/find.html') || p0.endsWith('/find/index.html'))) return;
          stopEnterEvent(e);
        } catch (_) {}
      };
      window.addEventListener('click', onClickCapture, true);
      document.addEventListener('click', onClickCapture, true);
    }

    // Window-level capture guard: event propagation starts at window, before
    // MkDocs/Material document/input handlers. On the Find page, this converts
    // top search Enter into pool + panel + run search, never a fresh find.html load.
    if (!window.__findHeaderEnterWindowGuardV6) {
      window.__findHeaderEnterWindowGuardV6 = true;
      const onEnterCapture = (e) => {
        try {
          if (!e || e.key !== "Enter") return;
          const input = getEventSearchInput(e);
          if (!input) return;
          if (isFindPage()) markSameFindTopSearchIntent(3200);
          handleMaterialSearchEnter(input, e);
        } catch (_) {}
      };
      const onLateEnterCapture = (e) => {
        try {
          if (!e || e.key !== "Enter") return;
          const input = getEventSearchInput(e);
          if (!input) return;
          if (Date.now() < Number(window.__findHeaderEnterSuppressUntilV6 || 0)) stopEnterEvent(e);
        } catch (_) {}
      };
      window.addEventListener("keydown", onEnterCapture, true);
      window.addEventListener("keypress", onLateEnterCapture, true);
      window.addEventListener("keyup", onLateEnterCapture, true);
    }

    // Document-level fallback for older browsers / unusual event paths.
    if (!window.__findHeaderEnterDocGuardV6) {
      window.__findHeaderEnterDocGuardV6 = true;
      document.addEventListener(
        "keydown",
        (e) => {
          try {
            if (!e || e.key !== "Enter") return;
            const input = getEventSearchInput(e);
            if (!input) return;
            if (isFindPage()) markSameFindTopSearchIntent(3200);
            handleMaterialSearchEnter(input, e);
          } catch (_) {}
        },
        true
      );
    }

    // Form-submit guard for the Material top search. Some Material builds trigger
    // navigation from the search form submit instead of the input keydown. On Find,
    // convert that submit into the same pool+panel+run flow and never reload.
    if (!window.__findHeaderSubmitGuardV6) {
      window.__findHeaderSubmitGuardV6 = true;
      const onSubmitCapture = (e) => {
        try {
          const form = e && e.target;
          if (!isFindPage()) return;
          if (!isMaterialSearchForm(form)) return;
          const input = getSearchInputFromForm(form) || getPrimaryHeaderSearchInput();
          if (!input) return;
          markSameFindTopSearchIntent(3200);
          handleMaterialSearchEnter(input, e);
        } catch (_) {}
      };
      window.addEventListener("submit", onSubmitCapture, true);
      document.addEventListener("submit", onSubmitCapture, true);
    }

    if (!inputs.length) return;

    inputs.forEach((input) => {
      if (!input || input.dataset.findEnterBoundV6 === "1") return;
      input.dataset.findEnterBoundV6 = "1";
      input.dataset.findEnterBoundV4 = "1";
      input.dataset.findEnterBoundV3 = "1";
      input.dataset.findEnterBoundV2 = "1";

      // remember scroll position when user focuses search; on the Find page also
      // arm the same-page guard before Material has a chance to synthesize routing.
      input.addEventListener("focus", () => {
        rememberScrollY();
        markSameFindTopSearchIntent(2400);
      }, { passive: true });
      input.addEventListener("input", () => markSameFindTopSearchIntent(2400), { passive: true });

      // Direct listener kept as a second layer for browsers that behave oddly with
      // document-level capture. The window guard normally stops the event first.
      input.addEventListener("keydown", (e) => {
        if (e && e.key === "Enter" && isFindPage()) markSameFindTopSearchIntent(3200);
        handleMaterialSearchEnter(input, e);
      }, true);
    });
  }


  function init() {
    restorePaletteEarly();
    bindMaterialSearchEnter();

    // On find page, run autoflow
    runAutoflowOnFind();
  }


  // iOS Safari BFCache: the previous page can be restored with stale scroll-lock state
  // (html/body fixed + overflow hidden). When navigating back from find.html, ensure we unlock it.
  window.addEventListener("pageshow", (e) => {
    try {
      if (!e || !e.persisted) return;

      const isMobile = (() => {
        try {
          return !!(
            window.matchMedia &&
            (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 900px)").matches)
          );
        } catch (_) {
          return false;
        }
      })();

      if (!isMobile) return;

      // Only unlock if search UI isn't actually open/visible.
      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector("input#__search") ||
        document.querySelector("#__search");

      const shell = document.querySelector(".md-search__inner");
      const visible = (() => {
        try {
          if (!shell) return false;
          const cs = window.getComputedStyle(shell);
          if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity || 1) === 0) return false;
          const r = shell.getBoundingClientRect();
          return r && r.height > 20 && r.width > 20;
        } catch (_) {
          return false;
        }
      })();

      const active =
        (toggle && toggle.checked) ||
        (document.documentElement && document.documentElement.classList.contains("md-search--active")) ||
        (document.body && document.body.classList.contains("md-search--active"));

      if (!active || !visible) {
        try { if (toggle) toggle.checked = false; } catch (_) {}
        forceCloseMaterialSearchUI(0);
        releaseScrollLockAndRestoreScroll({ keepFocus: true });
      }
    } catch (_) {}
  });

  // Normal load
  document.addEventListener("DOMContentLoaded", init);

  // MkDocs Material instant navigation
  document.addEventListener("DOMContentSwitch", init);

  // Extra: if we are already on find page, unlock immediately (best effort)
  try {
    if (isFindPage()) {
      burstUnlockScrollOnly(1600);
      setTimeout(() => burstUnlockScrollOnly(1200), 220);
    }
  } catch (_) {}
})();
