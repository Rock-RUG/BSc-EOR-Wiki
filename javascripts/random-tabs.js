(function () {
  const RANDOM_ITEM_ID = "random-dropdown-root";
  const TRENDING_ITEM_ID = "trending-right-item";
  const PANEL_ID = "random-dropdown-panel";

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');

    const attr = script ? script.getAttribute("src") : (link ? link.getAttribute("href") : null);
    const assetUrl = attr ? new URL(attr, document.baseURI) : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");
    if (idx >= 0) return assetUrl.origin + p.slice(0, idx + 1);

    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
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

  function isCoursePage() {
    const rel = relPathFromSiteRoot(window.location.pathname);
    const segs = splitSegs(rel);
    if (segs.length < 2) return false;
    if (segs.length === 1) return false;
    if (segs.length === 2 && segs[1].toLowerCase() === "index.html") return false;
    return true;
  }

  function findTabsList() {
    return document.querySelector(".md-tabs__list");
  }

  function textOf(a) {
    return (a && a.textContent ? a.textContent : "").trim();
  }

  // 用文本定位 Random（最稳）
  function findRandomItem(list) {
    // 1) 优先找我们自己标记过的
    const byId = list.querySelector(`#${RANDOM_ITEM_ID}`);
    if (byId) return byId;

    // 2) 通过 link 文本找 "Random"
    const links = Array.from(list.querySelectorAll("a.md-tabs__link"));
    const a = links.find(x => textOf(x) === "Random");
    return a ? a.closest(".md-tabs__item") : null;
  }

  function removeAllTrendingItems(list) {
    // 移除所有 “Trending” tab（无论在左还是右），避免重复
    const links = Array.from(list.querySelectorAll("a.md-tabs__link"));
    links.forEach(a => {
      if (textOf(a) === "Trending" || (a.getAttribute("href") || "").includes("trending")) {
        const li = a.closest(".md-tabs__item");
        if (li) li.remove();
      }
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

  function setRightGroupStart(list, itemToStart) {
    list.querySelectorAll(".md-tabs__item.random-right-start").forEach(el => {
      el.classList.remove("random-right-start");
    });
    if (itemToStart) itemToStart.classList.add("random-right-start");
  }

  function isPanelOpen() {
    return !!document.getElementById(PANEL_ID);
  }

  function closePanel() {
    const p = document.getElementById(PANEL_ID);
    if (!p) return;

    p.classList.remove("open");

    let done = false;
    const onEnd = () => {
      if (done) return;
      done = true;
      if (p && p.parentNode) p.parentNode.removeChild(p);
    };
    p.addEventListener("transitionend", onEnd, { once: true });
    setTimeout(onEnd, 220);
  }

  function buildPanel(anchorEl, items) {
    closePanel();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;

    const rect = anchorEl.getBoundingClientRect();
    const maxW = 320;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - maxW - 8));
    const top = Math.min(rect.bottom + 10, window.innerHeight - 120);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;

    items.forEach((it) => {
      const a = document.createElement("a");
      a.className = "item";
      a.href = it.href;
      a.textContent = it.label;
      panel.appendChild(a);
    });

    document.body.appendChild(panel);

    requestAnimationFrame(() => {
      panel.classList.add("open");
    });

    // outside click close
    setTimeout(() => {
      const onDocClick = (e) => {
        if (!panel.contains(e.target) && e.target !== anchorEl) closePanel();
      };
      document.addEventListener("click", onDocClick, { once: true, capture: true });
    }, 0);

    const onClose = () => closePanel();
    window.addEventListener("scroll", onClose, { passive: true, once: true });
    window.addEventListener("resize", onClose, { passive: true, once: true });
  }

  function attachDropdown(randomItem) {
    const a = randomItem.querySelector("a.md-tabs__link");
    if (!a) return;

    // 标记 item，确保下次还能找到
    randomItem.id = RANDOM_ITEM_ID;

    // 保存原本的 random 跳转地址（避免你 href="#" 后下次找不到）
    if (!a.dataset.originalHref) {
      const oldHref = a.getAttribute("href") || new URL("random.html", getSiteRootUrl()).toString();
      a.dataset.originalHref = new URL(oldHref, document.baseURI).toString();
    }

    // 把链接改成开关，不要跳转
    a.setAttribute("href", "#");
    a.setAttribute("aria-haspopup", "menu");
    a.setAttribute("aria-expanded", "false");

    // 清掉我们之前加过的箭头（避免重复叠加）
    a.querySelectorAll(".random-caret").forEach(n => n.remove());

    const caret = document.createElement("span");
    caret.className = "random-caret";
    caret.textContent = " ▾";
    caret.style.marginLeft = "4px";
    caret.style.fontSize = "0.85em";
    caret.style.position = "relative";
    caret.style.top = "1px"; // 你说偏高，这里往下 1px
    a.appendChild(caret);

    // 防止重复绑定：clone 一次
    const a2 = a.cloneNode(true);
    a.replaceWith(a2);

    a2.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isPanelOpen()) {
        closePanel();
        a2.setAttribute("aria-expanded", "false");
        const c = a2.querySelector(".random-caret");
        if (c) c.textContent = " ▾";
        return;
      }

      const items = [];
      const randomHref = a2.dataset.originalHref;

      items.push({ label: "Random", href: randomHref });

      if (isCoursePage()) {
        // random-in-course 仍然指向同一 random.html（random.js 里会读 scope）
        items.push({ label: "Random in course", href: randomHref });
      }

      items.push({ label: "Custom random", href: new URL("custom-random.html", getSiteRootUrl()).toString() });

      buildPanel(a2, items);
      a2.setAttribute("aria-expanded", "true");
      const c = a2.querySelector(".random-caret");
      if (c) c.textContent = " ▴";
    });
  }

  function ensureTabs() {
    const list = findTabsList();
    if (!list) return;

    // 1) 找 Random
    const randomItem = findRandomItem(list);
    if (!randomItem) return;

    // 2) 让 Random 组靠右（需要你 CSS 里有 random-right-start 规则）
    setRightGroupStart(list, randomItem);

    // 3) 移除所有 Trending（避免重复），再插入一个到 Random 右侧
    removeAllTrendingItems(list);

    const trendingItem = createTrendingItem();
    if (randomItem.nextSibling) list.insertBefore(trendingItem, randomItem.nextSibling);
    else list.appendChild(trendingItem);

    // 4) 给 Random 绑定下拉
    attachDropdown(randomItem);
  }

  function init() {
    closePanel();
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
