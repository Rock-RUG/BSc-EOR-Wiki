(function () {
  window.__courseSearchVersion = "v4.2.42-course-search-focus-preserve";

  let CSR_STATE = {
    items: [],
    page: 1,
    pageSize: 10,
    sortKey: "best", // "best" (relevance default) | "views30d" | "title" | "lecture"
    sortDir: "desc", // "asc" | "desc" (best uses desc by convention)
  };

  let CSR_LAST_HAS_RESULTS = false;
  let CSR_SEARCH_SEQ = 0;

  const CSR_INPUT_HISTORY_KEY = "mk_course_search_input_history_v3";
  const CSR_INPUT_HISTORY_MAX = 8;
  const __csrAssistUi = {
    items: [],
    activeIndex: -1,
    suppressBlurHideUntil: 0,
    lastApplied: "",
    lastNoteFix: "",
    requestSeq: 0,
    scopeCacheKey: "",
    scopePromise: null,
    resizeBound: false,
    outsideClickBound: false,
    scrollBound: false,
  };


  // ---------- in-place submit / no-flash guard ----------
  const CSR_NOFLASH_STYLE_ID = "csr-course-search-noflash-style-v1";
  let __csrNoFlashCleanupTimer = 0;
  let __csrSubmitGuardBound = false;
  let __csrLastSubmitStamp = { key: "", t: 0 };
  let __csrFocusProtectUntil = 0;

  function csrInstallNoFlashStyles() {
    if (document.getElementById(CSR_NOFLASH_STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = CSR_NOFLASH_STYLE_ID;
    st.textContent = `
      /* Course search should behave like Find builder's in-place Run search:
         no route preload, no full-screen dim/black overlay, no blur/fog while results render. */
      html.csr-course-search-inplace #course-search-results,
      body.csr-course-search-inplace #course-search-results,
      html.csr-course-search-inplace #course-search-results .csr-wrap,
      body.csr-course-search-inplace #course-search-results .csr-wrap,
      html.csr-course-search-inplace #course-search-results .csr-cols,
      body.csr-course-search-inplace #course-search-results .csr-cols,
      html.csr-course-search-inplace #course-search-results .csr-list,
      body.csr-course-search-inplace #course-search-results .csr-list,
      html.csr-course-search-inplace #course-search-results .csr-foot,
      body.csr-course-search-inplace #course-search-results .csr-foot{
        filter:none !important;
        -webkit-filter:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        opacity:1 !important;
        transform:none !important;
        animation:none !important;
        transition:none !important;
      }

      html.csr-course-search-inplace .md-search__overlay,
      body.csr-course-search-inplace .md-search__overlay,
      html.csr-course-search-inplace .md-overlay,
      body.csr-course-search-inplace .md-overlay,
      html.csr-course-search-inplace .mk-first-paint-gate,
      body.csr-course-search-inplace .mk-first-paint-gate,
      html.csr-course-search-inplace .mk-preload-gate,
      body.csr-course-search-inplace .mk-preload-gate,
      html.csr-course-search-inplace .mk-route-preload,
      body.csr-course-search-inplace .mk-route-preload,
      html.csr-course-search-inplace .mk-page-transition,
      body.csr-course-search-inplace .mk-page-transition,
      html.csr-course-search-inplace #mk-mobile-search-backdrop,
      body.csr-course-search-inplace #mk-mobile-search-backdrop,
      html.csr-course-search-inplace .mk-mobile-search-backdrop,
      body.csr-course-search-inplace .mk-mobile-search-backdrop,
      html.csr-course-search-inplace [data-mk-mobile-search-backdrop],
      body.csr-course-search-inplace [data-mk-mobile-search-backdrop],
      html.csr-course-search-inplace [data-mk-preload-gate],
      body.csr-course-search-inplace [data-mk-preload-gate],
      html.csr-course-search-inplace [data-mk-route-preload],
      body.csr-course-search-inplace [data-mk-route-preload],
      html.csr-course-search-inplace [data-rk-preload],
      body.csr-course-search-inplace [data-rk-preload]{
        display:none !important;
        opacity:0 !important;
        visibility:hidden !important;
        pointer-events:none !important;
        background:transparent !important;
        filter:none !important;
        -webkit-filter:none !important;
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
        animation:none !important;
        transition:none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(st);
  }

  function csrStopInPlaceEvent(ev) {
    try { ev.preventDefault(); } catch (_) {}
    try { ev.stopPropagation(); } catch (_) {}
    try { if (ev && ev.stopImmediatePropagation) ev.stopImmediatePropagation(); } catch (_) {}
  }

  function csrBeginInPlaceSearchGuard(ms) {
    csrInstallNoFlashStyles();

    const until = Date.now() + Math.max(1200, Number(ms) || 0);
    try { window.__mkCourseSearchInPlaceUntil = until; } catch (_) {}

    // Reuse the same suppression flags used by the Find-page same-page bridge.
    // Some global search/route scripts check these before showing the preload veil.
    try { window.__findHeaderSamePageHandledUntilV8 = until; } catch (_) {}
    try { window.__findHeaderSamePageHandledUntilV7 = until; } catch (_) {}
    try { window.__findHeaderEnterSuppressUntilV8 = until; } catch (_) {}
    try { window.__findHeaderEnterSuppressUntilV6 = until; } catch (_) {}
    try { window.__mkFindSamePageTopSearchUntil = until; } catch (_) {}
    try { window.__mkCourseSearchNoMobileBackdropUntil = until; } catch (_) {}
    try { window.__rkCancelPreloadForFindSamePage && window.__rkCancelPreloadForFindSamePage("course-search"); } catch (_) {}
    try { window.__rkRevealWhenReady && window.__rkRevealWhenReady(); } catch (_) {}
    csrHideMobileSearchBackdrop();

    try {
      document.documentElement && document.documentElement.classList.add("csr-course-search-inplace");
      document.body && document.body.classList.add("csr-course-search-inplace");
    } catch (_) {}

    if (__csrNoFlashCleanupTimer) {
      try { window.clearTimeout(__csrNoFlashCleanupTimer); } catch (_) {}
      __csrNoFlashCleanupTimer = 0;
    }
    __csrNoFlashCleanupTimer = window.setTimeout(csrClearInPlaceSearchGuard, Math.max(1300, Number(ms) || 0));
  }

  function csrClearInPlaceSearchGuard() {
    __csrNoFlashCleanupTimer = 0;
    try {
      if (Date.now() < Number(window.__mkCourseSearchInPlaceUntil || 0)) return;
    } catch (_) {}
    try {
      document.documentElement && document.documentElement.classList.remove("csr-course-search-inplace");
      document.body && document.body.classList.remove("csr-course-search-inplace");
    } catch (_) {}
    csrRestoreMobileSearchBackdropStyles();
  }

  function csrClearInPlaceSearchGuardSoon() {
    window.setTimeout(csrClearInPlaceSearchGuard, 260);
    window.setTimeout(csrClearInPlaceSearchGuard, 900);
    window.setTimeout(csrRestoreMobileSearchBackdropStyles, 1800);
    window.setTimeout(csrRestoreMobileSearchBackdropStyles, 3800);
  }

  function csrHideMobileSearchBackdrop() {
    try {
      const until = Number(window.__mkCourseSearchNoMobileBackdropUntil || 0);
      if (until && Date.now() > until) return;
      const nodes = document.querySelectorAll(
        '#mk-mobile-search-backdrop, .mk-mobile-search-backdrop, [data-mk-mobile-search-backdrop], .md-search__overlay, .md-overlay'
      );
      nodes.forEach((el) => {
        try {
          el.dataset.csrMobileBackdropHidden = '1';
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('opacity', '0', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
          el.style.setProperty('background', 'transparent', 'important');
          el.style.setProperty('backdrop-filter', 'none', 'important');
          el.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
          el.style.setProperty('filter', 'none', 'important');
          el.style.setProperty('-webkit-filter', 'none', 'important');
        } catch (_) {}
      });
    } catch (_) {}
  }

  function csrRestoreMobileSearchBackdropStyles() {
    try {
      if (Date.now() < Number(window.__mkCourseSearchNoMobileBackdropUntil || 0)) return;
      const nodes = document.querySelectorAll(
        '#mk-mobile-search-backdrop[data-csr-mobile-backdrop-hidden="1"], .mk-mobile-search-backdrop[data-csr-mobile-backdrop-hidden="1"], [data-mk-mobile-search-backdrop][data-csr-mobile-backdrop-hidden="1"], .md-search__overlay[data-csr-mobile-backdrop-hidden="1"], .md-overlay[data-csr-mobile-backdrop-hidden="1"]'
      );
      nodes.forEach((el) => {
        try {
          delete el.dataset.csrMobileBackdropHidden;
          ['display','opacity','visibility','pointer-events','background','backdrop-filter','-webkit-backdrop-filter','filter','-webkit-filter'].forEach((prop) => {
            try { el.style.removeProperty(prop); } catch (_) {}
          });
        } catch (_) {}
      });
    } catch (_) {}
  }

  function csrKeepMobileSearchBackdropHidden(ms) {
    try {
      const until = Date.now() + Math.max(900, Number(ms) || 0);
      window.__mkCourseSearchNoMobileBackdropUntil = Math.max(Number(window.__mkCourseSearchNoMobileBackdropUntil || 0), until);
      csrHideMobileSearchBackdrop();
      [40, 120, 260, 520, 900, 1400].forEach((delay) => {
        window.setTimeout(csrHideMobileSearchBackdrop, Math.min(delay, Math.max(40, Number(ms) || 1400)));
      });
    } catch (_) {}
  }

  function csrProtectCourseSearchFocus(ms) {
    try {
      const input = document.getElementById("course-search-input");
      if (!input) return;
      const form = document.getElementById("course-search-form");
      const until = Date.now() + Math.max(350, Number(ms) || 0);
      __csrFocusProtectUntil = Math.max(__csrFocusProtectUntil || 0, until);
      try { window.__mkCourseSearchFocusProtectUntil = __csrFocusProtectUntil; } catch (_) {}
      const refocus = () => {
        try {
          if (Date.now() > __csrFocusProtectUntil) return;
          const active = document.activeElement;
          const alreadyInside = !!(active && form && form.contains(active));
          if (active === input || alreadyInside) return;
          input.focus({ preventScroll: true });
          const v = String(input.value || "");
          if (typeof input.setSelectionRange === "function") input.setSelectionRange(v.length, v.length);
        } catch (_) {
          try { input.focus(); } catch (__) {}
        }
      };
      [0, 40, 120, 260].forEach((delay) => window.setTimeout(refocus, delay));
    } catch (_) {}
  }

  function csrCloseMaterialSearchOverlayForCourseSearch() {
    try {
      const courseInput = document.getElementById("course-search-input");
      const shouldPreserveCourseFocus = !!(courseInput && (document.activeElement === courseInput || Date.now() < (__csrFocusProtectUntil || 0)));
      if (shouldPreserveCourseFocus) csrProtectCourseSearchFocus(650);

      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector('input#__search');
      if (toggle) toggle.checked = false;

      csrKeepMobileSearchBackdropHidden(1600);

      const headerInputs = Array.from(document.querySelectorAll('input[data-md-component="search-query"]'));
      headerInputs.forEach((el) => {
        if (el && el.id === "course-search-input") return;
        try { el.value = ""; } catch (_) {}
        try { el.dispatchEvent(new Event("input", { bubbles: true })); } catch (_) {}
        try { el.blur && el.blur(); } catch (_) {}
      });

      document.querySelectorAll('.md-search.md-search--active').forEach((el) => {
        try { el.classList.remove("md-search--active"); } catch (_) {}
      });

      if (shouldPreserveCourseFocus) csrProtectCourseSearchFocus(650);
    } catch (_) {}
  }

  function csrIsSubmitLikeTarget(t) {
    try {
      if (!t || !t.closest) return false;
      const btn = t.closest('button, input[type="submit"], input[type="button"]');
      if (!btn) return false;
      if (btn.id === "csr-mobile-clear") return false;
      if (btn.id === "csr-mobile-submit") return true;
      if (btn.matches && btn.matches('button[type="submit"], button:not([type]), input[type="submit"]')) return true;
    } catch (_) {}
    return false;
  }

  function csrCourseFormFromEvent(ev) {
    try {
      const t = ev && ev.target;
      if (t && t.closest) {
        const f = t.closest("#course-search-form");
        if (f) return f;
      }
      const active = document.activeElement;
      if (active && active.closest) {
        const f = active.closest("#course-search-form");
        if (f) return f;
      }
    } catch (_) {}

    // For global capture guards, never fall back to the course form when the
    // event clearly came from somewhere else. This prevents accidental hijacking
    // of unrelated forms on the same page.
    if (ev) return null;

    return document.getElementById("course-search-form");
  }

  function csrIsCourseSearchEnter(ev) {
    try {
      if (!ev || ev.key !== "Enter") return false;
      if (ev.isComposing || ev.keyCode === 229) return false;
      const t = ev.target || document.activeElement;
      return !!(t && t.id === "course-search-input");
    } catch (_) {
      return false;
    }
  }

  function csrHandleCourseSearchSubmit(ev, source) {
    const form = csrCourseFormFromEvent(ev);
    const input = document.getElementById("course-search-input");
    const out = document.getElementById("course-search-results");
    if (!form || !input || !out) return false;
    try {
      if (ev && ev.__csrCourseSearchHandled) return true;
      if (ev) ev.__csrCourseSearchHandled = true;
    } catch (_) {}

    csrStopInPlaceEvent(ev);
    csrBeginInPlaceSearchGuard(3200);
    csrKeepMobileSearchBackdropHidden(3600);
    csrCloseMaterialSearchOverlayForCourseSearch();
    csrHideFuzzyNote();
    csrHideAssistDropdown();

    const rawNow = String(input.value || "").trim().replace(/\s+/g, " ");
    const dedupeKey = rawNow + "::" + String(source || "");
    const now = Date.now();
    if (dedupeKey && __csrLastSubmitStamp.key === dedupeKey && (now - __csrLastSubmitStamp.t) < 180) {
      return true;
    }
    __csrLastSubmitStamp = { key: dedupeKey, t: now };

    const historyValue =
      (__csrAssistUi.lastNoteFix && rawNow && rawNow.toLowerCase() === String(csrGetSearchInput() && csrGetSearchInput().value || "").trim().replace(/\s+/g, " ").toLowerCase())
        ? String(__csrAssistUi.lastNoteFix || "").trim()
        : rawNow;

    if (historyValue) csrAddInputHistory(historyValue);

    Promise.resolve()
      .then(() => runCourseSearch(input.value, { _directInPlace: true }))
      .then((res) => {
        if (rawNow && res && res.ok !== false) {
          csrTrackActivity("course_search", {
            query: rawNow.slice(0, 120),
            querySample: rawNow.slice(0, 80),
            queryLength: rawNow.length,
            course: getCourseKeyFromUrl(),
            resultCount: Number(res.count || 0),
          }, { scope: "course_search_submit:" + rawNow.slice(0, 80), throttleMs: 0 });
        }
      })
      .catch((err) => {
        out.innerHTML = `<div class="csr-item">Error: ${escapeHtml(err && (err.message || String(err)) || "Search failed")}</div>`;
      })
      .finally(() => {
        csrClearInPlaceSearchGuardSoon();
      });

    return true;
  }

  function csrInstallCourseSearchSubmitGuard() {
    if (__csrSubmitGuardBound) return;
    __csrSubmitGuardBound = true;

    const onSubmitCapture = (ev) => {
      try {
        const form = csrCourseFormFromEvent(ev);
        if (!form || form.id !== "course-search-form") return;
        csrHandleCourseSearchSubmit(ev, "capture-submit");
      } catch (_) {}
    };

    const onEnterCapture = (ev) => {
      try {
        if (!csrIsCourseSearchEnter(ev)) return;
        csrHandleCourseSearchSubmit(ev, "enter");
      } catch (_) {}
    };

    const onPointerDownCapture = (ev) => {
      try {
        const form = csrCourseFormFromEvent(ev);
        if (!form || form.id !== "course-search-form") return;
        if (csrIsSubmitLikeTarget(ev && ev.target)) csrBeginInPlaceSearchGuard(2400);
      } catch (_) {}
    };

    window.addEventListener("submit", onSubmitCapture, true);
    document.addEventListener("submit", onSubmitCapture, true);
    window.addEventListener("keydown", onEnterCapture, true);
    document.addEventListener("keydown", onEnterCapture, true);
    window.addEventListener("pointerdown", onPointerDownCapture, true);
    document.addEventListener("pointerdown", onPointerDownCapture, true);
    window.addEventListener("click", onPointerDownCapture, true);
    document.addEventListener("click", onPointerDownCapture, true);
  }


  // ---------- utils ----------
  function typesetMath(rootEl) {
  try {
    if (!rootEl) return;

    // MathJax v3
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([rootEl]).catch(() => {});
      return;
    }

    // (可选) 如果你未来换 KaTeX auto-render
    if (window.renderMathInElement) {
      window.renderMathInElement(rootEl, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    }
  } catch (_) {}
}

function typesetMathAsync(rootEl) {
  try {
    if (!rootEl) return Promise.resolve();

    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      return window.MathJax.typesetPromise([rootEl]).catch(() => {});
    }

    if (window.renderMathInElement) {
      window.renderMathInElement(rootEl, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    }
  } catch (_) {}
  return Promise.resolve();
}


  function escapeHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function csrSimpleHash(value) {
    const src = String(value || "").slice(0, 500);
    let h = 2166136261;
    for (let i = 0; i < src.length; i += 1) {
      h ^= src.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function csrCourseSearchEventId(query, course) {
    const q = String(query || "").trim().replace(/\s+/g, " ").toLowerCase();
    const c = String(course || getCourseKeyFromUrl() || "course").trim().toLowerCase();
    // A real submit is an action.  Use a per-submit id so repeated real searches
    // can count up to the server-side daily cap, while this single function is
    // the only course-search XP emitter to avoid double counting.
    return `course-search-submit-v10:${csrSimpleHash(`${c}:${q}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`)}`;
  }

  function csrFlushXpQueuesSoon() {
    try {
      if (window.MkLocalActivity && typeof window.MkLocalActivity.flushLocalSyncQueue === "function") {
        window.MkLocalActivity.flushLocalSyncQueue({ force: false }).catch(() => {});
      }
    } catch (_) {}
    try {
      if (window.MkHotTrack && typeof window.MkHotTrack.flushLocalSyncQueue === "function") {
        window.MkHotTrack.flushLocalSyncQueue({ force: false });
      }
    } catch (_) {}
  }

  function csrQueueXpActivity(metric, detail, opts) {
    try {
      const key = "mk_xp_pending_activity_queue_v1";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push({ metric, details: detail || {}, opts: opts || {}, queuedAt: Date.now(), source: "course-search-fallback" });
      localStorage.setItem(key, JSON.stringify(arr.slice(-300)));
    } catch (_) {}
  }

  function csrTrackActivity(metric, details, opts) {
    const m = String(metric || "");
    const d = details && typeof details === "object" ? details : {};
    const o = opts && typeof opts === "object" ? opts : {};
    const xpMetrics = { course_search: true, search_suggestion: true, sort_use: true };
    if (xpMetrics[m]) {
      try {
        if (window.MkXpActivity && typeof window.MkXpActivity.record === "function") {
          if (m === "course_search" && typeof window.MkXpActivity.recordCourseSearchUsed === "function") {
            const course = d.course || getCourseKeyFromUrl();
            const query = String(d.query || d.querySample || "").trim().replace(/\s+/g, " ");
            window.MkXpActivity.recordCourseSearchUsed(Object.assign({
              source: "course-search-js-submit",
              eventName: "course-search-submit",
              query,
              querySample: query.slice(0, 80),
              queryLength: query.length,
              course,
              actionStateVersion: 8,
              actionStateKey: d.actionStateKey || csrCourseSearchEventId(query, course),
              courseSearchExplicitVersion: 10,
            }, d));
          } else {
            window.MkXpActivity.record(m, Object.assign({ source: "course-search-js", eventName: "course-search-js" }, d), o);
          }
          window.setTimeout(csrFlushXpQueuesSoon, 120);
          window.setTimeout(csrFlushXpQueuesSoon, 1200);
          return;
        }
        if (window.MkAccountData && typeof window.MkAccountData.recordActivity === "function") {
          window.MkAccountData.recordActivity(m, Object.assign({ source: "course-search-js-local" }, d), Object.assign({ scope: `${m}:${d.actionStateKey || d.query || d.text || d.sort || d.path || Date.now()}`, throttleMs: 0 }, o));
          return;
        }
      } catch (_) {}
      csrQueueXpActivity(m, Object.assign({ source: "course-search-js-queued" }, d), Object.assign({ scope: `${m}:${d.actionStateKey || d.query || d.text || d.sort || d.path || Date.now()}`, throttleMs: 0 }, o));
      try { document.dispatchEvent(new CustomEvent("mk:xp-activity", { detail: Object.assign({ metric: m }, d) })); } catch (_) {}
      return;
    }
    try {
      if (window.MkHotTrack && typeof window.MkHotTrack.trackActivity === "function") {
        window.MkHotTrack.trackActivity(metric, Object.assign({ details: d }, o));
      }
    } catch (_) {}
  }

  function csrConsumeGuestAction(action, detail) {
    try {
      if (window.MkGuestAccess && typeof window.MkGuestAccess.consume === "function") {
        return !!window.MkGuestAccess.consume(action, detail || {});
      }
    } catch (_) {}
    return true;
  }


  let __csrIndexLoadPromise = null;

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]') ||
      document.querySelector('script[src*="assets/javascripts"]');

    const attr = script ? script.getAttribute("src") : (link ? (link.getAttribute("href") || link.getAttribute("src")) : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);
    const p = assetUrl.pathname || "/";
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  async function loadIndex() {
    if (__csrIndexLoadPromise) return __csrIndexLoadPromise;

    __csrIndexLoadPromise = (async () => {
      const root = getSiteRootUrl();
      const candidates = [
        new URL("search/search_index.json", root).toString(),
        new URL("search_index.json", root).toString(),
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (!res || !res.ok) continue;
          const j = await res.json();
          if (j && Array.isArray(j.docs)) return j;
        } catch (_) {}
      }

      return { docs: [] };
    })();

    return __csrIndexLoadPromise;
  }

  function csrCleanPageTitle(title) {
    return String(title || "").replace(/\s+-\s+BSc EOR Wiki\s*$/i, "").trim();
  }

  function csrNormLoc(loc) {
    return String(loc || "").split("#")[0].replace(/^\/+/, "").trim();
  }

  function csrIsIndexPage(loc) {
    const path = csrNormLoc(loc).toLowerCase();
    const base = (path.split("/").pop() || "");
    return base === "index.html" || base === "index.md";
  }

  function csrIsUtilityPage(loc) {
    const base = (csrNormLoc(loc).split("/").pop() || "").toLowerCase().replace(/\.html$/i, "");
    return base === "find" || base === "custom-random" || base === "search" || base === "tags" || base === "trending";
  }

  function csrIsRandomPage(loc) {
    const base = (csrNormLoc(loc).split("/").pop() || "").toLowerCase().replace(/\.html$/i, "");
    if (base === "random") return true;
    if (/^random-\d/.test(base)) return true;
    return false;
  }

  function csrIsConceptPageLocation(loc) {
    const path = csrNormLoc(loc);
    if (!path) return false;
    if (path.endsWith("/")) return false;
    const segs = path.split("/").filter(Boolean);
    if (segs.length < 3) return false;
    if (csrIsIndexPage(path) || csrIsUtilityPage(path) || csrIsRandomPage(path)) return false;
    return true;
  }

  function csrFileTitleFallback(loc) {
    const file = (csrNormLoc(loc).split("/").pop() || "").replace(/\.html$/i, "");
    return file.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function csrAggregateDocsToPages(docs) {
    const map = new Map();
    for (const d of (Array.isArray(docs) ? docs : [])) {
      const pageLoc = csrNormLoc(d && d.location);
      if (!pageLoc || !csrIsConceptPageLocation(pageLoc)) continue;

      let entry = map.get(pageLoc);
      if (!entry) {
        entry = {
          location: pageLoc,
          title: "",
          tags: new Set(),
          text: "",
        };
        map.set(pageLoc, entry);
      }

      const locFull = String(d && d.location || "");
      if (!entry.title && !locFull.includes("#") && d && d.title) entry.title = csrCleanPageTitle(d.title);
      if (!entry.title && d && d.title) entry.title = csrCleanPageTitle(d.title);

      const txt = String(d && d.text || "").trim();
      if (txt) entry.text += (entry.text ? "\n" : "") + txt;

      for (const tg of getTagsFromDoc(d)) entry.tags.add(tg);
    }

    return Array.from(map.values()).map((item) => ({
      location: item.location,
      title: item.title || csrFileTitleFallback(item.location),
      tags: Array.from(item.tags),
      text: item.text || "",
    }));
  }

  // ----------------------------
  // Token matching helpers (plural-insensitive + no-space title hit)
  // Fixes: bounded sets vs bounded set, boundedsets, etc.
  // ----------------------------
  function csrStripPluralS(w) {
    const s = String(w || "").toLowerCase().trim();
    if (!s) return "";
    if (
      s.length > 3 &&
      s.endsWith("s") &&
      !s.endsWith("ss") &&
      !s.endsWith("us") &&
      !s.endsWith("is") &&
      !s.endsWith("as")
    ) return s.slice(0, -1);
    return s;
  }

  function csrPluralS(w) {
    const s = csrStripPluralS(w);
    if (!s) return "";
    if (s.endsWith("s")) return s;
    return s + "s";
  }

  function csrTokenVariants(tok) {
    const base = String(tok || "").toLowerCase().trim();
    if (!base) return [];
    const sing = csrStripPluralS(base);
    const out = new Set([base, sing, csrPluralS(sing)]);
    return Array.from(out).filter(Boolean);
  }

  function csrHitInNormDoc(n, tok) {
    const vars = csrTokenVariants(tok);
    if (!vars.length) return false;
    const hay = String(n && n.hay || "");
    for (const v of vars) {
      if (v && hay.includes(v)) return true;
    }
    // no-space fallback for titles (boundedset -> bounded set)
    const titleChars = String(n && n.titleChars || "");
    if (titleChars) {
      for (const v of vars) {
        const vv = String(v || "").replace(/\s+/g, "");
        if (vv.length >= 4 && titleChars.includes(vv)) return true;
      }
    }
    return false;
  }


  // Strict hit (haystack only) for deciding whether to trigger fuzzy correction.
  // We intentionally ignore the titleChars "no-space" fallback here, so queries like
  // "boundedsets" will be treated as 0-results (strict) and then corrected to "bounded set".
  function csrHitInHay(hay, tok) {
    const vars = csrTokenVariants(tok);
    if (!vars.length) return false;
    const h = String(hay || "");
    for (const v of vars) {
      if (v && h.includes(v)) return true;
    }
    return false;
  }

  const __csrHayCache = new Map(); // key: location -> hay string
  function csrHayForPage(p) {
    const loc = String(p && p.location || "");
    if (!loc) return "";
    const cached = __csrHayCache.get(loc);
    if (cached) return cached;

    const fileBase = fileBaseFromLocation(loc);
    const tags = Array.isArray(p && p.tags) ? p.tags.join(" ") : String((p && p.tags) || "");
    const aliases = Array.isArray(p && p.aliases) ? p.aliases.join(" ") : String((p && p.aliases) || "");
    const title = String((p && p.title) || "");
    const text = String((p && p.text) || "");
    const hay = normaliseForSearch(`${fileBase} ${title} ${tags} ${aliases} ${text} ${loc}`);

    __csrHayCache.set(loc, hay);
    return hay;
  }

  function csrStrictAnyResult(pages, keyword) {
    const toks = tokeniseQuery(keyword);
    if (!toks.length) return false;
    for (const p of pages || []) {
      const hay = csrHayForPage(p);
      let ok = true;
      for (const t of toks) {
        if (!csrHitInHay(hay, t)) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }


  // ----------------------------
  // Fuzzy core (dynamic load) + note line
  // ----------------------------
  const CSR_FUZZY_CORE_PATH = "javascripts/fuzzy-core.js";
  let __csrFuzzyLoadPromise = null;

  function csrEnsureFuzzyCore() {
    if (window.__mkFuzzyCore) return Promise.resolve(window.__mkFuzzyCore);
    if (__csrFuzzyLoadPromise) return __csrFuzzyLoadPromise;

    __csrFuzzyLoadPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[data-mk-fuzzy-core="1"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.__mkFuzzyCore), { once: true });
        existing.addEventListener("error", () => resolve(null), { once: true });
        return;
      }

      const s = document.createElement("script");
      s.dataset.mkFuzzyCore = "1";
      s.async = true;
      s.defer = true;
      try {
        s.src = new URL(CSR_FUZZY_CORE_PATH, getSiteRootUrl()).toString();
      } catch (_) {
        s.src = CSR_FUZZY_CORE_PATH;
      }
      s.onload = () => resolve(window.__mkFuzzyCore || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });

    return __csrFuzzyLoadPromise;
  }

  function csrEnsureFuzzyStyles() {
    if (document.getElementById("csr-fuzzy-style-v1")) return;
    const st = document.createElement("style");
    st.id = "csr-fuzzy-style-v1";
    st.textContent = `
      #csr-fuzzy-note{
        margin-top:10px;
        padding:10px 12px;
        border-radius:14px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: var(--grad-panel, rgba(0,0,0,.03));
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        display:none;
        gap:12px;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
      }
      #csr-fuzzy-note .csr-fuzzy-msg{ min-width:0; line-height:1.25; opacity:.95; }
      #csr-fuzzy-note code{
        padding:2px 6px; border-radius:10px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(0,0,0,.04);
      }
      #csr-fuzzy-note .csr-fuzzy-actions{ display:flex; gap:10px; flex:0 0 auto; }
      #csr-fuzzy-note .csr-fuzzy-btn{
        appearance:none;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(0,0,0,.03);
        color:inherit;
        border-radius:999px;
        padding:7px 12px;
        cursor:pointer;
        font-weight:650;
        display:inline-flex;
        align-items:center;
        gap:8px;
        line-height:1;
      }
      #csr-fuzzy-note .csr-fuzzy-btn:hover{ background: rgba(0,0,0,.06); }
      #csr-fuzzy-note .csr-fuzzy-btn::before{
        display:inline-flex; align-items:center; justify-content:center;
        width:18px; height:18px; border-radius:999px;
        border:1px solid var(--md-default-fg-color--lightest);
        background: rgba(0,0,0,.04);
        font-size:12px; font-weight:900;
      }
      #csr-fuzzy-note .csr-fuzzy-btn--undo::before{ content:"↩"; }
/* Mobile: make the input at least as tall as the search button */
@media (max-width: 720px){
  #course-search-form{ --csr-btn-h: 48px; align-items: stretch; }
  #course-search-input{
    min-height: var(--csr-btn-h);
    padding-top: 10px;
    padding-bottom: 10px;
    box-sizing: border-box;
  }
  #course-search-form button.fb-cta-btn{ min-height: var(--csr-btn-h); }
}

/* Mobile-only: use a 2-part layout -> input(with inline clear-X) | Search button */
@media (max-width: 720px){
  #course-search-form{
    position: relative;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    align-items: center !important;
    column-gap: 10px !important;
  }
  #course-search-form .fb-cta-btn--search,
  #course-search-form button[type="submit"],
  #course-search-form input[type="submit"]{
    display:none !important;
  }
  #course-search-input{
    grid-column: 1;
    min-width: 0;
    width: 100% !important;
    padding-right: 42px !important;
  }
  #csr-mobile-submit{
    display:inline-flex;
    grid-column: 2;
    align-self:center;
    align-items:center;
    justify-content:center;
    position: static;
    right: auto;
    top: auto;
    transform: none;
    min-width: 0;
    height: 36px;
    padding: 0 12px 0 10px;
    border-radius: 999px;
    border: 1px solid var(--md-default-fg-color--lightest);
    background: rgba(0,0,0,.03);
    color: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    z-index: 2;
    white-space: nowrap;
    gap: 7px;
  }
  #csr-mobile-submit:active{ transform: scale(0.98); }
  #csr-mobile-submit svg{ width: 16px; height: 16px; }
  #csr-mobile-clear{
    display:inline-flex;
    grid-column: 1;
    align-self:center;
    justify-self:end;
    align-items:center;
    justify-content:center;
    width: 28px;
    height: 28px;
    margin: 0 8px 0 0;
    border: 0;
    background: transparent;
    color: var(--md-default-fg-color--light);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    z-index: 3;
    font-size: 22px;
    line-height: 1;
    border-radius: 999px;
    padding: 0;
  }
  #csr-mobile-clear[hidden]{ display:none !important; }
}
@media (min-width: 721px){
  #csr-mobile-submit,
  #csr-mobile-clear{ display:none !important; }
}
          `;
    document.head.appendChild(st);
  }

  function csrEnsureFuzzyNoteHost() {
    csrEnsureFuzzyStyles();

    // Defensive cleanup: if older cached JS injected a Dismiss button, remove it.
    try {
      const n = document.getElementById("csr-fuzzy-note");
      if (n) {
        Array.from(n.querySelectorAll("button")).forEach(b => {
          const t = (b.textContent || "").trim().toLowerCase();
          const act = (b.getAttribute("data-csr-fuzzy-act") || "").trim();
          if (t === "dismiss" || (act && act !== "edit")) b.remove();
        });
      }
    } catch (_) {}


    let note = document.getElementById("csr-fuzzy-note");
    if (note) return note;

    const form = document.getElementById("course-search-form");
    if (!form) return null;

    note = document.createElement("div");
    note.id = "csr-fuzzy-note";
    form.insertAdjacentElement("afterend", note);

    note.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("button[data-csr-fuzzy-act]") : null;
      if (!btn) return;
      const act = btn.getAttribute("data-csr-fuzzy-act") || "";
      if (act === "edit") {
        const payload = note.getAttribute("data-csr-fuzzy-payload") || "";
        let data = null;
        try { data = payload ? JSON.parse(payload) : null; } catch (_) {}
        if (!data || !data.orig) return;

        const input = document.getElementById("course-search-input");
        if (input) {
          input.value = data.orig;
          try { input.focus(); } catch (_) {}
        }

        // Let the user edit the original query. Do not re-run automatically.
        csrHideFuzzyNote();
        return;
      }
});

    return note;
  }

  function csrShowFuzzyNote(html, payloadObj) {
    const note = csrEnsureFuzzyNoteHost();
    if (!note) return;

    note.innerHTML = html;
    // Defensive: remove any stale "Dismiss" button from older cached HTML
    try {
      const btns = Array.from(note.querySelectorAll("button"));
      for (const b of btns) {
        const act = (b.getAttribute("data-csr-fuzzy-act") || "").trim();
        const txt = (b.textContent || "").trim().toLowerCase();
        if (act && act !== "edit") b.remove();
        else if (!act && txt === "dismiss") b.remove();
      }
    } catch (_) {}
    if (payloadObj) {
      try { note.setAttribute("data-csr-fuzzy-payload", JSON.stringify(payloadObj)); } catch (_) {}
    } else {
      note.removeAttribute("data-csr-fuzzy-payload");
    }
    note.style.display = "flex";
  }

  function csrHideFuzzyNote() {
    const note = document.getElementById("csr-fuzzy-note");
    if (!note) return;
    note.style.display = "none";
    note.innerHTML = "";
    note.removeAttribute("data-csr-fuzzy-payload");
  }

  async function csrTryAutoCorrectOnNoResults(keyword, inCoursePages, courseKey) {
    const core = await csrEnsureFuzzyCore();
    if (!core || typeof core.suggestPhrase !== "function") return null;

    const kw = String(keyword || "").trim();
    if (!kw) return null;

    // Ensure scope uses course pages only (faster & more accurate)
    const scopeKey = "course:" + String(courseKey || "global");
    try { await core.ensureScope(scopeKey, { pageDocs: inCoursePages, includeBody: true, minFreq: 2, maxVocab: 9000 }); } catch (_) {}

    const sug = await core.suggestPhrase(scopeKey, kw, { pageDocs: inCoursePages, includeBody: true, minFreq: 2, maxVocab: 9000 });
    if (!sug || !sug.suggested) return null;

    const to = String(sug.suggested || "").trim().replace(/\s+/g, " ");
    if (!to || to === kw) return null;
    return { from: kw, to };
  }


  function unitNounFromType(type) {
    return String(type || "lecture").toLowerCase() === "week" ? "Week" : "Lecture";
  }

  function unitInfoFromTags(tagArr) {
    const tags = Array.isArray(tagArr) ? tagArr : [];
    const withCourse = /^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;
    const bare = /^(lecture|week)[-_]?0*(\d+)$/i;

    for (const raw of tags) {
      const t = String(raw || "").trim();
      let m = t.match(withCourse);
      if (m) {
        const unitType = String(m[2] || "lecture").toLowerCase();
        const unitNum = parseInt(m[3], 10) || 0;
        const unitNoun = unitNounFromType(unitType);
        return {
          courseCode: String(m[1] || "").toLowerCase(),
          unitType,
          unitNum,
          unitLabel: unitNum ? `${unitNoun} ${unitNum}` : unitNoun,
          lectureNum: unitNum,
          lectureLabel: unitNum ? `${unitNoun} ${unitNum}` : unitNoun
        };
      }

      m = t.match(bare);
      if (m) {
        const unitType = String(m[1] || "lecture").toLowerCase();
        const unitNum = parseInt(m[2], 10) || 0;
        const unitNoun = unitNounFromType(unitType);
        return {
          courseCode: "",
          unitType,
          unitNum,
          unitLabel: unitNum ? `${unitNoun} ${unitNum}` : unitNoun,
          lectureNum: unitNum,
          lectureLabel: unitNum ? `${unitNoun} ${unitNum}` : unitNoun
        };
      }
    }
    return null;
  }

  function lectureInfoFromTags(tagArr) {
    return unitInfoFromTags(tagArr);
  }

  function normaliseForSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokeniseQuery(q) {
    return normaliseForSearch(q).split(" ").filter(Boolean);
  }

  function safePath(loc) {
    const s0 = String(loc || "");
    return (s0.split("#")[0] || s0).replace(/^\/+/, "");
  }

  function fileBaseFromLocation(location) {
    const loc = safePath(location);
    const file = (loc.split("/").pop() || "").replace(/\.html$/i, "");
    return file;
  }

  function asStringList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.map(String).filter(Boolean);
    if (typeof x === "string") return [x];
    return [];
  }

  function getTagsFromDoc(d) {
    const out = [];
    out.push(...asStringList(d && d.tags));
    out.push(...asStringList(d && d.tag));
    out.push(...asStringList(d && d.meta && d.meta.tags));
    out.push(...asStringList(d && d.meta && d.meta.tag));
    out.push(...asStringList(d && d.meta && d.meta["tags"]));
    return out.map(s => String(s).trim()).filter(Boolean);
  }


  function splitAliasPieces(raw) {
    const src = normaliseText(stripHtml(String(raw || ""))).replace(/\u00a0/g, " ");
    if (!src) return [];
    return src
      .split(/\s*(?:,|;|•|·|\|)\s*/)
      .map((s) => String(s || "").trim())
      .filter(Boolean);
  }

  function extractAliasesFromText(raw) {
    const htmlish = String(raw || "");
    if (!htmlish) return [];

    const withBreaks = htmlish
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|div|li|tr|td|th|h[1-6])>/gi, "\n");

    const plain = stripHtml(withBreaks).replace(/\u00a0/g, " ");
    if (!plain) return [];

    const out = [];
    const re = /(?:^|\n|\|)\s*aliases?\s*:\s*([^\n|]+)/ig;
    let m;
    while ((m = re.exec(plain))) {
      out.push(...splitAliasPieces(m[1] || ""));
    }
    return out;
  }

  function latexMathToPlain(raw) {
    let s = String(raw || "");
    if (!s) return "";

    s = s
      .replace(/\\begin\{[^}]+\}/g, " ")
      .replace(/\\end\{[^}]+\}/g, " ")
      .replace(/\\text\{([^}]*)\}/g, " $1 ")
      .replace(/\\mathrm\{([^}]*)\}/g, " $1 ")
      .replace(/\\operatorname\{([^}]*)\}/g, " $1 ")
      .replace(/\\left|\\right/g, " ")
      .replace(/\\[()\[\]]/g, " ")
      .replace(/\$\$([\s\S]*?)\$\$/g, " $1 ")
      .replace(/\$([^$]+)\$/g, " $1 ")
      .replace(/\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle)\b/g, " ")
      .replace(/\\(?:qquad|quad|enspace|thinspace|medspace|thickspace)\b/g, " ")
      .replace(/\\([a-zA-Z]+)/g, " $1 ")
      .replace(/[{}_^]/g, " ")
      .replace(/[-–]+/g, " - ")
      .replace(/\s+/g, " ")
      .trim();

    return s;
  }

  function buildAliasVariants(raw) {
    const out = new Set();
    const addNorm = (s) => {
      const n = normaliseForSearch(s);
      if (!n) return;
      out.add(n);
      out.add(n.replace(/\s+/g, ""));
      out.add(n.replace(/\s+/g, "-"));
    };

    const src = String(raw || "");
    if (!src) return Array.from(out);

    addNorm(src);
    addNorm(stripHtml(src));
    addNorm(latexMathToPlain(src));

    const re = /\\\((.*?)\\\)|\\\[(.*?)\\\]|\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g;
    let m;
    while ((m = re.exec(src))) {
      const piece = m[1] || m[2] || m[3] || m[4] || "";
      if (piece) addNorm(latexMathToPlain(piece));
    }

    const plainNorm = normaliseForSearch(latexMathToPlain(src));
    if (plainNorm) {
      const toks = plainNorm.split(" ").filter(Boolean);
      if (toks.length >= 2) {
        addNorm(toks.join(" "));
        addNorm(toks.join("-"));
      }
    }

    return Array.from(out).filter(Boolean);
  }

  function getAliasesFromDoc(d) {
    const raw = [];
    raw.push(...asStringList(d && d.aliases));
    raw.push(...asStringList(d && d.alias));
    raw.push(...asStringList(d && d.meta && d.meta.aliases));
    raw.push(...asStringList(d && d.meta && d.meta.alias));
    raw.push(...asStringList(d && d.meta && d.meta["aliases"]));

    const out = [];
    for (const item of raw) out.push(...splitAliasPieces(item));
    out.push(...extractAliasesFromText(d && d.text));

    const seen = new Set();
    const deduped = [];
    for (const item of out) {
      const s = String(item || "").trim();
      if (!s) continue;
      const key = s.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(s);
    }
    return deduped;
  }


  // ---------- shared relevance scorer (query-first signature): scoreDocKeyword(query, doc) ----------
  // ---------- shared relevance scorer (query-first signature): scoreDocKeyword(query, doc) ----------

  function getScoreFn() {
    const SCORE_FN_VERSION = "alias-max-v4";
    if (
      window.__mkScoreDocKeyword &&
      typeof window.__mkScoreDocKeyword === "function" &&
      window.__mkScoreDocKeyword.__version === SCORE_FN_VERSION
    ) {
      return window.__mkScoreDocKeyword;
    }

    const cache = new WeakMap();

    function tokenVariants(t) {
      const base = String(t || "");
      const vars = new Set();
      if (base) vars.add(base);
      const sing = stripPluralS(base);
      if (sing) vars.add(sing);
      const p = pluralS(sing || base);
      if (p) vars.add(p);
      return Array.from(vars).filter(Boolean);
    }

    function includesAny(hay, vars) {
      const src = String(hay || "");
      if (!src) return false;
      for (const v of vars) {
        if (v && src.includes(v)) return true;
      }
      return false;
    }

    function fieldStats(qNorm, fieldNorm) {
      const out = {
        ratio: 0,
        cov: 0,
        exact: false,
        prefix: false,
        strong: 0,
        weak: 0,
        mid: 0,
        lenTokens: 0,
        chars: 0,
      };

      const q = String(qNorm || "");
      const f = String(fieldNorm || "");
      if (!q || !f) return out;

      const qToks = q.split(" ").filter(Boolean);
      const fToks = f.split(" ").filter(Boolean);
      out.lenTokens = fToks.length;
      out.chars = f.replace(/\s+/g, "").length;

      const fieldSet = new Set(fToks);
      const fieldSetSing = new Set(fToks.map(stripPluralS));

      for (const t of qToks) {
        if (!t) continue;
        const ts = stripPluralS(t);

        if (fieldSet.has(t) || fieldSetSing.has(ts)) {
          out.strong += 1;
          continue;
        }

        if (ts.length >= 2) {
          for (const ft of fToks) {
            if (!ft) continue;
            if (ft.startsWith(t) || ft.startsWith(ts)) {
              out.weak += 1;
              break;
            }
            if (ft.includes(t) || ft.includes(ts)) {
              out.mid += 1;
              break;
            }
          }
        }
      }

      out.ratio = titleHitRatio(qToks, f.replace(/\s+/g, "")) || 0;
      out.cov = out.ratio;
      out.exact = f === q;
      if (f.startsWith(q)) {
        const ch = f.length === q.length ? "" : f.slice(q.length, q.length + 1);
        if (ch === "" || ch === " ") out.prefix = true;
      }
      return out;
    }

    function compareFieldStats(a, b) {
      const ar = Number(a && a.ratio) || 0;
      const br = Number(b && b.ratio) || 0;
      if (ar !== br) return ar - br;

      const ae = !!(a && a.exact);
      const be = !!(b && b.exact);
      if (ae !== be) return ae ? 1 : -1;

      const ap = !!(a && a.prefix);
      const bp = !!(b && b.prefix);
      if (ap !== bp) return ap ? 1 : -1;

      const astr = Number(a && a.strong) || 0;
      const bstr = Number(b && b.strong) || 0;
      if (astr !== bstr) return astr - bstr;

      const aw = Number(a && a.weak) || 0;
      const bw = Number(b && b.weak) || 0;
      if (aw !== bw) return aw - bw;

      const am = Number(a && a.mid) || 0;
      const bm = Number(b && b.mid) || 0;
      if (am !== bm) return am - bm;

      const ac = Number(a && a.chars) || Number.MAX_SAFE_INTEGER;
      const bc = Number(b && b.chars) || Number.MAX_SAFE_INTEGER;
      if (ac !== bc) return bc - ac;

      return 0;
    }

    function normDoc(doc) {
      if (!doc || typeof doc !== "object") {
        return {
          hay: "",
          title: "",
          tags: "",
          aliases: "",
          loc: "",
          file: "",
          text: "",
          titleFieldNorm: "",
          tagItemsNorm: [],
          aliasItemsNorm: [],
        };
      }
      const cached = cache.get(doc);
      if (cached) return cached;

      const loc = String(doc.location || "");
      const fileBase = fileBaseFromLocation(loc);
      const title = String(doc.title || "");
      const text = String(doc.text || "");
      const rawTags = Array.isArray(doc.tags) ? doc.tags : asStringList(doc.tags);
      const rawAliases = Array.isArray(doc.rawAliases)
        ? doc.rawAliases
        : (Array.isArray(doc.aliases) ? doc.aliases : asStringList(doc.aliases));
      const aliasHayList = Array.isArray(doc.aliases) ? doc.aliases : rawAliases;

      const titleNorm = normaliseForSearch(title);
      const tagsNorm = rawTags.map((x) => normaliseForSearch(x)).filter(Boolean);
      const aliasNorm = rawAliases.map((x) => normaliseForSearch(x)).filter(Boolean);
      const out = {
        title: titleNorm,
        tags: normaliseForSearch(rawTags.join(" ")),
        aliases: normaliseForSearch(aliasHayList.join(" ")),
        loc: normaliseForSearch(loc),
        file: normaliseForSearch(fileBase),
        text: normaliseForSearch(text),
        hay: "",
        titleFieldNorm: titleNorm,
        tagItemsNorm: tagsNorm,
        aliasItemsNorm: aliasNorm,
      };
      out.hay = normaliseForSearch(`${fileBase} ${title} ${rawTags.join(" ")} ${aliasHayList.join(" ")} ${text} ${loc}`);
      cache.set(doc, out);
      return out;
    }

    function bestStructuredStats(qNorm, n) {
      let best = fieldStats(qNorm, n.titleFieldNorm || "");
      best.kind = "title";
      best.value = n.titleFieldNorm || "";

      for (const item of (n.tagItemsNorm || [])) {
        const cand = fieldStats(qNorm, item);
        cand.kind = "tag";
        cand.value = item;
        if (compareFieldStats(cand, best) > 0) best = cand;
      }

      for (const item of (n.aliasItemsNorm || [])) {
        const cand = fieldStats(qNorm, item);
        cand.kind = "alias";
        cand.value = item;
        if (compareFieldStats(cand, best) > 0) best = cand;
      }

      return best;
    }

    function scoreDocKeyword(query, doc) {
      const qNorm = normaliseForSearch(query);
      const toks = qNorm ? qNorm.split(" ").filter(Boolean) : [];
      if (!toks.length) return 0;

      const n = normDoc(doc);
      for (const t of toks) {
        const vars = tokenVariants(t);
        if (!includesAny(n.hay, vars)) return 0;
      }

      const best = bestStructuredStats(qNorm, n);
      const maxCov = Number(best.ratio || best.cov || 0);
      let score = 0;

      if (maxCov > 0) {
        score += Math.round(maxCov * 10000);
        if (best.exact) score += 2500;
        if (best.prefix) score += 700;
        score += (Number(best.strong) || 0) * 120;
        score += (Number(best.weak) || 0) * 40;
        score += (Number(best.mid) || 0) * 20;
        score += Math.max(0, 12 - Math.min(12, Number(best.lenTokens) || 0));
      }

      for (const t of toks) {
        const vars = tokenVariants(t);
        if (includesAny(n.loc, vars) || includesAny(n.file, vars)) score += 120;
        if (includesAny(n.text, vars)) score += 80;
      }

      return score;
    }

    scoreDocKeyword.coverage = (query, doc) => {
      try {
        const n = normDoc(doc);
        const best = bestStructuredStats(normaliseForSearch(query), n);
        return Number(best.ratio || best.cov || 0);
      } catch (_) {
        return 0;
      }
    };

    scoreDocKeyword.bestMatch = (query, doc) => {
      try {
        const n = normDoc(doc);
        return bestStructuredStats(normaliseForSearch(query), n);
      } catch (_) {
        return { kind: "", value: "", ratio: 0, cov: 0, exact: false, prefix: false, strong: 0, weak: 0, mid: 0, lenTokens: 0, chars: 0 };
      }
    };

    scoreDocKeyword.__version = SCORE_FN_VERSION;
    window.__mkScoreDocKeyword = scoreDocKeyword;
    return scoreDocKeyword;
  }


  // ---------- course scope: use directory name in URL ----------
  // ---------- course scope: use directory name in URL ----------
  function getCourseKeyFromUrl() {
    const segs = window.location.pathname.split("/").filter(Boolean);
    return segs.length >= 2 ? segs[segs.length - 2] : "";
  }

  function inSameCourseByKey(location, courseKey) {
    const loc = safePath(location);
    if (!courseKey) return false;
    return loc.includes("/" + courseKey + "/");
  }


  // ---------- input history + suggestions ----------
  function csrReadInputHistory() {
    try {
      const raw = localStorage.getItem(CSR_INPUT_HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr)
        ? arr.map((x) => String(x || "").trim()).filter(Boolean)
        : [];
    } catch (_) {
      return [];
    }
  }

  function csrWriteInputHistory(arr) {
    try {
      localStorage.setItem(
        CSR_INPUT_HISTORY_KEY,
        JSON.stringify(
          (arr || [])
            .map((x) => String(x || "").trim().replace(/\s+/g, " "))
            .filter(Boolean)
            .slice(0, CSR_INPUT_HISTORY_MAX)
        )
      );
    } catch (_) {}
  }

  function csrAddInputHistory(raw) {
    const s = String(raw || "").trim().replace(/\s+/g, " ");
    if (!s) return;
    const curr = csrReadInputHistory();
    const next = [s, ...curr.filter((x) => x.toLowerCase() !== s.toLowerCase())];
    csrWriteInputHistory(next);
  }

  function csrRemoveInputHistory(raw) {
    const s = String(raw || "").trim();
    if (!s) return;
    csrWriteInputHistory(
      csrReadInputHistory().filter((x) => x.toLowerCase() !== s.toLowerCase())
    );
  }

  function csrClearInputHistory() {
    csrWriteInputHistory([]);
  }

  function csrMarkAssistInteraction() {
    __csrAssistUi.suppressBlurHideUntil = Date.now() + 280;
  }

  function csrGetSearchForm() {
    return document.getElementById("course-search-form");
  }

  function csrGetSearchInput() {
    return document.getElementById("course-search-input");
  }

  function csrGetAssistDropdown() {
    const form = csrGetSearchForm();
    return form ? form.querySelector(".csr-courseassist-dropdown") : null;
  }

  function csrGetAssistRows() {
    const dd = csrGetAssistDropdown();
    return dd ? Array.from(dd.querySelectorAll(".csr-courseassist-item")) : [];
  }

  function csrHasOpenAssistDropdown() {
    const dd = csrGetAssistDropdown();
    return !!(dd && dd.style.display !== "none" && dd.children && dd.children.length);
  }

  function csrIsDesktopAssistViewport() {
    try {
      if (window.matchMedia) {
        return !!window.matchMedia("(min-width: 721px) and (hover: hover) and (pointer: fine)").matches;
      }
    } catch (_) {}
    return (window.innerWidth || document.documentElement.clientWidth || 0) >= 721;
  }

  function csrEnsureCourseAssistStyles() {
    if (document.getElementById("csr-courseassist-style-v2")) return;
    const old = document.getElementById("csr-courseassist-style-v1");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const st = document.createElement("style");
    st.id = "csr-courseassist-style-v2";
    st.textContent = `
      #course-search-form{
        position: relative;
        --csr-assist-row-h: 48px;
      }
      #course-search-form .csr-courseassist-dropdown{
        position:absolute;
        left:0;
        top: calc(100% - 1px);
        width:100%;
        right:auto;
        z-index: 8;
        display:none;
        overflow:auto;
        overscroll-behavior: contain;
        max-height:min(54vh, 420px);
        border-radius: 22px;
        border:1px solid rgba(148,163,184,.18);
        background: rgba(255,255,255,.42);
        box-shadow: 0 16px 36px rgba(15,23,42,.14);
        backdrop-filter: blur(16px) saturate(135%);
        -webkit-backdrop-filter: blur(16px) saturate(135%);
      }
      #course-search-form .csr-courseassist-dropdown:empty{
        display:none !important;
      }
      html[data-md-color-scheme="slate"] #course-search-form .csr-courseassist-dropdown,
      body[data-md-color-scheme="slate"] #course-search-form .csr-courseassist-dropdown{
        border-color: rgba(148,163,184,.16);
        background: rgba(30,41,59,.44);
        box-shadow: 0 16px 36px rgba(0,0,0,.26);
      }
      #course-search-form .csr-courseassist-note{
        min-height: var(--csr-assist-row-h, 48px);
        padding: 0 26px;
        display:flex;
        align-items:center;
        gap:10px;
        font-size: .84rem;
        line-height: 1.15;
        color: var(--md-default-fg-color--light);
        border-bottom: 1px solid rgba(148,163,184,.12);
        background: linear-gradient(90deg, rgba(6,182,212,.10), rgba(6,182,212,.04));
      }
      #course-search-form .csr-courseassist-note strong{
        font-weight: 650;
        color: inherit;
      }
      #course-search-form .csr-courseassist-note em{
        font-style: normal;
        font-weight: 700;
        color: #00d5c8;
      }
      #course-search-form .csr-courseassist-item{
        width:100%;
        background: transparent;
        color: inherit;
        text-align:left;
        cursor:pointer;
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        align-items:center;
        gap:14px;
        min-height: var(--csr-assist-row-h, 48px);
        height: var(--csr-assist-row-h, 48px);
        max-height: var(--csr-assist-row-h, 48px);
        padding: 0 26px;
        font: inherit;
        box-sizing: border-box;
      }
      #course-search-form .csr-courseassist-item + .csr-courseassist-item{
        border-top: 1px solid rgba(148,163,184,.12);
      }
      #course-search-form .csr-courseassist-item:hover,
      #course-search-form .csr-courseassist-item.is-active{
        background: transparent;
      }
      #course-search-form .csr-courseassist-main{
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.84rem;
        font-weight:500;
        line-height:1;
        transition: color 140ms ease, opacity 140ms ease;
      }
      #course-search-form .csr-courseassist-item:hover .csr-courseassist-main,
      #course-search-form .csr-courseassist-item.is-active .csr-courseassist-main{
        color: var(--md-accent-fg-color);
        opacity: 1;
      }
      @supports selector(:has(*)){
        #course-search-form .csr-courseassist-item:has(.csr-courseassist-del:hover) .csr-courseassist-main,
        #course-search-form .csr-courseassist-item:has(.csr-courseassist-del:focus-visible) .csr-courseassist-main{
          color: inherit;
        }
      }
      #course-search-form .csr-courseassist-meta{
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.82rem;
        font-weight:500;
        line-height:1;
        color: var(--md-default-fg-color--light);
        justify-self:end;
      }
      #course-search-form .csr-courseassist-item.is-history{
        grid-template-columns:minmax(0,1fr) auto;
      }
      #course-search-form .csr-courseassist-del{
        appearance:none;
        -webkit-appearance:none;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        justify-self:end;
        width: 1.9rem;
        height: 1.9rem;
        min-width: 1.9rem;
        min-height: 1.9rem;
        margin-left: 2px;
        padding:0;
        border:0;
        border-radius:0;
        background: transparent;
        box-shadow:none;
        outline:none;
        color: var(--md-default-fg-color--light);
        font-size: 1rem;
        line-height:1;
        text-decoration:none;
        cursor:pointer;
        -webkit-tap-highlight-color: transparent;
        transition: color 140ms ease, opacity 140ms ease, transform 140ms ease;
      }
      #course-search-form .csr-courseassist-del:hover,
      #course-search-form .csr-courseassist-del:focus,
      #course-search-form .csr-courseassist-del:focus-visible{
        background: transparent;
        box-shadow:none;
        outline:none;
        color: var(--md-accent-fg-color);
      }
      html[data-md-color-scheme="default"] #course-search-form .csr-courseassist-del:hover,
      html[data-md-color-scheme="default"] #course-search-form .csr-courseassist-del:focus,
      html[data-md-color-scheme="default"] #course-search-form .csr-courseassist-del:focus-visible,
      body[data-md-color-scheme="default"] #course-search-form .csr-courseassist-del:hover,
      body[data-md-color-scheme="default"] #course-search-form .csr-courseassist-del:focus,
      body[data-md-color-scheme="default"] #course-search-form .csr-courseassist-del:focus-visible{
        color: var(--md-accent-fg-color) !important;
      }
      #course-search-form .csr-courseassist-del::before,
      #course-search-form .csr-courseassist-del::after{
        display:none;
        content:none;
      }
      #course-search-form .csr-courseassist-footer{
        min-height: var(--csr-assist-row-h, 48px);
        padding: 0 26px;
        display:flex;
        align-items:center;
        justify-content:flex-end;
        border-top: 1px solid rgba(148,163,184,.12);
        background: rgba(255,255,255,.08);
      }
      html[data-md-color-scheme="slate"] #course-search-form .csr-courseassist-footer,
      body[data-md-color-scheme="slate"] #course-search-form .csr-courseassist-footer{
        background: rgba(255,255,255,.03);
      }
      #course-search-form .csr-courseassist-clear{
        appearance:none;
        -webkit-appearance:none;
        margin:0;
        padding:0;
        border:0;
        border-radius:0;
        background: transparent;
        box-shadow:none;
        outline:none;
        color: var(--md-default-fg-color--light);
        font-size: .74rem;
        font-weight: 550;
        line-height: 1.1;
        text-decoration:none;
        cursor:pointer;
        -webkit-tap-highlight-color: transparent;
        transition: color 140ms ease, opacity 140ms ease;
      }
      #course-search-form .csr-courseassist-clear:hover,
      #course-search-form .csr-courseassist-clear:focus,
      #course-search-form .csr-courseassist-clear:focus-visible{
        background: transparent;
        box-shadow:none;
        outline:none;
        color: var(--md-accent-fg-color);
      }
      html[data-md-color-scheme="default"] #course-search-form .csr-courseassist-clear:hover,
      html[data-md-color-scheme="default"] #course-search-form .csr-courseassist-clear:focus,
      html[data-md-color-scheme="default"] #course-search-form .csr-courseassist-clear:focus-visible,
      body[data-md-color-scheme="default"] #course-search-form .csr-courseassist-clear:hover,
      body[data-md-color-scheme="default"] #course-search-form .csr-courseassist-clear:focus,
      body[data-md-color-scheme="default"] #course-search-form .csr-courseassist-clear:focus-visible{
        color: var(--md-accent-fg-color) !important;
      }
      #course-search-form .csr-courseassist-clear::before,
      #course-search-form .csr-courseassist-clear::after{
        display:none;
        content:none;
      }

      /* Keep sort icons/text white in dark mode */
      html[data-md-color-scheme="slate"] .mk-sortbtn,
      html[data-md-color-scheme="slate"] .mk-sortopt,
      body[data-md-color-scheme="slate"] .mk-sortbtn,
      body[data-md-color-scheme="slate"] .mk-sortopt{
        color: rgba(255,255,255,.92) !important;
      }
      html[data-md-color-scheme="slate"] .mk-sortbtn__ico,
      html[data-md-color-scheme="slate"] .mk-sortbtn__chev,
      html[data-md-color-scheme="slate"] .mk-sortopt__ico,
      body[data-md-color-scheme="slate"] .mk-sortbtn__ico,
      body[data-md-color-scheme="slate"] .mk-sortbtn__chev,
      body[data-md-color-scheme="slate"] .mk-sortopt__ico{
        color: rgba(255,255,255,.92) !important;
        opacity: .96 !important;
      }

      @media (min-width: 721px){
        #course-search-form .csr-courseassist-dropdown{
          z-index: 3;
        }
      }

      @media (max-width: 720px){
        #course-search-form .csr-courseassist-dropdown{
          top: calc(100% - 1px);
          border-radius: 18px;
        }
        #course-search-form .csr-courseassist-item,
        #course-search-form .csr-courseassist-note,
        #course-search-form .csr-courseassist-footer{
          padding-left: 18px;
          padding-right: 18px;
        }
      }
    `;
    document.head.appendChild(st);
  }

  function csrEnsureCourseAssistUi(form, input) {
    csrEnsureCourseAssistStyles();
    if (!form || !input) return null;

    let dd = form.querySelector(".csr-courseassist-dropdown");
    if (!dd) {
      dd = document.createElement("div");
      dd.className = "csr-courseassist-dropdown";
      dd.setAttribute("role", "listbox");
      dd.style.display = "none";
      form.appendChild(dd);
    }

    csrSyncAssistGeometry();
    return dd;
  }

  function csrSyncAssistMetrics() {
    const form = csrGetSearchForm();
    const input = csrGetSearchInput();
    if (!form || !input) return;
    try {
      const submitBtn = form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');
      const h1 = Math.round(input.getBoundingClientRect().height || input.offsetHeight || 0);
      const h2 = submitBtn ? Math.round(submitBtn.getBoundingClientRect().height || submitBtn.offsetHeight || 0) : 0;
      const h = Math.max(44, h1, h2);
      form.style.setProperty("--csr-assist-row-h", h + "px");
    } catch (_) {}
  }

  function csrSyncAssistGeometry() {
    const form = csrGetSearchForm();
    const input = csrGetSearchInput();
    const dd = csrGetAssistDropdown();
    if (!form || !input || !dd) return;
    try {
      const formRect = form.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();

      const left = Math.max(0, Math.round(inputRect.left - formRect.left));
      const top = Math.max(0, Math.round(inputRect.bottom - formRect.top - 1));
      const width = Math.max(0, Math.round(inputRect.width));

      if (width >= 120) {
        dd.style.left = left + "px";
        dd.style.width = width + "px";
        dd.style.right = "auto";
      }
      dd.style.top = top + "px";
    } catch (_) {}
  }

  function csrGetDesktopTopChromeBottom() {
    if (!csrIsDesktopAssistViewport()) return 0;
    let topBottom = 0;
    try {
      const seen = new Set();
      const nodes = document.querySelectorAll('.md-header, .md-tabs, [data-md-component="header"], [data-md-component="tabs"]');
      nodes.forEach((node) => {
        if (!node || seen.has(node)) return;
        seen.add(node);
        const cs = window.getComputedStyle ? window.getComputedStyle(node) : null;
        if (!cs || cs.display === 'none' || cs.visibility === 'hidden') return;
        const pos = String(cs.position || '').toLowerCase();
        if (pos !== 'fixed' && pos !== 'sticky') return;
        const rect = node.getBoundingClientRect();
        if (!rect || rect.height <= 0 || rect.width <= 0) return;
        topBottom = Math.max(topBottom, Math.round(rect.bottom));
      });
    } catch (_) {}
    return Math.max(0, topBottom);
  }

  function csrSyncAssistViewportClip() {
    const dd = csrGetAssistDropdown();
    if (!dd) return;
    if (dd.style.display === 'none') {
      dd.style.clipPath = '';
      dd.style.webkitClipPath = '';
      return;
    }
    if (!csrIsDesktopAssistViewport()) {
      dd.style.clipPath = '';
      dd.style.webkitClipPath = '';
      return;
    }
    try {
      const topChromeBottom = csrGetDesktopTopChromeBottom();
      const rect = dd.getBoundingClientRect();
      if (!rect || rect.height <= 0) {
        dd.style.clipPath = '';
        dd.style.webkitClipPath = '';
        return;
      }
      const overlap = Math.max(0, Math.ceil(topChromeBottom - rect.top));
      if (overlap <= 0) {
        dd.style.clipPath = '';
        dd.style.webkitClipPath = '';
        return;
      }
      const insetTop = Math.min(Math.max(0, overlap), Math.max(0, Math.ceil(rect.height - 2)));
      const clipValue = `inset(${insetTop}px 0 0 0 round 22px)`;
      dd.style.clipPath = clipValue;
      dd.style.webkitClipPath = clipValue;
    } catch (_) {
      dd.style.clipPath = '';
      dd.style.webkitClipPath = '';
    }
  }

  function csrSetAssistActiveIndex(idx) {
    const rows = csrGetAssistRows();
    if (!rows.length) {
      __csrAssistUi.activeIndex = -1;
      return;
    }
    let next = Number.isFinite(idx) ? Math.trunc(idx) : -1;
    if (next < 0 || next >= rows.length) next = -1;
    __csrAssistUi.activeIndex = next;
    rows.forEach((row, i) => row.classList.toggle("is-active", i === next));
    if (next >= 0) {
      try { rows[next].scrollIntoView({ block: "nearest" }); } catch (_) {}
    }
  }

  function csrHideAssistDropdown() {
    const dd = csrGetAssistDropdown();
    if (!dd) return;
    dd.style.display = "none";
    dd.innerHTML = "";
    __csrAssistUi.items = [];
    __csrAssistUi.lastNoteFix = "";
    csrSetAssistActiveIndex(-1);
  }

  function csrApplyAssistChoice(text, opts) {
    csrTrackActivity("search_suggestion", { text: String(text || "").slice(0, 120) }, { scope: "search_suggestion:" + String(text || "").slice(0, 80), throttleMs: 30000 });
    const input = csrGetSearchInput();
    if (!input) return;
    const next = String(text || "").trim();
    if (!next) return;
    input.value = next;
    __csrAssistUi.lastApplied = next;
    try {
      input.focus();
      const end = next.length;
      if (typeof input.setSelectionRange === "function") input.setSelectionRange(end, end);
    } catch (_) {}
    csrHideAssistDropdown();
    csrSyncAssistGeometry();
    if (opts && opts.refresh) {
      csrRefreshAssistSoon(0);
    }
  }

  async function csrLoadAssistScope() {
    const courseKey = getCourseKeyFromUrl();
    if (__csrAssistUi.scopePromise && __csrAssistUi.scopeCacheKey === courseKey) {
      return __csrAssistUi.scopePromise;
    }

    __csrAssistUi.scopeCacheKey = courseKey;
    __csrAssistUi.scopePromise = (async () => {
      const indexJson = await loadIndex();
      const docs = indexJson.docs || [];
      const pages = csrAggregateDocsToPages(docs)
        .filter((p) => inSameCourseByKey(p.location, courseKey))
        .map((p) => {
          const lec = lectureInfoFromTags(Array.isArray(p.tags) ? p.tags : []);
          return {
            ...p,
            lectureText: lec ? (lec.unitLabel || `Lecture ${lec.lectureNum}`) : "",
          };
        });
      return pages;
    })();

    return __csrAssistUi.scopePromise;
  }

  function csrFindAssistMatches(pages, keyword, maxItems) {
    const scoreDocKeyword = getScoreFn();
    const limit = Math.max(4, Number(maxItems) || 8);

    return (pages || [])
      .map((p, i) => ({
        page: p,
        score: scoreDocKeyword(keyword, p),
        cov: (scoreDocKeyword.coverage ? scoreDocKeyword.coverage(keyword, p) : 0),
        i,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) =>
        (b.score - a.score) ||
        ((b.cov || 0) - (a.cov || 0)) ||
        String(a.page.title || "").localeCompare(String(b.page.title || ""))
      )
      .slice(0, limit)
      .map((x) => ({
        kind: "suggest",
        text: String(x.page.title || ""),
        meta: String(x.page.lectureText || ""),
        location: String(x.page.location || ""),
      }));
  }

  async function csrBuildAssistState(raw, maxItems) {
    const q = String(raw || "").trim().replace(/\s+/g, " ");
    const limit = Math.max(4, Number(maxItems) || 8);
    const pages = await csrLoadAssistScope();

    if (!q) {
      const items = csrReadInputHistory().slice(0, limit).map((text) => ({
        kind: "history",
        text,
      }));
      return { items, noteFix: "", noteHtml: "" };
    }

    let effective = q;
    let items = csrFindAssistMatches(pages, q, limit);
    const strictAny = csrStrictAnyResult(pages, q);
    let noteFix = "";
    let noteHtml = "";

    if ((!strictAny || !items.length) && q) {
      try {
        const fix = await csrTryAutoCorrectOnNoResults(q, pages, getCourseKeyFromUrl());
        if (fix && fix.to && fix.to.toLowerCase() !== q.toLowerCase()) {
          effective = fix.to;
          noteFix = fix.to;
          items = csrFindAssistMatches(pages, effective, limit);
          noteHtml =
            `No exact matches for <strong>${escapeHtml(q)}</strong>` +
            ` <span aria-hidden="true">·</span> Showing suggestions for <em>${escapeHtml(effective)}</em>`;
        }
      } catch (_) {}
    }

    return { items, noteFix, noteHtml };
  }

  function csrRenderAssistDropdown(items, opts) {
    const dd = csrGetAssistDropdown();
    if (!dd) return;

    const rows = Array.isArray(items) ? items : [];
    const noteHtml = opts && opts.noteHtml ? String(opts.noteHtml) : "";
    const noteFix = opts && opts.noteFix ? String(opts.noteFix) : "";

    if (!rows.length && !noteHtml) {
      csrHideAssistDropdown();
      return;
    }

    dd.innerHTML = "";
    __csrAssistUi.items = rows.slice();
    __csrAssistUi.lastNoteFix = noteFix;

    if (noteHtml) {
      const note = document.createElement("div");
      note.className = "csr-courseassist-note";
      note.innerHTML = noteHtml;
      if (noteFix) {
        note.tabIndex = -1;
        const applyNote = (ev) => {
          csrMarkAssistInteraction();
          if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
          }
          csrApplyAssistChoice(noteFix, { refresh: true });
        };
        note.addEventListener("pointerdown", applyNote, true);
        note.addEventListener("mousedown", applyNote, true);
        note.addEventListener("click", applyNote);
      }
      dd.appendChild(note);
    }

    for (const item of rows) {
      const row = document.createElement("div");
      row.className = "csr-courseassist-item";
      row.setAttribute("role", "option");
      row.tabIndex = -1;
      row.dataset.csrValue = String(item.text || "");
      if (item.kind === "history") row.classList.add("is-history");

      const main = document.createElement("div");
      main.className = "csr-courseassist-main";
      main.innerHTML = escapeHtml(item.text || "");
      row.appendChild(main);

      if (item.kind === "history") {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "csr-courseassist-del";
        del.setAttribute("aria-label", "Remove");
        del.textContent = "×";
        del.addEventListener("pointerdown", (ev) => {
          csrMarkAssistInteraction();
          ev.preventDefault();
          ev.stopPropagation();
        }, true);
        del.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          csrRemoveInputHistory(item.text || "");
          csrRefreshAssistSoon(0);
        });
        row.appendChild(del);
      } else {
        const meta = document.createElement("div");
        meta.className = "csr-courseassist-meta";
        meta.textContent = String(item.meta || "");
        row.appendChild(meta);
      }

      const pick = (ev) => {
        if (ev && ev.target && ev.target.closest && ev.target.closest(".csr-courseassist-del")) return;
        csrMarkAssistInteraction();
        if (ev) {
          ev.preventDefault();
          ev.stopPropagation();
        }
        csrApplyAssistChoice(item.text || "", { refresh: false });
      };
      row.addEventListener("pointerdown", pick, true);
      row.addEventListener("mousedown", pick, true);
      row.addEventListener("click", pick);

      dd.appendChild(row);
    }

    if (!String(csrGetSearchInput() && csrGetSearchInput().value || "").trim() &&
        rows.some((item) => item && item.kind === "history")) {
      const footer = document.createElement("div");
      footer.className = "csr-courseassist-footer";
      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "csr-courseassist-clear";
      clear.textContent = "Clear history";
      clear.addEventListener("pointerdown", (ev) => {
        csrMarkAssistInteraction();
        ev.preventDefault();
        ev.stopPropagation();
      }, true);
      clear.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        csrClearInputHistory();
        csrRefreshAssistSoon(0);
      });
      footer.appendChild(clear);
      dd.appendChild(footer);
    }

    dd.style.display = "block";
    dd.style.visibility = "hidden";
    csrSyncAssistGeometry();
    csrSyncAssistViewportClip();
    csrSetAssistActiveIndex(-1);

    Promise.resolve(typesetMathAsync(dd)).finally(() => {
      if (!dd || dd !== csrGetAssistDropdown()) return;
      dd.style.visibility = "visible";
      csrSyncAssistGeometry();
      csrSyncAssistViewportClip();
    });
  }

  async function csrRefreshAssistUiNow() {
    const input = csrGetSearchInput();
    const dd = csrGetAssistDropdown();
    if (!input || !dd) return;

    const seq = ++__csrAssistUi.requestSeq;
    const value = String(input.value || "");

    try {
      const state = await csrBuildAssistState(value, 8);
      if (seq !== __csrAssistUi.requestSeq) return;
      csrRenderAssistDropdown(state.items, state);
    } catch (_) {
      if (seq !== __csrAssistUi.requestSeq) return;
      csrHideAssistDropdown();
    }
  }

  function csrRefreshAssistSoon(delay) {
    window.clearTimeout(__csrAssistUi.timer || 0);
    __csrAssistUi.timer = window.setTimeout(() => {
      csrRefreshAssistUiNow();
    }, Math.max(0, Number(delay) || 0));
  }

  function csrEnsureAssistBinding(form, input) {
    if (!form || !input || form.dataset.csrAssistBound === "1") return;
    form.dataset.csrAssistBound = "1";

    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("spellcheck", "false");

    input.addEventListener("focus", () => {
      csrSyncAssistGeometry();
      csrRefreshAssistSoon(0);
      try {
        const clearBtn = document.getElementById("csr-mobile-clear");
        if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
      } catch (_) {}
    }, { passive: true });

    input.addEventListener("click", () => {
      csrProtectCourseSearchFocus(700);
      csrSyncAssistGeometry();
      csrRefreshAssistSoon(0);
      try {
        const clearBtn = document.getElementById("csr-mobile-clear");
        if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
      } catch (_) {}
    }, { passive: true });

    input.addEventListener("focus", () => {
      csrProtectCourseSearchFocus(850);
      csrBeginInPlaceSearchGuard(1800);
      csrKeepMobileSearchBackdropHidden(1800);
      csrCloseMaterialSearchOverlayForCourseSearch();
    }, true);

    form.addEventListener("pointerdown", () => {
      csrProtectCourseSearchFocus(850);
      csrBeginInPlaceSearchGuard(1600);
      csrKeepMobileSearchBackdropHidden(1600);
    }, true);

    input.addEventListener("input", () => {
      csrHideFuzzyNote();
      __csrAssistUi.lastApplied = String(input.value || "");
      csrRefreshAssistSoon(0);
    });

    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (Date.now() < (__csrAssistUi.suppressBlurHideUntil || 0)) return;
        csrHideAssistDropdown();
        try {
          const clearBtn = document.getElementById("csr-mobile-clear");
          if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
        } catch (_) {}
      }, 90);
    });

    input.addEventListener("keydown", (ev) => {
      const dd = csrGetAssistDropdown();
      const visible = !!(dd && dd.style.display !== "none" && dd.children.length);
      const items = Array.isArray(__csrAssistUi.items) ? __csrAssistUi.items : [];
      let idx = Number(__csrAssistUi.activeIndex);
      if (!Number.isFinite(idx)) idx = -1;

      if (!visible) {
        if (ev.key === "ArrowDown") {
          csrRefreshAssistSoon(0);
        } else if (ev.key === "Escape") {
          csrHideAssistDropdown();
        }
        return;
      }

      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        ev.stopPropagation();
        idx = Math.min(items.length - 1, idx + 1);
        csrSetAssistActiveIndex(idx);
        return;
      }

      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        ev.stopPropagation();
        idx = Math.max(-1, idx - 1);
        csrSetAssistActiveIndex(idx);
        return;
      }

      if (ev.key === "Enter" && idx >= 0 && items[idx]) {
        ev.preventDefault();
        ev.stopPropagation();
        csrApplyAssistChoice(items[idx].text || "", { refresh: false });
        return;
      }

      if (ev.key === "Escape") {
        ev.preventDefault();
        ev.stopPropagation();
        csrHideAssistDropdown();
      }
    });

    if (!__csrAssistUi.outsideClickBound) {
      __csrAssistUi.outsideClickBound = true;
      document.addEventListener("click", (ev) => {
        const ddNow = csrGetAssistDropdown();
        const formNow = csrGetSearchForm();
        if (!ddNow || !formNow || ddNow.style.display === "none") return;
        if (formNow.contains(ev.target)) return;
        csrHideAssistDropdown();
      }, true);
    }

    if (!__csrAssistUi.resizeBound) {
      __csrAssistUi.resizeBound = true;
      window.addEventListener("resize", () => {
        csrSyncAssistMetrics();
        csrSyncAssistGeometry();
        csrSyncAssistViewportClip();
      }, { passive: true });
    }

    if (!__csrAssistUi.scrollBound) {
      __csrAssistUi.scrollBound = true;
      window.addEventListener("scroll", () => {
        if (!csrHasOpenAssistDropdown()) return;
        csrSyncAssistGeometry();
        csrSyncAssistViewportClip();
      }, { passive: true, capture: true });
    }
  }

  // ---------- sorting ----------

  function yearCourseFromLocation(loc) {
    const s = String(loc || "").replace(/^\/+/, "");
    const segs = s.split("/").filter(Boolean);
    return { year: segs[0] || "", course: segs[1] || "" };
  }

  function yearOrderFromFolder(yearFolder) {
    const m = String(yearFolder).match(/year-(\d+)/i);
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  function courseOrderFromFolder(folder) {
    const m = String(folder).match(/^(\d+)([a-z])-/i);
    if (!m) return Number.MAX_SAFE_INTEGER;
    const num = parseInt(m[1], 10);
    const letter = (m[2] || "z").toLowerCase();
    const letterIndex = Math.max(0, letter.charCodeAt(0) - 97);
    return num * 100 + letterIndex;
  }

  function lectureNumberFromMeta(meta) {
    const s = String(meta || "");
    const m = s.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function csrUnitNounFromItems(items) {
    let week = 0;
    let lecture = 0;
    (Array.isArray(items) ? items : []).forEach((item) => {
      const info = unitInfoFromTags(item && item.tags);
      if (info && info.unitType === "week") week += 1;
      else if (info) lecture += 1;
      else {
        const meta = String(item && item.meta || "").toLowerCase();
        if (/\bweek\b/.test(meta)) week += 1;
        else if (/\blecture\b/.test(meta)) lecture += 1;
      }
    });
    return week > lecture ? "Week" : "Lecture";
  }

  function csrCurrentUnitNoun() {
    return csrUnitNounFromItems(CSR_STATE.items);
  }

  function setSort(key) {
    if (CSR_STATE.sortKey === key) {
      CSR_STATE.sortDir = CSR_STATE.sortDir === "asc" ? "desc" : "asc";
    } else {
      CSR_STATE.sortKey = key;
      CSR_STATE.sortDir = "asc";
    }
    CSR_STATE.page = 1;
  }

  
function getSortedItems(items) {
  const dir = CSR_STATE.sortDir === "desc" ? -1 : 1;
  const key = CSR_STATE.sortKey || "best";

  const arr = items.slice();
  arr.sort((a, b) => {
    const ta = String(a.title || "");
    const tb = String(b.title || "");

    // Most viewed (30d)
    if (key === "views30d") {
      const va = csrViewsCountFor(a);
      const vb = csrViewsCountFor(b);
      if (vb !== va) return vb - va;

      // tie-break: relevance, then course lecture order, then title
      const sa = Number(a.score) || 0;
      const sb = Number(b.score) || 0;
      if (sb !== sa) return sb - sa;

      const ca = Number(a.cov) || 0;
      const cb = Number(b.cov) || 0;
      if (cb !== ca) return cb - ca;

      const pa = yearCourseFromLocation(a.location);
      const pb = yearCourseFromLocation(b.location);

      const ya = yearOrderFromFolder(pa.year);
      const yb = yearOrderFromFolder(pb.year);
      if (ya !== yb) return ya - yb;

      const oa = courseOrderFromFolder(pa.course);
      const ob = courseOrderFromFolder(pb.course);
      if (oa !== ob) return oa - ob;

      const laNum = lectureInfoFromTags(a.tags)?.lectureNum || 0;
      const lbNum = lectureInfoFromTags(b.tags)?.lectureNum || 0;
      if (laNum !== lbNum) return laNum - lbNum;

      const c1 = ta.localeCompare(tb, undefined, { sensitivity: "base" });
      if (c1 !== 0) return c1;

      const la = String(a.location || "");
      const lb = String(b.location || "");
      const c2 = la.localeCompare(lb, undefined, { sensitivity: "base" });
      if (c2 !== 0) return c2;

      return (Number(a.__i) || 0) - (Number(b.__i) || 0);
    }

    // Default: relevance (best match)
    if (key !== "title" && key !== "lecture") {
      const sa = Number(a.score) || 0;
      const sb = Number(b.score) || 0;
      if (sb !== sa) return sb - sa;

      const ca = Number(a.cov) || 0;
      const cb = Number(b.cov) || 0;
      if (cb !== ca) return cb - ca;

      const pa = yearCourseFromLocation(a.location);
      const pb = yearCourseFromLocation(b.location);

      const ya = yearOrderFromFolder(pa.year);
      const yb = yearOrderFromFolder(pb.year);
      if (ya !== yb) return ya - yb;

      const oa = courseOrderFromFolder(pa.course);
      const ob = courseOrderFromFolder(pb.course);
      if (oa !== ob) return oa - ob;

      const laNum = lectureInfoFromTags(a.tags)?.lectureNum || 0;
      const lbNum = lectureInfoFromTags(b.tags)?.lectureNum || 0;
      if (laNum !== lbNum) return laNum - lbNum;

      const c1 = ta.localeCompare(tb, undefined, { sensitivity: "base" });
      if (c1 !== 0) return c1;

      const la = String(a.location || "");
      const lb = String(b.location || "");
      const c2 = la.localeCompare(lb, undefined, { sensitivity: "base" });
      if (c2 !== 0) return c2;

      return (Number(a.__i) || 0) - (Number(b.__i) || 0);
    }

    if (key === "lecture") {
      const pa = yearCourseFromLocation(a.location);
      const pb = yearCourseFromLocation(b.location);

      const ya = yearOrderFromFolder(pa.year);
      const yb = yearOrderFromFolder(pb.year);
      if (ya !== yb) return (ya - yb) * dir;

      const oa = courseOrderFromFolder(pa.course);
      const ob = courseOrderFromFolder(pb.course);
      if (oa !== ob) return (oa - ob) * dir;

      const laNum = lectureInfoFromTags(a.tags)?.lectureNum || 0;
      const lbNum = lectureInfoFromTags(b.tags)?.lectureNum || 0;
      if (laNum !== lbNum) return (laNum - lbNum) * dir;

      return ta.localeCompare(tb, undefined, { sensitivity: "base" }) * dir;
    }

    // title
    const c = ta.localeCompare(tb, undefined, { sensitivity: "base" });
    if (c !== 0) return c * dir;
    return (Number(a.__i) || 0) - (Number(b.__i) || 0);
  });

  return arr;
}

  // ---------- width sync: results width == search bar width ----------
  function syncResultsWidthToSearchBar(out) {
  try {
    const form = document.getElementById("course-search-form");
    const wrap = out.querySelector(".csr-wrap");
    if (!form || !wrap) return;

    const formRect = form.getBoundingClientRect();
    const outRect = out.getBoundingClientRect();

    const w = Math.round(formRect.width);
    const dx = Math.round(formRect.left - outRect.left);

    if (!w || w < 200) return;

    // 宽度完全等于搜索栏（含按钮）
    wrap.style.boxSizing = "border-box";
    wrap.style.width = `${w}px`;
    wrap.style.maxWidth = `${w}px`;

    // 关键：不再用 position/left，只用 margin-left 把它推到和搜索栏同一条竖线
    wrap.style.position = "static";
    wrap.style.left = "";
    wrap.style.marginLeft = `${Math.max(0, dx)}px`;
    wrap.style.marginRight = "0";
  } catch (_) {}
}


  // ---------- pager: Prev 1 2 3 ... Next ----------
  function buildPageButtons(totalPages, cur) {
    const tp = Math.max(1, totalPages);
    const p = Math.min(Math.max(1, cur), tp);

    const isMobile = typeof window !== "undefined" && !!(window.matchMedia && window.matchMedia("(max-width: 720px)").matches);

    let maxNumeric = 9;
    if (isMobile) {
      const vw = Math.max(
        (document.documentElement && document.documentElement.clientWidth) || 0,
        window.innerWidth || 0,
        320
      );
      const digits = String(tp).length;
      const pageChip = digits >= 3 ? 38 : (digits === 2 ? 32 : 24);
      const gap = 8;
      const navWidth = 88;
      const outerPad = 32;
      const available = Math.max(140, vw - navWidth - outerPad);
      maxNumeric = Math.max(5, Math.min(tp, Math.floor((available + gap) / (pageChip + gap))));
    }

    if (tp <= maxNumeric) {
      return Array.from({ length: tp }, (_, i) => i + 1);
    }

    const middleSlots = Math.max(1, maxNumeric - 2);
    let start = Math.max(2, p - Math.floor(middleSlots / 2));
    let end = Math.min(tp - 1, start + middleSlots - 1);

    const visibleMiddle = Math.max(0, end - start + 1);
    if (visibleMiddle < middleSlots) {
      start = Math.max(2, end - middleSlots + 1);
    }

    if (start === 2) {
      end = Math.min(tp - 1, start + middleSlots - 1);
    }
    if (end === tp - 1) {
      start = Math.max(2, end - middleSlots + 1);
    }

    const nums = [1];
    for (let n = start; n <= end; n += 1) nums.push(n);
    if (tp > 1) nums.push(tp);

    const deduped = nums.filter((n, i, arr) => i === 0 || n !== arr[i - 1]);
    const out = [];
    let prev = 0;
    for (const n of deduped) {
      if (prev && n - prev > 1) out.push("…");
      out.push(n);
      prev = n;
    }
    return out;
  }

  function renderPager() {
    const total = CSR_STATE.items.length;
    const pageSize = CSR_STATE.pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, CSR_STATE.page), totalPages);

    const prevDisabled = page <= 1 ? "disabled" : "";
    const nextDisabled = page >= totalPages ? "disabled" : "";

    const btns = buildPageButtons(totalPages, page).map(x => {
      if (x === "…") return `<span class="csr-page-ellipsis">…</span>`;
      const n = x;
      const active = n === page ? "is-active" : "";
      return `<button type="button" class="csr-page ${active}" data-page="${n}">${n}</button>`;
    }).join("");

    return `
      <div class="csr-pager">
        <button type="button" class="md-button csr-prev" aria-label="Previous page" ${prevDisabled}>
          <span class="csr-pagerbtn__ico" aria-hidden="true">${csrSvg("left", 18)}</span>
          <span class="csr-pagerbtn__txt">Prev</span>
        </button>
        <div class="csr-pages">${btns}</div>
        <button type="button" class="md-button csr-next" aria-label="Next page" ${nextDisabled}>
          <span class="csr-pagerbtn__ico" aria-hidden="true">${csrSvg("right", 18)}</span>
          <span class="csr-pagerbtn__txt">Next</span>
        </button>
      </div>
    `;
  }



// ---------- sort dropdown (single button) ----------
const CSR_VIEWS_API_BASE = "https://hot.eor-wiki.workers.dev";
const CSR_VIEWS_CACHE_KEY = "__mk_views30d_cache_v1";
const CSR_VIEWS_CACHE_TTL_MS = 10 * 60 * 1000;

let __csrViews30dPromise = null;
let __csrViews30dMap = null;

function csrNormPath(p) {
  return String(p || "").split("#")[0].replace(/^\/+/, "");
}

function csrReadViewsCache() {
  try {
    const raw = sessionStorage.getItem(CSR_VIEWS_CACHE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    const ts = Number(obj.ts) || 0;
    if (!ts || (Date.now() - ts) > CSR_VIEWS_CACHE_TTL_MS) return null;
    const items = obj.items && typeof obj.items === "object" ? obj.items : null;
    if (!items) return null;
    return items;
  } catch (_) {
    return null;
  }
}

function csrWriteViewsCache(mapObj) {
  try {
    sessionStorage.setItem(CSR_VIEWS_CACHE_KEY, JSON.stringify({ ts: Date.now(), items: mapObj || {} }));
  } catch (_) {}
}

async function csrFetchHot({ metric, period, limit, offset }) {
  const url = new URL(CSR_VIEWS_API_BASE + "/hot");
  url.searchParams.set("metric", metric);
  url.searchParams.set("period", period);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  const resp = await fetch(url.toString()).catch(() => null);
  const data = resp ? await resp.json().catch(() => null) : null;
  return {
    items: data && Array.isArray(data.items) ? data.items : [],
    total: data && typeof data.total === "number" ? data.total : 0,
  };
}

async function csrLoadViews30dMapOnce() {
  if (__csrViews30dMap) return __csrViews30dMap;
  if (__csrViews30dPromise) return __csrViews30dPromise;

  // 1) session cache
  const cached = csrReadViewsCache();
  if (cached) {
    const m = new Map();
    for (const k of Object.keys(cached)) m.set(csrNormPath(k), Number(cached[k]) || 0);
    __csrViews30dMap = m;
    return m;
  }

  __csrViews30dPromise = (async () => {
    const limit = 80;
    let offset = 0;
    let guard = 0;
    const maxPages = 60;

    const m = new Map();
    while (guard < maxPages) {
      guard += 1;
      const chunk = await csrFetchHot({ metric: "views", period: "30d", limit, offset });
      const arr = chunk.items || [];
      if (!arr.length) break;

      for (const it of arr) {
        const p = csrNormPath(it && it.path);
        if (!p) continue;
        const c = Number(it && it.count) || 0;
        if (!m.has(p)) m.set(p, c);
      }

      offset += arr.length;
      if (chunk.total && offset >= chunk.total) break;
      if (arr.length < limit) break;
    }

    // write cache
    try {
      const obj = {};
      for (const [k, v] of m.entries()) obj[k] = v;
      csrWriteViewsCache(obj);
    } catch (_) {}

    __csrViews30dMap = m;
    return m;
  })();

  return __csrViews30dPromise;
}

function csrSortLabel() {
  const key = CSR_STATE.sortKey || "best";
  const dir = CSR_STATE.sortDir || "desc";
  if (key === "best") return "Most relevant";
  if (key === "views30d") return "Most viewed (30d)";
  if (key === "lecture" && dir === "asc") return `Course · ${csrCurrentUnitNoun()} ↑`;
  if (key === "lecture" && dir === "desc") return `Course · ${csrCurrentUnitNoun()} ↓`;
  if (key === "title" && dir === "asc") return "Title A → Z";
  if (key === "title" && dir === "desc") return "Title Z → A";
  return "Most relevant";
}

function csrSortKeyDirFromOption(optId) {
  const id = String(optId || "");
  if (id === "best") return { key: "best", dir: "desc" };
  if (id === "views30d") return { key: "views30d", dir: "desc" };
  if (id === "lecture-asc") return { key: "lecture", dir: "asc" };
  if (id === "lecture-desc") return { key: "lecture", dir: "desc" };
  if (id === "title-asc") return { key: "title", dir: "asc" };
  if (id === "title-desc") return { key: "title", dir: "desc" };
  return { key: "best", dir: "desc" };
}

function csrIsActiveOption(optId) {
  const s = csrSortKeyDirFromOption(optId);
  return (CSR_STATE.sortKey || "best") === s.key && (CSR_STATE.sortDir || "desc") === s.dir;
}

function csrSvg(name, size) {
  const s = Number(size) || 18;
  const common = `width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:block;color:inherit"`;
  const line = `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  if (name === "sort") {
    return `<svg ${common}><path ${line} d="M3 6h10"/><path ${line} d="M3 12h14"/><path ${line} d="M3 18h6"/><path ${line} d="M17 8l2-2 2 2"/><path ${line} d="M19 6v12"/><path ${line} d="M21 16l-2 2-2-2"/></svg>`;
  }
  if (name === "chev") {
    return `<svg ${common}><path ${line} d="M6 9l6 6 6-6"/></svg>`;
  }
  if (name === "left") {
    return `<svg ${common}><path ${line} d="M15 18l-6-6 6-6"/></svg>`;
  }
  if (name === "right") {
    return `<svg ${common}><path ${line} d="M9 6l6 6-6 6"/></svg>`;
  }
  if (name === "target") {
    return `<svg ${common}><circle ${line} cx="12" cy="12" r="7.25"/><circle ${line} cx="12" cy="12" r="2.5"/><path ${line} d="M12 3v2.25"/><path ${line} d="M12 18.75V21"/><path ${line} d="M3 12h2.25"/><path ${line} d="M18.75 12H21"/></svg>`;
  }
  if (name === "fire") {
    return `<svg ${common}><path ${line} d="M12 2c2.6 3 4 5.2 4 8.2A4.5 4.5 0 0 1 11.5 15c-1.8 0-3.5-1.5-3.5-3.8C8 7.9 10 5.6 12 2z"/><path ${line} d="M12 13c1.2 1.3 1.7 2.3 1.7 3.4A2 2 0 0 1 11.7 19 2.2 2.2 0 0 1 9.5 16.6C9.5 15.1 10.6 14 12 13z"/></svg>`;
  }
  if (name === "list") {
    return `<svg ${common}><path ${line} d="M8 6h13"/><path ${line} d="M8 12h13"/><path ${line} d="M8 18h13"/><path ${line} d="M3 6h1"/><path ${line} d="M3 12h1"/><path ${line} d="M3 18h1"/></svg>`;
  }
  if (name === "az") {
    return `<svg ${common} fill="none"><text x="4.8" y="9.4" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">A</text><text x="4.8" y="20.2" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">Z</text><path d="M12 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l2 2-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  if (name === "za") {
    return `<svg ${common} fill="none"><text x="4.8" y="9.4" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">Z</text><text x="4.8" y="20.2" font-size="8" font-family="system-ui, sans-serif" fill="currentColor">A</text><path d="M12 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 18l-2-2 2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  if (name === "up") {
    return `<svg ${common}><path ${line} d="M12 6v12"/><path ${line} d="M7 11l5-5 5 5"/></svg>`;
  }
  if (name === "down") {
    return `<svg ${common}><path ${line} d="M12 6v12"/><path ${line} d="M7 13l5 5 5-5"/></svg>`;
  }
  return "";
}

function csrRenderSortDropdownHtml() {
  const label = csrSortLabel();

  const opts = [
    { id: "best", label: "Most relevant", icon: "target" },
    { id: "views30d", label: "Most viewed (30d)", icon: "fire" },
    { id: "lecture-asc", label: `Course · ${csrCurrentUnitNoun()} ↑`, icon: "up" },
    { id: "lecture-desc", label: `Course · ${csrCurrentUnitNoun()} ↓`, icon: "down" },
    { id: "title-asc", label: "Title A → Z", icon: "az" },
    { id: "title-desc", label: "Title Z → A", icon: "za" },
  ];

  const menu = opts.map(o => {
    const active = csrIsActiveOption(o.id) ? "is-active" : "";
    return `
      <button type="button" class="mk-sortopt ${active}" data-mk-sort="${o.id}">
        <span class="mk-sortopt__ico">${csrSvg(o.icon, 18)}</span>
        <span class="mk-sortopt__txt">${o.label}</span>
      </button>
    `.trim();
  }).join("");

  return `
    <div class="mk-sort" data-mk-sort-root="1">
      <button type="button" class="mk-sortbtn" aria-haspopup="listbox" aria-expanded="false">
        <span class="mk-sortbtn__ico">${csrSvg("sort", 18)}</span>
        <span class="mk-sortbtn__txt">Sort</span>
        <span class="mk-sortbtn__val">${label}</span>
        <span class="mk-sortbtn__chev">${csrSvg("chev", 18)}</span>
      </button>
      <div class="mk-sortmenu" role="listbox" hidden>
        ${menu}
      </div>
    </div>
  `.trim();
}

function csrEnsureSortDropdownStylesOnce() {
  if (document.getElementById("mk-sortdropdown-style-v1")) return;
  const st = document.createElement("style");
  st.id = "mk-sortdropdown-style-v1";
  st.textContent = `
    .mk-sort{ position:relative; display:inline-flex; max-width:100%; }
    .mk-sortbtn{
      appearance:none;
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:6px 10px;
      border-radius:999px;
      border:1px solid var(--md-default-fg-color--lightest);
      background: rgba(0,0,0,.02);
      color: inherit;
      font: inherit;
      cursor:pointer;
      user-select:none;
      max-width:100%;
    }
    [data-md-color-scheme="slate"] .mk-sortbtn{ background: rgba(255,255,255,.04); }
    .mk-sortbtn:hover{ border-color: rgba(99,102,241,.45); background: rgba(99,102,241,.06); }
    .mk-sortbtn__ico, .mk-sortbtn__chev{ display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; opacity:.85; flex:0 0 auto; color: inherit; }
    .mk-sortbtn__txt{ font-weight:650; opacity:.85; }
    .mk-sortbtn__val{
      font-weight:750;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:min(40vw, 320px);
    }
    .mk-sortbtn[aria-expanded="true"] .mk-sortbtn__chev{ transform: rotate(180deg); }

    .mk-sortmenu{
      position:absolute;
      left:0;
      top: calc(100% + 8px);
      min-width: 260px;
      max-width: min(92vw, 340px);
      padding:6px;
      border-radius:14px;
      border:1px solid var(--md-default-fg-color--lightest);
      background: var(--md-default-bg-color);
      box-shadow: 0 14px 38px rgba(0,0,0,.18);
      z-index: 90;
    }
    [data-md-color-scheme="slate"] .mk-sortmenu{ background: rgba(24,24,24,.98); }

    .mk-sortopt{
      width:100%;
      appearance:none;
      border:0;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:10px;
      padding:8px 10px;
      border-radius:12px;
      text-align:left;
    }
    .mk-sortopt__ico{ width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center; opacity:.88; flex:0 0 auto; color: inherit; }
    .mk-sortopt:hover{ background: rgba(0,0,0,.06); }
    [data-md-color-scheme="slate"] .mk-sortopt:hover{ background: rgba(255,255,255,.08); }
    .mk-sortopt.is-active{
      background: rgba(99,102,241,.10);
      box-shadow: inset 0 0 0 1px rgba(99,102,241,.22);
    }

    .csr-colheads{
      margin-top: 2px;
      display:flex;
      align-items:flex-end;
      gap: 18px;
      width:100%;
    }
    .csr-colhead{
      opacity:.82;
      font-weight:650;
      white-space:nowrap;
    }
    .csr-colhead--right{
      margin-left:auto;
      justify-self:end;
      text-align:right;
    }

    .csr-prev,
    .csr-next{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:10px;
    }
    .csr-pagerbtn__ico{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:18px;
      height:18px;
      flex:0 0 auto;
      line-height:1;
      color: inherit;
    }
    .csr-pagerbtn__ico svg{
      display:block;
      width:18px;
      height:18px;
    }

    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt,
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit,
    html[data-md-color-scheme="slate"] .course-search .csr-prev,
    html[data-md-color-scheme="slate"] .course-search .csr-next,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt,
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit,
    body[data-md-color-scheme="slate"] .course-search .csr-prev,
    body[data-md-color-scheme="slate"] .course-search .csr-next{
      color: rgba(255,255,255,.94) !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico,
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico,
    html[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico,
    body[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico{
      color: rgba(255,255,255,.94) !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg,
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg,
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg,
    html[data-md-color-scheme="slate"] .course-search .csr-next svg,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg,
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg,
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg,
    body[data-md-color-scheme="slate"] .course-search .csr-next svg{
      color: rgba(255,255,255,.96) !important;
      fill: none !important;
      stroke: none !important;
      filter: none !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico svg *,
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev svg *,
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico svg *,
    html[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico svg *,
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg *,
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg *,
    html[data-md-color-scheme="slate"] .course-search .csr-next svg *,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__ico svg *,
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn__chev svg *,
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt__ico svg *,
    body[data-md-color-scheme="slate"] .course-search .csr-pagerbtn__ico svg *,
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg *,
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg *,
    body[data-md-color-scheme="slate"] .course-search .csr-next svg *{
      color: #fff !important;
      filter: none !important;
      opacity: 1 !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [stroke],
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [stroke],
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [stroke],
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg [stroke],
    html[data-md-color-scheme="slate"] .course-search .csr-next svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [stroke],
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg [stroke],
    body[data-md-color-scheme="slate"] .course-search .csr-next svg [stroke]{
      stroke: currentColor !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill]:not([fill="none"]),
    html[data-md-color-scheme="slate"] .course-search .csr-next svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill]:not([fill="none"]),
    body[data-md-color-scheme="slate"] .course-search .csr-next svg [fill]:not([fill="none"]){
      fill: currentColor !important;
    }
    html[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill="none"],
    html[data-md-color-scheme="slate"] .course-search .csr-next svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .mk-sortbtn svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .mk-sortopt svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search #csr-mobile-submit svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .csr-prev svg [fill="none"],
    body[data-md-color-scheme="slate"] .course-search .csr-next svg [fill="none"]{
      fill: none !important;
    }

    @media (max-width: 720px){
      .csr-prev,
      .csr-next{
        gap:0;
        min-width:52px;
        padding-left:12px;
        padding-right:12px;
      }
      .csr-prev .csr-pagerbtn__txt,
      .csr-next .csr-pagerbtn__txt{
        display:none;
      }
    }
  `.trim();
  document.head.appendChild(st);
}

function csrSetSortExplicit(key, dir) {
  CSR_STATE.sortKey = key;
  CSR_STATE.sortDir = dir;
  CSR_STATE.page = 1;
}

function csrCloseMenu(root) {
  if (!root) return;
  const btn = root.querySelector(".mk-sortbtn");
  const menu = root.querySelector(".mk-sortmenu");
  if (menu) menu.hidden = true;
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function csrToggleMenu(root) {
  if (!root) return;
  const btn = root.querySelector(".mk-sortbtn");
  const menu = root.querySelector(".mk-sortmenu");
  if (!btn || !menu) return;
  const isOpen = btn.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    csrCloseMenu(root);
  } else {
    // close any other menus
    document.querySelectorAll('.mk-sort[data-mk-sort-root="1"]').forEach(el => {
      if (el !== root) csrCloseMenu(el);
    });
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
}

function csrEnsureSortDropdownBinding(out) {
  if (!out || out.dataset.csrSortDdBound === "1") return;
  out.dataset.csrSortDdBound = "1";

  // internal clicks
  out.addEventListener("click", (e) => {
    const root = e.target && e.target.closest ? e.target.closest('.mk-sort[data-mk-sort-root="1"]') : null;

    const btn = e.target && e.target.closest ? e.target.closest(".mk-sortbtn") : null;
    if (btn && root && out.contains(root)) {
      e.preventDefault();
      e.stopPropagation();
      csrToggleMenu(root);
      return;
    }

    const opt = e.target && e.target.closest ? e.target.closest(".mk-sortopt") : null;
    if (opt && root && out.contains(root)) {
      e.preventDefault();
      e.stopPropagation();

      const id = opt.getAttribute("data-mk-sort") || "";
      const next = csrSortKeyDirFromOption(id);
      csrTrackActivity("sort_use", { sort: id || "" }, { scope: "sort:" + (id || ""), throttleMs: 15000 });

      csrSetSortExplicit(next.key, next.dir);
      csrCloseMenu(root);
      renderPage(out);
      requestAnimationFrame(() => syncResultsWidthToSearchBar(out));

      if (next.key === "views30d") {
        csrLoadViews30dMapOnce().then(() => {
          if ((CSR_STATE.sortKey || "best") === "views30d") {
            renderPage(out);
            requestAnimationFrame(() => syncResultsWidthToSearchBar(out));
          }
        }).catch(() => {});
      }

      return;
    }
  });

  // outside click closes
  document.addEventListener("click", (e) => {
    const open = out.querySelector('.mk-sortbtn[aria-expanded="true"]');
    if (!open) return;
    const root = open.closest('.mk-sort[data-mk-sort-root="1"]');
    if (!root) return;
    if (e.target && root.contains(e.target)) return;
    csrCloseMenu(root);
  }, true);

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if (!e || e.key !== "Escape") return;
    const open = out.querySelector('.mk-sortbtn[aria-expanded="true"]');
    if (!open) return;
    const root = open.closest('.mk-sort[data-mk-sort-root="1"]');
    csrCloseMenu(root);
  }, true);
}

function csrViewsCountFor(item) {
  if (!__csrViews30dMap) return 0;
  const p = csrNormPath(item && item.location);
  return (__csrViews30dMap.get(p) || 0);
}

  // ---------- render ----------
  function renderPage(out) {
    const total = CSR_STATE.items.length;
    if (!total) {
      out.innerHTML = `<div class="csr-empty">No results.</div>`;
      // --- fade in when results become non-empty ---
  const hasResultsNow = (CSR_STATE.items && CSR_STATE.items.length > 0);

  if (hasResultsNow && !CSR_LAST_HAS_RESULTS) {
    const wrap = out.querySelector(".csr-wrap");
    if (wrap) {
      wrap.classList.remove("csr-fade-in");
      requestAnimationFrame(() => wrap.classList.add("csr-fade-in"));
    }
  }

  CSR_LAST_HAS_RESULTS = hasResultsNow;
      typesetMath(out);
      return;
    }

    const pageSize = CSR_STATE.pageSize || 10;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    CSR_STATE.page = Math.min(Math.max(1, CSR_STATE.page), totalPages);

    const sorted = getSortedItems(CSR_STATE.items);

    const start = (CSR_STATE.page - 1) * pageSize;
    const end = start + pageSize;
    const items = sorted.slice(start, end);

    const startN = total ? (start + 1) : 0;
const endN = Math.min(total, end);

const showingHtml =
  `<div class="csr-foot">` +
    `<div class="csr-showing">Showing ${startN}-${endN} of ${total}</div>` +
    renderPager() +
  `</div>`;


    const titleActive = (CSR_STATE.sortKey || "title") === "title";
    const lectureActive = CSR_STATE.sortKey === "lecture";
    const dir = CSR_STATE.sortDir || "asc";

    const root = new URL(getSiteRootUrl());

    const headerHtml = `
  <div class="csr-head">
    ${csrRenderSortDropdownHtml()}
  </div>
  <div class="csr-cols csr-colheads">
    <div class="csr-colhead">Title</div>
    <div class="csr-colhead csr-colhead--right">${escapeHtml(csrCurrentUnitNoun())}</div>
  </div>
`;

const listHtml = items.map(p => {
      const href = new URL(p.location, root).toString();
      const lecTxt = p.meta ? String(p.meta).replace(/^Course:\s*/i, "") : "";
      return `
        <div class="csr-row">
          <a class="csr-link" href="${href}">${escapeHtml(p.title)}</a>
          <div class="csr-lecture">${escapeHtml(lecTxt)}</div>
        </div>
      `;
    }).join("");

    out.innerHTML =
      `<div class="csr-wrap">` +
        headerHtml +
        `<div class="csr-list">${listHtml}</div>` +
        showingHtml +
      `</div>`;

    requestAnimationFrame(() => typesetMath(out));

    
// Sort dropdown
csrEnsureSortDropdownStylesOnce();
csrEnsureSortDropdownBinding(out);


    // 宽度同步（每次 render 都做一次，保证“等于搜索栏”）
    requestAnimationFrame(() => syncResultsWidthToSearchBar(out));
  }

  // ---------- bind pager actions (event delegation; only once) ----------
  function ensurePagerBinding(out) {
    if (!out || out.dataset.csrPagerBound === "1") return;
    out.dataset.csrPagerBound = "1";

    out.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      // Prev
      const prevBtn = t.closest(".csr-prev");
      if (prevBtn && !prevBtn.hasAttribute("disabled")) {
        const totalPages = Math.max(1, Math.ceil(CSR_STATE.items.length / CSR_STATE.pageSize));
        if (CSR_STATE.page > 1) {
          CSR_STATE.page -= 1;
          CSR_STATE.page = Math.min(Math.max(1, CSR_STATE.page), totalPages);
          renderPage(out);
          requestAnimationFrame(() => syncResultsWidthToSearchBar(out));
        }
        return;
      }

      // Next
      const nextBtn = t.closest(".csr-next");
      if (nextBtn && !nextBtn.hasAttribute("disabled")) {
        const totalPages = Math.max(1, Math.ceil(CSR_STATE.items.length / CSR_STATE.pageSize));
        if (CSR_STATE.page < totalPages) {
          CSR_STATE.page += 1;
          CSR_STATE.page = Math.min(Math.max(1, CSR_STATE.page), totalPages);
          renderPage(out);
          requestAnimationFrame(() => syncResultsWidthToSearchBar(out));
        }
        return;
      }

      // Direct page
      const pageBtn = t.closest(".csr-page");
      if (pageBtn) {
        const n = parseInt(pageBtn.getAttribute("data-page") || "", 10);
        if (Number.isFinite(n) && n > 0) {
          CSR_STATE.page = n;
          renderPage(out);
          requestAnimationFrame(() => syncResultsWidthToSearchBar(out));
        }
      }
    });
  }

  // ---------- search ----------
  async function runCourseSearch(keyword, opts) {
    const out = document.getElementById("course-search-results");
    if (!out) return;

    ensurePagerBinding(out);

    const isAuto = !!(opts && opts._fromAuto);
    if (!isAuto) csrHideFuzzyNote();

    const kw = String(keyword || "").trim();
    if (!kw) {
      out.innerHTML = `<div class="csr-item">Please enter a token.</div>`;
      return { ok: false, reason: "empty" };
    }

    const searchSeq = ++CSR_SEARCH_SEQ;

    // Keep the current page visible while the index/search work completes.
    // The old delayed "Searching…" placeholder could combine with global route/search
    // effects and look like a full-screen black flash on mobile.
    const indexJson = await loadIndex();
    if (searchSeq !== CSR_SEARCH_SEQ) return { ok: false, reason: "stale" };
    const docs = indexJson.docs || [];
    const pages = csrAggregateDocsToPages(docs);

    const scoreDocKeyword = getScoreFn();

    const courseKey = getCourseKeyFromUrl();
    const inCourse = pages.filter(p => inSameCourseByKey(p.location, courseKey));

    const scoredAll = inCourse
      .map((p, i) => ({ page: p, score: scoreDocKeyword(kw, p), cov: (scoreDocKeyword.coverage ? scoreDocKeyword.coverage(kw, p) : 0), __i: i }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => {
        const tags = Array.isArray(x.page.tags) ? x.page.tags : [];
        const lec = lectureInfoFromTags(tags);
        return {
          location: x.page.location,
          title: x.page.title,
          meta: lec ? (lec.unitLabel || `Lecture ${lec.lectureNum}`) : "",
          tags,
          score: x.score,
          cov: x.cov,
          __i: x.__i,
        };
      });

    const __csrStrictAny = csrStrictAnyResult(inCourse, kw);

    // ✅ If strict search yields no results: auto-correct and re-run (visible note + "search as typed")
    try {
      const kw2 = String(kw || "").trim();
      if (!isAuto && (!__csrStrictAny || !scoredAll || !scoredAll.length)) {
        const fix = await csrTryAutoCorrectOnNoResults(kw2, inCourse, courseKey);
        if (fix && fix.to) {
          const inputEl = document.getElementById("course-search-input");
          if (inputEl) inputEl.value = fix.to;

          csrHideFuzzyNote();
          return await runCourseSearch(fix.to, { _fromAuto: true });
        }
      }
    } catch (_) {}

    if (searchSeq !== CSR_SEARCH_SEQ) return { ok: false, reason: "stale" };

    CSR_STATE.items = scoredAll;
    CSR_STATE.page = 1;
    CSR_STATE.pageSize = 10;

    renderPage(out);
    requestAnimationFrame(() => syncResultsWidthToSearchBar(out));
    return { ok: true, query: kw, count: scoredAll.length, course: courseKey, auto: isAuto };
  }

  function bind() {
    const wrap = document.querySelector(".course-search");
    if (!wrap) return;

    // Ensure base styles are always present (including mobile search bar height)
    csrEnsureFuzzyStyles();
    csrInstallNoFlashStyles();
    csrInstallCourseSearchSubmitGuard();

    const form = document.getElementById("course-search-form");
    const input = document.getElementById("course-search-input");
    const out = document.getElementById("course-search-results");
    // --- keep results aligned with the search bar (robust, also works on maximise) ---
if (!window.__csrFormRO) {
  window.__csrFormRO = new ResizeObserver(() => {
    const out2 = document.getElementById("course-search-results");
    // 用 rAF 确保布局已经稳定后再取 rect
    requestAnimationFrame(() => {
      if (out2) syncResultsWidthToSearchBar(out2);
      try { window.__csrSyncInputHeight && window.__csrSyncInputHeight(); } catch (_) {}
      try { csrSyncAssistMetrics(); } catch (_) {}
      try { csrSyncAssistGeometry(); } catch (_) {}
    });
  });
}

try {
  // 每次进入页面都重新 observe 当前 form（避免 DOM 重新渲染后失效）
  window.__csrFormRO.disconnect();
  window.__csrFormRO.observe(form);
} catch (_) {}

    if (!form || !input || !out) return;

function csrDeriveMobilePlaceholder() {
  try {
    const original = String(input.getAttribute("placeholder") || "").trim();
    let courseText = original;

    if (!courseText) {
      const h1 = document.querySelector("main h1, .md-content h1, article h1");
      courseText = String(h1 && h1.textContent || "").trim();
    }

    courseText = String(courseText || "")
      .replace(/^\s*search\s+in\s+/i, "")
      .replace(/\s*[·•|]\s*.*$/, "")
      .replace(/\s+[–—-]\s+.*$/, "")
      .replace(/\s*\([^)]*\)\s*$/, "")
      .trim();

    if (!courseText) {
      const segs = String(window.location.pathname || "").split("/").filter(Boolean);
      const guess = segs.length >= 2 ? segs[segs.length - 2] : "";
      courseText = guess
        .replace(/^\d+[a-z]?-/i, "")
        .replace(/-/g, " ")
        .replace(/Iii/g, "III")
        .replace(/Ii/g, "II")
        .replace(/Iv/g, "IV")
        .replace(/I/g, "I")
        .trim();
    }

    return courseText ? `Search in ${courseText}` : "Search in course";
  } catch (_) {
    return "Search in course";
  }
}

function csrSyncMobilePlaceholder() {
  try {
    if (!input.dataset.csrDesktopPlaceholder) {
      input.dataset.csrDesktopPlaceholder = String(input.getAttribute("placeholder") || "");
    }
    const isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 720px)").matches);
    if (isMobile) {
      input.setAttribute("placeholder", csrDeriveMobilePlaceholder());
    } else {
      input.setAttribute("placeholder", input.dataset.csrDesktopPlaceholder || "");
    }
  } catch (_) {}
}
csrSyncMobilePlaceholder();

// Make "Search in course" match the Find CTA style (icon-in-a-box)
const submitBtn =
  form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');

if (submitBtn && submitBtn.tagName && submitBtn.tagName.toLowerCase() === "button") {
  submitBtn.classList.add("fb-cta-btn", "fb-cta-btn--search");
  if (!submitBtn.dataset.fbCtaDecorated) {
    submitBtn.dataset.fbCtaDecorated = "1";
    const label = (submitBtn.textContent || "").trim() || "Search in course";
    submitBtn.innerHTML =
      `<span class="fb-cta__ico fb-cta__ico--search" aria-hidden="true"></span>` +
      `<span class="fb-cta__txt">${escapeHtml(label)}</span>`;
  }
}

// Mobile-only: replace the big CTA with an inline magnifier icon inside the input.
// PC remains unchanged because CSS hides #csr-mobile-submit on desktop.
function ensureMobileSubmitIcon() {
  try {
    const existing = document.getElementById("csr-mobile-submit");
    if (existing && existing.closest("form") !== form) existing.remove();

    let btn = document.getElementById("csr-mobile-submit");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "csr-mobile-submit";
      btn.type = "submit";
      btn.setAttribute("aria-label", "Search in course");
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M10 4a6 6 0 104.472 10.03l4.249 4.25a1 1 0 001.414-1.415l-4.25-4.249A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"/>
        </svg>
      `;
      // Put the icon inside the form so it participates in submit.
      form.appendChild(btn);
    }
  } catch (_) {}
}
ensureMobileSubmitIcon();
function ensureMobileClearButton() {
  try {
    const existing = document.getElementById("csr-mobile-clear");
    if (existing && existing.closest("form") !== form) existing.remove();

    let btn = document.getElementById("csr-mobile-clear");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "csr-mobile-clear";
      btn.type = "button";
      btn.setAttribute("aria-label", "Clear search");
      btn.setAttribute("title", "Clear search");
      btn.hidden = true;
      btn.innerHTML = "&times;";
      form.appendChild(btn);
    }

    if (!btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          input.value = "";
          __csrAssistUi.lastApplied = "";
          __csrAssistUi.lastNoteFix = "";
          csrHideFuzzyNote();
          btn.hidden = true;
          input.focus();
          input.dispatchEvent(new Event("input", { bubbles: true }));
          csrRefreshAssistSoon(0);
          csrSyncAssistGeometry();
        } catch (_) {}
      });
    }

    const syncClear = () => {
      try {
        const isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 720px)").matches);
        const hasText = !!String(input && input.value || "").trim();
        const focusWithin = !!(form && form.matches && form.matches(":focus-within"));
        const dd = typeof csrGetAssistDropdown === "function" ? csrGetAssistDropdown() : null;
        const dropdownVisible = !!(dd && dd.style.display !== "none" && dd.children && dd.children.length);
        const isCollapsed = !(focusWithin || dropdownVisible);
        btn.hidden = !(isMobile && hasText && isCollapsed);
        try {
          const submitBtn = document.getElementById("csr-mobile-submit");
          const submitRect = submitBtn && submitBtn.getBoundingClientRect ? submitBtn.getBoundingClientRect() : null;
          const submitW = submitRect && submitRect.width ? Math.ceil(submitRect.width) : 0;
          if (form && form.style && submitW > 0) {
            form.style.setProperty("--csr-mobile-submit-w", submitW + "px");
          }
        } catch (_) {}
      } catch (_) {
        btn.hidden = true;
      }
    };

    btn.__csrSync = syncClear;
    syncClear();
    return btn;
  } catch (_) {
    return null;
  }
}
ensureMobileClearButton();

// Sync input height to the (possibly styled) submit button height (mobile polish)
window.__csrSyncInputHeight = () => {
  try {
    const btn = form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');
    const h = btn && btn.getBoundingClientRect ? btn.getBoundingClientRect().height : 0;
    if (h && h > 0) {
      const hh = Math.round(h);
      form.style.setProperty("--csr-btn-h", hh + "px");

      const isMobile = !!(window.matchMedia && window.matchMedia("(max-width: 720px)").matches);
      const inputEl = document.getElementById("course-search-input");
      if (inputEl) {
        if (isMobile) {
          inputEl.style.boxSizing = "border-box";
          inputEl.style.minHeight = hh + "px";
          inputEl.style.height = hh + "px";
        } else {
          inputEl.style.removeProperty("min-height");
          inputEl.style.removeProperty("height");
        }
      }
    }
  } catch (_) {}
};
window.__csrSyncInputHeight();
requestAnimationFrame(() => {
  try { window.__csrSyncInputHeight && window.__csrSyncInputHeight(); } catch (_) {}
  try { csrSyncMobilePlaceholder(); } catch (_) {}
  try {
    const clearBtn = document.getElementById("csr-mobile-clear");
    if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
  } catch (_) {}
});

csrEnsureCourseAssistUi(form, input);
csrSyncAssistMetrics();
csrSyncAssistGeometry();
csrEnsureAssistBinding(form, input);

ensurePagerBinding(out);

    if (form.dataset.bound === "1") {
      requestAnimationFrame(() => {
        csrEnsureCourseAssistUi(form, input);
        csrSyncAssistMetrics();
        try {
          const clearBtn = document.getElementById("csr-mobile-clear");
          if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
        } catch (_) {}
      });
      return;
    }
    form.dataset.bound = "1";

    // Hide the suggestion bar when the user edits the query
    input.addEventListener("focus", () => {
      csrProtectCourseSearchFocus(850);
      csrBeginInPlaceSearchGuard(1800);
      csrKeepMobileSearchBackdropHidden(1800);
      csrCloseMaterialSearchOverlayForCourseSearch();
    }, true);

    form.addEventListener("pointerdown", () => {
      csrProtectCourseSearchFocus(850);
      csrBeginInPlaceSearchGuard(1600);
      csrKeepMobileSearchBackdropHidden(1600);
    }, true);

    input.addEventListener("input", () => {
      csrHideFuzzyNote();
      try {
        const clearBtn = document.getElementById("csr-mobile-clear");
        if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
      } catch (_) {}
    });

    form.addEventListener("submit", e => {
      csrHandleCourseSearchSubmit(e, "form-submit");
    }, true);

    input.addEventListener("keydown", e => {
      if (csrIsCourseSearchEnter(e)) csrHandleCourseSearchSubmit(e, "input-enter");
    }, true);

    // 窗口大小变化时，保持结果宽度==搜索栏宽度
    if (!window.__csrResizeBound) {
      window.__csrResizeBound = true;
      window.addEventListener("resize", () => {
        const out2 = document.getElementById("course-search-results");
        if (out2) syncResultsWidthToSearchBar(out2);
        try { window.__csrSyncInputHeight && window.__csrSyncInputHeight(); } catch (_) {}
        try { csrSyncMobilePlaceholder(); } catch (_) {}
        try { csrSyncAssistMetrics(); } catch (_) {}
        try {
          const clearBtn = document.getElementById("csr-mobile-clear");
          if (clearBtn && typeof clearBtn.__csrSync === "function") clearBtn.__csrSync();
        } catch (_) {}
      });
    }
  }

  function init() {
    bind();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  document.addEventListener("DOMContentSwitch", init);
})();


(function () {
  const BUILD = "mk-course-mastery-map-v32-focus-evidence-boxes";
  if (window.__mkCourseMasteryMapBuild === BUILD) {
    try {
      if (window.MkCourseMasteryMap && typeof window.MkCourseMasteryMap.refresh === "function") {
        window.MkCourseMasteryMap.refresh();
      }
    } catch (_) {}
    return;
  }
  window.__mkCourseMasteryMapBuild = BUILD;

  const STYLE_ID = "mk-course-mastery-map-style-v23-pc-wider-panel";
  const PANEL_ID = "mk-course-mastery-map";
  const TOGGLE_ID = "mk-course-mastery-map-toggle";
  const STORAGE_KEY = "mk_course_map_open_v1";
  const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
  const DAILY_HISTORY_KEY = "mk_course_map_readiness_daily_v1";
  const DAILY_HISTORY_LIMIT = 45;
  const AIQ_SESSIONS_KEY = "concept_quiz_sessions_v1";

  const state = {
    open: false,
    filters: { weak: false, unvisited: false },
    expandedLecture: new Set(),
    data: null,
    loadPromise: null,
    seq: 0,
    refreshTimer: 0,
    selectedConceptLoc: '',
    scrollToLecture: '',
    scrollToFocus: false,
    autoExpandedOnce: false,
    preservedScrollTop: null,
    prereqReadySeq: 0,
    prereqReadyCache: new Map(),
  };

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function csrSimpleHash(value) {
    const src = String(value || "").slice(0, 500);
    let h = 2166136261;
    for (let i = 0; i < src.length; i += 1) {
      h ^= src.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function csrCourseSearchEventId(query, course) {
    const q = String(query || "").trim().replace(/\s+/g, " ").toLowerCase();
    const c = String(course || getCourseKeyFromUrl() || "course").trim().toLowerCase();
    // A real submit is an action.  Use a per-submit id so repeated real searches
    // can count up to the server-side daily cap, while this single function is
    // the only course-search XP emitter to avoid double counting.
    return `course-search-submit-v10:${csrSimpleHash(`${c}:${q}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`)}`;
  }

  function csrFlushXpQueuesSoon() {
    try {
      if (window.MkLocalActivity && typeof window.MkLocalActivity.flushLocalSyncQueue === "function") {
        window.MkLocalActivity.flushLocalSyncQueue({ force: false }).catch(() => {});
      }
    } catch (_) {}
    try {
      if (window.MkHotTrack && typeof window.MkHotTrack.flushLocalSyncQueue === "function") {
        window.MkHotTrack.flushLocalSyncQueue({ force: false });
      }
    } catch (_) {}
  }

  function csrQueueXpActivity(metric, detail, opts) {
    try {
      const key = "mk_xp_pending_activity_queue_v1";
      const arr = JSON.parse(localStorage.getItem(key) || "[]");
      arr.push({ metric, details: detail || {}, opts: opts || {}, queuedAt: Date.now(), source: "course-search-fallback" });
      localStorage.setItem(key, JSON.stringify(arr.slice(-300)));
    } catch (_) {}
  }

  function csrTrackActivity(metric, details, opts) {
    const m = String(metric || "");
    const d = details && typeof details === "object" ? details : {};
    const o = opts && typeof opts === "object" ? opts : {};
    const xpMetrics = { course_search: true, search_suggestion: true, sort_use: true };
    if (xpMetrics[m]) {
      try {
        if (window.MkXpActivity && typeof window.MkXpActivity.record === "function") {
          if (m === "course_search" && typeof window.MkXpActivity.recordCourseSearchUsed === "function") {
            const course = d.course || getCourseKeyFromUrl();
            const query = String(d.query || d.querySample || "").trim().replace(/\s+/g, " ");
            window.MkXpActivity.recordCourseSearchUsed(Object.assign({
              source: "course-search-js-submit",
              eventName: "course-search-submit",
              query,
              querySample: query.slice(0, 80),
              queryLength: query.length,
              course,
              actionStateVersion: 8,
              actionStateKey: d.actionStateKey || csrCourseSearchEventId(query, course),
              courseSearchExplicitVersion: 10,
            }, d));
          } else {
            window.MkXpActivity.record(m, Object.assign({ source: "course-search-js", eventName: "course-search-js" }, d), o);
          }
          window.setTimeout(csrFlushXpQueuesSoon, 120);
          window.setTimeout(csrFlushXpQueuesSoon, 1200);
          return;
        }
        if (window.MkAccountData && typeof window.MkAccountData.recordActivity === "function") {
          window.MkAccountData.recordActivity(m, Object.assign({ source: "course-search-js-local" }, d), Object.assign({ scope: `${m}:${d.actionStateKey || d.query || d.text || d.sort || d.path || Date.now()}`, throttleMs: 0 }, o));
          return;
        }
      } catch (_) {}
      csrQueueXpActivity(m, Object.assign({ source: "course-search-js-queued" }, d), Object.assign({ scope: `${m}:${d.actionStateKey || d.query || d.text || d.sort || d.path || Date.now()}`, throttleMs: 0 }, o));
      try { document.dispatchEvent(new CustomEvent("mk:xp-activity", { detail: Object.assign({ metric: m }, d) })); } catch (_) {}
      return;
    }
    try {
      if (window.MkHotTrack && typeof window.MkHotTrack.trackActivity === "function") {
        window.MkHotTrack.trackActivity(metric, Object.assign({ details: d }, o));
      }
    } catch (_) {}
  }

  function csrConsumeGuestAction(action, detail) {
    try {
      if (window.MkGuestAccess && typeof window.MkGuestAccess.consume === "function") {
        return !!window.MkGuestAccess.consume(action, detail || {});
      }
    } catch (_) {}
    return true;
  }

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]') ||
      document.querySelector('script[src*="assets/javascripts"]');

    const attr = script ? script.getAttribute("src") : (link ? (link.getAttribute("href") || link.getAttribute("src")) : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);
    const p = assetUrl.pathname || "/";
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function normLoc(loc) {
    return String(loc || "").split("#")[0].replace(/^\/+/, "").trim();
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function currentRelPath() {
    try {
      const root = new URL(getSiteRootUrl());
      const rootPath = root.pathname.endsWith("/") ? root.pathname : root.pathname + "/";
      let p = String(window.location.pathname || "");
      if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
      return p.replace(/^\/+/, "");
    } catch (_) {
      return String(window.location.pathname || "").replace(/^\/+/, "");
    }
  }

  function currentCourseScope() {
    const rel = currentRelPath();
    const segs = rel.split("/").filter(Boolean);
    if (segs.length >= 3 && /^index\.html?$/i.test(segs[segs.length - 1])) segs.pop();
    if (segs.length >= 2) {
      return { yearSeg: segs[0], courseSeg: segs[1] };
    }
    return { yearSeg: "", courseSeg: "" };
  }

  function asStringList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.map(String).filter(Boolean);
    if (typeof x === "string") return [x];
    return [];
  }

  function getTagsFromDoc(d) {
    const out = [];
    out.push(...asStringList(d && d.tags));
    out.push(...asStringList(d && d.tag));
    out.push(...asStringList(d && d.meta && d.meta.tags));
    out.push(...asStringList(d && d.meta && d.meta.tag));
    out.push(...asStringList(d && d.meta && d.meta["tags"]));
    return out.map((s) => String(s || "").trim()).filter(Boolean);
  }

  function cleanTitle(title) {
    return String(title || "")
      .replace(/\s+-\s+BSc EOR Wiki\s*$/i, "")
      .replace(/\u00B6/g, "")
      .replace(/\s*¶\s*$/u, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isIndexPage(loc) {
    const path = normLoc(loc).toLowerCase();
    if (!path) return true;
    if (path.endsWith("/")) return true;
    const base = (path.split("/").pop() || "");
    return base === "index.html" || base === "index.md";
  }

  function isUtilityPage(loc) {
    const base = (normLoc(loc).split("/").pop() || "").toLowerCase().replace(/\.html$/i, "");
    return base === "find" || base === "custom-random" || base === "search" || base === "tags" || base === "trending";
  }

  function isRandomPage(loc) {
    const base = (normLoc(loc).split("/").pop() || "").toLowerCase().replace(/\.html$/i, "");
    if (base === "random") return true;
    if (/^random-\d/.test(base)) return true;
    return false;
  }

  function isConceptPageLocation(loc) {
    const path = normLoc(loc);
    if (!path) return false;
    if (path.endsWith("/")) return false;
    const segs = path.split("/").filter(Boolean);
    if (segs.length < 3) return false;
    if (isIndexPage(path) || isUtilityPage(path) || isRandomPage(path)) return false;
    return true;
  }

  function lectureInfoFromTags(tags) {
    return unitInfoFromTags(tags);
  }

  function aggregateDocsToPages(docs) {
    const map = new Map();
    for (const d of (Array.isArray(docs) ? docs : [])) {
      const pageLoc = normLoc(d && d.location);
      if (!pageLoc || !isConceptPageLocation(pageLoc)) continue;

      let entry = map.get(pageLoc);
      if (!entry) {
        entry = {
          location: pageLoc,
          title: "",
          tags: new Set(),
          text: "",
        };
        map.set(pageLoc, entry);
      }

      const locFull = String(d && d.location || "");
      if (!entry.title && !locFull.includes("#") && d && d.title) entry.title = cleanTitle(d.title);
      if (!entry.title && d && d.title) entry.title = cleanTitle(d.title);

      const txt = String(d && d.text || "").trim();
      if (txt) entry.text += (entry.text ? "\n" : "") + txt;

      for (const tg of getTagsFromDoc(d)) entry.tags.add(tg);
    }
    return Array.from(map.values()).map((item) => ({
      location: item.location,
      title: item.title || fileTitleFallback(item.location),
      tags: Array.from(item.tags),
      text: item.text || "",
    }));
  }

  function fileTitleFallback(loc) {
    const file = (normLoc(loc).split("/").pop() || "").replace(/\.html$/i, "");
    return file.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function readAllMastery() {
    try {
      if (window.ConceptMastery && typeof window.ConceptMastery._readAll === "function") {
        return window.ConceptMastery._readAll() || {};
      }
    } catch (_) {}
    try {
      const raw = localStorage.getItem("concept_mastery_v1");
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (_) {
      return {};
    }
  }

  function normaliseRecord(raw) {
    const rec = raw && typeof raw === "object" ? raw : {};
    if (window.ConceptMastery && typeof window.ConceptMastery._normaliseRecord === "function") {
      try {
        return window.ConceptMastery._normaliseRecord(rec);
      } catch (_) {}
    }

    const m = [0, 1, 2, 3].includes(Number(rec.m)) ? Number(rec.m) : null;
    const history = Array.isArray(rec.history) ? rec.history.slice() : [];
    return {
      m,
      reviewCount: safeNum(rec.reviewCount),
      viewCount: safeNum(rec.viewCount),
      visitCount: safeNum(rec.visitCount),
      lastReviewed: safeNum(rec.lastReviewed),
      lastViewed: Math.max(safeNum(rec.lastViewed), safeNum(rec.lastSeen)),
      visited: !!(rec.visited || safeNum(rec.visitCount) > 0 || safeNum(rec.viewCount) > 0 || safeNum(rec.lastViewed) > 0),
      history,
    };
  }

  function isExplicitRating(rec) {
    return !!(rec && typeof rec.m === "number" && [0, 1, 2, 3].includes(rec.m));
  }

  function masteryPctFromLevel(m) {
    if (m === 3) return 100;
    if (m === 2) return 75;
    if (m === 1) return 35;
    if (m === 0) return 0;
    return null;
  }

  function latestTsFromHistory(history) {
    let best = 0;
    for (const item of (Array.isArray(history) ? history : [])) {
      const ts = safeNum(item && (item.ts || item.time || item.at || item.date));
      if (ts > best) best = ts;
    }
    return best;
  }

  let __cmmAiQuizCountsRaw = null;
  let __cmmAiQuizCountsByConcept = null;

  function historyEntryKind(item) {
    const kind = String(item && (item.kind || item.type || item.event || item.action) || '').toLowerCase().trim();
    if (kind === 'view' || kind === 'visit' || kind === 'seen') return 'view';
    return 'mastery';
  }

  function latestViewTsFromHistory(history) {
    let best = 0;
    for (const item of (Array.isArray(history) ? history : [])) {
      if (historyEntryKind(item) !== 'view') continue;
      const ts = safeNum(item && (item.ts || item.time || item.at || item.date));
      if (ts > best) best = ts;
    }
    return best;
  }

  function latestMasteryTsFromHistory(history) {
    let best = 0;
    for (const item of (Array.isArray(history) ? history : [])) {
      if (historyEntryKind(item) === 'view') continue;
      const hasLevel = item && (
        Object.prototype.hasOwnProperty.call(item, 'm') ||
        Object.prototype.hasOwnProperty.call(item, 'level') ||
        Object.prototype.hasOwnProperty.call(item, 'mastery')
      );
      if (!hasLevel) continue;
      const maybeM = Number(item && (item.m ?? item.level ?? item.mastery));
      if (![0, 1, 2, 3].includes(maybeM)) continue;
      const ts = safeNum(item && (item.ts || item.time || item.at || item.date));
      if (ts > best) best = ts;
    }
    return best;
  }

  function masterySourceName(item) {
    return String(item && item.source || '').toLowerCase().trim();
  }

  function isAiMasterySource(source) {
    const s = String(source || '').toLowerCase().trim();
    if (!s) return false;
    return s === 'ai-mcq' || s.includes('aiq') || s.includes('ai-test') || s.includes('ai-test-mode') || s.includes('random-ai');
  }

  function isDirectMasterySource(source) {
    const s = String(source || '').toLowerCase().trim();
    if (!s || s === 'legacy') return false;
    if (isAiMasterySource(s)) return false;
    return true;
  }

  function directMasteryUpdateCount(rec) {
    const hist = rec && Array.isArray(rec.history) ? rec.history : [];
    let count = 0;
    hist.forEach((item) => {
      if (historyEntryKind(item) !== 'mastery') return;
      if (!isDirectMasterySource(masterySourceName(item))) return;
      count += 1;
    });
    return count;
  }

  function readAiQuizCountsByConcept() {
    let raw = '';
    try { raw = localStorage.getItem(AIQ_SESSIONS_KEY) || ''; } catch (_) { raw = ''; }
    if (__cmmAiQuizCountsByConcept && raw === __cmmAiQuizCountsRaw) return __cmmAiQuizCountsByConcept;

    const map = new Map();
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        Object.entries(parsed).forEach(([conceptId, sessions]) => {
          const key = normLoc(conceptId);
          if (!key) return;
          const arr = Array.isArray(sessions) ? sessions : [];
          const count = arr.filter((session) => {
            if (!session || typeof session !== 'object') return false;
            if (session.completed_at || session.suggested_mastery != null) return true;
            return Array.isArray(session.questions) && session.questions.length > 0 && session.correct_count != null;
          }).length;
          if (count > 0) map.set(key, (map.get(key) || 0) + count);
        });
      }
    } catch (_) {}

    __cmmAiQuizCountsRaw = raw;
    __cmmAiQuizCountsByConcept = map;
    return map;
  }

  function aiQuizCountForConceptLoc(loc) {
    const key = normLoc(loc);
    if (!key) return 0;
    const map = readAiQuizCountsByConcept();
    if (map.has(key)) return safeNum(map.get(key));
    return 0;
  }

  function recencyLabel(ts) {
    const n = safeNum(ts);
    if (!n) return "No activity yet";
    const diff = Date.now() - n;
    const day = 24 * 60 * 60 * 1000;
    if (diff < 60 * 60 * 1000) return "Active today";
    if (diff < day) return "Touched today";
    if (diff < 2 * day) return "Touched yesterday";
    const days = Math.floor(diff / day);
    if (days < 7) return `Touched ${days} days ago`;
    if (days < 30) return `Touched ${Math.floor(days / 7)} weeks ago`;
    return `Touched ${Math.floor(days / 30)} months ago`;
  }

  function lectureHeatTone(lecture) {
    const weakRatio = lecture.total ? lecture.weak / lecture.total : 0;
    const unratedRatio = lecture.total ? (lecture.total - lecture.rated) / lecture.total : 0;
    const visitRatio = lecture.total ? lecture.visited / lecture.total : 0;
    const readinessAvg = safeNum(lecture && (lecture.readinessAvg ?? lecture.avgPct));
    const avg = readinessAvg / 100;
    if (weakRatio >= 0.4 || unratedRatio >= 0.55) return "is-hot";
    if (avg >= 0.78 && weakRatio <= 0.12 && unratedRatio <= 0.25) return "is-cool";
    if (visitRatio < 0.35) return "is-cold";
    return "is-mid";
  }

  function courseTokenForPage(anchor) {
    const fromAttr = String(anchor && anchor.getAttribute && anchor.getAttribute("data-course-mastery-map") || "").trim().toLowerCase();
    if (fromAttr) return fromAttr;
    const wrap = q('.course-search[data-course-token]');
    const fromWrap = String(wrap && wrap.getAttribute && wrap.getAttribute('data-course-token') || '').trim().toLowerCase();
    if (fromWrap) return fromWrap;
    const meta = document.querySelector('meta[name="tags"], meta[property="tags"]');
    const content = String(meta && meta.getAttribute && meta.getAttribute('content') || '').trim().toLowerCase();
    if (content) {
      const first = content.split(',').map((x) => x.trim()).filter(Boolean)[0];
      if (first) return first;
    }
    return '';
  }

  function pageMatchesCourse(page, token, scope) {
    const tags = Array.isArray(page && page.tags) ? page.tags.map((x) => String(x || '').trim().toLowerCase()) : [];
    const lecture = lectureInfoFromTags(tags);
    if (token && tags.includes(token)) return true;
    if (token && lecture && lecture.courseCode === token) return true;
    const path = normLoc(page && page.location);
    if (scope && scope.courseSeg) {
      const segs = path.split('/').filter(Boolean);
      if (segs.length >= 2 && segs[1] === scope.courseSeg) return true;
    }
    return false;
  }

  function absoluteHref(loc) {
    try {
      return new URL(String(loc || '').replace(/^\/+/, ''), getSiteRootUrl()).toString();
    } catch (_) {
      return String(loc || '');
    }
  }

  function metricValueCard(label, value, helper) {
    return `
      <div class="cmm-metric">
        <div class="cmm-metric__label">${escapeHtml(label)}</div>
        <div class="cmm-metric__value">${escapeHtml(value)}</div>
        <div class="cmm-metric__helper">${escapeHtml(helper)}</div>
      </div>
    `;
  }

  function buildCourseDiagnosticHead(score) {
    const hasScore = Number.isFinite(Number(score));
    const pct = hasScore ? Math.max(0, Math.min(100, Math.round(Number(score)))) : null;
    return `
      <div class="cmm-head">
        <div class="cmm-head__row">
          ${hasScore ? `
            <div class="cmm-headreadiness-wrap">
              <button type="button" class="cmm-headreadiness cmm-headreadiness--orb" data-cmm-course-readiness-info="1" style="${escapeHtml(readinessToneStyle(pct))}" aria-label="${escapeHtml(`Course mastery readiness ${pct}%. This score finds the teaching units and concepts to review first from ratings, visits, review history, and staleness. Lower mastery readiness means review sooner.`)}">
                <strong>${escapeHtml(String(pct))}%</strong>
                <span>Course mastery</span>
              </button>
              <div class="cmm-readiness-help" hidden>Course mastery readiness finds the teaching units and concepts to review first from ratings, visits, review history, and staleness. Lower mastery readiness means review sooner.</div>
            </div>
          ` : ''}
          <div class="cmm-headcopy">
            <div class="cmm-title" id="${PANEL_ID}-title">Course diagnostics</div>
            <div class="cmm-sub">Course mastery readiness finds the teaching units and concepts to review first from ratings, visits, review history, and staleness. It is separate from prerequisite readiness.</div>
          </div>
        </div>
      </div>
    `;
  }


  function clamp01(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    if (n <= 0) return 0;
    if (n >= 1) return 1;
    return n;
  }

  function clamp(v, min, max) {
    const n = Number(v);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function daysSince(ts) {
    const n = safeNum(ts);
    if (!n) return Infinity;
    return Math.max(0, (Date.now() - n) / (24 * 60 * 60 * 1000));
  }

  function historySignals(history) {
    const items = (Array.isArray(history) ? history : [])
      .slice()
      .sort((a, b) => safeNum(a && (a.ts || a.time || a.at || a.date)) - safeNum(b && (b.ts || b.time || b.at || b.date)));

    let weakRatings = 0;
    let masteryEvents = 0;
    let viewEvents = 0;
    let flips = 0;
    let lastMastery = null;
    let lastMasteryTs = 0;
    let lastWeakTs = 0;
    let weakAfterStrong = 0;

    for (const item of items) {
      const kind = String(item && (item.kind || item.type || item.event || item.action) || '').toLowerCase().trim();
      const ts = safeNum(item && (item.ts || item.time || item.at || item.date));
      const maybeM = item && Object.prototype.hasOwnProperty.call(item, 'm') ? Number(item.m) : Number(item && (item.level ?? item.mastery));
      const isView = kind === 'view' || kind === 'visit' || kind === 'seen';
      if (isView) {
        viewEvents += 1;
        continue;
      }
      if (![0, 1, 2, 3].includes(maybeM)) continue;
      masteryEvents += 1;
      if (maybeM <= 1) {
        weakRatings += 1;
        lastWeakTs = Math.max(lastWeakTs, ts);
        if (lastMastery != null && lastMastery >= 2) weakAfterStrong += 1;
      }
      if (lastMastery != null && lastMastery !== maybeM) flips += 1;
      lastMastery = maybeM;
      lastMasteryTs = Math.max(lastMasteryTs, ts);
    }

    return { weakRatings, masteryEvents, viewEvents, flips, lastMasteryTs, lastWeakTs, weakAfterStrong };
  }

  function lectureRiskScore(lecture) {
    const weakRatio = lecture.total ? lecture.weak / lecture.total : 0;
    const unratedRatio = lecture.total ? (lecture.total - lecture.rated) / lecture.total : 0;
    const visitedRatio = lecture.total ? lecture.visited / lecture.total : 0;
    const avg = lecture.rated ? lecture.avgPct / 100 : 0.45;
    const score = (
      weakRatio * 0.42 +
      unratedRatio * 0.24 +
      (1 - avg) * 0.20 +
      (1 - visitedRatio) * 0.14
    ) * 100;
    return Math.round(clamp(score, 0, 100));
  }

  function lectureRiskLabel(score) {
    const s = Number(score) || 0;
    if (s >= 75) return 'Needs review';
    if (s >= 56) return 'Low mastery readiness';
    if (s >= 38) return 'Partial mastery readiness';
    return 'Looks secure';
  }

  function lectureRiskToneByScore(score) {
    const s = Number(score) || 0;
    if (s >= 75) return 'is-hot';
    if (s >= 56) return 'is-mid';
    if (s >= 38) return 'is-cold';
    return 'is-cool';
  }

  function conceptSignals(concept, lectureRisk) {
    const rec = concept && concept.record ? concept.record : null;
    const hist = historySignals(rec && rec.history);
    const visited = !!(rec && rec.visited);
    const explicit = isExplicitRating(rec);
    const m = explicit ? rec.m : null;
    const activityTs = Math.max(concept && concept.lastActivity ? concept.lastActivity : 0, hist.lastMasteryTs);
    const staleDays = daysSince(activityTs);
    const staleFactor = staleDays === Infinity ? 1 : clamp01((staleDays - 2) / 21);
    const revisitLoad = clamp01((safeNum(rec && rec.viewCount) + safeNum(rec && rec.reviewCount) - 1) / 8);
    const weakHistory = clamp01(hist.weakRatings / 4);
    const volatility = clamp01(hist.flips / 5);
    const lectureFactor = clamp01((Number(lectureRisk) || 0) / 100);

    // Mastery readiness is intentionally anchored at the two intuitive extremes:
    // - never visited = 0 mastery-ready
    // - freshly rated Mastered, with no warning signals = 100 mastery-ready
    // The extra factors below only reduce mastery readiness when there is evidence that the
    // stored rating may be stale or unstable.
    let baseWeak = 0.56;
    if (!visited) baseWeak = 1.00;
    else if (!explicit) baseWeak = 0.74;
    else if (m === 0) baseWeak = 1.00;
    else if (m === 1) baseWeak = 0.74;
    else if (m === 2) baseWeak = 0.26;
    else if (m === 3) baseWeak = 0.00;

    let score = (
      baseWeak * 0.68 +
      staleFactor * 0.12 +
      revisitLoad * 0.08 +
      weakHistory * 0.06 +
      volatility * 0.03 +
      lectureFactor * 0.03
    ) * 100;

    if (!visited) score = 100;
    else if (!explicit) score = Math.max(score, 72 + staleFactor * 10 + lectureFactor * 6);
    else if (m === 0) score = 100;
    else if (m === 1) score = Math.max(score, 72 + staleFactor * 8 + lectureFactor * 5);
    else if (m === 3 && staleFactor === 0 && revisitLoad === 0 && weakHistory === 0 && volatility === 0 && lectureFactor === 0) score = 0;

    const falseMasteryBase = explicit && m >= 2
      ? (
          (m === 2 ? 0.22 : 0.10) +
          staleFactor * 0.28 +
          clamp01(Math.max(0, safeNum(rec && rec.viewCount) - safeNum(rec && rec.reviewCount)) / 6) * 0.22 +
          weakHistory * 0.18 +
          clamp01(hist.weakAfterStrong / 2) * 0.10 +
          volatility * 0.12
        ) * 100
      : 0;

    const falseMasteryScore = Math.round(clamp(falseMasteryBase, 0, 100));

    const reasons = [];
    if (!visited) reasons.push('not visited yet');
    else if (!explicit) reasons.push('visited but not rated');
    else if (m === 0) reasons.push('currently rated Unknown');
    else if (m === 1) reasons.push('currently rated Fuzzy');
    else if (m === 2) reasons.push('currently rated Clear');
    else if (m === 3) reasons.push('currently rated Mastered');
    if (Number.isFinite(staleDays) && staleDays >= 7) reasons.push(`${Math.round(staleDays)} days since last touch`);
    if (safeNum(rec && rec.viewCount) + safeNum(rec && rec.reviewCount) >= 4) reasons.push('revisited many times');
    if (hist.weakRatings >= 2) reasons.push('multiple low ratings in history');
    if (hist.flips >= 3) reasons.push('mastery changed several times');

    const weakScore = Math.round(clamp(score, 0, 100));
    const readinessScore = 100 - weakScore;
    const confidenceScore = 100 - falseMasteryScore;

    return {
      weakScore,
      readinessScore,
      falseMasteryScore,
      confidenceScore,
      staleDays,
      revisitLoad,
      weakHistory,
      volatility,
      lectureRisk: Number(lectureRisk) || 0,
      history: hist,
      reasons,
    };
  }

  function buildDiagnosis(summary) {
    const lectureDiagnostics = (summary && Array.isArray(summary.lectures) ? summary.lectures : []).map((lecture) => {
      const riskScore = lectureRiskScore(lecture);
      return {
        lecture,
        lectureNum: lecture.lectureNum,
        label: lecture.label,
        readinessAvg: safeNum(lecture && lecture.readinessAvg),
        riskScore,
        riskLabel: lectureRiskLabel(riskScore),
        tone: lectureRiskToneByScore(riskScore),
        weakRatio: lecture.total ? lecture.weak / lecture.total : 0,
        unratedRatio: lecture.total ? (lecture.total - lecture.rated) / lecture.total : 0,
        visitedRatio: lecture.total ? lecture.visited / lecture.total : 0,
      };
    }).sort((a, b) => {
      if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
      return a.lectureNum - b.lectureNum;
    });

    const lectureRiskMap = new Map(lectureDiagnostics.map((item) => [String(item.lectureNum), item.riskScore]));

    const conceptDiagnostics = (summary && Array.isArray(summary.concepts) ? summary.concepts : []).map((concept) => {
      const lectureRisk = lectureRiskMap.get(String(concept.lectureNum)) || 0;
      const signals = conceptSignals(concept, lectureRisk);
      return {
        key: concept.location,
        concept,
        lectureNum: concept.lectureNum,
        weakScore: signals.weakScore,
        readinessScore: signals.readinessScore,
        falseMasteryScore: signals.falseMasteryScore,
        confidenceScore: signals.confidenceScore,
        signals,
      };
    });

    const lectureReadinessMap = new Map();
    let courseReadinessSum = 0;
    let courseReadinessCount = 0;

    conceptDiagnostics.forEach((item) => {
      const lectureKey = String(item.lectureNum);
      const readiness = Math.max(0, Math.min(100, safeNum(item && item.readinessScore)));
      const bucket = lectureReadinessMap.get(lectureKey) || { sum: 0, count: 0 };
      bucket.sum += readiness;
      bucket.count += 1;
      lectureReadinessMap.set(lectureKey, bucket);
      courseReadinessSum += readiness;
      courseReadinessCount += 1;
    });

    lectureDiagnostics.forEach((item) => {
      const bucket = lectureReadinessMap.get(String(item.lectureNum)) || { sum: 0, count: 0 };
      const readinessAvg = bucket.count ? Math.round(bucket.sum / bucket.count) : 0;
      item.readinessAvg = readinessAvg;
      if (item.lecture && typeof item.lecture === 'object') item.lecture.readinessAvg = readinessAvg;
    });

    const courseReadinessAvg = courseReadinessCount ? Math.round(courseReadinessSum / courseReadinessCount) : 0;

    const byConcept = new Map(conceptDiagnostics.map((item) => [item.key, item]));

    const topWeak = conceptDiagnostics
      .filter((item) => item.weakScore >= 40 || !item.concept.record || !item.concept.record.visited || !isExplicitRating(item.concept.record))
      .sort((a, b) => {
        if (b.weakScore !== a.weakScore) return b.weakScore - a.weakScore;
        return (b.signals.lectureRisk || 0) - (a.signals.lectureRisk || 0);
      })
      .slice(0, 8);

    const falseMastery = conceptDiagnostics
      .filter((item) => isExplicitRating(item.concept.record) && item.concept.record.m >= 2 && item.falseMasteryScore >= 34)
      .sort((a, b) => {
        if (b.falseMasteryScore !== a.falseMasteryScore) return b.falseMasteryScore - a.falseMasteryScore;
        return b.weakScore - a.weakScore;
      })
      .slice(0, 6);

    const mostUnratedLecture = lectureDiagnostics
      .slice()
      .sort((a, b) => {
        const au = a.lecture.total - a.lecture.rated;
        const bu = b.lecture.total - b.lecture.rated;
        if (bu !== au) return bu - au;
        return safeNum(a.readinessAvg) - safeNum(b.readinessAvg);
      })[0] || null;

    const lowestReadinessLecture = lectureDiagnostics
      .slice()
      .sort((a, b) => {
        const ar = Math.max(0, Math.min(100, safeNum(a && a.readinessAvg)));
        const br = Math.max(0, Math.min(100, safeNum(b && b.readinessAvg)));
        if (ar !== br) return ar - br;
        return safeNum(b && b.lecture && b.lecture.total) - safeNum(a && a.lecture && a.lecture.total);
      })[0] || null;

    const actions = [];
    if (lowestReadinessLecture) {
      actions.push({
        kind: 'lecture',
        lectureNum: lowestReadinessLecture.lectureNum,
        title: `Review ${lowestReadinessLecture.label}`,
        note: `Mastery readiness ${Math.max(0, Math.min(100, safeNum(lowestReadinessLecture.readinessAvg)))}% · review this learning unit first`,
      });
    }
    if (topWeak[0]) {
      actions.push({
        kind: 'concept',
        conceptKey: topWeak[0].key,
        title: `Review ${topWeak[0].concept.title}`,
        note: `Mastery readiness ${topWeak[0].readinessScore}% · review this concept first`,
      });
    }
    if (mostUnratedLecture && (mostUnratedLecture.lecture.total - mostUnratedLecture.lecture.rated) > 0) {
      actions.push({
        kind: 'lecture',
        lectureNum: mostUnratedLecture.lectureNum,
        title: `Rate ${mostUnratedLecture.label}`,
        note: `${mostUnratedLecture.lecture.total - mostUnratedLecture.lecture.rated} concepts still unrated`,
      });
    }

    return {
      lectureDiagnostics,
      conceptDiagnostics,
      byConcept,
      topWeak,
      falseMastery,
      courseReadinessAvg,
      actions: actions.slice(0, 3),
    };
  }

  function ensureSelectedConcept(summary, diagnosis) {
    const curr = String(state.selectedConceptLoc || '');
    if (curr && diagnosis.byConcept.has(curr)) return diagnosis.byConcept.get(curr);
    state.selectedConceptLoc = '';
    return null;
  }

  function shortRecencyLabel(ts) {
    const n = safeNum(ts);
    if (!n) return 'No activity';
    const d = daysSince(n);
    if (!Number.isFinite(d)) return 'No activity';
    if (d < 1) return 'Today';
    if (d < 2) return 'Yesterday';
    if (d < 7) return `${Math.round(d)}d ago`;
    if (d < 30) return `${Math.round(d / 7)}w ago`;
    return `${Math.round(d / 30)}mo ago`;
  }

  function levelShort(rec) {
    if (!rec || (!rec.visited && !isExplicitRating(rec))) return '•';
    if (!isExplicitRating(rec)) return 'V';
    if (rec.m === 3) return 'M';
    if (rec.m === 2) return 'C';
    if (rec.m === 1) return 'F';
    if (rec.m === 0) return 'D';
    return '•';
  }

  function tileStyle(entry) {
    const weak = clamp01((entry && entry.weakScore ? entry.weakScore : 0) / 100);
    const hue = Math.round(158 - weak * 154);
    const sat = Math.round(62 + weak * 18);
    const light = Math.round(95 - weak * 18);
    const borderLight = Math.max(30, light - 34);
    return `--cmm-h:${hue};--cmm-s:${sat}%;--cmm-l:${light}%;--cmm-bl:${borderLight}%;--cmm-a:${(0.22 + weak * 0.18).toFixed(3)};`;
  }

  function scoreOrbStyle(entry) {
    const weak = clamp01((entry && entry.weakScore ? entry.weakScore : 0) / 100);
    const hue = Math.round(158 - weak * 154);
    const sat = Math.round(58 + weak * 20);
    const light = Math.round(92 - weak * 18);
    const borderLight = Math.max(30, light - 30);
    return `--cmm-h:${hue};--cmm-s:${sat}%;--cmm-l:${light}%;--cmm-bl:${borderLight}%;`;
  }

  function readinessToneStyle(value) {
    const pct = clampPct(value);
    const weak = 1 - (pct / 100);
    const hue = Math.round(158 - weak * 154);
    const sat = Math.round(58 + weak * 20);
    const fillLight = Math.round(64 - weak * 1);
    const bgLight = Math.round(92 - weak * 17);
    const borderLight = Math.max(34, Math.round(fillLight - 18));
    const inkLight = Math.max(20, Math.round(fillLight - 38));
    return `--cmm-h:${hue};--cmm-s:${sat}%;--cmm-fill-l:${fillLight}%;--cmm-bg-l:${bgLight}%;--cmm-border-l:${borderLight}%;--cmm-ink-l:${inkLight}%;`;
  }

  function readinessBarFillStyle(value) {
    const pct = clampPct(value);
    return `${readinessToneStyle(pct)}width:${pct}%;`;
  }

  function readinessTimelineFillStyle(value) {
    const pct = clampPct(value);
    return `${readinessToneStyle(pct)}height:${pct}%;width:100%;`;
  }

  function clampPct(value) {
    return Math.max(0, Math.min(100, safeNum(value)));
  }

  function readinessPct(entry) {
    return clampPct(entry && entry.readinessScore);
  }

  function readinessValueLabel(value) {
    return `Mastery readiness ${clampPct(value)}%`;
  }

  function readinessStat(entry) {
    return readinessValueLabel(readinessPct(entry));
  }
  function prerequisiteReadinessValueLabel(value) {
    return `Prerequisite readiness ${clampPct(value)}%`;
  }

  function applyPrereqReadinessOrb(el, data) {
    if (!el) return;
    const ok = !!(data && data.status === 'ok');
    const pct = ok ? clampPct(data.pct) : null;
    const valueEl = el.querySelector('[data-cmm-prereq-pct]');
    const label = ok ? prerequisiteReadinessValueLabel(pct) : 'Prerequisite readiness unavailable';
    if (valueEl) valueEl.textContent = ok ? `${pct}%` : '--';
    el.setAttribute('title', data && data.explain ? `${label}. ${data.explain}` : label);
    el.setAttribute('aria-label', data && data.explain ? `${label}. ${data.explain}` : label);
    if (ok) {
      el.setAttribute('style', readinessToneStyle(pct));
      el.classList.remove('is-loading', 'is-unavailable');
    } else {
      el.setAttribute('style', '');
      el.classList.toggle('is-loading', !!(data && data.status === 'loading'));
      el.classList.toggle('is-unavailable', !(data && data.status === 'loading'));
    }
  }


  const CMM_HOT_API_BASE = String((window.MkHotTrack && window.MkHotTrack.apiBase) || window.MKDOCS_HOT_API_BASE || "https://hot.eor-wiki.workers.dev").replace(/\/+$/g, "");

  function cmmVisitorId() {
    try {
      if (window.MkHotTrack && typeof window.MkHotTrack.getVisitorId === 'function') return window.MkHotTrack.getVisitorId();
      const key = 'mk_hot_visitor_id_v1';
      let id = localStorage.getItem(key);
      if (!id) {
        id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `v_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(key, id);
      }
      return id;
    } catch (_) {
      return 'anonymous';
    }
  }

  async function cmmApiGet(path) {
    try {
      const res = await fetch(CMM_HOT_API_BASE + path, { cache: 'no-store' });
      return res ? await res.json().catch(() => null) : null;
    } catch (_) {
      return null;
    }
  }

  async function cmmApiPost(path, body) {
    try {
      const res = await fetch(CMM_HOT_API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
        keepalive: false,
      });
      return res ? await res.json().catch(() => null) : null;
    } catch (_) {
      return null;
    }
  }

  function publicScoreAvgLabel(type, value, count) {
    const n = Number(value);
    const label = type === 'mastery' ? 'public mastery average' : 'public prerequisite average';
    if (!Number.isFinite(n)) return `No ${label} yet`;
    const c = Math.max(0, Math.floor(Number(count) || 0));
    return `${Math.round(n * 10) / 10}% ${label}${c ? ` from ${c} public user${c === 1 ? '' : 's'}` : ''}`;
  }

  function applyPublicScoreAverage(panel, loc, type, data) {
    if (!panel || !loc || !type) return;
    const el = Array.from(panel.querySelectorAll(`[data-cmm-public-score-avg="${type}"]`))
      .find((node) => normLoc(node.getAttribute('data-cmm-public-score-for')) === normLoc(loc)) || null;
    if (!el) return;
    const valueEl = el.querySelector('[data-cmm-public-score-value]');
    const avg = data && data.average != null ? Number(data.average) : null;
    const count = data && data.count != null ? Number(data.count) : 0;
    if (Number.isFinite(avg)) {
      const shown = `${Math.round(avg * 10) / 10}%`;
      if (valueEl) valueEl.textContent = shown;
      el.classList.remove('is-loading', 'is-unavailable');
      el.setAttribute('title', publicScoreAvgLabel(type, avg, count));
      el.setAttribute('aria-label', publicScoreAvgLabel(type, avg, count));
    } else {
      if (valueEl) valueEl.textContent = '--';
      el.classList.toggle('is-loading', !!(data && data.status === 'loading'));
      el.classList.toggle('is-unavailable', !(data && data.status === 'loading'));
      const label = data && data.status === 'loading' ? 'Public average loading' : publicScoreAvgLabel(type, null, 0);
      el.setAttribute('title', label);
      el.setAttribute('aria-label', label);
    }
  }

  async function syncSelectedPublicScoreAverages(panel, selected, localScores) {
    if (!panel || !selected || !selected.concept) return;
    const loc = normLoc(selected.concept.location);
    if (!loc) return;
    const title = selected.concept.title || '';
    const scores = localScores && typeof localScores === 'object' ? localScores : {};

    applyPublicScoreAverage(panel, loc, 'mastery', { status: 'loading' });
    applyPublicScoreAverage(panel, loc, 'prereq', { status: 'loading' });

    try {
      const bodyScores = {};
      if (scores.mastery != null && Number.isFinite(Number(scores.mastery))) bodyScores.mastery = clampPct(scores.mastery);
      if (scores.prereq != null && Number.isFinite(Number(scores.prereq))) bodyScores.prereq = clampPct(scores.prereq);
      if (Object.keys(bodyScores).length) {
        await cmmApiPost('/concept-score', { visitorId: cmmVisitorId(), path: loc, title, scores: bodyScores });
      }
    } catch (_) {}

    const [masteryAvg, prereqAvg] = await Promise.all([
      cmmApiGet(`/concept-score/average?path=${encodeURIComponent(loc)}&type=mastery&visitorId=${encodeURIComponent(cmmVisitorId())}`),
      cmmApiGet(`/concept-score/average?path=${encodeURIComponent(loc)}&type=prereq&visitorId=${encodeURIComponent(cmmVisitorId())}`),
    ]);
    applyPublicScoreAverage(panel, loc, 'mastery', masteryAvg && masteryAvg.ok ? masteryAvg : { status: 'unavailable' });
    applyPublicScoreAverage(panel, loc, 'prereq', prereqAvg && prereqAvg.ok ? prereqAvg : { status: 'unavailable' });
  }

  async function syncSelectedPrereqReadiness(panel, selected) {
    if (!panel || !selected || !selected.concept) return;
    const loc = normLoc(selected.concept.location);
    if (!loc) return;
    const findOrb = () => Array.from(panel.querySelectorAll('[data-cmm-prereq-readiness-for]'))
      .find((node) => normLoc(node.getAttribute('data-cmm-prereq-readiness-for')) === loc) || null;
    const el = findOrb();
    if (!el) return;

    const cache = state.prereqReadyCache instanceof Map ? state.prereqReadyCache : (state.prereqReadyCache = new Map());
    if (cache.has(loc)) {
      const cached = cache.get(loc);
      applyPrereqReadinessOrb(el, cached);
      syncSelectedPublicScoreAverages(panel, selected, { mastery: readinessPct(selected), prereq: cached && cached.status === 'ok' ? clampPct(cached.pct) : null });
      return;
    }

    applyPrereqReadinessOrb(el, { status: 'loading' });
    if (!window.ConceptMastery || typeof window.ConceptMastery.readinessOf !== 'function') {
      applyPrereqReadinessOrb(el, { status: 'unavailable' });
      syncSelectedPublicScoreAverages(panel, selected, { mastery: readinessPct(selected), prereq: null });
      return;
    }

    const seq = ++state.prereqReadySeq;
    const data = await window.ConceptMastery.readinessOf(loc, { maxDepth: 2 }).catch(() => ({ status: 'unavailable' }));
    if (seq !== state.prereqReadySeq) return;
    cache.set(loc, data);
    const current = findOrb();
    if (current) applyPrereqReadinessOrb(current, data);
    syncSelectedPublicScoreAverages(panel, selected, { mastery: readinessPct(selected), prereq: data && data.status === 'ok' ? clampPct(data.pct) : null });
  }


  function buildMiniConceptButton(entry, subtitle, emphasis) {
    if (!entry) return '';
    const rec = entry.concept.record;
    const cls = levelClass(rec);
    const stat = emphasis || readinessStat(entry);
    return `
      <button type="button" class="cmm-minirow" data-cmm-select-concept="${escapeHtml(entry.key)}">
        <span class="cmm-minirow__dot ${cls}" aria-hidden="true"></span>
        <span class="cmm-minirow__body">
          <span class="cmm-minirow__title">${escapeHtml(entry.concept.title)}</span>
          <span class="cmm-minirow__sub">${escapeHtml(subtitle)}</span>
        </span>
        <span class="cmm-minirow__stat">${escapeHtml(stat)}</span>
      </button>
    `;
  }


  function todayKeyLocal() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function shortDateLabel(dateKey) {
    const s = String(dateKey || '');
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return s || 'today';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = Math.max(0, Math.min(11, Number(m[2]) - 1));
    const day = String(Number(m[3]) || m[3]);
    return `${monthNames[monthIdx]} ${day}`;
  }

  function safeReadDailyHistory() {
    try {
      const raw = localStorage.getItem(DAILY_HISTORY_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch (_) {
      return {};
    }
  }

  function safeWriteDailyHistory(obj) {
    try { localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(obj || {})); } catch (_) {}
  }

  function normaliseDailySnapshots(arr) {
    return (Array.isArray(arr) ? arr : [])
      .filter((x) => x && typeof x === 'object' && x.date)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .slice(-DAILY_HISTORY_LIMIT);
  }

  function snapshotForCourse(summary, diagnosis) {
    const lectures = (diagnosis && Array.isArray(diagnosis.lectureDiagnostics) ? diagnosis.lectureDiagnostics : [])
      .slice()
      .sort((a, b) => safeNum(a && a.lectureNum) - safeNum(b && b.lectureNum))
      .map((item) => ({
        lectureNum: safeNum(item && item.lectureNum),
        label: String(item && item.label || ''),
        readiness: clampPct((item && item.readinessAvg) ?? (item && item.lecture && item.lecture.readinessAvg)),
      }));
    return {
      date: todayKeyLocal(),
      ts: Date.now(),
      courseReadiness: clampPct(diagnosis && diagnosis.courseReadinessAvg),
      totalConcepts: safeNum(summary && summary.totals && summary.totals.total),
      lectures,
    };
  }

  function cmmRecordDailySnapshot(courseKey, summary, diagnosis) {
    const key = String(courseKey || 'course').replace(/[^a-z0-9|/_-]+/gi, '_').slice(0, 120) || 'course';
    const store = safeReadDailyHistory();
    const currentRaw = snapshotForCourse(summary, diagnosis);
    const arr = normaliseDailySnapshots(store[key]);
    const existingIdx = arr.findIndex((x) => String(x.date) === String(currentRaw.date));

    let current = currentRaw;
    if (existingIdx >= 0) {
      const previousToday = arr[existingIdx] || {};
      const startCourseReadiness = previousToday.startCourseReadiness != null
        ? clampPct(previousToday.startCourseReadiness)
        : clampPct(previousToday.courseReadiness);
      const startTs = safeNum(previousToday.startTs) || safeNum(previousToday.ts) || Date.now();
      const startLectureMap = new Map((Array.isArray(previousToday.lectures) ? previousToday.lectures : []).map((lec) => [String(lec.lectureNum), lec]));
      current = Object.assign({}, currentRaw, {
        startTs,
        startCourseReadiness,
        lectures: (Array.isArray(currentRaw.lectures) ? currentRaw.lectures : []).map((lec) => {
          const old = startLectureMap.get(String(lec.lectureNum)) || {};
          return Object.assign({}, lec, {
            startReadiness: old.startReadiness != null ? clampPct(old.startReadiness) : (old.readiness != null ? clampPct(old.readiness) : clampPct(lec.readiness)),
          });
        }),
      });
      arr[existingIdx] = current;
    } else {
      current = Object.assign({}, currentRaw, {
        startTs: currentRaw.ts,
        startCourseReadiness: clampPct(currentRaw.courseReadiness),
        lectures: (Array.isArray(currentRaw.lectures) ? currentRaw.lectures : []).map((lec) => Object.assign({}, lec, {
          startReadiness: clampPct(lec.readiness),
        })),
      });
      arr.push(current);
    }

    const cleaned = normaliseDailySnapshots(arr);
    store[key] = cleaned;
    safeWriteDailyHistory(store);

    const previousDay = cleaned.slice().reverse().find((x) => String(x.date) < String(current.date)) || null;
    const hasPreviousDay = !!previousDay;
    const hasTodayBaseline = !hasPreviousDay && safeNum(current.startTs) && safeNum(current.startTs) !== safeNum(current.ts);
    const compareBase = hasPreviousDay
      ? { type: 'previous-day', label: shortDateLabel(previousDay.date), courseReadiness: clampPct(previousDay.courseReadiness), lectures: previousDay.lectures || [] }
      : (hasTodayBaseline
        ? { type: 'today-start', label: 'first snapshot today', courseReadiness: clampPct(current.startCourseReadiness), lectures: (current.lectures || []).map((lec) => Object.assign({}, lec, { readiness: lec.startReadiness })) }
        : null);

    const prevMap = new Map((compareBase && Array.isArray(compareBase.lectures) ? compareBase.lectures : []).map((x) => [String(x.lectureNum), x]));
    const lectureChanges = (Array.isArray(current.lectures) ? current.lectures : []).map((lec) => {
      const prev = prevMap.get(String(lec.lectureNum));
      const before = prev ? clampPct(prev.readiness) : null;
      const after = clampPct(lec.readiness);
      return {
        lectureNum: lec.lectureNum,
        label: lec.label || `${unitNounFromType(lec && lec.unitType)} ${lec.lectureNum}`,
        before,
        after,
        delta: before == null ? null : after - before,
      };
    }).filter((x) => x && x.delta != null);

    lectureChanges.sort((a, b) => {
      if (b.delta !== a.delta) return b.delta - a.delta;
      return safeNum(a.lectureNum) - safeNum(b.lectureNum);
    });

    return {
      key,
      snapshots: cleaned,
      current,
      previous: previousDay,
      compareBase,
      courseDelta: compareBase ? clampPct(current.courseReadiness) - clampPct(compareBase.courseReadiness) : null,
      lectureChanges,
    };
  }

  function levelBucketKey(rec) {
    if (!rec || (!rec.visited && !isExplicitRating(rec))) return 'notVisited';
    if (!isExplicitRating(rec)) return 'visitedOnly';
    if (rec.m === 0) return 'unknown';
    if (rec.m === 1) return 'fuzzy';
    if (rec.m === 2) return 'clear';
    if (rec.m === 3) return 'mastered';
    return rec.visited ? 'visitedOnly' : 'notVisited';
  }

  function buildSelectedConceptCard(entry) {
    if (!entry) {
      return `
        <section class="cmm-sidecard cmm-sidecard--focus cmm-focuscard cmm-focuscard--empty">
          <div class="cmm-focuscard__body">
            <div class="cmm-focuscard__main">
              <div class="cmm-sidecard__kicker">Current focus</div>
              <div class="cmm-sidecard__title">No concept selected</div>
              <div class="cmm-sidecard__sub">Select a concept tile below to inspect its mastery level, visit history, rating evidence, mastery readiness, and prerequisite readiness.</div>
            </div>
          </div>
        </section>
      `;
    }

    const concept = entry.concept;
    const rec = concept.record;
    const href = absoluteHref(concept.location);
    const level = levelLabel(rec);
    const visits = Math.max(safeNum(rec && rec.viewCount), safeNum(rec && rec.visitCount));
    const lastVisitTs = Math.max(safeNum(rec && rec.lastViewed), latestViewTsFromHistory(rec && rec.history));
    const lastVisit = lastVisitTs ? shortRecencyLabel(lastVisitTs) : 'Not visited';
    const aiChecks = aiQuizCountForConceptLoc(concept.location);
    const selfRatings = directMasteryUpdateCount(rec);
    const evidenceTitle = aiChecks > 0
      ? `${aiChecks} completed AI mastery check${aiChecks === 1 ? '' : 's'} for this concept.`
      : `No completed AI mastery check yet. ${selfRatings} direct mastery rating${selfRatings === 1 ? '' : 's'} recorded.`;

    return `
      <section class="cmm-sidecard cmm-sidecard--focus cmm-focuscard">
        <div class="cmm-focuscard__body">
          <div class="cmm-focuscard__main">
            <div class="cmm-sidecard__kicker">Current focus</div>
            <a class="cmm-sidecard__title cmm-focuscard__titlelink" href="${escapeHtml(href)}" title="Open concept page">${escapeHtml(concept.title)}</a>
            <div class="cmm-focusfacts" aria-label="Selected concept details">
              <div class="cmm-focusfact"><span>Mastery</span><strong>${escapeHtml(level)}</strong></div>
              <div class="cmm-focusfact"><span>Last visit</span><strong>${escapeHtml(lastVisit)}</strong></div>
              <div class="cmm-focusfact"><span>Visits</span><strong>${escapeHtml(String(visits))}</strong></div>
              <div class="cmm-focusfact" title="${escapeHtml(evidenceTitle)}"><span>AI checks</span><strong>${escapeHtml(String(aiChecks))}</strong></div>
            </div>
          </div>
          <div class="cmm-focusorbs-stack" aria-label="Selected concept scores and public averages">
            <div class="cmm-focusorbs" aria-label="Selected concept mastery and prerequisite readiness scores">
              <div class="cmm-scoreorb cmm-scoreorb--mastery" style="${escapeHtml(scoreOrbStyle(entry))}" title="${escapeHtml(readinessValueLabel(readinessPct(entry)))}" aria-label="${escapeHtml(readinessValueLabel(readinessPct(entry)))}"><span>${escapeHtml(String(readinessPct(entry)))}%</span><small>Mastery</small></div>
              <div class="cmm-scoreorb cmm-scoreorb--prereq is-loading" data-cmm-prereq-readiness-for="${escapeHtml(concept.location)}" title="Prerequisite readiness loading" aria-label="Prerequisite readiness loading"><span data-cmm-prereq-pct>--</span><small>Prereq</small></div>
            </div>
            <div class="cmm-public-score-avgs" aria-label="Public averages for this concept">
              <div class="cmm-public-score-avg" data-cmm-public-score-avg="mastery" data-cmm-public-score-for="${escapeHtml(concept.location)}"><span>Public mastery avg</span><strong data-cmm-public-score-value>--</strong></div>
              <div class="cmm-public-score-avg" data-cmm-public-score-avg="prereq" data-cmm-public-score-for="${escapeHtml(concept.location)}"><span>Public prereq avg</span><strong data-cmm-public-score-value>--</strong></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function lectureStatusCounts(lecture) {
    const concepts = Array.isArray(lecture && lecture.concepts) ? lecture.concepts : [];
    const counts = {
      total: Math.max(0, safeNum(lecture && lecture.total) || concepts.length),
      notVisited: 0,
      visitedOnly: 0,
      unknown: 0,
      fuzzy: 0,
      clear: 0,
      mastered: 0,
      visited: 0,
      rated: 0,
      aiQuiz: 0,
      directMastery: 0,
    };

    concepts.forEach((concept) => {
      const rec = concept && concept.record ? concept.record : null;
      counts.aiQuiz += aiQuizCountForConceptLoc(concept && concept.location);
      counts.directMastery += directMasteryUpdateCount(rec);
      const key = levelBucketKey(rec);
      if (key === 'notVisited') counts.notVisited += 1;
      else if (key === 'visitedOnly') counts.visitedOnly += 1;
      else if (key === 'unknown') counts.unknown += 1;
      else if (key === 'fuzzy') counts.fuzzy += 1;
      else if (key === 'clear') counts.clear += 1;
      else if (key === 'mastered') counts.mastered += 1;

      if (rec && rec.visited) counts.visited += 1;
      if (isExplicitRating(rec)) counts.rated += 1;
    });

    if (!concepts.length && counts.total > 0) {
      counts.rated = Math.max(0, safeNum(lecture && lecture.rated));
      counts.visited = Math.max(0, safeNum(lecture && lecture.visited));
      counts.notVisited = Math.max(0, counts.total - counts.visited);
    }

    return counts;
  }

  function pctOf(part, total) {
    const denom = Math.max(0, safeNum(total));
    if (!denom) return 0;
    return Math.max(0, Math.min(100, Math.round((Math.max(0, safeNum(part)) / denom) * 100)));
  }

  function lectureMetricForLecture(metric, lecture) {
    const c = lectureStatusCounts(lecture);
    const label = lecture && lecture.label ? lecture.label : `${unitNounFromType(lecture && lecture.unitType)} ${lecture && lecture.lectureNum ? lecture.lectureNum : ''}`.trim();
    const lectureNum = safeNum(lecture && lecture.lectureNum);
    const readiness = clampPct((lecture && lecture.readinessAvg) ?? (lecture && lecture.avgPct));

    let pct = 0;
    let count = 0;
    let denom = c.total;
    let meta = '';
    let toneValue = 50;
    let display = '';

    if (metric.key === 'readinessHigh') {
      pct = readiness;
      count = readiness;
      denom = c.total;
      toneValue = readiness;
      display = `${pct}%`;
      meta = `Highest average mastery readiness across ${c.total} concepts`;
    } else if (metric.key === 'readinessLow') {
      pct = readiness;
      count = 100 - readiness;
      denom = c.total;
      toneValue = readiness;
      display = `${pct}%`;
      meta = `Lowest average mastery readiness across ${c.total} concepts`;
    } else if (metric.key === 'mastered') {
      count = c.mastered;
      denom = c.total;
      pct = pctOf(count, denom);
      toneValue = pct;
      display = `${pct}%`;
      meta = `Highest mastered share: ${count}/${denom} concepts`;
    } else if (metric.key === 'strong') {
      count = c.clear + c.mastered;
      denom = c.total;
      pct = pctOf(count, denom);
      toneValue = pct;
      display = `${pct}%`;
      meta = `Highest clear or mastered share: ${count}/${denom} concepts`;
    } else if (metric.key === 'fuzzy') {
      count = c.fuzzy;
      denom = c.total;
      pct = pctOf(count, denom);
      toneValue = 100 - pct;
      display = `${pct}%`;
      meta = `Highest fuzzy share: ${count}/${denom} concepts`;
    } else if (metric.key === 'visitedOnly') {
      count = c.visitedOnly;
      denom = c.visited;
      pct = pctOf(count, denom);
      toneValue = 100 - pct;
      display = `${pct}%`;
      meta = denom ? `Highest visited but unrated share: ${count}/${denom} visited concepts` : 'No visited concepts yet';
    } else if (metric.key === 'notVisited') {
      count = c.notVisited;
      denom = c.total;
      pct = pctOf(count, denom);
      toneValue = 100 - pct;
      display = `${pct}%`;
      meta = `Highest not visited share: ${count}/${denom} concepts`;
    } else if (metric.key === 'aiQuizCount') {
      count = c.aiQuiz;
      denom = Math.max(1, safeNum(metric.maxCount));
      pct = pctOf(count, denom);
      toneValue = count > 0 ? 86 : 25;
      display = String(count);
      meta = count === 1 ? '1 completed AI concept check in this learning unit' : `${count} completed AI concept checks in this learning unit`;
    } else if (metric.key === 'directMasteryCount') {
      count = c.directMastery;
      denom = Math.max(1, safeNum(metric.maxCount));
      pct = pctOf(count, denom);
      toneValue = count > 0 ? 86 : 25;
      display = String(count);
      meta = count === 1 ? '1 direct mastery rating submitted in this learning unit' : `${count} direct mastery ratings submitted in this learning unit`;
    }

    return { lecture, label, lectureNum, pct, count, denom, meta, toneValue, display };
  }

  function lectureHighlightRow(metric, allLectures) {
    const candidates = (Array.isArray(allLectures) ? allLectures : [])
      .map((lecture) => lectureMetricForLecture(metric, lecture))
      .filter((item) => item.lecture && item.denom > 0 && (!metric.requirePositive || item.count > 0))
      .sort((a, b) => {
        if (metric.sort === 'asc') {
          if (a.pct !== b.pct) return a.pct - b.pct;
          if (b.count !== a.count) return b.count - a.count;
        } else {
          if (b.pct !== a.pct) return b.pct - a.pct;
          if (b.count !== a.count) return b.count - a.count;
        }
        return safeNum(a.lectureNum) - safeNum(b.lectureNum);
      });

    const item = candidates[0] || null;
    if (!item) {
      const zeroLabel = metric.key === 'aiQuizCount' || metric.key === 'directMasteryCount' ? '0' : '0%';
      return `
        <div class="cmm-vizrow cmm-vizrow--static">
          <span class="cmm-vizrow__head">
            <span class="cmm-vizrow__award">${escapeHtml(metric.award)}</span>
            <span class="cmm-vizrow__score">${escapeHtml(zeroLabel)}</span>
          </span>
          <span class="cmm-vizrow__lecture">No learning-unit data yet</span>
          <span class="cmm-vizrow__meta">${escapeHtml(metric.empty || 'Open concepts to build this view.')}</span>
        </div>
      `;
    }

    const width = Math.max(0, Math.min(100, safeNum(item.pct)));
    const fillStyle = `${readinessToneStyle(item.toneValue)}width:${escapeHtml(String(width))}%`;
    return `
      <button type="button" class="cmm-vizrow" data-cmm-jump-lecture="${escapeHtml(String(item.lectureNum))}">
        <span class="cmm-vizrow__head">
          <span class="cmm-vizrow__award">${escapeHtml(metric.award)}</span>
          <span class="cmm-vizrow__score" style="${escapeHtml(readinessToneStyle(item.toneValue))}">${escapeHtml(item.display)}</span>
        </span>
        <span class="cmm-vizrow__lecture">${escapeHtml(item.label)}</span>
        <span class="cmm-vizbar"><span class="cmm-vizbar__fill" style="${escapeHtml(fillStyle)}"></span></span>
        <span class="cmm-vizrow__meta">${escapeHtml(item.meta)}</span>
      </button>
    `;
  }

  function buildLectureStatusHighlightsCard(summary) {
    const lectures = summary && Array.isArray(summary.lectures) ? summary.lectures : [];
    const unitNoun = summary && summary.unitNoun ? summary.unitNoun : 'Lecture';
    const aiCounts = lectures.map((lecture) => lectureMetricForLecture({ key: 'aiQuizCount' }, lecture).count);
    const directCounts = lectures.map((lecture) => lectureMetricForLecture({ key: 'directMasteryCount' }, lecture).count);
    const maxAiQuiz = Math.max(1, ...aiCounts);
    const maxDirectMastery = Math.max(1, ...directCounts);

    const metrics = [
      { key: 'readinessLow', award: 'Do I know this?', sort: 'asc' },
      { key: 'readinessHigh', award: 'Yes, I know this very well!', sort: 'desc' },
      { key: 'fuzzy', award: 'Did I actually learn this?', sort: 'desc' },
      { key: 'visitedOnly', award: 'I was just browsing', sort: 'desc' },
      { key: 'notVisited', award: 'I missed that day', sort: 'desc' },
      { key: 'aiQuizCount', award: 'I want more quizzes', sort: 'desc', maxCount: maxAiQuiz, requirePositive: true, empty: 'No completed AI concept checks yet.' },
      { key: 'directMasteryCount', award: 'I know myself well', sort: 'desc', maxCount: maxDirectMastery, requirePositive: true, empty: 'No direct mastery ratings submitted yet.' },
    ];

    const totalAiQuiz = aiCounts.reduce((sum, n) => sum + safeNum(n), 0);
    const totalDirectMastery = directCounts.reduce((sum, n) => sum + safeNum(n), 0);

    return `
      <section class="cmm-sidecard cmm-sidecard--chart">
        <div class="cmm-sidecard__kicker">${escapeHtml(unitNoun)} highlights</div>
        <div class="cmm-vizrows">
          ${lectures.length ? metrics.map((metric) => lectureHighlightRow(metric, lectures)).join('') : `<div class="cmm-sidecard__empty">No ${escapeHtml(unitNoun.toLowerCase())} data yet.</div>`}
        </div>
      </section>
    `;
  }

  function signedDeltaLabel(delta) {
    const n = safeNum(delta);
    return `${n >= 0 ? '+' : ''}${n}`;
  }

  function changeToneClass(delta) {
    const n = safeNum(delta);
    if (n > 0) return 'is-positive';
    if (n < 0) return 'is-negative';
    return 'is-neutral';
  }

  function changeArrowGlyph(delta) {
    const n = safeNum(delta);
    if (n > 0) return '⤴';
    if (n < 0) return '⤵';
    return '→';
  }

  function changeBeforeAfterHtml(item, changeDate) {
    const before = clampPct(item && item.before);
    const after = clampPct(item && item.after);
    const tone = changeToneClass(item && item.delta);
    const arrow = changeArrowGlyph(item && item.delta);
    const date = escapeHtml(String(changeDate || '').trim());
    return [
      '<span class="cmm-change-ba__was">Was</span> ',
      `<span class="cmm-change-ba__before">${before}%</span>`,
      ' <span class="cmm-change-ba__dot">·</span> ',
      `<span class="cmm-change-ba__date">${date}</span>`,
      ` <span class="cmm-change-ba__arrow ${tone}">${arrow}</span> `,
      `<span class="cmm-change-ba__after ${tone}">${after}%</span>`
    ].join('');
  }

  function buildRecentChangeCard(diagnosis) {
    const hist = diagnosis && diagnosis.dailyHistory ? diagnosis.dailyHistory : null;
    const current = hist && hist.current ? hist.current : null;
    const compareBase = hist && hist.compareBase ? hist.compareBase : null;
    const changeDate = shortDateLabel(current && current.date ? current.date : todayKeyLocal());
    const changes = compareBase
      ? (hist.lectureChanges || [])
        .filter((x) => x && safeNum(x.delta) !== 0)
        .slice()
        .sort((a, b) => {
          const absDiff = Math.abs(safeNum(b.delta)) - Math.abs(safeNum(a.delta));
          if (absDiff !== 0) return absDiff;
          if (safeNum(b.delta) !== safeNum(a.delta)) return safeNum(b.delta) - safeNum(a.delta);
          return safeNum(a.lectureNum) - safeNum(b.lectureNum);
        })
        .slice(0, 3)
      : [];

    return `
      <section class="cmm-sidecard cmm-sidecard--chart">
        <div class="cmm-sidecard__kicker">Recent mastery-readiness change</div>
        <div class="cmm-change-list cmm-change-list--compact">
          ${changes.length ? changes.map((item) => `
            <button type="button" class="cmm-change-row cmm-change-row--${changeToneClass(item.delta)}" data-cmm-jump-lecture="${escapeHtml(String(item.lectureNum))}">
              <span class="cmm-change-row__label">${escapeHtml(item.label)}</span>
              <span class="cmm-change-row__right">
                <span class="cmm-change-row__beforeafter ${changeToneClass(item.delta)}">${changeBeforeAfterHtml(item, changeDate)}</span>
              </span>
            </button>
          `).join('') : '<div class="cmm-sidecard__empty">No recent lecture change yet.</div>'}
        </div>
      </section>
    `;
  }

  function buildConceptStateHistogram(diagnosis) {
    const items = diagnosis && Array.isArray(diagnosis.conceptDiagnostics) ? diagnosis.conceptDiagnostics : [];
    const buckets = [
      { key: 'notVisited', label: 'Not visited', tone: 0, count: 0 },
      { key: 'visitedOnly', label: 'Visited, unrated', tone: 22, count: 0 },
      { key: 'unknown', label: 'Unknown', tone: 0, count: 0 },
      { key: 'fuzzy', label: 'Fuzzy', tone: 25, count: 0 },
      { key: 'clear', label: 'Clear', tone: 67, count: 0 },
      { key: 'mastered', label: 'Mastered', tone: 96, count: 0 },
    ];
    const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    items.forEach((item) => {
      const rec = item && item.concept ? item.concept.record : null;
      const bucket = byKey.get(levelBucketKey(rec)) || byKey.get('notVisited');
      bucket.count += 1;
    });

    const total = Math.max(1, items.length);
    const maxCount = Math.max(1, ...buckets.map((b) => b.count));
    return `
      <section class="cmm-sidecard cmm-sidecard--chart">
        <div class="cmm-sidecard__kicker">Concept status distribution</div>
        <div class="cmm-sidecard__sub">Six states, counted directly.</div>
        <div class="cmm-histrows cmm-histrows--states">
          ${buckets.map((bucket) => {
            const width = Math.round((bucket.count / maxCount) * 100);
            const share = Math.round((bucket.count / total) * 100);
            return `
              <div class="cmm-histrow cmm-histrow--state">
                <span class="cmm-histrow__label">${escapeHtml(bucket.label)}</span>
                <span class="cmm-histbar"><span class="cmm-histbar__fill" style="${escapeHtml(readinessToneStyle(bucket.tone))}width:${escapeHtml(String(width))}%"></span></span>
                <span class="cmm-histrow__count">${escapeHtml(String(bucket.count))}</span>
                <span class="cmm-histrow__share">${escapeHtml(String(share))}%</span>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function buildHeatmapRow(lecture, diagnosis) {
    const diag = (diagnosis && diagnosis.lectureDiagnostics || []).find((item) => item.lectureNum === lecture.lectureNum) || null;
    const tone = diag ? diag.tone : lectureHeatTone(lecture);
    const score = Math.max(0, Math.min(100, safeNum((diag && diag.readinessAvg) ?? lecture.readinessAvg)));
    const concepts = Array.isArray(lecture.concepts) ? lecture.concepts : [];
    return `
      <div class="cmm-row ${tone}">
        <button type="button" class="cmm-row__label" data-cmm-jump-lecture="${escapeHtml(String(lecture.lectureNum))}">
          <span class="cmm-row__title">${escapeHtml(lecture.label)}</span>
          <span class="cmm-row__meta">
            <span class="cmm-row__meta-line">${escapeHtml(`${lecture.weak} low-rated`)}</span>
            <span class="cmm-row__meta-line">${escapeHtml(`${lecture.total - lecture.rated} unrated`)}</span>
          </span>
        </button>
        <div class="cmm-row__tiles">
          ${concepts.map((concept) => {
            const entry = diagnosis.byConcept.get(concept.location);
            const rec = concept.record;
            const isActive = state.selectedConceptLoc === concept.location;
            const tileTitle = `${concept.title} · ${levelLabel(rec)} · ${readinessValueLabel(entry ? readinessPct(entry) : 0)}`;
            return `
              <button
                type="button"
                class="cmm-tile ${levelClass(rec)} ${isActive ? 'is-active' : ''}"
                data-cmm-select-concept="${escapeHtml(concept.location)}"
                title="${escapeHtml(tileTitle)}"
                aria-label="${escapeHtml(tileTitle)}"
                style="${tileStyle(entry)}"
              >
                <span class="cmm-tile__txt">${escapeHtml(levelShort(rec))}</span>
              </button>
            `;
          }).join('')}
        </div>
        <div class="cmm-row__risk">
          <span class="cmm-riskchip" style="${escapeHtml(readinessToneStyle(score))}" title="${escapeHtml(`${lecture.label} · ${readinessValueLabel(score)}`)}">${escapeHtml(String(score))}%</span><span class="cmm-row__risklabel">Mastery readiness</span>
        </div>
      </div>
    `;
  }

  function buildVisualStage(summary, diagnosis) {
    const selected = ensureSelectedConcept(summary, diagnosis);
    const unitNoun = summary && summary.unitNoun ? summary.unitNoun : 'Lecture';
    return `
      <div class="cmm-stage">
        <section class="cmm-stage__main">
          <div class="cmm-stagehead">
            <div>
              <div class="cmm-sidecard__kicker">${escapeHtml(unitNoun)} concept tiles</div>
              <div class="cmm-stagehead__sub">Each square is one concept. Click a tile to inspect it.</div>
            </div>
            <div class="cmm-legend">
              <span class="cmm-legend__label">Low mastery readiness</span>
              <span class="cmm-legend__bar"></span>
              <span class="cmm-legend__label">High mastery readiness</span>
            </div>
          </div>
          <div class="cmm-heatmap">
            ${(summary && summary.lectures ? summary.lectures : []).map((lecture) => buildHeatmapRow(lecture, diagnosis)).join('') || `<div class="cmm-error">No ${escapeHtml(unitNoun.toLowerCase())} data yet.</div>`}
          </div>
        </section>
        <aside class="cmm-stage__side">
          ${buildLectureStatusHighlightsCard(summary)}
          ${buildRecentChangeCard(diagnosis)}
          ${buildConceptStateHistogram(diagnosis)}
        </aside>
      </div>
    `;
  }

  function mapSvg() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="3.5" width="14" height="17" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></rect>
        <path d="M9.2 3.5h5.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8 13h2.1l1.35-3.15 2.25 6.3 1.55-3.15H17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8 8h3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
  }

  function arrowSvg() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    `;
  }

  function chevronSvg() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M7 10l5 5 5-5"/>
      </svg>
    `;
  }

  function levelLabel(rec) {
    if (!rec) return "Not visited";
    if (!rec.visited && !isExplicitRating(rec)) return "Not visited";
    if (!isExplicitRating(rec)) return "Visited";
    if (rec.m === 3) return "Mastered";
    if (rec.m === 2) return "Clear";
    if (rec.m === 1) return "Fuzzy";
    if (rec.m === 0) return "Unknown";
    return rec.visited ? "Visited" : "Not visited";
  }

  function levelClass(rec) {
    if (!rec) return "is-none";
    if (!rec.visited && !isExplicitRating(rec)) return "is-none";
    if (!isExplicitRating(rec)) return "is-visit";
    if (rec.m === 3) return "is-m3";
    if (rec.m === 2) return "is-m2";
    if (rec.m === 1) return "is-m1";
    if (rec.m === 0) return "is-m0";
    return "is-none";
  }

  function matchesFilters(concept) {
    const rec = concept.record;
    const wantWeak = !!state.filters.weak;
    const wantUnvisited = !!state.filters.unvisited;
    if (!wantWeak && !wantUnvisited) return true;
    const isWeak = !!(rec && isExplicitRating(rec) && (rec.m === 0 || rec.m === 1));
    const isUnvisited = !rec || !rec.visited;
    if (wantWeak && wantUnvisited) return isWeak || isUnvisited;
    if (wantWeak) return isWeak;
    if (wantUnvisited) return isUnvisited;
    return true;
  }

  function summariseData(pages) {
    const masteryAll = readAllMastery();
    const lectures = new Map();
    const now = Date.now();

    const concepts = pages.map((page) => {
      const record = normaliseRecord(masteryAll[normLoc(page.location)]);
      const tags = Array.isArray(page.tags) ? page.tags : [];
      const lectureInfo = lectureInfoFromTags(tags);
      const unitType = lectureInfo && lectureInfo.unitType ? lectureInfo.unitType : "lecture";
      const lectureNum = lectureInfo && lectureInfo.lectureNum ? lectureInfo.lectureNum : 0;
      const pct = isExplicitRating(record) ? masteryPctFromLevel(record.m) : null;
      const lastActivity = Math.max(safeNum(record.lastViewed), safeNum(record.lastReviewed), latestTsFromHistory(record.history));
      const recent = !!(lastActivity && now - lastActivity <= RECENT_WINDOW_MS);
      const concept = {
        location: normLoc(page.location),
        title: cleanTitle(page.title),
        tags,
        lectureNum,
        unitType,
        record,
        pct,
        lastActivity,
        recent,
      };
      if (!lectures.has(lectureNum)) {
        lectures.set(lectureNum, {
          lectureNum,
          unitType,
          concepts: [],
          total: 0,
          visited: 0,
          rated: 0,
          weak: 0,
          recent: 0,
          avgPct: 0,
          sumPct: 0,
        });
      }
      const lec = lectures.get(lectureNum);
      if (unitType === "week") lec.unitType = "week";
      lec.concepts.push(concept);
      lec.total += 1;
      if (record && record.visited) lec.visited += 1;
      if (isExplicitRating(record)) {
        lec.rated += 1;
        lec.sumPct += pct || 0;
        if (record.m === 0 || record.m === 1) lec.weak += 1;
      }
      if (recent) lec.recent += 1;
      return concept;
    });

    const lectureList = Array.from(lectures.values())
      .sort((a, b) => {
        const la = a.lectureNum > 0 ? a.lectureNum : Number.MAX_SAFE_INTEGER;
        const lb = b.lectureNum > 0 ? b.lectureNum : Number.MAX_SAFE_INTEGER;
        if (la !== lb) return la - lb;
        return a.concepts.length - b.concepts.length;
      })
      .map((lecture) => {
        lecture.avgPct = lecture.rated ? Math.round(lecture.sumPct / lecture.rated) : 0;
        lecture.label = lecture.lectureNum > 0 ? `${unitNounFromType(lecture.unitType)} ${lecture.lectureNum}` : 'Other';
        lecture.concepts.sort((a, b) => {
          const aw = a.record && isExplicitRating(a.record) && (a.record.m === 0 || a.record.m === 1) ? 1 : 0;
          const bw = b.record && isExplicitRating(b.record) && (b.record.m === 0 || b.record.m === 1) ? 1 : 0;
          if (bw !== aw) return bw - aw;
          const av = a.record && a.record.visited ? 1 : 0;
          const bv = b.record && b.record.visited ? 1 : 0;
          if (av !== bv) return av - bv;
          return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' });
        });
        return lecture;
      });

    const total = concepts.length;
    const visited = concepts.filter((x) => x.record && x.record.visited).length;
    const rated = concepts.filter((x) => x.record && isExplicitRating(x.record)).length;
    const weak = concepts.filter((x) => x.record && isExplicitRating(x.record) && (x.record.m === 0 || x.record.m === 1)).length;
    const recent = concepts.filter((x) => x.recent).length;
    const avgPct = rated
      ? Math.round(concepts.reduce((acc, x) => acc + (x.pct || 0), 0) / rated)
      : 0;
    const latestConcept = concepts
      .filter((x) => x.lastActivity > 0)
      .sort((a, b) => b.lastActivity - a.lastActivity)[0] || null;
    const unitNoun = lectureList.some((lecture) => lecture && lecture.unitType === 'week') ? 'Week' : 'Lecture';

    return {
      concepts,
      lectures: lectureList,
      unitNoun,
      totals: { total, visited, rated, weak, recent, avgPct },
      latestConcept,
    };
  }

  async function loadCourseMapData(anchor) {
    const courseToken = courseTokenForPage(anchor);
    const scope = currentCourseScope();
    const key = `${courseToken}|${scope.yearSeg}|${scope.courseSeg}`;
    if (state.data && state.data.key === key) return state.data;
    if (state.loadPromise && state.loadPromise.key === key) return state.loadPromise;

    const promise = (async () => {
      const root = getSiteRootUrl();
      const url = new URL('search/search_index.json', root).toString();
      const res = await fetch(url, { cache: 'no-cache' }).catch(() => null);
      const j = res && res.ok ? await res.json().catch(() => null) : null;
      const pages = aggregateDocsToPages(j && Array.isArray(j.docs) ? j.docs : [])
        .filter((page) => pageMatchesCourse(page, courseToken, scope));
      const data = {
        key,
        courseToken,
        scope,
        summary: summariseData(pages),
      };
      state.data = data;
      return data;
    })();
    promise.key = key;
    state.loadPromise = promise;
    try {
      return await promise;
    } finally {
      if (state.loadPromise === promise) state.loadPromise = null;
    }
  }

  function cmmIsTouchLikeViewport() {
    try {
      const mm = window.matchMedia;
      return !!(
        (mm && (mm('(max-width: 900px)').matches || mm('(pointer: coarse)').matches || mm('(hover: none)').matches)) ||
        (navigator && navigator.maxTouchPoints > 0)
      );
    } catch (_) {
      return false;
    }
  }

  function cmmPx(n) {
    const x = Number(n);
    return Number.isFinite(x) ? Math.max(0, Math.round(x)) + 'px' : '0px';
  }

  function cmmPageScrollXNow() {
    try {
      return Math.max(0, Number(window.scrollX) || Number(window.pageXOffset) || Number(document.documentElement && document.documentElement.scrollLeft) || Number(document.body && document.body.scrollLeft) || 0);
    } catch (_) { return 0; }
  }

  function cmmPageScrollYNow() {
    try {
      return Math.max(0, Number(window.scrollY) || Number(window.pageYOffset) || Number(document.documentElement && document.documentElement.scrollTop) || Number(document.body && document.body.scrollTop) || 0);
    } catch (_) { return 0; }
  }

  function cmmClamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function cmmIsIOSWebKitMobile() {
    try {
      const ua = String(navigator.userAgent || '');
      const platform = String(navigator.platform || '');
      return /iP(?:hone|ad|od)/i.test(ua) || (/Mac/i.test(platform) && Number(navigator.maxTouchPoints || 0) > 1);
    } catch (_) { return false; }
  }

  function cmmReadSafeAreaBottomInsetPx() {
    try {
      let probe = document.getElementById('cmm-safe-area-probe');
      if (!probe) {
        probe = document.createElement('div');
        probe.id = 'cmm-safe-area-probe';
        probe.style.cssText = 'position:fixed;left:0;bottom:0;visibility:hidden;pointer-events:none;height:0;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom,0px);';
        (document.body || document.documentElement).appendChild(probe);
      }
      const cs = window.getComputedStyle ? window.getComputedStyle(probe) : null;
      return Math.max(0, Math.ceil(parseFloat(cs && cs.paddingBottom) || 0));
    } catch (_) { return 0; }
  }

  function cmmIOSCompleteToolbarOcclusionPx() {
    if (!cmmIsTouchLikeViewport() || !cmmIsIOSWebKitMobile()) return 0;
    try {
      const vv = window.visualViewport;
      const layoutH = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
      const vvBottom = vv ? ((Number(vv.offsetTop) || 0) + (Number(vv.height) || 0)) : layoutH;
      const visualGap = vv ? Math.max(0, Math.round(layoutH - vvBottom)) : 0;
      let screenH = 0;
      try { screenH = Math.max(Number(window.screen && window.screen.height) || 0, Number(window.screen && window.screen.width) || 0); } catch (_) { screenH = 0; }
      const safe = Math.max(0, cmmReadSafeAreaBottomInsetPx());
      const screenGap = screenH > 0 ? Math.max(0, Math.round(screenH - layoutH - safe)) : 0;
      const raw = Math.max(visualGap, screenGap);
      if (raw < 56) return 0;
      return cmmClamp(raw, 64, 260);
    } catch (_) { return 0; }
  }

  function cmmUpdateViewportMetrics() {
    try {
      const root = document.documentElement;
      if (!root) return;
      const modal = document.getElementById('mk-course-mastery-map-modal');
      const vv = window.visualViewport;
      const layoutW = Math.max(1, Number(window.innerWidth) || Number(document.documentElement && document.documentElement.clientWidth) || 1);
      const layoutH = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
      const vvLeft = vv ? (Number(vv.offsetLeft) || 0) : 0;
      const vvTop = vv ? (Number(vv.offsetTop) || 0) : 0;
      const vvW = vv && Number(vv.width) ? Number(vv.width) : layoutW;
      const vvH = vv && Number(vv.height) ? Number(vv.height) : layoutH;
      const vvBottom = vvTop + vvH;
      if (vvH > 0) root.style.setProperty('--cmm-vh', cmmPx(vvH));
      if (modal && vvH > 0) modal.style.setProperty('--cmm-vh', cmmPx(vvH));

      if (!cmmIsTouchLikeViewport()) {
        root.style.setProperty('--cmm-mobile-top-pad', '0px');
        root.style.setProperty('--cmm-mobile-bottom-pad', '0px');
        ['--cmm-doc-left','--cmm-doc-top','--cmm-doc-width','--cmm-doc-height','--cmm-visible-height','--cmm-ios-hidden-tail'].forEach((name) => {
          try { root.style.removeProperty(name); } catch (_) {}
          try { if (modal) modal.style.removeProperty(name); } catch (_) {}
        });
        const dialog = modal ? q('.cmm-modal__dialog', modal) : null;
        if (dialog) dialog.classList.remove('cmm-ios-bottom-continued');
        return;
      }

      // Same document-layer surface idea as the finalized Mastery manager:
      // first keep the browser safe area transparent/blurred, then extend the
      // Course diagnostics panel down into the area sampled by iOS Safari.
      const safeStrip = Math.max(
        cmmReadSafeAreaBottomInsetPx(),
        vv ? Math.max(0, Math.round(layoutH - vvBottom)) : 0,
        cmmIOSCompleteToolbarOcclusionPx()
      );
      const visibleBottom = vv ? Math.max(0, vvBottom) : layoutH;
      const layoutBottom = Math.max(layoutH, visibleBottom) + Math.max(0, safeStrip);
      const docLeft = cmmPageScrollXNow() + vvLeft;
      const docTop = cmmPageScrollYNow() + vvTop;
      const docHeight = Math.max(80, Math.ceil(layoutBottom - vvTop));
      const visibleHeight = Math.max(80, Math.ceil(vvH || layoutH));
      const hiddenTail = Math.max(0, Math.ceil(docHeight - visibleHeight));

      const vars = {
        '--cmm-doc-left': cmmPx(docLeft),
        '--cmm-doc-top': cmmPx(docTop),
        '--cmm-doc-width': cmmPx(vvW || layoutW),
        '--cmm-doc-height': cmmPx(docHeight),
        '--cmm-visible-height': cmmPx(visibleHeight),
        '--cmm-ios-hidden-tail': cmmPx(hiddenTail),
        '--cmm-mobile-top-pad': '0px',
        '--cmm-mobile-bottom-pad': '0px',
      };
      Object.keys(vars).forEach((name) => {
        try { root.style.setProperty(name, vars[name]); } catch (_) {}
        try { if (modal) modal.style.setProperty(name, vars[name]); } catch (_) {}
      });

      const dialog = modal ? q('.cmm-modal__dialog', modal) : null;
      if (dialog) dialog.classList.toggle('cmm-ios-bottom-continued', hiddenTail > 12 || safeStrip > 12);
    } catch (_) {}
  }

  function cmmBindViewportMetricsOnce() {
    if (window.__cmmViewportMetricsBoundV22) return;
    window.__cmmViewportMetricsBoundV22 = true;
    const update = () => cmmUpdateViewportMetrics();
    try { window.addEventListener('resize', update, { passive: true }); } catch (_) { window.addEventListener('resize', update); }
    try { window.addEventListener('orientationchange', () => window.setTimeout(update, 80), { passive: true }); } catch (_) { window.addEventListener('orientationchange', () => window.setTimeout(update, 80)); }
    try {
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', update, { passive: true });
        window.visualViewport.addEventListener('scroll', update, { passive: true });
      }
    } catch (_) {}
  }

  function ensureStyles() {
    cmmUpdateViewportMetrics();
    cmmBindViewportMetricsOnce();
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
      .cmm-h1-row{
        display:flex;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
      }
      .cmm-h1-row .cmm-h1-text{
        min-width:0;
        flex:1 1 auto;
      }
      .cmm-h1-entry-wrap{
        flex:0 0 auto;
        display:flex;
        align-items:center;
      }
      .cmm-h1-entry{
        --cmm-entry-height: 58px;
        --cmm-entry-text-color: var(--md-default-fg-color);
        --cmm-entry-icon-size: 18px;
        height: var(--cmm-entry-height, 58px);
        min-height: var(--cmm-entry-height, 58px);
        box-sizing:border-box;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:var(--cmm-entry-gap, .56rem);
        padding:var(--cmm-entry-padding, 0 1.12rem 0 1.04rem);
        border-radius:var(--cmm-entry-radius, 16px);
        border:1px solid rgba(82,102,255,.34);
        background: linear-gradient(135deg, rgba(82,102,255,.14), rgba(128,92,255,.08));
        color:var(--cmm-entry-text-color, var(--md-default-fg-color)) !important;
        font-family:var(--cmm-entry-font-family, inherit);
        font-size:var(--cmm-entry-font-size, inherit);
        font-weight:var(--cmm-entry-font-weight, inherit);
        font-style:var(--cmm-entry-font-style, inherit);
        line-height:var(--cmm-entry-line-height, normal);
        letter-spacing:var(--cmm-entry-letter-spacing, normal);
        text-transform:var(--cmm-entry-text-transform, none);
        white-space:nowrap;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        cursor:pointer;
        transition: transform .14s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease, color .18s ease;
      }
      .cmm-h1-entry__icon{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        flex:0 0 auto;
        width:var(--cmm-entry-icon-size, 18px);
        height:var(--cmm-entry-icon-size, 18px);
        padding:0;
        margin:0;
        color:inherit !important;
        background:none !important;
        border:0 !important;
        box-shadow:none !important;
      }
      .cmm-h1-entry__icon svg{
        width:var(--cmm-entry-icon-size, 18px);
        height:var(--cmm-entry-icon-size, 18px);
        display:block;
        color:inherit !important;
        background:none !important;
        border:0 !important;
        box-shadow:none !important;
        fill:none !important;
        stroke:none !important;
        filter:none !important;
      }
      .cmm-h1-entry__icon svg *,
      .cmm-h1-entry__icon svg path,
      .cmm-h1-entry__icon svg line,
      .cmm-h1-entry__icon svg polyline{
        color:inherit !important;
        stroke: currentColor !important;
        fill: none !important;
        background:none !important;
        filter:none !important;
        opacity:1 !important;
      }
      .cmm-h1-entry__icon svg [stroke]{
        stroke: currentColor !important;
      }
      .cmm-h1-entry__icon svg [fill="none"]{
        fill: none !important;
      }
      .cmm-h1-entry__icon svg [fill]:not([fill="none"]){
        fill: none !important;
      }
      .cmm-h1-entry__label{
        display:inline-block;
      }
      .cmm-h1-entry:hover{
        transform: translateY(-1px);
        border-color: rgba(82,102,255,.50);
        background: linear-gradient(135deg, rgba(82,102,255,.18), rgba(128,92,255,.12));
        box-shadow: 0 14px 34px rgba(82,102,255,.14), var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
      }
      .cmm-h1-entry svg,
      .cmm-cta svg,
      .cmm-filter svg,
      .cmm-lecture__chev svg{
        width:var(--cmm-entry-icon-size, 18px);
        height:var(--cmm-entry-icon-size, 18px);
        display:block;
        flex:0 0 auto;
        color:currentColor;
      }
      html.cmm-modal-open,
      body.cmm-modal-open{
        overflow:hidden;
      }
      .cmm-modal{
        position:fixed;
        inset:0;
        z-index:2147483000;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
      }
      .cmm-modal[hidden]{ display:none !important; }
      .cmm-modal__backdrop{
        position:absolute;
        inset:0;
        background: rgba(12, 16, 24, .42);
        backdrop-filter: blur(10px) saturate(1.04);
        -webkit-backdrop-filter: blur(10px) saturate(1.04);
        pointer-events:auto;
        cursor:default;
      }
      .cmm-modal__dialog{
        position:relative;
        width:min(1180px, calc(100vw - 28px));
        max-height:calc(100vh - 28px);
        overflow:auto;
        border-radius:22px;
        box-shadow: 0 28px 72px rgba(0,0,0,.28);
        z-index:1;
      }
      .cmm-modal__close{
        position:absolute;
        top:14px;
        right:14px;
        width:38px;
        height:38px;
        border:1px solid rgba(0,0,0,.10);
        border-radius:999px;
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        color:inherit;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        font-size:1.25rem;
        line-height:1;
        cursor:pointer;
        z-index:3;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        outline:none !important;
        -webkit-tap-highlight-color:transparent;
        appearance:none;
        -webkit-appearance:none;
        user-select:none;
      }
      .cmm-modal__close:hover{
        transform: translateY(-1px);
      }
      .cmm-modal__close:focus,
      .cmm-modal__close:focus-visible,
      .cmm-modal__close:active{
        outline:none !important;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10)) !important;
      }
      #${PANEL_ID}{
        --cmm-panel-bg: #f2f3f5;
        margin: 0;
        border-radius: 22px;
        border: 1px solid rgba(0,0,0,.10);
        background: var(--cmm-panel-bg) !important;
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
        overflow: hidden;
      }
      #${PANEL_ID}[hidden]{ display:none !important; }
      #${PANEL_ID} .cmm-head{
        padding: 1rem 3.8rem .85rem 1rem;
        border-bottom: 1px solid rgba(0,0,0,.08);
      }
      #${PANEL_ID} .cmm-head__row{
        display:grid;
        grid-template-columns: 92px minmax(0, 1fr);
        gap: 1rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-headreadiness{
        min-width:0;
        border:1px solid var(--cmm-readiness-border, rgba(0,0,0,.10));
        background:var(--cmm-readiness-bg, color-mix(in srgb,var(--md-default-bg-color) 90%,transparent));
        color:var(--cmm-readiness-fg, var(--md-default-fg-color));
        border-radius:18px;
        padding:.58rem .7rem .62rem;
        box-shadow:0 10px 24px rgba(0,0,0,.04);
      }
      #${PANEL_ID} .cmm-headreadiness--orb{
        width:86px;
        height:86px;
        border-radius:999px;
        padding:.42rem;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        background:
          radial-gradient(circle at 34% 30%, rgba(255,255,255,.36), transparent 46%),
          linear-gradient(145deg,
            color-mix(in srgb, var(--cmm-readiness-bg, var(--md-default-bg-color)) 94%, white 6%),
            color-mix(in srgb, var(--cmm-readiness-bg, var(--md-default-bg-color)) 86%, var(--cmm-readiness-fg, var(--md-default-fg-color)) 14%)
          );
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.24), 0 12px 28px rgba(0,0,0,.08);
      }
      #${PANEL_ID} .cmm-headreadiness span{
        display:block;
        font-size:.50rem;
        font-weight:800;
        line-height:.98;
        opacity:.82;
      }
      #${PANEL_ID} .cmm-headreadiness strong{
        display:block;
        margin:0 0 .12rem;
        font-size:1.18rem;
        line-height:.96;
        font-weight:900;
        letter-spacing:-.02em;
      }
      #${PANEL_ID} .cmm-headcopy{
        min-width:0;
      }
      #${PANEL_ID} .cmm-kicker{
        display:flex;
        align-items:center;
        gap:10px;
        font-size:.88rem;
        font-weight:700;
        letter-spacing:0;
        opacity:.82;
        margin-bottom:.35rem;
      }
      #${PANEL_ID} .cmm-kicker svg{ width:18px; height:18px; display:block; }
      #${PANEL_ID} .cmm-title{
        font-size:1.15rem;
        font-weight:800;
        line-height:1.2;
      }
      #${PANEL_ID} .cmm-sub{
        margin-top:.35rem;
        opacity:.82;
        font-size:.95rem;
      }
      #${PANEL_ID} .cmm-body{
        padding: 1rem;
        display:grid;
        gap: 1rem;
      }
      #${PANEL_ID} .cmm-toprow{
        display:grid;
        grid-template-columns: minmax(260px, .38fr) minmax(560px, 1.62fr);
        gap:1rem;
        align-items:stretch;
      }
      #${PANEL_ID} .cmm-metrics{
        display:grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap:.75rem;
        align-items:stretch;
      }
      #${PANEL_ID} .cmm-metric{
        border-radius:14px;
        border:1px solid rgba(0,0,0,.08);
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        padding:.9rem .88rem;
        min-width:0;
        min-height:7.15rem;
        display:flex;
        flex-direction:column;
        justify-content:center;
      }
      #${PANEL_ID} .cmm-metric__label{
        font-size:.72rem;
        opacity:.72;
        letter-spacing:0;
        line-height:1.24;
        font-weight:700;
      }
      #${PANEL_ID} .cmm-metric__value{
        margin-top:.34rem;
        font-weight:800;
        font-size:.98rem;
        line-height:1.12;
      }
      #${PANEL_ID} .cmm-metric__helper{
        margin-top:.24rem;
        font-size:.74rem;
        opacity:.72;
        line-height:1.28;
      }
      #${PANEL_ID} .cmm-actions{
        display:flex;
        gap:.65rem;
        flex-wrap:wrap;
        align-items:center;
      }
      #${PANEL_ID} .cmm-cta,
      #${PANEL_ID} .cmm-filter{
        appearance:none;
        border:1px solid rgba(0,0,0,.12);
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        color:inherit;
        border-radius:999px;
        padding:.6rem 1rem;
        display:inline-flex;
        align-items:center;
        gap:.52rem;
        cursor:pointer;
        font-weight:700;
        line-height:1;
      }
      #${PANEL_ID} .cmm-filter{
        font-size:.84rem;
        font-weight:500;
        padding:.44rem .74rem;
      }
      #${PANEL_ID} .cmm-cta:hover,
      #${PANEL_ID} .cmm-filter:hover{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%);
      }
      #${PANEL_ID} .cmm-cta[disabled]{
        opacity:.45;
        cursor:default;
      }
      #${PANEL_ID} .cmm-filters{
        display:flex;
        gap:.55rem;
        flex-wrap:wrap;
      }
      #${PANEL_ID} .cmm-filter.is-on{
        border-color: color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 58%, transparent);
        background: color-mix(in srgb, var(--md-default-bg-color) 76%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 24%);
      }
      #${PANEL_ID} .cmm-lectures{
        display:grid;
        gap:.8rem;
      }
      #${PANEL_ID} .cmm-lecture{
        border-radius:16px;
        border:1px solid rgba(0,0,0,.10);
        background: color-mix(in srgb, var(--md-default-bg-color) 92%, transparent);
        overflow:hidden;
      }
      #${PANEL_ID} .cmm-lecture.is-hot{
        background: linear-gradient(135deg, rgba(226, 104, 84, .16), rgba(226, 104, 84, .06));
      }
      #${PANEL_ID} .cmm-lecture.is-mid{
        background: linear-gradient(135deg, rgba(63,81,181,.14), rgba(0,150,136,.10));
      }
      #${PANEL_ID} .cmm-lecture.is-cool{
        background: linear-gradient(135deg, rgba(0,150,136,.16), rgba(0,150,136,.05));
      }
      #${PANEL_ID} .cmm-lecture.is-cold{
        background: linear-gradient(135deg, rgba(120,140,255,.10), rgba(120,140,255,.03));
      }
      #${PANEL_ID} .cmm-lecture__btn{
        width:100%;
        border:0;
        background:transparent;
        color:inherit;
        display:grid;
        grid-template-columns: minmax(0, 1fr) auto auto;
        gap:.62rem;
        padding:.82rem .92rem;
        text-align:left;
        align-items:center;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-lecture__left{ min-width:0; }
      #${PANEL_ID} .cmm-lecture__title{
        font-weight:800;
        line-height:1.2;
        font-size:1.08rem;
      }
      #${PANEL_ID} .cmm-lecture__meta{
        margin-top:.18rem;
        opacity:.78;
        font-size:.9rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-lecture__stats{
        display:flex;
        gap:.32rem;
        flex-wrap:wrap;
        justify-content:flex-end;
      }
      #${PANEL_ID} .cmm-chip{
        border-radius:999px;
        border:1px solid rgba(0,0,0,.10);
        background: rgba(255,255,255,.46);
        padding:.32rem .62rem;
        font-size:.84rem;
        font-weight:700;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-chip--readiness{
        border-color: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .52);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .70);
        color: hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
      }
      #${PANEL_ID} .cmm-lecture__chev{
        width:30px;
        height:30px;
        border-radius:999px;
        border:1px solid rgba(0,0,0,.08);
        display:inline-flex;
        align-items:center;
        justify-content:center;
        background: rgba(255,255,255,.38);
        transition: transform .16s ease;
      }
      #${PANEL_ID} .cmm-lecture.is-open .cmm-lecture__chev{
        transform: rotate(180deg);
      }
      #${PANEL_ID} .cmm-lecture__body{
        padding: 0 .9rem .9rem;
        display:grid;
        gap:.42rem;
      }
      #${PANEL_ID} .cmm-lecture__body[hidden]{
        display:none !important;
      }
      #${PANEL_ID} .cmm-lecture__empty{
        padding:.2rem 0 .1rem;
        opacity:.74;
        font-size:.88rem;
      }
      #${PANEL_ID} .cmm-concept{
        display:grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap:.58rem;
        align-items:center;
        padding:.62rem .72rem;
        border-radius:13px;
        border:1px solid rgba(0,0,0,.08);
        background: color-mix(in srgb, var(--md-default-bg-color) 92%, transparent);
      }
      #${PANEL_ID} .cmm-dot{
        width:9px;
        height:9px;
        border-radius:999px;
        background: rgba(0,0,0,.18);
      }
      #${PANEL_ID} .cmm-dot.is-m3{ background:#c79400; }
      #${PANEL_ID} .cmm-dot.is-m2{ background:#7d8da7; }
      #${PANEL_ID} .cmm-dot.is-m1{ background:#cc7e38; }
      #${PANEL_ID} .cmm-dot.is-m0{ background:#c25757; }
      #${PANEL_ID} .cmm-dot.is-visit{ background:#4d87b2; }
      #${PANEL_ID} .cmm-dot.is-none{ background: rgba(0,0,0,.16); }
      #${PANEL_ID} .cmm-concept__title{
        min-width:0;
        font-weight:700;
        font-size:1rem;
        line-height:1.18;
        text-decoration:none;
      }
      #${PANEL_ID} .cmm-concept__title:hover{ text-decoration:underline; }
      #${PANEL_ID} .cmm-concept__meta{
        font-size:.76rem;
        opacity:.66;
        margin-top:.1rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-state{
        font-size:.76rem;
        font-weight:700;
        padding:.24rem .5rem;
        border-radius:999px;
        border:1px solid rgba(0,0,0,.09);
        background: rgba(255,255,255,.56);
        white-space:nowrap;
        align-self:center;
      }
      #${PANEL_ID} .cmm-state.is-m3{ color:#8a6700; }
      #${PANEL_ID} .cmm-state.is-m2{ color:#5d6e87; }
      #${PANEL_ID} .cmm-state.is-m1{ color:#9c5d21; }
      #${PANEL_ID} .cmm-state.is-m0{ color:#983d3d; }
      #${PANEL_ID} .cmm-state.is-visit{ color:#2d6f9d; }
      #${PANEL_ID} .cmm-state.is-none{ color:inherit; opacity:.75; }
      #${PANEL_ID} .cmm-loading,
      #${PANEL_ID} .cmm-error{
        padding: .95rem 1rem 1.05rem;
        opacity:.82;
      }

      #${PANEL_ID} .cmm-stage{
        display:grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(300px, .95fr);
        gap: 1rem;
        align-items:start;
      }
      #${PANEL_ID} .cmm-stage__main,
      #${PANEL_ID} .cmm-sidecard{
        border-radius:18px;
        border:1px solid rgba(0,0,0,.08);
        background: color-mix(in srgb, var(--md-default-bg-color) 90%, transparent);
        box-shadow: var(--shadow-soft, 0 10px 26px rgba(0,0,0,.10));
      }
      #${PANEL_ID} .cmm-stage__main{
        padding:.9rem;
      }
      #${PANEL_ID} .cmm-stagehead{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:1rem;
        margin-bottom:.8rem;
        flex-wrap:wrap;
      }
      #${PANEL_ID} .cmm-stagehead__title{
        font-size:1.02rem;
        font-weight:800;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-stagehead__sub{
        margin-top:.18rem;
        opacity:.76;
        font-size:.86rem;
        line-height:1.24;
      }
      #${PANEL_ID} .cmm-legend{
        display:grid;
        grid-template-columns:max-content minmax(130px,1fr) max-content;
        align-items:center;
        gap:.58rem;
        width:100%;
        min-width:0;
        font-size:.76rem;
        opacity:.82;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-legend__bar{
        width:100%;
        min-width:0;
        height:10px;
        display:inline-block;
        position:relative;
        overflow:hidden;
        box-sizing:border-box;
        padding:0;
        border:0;
        border-radius:999px;
        background:transparent;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.08);
        isolation:isolate;
      }
      #${PANEL_ID} .cmm-legend__bar::before{
        content:"";
        position:absolute;
        inset:0;
        border-radius:inherit;
        background: linear-gradient(90deg, hsl(7 78% 63%) 0%, hsl(42 84% 69%) 50%, hsl(150 60% 78%) 100%);
        background-repeat:no-repeat;
        background-size:100% 100%;
        z-index:-1;
      }
      #${PANEL_ID} .cmm-heatmap{
        display:grid;
        gap:.62rem;
      }
      #${PANEL_ID} .cmm-row{
        display:grid;
        grid-template-columns: minmax(96px, 116px) minmax(0, 1fr) minmax(92px, auto);
        gap:.42rem;
        align-items:center;
        padding:.7rem .72rem;
        border-radius:16px;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.42);
      }
      #${PANEL_ID} .cmm-row.is-hot{ background: linear-gradient(135deg, rgba(226,104,84,.14), rgba(226,104,84,.04)); }
      #${PANEL_ID} .cmm-row.is-mid{ background: linear-gradient(135deg, rgba(255,183,77,.14), rgba(255,183,77,.04)); }
      #${PANEL_ID} .cmm-row.is-cold{ background: linear-gradient(135deg, rgba(120,140,255,.10), rgba(120,140,255,.03)); }
      #${PANEL_ID} .cmm-row.is-cool{ background: linear-gradient(135deg, rgba(0,150,136,.12), rgba(0,150,136,.04)); }
      #${PANEL_ID} .cmm-row__label{
        border:0;
        background:transparent;
        color:inherit;
        text-align:left;
        padding:0;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-row__title{
        display:block;
        font-weight:800;
        font-size:.92rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-row__meta{
        display:grid;
        gap:.04rem;
        margin-top:.18rem;
        opacity:.72;
        font-size:.74rem;
        line-height:1.08;
      }
      #${PANEL_ID} .cmm-row__meta-line{
        display:block;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-row__tiles{
        display:flex;
        flex-wrap:wrap;
        gap:.36rem;
        align-items:center;
        justify-content:flex-start;
        min-width:0;
      }
      #${PANEL_ID} .cmm-tile{
        width:22px;
        height:22px;
        border-radius:8px;
        border:1px solid hsla(var(--cmm-h, 140), 70%, var(--cmm-bl, 56%), .52);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 64%), var(--cmm-l, 92%), .98);
        color: hsla(var(--cmm-h, 140), 72%, 24%, .98);
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:0;
        cursor:pointer;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 4px 10px rgba(0,0,0,.05);
        transition: transform .14s ease, box-shadow .18s ease, border-color .18s ease;
      }
      #${PANEL_ID} .cmm-tile:hover,
      #${PANEL_ID} .cmm-tile.is-active{
        transform: translateY(-1px) scale(1.06);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.36), 0 8px 18px rgba(0,0,0,.10);
      }
      #${PANEL_ID} .cmm-tile.is-active{
        border-color: var(--md-accent-fg-color, var(--md-primary-fg-color));
        outline: 2px solid color-mix(in srgb, var(--md-accent-fg-color, var(--md-primary-fg-color)) 24%, transparent);
        outline-offset: 1px;
      }
      #${PANEL_ID} .cmm-tile__txt{
        font-size:.62rem;
        font-weight:800;
        line-height:1;
        opacity:.9;
      }
      #${PANEL_ID} .cmm-row__risk{
        display:grid;
        justify-items:end;
        gap:.16rem;
        min-width:92px;
      }
      #${PANEL_ID} .cmm-riskchip{
        min-width:40px;
        text-align:center;
        border-radius:999px;
        border:1px solid hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .58);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .78);
        color: hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
        padding:.24rem .48rem;
        font-size:.78rem;
        font-weight:800;
      }
      #${PANEL_ID} .cmm-row__risklabel{
        font-size:.66rem;
        opacity:.72;
        text-transform:none;
        letter-spacing:.005em;
      }
      #${PANEL_ID} .cmm-stage__side{
        display:grid;
        gap:.8rem;
      }
      #${PANEL_ID} .cmm-sidecard{
        padding:.76rem .82rem;
      }
      #${PANEL_ID} .cmm-sidecard__kicker{
        font-size:.72rem;
        font-weight:800;
        opacity:.72;
        text-transform:none;
        letter-spacing:.005em;
      }
      #${PANEL_ID} .cmm-sidecard__title{
        margin-top:.22rem;
        font-size:.98rem;
        font-weight:800;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-focuscard__titlelink{
        display:block;
        color:inherit;
        text-decoration:none;
        text-underline-offset:.16em;
        max-width:100%;
      }
      #${PANEL_ID} .cmm-focuscard__titlelink:hover{
        color:var(--md-primary-fg-color);
        text-decoration:underline;
      }
      #${PANEL_ID} .cmm-focuscard__lecture{
        margin-top:.32rem;
        color:var(--md-default-fg-color--light);
        font-size:.82rem;
        font-weight:750;
        line-height:1.15;
      }
      #${PANEL_ID} .cmm-sidecard__sub{
        margin-top:.2rem;
        opacity:.76;
        font-size:.82rem;
        line-height:1.24;
      }
      #${PANEL_ID} .cmm-sidecard__list,
      #${PANEL_ID} .cmm-clusters,
      #${PANEL_ID} .cmm-actionsgrid{
        display:grid;
        gap:.5rem;
        margin-top:.65rem;
      }
      #${PANEL_ID} .cmm-sidecard__empty{
        opacity:.7;
        font-size:.82rem;
        line-height:1.22;
      }
      #${PANEL_ID} .cmm-focuscard{
        min-width:0;
        min-height:0;
      }
      #${PANEL_ID} .cmm-focuscard__body{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:.9rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-focuscard__main{
        min-width:0;
      }
      #${PANEL_ID} .cmm-focuscard__meta{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.65rem;
        flex-wrap:wrap;
      }
      #${PANEL_ID} .cmm-focuscard__open{
        flex:0 0 auto;
        padding:.46rem .72rem;
        font-size:.78rem;
      }
      #${PANEL_ID} .cmm-focusfacts{
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(92px,1fr));
        gap:.36rem;
        align-items:center;
        margin-top:.52rem;
        width:min(100%,620px);
        max-width:100%;
      }
      #${PANEL_ID} .cmm-focusfact{
        min-width:0;
        border:1px solid color-mix(in srgb,var(--md-default-fg-color) 10%,transparent);
        background:color-mix(in srgb,var(--md-default-bg-color) 94%,var(--md-default-fg-color) 6%);
        border-radius:12px;
        padding:.30rem .38rem;
      }
      #${PANEL_ID} .cmm-focusfact span{
        display:block;
        color:var(--md-default-fg-color--light);
        font-size:.52rem;
        font-weight:650;
        line-height:1.05;
        letter-spacing:0;
        text-transform:none;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      #${PANEL_ID} .cmm-focusfact strong{
        display:block;
        margin-top:.08rem;
        font-size:.68rem;
        font-weight:700;
        line-height:1.12;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      #${PANEL_ID} .cmm-focuscard--empty{
        justify-content:center;
      }
      #${PANEL_ID} .cmm-focushead{
        margin-top:.42rem;
        display:grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap:.6rem;
        align-items:start;
      }
      #${PANEL_ID} .cmm-scoreorb{
        width:82px;
        height:82px;
        min-width:82px;
        border-radius:999px;
        display:inline-flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:.16rem;
        box-sizing:border-box;
        padding:.42rem .36rem;
        overflow:hidden;
        border:1px solid hsla(var(--cmm-h, 140), 70%, var(--cmm-bl, 56%), .52);
        background:
          radial-gradient(circle at 30% 30%, rgba(255,255,255,.34), transparent 46%),
          linear-gradient(135deg,
            hsla(var(--cmm-h, 140), var(--cmm-s, 64%), calc(var(--cmm-l, 92%) + 2%), .98),
            hsla(var(--cmm-h, 140), calc(var(--cmm-s, 64%) + 8%), calc(var(--cmm-l, 92%) - 8%), .94)
          );
        color: hsla(var(--cmm-h, 140), 72%, 24%, .98);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.24), 0 8px 18px rgba(0,0,0,.08);
      }
      #${PANEL_ID} .cmm-scoreorb span{
        display:block;
        font-size:1.18rem;
        font-weight:900;
        line-height:.95;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-scoreorb small{
        display:block;
        max-width:100%;
        font-size:.50rem;
        font-weight:850;
        line-height:.95;
        opacity:.82;
        text-transform:none;
        letter-spacing:0;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-focusorbs{
        display:inline-flex;
        align-items:center;
        justify-content:flex-end;
        gap:.48rem;
        flex-wrap:nowrap;
        min-width:0;
      }
      #${PANEL_ID} .cmm-focusorbs-stack{
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        justify-content:center;
        gap:.34rem;
        min-width:0;
      }
      #${PANEL_ID} .cmm-public-score-avgs{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:.36rem;
        width:100%;
        max-width:190px;
      }
      #${PANEL_ID} .cmm-public-score-avg{
        min-width:0;
        text-align:center;
        color:var(--md-default-fg-color--light);
        font-size:.48rem;
        line-height:1.05;
      }
      #${PANEL_ID} .cmm-public-score-avg span,
      #${PANEL_ID} .cmm-public-score-avg strong{
        display:block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      #${PANEL_ID} .cmm-public-score-avg strong{
        margin-top:.06rem;
        color:var(--md-default-fg-color);
        font-size:.56rem;
        font-weight:750;
      }
      #${PANEL_ID} .cmm-scoreorb--prereq.is-loading,
      #${PANEL_ID} .cmm-scoreorb--prereq.is-unavailable{
        --cmm-h: 220;
        --cmm-s: 12%;
        --cmm-l: 92%;
        --cmm-bl: 58%;
        color: var(--md-default-fg-color--light);
      }
      #${PANEL_ID} .cmm-focuschips,
      #${PANEL_ID} .cmm-reasons{
        display:flex;
        flex-wrap:wrap;
        gap:.42rem;
        margin-top:.62rem;
      }
      #${PANEL_ID} .cmm-reason{
        border-radius:999px;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(0,0,0,.03);
        padding:.28rem .56rem;
        font-size:.74rem;
        line-height:1.1;
      }
      #${PANEL_ID} .cmm-cta--link{
        display:inline-flex;
        width:fit-content;
        margin-top:.72rem;
        text-decoration:none;
      }
      #${PANEL_ID} .cmm-minirow,
      #${PANEL_ID} .cmm-cluster,
      #${PANEL_ID} .cmm-actioncard{
        appearance:none;
        width:100%;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.52);
        color:inherit;
        border-radius:14px;
        padding:.6rem .66rem;
        text-align:left;
        cursor:pointer;
        transition: transform .14s ease, background .18s ease, border-color .18s ease;
      }
      #${PANEL_ID} .cmm-minirow:hover,
      #${PANEL_ID} .cmm-cluster:hover,
      #${PANEL_ID} .cmm-actioncard:hover{
        transform: translateY(-1px);
        background: color-mix(in srgb, var(--md-default-bg-color) 80%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 20%);
      }
      #${PANEL_ID} .cmm-minirow{
        display:grid;
        grid-template-columns:auto minmax(0, 1fr) auto;
        gap:.5rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-minirow__body{
        min-width:0;
        display:grid;
        gap:.16rem;
      }
      #${PANEL_ID} .cmm-minirow__title{
        font-weight:700;
        font-size:.88rem;
        line-height:1.16;
      }
      #${PANEL_ID} .cmm-minirow__sub{
        opacity:.72;
        font-size:.74rem;
        line-height:1.14;
      }
      #${PANEL_ID} .cmm-minirow__stat{
        font-size:.78rem;
        font-weight:800;
        text-align:right;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-cluster__top{
        display:flex;
        justify-content:space-between;
        gap:.5rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-cluster__label{
        font-weight:800;
        font-size:.88rem;
      }
      #${PANEL_ID} .cmm-cluster__score{
        font-size:.78rem;
        font-weight:900;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-cluster__bar{
        display:block;
        width:100%;
        height:8px;
        border-radius:999px;
        background: rgba(0,0,0,.08);
        margin-top:.42rem;
        overflow:hidden;
      }
      #${PANEL_ID} .cmm-cluster__bar > span{
        display:block;
        height:100%;
        border-radius:inherit;
        background: hsl(var(--cmm-h, 140) var(--cmm-s, 60%) var(--cmm-fill-l, 64%));
      }
      #${PANEL_ID} .cmm-cluster__meta,
      #${PANEL_ID} .cmm-actioncard__sub{
        display:block;
        margin-top:.34rem;
        opacity:.72;
        font-size:.74rem;
        line-height:1.18;
      }
      #${PANEL_ID} .cmm-actioncard__title{
        display:block;
        font-weight:800;
        font-size:.88rem;
        line-height:1.16;
      }

      #${PANEL_ID} .cmm-vizrows,
      #${PANEL_ID} .cmm-histrows{
        display:grid;
        gap:.48rem;
        margin-top:.62rem;
      }
      #${PANEL_ID} .cmm-vizrow{
        appearance:none;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.48);
        color:inherit;
        border-radius:13px;
        padding:.52rem .56rem;
        display:grid;
        gap:.26rem;
        text-align:left;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-vizrow:hover{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%);
      }
      #${PANEL_ID} .cmm-vizrow--static{
        cursor:default;
      }
      #${PANEL_ID} .cmm-vizrow--static:hover{
        background: rgba(255,255,255,.48);
      }
      #${PANEL_ID} .cmm-vizrow__head,
      #${PANEL_ID} .cmm-vizrow__top{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.5rem;
        min-width:0;
      }
      #${PANEL_ID} .cmm-vizrow__award,
      #${PANEL_ID} .cmm-vizrow__label{
        min-width:0;
        font-size:.72rem;
        font-weight:900;
        letter-spacing:0;
        line-height:1.08;
        color:rgba(0,0,0,.62);
        text-transform:none;
      }
      #${PANEL_ID} .cmm-vizrow__lecture{
        display:block;
        font-size:.86rem;
        font-weight:900;
        line-height:1.05;
      }
      #${PANEL_ID} .cmm-vizrow__score{
        border-radius:999px;
        border:1px solid hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .52);
        background: hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .72);
        color: hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
        padding:.16rem .42rem;
        font-size:.70rem;
        font-weight:900;
        line-height:1;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-vizrow__meta{
        font-size:.68rem;
        opacity:.72;
        line-height:1.13;
      }
      #${PANEL_ID} .cmm-vizbar,
      #${PANEL_ID} .cmm-histbar{
        display:block;
        height:8px;
        border-radius:999px;
        background: rgba(0,0,0,.08);
        overflow:hidden;
      }
      #${PANEL_ID} .cmm-vizbar__fill,
      #${PANEL_ID} .cmm-histbar__fill{
        display:block;
        height:100%;
        min-width:2px;
        border-radius:inherit;
        background: hsl(var(--cmm-h, 140) var(--cmm-s, 60%) var(--cmm-fill-l, 64%));
      }
      #${PANEL_ID} .cmm-histrow{
        display:grid;
        grid-template-columns: 92px minmax(0, 1fr) 24px 34px;
        gap:.38rem;
        align-items:center;
      }
      #${PANEL_ID} .cmm-histrow__label,
      #${PANEL_ID} .cmm-histrow__count,
      #${PANEL_ID} .cmm-histrow__share{
        font-size:.70rem;
        line-height:1;
      }
      #${PANEL_ID} .cmm-histrow__label{ font-weight:800; opacity:.82; }
      #${PANEL_ID} .cmm-histrow__count{ font-weight:900; text-align:right; }
      #${PANEL_ID} .cmm-histrow__share{ opacity:.62; text-align:right; }
      #${PANEL_ID} .cmm-trend-summary{
        margin-top:.62rem;
        display:flex;
        align-items:baseline;
        justify-content:space-between;
        gap:.5rem;
        padding:.48rem .56rem;
        border-radius:13px;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.48);
      }
      #${PANEL_ID} .cmm-trend-summary__value{
        font-weight:900;
        font-size:.88rem;
        line-height:1.05;
      }
      #${PANEL_ID} .cmm-trend-summary__label{
        opacity:.66;
        font-size:.68rem;
        line-height:1;
        text-align:right;
      }
      #${PANEL_ID} .cmm-timeline{
        margin-top:.58rem;
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(34px, 1fr));
        gap:.32rem;
        align-items:end;
      }
      #${PANEL_ID} .cmm-timeline__item{
        min-width:0;
        display:grid;
        gap:.22rem;
      }
      #${PANEL_ID} .cmm-timeline__bar{
        height:46px;
        border-radius:999px;
        background: rgba(0,0,0,.08);
        overflow:hidden;
        display:flex;
        align-items:flex-end;
      }
      #${PANEL_ID} .cmm-timeline__bar > span{
        display:block;
        width:100%;
        min-height:3px;
        border-radius:inherit;
        background: hsl(var(--cmm-h, 140) var(--cmm-s, 60%) var(--cmm-fill-l, 64%));
      }
      #${PANEL_ID} .cmm-timeline__date{
        text-align:center;
        font-size:.58rem;
        opacity:.62;
        line-height:1;
      }
      #${PANEL_ID} .cmm-change-list{
        display:grid;
        gap:.36rem;
        margin-top:.58rem;
      }
      #${PANEL_ID} .cmm-change-list--compact{
        margin-top:.52rem;
      }
      #${PANEL_ID} .cmm-change-row{
        appearance:none;
        border:1px solid rgba(0,0,0,.08);
        background: rgba(255,255,255,.42);
        color:inherit;
        border-radius:12px;
        padding:.46rem .54rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.5rem;
        text-align:left;
        cursor:pointer;
      }
      #${PANEL_ID} .cmm-change-row--is-positive{
        border-color: color-mix(in srgb, hsl(138 58% 42%) 22%, rgba(0,0,0,.08));
        background: color-mix(in srgb, var(--md-default-bg-color) 91%, hsl(138 58% 48%) 9%);
      }
      #${PANEL_ID} .cmm-change-row--is-negative{
        border-color: color-mix(in srgb, hsl(7 72% 48%) 24%, rgba(0,0,0,.08));
        background: color-mix(in srgb, var(--md-default-bg-color) 91%, hsl(7 72% 58%) 9%);
      }
      #${PANEL_ID} .cmm-change-row--is-neutral{
        border-color: color-mix(in srgb, hsl(220 16% 48%) 20%, rgba(0,0,0,.08));
        background: color-mix(in srgb, var(--md-default-bg-color) 91%, hsl(220 16% 60%) 9%);
      }
      #${PANEL_ID} .cmm-change-row:hover{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-accent-fg-color, var(--md-primary-fg-color)) 18%);
      }
      #${PANEL_ID} .cmm-change-row__label{
        font-size:.74rem;
        font-weight:800;
        line-height:1.1;
        flex:0 0 auto;
        min-width:max-content;
      }
      #${PANEL_ID} .cmm-change-row__right{
        display:inline-flex;
        align-items:baseline;
        justify-content:flex-end;
        gap:.42rem;
        white-space:nowrap;
        min-width:0;
        flex:1 1 auto;
      }
      #${PANEL_ID} .cmm-change-row__date,
      #${PANEL_ID} .cmm-change-row__delta{
        display:none;
      }
      #${PANEL_ID} .cmm-change-row__beforeafter{
        min-width:0;
        max-width:100%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.62rem;
        line-height:1.08;
        font-weight:760;
        letter-spacing:-.01em;
        color:var(--md-default-fg-color--light);
        opacity:.92;
      }
      #${PANEL_ID} .cmm-change-row__beforeafter > span{
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-change-ba__was,
      #${PANEL_ID} .cmm-change-ba__dot,
      #${PANEL_ID} .cmm-change-ba__date{
        color:var(--md-default-fg-color--light);
        opacity:.82;
      }
      #${PANEL_ID} .cmm-change-ba__before{
        color:color-mix(in srgb, var(--md-default-fg-color) 74%, transparent);
        opacity:.92;
      }
      #${PANEL_ID} .cmm-change-ba__arrow{
        display:inline-block;
        margin:0 .03rem;
        font-size:.92em;
        line-height:1;
        transform:translateY(-.02rem);
        color:color-mix(in srgb, var(--md-default-fg-color) 56%, transparent);
        opacity:.86;
      }
      #${PANEL_ID} .cmm-change-ba__arrow.is-positive,
      #${PANEL_ID} .cmm-change-ba__after.is-positive{
        color:hsl(138 58% 34%);
        opacity:1;
      }
      #${PANEL_ID} .cmm-change-ba__arrow.is-negative,
      #${PANEL_ID} .cmm-change-ba__after.is-negative{
        color:hsl(7 72% 45%);
        opacity:1;
      }
      #${PANEL_ID} .cmm-change-ba__arrow.is-neutral,
      #${PANEL_ID} .cmm-change-ba__after.is-neutral{
        color:hsl(220 16% 38%);
        opacity:1;
      }

      html[data-md-color-scheme="default"] .cmm-h1-entry,
      body[data-md-color-scheme="default"] .cmm-h1-entry{
        --cmm-entry-text-color: #111827 !important;
        color: #111827 !important;
      }
      html[data-md-color-scheme="default"] .cmm-h1-entry__icon,
      html[data-md-color-scheme="default"] .cmm-h1-entry__label,
      html[data-md-color-scheme="default"] .cmm-h1-entry__icon svg,
      body[data-md-color-scheme="default"] .cmm-h1-entry__icon,
      body[data-md-color-scheme="default"] .cmm-h1-entry__label,
      body[data-md-color-scheme="default"] .cmm-h1-entry__icon svg{
        color: #111827 !important;
      }
      html[data-md-color-scheme="default"] .cmm-h1-entry__icon svg *,
      body[data-md-color-scheme="default"] .cmm-h1-entry__icon svg *{
        color: #111827 !important;
        stroke: currentColor !important;
        opacity: 1 !important;
      }

      html[data-md-color-scheme="slate"] .cmm-h1-entry,
      body[data-md-color-scheme="slate"] .cmm-h1-entry{
        --cmm-entry-text-color: rgba(255,255,255,.96) !important;
        background: linear-gradient(135deg, rgba(99,102,241,.24), rgba(129,140,248,.14));
        color: rgba(255,255,255,.96) !important;
        border-color: rgba(129,140,248,.42);
        box-shadow: 0 12px 34px rgba(0,0,0,.28);
      }
      html[data-md-color-scheme="slate"] .cmm-h1-entry:hover,
      body[data-md-color-scheme="slate"] .cmm-h1-entry:hover{
        background: linear-gradient(135deg, rgba(99,102,241,.31), rgba(129,140,248,.20));
        border-color: rgba(165,180,252,.58);
      }
      html[data-md-color-scheme="slate"] .cmm-h1-entry,
      html[data-md-color-scheme="slate"] .cmm-h1-entry__icon,
      html[data-md-color-scheme="slate"] .cmm-h1-entry__label,
      html[data-md-color-scheme="slate"] .cmm-h1-entry__icon svg,
      body[data-md-color-scheme="slate"] .cmm-h1-entry,
      body[data-md-color-scheme="slate"] .cmm-h1-entry__icon,
      body[data-md-color-scheme="slate"] .cmm-h1-entry__label,
      body[data-md-color-scheme="slate"] .cmm-h1-entry__icon svg{
        color: rgba(255,255,255,.96) !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg,
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg{
        color: currentColor !important;
        fill: none !important;
        stroke: none !important;
        filter: none !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg *,
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg *{
        color: #fff !important;
        filter: none !important;
        opacity: 1 !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [stroke],
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [stroke]{
        stroke: currentColor !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill="none"],
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill="none"]{
        fill: none !important;
      }
      html[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill]:not([fill="none"]),
      body[data-md-color-scheme="slate"] article.md-content__inner h1.cmm-h1-row .cmm-h1-entry svg [fill]:not([fill="none"]){
        fill: none !important;
      }
      html[data-md-color-scheme="slate"] .cmm-modal__close,
      body[data-md-color-scheme="slate"] .cmm-modal__close{
        border-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="default"] #${PANEL_ID},
      body[data-md-color-scheme="default"] #${PANEL_ID}{
        --cmm-panel-bg: #f2f3f5;
        background: #f2f3f5 !important;
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID},
      body[data-md-color-scheme="slate"] #${PANEL_ID}{
        --cmm-panel-bg: #242832;
        background: #242832 !important;
        border-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-head,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-head{
        border-bottom-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-metric,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-concept,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-chip,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cta,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-filter,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-state,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__chev,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-metric,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-concept,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-chip,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cta,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-filter,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-state,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__chev,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-stage__main,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-sidecard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-row,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-minirow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cluster,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-actioncard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-reason,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-scoreorb{
        border-color: rgba(255,255,255,.10);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-stage__main,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-sidecard,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-row,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-minirow,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cluster,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-actioncard,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-stage__main,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-sidecard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-row,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-minirow,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-cluster,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-actioncard,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow{
        background: color-mix(in srgb, var(--md-default-bg-color) 82%, var(--md-primary-fg-color) 18%);
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__award,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__award,
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__label,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-vizrow__label{
        color:rgba(255,255,255,.68);
      }
      @media (max-width: 1100px){
        #${PANEL_ID} .cmm-toprow{
          grid-template-columns:1fr;
        }
        #${PANEL_ID} .cmm-metrics{
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 720px){
        .cmm-h1-row{
          align-items:flex-start;
          gap:10px;
        }
        .cmm-h1-entry{
          height: var(--cmm-entry-height, 48px);
          min-height: var(--cmm-entry-height, 48px);
          padding:var(--cmm-entry-padding, 0 .92rem 0 .86rem);
          border-radius:var(--cmm-entry-radius, 14px);
          font-size:var(--cmm-entry-font-size, inherit);
          gap:var(--cmm-entry-gap, .42rem);
        }
        .cmm-modal{
          padding:10px;
        }
        .cmm-modal__dialog{
          width:min(980px, calc(100vw - 12px));
          max-height:calc(100vh - 12px);
          border-radius:18px;
        }
        .cmm-modal__close{
          top:10px;
          right:10px;
          width:34px;
          height:34px;
        }
        #${PANEL_ID}{
          border-radius:18px;
        }
        #${PANEL_ID} .cmm-body,
        #${PANEL_ID} .cmm-head{
          padding: .9rem;
        }
        #${PANEL_ID} .cmm-head{
          padding-right: 3.2rem;
        }
        #${PANEL_ID} .cmm-head__row{
          grid-template-columns:1fr;
          gap:.65rem;
        }
        #${PANEL_ID} .cmm-headreadiness--orb{
          width:80px;
          height:80px;
        }
        #${PANEL_ID} .cmm-metrics{
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        #${PANEL_ID} .cmm-focuscard__body{
          grid-template-columns:minmax(0,1fr) auto;
          align-items:start;
        }
        #${PANEL_ID} .cmm-focusfacts{
          grid-template-columns:repeat(3,minmax(0,1fr));
          width:100%;
        }
        #${PANEL_ID} .cmm-actions,
        #${PANEL_ID} .cmm-filters{
          gap:.45rem;
        }
        #${PANEL_ID} .cmm-cta,
        #${PANEL_ID} .cmm-filter{
          padding:.54rem .82rem;
        }
        #${PANEL_ID} .cmm-filter{
          font-size:.82rem;
          font-weight:500;
          padding:.42rem .68rem;
        }
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns: minmax(0, 1fr) auto;
        }
        #${PANEL_ID} .cmm-lecture__stats{
          grid-column: 1 / -1;
          justify-content:flex-start;
        }
        #${PANEL_ID} .cmm-concept{
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap:.5rem;
          padding:.56rem .64rem;
        }
        #${PANEL_ID} .cmm-state{
          font-size:.72rem;
          padding:.22rem .46rem;
        }

        #${PANEL_ID} .cmm-stage{
          grid-template-columns: 1fr;
        }
        #${PANEL_ID} .cmm-stage__main,
        #${PANEL_ID} .cmm-sidecard{
          border-radius:16px;
        }
        #${PANEL_ID} .cmm-row{
          grid-template-columns: 1fr;
          gap:.5rem;
        }
        #${PANEL_ID} .cmm-row__risk{
          justify-items:start;
          grid-auto-flow:column;
          align-items:center;
          gap:.42rem;
        }
        #${PANEL_ID} .cmm-row__tiles{
          gap:.3rem;
        }
        #${PANEL_ID} .cmm-tile{
          width:20px;
          height:20px;
          border-radius:7px;
        }
        #${PANEL_ID} .cmm-focushead{
          grid-template-columns: 1fr auto;
        }
        #${PANEL_ID} .cmm-scoreorb{
          width:76px;
          height:76px;
          min-width:76px;
        }
        #${PANEL_ID} .cmm-scoreorb span{ font-size:1.06rem; }
        #${PANEL_ID} .cmm-scoreorb small{ font-size:.48rem; }

      }

      @media (max-width: 900px), (pointer: coarse){
        .cmm-modal{
          display:block;
          top:0 !important;
          bottom:auto !important;
          height:var(--cmm-vh, 100dvh) !important;
          padding:0 !important;
          align-items:stretch !important;
          justify-content:stretch !important;
          overflow:hidden !important;
          background:transparent !important;
        }
        .cmm-modal[hidden]{ display:none !important; }
        .cmm-modal__backdrop{
          position:absolute;
          inset:0;
          background:rgba(12,16,24,.42);
          -webkit-backdrop-filter:blur(10px) saturate(1.04);
          backdrop-filter:blur(10px) saturate(1.04);
          pointer-events:auto;
        }
        .cmm-modal__dialog{
          position:absolute !important;
          top:var(--cmm-mobile-top-pad, 96px) !important;
          left:18px !important;
          right:18px !important;
          bottom:var(--cmm-mobile-bottom-pad, env(safe-area-inset-bottom, 0px)) !important;
          width:auto !important;
          max-width:none !important;
          height:auto !important;
          max-height:none !important;
          margin:0 !important;
          overflow:auto !important;
          -webkit-overflow-scrolling:touch;
          overscroll-behavior:contain;
          border-radius:18px !important;
        }
        #${PANEL_ID}{
          min-height:100%;
          border-radius:18px !important;
          background:var(--cmm-panel-bg, #f2f3f5) !important;
        }
        [data-md-color-scheme="default"] #${PANEL_ID},
        body[data-md-color-scheme="default"] #${PANEL_ID}{
          --cmm-panel-bg:#f2f3f5;
          background:#f2f3f5 !important;
        }
        [data-md-color-scheme="slate"] #${PANEL_ID},
        body[data-md-color-scheme="slate"] #${PANEL_ID}{
          --cmm-panel-bg:#242832;
          background:#242832 !important;
        }
      }

      @media (max-width: 520px), (pointer: coarse){
        .cmm-modal__dialog{
          left:12px !important;
          right:12px !important;
        }
      }

      #${PANEL_ID} .cmm-headreadiness-wrap{
        position:relative;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:0;
      }
      #${PANEL_ID} button.cmm-headreadiness{
        appearance:none;
        -webkit-appearance:none;
        cursor:pointer;
        font:inherit;
      }
      #${PANEL_ID} .cmm-readiness-help{
        position:absolute;
        left:0;
        top:calc(100% + 8px);
        z-index:8;
        width:min(280px, calc(100vw - 48px));
        padding:.72rem .82rem;
        border-radius:14px;
        border:1px solid rgba(0,0,0,.12);
        background:var(--md-default-bg-color,#fff);
        color:var(--md-default-fg-color,#1f2328);
        box-shadow:0 16px 38px rgba(0,0,0,.18);
        font-size:.78rem;
        line-height:1.35;
      }
      #${PANEL_ID} .cmm-readiness-help[hidden]{ display:none !important; }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-readiness-help,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-readiness-help{
        border-color:rgba(255,255,255,.14);
        background:color-mix(in srgb,var(--md-default-bg-color) 90%,var(--md-primary-fg-color) 10%);
      }

      @media (max-width: 720px){
        #${PANEL_ID},
        #${PANEL_ID} *{
          box-sizing:border-box;
        }
        #${PANEL_ID} .cmm-sub,
        #${PANEL_ID} .cmm-stagehead__sub{
          display:none !important;
        }
        #${PANEL_ID} .cmm-body{
          padding:.72rem !important;
          gap:.72rem !important;
          overflow:hidden;
        }
        #${PANEL_ID} .cmm-head{
          padding:.78rem 3rem .72rem .78rem !important;
        }
        #${PANEL_ID} .cmm-head__row{
          grid-template-columns:72px minmax(0,1fr) !important;
          gap:.6rem !important;
          align-items:center !important;
        }
        #${PANEL_ID} .cmm-headreadiness--orb{
          width:66px !important;
          height:66px !important;
          min-width:66px !important;
          padding:.35rem !important;
        }
        #${PANEL_ID} .cmm-headreadiness strong{
          font-size:1rem !important;
        }
        #${PANEL_ID} .cmm-headreadiness span{
          font-size:.43rem !important;
        }
        #${PANEL_ID} .cmm-title{
          font-size:1.05rem !important;
          line-height:1.12 !important;
        }
        #${PANEL_ID} .cmm-toprow,
        #${PANEL_ID} .cmm-stage{
          grid-template-columns:minmax(0,1fr) !important;
          width:100% !important;
          max-width:100% !important;
          overflow:hidden;
        }
        #${PANEL_ID} .cmm-metrics{
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
          gap:.55rem !important;
          min-width:0 !important;
          width:100% !important;
        }
        #${PANEL_ID} .cmm-metric{
          min-width:0 !important;
          min-height:5.55rem !important;
          padding:.68rem .58rem !important;
          border-radius:13px !important;
        }
        #${PANEL_ID} .cmm-metric__label{
          font-size:.64rem !important;
          line-height:1.16 !important;
        }
        #${PANEL_ID} .cmm-metric__value{
          font-size:.88rem !important;
          line-height:1.06 !important;
        }
        #${PANEL_ID} .cmm-metric__helper{
          font-size:.64rem !important;
          line-height:1.16 !important;
        }
        #${PANEL_ID} .cmm-focuscard,
        #${PANEL_ID} .cmm-sidecard,
        #${PANEL_ID} .cmm-stage__main,
        #${PANEL_ID} .cmm-row,
        #${PANEL_ID} .cmm-minirow,
        #${PANEL_ID} .cmm-vizrow{
          min-width:0 !important;
          max-width:100% !important;
          overflow:hidden;
        }
        #${PANEL_ID} .cmm-focuscard__body{
          grid-template-columns:minmax(0,1fr) 62px !important;
          gap:.55rem !important;
          align-items:start !important;
        }
        #${PANEL_ID} .cmm-sidecard__kicker{
          font-size:.68rem !important;
          line-height:1.1 !important;
        }
        #${PANEL_ID} .cmm-sidecard__title,
        #${PANEL_ID} .cmm-focuscard__titlelink{
          font-size:.94rem !important;
          line-height:1.12 !important;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-focusfacts{
          grid-template-columns:repeat(3,minmax(0,1fr)) !important;
          gap:.34rem !important;
          width:100% !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-focusfact{
          min-width:0 !important;
          border-radius:11px !important;
          padding:.34rem .38rem !important;
        }
        #${PANEL_ID} .cmm-focusfact span{
          font-size:.54rem !important;
          line-height:1.05 !important;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-focusfact strong{
          font-size:.68rem !important;
          line-height:1.08 !important;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-focusorbs{
          display:flex !important;
          flex-direction:column !important;
          align-items:flex-end !important;
          gap:.32rem !important;
        }
        #${PANEL_ID} .cmm-scoreorb{
          width:62px !important;
          height:62px !important;
          min-width:62px !important;
        }
        #${PANEL_ID} .cmm-scoreorb span{
          font-size:.86rem !important;
          line-height:.95 !important;
        }
        #${PANEL_ID} .cmm-scoreorb small{
          font-size:.40rem !important;
        }
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:minmax(0,1fr) 30px !important;
          gap:.42rem !important;
          padding:.58rem .64rem !important;
          align-items:center !important;
        }
        #${PANEL_ID} .cmm-lecture__left{
          grid-column:1 / 2 !important;
          grid-row:1 !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-lecture__chev{
          grid-column:2 / 3 !important;
          grid-row:1 !important;
          justify-self:end !important;
          align-self:center !important;
          width:28px !important;
          height:28px !important;
          min-width:28px !important;
        }
        #${PANEL_ID} .cmm-lecture__stats{
          grid-column:1 / -1 !important;
          grid-row:2 !important;
          justify-content:flex-start !important;
          gap:.24rem !important;
          flex-wrap:wrap !important;
        }
        #${PANEL_ID} .cmm-lecture__title{
          font-size:.96rem !important;
          line-height:1.12 !important;
        }
        #${PANEL_ID} .cmm-lecture__meta{
          font-size:.66rem !important;
          line-height:1.1 !important;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #${PANEL_ID} .cmm-chip{
          font-size:.61rem !important;
          line-height:1 !important;
          padding:.19rem .36rem !important;
          border-radius:999px !important;
        }
        #${PANEL_ID} .cmm-row__tiles{
          min-width:0 !important;
          max-width:100% !important;
        }
      }


      /* v10 mobile diagnostics: full-screen panel, safe-area transparent, no horizontal spill. */
      @media (max-width: 900px), (pointer: coarse){
        .cmm-modal{
          position:fixed !important;
          inset:0 !important;
          width:100vw !important;
          height:var(--cmm-vh, 100dvh) !important;
          padding:0 !important;
          margin:0 !important;
          display:block !important;
          overflow:hidden !important;
          background:transparent !important;
          touch-action:none !important;
        }
        .cmm-modal__backdrop{
          position:absolute !important;
          inset:0 !important;
          background:rgba(12,16,24,.42) !important;
          -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
          backdrop-filter:blur(10px) saturate(1.04) !important;
        }
        .cmm-modal__dialog{
          position:absolute !important;
          top:var(--cmm-mobile-top-pad, env(safe-area-inset-top, 0px)) !important;
          left:0 !important;
          right:0 !important;
          bottom:var(--cmm-mobile-bottom-pad, env(safe-area-inset-bottom, 0px)) !important;
          width:100vw !important;
          max-width:none !important;
          height:auto !important;
          max-height:none !important;
          margin:0 !important;
          padding:0 !important;
          border-radius:0 !important;
          overflow:auto !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          box-shadow:none !important;
          touch-action:pan-y !important;
        }
        .cmm-modal__close{
          top:10px !important;
          right:12px !important;
          width:36px !important;
          height:36px !important;
          z-index:20 !important;
        }
        #${PANEL_ID}{
          width:100% !important;
          max-width:100% !important;
          min-height:100% !important;
          border-radius:0 !important;
          border-left:0 !important;
          border-right:0 !important;
          box-shadow:none !important;
          overflow:hidden !important;
        }
        #${PANEL_ID} .cmm-head,
        #${PANEL_ID} .cmm-body{
          width:100% !important;
          max-width:100% !important;
          overflow:hidden !important;
        }
      }

      @media (max-width: 720px){
        #${PANEL_ID} .cmm-head{
          padding:.76rem 3.25rem .74rem .78rem !important;
        }
        #${PANEL_ID} .cmm-head__row{
          grid-template-columns:68px minmax(0,1fr) !important;
        }
        #${PANEL_ID} .cmm-headreadiness--orb{
          width:62px !important;
          height:62px !important;
          min-width:62px !important;
        }
        #${PANEL_ID} .cmm-title{
          font-size:1.08rem !important;
          line-height:1.1 !important;
        }
        #${PANEL_ID} .cmm-legend{
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
          display:grid !important;
          grid-template-columns:max-content minmax(84px,1fr) max-content !important;
          gap:.36rem !important;
          justify-content:stretch !important;
          align-items:center !important;
          font-size:.62rem !important;
          line-height:1.22 !important;
          white-space:nowrap !important;
          overflow:visible !important;
          padding-bottom:2px !important;
        }
        #${PANEL_ID} .cmm-legend__label{
          display:block !important;
          line-height:1.22 !important;
          padding-bottom:1px !important;
        }
        #${PANEL_ID} .cmm-legend__bar{
          width:100% !important;
          min-width:0 !important;
          height:8px !important;
        }
        #${PANEL_ID} .cmm-stagehead{
          align-items:flex-start !important;
          gap:.48rem !important;
        }
        #${PANEL_ID} .cmm-focuscard{
          position:relative !important;
        }
        #${PANEL_ID} .cmm-focuscard__body{
          display:block !important;
          width:100% !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard__main{
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-sidecard__sub{
          max-width:none !important;
          width:100% !important;
          font-size:.78rem !important;
          line-height:1.22 !important;
        }
        #${PANEL_ID} .cmm-focusfacts{
          grid-template-columns:repeat(3,minmax(0,1fr)) !important;
          gap:.36rem !important;
          width:100% !important;
          max-width:100% !important;
          margin-top:.56rem !important;
        }
        #${PANEL_ID} .cmm-focusfact{
          padding:.34rem .4rem !important;
        }
        #${PANEL_ID} .cmm-focusfact span{
          font-size:.53rem !important;
          line-height:1.05 !important;
        }
        #${PANEL_ID} .cmm-focusfact strong{
          font-size:.68rem !important;
          line-height:1.08 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-focusorbs{
          display:flex !important;
          flex-direction:row !important;
          align-items:center !important;
          justify-content:flex-start !important;
          gap:.42rem !important;
          flex-wrap:wrap !important;
          margin-top:.54rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-focusorbs-stack{
          align-items:flex-start !important;
          width:100% !important;
          margin-top:.54rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-focusorbs-stack .cmm-focusorbs{
          margin-top:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-public-score-avgs{
          max-width:none !important;
          width:100% !important;
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-public-score-avg{
          text-align:left !important;
          font-size:.52rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-public-score-avg strong{
          font-size:.62rem !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-scoreorb{
          position:static !important;
          width:max-content !important;
          min-width:0 !important;
          height:auto !important;
          min-height:0 !important;
          display:inline-flex !important;
          flex-direction:row !important;
          align-items:center !important;
          justify-content:center !important;
          gap:.25rem !important;
          border-radius:999px !important;
          padding:.36rem .58rem !important;
          margin-top:0 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-scoreorb span{
          font-size:.78rem !important;
          line-height:1 !important;
        }
        #${PANEL_ID} .cmm-focuscard .cmm-scoreorb small{
          font-size:.44rem !important;
          line-height:1 !important;
        }
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:minmax(0,1fr) 28px !important;
          gap:.38rem !important;
          padding:.54rem .56rem !important;
        }
        #${PANEL_ID} .cmm-lecture__stats{
          display:flex !important;
          flex-wrap:nowrap !important;
          overflow:hidden !important;
          gap:.24rem !important;
        }
        #${PANEL_ID} .cmm-lecture__stats .cmm-chip{
          flex:0 1 auto !important;
          min-width:0 !important;
          max-width:33.33% !important;
          white-space:nowrap !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
          font-size:.56rem !important;
          padding:.20rem .32rem !important;
        }
        #${PANEL_ID} .cmm-row__risk{
          display:flex !important;
          align-items:center !important;
          gap:.38rem !important;
          min-width:0 !important;
          max-width:100% !important;
        }
        #${PANEL_ID} .cmm-row__risk .cmm-riskchip{
          flex:0 0 auto !important;
        }
        #${PANEL_ID} .cmm-row__risklabel{
          min-width:0 !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
        }
      }


      /* v28/v29 mobile diagnostics row/legend balance:
         Keep Lecture label, concept tiles, and readiness chip on one row.
         The tile strip is a two-row horizontal grid, so long lectures need much less dragging.
         v29 tightens the mobile label-to-tile gap slightly so the overflow strip visibly reveals more of the next tile.
         v30 also tightens the desktop label-to-tile spacing while keeping all tiles visible via wrapping.
         The legend uses the available row width: labels keep their natural width and the bar receives the remaining space. */
      @media (max-width: 720px), (pointer: coarse){
        #${PANEL_ID} .cmm-legend{
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
          display:grid !important;
          grid-template-columns:max-content minmax(0, 1fr) max-content !important;
          justify-content:stretch !important;
          align-items:center !important;
          gap:.42rem !important;
          font-size:clamp(.52rem, 2.35vw, .64rem) !important;
          line-height:1.14 !important;
          white-space:nowrap !important;
          overflow:visible !important;
          opacity:.84 !important;
        }
        #${PANEL_ID} .cmm-legend__label{
          display:block !important;
          min-width:max-content !important;
          max-width:none !important;
          overflow:visible !important;
          text-overflow:clip !important;
          white-space:nowrap !important;
          line-height:1.14 !important;
          padding:0 !important;
        }
        #${PANEL_ID} .cmm-legend__bar{
          width:100% !important;
          min-width:0 !important;
          max-width:none !important;
          height:7px !important;
          flex:1 1 auto !important;
          justify-self:stretch !important;
        }
        #${PANEL_ID} .cmm-stagehead{
          align-items:flex-start !important;
          gap:.42rem !important;
          overflow:visible !important;
        }
        #${PANEL_ID} .cmm-stage__main{
          overflow:hidden !important;
        }
        #${PANEL_ID} .cmm-row{
          display:grid !important;
          grid-template-columns:minmax(72px, 84px) minmax(0, 1fr) auto !important;
          column-gap:.30rem !important;
          row-gap:.42rem !important;
          align-items:center !important;
          padding:.62rem .52rem !important;
          overflow:hidden !important;
        }
        #${PANEL_ID} .cmm-row__label{
          min-width:0 !important;
          align-self:center !important;
        }
        #${PANEL_ID} .cmm-row__title{
          font-size:.82rem !important;
          line-height:1.1 !important;
          white-space:nowrap !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
        }
        #${PANEL_ID} .cmm-row__meta{
          display:grid !important;
          gap:.02rem !important;
          margin-top:.12rem !important;
          font-size:.66rem !important;
          line-height:1.03 !important;
        }
        #${PANEL_ID} .cmm-row__meta-line{
          display:block !important;
          white-space:nowrap !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
        }
        #${PANEL_ID} .cmm-row__tiles{
          grid-column:2 !important;
          min-width:0 !important;
          max-width:100% !important;
          display:grid !important;
          grid-template-rows:repeat(2, 18px) !important;
          grid-auto-flow:column !important;
          grid-auto-columns:18px !important;
          justify-content:flex-start !important;
          align-content:center !important;
          align-items:center !important;
          gap:.20rem .22rem !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior-x:contain !important;
          scrollbar-width:none !important;
          padding:2px 1px 3px !important;
        }
        #${PANEL_ID} .cmm-row__tiles::-webkit-scrollbar{
          display:none !important;
        }
        #${PANEL_ID} .cmm-tile{
          width:18px !important;
          height:18px !important;
          min-width:18px !important;
          min-height:18px !important;
          flex:0 0 18px !important;
          border-radius:7px !important;
        }
        #${PANEL_ID} .cmm-tile__txt{
          font-size:.54rem !important;
        }
        #${PANEL_ID} .cmm-row__risk{
          grid-column:3 !important;
          min-width:0 !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          justify-items:center !important;
          gap:0 !important;
        }
        #${PANEL_ID} .cmm-row__risk .cmm-riskchip{
          min-width:42px !important;
          padding:.22rem .42rem !important;
          font-size:.74rem !important;
          line-height:1 !important;
          flex:0 0 auto !important;
        }
        #${PANEL_ID} .cmm-row__risklabel{
          display:none !important;
        }
      }


      /* v22 mobile safe-area surface for the new fullscreen diagnostics layout.
         This keeps the v20 transparent safe-area effect, then lets the actual
         diagnostics panel continue down into iOS Safari's bottom toolbar area. */
      html.cmm-modal-open #mw-mastery,
      html.cmm-modal-open #mw-mastery *,
      html.cmm-modal-open #mw-mastery-compact,
      html.cmm-modal-open #mw-mastery-compact *,
      html.cmm-modal-open .mw-fly-layer,
      html.cmm-modal-open .mw-fly-layer *,
      html.cmm-modal-open .mw-title-menu,
      html.cmm-modal-open .mw-title-menu *,
      body.cmm-modal-open #mw-mastery,
      body.cmm-modal-open #mw-mastery *,
      body.cmm-modal-open #mw-mastery-compact,
      body.cmm-modal-open #mw-mastery-compact *,
      body.cmm-modal-open .mw-fly-layer,
      body.cmm-modal-open .mw-fly-layer *,
      body.cmm-modal-open .mw-title-menu,
      body.cmm-modal-open .mw-title-menu *{
        pointer-events:none !important;
      }
      @media (max-width: 900px), (pointer: coarse){
        html.cmm-modal-open,
        body.cmm-modal-open{
          overflow:hidden !important;
          touch-action:none !important;
        }
        .cmm-modal{
          position:absolute !important;
          inset:auto !important;
          left:var(--cmm-doc-left, 0px) !important;
          top:var(--cmm-doc-top, 0px) !important;
          width:var(--cmm-doc-width, 100vw) !important;
          height:var(--cmm-doc-height, var(--cmm-vh, 100dvh)) !important;
          min-height:var(--cmm-doc-height, var(--cmm-vh, 100dvh)) !important;
          max-height:none !important;
          padding:0 !important;
          margin:0 !important;
          display:block !important;
          overflow:hidden !important;
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
        }
        .cmm-modal::before{
          content:"";
          position:absolute !important;
          inset:0 !important;
          height:100% !important;
          min-height:100% !important;
          z-index:0 !important;
          pointer-events:none !important;
          background:rgba(12,16,24,.38) !important;
          -webkit-backdrop-filter:blur(10px) saturate(1.04) !important;
          backdrop-filter:blur(10px) saturate(1.04) !important;
        }
        .cmm-modal__backdrop{
          display:none !important;
          background:transparent !important;
          -webkit-backdrop-filter:none !important;
          backdrop-filter:none !important;
        }
        .cmm-modal__dialog{
          position:absolute !important;
          z-index:1 !important;
          display:flex !important;
          flex-direction:column !important;
          top:env(safe-area-inset-top, 0px) !important;
          left:0 !important;
          right:0 !important;
          bottom:0 !important;
          width:100% !important;
          max-width:none !important;
          height:calc(var(--cmm-doc-height, var(--cmm-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
          min-height:calc(var(--cmm-doc-height, var(--cmm-vh, 100dvh)) - env(safe-area-inset-top, 0px)) !important;
          max-height:none !important;
          margin:0 !important;
          padding:0 !important;
          border-radius:0 !important;
          overflow:hidden !important;
          box-shadow:none !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          -webkit-transform:translateZ(0) !important;
          transform:translateZ(0) !important;
          contain:layout paint style !important;
        }
        .cmm-modal__close{
          top:10px !important;
          right:12px !important;
          z-index:20 !important;
        }
        #${PANEL_ID}{
          flex:1 1 auto !important;
          width:100% !important;
          max-width:100% !important;
          height:100% !important;
          min-height:0 !important;
          border-radius:0 !important;
          border-left:0 !important;
          border-right:0 !important;
          box-shadow:none !important;
          overflow-y:auto !important;
          overflow-x:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          overscroll-behavior:contain !important;
          touch-action:pan-y !important;
          padding-bottom:calc(var(--cmm-ios-hidden-tail, 0px) + env(safe-area-inset-bottom, 0px) + 24px) !important;
          background:var(--cmm-panel-bg, #f2f3f5) !important;
        }
        [data-md-color-scheme="default"] #${PANEL_ID},
        body[data-md-color-scheme="default"] #${PANEL_ID}{
          --cmm-panel-bg:#f2f3f5;
          background:#f2f3f5 !important;
        }
        [data-md-color-scheme="slate"] #${PANEL_ID},
        body[data-md-color-scheme="slate"] #${PANEL_ID}{
          --cmm-panel-bg:#242832;
          background:#242832 !important;
        }
      }

      /* v31 lecture list header polish:
         Put the lecture title, status summary, mastery readiness score, and expand arrow on one clean row. */
      #${PANEL_ID} .cmm-lecture__btn{
        grid-template-columns:auto minmax(0, 1fr) auto 30px !important;
        gap:.58rem !important;
        align-items:center !important;
        padding:.78rem .88rem !important;
      }
      #${PANEL_ID} .cmm-lecture__left{
        min-width:max-content !important;
        grid-column:auto !important;
        grid-row:auto !important;
      }
      #${PANEL_ID} .cmm-lecture__title{
        font-size:1.08rem;
        line-height:1.12;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-lecture__meta,
      #${PANEL_ID} .cmm-lecture__stats{
        display:none !important;
      }
      #${PANEL_ID} .cmm-lecture__facts{
        min-width:0;
        display:flex;
        align-items:center;
        gap:.44rem;
        flex-wrap:nowrap;
        overflow:hidden;
        white-space:nowrap;
      }
      #${PANEL_ID} .cmm-lecture__fact{
        min-width:max-content;
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:.34rem .72rem;
        border-radius:999px;
        border:1px solid rgba(0,0,0,.09);
        background:rgba(255,255,255,.42);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
        font-size:.78rem;
        line-height:1.05;
        font-weight:700;
        color:color-mix(in srgb, var(--md-default-fg-color) 86%, transparent);
        overflow:visible;
        text-overflow:clip;
      }
      #${PANEL_ID} .cmm-lecture__score{
        justify-self:end;
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        gap:.34rem;
        padding:.34rem .72rem;
        border-radius:999px;
        border:1px solid hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-border-l, 48%), .55);
        background:hsla(var(--cmm-h, 140), var(--cmm-s, 60%), var(--cmm-bg-l, 82%), .70);
        color:hsl(var(--cmm-h, 140) 72% var(--cmm-ink-l, 26%));
        line-height:1;
        white-space:nowrap;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);
      }
      #${PANEL_ID} .cmm-lecture__scorelabel{
        font-size:.74rem;
        font-weight:650;
        opacity:.82;
      }
      #${PANEL_ID} .cmm-lecture__score strong{
        font-size:.88rem;
        font-weight:850;
        line-height:1;
      }
      #${PANEL_ID} .cmm-lecture__chev{
        grid-column:auto !important;
        grid-row:auto !important;
        justify-self:end !important;
        align-self:center !important;
        flex:0 0 auto !important;
      }
      html[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__fact,
      body[data-md-color-scheme="slate"] #${PANEL_ID} .cmm-lecture__fact{
        border-color:rgba(255,255,255,.12);
        background:rgba(255,255,255,.05);
        color:rgba(255,255,255,.82);
      }
      @media (max-width: 980px){
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:auto minmax(0, 1fr) auto 28px !important;
          gap:.42rem !important;
          padding:.68rem .70rem !important;
        }
        #${PANEL_ID} .cmm-lecture__title{
          font-size:.98rem !important;
        }
        #${PANEL_ID} .cmm-lecture__facts{
          gap:.32rem !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          -webkit-overflow-scrolling:touch !important;
          scrollbar-width:none !important;
        }
        #${PANEL_ID} .cmm-lecture__facts::-webkit-scrollbar{
          display:none !important;
        }
        #${PANEL_ID} .cmm-lecture__fact{
          flex:0 0 auto !important;
          font-size:.66rem !important;
          padding:.26rem .50rem !important;
        }
        #${PANEL_ID} .cmm-lecture__score{
          padding:.28rem .48rem !important;
          gap:.22rem !important;
        }
        #${PANEL_ID} .cmm-lecture__scorelabel{
          display:none !important;
        }
        #${PANEL_ID} .cmm-lecture__score strong{
          font-size:.74rem !important;
        }
        #${PANEL_ID} .cmm-lecture__chev{
          width:28px !important;
          height:28px !important;
          min-width:28px !important;
        }
      }
      @media (max-width: 520px){
        #${PANEL_ID} .cmm-lecture__btn{
          grid-template-columns:minmax(68px, auto) minmax(0, 1fr) auto 28px !important;
          gap:.32rem !important;
          padding:.60rem .56rem !important;
        }
        #${PANEL_ID} .cmm-lecture__title{
          font-size:.90rem !important;
        }
        #${PANEL_ID} .cmm-lecture__fact{
          font-size:.58rem !important;
          padding:.22rem .42rem !important;
        }
        #${PANEL_ID} .cmm-lecture__score{
          min-width:40px !important;
          justify-content:center !important;
          padding:.24rem .38rem !important;
        }
      }



    `.trim();
    document.head.appendChild(st);
  }

  function ensureModal(anchor) {
    let modal = document.getElementById('mk-course-mastery-map-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mk-course-mastery-map-modal';
      modal.className = 'cmm-modal';
      modal.hidden = true;
      modal.innerHTML = `
        <div class="cmm-modal__backdrop" data-cmm-close="1"></div>
        <div class="cmm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="${PANEL_ID}-title">
          <button type="button" class="cmm-modal__close" data-cmm-close="1" aria-label="Close course mastery map">×</button>
          <section id="${PANEL_ID}"></section>
        </div>
      `;
      document.body.appendChild(modal);
    }

    let panel = q(`#${PANEL_ID}`, modal);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = PANEL_ID;
      const dialog = q('.cmm-modal__dialog', modal) || modal;
      dialog.appendChild(panel);
    }

    if (modal.dataset.cmmBound !== '1') {
      modal.dataset.cmmBound = '1';
      modal.addEventListener('click', (e) => {
        const dialog = q('.cmm-modal__dialog', modal);
        const closeTarget = e.target && e.target.closest ? e.target.closest('[data-cmm-close]') : null;
        const path = e && typeof e.composedPath === 'function' ? e.composedPath() : [];
        const insideDialog = !!(dialog && ((path && path.includes && path.includes(dialog)) || (e.target && dialog.contains(e.target))));
        if (closeTarget || (dialog && !insideDialog)) {
          e.preventDefault();
          setModalOpen(false);
        }
      });
      ['touchstart', 'touchmove', 'pointerdown', 'click'].forEach((eventName) => {
        try {
          modal.addEventListener(eventName, (ev) => {
            if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
          }, { capture: false, passive: eventName !== 'click' });
        } catch (_) {}
      });
    }

    if (!window.__cmmEscBound) {
      window.__cmmEscBound = true;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.open) {
          setModalOpen(false);
        }
      });
    }

    if (anchor) state.anchor = anchor;
    return { modal, panel };
  }


  function cmmConsumeGuestAction(action, detail) {
    try {
      if (window.MkGuestAccess && typeof window.MkGuestAccess.consume === 'function') {
        return !!window.MkGuestAccess.consume(action, detail || {});
      }
    } catch (_) {}
    return true;
  }


  const CMM_DIAGNOSTICS_ITEM_ID = 'course_diagnostics';
  const CMM_DIAGNOSTICS_PRICE = 500;
  const CMM_DIAGNOSTICS_NAME = 'Course Diagnostics';

  function cmmShopApi() {
    try { return window.MkAccountData || null; } catch (_) { return null; }
  }

  function cmmHasShopItem(itemId) {
    if (String(itemId || '') === CMM_DIAGNOSTICS_ITEM_ID) return true;
    try {
      const api = cmmShopApi();
      if (api && typeof api.hasShopItem === 'function') return !!api.hasShopItem(itemId);
      const xp = api && typeof api.xp === 'function' ? api.xp() : null;
      const owned = xp && (xp.ownedShopItems || (xp.shopInventory && xp.shopInventory.ownedIds));
      return Array.isArray(owned) && owned.indexOf(itemId) >= 0;
    } catch (_) { return false; }
  }

  function cmmEorbitsBalance() {
    try {
      const api = cmmShopApi();
      const xp = api && typeof api.xp === 'function' ? api.xp() : null;
      return Number(xp && (xp.currencyBalance != null ? xp.currencyBalance : xp.eorbits) || 0) || 0;
    } catch (_) { return 0; }
  }

  function cmmOfferUnlockDiagnostics(anchor, btn) {
    try {
      const api = cmmShopApi();
      if (cmmHasShopItem(CMM_DIAGNOSTICS_ITEM_ID)) return Promise.resolve(true);
      if (!api || typeof api.buyShopItem !== 'function') {
        window.alert('The shop is still loading. Please try again in a moment.');
        return Promise.resolve(false);
      }
      const balance = cmmEorbitsBalance();
      if (balance + 1e-9 < CMM_DIAGNOSTICS_PRICE) {
        window.alert(`${CMM_DIAGNOSTICS_NAME} needs ${CMM_DIAGNOSTICS_PRICE} EORbits. You currently have ${Math.round(balance * 10) / 10}.`);
        return Promise.resolve(false);
      }
      const ok = window.confirm(`Unlock ${CMM_DIAGNOSTICS_NAME} for ${CMM_DIAGNOSTICS_PRICE} EORbits?`);
      if (!ok) return Promise.resolve(false);
      return api.buyShopItem(CMM_DIAGNOSTICS_ITEM_ID, { source: 'course-diagnostics-button' }).then((res) => {
        if (!res || res.ok === false) {
          window.alert(res && res.error === 'insufficient_funds' ? 'Not enough EORbits.' : 'Unlock failed. Please try again.');
          return false;
        }
        try { window.dispatchEvent(new CustomEvent('mk-shop-inventory-change', { detail: { itemId: CMM_DIAGNOSTICS_ITEM_ID, source: 'course-diagnostics-button' } })); } catch (_) {}
        return true;
      });
    } catch (err) {
      try { window.alert(String(err && err.message || err || 'Unlock failed.')); } catch (_) {}
      return Promise.resolve(false);
    }
  }

  function setModalOpen(open, anchor, btn) {
    if (open && !state.open && !cmmConsumeGuestAction('map', { source: 'course-diagnostics-map', title: 'Course diagnostics' })) return;
    if (anchor) state.anchor = anchor;
    if (btn) state.button = btn;

    const targetAnchor = state.anchor || anchor || q('[data-course-mastery-map]');
    if (!targetAnchor) return;

    const { modal, panel } = ensureModal(targetAnchor);
    state.open = !!open;
    if (state.open) cmmUpdateViewportMetrics();

    modal.hidden = !state.open;
    document.documentElement.classList.toggle('cmm-modal-open', state.open);
    document.body.classList.toggle('cmm-modal-open', state.open);

    if (state.button) {
      state.button.setAttribute('aria-expanded', state.open ? 'true' : 'false');
    }

    state.expandedLecture.clear();
    state.autoExpandedOnce = false;
    state.preservedScrollTop = null;

    if (state.open) {
      cmmUpdateViewportMetrics();
      try { const dialog = q('.cmm-modal__dialog', modal); if (dialog) dialog.scrollTop = 0; } catch (_) {}
      renderMap(targetAnchor, panel);
      window.setTimeout(cmmUpdateViewportMetrics, 60);
      // Do not auto-focus the close button on mobile Safari.
      // It creates a visible blue focus ring and can make the first tap only clear focus.
      const closeBtn = q('.cmm-modal__close', modal);
      if (closeBtn && typeof closeBtn.blur === 'function') {
        try { closeBtn.blur(); } catch (_) {}
      }
    }
  }

  function cmmPrimaryCourseSearchButton() {
    const form = q('#course-search-form');
    const root = form || document;
    return (
      q('#course-search-btn', root) ||
      q('.search-hero__button', root) ||
      q('button.fb-cta-btn--search', root) ||
      q('button[type="submit"]', root) ||
      null
    );
  }

  function cmmMeasureCourseSearchHeight() {
    const form = q('#course-search-form');
    const root = form || document;
    const candidates = [
      cmmPrimaryCourseSearchButton(),
      q('#course-search-input', root),
      q('.search-hero__input', root),
    ].filter(Boolean);

    let best = 0;
    for (const el of candidates) {
      try {
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const rect = el.getBoundingClientRect();
        const h = rect && Number.isFinite(rect.height) ? rect.height : 0;
        if (h > best) best = h;
      } catch (_) {}
    }

    const rounded = Math.round(best);
    if (rounded >= 40 && rounded <= 96) return rounded;
    return 0;
  }

  function cmmCssLength(v, fallback) {
    const s = String(v || '').trim();
    if (!s || s === 'normal' || s === 'auto') return fallback || '';
    return s;
  }

  function cmmSetVar(el, name, value) {
    if (!el || !el.style || !name || value == null || value === '') return;
    try { el.style.setProperty(name, String(value)); } catch (_) {}
  }

  function cmmSyncEntryButtonStyle(btn) {
    const targetBtn = btn || document.getElementById(TOGGLE_ID);
    if (!targetBtn || !targetBtn.style) return;

    const sourceBtn = cmmPrimaryCourseSearchButton();
    const h = cmmMeasureCourseSearchHeight();
    if (h) {
      cmmSetVar(targetBtn, '--cmm-entry-height', `${h}px`);
      targetBtn.style.height = `${h}px`;
      targetBtn.style.minHeight = `${h}px`;
    }

    if (!sourceBtn || sourceBtn === targetBtn) return;

    try {
      const cs = window.getComputedStyle(sourceBtn);
      const rect = sourceBtn.getBoundingClientRect();
      const sh = rect && Number.isFinite(rect.height) ? Math.round(rect.height) : h;
      if (sh >= 40 && sh <= 96) {
        cmmSetVar(targetBtn, '--cmm-entry-height', `${sh}px`);
        targetBtn.style.height = `${sh}px`;
        targetBtn.style.minHeight = `${sh}px`;
      }

      // Copy only geometry + typography + text/icon colour from the real course-search button.
      // Keep the diagnostic button's own background and border colours distinct.
      cmmSetVar(targetBtn, '--cmm-entry-font-family', cs.fontFamily || 'inherit');
      cmmSetVar(targetBtn, '--cmm-entry-font-size', cs.fontSize || 'inherit');
      cmmSetVar(targetBtn, '--cmm-entry-font-weight', cs.fontWeight || 'inherit');
      cmmSetVar(targetBtn, '--cmm-entry-font-style', cs.fontStyle || 'normal');
      cmmSetVar(targetBtn, '--cmm-entry-line-height', cmmCssLength(cs.lineHeight, 'normal'));
      cmmSetVar(targetBtn, '--cmm-entry-letter-spacing', cmmCssLength(cs.letterSpacing, 'normal'));
      cmmSetVar(targetBtn, '--cmm-entry-text-transform', cs.textTransform || 'none');
      const isSlate = !!(
        document.documentElement.matches('[data-md-color-scheme="slate"]') ||
        document.body.matches('[data-md-color-scheme="slate"]')
      );
      const entryTextColor = isSlate ? 'rgba(255,255,255,.96)' : '#111827';
      cmmSetVar(targetBtn, '--cmm-entry-text-color', entryTextColor);
      targetBtn.style.color = entryTextColor;

      const pt = cmmCssLength(cs.paddingTop, '0px');
      const pr = cmmCssLength(cs.paddingRight, '0px');
      const pb = cmmCssLength(cs.paddingBottom, '0px');
      const pl = cmmCssLength(cs.paddingLeft, '0px');
      if (pt && pr && pb && pl) cmmSetVar(targetBtn, '--cmm-entry-padding', `${pt} ${pr} ${pb} ${pl}`);

      const rtl = cmmCssLength(cs.borderTopLeftRadius, '16px');
      const rtr = cmmCssLength(cs.borderTopRightRadius, rtl);
      const rbr = cmmCssLength(cs.borderBottomRightRadius, rtr);
      const rbl = cmmCssLength(cs.borderBottomLeftRadius, rtl);
      if (rtl && rtr && rbr && rbl) cmmSetVar(targetBtn, '--cmm-entry-radius', `${rtl} ${rtr} ${rbr} ${rbl}`);

      cmmSetVar(targetBtn, '--cmm-entry-gap', cmmCssLength(cs.columnGap || cs.gap, '.56rem'));

      const srcIcon = q('.fb-cta__ico, svg', sourceBtn);
      if (srcIcon) {
        const ir = srcIcon.getBoundingClientRect();
        const iw = ir && Number.isFinite(ir.width) ? Math.round(ir.width) : 0;
        const ih = ir && Number.isFinite(ir.height) ? Math.round(ir.height) : 0;
        const size = Math.max(iw, ih);
        if (size >= 14 && size <= 34) cmmSetVar(targetBtn, '--cmm-entry-icon-size', `${size}px`);
      }
    } catch (_) {}
  }

  function cmmBindEntryHeightSyncOnce() {
    if (window.__cmmEntryHeightSyncBound) return;
    window.__cmmEntryHeightSyncBound = true;
    const sync = () => {
      cmmSyncEntryButtonStyle(document.getElementById(TOGGLE_ID));
    };
    try { window.addEventListener('resize', sync, { passive: true }); } catch (_) { window.addEventListener('resize', sync); }
    window.addEventListener('pageshow', sync);
    document.addEventListener('DOMContentSwitch', sync);
    window.setTimeout(sync, 80);
    window.setTimeout(sync, 360);
    window.setTimeout(sync, 900);
  }

  function ensureTitleEntry(anchor) {
    const inner = q('article.md-content__inner');
    const h1 = inner ? q(':scope > h1', inner) || q('h1', inner) : null;
    if (!h1) return null;

    let wrap = document.getElementById(`${TOGGLE_ID}-wrap`);
    if (wrap && wrap.parentNode && wrap.parentNode !== h1) wrap.remove();

    if (!h1.classList.contains('cmm-h1-row')) {
      const textHtml = h1.innerHTML;
      h1.classList.add('cmm-h1-row');
      h1.innerHTML = `<span class="cmm-h1-text">${textHtml}</span>`;
    }

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = `${TOGGLE_ID}-wrap`;
      wrap.className = 'cmm-h1-entry-wrap';
      h1.appendChild(wrap);
    }

    let btn = document.getElementById(TOGGLE_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = TOGGLE_ID;
      btn.type = 'button';
      btn.className = 'cmm-h1-entry';
      btn.setAttribute('aria-label', 'Open course diagnostics');
      btn.setAttribute('title', 'Open course diagnostics');
      btn.innerHTML = `<span class="cmm-h1-entry__icon" aria-hidden="true">${mapSvg()}</span><span class="cmm-h1-entry__label">Course diagnostics</span>`;
      wrap.appendChild(btn);
    } else if (btn.parentNode !== wrap) {
      wrap.appendChild(btn);
    }

    btn.setAttribute('aria-expanded', state.open ? 'true' : 'false');
    cmmBindEntryHeightSyncOnce();
    cmmSyncEntryButtonStyle(btn);
    window.setTimeout(() => cmmSyncEntryButtonStyle(btn), 60);
    window.setTimeout(() => cmmSyncEntryButtonStyle(btn), 360);
    if (btn.dataset.cmmBound !== '1') {
      btn.dataset.cmmBound = '1';
      btn.addEventListener('click', () => {
        if (state.open) setModalOpen(false, anchor, btn);
        else setModalOpen(true, anchor, btn);
      });
    }

    state.button = btn;
    return btn;
  }

  function buildConceptRow(concept) {
    const rec = concept.record;
    const cls = levelClass(rec);
    const href = absoluteHref(concept.location);
    const metaBits = [];
    metaBits.push(recencyLabel(concept.lastActivity));
    if (rec && rec.visited && concept.pct != null) metaBits.push(`${levelLabel(rec)}`);
    else if (!rec || !rec.visited) metaBits.push('Not opened yet');
    return `
      <div class="cmm-concept">
        <span class="cmm-dot ${cls}" aria-hidden="true"></span>
        <div class="cmm-concept__main">
          <a class="cmm-concept__title" href="${escapeHtml(href)}">${escapeHtml(concept.title)}</a>
          <div class="cmm-concept__meta">${escapeHtml(metaBits.join(' · '))}</div>
        </div>
        <span class="cmm-state ${cls}">${escapeHtml(levelLabel(rec))}</span>
      </div>
    `;
  }

  function buildLectureCard(lecture) {
    const filtered = lecture.concepts.filter(matchesFilters);
    const lectureKey = String(lecture.lectureNum);
    const isOpen = state.expandedLecture.has(lectureKey);
    const tone = lectureHeatTone(lecture);
    const readinessAvg = Math.max(0, Math.min(100, safeNum(lecture && lecture.readinessAvg)));
    const counts = lectureStatusCounts(lecture);
    const totalConcepts = Math.max(0, safeNum(counts.total) || safeNum(lecture && lecture.total));
    const unvisited = Math.max(0, safeNum(counts.notVisited));
    const visitedUnrated = Math.max(0, safeNum(counts.visitedOnly));
    const lowRated = Math.max(0, safeNum(counts.unknown) + safeNum(counts.fuzzy));
    // Keep this row readable: the expanded list already shows visited-but-unrated concepts,
    // so the compact lecture header only keeps the highest-signal chips.
    const facts = [
      `${totalConcepts} concepts`,
      `${unvisited} unvisited`,
      `${lowRated} low-rated`,
    ];
    return `
      <section class="cmm-lecture ${tone} ${isOpen ? 'is-open' : ''}" data-lecture="${lectureKey}">
        <button type="button" class="cmm-lecture__btn" data-cmm-lecture-toggle="${lectureKey}" aria-expanded="${isOpen ? 'true' : 'false'}">
          <div class="cmm-lecture__left">
            <div class="cmm-lecture__title">${escapeHtml(lecture.label)}</div>
          </div>
          <div class="cmm-lecture__facts" aria-label="${escapeHtml(`${lecture.label} status summary`)}">
            ${facts.map((text) => `<span class="cmm-lecture__fact">${escapeHtml(text)}</span>`).join('')}
          </div>
          <span class="cmm-lecture__score" style="${escapeHtml(readinessToneStyle(readinessAvg))}" title="${escapeHtml(`${lecture.label} · Mastery readiness ${readinessAvg}%`)}"><span class="cmm-lecture__scorelabel">Mastery readiness</span><strong>${escapeHtml(String(readinessAvg))}%</strong></span>
          <span class="cmm-lecture__chev" aria-hidden="true">${chevronSvg()}</span>
        </button>
        <div class="cmm-lecture__body" ${isOpen ? '' : 'hidden'}>
          ${filtered.length ? filtered.map(buildConceptRow).join('') : '<div class="cmm-lecture__empty">Nothing matches the current filters in this learning unit.</div>'}
        </div>
      </section>
    `;
  }


  function rememberDialogScroll(panel) {
    const dialog = panel && panel.closest ? panel.closest('.cmm-modal__dialog') : null;
    state.preservedScrollTop = dialog ? dialog.scrollTop : null;
  }

  function restoreDialogScroll(panel) {
    if (state.scrollToLecture || state.scrollToFocus) return;
    if (state.preservedScrollTop == null) return;
    const dialog = panel && panel.closest ? panel.closest('.cmm-modal__dialog') : null;
    const top = state.preservedScrollTop;
    state.preservedScrollTop = null;
    if (!dialog) return;
    window.requestAnimationFrame(() => {
      try { dialog.scrollTop = top; } catch (_) {}
    });
  }

  function renderPanelShell(panel) {
    panel.innerHTML = `
      ${buildCourseDiagnosticHead(null)}
      <div class="cmm-body">
        <div class="cmm-loading">Loading course map…</div>
      </div>
    `;
  }

  async function renderMap(anchor, panel) {
    if (!anchor || !panel) return;
    const seq = ++state.seq;
    ensureStyles();
    renderPanelShell(panel);
    panel.hidden = !state.open;

    try {
      const data = await loadCourseMapData(anchor);
      if (seq !== state.seq) return;
      const summary = data.summary;
      const totals = summary.totals;
      const diagnosis = buildDiagnosis(summary);
      diagnosis.dailyHistory = cmmRecordDailySnapshot(data.key, summary, diagnosis);
      const selected = ensureSelectedConcept(summary, diagnosis);

      const allLecturesHtml = (summary.lectures || []).map(buildLectureCard).join('');
      const panelBody = `
        <div class="cmm-toprow">
          <div class="cmm-metrics">
            ${metricValueCard('Visited concepts', `${totals.visited}/${totals.total}`, `${Math.round(totals.total ? (totals.visited / totals.total) * 100 : 0)}% visited`)}
            ${metricValueCard('Rated concepts', `${totals.rated}/${totals.total}`, `${totals.total - totals.rated} unrated`)}
          </div>
          ${buildSelectedConceptCard(selected)}
        </div>
        ${buildVisualStage(summary, diagnosis, selected)}
        <div class="cmm-filters">
          <button type="button" class="cmm-filter ${state.filters.weak ? 'is-on' : ''}" data-cmm-filter="weak">Low mastery readiness</button>
          <button type="button" class="cmm-filter ${state.filters.unvisited ? 'is-on' : ''}" data-cmm-filter="unvisited">Unvisited</button>
        </div>
        <div class="cmm-lectures">${allLecturesHtml || '<div class="cmm-error">No concept pages were found for this course yet.</div>'}</div>
      `;
      panel.innerHTML = `
        ${buildCourseDiagnosticHead(diagnosis.courseReadinessAvg)}
        <div class="cmm-body">${panelBody}</div>
      `;
      syncSelectedPrereqReadiness(panel, selected);

      if (panel.dataset.cmmBound !== '1') {
        panel.dataset.cmmBound = '1';
        panel.addEventListener('click', (e) => {
          const readinessInfo = e.target && e.target.closest ? e.target.closest('[data-cmm-course-readiness-info]') : null;
          if (readinessInfo) {
            e.preventDefault();
            e.stopPropagation();
            const wrap = readinessInfo.closest('.cmm-headreadiness-wrap');
            const help = wrap && wrap.querySelector ? wrap.querySelector('.cmm-readiness-help') : null;
            if (help) {
              if (help.hasAttribute('hidden')) help.removeAttribute('hidden');
              else help.setAttribute('hidden', '');
            }
            return;
          }
          if (e.target && e.target.closest && !e.target.closest('.cmm-headreadiness-wrap')) {
            panel.querySelectorAll('.cmm-readiness-help').forEach((el) => el.setAttribute('hidden', ''));
          }
          const toggle = e.target && e.target.closest ? e.target.closest('[data-cmm-lecture-toggle]') : null;
          if (toggle) {
            e.preventDefault();
            e.stopPropagation();
            const id = String(toggle.getAttribute('data-cmm-lecture-toggle') || '');
            rememberDialogScroll(panel);
            if (state.expandedLecture.has(id)) state.expandedLecture.delete(id);
            else state.expandedLecture.add(id);
            renderMap(anchor, panel);
            return;
          }
          const filterBtn = e.target && e.target.closest ? e.target.closest('[data-cmm-filter]') : null;
          if (filterBtn) {
            e.preventDefault();
            e.stopPropagation();
            const key = filterBtn.getAttribute('data-cmm-filter');
            if (key === 'weak' || key === 'unvisited') {
              rememberDialogScroll(panel);
              state.filters[key] = !state.filters[key];
              renderMap(anchor, panel);
            }
            return;
          }
          const conceptBtn = e.target && e.target.closest ? e.target.closest('[data-cmm-select-concept]') : null;
          if (conceptBtn) {
            e.preventDefault();
            e.stopPropagation();
            if (cmmIsTouchLikeViewport()) {
              state.preservedScrollTop = null;
              state.scrollToFocus = true;
            } else {
              rememberDialogScroll(panel);
            }
            state.selectedConceptLoc = String(conceptBtn.getAttribute('data-cmm-select-concept') || '');
            renderMap(anchor, panel);
            return;
          }
          const jumpLecture = e.target && e.target.closest ? e.target.closest('[data-cmm-jump-lecture]') : null;
          if (jumpLecture) {
            e.preventDefault();
            e.stopPropagation();
            const id = String(jumpLecture.getAttribute('data-cmm-jump-lecture') || '');
            if (id) {
              rememberDialogScroll(panel);
              state.expandedLecture.add(id);
              state.scrollToLecture = id;
              renderMap(anchor, panel);
            }
            return;
          }
        });
      }

      restoreDialogScroll(panel);

      if (state.scrollToFocus) {
        state.scrollToFocus = false;
        const target = q('.cmm-focuscard', panel);
        if (target && typeof target.scrollIntoView === 'function') {
          window.setTimeout(() => {
            try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            catch (_) { try { target.scrollIntoView(); } catch (__) {} }
          }, 36);
        }
      }

      if (state.scrollToLecture) {
        const target = q(`.cmm-lecture[data-lecture="${state.scrollToLecture}"]`, panel);
        state.scrollToLecture = '';
        if (target && typeof target.scrollIntoView === 'function') {
          window.setTimeout(() => {
            try { target.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (_) { try { target.scrollIntoView(); } catch (__) {} }
          }, 24);
        }
      }

      try { window.MathJax && window.MathJax.typesetPromise && window.MathJax.typesetPromise([panel]).catch(() => {}); } catch (_) {}
    } catch (_) {
      if (seq !== state.seq) return;
      panel.innerHTML = `
        <div class="cmm-head">
          <div class="cmm-title" id="${PANEL_ID}-title">Course diagnostics</div>
          <div class="cmm-sub">The panel could not be built right now.</div>
        </div>
        <div class="cmm-body"><div class="cmm-error">Failed to load course data.</div></div>
      `;
    }
  }

  function mount(preserveOpen) {
    preserveOpen = preserveOpen === true;
    const anchor = q('[data-course-mastery-map]');
    if (!anchor) return;
    ensureStyles();

    state.anchor = anchor;
    const btn = ensureTitleEntry(anchor);
    const { modal, panel } = ensureModal(anchor);

    if (!preserveOpen) {
      state.open = false;
      state.expandedLecture.clear();
    }

    modal.hidden = !state.open;
    document.documentElement.classList.toggle('cmm-modal-open', state.open);
    document.body.classList.toggle('cmm-modal-open', state.open);
    if (btn) btn.setAttribute('aria-expanded', state.open ? 'true' : 'false');

    if (!panel.innerHTML) renderPanelShell(panel);
    if (state.open) renderMap(anchor, panel);
  }

  function scheduleRefresh() {
    window.clearTimeout(state.refreshTimer);
    state.refreshTimer = window.setTimeout(() => {
      state.data = null;
      state.prereqReadySeq += 1;
      state.prereqReadyCache = new Map();
      mount(true);
    }, 80);
  }

  window.MkCourseMasteryMap = {
    refresh: scheduleRefresh,
    mount,
  };

  function mountPreservingOpen() {
    mount(state.open === true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPreservingOpen, { once: true });
  } else {
    mount();
  }
  document.addEventListener('DOMContentSwitch', mountPreservingOpen);
  window.addEventListener('pageshow', mountPreservingOpen);
  // Avoid full-panel refresh after background account/mastery sync.
  // The diagnosis is rendered once on open; refresh by reopening the panel or calling MkCourseMasteryMap.refresh().
})();
