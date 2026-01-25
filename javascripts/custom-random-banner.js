// docs/javascripts/custom-random-banner.js
(function () {
  const CANDS_KEY = "random_custom_candidates_v1";
  const ENTRY_KEY = "random_custom_page_v1";

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

  function toAbsoluteUrl(loc) {
    const siteRoot = getSiteRootUrl();
    const cleanLoc = String(loc).replace(/^\//, "");
    return new URL(cleanLoc, siteRoot).toString().split("#")[0] + "#top";
  }

  function readCandidates() {
    try {
      const raw = sessionStorage.getItem(CANDS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [];
    } catch (_) {
      return [];
    }
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
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  function isOnCustomRandomPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/custom-random.html") || p.endsWith("custom-random.html");
  }

  function insertBanner(cands) {
    // Material 页面正文容器
    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return;

    // 避免重复注入
    if (document.getElementById("custom-random-banner")) return;

    const box = document.createElement("div");
    box.id = "custom-random-banner";
    box.className = "md-typeset";
    box.style.margin = "12px 0 18px 0";
    box.style.padding = "12px 14px";
    box.style.border = "1px solid var(--md-default-fg-color--lightest)";
    box.style.borderRadius = "12px";

    const count = cands.length;

    box.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between">
        <div style="min-width:220px">
          <strong>Custom random</strong>
          <span style="opacity:.75">(${count} page(s) in range)</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          <a id="cr-continue" class="md-button md-button--primary" href="#">Continue random</a>
          <a id="cr-change" class="md-button" href="#">Change range</a>
        </div>
      </div>
    `;

    // 插到标题后面更自然：如果有 h1，就插到 h1 后，否则插到最前
    const h1 = inner.querySelector("h1");
    if (h1 && h1.parentNode) {
      h1.insertAdjacentElement("afterend", box);
    } else {
      inner.insertAdjacentElement("afterbegin", box);
    }

    const btnContinue = document.getElementById("cr-continue");
    const btnChange = document.getElementById("cr-change");

    btnContinue.addEventListener("click", (e) => {
      e.preventDefault();
      const chosen = pickRandom(cands);
      if (!chosen) return;
      window.location.assign(toAbsoluteUrl(chosen));
    });

    btnChange.addEventListener("click", (e) => {
      e.preventDefault();
      const entry = readEntryUrl();
      if (entry) {
        window.location.assign(entry);
      } else {
        window.location.assign(new URL("custom-random.html", getSiteRootUrl()).toString());
      }
    });
  }

  function init() {
    if (isOnCustomRandomPage()) return;

    const cands = readCandidates();
    if (!cands.length) return;

    insertBanner(cands);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);
})();
