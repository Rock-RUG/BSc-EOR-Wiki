// docs/javascripts/search-enter.js
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

  // iOS: ensure we leave the Material search overlay in a fully unlocked state before navigation.
  function unlockMdSearchBeforeNavigate() {
    try {
      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector('input#__search') ||
        document.querySelector("#__search");
      if (toggle) toggle.checked = false;

      document.querySelectorAll('[data-md-scrollfix]').forEach(el => {
        el.removeAttribute('data-md-scrollfix');
      });
      document.body.removeAttribute("data-md-scrollfix");
      document.documentElement.removeAttribute("data-md-scrollfix");

      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.height = "";

      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.height = "";

      document.body.classList.remove("md-search--active");
      document.documentElement.classList.remove("md-search--active");

      const input = document.querySelector('input[data-md-component="search-query"]');
      if (input) input.blur();
      if (document.activeElement && document.activeElement.blur) {
        try { document.activeElement.blur(); } catch (_) {}
      }
    } catch (_) {}
  }

  function bind() {
    const input = document.querySelector('input[data-md-component="search-query"]');
    if (!input || input.dataset.enterBound) return;
    input.dataset.enterBound = "1";

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      const q = (input.value || "").trim();
      if (!q) return;

      e.preventDefault();

      unlockMdSearchBeforeNavigate();

      const root = getSiteRootUrl();
      try { sessionStorage.setItem('find_pending_token_v1', q); } catch (_) {}

      // Go to find.html like Custom Random does (no querystring), then auto-add token on the page.
      window.location.href = root + "find.html";
    });
  }

  document.addEventListener("DOMContentLoaded", bind);
})();
