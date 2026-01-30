// docs/javascripts/custom-random-banner.js
(function () {
  const CANDS_KEY = "random_custom_candidates_v1";
  const ENTRY_KEY = "random_custom_page_v1";
  const TOKENS_KEY = "random_custom_tokens_v1";
  const TOKENMAP_KEY = "random_custom_token_map_v1";

  // 新增：只在 Start random / Continue random 导航时出现 banner 的一次性标记
  const NAV_FLAG_KEY = "random_custom_nav_flag_v1";

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

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function toAbsoluteUrl(loc) {
    const siteRoot = getSiteRootUrl();
    const cleanLoc = String(loc).replace(/^\//, "");
    return new URL(cleanLoc, siteRoot).toString().split("#")[0] + "#top";
  }

  function readJson(key, fallback) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return fallback;
      const v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (_) {
      return fallback;
    }
  }

  function readCandidates() {
    const arr = readJson(CANDS_KEY, []);
    return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [];
  }

  function readTokens() {
    const arr = readJson(TOKENS_KEY, []);
    return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [];
  }

  function readTokenMap() {
    const obj = readJson(TOKENMAP_KEY, {});
    return obj && typeof obj === "object" ? obj : {};
  }

  function readEntryUrl() {
    try {
      return sessionStorage.getItem(ENTRY_KEY) || "";
    } catch (_) {
      return "";
    }
  }

  function pickRandom(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function isOnCustomRandomPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/custom-random.html") || p.endsWith("custom-random.html");
  }

  // 本次页面是否由 Start/Continue random 导航而来
  function consumeNavFlag() {
    try {
      const v = sessionStorage.getItem(NAV_FLAG_KEY);
      if (v !== "1") return false;
      sessionStorage.removeItem(NAV_FLAG_KEY);
      return true;
    } catch (_) {
      return false;
    }
  }

  // 把当前 pathname 转成相对 site root 的路径（不带开头 /）
  function currentRelPath() {
    const siteRoot = new URL(getSiteRootUrl());
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : (siteRoot.pathname + "/");

    let p = String(window.location.pathname || "");
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    return p.replace(/^\/+/, "");
  }

function isConceptPage(relPath) {
  const p = String(relPath || "").toLowerCase();
  if (p === "" || p === "index.html" || p.endsWith("/index.html")) return false;

  const segs = String(relPath || "").split("/").filter(Boolean);
  // 原来 >=3 太严格，改成 >=2
  return segs.length >= 2;
}


  function computeMatchedTokens(tokens, tokenMap, currentLocRel) {
    const matched = [];
    for (const t of tokens) {
      const list = tokenMap[t];
      if (Array.isArray(list) && list.includes(currentLocRel)) matched.push(t);
    }
    return matched;
  }

  function insertBanner(cands, tokens, matchedTokens) {
    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;

    if (document.getElementById("custom-random-banner")) return;

    const box = document.createElement("div");
    box.id = "custom-random-banner";
    box.className = "md-typeset";
    box.style.margin = "12px 0 18px 0";
    box.style.padding = "12px 14px";
    box.style.border = "1px solid var(--md-default-fg-color--lightest)";
    box.style.borderRadius = "12px";
    box.style.background =
  "linear-gradient(135deg, rgba(63,81,181,.12), rgba(63,81,181,.05))";

    const count = cands.length;

    const tokenChips = tokens.length
      ? tokens
          .map((t) => {
            const isHit = matchedTokens.includes(t);
            return `<span style="display:inline-flex;align-items:center;margin:2px 6px 2px 0;padding:3px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);${
              isHit ? "font-weight:700" : "opacity:.85"
            }">${escapeHtml(t)}${isHit ? " ✓" : ""}</span>`;
          })
          .join("")
      : `<span style="opacity:.75">No tokens</span>`;

    const matchedText = matchedTokens.length
      ? `This page matches: <strong>${matchedTokens.map(escapeHtml).join(", ")}</strong>`
      : `This page doesn't match any token (possible if you opened it manually).`;

    box.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;justify-content:space-between">
        <div style="min-width:240px">
          <div>
            <strong>Custom random</strong>
<span style="opacity:.75">(${count} page(s) in the random pool)</span>
          </div>
          <div style="margin-top:8px">
            ${tokenChips}
          </div>
          <div style="margin-top:8px;opacity:.85">
            ${matchedText}
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
  <a id="cr-continue" class="md-button md-button--primary" href="#">Continue random</a>
  <a id="cr-view" class="md-button" href="#">View this page</a>
  <a id="cr-change" class="md-button" href="#">Edit filter</a>
</div>
      </div>
    `;

    const h1 = inner.querySelector("h1");
    if (h1 && h1.parentNode) h1.insertAdjacentElement("afterend", box);
    else inner.insertAdjacentElement("afterbegin", box);

    document.getElementById("cr-continue").addEventListener("click", (e) => {
  e.preventDefault();
  const chosen = pickRandom(cands);
  if (!chosen) return;

  // 关键：让下一页也显示 custom random banner
  try { sessionStorage.setItem(NAV_FLAG_KEY, "1"); } catch (_) {}

  // 如果你还需要 review 的逻辑，保留也行（不冲突）
  try {
    if (sessionStorage.getItem("random_review_mode_v1") === "1") {
      sessionStorage.setItem("random_review_nav_flag_v1", "1");
    }
  } catch (_) {}



  window.location.assign(toAbsoluteUrl(chosen));
});

document.getElementById("cr-view").addEventListener("click", (e) => {
  e.preventDefault();
  try {
    // 临时展开当前页（仅一次）
    sessionStorage.setItem("random_unfold_once_v1", "1");
    // 确保 self-test 模式是开启的（否则 fold/unfold 没意义）
    sessionStorage.setItem("random_review_mode_v1", "1");
  } catch (_) {}
  window.location.reload();
});

    document.getElementById("cr-change").addEventListener("click", (e) => {
      e.preventDefault();
      const entry = readEntryUrl();
      if (entry) window.location.assign(entry);
      else window.location.assign(new URL("custom-random.html", getSiteRootUrl()).toString());
    });
  }

  function init() {
    if (isOnCustomRandomPage()) return;

    // 关键：不是从 Start/Continue random 导航而来，就不显示 banner
    if (!consumeNavFlag()) return;

    const rel = currentRelPath();
    if (!isConceptPage(rel)) return;

    const cands = readCandidates();
    if (!cands.length) return;

    const tokens = readTokens();
    const tokenMap = readTokenMap();
    const matchedTokens = computeMatchedTokens(tokens, tokenMap, rel);

    insertBanner(cands, tokens, matchedTokens);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);
})();
