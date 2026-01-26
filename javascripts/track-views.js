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
  const p = String(rel || "").replace(/^\/+/, "");
  const low = p.toLowerCase();
  if (!low) return false;

  // 排除明显非内容页
  const bad = ["assets/", "search", "sitemap", "404", "random", "trending"];
  if (bad.some(x => low.includes(x))) return false;

  // 关键：排除所有目录 index（包括 Year-1/index.html）
  if (low === "index.html" || low.endsWith("/index.html")) return false;

  // 只统计 html 内容页
  if (!low.endsWith(".html")) return false;

  // 可选：排除目录/课程 landing 页（如果你的课程页不是 concept）
  // 例如 Year-1/1a-xxx/index.html 已被上面挡掉
const rel = relPath.replace(/^\//, "").toLowerCase();

// 排除 about / how-it-works（按你的实际路径改关键词）
if (
  rel.startsWith("about/") ||
  rel === "about.html" ||
  rel.startsWith("how-it-works/") ||
  rel === "how-it-works.html" ||
  rel.includes("about-this-wiki") // 保险：标题页/旧路径
) {
  return false;
}
  return true;
}


  function send(path, title) {
  const payload = JSON.stringify({ path, title });

  fetch(TRACK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  })
    .then(async (r) => {
      const t = await r.text().catch(() => "");
      console.log("[track] POST", r.status, t);
    })
    .catch((e) => console.error("[track] POST failed", e));
}


  function trackOncePerPage() {
  const rel = relPathFromSiteRoot(window.location.pathname);
  if (!isConceptRelPath(rel)) return;

  const key = "view_last_v1:" + rel;
  const now = Date.now();
  try {
    const last = Number(localStorage.getItem(key) || "0");
    if (now - last < 60_000) return; // 60 秒冷却
    localStorage.setItem(key, String(now));
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
  document.addEventListener("navigation:load", init);
})();
