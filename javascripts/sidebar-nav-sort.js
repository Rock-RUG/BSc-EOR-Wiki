(function () {
  "use strict";

  const BUILD = "mk-sidebar-sort-rebuild-v101-dark-theme-sidebar-floor";
  if (window.__mkSidebarNavSortBuild === BUILD) {
    try {
      if (window.MkSidebarNavSort && typeof window.MkSidebarNavSort.refresh === "function") {
        window.MkSidebarNavSort.refresh();
      }
    } catch (_) {}
    return;
  }
  window.__mkSidebarNavSortBuild = BUILD;

  const IDS = {
    control: "mk-sidebar-sortdock",
    style: "mk-sidebar-sort-rebuild-style-v101-dark-theme-sidebar-floor",
    debugStyle: "mk-sidebar-sort-rebuild-debug-style"
  };

  const STORAGE_KEYS = {
    courseMode: "mk_sidebar_sort_mode_course_v5",
    yearMode: "mk_sidebar_sort_mode_year_v3",
    groupOpen: "mk_sidebar_group_open_v1",
    currentScopeOpen: "mk_sidebar_current_scope_open_v1",
    globalYearOpen: "mk_sidebar_global_year_open_v1"
  };

  const ATTR = {
    injected: "data-msb-injected",
    group: "data-msb-group",
    groupKind: "data-msb-group-kind",
    groupOpen: "data-msb-group-open",
    groupCollapsedItem: "data-msb-group-collapsed-item",
    groupCollapsedLead: "data-msb-group-collapsed-lead",
    duplicateCurrent: "data-msb-dup-current",
    courseKey: "data-msb-course-key",
    baseIndex: "data-msb-base-index",
    sortKind: "data-msb-sort-kind",
    sortMode: "data-msb-sort-mode",
    scopeCollapsed: "data-msb-scope-collapsed",
    syntheticGroup: "data-msb-synthetic-group"
  };

  const CLS = {
    head: "msb-group-head",
    headLecture: "msb-group-head--lecture",
    headBlock: "msb-group-head--block",
    headRow: "msb-group-head__row",
    headText: "msb-group-head__text",
    headBtn: "msb-group-head__btn",
    headChevron: "msb-group-head__chevron",
    lead: "msb-group-lead",
    first: "msb-group-first",
    mid: "msb-group-mid",
    last: "msb-group-last",
    single: "msb-group-single",
    hover: "msb-group-hover",
    dock: "msb-sortdock",
    dockBox: "msb-sortdock__box",
    dockLabel: "msb-sortdock__label",
    dockButton: "msb-sortdock__btn"
  };

  const MODE = {
    COURSE_LECTURE: "lecture",
    YEAR_BLOCK: "block",
    ALPHA: "alpha"
  };

    installFooterAwareSidebarSpacePatchV2();

    function installFooterAwareSidebarSpacePatchV2() {
      const BUILD = "mk-footer-aware-sidebar-space-v2-footer-overlay-no-lag";
      if (window.__mkFooterAwareSidebarSpacePatch === BUILD) {
        try {
          if (window.MkFooterAwareSidebars && typeof window.MkFooterAwareSidebars.refresh === "function") {
            window.MkFooterAwareSidebars.refresh();
          }
        } catch (_) {}
        return;
      }
      window.__mkFooterAwareSidebarSpacePatch = BUILD;

      const STYLE_ID = "mk-footer-aware-sidebar-space-style-v2";
      let raf = 0;
      let mo = null;
      let mobileCleared = false;

      function isDesktopLayout() {
        try {
          return !!(window.matchMedia && window.matchMedia("(min-width: 901px)").matches);
        } catch (_) {
          return (Number(window.innerWidth) || 0) >= 901;
        }
      }

      function viewportHeight() {
        return Math.max(0, Number(window.innerHeight) || Number(document.documentElement.clientHeight) || 0);
      }

      function visibleFooterTop(vh) {
        let top = Infinity;
        try {
          Array.prototype.slice.call(document.querySelectorAll(".md-footer, footer")).forEach(function (footer) {
            if (!(footer instanceof HTMLElement)) return;
            const cs = window.getComputedStyle(footer);
            if (cs.display === "none" || cs.visibility === "hidden") return;
            const rect = footer.getBoundingClientRect();
            if (!rect || rect.height <= 0 || rect.bottom <= 0 || rect.top > vh) return;
            top = Math.min(top, rect.top);
          });
        } catch (_) {}
        return Number.isFinite(top) ? Math.max(0, Math.ceil(top)) : null;
      }

      function footerGap(vh) {
        const top = visibleFooterTop(vh);
        if (top === null) return 0;
        // Exact clip at the footer top.  No extra 8px safety gap: the footer itself
        // is promoted above the sidebars, so there is no visible one-frame overlap.
        return Math.max(0, Math.ceil(vh - top));
      }

      function asArray(list) {
        return Array.prototype.slice.call(list || []);
      }

      function uniqueElements(list) {
        const out = [];
        const seen = new WeakSet();
        list.forEach(function (el) {
          if (!(el instanceof HTMLElement) || seen.has(el)) return;
          seen.add(el);
          out.push(el);
        });
        return out;
      }

      function managedSidebarElements() {
        return uniqueElements([
          document.querySelector(".md-sidebar--primary"),
          document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap"),
          document.querySelector(".md-sidebar--primary .md-sidebar__inner")
        ].concat(
          asArray(document.querySelectorAll(".md-sidebar--secondary.lp-secondary-host-active, .lp-secondary-fallback")),
          asArray(document.querySelectorAll(".md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap, .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner, .lp-secondary-fallback .md-sidebar__scrollwrap, .lp-secondary-fallback .md-sidebar__inner"))
        ));
      }

      function removeOldStyles() {
        [
          "mk-footer-aware-sidebar-space-style-v1",
          "mk-footer-aware-sidebar-space-style-v2"
        ].forEach(function (id) {
          const old = document.getElementById(id);
          if (old && old.id !== STYLE_ID && old.parentNode) old.parentNode.removeChild(old);
        });
      }

      function ensureStyles() {
        removeOldStyles();
        const existing = document.getElementById(STYLE_ID);
        if (existing) {
          try { (document.head || document.documentElement).appendChild(existing); } catch (_) {}
          return;
        }
        const st = document.createElement("style");
        st.id = STYLE_ID;
        st.textContent = `
  @media (min-width: 901px){
    html.mk-footer-aware-sidebars .md-sidebar--primary,
    html.mk-footer-aware-sidebars .md-sidebar--secondary.lp-secondary-host-active,
    html.mk-footer-aware-sidebars .lp-secondary-fallback{
      margin-bottom:0 !important;
      padding-bottom:0 !important;
      box-sizing:border-box !important;
      max-height:var(--mk-footer-aware-sidebar-h, none) !important;
      z-index:20 !important;
    }
    html.mk-footer-aware-sidebars .md-sidebar--primary .md-sidebar__scrollwrap,
    html.mk-footer-aware-sidebars .md-sidebar--primary .md-sidebar__inner,
    html.mk-footer-aware-sidebars .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap,
    html.mk-footer-aware-sidebars .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__inner,
    html.mk-footer-aware-sidebars .lp-secondary-fallback .md-sidebar__scrollwrap,
    html.mk-footer-aware-sidebars .lp-secondary-fallback .md-sidebar__inner{
      height:var(--mk-footer-aware-sidebar-h, auto) !important;
      max-height:var(--mk-footer-aware-sidebar-h, none) !important;
      margin-bottom:0 !important;
      padding-bottom:0 !important;
      box-sizing:border-box !important;
    }
    html.mk-footer-aware-sidebars .md-sidebar--primary .md-sidebar__scrollwrap,
    html.mk-footer-aware-sidebars .md-sidebar--secondary.lp-secondary-host-active .md-sidebar__scrollwrap,
    html.mk-footer-aware-sidebars .lp-secondary-fallback .md-sidebar__scrollwrap,
    html.mk-footer-aware-sidebars .lp-secondary-fallback .md-sidebar__inner{
      overflow:auto !important;
    }
    html.mk-footer-aware-sidebars.mk-footer-offscreen-sidebars #lp-side-panel{
      margin-bottom:0 !important;
    }

    /* No-lag footer clip:
       async/composited scrolling can paint one frame before JS recalculates the
       sidebar height.  Put the real footer above the sidebar layer so the footer
       masks that frame immediately instead of letting the sidebar flash over it. */
    html.mk-footer-aware-sidebars .md-footer,
    html.mk-footer-aware-sidebars footer.md-footer,
    html.mk-footer-aware-sidebars body > footer{
      position:relative !important;
      z-index:90 !important;
      isolation:isolate !important;
    }
    html.mk-footer-aware-sidebars #msb-desktop-scrollbar{
      z-index:35 !important;
    }
  }
  `;
        (document.head || document.documentElement).appendChild(st);
      }

      function clearManagedStyles() {
        document.documentElement.classList.remove("mk-footer-aware-sidebars", "mk-footer-offscreen-sidebars");
        managedSidebarElements().forEach(function (el) {
          el.style.removeProperty("--mk-footer-aware-sidebar-h");
          el.style.removeProperty("--mk-footer-aware-sidebar-bottom-gap");
        });
      }

      function clearManagedStylesOnce() {
        if (mobileCleared) return;
        clearManagedStyles();
        mobileCleared = true;
      }

      function apply() {
        raf = 0;
        ensureStyles();
        if (!isDesktopLayout()) {
          clearManagedStylesOnce();
          return;
        }
        mobileCleared = false;

        const html = document.documentElement;
        const vh = viewportHeight();
        if (vh <= 0) return;
        const gap = footerGap(vh);
        const footerOffscreen = gap <= 0;

        html.classList.add("mk-footer-aware-sidebars");
        html.classList.toggle("mk-footer-offscreen-sidebars", footerOffscreen);

        managedSidebarElements().forEach(function (el) {
          const rect = el.getBoundingClientRect();
          if (!rect || rect.width <= 0 || rect.height <= 0) return;
          const top = Math.max(0, Math.ceil(rect.top));
          const rawH = Math.floor(vh - gap - top);
          const h = footerOffscreen ? Math.max(80, rawH) : Math.max(24, rawH);
          el.style.setProperty("--mk-footer-aware-sidebar-h", String(h) + "px");
          el.style.setProperty("--mk-footer-aware-sidebar-bottom-gap", String(gap) + "px");
        });
      }

      function schedule() {
        if (!isDesktopLayout()) {
          if (raf) {
            try { window.cancelAnimationFrame(raf); } catch (_) {}
            raf = 0;
          }
          clearManagedStylesOnce();
          return;
        }
        if (raf) return;
        raf = window.requestAnimationFrame(apply);
      }

      function applyNow() {
        if (!isDesktopLayout()) {
          if (raf) {
            try { window.cancelAnimationFrame(raf); } catch (_) {}
            raf = 0;
          }
          clearManagedStylesOnce();
          return;
        }
        if (raf) {
          try { window.cancelAnimationFrame(raf); } catch (_) {}
          raf = 0;
        }
        apply();
      }

      function bindDesktopObserver() {
        if (mo) return;
        try {
          mo = new MutationObserver(schedule);
          mo.observe(document.documentElement, { childList: true, subtree: true });
        } catch (_) {
          mo = null;
        }
      }

      function unbindDesktopObserver() {
        if (!mo) return;
        try { mo.disconnect(); } catch (_) {}
        mo = null;
      }

      function syncDesktopMode() {
        if (!isDesktopLayout()) {
          unbindDesktopObserver();
          if (raf) {
            try { window.cancelAnimationFrame(raf); } catch (_) {}
            raf = 0;
          }
          clearManagedStylesOnce();
          return;
        }
        bindDesktopObserver();
        mobileCleared = false;
        schedule();
      }

      window.MkFooterAwareSidebars = {
        refresh: syncDesktopMode,
        apply: apply,
        applyNow: applyNow
      };

      // Scroll must be synchronous here.  RAF is enough for resize/mutations, but
      // it can leave one visible frame where the sticky sidebar sits over the footer.
      window.addEventListener("scroll", applyNow, { passive: true, capture: true });

      ["resize", "orientationchange", "pageshow", "load"].forEach(function (name) {
        window.addEventListener(name, syncDesktopMode, { passive: true });
      });
      document.addEventListener("DOMContentLoaded", syncDesktopMode, { once: true });
      document.addEventListener("DOMContentSwitch", syncDesktopMode);

      syncDesktopMode();
      window.setTimeout(syncDesktopMode, 120);
      window.setTimeout(syncDesktopMode, 420);
    }

  const MOBILE_AUTO_CENTERING = true;

  function isTouchLikeViewport() {
    try {
      return !!(window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches);
    } catch (_) {
      return false;
    }
  }

  const runtime = {
    navSeq: 0,
    applyTimer: 0,
    resizeTimer: 0,
    currentPageKey: "",
    hoverBindings: new WeakSet(),
    memMode: Object.create(null),
    groupMemory: Object.create(null),
    scopeList: null,
    touchCleanupBindings: new WeakSet(),
    currentToggleBindings: new WeakMap(),
    coursePickerBound: false,
    courseMenuScrollbar: {
      root: null,
      thumb: null,
      menu: null,
      bound: false,
      dragging: false,
      dragStartY: 0,
      dragStartScrollTop: 0,
      raf: 0,
      hotTimer: 0
    },
    desktopScrollbar: {
      root: null,
      thumb: null,
      bound: false,
      dragging: false,
      dragStartY: 0,
      dragStartScrollTop: 0,
      scrollWrap: null,
      raf: 0,
      windowBound: false
    },
    mobileDrawerShieldTimer: 0,
    mobileDrawerGlobalSuppressBound: false,
    mobileDrawerSuppressUntil: 0,
    courseUnitTypeByKey: Object.create(null)
  };

  function html() {
    return document.documentElement;
  }

  function asArray(list) {
    return Array.prototype.slice.call(list || []);
  }

  function isElement(node) {
    return !!node && node.nodeType === 1;
  }

  function siteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]') ||
      document.querySelector('script[src*="assets/javascripts"]');

    const attr = script ? script.getAttribute("src") : (link ? (link.getAttribute("href") || link.getAttribute("src")) : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);
    const pathname = assetUrl.pathname || "/";
    const idx = pathname.indexOf("/assets/");
    if (idx >= 0) {
      return assetUrl.origin + pathname.slice(0, idx + 1);
    }

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function relPathFromSiteRoot(absPathname) {
    const siteRoot = new URL(siteRootUrl());
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : siteRoot.pathname + "/";
    let p = String(absPathname || window.location.pathname || "");
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    return p.replace(/^\/+/, "").replace(/\/+$/, "");
  }

  function currentRelPath() {
    return relPathFromSiteRoot(window.location.pathname || "");
  }

  function normaliseHrefToRel(href) {
    if (!href) return "";
    try {
      const url = new URL(href, document.baseURI);
      return relPathFromSiteRoot(url.pathname || "");
    } catch (_) {
      return "";
    }
  }

  function absoluteSiteHref(rel) {
    const clean = String(rel || "").replace(/^\/+/, "");
    if (!clean) return "";
    try {
      return new URL(clean, siteRootUrl()).toString();
    } catch (_) {
      return clean;
    }
  }

  function splitSegments(rel) {
    return String(rel || "").split("/").filter(Boolean);
  }

  function cleanTitle(text) {
    return String(text || "")
      .replace(/\s*¶\s*$/u, "")
      .replace(/\u00B6/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function safePath(loc) {
    return String(loc || "").split("#")[0].replace(/^\/+/, "").trim();
  }

  function asStringList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === "string") return [value];
    return [];
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function cssEscape(value) {
    const text = String(value || "");
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(text);
    return text.replace(/[^a-zA-Z0-9_-]/g, function (ch) {
      return "\\" + ch;
    });
  }

  function defaultMode(kind) {
    return kind === "year" ? MODE.YEAR_BLOCK : MODE.COURSE_LECTURE;
  }

  function readLocal(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : raw;
    } catch (_) {
      return Object.prototype.hasOwnProperty.call(runtime.memMode, key) ? runtime.memMode[key] : fallback;
    }
  }

  function writeLocal(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      runtime.memMode[key] = value;
    }
  }

  function readSessionObject(key) {
    try {
      const raw = sessionStorage.getItem(key);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === "object" ? obj : {};
    } catch (_) {
      return runtime.groupMemory[key] && typeof runtime.groupMemory[key] === "object"
        ? runtime.groupMemory[key]
        : {};
    }
  }

  function writeSessionObject(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value || {}));
    } catch (_) {
      runtime.groupMemory[key] = value || {};
    }
  }

  function readMode(kind) {
    const key = kind === "year" ? STORAGE_KEYS.yearMode : STORAGE_KEYS.courseMode;
    const raw = readLocal(key, defaultMode(kind));
    if (kind === "year") return raw === MODE.ALPHA ? MODE.ALPHA : MODE.YEAR_BLOCK;
    return raw === MODE.ALPHA ? MODE.ALPHA : MODE.COURSE_LECTURE;
  }

  function writeMode(kind, mode) {
    const key = kind === "year" ? STORAGE_KEYS.yearMode : STORAGE_KEYS.courseMode;
    if (kind === "year") {
      writeLocal(key, mode === MODE.ALPHA ? MODE.ALPHA : MODE.YEAR_BLOCK);
      return;
    }
    writeLocal(key, mode === MODE.ALPHA ? MODE.ALPHA : MODE.COURSE_LECTURE);
  }

  function nextMode(kind, mode) {
    if (kind === "year") return mode === MODE.YEAR_BLOCK ? MODE.ALPHA : MODE.YEAR_BLOCK;
    return mode === MODE.COURSE_LECTURE ? MODE.ALPHA : MODE.COURSE_LECTURE;
  }

  function unitNounFromType(type) {
    return String(type || "lecture").toLowerCase() === "week" ? "Week" : "Lecture";
  }

  function unitGroupPrefix(type) {
    return String(type || "lecture").toLowerCase() === "week" ? "W" : "L";
  }

  function unitTypeFromGroupId(groupId) {
    return /^W/i.test(String(groupId || "")) ? "week" : "lecture";
  }

  function courseKeyFromScope(scope) {
    return scope && scope.yearSeg && scope.courseSeg ? scope.yearSeg + "/" + scope.courseSeg : "";
  }

  function unitTypeForScope(scope) {
    const key = courseKeyFromScope(scope);
    return key && runtime.courseUnitTypeByKey[key] ? runtime.courseUnitTypeByKey[key] : "lecture";
  }

  function modeLabel(kind, mode) {
    if (mode === MODE.ALPHA) return "A–Z";
    if (kind === "year") return "Block";
    return unitNounFromType(unitTypeForScope(inferScope()));
  }

  function modeTitle(kind, mode) {
    if (kind === "year") {
      return mode === MODE.ALPHA
        ? "Sidebar is currently sorted alphabetically"
        : "Sidebar is currently sorted by teaching block";
    }
    return mode === MODE.ALPHA
      ? "Sidebar is currently sorted alphabetically"
      : "Sidebar is currently sorted by " + unitNounFromType(unitTypeForScope(inferScope())).toLowerCase();
  }


  function normaliseUtilityRel(rel) {
    let r = String(rel || currentRelPath() || "")
      .split("#")[0]
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .trim();
    r = r.replace(/\/index\.html?$/i, "");
    if (/^index\.html?$/i.test(r)) r = "";
    return r;
  }

  function globalPageKindForRel(rel) {
    const r = normaliseUtilityRel(rel);
    if (!r) return "home";
    const segs = splitSegments(r);
    if (!segs.length) return "home";
    const first = String(segs[0] || "").replace(/\.html?$/i, "").toLowerCase();
    const single = segs.length === 1;

    // Utility pages are site-level pages, not Year/Course scopes. Keep this
    // explicit so pages like /find/ never fall through to the scoped concept
    // drawer fallback.
    if (single && (first === "find" || first === "search" || first === "concept-search")) return "find";
    if (single && (first === "trending" || first === "popular")) return "trending";
    if (single && (first === "random" || first === "practice" || first === "self-test" || first === "selftest" || first === "custom-random" || first === "random-practice")) return "random";
    if (single && (first === "about" || first === "help" || first === "privacy" || first === "terms" || first === "contact" || first === "404")) return "global";
    return "";
  }

  function isGlobalDrawerScope(scope) {
    if (!scope || !scope.kind) return true;
    return !!globalPageKindForRel(scope.relPath || currentRelPath());
  }

  function globalDrawerTitle(kind) {
    if (kind === "find") return "Find concepts";
    if (kind === "trending") return "Trending";
    if (kind === "random") return "Random practice";
    if (kind === "home") return "BSc EOR Wiki";
    return "Site navigation";
  }

  function globalDrawerSubtitle(kind) {
    if (kind === "find") return "Search first, then jump to a year or course.";
    if (kind === "trending") return "See what is active, or browse the course tree.";
    if (kind === "random") return "Start practice, then return to any course quickly.";
    if (kind === "home") return "Browse the wiki without entering one course scope.";
    return "Use the main entry points below.";
  }

  function findExistingHref(relCandidates, textCandidates) {
    const rels = asArray(relCandidates).map(function (rel) {
      return String(rel || "").replace(/^\/+/, "").replace(/\/+$/, "");
    });
    const texts = asArray(textCandidates).map(function (text) {
      return cleanTitle(text).toLowerCase();
    }).filter(Boolean);

    const links = asArray(document.querySelectorAll('a[href], .md-nav__link[href], .md-tabs__link[href], .md-header__link[href]'));
    for (let i = 0; i < links.length; i += 1) {
      const href = links[i].getAttribute ? (links[i].getAttribute('href') || '') : '';
      const rel = normaliseHrefToRel(href).replace(/\/+$/, "");
      if (!rel && rels.indexOf("") >= 0) return links[i].href || href || siteRootUrl();
      for (let j = 0; j < rels.length; j += 1) {
        if (sameLogicalRel(rel, rels[j])) return links[i].href || href || absoluteSiteHref(rels[j]);
      }
    }

    if (texts.length) {
      for (let i = 0; i < links.length; i += 1) {
        const text = cleanTitle(links[i].textContent || '').toLowerCase();
        if (!text) continue;
        for (let j = 0; j < texts.length; j += 1) {
          if (text === texts[j] || text.indexOf(texts[j]) >= 0 || texts[j].indexOf(text) >= 0) {
            const href = links[i].getAttribute ? (links[i].getAttribute('href') || '') : '';
            return links[i].href || href || "";
          }
        }
      }
    }
    return "";
  }

  function hrefForGlobalRel(rel, textCandidates) {
    const clean = String(rel || "").replace(/^\/+/, "").replace(/\/+$/, "");
    const candidates = clean ? [clean, clean + "/", clean + "/index.html", clean + ".html"] : ["", "index.html"];
    const found = findExistingHref(candidates, textCandidates || []);
    if (found) return found;
    if (!clean) return siteRootUrl();
    return absoluteSiteHref(clean + "/");
  }

  function makeGlobalDrawerHead(kind) {
    const head = document.createElement('div');
    head.className = 'msb-global-drawer-head';

    const kicker = document.createElement('div');
    kicker.className = 'msb-global-drawer-kicker';
    kicker.textContent = 'BSc EOR Wiki';

    const title = document.createElement('div');
    title.className = 'msb-global-drawer-title';
    title.textContent = globalDrawerTitle(kind);

    const subtitle = document.createElement('div');
    subtitle.className = 'msb-global-drawer-subtitle';
    subtitle.textContent = globalDrawerSubtitle(kind);

    head.appendChild(kicker);
    head.appendChild(title);
    head.appendChild(subtitle);
    return head;
  }

  function addGlobalSectionTitle(list, title) {
    const li = document.createElement('li');
    li.className = 'md-nav__item msb-global-section-title';
    li.textContent = title;
    list.appendChild(li);
    return li;
  }

  function addGlobalLink(list, item, extraClass) {
    const li = document.createElement('li');
    li.className = 'md-nav__item msb-global-link-item' + (extraClass ? (' ' + extraClass) : '');

    const a = document.createElement('a');
    a.className = 'md-nav__link msb-global-link';
    a.href = item.href || hrefForGlobalRel(item.rel || '', [item.title || '']);
    if (item.rel && sameLogicalRel(item.rel, currentRelPath())) a.classList.add('is-current');
    if (!item.rel && globalPageKindForRel(currentRelPath()) === 'home') a.classList.add('is-current');

    const main = document.createElement('span');
    main.className = 'msb-global-link-title';
    main.textContent = item.title || '';
    a.appendChild(main);

    if (item.desc) {
      const desc = document.createElement('span');
      desc.className = 'msb-global-link-desc';
      desc.textContent = item.desc;
      a.appendChild(desc);
    }

    li.appendChild(a);
    list.appendChild(li);
    return li;
  }

  function collectGlobalYearEntries() {
    const yearMap = new Map();
    const courseSeen = new Set();
    const links = asArray(document.querySelectorAll('.md-sidebar--primary a.md-nav__link[href], .md-sidebar--primary .md-nav__link[href], .md-tabs__link[href], .md-header__link[href]'));

    function ensureYear(yearSeg, title, href, order) {
      if (!yearSeg || globalPageKindForRel(yearSeg)) return null;
      if (!yearMap.has(yearSeg)) {
        yearMap.set(yearSeg, {
          yearSeg: yearSeg,
          title: cleanTitle(title) || yearSeg,
          href: href || hrefForGlobalRel(yearSeg, [title || yearSeg]),
          order: Number.isFinite(order) ? order : yearMap.size,
          courses: []
        });
      } else {
        const entry = yearMap.get(yearSeg);
        if (!entry.href && href) entry.href = href;
        if ((!entry.title || entry.title === yearSeg) && cleanTitle(title)) entry.title = cleanTitle(title);
      }
      return yearMap.get(yearSeg);
    }

    links.forEach(function (link, index) {
      const href = link.getAttribute ? (link.getAttribute('href') || '') : '';
      const rel = normaliseHrefToRel(href);
      const segs = splitSegments(rel);
      const title = cleanTitle(link.textContent || '');
      if (!segs.length) return;

      if ((segs.length === 1 && !/\.html?$/i.test(segs[0])) || (segs.length === 2 && /^index\.html?$/i.test(segs[1]))) {
        if (!globalPageKindForRel(rel)) ensureYear(segs[0], title, link.href || href || absoluteSiteHref(segs[0] + '/'), index);
        return;
      }

      const yearSeg = segs[0];
      const courseSeg = courseSegFromRel(rel, yearSeg);
      if (!courseSeg || globalPageKindForRel(yearSeg)) return;
      const yearEntry = ensureYear(yearSeg, '', '', index);
      if (!yearEntry) return;
      const key = yearSeg + '/' + courseSeg;
      if (courseSeen.has(key)) return;
      courseSeen.add(key);
      yearEntry.courses.push({
        yearSeg: yearSeg,
        courseSeg: courseSeg,
        rel: key,
        title: title || courseSeg,
        href: link.href || href || absoluteSiteHref(key + '/'),
        order: index
      });
    });

    const years = Array.from(yearMap.values()).sort(function (a, b) {
      if (a.order !== b.order) return a.order - b.order;
      return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' });
    });
    years.forEach(function (year) {
      year.courses.sort(function (a, b) {
        if (a.order !== b.order) return a.order - b.order;
        return String(a.title || '').localeCompare(String(b.title || ''), undefined, { sensitivity: 'base' });
      });
    });
    return years;
  }

  function looksLikeYearSegment(seg) {
    const s = String(seg || "").replace(/\.html?$/i, "").toLowerCase();
    if (!s || globalPageKindForRel(s)) return false;
    return /^(year|yr|y)[-_ ]?\d+$/i.test(s) || /^\d+(st|nd|rd|th)?[-_ ]?(year)?$/i.test(s) || /^bsc[-_ ]?\d+$/i.test(s);
  }

  function isLikelyYearScopeSegment(seg) {
    if (looksLikeYearSegment(seg)) return true;
    try {
      return !!findYearNode(seg);
    } catch (_) {
      return false;
    }
  }

  function globalYearStorageKey(yearSeg) {
    return String(yearSeg || "").replace(/^\/+/, "").replace(/\/+$/, "").trim();
  }

  function readGlobalYearOpen(yearSeg, fallbackOpen) {
    const key = globalYearStorageKey(yearSeg);
    if (!key) return fallbackOpen !== false;
    const store = readSessionObject(STORAGE_KEYS.globalYearOpen);
    if (Object.prototype.hasOwnProperty.call(store, key)) return !!store[key];
    return fallbackOpen !== false;
  }

  function writeGlobalYearOpen(yearSeg, open) {
    const key = globalYearStorageKey(yearSeg);
    if (!key) return;
    const store = readSessionObject(STORAGE_KEYS.globalYearOpen);
    store[key] = !!open;
    writeSessionObject(STORAGE_KEYS.globalYearOpen, store);
  }

  function addGlobalYearToggle(list, year, open) {
    const li = document.createElement('li');
    li.className = 'md-nav__item msb-global-link-item msb-global-year msb-global-year-lead';
    li.setAttribute('data-msb-global-year', year.yearSeg || '');
    li.setAttribute('data-msb-global-year-open', open ? '1' : '0');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'md-nav__link msb-global-link msb-global-year-toggle';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', (open ? 'Collapse ' : 'Expand ') + (year.title || year.yearSeg || 'year'));

    const main = document.createElement('span');
    main.className = 'msb-global-link-title';
    main.textContent = year.title || year.yearSeg || '';
    btn.appendChild(main);

    const chev = document.createElement('span');
    chev.className = 'msb-global-year-chevron';
    chev.setAttribute('aria-hidden', 'true');
    btn.appendChild(chev);

    li.appendChild(btn);
    list.appendChild(li);
    return li;
  }

  function buildGlobalMobileDrawerNav(kind) {
    const nav = document.createElement('nav');
    nav.className = 'md-nav msb-global-drawer-nav';
    nav.setAttribute('data-msb-global-kind', kind || 'global');

    const list = document.createElement('ul');
    list.className = 'md-nav__list msb-global-list';
    nav.appendChild(list);

    addGlobalSectionTitle(list, 'Main');
    addGlobalLink(list, {
      title: 'Home',
      rel: '',
      href: hrefForGlobalRel('', ['Home']),
      desc: 'Return to the wiki start page.'
    }, 'msb-global-quick');
    addGlobalLink(list, {
      title: 'Find concepts',
      rel: 'find',
      href: hrefForGlobalRel('find', ['Find', 'Find concepts', 'Search']),
      desc: 'Search by concept, alias, or keyword.'
    }, 'msb-global-quick');
    addGlobalLink(list, {
      title: 'Trending',
      rel: 'trending',
      href: hrefForGlobalRel('trending', ['Trending']),
      desc: 'See recently active concepts.'
    }, 'msb-global-quick');
    addGlobalLink(list, {
      title: 'Random practice',
      rel: 'random',
      href: hrefForGlobalRel('random', ['Random', 'Random practice']),
      desc: 'Start a random concept check.'
    }, 'msb-global-quick');

    const years = collectGlobalYearEntries();
    if (years.length) {
      addGlobalSectionTitle(list, 'Browse by year');
      years.forEach(function (year) {
        const open = readGlobalYearOpen(year.yearSeg, false);
        addGlobalYearToggle(list, year, open);

        year.courses.forEach(function (course) {
          const courseRow = addGlobalLink(list, {
            title: course.title || course.courseSeg,
            rel: course.rel,
            href: course.href || hrefForGlobalRel(course.rel, [course.title || course.courseSeg])
          }, 'msb-global-course');
          courseRow.setAttribute('data-msb-global-year-parent', year.yearSeg || '');
          courseRow.setAttribute('data-msb-global-year-open', open ? '1' : '0');
          courseRow.hidden = !open;
        });
      });
    } else {
      addGlobalSectionTitle(list, 'Browse');
      const empty = document.createElement('li');
      empty.className = 'md-nav__item msb-global-empty';
      empty.textContent = 'Course navigation was not available on this page yet. Use Home or Find concepts to continue.';
      list.appendChild(empty);
    }

    return nav;
  }

  function inferScope() {
    const rel = currentRelPath();
    const globalKind = globalPageKindForRel(rel);
    const segs = splitSegments(rel);
    if (!segs.length || globalKind) return { kind: null, relPath: rel, globalKind: globalKind || "home" };

    if (segs.length === 1 || (segs.length === 2 && /^index\.html?$/i.test(segs[1]))) {
      if (!isLikelyYearScopeSegment(segs[0])) return { kind: null, relPath: rel, globalKind: globalKind || "global" };
      return {
        kind: "year",
        yearSeg: segs[0],
        yearPrefix: segs[0] + "/",
        relPath: rel
      };
    }

    if (segs.length >= 2 && !/\.html?$/i.test(segs[1])) {
      if (!isLikelyYearScopeSegment(segs[0])) return { kind: null, relPath: rel, globalKind: globalKind || "global" };
      return {
        kind: "course",
        yearSeg: segs[0],
        courseSeg: segs[1],
        coursePrefix: segs[0] + "/" + segs[1] + "/",
        relPath: rel
      };
    }

    return { kind: null, relPath: rel, globalKind: globalKind || "global" };
  }

  function getPrimarySidebar() {
    return document.querySelector(".md-sidebar--primary");
  }

  function getScrollWrap() {
    const sidebar = getPrimarySidebar();
    if (!sidebar) return null;
    return sidebar.querySelector(".md-sidebar__scrollwrap") || sidebar.querySelector(".md-sidebar__inner") || sidebar;
  }

  function directNavLink(item) {
    if (!item || !item.querySelector) return null;
    return item.querySelector(':scope > a.md-nav__link, :scope > label.md-nav__link, :scope > .md-nav__link');
  }

  function directChildList(node) {
    if (!node || !node.querySelector) return null;
    return node.querySelector(':scope > nav.md-nav > .md-nav__list');
  }

  function ensureNodeExpanded(node) {
    if (!node || !node.querySelector) return;
    const toggle = node.querySelector(':scope > input.md-nav__toggle, input.md-nav__toggle');
    if (!(toggle instanceof HTMLInputElement) || toggle.checked) return;
    try {
      toggle.checked = true;
      toggle.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (_) {
      try { toggle.click(); } catch (__) {}
    }
  }

  function courseSegFromRel(rel, yearSeg) {
    const segs = splitSegments(String(rel || ""));
    if (!yearSeg || !segs.length || segs[0] !== yearSeg) return "";
    if (segs.length === 2 && !/\.html?$/i.test(segs[1])) return segs[1];
    if (segs.length === 3 && !/\.html?$/i.test(segs[1]) && /^index\.html?$/i.test(segs[2])) return segs[1];
    return "";
  }

  function resolveItemRel(li, directLink) {
    const directHref = directLink && directLink.getAttribute ? directLink.getAttribute("href") : "";
    let rel = normaliseHrefToRel(directHref);
    if (rel) return rel;

    if (li && li.querySelector) {
      const activeAnchor = li.querySelector(
        ':scope > a.md-nav__link[href][aria-current="page"], :scope > a.md-nav__link--active[href], a.md-nav__link[href][aria-current="page"], a.md-nav__link--active[href]'
      );
      rel = normaliseHrefToRel(activeAnchor && activeAnchor.getAttribute ? activeAnchor.getAttribute("href") : "");
      if (rel) return rel;
    }

    if (li && li.classList && li.classList.contains("md-nav__item--active")) {
      return currentRelPath();
    }

    return "";
  }

  function relVariantsForCompare(rel) {
    const base = safePath(rel);
    if (!base) return [];
    const set = new Set();
    set.add(base);
    set.add(base.replace(/\/index\.html?$/i, ""));
    set.add(base.replace(/\.html?$/i, ""));
    set.add(base.replace(/\/+$/, ""));
    set.add(base.replace(/\/+$/, "") + "/index.html");
    set.add(base.replace(/\/+$/, "") + "/");
    return Array.from(set).map(function (s) {
      return String(s || "").replace(/^\/+/, "").replace(/\/+$/, "");
    }).filter(Boolean);
  }

  function sameLogicalRel(left, right) {
    const a = relVariantsForCompare(left);
    const b = relVariantsForCompare(right);
    if (!a.length || !b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (b.indexOf(a[i]) >= 0) return true;
    }
    return false;
  }

  function isRealConceptRel(rel, coursePrefix) {
    const r = String(rel || "").replace(/^\/+/, "").replace(/\/+$/, "");
    if (!r || !coursePrefix) return false;
    const prefix = String(coursePrefix || "").replace(/^\/+/, "").replace(/\/+$/, "") + "/";
    if (!r.startsWith(prefix)) return false;
    const tail = r.slice(prefix.length);
    if (!tail || !tail.trim()) return false;
    if (/^index(?:\.html?)?$/i.test(tail)) return false;
    if (/\//.test(tail)) return false;
    return true;
  }

  function alphaCompare(a, b) {
    const leftTitle = String(a && a.title || "");
    const rightTitle = String(b && b.title || "");
    const byTitle = leftTitle.localeCompare(rightTitle, undefined, { sensitivity: "base" });
    if (byTitle !== 0) return byTitle;
    const leftRel = String(a && a.rel || "");
    const rightRel = String(b && b.rel || "");
    const byRel = leftRel.localeCompare(rightRel, undefined, { sensitivity: "base" });
    if (byRel !== 0) return byRel;
    return Number(a && a.baseIndex || 0) - Number(b && b.baseIndex || 0);
  }

  function getTagsFromDoc(doc) {
    const out = [];
    out.push.apply(out, asStringList(doc && doc.tags));
    out.push.apply(out, asStringList(doc && doc.tag));
    out.push.apply(out, asStringList(doc && doc.meta && doc.meta.tags));
    out.push.apply(out, asStringList(doc && doc.meta && doc.meta.tag));
    out.push.apply(out, asStringList(doc && doc.meta && doc.meta["tags"]));
    return out.map(function (s) { return String(s).trim(); }).filter(Boolean);
  }

  function unitInfoFromTags(tags) {
    const arr = Array.isArray(tags) ? tags : [];
    const withCourse = /^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;
    const bare = /^(lecture|week)[-_]?0*(\d+)$/i;
    for (let i = 0; i < arr.length; i += 1) {
      const text = String(arr[i] || "").trim().toLowerCase();
      let m = text.match(withCourse);
      if (m) {
        const unitType = String(m[2] || "lecture").toLowerCase();
        const unitNo = parseInt(m[3], 10) || 0;
        return { courseCode: String(m[1] || "").toLowerCase(), unitType: unitType, unitNo: unitNo, lecture: unitNo, label: unitNounFromType(unitType) + " " + unitNo };
      }
      m = text.match(bare);
      if (m) {
        const unitType = String(m[1] || "lecture").toLowerCase();
        const unitNo = parseInt(m[2], 10) || 0;
        return { courseCode: "", unitType: unitType, unitNo: unitNo, lecture: unitNo, label: unitNounFromType(unitType) + " " + unitNo };
      }
    }
    return null;
  }

  function lectureNoFromTags(tags) {
    const info = unitInfoFromTags(tags);
    return info ? info.unitNo : 0;
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      let done = false;
      const timer = window.setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error("timeout"));
      }, Math.max(1, Number(ms) || 0));

      promise.then(function (value) {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve(value);
      }, function (err) {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        reject(err);
      });
    });
  }

  const metaProvider = {
    sidebarMetaPromise: null,
    searchIndexPromise: null,

    loadSidebarMeta: function () {
      if (this.sidebarMetaPromise) return this.sidebarMetaPromise;
      const self = this;
      this.sidebarMetaPromise = (async function () {
        const url = new URL("assets/sidebar/sidebar-meta.json", siteRootUrl()).toString();
        for (let attempt = 0; attempt < 2; attempt += 1) {
          try {
            const res = await withTimeout(fetch(url, { cache: attempt === 0 ? "default" : "no-cache" }), 2500);
            if (!res || !res.ok) {
              if (res && res.status === 404) return null;
              throw new Error("meta_fetch_" + (res ? res.status : "unknown"));
            }
            const json = await res.json();
            return json && typeof json === "object" ? json : null;
          } catch (err) {
            if (attempt === 1) return null;
          }
        }
        return null;
      })();
      return self.sidebarMetaPromise;
    },

    loadSearchIndex: function () {
      if (this.searchIndexPromise) return this.searchIndexPromise;
      this.searchIndexPromise = (async function () {
        const url = new URL("search/search_index.json", siteRootUrl()).toString();
        const res = await withTimeout(fetch(url, { cache: "default" }), 2500).catch(function () { return null; });
        const json = res && res.ok ? await res.json().catch(function () { return null; }) : null;
        const docs = json && Array.isArray(json.docs) ? json.docs : [];
        const byLocation = new Map();
        for (let i = 0; i < docs.length; i += 1) {
          const doc = docs[i];
          const loc = safePath(doc && doc.location);
          if (!loc || byLocation.has(loc)) continue;
          byLocation.set(loc, doc);
        }
        return { docs: docs, byLocation: byLocation };
      })();
      return this.searchIndexPromise;
    },

    candidateCourseKeys: function (scope) {
      if (!scope || !scope.yearSeg) return [];
      const out = [];
      if (scope.courseSeg) out.push(scope.yearSeg + "/" + scope.courseSeg);
      if (scope.yearSeg && scope.courseSeg) out.push(scope.yearSeg + "/" + scope.courseSeg + "/");
      return out;
    },

    relVariants: function (rel) {
      const base = safePath(rel);
      if (!base) return [];
      const set = new Set();
      set.add(base);
      set.add(base.replace(/\/index\.html?$/i, "/"));
      set.add(base.replace(/\.html?$/i, "/"));
      set.add(base.replace(/\/+$/, ""));
      return Array.from(set).filter(Boolean);
    },

    findExplicitMeta: async function (scope, rel) {
      const meta = await this.loadSidebarMeta();
      if (!meta || typeof meta !== "object") return null;
      const courseKeys = this.candidateCourseKeys(scope);
      const rels = this.relVariants(rel);

      const courseTables = [];
      if (meta.courses && typeof meta.courses === "object") {
        for (let i = 0; i < courseKeys.length; i += 1) {
          const key = courseKeys[i];
          if (meta.courses[key] && meta.courses[key].items) courseTables.push(meta.courses[key].items);
          const lowerKey = String(key).toLowerCase();
          if (meta.courses[lowerKey] && meta.courses[lowerKey].items) courseTables.push(meta.courses[lowerKey].items);
        }
      }
      if (meta.items && typeof meta.items === "object") courseTables.push(meta.items);

      for (let tableIndex = 0; tableIndex < courseTables.length; tableIndex += 1) {
        const table = courseTables[tableIndex];
        if (!table || typeof table !== "object") continue;
        for (let i = 0; i < rels.length; i += 1) {
          if (table[rels[i]]) return table[rels[i]];
          const lower = rels[i].toLowerCase();
          if (table[lower]) return table[lower];
        }
      }
      return null;
    },

    readLectureInfo: async function (scope, rel) {
      const explicit = await this.findExplicitMeta(scope, rel).catch(function () { return null; });
      if (explicit) {
        const lecNo = Number.isFinite(Number(explicit.lecture)) && Number(explicit.lecture) > 0 ? Number(explicit.lecture) : 0;
        const weekNo = Number.isFinite(Number(explicit.week)) && Number(explicit.week) > 0 ? Number(explicit.week) : 0;
        const unitType = weekNo > 0 && !lecNo ? "week" : String(explicit.unitType || explicit.unit || "lecture").toLowerCase();
        const unitNo = unitType === "week" ? (weekNo || lecNo) : (lecNo || weekNo);
        return {
          lecture: unitNo,
          unitType: unitType === "week" ? "week" : "lecture",
          order: Number.isFinite(Number(explicit.order)) ? Number(explicit.order) : Number.MAX_SAFE_INTEGER,
          titleOverride: explicit.title || explicit.titleOverride || "",
          block: explicit.block || ""
        };
      }

      const index = await this.loadSearchIndex().catch(function () { return null; });
      const doc = index && index.byLocation ? index.byLocation.get(safePath(rel)) : null;
      const unitInfo = unitInfoFromTags(getTagsFromDoc(doc));
      return {
        lecture: unitInfo ? unitInfo.unitNo : 0,
        unitType: unitInfo && unitInfo.unitType === "week" ? "week" : "lecture",
        order: Number.MAX_SAFE_INTEGER,
        titleOverride: "",
        block: ""
      };
    },

    readBlockInfo: async function (scope, rel) {
      const explicit = await this.findExplicitMeta(scope, rel).catch(function () { return null; });
      if (explicit && explicit.block) return String(explicit.block);
      return "";
    }
  };

  function removeLegacyArtifacts() {
    const legacyStyleIds = [
      "mk-sidebar-sort-rebuild-style-v100-dark-theme-sticky-mask",
      "mk-sidebar-sort-rebuild-style-v97-theme-page-bg",
      "mk-sidebar-sort-rebuild-style-v96-sidebar-clean-fade",
      "mk-sidebar-sort-rebuild-style-v95-footer-clip-no-lag",
      "mk-sidebar-sort-rebuild-style-v91-course-dropdown-smaller-text",
      "mk-sidebar-sort-rebuild-style-v92-mobile-drawer-blur-backdrop",
      "mk-sidebar-sort-rebuild-style-v87-desktop-scrollbar-sort-line-anchor",
      "mk-sidebar-sort-rebuild-style-v77-course-menu-green-hover",
      "mk-sidebar-sort-rebuild-style-v76-neutral-scrollbars-green-hover",
      "mk-sidebar-sort-rebuild-style-v75-unified-green-scrollbars",
      "mk-sidebar-sort-rebuild-style-v74-thin-green-scrollbars",
      "mk-sidebar-sort-rebuild-style-v73-native-like-desktop-scrollbar",
      "mk-sidebar-sort-rebuild-style-v72-stable-desktop-scrollbar",
      "mk-sidebar-sort-rebuild-style-v71-desktop-sidebar-polish",
      "mk-sidebar-sort-rebuild-style-v70-desktop-scrollbar-outside-cards",
      "mk-sidebar-sort-rebuild-style-v69-desktop-scrollbar-arrows-and-reserve",
      "mk-sidebar-sort-rebuild-style-v68-desktop-scrollbar-start-at-content",
      "mk-sidebar-sort-rebuild-style-v67-desktop-scrollbar-align",
      "mk-sidebar-sort-rebuild-style-v66-course-picker-dropdown-visibility",
      "mk-sidebar-sort-rebuild-style-v65-course-picker-drilldown",
      "mk-sidebar-sort-rebuild-style-v63-initial-desktop-year-top",
      "mk-sidebar-sort-rebuild-style-v62-desktop-year-top-align",
      "mk-sidebar-sort-rebuild-style-v61-svg-single-chevron",
      "mk-sidebar-sort-rebuild-style-v60-edge-single-chevron",
      "mk-sidebar-sort-rebuild-style-v42-stable-closed-clone",
      "mk-sidebar-sort-inline-style-v23",
      "mk-sidebar-sort-fixes-v23",
      "mk-sidebar-sort-rebuild-style-v36-current-course-integrated-arrow-fix",
      "mk-sidebar-sort-rebuild-style-v22-continuous-drawer-fake-scrollbar",
      "mk-sidebar-sort-rebuild-style-v19-continuous-drawer",
      "mk-sidebar-sort-rebuild-style-v29-mobile-year-course-only",
      "mk-sidebar-sort-rebuild-style-v28-chevron-lecture-count-indent-year-title",
      "mk-sidebar-sort-rebuild-style-v27-single-chevron-gap-course-title",
      "mk-sidebar-sort-rebuild-style-v26-mobile-toggle-inertia",
      "mk-sidebar-sort-rebuild-style-v19-single-chevron-mobile-pc",
      "mk-sidebar-sort-rebuild-style-v18-ios26-precenter-unified-ghost",
      "mk-sidebar-sort-inline-style-v21",
      "mk-sidebar-sort-fixes-v21"
    ];
    for (let i = 0; i < legacyStyleIds.length; i += 1) {
      const node = document.getElementById(legacyStyleIds[i]);
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }
  }

  function ensureStyles() {
    if (document.getElementById(IDS.style)) return;
    const style = document.createElement("style");
    style.id = IDS.style;
    style.textContent = `

/* v52: integrated current course/year bar.  Fixes SVG chevron detection. This replaces the standalone
   current-course-bar.js file and is kept in the same runtime as the sidebar
   sorter so sticky offsets, mobile clone headers, and course-collapse state all
   update from one source of truth. */
#current-course-bar{
  --ccb-line: color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
  position:-webkit-sticky;
  position:sticky;
  top:0;
  z-index:20;
  flex:0 0 auto;
  background:var(--md-default-bg-color);
  border-bottom:0;
  box-shadow:none;
  padding:.35rem .5rem .18rem;
  -webkit-transform:translateZ(0);
  transform:translateZ(0);
  -webkit-backface-visibility:hidden;
  backface-visibility:hidden;
  will-change:transform;
  /* Do not use contain:paint here. The course picker menu is an absolutely
     positioned child that must be allowed to escape the bar's own box. With
     paint containment the click works, but the menu is clipped, which looks
     like the arrow does nothing. */
  contain:layout style;
  overflow:visible;
  isolation:isolate;
}
html[data-md-color-scheme="slate"] #current-course-bar{
  --ccb-line:rgba(255,255,255,.10);
}
#current-course-bar .ccb-row{
  position:relative;
  z-index:1;
  display:flex;
  align-items:flex-start;
  gap:.42rem;
  min-width:0;
}
#current-course-bar .ccb-titlelink{
  flex:1 1 auto;
  min-width:0;
  display:flex;
  align-items:flex-start;
  gap:.4rem;
  padding:.24rem .08rem;
  color:inherit;
  text-decoration:none;
  background:transparent;
  transition:color .16s ease, opacity .16s ease, transform .14s ease;
}
#current-course-bar .ccb-title{
  flex:1 1 auto;
  min-width:0;
  display:block;
  overflow:visible;
  text-overflow:clip;
  white-space:normal;
  overflow-wrap:anywhere;
  word-break:break-word;
  font-size:.96rem;
  font-weight:700;
  line-height:1.22;
  opacity:.96;
  text-decoration:none;
  text-underline-offset:.17em;
  text-decoration-thickness:1px;
}
#current-course-bar .ccb-toggle{
  appearance:none;
  flex:0 0 auto;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:1.15rem;
  height:1.15rem;
  min-width:1.15rem;
  min-height:1.15rem;
  margin:.16rem 0 0;
  padding:0;
  border:0;
  border-radius:0;
  background:transparent;
  color:inherit;
  cursor:pointer;
  box-shadow:none;
  transition:transform .14s ease, color .16s ease, opacity .16s ease;
  -webkit-tap-highlight-color:transparent;
}
#current-course-bar .ccb-toggle[hidden]{
  display:none !important;
}
#current-course-bar .ccb-icon{
  display:block;
  width:.95rem;
  height:.95rem;
  color:currentColor;
  transform:rotate(0deg);
  transform-origin:50% 50%;
  transition:transform 150ms cubic-bezier(0.4,0,0.2,1), color 120ms ease;
}
#current-course-bar .ccb-icon.is-open{
  transform:rotate(90deg);
}
#current-course-bar .ccb-titlelink:hover,
#current-course-bar .ccb-titlelink:focus-visible{
  color:var(--md-accent-fg-color);
  outline:none;
}
#current-course-bar .ccb-titlelink:hover .ccb-title,
#current-course-bar .ccb-titlelink:focus-visible .ccb-title{
  text-decoration:underline;
}
#current-course-bar .ccb-titlelink:active,
#current-course-bar .ccb-toggle:active{
  transform:translateY(1px);
}
#current-course-bar .ccb-toggle:hover,
#current-course-bar .ccb-toggle:focus-visible{
  color:var(--md-accent-fg-color);
  outline:none;
}

#current-course-bar .ccb-course-trigger{
  appearance:none;
  -webkit-appearance:none;
  width:100%;
  min-width:0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:.55rem;
  border:1px solid var(--msb-card-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent));
  border-radius:16px;
  background:var(--msb-card-bg, color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%));
  color:inherit;
  padding:.46rem .62rem .48rem;
  font:inherit;
  text-align:left;
  cursor:pointer;
  box-sizing:border-box;
  box-shadow:0 8px 22px rgba(0,0,0,.035);
  transition:border-color .16s ease, background .16s ease, color .16s ease, transform .14s ease, box-shadow .16s ease;
  -webkit-tap-highlight-color:transparent;
}
#current-course-bar .ccb-course-trigger:hover,
#current-course-bar .ccb-course-trigger:focus-visible,
#current-course-bar[data-course-menu-open="1"] .ccb-course-trigger{
  outline:none;
  color:var(--md-accent-fg-color);
  border-color:var(--msb-card-border-strong, color-mix(in srgb, var(--md-accent-fg-color) 24%, var(--md-default-fg-color) 12%));
  background:var(--msb-card-bg-hover, color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%));
  box-shadow:0 10px 24px rgba(0,0,0,.055);
}
#current-course-bar .ccb-course-trigger:active{
  transform:translateY(1px);
}
#current-course-bar .ccb-course-trigger:disabled{
  cursor:default;
  opacity:.86;
}
#current-course-bar .ccb-trigger-main{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:0;
}
#current-course-bar .ccb-kicker{
  display:none !important;
}
#current-course-bar .ccb-course-trigger .ccb-title{
  font-size:.84rem;
  font-weight:760;
  line-height:1.15;
  opacity:.98;
}
#current-course-bar .ccb-trigger-icon{
  flex:0 0 auto;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:1.02rem;
  height:1.02rem;
  border-radius:0;
  background:transparent !important;
  box-shadow:none !important;
}
#current-course-bar .ccb-course-trigger .ccb-icon{
  width:.84rem;
  height:.84rem;
  transform:rotate(90deg);
}
#current-course-bar[data-course-menu-open="1"] .ccb-course-trigger .ccb-icon{
  transform:rotate(270deg);
}
#current-course-bar .ccb-menu{
  position:absolute;
  left:.5rem;
  right:.5rem;
  top:calc(100% + .48rem);
  z-index:110;
  max-height:min(62vh, 420px);
  overflow:auto;
  overscroll-behavior:contain;
  padding:.36rem;
  border:1px solid var(--msb-card-border, color-mix(in srgb, var(--md-default-fg-color) 12%, transparent));
  border-radius:18px;
  background:var(--md-default-bg-color);
  box-shadow:0 18px 44px rgba(0,0,0,.22);
  box-sizing:border-box;
}
#current-course-bar .ccb-menu[hidden]{
  display:none !important;
}
#current-course-bar .ccb-menu-item{
  display:flex;
  align-items:center;
  min-width:0;
  padding:.54rem .62rem;
  border-radius:13px;
  color:inherit;
  text-decoration:none;
  font-size:.78rem;
  font-weight:680;
  line-height:1.18;
  transition:background .14s ease, color .14s ease, transform .12s ease;
}
#current-course-bar .ccb-menu-item:hover,
#current-course-bar .ccb-menu-item:focus-visible{
  outline:none;
  color:var(--md-accent-fg-color);
  background:var(--msb-card-bg-hover, color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%));
}
#current-course-bar .ccb-menu-item:active{
  transform:translateY(1px);
}
#current-course-bar .ccb-menu-item.is-current{
  color:var(--md-accent-fg-color);
  background:color-mix(in srgb, var(--md-accent-fg-color) 14%, transparent);
}
#current-course-bar .ccb-menu-item-title{
  min-width:0;
  overflow-wrap:anywhere;
}
#current-course-bar .ccb-menu-empty{
  padding:.6rem .7rem;
  font-size:.76rem;
  line-height:1.25;
  opacity:.7;
}
#mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu{
  max-height:min(54vh, 360px);
}
@media (max-width: 76.1875em){
  #current-course-bar{
    top:0;
    z-index:19;
    padding:.26rem .42rem .12rem;
  }
  #current-course-bar .ccb-row{
    gap:.34rem;
  }
  #current-course-bar .ccb-titlelink{
    padding:.22rem .08rem;
  }
  #current-course-bar .ccb-title{
    font-size:.86rem;
    font-weight:700;
    line-height:1.2;
  }
  #current-course-bar .ccb-toggle{
    width:1.08rem;
    height:1.08rem;
    min-width:1.08rem;
    min-height:1.08rem;
    margin:.15rem 0 0;
  }
  #current-course-bar .ccb-icon{
    width:.94rem;
    height:.94rem;
  }
  html.lp-drawer-open #current-course-bar,
  body.lp-drawer-open #current-course-bar{
    overflow:visible !important;
  }
  html.lp-drawer-open #current-course-bar::after,
  body.lp-drawer-open #current-course-bar::after{
    content:"";
    position:absolute;
    left:100%;
    top:0;
    width:var(--lp-drawer-cover-width, 0px);
    height:100%;
    background:rgba(0,0,0,.55);
    pointer-events:none;
    z-index:0;
  }
}

html.mk-sidebar-sort-ready .md-sidebar--primary {
  --msb-card-border: color-mix(in srgb, var(--md-default-fg-color) 12%, transparent);
  --msb-card-border-strong: color-mix(in srgb, var(--md-accent-fg-color) 24%, var(--msb-card-border));
  --msb-card-bg: color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%);
  --msb-card-bg-hover: color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%);
}
html[data-md-color-scheme="slate"].mk-sidebar-sort-ready .md-sidebar--primary {
  --msb-card-border: rgba(255,255,255,.10);
  --msb-card-border-strong: color-mix(in srgb, var(--md-accent-fg-color) 30%, rgba(255,255,255,.12));
  --msb-card-bg: color-mix(in srgb, var(--md-default-bg-color) 90%, rgba(255,255,255,.05) 10%);
  --msb-card-bg-hover: color-mix(in srgb, var(--md-default-bg-color) 84%, var(--md-accent-fg-color) 16%);
}

html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn{
  appearance:none !important;
  -webkit-appearance:none !important;
  border:0 !important;
  background:transparent !important;
  box-shadow:none !important;
  outline:0 !important;
  padding:0 !important;
  color:inherit !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:1rem !important;
  height:1rem !important;
  min-width:1rem !important;
  color:currentColor !important;
  font-size:0 !important;
  line-height:1 !important;
  transform:rotate(0deg);
  transform-origin:50% 50%;
  transition:transform 150ms cubic-bezier(.4,0,.2,1), color 120ms ease;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::before{
  content:"›" !important;
  display:block !important;
  font-family:var(--md-text-font-family, system-ui, sans-serif) !important;
  font-size:1.22rem !important;
  font-weight:800 !important;
  line-height:1rem !important;
  color:currentColor !important;
  speak:none;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron{
  transform:rotate(90deg) !important;
}

/* Desktop/tablet native drawer fallback: when Material's own drawer is used,
   make the open/close movement use the same continuous 1000ms timing as the
   custom mobile surface.  The custom mobile drawer below is still the visible
   drawer on phone-sized viewports. */
@media (min-width: 76.1876em){
  html.mk-sidebar-sort-ready .md-sidebar--primary{
    -webkit-transition-property:-webkit-transform, transform, opacity, visibility !important;
    transition-property:-webkit-transform, transform, opacity, visibility !important;
    -webkit-transition-duration:1000ms !important;
    transition-duration:1000ms !important;
    -webkit-transition-timing-function:cubic-bezier(.2,0,0,1) !important;
    transition-timing-function:cubic-bezier(.2,0,0,1) !important;
  }
}
#${IDS.control}.${CLS.dock} {
  --msb-sortdock-shift: 0px;
  position: sticky;
  top: calc(var(--msb-current-bar-h, 0px) - 2px);
  z-index: 18;
  padding: .18rem .5rem .26rem;
  margin: 0;
  border: 0;
  box-shadow: none;
  background: var(--md-default-bg-color);
  /* iOS Safari: force own compositing layer so background never paints over
     sibling content after a programmatic scrollTop change on the scrollwrap. */
  -webkit-transform: translateY(var(--msb-sortdock-shift, 0px)) translateZ(0);
  transform: translateY(var(--msb-sortdock-shift, 0px)) translateZ(0);
  will-change: transform;
  isolation: isolate;
  overflow: visible;
}
#${IDS.control}.${CLS.dock}::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: calc(-1 * var(--msb-sortdock-gap-cover, 10px));
  height: var(--msb-sortdock-gap-cover, 10px);
  background: var(--md-default-bg-color);
  pointer-events: none;
  z-index: 0;
}
#current-course-bar + #${IDS.control}.${CLS.dock} {
  margin-top: -1px;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__inner {
  scrollbar-gutter: stable;
}

/* v69 desktop: the native scrollbar belongs to the whole Material scrollwrap,
   so it visually starts above the sticky Current course + Sort by area. Hide
   that native scrollbar on PC and draw a quiet aligned range bar that starts at
   the first real sidebar content row, i.e. the Lecture 1 card / first block. */
@media (min-width: 76.1876em){
  html.mk-sidebar-sort-ready .md-sidebar--primary{
    --msb-desktop-scrollbar-reserve: .96rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__inner{
    scrollbar-gutter:auto !important;
    scrollbar-width:none !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap::-webkit-scrollbar,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__inner::-webkit-scrollbar{
    width:0 !important;
    height:0 !important;
    display:none !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar,
  html.mk-sidebar-sort-ready .md-sidebar--primary #mk-sidebar-sortdock{
    box-sizing:border-box !important;
    width:100% !important;
    max-width:none !important;
    margin-left:0 !important;
    margin-right:0 !important;
  }
  /* Keep the lecture/block cards clear of the custom range bar. */
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}]{
    margin-right:calc(.26rem + var(--msb-desktop-scrollbar-reserve)) !important;
  }
}
/* v76: thin scrollbar language.
   Default state is neutral deep grey.  Hover / active / dragging state is the
   project teal-green.  Do not inherit Material's accent colour here, because on
   some palettes that accent is blue. */
html.mk-sidebar-sort-ready{
  --msb-scrollbar-w: 9px;
  --msb-scrollbar-green: #00bfa5;
  --msb-scrollbar-green-hover: #00cdb4;
  --msb-scrollbar-thumb: color-mix(in srgb, var(--md-default-fg-color) 44%, transparent);
  --msb-scrollbar-thumb-hover: var(--msb-scrollbar-green);
  --msb-scrollbar-arrow: color-mix(in srgb, var(--md-default-fg-color) 52%, transparent);
  --msb-scrollbar-arrow-hover: var(--msb-scrollbar-green);
  --msb-scrollbar-accent: var(--msb-scrollbar-thumb);
  --msb-scrollbar-accent-hover: var(--msb-scrollbar-green-hover);
  scrollbar-width: thin;
  scrollbar-color: var(--msb-scrollbar-thumb) transparent;
}
html.mk-sidebar-sort-ready[data-md-color-scheme="slate"]{
  --msb-scrollbar-thumb: rgba(255,255,255,.34);
  --msb-scrollbar-arrow: rgba(255,255,255,.44);
  --msb-scrollbar-thumb-hover: var(--msb-scrollbar-green);
  --msb-scrollbar-arrow-hover: var(--msb-scrollbar-green);
  --msb-scrollbar-accent: var(--msb-scrollbar-thumb);
  --msb-scrollbar-accent-hover: var(--msb-scrollbar-green-hover);
}
html.mk-sidebar-sort-ready *{
  scrollbar-width: thin;
  scrollbar-color: var(--msb-scrollbar-thumb) transparent;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar,
html.mk-sidebar-sort-ready *::-webkit-scrollbar{
  width:var(--msb-scrollbar-w);
  height:var(--msb-scrollbar-w);
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-track,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-track{
  background:transparent;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-thumb,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-thumb{
  min-height:24px;
  border-radius:999px;
  border:2px solid transparent;
  background-color:var(--msb-scrollbar-thumb);
  background-clip:padding-box;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-thumb:hover,
html.mk-sidebar-sort-ready::-webkit-scrollbar-thumb:active,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-thumb:hover,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-thumb:active{
  background-color:var(--msb-scrollbar-thumb-hover);
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-button:single-button,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-button:single-button{
  width:var(--msb-scrollbar-w);
  height:var(--msb-scrollbar-w);
  min-width:var(--msb-scrollbar-w);
  min-height:var(--msb-scrollbar-w);
  background-color:var(--msb-scrollbar-arrow);
  background-repeat:no-repeat;
  background-position:center;
  background-size:7px 7px;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-button:single-button:hover,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-button:single-button:hover{
  background-color:var(--msb-scrollbar-arrow-hover);
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-button:single-button:vertical:decrement,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-button:single-button:vertical:decrement{
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M5 1.6 9 7.6H1z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M5 1.6 9 7.6H1z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-button:single-button:vertical:increment,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-button:single-button:vertical:increment{
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M1 2.4h8L5 8.4z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M1 2.4h8L5 8.4z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-button:single-button:horizontal:decrement,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-button:single-button:horizontal:decrement{
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M1.6 5 7.6 1v8z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M1.6 5 7.6 1v8z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
}
html.mk-sidebar-sort-ready::-webkit-scrollbar-button:single-button:horizontal:increment,
html.mk-sidebar-sort-ready *::-webkit-scrollbar-button:single-button:horizontal:increment{
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M8.4 5 2.4 9V1z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M8.4 5 2.4 9V1z' fill='black'/%3E%3C/svg%3E") center / 7px 7px no-repeat;
}
/* Current-course dropdown: hide the browser scrollbar and use the same
   custom neutral-grey -> green-on-hover language as the left lecture range.
   Native WebKit scrollbars on Windows can ignore parent :hover/:active repaint
   while dragging, which is why v77 could remain grey. */
#current-course-bar .ccb-menu{
  right:.08rem;
  padding-right:.86rem;
  scrollbar-width:none !important;
  scrollbar-color:transparent transparent !important;
  -ms-overflow-style:none !important;
}
#current-course-bar .ccb-menu::-webkit-scrollbar{
  width:0 !important;
  height:0 !important;
  display:none !important;
}
#current-course-bar .ccb-menu::-webkit-scrollbar-track,
#current-course-bar .ccb-menu::-webkit-scrollbar-thumb,
#current-course-bar .ccb-menu::-webkit-scrollbar-button{
  display:none !important;
  width:0 !important;
  height:0 !important;
  background:transparent !important;
}
#msb-course-menu-scrollbar{
  --msb-course-menu-scrollbar-arrow-h:18px;
  --msb-course-menu-scrollbar-arrow-size:7px;
  --msb-course-menu-scrollbar-width:9px;
  --msb-course-menu-scrollbar-thumb-w:6px;
  --msb-course-menu-scrollbar-neutral:rgba(0,0,0,.55);
  --msb-course-menu-scrollbar-neutral-slate:rgba(255,255,255,.34);
  --msb-course-menu-scrollbar-green:#00bfa5;
  --msb-course-menu-scrollbar-green-hover:#00cdb4;
  --msb-course-menu-scrollbar-ink:var(--msb-course-menu-scrollbar-neutral);
  --msb-course-menu-scrollbar-ink-hot:var(--msb-course-menu-scrollbar-green);
  position:fixed;
  z-index:96;
  display:none;
  width:var(--msb-course-menu-scrollbar-width);
  pointer-events:none;
  cursor:default;
  opacity:0;
  transition:opacity 120ms ease;
  user-select:none;
  -webkit-user-select:none;
  touch-action:none;
  overflow:visible;
}
html[data-md-color-scheme="slate"] #msb-course-menu-scrollbar,
body[data-md-color-scheme="slate"] #msb-course-menu-scrollbar{
  --msb-course-menu-scrollbar-ink:var(--msb-course-menu-scrollbar-neutral-slate);
}
#msb-course-menu-scrollbar.is-visible{
  display:block;
  opacity:.94;
  pointer-events:auto;
}
#msb-course-menu-scrollbar.is-visible:hover,
#msb-course-menu-scrollbar.is-visible.is-dragging,
#msb-course-menu-scrollbar.is-visible.is-hot{
  opacity:1;
}
#msb-course-menu-scrollbar::before,
#msb-course-menu-scrollbar::after{
  content:"";
  position:absolute;
  left:50%;
  width:0;
  height:0;
  margin-left:calc(-0.5 * var(--msb-course-menu-scrollbar-arrow-size));
  pointer-events:none;
  transition:border-color 120ms ease, opacity 120ms ease;
}
#msb-course-menu-scrollbar::before{
  top:4px;
  border-left:calc(0.5 * var(--msb-course-menu-scrollbar-arrow-size)) solid transparent;
  border-right:calc(0.5 * var(--msb-course-menu-scrollbar-arrow-size)) solid transparent;
  border-bottom:var(--msb-course-menu-scrollbar-arrow-size) solid var(--msb-course-menu-scrollbar-ink);
}
#msb-course-menu-scrollbar::after{
  bottom:4px;
  border-left:calc(0.5 * var(--msb-course-menu-scrollbar-arrow-size)) solid transparent;
  border-right:calc(0.5 * var(--msb-course-menu-scrollbar-arrow-size)) solid transparent;
  border-top:var(--msb-course-menu-scrollbar-arrow-size) solid var(--msb-course-menu-scrollbar-ink);
}
#msb-course-menu-scrollbar:hover::before,
#msb-course-menu-scrollbar.is-dragging::before,
#msb-course-menu-scrollbar.is-hot::before{
  border-bottom-color:var(--msb-course-menu-scrollbar-ink-hot);
}
#msb-course-menu-scrollbar:hover::after,
#msb-course-menu-scrollbar.is-dragging::after,
#msb-course-menu-scrollbar.is-hot::after{
  border-top-color:var(--msb-course-menu-scrollbar-ink-hot);
}
#msb-course-menu-scrollbar .msb-course-menu-scrollbar__track{
  position:absolute;
  left:0;
  right:0;
  top:var(--msb-course-menu-scrollbar-arrow-h);
  bottom:var(--msb-course-menu-scrollbar-arrow-h);
  border-radius:999px;
  background:transparent;
  pointer-events:auto;
}
#msb-course-menu-scrollbar .msb-course-menu-scrollbar__thumb{
  position:absolute;
  left:50%;
  top:0;
  width:var(--msb-course-menu-scrollbar-thumb-w);
  min-height:24px;
  border-radius:999px;
  background:var(--msb-course-menu-scrollbar-ink);
  cursor:default;
  pointer-events:auto;
  -webkit-transform:translate3d(-50%, var(--msb-course-menu-scrollbar-thumb-y, 0px), 0);
  transform:translate3d(-50%, var(--msb-course-menu-scrollbar-thumb-y, 0px), 0);
  transition:background-color 120ms ease, opacity 120ms ease;
  will-change:transform,height;
}
#msb-course-menu-scrollbar:hover .msb-course-menu-scrollbar__thumb,
#msb-course-menu-scrollbar.is-dragging .msb-course-menu-scrollbar__thumb,
#msb-course-menu-scrollbar.is-hot .msb-course-menu-scrollbar__thumb{
  background:var(--msb-course-menu-scrollbar-ink-hot);
}
#msb-course-menu-scrollbar.is-dragging,
#msb-course-menu-scrollbar.is-dragging .msb-course-menu-scrollbar__thumb{
  cursor:default;
}
/* v89: course picker dropdown aligns with the course pill and shows every course at once. */
#current-course-bar .ccb-menu{
  left:0 !important;
  right:0 !important;
  width:auto !important;
  max-width:100% !important;
  top:calc(100% + .48rem) !important;
  max-height:min(54vh, 380px) !important;
  height:auto !important;
  overflow:auto !important;
  overscroll-behavior:contain !important;
  padding:.36rem !important;
  padding-right:.36rem !important;
  box-shadow:none !important;
  scrollbar-width:none !important;
  -ms-overflow-style:none !important;
}
#mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu{
  max-height:min(50vh, 340px) !important;
  overflow:auto !important;
  overscroll-behavior:contain !important;
}
#current-course-bar .ccb-menu::-webkit-scrollbar,
#current-course-bar .ccb-menu::-webkit-scrollbar-track,
#current-course-bar .ccb-menu::-webkit-scrollbar-thumb,
#current-course-bar .ccb-menu::-webkit-scrollbar-button{
  display:none !important;
  width:0 !important;
  height:0 !important;
  background:transparent !important;
}
#msb-course-menu-scrollbar,
#msb-course-menu-scrollbar.is-visible,
#msb-course-menu-scrollbar.is-dragging,
#msb-course-menu-scrollbar.is-hot{
  display:none !important;
  opacity:0 !important;
  pointer-events:none !important;
}
/* v91: make the top course dropdown text smaller and tighten multi-line spacing. */
#current-course-bar .ccb-menu-item{
  font-size:.66rem !important;
  line-height:1.08 !important;
  padding:.44rem .56rem !important;
}
#current-course-bar .ccb-menu-item-title{
  line-height:1.08 !important;
}
#msb-desktop-scrollbar{
  --msb-desktop-scrollbar-arrow-h: 20px;
  --msb-desktop-scrollbar-arrow-size: 7px;
  --msb-desktop-scrollbar-width: var(--msb-scrollbar-w, 9px);
  --msb-desktop-scrollbar-thumb-w: 6px;
  --msb-desktop-scrollbar-ink: var(--msb-scrollbar-thumb);
  --msb-desktop-scrollbar-ink-hover: var(--msb-scrollbar-green);
  --msb-desktop-scrollbar-arrow-ink: var(--msb-scrollbar-arrow);
  --msb-desktop-scrollbar-arrow-ink-hover: var(--msb-scrollbar-green);
  position:fixed;
  top:var(--msb-desktop-scrollbar-top, 0px);
  bottom:auto;
  z-index:42;
  display:none;
  width:var(--msb-desktop-scrollbar-width);
  pointer-events:none;
  cursor:default;
  opacity:0;
  transition:opacity 120ms ease;
  user-select:none;
  -webkit-user-select:none;
  touch-action:none;
  overflow:visible;
}
#msb-desktop-scrollbar.is-visible{
  display:block;
  opacity:.92;
  pointer-events:auto;
}
#msb-desktop-scrollbar.is-visible:hover,
#msb-desktop-scrollbar.is-visible.is-dragging{
  opacity:1;
}
#msb-desktop-scrollbar::before,
#msb-desktop-scrollbar::after{
  content:"";
  position:absolute;
  left:50%;
  width:0;
  height:0;
  margin-left:calc(-0.5 * var(--msb-desktop-scrollbar-arrow-size));
  pointer-events:none;
  transition:border-color 120ms ease, opacity 120ms ease;
}
#msb-desktop-scrollbar::before{
  top:4px;
  border-left:calc(0.5 * var(--msb-desktop-scrollbar-arrow-size)) solid transparent;
  border-right:calc(0.5 * var(--msb-desktop-scrollbar-arrow-size)) solid transparent;
  border-bottom:var(--msb-desktop-scrollbar-arrow-size) solid var(--msb-desktop-scrollbar-arrow-ink);
}
#msb-desktop-scrollbar::after{
  bottom:4px;
  border-left:calc(0.5 * var(--msb-desktop-scrollbar-arrow-size)) solid transparent;
  border-right:calc(0.5 * var(--msb-desktop-scrollbar-arrow-size)) solid transparent;
  border-top:var(--msb-desktop-scrollbar-arrow-size) solid var(--msb-desktop-scrollbar-arrow-ink);
}
#msb-desktop-scrollbar:hover::before,
#msb-desktop-scrollbar.is-dragging::before{
  border-bottom-color:var(--msb-desktop-scrollbar-arrow-ink-hover);
}
#msb-desktop-scrollbar:hover::after,
#msb-desktop-scrollbar.is-dragging::after{
  border-top-color:var(--msb-desktop-scrollbar-arrow-ink-hover);
}
#msb-desktop-scrollbar .msb-desktop-scrollbar__track{
  position:absolute;
  left:0;
  right:0;
  top:var(--msb-desktop-scrollbar-arrow-h);
  bottom:var(--msb-desktop-scrollbar-arrow-h);
  border-radius:999px;
  background:transparent;
  pointer-events:auto;
}
#msb-desktop-scrollbar .msb-desktop-scrollbar__thumb{
  position:absolute;
  left:50%;
  top:0;
  width:var(--msb-desktop-scrollbar-thumb-w);
  min-height:24px;
  border-radius:999px;
  background:var(--msb-desktop-scrollbar-ink);
  cursor:default;
  pointer-events:auto;
  -webkit-transform:translate3d(-50%, var(--msb-desktop-scrollbar-thumb-y, 0px), 0);
  transform:translate3d(-50%, var(--msb-desktop-scrollbar-thumb-y, 0px), 0);
  transition:background-color 120ms ease, opacity 120ms ease;
  will-change:transform,height;
}
#msb-desktop-scrollbar:hover .msb-desktop-scrollbar__thumb,
#msb-desktop-scrollbar.is-dragging .msb-desktop-scrollbar__thumb{
  background:var(--msb-desktop-scrollbar-ink-hover);
}
#msb-desktop-scrollbar.is-dragging,
#msb-desktop-scrollbar.is-dragging .msb-desktop-scrollbar__thumb{
  cursor:default;
}
@media (max-width: 76.1875em){
  #msb-desktop-scrollbar{
    display:none !important;
  }
}
@media (max-width: 76.1875em) {
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap {
    touch-action: pan-y !important;
  }

  /* Mobile drawer fix:
     Keep the sort dock below the current-course bar even when iOS / Material
     makes sticky siblings use the viewport top during the first drawer layout.
     JS later adds --msb-sortdock-shift when the measured visual position is
     still too high, so this is both a safe fallback and a stable base. */
  #${IDS.control}.${CLS.dock} {
    --msb-sortdock-gap-cover: 16px;
    top: max(2.8rem, calc(var(--msb-current-bar-h, 0px) - .22rem)) !important;
    z-index: 18;
    margin-top: 0;
    padding-top: .18rem;
  }
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__inner {
  scroll-snap-type: none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__link {
  scroll-snap-align: none !important;
  scroll-snap-stop: normal !important;
}
#${IDS.control} .${CLS.dockBox} {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  padding: 0;
  background: transparent;
}
#${IDS.control} .${CLS.dockLabel} {
  flex: 0 0 auto;
  font-size: .74rem;
  font-weight: 700;
  letter-spacing: .02em;
  line-height: 1;
  opacity: .74;
}
#${IDS.control} .${CLS.dockButton} {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  min-width: 4.6rem;
  border: 1px solid var(--msb-card-border);
  border-radius: 999px;
  background: var(--msb-card-bg);
  color: inherit;
  font: inherit;
  font-size: .78rem;
  font-weight: 700;
  line-height: 1;
  padding: .34rem .78rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
#${IDS.control} .${CLS.dockButton}:hover,
#${IDS.control} .${CLS.dockButton}:focus-visible {
  outline: none;
  color: var(--md-accent-fg-color);
  border-color: var(--msb-card-border-strong);
  background: var(--msb-card-bg-hover);
}
html.mk-sidebar-sort-ready .md-sidebar--primary [${ATTR.sortKind}="course"] .md-nav__item,
html.mk-sidebar-sort-ready .md-sidebar--primary [${ATTR.sortKind}="course"] .md-nav__item > nav.md-nav > .md-nav__list,
html.mk-sidebar-sort-ready .md-sidebar--primary [${ATTR.sortKind}="course"] .md-nav__item > .md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary [${ATTR.sortKind}="course"] .md-nav__item > label.md-nav__link {
  border-left: 0 !important;
  box-shadow: none !important;
}
#${IDS.control}.${CLS.dock} + .md-nav__list,
#${IDS.control}.${CLS.dock} + nav.md-nav,
#${IDS.control}.${CLS.dock} + nav.md-nav > .md-nav__list {
  border-top: 0 !important;
  box-shadow: none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn},
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton} {
  -webkit-tap-highlight-color: transparent;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item--nested[${ATTR.scopeCollapsed}="1"] > nav.md-nav {
  display: none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary [data-msb-course-drilldown="1"] [data-msb-drill-hidden="1"]{
  display:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary [data-msb-course-drilldown="1"] [data-msb-drill-title-hidden="1"]{
  display:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary [data-msb-course-drilldown="1"] [data-msb-drill-current="1"]{
  display:block !important;
  margin:0 !important;
  padding:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary [data-msb-course-drilldown="1"] [data-msb-drill-current="1"] > nav.md-nav,
html.mk-sidebar-sort-ready .md-sidebar--primary [data-msb-course-drilldown="1"] [data-msb-drill-current="1"] > nav.md-nav > .md-nav__list{
  display:block !important;
  margin:0 !important;
  padding-top:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.head} {
  display: block;
  margin: 0;
  padding: 0;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headRow} {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .55rem;
  box-sizing: border-box;
  padding: .54rem .9rem .42rem;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headText} {
  flex: 1 1 auto;
  min-width: 0;
  font-size: .72rem;
  font-weight: 700;
  line-height: 1.24;
  color: color-mix(in srgb, var(--md-default-fg-color) 88%, transparent);
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn} {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}:hover,
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}:focus-visible {
  outline: none;
  color: var(--md-accent-fg-color);
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headChevron} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: .9rem;
  height: .9rem;
  transform: rotate(0deg);
  transition: transform 150ms cubic-bezier(0.4,0,0.2,1), color 120ms ease;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headChevron}::before {
  content: "›";
  display: block;
  font-size: 1.12rem;
  font-weight: 800;
  line-height: .9rem;
  color: currentColor;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}[aria-expanded="true"] .${CLS.headChevron} {
  transform: rotate(90deg);
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}] {
  background: var(--msb-card-bg);
  border-left: 1px solid var(--msb-card-border) !important;
  border-right: 1px solid var(--msb-card-border) !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  margin: 0 .26rem;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.first},
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.single} {
  border-top: 1px solid var(--msb-card-border) !important;
  border-top-left-radius: 13px !important;
  border-top-right-radius: 13px !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.last},
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.single} {
  border-bottom: 1px solid var(--msb-card-border) !important;
  border-bottom-left-radius: 13px !important;
  border-bottom-right-radius: 13px !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.first},
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.single} {
  margin-top: .54rem;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.lead}[${ATTR.groupOpen}="0"] > .md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.lead}[${ATTR.groupOpen}="0"] > label.md-nav__link {
  display: none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}] > .md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}] > label.md-nav__link {
  padding-top: .34rem !important;
  padding-bottom: .4rem !important;
  margin: 0 .08rem !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.lead}[${ATTR.groupOpen}="1"] > .md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.lead}[${ATTR.groupOpen}="1"] > label.md-nav__link {
  border-top: 0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.hover}[${ATTR.groupKind}] {
  background: var(--msb-card-bg-hover) !important;
  border-left-color: var(--msb-card-border-strong) !important;
  border-right-color: var(--msb-card-border-strong) !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.hover}.${CLS.first},
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.hover}.${CLS.single} {
  border-top-color: var(--msb-card-border-strong) !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.hover}.${CLS.last},
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.hover}.${CLS.single} {
  border-bottom-color: var(--msb-card-border-strong) !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupCollapsedItem}="1"] {
  display: none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.duplicateCurrent}="label"] > label.md-nav__link,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.duplicateCurrent}="label"] > .md-nav__link[for="__toc"] {
  display: none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.duplicateCurrent}="anchor"] > a.md-nav__link {
  display: none !important;
}
@media (max-width: 76.1875em) {
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn},
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton},
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle {
    -webkit-user-select: none;
    user-select: none;
  }
  #${IDS.control}.${CLS.dock} {
    padding: .12rem .36rem .22rem;
  }
  #${IDS.control} .${CLS.dockBox} {
    gap: .42rem;
  }
  #${IDS.control} .${CLS.dockLabel} {
    font-size: .68rem;
  }
  #${IDS.control} .${CLS.dockButton} {
    min-width: 4.2rem;
    font-size: .68rem;
    padding: .32rem .7rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headText} {
    font-size: .76rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__link:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__link:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle:focus-visible {
    outline: none !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__link::selection,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link::selection,
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headText}::selection,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-title::selection {
    background: transparent !important;
    color: inherit !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary a.md-nav__link:not([aria-current="page"]):not(.md-nav__link--active),
  html.mk-sidebar-sort-ready .md-sidebar--primary a.md-nav__link:not([aria-current="page"]):not(.md-nav__link--active):hover,
  html.mk-sidebar-sort-ready .md-sidebar--primary a.md-nav__link:not([aria-current="page"]):not(.md-nav__link--active):focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary a.md-nav__link:not([aria-current="page"]):not(.md-nav__link--active):focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary a.md-nav__link:not([aria-current="page"]):not(.md-nav__link--active):active,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link:hover,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary label.md-nav__link:active,
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn},
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}:hover,
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headBtn}:active,
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton},
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton}:hover,
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton}:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton}:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton}:active,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink:hover,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-titlelink:active,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle:hover,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle:focus,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle:focus-visible,
  html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-toggle:active {
    color: inherit !important;
    background: transparent !important;
    box-shadow: none !important;
    text-decoration: none !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] a.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] label.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] .${CLS.headBtn},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] #${IDS.control} .${CLS.dockButton},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] #current-course-bar .ccb-titlelink,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] #current-course-bar .ccb-toggle,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] a.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] label.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] .${CLS.headBtn},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] #${IDS.control} .${CLS.dockButton},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] #current-course-bar .ccb-titlelink,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] #current-course-bar .ccb-toggle {
    pointer-events: none !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] a.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] label.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] .${CLS.headBtn},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] .${CLS.headText},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] a.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] label.md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] .${CLS.headBtn},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] .${CLS.headText} {
    color: inherit !important;
    background: transparent !important;
    box-shadow: none !important;
    text-decoration: none !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] a.md-nav__link *,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-scrolling="1"] label.md-nav__link *,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] a.md-nav__link *,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-touch-cooldown="1"] label.md-nav__link * {
    color: inherit !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .${CLS.headRow} {
    padding: .46rem .74rem .34rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}] {
    margin: 0 .18rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.first},
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item.${CLS.single} {
    margin-top: .44rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} + .md-nav__list,
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} + nav.md-nav,
  html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} + nav.md-nav > .md-nav__list {
    border-top: 0 !important;
    box-shadow: none !important;
  }
}


/* v61: SVG-only lecture chevron.
   Edge and Firefox were still able to render a stale glyph/pseudo-element arrow
   together with the border chevron.  This block kills every pseudo-arrow and
   shows exactly one inline SVG path. */
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn::before,
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn::after,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn::after,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn::before,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn::after{
  content:none !important;
  display:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn > :not(.msb-group-head__chevron),
#mk-mobile-unified-sidebar-surface .msb-group-head__btn > :not(.msb-group-head__chevron),
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn > :not(.msb-group-head__chevron){
  display:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn{
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  font-size:0 !important;
  line-height:0 !important;
  overflow:visible !important;
  transform:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron{
  position:relative !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:.92rem !important;
  height:.92rem !important;
  min-width:.92rem !important;
  color:currentColor !important;
  background:transparent !important;
  border:0 !important;
  border-radius:0 !important;
  box-shadow:none !important;
  font-size:0 !important;
  line-height:0 !important;
  overflow:visible !important;
  transform:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::before,
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::after,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::after,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron::before,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron::after{
  content:none !important;
  display:none !important;
  width:0 !important;
  height:0 !important;
  border:0 !important;
  background:transparent !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron > svg.msb-group-head__chevron-svg{
  display:block !important;
  width:.82rem !important;
  height:.82rem !important;
  min-width:.82rem !important;
  min-height:.82rem !important;
  margin:0 !important;
  padding:0 !important;
  color:currentColor !important;
  fill:none !important;
  stroke:currentColor !important;
  stroke-width:2.05 !important;
  stroke-linecap:round !important;
  stroke-linejoin:round !important;
  overflow:visible !important;
  pointer-events:none !important;
  transform:rotate(0deg) !important;
  transform-origin:50% 50% !important;
  transition:transform 150ms cubic-bezier(.4,0,.2,1), color 120ms ease !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron > svg.msb-group-head__chevron-svg{
  transform:rotate(90deg) !important;
}


/* v71 desktop polish:
   - keep the custom range scrollbar outside the lecture/block cards, but cut
     the right gap down to roughly one third of v70;
   - remove the left card indent so Lecture containers start at the sidebar edge;
   - make the group-level chevrons quieter and smaller. */
@media (min-width: 76.1876em){
  html.mk-sidebar-sort-ready .md-sidebar--primary{
    --msb-desktop-card-right-clearance:.82rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind]{
    margin-left:0 !important;
    margin-right:var(--msb-desktop-card-right-clearance) !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .msb-group-head .msb-group-head__row{
    padding-right:.42rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > label.md-nav__link{
    padding-right:.52rem !important;
  }
}

/* v96 sidebar visual cleanup:
   - no hard divider between Sort by and the list;
   - fade the list under the sticky sort area instead of drawing a line;
   - keep parent surfaces on the theme page background and remove the extra glow/shadow around the clean containers. */
html.mk-sidebar-sort-ready .md-sidebar--primary{
  --msb-sidebar-page-bg:var(--mk-active-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)));
  --msb-sidebar-page-background:var(--mk-page-pattern-image, none), var(--msb-sidebar-page-bg, var(--md-default-bg-color));
  --msb-sidebar-page-bg-size:var(--mk-page-pattern-size, auto), auto;
  --msb-sidebar-page-bg-position:var(--mk-page-pattern-position, 0 0), 0 0;
  --msb-sidebar-page-bg-repeat:var(--mk-page-pattern-repeat, repeat), no-repeat;
  --msb-sidebar-page-bg-attachment:fixed, fixed;
  --msb-sidebar-fade-h:1.18rem;
}
html.mk-sidebar-sort-ready .md-sidebar--primary,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__inner,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__list,
#mk-mobile-unified-sidebar-surface,
#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
#mk-mobile-unified-sidebar-surface .msb-unified-head,
#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
#mk-mobile-unified-sidebar-surface .md-nav,
#mk-mobile-unified-sidebar-surface .md-nav__list,
#mk-sidebar-drawer-ghost-floor,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  box-shadow:none !important;
  outline:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar,
#mk-mobile-unified-sidebar-surface #current-course-bar{
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  border:0 !important;
  border-bottom:0 !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-course-trigger,
#mk-mobile-unified-sidebar-surface #current-course-bar .ccb-course-trigger{
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-course-trigger:hover,
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-course-trigger:focus-visible,
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger,
#mk-mobile-unified-sidebar-surface #current-course-bar .ccb-course-trigger:hover,
#mk-mobile-unified-sidebar-surface #current-course-bar .ccb-course-trigger:focus-visible,
#mk-mobile-unified-sidebar-surface #current-course-bar[data-course-menu-open="1"] .ccb-course-trigger{
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar .ccb-menu,
#mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu{
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control}.${CLS.dock},
#mk-mobile-unified-sidebar-surface #${IDS.control}.${CLS.dock}{
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  border:0 !important;
  border-top:0 !important;
  border-bottom:0 !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control}.${CLS.dock}::before,
#mk-mobile-unified-sidebar-surface #${IDS.control}.${CLS.dock}::before{
  display:none !important;
  content:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control}.${CLS.dock}::after,
#mk-mobile-unified-sidebar-surface .msb-unified-head::after{
  content:"" !important;
  position:absolute !important;
  left:0 !important;
  right:0 !important;
  bottom:calc(-1 * var(--msb-sidebar-fade-h, 1.18rem)) !important;
  height:var(--msb-sidebar-fade-h, 1.18rem) !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  -webkit-mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,.72) 48%, transparent 100%) !important;
  mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,.72) 48%, transparent 100%) !important;
  pointer-events:none !important;
  z-index:0 !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-head{
  border:0 !important;
  border-bottom:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockBox},
#mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockBox},
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockLabel},
#mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockLabel}{
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  outline:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockLabel},
#mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockLabel}{
  padding:0 !important;
  border-radius:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton},
#mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockButton}{
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton}:hover,
html.mk-sidebar-sort-ready .md-sidebar--primary #${IDS.control} .${CLS.dockButton}:focus-visible,
#mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockButton}:hover,
#mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockButton}:focus-visible{
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}],
#mk-mobile-unified-sidebar-surface .md-nav__item[${ATTR.groupKind}],
#mk-sidebar-drawer-ghost-floor .md-nav__item[${ATTR.groupKind}]{
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}]::before,
html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[${ATTR.groupKind}]::after,
#mk-mobile-unified-sidebar-surface .md-nav__item[${ATTR.groupKind}]::before,
#mk-mobile-unified-sidebar-surface .md-nav__item[${ATTR.groupKind}]::after{
  box-shadow:none !important;
}


/* v97: shop interface/page themes must recolour the empty sidebar surfaces, not leave the default white Material background.
   The controls themselves stay as clean cards; only the surrounding floor uses the active page background. */
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary .md-sidebar__scrollwrap,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary .md-sidebar__inner,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary .md-nav,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary .md-nav__list,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary #current-course-bar,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary #${IDS.control}.${CLS.dock},
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface .msb-unified-head,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface .md-nav,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface .md-nav__list,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface #current-course-bar,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface #${IDS.control}.${CLS.dock},
html[data-mk-interface-theme] #mk-sidebar-drawer-ghost-floor,
html[data-mk-interface-theme] #mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
  --msb-sidebar-page-bg:var(--mk-active-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color))) !important;
  --msb-sidebar-page-background:var(--mk-page-pattern-image, none), var(--msb-sidebar-page-bg, var(--md-default-bg-color)) !important;
  --msb-sidebar-page-bg-size:var(--mk-page-pattern-size, auto), auto !important;
  --msb-sidebar-page-bg-position:var(--mk-page-pattern-position, 0 0), 0 0 !important;
  --msb-sidebar-page-bg-repeat:var(--mk-page-pattern-repeat, repeat), no-repeat !important;
  --msb-sidebar-page-bg-attachment:fixed, fixed !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary #current-course-bar .ccb-course-trigger,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary #current-course-bar .ccb-menu,
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary #${IDS.control} .${CLS.dockButton},
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary .md-nav__item[${ATTR.groupKind}],
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface #current-course-bar .ccb-course-trigger,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface #current-course-bar .ccb-menu,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface #${IDS.control} .${CLS.dockButton},
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface .md-nav__item[${ATTR.groupKind}]{
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready[data-mk-interface-theme] .md-sidebar--primary #${IDS.control}.${CLS.dock}::after,
html[data-mk-interface-theme] #mk-mobile-unified-sidebar-surface .msb-unified-head::after{
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  -webkit-mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,.72) 48%, transparent 100%) !important;
  mask-image:linear-gradient(to bottom, #000 0%, rgba(0,0,0,.72) 48%, transparent 100%) !important;
}

#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group{
  background:var(--msb-card-bg) !important;
  border-left-color:var(--msb-card-border) !important;
  border-right-color:var(--msb-card-border) !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-first,
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-single{
  border-top-color:var(--msb-card-border) !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-last,
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-single{
  border-bottom-color:var(--msb-card-border) !important;
}

/* v99: keep the sticky course selector + Sort by header as an opaque floor.
   This prevents scrolled course titles from appearing above the course title,
   especially in dark interface themes. */
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar,
#mk-mobile-unified-sidebar-surface #current-course-bar{
  background:var(--mk-theme-sticky-floor, var(--msb-sidebar-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  isolation:isolate !important;
  overflow:visible !important;
  contain:none !important;
  z-index:94 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar::before,
#mk-mobile-unified-sidebar-surface #current-course-bar::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.25rem !important;
  right:-1.25rem !important;
  top:-4rem !important;
  bottom:-.2rem !important;
  background:var(--mk-theme-sticky-floor, var(--msb-sidebar-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #current-course-bar > *,
#mk-mobile-unified-sidebar-surface #current-course-bar > *{
  position:relative !important;
  z-index:1 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #mk-sidebar-sortdock,
#mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock{
  background:var(--mk-theme-sticky-floor, var(--msb-sidebar-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  z-index:90 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary #mk-sidebar-sortdock::after,
#mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock::after{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:-1.25rem !important;
  right:-1.25rem !important;
  bottom:calc(-1 * var(--msb-sidebar-fade-h, 1.22rem)) !important;
  height:var(--msb-sidebar-fade-h, 1.22rem) !important;
  background:var(--mk-theme-sticky-floor, var(--msb-sidebar-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.86) 55%,transparent 100%) !important;
  mask-image:linear-gradient(to bottom,#000 0%,rgba(0,0,0,.86) 55%,transparent 100%) !important;
  pointer-events:none !important;
  z-index:1 !important;
}


/* v101: use the same opaque sidebar floor strategy as the fixed theme variants.
   The first four dark interface themes were still letting the scoped nav layer
   paint into the header area.  Keep the current-course + Sort by area on a
   real flat sidebar floor, and add one scrollwrap-level mask behind the sticky
   controls so the list can only become visible below Sort by. */
html:is([data-mk-interface-theme="ui_theme_dark_midnight"]){ --mk-theme-sticky-floor:#0c1222 !important; }
html:is([data-mk-interface-theme="ui_theme_dark_evergreen"]){ --mk-theme-sticky-floor:#081813 !important; }
html:is([data-mk-interface-theme="ui_theme_dark_aurora_grad"]){ --mk-theme-sticky-floor:#071822 !important; }
html:is([data-mk-interface-theme="ui_theme_dark_plum_grad"]){ --mk-theme-sticky-floor:#160d21 !important; }

html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary,
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary .md-sidebar__scrollwrap,
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary .md-sidebar__inner,
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary .md-nav,
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary .md-nav__list,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .msb-unified-head,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .md-nav,
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .md-nav__list{
  --msb-sidebar-page-bg:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  --msb-sidebar-page-background:var(--msb-sidebar-page-bg, var(--md-default-bg-color)) !important;
  --msb-sidebar-page-bg-size:auto !important;
  --msb-sidebar-page-bg-position:0 0 !important;
  --msb-sidebar-page-bg-repeat:no-repeat !important;
  --msb-sidebar-page-bg-attachment:fixed !important;
  background:var(--msb-sidebar-page-bg, var(--md-default-bg-color)) !important;
  background-image:none !important;
  background-size:auto !important;
  background-position:0 0 !important;
  background-repeat:no-repeat !important;
  background-attachment:fixed !important;
}

html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary .md-sidebar__scrollwrap{
  isolation:isolate !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary .md-sidebar__scrollwrap::before{
  content:"" !important;
  display:block !important;
  position:sticky !important;
  top:0 !important;
  height:calc(var(--msb-current-bar-h, 0px) + var(--mk-sidebar-sortdock-h, 0px) + .24rem) !important;
  margin-bottom:calc(0px - var(--msb-current-bar-h, 0px) - var(--mk-sidebar-sortdock-h, 0px) - .24rem) !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  pointer-events:none !important;
  z-index:82 !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar,
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock{
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  isolation:isolate !important;
}
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #current-course-bar{ z-index:94 !important; }
html.mk-sidebar-sort-ready:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) .md-sidebar--primary #mk-sidebar-sortdock{ z-index:90 !important; }

html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .msb-unified-head{
  position:relative !important;
  z-index:20 !important;
  isolation:isolate !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
}
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .msb-unified-head::before{
  content:"" !important;
  display:block !important;
  position:absolute !important;
  left:0 !important;
  right:0 !important;
  top:-4rem !important;
  bottom:-.1rem !important;
  background:var(--mk-theme-sticky-floor, var(--mk-theme-sidebar-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)))) !important;
  background-image:none !important;
  pointer-events:none !important;
  z-index:0 !important;
}
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .msb-unified-head > *{
  position:relative !important;
  z-index:1 !important;
}
html:is(
  [data-mk-interface-theme="ui_theme_dark_midnight"],
  [data-mk-interface-theme="ui_theme_dark_evergreen"],
  [data-mk-interface-theme="ui_theme_dark_aurora_grad"],
  [data-mk-interface-theme="ui_theme_dark_plum_grad"]
) #mk-mobile-unified-sidebar-surface .msb-unified-list-scroll{
  position:relative !important;
  z-index:1 !important;
}

`;
    (document.head || document.documentElement).appendChild(style);
  }


  function currentCourseBarChevronSvg(className) {
    const cls = className ? ' ' + className : '';
    return '<svg class="ccb-chevron' + cls + '" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5"></path></svg>';
  }

  function ensureCurrentCourseBarNode(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return null;
    let bar = scrollWrap.querySelector('#current-course-bar');
    if (!(bar instanceof HTMLElement)) {
      bar = document.createElement('div');
      bar.id = 'current-course-bar';
      bar.setAttribute(ATTR.injected, '1');
      bar.innerHTML =
        '<div class="ccb-row">' +
          '<button type="button" class="ccb-course-trigger" aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ccb-trigger-main">' +
              '<span class="ccb-kicker">Course</span>' +
              '<span class="ccb-title"></span>' +
            '</span>' +
            '<span class="ccb-trigger-icon" aria-hidden="true">' + currentCourseBarChevronSvg('ccb-icon') + '</span>' +
          '</button>' +
          '<div class="ccb-menu" role="menu" hidden></div>' +
        '</div>';
      scrollWrap.prepend(bar);
    } else if (!bar.querySelector('.ccb-course-trigger')) {
      bar.innerHTML =
        '<div class="ccb-row">' +
          '<button type="button" class="ccb-course-trigger" aria-haspopup="menu" aria-expanded="false">' +
            '<span class="ccb-trigger-main">' +
              '<span class="ccb-kicker">Course</span>' +
              '<span class="ccb-title"></span>' +
            '</span>' +
            '<span class="ccb-trigger-icon" aria-hidden="true">' + currentCourseBarChevronSvg('ccb-icon') + '</span>' +
          '</button>' +
          '<div class="ccb-menu" role="menu" hidden></div>' +
        '</div>';
    }
    return bar;
  }

  function activePrimarySidebarLink() {
    const sidebar = getPrimarySidebar();
    if (!(sidebar instanceof HTMLElement)) return null;
    const active =
      sidebar.querySelector('a.md-nav__link[aria-current="page"], a.md-nav__link--active') ||
      sidebar.querySelector('.md-nav__link--active');
    return active instanceof HTMLElement ? active : null;
  }

  function currentBarScopeNode(scope) {
    if (!scope || !scope.kind) return null;
    if (scope.kind === 'year') {
      return findYearNode(scope.yearSeg) || (activePrimarySidebarLink() ? activePrimarySidebarLink().closest('.md-nav__item') : null);
    }
    if (scope.kind === 'course') {
      return findCourseNode(scope) || (activePrimarySidebarLink() ? activePrimarySidebarLink().closest('.md-nav__item--nested') : null);
    }
    return null;
  }

  function currentBarScopeHref(scopeNode, scope) {
    if (!(scopeNode instanceof HTMLElement) || !scope) return '';
    const directAnchor = scopeNode.querySelector(':scope > a.md-nav__link[href], :scope > .md-nav__link[href]');
    if (directAnchor instanceof HTMLElement) {
      const href = directAnchor.getAttribute('href') || '';
      return directAnchor.href || href || '';
    }

    const candidates = [];
    if (scope.kind === 'course' && scope.yearSeg && scope.courseSeg) {
      candidates.push(scope.yearSeg + '/' + scope.courseSeg + '/');
      candidates.push(scope.yearSeg + '/' + scope.courseSeg + '/index.html');
    } else if (scope.kind === 'year' && scope.yearSeg) {
      candidates.push(scope.yearSeg + '/');
      candidates.push(scope.yearSeg + '/index.html');
    }

    if (candidates.length) {
      const links = asArray(scopeNode.querySelectorAll('a.md-nav__link[href], .md-nav__link[href]'));
      for (let i = 0; i < links.length; i += 1) {
        const href = links[i].getAttribute ? (links[i].getAttribute('href') || '') : '';
        const rel = normaliseHrefToRel(href);
        for (let j = 0; j < candidates.length; j += 1) {
          if (sameLogicalRel(rel, candidates[j])) return links[i].href || href || absoluteSiteHref(candidates[j]);
        }
      }
      return absoluteSiteHref(candidates[0]);
    }
    return '';
  }

  function emitCurrentCourseBarLayoutChanged() {
    try {
      window.dispatchEvent(new CustomEvent('mk:current-course-bar-layout'));
    } catch (_) {}
  }

  function coursePickerYearScope(scope) {
    if (!scope || !scope.yearSeg) return null;
    return {
      kind: scope.kind === 'course' ? 'course' : 'year',
      yearSeg: scope.yearSeg,
      courseSeg: scope.courseSeg || '',
      coursePrefix: scope.coursePrefix || (scope.yearSeg && scope.courseSeg ? scope.yearSeg + '/' + scope.courseSeg + '/' : ''),
      yearPrefix: scope.yearPrefix || (scope.yearSeg ? scope.yearSeg + '/' : ''),
      relPath: scope.relPath || currentRelPath()
    };
  }

  function collectCoursePickerOptions(scope) {
    const sc = coursePickerYearScope(scope);
    if (!sc || !sc.yearSeg) return [];
    const nodes = collectCourseNodes(sc);
    const out = [];
    const seen = new Set();

    nodes.forEach(function (entry) {
      const node = entry && entry.node;
      const entryScope = entry && entry.scope;
      if (!(node instanceof HTMLElement) || !entryScope || !entryScope.courseSeg) return;
      const key = entryScope.yearSeg + '/' + entryScope.courseSeg;
      if (seen.has(key)) return;
      seen.add(key);

      const titleEl = directNavLink(node) || node.querySelector('.md-nav__link');
      const title = cleanTitle(titleEl ? titleEl.textContent : '') || entryScope.courseSeg;
      const href = currentBarScopeHref(node, entryScope) || absoluteSiteHref(entryScope.coursePrefix || key + '/');
      out.push({ node: node, scope: entryScope, title: title, href: href });
    });

    return out;
  }

  function closeCoursePickerMenus(exceptBar) {
    asArray(document.querySelectorAll('#current-course-bar')).forEach(function (bar) {
      if (!(bar instanceof HTMLElement) || (exceptBar && bar === exceptBar)) return;
      setCoursePickerOpen(bar, false);
    });
  }

  function courseMenuScrollbarArrowOffset() {
    const root = runtime.courseMenuScrollbar.root;
    if (root instanceof HTMLElement) {
      try {
        const raw = window.getComputedStyle(root).getPropertyValue('--msb-course-menu-scrollbar-arrow-h');
        const n = parseFloat(raw);
        if (Number.isFinite(n) && n >= 0) return n;
      } catch (_) {}
    }
    return 18;
  }

  function markCourseMenuScrollbarHot(delay) {
    const st = runtime.courseMenuScrollbar;
    const root = st.root;
    if (root instanceof HTMLElement) root.classList.add('is-hot');
    if (st.hotTimer) window.clearTimeout(st.hotTimer);
    st.hotTimer = window.setTimeout(function () {
      st.hotTimer = 0;
      if (!st.dragging && st.root instanceof HTMLElement) st.root.classList.remove('is-hot');
    }, Math.max(0, Number(delay) || 520));
  }

  function ensureCourseMenuScrollbar() {
    const st = runtime.courseMenuScrollbar;
    if (st.root && st.root.isConnected) return st.root;

    const root = document.createElement('div');
    root.id = 'msb-course-menu-scrollbar';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<div class="msb-course-menu-scrollbar__track"></div><div class="msb-course-menu-scrollbar__thumb"></div>';
    (host instanceof HTMLElement ? host : (document.body || document.documentElement)).appendChild(root);

    st.root = root;
    st.thumb = root.querySelector('.msb-course-menu-scrollbar__thumb');

    if (!st.bound) {
      st.bound = true;

      root.addEventListener('pointerdown', function (event) {
        const menu = st.menu;
        if (!(menu instanceof HTMLElement)) return;
        const track = root.getBoundingClientRect();
        if (!track || track.height <= 0) return;
        const arrowOffset = courseMenuScrollbarArrowOffset();
        const usableH = Math.max(24, track.height - arrowOffset * 2);
        const thumb = st.thumb instanceof HTMLElement ? st.thumb : null;
        const thumbRect = thumb ? thumb.getBoundingClientRect() : null;
        const maxScroll = Math.max(1, menu.scrollHeight - menu.clientHeight);
        const thumbH = thumbRect && thumbRect.height > 0 ? thumbRect.height : Math.max(24, usableH * menu.clientHeight / Math.max(menu.scrollHeight, 1));
        const movable = Math.max(1, usableH - thumbH);

        event.preventDefault();
        event.stopPropagation();
        markCourseMenuScrollbarHot(900);

        if (thumb && event.target === thumb) {
          st.dragging = true;
          st.dragStartY = Number(event.clientY) || 0;
          st.dragStartScrollTop = menu.scrollTop;
          root.classList.add('is-dragging', 'is-hot');
          try { root.setPointerCapture(event.pointerId); } catch (_) {}
          return;
        }

        const y = clamp((Number(event.clientY) || 0) - track.top - arrowOffset - thumbH / 2, 0, movable);
        menu.scrollTop = (y / movable) * maxScroll;
        scheduleCourseMenuScrollbarUpdate();
      }, { passive: false });

      root.addEventListener('pointermove', function (event) {
        if (!st.dragging) return;
        const menu = st.menu;
        if (!(menu instanceof HTMLElement)) return;
        const track = root.getBoundingClientRect();
        if (!track || track.height <= 0) return;
        const arrowOffset = courseMenuScrollbarArrowOffset();
        const usableH = Math.max(24, track.height - arrowOffset * 2);
        const thumb = st.thumb instanceof HTMLElement ? st.thumb : null;
        const thumbRect = thumb ? thumb.getBoundingClientRect() : null;
        const thumbH = thumbRect && thumbRect.height > 0 ? thumbRect.height : Math.max(24, usableH * menu.clientHeight / Math.max(menu.scrollHeight, 1));
        const movable = Math.max(1, usableH - thumbH);
        const maxScroll = Math.max(1, menu.scrollHeight - menu.clientHeight);
        const dy = (Number(event.clientY) || 0) - st.dragStartY;
        menu.scrollTop = clamp(st.dragStartScrollTop + dy / movable * maxScroll, 0, maxScroll);
        markCourseMenuScrollbarHot(900);
        scheduleCourseMenuScrollbarUpdate();
      }, { passive: true });

      function endDrag(event) {
        if (!st.dragging) return;
        st.dragging = false;
        root.classList.remove('is-dragging');
        markCourseMenuScrollbarHot(260);
        try { root.releasePointerCapture(event.pointerId); } catch (_) {}
      }
      root.addEventListener('pointerup', endDrag, { passive: true });
      root.addEventListener('pointercancel', endDrag, { passive: true });

      root.addEventListener('wheel', function (event) {
        const menu = st.menu;
        if (!(menu instanceof HTMLElement)) return;
        const maxScroll = Math.max(0, menu.scrollHeight - menu.clientHeight);
        if (maxScroll <= 0) return;

        let dy = Number(event.deltaY) || 0;
        if (event.deltaMode === 1) dy *= 32;
        else if (event.deltaMode === 2) dy *= Math.max(1, menu.clientHeight);
        if (!dy) return;

        event.preventDefault();
        event.stopPropagation();
        menu.scrollTop = clamp(menu.scrollTop + dy, 0, maxScroll);
        markCourseMenuScrollbarHot(520);
        scheduleCourseMenuScrollbarUpdate();
      }, { passive: false });

      window.addEventListener('resize', scheduleCourseMenuScrollbarUpdate, { passive: true });
      window.addEventListener('scroll', scheduleCourseMenuScrollbarUpdate, { passive: true });
      if (window.visualViewport) {
        try { window.visualViewport.addEventListener('resize', scheduleCourseMenuScrollbarUpdate, { passive: true }); } catch (_) {}
        try { window.visualViewport.addEventListener('scroll', scheduleCourseMenuScrollbarUpdate, { passive: true }); } catch (_) {}
      }
    }

    return root;
  }

  function hideCourseMenuScrollbar() {
    const st = runtime.courseMenuScrollbar;
    if (st.root instanceof HTMLElement) st.root.classList.remove('is-visible', 'is-dragging', 'is-hot');
    st.dragging = false;
    st.menu = null;
  }

  function updateCourseMenuScrollbar() {
    const st = runtime.courseMenuScrollbar;
    const menu = st.menu;
    if (!(menu instanceof HTMLElement) || menu.hidden || !menu.isConnected) {
      hideCourseMenuScrollbar();
      return;
    }

    const rect = menu.getBoundingClientRect();
    const maxScroll = Math.max(0, menu.scrollHeight - menu.clientHeight);
    if (!rect || rect.width <= 4 || rect.height <= 32 || maxScroll <= 2) {
      hideCourseMenuScrollbar();
      return;
    }

    const root = ensureCourseMenuScrollbar();
    const thumb = st.thumb;
    const barW = root instanceof HTMLElement ? (root.getBoundingClientRect().width || 9) : 9;
    const insetRight = 6;
    const left = Math.round(rect.right - insetRight - barW);
    const top = Math.round(rect.top + 2);
    const height = Math.max(44, Math.round(rect.height - 4));

    root.style.left = String(left) + 'px';
    root.style.top = String(top) + 'px';
    root.style.height = String(height) + 'px';

    const arrowOffset = courseMenuScrollbarArrowOffset();
    const usableH = Math.max(24, height - arrowOffset * 2);
    const thumbH = clamp(Math.round(usableH * menu.clientHeight / Math.max(menu.scrollHeight, 1)), 24, usableH);
    const movable = Math.max(0, usableH - thumbH);
    const thumbY = arrowOffset + (maxScroll > 0 ? Math.round(movable * menu.scrollTop / maxScroll) : 0);

    if (thumb instanceof HTMLElement) {
      thumb.style.height = String(thumbH) + 'px';
      thumb.style.setProperty('--msb-course-menu-scrollbar-thumb-y', String(thumbY) + 'px');
    }

    root.classList.add('is-visible');
  }

  function scheduleCourseMenuScrollbarUpdate() {
    const st = runtime.courseMenuScrollbar;
    if (st.raf) return;
    st.raf = requestAnimationFrame(function () {
      st.raf = 0;
      updateCourseMenuScrollbar();
    });
  }

  function bindCourseMenuCustomScrollbar(menu) {
    if (!(menu instanceof HTMLElement)) return;
    runtime.courseMenuScrollbar.menu = menu;
    ensureCourseMenuScrollbar();
    scheduleCourseMenuScrollbarUpdate();
  }

  function bindCoursePickerScrollbarHotState(menu) {
    if (!(menu instanceof HTMLElement) || menu.dataset.msbScrollbarHotBound === '1') return;
    menu.dataset.msbScrollbarHotBound = '1';
    let hotTimer = 0;
    function clearLater(delay) {
      if (hotTimer) window.clearTimeout(hotTimer);
      hotTimer = window.setTimeout(function () {
        hotTimer = 0;
        menu.classList.remove('is-msb-scrollbar-hot');
      }, Math.max(0, Number(delay) || 240));
    }
    function markHot(delay) {
      const d = delay == null ? 420 : delay;
      menu.classList.add('is-msb-scrollbar-hot');
      markCourseMenuScrollbarHot(d);
      clearLater(d);
    }
    menu.addEventListener('scroll', function () { markHot(520); scheduleCourseMenuScrollbarUpdate(); }, { passive: true });
    menu.addEventListener('wheel', function (event) {
      const maxScroll = Math.max(0, menu.scrollHeight - menu.clientHeight);
      if (maxScroll <= 0) return;
      let dy = Number(event.deltaY) || 0;
      if (event.deltaMode === 1) dy *= 32;
      else if (event.deltaMode === 2) dy *= Math.max(1, menu.clientHeight);
      if (!dy) return;
      event.preventDefault();
      event.stopPropagation();
      menu.scrollTop = clamp(menu.scrollTop + dy, 0, maxScroll);
      markHot(520);
      scheduleCourseMenuScrollbarUpdate();
    }, { passive: false });
    menu.addEventListener('pointerdown', function () { markHot(900); scheduleCourseMenuScrollbarUpdate(); }, { passive: true });
    menu.addEventListener('pointerup', function () { clearLater(180); }, { passive: true });
    menu.addEventListener('pointercancel', function () { clearLater(180); }, { passive: true });
    menu.addEventListener('mouseleave', function () { clearLater(120); }, { passive: true });
  }

  function setCoursePickerOpen(bar, open) {
    if (!(bar instanceof HTMLElement)) return;
    const trigger = bar.querySelector('.ccb-course-trigger');
    const menu = bar.querySelector('.ccb-menu');
    const next = !!open;
    bar.dataset.courseMenuOpen = next ? '1' : '0';
    if (trigger instanceof HTMLElement) trigger.setAttribute('aria-expanded', next ? 'true' : 'false');
    if (menu instanceof HTMLElement) {
      bindCoursePickerScrollbarHotState(menu);
      menu.hidden = !next;
      if (next) {
        /* v89: The course picker is a full-height dropdown.  Do not attach the
           detached custom scrollbar or auto-scroll the current item; both make
           the menu feel like a scroll panel rather than a simple course list. */
        hideCourseMenuScrollbar();
      } else if (runtime.courseMenuScrollbar.menu === menu) {
        hideCourseMenuScrollbar();
      }
    }
  }

  function bindCoursePickerGlobalClose() {
    if (runtime.coursePickerBound) return;
    runtime.coursePickerBound = true;

    document.addEventListener('click', function (event) {
      const target = event.target instanceof Element ? event.target : null;
      if (target && target.closest && target.closest('#current-course-bar')) return;
      closeCoursePickerMenus(null);
    }, true);

    document.addEventListener('keydown', function (event) {
      if (!event || event.key !== 'Escape') return;
      closeCoursePickerMenus(null);
    }, true);
  }

  function renderCoursePickerMenu(menu, options, scope) {
    if (!(menu instanceof HTMLElement)) return;
    bindCoursePickerScrollbarHotState(menu);
    menu.textContent = '';

    if (!options.length) {
      const empty = document.createElement('div');
      empty.className = 'ccb-menu-empty';
      empty.textContent = 'No course list available here.';
      menu.appendChild(empty);
      return;
    }

    options.forEach(function (option) {
      const a = document.createElement('a');
      a.className = 'ccb-menu-item';
      a.setAttribute('role', 'menuitem');
      a.href = option.href || '#';
      const current = !!(scope && scope.kind === 'course' && isSameCourseScope(option.scope, scope));
      if (current) {
        a.classList.add('is-current');
        a.setAttribute('aria-current', 'page');
      }

      const label = document.createElement('span');
      label.className = 'ccb-menu-item-title';
      label.textContent = option.title || option.scope.courseSeg || '';
      a.appendChild(label);

      a.addEventListener('click', function () {
        closeCoursePickerMenus(null);
      });

      menu.appendChild(a);
    });
  }

  function syncCurrentCoursePicker(bar, scope, fallbackTitle) {
    if (!(bar instanceof HTMLElement)) return;
    const trigger = bar.querySelector('.ccb-course-trigger');
    const titleSpan = bar.querySelector('.ccb-title');
    const kicker = bar.querySelector('.ccb-kicker');
    const menu = bar.querySelector('.ccb-menu');
    if (!(trigger instanceof HTMLElement) || !(menu instanceof HTMLElement)) return;

    const options = collectCoursePickerOptions(scope);
    const currentOption = options.find(function (option) {
      return !!(scope && scope.kind === 'course' && isSameCourseScope(option.scope, scope));
    });
    const label = (currentOption && currentOption.title) || fallbackTitle || (scope && scope.kind === 'year' ? 'Select a course' : 'Course');

    if (titleSpan instanceof HTMLElement) titleSpan.textContent = label;
    if (kicker instanceof HTMLElement) kicker.textContent = options.length ? 'Course' : 'Scope';

    trigger.disabled = !options.length;
    trigger.title = options.length ? 'Choose a course' : label;
    trigger.setAttribute('aria-label', options.length ? ('Choose course. Current: ' + label) : label);
    trigger.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!options.length) return;
      const wasOpen = bar.dataset.courseMenuOpen === '1';
      closeCoursePickerMenus(bar);
      setCoursePickerOpen(bar, !wasOpen);
    };

    renderCoursePickerMenu(menu, options, scope);
    if (bar.dataset.courseMenuOpen === '1') setCoursePickerOpen(bar, true);
    else setCoursePickerOpen(bar, false);
    bindCoursePickerGlobalClose();
  }

  function syncCurrentCourseBarButton(bar, scope, titleText) {
    if (!(bar instanceof HTMLElement)) return;
    const toggleBtn = bar.querySelector('.ccb-toggle');
    const icon = bar.querySelector('.ccb-icon');
    const canToggle = !!(scope && scope.kind === 'course');

    if (!(toggleBtn instanceof HTMLElement) || !(icon instanceof Element) || !canToggle) {
      bar.dataset.hasToggle = '0';
      if (toggleBtn instanceof HTMLElement) {
        toggleBtn.hidden = true;
        toggleBtn.onclick = null;
      }
      return;
    }

    const open = readCurrentScopeOpen(scope, true);
    bar.dataset.hasToggle = '1';
    toggleBtn.hidden = false;
    icon.classList.toggle('is-open', !!open);
    toggleBtn.setAttribute('aria-label', (open ? 'Collapse ' : 'Expand ') + titleText);
    toggleBtn.title = (open ? 'Collapse ' : 'Expand ') + titleText;
    toggleBtn.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      const nextOpen = toggleCurrentCourse();
      icon.classList.toggle('is-open', !!nextOpen);
      toggleBtn.setAttribute('aria-label', (nextOpen ? 'Collapse ' : 'Expand ') + titleText);
      toggleBtn.title = (nextOpen ? 'Collapse ' : 'Expand ') + titleText;
      requestAnimationFrame(function () {
        updateStickyMetrics();
        emitCurrentCourseBarLayoutChanged();
      });
    };
  }

  function applyCurrentCourseBar(scrollWrap, scope) {
    const wrap = scrollWrap instanceof HTMLElement ? scrollWrap : getScrollWrap();
    if (!(wrap instanceof HTMLElement)) return null;

    const effectiveScope = scope && typeof scope === 'object' ? scope : inferScope();
    const existing = wrap.querySelector('#current-course-bar');
    const show = !!(effectiveScope && (effectiveScope.kind === 'year' || effectiveScope.kind === 'course'));

    if (!show) {
      if (existing instanceof HTMLElement) {
        existing.style.display = 'none';
        existing.dataset.hasToggle = '0';
      }
      return null;
    }

    const bar = ensureCurrentCourseBarNode(wrap);
    if (!(bar instanceof HTMLElement)) return null;

    const scopeNode = currentBarScopeNode(effectiveScope);
    const titleEl = scopeNode instanceof HTMLElement ? (directNavLink(scopeNode) || scopeNode.querySelector('.md-nav__link')) : null;
    const titleText = effectiveScope.kind === 'year'
      ? 'Select a course'
      : cleanTitle(titleEl ? titleEl.textContent : '');
    if (!titleText) {
      bar.style.display = 'none';
      return bar;
    }

    const titleSpan = bar.querySelector('.ccb-title');
    if (titleSpan instanceof HTMLElement) titleSpan.textContent = titleText;

    bar.style.display = '';
    bar.style.top = '0px';
    bar.dataset.scopeKind = effectiveScope.kind || '';
    bar.dataset.yearSeg = effectiveScope.yearSeg || '';
    bar.dataset.courseSeg = effectiveScope.courseSeg || '';
    bar.dataset.hasToggle = '0';
    syncCurrentCoursePicker(bar, effectiveScope, titleText);
    return bar;
  }


  function ensureControl(scrollWrap, scopeKind) {
    if (!scrollWrap) return null;
    let node = scrollWrap.querySelector("#" + IDS.control);
    if (!node) {
      node = document.createElement("div");
      node.id = IDS.control;
      node.className = CLS.dock;
      node.setAttribute(ATTR.injected, "1");
      node.innerHTML =
        '<div class="' + CLS.dockBox + '">' +
          '<span class="' + CLS.dockLabel + '">Sort by</span>' +
          '<button type="button" class="' + CLS.dockButton + '"></button>' +
        '</div>';
      const bar = scrollWrap.querySelector("#current-course-bar");
      if (bar && bar.parentElement === scrollWrap) bar.insertAdjacentElement("afterend", node);
      else scrollWrap.prepend(node);
    } else {
      const bar = scrollWrap.querySelector("#current-course-bar");
      if (bar && node.previousElementSibling !== bar) bar.insertAdjacentElement("afterend", node);
    }

    const btn = node.querySelector("." + CLS.dockButton);
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const scope = inferScope();
        if (!scope.kind) return;
        const cur = readMode(scope.kind);
        const next = nextMode(scope.kind, cur);
        writeMode(scope.kind, next);
        scheduleRefresh("mode-toggle");
      });
    }

    if (scopeKind) {
      const mode = readMode(scopeKind);
      updateControlUi(node, scopeKind, mode);
      node.style.display = "";
    }

    return node;
  }

  function updateControlUi(control, kind, mode) {
    if (!control) return;
    const btn = control.querySelector("." + CLS.dockButton);
    if (!btn) return;
    const next = nextMode(kind, mode);
    btn.textContent = modeLabel(kind, mode);
    btn.title = modeTitle(kind, mode) + ". Click to switch to " + modeLabel(kind, next) + ".";
    btn.setAttribute("aria-label", btn.title);
    control.dataset.kind = kind;
    control.dataset.mode = mode;

    const wrap = getScrollWrap();
    if (wrap) {
      wrap.setAttribute(ATTR.sortKind, kind);
      wrap.setAttribute(ATTR.sortMode, mode);
    }
  }

  function ensureBaseIndex(li, fallback) {
    const existing = parseInt(li.getAttribute(ATTR.baseIndex) || "", 10);
    if (Number.isFinite(existing)) return existing;
    li.setAttribute(ATTR.baseIndex, String(fallback));
    return fallback;
  }

  function clearGroupClasses(li) {
    if (!li || !li.classList) return;
    li.classList.remove(CLS.lead, CLS.first, CLS.mid, CLS.last, CLS.single, CLS.hover);
  }

  function cleanupList(list) {
    if (!list) return;
    asArray(list.querySelectorAll(':scope > .md-nav__item[' + ATTR.syntheticGroup + '="1"]')).forEach(function (li) {
      try { li.remove(); } catch (_) {}
    });
    const children = asArray(list.children);
    for (let i = 0; i < children.length; i += 1) {
      const li = children[i];
      if (!isElement(li)) continue;
      asArray(li.querySelectorAll(':scope > [' + ATTR.injected + '="1"]')).forEach(function (node) {
        if (node && node.parentNode) node.parentNode.removeChild(node);
      });
      clearGroupClasses(li);
      li.removeAttribute(ATTR.group);
      li.removeAttribute(ATTR.groupKind);
      li.removeAttribute(ATTR.groupOpen);
      li.removeAttribute(ATTR.groupCollapsedItem);
      li.removeAttribute(ATTR.groupCollapsedLead);
      li.removeAttribute(ATTR.duplicateCurrent);
      li.removeAttribute(ATTR.courseKey);
      li.hidden = false;
      if (li.style) li.style.removeProperty("display");
    }
    const host = list.parentElement && list.parentElement.closest ? list.parentElement.closest(".md-nav__item--nested") : null;
    if (host) host.removeAttribute(ATTR.scopeCollapsed);
    list.hidden = false;
    if (list.style) list.style.removeProperty("display");
    list.removeAttribute("data-msb-hover-group");
  }

  function suppressTocTakeover(root) {
    if (!root) return;

    function isTocText(text) {
      const norm = cleanTitle(text).toLowerCase();
      return norm === "table of contents" || norm === "contents";
    }

    function isHashHref(href) {
      return /^#/.test(String(href || "").trim());
    }

    function removeNode(node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }

    const tocInputs = asArray(root.querySelectorAll('input#__toc, input[data-md-toggle="toc"]'));
    tocInputs.forEach(function (input) {
      const li = input.closest ? input.closest(".md-nav__item") : null;
      const label = li ? li.querySelector(':scope > label.md-nav__link[for="__toc"]') : null;
      const anchor = li ? li.querySelector(':scope > a.md-nav__link[href]') : null;
      const tocNav = li ? li.querySelector(':scope > nav.md-nav') : null;

      if (li && label && anchor && cleanTitle(label.textContent) === cleanTitle(anchor.textContent)) {
        label.remove();
        li.setAttribute(ATTR.duplicateCurrent, "label");
      }

      removeNode(tocNav);
      removeNode(input);
    });

    asArray(root.querySelectorAll('.md-nav__item')).forEach(function (li) {
      const directLabel = li.querySelector(':scope > label.md-nav__link');
      const directAnchor = li.querySelector(':scope > a.md-nav__link[href], :scope > .md-nav__link[href]');
      const forAttr = directLabel && directLabel.getAttribute ? (directLabel.getAttribute("for") || "") : "";
      const href = directAnchor && directAnchor.getAttribute ? (directAnchor.getAttribute("href") || "") : "";
      const labelText = cleanTitle((directAnchor || directLabel) ? (directAnchor || directLabel).textContent : "");

      if (forAttr === "__toc" || isHashHref(href) || isTocText(labelText)) {
        removeNode(li);
        return;
      }

      const directNav = li.querySelector(':scope > nav.md-nav');
      if (!directNav) return;

      const directHashItems = asArray(directNav.querySelectorAll(':scope > .md-nav__list > .md-nav__item')).filter(function (child) {
        const a = child.querySelector(':scope > a.md-nav__link[href], :scope > .md-nav__link[href]');
        const h = a && a.getAttribute ? (a.getAttribute("href") || "") : "";
        const t = cleanTitle(a ? a.textContent : "");
        return isHashHref(h) || isTocText(t);
      });

      directHashItems.forEach(removeNode);

      const hasAnyHash = !!directNav.querySelector('a.md-nav__link[href^="#"], .md-nav__link[href^="#"]');
      const hasAnyItems = !!directNav.querySelector(':scope > .md-nav__list > .md-nav__item');
      if (hasAnyHash || !hasAnyItems) removeNode(directNav);
    });
  }

  function bindHover(list) {
    if (!list || runtime.hoverBindings.has(list)) return;
    if (isTouchLikeViewport()) return;
    runtime.hoverBindings.add(list);

    function rowFromEventTarget(target) {
      let el = target instanceof Element ? target : null;
      while (el && el.parentElement !== list) el = el.parentElement;
      return el && el.parentElement === list ? el : null;
    }

    function setGroup(groupId) {
      const current = list.getAttribute("data-msb-hover-group") || "";
      if (current === groupId) return;
      list.setAttribute("data-msb-hover-group", groupId || "");
      asArray(list.children).forEach(function (li) {
        if (!isElement(li)) return;
        const on = !!groupId && li.getAttribute(ATTR.group) === groupId;
        li.classList.toggle(CLS.hover, on);
      });
    }

    list.addEventListener("pointerover", function (event) {
      const row = rowFromEventTarget(event.target);
      setGroup(row ? row.getAttribute(ATTR.group) || "" : "");
    }, { passive: true });

    list.addEventListener("pointerleave", function () {
      setGroup("");
    }, { passive: true });

    list.addEventListener("focusin", function (event) {
      const row = rowFromEventTarget(event.target);
      setGroup(row ? row.getAttribute(ATTR.group) || "" : "");
    });

    list.addEventListener("focusout", function () {
      requestAnimationFrame(function () {
        const active = document.activeElement;
        const row = rowFromEventTarget(active);
        if (!row) setGroup("");
      });
    });
  }

  function clearSidebarTouchArtifacts(scrollWrap) {
    if (!scrollWrap) return;
    try {
      const sel = window.getSelection && window.getSelection();
      if (sel && sel.rangeCount) sel.removeAllRanges();
    } catch (_) {}
    try {
      const active = document.activeElement;
      if (active && scrollWrap.contains(active) && typeof active.blur === "function") active.blur();
    } catch (_) {}
    asArray(scrollWrap.querySelectorAll('[data-msb-hover-group]')).forEach(function (list) {
      try {
        list.setAttribute('data-msb-hover-group', '');
      } catch (_) {}
    });
    asArray(scrollWrap.querySelectorAll('.md-nav__item.' + CLS.hover)).forEach(function (li) {
      li.classList.remove(CLS.hover);
    });
  }

  function bindTouchCleanup(scrollWrap) {
    if (!scrollWrap) return;
    if (runtime.touchCleanupBindings && runtime.touchCleanupBindings.has(scrollWrap)) return;
    if (runtime.touchCleanupBindings) runtime.touchCleanupBindings.add(scrollWrap);

    const TOUCH_SENSITIVITY = 1.14;
    const DIRECTION_LOCK_PX = 4;
    const MOMENTUM_MIN_VELOCITY = 0.06; // px/ms
    const MOMENTUM_MAX_VELOCITY = 3.2;  // px/ms
    const MOMENTUM_DECAY = 0.94;        // per ~16.7ms frame
    const MOMENTUM_STOP_VELOCITY = 0.02;
    const MOMENTUM_IDLE_CUTOFF_MS = 88;
    const VELOCITY_BLEND = 0.24;

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let moved = false;
    let isVertical = false;
    let cooldownTimer = 0;
    let lastMoveTs = 0;
    let velocityY = 0;
    let momentumRaf = 0;
    let momentumLastTs = 0;
    let gestureMinScroll = 0;
    let gestureMaxScroll = 0;

    function clampNumber(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function refreshGestureBounds() {
      try {
        gestureMinScroll = computeMobileScopeMinScrollTop(scrollWrap);
        gestureMaxScroll = Math.max(0, (scrollWrap.scrollHeight || 0) - (scrollWrap.clientHeight || 0));
      } catch (_) {
        gestureMinScroll = 0;
        gestureMaxScroll = Math.max(0, (scrollWrap.scrollHeight || 0) - (scrollWrap.clientHeight || 0));
      }
    }

    function readTouch(event) {
      const t = event && event.touches && event.touches[0]
        ? event.touches[0]
        : (event && event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : null);
      return t || null;
    }

    function stopMomentum() {
      if (momentumRaf) {
        try {
          window.cancelAnimationFrame(momentumRaf);
        } catch (_) {}
      }
      momentumRaf = 0;
      momentumLastTs = 0;
      velocityY = 0;
    }

    function beginCooldown() {
      try {
        scrollWrap.setAttribute('data-msb-touch-cooldown', '1');
      } catch (_) {}
      if (cooldownTimer) window.clearTimeout(cooldownTimer);
      cooldownTimer = window.setTimeout(function () {
        try {
          scrollWrap.removeAttribute('data-msb-touch-cooldown');
        } catch (_) {}
        clearSidebarTouchArtifacts(scrollWrap);
      }, 220);
    }

    function finishGesture() {
      beginCooldown();
      requestAnimationFrame(function () {
        clearSidebarTouchArtifacts(scrollWrap);
      });
      window.setTimeout(function () {
        try {
          scrollWrap.removeAttribute('data-msb-touch-scrolling');
        } catch (_) {}
        clearSidebarTouchArtifacts(scrollWrap);
      }, 160);
    }

    function startMomentum(initialVelocity) {
      let v = clampNumber(Number(initialVelocity) || 0, -MOMENTUM_MAX_VELOCITY, MOMENTUM_MAX_VELOCITY);
      if (Math.abs(v) < MOMENTUM_MIN_VELOCITY) {
        finishGesture();
        return;
      }

      stopMomentum();
      refreshGestureBounds();
      velocityY = v;
      momentumLastTs = 0;

      function step(ts) {
        if (!scrollWrap || !scrollWrap.isConnected) {
          stopMomentum();
          return;
        }
        if (!momentumLastTs) momentumLastTs = ts;
        const dt = clampNumber(ts - momentumLastTs, 8, 34);
        momentumLastTs = ts;

        const minScroll = gestureMinScroll || 0;
        const maxScroll = gestureMaxScroll || Math.max(0, (scrollWrap.scrollHeight || 0) - (scrollWrap.clientHeight || 0));
        const prevTop = scrollWrap.scrollTop || 0;
        const nextTop = clampNumber(prevTop + velocityY * dt, minScroll, maxScroll);
        scrollWrap.scrollTop = nextTop;
        syncDrawerGhostFloorScrollOnly();

        const hitEdge = Math.abs(nextTop - prevTop) < 0.1 && ((nextTop <= minScroll && velocityY < 0) || (nextTop >= maxScroll && velocityY > 0));
        velocityY *= Math.pow(MOMENTUM_DECAY, dt / 16.7);

        if (hitEdge || Math.abs(velocityY) < MOMENTUM_STOP_VELOCITY) {
          stopMomentum();
          finishGesture();
          return;
        }

        try {
          scrollWrap.setAttribute('data-msb-touch-scrolling', '1');
        } catch (_) {}
        momentumRaf = window.requestAnimationFrame(step);
      }

      try {
        scrollWrap.setAttribute('data-msb-touch-scrolling', '1');
      } catch (_) {}
      momentumRaf = window.requestAnimationFrame(step);
    }

    scrollWrap.addEventListener('touchstart', function (event) {
      stopMomentum();
      const t = readTouch(event);
      startX = t ? t.clientX : 0;
      startY = t ? t.clientY : 0;
      lastY = startY;
      moved = false;
      isVertical = false;
      lastMoveTs = Number(event && event.timeStamp) || 0;
      velocityY = 0;
      refreshGestureBounds();
      if (cooldownTimer) {
        window.clearTimeout(cooldownTimer);
        cooldownTimer = 0;
      }
      try {
        scrollWrap.removeAttribute('data-msb-touch-scrolling');
        scrollWrap.removeAttribute('data-msb-touch-cooldown');
      } catch (_) {}
    }, { passive: true });

    // Non-passive so we can call preventDefault() to stop the page scrolling.
    // We manually drive scrollWrap.scrollTop for vertical swipes so the sidebar
    // scrolls instead of the page behind the drawer overlay, then add a small
    // momentum tail so it feels closer to native page scrolling on phones.
    scrollWrap.addEventListener('touchmove', function (event) {
      const t = readTouch(event);
      if (!t) return;
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);

      // Direction lock: decide on first meaningful move
      if (!moved && (dx > DIRECTION_LOCK_PX || dy > DIRECTION_LOCK_PX)) {
        isVertical = dy >= dx;
        moved = true;
      }

      if (isVertical) {
        // Prevent the browser scrolling the page behind the sidebar.
        event.preventDefault();
        const nowTs = Number(event && event.timeStamp) || 0;
        const dt = clampNumber((nowTs && lastMoveTs) ? (nowTs - lastMoveTs) : 16, 8, 40);

        // Manually advance the scrollwrap's scroll position.
        const delta = (lastY - t.clientY) * TOUCH_SENSITIVITY;
        const minScroll = gestureMinScroll || 0;
        const maxScroll = gestureMaxScroll || Math.max(0, (scrollWrap.scrollHeight || 0) - (scrollWrap.clientHeight || 0));
        scrollWrap.scrollTop = clampNumber((scrollWrap.scrollTop || 0) + delta, minScroll, maxScroll);
        syncDrawerGhostFloorScrollOnly();

        const instantVelocity = delta / dt;
        velocityY = velocityY
          ? (velocityY * (1 - VELOCITY_BLEND)) + (instantVelocity * VELOCITY_BLEND)
          : instantVelocity;
        velocityY = clampNumber(velocityY, -MOMENTUM_MAX_VELOCITY, MOMENTUM_MAX_VELOCITY);
        lastMoveTs = nowTs || lastMoveTs;

        try {
          scrollWrap.setAttribute('data-msb-touch-scrolling', '1');
        } catch (_) {}
        clearSidebarTouchArtifacts(scrollWrap);
      }
      lastY = t.clientY;
    }, { passive: false });

    function handleTouchEnd(event) {
      if (!moved) {
        stopMomentum();
        try {
          scrollWrap.removeAttribute('data-msb-touch-scrolling');
        } catch (_) {}
        return;
      }

      const nowTs = Number(event && event.timeStamp) || 0;
      if (nowTs && lastMoveTs && (nowTs - lastMoveTs) > MOMENTUM_IDLE_CUTOFF_MS) {
        velocityY = 0;
      }

      requestAnimationFrame(function () {
        clearSidebarTouchArtifacts(scrollWrap);
      });

      if (isVertical && Math.abs(velocityY) >= MOMENTUM_MIN_VELOCITY) {
        startMomentum(velocityY);
        return;
      }

      stopMomentum();
      finishGesture();
    }

    scrollWrap.addEventListener('touchend', handleTouchEnd, { passive: true });
    scrollWrap.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }

  function markGroupBoundaries(list) {
    if (!list) return;
    const visible = asArray(list.children).filter(function (li) {
      return isElement(li) && !li.hidden && li.getAttribute(ATTR.groupCollapsedItem) !== "1";
    });

    asArray(list.children).forEach(function (li) {
      if (!isElement(li)) return;
      li.classList.remove(CLS.first, CLS.mid, CLS.last, CLS.single);
    });

    for (let i = 0; i < visible.length; i += 1) {
      const li = visible[i];
      const groupId = li.getAttribute(ATTR.group) || "";
      if (!groupId) continue;
      const prevGroup = i > 0 ? (visible[i - 1].getAttribute(ATTR.group) || "") : "";
      const nextGroup = i + 1 < visible.length ? (visible[i + 1].getAttribute(ATTR.group) || "") : "";
      const isFirst = groupId !== prevGroup;
      const isLast = groupId !== nextGroup;
      li.classList.add(isFirst && isLast ? CLS.single : isFirst ? CLS.first : isLast ? CLS.last : CLS.mid);
    }
  }

  function findYearNode(yearSeg) {
    if (!yearSeg) return null;
    const wantA = yearSeg + "/";
    const wantB = yearSeg + "/index.html";
    const links = asArray(document.querySelectorAll('.md-sidebar--primary a.md-nav__link, .md-sidebar--primary label.md-nav__link'));
    for (let i = 0; i < links.length; i += 1) {
      const rel = normaliseHrefToRel(links[i].getAttribute && links[i].getAttribute("href"));
      if (rel === wantA || rel === wantB) return links[i].closest(".md-nav__item");
    }
    return null;
  }

  function findCourseNode(scope) {
    if (!scope || scope.kind !== "course") return null;
    const sidebar = getPrimarySidebar();
    if (!sidebar) return null;

    const coursePrefix = scope.yearSeg + "/" + scope.courseSeg + "/";
    const exactA = coursePrefix;
    const exactB = coursePrefix + "index.html";
    const nested = asArray(sidebar.querySelectorAll(".md-nav__item--nested"));

    for (let i = 0; i < nested.length; i += 1) {
      const direct = directNavLink(nested[i]);
      const rel = normaliseHrefToRel(direct && direct.getAttribute ? direct.getAttribute("href") : "");
      if (rel === exactA || rel === exactB) {
        return nested[i];
      }
    }

    const active =
      sidebar.querySelector('a.md-nav__link[aria-current="page"]') ||
      sidebar.querySelector("a.md-nav__link--active") ||
      sidebar.querySelector(".md-nav__link--active");

    let cur = active ? active.closest(".md-nav__item") : null;
    while (cur) {
      if (cur.classList && cur.classList.contains("md-nav__item--nested")) {
        const list = directChildList(cur);
        const links = list ? asArray(list.children).map(directNavLink).filter(Boolean) : [];
        const ok = links.some(function (a) {
          const rel = normaliseHrefToRel(a.getAttribute("href"));
          return rel.startsWith(coursePrefix) && /\.html?$/i.test(rel);
        });
        if (ok) {
          return cur;
        }
      }
      cur = cur.parentElement ? cur.parentElement.closest(".md-nav__item") : null;
    }

    return null;
  }

  function courseScopeFromNode(node, yearSeg, currentScope) {
    if (!node || !yearSeg) return null;

    const direct = directNavLink(node);
    let rel = normaliseHrefToRel(direct && direct.getAttribute ? direct.getAttribute("href") : "");
    let courseSeg = courseSegFromRel(rel, yearSeg);

    if (!courseSeg) {
      const anchors = asArray(node.querySelectorAll(':scope > nav.md-nav > .md-nav__list > .md-nav__item > a.md-nav__link[href], a.md-nav__link[href]'));
      for (let i = 0; i < anchors.length; i += 1) {
        const nextRel = normaliseHrefToRel(anchors[i].getAttribute ? anchors[i].getAttribute("href") : "");
        courseSeg = courseSegFromRel(nextRel, yearSeg);
        if (courseSeg) break;
      }
    }

    if (!courseSeg) return null;
    return {
      kind: "course",
      yearSeg: yearSeg,
      courseSeg: courseSeg,
      coursePrefix: yearSeg + "/" + courseSeg + "/",
      relPath: currentScope && currentScope.relPath ? currentScope.relPath : currentRelPath()
    };
  }

  function collectCourseNodes(scope) {
    const out = [];
    const seen = new Set();
    const yearNode = findYearNode(scope && scope.yearSeg);
    const yearList = yearNode ? directChildList(yearNode) : null;

    if (yearList) {
      asArray(yearList.children).forEach(function (li) {
        if (!isElement(li) || !(li.classList && li.classList.contains("md-nav__item--nested"))) return;
        const entryScope = courseScopeFromNode(li, scope.yearSeg, scope);
        if (!entryScope) return;
        const key = entryScope.yearSeg + "/" + entryScope.courseSeg;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({
          node: li,
          scope: entryScope,
          isCurrent: isSameCourseScope(entryScope, scope)
        });
      });
    }

    if (!out.length) {
      const current = findCourseNode(scope);
      if (current) {
        const entryScope = courseScopeFromNode(current, scope.yearSeg, scope) || {
          kind: "course",
          yearSeg: scope.yearSeg,
          courseSeg: scope.courseSeg,
          coursePrefix: scope.yearSeg + "/" + scope.courseSeg + "/",
          relPath: scope.relPath
        };
        out.push({ node: current, scope: entryScope, isCurrent: true });
      }
    }

    return out;
  }

  function collectCourseItems(courseNode, coursePrefix) {
    const list = directChildList(courseNode);
    if (!list) return { list: null, items: [] };
    // Remove Material's sticky "Math X: …" back-label. The current-course-bar
    // already provides this context; the label bleeds below the sort dock.
    const navEl = list.parentElement;
    if (navEl) {
      asArray(navEl.querySelectorAll(':scope > label.md-nav__title')).forEach(function (el) {
        try { el.remove(); } catch (_) {}
      });
    }
    cleanupList(list);
    suppressTocTakeover(list);
    bindHover(list);

    const items = asArray(list.children)
      .filter(isElement)
      .map(function (li, index) {
        const link = directNavLink(li);
        const rel = resolveItemRel(li, link);
        return {
          li: li,
          link: link,
          rel: rel,
          title: cleanTitle(link ? link.textContent : ""),
          baseIndex: ensureBaseIndex(li, index),
          isConcept: isRealConceptRel(rel, coursePrefix)
        };
      });

    return { list: list, items: items };
  }

  function normaliseYearItemNavigation(li, yearSeg) {
    if (!isElement(li)) return;
    const direct = directNavLink(li);
    if (!direct) return;

    const directAnchor = li.querySelector(':scope > a.md-nav__link[href], :scope > .md-nav__link[href]');
    const directRel = normaliseHrefToRel(directAnchor && directAnchor.getAttribute ? directAnchor.getAttribute("href") : "");
    if (courseSegFromRel(directRel, yearSeg)) return;

    let targetHref = "";
    const anchors = asArray(li.querySelectorAll('a.md-nav__link[href], .md-nav__link[href]'));
    for (let i = 0; i < anchors.length; i += 1) {
      const href = anchors[i].getAttribute ? anchors[i].getAttribute("href") : "";
      const rel = normaliseHrefToRel(href);
      const courseSeg = courseSegFromRel(rel, yearSeg);
      if (!courseSeg) continue;
      if (rel === yearSeg + "/" + courseSeg + "/" || rel === yearSeg + "/" + courseSeg + "/index.html") {
        targetHref = anchors[i].href || href || absoluteSiteHref(yearSeg + "/" + courseSeg + "/");
        break;
      }
      if (!targetHref) targetHref = absoluteSiteHref(yearSeg + "/" + courseSeg + "/");
    }
    if (!targetHref) return;

    asArray(direct.querySelectorAll('.md-nav__icon, .md-icon')).forEach(function (icon) {
      icon.remove();
    });

    if (String(direct.tagName || "").toLowerCase() === "a") {
      direct.setAttribute("href", targetHref);
      return;
    }

    if (String(direct.tagName || "").toLowerCase() !== "label") return;

    const anchor = document.createElement("a");
    anchor.className = direct.className;
    anchor.innerHTML = direct.innerHTML;
    anchor.href = targetHref;
    if (direct.id) anchor.id = direct.id;
    if (direct.title) anchor.title = direct.title;
    if (direct.getAttribute("aria-label")) anchor.setAttribute("aria-label", direct.getAttribute("aria-label"));
    if (direct.getAttribute("aria-current")) anchor.setAttribute("aria-current", direct.getAttribute("aria-current"));
    direct.replaceWith(anchor);
  }

  function collectYearItems(yearNode, scope) {
    const list = directChildList(yearNode);
    if (!list) return { list: null, items: [] };
    asArray(list.children).forEach(function (li) {
      normaliseYearItemNavigation(li, scope.yearSeg);
    });
    cleanupList(list);
    suppressTocTakeover(list);
    bindHover(list);

    const items = asArray(list.children)
      .filter(isElement)
      .map(function (li, index) {
        const link = directNavLink(li);
        return {
          li: li,
          link: link,
          rel: resolveItemRel(li, link),
          title: cleanTitle(link ? link.textContent : ""),
          baseIndex: ensureBaseIndex(li, index),
          isSortable: !!cleanTitle(link ? link.textContent : "")
        };
      });

    return { list: list, items: items };
  }

  function groupStorageKey(scope, groupId) {
    const year = scope && scope.yearSeg ? scope.yearSeg : "";
    const course = scope && scope.courseSeg ? scope.courseSeg : "";
    return [scope && scope.kind || "", year, course, groupId || ""].join("|");
  }

  function readGroupOpen(scope, groupId, fallbackOpen) {
    const key = groupStorageKey(scope, groupId);
    if (!key) return fallbackOpen !== false;
    const store = readSessionObject(STORAGE_KEYS.groupOpen);
    if (Object.prototype.hasOwnProperty.call(store, key)) return !!store[key];
    return fallbackOpen !== false;
  }

  function writeGroupOpen(scope, groupId, open) {
    const key = groupStorageKey(scope, groupId);
    if (!key) return;
    const store = readSessionObject(STORAGE_KEYS.groupOpen);
    store[key] = !!open;
    writeSessionObject(STORAGE_KEYS.groupOpen, store);
  }

  function currentScopeStorageKey(scope) {
    if (!scope || scope.kind !== "course") return "";
    return [scope.kind || "", scope.yearSeg || "", scope.courseSeg || "", scope.relPath || currentRelPath()].join("|");
  }

  function readCurrentScopeOpen(scope, fallbackOpen) {
    if (!scope || scope.kind !== "course") return true;
    const key = currentScopeStorageKey(scope);
    if (!key) return fallbackOpen !== false;
    const store = readSessionObject(STORAGE_KEYS.currentScopeOpen);
    if (!Object.prototype.hasOwnProperty.call(store, key)) return fallbackOpen !== false;
    return store[key] !== 0 && store[key] !== false;
  }

  function writeCurrentScopeOpen(scope, open) {
    if (!scope || scope.kind !== "course") return;
    const key = currentScopeStorageKey(scope);
    if (!key) return;
    const store = readSessionObject(STORAGE_KEYS.currentScopeOpen);
    store[key] = !!open;
    writeSessionObject(STORAGE_KEYS.currentScopeOpen, store);
  }

  function isSameCourseScope(left, right) {
    return !!(left && right && left.kind === "course" && right.kind === "course" && left.yearSeg === right.yearSeg && left.courseSeg === right.courseSeg);
  }

  function isCourseIndexRel(scope, rel) {
    if (!scope || scope.kind !== "course" || !scope.yearSeg || !scope.courseSeg) return false;
    const r = String(safePath(rel || scope.relPath || currentRelPath()) || "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
    if (!r) return false;
    const base = (scope.yearSeg + "/" + scope.courseSeg).replace(/^\/+/, "").replace(/\/+$/, "");
    return r === base || r === base + "/index.html" || r === base + "/index.htm" || r === base + "/index";
  }

  function isCurrentCourseIndexPage(scope) {
    const sc = scope && scope.kind ? scope : inferScope();
    return isCourseIndexRel(sc, sc && sc.relPath ? sc.relPath : currentRelPath());
  }

  function isCurrentCourseCollapsed(scope) {
    const sc = scope && scope.kind ? scope : inferScope();
    return !!(sc && sc.kind === "course" && !readCurrentScopeOpen(sc, true));
  }

  function yearOverviewListForCourseScope(scope) {
    const sc = scope && scope.kind ? scope : inferScope();
    if (!sc || sc.kind !== "course" || !sc.yearSeg) return null;
    const yearNode = findYearNode(sc.yearSeg);
    const yearList = yearNode ? directChildList(yearNode) : null;
    return yearList instanceof HTMLElement ? yearList : null;
  }

  function unifiedCloneUsesYearOverview(root) {
    if (!(root instanceof HTMLElement)) return false;
    return !!root.querySelector('[data-msb-clone-list-kind="course-overview"]');
  }

  function rowIsVisibleForCourseStart(row) {
    if (!(row instanceof HTMLElement)) return false;
    if (row.hidden || row.getAttribute(ATTR.groupCollapsedItem) === "1") return false;
    try {
      const cs = window.getComputedStyle(row);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
    } catch (_) {}
    return true;
  }

  function firstCourseStartRowInList(list, scope) {
    if (!(list instanceof HTMLElement)) return null;
    const rows = asArray(list.children).filter(rowIsVisibleForCourseStart);
    if (!rows.length) return null;

    // On a course index page, the drawer should start at the first useful item:
    // Lecture mode starts at Lecture 1, while A-Z mode starts at the first real concept
    // and skips the course index/overview passthrough rows.
    const courseMode = readMode("course");
    if (courseMode !== MODE.ALPHA) {
      const lectureLead = rows.find(function (row) {
        return row.classList && row.classList.contains(CLS.lead) && row.getAttribute(ATTR.groupKind) === "lecture";
      });
      if (lectureLead instanceof HTMLElement) return lectureLead;

      const lectureAny = rows.find(function (row) {
        return row.getAttribute(ATTR.groupKind) === "lecture";
      });
      if (lectureAny instanceof HTMLElement) return lectureAny;
    }

    const conceptRow = rows.find(function (row) {
      const direct = directNavLink(row);
      const rel = resolveItemRel(row, direct);
      return isRealConceptRel(rel, scope && scope.coursePrefix);
    });
    if (conceptRow instanceof HTMLElement) return conceptRow;

    const nonIndex = rows.find(function (row) {
      const direct = directNavLink(row);
      const rel = resolveItemRel(row, direct);
      return !isCourseIndexRel(scope, rel);
    });
    return (nonIndex instanceof HTMLElement ? nonIndex : rows[0]) || null;
  }

  function firstCourseStartRowInRoot(root, scope) {
    if (!(root instanceof HTMLElement)) return null;
    if (root.classList && root.classList.contains("md-nav__list")) {
      const direct = firstCourseStartRowInList(root, scope);
      if (direct instanceof HTMLElement) return direct;
    }
    const lists = asArray(root.querySelectorAll(".md-nav__list"));
    for (let i = 0; i < lists.length; i += 1) {
      const row = firstCourseStartRowInList(lists[i], scope);
      if (row instanceof HTMLElement) return row;
    }
    return null;
  }


  function courseIndexTopGapPx() {
    // On course index pages, keep the first visible lecture/concept slightly below
    // the Sort by separator instead of pinning it directly against the line.
    return isTouchLikeViewport() ? 14 : 10;
  }

  function emitCurrentScopeToggle(scope, open) {
    try {
      window.dispatchEvent(new CustomEvent("mk:sidebar-current-course-toggle", {
        detail: {
          yearSeg: scope && scope.yearSeg || "",
          courseSeg: scope && scope.courseSeg || "",
          relPath: scope && scope.relPath || currentRelPath(),
          open: !!open
        }
      }));
    } catch (_) {}
  }

  function bindCurrentCourseNativeToggle(scope, courseNode) {
    if (!scope || scope.kind !== "course" || !courseNode) return null;
    const toggle = courseNode.querySelector(':scope > input.md-nav__toggle, input.md-nav__toggle');
    if (!(toggle instanceof HTMLInputElement)) return null;

    const existing = runtime.currentToggleBindings.get(toggle);
    const key = currentScopeStorageKey(scope);
    if (existing && existing.key === key) return toggle;
    if (existing && existing.handler) {
      try { toggle.removeEventListener("change", existing.handler); } catch (_) {}
    }

    const handler = function () {
      if (toggle.dataset.msbSyncing === "1") return;
      const nextOpen = !!toggle.checked;
      writeCurrentScopeOpen(scope, nextOpen);
      emitCurrentScopeToggle(scope, nextOpen);
      scheduleRefresh("current-course-native-toggle");
    };

    toggle.addEventListener("change", handler);
    runtime.currentToggleBindings.set(toggle, { key: key, handler: handler });
    return toggle;
  }

  function syncCurrentCourseNativeToggle(scope, courseNode, open) {
    const toggle = bindCurrentCourseNativeToggle(scope, courseNode);
    if (!(toggle instanceof HTMLInputElement)) return null;
    const nextOpen = !!open;
    if (!!toggle.checked === nextOpen) return toggle;

    toggle.dataset.msbSyncing = "1";
    try {
      toggle.checked = nextOpen;
      if (nextOpen) toggle.setAttribute("checked", "");
      else toggle.removeAttribute("checked");
    } catch (_) {}

    window.setTimeout(function () {
      try { delete toggle.dataset.msbSyncing; } catch (_) {
        try { toggle.removeAttribute("data-msb-syncing"); } catch (__) {}
      }
    }, 0);
    return toggle;
  }

  function applyCurrentScopeVisibility(entryScope, currentScope, courseNode, list) {
    if (!courseNode || !list) return;
    const affectsCurrent = isSameCourseScope(entryScope, currentScope);

    // Do not force course index pages open.  The current-course bar is meant to
    // be a scope toggle everywhere inside a course: concept pages and the course
    // index should both be able to collapse the course's lecture/concept list and
    // fall back to the year-level course-title overview.
    const open = affectsCurrent ? readCurrentScopeOpen(currentScope, true) : true;

    if (affectsCurrent) {
      syncCurrentCourseNativeToggle(entryScope, courseNode, open);
    }

    if (affectsCurrent && !open) {
      courseNode.setAttribute(ATTR.scopeCollapsed, "1");
      list.hidden = true;
      list.style.display = "none";
    } else {
      courseNode.removeAttribute(ATTR.scopeCollapsed);
      list.hidden = false;
      if (list.style) list.style.removeProperty("display");
    }
  }

  function restoreCourseDrilldownVisibility(root) {
    const base = root && root.querySelectorAll ? root : document;
    try {
      if (root instanceof HTMLElement) root.removeAttribute('data-msb-course-drilldown');
      asArray(base.querySelectorAll('[data-msb-drill-hidden="1"]')).forEach(function (el) {
        if (!(el instanceof HTMLElement)) return;
        el.hidden = false;
        el.removeAttribute('data-msb-drill-hidden');
        if (el.style) el.style.removeProperty('display');
      });
      asArray(base.querySelectorAll('[data-msb-drill-current="1"]')).forEach(function (el) {
        if (!(el instanceof HTMLElement)) return;
        el.removeAttribute('data-msb-drill-current');
        if (el.style) el.style.removeProperty('display');
      });
      asArray(base.querySelectorAll('[data-msb-drill-title-hidden="1"]')).forEach(function (el) {
        if (!(el instanceof HTMLElement)) return;
        el.hidden = false;
        el.removeAttribute('data-msb-drill-title-hidden');
        if (el.style) el.style.removeProperty('display');
      });
    } catch (_) {}
  }

  function applyCourseDrilldownVisibility(scope) {
    const sc = scope && scope.kind ? scope : inferScope();
    const scrollWrap = getScrollWrap();
    if (!(scrollWrap instanceof HTMLElement)) return false;
    restoreCourseDrilldownVisibility(scrollWrap);
    if (!sc || sc.kind !== 'course') return false;

    const yearList = yearOverviewListForCourseScope(sc);
    const courseNode = findCourseNode(sc);
    const courseList = courseNode ? directChildList(courseNode) : null;
    if (!(yearList instanceof HTMLElement) || !(courseNode instanceof HTMLElement) || !(courseList instanceof HTMLElement)) return false;

    scrollWrap.setAttribute('data-msb-course-drilldown', '1');
    asArray(yearList.children).forEach(function (li) {
      if (!(li instanceof HTMLElement)) return;
      if (li === courseNode) {
        li.hidden = false;
        li.removeAttribute('data-msb-drill-hidden');
        li.setAttribute('data-msb-drill-current', '1');
        if (li.style) li.style.removeProperty('display');
        return;
      }
      li.setAttribute('data-msb-drill-hidden', '1');
      li.hidden = true;
      if (li.style) li.style.display = 'none';
    });

    asArray(courseNode.querySelectorAll(':scope > a.md-nav__link, :scope > label.md-nav__link, :scope > .md-nav__link')).forEach(function (el) {
      if (!(el instanceof HTMLElement)) return;
      el.setAttribute('data-msb-drill-title-hidden', '1');
      el.hidden = true;
      if (el.style) el.style.display = 'none';
    });

    courseList.hidden = false;
    if (courseList.style) courseList.style.removeProperty('display');
    courseNode.removeAttribute(ATTR.scopeCollapsed);
    syncCurrentCourseNativeToggle(sc, courseNode, true);
    return true;
  }

  function groupChevronSvgMarkup() {
    return '<svg class="' + CLS.headChevron + '-svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M6 3.5L10.5 8L6 12.5"></path>' +
      '</svg>';
  }

  function ensureSingleGroupChevron(btn) {
    if (!btn || !btn.querySelectorAll) return null;

    // v61: make the lecture toggle icon DOM-based, not pseudo-element based.
    // Edge/Firefox could keep an older glyph pseudo-arrow alive in cloned drawers,
    // producing two arrows.  The button is now normalised to exactly one empty
    // chevron span containing exactly one SVG; CSS disables all ::before/::after
    // arrows on the button/span.
    const selector = "." + CLS.headChevron;
    let chevron = null;
    const existing = asArray(btn.querySelectorAll(selector));

    for (let i = 0; i < existing.length; i += 1) {
      if (existing[i].parentNode === btn) {
        chevron = existing[i];
        break;
      }
    }
    if (!chevron && existing.length) chevron = existing[0];
    if (!chevron) {
      chevron = document.createElement("span");
      btn.appendChild(chevron);
    }

    existing.forEach(function (node) {
      if (node !== chevron && node.parentNode) node.parentNode.removeChild(node);
    });

    // Remove Material icon residue, old SVGs, and text/glyph nodes that may have
    // come from MkDocs Material or from a previous cloned drawer build.
    asArray(btn.querySelectorAll('.md-nav__icon, .md-icon, [data-md-icon], i, .material-icons, .material-symbols-outlined')).forEach(function (node) {
      if (node !== chevron && !chevron.contains(node) && node.parentNode) node.parentNode.removeChild(node);
    });

    chevron.className = CLS.headChevron;
    chevron.setAttribute("aria-hidden", "true");
    chevron.removeAttribute("data-md-icon");
    chevron.removeAttribute("role");
    chevron.removeAttribute("style");
    try { chevron.textContent = ""; } catch (_) {}
    try { chevron.innerHTML = groupChevronSvgMarkup(); } catch (_) {}

    asArray(btn.childNodes).forEach(function (node) {
      if (node !== chevron && node.parentNode) node.parentNode.removeChild(node);
    });

    return chevron;
  }

  function normaliseAllGroupChevrons(root) {
    if (!(root instanceof HTMLElement)) return;
    asArray(root.querySelectorAll('.' + CLS.headBtn)).forEach(function (btn) {
      ensureSingleGroupChevron(btn);
    });
  }

  function makeGroupHead(kind, labelText, groupId, scope) {
    const head = document.createElement("div");
    head.className = CLS.head + " " + (kind === "lecture" ? CLS.headLecture : CLS.headBlock);
    head.setAttribute(ATTR.injected, "1");

    if (kind === "lecture") {
      head.innerHTML =
        '<div class="' + CLS.headRow + '">' +
          '<span class="' + CLS.headText + '"></span>' +
          '<button type="button" class="' + CLS.headBtn + '" aria-expanded="true"></button>' +
        '</div>';
      const text = head.querySelector("." + CLS.headText);
      const btn = head.querySelector("." + CLS.headBtn);
      if (text) text.textContent = labelText;
      if (btn) {
        btn.innerHTML = '<span class="' + CLS.headChevron + '" aria-hidden="true"></span>';
        ensureSingleGroupChevron(btn);
        btn.dataset.groupId = groupId || "";
        btn.dataset.scopeKind = scope && scope.kind || "course";
        btn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          toggleLectureGroup(scope, groupId);
        });
      }
      return head;
    }

    head.innerHTML =
      '<div class="' + CLS.headRow + '">' +
        '<span class="' + CLS.headText + '"></span>' +
      '</div>';
    const text = head.querySelector("." + CLS.headText);
    if (text) text.textContent = labelText;
    return head;
  }

  function assignGroup(item, kind, groupId, courseKey) {
    if (!item || !item.li) return;
    item.li.setAttribute(ATTR.group, groupId);
    item.li.setAttribute(ATTR.groupKind, kind);
    if (courseKey) item.li.setAttribute(ATTR.courseKey, courseKey);
  }

  function injectGroupLead(item, kind, labelText, groupId, scope, courseKey) {
    if (!item || !item.li) return;
    assignGroup(item, kind, groupId, courseKey);
    item.li.classList.add(CLS.lead);
    if (!item.li.querySelector(':scope > [' + ATTR.injected + '="1"]')) {
      item.li.insertBefore(makeGroupHead(kind, labelText, groupId, scope), item.li.firstChild || null);
    }
  }

  function updateGroupButtonUi(lead, label, open) {
    if (!lead) return;
    const btn = lead.querySelector(':scope > .' + CLS.head + ' .' + CLS.headBtn);
    if (!btn) return;
    ensureSingleGroupChevron(btn);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", (open ? "Collapse " : "Expand ") + label);
    btn.title = (open ? "Collapse " : "Expand ") + label;
  }

  function applyLectureGroupState(groups, scope) {
    const activeRel = currentRelPath();
    const forceCollapsedOnCourseIndex = isCurrentCourseIndexPage(scope);
    groups.forEach(function (group) {
      const hasActive = !forceCollapsedOnCourseIndex && group.items.some(function (item) { return sameLogicalRel(item.rel, activeRel); });
      if (hasActive) writeGroupOpen(scope, group.id, true);
      const open = forceCollapsedOnCourseIndex ? false : (hasActive ? true : readGroupOpen(scope, group.id, true));

      group.items.forEach(function (item, index) {
        const isLead = index === 0;
        item.li.setAttribute(ATTR.groupOpen, open ? "1" : "0");
        if (isLead) {
          if (open) item.li.removeAttribute(ATTR.groupCollapsedLead);
          else item.li.setAttribute(ATTR.groupCollapsedLead, "1");
          item.li.hidden = false;
          if (item.li.style) item.li.style.removeProperty("display");
          updateGroupButtonUi(item.li, group.label, open);
        } else if (open) {
          item.li.removeAttribute(ATTR.groupCollapsedItem);
          item.li.hidden = false;
          if (item.li.style) item.li.style.removeProperty("display");
        } else {
          item.li.setAttribute(ATTR.groupCollapsedItem, "1");
          item.li.hidden = true;
        }
      });
    });
  }

  function lectureRowsForGroup(scope, groupId) {
    const wrap = getScrollWrap();
    if (!wrap || !groupId) return [];
    const courseKey = scope && scope.yearSeg && scope.courseSeg ? scope.yearSeg + "/" + scope.courseSeg : "";
    return asArray(wrap.querySelectorAll('.md-nav__item[' + ATTR.group + ']')).filter(function (row) {
      return row.getAttribute(ATTR.group) === groupId && (!courseKey || row.getAttribute(ATTR.courseKey) === courseKey);
    });
  }

  function lectureGroupLabel(rows, groupId) {
    const fallback = lectureLabelFromGroupId(groupId);
    if (!rows || !rows.length) return fallback || groupId || "";
    const lead = rows.find(function (row) { return row.classList.contains(CLS.lead); }) || rows[0];
    const text = lead.querySelector(':scope > .' + CLS.head + ' .' + CLS.headText);
    return cleanTitle(text ? text.textContent : "") || fallback || groupId || "";
  }

  function toggleLectureGroup(scope, groupId) {
    if (!groupId) return;
    const rows = lectureRowsForGroup(scope, groupId);
    if (!rows.length) return;
    const lead = rows.find(function (row) { return row.classList.contains(CLS.lead); }) || rows[0];
    const btn = lead.querySelector(':scope > .' + CLS.head + ' .' + CLS.headBtn);
    const isOpen = btn ? btn.getAttribute("aria-expanded") === "true" : lead.getAttribute(ATTR.groupOpen) === "1";
    const nextOpen = !isOpen;
    writeGroupOpen(scope, groupId, nextOpen);

    rows.forEach(function (row) {
      const isLead = row === lead;
      row.setAttribute(ATTR.groupOpen, nextOpen ? "1" : "0");
      if (isLead) {
        if (nextOpen) row.removeAttribute(ATTR.groupCollapsedLead);
        else row.setAttribute(ATTR.groupCollapsedLead, "1");
        row.hidden = false;
      } else if (nextOpen) {
        row.removeAttribute(ATTR.groupCollapsedItem);
        row.hidden = false;
      } else {
        row.setAttribute(ATTR.groupCollapsedItem, "1");
        row.hidden = true;
      }
    });

    updateGroupButtonUi(lead, lectureGroupLabel(rows, groupId), nextOpen);
    if (lead && lead.parentElement) markGroupBoundaries(lead.parentElement);
  }

  function blockLabelFromIndex(index) {
    const n = Math.floor(index / 2) + 1;
    const suffix = index % 2 === 0 ? "A" : "B";
    return "Block " + n + suffix;
  }

  function applyOrder(list, ordered) {
    if (!list) return;
    const frag = document.createDocumentFragment();
    ordered.forEach(function (item) { frag.appendChild(item.li); });
    list.appendChild(frag);
  }

  function makeSyntheticLectureItem(scope, lectureNo, unitType) {
    const n = Math.max(1, parseInt(lectureNo, 10) || 0);
    if (!n || !scope) return null;
    const type = unitType === "week" ? "week" : "lecture";
    const label = unitNounFromType(type) + " " + n;
    const groupId = unitGroupPrefix(type) + String(n).padStart(2, "0");
    const li = document.createElement("li");
    li.className = "md-nav__item " + CLS.lead;
    li.setAttribute(ATTR.syntheticGroup, "1");
    li.setAttribute(ATTR.courseKey, scope.yearSeg + "/" + scope.courseSeg);
    li.setAttribute(ATTR.group, groupId);
    li.setAttribute(ATTR.groupKind, "lecture");
    li.setAttribute(ATTR.groupOpen, "0");
    li.setAttribute(ATTR.groupCollapsedLead, "1");
    try { li.appendChild(makeGroupHead("lecture", label, groupId, scope)); } catch (_) {}
    return {
      li: li,
      link: null,
      rel: "",
      title: label,
      baseIndex: -1,
      isConcept: true,
      isSyntheticLecture: true,
      lecture: n,
      unitType: type,
      lectureOrder: -1,
      block: ""
    };
  }

  async function expectedLectureNumbersForCourseIndex(scope, existingConcepts) {
    const nums = new Set();
    if (!scope || readMode("course") === MODE.ALPHA) return nums;

    (Array.isArray(existingConcepts) ? existingConcepts : []).forEach(function (item) {
      const n = Number(item && item.lecture) || 0;
      if (n > 0) nums.add(n);
    });

    const coursePrefix = String(scope.coursePrefix || (scope.yearSeg && scope.courseSeg ? scope.yearSeg + "/" + scope.courseSeg + "/" : ""));
    if (!coursePrefix) return nums;

    try {
      const meta = await metaProvider.loadSidebarMeta().catch(function () { return null; });
      const keys = metaProvider.candidateCourseKeys(scope);
      const tables = [];
      if (meta && meta.courses && typeof meta.courses === "object") {
        keys.forEach(function (key) {
          if (meta.courses[key] && meta.courses[key].items) tables.push(meta.courses[key].items);
          const lower = String(key || "").toLowerCase();
          if (meta.courses[lower] && meta.courses[lower].items) tables.push(meta.courses[lower].items);
        });
      }
      if (meta && meta.items && typeof meta.items === "object") tables.push(meta.items);
      tables.forEach(function (table) {
        if (!table || typeof table !== "object") return;
        Object.keys(table).forEach(function (rel) {
          if (!isRealConceptRel(rel, coursePrefix)) return;
          const entry = table[rel];
          const n = Number(entry && (entry.lecture || entry.week)) || 0;
          if (n > 0) nums.add(n);
        });
      });
    } catch (_) {}

    try {
      const index = await metaProvider.loadSearchIndex().catch(function () { return null; });
      const docs = index && Array.isArray(index.docs) ? index.docs : [];
      docs.forEach(function (doc) {
        const rel = safePath(doc && doc.location);
        if (!isRealConceptRel(rel, coursePrefix)) return;
        const info = unitInfoFromTags(getTagsFromDoc(doc));
        const n = info ? info.unitNo : 0;
        if (n > 0) nums.add(n);
      });
    } catch (_) {}

    return nums;
  }

  function fillMissingLectureItemsForCourseIndex(concepts, groups, scope, expectedLectureNums, unitType) {
    const arr = Array.isArray(concepts) ? concepts : [];
    const grp = Array.isArray(groups) ? groups : [];
    if (!scope || readMode("course") === MODE.ALPHA) return arr;

    const numsSet = new Set();
    arr.forEach(function (item) {
      const n = Number(item && item.lecture) || 0;
      if (n > 0) numsSet.add(n);
    });
    if (expectedLectureNums && typeof expectedLectureNums.forEach === "function") {
      expectedLectureNums.forEach(function (n) {
        const nn = Number(n) || 0;
        if (nn > 0) numsSet.add(nn);
      });
    }
    const nums = Array.from(numsSet).filter(function (n) { return n > 0; });
    if (nums.length < 2) return arr;
    const minN = Math.min.apply(Math, nums);
    const maxN = Math.max.apply(Math, nums);
    if (!(maxN > minN)) return arr;

    const byNo = new Map();
    arr.forEach(function (item) {
      const n = Number(item && item.lecture) || 0;
      if (n > 0 && !byNo.has(n)) byNo.set(n, []);
      if (n > 0) byNo.get(n).push(item);
    });

    for (let n = minN; n <= maxN; n += 1) {
      if (byNo.has(n)) continue;
      const synthetic = makeSyntheticLectureItem(scope, n, unitType);
      if (!synthetic) continue;
      byNo.set(n, [synthetic]);
      grp.push({ id: synthetic.li.getAttribute(ATTR.group) || (unitGroupPrefix(unitType) + String(n).padStart(2, "0")), label: unitNounFromType(unitType) + " " + n, items: [synthetic] });
    }

    return Array.from(byNo.keys()).sort(function (a, b) { return a - b; }).reduce(function (out, n) {
      const chunk = byNo.get(n) || [];
      chunk.sort(function (a, b) {
        const ao = Number.isFinite(Number(a && a.lectureOrder)) ? Number(a.lectureOrder) : Number.MAX_SAFE_INTEGER;
        const bo = Number.isFinite(Number(b && b.lectureOrder)) ? Number(b.lectureOrder) : Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
        return alphaCompare(a, b);
      });
      out.push.apply(out, chunk);
      return out;
    }, []);
  }

  async function sortCourseNode(entry, currentScope) {
    const scope = entry && entry.scope;
    const node = entry && entry.node;
    if (!scope || !node) return false;

    const collected = collectCourseItems(node, scope.coursePrefix);
    const list = collected.list;
    const items = collected.items;
    if (!list || !items.length) return false;
    if (entry && entry.isCurrent) runtime.scopeList = list;

    const concepts = items.filter(function (item) { return item.isConcept; });
    const passthrough = items.filter(function (item) { return !item.isConcept; });
    const mode = readMode("course");

    if (mode === MODE.ALPHA) {
      concepts.sort(alphaCompare);
      applyOrder(list, passthrough.concat(concepts));
      applyCurrentScopeVisibility(scope, currentScope, node, list);
      markGroupBoundaries(list);
      return true;
    }

    const lectureInfo = await Promise.all(concepts.map(function (item) {
      return metaProvider.readLectureInfo(scope, item.rel).catch(function () {
        return { lecture: 0, unitType: "lecture", order: Number.MAX_SAFE_INTEGER, titleOverride: "", block: "" };
      });
    }));

    concepts.forEach(function (item, index) {
      item.lecture = Number(lectureInfo[index].lecture) || 0;
      item.unitType = lectureInfo[index].unitType === "week" ? "week" : "lecture";
      item.lectureOrder = Number.isFinite(Number(lectureInfo[index].order)) ? Number(lectureInfo[index].order) : Number.MAX_SAFE_INTEGER;
      item.block = lectureInfo[index].block || "";
      if (lectureInfo[index].titleOverride) item.title = cleanTitle(lectureInfo[index].titleOverride);
      item.li.setAttribute(ATTR.courseKey, scope.yearSeg + "/" + scope.courseSeg);
    });


    const inferredUnitType = concepts.some(function (item) { return item && item.unitType === "week"; }) ? "week" : "lecture";
    const scopeCourseKey = courseKeyFromScope(scope);
    if (scopeCourseKey) runtime.courseUnitTypeByKey[scopeCourseKey] = inferredUnitType;

    concepts.sort(function (a, b) {
      const la = a.lecture > 0 ? a.lecture : Number.MAX_SAFE_INTEGER;
      const lb = b.lecture > 0 ? b.lecture : Number.MAX_SAFE_INTEGER;
      if (la !== lb) return la - lb;
      if (a.lectureOrder !== b.lectureOrder) return a.lectureOrder - b.lectureOrder;
      return alphaCompare(a, b);
    });

    const groups = [];
    let lastGroupId = "";
    let current = null;

    concepts.forEach(function (item) {
      const lectureNo = item.lecture > 0 ? item.lecture : 0;
      const unitType = item.unitType === "week" ? "week" : inferredUnitType;
      const groupId = lectureNo > 0 ? unitGroupPrefix(unitType) + String(lectureNo).padStart(2, "0") : unitGroupPrefix(inferredUnitType) + "ZZ";
      const label = lectureNo > 0 ? (unitNounFromType(unitType) + " " + lectureNo) : unitNounFromType(inferredUnitType);
      assignGroup(item, "lecture", groupId, scope.yearSeg + "/" + scope.courseSeg);
      if (groupId !== lastGroupId) {
        injectGroupLead(item, "lecture", label, groupId, scope, scope.yearSeg + "/" + scope.courseSeg);
        current = { id: groupId, label: label, items: [item] };
        groups.push(current);
        lastGroupId = groupId;
      } else if (current) {
        current.items.push(item);
      }
    });

    const expectedLectureNums = await expectedLectureNumbersForCourseIndex(scope, concepts);
    const completeConcepts = fillMissingLectureItemsForCourseIndex(concepts, groups, scope, expectedLectureNums, inferredUnitType);
    groups.sort(function (a, b) {
      const am = String(a && a.id || '').match(/^[LW]0*(\d+)$/i);
      const bm = String(b && b.id || '').match(/^[LW]0*(\d+)$/i);
      const an = am ? parseInt(am[2], 10) || 0 : Number.MAX_SAFE_INTEGER;
      const bn = bm ? parseInt(bm[2], 10) || 0 : Number.MAX_SAFE_INTEGER;
      return an - bn;
    });
    applyOrder(list, passthrough.concat(completeConcepts));
    applyLectureGroupState(groups, scope);
    applyCurrentScopeVisibility(scope, currentScope, node, list);
    markGroupBoundaries(list);
    return true;
  }

  async function sortAllCourseNodes(scope) {
    const nodes = collectCourseNodes(scope);
    if (!nodes.length) return false;
    runtime.scopeList = null;
    let ok = false;
    for (let i = 0; i < nodes.length; i += 1) {
      ok = (await sortCourseNode(nodes[i], scope)) || ok;
    }
    if (!runtime.scopeList && nodes[0] && nodes[0].node) {
      runtime.scopeList = directChildList(nodes[0].node);
    }
    return ok;
  }

  async function sortYear(scope) {
    const node = findYearNode(scope.yearSeg);
    if (!node) return false;
    const collected = collectYearItems(node, scope);
    const list = collected.list;
    const items = collected.items;
    if (!list || !items.length) return false;
    runtime.scopeList = list;

    const sortable = items.filter(function (item) { return item.isSortable; });
    const mode = readMode("year");

    if (mode === MODE.ALPHA) {
      sortable.sort(alphaCompare);
      applyOrder(list, sortable);
      markGroupBoundaries(list);
      return true;
    }

    sortable.sort(function (a, b) {
      return a.baseIndex - b.baseIndex;
    });

    const explicitBlocks = await Promise.all(sortable.map(function (item) {
      return metaProvider.readBlockInfo(scope, item.rel).catch(function () { return ""; });
    }));

    let lastGroupId = "";
    let fallbackIndex = -1;
    sortable.forEach(function (item, idx) {
      const explicit = String(explicitBlocks[idx] || "").trim();
      let groupId = "";
      let label = "";
      if (explicit) {
        groupId = "B:" + explicit;
        label = /^block\s+/i.test(explicit) ? explicit : ("Block " + explicit);
      } else {
        const blockIndex = Math.floor(idx / 3);
        groupId = "BF:" + blockIndex;
        label = blockLabelFromIndex(blockIndex);
      }
      assignGroup(item, "block", groupId, "");
      if (groupId !== lastGroupId) {
        injectGroupLead(item, "block", label, groupId, scope, "");
        lastGroupId = groupId;
        fallbackIndex += 1;
      }
    });

    applyOrder(list, sortable);
    markGroupBoundaries(list);
    return true;
  }

  function isMobileViewport() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 76.1875em)").matches);
    } catch (_) {
      return false;
    }
  }

  function drawerToggle() {
    return document.querySelector('input[data-md-toggle="drawer"], input#__drawer');
  }

  function isDrawerToggleChecked() {
    const toggle = drawerToggle();
    return !!(toggle instanceof HTMLInputElement && toggle.checked);
  }

  function syncMobileDrawerGateClass() {
    const mobile = isMobileViewport();
    const checked = mobile && isDrawerToggleChecked();
    const root = html();
    try {
      root.classList.toggle('msb-mobile-drawer-checked', checked);
      root.classList.toggle('msb-mobile-drawer-closed', mobile && !checked);
      if (!mobile) {
        root.classList.remove('msb-mobile-drawer-checked');
        root.classList.remove('msb-mobile-drawer-closed');
      }
    } catch (_) {}
    return checked;
  }

  function isDrawerOpen() {
    if (!isMobileViewport()) return true;
    const toggle = drawerToggle();
    if (!(toggle instanceof HTMLInputElement)) return true;
    return !!toggle.checked;
  }

  function isDesktopYearScope(scope) {
    return !!(scope && scope.kind === "year" && !isMobileViewport());
  }

  function setDesktopYearInitialTop(scrollWrap, scope) {
    const sc = scope && typeof scope === "object" ? scope : inferScope();
    if (!isDesktopYearScope(sc)) return false;

    const wrap = scrollWrap instanceof HTMLElement ? scrollWrap : getScrollWrap();
    if (!(wrap instanceof HTMLElement)) return false;

    try {
      wrap.scrollTop = 0;
    } catch (_) {
      try { wrap.scrollTo(0, 0); } catch (__) { return false; }
    }

    try {
      wrap.setAttribute("data-msb-desktop-year-initial-top", sc.yearSeg || "year");
    } catch (_) {}

    try { syncDrawerGhostFloorScrollOnly(); } catch (_) {}
    return true;
  }


  function ensureDrawerGapPatchStyles() {
    const STYLE_ID = "mk-sidebar-drawer-gap-patch-style-v36-mobile-drawer-zoom-gate";
    ["mk-sidebar-drawer-gap-patch-style-v35-initial-desktop-year-top", "mk-sidebar-drawer-gap-patch-style-v34-desktop-year-top-align", "mk-sidebar-drawer-gap-patch-style-v33-year-spaced-stable-drawer", "mk-sidebar-drawer-gap-patch-style-v31-current-course-integrated", "mk-sidebar-drawer-gap-patch-style-v27-mobile-year-tight-pc-left-chevron", "mk-sidebar-drawer-gap-patch-style-v26-mobile-year-compact-chevron-indent", "mk-sidebar-drawer-gap-patch-style-v25-mobile-year-course-only", "mk-sidebar-drawer-gap-patch-style-v24-chevron-lecture-count-indent-year-title", "mk-sidebar-drawer-gap-patch-style-v23-single-chevron-gap-course-title", "mk-sidebar-drawer-gap-patch-style-v22-mobile-toggle-inertia", "mk-sidebar-drawer-gap-patch-style-v20-ios26-scroll-isolation", "mk-sidebar-drawer-gap-patch-style-v19-continuous-custom-drawer-fake-scrollbar", "mk-sidebar-drawer-gap-patch-style-v18-continuous-custom-drawer-no-split-tail", "mk-sidebar-drawer-gap-patch-style-v16-continuous-custom-drawer", "mk-sidebar-drawer-gap-patch-style-v15-unified-custom-mobile-drawer", "mk-sidebar-drawer-gap-patch-style-v14-unified-custom-mobile-drawer", "mk-sidebar-drawer-gap-patch-style-v13-unified-custom-mobile-drawer", "mk-sidebar-drawer-gap-patch-style-v12-unified-custom-mobile-drawer", "mk-sidebar-drawer-gap-patch-style-v11-unified-custom-mobile-drawer", "mk-sidebar-drawer-gap-patch-style-v10-unified-custom-mobile-drawer", "mk-sidebar-drawer-gap-patch-style-v9-ios26-precenter-unified-ghost", "mk-sidebar-drawer-gap-patch-style-v8", "mk-sidebar-drawer-gap-patch-style-v7", "mk-sidebar-drawer-gap-patch-style-v6", "mk-sidebar-drawer-gap-patch-style-v5", "mk-sidebar-drawer-gap-patch-style-v4", "mk-sidebar-drawer-gap-patch-style-v3", "mk-sidebar-drawer-gap-patch-style-v2"].forEach(function (id) {
      try {
        const old = document.getElementById(id);
        if (old && old.parentNode) old.parentNode.removeChild(old);
      } catch (_) {}
    });
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
#mk-sidebar-drawer-gap-top,
#mk-sidebar-drawer-gap-bottom{
  position:fixed;
  display:none;
  pointer-events:none;
  background:transparent;
  z-index:17;
  -webkit-transform:translateZ(0);
  transform:translateZ(0);
  will-change:left,top,width,height;
}
#mk-sidebar-drawer-ghost-floor{
  --msb-card-border: color-mix(in srgb, var(--md-default-fg-color) 12%, transparent);
  --msb-card-border-strong: color-mix(in srgb, var(--md-accent-fg-color) 24%, var(--msb-card-border));
  --msb-card-bg: color-mix(in srgb, var(--md-default-bg-color) 94%, var(--md-default-fg-color) 6%);
  --msb-card-bg-hover: color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-accent-fg-color) 10%);
  --msb-sidebar-page-bg:var(--mk-active-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)));
  --msb-sidebar-page-background:var(--mk-page-pattern-image, none), var(--msb-sidebar-page-bg, var(--md-default-bg-color));
  --msb-sidebar-page-bg-size:var(--mk-page-pattern-size, auto), auto;
  --msb-sidebar-page-bg-position:var(--mk-page-pattern-position, 0 0), 0 0;
  --msb-sidebar-page-bg-repeat:var(--mk-page-pattern-repeat, repeat), no-repeat;
  --msb-sidebar-page-bg-attachment:fixed, fixed;
  position:absolute;
  display:none;
  pointer-events:none;
  box-sizing:border-box;
  overflow:hidden;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color)));
  background-size:var(--msb-sidebar-page-bg-size, auto);
  background-position:var(--msb-sidebar-page-bg-position, 0 0);
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat);
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed);
  border:0 !important;
  outline:0 !important;
  box-shadow:none !important;
  z-index:16;
  -webkit-transform:translateZ(0);
  transform:translateZ(0);
  contain:paint;
  /* The floor is measured from the real scrollwrap, not the outer drawer.
     This prevents the bottom safe-area strip from losing the drawer's inner
     left/right spacing. */
}
html[data-md-color-scheme="slate"] #mk-sidebar-drawer-ghost-floor{
  --msb-card-border: rgba(255,255,255,.10);
  --msb-card-border-strong: color-mix(in srgb, var(--md-accent-fg-color) 30%, rgba(255,255,255,.12));
  --msb-card-bg: color-mix(in srgb, var(--md-default-bg-color) 90%, rgba(255,255,255,.05) 10%);
  --msb-card-bg-hover: color-mix(in srgb, var(--md-default-bg-color) 84%, var(--md-accent-fg-color) 16%);
}
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap{
  position:absolute !important;
  left:var(--msb-ghost-inner-left, 0px) !important;
  top:var(--msb-ghost-viewport-top, 0px) !important;
  right:auto !important;
  width:var(--msb-ghost-inner-width, 100%) !important;
  height:var(--msb-ghost-viewport-height, 100%) !important;
  min-height:0 !important;
  max-height:none !important;
  overflow:hidden !important;
  box-sizing:border-box !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  border:0 !important;
  outline:0 !important;
  box-shadow:none !important;
  pointer-events:none !important;
  -webkit-transform:none !important;
  transform:none !important;
  will-change:top,height;
}
#mk-sidebar-drawer-ghost-floor .msb-ghost-list{
  position:relative !important;
  left:auto !important;
  top:auto !important;
  right:auto !important;
  width:auto !important;
  height:auto !important;
  min-height:0 !important;
  overflow:visible !important;
  box-sizing:border-box !important;
  background:transparent !important;
  pointer-events:none !important;
  -webkit-transform:none !important;
  transform:none !important;
}
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap *,
#mk-sidebar-drawer-ghost-floor .msb-ghost-list,
#mk-sidebar-drawer-ghost-floor .msb-ghost-list *{
  pointer-events:none !important;
}
#mk-sidebar-drawer-ghost-floor #current-course-bar,
#mk-sidebar-drawer-ghost-floor #mk-sidebar-sortdock,
#mk-sidebar-drawer-ghost-floor .md-nav__title{
  position:static !important;
  top:auto !important;
  -webkit-transform:none !important;
  transform:none !important;
}
#mk-sidebar-drawer-ghost-floor .md-sidebar__inner{
  position:relative !important;
  overflow:visible !important;
  min-height:0 !important;
}
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap .md-sidebar__inner{
  height:auto !important;
  max-height:none !important;
}
#mk-sidebar-drawer-ghost-floor .msb-ghost-list{
  list-style:none !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item,
#mk-sidebar-drawer-ghost-floor .md-nav__link,
#mk-sidebar-drawer-ghost-floor label.md-nav__link{
  scroll-snap-align:none !important;
  scroll-snap-stop:normal !important;
}
#mk-sidebar-drawer-ghost-floor .msb-group-head{
  display:block;
  margin:0;
  padding:0;
}
#mk-sidebar-drawer-ghost-floor .msb-group-head__row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:.55rem;
  box-sizing:border-box;
  padding:.54rem .9rem .42rem;
}
#mk-sidebar-drawer-ghost-floor .msb-group-head__text{
  flex:1 1 auto;
  min-width:0;
  font-size:.72rem;
  font-weight:700;
  line-height:1.24;
  color:color-mix(in srgb, var(--md-default-fg-color) 88%, transparent);
}
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn{
  display:none !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-group-kind]{
  box-sizing:border-box;
  background:var(--msb-card-bg) !important;
  border-left:1px solid var(--msb-card-border) !important;
  border-right:1px solid var(--msb-card-border) !important;
  border-top:0 !important;
  border-bottom:0 !important;
  margin:0 .26rem !important;
  box-shadow:none !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-first,
#mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-single{
  border-top:1px solid var(--msb-card-border) !important;
  border-top-left-radius:13px !important;
  border-top-right-radius:13px !important;
  margin-top:.54rem !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-last,
#mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-single{
  border-bottom:1px solid var(--msb-card-border) !important;
  border-bottom-left-radius:13px !important;
  border-bottom-right-radius:13px !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-group-kind] > .md-nav__link,
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-group-kind] > label.md-nav__link{
  padding-top:.34rem !important;
  padding-bottom:.4rem !important;
  margin:0 .08rem !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-lead[data-msb-group-open="1"] > .md-nav__link,
#mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-lead[data-msb-group-open="1"] > label.md-nav__link{
  border-top:0 !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-group-collapsed-item="1"]{
  display:none !important;
}
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-dup-current="label"] > label.md-nav__link,
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-dup-current="label"] > .md-nav__link[for="__toc"],
#mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-dup-current="anchor"] > a.md-nav__link{
  display:none !important;
}

/* Match the real mobile sidebar exactly. The ghost host is also given
   .md-sidebar--primary in JS so the normal sidebar styles apply; these
   id-scoped rules only neutralise earlier ghost defaults that would otherwise
   win by specificity and make the bottom continuation look smaller. */
@media (max-width: 76.1875em){
  #mk-sidebar-drawer-ghost-floor .msb-group-head__row{
    padding:.46rem .74rem .34rem !important;
  }
  #mk-sidebar-drawer-ghost-floor .msb-group-head__text{
    font-size:.76rem !important;
  }
  #mk-sidebar-drawer-ghost-floor .md-nav__item[data-msb-group-kind]{
    margin:0 .18rem !important;
  }
  #mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-first,
  #mk-sidebar-drawer-ghost-floor .md-nav__item.msb-group-single{
    margin-top:.44rem !important;
  }
  /* The seam is an artificial viewport boundary, not a real content edge. */
  html.mk-sidebar-sort-ready .md-sidebar--primary,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__inner,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap{
    box-shadow:none !important;
    border-bottom:0 !important;
  }
}

/* Ghost viewport continuation: keep typography, indentation, and row heights
   identical to the real drawer. The direct child .msb-ghost-scrollwrap is a
   cloned scroll viewport shifted upward, so the clipped bottom strip shows the
   natural continuation below the visible sidebar instead of a separately scaled list. */
#mk-sidebar-drawer-ghost-floor.mk-sidebar-ghost-host,
#mk-sidebar-drawer-ghost-floor.mk-sidebar-ghost-host *{
  text-size-adjust:100% !important;
  -webkit-text-size-adjust:100% !important;
}
#mk-sidebar-drawer-ghost-floor,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap .md-sidebar__inner,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap .md-nav,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap .md-nav__list{
  border-right:0 !important;
  box-shadow:none !important;
  outline:0 !important;
}
#mk-sidebar-drawer-ghost-floor::before,
#mk-sidebar-drawer-ghost-floor::after,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap::before,
#mk-sidebar-drawer-ghost-floor .msb-ghost-scrollwrap::after{
  display:none !important;
  content:none !important;
  border:0 !important;
  box-shadow:none !important;
}

#lp-drawer-dim-cover{
  background:transparent !important;
  opacity:1 !important;
  -webkit-backdrop-filter:none !important;
  backdrop-filter:none !important;
}

/* v92: blur the page behind the custom mobile drawer while keeping the
   Material header/tabs sharp.  The backdrop is a document-layer surface whose
   top is updated from JS to the visible bottom of the header, so it also works
   with iOS Safari's visual viewport and bottom safe-area continuation. */
#mk-mobile-drawer-backdrop-blur{
  position:absolute !important;
  display:none;
  left:var(--msb-drawer-backdrop-left, 0px) !important;
  top:var(--msb-drawer-backdrop-top, 0px) !important;
  width:var(--msb-drawer-backdrop-width, 100vw) !important;
  height:var(--msb-drawer-backdrop-height, 100vh) !important;
  min-height:var(--msb-drawer-backdrop-height, 100vh) !important;
  box-sizing:border-box !important;
  z-index:2147482400 !important;
  background:rgba(12,16,24,.34) !important;
  -webkit-backdrop-filter:blur(12px) saturate(1.04) !important;
  backdrop-filter:blur(12px) saturate(1.04) !important;
  opacity:0;
  pointer-events:auto !important;
  -webkit-transform:translateZ(0) !important;
  transform:translateZ(0) !important;
  transition:opacity 220ms ease !important;
  will-change:opacity,left,top,width,height;
  touch-action:none !important;
}
#mk-mobile-drawer-click-shield{
  position:absolute !important;
  display:none;
  left:var(--msb-drawer-shield-left, var(--msb-drawer-backdrop-left, 0px)) !important;
  top:var(--msb-drawer-shield-top, var(--msb-drawer-backdrop-top, 0px)) !important;
  width:var(--msb-drawer-shield-width, var(--msb-drawer-backdrop-width, 100vw)) !important;
  height:var(--msb-drawer-shield-height, var(--msb-drawer-backdrop-height, 100vh)) !important;
  min-height:var(--msb-drawer-shield-height, var(--msb-drawer-backdrop-height, 100vh)) !important;
  box-sizing:border-box !important;
  z-index:2147483200 !important;
  background:transparent !important;
  opacity:1 !important;
  pointer-events:auto !important;
  touch-action:none !important;
  -webkit-transform:translateZ(0) !important;
  transform:translateZ(0) !important;
}
#mk-mobile-drawer-click-shield.is-active{
  display:block !important;
}
html[data-md-color-scheme="slate"] #mk-mobile-drawer-backdrop-blur{
  background:rgba(3,7,18,.42) !important;
}
@media (max-width:76.1875em){
  html.msb-unified-mobile-drawer-visible #mk-mobile-drawer-backdrop-blur{
    display:block !important;
    opacity:1 !important;
  }
  html.msb-mobile-drawer-closed #mk-mobile-drawer-backdrop-blur,
  html:not(.msb-mobile-drawer-checked):not(.msb-unified-mobile-drawer-visible) #mk-mobile-drawer-backdrop-blur{
    display:none !important;
    opacity:0 !important;
    pointer-events:none !important;
  }
}
@media (min-width:76.1876em){
  #mk-mobile-drawer-backdrop-blur,
  #mk-mobile-drawer-click-shield{
    display:none !important;
    opacity:0 !important;
    pointer-events:none !important;
  }
}

/* Unified custom mobile drawer surface.
   This is the only visible mobile drawer while open. It contains one
   continuous sidebar clone that extends to the document-layer bottom.
   Do not split the bottom safe-area into a second cloned tail layer. */
#mk-mobile-unified-sidebar-surface{
  --msb-sidebar-page-bg:var(--mk-active-page-bg, var(--mk-theme-page-bg, var(--md-default-bg-color)));
  --msb-sidebar-page-background:var(--mk-page-pattern-image, none), var(--msb-sidebar-page-bg, var(--md-default-bg-color));
  --msb-sidebar-page-bg-size:var(--mk-page-pattern-size, auto), auto;
  --msb-sidebar-page-bg-position:var(--mk-page-pattern-position, 0 0), 0 0;
  --msb-sidebar-page-bg-repeat:var(--mk-page-pattern-repeat, repeat), no-repeat;
  --msb-sidebar-page-bg-attachment:fixed, fixed;
  --msb-custom-open-left:0px;
  --msb-custom-closed-shift:-100vw;
  --msb-custom-top:0px;
  --msb-custom-width:52vw;
  --msb-custom-height:100vh;
  --msb-custom-visible-height:100vh;
  position:absolute !important;
  display:none;
  left:var(--msb-custom-open-left) !important;
  top:var(--msb-custom-top) !important;
  width:var(--msb-custom-width) !important;
  height:var(--msb-custom-height) !important;
  min-width:0 !important;
  max-width:none !important;
  min-height:0 !important;
  max-height:none !important;
  box-sizing:border-box !important;
  overflow:hidden !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  color:var(--md-default-fg-color) !important;
  z-index:2147482500 !important;
  border-right:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent) !important;
  box-shadow:2px 0 16px rgba(0,0,0,.16) !important;
  pointer-events:auto !important;
  contain:layout paint style !important;
  -webkit-backface-visibility:hidden;
  backface-visibility:hidden;
  -webkit-transform:translate3d(var(--msb-custom-closed-shift),0,0) !important;
  transform:translate3d(var(--msb-custom-closed-shift),0,0) !important;
  transition:-webkit-transform 1000ms cubic-bezier(.2,0,0,1), transform 1000ms cubic-bezier(.2,0,0,1) !important;
  will-change:transform;
  transform-style:preserve-3d !important;
  content-visibility:visible !important;
}
html[data-md-color-scheme="slate"] #mk-mobile-unified-sidebar-surface{
  border-right-color:rgba(255,255,255,.12) !important;
  box-shadow:2px 0 18px rgba(0,0,0,.32) !important;
}
#mk-mobile-unified-sidebar-surface.is-ready{
  display:block !important;
}
#mk-mobile-unified-sidebar-surface.is-open{
  -webkit-transform:translate3d(0,0,0) !important;
  transform:translate3d(0,0,0) !important;
}
#mk-mobile-unified-sidebar-surface.is-setup{
  transition:none !important;
}
#mk-mobile-unified-sidebar-surface.is-closing{
  pointer-events:none !important;
}
#mk-mobile-unified-sidebar-surface.is-no-motion{
  transition:none !important;
}
#mk-mobile-unified-sidebar-surface,
#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap,
#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll,
#mk-mobile-unified-sidebar-surface .md-nav,
#mk-mobile-unified-sidebar-surface .md-nav__list{
  content-visibility:visible !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
}
#mk-mobile-unified-sidebar-surface > .msb-unified-scrollwrap{
  position:absolute !important;
  left:0 !important;
  right:0 !important;
  top:0 !important;
  bottom:0 !important;
  width:100% !important;
  height:100% !important;
  min-height:0 !important;
  max-height:none !important;
  box-sizing:border-box !important;
  display:flex !important;
  flex-direction:column !important;
  overflow:hidden !important;
  margin:0 !important;
  padding:0 !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  -webkit-transform:translateZ(0) !important;
  transform:translateZ(0) !important;
  will-change:transform, contents !important;
  backface-visibility:hidden !important;
  -webkit-backface-visibility:hidden !important;
  content-visibility:visible !important;
  transition:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-head{
  flex:0 0 auto !important;
  position:relative !important;
  z-index:2 !important;
  display:block !important;
  box-sizing:border-box !important;
  margin:0 !important;
  padding:0 !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  border-bottom:1px solid color-mix(in srgb, var(--md-default-fg-color) 10%, transparent) !important;
  overflow:visible !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll{
  flex:1 1 auto !important;
  min-height:0 !important;
  height:auto !important;
  position:relative !important;
  box-sizing:border-box !important;
  overflow-x:hidden !important;
  overflow-y:auto !important;
  margin:0 !important;
  padding:0 !important;
  background:var(--msb-sidebar-page-background, var(--msb-sidebar-page-bg, var(--md-default-bg-color))) !important;
  background-size:var(--msb-sidebar-page-bg-size, auto) !important;
  background-position:var(--msb-sidebar-page-bg-position, 0 0) !important;
  background-repeat:var(--msb-sidebar-page-bg-repeat, no-repeat) !important;
  background-attachment:var(--msb-sidebar-page-bg-attachment, fixed) !important;
  -webkit-overflow-scrolling:touch !important;
  overscroll-behavior:contain !important;
  overscroll-behavior-y:contain !important;
  touch-action:pan-y !important;
  scrollbar-gutter:auto !important;
  scrollbar-width:none !important;
  -ms-overflow-style:none !important;
  transform:translateZ(0) !important;
  will-change:scroll-position;
}
#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll::-webkit-scrollbar{
  width:0 !important;
  height:0 !important;
  display:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollbar{
  position:absolute !important;
  right:2px !important;
  top:var(--msb-custom-scrollbar-top, 0px) !important;
  width:3px !important;
  height:var(--msb-custom-scrollbar-height, 100px) !important;
  max-height:var(--msb-custom-scrollbar-height, 100px) !important;
  min-height:0 !important;
  z-index:30 !important;
  pointer-events:none !important;
  opacity:0 !important;
  overflow:hidden !important;
  border-radius:999px !important;
  background:transparent !important;
  transition:opacity 180ms ease !important;
}
#mk-mobile-unified-sidebar-surface.is-open .msb-unified-scrollbar.is-needed{
  opacity:.54 !important;
}
#mk-mobile-unified-sidebar-surface.is-open:not(.is-scrolling) .msb-unified-scrollbar.is-needed{
  opacity:.28 !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollbar-thumb{
  position:absolute !important;
  left:0 !important;
  top:0 !important;
  width:3px !important;
  height:var(--msb-custom-scrollbar-thumb-height, 28px) !important;
  min-height:20px !important;
  max-height:100% !important;
  border-radius:999px !important;
  background:color-mix(in srgb, var(--md-default-fg-color) 34%, transparent) !important;
  -webkit-transform:translate3d(0, var(--msb-custom-scrollbar-thumb-y, 0px), 0) !important;
  transform:translate3d(0, var(--msb-custom-scrollbar-thumb-y, 0px), 0) !important;
  will-change:transform,height !important;
}
html[data-md-color-scheme="slate"] #mk-mobile-unified-sidebar-surface .msb-unified-scrollbar-thumb{
  background:rgba(255,255,255,.38) !important;
}
#mk-mobile-unified-sidebar-surface .md-sidebar__inner{
  position:relative !important;
  top:auto !important;
  bottom:auto !important;
  min-height:0 !important;
  max-height:none !important;
  overflow:visible !important;
  margin:0 !important;
  padding-top:0 !important;
}
#mk-mobile-unified-sidebar-surface .md-nav,
#mk-mobile-unified-sidebar-surface .md-nav__list{
  position:relative !important;
  top:auto !important;
  max-height:none !important;
  margin-top:0 !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__title{
  position:static !important;
  top:auto !important;
  margin-top:0 !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-head #current-course-bar,
#mk-mobile-unified-sidebar-surface .msb-unified-head #mk-sidebar-sortdock{
  position:relative !important;
  top:auto !important;
  left:auto !important;
  right:auto !important;
  bottom:auto !important;
  transform:none !important;
  -webkit-transform:none !important;
  margin-top:0 !important;
  margin-bottom:0 !important;
  box-shadow:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-head #current-course-bar{
  padding-top:.35rem !important;
  padding-bottom:.18rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-head #mk-sidebar-sortdock{
  --msb-sortdock-shift:0px !important;
  padding-top:.12rem !important;
  padding-bottom:.22rem !important;
}
#mk-mobile-unified-sidebar-surface #current-course-bar,
#mk-mobile-unified-sidebar-surface #mk-sidebar-sortdock,
#mk-mobile-unified-sidebar-surface .md-nav__link,
#mk-mobile-unified-sidebar-surface label.md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-group-head,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn{
  pointer-events:auto !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind="lecture"] > .msb-group-head{
  cursor:pointer !important;
}
#mk-mobile-unified-sidebar-surface .msb-group-head__btn{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  flex:0 0 auto !important;
  width:1.05rem !important;
  height:1.05rem !important;
  min-width:1.05rem !important;
  margin-left:auto !important;
  opacity:1 !important;
  color:inherit !important;
}
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron{
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:1rem !important;
  height:1rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::before{
  content:"›" !important;
  display:block !important;
  font-size:1.22rem !important;
  font-weight:800 !important;
  line-height:1rem !important;
  color:currentColor !important;
}
#mk-mobile-unified-sidebar-surface .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron{
  transform:rotate(90deg) !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__link[aria-current="page"],
#mk-mobile-unified-sidebar-surface a.md-nav__link--active,
#mk-mobile-unified-sidebar-surface .md-nav__link--active{
  color:var(--md-accent-fg-color, #00bfa5) !important;
  font-weight:500 !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group{
  background:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 10%, var(--md-default-bg-color) 90%) !important;
  border-left-color:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 42%, transparent) !important;
  border-right-color:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 42%, transparent) !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-first,
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-single{
  border-top-color:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 42%, transparent) !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-last,
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group.msb-group-single{
  border-bottom-color:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 42%, transparent) !important;
}
html[data-md-color-scheme="slate"] #mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group{
  background:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 16%, var(--md-default-bg-color) 84%) !important;
}

/* Custom drawer spacing refinement:
   keep every card away from the drawer edge, and keep concept titles slightly
   more indented than the lecture heading.  This mirrors the desktop grouped
   card feel while preserving the narrower mobile drawer width. */
#mk-mobile-unified-sidebar-surface .msb-unified-list-scroll{
  padding-left:.16rem !important;
  padding-right:.16rem !important;
  padding-bottom:var(--msb-unified-list-bottom-pad, 0px) !important;
  box-sizing:border-box !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind]{
  margin-left:.42rem !important;
  margin-right:.42rem !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind] > .msb-group-head .msb-group-head__row{
  padding-left:.74rem !important;
  padding-right:.74rem !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind] > .md-nav__link,
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind] > label.md-nav__link{
  margin-left:0 !important;
  margin-right:0 !important;
  padding-left:1.02rem !important;
  padding-right:.86rem !important;
  line-height:1.32 !important;
  box-sizing:border-box !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item:not([data-msb-group-kind]) > .md-nav__link,
#mk-mobile-unified-sidebar-surface .md-nav__item:not([data-msb-group-kind]) > label.md-nav__link{
  padding-left:1.02rem !important;
  padding-right:.86rem !important;
  box-sizing:border-box !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item.msb-unified-active-group{
  background:color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 10%, var(--md-default-bg-color) 90%) !important;
}

html.msb-unified-mobile-drawer-visible .md-sidebar--primary:not(#mk-mobile-unified-sidebar-surface):not(#mk-sidebar-drawer-ghost-floor){
  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
}
html.msb-unified-mobile-drawer-visible #mk-sidebar-drawer-ghost-floor,
html.msb-unified-mobile-drawer-visible #mk-sidebar-drawer-gap-top,
html.msb-unified-mobile-drawer-visible #mk-sidebar-drawer-gap-bottom{
  display:none !important;
}

/* v64: hard gate for the phone drawer under pinch-zoom.
   A prebuilt custom drawer used to remain display:block while translated just
   outside the layout viewport.  When iOS Safari was pinch-zoomed and panned,
   that off-canvas layer could enter the visual viewport even though the drawer
   checkbox was not checked.  Closed drawers now stay measurable for warm-up,
   but visually hidden and non-interactive until the real drawer toggle is on
   or the custom close animation is running. */
@media (max-width: 76.1875em){
  html:not(.msb-mobile-drawer-checked) #mk-mobile-unified-sidebar-surface:not(.is-closing){
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
  }
  html.msb-mobile-drawer-closed #mk-mobile-unified-sidebar-surface:not(.is-closing){
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
  }
  html.msb-mobile-drawer-closed .md-sidebar--primary:not(#mk-mobile-unified-sidebar-surface):not(#mk-sidebar-drawer-ghost-floor),
  html:not(.msb-mobile-drawer-checked) .md-sidebar--primary:not(#mk-mobile-unified-sidebar-surface):not(#mk-sidebar-drawer-ghost-floor){
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
    -webkit-transform:translate3d(-140vw,0,0) !important;
    transform:translate3d(-140vw,0,0) !important;
  }
  html.msb-mobile-drawer-checked .md-sidebar--primary:not(#mk-mobile-unified-sidebar-surface):not(#mk-sidebar-drawer-ghost-floor){
    visibility:hidden !important;
    opacity:0 !important;
    pointer-events:none !important;
  }
  html.msb-mobile-drawer-checked #mk-mobile-unified-sidebar-surface.is-ready,
  html.msb-unified-mobile-drawer-visible #mk-mobile-unified-sidebar-surface.is-ready,
  #mk-mobile-unified-sidebar-surface.is-closing{
    visibility:visible !important;
    opacity:1 !important;
  }
}
@media (prefers-reduced-motion: reduce){
  #mk-mobile-unified-sidebar-surface{
    transition:none !important;
  }
}



/* v44: one simple CSS chevron on both PC and mobile.
   No default coloured circle, no text glyph, no Material-icon residue. */
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn{
  width:1.35rem !important;
  height:1.35rem !important;
  min-width:1.35rem !important;
  margin-left:auto !important;
  padding:0 !important;
  border:0 !important;
  background:transparent !important;
  box-shadow:none !important;
  color:currentColor !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron{
  position:relative !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:1.1rem !important;
  height:1.1rem !important;
  min-width:1.1rem !important;
  border-radius:0 !important;
  background:transparent !important;
  box-shadow:none !important;
  color:currentColor !important;
  font-size:0 !important;
  line-height:0 !important;
  transform:none !important;
  transition:color 160ms ease, transform 160ms ease !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron{
  transform:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::before{
  content:"" !important;
  display:block !important;
  width:.44rem !important;
  height:.44rem !important;
  border-right:2px solid currentColor !important;
  border-bottom:2px solid currentColor !important;
  border-left:0 !important;
  border-top:0 !important;
  background:transparent !important;
  transform:rotate(-45deg) !important;
  transform-origin:50% 50% !important;
  margin:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron::before{
  transform:rotate(45deg) !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn:hover .msb-group-head__chevron,
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn:focus-visible .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn:hover .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn:focus-visible .msb-group-head__chevron{
  color:var(--md-accent-fg-color) !important;
}

/* v44: lecture heading itself stays flush inside its card; only concepts under
   that lecture receive the extra indentation. */
@media (min-width: 76.1876em){
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] {
    margin-left:.26rem !important;
    margin-right:.26rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .msb-group-head .msb-group-head__row{
    padding-left:.74rem !important;
    padding-right:.56rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > label.md-nav__link{
    margin-left:0 !important;
    margin-right:0 !important;
    padding-left:1.34rem !important;
    padding-right:.82rem !important;
    box-sizing:border-box !important;
  }
}
@media (min-width: 76.1876em){
  /* v46: block-card headings stay close to the card edge; only the course
     titles inside the block are indented. */
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row{
    padding-left:.42rem !important;
    padding-right:.56rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
    padding-left:.96rem !important;
    padding-right:.82rem !important;
  }
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind] > .msb-group-head .msb-group-head__row{
  padding-left:.74rem !important;
  padding-right:.56rem !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind] > .md-nav__link,
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind] > label.md-nav__link{
  padding-left:1.34rem !important;
  padding-right:.86rem !important;
}

/* v44: mobile Year pages should show full course titles inside block cards. */
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link,
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind="block"] .md-nav__link{
  display:block !important;
  height:auto !important;
  min-height:0 !important;
  max-height:none !important;
  white-space:normal !important;
  overflow:visible !important;
  text-overflow:clip !important;
  overflow-wrap:anywhere !important;
  line-height:1.34 !important;
  padding-top:.42rem !important;
  padding-bottom:.42rem !important;
}
#mk-mobile-unified-sidebar-surface .md-nav__item[data-msb-group-kind="block"]{
  height:auto !important;
  max-height:none !important;
  overflow:visible !important;
}

/* v45: on Year pages the mobile drawer is course-only.  The cloned Material
   course rows can still contain nested lecture/concept sub-navs from the
   original sidebar; those hidden children were occupying layout height and
   created the large empty area seen under Block 1A. */
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item > nav.md-nav,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item > input.md-nav__toggle,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item > label.md-nav__link:not(:only-child){
  display:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__list{
  min-height:0 !important;
  max-height:none !important;
  height:auto !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
  display:block !important;
}
/* v46: Year mobile drawer is a compact course list inside each block.
   Course rows should not have the lecture/concept card vertical rhythm. */
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"]{
  margin-left:.20rem !important;
  margin-right:.20rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row{
  padding-left:.54rem !important;
  padding-right:.54rem !important;
  padding-top:.48rem !important;
  padding-bottom:.18rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
  min-height:0 !important;
  margin:0 !important;
  padding-left:.96rem !important;
  padding-right:.74rem !important;
  padding-top:.18rem !important;
  padding-bottom:.18rem !important;
  line-height:1.24 !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > label.md-nav__link{
  padding-top:.22rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > label.md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > label.md-nav__link{
  padding-bottom:.34rem !important;
}



/* v47 final tightening: mobile Year pages are compact course lists, not lecture
   cards.  Remove leftover Material/group vertical rhythm between course rows. */
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__list,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item{
  row-gap:0 !important;
  gap:0 !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"]{
  margin-left:.16rem !important;
  margin-right:.16rem !important;
  padding-top:0 !important;
  padding-bottom:0 !important;
  min-height:0 !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row{
  padding-left:.46rem !important;
  padding-right:.46rem !important;
  padding-top:.42rem !important;
  padding-bottom:.16rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
  display:block !important;
  margin:0 !important;
  min-height:0 !important;
  height:auto !important;
  padding-left:.76rem !important;
  padding-right:.54rem !important;
  padding-top:.08rem !important;
  padding-bottom:.08rem !important;
  line-height:1.18 !important;
  white-space:normal !important;
  overflow:visible !important;
  text-overflow:clip !important;
}
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > label.md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-mid > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-mid > label.md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > label.md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link,
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > label.md-nav__link{
  padding-top:.08rem !important;
  padding-bottom:.08rem !important;
}

/* v47: PC sidebar cards need less left inset.  The group heading itself is
   nearly flush; only child concept/course rows keep a modest indentation. */
@media (min-width: 76.1876em){
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind]{
    margin-left:.08rem !important;
    margin-right:.16rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .msb-group-head .msb-group-head__row{
    padding-left:.28rem !important;
    padding-right:.40rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row{
    padding-left:.18rem !important;
    padding-right:.40rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > label.md-nav__link{
    padding-left:.86rem !important;
    padding-right:.72rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
    padding-left:.66rem !important;
    padding-right:.72rem !important;
  }
}

/* v47: one directionally-stable chevron. Collapsed = right, expanded = down. */
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn{
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  transform:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron{
  position:relative !important;
  width:1.1rem !important;
  height:1.1rem !important;
  min-width:1.1rem !important;
  border-radius:0 !important;
  background:transparent !important;
  box-shadow:none !important;
  color:currentColor !important;
  transform:none !important;
  font-size:0 !important;
  line-height:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::before{
  content:"" !important;
  position:absolute !important;
  left:50% !important;
  top:50% !important;
  width:.43rem !important;
  height:.43rem !important;
  border:solid currentColor !important;
  border-width:0 2px 2px 0 !important;
  background:transparent !important;
  transform:translate(-58%, -50%) rotate(-45deg) !important;
  transform-origin:50% 50% !important;
  margin:0 !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron::before{
  transform:translate(-50%, -58%) rotate(45deg) !important;
}


/* v50: global mobile drawer for non-Year/non-Course utility pages. */
#mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-global-drawer="1"] .msb-unified-head{
  display:none !important;
  border-bottom:0 !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-drawer-nav,
#mk-mobile-unified-sidebar-surface .msb-global-list{
  margin:0 !important;
  padding:0 !important;
  list-style:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-list{
  padding:.78rem .56rem 1.2rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-section-title{
  margin:.86rem .34rem .34rem !important;
  padding:0 !important;
  font-size:.61rem !important;
  font-weight:800 !important;
  letter-spacing:.075em !important;
  text-transform:uppercase !important;
  color:color-mix(in srgb, var(--md-default-fg-color) 54%, transparent) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-section-title:first-child{
  margin-top:0 !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link-item{
  margin:.30rem .12rem !important;
  padding:0 !important;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 11%, transparent) !important;
  border-radius:13px !important;
  background:color-mix(in srgb, var(--md-default-bg-color) 93%, var(--md-default-fg-color) 7%) !important;
  overflow:hidden !important;
  box-shadow:none !important;
}
html[data-md-color-scheme="slate"] #mk-mobile-unified-sidebar-surface .msb-global-link-item{
  border-color:rgba(255,255,255,.10) !important;
  background:color-mix(in srgb, var(--md-default-bg-color) 88%, rgba(255,255,255,.06) 12%) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link-item.msb-global-year{
  margin-top:.34rem !important;
  margin-bottom:.18rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link-item.msb-global-course{
  margin:.14rem .12rem .14rem .66rem !important;
  border-radius:11px !important;
  background:transparent !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-course[data-msb-global-year-open="0"]{
  display:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link{
  display:flex !important;
  flex-direction:column !important;
  align-items:flex-start !important;
  justify-content:center !important;
  min-height:0 !important;
  height:auto !important;
  width:100% !important;
  margin:0 !important;
  padding:.50rem .64rem !important;
  border:0 !important;
  background:transparent !important;
  color:inherit !important;
  font:inherit !important;
  text-align:left !important;
  text-decoration:none !important;
  white-space:normal !important;
  overflow:visible !important;
  text-overflow:clip !important;
  line-height:1.25 !important;
  -webkit-tap-highlight-color:transparent !important;
  box-shadow:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-year-toggle{
  position:relative !important;
  flex-direction:row !important;
  align-items:center !important;
  justify-content:space-between !important;
  min-height:2.45rem !important;
  cursor:pointer !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-course .msb-global-link{
  padding:.34rem .54rem !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link-title{
  display:block !important;
  font-size:.78rem !important;
  font-weight:750 !important;
  line-height:1.28 !important;
  color:var(--md-default-fg-color) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-course .msb-global-link-title{
  font-size:.72rem !important;
  font-weight:650 !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link-desc{
  display:block !important;
  margin-top:.16rem !important;
  font-size:.62rem !important;
  font-weight:500 !important;
  line-height:1.28 !important;
  color:color-mix(in srgb, var(--md-default-fg-color) 58%, transparent) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-year .msb-global-link-desc{
  display:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-year-chevron{
  position:relative !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:1.1rem !important;
  height:1.1rem !important;
  min-width:1.1rem !important;
  margin-left:.5rem !important;
  color:currentColor !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-year-chevron::before{
  content:"" !important;
  position:absolute !important;
  left:50% !important;
  top:50% !important;
  width:.43rem !important;
  height:.43rem !important;
  border:solid currentColor !important;
  border-width:0 2px 2px 0 !important;
  background:transparent !important;
  transform:translate(-58%, -50%) rotate(-45deg) !important;
  transform-origin:50% 50% !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-year[data-msb-global-year-open="1"] .msb-global-year-chevron::before{
  transform:translate(-50%, -58%) rotate(45deg) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link:hover,
#mk-mobile-unified-sidebar-surface .msb-global-link:focus-visible{
  background:color-mix(in srgb, var(--md-accent-fg-color) 10%, transparent) !important;
  outline:none !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link.is-current{
  color:var(--md-accent-fg-color) !important;
  background:color-mix(in srgb, var(--md-accent-fg-color) 12%, transparent) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-link.is-current .msb-global-link-title{
  color:var(--md-accent-fg-color) !important;
}
#mk-mobile-unified-sidebar-surface .msb-global-empty{
  margin:.2rem .34rem !important;
  padding:.52rem .58rem !important;
  border-radius:12px !important;
  font-size:.68rem !important;
  line-height:1.34 !important;
  color:color-mix(in srgb, var(--md-default-fg-color) 62%, transparent) !important;
  background:color-mix(in srgb, var(--md-default-bg-color) 90%, var(--md-default-fg-color) 10%) !important;
}

/* v53: Year drawer spacing fix.
   The large gaps came from cloned MkDocs nested course rows keeping nested-nav
   layout residue.  On Year scopes the drawer is a flat course list, so every
   block row is forced back to one shallow title row with uniform compact rhythm. */
@media (max-width: 76.1875em){
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > nav.md-nav,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > input.md-nav__toggle,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link:not(:only-child),
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > nav.md-nav,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > input.md-nav__toggle,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link:not(:only-child){
    display:none !important;
    height:0 !important;
    min-height:0 !important;
    max-height:0 !important;
    margin:0 !important;
    padding:0 !important;
    overflow:hidden !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"],
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"]{
    display:block !important;
    height:auto !important;
    min-height:0 !important;
    max-height:none !important;
    padding-top:0 !important;
    padding-bottom:0 !important;
    overflow:visible !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row{
    padding-top:.42rem !important;
    padding-bottom:.14rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
    display:block !important;
    height:auto !important;
    min-height:0 !important;
    max-height:none !important;
    margin-top:0 !important;
    margin-bottom:0 !important;
    padding-top:.10rem !important;
    padding-bottom:.10rem !important;
    line-height:1.20 !important;
    white-space:normal !important;
    overflow:visible !important;
    text-overflow:clip !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-mid > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-mid > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link{
    padding-top:.10rem !important;
    padding-bottom:.10rem !important;
  }
}


/* v54: restore Year-drawer rhythm after shallow cleanup.
   v53 correctly removed the hidden nested-nav residue, but its compact row
   overrides made the four Block cards look squeezed.  Keep the shallow DOM,
   then reuse the mobile lecture-card spacing family from concept pages. */
@media (max-width: 76.1875em){
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"],
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"]{
    margin-left:.42rem !important;
    margin-right:.42rem !important;
    padding-top:0 !important;
    padding-bottom:0 !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item.msb-group-first,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item.msb-group-single,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item.msb-group-first,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item.msb-group-single{
    margin-top:.54rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .msb-group-head .msb-group-head__row{
    padding-left:.74rem !important;
    padding-right:.56rem !important;
    padding-top:.50rem !important;
    padding-bottom:.26rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"] > label.md-nav__link{
    display:block !important;
    height:auto !important;
    min-height:0 !important;
    max-height:none !important;
    margin:0 !important;
    padding-left:1.02rem !important;
    padding-right:.86rem !important;
    padding-top:.24rem !important;
    padding-bottom:.24rem !important;
    line-height:1.28 !important;
    white-space:normal !important;
    overflow:visible !important;
    text-overflow:clip !important;
    box-sizing:border-box !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-mid > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-lead > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-mid > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link{
    padding-top:.24rem !important;
    padding-bottom:.24rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-sidebar__scrollwrap[data-msb-sort-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-last > .md-nav__link,
  #mk-mobile-unified-sidebar-surface .msb-unified-scrollwrap[data-msb-scope-kind="year"] .md-nav__item[data-msb-group-kind="block"].msb-group-single > .md-nav__link{
    padding-bottom:.42rem !important;
  }
}

#mk-sidebar-drawer-gap-safe-probe{
  position:fixed;
  left:0;
  bottom:0;
  visibility:hidden;
  pointer-events:none;
  height:0;
  padding-bottom:constant(safe-area-inset-bottom);
  padding-bottom:env(safe-area-inset-bottom, 0px);
}


/* v61: SVG-only lecture chevron.
   Edge and Firefox were still able to render a stale glyph/pseudo-element arrow
   together with the border chevron.  This block kills every pseudo-arrow and
   shows exactly one inline SVG path. */
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn::before,
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn::after,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn::after,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn::before,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn::after{
  content:none !important;
  display:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn > :not(.msb-group-head__chevron),
#mk-mobile-unified-sidebar-surface .msb-group-head__btn > :not(.msb-group-head__chevron),
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn > :not(.msb-group-head__chevron){
  display:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn{
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  font-size:0 !important;
  line-height:0 !important;
  overflow:visible !important;
  transform:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron{
  position:relative !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:.92rem !important;
  height:.92rem !important;
  min-width:.92rem !important;
  color:currentColor !important;
  background:transparent !important;
  border:0 !important;
  border-radius:0 !important;
  box-shadow:none !important;
  font-size:0 !important;
  line-height:0 !important;
  overflow:visible !important;
  transform:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::before,
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron::after,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::before,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron::after,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron::before,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron::after{
  content:none !important;
  display:none !important;
  width:0 !important;
  height:0 !important;
  border:0 !important;
  background:transparent !important;
  box-shadow:none !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-mobile-unified-sidebar-surface .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-sidebar-drawer-ghost-floor .msb-group-head__chevron > svg.msb-group-head__chevron-svg{
  display:block !important;
  width:.82rem !important;
  height:.82rem !important;
  min-width:.82rem !important;
  min-height:.82rem !important;
  margin:0 !important;
  padding:0 !important;
  color:currentColor !important;
  fill:none !important;
  stroke:currentColor !important;
  stroke-width:2.05 !important;
  stroke-linecap:round !important;
  stroke-linejoin:round !important;
  overflow:visible !important;
  pointer-events:none !important;
  transform:rotate(0deg) !important;
  transform-origin:50% 50% !important;
  transition:transform 150ms cubic-bezier(.4,0,.2,1), color 120ms ease !important;
}
html.mk-sidebar-sort-ready .md-sidebar--primary .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-mobile-unified-sidebar-surface .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron > svg.msb-group-head__chevron-svg,
#mk-sidebar-drawer-ghost-floor .msb-group-head__btn[aria-expanded="true"] .msb-group-head__chevron > svg.msb-group-head__chevron-svg{
  transform:rotate(90deg) !important;
}


/* v71 desktop polish:
   - keep the custom range scrollbar outside the lecture/block cards, but cut
     the right gap down to roughly one third of v70;
   - remove the left card indent so Lecture containers start at the sidebar edge;
   - make the group-level chevrons quieter and smaller. */
@media (min-width: 76.1876em){
  html.mk-sidebar-sort-ready .md-sidebar--primary{
    --msb-desktop-card-right-clearance:.82rem;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind]{
    margin-left:0 !important;
    margin-right:var(--msb-desktop-card-right-clearance) !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .msb-group-head .msb-group-head__row{
    padding-right:.42rem !important;
  }
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > .md-nav__link,
  html.mk-sidebar-sort-ready .md-sidebar--primary .md-nav__item[data-msb-group-kind] > label.md-nav__link{
    padding-right:.52rem !important;
  }
}

`;
    (document.head || document.documentElement).appendChild(style);
  }

  function swallowMobileDrawerBackdropEvent(event) {
    if (!event) return;
    try { if (typeof event.preventDefault === 'function') event.preventDefault(); } catch (_) {}
    try { if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation(); } catch (_) {}
    try { if (typeof event.stopPropagation === 'function') event.stopPropagation(); } catch (_) {}
  }

  function bindMobileDrawerGlobalSuppressOnce() {
    if (runtime.mobileDrawerGlobalSuppressBound) return;
    runtime.mobileDrawerGlobalSuppressBound = true;
    const suppress = function (event) {
      try {
        const now = (window.performance && typeof window.performance.now === 'function') ? window.performance.now() : Date.now();
        if (now > (runtime.mobileDrawerSuppressUntil || 0)) return;
        const target = event && event.target instanceof Element ? event.target : null;
        if (target && target.closest && target.closest('.md-header, .md-tabs, #mk-mobile-unified-sidebar-surface')) return;
        swallowMobileDrawerBackdropEvent(event);
      } catch (_) {}
    };
    ['click', 'dblclick', 'auxclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(function (eventName) {
      try { document.addEventListener(eventName, suppress, { capture: true, passive: false }); } catch (_) {}
    });
  }

  function activateMobileDrawerClickShield(durationMs) {
    const shield = document.getElementById('mk-mobile-drawer-click-shield');
    const ms = Math.max(260, Number(durationMs) || 900);
    try {
      const now = (window.performance && typeof window.performance.now === 'function') ? window.performance.now() : Date.now();
      runtime.mobileDrawerSuppressUntil = now + ms;
    } catch (_) {
      runtime.mobileDrawerSuppressUntil = Date.now() + ms;
    }
    bindMobileDrawerGlobalSuppressOnce();
    if (shield instanceof HTMLElement) {
      shield.classList.add('is-active');
      shield.style.pointerEvents = 'auto';
    }
    if (runtime.mobileDrawerShieldTimer) window.clearTimeout(runtime.mobileDrawerShieldTimer);
    runtime.mobileDrawerShieldTimer = window.setTimeout(function () {
      runtime.mobileDrawerShieldTimer = 0;
      runtime.mobileDrawerSuppressUntil = 0;
      const node = document.getElementById('mk-mobile-drawer-click-shield');
      if (node instanceof HTMLElement) {
        node.classList.remove('is-active');
        node.style.removeProperty('pointer-events');
      }
    }, ms);
  }

  function closeMobileDrawerFromBackdrop(event) {
    swallowMobileDrawerBackdropEvent(event);
    activateMobileDrawerClickShield(960);
    const toggle = drawerToggle();
    if (toggle instanceof HTMLInputElement) {
      if (toggle.checked) {
        toggle.checked = false;
        try { toggle.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) {}
      } else {
        try { closeUnifiedCustomDrawerSurface(); } catch (_) {}
      }
    } else {
      try { closeUnifiedCustomDrawerSurface(); } catch (_) {}
    }
  }

  function bindMobileDrawerClickProtection(backdrop, clickShield) {
    if (backdrop instanceof HTMLElement && backdrop.dataset.msbBackdropBound !== '1') {
      backdrop.dataset.msbBackdropBound = '1';
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(function (eventName) {
        try { backdrop.addEventListener(eventName, closeMobileDrawerFromBackdrop, { capture: true, passive: false }); } catch (_) {}
      });
      ['pointerup', 'mouseup', 'touchend', 'touchcancel', 'pointercancel', 'touchmove', 'pointermove'].forEach(function (eventName) {
        try { backdrop.addEventListener(eventName, swallowMobileDrawerBackdropEvent, { capture: true, passive: false }); } catch (_) {}
      });
    }
    if (clickShield instanceof HTMLElement && clickShield.dataset.msbShieldBound !== '1') {
      clickShield.dataset.msbShieldBound = '1';
      ['click', 'dblclick', 'auxclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchmove', 'touchend'].forEach(function (eventName) {
        try { clickShield.addEventListener(eventName, swallowMobileDrawerBackdropEvent, { capture: true, passive: false }); } catch (_) {}
      });
    }
  }

  function ensureDrawerGapPatchNodes() {
    ensureDrawerGapPatchStyles();
    const root = document.body || document.documentElement;
    if (!root) return {};

    let top = document.getElementById('mk-sidebar-drawer-gap-top');
    if (!top) {
      top = document.createElement('div');
      top.id = 'mk-sidebar-drawer-gap-top';
      root.appendChild(top);
    }

    let bottom = document.getElementById('mk-sidebar-drawer-gap-bottom');
    if (!bottom) {
      bottom = document.createElement('div');
      bottom.id = 'mk-sidebar-drawer-gap-bottom';
      root.appendChild(bottom);
    }

    let ghost = document.getElementById('mk-sidebar-drawer-ghost-floor');
    if (!ghost) {
      ghost = document.createElement('div');
      ghost.id = 'mk-sidebar-drawer-ghost-floor';
      root.appendChild(ghost);
    }
    try {
      ghost.classList.add('md-sidebar--primary', 'mk-sidebar-ghost-host');
      ghost.setAttribute('aria-hidden', 'true');
    } catch (_) {}


    let unified = document.getElementById('mk-mobile-unified-sidebar-surface');
    if (!unified) {
      unified = document.createElement('aside');
      unified.id = 'mk-mobile-unified-sidebar-surface';
      unified.className = 'md-sidebar md-sidebar--primary mk-mobile-unified-sidebar-surface';
      unified.setAttribute('data-msb-unified-drawer', '1');
      root.appendChild(unified);
    }
    try {
      unified.classList.add('md-sidebar', 'md-sidebar--primary', 'mk-mobile-unified-sidebar-surface');
    } catch (_) {}

    let backdrop = document.getElementById('mk-mobile-drawer-backdrop-blur');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'mk-mobile-drawer-backdrop-blur';
      backdrop.setAttribute('aria-hidden', 'true');
      root.appendChild(backdrop);
    }

    let clickShield = document.getElementById('mk-mobile-drawer-click-shield');
    if (!clickShield) {
      clickShield = document.createElement('div');
      clickShield.id = 'mk-mobile-drawer-click-shield';
      clickShield.setAttribute('aria-hidden', 'true');
      root.appendChild(clickShield);
    }

    bindMobileDrawerClickProtection(backdrop, clickShield);

    let probe = document.getElementById('mk-sidebar-drawer-gap-safe-probe');
    if (!probe) {
      probe = document.createElement('div');
      probe.id = 'mk-sidebar-drawer-gap-safe-probe';
      root.appendChild(probe);
    }

    return { top: top, bottom: bottom, ghost: ghost, probe: probe, unified: unified, backdrop: backdrop, clickShield: clickShield };
  }

  function hideDrawerGapPatch(node) {
    if (!(node instanceof HTMLElement)) return;
    node.style.display = 'none';
    node.style.removeProperty('left');
    node.style.removeProperty('top');
    node.style.removeProperty('width');
    node.style.removeProperty('height');
    node.style.removeProperty('bottom');
  }

  function hideMobileDrawerBackdropBlur() {
    const backdrop = document.getElementById('mk-mobile-drawer-backdrop-blur');
    const shield = document.getElementById('mk-mobile-drawer-click-shield');
    if (backdrop instanceof HTMLElement) {
      backdrop.style.removeProperty('--msb-drawer-backdrop-left');
      backdrop.style.removeProperty('--msb-drawer-backdrop-top');
      backdrop.style.removeProperty('--msb-drawer-backdrop-width');
      backdrop.style.removeProperty('--msb-drawer-backdrop-height');
    }
    if (shield instanceof HTMLElement) {
      shield.style.removeProperty('--msb-drawer-shield-left');
      shield.style.removeProperty('--msb-drawer-shield-top');
      shield.style.removeProperty('--msb-drawer-shield-width');
      shield.style.removeProperty('--msb-drawer-shield-height');
    }
  }

  function updateMobileDrawerBackdropBlur(metrics) {
    const nodes = ensureDrawerGapPatchNodes();
    const backdrop = nodes.backdrop;
    const shield = nodes.clickShield;
    if (!(backdrop instanceof HTMLElement)) return;
    if (!isMobileViewport()) {
      hideMobileDrawerBackdropBlur();
      return;
    }

    try {
      const vv = visualViewportMetrics();
      const topViewport = Math.max(0, mobileHeaderVisualBottom());
      const left = pageScrollXNow() + Math.max(0, Number(vv.left) || 0);
      const top = pageScrollYNow() + topViewport;
      const width = Math.max(1, Number(vv.width) || Number(window.innerWidth) || Number(document.documentElement && document.documentElement.clientWidth) || 1);

      const visibleBottom = unifiedVisibleBottomPx();
      const safeStrip = Math.max(readSafeAreaBottomInsetPx(), vv.layoutBottomGap || 0, iosCompleteToolbarOcclusionPx());
      const layoutBottom = Math.max(Number(window.innerHeight) || 0, Number(vv.bottom) || 0, visibleBottom) + Math.max(0, safeStrip);
      const byMetrics = metrics && Number(metrics.height) ? Number(metrics.height) : 0;
      const height = Math.max(80, byMetrics || (layoutBottom - topViewport));

      backdrop.style.setProperty('--msb-drawer-backdrop-left', cssPx(left));
      backdrop.style.setProperty('--msb-drawer-backdrop-top', cssPx(top));
      backdrop.style.setProperty('--msb-drawer-backdrop-width', cssPx(width));
      backdrop.style.setProperty('--msb-drawer-backdrop-height', cssPx(height));
      if (shield instanceof HTMLElement) {
        shield.style.setProperty('--msb-drawer-shield-left', cssPx(left));
        shield.style.setProperty('--msb-drawer-shield-top', cssPx(top));
        shield.style.setProperty('--msb-drawer-shield-width', cssPx(width));
        shield.style.setProperty('--msb-drawer-shield-height', cssPx(height));
      }
    } catch (_) {}
  }

  function pageScrollXNow() {
    try {
      return Math.max(
        0,
        Number(window.scrollX) || 0,
        Number(window.pageXOffset) || 0,
        Number(document.documentElement && document.documentElement.scrollLeft) || 0,
        Number(document.body && document.body.scrollLeft) || 0
      );
    } catch (_) {
      return 0;
    }
  }

  function pageScrollYNow() {
    try {
      return Math.max(
        0,
        Number(window.scrollY) || 0,
        Number(window.pageYOffset) || 0,
        Number(document.documentElement && document.documentElement.scrollTop) || 0,
        Number(document.body && document.body.scrollTop) || 0
      );
    } catch (_) {
      return 0;
    }
  }

  function cssPx(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0px';
    return (Math.round(n * 1000) / 1000) + 'px';
  }


  function isIOSWebKitMobile() {
    try {
      const ua = String(navigator.userAgent || "");
      const platform = String(navigator.platform || "");
      const isiOS = /iP(?:hone|ad|od)/i.test(ua) || (/Mac/i.test(platform) && Number(navigator.maxTouchPoints || 0) > 1);
      if (!isiOS) return false;
      // All iOS browsers use WebKit; keep the check permissive because iOS 26
      // Safari / browser chrome reports different UA details across modes.
      return true;
    } catch (_) {
      return false;
    }
  }

  function iosCompleteToolbarOcclusionPx() {
    if (!isMobileViewport() || !isIOSWebKitMobile()) return 0;
    const vv = window.visualViewport;
    const layoutH = Math.max(1, Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 1);
    const vvBottom = vv ? ((Number(vv.offsetTop) || 0) + (Number(vv.height) || 0)) : layoutH;
    const visualGap = vv ? Math.max(0, Math.round(layoutH - vvBottom)) : 0;

    let screenH = 0;
    try {
      screenH = Math.max(Number(window.screen && window.screen.height) || 0, Number(window.screen && window.screen.width) || 0);
    } catch (_) {
      screenH = 0;
    }

    const safe = Math.max(0, readSafeAreaBottomInsetPx());
    const screenGap = screenH > 0 ? Math.max(0, Math.round(screenH - layoutH - safe)) : 0;
    const raw = Math.max(visualGap, screenGap);

    // Complete bottom-address-bar mode has a large hidden browser-chrome band.
    // Compact mode and most non-iOS mobile browsers usually report 0-small gaps.
    if (raw < 56) return 0;
    return clamp(raw, 64, 260);
  }

  function unifiedVisibleBottomPx() {
    const vv = visualViewportMetrics();
    const layoutBottom = Number(window.innerHeight) || Number(document.documentElement && document.documentElement.clientHeight) || 0;
    if (window.visualViewport) {
      const visualBottom = Math.max(0, Number(vv.bottom) || 0);
      if (visualBottom > 0 && layoutBottom > 0) return Math.min(layoutBottom, visualBottom);
      if (visualBottom > 0) return visualBottom;
    }
    return Math.max(0, layoutBottom);
  }

  function applyUnifiedListBottomPadding(clone, metrics) {
    if (!(clone instanceof HTMLElement)) return 0;
    const scroller = unifiedCloneListScroller(clone);
    if (!(scroller instanceof HTMLElement)) return 0;

    let headH = 0;
    try {
      const head = clone.querySelector(':scope > .msb-unified-head');
      if (head instanceof HTMLElement) headH = Math.ceil(head.getBoundingClientRect().height || head.offsetHeight || 0);
    } catch (_) {}

    const visibleListH = Math.max(80, (Number(metrics && metrics.visibleHeight) || Number(window.innerHeight) || 0) - headH);
    const hiddenTail = Math.max(0, (Number(scroller.clientHeight) || 0) - visibleListH);
    const occlusion = iosCompleteToolbarOcclusionPx();
    // The unified surface itself is already extended behind Safari's complete
    // bottom toolbar.  Therefore the list only needs padding equal to the
    // actually hidden tail of that same scroller.  Adding the separately
    // estimated toolbar height again creates a large blank scroll range.
    const pad = occlusion > 0 ? Math.ceil(hiddenTail) : 0;

    try {
      scroller.style.setProperty('--msb-unified-list-bottom-pad', cssPx(pad));
      if (pad > 0) {
        scroller.setAttribute('data-msb-ios-complete-bottom-pad', '1');
      } else {
        scroller.removeAttribute('data-msb-ios-complete-bottom-pad');
      }
      scroller.style.boxSizing = 'border-box';
    } catch (_) {}
    return pad;
  }

  function hideDrawerGhostFloor(node) {
    hideDrawerGapPatch(node);
    if (node instanceof HTMLElement) {
      try { node.style.removeProperty('--msb-ghost-content-offset'); } catch (_) {}
      try { node.style.removeProperty('--msb-ghost-inner-left'); } catch (_) {}
      try { node.style.removeProperty('--msb-ghost-inner-width'); } catch (_) {}
      try { node.style.removeProperty('--msb-ghost-viewport-top'); } catch (_) {}
      try { node.style.removeProperty('--msb-ghost-viewport-height'); } catch (_) {}
      try { ghostFloorState.layoutKey = ''; ghostFloorState.correction = 0; ghostFloorState.lastScrollTop = -1; } catch (_) {}
    }
  }


  const USE_UNIFIED_MOBILE_DRAWER_SURFACE = true;
  const unifiedDrawerState = {
    sig: '',
    preopenUntil: 0,
    isOpen: false,
    hideTimer: 0,
    lastScrollTop: -1,
    bound: false,
    touchBound: false,
    scrollbarFadeTimer: 0,
    coldPrimeTimer: 0,
    coldPrimeRaf: 0,
    postClosePrimeTimer: 0,
    postClosePrimeRaf: 0
  };

  function cancelUnifiedDrawerHideTimer() {
    if (unifiedDrawerState.hideTimer) {
      try { window.clearTimeout(unifiedDrawerState.hideTimer); } catch (_) {}
      unifiedDrawerState.hideTimer = 0;
    }
  }

  function cancelUnifiedDrawerPostClosePrime() {
    if (unifiedDrawerState.postClosePrimeTimer) {
      try { window.clearTimeout(unifiedDrawerState.postClosePrimeTimer); } catch (_) {}
      unifiedDrawerState.postClosePrimeTimer = 0;
    }
    if (unifiedDrawerState.postClosePrimeRaf) {
      try { window.cancelAnimationFrame(unifiedDrawerState.postClosePrimeRaf); } catch (_) {}
      unifiedDrawerState.postClosePrimeRaf = 0;
    }
  }

  function forceUnifiedDrawerContentPrepaint(surface) {
    if (!(surface instanceof HTMLElement)) return;
    try { void surface.offsetWidth; } catch (_) {}
    try { void surface.offsetHeight; } catch (_) {}
    try {
      const shell = surface.querySelector(':scope > .msb-unified-scrollwrap');
      if (shell instanceof HTMLElement) {
        shell.style.webkitTransform = 'translateZ(0)';
        shell.style.transform = 'translateZ(0)';
        void shell.offsetWidth;
        void shell.offsetHeight;
      }
      const scroller = shell instanceof HTMLElement ? unifiedCloneListScroller(shell) : null;
      if (scroller instanceof HTMLElement) {
        scroller.style.webkitTransform = 'translateZ(0)';
        scroller.style.transform = 'translateZ(0)';
        void scroller.clientHeight;
        void scroller.scrollHeight;
        const list = scroller.querySelector('.md-nav__list');
        if (list instanceof HTMLElement) {
          void list.offsetHeight;
          void list.scrollHeight;
        }
      }
    } catch (_) {}
  }

  function resetUnifiedClosedSurfaceGeometryAndPrewarm(forceRebuild) {
    if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return false;
    if (isDrawerOpen()) return false;

    const surface = unifiedDrawerSurfaceNode();
    const scrollWrap = getScrollWrap();
    if (!(surface instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return false;

    unifiedDrawerState.isOpen = false;
    unifiedDrawerState.preopenUntil = 0;

    try {
      surface.classList.add('is-ready', 'is-setup');
      surface.classList.remove('is-open', 'is-closing', 'is-scrolling');
      html().classList.remove('msb-unified-mobile-drawer-visible');
    } catch (_) {}

    bindUnifiedDrawerSurfaceEvents(surface);

    const metrics = unifiedDrawerMetrics();
    try {
      surface.style.setProperty('--msb-custom-open-left', cssPx(metrics.openLeft));
      surface.style.setProperty('--msb-custom-closed-shift', cssPx(metrics.closedShift));
      surface.style.setProperty('--msb-custom-top', cssPx(metrics.topDoc));
      surface.style.setProperty('--msb-custom-width', cssPx(metrics.width));
      surface.style.setProperty('--msb-custom-height', cssPx(metrics.height));
      surface.style.setProperty('--msb-custom-visible-height', cssPx(metrics.visibleHeight));
      surface.classList.toggle('is-no-motion', !unifiedDrawerMotionEnabled());
    } catch (_) {}

    const clone = rebuildUnifiedDrawerClone(surface, scrollWrap, !!forceRebuild);
    if (clone instanceof HTMLElement) {
      precenterUnifiedClone(clone, metrics);
      applyUnifiedListBottomPadding(clone, metrics);
    }
    updateUnifiedFakeScrollbar(surface, metrics);

    forceUnifiedDrawerContentPrepaint(surface);
    window.requestAnimationFrame(function () {
      if (isDrawerOpen()) return;
      forceUnifiedDrawerContentPrepaint(surface);
      window.requestAnimationFrame(function () {
        if (isDrawerOpen()) return;
        forceUnifiedDrawerContentPrepaint(surface);
      });
    });

    return clone instanceof HTMLElement;
  }

  function scheduleUnifiedDrawerPostClosePrime(forceRebuild) {
    if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return;
    cancelUnifiedDrawerPostClosePrime();

    const pageKey = runtime.currentPageKey || currentRelPath();
    unifiedDrawerState.postClosePrimeTimer = window.setTimeout(function () {
      unifiedDrawerState.postClosePrimeTimer = 0;
      unifiedDrawerState.postClosePrimeRaf = window.requestAnimationFrame(function () {
        unifiedDrawerState.postClosePrimeRaf = 0;
        if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return;
        if ((runtime.currentPageKey || currentRelPath()) !== pageKey) return;
        if (isDrawerOpen()) return;
        resetUnifiedClosedSurfaceGeometryAndPrewarm(!!forceRebuild);

        // A second and third layout read keep the already-built clone committed
        // after Safari has finished the closing transition and after the native
        // drawer checkbox has settled.  These passes do not rebuild unless the
        // caller explicitly requested it.
        [180, 520].forEach(function (delay) {
          window.setTimeout(function () {
            if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return;
            if ((runtime.currentPageKey || currentRelPath()) !== pageKey) return;
            if (isDrawerOpen()) return;
            resetUnifiedClosedSurfaceGeometryAndPrewarm(false);
          }, delay);
        });
      });
    }, 60);
  }

  function unifiedDrawerSurfaceNode() {
    const nodes = ensureDrawerGapPatchNodes();
    return nodes && nodes.unified instanceof HTMLElement ? nodes.unified : null;
  }

  function unifiedDrawerMotionEnabled() {
    try {
      if (window.MkSiteMotion && typeof window.MkSiteMotion.isEnabled === 'function') {
        return !!window.MkSiteMotion.isEnabled();
      }
    } catch (_) {}
    try {
      return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return true;
    }
  }

  function unifiedDrawerMetrics() {
    const sidebar = getPrimarySidebar();
    const scrollWrap = getScrollWrap();
    let sidebarRect = null;
    let wrapRect = null;
    try { sidebarRect = sidebar && sidebar.getBoundingClientRect ? sidebar.getBoundingClientRect() : null; } catch (_) { sidebarRect = null; }
    try { wrapRect = scrollWrap && scrollWrap.getBoundingClientRect ? scrollWrap.getBoundingClientRect() : null; } catch (_) { wrapRect = null; }

    const vv = visualViewportMetrics();
    const viewportW = Math.max(1, Number(window.innerWidth) || Number(vv.width) || 1);

    // For the custom visual surface, never trust the native drawer's current
    // animated top.  In iOS full address-bar mode Material can report the
    // drawer/scrollwrap as starting far below the tab row, which was the source
    // of the large blank band above "Math I: Calculus".  The unified surface
    // is a replacement visual layer, so its top is simply the bottom of the
    // visible header/tabs.
    const headerBottom = Math.max(0, mobileHeaderVisualBottom());
    const top = headerBottom;

    let nativeWidth = 0;
    if (sidebarRect && sidebarRect.width > 40) nativeWidth = sidebarRect.width;
    else if (wrapRect && wrapRect.width > 40) nativeWidth = wrapRect.width;
    else nativeWidth = Math.min(viewportW * 0.78, 520);

    // The unified drawer is a custom visual layer.  Earlier mobile versions
    // deliberately made it narrower than Material's native drawer; the current
    // phone layout needs about one third more width than that compact version.
    // Current target = (native * 2/3) * 4/3 = native * 8/9, with viewport caps
    // so it still leaves visible page context on the right.
    const expandedWidth = nativeWidth * (8 / 9);
    const minWidth = Math.min(280, Math.max(240, viewportW * 0.58));
    const maxWidth = Math.min(viewportW * 0.86, 620);
    const width = clamp(expandedWidth, minWidth, maxWidth);

    const visibleBottom = unifiedVisibleBottomPx();
    const safeStrip = Math.max(readSafeAreaBottomInsetPx(), vv.layoutBottomGap || 0, iosCompleteToolbarOcclusionPx());
    // Keep the surface long enough to cover iOS' complete bottom-toolbar band,
    // but do not add an artificial extra tail.  The scroll range below is
    // handled by padding the real list scroller, otherwise the drawer can end
    // with a large blank area after the last lecture/concept.
    const layoutBottom = Math.max(Number(window.innerHeight) || 0, Number(vv.bottom) || 0, visibleBottom) + Math.max(0, safeStrip);
    const height = Math.max(80, layoutBottom - top);
    const openLeft = pageScrollXNow() + Math.max(0, Number(vv.left) || 0);
    const closedShift = -width - 14;

    return {
      topViewport: top,
      topDoc: pageScrollYNow() + top,
      width: width,
      height: height,
      openLeft: openLeft,
      closedLeft: openLeft + closedShift,
      closedShift: closedShift,
      visibleHeight: Math.max(80, visibleBottom - top)
    };
  }

  function elementTopInScrollContent(el, scrollWrap) {
    if (!(el instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return 0;
    try {
      const er = el.getBoundingClientRect();
      const wr = scrollWrap.getBoundingClientRect();
      if (er && wr && Number.isFinite(er.top) && Number.isFinite(wr.top)) {
        return (Number(scrollWrap.scrollTop) || 0) + (er.top - wr.top);
      }
    } catch (_) {}

    let y = 0;
    let cur = el;
    let guard = 0;
    while (cur && cur !== scrollWrap && guard < 80) {
      y += Number(cur.offsetTop) || 0;
      cur = cur.offsetParent instanceof HTMLElement ? cur.offsetParent : cur.parentElement;
      guard += 1;
      if (cur && !scrollWrap.contains(cur)) break;
    }
    return y;
  }

  function activeDrawerTargetForPrecenter(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return null;
    try {
      if (typeof centering !== 'undefined' && centering && typeof centering.activeTarget === 'function') {
        const t = centering.activeTarget();
        if (t instanceof HTMLElement && scrollWrap.contains(t)) return t;
      }
    } catch (_) {}

    const active =
      scrollWrap.querySelector('.md-nav__link[aria-current="page"]') ||
      scrollWrap.querySelector('a.md-nav__link--active') ||
      scrollWrap.querySelector('.md-nav__link--active');
    if (active instanceof HTMLElement) return active.closest('.md-nav__item') || active;
    return null;
  }

  function precenterRealSidebarForUnifiedDrawer() {
    const scrollWrap = getScrollWrap();
    if (!(scrollWrap instanceof HTMLElement)) return false;
    const target = activeDrawerTargetForPrecenter(scrollWrap);
    if (!(target instanceof HTMLElement)) return false;

    const metrics = unifiedDrawerMetrics();
    const bar = scrollWrap.querySelector('#current-course-bar');
    const control = scrollWrap.querySelector('#' + IDS.control);
    const stickyH = Math.max(0,
      (bar instanceof HTMLElement ? Math.ceil(bar.getBoundingClientRect().height || bar.offsetHeight || 0) : 0) +
      (control instanceof HTMLElement ? Math.ceil(control.getBoundingClientRect().height || control.offsetHeight || 0) : 0)
    );

    const targetTop = elementTopInScrollContent(target, scrollWrap);
    const targetH = Math.max(1, Math.ceil(target.getBoundingClientRect().height || target.offsetHeight || 1));
    const usableH = Math.max(80, metrics.visibleHeight || metrics.height || scrollWrap.clientHeight || 0);
    const desiredTop = targetTop - stickyH - ((Math.max(40, usableH - stickyH) - targetH) / 2);
    const viewportForMax = Math.max(80, usableH);
    const maxScroll = Math.max(0, (scrollWrap.scrollHeight || 0) - Math.max(viewportForMax, scrollWrap.clientHeight || 0));
    const nextTop = clamp(desiredTop, 0, maxScroll);

    try {
      scrollWrap.scrollTop = nextTop;
      unifiedDrawerState.lastScrollTop = nextTop;
      return true;
    } catch (_) {
      try {
        scrollWrap.scrollTo(0, nextTop);
        unifiedDrawerState.lastScrollTop = nextTop;
        return true;
      } catch (__) {
        return false;
      }
    }
  }

  function unifiedDrawerSourceSignature(scrollWrap) {
    let groupSig = '';
    let navSig = '';
    try {
      const list = runtime.scopeList instanceof HTMLElement ? runtime.scopeList : null;
      if (list) {
        groupSig = asArray(list.querySelectorAll(':scope > .md-nav__item[' + ATTR.group + ']')).map(function (row) {
          if (!(row instanceof HTMLElement)) return '';
          return [
            row.getAttribute(ATTR.group) || '',
            row.classList && row.classList.contains(CLS.lead) ? 'L' : '',
            row.getAttribute(ATTR.groupOpen) || '',
            row.getAttribute(ATTR.groupCollapsedItem) || '',
            cleanTitle(row.textContent || '').slice(0, 32)
          ].join(':');
        }).join(',');
      }
    } catch (_) { groupSig = ''; }

    try {
      const source = (runtime.scopeList instanceof HTMLElement && runtime.scopeList.isConnected)
        ? runtime.scopeList
        : ghostSourceList(scrollWrap);
      if (source instanceof HTMLElement) {
        navSig = asArray(source.querySelectorAll(':scope > .md-nav__item, :scope > .md-nav__item > a.md-nav__link[href], :scope > .md-nav__item > .md-nav__link[href]')).slice(0, 120).map(function (node) {
          if (!(node instanceof HTMLElement)) return '';
          const direct = node.matches && node.matches('.md-nav__item') ? directNavLink(node) : node;
          const href = direct && direct.getAttribute ? (direct.getAttribute('href') || '') : '';
          return [
            node.matches && node.matches('.md-nav__item') ? 'row' : 'link',
            normaliseHrefToRel(href),
            node.getAttribute(ATTR.group) || '',
            node.getAttribute(ATTR.groupKind) || '',
            cleanTitle(node.textContent || '').slice(0, 48)
          ].join(':');
        }).join(',');
      }
    } catch (_) { navSig = ''; }

    // Keep this signature structural only.  Do not include scrollHeight,
    // clientHeight, or transient child counts: those change when Material's
    // native drawer opens/closes, which made the custom drawer rebuild exactly
    // at the next opening and caused the nav content to appear halfway through
    // the slide-in.  Layout metrics are refreshed separately without replacing
    // the already-warm clone.
    return [
      String(runtime.currentPageKey || currentRelPath() || ''),
      String(readMode((inferScope() || {}).kind || 'course')),
      String(globalPageKindForRel(currentRelPath()) || 'scoped'),
      String(isCurrentCourseCollapsed(inferScope()) ? 'course-collapsed' : 'course-open'),
      navSig,
      groupSig
    ].join('|');
  }

  function dedupeUnifiedDuplicateGroupHeads(root) {
    if (!(root instanceof HTMLElement)) return;
    const lists = asArray(root.querySelectorAll('.md-nav__list'));
    lists.forEach(function (list) {
      if (!(list instanceof HTMLElement)) return;
      let lastGroup = '';
      asArray(list.children).forEach(function (row) {
        if (!(row instanceof HTMLElement)) return;
        const group = row.getAttribute(ATTR.group) || '';
        if (!group) return;
        if (row.classList && row.classList.contains(CLS.lead) && group === lastGroup) {
          // This is the exact symptom seen in the screenshot: the same lecture
          // group lead is cloned a second time.  The real source of the problem
          // is usually cloning too broad a sidebar subtree, but this cleanup is
          // kept as a defensive guard for cached/instant-nav DOM residue.
          asArray(row.querySelectorAll(':scope > [' + ATTR.injected + '="1"], :scope > .' + CLS.head)).forEach(function (head) {
            try { head.remove(); } catch (_) {}
          });
          row.classList.remove(CLS.lead, CLS.first, CLS.single);
          row.removeAttribute(ATTR.groupCollapsedLead);
        }
        lastGroup = group;
      });
      try { markGroupBoundaries(list); } catch (_) {}
    });
  }

  function markUnifiedActiveGroup(root) {
    if (!(root instanceof HTMLElement)) return;
    try {
      root.querySelectorAll('.msb-unified-active-group,.msb-unified-active-row').forEach(function (el) {
        try { el.classList.remove('msb-unified-active-group', 'msb-unified-active-row'); } catch (_) {}
      });

      const activeLink =
        root.querySelector('a.md-nav__link[aria-current="page"], a.md-nav__link--active, .md-nav__link--active') ||
        (function () {
          const rel = currentRelPath();
          if (!rel) return null;
          const links = asArray(root.querySelectorAll('a.md-nav__link[href], .md-nav__link[href]'));
          for (let i = 0; i < links.length; i += 1) {
            const href = links[i] && links[i].getAttribute ? links[i].getAttribute('href') : '';
            if (sameLogicalRel(normaliseHrefToRel(href), rel)) return links[i];
          }
          return null;
        })();

      const activeRow = activeLink instanceof HTMLElement ? (activeLink.closest('.md-nav__item') || activeLink) : null;
      if (!(activeRow instanceof HTMLElement)) return;
      activeRow.classList.add('msb-unified-active-row');

      const group = activeRow.getAttribute(ATTR.group) || '';
      const list = activeRow.parentElement;
      if (!group || !(list instanceof HTMLElement)) return;
      asArray(list.querySelectorAll(':scope > .md-nav__item[' + ATTR.group + '="' + cssEscape(group) + '"]')).forEach(function (row) {
        if (row instanceof HTMLElement) row.classList.add('msb-unified-active-group');
      });
    } catch (_) {}
  }

  function lectureLabelFromGroupId(groupId) {
    const m = String(groupId || '').match(/^([LW])0*(\d+)$/i);
    if (m) return unitNounFromType(unitTypeFromGroupId(groupId)) + ' ' + String(parseInt(m[2], 10) || 0);
    return unitNounFromType(unitTypeFromGroupId(groupId));
  }

  function repairUnifiedCourseIndexLectureLeads(root) {
    if (!(root instanceof HTMLElement)) return;
    const scope = inferScope();
    if (!isCurrentCourseIndexPage(scope)) return;
    if (readMode('course') === MODE.ALPHA) return;

    const lists = asArray(root.querySelectorAll('.md-nav__list'));
    lists.forEach(function (list) {
      if (!(list instanceof HTMLElement)) return;
      const groups = [];
      const byId = new Map();

      asArray(list.children).forEach(function (row) {
        if (!(row instanceof HTMLElement)) return;
        if (row.getAttribute(ATTR.groupKind) !== 'lecture') return;
        const gid = row.getAttribute(ATTR.group) || '';
        if (!gid) return;
        if (!byId.has(gid)) {
          byId.set(gid, []);
          groups.push(gid);
        }
        byId.get(gid).push(row);
      });

      groups.forEach(function (gid) {
        const rows = byId.get(gid) || [];
        if (!rows.length) return;
        let lead = rows.find(function (row) { return row.classList && row.classList.contains(CLS.lead); }) || rows[0];
        if (!(lead instanceof HTMLElement)) return;

        const existingText = lead.querySelector(':scope > .' + CLS.head + ' .' + CLS.headText);
        const label = cleanTitle(existingText ? existingText.textContent : '') || lectureLabelFromGroupId(gid);
        const btnBefore = lead.querySelector(':scope > .' + CLS.head + ' .' + CLS.headBtn);
        const wasOpen = (lead.getAttribute(ATTR.groupOpen) === '1') || !!(btnBefore && btnBefore.getAttribute('aria-expanded') === 'true');

        lead.classList.add(CLS.lead);
        lead.setAttribute(ATTR.groupOpen, wasOpen ? '1' : '0');
        lead.removeAttribute(ATTR.groupCollapsedItem);
        if (wasOpen) lead.removeAttribute(ATTR.groupCollapsedLead);
        else lead.setAttribute(ATTR.groupCollapsedLead, '1');
        lead.hidden = false;
        if (lead.style) lead.style.removeProperty('display');

        if (!lead.querySelector(':scope > .' + CLS.head)) {
          try { lead.insertBefore(makeGroupHead('lecture', label, gid, scope), lead.firstChild || null); } catch (_) {}
        }
        updateGroupButtonUi(lead, label, wasOpen);

        rows.forEach(function (row) {
          if (!(row instanceof HTMLElement) || row === lead) return;
          row.setAttribute(ATTR.groupOpen, wasOpen ? '1' : '0');
          row.removeAttribute(ATTR.groupCollapsedLead);
          if (wasOpen) {
            row.removeAttribute(ATTR.groupCollapsedItem);
            row.hidden = false;
            if (row.style) row.style.removeProperty('display');
          } else {
            row.setAttribute(ATTR.groupCollapsedItem, '1');
            row.hidden = true;
            if (row.style) row.style.removeProperty('display');
          }
        });
      });

      try { markGroupBoundaries(list); } catch (_) {}
    });
  }

  function shallowiseUnifiedYearCourseRow(li) {
    if (!(li instanceof HTMLElement)) return;
    if (li.getAttribute(ATTR.groupKind) !== "block") return;

    const head = li.querySelector(':scope > .' + CLS.head);
    const headClone = head instanceof HTMLElement ? head.cloneNode(true) : null;

    const directAnchor = li.querySelector(':scope > a.md-nav__link[href], :scope > .md-nav__link[href]');
    const directLabel = li.querySelector(':scope > label.md-nav__link');
    const sourceLink = directAnchor instanceof HTMLElement ? directAnchor : (directLabel instanceof HTMLElement ? directLabel : null);

    let href = directAnchor instanceof HTMLElement && directAnchor.getAttribute
      ? (directAnchor.getAttribute('href') || '')
      : '';
    if (!href) {
      const nestedAnchor = li.querySelector('a.md-nav__link[href], .md-nav__link[href]');
      if (nestedAnchor instanceof HTMLElement && nestedAnchor.getAttribute) {
        href = nestedAnchor.getAttribute('href') || '';
      }
    }

    let title = cleanTitle(sourceLink ? sourceLink.textContent : '');
    if (!title) {
      const nestedTitleAnchor = li.querySelector('a.md-nav__link[href], .md-nav__link[href]');
      title = cleanTitle(nestedTitleAnchor ? nestedTitleAnchor.textContent : '');
    }

    const isCurrent = !!(sourceLink && (
      sourceLink.getAttribute('aria-current') === 'page' ||
      (sourceLink.classList && sourceLink.classList.contains('md-nav__link--active'))
    ));

    const outLink = document.createElement(href ? 'a' : 'span');
    outLink.className = 'md-nav__link';
    if (href) outLink.setAttribute('href', href);
    if (title) outLink.textContent = title;
    if (isCurrent) {
      outLink.setAttribute('aria-current', 'page');
      outLink.classList.add('md-nav__link--active');
    }

    try {
      while (li.firstChild) li.removeChild(li.firstChild);
      if (headClone instanceof HTMLElement) li.appendChild(headClone);
      li.appendChild(outLink);
    } catch (_) {}

    li.classList.remove('md-nav__item--nested');
    li.removeAttribute('data-md-state');
    li.removeAttribute('aria-expanded');
    try {
      li.removeAttribute('style');
      li.style.removeProperty('--md-nav-height');
      li.style.removeProperty('height');
      li.style.removeProperty('min-height');
      li.style.removeProperty('max-height');
      li.style.removeProperty('overflow');
      li.style.removeProperty('grid-template-rows');
    } catch (_) {}
  }

  function pruneUnifiedYearNestedContent(root) {
    if (!(root instanceof HTMLElement)) return;
    const scope = inferScope();
    const isYear = !!(scope && scope.kind === "year");
    const isCourseOverview = unifiedCloneUsesYearOverview(root);
    try {
      // Reuse the compact Year-drawer CSS for the course-overview fallback.  The
      // header still says the current course and the sort dock still says Lecture,
      // but the list below is intentionally the year-level course-title list.
      root.setAttribute("data-msb-scope-kind", (isYear || isCourseOverview) ? "year" : (scope && scope.kind || ""));
    } catch (_) {}
    if (!isYear && !isCourseOverview) return;

    // Year and collapsed-course-overview drawers must be flat course lists.
    // Some MkDocs nested course rows keep hidden sub-nav layout residue after
    // cloning, which creates the non-uniform large gaps between course titles.
    // Rebuild each block row as a shallow row: optional injected Block head plus
    // exactly one course title link.
    asArray(root.querySelectorAll('.md-nav__item[' + ATTR.groupKind + '="block"]')).forEach(function (li) {
      shallowiseUnifiedYearCourseRow(li);
    });

    asArray(root.querySelectorAll(".md-nav__item")).forEach(function (li) {
      if (!(li instanceof HTMLElement)) return;
      asArray(li.querySelectorAll(":scope > nav.md-nav, :scope > input.md-nav__toggle")).forEach(function (node) {
        try { node.remove(); } catch (_) {}
      });

      const directAnchor = li.querySelector(":scope > a.md-nav__link[href], :scope > .md-nav__link[href]");
      if (directAnchor) {
        asArray(li.querySelectorAll(":scope > label.md-nav__link")).forEach(function (label) {
          try { label.remove(); } catch (_) {}
        });
      }

      asArray(li.querySelectorAll(":scope > .md-nav__link .md-nav__icon, :scope > .md-nav__link .md-icon")).forEach(function (icon) {
        try { icon.remove(); } catch (_) {}
      });

      li.classList.remove("md-nav__item--nested");
      li.removeAttribute("data-md-state");
      try {
        li.style.removeProperty("height");
        li.style.removeProperty("min-height");
        li.style.removeProperty("max-height");
        li.style.removeProperty("overflow");
        li.style.removeProperty("grid-template-rows");
        li.style.removeProperty("--md-nav-height");
      } catch (_) {}
    });
  }

  function syncUnifiedCurrentCourseBarClone(root) {
    if (!(root instanceof HTMLElement)) return;
    const scope = inferScope();
    if (!scope || (scope.kind !== "course" && scope.kind !== "year")) return;
    const bar = root.querySelector('#current-course-bar');
    if (!(bar instanceof HTMLElement)) return;
    const titleNode = bar.querySelector('.ccb-title');
    const title = cleanTitle(titleNode ? titleNode.textContent : '') || (scope.kind === 'year' ? 'Select a course' : 'current course');
    syncCurrentCoursePicker(bar, scope, title);
  }

  function cleanupUnifiedClone(clone) {
    if (!(clone instanceof HTMLElement)) return;
    clone.className = 'msb-unified-scrollwrap';
    clone.removeAttribute('style');
    clone.removeAttribute('data-msb-touch-scrolling');
    clone.removeAttribute('data-msb-touch-cooldown');
    clone.setAttribute('aria-hidden', 'false');
    try {
      clone.querySelectorAll('[data-msb-touch-scrolling],[data-msb-touch-cooldown]').forEach(function (el) {
        el.removeAttribute('data-msb-touch-scrolling');
        el.removeAttribute('data-msb-touch-cooldown');
      });
    } catch (_) {}
    pruneUnifiedYearNestedContent(clone);
    dedupeUnifiedDuplicateGroupHeads(clone);
    repairUnifiedCourseIndexLectureLeads(clone);
    normaliseAllGroupChevrons(clone);
    markUnifiedActiveGroup(clone);
    syncUnifiedCurrentCourseBarClone(clone);
  }

  function cloneScopedNavForUnifiedDrawer(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return null;

    const scope = inferScope();
    if (isGlobalDrawerScope(scope)) {
      return buildGlobalMobileDrawerNav(scope && scope.globalKind ? scope.globalKind : (globalPageKindForRel(scope && scope.relPath ? scope.relPath : currentRelPath()) || "global"));
    }

    const showCourseOverview = isCurrentCourseCollapsed(scope);
    let sourceList = null;
    let listKind = "";

    if (showCourseOverview) {
      sourceList = yearOverviewListForCourseScope(scope);
      if (sourceList instanceof HTMLElement) listKind = "course-overview";
    }

    if (!(sourceList instanceof HTMLElement) && runtime.scopeList instanceof HTMLElement && runtime.scopeList.isConnected && scrollWrap.contains(runtime.scopeList)) {
      sourceList = runtime.scopeList;
    }

    if (!(sourceList instanceof HTMLElement)) {
      const active = activeDrawerTargetForPrecenter(scrollWrap);
      if (active instanceof HTMLElement) {
        sourceList = active.closest('.md-nav__list');
      }
    }

    if (!(sourceList instanceof HTMLElement)) {
      sourceList = ghostSourceList(scrollWrap);
    }

    if (!(sourceList instanceof HTMLElement)) return null;

    const sourceNav = sourceList.closest('nav.md-nav');
    const nav = document.createElement('nav');
    nav.className = sourceNav instanceof HTMLElement ? sourceNav.className : 'md-nav';
    nav.removeAttribute('style');
    if (listKind) nav.setAttribute('data-msb-clone-list-kind', listKind);

    const listClone = sourceList.cloneNode(true);
    if (listClone instanceof HTMLElement) {
      listClone.removeAttribute('style');
      listClone.removeAttribute('data-msb-mobile-scope-inset');
      if (listKind) listClone.setAttribute('data-msb-clone-list-kind', listKind);
    }
    nav.appendChild(listClone);
    return nav;
  }

  function buildUnifiedDrawerShellFromScrollWrap(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return null;

    // Build an explicit two-zone custom drawer:
    //   1) fixed top head: current course bar + sort dock, touching each other
    //   2) independent scrolling list: ONLY the current scoped nav list
    // The previous v3 cloned every direct child of scrollWrap.  On Material's
    // mobile drawer that can include both a broad nav subtree and the current
    // scoped list, so injected lecture leads such as "Lecture 12" could appear
    // twice.  Cloning runtime.scopeList avoids that entire class of bugs.
    const shell = document.createElement('div');
    shell.className = 'msb-unified-scrollwrap';
    shell.setAttribute('data-msb-unified-shell', '1');

    const head = document.createElement('div');
    head.className = 'msb-unified-head';

    const listScroll = document.createElement('div');
    listScroll.className = 'msb-unified-list-scroll';

    const scope = inferScope();
    const useGlobalDrawer = isGlobalDrawerScope(scope);
    let bar = null;
    let control = null;

    if (useGlobalDrawer) {
      shell.setAttribute('data-msb-global-drawer', '1');
      shell.setAttribute('data-msb-scope-kind', 'global');
      // Global/utility pages should open straight into the navigation cards.
      // Do not add a separate title header here.
    } else {
      bar = scrollWrap.querySelector(':scope > #current-course-bar') || scrollWrap.querySelector('#current-course-bar');
      control = scrollWrap.querySelector(':scope > #' + IDS.control) || scrollWrap.querySelector('#' + IDS.control);

      if (bar instanceof HTMLElement) head.appendChild(bar.cloneNode(true));
      if (control instanceof HTMLElement) head.appendChild(control.cloneNode(true));
    }

    const scopedNav = cloneScopedNavForUnifiedDrawer(scrollWrap);
    if (scopedNav instanceof HTMLElement) {
      listScroll.appendChild(scopedNav);
    } else {
      const inner = scrollWrap.querySelector('.md-sidebar__inner') || scrollWrap.querySelector('nav.md-nav');
      if (inner instanceof HTMLElement && inner !== bar && inner !== control) {
        listScroll.appendChild(inner.cloneNode(true));
      }
    }

    if (!useGlobalDrawer) shell.appendChild(head);
    shell.appendChild(listScroll);
    cleanupUnifiedClone(shell);
    return shell;
  }

  function unifiedCloneListScroller(clone) {
    if (!(clone instanceof HTMLElement)) return null;
    const scroller = clone.querySelector(':scope > .msb-unified-list-scroll');
    return scroller instanceof HTMLElement ? scroller : clone;
  }

  function ensureUnifiedFakeScrollbar(surface) {
    if (!(surface instanceof HTMLElement)) return null;
    let bar = surface.querySelector(':scope > .msb-unified-scrollbar');
    if (!(bar instanceof HTMLElement)) {
      bar = document.createElement('div');
      bar.className = 'msb-unified-scrollbar';
      bar.setAttribute('aria-hidden', 'true');
      const thumb = document.createElement('div');
      thumb.className = 'msb-unified-scrollbar-thumb';
      bar.appendChild(thumb);
      surface.appendChild(bar);
    }
    return bar;
  }

  function updateUnifiedFakeScrollbar(surface, metrics) {
    if (!(surface instanceof HTMLElement)) return false;
    const clone = surface.querySelector(':scope > .msb-unified-scrollwrap');
    if (!(clone instanceof HTMLElement)) return false;
    const scroller = unifiedCloneListScroller(clone);
    if (!(scroller instanceof HTMLElement)) return false;
    applyUnifiedListBottomPadding(clone, metrics);
    const bar = ensureUnifiedFakeScrollbar(surface);
    if (!(bar instanceof HTMLElement)) return false;

    let headH = 0;
    try {
      const head = clone.querySelector(':scope > .msb-unified-head');
      if (head instanceof HTMLElement) headH = Math.ceil(head.getBoundingClientRect().height || head.offsetHeight || 0);
    } catch (_) {}

    const visibleH = Math.max(80, Number(metrics && metrics.visibleHeight) || Number(window.innerHeight) || 0);
    const trackTop = Math.max(0, headH);
    const trackH = Math.max(48, visibleH - headH);
    const scrollH = Math.max(1, Number(scroller.scrollHeight) || 1);

    const realViewportH = Math.max(1, Number(scroller.clientHeight) || trackH);
    const maxScroll = Math.max(0, scrollH - realViewportH);
    const top = Math.max(0, Number(scroller.scrollTop) || 0);
    const needed = scrollH > realViewportH + 2 && trackH > 32;

    let thumbH = Math.round(trackH * (trackH / Math.max(trackH, scrollH)));
    thumbH = clamp(thumbH, 22, Math.max(22, trackH));
    const maxThumbY = Math.max(0, trackH - thumbH);
    const thumbY = maxScroll > 0 ? Math.round(maxThumbY * clamp(top / maxScroll, 0, 1)) : 0;

    try {
      surface.style.setProperty('--msb-custom-scrollbar-top', cssPx(trackTop));
      surface.style.setProperty('--msb-custom-scrollbar-height', cssPx(trackH));
      surface.style.setProperty('--msb-custom-scrollbar-thumb-height', cssPx(thumbH));
      surface.style.setProperty('--msb-custom-scrollbar-thumb-y', cssPx(thumbY));
      bar.classList.toggle('is-needed', !!needed);
    } catch (_) {}
    return true;
  }

  function flashUnifiedFakeScrollbar(surface) {
    if (!(surface instanceof HTMLElement)) return;
    try { surface.classList.add('is-scrolling'); } catch (_) {}
    try {
      if (unifiedDrawerState.scrollbarFadeTimer) window.clearTimeout(unifiedDrawerState.scrollbarFadeTimer);
      unifiedDrawerState.scrollbarFadeTimer = window.setTimeout(function () {
        unifiedDrawerState.scrollbarFadeTimer = 0;
        try { surface.classList.remove('is-scrolling'); } catch (_) {}
      }, 680);
    } catch (_) {}
  }


  function setGlobalYearOpenInClone(clone, yearSeg, open) {
    if (!(clone instanceof HTMLElement) || !yearSeg) return false;
    const safe = cssEscape(yearSeg);
    const lead = clone.querySelector('.msb-global-year[data-msb-global-year="' + safe + '"]');
    const rows = asArray(clone.querySelectorAll('.msb-global-course[data-msb-global-year-parent="' + safe + '"]'));
    if (!(lead instanceof HTMLElement) && !rows.length) return false;

    const nextOpen = !!open;
    if (lead instanceof HTMLElement) {
      lead.setAttribute('data-msb-global-year-open', nextOpen ? '1' : '0');
      const btn = lead.querySelector('.msb-global-year-toggle');
      if (btn instanceof HTMLElement) {
        btn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        const title = cleanTitle((lead.querySelector('.msb-global-link-title') || {}).textContent || '') || yearSeg;
        btn.setAttribute('aria-label', (nextOpen ? 'Collapse ' : 'Expand ') + title);
      }
    }

    rows.forEach(function (row) {
      if (!(row instanceof HTMLElement)) return;
      row.setAttribute('data-msb-global-year-open', nextOpen ? '1' : '0');
      row.hidden = !nextOpen;
      if (nextOpen && row.style) row.style.removeProperty('display');
    });

    writeGlobalYearOpen(yearSeg, nextOpen);
    return true;
  }

  function toggleGlobalYearInSurface(surface, yearSeg) {
    if (!(surface instanceof HTMLElement) || !yearSeg) return false;
    const clone = surface.querySelector(':scope > .msb-unified-scrollwrap');
    if (!(clone instanceof HTMLElement)) return false;
    const scroller = unifiedCloneListScroller(clone);
    const beforeTop = scroller instanceof HTMLElement ? (Number(scroller.scrollTop) || 0) : 0;
    const lead = clone.querySelector('.msb-global-year[data-msb-global-year="' + cssEscape(yearSeg) + '"]');
    const isOpen = lead instanceof HTMLElement && lead.getAttribute('data-msb-global-year-open') === '1';
    const ok = setGlobalYearOpenInClone(clone, yearSeg, !isOpen);
    if (!ok) return false;

    if (scroller instanceof HTMLElement) {
      try {
        const maxTop = Math.max(0, (Number(scroller.scrollHeight) || 0) - Math.max(1, Number(scroller.clientHeight) || 1));
        scroller.scrollTop = clamp(beforeTop, 0, maxTop);
        unifiedDrawerState.lastScrollTop = Number(scroller.scrollTop) || 0;
      } catch (_) {}
    }

    updateUnifiedFakeScrollbar(surface, unifiedDrawerMetrics());
    flashUnifiedFakeScrollbar(surface);
    return true;
  }

  function setUnifiedCloneLectureGroupOpen(surface, groupId, open) {
    if (!(surface instanceof HTMLElement) || !groupId) return false;
    const clone = surface.querySelector(':scope > .msb-unified-scrollwrap');
    if (!(clone instanceof HTMLElement)) return false;
    const scroller = unifiedCloneListScroller(clone);
    const beforeTop = scroller instanceof HTMLElement ? (Number(scroller.scrollTop) || 0) : 0;

    const rows = asArray(clone.querySelectorAll('.md-nav__item[' + ATTR.group + '="' + cssEscape(groupId) + '"]')).filter(function (row) {
      return row instanceof HTMLElement && row.getAttribute(ATTR.groupKind) === 'lecture';
    });
    if (!rows.length) return false;

    let lead = rows.find(function (row) { return row.classList && row.classList.contains(CLS.lead); }) || rows[0];
    if (!(lead instanceof HTMLElement)) return false;

    const labelNode = lead.querySelector(':scope > .' + CLS.head + ' .' + CLS.headText);
    const label = cleanTitle(labelNode ? labelNode.textContent : '') || lectureLabelFromGroupId(groupId);
    const nextOpen = !!open;

    rows.forEach(function (row) {
      if (!(row instanceof HTMLElement)) return;
      const isLead = row === lead;
      row.setAttribute(ATTR.groupOpen, nextOpen ? '1' : '0');
      row.removeAttribute(ATTR.groupCollapsedLead);

      if (isLead) {
        row.removeAttribute(ATTR.groupCollapsedItem);
        if (nextOpen) row.removeAttribute(ATTR.groupCollapsedLead);
        else row.setAttribute(ATTR.groupCollapsedLead, '1');
        row.hidden = false;
        if (row.style) row.style.removeProperty('display');
        updateGroupButtonUi(row, label, nextOpen);
        return;
      }

      if (nextOpen) {
        row.removeAttribute(ATTR.groupCollapsedItem);
        row.hidden = false;
        if (row.style) row.style.removeProperty('display');
      } else {
        row.setAttribute(ATTR.groupCollapsedItem, '1');
        row.hidden = true;
      }
    });

    try {
      if (lead && lead.parentElement) markGroupBoundaries(lead.parentElement);
    } catch (_) {}

    if (scroller instanceof HTMLElement) {
      try {
        const maxTop = Math.max(0, (Number(scroller.scrollHeight) || 0) - Math.max(1, Number(scroller.clientHeight) || 1));
        scroller.scrollTop = clamp(beforeTop, 0, maxTop);
        unifiedDrawerState.lastScrollTop = Number(scroller.scrollTop) || 0;
        const real = getScrollWrap();
        if (real instanceof HTMLElement) real.scrollTop = unifiedDrawerState.lastScrollTop;
      } catch (_) {}
    }

    updateUnifiedFakeScrollbar(surface, unifiedDrawerMetrics());
    flashUnifiedFakeScrollbar(surface);
    return true;
  }

  function scrollUnifiedCourseIndexToFirstLecture(clone) {
    if (!(clone instanceof HTMLElement)) return false;
    const scope = inferScope();
    if (!isCurrentCourseIndexPage(scope) || isCurrentCourseCollapsed(scope) || unifiedCloneUsesYearOverview(clone)) return false;
    const scroller = unifiedCloneListScroller(clone);
    if (!(scroller instanceof HTMLElement)) return false;
    applyUnifiedListBottomPadding(clone, unifiedDrawerMetrics());

    const target = firstCourseStartRowInRoot(scroller, scope);
    let nextTop = 0;
    if (target instanceof HTMLElement && scroller.contains(target)) {
      const targetTop = elementTopInScrollContent(target, scroller);
      const maxScroll = Math.max(0, (scroller.scrollHeight || 0) - Math.max(1, scroller.clientHeight || 1));
      nextTop = clamp(targetTop - courseIndexTopGapPx(), 0, maxScroll);
    }

    try {
      scroller.scrollTop = nextTop;
      unifiedDrawerState.lastScrollTop = nextTop;
      return true;
    } catch (_) {
      return false;
    }
  }

  function activeUnifiedCloneTarget(clone) {
    if (!(clone instanceof HTMLElement)) return null;
    const scopeRoot = unifiedCloneListScroller(clone) || clone;
    const rel = currentRelPath();
    if (rel) {
      const links = asArray(scopeRoot.querySelectorAll('a.md-nav__link[href], .md-nav__link[href]'));
      for (let i = 0; i < links.length; i += 1) {
        const a = links[i];
        const href = a && a.getAttribute ? a.getAttribute('href') : '';
        if (sameLogicalRel(normaliseHrefToRel(href), rel)) return a;
      }
      const rows = asArray(scopeRoot.querySelectorAll('.md-nav__item'));
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const direct = directNavLink(row);
        if (!direct) continue;
        if (sameLogicalRel(resolveItemRel(row, direct), rel)) return direct instanceof HTMLElement ? direct : row;
      }
    }
    const active =
      scopeRoot.querySelector('.md-nav__link[aria-current="page"]') ||
      scopeRoot.querySelector('a.md-nav__link--active') ||
      scopeRoot.querySelector('.md-nav__link--active');
    return active instanceof HTMLElement ? active : null;
  }

  function precenterUnifiedClone(clone, metrics) {
    if (!(clone instanceof HTMLElement)) return false;
    if (scrollUnifiedCourseIndexToFirstLecture(clone)) return true;
    const scroller = unifiedCloneListScroller(clone);
    if (!(scroller instanceof HTMLElement)) return false;
    if (unifiedCloneUsesYearOverview(clone)) {
      applyUnifiedListBottomPadding(clone, metrics);
      try {
        scroller.scrollTop = 0;
        unifiedDrawerState.lastScrollTop = 0;
        return true;
      } catch (_) {
        return false;
      }
    }
    const baselineBottomPad = applyUnifiedListBottomPadding(clone, metrics);
    const target = activeUnifiedCloneTarget(clone);
    if (!(target instanceof HTMLElement) || !scroller.contains(target)) return false;

    // The custom drawer has a separate fixed head.  Therefore the list scroller
    // centres the active concept inside its own visible area, with no sticky
    // subtraction and no copied native sidebar scrollTop.
    let headH = 0;
    try {
      const head = clone.querySelector(':scope > .msb-unified-head');
      if (head instanceof HTMLElement) headH = Math.ceil(head.getBoundingClientRect().height || head.offsetHeight || 0);
    } catch (_) {}
    // Centre inside the actually visible list viewport, not inside the extended
    // document-layer surface that continues behind Safari's bottom toolbar.
    // Using scroller.clientHeight here includes the hidden safe-area tail and
    // makes the active title sit noticeably too low.
    const visibleListH = Math.max(
      80,
      ((Number(metrics && metrics.visibleHeight) || Number(window.innerHeight) || 0) - headH) || 0
    );
    const hiddenTail = Math.max(0, (Number(scroller.clientHeight) || 0) - visibleListH);
    const usableH = visibleListH;
    try {
      // Keep only the baseline iOS toolbar compensation.  Earlier versions
      // added a large centring tail here, which made the drawer scroll past the
      // real last item into unnecessary blank space.
      const pad = baselineBottomPad;
      scroller.style.setProperty('--msb-unified-list-bottom-pad', cssPx(pad));
      scroller.style.boxSizing = 'border-box';
    } catch (_) {}

    const targetTop = elementTopInScrollContent(target, scroller);
    const targetH = Math.max(1, Math.ceil(target.getBoundingClientRect().height || target.offsetHeight || 1));
    const centerNudge = Math.max(8, Math.min(24, Math.round(usableH * 0.035)));
    const desiredTop = targetTop - ((usableH - targetH) / 2) + centerNudge;
    const maxScroll = Math.max(0, (scroller.scrollHeight || 0) - Math.max(80, Number(scroller.clientHeight) || usableH));
    const nextTop = clamp(desiredTop, 0, maxScroll);

    try {
      scroller.scrollTop = nextTop;
      unifiedDrawerState.lastScrollTop = nextTop;
      return true;
    } catch (_) {
      return false;
    }
  }

  function syncUnifiedCloneScroll(surface, scrollWrap) {
    if (!(surface instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return;
    const clone = surface.querySelector(':scope > .msb-unified-scrollwrap');
    if (!(clone instanceof HTMLElement)) return;
    const scroller = unifiedCloneListScroller(clone);
    if (!(scroller instanceof HTMLElement)) return;
    const top = Math.max(0, Number(scrollWrap.scrollTop) || 0);
    try { scroller.scrollTop = top; } catch (_) {}
    unifiedDrawerState.lastScrollTop = top;
  }

    function rebuildUnifiedDrawerClone(surface, scrollWrap, forceRebuild) {
    if (!(surface instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return null;
    const sig = unifiedDrawerSourceSignature(scrollWrap);
    let clone = surface.querySelector(':scope > .msb-unified-scrollwrap');
    const metrics = unifiedDrawerMetrics();

    if (!forceRebuild && clone instanceof HTMLElement && unifiedDrawerState.sig === sig) {
      if (!unifiedDrawerState.isOpen) precenterUnifiedClone(clone, metrics);
      updateUnifiedFakeScrollbar(surface, metrics);
      return clone;
    }

    try { surface.textContent = ''; } catch (_) {}
    clone = buildUnifiedDrawerShellFromScrollWrap(scrollWrap);
    if (!(clone instanceof HTMLElement)) return null;
    surface.appendChild(clone);
    unifiedDrawerState.sig = sig;

    // The visual clone has its own coordinate system, so centre the active row
    // inside the clone after it is attached and measurable.
    precenterUnifiedClone(clone, metrics);
    try {
      const scroller = unifiedCloneListScroller(clone);
      if (scroller instanceof HTMLElement) {
        scroller.addEventListener('scroll', function () {
          try {
            const real = getScrollWrap();
            if (real instanceof HTMLElement) real.scrollTop = scroller.scrollTop || 0;
            unifiedDrawerState.lastScrollTop = scroller.scrollTop || 0;
            updateUnifiedFakeScrollbar(surface, unifiedDrawerMetrics());
            flashUnifiedFakeScrollbar(surface);
          } catch (_) {}
        }, { passive: true });
      }
    } catch (_) {}

    updateUnifiedFakeScrollbar(surface, metrics);
    return clone;
  }


  function bindUnifiedDrawerTouchIsolation(surface) {
    if (!(surface instanceof HTMLElement) || unifiedDrawerState.touchBound) return;
    unifiedDrawerState.touchBound = true;

    const touchState = {
      scroller: null,
      startedInScroller: false,
      lastY: 0,
      startX: 0,
      startY: 0,
      moved: false
    };

    function currentSurfaceScroller(target) {
      const el = target instanceof Element ? target : null;
      const own = el && el.closest ? el.closest('.msb-unified-list-scroll') : null;
      if (own instanceof HTMLElement && surface.contains(own)) return own;
      const fallback = surface.querySelector('.msb-unified-list-scroll');
      return fallback instanceof HTMLElement ? fallback : null;
    }

    function maxScrollFor(scroller) {
      if (!(scroller instanceof HTMLElement)) return 0;
      return Math.max(0, (Number(scroller.scrollHeight) || 0) - Math.max(1, Number(scroller.clientHeight) || 1));
    }

    surface.addEventListener('touchstart', function (event) {
      if (!surface.classList.contains('is-open')) return;
      const t = event.touches && event.touches[0];
      if (!t) return;
      const targetEl = event.target instanceof Element ? event.target : null;
      touchState.startedInScroller = !!(targetEl && targetEl.closest && targetEl.closest('.msb-unified-list-scroll'));
      touchState.scroller = currentSurfaceScroller(event.target);
      touchState.lastY = Number(t.clientY) || 0;
      touchState.startY = touchState.lastY;
      touchState.startX = Number(t.clientX) || 0;
      touchState.moved = false;
    }, { passive: true, capture: true });

    surface.addEventListener('touchmove', function (event) {
      if (!surface.classList.contains('is-open')) return;
      const t = event.touches && event.touches[0];
      if (!t) return;

      const y = Number(t.clientY) || 0;
      const x = Number(t.clientX) || 0;
      const dx = Math.abs(x - (touchState.startX || x));
      const dyFromStart = Math.abs(y - (touchState.startY || y));
      const delta = (touchState.lastY || y) - y;
      touchState.lastY = y;

      if (!touchState.moved && Math.max(dx, dyFromStart) < 3) return;
      touchState.moved = true;

      const scroller = touchState.scroller instanceof HTMLElement ? touchState.scroller : currentSurfaceScroller(event.target);
      if (!(scroller instanceof HTMLElement)) return;

      // Let the real list scroller handle normal vertical movement.  That keeps
      // iOS' native momentum / rubber-band feel.  Only cancel gestures that
      // would escape the list at its top or bottom; those are the cases that
      // otherwise drag the page behind the drawer.
      const maxTop = maxScrollFor(scroller);
      const top = Number(scroller.scrollTop) || 0;
      const atTop = top <= 1;
      const atBottom = top >= maxTop - 1;
      const wantsPastTop = delta < 0 && atTop;
      const wantsPastBottom = delta > 0 && atBottom;

      try { event.stopPropagation(); } catch (_) {}

      if (!touchState.startedInScroller || wantsPastTop || wantsPastBottom || maxTop <= 0) {
        if (event.cancelable) {
          try { event.preventDefault(); } catch (_) {}
        }
        return;
      }

      unifiedDrawerState.lastScrollTop = top;
      updateUnifiedFakeScrollbar(surface, unifiedDrawerMetrics());
      flashUnifiedFakeScrollbar(surface);
    }, { passive: false, capture: true });

    const reset = function () {
      touchState.scroller = null;
      touchState.startedInScroller = false;
      touchState.moved = false;
    };
    surface.addEventListener('touchend', reset, { passive: true, capture: true });
    surface.addEventListener('touchcancel', reset, { passive: true, capture: true });
  }

  function bindUnifiedDrawerSurfaceEvents(surface) {
    if (!(surface instanceof HTMLElement)) return;
    bindUnifiedDrawerTouchIsolation(surface);
    if (unifiedDrawerState.bound) return;
    unifiedDrawerState.bound = true;

    surface.addEventListener('click', function (event) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const globalYearBtn = target.closest && target.closest('.msb-global-year-toggle');
      if (globalYearBtn) {
        event.preventDefault();
        event.stopPropagation();
        const row = globalYearBtn.closest ? globalYearBtn.closest('.msb-global-year[data-msb-global-year]') : null;
        const yearSeg = row && row.getAttribute ? (row.getAttribute('data-msb-global-year') || '') : '';
        toggleGlobalYearInSurface(surface, yearSeg);
        return;
      }

      const sortBtn = target.closest && target.closest('#mk-sidebar-sortdock .' + CLS.dockButton + ', #' + IDS.control + ' .' + CLS.dockButton);
      if (sortBtn) {
        event.preventDefault();
        event.stopPropagation();
        const real = getScrollWrap();
        const realBtn = real && real.querySelector ? real.querySelector('#' + IDS.control + ' .' + CLS.dockButton) : null;
        if (realBtn instanceof HTMLElement) realBtn.click();
        window.setTimeout(function () { syncUnifiedCustomDrawerSurface(true, true); }, 90);
        return;
      }

      const courseTrigger = target.closest && target.closest('#current-course-bar .ccb-course-trigger');
      if (courseTrigger) {
        event.preventDefault();
        event.stopPropagation();

        const bar = courseTrigger.closest ? courseTrigger.closest('#current-course-bar') : null;
        if (bar instanceof HTMLElement) {
          const wasOpen = bar.dataset.courseMenuOpen === '1';
          const titleNode = bar.querySelector('.ccb-title');
          const title = cleanTitle(titleNode ? titleNode.textContent : '') || 'Select a course';

          // The mobile drawer uses a cloned header.  Native onclick handlers are
          // not a reliable contract on cloned Material drawer content, so toggle
          // the picker from the drawer's delegated click layer as well.  Re-sync
          // before opening so the options are fresh after instant navigation.
          try { syncCurrentCoursePicker(bar, inferScope(), title); } catch (_) {}
          closeCoursePickerMenus(bar);
          setCoursePickerOpen(bar, !wasOpen);
        }
        return;
      }

      const currentToggle = target.closest && target.closest('#current-course-bar .ccb-toggle');
      if (currentToggle) {
        event.preventDefault();
        event.stopPropagation();
        try { toggleCurrentCourse(); } catch (_) {}
        window.setTimeout(function () { syncUnifiedCustomDrawerSurface(true, true); }, 90);
        return;
      }

      const groupBtn = target.closest && target.closest('.' + CLS.headBtn + '[data-group-id]');
      const groupHead = !groupBtn && target.closest ? target.closest('.' + CLS.head) : null;
      if (groupBtn || groupHead) {
        const row = (groupBtn || groupHead).closest ? (groupBtn || groupHead).closest('.md-nav__item[' + ATTR.group + ']') : null;
        const gid = (groupBtn && groupBtn.getAttribute('data-group-id')) || (row && row.getAttribute(ATTR.group)) || '';
        const isLecture = !!(row && row.getAttribute(ATTR.groupKind) === 'lecture');
        if (!gid || !isLecture) return;
        event.preventDefault();
        event.stopPropagation();
        const real = getScrollWrap();
        const realBtn = real && gid ? real.querySelector('.' + CLS.headBtn + '[data-group-id="' + cssEscape(gid) + '"]') : null;
        let nextOpen = false;
        if (realBtn instanceof HTMLElement) {
          const wasOpen = realBtn.getAttribute('aria-expanded') === 'true';
          realBtn.click();
          nextOpen = realBtn.getAttribute('aria-expanded') === 'true';
          if (nextOpen === wasOpen) nextOpen = !wasOpen;
        } else {
          const wasOpen = row ? row.getAttribute(ATTR.groupOpen) === '1' : false;
          try { toggleLectureGroup(inferScope(), gid); } catch (_) {}
          nextOpen = !wasOpen;
        }

        // Do not rebuild the whole mobile drawer after a lecture toggle.  A full
        // rebuild re-runs the opening pre-centering logic and can snap the list
        // back to the top.  Update the cloned rows in place, exactly like the PC
        // sidebar does: the drawer viewport keeps its height, the selected
        // lecture's items are hidden/shown, and following lectures naturally move.
        setUnifiedCloneLectureGroupOpen(surface, gid, nextOpen);
        window.setTimeout(function () {
          setUnifiedCloneLectureGroupOpen(surface, gid, nextOpen);
        }, 40);
      }
    }, true);
  }

  function syncUnifiedCustomDrawerSurface(open, forceRebuild, options) {
    cancelUnifiedDrawerHideTimer();
    if (open) cancelUnifiedDrawerPostClosePrime();
    const surface = unifiedDrawerSurfaceNode();
    const scrollWrap = getScrollWrap();
    if (!(surface instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return false;
    bindUnifiedDrawerSurfaceEvents(surface);

    const opts = options && typeof options === 'object' ? options : {};
    const wasOpen = !!(unifiedDrawerState.isOpen || surface.classList.contains('is-open'));
    const openingFromClosed = !!open && !wasOpen;
    const passiveClosedSetup = !open && !opts.animateClose;

    // Any non-animated preparation pass leaves the custom drawer in a closed,
    // measurable state before the checkbox change paints.
    if (openingFromClosed || passiveClosedSetup) {
      surface.classList.add('is-setup');
      surface.classList.remove('is-open', 'is-closing');
    }

    const metrics = unifiedDrawerMetrics();
    try {
      surface.style.setProperty('--msb-custom-open-left', cssPx(metrics.openLeft));
      surface.style.setProperty('--msb-custom-closed-shift', cssPx(metrics.closedShift));
      surface.style.setProperty('--msb-custom-top', cssPx(metrics.topDoc));
      surface.style.setProperty('--msb-custom-width', cssPx(metrics.width));
      surface.style.setProperty('--msb-custom-height', cssPx(metrics.height));
      surface.style.setProperty('--msb-custom-visible-height', cssPx(metrics.visibleHeight));
      surface.classList.toggle('is-no-motion', !unifiedDrawerMotionEnabled());
    } catch (_) {}

    updateMobileDrawerBackdropBlur(metrics);

    surface.classList.add('is-ready');

    let clone = null;
    const existingClone = surface.querySelector(':scope > .msb-unified-scrollwrap');
    const reuseWarmClosedClone = existingClone instanceof HTMLElement && !forceRebuild && (openingFromClosed || passiveClosedSetup);

    if (reuseWarmClosedClone) {
      // Do not replace the clone during the tap/open path.  Replacing it here
      // clears the content layer for a frame, so the drawer shell slides first
      // and the nav text/cards pop in halfway through.  Closed/background prime
      // passes are responsible for rebuilding; opening only moves the already
      // warm clone.
      clone = existingClone;
      if (!wasOpen) precenterUnifiedClone(clone, metrics);
      forceUnifiedDrawerContentPrepaint(surface);
      updateUnifiedFakeScrollbar(surface, metrics);
    } else {
      clone = rebuildUnifiedDrawerClone(surface, scrollWrap, !!forceRebuild);
      if (clone instanceof HTMLElement && (!wasOpen || !!forceRebuild)) {
        precenterUnifiedClone(clone, metrics);
      }
      updateUnifiedFakeScrollbar(surface, metrics);
    }

    if (!(clone instanceof HTMLElement)) {
      surface.classList.remove('is-open', 'is-closing', 'is-setup');
      surface.classList.remove('is-ready');
      html().classList.remove('msb-unified-mobile-drawer-visible');
      hideMobileDrawerBackdropBlur();
      unifiedDrawerState.isOpen = false;
      return false;
    }

    if (open) {
      if (unifiedDrawerState.hideTimer) {
        try { window.clearTimeout(unifiedDrawerState.hideTimer); } catch (_) {}
        unifiedDrawerState.hideTimer = 0;
      }
      html().classList.add('msb-unified-mobile-drawer-visible');
      surface.classList.remove('is-closing');

      if (openingFromClosed) {
        // Flush the closed state first, then enable the transition and add is-open.
        try { void surface.offsetWidth; } catch (_) {}
        surface.classList.remove('is-setup');
        try { void surface.offsetWidth; } catch (_) {}
      } else {
        surface.classList.remove('is-setup');
      }

      surface.classList.add('is-open');
      unifiedDrawerState.isOpen = true;
      return true;
    }

    if (opts.animateClose) {
      surface.classList.remove('is-setup');
      surface.classList.add('is-closing');
      html().classList.add('msb-unified-mobile-drawer-visible');
      try { void surface.offsetWidth; } catch (_) {}
      surface.classList.remove('is-open');
    } else {
      surface.classList.remove('is-open', 'is-closing');
      surface.classList.add('is-setup');
      try { void surface.offsetWidth; } catch (_) {}
    }

    unifiedDrawerState.isOpen = false;
    return true;
  }

  function isUnifiedCustomDrawerClosing() {
    const surface = document.getElementById('mk-mobile-unified-sidebar-surface');
    return !!(surface instanceof HTMLElement && surface.classList.contains('is-closing') && unifiedDrawerState.hideTimer);
  }

  function closeUnifiedCustomDrawerSurface() {
    const surface = document.getElementById('mk-mobile-unified-sidebar-surface');
    if (!(surface instanceof HTMLElement)) {
      hideUnifiedCustomDrawerSurface();
      return false;
    }

    cancelUnifiedDrawerHideTimer();

    if (!surface.classList.contains('is-ready')) {
      hideUnifiedCustomDrawerSurface();
      return false;
    }

    html().classList.add('msb-unified-mobile-drawer-visible');
    surface.classList.add('is-ready');
    surface.classList.remove('is-setup');
    surface.classList.add('is-closing');
    try { void surface.offsetWidth; } catch (_) {}
    surface.classList.remove('is-open');
    unifiedDrawerState.isOpen = false;
    unifiedDrawerState.preopenUntil = 0;

    unifiedDrawerState.hideTimer = window.setTimeout(function () {
      unifiedDrawerState.hideTimer = 0;
      try {
        surface.classList.remove('is-closing', 'is-open', 'is-scrolling');
        surface.classList.add('is-ready', 'is-setup');
        html().classList.remove('msb-unified-mobile-drawer-visible');
        hideMobileDrawerBackdropBlur();
      } catch (_) {}

      // After the slide-out has completely finished, immediately restore the
      // closed off-screen geometry and force the cloned content layer to lay out
      // and paint again.  Otherwise iOS Safari can keep only the drawer shell
      // warm after one open/close cycle and rasterize the nav content halfway
      // through the next slide-in.
      resetUnifiedClosedSurfaceGeometryAndPrewarm(false);
      scheduleUnifiedDrawerPostClosePrime(false);
    }, unifiedDrawerMotionEnabled() ? 1030 : 0);

    return true;
  }

  function prepareUnifiedCustomDrawerSurface(forceRebuild) {
    if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return false;
    unifiedDrawerState.preopenUntil = Date.now() + 1200;
    cancelUnifiedDrawerHideTimer();

    const ok = syncUnifiedCustomDrawerSurface(false, !!forceRebuild);
    const surface = unifiedDrawerSurfaceNode();
    if (surface instanceof HTMLElement) {
      surface.classList.remove('is-open');
      html().classList.remove('msb-unified-mobile-drawer-visible');
      try { void surface.offsetWidth; } catch (_) {}
    }
    return ok;
  }

  function hideUnifiedCustomDrawerSurface() {
    syncMobileDrawerGateClass();
    const surface = document.getElementById('mk-mobile-unified-sidebar-surface');
    html().classList.remove('msb-unified-mobile-drawer-visible');
    hideMobileDrawerBackdropBlur();
    unifiedDrawerState.preopenUntil = 0;
    unifiedDrawerState.isOpen = false;
    cancelUnifiedDrawerHideTimer();
    if (!(surface instanceof HTMLElement)) return;
    // Keep the prebuilt content and the is-ready display state. The surface is
    // already translated off-screen while closed. Clearing the clone after
    // close forces the next open to paint an empty drawer first, then rebuild
    // content during the slide-in.
    surface.classList.remove('is-open', 'is-closing', 'is-scrolling');
    surface.classList.add('is-ready', 'is-setup');
    scheduleUnifiedDrawerPostClosePrime(false);
  }


  function scheduleUnifiedDrawerColdPrime(forceRebuild) {
    if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return;
    if (unifiedDrawerState.coldPrimeTimer) {
      try { window.clearTimeout(unifiedDrawerState.coldPrimeTimer); } catch (_) {}
      unifiedDrawerState.coldPrimeTimer = 0;
    }
    if (unifiedDrawerState.coldPrimeRaf) {
      try { window.cancelAnimationFrame(unifiedDrawerState.coldPrimeRaf); } catch (_) {}
      unifiedDrawerState.coldPrimeRaf = 0;
    }

    const pageKey = runtime.currentPageKey || currentRelPath();
    unifiedDrawerState.coldPrimeTimer = window.setTimeout(function () {
      unifiedDrawerState.coldPrimeTimer = 0;
      unifiedDrawerState.coldPrimeRaf = window.requestAnimationFrame(function () {
        unifiedDrawerState.coldPrimeRaf = 0;
        if (!USE_UNIFIED_MOBILE_DRAWER_SURFACE || !isMobileViewport()) return;
        if ((runtime.currentPageKey || currentRelPath()) !== pageKey) return;
        if (isDrawerOpen() || isUnifiedCustomDrawerClosing()) return;

        // Prime the full visual drawer while it is completely off-screen. This
        // is not a content-readiness gate: it does not hide the native drawer
        // and it does not decide whether the custom drawer is allowed to open.
        // It only makes the content layer exist before the user taps the
        // hamburger, so the first visible frame contains both the panel and the
        // cloned nav instead of painting the nav halfway through the slide.
        syncUnifiedCustomDrawerSurface(false, !!forceRebuild, { coldPrime: true });
        unifiedDrawerState.preopenUntil = 0;
        html().classList.remove('msb-unified-mobile-drawer-visible');

        const surface = document.getElementById('mk-mobile-unified-sidebar-surface');
        if (surface instanceof HTMLElement) {
          surface.classList.add('is-ready');
          surface.classList.remove('is-open', 'is-closing', 'is-scrolling');
          // Keep the closed transform committed and force a layout+paint read so
          // Safari has a rasterized child layer before the opening transition.
          try { void surface.offsetWidth; } catch (_) {}
          try {
            const child = surface.querySelector(':scope > .msb-unified-scrollwrap');
            if (child instanceof HTMLElement) void child.offsetHeight;
          } catch (_) {}
        }
      });
    }, 90);
  }
  function ghostSourceList(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return null;
    const list = (runtime.scopeList instanceof HTMLElement && runtime.scopeList.isConnected)
      ? runtime.scopeList
      : null;
    if (list && scrollWrap.contains(list)) return list;

    const candidates = asArray(scrollWrap.querySelectorAll('.md-nav__list'));
    let best = null;
    let bestScore = -Infinity;
    candidates.forEach(function (el) {
      if (!(el instanceof HTMLElement)) return;
      const rows = asArray(el.children).filter(function (child) {
        return isElement(child) && child.matches && child.matches('.md-nav__item');
      }).length;
      if (rows > bestScore) {
        best = el;
        bestScore = rows;
      }
    });
    return best instanceof HTMLElement ? best : null;
  }

  function cloneScrollwrapForGhostFloor(ghostFloor, scrollWrap) {
    if (!(ghostFloor instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return null;

    const sourceSig = [
      'viewport',
      String(scrollWrap.children ? scrollWrap.children.length : 0),
      String(scrollWrap.scrollHeight || 0),
      String(scrollWrap.clientHeight || 0),
      String(runtime.currentPageKey || currentRelPath() || '')
    ].join('|');

    let inner = ghostFloor.querySelector(':scope > .msb-ghost-scrollwrap');
    if (inner instanceof HTMLElement && ghostFloor.getAttribute('data-msb-ghost-sig') === sourceSig) {
      return inner;
    }

    try { ghostFloor.textContent = ''; } catch (_) {}

    const clone = scrollWrap.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return null;
    clone.classList.add('msb-ghost-scrollwrap');
    clone.setAttribute('aria-hidden', 'true');

    // Keep IDs in the visual clone. Several layout rules in this project are
    // ID-scoped (#current-course-bar, #mk-sidebar-sortdock). Removing those IDs
    // changes the normal-flow heights, which is what made the bottom strip jump
    // from Lecture 6 to Lecture 12 and shrink the text. The clone is appended
    // after the real drawer and has pointer-events:none, so the original IDs
    // remain the ones used by normal document queries and interaction.
    try {
      clone.removeAttribute('data-msb-touch-scrolling');
      clone.removeAttribute('data-msb-touch-cooldown');
      clone.querySelectorAll('[data-msb-touch-scrolling],[data-msb-touch-cooldown]').forEach(function (el) {
        try {
          el.removeAttribute('data-msb-touch-scrolling');
          el.removeAttribute('data-msb-touch-cooldown');
        } catch (_) {}
      });
    } catch (_) {}

    ghostFloor.appendChild(clone);
    ghostFloor.setAttribute('data-msb-ghost-sig', sourceSig);
    return clone;
  }

  function ghostElementPath(root, el) {
    if (!(root instanceof HTMLElement) || !(el instanceof HTMLElement) || !root.contains(el)) return null;
    const path = [];
    let cur = el;
    while (cur && cur !== root) {
      const parent = cur.parentElement;
      if (!parent) return null;
      const kids = asArray(parent.children);
      const idx = kids.indexOf(cur);
      if (idx < 0) return null;
      path.push(idx);
      cur = parent;
    }
    return path.reverse();
  }

  function ghostElementFromPath(root, path) {
    if (!(root instanceof HTMLElement) || !Array.isArray(path)) return null;
    let cur = root;
    for (const idx of path) {
      if (!cur || !cur.children || idx < 0 || idx >= cur.children.length) return null;
      cur = cur.children[idx];
    }
    return cur instanceof HTMLElement ? cur : null;
  }

  function ghostAnchorCandidates(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return [];
    const sel = [
      '.md-nav__item[data-msb-group-kind]',
      '.msb-group-head',
      '.md-nav__item',
      '.md-nav__link'
    ].join(',');
    return asArray(scrollWrap.querySelectorAll(sel)).filter(function (el) {
      if (!(el instanceof HTMLElement)) return false;
      if (el.closest && el.closest('#current-course-bar, #mk-sidebar-sortdock')) return false;
      try {
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      } catch (_) {}
      let r = null;
      try { r = el.getBoundingClientRect(); } catch (_) { r = null; }
      return !!(r && r.height > 3 && r.width > 8);
    });
  }

  function chooseGhostAnchor(scrollWrap, seamY) {
    const seam = Number(seamY) || 0;
    let best = null;
    let bestScore = -Infinity;
    const candidates = ghostAnchorCandidates(scrollWrap);
    candidates.forEach(function (el) {
      let r = null;
      try { r = el.getBoundingClientRect(); } catch (_) { r = null; }
      if (!r) return;
      // Prefer the element that crosses the seam or ends closest above it.
      // This anchors the clone to the real rendered content rather than to the
      // scrollwrap's outer box, which is shifted by sticky course/sort controls.
      let score = -Math.abs((r.bottom || 0) - seam);
      if (r.top <= seam && r.bottom >= seam) score += 100000;
      else if (r.bottom <= seam) score += 50000;
      if (el.matches && el.matches('.md-nav__item[data-msb-group-kind]')) score += 1000;
      if (el.matches && el.matches('.msb-group-head')) score += 600;
      if (score > bestScore) {
        best = el;
        bestScore = score;
      }
    });
    return best;
  }

  function alignGhostByRenderedAnchor(scrollWrap, inner, baseTopPx, seamY) {
    if (!(scrollWrap instanceof HTMLElement) || !(inner instanceof HTMLElement)) return baseTopPx;
    const anchor = chooseGhostAnchor(scrollWrap, seamY);
    if (!(anchor instanceof HTMLElement)) return baseTopPx;
    const path = ghostElementPath(scrollWrap, anchor);
    const cloneAnchor = ghostElementFromPath(inner, path);
    if (!(cloneAnchor instanceof HTMLElement)) return baseTopPx;

    let realRect = null;
    let cloneRect = null;
    try {
      realRect = anchor.getBoundingClientRect();
      cloneRect = cloneAnchor.getBoundingClientRect();
    } catch (_) {
      realRect = cloneRect = null;
    }
    if (!realRect || !cloneRect) return baseTopPx;

    const realY = Math.round(realRect.top || 0);
    const cloneY = Math.round(cloneRect.top || 0);
    const delta = realY - cloneY;
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) return baseTopPx;

    // Keep the correction bounded. A valid correction is normally the height of
    // the sticky/sort/inset band. If the clone is temporarily unstable during a
    // scroll bounce, falling back to the base calculation is safer than applying
    // a huge jump.
    const maxCorrection = Math.max(40, Math.min(260, Math.round((window.innerHeight || 700) * 0.32)));
    if (Math.abs(delta) > maxCorrection) return baseTopPx;
    return Math.round(baseTopPx + delta);
  }

  function stableGhostLayoutKey(scrollWrap, ghostFloor, seamY, visibleAbove, ghostHeight) {
    return [
      String(runtime.currentPageKey || currentRelPath() || ''),
      String(Math.round(Number(seamY) || 0)),
      String(Math.round(Number(visibleAbove) || 0)),
      String(Math.round(Number(ghostHeight) || 0)),
      String(Math.round(Number(scrollWrap && scrollWrap.clientHeight) || 0)),
      String(Math.round(Number(scrollWrap && scrollWrap.scrollHeight) || 0)),
      String(ghostFloor && ghostFloor.getAttribute ? (ghostFloor.getAttribute('data-msb-ghost-sig') || '') : '')
    ].join('|');
  }

  function computeGhostAnchorCorrection(scrollWrap, inner, baseTopPx, seamY) {
    if (!(scrollWrap instanceof HTMLElement) || !(inner instanceof HTMLElement)) return 0;
    try { inner.style.top = Math.round(baseTopPx) + 'px'; } catch (_) {}

    const anchor = chooseGhostAnchor(scrollWrap, seamY);
    if (!(anchor instanceof HTMLElement)) return 0;
    const path = ghostElementPath(scrollWrap, anchor);
    const cloneAnchor = ghostElementFromPath(inner, path);
    if (!(cloneAnchor instanceof HTMLElement)) return 0;

    let realRect = null;
    let cloneRect = null;
    try {
      realRect = anchor.getBoundingClientRect();
      cloneRect = cloneAnchor.getBoundingClientRect();
    } catch (_) {
      realRect = cloneRect = null;
    }
    if (!realRect || !cloneRect) return 0;

    const delta = Math.round((realRect.top || 0) - (cloneRect.top || 0));
    if (!Number.isFinite(delta) || Math.abs(delta) < 1) return 0;

    const maxCorrection = Math.max(48, Math.min(240, Math.round((window.innerHeight || 700) * 0.28)));
    if (Math.abs(delta) > maxCorrection) return 0;
    return delta;
  }

  function syncDrawerGhostFloorScrollOnly() {
    try {
      const ghostFloor = document.getElementById('mk-sidebar-drawer-ghost-floor');
      if (!(ghostFloor instanceof HTMLElement)) return false;
      if (ghostFloor.style.display === 'none') return false;
      const inner = ghostFloor.querySelector(':scope > .msb-ghost-scrollwrap');
      const scrollWrap = getScrollWrap();
      if (!(inner instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return false;
      const top = Math.max(0, Number(scrollWrap.scrollTop) || 0);
      if (Math.abs(top - Number(ghostFloorState.lastScrollTop || 0)) < 0.5) return true;
      ghostFloorState.lastScrollTop = top;
      inner.scrollTop = top;
      return true;
    } catch (_) {
      return false;
    }
  }

  function scheduleGhostFloorScrollOnly() {
    if (ghostFloorState.raf) return;
    ghostFloorState.raf = requestAnimationFrame(function () {
      ghostFloorState.raf = 0;
      syncDrawerGhostFloorScrollOnly();
    });
  }

  function syncDrawerGhostFloorContent(ghostFloor, scrollWrap, seamY, forceRecalc) {
    if (!(ghostFloor instanceof HTMLElement) || !(scrollWrap instanceof HTMLElement)) return false;

    const inner = cloneScrollwrapForGhostFloor(ghostFloor, scrollWrap);
    if (!(inner instanceof HTMLElement)) return false;

    let wrapRect = null;
    let ghostRect = null;
    try {
      wrapRect = scrollWrap.getBoundingClientRect();
      ghostRect = ghostFloor.getBoundingClientRect();
    } catch (_) {
      wrapRect = ghostRect = null;
    }
    if (!wrapRect || !ghostRect) return false;

    const seam = Number(seamY) || ghostRect.top || wrapRect.bottom || 0;
    const visibleAbove = Math.max(0, seam - wrapRect.top);
    const ghostHeight = Math.max(1, Number(ghostRect.height) || 1);
    const viewportHeight = Math.max(1, visibleAbove + ghostHeight + 8);

    try {
      const innerLeft = (wrapRect.left || 0) - (ghostRect.left || 0);
      const innerWidth = Math.max(1, Number(wrapRect.width) || ((wrapRect.right || 0) - (wrapRect.left || 0)) || Number(ghostRect.width) || 0);
      const top = Math.max(0, Number(scrollWrap.scrollTop) || 0);
      const finalTop = -visibleAbove;
      const layoutKey = stableGhostLayoutKey(scrollWrap, ghostFloor, seam, visibleAbove, ghostHeight);

      inner.style.left = cssPx(innerLeft);
      inner.style.width = cssPx(innerWidth);
      inner.style.height = cssPx(viewportHeight);
      inner.style.bottom = 'auto';
      inner.style.right = 'auto';
      inner.style.overflow = 'hidden';
      inner.style.pointerEvents = 'none';
      inner.scrollTop = top;
      ghostFloorState.lastScrollTop = top;
      ghostFloorState.layoutKey = layoutKey;
      ghostFloorState.correction = 0;

      inner.style.top = cssPx(finalTop);
      ghostFloor.style.visibility = 'visible';

      ghostFloor.style.setProperty('--msb-ghost-inner-left', cssPx(innerLeft));
      ghostFloor.style.setProperty('--msb-ghost-inner-width', cssPx(innerWidth));
      ghostFloor.style.setProperty('--msb-ghost-viewport-top', cssPx(finalTop));
      ghostFloor.style.setProperty('--msb-ghost-viewport-height', cssPx(viewportHeight));
    } catch (_) {}
    return true;
  }

  function readSafeAreaBottomInsetPx() {
    const nodes = ensureDrawerGapPatchNodes();
    const probe = nodes.probe;
    if (!(probe instanceof HTMLElement)) return 0;
    let value = Math.ceil(probe.getBoundingClientRect().height || 0);
    if (value > 0) return value;
    try {
      value = Math.ceil(parseFloat(window.getComputedStyle(probe).paddingBottom || '0') || 0);
    } catch (_) {
      value = 0;
    }
    return Math.max(0, value);
  }

  function visualViewportMetrics() {
    const vv = window.visualViewport;
    if (vv) {
      const left = Number(vv.offsetLeft) || 0;
      const top = Number(vv.offsetTop) || 0;
      const width = Number(vv.width) || window.innerWidth || 0;
      const height = Number(vv.height) || window.innerHeight || 0;
      const right = left + width;
      const bottom = top + height;
      const layoutBottomGap = Math.max(0, Math.round((window.innerHeight || 0) - bottom));
      return { left, top, width, height, right, bottom, layoutBottomGap };
    }
    return {
      left: 0,
      top: 0,
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
      right: window.innerWidth || 0,
      bottom: window.innerHeight || 0,
      layoutBottomGap: 0
    };
  }

  function syncDrawerGapPatches(forceRecalc) {
    syncMobileDrawerGateClass();
    const nodes = ensureDrawerGapPatchNodes();
    const topPatch = nodes.top;
    const bottomPatch = nodes.bottom;
    const ghostFloor = nodes.ghost;
    if (!(topPatch instanceof HTMLElement) || !(bottomPatch instanceof HTMLElement) || !(ghostFloor instanceof HTMLElement)) return;
    try { ghostFloor.classList.add('md-sidebar--primary', 'mk-sidebar-ghost-host'); } catch (_) {}

    if (USE_UNIFIED_MOBILE_DRAWER_SURFACE && isMobileViewport()) {
      hideDrawerGapPatch(topPatch);
      hideDrawerGapPatch(bottomPatch);
      hideDrawerGhostFloor(ghostFloor);
      if (isDrawerOpen()) {
        syncUnifiedCustomDrawerSurface(true, !!forceRecalc);
      } else if (Date.now() < (unifiedDrawerState.preopenUntil || 0)) {
        syncUnifiedCustomDrawerSurface(false, !!forceRecalc);
      } else if (isUnifiedCustomDrawerClosing()) {
        // Keep the custom surface visible until its own 1000ms slide-out ends.
      } else {
        hideUnifiedCustomDrawerSurface();
      }
      return;
    }

    if (!isMobileViewport() || !isDrawerOpen()) {
      hideDrawerGapPatch(topPatch);
      hideDrawerGapPatch(bottomPatch);
      hideDrawerGhostFloor(ghostFloor);
      hideUnifiedCustomDrawerSurface();
      return;
    }

    const sidebar = getPrimarySidebar();
    const bar = document.getElementById('current-course-bar');
    if (!(sidebar instanceof HTMLElement) || !(bar instanceof HTMLElement)) {
      hideDrawerGapPatch(topPatch);
      hideDrawerGapPatch(bottomPatch);
      hideDrawerGhostFloor(ghostFloor);
      return;
    }

    const vv = visualViewportMetrics();
    const sidebarRect = sidebar.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();

    const topLeft = Math.max(0, Math.floor(Math.max(sidebarRect.right, barRect.right) - 1));
    const topTop = Math.max(0, Math.floor(barRect.top));
    const topWidth = Math.max(0, Math.ceil(vv.right - topLeft));
    const topHeight = Math.max(0, Math.ceil(barRect.height || (barRect.bottom - barRect.top) || 0));
    if (topWidth > 1 && topHeight > 1 && barRect.bottom > vv.top && barRect.top < vv.bottom) {
      topPatch.style.display = 'block';
      topPatch.style.left = `${topLeft}px`;
      topPatch.style.top = `${topTop}px`;
      topPatch.style.width = `${topWidth}px`;
      topPatch.style.height = `${topHeight}px`;
      topPatch.style.bottom = 'auto';
    } else {
      hideDrawerGapPatch(topPatch);
    }

    const safeStrip = Math.max(readSafeAreaBottomInsetPx(), vv.layoutBottomGap);
    // Only the document-layer ghost floor should paint the bottom continuation.
    // Keeping the old fixed bottom patch active creates a second, independent seam.
    hideDrawerGapPatch(bottomPatch);

    // Document-layer ghost continuation.  This is intentionally not fixed:
    // iOS Safari's bottom bar samples ordinary page content more reliably than
    // fixed drawer/overlay layers.  The element is placed in document coordinates
    // just below the visible sidebar.  Unlike the earlier white-only floor, this
    // version also clones the real sidebar scroll content and translates it so
    // the visible part is the natural continuation below the current drawer.
    const layoutBottom = Math.max(window.innerHeight || 0, vv.bottom || 0) + Math.max(0, safeStrip);
    const scrollWrap = getScrollWrap();
    const wrapRect = scrollWrap instanceof HTMLElement ? scrollWrap.getBoundingClientRect() : null;

    // The safe-area continuation must be measured from the real scrollwrap, not
    // from the outer sidebar drawer. The outer drawer and the inner scrollwrap
    // can differ by a few pixels on iOS, and that is exactly what made the
    // bottom strip start from an already-visible Lecture block.
    const panelRect = sidebarRect || wrapRect;
    // The floor background must use the same panel box as the real drawer.
    // The cloned list is then offset inside that box with --msb-ghost-inner-left,
    // so both the outer grey field and the inner card margins line up.
    const ghostLeft = panelRect ? Math.floor(panelRect.left || 0) : 0;
    const ghostRight = panelRect ? Math.ceil(panelRect.right || (ghostLeft + panelRect.width) || 0) : ghostLeft;
    const ghostWidth = Math.max(0, ghostRight - ghostLeft);
    // Overlap the artificial seam by a couple of pixels to hide the mobile
    // viewport edge / scrollwrap shadow, without changing the real nav scroll.
    const seamOverlap = 0.75;
    const rawSeam = wrapRect ? (wrapRect.bottom - seamOverlap) : (sidebarRect.bottom - seamOverlap);
    const ghostTopViewport = clamp(rawSeam, 0, Math.max(0, layoutBottom));
    const ghostHeight = Math.max(0, (layoutBottom - ghostTopViewport) + 220);
    if (ghostWidth > 1 && ghostHeight > 0 && scrollWrap instanceof HTMLElement && wrapRect) {
      ghostFloor.style.display = 'block';
      ghostFloor.style.left = cssPx(pageScrollXNow() + ghostLeft);
      ghostFloor.style.top = cssPx(pageScrollYNow() + ghostTopViewport);
      ghostFloor.style.width = cssPx(ghostWidth);
      ghostFloor.style.height = cssPx(ghostHeight);
      ghostFloor.style.bottom = 'auto';

      if (!syncDrawerGhostFloorContent(ghostFloor, scrollWrap, ghostTopViewport, !!forceRecalc)) {
        hideDrawerGhostFloor(ghostFloor);
      }
    } else {
      hideDrawerGhostFloor(ghostFloor);
    }
  }

  function scheduleDrawerGapPatchSync(forceRecalc) {
    requestAnimationFrame(function () {
      syncDrawerGapPatches(!!forceRecalc);
      requestAnimationFrame(function () {
        syncDrawerGapPatches(false);
      });
    });
  }

  const drawerGapAnimation = { raf: 0, until: 0 };

  // Smooth safe-area ghost state. A full layout pass is expensive because it
  // reads real + cloned element rects. Do it only when the drawer/layout changes;
  // during finger and momentum scroll we only mirror scrollTop into the clone.
  const ghostFloorState = {
    layoutKey: "",
    correction: 0,
    raf: 0,
    lastScrollTop: -1
  };

  function runDrawerGapPatchAnimationFrames(durationMs) {
    const duration = Math.max(120, Number(durationMs) || 420);
    drawerGapAnimation.until = Date.now() + duration;
    if (drawerGapAnimation.raf) {
      try { cancelAnimationFrame(drawerGapAnimation.raf); } catch (_) {}
      drawerGapAnimation.raf = 0;
    }

    function tick() {
      drawerGapAnimation.raf = 0;
      syncDrawerGapPatches(false);
      if (Date.now() < drawerGapAnimation.until && isMobileViewport() && isDrawerOpen()) {
        drawerGapAnimation.raf = requestAnimationFrame(tick);
      }
    }

    drawerGapAnimation.raf = requestAnimationFrame(tick);
  }

  function bindGhostFloorScrollSync(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return;
    if (scrollWrap.dataset.msbGhostFloorBound === '1') return;
    scrollWrap.dataset.msbGhostFloorBound = '1';
    scrollWrap.addEventListener('scroll', function () {
      scheduleGhostFloorScrollOnly();
    }, { passive: true });
  }

  const centering = {
    pageKey: "",
    userCancelled: false,
    centered: false,
    retryTimers: [],
    boundWrap: null,
    programmaticUntil: 0,

    bindWrap: function (scrollWrap) {
      if (!scrollWrap || this.boundWrap === scrollWrap) return;
      this.boundWrap = scrollWrap;
      const self = this;
      function markUser() {
        if (Date.now() < self.programmaticUntil) return;
        if (self.centered) self.userCancelled = true;
      }
      scrollWrap.addEventListener("wheel", markUser, { passive: true });
      scrollWrap.addEventListener("touchmove", markUser, { passive: true });
      scrollWrap.addEventListener("scroll", markUser, { passive: true });
      scrollWrap.addEventListener("keydown", markUser);
    },

    resetForPage: function (pageKey) {
      if (this.pageKey === pageKey) return;
      this.pageKey = pageKey;
      this.userCancelled = false;
      this.centered = false;
      if (this.retryTimers && this.retryTimers.length) {
        this.retryTimers.forEach(function (timer) { window.clearTimeout(timer); });
        this.retryTimers = [];
      }
    },

    computeStickyTop: function (scrollWrap) {
      if (!scrollWrap) return 0;
      let sum = 0;
      const wrapRect = scrollWrap.getBoundingClientRect();
      const children = asArray(scrollWrap.children);
      for (let i = 0; i < children.length; i += 1) {
        const el = children[i];
        if (!isElement(el)) continue;
        const cs = window.getComputedStyle(el);
        if (cs.position !== "sticky") continue;
        const top = parseFloat(cs.top || "0") || 0;
        if (top > 1) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= wrapRect.top) continue;
        if (rect.top > wrapRect.top + 4) continue;
        sum += rect.height || el.offsetHeight || 0;
      }
      return sum;
    },

    activeTarget: function () {
      const scrollWrap = getScrollWrap();
      if (!scrollWrap) return null;
      const rel = currentRelPath();
      const localRoot = runtime.scopeList && runtime.scopeList.isConnected ? runtime.scopeList : scrollWrap;
      const rows = asArray(localRoot.querySelectorAll(':scope > .md-nav__item, .md-nav__item'));

      function visibleTarget(row) {
        if (!(row instanceof HTMLElement)) return row;
        const collapsedScope = row.closest('.md-nav__item--nested[' + ATTR.scopeCollapsed + '="1"]');
        if (collapsedScope) return collapsedScope;
        if (!row.hidden && row.getAttribute(ATTR.groupCollapsedItem) !== "1") return row;
        const groupId = row.getAttribute(ATTR.group) || "";
        if (!groupId) return row;
        const lead = scrollWrap.querySelector('.md-nav__item.' + CLS.lead + '[' + ATTR.group + '="' + cssEscape(groupId) + '"]');
        return lead || row;
      }

      if (rel) {
        for (let i = 0; i < rows.length; i += 1) {
          const row = rows[i];
          const direct = directNavLink(row);
          if (!direct) continue;
          if (!sameLogicalRel(resolveItemRel(row, direct), rel)) continue;
          return visibleTarget(row);
        }
      }

      const active =
        localRoot.querySelector('.md-nav__link[aria-current="page"]') ||
        localRoot.querySelector('a.md-nav__link--active') ||
        localRoot.querySelector('.md-nav__link--active') ||
        scrollWrap.querySelector('.md-nav__link[aria-current="page"]') ||
        scrollWrap.querySelector('a.md-nav__link--active') ||
        scrollWrap.querySelector('.md-nav__link--active');
      if (!active) return null;
      const row = active.closest('.md-nav__item') || active;
      return visibleTarget(row);
    },

    isTargetNearCenter: function () {
      const scrollWrap = getScrollWrap();
      const target = this.activeTarget();
      if (!scrollWrap || !target) return false;
      const wrapRect = scrollWrap.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      let visibleTop;
      let visibleBottom;
      if (isMobileViewport()) {
        const vv = visualViewportMetrics();
        visibleTop = Math.max(0, mobileHeaderVisualBottom());
        visibleBottom = Math.max(window.innerHeight || 0, vv.bottom || 0);
      } else {
        const stickyTop = this.computeStickyTop(scrollWrap);
        visibleTop = wrapRect.top + stickyTop;
        visibleBottom = wrapRect.bottom;
      }
      const visibleHeight = Math.max(1, visibleBottom - visibleTop);
      const targetCenter = targetRect.top + (targetRect.height / 2);
      const desiredCenter = visibleTop + (visibleHeight / 2);
      const tolerance = Math.max(24, Math.min(90, visibleHeight * 0.12));
      return Math.abs(targetCenter - desiredCenter) <= tolerance;
    },

    centerOnce: function (force, opts) {
      if (isMobileViewport() && !MOBILE_AUTO_CENTERING) return false;
      const scrollWrap = getScrollWrap();
      const currentScope = inferScope();

      // Desktop Year pages are top-aligned during the initial render path.
      // Do not run active-row centring here; that delayed centring can push
      // Block 1A underneath the sticky Year title / Sort dock on first load.
      if (isDesktopYearScope(currentScope)) return false;

      if (isCurrentCourseIndexPage(currentScope)) {
        return alignNativeCourseIndexToFirstLecture(scrollWrap, !!force);
      }
      const target = this.activeTarget();
      if (!scrollWrap || !target) return false;
      this.bindWrap(scrollWrap);
      if (this.userCancelled) return false;
      if (!force && this.centered) return false;
      const options = opts && typeof opts === "object" ? opts : {};
      if (!isDrawerOpen() && !options.allowClosed) return false;

      const wrapRect = scrollWrap.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const wrapHeight = scrollWrap.clientHeight || wrapRect.height || 0;
      if (!wrapHeight || wrapHeight < 50 || !targetRect.height) return false;

      const stickyTop = this.computeStickyTop(scrollWrap);
      const targetTopInContent = scrollWrap.scrollTop + (targetRect.top - wrapRect.top);
      let desiredTop;

      if (isMobileViewport()) {
        const vv = visualViewportMetrics();
        const visibleTop = Math.max(0, mobileHeaderVisualBottom());
        const visibleBottom = Math.max(window.innerHeight || 0, vv.bottom || 0);
        const visibleHeight = Math.max(40, visibleBottom - visibleTop);
        const desiredCenterY = visibleTop + (visibleHeight / 2);
        const desiredTargetTopInViewport = desiredCenterY - (targetRect.height / 2);
        desiredTop = targetTopInContent - (desiredTargetTopInViewport - wrapRect.top);
      } else {
        const visibleHeight = Math.max(40, wrapHeight - stickyTop);
        desiredTop = targetTopInContent - stickyTop - ((visibleHeight - targetRect.height) / 2);
      }

      const maxScroll = Math.max(0, scrollWrap.scrollHeight - scrollWrap.clientHeight);
      const minScroll = computeMobileScopeMinScrollTop(scrollWrap);
      const nextTop = clamp(desiredTop, minScroll, maxScroll);

      this.programmaticUntil = Date.now() + 220;
      try {
        scrollWrap.scrollTop = nextTop;
      } catch (_) {
        try {
          scrollWrap.scrollTo(0, nextTop);
        } catch (__) {
          return false;
        }
      }
      syncDrawerGhostFloorScrollOnly();
      this.centered = true;
      return true;
    },

    scheduleForPage: function (pageKey, force) {
      this.resetForPage(pageKey);
      if (isMobileViewport()) {
        if (!MOBILE_AUTO_CENTERING) return;
        if (!isDrawerOpen()) return;
      }
      const self = this;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          self.centerOnce(!!force);
        });
      });
      if (this.retryTimers && this.retryTimers.length) {
        this.retryTimers.forEach(function (timer) { window.clearTimeout(timer); });
      }
      const retryPlan = [280, 500, 820, 1200, 1700];
      this.retryTimers = retryPlan.map(function (delay) {
        return window.setTimeout(function () {
          if (self.userCancelled) return;
          if (!force && self.centered && self.isTargetNearCenter()) return;
          if (self.centerOnce(true)) {
            // Success – cancel remaining retries.
            self.retryTimers.forEach(function (t) { window.clearTimeout(t); });
            self.retryTimers = [];
          }
        }, delay);
      });
    }
  };

  function measuredCurrentCourseBarHeight(bar) {
    if (!(bar instanceof HTMLElement)) return 0;
    let h = Math.ceil(bar.getBoundingClientRect().height || bar.offsetHeight || 0);
    if (h > 2) return h;

    const row = bar.querySelector(".ccb-row");
    if (row instanceof HTMLElement) {
      const rowH = Math.ceil(row.getBoundingClientRect().height || row.offsetHeight || 0);
      if (rowH > 2) {
        try {
          const cs = window.getComputedStyle(bar);
          const pt = parseFloat(cs.paddingTop || "0") || 0;
          const pb = parseFloat(cs.paddingBottom || "0") || 0;
          h = Math.ceil(rowH + pt + pb);
          if (h > 2) return h;
        } catch (_) {
          return rowH;
        }
      }
    }

    return isMobileViewport() ? 44 : 0;
  }

  function mobileHeaderVisualBottom() {
    if (!isMobileViewport()) return 0;
    let bottom = 0;
    const nodes = asArray(document.querySelectorAll(".md-header, .md-tabs"));
    nodes.forEach(function (el) {
      if (!(el instanceof HTMLElement)) return;
      const rect = el.getBoundingClientRect();
      if (!rect || rect.height <= 0 || rect.bottom <= 0) return;
      if (rect.top > window.innerHeight * 0.55) return;
      bottom = Math.max(bottom, rect.bottom);
    });
    return Math.max(0, Math.ceil(bottom));
  }

  function alignMobileSortDock(scrollWrap, bar, control) {
    if (!(control instanceof HTMLElement)) return;
    control.style.setProperty("--msb-sortdock-shift", "0px");

    if (!isMobileViewport() || !isDrawerOpen()) return;
    if (!(scrollWrap instanceof HTMLElement) || !(bar instanceof HTMLElement)) return;

    const barHeight = measuredCurrentCourseBarHeight(bar);
    const barRect = bar.getBoundingClientRect();
    const controlRect = control.getBoundingClientRect();
    const wrapRect = scrollWrap.getBoundingClientRect();
    if (!controlRect || controlRect.height <= 0) return;

    const drawerTop = wrapRect && wrapRect.height > 0 ? Math.max(0, wrapRect.top) : 0;
    const headerBottom = mobileHeaderVisualBottom();
    const courseBottom = barRect && barRect.height > 0 ? barRect.bottom : 0;
    const seamOverlap = 6;
    const desiredTop = Math.ceil(Math.max(courseBottom, drawerTop + barHeight, headerBottom + barHeight) - seamOverlap);
    const shift = Math.ceil(desiredTop - controlRect.top);

    if (shift > 1) {
      const cap = Math.max(160, Math.min(560, Math.floor(window.innerHeight * 0.7)));
      control.style.setProperty("--msb-sortdock-shift", String(clamp(shift, 0, cap)) + "px");
    }
  }

  function desktopFirstScrollableContent(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return null;
    const selectors = [
      ".md-nav__item." + CLS.first + "[" + ATTR.groupKind + "]",
      ".md-nav__item." + CLS.single + "[" + ATTR.groupKind + "]",
      ".md-nav__item[" + ATTR.groupKind + "]",
      ".msb-group-head",
      ".md-nav__list > .md-nav__item:not([" + ATTR.injected + "])"
    ];
    for (let i = 0; i < selectors.length; i += 1) {
      const nodes = asArray(scrollWrap.querySelectorAll(selectors[i]));
      for (let j = 0; j < nodes.length; j += 1) {
        const el = nodes[j];
        if (!(el instanceof HTMLElement)) continue;
        if (el.hidden || el.getAttribute('data-msb-drill-hidden') === '1') continue;
        const rect = el.getBoundingClientRect();
        if (rect && rect.height > 2 && rect.width > 2) return el;
      }
    }
    return null;
  }

  function desktopScrollbarArrowOffset() {
    const root = runtime.desktopScrollbar.root;
    if (root instanceof HTMLElement) {
      try {
        const raw = window.getComputedStyle(root).getPropertyValue('--msb-desktop-scrollbar-arrow-h');
        const n = parseFloat(raw);
        if (Number.isFinite(n) && n >= 0) return n;
      } catch (_) {}
    }
    return 16;
  }

  function desktopScrollbarWidth(root) {
    if (root instanceof HTMLElement) {
      try {
        const cs = window.getComputedStyle(root);
        const raw = cs.getPropertyValue('--msb-desktop-scrollbar-width') || cs.width;
        const n = parseFloat(raw);
        if (Number.isFinite(n) && n > 0) return n;
      } catch (_) {}
      try {
        const rect = root.getBoundingClientRect();
        if (rect && rect.width > 0) return rect.width;
      } catch (_) {}
    }
    return 9;
  }

  function desktopScrollbarBottomLimit() {
    const viewportBottom = Math.max(0, Math.floor(window.innerHeight || document.documentElement.clientHeight || 0));
    let limit = viewportBottom;
    let footerInViewport = false;

    try {
      const scrollEl = document.scrollingElement || document.documentElement;
      const pageBottom = Math.ceil((scrollEl.scrollHeight || document.documentElement.scrollHeight || 0) - (window.scrollY || window.pageYOffset || 0));
      if (pageBottom > 0) limit = Math.min(limit, pageBottom);
    } catch (_) {}

    try {
      asArray(document.querySelectorAll('.md-footer, footer')).forEach(function (footer) {
        if (!(footer instanceof HTMLElement)) return;
        const rect = footer.getBoundingClientRect();
        if (!rect || rect.height <= 0) return;
        if (rect.bottom <= 0 || rect.top >= viewportBottom) return;
        footerInViewport = true;
        limit = Math.min(limit, Math.ceil(rect.top));
      });
    } catch (_) {}

    return Math.max(0, limit);
  }

  function ensureDesktopScrollbar(host) {
    const st = runtime.desktopScrollbar;
    const mount = document.body || document.documentElement || host;
    if (st.root && st.root.isConnected) {
      if (mount instanceof HTMLElement && st.root.parentNode !== mount) mount.appendChild(st.root);
      return st.root;
    }

    const root = document.createElement('div');
    root.id = 'msb-desktop-scrollbar';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<div class="msb-desktop-scrollbar__track"></div><div class="msb-desktop-scrollbar__thumb"></div>';
    (mount instanceof HTMLElement ? mount : (document.body || document.documentElement)).appendChild(root);

    st.root = root;
    st.thumb = root.querySelector('.msb-desktop-scrollbar__thumb');

    if (!st.bound) {
      st.bound = true;
      root.addEventListener('pointerdown', function (event) {
        const scrollWrap = st.scrollWrap;
        if (!(scrollWrap instanceof HTMLElement)) return;
        const track = root.getBoundingClientRect();
        if (!track || track.height <= 0) return;
        const arrowOffset = desktopScrollbarArrowOffset();
        const usableH = Math.max(24, track.height - arrowOffset * 2);
        const thumb = st.thumb instanceof HTMLElement ? st.thumb : null;
        const thumbRect = thumb ? thumb.getBoundingClientRect() : null;
        const maxScroll = Math.max(1, scrollWrap.scrollHeight - scrollWrap.clientHeight);
        const thumbH = thumbRect && thumbRect.height > 0 ? thumbRect.height : Math.max(24, usableH * scrollWrap.clientHeight / Math.max(scrollWrap.scrollHeight, 1));
        const movable = Math.max(1, usableH - thumbH);

        event.preventDefault();
        event.stopPropagation();

        if (thumb && event.target === thumb) {
          st.dragging = true;
          st.dragStartY = Number(event.clientY) || 0;
          st.dragStartScrollTop = scrollWrap.scrollTop;
          root.classList.add('is-dragging');
          try { root.setPointerCapture(event.pointerId); } catch (_) {}
          return;
        }

        const y = clamp((Number(event.clientY) || 0) - track.top - arrowOffset - thumbH / 2, 0, movable);
        scrollWrap.scrollTop = (y / movable) * maxScroll;
        scheduleDesktopScrollbarUpdate();
      }, { passive: false });

      root.addEventListener('pointermove', function (event) {
        if (!st.dragging) return;
        const scrollWrap = st.scrollWrap;
        if (!(scrollWrap instanceof HTMLElement)) return;
        const track = root.getBoundingClientRect();
        if (!track || track.height <= 0) return;
        const arrowOffset = desktopScrollbarArrowOffset();
        const usableH = Math.max(24, track.height - arrowOffset * 2);
        const thumb = st.thumb instanceof HTMLElement ? st.thumb : null;
        const thumbRect = thumb ? thumb.getBoundingClientRect() : null;
        const thumbH = thumbRect && thumbRect.height > 0 ? thumbRect.height : Math.max(24, usableH * scrollWrap.clientHeight / Math.max(scrollWrap.scrollHeight, 1));
        const movable = Math.max(1, usableH - thumbH);
        const maxScroll = Math.max(1, scrollWrap.scrollHeight - scrollWrap.clientHeight);
        const dy = (Number(event.clientY) || 0) - st.dragStartY;
        scrollWrap.scrollTop = clamp(st.dragStartScrollTop + dy / movable * maxScroll, 0, maxScroll);
        scheduleDesktopScrollbarUpdate();
      }, { passive: true });

      function endDrag(event) {
        if (!st.dragging) return;
        st.dragging = false;
        root.classList.remove('is-dragging');
        try { root.releasePointerCapture(event.pointerId); } catch (_) {}
      }
      root.addEventListener('pointerup', endDrag, { passive: true });
      root.addEventListener('pointercancel', endDrag, { passive: true });

      root.addEventListener('wheel', function (event) {
        const scrollWrap = st.scrollWrap;
        if (!(scrollWrap instanceof HTMLElement)) return;
        const maxScroll = Math.max(0, scrollWrap.scrollHeight - scrollWrap.clientHeight);
        if (maxScroll <= 0) return;

        let dy = Number(event.deltaY) || 0;
        if (event.deltaMode === 1) dy *= 32;
        else if (event.deltaMode === 2) dy *= Math.max(1, scrollWrap.clientHeight);
        if (!dy) return;

        event.preventDefault();
        event.stopPropagation();
        scrollWrap.scrollTop = clamp(scrollWrap.scrollTop + dy, 0, maxScroll);
        scheduleDesktopScrollbarUpdate();
      }, { passive: false });
    }

    return root;
  }

  function hideDesktopScrollbar() {
    const st = runtime.desktopScrollbar;
    if (st.root) st.root.classList.remove('is-visible', 'is-dragging');
    st.dragging = false;
  }

  function updateDesktopScrollbar() {
    const scrollWrap = getScrollWrap();
    if (!(scrollWrap instanceof HTMLElement) || isMobileViewport()) {
      hideDesktopScrollbar();
      return;
    }

    const sidebar = getPrimarySidebar();
    if (!(sidebar instanceof HTMLElement)) {
      hideDesktopScrollbar();
      return;
    }

    const maxScroll = Math.max(0, scrollWrap.scrollHeight - scrollWrap.clientHeight);
    if (maxScroll <= 2) {
      hideDesktopScrollbar();
      return;
    }

    const control = scrollWrap.querySelector('#' + IDS.control);
    if (!(control instanceof HTMLElement)) {
      hideDesktopScrollbar();
      return;
    }

    const root = ensureDesktopScrollbar(control);
    const thumb = runtime.desktopScrollbar.thumb;
    runtime.desktopScrollbar.scrollWrap = scrollWrap;

    const wrapRect = scrollWrap.getBoundingClientRect();
    const controlRect = control.getBoundingClientRect();
    if (!wrapRect || !controlRect || controlRect.height <= 0) {
      hideDesktopScrollbar();
      return;
    }

    /*
     * v88: keep both constraints at the same time.
     * - The bar is mounted on document.body and position:fixed, so it cannot be
     *   clipped by the sticky Sort by dock or by the sidebar scroll container.
     * - Its top is set directly to the Sort by divider line. Since the element
     *   is fixed, normal page scrolling cannot drag it away and then snap it
     *   back.
     * - Its bottom is limited by the visible viewport, the real page bottom,
     *   and the footer top when the footer enters the viewport, so the lower
     *   endpoint arrow remains visible and stops above the footer.
     */
    const topViewport = Math.ceil(controlRect.bottom);
    const bottomViewport = desktopScrollbarBottomLimit();
    const height = Math.floor(bottomViewport - topViewport);
    if (height < 52) {
      hideDesktopScrollbar();
      return;
    }

    const barW = desktopScrollbarWidth(root);
    const left = Math.round(wrapRect.right - barW);

    root.style.left = String(left) + 'px';
    root.style.setProperty('--msb-desktop-scrollbar-top', String(topViewport) + 'px');
    root.style.height = String(height) + 'px';

    const arrowOffset = desktopScrollbarArrowOffset();
    const usableH = Math.max(24, height - arrowOffset * 2);
    const thumbH = clamp(Math.round(usableH * scrollWrap.clientHeight / Math.max(scrollWrap.scrollHeight, 1)), 24, usableH);
    const movable = Math.max(0, usableH - thumbH);
    const thumbY = arrowOffset + (maxScroll > 0 ? Math.round(movable * scrollWrap.scrollTop / maxScroll) : 0);

    if (thumb instanceof HTMLElement) {
      thumb.style.height = String(thumbH) + 'px';
      thumb.style.setProperty('--msb-desktop-scrollbar-thumb-y', String(thumbY) + 'px');
    }

    root.classList.add('is-visible');
  }

  function scheduleDesktopScrollbarUpdate() {
    const st = runtime.desktopScrollbar;
    if (st.raf) return;
    st.raf = requestAnimationFrame(function () {
      st.raf = 0;
      updateDesktopScrollbar();
    });
  }

  function bindDesktopScrollbarSync(scrollWrap) {
    if (!(scrollWrap instanceof HTMLElement)) return;
    if (!runtime.desktopScrollbar.windowBound) {
      runtime.desktopScrollbar.windowBound = true;
      window.addEventListener('scroll', scheduleDesktopScrollbarUpdate, { passive: true, capture: true });
    }
    if (scrollWrap.dataset.msbDesktopScrollbarBound === '1') return;
    scrollWrap.dataset.msbDesktopScrollbarBound = '1';
    scrollWrap.addEventListener('scroll', scheduleDesktopScrollbarUpdate, { passive: true });
    window.addEventListener('resize', scheduleDesktopScrollbarUpdate, { passive: true });
    if (window.visualViewport) {
      try { window.visualViewport.addEventListener('resize', scheduleDesktopScrollbarUpdate, { passive: true }); } catch (_) {}
      try { window.visualViewport.addEventListener('scroll', scheduleDesktopScrollbarUpdate, { passive: true }); } catch (_) {}
    }
  }

  function updateStickyMetrics() {
    const scrollWrap = getScrollWrap();
    if (!scrollWrap) {
      hideDesktopScrollbar();
      return;
    }
    bindDesktopScrollbarSync(scrollWrap);
    const bar = scrollWrap.querySelector("#current-course-bar");
    const control = scrollWrap.querySelector("#" + IDS.control);
    const barHeight = bar ? measuredCurrentCourseBarHeight(bar) : 0;
    const controlHeight = control ? Math.max(0, Math.ceil(control.getBoundingClientRect().height || control.offsetHeight || 0)) : 0;
    scrollWrap.style.setProperty("--msb-current-bar-h", String(barHeight) + "px");
    scrollWrap.style.setProperty("--mk-sidebar-sortdock-h", String(controlHeight) + "px");
    if (bar) bar.style.top = "0px";
    if (control) {
      const dockTop = isMobileViewport() ? Math.max(44, barHeight - 6) : Math.max(0, barHeight - 2);
      control.style.top = String(dockTop) + "px";
      alignMobileSortDock(scrollWrap, bar, control);
      if (isMobileViewport()) {
        requestAnimationFrame(function () {
          alignMobileSortDock(scrollWrap, bar, control);
          requestAnimationFrame(function () {
            alignMobileSortDock(scrollWrap, bar, control);
            applyMobileScopeInset();
          });
        });
      }
    }
    scheduleDesktopScrollbarUpdate();
  }

  function clearMobileScopeInset(scrollWrap) {
    const wrap = scrollWrap || getScrollWrap();
    if (!wrap) return;
    asArray(wrap.querySelectorAll('.md-nav__list[data-msb-mobile-scope-inset="1"]')).forEach(function (list) {
      if (!(list instanceof HTMLElement)) return;
      list.style.removeProperty('padding-top');
      list.style.removeProperty('margin-bottom');
      list.style.removeProperty('box-sizing');
      list.removeAttribute('data-msb-mobile-scope-inset');
    });
  }

  function firstVisibleScopeItem(list) {
    if (!list) return null;
    const rows = asArray(list.children).filter(function (li) {
      return isElement(li) && !li.hidden && li.getAttribute(ATTR.groupCollapsedItem) !== "1";
    });
    return rows.length ? rows[0] : null;
  }

  function mobileScopeStickyBottom(scrollWrap) {
    const wrap = scrollWrap || getScrollWrap();
    if (!wrap) return 0;
    const wrapRect = wrap.getBoundingClientRect();
    if (!(wrapRect && wrapRect.height > 40)) return 0;

    const stickyNodes = [
      wrap.querySelector('#current-course-bar'),
      wrap.querySelector('#' + IDS.control)
    ].filter(function (el) {
      return el instanceof HTMLElement;
    });

    let stickyBottom = wrapRect.top;
    stickyNodes.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (!rect || rect.bottom <= wrapRect.top || rect.top >= wrapRect.bottom) return;
      stickyBottom = Math.max(stickyBottom, rect.bottom);
    });
    return Math.max(0, stickyBottom - wrapRect.top);
  }

  function nativeCourseIndexStickyTop(scrollWrap) {
    const wrap = scrollWrap || getScrollWrap();
    if (!(wrap instanceof HTMLElement)) return 0;
    const wrapRect = wrap.getBoundingClientRect();
    if (!(wrapRect && wrapRect.height > 40)) return 0;

    const stickyNodes = [
      wrap.querySelector('#current-course-bar'),
      wrap.querySelector('#' + IDS.control)
    ].filter(function (el) {
      return el instanceof HTMLElement;
    });

    let stickyBottom = wrapRect.top;
    stickyNodes.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (!rect || rect.bottom <= wrapRect.top || rect.top >= wrapRect.bottom) return;
      stickyBottom = Math.max(stickyBottom, rect.bottom);
    });
    return Math.max(0, stickyBottom - wrapRect.top);
  }

  function alignNativeCourseIndexToFirstLecture(scrollWrap, force) {
    const wrap = scrollWrap || getScrollWrap();
    const scope = inferScope();
    if (!(wrap instanceof HTMLElement) || !isCurrentCourseIndexPage(scope)) return false;
    const list = runtime.scopeList;
    if (!(list instanceof HTMLElement) || !list.isConnected) return false;
    const target = firstCourseStartRowInList(list, scope);
    if (!(target instanceof HTMLElement)) return false;

    if (isMobileViewport() && !isDrawerOpen()) return false;

    const targetTop = elementTopInScrollContent(target, wrap);
    const stickyTop = nativeCourseIndexStickyTop(wrap);
    const desiredTop = Math.max(0, targetTop - stickyTop - courseIndexTopGapPx());
    const maxScroll = Math.max(0, (wrap.scrollHeight || 0) - Math.max(1, wrap.clientHeight || 1));
    const nextTop = clamp(desiredTop, 0, maxScroll);
    if (!force && Math.abs((Number(wrap.scrollTop) || 0) - nextTop) < 1) return false;

    try {
      wrap.scrollTop = nextTop;
      syncDrawerGhostFloorScrollOnly();
      return true;
    } catch (_) {
      try {
        wrap.scrollTo(0, nextTop);
        syncDrawerGhostFloorScrollOnly();
        return true;
      } catch (__) {
        return false;
      }
    }
  }

  function scheduleCourseIndexFirstLectureTop(force) {
    const scope = inferScope();
    if (!isCurrentCourseIndexPage(scope)) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        alignNativeCourseIndexToFirstLecture(getScrollWrap(), !!force);
        try {
          const surface = document.getElementById('mk-mobile-unified-sidebar-surface');
          const clone = surface instanceof HTMLElement ? surface.querySelector(':scope > .msb-unified-scrollwrap') : null;
          if (clone instanceof HTMLElement) {
            scrollUnifiedCourseIndexToFirstLecture(clone);
            updateUnifiedFakeScrollbar(surface, unifiedDrawerMetrics());
          }
        } catch (_) {}
      });
    });
  }

  function computeMobileScopeMinScrollTop(scrollWrap) {
    const wrap = scrollWrap || getScrollWrap();
    if (!wrap) return 0;
    if (!isMobileViewport() || !isDrawerOpen()) return 0;

    const list = runtime.scopeList;
    if (!(list instanceof HTMLElement) || !list.isConnected) return 0;

    const first = firstVisibleScopeItem(list);
    if (!(first instanceof HTMLElement)) return 0;

    const wrapRect = wrap.getBoundingClientRect();
    const firstRect = first.getBoundingClientRect();
    if (!(wrapRect && wrapRect.height > 40 && firstRect && firstRect.height >= 0)) return 0;

    const firstTopInContent = (wrap.scrollTop || 0) + (firstRect.top - wrapRect.top);
    const desiredTop = mobileScopeStickyBottom(wrap) + 2;
    const maxScroll = Math.max(0, (wrap.scrollHeight || 0) - (wrap.clientHeight || 0));
    return clamp(firstTopInContent - desiredTop, 0, maxScroll);
  }

  function enforceMobileScopeFloor(scrollWrap, force) {
    const wrap = scrollWrap || getScrollWrap();
    if (!wrap) return false;
    const minTop = computeMobileScopeMinScrollTop(wrap);
    if (!(minTop > 0)) return false;
    const currentTop = wrap.scrollTop || 0;
    if (!force && currentTop >= minTop - 1) return false;
    try {
      wrap.scrollTop = minTop;
    } catch (_) {
      try { wrap.scrollTo(0, minTop); } catch (__) { return false; }
    }
    syncDrawerGhostFloorScrollOnly();
    return true;
  }

  function applyMobileScopeInset() {
    const scrollWrap = getScrollWrap();
    if (!scrollWrap) return;

    clearMobileScopeInset(scrollWrap);

    if (!isMobileViewport() || !isDrawerOpen()) return;

    const list = runtime.scopeList;
    if (!(list instanceof HTMLElement) || !list.isConnected) return;

    const first = firstVisibleScopeItem(list);
    if (!(first instanceof HTMLElement)) return;

    const wrapRect = scrollWrap.getBoundingClientRect();
    if (!(wrapRect && wrapRect.height > 40)) return;

    const stickyNodes = [
      scrollWrap.querySelector('#current-course-bar'),
      scrollWrap.querySelector('#' + IDS.control)
    ].filter(function (el) {
      return el instanceof HTMLElement;
    });

    let stickyBottom = wrapRect.top;
    stickyNodes.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (!rect || rect.bottom <= wrapRect.top || rect.top >= wrapRect.bottom) return;
      stickyBottom = Math.max(stickyBottom, rect.bottom);
    });

    const firstRect = first.getBoundingClientRect();
    const needed = Math.ceil((stickyBottom + 2) - firstRect.top);
    if (!(needed > 0)) return;

    const inset = clamp(needed, 0, 160);
    list.style.boxSizing = 'border-box';
    list.style.paddingTop = String(inset) + 'px';
    list.style.marginBottom = String(-inset) + 'px';
    list.setAttribute('data-msb-mobile-scope-inset', '1');
  }

  function scheduleMobileScopeInset(forceFloor) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        applyMobileScopeInset();
        if (forceFloor) enforceMobileScopeFloor(getScrollWrap(), true);
      });
    });
  }

  function resetDrawerOpenTimers() {
    centering.userCancelled = false;
    centering.centered = false;
    centering.pageKey = "";
    if (centering.retryTimers && centering.retryTimers.length) {
      centering.retryTimers.forEach(function (t) { window.clearTimeout(t); });
      centering.retryTimers = [];
    }
  }

  function prepareDrawerOpenLayout(forceGhost) {
    if (!isMobileViewport()) return;
    syncMobileDrawerGateClass();
    const scrollWrap = getScrollWrap();
    if (!(scrollWrap instanceof HTMLElement)) return;

    resetDrawerOpenTimers();
    updateStickyMetrics();
    applyMobileScopeInset();

    // Build the replacement drawer before the native checkbox opens.  The
    // content is already centred and cloned while the custom surface is still
    // off-screen, so opening has a single visible step: slide in.
    centering.userCancelled = false;
    centering.centered = false;
    // The visual drawer now centres its own independent list scroller. Do not
    // pre-scroll the native Material drawer here; copying that transitional
    // scroll state is what made the custom surface open at the bottom.
    prepareUnifiedCustomDrawerSurface(!!forceGhost);

    syncDrawerGapPatches(!!forceGhost);
    scheduleDrawerGapPatchSync(false);
  }

  function bindDrawerOpenOnce() {
    const toggle = drawerToggle();
    if (!(toggle instanceof HTMLElement)) return;
    if (toggle.dataset.msbBound === "1") return;
    toggle.dataset.msbBound = "1";

    toggle.addEventListener("change", function () {
      syncMobileDrawerGateClass();
      if (!(toggle instanceof HTMLInputElement) || !toggle.checked) {
        closeUnifiedCustomDrawerSurface();
        scheduleDrawerGapPatchSync(true);
        return;
      }

      // The full drawer layout must be ready before the first open-frame paints.
      // Do not force a second rebuild at the actual open step: the pre-open
      // pass below has already produced the closed, off-screen surface.  Opening
      // should only flip the transform from fully closed to fully open.
      prepareDrawerOpenLayout(false);
      const customOpened = syncUnifiedCustomDrawerSurface(true, false);
      if (!customOpened) html().classList.remove("msb-unified-mobile-drawer-visible");
      runDrawerGapPatchAnimationFrames(1100);

      var pageKeyAtOpen = runtime.currentPageKey || currentRelPath();
      [160, 360, 720, 1040].forEach(function (delay) {
        window.setTimeout(function () {
          if (!(toggle instanceof HTMLInputElement) || !toggle.checked) return;
          if ((runtime.currentPageKey || currentRelPath()) !== pageKeyAtOpen) return;
          syncDrawerGapPatches(false);
        }, delay);
      });
    });

    try {
      const pre = function () {
        syncMobileDrawerGateClass();
        const t = drawerToggle();
        if (t instanceof HTMLInputElement && !t.checked) prepareDrawerOpenLayout(false);
      };

      const labels = asArray(document.querySelectorAll('label[for="__drawer"], .md-header label.md-header__button[for="__drawer"]'));
      labels.forEach(function (label) {
        if (!(label instanceof HTMLElement) || label.dataset.msbPreOpenMotionBound === "1") return;
        label.dataset.msbPreOpenMotionBound = "1";
        label.addEventListener('pointerdown', pre, { passive: true, capture: true });
        label.addEventListener('touchstart', pre, { passive: true, capture: true });
        label.addEventListener('mousedown', pre, { passive: true, capture: true });
      });

      // Fallback for themes/browsers where the hamburger label is re-rendered or
      // the tap target is not the label itself.  This runs before the checkbox
      // change event, but it does not hide the native drawer or apply any
      // content-readiness gate.
      if (!document.documentElement.dataset.msbDrawerPreOpenMotionDocBound) {
        document.documentElement.dataset.msbDrawerPreOpenMotionDocBound = "1";
        const docPre = function (event) {
          const target = event.target instanceof Element ? event.target : null;
          if (!target) return;
          const hit = target.closest && target.closest('label[for="__drawer"], .md-header__button[for="__drawer"]');
          if (!hit) return;
          pre();
        };
        document.addEventListener('pointerdown', docPre, { passive: true, capture: true });
        document.addEventListener('touchstart', docPre, { passive: true, capture: true });
        document.addEventListener('mousedown', docPre, { passive: true, capture: true });
      }
    } catch (_) {}

  }

  function isCurrentCourseOpen() {
    const scope = inferScope();
    if (!scope || scope.kind !== "course") return true;
    return true;
  }

  function toggleCurrentCourse() {
    // Kept for backwards compatibility with older callers, but the v65 sidebar
    // no longer lets the selected course collapse into the year-level course
    // overview.  The course picker now handles course switching; the content
    // below always drills down to lectures and concepts.
    const scope = inferScope();
    if (!scope || scope.kind !== "course") return true;
    writeCurrentScopeOpen(scope, true);
    const node = findCourseNode(scope);
    if (node) syncCurrentCourseNativeToggle(scope, node, true);
    scheduleRefresh("current-course-drilldown");
    emitCurrentScopeToggle(scope, true);
    return true;
  }

  async function renderSidebar() {
    removeLegacyArtifacts();
    ensureStyles();
    html().classList.add("mk-sidebar-sort-ready");

    const scrollWrap = getScrollWrap();
    if (!scrollWrap) return false;
    restoreCourseDrilldownVisibility(scrollWrap);
    suppressTocTakeover(getPrimarySidebar());
    clearMobileScopeInset(scrollWrap);
    updateStickyMetrics();
    bindDrawerOpenOnce();
    syncMobileDrawerGateClass();
    bindTouchCleanup(scrollWrap);
    bindGhostFloorScrollSync(scrollWrap);

    const scope = inferScope();
    runtime.currentPageKey = scope.relPath || currentRelPath();

    // v65 drill-down navigation: course pages should always show the selected
    // course's lectures/concepts below the Sort control.  Older builds allowed
    // the current course to collapse back into the year-level course list, which
    // made the lower drawer mix course titles with lecture topics.
    if (scope && scope.kind === "course") writeCurrentScopeOpen(scope, true);

    // For desktop Year pages, establish the correct scroll position before any
    // async metadata/sorting work. This avoids a visible first frame where the
    // sticky header overlaps the first block and then later snaps into place.
    setDesktopYearInitialTop(scrollWrap, scope);

    applyCurrentCourseBar(scrollWrap, scope);
    const control = ensureControl(scrollWrap, scope.kind || "course");

    if (!scope.kind) {
      if (control) control.style.display = "none";
      scrollWrap.removeAttribute(ATTR.sortKind);
      scrollWrap.removeAttribute(ATTR.sortMode);
      runtime.scopeList = null;
      updateStickyMetrics();
      scheduleDesktopScrollbarUpdate();
      syncMobileDrawerGateClass();
      scheduleDrawerGapPatchSync();
      scheduleMobileScopeInset(isDrawerOpen());
      scheduleUnifiedDrawerColdPrime(true);
      try {
        window.dispatchEvent(new CustomEvent("mk:sidebar-sort-rendered", {
          detail: { kind: "global", relPath: runtime.currentPageKey || currentRelPath() }
        }));
      } catch (_) {}
      centering.resetForPage(runtime.currentPageKey);
      return false;
    }

    if (control) {
      control.style.display = "";
      updateControlUi(control, scope.kind, readMode(scope.kind));
    }

    runtime.scopeList = null;
    const ok = scope.kind === "year"
      ? await sortYear(scope)
      : await sortAllCourseNodes(scope);

    if (control) updateControlUi(control, scope.kind, readMode(scope.kind));

    if (isDesktopYearScope(scope)) {
      setDesktopYearInitialTop(scrollWrap, scope);
    }

    if (scope && scope.kind === "course") applyCourseDrilldownVisibility(scope);
    else restoreCourseDrilldownVisibility(scrollWrap);

    if (!ok && control) control.style.display = "none";

    applyCurrentCourseBar(scrollWrap, scope);
    updateStickyMetrics();
    scheduleDrawerGapPatchSync();
    scheduleMobileScopeInset(isDrawerOpen());
    scheduleCourseIndexFirstLectureTop(true);
    scheduleUnifiedDrawerColdPrime(true);
    try {
      window.dispatchEvent(new CustomEvent("mk:sidebar-sort-rendered", {
        detail: { kind: scope.kind || "", relPath: runtime.currentPageKey || currentRelPath() }
      }));
    } catch (_) {}
    if (isDesktopYearScope(scope)) {
      centering.resetForPage(runtime.currentPageKey);
    } else {
      centering.scheduleForPage(runtime.currentPageKey, false);
    }
    return ok;
  }

  function runRender(reason) {
    return renderSidebar().catch(function (err) {
      try {
        console.error("[MkSidebarNavSort]", BUILD, reason || "refresh", err);
      } catch (_) {}
    });
  }

  function runInitialRender(reason) {
    try {
      setDesktopYearInitialTop(getScrollWrap(), inferScope());
    } catch (_) {}
    return runRender(reason);
  }

  function scheduleRefresh(reason) {
    runtime.navSeq += 1;
    const seq = runtime.navSeq;
    try {
      setDesktopYearInitialTop(getScrollWrap(), inferScope());
    } catch (_) {}
    if (runtime.applyTimer) window.clearTimeout(runtime.applyTimer);
    runtime.applyTimer = window.setTimeout(function () {
      runtime.applyTimer = 0;
      runRender(reason || "refresh");
    }, 36);
    return seq;
  }

  function handleResize() {
    if (runtime.resizeTimer) window.clearTimeout(runtime.resizeTimer);
    runtime.resizeTimer = window.setTimeout(function () {
      runtime.resizeTimer = 0;
      updateStickyMetrics();
      syncMobileDrawerGateClass();
      scheduleDrawerGapPatchSync();
      scheduleMobileScopeInset(isDrawerOpen());
      scheduleUnifiedDrawerColdPrime(true);
    }, 80);
  }

  window.MkSidebarNavSort = {
    refresh: function () {
      scheduleRefresh("manual");
    },
    refreshCurrentCourseBar: function () {
      applyCurrentCourseBar(getScrollWrap(), inferScope());
      updateStickyMetrics();
      emitCurrentCourseBarLayoutChanged();
    },
    isCurrentCourseOpen: isCurrentCourseOpen,
    toggleCurrentCourse: toggleCurrentCourse,
    version: BUILD
  };

  if (document.readyState === "loading") {
    // If the sidebar already exists where this script is loaded, run once now
    // rather than waiting for the delayed refresh path. This keeps desktop Year
    // pages top-aligned before the first usable sidebar frame.
    if (getScrollWrap()) runInitialRender("loading-immediate");
    document.addEventListener("DOMContentLoaded", function () {
      runInitialRender("dom-ready");
    }, { once: true });
  } else {
    runInitialRender("already-ready");
  }

  document.addEventListener("DOMContentSwitch", function () {
    scheduleRefresh("instant-navigation");
  });
  window.addEventListener("pageshow", function () {
    scheduleRefresh("pageshow");
  });
  window.addEventListener("mk:current-course-bar-layout", handleResize, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  function handleDrawerGapPatchScrollPowerSafe() {
    try {
      // This patch is only needed while the mobile drawer surface is actually
      // visible or settling.  Running the full safe-area / ghost-floor layout
      // pass on every normal page scroll is expensive on iOS Safari.
      if (!isMobileViewport()) return;
      const html = document.documentElement;
      const classOpen = !!(html && html.classList && (
        html.classList.contains("mk-mobile-unified-sidebar-open") ||
        html.classList.contains("mk-sidebar-drawer-open") ||
        html.classList.contains("mk-sidebar-drawer-closing") ||
        html.classList.contains("md-nav--open")
      ));
      const animating = !!(drawerGapAnimation && drawerGapAnimation.until && Date.now() < drawerGapAnimation.until + 120);
      if (!isDrawerOpen() && !classOpen && !animating) return;
      scheduleDrawerGapPatchSync(false);
    } catch (_) {}
  }
  window.addEventListener("scroll", handleDrawerGapPatchScrollPowerSafe, { passive: true });
  if (window.visualViewport) {
    try { window.visualViewport.addEventListener("resize", handleResize, { passive: true }); } catch (_) {}
    try { window.visualViewport.addEventListener("scroll", function () {
      // visualViewport scroll fires continuously while iOS hides/shows the
      // browser chrome.  The sidebar resize/cold-prime path is only relevant
      // while the mobile drawer is open.
      if (isDrawerOpen()) handleResize();
    }, { passive: true }); } catch (_) {}
  }
})();
