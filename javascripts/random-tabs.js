(function () {
  const TRENDING_ITEM_ID = "trending-item";
  const RANDOM_DROPDOWN_ITEM_ID = "random-dropdown-item";
  const PANEL_ID = "random-dropdown-panel";

  const GLOBAL_LINK_SELECTOR = 'a.md-tabs__link[href*="random"]';

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');

    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return window.location.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return window.location.origin + base.pathname;
  }

  function relPathFromSiteRoot(absPathname) {
    const siteRoot = new URL(getSiteRootUrl());
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : (siteRoot.pathname + "/");

    let p = String(absPathname || window.location.pathname);
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    p = p.replace(/^\/+/, "").replace(/\/+$/, "");
    return p;
  }

  function splitSegs(relPath) {
    return (relPath || "").split("/").filter(Boolean);
  }

  function getCourseScopeIfAny() {
    const rel = relPathFromSiteRoot(window.location.pathname);
    const segs = splitSegs(rel);

    if (segs.length < 2) return "";
    if (segs.length === 2 && segs[1].toLowerCase() === "index.html") return "";
    if (segs.length === 1) return "";
    return `${segs[0]}/${segs[1]}/`;
  }

  function findTabsList() {
    return document.querySelector(".md-tabs__list");
  }

  function findGlobalRandomItem() {
    const list = findTabsList();
    if (!list) return null;

    const links = Array.from(list.querySelectorAll("a.md-tabs__link"));
    const target =
      links.find(a => {
        const h = (a.getAttribute("href") || "").toLowerCase().split("#")[0].split("?")[0];
        if (!h) return false;
        if (h.includes("custom-random")) return false;
        return h.includes("/random/") || h.endsWith("random.html") || h.endsWith("random/");
      }) || list.querySelector(GLOBAL_LINK_SELECTOR);

    return target ? target.closest(".md-tabs__item") : null;
  }

  function removeAllTrendingItems(list) {
    if (!list) return;

    list.querySelectorAll(`#${TRENDING_ITEM_ID}`).forEach(el => el.remove());
    list.querySelectorAll('a.md-tabs__link[href*="trending"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });
  }

  function removeOldRandomRelatedItems(list) {
    if (!list) return;

    list.querySelectorAll('a.md-tabs__link[href*="custom-random"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });

    list.querySelectorAll('a.md-tabs__link[data-random-scope="course"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });

    list.querySelectorAll(`#${RANDOM_DROPDOWN_ITEM_ID}`).forEach(el => el.remove());
  }

  function createTrendingItem() {
    const li = document.createElement("li");
    li.className = "md-tabs__item";
    li.id = TRENDING_ITEM_ID;

    const a = document.createElement("a");
    a.className = "md-tabs__link";
    a.href = new URL("trending.html", getSiteRootUrl()).toString();
    a.textContent = "Trending";

    li.appendChild(a);
    return li;
  }

  function closePanel() {
    const p = document.getElementById(PANEL_ID);
    if (p) {
      if (typeof p._cleanup === "function") p._cleanup();
      p.remove();
    }
  }

  function isPanelOpen() {
    return !!document.getElementById(PANEL_ID);
  }

  function normalizePathname(u) {
    let p = (u && u.pathname) ? u.pathname : "";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }

  function getPx(value) {
    const n = parseFloat(String(value || "0"));
    return Number.isFinite(n) ? n : 0;
  }

  function buildPanel(anchorEl, items, caretEl) {
    closePanel();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;

    const ITEM_PAD_X = 12;

    Object.assign(panel.style, {
      position: "fixed",
      zIndex: "9999",
      background: "rgba(30, 33, 41, 0.96)",
      borderRadius: "14px",
      padding: "6px",
      boxShadow: "0 8px 24px rgba(0,0,0,.28)",
      fontSize: "14px",
      lineHeight: "1.35",
      backdropFilter: "blur(6px)",
      maxWidth: "260px",
      overflow: "hidden",
    });

    const rect = anchorEl.getBoundingClientRect();
    const cs = window.getComputedStyle(anchorEl);
    const anchorPadL = getPx(cs.paddingLeft);

    // tab 文字起点
    const tabTextLeft = rect.left + anchorPadL;

    // dropdown 文字起点 = panel.left + ITEM_PAD_X
    let left = tabTextLeft - ITEM_PAD_X;

    const minW = Math.max(150, Math.round(rect.width));
    panel.style.minWidth = `${minW}px`;

    const maxLeft = window.innerWidth - Math.min(260, minW) - 8;
    left = Math.max(8, Math.min(left, maxLeft));

    // 往下挪，避免面板压住 tab
    const top = Math.min(rect.bottom + 12, window.innerHeight - 80);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;

    const cur = new URL(window.location.href);

    items.forEach((it, i) => {
      if (i === 1) {
        const hr = document.createElement("div");
        hr.style.height = "1px";
        hr.style.margin = "6px 10px";
        hr.style.background = "rgba(255,255,255,0.05)";
        panel.appendChild(hr);
      }

      const a = document.createElement("a");
      a.className = "item";
      a.href = it.href;
      a.textContent = it.label;

      Object.assign(a.style, {
        display: "block",
        padding: `6px ${ITEM_PAD_X}px`,
        borderRadius: "10px",
        textDecoration: "none",
        color: "inherit",
        fontSize: "14px",
        lineHeight: "1.35",
        fontWeight: "400",
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "background 120ms ease, transform 120ms ease",
      });

      let isActive = false;
      try {
        const target = new URL(it.href, document.baseURI);
        isActive = normalizePathname(cur) === normalizePathname(target);
      } catch (_) {
        isActive = false;
      }

      const ACTIVE_BG = "rgba(255,255,255,0.06)";
      const HOVER_BG = "rgba(255,255,255,0.09)";

      if (isActive) {
        a.style.background = ACTIVE_BG;
        a.style.fontWeight = "600";
      }

      a.addEventListener("mouseenter", () => {
        a.style.background = HOVER_BG;
        a.style.transform = "translateY(-0.5px)";
      });
      a.addEventListener("mouseleave", () => {
        a.style.background = isActive ? ACTIVE_BG : "transparent";
        a.style.transform = "none";
      });

      panel.appendChild(a);
    });

    document.body.appendChild(panel);

    // 点击外部关闭
    const onDocPointerDown = (e) => {
      if (!panel.contains(e.target) && e.target !== anchorEl && !anchorEl.contains(e.target)) {
        closePanel();
        anchorEl.setAttribute("aria-expanded", "false");
        if (caretEl) caretEl.textContent = " ▾";
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown, { capture: true });

    panel._cleanup = () => {
      document.removeEventListener("pointerdown", onDocPointerDown, { capture: true });
    };

    const onClose = () => {
      closePanel();
      anchorEl.setAttribute("aria-expanded", "false");
      if (caretEl) caretEl.textContent = " ▾";
    };
    window.addEventListener("scroll", onClose, { passive: true, once: true });
    window.addEventListener("resize", onClose, { passive: true, once: true });
  }

  function attachDropdownToRandomTab(globalItem) {
    const a = globalItem.querySelector("a.md-tabs__link");
    if (!a) return;

    // 避免重复绑定：替换成 clone
    const a2 = a.cloneNode(true);
    a.replaceWith(a2);

    // 原链接，用于 dropdown 第一个 item
    const originalHref = a2.getAttribute("href") || new URL("random.html", getSiteRootUrl()).toString();
    const customHref = new URL("custom-random.html", getSiteRootUrl()).toString();

    // ✅ 关键：让 tab 自身不再导航（否则必然会跳）
    a2.setAttribute("href", "#");

    a2.textContent = "Random";
    a2.setAttribute("aria-haspopup", "menu");
    a2.setAttribute("aria-expanded", "false");
    a2.style.cursor = "pointer";

    const caret = document.createElement("span");
    caret.textContent = " ▾";
    caret.style.marginLeft = "4px";
    caret.style.fontSize = "0.85em";
    caret.style.position = "relative";
    caret.style.top = "1px"; // 稍微再调低一点
    caret.style.opacity = "0.85";
    a2.appendChild(caret);

    function setOpen(open) {
      a2.setAttribute("aria-expanded", open ? "true" : "false");
      caret.textContent = open ? " ▴" : " ▾";
    }

    function toggle() {
      if (isPanelOpen()) {
        closePanel();
        setOpen(false);
        return;
      }

      const items = [
        { label: "Random", href: new URL(originalHref, document.baseURI).toString() },
        { label: "Custom random", href: customHref },
      ];

      const courseScope = getCourseScopeIfAny();
      if (courseScope) {
        items.splice(1, 0, {
          label: "Random in course",
          href: new URL(originalHref, document.baseURI).toString(),
        });
      }

      buildPanel(a2, items, caret);
      setOpen(true);
    }

    // ✅ 必须同时拦截 pointerdown + click（否则 click 仍会导航）
    const stop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    a2.addEventListener("pointerdown", (e) => {
      stop(e);
      toggle();
    });

    a2.addEventListener("click", (e) => {
      stop(e);
      // click 不再 toggle，避免一次手势触发两次（pointerdown 已经做了）
    });

    // ✅ 键盘支持：Enter / Space 打开关闭
    a2.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        stop(e);
        toggle();
      } else if (e.key === "Escape") {
        stop(e);
        closePanel();
        setOpen(false);
      }
    });
  }

  function setRightGroupStart(item) {
    const list = findTabsList();
    if (!list) return;

    list.querySelectorAll(".md-tabs__item.random-right-start").forEach(el => {
      el.classList.remove("random-right-start");
    });

    if (item) item.classList.add("random-right-start");
  }

  function ensureTabs() {
    const list = findTabsList();
    const globalItem = findGlobalRandomItem();
    if (!list || !globalItem) return;

    removeOldRandomRelatedItems(list);
    removeAllTrendingItems(list);

    globalItem.id = RANDOM_DROPDOWN_ITEM_ID;
    attachDropdownToRandomTab(globalItem);

    const trendingItem = createTrendingItem();
    if (globalItem.nextSibling) {
      list.insertBefore(trendingItem, globalItem.nextSibling);
    } else {
      list.appendChild(trendingItem);
    }

    setRightGroupStart(globalItem);
    closePanel();
  }

  function init() {
    ensureTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);
})();
