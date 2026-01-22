// docs/javascripts/search-results.js
(function () {
  // ====== base url ======
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
  }

  // ====== helpers ======
  function stripHtml(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.innerHTML = s;
    return div.textContent || div.innerText || "";
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normaliseText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function normaliseForSearch(s) {
    // behave closer to Material/Lunr tokenisation: punctuation -> spaces
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokeniseQuery(q) {
    return normaliseForSearch(q).split(" ").filter(Boolean);
  }

  function isOnFindPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/find.html") || p.endsWith("find.html");
  }

  // --- NEW: strip MathJax/LaTeX so custom results won't match/show TeX source ---
  function stripMathJax(s) {
    if (!s) return "";

    // 1. HTML → plain text
    let t = stripHtml(s);

    // 2. remove display/inline math
    t = t.replace(/\$\$[\s\S]*?\$\$/g, " ");
    t = t.replace(/\$[^$]*?\$/g, " ");
    t = t.replace(/\\\[[\s\S]*?\\\]/g, " ");
    t = t.replace(/\\\([\s\S]*?\\\)/g, " ");

    // 3. \epsilon → epsilon
    t = t.replace(/\\([a-zA-Z]+)\b/g, "$1");

    // 4. cleanup leftover braces
    t = t.replace(/[{}]/g, " ");

    // 5. normalize whitespace
    return normaliseText(t);
  }


  function asStringList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.map(String).filter(Boolean);
    if (typeof x === "string") return [x];
    return [];
  }

  function getTagsFromDoc(d) {
    // support multiple shapes in various mkdocs search index variants
    return [
      ...asStringList(d.tags),
      ...asStringList(d.tag),
      ...asStringList(d.meta && d.meta.tags),
    ];
  }

  function getAliasesFromDoc(d) {
    return [
      ...asStringList(d.aliases),
      ...asStringList(d.alias),
      ...asStringList(d.meta && d.meta.aliases),
    ];
  }

  // ====== filters (your rules) ======
  function isIndexPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    return loc.endsWith("/index.html") || loc.endsWith("index.html");
  }

  // exclude random*.html (and any /random/ path just in case)
  function isRandomPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    if (loc.includes("/random/")) return true;
    const file = loc.split("/").pop() || "";
    return /^random.*\.html$/.test(file);
  }

  // ====== course chip ======
  function courseLabelFromLocation(location) {
    const loc = String(location || "").replace(/^\/+/, "");
    const path = loc.split("#")[0];
    const segs = path.split("/").filter(Boolean);
    if (segs.length < 2) return "";

    let course = segs[1]; // e.g. 1a-Math-I-Calculus
    course = course.replace(/^\d+[ab]-/i, "");
    course = course.replace(/-/g, " ").trim();
    course = course.replace(/^Math\s+(I|II|III|IV)\s+/i, (m) => m.trim() + ": ");
    return course;
  }

  // ====== scoring ======
  // NOTE: This scores a PAGE-LEVEL entry where doc.text is the aggregated text of the whole page
  // (including section hits that originally had #anchors).
  function scoreDoc(doc, q) {
    const title = String(doc.title || "");
    const text = String(doc.text || "");
    const loc = String(doc.location || "");

    const tags = asStringList(doc.tags);
    const aliases = asStringList(doc.aliases);

    const titleN = normaliseForSearch(title);
    const textN = normaliseForSearch(text);
    const locN = normaliseForSearch(loc);
    const tagsN = normaliseForSearch(tags.join(" "));
    const aliasesN = normaliseForSearch(aliases.join(" "));

    const textRawL = text.toLowerCase();
    const titleRawL = title.toLowerCase();

    const toks = tokeniseQuery(q);
    if (!toks.length) return 0;

    // AND semantics: every token must appear somewhere in (title/text/location/tags/aliases)
    const hayN = `${titleN} ${textN} ${locN} ${tagsN} ${aliasesN}`;
    for (const t of toks) {
      const ok =
        hayN.includes(t) ||
        textRawL.includes(t) ||
        titleRawL.includes(t);
      if (!ok) return 0;
    }

    // ranking:正文权重大（因为你要“正文出现就命中”）
    let score = 0;
    const qN = normaliseForSearch(q);
    const qL = q.toLowerCase().trim();

    if (qN && textN.includes(qN)) score += 140;
    if (qN && titleN.includes(qN)) score += 90;
    if (qL && textRawL.includes(qL)) score += 90;
    if (qL && titleRawL.includes(qL)) score += 60;

    // boost tags/aliases similar to overlay behavior
    if (qN && tagsN.includes(qN)) score += 160;
    if (qN && aliasesN.includes(qN)) score += 160;

    for (const t of toks) {
      if (textN.includes(t) || textRawL.includes(t)) score += 30;
      if (titleN.includes(t) || titleRawL.includes(t)) score += 18;
      if (tagsN.includes(t)) score += 40;
      if (aliasesN.includes(t)) score += 40;
      if (locN.includes(t)) score += 6;
    }

    return score;
  }

  function makeSnippet(text, q) {
    // IMPORTANT: use stripped text so snippets don't show TeX source
    const t = stripMathJax(text);
    if (!t) return "";

    const lower = t.toLowerCase();
    const ts = tokeniseQuery(q);

    let hit = "";
    let idx = -1;
    for (const token of ts) {
      const i = lower.indexOf(token);
      if (i >= 0) {
        hit = token;
        idx = i;
        break;
      }
    }

    if (idx < 0 || !hit) {
      return escapeHtml(t.slice(0, 180)) + (t.length > 180 ? "…" : "");
    }

    const start = Math.max(0, idx - 60);
    const end = Math.min(t.length, idx + hit.length + 90);
    const snippet = t.slice(start, end);

    const before = escapeHtml(snippet.slice(0, idx - start));
    const match = escapeHtml(snippet.slice(idx - start, idx - start + hit.length));
    const after = escapeHtml(snippet.slice(idx - start + hit.length));

    return (start > 0 ? "…" : "") + before + "<mark>" + match + "</mark>" + after + (end < t.length ? "…" : "");
  }

  async function loadIndex() {
    const root = getSiteRootUrl();
    const url = new URL("search/search_index.json", root);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to load search index");
    return await res.json();
  }

  function buildResultItem(r, root, q) {
    const href = new URL(String(r.location || "").replace(/^\//, ""), root).toString();
    const course = courseLabelFromLocation(r.location);
    const snippet = makeSnippet(r.text, q);

    return `
      <article class="sr-item">
        <div class="sr-head">
          <a class="sr-title" href="${href}">${escapeHtml(r.title || "Untitled")}</a>
          ${course ? `<span class="sr-chip">${escapeHtml(course)}</span>` : ""}
        </div>
        ${snippet ? `<div class="sr-snippet">${snippet}</div>` : ""}
      </article>
    `;
  }

  function bindSearchForm() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    if (!form || !input) return;

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const q = input.value.trim();
      if (!q) return;

      const params = new URLSearchParams(window.location.search);
      params.set("q", q);
      window.location.search = params.toString();
    });
  }

  // ---- aggregate section hits (#...) into their parent page ----
  function aggregateDocsToPages(docs) {
    const pageMap = new Map();

    for (const d of docs) {
      const locFull = String(d.location || "");
      if (!locFull) continue;

      const pageLoc = locFull.split("#")[0]; // strip section anchor
      if (!pageLoc) continue;

      // exclude at PAGE level
      if (isIndexPage(pageLoc)) continue;
      if (isRandomPage(pageLoc)) continue;

      let entry = pageMap.get(pageLoc);
      if (!entry) {
        entry = {
          location: pageLoc,
          title: "",
          text: "",
          tags: new Set(),
          aliases: new Set(),
        };
        pageMap.set(pageLoc, entry);
      }

      // Prefer the page-level title (doc whose location has no '#')
      if (locFull === pageLoc && d.title) {
        entry.title = String(d.title);
      }

      // Aggregate tags/aliases at page level
      for (const tg of getTagsFromDoc(d)) entry.tags.add(String(tg));
      for (const al of getAliasesFromDoc(d)) entry.aliases.add(String(al));

      // Aggregate all section/page text into one searchable blob
      // BUT skip sections: Prerequisites + Related Concepts (too noisy)
      const anchor = locFull.includes("#") ? (locFull.split("#")[1] || "").toLowerCase() : "";

      // anchors generated by MkDocs are usually:
      // - prerequisites
      // - related-concepts
      // sometimes may become related-concepts-1 etc, so use startsWith
      const isNoisySection =
        anchor === "prerequisites" ||
        anchor.startsWith("prerequisites-") ||
        anchor === "related-concepts" ||
        anchor.startsWith("related-concepts-");

      if (!isNoisySection && d.text) {
        // strip MathJax/LaTeX so custom search won't match/show TeX
        entry.text += " " + stripMathJax(d.text);
      }
    }

    // Fallback title if missing (rare)
    const out = [];
    for (const entry of pageMap.values()) {
      if (!entry.title) {
        const file = entry.location.split("/").pop() || "Untitled";
        entry.title = file.replace(/\.html$/i, "").replace(/-/g, " ");
      }

      out.push({
        location: entry.location,
        title: entry.title,
        text: entry.text,
        tags: Array.from(entry.tags),
        aliases: Array.from(entry.aliases),
      });
    }

    return out;
  }

  async function render() {
    if (!isOnFindPage()) return;

    closeMaterialSearchOverlay();
    bindSearchForm();

    const container = document.getElementById("search-results");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const q = (params.get("q") || "").trim();

    const input = document.getElementById("search-input");
    if (input) input.value = q;

    if (!q) {
      container.innerHTML = `
        <div class="sr-empty">
          <p>Please enter a search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="sr-top">
        <div class="sr-top__title">Search results</div>
        <div class="sr-top__q">${escapeHtml(q)}</div>
      </div>
      <div class="sr-loading">Searching…</div>
    `;

    const indexJson = await loadIndex();
    const docs = (indexJson && indexJson.docs) ? indexJson.docs : [];

    // IMPORTANT: Use aggregated page entries (includes section text), so body search works
    const pageDocs = aggregateDocsToPages(docs);

    const scored = pageDocs
      .map(d => ({
        location: d.location,
        title: d.title,
        text: d.text,
        tags: d.tags,
        aliases: d.aliases,
        score: scoreDoc(d, q),
      }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    const results = scored.slice(0, 300);
    const root = getSiteRootUrl();

    if (!results.length) {
      container.innerHTML = `
        <div class="sr-top">
          <div class="sr-top__title">Search results</div>
          <div class="sr-top__q">${escapeHtml(q)}</div>
        </div>
        <div class="sr-empty">
          <p>No results found.</p>
        </div>
      `;
      return;
    }

    const items = results.map(r => buildResultItem(r, root, q)).join("");

    container.innerHTML = `
      <div class="sr-top">
        <div class="sr-top__title">Search results</div>
        <div class="sr-top__q">${escapeHtml(q)}</div>
        <div class="sr-top__count">${results.length} shown (concept pages only)</div>
      </div>
      <div class="sr-list">
        ${items}
      </div>
    `;
  }

  function init() {
    render().catch(err => console.warn("search-results:", err));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("DOMContentSwitch", init);
})();
