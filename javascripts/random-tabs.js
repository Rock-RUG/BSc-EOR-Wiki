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

    // 找到“真正的 Random”tab：优先匹配 href 结尾 random 或包含 /random/
    const links = Array.from(list.querySelectorAll("a.md-tabs__link"));
    const target = links.find(a => {
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

  // 把以前顶部存在的 Custom random / Random in course 这些残留项清理掉
  function removeOldRandomRelatedItems(list) {
    if (!list) return;

    // 兜底删：custom-random tab
    list.querySelectorAll('a.md-tabs__link[href*="custom-random"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });

    // 兜底删：random in course（如果以前存在）
    list.querySelectorAll('a.md-tabs__link[data-random-scope="course"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });

    // 兜底删：我们自己创建过的 dropdown item
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
    if (p) p.remove();
  }

  function isPanelOpen() {
    return !!document.getElementById(PANEL_ID);
  }

  function buildPanel(anchorEl, items) {
    closePanel();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;

    // ===== 强制视觉一致：不要用 rem，避免 header 上下文缩放影响 =====
    Object.assign(panel.style, {
      position: "fixed",
      zIndex: "9999",
      background: "rgb(30, 33, 41)",
      borderRadius: "14px",
      padding: "6px",
      boxShadow: "0 10px 35px rgba(0,0,0,.38)",
      fontSize: "14px",
      lineHeight: "1.35",
      minWidth: "180px",
    });

    const rect = anchorEl.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - 220));
    const top = Math.min(rect.bottom + 10, window.innerHeight - 80);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;

    items.forEach(it => {
      const a = document.createElement("a");
      a.className = "item";
      a.href = it.href;
      a.textContent = it.label;

      Object.assign(a.style, {
        display: "block",
        padding: "6px 10px",
        borderRadius: "10px",
        textDecoration: "none",
        color: "inherit",
        fontSize: "14px",
        lineHeight: "1.35",
        fontWeight: "400",
        whiteSpace: "nowrap",
        cursor: "pointer",
      });

      a.addEventListener("mouseenter", () => {
        a.style.background = "rgba(255,255,255,0.06)";
      });
      a.addEventListener("mouseleave", () => {
        a.style.background = "transparent";
      });

      panel.appendChild(a);
    });

    document.body.appendChild(panel);

    // outside click close
    setTimeout(() => {
      const onDocClick = (e) => {
        if (!panel.contains(e.target) && e.target !== anchorEl) closePanel();
      };
      document.addEventListener("click", onDocClick, { once: true, capture: true });
    }, 0);

    // scroll/resize close
    const onClose = () => closePanel();
    window.addEventListener("scroll", onClose, { passive: true, once: true });
    window.addEventListener("resize", onClose, { passive: true, once: true });
  }

  function attachDropdownToRandomTab(globalItem) {
    const a = globalItem.querySelector("a.md-tabs__link");
    if (!a) return;

    // 防止重复绑定：用 clone 替换节点，清掉旧监听
    const a2 = a.cloneNode(true);
    a.replaceWith(a2);

    // 保存原 Random 链接（用于 dropdown 里的 Random）
    const originalHref = a2.getAttribute("href") || new URL("random.html", getSiteRootUrl()).toString();
    const customHref = new URL("custom-random.html", getSiteRootUrl()).toString();

    // 把 tab 文案变成 Random ▾
    a2.textContent = "Random";
    a2.setAttribute("aria-haspopup", "menu");
    a2.setAttribute("aria-expanded", "false");

    // 加个小箭头（纯文本，避免 icon 依赖）
    const caret = document.createElement("span");
    caret.textContent = " ▾";
    caret.style.opacity = "0.8";
    caret.style.fontSize = "0.9em";
    a2.appendChild(caret);

    // 让点击不跳转，只打开 dropdown
    a2.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isPanelOpen()) {
        closePanel();
        a2.setAttribute("aria-expanded", "false");
        return;
      }

      const items = [
        { label: "Random", href: new URL(originalHref, document.baseURI).toString() },
        { label: "Custom random", href: customHref },
      ];

      // 课程页才加 Random in course
      const courseScope = getCourseScopeIfAny();
      if (courseScope) {
        // 你原来 Random in course 是复用 random/ 的入口，所以这里保持一致：
        items.splice(1, 0, { label: "Random in course", href: new URL(originalHref, document.baseURI).toString() });
      }

      buildPanel(a2, items);
      a2.setAttribute("aria-expanded", "true");
    });
  }

  // 让 Random/Trending 保持在右侧：给右侧组起点打标（你 CSS 里应该用这个来 float/right）
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

    // 清理旧的 random 相关 tab（Custom random / Random in course 等）
    removeOldRandomRelatedItems(list);

    // 先清 trending（防重复）
    removeAllTrendingItems(list);

    // 把“真正的 Random tab”改造成 dropdown 触发器
    globalItem.id = RANDOM_DROPDOWN_ITEM_ID;
    attachDropdownToRandomTab(globalItem);

    // Trending 放在 Random 的右边
    const trendingItem = createTrendingItem();
    if (globalItem.nextSibling) {
      list.insertBefore(trendingItem, globalItem.nextSibling);
    } else {
      list.appendChild(trendingItem);
    }

    // 右侧组起点：Random dropdown
    setRightGroupStart(globalItem);

    // 如果切页残留了 panel，关掉
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

  // mkdocs-material instant navigation（你原来就是这样写的，继续保留）
  document.addEventListener("DOMContentSwitch", init);
})();
