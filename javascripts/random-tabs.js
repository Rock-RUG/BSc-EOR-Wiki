(function () {
  const TRENDING_ITEM_ID = "trending-item";
  const RANDOM_DROPDOWN_ITEM_ID = "random-dropdown-item";
  const PANEL_ID = "random-dropdown-panel";

  const GLOBAL_LINK_SELECTOR = 'a.md-tabs__link[href*="random"]';

  // ===== Tab dropdown open/close state (for unified component styling) =====
  function markDropdownOpen(triggerEl) {
    document.body.classList.add("has-tab-dropdown-open");
    if (!triggerEl) return;
    triggerEl.classList.add("is-open");
    triggerEl.setAttribute("aria-expanded", "true");
  }

  function markDropdownClosed(triggerEl) {
    document.body.classList.remove("has-tab-dropdown-open");
    if (!triggerEl) return;
    triggerEl.classList.remove("is-open");
    triggerEl.setAttribute("aria-expanded", "false");
  }

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

  // 课程判定：路径至少两段 /<year>/<course>/...
  // 排除 /<year>/ 或 /<year>/index.html
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

  // 清理你之前可能存在的旧实现：
  // - custom-random tab
  // - 旧的 Random in course 顶部 tab（如果之前用另一个脚本插入过）
  // - 旧的 dropdown panel
  function removeOldRandomRelatedItems(list) {
    if (!list) return;

    // 旧的 custom-random 顶部 tab
    list.querySelectorAll('a.md-tabs__link[href*="custom-random"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });

    // 旧的 “Random in course” 顶部 tab（你之前那种实现会带 data-random-scope="course"）
    list.querySelectorAll('a.md-tabs__link[data-random-scope="course"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });

    // 旧 dropdown tab id
    list.querySelectorAll(`#${RANDOM_DROPDOWN_ITEM_ID}`).forEach(el => el.remove());

    // 旧 panel
    const p = document.getElementById(PANEL_ID);
    if (p) p.remove();
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

  // items: { kind: "link", label, href, scope? } or { kind:"sep" }
  function buildPanel(anchorEl, items, caretEl, onCloseCb) {
    closePanel();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.className = "md-random-dropdown-panel";

    // 只在 JS 里管定位和宽度，颜色/字体/间距全部交给 CSS
    const rect = anchorEl.getBoundingClientRect();
    const cs = window.getComputedStyle(anchorEl);
    const anchorPadL = getPx(cs.paddingLeft);

    const ITEM_PAD_X = 12;
    const tabTextLeft = rect.left + anchorPadL;

    let left = tabTextLeft - ITEM_PAD_X;
    const minW = Math.max(170, Math.round(rect.width));
    panel.style.minWidth = `${minW}px`;

    const maxW = 280;
    const maxLeft = window.innerWidth - Math.min(maxW, minW) - 8;
    left = Math.max(8, Math.min(left, maxLeft));

    const top = Math.min(rect.bottom + 12, window.innerHeight - 80);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;

    const cur = new URL(window.location.href);

    items.forEach((it) => {
      if (it.kind === "sep") {
        const hr = document.createElement("div");
        hr.className = "md-random-dropdown-sep";
        panel.appendChild(hr);
        return;
      }

      const a = document.createElement("a");
      a.className = "md-random-dropdown-item";
      a.href = it.href;
      a.textContent = it.label;

      if (it.scope === "course") {
        a.setAttribute("data-random-scope", "course");
      }

      // active 判定
      let isActive = false;
      try {
        const target = new URL(it.href, document.baseURI);
        isActive = normalizePathname(cur) === normalizePathname(target);
      } catch (_) {
        isActive = false;
      }

      if (isActive) {
        a.classList.add("is-active");
      }

      panel.appendChild(a);
    });

    document.body.appendChild(panel);

    const closeAll = () => {
      closePanel();
      if (typeof onCloseCb === "function") onCloseCb();
    };

    // 点击外部关闭
    const onDocPointerDown = (e) => {
      if (!panel.contains(e.target) && e.target !== anchorEl && !anchorEl.contains(e.target)) {
        closeAll();
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown, { capture: true });

    panel._cleanup = () => {
      document.removeEventListener("pointerdown", onDocPointerDown, { capture: true });
    };

    window.addEventListener("scroll", closeAll, { passive: true, once: true });
    window.addEventListener("resize", closeAll, { passive: true, once: true });
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

    // 让 tab 自身不再导航
    a2.setAttribute("href", "#");

    a2.textContent = "Random";
    a2.setAttribute("aria-haspopup", "menu");
    a2.setAttribute("aria-expanded", "false");
    a2.style.cursor = "pointer";

    a2.classList.add("md-tab-dropdown");

    const caret = document.createElement("span");
    caret.className = "md-random-dropdown-caret";
    caret.textContent = " ▾";
    a2.appendChild(caret);

    function setOpen(open) {
      caret.textContent = open ? " ▴" : " ▾";
      if (open) {
        markDropdownOpen(a2);
      } else {
        markDropdownClosed(a2);
      }
    }

    function toggle() {
      if (isPanelOpen()) {
        closePanel();
        setOpen(false);
        return;
      }

      const courseScope = getCourseScopeIfAny();

      // 统一分组逻辑：
      // - 有 course：Random / Random in course / (sep) / Custom random
      // - 无 course：Random / (sep) / Custom random
      const items = [
        { kind: "link", label: "Random", href: new URL(originalHref, document.baseURI).toString() },
      ];

      if (courseScope) {
  items.push({ kind: "sep" });
  items.push({
    kind: "link",
    label: "Random in course",
    href: new URL(originalHref, document.baseURI).toString(),
    scope: "course",
  });
}

items.push({ kind: "sep" });
items.push({ kind: "link", label: "Custom random", href: customHref });


      buildPanel(a2, items, caret, () => setOpen(false));
      setOpen(true);
    }

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
      // pointerdown 已处理 toggle，避免重复触发
    });

    // 键盘支持：Enter / Space 打开关闭
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

  // mkdocs-material instant navigation
  document.addEventListener("DOMContentSwitch", init);
})();
