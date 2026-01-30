// docs/javascripts/search-filter.js
(function () {
  function normaliseForSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")   // treat punctuation as separators (like Lunr)
      .replace(/\s+/g, " ")
      .trim();
  }

  function isToolOrMetaHref(href) {
  const h = stripHash(href).toLowerCase();
  const file = h.split("/").pop() || "";
  return (
    file === "find.html" ||
    file === "custom-random.html" ||
    file === "about-this-wiki.html" ||
    file === "about.html"
  );
}

  function tokens(q) {
    return normaliseForSearch(q).split(" ").filter(Boolean);
  }

  function stripHash(href) {
    return String(href || "").split("#")[0];
  }

  function getAnchor(href) {
    const parts = String(href || "").split("#");
    return (parts[1] || "").toLowerCase();
  }

  function isIndexHref(href) {
    const h = stripHash(href).toLowerCase();
    return h.endsWith("/index.html") || h.endsWith("index.html") || h.endsWith("/index/");
  }

  function isRandomHref(href) {
    const h = stripHash(href).toLowerCase();
    if (h.includes("/random/")) return true;
    const file = h.split("/").pop() || "";
    return /^random.*(\.html)?$/.test(file); // random, random.html, random-xxx.html
  }

  function isNoisySectionHref(href) {
    const a = getAnchor(href);
    // allow suffixes like prerequisites-1, related-concepts-2
    return a === "prerequisites" || a.startsWith("prerequisites-")
      || a === "related-concepts" || a.startsWith("related-concepts-");
  }

  function isSectionHref(href) {
    return String(href || "").includes("#");
  }

  // What we keep in the TOP overlay:
  // - hide index pages
  // - hide random pages
  // - hide ALL section hits (#...) (you wanted concept pages only)
  // - AND additionally make sure prerequisites/related-concepts section hits are hidden (explicit)
  function isKeepableResultHref(href) {
    if (isToolOrMetaHref(href)) return false;
    if (!href) return false;
    if (isIndexHref(href)) return false;
    if (isRandomHref(href)) return false;

    if (isSectionHref(href)) {
      // explicitly drop noisy sections (and in fact drop all sections)
      return false;
    }
    return true;
  }

  function filterOverlayResults() {
    const input = document.querySelector('input[data-md-component="search-query"]');
    const list = document.querySelector(".md-search-result__list");
    if (!input || !list) return;

    const q = (input.value || "").trim();
    const ts = tokens(q);

    const items = Array.from(list.querySelectorAll(".md-search-result__item"));
    if (!items.length) return;

    let visible = 0;

    items.forEach((item) => {
      const a = item.querySelector("a.md-search-result__link");
      const href = a ? a.getAttribute("href") : "";

      // 0) explicit noisy section removal (in case you later allow some # sections)
      if (isNoisySectionHref(href)) {
        item.style.display = "none";
        return;
      }

      // 1) keep only concept pages (no index, no random, no #section)
      if (!isKeepableResultHref(href)) {
        item.style.display = "none";
        return;
      }

      // 2) AND filter for multi-term queries (keep your current behaviour)
      if (ts.length >= 2) {
        const hay = normaliseForSearch(item.textContent);
        const ok = ts.every(t => hay.includes(t));
        if (!ok) {
          item.style.display = "none";
          return;
        }
      }

      item.style.display = "";
      visible += 1;
    });

    // Update meta count to reflect filtered count
    const meta = document.querySelector(".md-search-result__meta");
    if (meta && visible >= 0) {
      meta.textContent = `${visible} matching documents`;
    }
  }

  function initObserver() {
    if (window.__mdSearchFilterObserver) return;

    const obs = new MutationObserver(() => {
      window.clearTimeout(window.__mdSearchFilterTimer);
      window.__mdSearchFilterTimer = window.setTimeout(filterOverlayResults, 30);
    });

    obs.observe(document.body, { childList: true, subtree: true });
    window.__mdSearchFilterObserver = obs;

    document.addEventListener(
      "input",
      (e) => {
        const t = e.target;
        if (t && t.matches && t.matches('input[data-md-component="search-query"]')) {
          filterOverlayResults();
        }
      },
      true
    );

    filterOverlayResults();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initObserver);
  } else {
    initObserver();
  }

  document.addEventListener("DOMContentSwitch", initObserver);
})();
