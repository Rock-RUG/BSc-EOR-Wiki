// docs/javascripts/tag-search-links.js
(function () {
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

  // 只把“像 tag 的行内 code”变成链接
  // 规则：无空格，包含一个连字符，整体由字母数字和连字符组成，长度>=3
  function isTagLike(s) {
    const t = String(s || "").trim();
    if (t.length < 3) return false;
    if (t.includes(" ")) return false;
    if (!t.includes("-")) return false;
    if (!/^[a-z0-9-]+$/i.test(t)) return false;
    // 至少包含一个数字（避免把纯英文短词也误判成 tag）
    if (!/\d/.test(t)) return false;
    return true;
  }

  function ensureTagLinks() {
    const root = getSiteRootUrl();
    const container = document.querySelector(".md-content .md-content__inner");
    if (!container) return;

    // 选中行内 code，但排除代码块 pre 里的 code
    const codes = Array.from(container.querySelectorAll(".md-typeset code:not(pre code)"));
    if (!codes.length) return;

    codes.forEach((codeEl) => {
      // 已经被处理过/已经在链接里了，就跳过
      if (codeEl.dataset.tagLinked === "1") return;
      if (codeEl.closest("a")) return;

      const raw = (codeEl.textContent || "").trim();
      if (!isTagLike(raw)) return;

      const url = new URL("find.html", root);
      url.searchParams.set("q", raw);

      const a = document.createElement("a");
      a.className = "tag-search-link";
      a.href = url.toString();
      a.title = `Search: ${raw}`;

      // 用 code 原有的显示样式
      codeEl.dataset.tagLinked = "1";
      codeEl.parentNode.insertBefore(a, codeEl);
      a.appendChild(codeEl);
    });
  }

  function init() {
    ensureTagLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // mkdocs-material instant navigation
  document.addEventListener("DOMContentSwitch", init);
})();
