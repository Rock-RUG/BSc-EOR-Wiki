(function () {
  const TRACK_ENDPOINT = "https://mkdocs-hot.eorwikihot.workers.dev/track";

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
    return p.replace(/^\/+/, "");
  }

  function isConceptRelPath(rel) {
  const low = String(rel || "").toLowerCase();
  if (!low) return false;

  // 不统计这些页面
  if (low.includes("random")) return false;
  if (low === "trending" || low.startsWith("trending/")) return false;

  // 首页也不统计（按需）
  if (low === "" || low === "index.html") return false;

  // 其余一律统计（先把数据跑起来）
  return true;
}

  function send(path, title) {
    const payload = JSON.stringify({ path, title });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          TRACK_ENDPOINT,
          new Blob([payload], { type: "application/json" })
        );
        return;
      }
    } catch (_) {}

    fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  function trackOncePerPage() {
    const rel = relPathFromSiteRoot(window.location.pathname);
    if (!isConceptRelPath(rel)) return;

    const key = "view_tracked_v1:" + rel;
    try {
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
    } catch (_) {}

    send(rel, document.title || "");
  }

  function init() {
    console.log("[track] init fired", window.location.pathname);
    console.log("[track] href", location.href);
    console.log("[track] relPath", relPathFromSiteRoot(location.pathname));
    console.log("[track] isConcept?", isConceptRelPath(relPathFromSiteRoot(location.pathname)));
    console.log("[track] endpoint", TRACK_ENDPOINT);
    trackOncePerPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // material instant navigation 时触发
  document.addEventListener("DOMContentSwitch", init);
})();
