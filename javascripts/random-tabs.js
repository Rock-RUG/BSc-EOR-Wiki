(function () {
  const COURSE_ITEM_ID = "course-random-item";
  const COURSE_LINK_ID = "course-random-link";
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

  function setRightGroupStart(itemToStart) {
    const list = findTabsList();
    if (!list) return;

    // 清掉所有 random-right-start
    list.querySelectorAll(".md-tabs__item.random-right-start").forEach(el => {
      el.classList.remove("random-right-start");
    });

    if (itemToStart) itemToStart.classList.add("random-right-start");
  }

  function ensureCourseTab() {
    const list = findTabsList();
    const globalItem = findGlobalRandomItem();
    if (!list || !globalItem) return;

    const courseScope = getCourseScopeIfAny();

    if (!courseScope) {
      // 不在课程：移除 course-random，且让 global random 成为右侧组起点
      removeCourseItem();
      setRightGroupStart(globalItem);
      return;
    }

    // 在课程：插入 course-random 到 global random 左侧
    let courseItem = document.getElementById(COURSE_ITEM_ID);
    if (!courseItem) {
      const globalLink = globalItem.querySelector("a.md-tabs__link");
      const href = globalLink ? globalLink.getAttribute("href") : "random/";
      courseItem = createCourseItem(href);
      list.insertBefore(courseItem, globalItem);
    }

    // 右侧组起点应是 courseItem（这样 course + global 都靠右）
    setRightGroupStart(courseItem);
  }

  function init() {
    ensureCourseTab();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // mkdocs-material instant navigation
  document.addEventListener("DOMContentSwitch", init);
})();
