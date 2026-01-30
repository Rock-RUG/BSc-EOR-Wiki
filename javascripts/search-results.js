// docs/javascripts/search-results.js
(function () {
  // ========== base url ==========
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

  function isOnFindPage() {
    const p = window.location.pathname.toLowerCase();
    return p.endsWith("/find.html") || p.endsWith("find.html");
  }

  // ========== helpers ==========
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function stripHtml(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.innerHTML = s;
    return div.textContent || div.innerText || "";
  }

  function normaliseText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function normaliseForSearch(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokeniseQuery(q) {
    return normaliseForSearch(q).split(" ").filter(Boolean);
  }

  // remove TeX-ish noise from snippet
  function stripMathJax(s) {
    if (!s) return "";
    let t = stripHtml(s);

    t = t.replace(/\$\$[\s\S]*?\$\$/g, " ");
    t = t.replace(/\$[^$]*?\$/g, " ");
    t = t.replace(/\\\[[\s\S]*?\\\]/g, " ");
    t = t.replace(/\\\([\s\S]*?\\\)/g, " ");

    t = t.replace(/\\([a-zA-Z]+)\b/g, "$1");
    t = t.replace(/[{}]/g, " ");
    return normaliseText(t);
  }

  // ========== filters ==========
  function isIndexPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    return loc.endsWith("/index.html") || loc.endsWith("index.html");
  }

  function isRandomPage(location) {
    const loc = String(location || "").toLowerCase().split("#")[0];
    if (loc.includes("/random/")) return true;
    const file = loc.split("/").pop() || "";
    return /^random.*\.html$/.test(file);
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

  function toAbsoluteUrl(loc) {
    const root = getSiteRootUrl();
    return new URL(String(loc || "").replace(/^\//, ""), root).toString();
  }

  function normaliseScope(scope) {
    let s = String(scope || "").trim();
    s = s.replace(/^\/+/, "");
    if (!s) return "";
    if (!s.endsWith("/")) s += "/";
    return s;
  }

  // ========== index loading & aggregation ==========
  async function loadIndex() {
    const root = getSiteRootUrl();
    const url = new URL("search/search_index.json", root);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to load search index");
    return await res.json();
  }

  function asStringList(x) {
    if (!x) return [];
    if (Array.isArray(x)) return x.map(String).filter(Boolean);
    if (typeof x === "string") return [x];
    return [];
  }

  function getTagsFromDoc(d) {
    const out = [];
    out.push(...asStringList(d && d.tags));
    out.push(...asStringList(d && d.tag));
    out.push(...asStringList(d && d.meta && d.meta.tags));
    return out;
  }

  function getAliasesFromDoc(d) {
    const out = [];
    out.push(...asStringList(d && d.aliases));
    out.push(...asStringList(d && d.alias));
    out.push(...asStringList(d && d.meta && d.meta.aliases));
    return out;
  }

  // aggregate section docs to page docs
  function aggregateDocsToPages(docs) {
    const pageMap = new Map();

    for (const d of docs) {
      const locFull = String(d.location || "");
      if (!locFull) continue;

      const pageLoc = locFull.split("#")[0];
      if (!pageLoc) continue;

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

      if (locFull === pageLoc && d.title) entry.title = String(d.title);

      for (const tg of getTagsFromDoc(d)) entry.tags.add(String(tg));
      for (const al of getAliasesFromDoc(d)) entry.aliases.add(String(al));

      const anchor = locFull.includes("#") ? (locFull.split("#")[1] || "").toLowerCase() : "";
      const isNoisy =
        anchor === "prerequisites" || anchor.startsWith("prerequisites-") ||
        anchor === "related-concepts" || anchor.startsWith("related-concepts-");

      if (!isNoisy && d.text) entry.text += " " + stripMathJax(d.text);
    }

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

  // ========== matching ==========
  // term may include multiple words: AND inside a term
  function matchTerm(doc, term) {
    const tks = tokeniseQuery(term);
    if (!tks.length) return false;

    const titleN = normaliseForSearch(doc.title || "");
    const textN = normaliseForSearch(doc.text || "");
    const locN = normaliseForSearch(doc.location || "");
    const tagsN = normaliseForSearch((doc.tags || []).join(" "));
    const aliasesN = normaliseForSearch((doc.aliases || []).join(" "));
    const hay = `${titleN} ${textN} ${locN} ${tagsN} ${aliasesN}`;

    for (const t of tks) {
      if (!hay.includes(t)) return false;
    }
    return true;
  }

  function computeHitsByClause(pageDocs, clauses) {
    const byClause = [];
    const docByLoc = new Map(pageDocs.map(d => [d.location, d]));

    for (let i = 0; i < clauses.length; i++) {
      const c = clauses[i];
      const term = String(c.term || "").trim();
      const hits = [];
      const hitSet = new Set();

      if (term) {
        for (const d of pageDocs) {
          if (matchTerm(d, term)) {
            hits.push(d);
            hitSet.add(d.location);
          }
        }
      }

      byClause.push({
        idx: i,
        clause: c,
        term,
        hits,
        hitSet,
        opToNext: (c.opToNext || "OR").toUpperCase(),
      });
    }

    return { byClause, docByLoc };
  }

  // linear eval from left to right, only enabled clauses participate
  function evaluateLinear(byClause, docByLoc) {
    const enabled = byClause.filter(x => x.clause.enabled && x.term);
    if (!enabled.length) return [];

    let acc = new Set(enabled[0].hitSet);

    for (let k = 1; k < enabled.length; k++) {
      const prev = enabled[k - 1];
      const rhs = enabled[k].hitSet;
      const op = (prev.opToNext || "OR").toUpperCase();

      if (op === "AND") {
        const next = new Set();
        for (const x of acc) if (rhs.has(x)) next.add(x);
        acc = next;
      } else {
        for (const x of rhs) acc.add(x);
      }
    }

    const out = [];
    for (const loc of acc) {
      const d = docByLoc.get(loc);
      if (d) out.push(d);
    }
    return out;
  }

  // ========== selection & random ==========
  const STORAGE_KEY = "customRandomState.v2";

  function loadStateFromStorage() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveStateToStorage(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function countSelected(union, selectedMap) {
    let n = 0;
    for (const d of union) if (selectedMap[d.location]) n++;
    return n;
  }

  function pickRandomSelected(union, selectedMap) {
    const pool = union.filter(d => !!selectedMap[d.location]);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ========== UI binding ==========
  function bindSearchFormToAddClause(state, rerender) {
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    if (!form || !input) return;

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const v = (input.value || "").trim();
      if (!v) return;

      state.clauses.push({
        enabled: true,
        term: v,
        opToNext: "OR",
      });

      input.value = "";

      const params = new URLSearchParams(window.location.search);
      params.delete("q");
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

      rerender();
    });
  }

  // ========== render ==========
  function render(container, state) {
    const scopeInfo = state.scope ? `<span class="sr-chip">scope: ${escapeHtml(state.scope)}</span>` : "";
    const unionCount = state.union.length;
    const selectedCount = countSelected(state.union, state.selectedMap);

    const clauseRows = state.byClause.length
      ? state.byClause.map((row) => {
          const i = row.idx;
          const c = row.clause;
          const term = row.term;
          const enabledChecked = c.enabled ? "checked" : "";
          const opDisabled = (i === state.byClause.length - 1) ? "disabled" : "";
          const opValue = (c.opToNext || "OR").toUpperCase();

          return `
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:6px 0;border-bottom:1px solid var(--md-default-fg-color--lightest);">
              <label style="display:flex;align-items:center;gap:6px;min-width:92px;">
                <input type="checkbox" data-clause-enabled="${i}" ${enabledChecked}/>
                <span style="opacity:.85">Use</span>
              </label>

              <input
                data-clause-term="${i}"
                value="${escapeHtml(term)}"
                placeholder="keyword, tag, or course code"
                style="flex:1;min-width:220px;padding:6px 10px;border:1px solid var(--md-default-fg-color--lightest);border-radius:10px;background:var(--md-default-bg-color);"
              />

              <select data-clause-op="${i}" ${opDisabled}
                style="padding:6px 10px;border:1px solid var(--md-default-fg-color--lightest);border-radius:10px;background:var(--md-default-bg-color);">
                <option value="AND" ${opValue === "AND" ? "selected" : ""}>AND</option>
                <option value="OR" ${opValue === "OR" ? "selected" : ""}>OR</option>
              </select>

              <button class="md-button" data-clause-del="${i}" style="min-width:auto;padding:4px 10px;">Delete</button>

              <span style="opacity:.7">hits: ${row.hits.length}</span>
            </div>
          `;
        }).join("")
      : `<div style="opacity:.7;padding:8px 0;">No tokens yet. Use the search bar above to add one.</div>`;

    const topInfo = `
      <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        ${scopeInfo}
        <span style="opacity:.85">result: <strong>${unionCount}</strong></span>
        <span style="opacity:.85">selected: <strong>${selectedCount}</strong></span>
      </div>
    `;

    const combinedList = state.union.map(d => {
      const href = toAbsoluteUrl(d.location);
      const course = courseLabelFromLocation(d.location);
      const checked = state.selectedMap[d.location] ? "checked" : "";
      return `
        <article style="padding:8px 0;border-bottom:1px solid var(--md-default-fg-color--lightest);">
          <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
            <div style="display:flex;gap:10px;align-items:center;min-width:260px;flex:1">
              <input type="checkbox" data-select-loc="${escapeHtml(d.location)}" ${checked} />
              <a href="${href}" style="text-decoration:none">${escapeHtml(d.title || "Untitled")}</a>
            </div>
            ${course ? `<span class="sr-chip">${escapeHtml(course)}</span>` : ""}
          </div>
        </article>
      `;
    }).join("");

    // ✅ controls moved into Combined results
    const combinedSection = state.byClause.length ? `
      <details open style="margin-top:14px">
        <summary style="cursor:pointer">
          <strong>Combined results</strong>
          <span style="opacity:.7">(${state.union.length})</span>
          <span class="sr-chip">pool</span>
        </summary>

        <div style="margin:10px 0;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <label style="display:flex;align-items:center;gap:8px;opacity:.9">
            <input type="checkbox" id="sf-selftest" ${state.selfTest ? "checked" : ""}/>
            Self-test mode (fold sections)
          </label>

          <button id="cr-random" class="md-button md-button--primary" ${selectedCount ? "" : "disabled"}>
            Start random
          </button>
          <button id="cr-select-all" class="md-button" ${unionCount ? "" : "disabled"}>Select all</button>
          <button id="cr-select-none" class="md-button" ${unionCount ? "" : "disabled"}>Select none</button>
          <button id="cr-clear-clauses" class="md-button" ${state.byClause.length ? "" : "disabled"}>Clear tokens</button>
        </div>

        <div style="margin-top:8px">
          ${combinedList || `<div style="opacity:.7">No results.</div>`}
        </div>
      </details>
    ` : "";

    const resultSections = combinedSection;

    container.innerHTML = `
      <div class="sr-top">
        <div class="sr-top__title">Find</div>

        <div style="margin-top:10px;">
          <div style="opacity:.85;margin-bottom:6px;">Keywords & rules</div>
          <div id="clause-editor">${clauseRows}</div>
          ${topInfo}
        </div>
      </div>

      <div class="sr-list" style="margin-top:12px">
        ${state.byClause.length ? resultSections : `<div class="sr-empty"><p>Add a token to see results.</p></div>`}
      </div>
    `;

    // ===== bind: self-test toggle (preference) =====
    const cbSelf = container.querySelector("#sf-selftest");
    if (cbSelf) cbSelf.addEventListener("change", () => {
      state.selfTest = cbSelf.checked;
      try {
        if (state.selfTest) sessionStorage.setItem("random_review_mode_v1", "1");
        else sessionStorage.removeItem("random_review_mode_v1");
      } catch (_) {}
      saveStateToStorage({
        scope: state.scope,
        clauses: state.clauses,
        selectedMap: state.selectedMap,
        unionLocations: state.union.map(d => d.location),
        selfTest: state.selfTest,
      });
    });

    // clause enabled
    container.querySelectorAll('input[type="checkbox"][data-clause-enabled]').forEach(cb => {
      cb.addEventListener("change", () => {
        const i = Number(cb.getAttribute("data-clause-enabled"));
        if (!Number.isFinite(i) || !state.clauses[i]) return;
        state.clauses[i].enabled = cb.checked;
        rerender(container, state);
      });
    });

    // clause term (input)
    container.querySelectorAll('input[data-clause-term]').forEach(inp => {
      inp.addEventListener("input", () => {
        const i = Number(inp.getAttribute("data-clause-term"));
        if (!Number.isFinite(i) || !state.clauses[i]) return;
        state.clauses[i].term = inp.value;
      });
      inp.addEventListener("change", () => {
        rerender(container, state);
      });
      inp.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          rerender(container, state);
        }
      });
    });

    // clause op
    container.querySelectorAll("select[data-clause-op]").forEach(sel => {
      sel.addEventListener("change", () => {
        const i = Number(sel.getAttribute("data-clause-op"));
        if (!Number.isFinite(i) || !state.clauses[i]) return;
        state.clauses[i].opToNext = sel.value;
        rerender(container, state);
      });
    });

    // clause delete
    container.querySelectorAll("button[data-clause-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-clause-del"));
        if (!Number.isFinite(i)) return;
        state.clauses.splice(i, 1);
        rerender(container, state);
      });
    });

    // per-item checkbox selection
    container.querySelectorAll('input[type="checkbox"][data-select-loc]').forEach(cb => {
      cb.addEventListener("change", () => {
        const loc = cb.getAttribute("data-select-loc");
        state.selectedMap[loc] = cb.checked;
        rerender(container, state);
      });
    });

    // select all/none
    const btnAll = container.querySelector("#cr-select-all");
    if (btnAll) btnAll.addEventListener("click", () => {
      for (const d of state.union) state.selectedMap[d.location] = true;
      rerender(container, state);
    });

    const btnNone = container.querySelector("#cr-select-none");
    if (btnNone) btnNone.addEventListener("click", () => {
      for (const d of state.union) state.selectedMap[d.location] = false;
      rerender(container, state);
    });

    // clear clauses
    const btnClear = container.querySelector("#cr-clear-clauses");
    if (btnClear) btnClear.addEventListener("click", () => {
      state.clauses = [];
      rerender(container, state);
    });

    // random
    const btnRandom = container.querySelector("#cr-random");
    if (btnRandom) btnRandom.addEventListener("click", () => {
      const picked = pickRandomSelected(state.union, state.selectedMap);
      if (!picked) return;

      // self-test flags for random-fold.js
      try {
        if (state.selfTest) {
          sessionStorage.setItem("random_review_mode_v1", "1");
          sessionStorage.setItem("random_review_nav_flag_v1", "1");
        } else {
          sessionStorage.removeItem("random_review_mode_v1");
          sessionStorage.removeItem("random_review_nav_flag_v1");
        }
      } catch (_) {}

      // legacy keys for custom-random-banner.js
      const CANDS_KEY = "random_custom_candidates_v1";
      const ENTRY_KEY = "random_custom_page_v1";
      const TOKENS_KEY = "random_custom_tokens_v1";
      const TOKENMAP_KEY = "random_custom_token_map_v1";
      const NAV_FLAG_KEY = "random_custom_nav_flag_v1";

      try {
        sessionStorage.setItem(NAV_FLAG_KEY, "1");
        sessionStorage.setItem(ENTRY_KEY, window.location.href);
        sessionStorage.setItem(CANDS_KEY, JSON.stringify(state.union.map(d => d.location)));

        const tokens = state.byClause
          .filter(r => r.clause.enabled && r.term)
          .map(r => r.term);
        sessionStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

        const tokenMap = {};
        for (const r of state.byClause) {
          if (!r.clause.enabled || !r.term) continue;
          tokenMap[r.term] = Array.from(r.hitSet);
        }
        sessionStorage.setItem(TOKENMAP_KEY, JSON.stringify(tokenMap));
      } catch (_) {}

      // persist v2 state
      saveStateToStorage({
        scope: state.scope,
        clauses: state.clauses,
        selectedMap: state.selectedMap,
        unionLocations: state.union.map(d => d.location),
        selfTest: state.selfTest,
      });

      window.location.assign(toAbsoluteUrl(picked.location));
    });

    // persist (keep it cheap, only basic state)
    saveStateToStorage({
      scope: state.scope,
      clauses: state.clauses,
      selectedMap: state.selectedMap,
      unionLocations: state.union.map(d => d.location),
      selfTest: state.selfTest,
    });
  }

  function rerender(container, state) {
    let docs = state.pageDocs;
    if (state.scope) {
      const scopePrefix = normaliseScope(state.scope);
      docs = docs.filter(d => String(d.location || "").replace(/^\/+/, "").startsWith(scopePrefix));
    }

    const computed = computeHitsByClause(docs, state.clauses);
    state.byClause = computed.byClause;

    state.union = evaluateLinear(state.byClause, computed.docByLoc);

    for (const d of state.union) {
      if (state.selectedMap[d.location] === undefined) state.selectedMap[d.location] = true;
    }

    render(container, state);
  }

  async function main() {
    if (!isOnFindPage()) return;
    document.body.classList.add("find-tool-page");

    closeMaterialSearchOverlay();

    const container = document.getElementById("search-results");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const q = (params.get("q") || "").trim();
    const scope = normaliseScope(params.get("scope") || "");

    const indexJson = await loadIndex();
    const docs = (indexJson && indexJson.docs) ? indexJson.docs : [];
    const pageDocs = aggregateDocsToPages(docs);

    const restored = loadStateFromStorage();

    const state = {
      pageDocs,
      scope: scope || (restored && restored.scope) || "",
      clauses: [],
      byClause: [],
      union: [],
      selectedMap: {},
      selfTest: false,
    };

    // read self-test preference
    try {
      state.selfTest =
        (restored && restored.selfTest === true) ||
        sessionStorage.getItem("random_review_mode_v1") === "1";
    } catch (_) {
      state.selfTest = (restored && restored.selfTest === true) || false;
    }

    // new query if q exists
    if (q) {
      state.clauses = [{ enabled: true, term: q, opToNext: "OR" }];
      state.selectedMap = {};
    } else {
      state.clauses = (restored && Array.isArray(restored.clauses)) ? restored.clauses : [];
      state.selectedMap = (restored && restored.selectedMap) ? restored.selectedMap : {};
    }

    bindSearchFormToAddClause(state, () => rerender(container, state));
    rerender(container, state);
  }

  function init() {
    main().catch(err => console.warn("find unified v2:", err));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("DOMContentSwitch", init);
})();
