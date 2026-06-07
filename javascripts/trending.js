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

function safePath(loc) {
  const s0 = String(loc || "");
  return (s0.split("#")[0] || s0).replace(/^\/+/, "");
}

function asStringList(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x.map(String).filter(Boolean);
  if (typeof x === "string") return [x];
  return [];
}

// Try hard to read tags from different index shapes
function getTagsFromDoc(d) {
  const out = [];
  out.push(...asStringList(d && d.tags));
  out.push(...asStringList(d && d.tag));
  out.push(...asStringList(d && d.meta && d.meta.tags));
  out.push(...asStringList(d && d.meta && d.meta.tag));
  out.push(...asStringList(d && d.meta && d.meta["tags"]));
  return out.map(s => String(s).trim()).filter(Boolean);
}

// tags like: m1c-lecture02 / m3a-lecture6 / i2da-week01 / week02
function unitNounFromType(type) {
  return String(type || "lecture").toLowerCase() === "week" ? "Week" : "Lecture";
}

function unitInfoFromTags(tagSetOrArr) {
  const tags = Array.isArray(tagSetOrArr) ? tagSetOrArr : [];
  const withCourse = /^([a-z0-9]+)[-_]?(lecture|week)[-_]?0*(\d+)$/i;
  const bare = /^(lecture|week)[-_]?0*(\d+)$/i;
  for (const raw of tags) {
    const t = String(raw || "").trim().toLowerCase();
    let m = t.match(withCourse);
    if (m) {
      const unitType = String(m[2] || "lecture").toLowerCase();
      const unitNum = parseInt(m[3], 10) || 0;
      const unitNoun = unitNounFromType(unitType);
      return { courseCode: m[1], unitType, unitNum, lectureNum: unitNum, unitLabel: `${unitNoun} ${unitNum}` };
    }
    m = t.match(bare);
    if (m) {
      const unitType = String(m[1] || "lecture").toLowerCase();
      const unitNum = parseInt(m[2], 10) || 0;
      const unitNoun = unitNounFromType(unitType);
      return { courseCode: "", unitType, unitNum, lectureNum: unitNum, unitLabel: `${unitNoun} ${unitNum}` };
    }
  }
  return null;
}

function lectureNumFromTags(tagSetOrArr) {
  const info = unitInfoFromTags(tagSetOrArr);
  return info ? info.lectureNum : 0;
}

let __lectureMapPromise = null;

// Build: "Year-1/1a-Math-I-Calculus/xxx.html" -> { unitType, unitNum, unitLabel }
function loadLectureMapOnce() {
  if (__lectureMapPromise) return __lectureMapPromise;

  __lectureMapPromise = (async () => {
    const root = getSiteRootUrl();
    const url = new URL("search/search_index.json", root).toString();

    const res = await fetch(url, { cache: "no-cache" }).catch(() => null);
    const j = res && res.ok ? await res.json().catch(() => null) : null;
    const docs = j && Array.isArray(j.docs) ? j.docs : [];

    const map = new Map();
    for (const d of docs) {
      const loc = safePath(d && d.location);
      if (!loc) continue;

      // page-level key (strip #)
      const key = loc;
      if (map.has(key)) continue; // first win is enough for lecture/week tags in practice

      const tags = getTagsFromDoc(d);
      const info = unitInfoFromTags(tags);
      if (info && info.unitNum) map.set(key, info);
    }
    return map;
  })();

  return __lectureMapPromise;
}


function cleanTitle(title) {
  const t = String(title || "").replace(/¶/g, "").replace(/\s*¶+\s*$/g, "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.replace(/\s+-\s+BSc EOR Wiki\s*$/i, "").replace(/\s*¶+\s*$/g, "").trim();
}

function courseLabelFromPath(path) {
  // Example: Year-1/1a-Math-I-Calculus/definite-integral.html
  const p = String(path || "").replace(/^\/+/, "");
  const segs = p.split("/").filter(Boolean);
  if (segs.length < 2) return "";

  let courseSeg = segs[1]; // 1a-Math-I-Calculus
  courseSeg = courseSeg.replace(/^\d+[a-z]-/i, "");
  courseSeg = courseSeg.replace(/-/g, " ").trim();

  const parts = courseSeg.split(/\s+/).filter(Boolean);
  if (parts.length >= 3 && /^Math$/i.test(parts[0]) && /^[IVX]+$/i.test(parts[1])) {
    return `${parts[0]} ${parts[1]}: ${parts.slice(2).join(" ")}`;
  }
  return courseSeg;
}

function titleLooksLikePathForTrending(t) {
  const s = String(t || "").trim();
  if (!s) return false;
  if (/^https?:\/\//i.test(s)) return true;
  if (/\.html(?:[#?].*)?$/i.test(s) && (s.includes("/") || s.includes("\\"))) return true;
  if (/^[A-Za-z0-9._~%-]+(?:\/[A-Za-z0-9._~%-]+)+\.html$/i.test(s)) return true;
  return false;
}

function titleLookupKey(path) {
  let p = String(path || "").trim();

  // Ranking rows may come from several tables.  Some store paths relative to
  // the MkDocs root, while saved/comment rows can store absolute URLs.
  // Normalise both shapes to the same key used by search_index.json.
  try {
    const u = new URL(p, document.baseURI);
    const root = new URL(getSiteRootUrl(), document.baseURI);
    if (u.origin === root.origin) {
      let rp = root.pathname || "/";
      if (!rp.endsWith("/")) rp += "/";
      let up = u.pathname || "";
      if (up.toLowerCase().startsWith(rp.toLowerCase())) up = up.slice(rp.length);
      else up = up.replace(/^\/+/, "");
      p = up;
    }
  } catch (_) {}

  try { p = decodeURIComponent(p); } catch (_) {}
  return p
    .split("#")[0]
    .split("?")[0]
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/index\.html$/i, "/")
    .replace(/\/+$/g, "")
    .toLowerCase();
}

function humanTitleFromPath(path) {
  const base = String(path || "").split("#")[0].split("?")[0].split("/").pop() || String(path || "");
  return base.replace(/\.html$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()).trim() || String(path || "");
}

function displayTitle(item, titleMap) {
  const key = titleLookupKey(item && item.path);
  const fromIndex = titleMap && titleMap.get ? (titleMap.get(key) || (key.endsWith(".html") ? titleMap.get(key.slice(0, -5)) : titleMap.get(key + ".html")) || "") : "";

  // Prefer the MkDocs search-index title whenever it is available.
  // Ranking metrics such as lively/saved may be built from comments, reactions,
  // or saved-page rows whose stored titles were captured from already-rendered
  // MathJax DOM text.  Those DOM strings can contain duplicated fallback text,
  // e.g. "Rnmathbb R^nRn".  The search index keeps the canonical page title,
  // so using it here gives the same math-title handling as the original views
  // ranking and keeps all non-user ranking tabs consistent.
  if (fromIndex && !titleLooksLikePathForTrending(fromIndex)) return fromIndex;

  const raw = cleanTitle(item && item.title);
  if (raw && !titleLooksLikePathForTrending(raw)) return raw;

  return humanTitleFromPath(item && item.path);
}


function escapeTrendingHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normaliseMathExpr(expr) {
  let s = String(expr || "").trim();
  if (!s) return "";

  // MathJax accepts \mathbb R in many contexts, but normalising it to the
  // braced form keeps rendering stable inside compact ranking links.
  s = s
    .replace(/\\mathbb\s*\{\s*([RNZQC])\s*\}\s*\^\s*\{?\s*([A-Za-z0-9]+)\s*\}?/g, "\\mathbb{$1}^{$2}")
    .replace(/\\mathbb\s*([RNZQC])\s*\^\s*\{?\s*([A-Za-z0-9]+)\s*\}?/g, "\\mathbb{$1}^{$2}")
    .replace(/\\mathbb\s*\{\s*([RNZQC])\s*\}/g, "\\mathbb{$1}")
    .replace(/\\mathbb\s*([RNZQC])/g, "\\mathbb{$1}")
    .replace(/\s+/g, " ")
    .trim();

  return s;
}

function normaliseKnownMathTitle(title) {
  let s = String(title || "").trim();

  // Search index / old local records sometimes lose $...$ and in a few places
  // duplicate single-letter math symbols (p -> ppp, M -> MMM). Normalise those
  // before rendering the title ourselves.
  s = s
    .replace(/^p{2,}-series$/i, "p-series")
    .replace(/^p{2,}-test$/i, "p-test")
    .replace(/\bWeierstrass\s+M{2,}-test\b/i, "Weierstrass M-test")
    // Fallback for titles captured from rendered MathJax DOM instead of the
    // canonical search index title. Prefer the search-index title in displayTitle,
    // but keep this guard for old cached rows or failed index loads.
    .replace(/\bR+n?mathbb\s+R\^nR*n?\b/gi, "$\\mathbb{R}^{n}$");

  if (/^p-series$/i.test(s)) return "$p$-series";
  if (/^p-test$/i.test(s)) return "$p$-test";
  if (/^Weierstrass\s+M-test$/i.test(s)) return "Weierstrass $M$-test";

  // Page titles should use inline math in rankings.  If a stored title contains
  // display-math delimiters, collapse them to a single inline-math pair before
  // the generic $...$ parser below runs.  Without this, "$$\\mathbb R^n$$"
  // leaves stray dollar signs in the link text.
  s = s.replace(/\$\$\s*([^$\n]+?)\s*\$\$/g, (_, expr) => `$${normaliseMathExpr(expr)}$`);

  // Some stored titles have raw TeX without delimiters, e.g.
  // "Polynomial on \\mathbb R ^n".  Wrap the whole \mathbb expression exactly
  // once.  The optional exponent is consumed in the same replacement so that
  // "\\mathbb R ^n" becomes "$\\mathbb{R}^{n}$", not
  // "$$\\mathbb{R}$^{n}$".
  if (!/(?:\\\([^)]*\\\)|\$[^$\n]+\$)/.test(s)) {
    s = s.replace(/\\mathbb\s*(?:\{\s*([RNZQC])\s*\}|([RNZQC]))\s*(?:\^\s*(?:\{\s*([A-Za-z0-9]+)\s*\}|([A-Za-z0-9]+)))?/g, (_, b1, b2, p1, p2) => {
      const base = b1 || b2;
      const pow = p1 || p2 || "";
      return pow ? `$\\mathbb{${base}}^{${pow}}$` : `$\\mathbb{${base}}$`;
    });

    // Last-resort repair for cached/display-derived titles where the TeX command
    // has already been stripped to plain "R^n".  This is intentionally narrow.
    s = s.replace(/\bR\s*\^\s*([A-Za-z0-9]+)\b/g, (_, pow) => {
      return `$\\mathbb{R}^{${pow}}$`;
    });
  }

  return s;
}

function titleToHtml(title) {
  const src = normaliseKnownMathTitle(title);
  const re = /\$([^$\n]+?)\$|\\\((.*?)\\\)/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    out += escapeTrendingHtml(src.slice(last, m.index));
    const expr = normaliseMathExpr(m[1] != null ? m[1] : m[2]);
    out += `<span class="mk-title-math">\\(${escapeTrendingHtml(expr)}\\)</span>`;
    last = re.lastIndex;
  }
  out += escapeTrendingHtml(src.slice(last));
  return out;
}

function displayCourseLecture(item, lectureMap) {
  const course = courseLabelFromPath(item.path);
  const p = String(item.path || "").replace(/^\/+/, "");
  const raw = lectureMap && lectureMap.get(p) ? lectureMap.get(p) : null;
  const unitLabel = raw && typeof raw === "object"
    ? (raw.unitLabel || `${unitNounFromType(raw.unitType)} ${raw.unitNum || raw.lectureNum || ""}`.trim())
    : (raw ? `Lecture ${raw}` : "");
  if (!course) return unitLabel || "";
  return unitLabel ? `${course} · ${unitLabel}` : course;
}


(function () {
  const API_BASE = "https://hot.eor-wiki.workers.dev";

  // H1 flame badge is intentionally disabled for now.
  // The ranking page still works; this only suppresses the fire icon beside page titles.
  const ENABLE_H1_HOT_BADGE = false;

  const IS_MOBILE_UI = (() => {
    try {
      const mm = window.matchMedia;
      const byWidth = !!(mm && (mm('(max-width: 900px)').matches || mm('(max-width: 768px)').matches));
      const byPointer = !!(mm && (mm('(pointer: coarse)').matches || mm('(hover: none)').matches));
      const byTouch = ('ontouchstart' in window) || (navigator && navigator.maxTouchPoints > 0);
      return byWidth || byPointer || byTouch;
    } catch (_) {
      return false;
    }
  })();

  function ensureStylesOnce() {
    const STYLE_ID = "trending-style-v23-board-refresh";
    if (document.getElementById(STYLE_ID)) return;
    try { const old22 = document.getElementById("trending-style-v22-mobile-title-ellipsis"); if (old22 && old22.parentNode) old22.parentNode.removeChild(old22); } catch (_) {}
    ["trending-style-v9-solid-flame", "trending-style-v10-outline-hot-h1", "trending-style-v11-map-frame-sync", "trending-style-v12-isolated-hot-hover", "trending-style-v13-hot-mobile-menu", "trending-style-v15-unified", "trending-style-v14-hot-no-today-h1-right", "trending-style-v15-unified-metric-switch", "trending-style-v16-rankings-compact-switch", "trending-style-v17-active-users-profile-cards", "trending-style-v18-active-users-inline-frames", "trending-style-v19-active-users-total-xp-align", "trending-style-v21-ranking-labels"].forEach((id) => {
      try {
        const old = document.getElementById(id);
        if (old && old.parentNode) old.parentNode.removeChild(old);
      } catch (_) {}
    });
    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = `
/* Per-board freshness line + refresh button */
.trending-board-meta{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  margin-top:.5rem; padding-top:.5rem;
  border-top:1px solid var(--md-default-fg-color--lightest, rgba(0,0,0,.08));
  font-size:.82em; color:var(--md-default-fg-color--light, #6b7280);
}
.trending-board-time{ flex:1 1 auto; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.trending-board-refresh{
  flex:0 0 auto; display:inline-flex; align-items:center; gap:.35em;
  padding:.28rem .6rem; border-radius:999px; cursor:pointer;
  border:1px solid var(--md-default-fg-color--lighter, rgba(0,0,0,.16));
  background:var(--md-default-bg-color, #fff); color:inherit;
  font:inherit; font-size:.95em; line-height:1; transition:background .15s ease, border-color .15s ease;
}
.trending-board-refresh:hover{ border-color:var(--md-accent-fg-color, #2563eb); color:var(--md-accent-fg-color, #2563eb); }
.trending-board-refresh-icon{ display:inline-block; }
.trending-board-refresh.is-busy{ opacity:.6; pointer-events:none; }
.trending-board-refresh.is-busy .trending-board-refresh-icon{ animation:trending-board-spin .8s linear infinite; }
@keyframes trending-board-spin{ to{ transform:rotate(360deg); } }
@media (max-width: 900px), (pointer: coarse){
  .trending-board-refresh-text{ display:none; }
  .trending-board-refresh{ padding:.34rem .5rem; }
}

@media (max-width: 900px), (pointer: coarse){
  .trending-metahead{ display:none !important; }

  /* tabs: 4 buttons in one row */
  .trending-tabs{ display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
  .trending-tab{ flex: 0 0 auto; width:auto; min-width:max-content; padding: .46rem .82rem; font-size: .96em; white-space:nowrap; }

  /* column head (Concept / views) */
  .trending-colhead{
    display:grid;
    grid-template-columns: 22px minmax(0, 1fr) max-content;
    column-gap: 10px;
    padding: .25rem 0 .55rem;
    margin-top: .25rem;
    opacity: .72;
    font-weight: 750;
    letter-spacing: .2px;
    min-width:0;
  }
  .trending-colhead > *{ min-width:0; }
  .trending-colhead-right{ justify-self:end; white-space:nowrap; }

  /* list: remove default left gutter; tighten rank column */
  .trending-list{ list-style:none !important; padding:0 !important; margin:0 !important; padding-inline-start:0 !important; min-width:0 !important; }
  .trending-item{
    display:grid;
    grid-template-columns: 22px minmax(0, 1fr) max-content;
    grid-template-areas:
      "rank title meta"
      ".    course meta";
    column-gap: 10px;
    row-gap: 2px;
    align-items:start;
    padding: .58rem 0;
    min-width:0;
    max-width:100%;
    overflow:hidden;
  }
  .trending-rank{ grid-area: rank; text-align:left; opacity:.8; min-width:0; }
  .trending-link{
    grid-area:title;
    display:block;
    min-width:0;
    max-width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .trending-course{
    grid-area:course;
    display:block;
    min-width:0;
    max-width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    text-align:left !important;
    justify-self:stretch;
    opacity:.72;
  }
  .trending-meta{ grid-area: meta; text-align:right; justify-self:end; opacity:.76; min-width:max-content; white-space:nowrap; }
}

.trending-link mjx-container,
.trending-link .MathJax{
  display:inline-block;
  vertical-align:baseline;
  border-bottom: max(1px, .06em) solid currentColor;
  padding-bottom: .02em;
}

.trending-link .mk-title-math{
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 500;
}

/* ===== Hot concept badge near H1 ===== */
/* Same frame model as learning-path's H1 map button. */
article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
.md-typeset a.mk-trending-h1-hot,
.mk-trending-h1-hot{
  appearance:none;
  box-sizing:border-box;
  border:1px solid var(--mk-trending-hot-border, var(--md-default-fg-color--lightest)) !important;
  border-bottom:1px solid var(--mk-trending-hot-border, var(--md-default-fg-color--lightest)) !important;
  background:var(--mk-trending-hot-bg, rgba(255,255,255,.04)) !important;
  color:var(--md-default-fg-color) !important;
  width:40px !important;
  height:40px !important;
  min-width:40px !important;
  min-height:40px !important;
  max-width:40px !important;
  max-height:40px !important;
  border-radius:12px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  padding:0 !important;
  margin:0 !important;
  cursor:pointer;
  opacity:var(--mk-trending-hot-opacity, .9);
  user-select:none;
  line-height:0 !important;
  box-shadow:var(--mk-trending-hot-shadow, none) !important;
  transform:none !important;
  text-decoration:none !important;
  background-image:none !important;
  outline-offset:3px;
  flex:0 0 auto !important;
  vertical-align:middle;
  -webkit-tap-highlight-color:transparent;
}
.md-typeset a.mk-trending-h1-hot::before,
.md-typeset a.mk-trending-h1-hot::after,
.mk-trending-h1-hot::before,
.mk-trending-h1-hot::after{
  display:none !important;
  content:none !important;
  border:0 !important;
  box-shadow:none !important;
  background:none !important;
}
.md-typeset a.mk-trending-h1-hot:hover,
.md-typeset a.mk-trending-h1-hot:focus,
.md-typeset a.mk-trending-h1-hot:visited,
.mk-trending-h1-hot:hover,
.mk-trending-h1-hot:focus,
.mk-trending-h1-hot:visited{
  color:var(--md-default-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
}
.mk-trending-h1-hot:hover{
  border-color:var(--mk-trending-hot-hover-border, var(--md-accent-fg-color)) !important;
  background:var(--mk-trending-hot-hover-bg, rgba(99,102,241,.10)) !important;
  opacity:var(--mk-trending-hot-hover-opacity, 1);
  transform:none !important;
  box-shadow:var(--mk-trending-hot-hover-shadow, none) !important;
}
.mk-trending-h1-hot:focus-visible{
  outline:2px solid rgba(255,255,255,.28);
  outline-offset:3px;
}
.mk-trending-h1-hot svg{
  width:24px !important;
  height:24px !important;
  display:block !important;
  color:inherit !important;
  stroke:currentColor !important;
  fill:none !important;
  filter:none !important;
  margin:0 !important;
  transform:none !important;
  overflow:visible;
  flex:0 0 auto;
}
.mk-trending-h1-hot svg *,
.mk-trending-h1-hot svg path,
.mk-trending-h1-hot svg line,
.mk-trending-h1-hot svg polyline,
.mk-trending-h1-hot svg circle,
.mk-trending-hot-popover .mk-trending-hot-title svg.mk-trending-hot-svg,
.mk-trending-hot-popover .mk-trending-hot-title svg.mk-trending-hot-svg *{
  stroke:currentColor !important;
  fill:none !important;
  filter:none !important;
}
.mk-trending-h1-hot svg.mk-trending-hot-svg,
.mk-trending-hot-popover .mk-trending-hot-title svg.mk-trending-hot-svg{
  stroke:currentColor !important;
  fill:none !important;
}
.mk-trending-h1-hot .mk-trending-sr{
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}
html[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
body[data-md-color-scheme="default"] article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
html[data-md-color-scheme="default"] .md-typeset a.mk-trending-h1-hot,
body[data-md-color-scheme="default"] .md-typeset a.mk-trending-h1-hot,
html[data-md-color-scheme="default"] .mk-trending-h1-hot,
body[data-md-color-scheme="default"] .mk-trending-h1-hot{
  --mk-trending-hot-border: rgba(70, 78, 96, .42);
  --mk-trending-hot-shadow: inset 0 0 0 1px rgba(0,0,0,.03);
}
html[data-md-color-scheme="slate"] .mk-trending-h1-hot,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot{
  color:#fff !important;
  --mk-trending-hot-border: rgba(255,255,255,.16);
  --mk-trending-hot-bg: rgba(255,255,255,.04);
}
html[data-md-color-scheme="slate"] .mk-trending-h1-hot:hover,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot:hover{
  color:#fff !important;
  --mk-trending-hot-hover-border: var(--md-accent-fg-color);
  --mk-trending-hot-hover-bg: rgba(99,102,241,.10);
  --mk-trending-hot-hover-shadow: none;
}
html[data-md-color-scheme="slate"] .mk-trending-h1-hot svg,
html[data-md-color-scheme="slate"] .mk-trending-h1-hot svg *,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot svg,
body[data-md-color-scheme="slate"] .mk-trending-h1-hot svg *{
  color:#fff !important;
  stroke:currentColor !important;
  fill:none !important;
}
@media (max-width: 768px), (hover: none) and (pointer: coarse){
  article.md-content__inner h1.lp-h1-row > a.mk-trending-h1-hot,
  .md-typeset a.mk-trending-h1-hot,
  .mk-trending-h1-hot{
    display:flex !important;
  }
  .mk-trending-hot-popover:not(.is-mobile-menu){
    display:none !important;
  }
}

.mk-trending-hot-popover{
  position:fixed;
  z-index:2147482600;
  width:max-content;
  max-width:min(360px, calc(100vw - 24px));
  padding:10px 12px 11px;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
  border-radius:14px;
  background: color-mix(in srgb, var(--md-default-bg-color) 96%, var(--md-primary-fg-color) 4%);
  color:var(--md-default-fg-color);
  box-shadow:0 16px 40px rgba(0,0,0,.16);
  opacity:0;
  transform:translateY(4px) scale(.985);
  pointer-events:none;
  transition:opacity .12s ease, transform .12s ease;
  font-family:var(--md-text-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
  font-size:.70rem;
  font-weight:400;
  letter-spacing:0;
  line-height:1.28;
  overflow:hidden;
}
.mk-trending-hot-popover.is-visible{
  opacity:1;
  transform:translateY(0) scale(1);
}
.mk-trending-hot-popover .mk-trending-hot-title{
  display:flex;
  align-items:center;
  gap:7px;
  font-weight:650;
  margin-bottom:7px;
  white-space:nowrap;
}
.mk-trending-hot-popover .mk-trending-hot-title svg{
  width:15px;
  height:15px;
  color:currentColor;
  fill:currentColor;
  stroke:none;
  opacity:.86;
  flex:0 0 auto;
}
.mk-trending-hot-popover .mk-trending-hot-row{
  display:grid;
  grid-template-columns:1fr auto;
  column-gap:18px;
  align-items:baseline;
  min-width:230px;
  padding:4px 0;
  border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 8%, transparent);
}
.mk-trending-hot-popover .mk-trending-hot-row:first-of-type{
  border-top:0;
}
.mk-trending-hot-popover .mk-trending-hot-label{
  font-weight:600;
  min-width:0;
}
.mk-trending-hot-popover .mk-trending-hot-meta{
  opacity:.74;
  font-weight:400;
  white-space:nowrap;
  text-align:right;
}
.mk-trending-hot-popover .mk-trending-hot-hint{
  margin-top:7px;
  padding-top:7px;
  border-top:1px solid color-mix(in srgb, var(--md-default-fg-color) 8%, transparent);
  opacity:.62;
  font-weight:400;
  font-size:.68rem;
}

.mk-trending-hot-popover.is-mobile-menu{
  pointer-events:auto;
  width:min(340px, calc(100vw - 24px));
  max-width:calc(100vw - 24px);
  font-size:.72rem;
}
.mk-trending-hot-popover.is-mobile-menu .mk-trending-hot-hint{
  display:none;
}
.mk-trending-hot-popover .mk-trending-hot-open{
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:8px;
  padding:8px 10px;
  border-radius:10px;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 12%, transparent);
  background:color-mix(in srgb, var(--md-default-fg-color) 6%, transparent);
  color:var(--md-default-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
  font-weight:650;
  line-height:1.15;
}
.mk-trending-hot-popover .mk-trending-hot-open:hover,
.mk-trending-hot-popover .mk-trending-hot-open:focus{
  background:rgba(99,102,241,.10);
  border-color:var(--md-accent-fg-color);
  color:var(--md-default-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
}

    

/* ===== Unified Trending page: metric switch + one table at a time ===== */
.trending-unified{
  width:100%;
}
.trending-metric-switch{
  display:flex;
  flex-wrap:wrap;
  gap:.7rem;
  align-items:center;
  justify-content:center;
  margin:0 0 1rem;
}
.trending-metric-btn{
  appearance:none;
  flex:0 0 auto;
  width:auto;
  max-width:100%;
  min-width:max-content;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 13%, transparent);
  background:color-mix(in srgb, var(--md-default-bg-color) 92%, var(--md-primary-fg-color) 8%);
  color:var(--md-default-fg-color);
  border-radius:999px;
  padding:.46rem 1.28rem;
  font:inherit;
  font-weight:750;
  line-height:1.12;
  white-space:nowrap;
  cursor:pointer;
  box-shadow:none;
  -webkit-tap-highlight-color:transparent;
}
.trending-metric-btn:hover,
.trending-metric-btn:focus-visible{
  border-color:var(--md-accent-fg-color);
  color:var(--md-accent-fg-color);
  outline:0;
}
.trending-metric-btn.is-active{
  border-color:var(--md-accent-fg-color);
  background:color-mix(in srgb, var(--md-accent-fg-color) 14%, var(--md-default-bg-color) 86%);
  color:var(--md-accent-fg-color);
}
.trending-unified .trending-grid{
  display:block;
}
.trending-unified .trending-block[hidden]{
  display:none !important;
}
.trending-unified .trending-block-title{
  display:none !important;
}
.trending-unified .trending-block-header{
  margin-top:.1rem;
}
.trending-unified .trending-tabs{
  margin-top:.15rem;
}



/* ===== Active users ranking: account-style profile rows ===== */
.trending-block[data-metric="users"]{
  --trending-user-rank-col:42px;
  --trending-user-xp-col:7.25rem;
  --trending-user-col-gap:14px;
}
.trending-block[data-metric="users"] .trending-list{
  list-style:none !important;
  padding:0 !important;
  margin:.55rem 0 0 !important;
  padding-inline-start:0 !important;
  width:100%;
  max-width:none;
  box-sizing:border-box;
}
.trending-user-item{
  list-style:none !important;
  display:grid !important;
  grid-template-columns:var(--trending-user-rank-col) minmax(0, 1fr) var(--trending-user-xp-col);
  grid-template-areas:none !important;
  align-items:center;
  column-gap:var(--trending-user-col-gap);
  width:100%;
  max-width:none;
  box-sizing:border-box;
  margin:.48rem 0;
  padding:.42rem 0;
  border:0;
  border-radius:0;
  background:transparent;
  box-shadow:none;
}
.trending-user-item + .trending-user-item{
  border-top:0;
}

.trending-user-item[data-ranking-effect="ranking_row_gold"]{
  --trending-ranking-bg-strong:rgba(250,204,21,.16);
  --trending-ranking-bg-soft:rgba(254,240,138,.075);
  --trending-ranking-border:rgba(250,204,21,.30);
  --trending-ranking-line-1:#fef3c7;
  --trending-ranking-line-2:#f6c453;
  --trending-ranking-line-3:#fff7d6;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"]{
  --trending-ranking-bg-strong:rgba(252,165,165,.18);
  --trending-ranking-bg-soft:rgba(254,202,202,.085);
  --trending-ranking-border:rgba(248,113,113,.28);
  --trending-ranking-line-1:#ffe4e6;
  --trending-ranking-line-2:#fca5a5;
  --trending-ranking-line-3:#fff1f2;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]{
  --trending-ranking-bg-strong:rgba(147,197,253,.18);
  --trending-ranking-bg-soft:rgba(191,219,254,.085);
  --trending-ranking-border:rgba(96,165,250,.27);
  --trending-ranking-line-1:#dbeafe;
  --trending-ranking-line-2:#93c5fd;
  --trending-ranking-line-3:#eff6ff;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]{
  --trending-ranking-bg-strong:rgba(196,181,253,.18);
  --trending-ranking-bg-soft:rgba(221,214,254,.085);
  --trending-ranking-border:rgba(167,139,250,.27);
  --trending-ranking-line-1:#ede9fe;
  --trending-ranking-line-2:#c4b5fd;
  --trending-ranking-line-3:#f5f3ff;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"]{
  --trending-ranking-bg-strong:rgba(134,239,172,.18);
  --trending-ranking-bg-soft:rgba(187,247,208,.085);
  --trending-ranking-border:rgba(74,222,128,.25);
  --trending-ranking-line-1:#dcfce7;
  --trending-ranking-line-2:#86efac;
  --trending-ranking-line-3:#f0fdf4;
}
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]{
  --trending-ranking-bg-strong:rgba(253,186,116,.17);
  --trending-ranking-bg-soft:rgba(254,215,170,.085);
  --trending-ranking-border:rgba(251,146,60,.25);
  --trending-ranking-line-1:#ffedd5;
  --trending-ranking-line-2:#fdba74;
  --trending-ranking-line-3:#fff7ed;
}
.trending-user-item[data-ranking-effect="ranking_row_gold"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"],
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]{
  position:relative;
  overflow:visible;
  border-radius:16px;
  background:linear-gradient(90deg,var(--trending-ranking-bg-strong),var(--trending-ranking-bg-soft) 44%,transparent 84%);
  box-shadow:inset 0 0 0 1px var(--trending-ranking-border),0 10px 24px rgba(15,23,42,.075);
}
.trending-user-item[data-ranking-effect="ranking_row_gold"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"]::before,
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]::before{
  content:"";
  position:absolute;
  left:0;
  top:13%;
  bottom:13%;
  width:5px;
  border-radius:999px;
  background:linear-gradient(var(--trending-ranking-line-1),var(--trending-ranking-line-2),var(--trending-ranking-line-3));
  pointer-events:none;
}
.trending-user-item[data-ranking-effect="ranking_row_gold"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_red"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_blue"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_purple"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_green"]::after,
.trending-user-item[data-ranking-effect="ranking_row_pastel_peach"]::after{
  content:none;
  display:none;
}
.trending-user-item .trending-rank{
  width:32px;
  text-align:center;
  color:color-mix(in srgb, var(--md-default-fg-color) 70%, transparent);
  font-weight:750;
  font-variant-numeric:tabular-nums;
  transform:translate(4px, 2px);
}
.trending-block[data-metric="users"] .trending-block-header{
  display:grid;
  grid-template-columns:minmax(0, 1fr) var(--trending-user-xp-col);
  align-items:end;
  column-gap:var(--trending-user-col-gap);
  width:100%;
  max-width:none;
  box-sizing:border-box;
}
.trending-block[data-metric="users"] .trending-tabs{
  min-width:0;
}
.trending-block[data-metric="users"] .trending-metahead{
  justify-self:end;
  text-align:right;
  width:var(--trending-user-xp-col);
  min-width:0;
}
.trending-user-profile{
  min-width:0;
  display:grid;
  grid-template-columns:76px minmax(0, 1fr);
  align-items:center;
  column-gap:14px;
}
.trending-user-avatar,
.trending-user-avatar .trending-user-avatar-core{
  width:54px;
  height:54px;
  border-radius:999px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  box-sizing:border-box;
}
.trending-user-avatar{
  position:relative;
  flex:0 0 auto;
  justify-self:center;
  align-self:center;
  overflow:visible;
  isolation:isolate;
  background:transparent;
  color:var(--md-default-fg-color);
  font-weight:850;
  font-size:1rem;
  line-height:1;
}
.trending-user-avatar .trending-user-avatar-core{
  position:relative;
  z-index:1;
  overflow:hidden;
  border:1px solid color-mix(in srgb, var(--md-default-fg-color) 14%, transparent);
  background:color-mix(in srgb, var(--md-primary-fg-color) 14%, var(--md-default-bg-color));
}
.trending-user-avatar img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
  border-radius:inherit;
}
.trending-user-avatar .mk-avatar-frame-svg{
  position:absolute;
  z-index:2;
  left:50%;
  top:50%;
  width:152% !important;
  height:152% !important;
  max-width:none !important;
  max-height:none !important;
  transform:translate(-50%, -50%);
  pointer-events:none;
  overflow:visible;
  filter:drop-shadow(0 1px 1px rgba(0,0,0,.20));
}
.trending-user-avatar.mk-avatar-frame-level-1 .mk-avatar-frame-svg{ width:134% !important; height:134% !important; opacity:.92; filter:none; }
.trending-user-avatar.mk-avatar-frame-level-2 .mk-avatar-frame-svg{ width:142% !important; height:142% !important; }
.trending-user-avatar.mk-avatar-frame-level-3 .mk-avatar-frame-svg{ width:148% !important; height:148% !important; }
.trending-user-avatar.mk-avatar-frame-level-4 .mk-avatar-frame-svg{ width:154% !important; height:154% !important; }
.trending-user-avatar.mk-avatar-frame-level-5 .mk-avatar-frame-svg{ width:162% !important; height:162% !important; }
.trending-user-avatar.mk-avatar-frame-level-6 .mk-avatar-frame-svg{ width:166% !important; height:166% !important; }
.trending-user-avatar.mk-avatar-frame-level-7 .mk-avatar-frame-svg{ width:170% !important; height:170% !important; filter:drop-shadow(0 0 4px rgba(168,85,247,.38)); }
.trending-user-avatar.mk-avatar-frame-level-8 .mk-avatar-frame-svg{ width:174% !important; height:174% !important; filter:drop-shadow(0 0 4px rgba(244,63,94,.38)); }
.trending-user-avatar.mk-avatar-frame-level-9 .mk-avatar-frame-svg{ width:180% !important; height:180% !important; filter:drop-shadow(0 0 5px rgba(14,165,233,.32)); }
.trending-user-avatar.mk-avatar-frame-level-10 .mk-avatar-frame-svg{ width:188% !important; height:188% !important; filter:drop-shadow(0 0 5px rgba(250,204,21,.42)); }
.trending-user-main{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:4px;
}
.trending-user-name-row{
  min-width:0;
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}
.trending-user-name,
.trending-user-name:visited{
  color:var(--md-default-fg-color) !important;
  font-weight:850;
  font-size:1.08rem;
  text-decoration:none !important;
  background-image:none !important;
  line-height:1.18;
  white-space:nowrap;
}
.trending-user-name:hover,
.trending-user-name:focus{
  color:var(--md-accent-fg-color) !important;
  text-decoration:none !important;
  background-image:none !important;
}
.trending-user-level{
  position:relative;
  overflow:hidden;
  isolation:isolate;
  display:inline-flex;
  align-items:center;
  gap:5px;
  border:1px solid color-mix(in srgb, var(--md-accent-fg-color) 48%, transparent);
  background:color-mix(in srgb, var(--md-accent-fg-color) 10%, transparent);
  color:var(--md-default-fg-color);
  border-radius:999px;
  padding:.22rem .58rem;
  font-size:.72rem;
  font-weight:850;
  line-height:1;
  white-space:nowrap;
  box-sizing:border-box;
  min-width:3.65rem;
  justify-content:center;
}
.trending-user-level::after{
  content:"";
  position:absolute;
  right:-4px;
  top:50%;
  width:4px;
  height:42%;
  transform:translateY(-50%);
  border:1px solid color-mix(in srgb, var(--md-accent-fg-color) 48%, transparent);
  border-left:0;
  border-radius:0 999px 999px 0;
  background:color-mix(in srgb, var(--md-accent-fg-color) 8%, transparent);
  pointer-events:none;
}
.trending-user-level-fill{
  position:absolute;
  inset:0 auto 0 0;
  width:0%;
  max-width:100%;
  min-width:0;
  border-radius:inherit;
  background:linear-gradient(90deg, color-mix(in srgb, var(--md-accent-fg-color) 26%, transparent), color-mix(in srgb, var(--md-accent-fg-color) 14%, transparent));
  z-index:0;
  pointer-events:none;
}
.trending-user-level strong,
.trending-user-level .trending-user-level-xp{
  position:relative;
  z-index:1;
}
.trending-user-level-xp{
  display:none;
}
.trending-user-total-xp{
  color:color-mix(in srgb, var(--md-default-fg-color) 70%, transparent);
  font-size:.72rem;
  font-weight:600;
  white-space:nowrap;
  line-height:1;
}
.trending-user-intro{
  min-width:0;
  color:color-mix(in srgb, var(--md-default-fg-color) 72%, transparent);
  font-size:.84rem;
  line-height:1.35;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.trending-user-intro.is-empty{
  opacity:.52;
  font-style:italic;
}
.trending-user-period-xp{
  justify-self:end;
  align-self:center;
  text-align:right;
  width:var(--trending-user-xp-col);
  min-width:0;
  font-size:.78rem;
  font-weight:600;
  font-variant-numeric:tabular-nums;
  color:var(--md-default-fg-color);
  white-space:nowrap;
}

@media (max-width: 900px), (pointer: coarse){
  .trending-metric-switch{
    justify-content:flex-start;
    gap:.55rem;
    margin-bottom:.85rem;
  }
  .trending-metric-btn{
    border-radius:999px;
    padding:.44rem 1rem;
    font-size:.88rem;
    white-space:nowrap;
  }
  .trending-unified .trending-tabs{
    flex-wrap:wrap;
    gap:8px;
  }
  .trending-unified .trending-tab{
    flex:0 0 auto;
    width:auto;
    max-width:100%;
    min-width:max-content;
    padding:.48rem .8rem;
    font-size:.78rem;
    white-space:nowrap;
    line-height:1.12;
  }
}



@media (max-width: 900px), (pointer: coarse){
  .trending-block[data-metric="users"]{
    --trending-user-rank-col:22px;
    --trending-user-xp-col:4.9rem;
    --trending-user-col-gap:8px;
  }
  .trending-user-item{
    grid-template-columns:var(--trending-user-rank-col) minmax(0, 1fr) var(--trending-user-xp-col) !important;
    grid-template-areas:none !important;
    column-gap:var(--trending-user-col-gap);
    margin:.42rem 0;
    padding:.46rem 0;
    border-radius:0;
    background:transparent;
    box-shadow:none;
  }
  .trending-user-item .trending-rank{
    width:20px;
    font-size:.78rem;
  }
  .trending-user-profile{
    grid-template-columns:58px minmax(0, 1fr);
    column-gap:9px;
  }
  .trending-user-avatar,
  .trending-user-avatar .trending-user-avatar-core{
    width:40px;
    height:40px;
    font-size:.78rem;
  }
  .trending-user-name{
    font-size:.90rem;
  }
  .trending-user-level{
    padding:.16rem .44rem;
    font-size:.62rem;
  }
  .trending-user-level-xp{
    display:none;
  }
  .trending-user-total-xp{
    flex-basis:100%;
    font-size:.62rem;
    line-height:1.15;
  }
  .trending-user-intro{
    font-size:.70rem;
    max-width:100%;
  }
  .trending-user-period-xp{
    width:var(--trending-user-xp-col);
    min-width:0;
    font-size:.74rem;
  }
}

    `.trim();
    document.head.appendChild(st);
  }

  function periodShortLabel(key) {
    if (key === "today") return "Today";
    if (key === "7d") return "Week";
    if (key === "30d") return "Month";
    if (key === "all") return "All time";
    return String(key || "");
  }

  function periodMetricLabel(period, metric) {
    const m = String(metric || "views");
    const p = String(period || "7d");

    if (m === "popular") {
      if (p === "today") return "Daily score";
      if (p === "7d") return "Weekly score";
      if (p === "30d") return "Monthly score";
      return "Total score";
    }

    if (m === "lively") {
      if (p === "today") return "Daily liveliness";
      if (p === "7d") return "Weekly liveliness";
      if (p === "30d") return "Monthly liveliness";
      return "Total liveliness";
    }

    if (m === "saved") {
      if (p === "today") return "Daily saves";
      if (p === "7d") return "Weekly saves";
      if (p === "30d") return "Monthly saves";
      return "Total saves";
    }

    if (m === "comments") {
      if (p === "today") return "Daily comments";
      if (p === "7d") return "Weekly comments";
      if (p === "30d") return "Monthly comments";
      return "Total comments";
    }

    if (m === "users") {
      if (p === "today") return "Daily XP";
      if (p === "7d") return "Weekly XP";
      if (p === "30d") return "Monthly XP";
      return "Total XP";
    }

    if (p === "today") return "Daily views";
    if (p === "7d") return "Weekly views";
    if (p === "30d") return "Monthly views";
    return "Total views";
  }

  function metricValue(item, metric) {
    if (!item) return 0;
    if (metric === "popular" || metric === "lively") {
      const v = item.score != null ? item.score : item.count;
      return Number.isInteger(Number(v)) ? String(Number(v)) : String(Number(v || 0).toFixed(1)).replace(/\.0$/, "");
    }
    if (metric === "users") {
      return formatTrendingXp(userPeriodXp(item));
    }
    return String(item.count || 0);
  }


  function firstDefinedValue(obj, keys) {
    const source = obj && typeof obj === "object" ? obj : {};
    const profile = source.profile && typeof source.profile === "object" ? source.profile : {};
    for (const key of keys || []) {
      if (source[key] != null && source[key] !== "") return source[key];
      if (profile[key] != null && profile[key] !== "") return profile[key];
    }
    return "";
  }

  function formatTrendingNumber(value) {
    const n = Number(value || 0);
    if (!Number.isFinite(n)) return "0";
    return (Math.round(n * 10) / 10).toFixed(1).replace(/\.0$/, "");
  }

  function formatTrendingXp(value) {
    return `${formatTrendingNumber(value)} XP`;
  }


  const TRENDING_ACCOUNT_XP_CACHE_PREFIX = "mk_account_xp_complete_cache_v6:";
  const TRENDING_ACCOUNT_XP_CACHE_LATEST_KEY = "mk_account_xp_complete_cache_latest_v6";
  const TRENDING_PROFILE_KEY = "mk_comment_profile_v1";

  function cleanTrendingProfileName(value) {
    return String(value || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim();
  }

  function readTrendingLocalProfile() {
    try {
      const obj = JSON.parse(localStorage.getItem(TRENDING_PROFILE_KEY) || "{}");
      return obj && typeof obj === "object" ? obj : {};
    } catch (_) { return {}; }
  }

  function parseTrendingXpCache(raw) {
    try {
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const score = parsed && parsed.score ? parsed.score : parsed;
      if (!score || typeof score !== "object") return null;
      if (!Array.isArray(score.breakdown) || !Array.isArray(score.dailySummary)) return null;
      const total = Number(score.totalScore != null ? score.totalScore : score.totalXp != null ? score.totalXp : score.score);
      if (!Number.isFinite(total)) return null;
      return Object.assign({}, score, { totalScore: total, cachedAt: Number((parsed && parsed.cachedAt) || score.cachedAt || score.lastSyncedAt || 0) || 0 });
    } catch (_) { return null; }
  }

  function trendingSnapshotBelongsToProfile(score, profile) {
    if (!score || !profile) return false;
    const accountKey = String(profile.accountKey || "").trim().toLowerCase();
    const profileName = cleanTrendingProfileName(profile.name || "").toLowerCase();
    const scoreKey = String(score.accountKey || score.account_key || "").trim().toLowerCase();
    const scoreName = cleanTrendingProfileName(score.name || score.title || score.username || score.displayName || "").toLowerCase();
    if (accountKey && scoreKey && accountKey === scoreKey) return true;
    if (profileName && scoreName && profileName === scoreName) return true;
    if (!scoreKey && profileName && scoreName === profileName) return true;
    return false;
  }


  function readTrendingLiveAccountXpSnapshot() {
    try {
      if (!window.MkAccountData || typeof window.MkAccountData.xp !== "function") return null;
      const profile = readTrendingLocalProfile();
      const xp = window.MkAccountData.xp();
      if (!xp || typeof xp !== "object") return null;
      const total = Number(xp.totalScore != null ? xp.totalScore : xp.totalXp != null ? xp.totalXp : xp.score);
      if (!Number.isFinite(total)) return null;
      const snap = Object.assign({}, xp, {
        accountKey: profile.accountKey || xp.accountKey || "",
        name: profile.name || xp.name || "",
        avatar: profile.avatar || xp.avatar || "",
        avatarFrame: profile.avatarFrame || xp.selectedAvatarFrame || xp.avatarFrame || "level-1",
        selectedAvatarFrame: profile.avatarFrame || xp.selectedAvatarFrame || xp.avatarFrame || "level-1",
        bio: profile.bio || xp.bio || "",
        intro: profile.bio || xp.intro || xp.bio || "",
        totalScore: Math.round(total * 10) / 10,
        totalXp: Math.round(total * 10) / 10,
        score: Math.round(total * 10) / 10,
        cachedAt: Date.now(),
        isCompleteXp: true,
        sourceEvents: true,
        source: "Local account event file",
        equippedCosmetics: (window.MkAccountData && typeof window.MkAccountData.getEquippedCosmetics === "function") ? window.MkAccountData.getEquippedCosmetics() : {}
      });
      return trendingSnapshotBelongsToProfile(snap, profile) ? snap : null;
    } catch (_) { return null; }
  }

  function readTrendingCurrentXpSnapshot() {
    try {
      const live = readTrendingLiveAccountXpSnapshot();
      if (live) return live;
      const profile = readTrendingLocalProfile();
      const keys = new Set([TRENDING_ACCOUNT_XP_CACHE_LATEST_KEY]);
      const accountKey = String(profile.accountKey || "").trim().toLowerCase();
      const name = cleanTrendingProfileName(profile.name || "").toLowerCase();
      if (accountKey) keys.add(TRENDING_ACCOUNT_XP_CACHE_PREFIX + accountKey);
      if (name) keys.add(TRENDING_ACCOUNT_XP_CACHE_PREFIX + name);

      // Be deliberately broader than the Account modal here.  The leaderboard can
      // be opened on a different page lifecycle from the Account panel, and older
      // successful XP snapshots were sometimes written under only the latest key,
      // only the name key, or only the account-key key.  Scan the v4 namespace and
      // then filter back to the current profile so the current user's leaderboard
      // row is painted from the exact same complete snapshot as Account.
      try {
        for (let i = 0; i < localStorage.length; i += 1) {
          const k = localStorage.key(i) || "";
          if (k === TRENDING_ACCOUNT_XP_CACHE_LATEST_KEY || k.indexOf(TRENDING_ACCOUNT_XP_CACHE_PREFIX) === 0) keys.add(k);
        }
      } catch (_) {}

      const candidates = [];
      const seen = new Set();
      keys.forEach((key) => {
        try {
          const raw = localStorage.getItem(key) || "";
          if (!raw || seen.has(raw)) return;
          seen.add(raw);
          const score = parseTrendingXpCache(raw);
          if (score && trendingSnapshotBelongsToProfile(score, profile)) candidates.push(score);
        } catch (_) {}
      });
      candidates.sort((a,b) => Number(b.cachedAt || b.lastSyncedAt || 0) - Number(a.cachedAt || a.lastSyncedAt || 0));
      return candidates[0] || null;
    } catch (_) { return null; }
  }

  function trendingDayStart(period) {
    const now = new Date();
    const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    if (period === "today") return new Date(utc).toISOString().slice(0, 10);
    if (period === "7d") return new Date(utc - 6 * 86400000).toISOString().slice(0, 10);
    if (period === "30d") return new Date(utc - 29 * 86400000).toISOString().slice(0, 10);
    return "";
  }

  function periodXpFromSnapshot(score, period) {
    if (!score) return 0;
    if (period === "all") return Number(score.totalScore || 0) || 0;
    const start = trendingDayStart(period);
    if (!start) return Number(score.totalScore || 0) || 0;
    return (Array.isArray(score.dailySummary) ? score.dailySummary : []).reduce((sum, row) => {
      const day = String(row && row.day || "");
      if (day && day >= start) return sum + Number(row && row.score || 0);
      return sum;
    }, 0);
  }

  function patchCurrentUserRankingItems(items, period, options) {
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return list;
    const opts = options && typeof options === "object" ? options : {};
    const preferLocalOwnScore = !!opts.preferLocalOwnScore;
    const profile = readTrendingLocalProfile();
    const accountKey = String(profile.accountKey || "").trim().toLowerCase();
    const profileName = cleanTrendingProfileName(profile.name || "").toLowerCase();
    if (!accountKey && !profileName) return list;
    const snap = readTrendingCurrentXpSnapshot();
    if (!snap) return list;
    const snapKey = String(snap.accountKey || "").trim().toLowerCase();
    const snapName = cleanTrendingProfileName(snap.name || profile.name || "").toLowerCase();
    const belongs = (accountKey && snapKey && accountKey === snapKey) || (profileName && snapName && profileName === snapName) || (!snapKey && profileName && snapName === profileName);
    if (!belongs) return list;

    const localPeriodScore = Math.round(periodXpFromSnapshot(snap, period) * 10) / 10;
    const localTotalScore = Math.round(Number(snap.totalScore || snap.totalXp || snap.score || 0) * 10) / 10;
    const level = Math.max(1, Math.floor(Number(snap.level || 1)) || 1);
    let changed = false;

    const patched = list.map((it) => {
      const itemKey = String(it && (it.accountKey || it.account_key || "") || "").trim().toLowerCase();
      const itemName = cleanTrendingProfileName(it && (it.name || it.title || it.username || it.displayName) || "").toLowerCase();
      const isMe = !!((accountKey && itemKey && accountKey === itemKey) || (profileName && itemName && profileName === itemName));
      if (!isMe) return it;
      changed = true;
      const serverPeriodScore = Math.round(userPeriodXp(it) * 10) / 10;
      const serverTotalScore = Math.round(userTotalXp(it) * 10) / 10;
      // A fresh cloud response remains server-authoritative. When the board is
      // explicitly showing a saved copy because cloud refresh failed, do not show
      // stale XP for the current account: the account panel's synced snapshot is
      // the newest trustworthy value this device has.
      const periodScore = preferLocalOwnScore && Number.isFinite(localPeriodScore) && localPeriodScore > 0
        ? localPeriodScore
        : (Number.isFinite(serverPeriodScore) ? serverPeriodScore : 0);
      const totalScore = preferLocalOwnScore && Number.isFinite(localTotalScore) && localTotalScore > 0
        ? localTotalScore
        : (Number.isFinite(serverTotalScore) ? serverTotalScore : 0);
      const selectedFrame = cleanAvatarFrameLocal(profile.avatarFrame || snap.selectedAvatarFrame || snap.avatarFrame || it.selectedAvatarFrame || it.avatarFrame || avatarFrameForLevelLocal(level));
      return Object.assign({}, it, {
        accountKey: it.accountKey || profile.accountKey || snap.accountKey || "",
        name: it.name || profile.name || snap.name || "",
        title: it.title || it.name || profile.name || snap.name || "",
        avatar: profile.avatar || snap.avatar || it.avatar || "",
        score: periodScore,
        count: periodScore,
        periodScore,
        totalScore,
        totalXp: totalScore,
        level,
        progressPct: snap.progressPct,
        levelStart: snap.levelStart,
        nextLevelStart: snap.nextLevelStart,
        avatarFrame: selectedFrame,
        selectedAvatarFrame: selectedFrame,
        equippedCosmetics: snap.equippedCosmetics || it.equippedCosmetics || {},
        rankingEffect: (snap.equippedCosmetics && snap.equippedCosmetics.ranking_effect) || it.rankingEffect || "",
        localXpSnapshotPatched: true
      });
    });

    // Do not inject the local user if the server did not return that row.  That
    // keeps the leaderboard a server list.  If the row is already present, patch
    // only its displayed XP/level from the same live local account snapshot used
    // by the account panel, then sort the visible slice consistently.
    if (!changed) return list;
    patched.sort((a,b) => Number(userPeriodXp(b) || 0) - Number(userPeriodXp(a) || 0) || Number(userTotalXp(b) || 0) - Number(userTotalXp(a) || 0) || userDisplayName(a).localeCompare(userDisplayName(b)));
    return patched;
  }

  function userPeriodXp(item) {
    const v = firstDefinedValue(item, ["periodScore", "periodXp", "earnedXp", "earnedXP", "score", "count", "xp"]);
    const n = Number(v || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function userTotalXp(item) {
    const v = firstDefinedValue(item, ["totalScore", "totalXp", "totalXP", "xpTotal", "overallScore", "lifetimeXp", "lifetimeXP", "score"]);
    const n = Number(v || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function userLevel(item) {
    const v = firstDefinedValue(item, ["level", "xpLevel", "currentLevel"]);
    const n = Math.floor(Number(v || 1));
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  const TRENDING_LEVEL_THRESHOLDS_LOCAL = [0, 50, 140, 300, 600, 1100, 1900, 3200, 5200, 8000];

  function clampTrendingPct(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  function userLevelProgressPct(item, totalXp, level) {
    const explicit = firstDefinedValue(item, ["progressPct", "levelProgressPct", "levelProgress", "xpProgressPct"]);
    if (explicit !== "") return clampTrendingPct(explicit);

    const startRaw = firstDefinedValue(item, ["levelStart", "currentLevelStart"]);
    const nextRaw = firstDefinedValue(item, ["nextLevelStart", "nextLevelXp", "nextLevelXP"]);
    let start = startRaw !== "" ? Number(startRaw) : NaN;
    let next = nextRaw !== "" ? Number(nextRaw) : NaN;

    const lvl = Math.max(1, Math.floor(Number(level || 1)));
    if (!Number.isFinite(start)) start = Number(TRENDING_LEVEL_THRESHOLDS_LOCAL[lvl - 1] || 0);
    if (!Number.isFinite(next)) next = lvl < TRENDING_LEVEL_THRESHOLDS_LOCAL.length ? Number(TRENDING_LEVEL_THRESHOLDS_LOCAL[lvl] || 0) : NaN;
    if (!Number.isFinite(next) || next <= start) return 100;

    return clampTrendingPct(((Number(totalXp || 0) - start) / Math.max(1, next - start)) * 100);
  }

  function formatTrendingPctStyle(pct) {
    const n = clampTrendingPct(pct);
    return String(Math.round(n * 10) / 10);
  }

  function userDisplayName(item) {
    return String(firstDefinedValue(item, ["name", "title", "username", "displayName"]) || "Public user").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim() || "Public user";
  }

  function userIntroText(item) {
    return String(firstDefinedValue(item, ["bio", "intro", "description", "profileIntro", "tagline"]) || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
  }

  function userAvatarValue(item) {
    return String(firstDefinedValue(item, ["avatar", "avatarUrl", "avatarURL", "photo", "photoUrl", "image", "imageUrl"]) || "").replace(/[\u0000-\u001f<>]/g, "").trim();
  }

  const AVATAR_FRAME_DEFS_LOCAL = [
    { id: "level-1", level: 1, label: "Clean Ring" },
    { id: "level-2", level: 2, label: "Bronze Studs" },
    { id: "level-3", level: 3, label: "Silver Compass" },
    { id: "level-4", level: 4, label: "Golden Beads" },
    { id: "level-5", level: 5, label: "Emerald Laurel" },
    { id: "level-6", level: 6, label: "Sapphire Crystal" },
    { id: "level-7", level: 7, label: "Amethyst Stars" },
    { id: "level-8", level: 8, label: "Ruby Flame" },
    { id: "level-9", level: 9, label: "Aurora Wings" },
    { id: "level-10", level: 10, label: "Royal Crown" },
  ];

  function cleanAvatarFrameLocal(value) {
    const raw = String(value || "").trim().toLowerCase();
    const m = raw.match(/^(?:level-|lv-?|frame-?)(10|[1-9])$/) || raw.match(/^(10|[1-9])$/);
    const n = m ? Math.max(1, Math.min(10, Number(m[1] || 1))) : 1;
    return `level-${n}`;
  }

  function avatarFrameLevelLocal(frameId) {
    const id = cleanAvatarFrameLocal(frameId);
    const m = id.match(/(10|[1-9])$/);
    return m ? Math.max(1, Math.min(10, Number(m[1]))) : 1;
  }

  function avatarFrameForLevelLocal(level) {
    const n = Math.max(1, Math.min(10, Number(level || 1)));
    return `level-${Math.floor(n)}`;
  }

  function userAvatarFrameValue(item) {
    const raw = firstDefinedValue(item, [
      "selectedAvatarFrame",
      "selectedFrame",
      "selected_frame",
      "avatarFrame",
      "avatar_frame",
      "profileAvatarFrame",
      "frame"
    ]);
    if (raw) return cleanAvatarFrameLocal(raw);
    return avatarFrameForLevelLocal(userLevel(item));
  }

  function avatarFrameLabelLocal(frameId) {
    const id = cleanAvatarFrameLocal(frameId);
    const found = AVATAR_FRAME_DEFS_LOCAL.find((f) => f.id === id);
    return found ? found.label : `Level ${avatarFrameLevelLocal(id)}`;
  }


  function avatarFrameSvgLocal(frameId) {
    const level = avatarFrameLevelLocal(frameId);
    const svgOpen = `<svg class="mk-avatar-frame-svg mk-avatar-frame-svg-${level}" viewBox="-28 -28 156 156" aria-hidden="true" focusable="false">`;
    const svgClose = `</svg>`;
    const circle = (r, attrs) => `<circle cx="50" cy="50" r="${r}" fill="none" ${attrs || ""}/>`;
    const polar = (deg, r) => {
      const a = (Number(deg) || 0) * Math.PI / 180;
      return [Number((50 + Math.cos(a) * r).toFixed(2)), Number((50 + Math.sin(a) * r).toFixed(2))];
    };
    const bead = (cx, cy, r, fill, stroke) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.76)"}" stroke-width="1.35"/>`;
    const beadAt = (deg, rad, rr, fill, stroke) => {
      const [x, y] = polar(deg, rad);
      return bead(x, y, rr, fill, stroke);
    };
    const tickAt = (deg, r1, r2, color, width) => {
      const [x1, y1] = polar(deg, r1);
      const [x2, y2] = polar(deg, r2);
      return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${width || 1.4}" stroke-linecap="round"/>`;
    };
    const dots = (count, rad, rr, fills, start) => Array.from({ length: count }, (_, i) => {
      const deg = (start == null ? -90 : start) + i * 360 / count;
      const fill = Array.isArray(fills) ? fills[i % fills.length] : fills;
      return beadAt(deg, rad, rr, fill, "rgba(255,255,255,.72)");
    }).join(" ");
    const ticks = (count, r1, r2, color, width, start) => Array.from({ length: count }, (_, i) => tickAt((start == null ? -90 : start) + i * 360 / count, r1, r2, color, width)).join(" ");
    const diamond = (cx, cy, size, fill, stroke) => {
      const z = Number(size) || 5;
      return `<path d="M ${cx} ${cy - z} L ${cx + z} ${cy} L ${cx} ${cy + z} L ${cx - z} ${cy} Z" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.82)"}" stroke-width="1.35" stroke-linejoin="round"/>`;
    };
    const diamondAt = (deg, rad, size, fill, stroke) => {
      const [x, y] = polar(deg, rad);
      return diamond(x, y, size, fill, stroke);
    };
    const star = (cx, cy, r1, r2, fill, stroke) => {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = (-90 + i * 36) * Math.PI / 180;
        const rr = i % 2 === 0 ? r1 : r2;
        pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
      }
      return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.82)"}" stroke-width="1.05" stroke-linejoin="round"/>`;
    };
    const starAt = (deg, rad, r1, r2, fill, stroke) => {
      const [x, y] = polar(deg, rad);
      return star(x, y, r1, r2, fill, stroke);
    };
    const leaf = (cx, cy, rot, fill, scale) => {
      const sc = Number(scale || 1);
      return `<path d="M ${cx} ${cy} C ${cx - 7 * sc} ${cy - 8 * sc}, ${cx - 15 * sc} ${cy - 6 * sc}, ${cx - 17 * sc} ${cy + 2 * sc} C ${cx - 9 * sc} ${cy + 4 * sc}, ${cx - 3 * sc} ${cy + 2 * sc}, ${cx} ${cy} Z" fill="${fill}" stroke="rgba(255,255,255,.62)" stroke-width="1" transform="rotate(${rot} ${cx} ${cy})"/>`;
    };
    const petalAt = (deg, rad, len, fill, stroke, twist) => {
      const [x, y] = polar(deg, rad);
      const rot = deg + (twist || 0);
      return `<path d="M ${x} ${y - len} C ${x + len * .72} ${y - len * .12}, ${x + len * .52} ${y + len * .56}, ${x} ${y + len * .88} C ${x - len * .52} ${y + len * .56}, ${x - len * .72} ${y - len * .12}, ${x} ${y - len} Z" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.72)"}" stroke-width="1.1" stroke-linejoin="round" transform="rotate(${rot} ${x} ${y})"/>`;
    };
    const shardAt = (deg, rad, len, fill, stroke, width) => {
      const [x, y] = polar(deg, rad);
      const w = width || len * .42;
      const rot = deg + 90;
      return `<path d="M ${x} ${y - len} L ${x + w} ${y + len * .12} L ${x} ${y + len * .72} L ${x - w} ${y + len * .12} Z" fill="${fill}" stroke="${stroke || "rgba(255,255,255,.82)"}" stroke-width="1.1" stroke-linejoin="round" transform="rotate(${rot} ${x} ${y})"/>`;
    };

    if (level === 1) {
      return `${svgOpen}
        ${circle(53, `stroke="rgba(122,133,150,.78)" stroke-width="3.2"`)}
        ${circle(57, `stroke="rgba(122,133,150,.25)" stroke-width="1.2"`)}
        ${ticks(8, 59, 62, "rgba(148,163,184,.32)", 1.1, -90)}
        ${beadAt(-90, 61, 2.4, "#cbd5e1", "#f8fafc")}
      ${svgClose}`;
    }
    if (level === 2) {
      return `${svgOpen}
        ${circle(52, `stroke="#9a5c2c" stroke-width="4.3"`)}
        ${circle(58, `stroke="rgba(245,186,117,.62)" stroke-width="1.6" stroke-dasharray="4 6"`)}
        ${circle(46, `stroke="rgba(120,53,15,.32)" stroke-width="1.4"`)}
        ${dots(8, 62, 3.4, ["#b87333", "#d08a45"])}
        ${ticks(16, 55, 59, "rgba(255,237,213,.48)", 1.05, -90)}
      ${svgClose}`;
    }
    if (level === 3) {
      return `${svgOpen}
        ${circle(52, `stroke="#cbd5e1" stroke-width="4.1"`)}
        ${circle(59, `stroke="rgba(148,163,184,.56)" stroke-width="1.55"`)}
        ${circle(45, `stroke="rgba(226,232,240,.30)" stroke-width="1.2" stroke-dasharray="7 7"`)}
        ${[ -90, 0, 90, 180 ].map((d) => diamondAt(d, 63, 6.1, "#e2e8f0", "#94a3b8")).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => diamondAt(d, 60, 3.7, "#f8fafc", "#cbd5e1")).join(" ")}
        ${ticks(12, 54, 61, "rgba(248,250,252,.55)", 1.25, -90)}
        <path d="M50 -4V12 M50 88v16 M-4 50H12 M88 50h16" stroke="#f8fafc" stroke-width="2.8" stroke-linecap="round"/>
      ${svgClose}`;
    }
    if (level === 4) {
      return `${svgOpen}
        ${circle(51, `stroke="#d99b22" stroke-width="5"`)}
        ${circle(58, `stroke="rgba(255,224,130,.76)" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(146,64,14,.34)" stroke-width="1.6"`)}
        ${dots(12, 63, 3.6, ["#facc15", "#f59e0b", "#fde68a"])}
        ${dots(12, 48, 1.25, "rgba(255,251,235,.70)", -75)}
        ${[ -90, 0, 90, 180 ].map((d) => diamondAt(d, 66, 4.2, "#fff7ad", "#ca8a04")).join(" ")}
      ${svgClose}`;
    }
    if (level === 5) {
      return `${svgOpen}
        ${circle(51, `stroke="#059669" stroke-width="4.8"`)}
        ${circle(58, `stroke="rgba(167,243,208,.62)" stroke-width="1.7" stroke-dasharray="10 8" stroke-linecap="round"`)}
        <path d="M 6 88 C -10 60, -6 29, 15 8" fill="none" stroke="#10b981" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M 94 88 C 110 60, 106 29, 85 8" fill="none" stroke="#10b981" stroke-width="4.2" stroke-linecap="round"/>
        ${leaf(19,82,-25,"#10b981",1.02)} ${leaf(10,68,-15,"#6ee7b7",.92)} ${leaf(7,53,0,"#34d399",.85)} ${leaf(10,38,14,"#10b981",.92)} ${leaf(20,21,31,"#6ee7b7",1)}
        ${leaf(81,82,205,"#10b981",1.02)} ${leaf(90,68,195,"#6ee7b7",.92)} ${leaf(93,53,180,"#34d399",.85)} ${leaf(90,38,166,"#10b981",.92)} ${leaf(80,21,149,"#6ee7b7",1)}
        ${diamondAt(-90, 64, 5.4, "#a7f3d0", "#047857")}
        ${dots(8, 49, 1.35, "rgba(236,253,245,.70)", -90)}
      ${svgClose}`;
    }
    if (level === 6) {
      return `${svgOpen}
        ${circle(51, `stroke="#2563eb" stroke-width="4.9"`)}
        ${circle(59, `stroke="rgba(96,165,250,.82)" stroke-width="2" stroke-dasharray="9 7" stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(191,219,254,.34)" stroke-width="1.45"`)}
        ${[ -90, 0, 90, 180 ].map((d) => shardAt(d, 64, 8.8, "#38bdf8", "#dbeafe", 4.4)).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => shardAt(d, 61, 5.7, "#60a5fa", "#eff6ff", 3.2)).join(" ")}
        <path d="M18 3 C33 -9, 67 -9, 82 3" fill="none" stroke="#bfdbfe" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M18 97 C33 109, 67 109, 82 97" fill="none" stroke="#bfdbfe" stroke-width="3.2" stroke-linecap="round"/>
        ${dots(12, 50, 1.2, ["#dbeafe", "#93c5fd"], -75)}
      ${svgClose}`;
    }
    if (level === 7) {
      return `${svgOpen}
        ${circle(51, `stroke="#7c3aed" stroke-width="5.1"`)}
        ${circle(60, `stroke="rgba(216,180,254,.78)" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"`)}
        ${circle(44, `stroke="rgba(233,213,255,.34)" stroke-width="1.4" stroke-dasharray="5 6"`)}
        ${[ -90, 90 ].map((d) => starAt(d, 65, 8, 3.4, "#c084fc", "#faf5ff")).join(" ")}
        ${[ -35, 35, 145, 215 ].map((d) => starAt(d, 64, 6.1, 2.5, "#a78bfa", "#ede9fe")).join(" ")}
        ${[ -65, -15, 70, 110, 195, 245 ].map((d) => starAt(d, 54, 3.2, 1.4, "#f0abfc", "#fdf4ff")).join(" ")}
        <path d="M 18 8 C 34 -3, 66 -3, 82 8" fill="none" stroke="#f0abfc" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M 20 93 C 35 101, 65 101, 80 93" fill="none" stroke="#c4b5fd" stroke-width="2.2" stroke-linecap="round"/>
        ${dots(14, 49, 1.05, ["#f5d0fe", "#ddd6fe"], -86)}
      ${svgClose}`;
    }
    if (level === 8) {
      return `${svgOpen}
        ${circle(51, `stroke="#e11d48" stroke-width="5.2"`)}
        ${circle(60, `stroke="rgba(253,164,175,.78)" stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round"`)}
        ${[ -90, 0, 90, 180 ].map((d) => petalAt(d, 63, 10.2, "#fb7185", "#fff1f2", 0)).join(" ")}
        ${[ -45, 45, 135, 225 ].map((d) => petalAt(d, 61, 7.3, "#f97316", "#ffedd5", 5)).join(" ")}
        ${[ -20, 20, 160, 200 ].map((d) => shardAt(d, 57, 5.2, "#f43f5e", "#ffe4e6", 3)).join(" ")}
        ${diamondAt(-90, 47, 4.5, "#fecdd3", "#be123c")}
        ${diamondAt(90, 47, 4.5, "#fecdd3", "#be123c")}
        ${dots(16, 50, 1.05, ["#ffe4e6", "#fed7aa"], -90)}
      ${svgClose}`;
    }
    if (level === 9) {
      return `${svgOpen}
        ${circle(51, `stroke="#06b6d4" stroke-width="5.2"`)}
        ${circle(60, `stroke="rgba(240,171,252,.72)" stroke-width="2" stroke-dasharray="12 6" stroke-linecap="round"`)}
        <path d="M -12 61 C 7 23, 23 1, 46 -11" fill="none" stroke="#a78bfa" stroke-width="5.4" stroke-linecap="round"/>
        <path d="M 112 61 C 93 23, 77 1, 54 -11" fill="none" stroke="#f0abfc" stroke-width="5.4" stroke-linecap="round"/>
        <path d="M -5 78 C 12 48, 25 28, 45 8" fill="none" stroke="#22d3ee" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M 105 78 C 88 48, 75 28, 55 8" fill="none" stroke="#f472b6" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M -2 88 C 18 94, 33 103, 46 118" fill="none" stroke="#67e8f9" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M 102 88 C 82 94, 67 103, 54 118" fill="none" stroke="#f9a8d4" stroke-width="4.2" stroke-linecap="round"/>
        ${starAt(-90, 68, 7.5, 3.2, "#fde68a", "#fffbeb")}
        ${[ -55, -18, 18, 55, 125, 162, 198, 235 ].map((d) => starAt(d, 66, 4.2, 1.8, d < 90 ? "#f0abfc" : "#93c5fd", "#f8fafc")).join(" ")}
        ${diamondAt(90, 67, 7, "#67e8f9", "#e0f2fe")}
        ${dots(18, 49, 1.15, ["#cffafe", "#fae8ff", "#fde68a"], -90)}
      ${svgClose}`;
    }
    return `${svgOpen}
      ${circle(51, `stroke="#f59e0b" stroke-width="5.6"`)}
      ${circle(61, `stroke="rgba(251,191,36,.88)" stroke-width="2.4" stroke-dasharray="3 5" stroke-linecap="round"`)}
      ${circle(43, `stroke="rgba(254,240,138,.34)" stroke-width="1.5" stroke-dasharray="8 5"`)}
      <path d="M 16 -9 L 32 10 L 50 -20 L 68 10 L 84 -9 L 80 19 L 20 19 Z" fill="#facc15" stroke="#fff7ad" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 25 18 C 35 23, 65 23, 75 18" fill="none" stroke="#fef3c7" stroke-width="2" stroke-linecap="round"/>
      ${diamond(50,-2,6,"#ef4444","#fff1f2")} ${diamond(32,8,4.7,"#38bdf8","#eff6ff")} ${diamond(68,8,4.7,"#a855f7","#faf5ff")}
      <path d="M 3 87 C -14 55, -5 20, 20 3" fill="none" stroke="#fcd34d" stroke-width="4.4" stroke-linecap="round"/>
      <path d="M 97 87 C 114 55, 105 20, 80 3" fill="none" stroke="#fcd34d" stroke-width="4.4" stroke-linecap="round"/>
      ${leaf(18,82,-25,"#fde68a",1.02)} ${leaf(8,62,-8,"#fbbf24",.92)} ${leaf(15,39,16,"#fef08a",.86)}
      ${leaf(82,82,205,"#fde68a",1.02)} ${leaf(92,62,188,"#fbbf24",.92)} ${leaf(85,39,164,"#fef08a",.86)}
      ${dots(16, 63, 3.2, ["#facc15", "#fbbf24", "#fde68a", "#f97316"], -90)}
      ${[ -60, -30, 30, 60, 120, 150, 210, 240 ].map((d) => starAt(d, 56, 4.2, 1.8, "#fff7ad", "#fef3c7")).join(" ")}
      ${beadAt(90, 68, 5.2, "#ef4444", "#fff1f2")} ${beadAt(0, 68, 4.5, "#38bdf8", "#eff6ff")} ${beadAt(180, 68, 4.5, "#a855f7", "#faf5ff")}
    ${svgClose}`;
  }


  function userInitials(name) {
    const clean = String(name || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim();
    if (!clean) return "?";
    const parts = clean.split(/\s+/).filter(Boolean);
    const a = parts[0] || clean;
    const b = parts.length > 1 ? parts[parts.length - 1] : "";
    return ((a[0] || "") + (b ? b[0] : "")).toUpperCase();
  }

  function isImageAvatarValue(value) {
    return /^(https?:\/\/|data:image\/|\/|r2:)/i.test(String(value || ""));
  }

  function displayAvatarValue(value) {
    const raw = String(value || "").trim();
    if (!/^r2:/i.test(raw)) return raw;
    const key = raw.replace(/^r2:/i, "");
    if (!key || key.indexOf("..") >= 0 || key[0] === "/" || key.indexOf("comment-avatars/") !== 0) return "";
    try { return new URL(`/avatar/${encodeURIComponent(key)}`, API_BASE).toString(); }
    catch (_) { return ""; }
  }

  function trendingUserAvatarHtml(item, name) {
    const avatar = displayAvatarValue(userAvatarValue(item));
    const frame = userAvatarFrameValue(item);
    const frameCls = ` mk-avatar-frame mk-avatar-frame-${frame}`;
    const frameLabel = `${avatarFrameLabelLocal(frame)} avatar frame`;
    const frameSvg = avatarFrameSvgLocal(frame);
    if (avatar && isImageAvatarValue(avatar)) {
      return `<span class="trending-user-avatar has-image${frameCls}" title="${escapeTrendingHtml(frameLabel)}" aria-hidden="true"><span class="trending-user-avatar-core"><img src="${escapeTrendingHtml(avatar)}" alt="" loading="lazy" decoding="async"></span>${frameSvg}</span>`;
    }
    const text = avatar || userInitials(name);
    return `<span class="trending-user-avatar${frameCls}" title="${escapeTrendingHtml(frameLabel)}" aria-hidden="true"><span class="trending-user-avatar-core">${escapeTrendingHtml(String(text).slice(0, 4))}</span>${frameSvg}</span>`;
  }

  function openTrendingPublicProfile(input) {
    try {
      if (!window.MkLocalActivity || typeof window.MkLocalActivity.openPublicProfile !== "function") return;
      const item = input && typeof input === "object" ? input : null;
      const name = item ? userDisplayName(item) : String(input || "");
      const accountKey = item ? String(item.accountKey || item.account_key || "").trim() : "";
      let selfPreview = false;
      try {
        const me = readTrendingLocalProfile();
        const meKey = String(me && me.accountKey || "").trim().toLowerCase();
        selfPreview = !!(accountKey && meKey && accountKey.toLowerCase() === meKey);
      } catch (_) {}
      const payload = item ? {
        accountKey,
        account_key: accountKey,
        selfPreview,
        source: "rankings",
        rankingProfile: item ? {
          accountKey,
          name,
          avatar: userAvatarValue(item),
          avatarFrame: userAvatarFrameValue(item),
          bio: userIntroText(item),
          intro: userIntroText(item),
          equippedCosmetics: item.equippedCosmetics || {},
          rankingEffect: item.rankingEffect || ""
        } : null,
        rankingXp: {
          totalXp: formatTrendingNumber(userTotalXp(item)),
          periodXp: formatTrendingNumber(userPeriodXp(item)),
          level: userLevel(item),
          progressPct: userLevelProgressPct(item, userTotalXp(item), userLevel(item)),
          accountKey,
          source: "rankings"
        }
      } : null;
      window.MkLocalActivity.openPublicProfile(name || accountKey || "", payload || undefined);
    } catch (_) {}
  }


    // ===== Lecture map (path -> lecture number), loaded once =====
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

  function safePath(loc) {
    const s0 = String(loc || "");
    return (s0.split("#")[0] || s0).replace(/^\/+/, "");
  }

  function asStringList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.map(String).filter(Boolean);
    if (typeof x === "string") return [x];
    return [];
  }

  // ===== Search index docs (for 'page exists' checks) =====
  let __indexDocsPromise = null;
  function loadIndexDocsOnce() {
    if (__indexDocsPromise) return __indexDocsPromise;
    __indexDocsPromise = (async () => {
      const root = getSiteRootUrl();
      const url = new URL("search/search_index.json", root).toString();
      const res = await fetch(url, { cache: "no-cache" }).catch(() => null);
      const j = res && res.ok ? await res.json().catch(() => null) : null;
      return j && Array.isArray(j.docs) ? j.docs : [];
    })();
    return __indexDocsPromise;
  }

  let __validPathSetPromise = null;
  function loadValidPathSetOnce() {
    if (__validPathSetPromise) return __validPathSetPromise;
    __validPathSetPromise = (async () => {
      const docs = await loadIndexDocsOnce().catch(() => []);
      const set = new Set();
      for (const d of docs) {
        const loc = safePath(d && d.location);
        if (loc) set.add(loc);
      }
      return set;
    })();
    return __validPathSetPromise;
  }

  let __titleMapPromise = null;
  function loadTitleMapOnce() {
    if (__titleMapPromise) return __titleMapPromise;
    __titleMapPromise = (async () => {
      const docs = await loadIndexDocsOnce().catch(() => []);
      const map = new Map();
      for (const d of docs) {
        const loc = safePath(d && d.location);
        if (!loc) continue;
        const title = cleanTitle(d && d.title);
        if (!title || titleLooksLikePathForTrending(title)) continue;
        const key = titleLookupKey(loc);
        if (key && !map.has(key)) map.set(key, title);
        if (key.endsWith(".html")) map.set(key.slice(0, -5), title);
        else map.set(key + ".html", title);
      }
      return map;
    })();
    return __titleMapPromise;
  }

  function isExistingPagePath(p, validSet) {
    // fail-open if index failed to load
    if (!validSet || !(validSet instanceof Set)) return true;

    const key = safePath(p);
    if (!key) return false;

    if (validSet.has(key)) return true;

    // tolerate minor style differences
    if (!key.endsWith(".html") && validSet.has(key + ".html")) return true;
    if (key.endsWith(".html") && validSet.has(key.slice(0, -5))) return true;

    return false;
  }

  function hotCacheKey(metric, period, limit, offset) {
    return "mk_trending_hot_cache_v2:" + [metric, period, limit, offset].map((x) => String(x || "")).join(":");
  }

  function userBoardCacheKey(period) {
    return "mk_trending_user_board_cache_v1:" + v2RankingPeriodParam(period);
  }

  function userRankingDedupeKey(item) {
    const accountKey = String(item && (item.accountKey || item.account_key) || "").trim().toLowerCase();
    if (accountKey) return "account:" + accountKey;
    const path = String(item && item.path || "").trim().toLowerCase();
    if (path && path.startsWith("user:")) return "path:" + path;
    const name = cleanTrendingProfileName(item && (item.name || item.title || item.username || item.displayName) || "").toLowerCase();
    return name ? "name:" + name : "";
  }

  function dedupeUserRankingItems(items) {
    const out = [];
    const seen = new Set();
    (Array.isArray(items) ? items : []).forEach((item) => {
      const key = userRankingDedupeKey(item);
      if (key) {
        if (seen.has(key)) return;
        seen.add(key);
      }
      out.push(item);
    });
    return out;
  }

  function readUserBoardCache(period) {
    try {
      const row = JSON.parse(localStorage.getItem(userBoardCacheKey(period)) || "{}");
      const data = row && row.data || {};
      const items = dedupeUserRankingItems(Array.isArray(data.items) ? data.items : []);
      if (!items.length) return null;
      return { items, total: Number(data.total || items.length) || items.length, cached: true, cachedAt: Number(row.ts || 0) || 0 };
    } catch (_) { return null; }
  }

  function writeUserBoardCache(period, data) {
    try {
      if (!data || !Array.isArray(data.items) || !data.items.length) return;
      const items = dedupeUserRankingItems(data.items);
      if (!items.length) return;
      localStorage.setItem(userBoardCacheKey(period), JSON.stringify({ ts: Date.now(), data: { items, total: data.total || items.length } }));
    } catch (_) {}
  }

  function readHotCache(metric, period, limit, offset) {
    try {
      const raw = localStorage.getItem(hotCacheKey(metric, period, limit, offset));
      if (!raw) return null;
      const row = JSON.parse(raw);
      if (!row || typeof row !== "object") return null;
      const ts = Number(row.ts || 0);
      if (!ts) return null;
      if (metric !== "users" && Date.now() - ts > 24 * 60 * 60 * 1000) return null;
      const data = row.data || {};
      const items = metric === "users" ? dedupeUserRankingItems(data.items) : (Array.isArray(data.items) ? data.items : []);
      if (metric === "users" && !items.length) return null;
      return {
        items,
        total: typeof data.total === "number" ? data.total : 0,
        cached: true,
        cachedAt: ts,
      };
    } catch (_) {
      return null;
    }
  }

  function writeHotCache(metric, period, limit, offset, data) {
    try {
      if (!data || !Array.isArray(data.items)) return;
      const items = metric === "users" ? dedupeUserRankingItems(data.items) : data.items;
      if (metric === "users" && !items.length) return;
      localStorage.setItem(hotCacheKey(metric, period, limit, offset), JSON.stringify({ ts: Date.now(), data: { items, total: data.total || 0 } }));
      if (metric === "users") writeUserBoardCache(period, Object.assign({}, data, { items }));
    } catch (_) {}
  }

  function trendingVisitorId() {
    try { return String(localStorage.getItem("mk_hot_visitor_id_v1") || "").trim(); }
    catch (_) { return ""; }
  }

  function v2RankingPeriodParam(period) {
    const p = String(period || "").toLowerCase();
    if (p === "today" || p === "daily") return "daily";
    if (p === "7d" || p === "weekly") return "weekly";
    if (p === "30d" || p === "monthly") return "monthly";
    return "all";
  }

  function normaliseUserRankingItems(data) {
    const rawItems = Array.isArray(data && data.entries) ? data.entries : (Array.isArray(data && data.items) ? data.items : []);
    return dedupeUserRankingItems(rawItems.map((it) => {
      const score = Number(firstDefinedValue(it, ["periodScore", "score", "xp", "count"]) || 0);
      const total = Number(firstDefinedValue(it, ["totalScore", "totalXp", "totalXP", "xpTotal", "overallScore", "lifetimeXp", "lifetimeXP"]) || score || 0);
      return Object.assign({}, it, {
        kind: "user",
        path: it && it.path || `user:${String(it && (it.accountKey || it.account_key || "") || "")}`,
        score: Number.isFinite(score) ? score : 0,
        count: Number.isFinite(score) ? score : 0,
        periodScore: Number.isFinite(score) ? score : 0,
        totalScore: Number.isFinite(total) ? total : 0,
        totalXp: Number.isFinite(total) ? total : 0,
      });
    }));
  }

  async function fetchUserRankings({ period, limit, offset }) {
    const url = new URL(API_BASE + "/v2/rankings");
    url.searchParams.set("period", v2RankingPeriodParam(period));
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    const visitorId = trendingVisitorId();
    if (visitorId) url.searchParams.set("visitorId", visitorId);
    url.searchParams.set("fresh", String(Date.now()));
    url.searchParams.set("r", Math.random().toString(36).slice(2));

    const resp = await fetch(url.toString(), {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    }).catch(() => null);
    const data = resp && resp.ok ? await resp.json().catch(() => null) : null;
    if (data && data.ok !== false && (Array.isArray(data.entries) || Array.isArray(data.items))) {
      const items = normaliseUserRankingItems(data);
      const fresh = {
        items,
        total: typeof data.count === "number" ? data.count : (typeof data.total === "number" ? data.total : items.length),
        fetchedAt: Date.now(),
        source: "v2-rankings",
      };
      writeHotCache("users", period, limit, offset, fresh);
      return fresh;
    }

    const cached = readHotCache("users", period, limit, offset) || readUserBoardCache(period);
    if (cached) return Object.assign({}, cached, { stale: true, refreshFailed: true });
    return { items: [], total: 0, stale: true, refreshFailed: true };
  }

  async function fetchHot({ metric, period, limit, offset }) {
    if (metric === "users") return fetchUserRankings({ period, limit, offset });

    const url = new URL(API_BASE + "/hot");
    url.searchParams.set("metric", metric);
    url.searchParams.set("period", period);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("fresh", String(Date.now()));
    url.searchParams.set("r", Math.random().toString(36).slice(2));

    const resp = await fetch(url.toString(), {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    }).catch(() => null);
    const data = resp && resp.ok ? await resp.json().catch(() => null) : null;
    if (data && Array.isArray(data.items)) {
      const fresh = {
        items: data.items,
        total: typeof data.total === "number" ? data.total : data.items.length,
        fetchedAt: Date.now(),
      };
      writeHotCache(metric, period, limit, offset, fresh);
      return fresh;
    }

    const cached = readHotCache(metric, period, limit, offset);
    if (cached) return Object.assign({}, cached, { stale: true, refreshFailed: true });
    return { items: [], total: 0, stale: true, refreshFailed: true };
  }

  function getTagsFromDoc(d) {
    const out = [];
    out.push(...asStringList(d && d.tags));
    out.push(...asStringList(d && d.tag));
    out.push(...asStringList(d && d.meta && d.meta.tags));
    out.push(...asStringList(d && d.meta && d.meta.tag));
    return out.map(s => String(s).trim()).filter(Boolean);
  }

  function lectureNumFromTags(tagsArr) {
    const info = unitInfoFromTags(tagsArr);
    return info ? info.lectureNum : 0;
  }

  let __lectureMapPromise = null;
  function loadLectureMapOnce() {
    if (__lectureMapPromise) return __lectureMapPromise;

    __lectureMapPromise = (async () => {
      const docs = await loadIndexDocsOnce().catch(() => []);

      const map = new Map();
      for (const d of docs) {
        const loc = safePath(d && d.location);
        if (!loc || map.has(loc)) continue;
        const info = unitInfoFromTags(getTagsFromDoc(d));
        if (info && info.unitNum) map.set(loc, info);
      }
      return map;
    })();

    return __lectureMapPromise;
  }


  function isTrendingPage() {
    return !!document.getElementById("trending-app");
  }

  const TRENDING_METRICS = [
    { key: "views", title: "Most viewed" },
    { key: "popular", title: "Most popular" },
    { key: "lively", title: "Most lively" },
    { key: "saved", title: "Most saved" },
    { key: "users", title: "Most active users" },
  ];

  function normaliseTrendingMetric(metric) {
    let key = String(metric || "").toLowerCase();
    if (key === "comments" || key === "buzz" || key === "buzzing" || key === "liveliness") key = "lively";
    if (key === "saved_pages" || key === "saves" || key === "most_saved") key = "saved";
    return TRENDING_METRICS.some((m) => m.key === key) ? key : "views";
  }

  function emitSortFilterUsed(kind, detail) {
    try {
      document.dispatchEvent(new CustomEvent("mk:sort-filter-used", {
        detail: Object.assign({
          source: "trending-page",
          controlKind: kind || "sort",
          sortFilterSignalVersion: 8,
        }, detail || {})
      }));
    } catch (_) {}
  }

  function readInitialTrendingMetric() {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("metric")) return normaliseTrendingMetric(url.searchParams.get("metric"));
    } catch (_) {}
    try {
      const hash = String(window.location.hash || "").replace(/^#/, "").toLowerCase();
      if (hash) return normaliseTrendingMetric(hash);
    } catch (_) {}
    return "views";
  }

  function writeTrendingMetricToUrl(metric) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("metric", normaliseTrendingMetric(metric));
      url.hash = "";
      window.history.replaceState(null, "", url.toString());
    } catch (_) {}
  }

  const PERIODS = [
    { key: "today", label: "Top 10 Today", limit: 10 },
    { key: "7d", label: "Top 10 This week", limit: 10 },
    { key: "30d", label: "Top 10 This month", limit: 10 },
    { key: "all", label: "Top 100 All time", limit: 10 },
  ];

  // "All time" is intentionally capped to the first 100 valid pages.
  const ALL_TIME_CAP = 100;

  // Rankings must be fresh each time the page is opened or a tab is selected.
  // Do not memoise /hot responses in memory: MkDocs instant navigation keeps the
  // same JS context alive across page visits, so an in-page cache can otherwise
  // show an old leaderboard after returning to the Rankings page.

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  // Only hide find/custom utility pages, do not over-filter
  function isUtilityPath(p) {
    const s = String(p || "").toLowerCase();
    const base = (s.split("?")[0].split("#")[0].split("/").pop() || "").trim();
    return base === "find.html" || base === "find" || base === "custom-random.html" || base === "custom-random";
  }

  function buildAllTimePages(totalPages, currentPage) {
    const tp = Math.max(1, totalPages);
    const cur = Math.min(Math.max(1, currentPage), tp);

    // show: 1, 2, ... cur-2..cur+2, ... tp-1, tp
    const set = new Set([1, 2, tp - 1, tp, cur, cur - 1, cur - 2, cur + 1, cur + 2]);
    const nums = Array.from(set).filter(n => n >= 1 && n <= tp).sort((a, b) => a - b);

    const out = [];
    let prev = 0;
    for (const n of nums) {
      if (prev && n - prev > 1) out.push("…");
      out.push(n);
      prev = n;
    }
    return out;
  }

  function buildBlock({ title, metric, deferInitialLoad }) {
    const block = el("section", "trending-block");
    block.dataset.metric = metric || "views";

    const header = el("div", "trending-block-header");
    header.appendChild(el("h2", "trending-block-title", title));

    let metaHeadEl = null;

    if (!IS_MOBILE_UI) {
      metaHeadEl = el("div", "trending-metahead", periodMetricLabel("7d", metric));
      header.appendChild(metaHeadEl);
    }
const tabs = el("div", "trending-tabs");
    PERIODS.forEach((p) => {
      const btn = el("button", "trending-tab", p.label);
      btn.setAttribute("aria-label", p.label);
      btn.type = "button";
      btn.dataset.period = p.key;
      tabs.appendChild(btn);
    });
    header.appendChild(tabs);

    let colHeadEl = null;
    if (IS_MOBILE_UI) {
      colHeadEl = el("div", "trending-colhead");
      colHeadEl.appendChild(el("span", "trending-colhead-spacer", ""));
      colHeadEl.appendChild(el("span", "trending-colhead-left", metric === "users" ? "User" : "Concept"));
      colHeadEl.appendChild(el("span", "trending-colhead-right", periodMetricLabel("7d", metric)));
    }

    const list = el("ol", "trending-list");
    const footer = el("div", "trending-footer");

    const prev = el("button", "trending-page-btn");
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous page");
    prev.textContent = "←";

    const pages = el("div", "trending-pages");

    const next = el("button", "trending-page-btn");
    next.type = "button";
    next.setAttribute("aria-label", "Next page");
    next.textContent = "→";

    footer.appendChild(prev);
    footer.appendChild(pages);
    footer.appendChild(next);

    // Per-board freshness line + a small per-board refresh button. Users can
    // refresh just this leaderboard in place instead of reloading the page.
    const boardMeta = el("div", "trending-board-meta");
    const boardMetaTime = el("span", "trending-board-time", "");
    const boardRefresh = el("button", "trending-board-refresh");
    boardRefresh.type = "button";
    boardRefresh.setAttribute("aria-label", "Refresh this ranking");
    boardRefresh.title = "Refresh this ranking from the cloud";
    boardRefresh.innerHTML = "<span class=\"trending-board-refresh-icon\" aria-hidden=\"true\">↻</span><span class=\"trending-board-refresh-text\">Refresh</span>";
    boardMeta.appendChild(boardMetaTime);
    boardMeta.appendChild(boardRefresh);

    block.appendChild(header);
    if (colHeadEl) block.appendChild(colHeadEl);
    block.appendChild(list);
    block.appendChild(footer);
    block.appendChild(boardMeta);

    const state = {
      metric,
      period: "7d", // default: this week
      offset: 0,
      total: 0,
    };

    // In-memory per-period cache for this board. Once a period has been loaded,
    // switching tabs (or paginating all-time) reuses it with NO new download until
    // the user hits Refresh or the page is reopened. It lives only for this JS
    // context, so a real page reload still fetches fresh.
    const periodCache = new Map();

    function formatBoardTime(ts) {
      const d = new Date(Number(ts) || Date.now());
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    function updateBoardMeta(fetchedAt, opts) {
      if (!boardMetaTime) return;
      const o = opts || {};
      if (o.loading) { boardMetaTime.textContent = "Updating…"; return; }
      if (o.refreshFailed && !fetchedAt) { boardMetaTime.textContent = "Cloud refresh failed"; return; }
      if (!fetchedAt) { boardMetaTime.textContent = ""; return; }
      if (o.refreshFailed) {
        boardMetaTime.textContent = `Saved ${formatBoardTime(fetchedAt)} · cloud refresh failed`;
        return;
      }
      if (o.stale) {
        boardMetaTime.textContent = `Saved ${formatBoardTime(fetchedAt)}`;
        return;
      }
      boardMetaTime.textContent = `Updated ${formatBoardTime(fetchedAt)}${o.cached ? " (cached)" : ""}`;
    }


function updateMetaHead() {
  // Desktop: label sits in header
  if (metaHeadEl) metaHeadEl.textContent = periodMetricLabel(state.period, metric);

  // Mobile: label sits in the column head row (not next to tabs)
  if (colHeadEl) {
    const right = colHeadEl.querySelector(".trending-colhead-right");
    if (right) right.textContent = periodMetricLabel(state.period, metric);
  }
}


    function setActiveTab() {
      tabs.querySelectorAll(".trending-tab").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.period === state.period);
      });

      updateMetaHead();
    }




    // per-block cache: All-time list (filtered against current search index)
    let __allTimeValidPromise = null;
    async function loadAllTimeValidItems(options) {
      if (options && options.forceFresh) __allTimeValidPromise = null;
      if (__allTimeValidPromise) return __allTimeValidPromise;

      __allTimeValidPromise = (async () => {
        const validSet = await loadValidPathSetOnce().catch(() => null);

        const out = [];
        const seen = new Set();

        const CHUNK = 50;  // API 实际最多返回 50
        let offset = 0;
        let total = Infinity;
        let guard = 0;

        while (offset < total && guard < 200) {
          guard++;
          const r = await fetchHot({ metric, period: "all", limit: CHUNK, offset }).catch(() => ({
            items: [],
            total: 0,
            refreshFailed: true,
            stale: true,
          }));
          if (options && typeof options.onResult === "function") {
            try { options.onResult(r); } catch (_) {}
          }

          const chunk = Array.isArray(r.items) ? r.items : [];
          if (typeof r.total === "number" && r.total > 0) total = r.total;

          if (!chunk.length) break;

          for (const it of chunk) {
            const p = metric === "users" ? String((it && (it.accountKey || it.name || it.path)) || "") : safePath(it && it.path);
            if (!p) continue;
            if (metric !== "users") {
              if (isUtilityPath(p)) continue;
              if (!isExistingPagePath(p, validSet)) continue;
            }

            // defensive dedupe
            if (seen.has(p)) continue;
            seen.add(p);

            out.push(it);

            // hard-cap "all time" to top 100 to keep UI stable
            if (out.length >= ALL_TIME_CAP) return out;
          }

          offset += chunk.length;
        }

        return out;
      })();

      return __allTimeValidPromise;
    }

    async function load(options) {
      const loadOptions = options && typeof options === "object" ? options : {};
      const forceFresh = !!loadOptions.forceFresh;
      const periodConfig = PERIODS.find((x) => x.key === state.period) || PERIODS[1];
      const limit = periodConfig.limit;

      const cached = periodCache.get(state.period) || null;
      const willFetch = forceFresh || !cached;

      list.classList.add("is-loading");
      // Only show the "Loading..." flash when we will actually hit the network.
      // Cached tab switches re-render instantly without a wipe-and-reload.
      if (willFetch) {
        list.innerHTML = "";
        list.appendChild(el("li", "trending-loading", "Loading..."));
        updateBoardMeta(0, { loading: true });
      }

      let items = [];
      let fetchedAt = cached ? cached.fetchedAt : 0;
      const usedCache = !!cached && !forceFresh;
      let fetchStatus = cached && cached.status ? cached.status : {};

      // "All time" needs stable pagination, so we fully filter client-side once.
      if (state.period === "all") {
        let allItems;
        if (cached && !forceFresh) {
          allItems = Array.isArray(cached.allItems) ? cached.allItems : [];
        } else {
          // A FAILED fetch must NOT be cached: otherwise the empty result is
          // pinned as "Updated … (cached)" and every tab switch keeps showing
          // "No data yet" until a manual refresh (the phone bug). Only a fetch
          // that actually completed — even with a genuinely empty board — gets
          // cached; an error leaves the cache empty so the next view retries.
          let fetchOk = true;
          allItems = await loadAllTimeValidItems({
            forceFresh,
            onResult: (r) => {
              if (r && (r.refreshFailed || r.stale || r.cached)) {
                fetchStatus = { refreshFailed: !!r.refreshFailed, stale: !!r.stale, cached: !!r.cached };
                if (r.cachedAt) fetchedAt = Number(r.cachedAt || 0) || fetchedAt;
              }
            }
          }).catch(() => { fetchOk = false; fetchStatus = { refreshFailed: true, stale: true }; return []; });
          const cleanAllItems = Array.isArray(allItems) ? allItems : [];
          if (!fetchedAt && !(fetchStatus && fetchStatus.refreshFailed && !cleanAllItems.length)) fetchedAt = Date.now();
          if (fetchOk && !(fetchStatus && fetchStatus.refreshFailed && !Array.isArray(allItems))) {
            if (!(fetchStatus && fetchStatus.refreshFailed && !cleanAllItems.length)) periodCache.set(state.period, { fetchedAt, allItems: cleanAllItems, status: fetchStatus });
          }
        }

        const patchedAllItems = dedupeUserRankingItems(patchCurrentUserRankingItems(Array.isArray(allItems) ? allItems : [], state.period, {
          preferLocalOwnScore: !!(fetchStatus && (fetchStatus.refreshFailed || fetchStatus.stale))
        })).slice(0, ALL_TIME_CAP);
        state.total = Math.min(ALL_TIME_CAP, patchedAllItems.length);
        if (state.offset >= state.total) state.offset = Math.max(0, state.total - limit);
        items = patchedAllItems.slice(state.offset, state.offset + limit);
      } else {
        let rawItems;
        if (cached && !forceFresh) {
          rawItems = Array.isArray(cached.rawItems) ? cached.rawItems : [];
        } else {
          // oversample so "deleted pages" won't shrink the top-10 list
          const oversample = Math.max(limit, 60);
          // Only cache a fetch that actually succeeded (see the all-time note):
          // a network error must not pin an empty "No data yet (cached)" board.
          let fetchOk = true;
          const r = await fetchHot({
            metric,
            period: state.period,
            limit: oversample,
            offset: 0, // no paging for non-all periods
          }).catch(() => { fetchOk = false; return { items: [], total: 0, refreshFailed: true, stale: true }; });
          rawItems = Array.isArray(r.items) ? r.items : [];
          fetchStatus = { refreshFailed: !!(r && r.refreshFailed), stale: !!(r && r.stale), cached: !!(r && r.cached) };
          fetchedAt = Number(r && (r.fetchedAt || r.cachedAt) || 0) || 0;
          if (!fetchedAt && !(fetchStatus.refreshFailed && !rawItems.length)) fetchedAt = Date.now();
          if (fetchOk && !(r && r.stale && !rawItems.length)) periodCache.set(state.period, { fetchedAt, rawItems, status: fetchStatus });
        }

        const validSet = await loadValidPathSetOnce().catch(() => null);
        items = dedupeUserRankingItems(patchCurrentUserRankingItems(rawItems, state.period, {
          preferLocalOwnScore: !!(fetchStatus && (fetchStatus.refreshFailed || fetchStatus.stale))
        }))
          .filter((it) => {
            if (metric === "users") return !!(it && (it.name || it.title || it.username || it.displayName));
            const p = safePath(it && it.path);
            if (!p) return false;
            if (isUtilityPath(p)) return false;
            if (!isExistingPagePath(p, validSet)) return false;
            return true;
          })
          .slice(0, limit);

        // not used for UI in non-all tabs, but keep sane
        state.total = items.length;
        state.offset = 0;
      }

      list.innerHTML = "";
      if (!items.length) {
        list.appendChild(el("li", "trending-empty", fetchStatus && fetchStatus.refreshFailed ? "Could not refresh ranking" : "No data yet"));
      } else {
        const [lectureMap, titleMap] = await Promise.all([
          loadLectureMapOnce().catch(() => null),
          loadTitleMapOnce().catch(() => null),
        ]);

        items.forEach((it, idx) => {
          const li = el("li", metric === "users" ? "trending-item trending-user-item" : "trending-item");
          if (metric === "users") {
            const fx = String((it && (it.rankingEffect || (it.equippedCosmetics && it.equippedCosmetics.ranking_effect))) || "").trim();
            if (fx) li.setAttribute("data-ranking-effect", fx);
            try {
              const me = readTrendingLocalProfile();
              const meKey = String(me.accountKey || "").trim().toLowerCase();
              if (meKey && String(it && (it.accountKey || it.account_key || "") || "").trim().toLowerCase() === meKey) {
                li.classList.add("mk-trending-current-user");
                li.setAttribute("data-current-user", "true");
              }
            } catch (_) {}
          }

          const rank = el("span", "trending-rank", String(state.offset + idx + 1));
          li.appendChild(rank);

          if (metric === "users") {
            const name = userDisplayName(it);
            const level = userLevel(it);
            const totalXp = userTotalXp(it);
            const intro = userIntroText(it);

            const levelPct = formatTrendingPctStyle(userLevelProgressPct(it, totalXp, level));
            const profile = el("div", "trending-user-profile");
            profile.innerHTML = `${trendingUserAvatarHtml(it, name)}<div class="trending-user-main"><div class="trending-user-name-row"><a href="#" class="trending-user-name">${escapeTrendingHtml(name)}</a><span class="trending-user-level" title="${escapeTrendingHtml(levelPct)}% complete in this level"><span class="trending-user-level-fill" style="width:${levelPct}%"></span><strong>Lv. ${escapeTrendingHtml(level)}</strong></span><span class="trending-user-total-xp" title="Total experience">Total XP ${escapeTrendingHtml(formatTrendingXp(totalXp))}</span></div><div class="trending-user-intro${intro ? "" : " is-empty"}">${escapeTrendingHtml(intro || "No profile intro yet.")}</div></div>`;
            const open = (ev) => {
              ev.preventDefault();
              openTrendingPublicProfile(it);
            };
            const nameLink = profile.querySelector(".trending-user-name");
            if (nameLink) nameLink.addEventListener("click", open);
            profile.addEventListener("dblclick", open);
            li.appendChild(profile);

            const meta = el("span", "trending-user-period-xp", formatTrendingXp(userPeriodXp(it)));
            li.appendChild(meta);
            list.appendChild(li);
            return;
          }

          const a = el("a", "trending-link");
          a.href = new URL(it.path, document.baseURI).toString();
          a.innerHTML = titleToHtml(displayTitle(it, titleMap));
          li.appendChild(a);

          const courseSpan = el("span", "trending-course", displayCourseLecture(it, lectureMap));
          li.appendChild(courseSpan);

          const meta = el("span", "trending-meta", metricValue(it, metric));
          li.appendChild(meta);

          list.appendChild(li);
        });
      }

      if (state.period === "all") {
        footer.style.display = "flex";

        const totalPages = Math.max(1, Math.ceil(state.total / limit));
        const currentPage = Math.floor(state.offset / limit) + 1;

        prev.disabled = currentPage <= 1;
        next.disabled = currentPage >= totalPages;

        pages.innerHTML = "";
        const btns = buildAllTimePages(totalPages, currentPage);

        btns.forEach((p) => {
          if (p === "…") {
            const dot = el("span", "trending-ellipsis", "…");
            pages.appendChild(dot);
            return;
          }
          const b = el("button", "trending-page-num", String(p));
          b.type = "button";
          b.dataset.page = String(p);
          if (p === currentPage) b.classList.add("is-active");
          pages.appendChild(b);
        });
      } else {
        footer.style.display = "none";
        pages.innerHTML = "";
      }

      updateBoardMeta(fetchedAt, Object.assign({ cached: usedCache }, fetchStatus || {}));
      list.classList.remove("is-loading");

      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise([list]).catch(() => {});
      }
    }

    // Switching day/week/month/all-time reuses the in-memory cache (no download)
    // until the user refreshes or reopens the page.
    tabs.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest(".trending-tab");
      if (!btn) return;
      state.period = btn.dataset.period;
      state.offset = 0;
      setActiveTab();
      emitSortFilterUsed("filter", { value: state.period, period: state.period, controlKey: `trending-period:${state.period}`, triggerText: btn.textContent || state.period });
      updateMetaHead();
      load();
    });

    // Pagination for all-time reuses the cached full list (client-side slicing).
    prev.addEventListener("click", () => {
      const limit = (PERIODS.find((x) => x.key === state.period) || PERIODS[1]).limit;
      state.offset = Math.max(0, state.offset - limit);
      load();
    });

    next.addEventListener("click", () => {
      const limit = (PERIODS.find((x) => x.key === state.period) || PERIODS[1]).limit;
      state.offset = state.offset + limit;
      load();
    });

    pages.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest(".trending-page-num");
      if (!btn) return;
      const p = Number(btn.dataset.page || "1");
      const limit = (PERIODS.find((x) => x.key === state.period) || PERIODS[1]).limit;
      state.offset = (p - 1) * limit;
      load();
    });

    // Per-board Refresh button: re-fetch only this board from the cloud.
    boardRefresh.addEventListener("click", () => {
      boardRefresh.classList.add("is-busy");
      Promise.resolve(load({ forceFresh: true })).finally(() => boardRefresh.classList.remove("is-busy"));
    });

    block.__mkTrendingReload = function reloadTrendingBlock(options) {
      return load(Object.assign({}, options || {}));
    };
    block.__mkTrendingResetCache = function resetTrendingBlockCache() {
      __allTimeValidPromise = null;
      periodCache.clear();
    };

    setActiveTab();
    if (!deferInitialLoad) load();

    // Each block loads from the server on first render.  The mounted page also
    // exposes a reload hook so returning to Rankings through instant navigation
    // can fetch a fresh leaderboard instead of reusing an old in-memory view.

    return block;
  }



  // ===== Hot concept badge near H1 =====
  const HOT_BADGE_TOP_LIMIT = 10;
  const HOT_BADGE_ALL_CAP = 100;
  const HOT_BADGE_PERIODS = [
    // H1 badge only: do not show a flame for “Today”; keep week/month/all-time ranks.
    { key: "7d", label: "Top 10 This week", viewsLabel: "weekly views", limit: 10 },
    { key: "30d", label: "Top 10 This month", viewsLabel: "monthly views", limit: 10 },
    { key: "all", label: "Top 100 All time", viewsLabel: "total views", limit: 100 },
  ];

  const __hotBadgeState = {
    listsPromise: null,
    currentKey: "",
    currentRanks: [],
    popover: null,
    activeAnchor: null,
    hideTimer: 0,
    observer: null,
    retryTimers: [],
  };

  function normaliseHotPathKey(pathLike) {
    let p = safePath(pathLike).toLowerCase();
    try { p = decodeURIComponent(p); } catch (_) {}
    p = p.split("?")[0].split("#")[0].replace(/\\/g, "/").replace(/\/+/g, "/");
    p = p.replace(/\/index\.html$/i, "");
    p = p.replace(/\.html$/i, "");
    p = p.replace(/\/+$/g, "");
    return p;
  }

  function relPathFromSiteRoot(absPathname) {
    let p = String(absPathname || window.location.pathname || "");
    try {
      const root = new URL(getSiteRootUrl());
      const rootPath = root.pathname.endsWith("/") ? root.pathname : root.pathname + "/";
      if (p.startsWith(rootPath)) p = p.slice(rootPath.length);
    } catch (_) {}
    return p.replace(/^\/+/, "").replace(/\/+$/, "");
  }

  function currentHotPathKeys() {
    const out = new Set();
    const push = (x) => {
      const k = normaliseHotPathKey(x);
      if (k) out.add(k);
    };

    push(relPathFromSiteRoot(window.location.pathname || ""));
    push(window.location.pathname || "");

    try {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical && canonical.href) {
        const u = new URL(canonical.href, document.baseURI);
        push(relPathFromSiteRoot(u.pathname || ""));
        push(u.pathname || "");
      }
    } catch (_) {}

    return out;
  }

  function isConceptPageForHotBadge() {
    const rel = relPathFromSiteRoot(window.location.pathname || "").toLowerCase();
    if (!rel) return false;
    const base = (rel.split("/").pop() || "").replace(/\.html$/i, "");
    if (!base) return false;
    if (["index", "about", "find", "random", "custom-random", "trending", "contributors", "search", "tags"].includes(base)) return false;
    const segs = rel.split("/").filter(Boolean);
    return segs.length >= 3;
  }

  function hotIconSvg(size) {
    const s = Number(size) || 20;
    return `<svg class="mk-trending-hot-svg" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5c1.25 3.25.35 5.48-2.6 8.1"></path>
      <path d="M9.4 10.6C7.58 8.3 7.25 6.2 7.35 4.45C5.35 6.55 3.6 10.05 3.6 14.05C3.6 18.65 7.28 22 12 22s8.4-3.35 8.4-7.95c0-3.52-1.82-6.7-4.78-8.95c.55 2.78-.2 5.02-2.15 6.68"></path>
      <path d="M12.02 21.55c-1.95-1.25-2.9-3.05-2.55-5.05c.26-1.45 1.25-2.45 2.05-3.56c.82 1.22 2.22 2.16 2.58 3.76c.45 1.94-.42 3.75-2.08 4.85"></path>
    </svg>`;
  }

  function escapeHtmlHot(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function trendingPageHref() {
    try { return new URL("trending.html", getSiteRootUrl()).toString(); }
    catch (_) { return "trending.html"; }
  }

  function rankTitle(ranks) {
    if (!Array.isArray(ranks) || !ranks.length) return "Trending concept";
    const labels = ranks.map((r) => `${r.label} #${r.rank}`).join("; ");
    return `Trending concept: ${labels}`;
  }

  async function loadHotBadgePeriodItems(periodCfg) {
    const validSet = await loadValidPathSetOnce().catch(() => null);

    if (periodCfg.key === "all") {
      const out = [];
      const seen = new Set();
      const CHUNK = 50;
      let offset = 0;
      let total = Infinity;
      let guard = 0;

      while (offset < total && out.length < HOT_BADGE_ALL_CAP && guard < 10) {
        guard++;
        const r = await fetchHot({ metric: "views", period: "all", limit: CHUNK, offset }).catch(() => ({ items: [], total: 0 }));
        const chunk = Array.isArray(r.items) ? r.items : [];
        if (typeof r.total === "number" && r.total > 0) total = r.total;
        if (!chunk.length) break;

        for (const it of chunk) {
          const p = safePath(it && it.path);
          const key = normaliseHotPathKey(p);
          if (!p || !key) continue;
          if (isUtilityPath(p)) continue;
          if (!isExistingPagePath(p, validSet)) continue;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(it);
          if (out.length >= HOT_BADGE_ALL_CAP) break;
        }

        offset += chunk.length;
      }
      return out;
    }

    const oversample = Math.max(periodCfg.limit || HOT_BADGE_TOP_LIMIT, 60);
    const r = await fetchHot({ metric: "views", period: periodCfg.key, limit: oversample, offset: 0 }).catch(() => ({ items: [], total: 0 }));
    const seen = new Set();
    const out = [];
    for (const it of (Array.isArray(r.items) ? r.items : [])) {
      const p = safePath(it && it.path);
      const key = normaliseHotPathKey(p);
      if (!p || !key) continue;
      if (isUtilityPath(p)) continue;
      if (!isExistingPagePath(p, validSet)) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(it);
      if (out.length >= (periodCfg.limit || HOT_BADGE_TOP_LIMIT)) break;
    }
    return out;
  }

  function loadHotBadgeListsOnce() {
    if (__hotBadgeState.listsPromise) return __hotBadgeState.listsPromise;
    __hotBadgeState.listsPromise = (async () => {
      const entries = await Promise.all(HOT_BADGE_PERIODS.map(async (cfg) => {
        const items = await loadHotBadgePeriodItems(cfg).catch(() => []);
        return [cfg.key, { cfg, items }];
      }));
      return new Map(entries);
    })();
    return __hotBadgeState.listsPromise;
  }

  function findHotRanksForCurrentPage(lists) {
    const currentKeys = currentHotPathKeys();
    const ranks = [];

    for (const cfg of HOT_BADGE_PERIODS) {
      const entry = lists && lists.get ? lists.get(cfg.key) : null;
      const items = entry && Array.isArray(entry.items) ? entry.items : [];
      for (let i = 0; i < items.length; i++) {
        const itemKey = normaliseHotPathKey(items[i] && items[i].path);
        if (!itemKey || !currentKeys.has(itemKey)) continue;
        ranks.push({
          period: cfg.key,
          label: cfg.label,
          rank: i + 1,
          count: Number(items[i] && items[i].count) || 0,
          viewsLabel: cfg.viewsLabel,
        });
        break;
      }
    }
    return ranks;
  }

  function ensureHotPopover() {
    let pop = __hotBadgeState.popover;
    if (pop && pop.isConnected) return pop;
    pop = document.createElement("div");
    pop.className = "mk-trending-hot-popover";
    pop.setAttribute("role", "tooltip");
    pop.hidden = true;
    document.body.appendChild(pop);
    __hotBadgeState.popover = pop;
    return pop;
  }

  function popoverHtml(ranks, opts) {
    const mobileMenu = !!(opts && opts.mobileMenu);
    const rows = (Array.isArray(ranks) ? ranks : []).map((r) => `
      <div class="mk-trending-hot-row">
        <span class="mk-trending-hot-label">${escapeHtmlHot(r.label)}</span>
        <span class="mk-trending-hot-meta">#${escapeHtmlHot(r.rank)} · ${escapeHtmlHot(r.count)} ${escapeHtmlHot(r.viewsLabel)}</span>
      </div>
    `).join("");
    const openLink = mobileMenu
      ? `<a class="mk-trending-hot-open" href="${escapeHtmlHot(trendingPageHref())}">Open Trending page</a>`
      : `<div class="mk-trending-hot-hint">Click to open the Trending page.</div>`;
    return `
      <div class="mk-trending-hot-title">${hotIconSvg(15)}<span>Trending concept</span></div>
      ${rows}
      ${openLink}
    `;
  }

  function positionHotPopover(anchor, pop) {
    if (!anchor || !pop || pop.hidden) return;
    const r = anchor.getBoundingClientRect();
    const vw = Math.max(0, window.innerWidth || document.documentElement.clientWidth || 0);
    const vh = Math.max(0, window.innerHeight || document.documentElement.clientHeight || 0);

    pop.style.left = "0px";
    pop.style.top = "0px";
    const pr = pop.getBoundingClientRect();
    const gap = 10;
    const pad = 12;
    let left = r.left + r.width / 2 - pr.width / 2;
    left = Math.max(pad, Math.min(left, vw - pr.width - pad));

    let top = r.bottom + gap;
    if (top + pr.height + pad > vh) top = Math.max(pad, r.top - pr.height - gap);

    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
  }

  function hotUsesTapMenu() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches);
    } catch (_) {
      return false;
    }
  }

  function showHotPopover(anchor) {
    if (!anchor || hotUsesTapMenu()) return;
    if (__hotBadgeState.hideTimer) {
      clearTimeout(__hotBadgeState.hideTimer);
      __hotBadgeState.hideTimer = 0;
    }
    const ranks = anchor.__mkTrendingRanks || __hotBadgeState.currentRanks || [];
    if (!ranks.length) return;
    const pop = ensureHotPopover();
    pop.classList.remove("is-mobile-menu");
    pop.innerHTML = popoverHtml(ranks);
    pop.hidden = false;
    __hotBadgeState.activeAnchor = anchor;
    positionHotPopover(anchor, pop);
    requestAnimationFrame(() => pop.classList.add("is-visible"));
  }

  function showHotTapMenu(anchor) {
    if (!anchor) return;
    if (__hotBadgeState.hideTimer) {
      clearTimeout(__hotBadgeState.hideTimer);
      __hotBadgeState.hideTimer = 0;
    }
    const ranks = anchor.__mkTrendingRanks || __hotBadgeState.currentRanks || [];
    if (!ranks.length) return;
    const pop = ensureHotPopover();
    pop.classList.add("is-mobile-menu");
    pop.setAttribute("role", "menu");
    pop.innerHTML = popoverHtml(ranks, { mobileMenu: true });
    pop.hidden = false;
    __hotBadgeState.activeAnchor = anchor;
    anchor.setAttribute("aria-expanded", "true");
    positionHotPopover(anchor, pop);
    requestAnimationFrame(() => pop.classList.add("is-visible"));
  }

  function hideHotTapMenu() {
    const pop = __hotBadgeState.popover;
    const anchor = __hotBadgeState.activeAnchor;
    if (anchor && anchor.classList && anchor.classList.contains("mk-trending-h1-hot")) {
      try { anchor.setAttribute("aria-expanded", "false"); } catch (_) {}
    }
    if (!pop) return;
    pop.classList.remove("is-visible", "is-mobile-menu");
    window.setTimeout(() => {
      if (!pop.classList.contains("is-visible")) {
        pop.hidden = true;
        try { pop.setAttribute("role", "tooltip"); } catch (_) {}
      }
    }, 130);
    __hotBadgeState.activeAnchor = null;
  }

  function toggleHotTapMenu(anchor) {
    const pop = __hotBadgeState.popover;
    if (pop && !pop.hidden && pop.classList.contains("is-mobile-menu") && __hotBadgeState.activeAnchor === anchor) {
      hideHotTapMenu();
      return;
    }
    showHotTapMenu(anchor);
  }

  function hideHotPopoverSoon() {
    if (__hotBadgeState.hideTimer) clearTimeout(__hotBadgeState.hideTimer);
    __hotBadgeState.hideTimer = window.setTimeout(() => {
      const pop = __hotBadgeState.popover;
      if (!pop) return;
      pop.classList.remove("is-visible", "is-mobile-menu");
      window.setTimeout(() => {
        if (!pop.classList.contains("is-visible")) pop.hidden = true;
      }, 130);
      __hotBadgeState.activeAnchor = null;
    }, 70);
  }

  function installHotPopoverGlobalHandlersOnce() {
    if (window.__mkTrendingHotPopoverHandlersV2) return;
    window.__mkTrendingHotPopoverHandlersV2 = true;
    const reposition = () => {
      const pop = __hotBadgeState.popover;
      const anchor = __hotBadgeState.activeAnchor;
      if (pop && anchor && !pop.hidden) positionHotPopover(anchor, pop);
    };
    window.addEventListener("scroll", reposition, { passive: true, capture: true });
    window.addEventListener("resize", reposition, { passive: true });
    document.addEventListener("click", (ev) => {
      const pop = __hotBadgeState.popover;
      if (!pop || pop.hidden || !pop.classList.contains("is-mobile-menu")) return;
      const target = ev && ev.target;
      if (target && target.closest && (target.closest(".mk-trending-hot-popover") || target.closest(".mk-trending-h1-hot"))) return;
      hideHotTapMenu();
    }, true);
    document.addEventListener("keydown", (ev) => {
      if (!ev || ev.key !== "Escape") return;
      const pop = __hotBadgeState.popover;
      if (pop && !pop.hidden && pop.classList.contains("is-mobile-menu")) hideHotTapMenu();
    }, true);
  }

  function buildHotBadge(ranks) {
    const a = document.createElement("a");
    a.className = "mk-trending-h1-hot";
    a.href = trendingPageHref();
    a.setAttribute("aria-label", rankTitle(ranks));
    a.setAttribute("aria-haspopup", "menu");
    a.setAttribute("aria-expanded", "false");
    a.title = rankTitle(ranks);
    a.innerHTML = `${hotIconSvg(24)}<span class="mk-trending-sr">Trending concept</span>`;
    a.__mkTrendingRanks = ranks;
    a.addEventListener("mouseenter", () => showHotPopover(a));
    a.addEventListener("mouseleave", hideHotPopoverSoon);
    a.addEventListener("focus", () => showHotPopover(a));
    a.addEventListener("blur", () => { if (!hotUsesTapMenu()) hideHotPopoverSoon(); });
    a.addEventListener("click", (ev) => {
      if (!hotUsesTapMenu()) return;
      try { ev.preventDefault(); ev.stopPropagation(); } catch (_) {}
      toggleHotTapMenu(a);
    });
    return a;
  }

  function findH1ForHotBadge() {
    const inner = document.querySelector("article.md-content__inner");
    return inner ? inner.querySelector("h1") : document.querySelector(".md-content h1, h1");
  }

  function clearHotBadgeInlineInteractiveFrame(badge) {
    if (!badge || !badge.style) return;
    [
      "background", "background-color", "background-image",
      "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
      "box-shadow", "opacity"
    ].forEach((prop) => {
      try { badge.style.removeProperty(prop); } catch (_) {}
    });
    try { badge.classList.remove("lp-h1-tool-btn"); } catch (_) {}
  }

  function syncHotBadgeFrameFromSibling(badge, h1) {
    if (!badge || !h1 || !window.getComputedStyle) return;
    try {
      clearHotBadgeInlineInteractiveFrame(badge);
      const ref = h1.querySelector(":scope > .lp-h1-map, :scope > .lp-h1-gps, :scope > .lp-h1-tool-btn:not(.mk-trending-h1-hot), :scope > [data-lp-h1-open-map], :scope > [data-lp-h1-open-gps]");
      if (!ref || ref === badge) return;
      const cs = window.getComputedStyle(ref);
      if (!cs) return;

      const cssName = (prop) => String(prop || "").replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      const setImportant = (prop, value) => {
        const v = String(value || "").trim();
        if (!v) return;
        badge.style.setProperty(cssName(prop), v, "important");
      };

      // Copy the actual computed frame from the learning-path map button.
      // Use inline !important so this can beat the generic .md-typeset a rules
      // and the hot badge's own fallback styles.
      const copy = [
        "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight",
        "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
        "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle",
        "borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius",
        "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
        "marginTop", "marginRight", "marginBottom", "marginLeft"
      ];
      copy.forEach((prop) => setImportant(prop, cs[prop]));

      // Do not copy a sibling's current hover/focus colours. The hot button uses
      // its own :hover variables, so hovering one H1 button cannot visually change
      // the other. Only refresh base colours when the reference button is idle.
      let refInteractive = false;
      try { refInteractive = !!(ref.matches && ref.matches(":hover, :focus, :focus-visible, :active")); } catch (_) {}
      if (!refInteractive) {
        const borderColor = String(cs.borderTopColor || cs.borderRightColor || cs.borderBottomColor || cs.borderLeftColor || "").trim();
        if (borderColor) badge.style.setProperty("--mk-trending-hot-border", borderColor);
        const bg = String(cs.backgroundColor || "").trim();
        if (bg) badge.style.setProperty("--mk-trending-hot-bg", bg);
        const shadow = String(cs.boxShadow || "").trim();
        if (shadow) badge.style.setProperty("--mk-trending-hot-shadow", shadow === "none" ? "none" : shadow);
        const opacity = String(cs.opacity || "").trim();
        if (opacity) badge.style.setProperty("--mk-trending-hot-opacity", opacity);
      }
      badge.style.setProperty("--mk-trending-hot-hover-border", "var(--md-accent-fg-color)");
      badge.style.setProperty("--mk-trending-hot-hover-bg", "rgba(99,102,241,.10)");
      badge.style.setProperty("--mk-trending-hot-hover-shadow", "none");
      badge.style.setProperty("--mk-trending-hot-hover-opacity", "1");

      setImportant("display", "flex");
      setImportant("alignItems", "center");
      setImportant("justifyContent", "center");
      setImportant("lineHeight", "0");
      setImportant("boxSizing", "border-box");
      setImportant("textDecoration", "none");
      setImportant("backgroundImage", "none");
    } catch (_) {}
  }

  function scheduleHotBadgeFrameSync(badge, h1) {
    if (!badge || !h1) return;
    [0, 60, 180, 420, 900, 1600].forEach((delay) => {
      try {
        window.setTimeout(() => syncHotBadgeFrameFromSibling(badge, h1), delay);
      } catch (_) {}
    });
  }

  function placeHotBadge(h1, badge) {
    if (!h1 || !badge) return;

    const left = h1.querySelector(":scope > .lp-h1-left");
    if (left) {
      // Keep the hot badge as the only direct H1-side button. With the title
      // wrapper flexing to fill the row, appending the badge places it at the
      // far right on desktop.
      const targetParent = h1;
      if (badge.parentNode !== targetParent || badge.previousSibling !== left) {
        if (left.nextSibling) targetParent.insertBefore(badge, left.nextSibling);
        else targetParent.appendChild(badge);
      }
      syncHotBadgeFrameFromSibling(badge, h1);
      scheduleHotBadgeFrameSync(badge, h1);
      return;
    }

    if (badge.parentNode !== h1) h1.appendChild(badge);
    syncHotBadgeFrameFromSibling(badge, h1);
    scheduleHotBadgeFrameSync(badge, h1);
  }

  function clearHotBadge() {
    document.querySelectorAll(".mk-trending-h1-hot").forEach((node) => {
      try { node.remove(); } catch (_) {}
    });
    const pop = __hotBadgeState.popover;
    if (pop) {
      pop.classList.remove("is-visible");
      pop.hidden = true;
    }
    __hotBadgeState.currentRanks = [];
  }

  function renderHotBadge(ranks) {
    if (!Array.isArray(ranks) || !ranks.length) {
      clearHotBadge();
      return;
    }

    ensureStylesOnce();
    installHotPopoverGlobalHandlersOnce();

    const h1 = findH1ForHotBadge();
    if (!h1) return;

    const all = Array.from(document.querySelectorAll(".mk-trending-h1-hot"));
    let badge = all[0] || null;
    all.slice(1).forEach((node) => { try { node.remove(); } catch (_) {} });

    if (!badge) badge = buildHotBadge(ranks);
    clearHotBadgeInlineInteractiveFrame(badge);
    badge.__mkTrendingRanks = ranks;
    badge.setAttribute("aria-label", rankTitle(ranks));
    badge.setAttribute("aria-haspopup", "menu");
    badge.setAttribute("aria-expanded", "false");
    badge.title = rankTitle(ranks);
    placeHotBadge(h1, badge);
  }

  function scheduleHotBadgeReposition(ranks) {
    __hotBadgeState.retryTimers.forEach((id) => { try { clearTimeout(id); } catch (_) {} });
    __hotBadgeState.retryTimers = [];
    [80, 220, 520, 1000, 1800].forEach((delay) => {
      const id = window.setTimeout(() => renderHotBadge(ranks), delay);
      __hotBadgeState.retryTimers.push(id);
    });

    try {
      if (__hotBadgeState.observer) __hotBadgeState.observer.disconnect();
      const h1 = findH1ForHotBadge();
      if (!h1 || !window.MutationObserver) return;
      let raf = 0;
      __hotBadgeState.observer = new MutationObserver(() => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          renderHotBadge(__hotBadgeState.currentRanks || ranks);
        });
      });
      __hotBadgeState.observer.observe(h1, { childList: true, subtree: true });
    } catch (_) {}
  }

  async function mountHotBadge() {
    if (!ENABLE_H1_HOT_BADGE) {
      clearHotBadge();
      return;
    }
    if (isTrendingPage() || !isConceptPageForHotBadge()) {
      clearHotBadge();
      return;
    }

    const currentKey = Array.from(currentHotPathKeys()).join("|");
    if (__hotBadgeState.currentKey === currentKey && Array.isArray(__hotBadgeState.currentRanks)) {
      renderHotBadge(__hotBadgeState.currentRanks);
      scheduleHotBadgeReposition(__hotBadgeState.currentRanks);
      return;
    }

    __hotBadgeState.currentKey = currentKey;

    const lists = await loadHotBadgeListsOnce().catch(() => null);
    const ranks = findHotRanksForCurrentPage(lists);
    __hotBadgeState.currentRanks = ranks;
    renderHotBadge(ranks);
    if (ranks.length) scheduleHotBadgeReposition(ranks);
  }


  function syncRankingsPageTitle() {
    try {
      const h1 = document.querySelector("article.md-content__inner h1, .md-content h1, h1");
      if (h1 && String(h1.textContent || "").trim().toLowerCase() === "trending") h1.textContent = "Rankings";
      if (document.title) document.title = document.title.replace(/^Trending\b/i, "Rankings");
    } catch (_) {}
  }

  function refreshMountedTrendingHost(host, reason) {
    try {
      if (!host || host.dataset.mounted !== "1") return;
      const nowTs = Date.now();
      const last = Number(host.dataset.lastFreshRankingsReload || 0) || 0;
      if (nowTs - last < 1200) return;
      host.dataset.lastFreshRankingsReload = String(nowTs);
      const active = host.querySelector(".trending-block.is-active");
      const targets = active ? [active] : Array.from(host.querySelectorAll(".trending-block"));
      targets.forEach((block) => {
        if (block && typeof block.__mkTrendingReload === "function") block.__mkTrendingReload({ forceFresh: true, reason: reason || "page-open" });
      });
    } catch (_) {}
  }

  function mount() {
    if (!isTrendingPage()) return;

    ensureStylesOnce();
    syncRankingsPageTitle();

    document.body.classList.add("trending-page");

    const host = document.getElementById("trending-app");
    if (!host) return;

    if (host.dataset.mounted === "1") {
      refreshMountedTrendingHost(host, "page-open");
      return;
    }
    host.dataset.mounted = "1";

    const shell = el("div", "trending-unified");
    const metricSwitch = el("div", "trending-metric-switch");
    metricSwitch.setAttribute("role", "tablist");
    metricSwitch.setAttribute("aria-label", "Trending ranking type");

    const wrap = el("div", "trending-grid");
    const blocks = new Map();

    const initialMetric = readInitialTrendingMetric();
    TRENDING_METRICS.forEach((cfg) => {
      const btn = el("button", "trending-metric-btn", cfg.title);
      btn.type = "button";
      btn.dataset.metric = cfg.key;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-controls", `trending-panel-${cfg.key}`);
      metricSwitch.appendChild(btn);

      const block = buildBlock({ title: cfg.title, metric: cfg.key, deferInitialLoad: cfg.key !== initialMetric });
      block.id = `trending-panel-${cfg.key}`;
      block.setAttribute("role", "tabpanel");
      blocks.set(cfg.key, block);
      wrap.appendChild(block);
    });

    function activateMetric(metric, options) {
      const key = normaliseTrendingMetric(metric);
      host.dataset.metric = key;
      metricSwitch.querySelectorAll(".trending-metric-btn").forEach((btn) => {
        const active = btn.dataset.metric === key;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
        btn.tabIndex = active ? 0 : -1;
      });
      blocks.forEach((block, blockKey) => {
        const active = blockKey === key;
        block.hidden = !active;
        block.classList.toggle("is-active", active);
        if (active && !(options && options.skipReload) && typeof block.__mkTrendingReload === "function") {
          // Reuse this board's in-memory cache when switching ranking type within
          // the page; only an explicit Refresh or reopening the page re-downloads.
          window.setTimeout(() => block.__mkTrendingReload({ reason: "metric-activated" }), 0);
        }
      });
      if (!(options && options.skipUrl)) writeTrendingMetricToUrl(key);
    }

    metricSwitch.addEventListener("click", (ev) => {
      const btn = ev.target && ev.target.closest ? ev.target.closest(".trending-metric-btn") : null;
      if (!btn) return;
      const metric = btn.dataset.metric || "views";
      activateMetric(metric);
      emitSortFilterUsed("sort", { value: metric, metric, controlKey: `trending-metric:${metric}`, triggerText: btn.textContent || metric });
    });

    metricSwitch.addEventListener("keydown", (ev) => {
      if (!ev || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(ev.key)) return;
      const buttons = Array.from(metricSwitch.querySelectorAll(".trending-metric-btn"));
      if (!buttons.length) return;
      const cur = Math.max(0, buttons.findIndex((btn) => btn.classList.contains("is-active")));
      let next = cur;
      if (ev.key === "ArrowLeft") next = (cur - 1 + buttons.length) % buttons.length;
      else if (ev.key === "ArrowRight") next = (cur + 1) % buttons.length;
      else if (ev.key === "Home") next = 0;
      else if (ev.key === "End") next = buttons.length - 1;
      ev.preventDefault();
      buttons[next].focus();
      const metric = buttons[next].dataset.metric || "views";
      activateMetric(metric);
      emitSortFilterUsed("sort", { value: metric, metric, controlKey: `trending-metric:${metric}`, triggerText: buttons[next].textContent || metric, eventName: `keyboard-${ev.key}` });
    });

    shell.appendChild(metricSwitch);
    shell.appendChild(wrap);

    host.innerHTML = "";
    host.appendChild(shell);
    activateMetric(initialMetric, { skipUrl: true, skipReload: true });
  }

  function bootTrendingFeatures() {
    mount();
    mountHotBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTrendingFeatures);
  } else {
    bootTrendingFeatures();
  }
  document.addEventListener("DOMContentSwitch", bootTrendingFeatures);
  window.addEventListener("pageshow", bootTrendingFeatures, { passive: true });
})();
