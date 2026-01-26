(function () {
  const TRENDING_ITEM_ID = "trending-item";
  const COURSE_ITEM_ID = "course-random-item";
  const CUSTOM_ITEM_ID = "custom-random-item";
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

  function removeAllCustomItems(list) {
    if (!list) return;

    // 1) 按 id 删
    list.querySelectorAll(`#${CUSTOM_ITEM_ID}`).forEach(el => el.remove());

    // 2) 按链接 href 再兜底删（避免 id 被复制导致重复）
    list.querySelectorAll('a.md-tabs__link[href*="custom-random"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });
  }

  function removeAllCourseItems(list) {
    if (!list) return;
    list.querySelectorAll(`#${COURSE_ITEM_ID}`).forEach(el => el.remove());
  }

  function removeAllTrendingItems(list) {
    if (!list) return;

    // 1) 按 id 删
    list.querySelectorAll(`#${TRENDING_ITEM_ID}`).forEach(el => el.remove());

    // 2) 按链接 href 再兜底删
    list.querySelectorAll('a.md-tabs__link[href*="trending"]').forEach(a => {
      const item = a.closest(".md-tabs__item");
      if (item) item.remove();
    });
  }

  function createCustomItem() {
    const li = document.createElement("li");
    li.className = "md-tabs__item";
    li.id = CUSTOM_ITEM_ID;

    const a = document.createElement("a");
    a.className = "md-tabs__link";
    a.href = new URL("custom-random.html", getSiteRootUrl()).toString();
    a.textContent = "Custom random";

    li.appendChild(a);
    return li;
  }

  function createCourseItem(href) {
    const li = document.createElement("li");
    li.className = "md-tabs__item";
    li.id = COURSE_ITEM_ID;

    const a = document.createElement("a");
    a.className = "md-tabs__link";
    a.href = href;
    a.textContent = "Random in course";
    a.setAttribute("data-random-scope", "course");

    li.appendChild(a);
    return li;
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

    // 每次切页都先彻底清理，保证不会重复
    removeAllCustomItems(list);
    removeAllCourseItems(list);
    removeAllTrendingItems(list);

    // 插入顺序固定为：Custom random | Random in course(如果有) | Random | Trending
    const customItem = createCustomItem();
    list.insertBefore(customItem, globalItem);

    const courseScope = getCourseScopeIfAny();
    let courseItem = null;
    if (courseScope) {
      const globalLink = globalItem.querySelector("a.md-tabs__link");
      const href = globalLink ? globalLink.getAttribute("href") : "random/";
      courseItem = createCourseItem(href);
      list.insertBefore(courseItem, globalItem);
    }

    // Trending 放在 Random 的右边
    const trendingItem = createTrendingItem();
    if (globalItem.nextSibling) {
      list.insertBefore(trendingItem, globalItem.nextSibling);
    } else {
      list.appendChild(trendingItem);
    }

    // 右侧组起点：Custom random
    setRightGroupStart(customItem);
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
