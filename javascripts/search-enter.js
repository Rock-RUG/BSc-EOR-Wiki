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
    // mkdocs-material uses a checkbox toggle for search
    const toggle =
      document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
      document.querySelector('input#__search');

    if (toggle) toggle.checked = false;

    const input = document.querySelector('input[data-md-component="search-query"]');
    if (input) input.blur();

    // If there is a close/reset button, click it (extra safety)
    const closeBtn =
      document.querySelector('button[data-md-component="search-reset"]') ||
      document.querySelector(".md-search__icon[for='__search']");
    if (closeBtn && closeBtn.click) closeBtn.click();
  }
      // Hard unlock scroll (mobile Safari sometimes keeps it locked)
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.classList.remove("md-search--active");
    document.documentElement.classList.remove("md-search--active");


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
