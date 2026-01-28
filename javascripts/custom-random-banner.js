// docs/javascripts/custom-random-banner.js
(function () {
  const CANDS_KEY = "random_custom_candidates_v1";
  const ENTRY_KEY = "random_custom_page_v1";
  const TOKENS_KEY = "random_custom_tokens_v1";
  const TOKENMAP_KEY = "random_custom_token_map_v1";

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
    return segs.length >= 3;
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
    if (document.getElementById("custom-random-banner")) return;

    const box = document.createElement("div");
    box.id = "custom-random-banner";
    box.className = "cr-banner";

    const count = cands.length;

    const tokenChips = tokens.length
      ? tokens
          .map((t) => {
            const isHit = matchedTokens.includes(t);
            return `<span class="cr-chip ${isHit ? "is-hit" : ""}">${escapeHtml(t)}${isHit ? " ✓" : ""}</span>`;
          })
          .join("")
      : `<span class="cr-muted">No tokens</span>`;

    const matchedText = matchedTokens.length
      ? `This page matches: <strong>${matchedTokens.map(escapeHtml).join(", ")}</strong>`
      : `This page does not match any token.`;

    box.innerHTML = `
      <div class="cr-row">
        <div class="cr-left">
          <div class="cr-title">
            <strong>Custom random</strong>
            <span class="cr-muted">(${count} page(s) in union)</span>
          </div>

          <div class="cr-chips">${tokenChips}</div>

          <div class="cr-note">${matchedText}</div>
        </div>

        <div class="cr-actions">
          <a id="cr-continue" class="md-button md-button--primary" href="#">Continue random</a>
          <a id="cr-change" class="md-button" href="#">Change range</a>
          <button id="cr-close" class="md-button" type="button">Hide</button>
        </div>
      </div>
    `;

    document.body.appendChild(box);

    // Continue random
    box.querySelector("#cr-continue").addEventListener("click", (e) => {
      e.preventDefault();
      const chosen = pickRandom(cands);
      if (!chosen) return;

      // 如果 self-test mode 是开着的，下一页也需要“导航票据”
      try {
        if (sessionStorage.getItem("random_review_mode_v1") === "1") {
          sessionStorage.setItem("random_review_nav_flag_v1", "1");
        }
      } catch (_) {}

      window.location.assign(toAbsoluteUrl(chosen));
    });

    // Change range
    box.querySelector("#cr-change").addEventListener("click", (e) => {
      e.preventDefault();
      const entry = readEntryUrl();
      if (entry) window.location.assign(entry);
      else window.location.assign(new URL("custom-random.html", getSiteRootUrl()).toString());
    });

    // Hide (only hides for this tab session)
    box.querySelector("#cr-close").addEventListener("click", () => {
      try {
        sessionStorage.setItem("random_custom_banner_hidden_v1", "1");
      } catch (_) {}
      box.remove();
    });
  }

  function isHidden() {
    try {
      return sessionStorage.getItem("random_custom_banner_hidden_v1") === "1";
    } catch (_) {
      return false;
    }
  }

  function init() {
    if (isOnCustomRandomPage()) return;

    const rel = currentRelPath();
    if (!isConceptPage(rel)) return;

    if (isHidden()) return;

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
