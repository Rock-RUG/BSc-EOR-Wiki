// docs/javascripts/custom-random.js
(function () {
  const TOKENS_KEY = "random_custom_tokens_v1";
  const CANDS_KEY = "random_custom_candidates_v1";
  const ENTRY_KEY = "random_custom_page_v1";

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

  // ====== helpers ======
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normaliseForSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokeniseLoose(s) {
    // allow user input like "m1c-lecture05", "continuity", "IVT EVT"
    const n = normaliseForSearch(s);
    if (!n) return [];
    return n.split(" ").filter(Boolean);
  }

  function isCustomRandomPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/custom-random.html") || p.endsWith("custom-random.html");
  }

  function isIndexPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    return loc.endsWith("/index.html") || loc.endsWith("index.html");
  }

  function isRandomPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    if (loc.includes("/random/")) return true;
    const file = loc.split("/").pop() || "";
    return /^random.*\.html$/.test(file) || file === "custom-random.html";
  }

  // concept 页候选：至少 /year/course/page 这三段
  function isConceptLocation(loc) {
    const s = String(loc || "");
    if (!s) return false;
    const clean = s.replace(/^\/+/, "").split("#")[0].replace(/\/+$/, "");
    const segs = clean.split("/").filter(Boolean);
    return segs.length >= 3;
  }

  function courseLabelFromLocation(location) {
    const loc = String(location || "").replace(/^\/+/, "");
    const path = loc.split("#")[0];
    const segs = path.split("/").filter(Boolean);
    if (segs.length < 2) return "";

    let course = segs[1];
    course = course.replace(/^\d+[ab]-/i, "");
    course = course.replace(/-/g, " ").trim();
    course = course.replace(/^Math\s+(I|II|III|IV)\s+/i, (m) => m.trim() + ": ");
    return course;
  }

  async function loadIndex() {
    const root = getSiteRootUrl();
    const url = new URL("search/search_index.json", root);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to load search index");
    return await res.json();
  }

  // ---- aggregate section hits (#...) into their parent page ----
  function aggregateDocsToPages(docs) {
    const pageMap = new Map();

    for (const d of docs) {
      const locFull = String(d.location || "");
      if (!locFull) continue;

      const pageLoc = locFull.split("#")[0];
      if (!pageLoc) continue;

      if (isIndexPage(pageLoc)) continue;
      if (isRandomPage(pageLoc)) continue;
      if (!isConceptLocation(pageLoc)) continue;

      let entry = pageMap.get(pageLoc);
      if (!entry) {
        entry = { location: pageLoc, title: "", text: "" };
        pageMap.set(pageLoc, entry);
      }

      // Prefer the page-level title (doc whose location has no '#')
      if (locFull === pageLoc && d.title) {
        entry.title = String(d.title);
      }

      // skip noisy sections: prerequisites + related concepts
      const anchor = locFull.includes("#") ? (locFull.split("#")[1] || "").toLowerCase() : "";
      const isNoisySection =
        anchor === "prerequisites" ||
        anchor.startsWith("prerequisites-") ||
        anchor === "related-concepts" ||
        anchor.startsWith("related-concepts-");

      if (!isNoisySection && d.text) {
        entry.text += " " + String(d.text);
      }

      // bring tags/extra fields into text blob (if they exist)
      if (d.tags) entry.text += " " + String(d.tags);
      if (d.keywords) entry.text += " " + String(d.keywords);
      if (d.meta) entry.text += " " + JSON.stringify(d.meta);
    }

    for (const entry of pageMap.values()) {
      if (!entry.title) {
        const file = entry.location.split("/").pop() || "Untitled";
        entry.title = file.replace(/\.html$/i, "").replace(/-/g, " ");
      }
    }

    return Array.from(pageMap.values());
  }

  function readTokens() {
    try {
      const raw = sessionStorage.getItem(TOKENS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [];
    } catch (_) {
      return [];
    }
  }

  function storeTokens(tokens) {
    try {
      sessionStorage.setItem(TOKENS_KEY, JSON.stringify(tokens || []));
    } catch (_) {}
  }

  function storeCandidates(locations) {
    try {
      sessionStorage.setItem(CANDS_KEY, JSON.stringify(locations || []));
    } catch (_) {}
  }

  function storeEntryUrl() {
    try {
      sessionStorage.setItem(ENTRY_KEY, window.location.href);
    } catch (_) {}
  }

  function buildCandidateSet(pageDocs, tokens) {
    const toks = (tokens || []).flatMap(tokeniseLoose).filter(Boolean);
    if (!toks.length) return [];

    // AND semantics: every token must appear somewhere
    return pageDocs.filter(d => {
      const hay = normaliseForSearch((d.title || "") + " " + (d.text || "") + " " + (d.location || ""));
      for (const t of toks) {
        if (!hay.includes(t)) return false;
      }
      return true;
    });
  }

  function toAbsoluteUrl(loc) {
    const siteRoot = getSiteRootUrl();
    const cleanLoc = String(loc).replace(/^\//, "");
    return new URL(cleanLoc, siteRoot).toString().split("#")[0] + "#top";
  }

  function pickRandom(arr) {
    if (!arr || !arr.length) return null;
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  function renderApp(container, state) {
    const tokens = state.tokens;
    const count = state.results.length;

    const chips = tokens.length
      ? tokens.map((t, i) => `
          <span class="md-tag" style="display:inline-flex;align-items:center;gap:6px;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;border:1px solid var(--md-default-fg-color--lightest);">
            <span>${escapeHtml(t)}</span>
            <button data-del="${i}" class="md-button" style="padding:2px 8px;min-width:auto">×</button>
          </span>
        `).join("")
      : `<span style="opacity:.7">No tokens yet.</span>`;

    const list = count
      ? state.results.slice(0, 200).map(r => {
          const href = toAbsoluteUrl(r.location);
          const course = courseLabelFromLocation(r.location);
          return `
            <article class="sr-item">
              <div class="sr-head">
                <a class="sr-title" href="${href}">${escapeHtml(r.title || "Untitled")}</a>
                ${course ? `<span class="sr-chip">${escapeHtml(course)}</span>` : ""}
              </div>
            </article>
          `;
        }).join("")
      : `<div class="sr-empty"><p>No matching pages.</p></div>`;

    container.innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <input id="cr-input" class="md-input" style="flex:1;min-width:240px" placeholder="e.g. continuity, m1c-lecture05" />
        <button id="cr-add" class="md-button md-button--primary">Add</button>
        <button id="cr-clear" class="md-button">Clear</button>
      </div>

      <div style="margin:6px 0 14px 0">
        ${chips}
      </div>

      <div class="sr-top" style="margin-top:10px">
        <div class="sr-top__title">Filtered pages</div>
        <div class="sr-top__count">${count} page(s) matched</div>
      </div>

      <div class="sr-list" style="margin-top:8px">
        ${list}
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:16px">
        <button id="cr-random" class="md-button md-button--primary" ${count ? "" : "disabled"}>Start random</button>
      </div>
    `;

    const input = container.querySelector("#cr-input");
    const addBtn = container.querySelector("#cr-add");
    const clearBtn = container.querySelector("#cr-clear");
    const randomBtn = container.querySelector("#cr-random");

    function addTokenFromInput() {
      const v = (input.value || "").trim();
      if (!v) return;
      if (!state.tokens.includes(v)) state.tokens.push(v);
      input.value = "";
      storeTokens(state.tokens);
      state.recompute();
    }

    addBtn.addEventListener("click", addTokenFromInput);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTokenFromInput();
      }
    });

    clearBtn.addEventListener("click", () => {
      state.tokens = [];
      storeTokens(state.tokens);
      state.recompute();
    });

    container.querySelectorAll("button[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-del"));
        if (Number.isFinite(idx)) {
          state.tokens.splice(idx, 1);
          storeTokens(state.tokens);
          state.recompute();
        }
      });
    });

    randomBtn.addEventListener("click", () => {
      if (!state.results.length) return;
      storeEntryUrl();
      const locs = state.results.map(r => r.location);
      storeCandidates(locs);

      const chosen = pickRandom(locs);
      if (!chosen) return;
      window.location.assign(toAbsoluteUrl(chosen));
    });
  }

  async function init() {
    if (!isCustomRandomPage()) return;

    const mount = document.getElementById("custom-random-app");
    if (!mount) return;

    const indexJson = await loadIndex();
    const docs = (indexJson && indexJson.docs) ? indexJson.docs : [];
    const pageDocs = aggregateDocsToPages(docs);

    let state = {
      tokens: readTokens(),
      results: [],
      recompute: () => {},
    };

    state.recompute = () => {
      state.results = buildCandidateSet(pageDocs, state.tokens);
      renderApp(mount, state);
    };

    state.recompute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init().catch(e => console.warn("custom-random:", e)));
  } else {
    init().catch(e => console.warn("custom-random:", e));
  }

  document.addEventListener("DOMContentSwitch", () => init().catch(e => console.warn("custom-random:", e)));
})();
