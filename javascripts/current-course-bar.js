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

  // Return { year, course } where course is "" when you're on a year landing.
  function inferYearCourse() {
    const rel = relPathFromSiteRoot(window.location.pathname);
    const segs = splitSegs(rel);

    // "/" or "index.html"
    if (segs.length === 0) return { year: "", course: "" };
    if (segs.length === 1) return { year: segs[0], course: "" };

    // "/<year>/index.html" counts as year landing
    if (segs.length === 2 && String(segs[1]).toLowerCase() === "index.html") {
      return { year: segs[0], course: "" };
    }

    // course scope uses first two segments
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

  function findYearTitleNode(yearSeg) {
    if (!yearSeg) return null;

    const root = getSiteRootUrl();
    const wantA = `${yearSeg}/`;
    const wantB = `${yearSeg}/index.html`;

    const links = Array.from(document.querySelectorAll(".md-sidebar--primary a.md-nav__link, .md-sidebar--primary label.md-nav__link"));
    for (const el of links) {
      const href = el.getAttribute && el.getAttribute("href");
      const rel = normaliseHrefToRel(href ? new URL(href, root).toString() : "");
      if (rel === wantA || rel === wantB) {
        return el.closest(".md-nav__item") || null;
      }
    }
    return null;
  }

  function findCourseNodeByPath(yearSeg, courseSeg) {
    if (!yearSeg || !courseSeg) return null;

    const root = getSiteRootUrl();
    const wantA = `${yearSeg}/${courseSeg}/`;
    const wantB = `${yearSeg}/${courseSeg}/index.html`;

    const links = Array.from(document.querySelectorAll(".md-sidebar--primary a.md-nav__link, .md-sidebar--primary label.md-nav__link"));

    // Prefer exact course landing link if possible
    let best = null;

    for (const el of links) {
      const href = el.getAttribute && el.getAttribute("href");
      if (!href) continue;

      const abs = new URL(href, root).toString();
      const rel = normaliseHrefToRel(abs);

      if (rel === wantA || rel === wantB) {
        best = el;
        break;
      }

      // fallback: anything that starts with year/course (rarely needed)
      if (!best && rel.startsWith(`${yearSeg}/${courseSeg}/`)) best = el;
    }

    if (!best) return null;

    // Course node should be the nested item containing the toggle
    const item = best.closest(".md-nav__item");
    if (!item) return null;

    // If this is not nested, walk up to nearest nested (course container)
    let node = item;
    while (node && !node.classList.contains("md-nav__item--nested")) {
      node = node.parentElement ? node.parentElement.closest(".md-nav__item") : null;
    }
    return node;
  }

  function apply() {
    const bar = ensureBar();
    if (!bar) return;

    const btn = bar.querySelector(".ccb-btn");
    const titleSpan = bar.querySelector(".ccb-title");
    const iconSpan = bar.querySelector(".ccb-icon");

    const activeLink = document.querySelector(".md-sidebar--primary .md-nav__link--active");
    if (!activeLink) {
      bar.style.display = "none";
      return;
    }

    const { year, course } = inferYearCourse();

    // Decide which node/title we show
    let scopeNode = null;
    let showArrow = false;

    if (!course) {
      // Year landing: show Year title, hide arrow
      scopeNode = findYearTitleNode(year) || activeLink.closest(".md-nav__item");
      showArrow = false;
    } else {
      // Course or course content: show Course title, show arrow (if toggle exists)
      scopeNode = findCourseNodeByPath(year, course);
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

    // Toggle belongs to the scope node (works for both year and course if nested)
    const toggle =
      scopeNode.querySelector(":scope > input.md-nav__toggle") ||
      scopeNode.querySelector("input.md-nav__toggle");

    // Year landing: no arrow at all
    if (!showArrow) {
      iconSpan.style.display = "none";
      btn.onclick = null;
      return;
    }

    // Course/content: only show arrow if there is a toggle to control
    if (!toggle) {
      iconSpan.style.display = "none";
      btn.onclick = null;
      return;
    }

    iconSpan.style.display = "";

    // Sync icon direction with open/closed
    const isOpen = !!toggle.checked;
    iconSpan.setAttribute("data-md-icon", isOpen ? "chevron-down" : "chevron-right");

    btn.onclick = () => {
      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event("change", { bubbles: true }));
      iconSpan.setAttribute("data-md-icon", toggle.checked ? "chevron-down" : "chevron-right");
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  document.addEventListener("DOMContentSwitch", apply);
})();
