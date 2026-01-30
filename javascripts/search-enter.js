(function () {
  function getSiteRootUrl() {
    const path = location.pathname;
    return path.substring(0, path.lastIndexOf("/") + 1);
  }

  function unlockBeforeNavigate() {
    try {
      const toggle =
        document.querySelector('input.md-toggle[data-md-toggle="search"]') ||
        document.querySelector("#__search");
      if (toggle) toggle.checked = false;

      document.documentElement.removeAttribute("data-md-scrollfix");
      document.body.removeAttribute("data-md-scrollfix");

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

      document.documentElement.classList.remove("md-search--active");
      document.body.classList.remove("md-search--active");

      if (document.activeElement && document.activeElement.blur) {
        try { document.activeElement.blur(); } catch (_) {}
      }
    } catch (_) {}
  }

  function bind() {
    const input = document.querySelector('input[data-md-component="search-query"]');
    if (!input || input.dataset.enterBound) return;

    input.dataset.enterBound = "1";

    input.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;

      const q = input.value.trim();
      if (!q) return;

      e.preventDefault();

      unlockBeforeNavigate();

      const root = getSiteRootUrl();
      location.href = root + "find.html?token=" + encodeURIComponent(q);
    });
  }

  document.addEventListener("DOMContentLoaded", bind);
})();
