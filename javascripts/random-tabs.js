(function () {
  const COURSE_ITEM_ID = "course-random-item";
  const COURSE_LINK_ID = "course-random-link";

  const CUSTOM_ITEM_ID = "custom-random-item";
  const CUSTOM_LINK_ID = "custom-random-link";

  const GLOBAL_LINK_SELECTOR = 'a.md-tabs__link[href*="random"]';

  function getSiteRootUrl() {
    const script = document.querySelector('script[src*="assets/javascripts/bundle"]');
    const link =
      document.querySelector('link[href*="assets/stylesheets/main"]') ||
      document.querySelector('link[href*="assets/stylesheets"]');

    const attr = script
      ? script.getAttribute("src")
      : (link ? link.getAttribute("href") : null);

    const assetUrl = attr
      ? new URL(attr, document.baseURI)
      : new URL(document.baseURI);

    const p = assetUrl.pathname;
    const idx = p.indexOf("/assets/");

    // origin 一律用当前页面的 origin
    if (idx >= 0) {
      return window.location.origin + p.slice(0, idx + 1);
    }

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
    const a = list.querySelector(GLOBAL_LINK_SELECTOR);
    return a ? a.closest(".md-tabs__item") : null;
  }

  function removeCourseItem() {
    const old = document.getElementById(COURSE_ITEM_ID);
    if (old) old.remove();
  }

  function removeCustomItem() {
    const old = document.getElementById(CUSTOM_ITEM_ID);
    if (old) old.remove();
  }

  function createCourseItem(href) {
    const li = document.createElement("li");
    li.className = "md-tabs__item";
    li.id = COURSE_ITEM_ID;

    const a = document.createElement("a");
    a.className = "md-tabs__link";
    a.id = COURSE_LINK_ID;
    a.href = href;
    a.textContent = "Random in course";
    // 给 random.js 用：点击它要存 course scope
    a.setAttribute("data-random-scope", "course");

    li.appendChild(a);
    return li;
  }

  function createCustomItem() {
    const li = document.createElement("li");
    li.className = "md-tabs__item";
    li.id = CUSTOM_ITEM_ID;

    const a = document.createElement("a");
    a.className = "md-tabs__link";
    a.id = CUSTOM_LINK_ID;
    a.href = new URL("custom-random.html", getSiteRootUrl()).toString();
    a.textContent = "Custom random";

    li.appendChild(a);
    return li;
  }

  function setRightGroupStart(itemToStart) {
    const list = findTabsList();
    if (!list) return;

    // 清掉所有 random-right-start
    list.querySelectorAll(".md-tabs__item.random-right-start").forEach(el => {
      el.classList.remove("random-right-start");
    });

    if (itemToStart) itemToStart.classList.add("random-right-start");
  }

  function ensureCustomTab(globalItem) {
    const list = findTabsList();
    if (!list || !globalItem) return null;

    let customItem = document.getElementById(CUSTOM_ITEM_ID);
    if (!customItem) {
      customItem = createCustomItem();
      list.insertBefore(customItem, globalItem);
    }
    return customItem;
  }

  function ensureCourseTab(globalItem) {
    const list = findTabsList();
    if (!list || !globalItem) return { courseItem: null, courseScope: "" };

    const courseScope = getCourseScopeIfAny();

    if (!courseScope) {
      removeCourseItem();
      return { courseItem: null, courseScope: "" };
    }

    let courseItem = document.getElementById(COURSE_ITEM_ID);
    if (!courseItem) {
      const globalLink = globalItem.querySelector("a.md-tabs__link");
      const href = globalLink ? globalLink.getAttribute("href") : "random/";
      courseItem = createCourseItem(href);
      list.insertBefore(courseItem, globalItem);
    }
    return { courseItem, courseScope };
  }

  function ensureTabs() {
    const list = findTabsList();
    const globalItem = findGlobalRandomItem();
    if (!list || !globalItem) return;

    // 1) 全站都要有 custom random
    const customItem = ensureCustomTab(globalItem);

    // 2) 课程内才有 course random
    const { courseItem, courseScope } = ensureCourseTab(globalItem);

    // 3) 如果 courseItem 被新建，会插在 global 左边，但此时 custom 可能已经在 global 左边
    //    你要的顺序是：Custom random | Random in course | Random
    //    所以如果 course 存在且 custom 在 global 左边，就把 custom 移到 course 左边
    if (courseScope && courseItem && customItem) {
      // 如果 customItem 目前不在 courseItem 左边，强制放到 courseItem 左边
      if (customItem.nextSibling !== courseItem) {
        try {
          list.insertBefore(customItem, courseItem);
        } catch (_) {}
      }
    }

    // 4) 右侧组起点：customItem（最左边那个）
    setRightGroupStart(customItem || courseItem || globalItem);

    // 5) 非课程页：确保 courseItem 清理掉，但 custom 仍保留
    if (!courseScope) {
      removeCourseItem();
    }
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
s