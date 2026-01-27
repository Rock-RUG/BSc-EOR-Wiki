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

  // 课程页才返回 scope；Home / Year index 不返回
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
    const a = list.querySelector(GLOBAL_LINK_SELECTOR);
    return a ? a.closest(".md-tabs__item") : null;
  }

  function removeAllTrendingItems(list) {
    list.querySelectorAll(`#${TRENDING_ITEM_ID}`).forEach(n => n.remove());
  }

  function removeOldRandomRelatedItems(list) {
    // 清掉旧的 custom/random in course（如果你之前做过插入）
    list.querySelectorAll(
      'a.md-tabs__link[href*="custom-random"], a.md-tabs__link[href*="random-in-course"]'
    ).forEach(a => {
      const li = a.closest(".md-tabs__item");
      if (li) li.remove();
    });
  }

  function createTrendingItem() {
    const li = document.createElement("li");
    li.className = "md-tabs__item";
    li.id = TRENDING_ITEM_ID;

    const a = document.createElement("a");
    a.className = "md-tabs__link";
    a.href = new URL("trending/", getSiteRootUrl()).toString();
    a.textContent = "Trending";

    li.appendChild(a);
    return li;
  }

  function isPanelOpen() {
    return !!document.getElementById(PANEL_ID);
  }

  function closePanel() {
    const p = document.getElementById(PANEL_ID);
    if (!p) return;

    // 触发 leave 动画（配合你 CSS 的 .open）
    p.classList.remove("open");

    // 动画结束再移除，避免“瞬间消失”
    const rm = () => {
      if (p && p.parentNode) p.parentNode.removeChild(p);
    };

    // transitionend 可能不触发（极少数情况），加兜底
    let done = false;
    const onEnd = () => {
      if (done) return;
      done = true;
      rm();
    };
    p.addEventListener("transitionend", onEnd, { once: true });
    setTimeout(onEnd, 220);
  }

  function normalizePathname(u) {
    let p = (u && u.pathname) ? u.pathname : "";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  }

  function buildPanel(anchorEl, items, caretEl) {
    closePanel();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;

    // 只负责定位，样式交给 CSS（否则你改不动字体/间距）
    const rect = anchorEl.getBoundingClientRect();
    const maxW = 320;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - maxW - 8));
    const top = Math.min(rect.bottom + 10, window.innerHeight - 120);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;

    const cur = new URL(window.location.href);

    items.forEach((it) => {
      const a = document.createElement("a");
      a.className = "item";
      a.href = it.href;
      a.textContent = it.label;

      // 当前页标记（给 CSS 用，也更语义化）
      try {
        const target = new URL(it.href, document.baseURI);
        const isActive = normalizePathname(cur) === normalizePathname(target);
        if (isActive) a.setAttribute("aria-current", "page");
      } catch (_) {}

      panel.appendChild(a);
    });

    document.body.appendChild(panel);

    // enter 动效：下一帧加 open
    requestAnimationFrame(() => {
      panel.classList.add("open");
    });

    // outside click close
    setTimeout(() => {
      const onDocClick = (e) => {
        if (!panel.contains(e.target) && e.target !== anchorEl) {
          closePanel();
          anchorEl.setAttribute("aria-expanded", "false");
          if (caretEl) caretEl.textContent = " ▾";
        }
      };
      document.addEventListener("click", onDocClick, { once: true, capture: true });
    }, 0);

    // scroll/resize close
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

    // clone 避免重复绑定
    const a2 = a.cloneNode(true);
    a.replaceWith(a2);

    const originalHref = a2.getAttribute("href") || new URL("random.html", getSiteRootUrl()).toString();
    const customHref = new URL("custom-random.html", getSiteRootUrl()).toString();

    // 关键：Random tab 点击不跳转，而是开关菜单
    a2.textContent = "Random";
    a2.setAttribute("href", "#");
    a2.setAttribute("aria-haspopup", "menu");
    a2.setAttribute("aria-expanded", "false");

    const caret = document.createElement("span");
    caret.textContent = " ▾";
    caret.style.marginLeft = "4px";
    caret.style.fontSize = "0.85em";
    caret.style.position = "relative";
    caret.style.top = "0px"; // 你说偏高：这里稍微往下就是 0 或 1
    a2.appendChild(caret);

    a2.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isPanelOpen()) {
        closePanel();
        a2.setAttribute("aria-expanded", "false");
        caret.textContent = " ▾";
        return;
      }

      const items = [
        { label: "Random", href: new URL(originalHref, document.baseURI).toString() },
      ];

      const courseScope = getCourseScopeIfAny();
      if (courseScope) {
        // Random in course 复用同一 random 页面（random.js 会读 scope）
        items.push({ label: "Random in course", href: new URL(originalHref, document.baseURI).toString() });
      }

      items.push({ label: "Custom random", href: customHref });

      buildPanel(a2, items, caret);
      a2.setAttribute("aria-expanded", "true");
      caret.textContent = " ▴";
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
