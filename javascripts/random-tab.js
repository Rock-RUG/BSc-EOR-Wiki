// docs/javascripts/random.js
(function () {
  const STORAGE_SCOPE = "random_scope_v3";
  const STORAGE_LAST_NON_RANDOM = "random_last_non_random_v3";

  function isRandomLikePath(pathname) {
    return String(pathname || "").toLowerCase().includes("random");
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
    if (idx >= 0) {
      const rootPath = p.slice(0, idx + 1);
      return window.location.origin + rootPath;
    }


    const base = new URL(document.baseURI);
    if (!base.pathname.endsWith("/")) base.pathname += "/";
    return base.origin + base.pathname;
  }

  function relPathFromSiteRoot(absPathname) {
    const siteRoot = new URL(getSiteRootUrl());
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : siteRoot.pathname + "/";

    let p = String(absPathname || window.location.pathname);
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    p = p.replace(/^\/+/, "").replace(/\/+$/, "");
    return p;
  }

  function splitSegs(relPath) {
    return (relPath || "").split("/").filter(Boolean);
  }

  // 记录最后一个非 random 页面，避免你在 random 页里再次点 random 时失去上下文
  function rememberLastNonRandom() {
    const now = window.location.pathname;
    if (!isRandomLikePath(now)) {
      try {
        sessionStorage.setItem(STORAGE_LAST_NON_RANDOM, now);
      } catch (_) {}
    }
  }

  function readLastNonRandomPath() {
    try {
      return sessionStorage.getItem(STORAGE_LAST_NON_RANDOM) || "";
    } catch (_) {
      return "";
    }
  }

  // 从路径推断课程 scope：/<year>/<course>/...
  // 不在课程则返回空字符串（表示全站）
  function inferCourseScopeFromPath(absPathname) {
    const rel = relPathFromSiteRoot(absPathname);
    const segs = splitSegs(rel);

    // 如果是 random 页，用 last non random 来推断
    if (segs.length && isRandomLikePath(segs[segs.length - 1])) {
      const last = readLastNonRandomPath();
      if (last) return inferCourseScopeFromPath(last);
      return "";
    }

    // / 或 /index.html: 非课程
    if (segs.length < 2) return "";

    // /<year>/ 或 /<year>/index.html: year landing，不算课程
    if (segs.length === 1) return "";
    if (segs.length === 2 && segs[1].toLowerCase() === "index.html") return "";

    // 课程范围默认取前两段
    return `${segs[0]}/${segs[1]}/`;
  }

  function storeScope(scope) {
    try {
      sessionStorage.setItem(STORAGE_SCOPE, scope || "");
    } catch (_) {}
  }

  function readScope() {
    try {
      return sessionStorage.getItem(STORAGE_SCOPE) || "";
    } catch (_) {
      return "";
    }
  }

  async function loadSearchIndex() {
    const siteRoot = getSiteRootUrl();
    const url = new URL("search/search_index.json", siteRoot).toString();
    const res = await fetch(url);
    if (!res.ok) throw new Error("Cannot load search index at " + url);
    return await res.json();
  }

  // concept 页候选：至少 /year/course/page 这三段
  // 排除 random 自己
  function isConceptLocation(loc) {
    const s = String(loc || "");
    if (!s) return false;
    if (s.toLowerCase().includes("random")) return false;

    const clean = s.replace(/^\/+/, "").replace(/\/+$/, "");
    const segs = splitSegs(clean);
    return segs.length >= 3;
  }

  function pickRandomLocation(indexJson, scopePrefix) {
    const docs = indexJson && indexJson.docs ? indexJson.docs : [];
    const scope = String(scopePrefix || "").replace(/^\/+/, "");

    const candidates = docs
      .map(d => d && d.location)
      .filter(Boolean)
      .map(String)
      .filter(isConceptLocation)
      .filter(loc => {
        if (!scope) return true; // scope 为空表示全站
        const clean = loc.replace(/^\/+/, "");
        return clean.startsWith(scope);
      });

    if (!candidates.length) return null;
    const i = Math.floor(Math.random() * candidates.length);
    return candidates[i];
  }

  function toAbsoluteUrl(loc) {
    const siteRoot = getSiteRootUrl();
    const cleanLoc = String(loc).replace(/^\//, "");
    return new URL(cleanLoc, siteRoot).toString().split("#")[0] + "#top";
  }

  async function randomJump(scope) {
    const indexJson = await loadSearchIndex();
    const loc = pickRandomLocation(indexJson, scope || "");
    if (!loc) return;
    window.location.assign(toAbsoluteUrl(loc));
  }

  // 点击 Random 入口时，仅记录 scope，不拦截默认跳转
  // 规则：
  // - data-random-scope="course" 代表课程随机，scope 取当前课程
  // - 否则一律全站随机（scope 为空）
  function bindRandomScopeRecorder() {
    if (window.__randomScopeRecorderBoundV3) return;
    window.__randomScopeRecorderBoundV3 = true;

    document.addEventListener(
      "click",
      (ev) => {
        const a = ev.target && ev.target.closest ? ev.target.closest("a") : null;
        if (!a) return;

        const href = a.getAttribute("href") || "";
        if (!href) return;

        // 只处理指向 random 的链接
        if (!href.toLowerCase().includes("random")) return;

        const mode = a.getAttribute("data-random-scope") || "";

        if (mode === "course") {
          const courseScope = inferCourseScopeFromPath(window.location.pathname);
          storeScope(courseScope || "");
        } else {
          // Random page 一律全站随机
          storeScope("");
        }
      },
      true
    );
  }

  // 如果当前就是 random 页面，则根据 scope 自动跳转到随机 concept
  async function autoOnRandomPage() {
    if (!isRandomLikePath(window.location.pathname)) return;

    // 优先使用已经记录的 scope
    // 如果没有，就全站随机
    const scope = readScope() || "";

    try {
      await randomJump(scope);
    } catch (e) {
      console.warn("Random auto jump failed:", e);
    }
  }

  function init() {
    rememberLastNonRandom();
    bindRandomScopeRecorder();
    autoOnRandomPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);
})();
