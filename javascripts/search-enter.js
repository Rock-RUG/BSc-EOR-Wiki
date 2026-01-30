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

  function closeMaterialSearchOverlay() {
  const toggle =
    document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
    document.querySelector('input#__search');
  if (toggle) toggle.checked = false;

  const input = document.querySelector('input[data-md-component="search-query"]');
  if (input) input.blur();

  const resetBtn = document.querySelector('button[data-md-component="search-reset"]');
  if (resetBtn && resetBtn.click) resetBtn.click();

  // --- HARD unlock (iOS) ---
  // Material 有时会加 scrollfix 标记
  document.body.removeAttribute("data-md-scrollfix");
  document.documentElement.removeAttribute("data-md-scrollfix");

  // 清所有常见锁滚动相关 style
  document.documentElement.style.overflow = "";
  document.documentElement.style.position = "";
  document.documentElement.style.height = "";

  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.height = "";

  document.body.classList.remove("md-search--active");
  document.documentElement.classList.remove("md-search--active");

  if (document.activeElement && document.activeElement.blur) {
    try { document.activeElement.blur(); } catch (_) {}
  }
}





  function bind() {
    const input = document.querySelector('input[data-md-component="search-query"]');
    if (!input) return;

    if (input.dataset.enterBound === "1") return;
    input.dataset.enterBound = "1";

    input.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter") return;

      const q = (input.value || "").trim();
      if (!q) return;

      ev.preventDefault();
      ev.stopPropagation();

      // Close overlay before navigation so the new page is usable immediately
      closeMaterialSearchOverlay();

      const root = getSiteRootUrl();
      const url = new URL("find.html", root);
      url.searchParams.set("q", q);

      window.location.assign(url.toString());
    });
  }

  function init() {
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);
})();
