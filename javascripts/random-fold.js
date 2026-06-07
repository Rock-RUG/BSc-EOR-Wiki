// docs/javascripts/random-fold.js
(function () {
  const MODE_FLAG = "random_review_mode_v1";
  const REVIEW_NAV_FLAG = "random_review_nav_flag_v1";
  const STOP_SEL = '[data-rf-stop="1"], .rf-stop';

  let rfUserScrolled = false;

  function markUserScrolled() {
    try {
      if ((window.scrollY || window.pageYOffset || 0) > 8) rfUserScrolled = true;
    } catch (_) {}
  }

  try {
    window.addEventListener("scroll", markUserScrolled, { passive: true, capture: true });
    window.addEventListener("wheel", markUserScrolled, { passive: true, capture: true });
    window.addEventListener("touchmove", markUserScrolled, { passive: true, capture: true });
  } catch (_) {}

  function currentPageKey() {
    return String(window.location.pathname || "") + String(window.location.search || "");
  }

  function currentScrollY() {
    try { return window.scrollY || window.pageYOffset || 0; } catch (_) { return 0; }
  }

  function shouldAvoidLateCollapse() {
    return rfUserScrolled || currentScrollY() > 8;
  }

  function preserveScrollDuring(fn) {
    const x = (() => { try { return window.scrollX || window.pageXOffset || 0; } catch (_) { return 0; } })();
    const y = currentScrollY();
    let out;
    try {
      const root = document.documentElement;
      if (root && root.style) root.style.setProperty("overflow-anchor", "none");
    } catch (_) {}

    try { out = fn(); } catch (err) { throw err; }

    if (y > 8) {
      const restore = () => {
        try {
          const maxY = Math.max(0, (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0));
          window.scrollTo(x, Math.min(y, maxY));
        } catch (_) {}
      };
      restore();
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });
    }

    window.setTimeout(() => {
      try {
        const root = document.documentElement;
        if (root && root.style) root.style.removeProperty("overflow-anchor");
      } catch (_) {}
    }, 120);

    return out;
  }

  function isConceptPage() {
    const p = String(window.location.pathname || "")
      .replace(/^\/+/, "")
      .toLowerCase();
    if (!p) return false;
    if (p.endsWith("index.html")) return false;

    const segs = p.split("/").filter(Boolean);
    if (segs.length < 3) return false;

    const file = segs[segs.length - 1] || "";
    if (!file.endsWith(".html")) return false;
    if (file === "find.html" || file === "custom-random.html") return false;

    return true;
  }

  function isModeOn() {
    try {
      return sessionStorage.getItem(MODE_FLAG) === "1";
    } catch (_) {
      return false;
    }
  }

  // If there is no one-time nav ticket, disable mode to keep default off.
  function consumeReviewNavFlagOrDisableMode() {
    try {
      const v = sessionStorage.getItem(REVIEW_NAV_FLAG);
      if (v === "1") {
        sessionStorage.removeItem(REVIEW_NAV_FLAG);
        return true;
      }
      sessionStorage.removeItem(MODE_FLAG);
      return false;
    } catch (_) {
      return false;
    }
  }

  function foldMarker() {
    return document.querySelector('[data-rf-fold="h2"], .rf-fold-h2');
  }

  function wantsFoldH2Page() {
    // Opt-in marker for index/home/course/year pages.
    return !!foldMarker();
  }

  function wantsFoldH2ClosedByDefault() {
    const marker = foldMarker();
    if (!marker) return false;

    // New safer default: generic fold pages stay open unless explicitly requested.
    // This prevents late H2 collapsing from shrinking the page and forcing scrollY back to 0.
    try {
      const explicit = String(marker.getAttribute("data-rf-default") || marker.getAttribute("data-rf-initial") || "").toLowerCase().trim();
      if (["closed", "collapse", "collapsed", "hide", "hidden"].includes(explicit)) return true;
      if (["open", "expanded", "show", "shown"].includes(explicit)) return false;
      if (marker.classList && (marker.classList.contains("rf-fold-closed") || marker.classList.contains("rf-default-closed"))) return true;
    } catch (_) {}

    return false;
  }

  function setOpen(sec, open) {
    if (!sec || !sec.body || !sec.h2) return;
    sec.body.hidden = !open;
    sec.h2.classList.toggle("rf-open", !!open);
    try { sec.h2.setAttribute("aria-expanded", open ? "true" : "false"); } catch (_) {}
  }

  function readExistingSections(inner) {
    if (!inner) return [];
    const out = [];
    const h2s = Array.from(inner.querySelectorAll(":scope > h2.rf-h2[data-rf-body]"));
    for (const h2 of h2s) {
      const id = h2.getAttribute("data-rf-body") || "";
      const body = id ? document.getElementById(id) : null;
      if (body && body.classList && body.classList.contains("rf-body")) out.push({ h2, body });
    }
    return out;
  }

  // Wrap each top-level H2's following content into a div, and hide/show that div.
  // Stop folding when a STOP marker is encountered, so the rest stays visible.
  function collectSections(inner) {
    if (!inner) return [];
    if (inner.getAttribute("data-rf-done") === "1") return readExistingSections(inner);
    inner.setAttribute("data-rf-done", "1");
    inner.setAttribute("data-rf-page-key", currentPageKey());

    const h2s = Array.from(inner.querySelectorAll(":scope > h2"));
    if (!h2s.length) return [];

    const sections = [];

    for (let i = 0; i < h2s.length; i++) {
      const h2 = h2s[i];
      if (!h2 || !h2.parentNode || h2.parentNode !== inner) continue;

      const body = document.createElement("div");
      body.className = "rf-body";

      const base = (h2.id || `sec-${i + 1}`).toLowerCase();
      const safe = base.replace(/[^a-z0-9_-]+/g, "-");
      body.id = `rf-body-${safe}`;

      h2.classList.add("rf-h2");
      h2.setAttribute("data-rf-body", body.id);

      // Move everything until next top-level H2, or STOP marker, into body.
      let node = h2.nextSibling;
      const toMove = [];
      while (node) {
        const next = node.nextSibling;

        if (node.nodeType === 1) {
          // stop marker means: keep the rest outside folding
          if (node.matches && node.matches(STOP_SEL)) break;
          if (node.tagName === "H2") break;
        }

        toMove.push(node);
        node = next;
      }

      inner.insertBefore(body, node || null);
      for (const n of toMove) body.appendChild(n);

      sections.push({ h2, body });

      // If a STOP marker is right after this section, do not create more sections.
      if (node && node.nodeType === 1 && node.matches && node.matches(STOP_SEL)) {
        break;
      }
    }

    return sections;
  }

  function openSectionForHash(sections) {
    const hash = String(window.location.hash || "").replace(/^#/, "");
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    for (const sec of sections) {
      if (sec.h2 && sec.h2.id === hash) {
        setOpen(sec, true);
        return;
      }
      if (sec.body && sec.body.contains(target)) {
        setOpen(sec, true);
        return;
      }
    }
  }

  function addControlBar(inner, sections) {
    return function updateLabel() {
      return;
    };
  }

  function enableHeadingToggles(sections, onChange) {
    for (const sec of sections) {
      if (!sec || !sec.h2 || !sec.body) continue;
      if (sec.h2.getAttribute("data-rf-bound") === "1") continue;
      sec.h2.setAttribute("data-rf-bound", "1");
      sec.h2.setAttribute("role", "button");
      sec.h2.setAttribute("tabindex", "0");
      sec.h2.setAttribute("aria-controls", sec.body.id || "");
      sec.h2.setAttribute("aria-expanded", sec.body.hidden ? "false" : "true");

      sec.h2.addEventListener("click", (e) => {
        const a = e.target && e.target.closest ? e.target.closest("a") : null;
        if (a) return;
        preserveScrollDuring(() => setOpen(sec, sec.body.hidden));
        if (onChange) onChange();
      });

      sec.h2.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          preserveScrollDuring(() => setOpen(sec, sec.body.hidden));
          if (onChange) onChange();
        }
      });
    }
  }

  function initSelfTestConceptPage() {
    if (!isConceptPage()) return false;
    if (!isModeOn()) return false;

    if (!consumeReviewNavFlagOrDisableMode()) return false;

    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return true;

    const sections = preserveScrollDuring(() => collectSections(inner));
    if (!sections.length) return true;

    try {
      document.body.classList.add("rf-selftest");
    } catch (_) {}

    // Self-test pages should start folded, but never collapse late after the user has already scrolled.
    const collapseNow = !shouldAvoidLateCollapse();
    preserveScrollDuring(() => {
      for (const s of sections) setOpen(s, collapseNow ? false : true);
      openSectionForHash(sections);
    });

    const updateLabel = addControlBar(inner, sections);
    enableHeadingToggles(sections, updateLabel);

    if (updateLabel) updateLabel();
    return true;
  }

  function initFoldH2Page() {
    if (!wantsFoldH2Page()) return false;

    const inner = document.querySelector("article.md-content__inner");
    if (!inner) return true;

    // If this script is somehow triggered after the user has started scrolling,
    // do not restructure and collapse the page. That late collapse is what can
    // shrink the document and look like an automatic jump back to the top.
    if (shouldAvoidLateCollapse() && inner.getAttribute("data-rf-done") !== "1") {
      try {
        document.body.classList.add("rf-foldpage");
        document.body.classList.add("rf-selftest");
      } catch (_) {}
      return true;
    }

    const sections = preserveScrollDuring(() => collectSections(inner));
    if (!sections.length) return true;

    try {
      document.body.classList.add("rf-foldpage");
      document.body.classList.add("rf-selftest"); // reuse existing rf-h2 styles
    } catch (_) {}

    const defaultClosed = wantsFoldH2ClosedByDefault();
    const collapseNow = defaultClosed && !shouldAvoidLateCollapse();

    preserveScrollDuring(() => {
      for (const s of sections) setOpen(s, collapseNow ? false : true);
      openSectionForHash(sections);
    });

    enableHeadingToggles(sections, null);
    return true;
  }

  function init() {
    markUserScrolled();
    const didSelfTest = initSelfTestConceptPage();
    if (didSelfTest) return;

    initFoldH2Page();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", init);
})();

/*
 * Year course flyout v4
 * - adds a right-side course menu for Year 1 and Year 2
 * - keeps Year 1 and Year 2 clickable
 * - keeps the parent Year dropdown open because the flyout is inserted inside the hovered menu item
 * - never shows concept titles in this flyout
 */
(function () {
  const DONE = "data-rf-year-course-trigger-v4";
  const CSS_ID = "rf-year-course-popover-css-v4";
  const PANEL_ID = "rf-year-course-popover-v4";
  const HOST_CLASS = "rf-year-course-host-v4";
  const LOCK_CLASS = "rf-year-menu-lock-v4";
  const MAX = 12;

  const cache = Object.create(null);
  const lockedEls = new Set();

  let activeLink = null;
  let activeHost = null;
  let hideTimer = 0;
  let panel = null;

  const COURSE_TITLES = {
    "Year 1": [
      "Introduction to Data Analytics",
      "Math I: Calculus",
      "OR Modelling",
      "Math II: Linear Algebra",
      "Probability Theory for EOR",
      "Programming for EOR",
      "Finance for EOR",
      "Math III: Analysis",
      "Microeconomics for EOR",
      "Math IV: Multivariate Calculus",
      "Probability Distributions",
      "Statistical Modelling for EOR"
    ],
    "Year 2": [
      "Macroeconomics for EOR",
      "Math V Advanced Linear Algebra",
      "Statistical Inference",
      "Linear Models in Statistics",
      "Math VI Convexity and Optimization",
      "Stochastic Operations Research",
      "Discrete Operations Research",
      "Introduction to Econometrics",
      "Life Insurance",
      "Dynamic Econometrics",
      "Game Theory",
      "Risk Insurance"
    ]
  };

  function cleanText(s) {
    return String(s || "")
      .replace(/[›»→▸▻▶▲△⌃⌄⌵^]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normaliseTitle(s) {
    return cleanText(s)
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function yearSlug(label) {
    return label === "Year 1" ? "year-1" : label === "Year 2" ? "year-2" : "";
  }

  function isYearLabel(label) {
    return label === "Year 1" || label === "Year 2";
  }

  function isUsablePageHref(href) {
    try {
      const u = new URL(href, window.location.href);
      if (u.origin !== window.location.origin) return false;
      const raw = String(href || "");
      if (!raw || raw === "#") return false;
      const p = String(u.pathname || "").toLowerCase();
      if (/\.(png|jpe?g|gif|webp|svg|pdf|zip|css|js|json|xml|ico|txt|csv|xlsx?|docx?|pptx?)$/i.test(p)) return false;
      if (p.includes("/assets/") || p.includes("/javascripts/") || p.includes("/stylesheets/")) return false;
      return true;
    } catch (_) {
      return false;
    }
  }

  function canonicalPath(url) {
    try {
      const u = new URL(url, window.location.href);
      let p = decodeURIComponent(u.pathname || "/");
      p = p.replace(/\/index\.html$/i, "/");
      return p.replace(/\/+$/, "/");
    } catch (_) {
      return String(url || "").split("#")[0].split("?")[0];
    }
  }

  function findSiteBaseFromCurrentPath() {
    try {
      const p = window.location.pathname || "/";
      const m = p.match(/^(.*\/)(year-[12])(?:\/|$)/i);
      if (m) return m[1];
      if (p.endsWith("/")) return p;
      return p.replace(/\/[^/]*$/, "/");
    } catch (_) {
      return "/";
    }
  }

  function findYearHrefInDocument(label) {
    const slug = yearSlug(label);
    if (!slug) return "";
    const anchors = Array.from(document.querySelectorAll("a[href]"));

    for (const a of anchors) {
      const txt = cleanText(a.textContent || a.getAttribute("title") || "");
      if (txt === label && isUsablePageHref(a.href)) return a.href;
    }

    for (const a of anchors) {
      if (!isUsablePageHref(a.href)) continue;
      const p = canonicalPath(a.href).toLowerCase();
      if (p.includes("/" + slug + "/") || p.endsWith("/" + slug + "/")) return a.href;
    }

    try {
      return new URL(findSiteBaseFromCurrentPath() + slug + "/", window.location.origin).href;
    } catch (_) {
      return new URL(slug + "/", window.location.href).href;
    }
  }

  function stableYearHref(link, label) {
    const slug = yearSlug(label);
    let href = link && link.href ? link.href : "";

    try {
      const u = new URL(href || "", window.location.href);
      const p = String(u.pathname || "").toLowerCase();
      const raw = String(link && link.getAttribute ? link.getAttribute("href") || "" : "");
      if (raw && raw !== "#" && (p.includes("/" + slug + "/") || p.endsWith("/" + slug + "/"))) return u.href;
    } catch (_) {}

    const found = findYearHrefInDocument(label);
    if (found) return found;

    try {
      return new URL(findSiteBaseFromCurrentPath() + slug + "/", window.location.origin).href;
    } catch (_) {
      return href || window.location.href;
    }
  }

  function slugifyCourseTitle(title) {
    return normaliseTitle(title).replace(/\s+/g, "-");
  }

  function fallbackCourseHref(yearHref, title) {
    try {
      return new URL(slugifyCourseTitle(title) + "/", yearHref).href;
    } catch (_) {
      return yearHref || window.location.href;
    }
  }

  function candidateText(a) {
    return [
      a.textContent || "",
      a.getAttribute("aria-label") || "",
      a.getAttribute("title") || ""
    ].join(" ");
  }

  function textMatchesTitle(text, wantedTitle) {
    const a = normaliseTitle(text);
    const w = normaliseTitle(wantedTitle);
    if (!a || !w) return false;
    return a === w || a.includes(w) || w.includes(a);
  }

  function courseYearScore(href, yearHref, yearLabel) {
    let score = 1000;
    try {
      const p = canonicalPath(href).toLowerCase();
      const yp = canonicalPath(yearHref).toLowerCase();
      const slug = yearSlug(yearLabel);

      if (p === yp) score += 500;
      if (slug && (p.includes("/" + slug + "/") || p.endsWith("/" + slug + "/"))) score -= 400;
      if (p.includes("/concept") || p.includes("/concepts") || p.includes("/assets")) score += 300;

      const rel = p.replace(yp, "").replace(/^\/+|\/+$/g, "");
      const depth = rel ? rel.split("/").filter(Boolean).length : 0;
      score += depth * 12;
    } catch (_) {}
    return score;
  }

  function findCourseHrefInDoc(doc, yearHref, yearLabel, title) {
    if (!doc || !doc.querySelectorAll) return "";
    const anchors = Array.from(doc.querySelectorAll("a[href]")).filter((a) => {
      const href = a.href || a.getAttribute("href") || "";
      if (!isUsablePageHref(href)) return false;
      if (!textMatchesTitle(candidateText(a), title)) return false;
      if (a.closest && a.closest(".headerlink, .md-content__button, .md-footer, .md-source-file")) return false;
      return true;
    });

    if (!anchors.length) return "";
    anchors.sort((a, b) => {
      const ah = new URL(a.getAttribute("href") || a.href, yearHref).href;
      const bh = new URL(b.getAttribute("href") || b.href, yearHref).href;
      return courseYearScore(ah, yearHref, yearLabel) - courseYearScore(bh, yearHref, yearLabel);
    });

    try {
      return new URL(anchors[0].getAttribute("href") || anchors[0].href, yearHref).href;
    } catch (_) {
      return anchors[0].href || "";
    }
  }

  function baseCourses(yearHref, yearLabel) {
    const titles = COURSE_TITLES[yearLabel] || [];
    return titles.slice(0, MAX).map((title) => ({
      title,
      href: fallbackCourseHref(yearHref, title)
    }));
  }

  async function loadCourses(yearHref, yearLabel) {
    const key = canonicalPath(yearHref) + "|" + yearLabel;
    if (cache[key]) return cache[key];

    cache[key] = (async () => {
      const courses = baseCourses(yearHref, yearLabel);
      let fetchedDoc = null;

      try {
        const res = await fetch(yearHref, { credentials: "same-origin" });
        if (res && res.ok) {
          const html = await res.text();
          fetchedDoc = new DOMParser().parseFromString(html, "text/html");
        }
      } catch (_) {}

      for (const course of courses) {
        const fromFetched = findCourseHrefInDoc(fetchedDoc, yearHref, yearLabel, course.title);
        const fromCurrent = findCourseHrefInDoc(document, yearHref, yearLabel, course.title);
        course.href = fromFetched || fromCurrent || course.href;
      }

      return courses;
    })();

    return cache[key];
  }

  function isLikelyTopYearLink(a) {
    if (!a || !a.closest) return false;
    const label = cleanText(a.textContent || "");
    if (!isYearLabel(label)) return false;
    if (!a.href) return false;

    if (a.closest(".md-sidebar, .md-nav--primary, .md-nav--secondary, .md-footer, article.md-content__inner, main.md-main")) return false;
    if (a.closest(".md-header, .md-tabs")) return true;

    try {
      const r = a.getBoundingClientRect();
      if (r && r.top >= 0 && r.top < 180) return true;
    } catch (_) {}

    return false;
  }

  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    const style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = `
      a.rf-year-course-trigger-v4 {
        position: relative;
      }

      a.rf-year-course-trigger-v4 .rf-year-course-arrow-v4 {
        display: inline-block;
        margin-left: .45rem;
        opacity: .72;
        line-height: 1;
        transform: translateY(.02em);
        pointer-events: none;
      }

      a.rf-year-course-trigger-v4:hover .rf-year-course-arrow-v4,
      a.rf-year-course-trigger-v4:focus .rf-year-course-arrow-v4 {
        opacity: 1;
      }

      .${HOST_CLASS},
      .${LOCK_CLASS} {
        overflow: visible !important;
      }

      .${LOCK_CLASS},
      .${LOCK_CLASS} > ul,
      .${LOCK_CLASS} > div,
      .${LOCK_CLASS} [class*="dropdown"],
      .${LOCK_CLASS} [class*="menu"],
      .${LOCK_CLASS} .md-nav,
      .${LOCK_CLASS} .md-tabs__dropdown {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }

      .${LOCK_CLASS} > ul,
      .${LOCK_CLASS} [class*="dropdown"],
      .${LOCK_CLASS} .md-tabs__dropdown {
        display: block !important;
      }

      #${PANEL_ID} {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10000;
        width: 18.5rem;
        max-width: min(30rem, calc(100vw - 1rem));
        max-height: min(34rem, calc(100vh - 1rem));
        overflow: auto;
        padding: .65rem;
        border: 1px solid rgba(0, 0, 0, .10);
        border-radius: .85rem;
        background: var(--md-default-bg-color, #fff);
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: 0 1.1rem 2.4rem rgba(0, 0, 0, .18);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translate(-9999px, -9999px);
        transition: opacity .12s ease, visibility .12s ease;
      }

      #${PANEL_ID}.rf-year-course-popover-open-v4 {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      #${PANEL_ID} ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      #${PANEL_ID} a,
      #${PANEL_ID} a:link,
      #${PANEL_ID} a:visited {
        display: block;
        padding: .42rem .55rem;
        border-radius: .55rem;
        color: var(--md-typeset-color, rgba(0, 0, 0, .87));
        font-size: .78rem;
        line-height: 1.25;
        text-decoration: none;
        white-space: normal;
      }

      #${PANEL_ID} a:hover,
      #${PANEL_ID} a:focus {
        color: var(--md-accent-fg-color, var(--md-primary-fg-color));
        background: color-mix(in srgb, var(--md-accent-fg-color, #00bfa5) 10%, transparent);
        outline: none;
      }

      [data-md-color-scheme="slate"] #${PANEL_ID} {
        border-color: rgba(255, 255, 255, .12);
        box-shadow: 0 1.1rem 2.4rem rgba(0, 0, 0, .45);
      }

      html[data-mk-header-skin="header_skin_aurora"] #${PANEL_ID} {
        background: linear-gradient(135deg, #172554, #2563eb 42%, #6d28d9) !important;
        color: rgba(255, 255, 255, .90) !important;
        border-color: rgba(103, 232, 249, .28) !important;
        box-shadow: 0 1.1rem 2.8rem rgba(15, 23, 42, .38), inset 0 0 0 1px rgba(255, 255, 255, .05) !important;
      }

      html[data-mk-header-skin="header_skin_sunset"] #${PANEL_ID} {
        background: linear-gradient(135deg, #7c2d12, #be123c 48%, #f59e0b) !important;
        color: rgba(255, 255, 255, .92) !important;
        border-color: rgba(253, 186, 116, .34) !important;
        box-shadow: 0 1.1rem 2.8rem rgba(69, 26, 3, .36), inset 0 0 0 1px rgba(255, 255, 255, .05) !important;
      }

      html[data-mk-header-skin="header_skin_midnight"] #${PANEL_ID} {
        background: linear-gradient(135deg, #020617, #111827 54%, #1e3a8a) !important;
        color: rgba(255, 255, 255, .90) !important;
        border-color: rgba(147, 197, 253, .25) !important;
        box-shadow: 0 1.1rem 2.8rem rgba(2, 6, 23, .52), inset 0 0 0 1px rgba(255, 255, 255, .04) !important;
      }

      html[data-mk-header-skin] #${PANEL_ID} a,
      html[data-mk-header-skin] #${PANEL_ID} a:link,
      html[data-mk-header-skin] #${PANEL_ID} a:visited {
        color: rgba(255, 255, 255, .80) !important;
      }

      html[data-mk-header-skin] #${PANEL_ID} a:hover,
      html[data-mk-header-skin] #${PANEL_ID} a:focus {
        color: #fff !important;
        background: rgba(255, 255, 255, .08) !important;
      }

      /* v46: the Year-course flyout is the second level of the same header menu.
         Its colour should come from the active header skin, while dropdown skins
         only change shape, blur and depth. */
      html[data-mk-header-skin] #${PANEL_ID} {
        background: var(--mk-header-panel-bg, linear-gradient(135deg, #172554, #155e75 48%, #0f766e)) !important;
        color: rgba(255, 255, 255, .90) !important;
        border-color: var(--mk-header-panel-border, rgba(103, 232, 249, .28)) !important;
        box-shadow: var(--mk-header-panel-shadow, 0 18px 52px rgba(15,23,42,.36)) !important;
      }
      html[data-mk-dropdown-skin="dropdown_glass"] #${PANEL_ID} {
        backdrop-filter: blur(5px) saturate(1.04) !important;
        -webkit-backdrop-filter: blur(5px) saturate(1.04) !important;
        background: var(--mk-header-panel-bg-glass-v58, color-mix(in srgb, var(--md-default-bg-color) 54%, transparent)) !important;
        border: 1px solid rgba(255,255,255,.26) !important;
        box-shadow: 0 18px 54px rgba(15,23,42,.20) !important;
        overflow: visible !important;
      }
      html[data-mk-dropdown-skin="dropdown_glass"] #${PANEL_ID}.rf-year-course-popover-open-v4 {
        display:block !important;
        opacity:1 !important;
        visibility:visible !important;
        pointer-events:auto !important;
        z-index:2147483000 !important;
      }
      html[data-mk-dropdown-skin="dropdown_cute"] #${PANEL_ID} {
        border-radius: 24px !important;
        overflow: hidden !important;
        box-shadow: 0 18px 50px rgba(15,23,42,.22) !important;
      }
      html[data-mk-dropdown-skin="dropdown_cute"] #${PANEL_ID} a {
        border-radius: 14px !important;
        margin: 2px 4px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function findHost(link) {
    if (!link) return document.body;
    return link.closest("li") || link.parentElement || document.body;
  }

  function getPanel(host) {
    panel = document.getElementById(PANEL_ID) || panel;
    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;
      panel.setAttribute("role", "menu");
      panel.addEventListener("mouseenter", cancelHide);
      panel.addEventListener("mouseleave", scheduleHide);
    }

    // v58: keep the flyout at body level.  When Glass Dropdown is active,
    // parent panels may have transforms/backdrop layers; a fixed child inside
    // them can disappear or be clipped.  Body-level fixed positioning keeps the
    // Year 1 -> course submenu visible for all dropdown skins.
    const targetHost = document.body || host || document.documentElement;
    if (panel.parentElement !== targetHost) targetHost.appendChild(panel);
    return panel;
  }

  function renderCourses(courses) {
    const p = getPanel(activeHost);
    p.innerHTML = "";
    const ul = document.createElement("ul");
    for (const c of (courses || []).slice(0, MAX)) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = c.href || "#";
      a.textContent = c.title;
      a.setAttribute("role", "menuitem");
      li.appendChild(a);
      ul.appendChild(li);
    }
    p.appendChild(ul);
  }

  function clearMenuLock() {
    lockedEls.forEach((el) => {
      try {
        el.classList.remove(LOCK_CLASS);
        el.style.removeProperty("overflow");
      } catch (_) {}
    });
    lockedEls.clear();
  }

  function lockOriginalDropdown(link) {
    clearMenuLock();
    if (!link) return;

    let el = link.parentElement;
    let steps = 0;
    while (el && el !== document.body && steps < 10) {
      if (el.classList) {
        el.classList.add(LOCK_CLASS);
        lockedEls.add(el);
      }
      if (el.matches && el.matches(".md-header, .md-tabs, header")) break;
      el = el.parentElement;
      steps += 1;
    }
  }

  function positionPanel() {
    const p = getPanel(activeHost);
    if (!activeLink || !document.body.contains(activeLink)) return;
    const row = activeLink.closest && (activeLink.closest(".mk-rt-year-row") || activeLink.closest("li") || activeLink.parentElement) || activeLink;
    const r = (row && row.getBoundingClientRect ? row : activeLink).getBoundingClientRect();
    const parentPanel = activeLink.closest && activeLink.closest(".mk-rt-panel,.md-tab-dropdown-panel,#year-dropdown-panel,#random-dropdown-panel,.mk-header-dropdown,.mk-random-tabs-menu");
    const pr = parentPanel && parentPanel.getBoundingClientRect ? parentPanel.getBoundingClientRect() : null;
    const gap = pr ? 6 : 0;

    const width = p.offsetWidth || 296;
    const height = p.offsetHeight || 220;

    let left = pr ? (pr.right + gap) : (r.right + gap);
    if (left + width > window.innerWidth - 8) left = Math.max(8, (pr ? pr.left : r.left) - width - gap);
    let top = pr ? r.top : (r.top - 8);
    if (top + height > window.innerHeight - 8) top = Math.max(8, window.innerHeight - height - 8);
    if (top < 8) top = 8;

    p.style.left = `${Math.round(left)}px`;
    p.style.top = `${Math.round(top)}px`;
    p.style.transform = "none";
  }

  function labelFor(link) {
    return cleanText(link && link.textContent || "");
  }

  function openPanelFor(link) {
    if (!link || !isLikelyTopYearLink(link)) return;
    cancelHide();
    activeLink = link;
    activeHost = findHost(link);
    if (activeHost && activeHost.classList) activeHost.classList.add(HOST_CLASS);
    enhanceOne(link);
    lockOriginalDropdown(link);

    const label = labelFor(link);
    const yearHref = stableYearHref(link, label);
    const p = getPanel(activeHost);
    p.setAttribute("aria-label", label + " courses");
    p.classList.add("rf-year-course-popover-open-v4");

    renderCourses(baseCourses(yearHref, label));
    positionPanel();

    loadCourses(yearHref, label)
      .then((courses) => {
        if (activeLink !== link) return;
        renderCourses(courses);
        requestAnimationFrame(positionPanel);
      })
      .catch(() => {
        if (activeLink !== link) return;
        renderCourses(baseCourses(yearHref, label));
        requestAnimationFrame(positionPanel);
      });
  }

  function cancelHide() {
    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = 0;
  }

  function hidePanel() {
    cancelHide();
    if (panel) {
      panel.classList.remove("rf-year-course-popover-open-v4");
      panel.style.transform = "translate(-9999px, -9999px)";
    }
    if (activeHost && activeHost.classList) activeHost.classList.remove(HOST_CLASS);
    activeLink = null;
    activeHost = null;
    clearMenuLock();
  }

  function scheduleHide() {
    cancelHide();
    hideTimer = window.setTimeout(hidePanel, 420);
  }

  function enhanceOne(a) {
    if (!a || a.getAttribute(DONE) === "1") return;
    if (!isLikelyTopYearLink(a)) return;
    a.setAttribute(DONE, "1");
    a.classList.add("rf-year-course-trigger-v4");
    a.setAttribute("aria-haspopup", "true");
    if (!a.querySelector(".rf-year-course-arrow-v4")) {
      const arrow = document.createElement("span");
      arrow.className = "rf-year-course-arrow-v4";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "›";
      a.appendChild(arrow);
    }
  }

  function enhanceAll() {
    injectCss();
    Array.from(document.querySelectorAll("a[href]")).forEach(enhanceOne);
  }

  // Enhance only the links inside freshly added DOM subtrees. enhanceOne is
  // idempotent (marks DONE), so re-scanning the whole document on every mutation
  // is pure waste — and during the busy first seconds of a page load (many
  // scripts injecting nodes) those full-document scans pile up on the main
  // thread and make the top tabs feel laggy until startup settles.
  function enhanceAddedNodes(records) {
    injectCss();
    for (const rec of records || []) {
      const added = rec && rec.addedNodes;
      if (!added || !added.length) continue;
      for (const node of added) {
        if (!node || node.nodeType !== 1) continue;
        try {
          if (node.matches && node.matches("a[href]")) enhanceOne(node);
          if (node.querySelectorAll) {
            const links = node.querySelectorAll("a[href]");
            for (let i = 0; i < links.length; i += 1) enhanceOne(links[i]);
          }
        } catch (_) {}
      }
    }
  }

  function closestYearLink(target) {
    const a = target && target.closest ? target.closest("a[href]") : null;
    return a && isLikelyTopYearLink(a) ? a : null;
  }

  function bindGlobalHandlers() {
    if (document.documentElement.getAttribute("data-rf-year-course-global-v4") === "1") return;
    document.documentElement.setAttribute("data-rf-year-course-global-v4", "1");

    document.addEventListener("mouseover", (e) => {
      const a = closestYearLink(e.target);
      if (a) openPanelFor(a);
    }, true);

    document.addEventListener("focusin", (e) => {
      const a = closestYearLink(e.target);
      if (a) openPanelFor(a);
    }, true);

    document.addEventListener("mouseout", (e) => {
      const a = closestYearLink(e.target);
      if (!a) return;
      const to = e.relatedTarget;
      if (to && (a.contains(to) || (panel && panel.contains(to)) || (activeHost && activeHost.contains(to)))) return;
      scheduleHide();
    }, true);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hidePanel();
    }, true);

    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.closest && (target.closest("#" + PANEL_ID) || closestYearLink(target))) return;
      hidePanel();
    }, true);

    window.addEventListener("resize", positionPanel, { passive: true });
    window.addEventListener("scroll", positionPanel, { passive: true, capture: true });
  }

  // The year-course popover is the SECOND level of the top "Year" tab menu, but
  // it lives in this file while the first-level panel lives in random-tabs.js.
  // Expose a hide so the first-level panel can collapse this one with it instead
  // of leaving it lingering on screen. Skip it while the pointer is actually on
  // the popover (or its trigger/host) — that means the user is moving in to click
  // a course, not leaving the menu — unless the caller forces it.
  try {
    window.__rfHideYearCoursePopoverV4 = function (opts) {
      try {
        const force = !!(opts && opts.force);
        if (!force) {
          const hovered = (el) => !!(el && el.matches && el.matches(":hover"));
          if (hovered(panel) || hovered(activeLink) || hovered(activeHost)) return;
        }
        hidePanel();
      } catch (_) { try { hidePanel(); } catch (__) {} }
    };
  } catch (_) {}

  function init() {
    bindGlobalHandlers();
    enhanceAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("DOMContentSwitch", () => {
    hidePanel();
    setTimeout(init, 0);
  });

  try {
    // Coalesce mutation bursts into one rAF pass, and only process the nodes that
    // were actually added, so a flood of startup DOM changes can't repeatedly
    // re-scan the entire document and jank the top tab hover/dropdowns.
    let pendingRecords = [];
    let enhanceScheduled = false;
    const flushEnhance = () => {
      enhanceScheduled = false;
      const records = pendingRecords;
      pendingRecords = [];
      try { enhanceAddedNodes(records); } catch (_) {}
    };
    const mo = new MutationObserver((records) => {
      if (records && records.length) pendingRecords.push.apply(pendingRecords, records);
      if (enhanceScheduled) return;
      enhanceScheduled = true;
      if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(flushEnhance);
      else window.setTimeout(flushEnhance, 60);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})();
