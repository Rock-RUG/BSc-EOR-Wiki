(function () {
  const BAR_ID = "current-course-bar";

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
    const rootPath = siteRoot.pathname.endsWith("/") ? siteRoot.pathname : siteRoot.pathname + "/";

    let p = String(absPathname || window.location.pathname);
    if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    p = p.replace(/^\/+/, "").replace(/\/+$/, "");
    return p;
  }

  function splitSegs(relPath) {
    return (relPath || "").split("/").filter(Boolean);
  }

  function inferYearCourse() {
    const rel = relPathFromSiteRoot(window.location.pathname);
    const segs = splitSegs(rel);

    if (segs.length === 0) return { year: "", course: "" };
    if (segs.length === 1) return { year: segs[0], course: "" };
    if (segs.length === 2 && String(segs[1]).toLowerCase() === "index.html") {
      return { year: segs[0], course: "" };
    }
    return { year: segs[0], course: segs[1] };
  }

  function ensureBar() {
    const sidebar = document.querySelector(".md-sidebar--primary");
    if (!sidebar) return null;

    const scrollWrap =
      sidebar.querySelector(".md-sidebar__scrollwrap") ||
      sidebar.querySelector(".md-sidebar__inner") ||
      sidebar;

    let bar = scrollWrap.querySelector(`#${BAR_ID}`);
    if (!bar) {
      bar = document.createElement("div");
      bar.id = BAR_ID;
      bar.innerHTML = `
        <button type="button" class="ccb-btn" aria-label="Toggle current scope">
          <span class="ccb-title"></span>
          <span class="ccb-icon md-nav__icon md-icon" aria-hidden="true" data-md-icon="chevron-down"></span>
        </button>
      `;
      scrollWrap.prepend(bar);
    }
    return bar;
  }

  function normaliseHrefToRel(href) {
    if (!href) return "";
    try {
      const u = new URL(href, document.baseURI);
      return relPathFromSiteRoot(u.pathname);
    } catch (_) {
      return "";
    }
  }

  function findYearNodeByPath(yearSeg) {
    if (!yearSeg) return null;

    const root = getSiteRootUrl();
    const wantA = `${yearSeg}/`;
    const wantB = `${yearSeg}/index.html`;

    const links = Array.from(
      document.querySelectorAll(".md-sidebar--primary a.md-nav__link, .md-sidebar--primary label.md-nav__link")
    );

    for (const el of links) {
      const href = el.getAttribute && el.getAttribute("href");
      const rel = href ? normaliseHrefToRel(new URL(href, root).toString()) : "";
      if (rel === wantA || rel === wantB) {
        return el.closest(".md-nav__item") || null;
      }
    }
    return null;
  }

  // IMPORTANT: choose the NEAREST nested ancestor that represents the course container,
  // not the highest one (which tends to be the Year container).
  function findCourseNodeFromActive(activeLink, yearSeg, courseSeg) {
    if (!activeLink || !yearSeg || !courseSeg) return null;

    const prefix = `${yearSeg}/${courseSeg}/`;
    const item = activeLink.closest(".md-nav__item");
    if (!item) return null;

    let cur = item;
    while (cur) {
      if (cur.classList && cur.classList.contains("md-nav__item--nested")) {
        const anchors = Array.from(cur.querySelectorAll("a.md-nav__link[href]"));
        const ok = anchors.some(a => normaliseHrefToRel(a.getAttribute("href")).startsWith(prefix));
        if (ok) return cur; // nearest match wins
      }
      cur = cur.parentElement ? cur.parentElement.closest(".md-nav__item") : null;
    }

    // fallback: nearest nested ancestor at all
    cur = item;
    while (cur) {
      if (cur.classList && cur.classList.contains("md-nav__item--nested")) return cur;
      cur = cur.parentElement ? cur.parentElement.closest(".md-nav__item") : null;
    }
    return null;
  }

  function apply() {
    const bar = ensureBar();
    if (!bar) return;

    const btn = bar.querySelector(".ccb-btn");
    const titleSpan = bar.querySelector(".ccb-title");
    const iconSpan = bar.querySelector(".ccb-icon");

    const activeLink =
      document.querySelector(".md-sidebar--primary a.md-nav__link--active, .md-sidebar--primary a.md-nav__link[aria-current='page']") ||
      document.querySelector(".md-sidebar--primary .md-nav__link--active");

    if (!activeLink) {
      bar.style.display = "none";
      return;
    }

    const { year, course } = inferYearCourse();

    let scopeNode = null;
    let showArrow = false;

    if (!course) {
      scopeNode = findYearNodeByPath(year) || activeLink.closest(".md-nav__item");
      showArrow = false;
    } else {
      scopeNode = findCourseNodeFromActive(activeLink, year, course);
      showArrow = true;
    }

    if (!scopeNode) {
      bar.style.display = "none";
      return;
    }

    const titleEl =
      scopeNode.querySelector(":scope > .md-nav__link") ||
      scopeNode.querySelector(":scope > label.md-nav__link") ||
      scopeNode.querySelector(".md-nav__link");

    const titleText = titleEl ? titleEl.textContent.trim() : "";
    if (!titleText) {
      bar.style.display = "none";
      return;
    }

    titleSpan.textContent = titleText;
    bar.style.display = "";

    const toggle =
      scopeNode.querySelector(":scope > input.md-nav__toggle") ||
      scopeNode.querySelector("input.md-nav__toggle");

    if (!showArrow || !toggle) {
      iconSpan.style.display = "none";
      btn.onclick = null;
      return;
    }

    iconSpan.style.display = "";
    iconSpan.setAttribute("data-md-icon", "chevron-right");
iconSpan.classList.toggle("is-open", toggle.checked);

    btn.onclick = () => {
      // use click to trigger mkdocs-material internal handlers
      toggle.click();
      requestAnimationFrame(() => {
        iconSpan.setAttribute("data-md-icon", "chevron-right");
iconSpan.classList.toggle("is-open", toggle.checked);
      });
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("DOMContentSwitch", apply);
})();
